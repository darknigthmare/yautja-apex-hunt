/**
 * LosAngelesSlaughterhouseColdStorageSector.js
 * 
 * Predator 2 (1990) - Eastern Columbia Slaughterhouse Cold Storage Locker.
 * Simulates Peter Keyes' OWLF ambush: rows of frozen beef carcasses on overhead rails,
 * portable liquid nitrogen lances and fire extinguisher powder sprays exposing optical camouflage,
 * and the City Hunter cycling visor vision modes from Infrared to Ultraviolet to detect the OWLF team.
 */

export class LosAngelesSlaughterhouseColdStorageSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='la-slaughterhouse-cold-01']
   * @param {number} [options.roomTempC=1.5]
   * @param {number} [options.carcassCount=42]
   * @param {number} [options.nitrogenVaporPpm=650.0]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'la-slaughterhouse-cold-01';
    this.roomTempC = options.roomTempC || 1.5;
    this.carcassCount = options.carcassCount || 42;
    this.nitrogenVaporPpm = options.nitrogenVaporPpm || 650.0;

    this.activeVisionMode = 'INFRARED'; // 'INFRARED', 'ULTRAVIOLET', 'ELECTROMAGNETIC'
    this.cloakExposedByPowder = false;
    this.nitrogenLancesFiring = false;
    this.owlfAmbushTeamDetected = false;
  }

  /**
   * Peter Keyes' team activates high-pressure liquid nitrogen lances and dry powder extinguishers.
   * Fine particle dust coats the invisible hunter, revealing optical distortion.
   * @param {number} sprayDurationSec
   * @param {number} nozzlePressureBar
   * @returns {Object} Spray exposure metrics
   */
  deployNitrogenAndPowderSpray(sprayDurationSec = 4.0, nozzlePressureBar = 12.0) {
    this.nitrogenLancesFiring = true;
    this.cloakExposedByPowder = sprayDurationSec >= 2.0 && nozzlePressureBar >= 8.0;
    const thermalSignatureMuffled = true;
    const dustSilhouetteCoverageRatio = this.cloakExposedByPowder ? 0.85 : 0.25;

    return {
      nitrogenLancesFiring: this.nitrogenLancesFiring,
      cloakExposedByPowder: this.cloakExposedByPowder,
      dustSilhouetteCoverageRatio,
      thermalSignatureMuffled,
      owlfGunnersLockedOn: this.cloakExposedByPowder,
      frostLayerMm: +(sprayDurationSec * 0.4).toFixed(1)
    };
  }

  /**
   * City Hunter cycles vision modes to counter OWLF thermal insulation suits.
   * Keyes' team wears insulated suits that hide them in Infrared, but emit UV/EM flashlight halos.
   * @param {string} targetMode - 'INFRARED', 'ULTRAVIOLET', or 'ELECTROMAGNETIC'
   * @returns {Object} Spectrum cycle telemetry
   */
  cycleBioMaskVisionMode(targetMode = 'ULTRAVIOLET') {
    const validModes = ['INFRARED', 'ULTRAVIOLET', 'ELECTROMAGNETIC'];
    if (!validModes.includes(targetMode)) {
      return { success: false, reason: 'INVALID_VISION_MODE' };
    }

    this.activeVisionMode = targetMode;
    // In film canon: Ultraviolet/EM reveals OWLF searchlight ultraviolet phosphorescence
    const detectsInsulatedSoldiers = targetMode === 'ULTRAVIOLET' || targetMode === 'ELECTROMAGNETIC';
    this.owlfAmbushTeamDetected = detectsInsulatedSoldiers;

    return {
      success: true,
      activeVisionMode: this.activeVisionMode,
      detectsInsulatedSoldiers,
      owlfAmbushTeamDetected: this.owlfAmbushTeamDetected,
      fovContrastGain: targetMode === 'ULTRAVIOLET' ? 2.4 : 1.0,
      targetHighlightColor: targetMode === 'ULTRAVIOLET' ? '#00ffff' : '#ff0033'
    };
  }

  /**
   * Resolves a beef carcass absorbing bullets or plasma fire along the meat rail.
   * @param {number} projectileKineticEnergyJoules
   * @returns {Object} Carcass ballistic absorption
   */
  resolveCarcassBallisticCover(projectileKineticEnergyJoules = 1800) {
    const carcassMaxAbsorptionJoules = 2400; // Dense frozen beef muscle
    const roundPiercedThrough = projectileKineticEnergyJoules > carcassMaxAbsorptionJoules;
    const retainedEnergyJoules = Math.max(0, projectileKineticEnergyJoules - carcassMaxAbsorptionJoules);
    const fleshSlapDecibels = 82;

    return {
      roundPiercedThrough,
      absorbedEnergyJoules: Math.min(projectileKineticEnergyJoules, carcassMaxAbsorptionJoules),
      retainedEnergyJoules,
      carcassMassKg: 320,
      fleshSlapDecibels,
      pendulumSwingImpulseN: Math.round(projectileKineticEnergyJoules * 0.08)
    };
  }
}
