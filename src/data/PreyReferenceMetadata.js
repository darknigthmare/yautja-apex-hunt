import { HUNT_DEFINITIONS } from './GameConfig.js';

export const REFERENCE_FAUNA_FACTION = 'Faune indigène & Créatures de réserve';
const faunaReferenceIds = new Set(['prey_goliath_akumo', 'prey_kalisk_apex', 'prey_vydrach_prime',
  'prey_rhynth_titan', 'prey_vydrach_yautja_prime', 'prey_rhynth_ryushi']);

/** Explicit identity matches only: a species or similar name is not enough. */
export const DOCUMENTED_PREY_SUBJECT_MODELS = Object.freeze({
  prey_goliath_akumo: 'goliath',
  prey_xeno_queen_matriarch: 'xeno_queen',
  prey_bad_blood_warlord: 'bad_blood',
  prey_predalien_abomination: 'predalien',
  prey_super_predator_berserker: 'super_predator',
  prey_feral_predator_1719: 'feral_predator',
  prey_wolf_cleaner_2007: 'wolf_cleaner',
  prey_kalisk_apex: 'kalisk',
  prey_upgrade_predator: 'upgrade_predator',
  prey_yautja_assassin_stargazer: 'upgrade_predator',
  prey_city_hunter_1990: 'city_hunter',
  prey_xeno_grid_avp: 'grid_alien',
  prey_jungle_hunter_1987: 'jungle_hunter_1987',
  prey_vydrach_prime: 'vydrach_prime',
  prey_rhynth_titan: 'rhynth_titan',
  prey_xeno_rogue_titan_king: 'xeno_king',
});

export function getDocumentedPreySubjectModelId(prey) {
  for (const id of [prey?.id, prey?.referencePreyId]) {
    if (typeof id === 'string' && Object.hasOwn(DOCUMENTED_PREY_SUBJECT_MODELS, id)) return DOCUMENTED_PREY_SUBJECT_MODELS[id];
  }
  return null;
}

/** Catalogue dimensions are metres; conversion to scene units belongs to runtime. */
export function classifyPreyScaleFromMeters(sizeMeters) {
  if (!Number.isFinite(sizeMeters) || sizeMeters <= 0) throw new RangeError('A prey dimension must be finite, positive and expressed in metres.');
  if (sizeMeters < 0.5) return 'MINUSCULE';
  if (sizeMeters < 1.8) return 'PETITE';
  if (sizeMeters < 3) return 'MOYEN';
  if (sizeMeters < 8) return 'GRANDE';
  return 'GEANT';
}

/**
 * Separate physical size from encounter difficulty. The source title is a
 * declared reference, not evidence that this original simulation, its numerical
 * dimensions, weak points, rewards or proxy geometry reproduce that work 1:1.
 */
export function normalizePreyReference(entry, { kind = 'archive' } = {}) {
  const source = entry.originMedia || '';
  const original = /création|apex hunt|fan[ -]?(?:made|lore)|concept original/i.test(source);
  const sourceStatus = kind === 'universe_encounter' ? 'universe_simulation'
    : kind === 'crossover' ? 'crossover_simulation'
      : original ? 'original' : 'declared_reference';
  return {
    ...entry,
    ...(faunaReferenceIds.has(entry.id) ? { faction: REFERENCE_FAUNA_FACTION, declaredFaction: entry.faction } : {}),
    declaredScale: entry.declaredScale ?? entry.scale,
    encounterTier: entry.encounterTier ?? entry.scale,
    scale: classifyPreyScaleFromMeters(entry.sizeMeters),
    dimensionUnit: 'metres',
    dimensionAxis: 'unspecified',
    dimensionStatus: 'catalogue_estimate',
    sourceStatus,
    sourcePublicationVerified: false,
    sourceEvidenceStatus: original ? 'original_design' : 'declared_not_independently_verified',
    referenceScope: kind === 'universe_encounter' ? 'universe' : 'entry',
    runtimeStatus: 'simulation',
    reproductionStatus: 'proxy_simulation',
    matchedRuntimeSubjectId: getDocumentedPreySubjectModelId(entry),
    implementationOriginal: true,
    fidelityVerified: false,
  };
}

