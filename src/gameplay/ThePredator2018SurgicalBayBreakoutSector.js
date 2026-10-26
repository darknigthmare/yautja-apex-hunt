/**
 * ThePredator2018SurgicalBayBreakoutSector.js
 *
 * Chantier de Level Design 2 (v186) - The Predator (2018)
 * 1:1 Canonical Level Design: Stargazer Cleanroom Surgical Table Restraint Snap
 *
 * Canonical Scene: The sedated Fugitive Predator lies strapped to the titanium surgical examination table
 * in the Stargazer cleanroom lab. When Dr. Bracket approaches with an electric bone saw, the Fugitive awakens,
 * snaps the magnetic hydraulic restraints (threshold >= 3,400 N), hurls orderlies across the cleanroom,
 * and shatters the reinforced observation glass (25mm laminated polycarbonate).
 */

export class ThePredator2018SurgicalBayBreakoutSector {
  /**
   * @param {Object} options
   * @param {number} [options.restraintTensileThresholdN=3400.0] Résistance de rupture des sangles magnétiques (N)
   * @param {number} [options.observationGlassThicknessMm=25.0] Épaisseur de la vitre de sécurité (mm)
   * @param {number} [options.orderliesCount=4] Nombre d'infirmiers armés de scalpels dans la salle
   */
  constructor(options = {}) {
    this.restraintTensileThresholdN = options.restraintTensileThresholdN ?? 3400.0;
    this.observationGlassThicknessMm = options.observationGlassThicknessMm ?? 25.0;
    this.orderliesCount = options.orderliesCount ?? 4;

    // État runtime
    this.sedationActive = true;
    this.restraintsSnapped = false;
    this.orderliesNeutralized = 0;
    this.observationGlassShattered = false;
    this.drBracketSpared = false; // Le Fugitive épargne Bracket car désarmée
    this.cleanroomAlarmsTriggered = false;
  }

  /**
   * Réveil brutal du Fugitive brisant la sédation
   */
  breakChemicalSedation() {
    this.sedationActive = false;
    return {
      status: 'CHEMICAL_SEDATION_METABOLIZED',
      fugitiveVitalsAwake: true,
      heartRateBpm: 185.0
    };
  }

  /**
   * Rupture explosive des sangles magnétiques en titane
   * @param {number} appliedMuscularForceN Force de poussée des biceps (N)
   */
  snapSurgicalRestraints(appliedMuscularForceN = 4200.0) {
    if (this.sedationActive) {
      return { success: false, reason: 'PREDATOR_STILL_SEDATED' };
    }

    if (appliedMuscularForceN >= this.restraintTensileThresholdN) {
      this.restraintsSnapped = true;
      this.cleanroomAlarmsTriggered = true;

      return {
        success: true,
        status: 'SURGICAL_RESTRAINTS_SNAPPED_EXPLOSIVELY',
        appliedForceN: appliedMuscularForceN,
        magneticClampsDestroyed: 4,
        cleanroomAlarmDb: 104.0
      };
    }

    return {
      success: false,
      reason: 'INSUFFICIENT_FORCE_RESTRAINTS_HOLD'
    };
  }

  /**
   * Neutralisation physique des gardes et infirmiers
   * @param {number} count Nombre de gardes neutralisés
   */
  neutralizeOrderlies(count = 4) {
    if (!this.restraintsSnapped) {
      return { success: false, reason: 'RESTRAINED_CANNOT_ATTACK' };
    }

    this.orderliesNeutralized = Math.min(this.orderliesCount, this.orderliesNeutralized + count);
    this.drBracketSpared = true; // Respect du code d'honneur (inerme et non hostile)

    return {
      success: true,
      status: 'ORDERLIES_NEUTRALIZED',
      neutralizedCount: this.orderliesNeutralized,
      drBracketStatus: 'SPARED_UNARMED_NON_THREAT',
      honorCodeCompliant: true
    };
  }

  /**
   * Éclatement de la baie vitrée d'observation et évasion vers les couloirs
   */
  shatterObservationWindow() {
    if (!this.restraintsSnapped) {
      return { success: false, reason: 'STILL_RESTRAINED' };
    }

    this.observationGlassShattered = true;
    return {
      success: true,
      status: 'POLYCARBONATE_GLASS_SHATTERED',
      glassThicknessMm: this.observationGlassThicknessMm,
      impactJoules: 2850.0,
      hallwayAccessGranted: true
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'ThePredator2018SurgicalBayBreakoutSector',
      sedationActive: this.sedationActive,
      restraintsSnapped: this.restraintsSnapped,
      orderliesNeutralized: this.orderliesNeutralized,
      observationGlassShattered: this.observationGlassShattered,
      drBracketSpared: this.drBracketSpared
    };
  }
}
