// Système de Dissémination de Grappes de Micro-Mines Magnétiques (Predators 2010 — Lore 1:1)
// Référence canonique : Predators (2010) — Le Tracker Super Predator projetant des grappes de micro-mines magnétiques se collant aux arbres et rochers pour piéger les clairières.

import { audioSynth } from '../AudioSynthesizer.js';

export const MINE_CLUSTER_CONSTANTS = {
  MINES_PER_DISPERSION: 4,            // Nombre de micro-mines par cartouche
  PROXIMITY_TRIGGER_METERS: 2.2,      // Rayon d'armement et détection de pas
  MINE_EXPLOSION_DAMAGE: 70.0,        // Dégâts de souffle et shrapnel par mine
};

export function createMineClusterState() {
  return {
    activeMines: [], // Array of { id, x, z, isDetonated }
    totalDetonations: 0,
  };
}

export function deployMineCluster(state, originPos = { x: 0, z: 0 }, audio = audioSynth) {
  if (!state || !originPos) return null;

  if (audio && typeof audio.playProximityMineClusterScatter === 'function') {
    audio.playProximityMineClusterScatter();
  }

  const deployed = [];
  const offsets = [
    { x: -1.5, z: -1.5 },
    { x: 1.5, z: -1.5 },
    { x: -1.5, z: 1.5 },
    { x: 1.5, z: 1.5 },
  ];

  for (let i = 0; i < MINE_CLUSTER_CONSTANTS.MINES_PER_DISPERSION; i++) {
    const mineId = `micro_mine_${Date.now()}_${i}`;
    const mine = {
      id: mineId,
      x: (originPos.x || 0) + offsets[i].x,
      z: (originPos.z || 0) + offsets[i].z,
      isDetonated: false,
    };
    state.activeMines.push(mine);
    deployed.push(mine);
  }

  return {
    success: true,
    minesDeployed: deployed,
  };
}

export function evaluateMineProximity(state, entity) {
  if (!state || !entity) return { detonatedCount: 0 };

  const entX = entity.x || 0;
  const entZ = entity.z || 0;
  let detonated = 0;

  for (const mine of state.activeMines) {
    if (mine.isDetonated) continue;

    const dx = mine.x - entX;
    const dz = mine.z - entZ;
    if (Math.hypot(dx, dz) <= MINE_CLUSTER_CONSTANTS.PROXIMITY_TRIGGER_METERS) {
      mine.isDetonated = true;
      state.totalDetonations++;
      detonated++;

      const damage = MINE_CLUSTER_CONSTANTS.MINE_EXPLOSION_DAMAGE;
      if (typeof entity.takeDamage === 'function') {
        entity.takeDamage(damage);
      } else if (typeof entity.health === 'number') {
        entity.health = Math.max(0, entity.health - damage);
      }
      entity.isShrapnelStruck = true;
    }
  }

  return {
    detonatedCount: detonated,
    totalMinesTriggered: state.totalDetonations,
  };
}
