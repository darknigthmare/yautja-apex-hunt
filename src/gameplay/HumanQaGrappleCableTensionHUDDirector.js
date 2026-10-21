/**
 * HumanQaGrappleCableTensionHUDDirector.js
 * 
 * Chantier 6 & Audit QA #1 (UI/UX):
 * Solves QA tester feedback: "When using the wrist grapple to climb trees,
 * scale rooftops, or extract from quicksand, there's no visual tension gauge
 * or snapping stress warning on the HUD. The player can't gauge if their cable
 * is about to snap under heavy G-force or aerodynamic drag."
 * 
 * Implements real-time tensile load monitoring, breaking limit threshold calculation,
 * color-coded stress levels (NOMINAL, HIGH_LOAD, CRITICAL_SNAP_RISK),
 * and HUD DOM gauge mounting with clutch release slip protection.
 */

export class HumanQaGrappleCableTensionHUDDirector {
  /**
   * @param {Object} options
   * @param {number} [options.cableBreakingLimitN=12000.0] - 12 kN carbon nanotube
   * @param {number} [options.highLoadThresholdRatio=0.65]
   * @param {number} [options.criticalSnapThresholdRatio=0.85]
   */
  constructor(options = {}) {
    this.cableBreakingLimitN = options.cableBreakingLimitN || 12000.0;
    this.highLoadThresholdRatio = options.highLoadThresholdRatio || 0.65;
    this.criticalSnapThresholdRatio = options.criticalSnapThresholdRatio || 0.85;

    this.currentTensionN = 0.0;
    this.cableSnapped = false;
    this.clutchSlipped = false;
    this.hudElement = null;
  }

  /**
   * Updates cable tensile load and evaluates risk level.
   * @param {number} newTensionN
   * @returns {Object} Cable tension telemetry
   */
  updateTensileLoad(newTensionN) {
    this.currentTensionN = Math.max(0.0, newTensionN);
    const loadRatio = +(this.currentTensionN / this.cableBreakingLimitN).toFixed(3);

    let stressTier = 'NOMINAL';
    if (loadRatio >= 1.0) {
      this.cableSnapped = true;
      stressTier = 'SNAPPED';
    } else if (loadRatio >= this.criticalSnapThresholdRatio) {
      stressTier = 'CRITICAL_SNAP_RISK';
    } else if (loadRatio >= this.highLoadThresholdRatio) {
      stressTier = 'HIGH_LOAD';
    }

    return {
      currentTensionN: this.currentTensionN,
      cableBreakingLimitN: this.cableBreakingLimitN,
      loadRatio,
      stressTier,
      cableSnapped: this.cableSnapped,
      gaugeColorHex: stressTier === 'NOMINAL' ? '#00ff66' : (stressTier === 'HIGH_LOAD' ? '#ffaa00' : '#ff0033'),
      audioCreakRateHz: +(loadRatio * 15.0).toFixed(1)
    };
  }

  /**
   * Engages emergency friction clutch to slip cable and relieve dangerous tension.
   * @param {number} slipLengthMeters
   * @returns {Object} Clutch slip telemetry
   */
  engageEmergencyClutchSlip(slipLengthMeters = 1.2) {
    if (this.cableSnapped) {
      return { success: false, reason: 'CABLE_ALREADY_SNAPPED' };
    }

    this.clutchSlipped = true;
    const tensionReliefRatio = 0.45; // 45% tension drop
    this.currentTensionN = Math.round(this.currentTensionN * (1.0 - tensionReliefRatio));

    return {
      success: true,
      clutchSlipped: true,
      slipLengthMeters,
      relievedTensionN: this.currentTensionN,
      snappingAverted: true
    };
  }

  /**
   * Mounts or updates the HUD tension gauge DOM element.
   * @param {HTMLElement|null} container
   * @returns {Object} Render status
   */
  updateHudGaugeView(container = null) {
    if (!container && typeof document !== 'undefined') {
      container = document.querySelector('.yautja-hud-container') || document.body;
    }

    if (container && typeof document !== 'undefined') {
      let gauge = container.querySelector('.grapple-cable-tension-gauge');
      if (!gauge) {
        gauge = document.createElement('div');
        gauge.className = 'grapple-cable-tension-gauge active';
        gauge.innerHTML = `
          <div class="tension-level-bar"></div>
          <div class="tension-numerical-readout">0 N</div>
        `;
        container.appendChild(gauge);
      }

      const bar = gauge.querySelector('.tension-level-bar');
      const readout = gauge.querySelector('.tension-numerical-readout');
      const loadRatio = Math.min(1.0, this.currentTensionN / this.cableBreakingLimitN);

      if (bar) {
        bar.style.height = `${(loadRatio * 100).toFixed(1)}%`;
      }
      if (readout) {
        readout.textContent = `${Math.round(this.currentTensionN)} N`;
      }

      if (loadRatio >= this.criticalSnapThresholdRatio) {
        gauge.classList.add('critical');
      } else {
        gauge.classList.remove('critical');
      }

      this.hudElement = gauge;
    }

    return {
      rendered: Boolean(this.hudElement),
      currentTensionN: this.currentTensionN,
      cableSnapped: this.cableSnapped
    };
  }
}
