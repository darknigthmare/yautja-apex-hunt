import * as THREE from 'three';
import { ShaderManager } from '../Shaders.js';
import { audioSynth } from '../AudioSynthesizer.js';

export class BadBloodRival {
  constructor(scene) {
    this.scene = scene;

    // Vitals
    this.maxHealth = 800;
    this.health = 800;
    this.isDead = false;
    this.isCloaked = true;
    this.isNetted = false;
    this.netTimer = 0;

    // Movement & AI
    this.position = new THREE.Vector3(-30, 0, -30);
    this.rotationY = 0;
    this.moveSpeed = 18.0;

    this.aiState = 'stalk'; // 'stalk', 'plasmacaster', 'melee', 'dodge'
    this.attackCooldown = 0;
    this.projectiles = [];

    // Mesh
    this.mesh = this.createRivalMesh();
    this.scene.add(this.mesh);

    this.normalMaterial = this.mesh.children[0].material;
    this.cloakMaterial = ShaderManager.createCloakMaterial();

    // Start cloaked
    this.mesh.traverse((child) => {
      if (child.isMesh) child.material = this.cloakMaterial;
    });
  }

  createRivalMesh() {
    const rivalGroup = new THREE.Group();

    // Dark Crimson Armor
    const armorMat = new THREE.MeshStandardMaterial({
      color: 0x440808,
      metalness: 0.85,
      roughness: 0.3
    });

    // Dark Skin
    const skinMat = new THREE.MeshStandardMaterial({ color: 0x221a14, roughness: 0.8 });

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.2, 1.4), armorMat);
    torso.position.y = 3.6;
    torso.castShadow = true;
    rivalGroup.add(torso);

    // Scarred Bio-Mask
    const maskMat = new THREE.MeshStandardMaterial({ color: 0x1a1212, metalness: 0.9 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 16), maskMat);
    head.position.set(0, 5.5, 0.2);
    rivalGroup.add(head);

    // Red Laser Eye Emitter
    const eyeLight = new THREE.PointLight(0xff0000, 3, 10);
    eyeLight.position.set(0.4, 5.6, 0.8);
    rivalGroup.add(eyeLight);

    // Plasmacaster Shoulder Cannon
    const caster = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 1.2), armorMat);
    caster.position.set(-1.4, 4.8, 0);
    rivalGroup.add(caster);

    // Dual Wristblades
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xff4444, metalness: 0.9 });
    const bladeR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 2.4), bladeMat);
    bladeR.position.set(1.6, 2.5, 1.3);
    rivalGroup.add(bladeR);

    // Legs & Arms
    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 2.8), skinMat);
    armR.position.set(1.6, 3.8, 0);
    rivalGroup.add(armR);

    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 3.2), armorMat);
    legR.position.set(0.7, 1.6, 0);
    rivalGroup.add(legR);
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 3.2), armorMat);
    legL.position.set(-0.7, 1.6, 0);
    rivalGroup.add(legL);

    rivalGroup.position.copy(this.position);
    return rivalGroup;
  }

  takeDamage(amount) {
    if (this.isDead) return;

    this.health = Math.max(0, this.health - amount);
    
    // Uncloak temporarily on taking damage!
    this.isCloaked = false;
    this.mesh.traverse((child) => {
      if (child.isMesh) child.material = this.normalMaterial;
    });

    setTimeout(() => {
      if (!this.isDead) {
        this.isCloaked = true;
        this.mesh.traverse((child) => {
          if (child.isMesh) child.material = this.cloakMaterial;
        });
      }
    }, 3000);

    if (this.health <= 0) {
      this.isDead = true;
      audioSynth.playYautjaClick();
    }
  }

  applyNet() {
    this.isNetted = true;
    this.netTimer = 3.0;
  }

  update(delta, playerPos) {
    if (this.isDead) return;

    if (this.isNetted) {
      this.netTimer -= delta;
      if (this.netTimer <= 0) this.isNetted = false;
      return;
    }

    this.attackCooldown = Math.max(0, this.attackCooldown - delta);
    const distToPlayer = this.position.distanceTo(playerPos);

    // AI Stalk & Strike
    const targetDir = playerPos.clone().sub(this.position).normalize();
    const targetAngle = Math.atan2(targetDir.x, targetDir.z);
    this.mesh.rotation.y = THREE.MathUtils.lerp(this.mesh.rotation.y, targetAngle, delta * 4.0);

    if (this.attackCooldown <= 0) {
      if (distToPlayer < 7.0) {
        // Wristblade Melee Duel
        this.aiState = 'melee';
        audioSynth.playWristbladeSlash();
        this.attackCooldown = 1.8;
      } else if (distToPlayer > 15.0 && distToPlayer < 40.0) {
        // Shoulder Plasmacaster Snipe
        this.aiState = 'plasmacaster';
        audioSynth.playPlasmacasterBlast();
        this.firePlasma(playerPos);
        this.attackCooldown = 3.0;
      }
    }

    // Movement
    this.position.addScaledVector(targetDir, this.moveSpeed * delta);
    this.mesh.position.copy(this.position);

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.mesh.position.addScaledVector(p.dir, p.speed * delta);
      p.lifetime -= delta;
      if (p.lifetime <= 0) {
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
      }
    }
  }

  firePlasma(targetPos) {
    const ballGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const ballMat = ShaderManager.createPlasmaMaterial();
    const ball = new THREE.Mesh(ballGeo, ballMat);

    ball.position.copy(this.position).add(new THREE.Vector3(0, 4.5, 0));
    const dir = targetPos.clone().sub(ball.position).normalize();

    this.projectiles.push({ mesh: ball, dir, speed: 60, damage: 35, lifetime: 3.0 });
    this.scene.add(ball);
  }
}
