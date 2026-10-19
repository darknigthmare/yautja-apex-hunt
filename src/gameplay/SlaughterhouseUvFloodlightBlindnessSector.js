// Projecteurs Ultraviolets de l'Abattoir & Bascule Spectrale Halogène (Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) — L'équipe OWLF de Peter Keyes en combinaisons isolantes déployant des lampes UV pour aveugler l'infrarouge du City Hunter, qui bascule alors son masque sur le spectre UV pour repérer leurs torches.

import { audioSynth } from '../AudioSynthesizer.js';

export const UV_FLOODLIGHT_CONSTANTS = {
  THERMAL_BLINDNESS_PENALTY: true,   // Le mode infrarouge standard est aveuglé par les combinaisons OWLF
  UV_FILTER_CRIT_MULTIPLIER: 1.5,    // +50% de dégâts sur les agents OWLF repérés par leurs lampes UV
};

export function createUvFloodlightSectorState() {
  return {
    areUvLightsActive: false,
    isHunterUvFilterEngaged: false,
    exposedOwlfAgentsCount: 0,
  };
}

export function activateOwlfUvFloodlights(state, hunter, audio = audioSynth) {
  if (!state) return false;
  state.areUvLightsActive = true;

  if (hunter) {
    hunter.isThermalVisionBlinded = UV_FLOODLIGHT_CONSTANTS.THERMAL_BLINDNESS_PENALTY;
  }

  if (audio && typeof audio.playOwlfUvFloodlightIgniteBuzz === 'function') {
    audio.playOwlfUvFloodlightIgniteBuzz();
  }

  return true;
}

export function engageBioMaskUvHalogenFilter(state, hunter, owlfAgents = [], audio = audioSynth) {
  if (!state || !hunter) return { exposedCount: 0 };

  state.isHunterUvFilterEngaged = true;
  hunter.isThermalVisionBlinded = false;

  if (audio && typeof audio.playBioMaskUvHalogenFilterShift === 'function') {
    audio.playBioMaskUvHalogenFilterShift();
  }

  let exposedCount = 0;
  if (Array.isArray(owlfAgents)) {
    for (const agent of owlfAgents) {
      if (!agent) continue;
      agent.isInsulatedSuitBypassed = true;
      agent.uvBeamRevealed = true;
      agent.damageVulnerability = UV_FLOODLIGHT_CONSTANTS.UV_FILTER_CRIT_MULTIPLIER;
      exposedCount++;
      state.exposedOwlfAgentsCount++;
    }
  }

  return {
    exposedCount,
  };
}
