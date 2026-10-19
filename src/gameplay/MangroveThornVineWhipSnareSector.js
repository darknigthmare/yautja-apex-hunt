// Piège de Lianes Barbelées de Mangrove & Hissage en Canopée (Predator 1987 — Lore 1:1)
// Référence canonique : Predator (1987) — Les collets végétaux tendus dans la jungle de Val Verde qui fouettent la proie avec des lianes épineuses et la suspendent brusquement sous la frondaison.

import { audioSynth } from '../AudioSynthesizer.js';

export const MANGROVE_SNARE_CONSTANTS = {
  TRIGGER_RADIUS_M: 2.2,             // Rayon de déclenchement du collet au sol
  WHIP_LACERATION_DAMAGE: 85,        // Dégâts de lacération des épines de mangrove
  CANOPY_HOIST_HEIGHT_M: 6.5,        // Hauteur de suspension dans les arbres
};

export function createMangroveSnareSectorState() {
  return {
    vineSnares: [],
    hoistedVictimsCount: 0,
  };
}

export function rigMangroveThornSnare(state, position = { x: 0, z: 0 }) {
  if (!state) return false;
  state.vineSnares.push({
    x: position.x || 0,
    z: position.z || 0,
    triggered: false,
  });
  return true;
}

export function evaluateMangroveSnareTrigger(state, actor, audio = audioSynth) {
  if (!state || !actor || !Array.isArray(state.vineSnares)) {
    return { snared: false };
  }

  for (const snare of state.vineSnares) {
    if (snare.triggered) continue;
    const dist = Math.hypot((actor.x || 0) - snare.x, (actor.z || 0) - snare.z);

    if (dist <= MANGROVE_SNARE_CONSTANTS.TRIGGER_RADIUS_M) {
      snare.triggered = true;
      state.hoistedVictimsCount++;

      if (audio) {
        if (typeof audio.playMangroveVineWhipSnap === 'function') {
          audio.playMangroveVineWhipSnap();
        }
        if (typeof audio.playThornVineCanopyHoistCreak === 'function') {
          audio.playThornVineCanopyHoistCreak();
        }
      }

      actor.isHoistedInCanopy = true;
      actor.canMove = false;
      actor.y = MANGROVE_SNARE_CONSTANTS.CANOPY_HOIST_HEIGHT_M;

      if (typeof actor.takeDamage === 'function') {
        actor.takeDamage(MANGROVE_SNARE_CONSTANTS.WHIP_LACERATION_DAMAGE);
      } else if (typeof actor.health === 'number') {
        actor.health = Math.max(0, actor.health - MANGROVE_SNARE_CONSTANTS.WHIP_LACERATION_DAMAGE);
      }

      return {
        snared: true,
        hoistedHeight: MANGROVE_SNARE_CONSTANTS.CANOPY_HOIST_HEIGHT_M,
      };
    }
  }

  return { snared: false };
}
