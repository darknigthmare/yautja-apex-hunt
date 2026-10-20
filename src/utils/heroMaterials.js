import * as THREE from 'three';

const TAU = Math.PI * 2;
const fields = new Map();
const textures = new Map();
const PROFILES = Object.freeze({
  skin: { color: 0xb2ae88, roughness: 0.7, metalness: 0, normal: 0.38, resolution: 1024, cavity: 0.2, specularIntensity: 0.38, ior: 1.42, clearcoat: 0.025, clearcoatRoughness: 0.72 },
  mask: { color: 0xa5aaa6, roughness: 0.42, metalness: 1, normal: 0.14, resolution: 512, cavity: 0.24, specularIntensity: 1, ior: 1.5 },
  armor: { color: 0x7e8985, roughness: 0.64, metalness: 1, normal: 0.28, resolution: 512, cavity: 0.28, specularIntensity: 0.6, ior: 1.48 },
  edgeMetal: { color: 0xbfc8c9, roughness: 0.22, metalness: 1, normal: 0.12, resolution: 512, cavity: 0.1, specularIntensity: 1, ior: 1.5 },
  leather: { color: 0x66513b, roughness: 0.86, metalness: 0, normal: 0.44, resolution: 512, cavity: 0.3, specularIntensity: 0.35, ior: 1.45 },
  bone: { color: 0xd7c7a0, roughness: 0.69, metalness: 0, normal: 0.32, resolution: 512, cavity: 0.22, specularIntensity: 0.3, ior: 1.48 },
  dread: { color: 0x282a28, roughness: 0.71, metalness: 0, normal: 0.3, resolution: 512, cavity: 0.22, specularIntensity: 0.4, ior: 1.48, clearcoat: 0.07, clearcoatRoughness: 0.65 },
  rubber: { color: 0x252a29, roughness: 0.91, metalness: 0, normal: 0.3, resolution: 512, cavity: 0.24, specularIntensity: 0.22, ior: 1.43 },
});

const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, value));
const smooth = (low, high, value) => {
  const t = clamp((value - low) / (high - low));
  return t * t * (3 - 2 * t);
};

