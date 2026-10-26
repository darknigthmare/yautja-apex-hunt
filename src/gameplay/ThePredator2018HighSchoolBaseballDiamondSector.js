/**
 * ThePredator2018HighSchoolBaseballDiamondSector.js
 *
 * Chantier de Level Design 3 (v189) - The Predator (2018) High School Baseball Diamond & Dugout Cover
 * 1:1 Canonical Level Design:
 * - Suburban high-school athletic sports complex (baseball diamond, dirt infield, outfield fences).
 * - Concrete sunken player dugout providing ballistic hard cover against high-velocity rifle fire.
 * - Chain-link mesh backstop, batting cages obstacle navigation, and dirt slide evasive maneuvers.
 * - Outfield halogen floodlight tower providing high-angle perch and vertical drop ambush points.
 */

export class ThePredator2018HighSchoolBaseballDiamondSector {
  /**
   * @param {Object} options
   * @param {number} [options.dugoutWallThicknessCm=20.0] Épaisseur du béton armé de l'abri des joueurs (cm)
   * @param {number} [options.infieldRadiusM=28.5] Rayon du champ intérieur de baseball (m)
   */
  constructor(options = {}) {
    this.dugoutWallThicknessCm = options.dugoutWallThicknessCm ?? 20.0;
    this.infieldRadiusM = options.infieldRadiusM ?? 28.5;

    // État runtime
    this.dugoutShelterOccupied = false;
    this.infieldSlideExecuted = false;
    this.chainLinkFenceVaulted = false;
    this.battingCagesNavigated = false;
    this.ballisticSuppressionDeflected = true;
  }

  /**
   * Se retrancher dans l'abri en béton des joueurs pour échapper aux rafales
   */
  takeDugoutBallisticCover() {
    this.dugoutShelterOccupied = true;

    return {
      status: 'DUGOUT_BALLISTIC_COVER_SECURED',
      concreteThicknessCm: this.dugoutWallThicknessCm,
      caliberProtectionRating: '7.62_NATO_AP_PROTECTED',
      playerSafetyIndex: 0.96,
      peekingVantageActive: true
    };
  }

  /**
   * Exécuter une glissade évasive sur la terre battue de l'infield
   * @param {number} slideDistanceM Distance glissée (m)
   */
  executeInfieldDirtSlide(slideDistanceM = 5.2) {
    this.infieldSlideExecuted = true;

    return {
      status: 'INFIELD_DIRT_SLIDE_COMPLETED',
      slideDistanceM,
      profileHeightReducedCm: 85.0,
      suppressiveFireDodged: true,
      dustCloudConcealmentSeconds: 2.8
    };
  }

  /**
   * Franchir le grillage de 4 mètres de haut du terrain de baseball
   */
  vaultChainLinkBackstop() {
    this.chainLinkFenceVaulted = true;

    return {
      status: 'CHAIN_LINK_BACKSTOP_VAULTED',
      fenceHeightM: 4.0,
      meshClimbSpeedMps: 3.2,
      outfieldTransitionOpened: true
    };
  }

  /**
   * Traverser la cage des batteurs pour piéger les poursuivants dans le filet
   */
  navigateBattingCageObstacle() {
    this.battingCagesNavigated = true;

    return {
      status: 'BATTING_CAGE_OBSTACLE_NAVIGATED',
      nylonNetTangleHazardActive: true,
      pursuersEntangled: 2,
      exitFlapSecured: true
    };
  }
}
