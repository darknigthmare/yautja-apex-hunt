/**
 * HumanQaDynamicTelemetricBallisticElevationCrosshairDirector.js
 * 
 * Chantier 6 & Audit QA #1 (UI/UX):
 * Solves QA tester feedback: "When aiming the Speargun or Plasma Caster at targets
 * over 60 meters away, there's no visual ballistic drop indicator or wind drift compensation
 * marking on the HUD. The player has to guess projectile drop blindly."
 * 
 * Implements a dynamic Yautja telemetric ballistic reticle with live rangefinder readout,
 * gravity drop compensation chevrons (10m, 30m, 60m, 100m), and crosswind lead indicators.
 */

export class HumanQaDynamicTelemetricBallisticElevationCrosshairDirector {
  /**
   * @param {Object} options
   * @param {number} [options.muzzleVelocityMps=180.0] - Speargun/Plasma bolt initial speed
   * @param {number} [options.projectileMassKg=0.15]
   * @param {number} [options.crosswindSpeedMps=4.5]
   */
  constructor(options = {}) {
    this.muzzleVelocityMps = options.muzzleVelocityMps || 180.0;
    this.projectileMassKg = options.projectileMassKg || 0.15;
    this.crosswindSpeedMps = options.crosswindSpeedMps || 4.5;

    this.currentRangeM = 0;
    this.elevationDropPixels = 0;
    this.windDeflectionPixels = 0;
    this.activeReticleElement = null;
  }

  /**
   * Calculates ballistic projectile drop and wind drift.
   * Delta_y = 0.5 * g * (R / v0)^2
   * Delta_x = 0.5 * a_wind * (R / v0)^2
   * @param {number} targetRangeMeters
   * @param {number} [crosswindMps]
   * @returns {Object} Ballistic trajectory telemetry
   */
  computeBallisticAimCorrection(targetRangeMeters = 60.0, crosswindMps = this.crosswindSpeedMps) {
    const g = 9.81;
    const timeOfFlightSec = +(targetRangeMeters / this.muzzleVelocityMps).toFixed(3);
    const dropMeters = +(0.5 * g * Math.pow(timeOfFlightSec, 2)).toFixed(3);
    
    // Wind drift force F = 0.5 * rho * v_wind^2 * A
    const windAccelerationMps2 = crosswindMps * 1.8;
    const driftMeters = +(0.5 * windAccelerationMps2 * Math.pow(timeOfFlightSec, 2)).toFixed(3);

    // Visual reticle pixel scaling (1m = 120px on visor optic zoom)
    const dropPixels = Math.round(dropMeters * 120);
    const driftPixels = Math.round(driftMeters * 120);

    this.currentRangeM = targetRangeMeters;
    this.elevationDropPixels = dropPixels;
    this.windDeflectionPixels = driftPixels;

    // Standard elevation chevrons for rapid acquisition
    const chevrons = [
      { rangeM: 10, offsetPx: Math.round(0.5 * g * Math.pow(10 / this.muzzleVelocityMps, 2) * 120) },
      { rangeM: 30, offsetPx: Math.round(0.5 * g * Math.pow(30 / this.muzzleVelocityMps, 2) * 120) },
      { rangeM: 60, offsetPx: Math.round(0.5 * g * Math.pow(60 / this.muzzleVelocityMps, 2) * 120) },
      { rangeM: 100, offsetPx: Math.round(0.5 * g * Math.pow(100 / this.muzzleVelocityMps, 2) * 120) }
    ];

    return {
      targetRangeMeters,
      timeOfFlightSec,
      dropMeters,
      driftMeters,
      dropPixels,
      driftPixels,
      chevrons,
      leadCorrectionAngleMrad: +((dropMeters / targetRangeMeters) * 1000).toFixed(1)
    };
  }

  /**
   * Updates or mounts the HUD DOM element with ballistic reticle indicators.
   * @param {HTMLElement|null} container
   * @returns {Object} UI status
   */
  updateHudReticleView(container = null) {
    if (!container && typeof document !== 'undefined') {
      container = document.body;
    }

    if (container && typeof document !== 'undefined') {
      let reticle = container.querySelector('.ballistic-crosshair-hud');
      if (!reticle) {
        reticle = document.createElement('div');
        reticle.className = 'ballistic-crosshair-hud active';
        reticle.innerHTML = `
          <div class="range-distance-readout">00.0m</div>
          <div class="ballistic-pip"></div>
          <div class="ballistic-drop-chevron chevron-10m"></div>
          <div class="ballistic-drop-chevron chevron-30m"></div>
          <div class="ballistic-drop-chevron chevron-60m"></div>
          <div class="ballistic-drop-chevron chevron-100m"></div>
        `;
        container.appendChild(reticle);
      }

      const readout = reticle.querySelector('.range-distance-readout');
      if (readout) {
        readout.textContent = `${this.currentRangeM.toFixed(1)}m`;
      }

      const pip = reticle.querySelector('.ballistic-pip');
      if (pip) {
        pip.style.transform = `translate(${this.windDeflectionPixels}px, ${this.elevationDropPixels}px)`;
      }

      this.activeReticleElement = reticle;
    }

    return {
      rendered: Boolean(this.activeReticleElement),
      rangeM: this.currentRangeM,
      elevationDropPixels: this.elevationDropPixels,
      windDeflectionPixels: this.windDeflectionPixels
    };
  }
}
