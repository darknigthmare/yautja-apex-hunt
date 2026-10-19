// Hommage d'Ancien Greyback & Relique du Pistolet à Silex Raphael Adolini 1715 (Predator 2 / Prey 2022 — Lore 1:1)
// Référence canonique : Predator 2 (1990) & Prey (2022) — L'Ancien Greyback de la Lost Tribe remettant le pistolet à silex gravé « Raphael Adolini 1715 » en reconnaissance d'une victoire singulière en combat loyal.

import { audioSynth } from '../AudioSynthesizer.js';

export const ADOLINI_TROPHY_CONSTANTS = {
  ELDER_HONOR_BESTOWED: 500,         // Prestige suprême accordé par le Conseil des Anciens
  LOST_TRIBE_TRUCE_ACTIVE: true,     // Les membres de la Lost Tribe saluent le vainqueur sans l'attaquer
};

export function createAdoliniFlintlockTrophyState() {
  return {
    isRelicBestowed: false,
    inscribedYear: 1715,
    inscribedName: 'Raphael Adolini',
    honorTotal: 0,
  };
}

export function bestowElderAdoliniFlintlockTrophy(state, victorEntity, audio = audioSynth) {
  if (!state || !victorEntity || state.isRelicBestowed) {
    return { bestowed: false };
  }

  state.isRelicBestowed = true;
  state.honorTotal += ADOLINI_TROPHY_CONSTANTS.ELDER_HONOR_BESTOWED;

  victorEntity.hasAdolini1715Flintlock = true;
  victorEntity.isProtectedByElderTruce = ADOLINI_TROPHY_CONSTANTS.LOST_TRIBE_TRUCE_ACTIVE;
  victorEntity.honorScore = (victorEntity.honorScore || 0) + ADOLINI_TROPHY_CONSTANTS.ELDER_HONOR_BESTOWED;

  if (audio) {
    if (typeof audio.playAdoliniFlintlockTrophyPresentChime === 'function') {
      audio.playAdoliniFlintlockTrophyPresentChime();
    }
    if (typeof audio.playElderTribeRespectVocalClicking === 'function') {
      audio.playElderTribeRespectVocalClicking();
    }
  }

  return {
    bestowed: true,
    inscription: `${state.inscribedName} ${state.inscribedYear}`,
    honorGranted: ADOLINI_TROPHY_CONSTANTS.ELDER_HONOR_BESTOWED,
  };
}
