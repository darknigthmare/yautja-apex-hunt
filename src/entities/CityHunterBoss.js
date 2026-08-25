import * as THREE from 'three';
import { audioSynth } from '../AudioSynthesizer.js';
import { ShaderManager } from '../Shaders.js';
import {
  captureBaseMaterials,
  disposeObject3D,
  overrideMaterials,
  restoreBaseMaterials,
} from '../utils/materialState.js';
import { forwardRayIntersectsSphere, resolveSegmentSphereImpact } from '../utils/projectileCollision.js';
import { getRuntimeTexture } from '../utils/runtimeTextures.js';

export const CITY_HUNTER_TEXTURES = Object.freeze({
  urbanHeatwave: '/assets/textures/los-angeles-heatwave-urban.webp',
  etchedAlloy: '/assets/textures/biomask-etched-alloy.webp',
  mottledSkin: '/assets/textures/yautja-skin-mottled.webp',
});

const UP = new THREE.Vector3(0, 1, 0);
const DISC_FORWARD = new THREE.Vector3(0, 0, 1);
const MASK_OFFSET = new THREE.Vector3(0, 9.28, 0.94);
const BODY_AIM_OFFSET = new THREE.Vector3(0, 4.6, 0);
const MASK_HIT_RADIUS = 2.45;

function addMesh(parent, geometry, material, {
  name = '',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  castShadow = true,
  visionExempt = false,
} = {}) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...scale);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  mesh.userData.visionExempt = visionExempt;
  parent.add(mesh);
  return mesh;
}

function makeTubeBetween(parent, start, end, radius, material, name = '') {
  const delta = end.clone().sub(start);
  const mesh = addMesh(parent, new THREE.CylinderGeometry(radius, radius * 1.08, delta.length(), 7), material, {
    name,
    position: start.clone().add(end).multiplyScalar(0.5).toArray(),
  });
  mesh.quaternion.setFromUnitVectors(UP, delta.normalize());
  return mesh;
}

const CITY_HUNTER_NATIVE_FEATURES = Object.freeze([
  'angular_biomask',
  'multispectral_rebreather',
  'returning_disc_netgun',
  'urban_medicomp_trophies',
]);

function countNativeTriangles(root) {
  let triangles = 0;
  root.traverse((object) => {
    if (!object.isMesh || !object.geometry) return;
    const { index, attributes } = object.geometry;
    triangles += index ? index.count / 3 : (attributes.position?.count ?? 0) / 3;
  });
  return Math.round(triangles);
}

function prepareNativeVisualDetail(root) {
  const detail = new THREE.Group();
  detail.name = 'bossVisualDetail:city_hunter';
  detail.renderOrder = 1;
  detail.userData.bossVisualDetail = true;
  detail.userData.archetype = 'city_hunter';
  detail.userData.featureTags = [...CITY_HUNTER_NATIVE_FEATURES];
  detail.userData.runtimeTexturePaths = Object.values(CITY_HUNTER_TEXTURES);

  const featureObjects = [
    ['cityHunterAngularMask', 'angular_biomask'],
    ['cityHunterRebreather', 'multispectral_rebreather'],
    ['cityHunterSpectralEmitter', 'multispectral_rebreather'],
    ['cityHunterSmartDiscHolster', 'returning_disc_netgun'],
    ['cityHunterNetgun', 'returning_disc_netgun'],
    ['cityHunterMedicomp', 'urban_medicomp_trophies'],
    ['cityHunterTrophyRack', 'urban_medicomp_trophies'],
  ];
  featureObjects.forEach(([name, featureTag]) => {
    const object = root.getObjectByName(name);
    if (object) object.userData.featureTag = featureTag;
  });

  [...root.children].forEach((child) => detail.add(child));
  detail.userData.triangleCount = countNativeTriangles(detail);
  root.add(detail);
  root.userData.bossVisualDetail = Object.freeze({
    archetype: 'city_hunter',
    featureTags: CITY_HUNTER_NATIVE_FEATURES,
    runtimeTexturePaths: Object.freeze([...detail.userData.runtimeTexturePaths]),
    triangleCount: detail.userData.triangleCount,
  });
  return detail;
}

/**
 * Rival urbain procédural original. Les volumes évoquent l'équipement montré
 * à l'écran dans Predator 2 (disque, lance-filet, respirateur et Medicomp),
 * sans reprendre de modèle, texture ou illustration officielle.
 */
