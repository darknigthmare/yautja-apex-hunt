/**
 * HumanQaThermalFrostHUDDirector.js
 * 
 * Chantier 6 & Audit QA #1 (UI/UX):
 * Solves QA tester feedback: "Under freezing conditions (sub-zero Antarctica,
 * liquid nitrogen cryo-vaults, or cold mud wallowing), the HUD displays no tactile
 * freeze warning or lens icing effect. The player has no visual cue of thermal shock
 * or frost accumulation on the visor lenses."
 * 
 * Implements procedural ice crystal vignette accumulation on visor edges,
 * thermal gradient monitoring, and bio-mask defroster heating element mechanics.
 */

export class HumanQaThermalFrostHUDDirector {
  /**
   * @param {Object} options
   * @param {number} [options.ambientTempC=20.0]
   * @param {number} [options.frostThresholdC=0.0]
   * @param {number} [options.defrosterHeatRate=0.35]
   */
  constructor(options = {}) {
    this.ambientTempC = options.ambientTempC || 20.0;
    this.frostThresholdC = options.frostThresholdC || 0.0;
    this.defrosterHeatRate = options.defrosterHeatRate || 0.35;

    this.frostVignetteOpacity = 0.0; // 0.0 = clear, 1.0 = fully frozen
    this.defrosterCoilActive = false;
    this.frostOverlayElement = null;
  }

  /**
   * Updates ambient temperature and calculates frost accumulation.
   * @param {number} newTempC
   * @param {number} deltaSec
   * @returns {Object} Frost telemetry
   */
  updateThermalEnvironment(newTempC, deltaSec = 0.016) {
    this.ambientTempC = newTempC;

    if (this.defrosterCoilActive) {
      // Defroster melts frost rapidly
      this.frostVignetteOpacity = Math.max(0.0, this.frostVignetteOpacity - this.defrosterHeatRate * deltaSec * 3.0);
    } else if (this.ambientTempC < this.frostThresholdC) {
      // Accumulate frost based on cold severity
      const subZeroDegrees = Math.abs(this.ambientTempC);
      const accumulationRate = 0.02 + (subZeroDegrees / 100.0) * 0.08;
      this.frostVignetteOpacity = Math.min(1.0, this.frostVignetteOpacity + accumulationRate * deltaSec);
    } else {
      // Ambient warm thawing
      this.frostVignetteOpacity = Math.max(0.0, this.frostVignetteOpacity - 0.05 * deltaSec);
    }

    const iceFractalCrystalsVisible = this.frostVignetteOpacity > 0.15;
    const opticViewRestricted = this.frostVignetteOpacity > 0.65;

    return {
      ambientTempC: this.ambientTempC,
      frostVignetteOpacity: +this.frostVignetteOpacity.toFixed(3),
      defrosterCoilActive: this.defrosterCoilActive,
      iceFractalCrystalsVisible,
      opticViewRestricted,
      freezingWarningActive: this.ambientTempC < -10.0
    };
  }

  /**
   * Toggles the bio-mask lens defroster wire coils.
   * @param {boolean} active
   * @returns {Object} Defroster status
   */
  setDefrosterCoil(active = true) {
    this.defrosterCoilActive = Boolean(active);

    return {
      defrosterCoilActive: this.defrosterCoilActive,
      lensHeatingWatts: this.defrosterCoilActive ? 1.5 : 0.0,
      frostClearingSec: +(this.frostVignetteOpacity / (this.defrosterHeatRate * 3.0 + 0.001)).toFixed(1)
    };
  }

  /**
   * Renders or updates the frost overlay DOM view.
   * @param {HTMLElement|null} container
   * @returns {Object} Render status
   */
  updateHudFrostView(container = null) {
    if (!container && typeof document !== 'undefined') {
      container = document.querySelector('.yautja-hud-container') || document.body;
    }

    if (container && typeof document !== 'undefined') {
      let overlay = container.querySelector('.visor-frost-edge-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'visor-frost-edge-overlay';
        container.appendChild(overlay);
      }

      overlay.style.opacity = this.frostVignetteOpacity.toString();
      if (this.frostVignetteOpacity > 0.05) {
        overlay.classList.add('frost-active');
      } else {
        overlay.classList.remove('frost-active');
      }

      this.frostOverlayElement = overlay;
    }

    return {
      rendered: Boolean(this.frostOverlayElement),
      frostVignetteOpacity: this.frostVignetteOpacity,
      defrosterCoilActive: this.defrosterCoilActive
    };
  }
}