function hash(x, y, seed) {
  let value = Math.imul(x + seed * 31, 374761393) ^ Math.imul(y + seed * 53, 668265263);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function periodicNoise(u, v, nx, ny, seed) {
  const x = u * nx, y = v * ny;
  const ix = Math.floor(x), iy = Math.floor(y);
  const tx = smooth(0, 1, x - ix), ty = smooth(0, 1, y - iy);
  const sample = (a, b) => hash(((a % nx) + nx) % nx, ((b % ny) + ny) % ny, seed);
  const bottom = sample(ix, iy) * (1 - tx) + sample(ix + 1, iy) * tx;
  const top = sample(ix, iy + 1) * (1 - tx) + sample(ix + 1, iy + 1) * tx;
  return bottom * (1 - ty) + top * ty;
}

// This is a material tile, not an anatomical bake. Every visible pore, score,
// raised grain and worn patch below also drives its normal/material response.
// It deliberately does not infer depth from the brightness of an albedo image.
function generateField(region, size) {
  const key = `${region}:${size}`;
  if (fields.has(key)) return fields.get(key);
  const count = size * size;
  const heights = new Float32Array(count);
  const albedo = new Uint8Array(count * 4);
  const normal = new Uint8Array(count * 4);
  const orm = new Uint8Array(count * 4);
  const profile = PROFILES[region];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = x / size, v = y / size;
      const macro = periodicNoise(u, v, 5, 5, 13);
      const grain = periodicNoise(u, v, 53, 47, 29);
      const fine = periodicNoise(u, v, 127, 113, 43);
      const pore = Math.pow(smooth(0.5, 0.92, grain), 3);
      const brushed = Math.sin((u * 113 + Math.sin(v * TAU * 3) * 0.025) * TAU);
      let height = 0, brightness = 0.94, rough = 0.9, metal = 0, cavity = 0;
      let red = 1, green = 1, blue = 1;
      switch (region) {
        case 'skin': {
          const crease = Math.pow(0.5 + 0.5 * Math.sin((v * 9 + periodicNoise(u, v, 3, 4, 61) * 0.8) * TAU), 16);
          height = macro * 0.1 + fine * 0.035 - pore * 0.13 - crease * 0.045;
          brightness = 0.9 + macro * 0.075 - pore * 0.045;
          rough = 0.79 + grain * 0.2 + crease * 0.025;
          cavity = pore * 0.2 + crease * 0.22;
          red = 1; green = 0.985; blue = 0.945 + macro * 0.025;
          break;
        }
        case 'mask': {
          const score = Math.pow(0.5 + brushed * 0.5, 22) * (0.25 + grain * 0.75);
          const pits = Math.pow(smooth(0.66, 0.94, fine), 3);
          height = grain * 0.008 - score * 0.006 - pits * 0.012;
          brightness = 0.94 + macro * 0.045 - pits * 0.035;
          rough = 0.86 + grain * 0.08 + pits * 0.02;
          metal = 0.94 + macro * 0.06;
          cavity = pits * 0.7;
          blue = 0.985;
          break;
        }
        case 'armor': {
          const chip = smooth(0.84, 0.95, periodicNoise(u, v, 40, 44, 73) + fine * 0.04);
          const scratch = Math.pow(0.5 + 0.5 * Math.sin((u * 37 + v * 11) * TAU), 32) * smooth(0.54, 0.72, grain);
          height = grain * 0.012 - chip * 0.024 - scratch * 0.012;
          brightness = 0.94 + macro * 0.045 - chip * 0.05 - scratch * 0.012;
          rough = (0.86 + grain * 0.13) * (1 - chip) + (0.64 + fine * 0.2) * chip;
          metal = 0.04 + chip * 0.96;
          cavity = chip * 0.22 + scratch * 0.32;
          break;
        }
        case 'edgeMetal': {
          const scratch = Math.pow(0.5 + brushed * 0.5, 28);
          height = fine * 0.012 - scratch * 0.018;
          brightness = 0.95 + macro * 0.04 - scratch * 0.025;
          rough = 0.62 + grain * 0.3 + scratch * 0.08;
          metal = 1;
          cavity = scratch * 0.15;
          break;
        }
        case 'leather': {
          const fold = Math.pow(smooth(0.48, 0.85, periodicNoise(u, v, 8, 13, 83)), 3);
          height = (grain - 0.5) * 0.085 - pore * 0.065 - fold * 0.12;
          brightness = 0.91 + macro * 0.07 - fold * 0.105 - pore * 0.025;
          rough = 0.82 + grain * 0.15 - fold * 0.035;
          cavity = pore * 0.15 + fold * 0.6;
          green = 0.985; blue = 0.96;
          break;
        }
        case 'bone': {
          const growth = Math.sin((u * 19 + Math.sin(v * TAU * 2) * 0.1) * TAU);
          const voids = Math.pow(smooth(0.7, 0.94, fine), 3);
          height = growth * 0.025 + grain * 0.018 - voids * 0.07;
          brightness = 0.94 + macro * 0.045 - voids * 0.12;
          rough = 0.76 + grain * 0.21 + voids * 0.03;
          cavity = voids * 0.6;
          green = 0.988; blue = 0.94 + macro * 0.025;
          break;
        }
        case 'dread': {
          const ridges = Math.sin((u * 17 + Math.sin(v * TAU * 2) * 0.13) * TAU);
          const cuts = Math.pow(smooth(0.58, 0.9, grain), 3);
          height = ridges * 0.075 + fine * 0.018 - cuts * 0.025;
          brightness = 0.9 + macro * 0.075 - cuts * 0.035;
          rough = 0.8 + grain * 0.15 + (1 - ridges) * 0.025;
          cavity = (1 - ridges) * 0.12;
          blue = 0.99;
          break;
        }
        default: {
          const grip = Math.sin((u * 27 + v * 21) * TAU) * Math.sin((u * 27 - v * 21) * TAU);
          height = Math.max(0, grip) * 0.055 + grain * 0.025;
          brightness = 0.92 + macro * 0.04 + grip * 0.012;
          rough = 0.83 + grain * 0.13;
          cavity = Math.max(0, -grip) * 0.1;
        }
      }
      const index = y * size + x, offset = index * 4;
      heights[index] = height;
      // Albedo contains pigment/micro-cavity variation, no directional lighting,
      // photographic highlights or copied scene shadows. Palette remains a tint.
      albedo[offset] = Math.round(clamp(brightness * red) * 255);
      albedo[offset + 1] = Math.round(clamp(brightness * green) * 255);
      albedo[offset + 2] = Math.round(clamp(brightness * blue) * 255);
      albedo[offset + 3] = 255;
      orm[offset] = Math.round(clamp(1 - cavity * profile.cavity) * 255);
      orm[offset + 1] = Math.round(clamp(rough) * 255);
      orm[offset + 2] = Math.round(clamp(metal) * 255);
      orm[offset + 3] = 255;
    }
  }
  const at = (x, y) => heights[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      // The derivative scale is resolution-independent. A 1024 tile refines the
      // same relief rather than making it shallower than its 512 counterpart.
      const dx = (at(x + 1, y) - at(x - 1, y)) * size / 64;
      const dy = (at(x, y + 1) - at(x, y - 1)) * size / 64;
      const length = Math.hypot(dx, dy, 1), offset = (y * size + x) * 4;
      normal[offset] = Math.round((-dx / length * 0.5 + 0.5) * 255);
      normal[offset + 1] = Math.round((-dy / length * 0.5 + 0.5) * 255);
      normal[offset + 2] = Math.round((1 / length * 0.5 + 0.5) * 255);
      normal[offset + 3] = 255;
    }
  }
  const result = { albedo, normal, orm };
  fields.set(key, result);
  return result;
}

