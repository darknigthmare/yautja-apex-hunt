/**
 * BeaverDamRazorWireTrapSector.js
 * 
 * Prey (2022) - Voyageur Camp River Crossing & Beaver Dam Trapfield.
 * Simulates the brutal French fur trapper perimeter along the timber beaver dam:
 * forged-steel beaver jaw leg-hold traps concealed beneath foliage,
 * high-tension razor wire trip lines, and point-blank flintlock musket duels.
 */

export class BeaverDamRazorWireTrapSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='voyageur-beaver-dam-01']
   * @param {number} [options.steelBeaverTrapsCount=8]
   * @param {number} [options.razorWireLinesCount=4]
   * @param {number} [options.riverFlowVelocityMps=3.2]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'voyageur-beaver-dam-01';
    this.steelBeaverTrapsCount = options.steelBeaverTrapsCount || 8;
    this.razorWireLinesCount = options.razorWireLinesCount || 4;
    this.riverFlowVelocityMps = options.riverFlowVelocityMps || 3.2;

    this.trappedEntities = [];
    this.severedWiresCount = 0;
  }

  /**
   * Triggers a concealed forged-steel beaver leg-hold trap.
   * Clamping force: F = 1800 N
   * @param {string} victimId
   * @param {boolean} sprintingBlindly
   * @returns {Object} Leg trap trigger outcome
   */
  triggerSteelBeaverTrap(victimId = 'feral-predator-foot', sprintingBlindly = true) {
    if (this.steelBeaverTrapsCount <= 0) {
      return { triggered: false, reason: 'NO_TRAPS_REMAINING' };
    }

    this.steelBeaverTrapsCount--;
    const clampingForceN = 1800;
    const initialCrushDamage = sprintingBlindly ? 85 : 55;
    const legImmobilized = true;

    const trapRecord = {
      victimId,
      clampingForceN,
      initialCrushDamage,
      legImmobilized,
      pryOpenTimeSec: 2.8,
      speedPenaltyRatio: 0.75
    };

    this.trappedEntities.push(trapRecord);

    return {
      triggered: true,
      victimId,
      clampingForceN,
      initialCrushDamage,
      legImmobilized,
      boneFractureSeverity: sprintingBlindly ? 'HEAVY' : 'MODERATE',
      snapSoundDecibels: 88,
      trapsRemaining: this.steelBeaverTrapsCount
    };
  }

  /**
   * Pries open the jaws of the steel trap using raw Yautja strength.
   * @param {string} victimId
   * @param {number} pryStrengthNewtons
   * @returns {Object} Trap release outcome
   */
  pryOpenSteelTrap(victimId = 'feral-predator-foot', pryStrengthNewtons = 2400) {
    const recordIdx = this.trappedEntities.findIndex(t => t.victimId === victimId);
    if (recordIdx === -1) {
      return { success: false, reason: 'ENTITY_NOT_TRAPPED' };
    }

    const canPry = pryStrengthNewtons >= 1800;
    if (canPry) {
      this.trappedEntities.splice(recordIdx, 1);
    }

    return {
      success: canPry,
      victimId,
      pryStrengthNewtons,
      escaped: canPry,
      residualLimpDurationSec: canPry ? 4.0 : 99.0
    };
  }

  /**
   * Checks collision with a high-tension razor wire trip line.
   * @param {number} movementSpeedMps
   * @returns {Object} Razor wire laceration telemetry
   */
  checkRazorWireCollision(movementSpeedMps = 5.5) {
    if (this.razorWireLinesCount <= 0 || movementSpeedMps < 1.5) {
      return { struckWire: false, lacerationDamage: 0, wireSnapped: false };
    }

    this.severedWiresCount++;
    this.razorWireLinesCount--;
    const lacerationDamage = Math.round(75 + movementSpeedMps * 12);
    const wireTwangDecibels = 82;

    return {
      struckWire: true,
      movementSpeedMps,
      lacerationDamage,
      bleedingApplied: true,
      wireSnapped: true,
      wireTwangDecibels,
      severedWiresCount: this.severedWiresCount
    };
  }
}
