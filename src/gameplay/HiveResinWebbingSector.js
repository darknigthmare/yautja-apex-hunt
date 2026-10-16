// Secteur de Niveau : Toiles de Résine Biologique et Alerte de Ruche (Comics Marvel — Lore 1:1)
// Référence canonique : Comics Marvel Alien (2021) — Les coursives coloniales tapissées de résine sécrétée transmettant les vibrations d'intrus

import { audioSynth } from '../AudioSynthesizer.js';

export const RESIN_WEB_CONSTANTS = {
  SNARE_SLOW_FACTOR: 0.4,          // Vitesse réduite à 40% lors de la traversée de la toile
  VIBRATION_ALERT_RADIUS: 32.0,    // Rayon de transmission acoustique alertant les Xénomorphes
  WEB_HEALTH: 25.0,                // Santé de la toile avant incinération/dissolution
};

export function createHiveResinWebbingState() {
  return {
    webNodes: [
      { id: 'web_arch_01', x: 0.0, y: 0, z: -12.0, radius: 2.2, isIntact: true },
      { id: 'web_arch_02', x: 14.0, y: 0, z: -22.0, radius: 2.2, isIntact: true },
      { id: 'web_arch_03', x: -14.0, y: 0, z: -22.0, radius: 2.2, isIntact: true },
    ],
    vibrationsAlertedEnemies: [],
  };
}

export function updateHiveResinWebs(state, actorPos, nearbyXenos = [], audio = audioSynth) {
  if (!state) return { isInWeb: false, hiveAlerted: false };

  let isInWeb = false;
  let hiveAlerted = false;

  for (const web of state.webNodes) {
    if (!web.isIntact) continue;

    const dx = actorPos.x - web.x;
    const dz = actorPos.z - web.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist <= web.radius) {
      isInWeb = true;

      // Déclenchement de la vibration de toile alertant la ruche
      if (audio && typeof audio.playResinWebStickSnap === 'function') {
        audio.playResinWebStickSnap();
      }

      for (const xeno of nearbyXenos) {
        if (!xeno || xeno.isDead) continue;
        const xx = xeno.x ?? (xeno.position ? xeno.position.x : 0);
        const xz = xeno.z ?? (xeno.position ? xeno.position.z : 0);
        const xDist = Math.sqrt((xx - web.x) ** 2 + (xz - web.z) ** 2);

        if (xDist <= RESIN_WEB_CONSTANTS.VIBRATION_ALERT_RADIUS) {
          xeno.isAlerted = true;
          xeno.targetPosition = { x: actorPos.x, y: actorPos.y, z: actorPos.z };
          hiveAlerted = true;
        }
      }
      break;
    }
  }

  return { isInWeb, hiveAlerted };
}

export function burnOrDissolveWeb(state, webId) {
  if (!state) return false;
  const web = state.webNodes.find(w => w.id === webId);
  if (!web || !web.isIntact) return false;

  web.isIntact = false;
  return true;
}
