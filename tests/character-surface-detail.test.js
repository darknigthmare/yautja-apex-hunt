import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { AVAILABLE_HUNT_NPC_ARCHETYPES, HuntNPC } from '../src/entities/HuntNPC.js';
import { PredalienBoss } from '../src/entities/PredalienBoss.js';
import { JungleHunterBoss } from '../src/entities/JungleHunterBoss.js';
import { CityHunterBoss } from '../src/entities/CityHunterBoss.js';
import { GridAlienBoss } from '../src/entities/GridAlienBoss.js';
import { createBoss } from '../src/gameplay/BossFactory.js';
import { countBossVisualTriangles } from '../src/gameplay/BossVisualDetail.js';

test('31 close NPC models have bounded instanced details which disappear with the distant LOD', () => {
  for (const type of Object.keys(AVAILABLE_HUNT_NPC_ARCHETYPES)) {
    const npc = new HuntNPC(type);
    const detail = npc.mesh.children.filter(node => node.userData.characterDetail);
    assert.ok(detail.length >= 2 && detail.length <= 3, `${type}: expected 2–3 detail draws`);
    assert.ok(detail.every(node => node.isInstancedMesh && node.count >= 2));
    assert.ok(countBossVisualTriangles(npc.mesh) < 12_500, `${type}: near triangle budget exceeded`);
    assert.ok(npc.mesh.userData.nearSurfaceDetail.refinedContours > 0, `${type}: curved contour refinement absent`);
    assert.ok(detail.some(node => node.material.normalMap?.isDataTexture), `${type}: surface detail absent`);
    npc.update(0, { player: { position: new THREE.Vector3(0, 0, 500) } });
    assert.ok(detail.every(node => !node.visible), `${type}: close details still visible at long range`);
    npc.dispose();
  }
});

function materialColors(root) {
  const colors = [];
  root.traverse(node => {
    const source = node.userData.baseMaterial ?? node.material;
    for (const material of Array.isArray(source) ? source : [source]) {
      if (material?.color) colors.push(material.color.getHex());
    }
  });
  return colors;
}

test('native Predalien, Grid, Jungle Hunter and City Hunter retain geometry and colors with surface finishing', () => {
  for (const [type, Constructor] of [['predalien', PredalienBoss], ['gridAlien', GridAlienBoss], ['jungleHunter', JungleHunterBoss], ['cityHunter', CityHunterBoss]]) {
    const original = new Constructor(new THREE.Scene());
    const finished = createBoss(new THREE.Scene(), { bossType: type });
    assert.equal(countBossVisualTriangles(finished.mesh), countBossVisualTriangles(original.mesh), `${type}: native anatomy was duplicated`);
    assert.deepEqual(materialColors(finished.mesh), materialColors(original.mesh), `${type}: palette changed`);
    let surfaceMaterials = 0;
    finished.mesh.traverse(node => {
      if (node.material?.userData.surfaceDetail) surfaceMaterials++;
    });
    assert.ok(surfaceMaterials > 0, `${type}: no PBR surface finishing`);
    original.dispose();
    finished.dispose();
  }
});

test('Goliath and Queen replace their exposed body/head blocks with organic volumes', () => {
  for (const type of ['megafauna', 'xenoQueen']) {
    const boss = createBoss(new THREE.Scene(), { bossType: type });
    const replacements = boss.mesh.children.filter(node => node.userData.replacesLegacyBlock);
    assert.equal(replacements.length, 2, `${type}: body/head were covered instead of replaced`);
    assert.ok(replacements.every(node => node.geometry.type === 'SphereGeometry'));
    assert.ok(countBossVisualTriangles(boss.mesh) < 65_000, `${type}: redundant anatomy inflated the budget`);
    assert.equal(boss.colliderRadius, type === 'megafauna' ? 6.5 : 4.5);
    boss.dispose();
  }
});

test('triangle budgets include every instance rather than only its source geometry', () => {
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial(), 7);
  assert.equal(countBossVisualTriangles(mesh), 12 * 7);
  mesh.geometry.dispose();
  mesh.material.dispose();
});
