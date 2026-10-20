import * as THREE from 'three';
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { ShaderManager } from '../Shaders.js';
import { audioSynth } from '../AudioSynthesizer.js';
import { YautjaSkinsDatabase } from '../data/YautjaLoreDatabase.js';
import { calculateHonorAward } from '../gameplay/combatRules.js';
import { disposeObject3D } from '../utils/materialState.js';
import { applySurfaceDetail } from '../utils/surfaceDetail.js';
import { createHeroMaterial } from '../utils/heroMaterials.js';
import { createHeroArmorGeometry } from './HeroArmorGeometry.js';
import { HERO_PROPORTIONS } from './HeroProportions.js';
import {
  createBiomaskSculpt,
  createBiomaskInserts,
  createBodyNetSculpt,
  createCraniumSculpt,
  createHandSculpt,
  createLimbSculpt,
  createMandibleSculpt,
  createPredlockSculpt,
  createTorsoSculpt,
  sculptLoft,
  mergeSculptParts,
  taperedCurve,
} from './HeroSculptGeometry.js';
import {
  ARMOR_ACCENTS,
  ARMOR_PALETTES,
  DREAD_PALETTES,
  MASK_VARIANTS,
  SKIN_PALETTES,
} from '../data/YautjaContentCatalog.js';
import {
  ARMOR_FINISHES,
  DREAD_STYLES,
  HUNTER_CLASSES,
  WARPAINT_PATTERNS,
  DEFAULT_CUSTOMIZATION,
  getArmorPresetCustomization,
  getArmorPresetWeaponTechVariant,
  getPaletteEntry,
  sanitizeCustomization,
} from '../data/RuntimeEquipment.js';
import {
  createMedbayInventoryState,
  applyMedbayItem,
  updateMedbayCooldowns,
  prepareFieldMedbayInventory,
} from '../gameplay/YautjaMedbaySystem.js';


const MIMICRY_LURE_TYPES = Object.freeze(['over_here', 'radio', 'yautja_clicks']);
export const PLAYER_APPEARANCE_TEXTURES = Object.freeze({
  lostTribe: '/assets/textures/lost-tribe-ritual-bone.webp',
  wolfCleaner: '/assets/textures/wolf-cleaner-alloy.webp',
});
const LOST_TRIBE_PRESET_IDS = new Set([
  'elder_lost_tribe', 'boar_lost_tribe', 'shaman_lost_tribe', 'snake_lost_tribe',
  'guardian_lost_tribe', 'stalker_lost_tribe', 'warrior_lost_tribe',
  'armored_lost_tribe', 'scout_lost_tribe',
]);
const AVP_RITUAL_PRESET_IDS = new Set(['scar_avp', 'celtic_avp', 'chopper_avp']);

const MANDATORY_HUNT_VISUAL_IDS = Object.freeze([
  'wristblades',
  'biomask_vision',
  'optical_cloak',
]);

const PLASMACASTER_LOADOUT_IDS = Object.freeze([
  'plasmacaster_single',
  'wolf_dual_plasma',
  'eye_of_ra',
]);

// Contrat extensible des accessoires réellement portés. Les propriétés couvrent
// les futurs assemblages dédiés tandis que les noms permettent de brancher des
// props ajoutés au rig sans rendre YautjaPlayer dépendant du système de loadout.
const STOWED_LOADOUT_VISUAL_BINDINGS = Object.freeze({
  combi_stick: Object.freeze({ properties: Object.freeze(['combiStickStowedMesh', 'combiStickHolsterMesh']), names: Object.freeze(['equipment:combi_stick_stowed', 'equipment:combi_stick_holster']) }),
  smart_disc: Object.freeze({ properties: Object.freeze(['smartDiscStowedMesh', 'smartDiscHolsterMesh']), names: Object.freeze(['equipment:smart_disc_stowed', 'equipment:smart_disc_holster']) }),
  netgun: Object.freeze({ properties: Object.freeze(['netgunStowedMesh', 'netgunHolsterMesh']), names: Object.freeze(['equipment:netgun_stowed', 'equipment:netgun_holster']) }),
  medicomp: Object.freeze({ properties: Object.freeze(['medicompStowedMesh', 'medicompPouchMesh']), names: Object.freeze(['equipment:medicomp_stowed', 'equipment:medicomp_pouch', 'equipment:wolf_cleaner_case', 'equipment:wolf_sampling_syringe']) }),
  plasma_mines: Object.freeze({ properties: Object.freeze(['plasmaMineRackMesh']), names: Object.freeze(['equipment:plasma_mine_rack', 'equipment:wolf_laser_mine_rack']) }),
  whip_thorns: Object.freeze({ properties: Object.freeze(['whipStowedMesh', 'whipCoilMesh']), names: Object.freeze(['equipment:whip_stowed', 'equipment:whip_coil']) }),
  yautja_bow: Object.freeze({ properties: Object.freeze(['bowStowedMesh', 'yautjaBowStowedMesh']), names: Object.freeze(['equipment:yautja_bow_stowed', 'equipment:bow_holster']) }),
  speargun: Object.freeze({ properties: Object.freeze(['speargunStowedMesh']), names: Object.freeze(['equipment:speargun_stowed']) }),
  feral_bolt_launcher: Object.freeze({ properties: Object.freeze(['feralBoltLauncherStowedMesh']), names: Object.freeze(['equipment:feral_bolt_launcher_stowed']) }),
  father_sword: Object.freeze({ properties: Object.freeze(['fatherSwordStowedMesh']), names: Object.freeze(['equipment:father_sword_stowed', 'equipment:father_sword_scabbard']) }),
  wrist_rocket: Object.freeze({ properties: Object.freeze(['wristRocketStowedMesh']), names: Object.freeze(['equipment:wrist_rocket_stowed']) }),
  wrist_shield: Object.freeze({ properties: Object.freeze(['wristShieldStowedMesh']), names: Object.freeze(['equipment:wrist_shield_stowed']) }),
  scout_drone: Object.freeze({ properties: Object.freeze(['scoutDroneStowedMesh']), names: Object.freeze(['equipment:scout_drone_stowed']) }),
  shuriken: Object.freeze({ properties: Object.freeze(['shurikenStowedMesh']), names: Object.freeze(['equipment:shuriken_stowed']) }),
  apex_decoy: Object.freeze({ properties: Object.freeze(['apexDecoyStowedMesh']), names: Object.freeze(['equipment:apex_decoy_stowed']) }),
});

function collectHuntLoadoutIds(loadoutOrIds) {
  const ids = [];
  const add = (value) => {
    if (typeof value === 'string' && value.trim() && !ids.includes(value.trim())) ids.push(value.trim());
  };
  const addMany = (value) => {
    if (Array.isArray(value) || value instanceof Set) [...value].forEach(add);
  };

  MANDATORY_HUNT_VISUAL_IDS.forEach(add);
  if (typeof loadoutOrIds === 'string') add(loadoutOrIds);
  else if (Array.isArray(loadoutOrIds) || loadoutOrIds instanceof Set) addMany(loadoutOrIds);
  else if (loadoutOrIds && typeof loadoutOrIds === 'object') {
    addMany(loadoutOrIds.activeItemIds);
    addMany(loadoutOrIds.equippedItemIds);
    addMany(loadoutOrIds.selectedWeaponIds);
    addMany(loadoutOrIds.selectedGadgetIds);
    addMany(loadoutOrIds.weapons);
    addMany(loadoutOrIds.gadgets);
    Object.values(loadoutOrIds.core ?? {}).forEach(add);
    const slots = loadoutOrIds.slots ?? {};
    add(slots.melee);
    add(slots.secondary);
    add(slots.ranged);
    addMany(slots.gadgets);
    add(slots.support);
  }
  return ids;
}

const PLAYER_RIG_JOINTS = Object.freeze([
  'rig_root', 'pelvis', 'torso', 'neck', 'head',
  'shoulder_l', 'elbow_l', 'wrist_l', 'shoulder_r', 'elbow_r', 'wrist_r',
  'hip_l', 'knee_l', 'ankle_l', 'hip_r', 'knee_r', 'ankle_r',
]);

const PLAYER_ANIMATION_STATES = Object.freeze([
  'idle', 'walk', 'sprint', 'attack', 'hit_reaction', 'heal', 'perched', 'self_destruct',
]);

function countGeometryTriangles(geometry) {
  if (!geometry) return 0;
  if (geometry.index) return geometry.index.count / 3;
  return (geometry.attributes?.position?.count ?? 0) / 3;
}

function firstMeshMaterial(root) {
  let material = null;
  root.traverse((child) => {
    if (!material && child.isMesh) material = child.material;
  });
  return material;
}

function tagWeaponAssembly(group, equipmentRole) {
  Object.assign(group.userData, {
    equipmentRole,
    isPlaceholder: false,
    visualTier: 'detailed_procedural_weapon',
    provenance: 'original_fan_made_procedural',
  });
  return group;
}

function tagWeaponPart(mesh, name, detailRole) {
  mesh.name = name;
  mesh.castShadow = true;
  Object.assign(mesh.userData, {
    detailRole,
    isPlaceholder: false,
  });
  return mesh;
}

