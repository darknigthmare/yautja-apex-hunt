// Système de Fusil à Harpon Balistique Perforant (Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) — Le City Hunter tire des harpons en alliage dense clouant les victimes aux cloisons et poutres

import { audioSynth } from '../AudioSynthesizer.js';

export const SPEARGUN_CONSTANTS = {
  PROJECTILE_SPEED: 42.0,              // Vélocité supersonique de la flèche (m/s)
  SPEAR_DAMAGE: 140.0,                 // Dégâts perforants cinétiques
  MAX_AMMO: 5,
  SUBSTEP_SLICE: 0.45,                 // Pas anti-tunneling (m)
};

export function createSpeargunState(initialAmmo = 5) {
  return {
    ammo: Math.max(0, parseInt(initialAmmo, 10) || 5),
    flyingSpears: [],
    pinnedVictimsCount: 0,
  };
}

export function fireSpearDart(state, originPos, aimAngle = 0, audio = audioSynth) {
  if (!state || state.ammo <= 0) return null;

  const spear = {
    id: `spear_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    x: originPos?.x || 0,
    z: originPos?.z || 0,
    vx: Math.cos(aimAngle) * SPEARGUN_CONSTANTS.PROJECTILE_SPEED,
    vz: Math.sin(aimAngle) * SPEARGUN_CONSTANTS.PROJECTILE_SPEED,
    isSpent: false,
  };

  state.ammo--;
  state.flyingSpears.push(spear);

  if (audio && typeof audio.playSpeargunPneumaticPuff === 'function') {
    audio.playSpeargunPneumaticPuff();
  }

  return spear;
}

export function updateSpeargun(state, delta, targets = [], walls = [], audio = audioSynth) {
  if (!state || state.flyingSpears.length === 0) return;
  const dt = Math.max(0, Number(delta) || 0);

  for (let i = state.flyingSpears.length - 1; i >= 0; i--) {
    const spear = state.flyingSpears[i];
    if (spear.isSpent) {
      state.flyingSpears.splice(i, 1);
      continue;
    }

    const moveDist = SPEARGUN_CONSTANTS.PROJECTILE_SPEED * dt;
    const steps = Math.max(1, Math.ceil(moveDist / SPEARGUN_CONSTANTS.SUBSTEP_SLICE));
    const subDt = dt / steps;

    for (let s = 0; s < steps; s++) {
      spear.x += spear.vx * subDt;
      spear.z += spear.vz * subDt;

      // Détection de collision avec les cibles
      let hitTarget = null;
      for (const target of targets) {
        if (!target || target.isDead) continue;
        const tx = target.x ?? (target.position ? target.position.x : 0);
        const tz = target.z ?? (target.position ? target.position.z : 0);
        const dx = tx - spear.x;
        const dz = tz - spear.z;

        if (Math.sqrt(dx * dx + dz * dz) <= 1.2) {
          hitTarget = target;
          break;
        }
      }

      if (hitTarget) {
        if (typeof hitTarget.takeDamage === 'function') {
          hitTarget.takeDamage(SPEARGUN_CONSTANTS.SPEAR_DAMAGE, 'speargun_dart');
        } else if (typeof hitTarget.health === 'number') {
          hitTarget.health = Math.max(0, hitTarget.health - SPEARGUN_CONSTANTS.SPEAR_DAMAGE);
        }

        // Vérification de la proximité d'un mur pour clouage
        let nearWall = false;
        for (const wall of walls) {
          const wx = wall.x || 0;
          const wz = wall.z || 0;
          if (Math.sqrt((hitTarget.x - wx) ** 2 + (hitTarget.z - wz) ** 2) <= 2.5) {
            nearWall = true;
            break;
          }
        }

        if (nearWall) {
          hitTarget.isPinnedToWall = true;
          state.pinnedVictimsCount++;
        }

        if (audio && typeof audio.playSpearDartWallImpaleThud === 'function') {
          audio.playSpearDartWallImpaleThud();
        }

        spear.isSpent = true;
        break;
      }
    }

    if (spear.isSpent) {
      state.flyingSpears.splice(i, 1);
    }
  }
}
