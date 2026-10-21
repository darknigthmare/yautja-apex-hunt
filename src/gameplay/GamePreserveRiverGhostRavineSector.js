/**
 * GamePreserveRiverGhostRavineSector.js
 * 
 * Predators (2010) - Game Preserve Planet River Ghost Crimson Ravine.
 * Simulates the jagged arid red rock canyon terrain:
 * - Narrow 4.0m canyon chokepoints forcing close-quarters ambushes
 * - Sheer vertical sandstone cliff walls with climbable rock fissure handholds up to 28m
 * - High natural rock bridges linking canyon rims (18.0m elevation)
 * - Phosphorescent alien lichen patches glowing amber/green in dark overhangs
 * - Cuchillo tripwire claymore corpse ambush (simulated captive bait booby trap).
 */

export class GamePreserveRiverGhostRavineSector {
  /**
   * @param {Object} options
   * @param {string} [options.ravineId='preserve-ravine-01']
   * @param {number} [options.canyonWidthM=4.2]
   * @param {number} [options.cliffWallHeightM=28.0]
   */
  constructor(options = {}) {
    this.ravineId = options.ravineId || 'preserve-ravine-01';
    this.canyonWidthM = options.canyonWidthM || 4.2;
    this.cliffWallHeightM = options.cliffWallHeightM || 28.0;

    this.naturalArchBridgeElevationM = 18.0;
    this.bioluminescentMossActive = true;
    this.corpseClaymoreArmed = true;
    this.corpseClaymoreDetonated = false;
  }

  /**
   * Climbs sheer red sandstone fissures up the canyon wall.
   * @param {number} climbMeters
   * @returns {Object} Fissure climbing telemetry
   */
  climbCanyonWallFissure(climbMeters = 12.0) {
    const clampedClimb = Math.min(this.cliffWallHeightM, climbMeters);
    const climbVelocityMps = 2.4;
    const timeSec = Number((clampedClimb / climbVelocityMps).toFixed(2));
    const staminaCost = Math.round(clampedClimb * 1.5);
    const tacticalOverwatchBonusPct = Number((clampedClimb / this.cliffWallHeightM * 100).toFixed(1));

    return {
      success: true,
      climbedHeightM: clampedClimb,
      timeSec,
      staminaCost,
      tacticalOverwatchBonusPct,
      cliffWallHeightM: this.cliffWallHeightM,
      handholdsGripIntegrity: 'SOLID_SANDSTONE'
    };
  }

  /**
   * Resolves ambush positioning on the 18.0m natural rock bridge spanning the gorge.
   * @returns {Object} Rock bridge vantage telemetry
   */
  occupyNaturalRockBridgeVantage() {
    const sightlineRadiusM = 95.0;
    const chokePointCoveragePct = 100.0;
    const thermalBackgroundContrastPct = 88.0;

    return {
      bridgeElevationM: this.naturalArchBridgeElevationM,
      canyonWidthM: this.canyonWidthM,
      sightlineRadiusM,
      chokePointCoveragePct,
      thermalBackgroundContrastPct,
      aerialDropVectorReady: true
    };
  }

  /**
   * Triggers the Cuchillo corpse claymore tripwire trap.
   * Simulates Berserker's psychological booby trap using a dying captive as bait.
   * @param {number} approachDistanceM
   * @returns {Object} Bait trap detonation telemetry
   */
  resolveCorpseClaymoreBaitTrap(approachDistanceM = 2.5) {
    if (!this.corpseClaymoreArmed || this.corpseClaymoreDetonated) {
      return { triggered: false, reason: 'TRAP_INACTIVE_OR_DETONATED' };
    }

    if (approachDistanceM <= 3.8) {
      this.corpseClaymoreDetonated = true;
      this.corpseClaymoreArmed = false;

      const blastDamage = 290;
      const shrapnelRadiusM = 7.2;
      const canyonEchoAmplificationPct = 35.0;

      return {
        triggered: true,
        approachDistanceM,
        blastDamage,
        shrapnelRadiusM,
        canyonEchoAmplificationPct,
        shockwaveAcousticsDb: 104,
        rockFallTriggered: true
      };
    }

    return { triggered: false, approachDistanceM, armed: true };
  }
}
