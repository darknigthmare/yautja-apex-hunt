import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { HuntVehicle } from '../src/entities/HuntVehicle.js';
import { HUNT_CACHE_TYPES, HuntSupplyCache, LevelEventDirector } from '../src/gameplay/LevelEventDirector.js';

function makePlayer(position = new THREE.Vector3()) {
  return {
    position,
    health: 30,
    maxHealth: 100,
    energy: 20,
    maxEnergy: 100,
    stamina: 25,
    maxStamina: 100,
    honorScore: 0,
    addHonor(value) { this.honorScore += value; return value; },
  };
}

test('Stargazer sélectionne l’appareil du Fugitive et un conteneur de récupération distinct', () => {
  const director = new LevelEventDirector(new THREE.Scene());
  director.start({ huntId: 'upgrade_predator', biomeId: 'stargazer_blacksite' });
  assert.equal(director.selectVehicleType(), 'fugitive_escape_craft');
  assert.equal(director.selectCacheType(), 'stargazer_salvage');
  assert.deepEqual(
    HUNT_CACHE_TYPES.stargazer_salvage,
    { health: 28, energy: 65, honor: 180, shell: 0x343e44, edge: 0x8aa6ad, energyColor: 0xff8c58, emissive: 0x9b3014 },
  );
  director.dispose();
});

test('l’appareil du Fugitive possède une silhouette endommagée et un scan amélioré', () => {
  const scene = new THREE.Scene();
  const point = new THREE.Vector3(0, 0, 0);
  const craft = new HuntVehicle(scene, {
    type: 'fugitive_escape_craft',
    state: 'hover',
    hoverPoint: point,
    entryPoint: point,
    flybyStart: point,
    interactionDistance: 10,
  });
  const player = makePlayer(point.clone());

  assert.equal(craft.mesh.userData.vehicleProfile, 'damaged_fugitive_escape');
  assert.ok(craft.mesh.getObjectByName('fugitiveDistressBeacon'));
  const result = craft.interact(player);
  assert.equal(result.vehicleType, 'fugitive_escape_craft');
  assert.equal(result.scanDuration, 8);
  assert.equal(result.scanRadius, 110);
  assert.equal(player.energy, 80);
  assert.equal(player.stamina, 63);
  assert.equal(player.scanPulseRadius, 110);
  craft.dispose();
});

test('le conteneur Stargazer rend des ressources et de l’honneur une seule fois', () => {
  const scene = new THREE.Scene();
  const cache = new HuntSupplyCache(scene, { cacheType: 'stargazer_salvage', position: new THREE.Vector3() });
  const player = makePlayer();
  const result = cache.tryInteract(player);

  assert.equal(result.cacheType, 'stargazer_salvage');
  assert.equal(result.healthRestored, 28);
  assert.equal(result.energyRestored, 65);
  assert.equal(result.honorAwarded, 180);
  assert.equal(cache.tryInteract(player), false);
  cache.dispose();
});
