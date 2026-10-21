/**
 * NolandDrillingShipRustMazeSector.js
 * 
 * Predators (2010) - Ronald Noland's Derelict Mining Drilling Vessel Rust Labyrinth.
 * Simulates the massive industrial shipwreck hideout on the Game Preserve Planet:
 * - Labyrinthine rusted corrugated iron hallways and narrow crawlspaces
 * - Suspended acoustic tripwires rigged with rusted tin cans that rattle when brushed
 * - Blazing industrial smelting furnace flues emitting 450 °C thermal updrafts (masking IR body heat)
 * - Heavy rusted bulkhead doors that can be sealed to isolate pursuit squads.
 */

export class NolandDrillingShipRustMazeSector {
  /**
   * @param {Object} options
   * @param {string} [options.shipId='derelict-drilling-ship-01']
   * @param {number} [options.hullCorrosionPct=78.0]
   * @param {number} [options.furnaceTempC=450.0]
   */
  constructor(options = {}) {
    this.shipId = options.shipId || 'derelict-drilling-ship-01';
    this.hullCorrosionPct = options.hullCorrosionPct || 78.0;
    this.furnaceTempC = options.furnaceTempC || 450.0;

    this.tinCanTripwires = [
      { id: 'tripwire-can-01', location: 'bulkhead-corridor-a', armed: true },
      { id: 'tripwire-can-02', location: 'vent-crawlspace-b', armed: true },
      { id: 'tripwire-can-03', location: 'furnace-flue-approach', armed: true }
    ];

    this.furnaceOperational = true;
    this.bulkheadSealed = false;
  }

  /**
   * Evaluates corridor movement past Noland's suspended tin can warning tripwires.
   * High-speed sprinting brushes the cans, sounding an acoustic alarm; low crouching bypasses it.
   * @param {string} tripwireId
   * @param {boolean} isCrouchSneaking
   * @returns {Object} Tripwire acoustic telemetry
   */
  checkTinCanAcousticTripwire(tripwireId = 'tripwire-can-01', isCrouchSneaking = false) {
    const wire = this.tinCanTripwires.find(w => w.id === tripwireId);
    if (!wire || !wire.armed) {
      return { triggered: false, reason: 'TRIPWIRE_NOT_FOUND_OR_DISARMED' };
    }

    if (isCrouchSneaking) {
      return {
        triggered: false,
        tripwireId: wire.id,
        silentPassage: true,
        acousticNoiseDb: 18
      };
    }

    // Triggered
    wire.armed = false;
    const acousticClatterDecibels = 78;
    const nolandAlertRadiusM = 45.0;

    return {
      triggered: true,
      tripwireId: wire.id,
      acousticClatterDecibels,
      nolandAlertRadiusM,
      ambushPositionCompromised: true
    };
  }

  /**
   * Positions the hunter inside or directly above the blazing furnace chimney flue.
   * The 450 °C thermal convection draft creates a massive IR heat plume, masking Yautja body heat from enemy optics.
   * @returns {Object} Furnace flue thermal masking telemetry
   */
  enterFurnaceChimneyThermalMask() {
    const thermalDraftVelocityMps = 14.2;
    const bodyHeatContrastSaturatedPct = 100.0; // Complete infrared invisibility
    const ambientFlueTempC = this.furnaceTempC;

    return {
      success: true,
      ambientFlueTempC,
      thermalDraftVelocityMps,
      bodyHeatContrastSaturatedPct,
      infraredTrackingImmunity: true,
      thermalChimneyUpdraftAvailable: true,
      flueDecibels: 68
    };
  }

  /**
   * Seals the rusted emergency bulkhead door to lock pursuers inside or cut off a corridor.
   * @returns {Object} Bulkhead seal telemetry
   */
  sealRustedBulkheadDoor() {
    this.bulkheadSealed = true;
    const blastResistanceThresholdJoules = 2800;

    return {
      success: true,
      bulkheadSealed: true,
      blastResistanceThresholdJoules,
      corridorChokePointSealed: true,
      metalSlamDecibels: 86
    };
  }
}
