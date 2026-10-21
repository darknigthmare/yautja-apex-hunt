/**
 * MudWaspBluffBeaverDamTransitSector.js
 * 
 * Prey (2022) - Great Plains Mud Wasp Clay Bluffs & Beaver Dam Pond Crossing.
 * Simulates the frontier wilderness riverine level design:
 * - Fragile mud wasp nests hanging from clay bluffs that can be dropped onto enemy patrols
 *   (wasp swarm blinds targets, reduces accuracy by 70%, and inflicts frantic panic running)
 * - Interlocking floating beaver dam logs forming an unstable floating pathway across 3.0m deep water
 * - Crumbling silt clay bluffs that collapse under explosive impact, creating temporary rubble ramps.
 */

export class MudWaspBluffBeaverDamTransitSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='prey-wasp-bluff-01']
   * @param {number} [options.bluffHeightM=12.0]
   * @param {number} [options.damWaterDepthM=3.0]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'prey-wasp-bluff-01';
    this.bluffHeightM = options.bluffHeightM || 12.0;
    this.damWaterDepthM = options.damWaterDepthM || 3.0;

    this.waspNests = [
      { id: 'wasp-nest-01', heightM: 8.5, intact: true, waspsCount: 150 },
      { id: 'wasp-nest-02', heightM: 10.2, intact: true, waspsCount: 220 }
    ];

    this.beaverDamIntact = true;
    this.floatingLogPathStabilityPct = 85.0;
  }

  /**
   * Shoots or strikes a hanging mud wasp nest, dropping it onto enemies beneath.
   * Releases an aggressive swarm causing stinging damage, -70% aim penalty, and panicked flee.
   * @param {string} nestId
   * @returns {Object} Wasp swarm telemetry
   */
  dropMudWaspNest(nestId = 'wasp-nest-01') {
    const nest = this.waspNests.find(n => n.id === nestId);
    if (!nest || !nest.intact) {
      return { success: false, reason: 'NEST_NOT_FOUND_OR_ALREADY_DROPPED' };
    }

    nest.intact = false;
    const swarmRadiusM = 4.5;
    const stingDps = 18;
    const swarmDurationSec = 6.0;
    const targetAccuracyPenaltyPct = 70.0;
    const panicRunningTriggered = true;

    return {
      success: true,
      nestId: nest.id,
      waspsCount: nest.waspsCount,
      swarmRadiusM,
      stingDps,
      swarmDurationSec,
      targetAccuracyPenaltyPct,
      panicRunningTriggered,
      acousticSwarmBuzzDb: 84
    };
  }

  /**
   * Traverses the floating beaver dam log walkway across the river pond.
   * Tests balance and footing against damp moss-covered timber logs.
   * @param {number} sprintSpeedMps
   * @returns {Object} Log walkway traversal telemetry
   */
  traverseBeaverDamLogPath(sprintSpeedMps = 5.0) {
    const slipChancePct = sprintSpeedMps > 4.5 ? 18.0 : 2.5;
    const waterSplashAcousticsDb = Math.round(42 + sprintSpeedMps * 4.2);

    return {
      success: true,
      sprintSpeedMps,
      floatingLogPathStabilityPct: this.floatingLogPathStabilityPct,
      slipChancePct,
      waterSplashAcousticsDb,
      submersionRisk: slipChancePct > 15.0,
      damWaterDepthM: this.damWaterDepthM
    };
  }

  /**
   * Triggers an explosive or kinetic rockfall on the fragile clay bluff, creating a climbable ramp.
   * @returns {Object} Bluff rockfall telemetry
   */
  triggerClayBluffCollapse() {
    const rubbleRampCreated = true;
    const rampSlopeAngleDeg = 32.0;
    const dustCloudRadiusM = 6.2;

    return {
      success: true,
      rubbleRampCreated,
      rampSlopeAngleDeg,
      dustCloudRadiusM,
      accessToBluffApexGranted: true,
      crushDamageToGroundUnits: 160
    };
  }
}
