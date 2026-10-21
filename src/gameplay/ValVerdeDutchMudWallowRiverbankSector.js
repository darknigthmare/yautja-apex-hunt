/**
 * ValVerdeDutchMudWallowRiverbankSector.js
 * 
 * Predator (1987) - Val Verde Dutch's Cold Riverbank Mud Shelf & Thermal Camouflage Wallow.
 * Simulates the key tactical turning point in the film:
 * - Thick cold alluvial silt and clay mud shelf at 14.0 °C riverbank temperature
 * - Full-body mud wallowing mechanics: coats skin, dropping emitted thermal IR radiation to 0%
 *   (rendering the human quarry completely indistinguishable from background terrain on thermal vision)
 * - Giant kapok and ficus buttress root overhangs (creating natural crawlspace caverns where Dutch hides inches from the hunter)
 * - Mud layer lifecycle: wet mud (100% masking) gradually dries over 4.0 minutes (degrades to 40% masking);
 *   wading into running water washes the mud layer off in 8.0 seconds.
 */

export class ValVerdeDutchMudWallowRiverbankSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='val-verde-mud-riverbank-01']
   * @param {number} [options.mudTempC=14.0]
   * @param {number} [options.waterTempC=12.5]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'val-verde-mud-riverbank-01';
    this.mudTempC = options.mudTempC || 14.0;
    this.waterTempC = options.waterTempC || 12.5;

    this.mudCoatingWet = false;
    this.mudCoatingThicknessMm = 0.0;
    this.mudDryingTimerSec = 0.0;
    this.thermalMaskingPct = 0.0;
    this.underRootOverhang = false;
  }

  /**
   * Wallows in the cold riverbank clay mud to apply a full-body thermal camouflage coating.
   * Drops infrared body heat signature to 0%, rendering the wearer completely invisible to thermal view.
   * @param {number} wallowDurationSec
   * @returns {Object} Mud wallow telemetry
   */
  wallowInColdRiverbankMud(wallowDurationSec = 4.0) {
    this.mudCoatingWet = true;
    this.mudCoatingThicknessMm = Math.min(10.0, wallowDurationSec * 2.2);
    this.mudDryingTimerSec = 240.0; // 4 minutes until completely dry
    this.thermalMaskingPct = 100.0;

    return {
      success: true,
      mudTempC: this.mudTempC,
      wallowDurationSec,
      mudCoatingThicknessMm: Number(this.mudCoatingThicknessMm.toFixed(1)),
      thermalMaskingPct: this.thermalMaskingPct,
      infraredInvisibilityActive: true,
      squelchAcousticsDb: 42
    };
  }

  /**
   * Updates the mud coating drying lifecycle.
   * As mud dries, body heat slowly leaks through, degrading thermal camouflage.
   * @param {number} deltaSec
   * @returns {Object} Mud drying status
   */
  updateMudDryingLifecycle(deltaSec = 1.0) {
    if (this.mudDryingTimerSec > 0) {
      this.mudDryingTimerSec = Math.max(0, this.mudDryingTimerSec - deltaSec);
      const dryingProgress = 1.0 - (this.mudDryingTimerSec / 240.0);
      this.thermalMaskingPct = Number(Math.max(40.0, 100.0 - dryingProgress * 60.0).toFixed(1));
      this.mudCoatingWet = this.mudDryingTimerSec > 60.0;
    }

    return {
      mudDryingTimerSec: Number(this.mudDryingTimerSec.toFixed(1)),
      mudCoatingWet: this.mudCoatingWet,
      thermalMaskingPct: this.thermalMaskingPct,
      requiresFreshMudReapplication: this.thermalMaskingPct < 70.0
    };
  }

  /**
   * Takes shelter beneath a giant buttress root cavern overhang.
   * @returns {Object} Root overhang shelter telemetry
   */
  crouchUnderButtressRootOverhang() {
    this.underRootOverhang = true;
    const overheadConcealmentPct = 98.0;

    return {
      underRootOverhang: true,
      overheadConcealmentPct,
      canopySnipersLineOfSightBlocked: true,
      proximityStealthBonus: 'PROXIMITY_INCHES_SURVIVAL'
    };
  }

  /**
   * Wades into running river water, washing away the mud coating.
   * @param {number} waterContactDurationSec
   * @returns {Object} Mud wash-off telemetry
   */
  washMudInRunningRiver(waterContactDurationSec = 8.0) {
    const washedClean = waterContactDurationSec >= 6.0;
    if (washedClean) {
      this.mudCoatingWet = false;
      this.mudCoatingThicknessMm = 0.0;
      this.mudDryingTimerSec = 0.0;
      this.thermalMaskingPct = 0.0;
    }

    return {
      washedClean,
      mudCoatingThicknessMm: this.mudCoatingThicknessMm,
      thermalMaskingPct: this.thermalMaskingPct,
      bodyHeatSignatureRestored: washedClean
    };
  }
}
