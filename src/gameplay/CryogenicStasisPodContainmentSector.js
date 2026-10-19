// Générateur de Champ de Stase Cryogénique & Capsules de Reliques (The Predator 2018 — Lore 1:1)
// Référence canonique : The Predator (2018) — Les capsules de stase cryogénique à bord du vaisseau du Fugitive et de l'Ark Ship renfermant des équipements ancestraux et libérant un nuage d'azote à l'ouverture.

import { audioSynth } from '../AudioSynthesizer.js';

export const CRYO_STASIS_CONSTANTS = {
  CRYO_VENT_RADIUS_M: 4.0,           // Rayon du souffle cryogénique à la dépressurisation
  CRYO_FROST_SLOW_FACTOR: 0.4,       // Ralentissement des ennemis pris dans la purge azotée
  RELIC_ENERGY_RESTORE: 60,          // Recharge énergétique octroyée par la relique extraite
};

export function createCryoStasisSectorState() {
  return {
    pods: [],
    openedPodsCount: 0,
  };
}

export function registerCryoStasisPod(state, podId, position = { x: 0, z: 0 }, relicId = 'ancestral_gauntlet') {
  if (!state) return false;
  state.pods.push({
    id: podId || `pod_${state.pods.length + 1}`,
    x: position.x || 0,
    z: position.z || 0,
    relicId,
    isSealed: true,
  });
  return true;
}

export function unsealCryoStasisPod(state, podIndex = 0, hunter = null, nearbyHostiles = [], audio = audioSynth) {
  if (!state || !state.pods[podIndex] || !state.pods[podIndex].isSealed) {
    return { unsealed: false };
  }

  const pod = state.pods[podIndex];
  pod.isSealed = false;
  state.openedPodsCount++;

  if (audio && typeof audio.playCryogenicStasisPodHissOpen === 'function') {
    audio.playCryogenicStasisPodHissOpen();
  }

  if (hunter) {
    hunter.acquiredRelic = pod.relicId;
    if (typeof hunter.energy === 'number') {
      hunter.energy = Math.min(hunter.maxEnergy || 100, hunter.energy + CRYO_STASIS_CONSTANTS.RELIC_ENERGY_RESTORE);
    }
  }

  let frostedHostilesCount = 0;
  if (Array.isArray(nearbyHostiles)) {
    for (const enemy of nearbyHostiles) {
      if (!enemy) continue;
      const dist = Math.hypot((enemy.x || 0) - pod.x, (enemy.z || 0) - pod.z);
      if (dist <= CRYO_STASIS_CONSTANTS.CRYO_VENT_RADIUS_M) {
        enemy.isCryoFrosted = true;
        enemy.speedMultiplier = CRYO_STASIS_CONSTANTS.CRYO_FROST_SLOW_FACTOR;
        frostedHostilesCount++;
      }
    }
  }

  return {
    unsealed: true,
    relicRecovered: pod.relicId,
    frostedHostilesCount,
  };
}
