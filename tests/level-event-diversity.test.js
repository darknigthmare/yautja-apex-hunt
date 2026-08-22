import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { LevelEventDirector } from '../src/gameplay/LevelEventDirector.js';
import { getYautjaContentById } from '../src/data/YautjaContentCatalog.js';

function typesFor({ huntId, biomeId }) {
  const director = new LevelEventDirector(new THREE.Scene(), { rng: () => 0.5 });
  director.start({ huntId, biomeId });
  const signals = director.update(70, { player: { position: new THREE.Vector3() } });
  const types = signals.filter(({ type }) => type === 'spawn_enemy').map(({ enemyType }) => enemyType);
  director.dispose();
  return types;
}

test('Genna alterne faune locale, grizzly et traqueur technologique', () => {
  assert.deepEqual(typesFor({ huntId: 'feral_predator', biomeId: 'genna_deathworld' }), [
    'genna_stalker',
    'grizzly',
    'thermal_trapper',
    'synthetic',
  ]);
});

test('jungle et ruche renouvellent leurs vagues sans perdre leur identité', () => {
  assert.deepEqual(typesFor({ huntId: 'goliath', biomeId: 'jungle' }), [
    'hound',
    'thermal_trapper',
    'grizzly',
    'hound',
  ]);
  assert.deepEqual(typesFor({ huntId: 'xeno_queen', biomeId: 'hive_lv426' }), [
    'xeno',
    'xeno',
    'xeno_warrior',
    'xeno_warrior',
  ]);
});

test('chaque vague Genna référence une entrée réelle du Codex', () => {
  const director = new LevelEventDirector(new THREE.Scene(), { rng: () => 0.5 });
  director.start({ huntId: 'feral_predator', biomeId: 'genna_deathworld' });
  const spawns = director
    .update(70, { player: { position: new THREE.Vector3() } })
    .filter(({ type }) => type === 'spawn_enemy');

  assert.equal(spawns.length, 4);
  for (const signal of spawns) {
    assert.ok(getYautjaContentById(signal.archetypeId), `${signal.archetypeId} doit exister dans le Codex`);
  }
  assert.equal(spawns.at(-1).enemyType, 'synthetic');
  assert.equal(spawns.at(-1).archetypeId, 'enemy_combat_synthetic_badlands');
  director.dispose();
});
