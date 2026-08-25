import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { GridAlienBoss, GRID_ALIEN_TEXTURES } from '../src/entities/GridAlienBoss.js';
import { createBoss } from '../src/gameplay/BossFactory.js';
import { countBossVisualTriangles } from '../src/gameplay/BossVisualDetail.js';

function advanceAttack(boss, playerPosition, frames = 6) {
  for (let frame = 0; frame < frames; frame += 1) boss.update(0.2, playerPosition, false);
}

function collectFeatureMeshes(root, featureTag) {
  const meshes = [];
  root.traverse((object) => {
    if (object.isMesh && object.userData.featureTag === featureTag) meshes.push(object);
  });
  return meshes;
}

test('Grid Alien expose le contrat de boss v1.11 et une provenance AVP_SCREEN explicite', () => {
  const scene = new THREE.Scene();
  const boss = createBoss(scene, { bossType: 'gridAlien' });

  assert.ok(boss instanceof GridAlienBoss);
  assert.equal(boss.maxHealth, 2350);
  assert.equal(boss.health, 2350);
  assert.equal(boss.colliderRadius, 5.8);
  assert.equal(boss.headIntact, true);
  assert.equal(boss.tailIntact, true);
  assert.deepEqual(boss.projectiles, []);
  assert.match(boss.mesh.userData.provenance, /AVP_SCREEN.*original procedural/i);
  assert.deepEqual(GRID_ALIEN_TEXTURES, {
    carapace: '/assets/textures/xeno-carapace.webp',
    hiveMembrane: '/assets/textures/hive-biomechanical-membrane.webp',
  });

  for (const method of [
    'update',
    'takeDamage',
    'applyNet',
    'getAimPoint',
    'resolveProjectileImpact',
    'tickTransientState',
    'consumeAttackImpact',
    'dispose',
  ]) assert.equal(typeof boss[method], 'function', `contrat manquant : ${method}()`);

  const mesh = boss.mesh;
  boss.dispose();
  assert.equal(scene.children.includes(mesh), false);
});

test('la silhouette HD de Grid dépasse 10k triangles et conserve toutes ses signatures', () => {
  const boss = createBoss(new THREE.Scene(), { bossType: 'gridAlien' });
  assert.equal(boss.visualDetail.userData.archetype, 'grid_alien');
  assert.ok(countBossVisualTriangles(boss.visualDetail) >= 10_000);
  assert.deepEqual(boss.visualDetail.userData.runtimeTexturePaths, [
    '/assets/textures/xeno-carapace.webp',
    '/assets/textures/hive-biomechanical-membrane.webp',
  ]);

  for (const feature of [
    'elongated_translucent_dome',
    'dorsal_tubes',
    'inner_jaw',
    'segmented_blade_tail',
    'permanent_grid_acid_scars',
  ]) {
    assert.ok(collectFeatureMeshes(boss.visualDetail, feature).length > 0, `silhouette Grid sans ${feature}`);
  }

  const scars = collectFeatureMeshes(boss.visualDetail, 'permanent_grid_acid_scars');
  boss.isEnraged = true;
  boss.syncDamageVisuals();
  assert.ok(scars.every((scar) => scar.visible), 'les cicatrices quadrillées ne dépendent pas de la phase');
  boss.dispose();
});

test('la volée acide est télégraphiée puis produit des projectiles déterministes', () => {
  const scene = new THREE.Scene();
  const boss = createBoss(scene, { bossType: 'gridAlien' });
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);
  const playerPosition = new THREE.Vector3(0, 0, 52);

  boss.update(0.016, playerPosition, false);
  assert.equal(boss.activeAttackType, 'grid_acid_volley');
  assert.equal(boss.aiState, 'acid_spray');
  assert.equal(boss.attackImpactReady, false);
  assert.equal(boss.projectiles.length, 0);

  advanceAttack(boss, playerPosition, 4);
  assert.equal(boss.projectiles.length, 3);
  for (const projectile of boss.projectiles) {
    assert.equal(projectile.type, 'grid_acid');
    assert.equal(projectile.signal, 'grid_acid_volley');
    assert.equal(projectile.damage, 23);
    assert.equal(projectile.statusEffect, 'corrosion');
    assert.equal(projectile.statusDuration, 2.8);
  }

  const start = boss.projectiles[0].mesh.position.clone();
  boss.tickTransientState(0.1);
  assert.ok(boss.projectiles[0].mesh.position.distanceTo(start) > 0);
  boss.dispose();
  assert.deepEqual(boss.projectiles, []);
});

