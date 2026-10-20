/**
 * GunnisonHospitalQueenHiveBioluminescenceSector.js
 * 
 * Aliens vs. Predator: Requiem (2007) - Gunnison Memorial Hospital converted Xenomorph hive.
 * Simulates secreted chitinous resin walls, bioluminescent pulsing ovimorph egg clusters,
 * Facehugger proximity-triggered petal openings, and Yautja blue corrosive solvent dissolution.
 */

export class GunnisonHospitalQueenHiveBioluminescenceSector {
  /**
   * @param {Object} options
   * @param {string} [options.hiveId='gunnison-hospital-hive-01']
   * @param {number} [options.ovimorphEggCount=12]
   * @param {number} [options.resinWallIntegrity=1.0]
   * @param {number} [options.ambientBioluminescenceLux=2.4]
   */
  constructor(options = {}) {
    this.hiveId = options.hiveId || 'gunnison-hospital-hive-01';
    this.ovimorphEggCount = options.ovimorphEggCount !== undefined ? options.ovimorphEggCount : 12;
    this.resinWallIntegrity = options.resinWallIntegrity !== undefined ? options.resinWallIntegrity : 1.0;
    this.ambientBioluminescenceLux = options.ambientBioluminescenceLux !== undefined ? options.ambientBioluminescenceLux : 2.4;

    this.eggsOpened = new Array(this.ovimorphEggCount).fill(false);
    this.resinDissolved = false;
  }

  /**
   * Evaluates proximity to an ovimorph egg sac.
   * If an entity moves within 2.5 meters, the 4-petal apex splits and launches a Facehugger.
   * @param {number} eggIndex
   * @param {number} distanceMeters
   * @returns {Object} Egg response telemetry
   */
  approachOvimorphEgg(eggIndex = 0, distanceMeters = 3.0) {
    if (eggIndex < 0 || eggIndex >= this.ovimorphEggCount) {
      return { triggered: false, reason: 'INVALID_EGG_INDEX' };
    }

    if (this.eggsOpened[eggIndex]) {
      return { triggered: false, eggAlreadyHatched: true, eggIndex };
    }

    const proximityThreshold = 2.5;
    if (distanceMeters <= proximityThreshold) {
      this.eggsOpened[eggIndex] = true;
      this.ambientBioluminescenceLux = +(this.ambientBioluminescenceLux + 0.45).toFixed(1);

      return {
        triggered: true,
        eggIndex,
        petalsOpened: true,
        facehuggerEjected: true,
        pounceSpeedMps: 9.5,
        amnioticHissAcousticDb: 62
      };
    }

    return {
      triggered: false,
      eggIndex,
      distanceMeters,
      eggPulsing: true
    };
  }

  /**
   * Applies Wolf Cleaner's blue chemical dissolving vial to melt through hive resin walls.
   * @param {number} [solventVolumeMl=50.0]
   * @returns {Object} Resin dissolution telemetry
   */
  dissolveResinWall(solventVolumeMl = 50.0) {
    if (this.resinDissolved) {
      return { dissolved: true, reason: 'ALREADY_DISSOLVED' };
    }

    const dissolutionEfficiency = solventVolumeMl * 0.025; // 50ml dissolves 1.25 integrity
    this.resinWallIntegrity = Math.max(0, +(this.resinWallIntegrity - dissolutionEfficiency).toFixed(2));

    if (this.resinWallIntegrity <= 0) {
      this.resinDissolved = true;
      return {
        dissolved: true,
        resinWallIntegrity: 0,
        breached: true,
        chemicalSizzleDurationSec: 3.5
      };
    }

    return {
      dissolved: false,
      resinWallIntegrity: this.resinWallIntegrity,
      breached: false
    };
  }

  /**
   * Evaluates airborne spore and acid aerosol hazard inside the bio-dome.
   * @param {number} exposureSec
   * @param {boolean} [maskSealed=true]
   * @returns {Object} Spore toxicity metrics
   */
  evaluateSporeHazard(exposureSec = 1.0, maskSealed = true) {
    if (maskSealed) {
      return {
        hazardActive: false,
        toxicDamage: 0,
        maskProtection: 1.0
      };
    }

    const toxicDamage = Math.round(18 * exposureSec);
    return {
      hazardActive: true,
      toxicDamage,
      sporeInhalationRisk: exposureSec > 2.0,
      hallucinationRisk: exposureSec > 5.0
    };
  }

  /**
   * Returns current hive state.
   * @returns {Object}
   */
  getHiveState() {
    return {
      hiveId: this.hiveId,
      ovimorphEggCount: this.ovimorphEggCount,
      eggsHatchedCount: this.eggsOpened.filter(Boolean).length,
      resinWallIntegrity: this.resinWallIntegrity,
      resinDissolved: this.resinDissolved,
      ambientBioluminescenceLux: this.ambientBioluminescenceLux
    };
  }
}
