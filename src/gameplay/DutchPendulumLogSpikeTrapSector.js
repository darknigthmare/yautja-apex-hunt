// Secteur de Piège à Pendule de Tronc Taillé et Ronces de Guérilla (Predator 1987 — Lore 1:1)
// Référence canonique : Predator (1987) — Dutch préparant un tronc d'arbre hérissé de pieux de bois taillés suspendu à une liane, relâché par filin de détente pour empaler le Jungle Hunter.

import { audioSynth } from '../AudioSynthesizer.js';

export const PENDULUM_TRAP_CONSTANTS = {
  SWING_ARC_RADIUS_METERS: 6.5,       // Rayon de balancement du tronc à contrepoids
  IMPALE_CRUSH_DAMAGE: 160.0,         // Dégâts cinétiques massifs d'empalement et écrasement
  KNOCKBACK_DISTANCE_METERS: 5.5,     // Projection violente de la cible
  STUN_DURATION_SEC: 2.5,             // Étourdissement lourd consécutif à l'impact
};

export function createPendulumTrapState(anchorPos = { x: 0, y: 5.0, z: 0 }) {
  return {
    anchorPosition: { x: anchorPos.x || 0, y: anchorPos.y || 5.0, z: anchorPos.z || 0 },
    isArmed: false,
    isTriggered: false,
    hasSwung: false,
  };
}

export function armPendulumTrap(state) {
  if (!state || state.hasSwung) return false;
  state.isArmed = true;
  state.isTriggered = false;
  return true;
}

export function triggerPendulumSwing(state, target, audio = audioSynth) {
  if (!state || !state.isArmed || state.hasSwung || !target) {
    return { success: false, reason: 'TRAP_NOT_READY' };
  }

  state.isTriggered = true;
  state.hasSwung = true;
  state.isArmed = false;

  // Vrombissement d'air du tronc en balancier
  if (audio && typeof audio.playPendulumLogSwingWhoosh === 'function') {
    audio.playPendulumLogSwingWhoosh();
  }

  // Fracas d'empalement sur la cible
  if (audio && typeof audio.playSpikedLogImpaleCrack === 'function') {
    audio.playSpikedLogImpaleCrack();
  }

  const damage = PENDULUM_TRAP_CONSTANTS.IMPALE_CRUSH_DAMAGE;
  if (typeof target.takeDamage === 'function') {
    target.takeDamage(damage);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - damage);
  }

  target.isStunned = true;
  target.stunTimer = PENDULUM_TRAP_CONSTANTS.STUN_DURATION_SEC;
  target.z = (target.z || 0) + PENDULUM_TRAP_CONSTANTS.KNOCKBACK_DISTANCE_METERS;

  return {
    success: true,
    damageDealt: damage,
    targetKnockedBack: true,
    stunned: true,
  };
}
