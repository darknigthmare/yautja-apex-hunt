import * as THREE from 'three';
import { refineGenericNpcFirearms } from './NpcFirearmGeometry.js';

const ancientTypes = new Set(['era_viking_raider', 'era_feudal_duelist']);
const syntheticTypes = new Set(['combat_synthetic', 'weyland_field_synthetic']);

// An elliptical section profile gives the rib cage, waist, pelvis and joints
// distinct silhouettes. These are original generic human proportions, not a
// likeness of a named actor or a reconstruction of a film costume.
function sectionGeometry(sections, segments = 12) {
  const positions = [], uvs = [], indices = [];
  let previousAxis = new THREE.Vector3(1, 0, 0);
  for (let row = 0; row < sections.length; row++) {
    const [x, y, z, width, depth] = sections[row];
    const from = sections[Math.max(0, row - 1)], to = sections[Math.min(sections.length - 1, row + 1)];
    const tangent = new THREE.Vector3(to[0] - from[0], to[1] - from[1], to[2] - from[2]).normalize();
    const across = previousAxis.clone().addScaledVector(tangent, -previousAxis.dot(tangent));
    if (across.lengthSq() < 0.00001) across.set(0, 0, 1).addScaledVector(tangent, -tangent.z);
    across.normalize(); previousAxis = across;
    const forward = across.clone().cross(tangent).normalize();
    for (let column = 0; column <= segments; column++) {
      const angle = column / segments * Math.PI * 2;
      const offset = across.clone().multiplyScalar(Math.cos(angle) * width).addScaledVector(forward, Math.sin(angle) * depth);
      positions.push(x + offset.x, y + offset.y, z + offset.z);
      uvs.push(column / segments, row / (sections.length - 1));
    }
  }
  for (let row = 0; row < sections.length - 1; row++) for (let column = 0; column < segments; column++) {
    const a = row * (segments + 1) + column, b = a + segments + 1;
    indices.push(a, b, a + 1, b, b + 1, a + 1);
  }
  // End caps share the outside seam, without another mesh or material draw.
  for (let column = 1; column < segments - 1; column++) {
    indices.push(0, column, column + 1);
    const last = (sections.length - 1) * (segments + 1);
    indices.push(last, last + column + 1, last + column);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}

function replaceGeometry(mesh, geometry, role, type) {
  const old = mesh.geometry;
  mesh.geometry = geometry;
  old.dispose();
  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, 0, 0);
  mesh.scale.set(1, 1, 1);
  mesh.name = `anatomy:${type}:${role}`;
  mesh.userData.humanAnatomy = role;
}

function softEquipmentGeometry() {
  const geometry = new THREE.SphereGeometry(1, 8, 6);
  const positions = geometry.attributes.position;
  // A superellipse keeps a flat usable front, but rounds the outline of a
  // fabric pouch, glove, shoulder shell and boot rather than adding tiny bevels.
  for (let index = 0; index < positions.count; index++) {
    const shape = value => Math.sign(value) * Math.pow(Math.abs(value), 0.48) * 0.5;
    positions.setXYZ(index, shape(positions.getX(index)), shape(positions.getY(index)), shape(positions.getZ(index)));
  }
  geometry.computeVertexNormals();
  return geometry;
}

