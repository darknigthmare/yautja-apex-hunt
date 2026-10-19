// Système de Pistolets Plasma Jumeaux en Surcharge Synchronisée (AVP:R 2007 — Lore 1:1)
// Référence canonique : Aliens vs. Predator: Requiem (2007) — Wolf maniant ses deux canons plasma d'épaule convertis en armes de poing jumelées pour des salves en surcharge combinée.

import { audioSynth } from '../AudioSynthesizer.js';

export const DUAL_PISTOL_CONSTANTS = {
  CHARGE_DURATION_SEC: 1.2,           // Temps de montée en charge combinée des deux bobines
  OVERCHARGE_PLASMA_DAMAGE: 240.0,    // Dégâts du projectile jumelé surpuissant
  SPLASH_DAMAGE_RADIUS_METERS: 4.0,   // Rayon d'impact de déflagration de plasma
  ENERGY_DRAIN: 35.0,                 // Coût en énergie de gantelet
};

export function createDualPlasmaPistolState() {
  return {
    isDualWielded: true,
    isCharging: false,
    chargeProgress: 0.0,
    isFullyCharged: false,
    totalOverchargeShotsFired: 0,
  };
}

export function startDualPistolCharge(state, audio = audioSynth) {
  if (!state || state.isCharging) return false;

  state.isCharging = true;
  state.chargeProgress = 0.0;
  state.isFullyCharged = false;

  if (audio && typeof audio.playDualPlasmaPistolChargeHum === 'function') {
    audio.playDualPlasmaPistolChargeHum();
  }

  return true;
}

export function updateDualPistolCharge(state, delta = 0.1) {
  if (!state || !state.isCharging) return;

  state.chargeProgress += delta;
  if (state.chargeProgress >= DUAL_PISTOL_CONSTANTS.CHARGE_DURATION_SEC) {
    state.isFullyCharged = true;
  }
}

export function fireSynchronizedPlasmaBlast(state, target, nearbyVictims = [], audio = audioSynth) {
  if (!state || !state.isFullyCharged || !target) {
    return { success: false, reason: 'NOT_CHARGED_OR_NO_TARGET' };
  }

  const damage = DUAL_PISTOL_CONSTANTS.OVERCHARGE_PLASMA_DAMAGE;
  if (typeof target.takeDamage === 'function') {
    target.takeDamage(damage);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - damage);
  }

  target.isObliteratedByPlasma = true;
  state.totalOverchargeShotsFired++;

  // Dégâts de souffle
  const splashRadius = DUAL_PISTOL_CONSTANTS.SPLASH_DAMAGE_RADIUS_METERS;
  const splashed = [];

  for (const victim of nearbyVictims) {
    if (!victim || victim === target) continue;
    const dx = (victim.x || 0) - (target.x || 0);
    const dz = (victim.z || 0) - (target.z || 0);
    if (Math.hypot(dx, dz) <= splashRadius) {
      const splashDmg = damage * 0.5;
      if (typeof victim.takeDamage === 'function') {
        victim.takeDamage(splashDmg);
      } else if (typeof victim.health === 'number') {
        victim.health = Math.max(0, victim.health - splashDmg);
      }
      splashed.push({ id: victim.id || 'splash_victim', damage: splashDmg });
    }
  }

  // Réinitialisation de la charge
  state.isCharging = false;
  state.chargeProgress = 0.0;
  state.isFullyCharged = false;

  return {
    success: true,
    directDamage: damage,
    splashedTargets: splashed,
  };
}
