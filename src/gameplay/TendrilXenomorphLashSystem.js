// Système de Vrilles Spinales et Harponnage du Xénomorphe à Tentacules (Comics Marvel — Lore 1:1)
// Référence canonique : Comics Marvel Alien: Descendant (2023) — Variante mutée dotée de vrilles biomécaniques agrippant et tractant les proies

import { audioSynth } from '../AudioSynthesizer.js';

export const TENDRIL_CONSTANTS = {
  LASH_REACH: 7.2,                 // Portée de harponnage des vrilles spinales (m)
  PULL_SPEED: 8.5,                 // Vitesse de traction de la victime vers les mâchoires (m/s)
  GRAB_DAMAGE: 38.0,               // Dégâts initiaux de perforation barbelée
  CONSTRICT_DPS: 20.0,             // Strangulation continue par seconde
  BREAKOUT_RESISTANCE_MAX: 100.0,  // Résistance à briser pour se libérer
};

export function createTendrilXenomorphState(pos = { x: 0, y: 0, z: -15 }) {
  return {
    id: `tendril_xeno_${Date.now()}`,
    x: pos.x,
    y: pos.y,
    z: pos.z,
    health: 280.0,
    isGrappling: false,
    grappledTarget: null,
    cooldownTimer: 0,
    isDead: false,
  };
}

export function lashTendrilAtTarget(state, targetEntity, audio = audioSynth) {
  if (!state || state.isDead || state.isGrappling || state.cooldownTimer > 0 || !targetEntity || targetEntity.isDead) {
    return false;
  }

  const ex = targetEntity.x ?? (targetEntity.position ? targetEntity.position.x : 0);
  const ey = targetEntity.y ?? (targetEntity.position ? targetEntity.position.y : 0);
  const ez = targetEntity.z ?? (targetEntity.position ? targetEntity.position.z : 0);

  const dx = ex - state.x;
  const dy = ey - state.y;
  const dz = ez - state.z;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

  if (dist > TENDRIL_CONSTANTS.LASH_REACH) return false;

  state.isGrappling = true;
  state.grappledTarget = targetEntity;
  state.cooldownTimer = 5.0;

  if (typeof targetEntity.takeDamage === 'function') {
    targetEntity.takeDamage(TENDRIL_CONSTANTS.GRAB_DAMAGE, 'tendril_lash_puncture');
  } else if (typeof targetEntity.health === 'number') {
    targetEntity.health = Math.max(0, targetEntity.health - TENDRIL_CONSTANTS.GRAB_DAMAGE);
  }

  targetEntity.isGrappled = true;
  targetEntity.breakoutResistance = TENDRIL_CONSTANTS.BREAKOUT_RESISTANCE_MAX;

  if (audio && typeof audio.playTendrilLashWhip === 'function') {
    audio.playTendrilLashWhip();
  }

  return true;
}

export function updateTendrilXenomorph(state, delta, audio = audioSynth) {
  if (!state || !state.isGrappling || !state.grappledTarget) {
    if (state && state.cooldownTimer > 0) {
      state.cooldownTimer = Math.max(0, state.cooldownTimer - (Number(delta) || 0));
    }
    return;
  }

  const dt = Math.max(0, Number(delta) || 0);
  const target = state.grappledTarget;

  if (target.isDead) {
    state.isGrappling = false;
    state.grappledTarget = null;
    return;
  }

  const tx = target.x ?? (target.position ? target.position.x : 0);
  const tz = target.z ?? (target.position ? target.position.z : 0);

  const dx = state.x - tx;
  const dz = state.z - tz;
  const dist = Math.sqrt(dx * dx + dz * dz);

  if (dist > 1.4) {
    const step = Math.min(dist, TENDRIL_CONSTANTS.PULL_SPEED * dt);
    const nx = tx + (dx / dist) * step;
    const nz = tz + (dz / dist) * step;

    if (target.position) {
      target.position.x = nx;
      target.position.z = nz;
    }
    target.x = nx;
    target.z = nz;

    // Strangulation continue
    const choke = TENDRIL_CONSTANTS.CONSTRICT_DPS * dt;
    if (typeof target.takeDamage === 'function') {
      target.takeDamage(choke, 'tendril_constriction');
    } else if (typeof target.health === 'number') {
      target.health = Math.max(0, target.health - choke);
    }
  } else {
    // Proie amenée à portée de morsure
    if (audio && typeof audio.playTendrilConstrictChoke === 'function') {
      audio.playTendrilConstrictChoke();
    }
  }
}

export function severTendrilGrapple(state, severDamage = 60.0) {
  if (!state || !state.isGrappling || !state.grappledTarget) return false;

  state.grappledTarget.isGrappled = false;
  state.isGrappling = false;
  state.grappledTarget = null;
  state.health -= severDamage;
  return true;
}
