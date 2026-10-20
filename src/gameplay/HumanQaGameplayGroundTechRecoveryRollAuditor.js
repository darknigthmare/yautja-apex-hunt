/**
 * HumanQaGameplayGroundTechRecoveryRollAuditor.js
 * 
 * Human Playtester QA Audit #4: Ground Tech Recovery Roll & Knockdown Reversal.
 * Eliminates sluggish 1.8-second immobilized knockdown states following Xenomorph Queen tail sweeps
 * or Berserker tackles by introducing a responsive 300 ms Ground Tech timing window with i-frames.
 */

export class HumanQaGameplayGroundTechRecoveryRollAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.techWindowMs=300]
   * @param {number} [options.invulnerabilityDurationMs=250]
   */
  constructor(options = {}) {
    this.techWindowMs = options.techWindowMs || 300;
    this.invulnerabilityDurationMs = options.invulnerabilityDurationMs || 250;

    this.isKnockedDown = false;
    this.groundTouchTimestampMs = 0;
    this.techExecuted = false;
    this.invulnerableUntilMs = 0;
    this.successfulTechCount = 0;
  }

  /**
   * Initiates a violent knockdown impact (e.g. Queen tail sweep, Grizzly tackle).
   * @param {number} knockbackForceN
   * @param {number} [airHangTimeMs=600]
   * @returns {Object} Knockdown telemetry
   */
  startKnockdownState(knockbackForceN = 4500, airHangTimeMs = 600) {
    this.isKnockedDown = true;
    this.techExecuted = false;
    const now = Date.now();
    this.groundTouchTimestampMs = now + airHangTimeMs;

    return {
      isKnockedDown: true,
      knockbackForceN,
      groundTouchTimestampMs: this.groundTouchTimestampMs,
      techWindowMs: this.techWindowMs,
      recoveryPromptActive: true
    };
  }

  /**
   * Attempts a reflexive tech roll upon impacting the floor.
   * @param {number} inputTimestampMs - Timing of player roll input
   * @param {{x: number, z: number}} [rollDirectionVector] - Directional impulse
   * @returns {Object} Tech outcome
   */
  attemptTechRecoveryRoll(inputTimestampMs, rollDirectionVector = { x: 0, z: 1 }) {
    if (!this.isKnockedDown) {
      return { success: false, reason: 'NOT_KNOCKED_DOWN' };
    }

    const deltaMs = inputTimestampMs - this.groundTouchTimestampMs;
    // Valid timing: within -50 ms (buffer) to +techWindowMs after floor contact
    const isValidTiming = deltaMs >= -50 && deltaMs <= this.techWindowMs;

    if (isValidTiming) {
      this.isKnockedDown = false;
      this.techExecuted = true;
      this.successfulTechCount++;
      this.invulnerableUntilMs = inputTimestampMs + this.invulnerabilityDurationMs;

      const rollVelocityMps = 8.5; // High-velocity evasive roll
      const trajectory = {
        x: +(rollDirectionVector.x * rollVelocityMps).toFixed(2),
        y: 0.2, // Low ground profile
        z: +(rollDirectionVector.z * rollVelocityMps).toFixed(2)
      };

      return {
        success: true,
        quality: deltaMs <= 100 ? 'PERFECT_TECH' : 'STANDARD_TECH',
        deltaMs,
        trajectory,
        invulnerableDurationMs: this.invulnerabilityDurationMs,
        riposteWindowOpen: true
      };
    }

    // Failed tech: hard knockdown with full recovery animation delay
    return {
      success: false,
      reason: deltaMs < -50 ? 'TOO_EARLY' : 'TOO_LATE',
      deltaMs,
      hardKnockdownPenaltyMs: 1400
    };
  }

  /**
   * Checks whether the hunter is currently in an invulnerability frame state.
   * @param {number} currentTimestampMs
   * @returns {boolean}
   */
  isInvulnerable(currentTimestampMs = Date.now()) {
    return currentTimestampMs <= this.invulnerableUntilMs;
  }

  /**
   * Returns current recovery auditor state.
   * @returns {Object}
   */
  getRecoveryState() {
    return {
      isKnockedDown: this.isKnockedDown,
      techExecuted: this.techExecuted,
      groundTouchTimestampMs: this.groundTouchTimestampMs,
      invulnerableUntilMs: this.invulnerableUntilMs,
      successfulTechCount: this.successfulTechCount
    };
  }
}
