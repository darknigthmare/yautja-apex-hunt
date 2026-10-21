/**
 * BouvetoyaPyramidQueenEggSacChamberSector.js
 * 
 * Alien vs. Predator (2004) - Subterranean Pyramid Queen's Ovipositor Breeding Nursery.
 * Simulates the Queen's sacred breeding chamber deep inside the Bouvetoya pyramid:
 * massive suspended ovipositor egg sac, biomechanical resin-encrusted floor,
 * proximity Facehugger egg petal blooming, and plasma caster thermal incineration.
 */

export class BouvetoyaPyramidQueenEggSacChamberSector {
  /**
   * @param {Object} options
   * @param {string} [options.chamberId='bouvetoya-queen-nursery-01']
   * @param {number} [options.eggClusterCount=18]
   * @param {number} [options.eggSacHealth=1500.0]
   * @param {number} [options.resinStickinessRatio=0.65]
   */
  constructor(options = {}) {
    this.chamberId = options.chamberId || 'bouvetoya-queen-nursery-01';
    this.eggClusterCount = options.eggClusterCount || 18;
    this.eggSacHealth = options.eggSacHealth || 1500.0;
    this.resinStickinessRatio = options.resinStickinessRatio || 0.65;

    this.ovipositorSevered = false;
    this.hatchedEggCount = 0;
    this.incineratedClusters = 0;
  }

  /**
   * Evaluates proximity to unhatched Xenomorph eggs.
   * If distance <= 2.5m, egg petals peel open and release Facehugger.
   * @param {number} distanceToNearestEggM
   * @returns {Object} Egg hatching telemetry
   */
  evaluateEggProximityHatching(distanceToNearestEggM = 2.0) {
    const triggerBloom = distanceToNearestEggM <= 2.5 && this.eggClusterCount > 0;

    if (triggerBloom) {
      this.hatchedEggCount++;
      this.eggClusterCount--;
    }

    return {
      distanceToNearestEggM,
      triggerBloom,
      facehuggerEmerged: triggerBloom,
      pounceSpeedMps: triggerBloom ? 12.0 : 0.0,
      eggHissDurationSec: triggerBloom ? 1.4 : 0.0,
      remainingUnhatchedEggs: this.eggClusterCount
    };
  }

  /**
   * Fires a charged plasma bolt directly into the Queen's ovipositor or egg clusters.
   * Causes massive incendiary deflagration, scorching the biomechanical resin.
   * @param {number} plasmaDamageJoules
   * @param {number} blastRadiusM
   * @returns {Object} Incineration resolution
   */
  incinerateEggSacAndClusters(plasmaDamageJoules = 650, blastRadiusM = 4.0) {
    this.eggSacHealth = Math.max(0.0, this.eggSacHealth - plasmaDamageJoules);
    const clustersDestroyed = Math.min(this.eggClusterCount, Math.round(blastRadiusM * 1.5));
    this.eggClusterCount -= clustersDestroyed;
    this.incineratedClusters += clustersDestroyed;

    if (this.eggSacHealth <= 0.0) {
      this.ovipositorSevered = true;
    }

    return {
      success: true,
      plasmaDamageJoules,
      remainingEggSacHealth: this.eggSacHealth,
      ovipositorSevered: this.ovipositorSevered,
      clustersDestroyed,
      resinBurntClearRadiusM: blastRadiusM,
      queenRageEnraged: this.ovipositorSevered,
      honorScoreAwarded: this.ovipositorSevered ? 750 : clustersDestroyed * 40
    };
  }

  /**
   * Computes movement drag from walking on the sticky hive resin floor.
   * @param {number} normalSprintSpeedMps
   * @returns {Object} Locomotion impedance
   */
  evaluateResinFloorLocomotion(normalSprintSpeedMps = 7.0) {
    const speedReductionMps = +(normalSprintSpeedMps * this.resinStickinessRatio).toFixed(2);
    const effectiveSprintSpeedMps = +(normalSprintSpeedMps - speedReductionMps).toFixed(2);
    const stickyTearDecibels = 68;

    return {
      normalSprintSpeedMps,
      resinStickinessRatio: this.resinStickinessRatio,
      effectiveSprintSpeedMps,
      jumpHeightPenaltyRatio: 0.60,
      stickyTearDecibels
    };
  }
}
