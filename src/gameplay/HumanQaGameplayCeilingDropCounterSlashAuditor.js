/**
 * HumanQaGameplayCeilingDropCounterSlashAuditor.js
 * 
 * Human Playtester QA Audit #4: Ceiling Drop Counter-Slash & Vertical Stealth Assassination.
 * Expands high-verticality rafters and ceiling perching (in subways, slaughterhouses, pyramids)
 * into lethal stealth assassination vectors: calculates gravitational freefall kinetic impact (v = sqrt(2gh)),
 * executes instantaneous dual wristblade downward impalement (350 damage), and cancels landing recovery lag.
 */

export class HumanQaGameplayCeilingDropCounterSlashAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.maxAssassinationDropMeters=12.0]
   * @param {number} [options.gravityMps2=9.81]
   */
  constructor(options = {}) {
    this.maxAssassinationDropMeters = options.maxAssassinationDropMeters || 12.0;
    this.gravityMps2 = options.gravityMps2 || 9.81;

    this.isCeilingPerched = false;
    this.currentPerchHeightMeters = 0.0;
    this.assassinationsCount = 0;
  }

  /**
   * Evaluates eligibility for a vertical drop assassination onto an enemy passing underneath.
   * @param {boolean} isCeilingPerched
   * @param {number} perchHeightMeters
   * @param {{x: number, z: number}} targetPos
   * @param {{x: number, z: number}} hunterPos
   * @returns {Object} Eligibility analysis
   */
  evaluateCeilingDropEligibility(isCeilingPerched = true, perchHeightMeters = 6.5, targetPos = { x: 0, z: 0 }, hunterPos = { x: 0, z: 0 }) {
    this.isCeilingPerched = isCeilingPerched;
    this.currentPerchHeightMeters = perchHeightMeters;

    if (!isCeilingPerched) {
      return { eligible: false, reason: 'NOT_CEILING_PERCHED' };
    }

    if (perchHeightMeters > this.maxAssassinationDropMeters) {
      return { eligible: false, reason: 'PERCH_TOO_HIGH_FOR_DROP' };
    }

    // Horizontal radial alignment (must be within 2.5m cylinder directly underneath)
    const horizontalDistance = Math.hypot(targetPos.x - hunterPos.x, targetPos.z - hunterPos.z);
    const inKillCone = horizontalDistance <= 2.5;

    return {
      eligible: inKillCone,
      horizontalDistance: +horizontalDistance.toFixed(2),
      perchHeightMeters,
      targetInKillCone: inKillCone,
      promptAvailable: inKillCone
    };
  }

  /**
   * Executes the downward ceiling drop dual wristblade assassination slash.
   * @param {Object} targetEntity
   * @param {number} [perchHeightMeters=6.5]
   * @returns {Object} Assassination outcome
   */
  executeCeilingDropCounterSlash(targetEntity = { health: 100 }, perchHeightMeters = this.currentPerchHeightMeters || 6.5) {
    if (!this.isCeilingPerched) {
      return { success: false, reason: 'NOT_CEILING_PERCHED' };
    }

    this.isCeilingPerched = false;
    this.assassinationsCount++;

    // Freefall descent velocity v = sqrt(2 * g * h)
    const impactVelocityMps = +(Math.sqrt(2 * this.gravityMps2 * perchHeightMeters)).toFixed(2);
    const kineticImpactJoules = Math.round(0.5 * 160 * Math.pow(impactVelocityMps, 2)); // ~160kg hunter mass
    const lethalDamage = Math.round(350 + (kineticImpactJoules * 0.02));

    if (targetEntity) {
      targetEntity.health = Math.max(0, (targetEntity.health || 100) - lethalDamage);
    }

    return {
      success: true,
      lethalDamage,
      impactVelocityMps,
      kineticImpactJoules,
      targetKilled: true,
      landingRecoveryLagCancelled: true,
      trophyAvailable: true,
      assassinationsCount: this.assassinationsCount
    };
  }

  /**
   * Returns current ceiling drop assassination telemetry.
   * @returns {Object}
   */
  getCeilingDropTelemetry() {
    return {
      isCeilingPerched: this.isCeilingPerched,
      currentPerchHeightMeters: this.currentPerchHeightMeters,
      assassinationsCount: this.assassinationsCount,
      maxAssassinationDropMeters: this.maxAssassinationDropMeters
    };
  }
}
