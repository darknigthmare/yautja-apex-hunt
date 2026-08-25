// Directives de chasse data-driven pour les contrats multi-objectifs.
// Ce module reste volontairement pur : aucune dépendance DOM, Three.js ou
// runtime, afin que sa progression puisse être sérialisée dans une sauvegarde.

const DIRECTIVE_EVENT_KIND = 'directive_wave';

function objective(npcType, label) {
  return {
    id: npcType,
    type: 'npc_defeat',
    npcType,
    label,
    required: 1,
  };
}

function wave(at, npcType) {
  return {
    at,
    kind: DIRECTIVE_EVENT_KIND,
    type: DIRECTIVE_EVENT_KIND,
    npcType,
    enemyTypes: Object.freeze([npcType]),
    count: 1,
    objectiveId: npcType,
  };
}

function freezeDirective(definition) {
  const objectives = Object.freeze(
    definition.objectives.map((entry) => Object.freeze({ ...entry })),
  );
  const schedule = Object.freeze(
    definition.schedule.map((entry) => Object.freeze({ ...entry })),
  );
  return Object.freeze({ ...definition, objectives, schedule });
}

const directiveDefinitions = [
  {
    id: 'standard_hunt',
    title: 'Chasse standard',
    shortLabel: 'STANDARD',
    description: 'Contrat libre sans objectif de directive supplémentaire.',
    provenance: 'ORIGINAL',
    recommendedBiomeId: null,
    rewardMultiplier: 1,
    objectives: [],
    schedule: [],
  },
  {
    id: 'jungle_fireteam',
    title: 'Escouade de la jungle',
    shortLabel: 'FIRETEAM',
    description: 'Identifier puis neutraliser les trois spécialistes de l’escouade avant son extraction.',
    provenance: 'SCREEN',
    recommendedBiomeId: 'jungle',
    rewardMultiplier: 1.3,
    objectives: [
      objective('jungle_scout', 'Neutraliser l’éclaireur de la jungle'),
      objective('jungle_gunner', 'Neutraliser le mitrailleur de la jungle'),
      objective('jungle_trapper', 'Neutraliser le poseur de pièges de la jungle'),
    ],
    schedule: [
      wave(8, 'jungle_scout'),
      wave(28, 'jungle_gunner'),
      wave(50, 'jungle_trapper'),
    ],
  },
  {
    id: 'blooding_rite',
    title: 'Rite du sang',
    shortLabel: 'BLOODING',
    description: 'Survivre à la montée des castes de la ruche et marquer chaque trophée rituel.',
    provenance: 'SCREEN',
    recommendedBiomeId: 'hive_lv426',
    rewardMultiplier: 1.3,
    objectives: [
      objective('xeno_drone', 'Abattre un drone xénomorphe'),
      objective('xeno_warrior', 'Abattre un guerrier xénomorphe'),
      objective('xeno_runner', 'Abattre un coureur xénomorphe'),
    ],
    schedule: [
      wave(7, 'xeno_drone'),
      wave(27, 'xeno_warrior'),
      wave(47, 'xeno_runner'),
    ],
  },
  {
    id: 'killer_eras',
    title: 'Tueurs à travers les âges',
    shortLabel: 'TROIS ÈRES',
    description: 'Éprouver trois combattants d’élite issus de périodes historiques distinctes.',
    provenance: 'SCREEN',
    recommendedBiomeId: 'yautja_prime',
    rewardMultiplier: 1.4,
    objectives: [
      objective('era_viking_raider', 'Vaincre le pillard viking'),
      objective('era_feudal_duelist', 'Vaincre le duelliste féodal'),
      objective('era_wartime_pilot', 'Vaincre le pilote de guerre'),
    ],
    schedule: [
      wave(10, 'era_viking_raider'),
      wave(38, 'era_feudal_duelist'),
      wave(70, 'era_wartime_pilot'),
    ],
  },
  {
    id: 'deathworld_protocol',
    title: 'Protocole du monde mortel',
    shortLabel: 'DEATHWORLD',
    description: 'Traverser la chaîne de prédation de Genna et neutraliser sa surveillance synthétique.',
    provenance: 'SCREEN',
    recommendedBiomeId: 'genna_deathworld',
    rewardMultiplier: 1.35,
    objectives: [
      objective('genna_sporeback', 'Abattre un dos-à-spores de Genna'),
      objective('genna_stalker', 'Abattre un traqueur organique de Genna'),
      objective('combat_synthetic', 'Neutraliser un synthétique de combat'),
    ],
    schedule: [
      wave(9, 'genna_sporeback'),
      wave(31, 'genna_stalker'),
      wave(55, 'combat_synthetic'),
    ],
  },
];

export const HUNT_DIRECTIVES = Object.freeze(Object.fromEntries(
  directiveDefinitions.map((definition) => {
    const frozenDefinition = freezeDirective(definition);
    return [frozenDefinition.id, frozenDefinition];
  }),
));

