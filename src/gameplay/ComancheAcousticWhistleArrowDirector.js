// Directeur de Flèches Sifflantes Acoustiques et Guidage Comanche (Prey 2022 — Lore 1:1)
// Référence canonique : Prey (2022) — Naru taillant des fémurs d'oiseaux évidés formant des sifflets harmoniques résonnant sur les cliquetis de gorge du Feral Predator pour guider les flèches.

import { audioSynth } from '../AudioSynthesizer.js';

export const ACOUSTIC_ARROW_CONSTANTS = {
  HOMING_ANGLE_MAX_DEG: 35.0,         // Arc maximal d'ajustement balistique acoustique
  BASE_ARROW_DAMAGE: 90.0,            // Dégâts de la pointe de silex / os taillé
  THROAT_STRIKE_CRIT_MULT: 1.5,       // Multiplicateur critique si ciblage de la gorge
  CLOAK_DISRUPT_ON_HIT: true,         // La flèche fichée brise le camouflage optique
};

export function createAcousticArrowState() {
  return {
    remainingArrows: 4,
    successfulHomingHits: 0,
  };
}

export function fireAcousticWhistleArrow(state, shooterPos = { x: 0, z: 0 }, target = null, isThroatAimed = false, audio = audioSynth) {
  if (!state || state.remainingArrows <= 0 || !target) {
    return { success: false, reason: 'NO_ARROWS_OR_INVALID_TARGET' };
  }

  state.remainingArrows--;

  if (audio && typeof audio.playAcousticWhistleArrowTone === 'function') {
    audio.playAcousticWhistleArrowTone();
  }

  // Verrouillage acoustique sur cliquetis
  if (audio && typeof audio.playAcousticHomingLockClick === 'function') {
    audio.playAcousticHomingLockClick();
  }

  let damage = ACOUSTIC_ARROW_CONSTANTS.BASE_ARROW_DAMAGE;
  if (isThroatAimed) {
    damage *= ACOUSTIC_ARROW_CONSTANTS.THROAT_STRIKE_CRIT_MULT;
    target.isThroatPierced = true;
  }

  if (typeof target.takeDamage === 'function') {
    target.takeDamage(damage);
  } else if (typeof target.health === 'number') {
    target.health = Math.max(0, target.health - damage);
  }

  // Brisure de camouflage
  if (target.isCloaked) {
    target.isCloaked = false;
    target.isRevealedByArrow = true;
  }

  state.successfulHomingHits++;

  return {
    success: true,
    damageDealt: damage,
    isCrit: isThroatAimed,
    cloakBroken: true,
    remainingArrows: state.remainingArrows,
  };
}
