/**
 * ThePredator2018HalonGasAirlockSector.js
 *
 * Chantier de Level Design 3 (v186) - The Predator (2018)
 * 1:1 Canonical Level Design: Decontamination Airlock Halon Gas Flush & Backdraft Blast
 *
 * Canonical Scene: Stargazer security traps the Fugitive in the hermetic decontamination airlock.
 * They seal the hydraulic blast doors and flood the chamber with Halon 1301 gas (pressure 450 kPa, O2 < 10%).
 * The Fugitive grabs an oxygen cylinder, throws it into the overhead ventilation shaft, and triggers
 * a backdraft blast that blows the reinforced blast doors off their tracks.
 */

export class ThePredator2018HalonGasAirlockSector {
  /**
   * @param {Object} options
   * @param {number} [options.gasFloodPressureKpa=450.0] Pression d'injection du gaz Halon 1301 (kPa)
   * @param {number} [options.asphyxiationTimeLimitSeconds=25.0] Délai avant asphyxie critique (s)
   * @param {number} [options.blastDoorHp=400.0] Résistance de la porte étanche
   */
  constructor(options = {}) {
    this.gasFloodPressureKpa = options.gasFloodPressureKpa ?? 450.0;
    this.asphyxiationTimeLimitSeconds = options.asphyxiationTimeLimitSeconds ?? 25.0;
    this.blastDoorHp = options.blastDoorHp ?? 400.0;

    // État runtime
    this.airlockSealed = true;
    this.halonVenting = true;
    this.chamberOxygenPct = 20.9;
    this.timeRemainingSeconds = this.asphyxiationTimeLimitSeconds;
    this.oxygenCylinderGrabbed = false;
    this.backdraftDetonated = false;
    this.airlockBreached = false;
  }

  /**
   * Simulation du flux de gaz Halon diminuant l'oxygène
   * @param {number} deltaSeconds
   */
  updateAirlockAtmosphere(deltaSeconds) {
    if (this.airlockBreached) {
      this.chamberOxygenPct = Math.min(20.9, this.chamberOxygenPct + 4.0 * deltaSeconds);
      return {
        sealed: false,
        oxygenPct: parseFloat(this.chamberOxygenPct.toFixed(1)),
        status: 'ATMOSPHERE_VENTILATED'
      };
    }

    this.timeRemainingSeconds = Math.max(0.0, this.timeRemainingSeconds - deltaSeconds);
    this.chamberOxygenPct = Math.max(6.0, this.chamberOxygenPct - 0.55 * deltaSeconds);

    const isLethal = this.chamberOxygenPct <= 10.0;

    return {
      sealed: true,
      oxygenPct: parseFloat(this.chamberOxygenPct.toFixed(1)),
      gasPressureKpa: this.gasFloodPressureKpa,
      timeRemainingSeconds: parseFloat(this.timeRemainingSeconds.toFixed(1)),
      isLethalAsphyxiation: isLethal
    };
  }

  /**
   * Saisie de la bonbonne d'oxygène médical
   */
  grabOxygenCylinder() {
    this.oxygenCylinderGrabbed = true;
    return {
      status: 'OXYGEN_CYLINDER_ACQUIRED',
      cylinderWeightKg: 18.0,
      combustionPotentialHigh: true
    };
  }

  /**
   * Lancement dans la gaine de ventilation et déclenchement du retour de flamme (backdraft)
   */
  detonateVentilationBackdraft() {
    if (!this.oxygenCylinderGrabbed) {
      return { success: false, reason: 'MUST_ACQUIRE_CYLINDER_FIRST' };
    }

    this.backdraftDetonated = true;
    this.blastDoorHp = 0.0;
    this.airlockSealed = false;
    this.airlockBreached = true;
    this.halonVenting = false;

    return {
      success: true,
      status: 'BACKDRAFT_EXPLOSION_BLAST_DOORS_BREACHED',
      blastOverpressureKpa: 310.0,
      fireballRadiusM: 8.5,
      escapePathOpened: true
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'ThePredator2018HalonGasAirlockSector',
      airlockSealed: this.airlockSealed,
      chamberOxygenPct: this.chamberOxygenPct,
      timeRemainingSeconds: this.timeRemainingSeconds,
      backdraftDetonated: this.backdraftDetonated,
      airlockBreached: this.airlockBreached
    };
  }
}