export class CityHunterBoss {
  constructor(scene) {
    if (!scene?.add) throw new TypeError('CityHunterBoss requiert une scène THREE valide.');

    this.scene = scene;

    // Contrat BossFactory commun.
    this.maxHealth = 1680;
    this.health = this.maxHealth;
    this.isDead = false;
    this.isEnraged = false;
    this.isNetted = false;
    this.netTimer = 0;
    this.aiState = 'stalk';
    this.attackCooldown = 0;
    this.projectiles = [];
    this.colliderRadius = 5.1;

    this.position = new THREE.Vector3(0, 0, -54);
    this.moveSpeed = 14.5;
    this.enragedSpeed = 20.5;
    this.arenaBoundary = 330;
    this.activeAttackType = null;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.attackTelegraphAnnounced = false;
    this.meleeWindup = 0;
    this.attackPatternIndex = 0;

    // Le masque permet de distinguer une cible camouflée à moyenne portée.
    // Un tir précisément placé peut détruire cette capacité sans empêcher le
    // boss de terminer la chasse.
    this.maskIntact = true;
    this.maskIntegrity = 190;
    this.multispectralLock = false;
    this.cloakTrackingConfidence = 0;
    this.spectralMode = 'thermal';
    this.spectralScanTimer = 0;

    // Le Medicomp ne peut être utilisé qu'une fois. Il rend de la vie dans le
    // temps, afin qu'un impact reçu pendant le traitement puisse l'interrompre.
    this.medicompUsed = false;
    this.medicompActive = false;
    this.medicompInterrupted = false;
    this.medicompTimer = 0;
    this.medicompDuration = 4.2;
    this.medicompHealBudget = 390;
    this.medicompHealed = 0;

    this._disposed = false;
    this.textures = {
      urban: getRuntimeTexture(CITY_HUNTER_TEXTURES.urbanHeatwave, { repeat: [2.4, 2.4] }),
      alloy: getRuntimeTexture(CITY_HUNTER_TEXTURES.etchedAlloy, { repeat: [1.35, 1.35] }),
      skin: getRuntimeTexture(CITY_HUNTER_TEXTURES.mottledSkin, { repeat: [1.55, 1.55] }),
    };

    this.mesh = this.createBossMesh();
    this.visualDetail = prepareNativeVisualDetail(this.mesh);
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);
    captureBaseMaterials(this.mesh);

