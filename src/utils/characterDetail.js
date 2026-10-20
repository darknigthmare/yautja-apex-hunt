import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { applySurfaceDetail } from './surfaceDetail.js';

// Each batch owns one geometry/material; repeated seams, ribs and fasteners
// share that geometry through instance transforms rather than individual draws.
export function addCharacterInstances(parent, name, geometry, material, transforms, featureTag) {
  if (!transforms.length) { geometry.dispose(); return null; }
  const batch = new THREE.InstancedMesh(geometry, material, transforms.length);
  const transform = new THREE.Object3D();
  transforms.forEach(({ position, scale = [1, 1, 1], rotation = [0, 0, 0] }, index) => {
    transform.position.set(...position);
    transform.scale.set(...scale);
    transform.rotation.set(...rotation);
    transform.updateMatrix();
    batch.setMatrixAt(index, transform.matrix);
  });
  batch.name = name;
  batch.castShadow = true;
  batch.receiveShadow = true;
  batch.userData.characterDetail = true;
  if (featureTag) batch.userData.featureTag = featureTag;
  batch.computeBoundingSphere();
  parent.add(batch);
  return batch;
}

function detailMaterial(color, kind, { roughness = 0.6, metalness = 0.15 } = {}) {
  const material = new THREE.MeshStandardMaterial({ color, roughness, metalness });
  material.userData.baseColor = material.color.getHex();
  material.userData.baseEmissive = material.emissive.getHex();
  material.userData.baseEmissiveIntensity = material.emissiveIntensity;
  applySurfaceDetail(material, { kind, repeat: [3, 3], normalStrength: 0.35, roughnessStrength: 0.35 });
  return material;
}

function finishMaterial(material, family, type) {
  if (!material?.isMeshStandardMaterial || material.emissiveIntensity > 0.6) return;
  let kind = family === 'humanoid'
    ? (material.roughness > 0.76 ? 'fabric' : 'metal')
    : type.includes('xeno') ? 'resin' : 'skin';
  if (material.metalness > 0.68 && !type.includes('xeno')) kind = 'metal';
  if (type.startsWith('genna')) kind = 'foliage';
  applySurfaceDetail(material, { kind, repeat: [3, 3], normalStrength: kind === 'fabric' ? 0.24 : 0.42, roughnessStrength: 0.38 });
}

// Spend triangles on curved contours and bevels which affect the highlight and
// silhouette. Small rods, weapons and the separate distant LOD remain light.
function refineContours(root) {
  let refined = 0;
  root.traverse((node) => {
    const geometry = node.geometry;
    if (!node.isMesh || !geometry || node.isInstancedMesh) return;
    const p = geometry.parameters;
    let replacement;
    if (geometry.type === 'SphereGeometry' && p.radius >= 0.16 && p.widthSegments < 24) {
      replacement = new THREE.SphereGeometry(p.radius, 24, 16, p.phiStart, p.phiLength, p.thetaStart, p.thetaLength);
    } else if (geometry.type === 'CapsuleGeometry' && p.radius >= 0.075 && p.radialSegments < 14) {
      replacement = new THREE.CapsuleGeometry(p.radius, p.length, 6, 16);
    } else if (geometry.type === 'BoxGeometry' && Math.min(p.width, p.height, p.depth) >= 0.16) {
      replacement = new RoundedBoxGeometry(p.width, p.height, p.depth, 1, Math.min(0.045, p.width * 0.14, p.height * 0.14, p.depth * 0.14));
    }
    if (!replacement) return;
    node.geometry = replacement;
    geometry.dispose();
    refined++;
  });
  return refined;
}

