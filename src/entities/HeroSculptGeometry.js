import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js';

const sculptCache = new Map();
const cachedSculpt = (key, build) => {
  if (!sculptCache.has(key)) sculptCache.set(key, build());
  return sculptCache.get(key).clone();
};

function ellipsoidDistance(x, y, z, center, radius) {
  const px = x - center[0], py = y - center[1], pz = z - center[2];
  const k0 = Math.hypot(px / radius[0], py / radius[1], pz / radius[2]);
  const k1 = Math.hypot(px / (radius[0] ** 2), py / (radius[1] ** 2), pz / (radius[2] ** 2));
  return k1 > 1e-10 ? k0 * (k0 - 1) / k1 : -Math.min(...radius);
}

function capsuleDistance(x, y, z, a, b, ra, rb = ra) {
  const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
  const t = THREE.MathUtils.clamp(((x - a[0]) * dx + (y - a[1]) * dy + (z - a[2]) * dz) / (dx * dx + dy * dy + dz * dz), 0, 1);
  return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy, z - a[2] - t * dz) - THREE.MathUtils.lerp(ra, rb, t);
}

function smoothUnion(a, b, width = 0.055) {
  const h = THREE.MathUtils.clamp(0.5 + 0.5 * (b - a) / width, 0, 1);
  return THREE.MathUtils.lerp(b, a, h) - width * h * (1 - h);
}

