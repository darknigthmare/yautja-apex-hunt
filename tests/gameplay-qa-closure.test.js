import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { XenomorphQueen } from '../src/entities/XenomorphQueen.js';
import { PredalienBoss } from '../src/entities/PredalienBoss.js';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';
import { calculateHonorAward } from '../src/gameplay/combatRules.js';

// main.js only registers this callback at import time. Keeping it inert lets the
// Node suite exercise Game methods without constructing a WebGL renderer.
globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');

const NO_INPUT = Object.freeze({ x: 0, z: 0, isSprinting: false });

function makeMesh(position = new THREE.Vector3()) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 4, 4),
    new THREE.MeshBasicMaterial(),
  );
  mesh.position.copy(position);
  return mesh;
}

function makeCollisionHarness({ huntType, boss, playerPosition = new THREE.Vector3() }) {
  const damageEvents = [];
  let corrosionEvents = 0;
  const game = Object.create(Game.prototype);

  game.currentHuntType = huntType;
  game.activeBoss = boss;
  game.player = {
    position: playerPosition,
    projectiles: [],
    mines: [],
    inQTE: false,
    takeDamage(amount) { damageEvents.push(amount); },
    applyAcidCorrosion() { corrosionEvents += 1; },
  };
  game.environment = { addThermalFootprint() {} };
  game.eggClusters = [];
  game.activeFacehuggerCluster = null;
  game.enemyDamageCooldown = 0;
  game.goliathChargeWindow = 0;
  game.goliathChargeLatched = false;
  game.hud = { showLogMessage() {} };
  game.spawnBloodSpatterVFX = () => {};
  game.spawnPlasmaShockwaveVFX = () => {};

  return {
    game,
    damageEvents,
    get corrosionEvents() { return corrosionEvents; },
  };
}

test('un trophée de victoire ne crédite honneur et progression qu’une fois', () => {
  const scene = new THREE.Scene();
  const player = new YautjaPlayer(scene);
  const game = Object.create(Game.prototype);
  let saves = 0;
  let trophyRefreshes = 0;

  game.player = player;
  game.activeBoss = {
    isDead: true,
    position: player.position.clone(),
    projectiles: [],
  };
  game.currentHuntType = 'goliath';
  game.gameState = 'HUNT';
  game.trophyHarvested = false;
  game.huntResultShown = false;
  game.timeScale = 1;
  game.victoryCountdown = null;
  game.isScopeZooming = true;
  game.keyboardInputDir = { x: 1, z: 1, isSprinting: true };
  game.gamepadAxes = { x: 1, z: 1 };
  game.inputDir = { x: 1, z: 1, isSprinting: true };
  game.eggClusters = [];
  game.activeFacehuggerCluster = null;
  game.goliathChargeWindow = 0;
  game.goliathChargeLatched = false;
  game.enemyDamageCooldown = 0;
  game.hub = { setTrophyState() { trophyRefreshes += 1; } };
  game.hud = { hideActionPrompt() {}, showLogMessage() {} };
  game.saveProgress = () => { saves += 1; return true; };

  const initialHonor = player.honorScore;
  const expectedAward = calculateHonorAward(1200, player.isCloaked);

  game.attemptTrophyHarvest();
  game.attemptTrophyHarvest();
  game.attemptTrophyHarvest();

  assert.equal(player.honorScore, initialHonor + expectedAward);
  assert.deepEqual(player.completedHunts, ['goliath']);
  assert.equal(saves, 1);
  assert.equal(trophyRefreshes, 1);
  assert.equal(game.gameState, 'VICTORY_PENDING');
  assert.equal(game.victoryCountdown, 3);
});

test('un projectile Bad Blood est consommé et ne blesse qu’une fois', () => {
  const playerPosition = new THREE.Vector3(0, 0, 0);
  const projectileMesh = makeMesh(playerPosition);
  const boss = {
    position: new THREE.Vector3(20, 0, 0),
    isDead: false,
    aiState: 'stalk',
    attackCooldown: 0,
    projectiles: [{ mesh: projectileMesh, damage: 35 }],
  };
  const harness = makeCollisionHarness({ huntType: 'bad_blood', boss, playerPosition });

  harness.game.checkCollisions(0.016);
  harness.game.checkCollisions(0.016);

  assert.deepEqual(harness.damageEvents, [35]);
  assert.equal(boss.projectiles.length, 0);
  assert.equal(projectileMesh.userData.disposeComplete, true);
});

test('la mêlée Bad Blood est limitée à un impact par fenêtre d’attaque', () => {
  const playerPosition = new THREE.Vector3(0, 0, 0);
  const boss = {
    position: new THREE.Vector3(6, 0, 0),
    isDead: false,
    aiState: 'melee',
    attackCooldown: 1.8,
    projectiles: [],
  };
  const harness = makeCollisionHarness({ huntType: 'bad_blood', boss, playerPosition });

  harness.game.checkCollisions(0.016);
  harness.game.checkCollisions(0.2);
  harness.game.checkCollisions(0.2);

  assert.deepEqual(harness.damageEvents, [26]);
  assert.ok(harness.game.enemyDamageCooldown > 0);
});

