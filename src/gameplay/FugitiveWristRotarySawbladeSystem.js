// Système de Scie Circulaire Rotative de Poignet (The Predator 2018 — Lore 1:1)
// Référence canonique : The Predator (2018) — Le Fugitive Predator déployant sa lame de scie circulaire rétractable à 3000 RPM pour découper les blindages lourds du laboratoire Stargazer.

import { audioSynth } from '../AudioSynthesizer.js';

export const ROTARY_SAW_CONSTANTS = {
  SPIN_UP_TIME_SEC: 0.25,             // Temps de montée en régime supersonique
  ARMOR_SHRED_DAMAGE: 150.0,          // Dégâts de découpe directe de chair et métaux
  ARMOR_PIERCING_MULTIPLIER: 2.2,     // Multiplicateur contre les unités blindées
  ENERGY_COST: 15.0,                  // Consommation de condensateur de gantelet
};

export function createRotarySawState() {
  return {
    isDeployed: false,
    isSpinning: false,
    remainingEnergy: 100.0,
    totalShredsCount: 0,
  };
}

export function deployAndSpinSawblade(state, audio = audioSynth) {
  if (!state || state.isSpinning) return false;

  state.isDeployed = true;
  state.isSpinning = true;

  if (audio && typeof audio.playRotarySawbladeSpinWhine === 'function') {
    audio.playRotarySawbladeSpinWhine();
  }

  return true;
}

export function executeSawbladeArmorShred(state, target, audio = audioSynth) {
  if (!state || !state.isSpinning || !target) {
    return { success: false, reason: 'SAW_NOT_ACTIVE' };
  }

  if (audio && typeof audio.playSawbladeArmorGougeSparks === 'function') {
    audio.playSawbladeArmorGougeSparks();
  }

  // Déchiquetage du blindage
  let damage = ROTARY_SAW_CONSTANTS.ARMOR_SHRED_DAMAGE;
  if (target.armor && target.armor > 0) {
    damage *= ROTARY_SAW_CONSTANTS.ARMOR_PIERCING_MULTIPLIER;
    target.armor = 0; // Broyage complet du plastron
    target.armorBroken = true;
  }

  if (typeof target.takeDamage === 'function') {
    target.takeDamage(damage);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - damage);
  }

  target.isLacerated = true;
  state.totalShredsCount++;

  return {
    success: true,
    damageDealt: damage,
    armorShredded: true,
  };
}

export function retractRotarySawblade(state) {
  if (!state) return false;
  state.isDeployed = false;
  state.isSpinning = false;
  return true;
}
