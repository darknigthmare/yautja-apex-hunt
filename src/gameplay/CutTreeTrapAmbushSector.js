// Secteur de Niveau : Arbres d'Embuscade Abattus et Ponts de Tronc (Lore 1:1)
// Référence canonique : Prey (2022) - Tronc de pin abattu servant de barricade, piège de sentier et poutre d'équilibre

import { audioSynth } from '../AudioSynthesizer.js';

export const TREE_AMBUSH_CONSTANTS = {
  TRUNK_LENGTH: 14.0,              // Longueur du tronc de pin couché (m)
  TRUNK_ELEVATION_Y: 1.8,          // Hauteur du tronc au-dessus du sol
  COLLAPSE_DAMAGE: 85.0,           // Dégâts de chute sur les cibles situées dessous
  WALKWAY_WIDTH: 0.65,             // Largeur de la surface de progression équilibriste
};

export function createCutTreeAmbushState() {
  return {
    trees: [
      { id: 'pine_deadfall_01', x: -8.0, y: 0, z: -15.0, isFelled: false, ropeTetherHealth: 30.0 },
      { id: 'pine_deadfall_02', x: 12.0, y: 0, z: -28.0, isFelled: false, ropeTetherHealth: 30.0 },
    ],
    activeBarricades: [],
  };
}

export function severTreeRopeTether(state, treeId, damage = 35.0, audio = audioSynth) {
  if (!state) return false;
  const tree = state.trees.find(t => t.id === treeId);
  if (!tree || tree.isFelled) return false;

  tree.ropeTetherHealth -= damage;
  if (tree.ropeTetherHealth <= 0) {
    tree.isFelled = true;
    state.activeBarricades.push({
      treeId: tree.id,
      x: tree.x,
      y: TREE_AMBUSH_CONSTANTS.TRUNK_ELEVATION_Y,
      z: tree.z,
      length: TREE_AMBUSH_CONSTANTS.TRUNK_LENGTH,
    });

    if (audio && typeof audio.playFelledTreeCrash === 'function') {
      audio.playFelledTreeCrash();
    }

    return true;
  }

  return false;
}

export function evaluateTrunkWalkwayTraversal(state, actorPos) {
  if (!state) return { isOnTrunkBridge: false };

  for (const barr of state.activeBarricades) {
    const dx = Math.abs(actorPos.x - barr.x);
    const dz = Math.abs(actorPos.z - barr.z);

    // Si l'acteur marche sur la longueur du tronc
    if (dx <= (barr.length / 2) && dz <= TREE_AMBUSH_CONSTANTS.WALKWAY_WIDTH) {
      return {
        isOnTrunkBridge: true,
        bridgeY: barr.y,
        evadesGroundTraps: true, // Évite les pièges à loup ou la boue situés en contrebas
      };
    }
  }

  return { isOnTrunkBridge: false };
}
