import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { HuntNPC } from '../src/entities/HuntNPC.js';
import { getVisualBounds } from '../src/utils/worldScale.js';
import { countBossVisualTriangles } from '../src/gameplay/BossVisualDetail.js';

function sectionWidth(geometry, ratio) {
  geometry.computeBoundingBox();
  const position = geometry.attributes.position;
  const target = THREE.MathUtils.lerp(geometry.boundingBox.min.y, geometry.boundingBox.max.y, ratio);
  let nearest = Infinity;
  for (let index = 0; index < position.count; index++) nearest = Math.min(nearest, Math.abs(position.getY(index) - target));
  let minimum = Infinity, maximum = -Infinity;
  for (let index = 0; index < position.count; index++) {
    if (Math.abs(position.getY(index) - target) > nearest + 1e-5) continue;
    minimum = Math.min(minimum, position.getX(index)); maximum = Math.max(maximum, position.getX(index));
  }
  return maximum - minimum;
}

test('biped xenomorphs have a narrow waist between the rib cage and pelvis instead of an egg-shaped abdomen', () => {
  for (const type of ['xeno_drone', 'xeno_warrior']) {
    const npc = new HuntNPC(type);
    try {
      const body = npc.mesh.getObjectByName(`anatomy:${type}:thorax`);
      const waist = sectionWidth(body.geometry, 0.30);
      const chest = sectionWidth(body.geometry, 0.665);
      const pelvis = sectionWidth(body.geometry, 0.13);
      assert.ok(waist / chest < 0.60, `${type}: waist is still as broad as the ribcage`);
      assert.ok(pelvis > waist && pelvis < chest, `${type}: pelvis and waist have no separate silhouette`);
      const position = body.geometry.attributes.position, normal = body.geometry.attributes.normal;
      for (let index = 0; index < position.count; index++) {
        assert.ok(Number.isFinite(normal.getX(index) + normal.getY(index) + normal.getZ(index)));
        assert.ok(position.getX(index) * normal.getX(index) + position.getZ(index) * normal.getZ(index) >= -1e-5,
          `${type}: outward carapace surface was inverted`);
      }
      assert.equal(npc.mesh.userData.creatureAnatomy.fidelityVerified, false);
    } finally { npc.dispose(); }
  }
});

test('biped limbs have continuous articulated surfaces and weight-bearing feet at the common scale', () => {
  for (const [type, nominalHeight] of [['xeno_drone', 6.3], ['xeno_warrior', 6.9]]) {
    const npc = new HuntNPC(type);
    try {
      const limbs = [];
      npc.mesh.traverse(node => { if (node.userData.anatomicalLimb) limbs.push(node); });
      assert.equal(limbs.length, 4);
      assert.equal(limbs.filter(node => node.userData.anatomicalLimb.includes('toes')).length, 2);
      assert.ok(limbs.every(node => node.geometry.type !== 'CylinderGeometry' && node.geometry.index.count > 500));
      const near = getVisualBounds(npc.mesh);
      assert.ok(Math.abs(near.max.y - near.min.y - nominalHeight) < 1e-5);
      assert.ok(Math.abs(near.min.y) < 1e-5);
      for (const leg of limbs.filter(node => node.userData.anatomicalLimb.includes('toes'))) {
        const feet = getVisualBounds(leg);
        assert.ok(Math.abs(feet.min.y) < 1e-5, `${type}: a foot is not bearing weight on the terrain`);
      }
      npc.update(0, { player: { position: new THREE.Vector3(0, 0, 500) } });
      const far = getVisualBounds(npc.mesh);
      assert.ok(Math.abs(near.min.y - far.min.y) < 1e-5 && Math.abs(near.max.y - far.max.y) < 1e-5);
    } finally { npc.dispose(); }
  }
});

