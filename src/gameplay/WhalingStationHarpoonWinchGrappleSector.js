// Harpon Grappin de Treuil Polaire & Traction de Proie (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Les canons-harpons et treuils à chaîne de la station baleinière de Bouvetøya utilisés dans les affrontements sur la glace.

import { audioSynth } from '../AudioSynthesizer.js';

export const WHALING_WINCH_CONSTANTS = {
  HARPOON_IMPALE_DAMAGE: 160,        // Dégâts de perforation du harpon baleinier
  MAX_CABLE_RANGE_M: 25.0,           // Longueur maximale du câble d'acier
  REEL_PULL_SPEED_MPS: 14.0,         // Vitesse de traction mécanique vers le treuil
};

export function createWhalingWinchSectorState() {
  return {
    winchPosition: { x: 0, z: 0 },
    isLoaded: true,
    hookedTarget: null,
  };
}

export function fireWhalingHarpoonAndReel(state, target, audio = audioSynth) {
  if (!state || !state.isLoaded || !target) {
    return { hooked: false };
  }

  const dist = Math.hypot((target.x || 0) - state.winchPosition.x, (target.z || 0) - state.winchPosition.z);
  if (dist > WHALING_WINCH_CONSTANTS.MAX_CABLE_RANGE_M) {
    return { hooked: false, reason: 'out_of_range' };
  }

  state.isLoaded = false;
  state.hookedTarget = target;

  if (audio) {
    if (typeof audio.playWhalingHarpoonWinchLaunch === 'function') {
      audio.playWhalingHarpoonWinchLaunch();
    }
    if (typeof audio.playWinchCableChainReelClank === 'function') {
      audio.playWinchCableChainReelClank();
    }
  }

  target.isHarpooned = true;
  target.x = state.winchPosition.x;
  target.z = state.winchPosition.z;

  if (typeof target.takeDamage === 'function') {
    target.takeDamage(WHALING_WINCH_CONSTANTS.HARPOON_IMPALE_DAMAGE);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - WHALING_WINCH_CONSTANTS.HARPOON_IMPALE_DAMAGE);
  }

  return {
    hooked: true,
    damageDealt: WHALING_WINCH_CONSTANTS.HARPOON_IMPALE_DAMAGE,
    pulledToWinch: true,
  };
}
