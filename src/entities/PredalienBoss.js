import * as THREE from 'three';
import { ShaderManager } from '../Shaders.js';
import { audioSynth } from '../AudioSynthesizer.js';
import { captureBaseMaterials, overrideMaterials, restoreBaseMaterials } from '../utils/materialState.js';
import { getRuntimeTexture } from '../utils/runtimeTextures.js';

export const PREDALIEN_TEXTURES = Object.freeze({
  carapace: '/assets/textures/xeno-carapace.webp',
  yautjaSkin: '/assets/textures/yautja-skin-mottled.webp',
});

const PREDALIEN_NATIVE_VISUAL_FEATURES = Object.freeze([
  'elongated_dome',
  'yautja_mandibles',
  'biomechanical_dreadlocks',
  'spear_tail_spines',
]);

const PREDALIEN_HEAD_FALLBACK_OFFSET = new THREE.Vector3(0, 9.35, 3.15);
const PREDALIEN_BODY_FALLBACK_OFFSET = new THREE.Vector3(0, 6.2, 0);
const PREDALIEN_TAIL_FALLBACK_OFFSET = new THREE.Vector3(0, 4.35, -17.95);
const PREDALIEN_HEAD_HIT_RADIUS = 5;
const PREDALIEN_TAIL_HIT_RADIUS = 6;
const PREDALIEN_IMPACT_ZONE = Symbol('predalienImpactZone');

function resolveSegmentSphereEntry(start, end, center, radius, zone) {
  if (!start?.isVector3 || !end?.isVector3 || !center?.isVector3) return null;
  const safeRadius = Math.max(0, Number(radius) || 0);
  const segment = end.clone().sub(start);
  const fromCenter = start.clone().sub(center);
  const radiusSquared = safeRadius * safeRadius;
  let time = null;

  if (segment.lengthSq() <= 1e-9) {
    if (fromCenter.lengthSq() <= radiusSquared) time = 0;
  } else if (fromCenter.lengthSq() <= radiusSquared) {
    time = 0;
  } else {
    const a = segment.lengthSq();
    const b = 2 * fromCenter.dot(segment);
    const c = fromCenter.lengthSq() - radiusSquared;
    const discriminant = (b * b) - (4 * a * c);
    if (discriminant >= 0) {
      const root = Math.sqrt(discriminant);
      const first = (-b - root) / (2 * a);
      const second = (-b + root) / (2 * a);
      time = first >= 0 && first <= 1
        ? first
        : second >= 0 && second <= 1
          ? second
          : null;
    }
  }

  if (time === null) return null;
  const point = start.clone().addScaledVector(segment, time);
  point[PREDALIEN_IMPACT_ZONE] = zone;
  return { point, time, zone };
}

function addMesh(parent, geometry, material, {
  name,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  featureTag = '',
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
  mesh.userData.featureTag = featureTag;
  mesh.userData.visionExempt = visionExempt;
  parent.add(mesh);
  return mesh;
}

function addTube(parent, material, points, radius, name, featureTag) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  return addMesh(parent, new THREE.TubeGeometry(curve, 30, radius, 10, false), material, {
    name,
    featureTag,
  });
}

function firstMeshMaterial(root) {
  let material = null;
  root.traverse((object) => {
    if (!material && object.isMesh) material = object.material;
  });
  return material;
}

function makePredalienMaterials() {
  const carapace = getRuntimeTexture(PREDALIEN_TEXTURES.carapace, { repeat: [2.4, 2.4] });
  const tissue = getRuntimeTexture(PREDALIEN_TEXTURES.yautjaSkin, { repeat: [1.8, 2.2] });
  return {
    body: new THREE.MeshStandardMaterial({ color: 0x14101a, map: carapace, roughness: 0.28, metalness: 0.72 }),
    ridge: new THREE.MeshStandardMaterial({ color: 0x31272b, map: carapace, roughness: 0.38, metalness: 0.62 }),
    membrane: new THREE.MeshStandardMaterial({ color: 0x4a382c, map: tissue, roughness: 0.7, metalness: 0.08 }),
    tooth: new THREE.MeshStandardMaterial({ color: 0xb3aa88, roughness: 0.42, metalness: 0.12 }),
    dread: new THREE.MeshStandardMaterial({ color: 0x07080a, roughness: 0.78, metalness: 0.24 }),
    acid: new THREE.MeshStandardMaterial({
      color: 0x7fff37,
      emissive: 0x24a61c,
      emissiveIntensity: 2.2,
      roughness: 0.22,
    }),
  };
}

