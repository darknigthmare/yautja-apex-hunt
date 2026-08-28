import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

const previousWindow = globalThis.window;
globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');
if (previousWindow === undefined) delete globalThis.window;
else globalThis.window = previousWindow;

test('les événements météo synchronisent puis nettoient le rendu du biome', () => {
  const game = Object.create(Game.prototype);
  const calls = [];
  game.environment = {
    setWeatherEvent(type) { calls.push(['set', type]); },
    clearWeatherEvent() { calls.push(['clear']); },
  };
  game.hud = { showLogMessage() {} };
  game.activeHazard = null;
  game.hazardPulseTimer = 4;

  game.processEncounterSignals([{ type: 'hazard', hazardType: 'thermal_storm' }]);
  assert.equal(game.activeHazard, 'thermal_storm');
  assert.deepEqual(calls, [['set', 'thermal_storm']]);

  game.processEncounterSignals([{ type: 'hazard_end', hazardType: 'thermal_storm' }]);
  assert.equal(game.activeHazard, null);
  assert.equal(game.hazardPulseTimer, 0);
  assert.deepEqual(calls, [['set', 'thermal_storm'], ['clear']]);
});

test('un renfort conserve la position objet émise par le directeur avant sécurisation', () => {
  const game = Object.create(Game.prototype);
  let requestedPosition = null;
  game.scene = new THREE.Scene();
  game.activeEnemies = [];
  game.player = { position: new THREE.Vector3(100, 0, 100), activeVisionMode: 'thermal' };
  game.environment = {
    getSafeSpawnPosition(position) {
      requestedPosition = position.clone();
      return position;
    },
  };
  game.hud = { showLogMessage() {} };

  const enemy = game.spawnEncounterNpc({
    enemyType: 'xeno',
    ordinal: 1,
    position: { x: 12, y: 1.5, z: -34 },
  });

  assert.deepEqual(requestedPosition.toArray(), [12, 1.5, -34]);
  assert.deepEqual(enemy.position.toArray(), [12, 1.5, -34]);
  enemy.dispose();
});

test('les dangers de décor appliquent dégâts et statut selon leur signal delta', () => {
  const game = Object.create(Game.prototype);
  const messages = [];
  game.player = {
    health: 100,
    stamina: 60,
    energy: 50,
    isCloaked: true,
    takeDamage(amount) { this.health -= amount; },
    applyAcidCorrosion() { this.corroded = true; },
    toggleCloak() { this.isCloaked = !this.isCloaked; },
  };
  game.hud = { showLogMessage(message) { messages.push(message); } };

  assert.equal(game.processEnvironmentHazardSignals([
    { type: 'environment_hazard', damage: 10, status: 'corrosion', message: 'ACIDE' },
    { type: 'environment_hazard', damage: 6, status: 'venom', message: 'SPORES' },
    { type: 'environment_hazard', damage: 7, status: 'energy_jam', message: 'SURCHAUFFE' },
  ]), 3);
  assert.equal(game.player.health, 77);
  assert.equal(game.player.stamina, 42);
  assert.equal(game.player.energy, 36);
  assert.equal(game.player.isCloaked, false);
  assert.equal(game.player.corroded, true);
  assert.deepEqual(messages, ['ACIDE', 'SPORES', 'SURCHAUFFE']);
});

test('un POI analysé crédite réellement l’honneur et sauvegarde la progression', () => {
  const game = Object.create(Game.prototype);
  const messages = [];
  let saves = 0;
  game.trophyHarvested = false;
  game.attemptTrophyHarvest = () => {};
  game.eventDirector = { tryInteract: () => false };
  game.environment = {
    interactWithPointOfInterest() {
      return { type: 'point_of_interest', label: 'Stèle', honor: 90, message: 'LOI DU CLAN ARCHIVÉE' };
    },
  };
  game.player = {
    position: new THREE.Vector3(),
    honorScore: 0,
    addHonor(amount) { this.honorScore += amount; return amount; },
  };
  game.hud = { showLogMessage(message) { messages.push(message); } };
  game.saveProgress = () => { saves += 1; };

  assert.equal(game.attemptContextInteraction(), true);
  assert.equal(game.player.honorScore, 90);
  assert.equal(saves, 1);
  assert.match(messages[0], /\+90 HONNEUR/);
});

