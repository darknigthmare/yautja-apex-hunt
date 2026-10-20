import * as THREE from 'three';

/**
 * Owned, closed armour surfaces. Dimensions are world units (the game uses
 * metres); UVs preserve that scale instead of stretching every part into 0–1.
 * X = width, Y = height, +Z = front for every part, including the boot. The
 * pauldron sits over a vertical shoulder and needs no -PI/2 plate rotation.
 * Groups: 0 outer shell, 1 machined/bevelled edges, 2 inner lining, 3 outsole.
 */
export const HERO_ARMOR_DIMENSIONS = Object.freeze({
  pauldron: Object.freeze({ width: 0.88, height: 0.64, depth: 0.78 }),
  chest: Object.freeze({ width: 1.62, height: 0.92, depth: 0.30 }),
  pectoral: Object.freeze({ width: 0.70, height: 0.52, depth: 0.22 }),
  abdominal: Object.freeze({ width: 0.68, height: 0.27, depth: 0.14 }),
  gauntlet: Object.freeze({ width: 0.70, height: 0.86, depth: 0.56 }),
  greave: Object.freeze({ width: 0.46, height: 1.05, depth: 0.28 }),
  knee: Object.freeze({ width: 0.50, height: 0.43, depth: 0.24 }),
  boot: Object.freeze({ width: 0.62, height: 0.66, depth: 1.18 }),
});

const TAU = Math.PI * 2;
const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;

function meshData() {
  return { positions: [], uv: [], regions: [[], [], [], []], smoothPairs: [] };
}

function smoothSeam(data, row) {
  data.smoothPairs.push([row[0], row.at(-1)]);
}

function vertex(data, point, uv) {
  const index = data.positions.length / 3;
  data.positions.push(...point);
  data.uv.push(...uv);
  return index;
}

function triangle(data, region, a, b, c) {
  data.regions[region].push(a, b, c);
}

function quad(data, region, a, b, c, d, reverse = false) {
  if (reverse) {
    triangle(data, region, a, c, b);
    triangle(data, region, b, c, d);
  } else {
    triangle(data, region, a, b, c);
    triangle(data, region, b, d, c);
  }
}

function complete(data, kind, dimensions, side) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(data.positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(data.uv, 2));
  const indices = [];
  data.regions.forEach((region, index) => {
    if (!region.length) return;
    geometry.addGroup(indices.length, region.length, index);
    indices.push(...region);
  });
  geometry.setIndex(indices);
  geometry.computeBoundingBox();
  const size = geometry.boundingBox.getSize(new THREE.Vector3());
  const center = geometry.boundingBox.getCenter(new THREE.Vector3());
  geometry.translate(-center.x, -center.y, -center.z);
  geometry.scale(dimensions.width / size.x, dimensions.height / size.y, dimensions.depth / size.z);
  if (side < 0 && (kind === 'pauldron' || kind === 'pectoral')) {
    geometry.scale(-1, 1, 1);
    const index = geometry.index;
    for (let i = 0; i < index.count; i += 3) {
      const b = index.getX(i + 1);
      index.setX(i + 1, index.getX(i + 2));
      index.setX(i + 2, b);
    }
  }
  geometry.computeVertexNormals();
  const normals = geometry.attributes.normal;
  for (const [a, b] of data.smoothPairs) {
    const normal = new THREE.Vector3().fromBufferAttribute(normals, a)
      .add(new THREE.Vector3().fromBufferAttribute(normals, b)).normalize();
    normals.setXYZ(a, normal.x, normal.y, normal.z);
    normals.setXYZ(b, normal.x, normal.y, normal.z);
  }
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.userData.authoredSurface = 'body_fitted_machined_shell';
  geometry.userData.armorKind = kind;
  geometry.userData.materialRegion = kind === 'boot' ? 'armored_foot_with_outsole' : 'fitted_armor_shell';
  geometry.userData.materialRegions = ['outer_metal', 'bevel_edge', 'inner_lining', 'outsole'];
  geometry.userData.dimensions = { ...dimensions };
  geometry.userData.axisConvention = 'X width; Y up; +Z forward';
  geometry.userData.uvUnits = 'metres';
  geometry.userData.side = side < 0 ? -1 : 1;
  return geometry;
}

