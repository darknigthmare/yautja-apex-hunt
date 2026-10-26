/**
 * Predators2010RiverbankMudCoolingSector.js
 *
 * Chantier de Level Design 1 (v184) - Predators (2010)
 * 1:1 Canonical Level Design: Post-Waterfall Riverbank Mud Thermal Occlusion
 *
 * Canonical Scene: Following the 60m waterfall plunge, Royce crawls onto the muddy riverbank.
 * He covers himself with cold, mineral-rich river clay mud, discovering that it drops skin surface
 * thermal emission to match ambient ambient mud temperature (Delta T <= 0.4 K), providing complete
 * infrared invisibility against the Super Predator's biomask thermal tracker.
 */

export class Predators2010RiverbankMudCoolingSector {
  /**
   * @param {Object} options
   * @param {number} [options.mudLayerThicknessMm=8.5] Épaisseur de la couche de boue argileuse (mm)
   * @param {number} [options.ambientWaterTempCelsius=16.0] Température de l'eau fluviale (°C)
   * @param {number} [options.humanBodyTempCelsius=37.0] Température corporelle humaine (°C)
   */
  constructor(options = {}) {
    this.mudLayerThicknessMm = options.mudLayerThicknessMm ?? 8.5;
    this.ambientWaterTempCelsius = options.ambientWaterTempCelsius ?? 16.0;
    this.humanBodyTempCelsius = options.humanBodyTempCelsius ?? 37.0;

    // Constantes physiques de transfert thermique
    this.mudThermalConductivity = 0.6; // W/(m·K)
    this.mudEmissivity = 0.94; // Émissivité infrarouge de l'argile humide
    this.dryingTimeSeconds = 180.0; // 3 minutes avant assèchement et perte d'occlusion

    // État runtime
    this.mudApplied = false;
    this.currentMudThicknessMm = 0.0;
    this.currentSkinThermalCelsius = this.humanBodyTempCelsius;
    this.thermalOcclusionPct = 0.0; // 0% -> 100%
    this.mudRemainingSeconds = 0.0;
    this.riverbankClimbed = false;
  }

  /**
   * Sortie des flots et reptation sur la berge de limon
   */
  climbOntoRiverbank() {
    this.riverbankClimbed = true;
    return {
      status: 'RIVERBANK_CLIMBED',
      ambientTempCelsius: this.ambientWaterTempCelsius,
      clayAvailable: true
    };
  }

  /**
   * Enduction complète du corps avec la boue fluviale
   * @param {number} coverageRatio Ratio de surface corporelle couverte (0.0 -> 1.0)
   */
  applyMudCamouflage(coverageRatio = 1.0) {
    if (!this.riverbankClimbed) {
      return { success: false, reason: 'MUST_CLIMB_ONTO_BANK_FIRST' };
    }

    this.mudApplied = true;
    this.currentMudThicknessMm = this.mudLayerThicknessMm * coverageRatio;
    this.mudRemainingSeconds = this.dryingTimeSeconds;

    // Chute immédiate de la température de surface perçue en IR
    const tempDelta = (this.humanBodyTempCelsius - this.ambientWaterTempCelsius) * (1.0 - coverageRatio * 0.98);
    this.currentSkinThermalCelsius = this.ambientWaterTempCelsius + tempDelta;
    this.thermalOcclusionPct = Math.min(100.0, coverageRatio * 99.2);

    return {
      success: true,
      status: 'MUD_CAMOUFLAGE_APPLIED',
      thicknessMm: this.currentMudThicknessMm,
      apparentThermalCelsius: parseFloat(this.currentSkinThermalCelsius.toFixed(2)),
      thermalOcclusionPct: parseFloat(this.thermalOcclusionPct.toFixed(1)),
      irInvisible: this.thermalOcclusionPct >= 95.0,
      durationSeconds: this.mudRemainingSeconds
    };
  }

  /**
   * Dégradation progressive de la boue par séchage au fil du temps
   * @param {number} deltaSeconds
   */
  updateMudDrying(deltaSeconds) {
    if (!this.mudApplied) {
      return { active: false, thermalOcclusionPct: 0.0 };
    }

    this.mudRemainingSeconds = Math.max(0.0, this.mudRemainingSeconds - deltaSeconds);
    const dryingFactor = this.mudRemainingSeconds / this.dryingTimeSeconds;

    this.currentMudThicknessMm = this.mudLayerThicknessMm * dryingFactor;
    this.thermalOcclusionPct = parseFloat((dryingFactor * 99.2).toFixed(1));
    this.currentSkinThermalCelsius = this.ambientWaterTempCelsius + (this.humanBodyTempCelsius - this.ambientWaterTempCelsius) * (1.0 - dryingFactor);

    if (this.mudRemainingSeconds === 0.0) {
      this.mudApplied = false;
      return {
        active: false,
        status: 'MUD_DRIED_AND_CRACKED_IR_REVEALED',
        apparentThermalCelsius: this.humanBodyTempCelsius,
        thermalOcclusionPct: 0.0
      };
    }

    return {
      active: true,
      status: 'MUD_COOLING_ACTIVE',
      remainingSeconds: parseFloat(this.mudRemainingSeconds.toFixed(1)),
      apparentThermalCelsius: parseFloat(this.currentSkinThermalCelsius.toFixed(2)),
      thermalOcclusionPct: this.thermalOcclusionPct
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'Predators2010RiverbankMudCoolingSector',
      riverbankClimbed: this.riverbankClimbed,
      mudApplied: this.mudApplied,
      currentMudThicknessMm: this.currentMudThicknessMm,
      currentSkinThermalCelsius: this.currentSkinThermalCelsius,
      thermalOcclusionPct: this.thermalOcclusionPct,
      mudRemainingSeconds: this.mudRemainingSeconds
    };
  }
}
