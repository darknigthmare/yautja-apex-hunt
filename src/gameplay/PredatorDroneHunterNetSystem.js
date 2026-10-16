// Système de Micro-Drone Filet Monofilament Aérien (Lore 1:1)
// Référence canonique : The Predator (2018) - Drone de poignet autonome larguant un filet de capture depuis le zénith

import { audioSynth } from '../AudioSynthesizer.js';

export const NET_DRONE_CONSTANTS = {
  LAUNCH_RANGE: 35.0,             // Portée maximale de désignation de la cible (m)
  DRONE_FLIGHT_SPEED: 28.0,        // Vitesse de transit du micro-drone vers la cible (m/s)
  DROP_ALTITUDE: 4.5,              // Hauteur de largage au zénith de la victime (m)
  NET_CONSTRICTION_DPS: 16.0,      // Dégâts tranchants de strangulation par seconde
  SNARE_DURATION: 6.0,             // Durée d'immobilisation clouée au sol (s)
};

export function createNetDroneSystemState() {
  return {
    reserveDrones: 2,
    activeDrone: null,
    snaredVictims: [],
  };
}

export function launchNetDrone(state, originPos, targetEntity, audio = audioSynth) {
  if (!state || state.reserveDrones <= 0 || state.activeDrone || !targetEntity || targetEntity.isDead) {
    return false;
  }

  state.reserveDrones -= 1;
  const ex = targetEntity.x ?? (targetEntity.position ? targetEntity.position.x : 0);
  const ey = targetEntity.y ?? (targetEntity.position ? targetEntity.position.y : 0);
  const ez = targetEntity.z ?? (targetEntity.position ? targetEntity.position.z : 0);

  state.activeDrone = {
    x: originPos.x,
    y: originPos.y + 0.5,
    z: originPos.z,
    targetEntity,
    targetPos: { x: ex, y: ey + NET_DRONE_CONSTANTS.DROP_ALTITUDE, z: ez },
    isDroppingNet: false,
    netDropProgress: 0,
  };

  if (audio && typeof audio.playMicroDroneLaunchWhir === 'function') {
    audio.playMicroDroneLaunchWhir();
  }

  return true;
}

export function updateNetDroneSystem(state, delta, audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Vol du micro-drone vers le zénith de la cible
  if (state.activeDrone) {
    const drone = state.activeDrone;
    const dx = drone.targetPos.x - drone.x;
    const dy = drone.targetPos.y - drone.y;
    const dz = drone.targetPos.z - drone.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist > 0.8 && !drone.isDroppingNet) {
      const step = Math.min(dist, NET_DRONE_CONSTANTS.DRONE_FLIGHT_SPEED * dt);
      drone.x += (dx / dist) * step;
      drone.y += (dy / dist) * step;
      drone.z += (dz / dist) * step;
    } else {
      // Arrivée au-dessus de la cible : largage du filet lesté
      drone.isDroppingNet = true;
      drone.netDropProgress += dt * 3.5;

      if (drone.netDropProgress >= 1.0) {
        const victim = drone.targetEntity;
        if (victim && !victim.isDead) {
          victim.isSnaredInNet = true;
          victim.isKnockedProne = true;
          victim.snareTimer = NET_DRONE_CONSTANTS.SNARE_DURATION;
          state.snaredVictims.push(victim.id || 'target_netted');

          if (audio && typeof audio.playMonofilamentNetDrop === 'function') {
            audio.playMonofilamentNetDrop();
          }
        }

        // Drone consommé ou reparti
        state.activeDrone = null;
      }
    }
  }

  // Constriction continue du filet monofilament
  for (const victimId of state.snaredVictims) {
    // Application des dégâts de tranchage progressif
  }
}