test('morsure, bond et balayage ont chacun une préparation puis une fenêtre d’impact', () => {
  const boss = new GridAlienBoss(new THREE.Scene());
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);

  const cases = [
    ['bite', new THREE.Vector3(0, 0, 6), 'grid_bite', 'attack_jaw'],
    ['pounce', new THREE.Vector3(0, 0, 25), 'grid_pounce', 'attack_jaw'],
    ['tail', new THREE.Vector3(0, 0, 13), 'grid_tail_sweep', 'attack_tail'],
  ];
  for (const [kind, target, attackType, impactState] of cases) {
    boss.cancelAttack();
    assert.equal(boss.startAttack(kind, target), true);
    assert.equal(boss.activeAttackType, attackType);
    assert.equal(boss.attackImpactReady, false);
    for (let frame = 0; frame < 10 && !boss.attackImpactReady; frame += 1) {
      boss.update(0.1, target, false);
    }
    assert.equal(boss.aiState, impactState);
    assert.equal(boss.consumeAttackImpact(), true);
    assert.equal(boss.consumeAttackImpact(), false);
  }
  boss.dispose();
});

test('les impacts segmentés brisent tête et queue, changent la visée et projettent le sang acide', () => {
  const scene = new THREE.Scene();
  const boss = createBoss(scene, { bossType: 'gridAlien' });
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);

  const originalAimPoint = boss.getAimPoint();
  const headPosition = boss.getHeadWorldPosition();
  const headRayStart = headPosition.clone().add(new THREE.Vector3(0, 0, 20));
  assert.ok(boss.resolveProjectileImpact(headPosition, 0.5, headRayStart)?.distanceTo(headPosition) < 1e-8);
  const headOutcome = boss.takeDamage(440, headPosition);
  assert.equal(headOutcome.headHit, true);
  assert.equal(boss.headIntact, false);
  assert.ok(boss.getAimPoint().distanceTo(originalAimPoint) > 1);
  assert.ok(boss.projectiles.some(({ type }) => type === 'grid_acid_blood'));

  boss.acidBloodCooldown = 0;
  const tailPosition = boss.getTailWorldPosition();
  const tailRayStart = tailPosition.clone().add(new THREE.Vector3(0, 0, -18));
  assert.ok(boss.resolveProjectileImpact(tailPosition, 0.5, tailRayStart)?.distanceTo(tailPosition) < 1e-8);
  const tailOutcome = boss.takeDamage(480, tailPosition);
  assert.equal(tailOutcome.tailHit, true);
  assert.equal(boss.tailIntact, false);
  assert.equal(boss.tailGroup.visible, false);

  const domeDetails = collectFeatureMeshes(boss.visualDetail, 'elongated_translucent_dome');
  const tailDetails = collectFeatureMeshes(boss.visualDetail, 'segmented_blade_tail');
  assert.ok(domeDetails.every((mesh) => mesh.visible === false));
  assert.ok(tailDetails.every((mesh) => mesh.visible === false));
  boss.dispose();
});

test('filet, rage et mort interrompent les attaques et nettoient toute offense', () => {
  const boss = new GridAlienBoss(new THREE.Scene());
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);
  boss.startAttack('acid', new THREE.Vector3(0, 0, 45));
  advanceAttack(boss, new THREE.Vector3(0, 0, 45), 4);
  assert.ok(boss.projectiles.length > 0);

  assert.equal(boss.applyNet(), true);
  assert.equal(boss.isNetted, true);
  assert.equal(boss.activeAttackType, null);
  boss.update(1.2, new THREE.Vector3(0, 0, 45), false);
  assert.equal(boss.isNetted, true, 'delta est borné pour éviter une libération instantanée');

  boss.takeDamage(1200, boss.getBodyWorldPosition());
  assert.equal(boss.isEnraged, true);
  boss.takeDamage(5000, boss.getBodyWorldPosition());
  assert.equal(boss.isDead, true);
  assert.equal(boss.aiState, 'dead');
  assert.deepEqual(boss.projectiles, []);
  boss.dispose();
});
