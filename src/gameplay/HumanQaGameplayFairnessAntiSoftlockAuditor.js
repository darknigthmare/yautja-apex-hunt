import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 8 + Audit Testeur Humain QA #4 (v153) — Persona "Vétéran Combat & Anti-Softlock / Anti-Stunlock"
 * Élimine deux situations frustrantes relevées en test de combat haute intensité :
 * 1. Anti-Softlock Offensif : si le joueur tombe à `0` d'énergie plasma ET que ses Wristblades sont détruites par l'acide Xénomorphe sans munitions de lance, active une micro-impulsion de récupération du condensateur (`+18` énergie) et dégaine la dague cérémonielle en résine d'os Xénomorphe (immunisée à l'acide).
 * 2. Anti-Stunlock (*Stagger Grace Window*) : après avoir subi un renversement lourd (coup de queue de Reine, charge de Praetorian, explosion de grenade), accorde `1.2 s` d'immunité au renversement en chaîne pour garantir une fenêtre d'esquive ou de parade.
 */
export class HumanQaGameplayFairnessAntiSoftlockAuditor {
  constructor(options = {}) {
    this.staggerGraceDurationSec = options.staggerGraceDurationSec ?? 1.2;
    this.staggerGraceRemainingSec = 0;
    this.emergencyCapacitorRecoveryAmount = options.emergencyCapacitorRecoveryAmount ?? 18;
    this.emergencyRecoveriesTriggered = 0;
  }

  auditCombatLoadoutFairness(combatState = {}) {
    const energy = Number(combatState.energy ?? 0);
    const wristbladesDurability = Number(combatState.wristbladesDurability ?? 100);
    const rangedAmmo = Number(combatState.rangedAmmo ?? 0);

    if (energy <= 0 && wristbladesDurability <= 0 && rangedAmmo <= 0) {
      this.emergencyRecoveriesTriggered += 1;
      audioSynth.playAntiSoftlockEmergencyCapacitorPulse?.();
      return {
        softlockDetected: true,
        remedyApplied: 'emergency_capacitor_and_xeno_bone_dagger',
        restoredEnergy: this.emergencyCapacitorRecoveryAmount,
        fallbackMeleeWeapon: 'celtic_xenomorph_bone_dagger',
        acidImmuneFallback: true,
        emergencyRecoveriesTriggered: this.emergencyRecoveriesTriggered
      };
    }

    return {
      softlockDetected: false,
      remedyApplied: null,
      restoredEnergy: energy,
      fallbackMeleeWeapon: combatState.equippedMelee ?? 'wristblades'
    };
  }

  evaluateIncomingHeavyKnockdown(damagePayload = {}) {
    const incomingKnockdown = Boolean(damagePayload.causesHeavyKnockdown);
    const baseDamage = Number(damagePayload.damage ?? 15);

    if (!incomingKnockdown) {
      return {
        knockdownApplied: false,
        damageTaken: baseDamage,
        staggerGraceActive: this.staggerGraceRemainingSec > 0
      };
    }

    if (this.staggerGraceRemainingSec > 0) {
      audioSynth.playStaggerGraceShieldResonanceHum?.();
      return {
        knockdownApplied: false,
        stunlockPrevented: true,
        damageTaken: Math.round(baseDamage * 0.65),
        staggerGraceRemainingSec: Number(this.staggerGraceRemainingSec.toFixed(2))
      };
    }

    this.staggerGraceRemainingSec = this.staggerGraceDurationSec;
    return {
      knockdownApplied: true,
      stunlockPrevented: false,
      damageTaken: baseDamage,
      staggerGraceRemainingSec: this.staggerGraceRemainingSec
    };
  }

  update(dt = 0.016) {
    if (this.staggerGraceRemainingSec > 0) {
      this.staggerGraceRemainingSec = Math.max(0, this.staggerGraceRemainingSec - dt);
    }
    return {
      staggerGraceActive: this.staggerGraceRemainingSec > 0,
      staggerGraceRemainingSec: Number(this.staggerGraceRemainingSec.toFixed(2))
    };
  }
}
