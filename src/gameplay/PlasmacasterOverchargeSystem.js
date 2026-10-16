// Système de surcadencement et tir lourd du Canon à Plasma (Lore 1:1)
// Références canoniques : Predator (1987), AVP (2004) - Tir perçant de blindage et cratère de fusion

import { audioSynth } from '../AudioSynthesizer.js';

export const PLASMA_CHARGE_STAGES = {
  IDLE: 'IDLE',
  CHARGING: 'CHARGING',
  OPTIMAL: 'OPTIMAL',
  OVERHEAT_VENTING: 'OVERHEAT_VENTING',
};

export const CHARGE_CONSTANTS = {
  MIN_CHARGE_TIME: 0.4,       // Seuil minimal pour tir chargé
  OPTIMAL_CHARGE_TIME: 1.8,   // Charge maximale idéale
  OVERHEAT_THRESHOLD: 3.2,    // Surchauffe dangereuse du condensateur
  BASE_ENERGY_COST: 15.0,
  MAX_ENERGY_COST: 45.0,
  BASE_DAMAGE: 80.0,
  MAX_DAMAGE_MULTIPLIER: 3.5, // 280 dégâts au pic
  MAX_BLAST_RADIUS: 5.2,
};

export function createPlasmacasterChargeState() {
  return {
    stage: PLASMA_CHARGE_STAGES.IDLE,
    chargeTimer: 0,
    chargeRatio: 0, // 0.0 à 1.0
    energyDrained: 0,
    isOverheated: false,
  };
}

export function startChargingPlasma(state, availableEnergy, audio = audioSynth) {
  if (!state || state.stage !== PLASMA_CHARGE_STAGES.IDLE) return false;
  if ((availableEnergy || 0) < CHARGE_CONSTANTS.BASE_ENERGY_COST) return false;

  state.stage = PLASMA_CHARGE_STAGES.CHARGING;
  state.chargeTimer = 0;
  state.chargeRatio = 0;
  state.energyDrained = CHARGE_CONSTANTS.BASE_ENERGY_COST;
  state.isOverheated = false;

  if (audio && typeof audio.playPlasmaChargeUp === 'function') {
    audio.playPlasmaChargeUp();
  }
  return true;
}

export function updateChargingPlasma(state, delta, playerEnergy = null) {
  if (!state || state.stage === PLASMA_CHARGE_STAGES.IDLE) return state?.stage;
  const dt = Math.max(0, Number(delta) || 0);
  state.chargeTimer += dt;

  if (state.chargeTimer < CHARGE_CONSTANTS.OPTIMAL_CHARGE_TIME) {
    state.chargeRatio = Math.min(1.0, state.chargeTimer / CHARGE_CONSTANTS.OPTIMAL_CHARGE_TIME);
    state.stage = PLASMA_CHARGE_STAGES.CHARGING;
  } else if (state.chargeTimer <= CHARGE_CONSTANTS.OVERHEAT_THRESHOLD) {
    state.chargeRatio = 1.0;
    state.stage = PLASMA_CHARGE_STAGES.OPTIMAL;
  } else {
    // Dépassement critique du seuil de sécurité -> purge thermique d'urgence
    state.stage = PLASMA_CHARGE_STAGES.OVERHEAT_VENTING;
    state.isOverheated = true;
    state.chargeRatio = 0;
  }

  return state.stage;
}

export function releasePlasmaShot(state, audio = audioSynth) {
  if (!state || state.stage === PLASMA_CHARGE_STAGES.IDLE) return null;

  if (state.stage === PLASMA_CHARGE_STAGES.OVERHEAT_VENTING) {
    state.stage = PLASMA_CHARGE_STAGES.IDLE;
    state.chargeTimer = 0;
    state.chargeRatio = 0;
    return { isMisfire: true, damage: 0, blastRadius: 0, selfDamage: 12.0 };
  }

  const isOvercharged = state.chargeRatio >= 0.75;
  const finalDamage = CHARGE_CONSTANTS.BASE_DAMAGE * (1.0 + state.chargeRatio * (CHARGE_CONSTANTS.MAX_DAMAGE_MULTIPLIER - 1.0));
  const blastRadius = 1.2 + state.chargeRatio * (CHARGE_CONSTANTS.MAX_BLAST_RADIUS - 1.2);
  const armorPenetration = state.chargeRatio >= 0.9;

  const shotData = {
    isOvercharged,
    damage: finalDamage,
    blastRadius,
    armorPenetration,
    createsMoltenSlag: isOvercharged,
  };

  state.stage = PLASMA_CHARGE_STAGES.IDLE;
  state.chargeTimer = 0;
  state.chargeRatio = 0;

  if (audio) {
    if (isOvercharged && typeof audio.playPlasmaOverchargeBlast === 'function') {
      audio.playPlasmaOverchargeBlast();
    }
  }

  return shotData;
}

export function cancelPlasmaCharge(state) {
  if (!state) return;
  state.stage = PLASMA_CHARGE_STAGES.IDLE;
  state.chargeTimer = 0;
  state.chargeRatio = 0;
}
