/**
 * HumanQaAdaptiveThermalGlareSuppressionDirector.js
 * 
 * Human Playtester QA Audit #1: Adaptive Automatic Gain Control & Thermal Glare Suppression.
 * Eliminates total blinding whiteout when exposed to sudden high-intensity light sources
 * (explosions, helicopter searchlights, flare rounds) while using the Yautja infrared vision mode.
 * Dynamically attenuates optical saturation within 250ms and applies .thermal-glare-damping-filter.
 */

export class HumanQaAdaptiveThermalGlareSuppressionDirector {
  /**
   * @param {Object} options
   * @param {number} [options.baseSensitivityGain=1.0]
   * @param {number} [options.glareSaturationThresholdLux=25000]
   */
  constructor(options = {}) {
    this.baseSensitivityGain = options.baseSensitivityGain || 1.0;
    this.glareSaturationThresholdLux = options.glareSaturationThresholdLux || 25000;

    this.currentSensorGain = this.baseSensitivityGain;
    this.glareDampingActive = false;
    this.dampingRatio = 0.0;
    this.adaptationProgress = 1.0;
  }

  /**
   * Evaluates sudden incident illuminance and computes necessary AGC attenuation.
   * @param {number} incidentLux - Flash or spotlight brightness
   * @returns {Object} Glare evaluation
   */
  evaluateLuminanceGlare(incidentLux = 1000) {
    const isOverThreshold = incidentLux >= this.glareSaturationThresholdLux;

    if (isOverThreshold) {
      this.glareDampingActive = true;
      this.adaptationProgress = 0.0;
      // High lux forces steep attenuation down to 0.15 gain
      const excessRatio = Math.min(1.0, (incidentLux - this.glareSaturationThresholdLux) / 75000);
      this.targetGain = +(0.45 - excessRatio * 0.30).toFixed(2);
      this.dampingRatio = +(1.0 - this.targetGain).toFixed(2);
    } else {
      this.targetGain = this.baseSensitivityGain;
      this.dampingRatio = 0.0;
    }

    return {
      incidentLux,
      glareDampingActive: this.glareDampingActive,
      targetGain: this.targetGain,
      dampingRatio: this.dampingRatio,
      requiresFilter: this.glareDampingActive
    };
  }

  /**
   * Smoothly interpolates the automatic sensor gain control over time.
   * @param {number} deltaSec
   * @returns {Object} Updated AGC state
   */
  processGainControlTick(deltaSec = 0.05) {
    if (!this.glareDampingActive && this.currentSensorGain === this.baseSensitivityGain) {
      return { currentSensorGain: this.currentSensorGain, glareDampingActive: false };
    }

    const adaptationRate = 4.0; // Adapts within ~250ms
    this.adaptationProgress = Math.min(1.0, +(this.adaptationProgress + adaptationRate * deltaSec).toFixed(2));

    this.currentSensorGain = +(this.currentSensorGain + (this.targetGain - this.currentSensorGain) * 0.4).toFixed(3);

    if (this.adaptationProgress >= 1.0 && this.targetGain === this.baseSensitivityGain) {
      this.glareDampingActive = false;
      this.dampingRatio = 0.0;
    }

    return {
      currentSensorGain: this.currentSensorGain,
      targetGain: this.targetGain,
      adaptationProgress: this.adaptationProgress,
      glareDampingActive: this.glareDampingActive,
      dampingRatio: this.dampingRatio
    };
  }

  /**
   * Exports HUD filter payload for rendering `.thermal-glare-damping-filter`.
   * @returns {Object}
   */
  getThermalViewFilterState() {
    return {
      glareDampingActive: this.glareDampingActive,
      currentSensorGain: this.currentSensorGain,
      dampingRatio: this.dampingRatio,
      cssClass: this.glareDampingActive 
        ? 'thermal-glare-damping-filter auto-gain-active' 
        : 'thermal-glare-damping-filter',
      opticalNoiseSuppressed: this.glareDampingActive
    };
  }
}
