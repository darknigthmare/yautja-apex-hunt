// Système de Harpon à Treuil Motorisé et Éviscération au Gantelet (Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) — Le City Hunter empalant des proies urbaines par harpon à câble puis les rembobinant à haute vélocité vers ses lames de poignet.

import { audioSynth } from '../AudioSynthesizer.js';

export const WINCH_CONSTANTS = {
  HARPOON_STRIKE_DAMAGE: 70.0,         // Dégâts initiaux de pénétration du harpon
  REEL_VELOCITY_MPS: 16.0,             // Vélocité de rembobinage du câble
  WRISTBLADE_FINISHER_DAMAGE: 180.0,   // Dégâts de l'exécution finale au corps-à-corps
};

export function createMotorizedWinchState() {
  return {
    isHarpoonTethered: false,
    tetheredVictim: null,
    isReeling: false,
  };
}

export function fireTetheredHarpoon(state, target) {
  if (!state || state.isHarpoonTethered || !target) return false;

  state.isHarpoonTethered = true;
  state.tetheredVictim = target;
  target.isHarpoonAnchored = true;

  const damage = WINCH_CONSTANTS.HARPOON_STRIKE_DAMAGE;
  if (typeof target.takeDamage === 'function') {
    target.takeDamage(damage);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - damage);
  }

  return true;
}

export function reelInTetheredVictim(state, hunter, target, audio = audioSynth) {
  if (!state || !state.isHarpoonTethered || !hunter || !target) {
    return { success: false, reason: 'NOT_TETHERED' };
  }

  state.isReeling = true;

  if (audio && typeof audio.playMotorizedWinchRewindWhine === 'function') {
    audio.playMotorizedWinchRewindWhine();
  }
  if (audio && typeof audio.playHarpoonPullDragScrape === 'function') {
    audio.playHarpoonPullDragScrape();
  }

  // Traction directe jusqu'à la position du chasseur
  target.x = hunter.x || 0;
  target.z = (hunter.z || 0) + 1.2;
  target.isReeledClose = true;

  return {
    success: true,
    victimPulledClose: true,
  };
}

export function executeWristbladeFinisher(state, target) {
  if (!state || !state.isHarpoonTethered || !target) return { executed: false };

  const damage = WINCH_CONSTANTS.WRISTBLADE_FINISHER_DAMAGE;
  if (typeof target.takeDamage === 'function') {
    target.takeDamage(damage);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - damage);
  }

  target.isExecuted = true;
  state.isHarpoonTethered = false;
  state.tetheredVictim = null;
  state.isReeling = false;

  return {
    executed: true,
    damageDealt: damage,
  };
}