function buildPredalienTorso(root, materials) {
  const torsoRig = new THREE.Group();
  torsoRig.name = 'predalienTorsoRig';
  torsoRig.position.set(0, 6.2, 0);
  root.add(torsoRig);

  addMesh(torsoRig, new THREE.SphereGeometry(1, 56, 40), materials.body, {
    name: 'predalienThoraxCarapace',
    scale: [2.75, 3.25, 2.05],
    featureTag: 'ribbed_hybrid_torso',
  });
  addMesh(torsoRig, new THREE.CapsuleGeometry(1.24, 2.25, 14, 32), materials.membrane, {
    name: 'predalienAbdominalCore',
    position: [0, -2.35, -0.08],
    scale: [1.2, 1, 0.84],
    featureTag: 'ribbed_hybrid_torso',
  });
  addMesh(torsoRig, new THREE.SphereGeometry(1, 40, 28), materials.ridge, {
    name: 'predalienPelvicCarapace',
    position: [0, -3.62, -0.35],
    scale: [1.82, 1.12, 1.48],
    featureTag: 'ribbed_hybrid_torso',
  });
  for (let rib = 0; rib < 7; rib += 1) {
    const ribScale = 1 - rib * 0.055;
    addMesh(torsoRig, new THREE.TorusGeometry(2.34 * ribScale, 0.16, 12, 40, Math.PI * 1.12), materials.ridge, {
      name: `predalienThoracicRib${rib + 1}`,
      position: [0, 1.75 - rib * 0.56, 1.25 - rib * 0.11],
      rotation: [Math.PI / 2, 0, Math.PI * 0.94],
      scale: [1, 1, 0.82],
      featureTag: 'ribbed_hybrid_torso',
    });
  }
  for (const side of [-1, 1]) {
    addMesh(torsoRig, new THREE.SphereGeometry(1, 32, 22), materials.ridge, {
      name: `predalien${side < 0 ? 'Left' : 'Right'}ScapularShield`,
      position: [side * 2.52, 1.56, -0.18],
      rotation: [0.1, 0, side * 0.22],
      scale: [1.35, 0.74, 1.52],
      featureTag: 'ribbed_hybrid_torso',
    });
  }
  return torsoRig;
}

