import * as THREE from 'three';
import { audioSynth } from '../AudioSynthesizer.js';
import { getRuntimeTexture } from '../utils/runtimeTextures.js';
import { SuperPredatorBoss } from './SuperPredatorBoss.js';

export const UPGRADE_PREDATOR_TEXTURES = Object.freeze({
  bioArmor: '/assets/textures/stargazer-tactical-composite.webp',
  skin: '/assets/textures/yautja-skin-mottled.webp',
});

function addPart(parent, geometry, material, {
  name = '',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  visionExempt = false,
} = {}) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.visionExempt = visionExempt;
  parent.add(mesh);
  return mesh;
}

/**
 * Adaptation procédurale originale de l'Assassin Predator de 2018.
 * Le contrat privilégie trois lectures de combat : bio-armure destructible,
 * bond lourd télégraphié et glandes adaptatives qui régénèrent une réserve
 * limitée tant que le joueur ne les détruit pas.
 */
export class UpgradePredatorBoss extends SuperPredatorBoss {
  constructor(scene) {
    super(scene);

    this.mesh.name = 'upgradePredatorBoss';
    this.mesh.scale.setScalar(1.14);
    this.maxHealth = 3200;
    this.health = this.maxHealth;
    this.colliderRadius = 6.4;
    this.moveSpeed = 13.5;
    this.enragedSpeed = 20;
    this.chargeSpeed = 43;

    this.bioArmorMax = 980;
    this.bioArmorIntegrity = this.bioArmorMax;
    this.bioArmorIntact = true;
    this.glandIntegrity = 420;
    this.adaptiveGlandsIntact = true;
    this.regenerationBudget = 520;
    this.regeneratedHealth = 0;
    this.regenerationDelay = 0;

    this.leapCooldown = 3.8;
    this.leapTimer = 0;
    this.leapDuration = 0.82;
    this.leapDirection = new THREE.Vector3(0, 0, 1);
    this.leapStart = this.position.clone();
    this.leapTravelDistance = 0;

    this.bioArmorRoot = this.mesh.getObjectByName('upgradeBioArmor');
    this.exposedTissueRoot = this.mesh.getObjectByName('upgradeExposedTissue');
    this.adaptiveGlandRoot = this.mesh.getObjectByName('upgradeAdaptiveGlands');
    if (this.exposedTissueRoot) this.exposedTissueRoot.visible = false;

    this.mesh.userData.runtimeTexturePaths = Object.freeze(Object.values(UPGRADE_PREDATOR_TEXTURES));
    this.mesh.userData.combatIdentity = 'bio_armor_leap_regenerator';
  }