function textureFor(region, size, channel, repeat) {
  const key = `${region}:${size}:${channel}:${repeat.join(',')}`;
  if (textures.has(key)) return textures.get(key);
  const texture = new THREE.DataTexture(generateField(region, size)[channel], size, size, THREE.RGBAFormat);
  texture.name = `hero-${region}-${channel}-${size}`;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(...repeat);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 8;
  texture.colorSpace = channel === 'albedo' ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  texture.userData.sessionShared = true;
  texture.userData.heroSurface = { region, channel, resolution: size };
  texture.needsUpdate = true;
  textures.set(key, texture);
  return texture;
}

/** Dedicated hero material tiles. Albedo/normal/ORM share one authored field.
 * baseColorMap can replace the neutral generated albedo with an actual asset.
 * This does not claim an anatomical bake or subsurface scattering.
 */
export function createHeroMaterial(region, options = {}) {
  const kind = Object.hasOwn(PROFILES, region) ? region : 'armor';
  const profile = PROFILES[kind];
  const {
    baseColorMap, referenceColor, resolution = profile.resolution, repeat,
    color = profile.color,
    roughness = options.roughnessMap ? 1 : profile.roughness,
    metalness = options.metalnessMap ? 1 : profile.metalness,
    normalStrength = options.normalMap ? 1 : profile.normal, ...physicalOptions
  } = options;
  const size = resolution >= 1024 ? 1024 : 512;
  const source = baseColorMap ?? physicalOptions.map;
  const inherited = source?.repeat;
  const requested = Array.isArray(repeat) ? [repeat[0], repeat[1] ?? repeat[0]]
    : Number.isFinite(repeat) ? [repeat, repeat] : [inherited?.x ?? 1, inherited?.y ?? 1];
  const tiling = requested.map(value => Number.isFinite(value) && value > 0 ? Math.round(value * 1000) / 1000 : 1);
  const needsPacked = !physicalOptions.roughnessMap || !physicalOptions.aoMap
    || (metalness !== 0 && !physicalOptions.metalnessMap);
  const packed = needsPacked ? textureFor(kind, size, 'orm', tiling) : null;
  const material = new THREE.MeshPhysicalMaterial({
    specularIntensity: profile.specularIntensity,
    ior: profile.ior,
    clearcoat: profile.clearcoat ?? 0,
    clearcoatRoughness: profile.clearcoatRoughness ?? 0.7,
    ...physicalOptions,
    color, roughness, metalness, transmission: 0,
    map: source ?? textureFor(kind, size, 'albedo', tiling),
    normalMap: physicalOptions.normalMap ?? textureFor(kind, size, 'normal', tiling),
    roughnessMap: physicalOptions.roughnessMap ?? packed,
    metalnessMap: physicalOptions.metalnessMap ?? packed,
    aoMap: physicalOptions.aoMap ?? packed,
    aoMapIntensity: physicalOptions.aoMapIntensity ?? (physicalOptions.aoMap ? 1 : 0.45),
  });
  // Generated ORM is mapped in UV0, which is available on the current hero.
  // This is local material micro-cavity, not a baked anatomical AO/UV1 claim.
  if (physicalOptions.normalScale?.isVector2) material.normalScale.copy(physicalOptions.normalScale);
  else material.normalScale.set(normalStrength, normalStrength);
  material.userData.heroSurface = {
    region: kind, resolution: size, repeat: tiling, albedoSource: source ? 'provided' : 'generated',
    albedoTintMode: source && referenceColor != null ? 'reference-relative' : 'direct',
    roughness, metalness, normalStrength,
    channels: { albedo: 'sRGB', normal: 'linear', orm: 'R:microAO G:roughness B:metalness' },
  };
  if (source && referenceColor != null) {
    const reference = new THREE.Color(referenceColor);
    const previousCompile = material.onBeforeCompile;
    material.onBeforeCompile = function(shader, renderer) {
      previousCompile.call(this, shader, renderer);
      shader.uniforms.heroReferenceColor = { value: reference };
      shader.fragmentShader = `uniform vec3 heroReferenceColor;\n${shader.fragmentShader}`;
      shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
        #include <color_fragment>
        // Retain the public palette exactly; tint a painted albedo relative to
        // its reference palette instead of multiplying it by a second pigment.
        vec3 heroRelativeTint = clamp(diffuse / max(heroReferenceColor, vec3(0.025)), vec3(0.18), vec3(2.5));
        diffuseColor.rgb *= heroRelativeTint / max(diffuse, vec3(0.00001));
      `);
    };
    material.customProgramCacheKey = () => `hero-reference-tint-v1-${kind}`;
    material.userData.heroSurface.referenceColor = reference.getHex();
  }
  material.userData.appearanceBaseMap = material.map;
  return material;
}

export function getHeroMaterialStats() {
  return { fieldCount: fields.size, textureCount: textures.size, baseTextureBytes: [...textures.values()].reduce((sum, texture) => sum + texture.image.data.byteLength, 0) };
}

/** Session shutdown only; hero parts share these texture allocations. */
export function disposeHeroMaterialCache() {
  textures.forEach(texture => texture.dispose());
  textures.clear();
  fields.clear();
}
