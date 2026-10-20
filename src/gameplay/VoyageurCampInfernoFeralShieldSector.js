/**
 * VoyageurCampInfernoFeralShieldSector.js
 * 
 * Prey (2022) - Burning French voyageur trapper camp in the Great Plains forest.
 * Simulates intense forest inferno hazards, flintlock musket volleys from multiple trappers,
 * the Feral Predator's retractable mechanical arm fan shield deployment,
 * and kinetic musket ball ricochets igniting nearby gunpowder kegs.
 */

export class VoyageurCampInfernoFeralShieldSector {
  /**
   * @param {Object} options
   * @param {string} [options.campId='voyageur-camp-inferno-01']
   * @param {number} [options.fireBlazeIntensity=0.8]
   * @param {number} [options.voyageurMusketeersCount=5]
   * @param {boolean} [options.retractableShieldDeployed=false]
   * @param {number} [options.gunpowderKegsCount=3]
   */
  constructor(options = {}) {
    this.campId = options.campId || 'voyageur-camp-inferno-01';
    this.fireBlazeIntensity = options.fireBlazeIntensity !== undefined ? options.fireBlazeIntensity : 0.8;
    this.voyageurMusketeersCount = options.voyageurMusketeersCount !== undefined ? options.voyageurMusketeersCount : 5;
    this.retractableShieldDeployed = options.retractableShieldDeployed !== undefined ? options.retractableShieldDeployed : false;
    this.gunpowderKegsCount = options.gunpowderKegsCount !== undefined ? options.gunpowderKegsCount : 3;

    this.shieldIntegrity = 1.0;
    this.kegsDetonated = 0;
  }

  /**
   * Deploys the mechanical segmented fan-bladed wrist shield.
   * @returns {Object} Shield deployment status
   */
  deployRetractableFanShield() {
    this.retractableShieldDeployed = true;
    return {
      success: true,
      retractableShieldDeployed: true,
      frontalCoverageDegrees: 180,
      ballisticDeflectionChance: 0.98,
      shieldIntegrity: this.shieldIntegrity
    };
  }

  /**
   * Deflects a volley of fired lead musket balls.
   * Deflected shots ricochet into adjacent black powder kegs, triggering chain explosions.
   * @param {number} [musketeersFiringCount]
   * @returns {Object} Deflection and ricochet telemetry
   */
  deflectMusketBallVolley(musketeersFiringCount = this.voyageurMusketeersCount) {
    if (!this.retractableShieldDeployed) {
      // Unshielded: takes heavy ballistic volley damage
      const damageTaken = musketeersFiringCount * 45;
      return {
        deflected: false,
        damageTaken,
        kegsDetonated: 0,
        reason: 'SHIELD_NOT_DEPLOYED'
      };
    }

    const ballsBlocked = musketeersFiringCount;
    let newKegsDetonated = 0;

    if (this.gunpowderKegsCount > 0) {
      newKegsDetonated = Math.min(this.gunpowderKegsCount, Math.ceil(musketeersFiringCount / 2));
      this.gunpowderKegsCount -= newKegsDetonated;
      this.kegsDetonated += newKegsDetonated;
    }

    const casualtiesFromExplosion = newKegsDetonated * 2;
    this.voyageurMusketeersCount = Math.max(0, this.voyageurMusketeersCount - casualtiesFromExplosion);

    return {
      deflected: true,
      ballsBlocked,
      damageTaken: 0,
      kegsDetonatedThisVolley: newKegsDetonated,
      totalKegsDetonated: this.kegsDetonated,
      gunpowderExplosionDamage: newKegsDetonated * 350,
      musketeersRemaining: this.voyageurMusketeersCount
    };
  }

  /**
   * Evaluates proximity fire hazard from burning wooden tents and supply crates.
   * @param {number} exposureSec
   * @returns {Object} Thermal burn hazard telemetry
   */
  evaluateCampFireHazard(exposureSec = 1.0) {
    const ambientFlameTempCelsius = Math.round(550 + this.fireBlazeIntensity * 300);
    const thermalRadiationDamagePerSec = Math.round(18 * this.fireBlazeIntensity);
    const totalBurnDamage = Math.round(thermalRadiationDamagePerSec * exposureSec);

    return {
      ambientFlameTempCelsius,
      fireBlazeIntensity: this.fireBlazeIntensity,
      thermalRadiationDamagePerSec,
      totalBurnDamage,
      smokeObscurationLevel: 0.75
    };
  }

  /**
   * Returns current camp inferno condition.
   * @returns {Object}
   */
  getVoyageurCampState() {
    return {
      campId: this.campId,
      fireBlazeIntensity: this.fireBlazeIntensity,
      voyageurMusketeersCount: this.voyageurMusketeersCount,
      retractableShieldDeployed: this.retractableShieldDeployed,
      gunpowderKegsCount: this.gunpowderKegsCount,
      kegsDetonated: this.kegsDetonated
    };
  }
}
