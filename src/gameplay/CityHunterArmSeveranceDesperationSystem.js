// Système d'Amputation de Bras et Tir de Désespoir au Canon Plasma Détaché (Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) — Harrigan tranchant le bras gauche du City Hunter avec le Smart Disc dans l'abattoir, privant le chasseur de son gantelet et forçant une posture de tir désespérée à une main.

import { audioSynth } from '../AudioSynthesizer.js';

export const SEVERANCE_CONSTANTS = {
  HEMORRHAGE_DPS: 6.0,                  // Dégâts de saignement continu par perte de membre
  DESPERATION_PLASMA_DAMAGE: 175.0,     // Dégâts du tir de plasma d'urgence à bout portant
  ONE_HANDED_ACCURACY_PENALTY: 0.25,    // Malus de stabilité au tir sans appui
  CAUTERIZATION_STABILIZE_HEAL: 20.0,   // Santé stabilisée lors du scellement thermique du moignon
};

export function createSeveredArmState() {
  return {
    isArmSevered: false,
    hasGauntletControl: true,
    hasActiveBleed: false,
    isCauterized: false,
    desperationShotsRemaining: 2,
    bloodTrailPoints: [],
  };
}

export function triggerArmAmputation(state, hunter, audio = audioSynth) {
  if (!state || state.isArmSevered) return false;

  state.isArmSevered = true;
  state.hasGauntletControl = false; // Perte irrémédiable du panneau de commande d'autodestruction
  state.hasActiveBleed = true;
  state.isCauterized = false;

  if (hunter) {
    hunter.leftArmMissing = true;
    hunter.canUseGauntlet = false;
    hunter.isBleedingBioluminescent = true;
  }

  if (audio && typeof audio.playArmSeverSquelchCrunch === 'function') {
    audio.playArmSeverSquelchCrunch();
  }

  return true;
}

export function fireDesperationPlasma(state, target, audio = audioSynth) {
  if (!state || !state.isArmSevered || state.desperationShotsRemaining <= 0 || !target) {
    return { success: false, reason: 'CANNOT_FIRE' };
  }

  state.desperationShotsRemaining--;

  if (audio && typeof audio.playDesperationPlasmaClick === 'function') {
    audio.playDesperationPlasmaClick();
  }

  const damage = SEVERANCE_CONSTANTS.DESPERATION_PLASMA_DAMAGE;
  if (typeof target.takeDamage === 'function') {
    target.takeDamage(damage);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - damage);
  }

  return {
    success: true,
    damageDealt: damage,
    shotsRemaining: state.desperationShotsRemaining,
  };
}

export function cauterizeSeveredStump(state, hunter, audio = audioSynth) {
  if (!state || !state.isArmSevered || state.isCauterized) return false;

  state.hasActiveBleed = false;
  state.isCauterized = true;

  if (hunter) {
    hunter.isBleedingBioluminescent = false;
    if (typeof hunter.health === 'number') {
      hunter.health = Math.min(100, hunter.health + SEVERANCE_CONSTANTS.CAUTERIZATION_STABILIZE_HEAL);
    }
  }

  if (audio && typeof audio.playYautjaSurgeryPainRoar === 'function') {
    audio.playYautjaSurgeryPainRoar();
  }

  return true;
}

export function updateSeveranceBleed(state, delta = 0.1, hunter = null) {
  if (!state || !state.hasActiveBleed || !hunter) return;

  const bleedDmg = SEVERANCE_CONSTANTS.HEMORRHAGE_DPS * delta;
  if (typeof hunter.takeDamage === 'function') {
    hunter.takeDamage(bleedDmg);
  } else if (typeof hunter.health === 'number') {
    hunter.health = Math.max(1, hunter.health - bleedDmg);
  }
}
