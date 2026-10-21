/**
 * PyramidSacrificialPitChuteSector.js
 * 
 * Alien vs. Predator (2004) - Bouvetøya Subterranean Pyramid Sacrificial Pit & Drop Chutes.
 * Simulates the vertical trapdoor labyrinth beneath the shifting corridors:
 * - Counterweighted stone trapdoors that snap open beneath intruders (18.0m fall drop)
 * - Holding pit chambers with drainage grates collecting bio-acid runoff
 * - Wall-mounted hieroglyphic pressure plates controlling hidden escape hatches
 * - Vertical shaft grapple anchor brackets allowing high-speed ascension back to upper chambers.
 */

export class PyramidSacrificialPitChuteSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='pyramid-sacrificial-pit-01']
   * @param {number} [options.chuteDropDepthM=18.0]
   * @param {number} [options.trapdoorTriggerWeightKg=75.0]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'pyramid-sacrificial-pit-01';
    this.chuteDropDepthM = options.chuteDropDepthM || 18.0;
    this.trapdoorTriggerWeightKg = options.trapdoorTriggerWeightKg || 75.0;

    this.trapdoorOpen = false;
    this.escapeHatchUnlocked = false;
    this.grappleAnchorPointsCount = 3;
    this.acidDrainageActive = true;
  }

  /**
   * Triggers the counterweighted floor trapdoor when stepped on by an entity.
   * Drops victim 18.0m into the lower sacrificial holding pit.
   * @param {number} entityWeightKg
   * @param {boolean} grappleEquipped
   * @returns {Object} Pit chute drop telemetry
   */
  triggerTrapdoorDropChute(entityWeightKg = 140.0, grappleEquipped = true) {
    if (entityWeightKg < this.trapdoorTriggerWeightKg) {
      return { triggered: false, reason: 'WEIGHT_BELOW_TRIGGER_THRESHOLD' };
    }

    this.trapdoorOpen = true;
    const fallVelocityMps = Number(Math.sqrt(2 * 9.81 * this.chuteDropDepthM).toFixed(2));
    const fallDurationSec = Number(Math.sqrt((2 * this.chuteDropDepthM) / 9.81).toFixed(2));

    // If grapple is equipped, hunter can perform emergency wall tether arrest
    const fallArrestedByGrapple = Boolean(grappleEquipped);
    const fallDamage = fallArrestedByGrapple ? 0 : Math.round(this.chuteDropDepthM * 16.5);

    return {
      triggered: true,
      chuteDropDepthM: this.chuteDropDepthM,
      fallVelocityMps,
      fallDurationSec,
      fallArrestedByGrapple,
      fallDamage,
      trapdoorSlamDecibels: 88,
      lowerPitEnclosureLocked: true
    };
  }

  /**
   * Interacts with wall-mounted hieroglyphic counterweight pressure plates to unlock the escape hatch.
   * Requires matching ancient Yautja numeral sequence.
   * @param {string} sequenceInput - 'PYRAMID_RITUAL_SEQUENCE'
   * @returns {Object} Escape hatch telemetry
   */
  solveHieroglyphicPressurePlate(sequenceInput = 'PYRAMID_RITUAL_SEQUENCE') {
    const isCorrect = sequenceInput === 'PYRAMID_RITUAL_SEQUENCE';
    if (isCorrect) {
      this.escapeHatchUnlocked = true;
    }

    return {
      success: isCorrect,
      escapeHatchUnlocked: this.escapeHatchUnlocked,
      counterweightGrindDecibels: isCorrect ? 76 : 30,
      exitPortalToCorridorsOpen: this.escapeHatchUnlocked
    };
  }

  /**
   * Ascends back to the upper pyramid level via vertical shaft grapple anchor points.
   * @param {number} ascentVelocityMps
   * @returns {Object} Vertical shaft ascent telemetry
   */
  ascendVerticalShaftWithGrapple(ascentVelocityMps = 12.0) {
    const ascentDurationSec = Number((this.chuteDropDepthM / ascentVelocityMps).toFixed(2));
    this.trapdoorOpen = false;

    return {
      success: true,
      ascentVelocityMps,
      ascentDurationSec,
      upperChamberReached: true,
      staminaCost: 20,
      iFramesDurationMs: 140
    };
  }
}
