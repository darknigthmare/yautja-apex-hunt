/**
 * GunnisonRainCemeteryCryptSector.js
 * 
 * Aliens vs. Predator: Requiem (2007) - Gunnison Municipal Cemetery & Rain-Soaked Crypts.
 * Simulates the atmospheric midnight cemetery battlefield:
 * - Heavy carved granite crypts and stone mausoleums (impenetrable high-density ballistic cover)
 * - Waterlogged grave soil subject to mud collapse into hollow 2.2m deep burial vaults
 * - Wrought-iron spiked perimeter fences with vaulting traversal vectors
 * - Periodic lightning flashes illuminating camouflage cloaks with strobe silhouette contrast.
 */

export class GunnisonRainCemeteryCryptSector {
  /**
   * @param {Object} options
   * @param {string} [options.cemeteryId='gunnison-cemetery-01']
   * @param {number} [options.mausoleumCount=6]
   * @param {number} [options.rainIntensityMmHr=28.0]
   */
  constructor(options = {}) {
    this.cemeteryId = options.cemeteryId || 'gunnison-cemetery-01';
    this.mausoleumCount = options.mausoleumCount || 6;
    this.rainIntensityMmHr = options.rainIntensityMmHr || 28.0;

    this.crypts = [
      { id: 'crypt-granite-01', material: 'CARVED_GRANITE', doorSealed: true, coverRating: 'IMPENETRABLE' },
      { id: 'crypt-granite-02', material: 'CARVED_GRANITE', doorSealed: false, coverRating: 'INTERIOR_SHELTER' },
      { id: 'crypt-granite-03', material: 'WEATHERED_MARBLE', doorSealed: true, coverRating: 'HIGH_BALLISTIC' }
    ];

    this.lightningFlashActive = false;
    this.waterloggedSoilDepthM = 0.45;
  }

  /**
   * Slides open the heavy granite door of a mausoleum to access interior stone shelter.
   * Inside the crypt, cold stone walls completely shield the hunter from rain and exterior infrared sensors.
   * @param {string} cryptId
   * @returns {Object} Mausoleum access telemetry
   */
  accessMausoleumShelter(cryptId = 'crypt-granite-01') {
    const crypt = this.crypts.find(c => c.id === cryptId);
    if (!crypt) {
      return { success: false, reason: 'CRYPT_NOT_FOUND' };
    }

    crypt.doorSealed = false;
    const stoneDoorFrictionDecibels = 72;
    const interiorThermalShieldingPct = 99.0;

    return {
      success: true,
      cryptId: crypt.id,
      coverRating: crypt.coverRating,
      stoneDoorFrictionDecibels,
      interiorThermalShieldingPct,
      rainShielded: true,
      dryGroundFooting: true
    };
  }

  /**
   * Evaluates movement across waterlogged grave plots.
   * Excessive weight or sprinting over sunken graves triggers a soil collapse into an empty burial vault.
   * @param {number} hunterSprintSpeedMps
   * @param {boolean} stepOnOldGrave
   * @returns {Object} Grave soil collapse telemetry
   */
  evaluateGraveSoilStability(hunterSprintSpeedMps = 6.5, stepOnOldGrave = false) {
    if (!stepOnOldGrave) {
      return { collapsed: false, mudDragPct: 22.0 };
    }

    const collapseTriggered = hunterSprintSpeedMps > 4.0;
    const vaultCaveInDepthM = 2.2;
    const mudSlideEntrapmentDurationSec = collapseTriggered ? 1.4 : 0.0;

    return {
      collapsed: collapseTriggered,
      vaultCaveInDepthM,
      mudSlideEntrapmentDurationSec,
      mudSloshDecibels: 64,
      coffinWoodSplinterShards: collapseTriggered ? 8 : 0,
      trenchPositioningGained: collapseTriggered
    };
  }

  /**
   * Triggers a periodic midnight lightning flash across the cemetery.
   * Illuminates refractive camouflage cloaks, causing a 250ms visibility flare.
   * @returns {Object} Lightning flash telemetry
   */
  triggerMidnightLightningFlash() {
    this.lightningFlashActive = true;
    const illuminationLux = 1800;
    const cloakRefractionFlareDurationMs = 250;
    const thunderClapDelaySec = 1.2;
    const thunderDecibels = 112;

    return {
      lightningFlashActive: true,
      illuminationLux,
      cloakRefractionFlareDurationMs,
      thunderClapDelaySec,
      thunderDecibels,
      silhouetteExposed: true
    };
  }
}
