/**
 * Predators2010MombasaPunjiDeadfallTrapSector.js
 *
 * Chantier de Level Design 2 (v184) - Predators (2010)
 * 1:1 Canonical Level Design: Concealed Punji Stake Pit & Counterweighted Deadfall Trap
 *
 * Canonical Scene: While navigating the alien jungle, Mombasa trips a camouflaged vine trigger.
 * A 200kg mahogany deadfall counterweight crashes downward, dropping the earth beneath his feet
 * into a 4.2m deep pit lined with sharpened bamboo punji stakes (penetration force >= 2,400 N).
 * The squad must perform an emergency extraction before secondary tripwires trigger.
 */

export class Predators2010MombasaPunjiDeadfallTrapSector {
  /**
   * @param {Object} options
   * @param {number} [options.pitDepthM=4.2] Profondeur de la fosse dissimulée (m)
   * @param {number} [options.deadfallMassKg=200.0] Masse du tronc de contrepoids (kg)
   * @param {number} [options.punjiStakesCount=18] Nombre de pieux punji en bambou durci au feu
   */
  constructor(options = {}) {
    this.pitDepthM = options.pitDepthM ?? 4.2;
    this.deadfallMassKg = options.deadfallMassKg ?? 200.0;
    this.punjiStakesCount = options.punjiStakesCount ?? 18;

    // Constantes mécaniques
    this.triggerTripwireTensionN = 45.0; // Fil discret à basse tension
    this.penetrationResistanceThresholdN = 2400.0;
    this.secondaryTripwireActive = true;

    // État runtime
    this.trapDetectedByScout = false;
    this.trapSpring = false;
    this.victimTrapped = false;
    this.extractionCompleted = false;
    this.pitCoverCamouflageIntegrityPct = 100.0;
  }

  /**
   * Détection préventive par un éclaireur vigilant (recherche de feuillage suspect)
   * @param {number} scoutPerceptionSkill Compétence de pistage (0 -> 100)
   */
  scoutJunglePath(scoutPerceptionSkill = 85) {
    if (scoutPerceptionSkill >= 75) {
      this.trapDetectedByScout = true;
      return {
        status: 'TRAP_DETECTED_PUNJI_DEADFALL_IDENTIFIED',
        pitDepthM: this.pitDepthM,
        deadfallMassKg: this.deadfallMassKg,
        punjiCount: this.punjiStakesCount,
        safePathMarked: true
      };
    }

    return {
      status: 'PATH_APPEARS_CLEAR_DANGER_LURKING',
      warning: 'CAMOUFLAGED_SOIL_UNNOTICED'
    };
  }

  /**
   * Déclenchement accidentel du piège si le fil est heurté sans précaution
   * @param {number} tripwireTensionApplied
   */
  triggerDeadfallTrap(tripwireTensionApplied = 65.0) {
    if (this.trapDetectedByScout) {
      return { status: 'TRAP_BYPASSED_SAFE_CROSSING' };
    }

    if (tripwireTensionApplied >= this.triggerTripwireTensionN) {
      this.trapSpring = true;
      this.victimTrapped = true;
      this.pitCoverCamouflageIntegrityPct = 0.0;

      const impactEnergyJoules = this.deadfallMassKg * 9.81 * 3.5; // ~6867 J
      return {
        status: 'DEADFALL_SNAPPED_PIT_COLLAPSE',
        pitDepthM: this.pitDepthM,
        impactEnergyJoules: parseFloat(impactEnergyJoules.toFixed(1)),
        punjiThreatLethal: true,
        victimImmobilized: true,
        emergencyExtractionRequired: true
      };
    }

    return {
      status: 'WIRE_LIGHTLY_BRUSHED_NO_RELEASE'
    };
  }

  /**
   * Extraction d'urgence de la victime à l'aide d'une corde tactique ou du fusil
   * @param {number} teamAssistanceForceN Force de traction de l'escouade (N)
   */
  performEmergencyExtraction(teamAssistanceForceN = 1800.0) {
    if (!this.victimTrapped) {
      return { success: false, reason: 'NO_VICTIM_IN_PIT' };
    }

    if (teamAssistanceForceN >= 1200.0) {
      this.victimTrapped = false;
      this.extractionCompleted = true;
      this.secondaryTripwireActive = false; // Désamorcé avec précaution

      return {
        success: true,
        status: 'VICTIM_EXTRACTED_SAFELY',
        punjiWoundsTreated: true,
        honorTeamworkBonus: 150
      };
    }

    return {
      success: false,
      status: 'INSUFFICIENT_PULLING_FORCE_VICTIM_STILL_SNAGS',
      requiredN: 1200.0
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'Predators2010MombasaPunjiDeadfallTrapSector',
      pitDepthM: this.pitDepthM,
      trapDetectedByScout: this.trapDetectedByScout,
      trapSpring: this.trapSpring,
      victimTrapped: this.victimTrapped,
      extractionCompleted: this.extractionCompleted,
      punjiStakesCount: this.punjiStakesCount
    };
  }
}
