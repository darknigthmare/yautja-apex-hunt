// Directeur de Combat Équestre & Archerie Montée Comanche de Taabe (Prey 2022 — Lore 1:1)
// Référence canonique : Prey (2022) — Taabe galope en cercle autour du Feral Predator en décochant des flèches d'os pour faire diversion

import { audioSynth } from '../AudioSynthesizer.js';

export const HORSEBACK_CONSTANTS = {
  GALLOP_SPEED_RAD_PER_SEC: 1.1,       // Vitesse angulaire de ronde équestre
  ORBIT_RADIUS: 12.0,                  // Rayon de giration autour du Predator (m)
  ARROW_DAMAGE: 55.0,                  // Dégâts perforants par flèche
  FIRE_INTERVAL: 1.2,                  // Cadence de tir à l'arc (s)
};

export function createHorsebackArcheryState(centerPos = { x: 0, z: 0 }) {
  return {
    orbitCenter: { x: centerPos.x || 0, z: centerPos.z || 0 },
    currentAngle: 0.0,
    x: 12.0,
    z: 0.0,
    fireTimer: 0.0,
    arrowsLandedCount: 0,
    isDistractingTarget: false,
  };
}

export function updateHorsebackArchery(state, delta, predatorTarget, audio = audioSynth) {
  if (!state || !predatorTarget || predatorTarget.isDead) {
    if (state) state.isDistractingTarget = false;
    return;
  }
  const dt = Math.max(0, Number(delta) || 0);

  const px = predatorTarget.x ?? (predatorTarget.position ? predatorTarget.position.x : 0);
  const pz = predatorTarget.z ?? (predatorTarget.position ? predatorTarget.position.z : 0);

  // Évolution circulaire à cheval autour du chasseur
  state.currentAngle += HORSEBACK_CONSTANTS.GALLOP_SPEED_RAD_PER_SEC * dt;
  state.x = px + Math.cos(state.currentAngle) * HORSEBACK_CONSTANTS.ORBIT_RADIUS;
  state.z = pz + Math.sin(state.currentAngle) * HORSEBACK_CONSTANTS.ORBIT_RADIUS;

  predatorTarget.isDistracted = true;
  state.isDistractingTarget = true;

  // Tir de flèches comanches régulier
  state.fireTimer += dt;
  while (state.fireTimer >= HORSEBACK_CONSTANTS.FIRE_INTERVAL) {
    state.fireTimer -= HORSEBACK_CONSTANTS.FIRE_INTERVAL;
    state.arrowsLandedCount++;

    if (audio && typeof audio.playComancheArrowBowTwang === 'function') {
      audio.playComancheArrowBowTwang();
    }

    if (typeof predatorTarget.takeDamage === 'function') {
      predatorTarget.takeDamage(HORSEBACK_CONSTANTS.ARROW_DAMAGE, 'comanche_bone_arrow');
    } else if (typeof predatorTarget.health === 'number') {
      predatorTarget.health = Math.max(0, predatorTarget.health - HORSEBACK_CONSTANTS.ARROW_DAMAGE);
    }
  }
}
