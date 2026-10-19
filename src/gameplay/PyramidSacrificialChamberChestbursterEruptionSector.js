// Chambre Sacrificielle de la Pyramide & Éclosion Synchronisée de Chestbursters (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — La salle des autels sacrificiels au cœur de la pyramide antarctique où les hôtes immobilisés donnent naissance aux Chestbursters.

import { audioSynth } from '../AudioSynthesizer.js';

export const SACRIFICIAL_ALTAR_CONSTANTS = {
  INCUBATION_DURATION_SEC: 4.0,      // Durée avant rupture de la cage thoracique de l'hôte
  BURSTER_SPRINT_SPEED: 9.5,         // Vélocité de fuite furtive du Chestburster
  MATURATION_TIME_SEC: 6.0,          // Temps avant mue en Drone Xénomorphe adulte
};

export function createSacrificialChamberState() {
  return {
    sacrificialSlabs: [],
    activeChestbursters: [],
    maturedDronesCount: 0,
  };
}

export function registerSacrificialHostSlab(state, slabId, position = { x: 0, z: 0 }) {
  if (!state) return false;
  state.sacrificialSlabs.push({
    id: slabId || `slab_${state.sacrificialSlabs.length + 1}`,
    x: position.x || 0,
    z: position.z || 0,
    incubationElapsed: 0,
    erupted: false,
  });
  return true;
}

export function updateSacrificialIncubation(state, dt, audio = audioSynth) {
  if (!state || dt <= 0) return { newlyErupted: 0, newlyMaturedDrones: 0 };

  let newlyErupted = 0;
  let newlyMaturedDrones = 0;

  for (const slab of state.sacrificialSlabs) {
    if (slab.erupted) continue;
    slab.incubationElapsed += dt;

    if (slab.incubationElapsed >= SACRIFICIAL_ALTAR_CONSTANTS.INCUBATION_DURATION_SEC) {
      slab.erupted = true;
      newlyErupted++;

      if (audio) {
        if (typeof audio.playSacrificialSlabRibCrack === 'function') {
          audio.playSacrificialSlabRibCrack();
        }
        if (typeof audio.playChestbursterScreechScurry === 'function') {
          audio.playChestbursterScreechScurry();
        }
      }

      state.activeChestbursters.push({
        originSlabId: slab.id,
        x: slab.x,
        z: slab.z,
        speed: SACRIFICIAL_ALTAR_CONSTANTS.BURSTER_SPRINT_SPEED,
        maturationElapsed: 0,
        matured: false,
      });
    }
  }

  for (const burster of state.activeChestbursters) {
    if (burster.matured) continue;
    burster.maturationElapsed += dt;
    if (burster.maturationElapsed >= SACRIFICIAL_ALTAR_CONSTANTS.MATURATION_TIME_SEC) {
      burster.matured = true;
      newlyMaturedDrones++;
      state.maturedDronesCount++;
    }
  }

  return {
    newlyErupted,
    newlyMaturedDrones,
  };
}
