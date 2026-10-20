/**
 * HumanQaDiegeticMedicompCauterizationTremorAuditor.js
 * 
 * Human Playtester QA Audit #3: Medicomp Surgical Cauterization & Agony Tremor Realism.
 * Replaces instant artificial healing with visceral diegetic surgery (Predator 1987, Predator 2):
 * bone stapling, blue burner cauterization (650 C), acute pain spikes inducing hand tremors
 * and camera aim jitter (+-8 deg), accompanied by the .medicomp-agony-vignette visual feedback.
 */

export class HumanQaDiegeticMedicompCauterizationTremorAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.cauterizerBurnerCelsius=650.0]
   * @param {number} [options.agonyDurationSec=2.2]
   */
  constructor(options = {}) {
    this.cauterizerBurnerCelsius = options.cauterizerBurnerCelsius || 650.0;
    this.agonyDurationSec = options.agonyDurationSec || 2.2;

    this.inSurgery = false;
    this.surgeryElapsedSec = 0.0;
    this.currentTremorDeg = 0.0;
    this.healthRecoveredTotal = 0;
    this.agonyVignetteActive = false;
  }

  /**
   * Initiates self-surgery using the Medicomp field kit.
   * @param {number} woundSeverity - 1 (minor flesh wound) to 3 (gaping chest/acid burn)
   * @returns {Object} Surgery initial telemetry
   */
  initiateMedicompSelfSurgery(woundSeverity = 2) {
    this.inSurgery = true;
    this.surgeryElapsedSec = 0.0;
    this.woundSeverity = Math.max(1, Math.min(3, woundSeverity));
    this.totalSurgeryDurationSec = this.agonyDurationSec * this.woundSeverity;
    this.agonyVignetteActive = true;
    this.currentTremorDeg = 6.5;

    return {
      inSurgery: true,
      woundSeverity: this.woundSeverity,
      totalSurgeryDurationSec: this.totalSurgeryDurationSec,
      cauterizerBurnerCelsius: this.cauterizerBurnerCelsius,
      agonyVignetteActive: true,
      surgicalStep: 'STAPLE_AND_CAUTERIZE'
    };
  }

  /**
   * Advances the painful cauterization process over time.
   * @param {number} deltaSec
   * @returns {Object} Step update and healed amount
   */
  processCauterizationTick(deltaSec = 0.5) {
    if (!this.inSurgery) {
      return { inSurgery: false, healthTickRecovered: 0 };
    }

    this.surgeryElapsedSec += deltaSec;
    const progress = Math.min(1.0, this.surgeryElapsedSec / this.totalSurgeryDurationSec);

    // Pain tremor peaks during active burning, then subsides
    if (progress < 0.65) {
      this.currentTremorDeg = +(Math.sin(this.surgeryElapsedSec * 16.0) * (4.5 + this.woundSeverity * 1.5)).toFixed(2);
      this.agonyVignetteActive = true;
    } else {
      this.currentTremorDeg = +(this.currentTremorDeg * 0.4).toFixed(2);
      this.agonyVignetteActive = progress < 0.9;
    }

    // Health regenerates progressively as flesh is sealed
    const healthTickRecovered = Math.round(25 * deltaSec * this.woundSeverity);
    this.healthRecoveredTotal += healthTickRecovered;

    const completed = progress >= 1.0;
    if (completed) {
      this.inSurgery = false;
      this.currentTremorDeg = 0.0;
      this.agonyVignetteActive = false;
    }

    return {
      inSurgery: this.inSurgery,
      progress: +progress.toFixed(2),
      healthTickRecovered,
      healthRecoveredTotal: this.healthRecoveredTotal,
      currentTremorDeg: this.currentTremorDeg,
      agonyVignetteActive: this.agonyVignetteActive,
      completed
    };
  }

  /**
   * Returns camera aim jitter offset angle in degrees caused by surgical pain tremors.
   * @returns {number} Offset in degrees
   */
  getAimTremorOffsetDeg() {
    return this.currentTremorDeg;
  }

  /**
   * Returns current telemetry.
   * @returns {Object}
   */
  getSurgeryTelemetry() {
    return {
      inSurgery: this.inSurgery,
      surgeryElapsedSec: +this.surgeryElapsedSec.toFixed(2),
      currentTremorDeg: this.currentTremorDeg,
      healthRecoveredTotal: this.healthRecoveredTotal,
      agonyVignetteActive: this.agonyVignetteActive,
      cauterizerBurnerCelsius: this.cauterizerBurnerCelsius
    };
  }
}
