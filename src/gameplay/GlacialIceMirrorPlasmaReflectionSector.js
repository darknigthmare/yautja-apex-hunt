// Secteur de Réflexion Balistique et Miroirs de Glace Polaire (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Les crevasses glaciaires de Bouvetøya où les tirs de Plasmacaster ricochent sur les parois de séracs polis pour atteindre des cibles en angle mort.

import { audioSynth } from '../AudioSynthesizer.js';

export const ICE_REFLECTION_CONSTANTS = {
  MAX_RICOCHET_ANGLE_DEG: 75.0,        // Angle d'incidence maximal autorisant le ricochet spéculaire
  REFLECTED_DAMAGE_RETENTION: 0.85,    // 85% de la puissance de plasma conservée après rebond
  ICE_WALL_HEALTH: 250.0,              // Résistance de la paroi de glace avant effondrement
};

export function createGlacialIceSectorState() {
  return {
    iceWalls: [], // Array of { id, normal: {x, z}, origin: {x, z}, length, health }
    reflectedShotsCount: 0,
  };
}

export function registerIceWall(state, wallDef = { id: 'ice_wall_01', origin: { x: 0, z: 10 }, normal: { x: 0, z: -1 }, length: 12.0 }) {
  if (!state) return null;

  const wall = {
    id: wallDef.id || `ice_wall_${Date.now()}`,
    origin: { x: wallDef.origin?.x || 0, z: wallDef.origin?.z || 10 },
    normal: { x: wallDef.normal?.x || 0, z: wallDef.normal?.z || -1 },
    length: wallDef.length || 12.0,
    health: ICE_REFLECTION_CONSTANTS.ICE_WALL_HEALTH,
    isShattered: false,
  };

  state.iceWalls.push(wall);
  return wall;
}

export function calculatePlasmaIceRicochet(state, fireOrigin = { x: 0, z: 0 }, fireDir = { x: 0, z: 1 }, baseDamage = 100.0, targets = [], audio = audioSynth) {
  if (!state || state.iceWalls.length === 0) return { ricocheted: false };

  // Normalisation du vecteur de tir
  const len = Math.hypot(fireDir.x, fireDir.z) || 1;
  const dx = fireDir.x / len;
  const dz = fireDir.z / len;

  for (const wall of state.iceWalls) {
    if (wall.isShattered) continue;

    // Produit scalaire direction / normale du mur
    const dot = dx * wall.normal.x + dz * wall.normal.z;

    // Le ricochet n'a lieu que si le tir va vers la surface du mur (dot < 0)
    if (dot < 0) {
      const reflectedDx = dx - 2 * dot * wall.normal.x;
      const reflectedDz = dz - 2 * dot * wall.normal.z;

      state.reflectedShotsCount++;

      if (audio && typeof audio.playGlacialIceMirrorLaserPing === 'function') {
        audio.playGlacialIceMirrorLaserPing();
      }
      if (audio && typeof audio.playIceWallFractureHum === 'function') {
        audio.playIceWallFractureHum();
      }

      const reflectedDmg = baseDamage * ICE_REFLECTION_CONSTANTS.REFLECTED_DAMAGE_RETENTION;
      const struck = [];

      // Vérifier les cibles touchées par le tir réfléchi
      for (const target of targets) {
        if (!target) continue;
        const toTargetX = (target.x || 0) - wall.origin.x;
        const toTargetZ = (target.z || 0) - wall.origin.z;
        const targetDist = Math.hypot(toTargetX, toTargetZ);

        if (targetDist > 0 && targetDist <= 20.0) {
          const targetDot = (toTargetX * reflectedDx + toTargetZ * reflectedDz) / targetDist;
          if (targetDot >= 0.85) {
            if (typeof target.takeDamage === 'function') {
              target.takeDamage(reflectedDmg);
            } else if (typeof target.health === 'number') {
              target.health = Math.max(0, target.health - reflectedDmg);
            }
            target.isHitByRicochet = true;
            struck.push({ id: target.id || 'target_ricochet', damage: reflectedDmg });
          }
        }
      }

      return {
        ricocheted: true,
        wallId: wall.id,
        reflectedDir: { x: reflectedDx, z: reflectedDz },
        reflectedDamage: reflectedDmg,
        targetsHit: struck,
      };
    }
  }

  return { ricocheted: false };
}
