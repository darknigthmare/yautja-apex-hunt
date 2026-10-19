// Arène d'Épreuve d'Initiation des Jeunes Sangs & Colonnes Mouvantes (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — La salle d'épreuve de la pyramide antarctique où les colonnes monolithiques gravées de hiéroglyphes coulissent toutes les 10 minutes pour reconfigurer le labyrinthe et les lignes de tir.

import { audioSynth } from '../AudioSynthesizer.js';

export const SHIFTING_PILLAR_CONSTANTS = {
  SHIFT_CYCLE_INTERVAL_SEC: 10.0,    // Intervalle de reconfiguration mécanique en combat
  PILLAR_PINCH_CRUSH_DAMAGE: 300,    // Dégâts d'écrasement entre deux piliers en mouvement
};

export function createShiftingPillarArenaState() {
  return {
    layoutIndex: 0,
    cycleTimerSec: 0,
    totalShiftsCount: 0,
    lineOfSightBlocked: false,
  };
}

export function triggerArenaPillarShift(state, actorsBetweenPillars = [], audio = audioSynth) {
  if (!state) return { shifted: false, crushedCount: 0 };

  state.layoutIndex = (state.layoutIndex + 1) % 4;
  state.totalShiftsCount++;
  state.lineOfSightBlocked = state.layoutIndex % 2 === 1;

  if (audio) {
    if (typeof audio.playPyramidHieroglyphPillarGrind === 'function') {
      audio.playPyramidHieroglyphPillarGrind();
    }
    if (typeof audio.playShiftingPillarStoneLockThud === 'function') {
      audio.playShiftingPillarStoneLockThud();
    }
  }

  let crushedCount = 0;
  if (Array.isArray(actorsBetweenPillars)) {
    for (const actor of actorsBetweenPillars) {
      if (!actor || !actor.isInPillarSlideTrack) continue;
      actor.isCrushedByStonePillar = true;
      crushedCount++;

      if (typeof actor.takeDamage === 'function') {
        actor.takeDamage(SHIFTING_PILLAR_CONSTANTS.PILLAR_PINCH_CRUSH_DAMAGE);
      } else if (typeof actor.health === 'number') {
        actor.health = Math.max(0, actor.health - SHIFTING_PILLAR_CONSTANTS.PILLAR_PINCH_CRUSH_DAMAGE);
      }
    }
  }

  return {
    shifted: true,
    newLayoutIndex: state.layoutIndex,
    crushedCount,
  };
}
