/**
 * MeatLockerBeefCarcassConcealmentSector.js
 * 
 * Predator 2 (1990) - Los Angeles meatpacking plant & cold storage locker.
 * Simulates suspended frozen beef carcasses on overhead conveyor rails (-15 C),
 * kinetic swaying physics, acoustic misdirection, and cold thermal masking against OWLF thermal imaging.
 */

export class MeatLockerBeefCarcassConcealmentSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='la-meat-locker-01']
   * @param {number} [options.carcassCount=28]
   * @param {number} [options.refrigerationTempCelsius=-15.0]
   * @param {boolean} [options.conveyorRailActive=true]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'la-meat-locker-01';
    this.carcassCount = options.carcassCount !== undefined ? options.carcassCount : 28;
    this.refrigerationTempCelsius = options.refrigerationTempCelsius !== undefined ? options.refrigerationTempCelsius : -15.0;
    this.conveyorRailActive = options.conveyorRailActive !== undefined ? options.conveyorRailActive : true;

    this.carcassPositions = Array.from({ length: this.carcassCount }, (_, i) => ({
      index: i,
      x: (i % 7) * 2.5,
      z: Math.floor(i / 7) * 3.0,
      swayAngleDeg: 0,
      isSwaying: false
    }));

    this.conveyorSpeedMps = 0.8;
  }

  /**
   * Deliberately bumps or brushes a frozen carcass to create a sound decoy.
   * @param {number} carcassIndex
   * @param {number} [impulseForceN=250]
   * @returns {Object} Acoustic misdirection telemetry
   */
  bumpFrozenCarcass(carcassIndex = 0, impulseForceN = 250) {
    if (carcassIndex < 0 || carcassIndex >= this.carcassCount) {
      return { success: false, reason: 'INVALID_CARCASS_INDEX' };
    }

    const carcass = this.carcassPositions[carcassIndex];
    carcass.isSwaying = true;
    carcass.swayAngleDeg = +(Math.min(35, impulseForceN * 0.12)).toFixed(1);

    const soundDb = Math.round(55 + impulseForceN * 0.08); // Hook rattle and frozen thud
    const aiDistractionRadiusMeters = +(soundDb * 0.28).toFixed(1);

    return {
      success: true,
      carcassIndex,
      swayAngleDeg: carcass.swayAngleDeg,
      soundDb,
      aiDistractionRadiusMeters,
      decoyEffective: true
    };
  }

  /**
   * Hides directly behind a suspended carcass to mask heat signature from OWLF sensors.
   * @param {number} carcassIndex
   * @param {number} [hunterThermalKelvin=310.15] - 37 C body heat
   * @returns {Object} Concealment analysis
   */
  takeConcealmentBehindCarcass(carcassIndex = 0, hunterThermalKelvin = 310.15) {
    if (carcassIndex < 0 || carcassIndex >= this.carcassCount) {
      return { concealed: false, reason: 'INVALID_CARCASS_INDEX' };
    }

    const carcassColdKelvin = this.refrigerationTempCelsius + 273.15; // ~258 K
    const thermalAbsorptionRatio = 0.88; // 88% of body heat blocked by 300kg frozen beef carcass
    const apparentThermalSignatureKelvin = Math.round(hunterThermalKelvin * (1 - thermalAbsorptionRatio) + carcassColdKelvin * thermalAbsorptionRatio);

    const owlFScannerThermalBypass = apparentThermalSignatureKelvin < 275.0;

    return {
      concealed: true,
      carcassIndex,
      carcassColdKelvin,
      apparentThermalSignatureKelvin,
      owlFScannerThermalBypass,
      physicalCoverRating: 0.95
    };
  }

  /**
   * Toggles or adjusts overhead motorized conveyor rail speed.
   * @param {boolean} active
   * @param {number} [speedMps=0.8]
   * @returns {Object} Conveyor status
   */
  toggleConveyorRail(active = true, speedMps = 0.8) {
    this.conveyorRailActive = active;
    this.conveyorSpeedMps = active ? speedMps : 0.0;

    return {
      conveyorRailActive: this.conveyorRailActive,
      conveyorSpeedMps: this.conveyorSpeedMps,
      dynamicCoverMotionActive: this.conveyorRailActive
    };
  }

  /**
   * Returns complete telemetry of the cold storage meat locker.
   * @returns {Object}
   */
  getMeatLockerTelemetry() {
    return {
      sectorId: this.sectorId,
      carcassCount: this.carcassCount,
      refrigerationTempCelsius: this.refrigerationTempCelsius,
      conveyorRailActive: this.conveyorRailActive,
      conveyorSpeedMps: this.conveyorSpeedMps,
      swayingCount: this.carcassPositions.filter(c => c.isSwaying).length
    };
  }
}