  createBossMesh() {
    const group = super.createBossMesh();
    group.name = 'upgradePredatorBoss';

    const armorTexture = getRuntimeTexture(UPGRADE_PREDATOR_TEXTURES.bioArmor, { repeat: [2.2, 2.2] });
    const skinTexture = getRuntimeTexture(UPGRADE_PREDATOR_TEXTURES.skin, { repeat: [1.7, 1.7] });
    const armor = new THREE.MeshStandardMaterial({
      color: 0x394249,
      map: armorTexture,
      roughness: 0.34,
      metalness: 0.68,
    });
    const ridge = new THREE.MeshStandardMaterial({
      color: 0x161c1d,
      map: skinTexture,
      roughness: 0.82,
      metalness: 0.08,
    });
    const tissue = new THREE.MeshStandardMaterial({
      color: 0x4b5b3d,
      map: skinTexture,
      roughness: 0.9,
      metalness: 0.02,
    });
    const gland = new THREE.MeshStandardMaterial({
      color: 0x79b45e,
      emissive: 0x315b24,
      emissiveIntensity: 1.15,
      roughness: 0.44,
      metalness: 0.12,
    });

    const armorRoot = new THREE.Group();
    armorRoot.name = 'upgradeBioArmor';
    addPart(armorRoot, new THREE.DodecahedronGeometry(2.9, 2), armor, {
      name: 'upgradeChestCarapace', position: [0, 6.35, -0.05], scale: [1.38, 0.74, 0.72],
    });
    addPart(armorRoot, new THREE.BoxGeometry(5.8, 0.72, 3.25, 5, 2, 3), armor, {
      name: 'upgradeCollarPlate', position: [0, 7.85, -0.12], rotation: [-0.05, 0, 0],
    });
    for (const side of [-1, 1]) {
      addPart(armorRoot, new THREE.SphereGeometry(1.55, 20, 14), armor, {
        name: `upgradeShoulderPlate${side < 0 ? 'L' : 'R'}`,
        position: [side * 3.35, 7.25, -0.02], scale: [1.26, 0.72, 1.12],
      });
      addPart(armorRoot, new THREE.BoxGeometry(1.5, 2.4, 1.7, 3, 4, 3), armor, {
        name: `upgradeForearmPlate${side < 0 ? 'L' : 'R'}`,
        position: [side * 3.28, 4.05, 0.38], rotation: [0.05, 0, side * 0.06],
      });
      addPart(armorRoot, new THREE.BoxGeometry(2.05, 2.75, 2.35, 4, 4, 3), armor, {
        name: `upgradeThighPlate${side < 0 ? 'L' : 'R'}`,
        position: [side * 1.42, 2.78, 0.08], rotation: [0, 0, side * 0.04],
      });
    }
    group.add(armorRoot);

    const exposedRoot = new THREE.Group();
    exposedRoot.name = 'upgradeExposedTissue';
    addPart(exposedRoot, new THREE.CapsuleGeometry(2.4, 3.5, 8, 16), tissue, {
      name: 'upgradeExposedTorso', position: [0, 5.7, -0.04], scale: [1.18, 0.92, 0.78],
    });
    group.add(exposedRoot);

    const glands = new THREE.Group();
    glands.name = 'upgradeAdaptiveGlands';
    for (const side of [-1, 1]) {
      addPart(glands, new THREE.SphereGeometry(0.58, 16, 12), gland, {
        name: `upgradeGland${side < 0 ? 'L' : 'R'}`,
        position: [side * 0.95, 6.15, 1.7], scale: [1, 1.22, 0.62], visionExempt: true,
      });
      for (let index = 0; index < 3; index += 1) {
        addPart(glands, new THREE.TorusGeometry(0.58 + index * 0.12, 0.055, 6, 18), gland, {
          position: [side * 0.95, 6.15, 1.72 + index * 0.03],
          rotation: [0, 0, index * 0.32], visionExempt: true,
        });
      }
    }
    group.add(glands);

    for (let index = 0; index < 9; index += 1) {
      const y = 2.2 + index * 0.72;
      addPart(group, new THREE.ConeGeometry(0.28 + index * 0.02, 1.35, 6), ridge, {
        name: `upgradeDorsalRidge${index + 1}`,
        position: [0, y, -1.55 - Math.sin(index * 0.6) * 0.12],
        rotation: [Math.PI / 2, 0, 0],
      });
    }

    return group;
  }

  breakBioArmor() {
    if (!this.bioArmorIntact) return false;
    this.bioArmorIntact = false;
    this.bioArmorIntegrity = 0;
    if (this.bioArmorRoot) this.bioArmorRoot.visible = false;
    if (this.exposedTissueRoot) this.exposedTissueRoot.visible = true;
    this.attackCooldown = Math.min(this.attackCooldown, 0.55);
    audioSynth.playMonsterRoar();
    return true;
  }

  breakAdaptiveGlands() {
    if (!this.adaptiveGlandsIntact) return false;
    this.adaptiveGlandsIntact = false;
    this.glandIntegrity = 0;
    this.regenerationBudget = 0;
    if (this.adaptiveGlandRoot) this.adaptiveGlandRoot.visible = false;
    audioSynth.playYautjaClick();
    return true;
  }

