// Conversion du Canon à Plasma en arme de poing portative (Lore 1:1)
// Références canoniques : Predator 2 (1990) - City Hunter maniant son canon détaché ; AVP:R (2007) - Pistolet plasma de Wolf

import { audioSynth } from '../AudioSynthesizer.js';

export const HANDHELD_MODES = {
  SHOULDER_MOUNTED: 'SHOULDER_MOUNTED',
  HANDHELD_PISTOL: 'HANDHELD_PISTOL',
};

export const HANDHELD_CONSTANTS = {
  POINT_BLANK_DAMAGE: 130.0,
  POINT_BLANK_RANGE: 3.2,
  ENERGY_COST: 16.0,
  AIM_SPEED_BONUS: 1.4, // +40% de réactivité de visée manuelle
};

export function createHandheldPlasmacasterState() {
  return {
    mode: HANDHELD_MODES.SHOULDER_MOUNTED,
    isConverted: false,
    pointBlankCooldown: 0,
    totalShotsFired: 0,
  };
}

export function convertPlasmacasterToHandheld(state, hunter) {
  if (!state) return false;
  state.mode = HANDHELD_MODES.HANDHELD_PISTOL;
  state.isConverted = true;

  if (hunter) {
    hunter.aimAgilityMultiplier = HANDHELD_CONSTANTS.AIM_SPEED_BONUS;
    hunter.canShootWhileSprinting = true;
  }
  return true;
}

export function fireHandheldPlasma(state, availableEnergy, targetPos, audio = audioSynth) {
  if (!state || state.mode !== HANDHELD_MODES.HANDHELD_PISTOL) return null;
  if ((availableEnergy || 0) < HANDHELD_CONSTANTS.ENERGY_COST) return null;

  state.totalShotsFired += 1;

  if (audio && typeof audio.playTwinPlasmaFire === 'function') {
    audio.playTwinPlasmaFire();
  }

  return {
    damage: 85.0,
    energySpent: HANDHELD_CONSTANTS.ENERGY_COST,
    target: targetPos,
  };
}

export function firePointBlankPlasma(state, availableEnergy, targetEntity, audio = audioSynth) {
  if (!state || state.mode !== HANDHELD_MODES.HANDHELD_PISTOL || state.pointBlankCooldown > 0) return false;
  if ((availableEnergy || 0) < HANDHELD_CONSTANTS.ENERGY_COST) return false;

  state.pointBlankCooldown = 1.4;

  if (targetEntity) {
    if (typeof targetEntity.applyDamage === 'function') {
      targetEntity.applyDamage(HANDHELD_CONSTANTS.POINT_BLANK_DAMAGE, 'point_blank_plasma_blast');
    } else if (typeof targetEntity.health === 'number') {
      targetEntity.health = Math.max(0, targetEntity.health - HANDHELD_CONSTANTS.POINT_BLANK_DAMAGE);
    }
    targetEntity.isKnockedBack = true;
  }

  if (audio && typeof audio.playPlasmaOverchargeBlast === 'function') {
    audio.playPlasmaOverchargeBlast();
  }
  return true;
}

export function updateHandheldPlasmacaster(state, delta) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  if (state.pointBlankCooldown > 0) {
    state.pointBlankCooldown = Math.max(0, state.pointBlankCooldown - dt);
  }
}
