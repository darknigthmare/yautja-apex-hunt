// Système d'Attaque en Piqué et Désignation Laser du Drone Faucon (Predators 2010 — Lore 1:1)
// Référence canonique : Predators (2010) — Le Falconer Predator coordonnant son drone biomécanique pour des piqués plongeants meurtriers et le marquage laser d'artillerie.

import { audioSynth } from '../AudioSynthesizer.js';

export const FALCON_HARASS_CONSTANTS = {
  DIVE_VELOCITY: 35.0,             // Vélocité en piqué vertical (m/s)
  TALON_SLASH_DAMAGE: 65.0,        // Dégâts tranchants des serres de titane Yautja
  STUN_DURATION_SEC: 1.5,          // Durée d'étourdissement de la cible au contact
  LASER_ACCURACY_BOOST: 0.45,      // Bonus de précision accordé aux tirs du Plasmacaster
  HARASS_COOLDOWN_SEC: 8.0,        // Temps de recharge entre deux piqués
};

export const HARASS_STATES = {
  HOVERING: 'HOVERING',
  DIVING: 'DIVING',
  RECOVERING: 'RECOVERING',
};

export function createFalconHarassState() {
  return {
    state: HARASS_STATES.HOVERING,
    cooldownRemaining: 0.0,
    currentDiveProgress: 0.0,
    activeDesignatedTarget: null,
  };
}

export function commandDroneDiveBomb(state, target, audio = audioSynth) {
  if (!state || !target) return { success: false, reason: 'INVALID_PARAMS' };
  if (state.cooldownRemaining > 0) return { success: false, reason: 'COOLDOWN_ACTIVE' };

  state.state = HARASS_STATES.DIVING;
  state.currentDiveProgress = 1.0;
  state.cooldownRemaining = FALCON_HARASS_CONSTANTS.HARASS_COOLDOWN_SEC;

  if (audio && typeof audio.playFalconDiveScreech === 'function') {
    audio.playFalconDiveScreech();
  }

  // Application immédiate de l'impact tranchant des serres
  const damage = FALCON_HARASS_CONSTANTS.TALON_SLASH_DAMAGE;
  if (typeof target.takeDamage === 'function') {
    target.takeDamage(damage);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - damage);
  }

  target.isStunned = true;
  target.stunTimer = FALCON_HARASS_CONSTANTS.STUN_DURATION_SEC;

  return {
    success: true,
    damageDealt: damage,
    targetStunned: true,
  };
}

export function engageLaserDesignator(state, target, audio = audioSynth) {
  if (!state || !target) return false;

  state.activeDesignatedTarget = target.id || 'target_designated';
  target.isLaserDesignated = true;
  target.incomingAccuracyModifier = 1.0 + FALCON_HARASS_CONSTANTS.LASER_ACCURACY_BOOST;

  if (audio && typeof audio.playLaserDesignatorChirp === 'function') {
    audio.playLaserDesignatorChirp();
  }

  return true;
}

export function updateFalconHarassSystem(state, delta = 0.1, targets = []) {
  if (!state) return;

  if (state.cooldownRemaining > 0) {
    state.cooldownRemaining = Math.max(0, state.cooldownRemaining - delta);
    if (state.cooldownRemaining === 0) {
      state.state = HARASS_STATES.HOVERING;
    }
  }

  // Mise à jour de l'étourdissement des cibles
  for (const target of targets) {
    if (target && target.isStunned && target.stunTimer > 0) {
      target.stunTimer = Math.max(0, target.stunTimer - delta);
      if (target.stunTimer === 0) {
        target.isStunned = false;
      }
    }
  }
}
