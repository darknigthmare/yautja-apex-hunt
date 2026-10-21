/**
 * ValVerdeWaterfallCaveAmbushSector.js
 * 
 * Chantier Level Design #4 - Arène Sombre de la Rivière & Embuscade sous la Cascade.
 * Canonical 1:1 Predator (1987) fidelity:
 * - 28m thunderous tropical waterfall with 88 dB acoustic masking, drowning out human breathing and footfalls.
 * - Hidden basalt rock cave situated directly behind the falling torrent.
 * - Atmospheric mist droplet refraction (98% RH, 0.4mm droplet diameter) scattering the bio-mask's tri-laser aiming reticule.
 * - Slippery mossy boulders (friction mu = 0.25) where combatants must manage balance while preparing ambushes.
 */

export class ValVerdeWaterfallCaveAmbushSector {
  /**
   * @param {Object} options
   * @param {number} [options.waterfallHeightM=28.0]
   * @param {number} [options.waterfallAcousticRoarDb=88.0]
   * @param {number} [options.boulderFrictionMu=0.25]
   */
  constructor(options = {}) {
    this.waterfallHeightM = options.waterfallHeightM ?? 28.0;
    this.waterfallAcousticRoarDb = options.waterfallAcousticRoarDb ?? 88.0;
    this.boulderFrictionMu = options.boulderFrictionMu ?? 0.25;

    this.caveOccupied = false;
    this.mistScatterActive = true;
    this.ambushPrimed = false;
  }

  /**
   * Simulates entering the cave alcove behind the waterfall sheet.
   * @param {boolean} [bringTorchLight=false]
   * @returns {Object} Cave concealment telemetry
   */
  enterWaterfallCaveAlcove(bringTorchLight = false) {
    this.caveOccupied = true;
    const thermalOcclusionScore = 100; // Continuous cold sheet of water completely isolates IR radiation
    const acousticDrowningScore = this.waterfallAcousticRoarDb;

    return {
      success: true,
      caveOccupied: true,
      thermalOcclusionScore,
      acousticDrowningScore,
      hiddenFromDirectCanopySight: true,
      laserTargetingBlocked: true,
      visualLightExposure: bringTorchLight ? 'DETECTABLE_FLAME_GLOW' : 'PITCH_BLACK_COVERT',
      safeFromPlasmaDirectFire: true
    };
  }

  /**
   * Evaluates bi-directional targeting and bio-mask scattering through the water curtain mist.
   * @param {number} distanceM
   * @returns {Object} Targeting distortion telemetry
   */
  evaluateMistDropletRefraction(distanceM = 12.0) {
    const mistDensityPct = 94.0;
    const laserBeamScatteringSpreadMm = Math.round(distanceM * 35);
    const triLaserTargetLockPossible = false; // Tri-laser points scatter into blurred red glow

    return {
      distanceM,
      mistDensityPct,
      laserBeamScatteringSpreadMm,
      triLaserTargetLockPossible,
      thermalSignatureBlurred: true,
      audioTriangulationImpaired: true,
      ambushAdvantageMultiplier: 2.2
    };
  }

  /**
   * Resolves footing and balance when leaping or moving along the slick river boulders.
   * @param {number} traverseSpeedMps
   * @param {boolean} isSprint
   * @returns {Object} Footing resolution
   */
  resolveSlickBoulderFooting(traverseSpeedMps = 2.0, isSprint = false) {
    const slipRiskPct = isSprint ? 72 : Math.round((traverseSpeedMps / 3.0) * 28);
    const slipped = slipRiskPct >= 50;

    return {
      traverseSpeedMps,
      isSprint,
      boulderFrictionMu: this.boulderFrictionMu,
      slipRiskPct,
      slipped,
      footingMaintained: !slipped,
      plungeIntoRapidsHazard: slipped
    };
  }
}
