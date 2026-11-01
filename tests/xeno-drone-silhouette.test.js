import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { HuntNPC } from '../src/entities/HuntNPC.js';
import { getVisualBounds } from '../src/utils/worldScale.js';
import { countBossVisualTriangles } from '../src/gameplay/BossVisualDetail.js';

test('the calibrated drone has a narrow longitudinal cranium and a biped silhouette within its nominal height', () => {
  const npc = new HuntNPC('xeno_drone');
  try {
    const full = getVisualBounds(npc.mesh).getSize(new THREE.Vector3());
    const head = getVisualBounds(npc.mesh.getObjectByName('anatomy:xeno_drone:dome')).getSize(new THREE.Vector3());
    const thorax = getVisualBounds(npc.mesh.getObjectByName('anatomy:xeno_drone:thorax')).getSize(new THREE.Vector3());
    assert.ok(Math.abs(full.y - 6.3) < 1e-5, 'silhouette edits changed the catalogue scale');
    assert.ok(full.x / full.y < 0.7, `spread limbs are wider than the upright body: ${full.x / full.y}`);
    assert.ok(head.x / thorax.x >= 0.55 && head.x / thorax.x <= 0.8, 'the cranium became as broad as the ribcage');
    assert.ok(head.z / head.x >= 2.2 && head.z / head.x <= 2.8, 'the dome lost its longitudinal axis');
    assert.ok(head.y < thorax.y * 0.3, 'the dome became a tall spherical bulb');
    assert.ok(countBossVisualTriangles(npc.mesh) < 12500);
  } finally { npc.dispose(); }
});

test('the mouth uses a dark outer jaw and small instanced teeth rather than one large white cone', () => {
  const npc = new HuntNPC('xeno_drone');
  try {
    const jaw = npc.mesh.getObjectByName('anatomy:xeno_drone:outer_jaw');
    const dentition = npc.mesh.getObjectByName('anatomy:xeno_drone:teeth');
    assert.ok(jaw && dentition?.isInstancedMesh);
    assert.equal(dentition.count, 6);
    assert.ok(Math.max(jaw.material.color.r, jaw.material.color.g, jaw.material.color.b) < 0.15);
    const transform = new THREE.Matrix4();
    npc.mesh.updateMatrixWorld(true);
    dentition.geometry.computeBoundingBox();
    for (let index = 0; index < dentition.count; index++) {
      dentition.getMatrixAt(index, transform);
      transform.premultiply(dentition.matrixWorld);
      const size = dentition.geometry.boundingBox.clone().applyMatrix4(transform).getSize(new THREE.Vector3());
      assert.ok(Math.max(size.x, size.y, size.z) < 0.2, 'a tooth is larger than a hand');
    }
  } finally { npc.dispose(); }
});

test('retargeted claw instances remain attached to the narrowed arms and keep terrain contact through LOD', () => {
  const npc = new HuntNPC('xeno_drone');
  try {
    const arms = npc.mesh.children.filter(child => child.isMesh && !child.isInstancedMesh
      && Math.abs(child.position.x) > 0.2 && child.position.y > 1);
    assert.equal(arms.length, 2);
    const boxes = arms.map(arm => getVisualBounds(arm));
    const fingers = npc.mesh.getObjectByName('near-detail:xeno_drone:tapered-digits');
    assert.ok(fingers?.isInstancedMesh);
    const transform = new THREE.Matrix4(), center = new THREE.Vector3(), nearest = new THREE.Vector3();
    for (let index = 0; index < fingers.count; index++) {
      fingers.getMatrixAt(index, transform);
      center.setFromMatrixPosition(transform).applyMatrix4(fingers.matrixWorld);
      const distance = Math.min(...boxes.map(box => box.clampPoint(center, nearest).distanceTo(center)));
      assert.ok(distance < 0.2, `claw ${index} is detached from its arm by ${distance}`);
    }
    const near = getVisualBounds(npc.mesh);
    npc.update(0, { player: { position: new THREE.Vector3(0, 0, 300) } });
    const far = getVisualBounds(npc.mesh);
    assert.ok(Math.abs(near.min.y) < 1e-5 && Math.abs(far.min.y) < 1e-5);
    assert.ok(Math.abs(near.max.y - far.max.y) < 1e-5);
    assert.ok(npc.attackRange >= npc.colliderRadius + 1.8);
  } finally { npc.dispose(); }
});