test('collisions et limite circulaire emploient le rayon réel de chaque acteur', () => {
  const game = Object.create(Game.prototype);
  const margins = [];
  const enemy = { isDead: false, colliderRadius: 1, position: new THREE.Vector3(40, 0, 0) };
  game.player = { position: new THREE.Vector3(100, 0, 100), isPerched: false };
  game.activeBoss = { isDead: false, colliderRadius: 6.8, position: new THREE.Vector3(0, 0, 0) };
  game.activeEnemies = [enemy];
  game.environment = {
    obstacleColliders: [
      { x: 0, z: 0, radius: 3 },
      { x: 100, z: 100, radius: 12, blocksActors: false, blocksProjectiles: true },
    ],
    constrainToPlayableArea(position, margin, options) {
      margins.push([position, margin, options]);
      return position;
    },
  };

  game.handlePhysicalCollisions();

  assert.equal(game.activeBoss.position.x, 9.8, 'la normale de recouvrement nul doit être déterministe');
  assert.deepEqual(game.player.position.toArray(), [100, 0, 100], 'un collider projectile-only ne bloque pas les acteurs');
  assert.deepEqual(margins.map(([, margin]) => margin), [1.8, 6.8, 1]);
  assert.ok(margins.every(([, , options]) => options?.snapToGround === true));

  game.player.isPerched = true;
  game.player.position.set(0, 24, 0);
  margins.length = 0;
  game.handlePhysicalCollisions();
  assert.deepEqual(game.player.position.toArray(), [0, 24, 0], 'une perche alignée au collider conserve son ancrage');
  assert.ok(margins.every(([position]) => position !== game.player.position));
  assert.ok(margins.every(([, , options]) => options?.snapToGround === true));

  const overlapGame = Object.create(Game.prototype);
  overlapGame.player = { position: new THREE.Vector3(0, 0, 0), isPerched: false };
  overlapGame.activeBoss = { isDead: false, colliderRadius: 5, position: new THREE.Vector3(0, 0, 0) };
  overlapGame.activeEnemies = [];
  overlapGame.environment = { obstacleColliders: [], constrainToPlayableArea() {} };
  overlapGame.handlePhysicalCollisions();
  assert.equal(overlapGame.player.position.x, 6.8, 'joueur et cible superposés doivent être séparés');
});

function makeProjectileHarness({ coverPoint, targetPoint }) {
  const game = Object.create(Game.prototype);
  let targetDamage = 0;
  const target = {
    isDead: false,
    colliderRadius: 2,
    position: new THREE.Vector3(10, 0, 0),
    aiState: 'roam',
    attackCooldown: 0,
    projectiles: [],
    resolveProjectileImpact: () => targetPoint.clone(),
    takeDamage(amount) { targetDamage += amount; return { killed: false }; },
  };
  const projectileMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial());
  projectileMesh.position.set(12, 0, 0);
  game.currentHuntType = 'bad_blood';
  game.activeBoss = target;
  game.activeEnemies = [];
  game.player = {
    position: new THREE.Vector3(-100, 0, 0),
    projectiles: [{ mesh: projectileMesh, dir: new THREE.Vector3(1, 0, 0), speed: 12, damage: 40, type: 'arrow' }],
    mines: [],
    inQTE: false,
    takeDamage() {},
    addHonor() {},
    applyAcidCorrosion() {},
  };
  game.environment = {
    addThermalFootprint() {},
    resolveProjectileCoverImpact(start) {
      return { point: coverPoint.clone(), distanceSquared: start.distanceToSquared(coverPoint) };
    },
  };
  game.eggClusters = [];
  game.activeFacehuggerCluster = null;
  game.enemyDamageCooldown = 0;
  game.goliathChargeWindow = 0;
  game.goliathChargeLatched = false;
  game.hud = { showLogMessage() {} };
  game.spawnBloodSpatterVFX = () => {};
  game.spawnPlasmaShockwaveVFX = () => {};
  return { game, projectileMesh, get targetDamage() { return targetDamage; } };
}

