// Directeur d'Armes Modulaires du Feral : Combistick Scindable & Bouclier Éventail (Prey 2022 — Lore 1:1)
// Référence canonique : Prey (2022) — Le Feral scinde sa lance en doubles lames et déploie son bouclier en éventail d'os pour trancher l'ours

import { audioSynth } from '../AudioSynthesizer.js';

export const FERAL_WEAPONS_CONSTANTS = {
  DUAL_WIELD_SPEED_BUFF: 1.45,         // +45% de cadence de frappe en mode scindé
  DUAL_WIELD_DAMAGE_PER_HIT: 55.0,     // Dégâts par dague/bâton
  FAN_SHIELD_BLOCK_RATIO: 0.85,        // 85% d'absorption des chocs et balles de mousquet
  FAN_SHIELD_BLOCK_ARC: 2.2,           // Cône défensif frontal de ~126 degrés
  FAN_SHIELD_EDGE_DAMAGE: 65.0,        // Dégâts tranchants au contact du tranchant de l'éventail
  MAX_SHIELD_DURABILITY: 220.0,
};

export function createFeralModularWeaponState() {
  return {
    isCombistickSplit: false,
    isFanShieldDeployed: false,
    shieldDurability: FERAL_WEAPONS_CONSTANTS.MAX_SHIELD_DURABILITY,
    attacksLanded: 0,
    deflectionsCount: 0,
  };
}

export function toggleCombistickSplit(state, audio = audioSynth) {
  if (!state) return false;

  state.isCombistickSplit = !state.isCombistickSplit;

  if (audio && typeof audio.playCombistickSplitTwist === 'function') {
    audio.playCombistickSplitTwist();
  }

  return state.isCombistickSplit;
}

export function deployFanShield(state, audio = audioSynth) {
  if (!state || state.shieldDurability <= 0) return false;

  state.isFanShieldDeployed = true;

  if (audio && typeof audio.playFanShieldDeploySnap === 'function') {
    audio.playFanShieldDeploySnap();
  }

  return true;
}

export function retractFanShield(state) {
  if (!state) return;
  state.isFanShieldDeployed = false;
}

export function deflectWithFanShield(state, incomingAttack, bearerFacingAngle = 0) {
  if (!state || !state.isFanShieldDeployed || state.shieldDurability <= 0) {
    return { blocked: false, damagePassed: incomingAttack?.damage || 0 };
  }

  const attackAngle = incomingAttack.angle ?? 0;
  let angleDiff = Math.abs(bearerFacingAngle - attackAngle);
  while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

  if (angleDiff > (FERAL_WEAPONS_CONSTANTS.FAN_SHIELD_BLOCK_ARC / 2)) {
    return { blocked: false, damagePassed: incomingAttack.damage || 0 };
  }

  const rawDmg = Number(incomingAttack.damage) || 0;
  const mitigatedDmg = rawDmg * (1.0 - FERAL_WEAPONS_CONSTANTS.FAN_SHIELD_BLOCK_RATIO);
  const absorbedDmg = rawDmg * FERAL_WEAPONS_CONSTANTS.FAN_SHIELD_BLOCK_RATIO;

  state.shieldDurability = Math.max(0, state.shieldDurability - absorbedDmg * 0.4);
  state.deflectionsCount++;

  let counterSliceDamage = 0;
  if (incomingAttack.isMelee) {
    // Le tranchant osseux de l'éventail taillade l'attaquant au corps-à-corps
    counterSliceDamage = FERAL_WEAPONS_CONSTANTS.FAN_SHIELD_EDGE_DAMAGE;
  }

  if (state.shieldDurability <= 0) {
    state.isFanShieldDeployed = false;
  }

  return {
    blocked: true,
    damagePassed: mitigatedDmg,
    counterDamageDealt: counterSliceDamage,
    remainingDurability: state.shieldDurability,
  };
}
