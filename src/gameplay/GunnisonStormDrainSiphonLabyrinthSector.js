/**
 * GunnisonStormDrainSiphonLabyrinthSector.js
 * 
 * Aliens vs. Predator: Requiem (2007) - Gunnison Underground Storm Drain Siphon & Sewer Labyrinth.
 * Simulates the dark, claustrophobic subterranean sewer system where Wolf tracks Xenomorphs:
 * - Cramped 1.8m overhead clearance tunnels forcing crouching, low-profile stalk movement
 * - Caustic acidic slime runoff puddles (pH 0.5, 35 dps, dissolving rubber boots and shoe soles)
 * - Wolf's signature 4-beam laser tripwire mine grid deployed at four-way tunnel crossroads
 * - Inverted storm siphon chambers with floodwater depth fluctuating between 0.4m and 1.9m.
 */

export class GunnisonStormDrainSiphonLabyrinthSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='gunnison-sewer-siphon-01']
   * @param {number} [options.tunnelClearanceM=1.8]
   * @param {number} [options.waterDepthM=0.6]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'gunnison-sewer-siphon-01';
    this.tunnelClearanceM = options.tunnelClearanceM || 1.8;
    this.waterDepthM = options.waterDepthM || 0.6;

    this.laserMineCrossroadArmed = true;
    this.laserBeamsCount = 4;
    this.laserMineDetonated = false;
    this.acidSlimePuddlesCount = 5;
  }

  /**
   * Evaluates player traversal through the low 1.8m clearance tunnel.
   * Standing tall penalizes movement and increases ceiling collision; crouching yields silent stalk.
   * @param {boolean} isCrouching
   * @param {number} requestedSpeedMps
   * @returns {Object} Low tunnel traversal telemetry
   */
  evaluateLowClearanceMovement(isCrouching = true, requestedSpeedMps = 3.2) {
    if (!isCrouching) {
      // Standing up in 1.8m tunnel causes head-bump against concrete conduits
      const headBumpPenalty = true;
      const effectiveSpeedMps = Math.min(2.0, requestedSpeedMps * 0.6);
      const acousticNoiseDb = 68; // Metal armor scraping ceiling pipe conduits

      return {
        isCrouching: false,
        headBumpPenalty,
        effectiveSpeedMps,
        acousticNoiseDb,
        stealthRating: 'POOR_SCRAPING_CEILING',
        tunnelClearanceM: this.tunnelClearanceM
      };
    }

    const effectiveSpeedMps = Math.min(4.0, requestedSpeedMps);
    const acousticNoiseDb = 32; // Silent stalk through shallow water

    return {
      isCrouching: true,
      headBumpPenalty: false,
      effectiveSpeedMps,
      acousticNoiseDb,
      stealthRating: 'SILENT_LOW_PROFILE_STALK',
      tunnelClearanceM: this.tunnelClearanceM
    };
  }

  /**
   * Resolves entity passage through Wolf's 4-beam laser tripwire mine grid.
   * If any beam is broken without disarming, triggers a multi-directional plasma claymore blast.
   * @param {boolean} trippedBeam
   * @param {boolean} disarmedWithWristGauntlet
   * @returns {Object} Laser mine resolution
   */
  resolveWolfLaserMineIntersection(trippedBeam = false, disarmedWithWristGauntlet = false) {
    if (!this.laserMineCrossroadArmed || this.laserMineDetonated) {
      return { active: false, reason: 'MINE_INACTIVE_OR_DETONATED' };
    }

    if (disarmedWithWristGauntlet) {
      this.laserMineCrossroadArmed = false;
      return {
        active: false,
        disarmed: true,
        action: 'WRIST_GAUNTLET_FREQ_OVERRIDE',
        salvagedPlasmaCharges: 2
      };
    }

    if (trippedBeam) {
      this.laserMineDetonated = true;
      this.laserMineCrossroadArmed = false;
      const plasmaBlastDamage = 340;
      const shockwaveTunnelRadiusM = 9.5;
      const concreteSpallingShards = 22;

      return {
        active: false,
        detonated: true,
        plasmaBlastDamage,
        shockwaveTunnelRadiusM,
        concreteSpallingShards,
        tunnelAcousticBlastDb: 118
      };
    }

    return { active: true, armed: true, laserBeamsCount: this.laserBeamsCount };
  }

  /**
   * Evaluates traversal through caustic acidic slime puddles in the sewer.
   * @param {number} contactDurationSec
   * @returns {Object} Acid puddle hazard telemetry
   */
  resolveAcidSlimePuddleHazard(contactDurationSec = 1.0) {
    const acidPh = 0.5;
    const causticDps = 35;
    const totalDamage = Math.round(causticDps * contactDurationSec);

    return {
      acidPh,
      causticDps,
      totalDamage,
      rubberSoleDissolving: true,
      corrosiveHissActive: true
    };
  }
}
