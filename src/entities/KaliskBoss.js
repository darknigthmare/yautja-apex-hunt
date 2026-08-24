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

export const KALISK_TEXTURES = Object.freeze({
  adaptiveHide: '/assets/textures/kalisk-adaptive-hide.webp',
});

const UP = new THREE.Vector3(0, 1, 0);

function loadBrowserTexture(path) {
  // TextureLoader dépend des primitives d'image du navigateur. Le matériau
  // procédural reste donc utilisable par les tests Node et les outils serveur.
  if (typeof document === 'undefined' || typeof document.createElementNS !== 'function') return null;

  try {
    const texture = new THREE.TextureLoader().load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.7, 1.35);
    return texture;
  } catch {
    return null;
  }
}

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

/**
 * Kalisk de Genna : boss quadrupède procédural basé sur la créature montrée
 * dans Predator: Badlands. Les mécaniques de chasse restent une adaptation
 * originale pour Apex Hunt, sans ajouter de biographie hors écran.
 */
export class KaliskBoss {
  constructor(scene) {
    if (!scene?.add) throw new TypeError('KaliskBoss requiert une scène THREE valide.');

    this.scene = scene;

    // Contrat runtime partagé par les cibles de chasse.
    this.maxHealth = 2550;
    this.health = this.maxHealth;
    this.isDead = false;
    this.isEnraged = false;
    this.isNetted = false;
    this.netTimer = 0;
    this.aiState = 'stalk';
    this.attackCooldown = 0;
    this.projectiles = [];
    this.colliderRadius = 7.4;

    // La carapace réduit les dégâts mais perd définitivement son intégrité.
    this.maxCarapaceIntegrity = 820;
    this.carapaceIntegrity = this.maxCarapaceIntegrity;
    this.carapaceIntact = true;
    this.coreExposed = false;
    this.phase = 1;

    // Deux poussées régénératrices au maximum, déclenchées aux changements de
    // phase et interrompues par une pression de dégâts suffisante.
    this.regenerationActive = false;
    this.regenerationTimer = 0;
    this.regenerationCooldown = 0;
    this.regenerationInterruptDamage = 0;
    this.regenerationInterruptThreshold = 135;
    this.regenerationUses = 0;
    this.maxRegenerationUses = 2;
    this.regenerationRequested = false;
    this.regenerationMilestones = new Set();

    this.position = new THREE.Vector3(0, 0, -58);
    this.moveSpeed = 10.5;
    this.enragedSpeed = 15.5;
    this.chargeSpeed = 34;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.attackTelegraphAnnounced = false;
    this.activeAttackType = null;
    this.attackStageTimer = 0;
    this.attackRecoveryTimer = 0;
    this.chargeDirection = new THREE.Vector3(0, 0, 1);
    this._disposed = false;

    this.adaptiveHideTexture = loadBrowserTexture(KALISK_TEXTURES.adaptiveHide);
    this.mesh = this.createBossMesh();
    this.group = this.mesh;
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);
    captureBaseMaterials(this.mesh);

