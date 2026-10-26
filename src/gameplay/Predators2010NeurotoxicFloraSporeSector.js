/**
 * Predators2010NeurotoxicFloraSporeSector.js
 *
 * Chantier de Level Design 4 (v183) - Predators (2010)
 * 1:1 Canonical Level Design: Alien Neurotoxic Flora & Paralytic Venom Extraction
 *
 * Canonical Scene: Edwin examines exotic purple alien botanical specimens (Orchis Venenum Yautja).
 * The bulbous plant expels pressurized paralytic spores on proximity contact, causing neuromuscular collapse.
 * Edwin extracts the venom with a scalpel to coat blades and concealed weapons.
 */

export class Predators2010NeurotoxicFloraSporeSector {
  /**
   * @param {Object} options
   * @param {number} [options.proximityRadiusM=2.4] Rayon de détection pneumatique de la fleur (m)
   * @param {number} [options.sporeDischargePressureKpa=320.0] Pression d'éjection des spores (kPa)
   * @param {number} [options.paralysisDurationSeconds=6.0] Durée de la paralysie neuromusculaire (s)
   */
  constructor(options = {}) {
    this.proximityRadiusM = options.proximityRadiusM ?? 2.4;
    this.sporeDischargePressureKpa = options.sporeDischargePressureKpa ?? 320.0;
    this.paralysisDurationSeconds = options.paralysisDurationSeconds ?? 6.0;

    // Caractéristiques botaniques
    this.plantSpecies = 'Orchis Venenum Yautja';
    this.bioluminescenceLumen = 450.0;
    this.sporeGlandsRemaining = 3;
    this.molecularWeightDaltons = 4820; // Peptide neurotoxique à haut poids moléculaire

    // État du joueur / de la cible
    this.targetAfflicted = false;
    this.paralysisTimerRemaining = 0.0;
    this.speedPenaltyMultiplier = 0.10; // -90% de vitesse de marche
    this.extractedVials = 0;
  }

  /**
   * Déclenchement de la décharge de spores si un intrus entre dans le périmètre
   * @param {number} distanceToPlant Distance actuelle de la cible (m)
   */
  evaluateProximity(distanceToPlant) {
    if (distanceToPlant <= this.proximityRadiusM && this.sporeGlandsRemaining > 0) {
      this.sporeGlandsRemaining -= 1;
      this.targetAfflicted = true;
      this.paralysisTimerRemaining = this.paralysisDurationSeconds;

      return {
        status: 'SPORE_POD_DETONATED_PNEUMATIC_DISCHARGE',
        dischargePressureKpa: this.sporeDischargePressureKpa,
        paralysisDurationSeconds: this.paralysisDurationSeconds,
        afflicted: true,
        speedMultiplier: this.speedPenaltyMultiplier
      };
    }

    return {
      status: 'SAFE_DISTANCE_BOTANICAL_DORMANT',
      distanceM: distanceToPlant,
      glandsLeft: this.sporeGlandsRemaining
    };
  }

  /**
   * Extraction chirurgicale propre du venin au scalpel (mécanique d'Edwin)
   * @param {boolean} hasScalpel
   */
  extractVenomHarvest(hasScalpel = true) {
    if (!hasScalpel) {
      return { success: false, reason: 'SURGICAL_BLADE_REQUIRED' };
    }

    if (this.sporeGlandsRemaining <= 0) {
      return { success: false, reason: 'GLANDS_EXHAUSTED' };
    }

    this.sporeGlandsRemaining -= 1;
    this.extractedVials += 1;

    return {
      success: true,
      status: 'NEUROTOXIN_VIAL_HARVESTED',
      totalVials: this.extractedVials,
      potencyScore: 85,
      bladePoisonDamageBonus: 85.0
    };
  }

  /**
   * Met à jour le chronomètre de paralysie par pas de temps delta
   * @param {number} deltaSeconds
   */
  updateParalysis(deltaSeconds) {
    if (!this.targetAfflicted) {
      return { active: false, remaining: 0 };
    }

    this.paralysisTimerRemaining = Math.max(0.0, this.paralysisTimerRemaining - deltaSeconds);
    if (this.paralysisTimerRemaining === 0.0) {
      this.targetAfflicted = false;
      return { active: false, status: 'NEUROMUSCULAR_RECOVERY_COMPLETE' };
    }

    return {
      active: true,
      status: 'PARALYSIS_ACTIVE',
      remainingSeconds: parseFloat(this.paralysisTimerRemaining.toFixed(2))
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'Predators2010NeurotoxicFloraSporeSector',
      plantSpecies: this.plantSpecies,
      glandsRemaining: this.sporeGlandsRemaining,
      targetAfflicted: this.targetAfflicted,
      paralysisTimerRemaining: this.paralysisTimerRemaining,
      extractedVials: this.extractedVials
    };
  }
}
