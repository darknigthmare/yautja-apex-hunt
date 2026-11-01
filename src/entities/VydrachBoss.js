import * as THREE from 'three';
import { ShaderManager } from '../Shaders.js';
import { audioSynth } from '../AudioSynthesizer.js';
import { captureBaseMaterials, overrideMaterials, restoreBaseMaterials } from '../utils/materialState.js';
import { getRuntimeTexture } from '../utils/runtimeTextures.js';
import { containsBossPartImpact, resolveBossGeometryImpact } from './BossProjectileGeometry.js';
import { getVisualBounds, getVisualCenter } from '../utils/worldScale.js';

export const VYDRACH_TEXTURES = Object.freeze({
  draconianScale: '/assets/textures/goliath-armored-hide.webp',
  wingMembrane: '/assets/textures/hive-biomechanical-membrane.webp',
  volcanicCrag: '/assets/textures/yautja-alloy.webp',
  boneCrest: '/assets/textures/trophy-bone.webp'
});

// Original combat timings/ranges in game units; not a certified media mechanic.
export const VYDRACH_ATTACK_SPECS = Object.freeze({
  tail_whip: Object.freeze({ id: 'vydrach_tail_whip', state: 'tail_whip', windup: 0.75, impact: 0.22, recovery: 0.6, cooldown: 2.8, range: 13 }),
  aerial_dive: Object.freeze({ id: 'vydrach_aerial_dive', state: 'aerial_dive', windup: 1, impact: 1.2, recovery: 0.7, cooldown: 4.5, range: 13.5, speedKey: 'flightSpeed' }),
  bite: Object.freeze({ id: 'vydrach_bite', state: 'bite', windup: 0.65, impact: 0.18, recovery: 0.55, cooldown: 2.4, range: 11.5 }),
});

