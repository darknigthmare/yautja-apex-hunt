// Secteur de l'Élévateur Central en Granit de la Pyramide (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — La gigantesque plateforme élévatrice en pierre reliant les tréfonds de la crypte de la Reine aux niveaux supérieurs, broyant les proies lors de ses translations.

import { audioSynth } from '../AudioSynthesizer.js';

export const ELEVATOR_CONSTANTS = {
  TRANSIT_SPEED_MPS: 4.0,              // Vitesse de montée/descente de la dalle
  CRUSH_DAMAGE: 300.0,                 // Dégâts d'écrasement entre les rainures de granit
  PLATFORM_RADIUS_METERS: 7.0,         // Rayon de la plateforme circulaire
};

export function createPyramidElevatorState(initialY = 0.0) {
  return {
    currentPlatformY: initialY,
    targetPlatformY: initialY,
    isMoving: false,
    transitTimer: 0.0,
  };
}

export function activateElevatorAscent(state, targetAltitude = 16.0, audio = audioSynth) {
  if (!state || state.isMoving) return false;

  state.isMoving = true;
  state.targetPlatformY = targetAltitude;

  if (audio && typeof audio.playGraniteElevatorGrindClank === 'function') {
    audio.playGraniteElevatorGrindClank();
  }

  return true;
}

export function updateElevatorTransit(state, delta = 0.1, entitiesOnBoard = []) {
  if (!state || !state.isMoving) return;

  const dy = state.targetPlatformY - state.currentPlatformY;
  const step = Math.sign(dy) * Math.min(Math.abs(dy), ELEVATOR_CONSTANTS.TRANSIT_SPEED_MPS * delta);
  state.currentPlatformY += step;

  // Mise à jour de l'altitude des entités sur la plateforme
  for (const entity of entitiesOnBoard) {
    if (entity) {
      entity.y = state.currentPlatformY;
    }
  }

  if (Math.abs(state.currentPlatformY - state.targetPlatformY) < 0.05) {
    state.currentPlatformY = state.targetPlatformY;
    state.isMoving = false;
  }
}

export function evaluateGapCrush(state, entity) {
  if (!state || !state.isMoving || !entity) return { crushed: false };

  const dx = entity.x || 0;
  const dz = entity.z || 0;
  const dist = Math.hypot(dx, dz);

  // Si l'entité est pile sur le bord de cisaillement (marge de 0.4m)
  if (Math.abs(dist - ELEVATOR_CONSTANTS.PLATFORM_RADIUS_METERS) <= 0.45) {
    const damage = ELEVATOR_CONSTANTS.CRUSH_DAMAGE;
    if (typeof entity.takeDamage === 'function') {
      entity.takeDamage(damage);
    } else if (typeof entity.health === 'number') {
      entity.health = Math.max(0, entity.health - damage);
    }
    entity.isCrushedByGranite = true;

    return {
      crushed: true,
      damageDealt: damage,
    };
  }

  return { crushed: false };
}
