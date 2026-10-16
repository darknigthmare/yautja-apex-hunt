// Système de Piège à Contrepoids de Tronc Suspendu (Lore 1:1)
// Référence canonique : Predator (1987) - Piège d'écrasement fabriqué par Dutch Schaefer dans la clairière boueuse

import { audioSynth } from '../AudioSynthesizer.js';

export const LOG_TRAP_CONSTANTS = {
  SUSPENSION_ALTITUDE: 12.0,       // Hauteur de suspension initiale du tronc dans la canopée (m)
  DROP_VELOCITY: 18.5,             // Vélocité de chute verticale accélérée par contrepoids (m/s)
  CRUSH_DAMAGE: 240.0,             // Dégâts massifs d'écrasement contondant
  CRUSH_RADIUS: 2.8,               // Rayon de la zone d'impact au point de chute
  TRIPWIRE_TRIGGER_RADIUS: 2.2,    // Rayon de déclenchement du fil de détente
  PINNED_DURATION: 4.5,            // Durée d'immobilisation de la cible sous le tronc lourd (s)
};

export function createLogCounterweightTrapState(trapPosition = { x: 0, y: 0, z: 0 }) {
  return {
    isRigged: true,
    isTriggered: false,
    hasImpacted: false,
    suspensionY: LOG_TRAP_CONSTANTS.SUSPENSION_ALTITUDE,
    targetGroundPos: { x: trapPosition.x, y: 0, z: trapPosition.z },
    pinnedVictims: [],
    trapId: `log_trap_${Date.now()}`,
  };
}

export function triggerLogTrap(state, audio = audioSynth) {
  if (!state || !state.isRigged || state.isTriggered) return false;

  state.isTriggered = true;
  state.isRigged = false;

  if (audio && typeof audio.playLogDeadfallSnap === 'function') {
    audio.playLogDeadfallSnap();
  }

  return true;
}

export function updateLogCounterweightTrap(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Détection automatique au passage d'une entité sur le fil de détente
  if (state.isRigged && !state.isTriggered) {
    for (const ent of entities) {
      if (!ent || ent.isDead) continue;
      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);

      const dx = ex - state.targetGroundPos.x;
      const dz = ez - state.targetGroundPos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= LOG_TRAP_CONSTANTS.TRIPWIRE_TRIGGER_RADIUS) {
        triggerLogTrap(state, audio);
        break;
      }
    }
  }

  // Chute du tronc massif vers le sol
  if (state.isTriggered && !state.hasImpacted) {
    state.suspensionY -= LOG_TRAP_CONSTANTS.DROP_VELOCITY * dt;

    if (state.suspensionY <= 0) {
      state.suspensionY = 0;
      state.hasImpacted = true;

      if (audio && typeof audio.playLogHeavyCrash === 'function') {
        audio.playLogHeavyCrash();
      }

      // Application des dégâts d'écrasement et immobilisation
      for (const ent of entities) {
        if (!ent || ent.isDead) continue;
        const ex = ent.x ?? (ent.position ? ent.position.x : 0);
        const ez = ent.z ?? (ent.position ? ent.position.z : 0);

        const dx = ex - state.targetGroundPos.x;
        const dz = ez - state.targetGroundPos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist <= LOG_TRAP_CONSTANTS.CRUSH_RADIUS) {
          if (typeof ent.takeDamage === 'function') {
            ent.takeDamage(LOG_TRAP_CONSTANTS.CRUSH_DAMAGE, 'log_deadfall_crush');
          } else if (typeof ent.health === 'number') {
            ent.health = Math.max(0, ent.health - LOG_TRAP_CONSTANTS.CRUSH_DAMAGE);
          }

          ent.isKnockedProne = true;
          ent.isPinnedUnderLog = true;
          ent.pinnedTimer = LOG_TRAP_CONSTANTS.PINNED_DURATION;

          state.pinnedVictims.push(ent.id || 'crushed_target');
        }
      }
    }
  }
}
