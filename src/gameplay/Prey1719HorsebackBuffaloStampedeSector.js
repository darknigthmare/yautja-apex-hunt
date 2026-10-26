/**
 * Prey1719HorsebackBuffaloStampedeSector.js
 *
 * Chantier de Level Design 6 (v190) - Prey (2022) Taabe's Horseback Archery & Thundering Buffalo Stampede
 * 1:1 Canonical Level Design:
 * - Wide open golden prairie of the 1719 Northern Great Plains.
 * - Comanche war horse galloping at 15 m/s across rolling hills and tall prairie grasses.
 * - Precision horseback archery shooting flint-tipped cedar arrows into unarmored Yautja joints.
 * - Thundering stampede of 200 American bison / buffalo creating ground tremor seismic shocks that stagger the Feral Predator.
 */

export class Prey1719HorsebackBuffaloStampedeSector {
  /**
   * @param {Object} options
   * @param {number} [options.horseGallopSpeedMps=15.0] Vitesse de galop du cheval de guerre comanche (m/s)
   * @param {number} [options.bisonHerdCount=200] Nombre de bisons dans la harde en panique
   */
  constructor(options = {}) {
    this.horseGallopSpeedMps = options.horseGallopSpeedMps ?? 15.0;
    this.bisonHerdCount = options.bisonHerdCount ?? 200;

    // État runtime
    this.gallopCircleManeuverActive = false;
    this.flintArrowHitsScored = 0;
    this.buffaloStampedeTriggered = false;
    this.seismicTremorMagnitudeG = 0.0;
    this.feralPredatorStaggered = false;
  }

  /**
   * Exécuter une manœuvre équestre de cercle de guerre comanche
   */
  executeHorsebackCircleManeuver() {
    this.gallopCircleManeuverActive = true;

    return {
      status: 'COMANCHE_HORSEBACK_CIRCLE_MANEUVER_ACTIVE',
      gallopSpeedMps: this.horseGallopSpeedMps,
      turnRadiusM: 14.5,
      equineAgilityBonus: true,
      prairieDustScreenActive: true
    };
  }

  /**
   * Décocher une flèche en silex au galop sur le Feral Predator
   * @param {number} releaseTimingRatio Précision du tir en selle (0.0 à 1.0)
   */
  releaseHorsebackFlintArrow(releaseTimingRatio = 0.92) {
    if (!this.gallopCircleManeuverActive) {
      return { status: 'FAILED_HORSE_NOT_MANEUVERING', hit: false };
    }

    const hit = releaseTimingRatio >= 0.7;
    if (hit) {
      this.flintArrowHitsScored += 1;
    }

    return {
      status: hit ? 'FLINT_ARROW_LODGED_IN_YAUTJA_FLESH' : 'ARROW_DEFLECTED_OR_MISSED',
      hit,
      arrowVelocityMps: 68.0,
      totalHits: this.flintArrowHitsScored,
      iridescentBloodSpilled: hit
    };
  }

  /**
   * Diriger la harde de bisons en furie vers la position du Feral Predator
   */
  triggerBuffaloHerdStampede() {
    this.buffaloStampedeTriggered = true;
    this.seismicTremorMagnitudeG = 2.4;
    this.feralPredatorStaggered = true;

    return {
      status: 'THUNDERING_BUFFALO_STAMPEDE_ENGULFED_ARENA',
      bisonCount: this.bisonHerdCount,
      seismicTremorG: this.seismicTremorMagnitudeG,
      hoofRumbleDb: 108.0,
      feralPredatorStaggered: this.feralPredatorStaggered,
      opticalCloakingDisrupted: true
    };
  }
}