  takeDamage(amount, hitPosition = this.position) {
    if (this.isDead) return;
    const incoming = Math.max(0, Number(amount) || 0);
    if (incoming === 0) return;

    this.regenerationDelay = 4.2;
    let healthDamage = incoming;
    if (this.bioArmorIntact) {
      const absorbed = Math.min(incoming * 0.58, this.bioArmorIntegrity);
      this.bioArmorIntegrity = Math.max(0, this.bioArmorIntegrity - incoming * 1.35);
      healthDamage = incoming - absorbed;
      if (this.bioArmorIntegrity === 0) this.breakBioArmor();
    }

    const impact = hitPosition?.isVector3 ? hitPosition : this.position;
    const glandCenter = this.position.clone().add(new THREE.Vector3(0, 6.15, 1.7));
    if (this.adaptiveGlandsIntact && impact.distanceTo(glandCenter) <= 3.1) {
      this.glandIntegrity = Math.max(0, this.glandIntegrity - incoming * 1.45);
      if (this.glandIntegrity === 0) this.breakAdaptiveGlands();
    }

    super.takeDamage(healthDamage, hitPosition);
  }

  applyNet() {
    this.leapTimer = 0;
    this.mesh.position.y = 0;
    super.applyNet();
  }

  beginCrushingLeap(targetPosition) {
    if (!targetPosition?.isVector3 || this.leapTimer > 0 || this.isDead) return false;
    const direction = targetPosition.clone().sub(this.position);
    direction.y = 0;
    const distance = direction.length();
    if (distance < 11 || distance > 48) return false;

    this.leapDirection.copy(direction.normalize());
    this.leapTravelDistance = Math.min(31, Math.max(14, distance * 0.72));
    this.leapStart.copy(this.position);
    this.leapTimer = this.leapDuration;
    this.leapCooldown = this.isEnraged ? 3.2 : 4.6;
    this.attackTelegraphAnnounced = false;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.aiState = 'leap_crush';
    audioSynth.playMonsterFootstep();
    return true;
  }

  updateRegeneration(frameDelta) {
    this.regenerationDelay = Math.max(0, this.regenerationDelay - frameDelta);
    if (
      !this.adaptiveGlandsIntact
      || this.regenerationDelay > 0
      || this.regenerationBudget <= 0
      || this.health <= 0
      || this.health >= this.maxHealth * 0.62
    ) return 0;

    const healed = Math.min(
      this.regenerationBudget,
      frameDelta * (this.isEnraged ? 28 : 20),
      this.maxHealth * 0.62 - this.health,
    );
    this.health += healed;
    this.regenerationBudget -= healed;
    this.regeneratedHealth += healed;
    if (this.regenerationBudget <= 0.001) this.breakAdaptiveGlands();
    return healed;
  }

  update(delta, playerPosition, isPlayerCloaked = false) {
    if (this.isDead) return;
    const frameDelta = Math.max(0, Math.min(Number(delta) || 0, 0.2));
    this.leapCooldown = Math.max(0, this.leapCooldown - frameDelta);
    this.updateRegeneration(frameDelta);

    if (this.leapTimer > 0) {
      this.tickTransientState(frameDelta);
      const previousTimer = this.leapTimer;
      this.leapTimer = Math.max(0, this.leapTimer - frameDelta);
      const progress = 1 - this.leapTimer / this.leapDuration;
      this.position.copy(this.leapStart).addScaledVector(this.leapDirection, this.leapTravelDistance * progress);
      this.clampToArena();
      this.mesh.position.copy(this.position);
      this.mesh.position.y = Math.sin(progress * Math.PI) * 10.5;
      this.mesh.rotation.x = Math.sin(progress * Math.PI) * -0.18;
      this.aiState = 'leap_crush';
      if (previousTimer > 0 && this.leapTimer === 0) {
        this.mesh.position.y = 0;
        this.mesh.rotation.x = 0;
        this.aiState = 'leap_impact';
        this.attackImpactReady = true;
        this.attackImpactConsumed = false;
        this.attackCooldown = this.isEnraged ? 1 : 1.35;
      }
      return;
    }

    super.update(frameDelta, playerPosition, isPlayerCloaked);
    if (this.isDead || this.isNetted || !playerPosition?.isVector3) return;
    const distance = this.position.distanceTo(playerPosition);
    if (this.leapCooldown === 0 && distance >= 13 && distance <= 43) {
      this.beginCrushingLeap(playerPosition);
    }
  }
}

export default UpgradePredatorBoss;
