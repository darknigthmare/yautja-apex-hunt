import * as THREE from 'three';
import { audioSynth } from '../AudioSynthesizer.js';
import { ShaderManager } from '../Shaders.js';
import {
  captureBaseMaterials,
  disposeObject3D,
  overrideMaterials,
  restoreBaseMaterials,
} from '../utils/materialState.js';
import { getRuntimeTexture } from '../utils/runtimeTextures.js';

export const JUNGLE_HUNTER_TEXTURES = Object.freeze({
  alloy: '/assets/textures/yautja-alloy.webp',
  leather: '/assets/textures/yautja-leather-net.webp',
  skin: '/assets/textures/yautja-skin-mottled.webp',
  bone: '/assets/textures/trophy-bone.webp',
  maskAlloy: '/assets/textures/biomask-etched-alloy.webp',
});

const MASK_WORLD_OFFSET = new THREE.Vector3(0, 8.85, 0.82);
const BODY_AIM_OFFSET = new THREE.Vector3(0, 4.8, 0);
const MASK_HIT_RADIUS = 2.4;

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

const JUNGLE_HUNTER_NATIVE_FEATURES = Object.freeze([
  'classic_1987_biomask',
  'single_shoulder_plasmacaster',
  'extended_wristblades',
  'human_spine_trophies',
  'self_destruct_countdown_device',
]);

function countNativeTriangles(root) {
  let triangles = 0;
  root.traverse((object) => {
    if (!object.isMesh || !object.geometry) return;
    const { index, attributes } = object.geometry;
    triangles += index ? index.count / 3 : (attributes.position?.count ?? 0) / 3;
  });
  return Math.round(triangles);
}

function prepareNativeVisualDetail(root) {
  const detail = new THREE.Group();
  detail.name = 'bossVisualDetail:jungle_hunter';
  detail.renderOrder = 1;
  detail.userData.bossVisualDetail = true;
  detail.userData.nativeHighDetail = true;
  detail.userData.archetype = 'jungle_hunter';
  detail.userData.featureTags = [...JUNGLE_HUNTER_NATIVE_FEATURES];
  detail.userData.runtimeTexturePaths = Object.values(JUNGLE_HUNTER_TEXTURES);

  const featureObjects = [
    ['jungleHunterClassicMask', 'classic_1987_biomask'],
    ['jungleHunterSinglePlasmacaster', 'single_shoulder_plasmacaster'],
    ['jungleHunterCasterPivot', 'single_shoulder_plasmacaster'],
    ['jungleHunterWristblades', 'extended_wristblades'],
    ['jungleHunterSpineTrophy', 'human_spine_trophies'],
    ['jungleHunterWristComputer', 'self_destruct_countdown_device'],
    ['jungleHunterWristHologlyphs', 'self_destruct_countdown_device'],
  ];
  featureObjects.forEach(([name, featureTag]) => {
    const object = root.getObjectByName(name);
    if (object) object.userData.featureTag = featureTag;
  });

  [...root.children].forEach((child) => detail.add(child));
  detail.userData.triangleCount = countNativeTriangles(detail);
  root.add(detail);
  root.userData.nativeHighDetail = true;
  root.userData.bossVisualDetail = Object.freeze({
    archetype: 'jungle_hunter',
    featureTags: JUNGLE_HUNTER_NATIVE_FEATURES,
    runtimeTexturePaths: Object.freeze([...detail.userData.runtimeTexturePaths]),
    triangleCount: detail.userData.triangleCount,
  });
  return detail;
}

/**
 * Jungle Hunter original (1987 Chitta / Val Verde).
 * Modélisation procédurale 1:1 fidèle à Stan Winston et Kevin Peter Hall :
 * bio-masque classique aux courbes douces, filet de chasse, plasmacaster d'épaule gauche unique,
 * doubles lames de poignet allongées, crâne humain avec colonne vertébrale,
 * et compte à rebours d'autodestruction avec rire mimique de Billy.
 */
