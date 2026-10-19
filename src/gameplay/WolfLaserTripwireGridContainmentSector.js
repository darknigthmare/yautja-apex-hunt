// Grille Laser Triangulaire de Confinement des Égouts (AVP:R 2007 — Lore 1:1)
// Référence canonique : Aliens vs. Predator: Requiem (2007) — Wolf déployant ses balises de grille laser bleue dans les tunnels d'égouts de Gunnison pour confiner et découper thermiquement les Xénomorphes.

import { audioSynth } from '../AudioSynthesizer.js';

export const LASER_GRID_CONSTANTS = {
  THERMAL_SLICE_DAMAGE: 195,         // Dégâts de découpe thermique par les faisceaux laser
  CONTAINMENT_REPEL_FORCE: 12.0,     // Impulsion de recul en cas de survie au contact
  MAX_GRID_CHARGES: 3,               // Nombre d'activations haute puissance par grille
};

export function createLaserGridSectorState() {
  return {
    deployedGrids: [],
    totalSlicedIntruders: 0,
  };
}

export function deployLaserContainmentGrid(state, tunnelPos = { x: 0, z: 0 }, audio = audioSynth) {
  if (!state) return false;

  if (audio && typeof audio.playWolfLaserGridBeaconMount === 'function') {
    audio.playWolfLaserGridBeaconMount();
  }

  state.deployedGrids.push({
    x: tunnelPos.x || 0,
    z: tunnelPos.z || 0,
    chargesRemaining: LASER_GRID_CONSTANTS.MAX_GRID_CHARGES,
    isActive: true,
  });

  return true;
}

export function evaluateLaserGridCrossing(state, entity, audio = audioSynth) {
  if (!state || !entity || !Array.isArray(state.deployedGrids)) {
    return { sliced: false };
  }

  for (const grid of state.deployedGrids) {
    if (!grid.isActive || grid.chargesRemaining <= 0) continue;

    const dist = Math.hypot((entity.x || 0) - grid.x, (entity.z || 0) - grid.z);
    if (dist <= 2.5) {
      grid.chargesRemaining--;
      if (grid.chargesRemaining <= 0) {
        grid.isActive = false;
      }

      if (audio && typeof audio.playLaserGridThermalSliceSizzle === 'function') {
        audio.playLaserGridThermalSliceSizzle();
      }

      entity.isThermallySliced = true;
      state.totalSlicedIntruders++;

      if (typeof entity.takeDamage === 'function') {
        entity.takeDamage(LASER_GRID_CONSTANTS.THERMAL_SLICE_DAMAGE);
      } else if (typeof entity.health === 'number') {
        entity.health = Math.max(0, entity.health - LASER_GRID_CONSTANTS.THERMAL_SLICE_DAMAGE);
      }

      return {
        sliced: true,
        damageDealt: LASER_GRID_CONSTANTS.THERMAL_SLICE_DAMAGE,
      };
    }
  }

  return { sliced: false };
}
