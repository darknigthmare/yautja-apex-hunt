/**
 * ValVerdeTriLaserAtmosphericRefractionSector.js
 * 
 * Chantier Level Design #7 - Les Balises Tri-Laser du Bio-Masque & Réfraction sur la Pluie.
 * Canonical 1:1 Predator (1987) fidelity:
 * - The iconic triangular tri-dot red laser targeting reticule (635 nm wavelength, 15 mW power, 12mm beam width).
 * - Atmospheric scattering through heavy tropical downpour and mist:
 *   - Rain droplets (0.5mm - 2.5mm) generate Mie scattering, forming visible volumetric red light beams in the dark canopy.
 *   - Lock-on convergence sequence: 3 red dots track the target, converging over 1.2s before plasma bolt discharge.
 *   - Audio telemetry: distinctive ascending digital targeting chirp (2800 Hz -> 3600 Hz) warning the player of an incoming blast.
 *   - Breaking target lock: diving behind hardwood tree trunks, submerging in water, or dropping prone into deep mud breaks the lock.
 */

export class ValVerdeTriLaserAtmosphericRefractionSector {
  /**
   * @param {Object} options
   * @param {number} [options.wavelengthNm=635.0]
   * @param {number} [options.laserPowerMw=15.0]
   * @param {number} [options.lockConvergenceTimeSec=1.2]
   */
  constructor(options = {}) {
    this.wavelengthNm = options.wavelengthNm ?? 635.0;
    this.laserPowerMw = options.laserPowerMw ?? 15.0;
    this.lockConvergenceTimeSec = options.lockConvergenceTimeSec ?? 1.2;

    this.lockAcquired = false;
    this.convergenceProgressPct = 0;
  }

  /**
   * Evaluates atmospheric volumetric beam scattering through tropical rain and mist.
   * @param {number} rainfallRateMmH - Rainfall intensity (e.g. 45 mm/h torrential rain)
   * @param {number} distanceM - Distance between hunter and target
   * @returns {Object} Volumetric beam scattering telemetry
   */
  evaluateVolumetricBeamScattering(rainfallRateMmH = 45.0, distanceM = 25.0) {
    // Mie scattering coefficient: proportional to droplet density
    const scatteringCoefficient = Math.min(1.0, (rainfallRateMmH / 50.0) * 0.85);
    const beamVisibilityScore = Math.round(scatteringCoefficient * 100);
    const beamDiameterSpreadMm = Math.round(12 + distanceM * 1.8);

    return {
      wavelengthNm: this.wavelengthNm,
      laserColorHex: '#ff0033',
      rainfallRateMmH,
      distanceM,
      scatteringCoefficient: Math.round(scatteringCoefficient * 100) / 100,
      beamVisibilityScore,
      beamDiameterSpreadMm,
      volumetricConeVisibleToHumanEye: beamVisibilityScore >= 40,
      rainSizzleAcousticDb: 54
    };
  }

  /**
   * Begins tri-laser convergence lock on the target.
   * @param {number} trackingDurationSec
   * @param {boolean} [targetInCover=false]
   * @returns {Object} Lock-on progress update
   */
  trackTargetConvergence(trackingDurationSec = 0.6, targetInCover = false) {
    if (targetInCover) {
      this.lockAcquired = false;
      this.convergenceProgressPct = 0;
      return {
        lockAcquired: false,
        convergenceProgressPct: 0,
        lockBrokenReason: 'TARGET_DIVED_INTO_COVER',
        plasmaDischargeReady: false
      };
    }

    this.convergenceProgressPct = Math.min(100, Math.round((trackingDurationSec / this.lockConvergenceTimeSec) * 100));
    this.lockAcquired = this.convergenceProgressPct >= 100;

    return {
      lockAcquired: this.lockAcquired,
      convergenceProgressPct: this.convergenceProgressPct,
      plasmaDischargeReady: this.lockAcquired,
      triDotSpreadMm: Math.max(0, Math.round(180 * (1 - this.convergenceProgressPct / 100))),
      acousticWarningChirpHz: Math.round(2800 + (this.convergenceProgressPct / 100) * 800)
    };
  }
}
