/**
 * FluorescentTallGrassHoundKennelsSector.js
 * 
 * Predators (2010) - Game Preserve Planet Bioluminescent Tall Grass Savannah & Hound Kennels.
 * Simulates the dense extraterrestrial savannah where the Tracker Predator releases hunting hounds:
 * - 2.5m tall alien grass providing 100% horizontal line-of-sight concealment at ground level
 * - Overhead deadwood roost trees (16.0m elevation) providing high-angle thermal overwatch
 * - Ultrasonic whistle acoustic beacons used by the Tracker to rally and direct hound charges
 * - Bone kennels constructed from the ribcages of massive alien fauna.
 */

export class FluorescentTallGrassHoundKennelsSector {
  /**
   * @param {Object} options
   * @param {string} [options.savannahId='preserve-tall-grass-01']
   * @param {number} [options.grassHeightM=2.5]
   * @param {number} [options.roostTreeHeightM=16.0]
   */
  constructor(options = {}) {
    this.savannahId = options.savannahId || 'preserve-tall-grass-01';
    this.grassHeightM = options.grassHeightM || 2.5;
    this.roostTreeHeightM = options.roostTreeHeightM || 16.0;

    this.flockHoundCount = 4;
    this.ultrasonicBeaconActive = false;
    this.grassFluorescenceIntensity = 0.88;
  }

  /**
   * Evaluates line of sight and concealment inside the 2.5m tall alien grass.
   * Ground targets cannot see more than 3.5m ahead unless on an elevated roost or jumping.
   * @param {number} observerElevationM
   * @returns {Object} Savannah visibility telemetry
   */
  evaluateGrassSavannahConcealment(observerElevationM = 0.0) {
    if (observerElevationM < this.grassHeightM) {
      // Inside the tall grass
      const maxDirectSightlineM = 3.5;
      const thermalGrassAttenuationPct = 45.0; // Dense cold stalks scatter thermal radiation
      const auditoryTrackingAdvantage = true;

      return {
        isConcealedInGrass: true,
        observerElevationM,
        maxDirectSightlineM,
        thermalGrassAttenuationPct,
        stealthConcealmentRating: 'MAXIMUM_GROUND_CONCEALMENT',
        auditoryTrackingAdvantage
      };
    }

    // Elevated above grass (e.g. from roost tree at 16m)
    const thermalLookoutRadiusM = 140.0;
    const grassMovementRipplesVisible = true;

    return {
      isConcealedInGrass: false,
      observerElevationM,
      thermalLookoutRadiusM,
      grassMovementRipplesVisible,
      highGroundThermalSuperiority: true
    };
  }

  /**
   * Sounds the Tracker's ultrasonic whistle beacon to coordinate a concentric hound ambush.
   * High-frequency acoustic wave (12.5 kHz) inaudible to human quarry but enrages Hell-Hounds.
   * @param {number} beaconDurationSec
   * @returns {Object} Whistle beacon telemetry
   */
  soundUltrasonicHoundWhistle(beaconDurationSec = 1.2) {
    this.ultrasonicBeaconActive = true;
    const frequencyHz = 12500;
    const rallyRadiusM = 180.0;
    const houndChargeSpeedMultiplier = 1.45;

    return {
      whistleActive: true,
      frequencyHz,
      beaconDurationSec,
      rallyRadiusM,
      houndChargeSpeedMultiplier,
      humanAudibleWarning: false, // Humans only hear grass swaying
      houndsRalliedCount: this.flockHoundCount
    };
  }

  /**
   * Interacts with the alien leviathan bone kennels (can be climbed or used as barricades).
   * @returns {Object} Bone kennel interaction telemetry
   */
  interactWithBoneKennelBarricade() {
    const ribcageCoverRating = 'PARTIAL_BALLISTIC_COVER';
    const climbingElevationM = 4.5;
    const boneSplinterShardsUnderPlasma = 14;

    return {
      ribcageCoverRating,
      climbingElevationM,
      boneSplinterShardsUnderPlasma,
      houndEnclosureBreached: true
    };
  }
}
