/**
 * Predator2MeatLockerNitrogenAmbushSector.js
 * 
 * Chantier Level Design #1 - Entrepôt Frigorifique / Abattoir de Keyes (OWLF Meat Locker Nitrogen Trap).
 * Canonical 1:1 Predator 2 (1990) fidelity:
 * - 4,000 m² industrial refrigerated meat-packing plant maintained at -18 °C.
 * - Rows of hanging frozen beef carcasses creating physical corridors, thermal blinds, and kinetic deflection shields.
 * - OWLF task force led by Peter Keyes wearing thermal-insulating environmental suits and carrying nitrogen gas sprayers.
 * - Nitrogen gas (boiling point -196 °C) sprays into the room, condensing moisture on the City Hunter's active cloaking matrix,
 *   revealing a frosted white silhouette.
 * - City Hunter's bio-mask: standard infrared is completely blinded by cold nitrogen mist and chilled meat, forcing the Hunter
 *   to switch to Ultraviolet / Electromagnetic vision to track the OWLF team's battery packs and ultraviolet lanterns.
 */

export class Predator2MeatLockerNitrogenAmbushSector {
  /**
   * @param {Object} options
   * @param {number} [options.roomTempC=-18.0]
   * @param {number} [options.carcassRowsCount=16]
   */
  constructor(options = {}) {
    this.roomTempC = options.roomTempC ?? -18.0;
    this.carcassRowsCount = options.carcassRowsCount ?? 16;

    this.nitrogenGasActive = false;
    this.nitrogenConcentrationPct = 0;
    this.cityHunterFrostedVisible = false;
    this.owlfAgentsCount = 6;
  }

  /**
   * OWLF team discharges pressurized liquid nitrogen tanks to coat the room in cryogenic fog.
   * @param {number} flowRateKgs - Flow rate of liquid nitrogen (kg/s)
   * @returns {Object} Nitrogen discharge telemetry
   */
  dischargeLiquidNitrogenSpray(flowRateKgs = 12.0) {
    this.nitrogenGasActive = true;
    this.nitrogenConcentrationPct = Math.min(100.0, this.nitrogenConcentrationPct + flowRateKgs * 6.5);
    this.cityHunterFrostedVisible = this.nitrogenConcentrationPct >= 35.0;

    return {
      success: true,
      nitrogenGasActive: true,
      flowRateKgs,
      nitrogenConcentrationPct: this.nitrogenConcentrationPct,
      roomTempC: Math.max(-65.0, this.roomTempC - (this.nitrogenConcentrationPct / 2.0)),
      cityHunterFrostedVisible: this.cityHunterFrostedVisible,
      infraredVisionBlindedByColdVapor: true,
      sprayHissAcousticDb: 82,
      uvSpectrumRequiredToTrackBatteryPacks: true
    };
  }

  /**
   * Evaluates vision mode effectiveness inside the frozen nitrogen slaughterhouse.
   * @param {string} visionMode - 'STANDARD_INFRARED' | 'ULTRAVIOLET_ELECTROMAGNETIC'
   * @returns {Object} Vision acquisition telemetry
   */
  evaluateSlaughterhouseVisionMode(visionMode = 'STANDARD_INFRARED') {
    if (visionMode === 'STANDARD_INFRARED') {
      return {
        visionMode,
        targetAcquired: false,
        reason: 'THERMAL_WHITEOUT_SUB_ZERO_VAPOR',
        detectionConfidencePct: 8,
        carcassInterferenceHigh: true
      };
    } else {
      // ULTRAVIOLET_ELECTROMAGNETIC
      return {
        visionMode,
        targetAcquired: true,
        reason: 'OWLF_BATTERY_PACKS_AND_UV_LANTERNS_LOCKED',
        detectionConfidencePct: 98,
        activeTargetsCount: this.owlfAgentsCount
      };
    }
  }

  /**
   * Resolves a smart disc ricochet through the rows of hanging beef carcasses.
   * @param {number} throwSpeedMps
   * @returns {Object} Smart disc flight outcome
   */
  throwSmartDiscThroughCarcasses(throwSpeedMps = 38.0) {
    const carcassesSliced = Math.min(6, Math.round(throwSpeedMps / 6.0));
    const owlfNeutralized = Math.min(this.owlfAgentsCount, 2);
    this.owlfAgentsCount -= owlfNeutralized;

    return {
      success: true,
      throwSpeedMps,
      carcassesSliced,
      owlfNeutralized,
      remainingOwlfAgents: this.owlfAgentsCount,
      discReturnsToHand: true,
      meatImpactAcousticDb: 78,
      smartDiscSpinZingDb: 88
    };
  }
}
