// Système de Filet à Rétention Électromagnétique et Compression Thoracique (Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) — Le lance-filet du City Hunter envoyant des impulsions électromagnétiques resserrant les mailles d'alliage jusqu'à broyer les côtes de la proie.

import { audioSynth } from '../AudioSynthesizer.js';

export const CONSTRICTION_CONSTANTS = {
  INITIAL_ENTANGLE_DAMAGE: 45.0,      // Dégâts initiaux d'impact et lacération
  PULSE_CRUSH_DAMAGE: 30.0,           // Dégâts de broyage par impulsion magnétique
  MAX_PULSES: 3,                      // Nombre d'impulsions de serrage successives
  COMPRESSION_INTERVAL_SEC: 1.0,      // Intervalle entre chaque impulsion
};

export function createConstrictionNetState() {
  return {
    isSnaring: false,
    snaredTarget: null,
    pulsesRemaining: CONSTRICTION_CONSTANTS.MAX_PULSES,
    pulseTimer: 0.0,
  };
}

export function launchElectromagneticNet(state, target, audio = audioSynth) {
  if (!state || state.isSnaring || !target) return false;

  state.isSnaring = true;
  state.snaredTarget = target;
  state.pulsesRemaining = CONSTRICTION_CONSTANTS.MAX_PULSES;
  state.pulseTimer = CONSTRICTION_CONSTANTS.COMPRESSION_INTERVAL_SEC;

  target.isNetSnared = true;
  target.canMove = false;

  if (audio && typeof audio.playElectromagneticNetHumCrack === 'function') {
    audio.playElectromagneticNetHumCrack();
  }

  const damage = CONSTRICTION_CONSTANTS.INITIAL_ENTANGLE_DAMAGE;
  if (typeof target.takeDamage === 'function') {
    target.takeDamage(damage);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - damage);
  }

  return true;
}

export function updateElectromagneticCompression(state, delta = 0.1, audio = audioSynth) {
  if (!state || !state.isSnaring || !state.snaredTarget) return { pulsed: false };

  state.pulseTimer -= delta;

  if (state.pulseTimer <= 0 && state.pulsesRemaining > 0) {
    state.pulsesRemaining--;
    state.pulseTimer = CONSTRICTION_CONSTANTS.COMPRESSION_INTERVAL_SEC;

    if (audio && typeof audio.playThoracicRibCompressionCrunch === 'function') {
      audio.playThoracicRibCompressionCrunch();
    }

    const damage = CONSTRICTION_CONSTANTS.PULSE_CRUSH_DAMAGE;
    const target = state.snaredTarget;
    if (typeof target.takeDamage === 'function') {
      target.takeDamage(damage);
    } else if (typeof target.health === 'number') {
      target.health = Math.max(0, target.health - damage);
    }
    target.ribsCrushed = true;

    return {
      pulsed: true,
      damageDealt: damage,
      pulsesLeft: state.pulsesRemaining,
    };
  }

  return { pulsed: false };
}
