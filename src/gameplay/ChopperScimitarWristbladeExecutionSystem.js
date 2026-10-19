// Lames Cimeterres de Poignet & Exécution en Ciseaux de Chopper (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Les longues lames cimeterres courbes montées sur les deux avant-bras de Chopper Predator permettant une attaque croisée en ciseaux dévastatrice.

import { audioSynth } from '../AudioSynthesizer.js';

export const CHOPPER_SCIMITAR_CONSTANTS = {
  SCISSOR_EXECUTION_DAMAGE: 265,     // Dégâts de cisaillement croisé des deux lames cimeterres
  TROPHY_SKULL_PRESTIGE_BONUS: 100,  // Bonus d'honneur de collectionneur de crânes (Chopper)
};

export function createChopperScimitarState() {
  return {
    areScimitarsCrossed: false,
    scissorExecutionsCount: 0,
    trophySkullsMounted: 2,
  };
}

export function crossChopperScimitarBlades(state, audio = audioSynth) {
  if (!state) return false;
  state.areScimitarsCrossed = true;

  if (audio && typeof audio.playChopperScimitarBladesCrossShink === 'function') {
    audio.playChopperScimitarBladesCrossShink();
  }

  return true;
}

export function executeScissorScimitarDecapitation(state, target, audio = audioSynth) {
  if (!state || !state.areScimitarsCrossed || !target) {
    return { executed: false, damageDealt: 0 };
  }

  state.areScimitarsCrossed = false;
  state.scissorExecutionsCount++;
  state.trophySkullsMounted++;

  if (audio && typeof audio.playScissorDecapitationExecutionCrunch === 'function') {
    audio.playScissorDecapitationExecutionCrunch();
  }

  target.isScissorExecuted = true;
  if (typeof target.takeDamage === 'function') {
    target.takeDamage(CHOPPER_SCIMITAR_CONSTANTS.SCISSOR_EXECUTION_DAMAGE);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - CHOPPER_SCIMITAR_CONSTANTS.SCISSOR_EXECUTION_DAMAGE);
  }

  return {
    executed: true,
    damageDealt: CHOPPER_SCIMITAR_CONSTANTS.SCISSOR_EXECUTION_DAMAGE,
    trophySkullsTotal: state.trophySkullsMounted,
  };
}
