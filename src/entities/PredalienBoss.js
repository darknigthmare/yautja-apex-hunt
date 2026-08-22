import * as THREE from 'three';
import { ShaderManager } from '../Shaders.js';
import { audioSynth } from '../AudioSynthesizer.js';
import { captureBaseMaterials, overrideMaterials, restoreBaseMaterials } from '../utils/materialState.js';

export class PredalienBoss {
  constructor(scene) {
    this.scene = scene;

    // Predalien Legendary Vitals
    this.maxHealth = 2000;
    this.health = 2000;
    this.isEnraged = false;
    this.isDead = false;
    this.isNetted = false;
    this.netTimer = 0;

    this.headIntact = true;
    this.tailIntact = true;
    this.headHealth = 350;
    this.tailHealth = 400;

    // Movement & AI
    this.position = new THREE.Vector3(0, 0, -50);
    this.rotationY = 0;
    this.moveSpeed = 14.0;
    this.enragedSpeed = 22.0;

    this.aiState = 'roam'; // 'roam', 'chase', 'attack_jaw', 'attack_tail', 'acid_frenzy'
    this.attackCooldown = 0;
    this.activeTelegraphedAttack = null;
    this.attackWindupDuration = 0;
    this.attackWindupTimer = 0;
    this.attackRecoveryTimer = 0;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.attackTelegraphAnnounced = false;

    // 3D Mesh
    this.mesh = this.createPredalienMesh();
    this.scene.add(this.mesh);
    captureBaseMaterials(this.mesh);

    this.headMesh = this.mesh.getObjectByName('predalienHead');
    this.tailMesh = this.mesh.getObjectByName('predalienTail');

    // Materials
    this.normalMaterial = this.mesh.children[0].material;
    this.thermalMaterial = ShaderManager.createThermalMaterial(0xff0055, 1.0);
  }

