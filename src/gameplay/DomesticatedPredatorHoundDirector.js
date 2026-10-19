// Directeur de Compagnon Molosse Modifié Apprivoisé (The Predator 2018 — Lore 1:1)
// Référence canonique : The Predator (2018) — Le Predator Hound apprivoisé par McKenna rapportant des armes et protégeant les flancs

import { audioSynth } from '../AudioSynthesizer.js';

export const DOMESTIC_HOUND_CONSTANTS = {
  RUN_SPEED: 11.2,                     // Vitesse de course du molosse allié (m/s)
  PIN_STAGGER_DURATION: 2.2,           // Durée d'immobilisation de la proie plaquée (s)
  HEEL_DISTANCE: 2.8,                  // Distance de suivi au pied du maître (m)
  COMMAND_COOLDOWN: 3.5,               // Délai de rappel au sifflet (s)
};

export function createDomesticatedHoundState(initialPos = { x: 0, z: -2.5 }) {
  return {
    hound: {
      id: 'domestic_predator_hound',
      species: 'domesticated_hound',
      x: initialPos.x || 0,
      z: initialPos.z || -2.5,
      health: 320.0,
      mode: 'HEEL',                    // 'HEEL', 'FETCH', 'PIN'
      targetItem: null,
      targetEnemy: null,
      retrievedItemType: null,
    },
    cooldownTimer: 0.0,
    itemsFetchedCount: 0,
  };
}

export function commandHoundFetch(state, lootItem, audio = audioSynth) {
  if (!state || !state.hound || state.cooldownTimer > 0 || !lootItem) return false;

  state.hound.mode = 'FETCH';
  state.hound.targetItem = lootItem;
  state.cooldownTimer = DOMESTIC_HOUND_CONSTANTS.COMMAND_COOLDOWN;

  if (audio && typeof audio.playModifiedHoundWhistlePipe === 'function') {
    audio.playModifiedHoundWhistlePipe();
  }

  return true;
}

export function commandHoundPin(state, enemyTarget, audio = audioSynth) {
  if (!state || !state.hound || state.cooldownTimer > 0 || !enemyTarget) return false;

  state.hound.mode = 'PIN';
  state.hound.targetEnemy = enemyTarget;
  state.cooldownTimer = DOMESTIC_HOUND_CONSTANTS.COMMAND_COOLDOWN;

  if (audio && typeof audio.playModifiedHoundWhistlePipe === 'function') {
    audio.playModifiedHoundWhistlePipe();
  }

  return true;
}

export function updateDomesticatedHound(state, delta, masterPos = { x: 0, z: 0 }, audio = audioSynth) {
  if (!state || !state.hound) return;
  const dt = Math.max(0, Number(delta) || 0);
  const h = state.hound;

  if (state.cooldownTimer > 0) {
    state.cooldownTimer = Math.max(0, state.cooldownTimer - dt);
  }

  const mx = masterPos.x || 0;
  const mz = masterPos.z || 0;

  if (h.mode === 'HEEL') {
    const dx = mx - h.x;
    const dz = mz - h.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > DOMESTIC_HOUND_CONSTANTS.HEEL_DISTANCE) {
      h.x += (dx / dist) * DOMESTIC_HOUND_CONSTANTS.RUN_SPEED * dt;
      h.z += (dz / dist) * DOMESTIC_HOUND_CONSTANTS.RUN_SPEED * dt;
    }
  } else if (h.mode === 'FETCH' && h.targetItem) {
    const ix = h.targetItem.x || 0;
    const iz = h.targetItem.z || 0;
    const dx = ix - h.x;
    const dz = iz - h.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist <= DOMESTIC_HOUND_CONSTANTS.RUN_SPEED * dt || dist <= 1.6) {
      // Objet récupéré dans la gueule
      h.x = ix;
      h.z = iz;
      h.retrievedItemType = h.targetItem.type || 'plasma_cell';
      state.itemsFetchedCount++;
      h.targetItem = null;
      h.mode = 'HEEL';

      if (audio && typeof audio.playModifiedHoundFetchBark === 'function') {
        audio.playModifiedHoundFetchBark();
      }
    } else {
      h.x += (dx / dist) * DOMESTIC_HOUND_CONSTANTS.RUN_SPEED * dt;
      h.z += (dz / dist) * DOMESTIC_HOUND_CONSTANTS.RUN_SPEED * dt;
    }
  } else if (h.mode === 'PIN' && h.targetEnemy) {
    const ex = h.targetEnemy.x ?? (h.targetEnemy.position ? h.targetEnemy.position.x : 0);
    const ez = h.targetEnemy.z ?? (h.targetEnemy.position ? h.targetEnemy.position.z : 0);
    const dx = ex - h.x;
    const dz = ez - h.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist <= DOMESTIC_HOUND_CONSTANTS.RUN_SPEED * dt || dist <= 1.6) {
      h.x = ex;
      h.z = ez;
      h.targetEnemy.isPinned = true;
      h.targetEnemy.staggerTimer = DOMESTIC_HOUND_CONSTANTS.PIN_STAGGER_DURATION;
      h.mode = 'HEEL';
      h.targetEnemy = null;

      if (audio && typeof audio.playModifiedHoundFetchBark === 'function') {
        audio.playModifiedHoundFetchBark();
      }
    } else {
      h.x += (dx / dist) * DOMESTIC_HOUND_CONSTANTS.RUN_SPEED * dt;
      h.z += (dz / dist) * DOMESTIC_HOUND_CONSTANTS.RUN_SPEED * dt;
    }
  }
}
