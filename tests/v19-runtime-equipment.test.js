import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import {
  ARMOR_FINISHES,
  DEFAULT_CUSTOMIZATION,
  DREAD_STYLES,
  HUNTER_CLASSES,
  PLAYER_GADGETS,
  PLAYABLE_WEAPONS,
  WARPAINT_PATTERNS,
  WEAPON_TECH_VARIANTS,
  getPlayerGadgetById,
  getPlayerGadgetByKey,
  getWeaponTechVariantById,
  getWeaponTechVariantsForWeapon,
  sanitizeCustomization,
} from '../src/data/RuntimeEquipment.js';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';

const idsAreUnique = (entries) => new Set(entries.map(({ id }) => id)).size === entries.length;

test('les nouvelles classes et apparences restent data-driven et conservent les défauts historiques', () => {
  assert.equal(HUNTER_CLASSES.length, 9);
  assert.equal(DREAD_STYLES.length, 8);
  assert.equal(ARMOR_FINISHES.length, 9);
  assert.equal(WARPAINT_PATTERNS.length, 9);
  [HUNTER_CLASSES, DREAD_STYLES, ARMOR_FINISHES, WARPAINT_PATTERNS].forEach((entries) => {
    assert.equal(idsAreUnique(entries), true);
    assert.equal(Object.isFrozen(entries), true);
    entries.forEach((entry) => assert.equal(Object.isFrozen(entry), true));
  });

  assert.deepEqual(
    {
      hunterClassId: DEFAULT_CUSTOMIZATION.hunterClassId,
      dreadStyleId: DEFAULT_CUSTOMIZATION.dreadStyleId,
      armorFinishId: DEFAULT_CUSTOMIZATION.armorFinishId,
      warpaintId: DEFAULT_CUSTOMIZATION.warpaintId,
    },
    {
      hunterClassId: 'class_hunter',
      dreadStyleId: 'dread_style_classic',
      armorFinishId: 'finish_hunter_worn',
      warpaintId: 'warpaint_none',
    },
  );
});

test('la sauvegarde accepte les nouveaux identifiants sans muter les anciennes personnalisations', () => {
  const legacyValue = Object.freeze({
    hunterClassId: 'class_elder',
    dreadStyleId: 'dread_style_long',
    armorFinishId: 'finish_polished',
    warpaintId: 'warpaint_blooded',
  });
  const legacyResult = sanitizeCustomization(legacyValue, 'city_1990');
  assert.equal(legacyResult.hunterClassId, legacyValue.hunterClassId);
  assert.equal(legacyResult.dreadStyleId, legacyValue.dreadStyleId);
  assert.equal(legacyResult.armorFinishId, legacyValue.armorFinishId);
  assert.equal(legacyResult.warpaintId, legacyValue.warpaintId);
  assert.equal(legacyResult.armorPresetId, 'city_1990');

  const result = sanitizeCustomization({
    hunterClassId: 'class_falconer',
    dreadStyleId: 'dread_style_ceremonial',
    armorFinishId: 'finish_obsidian',
    warpaintId: 'warpaint_blood_oath',
  });
  assert.equal(result.hunterClassId, 'class_falconer');
  assert.equal(result.dreadStyleId, 'dread_style_ceremonial');
  assert.equal(result.armorFinishId, 'finish_obsidian');
  assert.equal(result.warpaintId, 'warpaint_blood_oath');

  const invalid = sanitizeCustomization({
    hunterClassId: 'class_inconnue',
    dreadStyleId: 'dread_style_inconnu',
    armorFinishId: 'finish_inconnue',
    warpaintId: 'warpaint_inconnue',
  });
  assert.equal(invalid.hunterClassId, DEFAULT_CUSTOMIZATION.hunterClassId);
  assert.equal(invalid.dreadStyleId, DEFAULT_CUSTOMIZATION.dreadStyleId);
  assert.equal(invalid.armorFinishId, DEFAULT_CUSTOMIZATION.armorFinishId);
  assert.equal(invalid.warpaintId, DEFAULT_CUSTOMIZATION.warpaintId);
});

test('une sélection v1.9 modifie réellement les statistiques et le modèle procédural du joueur', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  const result = player.applyCustomization({
    hunterClassId: 'class_falconer',
    dreadStyleId: 'dread_style_cropped',
    armorFinishId: 'finish_obsidian',
    warpaintId: 'warpaint_blood_oath',
  });

  assert.equal(result.hunterClassId, 'class_falconer');
  assert.deepEqual(
    {
      maxHealth: player.maxHealth,
      maxEnergy: player.maxEnergy,
      maxStamina: player.maxStamina,
      moveSpeed: player.moveSpeed,
      sprintSpeed: player.sprintSpeed,
      meleeMultiplier: player.meleeDamageMultiplier,
      energyRegen: player.energyRegen,
    },
    {
      maxHealth: 90,
      maxEnergy: 130,
      maxStamina: 110,
      moveSpeed: 17.5,
      sprintSpeed: 28,
      meleeMultiplier: 0.92,
      energyRegen: 11,
    },
  );
  player.dreadGroups.forEach((dread) => assert.equal(dread.scale.y, 0.7));
  assert.ok(player.warpaintGroup.children.length >= 3);

  const armorMaterials = [];
  player.mesh.traverse((child) => {
    if (child.isMesh && ['armor', 'mask', 'accent'].includes(child.userData.appearanceChannel)) {
      armorMaterials.push(child.material);
    }
  });
  assert.ok(armorMaterials.length > 0);
  armorMaterials.forEach((material) => {
    assert.equal(material.metalness, 0.58);
    assert.equal(material.roughness, 0.18);
  });
});

