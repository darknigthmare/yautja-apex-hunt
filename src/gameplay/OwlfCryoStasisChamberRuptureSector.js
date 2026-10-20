/**
 * OwlfCryoStasisChamberRuptureSector.js
 * 
 * Predator 2 (1990) - OWLF (Other World Life Forms) meatpacking facility cryogenic stasis chamber.
 * Simulates liquid nitrogen tank ruptures (-196 C / 77 K), thermal vision inversion,
 * cryogenic material embrittlement, and room ventilation dissipation dynamics.
 */

export class OwlfCryoStasisChamberRuptureSector {
  /**
   * @param {Object} options
   * @param {string} [options.chamberId='owlf-cryo-stasis-01']
   * @param {number} [options.liquidNitrogenTanks=4]
   * @param {number} [options.ambientTempCelsius=22.0]
   * @param {number} [options.cryoGasDensity=0.0]
   * @param {number} [options.freezeRadiusM=12.0]
   * @param {boolean} [options.stasisFieldActive=false]
   */
  constructor(options = {}) {
    this.chamberId = options.chamberId || 'owlf-cryo-stasis-01';
    this.totalTanks = options.liquidNitrogenTanks !== undefined ? options.liquidNitrogenTanks : 4;
    this.ambientTempCelsius = options.ambientTempCelsius !== undefined ? options.ambientTempCelsius : 22.0;
    this.cryoGasDensity = options.cryoGasDensity !== undefined ? options.cryoGasDensity : 0.0;
    this.freezeRadiusM = options.freezeRadiusM !== undefined ? options.freezeRadiusM : 12.0;
    this.stasisFieldActive = options.stasisFieldActive !== undefined ? options.stasisFieldActive : false;

    this.rupturedTanksCount = 0;
    this.tankPressures = new Array(this.totalTanks).fill(18.5); // 18.5 bar per storage vessel
    this.ventilationActive = false;
  }

  /**
   * Ruptures a cryogenic stasis tank by index, dropping chamber temperature.
   * @param {number} tankIndex
   * @param {number} damageAmount
   * @returns {Object} Rupture telemetry
   */
  ruptureCryoTank(tankIndex = 0, damageAmount = 100) {
    if (tankIndex < 0 || tankIndex >= this.totalTanks) {
      return { success: false, reason: 'INVALID_TANK_INDEX' };
    }

    if (this.tankPressures[tankIndex] <= 0) {
      return { success: false, reason: 'TANK_ALREADY_DEPRESSURIZED' };
    }

    const pressureReleased = Math.min(this.tankPressures[tankIndex], damageAmount * 0.25);
    this.tankPressures[tankIndex] = +(this.tankPressures[tankIndex] - pressureReleased).toFixed(2);

    if (this.tankPressures[tankIndex] <= 0.5) {
      this.tankPressures[tankIndex] = 0;
      this.rupturedTanksCount++;
    }

    // Temperature drops towards -196 C based on ruptured tanks
    const tempTarget = -196.0;
    const tempDropFraction = (this.rupturedTanksCount / this.totalTanks) * 0.85;
    this.ambientTempCelsius = +(22.0 - (22.0 - tempTarget) * tempDropFraction).toFixed(1);
    this.cryoGasDensity = +(Math.min(1.0, this.cryoGasDensity + (pressureReleased / 18.5) * 0.35)).toFixed(2);

    return {
      success: true,
      tankIndex,
      remainingPressureBar: this.tankPressures[tankIndex],
      ambientTempCelsius: this.ambientTempCelsius,
      cryoGasDensity: this.cryoGasDensity,
      rupturedTanksCount: this.rupturedTanksCount,
      flashFreezeActive: this.ambientTempCelsius < -120.0
    };
  }

