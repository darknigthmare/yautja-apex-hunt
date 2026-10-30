import * as THREE from 'three';
import { ShaderManager } from '../Shaders.js';
import { audioSynth } from '../AudioSynthesizer.js';
import { captureBaseMaterials, overrideMaterials, restoreBaseMaterials } from '../utils/materialState.js';
import { getRuntimeTexture } from '../utils/runtimeTextures.js';
import { forwardRayIntersectsSphere, resolveSegmentSphereImpact } from '../utils/projectileCollision.js';

export const VYDRACH_TEXTURES = Object.freeze({
  draconianScale: '/assets/textures/goliath-armored-hide.webp',
  wingMembrane: '/assets/textures/hive-biomechanical-membrane.webp',
  volcanicCrag: '/assets/textures/yautja-alloy.webp',
  boneCrest: '/assets/textures/trophy-bone.webp'
});

/**
 * Vy'drach de Yautja Prime - Léviathan Céleste Ailé (Fidélité 1:1 Canon Lore).
 * Colossale créature reptilienne ailée des déserts de Yautja Prime,
 * proie mythique du rite d'initiation suprême des Maîtres Chasseurs.
 */
export class VydrachBoss {
  constructor(scene) {
    if (!scene?.add) throw new TypeError('VydrachBoss requiert une scène THREE valide.');
    this.scene = scene;
    this.name = "Vy'drach — Léviathan Céleste de Yautja Prime";
    this.colliderRadius = 8.5;
    this.nativeHighDetail = true;

    // Vitals
    this.maxHealth = 3200;
    this.health = 3200;
    this.isDead = false;
    this.isEnraged = false;
    this.isNetted = false;
    this.netTimer = 0;

    // Monster Hunter Vitals: Stamina, Fatigue, Topple & Carving
    this.maxStamina = 1200;
    this.stamina = 1200;
    this.isExhausted = false;
    this.isToppled = false;
    this.toppleTimer = 0;
    this.isCarved = false;
    this.severedTailSpawned = false;
    this.severedTailMesh = null;

    // Breakable & Severable Body Parts
    this.crestIntact = true;
    this.leftWingIntact = true;
    this.rightWingIntact = true;
    this.tailIntact = true;
    this.coreExposed = false;

    this.crestHealth = 350;
    this.leftWingHealth = 400;
    this.rightWingHealth = 400;
    this.tailHealth = 450;

    // AI & Kinematics
    this.position = new THREE.Vector3(0, 0, -50);
    this.moveSpeed = 11.0;
    this.flightSpeed = 22.0;
    this.enragedSpeed = 26.0;

    this.aiState = 'roam'; // 'roam', 'stalk', 'flight_gale', 'aerial_dive', 'tail_whip', 'toppled', 'exhausted'
    this.attackCooldown = 0;
    this.footstepCooldown = 0;
    this.flappingCooldown = 0;
    this.roamPhase = 0;
    this.projectiles = [];

    // Mesh Creation
    this.mesh = this.createVydrachMesh();
    this.scene.add(this.mesh);
    captureBaseMaterials(this.mesh);

    // References to parts
    this.crestMesh = this.mesh.getObjectByName('vydrachCrest');
    this.leftWingMesh = this.mesh.getObjectByName('vydrachLeftWing');
    this.rightWingMesh = this.mesh.getObjectByName('vydrachRightWing');
    this.tailMesh = this.mesh.getObjectByName('vydrachTail');
    this.coreMesh = this.mesh.getObjectByName('vydrachThermalCore');

    // Materials
    this.normalMaterial = this.mesh.children[0].material;
    this.thermalMaterial = ShaderManager.createThermalMaterial(0xff7700, 0.95);

    // Visual detail contract tag
    this.mesh.userData.nativeHighDetail = true;
    this.mesh.userData.archetype = 'vydrach';
    this.mesh.userData.bossVisualArchetype = 'vydrach';
    this.mesh.userData.bossVisualDetail = { archetype: 'vydrach' };
    this.visualDetail = this.mesh;
  }

