import assert from 'node:assert/strict';
import test from 'node:test';
import { BIOME_DEFINITIONS, HUNT_DEFINITIONS } from '../src/data/GameConfig.js';
import { CURRENT_HUNTS, HUNT_LOCATIONS } from '../src/data/LoreCodex.js';

const sorted = (values) => [...values].sort();

test('chaque contrat jouable possède exactement une fiche de chasse dans le Codex', () => {
  const runtimeIds = Object.keys(HUNT_DEFINITIONS);
  const codexIds = CURRENT_HUNTS.map(({ id }) => id);

  assert.deepEqual(sorted(codexIds), sorted(runtimeIds));
  assert.equal(new Set(codexIds).size, codexIds.length, 'une chasse est dupliquée dans le Codex');
  for (const [id, definition] of Object.entries(HUNT_DEFINITIONS)) {
    assert.equal(definition.id, id, `${id}: la clé et l’identifiant runtime divergent`);
  }
});

test('chaque biome jouable possède exactement une fiche de lieu dans le Codex', () => {
  const runtimeIds = Object.keys(BIOME_DEFINITIONS);
  const codexIds = HUNT_LOCATIONS.map(({ id }) => id);

  assert.deepEqual(sorted(codexIds), sorted(runtimeIds));
  assert.equal(new Set(codexIds).size, codexIds.length, 'un lieu est dupliqué dans le Codex');
});
