/**
 * ComancheBogQuicksandEscapeSector.js
 * 
 * Prey (2022) - Comanche marshlands & river basin quicksand bog.
 * Simulates non-Newtonian shear-thickening quicksand slurry, armor-weight sink dynamics,
 * wrist-mounted grappling harpoon winch extraction, and full-body mud thermal insulation.
 */

export class ComancheBogQuicksandEscapeSector {
  /**
   * @param {Object} options
   * @param {string} [options.bogId='comanche-bog-01']
   * @param {number} [options.quicksandDepthM=2.4]
   * @param {number} [options.viscosityPascalSec=45000]
   * @param {number} [options.hunterSinkDepthM=0.0]
   * @param {number} [options.anchorPointsAvailable=3]
   */
  constructor(options = {}) {
    this.bogId = options.bogId || 'comanche-bog-01';
    this.quicksandDepthM = options.quicksandDepthM !== undefined ? options.quicksandDepthM : 2.4;
    this.viscosityPascalSec = options.viscosityPascalSec !== undefined ? options.viscosityPascalSec : 45000;
    this.hunterSinkDepthM = options.hunterSinkDepthM !== undefined ? options.hunterSinkDepthM : 0.0;
    this.anchorPointsAvailable = options.anchorPointsAvailable !== undefined ? options.anchorPointsAvailable : 3;

    this.harpoonTetherAttached = false;
    this.selectedAnchorIndex = -1;
    this.fullySubmerged = false;
  }

  /**
   * Updates sinking progression in non-Newtonian peat bog quicksand.
   * Struggling violently increases shear rate and accelerates liquefaction.
   * @param {number} entityMassKg
   * @param {number} struggleIntensity - 0.0 (calm) to 1.0 (thrashing)
   * @param {number} deltaSec
   * @returns {Object} Sinking state
   */
  updateQuicksandSinking(entityMassKg = 160, struggleIntensity = 0.5, deltaSec = 1.0) {
    if (this.fullySubmerged) {
      return {
        hunterSinkDepthM: this.quicksandDepthM,
        fullySubmerged: true,
        suffocating: true
      };
    }

    const massFactor = entityMassKg / 100.0; // Heavy armored hunters sink faster
    // Struggling liquefies thixotropic clay
    const struggleMultiplier = 1.0 + (struggleIntensity * 2.8);
    const baseSinkVelocityMps = 0.04; // 4 cm/s base sinking
    const effectiveSinkVelocityMps = baseSinkVelocityMps * massFactor * struggleMultiplier;

    this.hunterSinkDepthM = Math.min(this.quicksandDepthM, +(this.hunterSinkDepthM + effectiveSinkVelocityMps * deltaSec).toFixed(3));
    this.fullySubmerged = this.hunterSinkDepthM >= (this.quicksandDepthM - 0.2);

    const chestSubmerged = this.hunterSinkDepthM >= 1.2;
    const mobilityPenalty = +(Math.min(0.95, this.hunterSinkDepthM / 1.8)).toFixed(2);

    return {
      hunterSinkDepthM: this.hunterSinkDepthM,
      quicksandDepthM: this.quicksandDepthM,
      mobilityPenalty,
      chestSubmerged,
      fullySubmerged: this.fullySubmerged
    };
  }

  /**
   * Fires the wrist-mounted harpoon into a nearby sturdy tree trunk or rock outcrop.
   * @param {number} anchorIndex
   * @returns {Object} Harpoon attachment outcome
   */
  fireWinchHarpoon(anchorIndex = 0) {
    if (anchorIndex < 0 || anchorIndex >= this.anchorPointsAvailable) {
      return { success: false, reason: 'INVALID_ANCHOR_INDEX' };
    }

    this.selectedAnchorIndex = anchorIndex;
    this.harpoonTetherAttached = true;

    return {
      success: true,
      anchorIndex,
      harpoonTetherAttached: true,
      cableTensionCapacityN: 18000,
      winchReady: true
    };
  }

  /**
   * Engages high-torque winch motor to pull the hunter out of the quicksand bog.
   * @param {number} pullForceN - Winch pull force (e.g. 5000 N)
   * @param {number} deltaSec
   * @returns {Object} Winch extraction status
   */
  engageWinchTether(pullForceN = 6500, deltaSec = 1.0) {
    if (!this.harpoonTetherAttached) {
      return { success: false, reason: 'NO_TETHER_ATTACHED' };
    }

    // Suction resistance force depends on submerged surface area
    const suctionResistanceN = Math.round(1200 + this.hunterSinkDepthM * 2800);
    const netExtractionForceN = pullForceN - suctionResistanceN;

    if (netExtractionForceN > 0) {
      const riseVelocityMps = +(netExtractionForceN / 12000).toFixed(2);
      this.hunterSinkDepthM = Math.max(0, +(this.hunterSinkDepthM - riseVelocityMps * deltaSec).toFixed(3));
      this.fullySubmerged = false;

      return {
        success: true,
        extractedDistanceM: +(riseVelocityMps * deltaSec).toFixed(2),
        currentSinkDepthM: this.hunterSinkDepthM,
        freedFromQuicksand: this.hunterSinkDepthM <= 0.05
      };
    }

    return {
      success: false,
      reason: 'INSUFFICIENT_PULL_FORCE',
      suctionResistanceN,
      currentSinkDepthM: this.hunterSinkDepthM
    };
  }

  /**
   * Evaluates the thermal camouflage benefit of being coated in cold riverbed mud.
   * @returns {Object} Mud masking telemetry
   */
  evaluateMudAblationBenefit() {
    const isCoated = this.hunterSinkDepthM >= 0.6;
    return {
      mudCoatingActive: isCoated,
      thermalEmissivityReduction: isCoated ? 0.92 : 0.0,
      infraredSignatureInvisible: isCoated,
      durationRemainingSeconds: isCoated ? 180 : 0
    };
  }

  /**
   * Returns current diagnostics.
   * @returns {Object}
   */
  getBogDiagnostics() {
    return {
      bogId: this.bogId,
      quicksandDepthM: this.quicksandDepthM,
      hunterSinkDepthM: this.hunterSinkDepthM,
      harpoonTetherAttached: this.harpoonTetherAttached,
      selectedAnchorIndex: this.selectedAnchorIndex,
      fullySubmerged: this.fullySubmerged
    };
  }
}
