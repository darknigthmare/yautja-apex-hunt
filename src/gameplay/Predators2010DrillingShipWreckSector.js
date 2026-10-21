/**
 * Predators2010DrillingShipWreckSector.js
 * 
 * Chantier Level Design #6 - Épave du Vaisseau de Forage & Piège Asphyxiant de Noland.
 * Canonical 1:1 Predators (2010) fidelity:
 * - Colossal derelict alien mining excavator / industrial drilling ship half-submerged in volcanic silt.
 * - Multi-tiered rusted titanium bulkheads, creaking metal pressure corridors, hydraulic drilling shafts.
 * - Ronald Noland's survival outpost:
 *   - Lived hidden for 10 hunting seasons wearing salvaged Yautja camouflage cuirass and sound-dampened fur wrappings.
 *   - Stockpile of scavenged weapons, dry rations, and stolen Yautja tech.
 * - Toxic asphyxiation trap:
 *   - Noland seals the heavy pressure hatch and vents concentrated carbon monoxide smoke into the chamber.
 *   - Toxic gas level rises to 800 ppm, reducing survivor stamina and vision before an explosive breach.
 *   - Sound of creaking hull plates under external wind (84 dB) and hissing gas vents.
 */

export class Predators2010DrillingShipWreckSector {
  /**
   * @param {Object} options
   * @param {number} [options.hullLengthM=180.0]
   */
  constructor(options = {}) {
    this.hullLengthM = options.hullLengthM ?? 180.0;
    this.shipEntered = false;
    this.nolandEncountered = false;
    this.smokeTrapTriggered = false;
    this.airlockBreached = false;
  }

  /**
   * Enters the rusted titanium drilling excavator hull.
   * @returns {Object} Drilling ship entrance telemetry
   */
  enterDerelictDrillingHull() {
    this.shipEntered = true;

    return {
      success: true,
      shipEntered: true,
      hullLengthM: this.hullLengthM,
      structureMaterial: 'CORRODED_TITANIUM_STEEL_ALLOY',
      creakingBulkheadAcousticDb: 78,
      ambientEchoDecaySec: 2.4,
      acousticIsolationFromJunglePct: 85.0
    };
  }

  /**
   * Discovers Ronald Noland inside his hidden survival bunk.
   * @returns {Object} Noland discovery telemetry
   */
  discoverNolandOutpost() {
    if (!this.shipEntered) {
      return { success: false, reason: 'MUST_ENTER_HULL_FIRST' };
    }

    this.nolandEncountered = true;

    return {
      success: true,
      nolandEncountered: true,
      survivalDurationHuntingSeasons: 10,
      scavengedArmor: 'YAUTJA_CAMOUFLAGE_CUIRASS_AND_GAUNTLET',
      dialogueQuote: "It's been ten seasons... I'm the one that got away.",
      soundDampeningFursEffective: true
    };
  }

  /**
   * Noland locks the airlock hatch and vents toxic smoke to suffocate the group.
   * @param {number} gasConcentrationPpm - Toxic smoke level in ppm
   * @returns {Object} Smoke trap telemetry
   */
  triggerCarbonMonoxideSmokeTrap(gasConcentrationPpm = 800.0) {
    if (!this.nolandEncountered) {
      return { success: false, reason: 'NOLAND_NOT_ENCOUNTERED' };
    }

    this.smokeTrapTriggered = true;

    return {
      success: true,
      smokeTrapTriggered: true,
      gasConcentrationPpm,
      hatchLocked: true,
      gasVentHissAcousticDb: 86,
      survivorCoughingAcousticDb: 74,
      timeBeforeAsphyxiationSec: 35.0,
      requiresExplosiveOrHeavyBreach: true
    };
  }

  /**
   * Breaches the locked airlock hatch with explosives or kinetic sledge to escape.
   * @returns {Object} Airlock breach outcome
   */
  breachLockedAirlockHatch() {
    if (!this.smokeTrapTriggered) {
      return { success: false, reason: 'TRAP_NOT_TRIGGERED' };
    }

    this.airlockBreached = true;

    return {
      success: true,
      airlockBreached: true,
      hatchDoorBlownFree: true,
      freshAirRestored: true,
      explosiveBlastAcousticDb: 128,
      escapedToVolcanicQuarry: true
    };
  }
}
