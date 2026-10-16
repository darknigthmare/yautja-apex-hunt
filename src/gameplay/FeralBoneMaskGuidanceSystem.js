// Système de Guidage du Masque d'Os Feral et Découplage Balistique (Lore 1:1)
// Référence canonique : Prey (2022) - Masque crânien taillé, collimateur laser découplable et vulnérabilité d'auto-guidage

import { audioSynth } from '../AudioSynthesizer.js';

export const BONE_MASK_CONSTANTS = {
  LASER_MAX_RANGE: 70.0,
  HOMING_PRECISION: 0.98,
  DETACH_KNOCKBACK_IMPULSE: 6.5,
};

export function createFeralBoneMaskState() {
  return {
    isAttachedToHunter: true,
    maskPosition: { x: 0, y: 1.85, z: 0 },
    maskForward: { x: 0, y: 0, z: -1 },
    laserTargetPoint: null,
    isLaserActive: true,
    isDecoupled: false,
    decoupledTimer: 0,
    timesDetached: 0,
    selfTargetingHazardActive: false,
  };
}

export function detachBoneMask(state, dropPosition, aimForward, audio = audioSynth) {
  if (!state || !state.isAttachedToHunter) return false;

  state.isAttachedToHunter = false;
  state.isDecoupled = true;
  state.maskPosition = { x: dropPosition.x, y: dropPosition.y, z: dropPosition.z };

  const len = Math.sqrt(aimForward.x * aimForward.x + aimForward.y * aimForward.y + aimForward.z * aimForward.z) || 1;
  state.maskForward = { x: aimForward.x / len, y: aimForward.y / len, z: aimForward.z / len };

  state.timesDetached += 1;
  state.decoupledTimer = 0;

  // Calcul du point d'impact du laser depuis la position du masque au sol
  updateDetachedLaserTarget(state);

  if (audio && typeof audio.playMaskDetachedWhistle === 'function') {
    audio.playMaskDetachedWhistle();
  }

  return true;
}

export function reattachBoneMask(state, audio = audioSynth) {
  if (!state || state.isAttachedToHunter) return false;

  state.isAttachedToHunter = true;
  state.isDecoupled = false;
  state.selfTargetingHazardActive = false;

  if (audio && typeof audio.playBoneMaskClickChirp === 'function') {
    audio.playBoneMaskClickChirp();
  }

  return true;
}

export function reorientDetachedMask(state, newPosition, newForward) {
  if (!state || state.isAttachedToHunter) return;
  if (newPosition) {
    state.maskPosition = { x: newPosition.x, y: newPosition.y, z: newPosition.z };
  }
  if (newForward) {
    const len = Math.sqrt(newForward.x * newForward.x + newForward.y * newForward.y + newForward.z * newForward.z) || 1;
    state.maskForward = { x: newForward.x / len, y: newForward.y / len, z: newForward.z / len };
  }
  updateDetachedLaserTarget(state);
}

function updateDetachedLaserTarget(state) {
  state.laserTargetPoint = {
    x: state.maskPosition.x + state.maskForward.x * BONE_MASK_CONSTANTS.LASER_MAX_RANGE,
    y: state.maskPosition.y + state.maskForward.y * BONE_MASK_CONSTANTS.LASER_MAX_RANGE,
    z: state.maskPosition.z + state.maskForward.z * BONE_MASK_CONSTANTS.LASER_MAX_RANGE,
  };
}

export function computeHomingTargetPoint(state, hunterPos, hunterAimDir) {
  if (!state) return null;

  if (state.isAttachedToHunter) {
    state.maskPosition = { x: hunterPos.x, y: hunterPos.y + 0.35, z: hunterPos.z };
    const len = Math.sqrt(hunterAimDir.x * hunterAimDir.x + hunterAimDir.y * hunterAimDir.y + hunterAimDir.z * hunterAimDir.z) || 1;
    state.maskForward = { x: hunterAimDir.x / len, y: hunterAimDir.y / len, z: hunterAimDir.z / len };

    return {
      x: hunterPos.x + state.maskForward.x * BONE_MASK_CONSTANTS.LASER_MAX_RANGE,
      y: hunterPos.y + state.maskForward.y * BONE_MASK_CONSTANTS.LASER_MAX_RANGE,
      z: hunterPos.z + state.maskForward.z * BONE_MASK_CONSTANTS.LASER_MAX_RANGE,
      isDecoupled: false,
    };
  }

  // Si le masque est détaché, la cible de guidage est celle visée par le masque au sol !
  // (Mécanique canonique de Prey : Naru oriente le masque vers la tête du Feral)
  const dx = hunterPos.x - state.laserTargetPoint.x;
  const dy = hunterPos.y - state.laserTargetPoint.y;
  const dz = hunterPos.z - state.laserTargetPoint.z;
  const distToHunter = Math.sqrt(dx * dx + dy * dy + dz * dz);

  state.selfTargetingHazardActive = distToHunter <= 3.0;

  return {
    x: state.laserTargetPoint.x,
    y: state.laserTargetPoint.y,
    z: state.laserTargetPoint.z,
    isDecoupled: true,
    isAimedAtHunter: state.selfTargetingHazardActive,
  };
}