    this.coreMesh = this.mesh.getObjectByName('kaliskRegenerativeCore');
    this.carapaceGroup = this.mesh.getObjectByName('kaliskAdaptiveCarapace');
    this.mandibleGroup = this.mesh.getObjectByName('kaliskImpalingMandibles');
    this.thermalMaterial = ShaderManager.createThermalMaterial(0xff5a28, 0.98);
    this.syncDamageVisuals();
  }

  createBossMesh() {
    const group = new THREE.Group();
    group.name = 'kaliskBoss';
    group.userData.silhouette = 'genna_regenerative_apex';
    group.userData.provenance = 'Predator: Badlands Kalisk reference; original procedural implementation';

    const hide = new THREE.MeshStandardMaterial({
      color: 0x173b3d,
      map: this.adaptiveHideTexture,
      roughness: 0.82,
      metalness: 0.08,
    });
    const underside = new THREE.MeshStandardMaterial({
      color: 0x302c27,
      map: this.adaptiveHideTexture,
      roughness: 0.94,
      metalness: 0.02,
    });
    const shell = new THREE.MeshStandardMaterial({
      color: 0x255e5a,
      map: this.adaptiveHideTexture,
      roughness: 0.58,
      metalness: 0.18,
    });
    const horn = new THREE.MeshStandardMaterial({
      color: 0x978b68,
      roughness: 0.74,
      metalness: 0.06,
    });
    const core = new THREE.MeshStandardMaterial({
      color: 0x6d1c78,
      emissive: 0x7d168d,
      emissiveIntensity: 2.3,
      roughness: 0.36,
      metalness: 0.03,
    });
    const eye = new THREE.MeshBasicMaterial({ color: 0xd8ff52 });

    // Masse basse et frontale : le Kalisk se lit immédiatement comme une
    // créature de charge et non comme un humanoïde Yautja.
    addMesh(group, new THREE.CapsuleGeometry(2.9, 7.4, 8, 14), hide, {
      name: 'kaliskTorso',
      position: [0, 5.2, -0.5],
      rotation: [Math.PI / 2, 0, 0],
      scale: [1.15, 1, 0.9],
    });
    addMesh(group, new THREE.SphereGeometry(2.55, 14, 10), underside, {
      name: 'kaliskHead',
      position: [0, 5.65, 4.9],
      scale: [1.12, 0.78, 1.3],
    });

    const carapace = new THREE.Group();
    carapace.name = 'kaliskAdaptiveCarapace';
    for (let index = 0; index < 7; index += 1) {
      const z = -4.25 + index * 1.35;
      const taper = 1 - Math.abs(index - 3) * 0.055;
      addMesh(carapace, new THREE.SphereGeometry(1.65, 10, 7, 0, Math.PI * 2, 0, Math.PI / 2), shell, {
        name: `kaliskCarapacePlate${index + 1}`,
        position: [0, 7.25 - Math.abs(index - 3) * 0.13, z],
        scale: [2.05 * taper, 0.58, 1.08],
      });
    }
    group.add(carapace);

    const regenerativeCore = addMesh(group, new THREE.SphereGeometry(1.05, 12, 9), core, {
      name: 'kaliskRegenerativeCore',
      position: [0, 6.75, -0.2],
      scale: [1.2, 0.52, 1.55],
      castShadow: false,
      visionExempt: true,
    });
    regenerativeCore.visible = false;

    // Quatre membres massifs, articulés en deux volumes afin de conserver une
    // silhouette lisible en vue de chasse à distance.
    for (const side of [-1, 1]) {
      for (const z of [-3.3, 2.7]) {
        const front = z > 0;
        addMesh(group, new THREE.CylinderGeometry(0.72, 0.96, front ? 4.8 : 4.25, 9), hide, {
          position: [side * 3.05, 3.7, z],
          rotation: [front ? -0.18 : 0.15, 0, side * (front ? 0.4 : 0.32)],
        });
        addMesh(group, new THREE.CylinderGeometry(0.54, 0.72, 3.55, 8), underside, {
          position: [side * 4.05, 1.45, z + (front ? 0.65 : -0.35)],
          rotation: [front ? -0.22 : 0.14, 0, side * -0.18],
        });
        for (let claw = -1; claw <= 1; claw += 1) {
          addMesh(group, new THREE.ConeGeometry(0.18, 0.9, 6), horn, {
            position: [side * (4.03 + claw * 0.2), 0.05, z + (front ? 1.15 : -0.72)],
            rotation: [Math.PI / 2, 0, 0],
          });
        }
      }
    }

    const mandibles = new THREE.Group();
    mandibles.name = 'kaliskImpalingMandibles';
    mandibles.position.set(0, 5.3, 6.3);
    for (const side of [-1, 1]) {
      addMesh(mandibles, new THREE.ConeGeometry(0.34, 3.2, 7), horn, {
        name: side < 0 ? 'kaliskMandibleLeft' : 'kaliskMandibleRight',
        position: [side * 1.2, -0.15, 1.25],
        rotation: [Math.PI / 2 - 0.16, 0, side * -0.18],
      });
      addMesh(group, new THREE.SphereGeometry(0.17, 8, 6), eye, {
        position: [side * 0.88, 6.22, 6.82],
        castShadow: false,
        visionExempt: true,
      });
    }
    group.add(mandibles);

    // Une queue lourde stabilise la lecture de la charge sans inventer une
    // arme ou une capacité supplémentaire.
    const tail = new THREE.Group();
    tail.name = 'kaliskTail';
    tail.position.set(0, 5.1, -5.2);
    for (let index = 0; index < 5; index += 1) {
      addMesh(tail, new THREE.ConeGeometry(1.2 - index * 0.18, 2.7, 8), index < 2 ? hide : underside, {
        position: [0, -index * 0.18, -index * 2.15],
        rotation: [-Math.PI / 2 - index * 0.035, 0, 0],
      });
    }
    group.add(tail);

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
  getCoreWorldPosition() {
    this.mesh.updateWorldMatrix(true, true);
    return this.coreMesh?.getWorldPosition(new THREE.Vector3())
      ?? this.mesh.localToWorld(new THREE.Vector3(0, 6.75, -0.2));
  }

  getAimPoint() {
    if (this.coreExposed) return this.getCoreWorldPosition();
    return this.mesh.localToWorld(new THREE.Vector3(0, 5.5, 0));
  }

  resolveProjectileImpact(projectilePosition, projectileRadius = 1, previousPosition = projectilePosition) {
    if (!projectilePosition?.isVector3 || this.isDead || this._disposed) return null;
    const safeRadius = Math.max(0, Number(projectileRadius) || 0);
    const start = previousPosition?.isVector3 ? previousPosition : projectilePosition;
    const bodyImpact = resolveSegmentSphereImpact(
      start,
      projectilePosition,
      this.position,
      this.colliderRadius + safeRadius,
    );

    if (this.coreExposed) {
      const corePosition = this.getCoreWorldPosition();
      const coreCrossed = resolveSegmentSphereImpact(
        start,
        projectilePosition,
        corePosition,
        3.4 + safeRadius,
      ) || (
        bodyImpact
        && forwardRayIntersectsSphere(start, projectilePosition, corePosition, 3.4 + safeRadius)
      );
      if (coreCrossed) return corePosition;
    }

    return bodyImpact;
  }

  updatePhase() {
    const healthRatio = this.maxHealth > 0 ? this.health / this.maxHealth : 0;
    const nextPhase = healthRatio > 0.67 ? 1 : healthRatio > 0.34 ? 2 : 3;
    if (nextPhase > this.phase && nextPhase <= 3 && !this.regenerationMilestones.has(nextPhase)) {
      this.regenerationMilestones.add(nextPhase);
      this.regenerationRequested = this.regenerationUses < this.maxRegenerationUses;
    }
    this.phase = nextPhase;
    this.isEnraged = this.phase === 3;
    if (this.phase === 3) this.coreExposed = true;
    this.syncDamageVisuals();
    return this.phase;
  }

  syncDamageVisuals() {
    if (this.coreMesh) this.coreMesh.visible = this.coreExposed && !this.isDead;
    if (this.carapaceGroup) {
      this.carapaceGroup.scale.y = this.carapaceIntact ? 1 : 0.72;
      this.carapaceGroup.rotation.z = this.carapaceIntact ? 0 : 0.035;
    }
  }

  exposeCore() {
    const changed = !this.coreExposed;
    this.coreExposed = true;
    this.carapaceIntact = false;
    this.carapaceIntegrity = 0;
    this.syncDamageVisuals();
    if (changed) audioSynth.playMonsterRoar();
    return changed;
  }

  takeDamage(amount, hitPosition = this.position) {
    if (this.isDead || this._disposed) {
      return {
        damage: 0,
        absorbed: 0,
        killed: this.isDead,
        remainingHealth: this.health,
      };
    }

    const incomingDamage = Math.max(0, Number(amount) || 0);
    if (incomingDamage === 0) {
      return { damage: 0, absorbed: 0, killed: false, remainingHealth: this.health };
    }

    const impact = hitPosition?.isVector3 ? hitPosition : this.position;
    const explicitCoreHit = this.coreExposed
      && impact.distanceTo(this.getCoreWorldPosition()) <= 3.4;

    let absorbed = 0;
    if (this.carapaceIntact && !explicitCoreHit) {
      const reduction = this.phase === 1 ? 0.48 : 0.34;
      absorbed = Math.min(this.carapaceIntegrity, incomingDamage * reduction);
      this.carapaceIntegrity = Math.max(0, this.carapaceIntegrity - absorbed);
      if (this.carapaceIntegrity === 0) this.exposeCore();
    }

    // Le noyau exposé récompense le ciblage sans rendre les autres impacts
    // inutiles. Il ne devient vulnérable qu'après la rupture ou en phase trois.
    const healthDamage = Math.max(0, incomingDamage - absorbed) * (explicitCoreHit ? 1.3 : 1);
    this.health = Math.max(0, this.health - healthDamage);

    let regenerationInterrupted = false;
    if (this.regenerationActive) {
      this.regenerationInterruptDamage += incomingDamage;
      if (this.regenerationInterruptDamage >= this.regenerationInterruptThreshold) {
        regenerationInterrupted = this.interruptRegeneration('damage');
      }
    }

    if (this.health === 0) {
      this.isDead = true;
      this.aiState = 'dead';
      this.activeAttackType = null;
      this.cancelAttack();
      this.stopRegeneration(0);
      this.regenerationRequested = false;
      this.projectiles.forEach(({ mesh }) => disposeObject3D(mesh));
      this.projectiles.splice(0);
      restoreBaseMaterials(this.mesh);
      if (this.coreMesh) this.coreMesh.visible = false;
      audioSynth.playMonsterRoar();
    } else {
      this.updatePhase();
      audioSynth.playAcidSizzle();
    }

    return {
      damage: healthDamage,
      absorbed,
      coreHit: explicitCoreHit,
      carapaceBroken: !this.carapaceIntact,
      regenerationInterrupted,
      killed: this.isDead,
      remainingHealth: this.health,
    };
  }

  startRegeneration(duration = 3.2) {
    if (
      this.isDead
      || this._disposed
      || this.isNetted
      || this.regenerationActive
      || this.regenerationCooldown > 0
      || this.regenerationUses >= this.maxRegenerationUses
      || this.health >= this.maxHealth
    ) {
      return false;
    }

    this.cancelAttack();
    this.regenerationActive = true;
    this.regenerationRequested = false;
    this.regenerationUses += 1;
    this.regenerationTimer = Math.max(0.4, Number(duration) || 3.2);
    this.regenerationInterruptDamage = 0;
    this.aiState = 'regeneration';
    this.activeAttackType = 'kalisk_regeneration';
    this.attackTelegraphAnnounced = false;
    audioSynth.playMedicompHeal();
    return true;
  }

  stopRegeneration(cooldown = 10) {
    if (!this.regenerationActive) return false;
    this.regenerationActive = false;
    this.regenerationTimer = 0;
    this.regenerationInterruptDamage = 0;
    this.regenerationCooldown = Math.max(this.regenerationCooldown, Math.max(0, Number(cooldown) || 0));
    if (!this.isDead && !this.isNetted) this.aiState = 'chase';
    this.activeAttackType = null;
    return true;
  }

  interruptRegeneration(reason = 'damage') {
    if (!this.regenerationActive) return false;
    const stopped = this.stopRegeneration(reason === 'net' ? 12 : 8);
    if (stopped && !this.isDead && !this.isNetted) this.aiState = 'regeneration_interrupted';
    return stopped;
  }

  updateRegeneration(delta) {
    if (!this.regenerationActive) return false;
    this.regenerationTimer = Math.max(0, this.regenerationTimer - delta);
    const phaseRate = this.phase === 3 ? 92 : 72;
    this.health = Math.min(this.maxHealth, this.health + phaseRate * delta);
    if (this.regenerationTimer === 0 || this.health === this.maxHealth) {
      this.stopRegeneration(11.5);
      this.updatePhase();
    }
    return this.regenerationActive;
  }

  applyNet() {
    if (this.isDead || this._disposed) return false;
    this.interruptRegeneration('net');
    this.cancelAttack();
    this.isNetted = true;
    this.netTimer = this.isEnraged ? 0.9 : 1.4;
    this.aiState = 'netted';
    this.activeAttackType = null;
    return true;
  }

  startChargeAttack(targetPosition) {
    if (!targetPosition?.isVector3 || this.isDead || this.isNetted || this.regenerationActive) return false;
    this.cancelAttack();
    this.chargeDirection.copy(targetPosition).sub(this.position);
    this.chargeDirection.y = 0;
    if (this.chargeDirection.lengthSq() <= 0.0001) this.chargeDirection.set(0, 0, 1);
    else this.chargeDirection.normalize();
    this.aiState = 'charge_windup';
    this.activeAttackType = 'kalisk_charge';
    this.attackStageTimer = this.isEnraged ? 0.46 : 0.64;
    this.attackTelegraphAnnounced = false;
    this.attackImpactConsumed = false;
    this.attackImpactReady = false;
    return true;
  }

  startImpaleAttack() {
    if (this.isDead || this.isNetted || this.regenerationActive) return false;
    this.cancelAttack();
    this.aiState = 'impale_windup';
    this.activeAttackType = 'kalisk_impale';
    this.attackStageTimer = this.isEnraged ? 0.34 : 0.48;
    this.attackTelegraphAnnounced = false;
    this.attackImpactConsumed = false;
    this.attackImpactReady = false;
    return true;
  }

  cancelAttack() {
    this.attackStageTimer = 0;
    this.attackRecoveryTimer = 0;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    if (this.activeAttackType === 'kalisk_charge' || this.activeAttackType === 'kalisk_impale') {
      this.activeAttackType = null;
    }
    if (this.mandibleGroup) this.mandibleGroup.rotation.x = 0;
  }

  consumeAttackImpact() {
    if (!this.attackImpactReady || this.attackImpactConsumed) return false;
    this.attackImpactConsumed = true;
    this.attackImpactReady = false;
    return true;
  }

  updateActiveAttack(delta) {
    if (!this.activeAttackType || this.regenerationActive) return false;

    if (this.aiState === 'charge_windup' || this.aiState === 'impale_windup') {
      this.attackStageTimer = Math.max(0, this.attackStageTimer - delta);
      this.attackTelegraphAnnounced = true;
      if (this.mandibleGroup) this.mandibleGroup.rotation.x = -0.18;
      if (this.attackStageTimer === 0) {
        if (this.activeAttackType === 'kalisk_charge') {
          this.aiState = 'charge';
          this.attackStageTimer = this.isEnraged ? 0.72 : 0.84;
          audioSynth.playMonsterFootstep();
        } else {
          this.aiState = 'impale';
          this.attackStageTimer = 0.24;
          audioSynth.playSpearThrow();
        }
      }
      return true;
    }

    if (this.aiState === 'charge') {
      this.attackStageTimer = Math.max(0, this.attackStageTimer - delta);
      this.position.addScaledVector(this.chargeDirection, this.chargeSpeed * (this.isEnraged ? 1.18 : 1) * delta);
      this.attackImpactReady = this.attackStageTimer <= 0.24 && this.attackStageTimer > 0 && !this.attackImpactConsumed;
      if (this.attackStageTimer === 0) this.beginAttackRecovery(0.48);
      return true;
    }

    if (this.aiState === 'impale') {
      this.attackStageTimer = Math.max(0, this.attackStageTimer - delta);
      this.attackImpactReady = this.attackStageTimer <= 0.08 && this.attackStageTimer > 0 && !this.attackImpactConsumed;
      if (this.mandibleGroup) this.mandibleGroup.rotation.x = 0.26;
      if (this.attackStageTimer === 0) this.beginAttackRecovery(0.4);
      return true;
    }

    if (this.aiState === 'attack_recovery') {
      this.attackRecoveryTimer = Math.max(0, this.attackRecoveryTimer - delta);
      if (this.attackRecoveryTimer === 0) {
        this.activeAttackType = null;
        this.attackImpactReady = false;
        this.attackImpactConsumed = false;
        this.aiState = 'chase';
        if (this.mandibleGroup) this.mandibleGroup.rotation.x = 0;
      }
      return true;
    }

    return false;
  }

  beginAttackRecovery(duration) {
    this.aiState = 'attack_recovery';
    this.attackStageTimer = 0;
    this.attackRecoveryTimer = Math.max(0.1, Number(duration) || 0.4);
    this.attackImpactReady = false;
    this.attackCooldown = Math.max(this.attackCooldown, this.isEnraged ? 1.1 : 1.55);
  }

  update(delta, playerPosition, isPlayerCloaked = false) {
    if (this.isDead || this._disposed) return;

    const frameDelta = Math.max(0, Math.min(Number(delta) || 0, 0.2));
    this.attackCooldown = Math.max(0, this.attackCooldown - frameDelta);
    this.regenerationCooldown = Math.max(0, this.regenerationCooldown - frameDelta);

    if (this.regenerationActive) {
      this.updateRegeneration(frameDelta);
      this.mesh.position.copy(this.position);
      return;
    }

    if (this.isNetted) {
      this.netTimer = Math.max(0, this.netTimer - frameDelta);
      if (this.netTimer === 0) {
        this.isNetted = false;
        this.aiState = 'stalk';
      }
      this.mesh.position.copy(this.position);
      return;
    }

    if (this.updateActiveAttack(frameDelta)) {
      this.clampToArena();
      this.mesh.position.copy(this.position);
      return;
    }

    if (this.regenerationRequested && this.regenerationCooldown === 0 && this.startRegeneration()) {
      this.mesh.position.copy(this.position);
      return;
    }

    if (!playerPosition?.isVector3) return;

    const targetDirection = playerPosition.clone().sub(this.position);
    targetDirection.y = 0;
    const distance = targetDirection.length();
    if (distance > 0.0001) targetDirection.normalize();

    const targetAngle = Math.atan2(targetDirection.x, targetDirection.z);
    let angleDifference = targetAngle - this.mesh.rotation.y;
    angleDifference = Math.atan2(Math.sin(angleDifference), Math.cos(angleDifference));
    this.mesh.rotation.y += angleDifference * Math.min(1, frameDelta * (this.isEnraged ? 6.2 : 4.8));

    this.attackImpactReady = false;
    const detectionRadius = isPlayerCloaked ? 28 : 150;
    if (distance > detectionRadius) {
      this.aiState = 'stalk';
      this.activeAttackType = null;
      this.mesh.position.copy(this.position);
      return;
    }

    this.aiState = 'chase';
    if (this.attackCooldown === 0) {
      if (distance <= 8.2) {
        this.startImpaleAttack();
      } else if (distance <= 31) {
        this.startChargeAttack(playerPosition);
      }
    }

    if (this.aiState === 'chase' && distance > 6.5) {
      this.position.addScaledVector(targetDirection, (this.isEnraged ? this.enragedSpeed : this.moveSpeed) * frameDelta);
    }

    this.clampToArena();
    this.mesh.position.copy(this.position);
  }

  clampToArena() {
    this.position.x = THREE.MathUtils.clamp(this.position.x, -325, 325);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -325, 325);
  }

  getHUDState() {
    const carapaceIntegrity = Math.max(0, Math.min(this.maxCarapaceIntegrity, this.carapaceIntegrity));
    return {
      phase: this.phase,
      health: Math.max(0, Math.min(this.maxHealth, this.health)),
      maxHealth: this.maxHealth,
      carapaceIntact: this.carapaceIntact,
      carapaceIntegrity,
      maxCarapaceIntegrity: this.maxCarapaceIntegrity,
      regenerationActive: this.regenerationActive,
      regenerationProgress: this.regenerationActive ? Math.max(0, Math.min(1, this.regenerationTimer / 3.2)) : 0,
      coreExposed: this.coreExposed,
    };
  }

  dispose() {
    if (this._disposed) return false;
    this._disposed = true;
    this.cancelAttack();
    this.stopRegeneration(0);
    this.projectiles.forEach(({ mesh }) => disposeObject3D(mesh));
    this.projectiles.splice(0);
    restoreBaseMaterials(this.mesh);
    this.thermalMaterial?.dispose?.();
    this.adaptiveHideTexture?.dispose?.();
    disposeObject3D(this.mesh);
    return true;
  }
}