  createVydrachMesh() {
    const vydrachGroup = new THREE.Group();
    vydrachGroup.name = 'bossVisualDetail:vydrach';

    const scaleMat = new THREE.MeshStandardMaterial({
      color: 0x24180e,
      roughness: 0.5,
      metalness: 0.6
    });

    const membraneMat = new THREE.MeshStandardMaterial({
      color: 0x5a2008,
      roughness: 0.3,
      metalness: 0.2,
      side: THREE.DoubleSide
    });

    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xd4b886,
      roughness: 0.25,
      metalness: 0.1
    });

    const coreMat = new THREE.MeshBasicMaterial({ color: 0xff4400 });

    // 1. Massive Torso & Ribcage (Length 12m, Width 5m, Height 4.5m)
    const torsoGeo = new THREE.CylinderGeometry(2.4, 2.8, 11.5, 24, 6);
    torsoGeo.rotateX(Math.PI / 2);
    const torso = new THREE.Mesh(torsoGeo, scaleMat);
    torso.position.set(0, 5.5, 0);
    torso.castShadow = true;
    vydrachGroup.add(torso);

    // 2. Glowing Thermal Core
    const coreGeo = new THREE.SphereGeometry(1.6, 24, 20);
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.name = 'vydrachThermalCore';
    core.position.set(0, 4.2, 2.5);
    vydrachGroup.add(core);

    const coreLight = new THREE.PointLight(0xff5500, 4, 18);
    coreLight.position.set(0, 4.2, 2.5);
    vydrachGroup.add(coreLight);

    // 3. Serpentine Neck & Dragon Skull
    const neckGeo = new THREE.CylinderGeometry(1.4, 2.0, 5.5, 16);
    neckGeo.rotateX(Math.PI / 4);
    const neck = new THREE.Mesh(neckGeo, scaleMat);
    neck.position.set(0, 7.8, 6.2);
    neck.castShadow = true;
    vydrachGroup.add(neck);

    const skullGeo = new THREE.ConeGeometry(2.2, 5.2, 16);
    skullGeo.rotateX(Math.PI / 2);
    const skull = new THREE.Mesh(skullGeo, scaleMat);
    skull.position.set(0, 9.5, 8.8);
    skull.castShadow = true;
    vydrachGroup.add(skull);

    // 4. Horned Crest
    const crestGroup = new THREE.Group();
    crestGroup.name = 'vydrachCrest';
    for (let i = -1; i <= 1; i += 2) {
      const hornGeo = new THREE.ConeGeometry(0.5, 4.0, 16);
      hornGeo.rotateX(-Math.PI / 6);
      const horn = new THREE.Mesh(hornGeo, boneMat);
      horn.position.set(i * 1.5, 11.2, 7.8);
      horn.rotation.z = i * -0.25;
      crestGroup.add(horn);
    }
    vydrachGroup.add(crestGroup);

    // 5. Left & Right Colossal Wings (Wingspan 16m / 48 units)
    const leftWingGroup = new THREE.Group();
    leftWingGroup.name = 'vydrachLeftWing';
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.9, 8.5, 16), scaleMat);
    leftArm.rotation.z = Math.PI / 3;
    leftArm.position.set(4.2, 7.5, 1.0);
    leftWingGroup.add(leftArm);
    const leftMembrane = new THREE.Mesh(new THREE.PlaneGeometry(10.0, 7.0, 8, 6), membraneMat);
    leftMembrane.rotation.x = Math.PI / 2;
    leftMembrane.position.set(8.5, 8.0, 0);
    leftWingGroup.add(leftMembrane);
    vydrachGroup.add(leftWingGroup);

    const rightWingGroup = new THREE.Group();
    rightWingGroup.name = 'vydrachRightWing';
    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.9, 8.5, 16), scaleMat);
    rightArm.rotation.z = -Math.PI / 3;
    rightArm.position.set(-4.2, 7.5, 1.0);
    rightWingGroup.add(rightArm);
    const rightMembrane = new THREE.Mesh(new THREE.PlaneGeometry(10.0, 7.0, 8, 6), membraneMat);
    rightMembrane.rotation.x = Math.PI / 2;
    rightMembrane.position.set(-8.5, 8.0, 0);
    rightWingGroup.add(rightMembrane);
    vydrachGroup.add(rightWingGroup);

    // 6. Taloned Hind Limbs
    for (let side = -1; side <= 1; side += 2) {
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 5.0, 16), scaleMat);
      thigh.position.set(side * 3.5, 3.8, -2.5);
      vydrachGroup.add(thigh);
      const talon = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 2.5), boneMat);
      talon.position.set(side * 3.5, 0.4, -2.0);
      vydrachGroup.add(talon);
    }

    // 7. Spined Barbed Stinger Tail (Length 10m / 30 units)
    const tailGroup = new THREE.Group();
    tailGroup.name = 'vydrachTail';
    for (let i = 0; i < 5; i++) {
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.9 - i * 0.12, 1.1 - i * 0.12, 3.2, 16), scaleMat);
      seg.rotation.x = -Math.PI / 4;
      seg.position.set(0, 4.5 - i * 0.8, -6.5 - i * 2.4);
      tailGroup.add(seg);
    }
    const stinger = new THREE.Mesh(new THREE.ConeGeometry(0.9, 3.5, 16), boneMat);
    stinger.rotation.x = -Math.PI / 2;
    stinger.position.set(0, 0.8, -19.0);
    tailGroup.add(stinger);
    vydrachGroup.add(tailGroup);

    vydrachGroup.position.copy(this.position);
    return vydrachGroup;
  }

  getCoreWorldPosition() {
    this.mesh.updateWorldMatrix(true, true);
    return this.coreMesh?.getWorldPosition(new THREE.Vector3()) ?? this.mesh.localToWorld(new THREE.Vector3(0, 4.2, 2.5));
  }

  getCrestWorldPosition() {
    this.mesh.updateWorldMatrix(true, true);
    return this.crestMesh?.getWorldPosition(new THREE.Vector3()) ?? this.mesh.localToWorld(new THREE.Vector3(0, 11.2, 7.8));
  }

  getTailWorldPosition() {
    this.mesh.updateWorldMatrix(true, true);
    return this.tailMesh?.getWorldPosition(new THREE.Vector3()) ?? this.mesh.localToWorld(new THREE.Vector3(0, 1.5, -16.0));
  }

  getAimPoint() {
    if (this.coreExposed) return this.getCoreWorldPosition();
    return this.mesh.localToWorld(new THREE.Vector3(0, 5.5, 0));
  }

  spawnSeveredTail() {
    if (this.severedTailSpawned || !this.scene) return null;
    this.severedTailSpawned = true;
    const tailProp = new THREE.Group();
    tailProp.name = 'severed_vydrach_tail_carveable';
    const segMat = new THREE.MeshStandardMaterial({ color: 0x24180e, roughness: 0.5, metalness: 0.6 });
    const boneMat = new THREE.MeshStandardMaterial({ color: 0xd4b886, roughness: 0.25 });
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 3.8, 16), segMat);
    seg.rotation.x = Math.PI / 2;
    tailProp.add(seg);
    const stinger = new THREE.Mesh(new THREE.ConeGeometry(0.8, 3.2, 16), boneMat);
    stinger.rotation.x = -Math.PI / 2;
    stinger.position.set(0, 0, 2.8);
    tailProp.add(stinger);

    tailProp.position.copy(this.getTailWorldPosition());
    tailProp.position.y = 0.5;
    tailProp.userData.isCarveable = true;
    tailProp.userData.carved = false;
    tailProp.userData.trophyType = 'VYDRACH_SEVERED_BARBED_STINGER';
    this.scene.add(tailProp);
    this.severedTailMesh = tailProp;
    return tailProp;
  }

  triggerTopple(durationSeconds = 8.0) {
    if (this.isDead || this.isToppled) return;
    this.isToppled = true;
    this.toppleTimer = durationSeconds;
    this.aiState = 'toppled';
    audioSynth.playMonsterRoar();
  }

  setVisionMode(mode) {
    if (mode === 'thermal') {
      overrideMaterials(this.mesh, this.thermalMaterial, (child) => child.name !== 'vydrachThermalCore');
    } else {
      restoreBaseMaterials(this.mesh);
    }
  }


  resolveProjectileImpact(projectilePosition, projectileRadius = 1, previousPosition = projectilePosition) {
    if (!projectilePosition?.isVector3 || this.isDead) return null;
    const safeRadius = Math.max(0, Number(projectileRadius) || 0);
    const start = previousPosition?.isVector3 ? previousPosition : projectilePosition;

    // 1. Core Weakpoint
    const corePos = this.getCoreWorldPosition();
    if (
      resolveSegmentSphereImpact(start, projectilePosition, corePos, 4.0 + safeRadius)
      || forwardRayIntersectsSphere(start, projectilePosition, corePos, 4.0 + safeRadius)
    ) {
      return corePos;
    }

    // 2. Horned Crest / Head
    const crestPos = this.getCrestWorldPosition();
    if (
      resolveSegmentSphereImpact(start, projectilePosition, crestPos, 4.2 + safeRadius)
      || forwardRayIntersectsSphere(start, projectilePosition, crestPos, 4.2 + safeRadius)
    ) {
      return crestPos;
    }

    // 3. Barbed Tail Stinger
    if (this.tailIntact) {
      const tailPos = this.getTailWorldPosition();
      if (
        resolveSegmentSphereImpact(start, projectilePosition, tailPos, 5.0 + safeRadius)
        || forwardRayIntersectsSphere(start, projectilePosition, tailPos, 5.0 + safeRadius)
      ) {
        return tailPos;
      }
    }

    // 4. Main Torso / Wings
    const bodyCenter = this.getAimPoint();
    return resolveSegmentSphereImpact(start, projectilePosition, bodyCenter, this.colliderRadius + safeRadius);
  }

  takeDamage(amount, hitPosition) {
    if (this.isDead) return;

    let finalDamage = amount;
    const impact = hitPosition?.isVector3 ? hitPosition : this.position;

    // 1. Core Weakpoint check (x2.5 critical damage)
    const distToCore = impact.distanceTo(this.getCoreWorldPosition());
    if (distToCore < 4.0) {
      finalDamage *= 2.5;
      this.coreExposed = true;
    }

    // 2. Horned Crest Break check
    const distToCrest = impact.distanceTo(this.getCrestWorldPosition());
    if (distToCrest < 4.5 && this.crestIntact) {
      this.crestHealth -= amount;
      if (this.crestHealth <= 0) {
        this.crestIntact = false;
        if (this.crestMesh) this.crestMesh.visible = false;
        audioSynth.playMonsterRoar();
      }
    }

    // 3. Tail Sever check
    const distToTail = impact.distanceTo(this.getTailWorldPosition());
    if (distToTail < 5.8 && this.tailIntact) {
      this.tailHealth -= amount;
      if (this.tailHealth <= 0) {
        this.tailIntact = false;
        if (this.tailMesh) this.tailMesh.visible = false;
        this.spawnSeveredTail();
        audioSynth.playMonsterRoar();
      }
    }

    this.health = Math.max(0, this.health - finalDamage);

    // Enrage phase under 50% HP
    if (this.health <= this.maxHealth * 0.5 && !this.isEnraged) {
      this.isEnraged = true;
      audioSynth.playMonsterRoar();
    }

    if (this.health <= 0) {
      this.isDead = true;
      this.aiState = 'dead';
      audioSynth.playMonsterRoar();
    }
  }

  applyNet() {
    this.isNetted = true;
    this.netTimer = 4.0;
  }

  update(delta, playerPos, isPlayerCloaked) {
    if (this.isDead) return;

    if (this.isToppled) {
      this.toppleTimer -= delta;
      if (this.toppleTimer <= 0) {
        this.isToppled = false;
        this.aiState = 'chase';
      }
      return;
    }

    if (this.isNetted) {
      this.netTimer -= delta;
      if (this.netTimer <= 0) this.isNetted = false;
      return;
    }

    this.attackCooldown = Math.max(0, this.attackCooldown - delta);
    this.footstepCooldown = Math.max(0, this.footstepCooldown - delta);

    const distToPlayer = this.position.distanceTo(playerPos);
    const detectionRadius = isPlayerCloaked ? 30.0 : 220.0;

    if (distToPlayer < detectionRadius) {
      this.aiState = 'chase';
      const targetDir = playerPos.clone().sub(this.position).normalize();
      const targetAngle = Math.atan2(targetDir.x, targetDir.z);

      let diff = targetAngle - this.mesh.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      this.mesh.rotation.y += diff * Math.min(1.0, delta * 3.5);

      if (this.attackCooldown <= 0) {
        if (distToPlayer < 10.0) {
          this.aiState = 'tail_whip';
          audioSynth.playMonsterRoar();
          this.attackCooldown = 2.8;
        } else if (distToPlayer > 22.0 && distToPlayer < 55.0) {
          this.aiState = 'aerial_dive';
          audioSynth.playMonsterRoar();
          this.attackCooldown = 4.5;
        }
      }

      let speed = this.isEnraged ? this.enragedSpeed : this.moveSpeed;
      if (this.aiState === 'aerial_dive') speed *= 1.7;

      if (distToPlayer > 7.5) {
        this.position.addScaledVector(targetDir, speed * delta);
      }
    } else {
      this.aiState = 'roam';
      this.roamPhase += delta;
      this.position.z += Math.sin(this.roamPhase) * delta * 2.5;
    }

    const arenaBoundary = Math.max(50, Number(this.arenaBoundary) || 350);
    this.position.x = Math.max(-arenaBoundary, Math.min(arenaBoundary, this.position.x));
    this.position.z = Math.max(-arenaBoundary, Math.min(arenaBoundary, this.position.z));

    if (this.footstepCooldown === 0 && (this.aiState === 'chase' || this.aiState === 'aerial_dive')) {
      audioSynth.playMonsterFootstep();
      this.footstepCooldown = this.aiState === 'aerial_dive' ? 0.35 : 0.65;
    }

    this.mesh.position.copy(this.position);
  }

  dispose() {
    restoreBaseMaterials(this.mesh);
    this.thermalMaterial.dispose?.();
    if (this.severedTailMesh) {
      this.scene?.remove(this.severedTailMesh);
      this.severedTailMesh = null;
    }
  }
}
