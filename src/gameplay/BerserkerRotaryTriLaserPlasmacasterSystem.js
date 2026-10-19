/**
 * BerserkerRotaryTriLaserPlasmacasterSystem.js
 * Chantier 3 (v149) : Canon d'épaule rotatif à barrage tri-laser (Predators 2010 — Berserker / Mr. Black).
 * Variante Super Predator du Plasmacaster dotée d'un barillet rotatif motorisé :
 * - Verrouillage simultané jusqu'à 3 cibles distinctes via le viseur tri-laser du masque à mâchoire osseuse.
 * - Tir de barrage rapide en rafale infligeant des dégâts de souffle et renversant les cibles.
 * - Montée rapide en chaleur du noyau nécessitant une purge thermique en cas de surchauffe.
 */

export class BerserkerRotaryTriLaserPlasmacasterSystem {
  constructor(options = {}) {
    this.maxSimultaneousLocks = options.maxSimultaneousLocks ?? 3;
    this.damagePerSalvoBolt = options.damagePerSalvoBolt ?? 88;
    this.heatPerBolt = options.heatPerBolt ?? 26;
    this.overheatThreshold = options.overheatThreshold ?? 100;
    this.coolingRatePerSecond = options.coolingRatePerSecond ?? 22;

    this.state = {
      rotarySpunUp: false,
      lockedTargetIds: [],
      coreHeat: 0,
      overheated: false,
      totalSalvosFired: 0,
      totalBoltsDischarged: 0
    };
  }

  acquireTriLaserLocks(candidates = [], audioSynthesizer = null) {
    if (this.state.overheated) {
      return { locked: false, reason: 'core_overheated' };
    }

    this.state.rotarySpunUp = true;
    this.state.lockedTargetIds = candidates
      .slice(0, this.maxSimultaneousLocks)
      .map((c, idx) => c.id ?? `target_${idx}`);

    if (audioSynthesizer && typeof audioSynthesizer.playBerserkerRotaryPlasmacasterSpin === 'function') {
      audioSynthesizer.playBerserkerRotaryPlasmacasterSpin(1.0);
    }

    return {
      locked: this.state.lockedTargetIds.length > 0,
      lockedTargetIds: [...this.state.lockedTargetIds],
      rotarySpunUp: this.state.rotarySpunUp
    };
  }

  fireRotarySalvoBarrage(targets = [], availableEnergy = 100, audioSynthesizer = null) {
    if (this.state.overheated) {
      return { fired: false, reason: 'core_overheated' };
    }
    if (targets.length === 0) {
      return { fired: false, reason: 'no_targets' };
    }

    const salvoTargets = targets.slice(0, this.maxSimultaneousLocks);
    const energyCost = salvoTargets.length * 14;
    if (availableEnergy < energyCost) {
      return { fired: false, reason: 'insufficient_energy', energyRequired: energyCost };
    }

    if (audioSynthesizer && typeof audioSynthesizer.playTriLaserRapidSalvoBlast === 'function') {
      audioSynthesizer.playTriLaserRapidSalvoBlast(1.1);
    }

    const impacts = [];
    for (const target of salvoTargets) {
      target.health = Math.max(0, Number(target.health ?? 120) - this.damagePerSalvoBolt);
      target.knockedBackByBlast = true;
      this.state.coreHeat += this.heatPerBolt;
      this.state.totalBoltsDischarged += 1;

      impacts.push({
        targetId: target.id ?? 'target',
        damageDealt: this.damagePerSalvoBolt,
        remainingHealth: target.health
      });
    }

    this.state.totalSalvosFired += 1;
    if (this.state.coreHeat >= this.overheatThreshold) {
      this.state.overheated = true;
      this.state.rotarySpunUp = false;
    }

    return {
      fired: true,
      energySpent: energyCost,
      boltsFired: impacts.length,
      coreHeat: this.state.coreHeat,
      overheated: this.state.overheated,
      impacts
    };
  }

  update(dt = 0.016) {
    const safeDt = Math.max(0, Number(dt) || 0);
    if (this.state.coreHeat > 0) {
      this.state.coreHeat = Math.max(0, this.state.coreHeat - safeDt * this.coolingRatePerSecond);
      if (this.state.coreHeat <= 35 && this.state.overheated) {
        this.state.overheated = false;
      }
    }
    return this.getStatus();
  }

  getStatus() {
    return {
      rotarySpunUp: this.state.rotarySpunUp,
      lockedTargetIds: [...this.state.lockedTargetIds],
      coreHeat: Math.round(this.state.coreHeat),
      overheated: this.state.overheated,
      totalSalvosFired: this.state.totalSalvosFired,
      totalBoltsDischarged: this.state.totalBoltsDischarged
    };
  }
}
