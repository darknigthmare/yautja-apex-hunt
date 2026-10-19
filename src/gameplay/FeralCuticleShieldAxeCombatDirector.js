// Directeur de Combat Bouclier Cuticulaire et Hache Télescopique Feral (Prey 2022 — Lore 1:1)
// Référence canonique : Prey (2022) — L'armement proto-Yautja du Feral combinant l'éventail osseux rétractable et la hache de guerre télescopique.

import { audioSynth } from '../AudioSynthesizer.js';

export const FERAL_COMBAT_CONSTANTS = {
  SHIELD_ABSORB_ANGLE_DEG: 140.0,      // Arc protecteur frontal du bouclier ouvert
  FAN_SPIN_SLASH_DAMAGE: 95.0,         // Dégâts tranchants de la rotation à 360° du bouclier
  FAN_SPIN_RADIUS: 3.0,                // Rayon d'impact de la taillade circulaire
  AXE_OVERHEAD_DAMAGE: 130.0,          // Dégâts d'impact vertical de la hache en os lourd
  AXE_REACH_METERS: 3.2,               // Portée de la hache télescopique déployée
};

export function createFeralCombatState() {
  return {
    isShieldFanOpen: false,
    isAxeExtended: false,
    blockedAttacksCount: 0,
    slashedEnemiesCount: 0,
  };
}

export function toggleFanCuticleShield(state, open = true, audio = audioSynth) {
  if (!state) return false;

  state.isShieldFanOpen = open;

  if (open && audio && typeof audio.playCuticleFanShieldSnap === 'function') {
    audio.playCuticleFanShieldSnap();
  }

  return true;
}

export function evaluateShieldBlock(state, impactAngleDeg = 0, incomingDamage = 50.0) {
  if (!state || !state.isShieldFanOpen) {
    return { blocked: false, damageTaken: incomingDamage };
  }

  const halfAngle = FERAL_COMBAT_CONSTANTS.SHIELD_ABSORB_ANGLE_DEG * 0.5;
  const isWithinArc = Math.abs(impactAngleDeg) <= halfAngle;

  if (isWithinArc) {
    state.blockedAttacksCount++;
    return {
      blocked: true,
      damageTaken: 0,
      totalBlocked: state.blockedAttacksCount,
    };
  }

  return { blocked: false, damageTaken: incomingDamage };
}

export function executeShieldSpinSlash(state, origin = { x: 0, z: 0 }, targets = [], audio = audioSynth) {
  if (!state || !state.isShieldFanOpen) {
    return { success: false, reason: 'SHIELD_NOT_OPEN' };
  }

  if (audio && typeof audio.playCuticleFanShieldSnap === 'function') {
    audio.playCuticleFanShieldSnap();
  }

  const struck = [];
  const radius = FERAL_COMBAT_CONSTANTS.FAN_SPIN_RADIUS;

  for (const target of targets) {
    if (!target) continue;
    const dx = (target.x ?? 0) - origin.x;
    const dz = (target.z ?? 0) - origin.z;
    const dist = Math.hypot(dx, dz);

    if (dist <= radius) {
      const damage = FERAL_COMBAT_CONSTANTS.FAN_SPIN_SLASH_DAMAGE;
      if (typeof target.takeDamage === 'function') {
        target.takeDamage(damage);
      } else if (typeof target.health === 'number') {
        target.health = Math.max(0, target.health - damage);
      }

      state.slashedEnemiesCount++;
      struck.push({ id: target.id || 'target_enemy', damage });
    }
  }

  return {
    success: true,
    enemiesStruck: struck,
  };
}

export function executeTelescopicAxeStrike(state, target, audio = audioSynth) {
  if (!state || !target) return { success: false };

  state.isAxeExtended = true;

  if (audio && typeof audio.playTelescopicAxeExtendClink === 'function') {
    audio.playTelescopicAxeExtendClink();
  }

  const damage = FERAL_COMBAT_CONSTANTS.AXE_OVERHEAD_DAMAGE;
  if (typeof target.takeDamage === 'function') {
    target.takeDamage(damage);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - damage);
  }

  target.isGuardBroken = true;

  return {
    success: true,
    damageDealt: damage,
    guardBroken: true,
  };
}
