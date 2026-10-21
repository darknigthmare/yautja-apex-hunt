/**
 * Predator2ElevatorShaftDescentSector.js
 * 
 * Chantier Level Design #3 - Cage d'Ascenseur Vertigineuse & Duel Suspendu au Bord du Vide.
 * Canonical 1:1 Predator 2 (1990) fidelity:
 * - High-speed vertical elevator chase between Lieutenant Mike Harrigan and the wounded City Hunter.
 * - Harrigan armed with Benelli M3 Super 90 shotgun firing heavy slugs into the elevator cab ceiling.
 * - Severing of elevator counterweight cables: steel cable under 18,000 N tension severed by smart disc,
 *   sending the elevator car plummeting 30 stories with high-speed whip snap acoustics (118 dB).
 * - Hunter rappels down greasy elevator guide rails using clawed gauntlets and magnetic boots.
 * - Climax ledge suspension: Harrigan dangles over 140m precipice gripping the Hunter's severed arm stump,
 *   using the retrieved smart disc to slice the Hunter's grip before falling to the rooftop below.
 */

export class Predator2ElevatorShaftDescentSector {
  /**
   * @param {Object} options
   * @param {number} [options.shaftHeightM=120.0]
   */
  constructor(options = {}) {
    this.shaftHeightM = options.shaftHeightM ?? 120.0;
    this.cablesSevered = false;
    this.hunterRappelled = false;
    this.ledgeSuspensionResolved = false;
    this.elevatorPlummeted = false;
  }

  /**
   * Harrigan fires shotgun slugs up into the elevator cab ceiling.
   * @param {number} slugsFired
   * @returns {Object} Shotgun blast telemetry
   */
  fireHarriganShotgunBlast(slugsFired = 4) {
    return {
      success: true,
      slugsFired,
      weaponModel: 'BENELLI_M3_SUPER_90_12GA',
      kineticImpactPerSlugJoules: 3200,
      elevatorCeilingPenetrated: true,
      shotgunBlastAcousticDb: 138,
      hunterHitStaggerSec: 0.8
    };
  }

  /**
   * Severs the high-tensile steel elevator counterweight cables.
   * @returns {Object} Cable snap and cab plummet telemetry
   */
  severElevatorCables() {
    this.cablesSevered = true;
    this.elevatorPlummeted = true;

    return {
      success: true,
      cablesSevered: true,
      cableTensionN: 18000.0,
      cableSnapAcousticWhipDb: 118,
      elevatorPlummetVelocityMps: 42.0,
      elevatorCrashImpactDb: 142,
      shaftGuideRailsAccessible: true
    };
  }

  /**
   * Hunter rappels down the greasy vertical shaft guide rails.
   * @param {number} descentSpeedMps - Descent speed (m/s)
   * @returns {Object} Rappel descent telemetry
   */
  rappelDownShaftGuideRails(descentSpeedMps = 12.0) {
    if (!this.cablesSevered) {
      return { success: false, reason: 'CABLES_NOT_YET_SEVERED' };
    }

    this.hunterRappelled = true;

    return {
      success: true,
      hunterRappelled: true,
      descentSpeedMps,
      shaftFrictionSparksActive: true,
      metalFrictionAcousticDb: 84,
      descentDistanceM: this.shaftHeightM,
      reachedLowerMaintenanceDeck: true
    };
  }

  /**
   * Resolves the vertigo-inducing rooftop parapet ledge suspension duel.
   * @returns {Object} Suspension duel outcome
   */
  resolveLedgeSuspensionDuel() {
    if (!this.hunterRappelled) {
      return { success: false, reason: 'MUST_COMPLETE_SHAFT_DESCENT_FIRST' };
    }

    this.ledgeSuspensionResolved = true;

    return {
      success: true,
      ledgeSuspensionResolved: true,
      dropElevationM: 140.0,
      harriganSuspendedGrip: true,
      smartDiscCounterStrike: true,
      hunterArmSeveredAtWrist: true,
      hunterFellOntoApartmentTerrace: true,
      vertigoWindGustMps: 22.0
    };
  }
}
