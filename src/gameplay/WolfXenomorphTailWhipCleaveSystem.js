// Fouet Caudal Articulé en Vertèbres de Xénomorphe & Cisaillement (AVP:R 2007 — Lore 1:1)
// Référence canonique : Aliens vs. Predator: Requiem (2007) — Wolf utilisant son fouet barbelé façonné dans une queue de Xénomorphe pour enrouler et sectionner en deux un Alien dans les égouts sans craindre le sang acide.

import { audioSynth } from '../AudioSynthesizer.js';

export const TAIL_WHIP_CONSTANTS = {
  MAX_LASH_RANGE_M: 9.0,             // Portée de frappe et d'enroulement du fouet caudal
  INITIAL_LASH_DAMAGE: 75,           // Dégâts de claquement initial des vertèbres tranchantes
  CLEAVE_BISECTION_DAMAGE: 190,      // Dégâts de cisaillement lors de la traction brutale
};

export function createTailWhipState() {
  return {
    isUnfurled: false,
    wrappedTarget: null,
    totalBisections: 0,
  };
}

export function unfurlAndLashTailWhip(state, target, distance = 5.0, audio = audioSynth) {
  if (!state || !target || distance > TAIL_WHIP_CONSTANTS.MAX_LASH_RANGE_M) {
    return { wrapped: false };
  }

  state.isUnfurled = true;
  state.wrappedTarget = target;

  if (audio && typeof audio.playXenomorphTailWhipUnfurlCrack === 'function') {
    audio.playXenomorphTailWhipUnfurlCrack();
  }

  target.isWhipWrapped = true;
  target.canMove = false;

  if (typeof target.takeDamage === 'function') {
    target.takeDamage(TAIL_WHIP_CONSTANTS.INITIAL_LASH_DAMAGE);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - TAIL_WHIP_CONSTANTS.INITIAL_LASH_DAMAGE);
  }

  return {
    wrapped: true,
    damageDealt: TAIL_WHIP_CONSTANTS.INITIAL_LASH_DAMAGE,
  };
}

export function executeWhipVertebraeCleave(state, audio = audioSynth) {
  if (!state || !state.wrappedTarget) {
    return { cleaved: false };
  }

  const target = state.wrappedTarget;

  if (audio && typeof audio.playTailWhipVertebraeCleaveSnap === 'function') {
    audio.playTailWhipVertebraeCleaveSnap();
  }

  target.isBisectedByWhip = true;
  target.isWhipWrapped = false;

  if (typeof target.takeDamage === 'function') {
    target.takeDamage(TAIL_WHIP_CONSTANTS.CLEAVE_BISECTION_DAMAGE);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - TAIL_WHIP_CONSTANTS.CLEAVE_BISECTION_DAMAGE);
  }

  state.wrappedTarget = null;
  state.totalBisections++;

  return {
    cleaved: true,
    damageDealt: TAIL_WHIP_CONSTANTS.CLEAVE_BISECTION_DAMAGE,
    acidCorrosion: 0,
  };
}
