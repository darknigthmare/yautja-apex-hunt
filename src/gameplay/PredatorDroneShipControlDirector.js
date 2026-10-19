// Directeur de Télémétrie & Frappe Orbitale du Vaisseau Scout Yautja (The Predator 2018 — Lore 1:1)
// Référence canonique : The Predator (2018) — La balise de pointage du gantelet guidant les tirs de plasma lourds du vaisseau en orbite basse

import { audioSynth } from '../AudioSynthesizer.js';

export const DRONE_SHIP_CONSTANTS = {
  LOCK_ON_DURATION: 2.0,               // Temps d'acquisition du verrouillage laser orbital (s)
  ORBITAL_STRIKE_DAMAGE: 280.0,        // Dégâts colossaux du tir plasma orbital
  ORBITAL_STRIKE_RADIUS: 7.5,          // Rayon de cratérisation de l'impact (m)
  COOLDOWN_TIME: 15.0,                 // Temps de recharge du relais satellite (s)
};

export function createDroneShipState() {
  return {
    cooldownTimer: 0.0,
    isLocking: false,
    lockTimer: 0.0,
    lockedTargetPos: null,
    orbitalStrikesFired: 0,
  };
}

export function initiateOrbitalLock(state, targetPos, audio = audioSynth) {
  if (!state || state.cooldownTimer > 0 || state.isLocking) return false;

  state.isLocking = true;
  state.lockTimer = 0.0;
  state.lockedTargetPos = { x: targetPos.x || 0, z: targetPos.z || 0 };

  if (audio && typeof audio.playNuclearGlyphCountdownBeep === 'function') {
    audio.playNuclearGlyphCountdownBeep();
  }

  return true;
}

export function updateDroneShipDirector(state, delta, entities = [], audio = audioSynth) {
  if (!state) return null;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.cooldownTimer > 0) {
    state.cooldownTimer = Math.max(0, state.cooldownTimer - dt);
  }

  if (!state.isLocking || !state.lockedTargetPos) return null;

  state.lockTimer += dt;

  if (state.lockTimer >= DRONE_SHIP_CONSTANTS.LOCK_ON_DURATION) {
    // Frappe orbitale délivrée
    state.isLocking = false;
    state.lockTimer = 0.0;
    state.cooldownTimer = DRONE_SHIP_CONSTANTS.COOLDOWN_TIME;
    state.orbitalStrikesFired++;

    if (audio && typeof audio.playFuelDrumExplosionBoom === 'function') {
      audio.playFuelDrumExplosionBoom();
    }

    const tx = state.lockedTargetPos.x;
    const tz = state.lockedTargetPos.z;
    let victimsHit = 0;

    for (const ent of entities) {
      if (!ent || ent.isDead) continue;
      const ex = ent.x ?? (ent.position ? ent.position.x : 0);
      const ez = ent.z ?? (ent.position ? ent.position.z : 0);
      const dist = Math.sqrt((ex - tx) ** 2 + (ez - tz) ** 2);

      if (dist <= DRONE_SHIP_CONSTANTS.ORBITAL_STRIKE_RADIUS) {
        victimsHit++;
        if (typeof ent.takeDamage === 'function') {
          ent.takeDamage(DRONE_SHIP_CONSTANTS.ORBITAL_STRIKE_DAMAGE, 'orbital_plasma_strike');
        } else if (typeof ent.health === 'number') {
          ent.health = Math.max(0, ent.health - DRONE_SHIP_CONSTANTS.ORBITAL_STRIKE_DAMAGE);
        }
        ent.isKnockedBack = true;
        ent.isStaggered = true;
        ent.staggerTimer = 3.0;
      }
    }

    const result = {
      delivered: true,
      impactAt: { x: tx, z: tz },
      casualties: victimsHit,
    };
    state.lockedTargetPos = null;
    return result;
  }

  return { delivered: false, progress: state.lockTimer / DRONE_SHIP_CONSTANTS.LOCK_ON_DURATION };
}
