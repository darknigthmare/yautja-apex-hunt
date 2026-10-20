/**
 * HumanQaDiegeticBioMaskLensDamageAndAcidityAuditor.js
 * 
 * Human Playtester QA Audit #3: Bio-Mask Lens Cracking & Acid Blood Sizzle Realism.
 * Implements diegetic visual degradation on the Yautja HUD: physical lens fracture cracks,
 * corrosive fluoroantimonic acid etching, and thermal condensation fogging with a gauntlet wipe mechanic.
 */

export class HumanQaDiegeticBioMaskLensDamageAndAcidityAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.lensIntegrityPercentage=100.0]
   * @param {number} [options.acidEtchPercentage=0.0]
   * @param {number} [options.thermalFogPercentage=0.0]
   */
  constructor(options = {}) {
    this.lensIntegrityPercentage = options.lensIntegrityPercentage !== undefined ? options.lensIntegrityPercentage : 100.0;
    this.acidEtchPercentage = options.acidEtchPercentage !== undefined ? options.acidEtchPercentage : 0.0;
    this.thermalFogPercentage = options.thermalFogPercentage !== undefined ? options.thermalFogPercentage : 0.0;

    this.fractureCount = 0;
    this.acidBurningActive = false;
  }

  /**
   * Applies Xenomorph acid blood spray onto the outer mask lens.
   * @param {number} volumeMl - Volume of acid in milliliters
   * @param {number} [acidityPh=-12.0] - Fluoroantimonic acid superacid pH
   * @returns {Object} Acid etching telemetry
   */
  applyAcidSplash(volumeMl = 25.0, acidityPh = -12.0) {
    this.acidBurningActive = true;
    const causticFactor = Math.abs(acidityPh) * 0.12;
    const addedEtch = +(volumeMl * 0.45 * causticFactor).toFixed(1);
    this.acidEtchPercentage = Math.min(100.0, +(this.acidEtchPercentage + addedEtch).toFixed(1));

    const opticalBlurIntensity = +(this.acidEtchPercentage / 100.0).toFixed(2);
    const audioSizzleDurationSec = +(1.5 + (this.acidEtchPercentage / 50.0)).toFixed(1);

    return {
      acidBurningActive: true,
      volumeMl,
      acidEtchPercentage: this.acidEtchPercentage,
      opticalBlurIntensity,
      audioSizzleDurationSec,
      requiresWipe: this.acidEtchPercentage > 20.0
    };
  }

  /**
   * Applies blunt kinetic impact force (e.g. Queen headbutt, Grizzly paw swipe).
   * @param {number} impactJoules
   * @returns {Object} Lens fracture outcome
   */
  applyKineticImpact(impactJoules = 450) {
    if (impactJoules > 250) {
      this.fractureCount++;
      const integrityLoss = Math.min(60, Math.round(impactJoules * 0.06));
      this.lensIntegrityPercentage = Math.max(0, +(this.lensIntegrityPercentage - integrityLoss).toFixed(1));
    }

    const isShattered = this.lensIntegrityPercentage <= 15.0;

    return {
      impactJoules,
      fractureCount: this.fractureCount,
      lensIntegrityPercentage: this.lensIntegrityPercentage,
      isShattered,
      hudScanDistortionActive: this.lensIntegrityPercentage < 65.0
    };
  }

  /**
   * Wipes the visor lens using the Predator's leather gauntlet cuff.
   * Cleans off surface liquid acid, blood splatter, and condensation fog.
   * @param {boolean} [gauntletWipeActive=true]
   * @returns {Object} Cleaned visor status
   */
  wipeVisorLens(gauntletWipeActive = true) {
    if (!gauntletWipeActive) {
      return { wiped: false, reason: 'ACTION_NOT_ENGAGED' };
    }

    this.acidBurningActive = false;
    this.thermalFogPercentage = 0.0;
    // Etched glass permanent scars remain, but surface grime drops by 60%
    this.acidEtchPercentage = +(this.acidEtchPercentage * 0.4).toFixed(1);

    return {
      wiped: true,
      acidBurningActive: false,
      acidEtchPercentage: this.acidEtchPercentage,
      thermalFogPercentage: 0.0,
      clarityRestored: true
    };
  }

  /**
   * Calculates overall visual HUD distortion factor for post-processing shaders.
   * @returns {number} 0.0 (pristine) to 1.0 (heavily corrupted)
   */
  getHudDisruptionLevel() {
    const crackWeight = (100.0 - this.lensIntegrityPercentage) * 0.005;
    const acidWeight = this.acidEtchPercentage * 0.004;
    const fogWeight = this.thermalFogPercentage * 0.002;
    return +(Math.min(1.0, crackWeight + acidWeight + fogWeight)).toFixed(2);
  }

  /**
   * Returns complete lens telemetry.
   * @returns {Object}
   */
  getLensState() {
    return {
      lensIntegrityPercentage: this.lensIntegrityPercentage,
      acidEtchPercentage: this.acidEtchPercentage,
      thermalFogPercentage: this.thermalFogPercentage,
      fractureCount: this.fractureCount,
      acidBurningActive: this.acidBurningActive,
      hudDisruptionLevel: this.getHudDisruptionLevel()
    };
  }
}
