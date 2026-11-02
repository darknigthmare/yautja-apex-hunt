import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAst } from 'rolldown/parseAst';
import { HUNT_DEFINITIONS } from '../src/data/GameConfig.js';
import { BOSS_CONSTRUCTORS } from '../src/gameplay/BossFactory.js';
import { AVAILABLE_HUNT_NPC_ARCHETYPES, HUNT_NPC_TEXTURES } from '../src/entities/HuntNPC.js';
import { NPC_FIDELITY_BINDINGS, BOSS_FIDELITY_BINDINGS } from '../src/data/FidelityRuntimeBindings.js';
import { getFidelityCoverage, getFidelityEntry, getFidelityStatusLabel } from '../src/data/FidelityCoverage.js';
import { CANON_PREY_CATALOG, MULTIVERSE_CROSSOVER_PREY, PREY_FACTIONS } from '../src/data/PreyTaxonomyAndCrossoverCatalog.js';
import { CROSSOVER_UNIVERSE_ENCOUNTERS } from '../src/data/CrossoverUniverseEncounters.js';
import { getPreySimulationModelReference, getPreyReferenceEvidence, getPreySourceLabel,
  DOCUMENTED_PREY_SUBJECT_MODELS, getDocumentedPreySubjectModelId } from '../src/data/PreyReferenceMetadata.js';
import { resolveSimulationSelection } from '../src/gameplay/SimulationHuntRuntime.js';

const root = fileURLToPath(new URL('../', import.meta.url));

test('the source inventory covers every current physical boss and NPC with its real renderer and texture', () => {
  assert.deepEqual(BOSS_FIDELITY_BINDINGS.map(x => x.id).sort(), Object.keys(HUNT_DEFINITIONS).sort());
  for (const binding of BOSS_FIDELITY_BINDINGS) {
    assert.equal(BOSS_CONSTRUCTORS[binding.bossType].name, binding.className);
    assert.ok(existsSync(resolve(root, binding.file)));
    assert.equal(getFidelityEntry(binding.id, { category: 'contract' }).implementation.reachable, true);
    for (const texture of binding.textures) assert.ok(existsSync(resolve(root, 'public' + texture)), texture);
  }
  assert.deepEqual(NPC_FIDELITY_BINDINGS.map(x => x.id).sort(), Object.keys(AVAILABLE_HUNT_NPC_ARCHETYPES).sort());
  const source = readFileSync(resolve(root, 'src/entities/HuntNPC.js'), 'utf8');
  for (const binding of NPC_FIDELITY_BINDINGS) {
    assert.equal(binding.texture, HUNT_NPC_TEXTURES[binding.id]);
    assert.ok(existsSync(resolve(root, 'public' + binding.texture)));
    assert.ok(source.includes(`${binding.id}: ${binding.builder},`), binding.id);
    assert.equal(binding.damageType, AVAILABLE_HUNT_NPC_ARCHETYPES[binding.id].damageType);
  }
});

test('all 560 dossier bindings use exactly the same shared proxy choice as actual deployment', () => {
  let checked = 0;
  for (const [kind, entries, category] of [
    ['prey', CANON_PREY_CATALOG, 'prey_dossier'],
    ['crossover', MULTIVERSE_CROSSOVER_PREY, 'crossover_dossier'],
    ['crossover', CROSSOVER_UNIVERSE_ENCOUNTERS, 'universe_encounter'],
  ]) for (const target of entries) {
    const actual = resolveSimulationSelection({ kind, id: target.id });
    const shared = getPreySimulationModelReference(target, { kind, factions: PREY_FACTIONS });
    const record = getFidelityEntry(target.id, { category });
    assert.equal(actual.huntType, shared.huntType, target.id);
    assert.equal(actual.planetType, shared.planetType, target.id);
    assert.equal(record.trainingModel, actual.huntType, target.id);
    assert.equal(record.trainingBiome, actual.planetType, target.id);
    assert.equal(record.status, 'proxy');
    assert.equal(record.implementation.model.status, 'training_proxy');
    assert.equal(record.fidelityVerified, false);
    assert.equal(record.missing.includes('dedicated_subject_model'), !record.subjectModelMatched);
    assert.equal(record.dimensions.status, 'catalogue_estimate');
    checked++;
  }
  assert.equal(checked, 609);
  for (const context of [null, {}, { kind: 'unknown', id: CANON_PREY_CATALOG[0].id },
    { kind: 'prey', id: 'missing' }, { kind: 'crossover', id: '__proto__' }]) {
    assert.equal(resolveSimulationSelection(context), null);
  }
});