const STANDARD_DIRECTIVE = HUNT_DIRECTIVES.standard_hunt;

function normalizeString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function hasDirective(id) {
  return Boolean(id && Object.hasOwn(HUNT_DIRECTIVES, id));
}

function resolveDirectiveIdentity(id) {
  const requestedDirectiveId = normalizeString(id);
  const directiveId = hasDirective(requestedDirectiveId)
    ? requestedDirectiveId
    : STANDARD_DIRECTIVE.id;
  return {
    directiveId,
    requestedDirectiveId,
    fallbackUsed: directiveId !== requestedDirectiveId,
  };
}

export function getHuntDirective(id) {
  const normalizedId = normalizeString(id);
  return hasDirective(normalizedId) ? HUNT_DIRECTIVES[normalizedId] : STANDARD_DIRECTIVE;
}

export function resolveDirectiveBiome(id, requestedBiomeId) {
  const directive = getHuntDirective(id);
  return directive.recommendedBiomeId ?? normalizeString(requestedBiomeId);
}

export function createDirectiveProgress(id) {
  const identity = resolveDirectiveIdentity(id);
  const directive = HUNT_DIRECTIVES[identity.directiveId];
  return {
    schemaVersion: 1,
    directiveId: directive.id,
    requestedDirectiveId: identity.requestedDirectiveId,
    fallbackUsed: identity.fallbackUsed,
    objectiveCounts: Object.fromEntries(
      directive.objectives.map(({ id: objectiveId }) => [objectiveId, 0]),
    ),
  };
}

function normalizeProgress(progress) {
  const identity = resolveDirectiveIdentity(progress?.directiveId);
  const directive = HUNT_DIRECTIVES[identity.directiveId];
  const sourceCounts = progress?.objectiveCounts;
  const sourceIsRecord = sourceCounts !== null
    && typeof sourceCounts === 'object'
    && !Array.isArray(sourceCounts);
  const objectiveCounts = Object.fromEntries(directive.objectives.map((entry) => {
    const rawCount = sourceIsRecord ? Number(sourceCounts[entry.id]) : 0;
    const safeCount = Number.isFinite(rawCount)
      ? Math.max(0, Math.min(entry.required, Math.floor(rawCount)))
      : 0;
    return [entry.id, safeCount];
  }));

  const requestedDirectiveId = normalizeString(progress?.requestedDirectiveId)
    ?? identity.requestedDirectiveId;
  return {
    schemaVersion: 1,
    directiveId: directive.id,
    requestedDirectiveId,
    fallbackUsed: Boolean(progress?.fallbackUsed) || identity.fallbackUsed,
    objectiveCounts,
  };
}

export function recordDirectiveNpcDefeat(progress, npcType) {
  const next = normalizeProgress(progress);
  const directive = HUNT_DIRECTIVES[next.directiveId];
  const normalizedNpcType = normalizeString(npcType);
  const targetObjective = directive.objectives.find(
    (entry) => entry.npcType === normalizedNpcType,
  );

  if (targetObjective) {
    next.objectiveCounts[targetObjective.id] = Math.min(
      targetObjective.required,
      next.objectiveCounts[targetObjective.id] + 1,
    );
  }
  return next;
}

export function getDirectiveProgressSummary(progress) {
  const normalized = normalizeProgress(progress);
  const directive = HUNT_DIRECTIVES[normalized.directiveId];
  const objectives = directive.objectives.map((entry) => {
    const current = normalized.objectiveCounts[entry.id] ?? 0;
    return {
      id: entry.id,
      npcType: entry.npcType,
      label: entry.label,
      current,
      required: entry.required,
      completed: current >= entry.required,
    };
  });
  const completedObjectives = objectives.filter(({ completed }) => completed).length;
  const totalObjectives = objectives.length;
  const isComplete = completedObjectives === totalObjectives;

  return {
    directiveId: directive.id,
    title: directive.title,
    fallbackUsed: normalized.fallbackUsed,
    completedObjectives,
    totalObjectives,
    remainingObjectives: totalObjectives - completedObjectives,
    completionRatio: totalObjectives === 0 ? 1 : completedObjectives / totalObjectives,
    isComplete,
    complete: isComplete,
    objectives,
  };
}

export function resolveDirectiveReward(id, baseReward, progress) {
  const directive = getHuntDirective(id);
  const numericReward = Number(baseReward);
  const safeBaseReward = Number.isFinite(numericReward) ? Math.max(0, numericReward) : 0;
  if (directive.rewardMultiplier === 1) return Math.round(safeBaseReward);

  const summary = getDirectiveProgressSummary(progress);
  const objectivesComplete = summary.directiveId === directive.id && summary.isComplete;
  const multiplier = objectivesComplete ? directive.rewardMultiplier : 1;
  return Math.round(safeBaseReward * multiplier);
}

export function getDirectiveSchedule(id) {
  return getHuntDirective(id).schedule;
}
