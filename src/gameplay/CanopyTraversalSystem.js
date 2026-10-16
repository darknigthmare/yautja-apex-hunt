// Système de navigation en canopée et sauts prédateurs (Lore 1:1)
// Référence canonique : Predator (1987) - Chasseur dans la canopée de Val Verde

import { audioSynth } from '../AudioSynthesizer.js';

export const CANOPY_CONSTANTS = {
  MAX_LEAP_DISTANCE: 18.0, // Portée maximale d'un bond yautja de branche en branche
  MIN_CANOPY_HEIGHT: 7.5,  // Hauteur minimale pour être considéré en canopée
  LEAP_VELOCITY: 24.0,     // Vitesse de translation aérienne (m/s)
  AMBUSH_STEALTH_BONUS: 1.85, // Multiplicateur de furtivité en surplomb
};

export function createCanopyTraversalState() {
  return {
    branches: [],
    currentNode: null,
    isLeaping: false,
    leapProgress: 0,
    leapStartPos: { x: 0, y: 0, z: 0 },
    leapTargetPos: { x: 0, y: 0, z: 0 },
    leapDuration: 0,
    currentElevation: 0,
    isPerched: false,
  };
}

export function addCanopyBranchNode(network, node) {
  if (!network || !node) return false;
  const branch = {
    id: node.id || `canopy_node_${network.branches.length + 1}`,
    x: Number(node.x) || 0,
    y: Math.max(CANOPY_CONSTANTS.MIN_CANOPY_HEIGHT, Number(node.y) || CANOPY_CONSTANTS.MIN_CANOPY_HEIGHT),
    z: Number(node.z) || 0,
    radius: Number(node.radius) || 1.8,
    supportsHeavyWeight: node.supportsHeavyWeight !== false,
  };
  network.branches.push(branch);
  return branch;
}

export function findReachableCanopyNodes(network, currentPos, maxDistance = CANOPY_CONSTANTS.MAX_LEAP_DISTANCE) {
  if (!network || !network.branches || !currentPos) return [];
  return network.branches.filter(b => {
    const dx = b.x - currentPos.x;
    const dy = b.y - currentPos.y;
    const dz = b.z - currentPos.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return dist > 0.5 && dist <= maxDistance;
  });
}

export function initiatePredatoryLeap(state, targetNode, playerPos, audio = audioSynth) {
  if (!state || !targetNode) return false;

  const startX = playerPos ? playerPos.x : (state.currentNode ? state.currentNode.x : 0);
  const startY = playerPos ? playerPos.y : (state.currentNode ? state.currentNode.y : CANOPY_CONSTANTS.MIN_CANOPY_HEIGHT);
  const startZ = playerPos ? playerPos.z : (state.currentNode ? state.currentNode.z : 0);

  const dx = targetNode.x - startX;
  const dy = targetNode.y - startY;
  const dz = targetNode.z - startZ;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

  if (dist > CANOPY_CONSTANTS.MAX_LEAP_DISTANCE) {
    return false; // Trop loin
  }

  state.isLeaping = true;
  state.leapProgress = 0;
  state.leapDuration = Math.max(0.35, dist / CANOPY_CONSTANTS.LEAP_VELOCITY);
  state.leapStartPos = { x: startX, y: startY, z: startZ };
  state.leapTargetPos = { x: targetNode.x, y: targetNode.y, z: targetNode.z };
  state.targetNode = targetNode;
  state.isPerched = false;

  if (audio && typeof audio.playCanopyBranchRustle === 'function') {
    audio.playCanopyBranchRustle();
  }
  return true;
}

export function updateCanopyTraversal(state, delta, player, audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.isLeaping) {
    state.leapProgress += dt / state.leapDuration;

    if (state.leapProgress >= 1.0) {
      state.leapProgress = 1.0;
      state.isLeaping = false;
      state.currentNode = state.targetNode;
      state.isPerched = true;
      state.currentElevation = state.currentNode.y;

      if (player) {
        player.x = state.currentNode.x;
        player.y = state.currentNode.y;
        player.z = state.currentNode.z;
        player.isPerched = true;
        player.canopyStealthBonus = CANOPY_CONSTANTS.AMBUSH_STEALTH_BONUS;
      }

      if (audio && typeof audio.playCanopyBranchCreak === 'function') {
        audio.playCanopyBranchCreak();
      }
    } else {
      // Trajectoire parabolique d'arc de bond prédateur
      const t = state.leapProgress;
      const arcHeight = 2.5 * Math.sin(t * Math.PI);
      const currX = state.leapStartPos.x + (state.leapTargetPos.x - state.leapStartPos.x) * t;
      const currY = state.leapStartPos.y + (state.leapTargetPos.y - state.leapStartPos.y) * t + arcHeight;
      const currZ = state.leapStartPos.z + (state.leapTargetPos.z - state.leapStartPos.z) * t;

      state.currentElevation = currY;
      if (player) {
        player.x = currX;
        player.y = currY;
        player.z = currZ;
      }
    }
  }
}
