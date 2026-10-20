/**
 * HumanQaDiegeticMedicompCauterizationAuditor.js
 * 
 * Chantier 8 & Audit QA #3 (Diégétique):
 * Solves QA tester feedback: "When healing with the Medicomp, health instantly
 * jumps up with a generic green pulse. In film canon (Predator, Predator 2),
 * the Yautja grunts in agonizing pain, applies burning blue coagulant paste,
 * and cauterizes bullet wounds with white-hot sizzling smoke."
 * 
 * Implements canonical 3-stage surgical field treatment: shrapnel extraction,
 * blue coagulant paste application, and white-hot ceramic thermal cauterization.
 */

export class HumanQaDiegeticMedicompCauterizationAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.cauterizationTempC=480.0]
   * @param {number} [options.baseHealAmount=120.0]
   */
  constructor(options = {}) {
    this.cauterizationTempC = options.cauterizationTempC || 480.0;
    this.baseHealAmount = options.baseHealAmount || 120.0;

    this.currentSurgeryStage = 'IDLE'; // 'EXTRACTION', 'COAGULANT_PASTE', 'CAUTERIZING', 'COMPLETED'
    this.painToleranceRating = 0.95;
    this.bleedingStatusRemoved = false;
  }

  /**
   * Step 1: Extracts bullet or shrapnel fragment with surgical tweezers.
   * @param {string} foreignBodyType - e.g. "9mm Hollow Point"
   * @returns {Object} Extraction telemetry
   */
  performFragmentExtraction(foreignBodyType = '9mm Hollow Point') {
    this.currentSurgeryStage = 'EXTRACTION';

    return {
      success: true,
      stage: this.currentSurgeryStage,
      foreignBodyType,
      extractionDurationSec: 1.2,
      painSpikeDecibels: 72,
      shrapnelRemoved: true
    };
  }

  /**
   * Step 2: Injects and rubs bubbling luminescent blue coagulant paste into open wound.
   * @param {number} pasteVolumeMl
   * @returns {Object} Coagulant telemetry
   */
  applyBlueMedicinalCoagulantPaste(pasteVolumeMl = 15.0) {
    this.currentSurgeryStage = 'COAGULANT_PASTE';
    this.bleedingStatusRemoved = true;
    const initialHealthRestored = Math.round(this.baseHealAmount * 0.4); // 40% initial heal

    return {
      success: true,
      stage: this.currentSurgeryStage,
      pasteVolumeMl,
      coagulantColorHex: '#00a8ff',
      initialHealthRestored,
      bleedingStopped: true,
      cellularRegenFactor: 1.8
    };
  }

  /**
   * Step 3: Applies glowing ceramic cauterizer iron directly to the wound.
   * Causes extreme pain (agonizing roar), sizzling smoke, and completes full healing.
   * @returns {Object} Cauterization outcome
   */
  executeThermalCauterizationBurn() {
    this.currentSurgeryStage = 'CAUTERIZING';
    const remainingHealthRestored = Math.round(this.baseHealAmount * 0.6); // 60% remaining heal
    const painSpikeDecibels = 110; // Agonizing roar
    this.currentSurgeryStage = 'COMPLETED';

    return {
      success: true,
      stage: this.currentSurgeryStage,
      cauterizationTempC: this.cauterizationTempC,
      remainingHealthRestored,
      totalHealthRestored: this.baseHealAmount,
      painSpikeDecibels,
      whiteSmokePlumeSec: 3.5,
      woundHermeticallySealed: true,
      yautjaAgonyRoarTriggered: true
    };
  }

  /**
   * Updates HUD styling for cauterization smoke overlay.
   * @param {HTMLElement|null} hudContainer
   * @returns {Object} Visual update summary
   */
  applyDiegeticSmokeOverlay(hudContainer = null) {
    if (!hudContainer && typeof document !== 'undefined') {
      hudContainer = document.querySelector('.yautja-hud-container') || document.body;
    }

    if (hudContainer) {
      let smoke = hudContainer.querySelector('.medicomp-cauterize-smoke');
      if (!smoke) {
        smoke = document.createElement('div');
        smoke.className = 'medicomp-cauterize-smoke';
        hudContainer.appendChild(smoke);
      }

      if (this.currentSurgeryStage === 'COMPLETED' || this.currentSurgeryStage === 'CAUTERIZING') {
        smoke.classList.add('active');
      } else {
        smoke.classList.remove('active');
      }
    }

    return {
      stage: this.currentSurgeryStage,
      bleedingStatusRemoved: this.bleedingStatusRemoved,
      stylesApplied: Boolean(hudContainer)
    };
  }
}
