// Marquage Rituel de Sang Acide sur Front & Masque (AVP 2004 — Lore 1:1)
// Référence canonique : Alien vs. Predator (2004) — Scar trempant son doigt dans le sang acide fumant d'un Xénomorphe abattu pour graver le symbole du clan sur son masque et son front (rite d'initiation Blooded), puis marquant la joue de Lex Woods.

import { audioSynth } from '../AudioSynthesizer.js';

export const BLOODED_MARK_CONSTANTS = {
  HONOR_PRESTIGE_GRANTED: 250,       // Gain d'honneur clanique de rang Blooded
  MELEE_FEROCITY_MULTIPLIER: 1.25,   // +25% de puissance au corps à corps
  FEAR_IMMUNITY: true,               // Immunité totale à la panique et suppression
};

export function createBloodedMarkingState() {
  return {
    isHunterBlooded: false,
    isAllyMarked: false,
    clanHonorEarned: 0,
  };
}

export function performAcidBloodClanMarking(state, hunter, slainXenomorph, ally = null, audio = audioSynth) {
  if (!state || !hunter || !slainXenomorph || slainXenomorph.health > 0) {
    return { marked: false };
  }

  state.isHunterBlooded = true;
  state.clanHonorEarned += BLOODED_MARK_CONSTANTS.HONOR_PRESTIGE_GRANTED;

  hunter.isBloodedRank = true;
  hunter.meleeDamageMultiplier = BLOODED_MARK_CONSTANTS.MELEE_FEROCITY_MULTIPLIER;
  hunter.isFearImmune = BLOODED_MARK_CONSTANTS.FEAR_IMMUNITY;

  if (ally) {
    state.isAllyMarked = true;
    ally.hasClanWarriorMark = true;
    ally.isRespectedByClan = true;
  }

  if (audio) {
    if (typeof audio.playAcidBloodClanMarkSizzle === 'function') {
      audio.playAcidBloodClanMarkSizzle();
    }
    if (typeof audio.playBloodedWarriorHonorChant === 'function') {
      audio.playBloodedWarriorHonorChant();
    }
  }

  return {
    marked: true,
    honorGranted: BLOODED_MARK_CONSTANTS.HONOR_PRESTIGE_GRANTED,
    allyMarked: state.isAllyMarked,
  };
}
