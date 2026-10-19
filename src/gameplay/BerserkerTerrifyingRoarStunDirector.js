// Directeur de Rugissement d'Intimidation Berserker et Stupeur Terrifiante (Predators 2010 — Lore 1:1)
// Référence canonique : Predators (2010) — Le Berserker Super Predator poussant un rugissement bestial assourdissant qui tétanise de terreur les mercenaires humains sur 15 mètres.

import { audioSynth } from '../AudioSynthesizer.js';

export const ROAR_STUN_CONSTANTS = {
  ROAR_AFFECT_RADIUS_METERS: 15.0,    // Rayon de propagation de l'onde sonore terrifiante
  TERROR_STUN_DURATION_SEC: 2.5,      // Durée d'immobilité et de sidération mentale
  COOLDOWN_SEC: 8.0,                  // Temps de recharge entre deux rugissements d'apex
};

export function createBerserkerRoarState() {
  return {
    cooldownTimer: 0.0,
    totalRoarsUnleashed: 0,
    totalEnemiesParalyzed: 0,
  };
}

export function unleashTerrifyingRoar(state, roarOrigin = { x: 0, z: 0 }, humanEnemies = [], audio = audioSynth) {
  if (!state || state.cooldownTimer > 0) return { success: false, reason: 'ON_COOLDOWN' };

  state.cooldownTimer = ROAR_STUN_CONSTANTS.COOLDOWN_SEC;
  state.totalRoarsUnleashed++;

  if (audio && typeof audio.playBerserkerPrimalRoarTerrify === 'function') {
    audio.playBerserkerPrimalRoarTerrify();
  }

  const paralyzed = [];
  const radius = ROAR_STUN_CONSTANTS.ROAR_AFFECT_RADIUS_METERS;

  for (const enemy of humanEnemies) {
    if (!enemy) continue;
    const dx = (enemy.x || 0) - (roarOrigin.x || 0);
    const dz = (enemy.z || 0) - (roarOrigin.z || 0);
    if (Math.hypot(dx, dz) <= radius) {
      enemy.isTerrified = true;
      enemy.canMove = false;
      enemy.terrorTimer = ROAR_STUN_CONSTANTS.TERROR_STUN_DURATION_SEC;
      state.totalEnemiesParalyzed++;
      paralyzed.push({ id: enemy.id || 'terrified_soldier' });
    }
  }

  if (paralyzed.length > 0 && audio && typeof audio.playHumanPanicStunGasp === 'function') {
    audio.playHumanPanicStunGasp();
  }

  return {
    success: true,
    paralyzedCount: paralyzed.length,
    paralyzedEnemies: paralyzed,
  };
}

export function updateTerrifiedEnemies(enemies = [], delta = 0.1) {
  for (const enemy of enemies) {
    if (enemy && enemy.isTerrified && enemy.terrorTimer > 0) {
      enemy.terrorTimer = Math.max(0, enemy.terrorTimer - delta);
      if (enemy.terrorTimer === 0) {
        enemy.isTerrified = false;
        enemy.canMove = true;
      }
    }
  }
}
