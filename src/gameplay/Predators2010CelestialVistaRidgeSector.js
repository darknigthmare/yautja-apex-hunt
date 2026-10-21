/**
 * Predators2010CelestialVistaRidgeSector.js
 * 
 * Chantier Level Design #2 - Promontoire de la Vue Céleste & Ciel aux Lunes Multiples.
 * Canonical 1:1 Predators (2010) fidelity:
 * - The group of survivors scales a sharp volcanic rock ridge to find high ground.
 * - Steep cliff face (420m elevation above the canopy floor), unstable loose shale scree, volcanic basalt columns.
 * - The iconic cinematic revelation:
 *   - Breaking through the cloud deck at the promontory summit reveals the daytime alien sky.
 *   - Four massive celestial bodies hang in the atmosphere: a colossal ringed gas giant planet (75° apparent angular diameter),
 *     two distinct cratered sister moons, and a binary sun with visible solar corona flares.
 * - Collective psychological realization: "We're not on Earth. This is a game preserve, and we're the game."
 */

export class Predators2010CelestialVistaRidgeSector {
  /**
   * @param {Object} options
   * @param {number} [options.ridgeElevationM=420.0]
   */
  constructor(options = {}) {
    this.ridgeElevationM = options.ridgeElevationM ?? 420.0;
    this.ridgeCrested = false;
    this.celestialSkyObserved = false;
    this.gamePreserveRealized = false;
  }

  /**
   * Scales the basalt rock cliff face to reach the promontory.
   * @param {number} climbSpeedMps
   * @returns {Object} Rock ridge climbing telemetry
   */
  scaleBasaltRidge(climbSpeedMps = 2.8) {
    this.ridgeCrested = true;

    return {
      success: true,
      ridgeCrested: true,
      ridgeElevationM: this.ridgeElevationM,
      climbSpeedMps,
      rockMaterial: 'VOLCANIC_BASALT_COLUMNS',
      looseShaleSlideWarning: true,
      windGustVelocityMps: 12.5,
      canopyCanopyOceanVisibleBelow: true
    };
  }

  /**
   * Looks up to observe the alien sky and astronomical bodies.
   * @returns {Object} Celestial horizon telemetry
   */
  observeAlienCelestialHorizon() {
    if (!this.ridgeCrested) {
      return { success: false, reason: 'MUST_CREST_RIDGE_FIRST' };
    }

    this.celestialSkyObserved = true;

    return {
      success: true,
      celestialSkyObserved: true,
      visibleAstronomicalBodies: [
        { name: 'RINGED_GAS_GIANT', angularDiameterDeg: 75.0, ringsVisible: true },
        { name: 'SISTER_MOON_ALPHA', craterDensityPct: 92.0 },
        { name: 'SISTER_MOON_BETA', atmosphericHaze: 'VIOLET' },
        { name: 'BINARY_SUN_SYSTEM', solarFlareActive: true }
      ],
      notOnEarthConfirmed: true,
      alienAmbienceDb: 42,
      magneticFieldAnomaliesDetected: true
    };
  }

  /**
   * Triggers the tactical and psychological realization of being on a hunting planet.
   * @returns {Object} Game preserve diagnosis outcome
   */
  concludeGamePreserveDiagnosis() {
    if (!this.celestialSkyObserved) {
      return { success: false, reason: 'MUST_OBSERVE_SKY_FIRST' };
    }

    this.gamePreserveRealized = true;

    return {
      success: true,
      gamePreserveRealized: true,
      royceFamousDiagnosis: "We're not on Earth. This is a game preserve, and we're the game.",
      tacticalStance: 'EXPECT_APEX_HUNTER_PREDATORS',
      moraleDisruptionScore: 85,
      tacticalXpBonusGranted: 150
    };
  }
}
