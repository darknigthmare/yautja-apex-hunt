// Chaufferie Industrielle & Rupture de Conduites de Vapeur Haute Pression (Predator 2 / AVP:R — Lore 1:1)
// Référence canonique : Predator 2 (1990) — Les conduites de vapeur pressurisée de l'abattoir et des sous-sols industriels qui, perforées au tir ou à la lame, ébouillantent les soldats et créent un écran thermique.

import { audioSynth } from '../AudioSynthesizer.js';

export const BOILER_PIPE_CONSTANTS = {
  STEAM_JET_RADIUS_M: 4.5,           // Rayon du jet de vapeur surchauffée
  SCALDING_DAMAGE: 90,               // Dégâts de brûlure thermique immédiate
  THERMAL_SCREEN_DURATION_SEC: 7.0,  // Durée du rideau de vapeur masquant les signatures
};

export function createBoilerPipeSectorState() {
  return {
    steamPipes: [],
    activeSteamScreens: 0,
  };
}

export function registerPressurizedSteamPipe(state, position = { x: 0, z: 0 }) {
  if (!state) return false;
  state.steamPipes.push({
    x: position.x || 0,
    z: position.z || 0,
    ruptured: false,
  });
  return true;
}

export function ruptureSteamPipe(state, pipeIndex = 0, nearbyTargets = [], audio = audioSynth) {
  if (!state || !state.steamPipes[pipeIndex] || state.steamPipes[pipeIndex].ruptured) {
    return { ruptured: false, scaldedCount: 0 };
  }

  const pipe = state.steamPipes[pipeIndex];
  pipe.ruptured = true;
  state.activeSteamScreens++;

  if (audio && typeof audio.playBoilerPipeHighPressureRupture === 'function') {
    audio.playBoilerPipeHighPressureRupture();
  }

  let scaldedCount = 0;
  if (Array.isArray(nearbyTargets)) {
    for (const target of nearbyTargets) {
      if (!target) continue;
      const dist = Math.hypot((target.x || 0) - pipe.x, (target.z || 0) - pipe.z);
      if (dist <= BOILER_PIPE_CONSTANTS.STEAM_JET_RADIUS_M) {
        target.isScaldedBySteam = true;
        target.isThermallyBlinded = true;
        scaldedCount++;

        if (typeof target.takeDamage === 'function') {
          target.takeDamage(BOILER_PIPE_CONSTANTS.SCALDING_DAMAGE);
        } else if (typeof target.health === 'number') {
          target.health = Math.max(0, target.health - BOILER_PIPE_CONSTANTS.SCALDING_DAMAGE);
        }
      }
    }
  }

  return {
    ruptured: true,
    scaldedCount,
    screenDurationSec: BOILER_PIPE_CONSTANTS.THERMAL_SCREEN_DURATION_SEC,
  };
}
