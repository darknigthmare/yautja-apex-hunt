// Bolas Cinétiques à Câble Monofilament Thermique (Predators / Extended Lore — Fidélité 1:1)
// Référence canonique : Predators & Lore Yautja — Les bolas lestées reliées par un fil monomoléculaire chauffé qui s'enroulent autour des jambes d'une proie en fuite, la fauchant et cautérisant ses jambières.

import { audioSynth } from '../AudioSynthesizer.js';

export const THERMAL_BOLA_CONSTANTS = {
  MAX_THROW_RANGE_M: 18.0,           // Portée de lancer des bolas
  THERMAL_CONSTRICT_DAMAGE: 110,     // Dégâts de serrage thermique aux jambes
  IMMOBILIZE_DURATION_SEC: 4.5,      // Durée d'entrave au sol
};

export function createThermalBolaState() {
  return {
    bolasRemaining: 2,
    entangledTargetsCount: 0,
  };
}

export function throwMonofilamentThermalBola(state, target, distance = 8.0, audio = audioSynth) {
  if (!state || !target || state.bolasRemaining <= 0 || distance > THERMAL_BOLA_CONSTANTS.MAX_THROW_RANGE_M) {
    return { entangled: false };
  }

  state.bolasRemaining--;
  state.entangledTargetsCount++;

  if (audio) {
    if (typeof audio.playMonofilamentBolaWhirlThrow === 'function') {
      audio.playMonofilamentBolaWhirlThrow();
    }
    if (typeof audio.playThermalBolaLegWrapSizzle === 'function') {
      audio.playThermalBolaLegWrapSizzle();
    }
  }

  target.isLegEntangledByBola = true;
  target.canMove = false;
  target.entangleTimerSec = THERMAL_BOLA_CONSTANTS.IMMOBILIZE_DURATION_SEC;

  if (typeof target.takeDamage === 'function') {
    target.takeDamage(THERMAL_BOLA_CONSTANTS.THERMAL_CONSTRICT_DAMAGE);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - THERMAL_BOLA_CONSTANTS.THERMAL_CONSTRICT_DAMAGE);
  }

  return {
    entangled: true,
    damageDealt: THERMAL_BOLA_CONSTANTS.THERMAL_CONSTRICT_DAMAGE,
  };
}
