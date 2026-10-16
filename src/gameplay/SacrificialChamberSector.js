// Secteur de niveau Chambre Sacrificielle & Cages d'Ovomorphs (Lore 1:1)
// Référence canonique : Alien vs Predator (2004) - Chambre des sacrifices pyramidale et éclosion des œufs

import { audioSynth } from '../AudioSynthesizer.js';

export const SACRIFICIAL_CONSTANTS = {
  EGG_TRIGGER_RADIUS: 4.5,
  FACEHUGGER_LEAP_SPEED: 18.0,
  POUNCE_DAMAGE: 45.0,
};

export function createSacrificialChamberSector() {
  return {
    slabs: [
      { id: 'slab_1', x: -5, y: 0, z: 0, hasHost: true },
      { id: 'slab_2', x: 0, y: 0, z: 0, hasHost: true },
      { id: 'slab_3', x: 5, y: 0, z: 0, hasHost: true },
    ],
    eggPods: [
      { id: 'ovomorph_1', x: -4.5, y: 0, z: 2.0, isHatched: false, isOpening: false },
      { id: 'ovomorph_2', x: 0, y: 0, z: 2.0, isHatched: false, isOpening: false },
      { id: 'ovomorph_3', x: 4.5, y: 0, z: 2.0, isHatched: false, isOpening: false },
    ],
    activeFacehuggers: [],
  };
}

export function triggerEggPodHatch(sector, podId, audio = audioSynth) {
  if (!sector) return null;
  const pod = sector.eggPods.find(p => p.id === podId && !p.isHatched);
  if (!pod) return null;

  pod.isHatched = true;
  pod.isOpening = false;

  const facehugger = {
    id: `facehugger_${Date.now()}`,
    x: pod.x,
    y: 0.2,
    z: pod.z,
    isLeaping: false,
    health: 25.0,
  };
  sector.activeFacehuggers.push(facehugger);

  if (audio && typeof audio.playEggPodHiss === 'function') {
    audio.playEggPodHiss();
  }
  return facehugger;
}

export function updateSacrificialChamber(sector, delta, entities = [], audio = audioSynth) {
  if (!sector) return;
  const dt = Math.max(0, Number(delta) || 0);

  // 1. Déclenchement automatique des œufs si proximité
  for (const pod of sector.eggPods) {
    if (!pod.isHatched) {
      for (const entity of entities) {
        const dx = entity.x - pod.x;
        const dz = entity.z - pod.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist <= SACRIFICIAL_CONSTANTS.EGG_TRIGGER_RADIUS) {
          triggerEggPodHatch(sector, pod.id, audio);
          break;
        }
      }
    }
  }

  // 2. Traque et bond des Facehuggers actifs
  for (const fh of sector.activeFacehuggers) {
    if (entities.length > 0) {
      const target = entities[0];
      const dx = target.x - fh.x;
      const dz = target.z - fh.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 1.0) {
        // Enlacement facial
        if (typeof target.applyDamage === 'function') {
          target.applyDamage(SACRIFICIAL_CONSTANTS.POUNCE_DAMAGE, 'facehugger_impregnation_attempt');
        } else if (typeof target.health === 'number') {
          target.health = Math.max(0, target.health - SACRIFICIAL_CONSTANTS.POUNCE_DAMAGE);
        }
        target.isFacehuggerLatched = true;
      } else {
        // Rapprochement rapide
        fh.x += (dx / dist) * SACRIFICIAL_CONSTANTS.FACEHUGGER_LEAP_SPEED * 0.4 * dt;
        fh.z += (dz / dist) * SACRIFICIAL_CONSTANTS.FACEHUGGER_LEAP_SPEED * 0.4 * dt;
        if (audio && Math.random() < 0.05 && typeof audio.playFacehuggerSkitter === 'function') {
          audio.playFacehuggerSkitter();
        }
      }
    }
  }
}