test('les queues Reine et Predalien télégraphient 0,45–0,7 s puis frappent une seule fois', () => {
  for (const [huntType, BossType] of [
    ['xeno_queen', XenomorphQueen],
    ['predalien', PredalienBoss],
  ]) {
    const scene = new THREE.Scene();
    const boss = new BossType(scene);
    boss.position.set(0, 0, 0);
    boss.mesh.position.copy(boss.position);
    const playerPosition = new THREE.Vector3(20, 0, 0);

    boss.update(0.016, playerPosition, false);
    assert.equal(boss.aiState, 'attack_tail', `${huntType} doit entrer dans l’état de queue`);
    assert.ok(boss.attackWindupDuration >= 0.45 && boss.attackWindupDuration <= 0.7);
    assert.ok(boss.attackCooldown > 3, `${huntType} doit armer un délai entre deux queues`);

    const harness = makeCollisionHarness({ huntType, boss, playerPosition });
    harness.game.checkCollisions(0.016);
    boss.update(boss.attackWindupDuration * 0.5, playerPosition, false);
    harness.game.checkCollisions(0.016);
    assert.deepEqual(harness.damageEvents, [], `${huntType} ne doit pas frapper pendant l’armement`);

    boss.update(boss.attackWindupDuration * 0.55, playerPosition, false);
    harness.game.checkCollisions(0.016);
    harness.game.checkCollisions(2);

    assert.deepEqual(harness.damageEvents, [36], `${huntType} doit infliger un unique impact de 36 dégâts`);
    assert.equal(harness.corrosionEvents, 1, `${huntType} doit appliquer la corrosion une fois`);
    assert.equal(boss.attackImpactConsumed, true);
    boss.dispose();
  }
});

test('acid_spray et acid_frenzy sont accessibles, télégraphiés et consommés une fois', () => {
  for (const [huntType, BossType, attackState, distance, damage] of [
    ['xeno_queen', XenomorphQueen, 'acid_spray', 45, 24],
    ['predalien', PredalienBoss, 'acid_frenzy', 18, 34],
  ]) {
    const scene = new THREE.Scene();
    const boss = new BossType(scene);
    boss.position.set(0, 0, 0);
    boss.mesh.position.copy(boss.position);
    if (huntType === 'predalien') boss.isEnraged = true;
    const playerPosition = new THREE.Vector3(distance, 0, 0);

    boss.update(0.016, playerPosition, false);
    assert.equal(boss.aiState, attackState);
    assert.ok(boss.attackWindupDuration >= 0.45 && boss.attackWindupDuration <= 0.7);

    const harness = makeCollisionHarness({ huntType, boss, playerPosition });
    harness.game.checkCollisions(0.016);
    boss.update(boss.attackWindupDuration * 0.5, playerPosition, false);
    harness.game.checkCollisions(0.016);
    assert.deepEqual(harness.damageEvents, []);

    boss.update(boss.attackWindupDuration * 0.55, playerPosition, false);
    harness.game.checkCollisions(0.016);
    harness.game.checkCollisions(2);

    assert.deepEqual(harness.damageEvents, [damage]);
    assert.equal(harness.corrosionEvents, 1);
    assert.equal(boss.attackImpactConsumed, true);
    boss.dispose();
  }
});
test('la corrosion acide force le décloak puis verrouille le camouflage', () => {
  const player = new YautjaPlayer(new THREE.Scene());

  assert.equal(player.toggleCloak(), true);
  assert.equal(player.isCloaked, true);
  assert.equal(player.applyAcidCorrosion(), true);
  assert.equal(player.isCloaked, false);
  assert.equal(player.isAcidCorroded, true);
  assert.equal(player.toggleCloak(), false);
  player.mesh.traverse((child) => {
    if (child.isMesh) assert.notEqual(child.material, player.cloakMaterial);
  });
});

test('le QTE annonce la récompense réelle visible ou camouflée et ne paie qu’une fois', () => {
  for (const cloaked of [false, true]) {
    const player = new YautjaPlayer(new THREE.Scene());
    const game = Object.create(Game.prototype);
    let neutralizations = 0;
    const messages = [];
    player.isCloaked = cloaked;

    game.player = player;
    game.activeFacehuggerCluster = {
      neutralizeFacehugger() { neutralizations += 1; return true; },
    };
    game.hud = { showLogMessage(message) { messages.push(message); } };

    player.triggerQTE();
    const initialHonor = player.honorScore;
    const expectedAward = calculateHonorAward(150, cloaked);

    assert.equal(game.resolveFacehuggerQTE(true), true);
    assert.equal(game.resolveFacehuggerQTE(true), false);
    assert.equal(player.inQTE, false);
    assert.equal(player.qteTimer, 0);
    assert.equal(player.honorScore, initialHonor + expectedAward);
    assert.equal(neutralizations, 1);
    assert.deepEqual(messages, [`FACEHUGGER TRANCHÉ AVEC SUCCÈS! +${expectedAward} PTS`]);
    assert.equal(game.activeFacehuggerCluster, null);
  }
});

