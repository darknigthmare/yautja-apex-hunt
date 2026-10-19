// Dôme de Brouillage Électromagnétique Anti-Drone & Radar (The Predator 2018 — Lore 1:1)
// Référence canonique : The Predator (2018) — L'impulsion électromagnétique sphérique projetée par l'équipement du Fugitive pour neutraliser les capteurs de mouvement, caméras Stargazer et tourelles automatisées.

import { audioSynth } from '../AudioSynthesizer.js';

export const EM_JAMMING_DOME_CONSTANTS = {
  DOME_RADIUS_M: 20.0,               // Rayon du dôme de contre-mesure électronique
  DISABLE_DURATION_SEC: 10.0,        // Durée de neutralisation des tourelles et radars
  ENERGY_COST: 30,                   // Coût énergétique de l'impulsion
};

export function createEmJammingDomeState() {
  return {
    isDomeActive: false,
    disabledDevicesCount: 0,
  };
}

export function triggerEmCountermeasureDome(state, originPos = { x: 0, z: 0 }, electronicDevices = [], audio = audioSynth) {
  if (!state) return { triggered: false, disabledCount: 0 };

  state.isDomeActive = true;

  if (audio && typeof audio.playEmCountermeasureDomePulse === 'function') {
    audio.playEmCountermeasureDomePulse();
  }

  let disabledCount = 0;
  if (Array.isArray(electronicDevices)) {
    for (const dev of electronicDevices) {
      if (!dev) continue;
      const dist = Math.hypot((dev.x || 0) - (originPos.x || 0), (dev.z || 0) - (originPos.z || 0));
      if (dist <= EM_JAMMING_DOME_CONSTANTS.DOME_RADIUS_M) {
        dev.isJammedByEm = true;
        dev.canTrackTargets = false;
        dev.jammedTimerSec = EM_JAMMING_DOME_CONSTANTS.DISABLE_DURATION_SEC;
        disabledCount++;
        state.disabledDevicesCount++;

        if (audio && typeof audio.playHostileTurretShortCircuitSpark === 'function') {
          audio.playHostileTurretShortCircuitSpark();
        }
      }
    }
  }

  return {
    triggered: true,
    disabledCount,
  };
}
