/**
 * ValVerdeCircadianDayNightCycleSector.js
 * 
 * Chantier Level Design #1 - Cycle Jour / Crépuscule / Nuit Tropicale & Contraste Thermique Circadien.
 * Canonical 1:1 Predator (1987) fidelity:
 * - Recreates the temporal transition of the film:
 *   - Midday (12:00): 36 °C ambient heat, blistering sun, low thermal contrast between human bodies (37 °C) and jungle foliage (34-36 °C).
 *   - Dusk / Sunset (18:30): 28 °C ambient, golden-hour canopy backlighting, lengthening tree shadows.
 *   - Nightfall (22:00): 21 °C ambient, high thermal contrast where human bodies glow intensely on the Yautja bio-mask,
 *     while neon-green Yautja blood glows with maximum luminescence (532 nm) against the dark forest floor.
 * - Dynamic sun angle, canopy shadow occlusion, and bio-mask acquisition distance scaling.
 */

export class ValVerdeCircadianDayNightCycleSector {
  /**
   * @param {Object} options
   * @param {number} [options.initialHour=12.0] - Time of day (0.0 to 24.0)
   */
  constructor(options = {}) {
    this.currentHour = options.initialHour ?? 12.0;
  }

  /**
   * Sets or advances the current time of day.
   * @param {number} hour - 0.0 to 24.0
   * @returns {Object} Circadian environmental telemetry
   */
  setTimeOfDay(hour = 12.0) {
    this.currentHour = ((hour % 24) + 24) % 24;

    // Phase identification
    let phase = 'DAY';
    if (this.currentHour >= 5.5 && this.currentHour < 8.0) phase = 'DAWN';
    else if (this.currentHour >= 8.0 && this.currentHour < 17.5) phase = 'MIDDAY_SCORCH';
    else if (this.currentHour >= 17.5 && this.currentHour < 20.0) phase = 'DUSK_GOLDEN_HOUR';
    else phase = 'DEEP_NIGHT';

    // Ambient temperature curve: peaks at 14:00 (36.5 °C), lowest at 04:00 (20.5 °C)
    const tempPeakHour = 14.0;
    const tempHourDelta = Math.abs(this.currentHour - tempPeakHour);
    const ambientTempC = Math.round((28.5 + 8.0 * Math.cos(((this.currentHour - tempPeakHour) * Math.PI) / 12)) * 10) / 10;

    // Thermal contrast against human core body temperature (37.0 °C)
    const thermalContrastDeltaC = Math.round(Math.abs(37.0 - ambientTempC) * 10) / 10;
    const bioMaskThermalAcquisitionMultiplier = Math.round((1.0 + (thermalContrastDeltaC / 8.0)) * 100) / 100;

    // Sunlight illumination (lux)
    let ambientLux = 85000;
    if (phase === 'DEEP_NIGHT') ambientLux = 0.8;
    else if (phase === 'DUSK_GOLDEN_HOUR') ambientLux = 4500;
    else if (phase === 'DAWN') ambientLux = 8000;

    // Luminescent green blood visibility
    const luminescentBloodVisualClarityPct = phase === 'DEEP_NIGHT' ? 100 : Math.round(Math.max(20, 100 - (ambientLux / 900)));

    return {
      currentHour: this.currentHour,
      phase,
      ambientTempC,
      thermalContrastDeltaC,
      bioMaskThermalAcquisitionMultiplier,
      ambientLux,
      luminescentBloodVisualClarityPct,
      redLaserBeamVisibilityScore: phase === 'DEEP_NIGHT' ? 100 : 45
    };
  }

  /**
   * Evaluates bio-mask targeting performance under the current circadian phase.
   * @param {number} targetRangeM
   * @param {boolean} [targetCoveredInMud=false]
   * @returns {Object} Target visibility status
   */
  evaluateBioMaskVisibility(targetRangeM = 20.0, targetCoveredInMud = false) {
    const telemetry = this.setTimeOfDay(this.currentHour);

    if (targetCoveredInMud) {
      return {
        targetAcquired: false,
        reason: 'COLD_MUD_SIGNATURE_MATCHES_COLD_FOLIAGE',
        targetContrastRatio: 0.05,
        targetRangeM
      };
    }

    // At night, high contrast makes human target easily locked
    const effectiveDetectionRangeM = telemetry.phase === 'DEEP_NIGHT' ? 65.0 : 35.0;
    const targetAcquired = targetRangeM <= effectiveDetectionRangeM;

    return {
      targetAcquired,
      targetRangeM,
      effectiveDetectionRangeM,
      targetContrastRatio: telemetry.thermalContrastDeltaC / 10.0,
      phase: telemetry.phase
    };
  }
}