test('le QTE expiré inflige sa conséquence une fois puis retire la menace', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  const boss = {
    position: new THREE.Vector3(100, 0, 0),
    isDead: false,
    aiState: 'roam',
    attackCooldown: 0,
    projectiles: [],
  };
  const harness = makeCollisionHarness({ huntType: 'xeno_queen', boss, playerPosition: player.position });
  let neutralizations = 0;
  harness.game.player = player;
  harness.game.activeFacehuggerCluster = {
    neutralizeFacehugger() { neutralizations += 1; return true; },
  };

  player.triggerQTE();
  const armedTimer = player.qteTimer;
  harness.game.checkCollisions(0.016);
  assert.equal(player.qteTimer, armedTimer);
  const initialHealth = player.health;
  player.update(2.6, NO_INPUT, 0);
  player.update(0.5, NO_INPUT, 0);
  harness.game.checkCollisions(0.016);

  assert.equal(player.inQTE, false);
  assert.equal(player.qteTimer, 0);
  assert.equal(player.health, initialHealth - 35);
  assert.equal(neutralizations, 1);
  assert.equal(harness.game.activeFacehuggerCluster, null);
});

test('le chemin de recommencement nettoie objets, altérations et états terminaux', () => {
  const scene = new THREE.Scene();
  const player = new YautjaPlayer(scene);
  const projectileMesh = makeMesh();
  const mineMesh = makeMesh();
  const bossMesh = makeMesh();
  const bossProjectileMesh = makeMesh();
  const vfxMesh = makeMesh();
  [projectileMesh, mineMesh, bossMesh, bossProjectileMesh, vfxMesh].forEach((mesh) => scene.add(mesh));

  player.projectiles = [{ mesh: projectileMesh }];
  player.mines = [{ mesh: mineMesh }];
  player.toggleCloak();
  player.isAcidCorroded = true;
  player.acidTimer = 4;
  player.inQTE = true;
  player.qteTimer = 2;
  player.health = 0;
  player.energy = 0;
  player.stamina = 0;
  player.isSelfDestructing = true;
  player.selfDestructTimer = 1;
  player.selfDestructComplete = true;
  player.isDead = true;
  player.defeatReason = 'blessures';
  player.mesh.visible = false;

  const game = Object.create(Game.prototype);
  let eggDisposals = 0;
  let bossDisposals = 0;
  game.player = player;
  game.activeBoss = {
    mesh: bossMesh,
    projectiles: [{ mesh: bossProjectileMesh }],
    dispose() { bossDisposals += 1; },
  };
  game.activeFacehuggerCluster = { id: 'facehugger-actif' };
  game.eggClusters = [{ dispose() { eggDisposals += 1; } }];
  game.vfxParticles = [{ mesh: vfxMesh }];
  game.enemyDamageCooldown = 1;
  game.goliathChargeWindow = 1;
  game.goliathChargeLatched = true;
  game.trophyHarvested = true;
  game.huntResultShown = true;
  game.isScopeZooming = true;
  game.keyboardInputDir = { x: 1, z: 1, isSprinting: true };
  game.gamepadAxes = { x: 1, z: 1 };
  game.inputDir = { x: 1, z: 1, isSprinting: true };
  game.timeScale = 0.2;
  game.hud = { hideActionPrompt() {}, updateTriLaserPosition() {} };

  game.cleanupHunt();
  player.resetForHunt(new THREE.Vector3(0, 0, 60));

  assert.equal(eggDisposals, 1);
  assert.equal(bossDisposals, 1);
  assert.equal(game.activeBoss, null);
  assert.equal(game.activeFacehuggerCluster, null);
  assert.deepEqual(game.eggClusters, []);
  assert.deepEqual(game.vfxParticles, []);
  assert.deepEqual(player.projectiles, []);
  assert.deepEqual(player.mines, []);
  assert.equal(projectileMesh.userData.disposeComplete, true);
  assert.equal(mineMesh.userData.disposeComplete, true);
  assert.equal(bossProjectileMesh.userData.disposeComplete, true);
  assert.equal(vfxMesh.userData.disposeComplete, true);
  assert.equal(player.isAcidCorroded, false);
  assert.equal(player.acidTimer, 0);
  assert.equal(player.isCloaked, false);
  assert.equal(player.inQTE, false);
  assert.equal(player.qteTimer, 0);
  assert.equal(player.isSelfDestructing, false);
  assert.equal(player.selfDestructComplete, false);
  assert.equal(player.isDead, false);
  assert.equal(player.defeatReason, null);
  assert.equal(player.health, player.maxHealth);
  assert.equal(player.energy, player.maxEnergy);
  assert.equal(player.stamina, player.maxStamina);
  assert.equal(player.mesh.visible, true);
  assert.equal(game.enemyDamageCooldown, 0);
  assert.equal(game.goliathChargeWindow, 0);
  assert.equal(game.goliathChargeLatched, false);
  assert.equal(game.trophyHarvested, false);
  assert.equal(game.huntResultShown, false);
  assert.equal(game.isScopeZooming, false);
  assert.equal(game.timeScale, 1);
});
