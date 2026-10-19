// Lance-Grenades Plasma Portatif à Détonation Retardée (The Predator 2018 — Lore 1:1)
// Référence canonique : The Predator (2018) — Le Fugitive Predator projetant des capsules magnétiques de plasma à retardement qui s'aimantent aux blindés et structures du Projet Stargazer avant d'imploser.

import { audioSynth } from '../AudioSynthesizer.js';

export const PLASMA_CAPSULE_CONSTANTS = {
  DETONATION_DELAY_SEC: 1.5,         // Délai d'amorçage magnétique avant implosion
  DIRECT_BLAST_DAMAGE: 210,          // Dégâts directs sur le porteur ou blindé aimanté
  AOE_SPLASH_DAMAGE: 95,             // Dégâts de souffle thermique aux unités proches
  SPLASH_RADIUS_M: 5.0,              // Rayon de la sphère d'implosion plasma
};

export function createPlasmaCapsuleLauncherState() {
  return {
    activeCapsules: [],
    totalDetonations: 0,
  };
}

export function launchMagneticPlasmaCapsule(state, target, audio = audioSynth) {
  if (!state || !target) return { latched: false };

  if (audio && typeof audio.playMagneticCapsuleLatchClick === 'function') {
    audio.playMagneticCapsuleLatchClick();
  }

  target.hasMagneticCapsuleAttached = true;

  const capsule = {
    target,
    remainingSec: PLASMA_CAPSULE_CONSTANTS.DETONATION_DELAY_SEC,
    detonated: false,
  };

  state.activeCapsules.push(capsule);

  return {
    latched: true,
    capsule,
  };
}

export function updatePlasmaCapsuleTimers(state, dt, nearbyEntities = [], audio = audioSynth) {
  if (!state || !Array.isArray(state.activeCapsules) || dt <= 0) {
    return { detonatedThisTick: 0 };
  }

  let detonatedThisTick = 0;

  for (const capsule of state.activeCapsules) {
    if (capsule.detonated) continue;
    capsule.remainingSec -= dt;

    if (capsule.remainingSec <= 0) {
      capsule.detonated = true;
      detonatedThisTick++;
      state.totalDetonations++;

      if (audio && typeof audio.playDelayedPlasmaCapsuleDetonation === 'function') {
        audio.playDelayedPlasmaCapsuleDetonation();
      }

      const primary = capsule.target;
      if (primary) {
        primary.hasMagneticCapsuleAttached = false;
        primary.isArmorShatteredByCapsule = true;
        if (typeof primary.takeDamage === 'function') {
          primary.takeDamage(PLASMA_CAPSULE_CONSTANTS.DIRECT_BLAST_DAMAGE);
        } else if (typeof primary.health === 'number') {
          primary.health = Math.max(0, primary.health - PLASMA_CAPSULE_CONSTANTS.DIRECT_BLAST_DAMAGE);
        }

        const ox = primary.x || 0;
        const oz = primary.z || 0;
        if (Array.isArray(nearbyEntities)) {
          for (const ent of nearbyEntities) {
            if (!ent || ent === primary) continue;
            const dist = Math.hypot((ent.x || 0) - ox, (ent.z || 0) - oz);
            if (dist <= PLASMA_CAPSULE_CONSTANTS.SPLASH_RADIUS_M) {
              if (typeof ent.takeDamage === 'function') {
                ent.takeDamage(PLASMA_CAPSULE_CONSTANTS.AOE_SPLASH_DAMAGE);
              } else if (typeof ent.health === 'number') {
                ent.health = Math.max(0, ent.health - PLASMA_CAPSULE_CONSTANTS.AOE_SPLASH_DAMAGE);
              }
            }
          }
        }
      }
    }
  }

  state.activeCapsules = state.activeCapsules.filter((c) => !c.detonated);

  return {
    detonatedThisTick,
  };
}
