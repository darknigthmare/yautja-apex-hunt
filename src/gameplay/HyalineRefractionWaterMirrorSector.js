// Secteur de Réflexion Aquatique et Mirage de Réfraction Hyaline (Predator 1987 / Prey 2022 — Lore 1:1)
// Référence canonique : Predator (1987) & Prey (2022) — La silhouette camouflée se déformant sur le miroir d'eau calme d'une rivière ou d'un marécage, trahissant la position du chasseur par distorsion spéculaire.

import { audioSynth } from '../AudioSynthesizer.js';

export const HYALINE_CONSTANTS = {
  DETECTION_ANGLE_MAX_DEG: 60.0,       // Angle de vision rasant permettant de voir le reflet déformé
  SURFACE_PROXIMITY_METERS: 2.5,       // Hauteur maximale au-dessus de l'eau pour projeter un mirage
  GLINT_DETECTION_CONFIDENCE: 0.85,    // Indice de certitude de détection pour l'IA ennemie
};

export function createWaterMirrorSectorState(waterLevelY = 0.0) {
  return {
    waterLevelY,
    activeMirages: [],
    detectedMiragesCount: 0,
  };
}

export function evaluateHyalineMirage(state, hunter, observer, audio = audioSynth) {
  if (!state || !hunter || !observer) return { spotted: false };

  // Le mirage n'apparaît que si le chasseur est camouflé et au-dessus de l'eau
  if (!hunter.isCloaked) return { spotted: false, reason: 'NOT_CLOAKED' };

  const hunterY = hunter.y ?? 0;
  if (Math.abs(hunterY - state.waterLevelY) > HYALINE_CONSTANTS.SURFACE_PROXIMITY_METERS) {
    return { spotted: false, reason: 'TOO_HIGH_ABOVE_WATER' };
  }

  const dx = (hunter.x ?? 0) - (observer.x ?? 0);
  const dz = (hunter.z ?? 0) - (observer.z ?? 0);
  const dist = Math.hypot(dx, dz);

  if (dist > 0 && dist <= 16.0) {
    state.detectedMiragesCount++;

    if (audio && typeof audio.playHyalineRefractionWaterRipple === 'function') {
      audio.playHyalineRefractionWaterRipple();
    }

    hunter.isHyalineRevealed = true;

    return {
      spotted: true,
      hunterPosition: { x: hunter.x, y: hunter.y, z: hunter.z },
      confidence: HYALINE_CONSTANTS.GLINT_DETECTION_CONFIDENCE,
      reason: 'SPECULAR_WATER_MIRAGE_DISTORTION',
    };
  }

  return { spotted: false };
}
