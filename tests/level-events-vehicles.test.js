import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { HuntVehicle, YAUTJA_ENERGY_TEXTURE_PATH } from '../src/entities/HuntVehicle.js';
import { HUNT_CACHE_TYPES, HuntSupplyCache, LevelEventDirector } from '../src/gameplay/LevelEventDirector.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function makePlayer(position = new THREE.Vector3()) {
  return {
    position,
    health: 30,
    maxHealth: 100,
    energy: 20,
    maxEnergy: 100,
    stamina: 40,
    maxStamina: 100,
    honorScore: 1000,
    addHonor(amount) {
      this.honorScore += amount;
      return amount;
    },
  };
}

test('le calendrier avance au delta, reste figé en pause et conserve son ordre', () => {
  const director = new LevelEventDirector(new THREE.Scene(), { rng: () => 0.25 });
  const player = makePlayer();
  director.start({ huntId: 'goliath', biomeId: 'jungle' });

  assert.deepEqual(director.update(0, { player }), []);
  assert.equal(director.elapsed, 0);
  assert.deepEqual(director.update(2.9, { player }), []);
  assert.deepEqual(director.update(0, { player }), []);
  assert.equal(director.elapsed, 2.9);

  const first = director.update(0.1, { player });
  assert.deepEqual(first.map(({ type }) => type), ['flyby']);

  const next = director.update(25, { player });
  assert.deepEqual(next.map(({ type }) => type), [
    'spawn_enemy',
    'hazard',
    'spawn_cache',
    'hazard_end',
  ]);
  assert.equal(next.find(({ type }) => type === 'spawn_enemy').enemyType, 'hound');
  assert.deepEqual(director.drainSignals().map(({ type }) => type), [
    'flyby',
    'spawn_enemy',
    'hazard',
    'spawn_cache',
    'hazard_end',
  ]);
  assert.deepEqual(director.drainSignals(), []);
  director.dispose();
});

test('le biome choisit hound, xeno ou humain et le plafond bloque les renforts', () => {
  for (const [biomeId, expected] of [
    ['jungle', 'hound'],
    ['hive_lv426', 'xeno'],
    ['ryushi_desert', 'human'],
  ]) {
    const director = new LevelEventDirector(new THREE.Scene(), {
      rng: () => 0.5,
      maxEnemySpawns: 1,
    });
    director.start({ huntId: 'goliath', biomeId });
    const signals = director.update(60, { player: makePlayer() });
    const enemySignals = signals.filter(({ type }) => type === 'spawn_enemy');
    assert.equal(enemySignals.length, 1, `${biomeId}: plafond de spawn`);
    assert.equal(enemySignals[0].enemyType, expected, biomeId);
    director.dispose();
  }
});

test('le conteneur soigne, recharge et accorde son honneur une seule fois à proximité', () => {
  const scene = new THREE.Scene();
  const cache = new HuntSupplyCache(scene, { position: new THREE.Vector3(4, 0, 0) });
  const player = makePlayer(new THREE.Vector3(0, 0, 0));

  const result = cache.tryInteract(player);
  assert.equal(result.type, 'cache_opened');
  assert.equal(result.healthRestored, 35);
  assert.equal(result.energyRestored, 50);
  assert.equal(result.honorAwarded, 120);
  assert.equal(player.health, 65);
  assert.equal(player.energy, 70);
  assert.equal(player.honorScore, 1120);
  assert.equal(cache.tryInteract(player), false);
  assert.equal(player.honorScore, 1120);
  assert.ok(cache.lidPivot.rotation.x < 0);
  assert.equal(cache.dispose(), true);
  assert.equal(cache.dispose(), false);
});

test('les variantes de conteneur ont des récompenses distinctes et suivent le biome', () => {
  const seenRewardProfiles = new Set();
  for (const [cacheType, expected] of Object.entries(HUNT_CACHE_TYPES)) {
    const scene = new THREE.Scene();
    const cache = new HuntSupplyCache(scene, { cacheType });
    const player = makePlayer();
    const result = cache.tryInteract(player);
    assert.equal(result.cacheType, cacheType);
    assert.equal(result.healthRestored, Math.min(expected.health, 70));
    assert.equal(result.energyRestored, Math.min(expected.energy, 80));
    assert.equal(result.honorAwarded, expected.honor);
    assert.equal(cache.mesh.userData.cacheType, cacheType);
    seenRewardProfiles.add(`${expected.health}:${expected.energy}:${expected.honor}`);
    cache.dispose();
  }
  assert.equal(seenRewardProfiles.size, Object.keys(HUNT_CACHE_TYPES).length);
  const director = new LevelEventDirector(new THREE.Scene());
  for (const [biomeId, expected] of [
    ['jungle', 'balanced'], ['hive_lv426', 'medicomp'],
    ['ryushi_desert', 'energy_cell'], ['yautja_prime', 'trophy_reliquary'],
    ['stargazer_blacksite', 'stargazer_salvage'],
  ]) {
    director.start({ biomeId });
    assert.equal(director.selectCacheType(), expected, biomeId);
  }
  director.dispose();
});

test('la navette exécute ses états, puis fournit recharge et impulsion de scan une fois', () => {
  const scene = new THREE.Scene();
  const point = new THREE.Vector3(0, 0, 0);
  const vehicle = new HuntVehicle(scene, {
    state: 'hover',
    hoverPoint: point,
    entryPoint: point,
    flybyStart: point,
    exitPoint: new THREE.Vector3(20, 10, 20),
    durations: { entering: 0.25, flyby: 0.25, hover: 1, leaving: 0.25 },
    interactionDistance: 8,
  });
  const player = makePlayer(point.clone());

  const interaction = vehicle.interact(player);
  assert.equal(interaction.type, 'vehicle_scan');
  assert.equal(player.energy, 65);
  assert.equal(player.stamina, 70);
  assert.equal(player.scanPulseTimer, 6);
  assert.equal(player.scanPulseRadius, 85);
  assert.equal(vehicle.interact(player), false);
  assert.equal(YAUTJA_ENERGY_TEXTURE_PATH, '/assets/textures/yautja-energy-lattice.webp');

  vehicle.update(1);
  assert.equal(vehicle.state, 'leaving');
  vehicle.update(0.25);
  assert.equal(vehicle.state, 'disposed');
  assert.equal(vehicle.dispose(), false);
  assert.equal(vehicle.mesh.userData.disposeComplete, true);
});

test('stop et dispose nettoient véhicules/conteneurs de façon idempotente sans minuterie murale', () => {
  const scene = new THREE.Scene();
  const director = new LevelEventDirector(scene, { rng: () => 0.4 });
  director.start({ huntId: 'predalien', biomeId: 'hive_lv426' });
  director.update(22, { player: makePlayer() });
  assert.equal(director.vehicles.length, 1);
  assert.equal(director.containers.length, 1);

  assert.equal(director.stop(), true);
  assert.equal(director.stop(), false);
  assert.deepEqual(director.vehicles, []);
  assert.deepEqual(director.containers, []);
  assert.equal(director.dispose(), true);
  assert.equal(director.dispose(), false);
  assert.equal(scene.children.includes(director.root), false);

  for (const relativePath of [
    'src/entities/HuntVehicle.js',
    'src/gameplay/LevelEventDirector.js',
  ]) {
    const source = readFileSync(join(ROOT, relativePath), 'utf8');
    assert.equal(source.includes('setTimeout('), false, `${relativePath} doit suivre le delta de simulation`);
  }
});
