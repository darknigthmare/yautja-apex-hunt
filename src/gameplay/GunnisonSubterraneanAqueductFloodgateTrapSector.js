/**
 * GunnisonSubterraneanAqueductFloodgateTrapSector.js
 * 
 * Aliens vs. Predator: Requiem (2007) - Gunnison subterranean municipal stormwater aqueduct.
 * Simulates heavy 5-ton hydraulic emergency floodgate drop mechanisms, turbulent water flume surges,
 * Xenomorph pack entrapment against drainage grates, and water channel plasma electrocution tactics.
 */

export class GunnisonSubterraneanAqueductFloodgateTrapSector {
  /**
   * @param {Object} options
   * @param {string} [options.aqueductSectorId='gunnison-floodgate-trap-01']
   * @param {boolean} [options.floodgateDropped=false]
   * @param {number} [options.waterSurgeVelocityMps=6.2]
   * @param {number} [options.trappedXenosCount=0]
   * @param {boolean} [options.waterElectrified=false]
   */
  constructor(options = {}) {
    this.aqueductSectorId = options.aqueductSectorId || 'gunnison-floodgate-trap-01';
    this.floodgateDropped = options.floodgateDropped !== undefined ? options.floodgateDropped : false;
    this.waterSurgeVelocityMps = options.waterSurgeVelocityMps !== undefined ? options.waterSurgeVelocityMps : 6.2;
    this.trappedXenosCount = options.trappedXenosCount !== undefined ? options.trappedXenosCount : 0;
    this.waterElectrified = options.waterElectrified !== undefined ? options.waterElectrified : false;

    this.waterDepthM = 1.2;
    this.electrocutionDamageDealt = 0;
  }

  /**
   * Drops the 5-ton hydraulic steel floodgate to seal off the aqueduct chamber.
   * @param {number} [chasingXenos=5]
   * @returns {Object} Floodgate drop telemetry
   */
  triggerEmergencyFloodgateDrop(chasingXenos = 5) {
    this.floodgateDropped = true;
    this.trappedXenosCount = chasingXenos;
    const gateMassKg = 5000;
    const impactKineticJoules = 42000;

    return {
      success: true,
      floodgateDropped: true,
      gateMassKg,
      impactKineticJoules,
      trappedXenosCount: this.trappedXenosCount,
      chamberSealed: true
    };
  }

  /**
   * Opens high-pressure storm bypass valves, sending a torrent down the sealed channel.
   * @returns {Object} Water surge dynamics
   */
  releaseWaterSurge() {
    if (!this.floodgateDropped) {
      return { success: false, reason: 'FLOODGATE_NOT_SEALED' };
    }

    this.waterDepthM = 2.4;
    const hydrodynamicForceN = Math.round(0.5 * 1000 * Math.pow(this.waterSurgeVelocityMps, 2) * 2.5); // ~48 kN
    const sweptAgainstGrate = true;

    return {
      success: true,
      waterSurgeVelocityMps: this.waterSurgeVelocityMps,
      waterDepthM: this.waterDepthM,
      hydrodynamicForceN,
      sweptAgainstGrate,
      trappedEnemiesImmobilized: true
    };
  }

  /**
   * Discharges high-voltage plasma capacitor energy into the flooded channel.
   * Water conducts electricity throughout the entire sealed flume.
   * @param {number} [plasmaDischargeJoules=1200]
   * @returns {Object} Electrocution outcome
   */
  electrifyFloodChannel(plasmaDischargeJoules = 1200) {
    if (this.waterDepthM < 0.5) {
      return { success: false, reason: 'WATER_LEVEL_TOO_LOW_FOR_CONDUCTION' };
    }

    this.waterElectrified = true;
    const electrocutionDamage = Math.round(plasmaDischargeJoules * 0.45); // ~540 damage
    this.electrocutionDamageDealt = electrocutionDamage;
    const xenosKilled = this.trappedXenosCount;
    this.trappedXenosCount = 0;

    return {
      success: true,
      waterElectrified: true,
      plasmaDischargeJoules,
      electrocutionDamage,
      xenosKilled,
      channelSterilized: true
    };
  }

  /**
   * Returns current aqueduct trap diagnostics.
   * @returns {Object}
   */
  getAqueductTrapTelemetry() {
    return {
      aqueductSectorId: this.aqueductSectorId,
      floodgateDropped: this.floodgateDropped,
      waterSurgeVelocityMps: this.waterSurgeVelocityMps,
      waterDepthM: this.waterDepthM,
      trappedXenosCount: this.trappedXenosCount,
      waterElectrified: this.waterElectrified,
      electrocutionDamageDealt: this.electrocutionDamageDealt
    };
  }
}
