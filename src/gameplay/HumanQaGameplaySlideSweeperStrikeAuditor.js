/**
 * HumanQaGameplaySlideSweeperStrikeAuditor.js
 * 
 * Human Playtester QA Audit #4: Slide Sweeper Combistick Low-Profile Strike.
 * Bridges the gap between high-speed evasive ground sliding and fluid melee combat:
 * enables a dynamic transition from crouching ground slides directly into a sweeping leg trip
 * with the Combistick/Naginata, unbalancing armored targets and creating follow-up finisher windows.
 */

export class HumanQaGameplaySlideSweeperStrikeAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.slideFrictionCoeff=0.88]
   * @param {number} [options.sweeperReachMeters=2.6]
   */
  constructor(options = {}) {
    this.slideFrictionCoeff = options.slideFrictionCoeff || 0.88;
    this.sweeperReachMeters = options.sweeperReachMeters || 2.6;

    this.isSliding = false;
    this.slideVelocityMps = 0.0;
    this.sweeperExecuted = false;
    this.totalTrippedEnemies = 0;
  }

  /**
   * Initiates an evasive ground slide from high-speed sprinting.
   * @param {number} sprintSpeedMps - 6.0 to 11.0 m/s
   * @returns {Object} Slide telemetry
   */
  initiateGroundSlide(sprintSpeedMps = 8.5) {
    if (sprintSpeedMps < 4.0) {
      return { sliding: false, reason: 'INSUFFICIENT_MOMENTUM' };
    }

    this.isSliding = true;
    this.slideVelocityMps = sprintSpeedMps;
    this.sweeperExecuted = false;

    return {
      sliding: true,
      slideVelocityMps: this.slideVelocityMps,
      lowProfileCoverActive: true,
      sweepWindowOpen: true
    };
  }

  /**
   * Executes the low-profile Combistick sweep attack while sliding.
   * @param {Object} targetEnemy
   * @param {number} [targetEnemy.distanceM=1.8]
   * @param {number} [targetEnemy.massKg=95]
   * @returns {Object} Sweep attack outcome
   */
  executeSlideSweeperStrike(targetEnemy = { distanceM: 1.8, massKg: 95 }) {
    if (!this.isSliding) {
      return { success: false, reason: 'NOT_IN_SLIDE_STATE' };
    }

    const dist = Number(targetEnemy.distanceM) || 1.8;
    if (dist > this.sweeperReachMeters) {
      return { success: false, reason: 'TARGET_OUT_OF_SWEEP_RANGE', distanceM: dist };
    }

    this.sweeperExecuted = true;
    this.totalTrippedEnemies++;

    const baseDamage = 65;
    const kineticBonus = Math.round(this.slideVelocityMps * 4.5);
    const totalDamage = baseDamage + kineticBonus;

    // Heavy targets (>250kg) might stagger rather than full trip
    const fullTrip = (targetEnemy.massKg || 95) <= 250;

    return {
      success: true,
      targetTripped: fullTrip,
      targetStaggered: !fullTrip,
      totalDamage,
      kineticBonus,
      followUpFinisherWindowOpen: true,
      slideVelocityMps: this.slideVelocityMps
    };
  }

  /**
   * Decelerates the slide over time through ground friction.
   * @param {number} deltaSec
   * @returns {Object} Slide condition
   */
  processSlideDeceleration(deltaSec = 0.1) {
    if (!this.isSliding) {
      return { isSliding: false, slideVelocityMps: 0 };
    }

    this.slideVelocityMps = Math.max(0, +(this.slideVelocityMps * Math.pow(this.slideFrictionCoeff, deltaSec * 10)).toFixed(2));
    if (this.slideVelocityMps <= 1.0) {
      this.isSliding = false;
      this.slideVelocityMps = 0;
    }

    return {
      isSliding: this.isSliding,
      slideVelocityMps: this.slideVelocityMps,
      sweepWindowOpen: this.isSliding && !this.sweeperExecuted
    };
  }

  /**
   * Returns current slide combat state and HUD payload.
   * @returns {Object}
   */
  getSlideCombatState() {
    return {
      isSliding: this.isSliding,
      slideVelocityMps: this.slideVelocityMps,
      sweeperExecuted: this.sweeperExecuted,
      totalTrippedEnemies: this.totalTrippedEnemies,
      cssClass: this.isSliding && !this.sweeperExecuted 
        ? 'slide-sweeper-indicator trip-ready' 
        : 'slide-sweeper-indicator'
    };
  }
}
