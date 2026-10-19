// Secteur de Niveau : Chambre d'Incubation de la Reine Xénomorphe (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — La Reine enchaînée dans la crypte de ponte et les œufs s'ouvrant à l'approche des hôtes

import { audioSynth } from '../AudioSynthesizer.js';

export const QUEEN_CHAMBER_CONSTANTS = {
  EGG_TRIGGER_RADIUS: 2.2,             // Distance d'éveil d'un œuf au passage d'un hôte (m)
  SHACKLE_MAX_HEALTH: 160.0,           // Résistance des entraves hydrauliques de la Reine
  QUEEN_HEALTH: 550.0,
};

export function createQueenChamberState() {
  const defaultEggs = [
    { id: 'egg_01', x: -3.0, z: -20.0, isOpen: false, isDestroyed: false },
    { id: 'egg_02', x: -1.0, z: -23.0, isOpen: false, isDestroyed: false },
    { id: 'egg_03', x: 1.0,  z: -23.0, isOpen: false, isDestroyed: false },
    { id: 'egg_04', x: 3.0,  z: -20.0, isOpen: false, isDestroyed: false },
  ];

  return {
    queen: {
      health: QUEEN_CHAMBER_CONSTANTS.QUEEN_HEALTH,
      isShackled: true,
      shackleHealth: QUEEN_CHAMBER_CONSTANTS.SHACKLE_MAX_HEALTH,
    },
    eggs: defaultEggs,
    facehuggersReleasedCount: 0,
    queenFreed: false,
  };
}

export function damageQueenShackles(state, damageAmount, audio = audioSynth) {
  if (!state || !state.queen.isShackled) return { freed: false };

  state.queen.shackleHealth = Math.max(0, state.queen.shackleHealth - Number(damageAmount) || 0);

  if (state.queen.shackleHealth <= 0) {
    state.queen.isShackled = false;
    state.queenFreed = true;

    if (audio && typeof audio.playQueenShackleHydraulicHiss === 'function') {
      audio.playQueenShackleHydraulicHiss();
    }
    return { freed: true };
  }

  return { freed: false, remainingShackleHealth: state.queen.shackleHealth };
}

export function updateQueenChamber(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;

  for (const egg of state.eggs) {
    if (egg.isOpen || egg.isDestroyed) continue;

    for (const ent of entities) {
      if (!ent || ent.isDead) continue;
      // Les Xénomorphes n'éclosent pas devant d'autres Xénomorphes
      if (ent.species === 'xenomorph' || ent.role?.includes('xeno')) continue;

      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);
      const dist = Math.sqrt((ex - egg.x) ** 2 + (ez - egg.z) ** 2);

      if (dist <= QUEEN_CHAMBER_CONSTANTS.EGG_TRIGGER_RADIUS) {
        // Éclosion de l'œuf et bond du Facehugger
        egg.isOpen = true;
        state.facehuggersReleasedCount++;

        if (audio && typeof audio.playEggPodPetalOpenSquelch === 'function') {
          audio.playEggPodPetalOpenSquelch();
        }
        break;
      }
    }
  }
}
