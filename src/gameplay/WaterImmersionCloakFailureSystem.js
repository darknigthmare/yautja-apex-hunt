// Système de Court-Circuit de Camouflage par Immersion Aquatique (Predator 1987 — Lore 1:1)
// Référence canonique : Predator (1987) — Le Jungle Hunter subit un court-circuit de son camouflage optique lors de son passage sous la cascade

import { audioSynth } from '../AudioSynthesizer.js';

export const WATER_CLOAK_CONSTANTS = {
  DEPTH_THRESHOLD_METERS: 0.45,        // Profondeur d'immersion déclenchant le court-circuit
  CIRCUIT_DRY_DURATION: 4.5,           // Temps de séchage avant réactivation possible du camouflage (s)
  WADING_SPEED_PENALTY: 0.35,          // -35% de vitesse de déplacement en pataugeant dans l'eau
};

export function createWaterCloakFailureState() {
  return {
    isSubmerged: false,
    circuitShortCircuited: false,
    dryTimer: 0.0,
    shortCircuitCount: 0,
  };
}

export function evaluateWaterImmersion(state, hunterEntity, currentWaterDepth = 0.0, audio = audioSynth) {
  if (!state || !hunterEntity) return;

  const depth = Number(currentWaterDepth) || 0.0;
  const inWater = depth >= WATER_CLOAK_CONSTANTS.DEPTH_THRESHOLD_METERS;

  hunterEntity.isInWater = inWater;

  if (inWater) {
    state.isSubmerged = true;
    hunterEntity.speedMultiplier = 1.0 - WATER_CLOAK_CONSTANTS.WADING_SPEED_PENALTY;

    // Si le camouflage optique était actif, court-circuit immédiat
    if (hunterEntity.isCloaked) {
      hunterEntity.isCloaked = false;
      hunterEntity.cloakShortCircuited = true;
      state.circuitShortCircuited = true;
      state.dryTimer = WATER_CLOAK_CONSTANTS.CIRCUIT_DRY_DURATION;
      state.shortCircuitCount++;

      if (audio && typeof audio.playWaterImmersionCloakFritter === 'function') {
        audio.playWaterImmersionCloakFritter();
      }
      if (audio && typeof audio.playWaterSplashWadeSquelch === 'function') {
        audio.playWaterSplashWadeSquelch();
      }
    }
  } else {
    state.isSubmerged = false;
  }
}

export function updateWaterCloakFailure(state, delta, hunterEntity) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Le séchage des circuits n'opère que hors de l'eau
  if (!state.isSubmerged && state.circuitShortCircuited) {
    state.dryTimer -= dt;
    if (state.dryTimer <= 0) {
      state.circuitShortCircuited = false;
      state.dryTimer = 0.0;
      if (hunterEntity) {
        hunterEntity.cloakShortCircuited = false;
      }
    }
  }
}
