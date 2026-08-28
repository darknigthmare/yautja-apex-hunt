import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';

const STILL = Object.freeze({ x: 0, z: 0, isSprinting: false });

function makePlayer() {
  return new YautjaPlayer(new THREE.Scene());
}

function descendantsWithRole(root, role) {
  const matches = [];
  root.traverse((child) => {
    if (child.userData.detailRole === role) matches.push(child);
  });
  return matches;
}

test('le joueur hero expose un rig hiérarchique articulé et un budget polygonal contrôlé', () => {
  const player = makePlayer();
  const metrics = player.getVisualFidelityMetrics();

  assert.equal(player.rigRoot.parent, player.mesh);
  assert.equal(player.pelvisRig.parent, player.rigRoot);
  assert.equal(player.torsoRig.parent, player.pelvisRig);
  assert.equal(player.headRig.parent.name, 'joint:neck');
  assert.equal(player.leftArmRig.shoulder.parent, player.torsoRig);
  assert.equal(player.leftArmRig.elbow.parent, player.leftArmRig.shoulder);
  assert.equal(player.leftArmRig.wrist.parent, player.leftArmRig.elbow);
  assert.equal(player.rightLegRig.knee.parent, player.rightLegRig.hip);
  assert.equal(player.rightLegRig.ankle.parent, player.rightLegRig.knee);

  assert.equal(metrics.visualTier, 'hero_procedural');
  assert.equal(metrics.provenance, 'original_fan_made_procedural');
  assert.ok(metrics.triangleCount >= 50_000, `seulement ${metrics.triangleCount} triangles`);
  assert.ok(metrics.triangleCount <= 90_000, `budget hero dépassé: ${metrics.triangleCount}`);
  assert.ok(metrics.meshCount >= 120);
  assert.ok(metrics.meshCount <= 220);
  assert.ok(metrics.activeTriangleCount >= 50_000);
  assert.ok(metrics.activeTriangleCount <= metrics.activePolygonBudget);
  assert.ok(metrics.activeMeshCount <= metrics.activeDrawCallBudget);
  assert.ok(metrics.equipmentMeshCount >= 80);
  assert.equal(metrics.rigJointCount, 17);
  assert.deepEqual(metrics.animationStates, [
    'idle', 'walk', 'sprint', 'attack', 'hit_reaction', 'heal', 'perched', 'self_destruct',
  ]);
  assert.equal(player.mesh.userData.rigContract.hierarchy, 'root>pelvis>(torso>shoulders/head,hips>knees>ankles)');
});

test('les wristblades sont de vraies lames effilées sur rails avec profil double ou triple', () => {
  const player = makePlayer();

  for (const assembly of [player.wristbladeLeft, player.wristbladeRight]) {
    assert.equal(assembly.userData.equipmentRole, 'wristblades');
    assert.equal(assembly.userData.availableBladeCount, 3);
    assert.equal(assembly.userData.visibleBladeCount, 2);
    assert.equal(assembly.userData.provenance, 'original_fan_made_procedural');
    const blades = descendantsWithRole(assembly, 'equipment_wristblade_tapered_blade');
    const rails = descendantsWithRole(assembly, 'equipment_wristblade_guide_rail');
    const actuators = descendantsWithRole(assembly, 'equipment_wristblade_actuator');
    assert.equal(blades.length, 3);
    assert.equal(blades.filter(({ visible }) => visible).length, 2);
    assert.equal(rails.length, 3);
    assert.equal(actuators.length, 3);
    blades.forEach((blade) => {
      assert.equal(blade.userData.isTaperedBlade, true);
      assert.equal(blade.userData.isPlaceholder, false);
      assert.notEqual(blade.geometry.type, 'BoxGeometry');
      assert.ok(blade.geometry.attributes.position.count > 50);
    });
  }

  player.applyCustomization({ armorPresetId: 'chopper_avp' });
  for (const assembly of [player.wristbladeLeft, player.wristbladeRight]) {
    assert.equal(assembly.userData.visibleBladeCount, 3);
    assert.equal(assembly.userData.techVariantId, 'variant_chopper_extended_wristblades');
    assert.equal(descendantsWithRole(assembly, 'equipment_wristblade_tapered_blade').filter(({ visible }) => visible).length, 3);
  }
});

