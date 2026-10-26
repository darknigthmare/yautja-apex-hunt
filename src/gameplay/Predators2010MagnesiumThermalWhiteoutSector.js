/**
 * Predators2010MagnesiumThermalWhiteoutSector.js
 *
 * Chantier de Level Design 5 (v185) - Predators (2010)
 * 1:1 Canonical Level Design: Magnesium Flare Infrared Whiteout & Biomask Reboot
 *
 * Canonical Scene: In the humid clearing, Royce sets off an improvised magnesium flare charge.
 * The sudden 3,000 K incandescent thermal flash (85,000 lux) floods the infrared spectrum,
 * blinding the Super Predator's bio-mask thermal vision for 2.8 seconds and disrupting active cloaking.
 */

export class Predators2010MagnesiumThermalWhiteoutSector {
  /**
   * @param {Object} options
   * @param {number} [options.peakLuminosityLux=85000.0] Luminosité de crête du magnésium (lux)
   * @param {number} [options.flareCombustionTempK=3000.0] Température de combustion thermique (K)
   * @param {number} [options.biomaskRebootDurationSeconds=2.8] Durée de redémarrage de la visière (s)
   */
  constructor(options = {}) {
    this.peakLuminosityLux = options.peakLuminosityLux ?? 85000.0;
    this.flareCombustionTempK = options.flareCombustionTempK ?? 3000.0;
    this.biomaskRebootDurationSeconds = options.biomaskRebootDurationSeconds ?? 2.8;

    // État runtime
    this.flareIgnited = false;
    this.sensorWhiteoutActive = false;
    this.rebootTimerRemaining = 0.0;
    this.predatorStunned = false;
    this.cloakingShortCircuited = false;
  }

  /**
   * Détonation de la fusée éclairante au magnésium
   * @param {number} distanceToPredatorM Distance au chasseur Super Predator (m)
   */
  igniteMagnesiumCharge(distanceToPredatorM = 8.0) {
    this.flareIgnited = true;

    if (distanceToPredatorM <= 15.0) {
      this.sensorWhiteoutActive = true;
      this.rebootTimerRemaining = this.biomaskRebootDurationSeconds;
      this.predatorStunned = true;
      this.cloakingShortCircuited = true;

      return {
        status: 'MAGNESIUM_WHITEOUT_DETONATED',
        combustionTempK: this.flareCombustionTempK,
        luminosityLux: this.peakLuminosityLux,
        biomaskSensorsOverloaded: true,
        rebootSeconds: this.biomaskRebootDurationSeconds,
        predatorStunned: true,
        cloakForcedOffline: true
      };
    }

    return {
      status: 'FLARE_IGNITED_OUTSIDE_CRITICAL_BLINDING_RADIUS',
      distanceM: distanceToPredatorM
    };
  }

  /**
   * Progression du redémarrage du bio-masque
   * @param {number} deltaSeconds
   */
  updateBiomaskReboot(deltaSeconds) {
    if (!this.sensorWhiteoutActive) {
      return { active: false };
    }

    this.rebootTimerRemaining = Math.max(0.0, this.rebootTimerRemaining - deltaSeconds);
    if (this.rebootTimerRemaining === 0.0) {
      this.sensorWhiteoutActive = false;
      this.predatorStunned = false;
      return {
        active: false,
        status: 'BIOMASK_OPTICAL_REBOOT_COMPLETED',
        infraredVisionRestored: true
      };
    }

    return {
      active: true,
      status: 'BIOMASK_SENSORS_REBOOTING',
      remainingSeconds: parseFloat(this.rebootTimerRemaining.toFixed(2))
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'Predators2010MagnesiumThermalWhiteoutSector',
      flareIgnited: this.flareIgnited,
      sensorWhiteoutActive: this.sensorWhiteoutActive,
      rebootTimerRemaining: this.rebootTimerRemaining,
      predatorStunned: this.predatorStunned,
      cloakingShortCircuited: this.cloakingShortCircuited
    };
  }
}
