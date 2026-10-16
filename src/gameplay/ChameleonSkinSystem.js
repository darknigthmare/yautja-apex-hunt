// Système de pigmentation biomimétique de la peau caméléon Yautja (Lore 1:1)
// Référence canonique : Univers Étendu & The Predator (2018) - Chromatophores dermiques adaptatifs

import { audioSynth } from '../AudioSynthesizer.js';

export const SUBSTRATES = {
  WOOD_BARK: { name: 'WOOD_BARK', hexColor: '#3d2817', stealthBonus: 0.65 },
  BASALT_ROCK: { name: 'BASALT_ROCK', hexColor: '#1c1c1f', stealthBonus: 0.60 },
  SNOW_ICE: { name: 'SNOW_ICE', hexColor: '#d6e5ea', stealthBonus: 0.70 },
  JUNGLE_FOLIAGE: { name: 'JUNGLE_FOLIAGE', hexColor: '#1f381c', stealthBonus: 0.65 },
  URBAN_CONCRETE: { name: 'URBAN_CONCRETE', hexColor: '#5c5c62', stealthBonus: 0.55 },
};

export function createChameleonSkinState() {
  return {
    currentSubstrate: 'JUNGLE_FOLIAGE',
    currentDermalColor: SUBSTRATES.JUNGLE_FOLIAGE.hexColor,
    isShifting: false,
    shiftProgress: 1.0,
    targetSubstrate: 'JUNGLE_FOLIAGE',
  };
}

export function adaptSkinToSubstrate(state, substrateKey, audio = audioSynth) {
  if (!state || !SUBSTRATES[substrateKey]) return false;
  if (state.currentSubstrate === substrateKey) return false;

  state.targetSubstrate = substrateKey;
  state.isShifting = true;
  state.shiftProgress = 0;

  if (audio && typeof audio.playChameleonShift === 'function') {
    audio.playChameleonShift();
  }
  return true;
}

export function updateChameleonSkin(state, delta) {
  if (!state || !state.isShifting) return;
  const dt = Math.max(0, Number(delta) || 0);

  state.shiftProgress += dt / 0.8; // Transition en 0.8s
  if (state.shiftProgress >= 1.0) {
    state.shiftProgress = 1.0;
    state.isShifting = false;
    state.currentSubstrate = state.targetSubstrate;
    state.currentDermalColor = SUBSTRATES[state.targetSubstrate].hexColor;
  }
}

export function getPassiveStealthMultiplier(state) {
  if (!state) return 1.0;
  const substrate = SUBSTRATES[state.currentSubstrate] || SUBSTRATES.JUNGLE_FOLIAGE;
  return 1.0 + substrate.stealthBonus * state.shiftProgress;
}
