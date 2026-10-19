// Lanceur d'Éclats de Shrapnel Forgés & Détonation Directionnelle (Prey 2022 — Lore 1:1)
// Référence canonique : Prey (2022) — Les charges de poignet primitives mais dévastatrices du Feral Predator projetant une salve en cône d'éclats métalliques incandescents à courte portée.

import { audioSynth } from '../AudioSynthesizer.js';

export const FORGED_SHRAPNEL_CONSTANTS = {
  CONE_RANGE_M: 7.0,                 // Portée du cône de dispersion métallique
  SHRAPNEL_BURST_DAMAGE: 150,        // Dégâts de criblage à bout portant
  KNOCKBACK_IMPULSE: 8.5,            // Recul cinétique infligé aux cibles touchées
};

export function createForgedShrapnelState() {
  return {
    chargesRemaining: 3,
    totalTargetsShredded: 0,
  };
}

export function fireForgedShrapnelBurst(state, originPos = { x: 0, z: 0 }, targets = [], audio = audioSynth) {
  if (!state || state.chargesRemaining <= 0) {
    return { fired: false, hitCount: 0 };
  }

  state.chargesRemaining--;

  if (audio && typeof audio.playFeralForgedShrapnelConeBlast === 'function') {
    audio.playFeralForgedShrapnelConeBlast();
  }

  let hitCount = 0;
  if (Array.isArray(targets)) {
    for (const target of targets) {
      if (!target) continue;
      const dist = Math.hypot((target.x || 0) - (originPos.x || 0), (target.z || 0) - (originPos.z || 0));
      if (dist <= FORGED_SHRAPNEL_CONSTANTS.CONE_RANGE_M) {
        target.isRiddledWithShrapnel = true;
        hitCount++;
        state.totalTargetsShredded++;

        if (typeof target.takeDamage === 'function') {
          target.takeDamage(FORGED_SHRAPNEL_CONSTANTS.SHRAPNEL_BURST_DAMAGE);
        } else if (typeof target.health === 'number') {
          target.health = Math.max(0, target.health - FORGED_SHRAPNEL_CONSTANTS.SHRAPNEL_BURST_DAMAGE);
        }
      }
    }
  }

  return {
    fired: true,
    hitCount,
    chargesRemaining: state.chargesRemaining,
  };
}
