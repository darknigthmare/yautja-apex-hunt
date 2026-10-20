/**
 * HumanQaLevelDesignWaterNavMeshAndFlotationAuditor.js
 * 
 * Human Playtester QA Audit #5: Aquatic NavMesh Classification & Flotation Buoyancy Physics.
 * Corrects AI submerged walking bugs by categorizing water bodies into distinct mobility zones,
 * computing Archimedes buoyant forces versus armor mass, and weighting NavMesh path costs.
 */

export class HumanQaLevelDesignWaterNavMeshAndFlotationAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.waterDensityKgM3=1000.0]
   * @param {number} [options.gravityMps2=9.81]
   */
  constructor(options = {}) {
    this.waterDensityKgM3 = options.waterDensityKgM3 || 1000.0;
    this.gravityMps2 = options.gravityMps2 || 9.81;

    this.zoneThresholds = {
      SHALLOW_WADE_MAX: 0.8,
      DEEP_WADE_MAX: 1.6,
      SWIMMING_MAX: 3.5
    };
  }

  /**
   * Classifies water volume into discrete gameplay navigation zones.
   * @param {number} waterDepthMeters
   * @returns {string} Zone classification
   */
  classifyWaterZone(waterDepthMeters = 0.5) {
    if (waterDepthMeters <= 0.05) return 'DRY_GROUND';
    if (waterDepthMeters <= this.zoneThresholds.SHALLOW_WADE_MAX) return 'SHALLOW_WADE';
    if (waterDepthMeters <= this.zoneThresholds.DEEP_WADE_MAX) return 'DEEP_WADE';
    if (waterDepthMeters <= this.zoneThresholds.SWIMMING_MAX) return 'SWIMMING_FLOTATION';
    return 'SUBMERGED_ABYSS';
  }

  /**
   * Computes NavMesh path cost multiplier based on depth and entity locomotion biology.
   * @param {number} nodeDepthMeters
   * @param {string} entityType - 'HUMAN_SOLDIER', 'XENOMORPH_DRONE', 'YAUTJA_HUNTER'
   * @param {number} currentVelocityMps
   * @returns {Object} Cost analysis
   */
  computeNavMeshCostModifier(nodeDepthMeters = 1.0, entityType = 'HUMAN_SOLDIER', currentVelocityMps = 0.0) {
    const zone = this.classifyWaterZone(nodeDepthMeters);
    let baseMultiplier = 1.0;
    let traversable = true;

    switch (entityType) {
      case 'XENOMORPH_DRONE':
        // Xenomorphs swim effortlessly and use water stealth
        baseMultiplier = zone === 'SUBMERGED_ABYSS' ? 1.1 : 0.95;
        break;

      case 'YAUTJA_HUNTER':
        // Heavy armor increases wade friction, but strong wading power
        if (zone === 'SHALLOW_WADE') baseMultiplier = 1.25;
        else if (zone === 'DEEP_WADE') baseMultiplier = 1.65;
        else if (zone === 'SWIMMING_FLOTATION') baseMultiplier = 2.2;
        else baseMultiplier = 2.8;
        break;

      case 'HUMAN_SOLDIER':
      default:
        // Humans cannot traverse deep water without swimming gear
        if (zone === 'SHALLOW_WADE') baseMultiplier = 1.8;
        else if (zone === 'DEEP_WADE') baseMultiplier = 3.2;
        else {
          baseMultiplier = 10.0;
          traversable = false; // AI human avoids deep/abyss water
        }
        break;
    }

    const currentResistancePenalty = +(1.0 + (Math.abs(currentVelocityMps) * 0.15)).toFixed(2);
    const finalCostMultiplier = +(baseMultiplier * currentResistancePenalty).toFixed(2);

    return {
      zone,
      entityType,
      traversable,
      baseMultiplier,
      currentResistancePenalty,
      finalCostMultiplier
    };
  }

  /**
   * Evaluates Archimedes buoyancy vs gravitational weight.
   * F_buoyant = rho_water * V_submerged * g
   * F_gravity = m * g
   * @param {number} entityMassKg
   * @param {number} entityVolumeM3
   * @param {number} waterDepthMeters
   * @returns {Object} Buoyancy equilibrium
   */
  evaluateFlotationState(entityMassKg, entityVolumeM3, waterDepthMeters) {
    const zone = this.classifyWaterZone(waterDepthMeters);
    const weightForceN = +(entityMassKg * this.gravityMps2).toFixed(1);

    // Fraction of volume submerged based on water depth
    const entityHeightM = 2.1; // Typical Yautja / soldier height
    const submergedFraction = Math.min(1.0, Math.max(0, waterDepthMeters / entityHeightM));
    const submergedVolumeM3 = entityVolumeM3 * submergedFraction;

    const buoyantForceN = +(this.waterDensityKgM3 * submergedVolumeM3 * this.gravityMps2).toFixed(1);
    const netVerticalForceN = +(buoyantForceN - weightForceN).toFixed(1);

    const willFloat = netVerticalForceN >= 0;
    const sinkRateMps = willFloat ? 0.0 : +(Math.min(3.5, Math.abs(netVerticalForceN) / (entityMassKg * 4.5))).toFixed(2);

    return {
      zone,
      weightForceN,
      buoyantForceN,
      netVerticalForceN,
      willFloat,
      sinkRateMps,
      submergedFraction: +submergedFraction.toFixed(2)
    };
  }

  /**
   * Audits a series of path waypoints and filters out lethal/untraversable nodes for given entity.
   * @param {Array<{x: number, y: number, depth: number}>} waypoints
   * @param {string} entityType
   * @returns {Object} Audit outcome
   */
  auditWaterWaypoints(waypoints = [], entityType = 'HUMAN_SOLDIER') {
    if (!Array.isArray(waypoints)) return { validWaypoints: [], rejectedCount: 0 };

    const validWaypoints = [];
    let rejectedCount = 0;

    for (const wp of waypoints) {
      const evaluation = this.computeNavMeshCostModifier(wp.depth, entityType, 0);
      if (evaluation.traversable) {
        validWaypoints.push({
          ...wp,
          zone: evaluation.zone,
          costMultiplier: evaluation.finalCostMultiplier
        });
      } else {
        rejectedCount++;
      }
    }

    return {
      totalAudited: waypoints.length,
      validCount: validWaypoints.length,
      rejectedCount,
      validWaypoints
    };
  }
}
