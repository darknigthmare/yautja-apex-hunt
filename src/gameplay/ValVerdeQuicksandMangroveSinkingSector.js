/**
 * ValVerdeQuicksandMangroveSinkingSector.js
 * 
 * Chantier Level Design #2 - Mangrove Sombre & Sables Mouvants / Fange Visqueuse d'Enlisement.
 * Canonical 1:1 Predator (1987) fidelity:
 * - Mangrove mud pit with non-Newtonian shear-thinning fluid dynamics.
 * - Yield stress of saturated rainforest silt (1200 Pa) creating powerful suction force (~4500 N).
 * - Sinking progression: ANKLE_DEEP (0.2m) -> KNEE_DEEP (0.5m) -> WAIST_DEEP (0.9m) -> CHEST_DEEP (1.3m).
 * - Panicked thrashing accelerates sinking rate threefold, while calm extraction using overhead kapok vines allows recovery.
 * - Suction acoustics (viscous gurgles at 42-65 dB).
 */

export class ValVerdeQuicksandMangroveSinkingSector {
  /**
   * @param {Object} options
   * @param {number} [options.pitDepthM=1.8]
   * @param {number} [options.mudYieldStressPa=1200]
   * @param {number} [options.siltViscosityPaS=140.0]
   */
  constructor(options = {}) {
    this.pitDepthM = options.pitDepthM ?? 1.8;
    this.mudYieldStressPa = options.mudYieldStressPa ?? 1200;
    this.siltViscosityPaS = options.siltViscosityPaS ?? 140.0;

    this.currentSinkDepthM = 0;
    this.overheadVineAvailable = true;
    this.playerStaminaPct = 100.0;
  }

  /**
   * Evaluates current entrapment tier based on depth.
   * @param {number} depthM
   * @returns {string} Sinking tier
   */
  getSinkingTier(depthM) {
    if (depthM >= 1.2) return 'CHEST_DEEP_LETHAL_DANGER';
    if (depthM >= 0.8) return 'WAIST_DEEP_SEVERE_SUCTION';
    if (depthM >= 0.4) return 'KNEE_DEEP_HEAVY_RESISTANCE';
    if (depthM > 0.05) return 'ANKLE_DEEP_SLIGHT_TRACTION_LOSS';
    return 'SURFACE_FIRM';
  }

  /**
   * Simulates entering or advancing in the quicksand mud.
   * @param {number} deltaSeconds
   * @param {boolean} [isStrugglingPanicked=false] - If true, thrashing liquefies sand, accelerating sinking
   * @returns {Object} Sinking state update
   */
  updateSinkingState(deltaSeconds = 5.0, isStrugglingPanicked = false) {
    // Sinking rate: base 0.02 m/s, multiplied by 3.2 if panicked thrashing
    const sinkRateMps = isStrugglingPanicked ? 0.064 : 0.018;
    this.currentSinkDepthM = Math.min(this.pitDepthM, this.currentSinkDepthM + sinkRateMps * deltaSeconds);
    this.currentSinkDepthM = Math.round(this.currentSinkDepthM * 100) / 100;

    // Stamina depletion
    const staminaDrain = isStrugglingPanicked ? deltaSeconds * 6.5 : deltaSeconds * 1.8;
    this.playerStaminaPct = Math.max(0, Math.round((this.playerStaminaPct - staminaDrain) * 10) / 10);

    const tier = this.getSinkingTier(this.currentSinkDepthM);
    // Suction pull force required to lift a human foot/leg: F = YieldStress * Area + ViscousDrag
    const suctionForceN = Math.round(this.mudYieldStressPa * 2.8 + this.currentSinkDepthM * 1800);

    return {
      sinkDepthM: this.currentSinkDepthM,
      sinkingTier: tier,
      isStrugglingPanicked,
      suctionForceN,
      playerStaminaPct: this.playerStaminaPct,
      movementSpeedPenaltyPct: Math.min(95, Math.round(this.currentSinkDepthM * 75)),
      acousticSuctionDb: Math.min(78, 48 + Math.round(this.currentSinkDepthM * 20))
    };
  }

  /**
   * Attempts an extraction using deliberate steady pull or overhead vine tether.
   * @param {boolean} [useOverheadVine=true]
   * @param {number} [effortSeconds=4.0]
   * @returns {Object} Extrication result
   */
  attemptQuicksandExtraction(useOverheadVine = true, effortSeconds = 4.0) {
    if (this.currentSinkDepthM <= 0.05) {
      return { success: true, remainingDepthM: 0, message: 'ALREADY_ON_FIRM_GROUND' };
    }

    if (useOverheadVine && this.overheadVineAvailable) {
      // Steady leverage on hanging vine
      const elevationGainM = effortSeconds * 0.12;
      this.currentSinkDepthM = Math.max(0, Math.round((this.currentSinkDepthM - elevationGainM) * 100) / 100);
      const staminaCost = effortSeconds * 4.0;
      this.playerStaminaPct = Math.max(0, Math.round((this.playerStaminaPct - staminaCost) * 10) / 10);

      const isExtricated = this.currentSinkDepthM <= 0.05;

      return {
        success: true,
        method: 'OVERHEAD_VINE_LEVERAGE',
        elevationGainM: Math.round(elevationGainM * 100) / 100,
        remainingDepthM: this.currentSinkDepthM,
        isExtricated,
        staminaCost,
        acousticSuctionPopDb: 72
      };
    } else {
      // Manual leg pull without vine leverage
      if (this.currentSinkDepthM >= 0.8) {
        return {
          success: false,
          method: 'BARE_LEGS_EXTRACTION',
          failureReason: 'SUCTION_FORCE_EXCEEDS_UNASSISTED_LEG_POWER',
          remainingDepthM: this.currentSinkDepthM,
          staminaCost: effortSeconds * 8.0
        };
      }

      const elevationGainM = effortSeconds * 0.035;
      this.currentSinkDepthM = Math.max(0, Math.round((this.currentSinkDepthM - elevationGainM) * 100) / 100);
      return {
        success: true,
        method: 'BARE_LEGS_EXTRACTION',
        elevationGainM: Math.round(elevationGainM * 100) / 100,
        remainingDepthM: this.currentSinkDepthM,
        isExtricated: this.currentSinkDepthM <= 0.05,
        staminaCost: effortSeconds * 6.5
      };
    }
  }
}
