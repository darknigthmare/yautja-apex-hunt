/**
 * LosAngelesStormRooftopLightningCombistickSector.js
 * 
 * Predator 2 (1990) - Los Angeles penthouse rooftop during a violent tropical lightning storm.
 * Simulates high-voltage atmospheric lightning strikes (>1 GV, 30 kA), Combistick lightning rod channeling,
 * weapon overcharge capacitors, heavy rain camouflage water-droplet distortion, and victory roar surges.
 */

export class LosAngelesStormRooftopLightningCombistickSector {
  /**
   * @param {Object} options
   * @param {string} [options.rooftopId='la-storm-rooftop-01']
   * @param {number} [options.stormIntensity=0.85]
   * @param {number} [options.lightningRodGargoyles=4]
   * @param {boolean} [options.combistickCharged=false]
   * @param {number} [options.plasmaOverchargeJoules=0]
   */
  constructor(options = {}) {
    this.rooftopId = options.rooftopId || 'la-storm-rooftop-01';
    this.stormIntensity = options.stormIntensity !== undefined ? options.stormIntensity : 0.85;
    this.lightningRodGargoyles = options.lightningRodGargoyles !== undefined ? options.lightningRodGargoyles : 4;
    this.combistickCharged = options.combistickCharged !== undefined ? options.combistickCharged : false;
    this.plasmaOverchargeJoules = options.plasmaOverchargeJoules !== undefined ? options.plasmaOverchargeJoules : 0;

    this.strikesRecorded = 0;
    this.empFlickerActive = false;
  }

  /**
   * Triggers an atmospheric lightning strike down on a rooftop gargoyle perch.
   * @param {number} gargoyleIndex
   * @returns {Object} Lightning discharge telemetry
   */
  triggerAtmosphericLightningStrike(gargoyleIndex = 0) {
    if (gargoyleIndex < 0 || gargoyleIndex >= this.lightningRodGargoyles) {
      return { success: false, reason: 'INVALID_GARGOYLE_INDEX' };
    }

    this.strikesRecorded++;
    const peakCurrentKiloAmps = Math.round(25 + this.stormIntensity * 20); // 25 - 45 kA
    const voltageMegavolts = Math.round(120 + this.stormIntensity * 180); // 120 - 300 MV
    const shockwaveDb = Math.round(115 + this.stormIntensity * 15); // ~130 dB thunder crack

    this.empFlickerActive = true;

    return {
      success: true,
      gargoyleIndex,
      strikesRecorded: this.strikesRecorded,
      peakCurrentKiloAmps,
      voltageMegavolts,
      shockwaveDb,
      flashLuminosityLumens: 1.2e8,
      empDisruptionSeconds: 1.8
    };
  }

  /**
   * Channels sky lightning into the Combistick during a victory battle roar.
   * @param {boolean} roarActive - Is the hunter executing a battle roar
   * @param {number} durationSec - Exposure duration
   * @returns {Object} Combistick energization outcome
   */
  raiseCombistickToSky(roarActive = true, durationSec = 2.0) {
    if (!roarActive || durationSec < 1.0) {
      return {
        charged: false,
        reason: 'INSUFFICIENT_ROAR_OR_EXPOSURE',
        plasmaOverchargeJoules: this.plasmaOverchargeJoules
      };
    }

    this.combistickCharged = true;
    const addedEnergyJoules = Math.round(durationSec * 2400 * this.stormIntensity);
    this.plasmaOverchargeJoules = Math.min(8000, this.plasmaOverchargeJoules + addedEnergyJoules);

    return {
      charged: true,
      combistickCharged: true,
      plasmaOverchargeJoules: this.plasmaOverchargeJoules,
      electrifiedAttacksUnlocked: true,
      shockDamageBonusPerHit: Math.round(this.plasmaOverchargeJoules * 0.02), // +160 dmg bonus at max charge
      ionizationAuraRadiusM: 3.5
    };
  }

  /**
   * Evaluates camouflage shimmer and optical distortion caused by heavy rainfall.
   * @param {number} rainDensityMmHr - Rainfall rate (e.g. 60 mm/hr for tropical cloudburst)
   * @returns {Object} Camouflage degradation metrics
   */
  evaluateRainCamouflageFlicker(rainDensityMmHr = 60) {
    const dropletImpactionRate = rainDensityMmHr * 18.5; // droplets/sec hitting mesh
    const cloakRefractionInterference = +(Math.min(0.85, (rainDensityMmHr / 100) * 0.9)).toFixed(2);
    const waterDropletOutlineVisible = rainDensityMmHr > 35;

    return {
      rainDensityMmHr,
      dropletImpactionRate,
      cloakRefractionInterference,
      waterDropletOutlineVisible,
      stealthPenaltyRatio: cloakRefractionInterference
    };
  }

  /**
   * Returns complete telemetry of the storm rooftop.
   * @returns {Object}
   */
  getSectorTelemetry() {
    return {
      rooftopId: this.rooftopId,
      stormIntensity: this.stormIntensity,
      lightningRodGargoyles: this.lightningRodGargoyles,
      combistickCharged: this.combistickCharged,
      plasmaOverchargeJoules: this.plasmaOverchargeJoules,
      strikesRecorded: this.strikesRecorded,
      empFlickerActive: this.empFlickerActive
    };
  }
}