function facialContourGeometry() {
  const geometry = sectionGeometry([
    [0, -1, -0.06, 0.3, 0.32], [0, -0.84, -0.015, 0.57, 0.64],
    [0, -0.55, 0, 0.76, 0.82], [0, -0.2, 0, 0.88, 0.94],
    [0, 0.18, -0.02, 0.89, 0.94], [0, 0.55, -0.055, 0.82, 0.87],
    [0, 0.85, -0.08, 0.55, 0.6], [0, 1, -0.08, 0.08, 0.1],
  ], 16);
  const p = geometry.attributes.position;
  for (let index = 0; index < p.count; index++) {
    const x = p.getX(index), y = p.getY(index), z = p.getZ(index);
    if (z <= 0) continue;
    const socket = Math.exp(-(((Math.abs(x) - 0.4) / 0.2) ** 2) - ((y - 0.12) / 0.16) ** 2) * 0.16;
    const brow = Math.exp(-(((y - 0.3) / 0.14) ** 2)) * 0.09;
    const bridge = Math.exp(-((x / 0.17) ** 2) - ((y + 0.01) / 0.38) ** 2) * 0.14;
    p.setZ(index, z + brow + bridge - socket);
  }
  geometry.computeVertexNormals(); geometry.computeBoundingBox();
  return geometry;
}

function sculptHead(mesh, type) {
  const old = mesh.geometry;
  const radius = old.parameters?.radius ?? 0.27;
  const geometry = new THREE.SphereGeometry(radius, 24, 16);
  const p = geometry.attributes.position;
  for (let index = 0; index < p.count; index++) {
    const x = p.getX(index) / radius, y = p.getY(index) / radius, z = p.getZ(index) / radius;
    const jaw = Math.max(0, -y);
    const jawWidth = 0.91 - jaw * 0.28;
    let front = z * (0.84 - jaw * 0.06);
    if (z > 0) {
      // Brow ridge, inset sockets, cheek bones and a defined chin. The nose,
      // ears and narrow eye/mouth details remain in the existing instance draws.
      const brow = Math.exp(-(((y - 0.19) / 0.12) ** 2)) * 0.065;
      const socket = Math.exp(-(((Math.abs(x) - 0.4) / 0.22) ** 2) - ((y - 0.05) / 0.13) ** 2) * 0.09;
      const cheek = Math.exp(-(((Math.abs(x) - 0.5) / 0.27) ** 2) - ((y + 0.2) / 0.2) ** 2) * 0.055;
      front += (brow - socket + cheek) * z;
    }
    p.setXYZ(index, x * jawWidth * radius, y * radius, front * radius);
  }
  geometry.computeVertexNormals();
  mesh.geometry = geometry;
  old.dispose();
  mesh.name = `anatomy:${type}:skull`;
  mesh.userData.humanAnatomy = 'skull';
}

function isLongLimb(node) {
  const p = node.geometry?.parameters;
  if (!p || Math.abs(node.rotation.x) > 0.2) return false;
  if (node.geometry.type === 'CapsuleGeometry') return p.radius <= 0.16 && p.length >= 0.55;
  return node.geometry.type === 'CylinderGeometry' && p.radiusTop <= 0.16 && p.radiusBottom <= 0.2 && p.height >= 0.7;
}

function recordWeaponMuzzle(root, children) {
  let muzzle = null;
  for (const node of children) {
    if (!node.isMesh || node.isInstancedMesh || Math.abs(node.position.x) < 0.15 ||
      node.position.y < 1.1 || node.position.y > 1.7 || node.position.z <= 0.3 || node.material?.metalness < 0.65) continue;
    const geometry = node.geometry;
    geometry.computeBoundingBox(); node.updateMatrix();
    let point;
    if (node.userData.npcFirearm?.muzzleLocal) {
      point = new THREE.Vector3(...node.userData.npcFirearm.muzzleLocal).applyMatrix4(node.matrix);
    } else if (geometry.type === 'CylinderGeometry') {
      const front = new THREE.Vector3(0, geometry.boundingBox.max.y, 0).applyMatrix4(node.matrix);
      const back = new THREE.Vector3(0, geometry.boundingBox.min.y, 0).applyMatrix4(node.matrix);
      point = front.z > back.z ? front : back;
    } else if (geometry.type === 'BoxGeometry') {
      point = new THREE.Vector3(0, 0, geometry.boundingBox.max.z).applyMatrix4(node.matrix);
    } else continue;
    if (!muzzle || point.z > muzzle.z) muzzle = point;
  }
  // Stored before the common grounding/scale pass. Runtime adds that pass's
  // ground offset and uses localToWorld, so left-mounted barrels, scene turns
  // and humanoid size changes keep the same actual muzzle.
  if (muzzle) root.userData.humanoidWeaponMuzzle = muzzle.toArray();
}

