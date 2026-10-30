import * as THREE from 'three';
import { ShaderManager } from '../Shaders.js';
import { audioSynth } from '../AudioSynthesizer.js';
import { captureBaseMaterials, overrideMaterials, restoreBaseMaterials } from '../utils/materialState.js';
import { getRuntimeTexture } from '../utils/runtimeTextures.js';
import { forwardRayIntersectsSphere, resolveSegmentSphereImpact } from '../utils/projectileCollision.js';

export const XENOMORPH_KING_TEXTURES = Object.freeze({
  chitinExoskeleton: '/assets/textures/hive-biomechanical-membrane.webp',
  boneCrest: '/assets/textures/trophy-bone.webp',
  acidicVeins: '/assets/textures/goliath-armored-hide.webp',
});

/**
 * Le Roi Xénomorphe / Rogue Titan (Fidélité 1:1 Canon Lore Dark Horse: Aliens Rogue 1993).
 * Titan bio-mécanique colosse mâle dominant créé par hybridation génétique,
 * dominant les reines par sa force brute colossale, sa crête en trident et son dard caudal double.
 */
export class XenomorphKingBoss {
  constructor(scene) {
    if (!scene?.add) throw new TypeError('XenomorphKingBoss requiert une scène THREE valide.');
    this.scene = scene;
    this.name = "Roi Xénomorphe — Rogue Titan Colossal";
    this.colliderRadius = 8.0;
    this.nativeHighDetail = true;

    // Boss Vitals
    this.maxHealth = 3400;
    this.health = 3400;
    this.isDead = false;
    this.isEnraged = false;
    this.isNetted = false;
    this.netTimer = 0;

    // Monster Hunter Vitals: Stamina, Fatigue, Topple & Carving
    this.maxStamina = 1350;
    this.stamina = 1350;
    this.isExhausted = false;
    this.isToppled = false;
    this.toppleTimer = 0;
    this.carved = false;
    this.severedTailMesh = null;

    // Breakable Anatomical Parts
    this.crownIntact = true;
    this.crownHealth = 420;
    this.ribcageIntact = true;
    this.ribcageHealth = 580;
    this.tailIntact = true;
    this.tailHealth = 480;
    this.coreExposed = false;

    // AI & Combat States
    this.aiState = 'stalk';
    this.attackCooldown = 0;
    this.roarCooldown = 0;
    this.projectiles = [];
    this.position = new THREE.Vector3(0, 0, -50);
    this.moveSpeed = 10.0;
    this.enragedSpeed = 15.0;
    this.leapSpeed = 28.0;

    this.initMesh();
    this.initMaterials();
  }

