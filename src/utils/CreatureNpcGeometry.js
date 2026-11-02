import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// These are authored anatomical interpretations of the named catalogue
// references. A coherent silhouette is not a verified replica of a film prop.
const BIPED_REFERENCES = {
  xeno_drone: 'prey_xeno_drone_1979',
  xeno_warrior: 'prey_xeno_warrior',
};

const BODY_PROFILE = [
  [0.63, 0.02, 0.04], [0.69, 0.20, 0.14], [0.78, 0.25, 0.17],
  [0.87, 0.21, 0.145], [0.98, 0.16, 0.12], [1.07, 0.18, 0.15],
  [1.18, 0.25, 0.20], [1.29, 0.305, 0.23], [1.40, 0.33, 0.225],
  [1.49, 0.29, 0.19], [1.56, 0.205, 0.145], [1.63, 0.12, 0.10],
  [1.74, 0.10, 0.10], [1.79, 0.001, 0.001],
];

function bodyGeometry(warrior) {
  const rows = BODY_PROFILE.length, sides = 24;
  const position = [], uv = [], index = [];
  for (let row = 0; row < rows; row++) {
    const [height, width, depth] = BODY_PROFILE[row];
    for (let side = 0; side <= sides; side++) {
      const angle = side / sides * Math.PI * 2;
      // Scapular ridges and a sternum follow the cage instead of a ball's UVs.
      const back = Math.max(0, -Math.cos(angle));
      const sternum = Math.exp(-Math.pow(Math.sin(angle) / 0.22, 2)) * Math.max(0, Math.cos(angle));
      const chest = Math.exp(-Math.pow((height - 1.35) / 0.23, 2));
      position.push(Math.sin(angle) * width * (warrior ? 1.22 : 1),
        height * (warrior ? 1.12 : 1),
        Math.cos(angle) * depth * (warrior ? 1.12 : 1) + (sternum * 0.018 - back * 0.025) * chest);
      uv.push(side / sides, (height - 0.63) / 1.16);
      if (row < rows - 1 && side < sides) {
        const a = row * (sides + 1) + side, b = a + sides + 1;
        index.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  geometry.userData.anatomicalProfile = BODY_PROFILE.map(row => [...row]);
  geometry.userData.region = 'ribcage-waist-pelvis-neck';
  return geometry;
}

function swept(points, radiusAt, segments = 16, radial = 12) {
  const path = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)));
  const geometry = new THREE.TubeGeometry(path, segments, 1, radial, false);
  const positions = geometry.attributes.position, center = new THREE.Vector3(), vertex = new THREE.Vector3();
  for (let row = 0; row <= segments; row++) {
    const t = row / segments;
    path.getPointAt(t, center);
    const radius = radiusAt(t);
    for (let side = 0; side <= radial; side++) {
      const index = row * (radial + 1) + side;
      vertex.fromBufferAttribute(positions, index).sub(center).multiplyScalar(radius).add(center);
      positions.setXYZ(index, vertex.x, vertex.y, vertex.z);
    }
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function createXenoFingerGeometry() {
  return swept([[0, 0.5, -0.2], [0, 0.1, -0.08], [0, -0.28, 0.13], [0, -0.5, 0.55]],
    t => (0.95 - t * 0.8) * (1 + Math.exp(-Math.pow((t - 0.4) / 0.1, 2)) * 0.18), 8, 6);
}

export function createXenoRibGeometry() {
  // Costal arches curve downward toward the sternum as well as wrapping around
  // the chest in depth. A horizontal half-torus reads as a straight grille.
  return swept([[-1, 0, 0], [-0.76, -0.03, 0.57], [-0.4, -0.22, 0.91],
    [0, -0.35, 1], [0.4, -0.22, 0.91], [0.76, -0.03, 0.57], [1, 0, 0]],
  t => 0.052 + Math.sin(t * Math.PI) * 0.009, 20, 6);
}

function ellipsoid(center, scale, segments = 12) {
  const geometry = new THREE.SphereGeometry(1, segments, 8);
  geometry.scale(...scale); geometry.translate(...center);
  return geometry;
}

function merged(parts, origin = [0, 0, 0]) {
  const geometry = mergeGeometries(parts, false);
  parts.forEach(part => part.dispose());
  geometry.translate(-origin[0], -origin[1], -origin[2]);
  return geometry;
}

function replace(node, geometry, position = [0, 0, 0]) {
  node.geometry.dispose(); node.geometry = geometry;
  node.position.set(...position); node.rotation.set(0, 0, 0); node.scale.set(1, 1, 1);
  node.userData.creatureContourRebuilt = true;
}

function reshapeLimb(node, side, leg, warrior) {
  const height = warrior ? 1.12 : 1, spread = warrior ? 1.2 : 1;
  const origin = leg ? [side * 0.25 * spread, 0.6 * height, 0.02]
    : [side * 0.37 * spread, 1.13 * height, 0];
  const points = leg
    ? [[side * 0.18 * spread, 1.03 * height, -0.02], [side * 0.24 * spread, 0.62 * height, 0.095],
      [side * 0.23 * spread, 0.35 * height, -0.02], [side * 0.22 * spread, 0.08, 0.015]]
    : [[side * 0.29 * spread, 1.48 * height, -0.015], [side * 0.44 * spread, 1.13 * height, 0.025],
      [side * 0.40 * spread, 0.89 * height, 0.10], [side * 0.43 * spread, 0.755 * height, 0.14]];
  const parts = [swept(points, t => {
    const bulk = leg ? 0.112 - t * 0.052 + Math.sin(t * Math.PI) * 0.018
      : 0.105 - t * 0.052 + Math.exp(-Math.pow((t - 0.57) / 0.18, 2)) * 0.018;
    return bulk * (warrior ? 1.15 : 1) * (1 + Math.pow(Math.sin(t * Math.PI * 7), 4) * 0.07);
  })];
  if (leg) {
    parts.push(ellipsoid([side * 0.22 * spread, 0.055, 0.13], [0.10 * spread, 0.055, 0.19]));
    for (let toe = -1; toe <= 1; toe++) {
      const x = side * 0.22 * spread + toe * 0.055;
      parts.push(swept([[x, 0.055, 0.16], [x + toe * 0.012, 0.045, 0.27],
        [x + toe * 0.019, 0.025, 0.34 - Math.abs(toe) * 0.025]], t => 0.028 * (1 - t * 0.85), 4, 6));
    }
  } else parts.push(ellipsoid(points.at(-1), [0.07, 0.085, 0.055]));
  replace(node, merged(parts, origin), origin);
  node.name = `anatomy:${warrior ? 'xeno_warrior' : 'xeno_drone'}:${leg ? 'leg' : 'arm'}:${side}`;
  node.userData.anatomicalLimb = leg ? 'hip-knee-ankle-toes' : 'shoulder-elbow-wrist-palm';
}

function reshapeTail(node, warrior) {
  const size = warrior ? 1.13 : 1;
  const points = [[0, 0.79 * size, -0.10], [0.03, 0.73 * size, -0.58],
    [0.09, 0.43 * size, -1.25], [0.24, 0.39 * size, -1.95], [0.28, 0.69 * size, -2.50 * size]];
  const tube = swept(points, t => (0.12 * Math.pow(1 - t, 1.1) + 0.013)
    * (1 + Math.pow(Math.sin(t * Math.PI * 19), 8) * 0.2), 38, 10);
  const tip = new THREE.ConeGeometry(0.075, 0.34, 8);
  tip.scale(0.33, 1, 1); tip.rotateX(-Math.PI / 4);
  tip.translate(points.at(-1)[0], points.at(-1)[1] + 0.12, points.at(-1)[2] - 0.12);
  replace(node, merged([tube, tip]));
  node.name = `anatomy:${warrior ? 'xeno_warrior' : 'xeno_drone'}:segmented-tail`;
}

function craniumGeometry(warrior) {
  // Longitudinal sections taper into both ends and arch over the cheek. Unlike
  // a capsule, the profile has no straight cylindrical roof or squared ends.
  const profile = [
    [-0.62, 0.001, 0.001, -0.035], [-0.56, 0.11, 0.10, -0.02],
    [-0.42, 0.18, 0.14, 0], [-0.16, 0.218, 0.155, 0.012],
    [0.12, 0.23, 0.155, 0], [0.35, 0.215, 0.14, -0.01],
    [0.50, 0.17, 0.115, -0.03], [0.59, 0.08, 0.075, -0.05],
    [0.62, 0.001, 0.001, -0.06],
  ];
  const positions = [], uv = [], indices = [], rows = 36, sides = 24;
  const interpolate = (z, channel) => {
    const next = profile.findIndex(row => row[0] >= z);
    let segment = next < 0 ? profile.length - 2 : next - 1;
    segment = Math.max(0, Math.min(profile.length - 2, segment));
    const t = (z - profile[segment][0]) / (profile[segment + 1][0] - profile[segment][0]);
    const at = offset => profile[Math.max(0, Math.min(profile.length - 1, segment + offset))][channel];
    const [a, b, c, d] = [at(-1), at(0), at(1), at(2)];
    return 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t
      + (-a + 3 * b - 3 * c + d) * t * t * t);
  };
  for (let row = 0; row <= rows; row++) {
    const z = THREE.MathUtils.lerp(-0.62, 0.62, row / rows);
    const width = Math.max(0.001, interpolate(z, 1)) * (warrior ? 1.08 : 1);
    const height = Math.max(0.001, interpolate(z, 2)) * (warrior ? 1.08 : 0.98);
    const center = interpolate(z, 3);
    for (let side = 0; side <= sides; side++) {
      const angle = side / sides * Math.PI * 2;
      const roof = Math.max(0, Math.cos(angle));
      const ridge = warrior ? Math.pow(Math.cos(z * 28), 8) * 0.011 * roof : 0;
      positions.push(Math.sin(angle) * width, Math.cos(angle) * height + center + ridge, z * (warrior ? 1.12 : 1));
      uv.push(side / sides, row / rows);
      if (row < rows && side < sides) {
        const a = row * (sides + 1) + side, b = a + sides + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices); geometry.computeVertexNormals();
  return geometry;
}

function reshapeHead(root, parts, material, warrior) {
  const type = warrior ? 'xeno_warrior' : 'xeno_drone';
  const skull = parts[1], mouth = parts[2];
  const headY = warrior ? 1.94 : 1.72, headZ = warrior ? 0.16 : 0.12;
  replace(skull, craniumGeometry(warrior), [0, headY, headZ]);
  skull.name = `anatomy:${type}:${warrior ? 'ridged-cranium' : 'dome'}`;
  const jawY = warrior ? 1.72 : 1.50, jawZ = warrior ? 0.69 : 0.61;
  const width = warrior ? 0.14 : 0.125;
  const jaw = merged([
    swept([[-width, jawY + 0.09, jawZ - 0.065], [-width * 0.9, jawY - 0.025, jawZ + 0.09],
      [0, jawY - 0.055, jawZ + 0.15], [width * 0.9, jawY - 0.025, jawZ + 0.09],
      [width, jawY + 0.09, jawZ - 0.065]], () => 0.03, 16, 8),
    swept([[-width, jawY + 0.09, jawZ - 0.065], [-width * 0.9, jawY + 0.055, jawZ + 0.10],
      [0, jawY + 0.065, jawZ + 0.17], [width * 0.9, jawY + 0.055, jawZ + 0.10],
      [width, jawY + 0.09, jawZ - 0.065]], () => 0.025, 16, 8),
  ]);
  replace(mouth, jaw); mouth.material = material;
  mouth.name = `anatomy:${type}:outer_jaw`;
  const teethZ = jawZ + 0.145;
  if (warrior) {
    let toothIndex = 0;
    for (const part of parts) {
      if (part === mouth || part.geometry?.type !== 'ConeGeometry') continue;
      const upper = toothIndex < 3;
      const tooth = new THREE.ConeGeometry(0.012, 0.04, 6);
      if (upper) tooth.rotateZ(Math.PI);
      replace(part, tooth, [(toothIndex % 3 - 1) * 0.07, jawY + (upper ? 0.043 : -0.03), teethZ]);
      part.name = `anatomy:${type}:tooth:${toothIndex++}`;
    }
  } else {
    const inner = root.getObjectByName('anatomy:xeno_drone:inner_jaw');
    replace(inner, new THREE.CylinderGeometry(0.025, 0.028, 0.11, 10), [0, jawY + 0.005, jawZ + 0.10]);
    inner.rotation.x = Math.PI / 2;
    const dentition = root.getObjectByName('anatomy:xeno_drone:teeth'), transform = new THREE.Object3D();
    for (let index = 0; index < dentition.count; index++) {
      transform.position.set((index % 3 - 1) * 0.07, jawY + (index < 3 ? 0.043 : -0.03), teethZ);
      transform.rotation.z = index < 3 ? Math.PI : 0; transform.updateMatrix();
      dentition.setMatrixAt(index, transform.matrix);
    }
    dentition.instanceMatrix.needsUpdate = true;
    dentition.computeBoundingSphere();
  }
}

/** Replace existing pieces, retaining materials and the bounded LOD path. */
export function refineCreatureAnatomy(root, type) {
  if (!(type in BIPED_REFERENCES) || root.userData.creatureAnatomy) return;
  const warrior = type === 'xeno_warrior';
  const parts = [...root.children].filter(node => node.isMesh && !node.isInstancedMesh);
  const body = parts[0], material = body.material;
  replace(body, bodyGeometry(warrior)); body.name = `anatomy:${type}:thorax`;
  reshapeHead(root, parts, material, warrior);
  for (const part of parts) {
    if (part.geometry?.type !== 'CylinderGeometry') continue;
    const height = part.geometry.parameters.height, side = Math.sign(part.position.x);
    if (height > 2) reshapeTail(part, warrior);
    else if (Math.abs(height - (warrior ? 1.3 : 1.08)) < 0.001) reshapeLimb(part, side, true, warrior);
    else if (Math.abs(height - (warrior ? 1.38 : 0.92)) < 0.001) reshapeLimb(part, side, false, warrior);
    else if (warrior) { root.remove(part); part.geometry.dispose(); }
  }
  // The warrior factory had five separate ribs plus seven instanced ribs and
  // four straight rods plus four conduits. Keep one correctly placed set each.
  if (warrior) for (const part of parts) {
    if (part.geometry?.type === 'TorusGeometry') { root.remove(part); part.geometry.dispose(); }
  }
  let refinedContours = 0;
  root.traverse(node => { if (node.userData.creatureContourRebuilt) refinedContours++; });
  root.userData.creatureAnatomy = { reference: BIPED_REFERENCES[type], fidelityVerified: false, refinedContours,
    construction: 'authored-ribcage-waist-pelvis-and-articulated-limb-surfaces' };
}
