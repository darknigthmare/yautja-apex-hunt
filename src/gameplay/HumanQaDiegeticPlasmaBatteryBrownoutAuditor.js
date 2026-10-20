/**
 * HumanQaDiegeticPlasmaBatteryBrownoutAuditor.js
 * 
 * Chantier 8 & Audit QA #3 (Diégétique):
 * Solves QA tester feedback: "When the Yautja energy reserves fall below 15-20%,
 * the helmet HUD simply shows an abstract number '12%'. In film canon (Predator 2,
 * The Predator), low energy causes diégétique system degradation: visor optics flicker,
 * night vision raster lines desynchronize, and the tri-laser targeting beam wavers or dims."
 * 
 * Implements diégétique power grid simulation: voltage drop curves, micro-cut stutters,
 * optical raster desynchronization, and laser galvanometer servo jitter.
 */

export class HumanQaDiegeticPlasmaBatteryBrownoutAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.batteryPercent=100.0]
   * @param {number} [options.brownoutThresholdPercent=20.0]
   * @param {number} [options.nominalVoltageV=24.0]
   */
  constructor(options = {}) {
    this.batteryPercent = options.batteryPercent || 100.0;
    this.brownoutThresholdPercent = options.brownoutThresholdPercent || 20.0;
    this.nominalVoltageV = options.nominalVoltageV || 24.0;

    this.inBrownoutState = false;
    this.microCutActive = false;
    this.lastMicroCutDurationMs = 0;
  }

  /**
   * Sets current battery level and evaluates diégétique degradation state.
   * @param {number} newBatteryPercent
   * @returns {Object} Power grid telemetry
   */
  updateBatteryLevel(newBatteryPercent) {
    this.batteryPercent = Math.max(0.0, Math.min(100.0, newBatteryPercent));
    this.inBrownoutState = this.batteryPercent < this.brownoutThresholdPercent;

    // Voltage curve: V = V_nom * sqrt(E / 100)
    const effectiveVoltageV = +(this.nominalVoltageV * Math.sqrt(Math.max(0.05, this.batteryPercent / 100.0))).toFixed(2);
    const phosphorDimmingRatio = +(Math.max(0.15, this.batteryPercent / 100.0)).toFixed(2);
    
    // Laser jitter in degrees increases sharply as battery drops below 15%
    const laserGalvanoJitterDeg = this.inBrownoutState
      ? +((1.0 - this.batteryPercent / this.brownoutThresholdPercent) * 2.2).toFixed(2)
      : 0.0;

    return {
      batteryPercent: this.batteryPercent,
      inBrownoutState: this.inBrownoutState,
      effectiveVoltageV,
      phosphorDimmingRatio,
      laserGalvanoJitterDeg,
      criticalShutdownRisk: this.batteryPercent <= 5.0
    };
  }

  /**
   * Evaluates if a brownout micro-cut flicker occurs this frame.
   * @param {number} deltaSec
   * @returns {Object} Micro-cut event details
   */
  pollBrownoutMicroCutEvent(deltaSec = 0.016) {
    if (!this.inBrownoutState) {
      this.microCutActive = false;
      return { microCutTriggered: false, blackoutDurationMs: 0 };
    }

    // Probability of micro-cut increases inversely with remaining power
    const brownoutSeverity = (this.brownoutThresholdPercent - this.batteryPercent) / this.brownoutThresholdPercent;
    const cutChance = brownoutSeverity * 0.45;
    const microCutTriggered = Math.random() < cutChance;

    if (microCutTriggered) {
      this.microCutActive = true;
      this.lastMicroCutDurationMs = Math.round(20 + Math.random() * 60); // 20-80ms flicker
    } else {
      this.microCutActive = false;
      this.lastMicroCutDurationMs = 0;
    }

    return {
      microCutTriggered,
      blackoutDurationMs: this.lastMicroCutDurationMs,
      hudDesyncRaster: microCutTriggered,
      opticalDistortionLevel: brownoutSeverity
    };
  }

  /**
   * Applies CSS classes and visual HUD styling based on battery status.
   * @param {HTMLElement|null} hudContainer
   * @returns {Object} Visual update summary
   */
  applyDiegeticOverlayStyles(hudContainer = null) {
    if (!hudContainer && typeof document !== 'undefined') {
      hudContainer = document.querySelector('.yautja-hud-container') || document.body;
    }

    if (hudContainer) {
      if (this.inBrownoutState) {
        hudContainer.classList.add('hud-battery-brownout-active');
        if (this.microCutActive) {
          hudContainer.classList.add('visor-raster-glitch');
        } else {
          hudContainer.classList.remove('visor-raster-glitch');
        }
      } else {
        hudContainer.classList.remove('hud-battery-brownout-active', 'visor-raster-glitch');
      }
    }

    return {
      inBrownoutState: this.inBrownoutState,
      microCutActive: this.microCutActive,
      stylesApplied: Boolean(hudContainer)
    };
  }
}
