/**
 * SuperPredatorCampClassicConfinementCageSector.js
 * 
 * Predators (2010) - Super Predator hunting camp in the game preserve jungle.
 * Simulates the captive Classic Predator bound to an extraterrestrial bronze torture totem
 * with high-voltage restraining shackles. The player can sever electrified conduits, pick the alien locks,
 * and unleash the Classic Predator as an allied AI combat distraction against the Berserker.
 */

export class SuperPredatorCampClassicConfinementCageSector {
  /**
   * @param {Object} options
   * @param {string} [options.campId='super-predator-camp-01']
   * @param {number} [options.shackleLockIntegrity=250]
   * @param {boolean} [options.shackleElectrified=true]
   * @param {boolean} [options.classicFreed=false]
   * @param {number} [options.campAlertLevel=0.1]
   */
  constructor(options = {}) {
    this.campId = options.campId || 'super-predator-camp-01';
    this.shackleLockIntegrity = options.shackleLockIntegrity !== undefined ? options.shackleLockIntegrity : 250;
    this.shackleElectrified = options.shackleElectrified !== undefined ? options.shackleElectrified : true;
    this.classicFreed = options.classicFreed !== undefined ? options.classicFreed : false;
    this.campAlertLevel = options.campAlertLevel !== undefined ? options.campAlertLevel : 0.1;

    this.conduitSevered = false;
    this.lockPickProgress = 0.0;
  }

  /**
   * Severs the high-voltage power conduits feeding the electrified shackles.
   * @param {number} [plasmaDamage=150]
   * @returns {Object} Conduit telemetry
   */
  severPowerConduits(plasmaDamage = 150) {
    if (this.conduitSevered) {
      return { conduitSevered: true, shackleElectrified: false };
    }

    if (plasmaDamage >= 100) {
      this.conduitSevered = true;
      this.shackleElectrified = false;
      this.campAlertLevel = Math.min(1.0, +(this.campAlertLevel + 0.25).toFixed(2));

      return {
        success: true,
        conduitSevered: true,
        shackleElectrified: false,
        sparksDissipated: true,
        campAlertLevel: this.campAlertLevel
      };
    }

    return {
      success: false,
      conduitSevered: false,
      shackleElectrified: true,
      reason: 'INSUFFICIENT_CUTTING_FORCE'
    };
  }

  /**
   * Picks the alien locking mechanism with fine wristblade manipulation.
   * @param {number} wristbladeSharpness - 0.5 to 1.0
   * @param {number} deltaSec
   * @returns {Object} Lockpicking progress
   */
  pickShackleLockWithWristblades(wristbladeSharpness = 1.0, deltaSec = 1.0) {
    if (this.classicFreed) {
      return { success: true, classicFreed: true, lockPickProgress: 1.0 };
    }

    if (this.shackleElectrified) {
      return {
        success: false,
        reason: 'SHACKLES_ELECTRIFIED_HAZARD',
        shockDamageTaken: 45
      };
    }

    const progressRate = 0.35 * wristbladeSharpness;
    this.lockPickProgress = Math.min(1.0, +(this.lockPickProgress + progressRate * deltaSec).toFixed(2));
    this.shackleLockIntegrity = Math.max(0, Math.round(250 * (1 - this.lockPickProgress)));

    if (this.lockPickProgress >= 1.0) {
      return this.unshackleClassicPredator();
    }

    return {
      success: false,
      lockPickProgress: this.lockPickProgress,
      shackleLockIntegrity: this.shackleLockIntegrity,
      classicFreed: false
    };
  }

  /**
   * Unshackles the Classic Predator, triggering a victory roar and spawning an allied AI distraction.
   * @returns {Object} Unshackling outcome
   */
  unshackleClassicPredator() {
    this.classicFreed = true;
    this.shackleLockIntegrity = 0;
    this.lockPickProgress = 1.0;
    this.campAlertLevel = 1.0; // Camp goes into full combat alert

    return {
      success: true,
      classicFreed: true,
      alliedAiActive: true,
      unshackledRoarTriggered: true,
      berserkerDistractionScore: 0.95,
      trophyHonorBonus: 350
    };
  }

  /**
   * Returns current camp telemetry.
   * @returns {Object}
   */
  getCampState() {
    return {
      campId: this.campId,
      shackleLockIntegrity: this.shackleLockIntegrity,
      shackleElectrified: this.shackleElectrified,
      conduitSevered: this.conduitSevered,
      lockPickProgress: this.lockPickProgress,
      classicFreed: this.classicFreed,
      campAlertLevel: this.campAlertLevel
    };
  }
}