function humanoidDetails(root, type, material) {
  const ancient = type === 'era_viking_raider' || type === 'era_feudal_duelist';
  const synthetic = type === 'combat_synthetic' || type === 'weyland_field_synthetic';
  const pilot = type === 'era_wartime_pilot';
  const plates = [];
  if (ancient) {
    // Overlapping lamellar skirts/neck guards keep the period silhouettes apart
    // from the modern plate carriers, radios and equipment pouches.
    for (const side of [-1, 1]) for (let row = 0; row < 3; row++) {
      plates.push({ position: [side * 0.46, 1.72 - row * 0.13, 0.02], scale: [0.28 + row * 0.025, 0.13, 0.42], rotation: [0, 0, side * -0.12] });
      plates.push({ position: [side * 0.23, 0.91 - row * 0.12, 0.17], scale: [0.28, 0.13, 0.24], rotation: [0.1, 0, side * -0.08] });
    }
  } else if (pilot) {
    for (const side of [-1, 1]) {
      plates.push({ position: [side * 0.18, 1.35, 0.29], scale: [0.08, 0.72, 0.06], rotation: [0, 0, side * 0.14] });
      plates.push({ position: [side * 0.17, 0.08, 0.11], scale: [0.18, 0.15, 0.37] });
    }
  } else {
    for (const side of [-1, 1]) {
      plates.push({ position: [side * 0.5, 1.71, 0.06], scale: [0.26, 0.25, 0.35], rotation: [0, 0, side * -0.22] });
      plates.push({ position: [side * 0.21, 0.49, 0.1], scale: [0.2, 0.23, 0.17] });
      plates.push({ position: [side * 0.15, 1.53, 0.24], scale: [0.27, 0.37, 0.1], rotation: [0, side * -0.06, 0] });
      plates.push({ position: [side * 0.21, 0.07, 0.11], scale: [0.21, 0.14, 0.4] });
      plates.push({ position: [side * 0.65, 1.02, 0.06], scale: [0.16, 0.2, 0.16], rotation: [0, 0, side * -0.2] });
    }
    for (let pouch = -1; pouch <= 1; pouch++) plates.push({ position: [pouch * 0.21, 1.08, 0.3], scale: [0.17, 0.24, 0.14] });
  }
  if (!synthetic) {
    const faceY = pilot ? 1.95 : 2.04;
    for (const side of [-1, 1]) plates.push({ position: [side * 0.062, faceY + 0.036, 0.315], scale: [0.035, 0.018, 0.016] });
    plates.push({ position: [0, faceY - 0.065, 0.309], scale: [0.07, 0.012, 0.012] });
  }
  addCharacterInstances(root, `near-detail:${type}:articulated-plates`, new RoundedBoxGeometry(1, 1, 1, 1, 0.12), material, plates);
  const fasteners = [];
  for (const side of [-1, 1]) for (let index = 0; index < 4; index++) {
    fasteners.push({ position: [side * 0.31, 1.38 + index * 0.085, 0.31], scale: [0.024, 0.024, 0.012] });
  }
  const metal = detailMaterial(ancient ? 0xa2967b : 0x91a2a3, 'metal', { metalness: 0.75, roughness: 0.38 });
  addCharacterInstances(root, `near-detail:${type}:carrier-hardware`, new THREE.SphereGeometry(1, 8, 6), metal, fasteners);
  if (!synthetic) {
    const face = detailMaterial(ancient ? 0x8b6d50 : 0x9f826a, 'skin', { metalness: 0, roughness: 0.72 });
    addCharacterInstances(root, `near-detail:${type}:face-and-ears`, new THREE.SphereGeometry(1, 16, 12), face, [
      { position: [0, pilot ? 1.95 : 2.04, 0.24], scale: [0.15, 0.17, 0.075] },
      { position: [0, (pilot ? 1.95 : 2.04) - 0.005, 0.319], scale: [0.025, 0.046, 0.029] },
      ...[-1, 1].map(side => ({ position: [side * 0.245, pilot ? 1.95 : 2.04, 0.035], scale: [0.045, 0.085, 0.055] })),
    ]);
  }
}

