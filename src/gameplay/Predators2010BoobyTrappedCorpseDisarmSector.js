/**
 * Predators2010BoobyTrappedCorpseDisarmSector.js
 *
 * Chantier de Level Design 4 (v185) - Predators (2010)
 * 1:1 Canonical Level Design: Concealed Anti-Personnel Heel Booby-Trap Disarm QTE
 *
 * Canonical Scene: After silencing the voice decoy, the squad inspects Cuchillo's corpse.
 * Royce spots a monofilament trigger line hooked directly to the heel of Cuchillo's boot,
 * wired to two concealed directional alien plasma mines. The player must cut the anchor wire
 * with precision pliers under a 4.0s countdown before tension triggers a 360-degree lethal blast.
 */

export class Predators2010BoobyTrappedCorpseDisarmSector {
  /**
   * @param {Object} options
   * @param {number} [options.disarmTimeLimitSeconds=4.0] Temps imparti pour désamorcer le piège (s)
   * @param {number} [options.plasmaMineLethalRadiusM=12.0] Rayon létal des mines de plasma jumelées (m)
   * @param {number} [options.wireTensionThresholdN=18.0] Seuil de tension de détente (N)
   */
  constructor(options = {}) {
    this.disarmTimeLimitSeconds = options.disarmTimeLimitSeconds ?? 4.0;
    this.plasmaMineLethalRadiusM = options.plasmaMineLethalRadiusM ?? 12.0;
    this.wireTensionThresholdN = options.wireTensionThresholdN ?? 18.0;

    // État runtime
    this.heelTrapSpotted = false;
    this.disarmInProgress = false;
    this.disarmTimerRemaining = this.disarmTimeLimitSeconds;
    this.wireSeveredSafely = false;
    this.trapDetonated = false;
    this.plasmaMinesDisarmed = false;
  }

  /**
   * Inspection médico-légale du cadavre et découverte du piège aux talons
   */
  inspectCorpseHeels() {
    this.heelTrapSpotted = true;
    this.disarmInProgress = true;
    this.disarmTimerRemaining = this.disarmTimeLimitSeconds;

    return {
      status: 'HEEL_BOOBY_TRAP_DISCOVERED',
      warning: 'DUAL_PLASMA_MINES_ATTACHED_TO_BOOTS',
      timeLimitSeconds: this.disarmTimeLimitSeconds,
      wireTensionLimitN: this.wireTensionThresholdN
    };
  }

  /**
   * Mise à jour du compte à rebours de désamorçage
   * @param {number} deltaSeconds
   */
  updateDisarmTimer(deltaSeconds) {
    if (!this.disarmInProgress || this.wireSeveredSafely || this.trapDetonated) {
      return { active: false };
    }

    this.disarmTimerRemaining = Math.max(0.0, this.disarmTimerRemaining - deltaSeconds);
    if (this.disarmTimerRemaining === 0.0) {
      this.trapDetonated = true;
      this.disarmInProgress = false;
      return {
        active: false,
        status: 'TIME_EXPIRED_DUAL_PLASMA_MINES_DETONATED',
        blastRadiusM: this.plasmaMineLethalRadiusM,
        lethalBlastShockwave: true
      };
    }

    return {
      active: true,
      status: 'DISARM_COUNTDOWN_TICKING',
      remainingSeconds: parseFloat(this.disarmTimerRemaining.toFixed(2))
    };
  }

  /**
   * Coupe nette du câble de détente avec la pince coupe-fil tactique
   * @param {number} appliedTensionN Tension exercée sur le fil pendant la coupe (N)
   */
  snipHeelTripwire(appliedTensionN = 10.0) {
    if (!this.disarmInProgress) {
      return { success: false, reason: 'NOT_IN_DISARM_SEQUENCE' };
    }

    if (appliedTensionN >= this.wireTensionThresholdN) {
      this.trapDetonated = true;
      this.disarmInProgress = false;
      return {
        success: false,
        status: 'WIRE_SNAPPED_TENSION_TRIGGERED_MINES',
        detonated: true
      };
    }

    this.wireSeveredSafely = true;
    this.plasmaMinesDisarmed = true;
    this.disarmInProgress = false;

    return {
      success: true,
      status: 'HEEL_TRIPWIRE_SAFELY_SEVERED',
      plasmaMinesSalvaged: 2,
      salvagedEnergyJoules: 1400.0,
      honorScoreGranted: 200
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'Predators2010BoobyTrappedCorpseDisarmSector',
      heelTrapSpotted: this.heelTrapSpotted,
      wireSeveredSafely: this.wireSeveredSafely,
      trapDetonated: this.trapDetonated,
      disarmTimerRemaining: this.disarmTimerRemaining,
      plasmaMinesDisarmed: this.plasmaMinesDisarmed
    };
  }
}
