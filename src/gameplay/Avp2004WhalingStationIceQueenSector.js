/**
 * Avp2004WhalingStationIceQueenSector.js
 * 
 * Chantier Level Design #3 - Station Baleinière sous Blizzard & Précipice de la Reine Xénomorphe.
 * Canonical 1:1 Alien vs Predator (2004) fidelity:
 * - Bouvet Island surface whaling station: abandoned wooden huts, rusty iron boilers, howling Antarctic blizzard.
 * - Arctic glacier ice sheet mechanics:
 *   - Ice thickness 4.5m, slippery traction (friction coeff mu = 0.12), wind gusts up to 24 m/s.
 *   - Massive ocean crevasse drop at the edge of the ice shelf.
 * - Climax against the 6-ton Xenomorph Queen:
 *   - Scar Predator and Lex Woods loop heavy steel towing cables around the Queen's crest.
 *   - Anchor the cable to a massive iron water tower perched on the verge of the precipice.
 *   - Scar severs the water tower struts, sending the tower plunging into the ocean abyss, dragging the Queen
 *     screeching down to the icy sea bottom.
 */

export class Avp2004WhalingStationIceQueenSector {
  /**
   * @param {Object} options
   * @param {number} [options.blizzardWindMps=24.0]
   */
  constructor(options = {}) {
    this.blizzardWindMps = options.blizzardWindMps ?? 24.0;
    this.glacierTraversed = false;
    this.queenTethered = false;
    this.waterTowerDropped = false;
  }

  /**
   * Traverses the slippery glacier ice sheet during the blizzard.
   * @returns {Object} Glacier navigation telemetry
   */
  traverseGlacierIceSheet() {
    this.glacierTraversed = true;

    return {
      success: true,
      glacierTraversed: true,
      surfaceTempC: -35.0,
      blizzardWindMps: this.blizzardWindMps,
      iceTractionMu: 0.12,
      iceCrevasseRiskHigh: true,
      blizzardWhiteoutAcousticDb: 98,
      whalingStationBoilersVisible: true
    };
  }

  /**
   * Tethers the charging Xenomorph Queen with industrial steel cable.
   * @returns {Object} Tethering telemetry
   */
  tetherXenomorphQueen() {
    if (!this.glacierTraversed) {
      return { success: false, reason: 'MUST_REACH_ICE_SHELF_FIRST' };
    }

    this.queenTethered = true;

    return {
      success: true,
      queenTethered: true,
      queenMassTonnes: 6.0,
      steelCableDiameterCm: 5.5,
      cableTensileLimitN: 85000.0,
      waterTowerAnchored: true,
      queenScreechAcousticDb: 118
    };
  }

  /**
   * Drops the water tower off the ice cliff into the freezing ocean abyss, dragging the Queen down.
   * @returns {Object} Queen defeat outcome
   */
  dropWaterTowerIntoAbyss() {
    if (!this.queenTethered) {
      return { success: false, reason: 'QUEEN_NOT_TETHERED' };
    }

    this.waterTowerDropped = true;

    return {
      success: true,
      waterTowerDropped: true,
      towerPlungeElevationM: 90.0,
      oceanImpactSplashAcousticDb: 126,
      queenDraggedIntoAbyss: true,
      queenDefeatedPermanently: true,
      elderPredatorShipApproaching: true,
      honorSpearAwardedToLex: true,
      campaignCompletedScore: 2000
    };
  }
}
