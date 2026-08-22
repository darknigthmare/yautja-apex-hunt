import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import {
  FERAL_PREDATOR_TEXTURES,
  FeralPredatorBoss,
} from '../src/entities/FeralPredatorBoss.js';

globalThis.window ??= { addEventListener() {} };
const { Game } = await import('../src/main.js');

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('le Feral expose le contrat boss et une silhouette procédurale équipée', () => {
  assert.throws(() => new FeralPredatorBoss(null), /scène THREE valide/);

  const scene = new THREE.Scene();
  const boss = new FeralPredatorBoss(scene);

  for (const field of [
    'mesh',
    'position',
    'health',
    'maxHealth',
    'isDead',
    'isEnraged',
    'isNetted',
    'netTimer',
    'aiState',
    'attackCooldown',
    'projectiles',
    'colliderRadius',
    'shieldIntegrity',
    'shieldDeployed',
  ]) {
    assert.ok(field in boss, `le contrat doit exposer ${field}`);
  }
  for (const method of ['update', 'takeDamage', 'applyNet', 'setVisionMode', 'dispose']) {
    assert.equal(typeof boss[method], 'function', `le contrat doit exposer ${method}()`);
  }

  assert.equal(FERAL_PREDATOR_TEXTURES.boneComposite, '/assets/textures/feral-bone-composite.webp');
  assert.equal(boss.mesh.userData.silhouette, 'feral_bone_hunter');
  assert.ok(boss.mesh.getObjectByName('feralBoneMask'));
  assert.ok(boss.mesh.getObjectByName('feralCollapsibleSpear'));
  assert.ok(boss.mesh.getObjectByName('feralCrossboltLauncher'));
  assert.ok(boss.mesh.getObjectByName('feralDeployableShield'));
  assert.equal(boss.shieldMesh.visible, false);
  assert.ok(scene.children.includes(boss.mesh));

  boss.setVisionMode('thermal');
  assert.equal(boss.setVisionMode('normal'), true);

  const mesh = boss.mesh;
  assert.equal(boss.dispose(), true);
  assert.equal(scene.children.includes(mesh), false);
  assert.equal(boss.dispose(), false, 'dispose reste idempotent');
});

test('le lance-traits tire une salve mobile de trois crossbolts', () => {
  const scene = new THREE.Scene();
  const boss = new FeralPredatorBoss(scene);
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);

  boss.update(0.016, new THREE.Vector3(60, 0, 0), false);
  assert.equal(boss.aiState, 'crossbolt');
  assert.equal(boss.activeAttackType, 'crossbolt_volley');
  assert.equal(boss.projectiles.length, 3);
  boss.projectiles.forEach((projectile) => {
    assert.equal(projectile.type, 'crossbolt');
    assert.equal(projectile.damage, 28);
    assert.ok(projectile.mesh.parent === scene);
  });

  const starts = boss.projectiles.map(({ mesh }) => mesh.position.clone());
  boss.update(0.1, new THREE.Vector3(60, 0, 0), false);
  boss.projectiles.forEach(({ mesh }, index) => {
    assert.ok(mesh.position.distanceTo(starts[index]) > 0, 'chaque trait avance avec le delta');
  });

  const source = readFileSync(join(ROOT, 'src/entities/FeralPredatorBoss.js'), 'utf8');
  assert.equal(source.includes('setTimeout('), false, 'aucun temporisateur mural dans le boss');
  boss.dispose();
});

test('le bouclier frontal absorbe les dégâts, conserve son intégrité puis se brise', () => {
  const scene = new THREE.Scene();
  const boss = new FeralPredatorBoss(scene);
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);

  boss.takeDamage(500, new THREE.Vector3(0, 4, -8));
  assert.equal(boss.health, 1050);
  boss.update(0.016, new THREE.Vector3(40, 0, 0), false);
  assert.equal(boss.aiState, 'shield');
  assert.equal(boss.shieldDeployed, true);
  assert.equal(boss.shieldMesh.visible, true);

  // Le point d'impact suit l'orientation courante du bouclier pendant que le
  // boss termine son pivot vers la cible.
  const frontImpact = new THREE.Vector3(
    Math.sin(boss.mesh.rotation.y) * 10,
    4,
    Math.cos(boss.mesh.rotation.y) * 10,
  );
  const blocked = boss.takeDamage(140, frontImpact);
  assert.equal(blocked.absorbed, 140);
  assert.equal(blocked.damage, 0);
  assert.equal(boss.health, 1050);
  assert.equal(boss.shieldIntegrity, 220);

  const broken = boss.takeDamage(300, frontImpact);
  assert.equal(broken.absorbed, 220);
  assert.equal(broken.damage, 80);
  assert.equal(broken.shieldBroken, true);
  assert.equal(boss.health, 970);
  assert.equal(boss.shieldIntegrity, 0);
  assert.equal(boss.shieldIntact, false);
  assert.equal(boss.shieldDeployed, false);
  assert.equal(boss.shieldMesh.visible, false);
  assert.equal(boss.deployShield(), false, 'un bouclier détruit ne peut pas être redéployé');
  boss.dispose();
});