export class JungleHunterBoss {
  constructor(scene) {
    if (!scene?.add) throw new TypeError('JungleHunterBoss requiert une scène THREE valide.');

    this.scene = scene;

    // Contrat BossFactory commun
    this.maxHealth = 2800;
    this.health = this.maxHealth;
    this.isDead = false;
    this.isEnraged = false;
    this.isNetted = false;
    this.netTimer = 0;
    this.aiState = 'stalk';
    this.attackCooldown = 0;
    this.projectiles = [];
    this.colliderRadius = 5.2;

    this.position = new THREE.Vector3(0, 0, -56);
    this.moveSpeed = 13.5;
    this.enragedSpeed = 19.5;
    this.arenaBoundary = 330;
    this.activeAttackType = null;
    this.attackImpactReady = false;
    this.attackImpactConsumed = false;
    this.attackTelegraphAnnounced = false;
    this.meleeWindup = 0;
    this.nativeHighDetail = true;

    // Sous-systèmes 1:1 fidèles au film 1987
    this.maskIntact = true;
    this.maskIntegrity = 220;
    this.laserLocked = false;
    this.laserLockTimer = 0;
    this.triLaserChargeTimer = 0;

    // Phase signature : Compte à rebours d'autodestruction à 0 HP
    this.selfDestructTriggered = false;
    this.selfDestructCountdown = 4.0;
    this.selfDestructTimer = 0;
    this.selfDestructDetonated = false;
    this.wristRunesActive = false;
    this.laughMimicPlayed = false;

    this.trophyIntegrity = 100;
    this._disposed = false;

    this.textures = {
      alloy: getRuntimeTexture(JUNGLE_HUNTER_TEXTURES.alloy, { repeat: [2, 2] }),
      leather: getRuntimeTexture(JUNGLE_HUNTER_TEXTURES.leather, { repeat: [3, 3] }),
      skin: getRuntimeTexture(JUNGLE_HUNTER_TEXTURES.skin, { repeat: [2, 2] }),
      bone: getRuntimeTexture(JUNGLE_HUNTER_TEXTURES.bone, { repeat: [1.5, 1.5] }),
      maskAlloy: getRuntimeTexture(JUNGLE_HUNTER_TEXTURES.maskAlloy, { repeat: [1.8, 1.8] }),
    };

    this.mesh = this.createBossMesh();
    this.visualDetail = prepareNativeVisualDetail(this.mesh);
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);
    captureBaseMaterials(this.mesh);

    this.maskMesh = this.mesh.getObjectByName('jungleHunterClassicMask');
    this.revealedFaceMesh = this.mesh.getObjectByName('jungleHunterRevealedFace');
    this.casterMesh = this.mesh.getObjectByName('jungleHunterSinglePlasmacaster');
    this.casterPivot = this.mesh.getObjectByName('jungleHunterCasterPivot');
    this.wristComputerMesh = this.mesh.getObjectByName('jungleHunterWristComputer');
    this.wristRunesMesh = this.mesh.getObjectByName('jungleHunterWristHologlyphs');
    this.triLaserDot = this.mesh.getObjectByName('jungleHunterTriLaserEmitter');

