// Système de Télémétrie Rétinienne Prédictive et Anticipation Balistique (The Predator 2018 — Lore 1:1)
// Référence canonique : The Predator (2018) — L'Assassin Predator traçant en temps réel les vecteurs de visée des fusils d'assaut dans sa cornée pour esquiver les rafales et intercepter les cibles.

import { audioSynth } from '../AudioSynthesizer.js';

export const RETINAL_PREDICT_CONSTANTS = {
  PREDICTION_WINDOW_SEC: 0.8,         // Fenêtre de prédiction avant départ du coup
  EVASION_REFLEX_CHANCE: 0.80,        // 80% de chance d'esquiver la trajectoire balistique
  COUNTER_CRIT_MULTIPLIER: 1.40,      // +40% de dégâts sur contre-attaque en interception
};

export function createPredictiveTelemetryState() {
  return {
    isTelemetryActive: false,
    predictedVectors: [], // Array of { shooterId, interceptPoint: {x, z}, confidence }
    isEvasionLocked: false,
    totalDodgesExecuted: 0,
  };
}

export function trackIncomingAimVector(state, shooter, userPos = { x: 0, z: 0 }, audio = audioSynth) {
  if (!state || !shooter) return { tracked: false };

  const dx = (userPos.x || 0) - (shooter.x || 0);
  const dz = (userPos.z || 0) - (shooter.z || 0);
  const dist = Math.hypot(dx, dz);

  if (dist > 0 && dist <= 30.0) {
    state.isTelemetryActive = true;

    if (audio && typeof audio.playRetinalPredictiveTargetPip === 'function') {
      audio.playRetinalPredictiveTargetPip();
    }

    const vector = {
      shooterId: shooter.id || 'shooter_hostile',
      dist,
      predictedImpactX: userPos.x,
      predictedImpactZ: userPos.z,
    };
    state.predictedVectors.push(vector);

    return {
      tracked: true,
      vector,
    };
  }

  return { tracked: false };
}

export function lockPredictiveEvasion(state, audio = audioSynth) {
  if (!state || !state.isTelemetryActive) return false;

  state.isEvasionLocked = true;

  if (audio && typeof audio.playPredictiveLockAcquiredChord === 'function') {
    audio.playPredictiveLockAcquiredChord();
  }

  return true;
}

export function evaluateIncomingProjectileDodge(state, incomingDamage = 50.0) {
  if (!state || !state.isEvasionLocked) {
    return { dodged: false, damageTaken: incomingDamage };
  }

  state.totalDodgesExecuted++;
  state.isEvasionLocked = false;
  state.isTelemetryActive = false;
  state.predictedVectors = [];

  return {
    dodged: true,
    damageTaken: 0,
    counterAttackBuff: RETINAL_PREDICT_CONSTANTS.COUNTER_CRIT_MULTIPLIER,
  };
}
