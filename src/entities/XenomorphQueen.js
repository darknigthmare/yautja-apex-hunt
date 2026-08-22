import * as THREE from 'three';
import { ShaderManager } from '../Shaders.js';
import { audioSynth } from '../AudioSynthesizer.js';
import { captureBaseMaterials, overrideMaterials, restoreBaseMaterials } from '../utils/materialState.js';

export class XenomorphQueen {
  constructor(scene) {
    this.scene = scene;

    // Queen Vitals
    this.maxHealth = 1500;
    this.health = 1500;
    this.isEnraged = false;
    this.isDead = false;
    this.isNetted = false;
    this.netTimer = 0;

    // Breakable Parts
    this.crownIntact = true;
    this.tailIntact = true;
    this.crownHealth = 280;
    this.tailHealth = 320;

    // Movement & AI
    this.position = new THREE.Vector3(0, 0, -45);
    this.moveSpeed = 12.0;
    this.enragedSpeed = 19.0;

    this.aiState = 'roam'; // 'roam', 'chase', 'attack_jaw', 'attack_tail', 'acid_spray'
    this.attackCooldown = 0;
    this.activeTelegraphedAttack = null;
    this.attackWindupDuration = 0;
    this.attackWindupTimer = 0;
    this.attackRecoveryTimer = 0;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.attackTelegraphAnnounced = false;

    // 3D Mesh
    this.mesh = this.createQueenMesh();
    this.scene.add(this.mesh);
    captureBaseMaterials(this.mesh);

    this.crownMesh = this.mesh.getObjectByName('queenCrown');
    this.tailMesh = this.mesh.getObjectByName('queenTail');

    // Materials
    this.normalMaterial = this.mesh.children[0].material;
    this.thermalMaterial = ShaderManager.createThermalMaterial(0x00ff44, 0.95);
  }

