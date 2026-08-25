import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { LevelEventDirector } from '../src/gameplay/LevelEventDirector.js';
import { Environment } from '../src/world/Environment.js';

const BIOME_ID = 'los_angeles_1997';
const makePlayer = () => ({ position: new THREE.Vector3() });

function expectedSafePosition(environment, node, clearance) {
  const position = environment.getSafeSpawnPosition(node.position.clone(), { clearance });
  position.y = environment.sampleHeight(position);
  return { x: position.x, y: position.y, z: position.z };
}

test('les trois hazards LA sont planifiés, résolus puis matérialisables sur leurs nœuds', () => {
  const scene = new THREE.Scene();
  const environment = new Environment(scene);
  assert.equal(environment.setBiome(BIOME_ID), true);

  const nodes = environment.getEventNodes();
  const localizedNodes = nodes.filter(({ eventType }) => eventType === 'localized_hazard');
  assert.deepEqual(localizedNodes.map(({ id }) => id), [
    'la-subway-blackout',
    'la-cold-trap',
    'la-lightning-grid',
  ]);
  const expectedPositions = Object.fromEntries(localizedNodes.map((node) => [
    node.id,
    expectedSafePosition(environment, node, 7),
  ]));

  const director = new LevelEventDirector(scene, {
    rng: () => 0.25,
    maxEnemySpawns: 0,
    maxVehicles: 0,
  });
  director.start({ huntId: 'city_hunter', biomeId: BIOME_ID });
  const signals = director.update(190, { player: makePlayer(), environment });
  const localizedSignals = signals.filter(({ type }) => type === 'localized_event');

  assert.deepEqual(localizedSignals.map(({ sourceId }) => sourceId), localizedNodes.map(({ id }) => id));
  assert.deepEqual(localizedSignals.map(({ position }) => position), localizedNodes.map(({ id }) => expectedPositions[id]));
  assert.deepEqual(localizedSignals.map(({ status }) => status), ['energy_jam', 'snare', 'energy_jam']);
  assert.deepEqual(localizedSignals.map(({ ordinal }) => ordinal), [1, 2, 3]);

  const materialized = localizedSignals.map((signal) => environment.startLocalizedEvent({
    ...signal,
    id: signal.sourceId,
  }));
  assert.deepEqual(materialized.map(({ id }) => id), localizedNodes.map(({ id }) => id));
  assert.ok(materialized.every((hazard) => hazard.dynamic === true && hazard.mesh.parent === environment.biomeGroup));
  assert.deepEqual(environment.dynamicEventZones.slice(-3).map(({ id }) => id), localizedNodes.map(({ id }) => id));

  director.dispose();
});

test('spawn_cache consomme le cache_drop LA et conserve son identité et sa position sûre', () => {
  const scene = new THREE.Scene();
  const environment = new Environment(scene);
  assert.equal(environment.setBiome(BIOME_ID), true);
  const cacheNode = environment.getEventNode('cache_drop', 0);
  assert.equal(cacheNode.id, 'la-owlf-cache');
  const expectedPosition = expectedSafePosition(environment, cacheNode, 6);

  const director = new LevelEventDirector(scene, {
    rng: () => 0.25,
    maxEnemySpawns: 0,
    maxVehicles: 0,
    schedule: [{ at: 1, kind: 'spawn_cache' }],
  });
  director.start({ huntId: 'city_hunter', biomeId: BIOME_ID });
  const [signal] = director.update(1, { player: makePlayer(), environment });

  assert.equal(signal.type, 'spawn_cache');
  assert.equal(signal.sourceId, 'la-owlf-cache');
  assert.equal(signal.cache.id, 'la-owlf-cache');
  assert.equal(signal.cache.mesh.name, 'la-owlf-cache');
  assert.equal(signal.label, cacheNode.label);
  assert.deepEqual(signal.position, expectedPosition);
  assert.deepEqual(signal.cache.mesh.position.toArray(), [
    expectedPosition.x,
    expectedPosition.y,
    expectedPosition.z,
  ]);

  director.dispose();
});
