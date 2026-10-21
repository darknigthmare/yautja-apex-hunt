/**
 * ValVerdePhosphorusSmokeScreenSector.js
 * 
 * Chantier Level Design #4 - Système de Fumigènes & Visibilité Infrarouge Dégradée au Phosphore.
 * Canonical 1:1 Predator (1987) fidelity:
 * - M34 white phosphorus smoke grenade / burning damp kapok brush generating intense particulate smoke.
 * - Pyrotechnic burning particles (1100 °C) emit extreme thermal radiation.
 * - Thermal bloom effect: the Yautja bio-mask's thermal vision is completely whiteout-blinded inside the smoke zone.
 * - Blocks tri-laser aiming and plasma caster target lock-on, allowing Dutch to reposition covertly.
 * - Wind dispersion modeling (dissipates over 35s under tropical crosswinds).
 */

export class ValVerdePhosphorusSmokeScreenSector {
  /**
   * @param {Object} options
   * @param {number} [options.cloudRadiusM=18.0]
   * @param {number} [options.burnDurationSec=35.0]
   */
  constructor(options = {}) {
    this.cloudRadiusM = options.cloudRadiusM ?? 18.0;
    this.burnDurationSec = options.burnDurationSec ?? 35.0;

    this.activeCloud = false;
    this.remainingBurnSec = 0;
    this.smokeDensityPct = 0;
  }

  /**
   * Deploys white phosphorus smoke grenade or ignites damp thermal brush.
   * @param {string} [deployType='M34_WP_GRENADE']
   * @returns {Object} Deployment telemetry
   */
  deployPhosphorusSmoke(deployType = 'M34_WP_GRENADE') {
    this.activeCloud = true;
    this.remainingBurnSec = this.burnDurationSec;
    this.smokeDensityPct = 100.0;

    return {
      success: true,
      deployType,
      cloudRadiusM: this.cloudRadiusM,
      particleTempC: 1100.0,
      burnDurationSec: this.burnDurationSec,
      thermalBloomSaturating: true,
      bioMaskTargetLockBlocked: true,
      acousticHissDb: 78
    };
  }

  /**
   * Updates smoke dissipation over time with wind drift.
   * @param {number} deltaSeconds
   * @param {number} [crossWindMps=2.5]
   * @returns {Object} Smoke dispersal telemetry
   */
  updateSmokeDispersion(deltaSeconds = 5.0, crossWindMps = 2.5) {
    if (!this.activeCloud) {
      return { activeCloud: false, smokeDensityPct: 0 };
    }

    this.remainingBurnSec = Math.max(0, this.remainingBurnSec - deltaSeconds);
    const windDissipationRate = (crossWindMps / 2.0) * (deltaSeconds / this.burnDurationSec) * 100.0;
    this.smokeDensityPct = Math.max(0, Math.round((this.smokeDensityPct - windDissipationRate) * 10) / 10);

    if (this.remainingBurnSec <= 0 || this.smokeDensityPct <= 10.0) {
      this.activeCloud = false;
      this.smokeDensityPct = 0;
    }

    const thermalBloomActive = this.smokeDensityPct >= 40.0;

    return {
      activeCloud: this.activeCloud,
      remainingBurnSec: this.remainingBurnSec,
      smokeDensityPct: this.smokeDensityPct,
      thermalBloomActive,
      bioMaskTargetLockBlocked: thermalBloomActive
    };
  }
}
