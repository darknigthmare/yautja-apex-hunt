/**
 * HumanQaGameplayCombiStickPerfectParryAuditor.js
 * 
 * Chantier 9 & Audit QA #4 (Gameplay):
 * Solves QA tester feedback: "Melee combat against heavy bosses (Xenomorph Queen tail,
 * Berserker fist, Feral shield crush) feels like simple damage trading with no high-skill
 * defensive counter mechanic."
 * 
 * Implements high-skill frame data Combi-stick deflection: 120ms Perfect Parry window,
 * 100% damage negation, kinetic poise stagger (1.8s), and high-damage spinning thrust riposte (280 dmg).
 */

export class HumanQaGameplayCombiStickPerfectParryAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.perfectParryWindowMs=120.0]
   * @param {number} [options.imperfectBlockWindowMs=300.0]
   * @param {number} [options.riposteThrustDamage=280.0]
   */
  constructor(options = {}) {
    this.perfectParryWindowMs = options.perfectParryWindowMs || 120.0;
    this.imperfectBlockWindowMs = options.imperfectBlockWindowMs || 300.0;
    this.riposteThrustDamage = options.riposteThrustDamage || 280.0;

    this.parryStanceActive = false;
    this.parryStanceTimestampMs = 0;
    this.riposteWindowRemainingSec = 0.0;
  }

  /**
   * Enters the Combi-stick parry guard stance.
   * @param {number} currentTimestampMs
   * @returns {Object} Guard status
   */
  raiseParryGuard(currentTimestampMs = 1000) {
    this.parryStanceActive = true;
    this.parryStanceTimestampMs = currentTimestampMs;

    return {
      parryStanceActive: true,
      parryStanceTimestampMs: this.parryStanceTimestampMs,
      perfectParryWindowMs: this.perfectParryWindowMs,
      imperfectBlockWindowMs: this.imperfectBlockWindowMs
    };
  }

  /**
   * Resolves an incoming heavy strike while in parry guard.
   * @param {number} strikeImpactTimestampMs
   * @param {number} rawDamage - Incoming attack damage
   * @param {Object} attackerRef - Attacker entity { id, staggered, poise }
   * @returns {Object} Parry resolution
   */
  resolveIncomingStrike(strikeImpactTimestampMs = 1080, rawDamage = 220, attackerRef = null) {
    if (!this.parryStanceActive) {
      return {
        resolved: true,
        parryGrade: 'NONE',
        damageTaken: rawDamage,
        attackerStaggered: false
      };
    }

    const elapsedMs = strikeImpactTimestampMs - this.parryStanceTimestampMs;
    this.parryStanceActive = false;

    if (elapsedMs >= 0 && elapsedMs <= this.perfectParryWindowMs) {
      // Perfect Parry!
      this.riposteWindowRemainingSec = 1.2;
      if (attackerRef) {
        attackerRef.staggered = true;
        attackerRef.staggerDurationSec = 1.8;
      }

      return {
        resolved: true,
        parryGrade: 'PERFECT_PARRY',
        elapsedMs,
        damageTaken: 0, // 100% damage negated
        attackerStaggered: true,
        staggerDurationSec: 1.8,
        riposteWindowSec: 1.2,
        sparkEmissionLux: 16000,
        deflectionKnockbackDistanceM: 1.8
      };
    } else if (elapsedMs > this.perfectParryWindowMs && elapsedMs <= this.imperfectBlockWindowMs) {
      // Imperfect Block
      const chipDamage = Math.round(rawDamage * 0.35); // 65% absorbed
      return {
        resolved: true,
        parryGrade: 'IMPERFECT_BLOCK',
        elapsedMs,
        damageTaken: chipDamage,
        attackerStaggered: false,
        riposteWindowSec: 0.0
      };
    } else {
      // Missed parry (too late)
      return {
        resolved: true,
        parryGrade: 'MISSED_LATE',
        elapsedMs,
        damageTaken: rawDamage,
        attackerStaggered: false,
        riposteWindowSec: 0.0
      };
    }
  }

  /**
   * Executes the spinning Combi-stick counter thrust during the riposte window.
   * @param {Object} targetEntity
   * @returns {Object} Riposte outcome
   */
  executeRiposteCounterThrust(targetEntity = null) {
    if (this.riposteWindowRemainingSec <= 0.0) {
      return { success: false, reason: 'RIPOSTE_WINDOW_EXPIRED' };
    }

    this.riposteWindowRemainingSec = 0.0;
    if (targetEntity) {
      targetEntity.health = Math.max(0, (targetEntity.health || 500) - this.riposteThrustDamage);
    }

    return {
      success: true,
      riposteThrustDamage: this.riposteThrustDamage,
      critMultiplier: 1.5,
      totalDamageDealt: Math.round(this.riposteThrustDamage * 1.5),
      targetArmorPierced: true
    };
  }
}
