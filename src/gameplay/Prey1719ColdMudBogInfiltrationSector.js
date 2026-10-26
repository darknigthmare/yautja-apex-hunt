/**
 * Prey1719ColdMudBogInfiltrationSector.js
 *
 * Chantier de Level Design 4 (v190) - Prey (2022) Glacial Mud Bog & Complete Thermal Invisibility
 * 1:1 Canonical Level Design:
 * - Bubbling glacial peat mud pit with high viscous resistance in the mountain valley.
 * - Tethered rope tomahawk throw anchoring into a rotting tree stump to pull out of the suction mire.
 * - Layering cold river mud across the entire body, dropping dermal temperature from 37.0°C to 13.5°C.
 * - Total thermal invisibility fooling the Feral Predator's bone mask infrared sensor suite at point-blank range.
 */

export class Prey1719ColdMudBogInfiltrationSector {
  /**
   * @param {Object} options
   * @param {number} [options.mudPitDepthM=1.6] Profondeur du bourbier de vase (m)
   * @param {number} [options.ambientWaterTempC=8.5] Température de l'eau boueuse (°C)
   */
  constructor(options = {}) {
    this.mudPitDepthM = options.mudPitDepthM ?? 1.6;
    this.ambientWaterTempC = options.ambientWaterTempC ?? 8.5;

    // État corporel & thermique
    this.quicksandSuctionActive = false;
    this.tetheredTomahawkAnchored = false;
    this.mudExtractionSuccess = false;
    this.bodyTemperatureC = 37.0;
    this.coldMudThermalMaskActive = false;
    this.thermalVisibilityPct = 100.0;
  }

  /**
   * Tomber dans le bourbier de vase mouvante et subir la succion
   */
  fallIntoQuicksandBog() {
    this.quicksandSuctionActive = true;

    return {
      status: 'TRAPPED_IN_QUICKSAND_MUD_BOG',
      pitDepthM: this.mudPitDepthM,
      suctionResistanceNewtons: 1400.0,
      sinkingVelocityCmPerSec: 4.5,
      tetherRescueRequired: true
    };
  }

  /**
   * Lancer le tomahawk cordé pour s'ancrer dans une souche et s'extraire de la vase
   * @param {number} throwAccuracyRatio Précision du lancer (0.0 à 1.0)
   */
  anchorTomahawkAndEscapeBog(throwAccuracyRatio = 0.95) {
    if (!this.quicksandSuctionActive) {
      return { status: 'FAILED_NOT_IN_BOG', success: false };
    }

    const anchored = throwAccuracyRatio >= 0.7;
    this.tetheredTomahawkAnchored = anchored;
    this.mudExtractionSuccess = anchored;
    this.quicksandSuctionActive = !anchored;

    return {
      status: anchored ? 'TETHERED_TOMAHAWK_ANCHORED_ESCAPE_ACHIEVED' : 'TOMAHAWK_SLIPPED_STILL_SINKING',
      anchored,
      escaped: this.mudExtractionSuccess,
      mudLayerCoatingPct: 100.0
    };
  }

  /**
   * Appliquer la boue froide sur tout le corps pour faire chuter la signature thermique
   */
  applyColdMudThermalMask() {
    this.bodyTemperatureC = 13.5;
    this.coldMudThermalMaskActive = true;
    this.thermalVisibilityPct = 0.0;

    return {
      status: 'COLD_MUD_THERMAL_MASK_APPLIED',
      bodyTemperatureCelsius: this.bodyTemperatureC,
      thermalVisibilityPct: this.thermalVisibilityPct,
      infraredTrackingBlind: true,
      pointBlankInvisibilitySecured: true
    };
  }
}
