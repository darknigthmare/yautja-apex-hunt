// Nid d'Œufs Royaux Ovomorphes & Détection de Mouvement Vibratoire (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Les champs d'Ovomorphes déposés par la Reine Xénomorphe dont les quatre lobes s'écartent au moindre pas non furtif pour projeter un Facehugger.

import { audioSynth } from '../AudioSynthesizer.js';

export const OVOMORPH_HATCH_CONSTANTS = {
  VIBRATION_SENSE_RADIUS_M: 4.5,     // Rayon de détection des vibrations de pas
  CROUCH_STEALTH_BYPASS: true,       // L'approche accroupie furtive évite le déclenchement
  FACEHUGGER_LEAP_SPEED_MPS: 13.0,   // Vélocité de bond du Facehugger à l'éclosion
};

export function createOvomorphHatchSectorState() {
  return {
    ovomorphs: [],
    hatchedCount: 0,
  };
}

export function registerOvomorphEgg(state, eggId, position = { x: 0, z: 0 }) {
  if (!state) return false;
  state.ovomorphs.push({
    id: eggId || `egg_${state.ovomorphs.length + 1}`,
    x: position.x || 0,
    z: position.z || 0,
    isHatched: false,
  });
  return true;
}

export function evaluateOvomorphVibrationProximity(state, actorPos, isCrouchingStealth = false, audio = audioSynth) {
  if (!state || !actorPos || !Array.isArray(state.ovomorphs)) {
    return { hatchedEggs: 0 };
  }

  if (isCrouchingStealth && OVOMORPH_HATCH_CONSTANTS.CROUCH_STEALTH_BYPASS) {
    return { hatchedEggs: 0, bypassedByStealth: true };
  }

  let hatchedEggs = 0;
  for (const egg of state.ovomorphs) {
    if (egg.isHatched) continue;
    const dist = Math.hypot((actorPos.x || 0) - egg.x, (actorPos.z || 0) - egg.z);

    if (dist <= OVOMORPH_HATCH_CONSTANTS.VIBRATION_SENSE_RADIUS_M) {
      egg.isHatched = true;
      hatchedEggs++;
      state.hatchedCount++;

      if (audio) {
        if (typeof audio.playOvomorphPetalUnfoldSlime === 'function') {
          audio.playOvomorphPetalUnfoldSlime();
        }
        if (typeof audio.playFacehuggerHatchSpringLeap === 'function') {
          audio.playFacehuggerHatchSpringLeap();
        }
      }
    }
  }

  return {
    hatchedEggs,
    bypassedByStealth: false,
  };
}
