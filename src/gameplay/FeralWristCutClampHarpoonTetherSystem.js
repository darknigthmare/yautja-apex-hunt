// Pince-Câble Hydraulique Cut-Clamp de Poignet du Feral Predator (Prey 2022 — Lore 1:1)
// Référence canonique : Prey (2022) — Le dispositif à câble et mâchoire coupante du Feral Predator capable d'agripper un adversaire et de refermer ses lames hydrauliques pour sectionner net.

import { audioSynth } from '../AudioSynthesizer.js';

export const CUT_CLAMP_CONSTANTS = {
  TETHER_RANGE_M: 12.0,              // Portée du câble d'accroche
  CLAMP_SEVER_DAMAGE: 185,           // Dégâts de cisaillement hydraulique
};

export function createCutClampState() {
  return {
    isTethered: false,
    tetheredTarget: null,
    seversCount: 0,
  };
}

export function fireCutClampTether(state, target, distance = 6.0, audio = audioSynth) {
  if (!state || !target || distance > CUT_CLAMP_CONSTANTS.TETHER_RANGE_M) {
    return { tethered: false };
  }

  state.isTethered = true;
  state.tetheredTarget = target;
  target.isClampedByCable = true;
  target.canMove = false;

  if (audio && typeof audio.playFeralCutClampTetherFire === 'function') {
    audio.playFeralCutClampTetherFire();
  }

  return {
    tethered: true,
  };
}

export function triggerHydraulicClampSever(state, audio = audioSynth) {
  if (!state || !state.isTethered || !state.tetheredTarget) {
    return { severed: false, damageDealt: 0 };
  }

  const target = state.tetheredTarget;
  state.isTethered = false;
  state.tetheredTarget = null;
  state.seversCount++;

  if (audio && typeof audio.playHydraulicClampSeverSnap === 'function') {
    audio.playHydraulicClampSeverSnap();
  }

  target.isSeveredByCutClamp = true;
  if (typeof target.takeDamage === 'function') {
    target.takeDamage(CUT_CLAMP_CONSTANTS.CLAMP_SEVER_DAMAGE);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - CUT_CLAMP_CONSTANTS.CLAMP_SEVER_DAMAGE);
  }

  return {
    severed: true,
    damageDealt: CUT_CLAMP_CONSTANTS.CLAMP_SEVER_DAMAGE,
  };
}
