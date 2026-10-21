/**
 * ValVerdeAerialVineTraverseSector.js
 * 
 * Chantier Level Design #5 - Mangrove d'Échasses & Lianes de Franchissement Aérien de Dutch.
 * Canonical 1:1 Predator (1987) fidelity:
 * - Dutch swings across a flooded mangrove chasm using a thick hanging jungle liana to bypass quicksand pits.
 * - Pendulum swinging physics:
 *   - Liana length L = 12.0m, start launch angle theta = 42 deg.
 *   - Tangential velocity: v_max = sqrt(2 * g * L * (1 - cos(theta))).
 *   - Tension load on the vine at lowest point: T = m * (g + v^2 / L).
 *   - Crossing span: ~16m across the mangrove gorge.
 *   - Stealth landing check: quiet impact on mossy buttress root (42 dB) versus splashing into water.
 */

export class ValVerdeAerialVineTraverseSector {
  /**
   * @param {Object} options
   * @param {number} [options.vineLengthM=12.0]
   * @param {number} [options.chasmWidthM=15.5]
   */
  constructor(options = {}) {
    this.vineLengthM = options.vineLengthM ?? 12.0;
    this.chasmWidthM = options.chasmWidthM ?? 15.5;
    this.gravity = 9.81;
  }

  /**
   * Computes pendulum dynamics of the aerial vine swing.
   * @param {number} startAngleDeg - Initial launch tilt angle (typically 35-50 deg)
   * @param {number} playerMassKg - Player body mass
   * @returns {Object} Swing telemetry
   */
  computeVineSwingDynamics(startAngleDeg = 42.0, playerMassKg = 105.0) {
    const angleRad = (startAngleDeg * Math.PI) / 180.0;
    const maxTangentialSpeedMps = Math.sqrt(2 * this.gravity * this.vineLengthM * (1 - Math.cos(angleRad)));
    const maxTensionLoadN = playerMassKg * (this.gravity + Math.pow(maxTangentialSpeedMps, 2) / this.vineLengthM);
    const horizontalReachM = 2 * this.vineLengthM * Math.sin(angleRad);
    const successfullyCrossed = horizontalReachM >= this.chasmWidthM;

    return {
      vineLengthM: this.vineLengthM,
      startAngleDeg,
      horizontalReachM: Math.round(horizontalReachM * 10) / 10,
      chasmWidthM: this.chasmWidthM,
      maxTangentialSpeedMps: Math.round(maxTangentialSpeedMps * 10) / 10,
      maxTensionLoadN: Math.round(maxTensionLoadN),
      successfullyCrossed,
      apexElevationM: Math.round(this.vineLengthM * (1 - Math.cos(angleRad)) * 10) / 10
    };
  }

  /**
   * Resolves release timing and landing on the far embankment root.
   * @param {number} releaseTimingErrorSec - Deviation from optimal bottom/apex release (-0.5 to +0.5)
   * @returns {Object} Landing outcome
   */
  resolveVineLanding(releaseTimingErrorSec = 0.0) {
    const isCleanLanding = Math.abs(releaseTimingErrorSec) <= 0.18;
    const landingAcousticDb = isCleanLanding ? 42 : 78;

    return {
      success: true,
      cleanLanding: isCleanLanding,
      landingTarget: isCleanLanding ? 'MOSSY_KAPOK_BUTTRESS_ROOT' : 'MANGROVE_SILT_SPLASH',
      landingAcousticDb,
      stealthMaintained: isCleanLanding
    };
  }
}