  createPredalienMesh() {
    const group = new THREE.Group();

    // Dark Metallic Bronze/Black Skin
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x14101a,
      roughness: 0.2,
      metalness: 0.85
    });

    const acidMat = new THREE.MeshBasicMaterial({ color: 0x00ff44 });
    const mandibleMat = new THREE.MeshStandardMaterial({ color: 0x443322, roughness: 0.5 });

    // 1. Torso & Ribcage
    const torsoGeo = new THREE.BoxGeometry(5.5, 6.0, 10);
    const torso = new THREE.Mesh(torsoGeo, bodyMat);
    torso.position.y = 6.5;
    torso.castShadow = true;
    group.add(torso);

    // 2. Dome Head + Yautja Mandibles & Dreadlocks!
    const headGroup = new THREE.Group();
    headGroup.name = 'predalienHead';

    const domeGeo = new THREE.ConeGeometry(3.5, 8.5, 5);
    domeGeo.rotateX(-Math.PI / 2.5);
    const dome = new THREE.Mesh(domeGeo, bodyMat);
    dome.position.set(0, 10.0, 5.0);
    dome.castShadow = true;
    headGroup.add(dome);

    // Yautja Mandibles on Jaw
    for (let side of [-1, 1]) {
      const mandGeo = new THREE.ConeGeometry(0.5, 2.5, 4);
      const mand = new THREE.Mesh(mandGeo, mandibleMat);
      mand.rotation.z = side * Math.PI / 4;
      mand.position.set(side * 1.8, 8.5, 9.0);
      headGroup.add(mand);
    }

    // Biomechanical Dreadlocks
    const dreadMat = new THREE.MeshStandardMaterial({ color: 0x08080a });
    for (let i = -5; i <= 5; i++) {
      const dread = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.08, 3.5, 6), dreadMat);
      dread.rotation.x = -Math.PI / 3;
      dread.position.set(i * 0.3, 9.5, 1.5);
      headGroup.add(dread);
    }

    // Inner Jaw
    const innerJaw = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3.5), acidMat);
    innerJaw.rotation.x = Math.PI / 2;
    innerJaw.position.set(0, 8.5, 10.5);
    headGroup.add(innerJaw);

    group.add(headGroup);

    // 3. Four Massive Claw Arms
    const armGeo = new THREE.CylinderGeometry(0.8, 0.6, 8.0);
    const armR = new THREE.Mesh(armGeo, bodyMat);
    armR.position.set(3.8, 6.0, 4.0);
    armR.rotation.z = -Math.PI / 4;
    group.add(armR);

    const armL = new THREE.Mesh(armGeo, bodyMat);
    armL.position.set(-3.8, 6.0, 4.0);
    armL.rotation.z = Math.PI / 4;
    group.add(armL);

    // 4. Quadrupedal Legs
    const legGeo = new THREE.CylinderGeometry(1.1, 0.8, 7.5);
    const legPositions = [
      [3.5, 3.8, 3.0], [-3.5, 3.8, 3.0],
      [3.5, 3.8, -4.0], [-3.5, 3.8, -4.0]
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, bodyMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      group.add(leg);
    });

    // 5. Heavy Barbed Spear Tail
    const tailGroup = new THREE.Group();
    tailGroup.name = 'predalienTail';

    for (let i = 0; i < 7; i++) {
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.8 - i * 0.08, 0.9 - i * 0.08, 3.5), bodyMat);
      seg.rotation.x = -Math.PI / 3;
      seg.position.set(0, 5.5 - i * 0.5, -5.5 - i * 2.5);
      seg.castShadow = true;
      tailGroup.add(seg);
    }

    const spearTip = new THREE.Mesh(new THREE.ConeGeometry(1.0, 4.5, 4), bodyMat);
    spearTip.rotation.x = -Math.PI / 2;
    spearTip.position.set(0, 2.0, -23.0);
    tailGroup.add(spearTip);

    group.add(tailGroup);

    group.position.copy(this.position);
    return group;
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

    const distToHead = hitPosition.distanceTo(this.position.clone().add(new THREE.Vector3(0, 10, 5)));
    if (distToHead < 5.0 && this.headIntact) {
      this.headHealth -= amount;
      if (this.headHealth <= 0) {
        this.headIntact = false;
        if (this.headMesh) this.headMesh.visible = false;
        if (this.activeTelegraphedAttack === 'acid_frenzy') this.cancelTelegraphedAttack();
        audioSynth.playMonsterRoar();
      }
    }

    const distToTail = hitPosition.distanceTo(this.position.clone().add(new THREE.Vector3(0, 2, -18)));
    if (distToTail < 6.0 && this.tailIntact) {
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
    this.netTimer = 3.0;
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
    if (this.headMesh) this.headMesh.rotation.set(0, 0, 0);
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
      this.tailMesh.rotation.y = THREE.MathUtils.lerp(0, -0.82, progress);
      this.tailMesh.rotation.z = 0.15 * Math.sin(progress * Math.PI);
    } else if (this.activeTelegraphedAttack === 'acid_frenzy') {
      if (this.headMesh) this.headMesh.rotation.x = THREE.MathUtils.lerp(0, -0.34, progress);
      const pulse = 1 + Math.sin(progress * Math.PI * 3) * 0.045;
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
    const detectRadius = isPlayerCloaked ? 25.0 : 90.0;
    const targetDir = playerPos.clone().sub(this.position).normalize();
    if (this.updateTelegraphedAttack(delta, targetDir)) return;


    if (distToPlayer < detectRadius) {
      this.aiState = 'chase';

      const targetAngle = Math.atan2(targetDir.x, targetDir.z);
      this.mesh.rotation.y = THREE.MathUtils.lerp(this.mesh.rotation.y, targetAngle, delta * 4.0);

      if (this.attackCooldown <= 0) {
        if (this.isEnraged && this.headIntact && distToPlayer < 24.0) {
          this.startTelegraphedAttack('acid_frenzy', 0.52, 4.2);
          audioSynth.playAcidSizzle();
        } else if (distToPlayer < 10.0) {
          this.aiState = 'attack_jaw';
          audioSynth.playMonsterRoar();
          this.attackCooldown = 1.8;
        } else if (distToPlayer > 14.0 && distToPlayer < 32.0 && this.tailIntact) {
          this.startTelegraphedAttack('attack_tail', 0.52, 3.2);
          audioSynth.playSpearThrow();
        }
      }

      const speed = this.isEnraged ? this.enragedSpeed : this.moveSpeed;
      if (!this.activeTelegraphedAttack) this.position.addScaledVector(targetDir, speed * delta);
    } else {
      this.aiState = 'roam';
    }

    this.mesh.position.copy(this.position);
  }
}
