import * as THREE from 'three';
import { ShaderManager } from '../Shaders.js';
import { audioSynth } from '../AudioSynthesizer.js';
import { captureBaseMaterials, overrideMaterials, restoreBaseMaterials } from '../utils/materialState.js';
import { getRuntimeTexture } from '../utils/runtimeTextures.js';
import { containsBossPartImpact, resolveBossGeometryImpact } from './BossProjectileGeometry.js';
import { getVisualBounds } from '../utils/worldScale.js';

export const RHYNTH_TEXTURES = Object.freeze({
  rockHide: '/assets/textures/goliath-armored-hide.webp',
  boneHorn: '/assets/textures/trophy-bone.webp',
  carapacePlates: '/assets/textures/yautja-alloy.webp',
});

// Original combat timings/ranges in game units; not a certified media mechanic.
export const RHYNTH_ATTACK_SPECS = Object.freeze({
  stomp: Object.freeze({ id: 'rhynth_stomp', state: 'stomp', windup: 0.85, impact: 0.2, recovery: 0.6, cooldown: 2.5, range: 12 }),
  charge: Object.freeze({ id: 'rhynth_charge', state: 'charge', windup: 1.05, impact: 1.2, recovery: 0.7, cooldown: 3.8, range: 12.5, speedKey: 'chargeSpeed' }),
});

