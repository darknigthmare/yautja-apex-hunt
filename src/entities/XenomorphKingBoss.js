import * as THREE from 'three';
import { ShaderManager } from '../Shaders.js';
import { audioSynth } from '../AudioSynthesizer.js';
import { captureBaseMaterials, overrideMaterials, restoreBaseMaterials } from '../utils/materialState.js';
import { getRuntimeTexture } from '../utils/runtimeTextures.js';
import { containsBossPartImpact, resolveBossGeometryImpact } from './BossProjectileGeometry.js';
import { getVisualBounds, getVisualCenter } from '../utils/worldScale.js';

export const XENOMORPH_KING_TEXTURES = Object.freeze({
  chitinExoskeleton: '/assets/textures/hive-biomechanical-membrane.webp',
  boneCrest: '/assets/textures/trophy-bone.webp',
  acidicVeins: '/assets/textures/goliath-armored-hide.webp',
});

// Original combat timings/ranges in game units; not a certified media mechanic.
export const XENOMORPH_KING_ATTACK_SPECS = Object.freeze({
  cleave_swipe: Object.freeze({ id: 'king_cleave_swipe', state: 'cleave_swipe', windup: 0.65, impact: 0.18, recovery: 0.6, cooldown: 2.2, range: 12 }),
  leap_slam: Object.freeze({ id: 'king_leap_slam', state: 'leap_slam', windup: 0.95, impact: 1, recovery: 0.7, cooldown: 3.5, range: 13, speedKey: 'leapSpeed' }),
});

/**
 * Adaptation procédurale du Roi Xénomorphe, selon Aliens: Rogue (1993) référencé au catalogue.
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
    this.attackSpecs = XENOMORPH_KING_ATTACK_SPECS;
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

    // 1. Biomechanical torso, authored in game units (not metres)
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
      // The former tibia extended more than one unit below the terrain.
      leg.position.y -= getVisualBounds(leg).min.y;
    });

    // 6. Dual-bladed tail, authored in game units
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
      blade.position.set(side * 0.65, -3.35, -9.2);
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
      return getVisualCenter(this.crownMesh);
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
      return getVisualCenter(this.tailBlade);
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
    if (this.isDead) return null;
    return resolveBossGeometryImpact(this.mesh, previousPosition, projectilePosition, projectileRadius,
      [this.coreExposed ? this.coreMesh : null, this.crownIntact ? this.crownMesh : null, this.tailIntact ? this.tailBlade : null]);
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
    tailProp.position.y = this.position.y - getVisualBounds(tailProp, { local: true }).min.y;
    tailProp.userData.isCarveable = true;
    tailProp.userData.carved = false;
    tailProp.userData.trophyType = 'KING_SEVERED_DUAL_BLADES';
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

    const baseDamage = Math.max(0, Number(amount) || 0);
    let finalDamage = baseDamage;
    const impact = hitPosition?.isVector3 ? hitPosition : this.position;

    // 1. Acid Heart Weakpoint hit (x2.8 critical damage)
    if (this.coreExposed && containsBossPartImpact(this.coreMesh, impact)) {
      finalDamage *= 2.8;
    }

    // 2. Trident Crown Break Check
    if (this.crownIntact && containsBossPartImpact(this.crownMesh, impact)) {
      this.crownHealth -= baseDamage;
      if (this.crownHealth <= 0) {
        this.crownIntact = false;
        if (this.crownMesh) this.crownMesh.visible = false;
        audioSynth.playMonsterPartBreakCrunch();
        audioSynth.playMonsterHunterRoar();
      }
    }

    // 3. Ribcage Armor Plating Check
    if (this.ribcageIntact) {
      this.ribcageHealth -= baseDamage;
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
    if (this.tailIntact && containsBossPartImpact(this.tailBlade, impact)) {
      this.tailHealth -= baseDamage;
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
      this.cancelAttack('dead');
      audioSynth.playMonsterHunterRoar();
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
    this.netTimer = 3.2;
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
    this.roarCooldown = Math.max(0, this.roarCooldown - delta);
    this.stamina = Math.max(0, this.stamina - delta * (this.activeAttackType === 'king_leap_slam' ? 40 : 15));
    if (this.stamina === 0 && !this.isExhausted) {
      this.isExhausted = true;
      audioSynth.playMonsterFatiguePant();
    } else if (this.stamina > 450) this.isExhausted = false;
    if (this.updateTelegraphedAttack(delta)) return;

    const distToPlayer = playerPos?.isVector3
      ? Math.hypot(playerPos.x - this.position.x, playerPos.z - this.position.z) : Infinity;
    const detectionRadius = isPlayerCloaked ? 35 : 180;
    const radiusAllowance = Math.max(0, this.colliderRadius - (this.baseSimulationColliderRadius ?? this.colliderRadius));
    if (distToPlayer < detectionRadius) {
      this.aiState = 'chase';
      const targetDir = playerPos.clone().sub(this.position);
      targetDir.y = 0;
      if (targetDir.lengthSq() > 1e-8) targetDir.normalize();
      const targetAngle = Math.atan2(targetDir.x, targetDir.z);
      const difference = Math.atan2(Math.sin(targetAngle - this.mesh.rotation.y), Math.cos(targetAngle - this.mesh.rotation.y));
      this.mesh.rotation.y += difference * Math.min(1, delta * 4.2);
      if (this.attackCooldown === 0) {
        if (distToPlayer <= this.attackSpecs.cleave_swipe.range + radiusAllowance) {
          if (this.startTelegraphedAttack('cleave_swipe', playerPos)) audioSynth.playMonsterHunterRoar();
        } else if (distToPlayer >= 16 + radiusAllowance && distToPlayer <= 40 + radiusAllowance) {
          if (this.startTelegraphedAttack('leap_slam', playerPos)) audioSynth.playMonsterHunterRoar();
        }
      }
      if (!this.activeAttackType) {
        let speed = this.isEnraged ? this.enragedSpeed : this.moveSpeed;
        if (this.isExhausted) speed *= 0.6;
        const travel = Math.min(speed * delta, Math.max(0, distToPlayer - this.colliderRadius - 1.8));
        this.position.addScaledVector(targetDir, travel);
      }
    } else this.aiState = 'stalk';

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
