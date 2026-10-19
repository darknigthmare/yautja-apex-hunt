// Secteur de Flèches à Soufre et Conflagration de Résine d'Épinette (Prey 2022 — Lore 1:1)
// Référence canonique : Prey (2022) — Naru imprégnant ses pointes de flèches de soufre volcanique et de poix d'épinette pour déclencher des brasiers nocturnes ardents.

import { audioSynth } from '../AudioSynthesizer.js';

export const SULFUR_RESIN_CONSTANTS = {
  CONFLAGRATION_RADIUS_METERS: 5.5,   // Rayon d'embrasement de la poix d'épinette
  RESIN_BURN_DAMAGE_DPS: 32.0,        // Dégâts de brûlure chimique et thermique par seconde
  SMOKE_VISION_OBSCURATION: 0.85,     // Écran de fumée sulfureuse opaque
  BURN_DURATION_SEC: 8.0,             // Durée de combustion de la résine collante
};

export function createSulfurArrowSectorState() {
  return {
    activeConflagrations: [], // Array of { id, x, z, remainingTime }
  };
}

export function launchSulfurResinArrow(state, impactPos = { x: 0, z: 0 }, audio = audioSynth) {
  if (!state || !impactPos) return null;

  if (audio && typeof audio.playSulfurArrowIgnitionHiss === 'function') {
    audio.playSulfurArrowIgnitionHiss();
  }
  if (audio && typeof audio.playSprucePitchConflagrationRoar === 'function') {
    audio.playSprucePitchConflagrationRoar();
  }

  const blazeId = `blaze_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const blaze = {
    id: blazeId,
    x: impactPos.x || 0,
    z: impactPos.z || 0,
    remainingTime: SULFUR_RESIN_CONSTANTS.BURN_DURATION_SEC,
    radius: SULFUR_RESIN_CONSTANTS.CONFLAGRATION_RADIUS_METERS,
  };

  state.activeConflagrations.push(blaze);

  return {
    success: true,
    blaze,
  };
}

export function updateSulfurConflagrations(state, delta = 0.1, entities = []) {
  if (!state) return;

  for (let i = state.activeConflagrations.length - 1; i >= 0; i--) {
    const blaze = state.activeConflagrations[i];
    blaze.remainingTime -= delta;

    for (const entity of entities) {
      if (!entity) continue;
      const dx = (entity.x || 0) - blaze.x;
      const dz = (entity.z || 0) - blaze.z;
      if (Math.hypot(dx, dz) <= blaze.radius) {
        const dmg = SULFUR_RESIN_CONSTANTS.RESIN_BURN_DAMAGE_DPS * delta;
        if (typeof entity.takeDamage === 'function') {
          entity.takeDamage(dmg);
        } else if (typeof entity.health === 'number') {
          entity.health = Math.max(0, entity.health - dmg);
        }
        entity.isCoatedInPitch = true;
      }
    }

    if (blaze.remainingTime <= 0) {
      state.activeConflagrations.splice(i, 1);
    }
  }
}
