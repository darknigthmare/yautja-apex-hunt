/**
 * Prey1719GrizzlyBearShowdownSector.js
 *
 * Chantier de Level Design 2 (v190) - Prey (2022) Giant Grizzly Bear Riverbank Duel
 * 1:1 Canonical Level Design:
 * - Enraged 800 kg North American apex grizzly bear dripping with river rapids water.
 * - Hollow rotting river driftwood log providing tight claustrophobic cover for Naru.
 * - Single-arm overhead lift of the thrashing 800 kg beast by the towering Feral Predator.
 * - Hydraulic skull-fracturing punch and cloaking shimmer wash of streaming visceral bear blood.
 */

export class Prey1719GrizzlyBearShowdownSector {
  /**
   * @param {Object} options
   * @param {number} [options.bearWeightKg=800.0] Poids du grizzli géant (kg)
   * @param {number} [options.hollowLogLengthM=4.8] Longueur du tronc creux refuge (m)
   */
  constructor(options = {}) {
    this.bearWeightKg = options.bearWeightKg ?? 800.0;
    this.hollowLogLengthM = options.hollowLogLengthM ?? 4.8;

    // État runtime
    this.hollowLogSheltered = false;
    this.bearChargeInitiated = false;
    this.feralInterventionActive = false;
    this.bearLiftedSingleHanded = false;
    this.hydraulicPunchDelivered = false;
    this.cloakBloodWashoutActive = false;
  }

  /**
   * Se réfugier d'urgence dans le tronc creux au bord de l'eau
   */
  takeShelterInHollowLog() {
    this.hollowLogSheltered = true;

    return {
      status: 'HOLLOW_LOG_SHELTER_OCCUPIED',
      logLengthM: this.hollowLogLengthM,
      bearSwipesDeflectedByWood: true,
      logIntegrityPct: 65.0,
      confinedVisibilityActive: true
    };
  }

  /**
   * Déclencher la charge furieuse du grizzli vers la rivière
   */
  triggerGrizzlyCharge() {
    this.bearChargeInitiated = true;

    return {
      status: 'GRIZZLY_BEAR_CHARGE_UNLEASHED',
      bearWeightKg: this.bearWeightKg,
      chargeSpeedMps: 12.5,
      kineticImpactJoules: 62500.0,
      riverbankMudSplashes: true
    };
  }

  /**
   * Intervention titanesque du Feral Predator : soulèvement à une main
   */
  executeFeralPredatorSingleHandLift() {
    this.feralInterventionActive = true;
    this.bearLiftedSingleHanded = true;

    return {
      status: 'FERAL_PREDATOR_SINGLE_HAND_LIFT_EXECUTED',
      liftForceNewtons: this.bearWeightKg * 9.81 * 1.5,
      bearThrashingDisabled: true,
      feralElevationAboveWaterM: 2.3,
      hydraulicMusculatureEngaged: true
    };
  }

  /**
   * Coup de poing hydraulique fracassant le crâne du grizzli
   */
  deliverSkullFracturingPunch() {
    if (!this.bearLiftedSingleHanded) {
      return { status: 'FAILED_BEAR_NOT_LIFTED', success: false };
    }

    this.hydraulicPunchDelivered = true;
    this.cloakBloodWashoutActive = true;

    return {
      status: 'GRIZZLY_SKULL_FRACTURED_INSTANT_KILL',
      punchVelocityMps: 28.0,
      kineticEnergyJoules: 14500.0,
      bloodWashoutRevealingCloak: true,
      trophyGrizzlySkullClaimed: true,
      honorScoreGranted: 400
    };
  }
}
