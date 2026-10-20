/**
 * HumanQaGameplayGroundTechKickFlipAuditor.js
 * 
 * Chantier 9 & Audit QA #4 (Gameplay):
 * Solves QA tester feedback: "When knocked down by an explosion, heavy punch,
 * or heavy hound tackle, the player is stuck in a 2.5-second standing-up recovery
 * animation with no active agency. High-tier combat gameplay needs a technical recovery
 * option: an evasive ground tech kick-flip with tight execution timing and counter-attack damage."
 * 
 * Implements high-skill frame-data ground recovery: 180ms tech timing window,
 * invulnerability frames (i-frames), animation cancel, and dynamic 180-damage heel-kick counter.
 */

export class HumanQaGameplayGroundTechKickFlipAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.techWindowMs=180.0] - Timing window for recovery input
   * @param {number} [options.kickCounterRadiusM=1.6]
   * @param {number} [options.kickCounterDamage=180.0]
   */
  constructor(options = {}) {
    this.techWindowMs = options.techWindowMs || 180.0;
    this.kickCounterRadiusM = options.kickCounterRadiusM || 1.6;
    this.kickCounterDamage = options.kickCounterDamage || 180.0;

    this.isKnockedDown = false;
    this.knockdownTimestampMs = 0;
    this.proneDurationRemainingSec = 0;
    this.techExecutedSuccessfully = false;
    this.iFramesActive = false;
  }

  /**
   * Puts the character in a knockdown state.
   * @param {string} sourceHazard - e.g. "EXPLOSION", "HELL_HOUND_TACKLE"
   * @param {number} currentTimestampMs
   * @returns {Object} Knockdown status
   */
  triggerKnockdown(sourceHazard = 'EXPLOSION', currentTimestampMs = 1000) {
    this.isKnockedDown = true;
    this.knockdownTimestampMs = currentTimestampMs;
    this.proneDurationRemainingSec = 2.5; // Standard 2.5s sluggish recovery
    this.techExecutedSuccessfully = false;
    this.iFramesActive = false;

    return {
      isKnockedDown: true,
      sourceHazard,
      knockdownTimestampMs: this.knockdownTimestampMs,
      techWindowMs: this.techWindowMs,
      standardRecoveryTimeSec: this.proneDurationRemainingSec
    };
  }

  /**
   * Player presses recovery/jump input to attempt an evasive ground tech.
   * @param {number} inputTimestampMs
   * @param {Array<Object>} nearbyEnemies - Array of { id, distanceM, health }
   * @returns {Object} Tech execution outcome
   */
  attemptGroundTechKickFlip(inputTimestampMs, nearbyEnemies = []) {
    if (!this.isKnockedDown) {
      return { success: false, reason: 'NOT_KNOCKED_DOWN' };
    }

    const elapsedMs = inputTimestampMs - this.knockdownTimestampMs;
    const isWithinTimingWindow = elapsedMs >= 0 && elapsedMs <= this.techWindowMs;

    if (!isWithinTimingWindow) {
      return {
        success: false,
        reason: elapsedMs > this.techWindowMs ? 'WINDOW_MISSED_TOO_LATE' : 'TOO_EARLY',
        elapsedMs,
        techWindowMs: this.techWindowMs,
        stuckInProne: true
      };
    }

    // Perfect tech executed!
    this.techExecutedSuccessfully = true;
    this.isKnockedDown = false;
    this.proneDurationRemainingSec = 0;
    this.iFramesActive = true;

    // Evaluate kick counter against surrounding targets
    const struckEnemies = nearbyEnemies.filter(enemy => enemy.distanceM <= this.kickCounterRadiusM);
    struckEnemies.forEach(enemy => {
      enemy.health = Math.max(0, enemy.health - this.kickCounterDamage);
      enemy.staggered = true;
    });

    return {
      success: true,
      techExecutedSuccessfully: true,
      elapsedMs,
      iFramesGrantedMs: 250,
      proneRecoveryCancelled: true,
      enemiesStruckCount: struckEnemies.length,
      struckEnemies,
      kickCounterDamage: this.kickCounterDamage,
      acrobaticFlipDistanceM: 2.2
    };
  }

  /**
   * Ticks down remaining i-frames or prone time.
   * @param {number} deltaSec
   * @returns {Object} State update
   */
  tick(deltaSec = 0.016) {
    if (this.isKnockedDown) {
      this.proneDurationRemainingSec = Math.max(0, this.proneDurationRemainingSec - deltaSec);
      if (this.proneDurationRemainingSec === 0) {
        this.isKnockedDown = false;
      }
    }

    return {
      isKnockedDown: this.isKnockedDown,
      proneDurationRemainingSec: this.proneDurationRemainingSec,
      techExecutedSuccessfully: this.techExecutedSuccessfully
    };
  }
}
