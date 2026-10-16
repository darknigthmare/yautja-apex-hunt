// Dispositif répulseur cinétique et perturbation antigravitationnelle (Lore 1:1)
// Référence canonique : The Predator (2018) & Univers Étendu - Disque de suspension gravitationnelle et choc cinétique

import { audioSynth } from '../AudioSynthesizer.js';

export const REPULSOR_CONSTANTS = {
  TRIGGER_RADIUS: 3.5,
  SUSPENSION_DURATION: 2.2,     // Durée de lévitation en apesanteur
  SLAM_DAMAGE: 125.0,           // Onde de choc d'écrasement cinétique
  REPULSION_IMPULSE: 24.0,      // Vélocité d'éjection radiale
};

export function createKineticRepulsorState() {
  return {
    traps: [],
  };
}

export function plantKineticRepulsor(state, position) {
  if (!state || !position) return null;

  const trap = {
    id: `repulsor_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    x: Number(position.x) || 0,
    y: Number(position.y) || 0,
    z: Number(position.z) || 0,
    isTriggered: false,
    suspensionTimer: 0,
    isSuspended: false,
    trappedEntities: [],
  };

  state.traps.push(trap);
  return trap;
}

export function updateKineticRepulsor(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  state.traps = state.traps.filter(trap => {
    // 1. Détection de proximité
    if (!trap.isTriggered) {
      for (const entity of entities) {
        const dx = entity.x - trap.x;
        const dz = entity.z - trap.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist <= REPULSOR_CONSTANTS.TRIGGER_RADIUS) {
          trap.isTriggered = true;
          trap.isSuspended = true;
          trap.suspensionTimer = REPULSOR_CONSTANTS.SUSPENSION_DURATION;
          trap.trappedEntities = [entity];

          entity.isLevitating = true;
          entity.y = (entity.y || 0) + 2.5;

          if (audio && typeof audio.playAntiGravHum === 'function') {
            audio.playAntiGravHum();
          }
          break;
        }
      }
      return true;
    }

    // 2. Phase de suspension en apesanteur
    if (trap.isSuspended) {
      trap.suspensionTimer -= dt;

      if (trap.suspensionTimer <= 0) {
        trap.isSuspended = false;

        // Déflagration cinétique d'écrasement
        for (const entity of trap.trappedEntities) {
          entity.isLevitating = false;
          entity.y = Math.max(0, (entity.y || 2.5) - 2.5);
          entity.isKnockedProne = true;

          if (typeof entity.applyDamage === 'function') {
            entity.applyDamage(REPULSOR_CONSTANTS.SLAM_DAMAGE, 'kinetic_gravity_slam');
          } else if (typeof entity.health === 'number') {
            entity.health = Math.max(0, entity.health - REPULSOR_CONSTANTS.SLAM_DAMAGE);
          }
        }

        if (audio && typeof audio.playKineticRepulsorPulse === 'function') {
          audio.playKineticRepulsorPulse();
        }
        return false; // Piège consommé
      }
      return true;
    }

    return false;
  });
}