test('le registre de gadgets couvre sept technologies jouables avec effets et raccourcis uniques', () => {
  assert.equal(PLAYER_GADGETS.length, 7);
  assert.equal(idsAreUnique(PLAYER_GADGETS), true);
  assert.equal(new Set(PLAYER_GADGETS.map(({ key }) => key)).size, PLAYER_GADGETS.length);
  PLAYER_GADGETS.forEach((gadget) => {
    assert.equal(Object.isFrozen(gadget), true);
    assert.equal(Object.isFrozen(gadget.effects), true);
    assert.equal(typeof gadget.behavior, 'string');
    assert.ok(Number.isFinite(gadget.energyCost) && gadget.energyCost >= 0);
    assert.ok(Number.isFinite(gadget.cooldown) && gadget.cooldown >= 0);
  });

  assert.equal(getPlayerGadgetByKey('KeyF')?.id, 'voice_mimic');
  assert.equal(getPlayerGadgetByKey('KeyV')?.effects.visionModes.length, 3);
  assert.equal(getPlayerGadgetById('optical_cloak')?.effects.energyDrainPerSecond, 12);
  assert.equal(getPlayerGadgetByKey('KeyZ'), null);
  assert.equal(getPlayerGadgetById('gadget_inconnu'), null);
});

test('cinq variantes technologiques deviennent jouables sans casser les dix slots historiques', () => {
  const legacyWeaponIds = [
    'wristblades', 'plasmacaster_single', 'combi_stick', 'smart_disc', 'netgun',
    'medicomp', 'plasma_mines', 'whip_thorns', 'yautja_bow', 'speargun',
  ];
  assert.deepEqual(PLAYABLE_WEAPONS.slice(0, 10).map(({ id }) => id), legacyWeaponIds);
  assert.deepEqual(
    PLAYABLE_WEAPONS.slice(10).map(({ variantId }) => variantId),
    WEAPON_TECH_VARIANTS.map(({ id }) => id),
  );
  assert.equal(PLAYABLE_WEAPONS.length, 15);
  assert.equal(new Set(PLAYABLE_WEAPONS.map(({ slot }) => slot)).size, 15);
  assert.equal(new Set(PLAYABLE_WEAPONS.map(({ key }) => key)).size, 15);

  assert.equal(WEAPON_TECH_VARIANTS.length, 5);
  assert.equal(idsAreUnique(WEAPON_TECH_VARIANTS), true);
  WEAPON_TECH_VARIANTS.forEach((variant) => {
    const baseWeapon = PLAYABLE_WEAPONS.find(({ id }) => id === variant.baseWeaponId);
    assert.ok(baseWeapon, `${variant.id}: arme de base absente`);
    assert.equal(typeof variant.behavior, 'string');
    assert.equal(Object.isFrozen(variant), true);
    assert.equal(Object.isFrozen(variant.sources), true);
    assert.equal(Object.isFrozen(variant.modifiers), true);
    Object.entries(variant.modifiers).forEach(([field, value]) => {
      assert.ok(Number.isFinite(value) && value > 0, `${variant.id}.${field}: valeur invalide`);
    });
  });

  assert.equal(getWeaponTechVariantById('variant_feral_bolt_launcher')?.baseWeaponId, 'speargun');
  assert.equal(getWeaponTechVariantsForWeapon('plasmacaster_single').length, 2);
  assert.equal(getWeaponTechVariantsForWeapon('wristblades').length, 1);
  const missing = getWeaponTechVariantsForWeapon('arme_inconnue');
  assert.deepEqual(missing, []);
  assert.equal(Object.isFrozen(missing), true);
  assert.equal(getWeaponTechVariantById('variant_inconnue'), null);

  const eye = getWeaponTechVariantById('variant_eye_of_ra');
  assert.equal(eye.behavior, 'precision_plasma');
  assert.deepEqual(eye.modifiers, {
    damageMultiplier: 1.5,
    cooldownMultiplier: 1.5,
    energyCostMultiplier: 1.28,
    projectileSpeedMultiplier: 1.38,
  });
  const father = getWeaponTechVariantById('variant_father_sword');
  assert.equal(father.name, 'Épée Yautja — Father');
  assert.equal(father.behavior, 'melee_heavy');
  const rocket = getWeaponTechVariantById('variant_wrist_rocket');
  assert.equal(rocket.baseWeaponId, 'plasma_mines');
  assert.equal(rocket.behavior, 'explosive_projectile');
  assert.equal(rocket.modifiers.blastRadius, 7.5);
});

test('les ajouts de classe et de finition déclarent leur provenance originale', () => {
  for (const id of ['class_tracker', 'class_falconer', 'class_cleaner', 'class_fugitive']) {
    const hunterClass = HUNTER_CLASSES.find((entry) => entry.id === id);
    assert.equal(hunterClass?.sourceTier, 'ORIGINAL', id);
    assert.equal(hunterClass?.implementationOriginal, true, id);
    assert.ok(['SCREEN', 'AVP_SCREEN'].includes(hunterClass?.basisTier), id);
  }
  assert.equal(ARMOR_FINISHES.find(({ id }) => id === 'finish_stargazer_salvaged')?.implementationOriginal, true);
  assert.equal(WARPAINT_PATTERNS.find(({ id }) => id === 'warpaint_fugitive_scar')?.name, 'Balafre d’évadé Apex');
});
