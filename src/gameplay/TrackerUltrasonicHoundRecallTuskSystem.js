// Sifflet Ultrasonique de Défense d'Ivoire & Rappel de Meute du Tracker (Predators 2010 — Lore 1:1)
// Référence canonique : Predators (2010) — Le Tracker Predator émettant un signal ultrasonique strident pour rappeler ses Hell Hounds lorsqu'ils sont pris sous le feu nourri de Royce et son groupe.

import { audioSynth } from '../AudioSynthesizer.js';

export const TRACKER_RECALL_CONSTANTS = {
  ULTRASONIC_RANGE_M: 60.0,          // Portée du signal ultrasonique à travers la jungle
  HOUND_RETREAT_SPEED_BOOST: 1.5,    // +50% de vitesse de repli de la meute
  PACK_REGROUP_HEAL: 40,             // Régénération d'endurance/PV de la meute au regroupement
};

export function createTrackerRecallState() {
  return {
    recallsIssuedCount: 0,
    isPackRegrouped: false,
  };
}

export function soundUltrasonicHoundRecall(state, trackerPos = { x: 0, z: 0 }, hounds = [], audio = audioSynth) {
  if (!state || !Array.isArray(hounds)) {
    return { recalledCount: 0 };
  }

  state.recallsIssuedCount++;
  state.isPackRegrouped = true;

  if (audio && typeof audio.playTrackerTuskUltrasonicWhistle === 'function') {
    audio.playTrackerTuskUltrasonicWhistle();
  }

  let recalledCount = 0;
  for (const hound of hounds) {
    if (!hound || hound.health <= 0) continue;
    hound.tacticalState = 'recalling_to_master';
    hound.speedMultiplier = TRACKER_RECALL_CONSTANTS.HOUND_RETREAT_SPEED_BOOST;
    hound.x = trackerPos.x || 0;
    hound.z = trackerPos.z || 0;
    if (typeof hound.health === 'number') {
      hound.health += TRACKER_RECALL_CONSTANTS.PACK_REGROUP_HEAL;
    }
    recalledCount++;
  }

  return {
    recalledCount,
    isPackRegrouped: state.isPackRegrouped,
  };
}
