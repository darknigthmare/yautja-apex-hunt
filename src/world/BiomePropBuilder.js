import * as THREE from 'three';

const BIOME_ACCENTS = Object.freeze({
  jungle: 0x5dffbd,
  hive_lv426: 0xb7ff45,
  ryushi_desert: 0xffbd55,
  yautja_prime: 0xff4a24,
  genna_deathworld: 0xb8ff5c,
});

const SURFACE_COLORS = Object.freeze({
  frontier: 0x9b7044,
  hive: 0x394538,
  bronze: 0x4c3024,
  genna: 0x334a43,
  bone: 0xb8a67b,
  stone: 0x59616b,
});

function textureColor(path = '') {
  if (path.includes('frontier')) return SURFACE_COLORS.frontier;
  if (path.includes('membrane') || path.includes('hive') || path.includes('egg')) return SURFACE_COLORS.hive;
  if (path.includes('bronze') || path.includes('alloy')) return SURFACE_COLORS.bronze;
  if (path.includes('genna') || path.includes('flora')) return SURFACE_COLORS.genna;
  if (path.includes('bone')) return SURFACE_COLORS.bone;
  return SURFACE_COLORS.stone;
}

function addMesh(group, geometry, material, {
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  castShadow = true,
  receiveShadow = true,
  name = '',
} = {}) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...scale);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
  mesh.name = name;
  group.add(mesh);
  return mesh;
}

function addInstancedMesh(group, geometry, material, transforms, {
  name = '',
  castShadow = true,
  receiveShadow = true,
} = {}) {
  const mesh = new THREE.InstancedMesh(geometry, material, transforms.length);
  const dummy = new THREE.Object3D();
  transforms.forEach((transform, index) => {
    dummy.position.set(...(transform.position ?? [0, 0, 0]));
    dummy.rotation.set(...(transform.rotation ?? [0, 0, 0]));
    dummy.scale.set(...(transform.scale ?? [1, 1, 1]));
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  });
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
  mesh.name = name;
  mesh.userData.instancedDetail = true;
  group.add(mesh);
  return mesh;
}

function applyPlanTransform(group, spec) {
  group.position.set(...spec.position);
  group.rotation.y = Number(spec.rotation) || 0;
  const scale = Number(spec.scale) || 1;
  group.scale.setScalar(scale);
}

function estimateRenderCost(root) {
  let drawCallEstimate = 0;
  let triangleEstimate = 0;
  root.traverse((object) => {
    if (!object.isMesh) return;
    drawCallEstimate += Array.isArray(object.material) ? object.material.length : 1;
    const geometry = object.geometry;
    if (!geometry) return;
    const triangles = geometry.index
      ? geometry.index.count / 3
      : (geometry.attributes.position?.count ?? 0) / 3;
    triangleEstimate += triangles * (object.isInstancedMesh ? object.count : 1);
  });
  return { drawCallEstimate, triangleEstimate: Math.ceil(triangleEstimate) };
}

function tagVisual(group, variant, signature) {
  group.userData.visualVariant = variant;
  group.userData.visualSignature = signature;
  return group;
}

export function getCoverClusterLayout(instanceCount = 5) {
  const count = Math.max(3, Math.min(12, Number(instanceCount) || 5));
  return Array.from({ length: count }, (_, index) => {
    const angle = -0.55 + (index / Math.max(1, count - 1)) * 1.1;
    return {
      angle,
      x: Math.sin(angle) * 7.5,
      z: Math.cos(angle) * 3.2,
      wedgeScale: [
        1 + (index % 2) * 0.22,
        0.8 + (index % 3) * 0.12,
        1,
      ],
      capstoneScale: 0.72 + (index % 3) * 0.1,
    };
  });
}

export class BiomePropBuilder {
  constructor({ createTexturedMaterial }) {
    this.createTexturedMaterial = createTexturedMaterial;
    this.geometryCache = new Map();
    this.materialCache = new Map();
  }

  geometry(key, factory) {
    if (!this.geometryCache.has(key)) this.geometryCache.set(key, factory());
    return this.geometryCache.get(key);
  }

  material(path, options = {}) {
    const key = `${path}:${JSON.stringify(options)}`;
    if (!this.materialCache.has(key)) {
      this.materialCache.set(key, this.createTexturedMaterial({
        color: textureColor(path),
        path,
        repeat: 2.5,
        roughness: 0.72,
        metalness: path.includes('frontier') || path.includes('bronze') || path.includes('alloy') ? 0.56 : 0.08,
        ...options,
      }));
    }
    return this.materialCache.get(key);
  }

  createMaterials(plan) {
    const accent = BIOME_ACCENTS[plan.biomeId] ?? 0x66ffee;
    const materials = {
      signal: new THREE.MeshStandardMaterial({
        color: accent,
        emissive: accent,
        emissiveIntensity: 1.35,
        roughness: 0.28,
        metalness: 0.18,
      }),
      dark: new THREE.MeshStandardMaterial({ color: 0x171b20, roughness: 0.64, metalness: 0.72 }),
    };
    const loaded = Object.create(null);
    const lazyMaterial = (name, factory) => {
      Object.defineProperty(materials, name, {
        configurable: false,
        enumerable: true,
        get() {
          if (!loaded[name]) loaded[name] = factory();
          return loaded[name];
        },
      });
    };
    lazyMaterial('bone', () => this.material('/assets/textures/trophy-bone.webp', {
      color: 0xb8a67b,
      roughness: 0.88,
      metalness: 0.02,
    }));
    lazyMaterial('membrane', () => this.material('/assets/textures/hive-biomechanical-membrane.webp', {
      color: 0x394538,
      roughness: 0.36,
      metalness: 0.18,
    }));
    lazyMaterial('spore', () => this.material('/assets/textures/genna-spore-pod-hide.webp', {
      color: 0x334a43,
      roughness: 0.62,
      emissive: 0x32144a,
      emissiveIntensity: 0.34,
    }));
    Object.defineProperty(materials, 'isLoaded', {
      enumerable: false,
      value: (name) => Boolean(loaded[name]),
    });
    return materials;
  }

