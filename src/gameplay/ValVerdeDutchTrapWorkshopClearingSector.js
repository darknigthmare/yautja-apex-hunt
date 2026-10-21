/**
 * ValVerdeDutchTrapWorkshopClearingSector.js
 * 
 * Predator (1987) - Val Verde Dutch's Primitive Trap Workshop & Fire-Hardened Punji Pit.
 * Simulates the night-time preparation and booby-trapped clearing:
 * - 2.5m deep pit trap lined with fire-hardened bamboo punji stakes (concealed by twig/palm lattice)
 * - Fire-hardened wooden hunting bows firing 40mm explosive grenade-tip arrows
 * - Roaring decoy campfires and blazing pine torches providing high-temperature thermal bait (580 °C)
 *   that draws the Jungle Hunter's thermal visor away from the cold mud-camouflaged hunter.
 */

export class ValVerdeDutchTrapWorkshopClearingSector {
  /**
   * @param {Object} options
   * @param {string} [options.clearingId='val-verde-workshop-01']
   * @param {number} [options.punjiPitDepthM=2.5]
   * @param {number} [options.decoyCampfireTempC=580.0]
   */
  constructor(options = {}) {
    this.clearingId = options.clearingId || 'val-verde-workshop-01';
    this.punjiPitDepthM = options.punjiPitDepthM || 2.5;
    this.decoyCampfireTempC = options.decoyCampfireTempC || 580.0;

    this.punjiPitConcealed = true;
    this.punjiPitSprung = false;
    this.campfireLit = true;
    this.explosiveArrowsCrafted = 3;
  }

  /**
   * Resolves an entity stepping onto the concealed punji stake pit trap lattice.
   * Breaks twigs and drops victim onto sharpened, fire-hardened bamboo stakes.
   * @param {number} entityWeightKg
   * @returns {Object} Punji pit trap telemetry
   */
  resolveConcealedPunjiPitFall(entityWeightKg = 140.0) {
    if (this.punjiPitSprung) {
      return { triggered: false, reason: 'PIT_ALREADY_SPRUNG' };
    }

    this.punjiPitSprung = true;
    this.punjiPitConcealed = false;

    const fallVelocityMps = Number(Math.sqrt(2 * 9.81 * this.punjiPitDepthM).toFixed(2));
    const impalementDamage = 240;
    const bleedDurationSec = 8.0;

    return {
      triggered: true,
      punjiPitDepthM: this.punjiPitDepthM,
      fallVelocityMps,
      impalementDamage,
      bleedDurationSec,
      twigLatticeShattered: true,
      punjiStakeAcousticThudDb: 86
    };
  }

  /**
   * Fires a primitive fire-hardened wooden bow armed with a 40mm grenade-tip arrow.
   * Delivers precise pinpoint kinetic puncture followed by an explosive blast of 280 damage.
   * @param {number} targetDistanceM
   * @returns {Object} Explosive arrow telemetry
   */
  fireExplosiveTipArrow(targetDistanceM = 25.0) {
    if (this.explosiveArrowsCrafted <= 0) {
      return { success: false, reason: 'NO_EXPLOSIVE_ARROWS_REMAINING' };
    }

    this.explosiveArrowsCrafted--;
    const arrowVelocityMps = 78.0;
    const kineticPunctureDamage = 65;
    const grenadeExplosiveDamage = 280;
    const totalDamage = kineticPunctureDamage + grenadeExplosiveDamage;
    const blastRadiusM = 4.2;

    return {
      success: true,
      arrowsRemaining: this.explosiveArrowsCrafted,
      targetDistanceM,
      arrowVelocityMps,
      totalDamage,
      blastRadiusM,
      shrapnelSprayCount: 28,
      acousticDetonationDb: 114
    };
  }

  /**
   * Uses the roaring decoy campfire as a thermal lure to distract enemy thermal vision.
   * Creates a blazing infrared beacon drawing enemy attention while the hunter flanks in the shadows.
   * @returns {Object} Thermal lure telemetry
   */
  activateDecoyCampfireLure() {
    this.campfireLit = true;
    const thermalRadiationWatts = 4500.0;
    const enemyVisionLureAttractionRadiusM = 85.0;

    return {
      success: true,
      campfireLit: true,
      tempC: this.decoyCampfireTempC,
      thermalRadiationWatts,
      enemyVisionLureAttractionRadiusM,
      thermalDecoyActive: true
    };
  }
}
