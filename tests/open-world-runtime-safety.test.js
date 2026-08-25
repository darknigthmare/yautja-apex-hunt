import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { ENVIRONMENT_PERFORMANCE_BUDGETS } from '../src/data/BiomePropCatalog.js';
import { Environment } from '../src/world/Environment.js';
import { MegafaunaBoss } from '../src/MegafaunaBoss.js';

const previousWindow = globalThis.window;
globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');
if (previousWindow === undefined) delete globalThis.window;
else globalThis.window = previousWindow;

function distanceToSegment2D(point, start, end) {
  const segmentX = end.x - start.x;
  const segmentZ = end.z - start.z;
  const lengthSquared = segmentX * segmentX + segmentZ * segmentZ;
  const projection = lengthSquared > 0
    ? THREE.MathUtils.clamp(
      ((point.x - start.x) * segmentX + (point.z - start.z) * segmentZ) / lengthSquared,
      0,
      1,
    )
    : 0;
  return Math.hypot(
    point.x - (start.x + segmentX * projection),
    point.z - (start.z + segmentZ * projection),
  );
}

test('le steering Apex dévie d’un collider tout en progressant vers sa destination', () => {
  const environment = Object.create(Environment.prototype);
  environment.obstacleColliders = [{ x: 12, z: 0, radius: 5, blocksActors: true }];
  const origin = new THREE.Vector3(0, 0, 0);
  const target = new THREE.Vector3(30, 0, 0);

  const direction = environment.getNavigationDirection(origin, target, 3);
  const lookAhead = origin.clone().addScaledVector(direction, 28);

  assert.ok(direction.x > 0, 'le détour doit encore progresser vers la cible');
  assert.ok(Math.abs(direction.z) > 0.1, 'le trajet direct obstrué doit produire une déviation latérale');
  assert.ok(distanceToSegment2D({ x: 12, z: 0 }, origin, lookAhead) >= 8 - 0.000001);
});

test('une migration Apex forcée continue au contact et avance les états transitoires sans IA offensive', () => {
  const game = Object.create(Game.prototype);
  const route = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(100, 2, 0)];
  let offensiveTicks = 0;
  let transientTicks = 0;
  game.activeBoss = {
    position: route[0].clone(),
    mesh: new THREE.Group(),
    colliderRadius: 6,
    health: 1000,
    maxHealth: 1000,
    isDead: false,
    update() { offensiveTicks += 1; },
    tickTransientState() { transientTicks += 1; },
  };
  game.player = { position: new THREE.Vector3(5, 0, 0), isCloaked: false };
  game.environment = {
    sampleHeight: () => 2,
    getNavigationDirection(origin, target) { return target.clone().sub(origin).setY(0).normalize(); },
  };
  game.hud = { showLogMessage() {} };
  game.bossMigrationRoute = route;
  game.bossMigrationIndex = 0;
  game.bossMigrationHold = 0;
  game.bossMigrationGrace = 0;
  game.bossMigrationHealthPhase = 0;
  game.bossRelocating = false;
  game.bossEngaged = false;
  game.bossMigrationForced = false;

  assert.equal(game.requestBossMigration(route[1], { forced: true }), true);
  game.updateBossTerritory(0.5);

  assert.equal(game.bossMigrationForced, true);
  assert.equal(game.bossRelocating, true);
  assert.ok(game.activeBoss.position.x > 4, 'la cible proche doit réellement quitter le territoire');
  assert.equal(transientTicks, 1);
  assert.equal(offensiveTicks, 0);
});

test('un conflit écologique recrute et frappe les deux factions annoncées', () => {
  const game = Object.create(Game.prototype);
  const damageByType = new Map();
  const makeEnemy = (type, x) => ({
    type,
    name: type,
    position: new THREE.Vector3(x, 0, 0),
    isDead: false,
    hearMimicry() {},
    takeDamage(amount) {
      damageByType.set(type, (damageByType.get(type) ?? 0) + amount);
      return { killed: false };
    },
  });
  game.activeEnemies = [
    makeEnemy('human_fireteam', 0),
    makeEnemy('xeno_runner', 12),
    makeEnemy('xeno_runner', 16),
    makeEnemy('genna_grazer', 14),
    makeEnemy('genna_grazer', 18),
  ];
  game.activeTerritoryClashes = [];
  game.spawnBloodSpatterVFX = () => {};
  game.getTargetBloodColor = () => 0x00ff00;
  game.hud = { showLogMessage() {} };

  const clash = game.beginTerritoryClash({
    sourceId: 'ecosystem-contract',
    position: new THREE.Vector3(),
    factions: ['xeno_runner', 'genna_grazer'],
    duration: 12,
  });
  clash.pulseTimer = 0;
  game.updateTerritoryClashes(0.1);

  assert.deepEqual(new Set(clash.participants.map((enemy) => enemy.type)), new Set(['xeno_runner', 'genna_grazer']));
  assert.equal(clash.participants.some((enemy) => enemy.type === 'human_fireteam'), false);
  assert.equal([...damageByType.values()].reduce((total, amount) => total + amount, 0), 6);
});

