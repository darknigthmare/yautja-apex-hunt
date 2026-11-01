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
    declaredScale: entry.declaredScale ?? entry.scale,
    encounterTier: entry.encounterTier ?? entry.scale,
    scale: classifyPreyScaleFromMeters(entry.sizeMeters),
    dimensionUnit: 'metres',
    dimensionAxis: 'unspecified',
    dimensionStatus: 'catalogue_estimate',
    sourceStatus,
    referenceScope: kind === 'universe_encounter' ? 'universe' : 'entry',
    runtimeStatus: 'simulation',
    reproductionStatus: 'proxy_simulation',
    implementationOriginal: true,
    fidelityVerified: false,
  };
}

export function getPreyProvenanceLabel(prey) {
  if (prey?.sourceStatus === 'original') return 'CRÉATION ORIGINALE';
  if (prey?.sourceStatus === 'universe_simulation' || prey?.sourceStatus === 'crossover_simulation') return 'SIMULATION D’UNIVERS';
  return 'SIMULATION D’ARCHIVE';
}

export function getPreySourceLabel(prey) {
  const reference = prey?.originMedia || 'Référence non renseignée';
  return `${prey?.referenceScope === 'universe' ? 'Référence de l’univers' : 'Référence déclarée'} : ${reference}`;
}