test('known dossiers and their documented aliases deploy the corresponding real subject, not another rival', () => {
  for (const [preyId, huntType] of Object.entries(DOCUMENTED_PREY_SUBJECT_MODELS)) {
    const prey = CANON_PREY_CATALOG.find(entry => entry.id === preyId);
    assert.ok(prey, preyId);
    const target = resolveSimulationSelection({ kind: 'prey', id: preyId });
    assert.equal(target.huntType, huntType, preyId);
    assert.equal(target.planetType, HUNT_DEFINITIONS[huntType].recommendedBiome ?? 'jungle', preyId);
    assert.equal(prey.matchedRuntimeSubjectId, huntType, preyId);
    assert.equal(prey.fidelityVerified, false);
  }
  for (const prey of CANON_PREY_CATALOG.filter(entry => entry.referencePreyId)) {
    const base = CANON_PREY_CATALOG.find(entry => entry.id === prey.referencePreyId);
    assert.ok(base, prey.id);
    assert.equal(getDocumentedPreySubjectModelId(prey), getDocumentedPreySubjectModelId(base));
    assert.equal(resolveSimulationSelection({ kind: 'prey', id: prey.id }).huntType,
      resolveSimulationSelection({ kind: 'prey', id: base.id }).huntType);
  }
  for (const id of ['prey_xeno_queen_mother', 'prey_queen_alien_charon', 'prey_feral_tracker_native']) {
    const prey = CANON_PREY_CATALOG.find(entry => entry.id === id);
    assert.equal(getDocumentedPreySubjectModelId(prey), null, 'related species or a misleading ID must not impersonate a named individual');
  }
  for (const id of ['__proto__', 'constructor', 'toString']) assert.equal(getDocumentedPreySubjectModelId({ id }), null);
  for (const id of ['prey_goliath_akumo', 'prey_kalisk_apex', 'prey_vydrach_prime', 'prey_rhynth_titan',
    'prey_vydrach_yautja_prime', 'prey_rhynth_ryushi']) {
    const prey = CANON_PREY_CATALOG.find(entry => entry.id === id);
    assert.equal(prey.faction, PREY_FACTIONS.FAUNA, 'a wild prey animal is not a Yautja hunter');
    assert.equal(prey.declaredFaction, PREY_FACTIONS.YAUTJA);
  }
});

test('source authority is not silently replaced by an unrelated shared mask or vague lore label', () => {
  const ahab = getFidelityEntry('ahab_comic', { category: 'armor' });
  assert.equal(ahab.resolvedDefaultMaskId, 'mask_elder_lost_tribe_1990');
  assert.deepEqual(ahab.source.sourceIds, ['dh_fire_life_death']);
  assert.ok(!ahab.source.sourceIds.includes('predator2'), 'a fallback mesh must not change the character reference');
  const rhynth = getFidelityEntry('rhynth_titan', { category: 'contract' });
  assert.equal(rhynth.source.locators[0].id, 'avpPreyOmnibus');
  for (const id of ['vydrach_prime', 'xeno_king']) {
    const entry = getFidelityEntry(id, { category: 'contract' });
    assert.ok(entry.source.unresolvedSourceIds.length > 0);
    assert.ok(entry.missing.includes('specific_reference_locator'));
    assert.equal(entry.fidelityVerified, false);
  }
  const boba = MULTIVERSE_CROSSOVER_PREY.find(entry => entry.id === 'crossover_mandalorian_boba');
  assert.equal(getPreyReferenceEvidence(boba).publicationVerified, false);
  assert.match(getPreySourceLabel(boba), /publication non vérifiée/);
  assert.equal(getPreyReferenceEvidence(undefined).declaredTitle, null);
});

