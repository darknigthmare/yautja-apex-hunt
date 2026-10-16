// Système de camouflage thermique par la boue froide fluviale (Lore 1:1)
// Références canoniques : Predator (1987) (Dutch au bord de la rivière) et Prey (2022) (fleur d'Orange Cecil / boue)

import { audioSynth } from '../AudioSynthesizer.js';

export function createThermalMudState() {
  return {
    isCoated: false,
    remainingDuration: 0,
    totalDuration: 22.0,
    cooledBodyTemperature: 14.2, // Température sous le seuil d'émission infrarouge
    naturalBodyTemperature: 37.0,
    thermalInvisibilityActive: false,
  };
}

export function applyThermalMudCoating(state, player, audio = audioSynth) {
  if (!state) return false;
  state.isCoated = true;
  state.remainingDuration = state.totalDuration;
  state.thermalInvisibilityActive = true;

  if (player) {
    player.isMudCoated = true;
    player.apparentTemperatureCelsius = state.cooledBodyTemperature;
  }

  if (audio && typeof audio.playMudSlurryCoat === 'function') {
    audio.playMudSlurryCoat();
  }
  return true;
}

export function updateThermalMudCoating(state, delta, player, environment = {}, audio = audioSynth) {
  if (!state || !state.isCoated) return false;
  const dt = Math.max(0, Number(delta) || 0);

  // L'eau profonde et la pluie battante rincent la couche de boue
  const isWashingOut = Boolean(environment.isInWater || environment.isHeavyRain);
  const decayMultiplier = isWashingOut ? 4.5 : 1.0;

  state.remainingDuration = Math.max(0, state.remainingDuration - dt * decayMultiplier);

  if (state.remainingDuration <= 0) {
    state.isCoated = false;
    state.thermalInvisibilityActive = false;

    if (player) {
      player.isMudCoated = false;
      player.apparentTemperatureCelsius = state.naturalBodyTemperature;
    }

    if (audio && typeof audio.playMudWashOff === 'function') {
      audio.playMudWashOff();
    }
  }

  return state.isCoated;
}