test('caster, gauntlets et armure possèdent des sous-pièces lisibles et non provisoires', () => {
  const player = makePlayer();

  assert.equal(player.plasmacasterMesh.userData.equipmentRole, 'plasmacaster');
  assert.equal(descendantsWithRole(player.plasmacasterMesh, 'equipment_caster_servo_arm').length, 2);
  assert.equal(descendantsWithRole(player.plasmacasterMesh, 'equipment_caster_focusing_ring').length, 3);
  assert.equal(descendantsWithRole(player.plasmacasterMesh, 'equipment_caster_emitter').length, 1);
  assert.equal(player.leftArmRig.gauntlet.userData.equipmentRole, 'computer_gauntlet');
  assert.equal(player.rightArmRig.gauntlet.userData.equipmentRole, 'weapon_gauntlet');
  assert.equal(descendantsWithRole(player.mesh, 'equipment_gauntlet_control').length, 6);
  assert.equal(descendantsWithRole(player.mesh, 'equipment_articulated_chest_plate').length, 1);
  assert.equal(descendantsWithRole(player.mesh, 'equipment_segmented_greave').length, 2);
  assert.equal(descendantsWithRole(player.mesh, 'equipment_articulated_boot').length, 2);
});

test('le preset Wolf porte réellement son kit Cleaner AVP:R et ses finitions vétéran', () => {
  const player = makePlayer();
  assert.equal(player.wolfCleanerKitGroup.visible, false);

  const result = player.applyCustomization({
    armorPresetId: 'wolf_avpr',
    dreadStyleId: 'dread_style_wolf_veteran',
    armorFinishId: 'finish_cleaner_acid_resistant',
    warpaintId: 'warpaint_wolf_veteran_scars',
  });
  assert.equal(result.armorPresetId, 'wolf_avpr');
  assert.equal(player.wolfCleanerKitGroup.visible, true);
  assert.equal(player.wolfCleanerKitGroup.userData.active, true);
  assert.equal(player.wolfCleanerKitGroup.getObjectByName('equipment:wolf_cleaner_case')?.userData.detailRole, 'equipment_wolf_cleaner_case');
  assert.equal(player.wolfCleanerKitGroup.getObjectByName('equipment:wolf_sampling_syringe')?.userData.equipmentRole, 'sampling_syringe');
  assert.equal(player.wolfCleanerKitGroup.getObjectByName('equipment:wolf_laser_mine_rack')?.userData.equipmentRole, 'laser_mines');
  assert.equal(player.wolfCleanerKitGroup.getObjectByName('equipment:wolf_power_glove')?.userData.equipmentRole, 'power_glove');
  assert.equal(descendantsWithRole(player.wolfCleanerKitGroup, 'equipment_wolf_anti_acid_armor').length, 1);
  assert.equal(descendantsWithRole(player.wolfCleanerKitGroup, 'equipment_wolf_laser_mine').length, 4);
  assert.equal(player.activeWristbladeVariantId, 'variant_wolf_power_glove');
  assert.equal(player.wristbladeRight.userData.visibleBladeCount, 2);
  assert.equal(player.wristbladeRight.userData.powerGloveReinforced, true);
  assert.equal(player.getVisualFidelityMetrics().activeTriangleCount <= player.getVisualFidelityMetrics().activePolygonBudget, true);
});

test('les animations idle, marche, sprint, attaque, dégâts et soin pilotent réellement le rig', () => {
  const player = makePlayer();
  player.update(0.12, STILL, 0);
  assert.equal(player.currentAnimationState, 'idle');
  const idlePelvisY = player.pelvisRig.position.y;

  player.update(0.12, { x: 1, z: 0, isSprinting: false }, 0);
  assert.equal(player.currentAnimationState, 'walk');
  assert.ok(Math.abs(player.leftLegRig.hip.rotation.x) > 0.02);
  assert.notEqual(player.pelvisRig.position.y, idlePelvisY);

  player.update(0.12, { x: 1, z: 0, isSprinting: true }, 0);
  assert.equal(player.currentAnimationState, 'sprint');
  assert.ok(Math.abs(player.leftArmRig.shoulder.rotation.x) > 0.08);

  player.selectedWeapon = 1;
  assert.equal(player.attack(new THREE.Vector3(0, 0, 20)), 'wristblades');
  player.update(0.08, STILL, 0);
  assert.equal(player.currentAnimationState, 'attack');
  assert.equal(player.wristbladeRight.userData.deploymentState, 'striking');
  assert.ok(player.rightArmRig.shoulder.rotation.x < -0.1);

  player.takeDamage(5);
  player.update(0.04, STILL, 0);
  assert.equal(player.currentAnimationState, 'hit_reaction');
  assert.ok(player.damageReactionTimer > 0);

  player.damageReactionTimer = 0;
  player.isAttacking = false;
  player.attackTimer = 0;
  player.health = 40;
  player.energy = 100;
  player.selectedWeapon = 6;
  player.attack(new THREE.Vector3());
  player.update(0.08, STILL, 0);
  assert.equal(player.currentAnimationState, 'heal');
  assert.ok(player.leftArmRig.elbow.rotation.x < -0.1);
  assert.ok(player.rightArmRig.elbow.rotation.x < -0.1);
});
