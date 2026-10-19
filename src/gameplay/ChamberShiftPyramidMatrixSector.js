// Secteur de Niveau : Labyrinthe Mouvant de la Pyramide de Bouvetøya (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Les parois mégalithiques de la pyramide se réorganisent cycliquement sur contrepoids

import { audioSynth } from '../AudioSynthesizer.js';

export const PYRAMID_SHIFT_CONSTANTS = {
  SHIFT_CYCLE_INTERVAL: 25.0,          // Intervalle de reconfiguration du labyrinthe (s)
  SLAB_MOVE_DURATION: 3.0,             // Durée du coulissement des dalles (s)
  CRUSH_DAMAGE: 260.0,                 // Écrasement létal si pris en étau entre deux blocs
  SLAB_PINCH_RADIUS: 1.5,
};

export function createPyramidMatrixSectorState() {
  return {
    cycleTimer: PYRAMID_SHIFT_CONSTANTS.SHIFT_CYCLE_INTERVAL,
    isShifting: false,
    shiftProgress: 0.0,
    shiftsExecuted: 0,
    slabs: [
      { id: 'slab_antechamber_01', x: -6.0, z: -15.0, isClosed: false, isMoving: false },
      { id: 'slab_sacrificial_02', x: 6.0,  z: -25.0, isClosed: true,  isMoving: false },
      { id: 'slab_corridor_03',    x: 0.0,  z: -35.0, isClosed: false, isMoving: false },
    ],
    isolatedEntitiesCount: 0,
  };
}

export function triggerPyramidShift(state, audio = audioSynth) {
  if (!state || state.isShifting) return false;

  state.isShifting = true;
  state.shiftProgress = 0.0;
  state.shiftsExecuted++;

  for (const slab of state.slabs) {
    slab.isMoving = true;
  }

  if (audio && typeof audio.playPyramidSlabSlideGrind === 'function') {
    audio.playPyramidSlabSlideGrind();
  }

  return true;
}

export function updatePyramidMatrixSector(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (!state.isShifting) {
    state.cycleTimer -= dt;
    if (state.cycleTimer <= 0) {
      state.cycleTimer = PYRAMID_SHIFT_CONSTANTS.SHIFT_CYCLE_INTERVAL;
      triggerPyramidShift(state, audio);
    }
  } else {
    state.shiftProgress += dt;

    if (state.shiftProgress >= PYRAMID_SHIFT_CONSTANTS.SLAB_MOVE_DURATION) {
      state.isShifting = false;
      state.shiftProgress = 0.0;

      // Inversion de l'état des dalles coulissantes
      for (const slab of state.slabs) {
        slab.isClosed = !slab.isClosed;
        slab.isMoving = false;
      }
    }

    // Risque d'écrasement pour les entités stationnant sous les dalles en mouvement
    for (const slab of state.slabs) {
      if (!slab.isMoving) continue;

      for (const ent of entities) {
        if (!ent || ent.isDead) continue;
        const ex = ent.x ?? (ent.position ? ent.position.x : 0);
        const ez = ent.z ?? (ent.position ? ent.position.z : 0);
        const dx = ex - slab.x;
        const dz = ez - slab.z;

        if (Math.sqrt(dx * dx + dz * dz) <= PYRAMID_SHIFT_CONSTANTS.SLAB_PINCH_RADIUS) {
          if (typeof ent.takeDamage === 'function') {
            ent.takeDamage(PYRAMID_SHIFT_CONSTANTS.CRUSH_DAMAGE * dt, 'pyramid_slab_crush');
          } else if (typeof ent.health === 'number') {
            ent.health = Math.max(0, ent.health - PYRAMID_SHIFT_CONSTANTS.CRUSH_DAMAGE * dt);
          }
          ent.isTrappedInSlab = true;
        }
      }
    }
  }
}
