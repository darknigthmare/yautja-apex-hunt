import * as THREE from 'three';

const SIZE = 128;
const TAU = Math.PI * 2;
const fields = new Map();
const textures = new Map();
const KINDS = new Set(['metal', 'skin', 'stone', 'soil', 'sand', 'resin', 'fabric', 'bone', 'foliage', 'ice', 'wood']);

function hash(x, y, seed) {
  let value = Math.imul(x + seed * 17, 374761393) ^ Math.imul(y + seed * 31, 668265263);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function noise(u, v, frequency, seed) {
  const x = u * frequency;
  const y = v * frequency;
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const sx = x - ix;
  const sy = y - iy;
  const tx = sx * sx * (3 - 2 * sx);
  const ty = sy * sy * (3 - 2 * sy);
  const wrap = (value) => ((value % frequency) + frequency) % frequency;
  const sample = (a, b) => hash(wrap(a), wrap(b), seed);
  return THREE.MathUtils.lerp(
    THREE.MathUtils.lerp(sample(ix, iy), sample(ix + 1, iy), tx),
    THREE.MathUtils.lerp(sample(ix, iy + 1), sample(ix + 1, iy + 1), tx), ty,
  );
}

function surfaceHeight(kind, u, v) {
  const broad = noise(u, v, 4, 11);
  const middle = noise(u, v, 16, 23);
  const fine = noise(u, v, 48, 37);
  switch (kind) {
    case 'metal': return middle * 0.08 + fine * 0.035 + Math.sin(u * TAU * 48 + Math.sin(v * TAU * 2) * 0.4) * 0.045;
    case 'skin': return broad * 0.12 - Math.pow(fine, 4) * 0.28 + middle * 0.055;
    case 'sand': return Math.sin((u * 12 + Math.sin(v * TAU * 2) * 0.18) * TAU) * 0.12 + fine * 0.045;
    case 'resin': return Math.abs(Math.sin(u * TAU * 8 + Math.sin(v * TAU * 2) * 0.9)) * 0.22 + middle * 0.12;
    case 'fabric': return Math.sin(u * TAU * 32) * Math.sin(v * TAU * 32) * 0.06 + fine * 0.025;
    case 'bone': return broad * 0.18 + Math.sin(u * TAU * 14 + Math.sin(v * TAU) * 0.15) * 0.045 + fine * 0.04;
    case 'foliage': return Math.cos(u * TAU) * 0.12 + Math.sin((u + v * 0.5) * TAU * 12) * 0.035;
    case 'wood': return Math.sin((u * 10 + broad * 0.35) * TAU) * 0.17 + fine * 0.045;
    case 'ice': return broad * 0.18 + Math.abs(middle - 0.5) * 0.32 + fine * 0.025;
    case 'soil': return broad * 0.26 + middle * 0.27 + fine * 0.24;
    default: return broad * 0.3 + middle * 0.3 + fine * 0.12;
  }
}

function getField(kind) {
  if (fields.has(kind)) return fields.get(kind);
  const height = new Float32Array(SIZE * SIZE);
  const normal = new Uint8Array(SIZE * SIZE * 4);
  const roughness = new Float32Array(SIZE * SIZE);
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) height[y * SIZE + x] = surfaceHeight(kind, x / SIZE, y / SIZE);
  }
  const at = (x, y) => height[((y + SIZE) % SIZE) * SIZE + (x + SIZE) % SIZE];
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      const index = y * SIZE + x;
      const dx = (at(x + 1, y) - at(x - 1, y)) * 3;
      const dy = (at(x, y + 1) - at(x, y - 1)) * 3;
      const length = Math.hypot(dx, dy, 1);
      const offset = index * 4;
      normal[offset] = Math.round((-dx / length * 0.5 + 0.5) * 255);
      normal[offset + 1] = Math.round((-dy / length * 0.5 + 0.5) * 255);
      normal[offset + 2] = Math.round((1 / length * 0.5 + 0.5) * 255);
      normal[offset + 3] = 255;
      // A separate material response field; never interpret baked albedo shadows
      // as height. Every profile remains seamless and independent of asset colour.
      roughness[index] = noise(x / SIZE, y / SIZE, kind === 'metal' ? 32 : 8, 53) * 0.7
        + noise(x / SIZE, y / SIZE, 40, 71) * 0.3;
    }
  }
  const field = { normal, roughness };
  fields.set(kind, field);
  return field;
}

function textureFor(kind, channel, repeat, strength) {
  const key = `${kind}:${channel}:${repeat.join(',')}:${channel === 'roughness' ? strength : ''}`;
  if (textures.has(key)) return textures.get(key);
  const field = getField(kind);
  let data = field.normal;
  if (channel === 'roughness') {
    data = new Uint8Array(SIZE * SIZE * 4);
    for (let index = 0; index < SIZE * SIZE; index += 1) {
      const value = Math.round((1 - strength * field.roughness[index]) * 255);
      data[index * 4] = data[index * 4 + 1] = data[index * 4 + 2] = value;
      data[index * 4 + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, SIZE, SIZE, THREE.RGBAFormat);
  texture.name = `surface-detail-${kind}-${channel}`;
  texture.userData.sessionShared = true;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(...repeat);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  texture.colorSpace = THREE.NoColorSpace;
  texture.needsUpdate = true;
  textures.set(key, texture);
  return texture;
}

/** Add shared, generated microgeometry and material response to a PBR material.
 * Does not change colour, albedo, scalar roughness, metalness or customisation.
 * Textures are session-shared; disposing a material does not dispose this cache.
 */
export function applySurfaceDetail(material, {
  kind = 'stone', repeat, normalStrength = 0.55, roughnessStrength = 0.35,
} = {}) {
  if (Array.isArray(material)) {
    material.forEach((entry) => applySurfaceDetail(entry, { kind, repeat, normalStrength, roughnessStrength }));
    return material;
  }
  if (!material?.isMeshStandardMaterial) return material;
  const profile = KINDS.has(kind) ? kind : 'stone';
  const inherited = material.map?.repeat;
  const requested = Array.isArray(repeat) ? [repeat[0], repeat[1] ?? repeat[0]]
    : Number.isFinite(repeat) ? [repeat, repeat] : [inherited?.x ?? 1, inherited?.y ?? 1];
  const tiling = requested
    .map((value) => Number.isFinite(value) && value > 0 ? Math.round(value * 1000) / 1000 : 1);
  const response = THREE.MathUtils.clamp(Number(roughnessStrength) || 0, 0, 0.9);
  const normal = THREE.MathUtils.clamp(Number(normalStrength) || 0, 0, 2);
  material.normalMap = textureFor(profile, 'normal', tiling, response);
  material.normalScale.set(normal, normal);
  material.roughnessMap = textureFor(profile, 'roughness', tiling, response);
  material.userData.surfaceDetail = { kind: profile, normalStrength: normal, roughnessStrength: response };
  material.needsUpdate = true;
  return material;
}

export function getSurfaceDetailStats() {
  return { profileCount: fields.size, textureCount: textures.size, textureBytes: textures.size * SIZE * SIZE * 4 };
}

/** Call only when shutting down the entire rendering session. */
export function disposeSurfaceDetailCache() {
  textures.forEach((texture) => texture.dispose());
  textures.clear();
  fields.clear();
}
