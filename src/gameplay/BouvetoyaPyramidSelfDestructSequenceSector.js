/**
 * BouvetoyaPyramidSelfDestructSequenceSector.js
 * 
 * Alien vs. Predator (2004) - Bouvet Island subterranean pyramid chamber.
 * Simulates the ritual Yautja thermonuclear micro-fusion self-destruct device on the wrist gauntlet.
 * Models glowing countdown glyphs, core temperature ramp toward supercritical fusion (100,000,000 K),
 * granite vault seismic tremors, and the high-speed sprint toward the whaling station surface elevator.
 */

export class BouvetoyaPyramidSelfDestructSequenceSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='bouvetoya-pyramid-selfdestruct-01']
   * @param {number} [options.countdownSeconds=60.0]
   * @param {number} [options.microFusionCoreKelvin=3500]
   * @param {number} [options.tunnelLengthMeters=180.0]
   * @param {boolean} [options.elevatorWinchFunctional=true]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'bouvetoya-pyramid-selfdestruct-01';
    this.countdownSeconds = options.countdownSeconds !== undefined ? options.countdownSeconds : 60.0;
    this.microFusionCoreKelvin = options.microFusionCoreKelvin !== undefined ? options.microFusionCoreKelvin : 3500;
    this.tunnelLengthMeters = options.tunnelLengthMeters !== undefined ? options.tunnelLengthMeters : 180.0;
    this.elevatorWinchFunctional = options.elevatorWinchFunctional !== undefined ? options.elevatorWinchFunctional : true;

    this.isArmed = false;
    this.detonated = false;
    this.distanceEscapedMeters = 0.0;
    this.seismicTremorIntensity = 0.0;
  }

  /**
   * Arms the wristpad thermonuclear device using Yautja ritual glyphs.
   * @param {string} wristpadSecurityGlyphs
   * @returns {Object} Arming telemetry
   */
  armThermonuclearCore(wristpadSecurityGlyphs = 'YAUTJA-HONOR-COUNTDOWN-DELTA') {
    const valid = typeof wristpadSecurityGlyphs === 'string' && wristpadSecurityGlyphs.length >= 8;
    if (!valid) {
      return { success: false, reason: 'INVALID_RITUAL_GLYPHS' };
    }

    this.isArmed = true;
    this.countdownSeconds = 60.0;

    return {
      success: true,
      isArmed: true,
      initialCountdownSeconds: this.countdownSeconds,
      glyphDisplaySequence: ['𐒢', '𐒡', '𐒠', '𐒟', '𐒞'],
      containmentFieldActive: true
    };
  }

  /**
   * Advances the self-destruct timer by deltaSeconds.
   * Core temperature ramps exponentially as countdown approaches zero.
   * @param {number} deltaSeconds
   * @returns {Object} Countdown status
   */
  tickCountdown(deltaSeconds = 1.0) {
    if (!this.isArmed || this.detonated) {
      return { isArmed: this.isArmed, detonated: this.detonated, countdownSeconds: this.countdownSeconds };
    }

    this.countdownSeconds = Math.max(0, +(this.countdownSeconds - deltaSeconds).toFixed(2));
    
    // Core ramps toward fusion plasma temperatures (up to 1e8 K)
    const progress = 1.0 - (this.countdownSeconds / 60.0);
    this.microFusionCoreKelvin = Math.round(3500 + Math.pow(progress, 3) * 99996500);
    this.seismicTremorIntensity = +(Math.min(1.0, progress * 1.25)).toFixed(2);

    if (this.countdownSeconds <= 0) {
      return this.triggerFinalThermonuclearDetonation();
    }

    return {
      isArmed: true,
      countdownSeconds: this.countdownSeconds,
      microFusionCoreKelvin: this.microFusionCoreKelvin,
      seismicTremorIntensity: this.seismicTremorIntensity,
      detonated: false
    };
  }

  /**
   * Calculates escape sprint progress through subterranean collapsing tunnels.
   * @param {number} sprintSpeedMps
   * @param {number} deltaSeconds
   * @param {number} [vaultDebrisObstacles=0]
   * @returns {Object} Escape progress
   */
  calculateEscapeSprintProgress(sprintSpeedMps = 7.5, deltaSeconds = 1.0, vaultDebrisObstacles = 0) {
    const obstaclePenalty = Math.max(0.4, 1.0 - (vaultDebrisObstacles * 0.15));
    const distanceGain = sprintSpeedMps * obstaclePenalty * deltaSeconds;

    this.distanceEscapedMeters = Math.min(this.tunnelLengthMeters, +(this.distanceEscapedMeters + distanceGain).toFixed(1));
    const reachedSurfaceElevator = this.distanceEscapedMeters >= this.tunnelLengthMeters;

    return {
      distanceEscapedMeters: this.distanceEscapedMeters,
      tunnelLengthMeters: this.tunnelLengthMeters,
      reachedSurfaceElevator,
      elevatorReady: reachedSurfaceElevator && this.elevatorWinchFunctional
    };
  }

  /**
   * Triggers the final thermonuclear 300-kiloton micro-fusion blast.
   * @returns {Object} Detonation blast telemetry
   */
  triggerFinalThermonuclearDetonation() {
    this.detonated = true;
    this.countdownSeconds = 0;
    const blastYieldKilotons = 300;
    const fireballRadiusMeters = 850;
    const pyramidVaporized = true;
    const escapedAlive = this.distanceEscapedMeters >= this.tunnelLengthMeters && this.elevatorWinchFunctional;

    return {
      detonated: true,
      blastYieldKilotons,
      fireballRadiusMeters,
      pyramidVaporized,
      escapedAlive
    };
  }

  /**
   * Returns current sector telemetry.
   * @returns {Object}
   */
  getSectorState() {
    return {
      sectorId: this.sectorId,
      isArmed: this.isArmed,
      countdownSeconds: this.countdownSeconds,
      microFusionCoreKelvin: this.microFusionCoreKelvin,
      seismicTremorIntensity: this.seismicTremorIntensity,
      distanceEscapedMeters: this.distanceEscapedMeters,
      tunnelLengthMeters: this.tunnelLengthMeters,
      detonated: this.detonated
    };
  }
}