function createRadialBladeGeometry(innerRadius, outerRadius, halfWidth, depth = 0.09) {
  const blade = new THREE.Shape();
  blade.moveTo(innerRadius, -halfWidth * 0.64);
  blade.lineTo(outerRadius - 0.2, -halfWidth);
  blade.lineTo(outerRadius - 0.07, -halfWidth * 0.48);
  blade.lineTo(outerRadius - 0.15, -halfWidth * 0.12);
  blade.lineTo(outerRadius, 0);
  blade.lineTo(outerRadius - 0.15, halfWidth * 0.12);
  blade.lineTo(outerRadius - 0.07, halfWidth * 0.48);
  blade.lineTo(outerRadius - 0.2, halfWidth);
  blade.lineTo(innerRadius, halfWidth * 0.64);
  blade.lineTo(innerRadius + 0.08, 0);
  blade.closePath();
  const geometry = new THREE.ExtrudeGeometry(blade, {
    depth,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: Math.min(0.025, depth * 0.3),
    bevelThickness: Math.min(0.018, depth * 0.22),
    curveSegments: 1,
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

export class YautjaPlayer {
  constructor(scene) {
    this.scene = scene;
    this.leatherNetTexture = null;
    this.skinTexture = null;
    this.maskTexture = null;
    this.lostTribeTexture = null;
    this.wolfCleanerTexture = null;
    if (typeof document !== 'undefined') {
      const textureLoader = new THREE.TextureLoader();
      this.leatherNetTexture = textureLoader.load(
        '/assets/textures/yautja-leather-net.webp',
        undefined,
        undefined,
        () => console.warn('Texture du filet Yautja indisponible, fallback sombre conservé.'),
      );
      this.leatherNetTexture.wrapS = THREE.RepeatWrapping;
      this.leatherNetTexture.wrapT = THREE.RepeatWrapping;
      this.leatherNetTexture.repeat.set(1.5, 2.2);
      this.leatherNetTexture.colorSpace = THREE.SRGBColorSpace;

      this.skinTexture = textureLoader.load(
        '/assets/textures/yautja-skin-albedo-v2.webp',
        undefined,
        undefined,
        () => console.warn('Texture de peau Yautja indisponible, teinte procédurale conservée.'),
      );
      this.maskTexture = textureLoader.load(
        '/assets/textures/biomask-etched-alloy.webp',
        undefined,
        undefined,
        () => console.warn('Texture du bio-masque indisponible, alliage procédural conservé.'),
      );
      this.lostTribeTexture = textureLoader.load(
        PLAYER_APPEARANCE_TEXTURES.lostTribe,
        undefined, undefined,
        () => console.warn('Texture rituelle Lost Tribe indisponible, alliage standard conservé.'),
      );
      this.wolfCleanerTexture = textureLoader.load(
        PLAYER_APPEARANCE_TEXTURES.wolfCleaner,
        undefined, undefined,
        () => console.warn('Texture Cleaner indisponible, alliage standard conservé.'),
      );
      [this.skinTexture, this.maskTexture, this.lostTribeTexture, this.wolfCleanerTexture].forEach((texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1.4, 1.4);
        texture.colorSpace = THREE.SRGBColorSpace;
      });
      this.skinTexture.repeat.set(1, 1);
    }

    // Attributes
    this.maxHealth = 100;
    this.health = 100;
    this.maxEnergy = 100;
    this.energy = 100;
    this.maxStamina = 100;
    this.stamina = 100;
    this.honorScore = 1000;
    this.lifetimeHonor = 1000;
    this.energyRegen = 8;
    this.meleeDamageMultiplier = 1;
    this.hunterClassMeleeMultiplier = 1;
    this.wristbladeDamageMultiplier = 1;
    this.wristbladeRangeMultiplier = 1;
    this.wristbladeCooldownMultiplier = 1;
    this.wristbladeVisualLengthScale = 1;
    this.wristbladeRestPositionZ = 0.35;
    this.wristbladeAttackPositionZ = 0.65;
    this.honorRankIndex = 1;
    this.completedHunts = [];
    this.completedDirectiveIds = [];
    this.discoveredPoiIds = [];

    this.ranks = [
      "JEUNE SANG (YOUNG BLOOD)",
      "SANG DU CHASSEUR (BLOODED)",
      "CHASSEUR D'ÉLITE (ELITE PREDATOR)",
      "ANCIEN MAÎTRE (YAUTJA ELDER)"
    ];

    this.currentSkinId = 'jungle_1987';
    this.customization = { ...DEFAULT_CUSTOMIZATION };
    this.mimicryLureIndex = 0;
    this.activeHuntLoadoutIds = [];
    this.huntLoadoutVisualApplied = false;

    // Forge Upgrades
    this.hasTriBeam = false;
    this.hasAntiAcidCloak = false;
    this.hasScopeZoom = false;

    // State Flags
    this.isCloaked = false;
    this.isSubmerged = false;
    this.activeVisionMode = 'normal';
    this.selectedWeapon = 1;
    this.isAttacking = false;
    this.isHealing = false;
    this.attackTimer = 0;
    this.healTimer = 0;
    this.isPerched = false;
    this.currentPerchNode = null;
    this.isAcidCorroded = false;
    this.acidTimer = 0;
    this.isBleeding = false;
    this.medbayInventory = createMedbayInventoryState({ isMothership: false });
    this.roarUsed = false;
    this.wristShieldActive = false;
    this.wristShieldTimer = 0;
    this.wristShieldCooldown = 0;
    this.wristShieldIntegrity = 100;
    this.scoutDrone = null;
    this.scoutDroneTimer = 0;
    this.scoutDroneCooldown = 0;
    this.scoutDroneAge = 0;
    this.shurikenCooldown = 0;
    this.apexDecoy = null;
    this.apexDecoyTimer = 0;
    this.apexDecoyCooldown = 0;
    this.apexDecoyAge = 0;
    this.animationTime = 0;
    this.attackAnimationClock = 0;
    this.damageReactionTimer = 0;
    this.currentAnimationState = 'idle';
    this.combatStatusTimers = {
      snare: 0,
      disorientation: 0,
      suppression: 0,
    };

    // QTE State
    this.inQTE = false;
    this.qteTimer = 0;

    this.isSelfDestructing = false;
    this.selfDestructTimer = 0;
    this.selfDestructComplete = false;
    this.isDead = false;
    this.defeatReason = null;

    // Movement Vectors
    this.position = new THREE.Vector3(0, 0, 40);
    this.moveSpeed = 16.0;
    this.sprintSpeed = 26.0;

    this.projectiles = [];
    this.mines = [];

    // Mesh
    this.mesh = this.createYautjaMesh();
    this.scene.add(this.mesh);
    this.mesh.userData.activeHuntLoadoutIds = [];
    this.mesh.userData.huntLoadoutVisualApplied = false;

    this.mesh.traverse((child) => {
      if (child.isMesh) child.userData.baseMaterial = child.material;
    });
    this.normalMaterial = firstMeshMaterial(this.mesh);
    this.cloakMaterial = ShaderManager.createCloakMaterial();
    this.heroBodyReady = this.installOrganicBody();
  }

  async installOrganicBody() {
    if (typeof document === 'undefined') return null;
    try {
      const { loadHeroOrganicBody, createOrganicBodyMesh } = await import('./HeroOrganicBody.js');
      const asset = await loadHeroOrganicBody();
      if (!asset) return null;
      const skin = getPaletteEntry(SKIN_PALETTES, this.customization.skinColorId, DEFAULT_CUSTOMIZATION.skinColorId);
      const material = createHeroMaterial('skin', {
        color: skin.hex, referenceColor: 0x5c6042,
        baseColorMap: asset.material.map, normalMap: asset.material.normalMap,
        roughnessMap: asset.material.roughnessMap ?? undefined,
        aoMap: asset.material.aoMap, metalness: 0, roughness: 0.68,
        normalScale: asset.material.normalScale,
      });
      this.organicBodyMesh = await createOrganicBodyMesh(this, material);
      const replaced = new Set(['anatomy_pelvis', 'anatomy_torso', 'anatomy_neck', 'anatomy_upper_arm', 'anatomy_deltoid', 'anatomy_forearm', 'anatomy_thigh', 'anatomy_shin']);
      this.mesh.traverse(object => {
        if (object.isMesh && replaced.has(object.userData.detailRole)) {
          object.visible = false;
          object.userData.replacedByOrganicBody = true;
        }
      });
      if (this.isCloaked) {
        this.organicBodyMesh.userData.materialBeforeCloak = material;
        this.organicBodyMesh.material = this.cloakMaterial;
      }
      this.mesh.userData.organicBodyLoaded = true;
      this.refreshVisualFidelityMetrics(this.mesh);
      return this.organicBodyMesh;
    } catch (error) {
      this.mesh.userData.organicBodyLoadError = error.message;
      console.error('Chargement du corps anatomique impossible.', error);
      return null;
    }
  }

  createYautjaMesh() {
    const yautjaGroup = new THREE.Group();
    yautjaGroup.name = 'player:YautjaHero';
    yautjaGroup.userData.characterType = 'yautja_player';
    yautjaGroup.userData.detailPass = 'sculpted_hunter_surface_pass';

    const skinData = YautjaSkinsDatabase.find(s => s.id === this.currentSkinId) || YautjaSkinsDatabase[0];

    const armorPalette = getPaletteEntry(ARMOR_PALETTES, this.customization.armorColorId, DEFAULT_CUSTOMIZATION.armorColorId);
    const skinPalette = getPaletteEntry(SKIN_PALETTES, this.customization.skinColorId, DEFAULT_CUSTOMIZATION.skinColorId);
    const dreadPalette = getPaletteEntry(DREAD_PALETTES, this.customization.dreadColorId, DEFAULT_CUSTOMIZATION.dreadColorId);
    const accentPalette = getPaletteEntry(ARMOR_ACCENTS, this.customization.armorAccentColorId, DEFAULT_CUSTOMIZATION.armorAccentColorId);
    const maskData = MASK_VARIANTS.find(({ id }) => id === this.customization.maskId) ?? MASK_VARIANTS[0];

    const armorMat = createHeroMaterial('armor', {
      color: armorPalette?.hex ?? skinData.col,
      metalness: 0.42,
      roughness: 0.58,
    });
    const skinMat = createHeroMaterial('skin', {
      color: skinPalette?.hex ?? 0x4a4436,
      baseColorMap: this.skinTexture,
      referenceColor: 0x5c6042,
      roughness: 0.68,
    });
    const goldMat = createHeroMaterial('edgeMetal', {
      color: accentPalette?.hex ?? 0xffb700,
      metalness: 0.86,
      roughness: 0.43,
    });

    this.rigRoot = new THREE.Group();
    this.rigRoot.name = 'joint:rig_root';
    yautjaGroup.add(this.rigRoot);

    this.pelvisRig = new THREE.Group();
    this.pelvisRig.name = 'joint:pelvis';
    this.pelvisRig.position.y = HERO_PROPORTIONS.pelvisY;
    this.rigRoot.add(this.pelvisRig);

    const pelvis = this.tagPlayerMesh(
      new THREE.Mesh(new THREE.CapsuleGeometry(0.76, 0.52, 10, 22), skinMat),
      'skin',
      'anatomy_pelvis',
    );
    pelvis.name = 'anatomy:pelvis';
    pelvis.scale.set(1.2, 0.82, 0.92);
    this.pelvisRig.add(pelvis);
    for (const side of [-1, 1]) {
      const beltPlate = this.tagPlayerMesh(
        new THREE.Mesh(this.createArmorPlateGeometry(0.76, 0.56, 0.18, 0.11), armorMat),
        'armor',
        'equipment_segmented_belt',
      );
      beltPlate.name = `equipment:belt_plate_${side < 0 ? 'l' : 'r'}`;
      beltPlate.position.set(side * 0.38, 0.06, 0.5);
      beltPlate.scale.set(0.78, 0.62, 0.75);
      beltPlate.rotation.z = side * -0.08;
      this.pelvisRig.add(beltPlate);
    }
    const beltCore = this.tagPlayerMesh(
      new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 1), goldMat),
      'accent',
      'equipment_belt_core',
    );
    beltCore.name = 'equipment:belt_core';
    beltCore.position.set(0, 0.08, 0.6);
    beltCore.scale.set(0.58, 0.48, 0.32);
    this.pelvisRig.add(beltCore);

    this.torsoRig = new THREE.Group();
    this.torsoRig.name = 'joint:torso';
    this.torsoRig.position.y = HERO_PROPORTIONS.torsoY;
    this.pelvisRig.add(this.torsoRig);

    const torsoGeo = createTorsoSculpt();
    const torso = this.tagPlayerMesh(new THREE.Mesh(torsoGeo, skinMat), 'skin', 'anatomy_torso');
    torso.name = 'anatomy:torso';
    torso.position.y = 0.74;
    torso.scale.set(0.76, 1, 0.82);
    this.torsoRig.add(torso);
    this.torsoBody = torso;

    const abdominalArmor = this.tagPlayerMesh(
      this.createFittedArmorPart('abdominal', armorMat),
      'armor',
      'equipment_abdominal_plate',
    );
    abdominalArmor.name = 'equipment:abdominal_plate';
    abdominalArmor.position.set(0, 0.07, 0.52);
    abdominalArmor.rotation.x = -0.08;
    this.torsoRig.add(abdominalArmor);

    const chestArmor = this.tagPlayerMesh(
      this.createFittedArmorPart('chest', armorMat, { width: 1.08, height: 0.46, depth: 0.16 }),
      'armor',
      'equipment_articulated_chest_plate',
    );
    chestArmor.name = 'equipment:chest_plate';
    chestArmor.position.set(0, 1.48, 0.43);
    chestArmor.rotation.x = -0.07;
    this.torsoRig.add(chestArmor);
    this.chestArmorMesh = chestArmor;
    for (const side of [-1, 1]) {
      const pectoral = this.tagPlayerMesh(
        this.createFittedArmorPart('pectoral', armorMat, { side, depth: 0.13 }),
        'armor',
        'equipment_pectoral_plate',
      );
      pectoral.name = `equipment:pectoral_plate_${side < 0 ? 'l' : 'r'}`;
      pectoral.position.set(side * 0.48, 1.06, 0.56);
      pectoral.rotation.set(-0.08, side * 0.16, side * -0.09);
      this.torsoRig.add(pectoral);
    }
    for (let ribIndex = 0; ribIndex < 4; ribIndex += 1) {
      const rib = this.tagPlayerMesh(
        this.createFittedArmorPart('abdominal', armorMat, { width: 0.72 - ribIndex * 0.06, height: 0.16, depth: 0.08 }),
        'armor',
        'equipment_chest_articulation',
      );
      rib.name = `detail:chest_articulation_${ribIndex}`;
      rib.position.set(0, 0.67 - ribIndex * 0.18, 0.6);
      this.torsoRig.add(rib);
    }

    const netGeo = createBodyNetSculpt();
    const netMat = new THREE.MeshStandardMaterial({
      color: 0x29271f,
      roughness: 0.82,
      metalness: 0.08,
    });
    applySurfaceDetail(netMat, { kind: 'fabric', repeat: [3, 8], normalStrength: 0.2, roughnessStrength: 0.3 });
    const net = new THREE.Mesh(netGeo, netMat);
    net.name = 'equipment:body_netting';
    net.position.y = 0.73;
    net.scale.set(0.78, 1, 0.84);
    net.userData.detailRole = 'equipment_textured_body_net';
    this.torsoRig.add(net);

    const neckRig = new THREE.Group();
    neckRig.name = 'joint:neck';
    neckRig.position.set(0, HERO_PROPORTIONS.neckY, 0);
    this.torsoRig.add(neckRig);
    const neck = this.tagPlayerMesh(
      new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.58, 0.68, 24, 4), skinMat),
      'skin',
      'anatomy_neck',
    );
    neck.name = 'anatomy:neck';
    neck.position.y = 0.12;
    neck.scale.set(0.6, 0.7, 0.6);
    neckRig.add(neck);

    const headGroup = new THREE.Group();
    headGroup.name = 'joint:head';
    headGroup.position.y = HERO_PROPORTIONS.headY;
    headGroup.scale.setScalar(HERO_PROPORTIONS.headScale);
    neckRig.add(headGroup);
    this.headRig = headGroup;
    const biologicalHead = new THREE.Mesh(createCraniumSculpt(), skinMat);
    biologicalHead.name = 'anatomy:yautja_head';
    biologicalHead.scale.set(1, 1, 1);
    biologicalHead.position.set(0, 0.12, 0.02);
    biologicalHead.castShadow = true;
    biologicalHead.userData.appearanceChannel = 'skin';
    biologicalHead.userData.detailRole = 'anatomy_cranial_dome';
    headGroup.add(biologicalHead);

    const jaw = this.tagPlayerMesh(
      new THREE.Mesh(new THREE.SphereGeometry(0.68, 24, 18), skinMat),
      'skin',
      'anatomy_mandible_base',
    );
    jaw.name = 'anatomy:mandible_base';
    jaw.position.set(0, -0.38, 0.42);
    jaw.scale.set(1.2, 0.55, 0.68);
    jaw.visible = false;
    headGroup.add(jaw);
    for (const side of [-1, 1]) {
      for (const upper of [-1, 1]) {
        const sculpture = createMandibleSculpt(side, upper > 0);
        const mandible = this.tagPlayerMesh(
          new THREE.Mesh(sculpture.tissue, skinMat),
          'skin',
          'anatomy_articulated_mandible',
        );
        mandible.name = `anatomy:mandible_${side < 0 ? 'l' : 'r'}_${upper < 0 ? 'lower' : 'upper'}`;
        headGroup.add(mandible);
        const tusk = this.tagPlayerMesh(
          new THREE.Mesh(sculpture.tusk, this.heroClawMaterial ??= createHeroMaterial('bone')),
          'bone',
          'anatomy_mandible_tusk',
        );
        tusk.name = `detail:mandible_tusk_${side}_${upper}`;
        headGroup.add(tusk);
      }
    }

    const maskMat = createHeroMaterial('mask', {
      color: maskData.armorColor,
      metalness: 0.87,
      roughness: 0.46,
    });
    this.maskMesh = new THREE.Mesh(this.createMaskGeometry(maskData), maskMat);
    this.maskMesh.name = 'equipment:biomask';
    this.maskMesh.position.set(0, 0.18, 0.38);
    this.maskMesh.castShadow = true;
    this.maskMesh.userData.appearanceChannel = 'mask';
    this.maskMesh.userData.detailRole = 'equipment_biomask_shell';
    headGroup.add(this.maskMesh);
    this.maskDetailGroup = new THREE.Group();
    this.maskDetailGroup.name = 'equipment:biomask_details';
    headGroup.add(this.maskDetailGroup);

    const runeParts = [
      { geometry: new THREE.BoxGeometry(0.022, 0.22, 0.018), position: [-0.08, 0, 0] },
      { geometry: new THREE.BoxGeometry(0.022, 0.18, 0.018), position: [0.035, 0.025, 0], rotation: [0, 0, -0.52] },
      { geometry: new THREE.BoxGeometry(0.022, 0.14, 0.018), position: [0.08, -0.045, 0], rotation: [0, 0, 0.52] },
    ];
    const runePlateGeo = mergeSculptParts(runeParts);
    runeParts.forEach(({ geometry }) => geometry.dispose());
    const runePlate = new THREE.Mesh(runePlateGeo, goldMat);
    runePlate.name = 'detail:biomask_rune_plate';
    runePlate.position.set(0, 0.83, 0.99);
    headGroup.add(runePlate);
    runePlate.userData.appearanceChannel = 'accent';
    runePlate.userData.detailRole = 'equipment_biomask_rune_plate';

    const triLaserLight = new THREE.PointLight(0xff0000, 0.08, 1.2);
    triLaserLight.position.set(0.91, 0.43, 0.55);
    headGroup.add(triLaserLight);

    const lensGeo = new THREE.SphereGeometry(0.03, 12, 10);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.name = 'equipment:biomask_targeting_lens';
    lens.position.set(0.91, 0.43, 0.55);
    lens.userData.detailRole = 'equipment_biomask_lens';
    headGroup.add(lens);
    this.maskLens = lens;

    const dreadMat = createHeroMaterial('dread', { color: dreadPalette?.hex ?? 0x0c0c0e, roughness: 0.72 });
    const dreadBeadGeometry = new THREE.TorusGeometry(0.14, 0.035, 8, 16);
    const dreadBeadTransform = new THREE.Object3D();
    this.dreadGroups = [];
    for (let i = -5; i <= 5; i++) {
      const dreadGroup = new THREE.Group();
      dreadGroup.name = `joint:dread_${i + 5}`;
      const dread = new THREE.Mesh(createPredlockSculpt(i + 5), dreadMat);
      dread.name = `anatomy:dread_${i + 5}`;
      dread.position.y = -1.4;
      dread.userData.appearanceChannel = 'dread';
      dread.userData.detailRole = 'anatomy_articulated_dread';
      dreadGroup.add(dread);

      const beadSet = new THREE.InstancedMesh(dreadBeadGeometry, goldMat, 3);
      beadSet.name = `detail:dread_bead_set_${i + 5}`;
      beadSet.userData.appearanceChannel = 'accent';
      beadSet.userData.detailRole = 'equipment_dread_bead';
      beadSet.userData.instanceDetailCount = 3;
      beadSet.castShadow = true;
      for (let beadIndex = 0; beadIndex < 3; beadIndex += 1) {
        dreadBeadTransform.position.set(0, -0.5 - beadIndex * 0.72, 0);
        dreadBeadTransform.rotation.set(Math.PI / 2, 0, 0);
        dreadBeadTransform.scale.set(1, 1, 1);
        dreadBeadTransform.updateMatrix();
        beadSet.setMatrixAt(beadIndex, dreadBeadTransform.matrix);
      }
      beadSet.instanceMatrix.needsUpdate = true;
      dreadGroup.add(beadSet);

      dreadGroup.rotation.z = i * 0.085;
      dreadGroup.rotation.x = 0.22;
      dreadGroup.position.set(Math.sin(i * 0.23) * 0.73, 0.65, -Math.cos(i * 0.23) * 0.56);
      dreadGroup.userData.basePosition = dreadGroup.position.clone();
      dreadGroup.userData.baseRotation = dreadGroup.rotation.clone();
      dreadGroup.userData.animationBaseRotation = dreadGroup.rotation.clone();
      dreadGroup.userData.dreadIndex = i + 5;
      this.dreadGroups.push(dreadGroup);
      headGroup.add(dreadGroup);
    }

    this.leftArmRig = this.createArmRig(-1, skinMat, armorMat, goldMat);
    this.rightArmRig = this.createArmRig(1, skinMat, armorMat, goldMat);
    this.torsoRig.add(this.leftArmRig.shoulder, this.rightArmRig.shoulder);

    this.leftLegRig = this.createLegRig(-1, skinMat, armorMat, goldMat);
    this.rightLegRig = this.createLegRig(1, skinMat, armorMat, goldMat);
    this.pelvisRig.add(this.leftLegRig.hip, this.rightLegRig.hip);
    this.addSculptedHeroEquipment(armorMat, skinMat, goldMat);

    this.plasmacasterMesh = this.createPlasmaCasterAssembly(armorMat, goldMat);
    this.plasmacasterMesh.scale.setScalar(0.68);
    this.plasmacasterMesh.position.set(0.08, 0.18, -0.22);
    this.plasmacasterMesh.rotation.set(-0.16, 0, 0.08);
    this.leftArmRig.shoulder.add(this.plasmacasterMesh);

    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xd9e4e4,
      metalness: 1,
      roughness: 0.14,
      envMapIntensity: 1.15,
    });
    bladeMat.userData.materialIdentity = 'wristblade_honed_alloy';

    this.wristbladeRight = this.createWristbladeAssembly(1, armorMat, goldMat, bladeMat);
    this.wristbladeRight.position.set(0, 0, this.wristbladeRestPositionZ);
    this.mountWristbladeSocket(this.rightArmRig.wrist, this.wristbladeRight, 1);

    this.wristbladeLeft = this.createWristbladeAssembly(-1, armorMat, goldMat, bladeMat);
    this.wristbladeLeft.position.set(0, 0, this.wristbladeRestPositionZ);
    this.mountWristbladeSocket(this.leftArmRig.wrist, this.wristbladeLeft, -1);

    this.fatherSwordMesh = new THREE.Group();
    this.fatherSwordMesh.name = 'playerFatherThermalSword';
    this.fatherSwordMesh.userData.equipmentRole = 'father_thermal_sword';
    this.fatherSwordMesh.position.set(0.45, -0.2, 0.45);
    this.fatherSwordMesh.rotation.set(-0.2, 0, -0.28);
    const fatherSwordMaterial = new THREE.MeshStandardMaterial({ color: 0xc8f4ef, emissive: 0x2dc7b6, emissiveIntensity: 1.35, metalness: 0.94, roughness: 0.12 });
    const fatherBladeShape = new THREE.Shape();
    fatherBladeShape.moveTo(-0.12, 0);
    fatherBladeShape.lineTo(0.12, 0);
    fatherBladeShape.lineTo(0.17, 3.65);
    fatherBladeShape.lineTo(0, 4.5);
    fatherBladeShape.lineTo(-0.17, 3.65);
    fatherBladeShape.closePath();
    const fatherBladeGeometry = new THREE.ExtrudeGeometry(fatherBladeShape, {
      depth: 0.13, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.035, bevelThickness: 0.03,
    });
    fatherBladeGeometry.rotateX(Math.PI / 2);
    const fatherBlade = this.tagPlayerMesh(
      new THREE.Mesh(fatherBladeGeometry, fatherSwordMaterial),
      'blade',
      'equipment_father_sword_tapered_blade',
    );
    fatherBlade.name = 'weapon:father_thermal_blade';
    fatherBlade.position.z = 2.25;
    const fatherGuard = this.tagPlayerMesh(
      new THREE.Mesh(this.createArmorPlateGeometry(1.25, 0.28, 0.2, 0.1), bladeMat),
      'blade',
      'equipment_father_sword_guard',
    );
    fatherGuard.name = 'equipment:father_sword_guard';
    fatherGuard.position.z = 0.18;
    const fatherGrip = this.tagPlayerMesh(
      new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 1.05, 18), dreadMat),
      'dread',
      'equipment_father_sword_grip',
    );
    fatherGrip.name = 'equipment:father_sword_grip';
    fatherGrip.rotation.x = Math.PI / 2;
    fatherGrip.position.z = -0.48;
    this.fatherSwordMesh.add(fatherBlade, fatherGuard, fatherGrip);
    this.fatherSwordMesh.visible = false;
    this.rightArmRig.wrist.add(this.fatherSwordMesh);

    this.wristShieldMesh = new THREE.Group();
    this.wristShieldMesh.name = 'playerWristShield';
    this.wristShieldMesh.userData.equipmentRole = 'wrist_shield';
    this.wristShieldMesh.position.set(0, -0.1, 0.62);
    [-1, 0, 1].forEach((segment) => {
      const panel = this.tagPlayerMesh(
        new THREE.Mesh(this.createArmorPlateGeometry(0.72, 2.9, 0.16, 0.15), armorMat),
        'armor',
        'equipment_wrist_shield_segment',
      );
      panel.name = `equipment:wrist_shield_segment_${segment + 1}`;
      panel.position.x = segment * 0.62;
      panel.rotation.z = segment * 0.12;
      this.wristShieldMesh.add(panel);
    });
    const shieldCore = new THREE.PointLight(0x55eeff, 2.4, 9);
    shieldCore.position.z = 0.25;
    this.wristShieldMesh.add(shieldCore);
    this.wristShieldMesh.visible = false;
    this.leftArmRig.wrist.add(this.wristShieldMesh);

    this.wolfCleanerKitGroup = this.createWolfCleanerKit(armorMat, goldMat, bladeMat);
    this.wolfCleanerKitGroup.visible = false;
    this.wolfCleanerKitGroup.position.y = -HERO_PROPORTIONS.pelvisY;
    this.pelvisRig.add(this.wolfCleanerKitGroup);

    this.avpRitualArmorGroup = this.createAvpRitualArmor(armorMat, goldMat);
    this.avpRitualArmorGroup.visible = false;
    this.avpRitualArmorGroup.position.y = -HERO_PROPORTIONS.pelvisY;
    this.pelvisRig.add(this.avpRitualArmorGroup);
    this.warpaintGroup = new THREE.Group();
    this.warpaintGroup.name = 'playerWarpaint';
    this.headRig.add(this.warpaintGroup);

    yautjaGroup.position.copy(this.position);
    this.syncAppearanceJointMounts(yautjaGroup);
    this.rebuildMaskDetails(maskData);
    this.refreshVisualFidelityMetrics(yautjaGroup);
    return yautjaGroup;
  }

  createArmorPlateGeometry(width, height, depth, taper = 0.16) {
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    const cut = Math.min(halfWidth * 0.55, Math.max(0.04, taper));
    const shape = new THREE.Shape();
    shape.moveTo(-halfWidth + cut, -halfHeight);
    shape.lineTo(halfWidth - cut, -halfHeight);
    shape.lineTo(halfWidth, -halfHeight + cut);
    shape.lineTo(halfWidth * 0.9, halfHeight - cut * 0.45);
    shape.lineTo(halfWidth - cut * 0.45, halfHeight);
    shape.lineTo(-halfWidth + cut * 0.45, halfHeight);
    shape.lineTo(-halfWidth * 0.9, halfHeight - cut * 0.45);
    shape.lineTo(-halfWidth, -halfHeight + cut);
    shape.closePath();
    const sourceGeometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      steps: 1,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: Math.min(0.055, depth * 0.3),
      bevelThickness: Math.min(0.045, depth * 0.25),
    });
    let geometry = new TessellateModifier(Math.max(0.08, Math.min(width, height) * 0.26), 3).modify(sourceGeometry);
    sourceGeometry.dispose();
    geometry.translate(0, 0, -depth * 0.5);
    const positions = geometry.attributes.position;
    for (let index = 0; index < positions.count; index++) {
      const x = positions.getX(index), y = positions.getY(index);
      const crown = Math.max(0, 1 - Math.pow(x / halfWidth, 2))
        * Math.max(0, 1 - Math.pow(y / halfHeight, 2));
      positions.setZ(index, positions.getZ(index) + crown * Math.min(width, height) * 0.16);
    }
    geometry.deleteAttribute('normal');
    const welded = mergeVertices(geometry, 0.00001);
    geometry.dispose();
    geometry = welded;
    geometry.computeVertexNormals();
    geometry.userData.authoredSurface = 'crowned_bevelled_armor';
    return geometry;
  }

  createFittedArmorPart(kind, material, dimensions = {}) {
    const source = createHeroArmorGeometry(kind, dimensions);
    const regions = source.groups.map(group => ({ ...group }));
    const indices = source.index.array;
    const surface = (region) => {
      const geometry = source.clone();
      geometry.clearGroups();
      geometry.setIndex(Array.from(indices.slice(region.start, region.start + region.count)));
      return geometry;
    };
    const shell = new THREE.Mesh(surface(regions.find(region => region.materialIndex === 0)), material);
    this.heroEdgeMaterial ??= createHeroMaterial('edgeMetal', { color: 0xb2b5b3, roughness: 0.4 });
    this.heroLiningMaterial ??= createHeroMaterial('rubber');
    for (const region of regions.filter(entry => entry.materialIndex !== 0)) {
      const edge = region.materialIndex === 1;
      const part = this.tagPlayerMesh(new THREE.Mesh(surface(region), edge ? this.heroEdgeMaterial : this.heroLiningMaterial), edge ? 'hardware' : 'rubber', `equipment_${kind}_${edge ? 'machined_rim' : 'lining'}`);
      part.name = `detail:${kind}_${edge ? 'edge' : region.materialIndex === 3 ? 'outsole' : 'lining'}`;
      shell.add(part);
    }
    source.dispose();
    return shell;
  }

  mountWristbladeSocket(wrist, assembly, side) {
    const socket = new THREE.Group();
    socket.name = `socket:wristblade_${side < 0 ? 'l' : 'r'}`;
    // Preserve the weapon's local deployment axis while aligning its housing
    // with the forearm. A local +Z slide now follows the hanging arm's -Y.
    socket.rotation.x = Math.PI / 2;
    socket.position.set(side * 0.025, 0.13, 0.28);
    socket.add(assembly);
    wrist.add(socket);
    return socket;
  }

  addSculptedHeroEquipment(armorMaterial, skinMaterial, accentMaterial) {
    const addMerged = (parent, name, parts, material, channel, role) => {
      const mesh = this.tagPlayerMesh(new THREE.Mesh(mergeSculptParts(parts), material), channel, role);
      mesh.name = name;
      mesh.userData.mergedPartCount = parts.length;
      parts.forEach(({ geometry }) => geometry.dispose());
      parent.add(mesh);
      return mesh;
    };
    const boneMaterial = createHeroMaterial('bone', { color: 0xb9a484 });
    const leatherMaterial = createHeroMaterial('leather', { color: 0x534534 });
    for (const [side, arm] of [[-1, this.leftArmRig], [1, this.rightArmRig]]) {
      const suffix = side < 0 ? 'l' : 'r';
      const hand = createHandSculpt(side);
      const palm = this.tagPlayerMesh(new THREE.Mesh(hand.skin, skinMaterial), 'skin', 'anatomy_sculpted_hand');
      palm.name = `anatomy:five_digit_hand_${suffix}`;
      palm.userData.digitCount = 5;
      palm.position.set(0, -0.09, 0.04);
      palm.scale.setScalar(HERO_PROPORTIONS.handScale);
      arm.wrist.add(palm);
      const claws = this.tagPlayerMesh(new THREE.Mesh(hand.claws, boneMaterial), 'bone', 'anatomy_curved_finger_claws');
      claws.name = `anatomy:hand_claws_${suffix}`;
      claws.position.copy(palm.position);
      claws.scale.copy(palm.scale);
      arm.wrist.add(claws);

      const gauntletVents = [];
      for (let vent = 0; vent < 6; vent++) {
        gauntletVents.push({
          geometry: this.createArmorPlateGeometry(0.31, 0.035, 0.035, 0.008),
          position: [side * 0.37, -0.3 + vent * 0.115, 0.28],
          rotation: [0, side * 0.8, 0],
        });
      }
      addMerged(arm.gauntlet, `detail:gauntlet_vent_bank_${suffix}`, gauntletVents, leatherMaterial, 'leather', 'equipment_gauntlet_recessed_vents');
    }
    const backPlates = [];
    for (let plate = 0; plate < 5; plate++) {
      backPlates.push({
        geometry: createHeroArmorGeometry('abdominal', { width: 1.04 - plate * 0.1, height: 0.26, depth: 0.09 }),
        position: [0, 1.29 - plate * 0.27, -0.52],
        rotation: [0.08, Math.PI, 0],
      });
    }
    addMerged(this.torsoRig, 'equipment:dorsal_segmented_harness', backPlates, armorMaterial, 'armor', 'equipment_dorsal_articulated_armor');
    const harness = [];
    for (const side of [-1, 1]) {
      harness.push({ geometry: taperedCurve([[side * 0.66, 1.76, -0.3], [side * 0.79, 1.0, -0.56], [side * 0.61, -0.18, -0.43]], 0.045, { segments: 30, sides: 8, taper: 0.1 }) });
      harness.push({ geometry: taperedCurve([[side * 0.84, 0.92, -0.2], [side * 0.96, 0.32, 0], [side * 0.68, -0.6, 0.38]], 0.04, { segments: 30, sides: 8, taper: 0.1 }) });
      const strap = new THREE.Shape();
      strap.moveTo(-0.055, -0.012); strap.lineTo(0.055, -0.012);
      strap.lineTo(0.055, 0.012); strap.lineTo(-0.055, 0.012); strap.closePath();
      harness.push({ geometry: new THREE.ExtrudeGeometry(strap, {
        steps: 28, bevelEnabled: false,
        extrudePath: new THREE.CatmullRomCurve3([
          new THREE.Vector3(side * 0.71, 1.76, 0.32),
          new THREE.Vector3(side * 0.55, 1.28, 0.59),
          new THREE.Vector3(side * 0.37, 0.74, 0.58),
        ]),
      }) });
    }
    addMerged(this.torsoRig, 'equipment:leather_hunt_harness', harness, leatherMaterial, 'leather', 'equipment_load_bearing_harness');
    const fasteners = [];
    for (const side of [-1, 1]) for (let plate = 0; plate < 4; plate++) {
      fasteners.push({ geometry: new THREE.CylinderGeometry(0.035, 0.04, 0.045, 10), position: [side * (0.39 - plate * 0.04), 1.27 - plate * 0.27, -0.59], rotation: [Math.PI / 2, 0, 0] });
    }
    addMerged(this.torsoRig, 'detail:dorsal_harness_fasteners', fasteners, accentMaterial, 'accent', 'equipment_dorsal_fasteners');
  }

  tagPlayerMesh(mesh, channel, detailRole) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.appearanceChannel = channel;
    mesh.userData.detailRole = detailRole;
    return mesh;
  }

  createArmRig(side, skinMaterial, armorMaterial, accentMaterial) {
    const suffix = side < 0 ? 'l' : 'r';
    const shoulder = new THREE.Group();
    shoulder.name = `joint:shoulder_${suffix}`;
    shoulder.position.set(side * HERO_PROPORTIONS.shoulderX, HERO_PROPORTIONS.shoulderY, 0);

    const upperArm = this.tagPlayerMesh(
      new THREE.Mesh(createLimbSculpt('upperArm'), skinMaterial),
      'skin',
      'anatomy_upper_arm',
    );
    upperArm.name = `anatomy:upper_arm_${suffix}`;
    upperArm.position.y = -0.73;
    upperArm.scale.set(0.76, 1.1, 0.76);
    shoulder.add(upperArm);

    const deltoid = this.tagPlayerMesh(
      new THREE.Mesh(createLimbSculpt('deltoid'), skinMaterial),
      'skin',
      'anatomy_deltoid',
    );
    deltoid.name = `anatomy:deltoid_${suffix}`;
    deltoid.position.set(0, -0.08, 0);
    deltoid.scale.set(0.76, 0.8, 0.76);
    shoulder.add(deltoid);

    const pauldron = this.tagPlayerMesh(
      this.createFittedArmorPart('pauldron', armorMaterial, { side }),
      'armor',
      'equipment_articulated_pauldron',
    );
    pauldron.name = `equipment:pauldron_${suffix}`;
    pauldron.position.set(side * 0.015, 0.10, -0.02);
    pauldron.rotation.set(0, side * -0.08, side * -0.08);
    shoulder.add(pauldron);

    const ridgeGeometry = new THREE.TorusGeometry(0.5, 0.035, 8, 24, Math.PI);
    const ridgeSet = this.tagPlayerMesh(
      new THREE.InstancedMesh(ridgeGeometry, accentMaterial, 3),
      'accent',
      'equipment_pauldron_ridge',
    );
    ridgeSet.name = `detail:pauldron_ridge_set_${suffix}`;
    ridgeSet.userData.instanceDetailCount = 3;
    ridgeSet.scale.set(0.68, 0.68, 0.68);
    const ridgeTransform = new THREE.Object3D();
    for (let ridge = 0; ridge < 3; ridge += 1) {
      const ridgeScale = (0.48 + ridge * 0.035) / 0.5;
      ridgeTransform.position.set(0, 0.1 - ridge * 0.13, 0.15);
      ridgeTransform.rotation.set(Math.PI / 2, 0, Math.PI);
      ridgeTransform.scale.set(ridgeScale, ridgeScale, ridgeScale);
      ridgeTransform.updateMatrix();
      ridgeSet.setMatrixAt(ridge, ridgeTransform.matrix);
    }
    ridgeSet.instanceMatrix.needsUpdate = true;
    shoulder.add(ridgeSet);

    const elbow = new THREE.Group();
    elbow.name = `joint:elbow_${suffix}`;
    elbow.position.y = HERO_PROPORTIONS.elbowY;
    shoulder.add(elbow);

    const forearm = this.tagPlayerMesh(
      new THREE.Mesh(createLimbSculpt('forearm'), skinMaterial),
      'skin',
      'anatomy_forearm',
    );
    forearm.name = `anatomy:forearm_${suffix}`;
    forearm.position.y = -0.58;
    forearm.scale.set(0.77, 0.87, 0.77);
    elbow.add(forearm);

    const gauntlet = new THREE.Group();
    gauntlet.name = `equipment:gauntlet_${suffix}`;
    gauntlet.userData.equipmentRole = side < 0 ? 'computer_gauntlet' : 'weapon_gauntlet';
    gauntlet.position.set(0, -0.54, 0.02);
    elbow.add(gauntlet);
    const cuff = this.tagPlayerMesh(
      this.createFittedArmorPart('gauntlet', armorMaterial, { side }),
      'armor',
      'equipment_gauntlet_shell',
    );
    cuff.name = `equipment:gauntlet_shell_${suffix}`;
    gauntlet.add(cuff);
    const dorsalPanel = this.tagPlayerMesh(
      new THREE.Mesh(this.createArmorPlateGeometry(0.58, 0.78, 0.14, 0.11), armorMaterial),
      'armor',
      'equipment_gauntlet_dorsal_panel',
    );
    dorsalPanel.name = `equipment:gauntlet_panel_${suffix}`;
    dorsalPanel.position.set(0, 0.03, 0.3);
    dorsalPanel.scale.set(0.72, 0.8, 0.7);
    gauntlet.add(dorsalPanel);
    for (let control = 0; control < 3; control += 1) {
      const button = this.tagPlayerMesh(
        new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.055, 0.035, 12),
          new THREE.MeshStandardMaterial({
            color: control === 1 ? 0x56f4df : 0xf15a34,
            emissive: control === 1 ? 0x0d665c : 0x721406,
            emissiveIntensity: 0.9,
            metalness: 0.42,
            roughness: 0.24,
          }),
        ),
        'techLight',
        'equipment_gauntlet_control',
      );
      button.name = `detail:gauntlet_control_${suffix}_${control}`;
      button.rotation.x = Math.PI / 2;
      button.position.set((control - 1) * 0.13, 0.02, 0.38);
      gauntlet.add(button);
    }
    for (const y of [-0.35, 0.35]) {
      const cuffRing = this.tagPlayerMesh(
        new THREE.Mesh(new THREE.TorusGeometry(0.405, 0.045, 8, 24), accentMaterial),
        'accent',
        'equipment_gauntlet_lock_ring',
      );
      cuffRing.rotation.x = Math.PI / 2;
      cuffRing.position.y = y;
      cuffRing.scale.set(0.76, 0.76, 0.76);
      gauntlet.add(cuffRing);
    }

    const wrist = new THREE.Group();
    wrist.name = `joint:wrist_${suffix}`;
    wrist.position.y = HERO_PROPORTIONS.wristY;
    elbow.add(wrist);

    return { shoulder, elbow, wrist, gauntlet, upperArm, forearm };
  }

  createLegRig(side, skinMaterial, armorMaterial, accentMaterial) {
    const suffix = side < 0 ? 'l' : 'r';
    const hip = new THREE.Group();
    hip.name = `joint:hip_${suffix}`;
    hip.position.set(side * HERO_PROPORTIONS.hipX, 0, 0);

    const thigh = this.tagPlayerMesh(
      new THREE.Mesh(createLimbSculpt('thigh'), skinMaterial),
      'skin',
      'anatomy_thigh',
    );
    thigh.name = `anatomy:thigh_${suffix}`;
    thigh.position.y = -0.88;
    thigh.scale.set(0.77, 1.12, 0.77);
    hip.add(thigh);

    const thighPlate = this.tagPlayerMesh(
      this.createFittedArmorPart('pectoral', armorMaterial, { width: 0.42, height: 0.76, depth: 0.14, side }),
      'armor',
      'equipment_thigh_plate',
    );
    thighPlate.name = `equipment:thigh_plate_${suffix}`;
    thighPlate.position.set(side * 0.18, -0.65, 0.29);
    thighPlate.rotation.y = side * 0.45;
    thighPlate.rotation.z = side * -0.05;
    hip.add(thighPlate);

    const knee = new THREE.Group();
    knee.name = `joint:knee_${suffix}`;
    knee.position.y = HERO_PROPORTIONS.kneeY;
    hip.add(knee);
    const kneeGuard = this.tagPlayerMesh(
      this.createFittedArmorPart('knee', armorMaterial, { side }),
      'armor',
      'equipment_knee_guard',
    );
    kneeGuard.name = `equipment:knee_guard_${suffix}`;
    kneeGuard.position.z = 0.28;
    knee.add(kneeGuard);

    const shin = this.tagPlayerMesh(
      new THREE.Mesh(createLimbSculpt('shin'), skinMaterial),
      'skin',
      'anatomy_shin',
    );
    shin.name = `anatomy:shin_${suffix}`;
    shin.position.y = -0.79;
    shin.scale.set(0.74, 1.08, 0.74);
    knee.add(shin);
    const greave = this.tagPlayerMesh(
      this.createFittedArmorPart('greave', armorMaterial, { side }),
      'armor',
      'equipment_segmented_greave',
    );
    greave.name = `equipment:greave_${suffix}`;
    greave.position.set(0, -0.76, 0.26);
    knee.add(greave);
    for (const y of [-0.34, 0, 0.34]) {
      const segment = this.tagPlayerMesh(
        new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.065, 0.09, 3, 1, 1), accentMaterial),
        'accent',
        'equipment_greave_segment',
      );
      segment.position.set(0, -0.76 + y, 0.34);
      segment.scale.set(0.68, 0.65, 0.65);
      knee.add(segment);
    }

    const ankle = new THREE.Group();
    ankle.name = `joint:ankle_${suffix}`;
    ankle.position.y = HERO_PROPORTIONS.ankleY;
    knee.add(ankle);
    const foot = this.tagPlayerMesh(
      this.createFittedArmorPart('boot', armorMaterial, { width: 0.52, height: 0.6, depth: 1, side }),
      'armor',
      'equipment_articulated_boot',
    );
    foot.name = `equipment:boot_${suffix}`;
    foot.position.set(0, 0, 0.2);
    ankle.add(foot);
    for (const toeX of [-0.2, 0, 0.2]) {
      const claw = this.tagPlayerMesh(
        new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.18, 10), this.heroClawMaterial ??= createHeroMaterial('bone')),
        'bone',
        'equipment_boot_claw',
      );
      claw.rotation.x = Math.PI / 2;
      claw.position.set(toeX * 0.75, -0.13, 0.7);
      ankle.add(claw);
    }
    return { hip, knee, ankle, thigh, shin };
  }

  createWristbladeAssembly(side, armorMaterial, accentMaterial, bladeMaterial) {
    const suffix = side < 0 ? 'l' : 'r';
    const assembly = new THREE.Group();
    assembly.name = `equipment:wristblades_${suffix}`;
    assembly.userData.equipmentRole = 'wristblades';
    assembly.userData.availableBladeCount = 3;
    assembly.userData.defaultBladeCount = 2;
    assembly.userData.visibleBladeCount = 2;
    assembly.userData.provenance = 'original_fan_made_procedural';

    const sheath = this.tagPlayerMesh(
      new THREE.Mesh(this.createArmorPlateGeometry(0.78, 1.28, 0.22, 0.12), armorMaterial),
      'armor',
      'equipment_wristblade_sheath',
    );
    sheath.name = `equipment:wristblade_sheath_${suffix}`;
    sheath.rotation.x = Math.PI / 2;
    sheath.position.set(0, 0, -0.42);
    assembly.add(sheath);

    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(-0.085, 0);
    bladeShape.lineTo(0.085, 0);
    bladeShape.lineTo(0.13, 1.72);
    bladeShape.lineTo(0.045, 2.5);
    bladeShape.lineTo(0, 2.84);
    bladeShape.lineTo(-0.07, 2.56);
    bladeShape.lineTo(-0.13, 1.45);
    bladeShape.closePath();
    const bladeGeometry = new THREE.ExtrudeGeometry(bladeShape, {
      depth: 0.075,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.025,
      bevelThickness: 0.025,
      curveSegments: 8,
    });
    bladeGeometry.rotateX(Math.PI / 2);
    bladeGeometry.scale(1, 1, 0.58);
    bladeGeometry.translate(0, 0.04, 0);
    bladeGeometry.computeVertexNormals();

    assembly.userData.bladeMeshes = [];
    [-0.24, 0, 0.24].forEach((x, index) => {
      const rail = this.tagPlayerMesh(
        new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 1.18, 6, 12), accentMaterial),
        'accent',
        'equipment_wristblade_guide_rail',
      );
      rail.name = `detail:wristblade_rail_${suffix}_${index}`;
      rail.rotation.x = Math.PI / 2;
      rail.position.set(x, 0, 0.12);
      assembly.add(rail);

      const blade = this.tagPlayerMesh(
        new THREE.Mesh(bladeGeometry, bladeMaterial),
        'blade',
        'equipment_wristblade_tapered_blade',
      );
      blade.name = `weapon:wristblade_${suffix}_${index}`;
      blade.position.set(x, 0, 0.42 + Math.abs(index - 1) * 0.08);
      blade.rotation.z = (index - 1) * -0.025;
      blade.userData.bladeIndex = index;
      blade.userData.isTaperedBlade = true;
      blade.userData.isPlaceholder = false;
      blade.visible = index !== 1;
      assembly.userData.bladeMeshes.push(blade);
      assembly.add(blade);

      const piston = this.tagPlayerMesh(
        new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.52, 14), accentMaterial),
        'accent',
        'equipment_wristblade_actuator',
      );
      piston.name = `detail:wristblade_actuator_${suffix}_${index}`;
      piston.rotation.x = Math.PI / 2;
      piston.position.set(x, 0, -0.62);
      assembly.add(piston);
    });

    for (const z of [-0.82, -0.46]) {
      const lock = this.tagPlayerMesh(
        new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.045, 8, 24, Math.PI), accentMaterial),
        'accent',
        'equipment_wristblade_lock',
      );
      lock.name = `detail:wristblade_lock_${suffix}`;
      lock.rotation.set(Math.PI / 2, 0, Math.PI / 2);
      lock.position.z = z;
      assembly.add(lock);
    }
    return assembly;
  }

  createPlasmaCasterAssembly(armorMaterial, accentMaterial) {
    const group = new THREE.Group();
    group.name = 'equipment:plasmacaster';
    group.userData.equipmentRole = 'plasmacaster';
    group.userData.provenance = 'original_fan_made_procedural';

    const mount = this.tagPlayerMesh(
      new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.56, 18), accentMaterial),
      'accent',
      'equipment_caster_servo_mount',
    );
    mount.name = 'equipment:caster_servo_mount';
    mount.rotation.z = Math.PI / 2;
    group.add(mount);
    for (const side of [-1, 1]) {
      const servo = this.tagPlayerMesh(
        new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.52, 6, 12), accentMaterial),
        'accent',
        'equipment_caster_servo_arm',
      );
      servo.name = `detail:caster_servo_${side < 0 ? 'l' : 'r'}`;
      servo.rotation.z = side * 0.38;
      servo.position.set(side * 0.24, 0.34, 0.05);
      group.add(servo);
    }

    const housing = this.tagPlayerMesh(
      new THREE.Mesh(this.createArmorPlateGeometry(0.64, 1.25, 0.52, 0.2), armorMaterial),
      'armor',
      'equipment_caster_housing',
    );
    housing.name = 'equipment:caster_housing';
    housing.rotation.x = Math.PI / 2;
    housing.position.set(0, 0.52, 0.44);
    housing.scale.set(1.15, 1, 0.82);
    group.add(housing);
    for (let ringIndex = 0; ringIndex < 3; ringIndex += 1) {
      const ring = this.tagPlayerMesh(
        new THREE.Mesh(new THREE.TorusGeometry(0.29 - ringIndex * 0.025, 0.035, 8, 24), accentMaterial),
        'accent',
        'equipment_caster_focusing_ring',
      );
      ring.name = `detail:caster_focus_ring_${ringIndex}`;
      ring.position.set(0, 0.52, 0.2 + ringIndex * 0.35);
      group.add(ring);
    }
    const muzzle = this.tagPlayerMesh(
      new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.28, 0.42, 20, 2), armorMaterial),
      'armor',
      'equipment_caster_muzzle',
    );
    muzzle.name = 'equipment:caster_muzzle';
    muzzle.rotation.x = Math.PI / 2;
    muzzle.position.set(0, 0.52, 1.17);
    group.add(muzzle);
    const emitter = this.tagPlayerMesh(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.145, 20, 14),
        new THREE.MeshStandardMaterial({
          color: 0xa7fff3,
          emissive: 0x1ccab7,
          emissiveIntensity: 1.7,
          metalness: 0.35,
          roughness: 0.16,
        }),
      ),
      'techLight',
      'equipment_caster_emitter',
    );
    emitter.name = 'equipment:caster_emitter';
    emitter.position.set(0, 0.52, 1.39);
    group.add(emitter);
    this.plasmacasterEmitter = emitter;
    return group;
  }

  createAppearanceJointMount(parent, joint, name, equipmentId = null) {
    // Retain the appearance/loadout hierarchy while following an animated joint.
    // Reparenting the props directly would bypass their preset's visibility.
    const mount = new THREE.Group();
    mount.name = name;
    mount.userData.boundJointName = joint.name;
    if (equipmentId) mount.userData.stowedEquipmentId = equipmentId;
    mount.matrixAutoUpdate = false;
    parent.add(mount);
    this.appearanceJointMounts ??= [];
    this.appearanceJointMounts.push({ mount, joint, inverse: new THREE.Matrix4() });
    return mount;
  }

  syncAppearanceJointMounts(root = this.mesh) {
    if (!root || !this.appearanceJointMounts?.length) return;
    root.updateWorldMatrix(true, false);
    for (const { mount, joint, inverse } of this.appearanceJointMounts) {
      joint.updateWorldMatrix(true, false);
      mount.parent.updateWorldMatrix(true, false);
      inverse.copy(mount.parent.matrixWorld).invert();
      mount.matrix.multiplyMatrices(inverse, joint.matrixWorld);
      mount.matrixWorldNeedsUpdate = true;
      mount.updateWorldMatrix(false, true);
    }
  }

  createWolfCleanerKit(armorMaterial, accentMaterial, bladeMaterial) {
    const group = new THREE.Group();
    group.name = 'equipment:wolf_cleaner_kit';
    group.userData.equipmentRole = 'wolf_cleaner_kit';
    group.userData.armorPresetId = 'wolf_avpr';
    group.userData.provenance = 'AVPR_SCREEN_ADAPTATION';
    const chestMount = this.createAppearanceJointMount(group, this.torsoRig, 'mount:wolf_chest');
    const medicalMount = this.createAppearanceJointMount(group, this.pelvisRig, 'mount:wolf_medical', 'medicomp');
    const mineMount = this.createAppearanceJointMount(group, this.pelvisRig, 'mount:wolf_mines', 'plasma_mines');
    const gloveMount = this.createAppearanceJointMount(group, this.rightArmRig.wrist, 'mount:wolf_power_glove');
    const addPart = (name, geometry, material, position, rotation, role, channel = 'armor', parent = chestMount) => {
      const mesh = this.tagPlayerMesh(new THREE.Mesh(geometry, material), channel, role);
      mesh.name = name;
      mesh.position.set(...position);
      if (rotation) mesh.rotation.set(...rotation);
      parent.add(mesh);
      return mesh;
    };

    const antiAcidPlate = addPart(
      'equipment:wolf_anti_acid_chest_plate',
      this.createArmorPlateGeometry(1.3, 0.83, 0.14, 0.16),
      armorMaterial,
      [0, 1.12, 0.65],
      [-0.08, 0, 0],
      'equipment_wolf_anti_acid_armor',
    );
    antiAcidPlate.userData.acidResistant = true;
    for (const side of [-1, 1]) {
      const seal = addPart(
        `detail:wolf_anti_acid_seal_${side < 0 ? 'l' : 'r'}`,
        new THREE.TorusGeometry(0.38, 0.035, 10, 28, Math.PI),
        accentMaterial,
        [side * 0.38, 1.16, 0.70],
        [Math.PI / 2, 0, side < 0 ? 0.32 : -0.32],
        'equipment_wolf_anti_acid_seal',
        'accent',
      );
      seal.userData.acidResistant = true;
    }

    const caseBody = addPart(
      'equipment:wolf_cleaner_case',
      new THREE.CapsuleGeometry(0.25, 0.58, 8, 18),
      armorMaterial,
      [-0.80, -0.38, -0.36],
      [0, 0, -0.12],
      'equipment_wolf_cleaner_case',
      'armor',
      medicalMount,
    );
    caseBody.scale.set(1.15, 1, 0.58);
    for (const y of [-0.23, 0.23]) {
      addPart(
        `detail:wolf_case_lock_${y < 0 ? 'lower' : 'upper'}`,
        new THREE.TorusGeometry(0.23, 0.025, 8, 20),
        accentMaterial,
        [-0.80, -0.38 + y, -0.18],
        [Math.PI / 2, 0, 0],
        'equipment_wolf_cleaner_case_lock',
        'accent',
        medicalMount,
      );
    }
    addPart(
      'detail:wolf_case_handle',
      new THREE.TorusGeometry(0.22, 0.04, 10, 24, Math.PI),
      accentMaterial,
      [-0.80, 0.05, -0.36],
      [0, 0, 0],
      'equipment_wolf_cleaner_case_handle',
      'accent',
      medicalMount,
    );

    const syringe = new THREE.Group();
    syringe.name = 'equipment:wolf_sampling_syringe';
    syringe.userData.equipmentRole = 'sampling_syringe';
    syringe.position.set(0.80, -0.32, 0.32);
    syringe.scale.setScalar(0.72);
    syringe.rotation.z = -0.2;
    const reservoir = this.tagPlayerMesh(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.68, 18, 2),
        new THREE.MeshStandardMaterial({
          color: 0xc5fff1,
          emissive: 0x2ba987,
          emissiveIntensity: 0.72,
          transparent: true,
          opacity: 0.82,
          metalness: 0.2,
          roughness: 0.2,
        }),
      ),
      'techLight',
      'equipment_wolf_sampling_reservoir',
    );
    reservoir.name = 'detail:wolf_sampling_reservoir';
    syringe.add(reservoir);
    const syringeNeedle = this.tagPlayerMesh(
      new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.78, 14), bladeMaterial),
      'blade',
      'equipment_wolf_sampling_needle',
    );
    syringeNeedle.name = 'detail:wolf_sampling_needle';
    syringeNeedle.position.y = -0.7;
    syringeNeedle.rotation.z = Math.PI;
    syringe.add(syringeNeedle);
    const syringeGrip = this.tagPlayerMesh(
      new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.045, 8, 20), accentMaterial),
      'accent',
      'equipment_wolf_sampling_grip',
    );
    syringeGrip.name = 'detail:wolf_sampling_grip';
    syringeGrip.rotation.x = Math.PI / 2;
    syringeGrip.position.y = 0.43;
    syringe.add(syringeGrip);
    medicalMount.add(syringe);

    const mineRack = new THREE.Group();
    mineRack.name = 'equipment:wolf_laser_mine_rack';
    mineRack.userData.equipmentRole = 'laser_mines';
    mineRack.position.set(-0.67, -0.35, 0.45);
    mineRack.scale.setScalar(0.72);
    for (let mineIndex = 0; mineIndex < 4; mineIndex += 1) {
      const mine = this.tagPlayerMesh(
        new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.12, 18, 2), armorMaterial),
        'armor',
        'equipment_wolf_laser_mine',
      );
      mine.name = `equipment:wolf_laser_mine_${mineIndex}`;
      mine.rotation.x = Math.PI / 2;
      mine.position.set((mineIndex % 2) * 0.42, Math.floor(mineIndex / 2) * -0.4, 0);
      mine.userData.deployable = true;
      mineRack.add(mine);
      const mineLens = this.tagPlayerMesh(
        new THREE.Mesh(
          new THREE.SphereGeometry(0.065, 12, 10),
          new THREE.MeshBasicMaterial({ color: 0xff3d22 }),
        ),
        'techLight',
        'equipment_wolf_laser_mine_lens',
      );
      mineLens.name = `detail:wolf_laser_mine_lens_${mineIndex}`;
      mineLens.position.copy(mine.position);
      mineLens.position.z = 0.11;
      mineRack.add(mineLens);
    }
    mineMount.add(mineRack);

    const powerGlove = new THREE.Group();
    powerGlove.name = 'equipment:wolf_power_glove';
    powerGlove.userData.equipmentRole = 'power_glove';
    powerGlove.position.set(0, -0.12, 0.04);
    powerGlove.scale.setScalar(HERO_PROPORTIONS.handScale);
    for (let fingerIndex = 0; fingerIndex < 4; fingerIndex += 1) {
      const finger = this.tagPlayerMesh(
        new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.38, 6, 12), armorMaterial),
        'armor',
        'equipment_wolf_power_glove_finger',
      );
      finger.name = `equipment:wolf_power_glove_finger_${fingerIndex}`;
      finger.position.set((fingerIndex - 1.5) * 0.13, -0.28, 0.18);
      finger.rotation.x = -0.32;
      powerGlove.add(finger);
    }
    const gloveCore = this.tagPlayerMesh(
      new THREE.Mesh(new THREE.DodecahedronGeometry(0.24, 1), accentMaterial),
      'accent',
      'equipment_wolf_power_glove_core',
    );
    gloveCore.name = 'detail:wolf_power_glove_core';
    gloveCore.position.z = 0.22;
    gloveCore.scale.set(1.15, 0.82, 0.46);
    powerGlove.add(gloveCore);
    gloveMount.add(powerGlove);

    // Les accessoires du Cleaner partagent un groupe d'apparence, mais leur
    // visibilité doit suivre individuellement le paquetage de la chasse.
    group.traverse((child) => {
      if (child.name.includes('wolf_cleaner_case')
        || child.name.includes('wolf_case_')
        || child.name.includes('wolf_sampling_')) {
        child.userData.stowedEquipmentId = 'medicomp';
      } else if (child.name.includes('wolf_laser_mine')) {
        child.userData.stowedEquipmentId = 'plasma_mines';
      }
    });

    return group;
  }

  applyWolfCleanerEquipment(armorPresetId) {
    const active = armorPresetId === 'wolf_avpr';
    if (this.wolfCleanerKitGroup) {
      this.wolfCleanerKitGroup.visible = active;
      this.wolfCleanerKitGroup.userData.active = active;
      this.wolfCleanerKitGroup.userData.appearanceActive = active;
    }
    return active;
  }

  applyHuntLoadout(loadoutOrIds = []) {
    const activeIds = collectHuntLoadoutIds(loadoutOrIds);
    const equipped = new Set(activeIds);
    const boundVisuals = new Map();
    const bindVisual = (equipmentId, object) => {
      if (!object?.isObject3D) return;
      if (!boundVisuals.has(equipmentId)) boundVisuals.set(equipmentId, new Set());
      boundVisuals.get(equipmentId).add(object);
    };

    Object.entries(STOWED_LOADOUT_VISUAL_BINDINGS).forEach(([equipmentId, binding]) => {
      binding.properties.forEach((property) => bindVisual(equipmentId, this[property]));
      binding.names.forEach((name) => bindVisual(equipmentId, this.mesh?.getObjectByName(name)));
    });
    this.mesh?.traverse((child) => {
      const equipmentId = child.userData?.stowedEquipmentId ?? child.userData?.loadoutEquipmentId;
      if (equipmentId) bindVisual(equipmentId, child);
    });

    boundVisuals.forEach((objects, equipmentId) => {
      const isEquipped = equipped.has(equipmentId);
      objects.forEach((object) => {
        object.visible = isEquipped;
        object.userData.loadoutEquipped = isEquipped;
      });
    });

    // Les wristblades font partie du noyau obligatoire et restent physiquement
    // montées, quelle que soit l'arme lourde choisie pour la chasse.
    [this.wristbladeLeft, this.wristbladeRight].forEach((assembly) => {
      if (!assembly) return;
      assembly.visible = true;
      assembly.userData.loadoutEquipped = true;
    });

    const activePlasmaIds = PLASMACASTER_LOADOUT_IDS.filter((id) => equipped.has(id));
    if (this.plasmacasterMesh) {
      this.plasmacasterMesh.visible = activePlasmaIds.length > 0;
      this.plasmacasterMesh.userData.loadoutEquipped = activePlasmaIds.length > 0;
      this.plasmacasterMesh.userData.activeLoadoutVariantIds = [...activePlasmaIds];
    }
    if (this.maskMesh) this.maskMesh.userData.loadoutEquipped = equipped.has('biomask_vision');
    if (this.mesh) this.mesh.userData.cloakEmitterEquipped = equipped.has('optical_cloak');

    // L'épée et le bouclier utilisent leur assemblage déployé pendant l'action :
    // on les marque comme embarqués sans les forcer en main au repos.
    if (this.fatherSwordMesh) {
      const isEquipped = equipped.has('father_sword');
      this.fatherSwordMesh.userData.loadoutEquipped = isEquipped;
      if (!isEquipped) this.fatherSwordMesh.visible = false;
    }
    if (this.wristShieldMesh) {
      const isEquipped = equipped.has('wrist_shield');
      this.wristShieldMesh.userData.loadoutEquipped = isEquipped;
      if (!isEquipped) this.wristShieldMesh.visible = false;
    }

    // Le kit Wolf contient à la fois des pièces d'armure liées au preset et des
    // consommables : l'armure suit l'apparence, les props suivent le loadout.
    if (this.wolfCleanerKitGroup) {
      const appearanceActive = this.customization?.armorPresetId === 'wolf_avpr';
      let hasActiveCarriedPart = false;
      this.wolfCleanerKitGroup.traverse((child) => {
        if (child === this.wolfCleanerKitGroup) return;
        const equipmentId = child.userData?.stowedEquipmentId;
        if (equipmentId) {
          const isEquipped = equipped.has(equipmentId);
          child.visible = isEquipped;
          child.userData.loadoutEquipped = isEquipped;
          hasActiveCarriedPart ||= isEquipped;
        } else {
          child.visible = appearanceActive;
        }
      });
      this.wolfCleanerKitGroup.visible = appearanceActive || hasActiveCarriedPart;
      this.wolfCleanerKitGroup.userData.active = this.wolfCleanerKitGroup.visible;
      this.wolfCleanerKitGroup.userData.appearanceActive = appearanceActive;
      this.wolfCleanerKitGroup.userData.loadoutCarriedPartActive = hasActiveCarriedPart;
    }

    const linkedStowedVisualIds = Object.entries(STOWED_LOADOUT_VISUAL_BINDINGS)
      .filter(([equipmentId]) => (boundVisuals.get(equipmentId)?.size ?? 0) > 0)
      .map(([equipmentId]) => equipmentId);
    const visibleStowedVisualIds = linkedStowedVisualIds.filter((id) => equipped.has(id));
    const missingStowedVisualIds = activeIds.filter((id) => (
      STOWED_LOADOUT_VISUAL_BINDINGS[id]
      && !linkedStowedVisualIds.includes(id)
    ));
    const deploymentOnlyIds = [
      this.fatherSwordMesh && equipped.has('father_sword') ? 'father_sword' : null,
      this.wristShieldMesh && equipped.has('wrist_shield') ? 'wrist_shield' : null,
    ].filter(Boolean);

    this.activeHuntLoadoutIds = [...activeIds];
    this.huntLoadoutVisualApplied = true;
    const contract = {
      schemaVersion: 1,
      activeIds: [...activeIds],
      mandatoryIds: [...MANDATORY_HUNT_VISUAL_IDS],
      plasmaCasterVariantIds: [...activePlasmaIds],
      linkedStowedVisualIds,
      visibleStowedVisualIds,
      missingStowedVisualIds,
      deploymentOnlyIds,
    };
    if (this.mesh) {
      this.mesh.userData.activeHuntLoadoutIds = [...activeIds];
      this.mesh.userData.huntLoadoutVisualApplied = true;
      this.mesh.userData.huntLoadoutVisualContract = contract;
    }
    this.refreshVisualFidelityMetrics(this.mesh);
    return contract;
  }

  refreshVisualFidelityMetrics(root = this.mesh) {
    let meshCount = 0;
    let triangleCount = 0;
    let equipmentMeshCount = 0;
    let activeMeshCount = 0;
    let activeTriangleCount = 0;
    const namedParts = [];
    root?.traverse((child) => {
      if (child.name) namedParts.push(child.name);
      if (!child.isMesh) return;
      meshCount += 1;
      const geometryTriangles = countGeometryTriangles(child.geometry) * (child.isInstancedMesh ? child.count : 1);
      triangleCount += geometryTriangles;
      if (child.userData.detailRole?.startsWith('equipment_')) equipmentMeshCount += 1;
      let effectivelyVisible = child.visible;
      let ancestor = child.parent;
      while (effectivelyVisible && ancestor && ancestor !== root.parent) {
        effectivelyVisible = ancestor.visible;
        ancestor = ancestor.parent;
      }
      if (effectivelyVisible) {
        activeMeshCount += 1;
        activeTriangleCount += geometryTriangles;
      }
    });
    const metrics = {
      visualTier: 'hero_procedural',
      provenance: 'original_fan_made_procedural',
      organicBodyLoaded: root?.userData.organicBodyLoaded === true,
      surfacePipeline: root?.userData.organicBodyLoaded === true
        ? 'baked_skinned_body_and_sculpted_equipment'
        : 'procedural_fallback',
      meshCount,
      triangleCount: Math.round(triangleCount),
      activeMeshCount,
      activeTriangleCount: Math.round(activeTriangleCount),
      equipmentMeshCount,
      rigJointCount: PLAYER_RIG_JOINTS.length,
      rigJointNames: [...PLAYER_RIG_JOINTS],
      animationStates: [...PLAYER_ANIMATION_STATES],
      wristbladeAssemblies: 2,
      standardVisibleBladesPerWrist: 2,
      maximumBladesPerWrist: 3,
      polygonBudget: 360000,
      activePolygonBudget: 300000,
      activeDrawCallBudget: 210,
      namedPartCount: namedParts.length,
    };
    this.visualFidelityMetrics = metrics;
    if (root) {
      root.userData.visualFidelity = metrics;
      root.userData.animationState = this.currentAnimationState;
      root.userData.rigContract = {
        hierarchy: 'root>pelvis>(torso>shoulders/head,hips>knees>ankles)',
        jointNames: [...PLAYER_RIG_JOINTS],
      };
    }
    return metrics;
  }

  getVisualFidelityMetrics() {
    const metrics = this.visualFidelityMetrics ?? this.refreshVisualFidelityMetrics();
    return {
      ...metrics,
      rigJointNames: [...metrics.rigJointNames],
      animationStates: [...metrics.animationStates],
    };
  }

  createAvpRitualArmor(armorMaterial, accentMaterial) {
    const group = new THREE.Group();
    group.name = 'playerAvpRitualArmor';
    group.userData.ritualPresetIds = [...AVP_RITUAL_PRESET_IDS];
    const torsoMount = this.createAppearanceJointMount(group, this.torsoRig, 'mount:avp_torso');
    const pelvisMount = this.createAppearanceJointMount(group, this.pelvisRig, 'mount:avp_pelvis');
    const addArmorPart = (geometry, material, position, rotation = null, parent = group, channel = 'armor') => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      if (rotation) mesh.rotation.set(...rotation);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.appearanceChannel = channel;
      parent.add(mesh);
      return mesh;
    };

    const chest = addArmorPart(this.createArmorPlateGeometry(1.24, 0.78, 0.13, 0.16), armorMaterial, [0, 1.10, 0.64], [-0.08, 0, 0], torsoMount);
    chest.name = 'equipment:avp_ritual_chest';
    for (const side of [-1, 1]) {
      const upperChest = addArmorPart(this.createArmorPlateGeometry(0.54, 0.40, 0.12, 0.1), armorMaterial, [side * 0.40, 1.47, 0.53], [-0.1, side * -0.08, side * -0.10], torsoMount);
      upperChest.name = `equipment:avp_upper_chest_${side < 0 ? 'l' : 'r'}`;
    }
    const collar = addArmorPart(new THREE.TorusGeometry(0.40, 0.06, 10, 28, Math.PI), accentMaterial, [0, 2.10, 0.04], [0, 0, Math.PI], torsoMount, 'accent');
    collar.name = 'equipment:avp_ritual_collar';
    collar.rotation.x = Math.PI / 2;
    for (const x of [-0.43, 0, 0.43]) {
      const belt = addArmorPart(this.createArmorPlateGeometry(0.40, 0.43, 0.12, 0.08), armorMaterial, [x, -0.15, 0.62], [-0.12, 0, x * -0.08], pelvisMount);
      belt.name = `equipment:avp_ritual_belt_${x < 0 ? 'l' : x > 0 ? 'r' : 'center'}`;
    }

    for (const side of [-1, 1]) {
      const suffix = side < 0 ? 'l' : 'r';
      const arm = side < 0 ? this.leftArmRig : this.rightArmRig;
      const leg = side < 0 ? this.leftLegRig : this.rightLegRig;
      const shoulder = this.createAppearanceJointMount(group, arm.shoulder, `mount:avp_shoulder_${suffix}`);
      const elbow = this.createAppearanceJointMount(group, arm.elbow, `mount:avp_forearm_${suffix}`);
      const hip = this.createAppearanceJointMount(group, leg.hip, `mount:avp_thigh_${suffix}`);
      const knee = this.createAppearanceJointMount(group, leg.knee, `mount:avp_shin_${suffix}`);
      const pauldron = addArmorPart(new THREE.SphereGeometry(0.49, 14, 9, 0, Math.PI * 2, 0, Math.PI / 2), armorMaterial, [side * 0.05, -0.03, 0], [0, 0, side * -0.18], shoulder);
      pauldron.name = `equipment:avp_pauldron_${suffix}`;
      const forearm = addArmorPart(this.createArmorPlateGeometry(0.43, 0.90, 0.16, 0.10), armorMaterial, [0, -0.55, 0.35], [-0.05, 0, side * 0.04], elbow);
      forearm.name = `equipment:avp_forearm_plate_${suffix}`;
      const thigh = addArmorPart(this.createArmorPlateGeometry(0.42, 1.10, 0.16, 0.10), armorMaterial, [side * 0.08, -0.82, 0.37], [-0.06, 0, side * 0.04], hip);
      thigh.name = `equipment:avp_thigh_plate_${suffix}`;
      const shin = addArmorPart(this.createArmorPlateGeometry(0.40, 1.10, 0.15, 0.09), armorMaterial, [0, -0.79, 0.32], [0.06, 0, side * -0.03], knee);
      shin.name = `equipment:avp_shin_plate_${suffix}`;
      const kneeGuard = addArmorPart(new THREE.DodecahedronGeometry(0.23, 1), accentMaterial, [0, 0, 0.38], null, knee, 'accent');
      kneeGuard.name = `equipment:avp_knee_guard_${suffix}`;
      kneeGuard.scale.set(0.92, 0.86, 0.52);
    }

    const scarGroup = new THREE.Group();
    scarGroup.name = 'avpRitualIdentity:scar';
    const acidMaterial = new THREE.MeshStandardMaterial({
      color: 0x9acd42, emissive: 0x41680f, emissiveIntensity: 0.72, metalness: 0.14, roughness: 0.5,
    });
    for (const x of [-0.34, 0, 0.34]) {
      addArmorPart(new THREE.BoxGeometry(0.075, 0.56, 0.035), acidMaterial, [x * 0.8, 1.10, 0.76], [0, 0, x * -0.6], scarGroup, 'ritualMark');
    }

    const celticGroup = new THREE.Group();
    celticGroup.name = 'avpRitualIdentity:celtic';
    addArmorPart(new THREE.DodecahedronGeometry(0.22, 1), accentMaterial, [0, 1.12, 0.78], [0, 0, Math.PI / 4], celticGroup, 'accent');
    for (const side of [-1, 1]) {
      addArmorPart(new THREE.BoxGeometry(0.12, 0.66, 0.06), accentMaterial, [side * 0.32, 1.10, 0.75], [0, 0, side * 0.25], celticGroup, 'accent');
    }

    const chopperGroup = new THREE.Group();
    chopperGroup.name = 'avpRitualIdentity:chopper';
    for (const side of [-1, 1]) {
      const suffix = side < 0 ? 'l' : 'r';
      const arm = side < 0 ? this.leftArmRig : this.rightArmRig;
      const forearm = this.createAppearanceJointMount(chopperGroup, arm.elbow, `mount:chopper_forearm_${suffix}`);
      const shoulder = this.createAppearanceJointMount(chopperGroup, arm.shoulder, `mount:chopper_shoulder_${suffix}`);
      const housing = addArmorPart(new THREE.CapsuleGeometry(0.07, 0.94, 6, 14), armorMaterial, [side * 0.12, -0.55, 0.46], [0, 0, side * 0.04], forearm);
      housing.name = `equipment:chopper_forearm_housing_${suffix}`;
      const rail = addArmorPart(new THREE.CapsuleGeometry(0.035, 1.08, 5, 12), accentMaterial, [side * 0.12, -0.55, 0.53], [0, 0, side * 0.04], forearm, 'accent');
      rail.name = `detail:chopper_forearm_rail_${suffix}`;
      addArmorPart(new THREE.ConeGeometry(0.07, 0.28, 8), accentMaterial, [side * 0.12, 0.29, 0.12], [0, 0, side * -0.38], shoulder, 'accent');
    }

    this.avpRitualIdentityGroups = { scar_avp: scarGroup, celtic_avp: celticGroup, chopper_avp: chopperGroup };
    torsoMount.add(scarGroup, celticGroup);
    group.add(chopperGroup);
    return group;
  }
  createMaskGeometry(maskData) {
    return createBiomaskSculpt(maskData);
  }

  rebuildMaskDetails(maskData) {
    if (!this.maskDetailGroup) return;
    [...this.maskDetailGroup.children].forEach((child) => disposeObject3D(child));
    this.maskDetailGroup.clear();

    const region = ['bone', 'kok_viking', 'kwei', 'boar'].includes(maskData.shape) ? 'bone' : 'mask';
    const detailMat = createHeroMaterial(region, { color: maskData.armorColor });
    if (this.maskMesh.material.userData.heroSurface?.region !== region) {
      this.maskMesh.material.dispose();
      this.maskMesh.material = createHeroMaterial(region, { color: maskData.armorColor });
      this.maskMesh.userData.baseMaterial = this.maskMesh.material;
    }
    this.maskDetailGroup.position.copy(this.maskMesh.position);
    this.maskDetailGroup.scale.setScalar(1);
    const inserts = createBiomaskInserts(maskData);
    const visorMaterial = createHeroMaterial('rubber', { color: 0x10181a, roughness: 0.26 });
    const visor = this.tagPlayerMesh(new THREE.Mesh(inserts.visor, visorMaterial), 'visor', 'equipment_biomask_recessed_visor_vents');
    visor.name = 'equipment:biomask_visor_and_respiration_vents';
    const contours = this.tagPlayerMesh(new THREE.Mesh(inserts.frame, detailMat), 'mask', 'equipment_biomask_brow_cheek_contours');
    contours.name = 'equipment:biomask_brow_cheeks_and_nasal_ridge';
    const vents = this.tagPlayerMesh(new THREE.Mesh(inserts.vents, visorMaterial), 'visor', 'equipment_biomask_recessed_respiration');
    vents.name = 'equipment:biomask_respiration_mesh';
    this.maskDetailGroup.add(visor, contours, vents);
    // A sealed biomask covers the biological mouth; tusks must not pierce it.
    const openJaw = ['bone', 'kok_viking', 'kwei', 'boar'].includes(maskData.shape);
    this.headRig.traverse(object => {
      if (['anatomy_articulated_mandible', 'anatomy_mandible_tusk'].includes(object.userData.detailRole)) object.visible = openJaw;
    });
    const addTusk = (x, rotation) => {
      const tusk = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.75, 8), detailMat);
      tusk.position.set(x, -0.47, 0.64);
      tusk.rotation.z = rotation;
      tusk.userData.appearanceChannel = 'mask';
      this.maskDetailGroup.add(tusk);
    };

    if (['tracker', 'berserker', 'bone', 'kok_viking', 'kwei', 'boar'].includes(maskData.shape)) {
      addTusk(-0.64, -0.36);
      addTusk(0.64, 0.36);
    }
    if (['ritual', 'celtic', 'ancestral', 'exile', 'samurai', 'royal', 'aerial', 'fugitive', 'guardian', 'warrior', 'armored', 'stalker', 'scout'].includes(maskData.shape)) {
      const crest = new THREE.Mesh(
        this.createArmorPlateGeometry(maskData.shape === 'ancestral' ? 0.28 : 0.42, 0.85, 0.15, 0.12),
        detailMat,
      );
      crest.position.set(0, 1.05, 0.4);
      crest.userData.appearanceChannel = 'mask';
      this.maskDetailGroup.add(crest);
    }
  }

  setSkin(skinId) {
    const skinData = YautjaSkinsDatabase.find(s => s.id === skinId);
    if (!skinData) return this.customization;
    return this.applyCustomization(getArmorPresetCustomization(skinId));
  }

  setAppearanceChannelColor(channel, hex) {
    this.mesh.traverse((child) => {
      if (!child.isMesh || child.userData.appearanceChannel !== channel) return;
      const material = child.material === this.cloakMaterial
        ? child.userData.materialBeforeCloak ?? child.userData.baseMaterial
        : child.material;
      if (!material?.color) return;
      material.color.setHex(hex);
      child.userData.baseMaterial = material;
      if (child.material !== this.cloakMaterial) child.material = material;
    });
  }

  applyCloakMaterials() {
    this.mesh.traverse((child) => {
      if (!child.isMesh || child.material === this.cloakMaterial) return;
      child.userData.materialBeforeCloak = child.material;
      child.material = this.cloakMaterial;
    });
  }

  restoreCloakMaterials() {
    this.mesh.traverse((child) => {
      if (!child.isMesh) return;
      child.material = child.userData.materialBeforeCloak ?? child.userData.baseMaterial ?? child.material;
      delete child.userData.materialBeforeCloak;
    });
  }

  applyPresetMaterialTexture(armorPresetId) {
    const presetTexture = LOST_TRIBE_PRESET_IDS.has(armorPresetId)
      ? this.lostTribeTexture
      : armorPresetId === 'wolf_avpr'
        ? this.wolfCleanerTexture
        : null;

    const materialBindings = [];
    this.mesh.traverse((child) => {
      if (!child.isMesh || !['armor', 'mask', 'accent'].includes(child.userData.appearanceChannel)) return;
      const material = child.material === this.cloakMaterial
        ? child.userData.materialBeforeCloak ?? child.userData.baseMaterial
        : child.material;
      if (material) materialBindings.push({ child, material });
    });

    const materials = new Set(materialBindings.map(({ material }) => material));
    materials.forEach((material) => {
      material.userData ??= {};
      if (!Object.prototype.hasOwnProperty.call(material.userData, 'appearanceBaseMap')) {
        material.userData.appearanceBaseMap = material.map ?? null;
      }
      // Old preset images depict whole industrial panels; they are not UV
      // atlases for an anatomical face, boots or painted armour.
      if (!material.userData.heroSurface) material.map = presetTexture ?? material.userData.appearanceBaseMap;
      material.userData.presetIdentity = armorPresetId;
      material.needsUpdate = true;
    });

    materialBindings.forEach(({ child, material }) => {
      child.userData.baseMaterial = material;
      if (child.material !== this.cloakMaterial) child.material = material;
    });
    return presetTexture;
  }

  applyAvpRitualArmor(armorPresetId) {
    const active = AVP_RITUAL_PRESET_IDS.has(armorPresetId);
    if (!this.avpRitualArmorGroup) return active;
    this.avpRitualArmorGroup.visible = active;
    Object.entries(this.avpRitualIdentityGroups ?? {}).forEach(([presetId, group]) => {
      group.visible = active && presetId === armorPresetId;
    });
    this.avpRitualArmorGroup.userData.activePresetId = active ? armorPresetId : null;
    return active;
  }

  applyArmorPresetWeaponVariant(armorPresetId) {
    const variant = getArmorPresetWeaponTechVariant(armorPresetId, 'wristblades');
    this.activeWristbladeVariantId = variant?.id ?? null;
    this.wristbladeDamageMultiplier = variant?.modifiers.damageMultiplier ?? 1;
    this.wristbladeRangeMultiplier = variant?.modifiers.rangeMultiplier ?? 1;
    this.wristbladeCooldownMultiplier = variant?.modifiers.cooldownMultiplier ?? 1;
    this.wristbladeVisualLengthScale = variant?.modifiers.rangeMultiplier ?? 1;
    this.wristShieldAbsorbBonus = variant?.modifiers.wristShieldAbsorbBonus ?? 0;
    const tripleBladeVariant = variant?.id === 'variant_chopper_extended_wristblades';
    const feralShieldVariant = variant?.id === 'variant_feral_bone_shield';
    this.wristbladeRestPositionZ = tripleBladeVariant ? 0.5 : variant ? 0.42 : 0.35;
    this.wristbladeAttackPositionZ = tripleBladeVariant ? 1.05 : variant ? 0.82 : 0.65;
    for (const blade of [this.wristbladeRight, this.wristbladeLeft]) {
      if (!blade) continue;
      blade.scale.z = this.wristbladeVisualLengthScale;
      if (!this.isAttacking) blade.position.z = this.wristbladeRestPositionZ;
      blade.userData.techVariantId = this.activeWristbladeVariantId;
      blade.userData.rangeMultiplier = this.wristbladeVisualLengthScale;
      const bladeMeshes = blade.userData.bladeMeshes ?? [];
      bladeMeshes.forEach((bladeMesh, bladeIndex) => {
        bladeMesh.visible = tripleBladeVariant || bladeIndex !== 1;
        bladeMesh.userData.deploymentProfile = tripleBladeVariant
          ? 'triple_extended'
          : variant?.id === 'variant_wolf_power_glove'
            ? 'double_power_reinforced'
            : feralShieldVariant
              ? 'feral_shield_edge'
              : 'double_standard';
      });
      blade.userData.visibleBladeCount = tripleBladeVariant ? 3 : 2;
      blade.userData.powerGloveReinforced = variant?.id === 'variant_wolf_power_glove';
      blade.userData.feralShieldEdge = feralShieldVariant;
    }
    return variant;
  }
  applyCustomization(next = {}) {
    const preserveCloak = this.isCloaked;
    if (preserveCloak) this.restoreCloakMaterials();
    const merged = sanitizeCustomization(
      { ...this.customization, ...next },
      next.armorPresetId ?? this.customization.armorPresetId ?? this.currentSkinId,
    );
    this.customization = merged;
    this.currentSkinId = merged.armorPresetId;

    const mask = MASK_VARIANTS.find(({ id }) => id === merged.maskId) ?? MASK_VARIANTS[0];
    const skin = getPaletteEntry(SKIN_PALETTES, merged.skinColorId, DEFAULT_CUSTOMIZATION.skinColorId);
    const dread = getPaletteEntry(DREAD_PALETTES, merged.dreadColorId, DEFAULT_CUSTOMIZATION.dreadColorId);
    const armor = getPaletteEntry(ARMOR_PALETTES, merged.armorColorId, DEFAULT_CUSTOMIZATION.armorColorId);
    const accent = getPaletteEntry(ARMOR_ACCENTS, merged.armorAccentColorId, DEFAULT_CUSTOMIZATION.armorAccentColorId);

    this.setAppearanceChannelColor('skin', skin.hex);
    this.setAppearanceChannelColor('dread', dread.hex);
    this.setAppearanceChannelColor('armor', armor.hex);
    this.setAppearanceChannelColor('accent', accent.hex);
    this.setAppearanceChannelColor('mask', mask.armorColor);

    if (this.maskMesh) {
      this.maskMesh.geometry.dispose();
      this.maskMesh.geometry = this.createMaskGeometry(mask);
    }
    if (this.maskLens?.material?.color) this.maskLens.material.color.setHex(mask.lensColor);
    this.rebuildMaskDetails(mask);
    this.maskDetailGroup?.traverse((child) => {
      if (child.isMesh) child.userData.baseMaterial = child.material;
    });
    this.applyPresetMaterialTexture(merged.armorPresetId);
    this.applyAvpRitualArmor(merged.armorPresetId);
    this.applyWolfCleanerEquipment(merged.armorPresetId);
    this.applyDreadStyle(merged.dreadStyleId);
    this.applyArmorFinish(merged.armorFinishId);
    this.rebuildWarpaint(merged.warpaintId);
    this.applyHunterClass(merged.hunterClassId);
    this.applyArmorPresetWeaponVariant(merged.armorPresetId);
    if (this.huntLoadoutVisualApplied) this.applyHuntLoadout(this.activeHuntLoadoutIds);
    if (preserveCloak) this.applyCloakMaterials();
    this.refreshVisualFidelityMetrics(this.mesh);
    return this.customization;
  }

  applyHunterClass(classId, preserveRatio = true) {
    const hunterClass = HUNTER_CLASSES.find(({ id }) => id === classId) ?? HUNTER_CLASSES[0];
    const healthRatio = this.maxHealth > 0 ? this.health / this.maxHealth : 1;
    const energyRatio = this.maxEnergy > 0 ? this.energy / this.maxEnergy : 1;
    const staminaRatio = this.maxStamina > 0 ? this.stamina / this.maxStamina : 1;
    this.maxHealth = hunterClass.maxHealth;
    this.maxEnergy = hunterClass.maxEnergy;
    this.maxStamina = hunterClass.maxStamina;
    this.moveSpeed = hunterClass.moveSpeed;
    this.sprintSpeed = hunterClass.sprintSpeed;
    this.energyRegen = hunterClass.energyRegen;
    this.hunterClassMeleeMultiplier = hunterClass.meleeMultiplier;
    this.meleeDamageMultiplier = this.hunterClassMeleeMultiplier;
    this.health = preserveRatio ? Math.min(this.maxHealth, this.maxHealth * healthRatio) : this.maxHealth;
    this.energy = preserveRatio ? Math.min(this.maxEnergy, this.maxEnergy * energyRatio) : this.maxEnergy;
    this.stamina = preserveRatio ? Math.min(this.maxStamina, this.maxStamina * staminaRatio) : this.maxStamina;
    return hunterClass;
  }

  applyDreadStyle(styleId) {
    const style = DREAD_STYLES.find(({ id }) => id === styleId) ?? DREAD_STYLES[0];
    (this.dreadGroups ?? []).forEach((group, index) => {
      const basePosition = group.userData.basePosition;
      const baseRotation = group.userData.baseRotation;
      if (basePosition) {
        group.position.copy(basePosition);
        group.position.x *= style.spreadScale;
      }
      if (baseRotation) group.rotation.copy(baseRotation);
      if (style.id === 'dread_style_braided') group.rotation.y = (index % 2) ? -0.22 : 0.22;
      else if (style.id === 'dread_style_avp_heavy') {
        group.rotation.y = ((index % 3) - 1) * 0.08;
        group.rotation.x -= Math.abs(index - 5) * 0.008;
      } else if (style.id === 'dread_style_wolf_veteran') {
        group.rotation.y = ((index % 4) - 1.5) * 0.055;
        group.rotation.x -= 0.08 + Math.abs(index - 5) * 0.012;
        group.rotation.z += index % 2 === 0 ? -0.025 : 0.025;
      } else group.rotation.y = 0;
      group.scale.set(1, style.lengthScale, 1);
      group.userData.animationBaseRotation = group.rotation.clone();
      group.children.slice(1).forEach((bead) => {
        bead.visible = index % style.beadStride === 0;
      });
    });
    return style;
  }

  applyArmorFinish(finishId) {
    const finish = ARMOR_FINISHES.find(({ id }) => id === finishId) ?? ARMOR_FINISHES[0];
    this.mesh.traverse((child) => {
      if (!child.isMesh || !['armor', 'mask', 'accent'].includes(child.userData.appearanceChannel)) return;
      const material = child.material === this.cloakMaterial
        ? child.userData.materialBeforeCloak ?? child.userData.baseMaterial
        : child.material;
      if (!material) return;
      const surface = material.userData?.heroSurface;
      material.metalness = surface
        ? THREE.MathUtils.clamp(finish.metalness * surface.metalness / 0.76, 0, 1)
        : finish.metalness;
      material.roughness = surface
        ? THREE.MathUtils.clamp(finish.roughness * surface.roughness / 0.56, 0.04, 1)
        : finish.roughness;
      if ('emissiveIntensity' in material && finish.emissiveIntensity !== undefined) material.emissiveIntensity = finish.emissiveIntensity;
      material.userData ??= {};
      material.userData.acidResistantFinish = finish.id === 'finish_cleaner_acid_resistant';
      if (finish.id === 'finish_cleaner_acid_resistant') material.envMapIntensity = 1.28;
      material.needsUpdate = true;
      child.userData.baseMaterial = material;
    });
    return finish;
  }

  rebuildWarpaint(warpaintId) {
    if (!this.warpaintGroup) return null;
    [...this.warpaintGroup.children].forEach((child) => disposeObject3D(child));
    this.warpaintGroup.clear();
    const warpaint = WARPAINT_PATTERNS.find(({ id }) => id === warpaintId) ?? WARPAINT_PATTERNS[0];
    if (warpaint.pattern === 'none') return warpaint;
    const baseMaterial = new THREE.MeshBasicMaterial({ color: warpaint.color, transparent: true, opacity: 0.86 });
    const addMark = (x, y, width, height, rotation = 0) => {
      const mark = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.035), baseMaterial.clone());
      mark.position.set(x, y - 5.37, 1.07);
      mark.rotation.z = rotation;
      mark.userData.appearanceChannel = 'warpaint';
      mark.userData.baseMaterial = mark.material;
      this.warpaintGroup.add(mark);
    };
    if (warpaint.id === 'warpaint_wolf_veteran_scars') {
      [-0.38, -0.08, 0.24].forEach((x, index) => addMark(x, 5.62 - index * 0.08, 0.09, 1.18 - index * 0.12, -0.28 + index * 0.09));
      addMark(0.46, 5.82, 0.08, 0.72, 0.42);
    }
    else if (warpaint.pattern === 'brow') addMark(0, 5.93, 1.5, 0.16, -0.08);
    else if (warpaint.pattern === 'claw') [-0.42, 0, 0.42].forEach((x, index) => addMark(x, 5.63, 0.13, 1.25, -0.24 + index * 0.08));
    else if (warpaint.pattern === 'acid_mark') {
      addMark(0, 5.86, 0.24, 0.24, Math.PI / 4);
      addMark(-0.3, 5.55, 0.11, 0.72, 0.48);
      addMark(0.3, 5.55, 0.11, 0.72, -0.48);
      addMark(0, 5.32, 0.72, 0.1);
    }
    else {
      addMark(0, 6.12, 1.2, 0.14);
      addMark(-0.52, 5.62, 0.12, 0.86, 0.42);
      addMark(0.52, 5.62, 0.12, 0.86, -0.42);
    }
    baseMaterial.dispose();
    return warpaint;
  }

  activateWristShield() {
    if (this.isDead || this.wristShieldActive || this.wristShieldCooldown > 0 || this.energy < 25 || this.wristShieldIntegrity <= 0) return false;
    if (this.isCloaked) this.toggleCloak();
    this.energy -= 25;
    this.wristShieldActive = true;
    this.wristShieldTimer = 3.5;
    this.wristShieldCooldown = 8;
    if (this.wristShieldMesh) this.wristShieldMesh.visible = true;
    audioSynth.playYautjaClick();
    return true;
  }

  deactivateWristShield() {
    const changed = this.wristShieldActive;
    this.wristShieldActive = false;
    this.wristShieldTimer = 0;
    if (this.wristShieldMesh) this.wristShieldMesh.visible = false;
    return changed;
  }

  clearTransientGadgets() {
    const changed = this.wristShieldActive || Boolean(this.scoutDrone) || Boolean(this.apexDecoy);
    this.deactivateWristShield();
    if (this.scoutDrone) disposeObject3D(this.scoutDrone);
    this.scoutDrone = null;
    this.scoutDroneTimer = 0;
    this.scoutDroneAge = 0;
    if (this.apexDecoy) disposeObject3D(this.apexDecoy);
    this.apexDecoy = null;
    this.apexDecoyTimer = 0;
    this.apexDecoyAge = 0;
    return changed;
  }

  deployApexDecoy(targetPosition = this.position, { groundHeight, sampleGroundHeight } = {}) {
    if (this.isDead || this.apexDecoyCooldown > 0 || this.energy < 22) return null;
    this.energy -= 22;
    this.apexDecoyCooldown = 18;
    this.apexDecoyTimer = 8;
    this.apexDecoyAge = 0;
    if (this.apexDecoy) disposeObject3D(this.apexDecoy);

    const hologram = new THREE.Group();
    hologram.name = 'playerApexDecoy';
    const hologramMaterial = new THREE.MeshBasicMaterial({
      color: 0x55ffdc,
      wireframe: true,
      transparent: true,
      opacity: 0.64,
      depthWrite: false,
    });
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.82, 2.8, 6, 10), hologramMaterial);
    torso.position.y = 3.1;
    torso.scale.set(1.25, 1, 0.76);
    const head = new THREE.Mesh(new THREE.DodecahedronGeometry(0.72, 1), hologramMaterial);
    head.position.y = 5.55;
    hologram.add(torso, head);
    for (const side of [-1, 1]) {
      const limb = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 2.4, 4, 8), hologramMaterial);
      limb.position.set(side * 1.16, 3.15, 0);
      limb.rotation.z = side * -0.18;
      hologram.add(limb);
    }
    hologram.position.copy(targetPosition?.isVector3 ? targetPosition : this.position);
    const sampledHeight = typeof sampleGroundHeight === 'function'
      ? Number(sampleGroundHeight(hologram.position.clone()))
      : Number.NaN;
    const requestedHeight = Number(groundHeight);
    const fallbackHeight = Number.isFinite(hologram.position.y)
      ? hologram.position.y
      : Number(this.position.y) || 0;
    hologram.position.y = Number.isFinite(sampledHeight)
      ? sampledHeight
      : Number.isFinite(requestedHeight)
        ? requestedHeight
        : fallbackHeight;
    hologram.userData.threatSource = 'apex_decoy';
    hologram.userData.groundAnchored = true;
    this.apexDecoy = hologram;
    this.scene.add(hologram);
    audioSynth.playThermalSwitch();
    return hologram;
  }

  deployScoutDrone() {
    if (this.isDead || this.scoutDroneCooldown > 0 || this.energy < 20) return false;
    this.energy -= 20;
    this.scoutDroneCooldown = 14;
    this.scoutDroneTimer = 7;
    this.scoutDroneAge = 0;
    if (this.scoutDrone) disposeObject3D(this.scoutDrone);
    const drone = new THREE.Group();
    drone.name = 'playerScoutDrone';
    const shell = new THREE.MeshStandardMaterial({ color: 0x4a5555, metalness: 0.9, roughness: 0.24 });
    drone.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.48), shell));
    for (const side of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.08, 0.42), shell);
      wing.position.x = side * 0.72;
      wing.rotation.z = side * 0.16;
      drone.add(wing);
    }
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshBasicMaterial({ color: 0x55eeff }));
    eye.position.z = 0.48;
    drone.add(eye);
    this.scoutDrone = drone;
    this.scene.add(drone);
    audioSynth.playThermalSwitch();
    return true;
  }

  fireShuriken(targetPos) {
    if (!targetPos?.isVector3 || this.isDead || this.shurikenCooldown > 0 || this.energy < 12) return false;
    this.energy -= 12;
    this.shurikenCooldown = 2.4;
    const shuriken = tagWeaponAssembly(new THREE.Group(), 'collapsible_shuriken');
    shuriken.name = 'projectile:yautja_collapsible_shuriken';
    shuriken.userData.bladeCount = 6;
    const metal = new THREE.MeshStandardMaterial({ color: 0xd5e2df, metalness: 1, roughness: 0.12 });
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x273236, metalness: 0.94, roughness: 0.26 });
    const energy = new THREE.MeshStandardMaterial({
      color: 0x6edbd0,
      emissive: 0x1b9a91,
      emissiveIntensity: 1.25,
      metalness: 0.72,
      roughness: 0.18,
    });
    const chassis = tagWeaponPart(
      new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.13, 28, 2), darkMetal),
      'weapon:shuriken_chassis',
      'weapon_shuriken_chassis',
    );
    chassis.rotation.x = Math.PI / 2;
    shuriken.add(chassis);
    const hub = tagWeaponPart(
      new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.22, 18, 2), energy),
      'weapon:shuriken_energy_hub',
      'weapon_shuriken_energy_hub',
    );
    hub.rotation.x = Math.PI / 2;
    shuriken.add(hub);
    for (const z of [-0.075, 0.075]) {
      const retainingRing = tagWeaponPart(
        new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.035, 8, 28), metal),
        `detail:shuriken_retaining_ring_${z < 0 ? 'rear' : 'front'}`,
        'weapon_shuriken_retaining_ring',
      );
      retainingRing.position.z = z;
      shuriken.add(retainingRing);
    }
    for (let index = 0; index < 6; index += 1) {
      const blade = tagWeaponPart(
        new THREE.Mesh(createRadialBladeGeometry(0.38, 1.02, 0.18, 0.075), metal),
        `weapon:shuriken_blade_${index + 1}`,
        'weapon_shuriken_serrated_blade',
      );
      blade.rotation.z = index * Math.PI / 3;
      blade.userData.serrationCount = 3;
      shuriken.add(blade);
      const hinge = tagWeaponPart(
        new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.16, 10), energy),
        `detail:shuriken_blade_hinge_${index + 1}`,
        'weapon_shuriken_blade_hinge',
      );
      hinge.rotation.x = Math.PI / 2;
      hinge.position.set(Math.cos(index * Math.PI / 3) * 0.46, Math.sin(index * Math.PI / 3) * 0.46, 0);
      shuriken.add(hinge);
    }
    shuriken.position.copy(this.position).add(new THREE.Vector3(0, 4, 0));
    const dir = targetPos.clone().sub(shuriken.position).normalize();
    shuriken.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    this.projectiles.push({ mesh: shuriken, dir, speed: 92, type: 'shuriken', damage: 62, lifetime: 3 });
    this.scene.add(shuriken);
    if (typeof audioSynth.playShurikenThrow === 'function') {
      audioSynth.playShurikenThrow();
    } else {
      audioSynth.playSpearThrow();
    }
    return true;
  }

  triggerVictoryRoar() {
    if (this.roarUsed || this.isDead) return false;
    this.roarUsed = true;
    audioSynth.playVictoryRoar();
    this.energy = Math.min(this.maxEnergy, this.energy + 22);
    this.stamina = Math.min(this.maxStamina, this.stamina + 30);
    return true;
  }

  // Baie médicale Yautja & Medicomp 1:1
  applyMedicalTreatment(itemId) {
    if (!this.medbayInventory) {
      this.medbayInventory = createMedbayInventoryState({ isMothership: false });
    }
    return applyMedbayItem(this, itemId, this.medbayInventory, audioSynth);
  }

  triggerVoiceMimicry(lureType = null) {
    const selectedLure = lureType ?? MIMICRY_LURE_TYPES[this.mimicryLureIndex % MIMICRY_LURE_TYPES.length];
    this.mimicryLureIndex = (this.mimicryLureIndex + 1) % MIMICRY_LURE_TYPES.length;
    audioSynth.playMimicryLure(selectedLure);
    return selectedLure;
  }

  cycleVisionMode() {
    if (this.activeVisionMode === 'normal') this.activeVisionMode = 'thermal';
    else if (this.activeVisionMode === 'thermal') this.activeVisionMode = 'tech';
    else this.activeVisionMode = 'normal';

    audioSynth.playThermalSwitch();
    audioSynth.playYautjaClick();
    return this.activeVisionMode;
  }

  toggleCloak() {
    if (!this.isCloaked && this.wristShieldActive) return false;
    if (!this.isCloaked && (this.isDead || this.isSelfDestructing || this.energy <= 0)) return false;
    if (!this.isCloaked && this.isAcidCorroded && !this.hasAntiAcidCloak) return false;

    this.isCloaked = !this.isCloaked;
    this.waterDisruptionTimer = 0;
    audioSynth.playThermalSwitch();

    if (this.isCloaked) this.applyCloakMaterials();
    else this.restoreCloakMaterials();

    return this.isCloaked;
  }

  applyAcidCorrosion() {
    if (this.hasAntiAcidCloak) return false;
    if (this.isCloaked) this.toggleCloak();
    this.isAcidCorroded = true;
    this.acidTimer = 5.0;
    audioSynth.playAcidSizzle();
    return true;
  }

  applyCombatStatus(status, duration = 0) {
    if (!Object.hasOwn(this.combatStatusTimers, status)) return false;
    const seconds = Math.max(0, Number(duration) || 0);
    if (seconds === 0) return false;
    this.combatStatusTimers[status] = Math.max(this.combatStatusTimers[status], seconds);
    return true;
  }

  getCombatMovementMultiplier() {
    if (this.combatStatusTimers.snare > 0) return 0.25;
    if (this.combatStatusTimers.disorientation > 0) return 0.55;
    if (this.combatStatusTimers.suppression > 0) return 0.7;
    return 1;
  }

  clearCombatStatuses() {
    const changed = Object.values(this.combatStatusTimers).some((timer) => timer > 0);
    Object.keys(this.combatStatusTimers).forEach((status) => {
      this.combatStatusTimers[status] = 0;
    });
    return changed;
  }

  triggerQTE() {
    if (this.inQTE) return;
    this.inQTE = true;
    this.qteTimer = 2.5;
    audioSynth.playAcidSizzle();
  }

  resolveQTE(success) {
    if (!this.inQTE) return false;
    this.inQTE = false;
    this.qteTimer = 0;

    if (success) {
      audioSynth.playWristbladeSlash();
      this.addHonor(150);
    } else {
      this.takeDamage(35);
    }
    return success;
  }

  jumpToCanopy(perchNodes) {
    if (this.isPerched) {
      this.isPerched = false;
      this.position.y = 0;
      audioSynth.playCanopyLeap();
      return false;
    }

    let closestNode = null;
    let minDist = 45.0;

    perchNodes.forEach(node => {
      const dist = new THREE.Vector2(this.position.x, this.position.z).distanceTo(new THREE.Vector2(node.x, node.z));
      if (dist < minDist) {
        minDist = dist;
        closestNode = node;
      }
    });

    if (closestNode) {
      this.isPerched = true;
      this.currentPerchNode = closestNode;
      this.position.set(closestNode.x, closestNode.y, closestNode.z);
      audioSynth.playCanopyLeap();
      return true;
    }
    return false;
  }

  attack(targetPos) {
    if (this.isAttacking || this.isHealing || this.inQTE) return;
    this.meleeDamageMultiplier = this.hunterClassMeleeMultiplier ?? 1;

    if (this.isPerched) {
      this.isAttacking = true;
      this.isPerched = false;
      this.position.y = 0;
      audioSynth.playWristbladeSlash();
      audioSynth.playCanopyLeap();
      this.attackTimer = 0.5;
      return 'death_from_above';
    }

    if (this.selectedWeapon === 1) {
      this.isAttacking = true;
      this.meleeDamageMultiplier *= this.wristbladeDamageMultiplier;
      audioSynth.playWristbladeSlash();
      this.wristbladeRight.position.z = this.wristbladeAttackPositionZ;
      this.wristbladeLeft.position.z = this.wristbladeAttackPositionZ;
      this.attackTimer = 0.4 * (this.wristbladeCooldownMultiplier ?? 1);
      return 'wristblades';
    }
    else if (this.selectedWeapon === 2) {
      if (this.energy < 25) return;
      this.energy -= 25;
      this.isAttacking = true;
      audioSynth.playPlasmacasterBlast();
      this.firePlasmaBall(targetPos);
      this.attackTimer = 0.6;
    }
    else if (this.selectedWeapon === 3) {
      this.isAttacking = true;
      audioSynth.playSpearThrow();
      this.fireCombiStick(targetPos);
      this.attackTimer = 0.5;
    }
    else if (this.selectedWeapon === 4) {
      this.isAttacking = true;
      audioSynth.playSpearThrow();
      this.fireSmartDisc(targetPos);
      this.attackTimer = 0.5;
    }
    else if (this.selectedWeapon === 5) {
      if (this.energy < 15) return;
      this.energy -= 15;
      this.isAttacking = true;
      audioSynth.playSpearThrow();
      this.fireNetgun(targetPos);
      this.attackTimer = 0.5;
    }
    else if (this.selectedWeapon === 6) {
      if (this.energy < 50 || this.health >= this.maxHealth) return;
      this.energy -= 50;
      this.isHealing = true;
      audioSynth.playMedicompHeal();
      this.healTimer = 1.2;
    }
    else if (this.selectedWeapon === 7) {
      if (this.energy < 20) return;
      this.energy -= 20;
      this.deployPlasmaMine();
    }
    else if (this.selectedWeapon === 8) {
      this.isAttacking = true;
      audioSynth.playWhipSlash();
      this.attackTimer = 0.4;
      return 'whip_slash';
    }
    else if (this.selectedWeapon === 9) {
      if (this.stamina < 15) return;
      this.stamina -= 15;
      this.isAttacking = true;
      audioSynth.playSpearThrow();
      this.fireYautjaArrow(targetPos);
      this.attackTimer = 0.45;
    }
    else if (this.selectedWeapon === 0) {
      if (this.energy < 10) return;
      this.energy -= 10;
      this.isAttacking = true;
      audioSynth.playSpearThrow();
      this.fireSpeargunBolt(targetPos);
      this.attackTimer = 0.35;
    }
    else if (this.selectedWeapon === 10) {
      if (this.energy < 9) return;
      this.energy -= 9;
      this.isAttacking = true;
      audioSynth.playSpearThrow();
      this.fireFeralBolt(targetPos);
      this.attackTimer = 0.3;
    }
    else if (this.selectedWeapon === 11) {
      if (this.energy < 34) return;
      this.energy -= 34;
      this.isAttacking = true;
      audioSynth.playPlasmacasterBlast();
      this.fireWolfDualPlasma(targetPos);
      this.attackTimer = 0.72;
    }
    else if (this.selectedWeapon === 12) {
      if (this.energy < 32) return;
      this.energy -= 32;
      this.isAttacking = true;
      audioSynth.playPlasmacasterBlast();
      this.fireEyeOfRa(targetPos);
      this.attackTimer = 0.9;
    }
    else if (this.selectedWeapon === 13) {
      if (this.stamina < 26) return;
      this.stamina -= 26;
      this.isAttacking = true;
      if (this.fatherSwordMesh) this.fatherSwordMesh.visible = true;
      audioSynth.playWristbladeSlash();
      this.attackTimer = 0.62;
      return 'father_sword';
    }
    else if (this.selectedWeapon === 14) {
      if (this.energy < 28) return;
      this.energy -= 28;
      this.isAttacking = true;
      audioSynth.playMineExplosion();
      this.fireWristRocket(targetPos);
      this.attackTimer = 0.86;
    }
  }

  deployPlasmaMine() {
    const mine = tagWeaponAssembly(new THREE.Group(), 'plasma_proximity_mine');
    mine.name = 'deployable:yautja_plasma_mine';
    mine.userData.armedVisual = true;
    const shellMat = new THREE.MeshStandardMaterial({ color: 0x3a4649, metalness: 0.92, roughness: 0.28 });
    const alloyMat = new THREE.MeshStandardMaterial({ color: 0x849496, metalness: 1, roughness: 0.16 });
    const plasmaMat = new THREE.MeshStandardMaterial({
      color: 0xff6a30,
      emissive: 0xff2400,
      emissiveIntensity: 2.4,
      metalness: 0.35,
      roughness: 0.12,
    });
    const base = tagWeaponPart(
      new THREE.Mesh(new THREE.CylinderGeometry(0.67, 0.78, 0.24, 18, 2), shellMat),
      'weapon:plasma_mine_armored_base',
      'weapon_plasma_mine_armored_body',
    );
    base.position.y = 0.03;
    mine.add(base);
    const upperDeck = tagWeaponPart(
      new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.66, 0.2, 18, 2), alloyMat),
      'weapon:plasma_mine_upper_deck',
      'weapon_plasma_mine_armored_body',
    );
    upperDeck.position.y = 0.23;
    mine.add(upperDeck);
    const emitter = tagWeaponPart(
      new THREE.Mesh(new THREE.DodecahedronGeometry(0.31, 1), plasmaMat),
      'weapon:plasma_mine_emitter_core',
      'weapon_plasma_mine_emissive_core',
    );
    emitter.position.y = 0.47;
    emitter.scale.y = 0.72;
    mine.add(emitter);
    const focusRing = tagWeaponPart(
      new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.055, 10, 28), alloyMat),
      'detail:plasma_mine_focusing_ring',
      'weapon_plasma_mine_focusing_ring',
    );
    focusRing.position.y = 0.4;
    focusRing.rotation.x = Math.PI / 2;
    mine.add(focusRing);
    for (let index = 0; index < 4; index += 1) {
      const angle = index * Math.PI / 2 + Math.PI / 4;
      const outward = new THREE.Vector3(Math.cos(angle), -0.22, Math.sin(angle)).normalize();
      const strut = tagWeaponPart(
        new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.08, 0.74, 9, 1), alloyMat),
        `weapon:plasma_mine_leg_${index + 1}`,
        'weapon_plasma_mine_deployment_leg',
      );
      strut.position.set(Math.cos(angle) * 0.45, -0.07, Math.sin(angle) * 0.45);
      strut.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), outward);
      mine.add(strut);
      const foot = tagWeaponPart(
        new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.09, 0.23, 2, 1, 2), shellMat),
        `weapon:plasma_mine_foot_${index + 1}`,
        'weapon_plasma_mine_stabilizer_foot',
      );
      foot.position.set(Math.cos(angle) * 0.82, -0.18, Math.sin(angle) * 0.82);
      foot.rotation.y = -angle;
      mine.add(foot);
      const sensor = tagWeaponPart(
        new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), plasmaMat),
        `detail:plasma_mine_sensor_${index + 1}`,
        'weapon_plasma_mine_proximity_sensor',
      );
      sensor.position.set(Math.cos(angle) * 0.54, 0.24, Math.sin(angle) * 0.54);
      mine.add(sensor);
    }
    mine.position.copy(this.position).add(new THREE.Vector3(0, 0.24, 0));

    this.mines.push({ mesh: mine, damage: 120 });
    this.scene.add(mine);
    audioSynth.playBeep();
  }

  firePlasmaBall(targetPos) {
    const spawnPos = new THREE.Vector3();
    this.plasmacasterMesh.getWorldPosition(spawnPos);

    if (this.hasTriBeam) {
      for (let offset of [-0.3, 0, 0.3]) {
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), ShaderManager.createPlasmaMaterial());
        ball.position.copy(spawnPos);
        const dir = targetPos.clone().sub(spawnPos).normalize();
        dir.x += offset;
        dir.normalize();
        this.projectiles.push({ mesh: ball, dir, speed: 65, type: 'plasma', damage: 40, lifetime: 3.0 });
        this.scene.add(ball);
      }
    } else {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), ShaderManager.createPlasmaMaterial());
      ball.position.copy(spawnPos);
      const dir = targetPos.clone().sub(spawnPos).normalize();
      this.projectiles.push({ mesh: ball, dir, speed: 65, type: 'plasma', damage: 45, lifetime: 3.0 });
      this.scene.add(ball);
    }
  }

  fireCombiStick(targetPos) {
    const spear = tagWeaponAssembly(new THREE.Group(), 'combistick');
    spear.name = 'projectile:yautja_combistick';
    spear.userData.segmentCount = 5;
    spear.userData.bladeCount = 2;
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x5e6a6d, metalness: 0.92, roughness: 0.24 });
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xcbd8d9, metalness: 1, roughness: 0.1 });
    const collarMat = new THREE.MeshStandardMaterial({ color: 0x8c7651, metalness: 0.86, roughness: 0.28 });
    const gripMat = new THREE.MeshStandardMaterial({ color: 0x272321, metalness: 0.28, roughness: 0.72 });
    for (let index = 0; index < 5; index += 1) {
      const segment = tagWeaponPart(
        new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.9, 12, 2), shaftMat),
        `weapon:combistick_shaft_segment_${index + 1}`,
        'weapon_combistick_segmented_shaft',
      );
      segment.rotation.x = Math.PI / 2;
      segment.position.z = (index - 2) * 0.84;
      spear.add(segment);
    }
    const grip = tagWeaponPart(
      new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 1.1, 14, 4), gripMat),
      'weapon:combistick_braided_grip',
      'weapon_combistick_braided_grip',
    );
    grip.rotation.x = Math.PI / 2;
    spear.add(grip);
    for (const z of [-1.76, -0.58, 0.58, 1.76]) {
      const collar = tagWeaponPart(
        new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.035, 8, 18), collarMat),
        `detail:combistick_locking_collar_${z}`,
        'weapon_combistick_locking_collar',
      );
      collar.position.z = z;
      spear.add(collar);
    }
    for (const side of [-1, 1]) {
      const blade = tagWeaponPart(
        new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.98, 6, 3), bladeMat),
        `weapon:combistick_tip_blade_${side < 0 ? 'rear' : 'front'}`,
        'weapon_combistick_tip_blade',
      );
      blade.position.z = side * 2.5;
      blade.rotation.x = side * Math.PI / 2;
      blade.scale.set(0.72, 1, 1.18);
      spear.add(blade);
      for (let vaneIndex = -1; vaneIndex <= 1; vaneIndex += 2) {
        const vane = tagWeaponPart(
          new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.42, 4, 1), bladeMat),
          `detail:combistick_tip_vane_${side}_${vaneIndex}`,
          'weapon_combistick_tip_vane',
        );
        vane.position.set(vaneIndex * 0.13, 0, side * 2.13);
        vane.rotation.set(side * Math.PI / 2, 0, vaneIndex * 0.2);
        spear.add(vane);
      }
    }
    spear.position.copy(this.mesh.position).add(new THREE.Vector3(0, 4, 0));
    const dir = targetPos.clone().sub(spear.position).normalize();
    spear.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    this.projectiles.push({ mesh: spear, dir, speed: 80, type: 'spear', damage: 65, lifetime: 2.5 });
    this.scene.add(spear);
  }

  fireSmartDisc(targetPos) {
    const disc = tagWeaponAssembly(new THREE.Group(), 'smart_disc');
    disc.name = 'projectile:yautja_smart_disc';
    disc.userData.bladeCount = 8;
    disc.userData.guidanceCore = true;
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x354348, metalness: 0.96, roughness: 0.19 });
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xc8d4d4, metalness: 1, roughness: 0.08 });
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xe7a236,
      emissive: 0xc9510e,
      emissiveIntensity: 1.45,
      metalness: 0.72,
      roughness: 0.15,
    });
    for (const z of [-0.055, 0.055]) {
      const body = tagWeaponPart(
        new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.105, 32, 2), chassisMat),
        `weapon:smart_disc_body_${z < 0 ? 'rear' : 'front'}`,
        'weapon_smart_disc_armored_body',
      );
      body.rotation.x = Math.PI / 2;
      body.position.z = z;
      disc.add(body);
    }
    const core = tagWeaponPart(
      new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.25, 20, 2), coreMat),
      'weapon:smart_disc_guidance_core',
      'weapon_smart_disc_guidance_core',
    );
    core.rotation.x = Math.PI / 2;
    disc.add(core);
    for (const radius of [0.3, 0.5]) {
      const circuitRing = tagWeaponPart(
        new THREE.Mesh(new THREE.TorusGeometry(radius, 0.025, 7, 32), coreMat),
        `detail:smart_disc_circuit_ring_${radius}`,
        'weapon_smart_disc_circuit_ring',
      );
      circuitRing.position.z = 0.12;
      disc.add(circuitRing);
    }
    for (let index = 0; index < 8; index += 1) {
      const blade = tagWeaponPart(
        new THREE.Mesh(createRadialBladeGeometry(0.56, 1.18, 0.19, 0.11), bladeMat),
        `weapon:smart_disc_serrated_blade_${index + 1}`,
        'weapon_smart_disc_serrated_blade',
      );
      blade.rotation.z = index * Math.PI / 4;
      blade.userData.serrationCount = 3;
      disc.add(blade);
      const lock = tagWeaponPart(
        new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.18, 9), coreMat),
        `detail:smart_disc_blade_lock_${index + 1}`,
        'weapon_smart_disc_blade_lock',
      );
      lock.rotation.x = Math.PI / 2;
      lock.position.set(Math.cos(index * Math.PI / 4) * 0.57, Math.sin(index * Math.PI / 4) * 0.57, 0);
      disc.add(lock);
    }
    disc.position.copy(this.mesh.position).add(new THREE.Vector3(0, 4, 0));
    const dir = targetPos.clone().sub(disc.position).normalize();
    disc.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    this.projectiles.push({ mesh: disc, dir, speed: 55, type: 'disc', damage: 50, lifetime: 3.5 });
    this.scene.add(disc);
  }

  fireNetgun(targetPos) {
    const net = tagWeaponAssembly(new THREE.Group(), 'netgun_capture_net');
    net.name = 'projectile:yautja_netgun_mesh';
    net.userData.weaveDensity = 14;
    net.userData.anchorCount = 8;
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x426467, metalness: 0.76, roughness: 0.42 });
    const anchorMat = new THREE.MeshStandardMaterial({ color: 0x9aa9a9, metalness: 0.94, roughness: 0.18 });
    const chargeMat = new THREE.MeshStandardMaterial({
      color: 0x68e5df,
      emissive: 0x0dbab5,
      emissiveIntensity: 1.8,
      metalness: 0.48,
      roughness: 0.2,
    });
    const perimeter = tagWeaponPart(
      new THREE.Mesh(new THREE.TorusGeometry(1.86, 0.045, 8, 44), cableMat),
      'weapon:netgun_braided_perimeter',
      'weapon_netgun_braided_perimeter',
    );
    net.add(perimeter);
    const offsets = [-1.5, -1, -0.5, 0, 0.5, 1, 1.5];
    offsets.forEach((offset, index) => {
      const span = Math.sqrt(Math.max(0.1, 1.82 ** 2 - offset ** 2)) * 2;
      const warp = tagWeaponPart(
        new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, span, 6, 1), cableMat),
        `weapon:netgun_warp_${index + 1}`,
        'weapon_netgun_woven_cable',
      );
      warp.position.x = offset;
      warp.position.z = (index % 2 === 0 ? -1 : 1) * 0.012;
      net.add(warp);
      const weft = tagWeaponPart(
        new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, span, 6, 1), cableMat),
        `weapon:netgun_weft_${index + 1}`,
        'weapon_netgun_woven_cable',
      );
      weft.position.y = offset;
      weft.position.z = (index % 2 === 0 ? 1 : -1) * 0.012;
      weft.rotation.z = Math.PI / 2;
      net.add(weft);
    });
    const knotGeometry = new THREE.SphereGeometry(0.052, 8, 6);
    const knotPositions = [];
    for (const x of offsets) {
      for (const y of offsets) {
        if (x * x + y * y <= 1.72 ** 2) knotPositions.push([x, y]);
      }
    }
    const knots = tagWeaponPart(
      new THREE.InstancedMesh(knotGeometry, chargeMat, knotPositions.length),
      'weapon:netgun_energy_knots',
      'weapon_netgun_energy_knot',
    );
    const knotTransform = new THREE.Object3D();
    knotPositions.forEach(([x, y], index) => {
      knotTransform.position.set(x, y, 0.04);
      knotTransform.updateMatrix();
      knots.setMatrixAt(index, knotTransform.matrix);
    });
    knots.instanceMatrix.needsUpdate = true;
    knots.userData.instanceDetailCount = knotPositions.length;
    net.add(knots);
    for (let index = 0; index < 8; index += 1) {
      const angle = index * Math.PI / 4;
      const anchor = tagWeaponPart(
        new THREE.Mesh(new THREE.DodecahedronGeometry(0.15, 1), anchorMat),
        `weapon:netgun_weighted_anchor_${index + 1}`,
        'weapon_netgun_weighted_anchor',
      );
      anchor.position.set(Math.cos(angle) * 1.86, Math.sin(angle) * 1.86, 0);
      anchor.rotation.z = angle;
      net.add(anchor);
    }
    net.position.copy(this.mesh.position).add(new THREE.Vector3(0, 4, 0));
    const dir = targetPos.clone().sub(net.position).normalize();
    net.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    this.projectiles.push({ mesh: net, dir, speed: 45, type: 'net', damage: 15, isNet: true, lifetime: 3.0 });
    this.scene.add(net);
  }

  fireYautjaArrow(targetPos) {
    const arrow = new THREE.Group();
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 3.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x4b3621, roughness: 0.7 }),
    );
    shaft.rotation.x = Math.PI / 2;
    const head = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 0.65, 8),
      new THREE.MeshStandardMaterial({ color: 0xb8c4ca, metalness: 0.95, roughness: 0.15 }),
    );
    head.rotation.x = Math.PI / 2;
    head.position.z = 1.9;
    arrow.add(shaft, head);
    arrow.position.copy(this.mesh.position).add(new THREE.Vector3(0, 4, 0));
    const dir = targetPos.clone().sub(arrow.position).normalize();
    arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    this.projectiles.push({ mesh: arrow, dir, speed: 88, type: 'arrow', damage: 72, lifetime: 3.0 });
    this.scene.add(arrow);
  }

  fireSpeargunBolt(targetPos) {
    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.02, 2.2, 8),
      new THREE.MeshStandardMaterial({ color: 0xd8edf0, metalness: 1, roughness: 0.08 }),
    );
    bolt.position.copy(this.mesh.position).add(new THREE.Vector3(0, 4.25, 0));
    const dir = targetPos.clone().sub(bolt.position).normalize();
    bolt.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    this.projectiles.push({ mesh: bolt, dir, speed: 118, type: 'speargun', damage: 88, lifetime: 2.4 });
    this.scene.add(bolt);
  }

  fireFeralBolt(targetPos) {
    const bolt = new THREE.Mesh(
      new THREE.ConeGeometry(0.11, 2.45, 8),
      new THREE.MeshStandardMaterial({ color: 0xe4d7b5, metalness: 0.84, roughness: 0.18 }),
    );
    bolt.position.copy(this.mesh.position).add(new THREE.Vector3(0, 4.15, 0));
    const dir = targetPos.clone().sub(bolt.position).normalize();
    bolt.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    this.projectiles.push({ mesh: bolt, dir, speed: 136, type: 'feral_bolt', damage: 78, lifetime: 2.2 });
    this.scene.add(bolt);
    return bolt;
  }

  fireWolfDualPlasma(targetPos) {
    const spawnPos = new THREE.Vector3();
    this.plasmacasterMesh.getWorldPosition(spawnPos);
    const shots = [];
    for (const offset of [-0.34, 0.34]) {
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.54, 14, 12), ShaderManager.createPlasmaMaterial());
      orb.position.copy(spawnPos).add(new THREE.Vector3(offset, 0, 0));
      const dir = targetPos.clone().sub(orb.position).normalize();
      dir.x += offset * 0.035;
      dir.normalize();
      const shot = { mesh: orb, dir, speed: 72, type: 'wolf_plasma', damage: 34, lifetime: 3 };
      this.projectiles.push(shot);
      shots.push(shot);
      this.scene.add(orb);
    }
    return shots;
  }

  fireEyeOfRa(targetPos) {
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 10), ShaderManager.createPlasmaMaterial());
    orb.position.copy(this.mesh.position).add(new THREE.Vector3(-1.45, 5, 0.4));
    const dir = targetPos.clone().sub(orb.position).normalize();
    this.projectiles.push({ mesh: orb, dir, speed: 90, type: 'eye_of_ra_plasma', damage: 68, lifetime: 2.8 });
    this.scene.add(orb);
    return orb;
  }

  fireWristRocket(targetPos) {
    const rocket = tagWeaponAssembly(new THREE.Group(), 'wrist_rocket');
    rocket.name = 'projectile:yautja_wrist_rocket';
    const shellMat = new THREE.MeshStandardMaterial({ color: 0x707b7b, metalness: 0.94, roughness: 0.2 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x263034, metalness: 0.88, roughness: 0.3 });
    const ignitionMat = new THREE.MeshBasicMaterial({ color: 0xff6b2e });
    const shell = tagWeaponPart(
      new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.18, 1.18, 12, 3), shellMat),
      'weapon:wrist_rocket_shell',
      'weapon_wrist_rocket_armored_shell',
    );
    shell.rotation.x = Math.PI / 2;
    rocket.add(shell);
    const nose = tagWeaponPart(
      new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.46, 12, 2), shellMat),
      'weapon:wrist_rocket_warhead',
      'weapon_wrist_rocket_warhead',
    );
    nose.position.z = 0.8;
    nose.rotation.x = Math.PI / 2;
    rocket.add(nose);
    for (const z of [-0.42, 0.1, 0.49]) {
      const band = tagWeaponPart(
        new THREE.Mesh(new THREE.TorusGeometry(z === 0.49 ? 0.13 : 0.16, 0.025, 7, 18), darkMat),
        `detail:wrist_rocket_reinforcement_${z}`,
        'weapon_wrist_rocket_reinforcement_band',
      );
      band.position.z = z;
      rocket.add(band);
    }
    for (let index = 0; index < 4; index += 1) {
      const angle = index * Math.PI / 2;
      const fin = tagWeaponPart(
        new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.28, 0.42, 1, 2, 2), darkMat),
        `weapon:wrist_rocket_fin_${index + 1}`,
        'weapon_wrist_rocket_guidance_fin',
      );
      fin.position.set(Math.cos(angle) * 0.17, Math.sin(angle) * 0.17, -0.5);
      fin.rotation.z = angle;
      rocket.add(fin);
    }
    const nozzle = tagWeaponPart(
      new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.17, 0.28, 12, 2), darkMat),
      'weapon:wrist_rocket_nozzle',
      'weapon_wrist_rocket_nozzle',
    );
    nozzle.position.z = -0.72;
    nozzle.rotation.x = Math.PI / 2;
    rocket.add(nozzle);
    const exhaust = tagWeaponPart(
      new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.55, 10, 2), ignitionMat),
      'vfx:wrist_rocket_exhaust',
      'weapon_wrist_rocket_exhaust',
    );
    exhaust.position.z = -1.02;
    exhaust.rotation.x = -Math.PI / 2;
    exhaust.userData.isVfx = true;
    rocket.add(exhaust);
    rocket.position.copy(this.mesh.position).add(new THREE.Vector3(-1.35, 4.2, 0.4));
    const dir = targetPos.clone().sub(rocket.position).normalize();
    rocket.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    this.projectiles.push({ mesh: rocket, dir, speed: 104, type: 'wrist_rocket', damage: 96, blastRadius: 7.5, lifetime: 2.8 });
    this.scene.add(rocket);
    return rocket;
  }

  triggerSelfDestruct() {
    if (this.isSelfDestructing || this.isDead || this.selfDestructComplete) return false;
    this.isSelfDestructing = true;
    this.selfDestructTimer = 4.0;
    if (typeof audioSynth?.playSelfDestructCoverOpen === 'function') {
      audioSynth.playSelfDestructCoverOpen();
    }
    return true;
  }

  takeDamage(amount) {
    if (this.isDead || this.selfDestructComplete) return { damage: 0, absorbed: 0 };
    const incoming = Math.max(0, Number(amount) || 0);
    let absorbed = 0;
    if (this.wristShieldActive && this.wristShieldIntegrity > 0) {
      const absorbRatio = Math.min(0.9, 0.68 + (this.wristShieldAbsorbBonus ?? 0));
      absorbed = Math.min(this.wristShieldIntegrity, incoming * absorbRatio);
      this.wristShieldIntegrity = Math.max(0, this.wristShieldIntegrity - absorbed);
      if (this.wristShieldIntegrity === 0) this.deactivateWristShield();
    }
    const damage = Math.max(0, incoming - absorbed);
    this.health = Math.max(0, this.health - damage);
    if (damage > 0) this.damageReactionTimer = Math.max(this.damageReactionTimer, 0.36);
    if (this.health <= 0 && !this.isSelfDestructing) {
      this.defeatReason = 'blessures';
      this.triggerSelfDestruct();
    }
    return { damage, absorbed, remainingHealth: this.health };
  }

  syncHonorRank() {
    if (this.lifetimeHonor >= 3000) this.honorRankIndex = 3;
    else if (this.lifetimeHonor >= 1800) this.honorRankIndex = 2;
    else if (this.lifetimeHonor >= 800) this.honorRankIndex = 1;
    else this.honorRankIndex = 0;
    return this.honorRankIndex;
  }

  addHonor(pts) {
    const awarded = calculateHonorAward(pts, this.isCloaked);
    this.honorScore += awarded;
    this.lifetimeHonor += awarded;
    this.syncHonorRank();
    return awarded;
  }

  resetForHunt(position = new THREE.Vector3(0, 0, 60)) {
    this.projectiles.forEach((projectile) => disposeObject3D(projectile.mesh));
    this.mines.forEach((mine) => disposeObject3D(mine.mesh));
    this.projectiles = [];
    this.mines = [];
    this.clearTransientGadgets();


    this.isAcidCorroded = false;
    if (this.isCloaked) this.toggleCloak();
    this.isBleeding = false;
    this.waterDisruptionTimer = 0;
    this.isSubmerged = false;
    this.medbayInventory = prepareFieldMedbayInventory(this.medbayInventory);
    this.health = this.maxHealth;
    this.energy = this.maxEnergy;
    this.stamina = this.maxStamina;
    this.isAttacking = false;
    this.isHealing = false;
    this.isPerched = false;
    this.attackTimer = 0;
    this.healTimer = 0;
    this.attackAnimationClock = 0;
    this.damageReactionTimer = 0;
    this.currentAnimationState = 'idle';
    this.wristbladeRight.position.z = this.wristbladeRestPositionZ;
    this.wristbladeLeft.position.z = this.wristbladeRestPositionZ;
    if (this.fatherSwordMesh) this.fatherSwordMesh.visible = false;
    this.currentPerchNode = null;
    this.inQTE = false;
    this.qteTimer = 0;
    this.acidTimer = 0;
    this.roarUsed = false;
    this.wristShieldTimer = 0;
    this.wristShieldCooldown = 0;
    this.wristShieldIntegrity = 100;
    this.scoutDroneTimer = 0;
    this.scoutDroneCooldown = 0;
    this.scoutDroneAge = 0;
    this.shurikenCooldown = 0;
    this.apexDecoyTimer = 0;
    this.apexDecoyCooldown = 0;
    this.apexDecoyAge = 0;
    this.clearCombatStatuses();
    this.apexDecoy = null;
    this.isSelfDestructing = false;
    this.selfDestructTimer = 0;
    this.selfDestructComplete = false;
    this.isDead = false;
    this.defeatReason = null;
    this.position.copy(position);
    this.mesh.position.copy(this.position);
    this.mesh.visible = true;
    if (this.mesh.userData) this.mesh.userData.animationState = 'idle';
  }

  resolvePlayerAnimationState(hasMovementInput, isSprinting) {
    if (this.isSelfDestructing) return 'self_destruct';
    if (this.damageReactionTimer > 0) return 'hit_reaction';
    if (this.isHealing) return 'heal';
    if (this.isAttacking) return 'attack';
    if (this.isPerched) return 'perched';
    if (hasMovementInput) return isSprinting ? 'sprint' : 'walk';
    return 'idle';
  }

  updatePlayerRigAnimation(delta, hasMovementInput, isSprinting) {
    if (!this.rigRoot || !this.leftArmRig || !this.rightArmRig || !this.leftLegRig || !this.rightLegRig) return 'idle';
    const state = this.resolvePlayerAnimationState(hasMovementInput, isSprinting);
    if (state !== this.currentAnimationState) {
      if (state === 'attack') this.attackAnimationClock = 0;
      this.currentAnimationState = state;
    }
    this.animationTime += delta;
    if (state === 'attack') this.attackAnimationClock += delta;
    const blend = 1 - Math.exp(-Math.max(0, delta) * (state === 'hit_reaction' ? 24 : 13));
    const gaitRate = state === 'sprint' ? 11.5 : state === 'walk' ? 7.2 : 2.1;
    const gaitAmplitude = state === 'sprint' ? 0.92 : state === 'walk' ? 0.58 : 0.035;
    const gait = Math.sin(this.animationTime * gaitRate);
    const oppositeGait = Math.sin(this.animationTime * gaitRate + Math.PI);
    const breath = Math.sin(this.animationTime * 2.05);
    const lerpRotation = (object, axis, target) => {
      if (object) object.rotation[axis] = THREE.MathUtils.lerp(object.rotation[axis], target, blend);
    };

    let pelvisY = HERO_PROPORTIONS.pelvisY;
    let pelvisPitch = 0;
    let pelvisYaw = 0;
    let torsoPitch = 0;
    let torsoYaw = 0;
    let torsoRoll = 0;
    let headPitch = 0;
    let headYaw = 0;
    let headRoll = 0;
    let leftShoulderPitch = -gait * gaitAmplitude * 0.58;
    let rightShoulderPitch = gait * gaitAmplitude * 0.58;
    let leftShoulderRoll = 0.08;
    let rightShoulderRoll = -0.08;
    let leftElbowPitch = -0.14;
    let rightElbowPitch = -0.14;
    let leftHipPitch = gait * gaitAmplitude;
    let rightHipPitch = oppositeGait * gaitAmplitude;
    let leftKneePitch = Math.max(0, -gait) * gaitAmplitude * 0.92;
    let rightKneePitch = Math.max(0, gait) * gaitAmplitude * 0.92;
    let leftAnklePitch = -leftKneePitch * 0.38;
    let rightAnklePitch = -rightKneePitch * 0.38;
    let casterPitch = -0.16;

    if (state === 'idle') {
      pelvisY += breath * 0.025;
      pelvisYaw = 0.015;
      torsoPitch = breath * 0.012;
      torsoRoll = 0.018;
      torsoYaw = -0.025 + Math.sin(this.animationTime * 0.54) * 0.018;
      headYaw = 0.035 + Math.sin(this.animationTime * 0.42) * 0.035;
      leftShoulderPitch = -0.06 + breath * 0.025;
      rightShoulderPitch = 0.06 - breath * 0.025;
      leftElbowPitch = -0.16;
      rightElbowPitch = -0.23;
      leftShoulderRoll = 0.06;
      rightShoulderRoll = -0.1;
    } else if (state === 'walk' || state === 'sprint') {
      const sprintFactor = state === 'sprint' ? 1 : 0.55;
      pelvisY += Math.abs(gait) * (0.09 + sprintFactor * 0.05);
      pelvisYaw = gait * 0.08 * sprintFactor;
      torsoPitch = state === 'sprint' ? -0.15 : -0.04;
      torsoYaw = -pelvisYaw * 0.7;
      headPitch = -torsoPitch * 0.55;
    } else if (state === 'attack') {
      const strike = Math.sin(Math.min(1, this.attackAnimationClock / 0.42) * Math.PI);
      torsoPitch = -0.12 * strike;
      torsoYaw = -0.42 * strike;
      pelvisYaw = 0.16 * strike;
      headYaw = 0.2 * strike;
      if ([2, 11, 12].includes(this.selectedWeapon)) {
        leftShoulderPitch = -1.12;
        leftShoulderRoll = 0.22;
        leftElbowPitch = -0.42;
        rightShoulderPitch = -0.2;
        casterPitch = -0.54;
      } else {
        rightShoulderPitch = -1.38 * strike;
        rightShoulderRoll = -0.22;
        rightElbowPitch = -0.72 * strike;
        leftShoulderPitch = -0.72 * strike;
        leftElbowPitch = -0.38 * strike;
      }
    } else if (state === 'hit_reaction') {
      const shock = Math.sin((0.36 - this.damageReactionTimer) * 24) * Math.min(1, this.damageReactionTimer * 4);
      torsoPitch = 0.22;
      torsoRoll = shock * 0.16;
      headPitch = -0.18;
      headRoll = -shock * 0.12;
      leftShoulderPitch = 0.38;
      rightShoulderPitch = 0.38;
      leftElbowPitch = -0.48;
      rightElbowPitch = -0.48;
    } else if (state === 'heal') {
      torsoPitch = -0.16;
      headPitch = 0.24;
      leftShoulderPitch = -1.08;
      rightShoulderPitch = -1.08;
      leftShoulderRoll = -0.32;
      rightShoulderRoll = 0.32;
      leftElbowPitch = -0.82;
      rightElbowPitch = -0.82;
    } else if (state === 'perched') {
      pelvisY = HERO_PROPORTIONS.pelvisY - 0.67;
      torsoPitch = -0.28;
      leftHipPitch = -0.62;
      rightHipPitch = -0.62;
      leftKneePitch = 1.28;
      rightKneePitch = 1.28;
      leftAnklePitch = -0.48;
      rightAnklePitch = -0.48;
      leftShoulderPitch = -0.34;
      rightShoulderPitch = -0.34;
    } else if (state === 'self_destruct') {
      const tremor = Math.sin(this.animationTime * 22) * 0.035;
      pelvisY = HERO_PROPORTIONS.pelvisY - 0.33 + tremor;
      torsoPitch = -0.48;
      headPitch = 0.42;
      leftShoulderPitch = -1.04;
      rightShoulderPitch = -1.04;
      leftElbowPitch = -0.72;
      rightElbowPitch = -0.72;
      leftHipPitch = -0.28;
      rightHipPitch = -0.28;
      leftKneePitch = 0.62;
      rightKneePitch = 0.62;
    }

    this.pelvisRig.position.y = THREE.MathUtils.lerp(this.pelvisRig.position.y, pelvisY, blend);
    lerpRotation(this.pelvisRig, 'x', pelvisPitch);
    lerpRotation(this.pelvisRig, 'y', pelvisYaw);
    lerpRotation(this.torsoRig, 'x', torsoPitch);
    lerpRotation(this.torsoRig, 'y', torsoYaw);
    lerpRotation(this.torsoRig, 'z', torsoRoll);
    lerpRotation(this.headRig, 'x', headPitch);
    lerpRotation(this.headRig, 'y', headYaw);
    lerpRotation(this.headRig, 'z', headRoll);
    lerpRotation(this.leftArmRig.shoulder, 'x', leftShoulderPitch);
    lerpRotation(this.leftArmRig.shoulder, 'z', leftShoulderRoll);
    lerpRotation(this.rightArmRig.shoulder, 'x', rightShoulderPitch);
    lerpRotation(this.rightArmRig.shoulder, 'z', rightShoulderRoll);
    lerpRotation(this.leftArmRig.elbow, 'x', leftElbowPitch);
    lerpRotation(this.rightArmRig.elbow, 'x', rightElbowPitch);
    lerpRotation(this.leftLegRig.hip, 'x', leftHipPitch);
    lerpRotation(this.rightLegRig.hip, 'x', rightHipPitch);
    lerpRotation(this.leftLegRig.knee, 'x', leftKneePitch);
    lerpRotation(this.rightLegRig.knee, 'x', rightKneePitch);
    lerpRotation(this.leftLegRig.ankle, 'x', leftAnklePitch);
    lerpRotation(this.rightLegRig.ankle, 'x', rightAnklePitch);
    lerpRotation(this.plasmacasterMesh, 'x', casterPitch);

    if (this.torsoBody) {
      const targetScaleY = 1.05 + (state === 'idle' ? breath * 0.012 : 0);
      this.torsoBody.scale.y = THREE.MathUtils.lerp(this.torsoBody.scale.y, targetScaleY, blend);
    }
    (this.dreadGroups ?? []).forEach((dread, index) => {
      const base = dread.userData.animationBaseRotation ?? dread.userData.baseRotation;
      if (!base) return;
      const phase = this.animationTime * (state === 'sprint' ? 9 : 4.2) + index * 0.47;
      const velocitySway = state === 'sprint' ? 0.24 : state === 'walk' ? 0.12 : 0.045;
      dread.rotation.x = THREE.MathUtils.lerp(
        dread.rotation.x,
        base.x + Math.sin(phase) * velocitySway + (state === 'sprint' ? 0.16 : 0),
        blend * 0.72,
      );
      dread.rotation.z = THREE.MathUtils.lerp(
        dread.rotation.z,
        base.z + Math.cos(phase * 0.83) * velocitySway * 0.55,
        blend * 0.72,
      );
    });

    const casterReadied = [2, 11, 12].includes(this.selectedWeapon);
    this.plasmacasterMesh.userData.aimState = casterReadied ? (state === 'attack' ? 'firing' : 'tracking') : 'stowed';
    for (const assembly of [this.wristbladeLeft, this.wristbladeRight]) {
      if (assembly) assembly.userData.deploymentState = this.selectedWeapon === 1 ? (state === 'attack' ? 'striking' : 'ready') : 'stowed';
    }
    this.mesh.userData.animationState = state;
    this.mesh.userData.animationClock = this.animationTime;
    this.syncAppearanceJointMounts();
    return state;
  }

  update(delta, inputDir, cameraYaw) {
    if (this.isDead) return;
    const hasMovementInput = inputDir.x !== 0 || inputDir.z !== 0;
    if (this.energy < this.maxEnergy) this.energy = Math.min(this.maxEnergy, this.energy + delta * this.energyRegen);
    if (this.stamina < this.maxStamina && !(inputDir.isSprinting && hasMovementInput)) this.stamina = Math.min(this.maxStamina, this.stamina + delta * 25.0);
    this.wristShieldCooldown = Math.max(0, this.wristShieldCooldown - delta);
    this.scoutDroneCooldown = Math.max(0, this.scoutDroneCooldown - delta);
    this.shurikenCooldown = Math.max(0, this.shurikenCooldown - delta);
    this.apexDecoyCooldown = Math.max(0, this.apexDecoyCooldown - delta);
    this.damageReactionTimer = Math.max(0, this.damageReactionTimer - delta);
    Object.keys(this.combatStatusTimers).forEach((status) => {
      this.combatStatusTimers[status] = Math.max(0, this.combatStatusTimers[status] - delta);
    });
    if (this.wristShieldActive) {
      this.wristShieldTimer = Math.max(0, this.wristShieldTimer - delta);
      if (this.wristShieldTimer === 0) this.deactivateWristShield();
    }
    if (this.scoutDrone) {
      this.scoutDroneTimer = Math.max(0, this.scoutDroneTimer - delta);
      this.scoutDroneAge += delta;
      this.scoutDrone.position.copy(this.position).add(new THREE.Vector3(Math.sin(this.scoutDroneAge * 1.8) * 4.2, 8 + Math.sin(this.scoutDroneAge * 3) * 0.45, Math.cos(this.scoutDroneAge * 1.8) * 4.2));
      this.scoutDrone.rotation.y += delta * 2.4;
      if (this.scoutDroneTimer === 0) {
        disposeObject3D(this.scoutDrone);
        this.scoutDrone = null;
      }
    }
    if (this.apexDecoy) {
      this.apexDecoyTimer = Math.max(0, this.apexDecoyTimer - delta);
      this.apexDecoyAge += delta;
      this.apexDecoy.rotation.y += delta * 0.85;
      const pulse = 0.56 + Math.sin(this.apexDecoyAge * 8) * 0.14;
      this.apexDecoy.traverse((child) => {
        if (child.isMesh && child.material?.transparent) child.material.opacity = pulse;
      });
      if (this.apexDecoyTimer === 0) {
        disposeObject3D(this.apexDecoy);
        this.apexDecoy = null;
      }
    }


    if (this.attackTimer > 0) {
      this.attackTimer = Math.max(0, this.attackTimer - delta);
      if (this.attackTimer === 0) {
        this.isAttacking = false;
        this.wristbladeRight.position.z = this.wristbladeRestPositionZ;
        this.wristbladeLeft.position.z = this.wristbladeRestPositionZ;
        if (this.fatherSwordMesh) this.fatherSwordMesh.visible = false;
      }
    }

    if (this.healTimer > 0) {
      this.healTimer = Math.max(0, this.healTimer - delta);
      if (this.healTimer === 0) {
        this.health = Math.min(this.maxHealth, this.health + 45);
        this.isHealing = false;
      }
    }

    if (this.inQTE) {
      this.qteTimer -= delta;
      if (this.qteTimer <= 0) this.resolveQTE(false);
    }

    if (this.isAcidCorroded) {
      this.acidTimer -= delta;
      this.takeDamage(delta * 4.0);
      if (this.acidTimer <= 0) this.isAcidCorroded = false;
    }

    if (this.medbayInventory) {
      updateMedbayCooldowns(this.medbayInventory, delta);
    }
    if (this.isBleeding) {
      this.takeDamage(delta * 1.5);
    }

    if (this.isCloaked) {
      this.energy = Math.max(0, this.energy - delta * 12.0);
      if (this.energy <= 0) this.toggleCloak();

      // L'immersion est fournie par un volume d'eau, jamais par l'altitude :
      // les sols secs des biomes peuvent se trouver sous le niveau y = 0.
      if (this.isSubmerged === true && !this.hasAntiAcidCloak && this.customization?.armorFinishId !== 'finish_cleaner_acid_resistant') {
        this.waterDisruptionTimer = (this.waterDisruptionTimer || 0) + delta;
        if (this.waterDisruptionTimer >= 2.0) {
          this.toggleCloak();
          this.waterDisruptionTimer = 0;
          if (typeof audioSynth?.playCloakShortCircuit === 'function') {
            audioSynth.playCloakShortCircuit();
          }
        }
      } else {
        this.waterDisruptionTimer = 0;
      }
    }

    if (this.isSelfDestructing) {
      const prevSecond = Math.floor(this.selfDestructTimer);
      this.selfDestructTimer -= delta;
      const currentSecond = Math.floor(this.selfDestructTimer);

      if (prevSecond !== currentSecond && this.selfDestructTimer > 0) {
        if (typeof audioSynth?.playSelfDestructAscendingHum === 'function') {
          audioSynth.playSelfDestructAscendingHum(this.selfDestructTimer / 4.0);
        }
      }

      if (this.selfDestructTimer <= 0) {
        this.isSelfDestructing = false;
        this.selfDestructComplete = true;
        this.isDead = true;
        this.health = 0;
        if (typeof audioSynth?.playSelfDestructDetonation === 'function') {
          audioSynth.playSelfDestructDetonation();
        } else {
          audioSynth.playExplosion();
        }
      }
    }

    let isSprintingForAnimation = false;
    if (!this.isHealing && !this.isSelfDestructing && !this.isPerched && !this.inQTE) {
      const sprintBlocked = this.combatStatusTimers.snare > 0 || this.combatStatusTimers.suppression > 0;
      const isSprinting = inputDir.isSprinting && hasMovementInput && this.stamina > 10 && !sprintBlocked;
      isSprintingForAnimation = isSprinting;
      const statusMultiplier = this.getCombatMovementMultiplier();
      const speed = (isSprinting ? this.sprintSpeed : this.moveSpeed) * statusMultiplier;
      if (isSprinting) this.stamina = Math.max(0, this.stamina - delta * 30.0);

      if (hasMovementInput) {
        const moveVector = new THREE.Vector3(inputDir.x, 0, inputDir.z).normalize();
        moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraYaw);
        if (this.combatStatusTimers.disorientation > 0) {
          const disorientationAngle = Math.sin(this.combatStatusTimers.disorientation * 7.5) * 0.55;
          moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), disorientationAngle);
        }

        this.position.addScaledVector(moveVector, speed * delta);

        // CLAMP PLAYER POSITION TO STAY WITHIN THE 800x800 TERRAIN ARENA!
        const movementBounds = Math.max(40, Number(this.movementBounds) || 330);
        this.position.x = Math.max(-movementBounds, Math.min(movementBounds, this.position.x));
        this.position.z = Math.max(-movementBounds, Math.min(movementBounds, this.position.z));

        const targetAngle = Math.atan2(moveVector.x, moveVector.z);
        let diff = targetAngle - this.mesh.rotation.y;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        this.mesh.rotation.y += diff * Math.min(1.0, delta * 14.0);
      }
    }

    this.updatePlayerRigAnimation(delta, hasMovementInput, isSprintingForAnimation);
    this.mesh.position.copy(this.position);

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      if (p.type === 'shuriken') p.mesh.rotation.z += delta * 15;
      if (p.type === 'disc') {
        p.mesh.rotation.z += delta * 24;
        if (p.lifetime < 1.8) {
          const catchPosition = this.position.clone().add(new THREE.Vector3(0, 3, 0));
          const returnOffset = catchPosition.sub(p.mesh.position);
          // Le guidage conserve la vitesse du disque et utilise le même point
          // pour viser et rattraper. Anticiper le prochain pas évite de le dépasser.
          if (returnOffset.length() <= Math.max(3, p.speed * delta)) {
            audioSynth.playYautjaClick?.();
            disposeObject3D(p.mesh);
            this.projectiles.splice(i, 1);
            continue;
          }
          p.dir.copy(returnOffset).normalize();
        }
      }
      p.mesh.position.addScaledVector(p.dir, p.speed * delta);
      p.lifetime -= delta;
      if (p.lifetime <= 0) {
        disposeObject3D(p.mesh);
        this.projectiles.splice(i, 1);
      }
    }
  }
}