// March a signed anatomical field once, then cache it. The resulting tissue is
// one indexed surface across palm/webbing/phalanges, not intersecting tube meshes.
function implicitSculpt(field, min, max, resolution, { craniumUV = false } = {}) {
  const [nx, ny, nz] = resolution, strideY = nx + 1, strideZ = (nx + 1) * (ny + 1);
  const step = max.map((value, axis) => (value - min[axis]) / resolution[axis]);
  const values = new Float32Array((nx + 1) * (ny + 1) * (nz + 1));
  const pointAt = (index) => {
    const iz = Math.floor(index / strideZ), remainder = index - iz * strideZ;
    const iy = Math.floor(remainder / strideY), ix = remainder - iy * strideY;
    return [min[0] + ix * step[0], min[1] + iy * step[1], min[2] + iz * step[2]];
  };
  for (let iz = 0; iz <= nz; iz++) for (let iy = 0; iy <= ny; iy++) for (let ix = 0; ix <= nx; ix++) {
    values[ix + iy * strideY + iz * strideZ] = field(min[0] + ix * step[0], min[1] + iy * step[1], min[2] + iz * step[2]);
  }
  const positions = [], normals = [], indices = [], edges = new Map();
  const interpolate = (a, b) => {
    const key = a < b ? `${a}:${b}` : `${b}:${a}`;
    if (edges.has(key)) return edges.get(key);
    const va = values[a], vb = values[b], t = va / (va - vb);
    const pa = pointAt(a), pb = pointAt(b), p = pa.map((value, axis) => THREE.MathUtils.lerp(value, pb[axis], t));
    const epsilon = 0.001;
    const normal = new THREE.Vector3(
      field(p[0] + epsilon, p[1], p[2]) - field(p[0] - epsilon, p[1], p[2]),
      field(p[0], p[1] + epsilon, p[2]) - field(p[0], p[1] - epsilon, p[2]),
      field(p[0], p[1], p[2] + epsilon) - field(p[0], p[1], p[2] - epsilon),
    ).normalize();
    const index = positions.length / 3;
    positions.push(...p); normals.push(normal.x, normal.y, normal.z);
    edges.set(key, index);
    return index;
  };
  const addTriangle = (a, b, c) => {
    const ab = new THREE.Vector3(positions[b * 3] - positions[a * 3], positions[b * 3 + 1] - positions[a * 3 + 1], positions[b * 3 + 2] - positions[a * 3 + 2]);
    const ac = new THREE.Vector3(positions[c * 3] - positions[a * 3], positions[c * 3 + 1] - positions[a * 3 + 1], positions[c * 3 + 2] - positions[a * 3 + 2]);
    const n = new THREE.Vector3(normals[a * 3], normals[a * 3 + 1], normals[a * 3 + 2]);
    if (ab.cross(ac).dot(n) < 0) indices.push(a, c, b);
    else indices.push(a, b, c);
  };
  const tetrahedra = [[0, 5, 1, 6], [0, 1, 2, 6], [0, 2, 3, 6], [0, 3, 7, 6], [0, 7, 4, 6], [0, 4, 5, 6]];
  for (let iz = 0; iz < nz; iz++) for (let iy = 0; iy < ny; iy++) for (let ix = 0; ix < nx; ix++) {
    const a = ix + iy * strideY + iz * strideZ;
    const cube = [a, a + 1, a + 1 + strideY, a + strideY, a + strideZ, a + strideZ + 1, a + strideZ + 1 + strideY, a + strideZ + strideY];
    for (const tetrahedron of tetrahedra) {
      const inside = [], outside = [];
      for (const corner of tetrahedron) (values[cube[corner]] < 0 ? inside : outside).push(cube[corner]);
      if (inside.length === 0 || inside.length === 4) continue;
      if (inside.length === 1 || inside.length === 3) {
        const apex = inside.length === 1 ? inside[0] : outside[0], others = inside.length === 1 ? outside : inside;
        addTriangle(...others.map((other) => interpolate(apex, other)));
      } else {
        const ac = interpolate(inside[0], outside[0]), ad = interpolate(inside[0], outside[1]);
        const bc = interpolate(inside[1], outside[0]), bd = interpolate(inside[1], outside[1]);
        addTriangle(ac, ad, bc); addTriangle(ad, bd, bc);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);
  // Hands use separate planar palm/back charts. The rounded cranium needs an
  // angular chart: a planar projection collapses its texels at the temples.
  const unfolded = geometry.toNonIndexed(); geometry.dispose();
  const p = unfolded.attributes.position, n = unfolded.attributes.normal, uv = new Float32Array(p.count * 2);
  for (let triangle = 0; triangle < p.count; triangle += 3) {
    if (craniumUV) {
      const longitude = [], latitude = [];
      for (let corner = 0; corner < 3; corner++) {
        const i = triangle + corner;
        // Match the cranial vault's ellipsoid. Two horizontal tile periods
        // balance angular texel density with latitude on a square skin tile.
        const x = p.getX(i) / 0.76, z = (p.getZ(i) + 0.09) / 0.73;
        longitude.push(1 + Math.atan2(x, z) / Math.PI);
        latitude.push(0.5 + Math.atan2((p.getY(i) - 0.27) / 0.83, Math.hypot(x, z)) / Math.PI);
      }
      // Unwrap each face over the rear meridian, never across either temple.
      // Periodic UVs may exceed 2: the shared skin tiles use RepeatWrapping.
      const crossesRear = Math.max(...longitude) - Math.min(...longitude) > 1;
      for (let corner = 0; corner < 3; corner++) {
        const i = triangle + corner;
        uv[i * 2] = longitude[corner] + (crossesRear && longitude[corner] <= 1 ? 2 : 0);
        uv[i * 2 + 1] = latitude[corner];
      }
      continue;
    }
    const front = n.getZ(triangle) + n.getZ(triangle + 1) + n.getZ(triangle + 2) >= 0;
    for (let corner = 0; corner < 3; corner++) {
      const i = triangle + corner, x = (p.getX(i) - min[0]) / (max[0] - min[0]);
      uv[i * 2] = front ? x * 0.48 : 0.52 + (1 - x) * 0.48;
      uv[i * 2 + 1] = (p.getY(i) - min[1]) / (max[1] - min[1]);
    }
  }
  unfolded.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  const result = mergeVertices(unfolded, 0.000001); unfolded.dispose();
  result.userData.authoredSurface = 'continuous_anatomical_field';
  result.userData.uvLayout = craniumUV ? 'ellipsoidal_cranium_rear_seam' : 'front_back_anatomical_charts';
  return result;
}

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
  return cachedSculpt('organic_cranium_v3', () => {
    const field = (x, y, z) => {
      let d = ellipsoidDistance(x, y, z, [0, 0.27, -0.09], [0.76, 0.83, 0.73]);
      d = smoothUnion(d, ellipsoidDistance(x, y, z, [0, -0.43, 0.26], [0.55, 0.4, 0.48]), 0.14);
      for (const side of [-1, 1]) {
        d = smoothUnion(d, ellipsoidDistance(x, y, z, [side * 0.49, 0.04, 0.08], [0.36, 0.52, 0.53]), 0.1);
        d = smoothUnion(d, capsuleDistance(x, y, z, [side * 0.1, 0.42, 0.54], [side * 0.58, 0.44, 0.43], 0.14, 0.11), 0.065);
        d = smoothUnion(d, ellipsoidDistance(x, y, z, [side * 0.43, -0.27, 0.48], [0.25, 0.24, 0.24]), 0.06);
        // True orbital cavities and zygomatic transitions behind the biomask.
        d = Math.max(d, -ellipsoidDistance(x, y, z, [side * 0.3, 0.2, 0.63], [0.21, 0.17, 0.24]));
      }
      return Math.max(d, -ellipsoidDistance(x, y, z, [0, -0.48, 0.63], [0.27, 0.12, 0.27]));
    };
    const geometry = implicitSculpt(field, [-0.98, -0.95, -0.9], [0.98, 1.16, 0.93], [32, 42, 30], { craniumUV: true });
    geometry.userData.anatomicalFeatures = ['cranial_vault', 'temporal_muscles', 'orbital_cavities', 'zygomatic_arches', 'oral_cavity'];
    return geometry;
  });
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
  const clawParts = [];
  const fingers = [];
  for (let finger = 0; finger < 4; finger++) {
    const x = (finger - 1.5) * 0.145, length = [0.57, 0.73, 0.69, 0.52][finger];
    const base = [x, -0.23, 0.035], knuckle = [x * 1.09, -0.23 - length * 0.5, 0.11];
    const distal = [x * 1.08, -0.23 - length * 0.85, 0.22], tip = [x * 1.04, -0.23 - length, 0.3];
    fingers.push({ base, knuckle, distal, tip });
    clawParts.push({ geometry: taperedCurve([tip, [tip[0] * 0.98, tip[1] - 0.1, 0.4], [tip[0] * 0.93, tip[1] - 0.15, 0.5]], 0.052, { segments: 16, sides: 12, taper: 0.99 }) });
  }
  const thumbX = side * -0.26;
  const thumb = [[thumbX, 0, 0.015], [thumbX * 1.55, -0.18, 0.1], [thumbX * 1.65, -0.39, 0.25], [thumbX * 1.48, -0.49, 0.36]];
  clawParts.push({ geometry: taperedCurve([thumb[3], [thumbX * 1.3, -0.57, 0.47], [thumbX, -0.58, 0.55]], 0.061, { segments: 16, sides: 12, taper: 0.99 }) });
  const skin = cachedSculpt(`continuous_hand_${side}`, () => {
    const field = (x, y, z) => {
      let d = ellipsoidDistance(x, y, z, [0, -0.025, 0], [0.285, 0.34, 0.145]);
      d = smoothUnion(d, ellipsoidDistance(x, y, z, [thumbX * 0.72, -0.1, 0.025], [0.2, 0.23, 0.155]), 0.075);
      d = smoothUnion(d, capsuleDistance(x, y, z, [0, 0.16, 0], [0, 0.32, 0], 0.16, 0.15), 0.07);
      for (const finger of fingers) {
        d = smoothUnion(d, capsuleDistance(x, y, z, finger.base, finger.knuckle, 0.079, 0.069), 0.036);
        d = smoothUnion(d, capsuleDistance(x, y, z, finger.knuckle, finger.distal, 0.072, 0.06), 0.02);
        d = smoothUnion(d, capsuleDistance(x, y, z, finger.distal, finger.tip, 0.061, 0.051), 0.018);
        d = smoothUnion(d, ellipsoidDistance(x, y, z, finger.knuckle, [0.077, 0.073, 0.075]), 0.018);
      }
      for (let segment = 0; segment < 3; segment++) d = smoothUnion(d, capsuleDistance(x, y, z, thumb[segment], thumb[segment + 1], 0.105 - segment * 0.018, 0.088 - segment * 0.018), 0.04);
      return d;
    };
    const geometry = implicitSculpt(field, [-0.64, -1.07, -0.23], [0.64, 0.5, 0.5], [34, 46, 24]);
    geometry.userData.digitCount = 5;
    geometry.userData.anatomicalFeatures = ['thenar_eminence', 'palm_webbing', 'five_metacarpals', 'phalangeal_knuckles', 'opposable_thumb'];
    return geometry;
  });
  const claws = mergeSculptParts(clawParts);
  clawParts.forEach(({ geometry }) => geometry.dispose());
  return { skin, claws };
}

/** Four articulated jaws in the HEAD local coordinate system, without a second
 * positioning/rotation transform. side is -1/+1; upper accepts true or +1. */
export function createMandibleSculpt(side, upper = true) {
  const isUpper = upper === true || upper === 1;
  const y = isUpper ? -0.25 : -0.57;
  const points = [[side * 0.36, y, 0.43], [side * 0.61, y - 0.04, 0.62], [side * 0.68, y - 0.1, 0.88], [side * 0.53, y - 0.06, 1.05]];
  const tissue = taperedCurve(points, isUpper ? 0.14 : 0.16, { segments: 32, sides: 16, taper: 0.42, ridges: 0.025 });
  const tusk = taperedCurve([[side * 0.53, y - 0.06, 1.05], [side * 0.37, y + 0.07, 1.16], [side * 0.22, y + 0.14, 1.13]], 0.087, { segments: 24, sides: 16, taper: 0.99 });
  tissue.userData.authoredSurface = 'curved_articulated_mandible';
  tusk.userData.authoredSurface = 'curved_dentine_tusk';
  return { tissue, tusk };
}

function biomaskProfile(maskData) {
  if (['bone', 'kok_viking', 'kwei', 'boar'].includes(maskData.shape)) return 'bone';
  if (['celtic', 'samurai', 'royal', 'guardian', 'warrior', 'armored'].includes(maskData.shape)) return 'angular';
  return maskData.shape;
}

function biomaskDepth(x, y, maskData) {
  const across = Math.min(1, Math.abs(x) / 1.01), p = maskData.geometry ?? {};
  const brow = Math.exp(-Math.pow((y - 0.35) * 11, 2)) * (0.075 + across * 0.085);
  const nose = Math.exp(-x * x * 48) * Math.exp(-Math.pow((y + 0.19) * 2.7, 2)) * 0.18;
  const cheek = Math.exp(-Math.pow((Math.abs(x) - 0.62) * 7, 2) - Math.pow((y + 0.2) * 3.5, 2)) * (p.cheekGuard ?? 0.4) * 0.2;
  const jaw = Math.max(0, -y - 0.45) * ((p.jawLength ?? 1) - 0.6) * 0.16;
  const surface = 0.24 + Math.sqrt(1 - across * across) * 0.36 + brow + nose + cheek + jaw;
  return surface + (biomaskProfile(maskData) === 'bone' ? Math.sin(y * 17 + Math.abs(x) * 8) * 0.012 : 0);
}

function eyeAperture(side) {
  const path = new THREE.Shape();
  path.moveTo(side * 0.13, 0.15);
  path.quadraticCurveTo(side * 0.2, 0.29, side * 0.29, 0.29);
  path.lineTo(side * 0.72, 0.245);
  path.quadraticCurveTo(side * 0.77, 0.17, side * 0.68, 0.095);
  path.quadraticCurveTo(side * 0.42, 0.025, side * 0.2, 0.09);
  path.closePath();
  return path;
}

function ventAperture(side, index, expansion = 1) {
  const path = new THREE.Shape(), centerX = side * (0.21 + index * 0.085), centerY = -0.7 + index * 0.04;
  const angle = side * -0.17, width = 0.032 * expansion, height = 0.22 * expansion, radius = width / 2;
  const points = [];
  for (let cap = 0; cap < 2; cap++) for (let segment = 0; segment <= 8; segment++) {
    const a = segment / 8 * Math.PI + (cap ? Math.PI : 0);
    const x = Math.cos(a) * radius, y = Math.sin(a) * radius + (cap ? -1 : 1) * (height / 2 - radius);
    points.push(new THREE.Vector2(centerX + x * Math.cos(angle) - y * Math.sin(angle), centerY + x * Math.sin(angle) + y * Math.cos(angle)));
  }
  path.setFromPoints(points); path.closePath();
  return path;
}

function biomaskOutline() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 1.12);
  shape.bezierCurveTo(0.46, 1.16, 0.87, 1.04, 0.94, 0.77);
  shape.quadraticCurveTo(1.02, 0.45, 0.91, 0.04);
  shape.lineTo(0.73, -0.39); shape.lineTo(0.42, -0.94);
  shape.quadraticCurveTo(0.23, -1.1, 0, -1.1);
  shape.quadraticCurveTo(-0.23, -1.1, -0.42, -0.94);
  shape.lineTo(-0.73, -0.39); shape.lineTo(-0.91, 0.04);
  shape.quadraticCurveTo(-1.02, 0.45, -0.94, 0.77);
  shape.bezierCurveTo(-0.87, 1.04, -0.46, 1.16, 0, 1.12);
  shape.closePath();
  return shape;
}

