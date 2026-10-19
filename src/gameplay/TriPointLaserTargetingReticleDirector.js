// Directeur de Viseur Laser Tri-Point Convergent et Acquisition Rétinienne (Predator 1987 — Lore 1:1)
// Référence canonique : Predator (1987) — Les trois points laser rouges dessinant un triangle qui se resserre sur le torse des cibles jusqu'au verrouillage optimal du Plasmacaster.

import { audioSynth } from '../AudioSynthesizer.js';

export const TRI_POINT_CONSTANTS = {
  FULL_LOCK_DURATION_SEC: 1.6,         // Temps nécessaire pour une convergence triangulaire parfaite
  INITIAL_TRIANGLE_SPREAD: 1.2,        // Écartement initial des trois faisceaux laser (mètres)
  CRITICAL_DAMAGE_BONUS_MULTIPLIER: 1.8, // Dégâts multipliés si tir déclenché au verrouillage parfait
};

export const RETICLE_STATES = {
  IDLE: 'IDLE',
  TRACKING_CONVERGING: 'TRACKING_CONVERGING',
  LOCKED_PERFECT: 'LOCKED_PERFECT',
};

export function createTriPointTargetingState() {
  return {
    state: RETICLE_STATES.IDLE,
    currentTarget: null,
    lockTimer: 0.0,
    currentTriangleSpread: TRI_POINT_CONSTANTS.INITIAL_TRIANGLE_SPREAD,
    isLockAcquired: false,
  };
}

export function startTriLaserLock(state, target, audio = audioSynth) {
  if (!state || !target) return false;

  state.state = RETICLE_STATES.TRACKING_CONVERGING;
  state.currentTarget = target.id || 'target_prey';
  state.lockTimer = 0.0;
  state.currentTriangleSpread = TRI_POINT_CONSTANTS.INITIAL_TRIANGLE_SPREAD;
  state.isLockAcquired = false;

  if (audio && typeof audio.playTriLaserTargetingHum === 'function') {
    audio.playTriLaserTargetingHum();
  }

  return true;
}

export function updateTriLaserLock(state, delta = 0.1, audio = audioSynth) {
  if (!state || state.state !== RETICLE_STATES.TRACKING_CONVERGING) return;

  state.lockTimer += delta;
  const progress = Math.min(1.0, state.lockTimer / TRI_POINT_CONSTANTS.FULL_LOCK_DURATION_SEC);
  state.currentTriangleSpread = TRI_POINT_CONSTANTS.INITIAL_TRIANGLE_SPREAD * (1.0 - progress);

  if (progress >= 1.0 && !state.isLockAcquired) {
    state.state = RETICLE_STATES.LOCKED_PERFECT;
    state.isLockAcquired = true;
    state.currentTriangleSpread = 0.0;

    if (audio && typeof audio.playTriLaserLockAcquiredChime === 'function') {
      audio.playTriLaserLockAcquiredChime();
    }
  }
}

export function dischargeLockedPlasmacaster(state, target, baseDamage = 80.0) {
  if (!state || !target) return { fired: false };

  let damage = baseDamage;
  if (state.state === RETICLE_STATES.LOCKED_PERFECT) {
    damage *= TRI_POINT_CONSTANTS.CRITICAL_DAMAGE_BONUS_MULTIPLIER;
  }

  if (typeof target.takeDamage === 'function') {
    target.takeDamage(damage);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - damage);
  }

  const wasPerfect = state.state === RETICLE_STATES.LOCKED_PERFECT;

  // Réinitialisation du viseur après le tir
  state.state = RETICLE_STATES.IDLE;
  state.currentTarget = null;
  state.isLockAcquired = false;

  return {
    fired: true,
    damageDealt: damage,
    criticalLock: wasPerfect,
  };
}
