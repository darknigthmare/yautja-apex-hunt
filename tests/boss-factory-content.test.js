import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { createBoss } from '../src/gameplay/BossFactory.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const COMMON_FIELDS = [
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
];

test('la factory construit les dix familles de boss avec une interface homogène', () => {
  for (const bossType of [
    'megafauna',
    'xenoQueen',
    'badBlood',
    'predalien',
    'superPredator',
    'feralPredator',
    'wolfCleaner',
    'kalisk',
    'upgradePredator',
    'cityHunter',
  ]) {
    const scene = new THREE.Scene();
    const boss = createBoss(scene, { bossType });

    for (const field of COMMON_FIELDS) {
      assert.ok(field in boss, `${bossType} doit exposer ${field}`);
    }
    for (const method of ['update', 'takeDamage', 'applyNet', 'setVisionMode', 'dispose']) {
      assert.equal(typeof boss[method], 'function', `${bossType} doit exposer ${method}()`);
    }
    assert.ok(scene.children.includes(boss.mesh), `${bossType} doit être ajouté à la scène`);
    boss.dispose();
  }
});

test('la factory refuse un bossType inconnu avec un diagnostic actionnable', () => {
  assert.throws(
    () => createBoss(new THREE.Scene(), { bossType: 'inconnu' }),
    /Type de boss.*inconnu.*megafauna.*superPredator/,
  );
});

test('le Super Predator alterne plasma lourd, charge et mêlée sans temporisateur mural', () => {
  const scene = new THREE.Scene();
  const boss = createBoss(scene, { bossType: 'superPredator' });
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);

  boss.update(0.016, new THREE.Vector3(60, 0, 0), false);
  assert.equal(boss.aiState, 'heavy_plasma');
  assert.equal(boss.projectiles.length, 1);
  assert.equal(boss.projectiles[0].damage, 46);
  const projectileStart = boss.projectiles[0].mesh.position.clone();
  boss.update(0.1, new THREE.Vector3(60, 0, 0), false);
  assert.ok(boss.projectiles[0].mesh.position.distanceTo(projectileStart) > 0);

  boss.attackCooldown = 0;
  boss.update(0.016, new THREE.Vector3(20, 0, 0), false);
  assert.equal(boss.aiState, 'charge');
  assert.ok(boss.chargeTimer > 0);

  boss.chargeTimer = 0;
  boss.attackCooldown = 0;
  boss.update(0.016, new THREE.Vector3(5, 0, 0), false);
  assert.equal(boss.aiState, 'melee');
  assert.equal(boss.consumeAttackImpact(), true);

  const source = readFileSync(join(ROOT, 'src/entities/SuperPredatorBoss.js'), 'utf8');
  assert.equal(source.includes('setTimeout('), false);
  boss.dispose();
});

test('le masque casse sous 60 %, la rage débute sous 50 % et la mort nettoie le plasma', () => {
  const scene = new THREE.Scene();
  const boss = createBoss(scene, { bossType: 'superPredator' });
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);

  boss.update(0.016, new THREE.Vector3(60, 0, 0), false);
  assert.equal(boss.projectiles.length, 1);

  boss.takeDamage(710, new THREE.Vector3(0, 4, 0));
  assert.equal(boss.maskIntact, true, 'le masque tient encore au-dessus du seuil');
  boss.takeDamage(25, new THREE.Vector3(0, 9.45, 1.03));
  assert.equal(boss.maskIntact, false, 'un impact sous 60 % brise le masque');
  assert.ok(boss.trophyIntegrity < 100);
  assert.equal(boss.isEnraged, false);

  boss.takeDamage(170, boss.position);
  assert.equal(boss.isEnraged, true);

  boss.takeDamage(5000, boss.position);
  assert.equal(boss.health, 0);
  assert.equal(boss.isDead, true);
  assert.equal(boss.aiState, 'dead');
  assert.deepEqual(boss.projectiles, []);

  const mesh = boss.mesh;
  boss.dispose();
  assert.equal(scene.children.includes(mesh), false);
});
