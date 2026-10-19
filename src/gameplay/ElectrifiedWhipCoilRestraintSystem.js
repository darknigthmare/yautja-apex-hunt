// Système d'Entrave et Décharge Électrique par Fouet Caudal (AVP:R 2007 / Comics — Lore 1:1)
// Référence canonique : Aliens vs. Predator: Requiem (2007) & Comics — Wolf utilisant le fouet barbelé pour enrouler et électrocuter à haute tension les guerriers xénomorphes.

import { audioSynth } from '../AudioSynthesizer.js';

export const WHIP_SHOCK_CONSTANTS = {
  COIL_RANGE_METERS: 7.5,              // Portée de jet du fouet pour encerclement
  ELECTROSTATIC_DAMAGE: 110.0,         // Dégâts de la décharge à haute tension
  PARALYSIS_DURATION_SEC: 2.0,         // Durée d'inhibition neuromusculaire
};

export function createElectrifiedWhipState() {
  return {
    isCoilActive: false,
    entangledTargetId: null,
    cooldownRemaining: 0.0,
  };
}

export function entangleWithWhip(state, target) {
  if (!state || !target) return false;

  state.isCoilActive = true;
  state.entangledTargetId = target.id || 'target_entangled';
  target.isEntangled = true;
  target.canMove = false;

  return true;
}

export function dischargeWhipVoltage(state, target, audio = audioSynth) {
  if (!state || !state.isCoilActive || !target) {
    return { success: false, reason: 'NOT_ENTANGLED' };
  }

  if (audio && typeof audio.playElectrifiedWhipArcZap === 'function') {
    audio.playElectrifiedWhipArcZap();
  }

  const damage = WHIP_SHOCK_CONSTANTS.ELECTROSTATIC_DAMAGE;
  if (typeof target.takeDamage === 'function') {
    target.takeDamage(damage);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - damage);
  }

  target.isParalyzed = true;
  target.paralysisTimer = WHIP_SHOCK_CONSTANTS.PARALYSIS_DURATION_SEC;

  // Libération du fouet après la décharge
  state.isCoilActive = false;
  state.entangledTargetId = null;
  target.isEntangled = false;
  target.canMove = true;

  return {
    success: true,
    damageDealt: damage,
    targetParalyzed: true,
  };
}

export function updateWhipParalysis(target, delta = 0.1) {
  if (!target || !target.isParalyzed) return;

  target.paralysisTimer = Math.max(0, (target.paralysisTimer || 0) - delta);
  if (target.paralysisTimer === 0) {
    target.isParalyzed = false;
  }
}
