/**
 * SulfurMinesCorrosiveGasTrapSector.js
 * 
 * Predators (2010) - Game Preserve planet volcanic sulfur quarry & toxic vents.
 * Simulates volcanic fumaroles venting corrosive hydrogen sulfide (H2S), toxic gas pockets,
 * filter mask respiratory degradation, and volatile sulfur dust igniting upon plasma caster detonation.
 */

export class SulfurMinesCorrosiveGasTrapSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='game-preserve-sulfur-mines-01']
   * @param {number} [options.ambientSulfurPpm=420.0] - Parts per million H2S
   * @param {number} [options.ambientTemperatureC=65.0]
   * @param {number} [options.fissureVentsCount=5]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'game-preserve-sulfur-mines-01';
    this.ambientSulfurPpm = options.ambientSulfurPpm || 420.0;
    this.ambientTemperatureC = options.ambientTemperatureC || 65.0;
    this.fissureVentsCount = options.fissureVentsCount || 5;

    this.fissureVentActive = true;
    this.sulfurDustChainExploded = false;
  }

  /**
   * Evaluates respiratory hazard and bio-mask filtration integrity.
   * Bio-mask filters H2S up to 600 ppm with gradual filter saturation.
   * @param {number} exposureDurationSec
   * @param {boolean} bioMaskEquipped
   * @param {number} currentFilterPurity - 0.0 to 1.0
   * @returns {Object} Respiratory toxicity metrics
   */
  evaluateRespiratoryToxicity(exposureDurationSec = 10.0, bioMaskEquipped = true, currentFilterPurity = 0.9) {
    if (!bioMaskEquipped) {
      // Acute H2S poisoning for unmasked humans or unmasked Yautja
      const toxicDamagePerSec = +(this.ambientSulfurPpm * 0.08).toFixed(1);
      const totalDamage = Math.round(toxicDamagePerSec * exposureDurationSec);
      const pulmonaryEdemaRisk = this.ambientSulfurPpm > 300;

      return {
        safe: false,
        bioMaskEquipped: false,
        toxicDamagePerSec,
        totalDamage,
        pulmonaryEdemaRisk,
        asphyxiationSeverity: 'CRITICAL',
        filterDepleted: true
      };
    }

    // Mask is equipped: filter absorbs contaminant
    const filterDegradationPerSec = (this.ambientSulfurPpm / 1000) * 0.005;
    const remainingFilterPurity = +(Math.max(0.0, currentFilterPurity - filterDegradationPerSec * exposureDurationSec)).toFixed(3);
    const filterDepleted = remainingFilterPurity <= 0.05;
    const leakageToxicityDamage = filterDepleted ? Math.round(exposureDurationSec * 15) : 0;

    return {
      safe: !filterDepleted,
      bioMaskEquipped: true,
      remainingFilterPurity,
      filterDepleted,
      leakageToxicityDamage,
      corrosivePittingOnArmorRate: 0.02
    };
  }

  /**
   * Fires a plasma bolt into a high-concentration sulfur dust pocket, triggering a chain deflagration.
   * @param {number} plasmaBoltTemperatureC - ~3500 C
   * @param {number} gasPocketRadiusM
   * @returns {Object} Deflagration blast telemetry
   */
  igniteSulfurGasPocket(plasmaBoltTemperatureC = 3500, gasPocketRadiusM = 4.5) {
    const sulfurAutoignitionTempC = 232.0; // Sulfur dust autoignites at ~232°C
    const ignites = plasmaBoltTemperatureC >= sulfurAutoignitionTempC && this.ambientSulfurPpm >= 150;

    if (!ignites) {
      return { ignited: false, blastRadiusM: 0, deflagrationDamage: 0 };
    }

    this.sulfurDustChainExploded = true;
    const blastOverpressureKpa = Math.round(180 * (gasPocketRadiusM / 4.0));
    const deflagrationDamage = Math.round(220 + gasPocketRadiusM * 25);
    const fireballExpansionVelocityMps = +(120.0 + gasPocketRadiusM * 18.0).toFixed(1);

    return {
      ignited: true,
      sulfurDustChainExploded: true,
      blastRadiusM: +(gasPocketRadiusM * 1.6).toFixed(1),
      blastOverpressureKpa,
      deflagrationDamage,
      fireballExpansionVelocityMps,
      lingeringFireDurationSec: 5.0
    };
  }
}
