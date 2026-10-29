/**
 * Predator1987CanopyLeapLogSwingAndTriLaserAimSector (v225)
 *
 * Implements iconic 1:1 canonical set-pieces from Predator (1987):
 * 1. Jungle Hunter executing high-velocity leaps between giant mahogany canopies (14m leap distance).
 * 2. Dutch preparing the counterweighted spiked log pendulum suspended from high jungle vines (350 kg).
 * 3. Jungle Hunter aligning the tri-laser red dot targeting matrix across Dutch's chest from 25m distance.
 * 4. Dutch severing the vine trigger cord, ducking below the plasma blast as the spiked pendulum sweeps the canopy (+350 Honor).
 */
export class Predator1987CanopyLeapLogSwingAndTriLaserAimSector {
  constructor() {
    this.sectorId = 'PREDATOR_1987_CANOPY_LEAP_LOG_SWING_AND_TRI_LASER_AIM';
    this.filmReference = 'Predator (1987) - Canopy Branch Leaps, Spiked Log Pendulum & Tri-Laser Standoff';
    this.reset();
  }

  reset() {
    this.canopyBranchLeapExecuted = false;
    this.spikedLogPendulumSuspended = false;
    this.triLaserTargetingLocked = false;
    this.spikedLogSweepReleased = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  executeCanopyBranchLeap({
    branchLeapDistanceMeters = 14,
    canopyAgilityScore = 0.98
  } = {}) {
    const dist = Math.max(0, Number(branchLeapDistanceMeters) || 0);
    const score = Number(canopyAgilityScore) || 0;
    this.canopyBranchLeapExecuted = dist >= 10 && score >= 0.95;
    this.eventLog.push({
      step: 'CANOPY_BRANCH_LEAP_EXECUTED',
      branchLeapDistanceMeters: dist,
      canopyAgilityScore: score,
      canopyBranchLeapExecuted: this.canopyBranchLeapExecuted
    });
    return {
      canopyBranchLeapExecuted: this.canopyBranchLeapExecuted
    };
  }

  suspendSpikedLogPendulum({
    pendulumMassKg = 350,
    vineTensileLimitNewtons = 8200
  } = {}) {
    if (!this.canopyBranchLeapExecuted) {
      throw new Error('Must execute canopy leaps before suspending spiked log pendulum.');
    }
    const mass = Math.max(0, Number(pendulumMassKg) || 0);
    const limit = Math.max(0, Number(vineTensileLimitNewtons) || 0);
    this.spikedLogPendulumSuspended = mass >= 300 && limit >= 6000;
    this.eventLog.push({
      step: 'SPIKED_LOG_PENDULUM_SUSPENDED',
      pendulumMassKg: mass,
      vineTensileLimitNewtons: limit,
      spikedLogPendulumSuspended: this.spikedLogPendulumSuspended
    });
    return {
      spikedLogPendulumSuspended: this.spikedLogPendulumSuspended
    };
  }

  lockTriLaserTargetingMatrix({
    targetingRangeMeters = 25,
    reticleConvergenceScore = 0.99
  } = {}) {
    if (!this.spikedLogPendulumSuspended) {
      throw new Error('Must suspend log pendulum before locking tri-laser targeting.');
    }
    const range = Math.max(0, Number(targetingRangeMeters) || 0);
    const score = Number(reticleConvergenceScore) || 0;
    this.triLaserTargetingLocked = range >= 20 && score >= 0.95;
    this.eventLog.push({
      step: 'TRI_LASER_TARGETING_LOCKED',
      targetingRangeMeters: range,
      reticleConvergenceScore: score,
      triLaserTargetingLocked: this.triLaserTargetingLocked
    });
    return {
      triLaserTargetingLocked: this.triLaserTargetingLocked
    };
  }

  releaseSpikedLogCanopySweep({
    vineSeverCuttingForceJoules = 640,
    pendulumKineticEnergyJoules = 14200
  } = {}) {
    if (!this.triLaserTargetingLocked) {
      throw new Error('Must lock tri-laser before releasing spiked log canopy sweep.');
    }
    const cut = Math.max(0, Number(vineSeverCuttingForceJoules) || 0);
    const ke = Math.max(0, Number(pendulumKineticEnergyJoules) || 0);
    this.spikedLogSweepReleased = cut >= 500 && ke >= 12000;
    if (this.spikedLogSweepReleased) {
      this.honorAwarded = 350;
    }
    this.eventLog.push({
      step: 'SPIKED_LOG_SWEEP_RELEASED',
      vineSeverCuttingForceJoules: cut,
      pendulumKineticEnergyJoules: ke,
      spikedLogSweepReleased: this.spikedLogSweepReleased,
      honorAwarded: this.honorAwarded
    });
    return {
      spikedLogSweepReleased: this.spikedLogSweepReleased,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.canopyBranchLeapExecuted &&
      this.spikedLogPendulumSuspended &&
      this.triLaserTargetingLocked &&
      this.spikedLogSweepReleased &&
      this.honorAwarded === 350
    );
  }
}