function fitExistingEquipment(node, type) {
  if (!node.isMesh || node.isInstancedMesh || node.userData.humanAnatomy) return;
  if (node.geometry?.type !== 'BoxGeometry') return;
  // RoundedBoxGeometry inherits BoxGeometry's unit-box parameters. Its actual
  // vertices retain the authored dimensions; use those rather than inflating a
  // 24cm-thick pack into a one-metre cube.
  node.geometry.computeBoundingBox();
  const dimensions = node.geometry.boundingBox.getSize(new THREE.Vector3());
  const p = { width: dimensions.x, height: dimensions.y, depth: dimensions.z };
  const { x, y, z } = node.position;
  if (Math.abs(x) < 0.1 && y > 1.1 && y < 1.7 && p.width > 0.5 && p.depth > 0.2 && z >= -0.1) {
    const centerZ = z;
    replaceGeometry(node, sectionGeometry([
      [0, 1.07, centerZ, 0.255, 0.19], [0, 1.19, centerZ, 0.29, 0.215],
      [0, 1.49, centerZ, 0.35, 0.215], [0, 1.67, centerZ, 0.325, 0.18],
      [0, 1.72, centerZ, 0.235, 0.145],
    ]), 'fitted-carrier', type);
  } else if (Math.abs(x) < 0.15 && z < -0.2 && p.height > 0.5) {
    const geometry = softEquipmentGeometry();
    geometry.scale(p.width, p.height, p.depth);
    node.geometry.dispose(); node.geometry = geometry;
    node.position.z += 0.04;
    node.name = `equipment:${type}:soft-pack`;
  } else if (Math.abs(x) > 0.3 && y > 1.6 && y < 1.88 && p.height < 0.35 && p.width < 0.4) {
    const geometry = softEquipmentGeometry();
    geometry.scale(p.width, p.height, p.depth);
    node.geometry.dispose(); node.geometry = geometry;
    node.name = `equipment:${type}:shoulder-shell`;
  }
}

