import * as THREE from 'three';
import { audioSynth } from '../AudioSynthesizer.js';
import { ShaderManager } from '../Shaders.js';
import {
  captureBaseMaterials,
  disposeObject3D,
  overrideMaterials,
  restoreBaseMaterials,
} from '../utils/materialState.js';
import { forwardRayIntersectsSphere, resolveSegmentSphereImpact } from '../utils/projectileCollision.js';
import { getRuntimeTexture } from '../utils/runtimeTextures.js';

export const GRID_ALIEN_TEXTURES = Object.freeze({
  carapace: '/assets/textures/xeno-carapace.webp',
  hiveMembrane: '/assets/textures/hive-biomechanical-membrane.webp',
});

const HEAD_OFFSET = new THREE.Vector3(0, 8.55, 3.15);
const BODY_OFFSET = new THREE.Vector3(0, 5.05, 0);
const TAIL_WEAKPOINT_OFFSET = new THREE.Vector3(0, 4.15, -10.8);

function addMesh(parent, geometry, material, {
  name = '',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  castShadow = true,
  visionExempt = false,
  featureTag = '',
} = {}) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...scale);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  mesh.userData.visionExempt = visionExempt;
  if (featureTag) mesh.userData.featureTag = featureTag;
  parent.add(mesh);
  return mesh;
}

function addTube(parent, material, points, radius, name, featureTag = '') {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  return addMesh(parent, new THREE.TubeGeometry(curve, 22, radius, 7, false), material, {
    name,
    featureTag,
  });
}

/**
 * Grid Alien est une adaptation de chasse originale de la créature marquée
 * à l'acide visible dans Alien vs. Predator (2004). Aucun modèle officiel
 * n'est reproduit : anatomie, matériaux, animation et règles sont procéduraux.
 */
export class GridAlienBoss {
  constructor(scene) {
    if (!scene?.add) throw new TypeError('GridAlienBoss requiert une scène THREE valide.');

    this.scene = scene;

    // Contrat commun des boss de chasse.
    this.maxHealth = 2350;
    this.health = this.maxHealth;
    this.isDead = false;
    this.isEnraged = false;
    this.isNetted = false;
    this.netTimer = 0;
    this.aiState = 'stalk';
    this.activeAttackType = null;
    this.attackCooldown = 0;
    this.attackTelegraphAnnounced = false;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.projectiles = [];
    this.colliderRadius = 5.8;

    // Deux trophées destructibles lisibles et utiles en combat.
    this.maxHeadIntegrity = 430;
    this.headIntegrity = this.maxHeadIntegrity;
    this.headHealth = this.headIntegrity;
    this.headIntact = true;
    this.maxTailIntegrity = 470;
    this.tailIntegrity = this.maxTailIntegrity;
    this.tailHealth = this.tailIntegrity;
    this.tailIntact = true;

    this.position = new THREE.Vector3(0, 0, -56);
    this.moveSpeed = 16.25;
    this.enragedSpeed = 22.5;
    this.pounceSpeed = 42;
    this.attackStage = 'idle';
    this.attackStageTimer = 0;
    this.attackRecoveryTimer = 0;
    this.attackDirection = new THREE.Vector3(0, 0, 1);
    this.attackTarget = new THREE.Vector3();
    this.acidBloodCooldown = 0;
    this.attackSequence = 0;
    this._disposed = false;

    this.mesh = this.createBossMesh();
    this.group = this.mesh;
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);
    captureBaseMaterials(this.mesh);

