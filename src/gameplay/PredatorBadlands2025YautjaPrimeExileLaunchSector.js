/**
 * PredatorBadlands2025YautjaPrimeExileLaunchSector.js
 *
 * Chantier de Level Design 1 (v197) - Predator: Badlands (2025)
 * Prologue on Yautja Prime: Dek & Kwei Sparring, Njohrr's Judgment & Sacrificial Launch
 * 1:1 Canonical Level Design:
 * - Basalt sparring ring on Yautja Prime where outcast "runt" Dek trains with his older brother Kwei.
 * - Ruthless clan father Njohrr decreeing Dek's execution for perceived physical weakness.
 * - Kwei defying Njohrr, shoving Dek into a single-occupant scout drop pod, sealing the bulkhead,
 *   and triggering remote orbital launch toward Genna while Njohrr executes Kwei.
 */

export class PredatorBadlands2025YautjaPrimeExileLaunchSector {
  /**
   * @param {Object} options
   * @param {number} [options.dekStatureHeightM=2.05] Taille de Dek (plus petit que la moyenne Yautja) (m)
   * @param {number} [options.escapePodThrustKn=1450.0] Poussée des propulseurs de la capsule (kN)
   */
  constructor(options = {}) {
    this.dekStatureHeightM = options.dekStatureHeightM ?? 2.05;
    this.escapePodThrustKn = options.escapePodThrustKn ?? 1450.0;

    this.brotherSparringCompleted = false;
    this.njohrrExecutionDecreed = false;
    this.kweiPodOverrideLocked = false;
    this.orbitalExileLaunched = false;
  }

  completeSparringBoutWithBrotherKwei() {
    this.brotherSparringCompleted = true;
    return {
      status: 'BROTHER_KWEI_SPARRING_BOUT_COMPLETED',
      dekStatureHeightM: this.dekStatureHeightM,
      agilityCompensationBonusPct: 35.0,
      fraternalBondLoyaltyPct: 100.0
    };
  }

  witnessFatherNjohrrExecutionDecree() {
    if (!this.brotherSparringCompleted) {
      return { status: 'FAILED_SPARRING_NOT_COMPLETED', success: false };
    }
    this.njohrrExecutionDecreed = true;
    return {
      status: 'NJOHRR_CLAN_EXECUTION_DECREE_ISSUED',
      clanVerdict: 'OUTCAST_RUNT_TERMINATION',
      kweiDefianceTriggered: true
    };
  }

  lockDekInsideScoutDropPod() {
    if (!this.njohrrExecutionDecreed) {
      return { status: 'FAILED_NO_IMMINENT_DECREE', success: false };
    }
    this.kweiPodOverrideLocked = true;
    return {
      status: 'DEK_LOCKED_IN_SCOUT_DROP_POD_BY_KWEI',
      bulkheadHermeticallySealed: true,
      kweiHeirloomGauntletPassed: true,
      destinationCoordinates: 'GENNA_DEATH_PLANET'
    };
  }

  triggerSacrificialOrbitalLaunch() {
    if (!this.kweiPodOverrideLocked) {
      return { status: 'FAILED_POD_NOT_SEALED', success: false };
    }
    this.orbitalExileLaunched = true;
    return {
      status: 'SACRIFICIAL_ORBITAL_LAUNCH_EXECUTED',
      escapePodThrustKn: this.escapePodThrustKn,
      kweiSacrificeWitnessedFromViewport: true,
      bloodOathVengeanceSworn: true,
      honorScoreGranted: 350
    };
  }
}