// Convex plates have an anatomical contour rather than an extruded rectangle.
const OUTLINES = {
  chest: [[0, -0.5], [0.33, -0.46], [0.48, -0.1], [0.5, 0.25], [0.30, 0.5], [0.1, 0.46], [0, 0.34], [-0.1, 0.46], [-0.30, 0.5], [-0.5, 0.25], [-0.48, -0.1], [-0.33, -0.46]],
  pectoral: [[-0.46, -0.3], [-0.04, -0.5], [0.42, -0.27], [0.5, 0.09], [0.32, 0.43], [-0.13, 0.5], [-0.5, 0.2]],
  abdominal: [[-0.36, -0.5], [0.36, -0.5], [0.5, -0.1], [0.46, 0.38], [0.26, 0.5], [-0.26, 0.5], [-0.46, 0.38], [-0.5, -0.1]],
  greave: [[-0.23, -0.5], [0.23, -0.5], [0.35, -0.25], [0.5, 0.26], [0.39, 0.46], [0, 0.5], [-0.39, 0.46], [-0.5, 0.26], [-0.35, -0.25]],
  knee: [[0, -0.5], [0.34, -0.32], [0.5, 0.04], [0.36, 0.38], [0, 0.5], [-0.36, 0.38], [-0.5, 0.04], [-0.34, -0.32]],
};

function outlineAt(points, angle) {
  const dx = Math.cos(angle), dy = Math.sin(angle);
  let best = Infinity;
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    const ex = b[0] - a[0], ey = b[1] - a[1];
    const denominator = dx * ey - dy * ex;
    if (Math.abs(denominator) < 1e-9) continue;
    const distance = (a[0] * ey - a[1] * ex) / denominator;
    const fraction = (a[0] * dy - a[1] * dx) / denominator;
    if (distance > 0 && fraction >= -1e-8 && fraction <= 1 + 1e-8) best = Math.min(best, distance);
  }
  return [dx * best, dy * best];
}

function plateSurface(kind, d) {
  const resolution = { chest: [64, 12], pectoral: [48, 8], abdominal: [40, 5], greave: [48, 10], knee: [48, 8] };
  const data = meshData(), [sides, rings] = resolution[kind];
  const thickness = Math.min(d.depth * 0.25, 0.055);
  const outline = Array.from({ length: sides }, (_, i) => outlineAt(OUTLINES[kind], i / sides * TAU));
  const shape = (x, y) => {
    const across = x * 2, vertical = y * 2;
    const ribCurve = 1 - across * across;
    const longitudinal = Math.max(0, 1 - vertical * vertical);
    if (kind === 'greave') return d.depth * (ribCurve * 0.62 + Math.exp(-across * across * 32) * 0.15 - 0.4);
    if (kind === 'knee') return d.depth * (ribCurve * longitudinal * 0.9 - 0.36);
    const sternum = kind === 'chest' ? Math.exp(-across * across * 45) * 0.11 : 0;
    return d.depth * (ribCurve * (0.62 + longitudinal * 0.25) - sternum - 0.38);
  };
  const sheet = (inner) => {
    const offset = inner ? -thickness : 0;
    const center = vertex(data, [0, 0, shape(0, 0) + offset], [d.width / 2, d.height / 2]);
    const rows = [];
    for (let ring = 1; ring <= rings; ring++) {
      const radial = ring / rings * 0.95;
      const row = outline.map(([x, y]) => vertex(data,
        [x * radial * d.width, y * radial * d.height, shape(x * radial, y * radial) + offset],
        [(x * radial + 0.5) * d.width, (y * radial + 0.5) * d.height]));
      rows.push(row);
      for (let i = 0; i < sides; i++) {
        const next = (i + 1) % sides;
        if (ring === 1) {
          if (inner) triangle(data, 2, center, row[next], row[i]);
          else triangle(data, 0, center, row[i], row[next]);
        } else {
          const prev = rows[ring - 2];
          quad(data, inner ? 2 : 0, prev[i], row[i], prev[next], row[next], inner);
        }
      }
    }
    return rows.at(-1);
  };
  sheet(false);
  sheet(true);
  // Four bevel stations close the rim. Its vertices are independent of the
  // broad face, retaining a real machining seam in the normals.
  const bands = [[0.95, 0], [1, -thickness * 0.22], [1, -thickness * 0.78], [0.95, -thickness]];
  let previous;
  bands.forEach(([radial, offset]) => {
    const row = outline.map(([x, y], i) => vertex(data,
      [x * radial * d.width, y * radial * d.height, shape(x * radial, y * radial) + offset],
      [i / sides * (d.width + d.height) * 2, -offset]));
    if (previous) for (let i = 0; i < sides; i++) {
      const next = (i + 1) % sides;
      quad(data, 1, previous[i], row[i], previous[next], row[next]);
    }
    previous = row;
  });
  return data;
}

