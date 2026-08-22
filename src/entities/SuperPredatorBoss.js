import * as THREE from 'three';
import { audioSynth } from '../AudioSynthesizer.js';
import { ShaderManager } from '../Shaders.js';
import {
  captureBaseMaterials,
  disposeObject3D,
  overrideMaterials,
  restoreBaseMaterials,
} from '../utils/materialState.js';

export const SUPER_PREDATOR_TEXTURES = Object.freeze({
  mask: '/assets/textures/biomask-etched-alloy.webp',
  skin: '/assets/textures/yautja-skin-mottled.webp',
});

function loadBrowserTexture(path) {
  // TextureLoader depends on browser image primitives. Boss construction must
  // remain usable by the Node simulation tests and server-side tooling.
  if (typeof document === 'undefined' || typeof document.createElementNS !== 'function') return null;

  try {
    const texture = new THREE.TextureLoader().load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.4, 1.4);
    return texture;
  } catch {
    return null;
  }
}

function addMesh(parent, geometry, material, {
  name = '',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  castShadow = true,
  visionExempt = false,
} = {}) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...scale);
  mesh.castShadow = castShadow;
  mesh.userData.visionExempt = visionExempt;
  parent.add(mesh);
  return mesh;
}

/**
 * Chasseur rival massif inspiré de l'archétype Super Predator.
 * Sa silhouette, son masque mandibulaire et son armure sont des créations
 * procédurales originales destinées au jeu, et non la reproduction d'un asset.
 */
export class SuperPredatorBoss {
  constructor(scene) {
    if (!scene?.add) throw new TypeError('SuperPredatorBoss requiert une scène THREE valide.');

    this.scene = scene;

    // Interface commune des boss.
    this.maxHealth = 1800;
    this.health = this.maxHealth;
    this.isDead = false;
    this.isEnraged = false;
    this.isNetted = false;
    this.netTimer = 0;
    this.aiState = 'stalk';
    this.attackCooldown = 0;
    this.projectiles = [];
    this.colliderRadius = 5.5;

    // État lisible par le HUD et la résolution du trophée.
    this.maskIntact = true;
    this.trophyIntegrity = 100;

    this.position = new THREE.Vector3(0, 0, -52);
    this.moveSpeed = 12.5;
    this.enragedSpeed = 18.5;
    this.chargeSpeed = 39;
    this.chargeTimer = 0;
    this.chargeDirection = new THREE.Vector3(0, 0, 1);
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.attackTelegraphAnnounced = false;

    this.loadedTextures = {
      mask: loadBrowserTexture(SUPER_PREDATOR_TEXTURES.mask),
      skin: loadBrowserTexture(SUPER_PREDATOR_TEXTURES.skin),
    };

    this.mesh = this.createBossMesh();
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);
    captureBaseMaterials(this.mesh);