test('the archive cannot supply physical crafting sources or become a certified replica through its source title', () => {
  const result = getFidelityCoverage();
  assert.equal(result.summary.verifiedReplicas, 0);
  assert.equal(result.summary.trainingDossiers, 609);
  assert.equal(result.summary.dedicatedRuntimeArchetypes, 46);
  assert.equal(result.summary.physicalCraftRecipes, 16);
  assert.equal(result.summary.archiveCraftRecipes, 34);
  for (const recipe of getFidelityCoverage({ category: 'craft_recipe' }).entries) {
    if (recipe.materialAvailability === 'archive_only') {
      assert.equal(recipe.status, 'missing');
      assert.deepEqual(recipe.physicalSources, []);
      assert.equal(recipe.implementation.reachable, false);
      assert.ok(recipe.missing.includes('physical_material_source'));
      assert.equal(recipe.preexistingLegacyCraftsRemainCompatible, true);
    }
  }
  assert.ok(result.entries.every(entry => entry.source.publicationVerified === false));
  assert.equal(getFidelityStatusLabel('verified'), 'Réplique vérifiée');
});

test('the live ship inventory follows the supplied hub rather than freezing the old 25-station layout', () => {
  const ship = { getZones: () => [{ id: 'new-deck', label: 'Nouveau pont' }],
    getStations: () => [{ id: 'new-terminal', label: 'Nouveau terminal', interactionType: 'navigation' },
      { id: 'new-contract', label: 'Contrat physique', interactionType: 'mission_contract', huntId: 'rhynth_titan' }] };
  const result = getFidelityCoverage({ ship });
  assert.equal(result.categories.ship_compartment, 1);
  assert.equal(result.categories.ship_station, 2);
  const terminal = getFidelityEntry('new-terminal', { category: 'ship_station', ship });
  assert.equal(terminal.inventorySource, 'live_hub');
  assert.equal(terminal.status, 'original');
  assert.equal(terminal.replicaApplicable, false);
  assert.equal(getFidelityEntry('mission-nexus', { category: 'ship_station', ship }), null);
});

test('inventory filters and namespace lookup do not mutate source catalogues or fabricate a completion percentage', () => {
  const all = getFidelityCoverage();
  assert.equal(new Set(all.entries.map(entry => entry.key)).size, all.entries.length);
  assert.equal(all.categories.weapon, 15);
  assert.equal(all.categories.gadget, 7);
  assert.equal(all.categories.mask, 38);
  assert.equal(all.categories.armor, 50);
  assert.equal(getFidelityEntry('goliath'), null, 'bare overlapping catalogue IDs need a category');
  assert.equal(getFidelityEntry('contract:goliath').id, 'goliath');
  const proxies = getFidelityCoverage({ status: 'proxy' });
  assert.equal(proxies.entries.length, 609);
  assert.ok(proxies.entries.every(entry => entry.status === 'proxy'));
  assert.throws(() => proxies.entries.push({}), TypeError);
  assert.throws(() => proxies.entries[0].source.sourceIds.push('invented'), TypeError);
  assert.ok(!Object.hasOwn(all.summary, 'fidelityPercentage'));
  assert.equal(getFidelityCoverage({ category: 'unknown' }).entries.length, 0);
});

test('the browser inventory has no dependency on a 3D renderer, geometry factory or filesystem', () => {
  const visited = new Set();
  const inspect = file => {
    if (visited.has(file)) return;
    visited.add(file);
    const ast = parseAst(readFileSync(file, 'utf8'));
    for (const node of ast.body) {
      if (!['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(node.type) || !node.source) continue;
      const specifier = node.source.value;
      assert.notEqual(specifier, 'three', file);
      assert.ok(!specifier.startsWith('three/') && !specifier.startsWith('node:'), file);
      if (specifier.startsWith('.')) inspect(resolve(dirname(file), specifier));
    }
  };
  inspect(resolve(root, 'src/data/FidelityCoverage.js'));
  assert.ok(![...visited].some(file => file.includes('/entities/') || file.includes('/world/')));
});
