/**
 * GlacialRiverDriftwoodLogAmbushSector.js
 * 
 * Prey (2022) - Mountain glacial river & driftwood logjam sector.
 * Simulates high-velocity river currents (3.8 m/s), near-freezing water (2 C),
 * thermal camouflage beneath floating pine driftwood logs, vertical aquatic leap ambushes,
 * and hunter hypothermia tolerance limits.
 */

export class GlacialRiverDriftwoodLogAmbushSector {
  /**
   * @param {Object} options
   * @param {string} [options.riverSectorId='glacial-river-driftwood-01']
   * @param {number} [options.waterTempCelsius=2.0]
   * @param {number} [options.currentSpeedMps=3.8]
   * @param {number} [options.driftwoodLogsCount=6]
   * @param {number} [options.trappersOnBank=4]
   */
  constructor(options = {}) {
    this.riverSectorId = options.riverSectorId || 'glacial-river-driftwood-01';
    this.waterTempCelsius = options.waterTempCelsius !== undefined ? options.waterTempCelsius : 2.0;
    this.currentSpeedMps = options.currentSpeedMps !== undefined ? options.currentSpeedMps : 3.8;
    this.driftwoodLogsCount = options.driftwoodLogsCount !== undefined ? options.driftwoodLogsCount : 6;
    this.trappersOnBank = options.trappersOnBank !== undefined ? options.trappersOnBank : 4;

    this.submergedUnderLog = false;
    this.currentLogIndex = -1;
    this.immersionSeconds = 0;
  }

  /**
   * Submerges beneath a floating driftwood pine log to achieve complete thermal and optical cover.
   * @param {number} logIndex
   * @returns {Object} Submersion status
   */
  submergeUnderDriftwood(logIndex = 0) {
    if (logIndex < 0 || logIndex >= this.driftwoodLogsCount) {
      return { success: false, reason: 'INVALID_LOG_INDEX' };
    }

    this.submergedUnderLog = true;
    this.currentLogIndex = logIndex;

    return {
      success: true,
      submergedUnderLog: true,
      logIndex,
      thermalSignatureInvisible: true,
      opticalCamouflageEffective: true,
      riverCurrentProtectionRatio: 0.75 // Log breaks the current
    };
  }

  /**
   * Launches a sudden vertical leap ambush out of the river onto the bank.
   * @param {number} targetTrapperIndex
   * @returns {Object} Ambush execution telemetry
   */
  executeAquaticLeapAmbush(targetTrapperIndex = 0) {
    if (!this.submergedUnderLog) {
      return { success: false, reason: 'NOT_SUBMERGED_FOR_AMBUSH' };
    }

    if (this.trappersOnBank <= 0) {
      return { success: false, reason: 'NO_TRAPPERS_REMAINING' };
    }

    this.submergedUnderLog = false;
    this.trappersOnBank--;
    const leapImpulseVerticalMps = 7.2;
    const waterSprayAcousticDb = 74;

    return {
      success: true,
      targetTrapperIndex,
      trappersRemaining: this.trappersOnBank,
      leapImpulseVerticalMps,
      waterSprayAcousticDb,
      surpriseKillExecuted: true,
      timberShattered: true
    };
  }

  /**
   * Calculates hypothermia tolerance in 2 C glacial mountain water.
   * @param {number} immersionDurationSec
   * @returns {Object} Thermal condition
   */
  calculateHypothermiaTolerance(immersionDurationSec = 30) {
    this.immersionSeconds = immersionDurationSec;
    const maxSafeImmersionSec = 120; // 2 minutes safe in glacial water for Yautja physiology

    const coreTempCelsius = +(37.0 - Math.max(0, (immersionDurationSec - maxSafeImmersionSec) * 0.12)).toFixed(1);
    const hypothermiaActive = immersionDurationSec > maxSafeImmersionSec;
    const jointStiffnessPenalty = hypothermiaActive ? +(Math.min(0.4, (immersionDurationSec - maxSafeImmersionSec) * 0.01)).toFixed(2) : 0.0;

    return {
      waterTempCelsius: this.waterTempCelsius,
      immersionDurationSec,
      coreTempCelsius,
      hypothermiaActive,
      jointStiffnessPenalty,
      requiresEmergence: immersionDurationSec > 180
    };
  }

  /**
   * Returns current river sector state.
   * @returns {Object}
   */
  getRiverAmbushState() {
    return {
      riverSectorId: this.riverSectorId,
      waterTempCelsius: this.waterTempCelsius,
      currentSpeedMps: this.currentSpeedMps,
      submergedUnderLog: this.submergedUnderLog,
      currentLogIndex: this.currentLogIndex,
      trappersOnBank: this.trappersOnBank,
      immersionSeconds: this.immersionSeconds
    };
  }
}
