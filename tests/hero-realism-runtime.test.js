import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';
import { disposeObject3D } from '../src/utils/materialState.js';

const STILL = Object.freeze({ x: 0, z: 0, isSprinting: false });

function makePlayer() {
  const player = new YautjaPlayer(new THREE.Scene());
  player.position.set(2, 0, -3);
  player.mesh.position.copy(player.position);
  player.mesh.updateWorldMatrix(true, true);
  return player;
}

function bounds(player, name) {
  const object = player.mesh.getObjectByName(name);
  assert.ok(object, `Missing anatomical/equipment object: ${name}`);
  player.mesh.updateWorldMatrix(true, true);
  return new THREE.Box3().setFromObject(object);
}

function measuredBody(player) {
  // Crown-to-chin envelope of the worn head. Predlocks, crests, lights and
  // trophies are excluded; the cranial dome alone excludes the lower face.
  const head = bounds(player, 'anatomy:yautja_head')
    .union(bounds(player, 'anatomy:mandible_base'))
    .union(bounds(player, 'equipment:biomask'));
  const boots = bounds(player, 'equipment:boot_l').union(bounds(player, 'equipment:boot_r'));
  const shoulders = bounds(player, 'equipment:pauldron_l').union(bounds(player, 'equipment:pauldron_r'));
  return {
    head, boots, shoulders,
    height: head.max.y - boots.min.y,
    headHeight: head.getSize(new THREE.Vector3()).y,
    shoulderWidth: shoulders.getSize(new THREE.Vector3()).x,
  };
}

test('the hunter stands on its soles without raising the gameplay position or collider origin', () => {
  const player = makePlayer();
  try {
    const gameplayPosition = player.position.clone();
    for (const suffix of ['l', 'r']) {
      const boot = bounds(player, `equipment:boot_${suffix}`);
      assert.ok(Math.abs(boot.min.y) < 0.06, `Boot ${suffix} is buried/floating at Y=${boot.min.y}`);
    }
    player.update(1 / 60, STILL, 0);
    assert.deepEqual(player.position.toArray(), gameplayPosition.toArray());
    assert.equal(player.mesh.position.y, player.position.y, 'a mesh/collider offset hides the placement error');
  } finally { disposeObject3D(player.mesh); }
});

test('wristblade sockets align their geometry and attack slide with the forearm', () => {
  const player = makePlayer();
  try {
    const assemblies = [
      ['l', player.wristbladeLeft, player.leftArmRig],
      ['r', player.wristbladeRight, player.rightArmRig],
    ];
    const restPositions = new Map();
    for (const [suffix, assembly, arm] of assemblies) {
      assert.equal(assembly.parent.name, `socket:wristblade_${suffix}`);
      assert.ok(assembly.parent.parent === arm.wrist, `Socket ${suffix} is detached from the wrist`);
      const axis = new THREE.Vector3(0, 0, 1).transformDirection(assembly.matrixWorld);
      assert.ok(axis.distanceTo(new THREE.Vector3(0, -1, 0)) < 1e-6,
        `Rest blade ${suffix} points across the forearm: ${axis.toArray()}`);
      const forearmAxis = arm.wrist.getWorldPosition(new THREE.Vector3())
        .sub(arm.elbow.getWorldPosition(new THREE.Vector3())).normalize();
      assert.ok(axis.dot(forearmAxis) > 0.999999);
      const blade = assembly.getObjectByName(`weapon:wristblade_${suffix}_0`);
      blade.geometry.computeBoundingBox();
      const size = blade.geometry.boundingBox.getSize(new THREE.Vector3());
      assert.ok(size.z > 3 * Math.max(size.x, size.y), 'Blade geometry lost its longitudinal socket axis');
      restPositions.set(suffix, assembly.getWorldPosition(new THREE.Vector3()));
    }
    player.selectedWeapon = 1;
    assert.equal(player.attack(new THREE.Vector3(2, 0, 20)), 'wristblades');
    player.mesh.updateWorldMatrix(true, true);
    const extension = player.wristbladeAttackPositionZ - player.wristbladeRestPositionZ;
    assert.ok(extension > 0);
    for (const [suffix, assembly] of assemblies) {
      const movement = assembly.getWorldPosition(new THREE.Vector3()).sub(restPositions.get(suffix));
      assert.ok(movement.distanceTo(new THREE.Vector3(0, -extension, 0)) < 1e-6,
        `Attack ${suffix} no longer slides down the forearm: ${movement.toArray()}`);
    }
    // Once the arm raises, the weapon must rotate with it while retaining its
    // local deployment distance; no independent world-axis correction is needed.
    player.update(0.08, STILL, 0);
    player.mesh.updateWorldMatrix(true, true);
    for (const [, assembly, arm] of assemblies) {
      const axis = new THREE.Vector3(0, 0, 1).transformDirection(assembly.matrixWorld);
      const forearmAxis = arm.wrist.getWorldPosition(new THREE.Vector3())
        .sub(arm.elbow.getWorldPosition(new THREE.Vector3())).normalize();
      assert.ok(axis.dot(forearmAxis) > 0.999999, 'Animated blade no longer follows the forearm');
      assert.equal(assembly.position.z, player.wristbladeAttackPositionZ);
    }
  } finally { disposeObject3D(player.mesh); }
});

