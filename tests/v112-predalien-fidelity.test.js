import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { PredalienBoss, PREDALIEN_TEXTURES } from '../src/entities/PredalienBoss.js';
import { createBoss } from '../src/gameplay/BossFactory.js';
import { countBossVisualTriangles } from '../src/gameplay/BossVisualDetail.js';

function collectMeshes(root) {
  const meshes = [];
  root.traverse((object) => {
    if (object.isMesh) meshes.push(object);
  });
  return meshes;
}

function collectFeatures(root) {
  const tags = new Set();
  root.traverse((object) => {
    if (object.userData?.featureTag) tags.add(object.userData.featureTag);
  });
  return tags;
}

test('le Predalien Gunnison conserve son contrat de boss et ses deux points faibles', () => {
  const boss = new PredalienBoss(new THREE.Scene());
  assert.equal(boss.maxHealth, 2000);
  assert.equal(boss.health, 2000);
  assert.equal(boss.colliderRadius, 6.5);
  assert.equal(boss.headHealth, 350);
  assert.equal(boss.tailHealth, 400);
  assert.equal(boss.headIntact, true);
  assert.equal(boss.tailIntact, true);
  assert.deepEqual(PREDALIEN_TEXTURES, {
    carapace: '/assets/textures/xeno-carapace.webp',
    yautjaSkin: '/assets/textures/yautja-skin-mottled.webp',
  });
  assert.match(boss.mesh.userData.provenance, /AVPR_SCREEN.*original procedural/i);

  for (const method of [
    'update',
    'takeDamage',
    'applyNet',
    'startTelegraphedAttack',
    'updateTelegraphedAttack',
    'consumeAttackImpact',
    'cancelTelegraphedAttack',
    'setVisionMode',
    'dispose',
  ]) assert.equal(typeof boss[method], 'function', `contrat manquant : ${method}()`);

  boss.takeDamage(360, boss.position.clone().add(new THREE.Vector3(0, 10, 5)));
  assert.equal(boss.headIntact, false);
  assert.equal(boss.headMesh.visible, false);

  boss.takeDamage(410, boss.position.clone().add(new THREE.Vector3(0, 2, -18)));
  assert.equal(boss.tailIntact, false);
  assert.equal(boss.tailMesh.visible, false);
  boss.dispose();
});

test('la silhouette procédurale native dépasse 100k triangles sans fondation générique redondante', () => {
  const directBoss = new PredalienBoss(new THREE.Scene());
  const baseTriangles = countBossVisualTriangles(directBoss.mesh);
  const baseMeshes = collectMeshes(directBoss.mesh);
  assert.ok(baseTriangles >= 100_000, `${baseTriangles} triangles, minimum HD 100000`);
  assert.ok(baseTriangles <= 115_000, `${baseTriangles} triangles, plafond natif 115000`);
  assert.ok(baseMeshes.length >= 140, `${baseMeshes.length} meshes, minimum HD 140`);
  assert.ok(baseMeshes.length <= 155, `${baseMeshes.length} meshes, plafond natif 155`);
  assert.ok(baseMeshes.every((mesh) => mesh.name.length > 0), 'chaque pièce doit porter un nom de production');
  assert.equal(
    baseMeshes.filter((mesh) => mesh.geometry.type === 'BoxGeometry').length,
    0,
    'aucune boîte ne doit porter la silhouette principale',
  );

  const features = collectFeatures(directBoss.mesh);
  for (const feature of [
    'hybrid_multi_plate_crest',
    'external_yautja_mandibles',
    'animated_inner_jaw',
    'four_dorsal_tubes',
    'ribbed_hybrid_torso',
    'articulated_claw_limbs',
    'digitigrade_legs',
    'segmented_spear_tail',
    'biomechanical_dreads',
    'cranial_quills',
  ]) assert.ok(features.has(feature), `signature anatomique absente : ${feature}`);
  directBoss.dispose();

  const productionBoss = createBoss(new THREE.Scene(), { bossType: 'predalien' });
  const totalTriangles = countBossVisualTriangles(productionBoss.mesh);
  const productionMeshes = collectMeshes(productionBoss.mesh);
  assert.equal(productionBoss.nativeHighDetail, true);
  assert.equal(productionBoss.visualDetail, productionBoss.mesh);
  assert.equal(productionBoss.visualDetail.userData.nativeHighDetail, true);
  assert.equal(productionBoss.visualDetail.userData.bossVisualDetail.nativeHighDetail, true);
  assert.equal(totalTriangles, baseTriangles, 'la factory ne doit ajouter aucun triangle au rig natif');
  assert.equal(productionMeshes.length, baseMeshes.length, 'la factory doit retirer les 32 draws génériques redondants');
  assert.ok(totalTriangles <= 115_000, `${totalTriangles} triangles, plafond de production 115000`);
  assert.ok(productionMeshes.length <= 155, `${productionMeshes.length} meshes, plafond de production 155`);
  assert.equal(productionBoss.mesh.getObjectByName('bossVisualDetail:predalien'), undefined);
  productionBoss.dispose();
});

