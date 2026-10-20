/**
 * StargazerDecontaminationAirlockSector.js
 * 
 * The Predator (2018) - Project Stargazer underground research facility airlock.
 * Simulates hermetic blast door locking mechanisms, sterilizing neurotoxin gas cycles,
 * Yautja wristpad security override hacking, automated ceiling defense turrets,
 * and bio-mask atmospheric filtration mechanics.
 */

export class StargazerDecontaminationAirlockSector {
  /**
   * @param {Object} options
   * @param {string} [options.airlockId='stargazer-decon-01']
   * @param {boolean} [options.blastDoorSealed=true]
   * @param {boolean} [options.gasVaporActive=false]
   * @param {number} [options.deconCycleProgress=0.0]
   * @param {boolean} [options.turretOnline=true]
   */
  constructor(options = {}) {
    this.airlockId = options.airlockId || 'stargazer-decon-01';
    this.blastDoorSealed = options.blastDoorSealed !== undefined ? options.blastDoorSealed : true;
    this.gasVaporActive = options.gasVaporActive !== undefined ? options.gasVaporActive : false;
    this.deconCycleProgress = options.deconCycleProgress !== undefined ? options.deconCycleProgress : 0.0;
    this.turretOnline = options.turretOnline !== undefined ? options.turretOnline : true;

    this.turretHealth = 150;
    this.activeGasType = 'NEUROTOXIN_AEROSOL_ST-4';
  }

  /**
   * Initiates or advances the automated sterilizing decontamination gas cycle.
   * @param {string} [targetGas='NEUROTOXIN_AEROSOL_ST-4']
   * @param {number} deltaSeconds
   * @returns {Object} Decontamination telemetry
   */
  cycleDecontaminationProtocol(targetGas = 'NEUROTOXIN_AEROSOL_ST-4', deltaSeconds = 1.0) {
    this.gasVaporActive = true;
    this.activeGasType = targetGas;
    this.deconCycleProgress = Math.min(1.0, +(this.deconCycleProgress + 0.25 * deltaSeconds).toFixed(2));

    const gasConcentrationPpm = Math.round(this.deconCycleProgress * 450); // Up to 450 ppm lethal neurotoxin
    const cycleComplete = this.deconCycleProgress >= 1.0;

    return {
      gasVaporActive: this.gasVaporActive,
      activeGasType: this.activeGasType,
      deconCycleProgress: this.deconCycleProgress,
      gasConcentrationPpm,
      cycleComplete
    };
  }

  /**
   * Overrides heavy titanium blast door seals using Yautja wristpad frequency injection.
   * @param {string} wristpadCode
   * @returns {Object} Blast door status
   */
  hackBlastDoorOverride(wristpadCode) {
    const validKeys = ['STARGAZER-DOOR-BREACH-01', 'LAB-CONTAINMENT-RELEASE', 'OVERRIDE-BLAST-SEAL'];
    const authorized = validKeys.includes(wristpadCode) || (typeof wristpadCode === 'string' && wristpadCode.startsWith('OVERRIDE-'));

    if (authorized) {
      this.blastDoorSealed = false;
      this.gasVaporActive = false; // Pressure equalization vents the gas
      return {
        success: true,
        blastDoorSealed: false,
        doorsUnlatched: true,
        gasVented: true
      };
    }

    return {
      success: false,
      blastDoorSealed: true,
      alarmTriggered: true,
      reason: 'AUTHORIZATION_DENIED'
    };
  }

  /**
   * Neutralizes or destroys the automated ceiling sentry turret.
   * @param {number} damage
   * @returns {Object} Turret condition
   */
  neutralizeCeilingTurret(damage = 75) {
    if (!this.turretOnline) {
      return { turretOnline: false, turretHealth: 0 };
    }

    this.turretHealth = Math.max(0, this.turretHealth - damage);
    if (this.turretHealth <= 0) {
      this.turretOnline = false;
      return {
        turretOnline: false,
        turretHealth: 0,
        destroyed: true,
        turretSentryDisabled: true
      };
    }

    return {
      turretOnline: true,
      turretHealth: this.turretHealth,
      destroyed: false
    };
  }

  /**
   * Evaluates biological toxicity exposure to neurotoxin vapors.
   * If the bio-mask is equipped, filtration canisters neutralize 100% of atmospheric toxins.
   * @param {number} exposureSec
   * @param {boolean} maskEquipped
   * @returns {Object} Toxicity telemetry
   */
  evaluateToxinExposure(exposureSec = 1.0, maskEquipped = true) {
    if (!this.gasVaporActive || this.deconCycleProgress <= 0.05) {
      return {
        affected: false,
        damagePerSec: 0,
        maskFiltrationActive: maskEquipped
      };
    }

    if (maskEquipped) {
      return {
        affected: false,
        damagePerSec: 0,
        maskFiltrationActive: true,
        filterDurabilityRemaining: 0.95
      };
    }

    // Mask is off: severe neurotoxin pulmonary damage
    const damagePerSec = Math.round(28 * (this.deconCycleProgress || 0.5));
    const totalDamage = Math.round(damagePerSec * exposureSec);

    return {
      affected: true,
      damagePerSec,
      totalDamage,
      maskFiltrationActive: false,
      paralysisRisk: exposureSec > 3.0
    };
  }

  /**
   * Returns current telemetry.
   * @returns {Object}
   */
  getAirlockTelemetry() {
    return {
      airlockId: this.airlockId,
      blastDoorSealed: this.blastDoorSealed,
      gasVaporActive: this.gasVaporActive,
      deconCycleProgress: this.deconCycleProgress,
      turretOnline: this.turretOnline,
      turretHealth: this.turretHealth,
      activeGasType: this.activeGasType
    };
  }
}
