/**
 * HumanQaDiegeticVisorFrostCondensationAuditor.js
 * 
 * Chantier 8 & Audit QA #3 (Diégétique):
 * Solves QA tester feedback: "In cold biomes, the Yautja's rhythmic breathing
 * should condense on the inside of the bio-mask lenses, fading with each exhale cycle,
 * giving visceral diegetic immersion."
 * 
 * Implements respiratory moisture physics: respiratory rate (12-18 bpm),
 * cyclic condensation fogging/clearing waves, internal ventilation airflow,
 * and purge valve moisture evacuation.
 */

export class HumanQaDiegeticVisorFrostCondensationAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.respiratoryRateBpm=14.0]
   * @param {number} [options.internalHumidityRatio=0.85]
   * @param {number} [options.ambientTempC=5.0]
   */
  constructor(options = {}) {
    this.respiratoryRateBpm = options.respiratoryRateBpm || 14.0;
    this.internalHumidityRatio = options.internalHumidityRatio || 0.85;
    this.ambientTempC = options.ambientTempC || 5.0;

    this.respiratoryCyclePhaseSec = 0.0;
    this.currentCondensationOpacity = 0.0;
    this.purgeValveOpen = false;
  }

  /**
   * Advances respiratory breathing cycle and evaluates condensation pulse.
   * Sinusoidal breathing wave: opacity peaks at end of exhale phase.
   * @param {number} deltaSec
   * @param {boolean} inSprintHeavyExertion - Increases breathing rate to 28 bpm
   * @returns {Object} Condensation breath cycle telemetry
   */
  tickRespiratoryCondensation(deltaSec = 0.016, inSprintHeavyExertion = false) {
    const effectiveBpm = inSprintHeavyExertion ? 28.0 : this.respiratoryRateBpm;
    const cycleDurationSec = 60.0 / effectiveBpm; // ~4.28s at 14 bpm

    this.respiratoryCyclePhaseSec = (this.respiratoryCyclePhaseSec + deltaSec) % cycleDurationSec;
    const phaseNormalized = (this.respiratoryCyclePhaseSec / cycleDurationSec) * (2 * Math.PI);

    // Condensation wave: peaks at exhale
    const breathPulse = Math.max(0.0, Math.sin(phaseNormalized));
    
    // Cold severity multiplier: more condensation under cold temps
    const coldMultiplier = Math.max(0.1, Math.min(1.0, (15.0 - this.ambientTempC) / 20.0));
    
    // Purge valve cuts condensation
    const purgeDamping = this.purgeValveOpen ? 0.15 : 1.0;
    this.currentCondensationOpacity = +(breathPulse * coldMultiplier * this.internalHumidityRatio * purgeDamping).toFixed(3);

    return {
      effectiveBpm,
      cycleDurationSec: +cycleDurationSec.toFixed(2),
      isExhaling: Math.sin(phaseNormalized) > 0,
      currentCondensationOpacity: this.currentCondensationOpacity,
      coldMultiplier: +coldMultiplier.toFixed(2),
      condensationVisible: this.currentCondensationOpacity > 0.12
    };
  }

  /**
   * Activates the bio-mask pneumatic purge valve to flush humid air.
   * @param {boolean} open
   * @returns {Object} Purge status
   */
  triggerPurgeValve(open = true) {
    this.purgeValveOpen = Boolean(open);
    if (this.purgeValveOpen) {
      this.currentCondensationOpacity *= 0.2;
    }

    return {
      purgeValveOpen: this.purgeValveOpen,
      ventAirflowCfm: this.purgeValveOpen ? 12.5 : 2.0,
      dewPointC: 8.5
    };
  }

  /**
   * Updates HUD overlay classes for breathing condensation.
   * @param {HTMLElement|null} hudContainer
   * @returns {Object} Visual update summary
   */
  applyDiegeticCondensationStyles(hudContainer = null) {
    if (!hudContainer && typeof document !== 'undefined') {
      hudContainer = document.querySelector('.yautja-hud-container') || document.body;
    }

    if (hudContainer) {
      let condEl = hudContainer.querySelector('.visor-condensation-breathe');
      if (!condEl) {
        condEl = document.createElement('div');
        condEl.className = 'visor-condensation-breathe';
        hudContainer.appendChild(condEl);
      }

      condEl.style.opacity = this.currentCondensationOpacity.toString();
      if (this.currentCondensationOpacity > 0.1) {
        condEl.classList.add('condensation-pulse-active');
      } else {
        condEl.classList.remove('condensation-pulse-active');
      }
    }

    return {
      currentCondensationOpacity: this.currentCondensationOpacity,
      purgeValveOpen: this.purgeValveOpen,
      stylesApplied: Boolean(hudContainer)
    };
  }
}