test('idle, course, morsure, queue, frénésie et impact déplacent réellement le rig', () => {
  const boss = new PredalienBoss(new THREE.Scene());
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);
  boss.attackCooldown = 10;
  const rig = boss.animationRig;

  const idleY = rig.torsoRig.position.y;
  boss.update(0.12, new THREE.Vector3(0, 0, 200), false);
  assert.notEqual(rig.torsoRig.position.y, idleY, 'la respiration doit déplacer le thorax');

  const shoulderBefore = rig.shoulders[0].rotation.x;
  const hipBefore = rig.hips[0].rotation.x;
  boss.update(0.12, new THREE.Vector3(0, 0, 55), false);
  assert.notEqual(rig.shoulders[0].rotation.x, shoulderBefore, 'la course doit balancer les épaules');
  assert.notEqual(rig.hips[0].rotation.x, hipBefore, 'la course doit articuler les hanches');

  boss.attackCooldown = 0;
  boss.update(0.016, boss.position.clone().add(new THREE.Vector3(0, 0, 8)), false);
  assert.equal(boss.aiState, 'attack_jaw');
  const jawRest = rig.innerJaw.position.z;
  boss.updateVisualAnimation(0.1, false);
  assert.ok(rig.innerJaw.position.z > jawRest, 'la morsure doit projeter la mâchoire interne');
  assert.notEqual(rig.mandiblePivots[0].rotation.y, 0, 'les mandibules externes doivent s’ouvrir');

  boss.jawAttackTimer = 0;
  boss.cancelTelegraphedAttack();
  boss.attackCooldown = 0;
  boss.update(0.016, boss.position.clone().add(new THREE.Vector3(0, 0, 20)), false);
  assert.equal(boss.activeTelegraphedAttack, 'attack_tail');
  const tailWindup = rig.tailGroup.rotation.y;
  boss.update(0.2, boss.position.clone().add(new THREE.Vector3(0, 0, 20)), false);
  assert.notEqual(rig.tailGroup.rotation.y, tailWindup, 'la queue doit armer son balayage');

  boss.cancelTelegraphedAttack();
  boss.isEnraged = true;
  boss.attackCooldown = 0;
  boss.update(0.016, boss.position.clone().add(new THREE.Vector3(0, 0, 18)), false);
  assert.equal(boss.activeTelegraphedAttack, 'acid_frenzy');
  const dreadBefore = rig.dreadPivots[0].rotation.x;
  boss.update(0.2, boss.position.clone().add(new THREE.Vector3(0, 0, 18)), false);
  assert.notEqual(rig.dreadPivots[0].rotation.x, dreadBefore, 'la frénésie doit fouetter les dreads');

  boss.cancelTelegraphedAttack();
  boss.takeDamage(10, boss.position.clone());
  const hitBefore = boss.mesh.rotation.z;
  boss.updateVisualAnimation(0.05, false);
  assert.notEqual(boss.mesh.rotation.z, hitBefore, 'un impact doit provoquer une réaction corporelle');
  boss.dispose();
});

test('les attaques télégraphiées conservent délai, signal et consommation unique', () => {
  const boss = new PredalienBoss(new THREE.Scene());
  const target = new THREE.Vector3(0, 0, 20);
  boss.position.set(0, 0, 0);
  boss.mesh.position.copy(boss.position);

  boss.update(0.016, target, false);
  assert.equal(boss.activeTelegraphedAttack, 'attack_tail');
  assert.equal(boss.attackWindupDuration, 0.52);
  assert.equal(boss.attackCooldown, 3.2);
  assert.equal(boss.consumeAttackImpact(), false);
  boss.update(0.51, target, false);
  boss.update(0.02, target, false);
  assert.equal(boss.consumeAttackImpact(), true);
  assert.equal(boss.consumeAttackImpact(), false);

  boss.cancelTelegraphedAttack();
  boss.isEnraged = true;
  boss.attackCooldown = 0;
  boss.update(0.016, new THREE.Vector3(0, 0, 18), false);
  assert.equal(boss.activeTelegraphedAttack, 'acid_frenzy');
  assert.equal(boss.attackWindupDuration, 0.52);
  assert.equal(boss.attackCooldown, 4.2);
  boss.dispose();
});
