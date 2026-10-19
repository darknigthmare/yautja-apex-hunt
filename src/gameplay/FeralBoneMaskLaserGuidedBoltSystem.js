// Système de Fléchettes Osseuses à Guidage Laser par Masque (Prey 2022 — Lore 1:1)
// Référence canonique : Prey (2022) — Le masque osseux du Feral Predator guide les fléchettes autopropulsées via ses 3 points laser rouges

import { audioSynth } from '../AudioSynthesizer.js';

export const FERAL_BOLT_CONSTANTS = {
  BOLT_SPEED: 32.0,                    // Vitesse de vol de la fléchette propulsée (m/s)
  BOLT_DAMAGE: 135.0,                  // Dégâts perforants crâniens
  HOMING_TURN_RATE: 7.5,               // Taux de virage gyroscopique (rad/s)
  MAX_AMMO: 6,
  SUBSTEP_SLICE: 0.5,                  // Pas anti-tunneling (m)
};

export function createFeralBoneMaskBoltState() {
  return {
    ammo: FERAL_BOLT_CONSTANTS.MAX_AMMO,
    mask: {
      isDetached: false,
      x: 0,
      y: 1.8,
      z: 0,
      laserTarget: { x: 0, z: -20 },
    },
    activeBolts: [],
    hitsScored: 0,
    selfInflictedHits: 0,
  };
}

export function fireGuidedBoneBolt(state, launcherPos, audio = audioSynth) {
  if (!state || state.ammo <= 0) return null;

  const lx = launcherPos?.x || 0;
  const lz = launcherPos?.z || 0;
  const tx = state.mask.laserTarget.x;
  const tz = state.mask.laserTarget.z;

  const dx = tx - lx;
  const dz = tz - lz;
  const dist = Math.sqrt(dx * dx + dz * dz) || 1.0;

  const bolt = {
    id: `bone_bolt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    x: lx,
    z: lz,
    vx: (dx / dist) * FERAL_BOLT_CONSTANTS.BOLT_SPEED,
    vz: (dz / dist) * FERAL_BOLT_CONSTANTS.BOLT_SPEED,
    isExpired: false,
  };

  state.activeBolts.push(bolt);
  state.ammo--;

  if (audio && typeof audio.playFeralBoneBoltLaunch === 'function') {
    audio.playFeralBoneBoltLaunch();
  }

  return bolt;
}

export function detachBoneMask(state, dropPos, aimedTargetPos) {
  if (!state || !state.mask) return;

  state.mask.isDetached = true;
  state.mask.x = dropPos?.x || 0;
  state.mask.z = dropPos?.z || 0;
  state.mask.y = 0.2; // Au sol
  if (aimedTargetPos) {
    state.mask.laserTarget = { x: aimedTargetPos.x, z: aimedTargetPos.z };
  }
}

export function updateFeralBoneBolts(state, delta, entities = [], audio = audioSynth) {
  if (!state || state.activeBolts.length === 0) return;
  const dt = Math.max(0, Number(delta) || 0);

  const tx = state.mask.laserTarget.x;
  const tz = state.mask.laserTarget.z;

  for (let i = state.activeBolts.length - 1; i >= 0; i--) {
    const bolt = state.activeBolts[i];
    if (bolt.isExpired) {
      state.activeBolts.splice(i, 1);
      continue;
    }

    const moveDist = FERAL_BOLT_CONSTANTS.BOLT_SPEED * dt;
    const steps = Math.max(1, Math.ceil(moveDist / FERAL_BOLT_CONSTANTS.SUBSTEP_SLICE));
    const subDt = dt / steps;

    for (let s = 0; s < steps; s++) {
      // Guidage laser : réorientation vers state.mask.laserTarget
      const toTargetX = tx - bolt.x;
      const toTargetZ = tz - bolt.z;
      const distToTarget = Math.sqrt(toTargetX * toTargetX + toTargetZ * toTargetZ);

      if (distToTarget > 0.1) {
        const desiredVx = (toTargetX / distToTarget) * FERAL_BOLT_CONSTANTS.BOLT_SPEED;
        const desiredVz = (toTargetZ / distToTarget) * FERAL_BOLT_CONSTANTS.BOLT_SPEED;

        bolt.vx += (desiredVx - bolt.vx) * FERAL_BOLT_CONSTANTS.HOMING_TURN_RATE * subDt;
        bolt.vz += (desiredVz - bolt.vz) * FERAL_BOLT_CONSTANTS.HOMING_TURN_RATE * subDt;
      }

      bolt.x += bolt.vx * subDt;
      bolt.z += bolt.vz * subDt;

      // Détection d'impact avec les entités
      let hasHit = false;
      for (const ent of entities) {
        if (!ent || ent.isDead) continue;
        const ex = ent.x ?? (ent.position ? ent.position.x : 0);
        const ez = ent.z ?? (ent.position ? ent.position.z : 0);
        const dx = ex - bolt.x;
        const dz = ez - bolt.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist <= 1.2) {
          hasHit = true;
          state.hitsScored++;

          if (typeof ent.takeDamage === 'function') {
            ent.takeDamage(FERAL_BOLT_CONSTANTS.BOLT_DAMAGE, 'bone_bolt');
          } else if (typeof ent.health === 'number') {
            ent.health = Math.max(0, ent.health - FERAL_BOLT_CONSTANTS.BOLT_DAMAGE);
          }

          if (ent.role === 'feral_predator' || ent.id === 'feral_predator') {
            state.selfInflictedHits++;
          }

          if (audio && typeof audio.playFeralBoltImpactBone === 'function') {
            audio.playFeralBoltImpactBone();
          }
          break;
        }
      }

      if (hasHit || distToTarget <= 0.6) {
        bolt.isExpired = true;
        break;
      }
    }

    if (bolt.isExpired) {
      state.activeBolts.splice(i, 1);
    }
  }
}
