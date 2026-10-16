// Système de Drone Faucon de reconnaissance aérienne et marquage télémétrique (Lore 1:1)
// Référence canonique : Predators (2010) - Le Falconer déployant son drone mécanique au-dessus de la canopée

import { audioSynth } from '../AudioSynthesizer.js';

export const DRONE_STATES = {
  DOCKED: 'DOCKED',
  SURVEYING: 'SURVEYING',
  RETURNING: 'RETURNING',
};

export const DRONE_CONSTANTS = {
  SURVEY_ALTITUDE: 45.0,        // Altitude de vol stationnaire de surveillance (mètres)
  SCAN_RADIUS: 35.0,            // Rayon de détection infrarouge aérien
  MAX_BATTERY_DURATION: 60.0,   // Autonomie de vol
  TARGET_TAG_DURATION: 25.0,    // Durée de persistance des balises HUD
};

export function createFalconDroneState() {
  return {
    state: DRONE_STATES.DOCKED,
    position: { x: 0, y: 0, z: 0 },
    altitude: 0,
    flightTimer: 0,
    taggedTargets: [],
    droneViewActive: false,
  };
}

export function launchFalconDrone(state, origin, audio = audioSynth) {
  if (!state || state.state !== DRONE_STATES.DOCKED) return false;

  state.state = DRONE_STATES.SURVEYING;
  state.position = { x: origin.x, y: DRONE_CONSTANTS.SURVEY_ALTITUDE, z: origin.z };
  state.altitude = DRONE_CONSTANTS.SURVEY_ALTITUDE;
  state.flightTimer = DRONE_CONSTANTS.MAX_BATTERY_DURATION;
  state.droneViewActive = true;

  if (audio && typeof audio.playDroneLaunch === 'function') {
    audio.playDroneLaunch();
  }
  return true;
}

export function recallFalconDrone(state) {
  if (!state || state.state === DRONE_STATES.DOCKED) return false;
  state.state = DRONE_STATES.RETURNING;
  state.droneViewActive = false;
  return true;
}

export function updateFalconDrone(state, delta, entities = [], audio = audioSynth) {
  if (!state || state.state === DRONE_STATES.DOCKED) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.state === DRONE_STATES.SURVEYING) {
    state.flightTimer -= dt;
    if (state.flightTimer <= 0) {
      recallFalconDrone(state);
      return;
    }

    // Balayage et marquage des proies dans le cône de détection
    for (const entity of entities) {
      const dx = entity.x - state.position.x;
      const dz = entity.z - state.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= DRONE_CONSTANTS.SCAN_RADIUS) {
        const existing = state.taggedTargets.find(t => t.id === entity.id);
        if (!existing) {
          state.taggedTargets.push({
            id: entity.id || `target_${Date.now()}`,
            entityRef: entity,
            x: entity.x,
            y: entity.y || 0,
            z: entity.z,
            remainingDuration: DRONE_CONSTANTS.TARGET_TAG_DURATION,
          });

          if (audio && typeof audio.playDroneTelemetryPing === 'function') {
            audio.playDroneTelemetryPing();
          }
        } else {
          existing.x = entity.x;
          existing.y = entity.y || 0;
          existing.z = entity.z;
          existing.remainingDuration = DRONE_CONSTANTS.TARGET_TAG_DURATION;
        }
      }
    }
  } else if (state.state === DRONE_STATES.RETURNING) {
    state.altitude = Math.max(0, state.altitude - 20.0 * dt);
    if (state.altitude <= 0) {
      state.state = DRONE_STATES.DOCKED;
      state.altitude = 0;
    }
  }

  // Décroissance des balises HUD
  state.taggedTargets = state.taggedTargets.filter(tag => {
    tag.remainingDuration -= dt;
    return tag.remainingDuration > 0;
  });
}
