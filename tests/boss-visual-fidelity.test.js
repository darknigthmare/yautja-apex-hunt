import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import {
  BOSS_VISUAL_PROFILES,
  countBossVisualTriangles,
} from '../src/gameplay/BossVisualDetail.js';
import { createBoss } from '../src/gameplay/BossFactory.js';

const BOSS_CASES = Object.freeze([
  ['megafauna', 'goliath'],
  ['xenoQueen', 'queen'],
  ['badBlood', 'bad_blood'],
  ['predalien', 'predalien'],
  ['superPredator', 'super_predator'],
  ['upgradePredator', 'super_predator'],
  ['feralPredator', 'feral'],
  ['wolfCleaner', 'wolf'],
  ['kalisk', 'kalisk'],
  ['cityHunter', 'city_hunter'],
]);

function collectFeatureTags(root) {
  const tags = new Set();
  root.traverse((object) => {
    if (object.userData?.featureTag) tags.add(object.userData.featureTag);
  });
  return tags;
}

function collectMeshes(root) {
  const meshes = [];
  root.traverse((object) => {
    if (object.isMesh) meshes.push(object);
  });
  return meshes;
}

test('les dix boss reçoivent une couche géométrique HD au-dessus de 10k triangles', (t) => {
  for (const [bossType, archetype] of BOSS_CASES) {
    const scene = new THREE.Scene();
    const boss = createBoss(scene, { bossType });
    const detail = boss.mesh.getObjectByName(`bossVisualDetail:${archetype}`);

    assert.ok(detail?.isGroup, `${bossType} doit recevoir son groupe visuel HD`);
    assert.equal(detail, boss.visualDetail);
    assert.equal(detail.userData.archetype, archetype);

    const detailTriangles = countBossVisualTriangles(detail);
    const totalTriangles = countBossVisualTriangles(boss.mesh);
    assert.ok(detailTriangles >= 10_000, `${bossType}: ${detailTriangles} triangles HD, minimum 10000`);
    assert.ok(totalTriangles >= detailTriangles);
    assert.equal(detail.userData.triangleCount, detailTriangles);

    const featureTags = collectFeatureTags(detail);
    for (const feature of BOSS_VISUAL_PROFILES[archetype].features) {
      assert.ok(featureTags.has(feature), `${bossType} doit exposer la caractéristique ${feature}`);
    }
    assert.deepEqual(
      detail.userData.runtimeTexturePaths,
      [...BOSS_VISUAL_PROFILES[archetype].texturePaths],
      `${bossType} doit documenter les textures runtime employées`,
    );

    const meshes = collectMeshes(detail);
    assert.ok(meshes.length >= 10, `${bossType} doit être composé de plusieurs volumes lisibles`);
    assert.ok(
      meshes.every((mesh) => mesh.userData.baseMaterial),
      `${bossType} doit recapturer la matière de chaque nouveau mesh`,
    );
    if (bossType !== 'badBlood') {
      assert.ok(meshes.every((mesh) => (
        mesh.userData.visionExempt === true || mesh.userData.baseMaterial === mesh.material
      )));
    }

    t.diagnostic(`${bossType}: ${detailTriangles} triangles HD, ${totalTriangles} triangles au total, ${meshes.length} meshes`);
    boss.dispose();
    assert.equal(detail.parent, null, `${bossType} doit nettoyer le groupe HD au dispose`);
    assert.equal(detail.userData.disposeComplete, true);
  }
});

test('les matériaux HD suivent la vision thermique et l’occultation Bad Blood', () => {
  const wolf = createBoss(new THREE.Scene(), { bossType: 'wolfCleaner' });
  const wolfMesh = collectMeshes(wolf.visualDetail).find((mesh) => mesh.userData.visionExempt !== true);
  const wolfBaseMaterial = wolfMesh.material;
  wolf.setVisionMode('thermal');
  assert.equal(wolfMesh.material, wolf.thermalMaterial);
  wolf.setVisionMode('normal');
  assert.equal(wolfMesh.material, wolfBaseMaterial);
  wolf.dispose();

  const badBlood = createBoss(new THREE.Scene(), { bossType: 'badBlood' });
  const rivalMesh = collectMeshes(badBlood.visualDetail)[0];
  assert.equal(rivalMesh.material, badBlood.cloakMaterial, 'la greffe doit respecter l’occultation initiale');
  badBlood.takeDamage(1);
  assert.equal(rivalMesh.material, rivalMesh.userData.baseMaterial, 'la matière HD doit être restaurée au décloak');
  badBlood.dispose();
});

test('les détails destructibles restent synchronisés avec les phases de combat', () => {
  const superPredator = createBoss(new THREE.Scene(), { bossType: 'superPredator' });
  superPredator.breakMask();
  const tusks = collectMeshes(superPredator.visualDetail)
    .filter((mesh) => mesh.userData.featureTag === 'tusked_biomask');
  assert.ok(tusks.length > 0);
  assert.ok(tusks.every((mesh) => mesh.visible === false));
  superPredator.dispose();

  const kalisk = createBoss(new THREE.Scene(), { bossType: 'kalisk' });
  const cores = collectMeshes(kalisk.visualDetail)
    .filter((mesh) => mesh.userData.featureTag === 'regenerative_core');
  assert.ok(cores.length > 0);
  assert.ok(cores.every((mesh) => mesh.visible === false), 'le noyau reste caché sous la carapace');
  kalisk.exposeCore();
  assert.ok(cores.every((mesh) => mesh.visible === true), 'le noyau HD suit son exposition gameplay');
  kalisk.dispose();
});