test('le projectile joueur touche la couverture ou la cible selon le premier impact', () => {
  const blocked = makeProjectileHarness({
    coverPoint: new THREE.Vector3(5, 0, 0),
    targetPoint: new THREE.Vector3(10, 0, 0),
  });
  blocked.game.checkCollisions(1);
  assert.equal(blocked.targetDamage, 0);
  assert.equal(blocked.game.player.projectiles.length, 0);
  assert.equal(blocked.projectileMesh.userData.disposeComplete, true);

  const clear = makeProjectileHarness({
    coverPoint: new THREE.Vector3(11, 0, 0),
    targetPoint: new THREE.Vector3(10, 0, 0),
  });
  clear.game.checkCollisions(1);
  assert.equal(clear.targetDamage, 40);
  assert.equal(clear.game.player.projectiles.length, 0);
});

test('la couverture absorbe aussi un projectile de boss avant le joueur', () => {
  const game = Object.create(Game.prototype);
  let damageTaken = 0;
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial());
  mesh.position.set(0, 2.4, 0);
  game.currentHuntType = 'bad_blood';
  game.activeBoss = {
    isDead: false,
    colliderRadius: 4,
    position: new THREE.Vector3(100, 0, 0),
    aiState: 'roam',
    attackCooldown: 0,
    projectiles: [{ mesh, dir: new THREE.Vector3(1, 0, 0), speed: 12, type: 'heavy_plasma', damage: 50 }],
  };
  game.activeEnemies = [];
  game.player = {
    position: new THREE.Vector3(0, 0, 0), projectiles: [], mines: [], inQTE: false,
    takeDamage(amount) { damageTaken += amount; }, applyAcidCorrosion() {},
  };
  game.environment = {
    addThermalFootprint() {},
    resolveProjectileCoverImpact(start) {
      const point = new THREE.Vector3(-6, 2.4, 0);
      return { point, distanceSquared: start.distanceToSquared(point) };
    },
  };
  game.eggClusters = [];
  game.activeFacehuggerCluster = null;
  game.enemyDamageCooldown = 0;
  game.goliathChargeWindow = 0;
  game.goliathChargeLatched = false;
  game.hud = { showLogMessage() {} };
  game.spawnBloodSpatterVFX = () => {};
  game.spawnPlasmaShockwaveVFX = () => {};

  game.checkCollisions(1);

  assert.equal(damageTaken, 0);
  assert.equal(game.activeBoss.projectiles.length, 0);
  assert.equal(mesh.userData.disposeComplete, true);
});

test('les œufs utilisent les sockets déterministes de la nursery', () => {
  const sockets = [
    new THREE.Vector3(-88, 0, -4),
    new THREE.Vector3(-73, 0, 5),
    new THREE.Vector3(-82, 0, 14),
    new THREE.Vector3(-94, 0, 8),
  ];
  const game = Object.create(Game.prototype);
  game.scene = new THREE.Scene();
  game.currentPlanet = 'hive_lv426';
  game.eggClusters = [];
  game.environment = { getEncounterSockets: () => sockets.map((position) => position.clone()) };

  const positions = game.spawnHiveEggClusters();

  assert.deepEqual(positions.map((position) => position.toArray()), sockets.map((position) => position.toArray()));
  assert.deepEqual(game.eggClusters.map(({ position }) => position.toArray()), sockets.map((position) => position.toArray()));
  game.eggClusters.forEach((egg) => egg.dispose());
});

