/**
 * ValVerdeCanopyHighwayAcrobaticSector.js
 * 
 * Chantier Level Design #2 - Réseau Aérien de Branches Maîtresses & Autoroute de Canopée à 22m.
 * Canonical 1:1 Predator (1987) fidelity:
 * - 22m-high interconnected master branch highway spanning 120m across the Val Verde rainforest.
 * - Structural branch classification:
 *   - HEAVY_BEARING_BOUGH: 35-50cm diameter hardwood limbs, zero deflection under 200kg Yautja mass, optimal plasmacaster sniper perch.
 *   - SPRING_BRANCH: elastic flexible bough allowing 14m acrobatic bounding leaps across canopy gaps.
 *   - BRITTLE_TWIG_ZONE: thin peripheral branches (< 8cm) that snap under heavy hunter weight, emitting an acoustic crack (64 dB).
 * - Dynamic branch sway under wind, predatory silent stalking, and downward drop-attack trajectories.
 */

export class ValVerdeCanopyHighwayAcrobaticSector {
  /**
   * @param {Object} options
   * @param {number} [options.highwayElevationM=22.0]
   * @param {number} [options.totalHighwaySpanM=120.0]
   */
  constructor(options = {}) {
    this.highwayElevationM = options.highwayElevationM ?? 22.0;
    this.totalHighwaySpanM = options.totalHighwaySpanM ?? 120.0;

    this.currentPositionM = 0;
    this.activeBranchType = 'HEAVY_BEARING_BOUGH';
  }

  /**
   * Traverses to a specific canopy branch node.
   * @param {string} branchType - 'HEAVY_BEARING_BOUGH' | 'SPRING_BRANCH' | 'BRITTLE_TWIG_ZONE'
   * @param {number} distanceM - Distance traveled
   * @returns {Object} Branch traversal telemetry
   */
  traverseCanopyBough(branchType = 'HEAVY_BEARING_BOUGH', distanceM = 8.0) {
    this.activeBranchType = branchType;
    this.currentPositionM = Math.min(this.totalHighwaySpanM, this.currentPositionM + distanceM);

    let branchSwayAmplitudeCm = 2.0;
    let boughSnapped = false;
    let acousticFootstepDb = 28;

    if (branchType === 'HEAVY_BEARING_BOUGH') {
      branchSwayAmplitudeCm = 1.5;
      acousticFootstepDb = 24; // Silent stalking
    } else if (branchType === 'SPRING_BRANCH') {
      branchSwayAmplitudeCm = 14.0;
      acousticFootstepDb = 32;
    } else if (branchType === 'BRITTLE_TWIG_ZONE') {
      branchSwayAmplitudeCm = 22.0;
      boughSnapped = true;
      acousticFootstepDb = 64; // Warning snap reveals position
    }

    return {
      success: true,
      currentPositionM: this.currentPositionM,
      branchType: this.activeBranchType,
      highwayElevationM: this.highwayElevationM,
      branchSwayAmplitudeCm,
      boughSnapped,
      acousticFootstepDb,
      groundTargetLineOfSightClear: true,
      downwardPounceAvailable: branchType !== 'BRITTLE_TWIG_ZONE'
    };
  }

  /**
   * Executes a 14m acrobatic leap across a canopy gap using a spring branch.
   * @param {number} leapDistanceM
   * @returns {Object} Acrobatic leap outcome
   */
  executeCanopyAcrobaticLeap(leapDistanceM = 14.0) {
    const leapVelocityMps = 11.5;
    const airtimeSec = Math.round((leapDistanceM / leapVelocityMps) * 100) / 100;

    return {
      success: true,
      leapDistanceM,
      leapVelocityMps,
      airtimeSec,
      landingBranchType: 'HEAVY_BEARING_BOUGH',
      stealthMaintained: true,
      landingAcousticDb: 36
    };
  }
}
