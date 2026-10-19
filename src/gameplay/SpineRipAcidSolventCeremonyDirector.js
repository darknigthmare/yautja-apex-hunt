// Directeur de Cérémonie d'Arrachement de Trophée & Solvant Bleu Yautja (Predator 1987 / AVP:R — Lore 1:1)
// Référence canonique : Predator (1987) & AVP:R (2007) — Extraction de la colonne vertébrale et dissolution des chairs au solvant bleu pour polir le crâne

import { audioSynth } from '../AudioSynthesizer.js';

export const CEREMONY_CONSTANTS = {
  EXTRACTION_DURATION: 2.5,            // Temps d'arrachement vertébral (s)
  SOLVENT_CLEANSE_DURATION: 2.0,       // Temps de décapage des chairs par le liquide bleu (s)
  HONOR_HUMAN_TROPHY: 150,             // Récompense d'honneur pour guerrier valeureux
  HONOR_XENO_TROPHY: 200,              // Récompense d'honneur pour Xénomorphe pur
};

export function createTrophyCeremonyState() {
  return {
    isPerforming: false,
    currentPhase: 'IDLE',              // 'EXTRACTION', 'CLEANSE', 'DONE'
    phaseTimer: 0.0,
    activeVictim: null,
    claimedTrophies: [],
    totalHonorEarned: 0,
  };
}

export function startTrophyCeremony(state, victimEntity, audio = audioSynth) {
  if (!state || state.isPerforming || !victimEntity) {
    return { success: false, reason: 'Cérémonie déjà active ou cible invalide' };
  }

  state.isPerforming = true;
  state.currentPhase = 'EXTRACTION';
  state.phaseTimer = 0.0;
  state.activeVictim = victimEntity;

  if (audio && typeof audio.playSpineRipCrackTear === 'function') {
    audio.playSpineRipCrackTear();
  }

  return { success: true, phase: 'EXTRACTION' };
}

export function updateTrophyCeremony(state, delta, audio = audioSynth) {
  if (!state || !state.isPerforming) return null;
  const dt = Math.max(0, Number(delta) || 0);

  state.phaseTimer += dt;

  if (state.currentPhase === 'EXTRACTION') {
    if (state.phaseTimer >= CEREMONY_CONSTANTS.EXTRACTION_DURATION) {
      // Transition vers l'application du solvant bleu
      state.currentPhase = 'CLEANSE';
      state.phaseTimer = 0.0;

      if (audio && typeof audio.playBlueSolventSizzleFoam === 'function') {
        audio.playBlueSolventSizzleFoam();
      }
    }
    return { phase: 'EXTRACTION', progress: state.phaseTimer / CEREMONY_CONSTANTS.EXTRACTION_DURATION };
  }

  if (state.currentPhase === 'CLEANSE') {
    if (state.phaseTimer >= CEREMONY_CONSTANTS.SOLVENT_CLEANSE_DURATION) {
      // Fin de la cérémonie et obtention du trophée
      state.currentPhase = 'DONE';
      state.isPerforming = false;

      const isXeno = state.activeVictim?.species === 'xenomorph' || state.activeVictim?.role?.includes('xeno');
      const honor = isXeno ? CEREMONY_CONSTANTS.HONOR_XENO_TROPHY : CEREMONY_CONSTANTS.HONOR_HUMAN_TROPHY;
      state.totalHonorEarned += honor;

      const trophy = {
        id: `trophy_${Date.now()}`,
        species: isXeno ? 'xenomorph_skull' : 'human_skull_spine',
        honorValue: honor,
        isPolished: true,
      };

      state.claimedTrophies.push(trophy);
      state.activeVictim = null;

      return {
        completed: true,
        trophy,
        honorAwarded: honor,
      };
    }
    return { phase: 'CLEANSE', progress: state.phaseTimer / CEREMONY_CONSTANTS.SOLVENT_CLEANSE_DURATION };
  }

  return null;
}
