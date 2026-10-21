/**
 * Predator2EasternColumbiaRooftopGargoyleSector.js
 * 
 * Chantier Level Design #5 - Toits Vertigineux de l'Eastern Columbia & Foudre au Zénith.
 * Canonical 1:1 Predator 2 (1990) fidelity:
 * - 40-story rooftop (140m elevation) of the historic Eastern Columbia Building in Downtown Los Angeles.
 * - Distinctive art deco architecture: turquoise glazed terracotta tile façades, ornate corner gargoyles, and copper spires.
 * - Vertical façade scaling: climbing rain downspouts, leap transitions between fire escape landings and copper cornices.
 * - The iconic cinematic victory ritual: City Hunter stands atop the tallest copper gargoyle holding a severed human arm aloft,
 *   illuminated by lightning strikes (120 dB thunderclaps) while bellowing his ferocious roar into the LA storm.
 * - Parapet footing mechanics: narrow 0.8m ledge, 18 m/s wind gusts, and lethal 140m vertical fall hazard.
 */

export class Predator2EasternColumbiaRooftopGargoyleSector {
  /**
   * @param {Object} options
   * @param {number} [options.roofElevationM=140.0]
   * @param {number} [options.parapetWidthM=0.8]
   */
  constructor(options = {}) {
    this.roofElevationM = options.roofElevationM ?? 140.0;
    this.parapetWidthM = options.parapetWidthM ?? 0.8;

    this.onGargoylePerch = false;
    this.lightningStrikeActive = false;
    this.victoryHowlEmitted = false;
  }

  /**
   * Scales the vertical art deco façade using gargoyles and copper cornices.
   * @param {number} climbSpeedMps
   * @returns {Object} Façade climbing telemetry
   */
  scaleTerracottaFaçade(climbSpeedMps = 3.5) {
    return {
      success: true,
      climbSpeedMps,
      façadeMaterial: 'TURQUOISE_GLAZED_TERRACOTTA',
      handholdGripMu: 0.78,
      roofElevationM: this.roofElevationM,
      fireEscapeTraversed: true,
      rainSlickGripWarning: false
    };
  }

  /**
   * Perches atop the corner copper gargoyle overlooking the city.
   * @returns {Object} Perch status
   */
  perchOnCornerGargoyle() {
    this.onGargoylePerch = true;

    return {
      success: true,
      onGargoylePerch: true,
      perchElevationM: this.roofElevationM + 6.0,
      panoramicViewAngleDeg: 360,
      windGustVelocityMps: 18.0,
      groundSirensAcousticDb: 58
    };
  }

  /**
   * Executes the iconic lightning thunderstorm victory ritual holding the trophy aloft.
   * @returns {Object} Lightning ritual outcome
   */
  executeLightningTrophyRitual() {
    if (!this.onGargoylePerch) {
      return { success: false, reason: 'MUST_BE_PERCHED_ON_GARGOYLE' };
    }

    this.lightningStrikeActive = true;
    this.victoryHowlEmitted = true;

    return {
      success: true,
      lightningStrikeActive: true,
      victoryHowlEmitted: true,
      severedArmHeldAloft: true,
      lightningPeakIlluminationLux: 150000,
      thunderclapAcousticDb: 120,
      victoryRoarAcousticDb: 108,
      cityHunterSilhouetteVisibleAcrossLA: true
    };
  }
}
