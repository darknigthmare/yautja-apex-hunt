// Système de Camouflage Fluvial par Bain de Boue Thermorégulatrice (Predator 1987 — Lore 1:1)
// Référence canonique : Predator (1987) — Dutch Schaeffer s'enduit de glaise fluviale froide pour annuler son rayonnement infrarouge

import { audioSynth } from '../AudioSynthesizer.js';

export const MUD_CAMO_CONSTANTS = {
  COATING_MAX_DURATION: 45.0,           // Durée de masquage thermique optimal en secondes
  THERMAL_MASKING_FACTOR_WET: 0.98,     // 98% d'invisibilité sous vision thermique infrarouge
  FIRE_DRYING_MULTIPLIER: 3.5,          // Accélération du séchage à proximité d'un feu/torche
  RAIN_WASH_RATE: 12.0,                 // Vitesse de délavage sous pluie torrentielle (unités/s)
  FLAKE_THRESHOLD: 0.72,                // Seuil où la boue commence à se craqueler et tomber
};

export function createRiverMudCamoState() {
  return {
    isMudCoated: false,
    mudThickness: 0.0,                  // 0.0 (aucun) à 1.0 (revêtement intégral)
    dryProgress: 0.0,                   // 0.0 (humide et isolant) à 1.0 (desséché)
    thermalConcealment: 0.0,
    crackleSoundTriggered: false,
    wasWashedByRain: false,
  };
}

export function applyRiverMudCoating(state, audio = audioSynth) {
  if (!state) return false;

  state.isMudCoated = true;
  state.mudThickness = 1.0;
  state.dryProgress = 0.0;
  state.thermalConcealment = MUD_CAMO_CONSTANTS.THERMAL_MASKING_FACTOR_WET;
  state.crackleSoundTriggered = false;
  state.wasWashedByRain = false;

  if (audio && typeof audio.playMudImmersionSplash === 'function') {
    audio.playMudImmersionSplash();
  }
  return true;
}

export function washOffMud(state) {
  if (!state || !state.isMudCoated) return false;

  state.isMudCoated = false;
  state.mudThickness = 0.0;
  state.dryProgress = 0.0;
  state.thermalConcealment = 0.0;
  state.crackleSoundTriggered = false;
  return true;
}

export function updateRiverMudCamo(state, delta, env = {}, audio = audioSynth) {
  if (!state || !state.isMudCoated) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Délavage immédiat en cas d'immersion totale ou de pluie battante
  if (env.isRaining) {
    state.mudThickness = Math.max(0, state.mudThickness - (MUD_CAMO_CONSTANTS.RAIN_WASH_RATE * dt * 0.1));
    if (state.mudThickness <= 0) {
      washOffMud(state);
      state.wasWashedByRain = true;
      return;
    }
  }

  // Taux de dessèchement influencé par la chaleur (feux de camp, torches, explosions)
  let dryingRate = dt / MUD_CAMO_CONSTANTS.COATING_MAX_DURATION;
  if (env.nearFireSource) {
    const proximity = Math.max(0.2, 1.0 - (Math.min(10.0, env.fireDistance || 2.0) / 10.0));
    dryingRate *= (1.0 + MUD_CAMO_CONSTANTS.FIRE_DRYING_MULTIPLIER * proximity);
  }

  state.dryProgress = Math.min(1.0, state.dryProgress + dryingRate);

  // Craquement de la boue sèche
  if (state.dryProgress >= MUD_CAMO_CONSTANTS.FLAKE_THRESHOLD && !state.crackleSoundTriggered) {
    state.crackleSoundTriggered = true;
    if (audio && typeof audio.playMudDryingFlakeCrackle === 'function') {
      audio.playMudDryingFlakeCrackle();
    }
  }

  // Si totalement séchée, la couche s'effrite et tombe
  if (state.dryProgress >= 1.0) {
    washOffMud(state);
    return;
  }

  // Masquage thermique effectif (diminue à mesure que la boue s'effrite et laisse paraître la peau chaude)
  state.thermalConcealment = Math.max(0.0, MUD_CAMO_CONSTANTS.THERMAL_MASKING_FACTOR_WET * (1.0 - state.dryProgress));
}
