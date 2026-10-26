/**
 * Prey1719RaphaelAdoliniFlintlockSector.js
 *
 * Chantier de Level Design 3 (v192) - Prey (2022) Raphael Adolini 1715 Flintlock Pistol & Powder Priming
 * 1:1 Canonical Level Design:
 * - Wounded French voyageur Raphael Adolini dying from a severed leg injury.
 * - Medical barter exchange: administering pain relief herbs in return for firearm instruction.
 * - Realistic 5-step black powder flintlock loading sequence: powder horn measure, lead ball & patch ramming, flash pan priming, and frizzen cocking.
 * - Engraved brass lockplate bearing the canonical inscription: "Raphael Adolini 1715" (connecting to Predator 2).
 */

export class Prey1719RaphaelAdoliniFlintlockSector {
  /**
   * @param {Object} options
   * @param {number} [options.caliberMm=15.2] Calibre de la balle en plomb (.60 in / 15.2 mm)
   * @param {number} [options.powderChargeGrains=60] Charge de poudre noire en grains
   */
  constructor(options = {}) {
    this.caliberMm = options.caliberMm ?? 15.2;
    this.powderChargeGrains = options.powderChargeGrains ?? 60;

    // État runtime du chargement
    this.triageHerbsAdministered = false;
    this.barrelPowderPoured = false;
    this.leadBallRammed = false;
    this.flashPanPrimed = false;
    this.hammerCocked = false;
    this.pistolReadyToFire = false;
    this.inscriptionRead = false;
  }

  /**
   * Donner des herbes calmantes à Raphael Adolini en échange de l'instruction
   */
  administerTriageToRaphael() {
    this.triageHerbsAdministered = true;

    return {
      status: 'RAPHAEL_ADOLINI_TRIAGE_COMPLETED',
      legTourniquetApplied: true,
      firearmInstructionUnlocked: true,
      trapperTrustGained: true
    };
  }

  /**
   * Lire l'inscription gravée sur la platine en laiton du pistolet
   */
  inspectPistolInscription() {
    this.inscriptionRead = true;

    return {
      status: 'PISTOL_INSCRIPTION_AUTHENTICATED',
      engraving: 'Raphael Adolini 1715',
      canonChronologyLink: 'PREDATOR_2_ELDER_GREYBACK_TROPHY',
      flintGrade: 'ENGLISH_AMBER_FLINT',
      brassInlayCondition: 'PRISTINE'
    };
  }

  /**
   * Exécuter le chargement complet du pistolet à silex
   */
  loadAndPrimeFlintlockPistol() {
    if (!this.triageHerbsAdministered) {
      return { status: 'FAILED_INSTRUCTION_NOT_UNLOCKED', loaded: false };
    }

    this.barrelPowderPoured = true;
    this.leadBallRammed = true;
    this.flashPanPrimed = true;
    this.hammerCocked = true;
    this.pistolReadyToFire = true;

    return {
      status: 'FLINTLOCK_PISTOL_FULLY_PRIMED_AND_COCKED',
      caliberMm: this.caliberMm,
      powderGrains: this.powderChargeGrains,
      leadBallSeatedInBore: true,
      panClosed: true,
      readyToDischarge: this.pistolReadyToFire
    };
  }

  /**
   * Décharger le pistolet à silex à bout portant
   */
  dischargeFlintlockPistol() {
    if (!this.pistolReadyToFire) {
      return { status: 'FAILED_PISTOL_NOT_LOADED', discharged: false };
    }

    this.pistolReadyToFire = false;
    this.hammerCocked = false;

    return {
      status: 'FLINTLOCK_PISTOL_DISCHARGED_LETHAL_HIT',
      kineticImpactJoules: 1850.0,
      muzzleFlashLumens: 38000,
      denseSmokeCloudM: 2.5,
      leadBallPerforation: true
    };
  }
}
