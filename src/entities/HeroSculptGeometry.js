import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Surfaces authored for the close-camera hunter. The profiles describe muscle
// masses and hard-surface planes rather than uniformly subdividing primitives.
export function sculptLoft(profile, { rings = 48, sides = 40, deform } = {}) {
  const contour = new THREE.CatmullRomCurve3(profile.map(([y, x, z]) => new THREE.Vector3(x, y, z)));
  const positions = [], uvs = [], indices = [];
  for (let ring = 0; ring <= rings; ring++) {
    const v = ring / rings;
    const section = contour.getPoint(v);
    for (let side = 0; side <= sides; side++) {
      const u = side / sides, angle = u * Math.PI * 2;
      const point = new THREE.Vector3(Math.sin(angle) * section.x, section.y, Math.cos(angle) * section.z);
      deform?.(point, u, v);
      positions.push(point.x, point.y, point.z);
      uvs.push(u, v);
      if (ring < rings && side < sides) {
        const a = ring * (sides + 1) + side, b = a + sides + 1;
        indices.push(a, a + 1, b, a + 1, b + 1, b);
      }
    }
  }
  for (const top of [false, true]) {
    const section = contour.getPoint(top ? 1 : 0);
    const center = positions.length / 3;
    positions.push(0, section.y, 0);
    uvs.push(0.5, 0.5);
    const capRing = center + 1;
    for (let side = 0; side <= sides; side++) {
      const angle = side / sides * Math.PI * 2;
      const point = new THREE.Vector3(Math.sin(angle) * section.x, section.y, Math.cos(angle) * section.z);
      deform?.(point, side / sides, top ? 1 : 0);
      positions.push(point.x, point.y, point.z);
      uvs.push(Math.sin(angle) * 0.5 + 0.5, Math.cos(angle) * 0.5 + 0.5);
      if (side < sides) {
        if (top) indices.push(center, capRing + side, capRing + side + 1);
        else indices.push(center, capRing + side + 1, capRing + side);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.userData.authoredSurface = 'anatomical_loft';
  return geometry;
}

export function mergeSculptParts(parts) {
  const geometries = parts.map(({ geometry, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) => {
    const matrix = new THREE.Matrix4().compose(
      new THREE.Vector3(...position),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)),
      new THREE.Vector3(...scale),
    );
    const transformed = geometry.clone().applyMatrix4(matrix);
    const normalized = transformed.index ? transformed.toNonIndexed() : transformed;
    if (normalized !== transformed) transformed.dispose();
    return normalized;
  });
  const merged = mergeGeometries(geometries);
  geometries.forEach((geometry) => geometry.dispose());
  return merged;
}

export function taperedCurve(points, radius, { segments = 36, sides = 12, taper = 0.72, ridges = 0 } = {}) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  const geometry = new THREE.TubeGeometry(curve, segments, radius, sides, false);
  const positions = geometry.attributes.position;
  for (let ring = 0; ring <= segments; ring++) {
    const t = ring / segments, center = curve.getPointAt(t);
    const scale = (1 - taper * t) * (1 + Math.sin(t * Math.PI * 72) * ridges);
    for (let side = 0; side <= sides; side++) {
      const index = ring * (sides + 1) + side;
      const point = new THREE.Vector3().fromBufferAttribute(positions, index).sub(center).multiplyScalar(scale).add(center);
      positions.setXYZ(index, point.x, point.y, point.z);
    }
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function createTorsoSculpt() {
  return sculptLoft([
    [-1.1, 0.45, 0.34], [-0.87, 0.72, 0.48], [-0.5, 0.81, 0.53],
    [-0.05, 0.94, 0.62], [0.38, 1.2, 0.69], [0.8, 1.29, 0.73],
    [1.12, 1.13, 0.61], [1.39, 0.78, 0.45], [1.68, 0.33, 0.3],
  ], {
    rings: 64, sides: 64,
    deform(point, u, v) {
      const front = Math.max(0, Math.cos(u * Math.PI * 2));
      // Pectoral separation, serratus and longitudinal abdominal tendons.
      point.z += front * (Math.sin(v * Math.PI * 7) * 0.035 - Math.exp(-point.x * point.x * 80) * 0.055);
      point.x *= 1 + Math.sin(v * Math.PI * 8 + Math.abs(point.x) * 3) * 0.025;
    },
  });
}

export function createLimbSculpt(kind) {
  const profiles = {
    upperArm: [[-0.8, 0.22, 0.22], [-0.65, 0.31, 0.29], [-0.22, 0.44, 0.39], [0.19, 0.4, 0.37], [0.65, 0.27, 0.27], [0.8, 0.12, 0.13]],
    forearm: [[-0.74, 0.19, 0.19], [-0.58, 0.25, 0.24], [-0.2, 0.36, 0.33], [0.2, 0.37, 0.31], [0.62, 0.24, 0.24], [0.76, 0.15, 0.15]],
    thigh: [[-0.93, 0.24, 0.25], [-0.7, 0.36, 0.35], [-0.18, 0.52, 0.48], [0.3, 0.55, 0.48], [0.71, 0.39, 0.37], [0.92, 0.2, 0.22]],
    shin: [[-0.85, 0.19, 0.18], [-0.58, 0.23, 0.25], [-0.16, 0.38, 0.4], [0.2, 0.41, 0.37], [0.63, 0.29, 0.26], [0.85, 0.18, 0.18]],
    deltoid: [[-0.62, 0.12, 0.16], [-0.36, 0.38, 0.39], [0.0, 0.53, 0.48], [0.34, 0.41, 0.38], [0.52, 0.06, 0.08]],
  };
  return sculptLoft(profiles[kind], {
    rings: 48, sides: 40,
    deform(point, u, v) {
      const tendon = Math.sin(u * Math.PI * 6 + v * 1.6) * Math.sin(v * Math.PI);
      point.x *= 1 + tendon * 0.04;
      point.z *= 1 + tendon * 0.045;
    },
  });
}

export function createCraniumSculpt() {
  return sculptLoft([
    [-0.92, 0.26, 0.37], [-0.65, 0.61, 0.58], [-0.2, 0.78, 0.79],
    [0.3, 0.84, 0.84], [0.77, 0.65, 0.69], [1.11, 0.03, 0.08],
  ], { rings: 48, sides: 48 });
}

export function createPredlockSculpt(index) {
  const parts = [];
  for (let strand = 0; strand < 2; strand++) {
    const offset = (strand - 0.5) * 0.14;
    const geometry = taperedCurve([
      [offset, 1.28, 0], [offset * 1.1, 0.62, -0.04],
      [offset + Math.sin(index) * 0.07, -0.27, -0.13],
      [offset + Math.sin(index * 1.7) * 0.14, -1.3 + strand * 0.18, -0.25],
    ], strand === 0 ? 0.115 : 0.085, { segments: 48, sides: 12, taper: 0.74, ridges: 0.045 });
    parts.push({ geometry });
  }
  const result = mergeSculptParts(parts);
  parts.forEach(({ geometry }) => geometry.dispose());
  result.userData.authoredSurface = 'paired_tapered_predlocks';
  return result;
}

export function createHandSculpt(side) {
  const skin = [], claws = [];
  const palm = sculptLoft([[-0.39, 0.19, 0.12], [-0.2, 0.28, 0.16], [0.1, 0.26, 0.16], [0.3, 0.17, 0.13]], { rings: 24, sides: 24 });
  skin.push({ geometry: palm });
  for (let finger = 0; finger < 4; finger++) {
    const x = (finger - 1.5) * 0.145;
    const length = [0.57, 0.73, 0.69, 0.52][finger];
    skin.push({ geometry: taperedCurve([[x, -0.25, 0.04], [x * 1.11, -0.25 - length * 0.48, 0.12], [x * 1.08, -0.25 - length, 0.29]], 0.079, { segments: 24, sides: 10, taper: 0.42 }) });
    claws.push({ geometry: taperedCurve([[x * 1.08, -0.25 - length, 0.29], [x * 1.05, -0.35 - length, 0.39], [x, -0.4 - length, 0.5]], 0.058, { segments: 12, sides: 10, taper: 0.98 }) });
  }
  const thumbX = side * -0.26;
  skin.push({ geometry: taperedCurve([[thumbX, 0, 0.02], [thumbX * 1.65, -0.18, 0.12], [thumbX * 1.75, -0.43, 0.36]], 0.11, { segments: 28, sides: 12, taper: 0.48 }) });
  claws.push({ geometry: taperedCurve([[thumbX * 1.75, -0.43, 0.36], [thumbX * 1.6, -0.53, 0.5], [thumbX * 1.3, -0.55, 0.57]], 0.065, { segments: 14, sides: 10, taper: 0.98 }) });
  const result = { skin: mergeSculptParts(skin), claws: mergeSculptParts(claws) };
  [...skin, ...claws].forEach(({ geometry }) => geometry.dispose());
  return result;
}

export function createBiomaskSculpt(maskData) {
  const profile = maskData.geometry ?? {}, scale = maskData.scale ?? 1;
  const bone = ['bone', 'kok_viking', 'kwei', 'boar'].includes(maskData.shape);
  const angular = ['celtic', 'samurai', 'royal', 'guardian', 'warrior', 'armored'].includes(maskData.shape);
  const widthCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.24, -1.04, 0), new THREE.Vector3(0.49, -0.75, 0),
    new THREE.Vector3(0.76, -0.29, 0), new THREE.Vector3(0.82, 0.22, 0),
    new THREE.Vector3(0.91, 0.71, 0), new THREE.Vector3(0.65, 1.04, 0), new THREE.Vector3(0.32, 1.12, 0),
  ]);
  const positions = [], uvs = [], indices = [], rows = 64, columns = 64;
  for (let face = 0; face < 2; face++) {
    for (let row = 0; row <= rows; row++) {
      const v = row / rows, p = widthCurve.getPoint(v);
      for (let column = 0; column <= columns; column++) {
        const u = column / columns, across = u * 2 - 1;
        const x = across * p.x * (profile.browWidth ?? 1);
        const y = p.y * (1 + (profile.crestHeight ?? 0.2) * 0.14);
        const center = 1 - across * across;
        const eye = Math.exp(-Math.pow((Math.abs(x) - 0.39) * 8, 2) - Math.pow((y - 0.19) * 11, 2));
        const brow = Math.exp(-Math.pow((y - 0.36) * 13, 2)) * (0.05 + Math.abs(across) * 0.11);
        const nose = Math.exp(-x * x * 36) * Math.exp(-Math.pow((y + 0.16) * 2.4, 2)) * 0.17;
        const cheek = Math.max(0, 1 - Math.abs(Math.abs(across) - 0.65) * 3) * Math.exp(-Math.pow((y + 0.25) * 3, 2)) * (profile.cheekGuard ?? 0.4) * 0.32;
        let z = 0.3 + center * 0.37 + brow + nose + cheek - eye * 0.13;
        if (bone) z += Math.sin(y * 20 + Math.abs(x) * 9) * 0.025 * center;
        if (angular) z += Math.max(0, 1 - Math.abs(across) * 3) * 0.07;
        z += Math.max(0, -y - 0.5) * ((profile.jawLength ?? 1) - 0.6) * 0.25;
        positions.push(x * scale, y * scale, (z - face * 0.085) * scale);
        uvs.push(u, v);
      }
    }
  }
  const layer = (rows + 1) * (columns + 1);
  for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
    const a = row * (columns + 1) + column, b = a + columns + 1;
    indices.push(a, a + 1, b, a + 1, b + 1, b);
    indices.push(a + layer, b + layer, a + 1 + layer, a + 1 + layer, b + layer, b + 1 + layer);
  }
  // Close the rim; this shell remains solid under grazing light and motion.
  const rim = [];
  for (let i = 0; i <= columns; i++) rim.push(i);
  for (let i = 1; i <= rows; i++) rim.push(i * (columns + 1) + columns);
  for (let i = columns - 1; i >= 0; i--) rim.push(rows * (columns + 1) + i);
  for (let i = rows - 1; i > 0; i--) rim.push(i * (columns + 1));
  rim.forEach((a, i) => { const b = rim[(i + 1) % rim.length]; indices.push(a, a + layer, b, b, a + layer, b + layer); });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.userData.authoredSurface = 'sculpted_biomask';
  geometry.userData.maskProfile = bone ? 'bone' : angular ? 'angular' : maskData.shape;
  return geometry;
}

export function createBodyNetSculpt() {
  const parts = [];
  for (const direction of [-1, 1]) for (let strand = 0; strand < 15; strand++) {
    const points = [];
    for (let sample = 0; sample <= 18; sample++) {
      const t = sample / 18, y = -0.65 + t * 2.05;
      const angle = strand / 15 * Math.PI * 2 + direction * t * Math.PI * 1.35;
      const radiusX = 0.9 + Math.sin(t * Math.PI * 0.83) * 0.36;
      const radiusZ = 0.58 + Math.sin(t * Math.PI) * 0.15;
      points.push([Math.sin(angle) * radiusX, y, Math.cos(angle) * radiusZ]);
    }
    parts.push({ geometry: taperedCurve(points, 0.012, { segments: 48, sides: 5, taper: 0 }) });
  }
  const result = mergeSculptParts(parts);
  parts.forEach(({ geometry }) => geometry.dispose());
  result.userData.authoredSurface = 'open_woven_body_net';
  return result;
}
