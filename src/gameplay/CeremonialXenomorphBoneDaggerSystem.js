// Dague Cérémoniale en Os de Xénomorphe & Dépeçage d'Urgence (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Celtic dégainant sa dague cérémoniale taillée dans un os de Xénomorphe insensible à l'acide pour se dégager d'une immobilisation au sol face à Grid Alien.

import { audioSynth } from '../AudioSynthesizer.js';

export const BONE_DAGGER_CONSTANTS = {
  COUNTER_STAB_DAMAGE: 145,          // Dégâts d'estoc perforant la chitine à bout portant
  ACID_IMMUNITY_FACTOR: 1.0,         // 100% d'immunité à la fonte acide de la lame
  SEVER_NET_TIME_SEC: 0.35,          // Temps de coupe d'urgence d'une entrave
};

export function createBoneDaggerState() {
  return {
    isDrawn: false,
    isAcidImmune: true,
    closeQuartersReversals: 0,
  };
}

export function drawCeremonialBoneDagger(state, audio = audioSynth) {
  if (!state) return false;
  state.isDrawn = true;

  if (audio && typeof audio.playBoneDaggerSheathDraw === 'function') {
    audio.playBoneDaggerSheathDraw();
  }

  return true;
}

export function executePinnedCounterStab(state, hunter, pinningXenomorph, audio = audioSynth) {
  if (!state || !state.isDrawn || !hunter || !pinningXenomorph) {
    return { countered: false, damageDealt: 0 };
  }

  if (audio && typeof audio.playCeremonialDaggerChitinStab === 'function') {
    audio.playCeremonialDaggerChitinStab();
  }

  hunter.isPinned = false;
  hunter.canMove = true;

  const damage = BONE_DAGGER_CONSTANTS.COUNTER_STAB_DAMAGE;
  if (typeof pinningXenomorph.takeDamage === 'function') {
    pinningXenomorph.takeDamage(damage);
  } else if (typeof pinningXenomorph.health === 'number') {
    pinningXenomorph.health = Math.max(0, pinningXenomorph.health - damage);
  }

  pinningXenomorph.isStaggeredByDagger = true;
  state.closeQuartersReversals++;

  return {
    countered: true,
    damageDealt: damage,
    bladeCorroded: false,
  };
}
