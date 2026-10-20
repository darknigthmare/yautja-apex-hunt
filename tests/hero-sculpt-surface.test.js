import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';
import { disposeObject3D } from '../src/utils/materialState.js';

test('les volumes anatomiques, mains, filet et masque portent des surfaces UV valides et des détails PBR', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  try {
    const torso = player.mesh.getObjectByName('anatomy:torso');
    assert.equal(torso.geometry.userData.authoredSurface, 'anatomical_loft');
    assert.equal(player.maskMesh.geometry.userData.authoredSurface, 'sculpted_biomask');
    assert.equal(player.mesh.getObjectByName('equipment:body_netting').geometry.userData.authoredSurface, 'open_woven_body_net');
    for (const suffix of ['l', 'r']) {
      const hand = player.mesh.getObjectByName(`anatomy:five_digit_hand_${suffix}`);
      assert.equal(hand.userData.digitCount, 5);
      assert.equal(hand.parent.name, `joint:wrist_${suffix}`);
      assert.ok(player.mesh.getObjectByName(`anatomy:hand_claws_${suffix}`));
    }
    for (const mesh of [torso, player.maskMesh, player.leftArmRig.upperArm, player.rightLegRig.thigh]) {
      const { position, normal, uv } = mesh.geometry.attributes;
      assert.equal(position.count, normal.count);
      assert.equal(position.count, uv.count);
      assert.ok([...position.array, ...normal.array, ...uv.array].every(Number.isFinite));
      assert.ok(mesh.material.normalMap?.isDataTexture);
      assert.ok(mesh.material.roughnessMap?.isDataTexture);
    }
    assert.equal(player.dreadGroups.length, 11);
    for (const joint of player.dreadGroups) {
      assert.equal(joint.children[0].geometry.userData.authoredSurface, 'paired_tapered_predlocks');
    }
  } finally {
    disposeObject3D(player.mesh);
  }
});

test('les profils de masque changent sans perdre visière, canaux de forge, rig et budget actif', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  try {
    for (const [maskId, armorPresetId] of [['mask_feral_2022', 'feral_2022'], ['mask_wolf_avpr', 'wolf_avpr'], ['mask_jungle_hunter_1987', 'jungle_1987']]) {
      const previous = player.maskMesh.geometry;
      player.applyCustomization({ maskId, armorPresetId });
      assert.notEqual(player.maskMesh.geometry, previous);
      assert.ok(player.maskDetailGroup.getObjectByName('equipment:biomask_visor_and_respiration_vents'));
      const metrics = player.getVisualFidelityMetrics();
      assert.ok(metrics.triangleCount <= metrics.polygonBudget);
      assert.ok(metrics.activeTriangleCount <= metrics.activePolygonBudget);
      assert.ok(metrics.activeMeshCount <= metrics.activeDrawCallBudget);
      player.update(0.1, { x: 1, z: 0, isSprinting: false }, 0);
      assert.equal(player.currentAnimationState, 'walk');
    }
  } finally {
    disposeObject3D(player.mesh);
  }
});

test('les matériaux sont visibles au démarrage et les deux modes de vision restent disponibles', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  try {
    assert.equal(player.activeVisionMode, 'normal');
    assert.equal(player.cycleVisionMode(), 'thermal');
    assert.equal(player.cycleVisionMode(), 'tech');
    assert.equal(player.cycleVisionMode(), 'normal');
  } finally {
    disposeObject3D(player.mesh);
  }
});
