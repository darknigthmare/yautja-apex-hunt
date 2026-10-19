// Directeur de Décapitation Réciproque et Duel Katana / Wristblade (Predators 2010 — Lore 1:1)
// Référence canonique : Predators (2010) — La passe d'armes finale en Iaidō entre Hanzo et le Falconer Predator dans les herbes hautes.

import { audioSynth } from '../AudioSynthesizer.js';

export const KATANA_CLASH_CONSTANTS = {
  PERFECT_IAIDO_WINDOW_SEC: 0.25,      // Fenêtre de réflexe pour la frappe instantanée en croisé
  LETHAL_DECAPITATION_DAMAGE: 350.0,   // Dégâts de la lame de katana forgée par Hanzō
  LETHAL_WRISTBLADE_DAMAGE: 350.0,     // Dégâts de la lame de poignet Super Predator
  HONOR_SACRIFICE_SCORE: 500,          // Points d'honneur du rite martial ultime
};

export function createKatanaClashState() {
  return {
    isStanceReady: false,
    isCrossClashExecuted: false,
    isDecapitationConfirmed: false,
    honorResult: null,
  };
}

export function prepareIaidoStance(state, hanzo, falconer) {
  if (!state || !hanzo || !falconer) return false;

  state.isStanceReady = true;
  hanzo.isConcentrating = true;
  falconer.isPoisedForCrossSlash = true;

  return true;
}

export function executeIaidoCrossClash(state, hanzo, falconer, reactionDelta = 0.15, audio = audioSynth) {
  if (!state || !state.isStanceReady || state.isCrossClashExecuted) {
    return { success: false, reason: 'NOT_IN_STANCE' };
  }

  state.isCrossClashExecuted = true;

  // Bruissement de sabre fendant le vent
  if (audio && typeof audio.playIaidoWindSliceSwish === 'function') {
    audio.playIaidoWindSliceSwish();
  }

  const isPerfectTiming = Math.abs(reactionDelta) <= KATANA_CLASH_CONSTANTS.PERFECT_IAIDO_WINDOW_SEC;

  if (isPerfectTiming) {
    // Les deux maîtres se croisent à la vitesse de l'éclair
    if (audio && typeof audio.playFatalDuelBladeThud === 'function') {
      audio.playFatalDuelBladeThud();
    }

    // Hanzo décapite le Falconer
    falconer.isDecapitated = true;
    if (typeof falconer.takeDamage === 'function') {
      falconer.takeDamage(KATANA_CLASH_CONSTANTS.LETHAL_DECAPITATION_DAMAGE);
    } else {
      falconer.health = 0;
    }

    // Le Falconer transperce le torse de Hanzo dans son élan
    hanzo.isMortallyImpaled = true;
    if (typeof hanzo.takeDamage === 'function') {
      hanzo.takeDamage(KATANA_CLASH_CONSTANTS.LETHAL_WRISTBLADE_DAMAGE);
    } else {
      hanzo.health = 0;
    }

    state.isDecapitationConfirmed = true;
    state.honorResult = 'MUTUAL_HONORABLE_DEATH';

    return {
      success: true,
      mutualKill: true,
      decapitatedTarget: 'falconer',
      impaledTarget: 'hanzo',
      honorScore: KATANA_CLASH_CONSTANTS.HONOR_SACRIFICE_SCORE,
    };
  }

  // Coup dévié ou parade imparfaite
  return {
    success: true,
    mutualKill: false,
    reason: 'DEFLECTED_OR_GRAZED',
  };
}
