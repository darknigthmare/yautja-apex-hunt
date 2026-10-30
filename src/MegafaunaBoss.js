import * as THREE from 'three';
import { ShaderManager } from './Shaders.js';
import { audioSynth } from './AudioSynthesizer.js';
import { captureBaseMaterials, overrideMaterials, restoreBaseMaterials } from './utils/materialState.js';
import { getRuntimeTexture } from './utils/runtimeTextures.js';
import { forwardRayIntersectsSphere, resolveSegmentSphereImpact } from './utils/projectileCollision.js';

export class MegafaunaBoss {
  constructor(scene) {
    this.scene = scene;
    this.colliderRadius = 6.5;

    // Boss Vitals
    this.maxHealth = 1200;
    this.health = 1200;
    this.isEnraged = false;
    this.isDead = false;
    this.isNetted = false;
    this.netTimer = 0;

    // Breakable Body Parts Status
    this.hornIntact = true;
    this.tailIntact = true;
    this.hornHealth = 200;
    this.tailHealth = 250;
    this.coreExposed = false;

    // Monster Hunter Vitals: Stamina, Exhaustion, Topple & Carve
    this.maxStamina = 800;
    this.stamina = 800;
    this.isExhausted = false;
    this.isToppled = false;
    this.toppleTimer = 0;
    this.isCarved = false;
    this.severedTailSpawned = false;
    this.severedTailMesh = null;

    // AI & Combat Variables
    this.position = new THREE.Vector3(0, 0, -40);
    this.moveSpeed = 10.0;
    this.enragedSpeed = 17.0;

    this.aiState = 'roam'; // 'roam', 'chase', 'charge', 'attack_claw'
    this.attackCooldown = 0;
    this.footstepCooldown = 0;
    this.roamPhase = 0;

    // Create 3D Boss Mesh
    this.mesh = this.createBossMesh();
    this.scene.add(this.mesh);
    captureBaseMaterials(this.mesh);

    // References to breakable sub-meshes
    this.hornMesh = this.mesh.getObjectByName('hornMesh');
    this.tailMesh = this.mesh.getObjectByName('tailMesh');
    this.coreMesh = this.mesh.getObjectByName('coreMesh');

    // Thermal materials
    this.normalMaterial = this.mesh.children[0].material;
    this.thermalMaterial = ShaderManager.createThermalMaterial(0xff2200, 0.9);
  }

