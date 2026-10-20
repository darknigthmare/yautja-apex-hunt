/**
 * BouvetoyaOilDrillingRigInfernoSector.js
 * 
 * Alien vs. Predator (2004) - Bouvet Island whaling station & offshore oil drilling machinery deck.
 * Simulates high-pressure hydrocarbon fuel tanks (up to 85 bar), flammable crude oil slicks,
 * thermal inferno spread, BLEVE blowout explosions, and slippery steel grating catwalk hazards.
 */

export class BouvetoyaOilDrillingRigInfernoSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='bouvetoya-oil-rig-01']
   * @param {number} [options.crudeOilSlickAreas=3]
   * @param {number} [options.ambientTempCelsius=-28.0]
   * @param {number} [options.tankPressureBar=68.0]
   * @param {number} [options.structuralIntegrity=1.0]
   * @param {number} [options.fireSpreadingRate=1.2]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'bouvetoya-oil-rig-01';
    this.crudeOilSlickAreas = options.crudeOilSlickAreas !== undefined ? options.crudeOilSlickAreas : 3;
    this.ambientTempCelsius = options.ambientTempCelsius !== undefined ? options.ambientTempCelsius : -28.0;
    this.tankPressureBar = options.tankPressureBar !== undefined ? options.tankPressureBar : 68.0;
    this.structuralIntegrity = options.structuralIntegrity !== undefined ? options.structuralIntegrity : 1.0;
    this.fireSpreadingRate = options.fireSpreadingRate !== undefined ? options.fireSpreadingRate : 1.2;

    this.slicksIgnited = new Array(this.crudeOilSlickAreas).fill(false);
    this.blowoutOccurred = false;
    this.catwalkCollapsed = false;
  }

  /**
   * Ignites a specific crude oil slick on the deck.
   * @param {number} slickIndex
   * @returns {Object} Ignition telemetry
   */
  igniteOilSlick(slickIndex = 0) {
    if (slickIndex < 0 || slickIndex >= this.crudeOilSlickAreas) {
      return { success: false, reason: 'INVALID_SLICK_INDEX' };
    }

    this.slicksIgnited[slickIndex] = true;
    const ignitedCount = this.slicksIgnited.filter(Boolean).length;
    // Each ignited slick raises local temperature and radiates heavy soot
    this.ambientTempCelsius = +(-28.0 + (ignitedCount * 85.0)).toFixed(1);
    this.tankPressureBar = +(this.tankPressureBar + (ignitedCount * 4.2)).toFixed(1);

    const thermalBloomKelvin = Math.round(this.ambientTempCelsius + 273.15 + 600); // ~900K flame
    const smokeOcclusionLevel = +(Math.min(1.0, ignitedCount * 0.32)).toFixed(2);

    return {
      success: true,
      slickIndex,
      ignitedCount,
      ambientTempCelsius: this.ambientTempCelsius,
      tankPressureBar: this.tankPressureBar,
      thermalBloomKelvin,
      smokeOcclusionLevel
    };
  }

  /**
   * Safely bleeds pressure from hydrocarbon storage tanks via manual release valve.
   * @param {number} valveTurnRatio - 0.0 to 1.0
   * @returns {Object} Bleed result
   */
  bleedTankPressure(valveTurnRatio = 0.5) {
    if (this.blowoutOccurred) {
      return { success: false, reason: 'TANK_ALREADY_EXPLODED' };
    }

    const pressureRelieved = Math.min(this.tankPressureBar - 15.0, valveTurnRatio * 24.0);
    this.tankPressureBar = Math.max(15.0, +(this.tankPressureBar - pressureRelieved).toFixed(1));

    return {
      success: true,
      relievedBar: +pressureRelieved.toFixed(1),
      currentPressureBar: this.tankPressureBar,
      blowoutRisk: this.tankPressureBar > 80.0
    };
  }

  /**
   * Evaluates or triggers a catastrophic BLEVE (Boiling Liquid Expanding Vapor Explosion).
   * @param {number} externalDamage
   * @returns {Object} Explosion blast wave telemetry
   */
  evaluateBlowoutExplosion(externalDamage = 50) {
    if (this.blowoutOccurred) {
      return { occurred: false, reason: 'ALREADY_TRIGGERED' };
    }

    const criticalThreshold = 85.0;
    const totalPressure = this.tankPressureBar + (externalDamage * 0.3);

    if (totalPressure >= criticalThreshold || externalDamage >= 120) {
      this.blowoutOccurred = true;
      this.structuralIntegrity = 0.25;
      this.catwalkCollapsed = true;
      const blastRadiusMeters = 24.0;
      const peakOverpressureKpa = Math.round(180 + (totalPressure - criticalThreshold) * 12);
      const thermalFlashKelvin = 1650;

      return {
        occurred: true,
        blastRadiusMeters,
        peakOverpressureKpa,
        thermalFlashKelvin,
        catwalkCollapsed: true,
        lethalBlastDistanceM: 8.5
      };
    }

    return {
      occurred: false,
      currentPressure: +totalPressure.toFixed(1),
      threshold: criticalThreshold
    };
  }

  /**
   * Calculates slipping friction hazard on crude oil slicks on metal grating.
   * @param {number} entitySpeedMps
   * @returns {Object} Friction coefficient and slip risk
   */
  calculateSlickSlipHazard(entitySpeedMps = 4.0) {
    const baseFrictionCoeff = 0.18; // Very slick oil on frosted steel
    const slipProbability = +(Math.min(0.85, (entitySpeedMps / 6.0) * 0.75 + 0.1)).toFixed(2);
    const momentumLoss = +(entitySpeedMps * (1 - baseFrictionCoeff)).toFixed(2);

    return {
      baseFrictionCoeff,
      slipProbability,
      momentumLoss,
      requiresBalanceCheck: entitySpeedMps > 3.0
    };
  }

  /**
   * Returns complete diagnostics of the sector.
   * @returns {Object}
   */
  getSectorDiagnostics() {
    return {
      sectorId: this.sectorId,
      ambientTempCelsius: this.ambientTempCelsius,
      tankPressureBar: this.tankPressureBar,
      slicksIgnited: [...this.slicksIgnited],
      blowoutOccurred: this.blowoutOccurred,
      structuralIntegrity: this.structuralIntegrity,
      catwalkCollapsed: this.catwalkCollapsed
    };
  }
}
