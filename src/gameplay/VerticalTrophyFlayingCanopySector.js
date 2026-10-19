// Secteur de Trophées Écorchés Suspendus en Canopée et Terreur Psychologique (Predator 1987 — Lore 1:1)
// Référence canonique : Predator (1987) — Le commando de Hopper pendu par les pieds dans la canopée de Val Verde, totalement écorché, provoquant la panique et des tirs aveugles des patrouilles.

import { audioSynth } from '../AudioSynthesizer.js';

export const FLAYING_SECTOR_CONSTANTS = {
  HORROR_DISCOVERY_RADIUS: 12.0,       // Rayon de découverte visuelle des corps suspendus
  TERROR_DURATION_SEC: 6.0,            // Durée de la panique et tirs aveugles
  ACCURACY_PENALTY_PANIC: 0.65,        // Perte critique de précision lors des tirs paniqués
};

export function createFlayingCanopySectorState() {
  return {
    hangingTrophies: [], // Array of { id, x, y, z, victimName, isDiscovered }
    totalPanickedEnemies: 0,
  };
}

export function hangFlayedTrophy(state, branchPos = { x: 0, y: 8.0, z: 0 }, victimName = 'Green_Beret_Hopper', audio = audioSynth) {
  if (!state || !branchPos) return null;

  if (audio && typeof audio.playCanopyHangingCorpseCreak === 'function') {
    audio.playCanopyHangingCorpseCreak();
  }

  const trophyId = `trophy_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const trophy = {
    id: trophyId,
    x: branchPos.x || 0,
    y: branchPos.y || 8.0,
    z: branchPos.z || 0,
    victimName,
    isDiscovered: false,
  };

  state.hangingTrophies.push(trophy);

  return {
    success: true,
    trophy,
  };
}

export function evaluatePatrolHorrorEncounter(state, patrolUnit, audio = audioSynth) {
  if (!state || !patrolUnit || patrolUnit.isPanicking) return { panicked: false };

  const unitX = patrolUnit.x ?? 0;
  const unitZ = patrolUnit.z ?? 0;

  for (const trophy of state.hangingTrophies) {
    const dx = trophy.x - unitX;
    const dz = trophy.z - unitZ;
    const dist = Math.hypot(dx, dz);

    if (dist <= FLAYING_SECTOR_CONSTANTS.HORROR_DISCOVERY_RADIUS) {
      trophy.isDiscovered = true;
      patrolUnit.isPanicking = true;
      patrolUnit.panicTimer = FLAYING_SECTOR_CONSTANTS.TERROR_DURATION_SEC;
      patrolUnit.accuracyMultiplier = 1.0 - FLAYING_SECTOR_CONSTANTS.ACCURACY_PENALTY_PANIC;
      state.totalPanickedEnemies++;

      if (audio && typeof audio.playGuerillaPanicShoutSpray === 'function') {
        audio.playGuerillaPanicShoutSpray();
      }

      return {
        panicked: true,
        unitId: patrolUnit.id || 'soldier_patrol',
        discoveredTrophy: trophy.victimName,
        reaction: 'ERRATIC_BLIND_FIRE_CONTACT',
      };
    }
  }

  return { panicked: false };
}

export function updatePatrolTerror(patrolUnits = [], delta = 0.1) {
  for (const unit of patrolUnits) {
    if (unit && unit.isPanicking && unit.panicTimer > 0) {
      unit.panicTimer = Math.max(0, unit.panicTimer - delta);
      if (unit.panicTimer === 0) {
        unit.isPanicking = false;
        unit.accuracyMultiplier = 1.0;
      }
    }
  }
}
