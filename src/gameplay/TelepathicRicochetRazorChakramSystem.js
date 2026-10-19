// Chakram Anneau Tranchant à Guidage Télécommandé & Rebonds Multiples (AVP / Predator 2 — Lore 1:1)
// Référence canonique : AVP & Predator 2 — L'anneau de coupe monomoléculaire guidé par le gantelet qui ricoche entre jusqu'à 4 cibles consécutives avant de revenir dans la main du chasseur.

import { audioSynth } from '../AudioSynthesizer.js';

export const RAZOR_CHAKRAM_CONSTANTS = {
  MAX_RICOCHET_TARGETS: 4,           // Nombre maximal de cibles frappées en un lancer
  DAMAGE_PER_RICOCHET: 130,          // Dégâts de lacération par rebond
  AUTO_RETURN_SUCCESS: true,         // Retour gyroscopique automatique au gantelet
};

export function createRazorChakramState() {
  return {
    isInHand: true,
    totalRicochetHits: 0,
  };
}

export function launchTelepathicRicochetChakram(state, targets = [], audio = audioSynth) {
  if (!state || !state.isInHand || !Array.isArray(targets) || targets.length === 0) {
    return { launched: false, targetsHitCount: 0 };
  }

  state.isInHand = false;

  if (audio && typeof audio.playRazorChakramGyrationWhir === 'function') {
    audio.playRazorChakramGyrationWhir();
  }

  const maxHits = Math.min(targets.length, RAZOR_CHAKRAM_CONSTANTS.MAX_RICOCHET_TARGETS);
  let targetsHitCount = 0;

  for (let i = 0; i < maxHits; i++) {
    const t = targets[i];
    if (!t) continue;
    t.isSlicedByChakram = true;
    targetsHitCount++;
    state.totalRicochetHits++;

    if (audio && typeof audio.playChakramMultiRicochetClang === 'function') {
      audio.playChakramMultiRicochetClang();
    }

    if (typeof t.takeDamage === 'function') {
      t.takeDamage(RAZOR_CHAKRAM_CONSTANTS.DAMAGE_PER_RICOCHET);
    } else if (typeof t.health === 'number') {
      t.health = Math.max(0, t.health - RAZOR_CHAKRAM_CONSTANTS.DAMAGE_PER_RICOCHET);
    }
  }

  state.isInHand = RAZOR_CHAKRAM_CONSTANTS.AUTO_RETURN_SUCCESS;

  return {
    launched: true,
    targetsHitCount,
    returnedToHand: state.isInHand,
  };
}