function makeNpcAttackHarness(signal, coverImpact = null) {
  const game = Object.create(Game.prototype);
  const tracers = [];
  const coverQueries = [];
  let bloodBursts = 0;
  const enemy = {
    type: 'combat_synthetic',
    position: new THREE.Vector3(0, 0, 0),
    update() { return [signal]; },
  };
  game.player = {
    position: new THREE.Vector3(6, 0, 0),
    health: 100,
    energy: 80,
    stamina: 70,
    isCloaked: true,
    takeDamage(amount) { this.health -= amount; },
    applyAcidCorrosion() { this.corroded = true; },
    toggleCloak() { this.isCloaked = !this.isCloaked; },
  };
  game.activeBoss = null;
  game.activeEnemies = [enemy];
  game.activeHazard = null;
  game.hazardPulseTimer = 0;
  game.eventDirector = { update: () => [], drainSignals() {} };
  game.environment = {
    resolveProjectileCoverImpact(start, end, radius) {
      coverQueries.push([start.clone(), end.clone(), radius]);
      return coverImpact;
    },
  };
  game.hud = { showLogMessage() {} };
  game.spawnEnemyTracer = (origin, target) => tracers.push([origin.clone(), target.clone()]);
  game.spawnBloodSpatterVFX = () => { bloodBursts += 1; };
  return {
    game,
    tracers,
    coverQueries,
    get bloodBursts() { return bloodBursts; },
  };
}

test('la couverture intercepte un tir PNJ avant tout dégât, statut ou recul', () => {
  const origin = new THREE.Vector3(0, 0, 0);
  const coverPoint = new THREE.Vector3(3, 1.1, 0);
  const harness = makeNpcAttackHarness({
    type: 'attack_player',
    damage: 30,
    status: 'energy_jam',
    energyDrain: 20,
    secondaryStatus: 'venom',
    knockback: 4,
    projectile: { origin },
  }, { point: coverPoint });

  harness.game.updateEncounterContent(0.1);

  assert.deepEqual(harness.coverQueries[0][0].toArray(), origin.toArray());
  assert.deepEqual(harness.coverQueries[0][1].toArray(), [6, 2.4, 0]);
  assert.equal(harness.coverQueries[0][2], 0.25);
  assert.deepEqual(harness.tracers[0][1].toArray(), coverPoint.toArray());
  assert.equal(harness.game.player.health, 100);
  assert.equal(harness.game.player.energy, 80);
  assert.equal(harness.game.player.stamina, 70);
  assert.equal(harness.game.player.isCloaked, true);
  assert.deepEqual(harness.game.player.position.toArray(), [6, 0, 0]);
  assert.equal(harness.bloodBursts, 0);
});

test('une attaque PNJ de mêlée reste immédiate sans résolution projectile', () => {
  const harness = makeNpcAttackHarness({
    type: 'attack_player',
    damage: 15,
    status: 'corrosion',
    secondaryStatus: 'venom',
    knockback: 2,
  });

  harness.game.updateEncounterContent(0.1);

  assert.equal(harness.coverQueries.length, 0);
  assert.equal(harness.tracers.length, 0);
  assert.equal(harness.game.player.health, 85);
  assert.equal(harness.game.player.stamina, 46);
  assert.equal(harness.game.player.corroded, true);
  assert.deepEqual(harness.game.player.position.toArray(), [8, 0, 0]);
  assert.equal(harness.bloodBursts, 1);
});

test('le filet PNJ draine l’énergie et applique réellement sa durée d’entrave', () => {
  const harness = makeNpcAttackHarness({
    type: 'attack_player',
    damage: 8,
    damageType: 'disruption',
    status: 'snare',
    statusDuration: 4.2,
    snareDuration: 4.2,
    energyDrain: 10,
    projectile: { origin: new THREE.Vector3(0, 0, 0) },
  });

  harness.game.updateEncounterContent(0.1);

  assert.equal(harness.game.player.health, 92);
  assert.equal(harness.game.player.energy, 70);
  assert.equal(harness.game.player.combatStatusTimers.snare, 4.2);
  assert.equal(harness.game.player.isCloaked, true, 'un filet n’est pas un brouillage thermique');
});

