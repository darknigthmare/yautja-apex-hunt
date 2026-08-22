import * as THREE from 'three';
import { ShaderManager } from '../Shaders.js';
import { audioSynth } from '../AudioSynthesizer.js';
import { YautjaSkinsDatabase } from '../data/YautjaLoreDatabase.js';
import { calculateHonorAward } from '../gameplay/combatRules.js';
import { disposeObject3D } from '../utils/materialState.js';

export class YautjaPlayer {
  constructor(scene) {
    this.scene = scene;

    // Attributes
    this.maxHealth = 100;
    this.health = 100;
    this.maxEnergy = 100;
    this.energy = 100;
    this.maxStamina = 100;
    this.stamina = 100;
    this.honorScore = 1000;
    this.honorRankIndex = 1;
    this.completedHunts = [];

    this.ranks = [
      "JEUNE SANG (YOUNG BLOOD)",
      "SANG DU CHASSEUR (BLOODED)",
      "CHASSEUR D'ÉLITE (ELITE PREDATOR)",
      "ANCIEN MAÎTRE (YAUTJA ELDER)"
    ];

    this.currentSkinId = 'jungle_1987';

    // Forge Upgrades
    this.hasTriBeam = false;
    this.hasAntiAcidCloak = false;
    this.hasScopeZoom = false;

    // State Flags
    this.isCloaked = false;
    this.activeVisionMode = 'thermal';
    this.selectedWeapon = 1;
    this.isAttacking = false;
    this.isHealing = false;
    this.attackTimer = 0;
    this.healTimer = 0;
    this.isPerched = false;
    this.currentPerchNode = null;
    this.isAcidCorroded = false;
    this.acidTimer = 0;

    // QTE State
    this.inQTE = false;
    this.qteTimer = 0;

    this.isSelfDestructing = false;
    this.selfDestructTimer = 0;
    this.selfDestructComplete = false;
    this.isDead = false;
    this.defeatReason = null;

    // Movement Vectors
    this.position = new THREE.Vector3(0, 0, 40);
    this.moveSpeed = 16.0;
    this.sprintSpeed = 26.0;

    this.projectiles = [];
    this.mines = [];

    // Mesh
    this.mesh = this.createYautjaMesh();
    this.scene.add(this.mesh);

    this.mesh.traverse((child) => {
      if (child.isMesh) child.userData.baseMaterial = child.material;
    });
    this.normalMaterial = this.mesh.children[0].material;
    this.cloakMaterial = ShaderManager.createCloakMaterial();
  }

