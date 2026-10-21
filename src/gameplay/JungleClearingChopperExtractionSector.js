/**
 * JungleClearingChopperExtractionSector.js
 * 
 * Predator (1987) - Val Verde Jungle Extraction Clearing & Crashed Huey Helicopter.
 * Simulates the climactic jungle battlefield:
 * - Burning crashed Bell UH-1 Huey wreckage with twisted tail rotor and aviation kerosene fires (650 °C)
 * - Dense green bamboo thickets providing sliceable visual concealment and dynamic melee path carving
 * - Muddy embankment drainage trench leading down to the riverbank for thermal mud wallowing
 * - Explosive bowstring ambush perches positioned behind scorched tree stumps.
 */

export class JungleClearingChopperExtractionSector {
  /**
   * @param {Object} options
   * @param {string} [options.clearingId='val-verde-extraction-01']
   * @param {number} [options.helicopterIntegrity=0.35]
   * @param {number} [options.bambooThicketDensity=0.92]
   */
  constructor(options = {}) {
    this.clearingId = options.clearingId || 'val-verde-extraction-01';
    this.helicopterIntegrity = options.helicopterIntegrity || 0.35;
    this.bambooThicketDensity = options.bambooThicketDensity || 0.92;

    this.fuelJetFlameActive = true;
    this.flameTemperatureC = 650.0;
    this.bambooCutPathsCount = 0;
    this.mudTrenchDepthM = 1.4;
  }

  /**
   * Slices through dense bamboo thicket stalks using wristblades or combi-stick to carve stealth paths.
   * Clears a 2.0m wide path while generating a brief rustling acoustic cue.
   * @param {number} pathLengthM
   * @returns {Object} Bamboo cutting telemetry
   */
  sliceBambooThicketStealthPath(pathLengthM = 6.0) {
    this.bambooCutPathsCount++;
    const stalksCutCount = Math.round(pathLengthM * 14);
    const timeToCarveSec = Number((pathLengthM / 3.5).toFixed(2));
    const bambooConcealmentRemainingPct = Math.max(30.0, this.bambooThicketDensity * 100 - this.bambooCutPathsCount * 8);

    return {
      success: true,
      pathLengthM,
      stalksCutCount,
      timeToCarveSec,
      bambooConcealmentRemainingPct: Number(bambooConcealmentRemainingPct.toFixed(1)),
      bambooSliceSoundDb: 52,
      newTacticalFlankOpened: true
    };
  }

  /**
   * Evaluates proximity hazard to the burning helicopter wreckage.
   * Aviation fuel fire jet inflicts thermal damage within 3.5m and blocks laser optics.
   * @param {number} distanceM
   * @returns {Object} Helicopter fire hazard telemetry
   */
  resolveHelicopterFireHazard(distanceM = 2.0) {
    const hazardRadiusM = 3.8;
    const inFireZone = distanceM <= hazardRadiusM;

    if (!inFireZone || !this.fuelJetFlameActive) {
      return { inHazard: false, distanceM };
    }

    const thermalBurnDamage = Math.round(45 * (1.0 - distanceM / hazardRadiusM));
    const opticalDistortionMirage = true;

    return {
      inHazard: true,
      distanceM,
      thermalBurnDamage,
      flameTemperatureC: this.flameTemperatureC,
      opticalDistortionMirage,
      tailRotorMetalCoverRating: 'FULL_BALLISTIC_COVER'
    };
  }

  /**
   * Drops into Dutch's muddy drainage trench to wallow in cold river silt and refresh mud camouflage.
   * @param {number} wallowDurationSec
   * @returns {Object} Mud trench telemetry
   */
  wallowInMudDrainageTrench(wallowDurationSec = 3.0) {
    const thermalCamouflageEffectiveMinutes = Number((wallowDurationSec * 2.5).toFixed(1));
    const mudCoatingThicknessMm = 8.5;

    return {
      success: true,
      mudTrenchDepthM: this.mudTrenchDepthM,
      wallowDurationSec,
      mudCoatingThicknessMm,
      thermalCamouflageEffectiveMinutes,
      infraredSignatureReductionPct: 98.0,
      trenchConcealmentActive: true
    };
  }
}
