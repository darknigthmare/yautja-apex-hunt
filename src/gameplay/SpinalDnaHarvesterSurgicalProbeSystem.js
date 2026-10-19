// Sonde Chirurgicale d'Extraction d'ADN Spinal & Assimilation (The Predator 2018 — Lore 1:1)
// Référence canonique : The Predator (2018) — Le prélèvement de fluide génétique spinal sur les proies d'élite pour renforcer l'exosquelette sous-cutané et les réflexes métaboliques des Yautja.

import { audioSynth } from '../AudioSynthesizer.js';

export const SPINAL_DNA_CONSTANTS = {
  MAX_armor_BONUS_PER_SAMPLE: 25,    // Bonus d'armure dermique par échantillon spinal
  REFLEX_SPEED_BONUS: 0.12,          // +12% de vitesse réflexe après assimilation
  MAX_ASSIMILATED_STRAINS: 3,        // Nombre maximal de souches génétiques cumulables
};

export function createSpinalDnaProbeState() {
  return {
    harvestedStrainsCount: 0,
    totalArmorBonus: 0,
    reflexMultiplier: 1.0,
  };
}

export function harvestSpinalDnaSample(state, defeatedEliteTarget, hunter = null, audio = audioSynth) {
  if (!state || !defeatedEliteTarget || defeatedEliteTarget.isDnaHarvested) {
    return { harvested: false };
  }

  if (state.harvestedStrainsCount >= SPINAL_DNA_CONSTANTS.MAX_ASSIMILATED_STRAINS) {
    return { harvested: false, reason: 'max_strains_reached' };
  }

  defeatedEliteTarget.isDnaHarvested = true;
  state.harvestedStrainsCount++;
  state.totalArmorBonus += SPINAL_DNA_CONSTANTS.MAX_armor_BONUS_PER_SAMPLE;
  state.reflexMultiplier = Number((state.reflexMultiplier + SPINAL_DNA_CONSTANTS.REFLEX_SPEED_BONUS).toFixed(2));

  if (audio) {
    if (typeof audio.playSpinalDnaProbeNeedleInsert === 'function') {
      audio.playSpinalDnaProbeNeedleInsert();
    }
    if (typeof audio.playGeneticFluidSiphonChime === 'function') {
      audio.playGeneticFluidSiphonChime();
    }
  }

  if (hunter) {
    hunter.bonusDermalArmor = (hunter.bonusDermalArmor || 0) + SPINAL_DNA_CONSTANTS.MAX_armor_BONUS_PER_SAMPLE;
    hunter.reflexSpeedMultiplier = state.reflexMultiplier;
  }

  return {
    harvested: true,
    armorBonusGranted: SPINAL_DNA_CONSTANTS.MAX_armor_BONUS_PER_SAMPLE,
    newReflexMultiplier: state.reflexMultiplier,
  };
}