  createArch(spec, materials) {
    const group = new THREE.Group();
    const isOrganic = ['hive_bulkhead', 'bone_arch'].includes(spec.type);
    const surface = isOrganic
      ? spec.type === 'bone_arch' ? materials.bone : materials.membrane
      : this.material(spec.texture);
    const support = isOrganic
      ? this.geometry('arch-organic-support', () => new THREE.CylinderGeometry(1.25, 2.2, 12, 7))
      : this.geometry('arch-metal-support', () => new THREE.BoxGeometry(2.8, 12, 3.4));
    const lintel = isOrganic
      ? this.geometry('arch-organic-lintel', () => new THREE.TorusGeometry(6.1, 1.25, 7, 18, Math.PI))
      : this.geometry('arch-metal-lintel', () => new THREE.BoxGeometry(14.4, 2.4, 3.8));
    addMesh(group, support, surface, { position: [-5.6, 6, 0], rotation: [0, 0, isOrganic ? -0.16 : 0], name: `${spec.id}-left-support` });
    addMesh(group, support, surface, { position: [5.6, 6, 0], rotation: [0, 0, isOrganic ? 0.16 : 0], name: `${spec.id}-right-support` });
    addMesh(group, lintel, surface, { position: [0, isOrganic ? 10.8 : 12.4, 0], name: `${spec.id}-lintel` });
    addMesh(group, this.geometry('arch-marker', () => new THREE.OctahedronGeometry(1.1, 0)), materials.signal, {
      position: [0, 14.1, 0.35], castShadow: false, name: `${spec.id}-marker`,
    });
    for (const x of [-3.7, 0, 3.7]) {
      addMesh(group, this.geometry('arch-rune', () => new THREE.BoxGeometry(1.8, 0.28, 0.18)), materials.signal, {
        position: [x, 11.9, 2], rotation: [0, 0, x * 0.025], castShadow: false,
      });
    }
    return tagVisual(group, spec.type, isOrganic ? 'organic-bifurcated-arch' : 'runed-monumental-gate');
  }

  createFacility(spec, materials) {
    const group = new THREE.Group();
    const surface = this.material(spec.texture);
    const box = (key, size) => this.geometry(key, () => new THREE.BoxGeometry(...size));
    const cylinder = (key, top, bottom, height, segments = 10) => this.geometry(key, () => new THREE.CylinderGeometry(top, bottom, height, segments));

    if (spec.type === 'field_camp') {
      addMesh(group, box('camp-deck', [15, 0.7, 10]), surface, { position: [0, 0.35, 0], name: `${spec.id}-deck` });
      addMesh(group, box('camp-canopy', [13.8, 0.45, 8.8]), surface, { position: [0, 6.2, 0], rotation: [0.08, 0, -0.05], name: `${spec.id}-canopy` });
      addInstancedMesh(group, cylinder('camp-post', 0.16, 0.24, 6, 7), materials.dark,
        [[-6, -3.8], [6, -3.8], [-6, 3.8], [6, 3.8]].map(([x, z]) => ({ position: [x, 3.1, z] })),
        { name: `${spec.id}-canopy-posts` });
      addMesh(group, box('camp-tactical-table', [5.2, 1.1, 3.4]), materials.dark, { position: [0, 1.7, 0], rotation: [0, 0.12, 0], name: `${spec.id}-tactical-table` });
      addMesh(group, this.geometry('camp-holo-table', () => new THREE.CylinderGeometry(1.8, 2.2, 0.25, 8)), materials.signal, { position: [0, 2.4, 0], castShadow: false, name: `${spec.id}-holo-map` });
      addInstancedMesh(group, box('camp-crate', [2.2, 1.9, 2.2]), surface, [
        { position: [-5.1, 1, 5], rotation: [0, 0.17, 0] },
        { position: [-2.5, 1, 5.4], rotation: [0, 0.34, 0] },
        { position: [5.4, 1, 4.8], rotation: [0, 0.51, 0] },
      ], { name: `${spec.id}-supply-crates` });
      addMesh(group, cylinder('camp-mast', 0.18, 0.28, 8, 8), materials.dark, { position: [5.2, 10, -2.8], name: `${spec.id}-mast` });
      addMesh(group, this.geometry('camp-dish', () => new THREE.TorusGeometry(1.45, 0.16, 6, 18, Math.PI)), materials.signal, {
        position: [5.2, 13.4, -2.8], rotation: [Math.PI / 2, 0.2, 0], castShadow: false, name: `${spec.id}-dish`,
      });
      return tagVisual(group, 'field_camp', 'open-canopy-command-post');
    }

    if (spec.type === 'frontier_homestead') {
      addMesh(group, box('homestead-core', [15, 7.5, 10]), surface, { position: [0, 4, 0], name: `${spec.id}-core` });
      addMesh(group, box('homestead-wing', [6, 5.2, 7]), surface, { position: [-9.2, 2.8, 0.8], name: `${spec.id}-west-module` });
      addMesh(group, box('homestead-wing', [6, 5.2, 7]), surface, { position: [9.2, 2.8, -0.8], name: `${spec.id}-east-module` });
      addMesh(group, box('homestead-roof-panel', [9.2, 0.55, 11.2]), materials.dark, { position: [-3.7, 8.8, 0], rotation: [0, 0, -0.42], name: `${spec.id}-roof-west` });
      addMesh(group, box('homestead-roof-panel', [9.2, 0.55, 11.2]), materials.dark, { position: [3.7, 8.8, 0], rotation: [0, 0, 0.42], name: `${spec.id}-roof-east` });
      addMesh(group, box('homestead-porch', [12, 0.45, 4]), surface, { position: [0, 0.7, 7], name: `${spec.id}-porch` });
      for (const x of [-5.2, 0, 5.2]) addMesh(group, cylinder('homestead-post', 0.18, 0.24, 5.2, 8), materials.dark, { position: [x, 3.2, 8.2], name: `${spec.id}-porch-post` });
      addMesh(group, cylinder('homestead-chimney', 0.65, 0.85, 6, 8), materials.dark, { position: [-5.4, 10.4, -2.5], name: `${spec.id}-chimney` });
      addMesh(group, this.geometry('homestead-collector', () => new THREE.CylinderGeometry(2.4, 2.4, 2.5, 12)), surface, { position: [10.5, 2, -6], rotation: [0, 0, Math.PI / 2], name: `${spec.id}-water-collector` });
      return tagVisual(group, 'frontier_homestead', 'gabled-frontier-longhouse');
    }

    if (spec.type === 'signal_array') {
      addMesh(group, cylinder('array-plinth', 3.8, 4.6, 1.4, 10), surface, { position: [0, 0.7, 0], name: `${spec.id}-plinth` });
      addMesh(group, box('array-console', [4.8, 2.2, 3.2]), materials.dark, { position: [0, 2, 0], rotation: [0.12, 0, 0], name: `${spec.id}-console` });
      for (let index = 0; index < 3; index += 1) {
        const angle = (index / 3) * Math.PI * 2 + 0.3;
        const x = Math.cos(angle) * 7.2;
        const z = Math.sin(angle) * 7.2;
        addMesh(group, cylinder('array-tripod-leg', 0.18, 0.32, 9, 8), materials.dark, { position: [x, 4.5, z], rotation: [0, 0, Math.sin(angle) * 0.08], name: `${spec.id}-mast-${index + 1}` });
        addMesh(group, this.geometry('array-dish', () => new THREE.TorusGeometry(2.2, 0.22, 7, 20, Math.PI)), materials.signal, {
          position: [x, 8.4, z], rotation: [Math.PI / 2, -angle, 0], castShadow: false, name: `${spec.id}-dish-${index + 1}`,
        });
        addMesh(group, this.geometry('array-receiver', () => new THREE.OctahedronGeometry(0.65, 0)), materials.signal, { position: [x, 8.4, z], castShadow: false, name: `${spec.id}-receiver-${index + 1}` });
      }
      return tagVisual(group, 'signal_array', 'tri-dish-synthetic-array');
    }

    const expedition = spec.type === 'expedition_wreck';
    const bodyGeo = expedition
      ? cylinder('expedition-fuselage', 4.2, 4.8, 16, 12)
      : box('wreck-hull', [14, 5.5, 7.2]);
    addMesh(group, bodyGeo, surface, {
      position: expedition ? [-1, 3.5, 0] : [-2.7, 3.1, 0],
      rotation: expedition ? [0, 0, Math.PI / 2 + 0.08] : [0.08, 0.18, -0.16],
      scale: expedition ? [1, 1, 0.82] : [1, 1, 1],
      name: `${spec.id}-core`,
    });
    if (expedition) {
      for (let index = 0; index < 3; index += 1) {
        addMesh(group, this.geometry('expedition-engine', () => new THREE.ConeGeometry(1.5, 4, 9, 1, true)), materials.dark, {
          position: [-8.5, 2.2 + index * 1.45, (index - 1) * 2.5], rotation: [0, 0, -Math.PI / 2], name: `${spec.id}-engine-${index + 1}`,
        });
      }
      addMesh(group, this.geometry('expedition-torn-ring', () => new THREE.TorusGeometry(4.4, 0.5, 7, 18, Math.PI * 1.45)), materials.dark, { position: [6.8, 3.5, 0], rotation: [0, Math.PI / 2, 0.3], name: `${spec.id}-torn-ring` });
      addMesh(group, cylinder('expedition-distress-mast', 0.16, 0.26, 10, 7), materials.dark, { position: [1, 10, -1.8], rotation: [0, 0, -0.22], name: `${spec.id}-distress-mast` });
      addMesh(group, this.geometry('expedition-beacon', () => new THREE.OctahedronGeometry(0.9, 0)), materials.signal, { position: [-0.1, 14.8, -1.8], castShadow: false, name: `${spec.id}-distress-beacon` });
      return tagVisual(group, 'expedition_wreck', 'crashed-capsule-engine-tail');
    }
    addMesh(group, box('wreck-split-hull', [8.5, 4.2, 6.4]), surface, { position: [7, 2.2, -2.4], rotation: [-0.12, -0.48, 0.23], name: `${spec.id}-east-module` });
    addMesh(group, box('wreck-detached-panel', [8, 0.45, 5]), materials.dark, { position: [-7.5, 1, 5.2], rotation: [0.32, -0.25, -0.08], name: `${spec.id}-west-module` });
    for (let index = 0; index < 3; index += 1) {
      addMesh(group, this.geometry('wreck-rib', () => new THREE.TorusGeometry(3.4, 0.32, 6, 14, Math.PI)), materials.dark, { position: [-4 + index * 3, 5.2, 0], rotation: [0, Math.PI / 2, 0], name: `${spec.id}-exposed-rib-${index + 1}` });
    }
    addMesh(group, this.geometry('wreck-sparks', () => new THREE.OctahedronGeometry(0.75, 0)), materials.signal, { position: [2.4, 4.8, 0], castShadow: false, name: `${spec.id}-live-conduit` });
    return tagVisual(group, 'wreckage', 'split-hull-exposed-ribs');
  }