function buildPredalienHead(root, materials) {
  const headGroup = new THREE.Group();
  headGroup.name = 'predalienHead';
  headGroup.position.set(0, 9.35, 3.15);
  root.add(headGroup);

  addMesh(headGroup, new THREE.CapsuleGeometry(1.62, 5.65, 20, 48), materials.body, {
    name: 'predalienElongatedDome',
    position: [0, 0.7, -0.05],
    rotation: [Math.PI / 2, 0, 0],
    scale: [1.24, 1, 0.86],
    featureTag: 'hybrid_multi_plate_crest',
  });
  for (let plate = -3; plate <= 3; plate += 1) {
    const ratio = Math.abs(plate) / 3;
    addMesh(headGroup, new THREE.ConeGeometry(0.66 - ratio * 0.12, 3.75 - ratio * 0.55, 20, 4), materials.ridge, {
      name: `predalienCrownPlate${plate + 4}`,
      position: [plate * 0.54, 2.2 - ratio * 0.22, -1.32 - ratio * 0.35],
      rotation: [-1.16, 0, plate * -0.07],
      scale: [1, 1, 0.55],
      featureTag: 'hybrid_multi_plate_crest',
    });
  }
  addMesh(headGroup, new THREE.SphereGeometry(1, 40, 28), materials.membrane, {
    name: 'predalienFacialMembrane',
    position: [0, -0.55, 3.3],
    scale: [1.62, 1.3, 1.26],
    featureTag: 'external_yautja_mandibles',
  });

  const mandiblePivots = [];
  for (const side of [-1, 1]) {
    for (const vertical of [-1, 1]) {
      const mandible = new THREE.Group();
      mandible.name = `predalien${side < 0 ? 'Left' : 'Right'}${vertical < 0 ? 'Lower' : 'Upper'}MandiblePivot`;
      mandible.position.set(side * 1.05, -0.5 + vertical * 0.42, 3.95);
      mandible.rotation.z = side * vertical * 0.18;
      headGroup.add(mandible);
      addMesh(mandible, new THREE.ConeGeometry(0.34, 2.18, 18, 4), materials.membrane, {
        name: `${mandible.name}Bone`,
        position: [side * 0.5, vertical * -0.2, 0.74],
        rotation: [1.16, 0, side * vertical * 0.4],
        scale: [1, 1, 0.72],
        featureTag: 'external_yautja_mandibles',
      });
      addMesh(mandible, new THREE.ConeGeometry(0.12, 0.7, 12, 2), materials.tooth, {
        name: `${mandible.name}Fang`,
        position: [side * 0.7, vertical * -0.25, 1.48],
        rotation: [1.22, 0, side * vertical * 0.32],
        featureTag: 'external_yautja_mandibles',
      });
      mandible.userData.side = side;
      mandible.userData.vertical = vertical;
      mandiblePivots.push(mandible);
    }
  }

  const innerJaw = new THREE.Group();
  innerJaw.name = 'predalienInnerJaw';
  innerJaw.position.set(0, -0.55, 4.3);
  headGroup.add(innerJaw);
  addMesh(innerJaw, new THREE.CylinderGeometry(0.28, 0.38, 2.75, 22, 4), materials.ridge, {
    name: 'predalienInnerJawRam',
    position: [0, 0, 1.12],
    rotation: [Math.PI / 2, 0, 0],
    featureTag: 'animated_inner_jaw',
  });
  addMesh(innerJaw, new THREE.SphereGeometry(0.48, 24, 16), materials.acid, {
    name: 'predalienInnerJawCrown',
    position: [0, 0, 2.58],
    scale: [1, 0.72, 1.18],
    featureTag: 'animated_inner_jaw',
    castShadow: false,
    visionExempt: true,
  });
  for (let tooth = 0; tooth < 8; tooth += 1) {
    const angle = (tooth / 8) * Math.PI * 2;
    addMesh(innerJaw, new THREE.ConeGeometry(0.07, 0.38, 10, 2), materials.tooth, {
      name: `predalienInnerJawTooth${tooth + 1}`,
      position: [Math.cos(angle) * 0.36, Math.sin(angle) * 0.26, 2.92],
      rotation: [Math.PI / 2, 0, angle],
      featureTag: 'animated_inner_jaw',
    });
  }

  const dreadPivots = [];
  for (let index = 0; index < 14; index += 1) {
    const ratio = index / 13;
    const angle = THREE.MathUtils.lerp(-1.28, 1.28, ratio);
    const originX = Math.sin(angle) * 1.6;
    const originZ = -1.38 + Math.cos(angle) * 0.32;
    const dreadPivot = new THREE.Group();
    dreadPivot.name = `predalienDreadPivot${index + 1}`;
    dreadPivot.position.set(originX, 0.6 - Math.abs(originX) * 0.14, originZ);
    headGroup.add(dreadPivot);
    addTube(dreadPivot, materials.dread, [
      [0, 0, 0],
      [originX * 0.16, -1.65, -0.7],
      [originX * 0.22, -3.8 - (index % 3) * 0.24, -0.25],
    ], 0.16, `predalienBiomechanicalDread${index + 1}`, 'biomechanical_dreads');
    for (let ring = 1; ring <= 2; ring += 1) {
      addMesh(dreadPivot, new THREE.TorusGeometry(0.18, 0.045, 8, 18), materials.ridge, {
        name: `predalienDread${index + 1}Band${ring}`,
        position: [originX * 0.05 * ring, -1.15 * ring, -0.3 * ring],
        rotation: [Math.PI / 2, 0, 0],
        featureTag: 'biomechanical_dreads',
      });
    }
    dreadPivots.push(dreadPivot);
  }
  for (let index = 0; index < 10; index += 1) {
    const side = index % 2 ? 1 : -1;
    const row = Math.floor(index / 2);
    addMesh(headGroup, new THREE.ConeGeometry(0.14, 1.15 - row * 0.08, 12, 3), materials.ridge, {
      name: `predalienCranialQuill${index + 1}`,
      position: [side * (0.62 + row * 0.18), 1.65 - row * 0.15, -2.72 - row * 0.24],
      rotation: [-1.05, 0, side * 0.22],
      featureTag: 'cranial_quills',
    });
  }
  return { headGroup, innerJaw, mandiblePivots, dreadPivots };
}

