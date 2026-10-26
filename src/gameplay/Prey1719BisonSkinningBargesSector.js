/**
 * Prey1719BisonSkinningBargesSector.js
 *
 * Chantier de Level Design 1 (v193) - Prey (2022) French Voyageurs' River Ferry & Bison Skinning Barges
 * 1:1 Canonical Level Design:
 * - Flat wooden skinning barges and river ferry crossing moored in muddy alpine river shallows.
 * - Piles of slaughtered buffalo carcasses stripped of hides, leaving rotting remains that attract apex scavengers.
 * - Blood slicks on wet pine deck planks (friction coefficient mu = 0.22) and swarming blowflies obscuring vision.
 * - Discovering the discarded, wastefully hunted bison herd triggering Naru's pursuit of the foreign trappers.
 */

export class Prey1719BisonSkinningBargesSector {
  /**
   * @param {Object} options
   * @param {number} [options.bargesCount=3] Nombre de barges d'écorchage amarrées
   * @param {number} [options.skinnedBisonCount=48] Nombre de carcasses de bisons dépouillées
   */
  constructor(options = {}) {
    this.bargesCount = options.bargesCount ?? 3;
    this.skinnedBisonCount = options.skinnedBisonCount ?? 48;

    // État runtime
    this.bargesBoarded = false;
    this.bisonWasteWitnessed = false;
    this.deckBloodSlickNavigated = false;
    this.blowflySwarmDispersed = false;
    this.bargePlankFrictionMu = 0.22;
  }

  /**
   * Monter à bord des barges d'écorchage en bois
   */
  boardSkinningBarges() {
    this.bargesBoarded = true;

    return {
      status: 'SKINNING_BARGES_BOARDED',
      bargesCount: this.bargesCount,
      deckWaterDepthCm: 8.5,
      bloodSlickHazardActive: true,
      stenchRadiusM: 85.0
    };
  }

  /**
   * Découvrir le massacre dishonorable des bisons laissés à pourrir
   */
  witnessDishonorableBisonSlaughter() {
    this.bisonWasteWitnessed = true;

    return {
      status: 'DISHONORABLE_BISON_SLAUGHTER_WITNESSED',
      skinnedCarcassesCount: this.skinnedBisonCount,
      comancheHuntingCodeViolated: true,
      foreignTrapperTracksIdentified: true,
      motivationVengeanceUnlocked: true
    };
  }

  /**
   * Traverser le pont glissant couvert de sang sans chuter
   * @param {number} footingAgilityRatio Facteur d'agilité sur surface glissante (0.0 à 1.0)
   */
  navigateBloodSlickPlanks(footingAgilityRatio = 0.85) {
    this.deckBloodSlickNavigated = footingAgilityRatio >= 0.6;

    return {
      status: this.deckBloodSlickNavigated ? 'BLOOD_SLICK_PLANKS_TRAVERSED_SAFELY' : 'SLIPPED_ON_BLOOD_PLANK',
      stable: this.deckBloodSlickNavigated,
      frictionMu: this.bargePlankFrictionMu,
      riverShallowsCrossed: true
    };
  }

  /**
   * Disperser l'essaim de mouches carnassières à la torche
   */
  disperseBlowflySwarm() {
    this.blowflySwarmDispersed = true;

    return {
      status: 'BLOWFLY_SWARM_DISPERSED_BY_FIRE',
      visibilityRestoredPct: 100.0,
      trapperTrailRevealedInMud: true
    };
  }
}
