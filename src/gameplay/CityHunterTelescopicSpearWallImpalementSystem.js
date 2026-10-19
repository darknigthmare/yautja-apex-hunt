// Empalement Mural au Combi-Stick & Verrouillage Télescopique (Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) — Le City Hunter projetant sa lance télescopique pour clouer une cible contre une paroi de béton avant d'activer l'extension secondaire des lames.

import { audioSynth } from '../AudioSynthesizer.js';

export const WALL_IMPALE_CONSTANTS = {
  IMPALE_KINETIC_DAMAGE: 230,              // Dégâts cinétiques d'empalement mural
  TELESCOPIC_EXTENSION_LOCK_DAMAGE: 65,    // Dégâts additionnels lors de l'ouverture télescopique
  MAX_THROW_RANGE_M: 22.0,                 // Portée maximale du lancer d'empalement
};

export function createSpearWallImpalementState() {
  return {
    isSpearThrown: false,
    impaledTargetId: null,
    isTelescopicLocked: false,
  };
}

export function throwSpearForWallPin(state, target, distanceToTarget = 10.0, audio = audioSynth) {
  if (!state || !target || state.isSpearThrown || distanceToTarget > WALL_IMPALE_CONSTANTS.MAX_THROW_RANGE_M) {
    return { pinned: false };
  }

  state.isSpearThrown = true;
  state.impaledTargetId = target.id || 'impaled_victim';

  if (audio && typeof audio.playCombiStickWallImpaleThud === 'function') {
    audio.playCombiStickWallImpaleThud();
  }

  target.isPinnedToWall = true;
  target.canMove = false;

  if (typeof target.takeDamage === 'function') {
    target.takeDamage(WALL_IMPALE_CONSTANTS.IMPALE_KINETIC_DAMAGE);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - WALL_IMPALE_CONSTANTS.IMPALE_KINETIC_DAMAGE);
  }

  return {
    pinned: true,
    damageDealt: WALL_IMPALE_CONSTANTS.IMPALE_KINETIC_DAMAGE,
  };
}

export function triggerSecondaryTelescopicExtension(state, target, audio = audioSynth) {
  if (!state || !state.isSpearThrown || !target || !target.isPinnedToWall) {
    return { extended: false };
  }

  state.isTelescopicLocked = true;

  if (audio && typeof audio.playTelescopicSpearLockClick === 'function') {
    audio.playTelescopicSpearLockClick();
  }

  if (typeof target.takeDamage === 'function') {
    target.takeDamage(WALL_IMPALE_CONSTANTS.TELESCOPIC_EXTENSION_LOCK_DAMAGE);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - WALL_IMPALE_CONSTANTS.TELESCOPIC_EXTENSION_LOCK_DAMAGE);
  }

  return {
    extended: true,
    lockDamage: WALL_IMPALE_CONSTANTS.TELESCOPIC_EXTENSION_LOCK_DAMAGE,
  };
}