/**
 * Adaptation procédurale du Vy'drach ailé de Yautja Prime référencé dans le catalogue.
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
    this.attackSpecs = VYDRACH_ATTACK_SPECS;
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

    // 1. Torso and ribcage, authored in game units (not metres)
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

    // 5. Left and right wings (rendered span: 27 game units)
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

    // 7. Spined stinger tail, authored in game units
    const tailGroup = new THREE.Group();
    tailGroup.name = 'vydrachTail';
    tailGroup.position.y = 0.3;
    for (let i = 0; i < 5; i++) {
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.9 - i * 0.12, 1.1 - i * 0.12, 3.2, 16), scaleMat);
      seg.rotation.x = -Math.PI / 4;
      seg.position.set(0, 4.5 - i * 0.8, -6.5 - i * 2.4);
      tailGroup.add(seg);
    }
    const stinger = new THREE.Mesh(new THREE.ConeGeometry(0.9, 3.5, 16), boneMat);
    stinger.name = 'vydrachTailStinger';
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
    return this.crestMesh ? getVisualCenter(this.crestMesh) : this.mesh.localToWorld(new THREE.Vector3(0, 11.2, 7.8));
  }

  getTailWorldPosition() {
    this.mesh.updateWorldMatrix(true, true);
    const stinger = this.mesh.getObjectByName('vydrachTailStinger');
    return stinger ? getVisualCenter(stinger) : this.mesh.localToWorld(new THREE.Vector3(0, 1.1, -19));
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
    tailProp.position.y = this.position.y - getVisualBounds(tailProp, { local: true }).min.y;
    tailProp.userData.isCarveable = true;
    tailProp.userData.carved = false;
    tailProp.userData.trophyType = 'VYDRACH_SEVERED_BARBED_STINGER';
    this.scene.add(tailProp);
    this.severedTailMesh = tailProp;
    return tailProp;
  }

  triggerTopple(durationSeconds = 8.0) {
    if (this.isDead || this.isToppled) return;
    this.cancelAttack('toppled');
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
    if (this.isDead) return null;
    return resolveBossGeometryImpact(this.mesh, previousPosition, projectilePosition, projectileRadius,
      [this.coreMesh, this.crestIntact ? this.crestMesh : null, this.tailIntact ? this.mesh.getObjectByName('vydrachTailStinger') : null]);
  }
  takeDamage(amount, hitPosition) {
    if (this.isDead) return { damage: 0, killed: false, remainingHealth: this.health };

    const baseDamage = Math.max(0, Number(amount) || 0);
    let finalDamage = baseDamage;
    const impact = hitPosition?.isVector3 ? hitPosition : this.position;

    // 1. Core Weakpoint check (x2.5 critical damage)
    if (containsBossPartImpact(this.coreMesh, impact)) {
      finalDamage *= 2.5;
      this.coreExposed = true;
    }

    // 2. Horned Crest Break check
    if (this.crestIntact && containsBossPartImpact(this.crestMesh, impact)) {
      this.crestHealth -= baseDamage;
      if (this.crestHealth <= 0) {
        this.crestIntact = false;
        if (this.crestMesh) this.crestMesh.visible = false;
        audioSynth.playMonsterRoar();
      }
    }

    // 3. Tail Sever check
    if (this.tailIntact && containsBossPartImpact(this.mesh.getObjectByName('vydrachTailStinger'), impact)) {
      this.tailHealth -= baseDamage;
      if (this.tailHealth <= 0) {
        this.tailIntact = false;
        if (this.activeAttackKind === 'tail_whip') this.cancelAttack();
        if (this.tailMesh) this.tailMesh.visible = false;
        this.spawnSeveredTail();
        audioSynth.playMonsterRoar();
      }
    }

    // Wing health was declared but never consumed: a shot through the visible
    // membrane now damages that wing and removes aerial dives once it breaks.
    for (const side of ['left', 'right']) {
      const wing = this[`${side}WingMesh`];
      if (this[`${side}WingIntact`] && containsBossPartImpact(wing, impact)) {
        this[`${side}WingHealth`] = Math.max(0, this[`${side}WingHealth`] - baseDamage);
        if (this[`${side}WingHealth`] === 0) {
          this[`${side}WingIntact`] = false;
          if (this.activeAttackKind === 'aerial_dive') this.cancelAttack();
          wing.visible = false;
          audioSynth.playMonsterRoar();
        }
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
      this.cancelAttack('dead');
      audioSynth.playMonsterRoar();
    }
    return { damage: finalDamage, killed: this.isDead, remainingHealth: this.health };
  }

  applyNet() {
    this.cancelAttack('netted');
    this.isNetted = true;
    this.netTimer = 4.0;
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
    const boundary = Math.max(40, Number(this.arenaBoundary) || 350);
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
    this.footstepCooldown = Math.max(0, this.footstepCooldown - delta);
    if (this.updateTelegraphedAttack(delta)) return;

    const distToPlayer = playerPos?.isVector3
      ? Math.hypot(playerPos.x - this.position.x, playerPos.z - this.position.z) : Infinity;
    const detectionRadius = isPlayerCloaked ? 30 : 220;
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
        const closeAttack = this.tailIntact ? 'tail_whip' : 'bite';
        if (distToPlayer <= this.attackSpecs[closeAttack].range + radiusAllowance) {
          if (this.startTelegraphedAttack(closeAttack, playerPos)) audioSynth.playMonsterRoar();
        } else if (distToPlayer >= 22 + radiusAllowance && distToPlayer <= 40 + radiusAllowance
          && this.leftWingIntact && this.rightWingIntact) {
          if (this.startTelegraphedAttack('aerial_dive', playerPos)) audioSynth.playMonsterRoar();
        }
      }
      if (!this.activeAttackType) {
        let speed = this.isEnraged ? this.enragedSpeed : this.moveSpeed;
        if (this.isExhausted) speed *= 0.6;
        const travel = Math.min(speed * delta, Math.max(0, distToPlayer - this.colliderRadius - 1.8));
        this.position.addScaledVector(targetDir, travel);
      }
    } else this.aiState = 'roam';

    const arenaBoundary = Math.max(40, Number(this.arenaBoundary) || 350);
    this.position.x = THREE.MathUtils.clamp(this.position.x, -arenaBoundary, arenaBoundary);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -arenaBoundary, arenaBoundary);
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
