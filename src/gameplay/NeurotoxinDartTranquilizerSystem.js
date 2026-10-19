// Système de Dard Neurotoxique et Paralysie Musculaire (Predators 2010 / Comics — Lore 1:1)
// Référence canonique : Predators (2010) & Comics — Les Super Predators projetant des dards imprégnés de venin botanique exotique pour paralyser et affaiblir les proies avant le démembrement.

import { audioSynth } from '../AudioSynthesizer.js';

export const NEUROTOXIN_CONSTANTS = {
  PARALYSIS_DURATION_SEC: 3.5,         // Durée d'engourdissement neuromusculaire
  TOXIN_DOT_DAMAGE_PER_SEC: 8.0,       // Dégâts toxiques légers continus
  MOTOR_SLOWDOWN_FACTOR: 0.25,         // Vitesse de déplacement réduite à 25%
  AMMO_COUNT: 4,                       // Nombre de dards de réserve dans le gantelet
};

export function createNeurotoxinState() {
  return {
    remainingDarts: NEUROTOXIN_CONSTANTS.AMMO_COUNT,
    afflictedVictims: new Map(), // victimId -> { remainingTimer, poisonDmgAccumulated }
  };
}

export function fireNeurotoxinDart(state, target, audio = audioSynth) {
  if (!state || state.remainingDarts <= 0 || !target) {
    return { success: false, reason: 'NO_DARTS_OR_INVALID_TARGET' };
  }

  state.remainingDarts--;

  if (audio && typeof audio.playNeurotoxinDartDartPuff === 'function') {
    audio.playNeurotoxinDartDartPuff();
  }

  const victimId = target.id || 'target_prey';
  state.afflictedVictims.set(victimId, {
    remainingTimer: NEUROTOXIN_CONSTANTS.PARALYSIS_DURATION_SEC,
    poisonDmgAccumulated: 0,
  });

  target.isNeurotoxinAfflicted = true;
  target.speedMultiplier = NEUROTOXIN_CONSTANTS.MOTOR_SLOWDOWN_FACTOR;

  return {
    success: true,
    victimId,
    remainingDarts: state.remainingDarts,
  };
}

export function updateNeurotoxin(state, delta = 0.1, targets = []) {
  if (!state) return;

  state.afflictedVictims.forEach((data, victimId) => {
    data.remainingTimer -= delta;

    const target = targets.find((t) => (t.id || 'target_prey') === victimId);
    if (target) {
      const dmg = NEUROTOXIN_CONSTANTS.TOXIN_DOT_DAMAGE_PER_SEC * delta;
      if (typeof target.takeDamage === 'function') {
        target.takeDamage(dmg);
      } else if (typeof target.health === 'number') {
        target.health = Math.max(1, target.health - dmg);
      }
      data.poisonDmgAccumulated += dmg;

      if (data.remainingTimer <= 0) {
        target.isNeurotoxinAfflicted = false;
        target.speedMultiplier = 1.0;
        state.afflictedVictims.delete(victimId);
      }
    }
  });
}
