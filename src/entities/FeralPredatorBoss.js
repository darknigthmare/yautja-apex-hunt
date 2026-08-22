import * as THREE from 'three';
import { audioSynth } from '../AudioSynthesizer.js';
import { ShaderManager } from '../Shaders.js';
import {
  captureBaseMaterials,
  disposeObject3D,
  overrideMaterials,
  restoreBaseMaterials,
} from '../utils/materialState.js';

export const FERAL_PREDATOR_TEXTURES = Object.freeze({
  boneComposite: '/assets/textures/feral-bone-composite.webp',
});

const FORWARD = new THREE.Vector3();
const IMPACT_DIRECTION = new THREE.Vector3();

function loadBrowserTexture(path) {
  // TextureLoader requires browser image primitives. The procedural fallback
  // keeps boss construction deterministic in Node tests and server tooling.
  if (typeof document === 'undefined' || typeof document.createElementNS !== 'function') return null;

  try {
    const texture = new THREE.TextureLoader().load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.35, 1.35);
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
  mesh.receiveShadow = true;
  mesh.userData.visionExempt = visionExempt;
  parent.add(mesh);
  return mesh;
}

/**
 * Rival de chasse original inspiré de l'arsenal osseux et asymétrique du Feral.
 * La silhouette et les volumes sont entièrement procéduraux pour Apex Hunt.
 */
export class FeralPredatorBoss {
  constructor(scene) {
    if (!scene?.add) throw new TypeError('FeralPredatorBoss requiert une scène THREE valide.');

    this.scene = scene;

    // Contrat runtime commun à toutes les cibles de chasse.
    this.maxHealth = 1550;
    this.health = this.maxHealth;
    this.isDead = false;
    this.isEnraged = false;
    this.isNetted = false;
    this.netTimer = 0;
    this.aiState = 'stalk';
    this.attackCooldown = 0;
    this.projectiles = [];
    this.colliderRadius = 4.8;

    // Le bouclier protège uniquement l'arc frontal et conserve ses dégâts
    // entre deux déploiements. Sa rupture est définitive pour la chasse.
    this.maxShieldIntegrity = 360;
    this.shieldIntegrity = this.maxShieldIntegrity;
    this.shieldIntact = true;
    this.shieldDeployed = false;
    this.shieldDuration = 0;
    this.shieldCooldown = 0;
    this.shieldBroken = false;

    this.position = new THREE.Vector3(0, 0, -50);
    this.moveSpeed = 14;
    this.enragedSpeed = 19.5;
    this.chargeSpeed = 35;
    this.chargeTimer = 0;
    this.chargeDirection = new THREE.Vector3(0, 0, 1);
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.attackTelegraphAnnounced = false;
    this.activeAttackType = null;
    this.meleeWindup = 0;
    this._disposed = false;

    this.boneTexture = loadBrowserTexture(FERAL_PREDATOR_TEXTURES.boneComposite);
    this.mesh = this.createBossMesh();
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);
    captureBaseMaterials(this.mesh);

