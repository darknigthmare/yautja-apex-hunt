// Système de Sérum Surrénalien Mutagène de Reine Xénomorphe (The Predator 2018 / Comics — Lore 1:1)
// Référence canonique : The Predator (2018) & Comics — Injection de sang et sécrétions royales de Reine Xénomorphe provoquant un afflux musculaire mutagène et une rage berserker.

import { audioSynth } from '../AudioSynthesizer.js';

export const MUTAGENIC_CONSTANTS = {
  SURGE_DURATION_SEC: 10.0,           // Durée de la transe mutagène surrénalienne
  MELEE_POWER_BOOST: 0.60,            // +60% de force de frappe aux wristblades
  DAMAGE_ABSORPTION_BOOST: 0.50,      // +50% de réduction de dégâts subis
  EXHAUSTION_HEALTH_COST: 15.0,       // Contrecoup physique à l'expiration du sérum
};

export function createMutagenicSurgeState() {
  return {
    isSurgeActive: false,
    surgeTimer: 0.0,
    remainingSerumDoses: 2,
    totalSurgesActivated: 0,
  };
}

export function injectQueenMutagenicSerum(state, hunter, audio = audioSynth) {
  if (!state || state.remainingSerumDoses <= 0 || state.isSurgeActive || !hunter) {
    return { success: false, reason: 'CANNOT_INJECT' };
  }

  state.remainingSerumDoses--;
  state.isSurgeActive = true;
  state.surgeTimer = MUTAGENIC_CONSTANTS.SURGE_DURATION_SEC;
  state.totalSurgesActivated++;

  hunter.isMutagenicBerserk = true;
  hunter.meleeDamageMultiplier = 1.0 + MUTAGENIC_CONSTANTS.MELEE_POWER_BOOST;
  hunter.damageResistanceMultiplier = 1.0 - MUTAGENIC_CONSTANTS.DAMAGE_ABSORPTION_BOOST;

  if (audio && typeof audio.playMutagenicQueenBloodSurge === 'function') {
    audio.playMutagenicQueenBloodSurge();
  }

  return {
    success: true,
    surgeDuration: MUTAGENIC_CONSTANTS.SURGE_DURATION_SEC,
    dosesLeft: state.remainingSerumDoses,
  };
}

export function updateMutagenicSurge(state, delta = 0.1, hunter = null) {
  if (!state || !state.isSurgeActive) return;

  state.surgeTimer = Math.max(0, state.surgeTimer - delta);

  if (state.surgeTimer === 0) {
    state.isSurgeActive = false;

    if (hunter) {
      hunter.isMutagenicBerserk = false;
      hunter.meleeDamageMultiplier = 1.0;
      hunter.damageResistanceMultiplier = 1.0;

      // Contrecoup d'épuisement cellulaire
      if (typeof hunter.health === 'number') {
        hunter.health = Math.max(1, hunter.health - MUTAGENIC_CONSTANTS.EXHAUSTION_HEALTH_COST);
      }
    }
  }
}