  createShrine(spec, materials) {
    const group = new THREE.Group();
    const surface = this.material(spec.texture);
    const cylinder = (key, top, bottom, height, segments = 10) => this.geometry(key, () => new THREE.CylinderGeometry(top, bottom, height, segments));

    if (spec.type === 'trophy_tree') {
      addMesh(group, cylinder('trophy-tree-trunk', 1.6, 3.5, 19, 9), surface, { position: [0, 9.5, 0], scale: [1, 1, 1.15], name: `${spec.id}-trunk` });
      const canopy = Array.from({ length: 5 }, (_, index) => {
        const angle = (index / 5) * Math.PI * 2;
        const x = Math.cos(angle) * 3.6;
        const z = Math.sin(angle) * 3.6;
        return { index, angle, x, z };
      });
      addInstancedMesh(group, cylinder('trophy-tree-branch', 0.45, 0.9, 9, 7), surface,
        canopy.map(({ index, angle, x, z }) => ({ position: [x, 14 + (index % 2) * 2, z], rotation: [Math.cos(angle) * 0.8, 0, -Math.sin(angle) * 0.8] })),
        { name: `${spec.id}-branches` });
      addInstancedMesh(group, this.geometry('trophy-tree-skull', () => new THREE.IcosahedronGeometry(1.1, 0)), materials.bone,
        canopy.map(({ index, x, z }) => ({ position: [x * 1.7, 12.2 + (index % 2) * 1.2, z * 1.7], scale: [1, 0.78, 0.9] })),
        { name: `${spec.id}-trophies` });
      addInstancedMesh(group, this.geometry('trophy-tree-tusk', () => new THREE.ConeGeometry(0.22, 1.8, 5)), materials.bone,
        canopy.map(({ index, x, z }) => ({ position: [x * 1.7, 10.9 + (index % 2) * 1.2, z * 1.7] })),
        { name: `${spec.id}-tusks` });
      return tagVisual(group, 'trophy_tree', 'branching-trophy-canopy');
    }

    if (spec.type === 'royal_dais') {
      addMesh(group, cylinder('royal-dais-low', 11, 13, 2, 14), materials.membrane, { position: [0, 1, 0], name: `${spec.id}-lower-dais` });
      addMesh(group, cylinder('royal-dais-high', 7.5, 9, 2.2, 12), materials.membrane, { position: [0, 2.8, -1.5], name: `${spec.id}-upper-dais` });
      addMesh(group, this.geometry('royal-throne', () => new THREE.IcosahedronGeometry(3.8, 1)), materials.membrane, { position: [0, 6.2, -3], scale: [1.15, 1.4, 0.8], name: `${spec.id}-throne-core` });
      addInstancedMesh(group, this.geometry('royal-rib', () => new THREE.ConeGeometry(0.62, 12, 6)), materials.membrane,
        Array.from({ length: 7 }, (_, index) => ({ position: [(index - 3) * 2, 8.3 + Math.abs(index - 3) * 0.35, -4.4], rotation: [0, 0, (index - 3) * -0.11] })),
        { name: `${spec.id}-crown-ribs` });
      addMesh(group, this.geometry('royal-crown', () => new THREE.TorusGeometry(5.8, 0.45, 7, 20, Math.PI)), materials.signal, { position: [0, 12.5, -4.2], castShadow: false, name: `${spec.id}-crown` });
      return tagVisual(group, 'royal_dais', 'ribbed-organic-throne');
    }

    if (spec.type === 'blooding_dais') {
      addMesh(group, cylinder('blooding-dais', 9.5, 11.5, 2.8, 8), surface, { position: [0, 1.4, 0], name: `${spec.id}-dais` });
      addMesh(group, this.geometry('blooding-glyph', () => new THREE.CylinderGeometry(4.2, 4.2, 0.22, 3)), materials.signal, { position: [0, 2.9, 0], rotation: [0, Math.PI / 6, 0], castShadow: false, name: `${spec.id}-blooding-glyph` });
      addInstancedMesh(group, this.geometry('blooding-obelisk', () => new THREE.ConeGeometry(0.75, 8, 4)), materials.dark,
        Array.from({ length: 6 }, (_, index) => ({ position: [Math.cos((index / 6) * Math.PI * 2) * 7.8, 5, Math.sin((index / 6) * Math.PI * 2) * 7.8], rotation: [0, -(index / 6) * Math.PI * 2, (index % 2 ? 1 : -1) * 0.12] })),
        { name: `${spec.id}-blade-circle` });
      addMesh(group, this.geometry('blooding-focus', () => new THREE.OctahedronGeometry(1.5, 0)), materials.signal, { position: [0, 5.2, 0], castShadow: false, name: `${spec.id}-focus` });
      return tagVisual(group, 'blooding_dais', 'tri-glyph-blade-circle');
    }

    if (spec.type === 'weapon_shrine') {
      addMesh(group, cylinder('weapon-shrine-base', 7.2, 9, 2, 10), surface, { position: [0, 1, 0], name: `${spec.id}-dais` });
      addMesh(group, this.geometry('weapon-rack-crossbar', () => new THREE.BoxGeometry(12, 0.8, 1)), materials.dark, { position: [0, 8, 0], name: `${spec.id}-rack-crossbar` });
      addInstancedMesh(group, cylinder('weapon-rack-post', 0.4, 0.7, 11, 8), materials.dark,
        [-5, 5].map((x) => ({ position: [x, 6, 0] })), { name: `${spec.id}-rack-posts` });
      const weaponOffsets = Array.from({ length: 5 }, (_, index) => (index - 2) * 2.3);
      addInstancedMesh(group, cylinder('weapon-shaft', 0.14, 0.18, 9, 6), materials.bone,
        weaponOffsets.map((x, index) => ({ position: [x, 6.7, 0.2], rotation: [0, 0, (index - 2) * 0.04] })),
        { name: `${spec.id}-weapon-shafts` });
      addInstancedMesh(group, this.geometry('weapon-blade', () => new THREE.ConeGeometry(0.72, 2.8, 4)), materials.signal,
        weaponOffsets.map((x) => ({ position: [x, 12, 0.2] })),
        { name: `${spec.id}-weapon-blades`, castShadow: false });
      return tagVisual(group, 'weapon_shrine', 'illuminated-weapon-rack');
    }

    if (spec.type === 'trophy_gallery') {
      addMesh(group, this.geometry('gallery-floor', () => new THREE.BoxGeometry(18, 1.4, 7)), surface, { position: [0, 0.7, 0], name: `${spec.id}-dais` });
      addInstancedMesh(group, this.geometry('gallery-panel', () => new THREE.BoxGeometry(5.2, 11, 1.2)), materials.dark,
        Array.from({ length: 3 }, (_, index) => ({ position: [(index - 1) * 6, 6.2, -2], rotation: [0, (index - 1) * -0.18, 0] })),
        { name: `${spec.id}-gallery-panels` });
      const trophies = [];
      for (let index = 0; index < 3; index += 1) {
        for (let row = 0; row < 2; row += 1) trophies.push({
          position: [(index - 1) * 6 + (row ? 1.2 : -1.2), 5 + row * 3.5, -1.15],
          scale: [1, 0.78, 0.8],
        });
      }
      addInstancedMesh(group, this.geometry('gallery-trophy', () => new THREE.IcosahedronGeometry(1.25, 0)), materials.bone,
        trophies, { name: `${spec.id}-gallery-trophies` });
      addMesh(group, this.geometry('gallery-lineage-ring', () => new THREE.TorusGeometry(7.8, 0.28, 7, 24, Math.PI)), materials.signal, { position: [0, 12.3, -2], castShadow: false, name: `${spec.id}-lineage-arc` });
      return tagVisual(group, 'trophy_gallery', 'triptych-trophy-wall');
    }

    addMesh(group, cylinder('kalisk-nest-dais', 10.5, 12.5, 1.5, 14), materials.spore, { position: [0, 0.75, 0], name: `${spec.id}-dais` });
    addMesh(group, this.geometry('kalisk-nest-ring', () => new THREE.TorusGeometry(6.3, 1.2, 8, 24)), materials.spore, { position: [0, 2.2, 0], rotation: [Math.PI / 2, 0, 0], name: `${spec.id}-nest-ring` });
    addMesh(group, this.geometry('kalisk-nest-core', () => new THREE.IcosahedronGeometry(4.8, 1)), materials.spore, { position: [0, 5.2, 0], scale: [1.4, 0.72, 1.18], name: `${spec.id}-focus` });
    for (let index = 0; index < 8; index += 1) {
      const angle = (index / 8) * Math.PI * 2;
      addMesh(group, this.geometry('kalisk-nest-spine', () => new THREE.ConeGeometry(0.55, 8.5, 6)), materials.spore, { position: [Math.cos(angle) * 7.5, 4.5, Math.sin(angle) * 7.5], rotation: [Math.sin(angle) * 0.55, -angle, Math.cos(angle) * 0.55], name: `${spec.id}-spine-${index + 1}` });
    }
    addMesh(group, this.geometry('kalisk-nest-heart', () => new THREE.OctahedronGeometry(1.4, 0)), materials.signal, { position: [0, 6, 0], castShadow: false, name: `${spec.id}-heart` });
    return tagVisual(group, 'kalisk_nest', 'radial-spore-nest');
  }