    this.shieldMesh = this.mesh.getObjectByName('feralDeployableShield');
    this.spearMesh = this.mesh.getObjectByName('feralCollapsibleSpear');
    this.boltLauncher = this.mesh.getObjectByName('feralCrossboltLauncher');
    this.thermalMaterial = ShaderManager.createThermalMaterial(0xff7a22, 0.94);
  }

  get boneArmorIntact() {
    return !this.isDead && this.health > this.maxHealth * 0.45;
  }

  createBossMesh() {
    const group = new THREE.Group();
    group.name = 'feralPredatorBoss';
    group.userData.silhouette = 'feral_bone_hunter';

    const skin = new THREE.MeshStandardMaterial({
      color: 0x5b4a32,
      roughness: 0.9,
      metalness: 0.03,
    });
    const bone = new THREE.MeshStandardMaterial({
      color: 0xc0aa76,
      map: this.boneTexture,
      roughness: 0.68,
      metalness: 0.2,
    });
    const darkBone = new THREE.MeshStandardMaterial({
      color: 0x58472d,
      map: this.boneTexture,
      roughness: 0.74,
      metalness: 0.15,
    });
    const leather = new THREE.MeshStandardMaterial({
      color: 0x201710,
      roughness: 0.96,
      metalness: 0.02,
    });
    const metal = new THREE.MeshStandardMaterial({
      color: 0x6f7672,
      roughness: 0.28,
      metalness: 0.92,
    });
    const boltGlow = new THREE.MeshBasicMaterial({ color: 0xff7338 });

    // Un torse sec, haut et décentré distingue ce rival du Super Predator.
    addMesh(group, new THREE.CapsuleGeometry(1.65, 4.1, 6, 11), skin, {
      name: 'feralTorso',
      position: [0, 5.15, 0],
      scale: [1.08, 1, 0.72],
    });
    addMesh(group, new THREE.BoxGeometry(3.35, 2.65, 1.85), leather, {
      position: [-0.15, 6.15, -0.05],
      rotation: [0.04, -0.08, 0.05],
    });
    for (let rib = 0; rib < 4; rib += 1) {
      addMesh(group, new THREE.TorusGeometry(1.48 - rib * 0.08, 0.13, 6, 18, Math.PI), bone, {
        position: [0, 6.85 - rib * 0.55, 0.62],
        rotation: [Math.PI / 2, 0, Math.PI / 2],
      });
    }

    addMesh(group, new THREE.CylinderGeometry(0.58, 0.8, 1.2, 9), skin, {
      position: [0, 8.05, 0],
    });
    addMesh(group, new THREE.SphereGeometry(1.02, 13, 10), skin, {
      position: [0, 9.05, 0.15],
      scale: [0.95, 1.08, 0.82],
    });

    // Bio-masque osseux original : brow oblique, museau court et défenses.
    const mask = new THREE.Group();
    mask.name = 'feralBoneMask';
    mask.position.set(0, 9.12, 0.82);
    addMesh(mask, new THREE.ConeGeometry(1.15, 2.05, 7), bone, {
      rotation: [Math.PI / 2, 0, 0],
      scale: [1, 0.58, 1.1],
    });
    addMesh(mask, new THREE.BoxGeometry(2.18, 0.28, 0.42), darkBone, {
      position: [0, 0.34, 0.34],
      rotation: [0, 0, -0.09],
    });
    for (const side of [-1, 1]) {
      addMesh(mask, new THREE.ConeGeometry(0.18, 1.25, 5), bone, {
        position: [side * 0.72, -0.72, 0.45],
        rotation: [0.2, 0, side * 0.48],
      });
    }
    addMesh(mask, new THREE.SphereGeometry(0.11, 8, 7), boltGlow, {
      position: [0.36, 0.28, 0.71],
      castShadow: false,
      visionExempt: true,
    });
    group.add(mask);

    // Predlocks plus courts, noués par des perles d'os irrégulières.
    for (let index = 0; index < 12; index += 1) {
      const angle = THREE.MathUtils.lerp(-1.3, 1.3, index / 11);
      const dread = addMesh(group, new THREE.CylinderGeometry(0.1, 0.18, 3.8, 6), leather, {
        position: [Math.sin(angle) * 1.04, 7.92 - Math.abs(angle) * 0.18, -0.62],
        rotation: [0.54 + Math.abs(angle) * 0.08, 0, -angle * 0.28],
      });
      if (index % 2 === 0) {
        addMesh(dread, new THREE.TorusGeometry(0.16, 0.045, 5, 8), bone, {
          position: [0, -1.05, 0],
          rotation: [Math.PI / 2, 0, 0],
        });
      }
    }

    for (const side of [-1, 1]) {
      addMesh(group, new THREE.SphereGeometry(0.92, 10, 8), side < 0 ? bone : darkBone, {
        position: [side * 2.12, 6.95, 0],
        scale: [1.16, 0.7, 1],
      });
      addMesh(group, new THREE.CylinderGeometry(0.43, 0.58, 3.25, 8), skin, {
        position: [side * 2.18, 5.02, 0.1],
        rotation: [0.03, 0, side * 0.09],
      });
      addMesh(group, new THREE.BoxGeometry(0.9, 1.08, 1.25), darkBone, {
        position: [side * 2.2, 3.65, 0.3],
      });
      addMesh(group, new THREE.CylinderGeometry(0.64, 0.78, 3.8, 9), skin, {
        position: [side * 0.92, 1.95, 0],
        rotation: [0, 0, side * 0.04],
      });
      addMesh(group, new THREE.BoxGeometry(1.42, 0.58, 2.35), darkBone, {
        position: [side * 0.92, 0.3, 0.42],
      });
    }

    // Lance télescopique tenue sur le flanc droit, visible en permanence.
    const spear = new THREE.Group();
    spear.name = 'feralCollapsibleSpear';
    spear.position.set(2.58, 4.05, 1.15);
    spear.rotation.set(-0.18, 0, -0.13);
    addMesh(spear, new THREE.CylinderGeometry(0.1, 0.12, 5.7, 8), metal);
    addMesh(spear, new THREE.ConeGeometry(0.32, 1.15, 6), bone, { position: [0, 3.25, 0] });
    addMesh(spear, new THREE.ConeGeometry(0.24, 0.82, 6), darkBone, {
      position: [0, -3.05, 0],
      rotation: [0, 0, Math.PI],
    });
    group.add(spear);

    // Lance-traits compact monté à l'avant-bras gauche.
    const launcher = new THREE.Group();
    launcher.name = 'feralCrossboltLauncher';
    launcher.position.set(-2.28, 3.85, 0.82);
    addMesh(launcher, new THREE.BoxGeometry(0.84, 0.58, 1.8), darkBone);
    for (const x of [-0.22, 0, 0.22]) {
      addMesh(launcher, new THREE.CylinderGeometry(0.07, 0.1, 1.45, 7), metal, {
        position: [x, 0, 1.18],
        rotation: [Math.PI / 2, 0, 0],
      });
    }
    group.add(launcher);

    // Bouclier segmenté : trois plaques osseuses forment un croissant frontal.
    const shield = new THREE.Group();
    shield.name = 'feralDeployableShield';
    shield.position.set(-2.65, 5.3, 1.35);
    shield.rotation.y = 0.12;
    for (const segment of [-1, 0, 1]) {
      addMesh(shield, new THREE.CylinderGeometry(1.42, 1.7, 0.3, 9, 1, false, -0.48, 0.96), bone, {
        position: [segment * 0.9, segment * 0.08, 0],
        rotation: [Math.PI / 2, 0, segment * 0.12],
        scale: [1, 0.55, 1.15],
      });
    }
    addMesh(shield, new THREE.TorusGeometry(2.2, 0.12, 6, 18, Math.PI), metal, {
      rotation: [0, Math.PI / 2, Math.PI / 2],
    });
    shield.visible = false;
    group.add(shield);

    return group;
  }

  setVisionMode(mode) {
    if (this._disposed) return false;
    if (mode === 'thermal') {
      overrideMaterials(this.mesh, this.thermalMaterial, (child) => child.userData.visionExempt !== true);
    } else {
      restoreBaseMaterials(this.mesh);
    }
    return true;
  }

  deployShield(duration = 2.6) {
    if (this.isDead || this.isNetted || this.shieldBroken || this.shieldIntegrity <= 0 || this.shieldCooldown > 0) {
      return false;
    }
    this.shieldDeployed = true;
    this.shieldDuration = Math.max(0.2, Number(duration) || 2.6);
    this.aiState = 'shield';
    this.activeAttackType = 'shield_guard';
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    if (this.shieldMesh) this.shieldMesh.visible = true;
    audioSynth.playYautjaClick();
    return true;
  }

  retractShield(cooldown = 5.5) {
    if (!this.shieldDeployed) return false;
    this.shieldDeployed = false;
    this.shieldDuration = 0;
    this.shieldCooldown = Math.max(this.shieldCooldown, Math.max(0, Number(cooldown) || 0));
    if (this.shieldMesh) this.shieldMesh.visible = false;
    if (!this.isDead && !this.isNetted) this.aiState = 'chase';
    return true;
  }

  breakShield() {
    if (this.shieldBroken) return false;
    this.shieldIntegrity = 0;
    this.shieldIntact = false;
    this.shieldBroken = true;
    this.shieldDeployed = false;
    this.shieldDuration = 0;
    if (this.shieldMesh) this.shieldMesh.visible = false;
    audioSynth.playMonsterRoar();
    return true;
  }

  isImpactInsideShieldArc(hitPosition) {
    if (!hitPosition?.isVector3 || hitPosition.distanceToSquared(this.position) < 0.0001) return true;
    IMPACT_DIRECTION.subVectors(hitPosition, this.position);
    IMPACT_DIRECTION.y = 0;
    if (IMPACT_DIRECTION.lengthSq() < 0.0001) return true;
    IMPACT_DIRECTION.normalize();
    FORWARD.set(Math.sin(this.mesh.rotation.y), 0, Math.cos(this.mesh.rotation.y));
    return FORWARD.dot(IMPACT_DIRECTION) >= 0.15;
  }

  takeDamage(amount, hitPosition = this.position) {
    if (this.isDead || this._disposed) {
      return { damage: 0, absorbed: 0, killed: this.isDead, remainingHealth: this.health };
    }

    const incomingDamage = Math.max(0, Number(amount) || 0);
    if (incomingDamage === 0) {
      return { damage: 0, absorbed: 0, killed: false, remainingHealth: this.health };
    }

    let damage = incomingDamage;
    let absorbed = 0;
    if (this.shieldDeployed && this.shieldIntact && this.isImpactInsideShieldArc(hitPosition)) {
      absorbed = Math.min(damage, this.shieldIntegrity);
      this.shieldIntegrity = Math.max(0, this.shieldIntegrity - absorbed);
      damage -= absorbed;
      if (this.shieldIntegrity === 0) this.breakShield();
      else audioSynth.playYautjaClick();
    }

    this.health = Math.max(0, this.health - damage);
    if (!this.isEnraged && this.health <= this.maxHealth * 0.45) {
      this.isEnraged = true;
      this.attackCooldown = Math.min(this.attackCooldown, 0.3);
      audioSynth.playMonsterRoar();
    }

    if (this.health === 0) {
      this.isDead = true;
      this.aiState = 'dead';
      this.activeAttackType = null;
      this.chargeTimer = 0;
      this.meleeWindup = 0;
      this.attackImpactReady = false;
      this.attackImpactConsumed = true;
      this.retractShield(0);
      this.projectiles.forEach(({ mesh }) => disposeObject3D(mesh));
      this.projectiles = [];
      restoreBaseMaterials(this.mesh);
      audioSynth.playMonsterRoar();
    }

    return {
      damage,
      absorbed,
      shieldBroken: this.shieldBroken,
      killed: this.isDead,
      remainingHealth: this.health,
    };
  }

  applyNet() {
    if (this.isDead || this._disposed) return false;
    this.retractShield(2.5);
    this.isNetted = true;
    this.netTimer = this.isEnraged ? 1.15 : 2.1;
    this.chargeTimer = 0;
    this.meleeWindup = 0;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.aiState = 'netted';
    return true;
  }

  consumeAttackImpact() {
    if (!this.attackImpactReady || this.attackImpactConsumed) return false;
    this.attackImpactConsumed = true;
    this.attackImpactReady = false;
    return true;
  }

  fireCrossboltVolley(targetPosition) {
    if (!targetPosition?.isVector3 || this.isDead) return [];

    const origin = this.position.clone().add(new THREE.Vector3(-2.25, 4.1, 1.85));
    const baseDirection = targetPosition.clone().add(new THREE.Vector3(0, 2.2, 0)).sub(origin).normalize();
    const shots = [];

    for (const yawOffset of [-0.055, 0, 0.055]) {
      const bolt = new THREE.Group();
      bolt.name = 'feralCrossbolt';
      const shaftMaterial = new THREE.MeshStandardMaterial({
        color: 0xd8c89a,
        map: this.boneTexture,
        roughness: 0.42,
        metalness: 0.52,
      });
      addMesh(bolt, new THREE.CylinderGeometry(0.045, 0.06, 1.55, 7), shaftMaterial, {
        rotation: [Math.PI / 2, 0, 0],
      });
      addMesh(bolt, new THREE.ConeGeometry(0.15, 0.42, 5), shaftMaterial, {
        position: [0, 0, 0.97],
        rotation: [Math.PI / 2, 0, 0],
      });
      bolt.position.copy(origin);

      const direction = baseDirection.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), yawOffset);
      bolt.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
      const shot = {
        mesh: bolt,
        dir: direction,
        speed: this.isEnraged ? 86 : 74,
        damage: this.isEnraged ? 34 : 28,
        lifetime: 3.4,
        type: 'crossbolt',
      };
      this.projectiles.push(shot);
      this.scene.add(bolt);
      shots.push(shot);
    }

    audioSynth.playSpearThrow();
    return shots;
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

  updateShield(delta) {
    this.shieldCooldown = Math.max(0, this.shieldCooldown - delta);
    if (!this.shieldDeployed) return false;
    this.shieldDuration = Math.max(0, this.shieldDuration - delta);
    if (this.shieldDuration === 0) this.retractShield();
    return this.shieldDeployed;
  }

  update(delta, playerPosition, isPlayerCloaked = false) {
    if (this.isDead || this._disposed) return;

    const frameDelta = Math.max(0, Math.min(Number(delta) || 0, 0.2));
    this.updateProjectiles(frameDelta);
    this.attackCooldown = Math.max(0, this.attackCooldown - frameDelta);
    this.updateShield(frameDelta);

    if (this.isNetted) {
      this.netTimer = Math.max(0, this.netTimer - frameDelta);
      if (this.netTimer === 0) {
        this.isNetted = false;
        this.aiState = 'stalk';
      }
      return;
    }
    if (!playerPosition?.isVector3) return;

    const targetDirection = playerPosition.clone().sub(this.position);
    targetDirection.y = 0;
    const distance = targetDirection.length();
    if (distance > 0.0001) targetDirection.normalize();

    const targetAngle = Math.atan2(targetDirection.x, targetDirection.z);
    let angleDifference = targetAngle - this.mesh.rotation.y;
    angleDifference = Math.atan2(Math.sin(angleDifference), Math.cos(angleDifference));
    this.mesh.rotation.y += angleDifference * Math.min(1, frameDelta * (this.isEnraged ? 7 : 5.5));

    if (this.shieldDeployed) {
      this.aiState = 'shield';
      this.mesh.position.copy(this.position);
      return;
    }

    if (this.meleeWindup > 0) {
      this.meleeWindup = Math.max(0, this.meleeWindup - frameDelta);
      this.aiState = this.meleeWindup === 0 ? 'melee' : 'melee_windup';
      this.activeAttackType = 'spear_thrust';
      this.attackImpactReady = this.meleeWindup === 0 && !this.attackImpactConsumed;
      if (this.spearMesh) this.spearMesh.rotation.x = this.meleeWindup === 0 ? -0.62 : 0.38;
      this.clampToArena();
      this.mesh.position.copy(this.position);
      return;
    }

    if (this.chargeTimer > 0) {
      const previousTimer = this.chargeTimer;
      this.chargeTimer = Math.max(0, this.chargeTimer - frameDelta);
      this.position.addScaledVector(this.chargeDirection, this.chargeSpeed * (this.isEnraged ? 1.18 : 1) * frameDelta);
      this.aiState = 'charge';
      this.activeAttackType = 'spear_charge';
      this.attackImpactReady = this.chargeTimer <= 0.2 && !this.attackImpactConsumed;
      if (previousTimer > 0 && this.chargeTimer === 0) {
        this.aiState = 'chase';
        this.activeAttackType = null;
        this.attackImpactReady = false;
        this.attackImpactConsumed = false;
      }
      this.clampToArena();
      this.mesh.position.copy(this.position);
      return;
    }

    this.attackImpactReady = false;
    const detectionRadius = isPlayerCloaked ? 30 : 135;
    if (distance > detectionRadius) {
      this.aiState = 'stalk';
      this.activeAttackType = null;
      this.mesh.position.copy(this.position);
      return;
    }

    this.aiState = 'chase';
    this.activeAttackType = null;
    if (this.attackCooldown === 0) {
      this.attackTelegraphAnnounced = false;
      this.attackImpactConsumed = false;

      const shouldGuard = this.health <= this.maxHealth * 0.7
        && this.shieldIntact
        && this.shieldCooldown === 0
        && distance >= 11
        && distance <= 58;

      if (shouldGuard && this.deployShield(this.isEnraged ? 1.65 : 2.35)) {
        this.attackCooldown = this.isEnraged ? 1.25 : 1.75;
      } else if (distance <= 7.8) {
        this.aiState = 'melee_windup';
        this.activeAttackType = 'spear_thrust';
        this.attackImpactReady = false;
        this.meleeWindup = this.isEnraged ? 0.26 : 0.38;
        this.attackCooldown = this.isEnraged ? 0.9 : 1.35;
        if (this.spearMesh) this.spearMesh.rotation.x = 0.38;
        audioSynth.playSpearThrow();
      } else if (distance <= 27) {
        this.aiState = 'charge';
        this.activeAttackType = 'spear_charge';
        this.chargeDirection.copy(targetDirection);
        this.chargeTimer = this.isEnraged ? 0.72 : 0.88;
        this.attackCooldown = this.isEnraged ? 2.1 : 2.8;
        audioSynth.playMonsterFootstep();
      } else if (distance <= 118) {
        this.aiState = 'crossbolt';
        this.activeAttackType = 'crossbolt_volley';
        this.fireCrossboltVolley(playerPosition);
        this.attackCooldown = this.isEnraged ? 1.45 : 2.25;
      }
    }

    if (this.aiState === 'chase' && distance > 6.2) {
      this.position.addScaledVector(targetDirection, (this.isEnraged ? this.enragedSpeed : this.moveSpeed) * frameDelta);
    }

    if (this.spearMesh && !['melee', 'melee_windup'].includes(this.aiState)) this.spearMesh.rotation.x = -0.18;
    this.clampToArena();
    this.mesh.position.copy(this.position);
  }

  clampToArena() {
    this.position.x = THREE.MathUtils.clamp(this.position.x, -330, 330);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -330, 330);
  }

  dispose() {
    if (this._disposed) return false;
    this._disposed = true;
    this.projectiles.forEach(({ mesh }) => disposeObject3D(mesh));
    this.projectiles = [];
    restoreBaseMaterials(this.mesh);
    this.thermalMaterial?.dispose?.();
    this.boneTexture?.dispose?.();
    disposeObject3D(this.mesh);
    return true;
  }
}

export default FeralPredatorBoss;