function buildPredalienDorsalsAndArms(root, torsoRig, materials) {
  const dorsalTubes = [];
  for (const side of [-1, 1]) {
    for (let row = 0; row < 2; row += 1) {
      const tube = addTube(torsoRig, materials.ridge, [
        [side * (0.72 + row * 0.48), 1.7 - row * 0.3, -1.52],
        [side * (0.88 + row * 0.55), 3.35 - row * 0.35, -2.65 - row * 0.5],
        [side * (1.02 + row * 0.62), 4.15 - row * 0.4, -4.65 - row * 0.72],
      ], 0.25 - row * 0.025, `predalienDorsalTube${side < 0 ? 'L' : 'R'}${row + 1}`, 'four_dorsal_tubes');
      dorsalTubes.push(tube);
    }
  }

  const shoulders = [];
  const elbows = [];
  const hands = [];
  for (const side of [-1, 1]) {
    const label = side < 0 ? 'Left' : 'Right';
    const shoulder = new THREE.Group();
    shoulder.name = `predalien${label}ShoulderJoint`;
    shoulder.position.set(side * 2.78, 7.35, 0.75);
    shoulder.rotation.set(-0.12, 0, side * -0.38);
    shoulder.userData.side = side;
    root.add(shoulder);
    addMesh(shoulder, new THREE.CapsuleGeometry(0.67, 2.35, 12, 28), materials.body, {
      name: `predalien${label}UpperArm`,
      position: [0, -1.35, 0],
      featureTag: 'articulated_claw_limbs',
    });

    const elbow = new THREE.Group();
    elbow.name = `predalien${label}ElbowJoint`;
    elbow.position.set(0, -2.72, 0.08);
    elbow.rotation.x = -0.42;
    shoulder.add(elbow);
    addMesh(elbow, new THREE.SphereGeometry(0.72, 26, 18), materials.ridge, {
      name: `predalien${label}ElbowCarapace`,
      scale: [1.08, 0.78, 1.2],
      featureTag: 'articulated_claw_limbs',
    });
    addMesh(elbow, new THREE.CapsuleGeometry(0.52, 2.48, 12, 26), materials.body, {
      name: `predalien${label}Forearm`,
      position: [0, -1.38, 0.55],
      rotation: [-0.42, 0, 0],
      featureTag: 'articulated_claw_limbs',
    });
    for (let ridge = 0; ridge < 3; ridge += 1) {
      addMesh(elbow, new THREE.ConeGeometry(0.18, 0.92, 12, 3), materials.ridge, {
        name: `predalien${label}ForearmSpine${ridge + 1}`,
        position: [side * 0.45, -0.58 - ridge * 0.65, 0.3 + ridge * 0.28],
        rotation: [0.35, 0, side * -1.15],
        featureTag: 'articulated_claw_limbs',
      });
    }

    const hand = new THREE.Group();
    hand.name = `predalien${label}HandJoint`;
    hand.position.set(0, -2.58, 1.12);
    elbow.add(hand);
    addMesh(hand, new THREE.SphereGeometry(0.62, 24, 16), materials.membrane, {
      name: `predalien${label}Palm`,
      scale: [0.84, 1.08, 0.58],
      featureTag: 'articulated_claw_limbs',
    });
    for (let claw = -1; claw <= 1; claw += 1) {
      addMesh(hand, new THREE.ConeGeometry(0.11, 1.32 + Math.abs(claw) * 0.12, 12, 3), materials.tooth, {
        name: `predalien${label}HandClaw${claw + 2}`,
        position: [claw * 0.28, -0.72, 0.58],
        rotation: [Math.PI - 0.38, 0, claw * 0.18],
        featureTag: 'articulated_claw_limbs',
      });
    }
    shoulders.push(shoulder);
    elbows.push(elbow);
    hands.push(hand);
  }
  return { dorsalTubes, shoulders, elbows, hands };
}

function buildPredalienLegs(root, materials) {
  const hips = [];
  const knees = [];
  const hocks = [];
  for (const side of [-1, 1]) {
    const label = side < 0 ? 'Left' : 'Right';
    const hip = new THREE.Group();
    hip.name = `predalien${label}HipJoint`;
    hip.position.set(side * 1.55, 3.55, -0.38);
    hip.rotation.set(0.12, 0, side * -0.12);
    hip.userData.side = side;
    root.add(hip);
    addMesh(hip, new THREE.CapsuleGeometry(0.82, 2.35, 14, 30), materials.body, {
      name: `predalien${label}Thigh`,
      position: [0, -1.28, 0.15],
      rotation: [-0.13, 0, 0],
      featureTag: 'digitigrade_legs',
    });

    const knee = new THREE.Group();
    knee.name = `predalien${label}KneeJoint`;
    knee.position.set(0, -2.58, 0.32);
    knee.rotation.x = 0.62;
    hip.add(knee);
    addMesh(knee, new THREE.SphereGeometry(0.78, 28, 18), materials.ridge, {
      name: `predalien${label}KneeArmor`,
      scale: [1, 0.82, 1.28],
      featureTag: 'digitigrade_legs',
    });
    addMesh(knee, new THREE.CapsuleGeometry(0.58, 2.02, 12, 26), materials.body, {
      name: `predalien${label}Shin`,
      position: [0, -0.98, -0.72],
      rotation: [0.72, 0, 0],
      featureTag: 'digitigrade_legs',
    });

    const hock = new THREE.Group();
    hock.name = `predalien${label}HockJoint`;
    hock.position.set(0, -1.72, -1.55);
    hock.rotation.x = -0.78;
    knee.add(hock);
    addMesh(hock, new THREE.CapsuleGeometry(0.42, 1.58, 10, 24), materials.ridge, {
      name: `predalien${label}Hock`,
      position: [0, -0.62, 0.48],
      rotation: [-0.78, 0, 0],
      featureTag: 'digitigrade_legs',
    });
    addMesh(hock, new THREE.SphereGeometry(0.68, 26, 16), materials.membrane, {
      name: `predalien${label}Foot`,
      position: [0, -1.32, 1.22],
      scale: [0.92, 0.48, 1.72],
      featureTag: 'digitigrade_legs',
    });
    for (let claw = -1; claw <= 1; claw += 1) {
      addMesh(hock, new THREE.ConeGeometry(0.12, 1.18, 12, 3), materials.tooth, {
        name: `predalien${label}ToeClaw${claw + 2}`,
        position: [claw * 0.34, -1.42, 2.16 - Math.abs(claw) * 0.08],
        rotation: [Math.PI / 2, 0, claw * -0.12],
        featureTag: 'digitigrade_legs',
      });
    }
    hips.push(hip);
    knees.push(knee);
    hocks.push(hock);
  }
  return { hips, knees, hocks };
}

