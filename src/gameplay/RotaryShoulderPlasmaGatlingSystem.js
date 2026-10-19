// Canon d'Épaule Rotatif Lourd d'Artillerie Plasma (AVP 2010 / Elder Lore — Fidélité 1:1)
// Référence canonique : Aliens vs. Predator & Elder Lore — Le Plasmacaster rotatif à barillets multiples conçu pour contenir les essaims de Xénomorphes par un barrage soutenu de salves ionisées.

import { audioSynth } from '../AudioSynthesizer.js';

export const ROTARY_PLASMA_CONSTANTS = {
  DAMAGE_PER_BOLT: 70,               // Dégâts de chaque décharge plasma de la rafale
  BOLTS_PER_BURST: 3,                // Nombre de projectiles par salve rotative
  HEAT_PER_BURST: 30,                // Échauffement thermique par salve (seuil max 100)
  COOLDOWN_RATE_PER_SEC: 25,         // Refroidissement passif par seconde
};

export function createRotaryPlasmaGatlingState() {
  return {
    isSpunUp: false,
    thermalHeat: 0,
    isOverheated: false,
    totalBoltsFired: 0,
  };
}

export function spinUpRotaryPlasmaBarrels(state, audio = audioSynth) {
  if (!state || state.isOverheated) return false;
  state.isSpunUp = true;

  if (audio && typeof audio.playRotaryPlasmaGatlingSpinUp === 'function') {
    audio.playRotaryPlasmaGatlingSpinUp();
  }

  return true;
}

export function fireRotaryPlasmaSuppressiveBurst(state, targets = [], audio = audioSynth) {
  if (!state || !state.isSpunUp || state.isOverheated) {
    return { fired: false, boltsFired: 0 };
  }

  if (audio && typeof audio.playRotaryPlasmaVolleyBarrage === 'function') {
    audio.playRotaryPlasmaVolleyBarrage();
  }

  const bolts = ROTARY_PLASMA_CONSTANTS.BOLTS_PER_BURST;
  state.totalBoltsFired += bolts;
  state.thermalHeat += ROTARY_PLASMA_CONSTANTS.HEAT_PER_BURST;

  if (state.thermalHeat >= 100) {
    state.thermalHeat = 100;
    state.isOverheated = true;
    state.isSpunUp = false;
  }

  const totalDamage = bolts * ROTARY_PLASMA_CONSTANTS.DAMAGE_PER_BOLT;
  if (Array.isArray(targets) && targets.length > 0) {
    const primary = targets[0];
    if (primary) {
      primary.isSuppressedByPlasma = true;
      if (typeof primary.takeDamage === 'function') {
        primary.takeDamage(totalDamage);
      } else if (typeof primary.health === 'number') {
        primary.health = Math.max(0, primary.health - totalDamage);
      }
    }
  }

  return {
    fired: true,
    boltsFired: bolts,
    totalDamageDealt: totalDamage,
  };
}