  /**
   * Computes thermal sensor inversion and UV cyan shift when blinded by sub-zero nitrogen.
   * @param {number} [currentTempC]
   * @returns {Object} Thermal vision disruption telemetry
   */
  computeCryoThermalInversion(currentTempC = this.ambientTempCelsius) {
    const isFreezing = currentTempC < 0;
    const isExtremeCryo = currentTempC < -80;

    // Thermal sensor noise ratio increases dramatically below -40 C
    const thermalNoiseLevel = +(Math.max(0, Math.min(1.0, (-currentTempC - 20) / 160))).toFixed(2);
    const visionModeShiftedToUv = isExtremeCryo;
    const targetSilhouetteVisibility = isExtremeCryo ? 0.35 : (isFreezing ? 0.75 : 1.0);

    return {
      currentTempC,
      thermalNoiseLevel,
      visionModeShiftedToUv,
      targetSilhouetteVisibility,
      frostOverlayIntensity: +(Math.min(1.0, Math.max(0, -currentTempC / 196))).toFixed(2)
    };
  }

  /**
   * Evaluates material embrittlement and risk of shattering upon kinetic impact.
   * @param {string} materialType - 'YAUTJA_BLADE', 'CARBON_NANO_ARMOR', 'BIO_TISSUE', 'STAINLESS_STEEL'
   * @param {number} [currentTempC]
   * @returns {Object} Brittleness analysis
   */
  evaluateMaterialBrittleness(materialType, currentTempC = this.ambientTempCelsius) {
    const tempKelvin = currentTempC + 273.15;
    let baseDuctility = 1.0;
    let criticalEmbrittlementKelvin = 150; // Below this, brittle cleavage occurs

    switch (materialType) {
      case 'YAUTJA_BLADE':
        baseDuctility = 0.85;
        criticalEmbrittlementKelvin = 95; // Extreme cryogenic resistance
        break;
      case 'CARBON_NANO_ARMOR':
        baseDuctility = 0.95;
        criticalEmbrittlementKelvin = 85;
        break;
      case 'BIO_TISSUE':
        baseDuctility = 1.0;
        criticalEmbrittlementKelvin = 265; // Water inside tissue freezes at ~273K
        break;
      case 'STAINLESS_STEEL':
      default:
        baseDuctility = 0.7;
        criticalEmbrittlementKelvin = 170;
        break;
    }

    const isEmbrittled = tempKelvin < criticalEmbrittlementKelvin;
    const impactShatterRisk = isEmbrittled
      ? +(Math.min(0.9, (criticalEmbrittlementKelvin - tempKelvin) / criticalEmbrittlementKelvin + 0.25)).toFixed(2)
      : 0.05;

    return {
      materialType,
      tempKelvin: +tempKelvin.toFixed(1),
      isEmbrittled,
      impactShatterRisk,
      ductilityFactor: isEmbrittled ? 0.15 : baseDuctility
    };
  }

  /**
   * Vents cryogenic gas plume using overhead meatpacking exhaust fans.
   * @param {boolean} ventilationFansActive
   * @param {number} deltaSec
   * @returns {Object} Dissipation telemetry
   */
  ventCryoPlume(ventilationFansActive = false, deltaSec = 1.0) {
    this.ventilationActive = ventilationFansActive;
    const dissipationRate = ventilationFansActive ? 0.08 : 0.015;

    this.cryoGasDensity = Math.max(0, +(this.cryoGasDensity - dissipationRate * deltaSec).toFixed(3));
    
    // Ambient temperature slowly equalizes toward 22 C
    const warmupRate = ventilationFansActive ? 12.0 : 2.5;
    this.ambientTempCelsius = Math.min(22.0, +(this.ambientTempCelsius + warmupRate * deltaSec).toFixed(1));

    return {
      ventilationActive: this.ventilationActive,
      cryoGasDensity: this.cryoGasDensity,
      ambientTempCelsius: this.ambientTempCelsius,
      cleared: this.cryoGasDensity < 0.05 && this.ambientTempCelsius > 5.0
    };
  }

  /**
   * Returns current chamber diagnostics.
   * @returns {Object}
   */
  getChamberStatus() {
    return {
      chamberId: this.chamberId,
      totalTanks: this.totalTanks,
      rupturedTanksCount: this.rupturedTanksCount,
      ambientTempCelsius: this.ambientTempCelsius,
      cryoGasDensity: this.cryoGasDensity,
      freezeRadiusM: this.freezeRadiusM,
      stasisFieldActive: this.stasisFieldActive,
      ventilationActive: this.ventilationActive
    };
  }
}
