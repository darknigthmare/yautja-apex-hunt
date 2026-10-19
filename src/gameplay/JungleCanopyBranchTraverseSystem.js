// Système de Progression en Haute Canopée & Sauts Plongeants (Predator 1987 — Lore 1:1)
// Référence canonique : Predator (1987) — Le Jungle Hunter évolue entre 8m et 14m de hauteur sur les branches maîtresses de la jungle de Val Verde

import { audioSynth } from '../AudioSynthesizer.js';

export const CANOPY_CONSTANTS = {
  MIN_CANOPY_HEIGHT: 8.0,              // Hauteur d'élévation minimale de la canopée (m)
  MAX_CANOPY_HEIGHT: 14.0,             // Hauteur des plus hautes branches d'observation (m)
  POUNCE_DAMAGE: 140.0,                // Dégâts cinétiques d'écrasement lors d'un saut plongeant
  POUNCE_STAGGER_DURATION: 2.5,        // Durée d'étourdissement de la cible au sol (s)
  VANTAGE_RANGE_BONUS: 1.6,            // +60% de portée de détection thermique depuis les cimes
};

export function createCanopyTraverseState(customBranches = null) {
  const defaultBranches = [
    { id: 'branch_canopy_01', x: 0.0,   y: 9.5,  z: -10.0, radius: 1.8, swayAngle: 0 },
    { id: 'branch_canopy_02', x: 5.5,   y: 11.0, z: -16.0, radius: 1.8, swayAngle: 0 },
    { id: 'branch_canopy_03', x: -4.0,  y: 10.0, z: -22.0, radius: 1.8, swayAngle: 0 },
    { id: 'branch_canopy_04', x: 2.0,   y: 12.5, z: -28.0, radius: 1.8, swayAngle: 0 },
  ];

  return {
    branches: customBranches || defaultBranches,
    currentBranchId: 'branch_canopy_01',
    isPerched: true,
    isPouncing: false,
    pouncesLanded: 0,
  };
}

export function hopToBranch(state, targetBranchId, audio = audioSynth) {
  if (!state || !state.branches) return false;
  const target = state.branches.find(b => b.id === targetBranchId);
  if (!target) return false;

  state.currentBranchId = targetBranchId;
  state.isPerched = true;

  if (audio && typeof audio.playCanopyBranchCreakSway === 'function') {
    audio.playCanopyBranchCreakSway();
  }
  return true;
}

export function executeCanopyPounce(state, groundTarget, audio = audioSynth) {
  if (!state || !state.isPerched || !groundTarget) {
    return { success: false };
  }

  state.isPerched = false;
  state.isPouncing = true;
  state.pouncesLanded++;

  if (audio && typeof audio.playCanopyDropPounceThud === 'function') {
    audio.playCanopyDropPounceThud();
  }

  // Application des dégâts plongeants
  if (typeof groundTarget.takeDamage === 'function') {
    groundTarget.takeDamage(CANOPY_CONSTANTS.POUNCE_DAMAGE, 'canopy_pounce');
  } else if (typeof groundTarget.health === 'number') {
    groundTarget.health = Math.max(0, groundTarget.health - CANOPY_CONSTANTS.POUNCE_DAMAGE);
  }

  groundTarget.isStaggered = true;
  groundTarget.staggerTimer = CANOPY_CONSTANTS.POUNCE_STAGGER_DURATION;

  return {
    success: true,
    damageDealt: CANOPY_CONSTANTS.POUNCE_DAMAGE,
    targetPinned: true,
  };
}

export function updateCanopyTraverse(state, delta) {
  if (!state || !state.branches) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Balancement ondulatoire des branches sous le vent de la canopée
  for (const b of state.branches) {
    b.swayAngle = (b.swayAngle || 0) + dt * 1.5;
  }
}
