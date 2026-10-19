// Système de Lames de Poignet Télescopiques Triple Tranchant Cranté (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Celtic déployant ses lames de poignet allongées à triple tranchant dentelé pour agripper et déchiqueter la chitine des xénomorphes.

import { audioSynth } from '../AudioSynthesizer.js';

export const TRIPLE_BLADE_CONSTANTS = {
  STRIKE_DAMAGE: 135.0,               // Dégâts de la frappe à triple pénétration
  LACERATION_BLEED_DPS: 12.0,         // Saignement hémorragique consécutif aux crans de scie
  BLEED_DURATION_SEC: 4.0,            // Durée de la lacération
  ACID_CORROSION_RESISTANT: true,     // Traitement céramique anti-acide
};

export function createTripleBladeState() {
  return {
    isDeployed: false,
    totalStrikesExecuted: 0,
  };
}

export function deployTripleBlades(state, audio = audioSynth) {
  if (!state || state.isDeployed) return false;

  state.isDeployed = true;

  if (audio && typeof audio.playTripleWristbladeDeployShink === 'function') {
    audio.playTripleWristbladeDeployShink();
  }

  return true;
}

export function executeTripleSlash(state, target, audio = audioSynth) {
  if (!state || !state.isDeployed || !target) {
    return { success: false, reason: 'BLADES_NOT_DEPLOYED' };
  }

  if (audio && typeof audio.playSerratedGougeFleshTear === 'function') {
    audio.playSerratedGougeFleshTear();
  }

  const damage = TRIPLE_BLADE_CONSTANTS.STRIKE_DAMAGE;
  if (typeof target.takeDamage === 'function') {
    target.takeDamage(damage);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - damage);
  }

  target.isLacerated = true;
  target.lacerationTimer = TRIPLE_BLADE_CONSTANTS.BLEED_DURATION_SEC;
  state.totalStrikesExecuted++;

  return {
    success: true,
    damageDealt: damage,
    lacerationApplied: true,
  };
}

export function updateLacerationBleed(target, delta = 0.1) {
  if (!target || !target.isLacerated) return;

  target.lacerationTimer = Math.max(0, (target.lacerationTimer || 0) - delta);
  const bleedDmg = TRIPLE_BLADE_CONSTANTS.LACERATION_BLEED_DPS * delta;

  if (typeof target.takeDamage === 'function') {
    target.takeDamage(bleedDmg);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - bleedDmg);
  }

  if (target.lacerationTimer === 0) {
    target.isLacerated = false;
  }
}
