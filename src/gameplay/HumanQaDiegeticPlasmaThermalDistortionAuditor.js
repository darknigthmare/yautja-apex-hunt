/**
 * HumanQaDiegeticPlasmaThermalDistortionAuditor.js
 * 
 * Chantier 8 & Audit QA #3 (Diégétique):
 * Solves QA tester feedback: "Firing high-charge plasma shots in rapid succession
 * doesn't affect the bio-mask optics or shoulder caster housing. The heat dissipation
 * should cause localized thermal lens blooming, target reticle jitter, and venting steam
 * from the shoulder housing."
 * 
 * Implements thermodynamic heat accumulation, Newton's law of cooling dissipation,
 * optic lens chromatic blooming, tri-laser thermal wobble, and steam purge vents.
 */

export class HumanQaDiegeticPlasmaThermalDistortionAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.coolingRatePerSec=0.18]
   * @param {number} [options.overheatThresholdPercent=75.0]
   */
  constructor(options = {}) {
    this.coolingRatePerSec = options.coolingRatePerSec || 0.18;
    this.overheatThresholdPercent = options.overheatThresholdPercent || 75.0;

    this.currentHeatPercent = 0.0;
    this.isOverheated = false;
    this.steamPurgeActive = false;
  }

  /**
   * Registers a plasma caster shot and adds thermal energy.
   * @param {number} chargeJoules
   * @returns {Object} Heat buildup telemetry
   */
  registerPlasmaShot(chargeJoules = 450) {
    const heatIncrement = (chargeJoules / 450.0) * 25.0; // 25% heat per standard shot
    this.currentHeatPercent = Math.min(100.0, this.currentHeatPercent + heatIncrement);
    this.isOverheated = this.currentHeatPercent >= this.overheatThresholdPercent;

    return {
      chargeJoules,
      currentHeatPercent: +this.currentHeatPercent.toFixed(1),
      isOverheated: this.isOverheated,
      lensChromaticBloomLevel: +(this.currentHeatPercent / 100.0).toFixed(2),
      laserWobbleDeg: +((this.currentHeatPercent / 100.0) * 2.4).toFixed(2)
    };
  }

  /**
   * Ticks thermodynamic cooling over time.
   * @param {number} deltaSec
   * @returns {Object} Cooling state
   */
  tickCooling(deltaSec = 0.016) {
    const coolingLoss = this.currentHeatPercent * this.coolingRatePerSec * deltaSec;
    this.currentHeatPercent = Math.max(0.0, this.currentHeatPercent - coolingLoss);
    this.isOverheated = this.currentHeatPercent >= this.overheatThresholdPercent;

    return {
      currentHeatPercent: +this.currentHeatPercent.toFixed(1),
      isOverheated: this.isOverheated,
      radiantInfraredTemperatureC: +(50.0 + this.currentHeatPercent * 2.8).toFixed(1)
    };
  }

  /**
   * Activates shoulder-caster emergency heat sink steam purge.
   * @returns {Object} Steam purge outcome
   */
  triggerEmergencySteamPurge() {
    this.steamPurgeActive = true;
    const heatDumped = Math.min(this.currentHeatPercent, 40.0);
    this.currentHeatPercent = Math.max(0.0, this.currentHeatPercent - heatDumped);
    this.isOverheated = this.currentHeatPercent >= this.overheatThresholdPercent;

    return {
      success: true,
      steamPurgeActive: true,
      heatDumped,
      remainingHeatPercent: +this.currentHeatPercent.toFixed(1),
      steamHissDurationSec: 2.2,
      thermalBloomCleared: !this.isOverheated
    };
  }

  /**
   * Updates HUD overlay classes for thermal distortion bloom.
   * @param {HTMLElement|null} hudContainer
   * @returns {Object} Visual update summary
   */
  applyDiegeticThermalBloomStyles(hudContainer = null) {
    if (!hudContainer && typeof document !== 'undefined') {
      hudContainer = document.querySelector('.yautja-hud-container') || document.body;
    }

    if (hudContainer) {
      let bloom = hudContainer.querySelector('.plasma-thermal-overheat-bloom');
      if (!bloom) {
        bloom = document.createElement('div');
        bloom.className = 'plasma-thermal-overheat-bloom';
        hudContainer.appendChild(bloom);
      }

      if (this.isOverheated) {
        bloom.classList.add('overheated');
      } else {
        bloom.classList.remove('overheated');
      }
    }

    return {
      isOverheated: this.isOverheated,
      currentHeatPercent: this.currentHeatPercent,
      stylesApplied: Boolean(hudContainer)
    };
  }
}
