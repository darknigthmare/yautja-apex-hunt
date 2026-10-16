// Projecteur holographique tactique du gantelet Yautja (Lore 1:1)
// Références canoniques : Predators (2010) (carte de la planète réserve) et AVP (2004) (plan de la pyramide)

import { audioSynth } from '../AudioSynthesizer.js';

export function createWristHologramState() {
  return {
    isActive: false,
    rotationYaw: 0,
    pulseTimer: 0,
    radarRange: 120, // Rayon radar en mètres
    projectedBlips: [],
    poiMarkers: [],
  };
}

export function toggleWristHologram(state, audio = audioSynth) {
  if (!state) return false;
  state.isActive = !state.isActive;

  if (state.isActive && audio && typeof audio.playHoloMapDeploy === 'function') {
    audio.playHoloMapDeploy();
  }
  return state.isActive;
}

export function updateWristHologram(state, delta, playerPos, targets = [], pois = []) {
  if (!state || !state.isActive) return;
  const dt = Math.max(0, Number(delta) || 0);

  state.rotationYaw = (state.rotationYaw + dt * 0.75) % (Math.PI * 2);
  state.pulseTimer = (state.pulseTimer + dt * 2.0) % (Math.PI * 2);

  const range = state.radarRange;
  const px = playerPos?.x ?? 0;
  const pz = playerPos?.z ?? 0;

  // Actualisation des blips de proies
  state.projectedBlips = [];
  if (Array.isArray(targets)) {
    targets.forEach((target) => {
      if (!target || target.isDead) return;
      const tPos = target.position ?? target.mesh?.position;
      if (!tPos) return;

      const relX = tPos.x - px;
      const relZ = tPos.z - pz;
      const dist = Math.hypot(relX, relZ);

      if (dist <= range) {
        state.projectedBlips.push({
          id: target.id ?? 'blip',
          type: target.npcType ?? 'prey',
          isBoss: Boolean(target.isBoss || target.bossType),
          x: relX,
          z: relZ,
          distance: dist,
        });
      }
    });
  }

  // Actualisation des POI
  state.poiMarkers = [];
  if (Array.isArray(pois)) {
    pois.forEach((poi) => {
      if (!poi) return;
      const pos = poi.position ?? poi;
      const relX = (pos.x ?? 0) - px;
      const relZ = (pos.z ?? 0) - pz;
      const dist = Math.hypot(relX, relZ);
      if (dist <= range * 1.5) {
        state.poiMarkers.push({
          id: poi.id ?? 'shrine',
          type: poi.type ?? 'poi',
          x: relX,
          z: relZ,
          distance: dist,
        });
      }
    });
  }
}
