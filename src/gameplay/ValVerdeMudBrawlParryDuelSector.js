/**
 * ValVerdeMudBrawlParryDuelSector.js
 * 
 * Chantier Level Design #3 - Duel au Corps-à-Corps dans la Boue & Parades Réflexes (Mud Brawl QTE).
 * Canonical 1:1 Predator (1987) fidelity:
 * - Brutal close-quarters hand-to-hand combat between Dutch and the unmasked Jungle Hunter in the mud trench.
 * - Reflex parry window mechanics:
 *   - Hunter telegraphs horizontal wristblade sweep or overhead sledgehammer double-fist strike.
 *   - Parry window: 220ms (+/- 35ms dynamic timing tolerance).
 *   - Dutch blocks with a heavy hardwood branch: sparks spall, branch notches, absorbing 750 J.
 *   - Counter-attacks: knee strike into reptilian diaphragm, close-range headbutt against chitinous mandibles.
 * - Deep mud slip resistance (mu = 0.32) and stamina struggle gauge.
 */

export class ValVerdeMudBrawlParryDuelSector {
  /**
   * @param {Object} options
   * @param {number} [options.parryWindowMs=220.0]
   * @param {number} [options.mudFrictionMu=0.32]
   */
  constructor(options = {}) {
    this.parryWindowMs = options.parryWindowMs ?? 220.0;
    this.mudFrictionMu = options.mudFrictionMu ?? 0.32;

    this.duelActive = false;
    this.playerHealth = 100;
    this.hunterStunMeter = 0;
    this.comboParriesCount = 0;
  }

  /**
   * Hunter begins a telegraph for a heavy melee assault.
   * @param {string} [attackType='WRISTBLADE_SWEEP'] - 'WRISTBLADE_SWEEP' | 'OVERHEAD_HAMMER_PUNCH'
   * @returns {Object} Telegraph telemetry
   */
  telegraphHunterAssault(attackType = 'WRISTBLADE_SWEEP') {
    this.duelActive = true;
    const telegraphDurationMs = attackType === 'WRISTBLADE_SWEEP' ? 420 : 540;

    return {
      attackType,
      telegraphDurationMs,
      parryWindowMs: this.parryWindowMs,
      optimalParryTimestampMs: telegraphDurationMs - (this.parryWindowMs / 2),
      acousticTelegraphRoarDb: 84,
      dangerRating: 'LETHAL_CLOSE_QUARTERS'
    };
  }

  /**
   * Player attempts a reflex parry with hardwood branch.
   * @param {number} inputTimingMs - Player reaction timing relative to optimal window
   * @returns {Object} Parry resolution
   */
  attemptReflexParry(inputTimingMs = 0.0) {
    const isParrySuccessful = Math.abs(inputTimingMs) <= (this.parryWindowMs / 2);

    if (isParrySuccessful) {
      this.comboParriesCount++;
      this.hunterStunMeter = Math.min(100, this.hunterStunMeter + 35);

      return {
        success: true,
        parrySuccessful: true,
        comboParriesCount: this.comboParriesCount,
        hunterStunMeter: this.hunterStunMeter,
        branchDamageAbsorptionJoules: 750,
        sparksCount: 16,
        acousticClashDb: 92,
        counterAttackWindowMs: 650,
        mudFootingMaintained: true
      };
    } else {
      this.comboParriesCount = 0;
      const damageTaken = 30;
      this.playerHealth = Math.max(0, this.playerHealth - damageTaken);

      return {
        success: false,
        parrySuccessful: false,
        damageTaken,
        playerHealthRemaining: this.playerHealth,
        slippedInMud: true,
        knockdownRecoverySec: 1.4
      };
    }
  }

  /**
   * Executes a brutal counter-attack when hunter is staggered.
   * @param {string} counterMove - 'KNEE_STRIKE' | 'MANDIBLE_HEADBUTT'
   * @returns {Object} Counter-attack result
   */
  executeCounterStrike(counterMove = 'KNEE_STRIKE') {
    if (this.hunterStunMeter < 30) {
      return { success: false, reason: 'HUNTER_NOT_STAGGERED' };
    }

    this.hunterStunMeter = Math.max(0, this.hunterStunMeter - 30);
    const damageDealt = counterMove === 'MANDIBLE_HEADBUTT' ? 22 : 18;

    return {
      success: true,
      counterMove,
      damageDealt,
      hunterStunMeter: this.hunterStunMeter,
      hunterDisorientedSec: 2.2,
      acousticImpactDb: 86,
      readyToExecuteDeadfallBait: true
    };
  }
}
