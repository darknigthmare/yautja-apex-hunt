import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { LevelEventDirector } from '../src/gameplay/LevelEventDirector.js';

function makePlayer(position = new THREE.Vector3()) {
  return { position };
}

function makeFakeEnvironment() {
  const calls = [];
  const socketCalls = [];
  const sockets = {
    flyby: [new THREE.Vector3(20, 0, 4), new THREE.Vector3(-24, 0, 8)],
    reinforcement: [
      new THREE.Vector3(42, 0, 0),
      new THREE.Vector3(0, 0, 46),
      new THREE.Vector3(-48, 0, 0),
      new THREE.Vector3(0, 0, -50),
    ],
    cache: [new THREE.Vector3(13, 0, 0), new THREE.Vector3(-14, 0, 2)],
  };
  const environment = {
    calls,
    socketCalls,
    obstacleColliders: [
      { x: 22, z: 4, radius: 5, baseY: 3, height: 29 },
      { x: -120, z: -120, radius: 9, baseY: 0, height: 80 },
    ],
    sampleHeight(positionOrX, zValue) {
      const x = positionOrX?.isVector3 ? positionOrX.x : Number(positionOrX) || 0;
      const z = positionOrX?.isVector3 ? positionOrX.z : Number(zValue) || 0;
      return 3 + x * 0.01 - z * 0.005;
    },
    getEncounterSockets(kind, count) {
      socketCalls.push({ kind, count });
      return (sockets[kind] ?? []).map((position) => position.clone());
    },
    getSafeSpawnPosition(preferred, options) {
      calls.push({ preferred: preferred.clone(), options: { ...options } });
      const safe = preferred.clone();
      safe.y = this.sampleHeight(safe);
      return safe;
    },
  };
  return environment;
}

test('renfort, cache et navette utilisent les sockets puis le solveur de spawn sûr', () => {
  const environment = makeFakeEnvironment();
  const director = new LevelEventDirector(new THREE.Scene(), { rng: () => 0 });
  const player = makePlayer(new THREE.Vector3());
  director.start({ huntId: 'goliath', biomeId: 'jungle' });

  const signals = director.update(22, { player, environment });
  const flyby = signals.find(({ type }) => type === 'flyby');
  const enemy = signals.find(({ type }) => type === 'spawn_enemy');
  const cache = signals.find(({ type }) => type === 'spawn_cache');

  assert.deepEqual(environment.socketCalls.map(({ kind }) => kind), [
    'flyby',
    'reinforcement',
    'cache',
  ]);
  assert.deepEqual(environment.calls.map(({ options }) => options.clearance), [13, 5, 6]);
  assert.equal(enemy.position.y, environment.sampleHeight(enemy.position.x, enemy.position.z));
  assert.equal(cache.position.y, environment.sampleHeight(cache.position.x, cache.position.z));
  assert.equal(cache.cache.mesh.position.y, cache.position.y);
  assert.ok(Math.hypot(cache.position.x, cache.position.z) >= 10);

  const nearbyColliderTop = environment.obstacleColliders[0].baseY
    + environment.obstacleColliders[0].height;
  assert.ok(flyby.hoverPoint.y >= 18);
  assert.ok(flyby.hoverPoint.y >= nearbyColliderTop + 10);
  assert.deepEqual(flyby.vehicle.hoverPoint.toArray(), [
    flyby.hoverPoint.x,
    flyby.hoverPoint.y,
    flyby.hoverPoint.z,
  ]);
  assert.ok(flyby.entryPoint.y > flyby.hoverPoint.y);
  assert.ok(flyby.exitPoint.y > flyby.hoverPoint.y);
  assert.equal(flyby.vehicle.interactionDistance, 34);
  director.dispose();
});

test('sans sockets, le cache vise 10 à 16 m et conserve la hauteur rendue sûre', () => {
  const calls = [];
  const environment = {
    obstacleColliders: [],
    getSafeSpawnPosition(preferred, options) {
      calls.push({ preferred: preferred.clone(), options: { ...options } });
      return new THREE.Vector3(preferred.x, 6.25, preferred.z);
    },
  };
  const director = new LevelEventDirector(new THREE.Scene(), {
    rng: () => 0,
    maxVehicles: 0,
    maxEnemySpawns: 0,
  });
  const player = makePlayer(new THREE.Vector3(5, 2, -3));
  director.start({ huntId: 'goliath', biomeId: 'jungle' });

  const signal = director.update(22, { player, environment })
    .find(({ type }) => type === 'spawn_cache');
  const distance = Math.hypot(signal.position.x - player.position.x, signal.position.z - player.position.z);

  assert.ok(distance >= 10 && distance <= 16);
  assert.equal(signal.position.y, 6.25);
  assert.equal(signal.cache.mesh.position.y, 6.25);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.clearance, 6);
  director.dispose();
});
