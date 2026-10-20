/**
 * BorealColdBogMudThermoregulationSector.js
 * 
 * Prey (2022) - Northern Great Plains Freezing Peat Bog & Mud Camouflage.
 * Simulates Naru's herbal medicine and cold river mud wallowing technique:
 * drops core body temperature down to 5-10°C, providing total infrared invisibility
 * to the Feral Predator's bone-mask thermographic sensors, while incurring
 * hypothermic shivering and stamina regeneration debuffs.
 */

export class BorealColdBogMudThermoregulationSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='boreal-cold-bog-01']
   * @param {number} [options.waterTemperatureC=4.5]
   * @param {number} [options.mudLayerThicknessMm=6.0]
   * @param {number} [options.evaporationRatePerSec=0.008]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'boreal-cold-bog-01';
    this.waterTemperatureC = options.waterTemperatureC || 4.5;
    this.mudLayerThicknessMm = options.mudLayerThicknessMm || 6.0;
    this.evaporationRatePerSec = options.evaporationRatePerSec || 0.008;

    this.isMudCoated = false;
    this.mudIntegrity = 1.0; // 1.0 = freshly soaked, 0.0 = flaked off
    this.coreBodyTemperatureC = 37.0; // Normal human body temp
  }

  /**
   * Coats the player in freezing peat bog mud.
   * @param {boolean} consumedOrangeFlowerTincture - Drops core metabolic heat (Prey 2022 canon)
   * @returns {Object} Mud application telemetry
   */
  applyColdBogMudCoating(consumedOrangeFlowerTincture = true) {
    this.isMudCoated = true;
    this.mudIntegrity = 1.0;
    
    // Core temperature plummets with medicine flower
    this.coreBodyTemperatureC = consumedOrangeFlowerTincture ? 7.5 : 18.0;

    return {
      success: true,
      isMudCoated: true,
      mudIntegrity: this.mudIntegrity,
      coreBodyTemperatureC: this.coreBodyTemperatureC,
      thermalInvisibilityRating: consumedOrangeFlowerTincture ? 1.0 : 0.65,
      staminaRegenDebuffRatio: 0.35, // 35% slower stamina regen due to freezing cold
      hypothermicShiverActive: true
    };
  }

  /**
   * Updates mud drying rate based on ambient conditions and movement.
   * @param {number} deltaSec
   * @param {boolean} nearOpenFire - Incendiary fire triples drying speed
   * @param {boolean} isSprinting
   * @returns {Object} Mud state telemetry
   */
  updateMudEvaporation(deltaSec = 1.0, nearOpenFire = false, isSprinting = false) {
    if (!this.isMudCoated) {
      return { isMudCoated: false, mudIntegrity: 0.0, infraredSignatureVisible: true };
    }

    const heatMultiplier = nearOpenFire ? 3.5 : (isSprinting ? 1.8 : 1.0);
    const loss = this.evaporationRatePerSec * heatMultiplier * deltaSec;
    this.mudIntegrity = Math.max(0.0, this.mudIntegrity - loss);

    // As mud dries, body heat bleeds through
    this.coreBodyTemperatureC = +(7.5 + (1.0 - this.mudIntegrity) * 29.5).toFixed(1);
    const infraredSignatureVisible = this.mudIntegrity < 0.25;

    if (this.mudIntegrity <= 0.0) {
      this.isMudCoated = false;
    }

    return {
      isMudCoated: this.isMudCoated,
      mudIntegrity: +this.mudIntegrity.toFixed(3),
      coreBodyTemperatureC: this.coreBodyTemperatureC,
      infraredSignatureVisible,
      thermalContrastRatio: +(this.coreBodyTemperatureC / 37.0).toFixed(2),
      timeUntilMudFlakesSec: +(this.mudIntegrity / (this.evaporationRatePerSec * heatMultiplier)).toFixed(1)
    };
  }

  /**
   * Evaluates if Feral Predator's bone-mask infrared visor detects the player.
   * @param {number} distanceMeters
   * @returns {Object} Infrared detection result
   */
  evaluateFeralInfraredVisibility(distanceMeters = 8.0) {
    const ambientForestTempC = 16.0;
    const deltaT = Math.abs(this.coreBodyTemperatureC - ambientForestTempC);
    // Thermal contrast threshold: deltaT < 2.5C blends with background foliage
    const isThermalGhost = deltaT <= 3.0 && this.mudIntegrity >= 0.4;

    return {
      distanceMeters,
      coreBodyTemperatureC: this.coreBodyTemperatureC,
      deltaT: +deltaT.toFixed(1),
      isThermalGhost,
      detectedByBioMask: !isThermalGhost,
      targetingReticleLockPossible: !isThermalGhost
    };
  }
}