function deformBiomaskGeometry(source, maskData, { depth = 0.085, inset = 0 } = {}) {
  const geometry = new TessellateModifier(0.085, 5).modify(source);
  const position = geometry.attributes.position, normal = geometry.attributes.normal;
  const uv = new Float32Array(position.count * 2), profile = maskData.geometry ?? {}, scale = maskData.scale ?? 1;
  const sx = (profile.browWidth ?? 1) * scale, sy = (1 + (profile.crestHeight ?? 0.2) * 0.14) * scale;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i), y = position.getY(i), z = position.getZ(i);
    if (Math.abs(normal.getZ(i)) >= 0.5) {
      uv[i * 2] = (x + 1.05) / 2.1;
      uv[i * 2 + 1] = (y + 1.12) / 2.3;
    } else {
      uv[i * 2] = (Math.atan2(y - 0.05, x) + Math.PI) / (Math.PI * 2);
      uv[i * 2 + 1] = THREE.MathUtils.clamp(z / depth, 0, 1) * 0.08;
    }
    position.setXYZ(i, x * sx, y * sy, (biomaskDepth(x, y, maskData) - depth + z - inset) * scale);
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geometry.deleteAttribute('normal');
  const smooth = mergeVertices(geometry, 0.00001); geometry.dispose();
  smooth.computeVertexNormals();
  return smooth;
}

