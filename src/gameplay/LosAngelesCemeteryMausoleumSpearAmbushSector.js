/**
 * LosAngelesCemeteryMausoleumSpearAmbushSector.js
 * 
 * Predator 2 (1990) - St. Jude's Cemetery & Gothic Mausoleum Rooftops.
 * Simulates the atmospheric nighttime graveyard hunt: gargoyle perches overlooking
 * stone tombstones, thunderstorm lightning flashes momentarily revealing optical cloaking,
 * and high-pressure pneumatic speargun shots pinning targets against granite crypts.
 */

export class LosAngelesCemeteryMausoleumSpearAmbushSector {
  /**
   * @param {Object} options
   * @param {string} [options.cemeterySectorId='los-angeles-cemetery-mausoleum-01']
   * @param {number} [options.mausoleumRoofHeightM=8.5]
   * @param {number} [options.mistDensity=0.65]
   * @param {boolean} [options.thunderstormActive=true]
   */
  constructor(options = {}) {
    this.cemeterySectorId = options.cemeterySectorId || 'los-angeles-cemetery-mausoleum-01';
    this.mausoleumRoofHeightM = options.mausoleumRoofHeightM || 8.5;
    this.mistDensity = options.mistDensity || 0.65;
    this.thunderstormActive = options.thunderstormActive !== undefined ? options.thunderstormActive : true;

    this.spearBoltsLoaded = 3;
    this.pinnedTargets = [];
    this.lightningFlashActive = false;
  }

  /**
   * Evaluates the rooftop vantage point on a granite gargoyle.
   * Grants elevation accuracy bonuses and high-angle line of sight.
   * @returns {Object} Stalking vantage metrics
   */
  evaluateGargoylePerchVantage() {
    return {
      roofHeightM: this.mausoleumRoofHeightM,
      elevationAccuracyBonusRatio: 0.25,
      concealmentFactor: 0.82,
      plungeStrikeEligible: true,
      groundAcousticDampingDb: -12.0 // High perch muffles breathing sounds
    };
  }

  /**
   * Simulates a thunderstorm lightning flash illuminating the graveyard.
   * @param {number} flashLuminanceLux
   * @returns {Object} Lightning event details
   */
  triggerLightningFlash(flashLuminanceLux = 85000) {
    if (!this.thunderstormActive) {
      return { flashTriggered: false, cloakDistortionDurationMs: 0 };
    }

    this.lightningFlashActive = true;
    const cloakRefractionGlitchMs = 120; // 120ms optical silhouette reveal
    const thunderClapDelaySec = 1.4; // Sound travels ~480m

    return {
      flashTriggered: true,
      flashLuminanceLux,
      cloakRefractionGlitchMs,
      thunderClapDelaySec,
      preyPanicLevelBoost: 0.4
    };
  }

  /**
   * Fires the pneumatic speargun to pin a target to a granite tombstone.
   * @param {string} targetId
   * @param {number} targetDistanceM
   * @param {number} distanceToGraniteWallM - Distance behind target to granite surface
   * @returns {Object} Speargun impact outcome
   */
  firePneumaticSpearPin(targetId = 'target-cartel-enforcer', targetDistanceM = 18.0, distanceToGraniteWallM = 0.5) {
    if (this.spearBoltsLoaded <= 0) {
      return { success: false, reason: 'OUT_OF_SPEAR_BOLTS' };
    }

    this.spearBoltsLoaded--;
    const muzzleVelocityMps = 240.0;
    const flightTimeSec = +(targetDistanceM / muzzleVelocityMps).toFixed(3);
    const spearMassKg = 0.65;
    const impactKineticEnergyJoules = Math.round(0.5 * spearMassKg * Math.pow(muzzleVelocityMps, 2)); // ~18720 J
    
    // Check if target is close enough to wall to be pinned
    const isPinnedToWall = distanceToGraniteWallM <= 1.2;
    const damage = isPinnedToWall ? 340 : 220;

    const result = {
      success: true,
      targetId,
      flightTimeSec,
      impactKineticEnergyJoules,
      damage,
      isPinnedToWall,
      tombstoneGranitePenetrationDepthMm: isPinnedToWall ? 42 : 0,
      targetImmobilized: isPinnedToWall,
      spearBoltsRemaining: this.spearBoltsLoaded
    };

    if (isPinnedToWall) {
      this.pinnedTargets.push(result);
    }

    return result;
  }
}