    this.thermalMaterial = ShaderManager.createThermalMaterial(0xff451a, 0.96);
  }

  createBossMesh() {
    const group = new THREE.Group();
    group.name = 'jungleHunterBoss';
    group.userData.silhouette = 'classic_1987_jungle_hunter';
    group.userData.combatIdentity = 'tri_laser_plasmacaster_self_destruct';
    group.userData.runtimeTexturePaths = Object.values(JUNGLE_HUNTER_TEXTURES);

    const skin = new THREE.MeshStandardMaterial({
      color: 0x6e6850,
      map: this.textures.skin,
      roughness: 0.82,
      metalness: 0.05,
    });
    const leatherNet = new THREE.MeshStandardMaterial({
      color: 0x221a14,
      map: this.textures.leather,
      roughness: 0.92,
      metalness: 0.08,
    });
    const armor = new THREE.MeshStandardMaterial({
      color: 0x3d4349,
      map: this.textures.alloy,
      roughness: 0.35,
      metalness: 0.85,
    });
    const maskMat = new THREE.MeshStandardMaterial({
      color: 0x64696f,
      map: this.textures.maskAlloy,
      roughness: 0.28,
      metalness: 0.92,
    });
    const dreadMat = new THREE.MeshStandardMaterial({
      color: 0x090a0d,
      roughness: 0.88,
      metalness: 0.1,
    });
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xb4c8cc,
      roughness: 0.15,
      metalness: 1.0,
    });
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xc8ba96,
      map: this.textures.bone,
      roughness: 0.65,
      metalness: 0.08,
    });
    const redGlowMat = new THREE.MeshBasicMaterial({ color: 0xff1818 });

    // Tronc élancé 1:1 Stan Winston Kevin Peter Hall
    addMesh(group, new THREE.CapsuleGeometry(1.85, 4.35, 12, 24), skin, {
      name: 'jungleHunterTorso',
      position: [0, 5.3, 0],
      scale: [1.14, 1.0, 0.78],
    });

    // Filet de chasse en cuir (netting suit) sur le torse
    addMesh(group, new THREE.CapsuleGeometry(1.9, 4.25, 8, 16), leatherNet, {
      name: 'jungleHunterLeatherNetSuit',
      position: [0, 5.3, 0],
      scale: [1.16, 1.0, 0.8],
    });

    // Plastron d'armure asymétrique classique 1987
    addMesh(group, new THREE.BoxGeometry(3.9, 2.5, 2.1, 4, 3, 3), armor, {
      name: 'jungleHunterChestArmor',
      position: [-0.05, 6.35, 0.06],
      rotation: [-0.05, 0, 0],
    });

    // Bandoulière de trophées avec os et vertèbres
    const bandolier = new THREE.Group();
    bandolier.name = 'jungleHunterSpineTrophy';
    for (let i = 0; i < 7; i++) {
      addMesh(bandolier, new THREE.CylinderGeometry(0.24, 0.28, 0.42, 8), boneMat, {
        position: [-1.2 + (i * 0.4), 6.7 - (i * 0.38), 0.95 - (i * 0.12)],
        rotation: [0.35, 0, -0.65],
      });
    }
    // Crâne trophée suspendu à la hanche droite
    addMesh(bandolier, new THREE.SphereGeometry(0.65, 12, 10), boneMat, {
      position: [1.85, 4.1, 0.3],
      scale: [0.85, 1.15, 1.0],
    });
    group.add(bandolier);

    // Unité sac à dos d'alimentation (backpack power unit)
    addMesh(group, new THREE.BoxGeometry(2.35, 3.1, 1.35, 3, 3, 2), armor, {
      name: 'jungleHunterBackpackPowerUnit',
      position: [0, 6.1, -1.25],
    });

    // Tête et cou
    addMesh(group, new THREE.CylinderGeometry(0.85, 1.05, 1.85, 12), skin, {
      position: [0, 7.8, 0.1],
      rotation: [0.08, 0, 0],
    });

    // Visage mandibulaires révélé (sous le masque)
    const revealedFace = new THREE.Group();
    revealedFace.name = 'jungleHunterRevealedFace';
    revealedFace.position.set(0, 8.85, 0.82);
    addMesh(revealedFace, new THREE.SphereGeometry(1.05, 16, 14), skin, {
      scale: [1.02, 1.15, 0.95],
    });
    for (const side of [-1, 1]) {
      addMesh(revealedFace, new THREE.ConeGeometry(0.22, 0.85, 8), boneMat, {
        position: [side * 0.65, -0.45, 0.65],
        rotation: [0.55, 0, side * 0.45],
      });
      addMesh(revealedFace, new THREE.ConeGeometry(0.18, 0.65, 8), boneMat, {
        position: [side * 0.55, 0.25, 0.72],
        rotation: [-0.4, 0, side * 0.35],
      });
    }
    group.add(revealedFace);

    // Bio-masque classique 1987 (Stan Winston) amovible / destructible
    const classicMask = new THREE.Group();
    classicMask.name = 'jungleHunterClassicMask';
    classicMask.position.set(0, 8.85, 0.82);
    addMesh(classicMask, new THREE.SphereGeometry(1.18, 20, 18), maskMat, {
      scale: [0.98, 1.25, 0.98],
    });
    // Visière incurvée classique
    addMesh(classicMask, new THREE.BoxGeometry(1.35, 0.32, 0.28, 4, 2, 2), armor, {
      position: [0, 0.16, 0.95],
      rotation: [-0.08, 0, 0],
    });
    // Tri-laser emitter (3 points rouges triangulaires sur la tempe gauche du masque)
    const triLaserGroup = new THREE.Group();
    triLaserGroup.name = 'jungleHunterTriLaserEmitter';
    for (let p = 0; p < 3; p++) {
      const angle = (p * Math.PI * 2) / 3;
      addMesh(triLaserGroup, new THREE.SphereGeometry(0.065, 8, 8), redGlowMat, {
        position: [-0.75 + Math.cos(angle) * 0.12, 0.35 + Math.sin(angle) * 0.12, 0.78],
        visionExempt: true,
      });
    }
    classicMask.add(triLaserGroup);
    group.add(classicMask);

    // Dreadlocks Yautja 1987 avec bagues en alliage
    for (let i = 0; i < 28; i++) {
      const angle = THREE.MathUtils.lerp(-1.75, 1.75, i / 27);
      const dread = addMesh(group, new THREE.CylinderGeometry(0.12, 0.22, 4.4, 8), dreadMat, {
        position: [Math.sin(angle) * 1.15, 8.1 - Math.abs(angle) * 0.24, -0.65 - Math.cos(angle) * 0.45],
        rotation: [0.46 + Math.abs(angle) * 0.15, 0, -angle * 0.32],
      });
      if (i % 3 === 0) {
        addMesh(dread, new THREE.TorusGeometry(0.18, 0.05, 6, 10), armor, {
          position: [0, -1.1, 0],
          rotation: [Math.PI / 2, 0, 0],
        });
      }
    }

    // Bras gauche avec le canon à plasma d'épaule unique
    // et pivot mécanique orientable
    const casterPivot = new THREE.Group();
    casterPivot.name = 'jungleHunterCasterPivot';
    casterPivot.position.set(-1.85, 7.6, -0.45);
    const casterMesh = new THREE.Group();
    casterMesh.name = 'jungleHunterSinglePlasmacaster';
    addMesh(casterMesh, new THREE.CylinderGeometry(0.24, 0.32, 2.3, 10), armor, {
      position: [0, 0.5, 0.8],
      rotation: [Math.PI / 2, 0, 0],
    });
    addMesh(casterMesh, new THREE.SphereGeometry(0.28, 10, 8), armor, {
      position: [0, 0, 0],
    });
    // Buse plasma émettrice
    addMesh(casterMesh, new THREE.CylinderGeometry(0.2, 0.26, 0.45, 10), redGlowMat, {
      position: [0, 0.5, 1.95],
      rotation: [Math.PI / 2, 0, 0],
      visionExempt: true,
    });
    casterPivot.add(casterMesh);
    group.add(casterPivot);

    // Bras gauche et gantelet avec ordinateur de poignet (wrist computer)
    addMesh(group, new THREE.CylinderGeometry(0.55, 0.7, 3.4, 10), skin, {
      position: [-2.65, 5.25, 0.12],
      rotation: [0.08, 0, 0.14],
    });
    const wristComputer = new THREE.Group();
    wristComputer.name = 'jungleHunterWristComputer';
    wristComputer.position.set(-2.85, 3.65, 0.35);
    addMesh(wristComputer, new THREE.BoxGeometry(1.25, 1.45, 1.35, 3, 3, 2), armor, {
      name: 'jungleHunterWristGauntlet',
    });
    // Clapet de l'ordinateur de poignet
    addMesh(wristComputer, new THREE.BoxGeometry(0.95, 0.18, 0.85), armor, {
      position: [0, 0.75, 0],
      rotation: [0, 0, -0.25],
    });
    // Glyphes Yautja rougeoyants (pour le compte à rebours d'autodestruction)
    const wristRunes = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.55), redGlowMat);
    wristRunes.name = 'jungleHunterWristHologlyphs';
    wristRunes.position.set(0, 0.82, 0.05);
    wristRunes.rotation.x = -Math.PI / 2;
    wristRunes.visible = false;
    wristRunes.userData.visionExempt = true;
    wristComputer.add(wristRunes);
    group.add(wristComputer);

    // Bras droit avec les doubles lames de poignet allongées (extended wristblades 1987)
    addMesh(group, new THREE.CylinderGeometry(0.55, 0.7, 3.4, 10), skin, {
      position: [2.65, 5.25, 0.12],
      rotation: [0.08, 0, -0.14],
    });
    const rightGauntlet = addMesh(group, new THREE.BoxGeometry(1.2, 1.4, 1.3, 3, 3, 2), armor, {
      position: [2.85, 3.65, 0.35],
    });
    const blades = new THREE.Group();
    blades.name = 'jungleHunterWristblades';
    for (const offset of [-0.22, 0.22]) {
      addMesh(blades, new THREE.BoxGeometry(0.12, 0.14, 4.2), bladeMat, {
        position: [2.85 + offset, 3.4, 2.5],
        rotation: [-0.05, 0, 0],
      });
    }
    group.add(blades);

    // Jambes et jambières métalliques
    for (const side of [-1, 1]) {
      addMesh(group, new THREE.CylinderGeometry(0.75, 0.92, 4.2, 10), skin, {
        position: [side * 1.25, 2.15, 0],
        rotation: [0, 0, side * 0.04],
      });
      addMesh(group, new THREE.CylinderGeometry(0.78, 0.95, 4.1, 8), leatherNet, {
        position: [side * 1.25, 2.15, 0],
      });
      addMesh(group, new THREE.BoxGeometry(1.65, 2.3, 1.9), armor, {
        position: [side * 1.25, 2.45, 0.1],
      });
      addMesh(group, new THREE.BoxGeometry(1.6, 0.65, 2.8), armor, {
        position: [side * 1.25, 0.35, 0.45],
      });
    }

    return group;
  }

  getAimPoint() {
    return this.position.clone().add(BODY_AIM_OFFSET);
  }

  getMaskWorldPosition() {
    return this.position.clone().add(MASK_WORLD_OFFSET);
  }

  resolveProjectileImpact(segmentStart, segmentEnd, safeRadius = 0) {
    if (this.isDead || this._disposed) return null;

    const bodyAim = this.getAimPoint();
    const effectiveRadius = this.colliderRadius + safeRadius;
    const distanceToBody = segmentEnd.distanceTo(bodyAim);

    if (distanceToBody <= effectiveRadius) {
      const maskPosition = this.getMaskWorldPosition();
      if (this.maskIntact && segmentEnd.distanceTo(maskPosition) <= MASK_HIT_RADIUS + safeRadius) {
        return maskPosition;
      }
      return segmentEnd;
    }
    return null;
  }

  consumeAttackImpact() {
    if (!this.attackImpactReady || this.attackImpactConsumed) return false;
    this.attackImpactConsumed = true;
    this.attackImpactReady = false;
    return true;
  }

  breakMask() {
    if (!this.maskIntact) return false;
    this.maskIntact = false;
    this.maskIntegrity = 0;
    this.laserLocked = false;
    if (this.maskMesh) this.maskMesh.visible = false;
    if (this.triLaserDot) this.triLaserDot.visible = false;
    audioSynth.playYautjaClick();
    return true;
  }

  triggerSelfDestruct() {
    if (this.selfDestructTriggered) return;
    this.selfDestructTriggered = true;
    this.selfDestructTimer = this.selfDestructCountdown;
    this.aiState = 'self_destruct_countdown';
    this.wristRunesActive = true;
    if (this.wristRunesMesh) this.wristRunesMesh.visible = true;

    // Rire mimique culte 1987 de Billy
    if (!this.laughMimicPlayed) {
      this.laughMimicPlayed = true;
      audioSynth.playBillyLaughMimic();
    }
  }

  takeDamage(amount, hitPosition = this.position) {
    if (this.isDead || this._disposed) {
      return { damage: 0, killed: this.isDead, remainingHealth: this.health };
    }

    const damage = Math.max(0, Number(amount) || 0);
    if (damage === 0) return { damage: 0, killed: false, remainingHealth: this.health };

    const impact = hitPosition?.isVector3 ? hitPosition : this.position;
    const maskPos = this.getMaskWorldPosition();
    const maskHit = this.maskIntact && impact.distanceTo(maskPos) <= MASK_HIT_RADIUS;

    if (maskHit) {
      this.maskIntegrity = Math.max(0, this.maskIntegrity - damage);
      if (this.maskIntegrity === 0) {
        this.breakMask();
      }
    }

    this.health = Math.max(0, this.health - damage);

    if (this.health <= this.maxHealth * 0.45 && !this.isEnraged) {
      this.isEnraged = true;
      audioSynth.playMonsterRoar();
    }

    if (this.health === 0 && !this.selfDestructTriggered) {
      this.triggerSelfDestruct();
      return { damage, killed: false, remainingHealth: 0, selfDestruct: true };
    }

    return {
      damage,
      killed: this.isDead,
      remainingHealth: this.health,
      maskBroken: !this.maskIntact,
    };
  }

  applyNet() {
    if (this.isDead) return;
    this.isNetted = true;
    this.netTimer = this.isEnraged ? 1.4 : 2.4;
    this.aiState = 'netted';
  }

  firePlasmacaster(targetPosition) {
    const projectile = new THREE.Mesh(
      new THREE.SphereGeometry(this.isEnraged ? 0.95 : 0.8, 14, 12),
      ShaderManager.createPlasmaMaterial(),
    );
    projectile.name = 'jungleHunterPlasmacasterBolt';
    projectile.position.copy(this.position).add(new THREE.Vector3(-1.85, 8.1, 1.2));
    projectile.userData.isBossProjectile = true;

    const direction = targetPosition.clone().add(new THREE.Vector3(0, 2.2, 0)).sub(projectile.position).normalize();
    const shot = {
      mesh: projectile,
      dir: direction,
      speed: this.isEnraged ? 64 : 54,
      damage: this.isEnraged ? 62 : 50,
      lifetime: 4.5,
      type: 'plasmacaster',
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

  tickTransientState(delta) {
    if (this._disposed) return false;
    const frameDelta = Math.max(0, Math.min(Number(delta) || 0, 0.2));
    this.updateProjectiles(frameDelta);
    return true;
  }

  update(delta, playerPosition, isPlayerCloaked = false) {
    const effectiveDelta = Math.max(0, Number(delta) || 0);
    const frameDelta = Math.min(effectiveDelta, 0.2);
    this.tickTransientState(frameDelta);

    // Traitement du compte à rebours d'autodestruction
    if (this.selfDestructTriggered && !this.selfDestructDetonated) {
      this.selfDestructTimer = Math.max(0, this.selfDestructTimer - effectiveDelta);
      // Clignotement des runes Yautja
      if (this.wristRunesMesh) {
        this.wristRunesMesh.visible = (Math.floor(this.selfDestructTimer * 8) % 2) === 0;
      }
      if (this.selfDestructTimer === 0) {
        this.selfDestructDetonated = true;
        this.isDead = true;
        this.aiState = 'dead';
        audioSynth.playExplosion();
      }
      return;
    }

    if (this.isDead) return;

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

    const distance = this.position.distanceTo(playerPosition);
    const detectionRadius = isPlayerCloaked ? 32 : 150;
    if (distance > detectionRadius) {
      this.aiState = 'stalk';
      return;
    }

    const targetDirection = playerPosition.clone().sub(this.position);
    targetDirection.y = 0;
    if (targetDirection.lengthSq() > 0.0001) targetDirection.normalize();

    // Orientation vers la cible
    const targetAngle = Math.atan2(targetDirection.x, targetDirection.z);
    let angleDifference = targetAngle - this.mesh.rotation.y;
    angleDifference = Math.atan2(Math.sin(angleDifference), Math.cos(angleDifference));
    this.mesh.rotation.y += angleDifference * Math.min(1, frameDelta * (this.isEnraged ? 7.5 : 5.5));

    if (this.casterPivot) {
      this.casterPivot.rotation.y = THREE.MathUtils.clamp(angleDifference, -0.65, 0.65);
    }

    this.aiState = 'chase';

    // Système de combat : Tri-laser lock -> Plasmacaster / Wristblades
    if (this.attackCooldown === 0) {
      this.attackImpactConsumed = false;
      if (distance <= 8.5) {
        // Mêlée : doubles lames de poignet allongées
        this.aiState = 'melee';
        this.attackImpactReady = true;
        this.attackCooldown = this.isEnraged ? 1.0 : 1.45;
        audioSynth.playWristbladeSlash();
      } else if (distance <= 110) {
        // Distance : acquisition tri-laser puis tir de canon à plasma
        if (!this.laserLocked && this.maskIntact) {
          this.laserLocked = true;
          this.laserLockTimer = 0.55;
          audioSynth.playTriLaserLock();
          audioSynth.playPlasmacasterCharge();
        } else {
          this.aiState = 'plasmacaster';
          this.firePlasmacaster(playerPosition);
          this.laserLocked = false;
          this.attackCooldown = this.isEnraged ? 1.7 : 2.5;
        }
      }
    }

    if (this.aiState === 'chase' && distance > 7.0) {
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

  setVisionMode(mode) {
    if (this._disposed || !this.mesh) return;
    if (mode === 'thermal') {
      overrideMaterials(this.visualDetail ?? this.mesh, this.thermalMaterial);
    } else {
      restoreBaseMaterials(this.visualDetail ?? this.mesh);
    }
  }

  dispose() {
    this._disposed = true;
    this.projectiles.forEach(({ mesh }) => disposeObject3D(mesh));
    this.projectiles = [];
    restoreBaseMaterials(this.mesh);
    this.thermalMaterial?.dispose?.();
    Object.values(this.textures).forEach((texture) => texture?.dispose?.());
    disposeObject3D(this.mesh);
  }
}