function reshapeDetailInstances(root, type, gun) {
  const plates = root.getObjectByName(`near-detail:${type}:articulated-plates`);
  const face = root.getObjectByName(`near-detail:${type}:face-and-ears`);
  if (plates?.isInstancedMesh) {
    plates.geometry.dispose(); plates.geometry = softEquipmentGeometry();
    const matrix = new THREE.Matrix4(), position = new THREE.Vector3(), rotation = new THREE.Quaternion(), scale = new THREE.Vector3();
    for (let index = 0; index < plates.count; index++) {
      plates.getMatrixAt(index, matrix); matrix.decompose(position, rotation, scale);
      if (position.y < 0.2) {
        // Low, tapered footwear; a boot is no longer as tall as half the shin.
        scale.y *= 0.85; scale.x *= 0.92;
        position.y = scale.y / 2;
      } else if (Math.abs(position.x) > 0.6 && position.y < 1.2) {
        const right = position.x > 0;
        position.set(...(right ? gun.rightHand : gun.leftHand));
        scale.set(0.13, 0.145, 0.18);
        rotation.setFromEuler(new THREE.Euler(-0.25, 0, right ? -0.15 : 0.3));
      } else if (Math.abs(position.x) > 0.4 && position.y > 1.55 && position.y < 1.88) {
        position.x *= 0.86; position.y -= 0.02;
        scale.x *= 0.8; scale.y *= 0.55; scale.z *= 0.7;
      } else if (Math.abs(position.x) < 0.2 && Math.abs(position.y - 1.53) < 0.03 && position.z > 0.2 && scale.y > 0.3) {
        // One close-fitting ballistic plate and its upper webbing, rather than
        // two breast-shaped pillows attached to the front of the chest.
        if (position.x < 0) { position.set(0, 1.49, 0.205); scale.set(0.58, 0.52, 0.085); }
        else { position.set(0, 1.72, 0.19); scale.set(0.5, 0.055, 0.055); }
      } else if (Math.abs(position.x) < 0.26 && position.y > 0.95 && position.y < 1.2 && position.z > 0.2) {
        position.z = 0.22; scale.y *= 0.85; scale.z *= 0.85;
      } else if (position.y > 1.9) {
        // Keep eyes in the sockets rather than sitting on the front of a mask.
        position.z -= 0.025; scale.y *= 0.7;
        if (scale.x > 0.05) position.y -= 0.045;
      }
      matrix.compose(position, rotation, scale); plates.setMatrixAt(index, matrix);
    }
    plates.instanceMatrix.needsUpdate = true;
    plates.boundingBox = plates.boundingSphere = null;
  }
  if (face?.isInstancedMesh) {
    face.geometry.dispose(); face.geometry = facialContourGeometry();
    const matrix = new THREE.Matrix4(), position = new THREE.Vector3(), rotation = new THREE.Quaternion(), scale = new THREE.Vector3();
    const headY = type === 'era_wartime_pilot' ? 1.95 : 2.04;
    for (let index = 0; index < face.count; index++) {
      face.getMatrixAt(index, matrix); matrix.decompose(position, rotation, scale);
      if (index === 0) { position.set(0, headY - 0.015, 0.17); scale.set(0.2, 0.225, 0.115); }
      else if (index === 1) { position.y = headY - 0.03; position.z = 0.285; scale.set(0.027, 0.046, 0.04); }
      else { position.x *= 0.88; scale.multiplyScalar(0.85); }
      matrix.compose(position, rotation, scale); face.setMatrixAt(index, matrix);
    }
    face.instanceMatrix.needsUpdate = true;
    face.boundingBox = face.boundingSphere = null;
  }
  const hardware = root.getObjectByName(`near-detail:${type}:carrier-hardware`);
  if (hardware?.isInstancedMesh) {
    const matrix = new THREE.Matrix4();
    for (let index = 0; index < hardware.count; index++) {
      hardware.getMatrixAt(index, matrix); matrix.scale(new THREE.Vector3(0.55, 0.55, 0.55)); hardware.setMatrixAt(index, matrix);
    }
    hardware.instanceMatrix.needsUpdate = true;
    hardware.boundingBox = hardware.boundingSphere = null;
  }
}

