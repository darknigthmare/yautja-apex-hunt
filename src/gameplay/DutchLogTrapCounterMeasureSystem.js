// Système de Contre-Mesure du Tronc à Contrepoids de Dutch (Predator 1987 — Lore 1:1)
// Référence canonique : Predator (1987) — Dutch Schaeffer attire le Jungle Hunter sous un tronc d'arbre suspendu retenu par une liane ("Kill me, I'm here!")

import { audioSynth } from '../AudioSynthesizer.js';

export const LOG_TRAP_CONSTANTS = {
  CRUSH_DAMAGE: 240.0,                 // Dégâts cinétiques massifs d'écrasement
  CRUSH_RADIUS: 2.8,                   // Rayon d'impact direct du tronc au sol
  VINE_HEALTH: 30.0,                   // Résistance de la liane retenant le contrepoids
  DROP_DELAY: 0.35,                    // Délai de chute gravitationnelle (s)
};

export function createDutchLogTrapState(trapOrigin = { x: 0, y: 5.0, z: -25.0 }) {
  return {
    log: {
      x: trapOrigin.x || 0,
      y: trapOrigin.y || 5.0,
      z: trapOrigin.z || -25.0,
      isSuspended: true,
      isFalling: false,
      isCrashed: false,
      fallTimer: LOG_TRAP_CONSTANTS.DROP_DELAY,
    },
    vineHealth: LOG_TRAP_CONSTANTS.VINE_HEALTH,
    crushedVictimIds: [],
  };
}

export function cutTriggerVine(state, cutDamage = 35.0, audio = audioSynth) {
  if (!state || !state.log.isSuspended || state.log.isCrashed) return false;

  state.vineHealth = Math.max(0, state.vineHealth - Number(cutDamage) || 0);

  if (state.vineHealth <= 0) {
    state.log.isSuspended = false;
    state.log.isFalling = true;
    state.log.fallTimer = LOG_TRAP_CONSTANTS.DROP_DELAY;

    if (audio && typeof audio.playCounterweightLogDrop === 'function') {
      audio.playCounterweightLogDrop();
    }
    return true;
  }
  return false;
}

export function updateDutchLogTrap(state, delta, entities = [], audio = audioSynth) {
  if (!state || !state.log.isFalling) return;
  const dt = Math.max(0, Number(delta) || 0);

  state.log.fallTimer -= dt;

  if (state.log.fallTimer <= 0) {
    state.log.isFalling = false;
    state.log.isCrashed = true;
    state.log.y = 0.0;

    if (audio && typeof audio.playTimberCrashShatter === 'function') {
      audio.playTimberCrashShatter();
    }

    // Détection des cibles sous la zone d'écrasement du tronc
    for (const ent of entities) {
      if (!ent || ent.isDead) continue;
      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);
      const dx = ex - state.log.x;
      const dz = ez - state.log.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= LOG_TRAP_CONSTANTS.CRUSH_RADIUS) {
        state.crushedVictimIds.push(ent.id || 'target');

        if (typeof ent.takeDamage === 'function') {
          ent.takeDamage(LOG_TRAP_CONSTANTS.CRUSH_DAMAGE, 'timber_crush');
        } else if (typeof ent.health === 'number') {
          ent.health = Math.max(0, ent.health - LOG_TRAP_CONSTANTS.CRUSH_DAMAGE);
        }

        ent.isPinned = true;
        ent.isStaggered = true;
        ent.staggerTimer = 3.5;

        // Si la cible est un Predator mortellement blessé, enclenchement de l'autodestruction
        if (ent.role === 'predator_hunter' || ent.species === 'yautja') {
          if (ent.health <= 50) {
            ent.selfDestructArmed = true;
          }
        }
      }
    }
  }
}
