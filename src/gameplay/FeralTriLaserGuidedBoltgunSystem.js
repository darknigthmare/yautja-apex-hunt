// Arbalète à Carreaux Crantés Guidée par le Triangle Laser du Masque d'Os (Prey 2022 — Lore 1:1)
// Référence canonique : Prey (2022) — Le Boltgun du Feral Predator dont les projectiles métalliques suivent avec une précision mortelle la position exacte des trois diodes lasers du masque d'os, mais deviennent vulnérables si le masque est dérobé ou orienté contre lui.

import { audioSynth } from '../AudioSynthesizer.js';

export const FERAL_BOLTGUN_CONSTANTS = {
  GUIDED_HEADSHOT_DAMAGE: 195,       // Dégâts de perforation guidée en pleine tête
  UNGUIDED_DAMAGE: 90,               // Dégâts sans verrouillage du masque d'os
  MAX_BOLT_CAPACITY: 8,              // Capacité du carquois magnétique
};

export function createFeralBoltgunState() {
  return {
    boltsRemaining: FERAL_BOLTGUN_CONSTANTS.MAX_BOLT_CAPACITY,
    isMaskLaserLocked: false,
    lockedCoordinates: null,
  };
}

export function lockTriLaserTarget(state, target, audio = audioSynth) {
  if (!state || !target) return false;
  state.isMaskLaserLocked = true;
  state.lockedCoordinates = { x: target.x || 0, z: target.z || 0, targetRef: target };
  return true;
}

export function fireLaserGuidedBolt(state, target, audio = audioSynth) {
  if (!state || state.boltsRemaining <= 0) {
    return { fired: false, damageDealt: 0 };
  }

  state.boltsRemaining--;

  if (audio && typeof audio.playFeralBoltgunLaserGuidedTwang === 'function') {
    audio.playFeralBoltgunLaserGuidedTwang();
  }

  const effectiveTarget = (state.isMaskLaserLocked && state.lockedCoordinates?.targetRef) || target;
  if (!effectiveTarget) return { fired: true, damageDealt: 0 };

  const isGuided = state.isMaskLaserLocked;
  const damage = isGuided ? FERAL_BOLTGUN_CONSTANTS.GUIDED_HEADSHOT_DAMAGE : FERAL_BOLTGUN_CONSTANTS.UNGUIDED_DAMAGE;

  if (audio && typeof audio.playGuidedBoltFleshImpaleThwack === 'function') {
    audio.playGuidedBoltFleshImpaleThwack();
  }

  effectiveTarget.isPinnedByBolt = isGuided;
  if (typeof effectiveTarget.takeDamage === 'function') {
    effectiveTarget.takeDamage(damage);
  } else if (typeof effectiveTarget.health === 'number') {
    effectiveTarget.health = Math.max(0, effectiveTarget.health - damage);
  }

  state.isMaskLaserLocked = false;

  return {
    fired: true,
    isGuidedHit: isGuided,
    damageDealt: damage,
  };
}