function buildPredalienTail(root, materials) {
  const tailGroup = new THREE.Group();
  tailGroup.name = 'predalienTail';
  tailGroup.position.set(0, 4.55, -1.45);
  root.add(tailGroup);

  const tailSegments = [];
  let tailParent = tailGroup;
  for (let index = 0; index < 12; index += 1) {
    const radius = Math.max(0.2, 0.7 - index * 0.041);
    const pivot = new THREE.Group();
    pivot.name = `predalienTailJoint${index + 1}`;
    pivot.position.set(0, index === 0 ? 0 : -0.08, index === 0 ? 0 : -1.28);
    pivot.rotation.x = index < 4 ? 0.045 : -0.035;
    tailParent.add(pivot);
    addMesh(pivot, new THREE.CapsuleGeometry(radius, 1.14, 10, 24), index < 5 ? materials.body : materials.ridge, {
      name: `predalienTailSegment${index + 1}`,
      position: [0, 0, -0.64],
      rotation: [Math.PI / 2, 0, 0],
      featureTag: 'segmented_spear_tail',
    });
    if (index % 2 === 0) {
      addMesh(pivot, new THREE.ConeGeometry(radius * 0.48, 1.22, 12, 3), materials.ridge, {
        name: `predalienTailSpine${index / 2 + 1}`,
        position: [0, 0.42, -0.55],
        rotation: [-0.45, 0, 0],
        featureTag: 'segmented_spear_tail',
      });
    }
    tailSegments.push(pivot);
    tailParent = pivot;
  }
  addMesh(tailParent, new THREE.ConeGeometry(0.82, 3.8, 18, 5), materials.tooth, {
    name: 'predalienTailHarpoon',
    position: [0, 0, -2.45],
    rotation: [-Math.PI / 2, 0, 0],
    scale: [0.72, 1, 1.35],
    featureTag: 'segmented_spear_tail',
  });
  return { tailGroup, tailSegments };
}

function createPredalienHDMesh(owner) {
  const root = new THREE.Group();
  root.name = 'predalienBossHD';
  root.userData.provenance = 'AVPR_SCREEN + Predator franchise study — original procedural adaptation, no official asset';
  root.userData.archetype = 'predalien_hybrid';
  root.userData.bossVisualArchetype = 'predalien';
  root.userData.nativeHighDetail = true;
  root.userData.runtimeTexturePaths = Object.values(PREDALIEN_TEXTURES);

  const materials = makePredalienMaterials();
  const torsoRig = buildPredalienTorso(root, materials);
  const head = buildPredalienHead(root, materials);
  const upperBody = buildPredalienDorsalsAndArms(root, torsoRig, materials);
  const legs = buildPredalienLegs(root, materials);
  const tail = buildPredalienTail(root, materials);

  // La silhouette procédurale est déjà la couche de détail de production.
  // Ces alias conservent l'interface commune des boss (synchronisation des
  // éléments destructibles) sans dupliquer les volumes anatomiques natifs.
  head.headGroup.userData.bossVisualFeatureTags = [
    'elongated_dome',
    'yautja_mandibles',
    'biomechanical_dreadlocks',
  ];
  tail.tailGroup.userData.bossVisualFeatureTags = ['spear_tail_spines'];

  let triangleCount = 0;
  root.traverse((object) => {
    if (!object.isMesh || !object.geometry) return;
    const { index, attributes } = object.geometry;
    triangleCount += index ? index.count / 3 : (attributes.position?.count ?? 0) / 3;
  });
  root.userData.featureTags = [...PREDALIEN_NATIVE_VISUAL_FEATURES];
  root.userData.triangleCount = Math.round(triangleCount);
  root.userData.bossVisualDetail = Object.freeze({
    archetype: 'predalien',
    nativeHighDetail: true,
    featureTags: PREDALIEN_NATIVE_VISUAL_FEATURES,
    runtimeTexturePaths: Object.freeze([...root.userData.runtimeTexturePaths]),
    triangleCount: root.userData.triangleCount,
  });
  owner.animationRig = { torsoRig, ...head, ...upperBody, ...legs, ...tail };
  root.position.copy(owner.position);
  return root;
}

