/**
 * HumanQaDiegeticCryogenicJointStiffnessAuditor.js
 * 
 * Human Playtester QA Audit #3: Cryogenic Joint Stiffness & Hydraulic Freeze Realism.
 * Implements diegetic biomechanical resistance when exposed to liquid nitrogen (-196 C) or polar blizzards.
 * Causes actuator hydraulic fluid thickening, delayed wristblade deployment, and adds an emergency
 * Plasmacaster coil flash-defrost pulse mechanic.
 */

export class HumanQaDiegeticCryogenicJointStiffnessAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.jointTempCelsius=37.0]
   * @param {number} [options.plasmaBatteryCharge=100.0]
   */
  constructor(options = {}) {
    this.jointTempCelsius = options.jointTempCelsius !== undefined ? options.jointTempCelsius : 37.0;
    this.plasmaBatteryCharge = options.plasmaBatteryCharge !== undefined ? options.plasmaBatteryCharge : 100.0;
    this.wristbladeExtensionDelayMs = 80; // Baseline fast deployment (80ms)
    this.meleeSwingSpeedMultiplier = 1.0;
    this.defrostPulseActive = false;
    this.frostOverlayIntensity = 0.0;
  }

  /**
   * Simulates continuous exposure to cryogenic cold or frost sprays.
   * @param {number} ambientTempC - Ambient temperature (-196 C to 40 C)
   * @param {number} exposureTimeSec - Duration in seconds
   * @param {boolean} inDirectCryoJet - If caught in direct liquid nitrogen plume
   * @returns {Object} Updated joint condition
   */
  updateCryogenicExposure(ambientTempC = 20.0, exposureTimeSec = 1.0, inDirectCryoJet = false) {
    if (this.defrostPulseActive) {
      // Rapid recovery during defrost pulse
      this.jointTempCelsius = Math.min(37.0, +(this.jointTempCelsius + 25.0 * exposureTimeSec).toFixed(1));
      this.frostOverlayIntensity = Math.max(0, +(this.frostOverlayIntensity - 0.5 * exposureTimeSec).toFixed(2));
    } else {
      const coolingRate = inDirectCryoJet ? 14.5 : 2.8;
      const targetDelta = (ambientTempC - this.jointTempCelsius);
      const coolingAmount = targetDelta * 0.08 * coolingRate * exposureTimeSec;

      this.jointTempCelsius = +(this.jointTempCelsius + coolingAmount).toFixed(1);
      
      // Calculate frost visual intensity
      if (this.jointTempCelsius < 0) {
        this.frostOverlayIntensity = +(Math.min(1.0, -this.jointTempCelsius / 80.0)).toFixed(2);
      } else {
        this.frostOverlayIntensity = Math.max(0, +(this.frostOverlayIntensity - 0.1 * exposureTimeSec).toFixed(2));
      }
    }

    // Compute mechanical delays based on joint temperature
    if (this.jointTempCelsius < -15.0) {
      const freezeSeverity = Math.min(1.0, (-this.jointTempCelsius - 15) / 100);
      this.wristbladeExtensionDelayMs = Math.round(80 + freezeSeverity * 370); // up to 450ms
      this.meleeSwingSpeedMultiplier = +(Math.max(0.60, 1.0 - freezeSeverity * 0.40)).toFixed(2);
    } else {
      this.wristbladeExtensionDelayMs = 80;
      this.meleeSwingSpeedMultiplier = 1.0;
    }

    return {
      jointTempCelsius: this.jointTempCelsius,
      wristbladeExtensionDelayMs: this.wristbladeExtensionDelayMs,
      meleeSwingSpeedMultiplier: this.meleeSwingSpeedMultiplier,
      frostOverlayIntensity: this.frostOverlayIntensity,
      isFrozen: this.jointTempCelsius < -20.0
    };
  }

  /**
   * Triggers an emergency thermal pulse through wrist gauntlet heating coils using plasma battery.
   * @returns {Object} Pulse result
   */
  triggerThermalDefrostPulse() {
    const requiredEnergy = 15.0; // 15% plasma energy cost
    if (this.plasmaBatteryCharge < requiredEnergy) {
      return {
        success: false,
        reason: 'INSUFFICIENT_PLASMA_ENERGY',
        plasmaBatteryCharge: this.plasmaBatteryCharge
      };
    }

    this.plasmaBatteryCharge = +(this.plasmaBatteryCharge - requiredEnergy).toFixed(1);
    this.defrostPulseActive = true;
    this.jointTempCelsius = Math.max(25.0, +(this.jointTempCelsius + 45.0).toFixed(1));
    this.wristbladeExtensionDelayMs = 80;
    this.meleeSwingSpeedMultiplier = 1.0;
    this.frostOverlayIntensity = 0.0;

    // Reset pulse after instantaneous discharge
    setTimeout(() => {
      this.defrostPulseActive = false;
    }, 1200);

    return {
      success: true,
      defrostPulseActive: true,
      jointTempCelsius: this.jointTempCelsius,
      plasmaBatteryCharge: this.plasmaBatteryCharge,
      thermalFlashKelvin: 423.15 // 150 C coil flash
    };
  }

  /**
   * Checks whether the wristblade mechanical slide is currently jammed by ice.
   * @returns {boolean}
   */
  isWristbladeFrozen() {
    return this.jointTempCelsius < -20.0 && !this.defrostPulseActive;
  }

  /**
   * Returns frost effect level for UI rendering.
   * @returns {number} 0.0 to 1.0
   */
  getDiegeticFrostEffectLevel() {
    return this.frostOverlayIntensity;
  }

  /**
   * Returns current thermal joint state snapshot.
   * @returns {Object}
   */
  getThermalJointState() {
    return {
      jointTempCelsius: this.jointTempCelsius,
      plasmaBatteryCharge: this.plasmaBatteryCharge,
      wristbladeExtensionDelayMs: this.wristbladeExtensionDelayMs,
      meleeSwingSpeedMultiplier: this.meleeSwingSpeedMultiplier,
      frostOverlayIntensity: this.frostOverlayIntensity,
      defrostPulseActive: this.defrostPulseActive,
      isWristbladeFrozen: this.isWristbladeFrozen()
    };
  }
}
