import { audioSynth } from '../AudioSynthesizer.js';

/**
 * Chantier 9 + Audit Testeur Humain QA #4 (v154) — Persona "Speedrunner / Joueur Action Nerveux : Input Buffering, Coyote Time & Soin Anti-Micro-Cancel"
 * Élimine trois frustrations majeures de réactivité manette/clavier :
 * 1. *Input Buffering* (`150 ms`) : mémorise une commande d'esquive, de parade ou de coup de Wristblades pressée juste avant la fin d'une animation de récupération (*recovery*) et l'exécute à la première frame libre.
 * 2. *Coyote Time de Canopée* (`120 ms`) : autorise le bond Yautja pendant `120 ms` après avoir quitté l'extrémité d'une branche d'arbre ou d'une corniche.
 * 3. *Tolérance de Micro-Mouvement du Medi-Kit* : empêche un infime déplacement parasite (`<= 0.25 m`) d'annuler la canalisation de cautérisation médicale.
 */
export class HumanQaGameplayInputBufferAndCoyoteTimeAuditor {
  constructor(options = {}) {
    this.bufferWindowSec = options.bufferWindowSec ?? 0.15;
    this.coyoteWindowSec = options.coyoteWindowSec ?? 0.12;
    this.medikitMicroMoveToleranceMeters = options.medikitMicroMoveToleranceMeters ?? 0.25;
    this.bufferedAction = null;
  }

  queueActionInput(actionName, remainingRecoverySec = 0) {
    if (remainingRecoverySec <= 0) {
      return { executedImmediately: true, buffered: false, actionName };
    }

    if (remainingRecoverySec <= this.bufferWindowSec) {
      this.bufferedAction = {
        actionName,
        ttlSec: this.bufferWindowSec
      };
      return {
        executedImmediately: false,
        buffered: true,
        actionName,
        executesInSec: Number(remainingRecoverySec.toFixed(3))
      };
    }

    return { executedImmediately: false, buffered: false, reason: 'outside_buffer_window' };
  }

  consumeBufferedActionOnRecoveryEnd() {
    if (!this.bufferedAction) return { consumed: false, actionName: null };
    const actionName = this.bufferedAction.actionName;
    this.bufferedAction = null;
    audioSynth.playInputBufferQueuedActionSnap?.();
    return { consumed: true, actionName };
  }

  canExecuteCanopyJump(jumpState = {}) {
    const onBranch = Boolean(jumpState.onBranchOrLedge);
    const timeSinceLeftLedgeSec = Number(jumpState.timeSinceLeftLedgeSec ?? 1.0);

    if (onBranch) {
      return { jumpAllowed: true, viaCoyoteTime: false };
    }
    if (timeSinceLeftLedgeSec <= this.coyoteWindowSec) {
      audioSynth.playInputBufferQueuedActionSnap?.();
      return { jumpAllowed: true, viaCoyoteTime: true, timeSinceLeftLedgeSec };
    }
    return { jumpAllowed: false, viaCoyoteTime: false };
  }

  shouldCancelMedikitChannel(channelState = {}) {
    const tookDirectDamage = Boolean(channelState.tookDirectDamage);
    const displacementMeters = Number(channelState.displacementMeters ?? 0);

    if (tookDirectDamage) {
      return { cancelled: true, reason: 'direct_damage_interruption' };
    }
    if (displacementMeters > this.medikitMicroMoveToleranceMeters) {
      return { cancelled: true, reason: 'intentional_sprint_cancel' };
    }
    return {
      cancelled: false,
      preservedAgainstMicroJitter: true
    };
  }
}