export class PredalienBoss {
  constructor(scene) {
    this.scene = scene;
    this.colliderRadius = 6.5;
    this.nativeHighDetail = true;

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

    // Animation procédurale : les minuteries ne modifient aucune règle de combat.
    this.animationTime = 0;
    this.locomotionBlend = 0;
    this.jawAttackTimer = 0;
    this.hitReactionTimer = 0;

    // 3D Mesh
    this.mesh = this.createPredalienMesh();
    this.visualDetail = this.mesh;
    this.scene.add(this.mesh);
    captureBaseMaterials(this.mesh);

    this.headMesh = this.mesh.getObjectByName('predalienHead');
    this.tailMesh = this.mesh.getObjectByName('predalienTail');
    this.bodyWeakpointNode = this.mesh.getObjectByName('predalienTorsoRig');
    this.tailWeakpointNode = this.mesh.getObjectByName('predalienTailHarpoon');

    // Materials
    this.normalMaterial = firstMeshMaterial(this.mesh);
    this.thermalMaterial = ShaderManager.createThermalMaterial(0xff0055, 1.0);
  }

  createPredalienMesh() {
    return createPredalienHDMesh(this);
  }

  setVisionMode(mode) {
    if (mode === 'thermal') {
      overrideMaterials(this.mesh, this.thermalMaterial);
    } else {
      restoreBaseMaterials(this.mesh);
    }
  }

  getHeadWorldPosition() {
    this.mesh.updateWorldMatrix(true, true);
    return this.headMesh?.getWorldPosition(new THREE.Vector3())
      ?? this.mesh.localToWorld(PREDALIEN_HEAD_FALLBACK_OFFSET.clone());
  }

  getBodyWorldPosition() {
    this.mesh.updateWorldMatrix(true, true);
    return this.bodyWeakpointNode?.getWorldPosition(new THREE.Vector3())
      ?? this.mesh.localToWorld(PREDALIEN_BODY_FALLBACK_OFFSET.clone());
  }

  getTailWorldPosition() {
    this.mesh.updateWorldMatrix(true, true);
    return this.tailWeakpointNode?.getWorldPosition(new THREE.Vector3())
      ?? this.mesh.localToWorld(PREDALIEN_TAIL_FALLBACK_OFFSET.clone());
  }

  getAimPoint() {
    return this.headIntact ? this.getHeadWorldPosition() : this.getBodyWorldPosition();
  }

  resolveProjectileImpact(projectilePosition, projectileRadius = 1, previousPosition = projectilePosition) {
    if (!projectilePosition?.isVector3 || this.isDead) return null;
    const safeRadius = Math.max(0, Number(projectileRadius) || 0);
    const start = previousPosition?.isVector3 ? previousPosition : projectilePosition;
    const candidates = [
      resolveSegmentSphereEntry(
        start,
        projectilePosition,
        this.getBodyWorldPosition(),
        this.colliderRadius + safeRadius,
        'body',
      ),
      this.headIntact
        ? resolveSegmentSphereEntry(
          start,
          projectilePosition,
          this.getHeadWorldPosition(),
          PREDALIEN_HEAD_HIT_RADIUS + safeRadius,
          'head',
        )
        : null,
      this.tailIntact
        ? resolveSegmentSphereEntry(
          start,
          projectilePosition,
          this.getTailWorldPosition(),
          PREDALIEN_TAIL_HIT_RADIUS + safeRadius,
          'tail',
        )
        : null,
    ].filter(Boolean);

    const zonePriority = { head: 0, tail: 1, body: 2 };
    candidates.sort((left, right) => (
      left.time - right.time
      || zonePriority[left.zone] - zonePriority[right.zone]
    ));
    return candidates[0]?.point ?? null;
  }

