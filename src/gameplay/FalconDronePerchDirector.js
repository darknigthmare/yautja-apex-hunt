// Directeur de Perchage et Surveillance Stationnaire du Drone Falcon (Lore 1:1)
// Référence canonique : Predators (2010) - Le Drone Falcon du Tracker se posant sur les hautes branches pour relayer les cibles

import { audioSynth } from '../AudioSynthesizer.js';

export const DRONE_MODES = {
  FLIGHT_RECON: 'FLIGHT_RECON',
  PERCHED_SURVEILLANCE: 'PERCHED_SURVEILLANCE',
  RETURNING: 'RETURNING',
};

export const FALCON_PERCH_CONSTANTS = {
  SURVEILLANCE_RADIUS: 45.0,       // Portée de détection radar depuis le perchoir (m)
  RADAR_PING_INTERVAL: 3.0,        // Fréquence du balayage de télémétrie (s)
  MIN_PERCH_ALTITUDE: 6.0,         // Altitude minimale pour ancrage sur branche/mât
};

export function createFalconDronePerchState() {
  return {
    mode: DRONE_MODES.FLIGHT_RECON,
    position: { x: 0, y: 12.0, z: -10.0 },
    currentPerchNode: null,
    radarPingTimer: 0,
    spottedPreyList: [],
    telemetryRelayActive: false,
    totalPingsEmitted: 0,
  };
}

export function orderDroneToPerch(state, perchPoint, audio = audioSynth) {
  if (!state || !perchPoint || perchPoint.y < FALCON_PERCH_CONSTANTS.MIN_PERCH_ALTITUDE) {
    return false;
  }

  state.mode = DRONE_MODES.PERCHED_SURVEILLANCE;
  state.currentPerchNode = { x: perchPoint.x, y: perchPoint.y, z: perchPoint.z, id: perchPoint.id || 'canopy_perch' };
  state.position = { x: perchPoint.x, y: perchPoint.y, z: perchPoint.z };
  state.radarPingTimer = 0;
  state.telemetryRelayActive = true;

  if (audio && typeof audio.playFalconPerchChirp === 'function') {
    audio.playFalconPerchChirp();
  }

  return true;
}

export function orderDroneRecall(state) {
  if (!state) return;
  state.mode = DRONE_MODES.RETURNING;
  state.currentPerchNode = null;
  state.telemetryRelayActive = false;
  state.spottedPreyList = [];
}

export function updateFalconDronePerchDirector(state, delta, entities = [], audio = audioSynth) {
  if (!state || state.mode !== DRONE_MODES.PERCHED_SURVEILLANCE) return;
  const dt = Math.max(0, Number(delta) || 0);

  state.radarPingTimer += dt;
  if (state.radarPingTimer >= FALCON_PERCH_CONSTANTS.RADAR_PING_INTERVAL) {
    state.radarPingTimer -= FALCON_PERCH_CONSTANTS.RADAR_PING_INTERVAL;
    state.totalPingsEmitted += 1;

    // Balayage radar omnidirectionnel et marquage télémétrique
    state.spottedPreyList = [];

    for (const ent of entities) {
      if (!ent || ent.isDead) continue;
      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ey = ent.y ?? (ent.position ? ent.position.y : 0);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);

      const dx = ex - state.position.x;
      const dy = ey - state.position.y;
      const dz = ez - state.position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist <= FALCON_PERCH_CONSTANTS.SURVEILLANCE_RADIUS) {
        ent.isTargetPainted = true;
        ent.paintDuration = 3.5;

        state.spottedPreyList.push({
          id: ent.id || 'unidentified_target',
          x: ex,
          y: ey,
          z: ez,
          distance: dist,
          threatLevel: ent.threatLevel || 'medium',
        });
      }
    }

    if (state.spottedPreyList.length > 0 && audio && typeof audio.playFalconPerchChirp === 'function') {
      audio.playFalconPerchChirp();
    }
  }
}
