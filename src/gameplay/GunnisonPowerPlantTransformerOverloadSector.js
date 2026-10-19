// Centrale Électrique de Gunnison & Surcharge des Transformateurs (AVP:R 2007 — Lore 1:1)
// Référence canonique : Aliens vs. Predator: Requiem (2007) — Les tirs des deux canons plasma de Wolf détruisant les transformateurs haute tension de la centrale de Gunnison, plongeant toute la ville dans le blackout.

import { audioSynth } from '../AudioSynthesizer.js';

export const POWER_PLANT_CONSTANTS = {
  ARC_DISCHARGE_RADIUS_M: 7.5,       // Rayon de l'arc électrique d'explosion du transformateur
  ELECTROCUTION_DAMAGE: 185,         // Dégâts haute tension sur les cibles proches
  CITY_BLACKOUT_LIGHT_LEVEL: 0.05,   // Niveau lumineux résiduel de la ville après surcharge
};

export function createPowerPlantSectorState() {
  return {
    transformersIntact: 2,
    isCityBlackoutActive: false,
    ambientLightLevel: 1.0,
  };
}

export function overloadPowerPlantTransformer(state, transformerPos = { x: 0, z: 0 }, entitiesNearby = [], audio = audioSynth) {
  if (!state || state.transformersIntact <= 0) {
    return { overloaded: false, electrocutedCount: 0 };
  }

  state.transformersIntact--;

  if (state.transformersIntact === 0) {
    state.isCityBlackoutActive = true;
    state.ambientLightLevel = POWER_PLANT_CONSTANTS.CITY_BLACKOUT_LIGHT_LEVEL;
  }

  if (audio && typeof audio.playPowerPlantTransformerArcBoom === 'function') {
    audio.playPowerPlantTransformerArcBoom();
  }

  let electrocutedCount = 0;
  if (Array.isArray(entitiesNearby)) {
    for (const ent of entitiesNearby) {
      if (!ent) continue;
      const dist = Math.hypot((ent.x || 0) - (transformerPos.x || 0), (ent.z || 0) - (transformerPos.z || 0));
      if (dist <= POWER_PLANT_CONSTANTS.ARC_DISCHARGE_RADIUS_M) {
        ent.isElectrocutedByTransformer = true;
        electrocutedCount++;

        if (typeof ent.takeDamage === 'function') {
          ent.takeDamage(POWER_PLANT_CONSTANTS.ELECTROCUTION_DAMAGE);
        } else if (typeof ent.health === 'number') {
          ent.health = Math.max(0, ent.health - POWER_PLANT_CONSTANTS.ELECTROCUTION_DAMAGE);
        }
      }
    }
  }

  return {
    overloaded: true,
    electrocutedCount,
    cityBlackoutTriggered: state.isCityBlackoutActive,
  };
}