test('la Smartgun résout chaque impact de rafale et pose la suppression temporaire', () => {
  const harness = makeNpcAttackHarness({
    type: 'attack_player',
    damage: 18,
    damageType: 'ballistic',
    burstCount: 4,
    suppression: true,
    suppressionDuration: 2.6,
    projectile: { origin: new THREE.Vector3(0, 0, 0), burstCount: 4 },
  });

  harness.game.updateEncounterContent(0.1);

  assert.equal(harness.game.player.health, 28);
  assert.equal(harness.game.player.combatStatusTimers.suppression, 2.6);
  assert.equal(harness.bloodBursts, 1);
});

test('la désorientation facehugger coexiste avec corrosion et venin', () => {
  const harness = makeNpcAttackHarness({
    type: 'attack_player',
    damage: 13,
    damageType: 'corrosion',
    status: 'disorientation',
    statusDuration: 3.2,
    secondaryStatus: 'venom',
  });

  harness.game.updateEncounterContent(0.1);

  assert.equal(harness.game.player.health, 87);
  assert.equal(harness.game.player.combatStatusTimers.disorientation, 3.2);
  assert.equal(harness.game.player.corroded, true);
  assert.equal(harness.game.player.stamina, 46);
});

test('les deux opérateurs Stargazer émettent du sang humain', () => {
  const game = Object.create(Game.prototype);
  assert.equal(game.getTargetBloodColor({ type: 'stargazer_rifleman' }), 0xb41616);
  assert.equal(game.getTargetBloodColor({ type: 'stargazer_net_trapper' }), 0xb41616);
});

test('Space quitte une perche alignée au collider via un point d’atterrissage sûr', () => {
  const game = Object.create(Game.prototype);
  const perch = new THREE.Vector3(14, 32, -7);
  const landing = new THREE.Vector3(20, 1.5, -7);
  let safeRequest = null;
  game.isGameStarted = true;
  game.isPaused = false;
  game.gameState = 'HUNT';
  game.player = {
    inQTE: false,
    isPerched: true,
    currentPerchNode: perch.clone(),
    position: perch.clone(),
    jumpToCanopy(nodes) {
      assert.equal(nodes, game.environment.treePerches);
      this.isPerched = false;
      this.position.y = 0;
      return false;
    },
  };
  game.environment = {
    treePerches: [perch],
    obstacleColliders: [{ x: perch.x, z: perch.z, radius: 5 }],
    getSafeSpawnPosition(preferred, options) {
      safeRequest = [preferred.clone(), options];
      return landing.clone();
    },
  };
  game.hud = { showLogMessage() {} };

  game.onKeyDown({ code: 'Space' });

  assert.deepEqual(safeRequest[0].toArray(), perch.toArray());
  assert.equal(safeRequest[1].clearance, 2.3);
  assert.deepEqual(game.player.position.toArray(), landing.toArray());
  assert.equal(game.player.currentPerchNode, null);
  assert.equal(game.player.isPerched, false);
});

