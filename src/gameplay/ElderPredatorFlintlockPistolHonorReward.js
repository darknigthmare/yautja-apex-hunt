// Système de Récompense d'Honneur : Pistolet à Silex 1715 de l'Elder (Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) — L'Elder Greyback remet à Harrigan le pistolet à silex gravé "Raphael Adolini 1715" ("Take it")

import { audioSynth } from '../AudioSynthesizer.js';

export const FLINTLOCK_CONSTANTS = {
  LEAD_BALL_DAMAGE: 190.0,             // Dégâts cinétiques massifs de la balle de plomb
  RELOAD_DURATION: 3.2,                // Temps de rechargement à la baguette et poudre noire (s)
  MAX_LEAD_BALLS: 6,
  HONOR_REWARD_POINTS: 300,
};

export function createElderFlintlockState() {
  return {
    isHeirloomAwarded: false,
    ballsLoaded: 1,
    ammoReserves: FLINTLOCK_CONSTANTS.MAX_LEAD_BALLS - 1,
    isReloading: false,
    reloadProgress: 0.0,
    shotsFiredCount: 0,
  };
}

export function awardFlintlockFromElder(state, receiverEntity) {
  if (!state || state.isHeirloomAwarded) return false;

  state.isHeirloomAwarded = true;
  if (receiverEntity) {
    receiverEntity.hasFlintlock1715 = true;
    receiverEntity.honorPoints = (receiverEntity.honorPoints || 0) + FLINTLOCK_CONSTANTS.HONOR_REWARD_POINTS;
  }
  return true;
}

export function fireFlintlockPistol(state, targetEntity, audio = audioSynth) {
  if (!state || !state.isHeirloomAwarded || state.ballsLoaded <= 0 || state.isReloading) {
    return { fired: false };
  }

  state.ballsLoaded--;
  state.shotsFiredCount++;

  if (audio && typeof audio.playFlintlockHammerClickSnap === 'function') {
    audio.playFlintlockHammerClickSnap();
  }
  if (audio && typeof audio.playFlintlockBlackPowderBoom === 'function') {
    audio.playFlintlockBlackPowderBoom();
  }

  if (targetEntity) {
    if (typeof targetEntity.takeDamage === 'function') {
      targetEntity.takeDamage(FLINTLOCK_CONSTANTS.LEAD_BALL_DAMAGE, 'flintlock_lead_ball');
    } else if (typeof targetEntity.health === 'number') {
      targetEntity.health = Math.max(0, targetEntity.health - FLINTLOCK_CONSTANTS.LEAD_BALL_DAMAGE);
    }
    targetEntity.isKnockedBack = true;
    targetEntity.isStaggered = true;
    targetEntity.staggerTimer = 2.0;
  }

  return { fired: true, damageDealt: FLINTLOCK_CONSTANTS.LEAD_BALL_DAMAGE };
}

export function reloadFlintlock(state) {
  if (!state || !state.isHeirloomAwarded || state.ballsLoaded > 0 || state.ammoReserves <= 0 || state.isReloading) {
    return false;
  }

  state.isReloading = true;
  state.reloadProgress = 0.0;
  return true;
}

export function updateFlintlock(state, delta) {
  if (!state || !state.isReloading) return;
  const dt = Math.max(0, Number(delta) || 0);

  state.reloadProgress += dt;
  if (state.reloadProgress >= FLINTLOCK_CONSTANTS.RELOAD_DURATION) {
    state.isReloading = false;
    state.reloadProgress = 0.0;
    state.ballsLoaded = 1;
    state.ammoReserves = Math.max(0, state.ammoReserves - 1);
  }
}
