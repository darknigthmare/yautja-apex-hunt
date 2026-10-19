// Système de Fléchettes de Gantelet à Trajectoire Incurvée Prédictive (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Celtic utilisant son mini-lanceur de gantelet pour projeter des micro-fléchettes d'alliage barbelé contournant les colonnes de la pyramide.

import { audioSynth } from '../AudioSynthesizer.js';

export const CURVED_FLECHETTE_CONSTANTS = {
  MAX_CURVE_ANGLE_DEG: 45.0,           // Arc de courbure maximal pour contourner un obstacle
  FLECHETTE_PIERCE_DAMAGE: 85.0,       // Dégâts perforant la carapace de chitine
  FLIGHT_VELOCITY_MPS: 42.0,           // Vitesse balistique du projectile
  CHITIN_BLEED_DURATION_SEC: 4.0,      // Saignement d'acide résultant de la pénétration
};

export function createCurvedFlechetteState() {
  return {
    remainingFlechettes: 6,
    activeFlechettes: [],
    successfulHitsCount: 0,
  };
}

export function fireCurvedFlechette(state, origin = { x: 0, y: 1.5, z: 0 }, target = null, obstacleToBypass = null, audio = audioSynth) {
  if (!state || state.remainingFlechettes <= 0 || !target) {
    return { success: false, reason: 'NO_AMMO_OR_INVALID_TARGET' };
  }

  state.remainingFlechettes--;

  if (audio && typeof audio.playCurvedFlechetteWhistle === 'function') {
    audio.playCurvedFlechetteWhistle();
  }

  // Calcul du contournement d'obstacle
  let bypassed = false;
  if (obstacleToBypass) {
    bypassed = true;
  }

  if (audio && typeof audio.playFlechetteSpikeEmbedThud === 'function') {
    audio.playFlechetteSpikeEmbedThud();
  }

  const damage = CURVED_FLECHETTE_CONSTANTS.FLECHETTE_PIERCE_DAMAGE;
  if (typeof target.takeDamage === 'function') {
    target.takeDamage(damage);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - damage);
  }

  target.isChitinPierced = true;
  state.successfulHitsCount++;

  return {
    success: true,
    damageDealt: damage,
    obstacleBypassed: bypassed,
    remainingFlechettes: state.remainingFlechettes,
  };
}