  createTower(spec, materials) {
    const group = new THREE.Group();
    const surface = this.material(spec.texture);
    const legGeo = this.geometry('tower-leg', () => new THREE.CylinderGeometry(0.48, 0.72, 18, 8));
    for (const [x, z] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) addMesh(group, legGeo, materials.dark, { position: [x, 9, z], rotation: [0, 0, x * 0.018] });
    addMesh(group, this.geometry('tower-tank', () => new THREE.CylinderGeometry(5.4, 5.4, 8, 14)), surface, { position: [0, 21, 0], name: `${spec.id}-tank` });
    addMesh(group, this.geometry('tower-cap', () => new THREE.ConeGeometry(5.6, 3.2, 14)), surface, { position: [0, 26.6, 0], name: `${spec.id}-cap` });
    addMesh(group, this.geometry('tower-beacon', () => new THREE.SphereGeometry(0.72, 10, 8)), materials.signal, { position: [0, 29.2, 0], castShadow: false });
    return tagVisual(group, 'water_tower', 'four-leg-elevated-cistern');
  }

  createPen(spec, materials) {
    const group = new THREE.Group();
    const surface = this.material(spec.texture);
    const postGeo = this.geometry('pen-post', () => new THREE.BoxGeometry(0.55, 4.8, 0.55));
    const railGeo = this.geometry('pen-rail', () => new THREE.BoxGeometry(8, 0.35, 0.45));
    for (const [x, z] of [[-7, -7], [7, -7], [-7, 7], [7, 7]]) addMesh(group, postGeo, surface, { position: [x, 2.4, z] });
    for (const [x, z, y] of [[0, -7, 0], [0, 7, 0], [-7, 0, Math.PI / 2], [7, 0, Math.PI / 2]]) {
      addMesh(group, railGeo, surface, { position: [x, 2.2, z], rotation: [0, y, 0] });
      addMesh(group, railGeo, surface, { position: [x, 3.6, z], rotation: [0, y, 0] });
    }
    const podGeo = spec.type === 'egg_nursery'
      ? this.geometry('pen-egg', () => new THREE.SphereGeometry(1.9, 12, 9))
      : this.geometry('pen-feed', () => new THREE.CylinderGeometry(1.5, 1.8, 2.5, 8));
    for (let index = 0; index < 5; index += 1) {
      const angle = index * 2.19;
      addMesh(group, podGeo, spec.type === 'egg_nursery' ? materials.membrane : materials.bone, { position: [Math.cos(angle) * 4.2, 1.8, Math.sin(angle) * 4.2], scale: [0.78, 1.25, 0.78], name: `${spec.id}-subject-${index + 1}` });
    }
    return tagVisual(group, spec.type, spec.type === 'egg_nursery' ? 'resin-egg-corral' : 'frontier-stock-corral');
  }

