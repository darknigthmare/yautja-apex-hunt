// Abattoir de Viande Suspendue & Couvert Cryo-Thermique sur Rails (Predator 2 — Lore 1:1)
// Référence canonique : Predator 2 (1990) — Les rangées de carcasses bovines congelées suspendues aux rails aériens de l'abattoir de Los Angeles qui absorbent les chevrotines de l'OWLF et dissimulent le City Hunter.

import { audioSynth } from '../AudioSynthesizer.js';

export const HANGING_CARCASS_CONSTANTS = {
  BALLISTIC_ABSORPTION_RATIO: 0.85,  // 85% des dégâts balistiques absorbés par les carcasses gelées
  THERMAL_MASKING_BONUS: true,       // Masque la silhouette du chasseur derrière la viande glacée
};

export function createHangingCarcassSectorState() {
  return {
    carcassRailsCount: 4,
    absorbedVolleysCount: 0,
  };
}

export function takeCoverBehindHangingCarcasses(state, hunter, incomingBallisticDamage = 100, audio = audioSynth) {
  if (!state || !hunter) {
    return { shielded: false, damageTaken: incomingBallisticDamage };
  }

  state.absorbedVolleysCount++;
  hunter.isThermallyMaskedByCarcasses = HANGING_CARCASS_CONSTANTS.THERMAL_MASKING_BONUS;

  if (audio && typeof audio.playHangingCarcassChainSwingClank === 'function') {
    audio.playHangingCarcassChainSwingClank();
  }

  const residualDamage = Math.round(incomingBallisticDamage * (1 - HANGING_CARCASS_CONSTANTS.BALLISTIC_ABSORPTION_RATIO));
  if (typeof hunter.takeDamage === 'function') {
    hunter.takeDamage(residualDamage);
  } else if (typeof hunter.health === 'number') {
    hunter.health = Math.max(0, hunter.health - residualDamage);
  }

  return {
    shielded: true,
    damageTaken: residualDamage,
    damageAbsorbed: incomingBallisticDamage - residualDamage,
  };
}
