import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { HuntVehicle } from '../src/entities/HuntVehicle.js';
import { HuntSupplyCache, LevelEventDirector } from '../src/gameplay/LevelEventDirector.js';

const BASE_VEHICLE_YAW = Math.PI * 0.08;

function makePlayer(position = new THREE.Vector3()) {
  return {
    position,
    health: 40,
    maxHealth: 100,
    energy: 30,
    maxEnergy: 100,
    stamina: 45,
    maxStamina: 100,
    honorScore: 0,
    addHonor(amount) {
      this.honorScore += amount;
      return amount;
    },
  };
}

function makeHoverVehicle(scene = new THREE.Scene(), reducedMotion = false) {
  return new HuntVehicle(scene, {
    state: 'hover',
    hoverPoint: new THREE.Vector3(8, 20, -6),
    exitPoint: new THREE.Vector3(70, 55, 80),
    durations: { hover: 2, leaving: 0.5 },
    reducedMotion,
  });
}

test('la navette neutralise seulement flottement, roulis et émission animée en mouvement réduit', () => {
  const normal = makeHoverVehicle();
  normal.update(0.5, { reducedMotion: false });
  assert.notEqual(normal.mesh.position.y, normal.hoverPoint.y);
  assert.notEqual(normal.mesh.rotation.y, BASE_VEHICLE_YAW);
  assert.notEqual(normal.mesh.rotation.z, 0);
  assert.notEqual(normal.energyMaterial.emissiveIntensity, 2.15);

  const reduced = makeHoverVehicle(new THREE.Scene(), true);
  reduced.update(0.5, { reducedMotion: true });
  assert.equal(reduced.mesh.visible, true);
  assert.deepEqual(reduced.mesh.position.toArray(), reduced.hoverPoint.toArray());
  assert.equal(reduced.mesh.rotation.y, BASE_VEHICLE_YAW);
  assert.equal(reduced.mesh.rotation.z, 0);
  assert.equal(reduced.energyMaterial.emissiveIntensity, 2.15);

  const ageBeforeToggle = normal.age;
  const stateTimeBeforeToggle = normal.stateTime;
  normal.update(0, { reducedMotion: true });
  assert.equal(normal.age, ageBeforeToggle);
  assert.equal(normal.stateTime, stateTimeBeforeToggle);
  assert.deepEqual(normal.mesh.position.toArray(), normal.hoverPoint.toArray());
  assert.equal(normal.mesh.rotation.z, 0);
  assert.equal(normal.energyMaterial.emissiveIntensity, 2.15);

  normal.update(0, { reducedMotion: false });
  assert.notEqual(normal.mesh.position.y, normal.hoverPoint.y);
  assert.notEqual(normal.energyMaterial.emissiveIntensity, 2.15);
  normal.dispose();
  reduced.dispose();
});

test('les transitions et l interaction de la navette restent fonctionnelles en mouvement réduit', () => {
  const scene = new THREE.Scene();
  const point = new THREE.Vector3();
  const vehicle = new HuntVehicle(scene, {
    entryPoint: point,
    flybyStart: new THREE.Vector3(4, 4, 0),
    hoverPoint: new THREE.Vector3(8, 8, 0),
    exitPoint: new THREE.Vector3(16, 12, 4),
    durations: { entering: 0.25, flyby: 0.25, hover: 1, leaving: 0.25 },
    interactionDistance: 12,
    reducedMotion: true,
  });
  const player = makePlayer(new THREE.Vector3(8, 8, 0));

  vehicle.update(0.5, { reducedMotion: true });
  assert.equal(vehicle.state, 'hover');
  assert.deepEqual(vehicle.mesh.position.toArray(), vehicle.hoverPoint.toArray());
  assert.equal(vehicle.mesh.rotation.z, 0);
  const interaction = vehicle.interact(player);
  assert.equal(interaction.type, 'vehicle_scan');
  assert.equal(vehicle.mesh.userData.interactable, false);
  assert.equal(vehicle.mesh.visible, true);

  vehicle.update(1, { reducedMotion: true });
  assert.equal(vehicle.state, 'leaving');
  assert.equal(vehicle.energyMaterial.emissiveIntensity, 3.5);
  vehicle.update(0.25, { reducedMotion: true });
  assert.equal(vehicle.state, 'disposed');
});

