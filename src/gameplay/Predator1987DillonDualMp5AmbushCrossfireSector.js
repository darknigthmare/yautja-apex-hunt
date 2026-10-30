/**
 * Predator1987DillonDualMp5AmbushCrossfireSector.js - v239
 * Canonical set-piece: Dense Val Verde jungle clearing, Dillon's dual-MP5 synchronized
 * volley (1600 RPM total), severed arm reflexive burst & Jungle Hunter canopy reposition.
 */

export class Predator1987DillonDualMp5AmbushCrossfireSector {
  constructor(options = {}) {
    this.sectorId = 'SECTOR_1987_DILLON_DUAL_MP5_AMBUSH_CROSSFIRE';
    this.name = 'Predator (1987) Dillon Dual-MP5 Jungle Clearing Crossfire & Severed Arm Reflex';
    this.difficultyMultiplier = options.difficultyMultiplier || 1.0;
    this.singleMp5CyclicRateRpm = 800;
    this.combinedFireRateRpm = 1600;
    this.magazineCapacityPerGun = 30;

    this.state = {
      clearingInfiltrated: false,
      dualMp5SuppressionFired: false,
      triLaserDillonShoulderLock: false,
      rightArmPlasmacasterSevered: false,
      severedArmReflexBurstCompleted: false,
      roundsDischarged: 0,
      honorScore: 0
    };
  }

  infiltrateJungleClearing() {
    this.state.clearingInfiltrated = true;
    this.state.honorScore += 100;
    return {
      status: 'CLEARING_OCCUPIED',
      foliageCanopyHeightMeters: 22.0,
      dualMp5sLoaded: true,
      totalAmmoLoaded: this.magazineCapacityPerGun * 2,
      acousticSilenceDb: 18.0
    };
  }

  dischargeDualMp5SynchronizedCrossfire(durationSeconds = 2.25) {
    if (!this.state.clearingInfiltrated) {
      throw new Error('Must infiltrate clearing before opening fire');
    }
    const fired = Math.min(60, Math.round((this.combinedFireRateRpm / 60) * durationSeconds));
    this.state.dualMp5SuppressionFired = true;
    this.state.roundsDischarged = fired;
    this.state.honorScore += 75;

    return {
      status: 'DUAL_MP5_CROSSFIRE_DISCHARGED',
      cyclicRateCombinedRpm: this.combinedFireRateRpm,
      roundsFired: this.state.roundsDischarged,
      canopyBranchShatterCount: 42,
      muzzleFlashLuminanceNits: 8500
    };
  }

  lockTriLaserOnShoulder(reactionWindowMs = 240) {
    if (!this.state.dualMp5SuppressionFired) {
      throw new Error('Hunter will not emerge to return fire until muzzle flash reveals position');
    }
    this.state.triLaserDillonShoulderLock = true;
    this.state.honorScore += 75;

    return {
      status: 'SHOULDER_TRI_LASER_ACQUIRED',
      beamTarget: 'Right Deltoid & Humeral Joint',
      triLaserDiameterMm: 12.0,
      reactionWindowMs,
      hunterRangeMeters: 16.0
    };
  }

  severArmAndTriggerReflexBurst() {
    if (!this.state.triLaserDillonShoulderLock) {
      throw new Error('Plasmacaster blast requires targeting lock prior to severance');
    }
    this.state.rightArmPlasmacasterSevered = true;
    this.state.severedArmReflexBurstCompleted = true;
    this.state.honorScore += 100;

    return {
      status: 'SEVERED_ARM_REFLEX_TRIGGERED',
      cauterizationTemperatureCelsius: 3800,
      severedArmReflexRoundsFired: 8,
      reflexContractionDurationSec: 0.6,
      totalSectorHonor: this.state.honorScore,
      canonicalReference: 'Predator (1987) - Dillon dual-MP5 standoff, iconic severed arm reflex fire'
    };
  }

  getSnapshot() {
    return {
      sectorId: this.sectorId,
      name: this.name,
      state: { ...this.state },
      cleared: this.state.severedArmReflexBurstCompleted && this.state.honorScore >= 350
    };
  }
}
