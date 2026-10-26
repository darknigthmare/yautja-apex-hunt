/**
 * Prey1719PrairieSnakeWolfMeadowSector.js
 *
 * Chantier de Level Design 1 (v192) - Prey (2022) Sunlit Prairie Meadow & Snake/Wolf Apex Tracking
 * 1:1 Canonical Level Design:
 * - Wind-swept golden prairie meadow with waist-high bluestem grass.
 * - Coiled prairie rattlesnake issuing a high-frequency warning rattle (4,200 Hz).
 * - Venomous strike mechanics and venom extraction for coating flint-tipped arrowheads.
 * - Stalking timber wolf tracking through brush, demonstrating early-tier predatory tactics.
 */

export class Prey1719PrairieSnakeWolfMeadowSector {
  /**
   * @param {Object} options
   * @param {number} [options.grassHeightCm=95.0] Hauteur des herbes de prairie (cm)
   * @param {number} [options.rattleIntensityDb=78.0] Intensité sonore de la sonnette du serpent (dB)
   */
  constructor(options = {}) {
    this.grassHeightCm = options.grassHeightCm ?? 95.0;
    this.rattleIntensityDb = options.rattleIntensityDb ?? 78.0;

    // État runtime
    this.rattlesnakeWarningDetected = false;
    this.snakeVenomHarvested = false;
    this.timberWolfSpotted = false;
    this.paralyticArrowCoatingApplied = false;
    this.meadowStealthActive = true;
  }

  /**
   * Détecter l'avertissement sonore de la sonnette du crotale dans les herbes
   * @param {number} perceptionRatio Acuité sensorielle (0.0 à 1.0)
   */
  detectRattlesnakeWarning(perceptionRatio = 0.9) {
    this.rattlesnakeWarningDetected = perceptionRatio >= 0.65;

    return {
      status: this.rattlesnakeWarningDetected ? 'RATTLESNAKE_WARNING_RATTLE_IDENTIFIED' : 'STEPPED_NEAR_COILED_VIPER',
      detected: this.rattlesnakeWarningDetected,
      rattleAcousticDb: this.rattleIntensityDb,
      vibrationFrequencyHz: 4200.0,
      strikeAvoided: this.rattlesnakeWarningDetected
    };
  }

  /**
   * Neutraliser le serpent et prélever son venin neurotoxique
   */
  harvestRattlesnakeVenom() {
    this.snakeVenomHarvested = true;
    this.paralyticArrowCoatingApplied = true;

    return {
      status: 'RATTLESNAKE_NEUROTOXIN_HARVESTED',
      venomDoseMg: 45.0,
      paralyticArrowsCount: 3,
      toxinCoatingActive: true,
      lethalParalysisPotential: true
    };
  }

  /**
   * Observer le loup gris chassant dans la clairière
   */
  trackTimberWolfPredation() {
    this.timberWolfSpotted = true;

    return {
      status: 'TIMBER_WOLF_PREDATION_WITNESSED',
      wolfSpeedMps: 9.8,
      predatoryFlankTacticsObserved: true,
      canineSignalingDecoded: true
    };
  }
}