test('death-from-above mesure depuis la perche puis atterrit hors du rayon de la cible', () => {
  const game = Object.create(Game.prototype);
  const safeRequests = [];
  let damage = 0;
  game.isGameStarted = true;
  game.isPaused = false;
  game.gameState = 'HUNT';
  game.activeEnemies = [];
  game.activeBoss = {
    isDead: false,
    colliderRadius: 4,
    position: new THREE.Vector3(18, 0, 0),
    takeDamage(amount) { damage += amount; return { killed: false }; },
  };
  game.player = {
    position: new THREE.Vector3(0, 28, 0),
    currentPerchNode: new THREE.Vector3(0, 28, 0),
    isPerched: true,
    health: 100,
    selectedWeapon: 1,
    meleeDamageMultiplier: 1,
    attack() {
      this.isPerched = false;
      this.position.set(80, 0, 0);
      return 'death_from_above';
    },
    addHonor() {},
  };
  game.environment = {
    getSafeSpawnPosition(preferred, options) {
      safeRequests.push([preferred.clone(), options]);
      const landing = preferred.clone();
      landing.y = 2;
      return landing;
    },
  };
  game.hud = { showLogMessage() {} };
  game.spawnBloodSpatterVFX = () => {};

  game.performAttack();

  assert.equal(damage, 320, 'la portée doit utiliser la position de lancement, pas la position mutée par attack');
  assert.equal(safeRequests.length, 1);
  assert.ok(Math.abs(Math.hypot(
    safeRequests[0][0].x - game.activeBoss.position.x,
    safeRequests[0][0].z - game.activeBoss.position.z,
  ) - 6.8) < 1e-9);
  assert.equal(safeRequests[0][1].clearance, 2.3);
  assert.deepEqual(game.player.position.toArray(), [11.2, 2, 0]);
  assert.equal(game.player.currentPerchNode, null);
});

test('un death-from-above hors portée retombe près de l’ancienne perche', () => {
  const game = Object.create(Game.prototype);
  const perch = new THREE.Vector3(0, 28, 0);
  const landing = new THREE.Vector3(5, 1, 4);
  let safeRequest = null;
  let damage = 0;
  game.isGameStarted = true;
  game.isPaused = false;
  game.gameState = 'HUNT';
  game.activeEnemies = [];
  game.activeBoss = {
    isDead: false,
    colliderRadius: 5,
    position: new THREE.Vector3(30, 0, 0),
    takeDamage(amount) { damage += amount; return { killed: false }; },
  };
  game.player = {
    position: perch.clone(),
    currentPerchNode: perch.clone(),
    isPerched: true,
    health: 100,
    selectedWeapon: 1,
    meleeDamageMultiplier: 1,
    attack() {
      this.isPerched = false;
      this.position.set(10, 0, 0);
      return 'death_from_above';
    },
    addHonor() {},
  };
  game.environment = {
    getSafeSpawnPosition(preferred) {
      safeRequest = preferred.clone();
      return landing.clone();
    },
  };
  game.hud = { showLogMessage() {} };
  game.spawnBloodSpatterVFX = () => {};

  game.performAttack();

  assert.equal(damage, 0);
  assert.deepEqual(safeRequest.toArray(), perch.toArray());
  assert.deepEqual(game.player.position.toArray(), landing.toArray());
  assert.equal(game.player.currentPerchNode, null);
});

function resolveWristbladeDamageAtRange(distance, wristbladeRangeMultiplier) {
  const game = Object.create(Game.prototype);
  let damage = 0;
  game.isGameStarted = true;
  game.isPaused = false;
  game.gameState = 'HUNT';
  game.activeEnemies = [];
  game.activeBoss = {
    isDead: false,
    position: new THREE.Vector3(distance, 0, 0),
    takeDamage(amount) { damage += amount; return { killed: false }; },
  };
  game.player = {
    position: new THREE.Vector3(0, 0, 0),
    selectedWeapon: 1,
    meleeDamageMultiplier: 1,
    wristbladeRangeMultiplier,
    health: 100,
    attack: () => 'wristblades',
    addHonor() {},
  };
  game.hud = { showLogMessage() {} };
  game.spawnBloodSpatterVFX = () => {};

  game.performAttack();
  return damage;
}

test('la résolution de mêlée emploie la portée gameplay des wristblades Chopper et Wolf', () => {
  assert.equal(resolveWristbladeDamageAtRange(9, undefined), 0, 'le profil historique reste limité à 8,5 m');
  assert.equal(resolveWristbladeDamageAtRange(10, 1.38), 48, 'Chopper porte à 11,73 m');
  assert.equal(resolveWristbladeDamageAtRange(9.4, 1.12), 48, 'Wolf porte à 9,52 m');
  assert.equal(resolveWristbladeDamageAtRange(9.6, 1.12), 0, 'Wolf ne dépasse pas sa portée calculée');
});
