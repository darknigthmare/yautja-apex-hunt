// Bouclier d'Énergie Holographique de Gantelet (The Predator 2018 — Lore 1:1)
// Référence canonique : The Predator (2018) — Le Fugitive Predator déploie un champ de force hexagonal depuis son gantelet pour dévier les tirs balistiques

import { audioSynth } from '../AudioSynthesizer.js';

export const HOLO_SHIELD_CONSTANTS = {
  MAX_CHARGE: 150.0,
  DRAIN_PER_SEC: 3.5,                  // Consommation continue du champ de confinement
  BALLISTIC_DEFLECT_RATIO: 0.90,       // 90% des dégâts balistiques déviés
  OVERHEAT_DURATION: 3.5,              // Temps de refroidissement forcé après épuisement de la batterie
  RECHARGE_RATE: 10.0,                 // Régénération de la charge par seconde hors déploiement
  BASH_ENERGY_COST: 25.0,              // Coût énergétique d'un coup de boutoir cinétique
  BASH_DAMAGE: 48.0,                   // Dégâts cinétiques du coup de bouclier
};

export function createFugitiveEnergyShieldState() {
  return {
    isDeployed: false,
    charge: HOLO_SHIELD_CONSTANTS.MAX_CHARGE,
    isOverheated: false,
    overheatTimer: 0.0,
    deflectedCount: 0,
  };
}

export function deployEnergyShield(state, audio = audioSynth) {
  if (!state || state.isOverheated || state.charge < 12.0) {
    return false;
  }

  state.isDeployed = true;
  if (audio && typeof audio.playHoloShieldEnergyHum === 'function') {
    audio.playHoloShieldEnergyHum();
  }
  return true;
}

export function retractEnergyShield(state) {
  if (!state) return;
  state.isDeployed = false;
}

export function deflectIncomingProjectile(state, projectileDamage = 30.0, audio = audioSynth) {
  if (!state || !state.isDeployed) {
    return { deflected: false, damagePassed: projectileDamage };
  }

  const damage = Number(projectileDamage) || 0;
  const absorbedDamage = damage * HOLO_SHIELD_CONSTANTS.BALLISTIC_DEFLECT_RATIO;
  const passedDamage = damage * (1.0 - HOLO_SHIELD_CONSTANTS.BALLISTIC_DEFLECT_RATIO);

  state.charge = Math.max(0, state.charge - absorbedDamage * 0.65);
  state.deflectedCount++;

  if (audio && typeof audio.playHoloShieldDeflectZap === 'function') {
    audio.playHoloShieldDeflectZap();
  }

  // Surcharge et rupture de la barrière si la batterie tombe à zéro
  if (state.charge <= 0) {
    state.isDeployed = false;
    state.isOverheated = true;
    state.overheatTimer = HOLO_SHIELD_CONSTANTS.OVERHEAT_DURATION;
  }

  return {
    deflected: true,
    damagePassed: passedDamage,
    shieldDepleted: state.charge <= 0,
  };
}

export function performShieldBash(state, targetEntity, audio = audioSynth) {
  if (!state || !state.isDeployed || state.charge < HOLO_SHIELD_CONSTANTS.BASH_ENERGY_COST) {
    return { success: false };
  }

  state.charge -= HOLO_SHIELD_CONSTANTS.BASH_ENERGY_COST;

  if (targetEntity) {
    if (typeof targetEntity.takeDamage === 'function') {
      targetEntity.takeDamage(HOLO_SHIELD_CONSTANTS.BASH_DAMAGE, 'shield_bash');
    } else if (typeof targetEntity.health === 'number') {
      targetEntity.health = Math.max(0, targetEntity.health - HOLO_SHIELD_CONSTANTS.BASH_DAMAGE);
    }
    targetEntity.isStaggered = true;
    targetEntity.staggerTimer = 1.6;
  }

  if (audio && typeof audio.playHoloShieldDeflectZap === 'function') {
    audio.playHoloShieldDeflectZap();
  }

  return { success: true, damageDealt: HOLO_SHIELD_CONSTANTS.BASH_DAMAGE };
}

export function updateFugitiveEnergyShield(state, delta) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.isOverheated) {
    state.overheatTimer -= dt;
    if (state.overheatTimer <= 0) {
      state.isOverheated = false;
    }
  } else if (state.isDeployed) {
    state.charge = Math.max(0, state.charge - HOLO_SHIELD_CONSTANTS.DRAIN_PER_SEC * dt);
    if (state.charge <= 0) {
      state.isDeployed = false;
      state.isOverheated = true;
      state.overheatTimer = HOLO_SHIELD_CONSTANTS.OVERHEAT_DURATION;
    }
  } else if (!state.isDeployed && state.charge < HOLO_SHIELD_CONSTANTS.MAX_CHARGE) {
    state.charge = Math.min(HOLO_SHIELD_CONSTANTS.MAX_CHARGE, state.charge + HOLO_SHIELD_CONSTANTS.RECHARGE_RATE * dt);
  }
}
