/**
 * SuperheatedPlasmaEnergyWhipLashSystem.js
 * Chantier 1 (v148) : Fouet plasma énergétique à impulsion thermique (AVP / Extended Clan Lore).
 * Fouet articulé dont les segments s'embrasent d'un arc de plasma bleu-blanc surchauffé :
 * - Frappe balayée à 160° brisant instantanément les boucliers anti-émeutes et blindages lourds.
 * - Surcharge thermique par impulsion le long du câble en cas d'enroulement autour d'une cible.
 * - Effet de fusion d'armure réduisant durablement la résistance balistique et thermique ennemie.
 */

export class SuperheatedPlasmaEnergyWhipLashSystem {
  constructor(options = {}) {
    this.maxReachMeters = options.maxReachMeters ?? 6.8;
    this.sweepArcDegrees = options.sweepArcDegrees ?? 160;
    this.baseSlashDamage = options.baseSlashDamage ?? 78;
    this.thermalPulseDamage = options.thermalPulseDamage ?? 135;
    this.armorMeltReductionRatio = options.armorMeltReductionRatio ?? 0.55;
    this.energyCostPerSlash = options.energyCostPerSlash ?? 16;
    this.energyCostPerPulse = options.energyCostPerPulse ?? 28;
    this.cooldownSeconds = options.cooldownSeconds ?? 1.15;

    this.state = {
      plasmaIgnited: false,
      currentChargeTempKelvin: 300,
      maxPlasmaTempKelvin: 4800,
      cooldownRemaining: 0,
      tetheredTargetId: null,
      totalSlashesExecuted: 0,
      totalShieldsShattered: 0,
      totalThermalPulsesDetonated: 0
    };
  }

  ignitePlasmaCore(availableEnergy = 100, audioSynthesizer = null) {
    if (availableEnergy < 10) {
      return { ignited: false, reason: 'insufficient_energy' };
    }
    this.state.plasmaIgnited = true;
    this.state.currentChargeTempKelvin = this.state.maxPlasmaTempKelvin;

    if (audioSynthesizer && typeof audioSynthesizer.playSuperheatedPlasmaWhipCrack === 'function') {
      audioSynthesizer.playSuperheatedPlasmaWhipCrack(0.8);
    }

    return {
      ignited: true,
      temperatureKelvin: this.state.currentChargeTempKelvin
    };
  }

  executeWidePlasmaSweep(targets = [], availableEnergy = 100, audioSynthesizer = null) {
    if (this.state.cooldownRemaining > 0) {
      return { executed: false, reason: 'on_cooldown', cooldownRemaining: this.state.cooldownRemaining };
    }
    if (availableEnergy < this.energyCostPerSlash) {
      return { executed: false, reason: 'insufficient_energy' };
    }

    this.state.plasmaIgnited = true;
    this.state.currentChargeTempKelvin = this.state.maxPlasmaTempKelvin;
    this.state.cooldownRemaining = this.cooldownSeconds;
    this.state.totalSlashesExecuted += 1;

    if (audioSynthesizer && typeof audioSynthesizer.playSuperheatedPlasmaWhipCrack === 'function') {
      audioSynthesizer.playSuperheatedPlasmaWhipCrack(1.0);
    }

    const hitResults = [];
    const halfArcRad = ((this.sweepArcDegrees * 0.5) * Math.PI) / 180;

    for (const target of targets) {
      const dist = Number(target.distanceMeters ?? 999);
      const angleOffsetRad = Math.abs(Number(target.angleOffsetRadians ?? 0));

      if (dist <= this.maxReachMeters && angleOffsetRad <= halfArcRad) {
        let shieldShattered = false;
        if (target.hasRiotShield || target.hasHeavyBallisticShield) {
          target.hasRiotShield = false;
          target.hasHeavyBallisticShield = false;
          shieldShattered = true;
          this.state.totalShieldsShattered += 1;
        }

        const previousArmor = Number(target.armorRating ?? 100);
        const meltedArmor = Math.max(0, Math.round(previousArmor * (1 - this.armorMeltReductionRatio)));
        target.armorRating = meltedArmor;

        const inflictedDamage = this.baseSlashDamage + (shieldShattered ? 32 : 0);
        target.health = Math.max(0, Number(target.health ?? 100) - inflictedDamage);

        if (audioSynthesizer && typeof audioSynthesizer.playPlasmaWhipArmorMeltSizzle === 'function') {
          audioSynthesizer.playPlasmaWhipArmorMeltSizzle(1.0);
        }

        hitResults.push({
          targetId: target.id ?? 'unknown',
          damageDealt: inflictedDamage,
          shieldShattered,
          remainingArmor: meltedArmor,
          remainingHealth: target.health
        });
      }
    }

    return {
      executed: true,
      energySpent: this.energyCostPerSlash,
      targetsHitCount: hitResults.length,
      hitResults
    };
  }

  triggerCoiledThermalPulse(target = null, availableEnergy = 100, audioSynthesizer = null) {
    if (!target) {
      return { triggered: false, reason: 'no_target' };
    }
    const dist = Number(target.distanceMeters ?? 999);
    if (dist > this.maxReachMeters) {
      return { triggered: false, reason: 'out_of_reach' };
    }
    if (availableEnergy < this.energyCostPerPulse) {
      return { triggered: false, reason: 'insufficient_energy' };
    }

    this.state.tetheredTargetId = target.id ?? 'coiled_target';
    this.state.totalThermalPulsesDetonated += 1;
    this.state.cooldownRemaining = this.cooldownSeconds * 1.35;

    target.armorRating = 0;
    target.health = Math.max(0, Number(target.health ?? 150) - this.thermalPulseDamage);
    target.thermallySevered = target.health === 0;

    if (audioSynthesizer) {
      if (typeof audioSynthesizer.playSuperheatedPlasmaWhipCrack === 'function') {
        audioSynthesizer.playSuperheatedPlasmaWhipCrack(1.25);
      }
      if (typeof audioSynthesizer.playPlasmaWhipArmorMeltSizzle === 'function') {
        audioSynthesizer.playPlasmaWhipArmorMeltSizzle(1.2);
      }
    }

    return {
      triggered: true,
      targetId: this.state.tetheredTargetId,
      energySpent: this.energyCostPerPulse,
      damageDealt: this.thermalPulseDamage,
      armorMeltedToZero: true,
      thermallySevered: target.thermallySevered
    };
  }

  update(dt = 0.016) {
    const safeDt = Math.max(0, Number(dt) || 0);
    if (this.state.cooldownRemaining > 0) {
      this.state.cooldownRemaining = Math.max(0, this.state.cooldownRemaining - safeDt);
    }
    if (this.state.plasmaIgnited && this.state.cooldownRemaining === 0) {
      this.state.currentChargeTempKelvin = Math.max(
        1200,
        this.state.currentChargeTempKelvin - safeDt * 450
      );
    }
    return this.getStatus();
  }

  getStatus() {
    return {
      plasmaIgnited: this.state.plasmaIgnited,
      currentChargeTempKelvin: Math.round(this.state.currentChargeTempKelvin),
      cooldownRemaining: Number(this.state.cooldownRemaining.toFixed(3)),
      totalSlashesExecuted: this.state.totalSlashesExecuted,
      totalShieldsShattered: this.state.totalShieldsShattered,
      totalThermalPulsesDetonated: this.state.totalThermalPulsesDetonated
    };
  }
}