  resetVisualPose() {
    const rig = this.animationRig;
    if (!rig) return false;
    rig.torsoRig.position.y = 6.2;
    rig.torsoRig.scale.set(1, 1, 1);
    rig.headGroup.rotation.set(0, 0, 0);
    rig.innerJaw.position.set(0, -0.55, 4.3);
    rig.innerJaw.scale.set(1, 1, 1);
    rig.mandiblePivots.forEach((mandible) => {
      mandible.rotation.set(0, 0, mandible.userData.side * mandible.userData.vertical * 0.18);
    });
    rig.shoulders.forEach((shoulder) => {
      shoulder.rotation.set(-0.12, 0, shoulder.userData.side * -0.38);
    });
    rig.elbows.forEach((elbow) => elbow.rotation.set(-0.42, 0, 0));
    rig.hands.forEach((hand) => hand.rotation.set(0, 0, 0));
    rig.hips.forEach((hip) => hip.rotation.set(0.12, 0, hip.userData.side * -0.12));
    rig.knees.forEach((knee) => knee.rotation.set(0.62, 0, 0));
    rig.hocks.forEach((hock) => hock.rotation.set(-0.78, 0, 0));
    rig.tailSegments.forEach((segment, index) => segment.rotation.set(index < 4 ? 0.045 : -0.035, 0, 0));
    rig.dreadPivots.forEach((dread) => dread.rotation.set(0, 0, 0));
    return true;
  }

  updateVisualAnimation(delta, isMoving = false) {
    const rig = this.animationRig;
    if (!rig) return false;
    const frameDelta = Math.max(0, Math.min(Number(delta) || 0, 0.2));
    this.animationTime += frameDelta;
    this.jawAttackTimer = Math.max(0, this.jawAttackTimer - frameDelta);
    this.hitReactionTimer = Math.max(0, this.hitReactionTimer - frameDelta);
    this.locomotionBlend = THREE.MathUtils.lerp(
      this.locomotionBlend,
      isMoving ? 1 : 0,
      Math.min(1, frameDelta * 8),
    );

    const rage = this.isEnraged ? 1 : 0;
    const breath = Math.sin(this.animationTime * (2.05 + rage * 0.8));
    const gait = Math.sin(this.animationTime * (8.2 + rage * 2.4));
    const locomotion = this.locomotionBlend;
    const hit = this.hitReactionTimer > 0 ? this.hitReactionTimer / 0.3 : 0;
    const jawProgress = this.jawAttackTimer > 0 ? 1 - this.jawAttackTimer / 0.48 : 0;
    const bitePulse = this.jawAttackTimer > 0 ? Math.sin(Math.min(1, jawProgress) * Math.PI) : 0;
    const frenzyProgress = this.activeTelegraphedAttack === 'acid_frenzy' && this.attackWindupDuration > 0
      ? 1 - this.attackWindupTimer / this.attackWindupDuration
      : 0;
    const jawOpen = Math.max(bitePulse, frenzyProgress * 0.78);

    // Lecture 1 : respiration thoracique et contre-mouvement de tête.
    rig.torsoRig.position.y = 6.2 + breath * 0.075 - locomotion * 0.08;
    rig.torsoRig.scale.set(1 + breath * 0.012, 1 + breath * 0.022, 1 - breath * 0.01);
    if (this.activeTelegraphedAttack !== 'acid_frenzy') {
      rig.headGroup.rotation.x = -breath * 0.018 + locomotion * 0.06;
    }
    rig.headGroup.rotation.y = Math.sin(this.animationTime * 16) * hit * 0.2;
    this.mesh.rotation.z = Math.sin(this.animationTime * 22) * hit * 0.055;

    // Lecture 2 : locomotion lourde et articulée, épaules en opposition aux hanches.
    rig.shoulders.forEach((shoulder, index) => {
      const side = shoulder.userData.side;
      const attackReach = jawOpen * (index === 0 ? 0.62 : 0.35);
      shoulder.rotation.x = -0.12 + gait * side * 0.34 * locomotion - attackReach;
      shoulder.rotation.z = side * (-0.38 - jawOpen * 0.16);
      rig.elbows[index].rotation.x = -0.42 - Math.abs(gait) * 0.2 * locomotion - jawOpen * 0.46;
      rig.hands[index].rotation.z = side * (gait * 0.1 * locomotion + jawOpen * 0.18);
    });
    rig.hips.forEach((hip, index) => {
      const side = hip.userData.side;
      hip.rotation.x = 0.12 - gait * side * 0.31 * locomotion;
      hip.rotation.z = side * -0.12;
      rig.knees[index].rotation.x = 0.62 + Math.max(0, gait * side) * 0.36 * locomotion;
      rig.hocks[index].rotation.x = -0.78 - Math.max(0, -gait * side) * 0.24 * locomotion;
    });

    // Lecture 3 : ouverture des quatre mandibules et projection de la mâchoire pharyngienne.
    rig.mandiblePivots.forEach((mandible) => {
      const { side, vertical } = mandible.userData;
      mandible.rotation.x = vertical * jawOpen * 0.14;
      mandible.rotation.y = side * jawOpen * 0.2;
      mandible.rotation.z = side * vertical * 0.18 + side * jawOpen * 0.3;
    });
    rig.innerJaw.position.z = 4.3 + jawOpen * 2.05;
    rig.innerJaw.scale.set(1 + jawOpen * 0.08, 1 + jawOpen * 0.08, 1);

    // Lecture 4 : queue vertébrée et dreads réagissent à la course, la rage et la frénésie.
    const tailAmplitude = 0.025 + locomotion * 0.085 + rage * 0.045 + frenzyProgress * 0.08;
    rig.tailSegments.forEach((segment, index) => {
      segment.rotation.x = (index < 4 ? 0.045 : -0.035) + Math.cos(this.animationTime * 3.1 + index * 0.42) * 0.012;
      segment.rotation.y = Math.sin(this.animationTime * (3.6 + rage) + index * 0.55) * tailAmplitude;
      segment.rotation.z = Math.cos(this.animationTime * 2.7 + index * 0.36) * tailAmplitude * 0.24;
    });
    if (this.activeTelegraphedAttack !== 'attack_tail') {
      rig.tailGroup.rotation.y = Math.sin(this.animationTime * 1.8) * (0.05 + rage * 0.04);
      rig.tailGroup.rotation.z = breath * 0.018;
    }
    rig.dreadPivots.forEach((dread, index) => {
      dread.rotation.x = -locomotion * 0.09 + frenzyProgress * 0.12;
      dread.rotation.z = Math.sin(this.animationTime * 2.6 + index * 0.47) * (0.025 + locomotion * 0.045);
    });
    return true;
  }

