// Système d'embuscade aquatique, immersion sous-marine et jaillissement prédateur (Lore 1:1)
// Références canoniques : Predator (1987) - Émergence de la rivière ; Prey (2022) - Noyaute et combat dans les rapides

import { audioSynth } from '../AudioSynthesizer.js';

export const AQUATIC_CONSTANTS = {
  WATER_COOLED_TEMP: 12.5,       // Température de l'eau masquant la signature thermique
  DROWN_DPS: 35.0,               // Dégâts d'étouffement subaquatique
  BREACH_LEAP_VELOCITY: 22.0,    // Vitesse de projection hors de l'eau
  AMBUSH_DAMAGE_BONUS: 1.5,      // +50% de dégâts au premier coup en jaillissement
};

export function createAquaticAmbushState() {
  return {
    isSubmerged: false,
    submersionDepth: 0,
    grabbedPrey: null,
    isBreaching: false,
    breachProgress: 0,
  };
}

export function submergeInWater(state, depth = 2.2, audio = audioSynth) {
  if (!state) return false;
  state.isSubmerged = true;
  state.submersionDepth = depth;
  state.isBreaching = false;

  if (audio && typeof audio.playUnderwaterGurgle === 'function') {
    audio.playUnderwaterGurgle();
  }
  return true;
}

export function executeUnderwaterGrab(state, targetEntity, audio = audioSynth) {
  if (!state || !state.isSubmerged || !targetEntity) return false;

  state.grabbedPrey = targetEntity;
  targetEntity.isDraggedUnderwater = true;

  if (audio && typeof audio.playUnderwaterGurgle === 'function') {
    audio.playUnderwaterGurgle();
  }
  return true;
}

export function executeWaterBreachLeap(state, targetPos, audio = audioSynth) {
  if (!state || !state.isSubmerged) return false;

  state.isSubmerged = false;
  state.isBreaching = true;
  state.breachProgress = 0;
  state.submersionDepth = 0;

  if (state.grabbedPrey) {
    state.grabbedPrey.isDraggedUnderwater = false;
    state.grabbedPrey = null;
  }

  if (audio && typeof audio.playWaterEmergeSplash === 'function') {
    audio.playWaterEmergeSplash();
  }
  return true;
}

export function updateAquaticAmbush(state, delta) {
  if (!state) return;
  const dt = Math.max(0, Number(delta) || 0);

  // Dégâts de noyade sur la proie entraînée sous l'eau
  if (state.isSubmerged && state.grabbedPrey) {
    const drownDamage = AQUATIC_CONSTANTS.DROWN_DPS * dt;
    if (typeof state.grabbedPrey.applyDamage === 'function') {
      state.grabbedPrey.applyDamage(drownDamage, 'underwater_asphyxiation');
    } else if (typeof state.grabbedPrey.health === 'number') {
      state.grabbedPrey.health = Math.max(0, state.grabbedPrey.health - drownDamage);
    }
  }

  if (state.isBreaching) {
    state.breachProgress += dt * 4.0;
    if (state.breachProgress >= 1.0) {
      state.isBreaching = false;
    }
  }
}
