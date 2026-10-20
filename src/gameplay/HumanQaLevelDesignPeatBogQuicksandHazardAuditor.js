/**
 * HumanQaLevelDesignPeatBogQuicksandHazardAuditor.js
 * 
 * Chantier 10 & Audit QA #5 (Level Design):
 * Solves QA tester feedback: "Swamp and marsh levels have cosmetic mud puddles
 * that have zero gameplay hazard or tactical consequence. Real boreal peat bogs
 * and quicksand should slow movement progressively and swallow heavy armored hunters
 * if they stand still."
 * 
 * Implements non-Newtonian shear-thinning fluid mechanics: immersion depth h(t),
 * dynamic locomotion penalties, struggle agitation velocity, and grapple escape vectors.
 */

export class HumanQaLevelDesignPeatBogQuicksandHazardAuditor {
  /**
   * @param {Object} options
   * @param {string} [options.bogHazardId='boreal-peat-quicksand-01']
   * @param {number} [options.maxBogDepthM=2.4]
   * @param {number} [options.viscosityIndex=85.0] // Non-Newtonian drag index
   * @param {number} [options.hunterWeightKg=150.0]
   */
  constructor(options = {}) {
    this.bogHazardId = options.bogHazardId || 'boreal-peat-quicksand-01';
    this.maxBogDepthM = options.maxBogDepthM || 2.4;
    this.viscosityIndex = options.viscosityIndex || 85.0;
    this.hunterWeightKg = options.hunterWeightKg || 150.0;

    this.currentImmersionDepthM = 0.0;
    this.isTrapped = false;
  }

  /**
   * Updates sinking physics over time.
   * Agitation (thrashing/sprinting) liquefies thixotropic mud, increasing sink speed!
   * @param {number} deltaSec
   * @param {boolean} isThrashingAgitated
   * @param {boolean} isStationary
   * @returns {Object} Quicksand telemetry
   */
  updateSinkingPhysics(deltaSec = 1.0, isThrashingAgitated = false, isStationary = true) {
    let sinkVelocityMps = 0.02; // Baseline steady sinking

    if (isThrashingAgitated) {
      // Non-Newtonian shear thinning: agitation triples sink rate
      sinkVelocityMps = 0.08;
    } else if (!isStationary) {
      // Careful slow wading creates buoyant step lift
      sinkVelocityMps = -0.01;
    }

    this.currentImmersionDepthM = +(Math.max(0.0, Math.min(this.maxBogDepthM, this.currentImmersionDepthM + sinkVelocityMps * deltaSec))).toFixed(3);

    // Evaluate locomotion impairment stage
    let immersionStage = 'ANKLE_DEEP';
    let speedPenaltyRatio = 0.2; // 20% slower
    this.isTrapped = false;

    if (this.currentImmersionDepthM >= 1.6) {
      immersionStage = 'CRITICAL_ASPHYXIATION';
      speedPenaltyRatio = 1.0;
      this.isTrapped = true;
    } else if (this.currentImmersionDepthM >= 0.8) {
      immersionStage = 'WAIST_DEEP_TRAPPED';
      speedPenaltyRatio = 0.85;
      this.isTrapped = true;
    } else if (this.currentImmersionDepthM >= 0.35) {
      immersionStage = 'KNEE_DEEP_IMPEDIMENT';
      speedPenaltyRatio = 0.55;
    }

    return {
      currentImmersionDepthM: this.currentImmersionDepthM,
      maxBogDepthM: this.maxBogDepthM,
      immersionStage,
      speedPenaltyRatio,
      isTrapped: this.isTrapped,
      effectiveMovementSpeedMps: +(6.0 * (1.0 - speedPenaltyRatio)).toFixed(2),
      buoyancySupportN: Math.round(this.hunterWeightKg * 9.81 * (this.currentImmersionDepthM / this.maxBogDepthM))
    };
  }

  /**
   * Uses wrist grapple to latch onto an overhead branch or solid rock and pull out of the bog.
   * @param {number} grappleWinchForceN
   * @returns {Object} Extraction outcome
   */
  executeGrappleExtraction(grappleWinchForceN = 2800) {
    const suctionForceN = Math.round(this.currentImmersionDepthM * 1400);
    const canExtract = grappleWinchForceN > suctionForceN;

    if (canExtract) {
      this.currentImmersionDepthM = 0.0;
      this.isTrapped = false;
    }

    return {
      success: canExtract,
      grappleWinchForceN,
      suctionForceN,
      immersionDepthRemainingM: this.currentImmersionDepthM,
      escapedQuicksand: canExtract
    };
  }
}
