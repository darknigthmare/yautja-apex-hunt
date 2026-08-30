import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';

function makePlayer() {
  return new YautjaPlayer(new THREE.Scene());
}

test('le loadout complet pilote les assemblages portés et expose un contrat QA', () => {
  const player = makePlayer();
  const contract = player.applyHuntLoadout({
    hunterClassId: 'class_hunter',
    core: {
      wristWeaponId: 'wristblades',
      biomaskGadgetId: 'biomask_vision',
      cloakGadgetId: 'optical_cloak',
    },
    slots: {
      melee: 'combi_stick',
      secondary: 'smart_disc',
      ranged: 'plasmacaster_single',
      gadgets: ['wrist_shield', 'voice_mimic'],
      support: 'medicomp',
    },
  });

  assert.deepEqual(contract.activeIds, [
    'wristblades', 'biomask_vision', 'optical_cloak',
    'combi_stick', 'smart_disc', 'plasmacaster_single',
    'wrist_shield', 'voice_mimic', 'medicomp',
  ]);
  assert.deepEqual(player.mesh.userData.activeHuntLoadoutIds, contract.activeIds);
  assert.equal(player.mesh.userData.huntLoadoutVisualApplied, true);
  assert.equal(player.mesh.userData.cloakEmitterEquipped, true);
  assert.equal(player.maskMesh.userData.loadoutEquipped, true);
  assert.equal(player.wristbladeLeft.visible, true);
  assert.equal(player.wristbladeRight.visible, true);
  assert.equal(player.plasmacasterMesh.visible, true);
  assert.deepEqual(player.plasmacasterMesh.userData.activeLoadoutVariantIds, ['plasmacaster_single']);
  assert.equal(player.wristShieldMesh.userData.loadoutEquipped, true);
  assert.equal(player.wristShieldMesh.visible, false, 'le bouclier reste rangé tant qu’il n’est pas activé');

  assert.equal(player.wolfCleanerKitGroup.visible, true, 'le harnais supporte les props hors du preset Wolf');
  assert.equal(player.wolfCleanerKitGroup.getObjectByName('equipment:wolf_cleaner_case').visible, true);
  assert.equal(player.wolfCleanerKitGroup.getObjectByName('equipment:wolf_sampling_syringe').visible, true);
  assert.equal(player.wolfCleanerKitGroup.getObjectByName('equipment:wolf_laser_mine_rack').visible, false);
  assert.equal(player.wolfCleanerKitGroup.getObjectByName('equipment:wolf_power_glove').visible, false);
  assert.ok(contract.linkedStowedVisualIds.includes('medicomp'));
  assert.ok(contract.visibleStowedVisualIds.includes('medicomp'));
  assert.ok(contract.missingStowedVisualIds.includes('smart_disc'));
  assert.ok(contract.deploymentOnlyIds.includes('wrist_shield'));
});

test('changer de paquetage masque le plasma et les équipements non embarqués sans retirer les wristblades', () => {
  const player = makePlayer();
  player.fatherSwordMesh.visible = true;
  player.wristShieldMesh.visible = true;

  const contract = player.applyHuntLoadout({
    slots: {
      melee: 'whip_thorns',
      secondary: 'plasma_mines',
      ranged: 'yautja_bow',
      gadgets: ['scout_drone'],
      support: null,
    },
  });

  assert.equal(player.plasmacasterMesh.visible, false);
  assert.equal(player.plasmacasterMesh.userData.loadoutEquipped, false);
  assert.equal(player.wristbladeLeft.visible, true);
  assert.equal(player.wristbladeRight.visible, true);
  assert.equal(player.fatherSwordMesh.visible, false);
  assert.equal(player.fatherSwordMesh.userData.loadoutEquipped, false);
  assert.equal(player.wristShieldMesh.visible, false);
  assert.equal(player.wristShieldMesh.userData.loadoutEquipped, false);
  assert.equal(player.wolfCleanerKitGroup.getObjectByName('equipment:wolf_cleaner_case').visible, false);
  assert.equal(player.wolfCleanerKitGroup.getObjectByName('equipment:wolf_laser_mine_rack').visible, true);
  assert.ok(contract.visibleStowedVisualIds.includes('plasma_mines'));
  assert.ok(contract.missingStowedVisualIds.includes('whip_thorns'));
  assert.ok(contract.missingStowedVisualIds.includes('yautja_bow'));
});

test('les variantes plasma partagent le caster et les futurs props stowed sont découverts sans dépendance forte', () => {
  const player = makePlayer();
  const smartDiscStowed = new THREE.Group();
  smartDiscStowed.name = 'equipment:smart_disc_stowed';
  player.pelvisRig.add(smartDiscStowed);

  let contract = player.applyHuntLoadout(['wolf_dual_plasma', 'smart_disc']);
  assert.equal(player.plasmacasterMesh.visible, true);
  assert.deepEqual(contract.plasmaCasterVariantIds, ['wolf_dual_plasma']);
  assert.equal(smartDiscStowed.visible, true);
  assert.equal(smartDiscStowed.userData.loadoutEquipped, true);
  assert.ok(contract.linkedStowedVisualIds.includes('smart_disc'));
  assert.equal(contract.missingStowedVisualIds.includes('smart_disc'), false);

  contract = player.applyHuntLoadout(new Set(['eye_of_ra', 'combi_stick']));
  assert.equal(player.plasmacasterMesh.visible, true);
  assert.deepEqual(contract.plasmaCasterVariantIds, ['eye_of_ra']);
  assert.equal(smartDiscStowed.visible, false);
  assert.equal(smartDiscStowed.userData.loadoutEquipped, false);

  contract = player.applyHuntLoadout(['combi_stick']);
  assert.equal(player.plasmacasterMesh.visible, false);
  assert.deepEqual(contract.plasmaCasterVariantIds, []);
});

test('un changement de preset réapplique le loadout et ne réactive pas les props exclus', () => {
  const player = makePlayer();
  player.applyHuntLoadout({
    slots: {
      melee: 'combi_stick',
      secondary: 'smart_disc',
      ranged: 'yautja_bow',
      gadgets: ['voice_mimic'],
      support: null,
    },
  });
  player.applyCustomization({ armorPresetId: 'wolf_avpr' });

  assert.equal(player.wolfCleanerKitGroup.visible, true, 'l’armure Wolf reste une apparence valide');
  assert.equal(player.wolfCleanerKitGroup.getObjectByName('equipment:wolf_anti_acid_chest_plate').visible, true);
  assert.equal(player.wolfCleanerKitGroup.getObjectByName('equipment:wolf_cleaner_case').visible, false);
  assert.equal(player.wolfCleanerKitGroup.getObjectByName('equipment:wolf_laser_mine_rack').visible, false);
  assert.equal(player.plasmacasterMesh.visible, false);
  assert.deepEqual(player.mesh.userData.activeHuntLoadoutIds, [
    'wristblades', 'biomask_vision', 'optical_cloak',
    'combi_stick', 'smart_disc', 'yautja_bow', 'voice_mimic',
  ]);
});