test('les PNJ mobiles sont recalés sur le relief et leur mesh reste synchronisé', () => {
  const game = Object.create(Game.prototype);
  const mesh = new THREE.Group();
  const enemy = {
    type: 'xeno_runner',
    isDead: false,
    position: new THREE.Vector3(0, -90, 0),
    mesh,
    update() {
      this.position.set(9, -90, 4);
      return [];
    },
  };
  game.activeEnemies = [enemy];
  game.activeTerritoryClashes = [];
  game.activeBoss = null;
  game.activeHazard = null;
  game.hazardPulseTimer = 0;
  game.settings = {};
  game.player = { position: new THREE.Vector3() };
  game.environment = { sampleHeight: (position) => position.x - position.z + 2 };
  game.eventDirector = { update: () => [], drainSignals() {} };

  game.updateEncounterContent(0.2);

  assert.equal(enemy.position.y, 7);
  assert.ok(enemy.mesh.position.equals(enemy.position));
});

test('le solveur physique recopie toutes les positions corrigées dans les meshes', () => {
  const game = Object.create(Game.prototype);
  const enemy = {
    isDead: false,
    colliderRadius: 1,
    position: new THREE.Vector3(2, 0, 0),
    mesh: new THREE.Group(),
  };
  game.player = {
    position: new THREE.Vector3(0, 0, 0),
    mesh: new THREE.Group(),
    isPerched: false,
  };
  game.activeBoss = {
    isDead: false,
    colliderRadius: 5,
    position: new THREE.Vector3(0, 0, 0),
    mesh: new THREE.Group(),
  };
  game.activeEnemies = [enemy];
  game.environment = {
    obstacleColliders: [{ x: 0, z: 0, radius: 3 }],
    constrainToPlayableArea(position) {
      position.y = 4;
      return position;
    },
  };

  game.handlePhysicalCollisions();

  assert.ok(game.player.mesh.position.equals(game.player.position));
  assert.ok(game.activeBoss.mesh.position.equals(game.activeBoss.position));
  assert.ok(enemy.mesh.position.equals(enemy.position));
});

test('le Goliath utilise la grande frontière dynamique au lieu de revenir à 330 m', () => {
  const scene = new THREE.Scene();
  const boss = new MegafaunaBoss(scene);
  boss.arenaBoundary = 600;
  boss.position.set(520, 0, 0);
  boss.mesh.position.copy(boss.position);

  boss.update(0.1, new THREE.Vector3(700, 0, 0), false);

  assert.ok(boss.position.x > 500, `position inattendue: ${boss.position.x}`);
  assert.ok(boss.position.x <= 600);
});

test('le mesh de terrain transformé correspond à sampleHeight dans les cinq biomes', () => {
  const environment = new Environment(new THREE.Scene());
  const biomes = ['jungle', 'hive_lv426', 'ryushi', 'yautja_prime', 'genna'];

  for (const biome of biomes) {
    environment.setBiome(biome);
    let terrain = null;
    environment.biomeGroup.traverse((object) => {
      const parameters = object.geometry?.parameters;
      if (object.isMesh && parameters?.widthSegments === 128 && parameters?.heightSegments === 128) terrain = object;
    });
    assert.ok(terrain, `${biome}: terrain haute définition introuvable`);
    terrain.updateMatrixWorld(true);
    const positions = terrain.geometry.attributes.position;
    for (const index of [0, Math.floor(positions.count / 3), positions.count - 1]) {
      const local = new THREE.Vector3().fromBufferAttribute(positions, index);
      const world = terrain.localToWorld(local.clone());
      assert.ok(
        Math.abs(world.y - environment.sampleHeight(world.x, world.z)) < 0.001,
        `${biome}: relief mesh/runtime désaligné`,
      );
    }
  }
  environment.clearBiome();
});

test('la Jungle réserve des couverts physiques dans chaque secteur sans dépasser le budget', () => {
  const environment = new Environment(new THREE.Scene());
  environment.setBiome('jungle');
  const snapshot = environment.getLevelDesignSnapshot();
  const activeRouteIds = new Set(environment.huntRouteActiveColliders.map(({ sourceId }) => sourceId));

  assert.ok(snapshot.huntRouteColliderCount >= 9);
  assert.equal(snapshot.huntRouteColliderSectorCount, 9);
  assert.ok(snapshot.colliderCount <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxColliders);
  assert.ok(environment.huntRouteActiveColliders.every((collider) => (
    activeRouteIds.has(collider.sourceId) && environment.obstacleColliders.includes(collider)
  )));
  assert.ok(snapshot.projectileOnlyColliderCount >= snapshot.demotedLegacyColliderCount);
  assert.ok(snapshot.sceneInstanceEstimate >= snapshot.totalMeshInstanceCount + snapshot.ecologyInstanceEstimate);

  const elevatedSector = environment.huntLayout.sectors.find(({ center }) => Math.abs(Number(center?.[1]) || 0) > 0.001);
  assert.ok(elevatedSector, 'un secteur surélevé est requis pour vérifier la verticalité');
  const [x, expectedElevation, z] = elevatedSector.center;
  assert.ok(
    Math.abs((environment.sampleHeight(x, z) - environment.sampleBaseHeight(x, z)) - expectedElevation) < 0.000001,
    'l’élévation déclarée doit affecter le terrain, les routes et les acteurs',
  );
  environment.clearBiome();
});
