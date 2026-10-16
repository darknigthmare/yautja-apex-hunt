// Système de Camouflage de Glaise et Dissimulation Thermique (Lore 1:1)
// Référence canonique : Predator (1987) - Camouflage de boue fluviale de Dutch Schaefer bloquant le spectre infrarouge

import { audioSynth } from '../AudioSynthesizer.js';

export const MUD_CAMO_CONSTANTS = {
  BASE_DRYING_TIME: 45.0,          // Durée d'efficacité de la boue fraîche (s)
  SPRINT_DRYING_ACCEL: 2.2,        // Accélération de séchage par la chaleur corporelle en sprint
  FIRE_PROXIMITY_ACCEL: 3.5,       // Accélération par proximité d'un brasier
  THERMAL_SIGNATURE_FRESH: 0.02,   // Émission infrarouge masquée à 98%
  WASH_OFF_SPEED: 80.0,            // Vitesse de rinçage instantané dans l'eau
};

export function createThermalMudWallowState() {
  return {
    isCovered: false,
    mudLayerThickness: 0,          // 0 à 100%
    thermalSignature: 1.0,         // 1.0 = corps chaud visible, 0.02 = température ambiante
    isCracked: false,
    isInWater: false,
  };
}

export function wallowInMud(state, audio = audioSynth) {
  if (!state) return false;

  state.isCovered = true;
  state.mudLayerThickness = 100.0;
  state.thermalSignature = MUD_CAMO_CONSTANTS.THERMAL_SIGNATURE_FRESH;
  state.isCracked = false;

  if (audio && typeof audio.playMudWallowSquelch === 'function') {
    audio.playMudWallowSquelch();
  }

  return true;
}

export function washMudOff(state) {
  if (!state || !state.isCovered) return false;

  state.isCovered = false;
  state.mudLayerThickness = 0;
  state.thermalSignature = 1.0;
  state.isCracked = false;
  return true;
}

export function updateMudCamouflage(state, delta, isSprinting = false, isNearFire = false, isInWater = false, audio = audioSynth) {
  if (!state || !state.isCovered) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Immersion dans l'eau : dissolution immédiate de la gangue de boue
  if (isInWater) {
    washMudOff(state);
    return;
  }

  // Taux de dessiccation thermique
  let dryRate = 100.0 / MUD_CAMO_CONSTANTS.BASE_DRYING_TIME;
  if (isSprinting) dryRate *= MUD_CAMO_CONSTANTS.SPRINT_DRYING_ACCEL;
  if (isNearFire) dryRate *= MUD_CAMO_CONSTANTS.FIRE_PROXIMITY_ACCEL;

  state.mudLayerThickness = Math.max(0, state.mudLayerThickness - dryRate * dt);

  // La signature thermique réapparaît graduellement à mesure que la glaise sèche
  const driedFraction = 1.0 - (state.mudLayerThickness / 100.0);
  state.thermalSignature = MUD_CAMO_CONSTANTS.THERMAL_SIGNATURE_FRESH + driedFraction * 0.98;

  // Craquèlement audible et visuel de la boue sèche
  if (state.mudLayerThickness <= 25.0 && !state.isCracked) {
    state.isCracked = true;
    if (audio && typeof audio.playMudDryingCrackle === 'function') {
      audio.playMudDryingCrackle();
    }
  }

  if (state.mudLayerThickness <= 0) {
    state.isCovered = false;
    state.thermalSignature = 1.0;
  }
}
