import * as THREE from 'three';
import { ShaderManager } from '../Shaders.js';
import { audioSynth } from '../AudioSynthesizer.js';
import { captureBaseMaterials, overrideMaterials, restoreBaseMaterials } from '../utils/materialState.js';
import { getRuntimeTexture } from '../utils/runtimeTextures.js';
import { forwardRayIntersectsSphere, resolveSegmentSphereImpact } from '../utils/projectileCollision.js';

export const RHYNTH_TEXTURES = Object.freeze({
  rockHide: '/assets/textures/goliath-armored-hide.webp',
  boneHorn: '/assets/textures/trophy-bone.webp',
  carapacePlates: '/assets/textures/yautja-alloy.webp',
});

/**
 * Le Rhynth Titanesque de Ryushi — Béhémoth Quadrupède/Hexapode Blindé (Fidélité 1:1 Canon Lore AVP: Prey).
 * Animal colossal indigène des plaines arides de Ryushi, chassé traditionnellement
 * par le Clan de Dachande (Broken Tusk) comme épreuve de force ancestrale.
 */
export class RhynthBoss {
  constructor(scene) {
    if (!scene?.add) throw new TypeError('RhynthBoss requiert une scène THREE valide.');
    this.scene = scene;
    this.name = "Rhynth — Béhémoth Titanesque de Ryushi";
    this.colliderRadius = 7.8;
    this.nativeHighDetail = true;

    // Boss Vitals
    this.maxHealth = 2850;
    this.health = 2850;
    this.isDead = false;
    this.isEnraged = false;
    this.isNetted = false;
    this.netTimer = 0;

    // Monster Hunter Vitals: Stamina, Fatigue, Topple & Carving
    this.maxStamina = 1100;
    this.stamina = 1100;
    this.isExhausted = false;
    this.isToppled = false;
    this.toppleTimer = 0;
    this.carved = false;
    this.severedTailMesh = null;

    // Breakable Anatomical Parts
    this.hornIntact = true;
    this.hornHealth = 380;
    this.armorPlatesIntact = true;
    this.armorPlatesHealth = 520;
    this.tailIntact = true;
    this.tailHealth = 440;
    this.coreExposed = false;

    // AI & Combat States
    this.aiState = 'graze';
    this.attackCooldown = 0;
    this.stompCooldown = 0;
    this.projectiles = [];
    this.position = new THREE.Vector3(0, 0, -45);
    this.moveSpeed = 8.5;
    this.enragedSpeed = 13.5;
    this.chargeSpeed = 26.0;

    this.initMesh();
    this.initMaterials();
  }

