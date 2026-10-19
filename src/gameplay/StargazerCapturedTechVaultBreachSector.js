// Coffre Blindé Stargazer & Récupération de Technologie Capturée (The Predator 2018 — Lore 1:1)
// Référence canonique : The Predator (2018) — Les caissons de confinement du laboratoire Stargazer où l'équipement du Fugitive Predator est étudié, que le chasseur brise pour rééquiper son arsenal complet.

import { audioSynth } from '../AudioSynthesizer.js';

export const STARGAZER_VAULT_CONSTANTS = {
  ARMOR_RESTORED_BONUS: 100,         // Intégrité d'armure restaurée à la récupération
  MAX_ENERGY_UPGRADE_BONUS: 40,      // Augmentation de capacité énergétique maximale
};

export function createStargazerVaultSectorState() {
  return {
    isVaultLocked: true,
    isTechRecovered: false,
  };
}

export function breachStargazerTechVault(state, hunter, audio = audioSynth) {
  if (!state || !state.isVaultLocked || !hunter) {
    return { breached: false };
  }

  state.isVaultLocked = false;
  state.isTechRecovered = true;

  if (audio && typeof audio.playStargazerVaultLockBreachPop === 'function') {
    audio.playStargazerVaultLockBreachPop();
  }

  hunter.hasRecoveredFullArsenal = true;
  hunter.armor = (hunter.armor || 0) + STARGAZER_VAULT_CONSTANTS.ARMOR_RESTORED_BONUS;
  hunter.maxEnergy = (hunter.maxEnergy || 100) + STARGAZER_VAULT_CONSTANTS.MAX_ENERGY_UPGRADE_BONUS;
  hunter.energy = hunter.maxEnergy;

  return {
    breached: true,
    armorGranted: STARGAZER_VAULT_CONSTANTS.ARMOR_RESTORED_BONUS,
    newMaxEnergy: hunter.maxEnergy,
  };
}
