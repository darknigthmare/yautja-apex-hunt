// Système rituel de taxidermie, écorchage et gravure des trophées Yautja (Lore 1:1)
// Références canoniques : Predator (1987), Predator 2 (1990), AVP (2004), AVP:R (2007)

import { audioSynth } from '../AudioSynthesizer.js';

export const RITUAL_PHASES = Object.freeze({
  UNPROCESSED: 'unprocessed',
  FLENSING: 'flensing',           // Écorchage et détachement vertébral
  ACID_BATH: 'acid_bath',         // Dissolution des chairs molles au solvant Cleaner
  BONE_POLISHING: 'bone_polishing', // Polissage thermique et raclage des sutures
  CLAN_ETCHING: 'clan_etching',   // Gravure plasma du glyphe d'honneur
  CONSECRATED: 'consecrated',     // Trophée prêt pour le mur d'exposition du Vaisseau Mère
});

export const TROPHY_PREPARATION_RECIPES = Object.freeze([
  Object.freeze({
    id: 'human_commando_skull',
    name: 'Crâne et rachis de commando humain',
    sourceTier: 'SCREEN',
    sources: Object.freeze(['predator1987']),
    baseHonor: 45,
    consecratedBonusHonor: 75,
    solvents: Object.freeze(['cleaner_solvent', 'thermal_steam']),
    glyphType: 'clan_hunter_mark',
    description: 'Crâne humain d\'élite avec colonne vertébrale complète, symbole de la traque de jungle 1987.',
  }),
  Object.freeze({
    id: 'xeno_warrior_skull',
    name: 'Crâne blindé de guerrier Xénomorphe',
    sourceTier: 'AVP_SCREEN',
    sources: Object.freeze(['predator2', 'avp2004']),
    baseHonor: 80,
    consecratedBonusHonor: 120,
    solvents: Object.freeze(['cleaner_acid_neutralizer', 'alkaline_rinse']),
    glyphType: 'blooded_acid_burn',
    description: 'Crâne allongé caréné poli et neutralisé contre les sécrétions d\'acide moléculaire.',
  }),
  Object.freeze({
    id: 'hellhound_skull',
    name: 'Crâne à cornes de Hell-Hound',
    sourceTier: 'SCREEN',
    sources: Object.freeze(['predators2010']),
    baseHonor: 60,
    consecratedBonusHonor: 90,
    solvents: Object.freeze(['cleaner_solvent']),
    glyphType: 'super_predator_tally',
    description: 'Crâne canin massif aux défenses spiralées prélevé sur la planète réserve de chasse.',
  }),
  Object.freeze({
    id: 'badblood_skull',
    name: 'Crâne de Yautja Bad Blood renégat',
    sourceTier: 'LICENSED_EU',
    sources: Object.freeze(['predatorBadBloodComics']),
    baseHonor: 150,
    consecratedBonusHonor: 250,
    solvents: Object.freeze(['sacred_oil', 'thermal_steam']),
    glyphType: 'justice_restitution_rune',
    description: 'Crâne d\'un chasseur renégat ayant bafoué le code d\'honneur, purifié et gravé selon le jugement des Anciens.',
  }),
]);

export function getTrophyRecipeById(id) {
  return TROPHY_PREPARATION_RECIPES.find((r) => r.id === id) ?? TROPHY_PREPARATION_RECIPES[0];
}

export function createTrophyRitualState() {
  return {
    pendingTrophies: [],
    consecratedTrophies: [],
    currentRitual: null,
  };
}

export function queueRawTrophy(state, trophyId) {
  if (!state || !trophyId) return false;
  const recipe = getTrophyRecipeById(trophyId);
  const entry = {
    id: `trophy_instance_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    recipeId: recipe.id,
    phase: RITUAL_PHASES.UNPROCESSED,
    honorValue: recipe.baseHonor,
    progress: 0,
    currentStepTime: 0,
  };
  state.pendingTrophies.push(entry);
  return entry;
}

export function startTrophyRitual(state, instanceId) {
  if (!state || state.currentRitual) return false;
  const index = state.pendingTrophies.findIndex((t) => t.id === instanceId);
  if (index === -1) return false;

  const [trophy] = state.pendingTrophies.splice(index, 1);
  trophy.phase = RITUAL_PHASES.FLENSING;
  trophy.progress = 0.2;
  state.currentRitual = trophy;
  return trophy;
}

export function advanceRitualStep(state, actionId, audio = audioSynth) {
  if (!state?.currentRitual) return { success: false, reason: 'no_active_ritual' };
  const ritual = state.currentRitual;
  const recipe = getTrophyRecipeById(ritual.recipeId);

  switch (ritual.phase) {
    case RITUAL_PHASES.FLENSING:
      if (actionId === 'flesh_flensing_knife' || actionId === 'manual_flense') {
        ritual.phase = RITUAL_PHASES.ACID_BATH;
        ritual.progress = 0.45;
        if (audio && typeof audio.playMedicompUse === 'function') audio.playMedicompUse();
        return { success: true, phase: ritual.phase, nextAction: 'soak_solvent' };
      }
      return { success: false, reason: 'invalid_action_for_phase' };

    case RITUAL_PHASES.ACID_BATH:
      if (actionId === 'soak_solvent' || actionId === 'cleaner_bath') {
        ritual.phase = RITUAL_PHASES.BONE_POLISHING;
        ritual.progress = 0.70;
        if (audio && typeof audio.playSolventBoil === 'function') audio.playSolventBoil();
        return { success: true, phase: ritual.phase, nextAction: 'thermal_polish' };
      }
      return { success: false, reason: 'invalid_action_for_phase' };

    case RITUAL_PHASES.BONE_POLISHING:
      if (actionId === 'thermal_polish' || actionId === 'scrape_sutures') {
        ritual.phase = RITUAL_PHASES.CLAN_ETCHING;
        ritual.progress = 0.90;
        if (audio && typeof audio.playCauterizerSizzle === 'function') audio.playCauterizerSizzle();
        return { success: true, phase: ritual.phase, nextAction: 'plasma_etch' };
      }
      return { success: false, reason: 'invalid_action_for_phase' };

    case RITUAL_PHASES.CLAN_ETCHING:
      if (actionId === 'plasma_etch' || actionId === 'etch_clan_glyph') {
        ritual.phase = RITUAL_PHASES.CONSECRATED;
        ritual.progress = 1.0;
        ritual.honorValue = recipe.baseHonor + recipe.consecratedBonusHonor;
        ritual.consecratedAt = Date.now();
        if (audio && typeof audio.playBoneCarvingEtch === 'function') audio.playBoneCarvingEtch();
        state.consecratedTrophies.push(ritual);
        state.currentRitual = null;
        return { success: true, phase: RITUAL_PHASES.CONSECRATED, completedTrophy: ritual };
      }
      return { success: false, reason: 'invalid_action_for_phase' };

    default:
      return { success: false, reason: 'unknown_phase' };
  }
}
