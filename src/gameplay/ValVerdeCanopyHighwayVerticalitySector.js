/**
 * ValVerdeCanopyHighwayVerticalitySector.js
 * 
 * Predator (1987) - Val Verde 3-Tier Rainforest Canopy Highway & Vertical Level Design.
 * Simulates the complex 3-dimensional arboreal verticality of the Central American jungle:
 * - Tier 1: Forest Floor (0 - 3m) - buttress roots, damp mud, punji stakes, natural cover rocks
 * - Tier 2: Sub-canopy vine ropes (10 - 14m) - swing ropes, intermediate branches, ambush perches
 * - Tier 3: Upper Canopy Highway (22 - 26m) - horizontal branch runways (width 0.8 - 1.5m),
 *   96% dense foliage camouflage against human eyesight, branch sprint acceleration, and plunge takedowns.
 */

export class ValVerdeCanopyHighwayVerticalitySector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='val-verde-canopy-highway-01']
   * @param {number} [options.upperCanopyHeightM=24.0]
   * @param {number} [options.foliageConcealmentPct=96.0]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'val-verde-canopy-highway-01';
    this.upperCanopyHeightM = options.upperCanopyHeightM || 24.0;
    this.foliageConcealmentPct = options.foliageConcealmentPct || 96.0;

    this.branchNodes = [
      { id: 'branch-node-01', heightM: 24.5, runwayLengthM: 14.0, branchWidthM: 1.2, connectsTo: ['branch-node-02', 'vine-anchor-alpha'] },
      { id: 'branch-node-02', heightM: 23.8, runwayLengthM: 18.5, branchWidthM: 1.4, connectsTo: ['branch-node-01', 'branch-node-03'] },
      { id: 'branch-node-03', heightM: 25.2, runwayLengthM: 12.0, branchWidthM: 0.9, connectsTo: ['branch-node-02', 'plunge-point-ridge'] }
    ];

    this.currentTier = 3; // 1 = Floor, 2 = Mid, 3 = Canopy
  }

  /**
   * Resolves horizontal sprint movement along an upper canopy branch runway.
   * Yautja biomechanics permit full 32 km/h sprint speed on branches >= 0.8m width.
   * @param {string} branchId
   * @param {number} requestedSpeedMps
   * @returns {Object} Branch sprint telemetry
   */
  sprintOnCanopyBranch(branchId = 'branch-node-01', requestedSpeedMps = 8.5) {
    const branch = this.branchNodes.find(b => b.id === branchId);
    if (!branch) {
      return { success: false, reason: 'BRANCH_NODE_NOT_FOUND' };
    }

    const branchStabilityPct = Math.min(100.0, branch.branchWidthM * 75.0);
    const slipRiskPct = branch.branchWidthM < 1.0 ? 12.0 : 2.0;
    const foliageConcealment = this.foliageConcealmentPct;

    return {
      success: true,
      branchId: branch.id,
      heightM: branch.heightM,
      sprintSpeedMps: requestedSpeedMps,
      branchStabilityPct,
      slipRiskPct,
      foliageConcealmentPct: foliageConcealment,
      branchCreakDecibels: Math.round(38 + requestedSpeedMps * 2.5),
      infrarougeVisibleToGroundGuards: false
    };
  }

  /**
   * Performs an aerial vine swing maneuver between Tier 2 (sub-canopy) and Tier 3 (upper canopy).
   * @param {number} swingDistanceM
   * @returns {Object} Vine swing telemetry
   */
  executeVineSwingTransit(swingDistanceM = 16.0) {
    const transitDurationSec = Number((swingDistanceM / 9.8).toFixed(2));
    const momentumConservedPct = 88.0;
    this.currentTier = 2;

    return {
      success: true,
      swingDistanceM,
      transitDurationSec,
      momentumConservedPct,
      newTier: this.currentTier,
      silentTransit: true,
      groundDetectionChancePct: 4.0
    };
  }

  /**
   * Resolves a devastating vertical plunge leap from the 24m canopy directly down onto ground patrols.
   * Converts 24m potential energy into catastrophic ground-pound concussion impact.
   * @param {number} groundTargetCount
   * @returns {Object} Vertical plunge leap telemetry
   */
  executeCanopyVerticalPlunge(groundTargetCount = 2) {
    const fallVelocityMps = Number(Math.sqrt(2 * 9.81 * this.upperCanopyHeightM).toFixed(2));
    const impactKineticEnergyJ = Math.round(0.5 * 140.0 * fallVelocityMps * fallVelocityMps);
    const concussionRadiusM = 4.8;
    const crushDamage = 320;
    this.currentTier = 1;

    return {
      success: true,
      upperCanopyHeightM: this.upperCanopyHeightM,
      fallVelocityMps,
      impactKineticEnergyJ,
      concussionRadiusM,
      crushDamage,
      groundTargetsHit: groundTargetCount,
      groundCraterDepthM: 0.35,
      iFramesDurationMs: 220,
      currentTier: this.currentTier
    };
  }
}
