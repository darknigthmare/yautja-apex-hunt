// Système d'Effritement de Boue Thermique et Dégradation sous la Pluie (Predator 1987 — Lore 1:1)
// Référence canonique : Predator (1987) — Dutch s'enduisant de boue froide le long du fleuve ; la boue séchant et se craquelant sous la chaleur corporelle et les intempéries, réveillant des points chauds thermiques.

import { audioSynth } from '../AudioSynthesizer.js';

export const MUD_DECAY_CONSTANTS = {
  MAX_MUD_COVERAGE: 1.0,               // Couverture intégrale initiale (100%)
  NATURAL_DRYING_RATE_PER_SEC: 0.02,   // Séchage naturel sous la chaleur corporelle
  RAIN_WASH_ACCELERATION: 0.06,        // Lavage accéléré en cas d'averse tropicale
  SPRINT_CRACKLE_PENALTY: 0.03,        // Effritement dû aux mouvements saccadés
  THERMAL_REVEAL_THRESHOLD: 0.35,      // Seuil d'effritement sous lequel les points chauds rayonnent
};

export function createMudDecayState() {
  return {
    mudLayerThickness: 0.0,
    isThermallyCloaked: false,
    hasThermalHotspots: false,
    hotspotCount: 0,
  };
}

export function applyFreshAlluvialMud(state, audio = audioSynth) {
  if (!state) return false;

  state.mudLayerThickness = MUD_DECAY_CONSTANTS.MAX_MUD_COVERAGE;
  state.isThermallyCloaked = true;
  state.hasThermalHotspots = false;
  state.hotspotCount = 0;

  return true;
}

export function updateMudDecay(state, delta = 0.1, isRaining = false, isSprinting = false, audio = audioSynth) {
  if (!state || state.mudLayerThickness <= 0) return;

  let decayRate = MUD_DECAY_CONSTANTS.NATURAL_DRYING_RATE_PER_SEC;
  if (isRaining) decayRate += MUD_DECAY_CONSTANTS.RAIN_WASH_ACCELERATION;
  if (isSprinting) decayRate += MUD_DECAY_CONSTANTS.SPRINT_CRACKLE_PENALTY;

  const previousThickness = state.mudLayerThickness;
  state.mudLayerThickness = Math.max(0, state.mudLayerThickness - decayRate * delta);

  // Détection de craquèlement sonore
  if (previousThickness > 0.6 && state.mudLayerThickness <= 0.6) {
    if (audio && typeof audio.playMudFlakeCrackDry === 'function') {
      audio.playMudFlakeCrackDry();
    }
  }

  // Apparition de points chauds thermiques
  if (state.mudLayerThickness <= MUD_DECAY_CONSTANTS.THERMAL_REVEAL_THRESHOLD) {
    if (!state.hasThermalHotspots) {
      state.hasThermalHotspots = true;
      if (audio && typeof audio.playThermalBloomHiss === 'function') {
        audio.playThermalBloomHiss();
      }
    }
    state.hotspotCount = Math.floor((1.0 - state.mudLayerThickness / MUD_DECAY_CONSTANTS.THERMAL_REVEAL_THRESHOLD) * 5) + 1;
    state.isThermallyCloaked = false; // La vision thermique du prédateur capte à nouveau la signature
  }
}
