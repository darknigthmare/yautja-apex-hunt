/**
 * HumanQaGameplayGuardBreakingSpinKickAuditor.js
 * 
 * Chantier 9 & Audit QA #4 (Gameplay):
 * Solves QA tester feedback: "Shielded enemies (Stargazer riot shields,
 * Colonial synthetic armor, Feral fan shield) completely block all light wristblade strikes,
 * forcing dull kiting. A dedicated guard-breaking heavy spinning roundhouse kick is needed."
 * 
 * Implements high-impact martial arts guard break: 420ms startup windup,
 * 320N rotational torque, guard stance penetration, 2.2s vulnerability stagger, and 140 damage.
 */

export class HumanQaGameplayGuardBreakingSpinKickAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.kickDamage=140.0]
   * @param {number} [options.startupDurationMs=420.0]
   * @param {number} [options.staminaCost=35.0]
   */
  constructor(options = {}) {
    this.kickDamage = options.kickDamage || 140.0;
    this.startupDurationMs = options.startupDurationMs || 420.0;
    this.staminaCost = options.staminaCost || 35.0;

    this.windupActive = false;
    this.kickExecuted = false;
  }

  /**
   * Initiates the heavy spinning roundhouse kick windup.
   * @param {number} currentStamina
   * @returns {Object} Windup status
   */
  initiateKickWindup(currentStamina = 100.0) {
    if (currentStamina < this.staminaCost) {
      return { success: false, reason: 'INSUFFICIENT_STAMINA' };
    }

    this.windupActive = true;
    this.kickExecuted = false;

    return {
      success: true,
      windupActive: true,
      startupDurationMs: this.startupDurationMs,
      staminaCost: this.staminaCost,
      remainingStamina: currentStamina - this.staminaCost
    };
  }

  /**
   * Resolves the roundhouse impact against a target entity.
   * @param {Object} targetEntity - { id, isBlocking, shieldIntegrity, health }
   * @returns {Object} Impact outcome
   */
  resolveKickImpact(targetEntity = { id: 'stargazer-riot-guard', isBlocking: true, shieldIntegrity: 100, health: 180 }) {
    this.windupActive = false;
    this.kickExecuted = true;

    const wasBlocking = Boolean(targetEntity.isBlocking);
    let guardShattered = false;
    let staggerDurationSec = 0.8;
    let knockbackDistanceM = 1.5;

    if (wasBlocking) {
      // Guard broken!
      guardShattered = true;
      targetEntity.isBlocking = false;
      targetEntity.shieldIntegrity = 0;
      staggerDurationSec = 2.2; // Massive vulnerability window
      knockbackDistanceM = 2.8;
    } else {
      // Direct unblocked strike launches enemy back
      knockbackDistanceM = 3.5;
      staggerDurationSec = 1.4;
    }

    targetEntity.health = Math.max(0, (targetEntity.health || 100) - this.kickDamage);
    targetEntity.staggered = true;

    return {
      success: true,
      wasBlocking,
      guardShattered,
      kickDamage: this.kickDamage,
      remainingTargetHealth: targetEntity.health,
      staggerDurationSec,
      knockbackDistanceM,
      impactForceNewtons: 320,
      vulnerabilityWindowSec: guardShattered ? 2.2 : 0.0
    };
  }
}