  createYautjaMesh() {
    const yautjaGroup = new THREE.Group();

    const skinData = YautjaSkinsDatabase.find(s => s.id === this.currentSkinId) || YautjaSkinsDatabase[0];

    const armorMat = new THREE.MeshStandardMaterial({
      color: skinData.col,
      metalness: 0.9,
      roughness: 0.25
    });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0x4a4436, roughness: 0.65 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffb700, metalness: 0.95, roughness: 0.1 });

    const torsoGeo = new THREE.BoxGeometry(2.4, 3.4, 1.5);
    const torso = new THREE.Mesh(torsoGeo, armorMat);
    torso.position.y = 3.6;
    torso.castShadow = true;
    torso.userData.skinTintable = true;
    yautjaGroup.add(torso);

    const netGeo = new THREE.BoxGeometry(2.45, 3.45, 1.55);
    const netMat = new THREE.MeshBasicMaterial({ color: 0x111111, wireframe: true });
    const net = new THREE.Mesh(netGeo, netMat);
    net.position.y = 3.6;
    yautjaGroup.add(net);

    const headGroup = new THREE.Group();
    const headGeo = new THREE.SphereGeometry(0.95, 24, 24);
    headGeo.scale(1, 1.25, 1.15);
    const maskMat = new THREE.MeshStandardMaterial({ color: skinData.col, metalness: 0.95, roughness: 0.2 });
    const head = new THREE.Mesh(headGeo, maskMat);
    head.position.set(0, 5.5, 0.2);
    head.castShadow = true;
    head.userData.skinTintable = true;
    headGroup.add(head);

    const runePlateGeo = new THREE.BoxGeometry(0.5, 0.3, 0.1);
    const runePlate = new THREE.Mesh(runePlateGeo, goldMat);
    runePlate.position.set(0, 6.2, 1.15);
    headGroup.add(runePlate);

    const triLaserLight = new THREE.PointLight(0xff0000, 3, 10);
    triLaserLight.position.set(0.65, 5.7, 1.0);
    headGroup.add(triLaserLight);

    const lensGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.set(0.65, 5.7, 1.05);
    headGroup.add(lens);

    yautjaGroup.add(headGroup);

    const dreadMat = new THREE.MeshStandardMaterial({ color: 0x0c0c0e, roughness: 0.8 });
    for (let i = -5; i <= 5; i++) {
      const dreadGroup = new THREE.Group();
      const dread = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.06, 2.8, 8), dreadMat);
      dread.position.y = -1.4;
      dreadGroup.add(dread);

      for (let b = 0; b < 2; b++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.04, 6, 12), goldMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -0.6 - b * 0.9;
        dreadGroup.add(ring);
      }

      dreadGroup.rotation.z = i * 0.18;
      dreadGroup.rotation.x = -0.4;
      dreadGroup.position.set(i * 0.2, 5.4, -0.5);
      yautjaGroup.add(dreadGroup);
    }

    const caster = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.9), armorMat);
    caster.position.set(-1.5, 4.9, -0.2);
    caster.userData.skinTintable = true;
    yautjaGroup.add(caster);
    this.plasmacasterMesh = caster;

    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 1.0, roughness: 0.1 });
    const bladeGeo = new THREE.BoxGeometry(0.12, 0.05, 2.4);

    this.wristbladeRight = new THREE.Mesh(bladeGeo, bladeMat);
    this.wristbladeRight.position.set(1.65, 2.5, 1.3);
    yautjaGroup.add(this.wristbladeRight);

    this.wristbladeLeft = new THREE.Mesh(bladeGeo, bladeMat);
    this.wristbladeLeft.position.set(-1.65, 2.5, 1.3);
    yautjaGroup.add(this.wristbladeLeft);

    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.42, 3.4), armorMat);
    legR.position.set(0.75, 1.7, 0);
    legR.userData.skinTintable = true;
    yautjaGroup.add(legR);
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.42, 3.4), armorMat);
    legL.position.set(-0.75, 1.7, 0);
    legL.userData.skinTintable = true;
    yautjaGroup.add(legL);

    yautjaGroup.position.copy(this.position);
    return yautjaGroup;
  }

  setSkin(skinId) {
    this.currentSkinId = skinId;
    const skinData = YautjaSkinsDatabase.find(s => s.id === skinId);
    if (!skinData) return;

    this.mesh.traverse((child) => {
      if (child.isMesh && child.userData.skinTintable && child.material !== this.cloakMaterial) {
        child.material.color.setHex(skinData.col);
        child.userData.baseMaterial = child.material;
      }
    });
  }

  triggerVictoryRoar() {
    audioSynth.playVictoryRoar();
    this.energy = Math.min(this.maxEnergy, this.energy + 40);
    this.stamina = this.maxStamina;
  }

  triggerVoiceMimicry(lureType = 'over_here') {
    audioSynth.playMimicryLure(lureType);
  }

  cycleVisionMode() {
    if (this.activeVisionMode === 'normal') this.activeVisionMode = 'thermal';
    else if (this.activeVisionMode === 'thermal') this.activeVisionMode = 'tech';
    else this.activeVisionMode = 'normal';

    audioSynth.playThermalSwitch();
    audioSynth.playYautjaClick();
    return this.activeVisionMode;
  }

  toggleCloak() {
    if (this.isAcidCorroded && !this.hasAntiAcidCloak) return false;

    this.isCloaked = !this.isCloaked;
    audioSynth.playThermalSwitch();

    this.mesh.traverse((child) => {
      if (!child.isMesh) return;
      if (this.isCloaked) {
        child.userData.materialBeforeCloak = child.material;
        child.material = this.cloakMaterial;
      } else {
        child.material = child.userData.materialBeforeCloak ?? child.userData.baseMaterial ?? child.material;
        delete child.userData.materialBeforeCloak;
      }
    });

    return this.isCloaked;
  }

  applyAcidCorrosion() {
    if (this.hasAntiAcidCloak) return;
    this.isAcidCorroded = true;
    this.acidTimer = 5.0;
    if (this.isCloaked) this.toggleCloak();
    audioSynth.playAcidSizzle();
  }

  triggerQTE() {
    if (this.inQTE) return;
    this.inQTE = true;
    this.qteTimer = 2.5;
    audioSynth.playAcidSizzle();
  }

  resolveQTE(success) {
    if (!this.inQTE) return false;
    this.inQTE = false;

    if (success) {
      audioSynth.playWristbladeSlash();
      this.addHonor(150);
    } else {
      this.takeDamage(35);
    }
    return success;
  }

  jumpToCanopy(perchNodes) {
    if (this.isPerched) {
      this.isPerched = false;
      this.position.y = 0;
      audioSynth.playCanopyLeap();
      return false;
    }

    let closestNode = null;
    let minDist = 45.0;

    perchNodes.forEach(node => {
      const dist = new THREE.Vector2(this.position.x, this.position.z).distanceTo(new THREE.Vector2(node.x, node.z));
      if (dist < minDist) {
        minDist = dist;
        closestNode = node;
      }
    });

    if (closestNode) {
      this.isPerched = true;
      this.currentPerchNode = closestNode;
      this.position.set(closestNode.x, closestNode.y, closestNode.z);
      audioSynth.playCanopyLeap();
      return true;
    }
    return false;
  }

  attack(targetPos) {
    if (this.isAttacking || this.isHealing || this.inQTE) return;

    if (this.isPerched) {
      this.isAttacking = true;
      this.isPerched = false;
      this.position.y = 0;
      audioSynth.playWristbladeSlash();
      audioSynth.playCanopyLeap();
      this.attackTimer = 0.5;
      return 'death_from_above';
    }

    if (this.selectedWeapon === 1) {
      this.isAttacking = true;
      audioSynth.playWristbladeSlash();
      this.wristbladeRight.position.z = 1.8;
      this.wristbladeLeft.position.z = 1.8;
      this.attackTimer = 0.4;
      return 'wristblades';
    }
    else if (this.selectedWeapon === 2) {
      if (this.energy < 25) return;
      this.energy -= 25;
      this.isAttacking = true;
      audioSynth.playPlasmacasterBlast();
      this.firePlasmaBall(targetPos);
      this.attackTimer = 0.6;
    }
    else if (this.selectedWeapon === 3) {
      this.isAttacking = true;
      audioSynth.playSpearThrow();
      this.fireCombiStick(targetPos);
      this.attackTimer = 0.5;
    }
    else if (this.selectedWeapon === 4) {
      this.isAttacking = true;
      audioSynth.playSpearThrow();
      this.fireSmartDisc(targetPos);
      this.attackTimer = 0.5;
    }
    else if (this.selectedWeapon === 5) {
      if (this.energy < 15) return;
      this.energy -= 15;
      this.isAttacking = true;
      audioSynth.playSpearThrow();
      this.fireNetgun(targetPos);
      this.attackTimer = 0.5;
    }
    else if (this.selectedWeapon === 6) {
      if (this.energy < 50 || this.health >= this.maxHealth) return;
      this.energy -= 50;
      this.isHealing = true;
      audioSynth.playMedicompHeal();
      this.healTimer = 1.2;
    }
    else if (this.selectedWeapon === 7) {
      if (this.energy < 20) return;
      this.energy -= 20;
      this.deployPlasmaMine();
    }
    else if (this.selectedWeapon === 8) {
      this.isAttacking = true;
      audioSynth.playWhipSlash();
      this.attackTimer = 0.4;
      return 'whip_slash';
    }
  }

  deployPlasmaMine() {
    const mineGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 12);
    const mineMat = new THREE.MeshBasicMaterial({ color: 0xff3300 });
    const mine = new THREE.Mesh(mineGeo, mineMat);
    mine.position.copy(this.position).add(new THREE.Vector3(0, 0.1, 0));

    this.mines.push({ mesh: mine, damage: 120 });
    this.scene.add(mine);
    audioSynth.playBeep();
  }

  firePlasmaBall(targetPos) {
    const spawnPos = new THREE.Vector3();
    this.plasmacasterMesh.getWorldPosition(spawnPos);

    if (this.hasTriBeam) {
      for (let offset of [-0.3, 0, 0.3]) {
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), ShaderManager.createPlasmaMaterial());
        ball.position.copy(spawnPos);
        const dir = targetPos.clone().sub(spawnPos).normalize();
        dir.x += offset;
        dir.normalize();
        this.projectiles.push({ mesh: ball, dir, speed: 65, type: 'plasma', damage: 40, lifetime: 3.0 });
        this.scene.add(ball);
      }
    } else {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), ShaderManager.createPlasmaMaterial());
      ball.position.copy(spawnPos);
      const dir = targetPos.clone().sub(spawnPos).normalize();
      this.projectiles.push({ mesh: ball, dir, speed: 65, type: 'plasma', damage: 45, lifetime: 3.0 });
      this.scene.add(ball);
    }
  }

  fireCombiStick(targetPos) {
    const spearGeo = new THREE.CylinderGeometry(0.08, 0.08, 4.0);
    spearGeo.rotateX(Math.PI / 2);
    const spear = new THREE.Mesh(spearGeo, new THREE.MeshStandardMaterial({ color: 0x8899aa }));
    spear.position.copy(this.mesh.position).add(new THREE.Vector3(0, 4, 0));
    const dir = targetPos.clone().sub(spear.position).normalize();
    this.projectiles.push({ mesh: spear, dir, speed: 80, type: 'spear', damage: 65, lifetime: 2.5 });
    this.scene.add(spear);
  }

  fireSmartDisc(targetPos) {
    const disc = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.15, 8, 24), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
    disc.position.copy(this.mesh.position).add(new THREE.Vector3(0, 4, 0));
    const dir = targetPos.clone().sub(disc.position).normalize();
    this.projectiles.push({ mesh: disc, dir, speed: 55, type: 'disc', damage: 50, lifetime: 3.5 });
    this.scene.add(disc);
  }

  fireNetgun(targetPos) {
    const net = new THREE.Mesh(new THREE.RingGeometry(0.5, 2.2, 8), new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true }));
    net.position.copy(this.mesh.position).add(new THREE.Vector3(0, 4, 0));
    const dir = targetPos.clone().sub(net.position).normalize();
    this.projectiles.push({ mesh: net, dir, speed: 45, type: 'net', damage: 15, isNet: true, lifetime: 3.0 });
    this.scene.add(net);
  }

  triggerSelfDestruct() {
    if (this.isSelfDestructing || this.isDead || this.selfDestructComplete) return false;
    this.isSelfDestructing = true;
    this.selfDestructTimer = 4.0;
    return true;
  }

  takeDamage(amount) {
    if (this.isDead || this.selfDestructComplete) return;
    this.health = Math.max(0, this.health - amount);
    if (this.health <= 0 && !this.isSelfDestructing) {
      this.defeatReason = 'blessures';
      this.triggerSelfDestruct();
    }
  }

  addHonor(pts) {
    const awarded = calculateHonorAward(pts, this.isCloaked);
    this.honorScore += awarded;

    if (this.honorScore >= 3000) this.honorRankIndex = 3;
    else if (this.honorScore >= 1800) this.honorRankIndex = 2;
    else if (this.honorScore >= 800) this.honorRankIndex = 1;
    return awarded;
  }

  resetForHunt(position = new THREE.Vector3(0, 0, 60)) {
    this.projectiles.forEach((projectile) => disposeObject3D(projectile.mesh));
    this.mines.forEach((mine) => disposeObject3D(mine.mesh));
    this.projectiles = [];
    this.mines = [];

    this.isAcidCorroded = false;
    if (this.isCloaked) this.toggleCloak();
    this.health = this.maxHealth;
    this.energy = this.maxEnergy;
    this.stamina = this.maxStamina;
    this.isAttacking = false;
    this.isHealing = false;
    this.isPerched = false;
    this.attackTimer = 0;
    this.healTimer = 0;
    this.wristbladeRight.position.z = 1.3;
    this.wristbladeLeft.position.z = 1.3;
    this.currentPerchNode = null;
    this.inQTE = false;
    this.qteTimer = 0;
    this.acidTimer = 0;
    this.isSelfDestructing = false;
    this.selfDestructTimer = 0;
    this.selfDestructComplete = false;
    this.isDead = false;
    this.defeatReason = null;
    this.position.copy(position);
    this.mesh.position.copy(this.position);
    this.mesh.visible = true;
  }

  update(delta, inputDir, cameraYaw) {
    if (this.isDead) return;
    const hasMovementInput = inputDir.x !== 0 || inputDir.z !== 0;
    if (this.energy < this.maxEnergy) this.energy = Math.min(this.maxEnergy, this.energy + delta * 8.0);
    if (this.stamina < this.maxStamina && !(inputDir.isSprinting && hasMovementInput)) this.stamina = Math.min(this.maxStamina, this.stamina + delta * 25.0);

    if (this.attackTimer > 0) {
      this.attackTimer = Math.max(0, this.attackTimer - delta);
      if (this.attackTimer === 0) {
        this.isAttacking = false;
        this.wristbladeRight.position.z = 1.3;
        this.wristbladeLeft.position.z = 1.3;
      }
    }

    if (this.healTimer > 0) {
      this.healTimer = Math.max(0, this.healTimer - delta);
      if (this.healTimer === 0) {
        this.health = Math.min(this.maxHealth, this.health + 45);
        this.isHealing = false;
      }
    }

    if (this.inQTE) {
      this.qteTimer -= delta;
      if (this.qteTimer <= 0) this.resolveQTE(false);
    }

    if (this.isAcidCorroded) {
      this.acidTimer -= delta;
      this.takeDamage(delta * 4.0);
      if (this.acidTimer <= 0) this.isAcidCorroded = false;
    }

    if (this.isCloaked) {
      this.energy -= delta * 12.0;
      if (this.energy <= 0) this.toggleCloak();
    }

    if (this.isSelfDestructing) {
      this.selfDestructTimer -= delta;
      if (this.selfDestructTimer <= 0) {
        this.isSelfDestructing = false;
        this.selfDestructComplete = true;
        this.isDead = true;
        this.health = 0;
        audioSynth.playExplosion();
      }
    }

    if (!this.isHealing && !this.isSelfDestructing && !this.isPerched && !this.inQTE) {
      const isSprinting = inputDir.isSprinting && hasMovementInput && this.stamina > 10;
      const speed = isSprinting ? this.sprintSpeed : this.moveSpeed;
      if (isSprinting) this.stamina = Math.max(0, this.stamina - delta * 30.0);

      if (hasMovementInput) {
        const moveVector = new THREE.Vector3(inputDir.x, 0, inputDir.z).normalize();
        moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraYaw);

        this.position.addScaledVector(moveVector, speed * delta);

        // CLAMP PLAYER POSITION TO STAY WITHIN THE 800x800 TERRAIN ARENA!
        this.position.x = Math.max(-330, Math.min(330, this.position.x));
        this.position.z = Math.max(-330, Math.min(330, this.position.z));

        const targetAngle = Math.atan2(moveVector.x, moveVector.z);
        let diff = targetAngle - this.mesh.rotation.y;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        this.mesh.rotation.y += diff * Math.min(1.0, delta * 14.0);
      }
    }

    this.mesh.position.copy(this.position);

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      if (p.type === 'disc' && p.lifetime < 1.8) {
        const returnDir = this.position.clone().add(new THREE.Vector3(0, 3, 0)).sub(p.mesh.position).normalize();
        p.dir.lerp(returnDir, delta * 5.0);
        if (p.mesh.position.distanceTo(this.position) < 3.0) {
          this.energy = Math.min(this.maxEnergy, this.energy + 15);
          disposeObject3D(p.mesh);
          this.projectiles.splice(i, 1);
          continue;
        }
      }
      p.mesh.position.addScaledVector(p.dir, p.speed * delta);
      p.lifetime -= delta;
      if (p.lifetime <= 0) {
        disposeObject3D(p.mesh);
        this.projectiles.splice(i, 1);
      }
    }
  }
}
