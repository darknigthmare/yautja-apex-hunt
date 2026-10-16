// Secteur de niveau Rame de Métro de Los Angeles 1990 (Lore 1:1)
// Référence canonique : Predator 2 (1990) - Embuscade dans la rame de métro en mouvement avec stroboscope

import { audioSynth } from '../AudioSynthesizer.js';

export const SUBWAY_CONSTANTS = {
  CARRIAGE_LENGTH: 26.0,
  CARRIAGE_WIDTH: 3.2,
  NORMAL_SPEED_KMH: 68.0,
  STROBE_INTERVAL: 0.28, // Battement rapide de la lumière clignotante
};

export function createSubwayTrainSector() {
  return {
    isMoving: true,
    currentSpeedKmh: SUBWAY_CONSTANTS.NORMAL_SPEED_KMH,
    isBraking: false,
    strobeTimer: 0,
    isStrobeOn: true,
    strobeFlashCount: 0,
    emergencyBrakePulled: false,
    rooftopHatchOpen: false,
    lightsPowered: true,
  };
}

export function triggerEmergencyBrake(sector, audio = audioSynth) {
  if (!sector || sector.emergencyBrakePulled) return false;
  sector.emergencyBrakePulled = true;
  sector.isBraking = true;

  if (audio && typeof audio.playSubwayBrakeScreech === 'function') {
    audio.playSubwayBrakeScreech();
  }
  return true;
}

export function toggleRooftopHatch(sector) {
  if (!sector) return false;
  sector.rooftopHatchOpen = !sector.rooftopHatchOpen;
  return sector.rooftopHatchOpen;
}

export function updateSubwayTrainSector(sector, delta, passengers = [], audio = audioSynth) {
  if (!sector) return;
  const dt = Math.max(0, Number(delta) || 0);

  // 1. Clignotement stroboscopique des néons d'urgence
  if (sector.lightsPowered) {
    sector.strobeTimer += dt;
    if (sector.strobeTimer >= SUBWAY_CONSTANTS.STROBE_INTERVAL) {
      sector.strobeTimer = 0;
      sector.isStrobeOn = !sector.isStrobeOn;
      sector.strobeFlashCount += 1;
    }
  } else {
    sector.isStrobeOn = false;
  }

  // 2. Physique de mouvement et freinage d'urgence
  if (sector.isBraking) {
    sector.currentSpeedKmh = Math.max(0, sector.currentSpeedKmh - 45.0 * dt);
    if (sector.currentSpeedKmh <= 0) {
      sector.isBraking = false;
      sector.isMoving = false;
      sector.lightsPowered = false; // Coupure de courant finale
    }

    // Le freinage brutal déséquilibre les passagers non ancrés
    for (const p of passengers) {
      if (!p.isAnchored) {
        p.isStaggered = true;
      }
    }
  } else if (sector.isMoving) {
    if (audio && Math.random() < 0.05 && typeof audio.playSubwayTrainRattle === 'function') {
      audio.playSubwayTrainRattle();
    }
  }
}

export function isStrobeDisorienting(sector) {
  if (!sector) return false;
  return sector.lightsPowered && !sector.isStrobeOn;
}