  createBossMesh() {
    const bossGroup = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1a1f28,
      map: getRuntimeTexture('/assets/textures/goliath-armored-hide.webp', { repeat: [2, 2] }),
      roughness: 0.6,
      metalness: 0.4
    });

    const coreMat = new THREE.MeshBasicMaterial({ color: 0xff3300 });
    const hornMat = new THREE.MeshStandardMaterial({ color: 0xccb580, roughness: 0.3 });

    const bodyGeo = new THREE.BoxGeometry(6, 4.5, 10, 4, 3, 5);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 4.5;
    body.castShadow = true;
    bossGroup.add(body);

    for (let i = 0; i < 5; i++) {
      const plateGeo = new THREE.ConeGeometry(1.5, 3, 16, 2);
      const plate = new THREE.Mesh(plateGeo, bodyMat);
      plate.rotation.x = -Math.PI / 4;
      plate.position.set(0, 7.5, -3.5 + i * 1.8);
      plate.castShadow = true;
      bossGroup.add(plate);
    }

    const coreGeo = new THREE.SphereGeometry(1.4, 32, 24);
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.name = 'coreMesh';
    core.position.set(0, 3.2, 3.5);
    bossGroup.add(core);

    const coreLight = new THREE.PointLight(0xff3300, 3, 15);
    coreLight.position.set(0, 3.2, 3.5);
    bossGroup.add(coreLight);

    const headGeo = new THREE.BoxGeometry(3.5, 3.2, 4.5, 3, 3, 3);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.set(0, 5.5, 6.5);
    head.castShadow = true;
    bossGroup.add(head);

    const hornGeo = new THREE.ConeGeometry(0.8, 4.5, 24, 4);
    const horn = new THREE.Mesh(hornGeo, hornMat);
    horn.name = 'hornMesh';
    horn.rotation.x = Math.PI / 3;
    horn.position.set(0, 7.8, 7.5);
    horn.castShadow = true;
    bossGroup.add(horn);

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 12), eyeMat);
    eyeR.position.set(1.2, 6.0, 8.5);
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 12), eyeMat);
    eyeL.position.set(-1.2, 6.0, 8.5);
    bossGroup.add(eyeR);
    bossGroup.add(eyeL);

    const legGeo = new THREE.CylinderGeometry(1.0, 1.2, 5.0, 24, 4);
    const legPositions = [
      [3.2, 2.5, 3.5], [-3.2, 2.5, 3.5],
      [3.2, 2.5, -3.5], [-3.2, 2.5, -3.5]
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, bodyMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      bossGroup.add(leg);
    });

    const tailGroup = new THREE.Group();
    tailGroup.name = 'tailMesh';

    for (let i = 0; i < 4; i++) {
      const segGeo = new THREE.CylinderGeometry(0.8 - i * 0.15, 1.0 - i * 0.15, 2.8, 24, 4);
      const seg = new THREE.Mesh(segGeo, bodyMat);
      seg.rotation.x = -Math.PI / 3;
      seg.position.set(0, 4.0 - i * 0.6, -6.0 - i * 2.2);
      seg.castShadow = true;
      tailGroup.add(seg);
    }
    const clubGeo = new THREE.OctahedronGeometry(1.6, 3);
    const club = new THREE.Mesh(clubGeo, bodyMat);
    club.position.set(0, 1.5, -14.5);
    tailGroup.add(club);

    bossGroup.add(tailGroup);

    bossGroup.position.copy(this.position);
    return bossGroup;
  }

  getCoreWorldPosition() {
    this.mesh.updateWorldMatrix(true, true);
    return this.coreMesh?.getWorldPosition(new THREE.Vector3()) ?? this.mesh.localToWorld(new THREE.Vector3(0, 3.2, 3.5));
  }

  getHornWorldPosition() {
    this.mesh.updateWorldMatrix(true, true);
    return this.hornMesh?.getWorldPosition(new THREE.Vector3()) ?? this.mesh.localToWorld(new THREE.Vector3(0, 7.8, 7.5));
  }

  getTailWorldPosition() {
    this.mesh.updateWorldMatrix(true, true);
    return this.tailMesh?.getWorldPosition(new THREE.Vector3()) ?? this.mesh.localToWorld(new THREE.Vector3(0, 2.0, -10.0));
  }

  getAimPoint() {
    if (this.coreExposed) return this.getCoreWorldPosition();
    return this.mesh.localToWorld(new THREE.Vector3(0, 4.5, 0));
  }

  spawnSeveredTail() {
    if (this.severedTailSpawned || !this.scene) return null;
    this.severedTailSpawned = true;
    const tailProp = new THREE.Group();
    tailProp.name = 'severed_megafauna_tail_carveable';
    const segGeo = new THREE.CylinderGeometry(0.7, 0.9, 3.2, 16);
    const mat = new THREE.MeshStandardMaterial({ color: 0x1a1f28, roughness: 0.6, metalness: 0.4 });
    const seg = new THREE.Mesh(segGeo, mat);
    seg.rotation.x = Math.PI / 2;
    tailProp.add(seg);
    const club = new THREE.Mesh(new THREE.OctahedronGeometry(1.5, 2), mat);
    club.position.set(0, 0, 2.2);
    tailProp.add(club);
    tailProp.position.copy(this.getTailWorldPosition());
    tailProp.position.y = 0.5;
    tailProp.userData.isCarveable = true;
    tailProp.userData.carved = false;
    tailProp.userData.trophyType = 'GOLIATH_SEVERED_TAIL_CLUB';
    this.scene.add(tailProp);
    this.severedTailMesh = tailProp;
    return tailProp;
  }

  triggerTopple(durationSeconds = 7.0) {
    if (this.isDead || this.isToppled) return;
    this.isToppled = true;
    this.toppleTimer = durationSeconds;
    this.aiState = 'toppled';
    audioSynth.playMonsterRoar();
  }

  setVisionMode(mode) {
    if (mode === 'thermal') {
      overrideMaterials(this.mesh, this.thermalMaterial, (child) => child.name !== 'coreMesh');
    } else {
      restoreBaseMaterials(this.mesh);
    }
  }


  resolveProjectileImpact(projectilePosition, projectileRadius = 1, previousPosition = projectilePosition) {
    if (!projectilePosition?.isVector3 || this.isDead) return null;
    const safeRadius = Math.max(0, Number(projectileRadius) || 0);
    const start = previousPosition?.isVector3 ? previousPosition : projectilePosition;

    // 1. Weakpoint: Core
    const corePos = this.getCoreWorldPosition();
    if (
      resolveSegmentSphereImpact(start, projectilePosition, corePos, 3.8 + safeRadius)
      || forwardRayIntersectsSphere(start, projectilePosition, corePos, 3.8 + safeRadius)
    ) {
      return corePos;
    }

    // 2. Horn / Head
    const hornPos = this.getHornWorldPosition();
    if (
      resolveSegmentSphereImpact(start, projectilePosition, hornPos, 4.2 + safeRadius)
      || forwardRayIntersectsSphere(start, projectilePosition, hornPos, 4.2 + safeRadius)
    ) {
      return hornPos;
    }

    // 3. Tail
    if (this.tailIntact) {
      const tailPos = this.getTailWorldPosition();
      if (
        resolveSegmentSphereImpact(start, projectilePosition, tailPos, 5.0 + safeRadius)
        || forwardRayIntersectsSphere(start, projectilePosition, tailPos, 5.0 + safeRadius)
      ) {
        return tailPos;
      }
    }

    // 4. Main Torso
    const bodyCenter = this.getAimPoint();
    return resolveSegmentSphereImpact(start, projectilePosition, bodyCenter, this.colliderRadius + safeRadius);
  }

  takeDamage(amount, hitPosition) {
    if (this.isDead) return;

    let finalDamage = amount;
    const impact = hitPosition?.isVector3 ? hitPosition : this.position;

    const legacyCore = this.mesh.position.clone().add(new THREE.Vector3(0, 3.2, 3.5));
    const distanceToCore = Math.min(
      impact.distanceTo(this.getCoreWorldPosition()),
      impact.distanceTo(legacyCore)
    );
    if (distanceToCore < 3.8) {
      finalDamage *= 2.5;
      this.coreExposed = true;
    }

    const legacyHead = this.mesh.position.clone().add(new THREE.Vector3(0, 7.8, 7.5));
    const distanceToHead = Math.min(
      impact.distanceTo(this.getHornWorldPosition()),
      impact.distanceTo(legacyHead)
    );
    if (distanceToHead < 4.2 && this.hornIntact) {
      this.hornHealth -= amount;
      if (this.hornHealth <= 0) {
        this.hornIntact = false;
        if (this.hornMesh) this.hornMesh.visible = false;
        audioSynth.playMonsterRoar();
      }
    }

    const legacyTail = this.mesh.position.clone().add(new THREE.Vector3(0, 2.0, -10.0));
    const distanceToTail = Math.min(
      impact.distanceTo(this.getTailWorldPosition()),
      impact.distanceTo(legacyTail)
    );
    if (distanceToTail < 5.2 && this.tailIntact) {
      this.tailHealth -= amount;
      if (this.tailHealth <= 0) {
        this.tailIntact = false;
        if (this.tailMesh) this.tailMesh.visible = false;
        this.spawnSeveredTail();
        audioSynth.playMonsterRoar();
      }
    }

    this.health = Math.max(0, this.health - finalDamage);

    if (this.health <= this.maxHealth * 0.5 && !this.isEnraged) {
      this.isEnraged = true;
      audioSynth.playMonsterRoar();
    }

    if (this.health <= 0) {
      this.isDead = true;
      audioSynth.playMonsterRoar();
    }
  }

  dispose() {
    restoreBaseMaterials(this.mesh);
    this.thermalMaterial.dispose?.();
  }

  applyNet() {
    this.isNetted = true;
    this.netTimer = 4.0;
  }

  update(delta, playerPos, isPlayerCloaked) {
    if (this.isDead) return;

    if (this.isNetted) {
      this.netTimer -= delta;
      if (this.netTimer <= 0) this.isNetted = false;
      return;
    }

    this.attackCooldown = Math.max(0, this.attackCooldown - delta);
    this.footstepCooldown = Math.max(0, this.footstepCooldown - delta);

    const distToPlayer = this.position.distanceTo(playerPos);
    let effectiveDetectionRadius = isPlayerCloaked ? 25.0 : 180.0;

    if (distToPlayer < effectiveDetectionRadius) {
      this.aiState = 'chase';
      
      const targetDir = playerPos.clone().sub(this.position).normalize();
      const targetAngle = Math.atan2(targetDir.x, targetDir.z);

      // Smooth turning without angle flipping
      let diff = targetAngle - this.mesh.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      this.mesh.rotation.y += diff * Math.min(1.0, delta * 4.0);

      if (this.attackCooldown <= 0) {
        if (distToPlayer < 9.0) {
          this.aiState = 'attack_claw';
          audioSynth.playMonsterRoar();
          this.attackCooldown = 2.5;
        } else if (distToPlayer > 20.0 && distToPlayer < 45.0) {
          this.aiState = 'charge';
          this.attackCooldown = 4.0;
        }
      }

      let speed = this.isEnraged ? this.enragedSpeed : this.moveSpeed;
      if (this.aiState === 'charge') speed *= 1.8;

      if (distToPlayer > 6.0) {
        this.position.addScaledVector(targetDir, speed * delta);
      }
    } else {
      this.aiState = 'roam';
      this.roamPhase += delta;
      this.position.z += Math.sin(this.roamPhase) * delta * 2.0;
    }

    const arenaBoundary = Math.max(40, Number(this.arenaBoundary) || 330);
    this.position.x = Math.max(-arenaBoundary, Math.min(arenaBoundary, this.position.x));
    this.position.z = Math.max(-arenaBoundary, Math.min(arenaBoundary, this.position.z));

    if (this.footstepCooldown === 0 && (this.aiState === 'chase' || this.aiState === 'charge')) {
      audioSynth.playMonsterFootstep();
      this.footstepCooldown = this.aiState === 'charge' ? 0.45 : 0.75;
    }

    this.mesh.position.copy(this.position);
  }
}
