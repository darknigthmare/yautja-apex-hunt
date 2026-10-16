// Système de canalisation de la foudre et surpuissance énergétique (Lore 1:1)
// Référence canonique : Predator 2 (1990) - Le City Hunter au sommet du gratte-ciel canalisant l'éclair dans sa lance

import { audioSynth } from '../AudioSynthesizer.js';

export const LIGHTNING_CONSTANTS = {
  MIN_ELEVATION_METERS: 22.0,   // Doit être en hauteur (toit, corniche)
  SUPERCHARGE_DURATION: 20.0,   // Durée du boost énergétique
  ENERGY_COST_DISCOUNT: 0.5,    // Réduction de 50% du coût de tir de plasma
};

export function createLightningRechargeState() {
  return {
    isSupercharged: false,
    remainingSuperchargeTimer: 0,
    totalLightningStrikesChanneled: 0,
  };
}

export function canChannelLightning(state, hunter, environment = {}) {
  if (!hunter) return false;
  const isHighAltitude = (hunter.y || 0) >= LIGHTNING_CONSTANTS.MIN_ELEVATION_METERS;
  const hasSpearRaised = Boolean(hunter.isCombiStickRaised);
  const isStorming = Boolean(environment.isThunderstorm || environment.isStorming);
  return isHighAltitude && hasSpearRaised && isStorming;
}

export function channelLightningStrike(state, hunter, audio = audioSynth) {
  if (!state || !hunter) return false;

  state.isSupercharged = true;
  state.remainingSuperchargeTimer = LIGHTNING_CONSTANTS.SUPERCHARGE_DURATION;
  state.totalLightningStrikesChanneled += 1;

  // Rechargement immédiat des batteries de la combinaison à 100%
  if (hunter.energy !== undefined && hunter.maxEnergy !== undefined) {
    hunter.energy = hunter.maxEnergy;
  }
  hunter.isSupercharged = true;
  hunter.plasmaCostDiscount = LIGHTNING_CONSTANTS.ENERGY_COST_DISCOUNT;

  if (audio) {
    if (typeof audio.playCombiLightningChannel === 'function') {
      audio.playCombiLightningChannel();
    }
    if (typeof audio.playThunderCrack === 'function') {
      audio.playThunderCrack();
    }
  }
  return true;
}

export function updateLightningSupercharge(state, delta, hunter) {
  if (!state || !state.isSupercharged) return;
  const dt = Math.max(0, Number(delta) || 0);

  state.remainingSuperchargeTimer -= dt;
  if (state.remainingSuperchargeTimer <= 0) {
    state.isSupercharged = false;
    state.remainingSuperchargeTimer = 0;
    if (hunter) {
      hunter.isSupercharged = false;
      hunter.plasmaCostDiscount = 0;
    }
  }
}
