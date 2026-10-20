import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';
import { disposeObject3D } from '../src/utils/materialState.js';

const STILL = Object.freeze({ x: 0, z: 0, isSprinting: false });

function makePlayer() {
  const player = new YautjaPlayer(new THREE.Scene());
  player.position.set(3, 0, -8);
  player.mesh.position.copy(player.position);
  player.mesh.updateWorldMatrix(true, true);
  return player;
}

function getPart(player, name) {
  const part = player.mesh.getObjectByName(name);
  assert.ok(part, `Missing fitted variant part: ${name}`);
  return part;
}

function jointRelativeMatrix(part, joint) {
  joint.updateWorldMatrix(true, false);
  part.updateWorldMatrix(true, false);
  return joint.matrixWorld.clone().invert().multiply(part.matrixWorld);
}

function assertMatrixNear(actual, expected, name) {
  const delta = Math.max(...actual.elements.map((value, i) => Math.abs(value - expected.elements[i])));
  assert.ok(delta < 1e-6, `${name} detached from its animated joint: matrix delta=${delta}`);
}

function effectivelyVisible(object) {
  for (let parent = object; parent; parent = parent.parent) if (!parent.visible) return false;
  return true;
}

test('AVP armor fits the adult rig at chest, shoulder, forearm and knee height', () => {
  const player = makePlayer();
  try {
    player.applyCustomization({ armorPresetId: 'chopper_avp' });
    player.mesh.updateWorldMatrix(true, true);
    const expected = [
      ['equipment:avp_ritual_chest', [0, 5.10, 0.64]],
      ['equipment:avp_pauldron_l', [-0.98, 5.92, 0]],
      ['equipment:avp_pauldron_r', [0.98, 5.92, 0]],
      ['equipment:avp_forearm_plate_l', [-0.93, 3.93, 0.35]],
      ['equipment:avp_thigh_plate_l', [-0.56, 2.88, 0.37]],
      ['equipment:avp_shin_plate_l', [-0.48, 1.12, 0.32]],
      ['equipment:avp_knee_guard_l', [-0.48, 1.91, 0.38]],
    ];
    for (const [name, offset] of expected) {
      const actual = getPart(player, name).getWorldPosition(new THREE.Vector3()).sub(player.position);
      assert.ok(actual.distanceTo(new THREE.Vector3(...offset)) < 1e-6, `${name} retains the former squat-rig position: ${actual.toArray()}`);
    }
    // Evaluate vertices: a rotated hemisphere's transformed local AABB contains
    // empty corners and overestimates the silhouette width.
    const shoulderBounds = new THREE.Box3().setFromObject(getPart(player, 'equipment:avp_pauldron_l'), true)
      .union(new THREE.Box3().setFromObject(getPart(player, 'equipment:avp_pauldron_r'), true));
    assert.ok(shoulderBounds.getSize(new THREE.Vector3()).x / 7.2 < 0.43, 'AVP shoulder overlays restore the former oversized width');
    const housing = getPart(player, 'equipment:chopper_forearm_housing_l');
    const axis = new THREE.Vector3(0, 1, 0).transformDirection(housing.matrixWorld);
    assert.ok(Math.abs(axis.y) > 0.99, 'Chopper forearm guards still project perpendicular to the resting arm');
  } finally { disposeObject3D(player.mesh); }
});

