import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

const previousWindow = globalThis.window;
globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');
if (previousWindow === undefined) delete globalThis.window;
else globalThis.window = previousWindow;

test('la chasse peuple réellement les territoires avec une écologie ambiante', () => {
  const game = Object.create(Game.prototype);
  game.scene = new THREE.Scene();
  game.activeEnemies = [];
  game.player = { activeVisionMode: 'thermal' };
  game.environment = {
    getAmbientSpawnPlan() {
      return [
        {
          id: 'territory-runner-1',
          label: 'Coureurs',
          type: 'xeno_runner',
          position: new THREE.Vector3(110, 0, -220),
          territoryCenter: new THREE.Vector3(100, 0, -220),
          patrolRadius: 42,
          aggressionRange: 24,
          leashRadius: 80,
        },
        {
          id: 'territory-grazer-1',
          label: 'Brouteurs',
          type: 'genna_grazer',
          position: new THREE.Vector3(-180, 0, 240),
          territoryCenter: new THREE.Vector3(-175, 0, 235),
          patrolRadius: 55,
          aggressionRange: 18,
          leashRadius: 96,
        },
      ];
    },
  };

  assert.equal(game.spawnBiomeEcology(), 2);
  assert.equal(game.activeEnemies.length, 2);
  assert.ok(game.activeEnemies.every((enemy) => enemy.ambient === true));
  assert.deepEqual(game.activeEnemies.map((enemy) => enemy.type), ['xeno_runner', 'genna_grazer']);
  assert.ok(game.activeEnemies.every((enemy) => enemy.mesh.parent === game.scene));
  game.activeEnemies.forEach((enemy) => enemy.dispose());
});

test('les événements localisés produisent danger, migration et conflit réels', () => {
  const game = Object.create(Game.prototype);
  const receivedEvents = [];
  const messages = [];
  game.activeTerritoryClashes = [];
  game.environment = {
    startLocalizedEvent(event) { receivedEvents.push(event); },
  };
  game.hud = { showLogMessage(message) { messages.push(message); } };
  game.spawnPreyMigration = (signal) => Array.from({ length: signal.creatureCount }, () => ({}));
  game.beginTerritoryClash = (signal) => {
    game.activeTerritoryClashes.push(signal);
    return signal;
  };
  game.requestBossMigration = () => true;

  game.processEncounterSignals([
    { type: 'localized_event', sourceId: 'acid-vein', label: 'Veine acide', radius: 20 },
    { type: 'prey_migration', creatureType: 'xeno_runner', creatureCount: 3 },
    { type: 'territory_clash', sourceId: 'clash-1', label: 'Conflit' },
    { type: 'boss_migration', position: { x: 120, y: 0, z: -200 } },
  ]);

  assert.equal(receivedEvents[0].id, 'acid-vein');
  assert.equal(game.activeTerritoryClashes.length, 1);
  assert.equal(messages.length, 4);
  assert.ok(messages.some((message) => message.includes('MIGRATION')));
  assert.ok(messages.some((message) => message.includes('PISTE APEX')));
});

test('la cible Apex occupe une route, migre puis engage le joueur à proximité', () => {
  const game = Object.create(Game.prototype);
  const route = [
    new THREE.Vector3(0, 0, -510),
    new THREE.Vector3(-260, 2, -250),
    new THREE.Vector3(260, 1, -260),
  ];
  let updateCount = 0;
  game.environment = {
    playableRadius: 640,
    getBossMigrationRoute: () => route.map((node) => node.clone()),
    sampleHeight: () => 3,
  };
  game.activeBoss = {
    position: new THREE.Vector3(),
    mesh: new THREE.Group(),
    colliderRadius: 7,
    health: 1000,
    maxHealth: 1000,
    isDead: false,
    update() { updateCount += 1; },
  };
  game.player = {
    position: new THREE.Vector3(0, 0, 520),
    isCloaked: false,
  };
  game.hud = { showLogMessage() {} };

  assert.equal(game.configureBossTerritory(), 3);
  assert.deepEqual(game.activeBoss.position.toArray(), route[0].toArray());
  assert.equal(game.activeBoss.arenaBoundary, 629);
  game.updateBossTerritory(23);
  assert.equal(game.bossRelocating, true);
  assert.ok(game.activeBoss.position.distanceTo(route[0]) > 100);
  assert.equal(game.activeBoss.position.y, 3);
  assert.equal(updateCount, 0, 'la cible distante ne doit pas agresser à travers toute la carte');

  game.player.position.copy(game.activeBoss.position).add(new THREE.Vector3(10, 0, 0));
  game.updateBossTerritory(0.1);
  assert.equal(game.bossEngaged, true);
  assert.equal(updateCount, 1);
});
