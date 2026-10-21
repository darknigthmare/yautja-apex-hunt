/**
 * LosAngelesSubwayThirdRailElectrocutionSector.js
 * 
 * Predator 2 (1990) - Los Angeles Subway Derailment & 750V Electrified Third Rail.
 * Simulates the dark subway tunnel derailment: 750V DC high-voltage third rail contact hazard,
 * water pool electrical conduction, hydraulic car door release, and sparks illuminating
 * the smoke-filled transit carriage during panic.
 */

export class LosAngelesSubwayThirdRailElectrocutionSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='la-subway-track-tunnel-02']
   * @param {number} [options.thirdRailVoltageV=750.0]
   * @param {number} [options.circuitCurrentAmps=1200.0]
   * @param {boolean} [options.standingWaterPresent=true]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'la-subway-track-tunnel-02';
    this.thirdRailVoltageV = options.thirdRailVoltageV || 750.0;
    this.circuitCurrentAmps = options.circuitCurrentAmps || 1200.0;
    this.standingWaterPresent = options.standingWaterPresent !== undefined ? options.standingWaterPresent : true;

    this.thirdRailEnergized = true;
    this.trainDoorsHydraulicallyReleased = false;
    this.activeArcDischarges = 0;
  }

  /**
   * Evaluates electrical arc hazard when a metallic weapon or entity contacts the third rail.
   * Arc power: P = V * I = 750V * 1200A = 900,000 W (900 kW)
   * @param {string} contactingObject - e.g. "COMBI_STICK" or "FLESH"
   * @param {number} contactDurationSec
   * @returns {Object} Electrocution outcome
   */
  resolveThirdRailContact(contactingObject = 'COMBI_STICK', contactDurationSec = 0.5) {
    if (!this.thirdRailEnergized) {
      return { electrocuted: false, damageDealt: 0, arcPowerKw: 0 };
    }

    this.activeArcDischarges++;
    const isMetalConductor = contactingObject === 'COMBI_STICK' || contactingObject === 'SMART_DISC';
    const arcPowerKw = Math.round((this.thirdRailVoltageV * this.circuitCurrentAmps) / 1000.0); // 900 kW
    const shockDamage = isMetalConductor ? 380 : 540;
    const arcTemperatureC = 4200; // Electric plasma arc temperature
    const vaporizedMetalGrams = isMetalConductor ? 12 : 0;

    return {
      electrocuted: true,
      contactingObject,
      thirdRailVoltageV: this.thirdRailVoltageV,
      arcPowerKw,
      shockDamage,
      arcTemperatureC,
      vaporizedMetalGrams,
      sparkBrightnessLumens: 45000,
      staggerDurationSec: 2.5
    };
  }

  /**
   * Evaluates conductive shock propagation through standing pools of water on the tracks.
   * @param {number} distanceToThirdRailM
   * @returns {Object} Water conduction hazard
   */
  evaluateStandingWaterConduction(distanceToThirdRailM = 2.5) {
    if (!this.standingWaterPresent || !this.thirdRailEnergized) {
      return { conductiveShockHazard: false, effectiveVoltageV: 0, shockDamage: 0 };
    }

    // Voltage attenuates with distance through water resistance
    const effectiveVoltageV = +(this.thirdRailVoltageV * Math.max(0.0, 1.0 - distanceToThirdRailM / 6.0)).toFixed(1);
    const conductiveShockHazard = effectiveVoltageV > 50.0;
    const shockDamage = conductiveShockHazard ? Math.round(effectiveVoltageV * 0.45) : 0;

    return {
      standingWaterPresent: true,
      distanceToThirdRailM,
      effectiveVoltageV,
      conductiveShockHazard,
      shockDamage,
      steamBubblesEvolving: effectiveVoltageV > 200.0
    };
  }

  /**
   * Manually pulls the subway carriage emergency hydraulic door release valve.
   * @returns {Object} Door release telemetry
   */
  triggerEmergencyDoorRelease() {
    this.trainDoorsHydraulicallyReleased = true;

    return {
      success: true,
      trainDoorsHydraulicallyReleased: true,
      hydraulicPneumaticDecompressionHissSec: 1.8,
      evacuationRouteOpened: true,
      commuterPanicLevel: 0.95
    };
  }
}