function xenoDetails(root, type, material) {
  const plant = type === 'genna_stalker';
  const ghost = type === 'river_ghost';
  const ribs = [];
  for (let index = 0; index < 7; index++) {
    const taper = 1 - Math.abs(index - 2) * 0.07;
    const bulk = type === 'xeno_warrior' ? 1.35 : ghost ? 0.75 : 1;
    ribs.push({ position: [0, (ghost ? 1.58 : 1.48) - index * 0.095, 0.01], scale: [0.43 * taper * bulk, 0.3, 0.4 * taper * bulk], rotation: [Math.PI / 2, 0, 0] });
  }
  const ridge = detailMaterial(plant ? 0x4a633b : ghost ? 0x647b60 : 0x344446, plant ? 'foliage' : 'resin', { roughness: 0.42, metalness: 0.18 });
  addCharacterInstances(root, `near-detail:${type}:thoracic-ribs`, new THREE.TorusGeometry(1, 0.09, 6, 20, Math.PI), ridge, ribs);
  const digits = [];
  for (const side of [-1, 1]) for (let finger = 0; finger < 3; finger++) {
    digits.push({ position: [side * (0.68 + finger * 0.045), 0.74 + finger * 0.028, 0.24], scale: [0.025, 0.2 - finger * 0.025, 0.04], rotation: [0.4, 0, side * -0.42] });
  }
  addCharacterInstances(root, `near-detail:${type}:tapered-digits`, new THREE.ConeGeometry(1, 1, 10, 2), material, digits);
  if (!ghost) {
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.5, -0.18), new THREE.Vector3(0, 0.63, -0.5));
    const tubes = [-1, 1].flatMap(side => [0, 1].map(row => ({ position: [side * (0.18 + row * 0.12), 1.24, -0.21 - row * 0.07], scale: [1, 0.7 + row * 0.16, 1], rotation: [0, side * -0.2, side * 0.1] })));
    addCharacterInstances(root, `near-detail:${type}:dorsal-conduits`, new THREE.TubeGeometry(curve, 12, 0.043, 8, false), material, tubes);
  }
}

function quadrupedDetails(root, type, material) {
  const isBear = type === 'grizzly_territorial';
  const herbivore = type === 'genna_grazer' || type === 'genna_sporeback';
  const isXeno = type === 'xeno_runner';
  const paws = [];
  const claws = [];
  const width = isBear ? 0.56 : type === 'genna_sporeback' ? 0.67 : 0.44;
  const legRows = type === 'genna_sporeback' ? [-0.72, 0, 0.72] : [-0.56, 0.56];
  for (const side of [-1, 1]) for (const z of legRows) {
    paws.push({ position: [side * width, 0.13, z + 0.07], scale: [0.14, 0.11, 0.23] });
    for (let toe = -1; toe <= 1; toe++) claws.push({ position: [side * width + toe * 0.075, 0.09, z + 0.26], scale: [0.027, herbivore ? 0.11 : 0.23, 0.035], rotation: [Math.PI / 2, 0, 0] });
  }
  addCharacterInstances(root, `near-detail:${type}:weight-bearing-paws`, new THREE.SphereGeometry(1, 16, 10), material, paws);
  const keratin = detailMaterial(herbivore ? 0x53664b : isXeno ? 0x9aa8a1 : 0xb8b09b, isXeno ? 'resin' : 'bone', { metalness: 0.08, roughness: 0.5 });
  addCharacterInstances(root, `near-detail:${type}:claw-and-hoof-tips`, new THREE.ConeGeometry(1, 1, 8, 2), keratin, claws);
  if (!isBear) {
    const ridges = [];
    const ridgeHeight = type === 'hunting_hound' ? 1.23 : isXeno ? 1.08 : type.startsWith('genna') ? 1.45 : 1.38;
    const ridgeWidth = type.startsWith('genna') ? 0.62 : isXeno ? 0.3 : 0.46;
    for (const side of [-1, 1]) for (let index = 0; index < 5; index++) {
      ridges.push({ position: [side * (ridgeWidth - Math.abs(index - 2) * 0.025), ridgeHeight + Math.sin(index * 0.7) * 0.06, -0.57 + index * 0.27], scale: [0.18, 0.065, 0.2], rotation: [0, 0, side * -0.55] });
    }
    addCharacterInstances(root, `near-detail:${type}:overlapping-dermal-plates`, new THREE.SphereGeometry(1, 12, 8), material, ridges);
  }
}

