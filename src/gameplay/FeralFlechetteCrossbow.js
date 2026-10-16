// Système d'arbalète à fléchettes guidées par tri-laser du masque d'os (Lore 1:1)
// Référence canonique : Prey (2022) - Le Feral Predator tirant des fléchettes à tête chercheuse laser

import { audioSynth } from '../AudioSynthesizer.js';

export const FLECHETTE_CONSTANTS = {
  PROJECTILE_SPEED: 48.0,       // Vitesse de vol balistique guidé (m/s)
  IMPACT_DAMAGE: 68.0,          // Dégâts d'empalement de la fléchette
  MICRO_BLAST_DAMAGE: 42.0,     // Déflagration secondaire
  BLAST_RADIUS: 1.4,
  HOMING_STEER_RATE: 12.0,      // Vélocité angulaire de courbure vers le point laser
};

export function createFlechetteCrossbowState() {
  return {
    laserTarget: null, // { x, y, z }
    isLaserActive: false,
    activeFlechettes: [],
    quiverCapacity: 8,
    remainingFlechettes: 8,
    cooldownTimer: 0,
  };
}

export function setLaserTargetPoint(state, point3D) {
  if (!state) return;
  state.laserTarget = point3D ? { x: point3D.x, y: point3D.y || 1.5, z: point3D.z } : null;
  state.isLaserActive = Boolean(state.laserTarget);
}

export function fireGuidedFlechette(state, origin, audio = audioSynth) {
  if (!state || state.remainingFlechettes <= 0 || state.cooldownTimer > 0) return null;

  state.remainingFlechettes -= 1;
  state.cooldownTimer = 0.6;

  const target = state.laserTarget || { x: origin.x, y: origin.y, z: origin.z - 20 };
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  const dz = target.z - origin.z;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;

  const flechette = {
    id: `flechette_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    x: origin.x,
    y: origin.y,
    z: origin.z,
    vx: (dx / dist) * FLECHETTE_CONSTANTS.PROJECTILE_SPEED,
    vy: (dy / dist) * FLECHETTE_CONSTANTS.PROJECTILE_SPEED,
    vz: (dz / dist) * FLECHETTE_CONSTANTS.PROJECTILE_SPEED,
    lifetime: 3.5,
    isDetonated: false,
  };

  state.activeFlechettes.push(flechette);

  if (audio && typeof audio.playFlechetteFire === 'function') {
    audio.playFlechetteFire();
  }
  return flechette;
}

export function updateGuidedFlechettes(state, delta, entities = [], audio = audioSynth) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.cooldownTimer > 0) {
    state.cooldownTimer = Math.max(0, state.cooldownTimer - dt);
  }

  const steps = 4;
  const subDt = dt / steps;

  for (let s = 0; s < steps; s++) {
    state.activeFlechettes = state.activeFlechettes.filter(f => {
      f.lifetime -= subDt;
      if (f.lifetime <= 0 || f.isDetonated) return false;

      // Guidage vers le point laser actif
      if (state.laserTarget) {
        const dx = state.laserTarget.x - f.x;
        const dy = state.laserTarget.y - f.y;
        const dz = state.laserTarget.z - f.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 1.2) {
          f.isDetonated = true;
          detonateFlechette(f, entities, audio);
          return false;
        }

        const speed = FLECHETTE_CONSTANTS.PROJECTILE_SPEED;
        f.vx += ((dx / dist) * speed - f.vx) * FLECHETTE_CONSTANTS.HOMING_STEER_RATE * subDt;
        f.vy += ((dy / dist) * speed - f.vy) * FLECHETTE_CONSTANTS.HOMING_STEER_RATE * subDt;
        f.vz += ((dz / dist) * speed - f.vz) * FLECHETTE_CONSTANTS.HOMING_STEER_RATE * subDt;
      }

      const prevX = f.x;
      const prevY = f.y;
      const prevZ = f.z;

      f.x += f.vx * subDt;
      f.y += f.vy * subDt;
      f.z += f.vz * subDt;

      // Détection de collision sur entités (point et segment)
      for (const entity of entities) {
        const ey = entity.y || 1.5;
        const edx = entity.x - f.x;
        const edy = ey - f.y;
        const edz = entity.z - f.z;
        const dist = Math.sqrt(edx * edx + edy * edy + edz * edz);

        const pedx = entity.x - prevX;
        const pedy = ey - prevY;
        const pedz = entity.z - prevZ;
        const pdist = Math.sqrt(pedx * pedx + pedy * pedy + pedz * pedz);

        if (dist <= 1.4 || pdist <= 1.4) {
          f.isDetonated = true;
          detonateFlechette(f, entities, audio);
          return false;
        }
      }

      return true;
    });
  }
}

function detonateFlechette(flechette, entities, audio) {
  const totalDmg = FLECHETTE_CONSTANTS.IMPACT_DAMAGE + FLECHETTE_CONSTANTS.MICRO_BLAST_DAMAGE;
  for (const entity of entities) {
    const dx = entity.x - flechette.x;
    const dy = (entity.y || 1.5) - flechette.y;
    const dz = entity.z - flechette.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist <= FLECHETTE_CONSTANTS.BLAST_RADIUS) {
      if (typeof entity.applyDamage === 'function') {
        entity.applyDamage(totalDmg, 'homing_flechette_blast');
      } else if (typeof entity.health === 'number') {
        entity.health = Math.max(0, entity.health - totalDmg);
      }
    }
  }

  if (audio && typeof audio.playFlechetteImpact === 'function') {
    audio.playFlechetteImpact();
  }
}
