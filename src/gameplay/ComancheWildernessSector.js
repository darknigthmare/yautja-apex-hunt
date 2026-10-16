// Secteur de niveau Territoire Comanche 1719 & Barrage de Castors (Lore 1:1)
// Référence canonique : Prey (2022) - Rapides de rivière, barrage de castors et masque d'os du Feral Predator

import { audioSynth } from '../AudioSynthesizer.js';

export const WILDERNESS_CONSTANTS = {
  RIVER_CURRENT_SPEED: 4.8,    // Vitesse du courant de la rivière (m/s)
  DAM_MAX_HEALTH: 250.0,
  DEFLECTION_ANGLE_THRESHOLD: 45.0, // Angle de déviation du masque en os
};

export function createComancheWildernessSector() {
  return {
    riverBounds: { minX: -20, maxX: 20, minZ: -100, maxZ: 100 },
    beaverDam: {
      x: 0,
      y: 1.5,
      z: 15.0,
      width: 18.0,
      health: WILDERNESS_CONSTANTS.DAM_MAX_HEALTH,
      isBreached: false,
    },
    currentDirection: { x: 0, z: 1.0 }, // S'écoule vers les Z positifs
  };
}

export function updateRiverPhysics(sector, delta, entities = [], audio = audioSynth) {
  if (!sector) return;
  const dt = Math.max(0, Number(delta) || 0);

  let anyInWater = false;

  for (const entity of entities) {
    // Vérification de présence dans les coordonnées de la rivière
    const inRiverX = entity.x >= sector.riverBounds.minX && entity.x <= sector.riverBounds.maxX;
    const inRiverZ = entity.z >= sector.riverBounds.minZ && entity.z <= sector.riverBounds.maxZ;
    const inWater = inRiverX && inRiverZ && (entity.y || 0) <= 0.6;

    if (inWater && !entity.isAnchored) {
      anyInWater = true;
      entity.isInWater = true;
      // Entraînement par le courant fluvial
      entity.x += sector.currentDirection.x * WILDERNESS_CONSTANTS.RIVER_CURRENT_SPEED * dt;
      entity.z += sector.currentDirection.z * WILDERNESS_CONSTANTS.RIVER_CURRENT_SPEED * dt;
    } else if (entity.isInWater && !inWater) {
      entity.isInWater = false;
    }
  }

  if (anyInWater && audio && typeof audio.playRiverCurrentRush === 'function') {
    audio.playRiverCurrentRush();
  }
}

export function damageBeaverDam(sector, damage, audio = audioSynth) {
  if (!sector || !sector.beaverDam || sector.beaverDam.isBreached) return false;
  sector.beaverDam.health = Math.max(0, sector.beaverDam.health - damage);

  if (sector.beaverDam.health <= 0) {
    sector.beaverDam.isBreached = true;
    if (audio && typeof audio.playWatchtowerCollapse === 'function') {
      audio.playWatchtowerCollapse();
    }
    return true; // Brèche dans le barrage
  }
  return false;
}

export function checkBoneMaskDeflection(impactAngleDegrees) {
  // Le masque d'os de loup/ours du Feral Predator dévie les projectiles frontaux (< 45°)
  const angle = Math.abs(Number(impactAngleDegrees) || 0);
  return angle <= WILDERNESS_CONSTANTS.DEFLECTION_ANGLE_THRESHOLD;
}
