// Système d'Extraction de Fluide Spinal Xénomorphe & Sérum Génétique (The Predator 2018 — Lore 1:1)
// Référence canonique : The Predator (2018) — Prélèvement d'ADN spinal sur des spécimens aliens pour synthétiser un sérum d'hybridation Yautja

import { audioSynth } from '../AudioSynthesizer.js';

export const EXTRACTION_CONSTANTS = {
  VIALS_FOR_SERUM: 2,                  // Nombre de fioles de liquide céphalo-rachidien requis
  SERUM_DURATION: 28.0,                // Durée de l'effet d'amplification génétique (s)
  SPEED_MULTIPLIER: 1.35,              // +35% de vitesse de déplacement
  MELEE_DAMAGE_MULTIPLIER: 1.40,       // +40% de puissance de frappe
  DAMAGE_MITIGATION: 0.25,             // 25% de réduction des dégâts reçus
};

export function createSpinalFluidHarvestState() {
  return {
    collectedVials: 0,
    isSerumActive: false,
    serumTimer: 0.0,
    extractionsCount: 0,
    serumsInjectedCount: 0,
  };
}

export function extractSpinalFluid(state, slainEntity, audio = audioSynth) {
  if (!state || !slainEntity || !slainEntity.isDead) return false;

  const isXeno = slainEntity.species === 'xenomorph' || slainEntity.role?.includes('xeno');
  if (!isXeno || slainEntity.isFluidExtracted) return false;

  slainEntity.isFluidExtracted = true;
  state.collectedVials++;
  state.extractionsCount++;

  if (audio && typeof audio.playSpinalFluidHarvesterSyringe === 'function') {
    audio.playSpinalFluidHarvesterSyringe();
  }

  return true;
}

export function injectGeneticSerum(state, hunterEntity, audio = audioSynth) {
  if (!state || state.collectedVials < EXTRACTION_CONSTANTS.VIALS_FOR_SERUM || !hunterEntity) {
    return false;
  }

  state.collectedVials -= EXTRACTION_CONSTANTS.VIALS_FOR_SERUM;
  state.isSerumActive = true;
  state.serumTimer = EXTRACTION_CONSTANTS.SERUM_DURATION;
  state.serumsInjectedCount++;

  hunterEntity.speedMultiplier = EXTRACTION_CONSTANTS.SPEED_MULTIPLIER;
  hunterEntity.damageMultiplier = EXTRACTION_CONSTANTS.MELEE_DAMAGE_MULTIPLIER;
  hunterEntity.dermalHardening = EXTRACTION_CONSTANTS.DAMAGE_MITIGATION;

  if (audio && typeof audio.playGeneticSerumSurgeHeartbeat === 'function') {
    audio.playGeneticSerumSurgeHeartbeat();
  }

  return true;
}

export function updateSpinalFluidHarvest(state, delta, hunterEntity) {
  if (!state || !state.isSerumActive) return;
  const dt = Math.max(0, Number(delta) || 0);

  state.serumTimer -= dt;

  if (state.serumTimer <= 0) {
    state.isSerumActive = false;
    state.serumTimer = 0.0;

    if (hunterEntity) {
      hunterEntity.speedMultiplier = 1.0;
      hunterEntity.damageMultiplier = 1.0;
      hunterEntity.dermalHardening = 0.0;
    }
  }
}
