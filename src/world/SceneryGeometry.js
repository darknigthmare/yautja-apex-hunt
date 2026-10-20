import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export function createBeveledSceneryBox(width, height, depth, bevel = Math.min(width, height, depth) * 0.08) {
  const geometry = new RoundedBoxGeometry(width, height, depth, 1, Math.min(bevel, 0.22));
  geometry.userData.surfaceConstruction = 'rolled-edges';
  return geometry;
}

export function createTurnedSceneryCylinder(top, bottom, height, segments = 12) {
  const radiusAt = (t) => THREE.MathUtils.lerp(bottom, top, t);
  const points = [new THREE.Vector2(0, -height * 0.5)];
  for (const [progress, inset] of [[0, 0.86], [0.035, 1], [0.09, 1], [0.12, 0.93], [0.86, 0.93], [0.9, 1], [0.965, 1], [1, 0.86]]) {
    points.push(new THREE.Vector2(radiusAt(progress) * inset, (progress - 0.5) * height));
  }
  points.push(new THREE.Vector2(0, height * 0.5));
  const geometry = new THREE.LatheGeometry(points, Math.max(10, segments));
  geometry.userData.surfaceConstruction = 'machined-collars';
  return geometry;
}

function paint(geometry, value, variation = 0.1) {
  const positions = geometry.getAttribute('position');
  const base = new THREE.Color(value);
  const colors = new Float32Array(positions.count * 3);
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const z = positions.getZ(index);
    const shade = 1 + variation * (Math.sin(x * 3.1 + y * 1.7) * 0.6 + Math.cos(z * 3.7 - y * 0.8) * 0.4);
    colors[index * 3] = base.r * shade;
    colors[index * 3 + 1] = base.g * shade;
    colors[index * 3 + 2] = base.b * shade;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function combine(parts, signature) {
  const object = new THREE.Object3D();
  const sources = new Set();
  const baked = parts.map(({ geometry, color = 0xffffff, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) => {
    sources.add(geometry);
    object.position.fromArray(position);
    object.rotation.set(...rotation);
    object.scale.fromArray(scale);
    object.updateMatrix();
    const transformed = geometry.index ? geometry.toNonIndexed() : geometry.clone();
    transformed.applyMatrix4(object.matrix);
    return paint(transformed, color);
  });
  const geometry = mergeGeometries(baked, false);
  baked.forEach((part) => part.dispose());
  sources.forEach((part) => part.dispose());
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.userData.scenerySignature = signature;
  return geometry;
}

function limb(start, end, radius, tipRadius, color, segments = 8) {
  const from = new THREE.Vector3(...start);
  const to = new THREE.Vector3(...end);
  const direction = to.clone().sub(from);
  const rotation = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize()));
  return {
    geometry: new THREE.CylinderGeometry(tipRadius, radius, direction.length(), segments, 2),
    position: from.add(to).multiplyScalar(0.5).toArray(),
    rotation: [rotation.x, rotation.y, rotation.z],
    color,
  };
}

export function createWeatheredSceneryRock(radius, detail = 2) {
  const geometry = new THREE.IcosahedronGeometry(radius, detail);
  const positions = geometry.getAttribute('position');
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const z = positions.getZ(index);
    // Des strates continues, sans bruit aléatoire ni cassure entre sommets dupliqués.
    const weathering = 0.89 + 0.045 * Math.sin(x * 1.7 + z * 2.1) + 0.045 * Math.cos(y * 3.8);
    positions.setXYZ(index, x * weathering, y * (0.8 + 0.07 * Math.sin(x * 0.9)) * weathering, z * weathering);
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.userData.surfaceConstruction = 'eroded-strata';
  return geometry;
}