test('the warrior uses a narrow ridged cranium and small teeth rather than a broad head and white cone', () => {
  const npc = new HuntNPC('xeno_warrior');
  try {
    const head = getVisualBounds(npc.mesh.getObjectByName('anatomy:xeno_warrior:ridged-cranium')).getSize(new THREE.Vector3());
    assert.ok(head.z / head.x > 2.2 && head.z / head.x < 3);
    const jaw = npc.mesh.getObjectByName('anatomy:xeno_warrior:outer_jaw');
    assert.ok(Math.max(jaw.material.color.r, jaw.material.color.g, jaw.material.color.b) < 0.15);
    const teeth = npc.mesh.children.filter(node => node.name.startsWith('anatomy:xeno_warrior:tooth:'));
    assert.equal(teeth.length, 6);
    assert.ok(teeth.every(tooth => getVisualBounds(tooth).getSize(new THREE.Vector3()).length() < 0.2));
  } finally { npc.dispose(); }
});

test('anatomical improvements retain the drone draw budget and remove duplicate warrior ribs and conduits', () => {
  for (const [type, near, far] of [['xeno_drone', 13, 2], ['xeno_warrior', 17, 3]]) {
    const npc = new HuntNPC(type);
    try {
      assert.equal(npc.lodMetrics.detailedDrawCalls, near);
      assert.equal(npc.lodMetrics.distantDrawCalls, far);
      assert.ok(countBossVisualTriangles(npc.mesh) < 12_500);
      assert.equal(npc.mesh.getObjectByName(`near-detail:${type}:dorsal-conduits`).count, 4);
      assert.equal(npc.mesh.getObjectByName(`near-detail:${type}:thoracic-ribs`).count, 7);
    } finally { npc.dispose(); }
  }
});

test('costal ribs curve down toward the sternum and around the chest with the same dark shell response', () => {
  for (const type of ['xeno_drone', 'xeno_warrior']) {
    const npc = new HuntNPC(type);
    try {
      const rib = npc.mesh.getObjectByName(`near-detail:${type}:thoracic-ribs`);
      const body = npc.mesh.getObjectByName(`anatomy:${type}:thorax`);
      const p = rib.geometry.attributes.position;
      const middle = [], ends = [];
      for (let index = 0; index < p.count; index++) {
        if (Math.abs(p.getX(index)) < 0.1) middle.push([p.getY(index), p.getZ(index)]);
        if (Math.abs(p.getX(index)) > 0.9) ends.push([p.getY(index), p.getZ(index)]);
      }
      const mean = (points, axis) => points.reduce((sum, point) => sum + point[axis], 0) / points.length;
      assert.ok(mean(middle, 0) < mean(ends, 0) - 0.2, `${type}: horizontal bars replaced the costal arches`);
      assert.ok(mean(middle, 1) > mean(ends, 1) + 0.5, `${type}: ribs do not wrap in depth around the body`);
      const brightness = color => Math.max(color.r, color.g, color.b);
      assert.ok(brightness(rib.material.color) <= brightness(body.material.color) * 1.3,
        `${type}: ribs read as a separate bright metal grille`);
    } finally { npc.dispose(); }
  }
});

test('the shallow jaw arches attach beneath the front of each skull rather than hanging as a vertical capsule', () => {
  for (const type of ['xeno_drone', 'xeno_warrior']) {
    const npc = new HuntNPC(type);
    try {
      const head = npc.mesh.getObjectByName(`anatomy:${type}:${type === 'xeno_drone' ? 'dome' : 'ridged-cranium'}`);
      const jaw = npc.mesh.getObjectByName(`anatomy:${type}:outer_jaw`);
      const span = getVisualBounds(jaw).getSize(new THREE.Vector3());
      assert.ok(span.y < span.z, `${type}: jaw was reconstructed in a vertical orientation`);
      npc.mesh.updateMatrixWorld(true);
      const a = new THREE.Vector3(), b = new THREE.Vector3();
      let minimum = Infinity;
      for (let index = 0; index < head.geometry.attributes.position.count && minimum >= 0.08; index++) {
        a.fromBufferAttribute(head.geometry.attributes.position, index).applyMatrix4(head.matrixWorld);
        for (let vertex = 0; vertex < jaw.geometry.attributes.position.count && minimum >= 0.08; vertex++) {
          b.fromBufferAttribute(jaw.geometry.attributes.position, vertex).applyMatrix4(jaw.matrixWorld);
          minimum = Math.min(minimum, a.distanceTo(b));
        }
      }
      assert.ok(minimum < 0.08, `${type}: mandibular attachment is detached from the actual skull surface`);
    } finally { npc.dispose(); }
  }
});
