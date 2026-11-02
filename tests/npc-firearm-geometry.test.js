import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { HuntNPC, HUNT_NPC_LOD_PROFILES } from '../src/entities/HuntNPC.js';
import { GENERIC_NPC_FIREARM_TYPES } from '../src/utils/NpcFirearmGeometry.js';
import { countBossVisualTriangles } from '../src/gameplay/BossVisualDetail.js';

test('generic modern guns have separate stock, receiver, barrel, magazine and trigger silhouettes in one material draw', () => {
  for (const type of GENERIC_NPC_FIREARM_TYPES) {
    const npc = new HuntNPC(type);
    try {
      const weapon = npc.mesh.getObjectByName(`equipment:${type}:generic-firearm`);
      assert.ok(weapon, `${type}: generic firearm missing`);
      assert.equal(weapon.geometry.type, 'BufferGeometry');
      assert.equal(weapon.geometry.groups.length, 0);
      assert.equal(Array.isArray(weapon.material), false);
      assert.ok(weapon.geometry.userData.firearmParts.includes('trigger'));
      assert.ok(weapon.geometry.userData.firearmParts.includes(type === 'subway_armed_hunter' ? 'pump-fore-end' : 'detachable-magazine'));
      assert.ok(countBossVisualTriangles(npc.mesh) < 12_500, `${type}: near triangle budget exceeded`);
    } finally { npc.dispose(); }
  }
});

test('the new firearm stays inside its former envelope, preserves the muzzle and adds no renderer draw', () => {
  const npc = new HuntNPC('human_fireteam', { position: [7, 13, -6] });
  try {
    const weapon = npc.mesh.getObjectByName('equipment:human_fireteam:generic-firearm');
    const original = weapon.userData.npcFirearm.originalBounds;
    weapon.geometry.computeBoundingBox();
    const bounds = weapon.geometry.boundingBox;
    for (let axis = 0; axis < 3; axis++) {
      const key = ['x', 'y', 'z'][axis];
      assert.ok(bounds.min[key] >= original.min[axis] - 0.000001);
      assert.ok(bounds.max[key] <= original.max[axis] + 0.000001);
    }
    assert.ok(Math.abs(bounds.max.z - original.max[2]) < 0.000001);
    assert.ok(Math.abs(bounds.min.z - original.min[2]) < 0.000001);
    weapon.updateMatrix();
    const originalBarrelTip = new THREE.Vector3(0, 0, original.max[2]).applyMatrix4(weapon.matrix);
    assert.ok(new THREE.Vector3(...npc.mesh.userData.humanoidWeaponMuzzle).distanceTo(originalBarrelTip) < 0.000001,
      'BufferGeometry must retain the previous muzzle instead of returning to the hardcoded origin');
    const expected = originalBarrelTip.clone();
    expected.y += npc.physicalScale.groundOffset; expected.z += 0.025;
    npc.mesh.rotation.y = Math.PI / 2;
    npc.mesh.localToWorld(expected);
    assert.ok(npc.getProjectileOrigin().distanceTo(expected) < 0.000001);
    assert.equal(npc.lodMetrics.detailedDrawCalls, 12);
    assert.equal(npc.lodMetrics.distantDrawCalls, 2);
  } finally { npc.dispose(); }
});

test('the rifle silhouette contains real empty space below its barrel rather than a long solid plank', () => {
  const npc = new HuntNPC('human_fireteam');
  try {
    const weapon = npc.mesh.getObjectByName('equipment:human_fireteam:generic-firearm');
    weapon.geometry.computeBoundingBox();
    const size = weapon.geometry.boundingBox.getSize(new THREE.Vector3());
    npc.mesh.updateMatrixWorld(true);
    const hitAt = (y, z) => {
      const origin = new THREE.Vector3(-size.x, y, z).applyMatrix4(weapon.matrixWorld);
      const direction = new THREE.Vector3(1, 0, 0).transformDirection(weapon.matrixWorld);
      return new THREE.Raycaster(origin, direction, 0, 4).intersectObject(weapon, false).length > 0;
    };
    assert.equal(hitAt(0, -size.z * 0.4), true, 'shoulder stock missing');
    assert.equal(hitAt(0, -size.z * 0.1), true, 'receiver missing');
    assert.equal(hitAt(0, size.z * 0.4), true, 'round barrel missing');
    assert.equal(hitAt(-size.y * 0.34, size.z * 0.4), false, 'old solid weapon block is still present');
  } finally { npc.dispose(); }
});

test('historical and specialized weapon silhouettes keep their own geometry', () => {
  const modern = new Set(GENERIC_NPC_FIREARM_TYPES);
  for (const [type, profile] of Object.entries(HUNT_NPC_LOD_PROFILES)) {
    if (profile.family !== 'humanoid' || modern.has(type)) continue;
    const npc = new HuntNPC(type);
    try {
      assert.equal(npc.mesh.children.some(node => node.userData.npcFirearm), false, `${type}: specialized weapon overwritten`);
      if (type === 'colonial_marine_smartgunner') assert.equal(npc.mesh.userData.weaponBarrels, 3);
    } finally { npc.dispose(); }
  }
});
