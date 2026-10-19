// Système de Réacteur Dorsal d'Assaut et Écrasement Sismique Bad Blood (Comics Dark Horse — Lore 1:1)
// Référence canonique : Comics Dark Horse (Predator: Bad Blood) — Les renégats Bad Blood utilisant des jetpacks dorsaux à poussée gravitationnelle pour des charges aériennes foudroyantes et des retombées sismiques.

import { audioSynth } from '../AudioSynthesizer.js';

export const JETPACK_CONSTANTS = {
  HORIZONTAL_DASH_SPEED_MPS: 25.0,     // Vitesse de projection aérienne
  DASH_DISTANCE_METERS: 12.0,          // Distance parcourue en ruée de réacteur
  SLAM_SHOCKWAVE_DAMAGE: 140.0,        // Dégâts de l'impact vertical au sol
  SLAM_SHOCKWAVE_RADIUS_METERS: 6.0,   // Rayon d'ébranlement sismique
  COOLDOWN_DURATION_SEC: 6.0,          // Temps de rechargement des tuyères
};

export function createBadBloodJetpackState() {
  return {
    isAirborne: false,
    cooldownTimer: 0.0,
    totalSlamsExecuted: 0,
  };
}

export function activateJetpackDash(state, user, forwardDir = { x: 0, z: 1 }, audio = audioSynth) {
  if (!state || state.cooldownTimer > 0 || !user) {
    return { success: false, reason: 'COOLDOWN_ACTIVE' };
  }

  state.isAirborne = true;
  state.cooldownTimer = JETPACK_CONSTANTS.COOLDOWN_DURATION_SEC;

  if (audio && typeof audio.playBadBloodJetpackIgnitionRoar === 'function') {
    audio.playBadBloodJetpackIgnitionRoar();
  }

  // Projection rapide
  user.x = (user.x || 0) + (forwardDir.x || 0) * JETPACK_CONSTANTS.DASH_DISTANCE_METERS;
  user.z = (user.z || 0) + (forwardDir.z || 1) * JETPACK_CONSTANTS.DASH_DISTANCE_METERS;
  user.y = (user.y || 0) + 3.0; // Élévation temporaire

  return {
    success: true,
    newPosition: { x: user.x, y: user.y, z: user.z },
  };
}

export function executeSismicSlam(state, user, nearbyEnemies = [], audio = audioSynth) {
  if (!state || !user) return { success: false };

  user.y = 0.0; // Impact violent au sol
  state.isAirborne = false;
  state.totalSlamsExecuted++;

  if (audio && typeof audio.playSismicSlamShockwaveRing === 'function') {
    audio.playSismicSlamShockwaveRing();
  }

  const struck = [];
  const radius = JETPACK_CONSTANTS.SLAM_SHOCKWAVE_RADIUS_METERS;

  for (const enemy of nearbyEnemies) {
    if (!enemy) continue;
    const dx = (enemy.x || 0) - user.x;
    const dz = (enemy.z || 0) - user.z;
    const dist = Math.hypot(dx, dz);

    if (dist <= radius) {
      const damage = JETPACK_CONSTANTS.SLAM_SHOCKWAVE_DAMAGE;
      if (typeof enemy.takeDamage === 'function') {
        enemy.takeDamage(damage);
      } else if (typeof enemy.health === 'number') {
        enemy.health = Math.max(0, enemy.health - damage);
      }
      enemy.isKnockedDown = true;
      struck.push({ id: enemy.id || 'enemy_slam', dist, damage });
    }
  }

  return {
    success: true,
    shockwaveRadius: radius,
    enemiesStruck: struck,
  };
}

export function updateJetpackCooldown(state, delta = 0.1) {
  if (!state) return;
  if (state.cooldownTimer > 0) {
    state.cooldownTimer = Math.max(0, state.cooldownTimer - delta);
  }
}
