// Fosse d'Acide Moléculaire par Fusion de Plancher (AVP 2004 / Aliens — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) & Aliens — Le sang acide hautement concentré d'un Xénomorphe ou de la Reine faisant fondre les grilles métalliques et la pierre pour ouvrir une brèche mortelle vers l'étage inférieur.

import { audioSynth } from '../AudioSynthesizer.js';

export const ACID_FLOOR_MELT_CONSTANTS = {
  MELT_HOLE_RADIUS_M: 3.0,           // Rayon de la brèche creusée par l'acide
  ACID_PIT_FALL_DAMAGE: 180,         // Dégâts de chute et brûlure acide à travers le plancher fondu
};

export function createAcidFloorMeltSectorState() {
  return {
    meltedBreaches: [],
    fallenVictimsCount: 0,
  };
}

export function spillAcidAndMeltFloor(state, position = { x: 0, z: 0 }, audio = audioSynth) {
  if (!state) return false;

  if (audio && typeof audio.playAcidBloodFloorMeltSizzle === 'function') {
    audio.playAcidBloodFloorMeltSizzle();
  }

  state.meltedBreaches.push({
    x: position.x || 0,
    z: position.z || 0,
    radius: ACID_FLOOR_MELT_CONSTANTS.MELT_HOLE_RADIUS_M,
  });

  return true;
}

export function evaluateMeltedFloorCollapse(state, actor) {
  if (!state || !actor || !Array.isArray(state.meltedBreaches)) {
    return { fellThrough: false };
  }

  for (const breach of state.meltedBreaches) {
    const dist = Math.hypot((actor.x || 0) - breach.x, (actor.z || 0) - breach.z);
    if (dist <= breach.radius) {
      actor.fellThroughMeltedFloor = true;
      state.fallenVictimsCount++;

      if (typeof actor.takeDamage === 'function') {
        actor.takeDamage(ACID_FLOOR_MELT_CONSTANTS.ACID_PIT_FALL_DAMAGE);
      } else if (typeof actor.health === 'number') {
        actor.health = Math.max(0, actor.health - ACID_FLOOR_MELT_CONSTANTS.ACID_PIT_FALL_DAMAGE);
      }

      return {
        fellThrough: true,
        damageDealt: ACID_FLOOR_MELT_CONSTANTS.ACID_PIT_FALL_DAMAGE,
      };
    }
  }

  return { fellThrough: false };
}