    this.maskMesh = this.mesh.getObjectByName('cityHunterAngularMask');
    this.revealedFaceMesh = this.mesh.getObjectByName('cityHunterRevealedFace');
    this.discHolsterMesh = this.mesh.getObjectByName('cityHunterSmartDiscHolster');
    this.netgunMesh = this.mesh.getObjectByName('cityHunterNetgun');
    this.medicompMesh = this.mesh.getObjectByName('cityHunterMedicomp');
    this.combistickMesh = this.mesh.getObjectByName('cityHunterCombistick');
    this.spectralEmitter = this.mesh.getObjectByName('cityHunterSpectralEmitter');
    this.thermalMaterial = ShaderManager.createThermalMaterial(0xff6c20, 0.95);
  }

  createBossMesh() {
    const group = new THREE.Group();
    group.name = 'cityHunterBoss';
    group.userData.silhouette = 'urban_disc_hunter';
    group.userData.combatIdentity = 'returning_disc_netgun_medicomp';
    group.userData.runtimeTexturePaths = Object.values(CITY_HUNTER_TEXTURES);

    const skin = new THREE.MeshStandardMaterial({
      color: 0x796f54,
      map: this.textures.skin,
      roughness: 0.83,
      metalness: 0.04,
    });
    const armor = new THREE.MeshStandardMaterial({
      color: 0x4e5148,
      map: this.textures.urban,
      roughness: 0.38,
      metalness: 0.78,
    });
    const darkArmor = new THREE.MeshStandardMaterial({
      color: 0x171c1a,
      map: this.textures.urban,
      roughness: 0.48,
      metalness: 0.72,
    });
    const maskAlloy = new THREE.MeshStandardMaterial({
      color: 0x777c73,
      map: this.textures.alloy,
      roughness: 0.25,
      metalness: 0.94,
    });
    const blade = new THREE.MeshStandardMaterial({
      color: 0xaabebc,
      roughness: 0.13,
      metalness: 1,
    });
    const leather = new THREE.MeshStandardMaterial({
      color: 0x17110e,
      roughness: 0.94,
      metalness: 0.04,
    });
    const trophyBone = new THREE.MeshStandardMaterial({
      color: 0xb9a379,
      roughness: 0.72,
      metalness: 0.08,
    });
    const spectralGlow = new THREE.MeshBasicMaterial({ color: 0xff2e1e });
    const medicompGlow = new THREE.MeshBasicMaterial({ color: 0x50ffb8 });

    // Corps athlétique et armure urbaine asymétrique, plus élancée que les
    // Super Predators afin que la cible reste identifiable à longue distance.
    // Les surfaces maîtresses emploient un maillage plus dense que les petits
    // accessoires : leur courbure reste ainsi nette en gros plan sans multiplier
    // les objets ni cacher de géométrie de remplissage.
    addMesh(group, new THREE.CapsuleGeometry(1.9, 4.45, 10, 20), skin, {
      name: 'cityHunterTorso',
      position: [0, 5.35, 0],
      scale: [1.13, 1, 0.77],
    });
    addMesh(group, new THREE.BoxGeometry(4.05, 2.65, 2.05, 3, 2, 2), armor, {
      name: 'cityHunterChestArmor',
      position: [-0.08, 6.35, 0.05],
      rotation: [-0.06, -0.04, 0.015],
    });
    for (let plate = 0; plate < 4; plate += 1) {
      addMesh(group, new THREE.BoxGeometry(3.45 - plate * 0.18, 0.38, 2.28, 2, 1, 2), darkArmor, {
        position: [0, 5.72 - plate * 0.48, 0.16 + plate * 0.035],
        rotation: [-0.04, 0, plate % 2 === 0 ? 0.018 : -0.018],
      });
    }
    addMesh(group, new THREE.CylinderGeometry(0.72, 0.95, 1.35, 11), skin, {
      position: [0, 8.12, 0],
    });
    addMesh(group, new THREE.SphereGeometry(1.08, 24, 18), skin, {
      name: 'cityHunterRevealedFace',
      position: [0, 9.18, 0.18],
      scale: [1.02, 1.12, 0.87],
    });

    // Masque original anguleux : front en coin, joues séparées, grille du
    // respirateur et capteur spectral indépendant de la matière thermique.
    const mask = new THREE.Group();
    mask.name = 'cityHunterAngularMask';
    mask.position.copy(MASK_OFFSET);
    addMesh(mask, new THREE.DodecahedronGeometry(1.12, 2), maskAlloy, {
      scale: [1.08, 1.02, 0.57],
    });
    addMesh(mask, new THREE.BoxGeometry(2.32, 0.35, 0.58, 3, 1, 2), darkArmor, {
      position: [0, 0.42, 0.44],
      rotation: [-0.08, 0, -0.025],
    });
    for (const side of [-1, 1]) {
      addMesh(mask, new THREE.ConeGeometry(0.56, 1.55, 5), maskAlloy, {
        position: [side * 0.64, -0.58, 0.38],
        rotation: [0.06, 0, side * 0.26],
        scale: [0.72, 1, 0.52],
      });
      addMesh(mask, new THREE.BoxGeometry(0.58, 0.18, 0.32), darkArmor, {
        position: [side * 0.44, -0.35, 0.68],
        rotation: [0, 0, side * 0.16],
      });
    }
    for (let vent = -2; vent <= 2; vent += 1) {
      addMesh(mask, new THREE.BoxGeometry(0.12, 0.62 - Math.abs(vent) * 0.06, 0.16), darkArmor, {
        position: [vent * 0.18, -0.55, 0.73],
        rotation: [0, 0, vent * 0.025],
      });
    }
    addMesh(mask, new THREE.SphereGeometry(0.125, 10, 8), spectralGlow, {
      name: 'cityHunterSpectralEmitter',
      position: [0.39, 0.3, 0.72],
      castShadow: false,
      visionExempt: true,
    });
    group.add(mask);

    // Respirateur à doubles capsules et tuyaux, visible même de profil.
    const rebreather = new THREE.Group();
    rebreather.name = 'cityHunterRebreather';
    rebreather.position.set(0, 8.25, 0.58);
    for (const side of [-1, 1]) {
      addMesh(rebreather, new THREE.CylinderGeometry(0.19, 0.23, 1.06, 12), darkArmor, {
        position: [side * 0.8, -0.02, 0],
        rotation: [0.2, 0, side * 0.12],
      });
      addMesh(rebreather, new THREE.TorusGeometry(0.42, 0.07, 8, 24, Math.PI * 1.25), armor, {
        position: [side * 0.5, -0.32, -0.25],
        rotation: [Math.PI / 2, side * 0.25, side > 0 ? 0.2 : Math.PI - 0.2],
      });
    }
    group.add(rebreather);

    // Predlocks nombreux et perlés pour conserver une couronne riche à
    // contre-jour, sans dépendre d'une texture alpha.
    for (let index = 0; index < 18; index += 1) {
      const angle = THREE.MathUtils.lerp(-1.45, 1.45, index / 17);
      const length = 3.75 + (index % 4) * 0.24;
      const dread = addMesh(group, new THREE.CylinderGeometry(0.105, 0.18, length, 10), leather, {
        name: `cityHunterPredlock${index + 1}`,
        position: [Math.sin(angle) * 1.12, 8.0 - Math.abs(angle) * 0.23, -0.68 - Math.cos(angle) * 0.18],
        rotation: [0.52 + Math.abs(angle) * 0.08, 0, -angle * 0.28],
      });
      if (index % 2 === 0) {
        addMesh(dread, new THREE.TorusGeometry(0.17, 0.042, 8, 16), armor, {
          position: [0, -length * 0.29, 0],
          rotation: [Math.PI / 2, 0, 0],
        });
      }
    }

    // Membres et armures segmentées.
    for (const side of [-1, 1]) {
      addMesh(group, new THREE.SphereGeometry(1.02, 20, 16), side < 0 ? armor : darkArmor, {
        position: [side * 2.48, 6.92, 0],
        scale: [1.25, 0.72, 1.05],
      });
      addMesh(group, new THREE.CylinderGeometry(0.48, 0.61, 3.25, 14), skin, {
        position: [side * 2.57, 5.08, 0.08],
        rotation: [0.04, 0, side * 0.08],
      });
      addMesh(group, new THREE.BoxGeometry(1.02, 1.2, 1.38, 2, 2, 2), darkArmor, {
        position: [side * 2.62, 3.72, 0.42],
      });
      addMesh(group, new THREE.CylinderGeometry(0.67, 0.84, 4.0, 16), skin, {
        position: [side * 1.02, 2.08, 0],
        rotation: [0, 0, side * 0.045],
      });
      addMesh(group, new THREE.BoxGeometry(1.42, 1.9, 1.76, 2, 2, 2), side < 0 ? darkArmor : armor, {
        position: [side * 1.02, 2.62, 0.12],
      });
      addMesh(group, new THREE.BoxGeometry(1.52, 0.64, 2.62, 2, 1, 2), darkArmor, {
        position: [side * 1.02, 0.34, 0.55],
      });
    }

    // Disque intelligent crénelé sur la hanche droite.
    const disc = new THREE.Group();
    disc.name = 'cityHunterSmartDiscHolster';
    disc.position.set(2.08, 4.12, -0.35);
    disc.rotation.set(0.12, 0.15, Math.PI / 2);
    addMesh(disc, new THREE.CylinderGeometry(0.93, 0.93, 0.18, 24), blade);
    addMesh(disc, new THREE.CylinderGeometry(0.32, 0.32, 0.24, 24), darkArmor);
    for (let tooth = 0; tooth < 8; tooth += 1) {
      const angle = (tooth / 8) * Math.PI * 2;
      addMesh(disc, new THREE.ConeGeometry(0.12, 0.42, 6), blade, {
        position: [Math.cos(angle) * 1.05, 0, Math.sin(angle) * 1.05],
        rotation: [0, -angle, Math.PI / 2],
      });
    }
    group.add(disc);

    // Lance-filet compact à chambre rotative sur l'avant-bras gauche.
    const netgun = new THREE.Group();
    netgun.name = 'cityHunterNetgun';
    netgun.position.set(-2.7, 3.78, 0.78);
    addMesh(netgun, new THREE.BoxGeometry(0.96, 0.72, 1.92, 2, 2, 3), darkArmor);
    for (const x of [-0.24, 0, 0.24]) {
      addMesh(netgun, new THREE.CylinderGeometry(0.09, 0.13, 1.25, 12), armor, {
        position: [x, 0.1, 1.25],
        rotation: [Math.PI / 2, 0, 0],
      });
    }
    group.add(netgun);

    // Medicomp de ceinture : cadran, réserve et injecteur sont séparés pour
    // rendre l'état de soin lisible depuis le gameplay.
    const medicomp = new THREE.Group();
    medicomp.name = 'cityHunterMedicomp';
    medicomp.position.set(-1.5, 4.02, 1.04);
    addMesh(medicomp, new THREE.BoxGeometry(1.22, 1.05, 0.5, 2, 2, 1), darkArmor);
    addMesh(medicomp, new THREE.CylinderGeometry(0.28, 0.28, 0.2, 18), medicompGlow, {
      name: 'cityHunterMedicompDial',
      position: [0.2, 0.13, 0.34],
      rotation: [Math.PI / 2, 0, 0],
      castShadow: false,
      visionExempt: true,
    });
    addMesh(medicomp, new THREE.CylinderGeometry(0.1, 0.14, 0.92, 8), blade, {
      name: 'cityHunterMedicompInjector',
      position: [-0.34, -0.08, 0.38],
      rotation: [0.12, 0, 0.18],
    });
    medicomp.visible = false;
    group.add(medicomp);

    // Combistick repliable porté en diagonale dans le dos.
    const combistick = new THREE.Group();
    combistick.name = 'cityHunterCombistick';
    combistick.position.set(1.35, 5.05, -1.25);
    combistick.rotation.set(-0.14, 0.18, -0.32);
    addMesh(combistick, new THREE.CylinderGeometry(0.1, 0.12, 6.1, 14), darkArmor);
    addMesh(combistick, new THREE.ConeGeometry(0.32, 1.12, 12), blade, { position: [0, 3.58, 0] });
    addMesh(combistick, new THREE.ConeGeometry(0.25, 0.82, 12), blade, {
      position: [0, -3.42, 0],
      rotation: [0, 0, Math.PI],
    });
    group.add(combistick);

    // Deux trophées de chasse et leurs attaches ancrent le récit sur le modèle.
    const trophyRack = new THREE.Group();
    trophyRack.name = 'cityHunterTrophyRack';
    trophyRack.position.set(0.5, 4.35, -1.15);
    for (const [index, side] of [-1, 1].entries()) {
      const skullPosition = new THREE.Vector3(side * 0.58, -index * 0.42, 0);
      addMesh(trophyRack, new THREE.SphereGeometry(0.35 - index * 0.04, 16, 12), trophyBone, {
        position: skullPosition.toArray(),
        scale: [0.8, 1, 0.72],
      });
      for (const jaw of [-1, 1]) {
        addMesh(trophyRack, new THREE.ConeGeometry(0.07, 0.38, 8), trophyBone, {
          position: [skullPosition.x + jaw * 0.18, skullPosition.y - 0.33, 0.06],
          rotation: [0, 0, jaw * 0.28],
        });
      }
      makeTubeBetween(
        trophyRack,
        new THREE.Vector3(0, 0.48, 0),
        skullPosition.clone().add(new THREE.Vector3(0, 0.27, 0)),
        0.035,
        leather,
      );
    }
    group.add(trophyRack);

    return group;
  }

  setVisionMode(mode) {
    if (this._disposed) return false;
    if (mode === 'thermal') {
      overrideMaterials(this.mesh, this.thermalMaterial, (child) => child.userData.visionExempt !== true);
    } else {
      restoreBaseMaterials(this.mesh);
    }
    return true;
  }

  get medicompAvailable() {
    return !this.medicompUsed;
  }

  getMaskWorldPosition() {
    this.mesh.updateWorldMatrix(true, true);
    return this.maskMesh?.getWorldPosition(new THREE.Vector3())
      ?? this.mesh.localToWorld(MASK_OFFSET.clone());
  }

  getAimPoint() {
    if (this.maskIntact) return this.getMaskWorldPosition();
    this.mesh.updateWorldMatrix(true, false);
    return this.mesh.localToWorld(BODY_AIM_OFFSET.clone());
  }

  resolveProjectileImpact(projectilePosition, projectileRadius = 1, previousPosition = projectilePosition) {
    if (!projectilePosition?.isVector3 || this.isDead || this._disposed) return null;
    const safeRadius = Math.max(0, Number(projectileRadius) || 0);
    const start = previousPosition?.isVector3 ? previousPosition : projectilePosition;
    const maskPosition = this.getMaskWorldPosition();
    const bodyImpact = resolveSegmentSphereImpact(
      start,
      projectilePosition,
      this.position,
      this.colliderRadius + safeRadius,
    );

    const maskCrossed = this.maskIntact && (
      resolveSegmentSphereImpact(
        start,
        projectilePosition,
        maskPosition,
        MASK_HIT_RADIUS + safeRadius,
      )
      || (
        bodyImpact
        && forwardRayIntersectsSphere(
          start,
          projectilePosition,
          maskPosition,
          MASK_HIT_RADIUS + safeRadius,
        )
      )
    );
    if (maskCrossed) return maskPosition;

    return bodyImpact;
  }

  breakMask() {
    if (!this.maskIntact) return false;
    this.maskIntact = false;
    this.maskIntegrity = 0;
    this.multispectralLock = false;
    this.cloakTrackingConfidence = 0;
    if (this.maskMesh) this.maskMesh.visible = false;
    if (this.revealedFaceMesh) this.revealedFaceMesh.scale.set(1.09, 1.12, 0.9);
    audioSynth.playYautjaClick();
    return true;
  }

  interruptMedicomp(reason = 'impact') {
    if (!this.medicompActive) return false;
    this.medicompActive = false;
    this.medicompInterrupted = true;
    this.medicompTimer = 0;
    this.aiState = reason === 'net' ? 'netted' : 'medicomp_interrupted';
    this.activeAttackType = null;
    if (this.medicompMesh) this.medicompMesh.visible = false;
    audioSynth.playYautjaClick();
    return true;
  }

  beginMedicomp() {
    if (this._disposed || this.isDead || this.isNetted || this.medicompUsed || this.health >= this.maxHealth) {
      return false;
    }
    this.medicompUsed = true;
    this.medicompActive = true;
    this.medicompInterrupted = false;
    this.medicompTimer = this.medicompDuration;
    this.medicompHealed = 0;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.aiState = 'medicomp';
    this.activeAttackType = 'medicomp_heal';
    this.attackCooldown = Math.max(this.attackCooldown, 1.25);
    if (this.medicompMesh) this.medicompMesh.visible = true;
    audioSynth.playYautjaClick();
    return true;
  }

  updateMedicomp(delta) {
    if (!this.medicompActive) return 0;
    const previousTimer = this.medicompTimer;
    this.medicompTimer = Math.max(0, this.medicompTimer - delta);

    // La première demi-seconde est le télégraphe durant lequel le joueur peut
    // interrompre le soin avant que la première injection ne soit appliquée.
    let healed = 0;
    if (previousTimer <= this.medicompDuration - 0.5) {
      const remainingBudget = Math.max(0, this.medicompHealBudget - this.medicompHealed);
      healed = Math.min(
        remainingBudget,
        this.maxHealth - this.health,
        (this.medicompHealBudget / (this.medicompDuration - 0.5)) * delta,
      );
      this.health += healed;
      this.medicompHealed += healed;
    }

    const dial = this.medicompMesh?.getObjectByName('cityHunterMedicompDial');
    if (dial) {
      const pulse = 0.85 + Math.sin((this.medicompDuration - this.medicompTimer) * 14) * 0.18;
      dial.scale.setScalar(pulse);
    }

    if (this.medicompTimer === 0 || this.medicompHealed >= this.medicompHealBudget || this.health >= this.maxHealth) {
      this.medicompActive = false;
      this.aiState = 'chase';
      this.activeAttackType = null;
      if (this.medicompMesh) this.medicompMesh.visible = false;
    }
    return healed;
  }

  takeDamage(amount, hitPosition = this.position) {
    if (this.isDead || this._disposed) {
      return { damage: 0, killed: this.isDead, remainingHealth: this.health };
    }
    const damage = Math.max(0, Number(amount) || 0);
    if (damage === 0) return { damage: 0, killed: false, remainingHealth: this.health };

    const medicompInterrupted = this.interruptMedicomp('impact');
    const impact = hitPosition?.isVector3 ? hitPosition : this.position;
    const maskPosition = this.getMaskWorldPosition();
    const maskHit = this.maskIntact && impact.distanceTo(maskPosition) <= MASK_HIT_RADIUS;
    if (maskHit) {
      this.maskIntegrity = Math.max(0, this.maskIntegrity - damage * 0.8);
      if (this.maskIntegrity === 0) this.breakMask();
    }

    this.health = Math.max(0, this.health - damage);
    if (!this.isEnraged && this.health <= this.maxHealth * 0.48) {
      this.isEnraged = true;
      this.attackCooldown = Math.min(this.attackCooldown, 0.3);
      audioSynth.playMonsterRoar();
    }

    if (this.health === 0) {
      this.isDead = true;
      this.aiState = 'dead';
      this.activeAttackType = null;
      this.meleeWindup = 0;
      this.attackImpactReady = false;
      this.attackImpactConsumed = true;
      this.medicompActive = false;
      if (this.medicompMesh) this.medicompMesh.visible = false;
      this.clearProjectiles();
      restoreBaseMaterials(this.mesh);
      audioSynth.playMonsterRoar();
    }

    return {
      damage,
      maskHit,
      maskBroken: !this.maskIntact,
      medicompInterrupted,
      killed: this.isDead,
      remainingHealth: this.health,
    };
  }

  applyNet() {
    if (this.isDead || this._disposed) return false;
    this.interruptMedicomp('net');
    this.isNetted = true;
    this.netTimer = this.isEnraged ? 1.15 : 2.2;
    this.meleeWindup = 0;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.aiState = 'netted';
    this.activeAttackType = null;
    return true;
  }

  consumeAttackImpact() {
    if (!this.attackImpactReady || this.attackImpactConsumed) return false;
    this.attackImpactConsumed = true;
    this.attackImpactReady = false;
    return true;
  }

  createSmartDiscMesh() {
    const disc = new THREE.Group();
    disc.name = 'cityHunterSmartDiscProjectile';
    disc.userData.isBossProjectile = true;
    disc.userData.projectileSignal = 'city_hunter_smart_disc';
    const alloy = new THREE.MeshStandardMaterial({ color: 0xa9c1be, roughness: 0.1, metalness: 1 });
    const core = new THREE.MeshBasicMaterial({ color: 0x65ffd1 });
    addMesh(disc, new THREE.CylinderGeometry(0.78, 0.78, 0.13, 12), alloy, {
      rotation: [Math.PI / 2, 0, 0],
    });
    addMesh(disc, new THREE.TorusGeometry(0.52, 0.09, 7, 18), core, {
      rotation: [Math.PI / 2, 0, 0],
      castShadow: false,
      visionExempt: true,
    });
    for (let tooth = 0; tooth < 8; tooth += 1) {
      const angle = (tooth / 8) * Math.PI * 2;
      addMesh(disc, new THREE.ConeGeometry(0.1, 0.32, 4), alloy, {
        position: [Math.cos(angle) * 0.88, Math.sin(angle) * 0.88, 0],
        rotation: [0, 0, angle - Math.PI / 2],
      });
    }
    return disc;
  }

  fireSmartDisc(targetPosition) {
    if (!targetPosition?.isVector3 || this.isDead || this._disposed) return null;
    const mesh = this.createSmartDiscMesh();
    mesh.position.copy(this.position).add(new THREE.Vector3(2.4, 4.7, 0.8));
    const direction = targetPosition.clone().add(new THREE.Vector3(0, 2.2, 0)).sub(mesh.position).normalize();
    mesh.quaternion.setFromUnitVectors(DISC_FORWARD, direction);
    const projectile = {
      mesh,
      dir: direction,
      speed: this.isEnraged ? 76 : 66,
      damage: this.isEnraged ? 54 : 44,
      lifetime: 4.8,
      outboundTimer: this.isEnraged ? 0.62 : 0.78,
      phase: 'outbound',
      ricochetCount: 0,
      maxRicochets: 2,
      type: 'smart_disc',
      signal: 'city_hunter_smart_disc',
    };
    this.projectiles.push(projectile);
    this.scene.add(mesh);
    if (this.discHolsterMesh) this.discHolsterMesh.visible = false;
    audioSynth.playSpearThrow();
    return projectile;
  }

  createNetProjectileMesh() {
    const projectile = new THREE.Group();
    projectile.name = 'cityHunterNetProjectile';
    projectile.userData.isBossProjectile = true;
    projectile.userData.projectileSignal = 'city_hunter_net';
    const cable = new THREE.MeshStandardMaterial({ color: 0x9da7a2, roughness: 0.35, metalness: 0.8 });
    const signal = new THREE.MeshBasicMaterial({ color: 0x78ffcb });
    for (let ring = 0; ring < 3; ring += 1) {
      addMesh(projectile, new THREE.TorusGeometry(0.3 + ring * 0.19, 0.035, 5, 14), cable, {
        position: [0, 0, ring * -0.18],
        castShadow: false,
      });
    }
    for (let spoke = 0; spoke < 6; spoke += 1) {
      const angle = (spoke / 6) * Math.PI * 2;
      addMesh(projectile, new THREE.CylinderGeometry(0.025, 0.025, 1.18, 5), cable, {
        position: [Math.cos(angle) * 0.2, Math.sin(angle) * 0.2, -0.19],
        rotation: [0, 0, -angle],
        castShadow: false,
      });
    }
    addMesh(projectile, new THREE.SphereGeometry(0.13, 8, 7), signal, {
      name: 'cityHunterNetSignal',
      position: [0, 0, -0.4],
      castShadow: false,
      visionExempt: true,
    });
    return projectile;
  }

  fireNetgun(targetPosition) {
    if (!targetPosition?.isVector3 || this.isDead || this._disposed) return null;
    const mesh = this.createNetProjectileMesh();
    mesh.position.copy(this.position).add(new THREE.Vector3(-2.55, 4.05, 1.7));
    const direction = targetPosition.clone().add(new THREE.Vector3(0, 1.8, 0)).sub(mesh.position).normalize();
    mesh.quaternion.setFromUnitVectors(DISC_FORWARD, direction);
    const projectile = {
      mesh,
      dir: direction,
      speed: this.isEnraged ? 59 : 51,
      damage: 10,
      lifetime: 3.2,
      type: 'netgun',
      signal: 'city_hunter_net',
      statusEffect: 'netted',
      statusDuration: this.isEnraged ? 3.4 : 2.8,
    };
    this.projectiles.push(projectile);
    this.scene.add(mesh);
    audioSynth.playSpearThrow();
    return projectile;
  }

  removeProjectile(index) {
    const [projectile] = this.projectiles.splice(index, 1);
    if (!projectile) return false;
    disposeObject3D(projectile.mesh);
    if (projectile.type === 'smart_disc' && this.discHolsterMesh && !this.isDead) {
      this.discHolsterMesh.visible = true;
    }
    return true;
  }

  updateSmartDisc(projectile, delta) {
    projectile.lifetime = Math.max(0, projectile.lifetime - delta);
    if (projectile.phase === 'outbound') {
      projectile.outboundTimer = Math.max(0, projectile.outboundTimer - delta);
      projectile.mesh.position.addScaledVector(projectile.dir, projectile.speed * delta);

      const boundary = Math.max(40, Number(this.arenaBoundary) || 330) - 1;
      const hitX = Math.abs(projectile.mesh.position.x) >= boundary;
      const hitZ = Math.abs(projectile.mesh.position.z) >= boundary;
      if ((hitX || hitZ) && projectile.ricochetCount < projectile.maxRicochets) {
        if (hitX) projectile.dir.x *= -1;
        if (hitZ) projectile.dir.z *= -1;
        projectile.ricochetCount += 1;
        projectile.outboundTimer = Math.min(projectile.outboundTimer + 0.16, 0.34);
      }
      if (projectile.outboundTimer === 0) projectile.phase = 'returning';
    } else {
      const catchPoint = this.position.clone().add(new THREE.Vector3(2.1, 4.35, 0));
      const toOwner = catchPoint.sub(projectile.mesh.position);
      if (toOwner.lengthSq() > 0.001) {
        const desiredDirection = toOwner.normalize();
        projectile.dir.lerp(desiredDirection, Math.min(1, delta * 9)).normalize();
      }
      projectile.speed = Math.min(94, projectile.speed + 18 * delta);
      projectile.mesh.position.addScaledVector(projectile.dir, projectile.speed * delta);
    }
    projectile.mesh.rotation.z += delta * 21;
  }

  updateProjectiles(delta) {
    for (let index = this.projectiles.length - 1; index >= 0; index -= 1) {
      const projectile = this.projectiles[index];
      if (projectile.type === 'smart_disc') {
        this.updateSmartDisc(projectile, delta);
        const catchPoint = this.position.clone().add(new THREE.Vector3(2.1, 4.35, 0));
        if (projectile.phase === 'returning' && projectile.mesh.position.distanceTo(catchPoint) <= 2.35) {
          this.removeProjectile(index);
          continue;
        }
      } else {
        projectile.mesh.position.addScaledVector(projectile.dir, projectile.speed * delta);
        projectile.mesh.rotation.z += delta * 8;
        projectile.lifetime = Math.max(0, projectile.lifetime - delta);
      }
      if (projectile.lifetime === 0) this.removeProjectile(index);
    }
  }

  clearProjectiles() {
    for (let index = this.projectiles.length - 1; index >= 0; index -= 1) this.removeProjectile(index);
  }

  tickTransientState(delta) {
    if (this.isDead || this._disposed) return false;
    const frameDelta = Math.max(0, Math.min(Number(delta) || 0, 0.2));
    this.updateProjectiles(frameDelta);
    this.updateMedicomp(frameDelta);
    return true;
  }

  updateSpectralTracking(delta, distance, isPlayerCloaked) {
    this.spectralScanTimer = Math.max(0, this.spectralScanTimer - delta);
    if (this.spectralScanTimer === 0) {
      this.spectralMode = this.spectralMode === 'thermal' ? 'ultraviolet' : 'thermal';
      this.spectralScanTimer = 1.35;
    }

    if (!isPlayerCloaked) {
      this.multispectralLock = distance <= 155;
      this.cloakTrackingConfidence = this.multispectralLock ? 1 : 0;
    } else {
      const spectralRadius = this.maskIntact ? 78 : 26;
      const inRange = distance <= spectralRadius;
      this.cloakTrackingConfidence = THREE.MathUtils.clamp(
        this.cloakTrackingConfidence + (inRange ? delta * 3.2 : -delta * 2.4),
        0,
        1,
      );
      this.multispectralLock = inRange && this.cloakTrackingConfidence >= 0.04;
    }

    if (this.spectralEmitter) {
      const scale = this.multispectralLock ? 1.42 : 0.92;
      this.spectralEmitter.scale.setScalar(scale);
    }
    return this.multispectralLock;
  }

  startCombistickAttack() {
    if (this.isDead || this.isNetted || this.medicompActive) return false;
    this.meleeWindup = this.isEnraged ? 0.24 : 0.38;
    this.aiState = 'combistick_windup';
    this.activeAttackType = 'combistick_sweep';
    this.attackTelegraphAnnounced = false;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.attackCooldown = this.isEnraged ? 1.05 : 1.5;
    audioSynth.playWristbladeSlash();
    return true;
  }

  updateMelee(delta) {
    if (this.meleeWindup <= 0) return false;
    this.meleeWindup = Math.max(0, this.meleeWindup - delta);
    if (this.combistickMesh) {
      this.combistickMesh.rotation.z = this.meleeWindup === 0 ? -1.15 : -0.32 + (0.38 - this.meleeWindup) * 0.55;
    }
    this.aiState = this.meleeWindup === 0 ? 'combistick' : 'combistick_windup';
    this.activeAttackType = 'combistick_sweep';
    this.attackImpactReady = this.meleeWindup === 0 && !this.attackImpactConsumed;
    return true;
  }

  update(delta, playerPosition, isPlayerCloaked = false) {
    if (this.isDead || this._disposed) return;
    const frameDelta = Math.max(0, Math.min(Number(delta) || 0, 0.2));
    this.tickTransientState(frameDelta);
    this.attackCooldown = Math.max(0, this.attackCooldown - frameDelta);

    if (this.isNetted) {
      this.netTimer = Math.max(0, this.netTimer - frameDelta);
      if (this.netTimer === 0) {
        this.isNetted = false;
        this.aiState = 'stalk';
      }
      return;
    }
    if (this.medicompActive) {
      this.aiState = 'medicomp';
      this.activeAttackType = 'medicomp_heal';
      this.mesh.position.copy(this.position);
      return;
    }
    if (!playerPosition?.isVector3) return;

    if (!this.medicompUsed && this.health <= this.maxHealth * 0.4 && this.beginMedicomp()) return;
    if (this.updateMelee(frameDelta)) return;

    const targetDirection = playerPosition.clone().sub(this.position);
    targetDirection.y = 0;
    const distance = targetDirection.length();
    if (distance > 0.0001) targetDirection.normalize();
    const detected = this.updateSpectralTracking(frameDelta, distance, Boolean(isPlayerCloaked));
    if (!detected) {
      this.aiState = isPlayerCloaked && this.maskIntact ? 'spectral_scan' : 'stalk';
      this.activeAttackType = null;
      return;
    }

    const targetAngle = Math.atan2(targetDirection.x, targetDirection.z);
    let angleDifference = targetAngle - this.mesh.rotation.y;
    angleDifference = Math.atan2(Math.sin(angleDifference), Math.cos(angleDifference));
    this.mesh.rotation.y += angleDifference * Math.min(1, frameDelta * (this.isEnraged ? 7.4 : 5.8));

    this.attackImpactReady = false;
    this.aiState = isPlayerCloaked ? 'spectral_track' : 'chase';
    this.activeAttackType = null;
    if (this.attackCooldown === 0) {
      if (distance <= 9.5) {
        this.startCombistickAttack();
      } else if (distance <= 118) {
        const action = this.attackPatternIndex % 3;
        if (action === 1 && distance <= 76) {
          this.fireNetgun(playerPosition);
          this.aiState = 'netgun';
          this.activeAttackType = 'netgun';
          this.attackCooldown = this.isEnraged ? 1.8 : 2.65;
        } else {
          this.fireSmartDisc(playerPosition);
          this.aiState = 'smart_disc';
          this.activeAttackType = 'returning_smart_disc';
          this.attackCooldown = this.isEnraged ? 1.55 : 2.35;
        }
        this.attackPatternIndex += 1;
      }
    }

    if ((this.aiState === 'chase' || this.aiState === 'spectral_track') && distance > 7.2) {
      this.position.addScaledVector(targetDirection, (this.isEnraged ? this.enragedSpeed : this.moveSpeed) * frameDelta);
    }
    this.clampToArena();
    this.mesh.position.copy(this.position);
  }

  clampToArena() {
    const boundary = Math.max(40, Number(this.arenaBoundary) || 330);
    this.position.x = THREE.MathUtils.clamp(this.position.x, -boundary, boundary);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -boundary, boundary);
  }

  dispose() {
    if (this._disposed) return false;
    this._disposed = true;
    this.medicompActive = false;
    this.clearProjectiles();
    restoreBaseMaterials(this.mesh);
    this.thermalMaterial?.dispose?.();
    disposeObject3D(this.mesh);
    return true;
  }
}

export default CityHunterBoss;