function facehuggerDetails(root, type, material) {
  const joints = [];
  for (let leg = 0; leg < 8; leg++) {
    const angle = leg / 8 * Math.PI * 2;
    joints.push({ position: [Math.sin(angle) * 0.64, 0.24, Math.cos(angle) * 0.55], scale: [0.064, 0.064, 0.075] });
  }
  addCharacterInstances(root, `near-detail:${type}:finger-knuckles`, new THREE.SphereGeometry(1, 12, 8), material, joints);
  const plates = [];
  for (let index = 0; index < 5; index++) plates.push({ position: [0, 0.35, -0.21 + index * 0.09], scale: [0.36 - Math.abs(index - 2) * 0.035, 0.065, 0.08] });
  const bone = detailMaterial(0x9c9279, 'bone', { roughness: 0.55, metalness: 0.04 });
  addCharacterInstances(root, `near-detail:${type}:abdominal-segmentation`, new THREE.SphereGeometry(1, 12, 8), bone, plates);
}

function droneDetails(root, type, material) {
  const rings = [-1, 1].map(side => ({ position: [side * 0.85, 1.45, 0], scale: [0.24, 0.24, 0.24], rotation: [Math.PI / 2, 0, 0] }));
  addCharacterInstances(root, `near-detail:${type}:stabilizer-housings`, new THREE.TorusGeometry(1, 0.14, 8, 24), material, rings);
  const vents = [];
  for (let index = -2; index <= 2; index++) vents.push({ position: [index * 0.11, 1.86, -0.13], scale: [0.045, 0.05, 0.18] });
  const dark = detailMaterial(0x121c23, 'metal', { roughness: 0.35, metalness: 0.76 });
  addCharacterInstances(root, `near-detail:${type}:heat-exchanger-fins`, new RoundedBoxGeometry(1, 1, 1, 1, 0.1), dark, vents);
}

export function refineNpcVisual(root, type, family) {
  let baseDraws = 0;
  root.traverse(node => { if (node.isMesh) baseDraws++; });
  const refinedContours = refineContours(root);
  const materials = new Set();
  root.traverse(node => {
    if (node.material) (Array.isArray(node.material) ? node.material : [node.material]).forEach(material => materials.add(material));
  });
  materials.forEach(material => finishMaterial(material, family, type));
  const primary = [...materials][0];
  const armor = [...materials].find(material => material.metalness >= 0.25 && material.emissiveIntensity < 0.6) ?? primary;
  if (family === 'humanoid') humanoidDetails(root, type, armor);
  else if (family === 'quadruped' || type === 'genna_stalker') quadrupedDetails(root, type, primary);
  else if (family === 'facehugger') facehuggerDetails(root, type, primary);
  else if (family === 'drone') droneDetails(root, type, armor);
  else xenoDetails(root, type, primary);
  root.userData.nearSurfaceDetail = { family, refinedContours, type, baseDraws };
}

export function sculptBossAnatomy(region, humanoid) {
  const geometry = new THREE.SphereGeometry(1, region === 'torso' ? 64 : 48, region === 'torso' ? 44 : 32);
  const positions = geometry.attributes.position;
  for (let index = 0; index < positions.count; index++) {
    const x = positions.getX(index), y = positions.getY(index), z = positions.getZ(index);
    if (region === 'torso') {
      // Rib cage, shoulder girdle and tapered waist instead of a perfect ball.
      const chest = Math.exp(-(((y - 0.4) / 0.52) ** 2));
      const waist = humanoid ? 0.74 + chest * 0.3 : 0.94 + z * 0.1;
      positions.setXYZ(index, x * waist, y * (humanoid ? 1 : 1 + z * 0.08), z * (0.94 + chest * 0.1));
    } else if (region === 'head') {
      positions.setXYZ(index, x * (humanoid ? 0.82 + (y + 1) * 0.1 : 1 + z * 0.08), y, z * (1 - Math.max(0, -y) * 0.1));
    } else {
      const muscle = 0.84 + 0.2 * Math.exp(-(((y - 0.22) / 0.5) ** 2));
      positions.setXYZ(index, x * muscle, y, z * muscle);
    }
  }
  geometry.computeVertexNormals();
  return geometry;
}