function pauldronSurface(d) {
  const data = meshData(), sides = 48, rings = 16;
  const thickness = Math.min(d.width, d.depth) * 0.065;
  const point = (u, t, inset) => {
    const angle = u * TAU;
    const outerDrop = 1.5 + (Math.cos(angle) * 0.5 + 0.5) * 0.42;
    const polar = t * outerDrop;
    const x = Math.cos(angle) * Math.sin(polar) * d.width * 0.5;
    const z = Math.sin(angle) * Math.sin(polar) * d.depth * 0.5;
    const y = d.height * (0.5 - (1 - Math.cos(polar)) / 1.35);
    const normal = new THREE.Vector3(x / (d.width * d.width), (y + d.height * 0.24) / (d.height * d.height), z / (d.depth * d.depth)).normalize();
    return [x - normal.x * inset, y - normal.y * inset, z - normal.z * inset];
  };
  for (const inner of [false, true]) {
    const center = vertex(data, point(0, 0, inner ? thickness : 0), [0, 0]);
    let previous;
    for (let ring = 1; ring <= rings; ring++) {
      const t = ring / rings * 0.95;
      const row = Array.from({ length: sides + 1 }, (_, i) => vertex(data, point(i / sides, t, inner ? thickness : 0),
        [i / sides * Math.PI * (d.width + d.depth) * 0.5, t * d.height]));
      smoothSeam(data, row);
      for (let i = 0; i < sides; i++) {
        if (previous) quad(data, inner ? 2 : 0, previous[i], row[i], previous[i + 1], row[i + 1], !inner);
        else if (inner) triangle(data, 2, center, row[i], row[i + 1]);
        else triangle(data, 0, center, row[i + 1], row[i]);
      }
      previous = row;
    }
  }
  let previous;
  for (const [t, inset] of [[0.95, 0], [1, thickness * 0.22], [1, thickness * 0.78], [0.95, thickness]]) {
    const row = Array.from({ length: sides + 1 }, (_, i) => vertex(data, point(i / sides, t, inset), [i / sides * Math.PI * d.width, inset]));
    smoothSeam(data, row);
    if (previous) for (let i = 0; i < sides; i++) quad(data, 1, previous[i], row[i], previous[i + 1], row[i + 1], true);
    previous = row;
  }
  return data;
}

function gauntletSurface(d) {
  const data = meshData(), sides = 48, rings = 16;
  const thickness = Math.min(d.width, d.depth) * 0.075;
  const point = (u, t, inset) => {
    const angle = u * TAU;
    const flare = 0.73 + t * 0.27 + Math.sin(t * Math.PI) * 0.035;
    const radiusX = d.width * 0.5 * flare - inset;
    const radiusZ = d.depth * 0.5 * (0.78 + t * 0.22) - inset;
    const dorsal = Math.pow(Math.max(0, Math.cos(angle)), 16) * d.depth * 0.07 * Math.sin(t * Math.PI);
    const channel = Math.exp(-Math.pow((Math.abs(Math.sin(angle)) - 0.48) * 18, 2)) * d.depth * 0.018 * Math.sin(t * Math.PI);
    return [Math.sin(angle) * radiusX, (t - 0.5) * d.height, Math.cos(angle) * radiusZ + dorsal - channel];
  };
  for (const inner of [false, true]) {
    let previous;
    for (let ring = 0; ring <= rings; ring++) {
      const t = lerp(0.04, 0.96, ring / rings);
      const row = Array.from({ length: sides + 1 }, (_, i) => vertex(data, point(i / sides, t, inner ? thickness : 0),
        [i / sides * Math.PI * (d.width + d.depth) * 0.5, t * d.height]));
      smoothSeam(data, row);
      if (previous) for (let i = 0; i < sides; i++) quad(data, inner ? 2 : 0, previous[i], row[i], previous[i + 1], row[i + 1], !inner);
      previous = row;
    }
  }
  for (const top of [false, true]) {
    let previous;
    const end = top ? 1 : 0;
    const trim = top ? 0.96 : 0.04;
    for (const [t, inset] of [[trim, 0], [end, thickness * 0.25], [end, thickness * 0.75], [trim, thickness]]) {
      const row = Array.from({ length: sides + 1 }, (_, i) => vertex(data, point(i / sides, t, inset), [i / sides * Math.PI * d.width, inset]));
      smoothSeam(data, row);
      if (previous) for (let i = 0; i < sides; i++) quad(data, 1, previous[i], row[i], previous[i + 1], row[i + 1], top);
      previous = row;
    }
  }
  return data;
}