test('la mêlée du jeu transmet la position du joueur et contourne réellement le bouclier par derrière', () => {
  const scene = new THREE.Scene();
  const boss = new FeralPredatorBoss(scene);
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);
  boss.mesh.rotation.y = 0;
  assert.equal(boss.deployShield(), true);

  const game = Object.create(Game.prototype);
  game.isGameStarted = true;
  game.isPaused = false;
  game.gameState = 'HUNT';
  game.activeBoss = boss;
  game.activeEnemies = [];
  game.player = {
    position: new THREE.Vector3(0, 0, -5),
    selectedWeapon: 1,
    meleeDamageMultiplier: 1,
    attack: () => 'wristblades',
    addHonor() {},
  };
  game.isPlayerCombatDisabled = () => false;
  game.hud = { showLogMessage() {} };
  game.spawnBloodSpatterVFX = () => {};

  const shieldBefore = boss.shieldIntegrity;
  game.performAttack();
  assert.ok(boss.health < boss.maxHealth, 'le coup arrière atteint la santé du Feral');
  assert.equal(boss.shieldIntegrity, shieldBefore, 'le bouclier frontal ne protège pas son dos');
  boss.dispose();
});

test('la lance enchaîne charge télégraphiée et estoc à impact unique', () => {
  const scene = new THREE.Scene();
  const boss = new FeralPredatorBoss(scene);
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);

  boss.update(0.016, new THREE.Vector3(20, 0, 0), false);
  assert.equal(boss.aiState, 'charge');
  assert.equal(boss.activeAttackType, 'spear_charge');
  assert.ok(boss.chargeTimer > 0);

  for (let index = 0; index < 4; index += 1) {
    boss.update(0.2, new THREE.Vector3(20, 0, 0), false);
  }
  assert.equal(boss.attackImpactReady, true);
  assert.equal(boss.consumeAttackImpact(), true);
  assert.equal(boss.consumeAttackImpact(), false, 'la même charge ne frappe jamais deux fois');

  boss.chargeTimer = 0;
  boss.attackCooldown = 0;
  boss.attackImpactConsumed = false;
  boss.update(0.016, boss.position.clone().add(new THREE.Vector3(5, 0, 0)), false);
  assert.equal(boss.aiState, 'melee_windup');
  assert.equal(boss.activeAttackType, 'spear_thrust');
  assert.equal(boss.consumeAttackImpact(), false, 'le télégraphe laisse une vraie fenêtre d’esquive');
  boss.update(0.2, boss.position.clone().add(new THREE.Vector3(5, 0, 0)), false);
  assert.equal(boss.consumeAttackImpact(), false);
  boss.update(0.2, boss.position.clone().add(new THREE.Vector3(5, 0, 0)), false);
  assert.equal(boss.aiState, 'melee');
  assert.equal(boss.consumeAttackImpact(), true);
  boss.dispose();
});

test('filet et mort annulent les attaques et nettoient les projectiles', () => {
  const scene = new THREE.Scene();
  const boss = new FeralPredatorBoss(scene);
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);
  boss.update(0.016, new THREE.Vector3(70, 0, 0), false);
  assert.equal(boss.projectiles.length, 3);

  assert.equal(boss.applyNet(), true);
  assert.equal(boss.aiState, 'netted');
  const frozenPosition = boss.position.clone();
  boss.update(0.5, new THREE.Vector3(5, 0, 0), false);
  assert.ok(boss.position.equals(frozenPosition));

  boss.takeDamage(5000, boss.position);
  assert.equal(boss.isDead, true);
  assert.equal(boss.aiState, 'dead');
  assert.deepEqual(boss.projectiles, []);
  boss.dispose();
});
