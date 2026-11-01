import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CANON_PREY_CATALOG, MULTIVERSE_CROSSOVER_PREY, PREY_SCALE_TIERS,
  classifyPreyScaleFromMeters, getMultiverseRotationState,
  getPreyProvenanceLabel, getPreySourceLabel,
} from '../src/data/PreyTaxonomyAndCrossoverCatalog.js';
import { CROSSOVER_UNIVERSE_ENCOUNTERS } from '../src/data/CrossoverUniverseEncounters.js';

test('all archive and universe records share the physical scale shown by the catalogue', () => {
  const all = [...CANON_PREY_CATALOG, ...MULTIVERSE_CROSSOVER_PREY, ...CROSSOVER_UNIVERSE_ENCOUNTERS];
  assert.equal(all.length, 560);
  assert.equal(new Set(all.map(p => p.id)).size, all.length);
  for (const prey of all) {
    const tier = PREY_SCALE_TIERS[prey.scale];
    assert.ok(prey.sizeMeters >= tier.minMeters && prey.sizeMeters < tier.maxMeters, prey.id);
    assert.ok(PREY_SCALE_TIERS[prey.encounterTier], prey.id);
    assert.equal(prey.dimensionUnit, 'metres');
    assert.equal(prey.dimensionAxis, 'unspecified', 'an archive size alone does not establish height versus wingspan/length');
    assert.equal(prey.dimensionStatus, 'catalogue_estimate');
    assert.equal(prey.fidelityVerified, false, 'a source title alone cannot prove a 1:1 model or official dimension');
    assert.equal(prey.reproductionStatus, 'proxy_simulation');
  }
  assert.equal(classifyPreyScaleFromMeters(0.499), 'MINUSCULE');
  assert.equal(classifyPreyScaleFromMeters(0.5), 'PETITE');
  assert.equal(classifyPreyScaleFromMeters(1.8), 'MOYEN');
  assert.equal(classifyPreyScaleFromMeters(3), 'GRANDE');
  assert.equal(classifyPreyScaleFromMeters(8), 'GEANT');
  assert.equal(classifyPreyScaleFromMeters(100), 'GEANT', 'the giant tier has no contradictory 30m ceiling');
  for (const invalid of [0, -1, NaN, Infinity, undefined, '2']) assert.throws(() => classifyPreyScaleFromMeters(invalid), RangeError);
});

test('universe encounters distinguish their source scope from an official crossover claim', () => {
  const goliath = CANON_PREY_CATALOG.find(p => p.id === 'prey_goliath_akumo');
  assert.equal(goliath.sourceStatus, 'original');
  assert.equal(getPreyProvenanceLabel(goliath), 'CRÉATION ORIGINALE');
  const batman = MULTIVERSE_CROSSOVER_PREY.find(p => p.id === 'crossover_batman');
  assert.equal(getPreyProvenanceLabel(batman), 'SIMULATION D’UNIVERS');
  assert.match(getPreySourceLabel(batman), /Référence déclarée : Batman versus Predator/);
  const encounter = CROSSOVER_UNIVERSE_ENCOUNTERS.find(p => p.parentId === 'crossover_master_chief');
  assert.equal(encounter.referenceScope, 'universe');
  assert.equal(encounter.runtimeStatus, 'simulation');
  assert.match(getPreySourceLabel(encounter), /^Référence de l’univers :/);
  assert.doesNotMatch(getPreyProvenanceLabel(encounter), /CANON|OFFICIEL/);
});

test('extension aliases preserve the documented Feral, Wolf, Bad Blood and Rook dossier references', () => {
  for (const prey of CANON_PREY_CATALOG.filter(p => p.referencePreyId)) {
    const reference = CANON_PREY_CATALOG.find(p => p.id === prey.referencePreyId);
    assert.ok(reference, prey.id);
    assert.equal(prey.originMedia, reference.originMedia, prey.id);
    assert.equal(prey.sizeMeters, reference.sizeMeters, prey.id);
  }
  const feral = CANON_PREY_CATALOG.find(p => p.id === 'canon251_yautja_pisteur_prey_2022');
  assert.match(feral.description, /biomasque d’os|biomasque d'os/);
  const rook = CANON_PREY_CATALOG.find(p => p.id === 'canon251_synth_rook_sentinelle');
  assert.match(rook.name, /Officier scientifique/);
  assert.doesNotMatch(rook.description, /arme de poing|garde armé/);
});

test('rotation remains usable before epoch and at boundaries, and recovers an invalid clock', () => {
  const sixHours = 6 * 3600 * 1000;
  for (const timestamp of [-sixHours - 1, -1, 0, 1, sixHours - 1, sixHours, NaN, Infinity, new Date(NaN)]) {
    const state = getMultiverseRotationState(timestamp);
    assert.ok(state.activePrey);
    assert.equal(state.upcomingPrey.length, 2);
    assert.ok(state.upcomingPrey.every(Boolean));
    assert.ok(state.secondsRemaining > 0 && state.secondsRemaining <= sixHours / 1000);
    assert.match(state.formattedCountdown, /^\d{2}:\d{2}:\d{2}$/);
  }
  assert.equal(getMultiverseRotationState(-1).upcomingPrey[0].id, getMultiverseRotationState(0).activePrey.id);
  assert.equal(getMultiverseRotationState(sixHours - 1).secondsRemaining, 1);
});
