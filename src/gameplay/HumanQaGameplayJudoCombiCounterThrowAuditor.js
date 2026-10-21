/**
 * HumanQaGameplayJudoCombiCounterThrowAuditor.js
 * 
 * Chantier 9 & Audit QA #4 (Gameplay):
 * Solves QA tester feedback: "When humanoid enemies or agile Predators charge
 * with a running tackle (Hell-Hounds, berserker charge, voyageur bayonet charge),
 * the player cannot counter-throw them using leverage. High-level Yautja martial
 * lore features leverage hip-toss counters."
 * 
 * Implements martial leverage counter mechanics: 160ms contact window,
 * momentum redirection (E = 0.5 * m * v^2), 210 kinetic slam damage, and 2.0s prone knockdown.
 */

export class HumanQaGameplayJudoCombiCounterThrowAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.counterWindowMs=160.0]
   * @param {number} [options.baseSlamDamage=210.0]
   */
  constructor(options = {}) {
    this.counterWindowMs = options.counterWindowMs || 160.0;
    this.baseSlamDamage = options.baseSlamDamage || 210.0;

    this.counterStanceActive = false;
    this.counterStanceTimestampMs = 0;
  }

  /**
   * Enters the leverage counter-throw stance.
   * @param {number} currentTimestampMs
   * @returns {Object} Stance status
   */
  enterCounterStance(currentTimestampMs = 1000) {
    this.counterStanceActive = true;
    this.counterStanceTimestampMs = currentTimestampMs;

    return {
      counterStanceActive: true,
      counterStanceTimestampMs: this.counterStanceTimestampMs,
      counterWindowMs: this.counterWindowMs
    };
  }

  /**
   * Resolves an incoming charging attack against the counter stance.
   * @param {number} contactTimestampMs
   * @param {Object} attackerEntity - { id, massKg, chargeSpeedMps, rawDamage, health }
   * @returns {Object} Counter throw outcome
   */
  resolveChargeCounterThrow(contactTimestampMs = 1090, attackerEntity = { id: 'charging-hound', massKg: 140, chargeSpeedMps: 14.0, rawDamage: 120, health: 300 }) {
    if (!this.counterStanceActive) {
      return {
        counterSuccess: false,
        reason: 'NOT_IN_COUNTER_STANCE',
        damageTaken: attackerEntity.rawDamage
      };
    }

    const elapsedMs = contactTimestampMs - this.counterStanceTimestampMs;
    this.counterStanceActive = false;

    if (elapsedMs < 0 || elapsedMs > this.counterWindowMs) {
      return {
        counterSuccess: false,
        reason: 'TIMING_WINDOW_MISSED',
        elapsedMs,
        damageTaken: attackerEntity.rawDamage
      };
    }

    // Perfect Judo Combi-Counter Throw!
    const momentumJoules = Math.round(0.5 * attackerEntity.massKg * Math.pow(attackerEntity.chargeSpeedMps, 2));
    const totalSlamDamage = Math.round(this.baseSlamDamage + momentumJoules * 0.005);
    
    attackerEntity.health = Math.max(0, attackerEntity.health - totalSlamDamage);
    attackerEntity.isKnockedDown = true;
    attackerEntity.knockdownDurationSec = 2.0;

    return {
      counterSuccess: true,
      elapsedMs,
      damageTaken: 0, // 100% incoming charge damage negated
      momentumRedirectedJoules: momentumJoules,
      totalSlamDamage,
      targetHealthRemaining: attackerEntity.health,
      targetKnockedProne: true,
      knockdownDurationSec: 2.0,
      groundImpactThudDecibels: 96,
      hunterIFramesGrantedMs: 180
    };
  }
}
