// Système du Broyeur / Crusher Xénomorphe Cuirassé (Comics Marvel — Lore 1:1)
// Référence canonique : Comics Marvel Alien (2022) — Le Crusher, titan quadrupède à crête crânienne blindée défonçant les barricades

import { audioSynth } from '../AudioSynthesizer.js';

export const CRUSHER_CONSTANTS = {
  HEALTH: 850.0,
  FRONTAL_CREST_DEFLECTION: 0.80,  // 80% des dégâts frontaux absorbés par la crête
  CHARGE_SPEED: 14.5,              // Vitesse de course d'éperonnage (m/s)
  CHARGE_DISTANCE_MAX: 22.0,       // Distance maximale d'une charge
  CHARGE_DAMAGE: 115.0,            // Dégâts massifs d'impact
  STUN_DURATION_ON_WALL: 3.2,      // Durée d'étourdissement en cas d'impact contre un obstacle
  UNDERBELLY_VULNERABILITY_MULT: 2.5, // Dégâts critiques subis au ventre pendant l'étourdissement
};

export const CRUSHER_STATES = {
  IDLE: 'IDLE',
  WINDUP: 'WINDUP',
  CHARGING: 'CHARGING',
  STUNNED: 'STUNNED',
};

export function createCrusherState(position = { x: 0, y: 0, z: -30 }) {
  return {
    id: `crusher_${Date.now()}`,
    x: position.x,
    y: position.y,
    z: position.z,
    health: CRUSHER_CONSTANTS.HEALTH,
    state: CRUSHER_STATES.IDLE,
    chargeDir: { x: 0, z: 1 },
    chargeDistanceTraveled: 0,
    windupTimer: 0,
    stunTimer: 0,
    isDead: false,
  };
}

export function beginCrusherCharge(crusherState, targetPos, audio = audioSynth) {
  if (!crusherState || crusherState.isDead || crusherState.state !== CRUSHER_STATES.IDLE) return false;

  const dx = targetPos.x - crusherState.x;
  const dz = targetPos.z - crusherState.z;
  const dist = Math.sqrt(dx * dx + dz * dz) || 1;

  crusherState.chargeDir = { x: dx / dist, z: dz / dist };
  crusherState.state = CRUSHER_STATES.WINDUP;
  crusherState.windupTimer = 0.9;
  crusherState.chargeDistanceTraveled = 0;

  if (audio && typeof audio.playCrusherHeavyGallop === 'function') {
    audio.playCrusherHeavyGallop();
  }

  return true;
}

export function updateCrusherSystem(crusherState, delta, hunterEntity, obstacles = [], audio = audioSynth) {
  if (!crusherState || crusherState.isDead) return null;
  const dt = Math.max(0, Number(delta) || 0);

  if (crusherState.state === CRUSHER_STATES.WINDUP) {
    crusherState.windupTimer -= dt;
    if (crusherState.windupTimer <= 0) {
      crusherState.state = CRUSHER_STATES.CHARGING;
    }
    return null;
  }

  if (crusherState.state === CRUSHER_STATES.STUNNED) {
    crusherState.stunTimer -= dt;
    if (crusherState.stunTimer <= 0) {
      crusherState.state = CRUSHER_STATES.IDLE;
    }
    return null;
  }

  if (crusherState.state === CRUSHER_STATES.CHARGING) {
    const totalStep = CRUSHER_CONSTANTS.CHARGE_SPEED * dt;
    const numSubSteps = Math.max(1, Math.ceil(totalStep / 0.5));
    const subStep = totalStep / numSubSteps;

    for (let s = 0; s < numSubSteps; s++) {
      crusherState.x += crusherState.chargeDir.x * subStep;
      crusherState.z += crusherState.chargeDir.z * subStep;
      crusherState.chargeDistanceTraveled += subStep;

      // Collision avec un obstacle solide (mur, roche)
      for (const obs of obstacles) {
        const dx = crusherState.x - obs.x;
        const dz = crusherState.z - obs.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist <= (obs.radius || 1.8)) {
          crusherState.state = CRUSHER_STATES.STUNNED;
          crusherState.stunTimer = CRUSHER_CONSTANTS.STUN_DURATION_ON_WALL;

          if (audio && typeof audio.playCrusherRamImpact === 'function') {
            audio.playCrusherRamImpact();
          }
          return { hitWall: true, obstacleId: obs.id };
        }
      }

      // Collision avec le chasseur
      if (hunterEntity && !hunterEntity.isDead) {
        const hx = hunterEntity.x ?? (hunterEntity.position ? hunterEntity.position.x : 0);
        const hz = hunterEntity.z ?? (hunterEntity.position ? hunterEntity.position.z : 0);
        const dx = hx - crusherState.x;
        const dz = hz - crusherState.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist <= 2.2) {
          if (typeof hunterEntity.takeDamage === 'function') {
            hunterEntity.takeDamage(CRUSHER_CONSTANTS.CHARGE_DAMAGE, 'crusher_ram');
          } else if (typeof hunterEntity.health === 'number') {
            hunterEntity.health = Math.max(0, hunterEntity.health - CRUSHER_CONSTANTS.CHARGE_DAMAGE);
          }

          hunterEntity.isKnockedProne = true;
          crusherState.state = CRUSHER_STATES.IDLE;

          if (audio && typeof audio.playCrusherRamImpact === 'function') {
            audio.playCrusherRamImpact();
          }

          return { hitHunter: true, damageDealt: CRUSHER_CONSTANTS.CHARGE_DAMAGE };
        }
      }

      if (crusherState.chargeDistanceTraveled >= CRUSHER_CONSTANTS.CHARGE_DISTANCE_MAX) {
        crusherState.state = CRUSHER_STATES.IDLE;
        break;
      }
    }
  }

  return null;
}

export function processCrusherDamage(crusherState, hitVector, damageAmount) {
  if (!crusherState) return damageAmount;

  // Si étourdi, le ventre mou est exposé aux coups critiques
  if (crusherState.state === CRUSHER_STATES.STUNNED) {
    const finalDmg = damageAmount * CRUSHER_CONSTANTS.UNDERBELLY_VULNERABILITY_MULT;
    crusherState.health = Math.max(0, crusherState.health - finalDmg);
    return finalDmg;
  }

  // Vérification de frappe frontale sur la crête blindée
  const len = Math.sqrt(hitVector.x * hitVector.x + hitVector.z * hitVector.z) || 1;
  const dot = (hitVector.x / len) * crusherState.chargeDir.x + (hitVector.z / len) * crusherState.chargeDir.z;

  if (dot < -0.3) {
    // Frappe sur la crête protectrice
    const deflected = damageAmount * CRUSHER_CONSTANTS.FRONTAL_CREST_DEFLECTION;
    const finalDmg = damageAmount - deflected;
    crusherState.health = Math.max(0, crusherState.health - finalDmg);
    return finalDmg;
  }

  crusherState.health = Math.max(0, crusherState.health - damageAmount);
  return damageAmount;
}
