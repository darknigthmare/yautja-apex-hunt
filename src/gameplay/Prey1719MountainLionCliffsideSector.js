/**
 * Prey1719MountainLionCliffsideSector.js
 *
 * Chantier de Level Design 1 (v191) - Prey (2022) Limestone Cliffside Ridge & Mountain Lion Stalking
 * 1:1 Canonical Level Design:
 * - High alpine limestone cliffside canyon ridge with crumbling scree slopes.
 * - Dead pine tree branch overhanging an 18-meter vertical drop into the valley ravine.
 * - Stalking paw tracks with the canine companion Sarii.
 * - Cougar leap ambush, cliff fall mechanics, and the Feral Predator gutting the cougar aloft.
 */

export class Prey1719MountainLionCliffsideSector {
  /**
   * @param {Object} options
   * @param {number} [options.cliffElevationM=18.0] Hauteur de la crête calcaire (m)
   * @param {number} [options.screeStabilityRatio=0.65] Stabilité du pierrier calcaire
   */
  constructor(options = {}) {
    this.cliffElevationM = options.cliffElevationM ?? 18.0;
    this.screeStabilityRatio = options.screeStabilityRatio ?? 0.65;

    // État runtime
    this.pawTracksDiscovered = false;
    this.overhangPerchReached = false;
    this.cougarAmbushTriggered = false;
    this.cliffLedgeFallSurvived = false;
    this.feralCougarTrophyObserved = false;
  }

  /**
   * Découvrir et suivre les empreintes de puma dans le calcaire
   * @param {number} trackingSkillRatio Facteur de pistage avec Sarii
   */
  discoverCougarTracksWithCanine(trackingSkillRatio = 0.95) {
    this.pawTracksDiscovered = trackingSkillRatio >= 0.7;

    return {
      status: this.pawTracksDiscovered ? 'COUGAR_PAW_TRACKS_PINPOINTED' : 'TRACKS_OBSCURED_BY_SCREE',
      discovered: this.pawTracksDiscovered,
      canineAlertState: 'LOW_GROWL_INDICATING_PROXIMITY',
      cliffElevationM: this.cliffElevationM
    };
  }

  /**
   * S'approcher de la branche morte en surplomb du précipice
   */
  reachOverhangingPinePerch() {
    this.overhangPerchReached = true;

    return {
      status: 'OVERHANGING_PINE_PERCH_REACHED',
      elevationAboveRavineM: this.cliffElevationM,
      screeFrictionCoefficient: 0.35,
      windVelocityMps: 8.5,
      unstableFootingWarning: true
    };
  }

  /**
   * Déclencher le bond du cougar et la chute depuis la corniche
   */
  triggerCougarAmbushAndLedgeFall() {
    this.cougarAmbushTriggered = true;
    this.cliffLedgeFallSurvived = true;

    return {
      status: 'COUGAR_POUNCE_CAUSED_LEDGE_FALL',
      verticalFallDistanceM: this.cliffElevationM,
      fallDamageMitigatedByBranches: true,
      concussionDurationSeconds: 4.0,
      awakeningInRavine: true
    };
  }

  /**
   * Observer le Feral Predator dépeçant le puma suspendu à une branche
   */
  observeFeralCougarTrophyHarvest() {
    this.feralCougarTrophyObserved = true;

    return {
      status: 'FERAL_COUGAR_TROPHY_HARVEST_WITNESSED',
      trophyType: 'APEX_FELINE_SPINAL_COLUMN_AND_PELT',
      shimmerCloakDropletsActive: true,
      intimidationFactor: 1.0,
      honorScoreGranted: 250
    };
  }
}
