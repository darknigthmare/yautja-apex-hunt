/**
 * HumanQaLevelDesignVentilationShaftResonanceAuditor.js
 * 
 * Chantier 10 & Audit QA #5 (Level Design):
 * Solves QA tester feedback: "Crawlspaces, HVAC ducts, and slaughterhouse
 * ventilation tunnels feel acoustically identical to open rooms. When stalking
 * inside a corrugated sheet-metal duct, footsteps and claw scrapes should reverberate
 * loudly down the hollow tube, alerting prey if the player moves too quickly without stealth crouch."
 * 
 * Implements acoustic tube duct acoustics: fundamental waveguide standing wave resonance,
 * sheet metal transient amplification (+14 dB), and stealth crawl acoustic dampening.
 */

export class HumanQaLevelDesignVentilationShaftResonanceAuditor {
  /**
   * @param {Object} options
   * @param {string} [options.shaftId='duct-slaughterhouse-sub-03']
   * @param {number} [options.ductLengthM=15.0]
   * @param {number} [options.crossSectionAreaM2=0.64] // 0.8m x 0.8m
   * @param {string} [options.wallMaterial='SHEET_GALVANIZED_STEEL']
   */
  constructor(options = {}) {
    this.shaftId = options.shaftId || 'duct-slaughterhouse-sub-03';
    this.ductLengthM = options.ductLengthM || 15.0;
    this.crossSectionAreaM2 = options.crossSectionAreaM2 || 0.64;
    this.wallMaterial = options.wallMaterial || 'SHEET_GALVANIZED_STEEL';

    this.currentAcousticDecibels = 28.0; // Ambient whisper
    this.guardsAlerted = false;
  }

  /**
   * Calculates the fundamental standing wave resonance frequency of the duct tube.
   * f_0 = c / (2 * L) where c = 343 m/s
   * @returns {Object} Acoustic tube resonance metrics
   */
  computeDuctResonanceParameters() {
    const cAir = 343.0;
    const fundamentalResonanceHz = +(cAir / (2 * this.ductLengthM)).toFixed(1);
    const harmonicFrequenciesHz = [
      fundamentalResonanceHz,
      +(fundamentalResonanceHz * 2).toFixed(1),
      +(fundamentalResonanceHz * 3).toFixed(1)
    ];

    const wallReflectionFactor = this.wallMaterial === 'SHEET_GALVANIZED_STEEL' ? 0.92 : 0.65;
    const reverberationTimeSec = +(0.161 * (this.ductLengthM * this.crossSectionAreaM2) / (1 - wallReflectionFactor + 0.01)).toFixed(2);

    return {
      ductLengthM: this.ductLengthM,
      crossSectionAreaM2: this.crossSectionAreaM2,
      wallMaterial: this.wallMaterial,
      fundamentalResonanceHz,
      harmonicFrequenciesHz,
      wallReflectionFactor,
      reverberationTimeSec
    };
  }

  /**
   * Evaluates player locomotion inside the duct and computes emitted noise.
   * @param {number} movementSpeedMps
   * @param {boolean} isCrouchStalking
   * @returns {Object} Acoustic emission and guard alert status
   */
  evaluateDuctLocomotionAcoustics(movementSpeedMps = 1.0, isCrouchStalking = true) {
    let baselineNoiseDb = 30.0;
    
    if (movementSpeedMps > 3.0) {
      // Sprinting or heavy running inside sheet metal duct
      baselineNoiseDb = 68.0;
    } else if (movementSpeedMps > 1.2) {
      // Normal upright walking
      baselineNoiseDb = 52.0;
    } else {
      // Careful slow crawl
      baselineNoiseDb = 28.0;
    }

    // Metal sheet amplification
    const resonanceBoostDb = this.wallMaterial === 'SHEET_GALVANIZED_STEEL' ? 14.0 : 4.0;
    const dampeningFactor = isCrouchStalking ? 0.2 : 1.0;
    
    const effectiveDecibels = +(baselineNoiseDb * dampeningFactor + (isCrouchStalking ? 0 : resonanceBoostDb)).toFixed(1);
    this.currentAcousticDecibels = effectiveDecibels;

    // Detection threshold for guards standing beneath or adjacent to duct grates
    const guardDetectionThresholdDb = 42.0;
    const alertsPrey = effectiveDecibels >= guardDetectionThresholdDb;
    this.guardsAlerted = alertsPrey;

    // Propagation distance down duct network: R = 10^((dB - 20) / 20)
    const acousticReachMeters = +(Math.pow(10, (effectiveDecibels - 20) / 35.0)).toFixed(1);

    return {
      movementSpeedMps,
      isCrouchStalking,
      effectiveDecibels,
      resonanceBoostDb,
      alertsPrey,
      acousticReachMeters,
      guardAlertTriggered: alertsPrey,
      stealthGrade: effectiveDecibels < 35.0 ? 'GHOST_SILENT' : (effectiveDecibels < 45.0 ? 'SUSPICIOUS_RATTLE' : 'HIGH_EXPOSURE_COMPROMISED')
    };
  }
}
