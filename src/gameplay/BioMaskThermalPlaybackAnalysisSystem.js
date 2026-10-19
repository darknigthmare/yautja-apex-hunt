// Masque Bio-Optique à Enregistrement & Relecture Thermique (Predator 2 / Predator 1987 — Lore 1:1)
// Référence canonique : Predator (1987) & Predator 2 (1990) — Le masque Yautja enregistrant les séquences thermiques et vocales des affrontements puis les rejouant pour analyser le comportement et les failles de la proie.

import { audioSynth } from '../AudioSynthesizer.js';

export const THERMAL_PLAYBACK_CONSTANTS = {
  WEAKNESS_CRIT_BONUS: 1.45,         // +45% de dégâts critiques après analyse de la séquence
  VOCAL_MIMICRY_SAMPLES_GAINED: 1,   // Échantillon vocal de leurre extrait de l'enregistrement
};

export function createThermalPlaybackState() {
  return {
    recordedEncounters: [],
    analyzedTargetIds: [],
    vocalSamplesCollected: 0,
  };
}

export function recordTargetThermalSignature(state, target) {
  if (!state || !target) return false;
  state.recordedEncounters.push({
    targetId: target.id || 'prey_target',
    timestamp: Date.now(),
    targetRef: target,
  });
  return true;
}

export function replayAndAnalyzeThermalEncounter(state, encounterIndex = 0, audio = audioSynth) {
  if (!state || !state.recordedEncounters[encounterIndex]) {
    return { analyzed: false };
  }

  const record = state.recordedEncounters[encounterIndex];

  if (audio && typeof audio.playBioMaskThermalPlaybackRewind === 'function') {
    audio.playBioMaskThermalPlaybackRewind();
  }

  state.analyzedTargetIds.push(record.targetId);
  state.vocalSamplesCollected += THERMAL_PLAYBACK_CONSTANTS.VOCAL_MIMICRY_SAMPLES_GAINED;

  if (record.targetRef) {
    record.targetRef.isArmorSeamExposed = true;
    record.targetRef.critDamageTakenMultiplier = THERMAL_PLAYBACK_CONSTANTS.WEAKNESS_CRIT_BONUS;
  }

  return {
    analyzed: true,
    critMultiplierApplied: THERMAL_PLAYBACK_CONSTANTS.WEAKNESS_CRIT_BONUS,
    vocalSamplesTotal: state.vocalSamplesCollected,
  };
}
