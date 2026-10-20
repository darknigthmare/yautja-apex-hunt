/**
 * BouvetoyaPyramidSacrificialClockworkSector.js
 * 
 * Alien vs. Predator (2004) - Subterranean Whaling Station Pyramid, Bouvet Island.
 * Simulates the colossal mechanical labyrinth constructed beneath 2000 feet of ice:
 * 10-minute clockwork wall reconfiguration cycle, crushing monolithic blocks,
 * sacrificial altar holding chamber, and tactical separation of hunting parties.
 */

export class BouvetoyaPyramidSacrificialClockworkSector {
  /**
   * @param {Object} options
   * @param {string} [options.pyramidSectorId='bouvetoya-sacrificial-chamber-01']
   * @param {number} [options.clockworkCycleDurationSec=600.0] - 10-minute cycle
   * @param {number} [options.stoneBlockMassTons=45.0]
   */
  constructor(options = {}) {
    this.pyramidSectorId = options.pyramidSectorId || 'bouvetoya-sacrificial-chamber-01';
    this.clockworkCycleDurationSec = options.clockworkCycleDurationSec || 600.0;
    this.stoneBlockMassTons = options.stoneBlockMassTons || 45.0;

    this.elapsedCycleTimeSec = 0.0;
    this.currentConfigurationIndex = 0; // 0 to 4 labyrinth configurations
    this.wallsShifting = false;
    this.sacrificialAltars = [
      { id: 'altar-alpha', occupied: true, facehuggerReleased: false, restraintsActive: true },
      { id: 'altar-beta', occupied: true, facehuggerReleased: false, restraintsActive: true },
      { id: 'altar-gamma', occupied: false, facehuggerReleased: false, restraintsActive: false }
    ];
  }

  /**
   * Advances the pyramid clockwork gear timer and checks for wall shifts.
   * @param {number} deltaSec
   * @returns {Object} Clockwork timer telemetry
   */
  advanceClockworkTimer(deltaSec = 1.0) {
    this.elapsedCycleTimeSec += deltaSec;
    const timeUntilNextShiftSec = +(Math.max(0.0, this.clockworkCycleDurationSec - (this.elapsedCycleTimeSec % this.clockworkCycleDurationSec))).toFixed(1);
    const triggerShift = (this.elapsedCycleTimeSec % this.clockworkCycleDurationSec) < deltaSec;

    if (triggerShift) {
      this.currentConfigurationIndex = (this.currentConfigurationIndex + 1) % 5;
      this.wallsShifting = true;
    } else {
      this.wallsShifting = false;
    }

    return {
      elapsedCycleTimeSec: +this.elapsedCycleTimeSec.toFixed(1),
      timeUntilNextShiftSec,
      currentConfigurationIndex: this.currentConfigurationIndex,
      wallsShifting: this.wallsShifting,
      gearTorqueMegaJoules: 18.5
    };
  }

  /**
   * Resolves the crushing impact of moving megalithic stone blocks on an entity in the corridor.
   * @param {number} entityDistanceToWallM
   * @param {number} corridorWidthM
   * @returns {Object} Crushing hazard resolution
   */
  resolveMonolithicWallCrush(entityDistanceToWallM = 0.2, corridorWidthM = 2.5) {
    const wallMovementSpeedMps = 0.85;
    const closingDurationSec = +(corridorWidthM / wallMovementSpeedMps).toFixed(2);
    const inCrushPincerZone = entityDistanceToWallM <= 0.4;
    const kineticEnergyJoules = Math.round(0.5 * (this.stoneBlockMassTons * 1000) * Math.pow(wallMovementSpeedMps, 2));

    return {
      wallsShifting: true,
      inCrushPincerZone,
      closingDurationSec,
      kineticEnergyJoules,
      lethalCrushForceN: 450000,
      crushedInstantly: inCrushPincerZone,
      bluntDamage: inCrushPincerZone ? 9999 : 0
    };
  }

  /**
   * Triggers the sacrificial chamber Facehugger release mechanism.
   * @param {string} altarId
   * @returns {Object} Sacrificial cycle details
   */
  triggerSacrificialAltarRelease(altarId = 'altar-alpha') {
    const altar = this.sacrificialAltars.find(a => a.id === altarId) || this.sacrificialAltars[0];
    altar.facehuggerReleased = true;

    return {
      altarId: altar.id,
      sacrificialVictimSecured: altar.restraintsActive,
      facehuggerPodOpened: true,
      facehuggerPounceWindowSec: 3.2,
      gestationInitiated: true,
      ritualHarvestValue: 250 // Ritual honor value
    };
  }
}
