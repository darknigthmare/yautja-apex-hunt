/**
 * ValVerdeCanopyTreetopPursuitSector.js
 * 
 * Predator (1987) - Val Verde Deep Jungle Upper Canopy & Branch Runway Pursuit.
 * Simulates the Jungle Hunter's native arboreal habitat 25 meters above the jungle floor:
 * massive moss-covered hardwood branch runways, high-altitude tree crown leaps,
 * branch load capacity breaking limits, and canopy foliage camouflage concealment.
 */

export class ValVerdeCanopyTreetopPursuitSector {
  /**
   * @param {Object} options
   * @param {string} [options.canopySectorId='val-verde-upper-canopy-01']
   * @param {number} [options.canopyElevationM=25.0]
   * @param {number} [options.branchLoadCapacityKg=260.0]
   * @param {number} [options.foliageDensityRatio=0.92]
   */
  constructor(options = {}) {
    this.canopySectorId = options.canopySectorId || 'val-verde-upper-canopy-01';
    this.canopyElevationM = options.canopyElevationM || 25.0;
    this.branchLoadCapacityKg = options.branchLoadCapacityKg || 260.0;
    this.foliageDensityRatio = options.foliageDensityRatio || 0.92;

    this.currentElevationM = this.canopyElevationM;
    this.branchSnapped = false;
  }

  /**
   * Executes an athletic leap between two adjacent tree crowns in the canopy.
   * @param {number} leapDistanceM - Distance between branches (e.g. 6.5m)
   * @param {number} hunterMassKg
   * @returns {Object} Tree crown leap telemetry
   */
  executeTreetopBranchLeap(leapDistanceM = 6.5, hunterMassKg = 160.0) {
    const requiredHorizontalVelocityMps = +(leapDistanceM / 0.85).toFixed(1); // 0.85s flight
    const landingImpactForceN = Math.round(hunterMassKg * (9.81 + 14.5)); // ~3890 N
    const branchStressKg = hunterMassKg * 1.5;
    const branchHolds = branchStressKg <= this.branchLoadCapacityKg;

    if (!branchHolds) {
      this.branchSnapped = true;
    }

    return {
      success: branchHolds,
      leapDistanceM,
      requiredHorizontalVelocityMps,
      landingImpactForceN,
      branchStressKg,
      branchHolds,
      branchSnapped: this.branchSnapped,
      canopyCreakDecibels: Math.round(52 + leapDistanceM * 4)
    };
  }

  /**
   * Evaluates camouflage concealment in the deep jungle leaves and vines.
   * @param {boolean} isCloaked
   * @returns {Object} Concealment rating
   */
  evaluateCanopyConcealment(isCloaked = true) {
    const totalConcealmentRatio = isCloaked ? 0.98 : this.foliageDensityRatio * 0.75;
    const groundObserverDetectionRangeM = +(this.canopyElevationM * (1.0 - totalConcealmentRatio)).toFixed(1);

    return {
      canopyElevationM: this.canopyElevationM,
      foliageDensityRatio: this.foliageDensityRatio,
      isCloaked,
      totalConcealmentRatio,
      groundObserverDetectionRangeM,
      leavesRustleDampingDb: -8.0
    };
  }

  /**
   * Executes a vertical plunge drop attack from the 25m canopy onto ground prey.
   * @param {number} dropTargetElevationM
   * @returns {Object} Plunge drop resolution
   */
  executeCanopyPlungeDrop(dropTargetElevationM = 0.0) {
    const fallHeightM = this.canopyElevationM - dropTargetElevationM;
    const impactVelocityMps = +(Math.sqrt(2 * 9.81 * fallHeightM)).toFixed(1); // ~22.1 m/s
    const plungeKineticEnergyJoules = Math.round(0.5 * 160.0 * Math.pow(impactVelocityMps, 2)); // ~39072 J
    this.currentElevationM = dropTargetElevationM;

    return {
      fallHeightM,
      impactVelocityMps,
      plungeKineticEnergyJoules,
      executionDamage: 650,
      landingShockwaveRadiusM: 3.5,
      canopyLeavesShowerSec: 2.5
    };
  }
}
