/**
 * StargazerCortexCargoUpgradeTransportCrateSector.js
 * 
 * The Predator (2018) - Project Stargazer cargo staging bay.
 * Simulates heavy reinforced titanium-mesh transport crates holding the dormant Upgrade Predator
 * bio-cortex exo-suit technology. Features triple biometric optical iris scanner hacking,
 * magnetic clamp forcefields, pneumatic exhaust releases, and tech salvage mechanics.
 */

export class StargazerCortexCargoUpgradeTransportCrateSector {
  /**
   * @param {Object} options
   * @param {string} [options.crateId='stargazer-cargo-crate-01']
   * @param {boolean} [options.tripleIrisLocked=true]
   * @param {boolean} [options.magneticClampActive=true]
   * @param {boolean} [options.cortexSuitLooted=false]
   */
  constructor(options = {}) {
    this.crateId = options.crateId || 'stargazer-cargo-crate-01';
    this.tripleIrisLocked = options.tripleIrisLocked !== undefined ? options.tripleIrisLocked : true;
    this.magneticClampActive = options.magneticClampActive !== undefined ? options.magneticClampActive : true;
    this.cortexSuitLooted = options.cortexSuitLooted !== undefined ? options.cortexSuitLooted : false;

    this.hackedIrisCount = 0;
    this.magneticPowerJoules = 4500;
  }

  /**
   * Hacks the triple biometric optical iris scanners using tuned plasma pulse frequencies.
   * @param {number} [plasmaFrequencyKhz=420.5]
   * @returns {Object} Hack outcome
   */
  hackIrisBiometricLock(plasmaFrequencyKhz = 420.5) {
    if (!this.tripleIrisLocked) {
      return { tripleIrisLocked: false, hackedIrisCount: 3 };
    }

    const isValidFrequency = plasmaFrequencyKhz >= 400 && plasmaFrequencyKhz <= 450;
    if (isValidFrequency) {
      this.hackedIrisCount = Math.min(3, this.hackedIrisCount + 1);
      if (this.hackedIrisCount >= 3) {
        this.tripleIrisLocked = false;
      }

      return {
        success: true,
        hackedIrisCount: this.hackedIrisCount,
        tripleIrisLocked: this.tripleIrisLocked,
        irisBypassed: true
      };
    }

    return {
      success: false,
      reason: 'FREQUENCY_MISMATCH_ALARM',
      hackedIrisCount: this.hackedIrisCount
    };
  }

  /**
   * Disengages heavy magnetic clamp fields securing the crate lid.
   * @param {number} [powerDrainJoules=1800]
   * @returns {Object} Magnetic clamp condition
   */
  disengageMagneticClamps(powerDrainJoules = 1800) {
    if (!this.magneticClampActive) {
      return { magneticClampActive: false, remainingJoules: 0 };
    }

    this.magneticPowerJoules = Math.max(0, this.magneticPowerJoules - powerDrainJoules);
    if (this.magneticPowerJoules <= 0) {
      this.magneticClampActive = false;
      return {
        success: true,
        magneticClampActive: false,
        clampsDisengaged: true,
        pneumaticExhaustReleased: true
      };
    }

    return {
      success: false,
      magneticClampActive: true,
      remainingJoules: this.magneticPowerJoules
    };
  }

  /**
   * Harvests the Upgrade Predator bio-cortex suit technology from the unsealed crate.
   * @returns {Object} Salvage telemetry
   */
  harvestUpgradeCortexSuit() {
    if (this.tripleIrisLocked || this.magneticClampActive) {
      return { success: false, reason: 'CRATE_STILL_SEALED' };
    }

    if (this.cortexSuitLooted) {
      return { success: false, reason: 'ALREADY_LOOTED' };
    }

    this.cortexSuitLooted = true;
    return {
      success: true,
      cortexSuitLooted: true,
      salvagedItem: {
        id: 'UPGRADE_BIO_CORTEX_SUIT',
        armorRatingBonus: 85,
        thermalCamouflageShielding: 0.98,
        plasmaCannonOverchargeCapacityJoules: 12000
      },
      trophyHonorBonus: 600
    };
  }

  /**
   * Returns current diagnostics of the transport crate.
   * @returns {Object}
   */
  getCargoCrateDiagnostics() {
    return {
      crateId: this.crateId,
      tripleIrisLocked: this.tripleIrisLocked,
      hackedIrisCount: this.hackedIrisCount,
      magneticClampActive: this.magneticClampActive,
      magneticPowerJoules: this.magneticPowerJoules,
      cortexSuitLooted: this.cortexSuitLooted,
      readyToOpen: !this.tripleIrisLocked && !this.magneticClampActive
    };
  }
}
