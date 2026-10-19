// Secteur de Flèches Incendiaires et Feux de Brousse Aveuglants (Prey 2022 — Lore 1:1)
// Référence canonique : Prey (2022) — Naru enflammant les hautes herbes et fourrés de la forêt avec des flèches imprégnées d'huile, saturant la vision thermique infrarouge du Feral Predator.

import { audioSynth } from '../AudioSynthesizer.js';

export const BRUSHFIRE_CONSTANTS = {
  FIRE_SPREAD_RADIUS: 4.5,            // Rayon d'embrasement du foyer de brousse (mètres)
  BURN_DAMAGE_PER_SEC: 28.0,          // Dégâts de brûlure pour les entités traversant le brasier
  THERMAL_BLIND_RADIUS: 14.0,         // Rayon d'éblouissement et saturation infrarouge thermique
  FIRE_DURATION_SEC: 9.0,             // Durée de combustion des taillis
};

export function createBrushfireSectorState() {
  return {
    activeFires: [], // Array of { id, x, z, remainingTime, intensity }
  };
}

export function launchIncendiaryArrow(state, targetPos = { x: 0, z: 0 }, audio = audioSynth) {
  if (!state || !targetPos) return null;

  if (audio && typeof audio.playIncendiaryArrowWhoosh === 'function') {
    audio.playIncendiaryArrowWhoosh();
  }

  if (audio && typeof audio.playBrushfireIgnitionCrackle === 'function') {
    audio.playBrushfireIgnitionCrackle();
  }

  const fireId = `fire_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const fire = {
    id: fireId,
    x: targetPos.x || 0,
    z: targetPos.z || 0,
    remainingTime: BRUSHFIRE_CONSTANTS.FIRE_DURATION_SEC,
    intensity: 1.0,
    radius: BRUSHFIRE_CONSTANTS.FIRE_SPREAD_RADIUS,
  };

  state.activeFires.push(fire);

  return {
    success: true,
    fire,
  };
}

export function evaluateThermalSaturation(state, hunterPos = { x: 0, z: 0 }) {
  if (!state || state.activeFires.length === 0) {
    return { isSaturated: false, whiteoutLevel: 0.0 };
  }

  let maxWhiteout = 0.0;

  for (const fire of state.activeFires) {
    const dx = fire.x - (hunterPos.x || 0);
    const dz = fire.z - (hunterPos.z || 0);
    const dist = Math.hypot(dx, dz);

    if (dist <= BRUSHFIRE_CONSTANTS.THERMAL_BLIND_RADIUS) {
      const falloff = 1.0 - dist / BRUSHFIRE_CONSTANTS.THERMAL_BLIND_RADIUS;
      const whiteout = falloff * fire.intensity;
      if (whiteout > maxWhiteout) {
        maxWhiteout = whiteout;
      }
    }
  }

  return {
    isSaturated: maxWhiteout > 0.15,
    whiteoutLevel: maxWhiteout,
    reason: 'INFRARED_INTENSE_HEAT_BLOOM',
  };
}

export function updateBrushfires(state, delta = 0.1, entities = []) {
  if (!state) return;

  for (let i = state.activeFires.length - 1; i >= 0; i--) {
    const fire = state.activeFires[i];
    fire.remainingTime -= delta;
    fire.intensity = Math.max(0.1, fire.remainingTime / BRUSHFIRE_CONSTANTS.FIRE_DURATION_SEC);

    // Dégâts de brûlure aux entités proches
    for (const entity of entities) {
      if (!entity) continue;
      const dx = (entity.x || 0) - fire.x;
      const dz = (entity.z || 0) - fire.z;
      if (Math.hypot(dx, dz) <= fire.radius) {
        const dmg = BRUSHFIRE_CONSTANTS.BURN_DAMAGE_PER_SEC * delta;
        if (typeof entity.takeDamage === 'function') {
          entity.takeDamage(dmg);
        } else if (typeof entity.health === 'number') {
          entity.health = Math.max(0, entity.health - dmg);
        }
        entity.isOnFire = true;
      }
    }

    if (fire.remainingTime <= 0) {
      state.activeFires.splice(i, 1);
    }
  }
}