  createQueenMesh() {
    const queenGroup = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c10,
      roughness: 0.15,
      metalness: 0.9
    });

    const acidMat = new THREE.MeshBasicMaterial({ color: 0x00ff33 });

    const torsoGeo = new THREE.BoxGeometry(5, 5, 9);
    const torso = new THREE.Mesh(torsoGeo, bodyMat);
    torso.position.y = 6.0;
    torso.castShadow = true;
    queenGroup.add(torso);

    const crownGeo = new THREE.ConeGeometry(4.5, 7.5, 3);
    crownGeo.rotateX(-Math.PI / 3);
    const crown = new THREE.Mesh(crownGeo, bodyMat);
    crown.name = 'queenCrown';
    crown.position.set(0, 10.5, 4.0);
    crown.castShadow = true;
    queenGroup.add(crown);

    const headGeo = new THREE.BoxGeometry(2.8, 2.5, 5.0);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.set(0, 8.0, 7.5);
    head.castShadow = true;
    queenGroup.add(head);

    const innerJawGeo = new THREE.CylinderGeometry(0.4, 0.4, 3.0);
    innerJawGeo.rotateX(Math.PI / 2);
    const innerJaw = new THREE.Mesh(innerJawGeo, acidMat);
    innerJaw.position.set(0, 7.8, 9.8);
    queenGroup.add(innerJaw);

    for (let i = -3; i <= 3; i += 2) {
      const ribGeo = new THREE.TorusGeometry(3.0, 0.25, 6, 12, Math.PI);
      const rib = new THREE.Mesh(ribGeo, acidMat);
      rib.rotation.x = Math.PI / 2;
      rib.position.set(0, 5.8, i * 1.2);
      queenGroup.add(rib);
    }

    const armLargeGeo = new THREE.CylinderGeometry(0.7, 0.5, 7.0);
    const armR = new THREE.Mesh(armLargeGeo, bodyMat);
    armR.position.set(3.5, 5.5, 4.0);
    armR.rotation.z = -Math.PI / 4;
    queenGroup.add(armR);

    const armL = new THREE.Mesh(armLargeGeo, bodyMat);
    armL.position.set(-3.5, 5.5, 4.0);
    armL.rotation.z = Math.PI / 4;
    queenGroup.add(armL);

    const legGeo = new THREE.CylinderGeometry(0.9, 0.7, 7.0);
    const legPositions = [
      [3.2, 3.5, 2.0], [-3.2, 3.5, 2.0],
      [3.2, 3.5, -4.0], [-3.2, 3.5, -4.0]
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, bodyMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      queenGroup.add(leg);
    });

    const tailGroup = new THREE.Group();
    tailGroup.name = 'queenTail';

    for (let i = 0; i < 6; i++) {
      const segGeo = new THREE.CylinderGeometry(0.7 - i * 0.1, 0.8 - i * 0.1, 3.2);
      const seg = new THREE.Mesh(segGeo, bodyMat);
      seg.rotation.x = -Math.PI / 3;
      seg.position.set(0, 5.0 - i * 0.5, -5.0 - i * 2.4);
      seg.castShadow = true;
      tailGroup.add(seg);
    }

    const spearTipGeo = new THREE.ConeGeometry(0.9, 4.0, 4);
    spearTipGeo.rotateX(-Math.PI / 2);
    const spearTip = new THREE.Mesh(spearTipGeo, bodyMat);
    spearTip.position.set(0, 2.0, -19.5);
    tailGroup.add(spearTip);

    queenGroup.add(tailGroup);

    queenGroup.position.copy(this.position);
    return queenGroup;
  }

  setVisionMode(mode) {
    if (mode === 'thermal') {
      overrideMaterials(this.mesh, this.thermalMaterial);
    } else {
      restoreBaseMaterials(this.mesh);
    }
  }

  takeDamage(amount, hitPosition) {
    if (this.isDead) return;

    this.health = Math.max(0, this.health - amount);
    audioSynth.playAcidSizzle();

    const distToHead = hitPosition.distanceTo(this.position.clone().add(new THREE.Vector3(0, 10.5, 4.0)));
    if (distToHead < 4.5 && this.crownIntact) {
      this.crownHealth -= amount;
      if (this.crownHealth <= 0) {
        this.crownIntact = false;
        if (this.crownMesh) this.crownMesh.visible = false;
        audioSynth.playMonsterRoar();
      }
    }

    const distToTail = hitPosition.distanceTo(this.position.clone().add(new THREE.Vector3(0, 2.0, -15.0)));
    if (distToTail < 5.5 && this.tailIntact) {
      this.tailHealth -= amount;
      if (this.tailHealth <= 0) {
        this.tailIntact = false;
        if (this.tailMesh) this.tailMesh.visible = false;
        if (this.activeTelegraphedAttack === 'attack_tail') this.cancelTelegraphedAttack();
        audioSynth.playMonsterRoar();
      }
    }

    if (this.health <= this.maxHealth * 0.5 && !this.isEnraged) {
      this.isEnraged = true;
      audioSynth.playMonsterRoar();
    }

    if (this.health <= 0) {
      this.isDead = true;
      this.cancelTelegraphedAttack();
      audioSynth.playMonsterRoar();
    }
  }

  dispose() {
    restoreBaseMaterials(this.mesh);
    this.thermalMaterial.dispose?.();
  }

  applyNet() {
    this.cancelTelegraphedAttack();
    this.isNetted = true;
    this.netTimer = 3.5;
  }
  startTelegraphedAttack(state, windupSeconds, cooldownSeconds) {
    this.aiState = state;
    this.activeTelegraphedAttack = state;
    this.attackWindupDuration = windupSeconds;
    this.attackWindupTimer = windupSeconds;
    this.attackRecoveryTimer = windupSeconds + 0.25;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.attackTelegraphAnnounced = false;
    this.attackCooldown = cooldownSeconds;
  }

  consumeAttackImpact() {
    if (!this.attackImpactReady || this.attackImpactConsumed) return false;
    this.attackImpactConsumed = true;
    this.attackImpactReady = false;
    return true;
  }

  cancelTelegraphedAttack() {
    this.activeTelegraphedAttack = null;
    this.attackWindupDuration = 0;
    this.attackWindupTimer = 0;
    this.attackRecoveryTimer = 0;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.attackTelegraphAnnounced = false;
    if (this.tailMesh) this.tailMesh.rotation.set(0, 0, 0);
    if (this.crownMesh) this.crownMesh.rotation.set(0, 0, 0);
    this.mesh.scale.set(1, 1, 1);
  }

  updateTelegraphedAttack(delta, targetDir) {
    if (!this.activeTelegraphedAttack) return false;

    this.aiState = this.activeTelegraphedAttack;
    const targetAngle = Math.atan2(targetDir.x, targetDir.z);
    let diff = targetAngle - this.mesh.rotation.y;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    this.mesh.rotation.y += diff * Math.min(1, delta * 5);

    const previousWindup = this.attackWindupTimer;
    this.attackWindupTimer = Math.max(0, this.attackWindupTimer - delta);
    this.attackRecoveryTimer = Math.max(0, this.attackRecoveryTimer - delta);
    if (previousWindup > 0 && this.attackWindupTimer === 0 && !this.attackImpactConsumed) {
      this.attackImpactReady = true;
    }

    const progress = this.attackWindupDuration > 0
      ? 1 - (this.attackWindupTimer / this.attackWindupDuration)
      : 1;
    if (this.activeTelegraphedAttack === 'attack_tail' && this.tailMesh) {
      this.tailMesh.rotation.y = THREE.MathUtils.lerp(0, 0.72, progress);
      this.tailMesh.rotation.z = -0.12 * Math.sin(progress * Math.PI);
    } else if (this.activeTelegraphedAttack === 'acid_spray') {
      if (this.crownMesh) this.crownMesh.rotation.x = THREE.MathUtils.lerp(0, -0.28, progress);
      const pulse = 1 + Math.sin(progress * Math.PI) * 0.055;
      this.mesh.scale.set(pulse, pulse, pulse);
    }

    if (this.attackRecoveryTimer === 0) {
      this.cancelTelegraphedAttack();
      this.aiState = 'chase';
    }

    this.mesh.position.copy(this.position);
    return true;
  }


  update(delta, playerPos, isPlayerCloaked) {
    if (this.isDead) return;

    if (this.isNetted) {
      this.netTimer -= delta;
      if (this.netTimer <= 0) this.isNetted = false;
      return;
    }

    this.attackCooldown = Math.max(0, this.attackCooldown - delta);
    const distToPlayer = this.position.distanceTo(playerPos);
    const detectRadius = isPlayerCloaked ? 25.0 : 180.0;
    const targetDir = playerPos.clone().sub(this.position).normalize();
    if (this.updateTelegraphedAttack(delta, targetDir)) return;


    if (distToPlayer < detectRadius) {
      this.aiState = 'chase';

      const targetAngle = Math.atan2(targetDir.x, targetDir.z);


      let diff = targetAngle - this.mesh.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      this.mesh.rotation.y += diff * Math.min(1.0, delta * 4.0);

      if (this.attackCooldown <= 0) {
        if (distToPlayer < 9.0) {
          this.aiState = 'attack_jaw';
          audioSynth.playMonsterRoar();
          this.attackCooldown = 2.0;
        } else if (distToPlayer > 12.0 && distToPlayer < 28.0 && this.tailIntact) {
          this.startTelegraphedAttack('attack_tail', 0.58, 3.5);
          audioSynth.playSpearThrow();
        } else if (distToPlayer >= 28.0 && distToPlayer < 60.0) {
          this.startTelegraphedAttack('acid_spray', 0.68, 4.6);
          audioSynth.playAcidSizzle();
        }
      }

      const speed = this.isEnraged ? this.enragedSpeed : this.moveSpeed;
      if (!this.activeTelegraphedAttack && distToPlayer > 6.0) {
        this.position.addScaledVector(targetDir, speed * delta);
      }
    } else {
      this.aiState = 'roam';
    }

    // CLAMP POSITION WITHIN ARENA TERRAIN (800x800)
    this.position.x = Math.max(-330, Math.min(330, this.position.x));
    this.position.z = Math.max(-330, Math.min(330, this.position.z));

    this.mesh.position.copy(this.position);
  }
}
