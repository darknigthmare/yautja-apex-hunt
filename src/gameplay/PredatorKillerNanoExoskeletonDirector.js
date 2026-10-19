// Directeur d'Armure Exosquelette Nano-Technologique "Predator Killer" (The Predator 2018 — Lore 1:1)
// Référence canonique : The Predator (2018) — La capsule de gantelet déployant l'exosquelette intégral à doubles canons plasma synchronisés

import { audioSynth } from '../AudioSynthesizer.js';

export const PREDATOR_KILLER_CONSTANTS = {
  SHIELD_MAX_CAPACITY: 200.0,          // Capacité d'absorption du blindage nanotechnologique
  TWIN_PLASMA_DAMAGE: 160.0,           // Dégâts cumulés de la salve de canons d'épaules jumelés
  TWIN_PLASMA_COOLDOWN: 2.5,           // Temps de rechargement des canons synchronisés (s)
};

export function createPredatorKillerState() {
  return {
    isSuitActive: false,
    shieldHealth: PREDATOR_KILLER_CONSTANTS.SHIELD_MAX_CAPACITY,
    cannonCooldownTimer: 0.0,
    twinVolleysFiredCount: 0,
  };
}

export function deployPredatorKillerSuit(state, bearerEntity, audio = audioSynth) {
  if (!state || state.isSuitActive) return false;

  state.isSuitActive = true;
  state.shieldHealth = PREDATOR_KILLER_CONSTANTS.SHIELD_MAX_CAPACITY;

  if (bearerEntity) {
    bearerEntity.hasPredatorKillerSuit = true;
    bearerEntity.isCyberArmorProtected = true;
  }

  if (audio && typeof audio.playPredatorKillerNanoArmorForm === 'function') {
    audio.playPredatorKillerNanoArmorForm();
  }

  return true;
}

export function fireTwinPlasmaVolley(state, shooterPos, targetEntity, audio = audioSynth) {
  if (!state || !state.isSuitActive || state.cannonCooldownTimer > 0 || !targetEntity) {
    return { fired: false };
  }

  state.cannonCooldownTimer = PREDATOR_KILLER_CONSTANTS.TWIN_PLASMA_COOLDOWN;
  state.twinVolleysFiredCount++;

  if (audio && typeof audio.playTwinPlasmaSyncVolley === 'function') {
    audio.playTwinPlasmaSyncVolley();
  }

  // Dégâts synchronisés des deux canons plasma d'épaules
  if (typeof targetEntity.takeDamage === 'function') {
    targetEntity.takeDamage(PREDATOR_KILLER_CONSTANTS.TWIN_PLASMA_DAMAGE, 'twin_plasma_cannon');
  } else if (typeof targetEntity.health === 'number') {
    targetEntity.health = Math.max(0, targetEntity.health - PREDATOR_KILLER_CONSTANTS.TWIN_PLASMA_DAMAGE);
  }

  targetEntity.isKnockedBack = true;
  targetEntity.isStaggered = true;
  targetEntity.staggerTimer = 1.6;

  return { fired: true, damageDealt: PREDATOR_KILLER_CONSTANTS.TWIN_PLASMA_DAMAGE };
}

export function updatePredatorKillerSuit(state, delta) {
  if (!state || !state.isSuitActive) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.cannonCooldownTimer > 0) {
    state.cannonCooldownTimer = Math.max(0, state.cannonCooldownTimer - dt);
  }
}
