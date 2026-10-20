/**
 * HumanQaGameplayWallKickVaultAndBearHugCounterAuditor.js
 * 
 * Human Playtester QA Audit #4: Aerobatic Wall-Kick Vaults & Grapple Reversal Counters.
 * Solves movement rigidity in tight canyon/urban environments by enabling wall-kick rebounds,
 * and eliminates helplessness during enemy grapple/bear-hug states with high-impact reversal QTEs.
 */

export class HumanQaGameplayWallKickVaultAndBearHugCounterAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.wallKickImpulse=7.5]
   * @param {number} [options.maxWallDetectionDistanceM=1.8]
   */
  constructor(options = {}) {
    this.wallKickImpulse = options.wallKickImpulse || 7.5;
    this.maxWallDetectionDistanceM = options.maxWallDetectionDistanceM || 1.8;

    this.wallKicksPerformed = 0;
    this.inGrappleClinch = false;
    this.grappleStruggleAccumulator = 0;
    this.grappleBreakThreshold = 100;
    this.grappleTimerMs = 0;
  }

  /**
   * Evaluates whether the hunter is positioned to perform an aerobatic wall kick.
   * @param {boolean} isAirborne
   * @param {{x: number, y: number, z: number}} wallNormal
   * @param {number} distanceToWallM
   * @returns {Object} Eligibility analysis
   */
  evaluateWallKickEligibility(isAirborne = true, wallNormal = { x: 0, y: 0, z: 1 }, distanceToWallM = 1.2) {
    if (!isAirborne) {
      return { eligible: false, reason: 'NOT_AIRBORNE' };
    }

    if (distanceToWallM > this.maxWallDetectionDistanceM) {
      return { eligible: false, reason: 'WALL_TOO_FAR' };
    }

    // Check if wall normal has sufficient verticality (not floor or ceiling)
    const horizontalMagnitude = Math.hypot(wallNormal.x, wallNormal.z);
    if (horizontalMagnitude < 0.6) {
      return { eligible: false, reason: 'SURFACE_NOT_VERTICAL' };
    }

    return {
      eligible: true,
      distanceToWallM,
      wallNormal,
      vaultReady: true
    };
  }

  /**
   * Executes the high-impulse wall-kick rebound leap.
   * @param {{x: number, y: number, z: number}} wallNormal
   * @param {{x: number, y: number}} [desiredDirection]
   * @returns {Object} Leap trajectory vectors
   */
  executeWallKick(wallNormal = { x: 0, y: 0, z: 1 }, desiredDirection = { x: 0, y: 1 }) {
    this.wallKicksPerformed++;

    // Calculate rebound velocity: pushes away from wall + upward boost
    const reboundHorizontalX = wallNormal.x * 0.7 + (desiredDirection.x || 0) * 0.3;
    const reboundHorizontalZ = wallNormal.z * 0.7 + (desiredDirection.y || 0) * 0.3;
    const verticalBoost = 4.8; // Vertical lift in meters/sec

    const velocityVector = {
      x: +(reboundHorizontalX * this.wallKickImpulse).toFixed(2),
      y: verticalBoost,
      z: +(reboundHorizontalZ * this.wallKickImpulse).toFixed(2)
    };

    return {
      success: true,
      velocityVector,
      verticalBoostMps: verticalBoost,
      airDodgeReset: true,
      wallKicksPerformed: this.wallKicksPerformed
    };
  }

  /**
   * Starts an enemy grapple/bear-hug state.
   * @param {string} attackerType - 'GRIZZLY', 'PRAETORIAN_ALIEN', 'OWLF_COMMANDO'
   */
  startGrappleState(attackerType = 'GRIZZLY') {
    this.inGrappleClinch = true;
    this.grappleStruggleAccumulator = 0;
    this.grappleTimerMs = 0;
    this.currentAttackerType = attackerType;

    return {
      inGrappleClinch: true,
      attackerType,
      grappleBreakThreshold: this.grappleBreakThreshold
    };
  }

  /**
   * Processes a rapid struggle input (button press or direction flick).
   * @param {number} inputDeltaMs - Time since previous input
   * @returns {Object} Struggle state and counter result
   */
  processGrappleStruggleInput(inputDeltaMs = 120) {
    if (!this.inGrappleClinch) {
      return { inGrappleClinch: false, counterExecuted: false };
    }

    this.grappleTimerMs += inputDeltaMs;
    // Faster inputs generate higher struggle impulse
    const struggleIncrement = Math.max(10, Math.min(35, Math.round(2500 / Math.max(50, inputDeltaMs))));
    this.grappleStruggleAccumulator += struggleIncrement;

    if (this.grappleStruggleAccumulator >= this.grappleBreakThreshold) {
      this.inGrappleClinch = false;
      const isRapidReversal = this.grappleTimerMs <= 1500;
      const counterDamage = isRapidReversal ? 75 : 35;

      return {
        counterExecuted: true,
        isRapidReversal,
        counterDamage,
        counterMove: isRapidReversal ? 'ELBOW_CRUSH_REVERSAL' : 'STRUGGLE_BREAKAWAY',
        struggleDurationMs: this.grappleTimerMs,
        inGrappleClinch: false
      };
    }

    return {
      counterExecuted: false,
      progressPercentage: Math.min(100, Math.round((this.grappleStruggleAccumulator / this.grappleBreakThreshold) * 100)),
      inGrappleClinch: true,
      struggleDurationMs: this.grappleTimerMs
    };
  }

  /**
   * Returns acrobatic movement diagnostics.
   * @returns {Object}
   */
  getMovementAcrobaticsState() {
    return {
      wallKicksPerformed: this.wallKicksPerformed,
      inGrappleClinch: this.inGrappleClinch,
      grappleStruggleAccumulator: this.grappleStruggleAccumulator,
      grappleTimerMs: this.grappleTimerMs
    };
  }
}
