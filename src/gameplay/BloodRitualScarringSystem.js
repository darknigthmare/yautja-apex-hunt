// Système de Scarification Rituelle et Élévation au Rang "Blooded" (Lore 1:1)
// Référence canonique : AVP (2004) - Scarification au sang acide de la Reine/Guerrier sur le masque et le front

import { audioSynth } from '../AudioSynthesizer.js';

export const CLAN_GLYPHS = [
  { id: 'glyph_celtic', name: 'Emblème de l\'Éclair Ancestral', clan: 'Antarctica Initiation Clan', honorBonus: 350 },
  { id: 'glyph_scar', name: 'Griffe du Guerrier Blooded', clan: 'Bouvet Temple Guardians', honorBonus: 400 },
  { id: 'glyph_elder', name: 'Triangle des Anciens de Yautja Prime', clan: 'Elite Council', honorBonus: 500 },
];

export const HUNTER_RANKS = {
  UNBLOODED: 'Unblooded (Jeune Sang)',
  YOUNG_BLOOD: 'Young Blood (En Initiation)',
  BLOODED: 'Blooded (Guerrier Éprouvé)',
  ELITE: 'Elite (Chasseur Vétéran)',
};

export function createBloodRitualState() {
  return {
    currentRank: HUNTER_RANKS.YOUNG_BLOOD,
    isMarked: false,
    carvedGlyph: null,
    acidBurnsEndured: 0,
    totalSacredHonorBonus: 0,
    biomaskBranded: false,
    foreheadBranded: false,
    ritualHistory: [],
  };
}

export function performAcidBrandingRitual(state, trophyItem, targetGlyphId = 'glyph_scar', audio = audioSynth) {
  if (!state) return { success: false, reason: 'invalid_state' };

  // Vérification de la validité du trophée d'acide
  if (!trophyItem || (!trophyItem.isXenomorphPart && trophyItem.type !== 'acid_gland' && trophyItem.species !== 'xenomorph')) {
    return { success: false, reason: 'insufficient_worthy_trophy' };
  }

  const selectedGlyph = CLAN_GLYPHS.find(g => g.id === targetGlyphId) || CLAN_GLYPHS[0];

  state.isMarked = true;
  state.currentRank = HUNTER_RANKS.BLOODED;
  state.carvedGlyph = selectedGlyph;
  state.biomaskBranded = true;
  state.foreheadBranded = true;
  state.acidBurnsEndured += 1;
  state.totalSacredHonorBonus += selectedGlyph.honorBonus;

  state.ritualHistory.push({
    timestamp: Date.now(),
    glyph: selectedGlyph.name,
    honorEarned: selectedGlyph.honorBonus,
    trophyConsumed: trophyItem.name || 'Prélèvement d\'acide Xénomorphe',
  });

  if (audio && typeof audio.playAcidEtchSizzle === 'function') {
    audio.playAcidEtchSizzle();
  }

  return {
    success: true,
    rank: state.currentRank,
    glyph: selectedGlyph,
    honorGained: selectedGlyph.honorBonus,
  };
}

export function verifyBloodedPrivileges(state) {
  if (!state) return { hasPrestigeStance: false, elderArmoryAccess: false };
  const isBloodedOrHigher = state.currentRank === HUNTER_RANKS.BLOODED || state.currentRank === HUNTER_RANKS.ELITE;
  return {
    hasPrestigeStance: isBloodedOrHigher,
    elderArmoryAccess: isBloodedOrHigher && state.acidBurnsEndured >= 1,
    biomaskDisplayGlyph: state.isMarked ? state.carvedGlyph?.name : null,
  };
}
