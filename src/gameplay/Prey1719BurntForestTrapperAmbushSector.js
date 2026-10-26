/**
 * Prey1719BurntForestTrapperAmbushSector.js
 * 
 * Chantier Level Design #1 - Forêt de Pins Calcinée & Piège à Ours en Acier des Trappeurs.
 * Canonical 1:1 Prey (2022 / 1719) fidelity:
 * - Scorched forest biome: blackened pine tree trunks, ash drifts, smoldering embers, and falling ash particles.
 * - French fur trappers' heavy iron bear trap:
 *   - 4,800 N spring tension, double-row serrated steel teeth.
 *   - The Feral Predator steps into the trap; instead of panic, he prises the iron jaws apart with bare hands
 *     (iron creak acoustic at 82 dB), indifferent to physical trauma.
 * - Flintlock musket volley:
 *   - Coordinated line of 6 French trappers discharging black powder muskets at 20m.
 *   - Feral Predator deploys his expandable obsidian bone fan shield, charges through the smoke, and dismantles
 *     the line with his telescoping combi-stick.
 */

export class Prey1719BurntForestTrapperAmbushSector {
  /**
   * @param {Object} options
   * @param {number} [options.ashDensityPct=75.0]
   */
  constructor(options = {}) {
    this.ashDensityPct = options.ashDensityPct ?? 75.0;
    this.bearTrapTriggered = false;
    this.bearTrapPriedOpen = false;
    this.musketVolleyDeflected = false;
    this.trappersDefeatedCount = 0;
  }

  /**
   * Navigates the scorched pine forest under heavy ash fall.
   * @returns {Object} Forest navigation telemetry
   */
  navigateBurntPineForest() {
    return {
      success: true,
      biome: 'SCORCHED_BURNT_PINE_FOREST',
      ashDensityPct: this.ashDensityPct,
      charredTrunkCoverCount: 28,
      opticalVisibilityM: 35.0,
      ashenFootprintsVisible: true,
      windWhistleAcousticDb: 46
    };
  }

  /**
   * The Feral Predator steps into a heavy French steel bear trap.
   * @returns {Object} Trap snap telemetry
   */
  stepIntoSteelBearTrap() {
    this.bearTrapTriggered = true;

    return {
      success: true,
      bearTrapTriggered: true,
      springTensionN: 4800.0,
      serratedTeethCount: 22,
      trapSnapAcousticDb: 88,
      legGreaveArmorScratched: true,
      locomotionRestricted: true
    };
  }

  /**
   * The Feral Predator forcefully pries open the steel bear trap with bare hands.
   * @returns {Object} Prying telemetry
   */
  pryOpenSteelBearTrap() {
    if (!this.bearTrapTriggered) {
      return { success: false, reason: 'BEAR_TRAP_NOT_TRIGGERED' };
    }

    this.bearTrapPriedOpen = true;

    return {
      success: true,
      bearTrapPriedOpen: true,
      forceExertedN: 5200.0,
      ironCreakAcousticDb: 82,
      trapDiscardedIntoBrush: true,
      feralPredatorUnstoppable: true,
      readyForCounterAttack: true
    };
  }

  /**
   * Deflects a volley of flintlock musket balls with the bone fan shield and clears the trappers.
   * @param {number} trappersCount
   * @returns {Object} Musket volley outcome
   */
  deflectFlintlockVolleyAndCounter(trappersCount = 6) {
    if (!this.bearTrapPriedOpen) {
      return { success: false, reason: 'MUST_PRY_TRAP_OPEN_FIRST' };
    }

    this.musketVolleyDeflected = true;
    this.trappersDefeatedCount = trappersCount;

    return {
      success: true,
      musketVolleyDeflected: true,
      trappersDefeatedCount: this.trappersDefeatedCount,
      musketSparksAcousticDb: 94,
      combistickLungeStrikesCount: 4,
      blackPowderSmokeObscurationPct: 80.0,
      frenchTrapperCampSecured: true,
      honorScoreAwarded: 300
    };
  }
}
