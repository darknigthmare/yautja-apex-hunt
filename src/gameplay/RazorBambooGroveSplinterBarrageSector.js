// Canyon de Bambous Tranchants & Barrage d'Échardes Balistiques (Predator 1987 / Predators 2010 — Lore 1:1)
// Référence canonique : Predator (1987) & Predators (2010) — Les futaies denses de bambous géants qui, fauchées par un tir de plasma ou une lame, projettent une pluie de pieux biseautés empalant les cibles.

import { audioSynth } from '../AudioSynthesizer.js';

export const BAMBOO_GROVE_CONSTANTS = {
  SPLINTER_CONE_RADIUS_M: 6.5,       // Rayon de projection des tiges de bambou fauchées
  SPLINTER_PIERCE_DAMAGE: 115,       // Dégâts de perforation par les échardes géantes
  SLOW_PENALTY_FACTOR: 0.45,         // Ralentissement de la cible transpercée
};

export function createBambooGroveSectorState() {
  return {
    bambooClusters: [],
    shatteredClustersCount: 0,
  };
}

export function registerBambooCluster(state, position = { x: 0, z: 0 }) {
  if (!state) return false;
  state.bambooClusters.push({
    x: position.x || 0,
    z: position.z || 0,
    intact: true,
  });
  return true;
}

export function triggerBambooSplinterBarrage(state, clusterIndex = 0, nearbyEnemies = [], audio = audioSynth) {
  if (!state || !state.bambooClusters[clusterIndex] || !state.bambooClusters[clusterIndex].intact) {
    return { triggered: false, impaledCount: 0 };
  }

  const cluster = state.bambooClusters[clusterIndex];
  cluster.intact = false;
  state.shatteredClustersCount++;

  if (audio) {
    if (typeof audio.playBambooGroveShockwaveCrack === 'function') {
      audio.playBambooGroveShockwaveCrack();
    }
    if (typeof audio.playBambooSplinterBarrageWhistle === 'function') {
      audio.playBambooSplinterBarrageWhistle();
    }
  }

  let impaledCount = 0;
  if (Array.isArray(nearbyEnemies)) {
    for (const enemy of nearbyEnemies) {
      if (!enemy) continue;
      const dist = Math.hypot((enemy.x || 0) - cluster.x, (enemy.z || 0) - cluster.z);
      if (dist <= BAMBOO_GROVE_CONSTANTS.SPLINTER_CONE_RADIUS_M) {
        enemy.isImpaledByBamboo = true;
        enemy.speedMultiplier = BAMBOO_GROVE_CONSTANTS.SLOW_PENALTY_FACTOR;
        impaledCount++;

        if (typeof enemy.takeDamage === 'function') {
          enemy.takeDamage(BAMBOO_GROVE_CONSTANTS.SPLINTER_PIERCE_DAMAGE);
        } else if (typeof enemy.health === 'number') {
          enemy.health = Math.max(0, enemy.health - BAMBOO_GROVE_CONSTANTS.SPLINTER_PIERCE_DAMAGE);
        }
      }
    }
  }

  return {
    triggered: true,
    impaledCount,
  };
}