  takeDamage(amount, hitPosition = this.getBodyWorldPosition()) {
    if (this.isDead) return;

    this.health = Math.max(0, this.health - amount);
    this.hitReactionTimer = 0.3;
    audioSynth.playAcidSizzle();

    const impact = hitPosition?.isVector3 ? hitPosition : this.getBodyWorldPosition();
    const resolvedZone = impact[PREDALIEN_IMPACT_ZONE] ?? null;
    const headHit = this.headIntact && (
      resolvedZone
        ? resolvedZone === 'head'
        : impact.distanceTo(this.getHeadWorldPosition()) <= PREDALIEN_HEAD_HIT_RADIUS
    );
    if (headHit) {
      this.headHealth -= amount;
      if (this.headHealth <= 0) {
        this.headIntact = false;
        if (this.headMesh) this.headMesh.visible = false;
        if (this.activeTelegraphedAttack === 'acid_frenzy') this.cancelTelegraphedAttack();
        audioSynth.playMonsterRoar();
      }
    }

    const tailHit = this.tailIntact && (
      resolvedZone
        ? resolvedZone === 'tail'
        : impact.distanceTo(this.getTailWorldPosition()) <= PREDALIEN_TAIL_HIT_RADIUS
    );
    if (tailHit) {
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
    this.jawAttackTimer = 0;
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

    const visualDelta = Math.max(0, Math.min(Number(delta) || 0, 0.2));

    if (this.isNetted) {
      this.netTimer -= delta;
      if (this.netTimer <= 0) this.isNetted = false;
      this.updateVisualAnimation(visualDelta, false);
      return;
    }

    this.attackCooldown = Math.max(0, this.attackCooldown - delta);
    const distToPlayer = this.position.distanceTo(playerPos);
    const detectRadius = isPlayerCloaked ? 25.0 : 90.0;
    const targetDir = playerPos.clone().sub(this.position).normalize();
    if (this.updateTelegraphedAttack(delta, targetDir)) {
      this.updateVisualAnimation(visualDelta, false);
      return;
    }

    let isMoving = false;
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
          this.jawAttackTimer = 0.48;
          audioSynth.playMonsterRoar();
          this.attackCooldown = 1.8;
        } else if (distToPlayer > 14.0 && distToPlayer < 32.0 && this.tailIntact) {
          this.startTelegraphedAttack('attack_tail', 0.52, 3.2);
          audioSynth.playSpearThrow();
        }
      }

      const speed = this.isEnraged ? this.enragedSpeed : this.moveSpeed;
      if (!this.activeTelegraphedAttack) {
        this.position.addScaledVector(targetDir, speed * delta);
        isMoving = targetDir.lengthSq() > 0;
      }
    } else {
      this.aiState = 'roam';
    }

    this.mesh.position.copy(this.position);
    this.updateVisualAnimation(visualDelta, isMoving);
  }
}