test('le conteneur reste visible et utilisable avec une émission statique en mouvement réduit', () => {
  const cache = new HuntSupplyCache(new THREE.Scene());
  cache.update(0.25, { reducedMotion: false });
  assert.notEqual(cache.energyMaterial.emissiveIntensity, 1.85);
  assert.equal(cache.energyMaterial.emissiveIntensity, cache.glow.intensity);

  const ageBeforeToggle = cache.age;
  cache.update(0, { reducedMotion: true });
  assert.equal(cache.age, ageBeforeToggle);
  assert.equal(cache.energyMaterial.emissiveIntensity, 1.85);
  assert.equal(cache.glow.intensity, 1.85);
  cache.update(1, { reducedMotion: true });
  assert.equal(cache.energyMaterial.emissiveIntensity, 1.85);
  assert.equal(cache.mesh.visible, true);

  const result = cache.tryInteract(makePlayer(cache.mesh.position.clone()));
  assert.equal(result.type, 'cache_opened');
  assert.equal(cache.energyMaterial.emissiveIntensity, 0.25);
  assert.equal(cache.glow.intensity, 0.25);
  assert.ok(cache.lidPivot.rotation.x < 0);
  cache.dispose();
});

test('le directeur transmet reducedMotion aux entités et accepte la bascule à delta nul', () => {
  const director = new LevelEventDirector(new THREE.Scene(), { rng: () => 0.25 });
  const player = makePlayer();
  director.start({ huntId: 'goliath', biomeId: 'jungle' });
  director.update(22, { player, reducedMotion: true });

  const vehicle = director.vehicles[0];
  const cache = director.caches[0];
  assert.equal(director.reducedMotion, true);
  assert.equal(vehicle.reducedMotion, true);
  assert.equal(cache.reducedMotion, true);
  assert.equal(vehicle.state, 'hover');
  assert.deepEqual(vehicle.mesh.position.toArray(), vehicle.hoverPoint.toArray());
  assert.equal(cache.energyMaterial.emissiveIntensity, 1.85);
  assert.equal(vehicle.mesh.visible, true);
  assert.equal(cache.mesh.visible, true);

  const elapsedBeforeToggle = director.elapsed;
  director.update(0, { player, reducedMotion: false });
  assert.equal(director.elapsed, elapsedBeforeToggle);
  assert.equal(vehicle.reducedMotion, false);
  assert.equal(cache.reducedMotion, false);

  const forwarded = [];
  const vehicleUpdate = vehicle.update.bind(vehicle);
  const cacheUpdate = cache.update.bind(cache);
  vehicle.update = (delta, options) => {
    forwarded.push(['vehicle', options.reducedMotion]);
    return vehicleUpdate(delta, options);
  };
  cache.update = (delta, options) => {
    forwarded.push(['cache', options.reducedMotion]);
    return cacheUpdate(delta, options);
  };
  director.update(0.25, { player, reducedMotion: false });
  assert.deepEqual(forwarded, [['vehicle', false], ['cache', false]]);
  assert.equal(vehicle.state, 'hover');
  assert.equal(vehicle.mesh.visible, true);
  assert.equal(cache.mesh.visible, true);
  director.dispose();
});

test('Game propage le réglage aux événements au chargement et à chaque frame de chasse', async () => {
  const previousWindow = globalThis.window;
  globalThis.window = { addEventListener() {} };
  const { Game } = await import('../src/main.js');
  if (previousWindow === undefined) delete globalThis.window;
  else globalThis.window = previousWindow;

  const previousDocument = globalThis.document;
  const classToggles = [];
  globalThis.document = {
    body: { classList: { toggle: (...args) => classToggles.push(args) } },
    documentElement: { style: { setProperty() {} } },
    getElementById() { return null; },
  };

  try {
    const settingsCalls = [];
    const game = Object.create(Game.prototype);
    game.settings = { audioEnabled: true, reducedMotion: true, highContrast: false, hudScale: 1 };
    game.environment = { setReducedMotion(value) { settingsCalls.push(['environment', value]); } };
    game.eventDirector = { setReducedMotion(value) { settingsCalls.push(['events', value]); } };
    game.syncSettingsControls = () => {};
    game.applySettings(false);
    assert.deepEqual(settingsCalls, [['environment', true], ['events', true]]);
    assert.ok(classToggles.some(([name, value]) => name === 'reduced-motion' && value === true));

    let updateOptions = null;
    game.settings.reducedMotion = true;
    game.player = {};
    game.activeBoss = null;
    game.activeEnemies = [];
    game.activeHazard = null;
    game.eventDirector = {
      update(_delta, options) { updateOptions = options; return []; },
      drainSignals() {},
    };
    game.processEncounterSignals = () => {};
    game.updateEncounterContent(0.25);
    assert.equal(updateOptions.reducedMotion, true);
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});