  createInstancedCluster(spec, materials) {
    const group = new THREE.Group();
    const count = Math.max(3, Math.min(12, Number(spec.instances) || (spec.type === 'cover_cluster' ? 5 : 6)));
    const surface = this.material(spec.texture);
    const dummy = new THREE.Object3D();
    const addInstances = (name, geometry, material, transform) => {
      const mesh = new THREE.InstancedMesh(geometry, material, count);
      for (let index = 0; index < count; index += 1) {
        transform(dummy, index, count);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
      }
      mesh.castShadow = !['beacon_line', 'brazier_ring'].includes(spec.type);
      mesh.receiveShadow = true;
      mesh.name = `${spec.id}-${name}`;
      mesh.userData.instanceRole = spec.type;
      mesh.userData.visualVariant = spec.type;
      group.add(mesh);
      return mesh;
    };
    const linePosition = (object, index, total, y = 1.7, spacing = 4.6) => {
      const offset = index - (total - 1) / 2;
      object.position.set(offset * spacing, y + (index % 2) * 0.35, Math.sin(index * 1.71) * 2.6);
      object.rotation.set(0, (index % 3) * 0.24, 0);
      const variation = 0.82 + (index % 4) * 0.09;
      object.scale.setScalar(variation);
    };

    if (spec.type === 'cleaner_canisters') {
      addInstances('canister-bodies', this.geometry('cleaner-canister', () => new THREE.CylinderGeometry(1.05, 1.18, 4.8, 10)), surface, (object, index, total) => {
        linePosition(object, index, total, 2.5, 3.2);
        object.rotation.z = (index % 2 ? 1 : -1) * 0.07;
      });
      addInstances('pressure-caps', this.geometry('cleaner-cap', () => new THREE.SphereGeometry(1.05, 10, 7)), materials.signal, (object, index, total) => {
        linePosition(object, index, total, 5, 3.2);
        object.scale.set(0.72, 0.45, 0.72);
      });
      addMesh(group, this.geometry('cleaner-rack-base', () => new THREE.BoxGeometry(15, 0.55, 4.4)), materials.dark, { position: [0, 0.3, 0], name: `${spec.id}-containment-rack` });
      addMesh(group, this.geometry('cleaner-manifold', () => new THREE.BoxGeometry(15, 0.35, 0.5)), materials.signal, { position: [0, 4.8, -1.5], castShadow: false, name: `${spec.id}-pressure-manifold` });
      return tagVisual(group, 'cleaner_canisters', 'pressurized-canister-rack');
    }

    if (spec.type === 'windbreak') {
      addInstances('slanted-panels', this.geometry('windbreak-panel', () => new THREE.BoxGeometry(0.55, 5.2, 6.4)), surface, (object, index, total) => {
        const offset = index - (total - 1) / 2;
        object.position.set(offset * 3.4, 2.7, Math.sin(index * 0.9) * 1.6);
        object.rotation.set(0, 0.18 + (index % 2) * 0.12, (index % 2 ? 1 : -1) * 0.16);
        object.scale.set(1, 0.85 + (index % 3) * 0.1, 1);
      });
      addInstances('anchor-posts', this.geometry('windbreak-post', () => new THREE.CylinderGeometry(0.18, 0.3, 6.2, 7)), materials.dark, (object, index, total) => {
        const offset = index - (total - 1) / 2;
        object.position.set(offset * 3.4, 3, Math.sin(index * 0.9) * 1.6 - 2.9);
        object.rotation.set(0, 0, 0);
        object.scale.setScalar(1);
      });
      return tagVisual(group, 'windbreak', 'slanted-frontier-baffle-line');
    }

    if (spec.type === 'cover_cluster') {
      const layout = getCoverClusterLayout(count);
      addInstances('wedge-cover', this.geometry('cover-wedge', () => new THREE.ConeGeometry(2.6, 5.2, 4)), surface, (object, index) => {
        const entry = layout[index];
        object.position.set(entry.x, 2, entry.z);
        object.rotation.set(Math.PI / 2, -entry.angle + Math.PI / 4, 0);
        object.scale.set(...entry.wedgeScale);
      });
      addInstances('cover-capstones', this.geometry('cover-capstone', () => new THREE.DodecahedronGeometry(1.45, 0)), surface, (object, index) => {
        const entry = layout[index];
        object.position.set(entry.x, 4.1, entry.z);
        object.rotation.set(0.2, index * 0.4, 0.1);
        object.scale.setScalar(entry.capstoneScale);
      });
      return tagVisual(group, 'cover_cluster', 'crescent-wedge-barricade');
    }

    if (spec.type === 'regen_node_line') {
      addInstances('regen-stalks', this.geometry('regen-stalk', () => new THREE.CylinderGeometry(0.35, 0.8, 5.5, 8)), materials.spore, (object, index, total) => linePosition(object, index, total, 2.75, 5.2));
      addInstances('regen-pods', this.geometry('regen-pod', () => new THREE.IcosahedronGeometry(1.75, 1)), materials.spore, (object, index, total) => {
        linePosition(object, index, total, 6.1, 5.2);
        object.scale.set(1.1, 1.35, 1.1);
      });
      addInstances('regen-halos', this.geometry('regen-halo', () => new THREE.TorusGeometry(1.8, 0.16, 6, 16)), materials.signal, (object, index, total) => {
        linePosition(object, index, total, 6.1, 5.2);
        object.rotation.x = Math.PI / 2;
        object.scale.setScalar(1);
      });
      return tagVisual(group, 'regen_node_line', 'stalk-pod-energy-halo-line');
    }

    let geometry = this.geometry('cluster-box', () => new THREE.BoxGeometry(3.2, 3.2, 3.2));
    let material = surface;
    if (['stone_line', 'bone_line'].includes(spec.type)) {
      geometry = this.geometry('cluster-stone', () => new THREE.DodecahedronGeometry(2.1, 0));
      material = spec.type === 'bone_line' ? materials.bone : surface;
    } else if (['rib_corridor', 'totem_ring', 'bone_arch'].includes(spec.type)) {
      geometry = this.geometry('cluster-rib', () => new THREE.ConeGeometry(0.7, 8, 6));
      material = spec.type === 'rib_corridor' ? materials.membrane : materials.bone;
    } else if (['cocoon_cluster', 'spore_grove'].includes(spec.type)) {
      geometry = this.geometry('cluster-pod', () => new THREE.IcosahedronGeometry(2.1, 1));
      material = spec.type === 'cocoon_cluster' ? materials.membrane : materials.spore;
    } else if (spec.type === 'brazier_ring') {
      geometry = this.geometry('cluster-brazier', () => new THREE.ConeGeometry(1.15, 4.2, 7));
      material = materials.signal;
    } else if (spec.type === 'beacon_line') {
      geometry = this.geometry('cluster-beacon', () => new THREE.OctahedronGeometry(1.5, 0));
      material = materials.signal;
    }
    const ringLayout = ['brazier_ring', 'totem_ring'].includes(spec.type);
    addInstances('instances', geometry, material, (object, index, total) => {
      const offset = index - (total - 1) / 2;
      const angle = ringLayout ? (index / total) * Math.PI * 2 : 0;
      object.position.set(ringLayout ? Math.cos(angle) * 12 : offset * 4.6, spec.type === 'rib_corridor' ? 4.2 : spec.type === 'beacon_line' ? 2.2 : 1.7 + (index % 2) * 0.35, ringLayout ? Math.sin(angle) * 12 : Math.sin(index * 1.71) * 2.6);
      object.rotation.set(spec.type === 'rib_corridor' ? Math.PI : 0, ringLayout ? -angle : (index % 3) * 0.24, spec.type === 'rib_corridor' ? Math.sin(index) * 0.18 : 0);
      const variation = 0.82 + (index % 4) * 0.09;
      object.scale.setScalar(variation);
    });
    return tagVisual(group, spec.type, `instanced-${spec.type}`);
  }

