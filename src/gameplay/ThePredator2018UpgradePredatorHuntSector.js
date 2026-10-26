/**
 * ThePredator2018UpgradePredatorHuntSector.js
 * 
 * Chantier Level Design #5 - Traque de l'Upgrade Predator de 3,30 Mètres & Armure de Chitine.
 * Canonical 1:1 The Predator (2018) fidelity:
 * - The genetically modified Upgrade Predator:
 *   - Height 3.30m (11 ft), mass 350 kg, skin augmented with black melanistic chitin armor plates.
 *   - Completely immune to conventional small-arms gunfire (5.56mm and 7.62mm bullets bounce off with metallic ricochet pings).
 * - Direct ocular thermal vision:
 *   - Genetically spliced visual cortex providing multispectral vision without wearing a bio-mask.
 * - Brute kinetic strength:
 *   - Lifting military transport trucks and hurling them through forest trees.
 *   - Translating human language through throat vocal synthesizers.
 */

export class ThePredator2018UpgradePredatorHuntSector {
  /**
   * @param {Object} options
   * @param {number} [options.upgradeHeightM=3.30]
   * @param {number} [options.upgradeMassKg=350.0]
   */
  constructor(options = {}) {
    this.upgradeHeightM = options.upgradeHeightM ?? 3.30;
    this.upgradeMassKg = options.upgradeMassKg ?? 350.0;
    this.exoskeletonActive = true;
    this.directVisionActive = true;
    this.truckHurled = false;
  }

  /**
   * Evaluates the genetically modified subdermal chitin exoskeleton resistance against ballistic rounds.
   * @param {number} roundsFired
   * @returns {Object} Exoskeleton ballistic telemetry
   */
  evaluateChitinExoskeletonDefense(roundsFired = 30) {
    return {
      success: true,
      upgradeHeightM: this.upgradeHeightM,
      upgradeMassKg: this.upgradeMassKg,
      roundsFired,
      roundsDeflectedCount: roundsFired,
      penetrationDamageHp: 0,
      bulletBounceAcousticPingDb: 86,
      chitinArmorDensityCoeff: 0.98,
      conventionalFirearmsIneffective: true
    };
  }

  /**
   * Activates direct ocular multispectral vision without mask.
   * @param {string} [spectrumMode='ELECTROMAGNETIC_THERMAL']
   * @returns {Object} Direct vision telemetry
   */
  activateDirectOcularVision(spectrumMode = 'ELECTROMAGNETIC_THERMAL') {
    return {
      success: true,
      spectrumMode,
      noBioMaskRequired: true,
      directRetinalFeedActive: true,
      targetCloakPenetrationRatingPct: 99.0,
      vocalSynthesizerReady: true,
      translatedSpeechText: "I'll take your spine."
    };
  }

  /**
   * Performs a colossal kinetic feat: lifts and hurls a military transport vehicle.
   * @param {number} truckMassKg - Vehicle mass (kg)
   * @returns {Object} Kinetic throw outcome
   */
  hurlMilitaryVehicleAtPrey(truckMassKg = 3800.0) {
    this.truckHurled = true;

    return {
      success: true,
      truckHurled: true,
      truckMassKg,
      throwDistanceM: 22.0,
      treeImpactCrushDb: 124,
      crushDamageJoules: 65000,
      forestCoverDemolished: true,
      titanPrimalRoarDb: 118
    };
  }
}
