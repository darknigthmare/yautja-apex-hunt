import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';

import {
  BIOME_DEFINITIONS,
  HUNT_DEFINITIONS,
  resolveHuntBiome,
} from '../src/data/GameConfig.js';
import { HuntVehicle } from '../src/entities/HuntVehicle.js';
import { LevelEventDirector } from '../src/gameplay/LevelEventDirector.js';
import { Environment } from '../src/world/Environment.js';

const previousWindow = globalThis.window;
globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');
if (previousWindow === undefined) delete globalThis.window;
else globalThis.window = previousWindow;

const BIOME_ID = 'bouvetoya_pyramid';
const HUNT_ID = 'grid_alien';

test('Grid Alien impose le biome jouable de Bouvetøya', () => {
  const hunt = HUNT_DEFINITIONS[HUNT_ID];
  const biome = BIOME_DEFINITIONS[BIOME_ID];

  assert.equal(hunt.id, HUNT_ID);
  assert.equal(hunt.bossType, 'gridAlien');
  assert.equal(hunt.recommendedBiome, BIOME_ID);
  assert.equal(hunt.basisTier, 'AVP_SCREEN');
  assert.equal(biome.basisTier, 'AVP_SCREEN');
  assert.equal(biome.texture, '/assets/textures/bouvetoya-ice-rock.webp');
  assert.equal(biome.structureTexture, '/assets/textures/bouvetoya-pyramid-stone.webp');
  assert.equal(resolveHuntBiome(HUNT_ID, 'jungle'), BIOME_ID);
  assert.equal(resolveHuntBiome(HUNT_ID, 'secteur_obsolete'), BIOME_ID);
});

test('le directeur Bouvetøya raccorde sa faune, ses factions, son vaisseau et son pod rituel', () => {
  const director = new LevelEventDirector(new THREE.Scene(), { schedule: [] });
  director.start({ huntId: HUNT_ID, biomeId: BIOME_ID });

  assert.deepEqual(
    [1, 2, 3].map((ordinal) => director.selectEnemyType(ordinal)),
    ['weyland_expedition_guard', 'xeno_facehugger', 'xeno_warrior'],
  );
  assert.deepEqual(
    director.selectTerritoryFactions(),
    ['weyland_expedition_guard', 'xeno_warrior'],
  );
  assert.equal(director.selectVehicleType(), 'avp_ritual_ship');
  assert.equal(director.selectCacheType(), 'ritual_weapon_pod');
  director.dispose();
});

test('les trois jalons Bouvetøya émettent réellement une reconfiguration à 48, 116 et 166 secondes', () => {
  const scene = new THREE.Scene();
  const environment = new Environment(scene);
  assert.equal(environment.setBiome(BIOME_ID), true);

  const director = new LevelEventDirector(scene, {
    rng: () => 0.25,
    maxEnemySpawns: 0,
    maxVehicles: 0,
    maxCaches: 0,
  });
  director.start({ huntId: HUNT_ID, biomeId: BIOME_ID });
  const context = {
    player: { position: new THREE.Vector3() },
    environment,
  };
  const signals = [
    ...director.update(48, context),
    ...director.update(68, context),
    ...director.update(50, context),
  ].filter(({ type }) => type === 'pyramid_shift');

  assert.deepEqual(signals.map(({ at }) => at), [48, 116, 166]);
  assert.deepEqual(signals.map(({ ordinal }) => ordinal), [1, 2, 3]);
  assert.ok(signals.every(({ eventType }) => eventType === 'pyramid_shift'));
  assert.ok(signals.every(({ position }) => (
    Number.isFinite(position.x)
    && Number.isFinite(position.y)
    && Number.isFinite(position.z)
  )));

  director.dispose();
  environment.dispose();
});

test('Game transmet le signal aux murs de la pyramide et annonce le cycle au HUD', () => {
  const game = Object.create(Game.prototype);
  const received = [];
  const messages = [];
  game.environment = {
    triggerPyramidShift(signal) {
      received.push(signal);
      return { active: true, targetMode: 'beta_closed' };
    },
  };
  game.hud = {
    showLogMessage(message, duration) {
      messages.push({ message, duration });
    },
  };

  game.processEncounterSignals([{
    type: 'pyramid_shift',
    sourceId: 'avp-pyramid-shift',
    label: 'Reconfiguration de la pyramide',
    phase: 1,
  }]);

  assert.equal(received.length, 1);
  assert.equal(received[0].id, 'avp-pyramid-shift');
  assert.equal(received[0].phase, 1);
  assert.match(messages[0].message, /^PYRAMIDE: RECONFIGURATION DE LA PYRAMIDE$/);
  assert.equal(messages[0].duration, 2800);
});

test('le vaisseau du Blooding transporte quatre pods et recharge le scan rituel', () => {
  const scene = new THREE.Scene();
  const vehicle = new HuntVehicle(scene, {
    type: 'avp_ritual_ship',
    state: 'hover',
    hoverPoint: new THREE.Vector3(),
    interactionDistance: 18,
  });

  assert.equal(vehicle.mesh.userData.vehicleProfile, 'bouvetoya_blooding_carrier');
  const pods = [];
  vehicle.mesh.traverse((child) => {
    if (child.name.startsWith('ritual-drop-pod:')) pods.push(child);
  });
  assert.equal(pods.length, 4);
  assert.ok(vehicle.mesh.getObjectByName('blooding-cycle-beacon'));

  const player = {
    position: new THREE.Vector3(),
    energy: 10,
    maxEnergy: 100,
    stamina: 20,
    maxStamina: 100,
    scanPulseTimer: 0,
    scanPulseRadius: 0,
  };
  const result = vehicle.interact(player);
  assert.equal(result.vehicleType, 'avp_ritual_ship');
  assert.equal(result.scanDuration, 9);
  assert.equal(result.scanRadius, 120);
  assert.equal(result.energyRestored, 70);
  assert.equal(result.staminaRestored, 45);
  assert.equal(player.energy, 80);
  assert.equal(player.stamina, 65);
  assert.equal(player.scanPulseTimer, 9);
  assert.equal(player.scanPulseRadius, 120);
  vehicle.dispose();
});

test('l’interface et startHunt raccordent la carte Grid, Bouvetøya et les œufs', () => {
  const mainSource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  const indexSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const startIndex = mainSource.indexOf('startHunt(huntType, planetType');
  const cleanupIndex = mainSource.indexOf('\n  cleanupHunt()', startIndex);
  const startHuntSource = mainSource.slice(startIndex, cleanupIndex);

  assert.ok(startIndex >= 0 && cleanupIndex > startIndex, 'méthode startHunt introuvable');
  assert.match(startHuntSource, /resolvedPlanet === 'bouvetoya_pyramid'/);
  assert.match(startHuntSource, /this\.currentHuntType === 'grid_alien'/);
  assert.match(startHuntSource, /this\.spawnHiveEggClusters\(\)/);

  assert.match(indexSource, /<option value="bouvetoya_pyramid">[^<]*BOUVETØYA/);
  assert.match(indexSource, /class="mission-card mission-card-grid"/);
  assert.match(indexSource, /data-hunt="grid_alien"/);
  assert.match(indexSource, />AFFRONTER GRID<\/button>/);
});
