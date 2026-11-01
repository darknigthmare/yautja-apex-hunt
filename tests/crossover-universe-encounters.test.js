import test from 'node:test';
import assert from 'node:assert/strict';
import { MULTIVERSE_CROSSOVER_PREY, PREY_SCALE_TIERS } from '../src/data/PreyTaxonomyAndCrossoverCatalog.js';
import { CROSSOVER_UNIVERSE_ENCOUNTERS, getEncountersForCrossover } from '../src/data/CrossoverUniverseEncounters.js';

test('Rencontres d\'univers : 60 univers x 5 paliers, avec gabarit physique cohérent', () => {
  assert.equal(CROSSOVER_UNIVERSE_ENCOUNTERS.length, 300);
  const ids = new Set(CROSSOVER_UNIVERSE_ENCOUNTERS.map((e) => e.id));
  assert.equal(ids.size, 300);
  const parents = new Set(CROSSOVER_UNIVERSE_ENCOUNTERS.map((e) => e.parentId));
  assert.equal(parents.size, 60);
  for (const parentId of parents) {
    assert.ok(MULTIVERSE_CROSSOVER_PREY.some((c) => c.id === parentId));
    // Difficulty may offer five encounters without resizing a named character
    // merely to fill five physical categories.
    const tiers = getEncountersForCrossover(parentId).map((e) => e.encounterTier).sort();
    assert.deepEqual(tiers, Object.keys(PREY_SCALE_TIERS).sort());
  }
  for (const e of CROSSOVER_UNIVERSE_ENCOUNTERS) {
    const { minMeters, maxMeters } = PREY_SCALE_TIERS[e.scale];
    assert.ok(e.sizeMeters >= minMeters && e.sizeMeters < maxMeters, e.id);
    assert.ok(e.weakpoints.length > 0 && e.trophy && e.honorReward > 0);
  }
  assert.ok(getEncountersForCrossover('crossover_terminator_t800').some((e) => /Hunter-Killer/.test(e.name)));
  assert.ok(getEncountersForCrossover('crossover_ghost_rider').some((e) => /Hellcycle/.test(e.name)));
  assert.ok(getEncountersForCrossover('crossover_master_chief').some((e) => /Jumeaux/.test(e.name)));
});
