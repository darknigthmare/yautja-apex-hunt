// Directeur de traque forensique par phéromones et sécrétions fluorescentes (Lore 1:1)
// Référence canonique : Aliens vs. Predator: Requiem (2007) - Wolf pistant les sécrétions de Xénomorphes et du PredAlien

import { audioSynth } from '../AudioSynthesizer.js';

export const PHEROMONE_CONSTANTS = {
  TRACK_MAX_LIFETIME: 45.0,     // Durée de rémanence des traces fluorescentes
  GLOW_INTENSITY_FRESH: 1.0,
  DETECTION_RADIUS: 28.0,
};

export function createPheromoneTrackingState() {
  return {
    isPheromoneModeActive: false,
    slimeTracks: [],
    detectedEntitiesCount: 0,
  };
}

export function activatePheromoneMode(state, audio = audioSynth) {
  if (!state) return false;
  state.isPheromoneModeActive = !state.isPheromoneModeActive;

  if (state.isPheromoneModeActive && audio && typeof audio.playPheromoneScanHum === 'function') {
    audio.playPheromoneScanHum();
  }
  return state.isPheromoneModeActive;
}

export function registerSlimeTrack(state, position, species = 'Xenomorph') {
  if (!state || !position) return null;
  const track = {
    id: `slime_track_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    x: Number(position.x) || 0,
    y: Number(position.y) || 0,
    z: Number(position.z) || 0,
    species,
    remainingLifetime: PHEROMONE_CONSTANTS.TRACK_MAX_LIFETIME,
    luminescence: PHEROMONE_CONSTANTS.GLOW_INTENSITY_FRESH,
  };
  state.slimeTracks.push(track);
  return track;
}

export function updatePheromoneTracking(state, delta) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  state.slimeTracks = state.slimeTracks.filter(track => {
    track.remainingLifetime -= dt;
    track.luminescence = Math.max(0, track.remainingLifetime / PHEROMONE_CONSTANTS.TRACK_MAX_LIFETIME);
    return track.remainingLifetime > 0;
  });
}

export function getVisiblePheromoneTracks(state, observerPos) {
  if (!state || !state.isPheromoneModeActive || !observerPos) return [];
  return state.slimeTracks.filter(t => {
    const dx = t.x - observerPos.x;
    const dz = t.z - observerPos.z;
    return Math.sqrt(dx * dx + dz * dz) <= PHEROMONE_CONSTANTS.DETECTION_RADIUS;
  });
}
