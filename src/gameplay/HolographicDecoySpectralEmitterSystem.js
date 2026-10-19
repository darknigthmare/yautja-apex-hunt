// Système d'Émetteur Spectral et Leurre Holographique 3D (The Predator 2018 / Comics — Lore 1:1)
// Référence canonique : The Predator (2018) & Comics — Balise émettant un hologramme tridimensionnel d'un Yautja avec signature thermique factice pour détourner les tirs ennemis.

import { audioSynth } from '../AudioSynthesizer.js';

export const DECOY_CONSTANTS = {
  LIFETIME_DURATION_SEC: 12.0,        // Durée de persistance de la projection spectrale
  AGGRO_PULL_RADIUS_METERS: 18.0,     // Rayon d'attraction des tirs ennemis
  HOLOGRAM_HITPOINTS: 80.0,           // Résistance aux impacts avant dissipation
};

export function createHolographicDecoyState() {
  return {
    isDecoyActive: false,
    decoyPosition: { x: 0, y: 0, z: 0 },
    remainingLifetime: 0.0,
    health: DECOY_CONSTANTS.HOLOGRAM_HITPOINTS,
    divertedEnemiesCount: 0,
  };
}

export function deployHologramDecoy(state, spawnPos = { x: 0, y: 0, z: 0 }, audio = audioSynth) {
  if (!state || state.isDecoyActive) return false;

  state.isDecoyActive = true;
  state.decoyPosition = { x: spawnPos.x || 0, y: spawnPos.y || 0, z: spawnPos.z || 0 };
  state.remainingLifetime = DECOY_CONSTANTS.LIFETIME_DURATION_SEC;
  state.health = DECOY_CONSTANTS.HOLOGRAM_HITPOINTS;

  if (audio && typeof audio.playHoloDecoyFlickerHum === 'function') {
    audio.playHoloDecoyFlickerHum();
  }

  return true;
}

export function divertEnemyFireToDecoy(state, enemies = []) {
  if (!state || !state.isDecoyActive) return { diverted: false };

  let diverted = 0;
  for (const enemy of enemies) {
    if (!enemy) continue;
    const dx = (enemy.x || 0) - state.decoyPosition.x;
    const dz = (enemy.z || 0) - state.decoyPosition.z;
    if (Math.hypot(dx, dz) <= DECOY_CONSTANTS.AGGRO_PULL_RADIUS_METERS) {
      enemy.currentTarget = 'holographic_decoy';
      enemy.isShootingAtDecoy = true;
      diverted++;
      state.divertedEnemiesCount++;
    }
  }

  return {
    diverted: diverted > 0,
    divertedCount: diverted,
  };
}

export function updateDecoyState(state, delta = 0.1) {
  if (!state || !state.isDecoyActive) return;

  state.remainingLifetime = Math.max(0, state.remainingLifetime - delta);

  if (state.remainingLifetime === 0 || state.health <= 0) {
    state.isDecoyActive = false;
  }
}