/**
 * Adaptation procédurale du Rhynth de Ryushi, selon le référent AVP: Prey du catalogue.
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
    this.attackSpecs = RHYNTH_ATTACK_SPECS;
    this.activeAttackType = null;
    this.activeAttackKind = null;
    this.attackStage = 'idle';
    this.attackStageTimer = 0;
    this.attackWindupTimer = 0;
    this.attackWindupDuration = 0;
    this.attackRecoveryTimer = 0;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.attackTelegraphAnnounced = false;
    this.attackSequence = 0;
    this.attackTravelRemaining = 0;
    this.attackDirection = new THREE.Vector3(0, 0, 1);
    this.attackTarget = new THREE.Vector3();
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

    // 1. Torso and belly, authored in game units (not metres)
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

    // Central battering horn (2.8 game units)
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
        legGroup.position.set(side * 1.8, 1.5, zOffset);

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
    if (this.isDead) return null;
    return resolveBossGeometryImpact(this.mesh, previousPosition, projectilePosition, projectileRadius,
      [this.coreExposed ? this.coreMesh : null, this.hornIntact ? this.centralHorn : null, this.tailIntact ? this.tailClub : null]);
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
    tailProp.position.y = this.position.y - getVisualBounds(tailProp, { local: true }).min.y;
    tailProp.userData.isCarveable = true;
    tailProp.userData.carved = false;
    tailProp.userData.trophyType = 'RHYNTH_SEVERED_CLUB';
    this.scene.add(tailProp);
    this.severedTailMesh = tailProp;
    return tailProp;
  }

  triggerTopple(durationSeconds = 7.5) {
    if (this.isDead || this.isToppled) return;
    this.cancelAttack('toppled');
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

    const baseDamage = Math.max(0, Number(amount) || 0);
    let finalDamage = baseDamage;
    const impact = hitPosition?.isVector3 ? hitPosition : this.position;

    // 1. Core Weakpoint hit (x2.5 critical damage)
    if (this.coreExposed && containsBossPartImpact(this.coreMesh, impact)) {
      finalDamage *= 2.5;
    }

    // 2. Horn Ram Break Check
    if (this.hornIntact && containsBossPartImpact(this.centralHorn, impact)) {
      this.hornHealth -= baseDamage;
      if (this.hornHealth <= 0) {
        this.hornIntact = false;
        if (this.centralHorn) this.centralHorn.visible = false;
        audioSynth.playMonsterPartBreakCrunch();
        audioSynth.playMonsterRoar();
      }
    }

    // 3. Dorsal Plates Fracture Check
    if (this.armorPlatesIntact) {
      this.armorPlatesHealth -= baseDamage;
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
    if (this.tailIntact && containsBossPartImpact(this.tailClub, impact)) {
      this.tailHealth -= baseDamage;
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
      this.cancelAttack('dead');
      audioSynth.playMonsterRoar();
    }

    return {
      damage: finalDamage,
      killed: this.isDead,
      remainingHealth: this.health,
    };
  }

  applyNet() {
    this.cancelAttack('netted');
    this.isNetted = true;
    this.netTimer = 3.5;
  }

  startTelegraphedAttack(kind, targetPosition) {
    const spec = this.attackSpecs[kind];
    if (!spec || this.activeAttackType || this.attackCooldown > 0 || this.isDead || this.isNetted || this.isToppled
      || !targetPosition?.isVector3 || ![targetPosition.x, targetPosition.y, targetPosition.z].every(Number.isFinite)) return false;
    if (kind === 'aerial_dive' && (!this.leftWingIntact || !this.rightWingIntact)) return false;
    if (kind === 'tail_whip' && !this.tailIntact) return false;
    this.activeAttackType = spec.id;
    this.activeAttackKind = kind;
    this.attackStage = 'windup';
    this.attackWindupDuration = spec.windup * (this.isExhausted ? 1.15 : 1);
    this.attackWindupTimer = this.attackWindupDuration;
    this.attackStageTimer = this.attackWindupDuration;
    this.attackCooldown = spec.cooldown * (this.isExhausted ? 1.35 : 1);
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.attackTelegraphAnnounced = false;
    this.attackSequence += 1;
    this.attackTarget.copy(targetPosition);
    this.attackDirection.copy(targetPosition).sub(this.position);
    this.attackDirection.y = 0;
    this.attackTravelRemaining = Math.max(0, this.attackDirection.length() - this.colliderRadius - 1.8);
    if (this.attackDirection.lengthSq() < 1e-8) this.attackDirection.set(0, 0, 1);
    else this.attackDirection.normalize();
    this.aiState = spec.state;
    return true;
  }

  consumeAttackImpact() {
    if (!this.attackImpactReady || this.attackImpactConsumed || this.attackStage !== 'impact') return false;
    this.attackImpactConsumed = true;
    this.attackImpactReady = false;
    return true;
  }

  cancelAttack(nextState = this.isDead ? 'dead' : 'chase') {
    this.activeAttackType = null;
    this.activeAttackKind = null;
    this.attackStage = 'idle';
    this.attackStageTimer = 0;
    this.attackWindupTimer = 0;
    this.attackWindupDuration = 0;
    this.attackRecoveryTimer = 0;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.attackTelegraphAnnounced = false;
    this.attackTravelRemaining = 0;
    this.aiState = nextState;
  }

  updateTelegraphedAttack(delta) {
    if (!this.activeAttackType) return false;
    const spec = this.attackSpecs[this.activeAttackKind];
    if ((this.activeAttackKind === 'aerial_dive' && (!this.leftWingIntact || !this.rightWingIntact))
      || (this.activeAttackKind === 'tail_whip' && !this.tailIntact)) {
      this.cancelAttack();
      return false;
    }
    if (this.attackStage === 'windup') {
      this.aiState = spec.state;
      const angle = Math.atan2(this.attackDirection.x, this.attackDirection.z);
      const difference = Math.atan2(Math.sin(angle - this.mesh.rotation.y), Math.cos(angle - this.mesh.rotation.y));
      this.mesh.rotation.y += difference * Math.min(1, delta * 5);
      this.attackStageTimer = Math.max(0, this.attackStageTimer - delta);
      this.attackWindupTimer = this.attackStageTimer;
      if (this.attackStageTimer === 0) {
        this.attackStage = 'impact';
        this.attackStageTimer = spec.impact;
        this.attackImpactReady = true;
      }
    } else if (this.attackStage === 'impact') {
      this.aiState = spec.state;
      if (spec.speedKey) {
        const speed = this[spec.speedKey] * (this.isExhausted ? 0.75 : 1)
          * (this.activeAttackKind === 'charge' && !this.hornIntact ? 0.7 : 1);
        const travel = Math.min(this.attackTravelRemaining, speed * Math.min(delta, this.attackStageTimer));
        this.position.addScaledVector(this.attackDirection, travel);
        this.attackTravelRemaining -= travel;
      }
      this.attackStageTimer = Math.max(0, this.attackStageTimer - delta);
      if (this.attackStageTimer === 0) {
        this.attackStage = 'recovery';
        this.attackStageTimer = spec.recovery;
        this.attackRecoveryTimer = spec.recovery;
        this.attackImpactReady = false;
        this.aiState = 'recover';
      }
    } else if (this.attackStage === 'recovery') {
      this.attackStageTimer = Math.max(0, this.attackStageTimer - delta);
      this.attackRecoveryTimer = this.attackStageTimer;
      this.aiState = 'recover';
      if (this.attackStageTimer === 0) this.cancelAttack();
    }
    const boundary = Math.max(40, Number(this.arenaBoundary) || 320);
    this.position.x = THREE.MathUtils.clamp(this.position.x, -boundary, boundary);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -boundary, boundary);
    this.mesh.position.copy(this.position);
    return true;
  }

  update(delta, playerPos, isPlayerCloaked) {
    delta = Number.isFinite(delta) ? Math.max(0, delta) : 0;
    if (this.isDead) { this.cancelAttack('dead'); return; }
    if (this.isToppled) {
      this.cancelAttack('toppled');
      this.toppleTimer = Math.max(0, this.toppleTimer - delta);
      if (this.toppleTimer === 0) { this.isToppled = false; this.aiState = 'chase'; }
      return;
    }
    if (this.isNetted) {
      this.cancelAttack('netted');
      this.netTimer = Math.max(0, this.netTimer - delta);
      if (this.netTimer === 0) { this.isNetted = false; this.aiState = 'chase'; }
      return;
    }
    this.attackCooldown = Math.max(0, this.attackCooldown - delta);
    this.stompCooldown = Math.max(0, this.stompCooldown - delta);
    this.stamina = Math.max(0, this.stamina - delta * (this.activeAttackType === 'rhynth_charge' ? 35 : 12));
    if (this.stamina === 0 && !this.isExhausted) {
      this.isExhausted = true;
      audioSynth.playMonsterFatiguePant();
    } else if (this.stamina > 400) this.isExhausted = false;
    if (this.updateTelegraphedAttack(delta)) return;

    const distToPlayer = playerPos?.isVector3
      ? Math.hypot(playerPos.x - this.position.x, playerPos.z - this.position.z) : Infinity;
    const detectionRadius = isPlayerCloaked ? 32 : 160;
    const radiusAllowance = Math.max(0, this.colliderRadius - (this.baseSimulationColliderRadius ?? this.colliderRadius));
    if (distToPlayer < detectionRadius) {
      this.aiState = 'chase';
      const targetDir = playerPos.clone().sub(this.position);
      targetDir.y = 0;
      if (targetDir.lengthSq() > 1e-8) targetDir.normalize();
      const targetAngle = Math.atan2(targetDir.x, targetDir.z);
      const difference = Math.atan2(Math.sin(targetAngle - this.mesh.rotation.y), Math.cos(targetAngle - this.mesh.rotation.y));
      this.mesh.rotation.y += difference * Math.min(1, delta * 3.5);
      if (this.attackCooldown === 0) {
        if (distToPlayer <= this.attackSpecs.stomp.range + radiusAllowance) {
          if (this.startTelegraphedAttack('stomp', playerPos)) audioSynth.playMonsterHunterFootstep();
        } else if (distToPlayer >= 18 + radiusAllowance && distToPlayer <= 42 + radiusAllowance) {
          if (this.startTelegraphedAttack('charge', playerPos)) audioSynth.playMonsterHunterRoar();
        }
      }
      if (!this.activeAttackType) {
        let speed = this.isEnraged ? this.enragedSpeed : this.moveSpeed;
        if (this.isExhausted) speed *= 0.6;
        const travel = Math.min(speed * delta, Math.max(0, distToPlayer - this.colliderRadius - 1.8));
        this.position.addScaledVector(targetDir, travel);
      }
    } else this.aiState = 'graze';

    const arenaBoundary = Math.max(40, Number(this.arenaBoundary) || 320);
    this.position.x = THREE.MathUtils.clamp(this.position.x, -arenaBoundary, arenaBoundary);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -arenaBoundary, arenaBoundary);
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