/** Replace block contours while retaining the existing roles/material draws. */
export function refineHumanoidAnatomy(root, type) {
  const children = [...root.children];
  const torso = children.find(node => node.isMesh && !node.isInstancedMesh);
  if (!torso) return;
  const ancient = ancientTypes.has(type), synthetic = syntheticTypes.has(type);
  const broad = type === 'era_viking_raider' || type === 'jungle_gunner' || type === 'colonial_marine_smartgunner';
  const bulk = broad ? 1.1 : type === 'era_feudal_duelist' ? 0.93 : 1;
  replaceGeometry(torso, sectionGeometry([
    [0, 0.9, -0.015, 0.235 * bulk, 0.145], [0, 1.01, -0.005, 0.295 * bulk, 0.17],
    [0, 1.16, 0, 0.25 * bulk, 0.16], [0, 1.35, 0, 0.32 * bulk, 0.19],
    [0, 1.55, -0.005, 0.38 * bulk, 0.195], [0, 1.69, -0.005, 0.355 * bulk, 0.165],
    [0, 1.79, 0, 0.265, 0.145], [0, 1.84, 0, 0.17, 0.125], [0, 1.86, 0, 0.12, 0.115],
  ]), 'rib-cage-waist-pelvis', type);
  const skull = children.find(node => !node.isInstancedMesh && node.isMesh && node.position.y > 1.88 && Math.abs(node.position.x) < 0.1 &&
    ((node.geometry.type === 'SphereGeometry' && node.geometry.parameters.radius >= 0.2) ||
      (node.geometry.type === 'BoxGeometry' && node.geometry.parameters.height >= 0.25)));
  if (skull) {
    sculptHead(skull, type);
    const face = root.getObjectByName(`near-detail:${type}:face-and-ears`);
    const integratedCover = ['human_fireteam', 'thermal_trapper', 'era_wartime_pilot', 'weyland_expedition_guard'].includes(type);
    if (!synthetic && !integratedCover && face?.material) skull.material = face.material;
  }
  const firearm = children.find(node => node.isMesh && !node.isInstancedMesh && node.position.x > 0.15 &&
    node.position.y > 1.1 && node.position.y < 1.6 && node.position.z > 0.3 && node.material?.metalness > 0.65);
  const gunX = firearm?.position.x ?? 0.4, gunY = firearm?.position.y ?? 1.4, gunZ = firearm?.position.z ?? 0.43;
  const hands = ancient ? { rightHand: [0.56, 1.07, 0.12], leftHand: [-0.56, 1.1, 0.14] }
    : { rightHand: [gunX, gunY - 0.045, Math.max(0.13, gunZ - 0.2)], leftHand: [gunX - 0.1, gunY - 0.02, gunZ + 0.18] };
  for (const node of children) {
    if (!node.isMesh || node.isInstancedMesh || node === torso || node === skull) continue;
    const side = Math.sign(node.position.x);
    if (isLongLimb(node) && Math.abs(node.position.x) > 0.12 && Math.abs(node.position.x) < 0.32 && node.position.y < 0.65) {
      replaceGeometry(node, sectionGeometry([
        [side * 0.21, 0.11, 0, 0.072, 0.08], [side * 0.22, 0.24, -0.015, 0.098, 0.1],
        [side * 0.23, 0.38, -0.02, 0.12, 0.115], [side * 0.235, 0.54, 0.025, 0.09, 0.092],
        [side * 0.225, 0.69, 0, 0.125, 0.13], [side * 0.205, 0.89, -0.02, 0.148, 0.145],
        [side * 0.2, 1.03, -0.025, 0.135, 0.13],
      ]), side < 0 ? 'left-thigh-knee-calf' : 'right-thigh-knee-calf', type);
    } else if (isLongLimb(node) && Math.abs(node.position.x) > 0.32 && node.position.y > 1.1 && node.position.y < 1.6) {
      const hand = side > 0 ? hands.rightHand : hands.leftHand;
      const elbowX = side * (ancient ? 0.52 : 0.45), elbowZ = ancient ? 0.035 : 0.045;
      replaceGeometry(node, sectionGeometry([
        [hand[0], hand[1] - 0.02, hand[2], 0.061, 0.065],
        [(hand[0] + elbowX) / 2, (hand[1] + 1.34) / 2, (hand[2] + elbowZ) / 2, 0.09, 0.087],
        [elbowX, 1.34, elbowZ, 0.084, 0.088], [side * 0.445, 1.51, 0.005, 0.115 * bulk, 0.105],
        [side * 0.405, 1.68, -0.005, 0.125 * bulk, 0.12],
      ]), side < 0 ? 'left-shoulder-elbow-wrist' : 'right-shoulder-elbow-wrist', type);
    } else fitExistingEquipment(node, type);
  }
  reshapeDetailInstances(root, type, hands);
  refineGenericNpcFirearms(root, type);
  recordWeaponMuzzle(root, children);
  root.userData.humanAnatomy = { modelStatus: 'original_generic_anatomy', fidelityVerified: false,
    articulatedProfiles: true, shoulders: 'tapered_rib_cage', hands: ancient ? 'weapon_grip' : 'two_handed_firearm_grip' };
}
