// Système de Chirurgie de Terrain et Extraction de Shrapnel Yautja (Predator 1987 / Predator 2 — Lore 1:1)
// Référence canonique : Predator (1987) & Predator 2 (1990) — L'intervention chirurgicale d'urgence dans la jungle et l'appartement : extraction de plombs à la pince, cautérisation au brûleur bleu et rugissement d'agonie.

import { audioSynth } from '../AudioSynthesizer.js';

export const SURGERY_CONSTANTS = {
  SHRAPNEL_HEMORRHAGE_DPS: 4.0,        // Dégâts de saignement continu par seconde par éclat
  CAUTERIZATION_INSTANT_HEAL: 35.0,    // Points de vie immédiatement restitués par la cautérisation
  CRYSTAL_REGEN_DPS: 5.0,              // Régénération continue de la pâte cicatrisante de cristal
  CRYSTAL_REGEN_DURATION_SEC: 8.0,     // Durée d'action du baume régénérant
};

export function createFieldSurgeryState() {
  return {
    embeddedShrapnelCount: 0,
    hasActiveHemorrhage: false,
    isCauterized: false,
    crystalRegenTimer: 0.0,
  };
}

export function inflictShrapnelWound(state, count = 2) {
  if (!state) return false;

  state.embeddedShrapnelCount += count;
  state.hasActiveHemorrhage = true;
  state.isCauterized = false;

  return true;
}

export function extractEmbeddedShrapnel(state) {
  if (!state || state.embeddedShrapnelCount <= 0) return { extracted: false };

  state.embeddedShrapnelCount--;
  if (state.embeddedShrapnelCount === 0) {
    state.hasActiveHemorrhage = false;
  }

  return {
    extracted: true,
    remainingShrapnel: state.embeddedShrapnelCount,
    hasActiveHemorrhage: state.hasActiveHemorrhage,
  };
}

export function applyThermalCauterization(state, entity, audio = audioSynth) {
  if (!state || !entity) return { success: false };

  // Stopper définitivement l'hémorragie et cautériser la chair
  state.hasActiveHemorrhage = false;
  state.embeddedShrapnelCount = 0;
  state.isCauterized = true;

  if (audio && typeof audio.playYautjaSurgeryPainRoar === 'function') {
    audio.playYautjaSurgeryPainRoar();
  }

  const heal = SURGERY_CONSTANTS.CAUTERIZATION_INSTANT_HEAL;
  if (typeof entity.health === 'number') {
    entity.health = Math.min(100, entity.health + heal);
  }

  return {
    success: true,
    cauterized: true,
    healthRestored: heal,
  };
}

export function applyHealingCrystalPaste(state) {
  if (!state) return false;

  state.crystalRegenTimer = SURGERY_CONSTANTS.CRYSTAL_REGEN_DURATION_SEC;
  return true;
}

export function updateFieldSurgery(state, delta = 0.1, entity = null) {
  if (!state) return;

  // Hémorragie si éclats non extraits
  if (state.hasActiveHemorrhage && state.embeddedShrapnelCount > 0 && entity) {
    const bleedDamage = state.embeddedShrapnelCount * SURGERY_CONSTANTS.SHRAPNEL_HEMORRHAGE_DPS * delta;
    if (typeof entity.takeDamage === 'function') {
      entity.takeDamage(bleedDamage);
    } else if (typeof entity.health === 'number') {
      entity.health = Math.max(0, entity.health - bleedDamage);
    }
  }

  // Régénération par pâte cicatrisante
  if (state.crystalRegenTimer > 0) {
    state.crystalRegenTimer = Math.max(0, state.crystalRegenTimer - delta);
    if (entity && typeof entity.health === 'number') {
      entity.health = Math.min(100, entity.health + SURGERY_CONSTANTS.CRYSTAL_REGEN_DPS * delta);
    }
  }
}