  createProp(spec, materials) {
    const archTypes = ['ritual_gate', 'clan_gate', 'hive_bulkhead', 'bone_arch'];
    const facilityTypes = ['field_camp', 'frontier_homestead', 'wreckage', 'expedition_wreck', 'signal_array'];
    const shrineTypes = ['trophy_tree', 'royal_dais', 'blooding_dais', 'weapon_shrine', 'trophy_gallery', 'kalisk_nest'];
    const penTypes = ['egg_nursery', 'stock_pen'];
    let group;
    if (archTypes.includes(spec.type)) group = this.createArch(spec, materials);
    else if (facilityTypes.includes(spec.type)) group = this.createFacility(spec, materials);
    else if (shrineTypes.includes(spec.type)) group = this.createShrine(spec, materials);
    else if (spec.type === 'water_tower') group = this.createTower(spec, materials);
    else if (penTypes.includes(spec.type)) group = this.createPen(spec, materials);
    else group = this.createInstancedCluster(spec, materials);
    group.name = spec.id;
    group.userData.environmentProp = true;
    group.userData.propId = spec.id;
    group.userData.propType = spec.type;
    group.userData.visualVariant ||= spec.type;
    applyPlanTransform(group, spec);
    return group;
  }

  createPointOfInterest(spec, materials) {
    const group = new THREE.Group();
    group.name = spec.id;
    group.position.set(...spec.position);
    group.userData.pointOfInterest = true;
    group.userData.poiId = spec.id;
    const signal = materials.signal;
    let indicator;
    const addIndicator = (geometry, position, name = 'indicator') => {
      indicator = addMesh(group, geometry, signal.clone(), { position, castShadow: false, name: `${spec.id}-${name}` });
      indicator.userData.poiIndicator = true;
      return indicator;
    };
    const baseCylinder = this.geometry('poi-low-plinth', () => new THREE.CylinderGeometry(1.8, 2.3, 1.4, 8));

    if (spec.type === 'field_record') {
      addMesh(group, this.geometry('poi-console-base', () => new THREE.BoxGeometry(3.8, 1.2, 2.8)), materials.dark, { position: [0, 0.6, 0], name: `${spec.id}-console-base` });
      addMesh(group, this.geometry('poi-console-screen', () => new THREE.BoxGeometry(3.2, 2.1, 0.3)), signal, { position: [0, 2.25, -0.7], rotation: [-0.25, 0, 0], castShadow: false, name: `${spec.id}-record-screen` });
      addMesh(group, this.geometry('poi-console-antenna', () => new THREE.CylinderGeometry(0.1, 0.15, 3.8, 6)), materials.dark, { position: [1.45, 3, 0], name: `${spec.id}-antenna` });
      addIndicator(this.geometry('poi-record-indicator', () => new THREE.BoxGeometry(0.75, 0.75, 0.75)), [1.45, 5, 0], 'data-cube');
      tagVisual(group, 'poi-field_record', 'tilted-console-data-cube');
    } else if (spec.type === 'hunt_trace') {
      addMesh(group, this.geometry('poi-trace-ring', () => new THREE.TorusGeometry(2.8, 0.18, 6, 20)), signal, { position: [0, 0.2, 0], rotation: [Math.PI / 2, 0, 0], castShadow: false, name: `${spec.id}-trace-ring` });
      for (let index = 0; index < 3; index += 1) addMesh(group, this.geometry('poi-footprint', () => new THREE.ConeGeometry(0.45, 1.5, 3)), materials.dark, { position: [-1.3 + index * 1.2, 0.25, -1.2 + index * 0.9], rotation: [Math.PI / 2, index * 0.35, 0], name: `${spec.id}-trace-${index + 1}` });
      addMesh(group, this.geometry('poi-trace-scanner', () => new THREE.CylinderGeometry(0.15, 0.35, 3.4, 7)), signal, { position: [0, 1.9, 0], castShadow: false, name: `${spec.id}-scanner` });
      addIndicator(this.geometry('poi-trace-indicator', () => new THREE.SphereGeometry(0.72, 10, 8)), [0, 4.2, 0], 'tracking-orb');
      tagVisual(group, 'poi-hunt_trace', 'ground-trace-scanner');
    } else if (spec.type === 'trophy_archive') {
      addMesh(group, baseCylinder, materials.bone, { position: [0, 0.7, 0], name: `${spec.id}-bone-plinth` });
      for (const side of [-1, 1]) addMesh(group, this.geometry('poi-trophy-fork', () => new THREE.CylinderGeometry(0.2, 0.45, 5.2, 7)), materials.bone, { position: [side * 1.15, 3.2, 0], rotation: [0, 0, side * -0.23], name: `${spec.id}-fork` });
      addMesh(group, this.geometry('poi-trophy-skull', () => new THREE.IcosahedronGeometry(1.25, 0)), materials.bone, { position: [0, 5.2, 0], scale: [1, 0.78, 0.82], name: `${spec.id}-skull` });
      addIndicator(this.geometry('poi-trophy-indicator', () => new THREE.OctahedronGeometry(0.62, 0)), [0, 7.2, 0], 'lineage-glyph');
      tagVisual(group, 'poi-trophy_archive', 'forked-bone-lineage-totem');
    } else if (spec.type === 'hive_sample') {
      addMesh(group, baseCylinder, materials.membrane, { position: [0, 0.7, 0], name: `${spec.id}-resin-plinth` });
      addMesh(group, this.geometry('poi-hive-egg', () => new THREE.SphereGeometry(1.35, 12, 9)), materials.membrane, { position: [0, 2.8, 0], scale: [0.82, 1.35, 0.82], name: `${spec.id}-sample-egg` });
      for (let index = 0; index < 4; index += 1) {
        const angle = (index / 4) * Math.PI * 2;
        addMesh(group, this.geometry('poi-hive-cage-rib', () => new THREE.TorusGeometry(1.8, 0.12, 5, 12, Math.PI)), signal, { position: [0, 2.8, 0], rotation: [0, angle, 0], castShadow: false, name: `${spec.id}-sample-rib` });
      }
      addIndicator(this.geometry('poi-hive-indicator', () => new THREE.TetrahedronGeometry(0.82, 0)), [0, 5.8, 0], 'biohazard-glyph');
      tagVisual(group, 'poi-hive_sample', 'caged-ovoid-specimen');
    } else if (spec.type === 'cleaner_trace') {
      addMesh(group, this.geometry('poi-cleaner-rack', () => new THREE.BoxGeometry(4.6, 0.7, 2.4)), materials.dark, { position: [0, 0.35, 0], name: `${spec.id}-rack` });
      for (let index = 0; index < 3; index += 1) addMesh(group, this.geometry('poi-cleaner-vial', () => new THREE.CylinderGeometry(0.48, 0.58, 3.2, 9)), this.material('/assets/textures/wolf-cleaner-alloy.webp'), { position: [(index - 1) * 1.35, 1.9, 0], rotation: [0, 0, (index - 1) * 0.08], name: `${spec.id}-vial-${index + 1}` });
      addMesh(group, this.geometry('poi-cleaner-manifold', () => new THREE.TorusGeometry(1.4, 0.12, 6, 16, Math.PI)), signal, { position: [0, 3.6, 0], castShadow: false, name: `${spec.id}-manifold` });
      addIndicator(this.geometry('poi-cleaner-indicator', () => new THREE.DodecahedronGeometry(0.7, 0)), [0, 5.1, 0], 'cleaner-residue');
      tagVisual(group, 'poi-cleaner_trace', 'three-vial-cleaner-manifold');
    } else if (spec.type === 'seismic_array') {
      addMesh(group, baseCylinder, materials.dark, { position: [0, 0.7, 0], name: `${spec.id}-receiver-base` });
      for (let index = 0; index < 3; index += 1) {
        const angle = (index / 3) * Math.PI * 2;
        addMesh(group, this.geometry('poi-seismic-leg', () => new THREE.CylinderGeometry(0.12, 0.22, 4.5, 6)), materials.dark, { position: [Math.cos(angle) * 1.6, 2.2, Math.sin(angle) * 1.6], rotation: [Math.cos(angle) * 0.35, 0, -Math.sin(angle) * 0.35], name: `${spec.id}-tripod-leg` });
      }
      addMesh(group, this.geometry('poi-seismic-dish', () => new THREE.TorusGeometry(2, 0.16, 6, 18, Math.PI)), signal, { position: [0, 4.4, 0], rotation: [Math.PI / 2, 0.35, 0], castShadow: false, name: `${spec.id}-seismic-dish` });
      addIndicator(this.geometry('poi-seismic-indicator', () => new THREE.SphereGeometry(0.62, 9, 7)), [0, 4.4, 0], 'seismic-receiver');
      tagVisual(group, 'poi-seismic_array', 'tripod-half-dish-array');
    } else if (spec.type === 'honor_archive') {
      addMesh(group, this.geometry('poi-honor-stele', () => new THREE.BoxGeometry(3.6, 7.5, 1.3)), this.material('/assets/textures/yautja-ceremonial-bronze.webp'), { position: [0, 3.75, 0], name: `${spec.id}-law-stele` });
      for (let index = 0; index < 4; index += 1) addMesh(group, this.geometry('poi-honor-rune', () => new THREE.BoxGeometry(2.1, 0.25, 0.16)), signal, { position: [0, 2.2 + index * 1.25, 0.72], rotation: [0, 0, (index - 1.5) * 0.08], castShadow: false, name: `${spec.id}-law-rune-${index + 1}` });
      addIndicator(this.geometry('poi-honor-indicator', () => new THREE.OctahedronGeometry(0.82, 0)), [0, 8.5, 0], 'honor-seal');
      tagVisual(group, 'poi-honor_archive', 'tall-runed-law-stele');
    } else if (spec.type === 'weapon_archive') {
      addMesh(group, baseCylinder, this.material('/assets/textures/yautja-ceremonial-bronze.webp'), { position: [0, 0.7, 0], name: `${spec.id}-weapon-plinth` });
      addMesh(group, this.geometry('poi-weapon-rack', () => new THREE.BoxGeometry(5.5, 0.5, 0.7)), materials.dark, { position: [0, 4, 0], name: `${spec.id}-weapon-rack` });
      for (const side of [-1, 1]) {
        addMesh(group, this.geometry('poi-weapon-shaft', () => new THREE.CylinderGeometry(0.13, 0.18, 6.5, 6)), materials.bone, { position: [side * 1.25, 3.9, 0], rotation: [0, 0, side * 0.5], name: `${spec.id}-weapon-shaft` });
        addMesh(group, this.geometry('poi-weapon-blade', () => new THREE.ConeGeometry(0.7, 2.3, 4)), signal, { position: [side * 2.75, 6.7, 0], rotation: [0, 0, side * 0.5], castShadow: false, name: `${spec.id}-weapon-blade` });
      }
      addIndicator(this.geometry('poi-weapon-indicator', () => new THREE.TetrahedronGeometry(0.82, 0)), [0, 7.3, 0], 'duel-glyph');
      tagVisual(group, 'poi-weapon_archive', 'crossed-weapon-archive');
    } else {
      addMesh(group, baseCylinder, materials.dark, { position: [0, 0.7, 0], name: `${spec.id}-pedestal` });
      addMesh(group, this.geometry('poi-generic-column', () => new THREE.CylinderGeometry(0.18, 0.32, 3.8, 8)), signal, { position: [0, 3.1, 0], castShadow: false, name: `${spec.id}-column` });
      addIndicator(this.geometry('poi-generic-indicator', () => new THREE.OctahedronGeometry(0.92, 0)), [0, 5.4, 0]);
      tagVisual(group, `poi-${spec.type}`, 'generic-scanner-beacon');
    }
    group.userData.poiType = spec.type;
    return {
      ...spec,
      position: new THREE.Vector3(...spec.position),
      mesh: group,
      indicator,
      scanned: false,
      visualVariant: group.userData.visualVariant,
    };
  }

