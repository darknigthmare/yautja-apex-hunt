// Chaînes d'Amarrage Cryogéniques de la Reine Xénomorphe & Précipitation sous la Banquise (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Les lourdes chaînes de retenue de la Reine Xénomorphe attachées par Scar et Lex Woods au château d'eau de la station baleinière pour l'entraîner au fond de l'océan Antarctique.

import { audioSynth } from '../AudioSynthesizer.js';

export const QUEEN_SHACKLE_CONSTANTS = {
  ABYSS_PLUNGE_LETHAL_DAMAGE: 2000,  // Engloutissement fatal dans les abysses polaires
  REQUIRED_SHACKLE_HOOKS: 2,         // Nombre d'ancrages de chaîne requis
};

export function createQueenShackleSectorState() {
  return {
    attachedHooksCount: 0,
    isQueenDraggedToAbyss: false,
  };
}

export function attachQueenCryoChainHook(state, audio = audioSynth) {
  if (!state) return false;
  state.attachedHooksCount++;

  if (audio && typeof audio.playQueenCryoChainShackleClank === 'function') {
    audio.playQueenCryoChainShackleClank();
  }

  return true;
}

export function plungeShackledQueenIntoIceAbyss(state, queenEntity, audio = audioSynth) {
  if (!state || !queenEntity || state.attachedHooksCount < QUEEN_SHACKLE_CONSTANTS.REQUIRED_SHACKLE_HOOKS) {
    return { plunged: false };
  }

  state.isQueenDraggedToAbyss = true;
  queenEntity.isSunkInAntarcticAbyss = true;
  queenEntity.canMove = false;

  if (audio && typeof audio.playAntarcticIceAbyssPlungeSplash === 'function') {
    audio.playAntarcticIceAbyssPlungeSplash();
  }

  if (typeof queenEntity.takeDamage === 'function') {
    queenEntity.takeDamage(QUEEN_SHACKLE_CONSTANTS.ABYSS_PLUNGE_LETHAL_DAMAGE);
  } else if (typeof queenEntity.health === 'number') {
    queenEntity.health = 0;
  }

  return {
    plunged: true,
    queenDefeated: queenEntity.health <= 0,
  };
}
