// Secteur de Sas de Décontamination et Purge du Vaisseau-Mère (AVP 2004 / Predator 2 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) & Predator 2 (1990) — Le sas de décontamination du vaisseau-mère où les chasseurs purgent spores xénomorphes et toxines terrestres avant d'accéder au sanctuaire des trophées.

import { audioSynth } from '../AudioSynthesizer.js';

export const DECONTAM_CONSTANTS = {
  CYCLE_DURATION_SEC: 4.0,            // Durée du cycle de décontamination par vapeur UV
  HEALTH_RESTORED: 50.0,              // Soins antiseptiques reçus lors de la purge
};

export function createDecontaminationAirlockState() {
  return {
    isCycleActive: false,
    cycleTimer: 0.0,
    totalHuntersCleansed: 0,
  };
}

export function activateDecontaminationCycle(state, hunter, audio = audioSynth) {
  if (!state || state.isCycleActive || !hunter) return false;

  state.isCycleActive = true;
  state.cycleTimer = DECONTAM_CONSTANTS.CYCLE_DURATION_SEC;
  state.totalHuntersCleansed++;

  if (audio && typeof audio.playMothershipAirlockDecontamSteam === 'function') {
    audio.playMothershipAirlockDecontamSteam();
  }

  // Purge de toutes les affections biologiques
  hunter.isAcidCorroding = false;
  hunter.isNeurotoxinAfflicted = false;
  hunter.isCoatedInPitch = false;
  hunter.isPoisoned = false;

  if (typeof hunter.health === 'number') {
    hunter.health = Math.min(100, hunter.health + DECONTAM_CONSTANTS.HEALTH_RESTORED);
  }

  return true;
}

export function updateAirlockCycle(state, delta = 0.1) {
  if (!state || !state.isCycleActive) return;

  state.cycleTimer = Math.max(0, state.cycleTimer - delta);
  if (state.cycleTimer === 0) {
    state.isCycleActive = false;
  }
}
