// Système d'Onguent Biologique Cicatrisant et Neutralisation d'Acide (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Scar appliquant un baume gélatineux réparateur pour neutraliser les brûlures d'acide de sang xénomorphe sur son armure et sa chair.

import { audioSynth } from '../AudioSynthesizer.js';

export const BALM_CONSTANTS = {
  INSTANT_HEALTH_RECOVERY: 45.0,       // Points de vie immédiatement régénérés
  ACID_CORROSION_CLEAR: true,          // Neutralisation instantanée de l'acide actif
  MAX_BALM_VIALS: 3,                   // Nombre de capsules d'onguent disponibles
};

export function createCauterizationBalmState() {
  return {
    remainingBalmVials: BALM_CONSTANTS.MAX_BALM_VIALS,
    treatmentsAppliedCount: 0,
  };
}

export function applyBiologicalBalm(state, patient, audio = audioSynth) {
  if (!state || state.remainingBalmVials <= 0 || !patient) {
    return { success: false, reason: 'NO_BALM_REMAINING' };
  }

  state.remainingBalmVials--;
  state.treatmentsAppliedCount++;

  if (audio && typeof audio.playBiologicalBalmSizzleSooth === 'function') {
    audio.playBiologicalBalmSizzleSooth();
  }

  // Neutralisation des résidus acides
  patient.isAcidCorroding = false;
  patient.acidBurnDuration = 0;

  const heal = BALM_CONSTANTS.INSTANT_HEALTH_RECOVERY;
  if (typeof patient.health === 'number') {
    patient.health = Math.min(100, patient.health + heal);
  }

  return {
    success: true,
    acidNeutralized: true,
    healthRestored: heal,
    vialsRemaining: state.remainingBalmVials,
  };
}