const biomaskCache = new Map();
function biomaskBundle(maskData) {
  const key = JSON.stringify([maskData.shape, maskData.geometry, maskData.scale]);
  if (biomaskCache.has(key)) return biomaskCache.get(key);
  const shape = biomaskOutline(), eyes = [-1, 1].map(eyeAperture), vents = [];
  for (const side of [-1, 1]) for (let index = 0; index < 4; index++) vents.push(ventAperture(side, index));
  shape.holes.push(...eyes, ...vents);
  const source = new THREE.ExtrudeGeometry(shape, { depth: 0.085, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.014, bevelThickness: 0.012, curveSegments: 16, steps: 1 });
  const shell = deformBiomaskGeometry(source, maskData); source.dispose();
  const p = maskData.geometry ?? {}, scale = maskData.scale ?? 1;
  const transformPoint = (x, y, inset = 0) => [x * (p.browWidth ?? 1) * scale, y * (1 + (p.crestHeight ?? 0.2) * 0.14) * scale, (biomaskDepth(x, y, maskData) - inset) * scale];
  shell.userData = {
    authoredSurface: 'sculpted_biomask', maskProfile: biomaskProfile(maskData),
    topology: 'closed_shell_with_through_eye_sockets_and_vent_slots',
    eyeSocketCount: 2, ventSlotCount: 8, visorInset: 0.14 * scale,
    eyeSocketCenters: [-1, 1].map((side) => transformPoint(side * 0.43, 0.17)),
    ventSlotCenters: [-1, 1].flatMap((side) => [0, 1, 2, 3].map((index) => transformPoint(side * (0.21 + index * 0.085), -0.7 + index * 0.04))),
    uvLayout: 'planar_facial_chart_with_separate_rim_strip',
  };
  const lensSource = new THREE.ExtrudeGeometry(eyes, { depth: 0.018, bevelEnabled: false, curveSegments: 16 });
  const visor = deformBiomaskGeometry(lensSource, maskData, { depth: 0.018, inset: 0.14 }); lensSource.dispose();
  const backingShapes = [];
  for (const side of [-1, 1]) for (let index = 0; index < 4; index++) backingShapes.push(ventAperture(side, index, 1.7));
  const ventSource = new THREE.ExtrudeGeometry(backingShapes, { depth: 0.018, bevelEnabled: false, curveSegments: 8 });
  const ventBacking = deformBiomaskGeometry(ventSource, maskData, { depth: 0.018, inset: 0.14 }); ventSource.dispose();
  const frameParts = [];
  for (const aperture of eyes) {
    const points = aperture.getPoints(32).map((point) => new THREE.Vector3(...transformPoint(point.x, point.y, -0.006)));
    const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal');
    frameParts.push({ geometry: new THREE.TubeGeometry(curve, 72, 0.016 * scale, 8, true) });
  }
  const frame = mergeSculptParts(frameParts); frameParts.forEach(({ geometry }) => geometry.dispose());
  visor.userData.authoredSurface = 'recessed_curved_optical_inserts';
  frame.userData.authoredSurface = 'eye_socket_edge_seals';
  ventBacking.userData.authoredSurface = 'recessed_respirator_backing';
  const result = { shell, visor, frame, vents: ventBacking };
  biomaskCache.set(key, result);
  return result;
}

/** The sculpted shell has genuine through-openings. All coordinates remain in
 * the previous mask-local scale, ready for the head's 0.4064 world scale. */
export function createBiomaskSculpt(maskData) {
  return biomaskBundle(maskData).shell.clone();
}

/** Inserts are in MASK MESH LOCAL coordinates. Parent under maskMesh or copy
 * its transform, never add a second mask offset. Use a dark PBR visor material,
 * mask alloy for frame, and dark non-emissive material for vents. */
export function createBiomaskInserts(maskData) {
  const bundle = biomaskBundle(maskData);
  return { visor: bundle.visor.clone(), frame: bundle.frame.clone(), vents: bundle.vents.clone() };
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