/** A source label is not a publication, dimensional or reproduction certificate. */
export function getPreyReferenceEvidence(prey) {
  return {
    declaredTitle: prey?.originMedia || null,
    scope: prey?.referenceScope === 'universe' ? 'universe' : 'entry',
    kind: prey?.sourceStatus === 'original' ? 'original_design' : 'declared_reference',
    publicationVerified: false,
    reproductionVerified: false,
    dimensionsVerified: false,
    dimensionCitation: null,
    matchedRuntimeSubjectId: getDocumentedPreySubjectModelId(prey),
  };
}

/** Shared data-only mapping, used by the hunt and by the fidelity inventory. */
export function getPreySimulationModelReference(target, { kind = 'prey', factions = {} } = {}) {
  if (!target || !['prey', 'crossover'].includes(kind)) return null;
  const subjectId = kind === 'prey' ? getDocumentedPreySubjectModelId(target) : null;
  const subject = subjectId && HUNT_DEFINITIONS[subjectId];
  if (subject) return {
    huntType: subject.id, planetType: subject.recommendedBiome ?? 'jungle',
    modelStatus: 'training_proxy', subjectModelStatus: 'matching_subject_adaptation',
    matchedRuntimeSubjectId: subject.id, fidelityVerified: false,
  };
  const id = String(target.id ?? '').toLowerCase();
  let huntType = kind === 'crossover' ? 'bad_blood' : 'goliath';
  let planetType = 'jungle';
  if (factions.XENOMORPH && target.faction === factions.XENOMORPH) {
    huntType = /king|roi/.test(id) ? 'xeno_king' : /queen|reine|matriarch/.test(id) ? 'xeno_queen' : 'grid_alien';
    planetType = 'hive_lv426';
  } else if (/rhynth/.test(id)) {
    huntType = 'rhynth_titan'; planetType = 'ryushi_desert';
  } else if (/vydrach/.test(id)) {
    huntType = 'vydrach_prime'; planetType = 'genna_deathworld';
  } else if (factions.YAUTJA && target.faction === factions.YAUTJA) {
    huntType = 'bad_blood'; planetType = 'yautja_prime';
  } else if ((factions.HUMAN_SYNTHETIC && target.faction === factions.HUMAN_SYNTHETIC) || /batman|dredd|robocop|terminator/.test(id)) {
    huntType = 'city_hunter'; planetType = 'los_angeles_1997';
  } else if (target.sizeMeters >= 8) {
    huntType = 'kalisk'; planetType = 'ryushi_desert';
  }
  return { huntType, planetType, modelStatus: 'training_proxy', subjectModelStatus: 'generic_proxy',
    matchedRuntimeSubjectId: null, fidelityVerified: false };
}

export function getPreyProvenanceLabel(prey) {
  if (prey?.sourceStatus === 'original') return 'CRÉATION ORIGINALE';
  if (prey?.sourceStatus === 'universe_simulation' || prey?.sourceStatus === 'crossover_simulation') return 'SIMULATION D’UNIVERS';
  return 'SIMULATION D’ARCHIVE';
}

export function getPreySourceLabel(prey) {
  const reference = prey?.originMedia || 'Référence non renseignée';
  const imprecise = /\blore\b|shared era|tribute run|canonique|concept\s*(?:&|et|original)|corporate archives/i.test(reference);
  const qualification = prey?.sourceStatus !== 'original' && imprecise ? ' · publication non vérifiée' : '';
  return `${prey?.referenceScope === 'universe' ? 'Référence de l’univers' : 'Référence déclarée'} : ${reference}${qualification}`;
}
