// Filet Laser de Plafond & Découpe de Couloir (AVP / Stargazer Vault — Lore 1:1)
// Référence canonique : AVP & Stargazer Security — Le treillis laser énergétique descendant du plafond d'un couloir confiné pour trancher toute unité n'effectuant pas une glissade basse d'esquive.

import { audioSynth } from '../AudioSynthesizer.js';

export const CEILING_TRELLIS_CONSTANTS = {
  TRELLIS_DICE_DAMAGE: 240,          // Dégâts de découpe thermique par le treillis laser
  SLIDE_EVASION_CLEARANCE_M: 0.9,    // Hauteur sous laquelle une glissade esquive le filet
};

export function createCeilingLaserTrellisState() {
  return {
    isDropped: false,
    slicedTargetsCount: 0,
  };
}

export function dropCorridorLaserTrellis(state, actorsInCorridor = [], audio = audioSynth) {
  if (!state || state.isDropped) {
    return { dropped: false, slicedCount: 0 };
  }

  state.isDropped = true;

  if (audio && typeof audio.playCeilingLaserTrellisDropHum === 'function') {
    audio.playCeilingLaserTrellisDropHum();
  }

  let slicedCount = 0;
  if (Array.isArray(actorsInCorridor)) {
    for (const actor of actorsInCorridor) {
      if (!actor) continue;

      if (actor.isSlidingLow) {
        actor.evadedLaserTrellis = true;
        continue;
      }

      actor.isSlicedByTrellis = true;
      slicedCount++;
      state.slicedTargetsCount++;

      if (audio && typeof audio.playLaserTrellisCorridorDiceSizzle === 'function') {
        audio.playLaserTrellisCorridorDiceSizzle();
      }

      if (typeof actor.takeDamage === 'function') {
        actor.takeDamage(CEILING_TRELLIS_CONSTANTS.TRELLIS_DICE_DAMAGE);
      } else if (typeof actor.health === 'number') {
        actor.health = Math.max(0, actor.health - CEILING_TRELLIS_CONSTANTS.TRELLIS_DICE_DAMAGE);
      }
    }
  }

  return {
    dropped: true,
    slicedCount,
  };
}
