/**
 * Predator2ScrapYardSpeargunSector.js
 * 
 * Chantier Level Design #2 - Cimetière de Voitures & Lance-Harpon Pneumatique (Speargun).
 * Canonical 1:1 Predator 2 (1990) fidelity:
 * - South Central Los Angeles scrap yard and automobile cemetery.
 * - Stacks of crushed cars (4 tiers high, 8.5m), rusted crane gantries, burning oil barrels, and grease slicks.
 * - Pneumatic Speargun:
 *   - Fires three-finned razor darts at 180 m/s with micro-canister gas expulsion.
 *   - Tremendous kinetic momentum impales victims, carrying them through the air to pin them against car doors
 *     and corrugated steel containers.
 *   - Spent darts can be extracted and retrieved to replenish ammunition.
 * - Environmental hazards: swinging industrial crane electromagnet distorting bio-mask HUD sensor telemetry.
 */

export class Predator2ScrapYardSpeargunSector {
  /**
   * @param {Object} options
   * @param {number} [options.carStackTiers=4]
   * @param {number} [options.initialSpearAmmo=12]
   */
  constructor(options = {}) {
    this.carStackTiers = options.carStackTiers ?? 4;
    this.spearAmmo = options.initialSpearAmmo ?? 12;

    this.onCarStackPerch = false;
    this.craneMagnetActive = false;
    this.targetsPinned = 0;
  }

  /**
   * Perches atop a 4-tier stack of crushed automobiles.
   * @param {number} stackHeightM - Elevation in meters
   * @returns {Object} Car stack perch telemetry
   */
  perchOnCrushedCarStack(stackHeightM = 8.5) {
    this.onCarStackPerch = true;

    return {
      success: true,
      onCarStackPerch: true,
      stackHeightM,
      carRoofClankAcousticDb: 62,
      vantagePointCoverageDeg: 270,
      oilGreaseSlickWarning: true,
      scrapYardCorridorsVisible: 5
    };
  }

  /**
   * Fires a pneumatic speargun dart to impale a target and pin them against metal barriers.
   * @param {number} targetDistanceM - Distance to target (m)
   * @param {string} [pinSurfaceType='CORRUGATED_STEEL_CONTAINER']
   * @returns {Object} Speargun dart telemetry
   */
  firePneumaticSpeargun(targetDistanceM = 35.0, pinSurfaceType = 'CORRUGATED_STEEL_CONTAINER') {
    if (this.spearAmmo <= 0) {
      return { success: false, reason: 'OUT_OF_SPEAR_AMMO' };
    }

    this.spearAmmo--;
    this.targetsPinned++;

    const muzzleVelocityMps = 180.0;
    const flightTimeSec = Math.round((targetDistanceM / muzzleVelocityMps) * 1000) / 1000;
    const kineticImpactJoules = 1450.0;

    return {
      success: true,
      targetDistanceM,
      muzzleVelocityMps,
      flightTimeSec,
      kineticImpactJoules,
      pinSurfaceType,
      targetImpaledAndPinned: true,
      dartAcousticZipDb: 72,
      impactThunkDb: 86,
      remainingSpearAmmo: this.spearAmmo,
      retrievable: true
    };
  }

  /**
   * Toggles the industrial crane electromagnet to simulate HUD electromagnetic interference.
   * @param {boolean} active
   * @returns {Object} Magnet interference telemetry
   */
  toggleCraneElectromagnet(active = true) {
    this.craneMagnetActive = active;

    return {
      success: true,
      craneMagnetActive: active,
      magneticFluxTesla: active ? 2.4 : 0.0,
      bioMaskSensorInterferencePct: active ? 35.0 : 0.0,
      craneHumAcousticDb: active ? 68 : 0
    };
  }

  /**
   * Retrieves spent spear darts from impaled targets to reload the speargun.
   * @param {number} dartsToRetrieve
   * @returns {Object} Dart retrieval telemetry
   */
  retrieveSpearAmmo(dartsToRetrieve = 2) {
    const recovered = Math.min(this.targetsPinned, dartsToRetrieve);
    this.spearAmmo += recovered;
    this.targetsPinned -= recovered;

    return {
      success: true,
      dartsRecovered: recovered,
      totalSpearAmmo: this.spearAmmo,
      fleshWithdrawalAcousticDb: 54
    };
  }
}
