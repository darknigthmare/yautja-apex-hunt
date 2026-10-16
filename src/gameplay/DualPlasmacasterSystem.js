// Système de double canon à plasma d'épaule et ciblage jumelé indépendant (Lore 1:1)
// Référence canonique : Aliens vs. Predator: Requiem (2007) - Wolf maniant deux canons d'épaule

import { audioSynth } from '../AudioSynthesizer.js';

export const DUAL_PLASMA_MODES = {
  INDEPENDENT_LOCK: 'INDEPENDENT_LOCK', // Deux cibles distinctes traquées en parallèle
  SYNCHRONIZED_VOLLEY: 'SYNCHRONIZED_VOLLEY', // Tir concentré double sur une cible prioritaire
};

export const DUAL_PLASMA_CONSTANTS = {
  ENERGY_PER_BOLT: 18.0,
  BASE_DAMAGE_PER_BOLT: 85.0,
  VOLLEY_COOLDOWN: 1.1,
  INTERLEAVED_INTERVAL: 0.18,
};

export function createDualPlasmacasterState() {
  return {
    mode: DUAL_PLASMA_MODES.INDEPENDENT_LOCK,
    leftTarget: null,
    rightTarget: null,
    leftLocked: false,
    rightLocked: false,
    cooldownTimer: 0,
    totalDualBoltsFired: 0,
  };
}

export function acquireDualTargets(state, targetA, targetB = null, audio = audioSynth) {
  if (!state) return false;

  state.leftTarget = targetA || null;
  state.leftLocked = Boolean(targetA);

  if (targetB && targetB !== targetA) {
    state.rightTarget = targetB;
    state.rightLocked = true;
    state.mode = DUAL_PLASMA_MODES.INDEPENDENT_LOCK;
  } else {
    state.rightTarget = targetA;
    state.rightLocked = Boolean(targetA);
    state.mode = DUAL_PLASMA_MODES.SYNCHRONIZED_VOLLEY;
  }

  if ((state.leftLocked || state.rightLocked) && audio && typeof audio.playDualPlasmaLock === 'function') {
    audio.playDualPlasmaLock();
  }
  return true;
}

export function fireTwinVolley(state, availableEnergy, audio = audioSynth) {
  if (!state || state.cooldownTimer > 0) return null;
  const energyRequired = DUAL_PLASMA_CONSTANTS.ENERGY_PER_BOLT * 2.0;
  if ((availableEnergy || 0) < energyRequired) return null;

  state.cooldownTimer = DUAL_PLASMA_CONSTANTS.VOLLEY_COOLDOWN;
  state.totalDualBoltsFired += 2;

  const results = {
    boltsFired: 2,
    energySpent: energyRequired,
    mode: state.mode,
    hits: [],
  };

  // Traitement des cibles
  if (state.mode === DUAL_PLASMA_MODES.SYNCHRONIZED_VOLLEY && state.leftTarget) {
    const totalDmg = DUAL_PLASMA_CONSTANTS.BASE_DAMAGE_PER_BOLT * 2.0;
    if (typeof state.leftTarget.applyDamage === 'function') {
      state.leftTarget.applyDamage(totalDmg, 'twin_plasma_burst');
    } else if (typeof state.leftTarget.health === 'number') {
      state.leftTarget.health = Math.max(0, state.leftTarget.health - totalDmg);
    }
    results.hits.push({ target: state.leftTarget, damage: totalDmg });
  } else {
    if (state.leftTarget) {
      const dmg = DUAL_PLASMA_CONSTANTS.BASE_DAMAGE_PER_BOLT;
      if (typeof state.leftTarget.applyDamage === 'function') state.leftTarget.applyDamage(dmg, 'plasma_bolt');
      else if (typeof state.leftTarget.health === 'number') state.leftTarget.health = Math.max(0, state.leftTarget.health - dmg);
      results.hits.push({ target: state.leftTarget, damage: dmg });
    }
    if (state.rightTarget) {
      const dmg = DUAL_PLASMA_CONSTANTS.BASE_DAMAGE_PER_BOLT;
      if (typeof state.rightTarget.applyDamage === 'function') state.rightTarget.applyDamage(dmg, 'plasma_bolt');
      else if (typeof state.rightTarget.health === 'number') state.rightTarget.health = Math.max(0, state.rightTarget.health - dmg);
      results.hits.push({ target: state.rightTarget, damage: dmg });
    }
  }

  if (audio && typeof audio.playTwinPlasmaFire === 'function') {
    audio.playTwinPlasmaFire();
  }
  return results;
}

export function updateDualPlasmacasters(state, delta) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.cooldownTimer > 0) {
    state.cooldownTimer = Math.max(0, state.cooldownTimer - dt);
  }
}
