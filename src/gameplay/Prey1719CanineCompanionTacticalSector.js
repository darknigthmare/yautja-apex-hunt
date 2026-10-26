/**
 * Prey1719CanineCompanionTacticalSector.js
 *
 * Chantier de Level Design 6 (v191) - Prey (2022) Sarii the Canine Companion & Combat Assistance
 * 1:1 Canonical Level Design:
 * - Naru's faithful mixed-breed canine companion Sarii.
 * - Scent tracking alerting to camouflaged or concealed threats in dense vegetation.
 * - Vocal diversion bark drawing the Feral Predator's gaze away from ambush lines.
 * - Ankle-bite harrying attacks staggering the alien and retrieving dropped tomahawk tethers.
 */

export class Prey1719CanineCompanionTacticalSector {
  /**
   * @param {Object} options
   * @param {string} [options.canineName='Sarii'] Nom de la chienne fidèle
   * @param {number} [options.loyaltyRatingPct=100.0] Degré de loyauté et d'obéissance
   */
  constructor(options = {}) {
    this.canineName = options.canineName ?? 'Sarii';
    this.loyaltyRatingPct = options.loyaltyRatingPct ?? 100.0;

    // État runtime
    this.threatScentDetected = false;
    this.diversionBarkEmitted = false;
    this.ankleBiteExecuted = false;
    this.tomahawkRetrievedByMouth = false;
    this.canineInSafeCover = true;
  }

  /**
   * Flairer et signaler une présence menaçante tapie sous camouflage
   * @param {number} scentProximityM Distance de la piste odorante (m)
   */
  scentAlienPresence(scentProximityM = 22.0) {
    this.threatScentDetected = true;

    return {
      status: 'CANINE_SCENT_THREAT_DETECTED',
      canineName: this.canineName,
      scentDistanceM: scentProximityM,
      tailErectStance: true,
      earlyWarningAdvantageGranted: true
    };
  }

  /**
   * Émettre un aboiement de diversion tactique pour détourner le regard du chasseur
   */
  emitDiversionBark() {
    this.diversionBarkEmitted = true;

    return {
      status: 'DIVERSION_BARK_EMITTED_SUCCESSFULLY',
      canineName: this.canineName,
      predatorHeadTurnDeg: 90.0,
      ambushFlankWindowSeconds: 2.2,
      canineRepositioningAgile: true
    };
  }

  /**
   * Mordre la cheville du Feral Predator pour créer une ouverture critique
   */
  executeAnkleBiteHarass() {
    this.ankleBiteExecuted = true;
    this.canineInSafeCover = false;

    return {
      status: 'CANINE_ANKLE_BITE_LANDED',
      canineName: this.canineName,
      biteForceNewtons: 450.0,
      predatorStaggerSec: 1.5,
      canineRetreatToBrushSecured: true
    };
  }

  /**
   * Rapporter le tomahawk tombé à terre dans sa gueule
   */
  retrieveDroppedTomahawkToNaru() {
    this.tomahawkRetrievedByMouth = true;
    this.canineInSafeCover = true;

    return {
      status: 'TOMAHAWK_FETCHED_AND_DELIVERED',
      canineName: this.canineName,
      weaponRestoredToPlayer: true,
      loyaltyBonusAffirmed: true
    };
  }
}
