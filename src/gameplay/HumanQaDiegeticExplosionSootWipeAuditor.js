/**
 * HumanQaDiegeticExplosionSootWipeAuditor.js
 * 
 * Chantier 8 & Audit QA #3 (Diégétique):
 * Solves QA tester feedback: "Explosions near the player don't leave lingering
 * carbon soot or ash on the bio-mask optics. In film canon (Predator 2, Prey),
 * explosive blast backwash deposits black carbon soot that impairs vision until
 * the hunter wipes it off with a gauntlet brush."
 * 
 * Implements blast soot deposition physics, optical ash obstruction,
 * manual gauntlet wiper gesture clearing, and rainwater soot washing.
 */

export class HumanQaDiegeticExplosionSootWipeAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.wipeClearRatio=0.85]
   * @param {number} [options.rainWashSpeedPerSec=0.03]
   */
  constructor(options = {}) {
    this.wipeClearRatio = options.wipeClearRatio || 0.85;
    this.rainWashSpeedPerSec = options.rainWashSpeedPerSec || 0.03;

    this.currentSootOpacity = 0.0;
    this.wipeInProgress = false;
  }

  /**
   * Registers a nearby blast event and deposits soot on the bio-mask lenses.
   * @param {number} blastDistanceM - Distance from explosion center
   * @param {number} explosiveMassKg - Yield of explosion
   * @returns {Object} Soot deposition telemetry
   */
  registerBlastSootDeposition(blastDistanceM = 3.5, explosiveMassKg = 2.0) {
    if (blastDistanceM > 8.0) {
      return { sootDeposited: false, currentSootOpacity: this.currentSootOpacity };
    }

    const proximityFactor = Math.max(0.1, 1.0 - blastDistanceM / 8.0);
    const sootIncrement = +(proximityFactor * (explosiveMassKg / 2.0) * 0.75).toFixed(3);
    this.currentSootOpacity = +(Math.min(1.0, this.currentSootOpacity + sootIncrement)).toFixed(3);

    return {
      sootDeposited: true,
      sootIncrement,
      currentSootOpacity: this.currentSootOpacity,
      opticViewImpaired: this.currentSootOpacity > 0.4,
      ashFlakesCount: Math.round(this.currentSootOpacity * 40)
    };
  }

  /**
   * Executes a physical wrist gauntlet brush gesture to wipe away soot.
   * @returns {Object} Wiper gesture outcome
   */
  wipeVisorSoot() {
    this.wipeInProgress = true;
    const clearedAmount = +(this.currentSootOpacity * this.wipeClearRatio).toFixed(3);
    this.currentSootOpacity = +(Math.max(0.0, this.currentSootOpacity - clearedAmount)).toFixed(3);
    this.wipeInProgress = false;

    return {
      success: true,
      clearedAmount,
      remainingSootOpacity: this.currentSootOpacity,
      wipeDurationSec: 0.8,
      gauntletBrushSoundPlaying: true,
      clarityRestored: this.currentSootOpacity < 0.15
    };
  }

  /**
   * Washes soot off gradually if standing in rain or waterfalls.
   * @param {number} deltaSec
   * @param {boolean} inRain
   * @returns {Object} Wash state
   */
  tickRainWash(deltaSec = 0.016, inRain = true) {
    if (inRain && this.currentSootOpacity > 0.0) {
      this.currentSootOpacity = +(Math.max(0.0, this.currentSootOpacity - this.rainWashSpeedPerSec * deltaSec)).toFixed(3);
    }

    return {
      currentSootOpacity: this.currentSootOpacity,
      washedByRain: inRain
    };
  }

  /**
   * Applies CSS classes for soot overlay.
   * @param {HTMLElement|null} hudContainer
   * @returns {Object} Visual update summary
   */
  applyDiegeticSootStyles(hudContainer = null) {
    if (!hudContainer && typeof document !== 'undefined') {
      hudContainer = document.querySelector('.yautja-hud-container') || document.body;
    }

    if (hudContainer) {
      let sootEl = hudContainer.querySelector('.visor-soot-deposit-overlay');
      if (!sootEl) {
        sootEl = document.createElement('div');
        sootEl.className = 'visor-soot-deposit-overlay';
        hudContainer.appendChild(sootEl);
      }

      sootEl.style.opacity = this.currentSootOpacity.toString();
      if (this.currentSootOpacity > 0.1) {
        sootEl.classList.add('soot-active');
      } else {
        sootEl.classList.remove('soot-active');
      }
    }

    return {
      currentSootOpacity: this.currentSootOpacity,
      stylesApplied: Boolean(hudContainer)
    };
  }
}
