import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { HuntNPC, HUNT_NPC_LOD_PROFILES } from '../src/entities/HuntNPC.js';
import { getVisualBounds } from '../src/utils/worldScale.js';
import { countBossVisualTriangles } from '../src/gameplay/BossVisualDetail.js';

test('humanoid contours have a defined waist, adult stature and separated elbow/knee profiles within the existing budgets', () => {
  for (const [type, profile] of Object.entries(HUNT_NPC_LOD_PROFILES)) {
    if (profile.family !== 'humanoid') continue;
    const npc = new HuntNPC(type);
    try {
      const torso = npc.mesh.getObjectByName(`anatomy:${type}:rib-cage-waist-pelvis`);
      assert.ok(torso, `${type}: torso missing`);
      const positions = torso.geometry.attributes.position;
      const spanAt = y => {
        const xs = [];
        for (let i = 0; i < positions.count; i++) if (Math.abs(positions.getY(i) - y) < 0.03) xs.push(positions.getX(i));
        return Math.max(...xs) - Math.min(...xs);
      };
      assert.ok(spanAt(1.55) > spanAt(1.16) * 1.25, `${type}: shoulder-to-waist taper absent`);
      for (const part of ['left-thigh-knee-calf', 'right-thigh-knee-calf', 'left-shoulder-elbow-wrist', 'right-shoulder-elbow-wrist']) {
        const limb = npc.mesh.getObjectByName(`anatomy:${type}:${part}`);
        assert.ok(limb && limb.geometry.attributes.position.count >= 60, `${type}: articulated ${part} missing`);
        assert.ok(Array.from(limb.geometry.attributes.position.array).every(Number.isFinite));
      }
      const height = getVisualBounds(npc.mesh).getSize(new THREE.Vector3()).y;
      assert.ok(Math.abs(height - (['combat_synthetic', 'colonial_marine_smartgunner'].includes(type) ? 5.55 : 5.4)) < 0.00001);
      assert.ok(countBossVisualTriangles(npc.mesh) < 12_500, `${type}: near triangle budget exceeded`);
      assert.ok(npc.lodMetrics.detailedDrawCalls <= 27 && npc.lodMetrics.distantDrawCalls <= 3);
    } finally { npc.dispose(); }
  }
});

test('reshaping a pack uses its actual authored vertices rather than rounded-box unit parameters', () => {
  const npc = new HuntNPC('human_fireteam');
  try {
    const pack = npc.mesh.getObjectByName('equipment:human_fireteam:soft-pack');
    pack.geometry.computeBoundingBox();
    const size = pack.geometry.boundingBox.getSize(new THREE.Vector3());
    assert.ok(Math.abs(size.x - 0.5) < 0.00001);
    assert.ok(Math.abs(size.y - 0.62) < 0.00001);
    assert.ok(Math.abs(size.z - 0.24) < 0.00001);
    assert.ok(getVisualBounds(npc.mesh).getSize(new THREE.Vector3()).x < 2.2, 'the human must not regain the old outstretched block silhouette');
  } finally { npc.dispose(); }
});

test('both hands on the generic rifleman reach its visible weapon instead of hanging by the hips', () => {
  const npc = new HuntNPC('human_fireteam');
  try {
    const plates = npc.mesh.getObjectByName('near-detail:human_fireteam:articulated-plates');
    const rifle = npc.mesh.children.find(node => node.isMesh && !node.isInstancedMesh && node.material?.metalness >= 0.65 && node.position.z > 0.3);
    const rifleBounds = getVisualBounds(rifle);
    const transform = new THREE.Matrix4(), point = new THREE.Vector3();
    for (const glove of [4, 9]) {
      plates.getMatrixAt(glove, transform); point.setFromMatrixPosition(transform); plates.localToWorld(point);
      assert.ok(rifleBounds.distanceToPoint(point) < 0.12, `glove ${glove} is disconnected from the gun`);
      assert.ok(point.y > 3.2);
    }
  } finally { npc.dispose(); }
});

test('projectiles start at the real left/right mounted barrel and follow actor rotation and ground height', () => {
  for (const [type, side] of [['human_fireteam', 1], ['combat_synthetic', -1], ['gunnison_national_guard', 1]]) {
    const npc = new HuntNPC(type, { position: [5, 11, -3] });
    try {
      const localMuzzle = npc.mesh.userData.humanoidWeaponMuzzle;
      assert.ok(localMuzzle && Math.sign(localMuzzle[0]) === side, `${type}: wrong weapon side`);
      for (const angle of [0, Math.PI / 2, Math.PI]) {
        npc.mesh.rotation.y = angle;
        const expected = new THREE.Vector3(...localMuzzle);
        expected.y += npc.physicalScale.groundOffset; expected.z += 0.025;
        npc.mesh.localToWorld(expected);
        assert.ok(npc.getProjectileOrigin().distanceTo(expected) < 0.000001);
        assert.ok(expected.y > npc.position.y + 2.5);
      }
      npc.mesh.rotation.y = 0;
      const before = npc.getProjectileOrigin();
      assert.equal(Math.sign(before.x - npc.position.x), side, `${type}: left-handed weapon fired from the right side`);
      if (npc.behaviorKind === 'cover_burst') npc._coverTarget = npc.position.clone();
      const target = npc.position.clone().add(new THREE.Vector3(0, 0, 8));
      const shot = npc.update(0, { player: { position: target } }).find(signal => signal.projectile);
      assert.ok(shot?.projectile.origin.distanceTo(before) < 0.000001);
    } finally { npc.dispose(); }
  }
});