function bootSurface(d) {
  const data = meshData(), sides = 48, rings = 32;
  const profile = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.30, -0.5, 0.27), new THREE.Vector3(0.36, -0.4, 0.42),
    new THREE.Vector3(0.31, -0.05, 0.5), new THREE.Vector3(0.46, 0.25, 0.02),
    new THREE.Vector3(0.50, 0.37, -0.12), new THREE.Vector3(0.36, 0.5, -0.23),
  ]);
  const point = (u, t) => {
    const p = profile.getPoint(t), angle = u * TAU;
    const x = Math.sin(angle) * p.x * d.width;
    const arch = Math.exp(-Math.pow((p.y + 0.06) * 6, 2)) * 0.07;
    const bottom = (-0.5 + arch) * d.height;
    const top = p.z * d.height;
    let y = lerp(bottom, top, (Math.cos(angle) + 1) * 0.5);
    if (Math.cos(angle) < -0.45) y = bottom;
    const toe = clamp((p.y - 0.20) / 0.25, 0, 1);
    const flex = Math.exp(-Math.pow((p.y - 0.12) * 35, 2)) * 0.024;
    y -= d.height * Math.pow(Math.max(0, Math.cos(angle)), 4) * (flex + toe * 0.012 * Math.cos(x / d.width * Math.PI * 8));
    return [x, y, p.y * d.depth];
  };
  const rows = [];
  for (let ring = 0; ring <= rings; ring++) {
    const t = ring / rings;
    const row = Array.from({ length: sides + 1 }, (_, i) => {
      const p = point(i / sides, t);
      return vertex(data, p, [i / sides * Math.PI * d.width, p[2] + d.depth / 2]);
    });
    smoothSeam(data, row);
    if (ring) for (let i = 0; i < sides; i++) {
      const bottom = Math.cos((i + 0.5) / sides * TAU) < -0.45;
      quad(data, bottom ? 3 : 0, rows[ring - 1][i], row[i], rows[ring - 1][i + 1], row[i + 1]);
    }
    rows.push(row);
  }
  for (const front of [false, true]) {
    const points = Array.from({ length: sides + 1 }, (_, i) => point(i / sides, front ? 1 : 0));
    const center = points.slice(0, sides).reduce((sum, p) => sum.map((value, i) => value + p[i] / sides), [0, 0, 0]);
    const centerIndex = vertex(data, center, [d.width / 2, d.height / 2]);
    const rim = points.map(p => vertex(data, p, [p[0] + d.width / 2, p[1] + d.height / 2]));
    for (let i = 0; i < sides; i++) {
      if (front) triangle(data, 1, centerIndex, rim[i + 1], rim[i]);
      else triangle(data, 1, centerIndex, rim[i], rim[i + 1]);
    }
  }
  return data;
}

export function createHeroArmorGeometry(kind, { side = -1, width, height, depth } = {}) {
  const defaults = HERO_ARMOR_DIMENSIONS[kind];
  if (!defaults) throw new RangeError(`Unknown fitted hero armour: ${String(kind)}`);
  const dimensions = { width: width ?? defaults.width, height: height ?? defaults.height, depth: depth ?? defaults.depth };
  if (Object.values(dimensions).some(value => !Number.isFinite(value) || value <= 0)) {
    throw new RangeError('Armour dimensions must be positive finite world units.');
  }
  const data = kind === 'pauldron' ? pauldronSurface(dimensions)
    : kind === 'gauntlet' ? gauntletSurface(dimensions)
      : kind === 'boot' ? bootSurface(dimensions) : plateSurface(kind, dimensions);
  return complete(data, kind, dimensions, side);
}
