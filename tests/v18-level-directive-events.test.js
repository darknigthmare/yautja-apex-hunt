import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { getDirectiveSchedule } from '../src/gameplay/HuntDirectiveSystem.js';
import { LevelEventDirector } from '../src/gameplay/LevelEventDirector.js';

const makePlayer = () => ({ position: new THREE.Vector3() });

test('le planning historique et les vagues de directive fusionnent sans mutation ni double émission', () => {
  const sourceSchedule = getDirectiveSchedule('jungle_fireteam');
  const sourceSnapshot = sourceSchedule.map((entry) => ({
    ...entry,
    enemyTypes: [...entry.enemyTypes],
  }));
  const safeSpawnCalls = [];
  const environment = {
    getEventNode(kind, ordinal) {
      if (kind === 'encounter') {
        return {
          id: `encounter-${ordinal + 1}`,
          eventType: 'encounter',
          position: [40 + ordinal * 10, 0, -20 - ordinal * 5],
        };
      }
      // Simule le fallback historique d'Environment : ce nœud incompatible
      // doit être refusé avant d'essayer le véritable nœud encounter.
      return {
        id: 'wrong-migration-node',
        eventType: 'prey_migration',
        position: [999, 0, 999],
      };
    },
    getSafeSpawnPosition(preferred, options) {
      safeSpawnCalls.push({ preferred: preferred.clone(), options: { ...options } });
      return new THREE.Vector3(preferred.x, 6.5, preferred.z);
    },
  };
  const director = new LevelEventDirector(new THREE.Scene(), {
    maxEnemySpawns: 0,
    maxVehicles: 0,
    maxCaches: 0,
    schedule: [
      { at: 3, kind: 'hazard' },
      { at: 12, kind: 'hazard_end' },
    ],
  });

  director.start({
    huntId: 'goliath',
    biomeId: 'jungle',
    directiveId: 'jungle_fireteam',
  });
  const signals = director.update(100, { player: makePlayer(), environment });
  const waves = signals.filter(({ type }) => type === 'spawn_enemy_group');

  assert.deepEqual(signals.map(({ type }) => type), [
    'hazard',
    'spawn_enemy_group',
    'hazard_end',
    'spawn_enemy_group',
    'spawn_enemy_group',
  ]);
  assert.deepEqual(waves.map(({ enemyTypes }) => enemyTypes), [
    ['jungle_scout'],
    ['jungle_gunner'],
    ['jungle_trapper'],
  ]);
  assert.deepEqual(waves.map(({ id }) => id), [
    'jungle_fireteam-wave-1',
    'jungle_fireteam-wave-2',
    'jungle_fireteam-wave-3',
  ]);
  assert.ok(waves.every(({ directiveId }) => directiveId === 'jungle_fireteam'));
  assert.ok(waves.every(({ label }) => typeof label === 'string' && label.length > 0));
  assert.ok(waves.every(({ position }) => position.y === 6.5));
  assert.ok(waves.every(({ position }) => position.x !== 999 && position.z !== 999));
  assert.deepEqual(safeSpawnCalls.map(({ options }) => options.clearance), [5, 5, 5]);
  assert.deepEqual(sourceSchedule, sourceSnapshot, 'le planning gelé du catalogue reste intact');
  assert.deepEqual(director.update(100, { player: makePlayer(), environment }), []);

  director.start({ directiveId: 'standard_hunt' });
  const standardSignals = director.update(100, { player: makePlayer(), environment });
  assert.equal(standardSignals.some(({ type }) => type === 'spawn_enemy_group'), false);
  director.dispose();
});

test('un type de nœud absent utilise une position générique sûre et jamais un nœud incompatible', () => {
  const environment = {
    getEventNode() {
      return {
        id: 'incompatible-node',
        eventType: 'prey_migration',
        position: [777, 0, 777],
      };
    },
    getEventNodes() {
      return [{
        id: 'still-incompatible',
        eventType: 'territory_clash',
        position: [888, 0, 888],
      }];
    },
    getSafeSpawnPosition(preferred) {
      return new THREE.Vector3(preferred.x, 4, preferred.z);
    },
  };
  const director = new LevelEventDirector(new THREE.Scene(), {
    rng: () => 0,
    maxEnemySpawns: 0,
    maxVehicles: 0,
    maxCaches: 0,
    schedule: [{ at: 1, kind: 'localized_event' }],
  });
  director.start();

  const [signal] = director.update(1, { player: makePlayer(), environment });
  assert.equal(signal.type, 'localized_event');
  assert.equal(signal.sourceId, 'localized-event-1');
  assert.deepEqual(signal.position, { x: 46, y: 4, z: 0 });
  director.dispose();
});

test('une directive sans types explicites ne crée rien et un boss mort gèle le calendrier', () => {
  const director = new LevelEventDirector(new THREE.Scene(), {
    maxEnemySpawns: 0,
    maxVehicles: 0,
    maxCaches: 0,
    schedule: [
      { at: 1, type: 'directive_wave', enemyTypes: [] },
      { at: 2, kind: 'hazard' },
    ],
  });
  director.start({ directiveId: 'standard_hunt' });

  assert.deepEqual(
    director.update(10, { player: makePlayer(), boss: { isDead: true } }),
    [],
  );
  assert.equal(director.elapsed, 0);
  const aliveSignals = director.update(10, { player: makePlayer(), boss: { isDead: false } });
  assert.deepEqual(aliveSignals.map(({ type }) => type), ['hazard']);
  assert.equal(aliveSignals.some(({ type }) => type === 'spawn_enemy_group'), false);

  director.stop();
  assert.equal(director.directiveId, null);
  director.dispose();
});
