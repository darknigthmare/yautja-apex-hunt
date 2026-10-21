/**
 * ValVerdeCounterweightedDeadfallCrushSector.js
 * 
 * Predator (1987) - Val Verde Climactic Counterweighted Log Deadfall & Gauntlet Self-Destruct.
 * Simulates the final confrontation arena inside the hollowed ancient tree funnel:
 * - Suspended 1,200 kg counterweighted crushing oak log held by a taut vine trigger
 * - Severing the vine releases 65,000 Joules of gravitational crush damage, shattering the Jungle Hunter's pelvis
 * - Jungle Hunter activates the wrist gauntlet thermonuclear self-destruct sequence
 * - Sardonic mechanical laughter echoing through the jungle canopy
 * - 10-second countdown glyph sequence forcing a desperate sprint to clear the 35m lethal blast radius.
 */

export class ValVerdeCounterweightedDeadfallCrushSector {
  /**
   * @param {Object} options
   * @param {string} [options.arenaId='val-verde-final-arena-01']
   * @param {number} [options.deadfallLogMassKg=1200.0]
   * @param {number} [options.suspensionDropHeightM=5.5]
   */
  constructor(options = {}) {
    this.arenaId = options.arenaId || 'val-verde-final-arena-01';
    this.deadfallLogMassKg = options.deadfallLogMassKg || 1200.0;
    this.suspensionDropHeightM = options.suspensionDropHeightM || 5.5;

    this.vineTriggerIntact = true;
    this.deadfallDropped = false;
    this.selfDestructActive = false;
    this.selfDestructCountdownSec = 10.0;
    this.sardonicLaughterPlaying = false;
  }

  /**
   * Cuts or releases the vine trigger to drop the 1,200 kg deadfall log onto the enemy.
   * Converts gravitational potential energy into 65,000 Joules of bone-crushing impact.
   * @returns {Object} Deadfall drop telemetry
   */
  releaseCounterweightedDeadfallLog() {
    if (!this.vineTriggerIntact || this.deadfallDropped) {
      return { success: false, reason: 'DEADFALL_ALREADY_RELEASED' };
    }

    this.vineTriggerIntact = false;
    this.deadfallDropped = true;

    const impactVelocityMps = Number(Math.sqrt(2 * 9.81 * this.suspensionDropHeightM).toFixed(2));
    const kineticEnergyJoules = Math.round(0.5 * this.deadfallLogMassKg * impactVelocityMps * impactVelocityMps);
    const crushDamage = 450; // Fatal or crippling blow

    return {
      success: true,
      deadfallLogMassKg: this.deadfallLogMassKg,
      suspensionDropHeightM: this.suspensionDropHeightM,
      impactVelocityMps,
      kineticEnergyJoules,
      crushDamage,
      targetPinnedUnderLog: true,
      groundSeismicThudDb: 108
    };
  }

  /**
   * Initiates the Jungle Hunter's wrist gauntlet self-destruct countdown sequence.
   * Digital countdown glyphs flash red as sardonic recorded laughter echoes through the forest.
   * @returns {Object} Self-destruct initiation telemetry
   */
  activateWristGauntletSelfDestruct() {
    this.selfDestructActive = true;
    this.sardonicLaughterPlaying = true;
    const lethalBlastRadiusM = 35.0;
    const shockwaveVelocityMps = 1850.0;
    const mushroomCloudHeightM = 220.0;

    return {
      selfDestructActive: true,
      countdownDurationSec: this.selfDestructCountdownSec,
      lethalBlastRadiusM,
      shockwaveVelocityMps,
      mushroomCloudHeightM,
      sardonicLaughterPlaying: true,
      glyphFlickerFrequencyHz: 8.0,
      urgentEvacuationRequired: true
    };
  }

  /**
   * Updates the self-destruct countdown timer during the desperate escape sprint.
   * @param {number} deltaSec
   * @param {number} playerDistanceFromEpicenterM
   * @returns {Object} Countdown status telemetry
   */
  updateSelfDestructCountdown(deltaSec = 1.0, playerDistanceFromEpicenterM = 12.0) {
    if (this.selfDestructActive && this.selfDestructCountdownSec > 0) {
      this.selfDestructCountdownSec = Math.max(0, this.selfDestructCountdownSec - deltaSec);
    }

    const detonated = this.selfDestructActive && this.selfDestructCountdownSec <= 0;
    const playerSurvived = detonated ? playerDistanceFromEpicenterM >= 35.0 : true;

    return {
      countdownSecRemaining: Number(this.selfDestructCountdownSec.toFixed(1)),
      detonated,
      playerDistanceFromEpicenterM,
      isOutsideBlastRadius: playerDistanceFromEpicenterM >= 35.0,
      playerSurvived,
      mushroomCloudGenerated: detonated
    };
  }
}
