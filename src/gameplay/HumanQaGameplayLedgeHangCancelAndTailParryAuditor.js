import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 9 + Audit Testeur Humain QA #4 (v158) — Persona "Speedrunner & Combattant : Suspension aux Mains & Parade Croisée de Queue"
 * Élimine deux rigidités de gameplay majeures :
 * 1. Descente contrôlée depuis haute branche (Drop-Down Hang) : s'accrocher aux mains sous la corniche pour réduire la hauteur de chute effective de 2,4 mètres, éliminant les dégâts de saut lourd.
 * 2. Parade croisée des Wristblades (Cross-Blades Guard-Break) : intercepte le fouet caudal perforant d'un Xénomorphe par croisement en X des lames doubles, étourdissant la créature.
 */
export class HumanQaGameplayLedgeHangCancelAndTailParryAuditor {
  constructor(options = {}) {
    this.armExtensionHeightMeters = options.armExtensionHeightMeters ?? 2.4;
    this.crossParryTimingToleranceSec = options.crossParryTimingToleranceSec ?? 0.16;
  }

  initiateLedgeHangDropDown(hunterState = {}, initialBranchElevationMeters = 8.0) {
    hunterState.hangingFromLedge = true;
    const effectiveDropHeightMeters = Math.max(0, initialBranchElevationMeters - this.armExtensionHeightMeters);
    const fallDamageAvoided = effectiveDropHeightMeters <= 5.8;

    return {
      hangingFromLedge: true,
      armExtensionHeightMeters: this.armExtensionHeightMeters,
      effectiveDropHeightMeters: Number(effectiveDropHeightMeters.toFixed(2)),
      fallDamageAvoided
    };
  }

  evaluateXenomorphTailWhipParry(tailAttackEvent = {}, parryTimingDeltaSec = 0.08) {
    const absTiming = Math.abs(Number(parryTimingDeltaSec) || 0);

    if (absTiming <= this.crossParryTimingToleranceSec) {
      audioSynth.playCrossBladesGuardBreakDeflectRing?.();
      return {
        crossParrySuccessful: true,
        guardBreakApplied: true,
        xenomorphStunnedSec: 1.8,
        acidSplashPrevented: true,
        damageTaken: 0
      };
    }

    return {
      crossParrySuccessful: false,
      guardBreakApplied: false,
      damageTaken: Number(tailAttackEvent.damage ?? 55)
    };
  }
}
