/**
 * CaveBearDenRockPillarSector.js
 * 
 * Prey (2022) - Comanche Mountain Limestone Cavern & Cave Bear Den.
 * Simulates the dark, rocky subterranean apex predator lair:
 * - Concealed entrance masked by hanging pine and spruce root curtains
 * - Central monolithic limestone stalactite pillars providing circular cover during beast duels
 * - Damp river-pebble flooring producing acoustic crunching underfoot
 * - Elevated rock ledge roosts at 7.5m elevation allowing devastating aerial drop strikes.
 */

export class CaveBearDenRockPillarSector {
  /**
   * @param {Object} options
   * @param {string} [options.cavernId='prey-bear-den-01']
   * @param {number} [options.pillarCount=4]
   * @param {number} [options.ledgeElevationM=7.5]
   */
  constructor(options = {}) {
    this.cavernId = options.cavernId || 'prey-bear-den-01';
    this.pillarCount = options.pillarCount || 4;
    this.ledgeElevationM = options.ledgeElevationM || 7.5;

    this.rootCurtainConcealed = true;
    this.pebbleFloorWet = true;
    this.pillarsIntegrity = [
      { id: 'pillar-limestone-01', diameterM: 2.4, integrity: 1.0 },
      { id: 'pillar-limestone-02', diameterM: 1.8, integrity: 1.0 },
      { id: 'pillar-limestone-03', diameterM: 3.1, integrity: 1.0 }
    ];
  }

  /**
   * Enters the cavern through the hanging tree root curtain.
   * Root curtain provides 100% concealment from the outside and muffles interior roar acoustics.
   * @returns {Object} Root curtain passage telemetry
   */
  passThroughTreeRootCurtain() {
    const entranceConcealmentPct = 100.0;
    const interiorAcousticDampingDb = 22;

    return {
      success: true,
      entranceConcealmentPct,
      interiorAcousticDampingDb,
      exteriorSnipersLineOfSightBlocked: true,
      subterraneanEchoActive: true
    };
  }

  /**
   * Uses the massive limestone pillar to circle-strafe and absorb a charging beast swipe.
   * Pillars absorb up to 600 Joules of kinetic collision before chipping stone fragments.
   * @param {string} pillarId
   * @param {number} collisionEnergyJoules
   * @returns {Object} Pillar cover telemetry
   */
  resolvePillarCollisionCover(pillarId = 'pillar-limestone-01', collisionEnergyJoules = 450.0) {
    const pillar = this.pillarsIntegrity.find(p => p.id === pillarId);
    if (!pillar) {
      return { success: false, reason: 'PILLAR_NOT_FOUND' };
    }

    const absorbed = Math.min(600.0, collisionEnergyJoules);
    pillar.integrity = Math.max(0, pillar.integrity - (collisionEnergyJoules / 1200.0));
    const stoneChipShards = Math.round(collisionEnergyJoules * 0.035);

    return {
      success: true,
      pillarId: pillar.id,
      absorbedEnergyJoules: absorbed,
      pillarIntegrityRemaining: Number(pillar.integrity.toFixed(2)),
      beastStunnedAgainstPillar: true,
      beastStunDurationSec: 1.5,
      stoneChipShards
    };
  }

  /**
   * Treads across loose damp river-pebble flooring inside the den.
   * Footsteps cause gravel crunching audible up to 14m unless using silent stance.
   * @param {boolean} isSilentStalk
   * @returns {Object} Pebble floor acoustic telemetry
   */
  treadPebbleFloor(isSilentStalk = false) {
    const gravelCrunchDecibels = isSilentStalk ? 25 : 62;
    const beastDetectionChancePct = isSilentStalk ? 5.0 : 80.0;

    return {
      pebbleFloorWet: this.pebbleFloorWet,
      isSilentStalk,
      gravelCrunchDecibels,
      beastDetectionChancePct,
      denEchoAmplification: true
    };
  }

  /**
   * Executes an aerial plunge strike from the 7.5m rock ledge onto the beast below.
   * @returns {Object} Aerial plunge telemetry
   */
  executeLedgePlungeStrike() {
    const dropVelocityMps = Number(Math.sqrt(2 * 9.81 * this.ledgeElevationM).toFixed(2));
    const plungeKineticEnergyJ = Math.round(0.5 * 140.0 * dropVelocityMps * dropVelocityMps);
    const dropCrushDamage = 260;

    return {
      success: true,
      ledgeElevationM: this.ledgeElevationM,
      dropVelocityMps,
      plungeKineticEnergyJ,
      dropCrushDamage,
      beastKnockdownSec: 2.4,
      iFramesDurationMs: 190
    };
  }
}
