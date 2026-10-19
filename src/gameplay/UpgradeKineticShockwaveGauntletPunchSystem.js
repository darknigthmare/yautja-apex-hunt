/**
 * UpgradeKineticShockwaveGauntletPunchSystem.js
 * Chantier 2 (v151) : Gantelet à onde de choc cinétique (Power Punch / Kinetic Fist) (The Predator 2018 / Extended Lore).
 * Propulseur cinétique d'avant-bras libérant une onde de compression directionnelle à l'impact :
 * - Pulvérise les murs destructibles et barricades blindées en un seul coup chargé.
 * - Projette les ennemis en arrière tout en infligeant d'importants dégâts contondants.
 */

export class UpgradeKineticShockwaveGauntletPunchSystem {
  constructor(options = {}) {
    this.maxChargeRatio = 1.0;
    this.baseKineticDamage = options.baseKineticDamage ?? 145;
    this.shockwaveConeRadiusMeters = options.shockwaveConeRadiusMeters ?? 5.2;
    this.energyCostPerPunch = options.energyCostPerPunch ?? 22;

    this.state = {
      currentChargeRatio: 0,
      totalKineticPunchesDelivered: 0,
      totalBarricadesPulverized: 0
    };
  }

  chargeKineticGauntlet(chargeRatio = 1.0, audioSynthesizer = null) {
    this.state.currentChargeRatio = Math.min(1.0, Math.max(0.2, Number(chargeRatio) || 1.0));
    if (audioSynthesizer && typeof audioSynthesizer.playUpgradeKineticGauntletChargeHum === 'function') {
      audioSynthesizer.playUpgradeKineticGauntletChargeHum(this.state.currentChargeRatio);
    }
    return {
      charged: true,
      currentChargeRatio: this.state.currentChargeRatio
    };
  }

  deliverKineticShockwavePunch(targets = [], obstacles = [], availableEnergy = 100, audioSynthesizer = null) {
    if (availableEnergy < this.energyCostPerPunch) {
      return { delivered: false, reason: 'insufficient_energy' };
    }

    const effectiveCharge = Math.max(0.5, this.state.currentChargeRatio || 1.0);
    const damage = Math.round(this.baseKineticDamage * effectiveCharge);
    this.state.currentChargeRatio = 0;
    this.state.totalKineticPunchesDelivered += 1;

    if (audioSynthesizer && typeof audioSynthesizer.playKineticGauntletShockwavePunchBoom === 'function') {
      audioSynthesizer.playKineticGauntletShockwavePunchBoom(1.15);
    }

    const pulverizedObstacleIds = [];
    for (const obs of obstacles) {
      if (!obs.destroyed) {
        obs.destroyed = true;
        pulverizedObstacleIds.push(obs.id ?? 'obstacle');
        this.state.totalBarricadesPulverized += 1;
      }
    }

    const struckTargetIds = [];
    for (const target of targets) {
      const dist = Number(target.distanceMeters ?? 2.5);
      if (dist <= this.shockwaveConeRadiusMeters) {
        target.health = Math.max(0, Number(target.health ?? 120) - damage);
        target.launchedAirborne = true;
        struckTargetIds.push(target.id ?? 'target');
      }
    }

    return {
      delivered: true,
      energySpent: this.energyCostPerPunch,
      damageDealt: damage,
      pulverizedObstacleIds,
      struckTargetIds
    };
  }

  getStatus() {
    return {
      currentChargeRatio: this.state.currentChargeRatio,
      totalKineticPunchesDelivered: this.state.totalKineticPunchesDelivered,
      totalBarricadesPulverized: this.state.totalBarricadesPulverized
    };
  }
}
