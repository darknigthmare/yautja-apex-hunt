// Système météo environnemental : Mousson tropicale, orages et perturbation de camouflage (Lore 1:1)
// Références canoniques : Predator (1987) & Predator 2 (1990) - L'eau court-circuite le camouflage optique

import { audioSynth } from '../AudioSynthesizer.js';

export const WEATHER_PRESETS = {
  CLEAR: { name: 'CLEAR', rainIntensity: 0.0, windSpeed: 2.0, thunderChance: 0.0 },
  LIGHT_DRIZZLE: { name: 'LIGHT_DRIZZLE', rainIntensity: 0.25, windSpeed: 5.0, thunderChance: 0.02 },
  HEAVY_MONSOON: { name: 'HEAVY_MONSOON', rainIntensity: 0.85, windSpeed: 18.0, thunderChance: 0.15 },
  THUNDERSTORM: { name: 'THUNDERSTORM', rainIntensity: 1.0, windSpeed: 28.0, thunderChance: 0.45 },
};

export function createEnvironmentalWeatherState(presetKey = 'CLEAR') {
  const preset = WEATHER_PRESETS[presetKey] || WEATHER_PRESETS.CLEAR;
  return {
    currentWeather: preset.name,
    rainIntensity: preset.rainIntensity,
    windSpeed: preset.windSpeed,
    thunderChance: preset.thunderChance,
    lightningFlashIntensity: 0,
    lightningDecaySpeed: 4.5,
    cloakFlickerIntensity: 0,
    isCloakShortCircuiting: false,
    thunderTimer: 0,
    nextThunderInterval: 12.0,
  };
}

export function setWeatherType(state, presetKey) {
  if (!state) return;
  const preset = WEATHER_PRESETS[presetKey] || WEATHER_PRESETS.CLEAR;
  state.currentWeather = preset.name;
  state.rainIntensity = preset.rainIntensity;
  state.windSpeed = preset.windSpeed;
  state.thunderChance = preset.thunderChance;
}

export function triggerLightningStrike(state, audio = audioSynth) {
  if (!state) return;
  state.lightningFlashIntensity = 1.0;

  if (audio && typeof audio.playThunderCrack === 'function') {
    audio.playThunderCrack();
  }
}

export function updateEnvironmentalWeather(state, delta, player, audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Amortissement de l'éclair
  if (state.lightningFlashIntensity > 0) {
    state.lightningFlashIntensity = Math.max(0, state.lightningFlashIntensity - dt * state.lightningDecaySpeed);
  }

  // Intervalle de foudre périodique si temps orageux
  if (state.thunderChance > 0) {
    state.thunderTimer += dt;
    if (state.thunderTimer >= state.nextThunderInterval) {
      state.thunderTimer = 0;
      state.nextThunderInterval = 8.0 + Math.random() * 10.0;
      triggerLightningStrike(state, audio);
    }
  }

  // Perturbation du camouflage optique Yautja par les gouttes d'eau (Lore 1:1)
  if (player && player.cloakState && player.cloakState.isCloaked) {
    if (state.rainIntensity > 0.4) {
      state.isCloakShortCircuiting = true;
      // Silhouette d'eau scintillante proportionnelle à la pluie
      state.cloakFlickerIntensity = state.rainIntensity * 0.85;
      player.cloakState.flicker = state.cloakFlickerIntensity;
    } else {
      state.isCloakShortCircuiting = false;
      state.cloakFlickerIntensity = 0;
      if (player.cloakState.flicker) {
        player.cloakState.flicker = 0;
      }
    }
  } else {
    state.isCloakShortCircuiting = false;
    state.cloakFlickerIntensity = 0;
  }
}