  createHazard(spec, materials) {
    const group = new THREE.Group();
    group.name = spec.id;
    group.position.set(...spec.position);
    group.userData.environmentHazard = true;
    group.userData.hazardRadius = spec.radius;
    const pulseRoot = new THREE.Group();
    pulseRoot.name = `${spec.id}-decorative-pulse`;
    pulseRoot.userData.decorativePulse = true;
    group.add(pulseRoot);
    const isPool = spec.type === 'acid_pool';
    const isEnergy = ['heat_vent', 'plasma_brazier'].includes(spec.type);
    const material = isPool
      ? new THREE.MeshStandardMaterial({ color: 0x73ff35, emissive: 0x42ff12, emissiveIntensity: 1.35, transparent: true, opacity: 0.68, roughness: 0.18 })
      : isEnergy ? materials.signal.clone() : materials.spore.clone();
    if (isPool) {
      addMesh(pulseRoot, this.geometry('hazard-pool', () => new THREE.CylinderGeometry(1, 1.2, 0.22, 24)), material, { position: [0, 0.12, 0], scale: [spec.radius * 0.82, 1, spec.radius * 0.82], castShadow: false, name: `${spec.id}-pool` });
    } else {
      addMesh(pulseRoot, this.geometry('hazard-vent', () => new THREE.CylinderGeometry(1.4, 2.2, 1.1, 9)), materials.dark, { position: [0, 0.55, 0], name: `${spec.id}-vent` });
      addMesh(pulseRoot, this.geometry('hazard-plume', () => new THREE.ConeGeometry(1.8, 5.5, 9, 1, true)), material, { position: [0, 3.2, 0], castShadow: false, receiveShadow: false, name: `${spec.id}-plume` });
      for (let index = 0; index < 5; index += 1) {
        const angle = (index / 5) * Math.PI * 2;
        addMesh(pulseRoot, this.geometry('hazard-tendril', () => new THREE.ConeGeometry(0.28, 3.4, 5)), material, { position: [Math.cos(angle) * 2.1, 1.5, Math.sin(angle) * 2.1], rotation: [Math.sin(angle) * 0.55, -angle, Math.cos(angle) * 0.55], castShadow: false, name: `${spec.id}-tendril-${index + 1}` });
      }
    }
    const boundaryColor = material.color?.getHex?.() ?? (isEnergy ? BIOME_ACCENTS.yautja_prime : 0xb8ff5c);
    const boundaryMaterial = new THREE.MeshBasicMaterial({ color: boundaryColor, transparent: true, opacity: 0.62, depthWrite: false });
    const boundaryRing = addMesh(group, this.geometry('hazard-gameplay-boundary', () => new THREE.TorusGeometry(1, 0.018, 5, 48)), boundaryMaterial, {
      position: [0, 0.24, 0], rotation: [Math.PI / 2, 0, 0], scale: [spec.radius, spec.radius, spec.radius], castShadow: false, receiveShadow: false, name: `${spec.id}-gameplay-radius-ring`,
    });
    boundaryRing.userData.isHazardBoundary = true;
    boundaryRing.userData.gameplayRadius = spec.radius;
    boundaryRing.userData.baseGeometryRadius = 1;
    boundaryRing.userData.decorativePulse = false;
    tagVisual(group, `hazard-${spec.type}`, isPool ? 'acid-pool-exact-boundary' : `${spec.type}-vent-exact-boundary`);
    return {
      ...spec,
      position: new THREE.Vector3(...spec.position),
      mesh: group,
      pulseRoot,
      boundaryRing,
      cooldown: 0,
      pulsePhase: spec.position[0] * 0.031 + spec.position[2] * 0.017,
      warned: false,
      visualVariant: group.userData.visualVariant,
    };
  }

  build(plan) {
    const root = new THREE.Group();
    root.name = `${plan.biomeId}-prop-root`;
    root.userData.biomePropRoot = true;
    const materials = this.createMaterials(plan);
    const props = plan.props.map((spec) => {
      const mesh = this.createProp(spec, materials);
      root.add(mesh);
      return { ...spec, mesh, visualVariant: mesh.userData.visualVariant };
    });
    const pointsOfInterest = plan.pointsOfInterest.map((spec) => {
      const point = this.createPointOfInterest(spec, materials);
      root.add(point.mesh);
      return point;
    });
    const hazardZones = plan.hazardZones.map((spec) => {
      const hazard = this.createHazard(spec, materials);
      root.add(hazard.mesh);
      return hazard;
    });
    return { root, props, pointsOfInterest, hazardZones, metrics: estimateRenderCost(root) };
  }
}