  initMesh() {
    this.mesh = new THREE.Group();
    this.mesh.name = 'xenomorphKingBossMesh';
    this.mesh.userData.nativeHighDetail = true;

    const chitinTex = getRuntimeTexture(XENOMORPH_KING_TEXTURES.chitinExoskeleton);
    const boneTex = getRuntimeTexture(XENOMORPH_KING_TEXTURES.boneCrest);

    const chitinMat = new THREE.MeshStandardMaterial({
      color: 0x111618,
      roughness: 0.28,
      metalness: 0.72,
      map: chitinTex,
    });

    const boneMat = new THREE.MeshStandardMaterial({
      color: 0x222a2e,
      roughness: 0.45,
      metalness: 0.55,
      map: boneTex,
    });

    // 1. Colossal Biomechanical Torso (8.5m standing posture)
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.4, 5.8, 16), chitinMat);
    torso.position.set(0, 5.2, 0);
    torso.castShadow = true;
    torso.receiveShadow = true;
    this.mesh.add(torso);
    this.torsoMesh = torso;

    // 2. Ribcage Armor Plating
    this.ribcageGroup = new THREE.Group();
    this.ribcageGroup.name = 'kingRibcageArmor';
    for (let r = 0; r < 5; r++) {
      const rib = new THREE.Mesh(new THREE.TorusGeometry(2.2 - r * 0.12, 0.22, 6, 16, Math.PI), chitinMat);
      rib.position.set(0, 6.4 - r * 0.7, 0.4);
      rib.rotation.x = Math.PI / 6;
      this.ribcageGroup.add(rib);
    }
    this.mesh.add(this.ribcageGroup);

    // 3. Acidic Royal Heart Core
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x88ff00,
      emissive: 0x44ff00,
      emissiveIntensity: 1.0,
      roughness: 0.35,
    });
    this.coreMesh = new THREE.Mesh(new THREE.SphereGeometry(1.15, 12, 12), coreMat);
    this.coreMesh.name = 'kingAcidHeartCore';
    this.coreMesh.position.set(0, 5.4, 0.3);
    this.coreMesh.visible = false;
    this.mesh.add(this.coreMesh);

    // 4. Gigantic Trident Horned Crown Crest (3 prongs)
    this.headGroup = new THREE.Group();
    this.headGroup.name = 'kingHeadGroup';
    this.headGroup.position.set(0, 7.8, 1.2);

    const skullDome = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.2, 4.2, 16), chitinMat);
    skullDome.rotation.x = Math.PI / 2.8;
    skullDome.position.set(0, 0.4, -1.2);
    this.headGroup.add(skullDome);

    // Trident Horned Crown
    this.crownMesh = new THREE.Group();
    this.crownMesh.name = 'kingTridentCrown';
    // Center Horn
    const centerHorn = new THREE.Mesh(new THREE.ConeGeometry(0.55, 3.2, 12), boneMat);
    centerHorn.position.set(0, 1.8, -2.6);
    centerHorn.rotation.x = -Math.PI / 4;
    this.crownMesh.add(centerHorn);

    // Left and Right Trident Prongs
    [-1, 1].forEach((side) => {
      const prong = new THREE.Mesh(new THREE.ConeGeometry(0.42, 2.6, 10), boneMat);
      prong.position.set(side * 1.6, 1.4, -2.2);
      prong.rotation.z = -side * (Math.PI / 5);
      prong.rotation.x = -Math.PI / 4.5;
      this.crownMesh.add(prong);
    });
    this.headGroup.add(this.crownMesh);

    // Pharyngeal Inner Jaw
    this.innerJaw = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.2, 1.8, 8), boneMat);
    this.innerJaw.rotation.x = Math.PI / 2;
    this.innerJaw.position.set(0, -0.4, 1.6);
    this.headGroup.add(this.innerJaw);

    this.mesh.add(this.headGroup);

    // 5. Muscular Digigrade Legs
    [-1, 1].forEach((side) => {
      const leg = new THREE.Group();
      leg.position.set(side * 2.0, 2.8, -0.5);

      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.5, 3.2, 12), chitinMat);
      thigh.rotation.x = Math.PI / 8;
      leg.add(thigh);

      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.35, 3.4, 12), chitinMat);
      shin.position.set(0, -2.2, 0.8);
      shin.rotation.x = -Math.PI / 6;
      leg.add(shin);

      this.mesh.add(leg);
    });

    // 6. Colossal Dual-Bladed Tail (12m reach)
    this.tailGroup = new THREE.Group();
    this.tailGroup.name = 'kingDualBladedTail';
    this.tailGroup.position.set(0, 3.8, -2.2);

    for (let t = 0; t < 6; t++) {
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.5 - t * 0.05, 0.45 - t * 0.05, 1.8, 10), chitinMat);
      seg.position.set(0, -t * 0.6, -t * 1.5);
      seg.rotation.x = -Math.PI / 3.8;
      this.tailGroup.add(seg);
    }

    // Dual Caudal Barbed Blades
    this.tailBlade = new THREE.Group();
    this.tailBlade.name = 'kingTailBarbedBlades';
    [-1, 1].forEach((side) => {
      const blade = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2.4, 6), boneMat);
      blade.position.set(side * 0.65, -3.8, -9.2);
      blade.rotation.x = -Math.PI / 2;
      blade.rotation.y = side * 0.2;
      this.tailBlade.add(blade);
    });
    this.tailGroup.add(this.tailBlade);
    this.mesh.add(this.tailGroup);

    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);
  }

  initMaterials() {
    this.thermalMaterial = ShaderManager?.createThermalMaterial?.() ?? new THREE.MeshBasicMaterial({ color: 0x88ff00 });
    captureBaseMaterials(this.mesh);
  }

  getCrownWorldPosition() {
    if (this.crownMesh) {
      return this.crownMesh.getWorldPosition(new THREE.Vector3());
    }
    return this.mesh.localToWorld(new THREE.Vector3(0, 9.5, -1.0));
  }

  getCoreWorldPosition() {
    if (this.coreMesh) {
      return this.coreMesh.getWorldPosition(new THREE.Vector3());
    }
    return this.mesh.localToWorld(new THREE.Vector3(0, 5.4, 0.3));
  }

  getTailWorldPosition() {
    if (this.tailBlade) {
      return this.tailBlade.getWorldPosition(new THREE.Vector3());
    }
    return this.mesh.localToWorld(new THREE.Vector3(0, 0.5, -11.0));
  }

  getHeadWorldPosition() {
    if (this.headGroup) {
      return this.headGroup.getWorldPosition(new THREE.Vector3());
    }
    return this.mesh.localToWorld(new THREE.Vector3(0, 7.8, 1.2));
  }

  getAimPoint() {
    if (this.coreExposed) return this.getCoreWorldPosition();
    if (this.crownIntact) return this.getCrownWorldPosition();
    return this.getHeadWorldPosition();
  }

  resolveProjectileImpact(projectilePosition, projectileRadius = 1, previousPosition = projectilePosition) {
    if (!projectilePosition?.isVector3 || this.isDead) return null;
    const safeRadius = Math.max(0, Number(projectileRadius) || 0);
    const start = previousPosition?.isVector3 ? previousPosition : projectilePosition;

    // 1. Weakpoint: Royal Acid Heart
    if (this.coreExposed) {
      const corePos = this.getCoreWorldPosition();
      if (
        resolveSegmentSphereImpact(start, projectilePosition, corePos, 3.4 + safeRadius)
        || forwardRayIntersectsSphere(start, projectilePosition, corePos, 3.4 + safeRadius)
      ) {
        return corePos;
      }
    }

    // 2. Trident Crown / Head
    const crownPos = this.getCrownWorldPosition();
    if (
      resolveSegmentSphereImpact(start, projectilePosition, crownPos, 4.0 + safeRadius)
      || forwardRayIntersectsSphere(start, projectilePosition, crownPos, 4.0 + safeRadius)
    ) {
      return crownPos;
    }

    // 3. Dual-Bladed Tail
    if (this.tailIntact) {
      const tailPos = this.getTailWorldPosition();
      if (
        resolveSegmentSphereImpact(start, projectilePosition, tailPos, 4.5 + safeRadius)
        || forwardRayIntersectsSphere(start, projectilePosition, tailPos, 4.5 + safeRadius)
      ) {
        return tailPos;
      }
    }

    // 4. Main Biomechanical Torso
    const bodyPos = this.mesh.localToWorld(new THREE.Vector3(0, 5.2, 0));
    return resolveSegmentSphereImpact(start, projectilePosition, bodyPos, this.colliderRadius + safeRadius);
  }

  spawnSeveredTail() {
    if (this.severedTailMesh) return this.severedTailMesh;
    const tailProp = new THREE.Group();
    tailProp.name = 'xenomorphKingSeveredTail';

    const chitinTex = getRuntimeTexture(XENOMORPH_KING_TEXTURES.chitinExoskeleton);
    const boneTex = getRuntimeTexture(XENOMORPH_KING_TEXTURES.boneCrest);
    const chitinMat = new THREE.MeshStandardMaterial({ color: 0x111618, roughness: 0.28, map: chitinTex });
    const boneMat = new THREE.MeshStandardMaterial({ color: 0x222a2e, roughness: 0.45, map: boneTex });

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.25, 4.2, 10), chitinMat);
    shaft.rotation.z = Math.PI / 2;
    tailProp.add(shaft);

    [-0.5, 0.5].forEach((offset) => {
      const blade = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2.2, 6), boneMat);
      blade.position.set(2.4, offset, 0);
      blade.rotation.z = -Math.PI / 2;
      tailProp.add(blade);
    });

    tailProp.position.copy(this.getTailWorldPosition());
    tailProp.position.y = 0.5;
    tailProp.userData.isCarveable = true;
    tailProp.userData.carved = false;
    tailProp.userData.trophyType = 'KING_SEVERED_DUAL_BLADES';
    this.scene.add(tailProp);
    this.severedTailMesh = tailProp;
    return tailProp;
  }

  triggerTopple(durationSeconds = 8.0) {
    if (this.isDead || this.isToppled) return;
    this.isToppled = true;
    this.toppleTimer = durationSeconds;
    this.aiState = 'toppled';
    audioSynth.playMonsterHunterRoar();
  }

  setVisionMode(mode) {
    if (mode === 'thermal') {
      overrideMaterials(this.mesh, this.thermalMaterial, (child) => child.name !== 'kingAcidHeartCore');
    } else {
      restoreBaseMaterials(this.mesh);
    }
  }

  takeDamage(amount, hitPosition) {
    if (this.isDead) return { damage: 0, killed: false, remainingHealth: this.health };

    let finalDamage = Math.max(0, Number(amount) || 0);
    const impact = hitPosition?.isVector3 ? hitPosition : this.position;

    // 1. Acid Heart Weakpoint hit (x2.8 critical damage)
    const distToCore = impact.distanceTo(this.getCoreWorldPosition());
    if (distToCore < 3.8 && this.coreExposed) {
      finalDamage *= 2.8;
    }

    // 2. Trident Crown Break Check
    const distToCrown = impact.distanceTo(this.getCrownWorldPosition());
    if (distToCrown < 4.2 && this.crownIntact) {
      this.crownHealth -= amount;
      if (this.crownHealth <= 0) {
        this.crownIntact = false;
        if (this.crownMesh) this.crownMesh.visible = false;
        audioSynth.playMonsterPartBreakCrunch();
        audioSynth.playMonsterHunterRoar();
      }
    }

    // 3. Ribcage Armor Plating Check
    if (this.ribcageIntact) {
      this.ribcageHealth -= amount;
      if (this.ribcageHealth <= 0) {
        this.ribcageIntact = false;
        this.coreExposed = true;
        if (this.coreMesh) this.coreMesh.visible = true;
        audioSynth.playMonsterPartBreakCrunch();
        audioSynth.playMonsterHunterRoar();
      } else {
        finalDamage *= 0.65;
      }
    }

    // 4. Dual Tail Sever Check
    const distToTail = impact.distanceTo(this.getTailWorldPosition());
    if (distToTail < 4.8 && this.tailIntact) {
      this.tailHealth -= amount;
      if (this.tailHealth <= 0) {
        this.tailIntact = false;
        if (this.tailGroup) this.tailGroup.visible = false;
        this.spawnSeveredTail();
        audioSynth.playMonsterTailSeverSwoosh();
        audioSynth.playMonsterHunterRoar();
      }
    }

    this.health = Math.max(0, this.health - finalDamage);

    // Enrage phase under 50% HP
    if (this.health <= this.maxHealth * 0.5 && !this.isEnraged) {
      this.isEnraged = true;
      audioSynth.playMonsterHunterRoar();
    }

    if (this.health <= 0) {
      this.isDead = true;
      this.aiState = 'dead';
      audioSynth.playMonsterHunterRoar();
    }

    return {
      damage: finalDamage,
      killed: this.isDead,
      remainingHealth: this.health,
    };
  }

  applyNet() {
    this.isNetted = true;
    this.netTimer = 3.2;
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
    this.roarCooldown = Math.max(0, this.roarCooldown - delta);

    // Monster Hunter Stamina Consumption
    if (this.aiState === 'leap_slam') {
      this.stamina = Math.max(0, this.stamina - delta * 40);
    } else {
      this.stamina = Math.max(0, this.stamina - delta * 15);
    }

    if (this.stamina <= 0 && !this.isExhausted) {
      this.isExhausted = true;
      audioSynth.playMonsterFatiguePant();
    } else if (this.stamina > 450 && this.isExhausted) {
      this.isExhausted = false;
    }

    const distToPlayer = playerPos ? this.position.distanceTo(playerPos) : 999;
    const detectionRadius = isPlayerCloaked ? 35.0 : 180.0;

    if (distToPlayer < detectionRadius && playerPos) {
      this.aiState = 'chase';
      const targetDir = playerPos.clone().sub(this.position).normalize();
      const targetAngle = Math.atan2(targetDir.x, targetDir.z);

      let diff = targetAngle - this.mesh.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      this.mesh.rotation.y += diff * Math.min(1.0, delta * 4.2);

      if (this.attackCooldown <= 0) {
        if (distToPlayer < 9.5) {
          this.aiState = 'cleave_swipe';
          audioSynth.playMonsterHunterRoar();
          this.attackCooldown = this.isExhausted ? 4.0 : 2.2;
        } else if (distToPlayer >= 16.0 && distToPlayer <= 50.0) {
          this.aiState = 'leap_slam';
          audioSynth.playMonsterHunterRoar();
          this.attackCooldown = this.isExhausted ? 5.2 : 3.5;
        }
      }

      let speed = this.isEnraged ? this.enragedSpeed : this.moveSpeed;
      if (this.isExhausted) speed *= 0.6;
      if (this.aiState === 'leap_slam') speed = this.leapSpeed;

      if (distToPlayer > 7.5) {
        this.position.addScaledVector(targetDir, speed * delta);
      }
    } else {
      this.aiState = 'stalk';
    }

    const arenaBoundary = Math.max(40, Number(this.arenaBoundary) || 320);
    this.position.x = Math.max(-arenaBoundary, Math.min(arenaBoundary, this.position.x));
    this.position.z = Math.max(-arenaBoundary, Math.min(arenaBoundary, this.position.z));

    this.mesh.position.copy(this.position);
  }

  dispose() {
    restoreBaseMaterials(this.mesh);
    this.thermalMaterial?.dispose?.();
    if (this.severedTailMesh) {
      this.scene.remove(this.severedTailMesh);
    }
    this.scene.remove(this.mesh);
  }
}