    this.headGroup = this.mesh.getObjectByName('gridAlienHead');
    this.domeMesh = this.mesh.getObjectByName('gridAlienDome');
    this.innerJawMesh = this.mesh.getObjectByName('gridAlienInnerJaw');
    this.tailGroup = this.mesh.getObjectByName('gridAlienTail');
    this.thermalMaterial = ShaderManager.createThermalMaterial(0xd9ff39, 0.98);
  }

  createBossMesh() {
    const group = new THREE.Group();
    group.name = 'gridAlienBoss';
    group.userData.silhouette = 'grid_scarred_bipedal_xenomorph';
    group.userData.provenance = 'AVP_SCREEN adaptation; original procedural geometry and gameplay';
    group.userData.referenceMedia = 'Alien vs. Predator (2004)';

    const carapaceTexture = getRuntimeTexture(GRID_ALIEN_TEXTURES.carapace, { repeat: [2.4, 2.4] });
    const membraneTexture = getRuntimeTexture(GRID_ALIEN_TEXTURES.hiveMembrane, { repeat: [1.8, 2.2] });
    const shell = new THREE.MeshStandardMaterial({
      color: 0x0b1014,
      map: carapaceTexture,
      roughness: 0.24,
      metalness: 0.72,
    });
    const ridgedShell = new THREE.MeshStandardMaterial({
      color: 0x253038,
      map: carapaceTexture,
      roughness: 0.48,
      metalness: 0.48,
    });
    const membrane = new THREE.MeshStandardMaterial({
      color: 0x222a26,
      map: membraneTexture,
      roughness: 0.76,
      metalness: 0.12,
    });
    const teeth = new THREE.MeshStandardMaterial({
      color: 0xbac8b2,
      roughness: 0.32,
      metalness: 0.58,
    });
    const acid = new THREE.MeshStandardMaterial({
      color: 0xb7ff35,
      emissive: 0x4b9d0a,
      emissiveIntensity: 2.15,
      roughness: 0.18,
      metalness: 0.04,
    });

    // Cage thoracique bipède, étroite à la taille et élargie aux épaules.
    addMesh(group, new THREE.CapsuleGeometry(1.72, 4.5, 9, 16), shell, {
      name: 'gridAlienTorso',
      position: [0, 5.2, -0.1],
      scale: [1.16, 1, 0.77],
      featureTag: 'biomechanical_ribcage',
    });
    for (let rib = 0; rib < 6; rib += 1) {
      addMesh(group, new THREE.TorusGeometry(1.62 - rib * 0.08, 0.14, 9, 24, Math.PI * 1.18), ridgedShell, {
        position: [0, 6.85 - rib * 0.55, 0.72],
        rotation: [Math.PI / 2, 0, -Math.PI * 0.59],
        scale: [1, 1, 0.8],
        featureTag: 'biomechanical_ribcage',
      });
    }
    addMesh(group, new THREE.SphereGeometry(1.28, 16, 11), membrane, {
      name: 'gridAlienPelvis',
      position: [0, 2.95, -0.3],
      scale: [1.16, 0.72, 0.88],
    });

    // Tête allongée sans yeux, mâchoire secondaire et cicatrices acides en grille.
    const head = new THREE.Group();
    head.name = 'gridAlienHead';
    addMesh(head, new THREE.CapsuleGeometry(1.18, 3.45, 10, 20), shell, {
      name: 'gridAlienDome',
      position: [0, 8.72, 2.68],
      rotation: [Math.PI / 2, 0, 0],
      scale: [1.12, 1, 0.88],
      featureTag: 'elongated_translucent_dome',
    });
    addMesh(head, new THREE.BoxGeometry(1.95, 0.75, 2.0, 4, 2, 5), ridgedShell, {
      name: 'gridAlienOuterJaw',
      position: [0, 7.95, 4.18],
      rotation: [-0.09, 0, 0],
      featureTag: 'inner_jaw',
    });
    const innerJaw = new THREE.Group();
    innerJaw.name = 'gridAlienInnerJaw';
    innerJaw.position.set(0, 8.02, 4.52);
    addMesh(innerJaw, new THREE.CylinderGeometry(0.24, 0.32, 2.15, 10), membrane, {
      rotation: [Math.PI / 2, 0, 0],
      position: [0, 0, 0.9],
      featureTag: 'inner_jaw',
    });
    addMesh(innerJaw, new THREE.ConeGeometry(0.39, 0.72, 10), teeth, {
      rotation: [Math.PI / 2, 0, 0],
      position: [0, 0, 2.18],
      featureTag: 'inner_jaw',
    });
    head.add(innerJaw);

    // Trois lignes verticales et trois lignes transversales constituent la
    // signature de Grid. Elles restent présentes dans toutes ses phases.
    for (let index = -1; index <= 1; index += 1) {
      addMesh(head, new THREE.BoxGeometry(0.075, 0.075, 3.45), acid, {
        name: `gridAlienScarLong${index + 2}`,
        position: [index * 0.45, 9.26, 2.72],
        rotation: [0.02, index * 0.03, 0],
        castShadow: false,
        visionExempt: true,
        featureTag: 'permanent_grid_acid_scars',
      });
      addMesh(head, new THREE.BoxGeometry(1.75, 0.075, 0.075), acid, {
        name: `gridAlienScarCross${index + 2}`,
        position: [0, 9.28, 2.15 + index * 0.72],
        rotation: [0, 0, 0.02],
        castShadow: false,
        visionExempt: true,
        featureTag: 'permanent_grid_acid_scars',
      });
    }
    group.add(head);

    // Quatre tubes dorsaux recourbés, raccordés au thorax.
    for (const side of [-1, 1]) {
      for (let row = 0; row < 2; row += 1) {
        const x = side * (0.75 + row * 0.48);
        addTube(group, ridgedShell, [
          [x, 7.0 - row * 0.45, -0.65],
          [x * 1.18, 8.35 - row * 0.15, -1.4 - row * 0.5],
          [x * 1.3, 9.15 - row * 0.28, -2.85 - row * 0.72],
        ], 0.2 - row * 0.025, `gridAlienDorsalTube${side < 0 ? 'L' : 'R'}${row + 1}`, 'dorsal_tubes');
      }
    }

    // Bras longs, mains à six griffes lisibles lors de la préparation du bond.
    for (const side of [-1, 1]) {
      addMesh(group, new THREE.CylinderGeometry(0.38, 0.58, 3.65, 10), shell, {
        name: `gridAlienUpperArm${side < 0 ? 'L' : 'R'}`,
        position: [side * 2.05, 5.95, 0.5],
        rotation: [-0.08, 0, side * 0.48],
      });
      addMesh(group, new THREE.CylinderGeometry(0.25, 0.39, 3.8, 9), membrane, {
        name: `gridAlienForearm${side < 0 ? 'L' : 'R'}`,
        position: [side * 3.2, 3.4, 1.35],
        rotation: [-0.32, 0, side * 0.22],
      });
      for (let claw = -1; claw <= 1; claw += 1) {
        addMesh(group, new THREE.ConeGeometry(0.1, 1.15, 7), teeth, {
          position: [side * (3.52 + claw * 0.13), 1.55, 2.3 + Math.abs(claw) * 0.1],
          rotation: [Math.PI / 2, 0, side * claw * 0.08],
        });
      }

      // Membres digitigrades en trois articulations.
      addMesh(group, new THREE.CylinderGeometry(0.62, 0.82, 3.75, 11), shell, {
        position: [side * 1.12, 2.15, -0.12],
        rotation: [-0.2, 0, side * 0.2],
      });
      addMesh(group, new THREE.CylinderGeometry(0.35, 0.58, 3.1, 9), membrane, {
        position: [side * 1.52, 0.22, 1.5],
        rotation: [0.62, 0, side * -0.08],
      });
      addMesh(group, new THREE.BoxGeometry(0.85, 0.42, 2.2, 3, 2, 6), ridgedShell, {
        position: [side * 1.55, -0.65, 3.25],
        rotation: [0.08, 0, 0],
      });
      for (let claw = -1; claw <= 1; claw += 1) {
        addMesh(group, new THREE.ConeGeometry(0.1, 0.95, 6), teeth, {
          position: [side * (1.55 + claw * 0.2), -0.72, 4.55],
          rotation: [Math.PI / 2, 0, 0],
        });
      }
    }

    // Queue segmentée indépendante afin que son trophée puisse être rompu.
    const tail = new THREE.Group();
    tail.name = 'gridAlienTail';
    tail.position.set(0, 4.1, -1.5);
    for (let index = 0; index < 11; index += 1) {
      const radius = Math.max(0.2, 0.63 - index * 0.038);
      addMesh(tail, new THREE.CapsuleGeometry(radius, 1.35, 5, 9), index < 5 ? shell : ridgedShell, {
        name: `gridAlienTailSegment${index + 1}`,
        position: [Math.sin(index * 0.28) * index * 0.18, -index * 0.08, -index * 1.38],
        rotation: [Math.PI / 2 + index * 0.012, 0, -Math.sin(index * 0.28) * 0.12],
        featureTag: 'segmented_blade_tail',
      });
    }
    addMesh(tail, new THREE.ConeGeometry(0.72, 3.4, 8), teeth, {
      name: 'gridAlienTailBlade',
      position: [0.2, -0.95, -16.05],
      rotation: [-Math.PI / 2, 0, -0.08],
      scale: [0.72, 1, 1.35],
      featureTag: 'segmented_blade_tail',
    });
    group.add(tail);

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

  getHeadWorldPosition() {
    this.mesh.updateWorldMatrix(true, true);
    return this.mesh.localToWorld(HEAD_OFFSET.clone());
  }

  getBodyWorldPosition() {
    this.mesh.updateWorldMatrix(true, true);
    return this.mesh.localToWorld(BODY_OFFSET.clone());
  }

  getTailWorldPosition() {
    this.mesh.updateWorldMatrix(true, true);
    return this.mesh.localToWorld(TAIL_WEAKPOINT_OFFSET.clone());
  }

  getAimPoint() {
    return this.headIntact ? this.getHeadWorldPosition() : this.getBodyWorldPosition();
  }

  resolveProjectileImpact(projectilePosition, projectileRadius = 1, previousPosition = projectilePosition) {
    if (!projectilePosition?.isVector3 || this.isDead || this._disposed) return null;
    const safeRadius = Math.max(0, Number(projectileRadius) || 0);
    const start = previousPosition?.isVector3 ? previousPosition : projectilePosition;
    const bodyPosition = this.getBodyWorldPosition();
    const bodyImpact = resolveSegmentSphereImpact(
      start,
      projectilePosition,
      bodyPosition,
      this.colliderRadius + safeRadius,
    );

    if (this.headIntact) {
      const headPosition = this.getHeadWorldPosition();
      const headImpact = resolveSegmentSphereImpact(start, projectilePosition, headPosition, 2.65 + safeRadius)
        || (bodyImpact && forwardRayIntersectsSphere(start, projectilePosition, headPosition, 2.65 + safeRadius));
      if (headImpact) return headPosition;
    }

    if (this.tailIntact) {
      const tailPosition = this.getTailWorldPosition();
      const tailImpact = resolveSegmentSphereImpact(start, projectilePosition, tailPosition, 3.35 + safeRadius)
        || (bodyImpact && forwardRayIntersectsSphere(start, projectilePosition, tailPosition, 3.35 + safeRadius));
      if (tailImpact) return tailPosition;
    }

    return bodyImpact;
  }

  syncDamageVisuals() {
    if (this.domeMesh) this.domeMesh.visible = this.headIntact;
    if (this.innerJawMesh) this.innerJawMesh.visible = this.headIntact;
    if (this.tailGroup) this.tailGroup.visible = this.tailIntact;
    return true;
  }

  breakHead() {
    if (!this.headIntact) return false;
    this.headIntact = false;
    this.headIntegrity = 0;
    this.headHealth = 0;
    if (this.activeAttackType === 'grid_bite' || this.activeAttackType === 'grid_acid_volley') this.cancelAttack();
    this.syncDamageVisuals();
    audioSynth.playMonsterRoar();
    return true;
  }

  breakTail() {
    if (!this.tailIntact) return false;
    this.tailIntact = false;
    this.tailIntegrity = 0;
    this.tailHealth = 0;
    if (this.activeAttackType === 'grid_tail_sweep') this.cancelAttack();
    this.syncDamageVisuals();
    audioSynth.playMonsterRoar();
    return true;
  }

  takeDamage(amount, hitPosition = this.getBodyWorldPosition()) {
    if (this.isDead || this._disposed) {
      return { damage: 0, killed: this.isDead, remainingHealth: this.health };
    }

    const incomingDamage = Math.max(0, Number(amount) || 0);
    if (incomingDamage === 0) return { damage: 0, killed: false, remainingHealth: this.health };
    const impact = hitPosition?.isVector3 ? hitPosition : this.getBodyWorldPosition();
    const headHit = this.headIntact && impact.distanceTo(this.getHeadWorldPosition()) <= 3.1;
    const tailHit = this.tailIntact && impact.distanceTo(this.getTailWorldPosition()) <= 3.9;

    let healthDamage = incomingDamage;
    if (headHit) {
      this.headIntegrity = Math.max(0, this.headIntegrity - incomingDamage);
      this.headHealth = this.headIntegrity;
      healthDamage *= 1.18;
      if (this.headIntegrity === 0) this.breakHead();
    } else if (tailHit) {
      this.tailIntegrity = Math.max(0, this.tailIntegrity - incomingDamage);
      this.tailHealth = this.tailIntegrity;
      if (this.tailIntegrity === 0) this.breakTail();
    }

    this.health = Math.max(0, this.health - healthDamage);
    if (this.acidBloodCooldown === 0 && incomingDamage >= 20) {
      this.spawnAcidBlood(impact, Math.min(3, 1 + Math.floor(incomingDamage / 90)));
      this.acidBloodCooldown = 0.7;
    }

    if (this.health <= this.maxHealth * 0.52) this.isEnraged = true;
    if (this.health === 0) {
      this.isDead = true;
      this.aiState = 'dead';
      this.cancelAttack();
      this.clearOffense();
      restoreBaseMaterials(this.mesh);
      audioSynth.playMonsterRoar();
    } else {
      audioSynth.playAcidSizzle();
    }

    return {
      damage: healthDamage,
      headHit,
      tailHit,
      headIntact: this.headIntact,
      tailIntact: this.tailIntact,
      killed: this.isDead,
      remainingHealth: this.health,
    };
  }

  applyNet() {
    if (this.isDead || this._disposed) return false;
    this.cancelAttack();
    this.isNetted = true;
    this.netTimer = this.isEnraged ? 0.72 : 1.2;
    this.aiState = 'netted';
    return true;
  }

  createAcidProjectile(origin, direction, {
    damage = 24,
    speed = 36,
    lifetime = 2.5,
    type = 'grid_acid',
    radius = 0.34,
  } = {}) {
    const material = new THREE.MeshStandardMaterial({
      color: 0xc9ff32,
      emissive: 0x4daa08,
      emissiveIntensity: 2.4,
      roughness: 0.16,
      transparent: true,
      opacity: 0.92,
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 12, 9), material);
    mesh.name = type === 'grid_acid_blood' ? 'gridAcidBloodProjectile' : 'gridAcidVolleyProjectile';
    mesh.position.copy(origin);
    mesh.castShadow = false;
    mesh.userData.visionExempt = true;
    this.scene.add(mesh);

    const projectile = {
      mesh,
      dir: direction.clone().normalize(),
      speed,
      damage,
      lifetime,
      type,
      statusEffect: 'corrosion',
      statusDuration: type === 'grid_acid_blood' ? 1.6 : 2.8,
      signal: type === 'grid_acid_blood' ? 'grid_acid_blood' : 'grid_acid_volley',
      collisionRadius: radius,
    };
    this.projectiles.push(projectile);
    return projectile;
  }

  spawnAcidVolley(targetPosition, count = 3) {
    if (!this.headIntact || !targetPosition?.isVector3 || this.isDead || this._disposed) return [];
    const origin = this.getHeadWorldPosition().add(new THREE.Vector3(0, -0.35, 1.35));
    const baseDirection = targetPosition.clone().add(new THREE.Vector3(0, 2.2, 0)).sub(origin).normalize();
    const created = [];
    for (let index = 0; index < count; index += 1) {
      const centered = index - (count - 1) / 2;
      const direction = baseDirection.clone();
      direction.x += centered * 0.075;
      direction.y += Math.abs(centered) * 0.025;
      direction.normalize();
      created.push(this.createAcidProjectile(origin, direction, {
        damage: this.isEnraged ? 27 : 23,
        speed: this.isEnraged ? 43 : 37,
        lifetime: 2.65,
        radius: 0.38,
      }));
    }
    audioSynth.playAcidSizzle();
    return created;
  }

  spawnAcidBlood(impactPosition, count = 2) {
    if (!impactPosition?.isVector3 || this.isDead || this._disposed) return [];
    const created = [];
    for (let index = 0; index < count; index += 1) {
      const angle = (index / Math.max(1, count)) * Math.PI * 2 + this.health * 0.013;
      const direction = new THREE.Vector3(Math.cos(angle), 0.42 + index * 0.08, Math.sin(angle)).normalize();
      created.push(this.createAcidProjectile(impactPosition, direction, {
        damage: 14,
        speed: 15 + index * 2,
        lifetime: 1.35,
        type: 'grid_acid_blood',
        radius: 0.22,
      }));
    }
    return created;
  }

  removeProjectile(index) {
    const [projectile] = this.projectiles.splice(index, 1);
    if (!projectile) return false;
    disposeObject3D(projectile.mesh);
    return true;
  }

  updateProjectiles(delta) {
    for (let index = this.projectiles.length - 1; index >= 0; index -= 1) {
      const projectile = this.projectiles[index];
      projectile.lifetime = Math.max(0, projectile.lifetime - delta);
      projectile.mesh.position.addScaledVector(projectile.dir, projectile.speed * delta);
      projectile.mesh.rotation.x += delta * 3.8;
      projectile.mesh.rotation.y += delta * 5.1;
      if (projectile.type === 'grid_acid_blood') {
        projectile.dir.y -= delta * 0.95;
        projectile.dir.normalize();
      }
      if (projectile.lifetime === 0) this.removeProjectile(index);
    }
  }

  tickTransientState(delta) {
    if (this.isDead || this._disposed) return false;
    const frameDelta = Math.max(0, Math.min(Number(delta) || 0, 0.2));
    this.acidBloodCooldown = Math.max(0, this.acidBloodCooldown - frameDelta);
    this.updateProjectiles(frameDelta);
    return true;
  }

  clearOffense() {
    for (let index = this.projectiles.length - 1; index >= 0; index -= 1) this.removeProjectile(index);
  }

  startAttack(kind, targetPosition) {
    if (
      !targetPosition?.isVector3
      || this.isDead
      || this._disposed
      || this.isNetted
      || (kind === 'tail' && !this.tailIntact)
      || ((kind === 'bite' || kind === 'acid') && !this.headIntact)
    ) return false;

    this.cancelAttack();
    const specs = {
      bite: { type: 'grid_bite', windup: 0.34, state: 'grid_bite_windup' },
      pounce: { type: 'grid_pounce', windup: 0.62, state: 'grid_pounce_windup' },
      tail: { type: 'grid_tail_sweep', windup: 0.56, state: 'attack_tail' },
      acid: { type: 'grid_acid_volley', windup: 0.72, state: 'acid_spray' },
    };
    const spec = specs[kind];
    if (!spec) return false;

    this.activeAttackType = spec.type;
    this.attackStage = 'windup';
    this.attackStageTimer = this.isEnraged ? spec.windup * 0.82 : spec.windup;
    this.attackTarget.copy(targetPosition);
    this.attackDirection.copy(targetPosition).sub(this.position);
    this.attackDirection.y = 0;
    if (this.attackDirection.lengthSq() < 0.0001) this.attackDirection.set(0, 0, 1);
    else this.attackDirection.normalize();
    this.aiState = spec.state;
    this.attackTelegraphAnnounced = false;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    return true;
  }

  cancelAttack() {
    this.activeAttackType = null;
    this.attackStage = 'idle';
    this.attackStageTimer = 0;
    this.attackRecoveryTimer = 0;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.attackTelegraphAnnounced = false;
    if (this.tailGroup) this.tailGroup.rotation.set(0, 0, 0);
    if (this.domeMesh) this.domeMesh.rotation.set(Math.PI / 2, 0, 0);
    if (this.innerJawMesh) this.innerJawMesh.position.z = 4.52;
    this.mesh.scale.set(1, 1, 1);
  }

  consumeAttackImpact() {
    if (!this.attackImpactReady || this.attackImpactConsumed) return false;
    this.attackImpactConsumed = true;
    this.attackImpactReady = false;
    return true;
  }

  beginRecovery(duration) {
    this.attackStage = 'recovery';
    this.attackStageTimer = 0;
    this.attackRecoveryTimer = Math.max(0.16, duration);
    this.attackImpactReady = false;
    this.aiState = 'recover';
    this.attackCooldown = Math.max(this.attackCooldown, this.isEnraged ? 0.92 : 1.32);
  }

  updateActiveAttack(delta) {
    if (!this.activeAttackType) return false;

    if (this.attackStage === 'windup') {
      this.attackStageTimer = Math.max(0, this.attackStageTimer - delta);
      const targetAngle = Math.atan2(this.attackDirection.x, this.attackDirection.z);
      let difference = targetAngle - this.mesh.rotation.y;
      difference = Math.atan2(Math.sin(difference), Math.cos(difference));
      this.mesh.rotation.y += difference * Math.min(1, delta * 7.2);
      const pulse = 1 + Math.sin((1 - this.attackStageTimer) * Math.PI * 5) * 0.018;

      if (this.activeAttackType === 'grid_tail_sweep' && this.tailGroup) {
        this.tailGroup.rotation.y = THREE.MathUtils.lerp(0, -0.78, 1 - this.attackStageTimer / 0.56);
      } else if (this.activeAttackType === 'grid_acid_volley' && this.domeMesh) {
        this.domeMesh.rotation.x = Math.PI / 2 - 0.12;
        this.mesh.scale.set(pulse, pulse, pulse);
      } else if (this.activeAttackType === 'grid_pounce') {
        this.mesh.scale.set(1.08, 0.91, 1.05);
      } else if (this.activeAttackType === 'grid_bite' && this.innerJawMesh) {
        this.innerJawMesh.position.z = 4.52 + (1 - this.attackStageTimer / 0.34) * 0.55;
      }

      if (this.attackStageTimer === 0) {
        this.attackStage = 'impact';
        this.attackImpactReady = true;
        if (this.activeAttackType === 'grid_tail_sweep') {
          this.aiState = 'attack_tail';
          this.attackStageTimer = 0.2;
          audioSynth.playSpearThrow();
        } else if (this.activeAttackType === 'grid_acid_volley') {
          this.aiState = 'acid_spray';
          this.attackStageTimer = 0.16;
          this.spawnAcidVolley(this.attackTarget, this.isEnraged ? 5 : 3);
        } else if (this.activeAttackType === 'grid_pounce') {
          this.aiState = 'attack_jaw';
          this.attackStageTimer = 0.34;
          audioSynth.playMonsterRoar();
        } else {
          this.aiState = 'attack_jaw';
          this.attackStageTimer = 0.14;
          audioSynth.playMonsterRoar();
        }
      }
      return true;
    }

    if (this.attackStage === 'impact') {
      this.attackStageTimer = Math.max(0, this.attackStageTimer - delta);
      if (this.activeAttackType === 'grid_pounce') {
        this.position.addScaledVector(this.attackDirection, this.pounceSpeed * (this.isEnraged ? 1.18 : 1) * delta);
      } else if (this.activeAttackType === 'grid_tail_sweep' && this.tailGroup) {
        this.tailGroup.rotation.y = 0.94;
      } else if (this.activeAttackType === 'grid_bite' && this.innerJawMesh) {
        this.innerJawMesh.position.z = 5.35;
      }
      if (this.attackStageTimer === 0) this.beginRecovery(this.activeAttackType === 'grid_pounce' ? 0.52 : 0.38);
      return true;
    }

    if (this.attackStage === 'recovery') {
      this.attackRecoveryTimer = Math.max(0, this.attackRecoveryTimer - delta);
      if (this.tailGroup) this.tailGroup.rotation.y *= Math.max(0, 1 - delta * 8);
      if (this.domeMesh) {
        this.domeMesh.rotation.x = THREE.MathUtils.lerp(
          this.domeMesh.rotation.x, Math.PI / 2, Math.min(1, delta * 8),
        );
      }
      if (this.attackRecoveryTimer === 0) {
        this.cancelAttack();
        this.aiState = 'chase';
      }
      return true;
    }

    return false;
  }

  chooseAttack(distance, targetPosition) {
    if (distance <= 7.5 && this.headIntact) return this.startAttack('bite', targetPosition);
    if (distance <= 17 && this.tailIntact) return this.startAttack('tail', targetPosition);
    if (distance <= 34) return this.startAttack('pounce', targetPosition);
    if (distance <= 68 && this.headIntact) return this.startAttack('acid', targetPosition);
    return false;
  }

  update(delta, playerPosition, isPlayerCloaked = false) {
    if (this.isDead || this._disposed) return;

    const frameDelta = Math.max(0, Math.min(Number(delta) || 0, 0.2));
    this.tickTransientState(frameDelta);
    this.attackCooldown = Math.max(0, this.attackCooldown - frameDelta);

    if (this.isNetted) {
      this.netTimer = Math.max(0, this.netTimer - frameDelta);
      if (this.netTimer === 0) {
        this.isNetted = false;
        this.aiState = 'stalk';
      }
      this.mesh.position.copy(this.position);
      return;
    }

    if (this.updateActiveAttack(frameDelta)) {
      this.clampToArena();
      this.mesh.position.copy(this.position);
      return;
    }
    if (!playerPosition?.isVector3) return;

    const targetDirection = playerPosition.clone().sub(this.position);
    targetDirection.y = 0;
    const distance = targetDirection.length();
    if (distance > 0.0001) targetDirection.normalize();
    const detectionRadius = isPlayerCloaked ? 32 : 145;
    if (distance > detectionRadius) {
      this.aiState = 'stalk';
      this.mesh.position.copy(this.position);
      return;
    }

    const targetAngle = Math.atan2(targetDirection.x, targetDirection.z);
    let difference = targetAngle - this.mesh.rotation.y;
    difference = Math.atan2(Math.sin(difference), Math.cos(difference));
    this.mesh.rotation.y += difference * Math.min(1, frameDelta * (this.isEnraged ? 7.4 : 5.8));
    this.aiState = 'chase';

    if (this.attackCooldown === 0) this.chooseAttack(distance, playerPosition);
    if (this.aiState === 'chase' && distance > 5.8) {
      const tailPenalty = this.tailIntact ? 1 : 0.84;
      const speed = (this.isEnraged ? this.enragedSpeed : this.moveSpeed) * tailPenalty;
      this.position.addScaledVector(targetDirection, speed * frameDelta);
    }

    this.clampToArena();
    this.mesh.position.copy(this.position);
  }

  clampToArena() {
    const arenaBoundary = Math.max(40, Number(this.arenaBoundary) || 330);
    this.position.x = THREE.MathUtils.clamp(this.position.x, -arenaBoundary, arenaBoundary);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -arenaBoundary, arenaBoundary);
  }

  getHUDState() {
    return {
      health: this.health,
      maxHealth: this.maxHealth,
      enraged: this.isEnraged,
      headIntact: this.headIntact,
      headIntegrity: this.headIntegrity,
      maxHeadIntegrity: this.maxHeadIntegrity,
      tailIntact: this.tailIntact,
      tailIntegrity: this.tailIntegrity,
      maxTailIntegrity: this.maxTailIntegrity,
      acidProjectiles: this.projectiles.length,
      attack: this.activeAttackType,
    };
  }

  dispose() {
    if (this._disposed) return false;
    this._disposed = true;
    this.cancelAttack();
    this.clearOffense();
    restoreBaseMaterials(this.mesh);
    this.thermalMaterial?.dispose?.();
    disposeObject3D(this.mesh);
    return true;
  }
}