test('variant plates, identity details and Wolf glove retain their joint offsets through animation', () => {
  const player = makePlayer();
  try {
    const bindings = [
      ['equipment:avp_ritual_chest', player.torsoRig],
      ['equipment:avp_pauldron_l', player.leftArmRig.shoulder],
      ['equipment:avp_forearm_plate_r', player.rightArmRig.elbow],
      ['equipment:avp_thigh_plate_l', player.leftLegRig.hip],
      ['equipment:avp_shin_plate_r', player.rightLegRig.knee],
      ['equipment:avp_knee_guard_l', player.leftLegRig.knee],
      ['avpRitualIdentity:scar', player.torsoRig],
      ['avpRitualIdentity:celtic', player.torsoRig],
      ['equipment:chopper_forearm_housing_r', player.rightArmRig.elbow],
      ['equipment:wolf_anti_acid_chest_plate', player.torsoRig],
      ['equipment:wolf_power_glove', player.rightArmRig.wrist],
      ['equipment:wolf_cleaner_case', player.pelvisRig],
      ['equipment:wolf_sampling_syringe', player.pelvisRig],
      ['equipment:wolf_laser_mine_rack', player.pelvisRig],
    ].map(([name, joint]) => {
      const part = getPart(player, name);
      return { name, joint, part, rest: jointRelativeMatrix(part, joint) };
    });
    for (const preset of ['chopper_avp', 'wolf_avpr']) {
      player.applyCustomization({ armorPresetId: preset });
      player.update(0.12, { x: 1, z: 0, isSprinting: true }, 0.6);
      player.selectedWeapon = 1;
      player.attack(new THREE.Vector3(10, 0, 12));
      player.update(0.08, STILL, 0.6);
      player.mesh.updateWorldMatrix(true, true);
      for (const { name, joint, part, rest } of bindings) {
        assertMatrixNear(jointRelativeMatrix(part, joint), rest, name);
      }
      player.isAttacking = false;
      player.attackTimer = 0;
    }
  } finally { disposeObject3D(player.mesh); }
});

test('joint mounts preserve preset identities and carried-equipment visibility', () => {
  const player = makePlayer();
  try {
    for (const preset of ['scar_avp', 'celtic_avp', 'chopper_avp']) {
      player.applyCustomization({ armorPresetId: preset });
      for (const [id, group] of Object.entries(player.avpRitualIdentityGroups)) {
        assert.equal(effectivelyVisible(group), id === preset);
      }
      const metrics = player.getVisualFidelityMetrics();
      assert.ok(metrics.triangleCount <= metrics.polygonBudget);
      assert.ok(metrics.activeTriangleCount <= metrics.activePolygonBudget);
      assert.ok(metrics.activeMeshCount <= metrics.activeDrawCallBudget);
    }
    player.applyCustomization({ armorPresetId: 'jungle_1987' });
    player.applyHuntLoadout(['medicomp']);
    assert.equal(effectivelyVisible(getPart(player, 'equipment:wolf_cleaner_case')), true);
    assert.equal(effectivelyVisible(getPart(player, 'equipment:wolf_sampling_syringe')), true);
    assert.equal(effectivelyVisible(getPart(player, 'equipment:wolf_laser_mine_rack')), false);
    assert.equal(effectivelyVisible(getPart(player, 'equipment:wolf_anti_acid_chest_plate')), false);
    assert.equal(effectivelyVisible(getPart(player, 'equipment:wolf_power_glove')), false);
    player.applyHuntLoadout(['plasma_mines']);
    assert.equal(effectivelyVisible(getPart(player, 'equipment:wolf_cleaner_case')), false);
    assert.equal(effectivelyVisible(getPart(player, 'equipment:wolf_laser_mine_rack')), true);
    player.applyCustomization({ armorPresetId: 'wolf_avpr' });
    assert.equal(effectivelyVisible(getPart(player, 'equipment:wolf_anti_acid_chest_plate')), true);
    assert.equal(effectivelyVisible(getPart(player, 'equipment:wolf_power_glove')), true);
    assert.equal(effectivelyVisible(getPart(player, 'equipment:wolf_cleaner_case')), false);
    const glove = getPart(player, 'equipment:wolf_power_glove');
    assert.ok(glove.scale.x >= 0.55 && glove.scale.x <= 0.65, 'Wolf fingers must fit the resized hand');
    const metrics = player.getVisualFidelityMetrics();
    assert.ok(metrics.triangleCount <= metrics.polygonBudget);
    assert.ok(metrics.activeTriangleCount <= metrics.activePolygonBudget);
    assert.ok(metrics.activeMeshCount <= metrics.activeDrawCallBudget);
  } finally { disposeObject3D(player.mesh); }
});
