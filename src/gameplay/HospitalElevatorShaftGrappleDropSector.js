// Puits d'Ascenseur de l'Hôpital de Gunnison & Chute de Cabine (AVP:R 2007 — Lore 1:1)
// Référence canonique : Aliens vs. Predator: Requiem (2007) — Wolf affrontant les Xénomorphes dans la cage d'ascenseur de l'hôpital de Gunnison et tranchant les câbles de suspension pour écraser la meute en contrebas.

import { audioSynth } from '../AudioSynthesizer.js';

export const ELEVATOR_SHAFT_CONSTANTS = {
  CAR_CRUSH_DAMAGE: 450,             // Dégâts d'écrasement sous la cabine d'ascenseur
  SHAFT_RADIUS_M: 3.5,               // Rayon de la cage d'ascenseur au fond du puits
};

export function createElevatorShaftSectorState() {
  return {
    isCableIntact: true,
    carHeightM: 18.0,
    crushedTargetsCount: 0,
  };
}

export function severElevatorSuspensionCables(state, shaftBottomEnemies = [], audio = audioSynth) {
  if (!state || !state.isCableIntact) {
    return { dropped: false, crushedCount: 0 };
  }

  state.isCableIntact = false;
  state.carHeightM = 0;

  if (audio) {
    if (typeof audio.playElevatorCableSeverSnap === 'function') {
      audio.playElevatorCableSeverSnap();
    }
    if (typeof audio.playElevatorCarBottomCrashBoom === 'function') {
      audio.playElevatorCarBottomCrashBoom();
    }
  }

  let crushedCount = 0;
  if (Array.isArray(shaftBottomEnemies)) {
    for (const enemy of shaftBottomEnemies) {
      if (!enemy) continue;
      enemy.isCrushedByElevator = true;
      crushedCount++;
      state.crushedTargetsCount++;

      if (typeof enemy.takeDamage === 'function') {
        enemy.takeDamage(ELEVATOR_SHAFT_CONSTANTS.CAR_CRUSH_DAMAGE);
      } else if (typeof enemy.health === 'number') {
        enemy.health = Math.max(0, enemy.health - ELEVATOR_SHAFT_CONSTANTS.CAR_CRUSH_DAMAGE);
      }
    }
  }

  return {
    dropped: true,
    crushedCount,
  };
}