    this.maskMesh = this.mesh.getObjectByName('superPredatorMask');
    this.revealedFaceMesh = this.mesh.getObjectByName('superPredatorRevealedFace');
    this.casterYaw = this.mesh.getObjectByName('superPredatorCasterYaw');
    this.thermalMaterial = ShaderManager.createThermalMaterial(0xff3b18, 0.96);
  }

  createBossMesh() {
    const group = new THREE.Group();
    group.name = 'superPredatorBoss';

    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a2a22,
      map: this.loadedTextures.skin,
      roughness: 0.82,
      metalness: 0.05,
    });
    const blackArmorMaterial = new THREE.MeshStandardMaterial({
      color: 0x090a0d,
      roughness: 0.27,
      metalness: 0.88,
    });
    const redArmorMaterial = new THREE.MeshStandardMaterial({
      color: 0x5b0808,
      roughness: 0.3,
      metalness: 0.82,
    });
    const boneMaskMaterial = new THREE.MeshStandardMaterial({
      color: 0xb7a67a,
      map: this.loadedTextures.mask,
      roughness: 0.48,
      metalness: 0.42,
    });
    const dreadMaterial = new THREE.MeshStandardMaterial({
      color: 0x070709,
      roughness: 0.9,
      metalness: 0.08,
    });
    const bladeMaterial = new THREE.MeshStandardMaterial({
      color: 0xa8c4c7,
      roughness: 0.18,
      metalness: 1,
    });
    const plasmaGlowMaterial = new THREE.MeshBasicMaterial({ color: 0x9a28ff });

    // Tronc large, taille haute et plaques asymétriques donnent une lecture
    // immédiate différente du Bad Blood plus mince déjà présent dans le jeu.
    addMesh(group, new THREE.CapsuleGeometry(2.25, 4.4, 7, 12), skinMaterial, {
      name: 'superPredatorTorso',
      position: [0, 5.45, 0],
      scale: [1.28, 1, 0.82],
    });
    addMesh(group, new THREE.BoxGeometry(4.9, 2.7, 2.5), blackArmorMaterial, {
      position: [0, 6.65, -0.05],
      rotation: [-0.04, 0, 0],
    });
    addMesh(group, new THREE.BoxGeometry(5.2, 0.55, 2.9), redArmorMaterial, {
      position: [0, 7.75, 0],
      rotation: [-0.05, 0, 0.02],
    });
    addMesh(group, new THREE.BoxGeometry(2.25, 1.25, 2.7), redArmorMaterial, {
      position: [-1.42, 5.7, 0.25],
      rotation: [0.06, -0.12, -0.08],
    });
    addMesh(group, new THREE.BoxGeometry(2.05, 1.05, 2.65), blackArmorMaterial, {
      position: [1.5, 5.55, 0.2],
      rotation: [0.08, 0.14, 0.1],
    });

    // Cou et tête sont séparés afin que la perte du masque révèle réellement
    // un visage balafré au lieu de simplement changer une couleur.
    addMesh(group, new THREE.CylinderGeometry(0.85, 1.1, 1.5, 10), skinMaterial, {
      position: [0, 8.15, 0],
    });
    addMesh(group, new THREE.SphereGeometry(1.22, 14, 12), skinMaterial, {
      name: 'superPredatorRevealedFace',
      position: [0, 9.35, 0.32],
      scale: [1.08, 1.12, 0.86],
    });

    const maskGroup = new THREE.Group();
    maskGroup.name = 'superPredatorMask';
    maskGroup.position.set(0, 9.45, 1.03);
    addMesh(maskGroup, new THREE.SphereGeometry(1.25, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.67), boneMaskMaterial, {
      scale: [1.18, 1.12, 0.58],
    });
    addMesh(maskGroup, new THREE.BoxGeometry(2.95, 0.32, 0.45), redArmorMaterial, {
      position: [0, 0.28, 0.58],
      rotation: [0, 0, -0.03],
    });
    for (const side of [-1, 1]) {
      addMesh(maskGroup, new THREE.ConeGeometry(0.28, 1.55, 5), boneMaskMaterial, {
        position: [side * 0.84, -0.9, 0.72],
        rotation: [0.24, 0, side * 0.48],
      });
      addMesh(maskGroup, new THREE.ConeGeometry(0.2, 1.05, 5), boneMaskMaterial, {
        position: [side * 0.46, -1.05, 0.78],
        rotation: [0.2, 0, side * 0.24],
      });
    }
    addMesh(maskGroup, new THREE.SphereGeometry(0.14, 8, 8), plasmaGlowMaterial, {
      position: [0.45, 0.18, 0.98],
      castShadow: false,
      visionExempt: true,
    });
    group.add(maskGroup);

    // Couronne de dreads longues, avec anneaux rouges, disposée derrière le
    // crâne pour conserver une silhouette lisible sous tous les angles.
    for (let index = 0; index < 14; index += 1) {
      const angle = THREE.MathUtils.lerp(-1.35, 1.35, index / 13);
      const dread = addMesh(group, new THREE.CylinderGeometry(0.13, 0.23, 4.6, 6), dreadMaterial, {
        position: [Math.sin(angle) * 1.25, 7.95 - Math.abs(angle) * 0.22, -0.7 - Math.cos(angle) * 0.35],
        rotation: [0.48 + Math.abs(angle) * 0.12, 0, -angle * 0.25],
      });
      addMesh(dread, new THREE.TorusGeometry(0.2, 0.055, 5, 8), redArmorMaterial, {
        position: [0, -1.25, 0],
        rotation: [Math.PI / 2, 0, 0],
      });
    }

    // Épaulières, bras et double lame de poignet.
    for (const side of [-1, 1]) {
      addMesh(group, new THREE.SphereGeometry(1.22, 10, 8), side < 0 ? redArmorMaterial : blackArmorMaterial, {
        position: [side * 3.05, 7.25, 0],
        scale: [1.25, 0.8, 1.12],
      });
      addMesh(group, new THREE.CylinderGeometry(0.62, 0.78, 3.55, 9), skinMaterial, {
        position: [side * 3.18, 5.35, 0.18],
        rotation: [0.06, 0, side * 0.1],
      });
      addMesh(group, new THREE.BoxGeometry(1.15, 1.35, 1.5), blackArmorMaterial, {
        position: [side * 3.25, 3.85, 0.5],
      });
    }
    for (const offset of [-0.22, 0.22]) {
      addMesh(group, new THREE.BoxGeometry(0.13, 0.12, 3.6), bladeMaterial, {
        position: [3.48 + offset, 3.5, 2.15],
        rotation: [-0.08, 0, 0],
      });
    }

    // Jambes puissantes et armure cramoisie segmentée.
    for (const side of [-1, 1]) {
      addMesh(group, new THREE.CylinderGeometry(0.82, 1, 4.35, 10), skinMaterial, {
        position: [side * 1.35, 2.18, 0],
        rotation: [0, 0, side * 0.05],
      });
      addMesh(group, new THREE.BoxGeometry(1.75, 2.15, 2.15), side < 0 ? blackArmorMaterial : redArmorMaterial, {
        position: [side * 1.35, 2.8, 0.12],
      });
      addMesh(group, new THREE.BoxGeometry(1.8, 0.65, 3.0), blackArmorMaterial, {
        position: [side * 1.35, 0.38, 0.55],
      });
    }

    // Plasmacaster lourd à double chambre, monté très haut sur l'épaule.
    const casterYaw = new THREE.Group();
    casterYaw.name = 'superPredatorCasterYaw';
    casterYaw.position.set(-3.45, 8.25, -0.15);
    addMesh(casterYaw, new THREE.BoxGeometry(1.25, 1.05, 2.9), blackArmorMaterial);
    for (const side of [-0.28, 0.28]) {
      addMesh(casterYaw, new THREE.CylinderGeometry(0.27, 0.37, 3.6, 10), redArmorMaterial, {
        position: [side, 0.2, 2.1],
        rotation: [Math.PI / 2, 0, 0],
      });
      addMesh(casterYaw, new THREE.SphereGeometry(0.22, 8, 8), plasmaGlowMaterial, {
        position: [side, 0.2, 3.92],
        castShadow: false,
        visionExempt: true,
      });
    }
    const casterLight = new THREE.PointLight(0xa32fff, 2.4, 12);
    casterLight.position.set(0, 0.2, 3.8);
    casterYaw.add(casterLight);
    group.add(casterYaw);

    return group;
  }

  setVisionMode(mode) {
    if (this.isDead) return;
    if (mode === 'thermal') {
      overrideMaterials(this.mesh, this.thermalMaterial, (child) => child.userData.visionExempt !== true);
    } else {
      restoreBaseMaterials(this.mesh);
    }
  }

  breakMask() {
    if (!this.maskIntact) return;
    this.maskIntact = false;
    this.trophyIntegrity = Math.max(0, this.trophyIntegrity - 18);
    if (this.maskMesh) this.maskMesh.visible = false;
    if (this.revealedFaceMesh) {
      this.revealedFaceMesh.visible = true;
      this.revealedFaceMesh.scale.set(1.14, 1.08, 0.9);
    }
    audioSynth.playYautjaClick();
  }

  takeDamage(amount, hitPosition = this.position) {
    if (this.isDead) return;

    const damage = Math.max(0, Number(amount) || 0);
    if (damage === 0) return;

    const impact = hitPosition?.isVector3 ? hitPosition : this.position;
    const maskPosition = this.position.clone().add(new THREE.Vector3(0, 9.45, 1.03));
    const maskHit = impact.distanceTo(maskPosition) < 3.2;
    const integrityLoss = (damage / this.maxHealth) * (maskHit ? 60 : 18);
    this.trophyIntegrity = Math.max(0, Math.round((this.trophyIntegrity - integrityLoss) * 10) / 10);
    this.health = Math.max(0, this.health - damage);

    // Le masque cède au premier impact reçu sous le seuil de 60 % de vie.
    if (this.maskIntact && this.health <= this.maxHealth * 0.6) this.breakMask();

    if (!this.isEnraged && this.health <= this.maxHealth * 0.5) {
      this.isEnraged = true;
      this.attackCooldown = Math.min(this.attackCooldown, 0.35);
      audioSynth.playMonsterRoar();
    }

    if (this.health === 0) {
      this.isDead = true;
      this.aiState = 'dead';
      this.chargeTimer = 0;
      this.attackImpactReady = false;
      this.projectiles.forEach(({ mesh }) => disposeObject3D(mesh));
      this.projectiles = [];
      restoreBaseMaterials(this.mesh);
      audioSynth.playMonsterRoar();
    }
  }

  applyNet() {
    if (this.isDead) return;
    this.isNetted = true;
    this.netTimer = this.isEnraged ? 1.25 : 2.25;
    this.chargeTimer = 0;
    this.attackImpactReady = false;
    this.aiState = 'netted';
  }

  consumeAttackImpact() {
    if (!this.attackImpactReady || this.attackImpactConsumed) return false;
    this.attackImpactConsumed = true;
    this.attackImpactReady = false;
    return true;
  }

  fireHeavyPlasma(targetPosition) {
    const projectile = new THREE.Mesh(
      new THREE.SphereGeometry(this.isEnraged ? 0.92 : 0.75, 14, 12),
      ShaderManager.createPlasmaMaterial(),
    );
    projectile.name = 'superPredatorHeavyPlasma';
    projectile.position.copy(this.position).add(new THREE.Vector3(-3.45, 8.45, 3.45));
    projectile.userData.isBossProjectile = true;

    const direction = targetPosition.clone().add(new THREE.Vector3(0, 2.4, 0)).sub(projectile.position).normalize();
    const shot = {
      mesh: projectile,
      dir: direction,
      speed: this.isEnraged ? 61 : 52,
      damage: this.isEnraged ? 58 : 46,
      lifetime: 4.25,
      type: 'heavy_plasma',
    };
    this.projectiles.push(shot);
    this.scene.add(projectile);
    audioSynth.playPlasmacasterBlast();
    return shot;
  }

  updateProjectiles(delta) {
    for (let index = this.projectiles.length - 1; index >= 0; index -= 1) {
      const projectile = this.projectiles[index];
      projectile.mesh.position.addScaledVector(projectile.dir, projectile.speed * delta);
      projectile.lifetime -= delta;
      if (projectile.lifetime <= 0) {
        disposeObject3D(projectile.mesh);
        this.projectiles.splice(index, 1);
      }
    }
  }

  update(delta, playerPosition, isPlayerCloaked = false) {
    if (this.isDead) return;

    const frameDelta = Math.max(0, Math.min(Number(delta) || 0, 0.2));
    this.updateProjectiles(frameDelta);
    this.attackCooldown = Math.max(0, this.attackCooldown - frameDelta);

    if (this.isNetted) {
      this.netTimer = Math.max(0, this.netTimer - frameDelta);
      if (this.netTimer === 0) {
        this.isNetted = false;
        this.aiState = 'stalk';
      }
      return;
    }

    if (!playerPosition?.isVector3) return;

    if (this.chargeTimer > 0) {
      const previousTimer = this.chargeTimer;
      this.chargeTimer = Math.max(0, this.chargeTimer - frameDelta);
      this.position.addScaledVector(this.chargeDirection, this.chargeSpeed * (this.isEnraged ? 1.2 : 1) * frameDelta);
      this.aiState = 'charge';
      this.attackImpactReady = this.chargeTimer <= 0.24 && !this.attackImpactConsumed;
      if (previousTimer > 0 && this.chargeTimer === 0) {
        this.aiState = 'chase';
        this.attackImpactReady = false;
        this.attackImpactConsumed = false;
      }
      this.clampToArena();
      this.mesh.position.copy(this.position);
      return;
    }

    this.attackImpactReady = false;
    const distance = this.position.distanceTo(playerPosition);
    const detectionRadius = isPlayerCloaked ? 34 : 145;
    if (distance > detectionRadius) {
      this.aiState = 'stalk';
      return;
    }

    const targetDirection = playerPosition.clone().sub(this.position);
    targetDirection.y = 0;
    if (targetDirection.lengthSq() > 0.0001) targetDirection.normalize();
    const targetAngle = Math.atan2(targetDirection.x, targetDirection.z);
    let angleDifference = targetAngle - this.mesh.rotation.y;
    angleDifference = Math.atan2(Math.sin(angleDifference), Math.cos(angleDifference));
    this.mesh.rotation.y += angleDifference * Math.min(1, frameDelta * (this.isEnraged ? 7 : 5));
    if (this.casterYaw) this.casterYaw.rotation.y = THREE.MathUtils.clamp(angleDifference, -0.6, 0.6);

    this.aiState = 'chase';
    if (this.attackCooldown === 0) {
      this.attackTelegraphAnnounced = false;
      this.attackImpactConsumed = false;
      if (distance <= 8.5) {
        this.aiState = 'melee';
        this.attackImpactReady = true;
        this.attackCooldown = this.isEnraged ? 1.05 : 1.55;
        audioSynth.playWristbladeSlash();
      } else if (distance <= 27) {
        this.aiState = 'charge';
        this.chargeDirection.copy(targetDirection);
        this.chargeTimer = this.isEnraged ? 0.82 : 0.68;
        this.attackCooldown = this.isEnraged ? 2.45 : 3.25;
        audioSynth.playMonsterFootstep();
      } else if (distance <= 110) {
        this.aiState = 'heavy_plasma';
        this.fireHeavyPlasma(playerPosition);
        this.attackCooldown = this.isEnraged ? 1.65 : 2.65;
      }
    }

    if (this.aiState === 'chase' && distance > 6.5) {
      this.position.addScaledVector(targetDirection, (this.isEnraged ? this.enragedSpeed : this.moveSpeed) * frameDelta);
    }

    this.clampToArena();
    this.mesh.position.copy(this.position);
  }

  clampToArena() {
    this.position.x = THREE.MathUtils.clamp(this.position.x, -330, 330);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -330, 330);
  }

  dispose() {
    this.projectiles.forEach(({ mesh }) => disposeObject3D(mesh));
    this.projectiles = [];
    restoreBaseMaterials(this.mesh);
    this.thermalMaterial?.dispose?.();
    Object.values(this.loadedTextures).forEach((texture) => texture?.dispose?.());
    disposeObject3D(this.mesh);
  }
}
