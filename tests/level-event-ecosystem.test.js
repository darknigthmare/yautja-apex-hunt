import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  DEFAULT_LEVEL_EVENT_SCHEDULE,
  LevelEventDirector,
} from '../src/gameplay/LevelEventDirector.js';

const makePlayer = () => ({ position: new THREE.Vector3(0, 0, 0) });

test('le planning vivant prolonge la chasse jusqu à 190 s sans multiplier les renforts', () => {
  assert.equal(DEFAULT_LEVEL_EVENT_SCHEDULE.at(-1).at, 190);
  for (const kind of [
    'localized_event',
    'prey_migration',
    'territory_clash',
    'boss_migration',
  ]) {
    assert.ok(DEFAULT_LEVEL_EVENT_SCHEDULE.some((event) => event.kind === kind), kind);
  }
  assert.equal(
    DEFAULT_LEVEL_EVENT_SCHEDULE.filter(({ kind }) => kind === 'spawn_enemy').length,
    4,
    'aucun renfort ne doit être ajouté à la seconde moitié de la chasse',
  );
});

test('les nœuds dédiés répartissent les événements et limitent les renforts dynamiques', () => {
  const calls = [];
  const nodes = {
    localized_hazard: [
      { id: 'hazard-a', label: 'Floraison acide', eventType: 'localized_hazard', position: [100, 0, 10], radius: 22, duration: 24, damage: 7, status: 'corrosion' },
      { id: 'hazard-b', label: 'Rupture minérale', eventType: 'localized_hazard', position: [110, 0, 20], radius: 18, duration: 15, damage: 9, status: 'impact' },
    ],
    prey_migration: [
      { id: 'prey-a', label: 'Troupeau nord', eventType: 'prey_migration', position: [200, 0, 10], creatureType: 'genna_grazer', creatureCount: 3 },
      { id: 'prey-b', label: 'Troupeau sud', eventType: 'prey_migration', position: [210, 0, 20], creatureType: 'genna_grazer', creatureCount: 2 },
    ],
    territory_clash: [
      { id: 'clash-a', label: 'Conflit du ravin', eventType: 'territory_clash', position: [300, 0, 10], radius: 75 },
    ],
    boss_trail: [
      { id: 'boss-a', label: 'Mue de l Apex', eventType: 'boss_trail', position: [400, 0, 10], duration: 14 },
    ],
  };
  const environment = {
    getEventNode(kind, ordinal) {
      calls.push([kind, ordinal]);
      const pool = nodes[kind] ?? [];
      return pool.length > 0 ? pool[ordinal % pool.length] : null;
    },
    getSafeSpawnPosition(preferred) {
      return preferred.clone();
    },
    sampleHeight() {
      return 2;
    },
  };
  const director = new LevelEventDirector(new THREE.Scene(), { rng: () => 0.25 });
  director.start({ huntId: 'kalisk', biomeId: 'genna_deathworld' });
  const signals = director.update(190, { player: makePlayer(), environment });
  const ecosystemSignals = signals.filter(({ type }) => [
    'localized_event',
    'prey_migration',
    'territory_clash',
    'boss_migration',
  ].includes(type));

  assert.equal(signals.filter(({ type }) => type === 'spawn_enemy').length, 3);
  assert.deepEqual(ecosystemSignals.map(({ type }) => type), [
    'localized_event',
    'prey_migration',
    'territory_clash',
    'localized_event',
    'boss_migration',
    'prey_migration',
  ]);
  assert.deepEqual(
    ecosystemSignals.map(({ sourceId }) => sourceId),
    ['hazard-a', 'prey-a', 'clash-a', 'hazard-b', 'boss-a', 'prey-b'],
  );
  assert.deepEqual(
    ecosystemSignals.map(({ position }) => position),
    [
      { x: 100, y: 2, z: 10 },
      { x: 200, y: 2, z: 10 },
      { x: 300, y: 2, z: 10 },
      { x: 110, y: 2, z: 20 },
      { x: 400, y: 2, z: 10 },
      { x: 210, y: 2, z: 20 },
    ],
  );
  assert.equal(ecosystemSignals[0].status, 'corrosion');
  assert.equal(ecosystemSignals[1].creatureCount, 3);
  assert.deepEqual(ecosystemSignals[2].factions, ['genna_grazer', 'genna_stalker']);
  assert.equal(ecosystemSignals[4].bossId, 'kalisk');
  assert.doesNotThrow(() => JSON.stringify(ecosystemSignals));
  assert.ok(calls.some(([kind]) => kind === 'localized_hazard'));
  assert.ok(calls.some(([kind]) => kind === 'boss_trail'));
  director.dispose();
});

test('getEventNodes et les environnements hérités restent compatibles', () => {
  const nodeList = [
    { id: 'migration-list', eventType: 'prey_migration', position: [32, 0, -12], creatureType: 'xeno_runner', creatureCount: 2 },
    { id: 'clash-list', eventType: 'territory_clash', position: [-48, 0, 25], radius: 66 },
  ];
  const environment = {
    getEventNodes() {
      return nodeList;
    },
  };
  const listedDirector = new LevelEventDirector(new THREE.Scene(), {
    maxEnemySpawns: 0,
    maxVehicles: 0,
    maxCaches: 0,
    schedule: [
      { at: 1, kind: 'prey_migration' },
      { at: 2, kind: 'territory_clash' },
    ],
  });
  listedDirector.start({ biomeId: 'hive_lv426' });
  const listed = listedDirector.update(2, { player: makePlayer(), environment });
  assert.deepEqual(listed.map(({ sourceId }) => sourceId), ['migration-list', 'clash-list']);
  listedDirector.dispose();

  const legacyDirector = new LevelEventDirector(new THREE.Scene(), {
    maxEnemySpawns: 0,
    maxVehicles: 0,
    maxCaches: 0,
    schedule: [
      { at: 1, kind: 'localized_event' },
      { at: 2, kind: 'prey_migration' },
      { at: 3, kind: 'territory_clash' },
      { at: 4, kind: 'boss_migration' },
    ],
  });
  legacyDirector.start({ huntId: 'goliath', biomeId: 'jungle' });
  const legacy = legacyDirector.update(4, { player: makePlayer(), environment: {} });
  assert.deepEqual(legacy.map(({ type }) => type), [
    'localized_event',
    'prey_migration',
    'territory_clash',
    'boss_migration',
  ]);
  assert.ok(legacy.every(({ position }) => (
    Number.isFinite(position.x)
    && Number.isFinite(position.y)
    && Number.isFinite(position.z)
  )));
  legacyDirector.dispose();
});