  initMesh() {
    this.mesh = new THREE.Group();
    this.mesh.name = 'rhynthBossMesh';
    this.mesh.userData.nativeHighDetail = true;

    const rockTex = getRuntimeTexture(RHYNTH_TEXTURES.rockHide);
    const boneTex = getRuntimeTexture(RHYNTH_TEXTURES.boneHorn);
    const alloyTex = getRuntimeTexture(RHYNTH_TEXTURES.carapacePlates);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x4a3b32,
      roughness: 0.85,
      metalness: 0.12,
      map: rockTex,
      bumpMap: rockTex,
      bumpScale: 0.25,
    });

    const hornMat = new THREE.MeshStandardMaterial({
      color: 0x1f1a17,
      roughness: 0.35,
      metalness: 0.45,
      map: boneTex,
    });

    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x332822,
      roughness: 0.75,
      metalness: 0.25,
      map: alloyTex,
    });

    // 1. Massive Torso & Belly (7m long, 4.2m wide, 4m high)
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.6, 7.2, 16), bodyMat);
    torso.rotation.x = Math.PI / 2;
    torso.position.set(0, 3.4, 0);
    torso.castShadow = true;
    torso.receiveShadow = true;
    this.mesh.add(torso);
    this.torsoMesh = torso;

    // 2. Armored Dorsal Plates (Carapace segmented along spine)
    this.plateGroup = new THREE.Group();
    this.plateGroup.name = 'rhynthDorsalPlates';
    for (let i = -2; i <= 2; i++) {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(3.6 - Math.abs(i) * 0.35, 0.9, 1.3), plateMat);
      plate.position.set(0, 5.2, i * 1.4);
      plate.rotation.x = i * 0.08;
      plate.castShadow = true;
      this.plateGroup.add(plate);
    }
    this.mesh.add(this.plateGroup);

    // 3. Thermal Vital Core (revealed once plates break)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xff4411,
      emissive: 0xff2200,
      emissiveIntensity: 0.95,
      roughness: 0.4,
    });
    this.coreMesh = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 12), coreMat);
    this.coreMesh.name = 'rhynthThermalCore';
    this.coreMesh.position.set(0, 4.6, 0.2);
    this.coreMesh.visible = false;
    this.mesh.add(this.coreMesh);

    // 4. Armored Ram Head & Obsidian Horns
    this.headGroup = new THREE.Group();
    this.headGroup.name = 'rhynthRamHead';
    this.headGroup.position.set(0, 3.8, 3.8);

    const skull = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 2.8), bodyMat);
    skull.position.set(0, 0, 0);
    this.headGroup.add(skull);

    // Central Obsidian Battering Horn (2.5m)
    this.centralHorn = new THREE.Mesh(new THREE.ConeGeometry(0.65, 2.8, 16), hornMat);
    this.centralHorn.name = 'rhynthCentralHorn';
    this.centralHorn.position.set(0, 0.9, 1.8);
    this.centralHorn.rotation.x = Math.PI / 3;
    this.centralHorn.castShadow = true;
    this.headGroup.add(this.centralHorn);

    // Lateral Horns (left and right curved brows)
    [-1, 1].forEach((side) => {
      const latHorn = new THREE.Mesh(new THREE.ConeGeometry(0.45, 2.0, 12), hornMat);
      latHorn.position.set(side * 1.3, 0.7, 0.8);
      latHorn.rotation.z = -side * (Math.PI / 4);
      latHorn.rotation.x = Math.PI / 4;
      latHorn.castShadow = true;
      this.headGroup.add(latHorn);
    });
    this.mesh.add(this.headGroup);

    // 5. 6 Thick Armored Legs with Obsidian Hooves
    const legZOffsets = [2.2, 0.0, -2.2];
    legZOffsets.forEach((zOffset, legIndex) => {
      [-1, 1].forEach((side) => {
        const legGroup = new THREE.Group();
        legGroup.position.set(side * 1.8, 1.8, zOffset);

        const upperLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.55, 2.2, 12), bodyMat);
        upperLeg.castShadow = true;
        legGroup.add(upperLeg);

        const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 0.6, 12), hornMat);
        hoof.position.y = -1.2;
        hoof.castShadow = true;
        legGroup.add(hoof);

        this.mesh.add(legGroup);
      });
    });

    // 6. Heavy Club Tail
    this.tailGroup = new THREE.Group();
    this.tailGroup.name = 'rhynthTailGroup';
    this.tailGroup.position.set(0, 3.2, -3.8);

    const tailShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.35, 4.2, 12), bodyMat);
    tailShaft.rotation.x = -Math.PI / 3;
    tailShaft.position.set(0, -0.9, -1.8);
    tailShaft.castShadow = true;
    this.tailGroup.add(tailShaft);

    // Caudal Bone Mace / Club
    this.tailClub = new THREE.Mesh(new THREE.DodecahedronGeometry(0.95, 1), hornMat);
    this.tailClub.name = 'rhynthTailClub';
    this.tailClub.position.set(0, -1.9, -3.6);
    this.tailClub.castShadow = true;
    this.tailGroup.add(this.tailClub);

    this.mesh.add(this.tailGroup);

    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);
  }

  initMaterials() {
    this.thermalMaterial = ShaderManager?.createThermalMaterial?.() ?? new THREE.MeshBasicMaterial({ color: 0xff3300 });
    captureBaseMaterials(this.mesh);
  }

  getHornWorldPosition() {
    if (this.centralHorn) {
      return this.centralHorn.getWorldPosition(new THREE.Vector3());
    }
    return this.mesh.localToWorld(new THREE.Vector3(0, 4.5, 5.0));
  }

  getCoreWorldPosition() {
    if (this.coreMesh) {
      return this.coreMesh.getWorldPosition(new THREE.Vector3());
    }
    return this.mesh.localToWorld(new THREE.Vector3(0, 4.2, 0.2));
  }

  getTailWorldPosition() {
    if (this.tailClub) {
      return this.tailClub.getWorldPosition(new THREE.Vector3());
    }
    return this.mesh.localToWorld(new THREE.Vector3(0, 1.5, -7.2));
  }

  getHeadWorldPosition() {
    if (this.headGroup) {
      return this.headGroup.getWorldPosition(new THREE.Vector3());
    }
    return this.mesh.localToWorld(new THREE.Vector3(0, 3.8, 3.8));
  }

  getAimPoint() {
    if (this.coreExposed) return this.getCoreWorldPosition();
    if (this.hornIntact) return this.getHornWorldPosition();
    return this.getHeadWorldPosition();
  }

  resolveProjectileImpact(projectilePosition, projectileRadius = 1, previousPosition = projectilePosition) {
    if (!projectilePosition?.isVector3 || this.isDead) return null;
    const safeRadius = Math.max(0, Number(projectileRadius) || 0);
    const start = previousPosition?.isVector3 ? previousPosition : projectilePosition;

    // 1. Weakpoint: Exposed Thermal Core
    if (this.coreExposed) {
      const corePos = this.getCoreWorldPosition();
      if (
        resolveSegmentSphereImpact(start, projectilePosition, corePos, 3.2 + safeRadius)
        || forwardRayIntersectsSphere(start, projectilePosition, corePos, 3.2 + safeRadius)
      ) {
        return corePos;
      }
    }

    // 2. Horn / Ram Head
    const hornPos = this.getHornWorldPosition();
    if (
      resolveSegmentSphereImpact(start, projectilePosition, hornPos, 3.8 + safeRadius)
      || forwardRayIntersectsSphere(start, projectilePosition, hornPos, 3.8 + safeRadius)
    ) {
      return hornPos;
    }

    // 3. Tail Club
    if (this.tailIntact) {
      const tailPos = this.getTailWorldPosition();
      if (
        resolveSegmentSphereImpact(start, projectilePosition, tailPos, 4.2 + safeRadius)
        || forwardRayIntersectsSphere(start, projectilePosition, tailPos, 4.2 + safeRadius)
      ) {
        return tailPos;
      }
    }

    // 4. Main Torso / Armor Carapace
    const bodyPos = this.mesh.localToWorld(new THREE.Vector3(0, 3.4, 0));
    return resolveSegmentSphereImpact(start, projectilePosition, bodyPos, this.colliderRadius + safeRadius);
  }

  spawnSeveredTail() {
    if (this.severedTailMesh) return this.severedTailMesh;
    const tailProp = new THREE.Group();
    tailProp.name = 'rhynthSeveredTailClub';

    const rockTex = getRuntimeTexture(RHYNTH_TEXTURES.rockHide);
    const boneTex = getRuntimeTexture(RHYNTH_TEXTURES.boneHorn);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4a3b32, roughness: 0.85, map: rockTex });
    const hornMat = new THREE.MeshStandardMaterial({ color: 0x1f1a17, roughness: 0.35, map: boneTex });

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.35, 3.5, 12), bodyMat);
    shaft.rotation.z = Math.PI / 2;
    tailProp.add(shaft);

    const club = new THREE.Mesh(new THREE.DodecahedronGeometry(0.95, 1), hornMat);
    club.position.set(1.9, 0, 0);
    tailProp.add(club);

    tailProp.position.copy(this.getTailWorldPosition());
    tailProp.position.y = 0.5;
    tailProp.userData.isCarveable = true;
    tailProp.userData.carved = false;
    tailProp.userData.trophyType = 'RHYNTH_SEVERED_CLUB';
    this.scene.add(tailProp);
    this.severedTailMesh = tailProp;
    return tailProp;
  }

  triggerTopple(durationSeconds = 7.5) {
    if (this.isDead || this.isToppled) return;
    this.isToppled = true;
    this.toppleTimer = durationSeconds;
    this.aiState = 'toppled';
    audioSynth.playMonsterRoar();
  }

  setVisionMode(mode) {
    if (mode === 'thermal') {
      overrideMaterials(this.mesh, this.thermalMaterial, (child) => child.name !== 'rhynthThermalCore');
    } else {
      restoreBaseMaterials(this.mesh);
    }
  }

  takeDamage(amount, hitPosition) {
    if (this.isDead) return { damage: 0, killed: false, remainingHealth: this.health };

    let finalDamage = Math.max(0, Number(amount) || 0);
    const impact = hitPosition?.isVector3 ? hitPosition : this.position;

    // 1. Core Weakpoint hit (x2.5 critical damage)
    const distToCore = impact.distanceTo(this.getCoreWorldPosition());
    if (distToCore < 3.5 && this.coreExposed) {
      finalDamage *= 2.5;
    }

    // 2. Horn Ram Break Check
    const distToHorn = impact.distanceTo(this.getHornWorldPosition());
    if (distToHorn < 4.0 && this.hornIntact) {
      this.hornHealth -= amount;
      if (this.hornHealth <= 0) {
        this.hornIntact = false;
        if (this.centralHorn) this.centralHorn.visible = false;
        audioSynth.playMonsterPartBreakCrunch();
        audioSynth.playMonsterRoar();
      }
    }

    // 3. Dorsal Plates Fracture Check
    if (this.armorPlatesIntact) {
      this.armorPlatesHealth -= amount;
      if (this.armorPlatesHealth <= 0) {
        this.armorPlatesIntact = false;
        this.coreExposed = true;
        if (this.coreMesh) this.coreMesh.visible = true;
        audioSynth.playMonsterPartBreakCrunch();
        audioSynth.playMonsterRoar();
      } else {
        // Natural plate reduction absorbs 40% of damage while intact
        finalDamage *= 0.6;
      }
    }

    // 4. Tail Sever Check
    const distToTail = impact.distanceTo(this.getTailWorldPosition());
    if (distToTail < 4.5 && this.tailIntact) {
      this.tailHealth -= amount;
      if (this.tailHealth <= 0) {
        this.tailIntact = false;
        if (this.tailGroup) this.tailGroup.visible = false;
        this.spawnSeveredTail();
        audioSynth.playMonsterTailSeverSwoosh();
        audioSynth.playMonsterRoar();
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
      audioSynth.playMonsterRoar();
    }

    return {
      damage: finalDamage,
      killed: this.isDead,
      remainingHealth: this.health,
    };
  }

  applyNet() {
    this.isNetted = true;
    this.netTimer = 3.5;
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
    this.stompCooldown = Math.max(0, this.stompCooldown - delta);

    // Monster Hunter Stamina Consumption
    if (this.aiState === 'charge') {
      this.stamina = Math.max(0, this.stamina - delta * 35);
    } else {
      this.stamina = Math.max(0, this.stamina - delta * 12);
    }

    if (this.stamina <= 0 && !this.isExhausted) {
      this.isExhausted = true;
      audioSynth.playMonsterFatiguePant();
    } else if (this.stamina > 400 && this.isExhausted) {
      this.isExhausted = false;
    }

    const distToPlayer = playerPos ? this.position.distanceTo(playerPos) : 999;
    const detectionRadius = isPlayerCloaked ? 32.0 : 160.0;

    if (distToPlayer < detectionRadius && playerPos) {
      this.aiState = 'chase';
      const targetDir = playerPos.clone().sub(this.position).normalize();
      const targetAngle = Math.atan2(targetDir.x, targetDir.z);

      let diff = targetAngle - this.mesh.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      this.mesh.rotation.y += diff * Math.min(1.0, delta * 3.5);

      if (this.attackCooldown <= 0) {
        if (distToPlayer < 9.0) {
          this.aiState = 'stomp';
          audioSynth.playMonsterHunterFootstep();
          this.attackCooldown = this.isExhausted ? 4.2 : 2.5;
        } else if (distToPlayer >= 18.0 && distToPlayer <= 55.0) {
          this.aiState = 'charge';
          audioSynth.playMonsterHunterRoar();
          this.attackCooldown = this.isExhausted ? 5.5 : 3.8;
        }
      }

      let speed = this.isEnraged ? this.enragedSpeed : this.moveSpeed;
      if (this.isExhausted) speed *= 0.6;
      if (this.aiState === 'charge') speed = this.chargeSpeed * (this.hornIntact ? 1.0 : 0.7);

      if (distToPlayer > 7.0) {
        this.position.addScaledVector(targetDir, speed * delta);
      }
    } else {
      this.aiState = 'graze';
    }

    const arenaBoundary = Math.max(40, Number(this.arenaBoundary) || 320);
    this.position.x = Math.max(-arenaBoundary, Math.min(arenaBoundary, this.position.x));
    this.position.z = Math.max(-arenaBoundary, Math.min(arenaBoundary, this.position.z));

    if (this.stompCooldown === 0 && (this.aiState === 'chase' || this.aiState === 'charge')) {
      audioSynth.playMonsterHunterFootstep();
      this.stompCooldown = this.aiState === 'charge' ? 0.38 : 0.85;
    }

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
