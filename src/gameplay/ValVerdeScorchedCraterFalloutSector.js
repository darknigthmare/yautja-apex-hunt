/**
 * ValVerdeScorchedCraterFalloutSector.js
 * 
 * Chantier Level Design #7 - Fosse de Terre Brûlée & Cratère de Déflagration Thermonucléaire.
 * Canonical 1:1 Predator (1987) fidelity:
 * - Recreates the immediate aftermath of the Jungle Hunter's wrist gauntlet micro-atomic detonation.
 * - 70m wide blast crater lined with vitrified glassified silica (fulgurites formed at 1700 °C).
 * - Stripped, smoldering tree trunks emitting intense residual thermal hotspots (280 °C) that blind bio-masks.
 * - Radioactive ash fallout drifting on thermal winds, creating a hazy apocalyptic atmosphere.
 * - Navigating the crater perimeter requires jumping between cooled basalt outcroppings to avoid burning ember fields.
 */

export class ValVerdeScorchedCraterFalloutSector {
  /**
   * @param {Object} options
   * @param {number} [options.craterRadiusM=35.0]
   * @param {number} [options.epicenterTempC=480.0]
   */
  constructor(options = {}) {
    this.craterRadiusM = options.craterRadiusM ?? 35.0;
    this.epicenterTempC = options.epicenterTempC ?? 480.0;
    this.vitrifiedCrustActive = true;
    this.ashFalloutActive = true;
  }

  /**
   * Evaluates environmental thermal noise and bio-mask blinding in the blast zone.
   * @param {number} distanceFromEpicenterM
   * @returns {Object} Crater thermal noise telemetry
   */
  evaluateCraterThermalNoise(distanceFromEpicenterM = 15.0) {
    const distClamped = Math.max(1.0, distanceFromEpicenterM);
    const localSurfaceTempC = Math.max(35.0, Math.round((this.epicenterTempC / Math.sqrt(distClamped / 2.0)) * 10) / 10);
    const bioMaskOverloadWhiteout = localSurfaceTempC >= 180.0;
    const ashParticleDensityPpm = Math.round(450 / Math.sqrt(distClamped));

    return {
      distanceFromEpicenterM: distClamped,
      localSurfaceTempC,
      bioMaskOverloadWhiteout,
      thermalTrackingImpossible: bioMaskOverloadWhiteout,
      ashParticleDensityPpm,
      vitrifiedGlassFulguritePresent: distClamped <= 20.0,
      radiationClickerAcousticCpm: Math.round(1200 / distClamped)
    };
  }

  /**
   * Resolves traverse across vitrified glassy sand crust.
   * @param {number} traverseSpeedMps
   * @returns {Object} Traverse footing status
   */
  traverseVitrifiedCrust(traverseSpeedMps = 2.5) {
    const glassCrunchAcousticDb = 68;
    const brittleCrustBreakRisk = traverseSpeedMps > 3.0;

    return {
      success: true,
      traverseSpeedMps,
      glassCrunchAcousticDb,
      brittleCrustBreakRisk,
      footingStable: !brittleCrustBreakRisk,
      emberBurnHazard: brittleCrustBreakRisk
    };
  }
}
