// Secteur de Niveau : Labyrinthe Pyramidal aux Parois Coulissantes (Lore 1:1)
// Référence canonique : AVP (2004) - Réagencement cyclique des parois mégalithiques toutes les 10 minutes

import { audioSynth } from '../AudioSynthesizer.js';

export const PYRAMID_SHIFT_CONSTANTS = {
  SHIFT_CYCLE_INTERVAL: 600.0,     // 10 minutes canoniques entre chaque réagencement (s)
  TRANSITION_DURATION: 6.0,        // Durée du mouvement de glissement des blocs de granit (s)
  CRUSH_SEAM_RADIUS: 1.8,          // Périmètre mortel de pincement entre deux parois qui se referment
  CRUSH_DAMAGE: 999.0,             // Écrasement létal instantané
};

export function createPyramidShiftSectorState() {
  return {
    cycleTimer: 0,
    isShifting: false,
    shiftProgress: 0,
    currentConfigurationIndex: 0,
    slidingGates: [
      { id: 'gate_sacrificial_north', x: 0, y: 0, z: -25, isOpen: true, targetOpen: true },
      { id: 'gate_sepulcher_east',     x: 20, y: 0, z: -10, isOpen: false, targetOpen: false },
      { id: 'gate_crypt_south',        x: 0, y: 0, z: 5,   isOpen: false, targetOpen: false },
      { id: 'gate_trophy_west',        x: -20, y: 0, z: -10, isOpen: true, targetOpen: true },
    ],
    totalShiftsOccurred: 0,
  };
}

export function triggerManualPyramidShift(state, audio = audioSynth) {
  if (!state || state.isShifting) return false;

  state.isShifting = true;
  state.shiftProgress = 0;
  state.cycleTimer = 0;
  state.currentConfigurationIndex = (state.currentConfigurationIndex + 1) % 3;

  // Inversion de la perméabilité des corridors
  state.slidingGates.forEach((gate, idx) => {
    gate.targetOpen = (idx + state.currentConfigurationIndex) % 2 === 0;
  });

  if (audio && typeof audio.playPyramidGearShiftRumble === 'function') {
    audio.playPyramidGearShiftRumble();
  }
  if (audio && typeof audio.playStoneWallGrind === 'function') {
    audio.playStoneWallGrind();
  }

  return true;
}

export function updatePyramidShiftSector(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  state.cycleTimer += dt;
  if (state.cycleTimer >= PYRAMID_SHIFT_CONSTANTS.SHIFT_CYCLE_INTERVAL) {
    triggerManualPyramidShift(state, audio);
  }

  if (state.isShifting) {
    state.shiftProgress += dt / PYRAMID_SHIFT_CONSTANTS.TRANSITION_DURATION;

    // Détection de pincement mortel dans les embrasures
    for (const gate of state.slidingGates) {
      if (gate.isOpen !== gate.targetOpen) {
        for (const ent of entities) {
          if (!ent || ent.isDead) continue;
          const ex = ent.x ?? (ent.position ? ent.position.x : 0);
          const ez = ent.z ?? (ent.position ? ent.position.z : 0);

          const dx = ex - gate.x;
          const dz = ez - gate.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          if (dist <= PYRAMID_SHIFT_CONSTANTS.CRUSH_SEAM_RADIUS) {
            if (typeof ent.takeDamage === 'function') {
              ent.takeDamage(PYRAMID_SHIFT_CONSTANTS.CRUSH_DAMAGE, 'granite_gate_crush');
            } else if (typeof ent.health === 'number') {
              ent.health = 0;
            }
            ent.isDead = true;
            ent.deathType = 'pyramid_wall_crush';
          }
        }
      }
    }

    if (state.shiftProgress >= 1.0) {
      state.isShifting = false;
      state.shiftProgress = 0;
      state.totalShiftsOccurred += 1;
      state.slidingGates.forEach(gate => {
        gate.isOpen = gate.targetOpen;
      });
    }
  }
}