function leafBladeGeometry() {
  const positions = [];
  const uvs = [];
  const indices = [];
  for (let ring = 0; ring <= 3; ring += 1) {
    const progress = ring / 3;
    const width = Math.max(0.015, Math.sin(progress * Math.PI) ** 0.8) * 0.5;
    const arch = Math.sin(progress * Math.PI) * 0.15 - progress * progress * 0.18;
    for (const side of [-1, 0, 1]) {
      positions.push(side * width, arch - Math.abs(side) * Math.sin(progress * Math.PI) * 0.1, progress);
      uvs.push((side + 1) * 0.5, progress);
    }
    if (ring < 3) {
      const base = ring * 3;
      indices.push(base, base + 3, base + 1, base + 1, base + 3, base + 4);
      indices.push(base + 1, base + 4, base + 2, base + 2, base + 4, base + 5);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function broadleafCanopy() {
  const parts = [];
  const blade = leafBladeGeometry();
  // Des petites masses internes ferment le cœur de la couronne ; la silhouette
  // visible est portée par les feuilles courbes, pas par de grosses sphères.
  for (let cluster = 0; cluster < 12; cluster += 1) {
    const angle = cluster * 2.399963229728653;
    parts.push({
      geometry: new THREE.IcosahedronGeometry(1, 1),
      position: [Math.cos(angle) * (3.4 + cluster % 3), Math.sin(cluster * 1.3) * 0.9, Math.sin(angle) * (3.4 + cluster % 3)],
      scale: [1.8, 1.0 + (cluster % 2) * 0.35, 1.7],
      color: [0x748560, 0x879266, 0x697e5c][cluster % 3],
    });
  }
  for (let branch = 0; branch < 6; branch += 1) {
    const branchAngle = branch * 2.399963229728653;
    const branchX = Math.cos(branchAngle) * 4.4;
    const branchZ = Math.sin(branchAngle) * 4.4;
    for (let index = 0; index < 24; index += 1) {
      const angle = branchAngle + index * 2.399963229728653;
      const spread = 0.3 + (index % 5) * 0.38;
      parts.push({
        geometry: blade,
        position: [branchX + Math.cos(angle) * spread, 0.2 + Math.sin(index * 1.1 + branch) * 1.4, branchZ + Math.sin(angle) * spread],
        rotation: [0.12 + (index % 6) * 0.13, angle, Math.sin(index * 1.7) * 0.28],
        scale: [0.85 + (index % 4) * 0.2, 1, 3.0 + (index % 6) * 0.34],
        color: [0xb2c398, 0x98ae7a, 0xc2c9a5, 0xa5b78a][index % 4],
      });
    }
  }
  return parts;
}

function forestCover(alien = false) {
  const bark = alien ? 0xb1aaa0 : 0xc4b69e;
  const trunk = new THREE.CylinderGeometry(1.55, 3.6, 30, 14, 8);
  const positions = trunk.getAttribute('position');
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const z = positions.getZ(index);
    const angle = Math.atan2(z, x);
    const ridge = 1 + Math.sin(angle * 7 + y * 0.1) * 0.12;
    positions.setXYZ(index, x * ridge + Math.sin(y * 0.08) * 0.65, y, z * ridge);
  }
  trunk.computeVertexNormals();
  const branches = [{ geometry: trunk, color: bark }];
  for (let index = 0; index < 6; index += 1) {
    const angle = index * 2.399963229728653;
    branches.push(limb([0, 4 + index * 0.8, 0], [Math.cos(angle) * 6.4, 11 + index * 0.4, Math.sin(angle) * 6.4], 0.85, 0.18, bark));
    branches.push(limb([Math.cos(angle) * 1.1, -8, Math.sin(angle) * 1.1], [Math.cos(angle) * 5, -14.8, Math.sin(angle) * 5], 1.05, 0.32, bark));
  }
  const foliage = alien ? [] : broadleafCanopy();
  for (let index = 0; alien && index < 5; index += 1) {
    const angle = index * 2.399963229728653;
    foliage.push({
      geometry: new THREE.SphereGeometry(1, 14, 8),
      position: [Math.cos(angle) * 4.8, Math.sin(index * 1.7) * 0.85, Math.sin(angle) * 4.8],
      scale: [5.4, alien ? 3.8 : 2.5, 4.7],
      color: alien ? [0x576347, 0x7c6557, 0x45563c][index % 3] : [0x3b5934, 0x51683c, 0x6b7548][index % 3],
    });
  }
  if (alien) {
    for (let index = 0; index < 6; index += 1) {
      const angle = index * 2.399963229728653;
      foliage.push({ geometry: new THREE.SphereGeometry(1, 10, 6), position: [Math.cos(angle) * 5.3, -2.8, Math.sin(angle) * 5.3], scale: [1.2, 2.1, 1.1], color: index % 2 ? 0x76587a : 0x4c4558 });
    }
  }
  return {
    body: combine(branches, alien ? 'gnarled-alien-root-crown' : 'buttressed-fluted-trunk-and-branches'),
    accent: combine(foliage, alien ? 'lobed-spore-canopy' : 'curved-leaf-sprays-and-irregular-crown'),
  };
}

function industrialCover(biomeId) {
  const urban = biomeId === 'los_angeles_1997';
  const height = urban ? 26 : biomeId === 'gunnison_outbreak' ? 16 : 20;
  const width = urban ? 8 : biomeId === 'gunnison_outbreak' ? 5.5 : 7;
  const depth = urban ? 7 : biomeId === 'gunnison_outbreak' ? 3.4 : 6;
  const halfHeight = height * 0.5;
  const concrete = urban ? 0x93867b : biomeId === 'gunnison_outbreak' ? 0x707776 : 0x7b888d;
  const parts = [{ geometry: createBeveledSceneryBox(width * 0.94, height - 1, depth * 0.94), color: concrete }];
  for (const side of [-1, 1]) {
    for (const end of [-1, 1]) {
      parts.push({ geometry: createBeveledSceneryBox(0.5, height, 0.5), position: [side * (width * 0.5 - 0.25), 0, end * (depth * 0.5 - 0.25)], color: urban ? 0x71645b : 0x46555e });
    }
  }
  for (const y of [-halfHeight + 0.5, halfHeight - 0.5]) {
    parts.push({ geometry: createBeveledSceneryBox(width, 1, depth), position: [0, y, 0], color: 0x77746c });
  }
  for (let row = 0; row < (urban ? 5 : 3); row += 1) {
    const y = -halfHeight + 3 + row * (urban ? 4.5 : 4.1);
    for (const side of [-1, 1]) {
      for (const column of [-1, 1]) {
        const x = column * width * 0.23;
        parts.push({ geometry: new THREE.BoxGeometry(width * 0.25, 1.9, 0.12), position: [x, y, side * depth * 0.48], color: row === 2 && column === 1 ? 0xb39b65 : 0x29373b });
        parts.push({ geometry: new THREE.BoxGeometry(width * 0.29, 0.16, 0.35), position: [x, y - 0.98, side * depth * 0.48], color: concrete });
      }
    }
  }
  if (urban) {
    for (const y of [-6, 0, 6]) {
      parts.push({ geometry: new THREE.BoxGeometry(2.8, 0.18, 1.3), position: [-width * 0.2, y, depth * 0.5 + 0.5], color: 0x4c4e48 });
      for (const side of [-1, 1]) parts.push({ geometry: new THREE.BoxGeometry(0.12, 5.9, 0.14), position: [-width * 0.2 + side * 0.8, y + 3, depth * 0.5 + 1], color: 0x6d6554 });
      for (let rung = 0; rung < 8; rung += 1) parts.push({ geometry: new THREE.BoxGeometry(1.6, 0.11, 0.16), position: [-width * 0.2, y + 0.45 + rung * 0.7, depth * 0.5 + 1], color: 0x74705f });
    }
  } else {
    parts.push({ geometry: createTurnedSceneryCylinder(0.22, 0.22, height * 0.8, 10), position: [width * 0.37, 0, depth * 0.5 + 0.18], color: 0x4b5556 });
    for (let index = 0; index < 6; index += 1) parts.push({ geometry: new THREE.BoxGeometry(width * 0.36, 0.13, 0.2), position: [0, -halfHeight + 1.8 + index * 0.29, depth * 0.5], color: 0x3d4546 });
  }
  const roof = [
    { geometry: createBeveledSceneryBox(width * 0.62, 1.8, depth * 0.64), color: 0x596468 },
    { geometry: createTurnedSceneryCylinder(0.7, 0.9, 2.4, 12), position: [-width * 0.2, 1, 0], color: 0x8a8e84 },
  ];
  for (let index = 0; index < 5; index += 1) {
    roof.push({ geometry: new THREE.BoxGeometry(width * 0.4, 0.1, 0.12), position: [0, -0.35 + index * 0.23, depth * 0.33], color: 0x252c2d });
  }
  return { body: combine(parts, 'beveled-piers-recessed-windows-and-cornices'), accent: combine(roof, 'ventilated-rooftop-machinery') };
}

function ritualCover() {
  const parts = [
    { geometry: createBeveledSceneryBox(5.5, 28, 5.5), color: 0x6e5845 },
    { geometry: createBeveledSceneryBox(7, 2, 7), position: [0, -14, 0], color: 0x88755b },
    { geometry: createBeveledSceneryBox(6.5, 1.4, 6.5), position: [0, 14, 0], color: 0xa28d68 },
  ];
  for (const side of [-1, 1]) {
    for (let index = 0; index < 5; index += 1) {
      parts.push({ geometry: new THREE.BoxGeometry(3.7, 0.36, 0.14), position: [0, -7 + index * 3.8, side * 2.82], rotation: [0, 0, (index % 2 ? 1 : -1) * 0.13], color: 0x302b26 });
    }
  }
  const crest = [
    { geometry: new THREE.OctahedronGeometry(2.8, 1), scale: [0.7, 1.5, 0.7], color: 0x9e8862 },
    { geometry: new THREE.TorusGeometry(2.5, 0.22, 8, 24), color: 0x67553e },
  ];
  return { body: combine(parts, 'carved-ceremonial-monolith'), accent: combine(crest, 'ritual-crown-and-forged-ring') };
}

function hiveCover() {
  const parts = [{ geometry: new THREE.CylinderGeometry(0.95, 1.8, 29, 12, 6), color: 0x343e35 }];
  for (let index = 0; index < 8; index += 1) {
    parts.push({ geometry: new THREE.TorusGeometry(3.2 - index * 0.13, 0.42, 6, 16, Math.PI * 1.65), position: [0, -12 + index * 3.4, 0], rotation: [Math.PI * 0.5, index * 0.23, index * 0.13], color: index % 2 ? 0x77816c : 0x58674f });
  }
  const crown = [];
  for (let index = 0; index < 4; index += 1) {
    const angle = index * Math.PI * 0.5;
    crown.push({ geometry: new THREE.TorusGeometry(3.4, 0.5, 7, 18, Math.PI * 1.1), position: [Math.cos(angle), -0.3, Math.sin(angle)], rotation: [0.4, angle, 0.2], color: 0x66765b });
  }
  return { body: combine(parts, 'segmented-biomechanical-ribs'), accent: combine(crown, 'arched-resin-vault-crown') };
}

function iceCover() {
  const crystals = [];
  for (let index = 0; index < 5; index += 1) {
    const angle = index * 2.399963229728653;
    const height = index === 0 ? 28 : 14 + index * 2;
    crystals.push({ geometry: new THREE.LatheGeometry([new THREE.Vector2(0, -height * 0.5), new THREE.Vector2(index ? 1.6 : 3.2, -height * 0.5), new THREE.Vector2(index ? 2.1 : 3.8, -height * 0.2), new THREE.Vector2(index ? 1.4 : 2.5, height * 0.29), new THREE.Vector2(0, height * 0.5)], 6), position: [index ? Math.cos(angle) * 4 : 0, -14 + height * 0.5, index ? Math.sin(angle) * 4 : 0], rotation: [Math.sin(angle) * 0.07, angle, Math.cos(angle) * 0.07], color: [0xb1c6c9, 0x657d86, 0x819ba4][index % 3] });
  }
  const cap = [{ geometry: createWeatheredSceneryRock(1.2), scale: [0.8, 0.75, 0.7], position: [0, -1.6, 0], color: 0xc3d0ca }];
  return { body: combine(crystals, 'fractured-hexagonal-ice-cluster'), accent: combine(cap, 'frosted-rock-cap') };
}

export function createSceneryCoverGeometry(biomeId) {
  if (['stargazer_blacksite', 'los_angeles_1997', 'gunnison_outbreak'].includes(biomeId)) return industrialCover(biomeId);
  if (biomeId === 'yautja_prime') return ritualCover();
  if (biomeId === 'hive_lv426') return hiveCover();
  if (biomeId === 'bouvetoya_pyramid') return iceCover();
  if (biomeId === 'ryushi_desert') return {
    body: combine([{ geometry: createWeatheredSceneryRock(7.5, 3), color: 0xb29a75 }], 'wind-eroded-stratified-outcrop'),
    accent: combine([{ geometry: createWeatheredSceneryRock(3.8, 2), scale: [1, 0.4, 0.8], color: 0x776e58 }], 'layered-detached-capstone'),
  };
  return forestCover(biomeId === 'genna_deathworld');
}
