import test from 'node:test';
import assert from 'node:assert/strict';
import { MULTIVERSE_CROSSOVER_PREY, PREY_SCALE_TIERS } from '../src/data/PreyTaxonomyAndCrossoverCatalog.js';
import { CROSSOVER_UNIVERSE_ENCOUNTERS, getEncountersForCrossover } from '../src/data/CrossoverUniverseEncounters.js';

test('Rencontres d\'univers : 60 univers x 5 gabarits cohérents avec leur taille', () => {
  assert.equal(CROSSOVER_UNIVERSE_ENCOUNTERS.length, 300);
  const ids = new Set(CROSSOVER_UNIVERSE_ENCOUNTERS.map((e) => e.id));
  assert.equal(ids.size, 300);
  const bounds = { GEANT: [5, Infinity], GRANDE: [2.5, 5], MOYEN: [1.5, 2.5], PETITE: [0.5, 1.5], MINUSCULE: [0, 0.5] };
  const parents = new Set(CROSSOVER_UNIVERSE_ENCOUNTERS.map((e) => e.parentId));
  assert.equal(parents.size, 60);
  for (const parentId of parents) {
    assert.ok(MULTIVERSE_CROSSOVER_PREY.some((c) => c.id === parentId));
    const scales = getEncountersForCrossover(parentId).map((e) => e.scale).sort();
    assert.deepEqual(scales, Object.keys(PREY_SCALE_TIERS).sort());
  }
  for (const e of CROSSOVER_UNIVERSE_ENCOUNTERS) {
    const [lo, hi] = bounds[e.scale];
    assert.ok(e.sizeMeters >= lo && e.sizeMeters < hi, e.id);
    assert.ok(e.weakpoints.length > 0 && e.trophy && e.honorReward > 0);
  }
  assert.ok(getEncountersForCrossover('crossover_terminator_t800').some((e) => /Hunter-Killer/.test(e.name)));
  assert.ok(getEncountersForCrossover('crossover_ghost_rider').some((e) => /Hellcycle/.test(e.name)));
  assert.ok(getEncountersForCrossover('crossover_master_chief').some((e) => /Jumeaux/.test(e.name)));
});
