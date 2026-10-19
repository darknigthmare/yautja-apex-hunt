// Secteur de Niveau : Campement des Berserkers & Totem du Primate Yautja (Predators — Lore 1:1)
// Référence canonique : Predators (2010) — Le campement rituel des Super Predators avec cages de gibier et le Jungle Hunter classique crucifié

import { audioSynth } from '../AudioSynthesizer.js';

export const BERSERKER_CAMP_CONSTANTS = {
  CAGE_RADIUS: 2.2,
  TOTEM_RADIUS: 2.5,
  TOTEM_CHAIN_HEALTH: 80.0,            // Résistance des liens retenant le Jungle Hunter
  HONOR_CODE_BONUS: 100,               // Points d'honneur conférés lors de la libération
  CREAK_INTERVAL: 7.0,                 // Ambiance de grincement des totems en os (s)
};

export function createBerserkerCampState(customCages = null) {
  const defaultCages = [
    { id: 'cage_01', x: -6.0, z: -28.0, isOpen: false, prisonerType: 'human_captive', isOccupied: true },
    { id: 'cage_02', x: 6.0,  z: -28.0, isOpen: false, prisonerType: 'alien_quarry',  isOccupied: true },
    { id: 'cage_03', x: 0.0,  z: -38.0, isOpen: false, prisonerType: 'river_ghost',   isOccupied: true },
  ];

  return {
    cages: customCages || defaultCages,
    totem: {
      id: 'classic_hunter_totem',
      x: 0.0,
      y: 0.0,
      z: -30.0,
      chainHealth: BERSERKER_CAMP_CONSTANTS.TOTEM_CHAIN_HEALTH,
      isFreed: false,
      honorGearAwarded: false,
    },
    boneArchesCount: 4,
    totemCreakTimer: 0,
    freedCaptivesCount: 0,
  };
}

export function unlatchPreyCage(state, cageId, audio = audioSynth) {
  if (!state || !state.cages) return { success: false };
  const cage = state.cages.find(c => c.id === cageId);
  if (!cage || cage.isOpen) return { success: false };

  cage.isOpen = true;
  cage.isOccupied = false;
  state.freedCaptivesCount++;

  if (audio && typeof audio.playCageRatchClink === 'function') {
    audio.playCageRatchClink();
  }

  return { success: true, releasedPrisoner: cage.prisonerType };
}

export function cutTotemBonds(state, bladeDamage = 45.0, audio = audioSynth) {
  if (!state || !state.totem || state.totem.isFreed) {
    return { freed: false };
  }

  state.totem.chainHealth = Math.max(0, state.totem.chainHealth - Number(bladeDamage) || 0);

  if (audio && typeof audio.playPredatorTotemCreak === 'function') {
    audio.playPredatorTotemCreak();
  }

  if (state.totem.chainHealth <= 0) {
    state.totem.isFreed = true;
    state.totem.honorGearAwarded = true;
    return {
      freed: true,
      honorBonus: BERSERKER_CAMP_CONSTANTS.HONOR_CODE_BONUS,
      rewardGear: 'classic_jungle_hunter_plasma_caster',
    };
  }

  return { freed: false, remainingChainHealth: state.totem.chainHealth };
}

export function updateBerserkerCampSector(state, delta, audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Ambiance de balancement et grincement des trophées et structures osseuses
  state.totemCreakTimer += dt;
  if (state.totemCreakTimer >= BERSERKER_CAMP_CONSTANTS.CREAK_INTERVAL) {
    state.totemCreakTimer = 0;
    if (audio && typeof audio.playPredatorTotemCreak === 'function') {
      audio.playPredatorTotemCreak();
    }
  }
}