function regionMaterials(player) {
  const regions = new Map();
  player.mesh.traverse(node => {
    const source = node.material === player.cloakMaterial ? node.userData.baseMaterial : node.material;
    for (const material of Array.isArray(source) ? source : [source]) {
      const region = material?.userData.heroSurface?.region;
      if (region && !regions.has(region)) regions.set(region, material);
    }
  });
  return regions;
}

test('hero parts keep distinct albedo/normal/roughness and dielectric bone through forge finishes', () => {
  const player = makePlayer();
  try {
    const original = regionMaterials(player);
    const kinds = ['skin', 'armor', 'edgeMetal', 'rubber', 'bone', 'mask', 'dread', 'leather'];
    for (const kind of kinds) assert.ok(original.has(kind), `Missing part material: ${kind}`);
    const textureChannels = ['map', 'normalMap', 'roughnessMap'];
    const originalTextures = new Map(kinds.map(kind => [kind,
      Object.fromEntries(textureChannels.map(channel => [channel, original.get(kind)[channel]]))]));
    for (const channel of textureChannels) {
      assert.ok(new Set(kinds.map(kind => original.get(kind)[channel])).size >= 6, `${channel} was flattened across the entire hunter`);
      assert.ok(kinds.every(kind => original.get(kind)[channel]?.isTexture));
    }
    const dielectric = ['skin', 'rubber', 'bone', 'dread', 'leather'];
    for (const finish of ['finish_obsidian', 'finish_polished', 'finish_hunter_worn']) {
      player.applyCustomization({ armorFinishId: finish });
      const current = regionMaterials(player);
      for (const kind of dielectric) {
        const material = current.get(kind);
        assert.equal(material.metalness, 0, `${finish} turned ${kind} into metal`);
        for (const channel of textureChannels) {
          assert.equal(material[channel], originalTextures.get(kind)[channel], `${finish} overwrote ${kind} ${channel}`);
        }
      }
      assert.ok(new Set([...current.values()].map(material => material.roughness.toFixed(3))).size >= 5,
        `${finish} erased material-specific roughness`);
    }
    player.applyCustomization({ maskId: 'mask_feral_2022', armorPresetId: 'feral_2022', armorFinishId: 'finish_polished' });
    assert.equal(player.maskMesh.material.userData.heroSurface.region, 'bone');
    assert.equal(player.maskMesh.material.metalness, 0, 'a bone biomask became polished metal');
  } finally { disposeObject3D(player.mesh); }
});

test('nominal body height, head count, shoulder span and hands retain adult proportions', () => {
  const player = makePlayer();
  try {
    const body = measuredBody(player);
    const heads = body.height / body.headHeight;
    const shoulderRatio = body.shoulderWidth / body.height;
    assert.ok(body.height >= 6.9 && body.height <= 7.5, `Nominal height=${body.height}`);
    assert.ok(heads >= 7 && heads <= 8, `Nominal head count=${heads}`);
    assert.ok(shoulderRatio >= 0.33 && shoulderRatio <= 0.48, `Shoulder/height=${shoulderRatio}`);
    for (const suffix of ['l', 'r']) {
      const hand = bounds(player, `anatomy:five_digit_hand_${suffix}`).getSize(new THREE.Vector3());
      const forearm = bounds(player, `anatomy:forearm_${suffix}`).getSize(new THREE.Vector3());
      assert.ok(hand.y >= body.height * 0.065 && hand.y <= body.height * 0.13, `Hand ${suffix} length=${hand.y}`);
      assert.ok(hand.y / forearm.y <= 0.8, `Hand ${suffix} approaches forearm length`);
    }
  } finally { disposeObject3D(player.mesh); }
});

test('idle animation keeps the elongated pelvis and knees instead of restoring the former squat rig', () => {
  const player = makePlayer();
  try {
    for (let frame = 0; frame < 60; frame++) player.update(1 / 60, STILL, 0);
    player.mesh.updateWorldMatrix(true, true);
    const pelvis = player.pelvisRig.getWorldPosition(new THREE.Vector3()).y;
    assert.ok(Math.abs(pelvis - 3.7) < 0.16, `Idle pelvis Y=${pelvis}`);
    for (const leg of [player.leftLegRig, player.rightLegRig]) {
      const knee = leg.knee.getWorldPosition(new THREE.Vector3()).y;
      assert.ok(Math.abs(knee - 1.91) < 0.16, `Idle knee Y=${knee}`);
    }
    const boots = measuredBody(player).boots;
    assert.ok(Math.abs(boots.min.y) < 0.08, `Idle soles Y=${boots.min.y}`);
    assert.equal(player.position.y, 0);
  } finally { disposeObject3D(player.mesh); }
});
