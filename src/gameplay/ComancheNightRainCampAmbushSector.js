/**
 * ComancheNightRainCampAmbushSector.js
 * 
 * Prey (2022) - Comanche Encampment Thunderstorm & Fire Arrow Night Ambush.
 * Simulates nighttime warfare in the Great Plains: buffalo-hide teepees set ablaze by flaming arrows,
 * torrential thunderstorm rain (12 mm/hr) washing off mud thermal camouflage,
 * and high-intensity close-quarters melee illuminated by lightning flashes.
 */

export class ComancheNightRainCampAmbushSector {
  /**
   * @param {Object} options
   * @param {string} [options.campSectorId='comanche-night-rain-camp-01']
   * @param {number} [options.rainIntensityMmHr=12.0]
   * @param {number} [options.teepeeCount=8]
   * @param {boolean} [options.thunderstormActive=true]
   */
  constructor(options = {}) {
    this.campSectorId = options.campSectorId || 'comanche-night-rain-camp-01';
    this.rainIntensityMmHr = options.rainIntensityMmHr || 12.0;
    this.teepeeCount = options.teepeeCount || 8;
    this.thunderstormActive = options.thunderstormActive !== undefined ? options.thunderstormActive : true;

    this.burningTeepeesCount = 0;
    this.mudCamouflageWashOffRatePerSec = +(this.rainIntensityMmHr * 0.0035).toFixed(4); // Rain strips mud fast
  }

  /**
   * Fires a flaming arrow into a buffalo-hide teepee, igniting it.
   * @param {number} arrowFlameTempC
   * @returns {Object} Fire spread outcome
   */
  igniteTeepeeFire(arrowFlameTempC = 650) {
    if (this.burningTeepeesCount >= this.teepeeCount) {
      return { ignited: false, reason: 'ALL_TEEPEES_ALREADY_BURNING' };
    }

    this.burningTeepeesCount++;
    const thermalIlluminationRadiusM = +(8.0 + this.burningTeepeesCount * 2.5).toFixed(1);
    const smokeBlindnessRadiusM = 14.0;

    return {
      ignited: true,
      burningTeepeesCount: this.burningTeepeesCount,
      teepeesRemaining: this.teepeeCount - this.burningTeepeesCount,
      thermalIlluminationRadiusM,
      smokeBlindnessRadiusM,
      hideBurningCrackleDecibels: 76
    };
  }

  /**
   * Evaluates the wash-off rate of cold mud thermal camouflage under torrential rain.
   * @param {number} currentMudIntegrity - 0.0 to 1.0
   * @param {number} deltaSec
   * @returns {Object} Mud erosion telemetry
   */
  washMudCamouflageUnderRain(currentMudIntegrity = 1.0, deltaSec = 1.0) {
    const mudLoss = this.mudCamouflageWashOffRatePerSec * deltaSec;
    const remainingMudIntegrity = +(Math.max(0.0, currentMudIntegrity - mudLoss)).toFixed(3);
    const thermalCamouflageLost = remainingMudIntegrity <= 0.25;

    return {
      rainIntensityMmHr: this.rainIntensityMmHr,
      washOffRatePerSec: this.mudCamouflageWashOffRatePerSec,
      remainingMudIntegrity,
      thermalCamouflageLost,
      rainThrumDecibels: Math.round(62 + this.rainIntensityMmHr * 0.8)
    };
  }

  /**
   * Executes a lightning-illuminated tomahawk parry clash in the wet mud.
   * @param {number} attackAngleDeg
   * @returns {Object} Clash telemetry
   */
  resolveWetMeleeClash(attackAngleDeg = 45) {
    const sparkExtinguishedByRain = true; // Water droplets quench sparks quickly
    const footingSlipProbability = 0.25; // Wet slippery mud

    return {
      clashSuccessful: true,
      attackAngleDeg,
      sparkExtinguishedByRain,
      footingSlipProbability,
      bladeClangDecibels: 88,
      mudSplashMeters: 1.8
    };
  }
}
