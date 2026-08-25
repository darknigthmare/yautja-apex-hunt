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

export const WOLF_CLEANER_TEXTURES = Object.freeze({
  alloy: '/assets/textures/wolf-cleaner-alloy.webp',
});

const MASK_OFFSET = new THREE.Vector3(0, 9.55, 0.92);
const CLEANER_KIT_OFFSET = new THREE.Vector3(1.85, 5.8, -1.15);
const PROJECTILE_FORWARD = new THREE.Vector3(0, 0, 1);

function loadBrowserTexture(path) {
  // TextureLoader depends on browser image primitives. The procedural fallback
  // keeps construction deterministic in Node tests and server-side tooling.
  if (typeof document === 'undefined' || typeof document.createElementNS !== 'function') return null;

  try {
    const texture = new THREE.TextureLoader().load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.55, 1.55);
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
 * Chasseur-nettoyeur inspiré du personnage et de l'arsenal montrés dans AVP:R.
 * La silhouette, les matériaux, les animations et toutes les géométries sont
 * des créations procédurales originales réalisées pour Apex Hunt.
 */
export class WolfCleanerBoss {
  constructor(scene) {
    if (!scene?.add) throw new TypeError('WolfCleanerBoss requiert une scène THREE valide.');

    this.scene = scene;

    // Contrat runtime commun des cibles de chasse.
    this.maxHealth = 2250;
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
    this.cleanerZones = [];
    // Alias stable pour les systèmes génériques de dangers de niveau.
    this.hazards = this.cleanerZones;
    this.colliderRadius = 5.15;

    // État des sous-systèmes affiché par le HUD et utilisé par le gameplay.
    this.maxMaskIntegrity = 100;
    this.maskIntegrity = this.maxMaskIntegrity;
    this.maskIntact = true;
    this.maxCleanerKitIntegrity = 100;
    this.cleanerKitIntegrity = this.maxCleanerKitIntegrity;
    this.cleanerKitIntact = true;
    this.trophyIntegrity = 100;

    this.position = new THREE.Vector3(0, 0, -54);
    this.moveSpeed = 13.5;
    this.enragedSpeed = 19.75;
    this.whipWindupDuration = 0;
    this.whipWindupTimer = 0;
    this.whipRecoveryTimer = 0;
    this.cleanerActionIndex = 0;
    this._disposed = false;

    this.alloyTexture = loadBrowserTexture(WOLF_CLEANER_TEXTURES.alloy);
    this.mesh = this.createBossMesh();
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);
    captureBaseMaterials(this.mesh);

    this.maskMesh = this.mesh.getObjectByName('wolfBioMask');
    this.revealedFaceMesh = this.mesh.getObjectByName('wolfRevealedFace');
    this.cleanerKitMesh = this.mesh.getObjectByName('wolfCleanerKit');
    this.whipMesh = this.mesh.getObjectByName('wolfSegmentedWhip');
    this.leftCaster = this.mesh.getObjectByName('wolfCasterLeft');
    this.rightCaster = this.mesh.getObjectByName('wolfCasterRight');
    this.thermalMaterial = ShaderManager.createThermalMaterial(0xff5a22, 0.98);
  }

  createBossMesh() {
    const group = new THREE.Group();
    group.name = 'wolfCleanerBoss';
    group.userData.silhouette = 'veteran_cleaner_dual_caster';
    group.userData.provenance = 'AVP:R character and arsenal reference; original procedural implementation';

    const skin = new THREE.MeshStandardMaterial({
      color: 0x5f5540,
      roughness: 0.86,
      metalness: 0.04,
    });
    const armor = new THREE.MeshStandardMaterial({
      color: 0x3f4b4b,
      map: this.alloyTexture,
      roughness: 0.34,
      metalness: 0.86,
    });
    const scorchedArmor = new THREE.MeshStandardMaterial({
      color: 0x171d1d,
      map: this.alloyTexture,
      roughness: 0.44,
      metalness: 0.76,
    });
    const leather = new THREE.MeshStandardMaterial({
      color: 0x161313,
      roughness: 0.96,
      metalness: 0.03,
    });
    const blade = new THREE.MeshStandardMaterial({
      color: 0xabc9c9,
      roughness: 0.16,
      metalness: 1,
    });
    const reagent = new THREE.MeshPhysicalMaterial({
      color: 0x67ff4c,
      emissive: 0x1a8a16,
      emissiveIntensity: 1.3,
      roughness: 0.18,
      transmission: 0.15,
      transparent: true,
      opacity: 0.88,
    });
    const plasmaGlow = new THREE.MeshBasicMaterial({ color: 0x5affdf });

    // Torse vétéran compact : nombreuses plaques, dégâts acides et asymétrie.
    addMesh(group, new THREE.CapsuleGeometry(1.88, 4.35, 7, 12), skin, {
      name: 'wolfTorso',
      position: [0, 5.2, 0],
      scale: [1.16, 1, 0.77],
    });
    addMesh(group, new THREE.BoxGeometry(4.25, 2.75, 2.2), armor, {
      position: [0, 6.45, 0.02],
      rotation: [-0.03, 0.02, -0.04],
    });
    addMesh(group, new THREE.BoxGeometry(3.65, 0.42, 2.5), scorchedArmor, {
      position: [-0.28, 7.65, 0.05],
      rotation: [-0.08, 0.05, 0.04],
    });
    for (let plate = 0; plate < 4; plate += 1) {
      addMesh(group, new THREE.BoxGeometry(3.35 - plate * 0.18, 0.38, 1.55), armor, {
        position: [0.12, 6.85 - plate * 0.55, 1.08],
        rotation: [0.08, plate % 2 === 0 ? -0.04 : 0.04, 0],
      });
    }

    addMesh(group, new THREE.CylinderGeometry(0.7, 0.92, 1.3, 10), skin, {
      position: [0, 8.15, 0],
    });
    addMesh(group, new THREE.SphereGeometry(1.08, 14, 11), skin, {
      name: 'wolfRevealedFace',
      position: [0, 9.22, 0.2],
      scale: [1.02, 1.12, 0.83],
    });

    // Bio-masque abîmé à viseur unique. Ce volume n'est pas un scan d'accessoire.
    const mask = new THREE.Group();
    mask.name = 'wolfBioMask';
    mask.position.set(...MASK_OFFSET.toArray());
    addMesh(mask, new THREE.SphereGeometry(1.16, 13, 10, 0, Math.PI * 2, 0, Math.PI * 0.72), armor, {
      scale: [1.02, 1.14, 0.62],
    });
    addMesh(mask, new THREE.BoxGeometry(2.28, 0.25, 0.45), scorchedArmor, {
      position: [0, 0.36, 0.57],
      rotation: [0, 0, -0.08],
    });
    addMesh(mask, new THREE.BoxGeometry(0.42, 1.45, 0.48), armor, {
      position: [-0.67, -0.43, 0.57],
      rotation: [0.04, 0, -0.12],
    });
    addMesh(mask, new THREE.BoxGeometry(0.42, 1.45, 0.48), armor, {
      position: [0.67, -0.43, 0.57],
      rotation: [0.04, 0, 0.12],
    });
    for (const x of [-0.33, 0, 0.33]) {
      addMesh(mask, new THREE.SphereGeometry(0.09, 8, 7), plasmaGlow, {
        position: [x, 0.26, 0.84],
        castShadow: false,
        visionExempt: true,
      });
    }
    group.add(mask);

    // Predlocks de vétéran, inégales et cerclées d'alliage terni.
    for (let index = 0; index < 14; index += 1) {
      const angle = THREE.MathUtils.lerp(-1.35, 1.35, index / 13);
      const dread = addMesh(group, new THREE.CylinderGeometry(0.12, 0.2, 4.25, 6), leather, {
        position: [Math.sin(angle) * 1.14, 7.95 - Math.abs(angle) * 0.18, -0.7],
        rotation: [0.52 + Math.abs(angle) * 0.08, 0, -angle * 0.27],
      });
      if (index % 3 !== 1) {
        addMesh(dread, new THREE.TorusGeometry(0.18, 0.045, 5, 8), armor, {
          position: [0, -1.17, 0],
          rotation: [Math.PI / 2, 0, 0],
        });
      }
    }

    // Membres, épaulières superposées et double lame de poignet.
    for (const side of [-1, 1]) {
      addMesh(group, new THREE.SphereGeometry(1.08, 10, 8), side < 0 ? armor : scorchedArmor, {
        position: [side * 2.55, 7.05, -0.02],
        scale: [1.22, 0.72, 1.03],
      });
      addMesh(group, new THREE.CylinderGeometry(0.48, 0.64, 3.35, 9), skin, {
        position: [side * 2.62, 5.14, 0.13],
        rotation: [0.04, 0, side * 0.08],
      });
      addMesh(group, new THREE.BoxGeometry(1.02, 1.18, 1.45), armor, {
        position: [side * 2.65, 3.68, 0.43],
      });
      addMesh(group, new THREE.CylinderGeometry(0.7, 0.82, 3.9, 9), skin, {
        position: [side * 1.08, 1.98, 0],
        rotation: [0, 0, side * 0.04],
      });
      addMesh(group, new THREE.BoxGeometry(1.52, 0.62, 2.52), scorchedArmor, {
        position: [side * 1.08, 0.34, 0.5],
      });
    }
    for (const offset of [-0.18, 0.18]) {
      addMesh(group, new THREE.BoxGeometry(0.1, 0.1, 3.05), blade, {
        position: [2.86 + offset, 3.5, 1.87],
      });
    }

    // Deux canons indépendants : chaque bouche produit son propre projectile.
    for (const [side, name] of [[-1, 'wolfCasterLeft'], [1, 'wolfCasterRight']]) {
      const caster = new THREE.Group();
      caster.name = name;
      caster.position.set(side * 2.45, 8.05, -0.2);
      addMesh(caster, new THREE.BoxGeometry(0.92, 0.78, 1.88), scorchedArmor);
      addMesh(caster, new THREE.CylinderGeometry(0.2, 0.29, 2.55, 9), armor, {
        position: [0, 0.12, 1.65],
        rotation: [Math.PI / 2, 0, 0],
      });
      addMesh(caster, new THREE.SphereGeometry(0.17, 8, 7), plasmaGlow, {
        position: [0, 0.12, 2.96],
        castShadow: false,
        visionExempt: true,
      });
      group.add(caster);
    }

    // Fouet segmenté replié sur la hanche ; son pivot anime le télégraphe.
    const whip = new THREE.Group();
    whip.name = 'wolfSegmentedWhip';
    whip.position.set(-2.75, 4.15, 0.65);
    for (let segment = 0; segment < 12; segment += 1) {
      addMesh(whip, new THREE.BoxGeometry(0.24, 0.18, 0.78), blade, {
        position: [Math.sin(segment * 0.34) * 0.38, -segment * 0.3, segment * 0.58],
        rotation: [0.08 + segment * 0.018, segment * 0.05, -segment * 0.055],
        scale: [1 - segment * 0.035, 1, 1],
      });
    }
    group.add(whip);

    // Kit de confinement : réservoir, injecteurs et mines, destructible.
    const kit = new THREE.Group();
    kit.name = 'wolfCleanerKit';
    kit.position.set(...CLEANER_KIT_OFFSET.toArray());
    addMesh(kit, new THREE.BoxGeometry(1.38, 2.55, 1.28), scorchedArmor);
    for (const x of [-0.37, 0.37]) {
      addMesh(kit, new THREE.CylinderGeometry(0.22, 0.28, 1.9, 9), reagent, {
        position: [x, 0, 0.65],
      });
    }
    for (let mine = 0; mine < 3; mine += 1) {
      addMesh(kit, new THREE.CylinderGeometry(0.35, 0.35, 0.16, 12), armor, {
        position: [-0.46 + mine * 0.46, -1.55, 0.32],
        rotation: [Math.PI / 2, 0, 0],
      });
    }
    group.add(kit);

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
  getMaskWorldPosition() {
    this.mesh.updateWorldMatrix(true, true);
    return this.maskMesh?.getWorldPosition(new THREE.Vector3())
      ?? this.mesh.localToWorld(MASK_OFFSET.clone());
  }

  getCleanerKitWorldPosition() {
    this.mesh.updateWorldMatrix(true, true);
    return this.cleanerKitMesh?.getWorldPosition(new THREE.Vector3())
      ?? this.mesh.localToWorld(CLEANER_KIT_OFFSET.clone());
  }

  getAimPoint() {
    if (this.maskIntact) return this.getMaskWorldPosition();
    if (this.cleanerKitIntact) return this.getCleanerKitWorldPosition();
    return this.mesh.localToWorld(new THREE.Vector3(0, 4.6, 0));
  }

  resolveProjectileImpact(projectilePosition, projectileRadius = 1, previousPosition = projectilePosition) {
    if (!projectilePosition?.isVector3 || this.isDead || this._disposed) return null;
    const safeRadius = Math.max(0, Number(projectileRadius) || 0);
    const start = previousPosition?.isVector3 ? previousPosition : projectilePosition;
    const maskPosition = this.getMaskWorldPosition();
    const kitPosition = this.getCleanerKitWorldPosition();
    const bodyImpact = resolveSegmentSphereImpact(
      start,
      projectilePosition,
      this.position,
      this.colliderRadius + safeRadius,
    );

    const maskCrossed = this.maskIntact && (
      resolveSegmentSphereImpact(start, projectilePosition, maskPosition, 2.8 + safeRadius)
      || (bodyImpact && forwardRayIntersectsSphere(start, projectilePosition, maskPosition, 2.8 + safeRadius))
    );
    if (maskCrossed) return maskPosition;

    const kitCrossed = this.cleanerKitIntact && (
      resolveSegmentSphereImpact(start, projectilePosition, kitPosition, 2.65 + safeRadius)
      || (bodyImpact && forwardRayIntersectsSphere(start, projectilePosition, kitPosition, 2.65 + safeRadius))
    );
    if (kitCrossed) return kitPosition;

    return bodyImpact;
  }

  breakMask() {
    if (!this.maskIntact) return false;
    this.maskIntact = false;
    this.maskIntegrity = 0;
    this.trophyIntegrity = Math.max(0, this.trophyIntegrity - 22);
    if (this.maskMesh) this.maskMesh.visible = false;
    if (this.revealedFaceMesh) this.revealedFaceMesh.scale.set(1.08, 1.08, 0.88);
    audioSynth.playYautjaClick();
    return true;
  }

  breakCleanerKit() {
    if (!this.cleanerKitIntact) return false;
    this.cleanerKitIntact = false;
    this.cleanerKitIntegrity = 0;
    this.trophyIntegrity = Math.max(0, this.trophyIntegrity - 16);
    if (this.cleanerKitMesh) this.cleanerKitMesh.visible = false;
    audioSynth.playAcidSizzle();
    return true;
  }

  takeDamage(amount, hitPosition = this.position) {
    if (this.isDead || this._disposed) {
      return { damage: 0, killed: this.isDead, remainingHealth: this.health };
    }

    const damage = Math.max(0, Number(amount) || 0);
    if (damage === 0) return { damage: 0, killed: false, remainingHealth: this.health };

    const impact = hitPosition?.isVector3 ? hitPosition : this.position;
    const maskPosition = this.getMaskWorldPosition();
    const kitPosition = this.getCleanerKitWorldPosition();
    const maskHit = this.maskIntact && impact.distanceTo(maskPosition) <= 2.8;
    const kitHit = this.cleanerKitIntact && impact.distanceTo(kitPosition) <= 2.65;

    if (maskHit) {
      this.maskIntegrity = Math.max(0, this.maskIntegrity - damage * 0.48);
      this.trophyIntegrity = Math.max(0, this.trophyIntegrity - damage * 0.012);
      if (this.maskIntegrity === 0) this.breakMask();
    }
    if (kitHit) {
      this.cleanerKitIntegrity = Math.max(0, this.cleanerKitIntegrity - damage * 0.55);
      if (this.cleanerKitIntegrity === 0) this.breakCleanerKit();
    }

    this.maskIntegrity = Math.round(this.maskIntegrity * 10) / 10;
    this.cleanerKitIntegrity = Math.round(this.cleanerKitIntegrity * 10) / 10;
    this.trophyIntegrity = Math.round(this.trophyIntegrity * 10) / 10;
    this.health = Math.max(0, this.health - damage);

    if (!this.isEnraged && this.health <= this.maxHealth * 0.5) {
      this.isEnraged = true;
      this.attackCooldown = Math.min(this.attackCooldown, 0.3);
      audioSynth.playMonsterRoar();
    }

    if (this.health === 0) {
      this.isDead = true;
      this.aiState = 'dead';
      this.activeAttackType = null;
      this.cancelWhipAttack();
      this.clearOffense();
      restoreBaseMaterials(this.mesh);
      audioSynth.playMonsterRoar();
    }

    return {
      damage,
      maskHit,
      cleanerKitHit: kitHit,
      maskBroken: !this.maskIntact,
      cleanerKitBroken: !this.cleanerKitIntact,
      killed: this.isDead,
      remainingHealth: this.health,
    };
  }

  applyNet() {
    if (this.isDead || this._disposed) return false;
    this.isNetted = true;
    this.netTimer = this.isEnraged ? 1.1 : 2;
    this.cancelWhipAttack();
    this.aiState = 'netted';
    this.activeAttackType = null;
    return true;
  }

  startWhipAttack() {
    if (this.isDead || this.isNetted || this._disposed) return false;
    this.aiState = 'whip_windup';
    this.activeAttackType = 'whip_sweep';
    this.whipWindupDuration = this.isEnraged ? 0.34 : 0.52;
    this.whipWindupTimer = this.whipWindupDuration;
    this.whipRecoveryTimer = this.whipWindupDuration + (this.isEnraged ? 0.2 : 0.28);
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.attackTelegraphAnnounced = false;
    this.attackCooldown = this.isEnraged ? 1.2 : 1.75;
    audioSynth.playYautjaClick();
    return true;
  }

  updateWhipAttack(delta, targetDirection) {
    if (this.whipRecoveryTimer <= 0) return false;

    if (targetDirection?.isVector3 && targetDirection.lengthSq() > 0.0001) {
      const targetAngle = Math.atan2(targetDirection.x, targetDirection.z);
      let difference = targetAngle - this.mesh.rotation.y;
      difference = Math.atan2(Math.sin(difference), Math.cos(difference));
      this.mesh.rotation.y += difference * Math.min(1, delta * 7);
    }

    const previousWindup = this.whipWindupTimer;
    this.whipWindupTimer = Math.max(0, this.whipWindupTimer - delta);
    this.whipRecoveryTimer = Math.max(0, this.whipRecoveryTimer - delta);
    const progress = this.whipWindupDuration > 0
      ? 1 - (this.whipWindupTimer / this.whipWindupDuration)
      : 1;

    if (this.whipWindupTimer > 0) {
      this.aiState = 'whip_windup';
      if (this.whipMesh) this.whipMesh.rotation.y = THREE.MathUtils.lerp(0, -1.15, progress);
    } else {
      this.aiState = 'whip';
      if (previousWindup > 0 && !this.attackImpactConsumed) {
        this.attackImpactReady = true;
        audioSynth.playWhipSlash();
      }
      if (this.whipMesh) {
        const recoveryProgress = 1 - (this.whipRecoveryTimer / Math.max(0.01, this.whipWindupDuration));
        this.whipMesh.rotation.y = THREE.MathUtils.lerp(-1.15, 1.35, Math.min(1, recoveryProgress));
      }
    }

    if (this.whipRecoveryTimer === 0) {
      this.cancelWhipAttack();
      this.aiState = 'chase';
    }
    this.mesh.position.copy(this.position);
    return true;
  }

  cancelWhipAttack() {
    this.whipWindupDuration = 0;
    this.whipWindupTimer = 0;
    this.whipRecoveryTimer = 0;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    if (this.whipMesh) this.whipMesh.rotation.set(0, 0, 0);
  }

  consumeAttackImpact() {
    if (!this.attackImpactReady || this.attackImpactConsumed) return false;
    this.attackImpactConsumed = true;
    this.attackImpactReady = false;
    return true;
  }

  fireTwinPlasma(targetPosition) {
    if (!targetPosition?.isVector3 || this.isDead || this._disposed) return [];

    const shots = [];
    for (const [side, caster] of [[-1, this.leftCaster], [1, this.rightCaster]]) {
      const projectile = new THREE.Mesh(
        new THREE.SphereGeometry(this.isEnraged ? 0.68 : 0.56, 12, 10),
        ShaderManager.createPlasmaMaterial(),
      );
      projectile.name = side < 0 ? 'wolfPlasmaLeft' : 'wolfPlasmaRight';
      const origin = this.position.clone().add(new THREE.Vector3(side * 2.45, 8.2, 2.75));
      projectile.position.copy(origin);
      projectile.userData.isBossProjectile = true;

      const aimPoint = targetPosition.clone().add(new THREE.Vector3(side * 0.65, 2.2, 0));
      const direction = aimPoint.sub(origin).normalize();
      projectile.quaternion.setFromUnitVectors(PROJECTILE_FORWARD, direction);
      const shot = {
        mesh: projectile,
        dir: direction,
        speed: this.isEnraged ? 72 : 61,
        damage: this.isEnraged ? 43 : 35,
        lifetime: 4.1,
        type: 'wolf_twin_plasma',
        caster: side < 0 ? 'left' : 'right',
      };
      this.projectiles.push(shot);
      this.scene.add(projectile);
      shots.push(shot);
      if (caster) caster.rotation.x = -0.08;
    }
    audioSynth.playPlasmacasterBlast();
    return shots;
  }

  deployDissolvingFluid(targetPosition) {
    if (!targetPosition?.isVector3 || !this.cleanerKitIntact || this.isDead || this._disposed) return null;

    const zoneMesh = new THREE.Group();
    zoneMesh.name = 'wolfDissolvingFluidZone';
    const poolMaterial = new THREE.MeshBasicMaterial({
      color: 0x62ff42,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    addMesh(zoneMesh, new THREE.CircleGeometry(5.8, 28), poolMaterial, {
      rotation: [-Math.PI / 2, 0, 0],
      position: [0, 0.08, 0],
      castShadow: false,
      visionExempt: true,
    });
    for (const radius of [2.2, 3.9, 5.45]) {
      addMesh(zoneMesh, new THREE.TorusGeometry(radius, 0.07, 6, 28), poolMaterial, {
        rotation: [Math.PI / 2, 0, 0],
        position: [0, 0.11, 0],
        castShadow: false,
        visionExempt: true,
      });
    }
    zoneMesh.position.copy(targetPosition);
    zoneMesh.position.y = 0;
    this.scene.add(zoneMesh);

    const zone = {
      mesh: zoneMesh,
      type: 'dissolving_fluid',
      radius: 5.8,
      damage: this.isEnraged ? 22 : 17,
      damageInterval: 0.7,
      tickCooldown: 0,
      lifetime: this.isEnraged ? 10 : 8,
      pulsePhase: 0,
    };
    this.cleanerZones.push(zone);
    audioSynth.playAcidSizzle();
    return zone;
  }

  deployCleanerMine(targetPosition) {
    if (!targetPosition?.isVector3 || !this.cleanerKitIntact || this.isDead || this._disposed) return null;

    const mine = new THREE.Group();
    mine.name = 'wolfCleanerMine';
    const shell = new THREE.MeshStandardMaterial({ color: 0x354243, roughness: 0.3, metalness: 0.9 });
    const glow = new THREE.MeshBasicMaterial({ color: 0xff5e21 });
    addMesh(mine, new THREE.CylinderGeometry(0.72, 0.8, 0.28, 12), shell, {
      position: [0, 0.16, 0],
    });
    for (let node = 0; node < 3; node += 1) {
      const angle = node * (Math.PI * 2 / 3);
      addMesh(mine, new THREE.SphereGeometry(0.11, 7, 6), glow, {
        position: [Math.sin(angle) * 0.48, 0.34, Math.cos(angle) * 0.48],
        castShadow: false,
        visionExempt: true,
      });
    }
    mine.position.copy(targetPosition);
    mine.position.y = 0;
    this.scene.add(mine);

    const zone = {
      mesh: mine,
      type: 'proximity_mine',
      radius: 4.4,
      damage: this.isEnraged ? 64 : 52,
      lifetime: 18,
      armTimer: 0.65,
      armed: false,
      pulsePhase: 0,
    };
    this.cleanerZones.push(zone);
    audioSynth.playYautjaClick();
    return zone;
  }

  removeCleanerZone(zone) {
    const index = this.cleanerZones.indexOf(zone);
    if (index < 0) return false;
    disposeObject3D(zone.mesh);
    this.cleanerZones.splice(index, 1);
    return true;
  }

  updateProjectiles(delta) {
    for (let index = this.projectiles.length - 1; index >= 0; index -= 1) {
      const projectile = this.projectiles[index];
      projectile.mesh.position.addScaledVector(projectile.dir, projectile.speed * delta);
      projectile.lifetime = Math.max(0, projectile.lifetime - delta);
      if (projectile.lifetime === 0) {
        disposeObject3D(projectile.mesh);
        this.projectiles.splice(index, 1);
      }
    }
  }

  updateCleanerZones(delta) {
    for (let index = this.cleanerZones.length - 1; index >= 0; index -= 1) {
      const zone = this.cleanerZones[index];
      zone.lifetime = Math.max(0, zone.lifetime - delta);
      zone.pulsePhase += delta;
      if ('tickCooldown' in zone) zone.tickCooldown = Math.max(0, zone.tickCooldown - delta);
      if ('armTimer' in zone) {
        zone.armTimer = Math.max(0, zone.armTimer - delta);
        zone.armed = zone.armTimer === 0;
      }
      const pulse = 1 + Math.sin(zone.pulsePhase * (zone.armed === false ? 8 : 4)) * 0.035;
      zone.mesh.scale.set(pulse, 1, pulse);
      if (zone.lifetime === 0) this.removeCleanerZone(zone);
    }
  }

  tickTransientState(delta) {
    if (this.isDead || this._disposed) return false;
    const frameDelta = Math.max(0, Math.min(Number(delta) || 0, 0.2));
    this.updateProjectiles(frameDelta);
    this.updateCleanerZones(frameDelta);
    return true;
  }

  clearOffense() {
    this.projectiles.forEach(({ mesh }) => disposeObject3D(mesh));
    this.projectiles.splice(0);
    this.cleanerZones.forEach(({ mesh }) => disposeObject3D(mesh));
    this.cleanerZones.splice(0);
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
      return;
    }
    if (!playerPosition?.isVector3) return;

    const targetDirection = playerPosition.clone().sub(this.position);
    targetDirection.y = 0;
    const distance = targetDirection.length();
    if (distance > 0.0001) targetDirection.normalize();

    if (this.updateWhipAttack(frameDelta, targetDirection)) return;
    this.attackImpactReady = false;

    const detectionRadius = isPlayerCloaked ? (this.maskIntact ? 44 : 20) : 150;
    if (distance > detectionRadius) {
      this.aiState = 'stalk';
      this.activeAttackType = null;
      return;
    }

    const targetAngle = Math.atan2(targetDirection.x, targetDirection.z);
    let angleDifference = targetAngle - this.mesh.rotation.y;
    angleDifference = Math.atan2(Math.sin(angleDifference), Math.cos(angleDifference));
    this.mesh.rotation.y += angleDifference * Math.min(1, frameDelta * (this.isEnraged ? 7.2 : 5.8));
    for (const caster of [this.leftCaster, this.rightCaster]) {
      if (caster) caster.rotation.y = THREE.MathUtils.clamp(angleDifference, -0.58, 0.58);
    }

    this.aiState = 'chase';
    this.activeAttackType = null;
    if (this.attackCooldown === 0) {
      this.attackImpactConsumed = false;
      this.attackTelegraphAnnounced = false;

      if (distance <= 15.5) {
        this.startWhipAttack();
      } else if (this.cleanerKitIntact && distance <= 52 && this.cleanerActionIndex % 3 !== 2) {
        const offset = targetDirection.clone().multiplyScalar(this.cleanerActionIndex % 2 === 0 ? 1.5 : -1.5);
        const targetPoint = playerPosition.clone().add(offset);
        if (this.cleanerActionIndex % 3 === 0) {
          this.deployDissolvingFluid(targetPoint);
          this.aiState = 'cleaner_fluid';
          this.activeAttackType = 'dissolving_fluid';
        } else {
          this.deployCleanerMine(targetPoint);
          this.aiState = 'cleaner_mine';
          this.activeAttackType = 'proximity_mine';
        }
        this.cleanerActionIndex += 1;
        this.attackCooldown = this.isEnraged ? 2.2 : 3;
      } else if (distance <= 128) {
        this.fireTwinPlasma(playerPosition);
        this.aiState = 'twin_plasma';
        this.activeAttackType = 'dual_plasmacaster';
        this.cleanerActionIndex += 1;
        this.attackCooldown = this.isEnraged ? 1.35 : 2.1;
      }
    }

    if (this.aiState === 'chase' && distance > 7.5) {
      this.position.addScaledVector(targetDirection, (this.isEnraged ? this.enragedSpeed : this.moveSpeed) * frameDelta);
    }

    this.clampToArena();
    this.mesh.position.copy(this.position);
  }

  clampToArena() {
    const arenaBoundary = Math.max(40, Number(this.arenaBoundary) || 330);
    this.position.x = THREE.MathUtils.clamp(this.position.x, -arenaBoundary, arenaBoundary);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -arenaBoundary, arenaBoundary);
  }

  dispose() {
    if (this._disposed) return false;
    this._disposed = true;
    this.cancelWhipAttack();
    this.clearOffense();
    restoreBaseMaterials(this.mesh);
    this.thermalMaterial?.dispose?.();
    this.alloyTexture?.dispose?.();
    disposeObject3D(this.mesh);
    return true;
  }
}

export default WolfCleanerBoss;
