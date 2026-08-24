import * as THREE from 'three';
import { BIOME_DEFINITIONS } from '../data/GameConfig.js';
import {
  ENVIRONMENT_PERFORMANCE_BUDGETS,
  getBiomePropPlan,
} from '../data/BiomePropCatalog.js';
import { BiomePropBuilder, getCoverClusterLayout } from './BiomePropBuilder.js';

export const DEATHWORLD_FLORA_TEXTURE_PATH = '/assets/textures/deathworld-alien-flora.webp';

const BIOME_STYLE = Object.freeze({
  jungle: {
    background: 0x050810,
    fog: 0.0028,
    ambient: 0x607f96,
    ambientIntensity: 1.65,
    hemisphereSky: 0x75bfd2,
    hemisphereGround: 0x171c24,
    hemisphereIntensity: 1.4,
    key: 0x9beaff,
    keyIntensity: 2.5,
    sun: 0x70ddff,
    ground: 0x3c5360,
  },
  hive_lv426: {
    background: 0x06140b,
    fog: 0.0048,
    ambient: 0x78b887,
    ambientIntensity: 2,
    hemisphereSky: 0x8dda9e,
    hemisphereGround: 0x102418,
    hemisphereIntensity: 1.75,
    key: 0x9bffae,
    keyIntensity: 3,
    sun: 0x45ff76,
    ground: 0x477358,
  },
  ryushi_desert: {
    background: 0x221105,
    fog: 0.0062,
    ambient: 0xa06c3c,
    ambientIntensity: 1.45,
    hemisphereSky: 0xe2aa61,
    hemisphereGround: 0x32190c,
    hemisphereIntensity: 1.3,
    key: 0xffd18a,
    keyIntensity: 2.6,
    sun: 0xffbd62,
    ground: 0x82552b,
  },
  yautja_prime: {
    background: 0x2b0909,
    fog: 0.0027,
    ambient: 0xb86c70,
    ambientIntensity: 1.85,
    hemisphereSky: 0xd07c74,
    hemisphereGround: 0x321014,
    hemisphereIntensity: 1.55,
    key: 0xff9a82,
    keyIntensity: 3,
    sun: 0xff4938,
    ground: 0x804349,
  },
  genna_deathworld: {
    background: 0x08070d,
    fog: 0.0044,
    ambient: 0x697256,
    ambientIntensity: 1.55,
    hemisphereSky: 0xa4c576,
    hemisphereGround: 0x251c18,
    hemisphereIntensity: 1.35,
    key: 0xd9ff91,
    keyIntensity: 2.5,
    sun: 0xff9a4a,
    ground: 0x5d4534,
  },
});

const PROP_HEIGHTS = Object.freeze({
  ritual_gate: 16,
  clan_gate: 18,
  hive_bulkhead: 16,
  bone_arch: 15,
  field_camp: 16,
  frontier_homestead: 16,
  wreckage: 9,
  expedition_wreck: 11,
  signal_array: 17,
  trophy_tree: 22,
  royal_dais: 16,
  blooding_dais: 14,
  weapon_shrine: 14,
  trophy_gallery: 14,
  kalisk_nest: 13,
  water_tower: 30,
  egg_nursery: 7,
  stock_pen: 6,
});

const ARCH_PROP_TYPES = new Set(['ritual_gate', 'clan_gate', 'hive_bulkhead', 'bone_arch']);
const FACILITY_PROP_TYPES = new Set(['field_camp', 'frontier_homestead', 'signal_array']);
const WRECK_PROP_TYPES = new Set(['wreckage', 'expedition_wreck']);
const PEN_PROP_TYPES = new Set(['egg_nursery', 'stock_pen']);
const SHRINE_PROP_TYPES = new Set(['trophy_tree', 'royal_dais', 'blooding_dais', 'weapon_shrine', 'trophy_gallery', 'kalisk_nest']);

const STATIC_INSTANCE_BATCH_NAMES = Object.freeze({
  jungleTrunks: 'legacy-jungle-tree-trunks',
  jungleCrowns: 'legacy-jungle-tree-crowns',
  hivePillars: 'legacy-hive-resin-pillars',
  primePillars: 'legacy-prime-arena-pillars',
});

const DEATHWORLD_FLORA_BATCH_NAMES = Object.freeze({
  shadowStalks: 'genna-flora-stalks-shadow',
  stalks: 'genna-flora-stalks',
  crowns: 'genna-flora-crowns',
  throats: 'genna-flora-throats',
  tendrils: 'genna-flora-tendrils',
});

function toWorldVector(value) {
  if (value?.isVector3) return value;
  if (Array.isArray(value) && value.length >= 3) {
    return new THREE.Vector3(Number(value[0]) || 0, Number(value[1]) || 0, Number(value[2]) || 0);
  }
  if (value && typeof value === 'object') {
    return new THREE.Vector3(Number(value.x) || 0, Number(value.y) || 0, Number(value.z) || 0);
  }
  return null;
}

function horizontalDistance(left, right) {
  return Math.hypot(left.x - right.x, left.z - right.z);
}

function estimateRenderCost(root) {
  let drawCallEstimate = 0;
  let triangleEstimate = 0;
  let shadowCasterCount = 0;
  let totalMeshInstanceCount = 0;
  let totalInstancedBatchCount = 0;
  let totalInstancedInstanceCount = 0;
  root?.traverse((object) => {
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    if (object.isMesh || object.isPoints || object.isLine) {
      drawCallEstimate += Math.max(1, materials.filter(Boolean).length);
    }
    if (object.isMesh) {
      const instanceCount = object.isInstancedMesh ? object.count : 1;
      totalMeshInstanceCount += instanceCount;
      if (object.isInstancedMesh) totalInstancedBatchCount += 1;
      if (object.isInstancedMesh) totalInstancedInstanceCount += object.count;
    }
    if (object.isMesh && object.geometry) {
      const triangles = object.geometry.index
        ? object.geometry.index.count / 3
        : (object.geometry.attributes.position?.count ?? 0) / 3;
      triangleEstimate += triangles * (object.isInstancedMesh ? object.count : 1);
    }
    if (object.castShadow) shadowCasterCount += object.isInstancedMesh ? object.count : 1;
  });
  return {
    totalDrawCallEstimate: drawCallEstimate,
    totalTriangleEstimate: Math.ceil(triangleEstimate),
    shadowCasterCount,
    totalMeshInstanceCount,
    totalInstancedBatchCount,
    totalInstancedInstanceCount,
  };
}

function resolveSegmentVerticalCylinderImpact(start, end, collider, projectileRadius, baseY) {
  const extraRadius = Math.max(0, Number(projectileRadius) || 0);
  const radius = Math.max(0.01, Number(collider.radius) || 0) + extraRadius;
  const height = Math.max(0.01, Number(collider.height) || radius * 2);
  const minY = baseY - extraRadius;
  const maxY = baseY + height + extraRadius;
  const offsetX = start.x - collider.x;
  const offsetZ = start.z - collider.z;
  const startInside = offsetX * offsetX + offsetZ * offsetZ <= radius * radius
    && start.y >= minY
    && start.y <= maxY;
  // Un projectile créé dans sa propre perche/volume de couverture doit pouvoir en sortir.
  if (startInside) return null;

  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const deltaZ = end.z - start.z;
  const candidates = [];
  const addCandidate = (progress) => {
    if (!Number.isFinite(progress) || progress < 0 || progress > 1) return;
    const y = start.y + deltaY * progress;
    if (y < minY || y > maxY) return;
    const x = start.x + deltaX * progress;
    const z = start.z + deltaZ * progress;
    if ((x - collider.x) ** 2 + (z - collider.z) ** 2 > radius * radius + 1e-8) return;
    candidates.push(progress);
  };

  const quadraticA = deltaX * deltaX + deltaZ * deltaZ;
  if (quadraticA > 1e-10) {
    const quadraticB = 2 * (offsetX * deltaX + offsetZ * deltaZ);
    const quadraticC = offsetX * offsetX + offsetZ * offsetZ - radius * radius;
    const discriminant = quadraticB * quadraticB - 4 * quadraticA * quadraticC;
    if (discriminant >= 0) {
      const root = Math.sqrt(discriminant);
      addCandidate((-quadraticB - root) / (2 * quadraticA));
      addCandidate((-quadraticB + root) / (2 * quadraticA));
    }
  }
  if (Math.abs(deltaY) > 1e-10) {
    addCandidate((minY - start.y) / deltaY);
    addCandidate((maxY - start.y) / deltaY);
  }
  if (candidates.length === 0) return null;
  return start.clone().lerp(end, Math.min(...candidates));
}

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.currentBiome = 'jungle';
    this.playableRadius = 300;
    this._disposed = false;
    this.reducedMotion = false;
    this.pillars = [];
    this.treePerches = [];
    this.runes = [];
    this.obstacleColliders = [];
    this.projectileCoverColliders = [];
    this.thermalFootprints = [];
    this.particles = null;
    this.rainParticles = null;
    this.sandParticles = null;
    this.deathworldFlora = [];
    this.deathworldFloraBatches = [];
    this.deathworldCreatures = [];
    this.deathworldCreatureMesh = null;
    this.deathworldCreatureDummy = new THREE.Object3D();
    this.deathworldFloraMatrix = new THREE.Matrix4();
    this.deathworldAnimationTime = 0;
    this.acidRainActive = false;
    this.sandstormActive = false;
    this.activeWeatherEvent = null;
    this.thermalStormParticles = null;
    this.environmentProps = [];
    this.pointsOfInterest = [];
    this.discoveredPoiIds = new Set();
    this.hazardZones = [];
    this.hazardSignals = [];
    this.propRoot = null;
    this.propBuilder = null;
    this.propMetrics = { drawCallEstimate: 0, triangleEstimate: 0 };
    this.propFootprints = [];
    this.staticInstanceBatches = [];
    this.textureLoader = new THREE.TextureLoader();
    this.textureCache = new Map();

    this.biomeGroup = new THREE.Group();
    this.biomeGroup.name = 'hunt-environment-root';
    this.scene.add(this.biomeGroup);
    this.createLighting();
  }

  createLighting() {
    this.ambientLight = new THREE.AmbientLight(0x607f96, 1.2);
    this.ambientLight.name = 'hunt-readability-ambient-light';
    this.scene.add(this.ambientLight);

    // Le remplissage hémisphérique garde les silhouettes et les routes lisibles
    // même quand la lumière directionnelle frappe le décor en contre-jour.
    this.hemisphereLight = new THREE.HemisphereLight(0x75bfd2, 0x171c24, 1.05);
    this.hemisphereLight.name = 'hunt-biome-hemisphere-fill';
    this.hemisphereLight.position.set(0, 180, 0);
    this.scene.add(this.hemisphereLight);

    // La source est placée côté joueur pour éclairer les faces réellement vues
    // pendant l'approche, tout en conservant les ombres portées et le rim coloré.
    this.mainLight = new THREE.DirectionalLight(0x9beaff, 1.8);
    this.mainLight.name = 'hunt-forward-key-light';
    this.mainLight.position.set(-180, 280, 220);
    this.mainLight.castShadow = true;
    this.mainLight.shadow.mapSize.set(2048, 2048);
    this.mainLight.shadow.bias = -0.00025;
    this.mainLight.shadow.normalBias = 0.035;
    this.scene.add(this.mainLight);

    this.sunSphere = new THREE.Mesh(
      new THREE.SphereGeometry(25, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0x44d0ff }),
    );
    this.sunSphere.position.copy(this.mainLight.position);
    this.scene.add(this.sunSphere);
  }

  getTexture(path, repeat = 8) {
    const key = `${path}:${repeat}`;
    if (this.textureCache.has(key)) return this.textureCache.get(key);

    // TextureLoader depends on browser image primitives. A null map keeps the
    // procedural geometry usable in Node tests and remains a valid PBR fallback.
    if (typeof document === 'undefined' || typeof Image === 'undefined') {
      this.textureCache.set(key, null);
      return null;
    }

    const texture = this.textureLoader.load(
      path,
      undefined,
      undefined,
      () => console.warn(`Texture indisponible, fallback procédural conservé: ${path}`),
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat, repeat);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    this.textureCache.set(key, texture);
    return texture;
  }

  createTexturedMaterial({
    color,
    path,
    repeat = 5,
    roughness = 0.85,
    metalness = 0.05,
    emissive = 0x000000,
    emissiveIntensity = 0,
  }) {
    return new THREE.MeshStandardMaterial({
      color,
      map: this.getTexture(path, repeat),
      roughness,
      metalness,
      emissive,
      emissiveIntensity,
    });
  }

  clearBiome() {
    if (!this.biomeGroup) return false;
    const geometries = new Set();
    const materials = new Set();
    this.biomeGroup.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) {
        const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
        objectMaterials.forEach((material) => materials.add(material));
      }
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    this.propBuilder?.geometryCache?.forEach((geometry) => {
      if (!geometries.has(geometry)) geometry.dispose();
    });
    this.propBuilder?.materialCache?.forEach((material) => {
      if (!materials.has(material)) material.dispose();
    });
    this.biomeGroup.clear();
    this.propBuilder = null;
    this.propRoot = null;
    this.environmentProps = [];
    this.pointsOfInterest = [];
    this.hazardZones = [];
    this.hazardSignals = [];
    this.propMetrics = { drawCallEstimate: 0, triangleEstimate: 0 };
    this.propFootprints = [];
    this.staticInstanceBatches = [];
    this.pillars = [];
    this.treePerches = [];
    this.runes = [];
    this.obstacleColliders = [];
    this.projectileCoverColliders = [];
    this.thermalFootprints = [];
    this.particles = null;
    this.rainParticles = null;
    this.sandParticles = null;
    this.deathworldFlora = [];
    this.deathworldFloraBatches = [];
    this.deathworldCreatures = [];
    this.deathworldCreatureMesh = null;
    this.deathworldAnimationTime = 0;
    this.acidRainActive = false;
    this.sandstormActive = false;
    this.activeWeatherEvent = null;
    this.thermalStormParticles = null;
    return true;
  }

  setBiome(biomeType) {
    if (this._disposed) return false;
    this.currentBiome = BIOME_DEFINITIONS[biomeType] ? biomeType : 'jungle';
    this.clearBiome();
    this.propFootprints = getBiomePropPlan(this.currentBiome).props
      .filter((prop) => Number(prop.colliderRadius) > 0)
      .map((prop) => ({
        id: prop.id,
        x: prop.position[0],
        z: prop.position[2],
        radius: prop.colliderRadius * (Number(prop.scale) || 1),
      }));

    const style = BIOME_STYLE[this.currentBiome];
    this.scene.background = new THREE.Color(style.background);
    this.scene.fog = new THREE.FogExp2(style.background, style.fog);
    this.ambientLight.color.setHex(style.ambient);
    this.ambientLight.intensity = style.ambientIntensity;
    this.hemisphereLight.color.setHex(style.hemisphereSky);
    this.hemisphereLight.groundColor.setHex(style.hemisphereGround);
    this.hemisphereLight.intensity = style.hemisphereIntensity;
    this.mainLight.color.setHex(style.key);
    this.mainLight.intensity = style.keyIntensity;
    this.sunSphere.material.color.setHex(style.sun);
    this.createTerrain(style.ground);

    if (this.currentBiome === 'jungle') {
      this.createAncientRuins();
      this.createAlienFoliage();
      this.createDriftingParticles(0x00f0ff, 650);
    } else if (this.currentBiome === 'hive_lv426') {
      this.createHiveResinPillars();
      this.createDriftingParticles(0x00ff44, 500);
    } else if (this.currentBiome === 'ryushi_desert') {
      this.createDesertDunes();
    } else if (this.currentBiome === 'genna_deathworld') {
      this.createGennaDeathworld();
      this.createDriftingParticles(0xbaff69, 520);
    } else {
      this.createColosseumPillars();
      this.createDriftingParticles(0xff3300, 450);
    }

    this.buildBiomeProps();
    this.sunSphere.visible = this.biomeGroup.visible && this.currentBiome !== 'hive_lv426';
    this.setReducedMotion(this.reducedMotion);
    return true;
  }

  resolveLegacyPlacement(candidateX, candidateZ, legacyRadius, stableKey = '') {
    const radius = Math.max(0.1, Number(legacyRadius) || 0.1);
    const margin = 3;
    const isClear = (x, z) => this.propFootprints.every((footprint) => (
      Math.hypot(x - footprint.x, z - footprint.z) >= radius + footprint.radius + margin
    ));
    if (isClear(candidateX, candidateZ)) return { x: candidateX, z: candidateZ };

    let hash = 2166136261;
    const hashSource = `${this.currentBiome}:${stableKey}`;
    for (let index = 0; index < hashSource.length; index += 1) {
      hash ^= hashSource.charCodeAt(index);
      hash = Math.imul(hash, 16777619) >>> 0;
    }
    const phase = (hash / 0xffffffff) * Math.PI * 2;
    const stepDistance = Math.max(6, Math.min(16, radius * 0.65 + 4));
    const maximumRadius = this.playableRadius - radius - margin;
    for (let ring = 1; ring <= 14; ring += 1) {
      const offset = ring * stepDistance;
      for (let step = 0; step < 24; step += 1) {
        const angle = phase + step * 2.399963229728653 + ring * 0.19;
        const x = candidateX + Math.cos(angle) * offset;
        const z = candidateZ + Math.sin(angle) * offset;
        if (Math.hypot(x, z) > maximumRadius) continue;
        if (isClear(x, z)) return { x, z };
      }
    }
    for (let step = 0; step < 48; step += 1) {
      const angle = phase + (step / 48) * Math.PI * 2;
      const distance = Math.max(24, maximumRadius * (0.45 + (step % 4) * 0.12));
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      if (isClear(x, z)) return { x, z };
    }
    return { x: candidateX, z: candidateZ };
  }

  getPropFootprints() {
    return this.propFootprints.map((footprint) => ({ ...footprint }));
  }

  getPropColliderParts(prop) {
    const nominalHeight = PROP_HEIGHTS[prop.type] ?? Math.max(6, Number(prop.colliderRadius) * 1.8);
    if (ARCH_PROP_TYPES.has(prop.type)) {
      return [
        { part: 'left_support', x: -5.6, z: 0, radius: 2.1, height: nominalHeight },
        { part: 'right_support', x: 5.6, z: 0, radius: 2.1, height: nominalHeight },
      ];
    }
    if (FACILITY_PROP_TYPES.has(prop.type)) {
      return [
        { part: 'core', x: 0, z: 0, radius: 5.8, height: 8 },
        { part: 'west_module', x: -8.3, z: 1.2, radius: 3.6, height: 6 },
        { part: 'east_module', x: 8.1, z: -1.1, radius: 3.6, height: 6 },
      ];
    }
    if (WRECK_PROP_TYPES.has(prop.type)) {
      return [
        { part: 'wreck_core', x: 0, z: 0, radius: 5.8, height: 8 },
        { part: 'wreck_module', x: -7.4, z: 1.2, radius: 3.8, height: 6 },
      ];
    }
    if (prop.type === 'cover_cluster') {
      const layout = getCoverClusterLayout(prop.instances);
      const anchors = [layout[0], layout[Math.floor((layout.length - 1) / 2)], layout.at(-1)];
      return ['cover_left', 'cover_center', 'cover_right'].map((part, index) => ({
        part,
        x: anchors[index].x,
        z: anchors[index].z,
        radius: 3.2,
        height: 5.8,
      }));
    }
    if (PEN_PROP_TYPES.has(prop.type)) {
      return [
        { part: 'north_rail', x: 0, z: -7, radius: 4.1, height: 4.8 },
        { part: 'south_rail', x: 0, z: 7, radius: 4.1, height: 4.8 },
        { part: 'west_rail', x: -7, z: 0, radius: 4.1, height: 4.8 },
        { part: 'east_rail', x: 7, z: 0, radius: 4.1, height: 4.8 },
      ];
    }
    if (prop.type === 'water_tower') {
      return [
        { part: 'north_west_leg', x: -3, z: -3, radius: 0.9, height: 18 },
        { part: 'north_east_leg', x: 3, z: -3, radius: 0.9, height: 18 },
        { part: 'south_west_leg', x: -3, z: 3, radius: 0.9, height: 18 },
        { part: 'south_east_leg', x: 3, z: 3, radius: 0.9, height: 18 },
        { part: 'tank', x: 0, z: 0, radius: 5.5, height: 11.5, baseYOffset: 16.5, blocksActors: false, blocksProjectiles: true },
      ];
    }
    if (SHRINE_PROP_TYPES.has(prop.type)) {
      return [
        { part: 'dais', x: 0, z: 0, radius: 11.5, height: 2.8 },
        { part: 'focus', x: 0, z: 0, radius: 2.7, height: 11, baseYOffset: 2.8, blocksActors: false, blocksProjectiles: true },
      ];
    }
    return [{
      part: 'body',
      x: 0,
      z: 0,
      radius: Number(prop.colliderRadius) || 0,
      height: nominalHeight,
    }];
  }

  buildBiomeProps() {
    const plan = getBiomePropPlan(this.currentBiome);
    this.propBuilder = new BiomePropBuilder({
      createTexturedMaterial: (options) => this.createTexturedMaterial(options),
    });
    const build = this.propBuilder.build(plan);
    this.propRoot = build.root;
    this.environmentProps = build.props;
    this.pointsOfInterest = build.pointsOfInterest;
    this.hazardZones = build.hazardZones;
    this.propMetrics = { ...build.metrics };

    for (const prop of this.environmentProps) {
      const terrainY = this.sampleHeight(prop.position[0], prop.position[2]);
      prop.position[1] = terrainY;
      prop.mesh.position.y = terrainY;
    }
    for (const pointOfInterest of this.pointsOfInterest) {
      const terrainY = this.sampleHeight(pointOfInterest.position);
      pointOfInterest.position.y = terrainY;
      pointOfInterest.mesh.position.y = terrainY;
      this.applyPointOfInterestDiscoveryState(pointOfInterest);
    }
    for (const hazard of this.hazardZones) {
      const terrainY = this.sampleHeight(hazard.position);
      hazard.position.y = terrainY;
      hazard.mesh.position.y = terrainY;
    }
    this.biomeGroup.add(this.propRoot);

    for (const prop of this.environmentProps) {
      const scale = Number(prop.scale) || 1;
      const colliderRadius = Number(prop.colliderRadius) || 0;
      prop.colliderParts = [];
      if (colliderRadius > 0) {
        const rotation = Number(prop.rotation) || 0;
        const cosine = Math.cos(rotation);
        const sine = Math.sin(rotation);
        for (const part of this.getPropColliderParts(prop)) {
          const blocksActors = part.blocksActors !== false;
          if (blocksActors && this.obstacleColliders.length >= ENVIRONMENT_PERFORMANCE_BUDGETS.maxColliders) continue;
          const localX = part.x * scale;
          const localZ = part.z * scale;
          const collider = {
            x: prop.position[0] + cosine * localX + sine * localZ,
            z: prop.position[2] - sine * localX + cosine * localZ,
            radius: part.radius * scale,
            height: part.height * scale,
            baseY: prop.position[1] + (Number(part.baseYOffset) || 0) * scale,
            type: 'environment_prop',
            part: part.part,
            sourceId: prop.id,
            blocksActors,
            blocksProjectiles: part.blocksProjectiles !== false,
          };
          if (blocksActors) this.obstacleColliders.push(collider);
          else this.projectileCoverColliders.push(collider);
          prop.colliderParts.push(collider);
        }
      }
      if (Number.isFinite(prop.perchHeight) && this.currentBiome !== 'genna_deathworld') {
        this.treePerches.push(new THREE.Vector3(
          prop.position[0],
          prop.position[1] + prop.perchHeight * scale,
          prop.position[2],
        ));
      }
    }
    return this.getLevelDesignSnapshot();
  }

  getLevelDesignSnapshot() {
    const totalMetrics = estimateRenderCost(this.biomeGroup);
    return Object.freeze({
      biomeId: this.currentBiome,
      propCount: this.environmentProps.length,
      pointOfInterestCount: this.pointsOfInterest.length,
      hazardCount: this.hazardZones.length,
      colliderCount: this.obstacleColliders.length,
      projectileOnlyColliderCount: this.projectileCoverColliders.length,
      colliderPartCount: this.environmentProps.reduce(
        (total, prop) => total + (prop.colliderParts?.length ?? 0), 0,
      ),
      staticInstanceBatchCount: this.staticInstanceBatches.length,
      staticInstanceCount: this.staticInstanceBatches.reduce(
        (total, batch) => total + batch.count, 0,
      ),
      deathworldFloraBatchCount: this.deathworldFloraBatches.length,
      deathworldFloraInstanceCount: this.deathworldFloraBatches.reduce(
        (total, batch) => total + batch.count, 0,
      ),
      propDrawCallEstimate: this.propMetrics.drawCallEstimate,
      propTriangleEstimate: this.propMetrics.triangleEstimate,
      // Compatibilité : ces deux métriques restent celles de la passe ajoutée et de ses budgets.
      drawCallEstimate: this.propMetrics.drawCallEstimate,
      triangleEstimate: this.propMetrics.triangleEstimate,
      ...totalMetrics,
      activeWeatherEvent: this.activeWeatherEvent,
    });
  }

  applyPointOfInterestDiscoveryState(pointOfInterest, scanned = this.discoveredPoiIds.has(pointOfInterest?.id)) {
    if (!pointOfInterest) return false;
    const isScanned = Boolean(scanned);
    pointOfInterest.scanned = isScanned;
    if (pointOfInterest.mesh?.userData) pointOfInterest.mesh.userData.scanned = isScanned;

    const indicator = pointOfInterest.indicator;
    const material = indicator?.material;
    if (indicator && material) {
      indicator.userData.poiDiscoveryVisual ??= {
        emissiveIntensity: Number(material.emissiveIntensity) || 0,
        opacity: Number.isFinite(material.opacity) ? material.opacity : 1,
        transparent: material.transparent === true,
      };
      const activeVisual = indicator.userData.poiDiscoveryVisual;
      material.emissiveIntensity = isScanned ? 0.34 : activeVisual.emissiveIntensity;
      material.opacity = isScanned ? 0.54 : activeVisual.opacity;
      material.transparent = isScanned ? true : activeVisual.transparent;
      material.needsUpdate = true;
    }
    return isScanned;
  }

  setDiscoveredPoiIds(ids = []) {
    this.discoveredPoiIds = new Set(
      (Array.isArray(ids) ? ids : [])
        .filter((id) => typeof id === 'string'),
    );
    for (const pointOfInterest of this.pointsOfInterest) {
      this.applyPointOfInterestDiscoveryState(
        pointOfInterest,
        this.discoveredPoiIds.has(pointOfInterest.id),
      );
    }
    return [...this.discoveredPoiIds];
  }

  getNearbyPointOfInterest(position) {
    const origin = toWorldVector(position);
    if (!origin) return null;
    let nearest = null;
    let nearestDistance = Infinity;
    for (const pointOfInterest of this.pointsOfInterest) {
      const distance = horizontalDistance(origin, pointOfInterest.position);
      if (pointOfInterest.scanned) continue;
      if (distance <= pointOfInterest.interactionRadius && distance < nearestDistance) {
        nearest = pointOfInterest;
        nearestDistance = distance;
      }
    }
    return nearest;
  }

  interactWithPointOfInterest(position) {
    const pointOfInterest = this.getNearbyPointOfInterest(position);
    if (!pointOfInterest || pointOfInterest.scanned) return false;
    this.discoveredPoiIds.add(pointOfInterest.id);
    this.applyPointOfInterestDiscoveryState(pointOfInterest, true);
    return {
      type: 'point_of_interest',
      poiId: pointOfInterest.id,
      poiType: pointOfInterest.type,
      interactionType: pointOfInterest.interactionType,
      label: pointOfInterest.label,
      message: pointOfInterest.message,
      honor: Number(pointOfInterest.honor) || 0,
    };
  }

  updateHazardZones(delta, player = null) {
    const frameDelta = Number.isFinite(delta) ? Math.max(0, delta) : 0;
    const signals = [];
    for (const hazard of this.hazardZones) {
      hazard.cooldown = Math.max(0, hazard.cooldown - frameDelta);
      hazard.pulsePhase += frameDelta * 1.8;
      const pulseTarget = hazard.pulseRoot ?? (hazard.boundaryRing ? null : hazard.mesh);
      if (!this.reducedMotion && pulseTarget) {
        const pulse = 1 + Math.sin(hazard.pulsePhase) * 0.035;
        pulseTarget.scale.setScalar(pulse);
      }
      if (!player?.position?.isVector3) continue;
      const distance = horizontalDistance(player.position, hazard.position);
      hazard.warned = distance <= hazard.radius * 1.45;
      if (distance > hazard.radius || hazard.cooldown > 0) continue;
      hazard.cooldown = Math.max(0.25, Number(hazard.interval) || 2.5);
      const signal = {
        type: 'environment_hazard',
        hazardId: hazard.id,
        hazardType: hazard.type,
        damage: Math.max(0, Number(hazard.damage) || 0),
        status: hazard.status ?? null,
        message: hazard.message ?? '',
      };
      signals.push(signal);
      this.hazardSignals.push(signal);
    }
    return signals;
  }

  drainHazardSignals() {
    const signals = this.hazardSignals.slice();
    this.hazardSignals.length = 0;
    return signals;
  }

  sampleHeight(xOrPosition, zValue) {
    const vector = toWorldVector(xOrPosition);
    const x = vector ? vector.x : Number(xOrPosition) || 0;
    const z = vector ? vector.z : Number(zValue) || 0;
    const distance = Math.hypot(x, z);
    let height = Math.sin(x * 0.03) * Math.cos(z * 0.03) * 4;
    if (distance > 330) height += Math.pow(distance - 330, 1.4) * 0.5;
    return height;
  }

  isSpawnPositionClear(position, clearance = 4) {
    if (!position?.isVector3 || Math.hypot(position.x, position.z) > this.playableRadius) return false;
    const obstacleFree = this.obstacleColliders.every((collider) => (
      Math.hypot(position.x - collider.x, position.z - collider.z)
        >= collider.radius + clearance
    ));
    if (!obstacleFree) return false;
    return this.hazardZones.every((hazard) => (
      horizontalDistance(position, hazard.position) >= hazard.radius + clearance
    ));
  }

  constrainToPlayableArea(position, margin = 0, { snapToGround = false } = {}) {
    if (!position?.isVector3) return false;
    const safeRadius = Math.max(1, this.playableRadius - Math.max(0, Number(margin) || 0));
    const radius = Math.hypot(position.x, position.z);
    if (radius > safeRadius) {
      const scale = Math.max(0, safeRadius - 0.000001) / radius;
      position.x *= scale;
      position.z *= scale;
    }
    if (snapToGround) position.y = this.sampleHeight(position);
    return position;
  }

  getSafeSpawnPosition(preferred, { clearance = 4 } = {}) {
    const requested = toWorldVector(preferred) ?? new THREE.Vector3(0, 0, 0);
    const base = requested.clone();
    base.y = 0;
    const radius = Math.hypot(base.x, base.z);
    if (radius > this.playableRadius) base.multiplyScalar(this.playableRadius / radius);
    base.y = this.sampleHeight(base);
    if (this.isSpawnPositionClear(base, clearance)) return base;

    for (let ring = 1; ring <= 8; ring += 1) {
      const offsetRadius = ring * 9;
      for (let step = 0; step < 16; step += 1) {
        const angle = step * 2.399963229728653 + ring * 0.31;
        const candidate = new THREE.Vector3(
          base.x + Math.cos(angle) * offsetRadius,
          0,
          base.z + Math.sin(angle) * offsetRadius,
        );
        const candidateRadius = Math.hypot(candidate.x, candidate.z);
        if (candidateRadius > this.playableRadius) continue;
        candidate.y = this.sampleHeight(candidate);
        if (this.isSpawnPositionClear(candidate, clearance)) return candidate;
      }
    }
    const fallback = new THREE.Vector3(0, this.sampleHeight(0, 0), 0);
    return fallback;
  }

  getEncounterSockets(kind = 'reinforcement', count = 4) {
    const safeCount = Math.max(1, Math.min(12, Math.floor(Number(count) || 4)));
    const plan = getBiomePropPlan(this.currentBiome);
    const normalizedKind = String(kind).toLowerCase();
    const eggTypes = new Set(['egg_nursery', 'royal_dais', 'hive_sample']);
    let anchors;
    if (normalizedKind.includes('egg')) {
      anchors = [
        ...plan.props.filter((prop) => eggTypes.has(prop.type)),
        ...plan.pointsOfInterest.filter((poi) => eggTypes.has(poi.type)),
      ];
    } else if (normalizedKind.includes('boss')) {
      anchors = plan.props.filter((prop) => ['kalisk_nest', 'blooding_dais', 'royal_dais'].includes(prop.type));
    } else {
      anchors = [...plan.pointsOfInterest, ...plan.props];
    }
    if (anchors.length === 0) anchors = [...plan.pointsOfInterest, ...plan.props];

    const sockets = [];
    for (let index = 0; index < safeCount; index += 1) {
      const anchor = anchors[index % anchors.length];
      const [x, , z] = anchor.position;
      const angle = index * 2.399963229728653 + anchors.indexOf(anchor) * 0.73;
      const offset = normalizedKind.includes('egg') ? 7 + (index % 2) * 4 : 14 + (index % 3) * 7;
      const socket = this.getSafeSpawnPosition(new THREE.Vector3(
        x + Math.cos(angle) * offset,
        0,
        z + Math.sin(angle) * offset,
      ), { clearance: normalizedKind.includes('egg') ? 2.5 : 4 });
      sockets.push(socket);
    }
    return sockets;
  }

  resolveProjectileCoverImpact(start, end, projectileRadius = 0.25) {
    if (!start?.isVector3 || !end?.isVector3) return null;
    let nearest = null;
    for (const collider of [...this.obstacleColliders, ...this.projectileCoverColliders]) {
      if (collider.blocksProjectiles === false) continue;
      const baseY = Number.isFinite(collider.baseY)
        ? collider.baseY
        : this.sampleHeight(collider.x, collider.z);
      const point = resolveSegmentVerticalCylinderImpact(start, end, collider, projectileRadius, baseY);
      if (!point) continue;
      const distanceSquared = start.distanceToSquared(point);
      if (!nearest || distanceSquared < nearest.distanceSquared) {
        nearest = {
          point,
          collider,
          sourceId: collider.sourceId ?? null,
          distanceSquared,
        };
      }
    }
    return nearest;
  }

  isProjectilePathBlocked(start, end, projectileRadius = 0.25) {
    return this.resolveProjectileCoverImpact(start, end, projectileRadius) !== null;
  }

  createTerrain(colorHex) {
    const biome = BIOME_DEFINITIONS[this.currentBiome];
    const geometry = new THREE.PlaneGeometry(800, 800, 96, 96);
    const positions = geometry.attributes.position;

    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const distance = Math.hypot(x, y);
      let height = Math.sin(x * 0.03) * Math.cos(y * 0.03) * 4;
      if (distance > 330) height += Math.pow(distance - 330, 1.4) * 0.5;
      positions.setZ(i, height);
    }
    geometry.computeVertexNormals();

    const material = this.createTexturedMaterial({
      color: colorHex,
      path: biome.texture,
      repeat: 18,
      roughness: 0.92,
    });
    const ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.biomeGroup.add(ground);
  }

  createAncientRuins() {
    const stone = this.createTexturedMaterial({
      color: 0x4a5360,
      path: '/assets/textures/yautja-stone.webp',
      repeat: 4,
      roughness: 0.82,
      metalness: 0.12,
    });
    const altarPlacement = this.resolveLegacyPlacement(0, 0, 16, 'ancient-altar');
    const altarGround = this.sampleHeight(altarPlacement.x, altarPlacement.z);
    const altar = new THREE.Mesh(new THREE.CylinderGeometry(14, 18, 4, 12), stone);
    altar.position.set(altarPlacement.x, altarGround + 2, altarPlacement.z);
    altar.receiveShadow = true;
    this.biomeGroup.add(altar);
    this.obstacleColliders.push({ ...altarPlacement, radius: 16, height: 4, baseY: altarGround, blocksProjectiles: true, sourceId: 'jungle-ancient-altar' });

    const rune = new THREE.Mesh(
      new THREE.RingGeometry(4, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xff2100, side: THREE.DoubleSide }),
    );
    rune.rotation.x = -Math.PI / 2;
    rune.position.set(altarPlacement.x, altarGround + 4.02, altarPlacement.z);
    this.biomeGroup.add(rune);
    this.runes.push(rune);

    const positions = [
      [60, 60], [-60, 60], [60, -60], [-60, -60],
      [120, 0], [-120, 0], [0, 120], [0, -120],
      [180, 180], [-180, 180], [180, -180], [-180, -180],
    ];
    positions.forEach(([candidateX, candidateZ], index) => {
      const { x, z } = this.resolveLegacyPlacement(candidateX, candidateZ, 5, `ruin-pillar-${index + 1}`);
      const ground = this.sampleHeight(x, z);
      const group = new THREE.Group();
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(7, 45, 7), stone);
      pillar.position.y = 22.5;
      pillar.castShadow = true;
      group.add(pillar);
      const beacon = new THREE.Mesh(
        new THREE.OctahedronGeometry(2),
        new THREE.MeshBasicMaterial({ color: 0x00ff66 }),
      );
      beacon.position.y = 46;
      group.add(beacon);
      group.position.set(x, ground, z);
      this.biomeGroup.add(group);
      this.pillars.push(group);
      this.treePerches.push(new THREE.Vector3(x, ground + 45, z));
      this.obstacleColliders.push({ x, z, radius: 5, height: 45, baseY: ground, blocksProjectiles: true, sourceId: `jungle-ruin-pillar-${index + 1}` });
    });
  }

  createAlienFoliage() {
    const trunk = this.createTexturedMaterial({
      color: 0x32283a,
      path: '/assets/textures/jungle-bark.webp',
      repeat: 5,
      roughness: 0.98,
    });
    const foliage = new THREE.MeshStandardMaterial({ color: 0x064456, roughness: 0.5 });
    const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(2.2, 4.5, 36, 9), trunk, 45);
    const crowns = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(14), foliage, 45);
    trunks.name = STATIC_INSTANCE_BATCH_NAMES.jungleTrunks;
    crowns.name = STATIC_INSTANCE_BATCH_NAMES.jungleCrowns;
    trunks.castShadow = true;
    crowns.castShadow = true;
    trunks.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    crowns.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    trunks.userData.staticEnvironmentBatch = true;
    crowns.userData.staticEnvironmentBatch = true;
    trunks.userData.texturePath = '/assets/textures/jungle-bark.webp';
    crowns.userData.texturePath = null;
    const transform = new THREE.Object3D();
    for (let i = 0; i < 45; i += 1) {
      const angle = (i / 45) * Math.PI * 2 + Math.sin(i * 4.17) * 0.14;
      const radius = 82 + ((i * 47) % 175);
      const candidateX = Math.cos(angle) * radius;
      const candidateZ = Math.sin(angle) * radius;
      const { x, z } = this.resolveLegacyPlacement(candidateX, candidateZ, 4.5, `tree-${i + 1}`);
      const ground = this.sampleHeight(x, z);
      transform.position.set(x, ground + 18, z);
      transform.updateMatrix();
      trunks.setMatrixAt(i, transform.matrix);
      transform.position.set(x, ground + 36, z);
      transform.updateMatrix();
      crowns.setMatrixAt(i, transform.matrix);
      this.treePerches.push(new THREE.Vector3(x, ground + 36, z));
      this.obstacleColliders.push({ x, z, radius: 4.5, height: 50, baseY: ground, blocksProjectiles: true, sourceId: `jungle-tree-${i + 1}` });
    }
    for (const batch of [trunks, crowns]) {
      batch.instanceMatrix.needsUpdate = true;
      batch.computeBoundingBox();
      batch.computeBoundingSphere();
      this.biomeGroup.add(batch);
      this.staticInstanceBatches.push(batch);
    }
  }

  createHiveResinPillars() {
    const resin = this.createTexturedMaterial({
      color: 0x1d3d2a,
      path: '/assets/textures/hive-resin.webp',
      repeat: 5,
      roughness: 0.3,
      metalness: 0.45,
    });
    const pillars = new THREE.InstancedMesh(new THREE.CylinderGeometry(3.5, 7, 40, 10), resin, 30);
    pillars.name = STATIC_INSTANCE_BATCH_NAMES.hivePillars;
    pillars.castShadow = true;
    pillars.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    pillars.userData.staticEnvironmentBatch = true;
    pillars.userData.texturePath = '/assets/textures/hive-resin.webp';
    const transform = new THREE.Object3D();
    for (let i = 0; i < 30; i += 1) {
      const angle = (i / 30) * Math.PI * 2;
      const radius = 70 + ((i * 61) % 170);
      const candidateX = Math.cos(angle) * radius;
      const candidateZ = Math.sin(angle) * radius;
      const { x, z } = this.resolveLegacyPlacement(candidateX, candidateZ, 5.5, `resin-pillar-${i + 1}`);
      const ground = this.sampleHeight(x, z);
      transform.position.set(x, ground + 20, z);
      transform.updateMatrix();
      pillars.setMatrixAt(i, transform.matrix);
      this.treePerches.push(new THREE.Vector3(x, ground + 40, z));
      this.obstacleColliders.push({ x, z, radius: 5.5, height: 40, baseY: ground, blocksProjectiles: true, sourceId: `hive-resin-pillar-${i + 1}` });
    }
    pillars.instanceMatrix.needsUpdate = true;
    pillars.computeBoundingBox();
    pillars.computeBoundingSphere();
    this.biomeGroup.add(pillars);
    this.staticInstanceBatches.push(pillars);
  }

  createDesertDunes() {
    const rock = this.createTexturedMaterial({
      color: 0x8a5528,
      path: '/assets/textures/ryushi-sand.webp',
      repeat: 4,
      roughness: 1,
    });
    for (let i = 0; i < 25; i += 1) {
      const angle = (i / 25) * Math.PI * 2 + 0.12;
      const radius = 65 + ((i * 79) % 190);
      const rockRadius = 12 + (i % 4) * 2.5;
      const candidateX = Math.cos(angle) * radius;
      const candidateZ = Math.sin(angle) * radius;
      const { x, z } = this.resolveLegacyPlacement(candidateX, candidateZ, rockRadius, `rock-${i + 1}`);
      const ground = this.sampleHeight(x, z);
      const mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(rockRadius), rock);
      mesh.position.set(x, ground + 8, z);
      mesh.castShadow = true;
      this.biomeGroup.add(mesh);
      this.obstacleColliders.push({ x, z, radius: rockRadius, height: rockRadius * 1.55, baseY: ground, blocksProjectiles: true, sourceId: `ryushi-rock-${i + 1}` });
    }
  }

  createColosseumPillars() {
    const stone = this.createTexturedMaterial({
      color: 0x7a3028,
      path: '/assets/textures/yautja-stone.webp',
      repeat: 5,
      roughness: 0.6,
      metalness: 0.35,
    });
    const pillars = new THREE.InstancedMesh(new THREE.BoxGeometry(10, 50, 10), stone, 20);
    pillars.name = STATIC_INSTANCE_BATCH_NAMES.primePillars;
    pillars.castShadow = true;
    pillars.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    pillars.userData.staticEnvironmentBatch = true;
    pillars.userData.texturePath = '/assets/textures/yautja-stone.webp';
    const transform = new THREE.Object3D();
    for (let i = 0; i < 20; i += 1) {
      const angle = (i / 20) * Math.PI * 2;
      const candidateX = Math.cos(angle) * 160;
      const candidateZ = Math.sin(angle) * 160;
      const { x, z } = this.resolveLegacyPlacement(candidateX, candidateZ, 7, `arena-pillar-${i + 1}`);
      const ground = this.sampleHeight(x, z);
      transform.position.set(x, ground + 25, z);
      transform.updateMatrix();
      pillars.setMatrixAt(i, transform.matrix);
      this.treePerches.push(new THREE.Vector3(x, ground + 50, z));
      this.obstacleColliders.push({ x, z, radius: 7, height: 50, baseY: ground, blocksProjectiles: true, sourceId: `prime-arena-pillar-${i + 1}` });
    }
    pillars.instanceMatrix.needsUpdate = true;
    pillars.computeBoundingBox();
    pillars.computeBoundingSphere();
    this.biomeGroup.add(pillars);
    this.staticInstanceBatches.push(pillars);
  }

  /**
   * Compose un secteur de Genna lisible pour la chasse : la zone centrale
   * reste dégagée, tandis que les plantes prédatrices forment une couronne de
   * perches et d'obstacles. Les matériaux et géométries sont partagés afin de
   * limiter les allocations et les appels GPU sur mobile.
   */
  createGennaDeathworld() {
    const stalkMaterial = this.createTexturedMaterial({
      color: 0x455534,
      path: DEATHWORLD_FLORA_TEXTURE_PATH,
      repeat: 3,
      roughness: 0.78,
      metalness: 0.03,
    });
    const crownMaterial = this.createTexturedMaterial({
      color: 0x758b43,
      path: DEATHWORLD_FLORA_TEXTURE_PATH,
      repeat: 2,
      roughness: 0.58,
      metalness: 0.02,
      emissive: 0x17280a,
      emissiveIntensity: 0.52,
    });
    const throatMaterial = new THREE.MeshStandardMaterial({
      color: 0xa4df47,
      emissive: 0x4c7c13,
      emissiveIntensity: 1.25,
      roughness: 0.42,
      metalness: 0.04,
    });
    const stalkGeometry = new THREE.CylinderGeometry(1.05, 2.15, 12, 7);
    const crownGeometry = new THREE.ConeGeometry(4.5, 8, 7);
    const tendrilGeometry = new THREE.ConeGeometry(0.34, 6.4, 5);
    const throatGeometry = new THREE.SphereGeometry(1.45, 10, 7);
    const createFloraBatch = ({
      name,
      geometry,
      material,
      count,
      castShadow = false,
      receiveShadow = false,
      texturePath = null,
    }) => {
      const batch = new THREE.InstancedMesh(geometry, material, count);
      batch.name = name;
      batch.castShadow = castShadow;
      batch.receiveShadow = receiveShadow;
      batch.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      batch.frustumCulled = false;
      batch.userData.deathworldFloraBatch = true;
      batch.userData.texturePath = texturePath;
      return batch;
    };
    const shadowStalks = createFloraBatch({
      name: DEATHWORLD_FLORA_BATCH_NAMES.shadowStalks,
      geometry: stalkGeometry,
      material: stalkMaterial,
      count: 7,
      castShadow: true,
      receiveShadow: true,
      texturePath: DEATHWORLD_FLORA_TEXTURE_PATH,
    });
    const stalks = createFloraBatch({
      name: DEATHWORLD_FLORA_BATCH_NAMES.stalks,
      geometry: stalkGeometry,
      material: stalkMaterial,
      count: 21,
      receiveShadow: true,
      texturePath: DEATHWORLD_FLORA_TEXTURE_PATH,
    });
    const crowns = createFloraBatch({
      name: DEATHWORLD_FLORA_BATCH_NAMES.crowns,
      geometry: crownGeometry,
      material: crownMaterial,
      count: 28,
      texturePath: DEATHWORLD_FLORA_TEXTURE_PATH,
    });
    const throats = createFloraBatch({
      name: DEATHWORLD_FLORA_BATCH_NAMES.throats,
      geometry: throatGeometry,
      material: throatMaterial,
      count: 28,
    });
    const tendrils = createFloraBatch({
      name: DEATHWORLD_FLORA_BATCH_NAMES.tendrils,
      geometry: tendrilGeometry,
      material: crownMaterial,
      count: 84,
      texturePath: DEATHWORLD_FLORA_TEXTURE_PATH,
    });
    this.deathworldFloraBatches = [shadowStalks, stalks, crowns, throats, tendrils];
    let shadowStalkIndex = 0;
    let stalkIndex = 0;

    for (let i = 0; i < 28; i += 1) {
      const phase = i * 1.731;
      const angle = (i / 28) * Math.PI * 2 + Math.sin(phase) * 0.18;
      const radius = 56 + ((i * 67) % 198);
      const floraRadius = 3.4 + (i % 4) * 0.32;
      const candidateX = Math.cos(angle) * radius;
      const candidateZ = Math.sin(angle) * radius;
      const { x, z } = this.resolveLegacyPlacement(candidateX, candidateZ, floraRadius, `hostile-flora-${i + 1}`);
      const ground = this.sampleHeight(x, z);
      const heightScale = 0.78 + (i % 6) * 0.095;
      const stalkHeight = 12 * heightScale;
      const group = new THREE.Group();
      group.name = 'genna-hostile-flora-' + (i + 1);
      group.userData.hostileFlora = true;
      group.position.set(x, ground, z);
      group.rotation.y = phase * 0.37;

      // Ces contrôleurs légers préservent l API deathworldFlora et composent
      // les matrices des lots GPU sans créer de mesh rendu par plante.
      const stalk = new THREE.Object3D();
      stalk.name = `${group.name}-stalk-controller`;
      stalk.scale.set(0.82 + (i % 3) * 0.12, heightScale, 0.82 + ((i + 1) % 3) * 0.1);
      stalk.position.y = stalkHeight * 0.5;
      stalk.visible = false;
      stalk.geometry = stalkGeometry;
      stalk.material = stalkMaterial;
      stalk.userData.instancedFloraController = true;
      group.add(stalk);

      const crown = new THREE.Object3D();
      crown.name = `${group.name}-crown-controller`;
      crown.position.y = stalkHeight + 2.7;
      crown.rotation.z = Math.PI;
      crown.scale.set(0.82 + (i % 4) * 0.08, 0.72 + (i % 3) * 0.08, 0.82 + (i % 4) * 0.08);
      crown.visible = false;
      crown.geometry = crownGeometry;
      crown.material = crownMaterial;
      crown.userData.instancedFloraController = true;
      group.add(crown);

      const throat = new THREE.Object3D();
      throat.name = `${group.name}-throat-controller`;
      throat.position.y = stalkHeight + 3.9;
      throat.scale.set(1.12, 0.42, 1.12);
      throat.visible = false;
      throat.geometry = throatGeometry;
      throat.material = throatMaterial;
      throat.userData.instancedFloraController = true;
      group.add(throat);

      const tendrilControllers = [];
      for (let tendrilIndex = 0; tendrilIndex < 3; tendrilIndex += 1) {
        const tendrilAngle = (tendrilIndex / 3) * Math.PI * 2;
        const tendril = new THREE.Object3D();
        tendril.name = `${group.name}-tendril-${tendrilIndex + 1}-controller`;
        tendril.position.set(
          Math.cos(tendrilAngle) * 2.2,
          3.2 + (i % 2) * 0.45,
          Math.sin(tendrilAngle) * 2.2,
        );
        tendril.rotation.set(Math.sin(tendrilAngle) * 0.7, -tendrilAngle, Math.cos(tendrilAngle) * 0.7);
        tendril.visible = false;
        tendril.geometry = tendrilGeometry;
        tendril.material = crownMaterial;
        tendril.userData.instancedFloraController = true;
        group.add(tendril);
        tendrilControllers.push(tendril);
      }

      this.biomeGroup.add(group);
      const castsShadow = i % 4 === 0;
      this.deathworldFlora.push({
        group,
        stalk,
        crown,
        throat,
        tendrils: tendrilControllers,
        phase,
        swaySpeed: 0.48 + (i % 5) * 0.055,
        baseCrownRotation: crown.rotation.y,
        stalkBatch: castsShadow ? shadowStalks : stalks,
        stalkBatchIndex: castsShadow ? shadowStalkIndex++ : stalkIndex++,
        crownBatch: crowns,
        crownBatchIndex: i,
        throatBatch: throats,
        throatBatchIndex: i,
        tendrilBatch: tendrils,
        tendrilStartIndex: i * 3,
      });
      this.treePerches.push(new THREE.Vector3(x, Math.max(15.5, ground + stalkHeight + 6.4), z));
      this.obstacleColliders.push({
        x,
        z,
        radius: floraRadius,
        type: 'hostile_flora',
        height: stalkHeight + 8,
        baseY: ground,
        blocksProjectiles: true,
      });
    }

    this.biomeGroup.add(...this.deathworldFloraBatches);
    this.createDeathworldCreatureSwarm();
  }

  updateDeathworldFloraInstances() {
    if (this.deathworldFloraBatches.length === 0) return false;
    const matrix = this.deathworldFloraMatrix;
    const writePartMatrix = (group, part, batch, index) => {
      part.updateMatrix();
      matrix.multiplyMatrices(group.matrix, part.matrix);
      batch.setMatrixAt(index, matrix);
    };

    for (const flora of this.deathworldFlora) {
      flora.group.updateMatrix();
      writePartMatrix(flora.group, flora.stalk, flora.stalkBatch, flora.stalkBatchIndex);
      writePartMatrix(flora.group, flora.crown, flora.crownBatch, flora.crownBatchIndex);
      writePartMatrix(flora.group, flora.throat, flora.throatBatch, flora.throatBatchIndex);
      flora.tendrils.forEach((tendril, index) => {
        writePartMatrix(flora.group, tendril, flora.tendrilBatch, flora.tendrilStartIndex + index);
      });
    }
    this.deathworldFloraBatches.forEach((batch) => {
      batch.instanceMatrix.needsUpdate = true;
    });
    return true;
  }

  /** Une seule InstancedMesh donne vie au ciel sans multiplier les draw calls. */
  createDeathworldCreatureSwarm() {
    const creatureCount = 14;
    const geometry = new THREE.ConeGeometry(0.48, 1.75, 5);
    geometry.rotateX(Math.PI / 2);
    const material = new THREE.MeshStandardMaterial({
      color: 0x9dc76a,
      emissive: 0x385c20,
      emissiveIntensity: 0.95,
      roughness: 0.52,
      metalness: 0.02,
    });
    const swarm = new THREE.InstancedMesh(geometry, material, creatureCount);
    swarm.name = 'genna-sky-scavenger-swarm';
    swarm.userData.smallCreatures = true;
    swarm.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    // Les matrices changent chaque frame ; désactiver le culling évite une
    // bounding sphere obsolète sans coût notable pour quatorze instances.
    swarm.frustumCulled = false;

    this.deathworldCreatures = Array.from({ length: creatureCount }, (_, index) => ({
      centerX: Math.sin(index * 2.37) * 92,
      centerZ: Math.cos(index * 1.83) * 92,
      orbitRadius: 10 + (index % 5) * 3.8,
      altitude: 8 + (index % 6) * 2.4,
      phase: index * 0.91,
      speed: 0.18 + (index % 4) * 0.035,
      scale: 0.72 + (index % 3) * 0.16,
    }));
    this.deathworldCreatureMesh = swarm;
    this.biomeGroup.add(swarm);
    this.updateDeathworldLife(0);
  }

  updateDeathworldLife(delta) {
    if (!this.deathworldCreatureMesh) return;
    this.deathworldAnimationTime += delta;
    const time = this.deathworldAnimationTime;

    for (const flora of this.deathworldFlora) {
      flora.group.rotation.z = Math.sin(time * flora.swaySpeed + flora.phase) * 0.035;
      flora.crown.rotation.y = flora.baseCrownRotation + Math.sin(time * 0.42 + flora.phase) * 0.08;
      const pulse = 1 + Math.sin(time * 1.15 + flora.phase) * 0.055;
      flora.throat.scale.set(1.12 * pulse, 0.42 / pulse, 1.12 * pulse);
    }
    this.updateDeathworldFloraInstances();

    const dummy = this.deathworldCreatureDummy;
    this.deathworldCreatures.forEach((creature, index) => {
      const angle = creature.phase + time * creature.speed;
      dummy.position.set(
        creature.centerX + Math.cos(angle) * creature.orbitRadius,
        creature.altitude + Math.sin((time * 0.9) + creature.phase) * 2.1,
        creature.centerZ + Math.sin(angle) * creature.orbitRadius,
      );
      dummy.rotation.set(
        Math.sin(time * 1.3 + creature.phase) * 0.18,
        -angle + Math.PI / 2,
        Math.sin(time * 1.7 + creature.phase) * 0.24,
      );
      dummy.scale.setScalar(creature.scale);
      dummy.updateMatrix();
      this.deathworldCreatureMesh.setMatrixAt(index, dummy.matrix);
    });
    this.deathworldCreatureMesh.instanceMatrix.needsUpdate = true;
  }

  addThermalFootprint(position) {
    if (this.reducedMotion) return;
    const print = new THREE.Mesh(
      new THREE.RingGeometry(1.2, 2.4, 8),
      new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, transparent: true, opacity: 0.85 }),
    );
    print.rotation.x = -Math.PI / 2;
    print.position.copy(position).add(new THREE.Vector3(0, 0.08, 0));
    this.thermalFootprints.push({ mesh: print, lifetime: 8 });
    this.biomeGroup.add(print);
    if (this.thermalFootprints.length > 30) {
      const oldest = this.thermalFootprints.shift();
      this.biomeGroup.remove(oldest.mesh);
      oldest.mesh.geometry.dispose();
      oldest.mesh.material.dispose();
    }
  }

  updateThermalFootprints(delta, visionMode) {
    for (let i = this.thermalFootprints.length - 1; i >= 0; i -= 1) {
      const footprint = this.thermalFootprints[i];
      footprint.lifetime -= delta;
      footprint.mesh.visible = visionMode === 'thermal';
      footprint.mesh.material.opacity = Math.max(0, footprint.lifetime / 8) * 0.85;
      if (footprint.lifetime <= 0) {
        this.biomeGroup.remove(footprint.mesh);
        footprint.mesh.geometry.dispose();
        footprint.mesh.material.dispose();
        this.thermalFootprints.splice(i, 1);
      }
    }
  }

  createDriftingParticles(colorHex, count) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 600;
      positions[i + 1] = Math.random() * 80;
      positions[i + 2] = (Math.random() - 0.5) * 600;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({ color: colorHex, size: 0.9, transparent: true, opacity: 0.7 }),
    );
    this.biomeGroup.add(this.particles);
  }

  createWeatherParticles({ color, count, size }) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 500;
      positions[i + 1] = Math.random() * 120;
      positions[i + 2] = (Math.random() - 0.5) * 500;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0.78 });
    material.userData.environmentFullOpacity = material.opacity;
    const particles = new THREE.Points(
      geometry,
      material,
    );
    particles.userData.environmentWeather = true;
    this.biomeGroup.add(particles);
    return particles;
  }

  clearWeatherEvent() {
    const weatherObjects = new Set([
      this.rainParticles,
      this.sandParticles,
      this.thermalStormParticles,
    ].filter(Boolean));
    weatherObjects.forEach((particles) => {
      this.biomeGroup.remove(particles);
      particles.geometry?.dispose();
      const materials = Array.isArray(particles.material) ? particles.material : [particles.material];
      materials.filter(Boolean).forEach((material) => material.dispose());
    });
    this.rainParticles = null;
    this.sandParticles = null;
    this.thermalStormParticles = null;
    this.acidRainActive = false;
    this.sandstormActive = false;
    this.activeWeatherEvent = null;
    return weatherObjects.size > 0;
  }

  setWeatherEvent(weatherType = null) {
    const normalized = weatherType === 'rain' || weatherType === 'thermal_storm'
      ? weatherType
      : null;
    if (normalized === this.activeWeatherEvent) return false;
    this.clearWeatherEvent();
    this.activeWeatherEvent = normalized;
    if (normalized === 'rain') {
      const isHive = this.currentBiome === 'hive_lv426';
      this.rainParticles = this.createWeatherParticles({
        color: isHive ? 0x00ff44 : 0x8fc7dc,
        count: isHive ? 1000 : 850,
        size: isHive ? 1 : 0.72,
      });
      this.acidRainActive = isHive;
    } else if (normalized === 'thermal_storm') {
      const isDesert = this.currentBiome === 'ryushi_desert';
      this.thermalStormParticles = this.createWeatherParticles({
        color: isDesert ? 0xffaa00 : 0xff6a31,
        count: isDesert ? 1500 : 900,
        size: isDesert ? 1.5 : 1.1,
      });
      this.sandParticles = this.thermalStormParticles;
      this.sandstormActive = isDesert;
    }
    this.setReducedMotion(this.reducedMotion);
    return true;
  }

  createAcidRain() {
    return this.setWeatherEvent('rain');
  }

  createSandstorm() {
    return this.setWeatherEvent('thermal_storm');
  }

  setVisible(visible) {
    const isVisible = Boolean(visible);
    this.biomeGroup.visible = isVisible;
    this.sunSphere.visible = isVisible && this.currentBiome !== 'hive_lv426';
    this.ambientLight.visible = isVisible;
    this.hemisphereLight.visible = isVisible;
    this.mainLight.visible = isVisible;

    if (isVisible) {
      const style = BIOME_STYLE[this.currentBiome];
      this.scene.background = new THREE.Color(style.background);
      this.scene.fog = new THREE.FogExp2(style.background, style.fog);
    } else {
      this.scene.background = new THREE.Color(0x030508);
      this.scene.fog = new THREE.FogExp2(0x030508, 0.0015);
    }
  }

  setReducedMotion(enabled) {
    this.reducedMotion = Boolean(enabled);
    if (this.particles) this.particles.visible = !this.reducedMotion;
    if (this.deathworldCreatureMesh) this.deathworldCreatureMesh.visible = !this.reducedMotion;
    const weatherParticles = new Set([
      this.rainParticles,
      this.sandParticles,
      this.thermalStormParticles,
    ].filter(Boolean));
    weatherParticles.forEach((particles) => {
      particles.visible = true;
      const materials = Array.isArray(particles.material) ? particles.material : [particles.material];
      materials.filter(Boolean).forEach((material) => {
        const fullOpacity = Number.isFinite(material.userData.environmentFullOpacity)
          ? material.userData.environmentFullOpacity
          : material.opacity;
        if (!Number.isFinite(material.userData.environmentFullOpacity)) {
          material.userData.environmentFullOpacity = fullOpacity;
        }
        material.opacity = this.reducedMotion ? fullOpacity * 0.42 : fullOpacity;
      });
    });
  }

  update(delta, visionMode, { player = null, weatherEvent } = {}) {
    const frameDelta = Number.isFinite(delta) ? Math.max(0, delta) : 0;
    if (weatherEvent !== undefined && weatherEvent !== this.activeWeatherEvent) {
      this.setWeatherEvent(weatherEvent);
    }
    this.updateThermalFootprints(frameDelta, visionMode);
    const hazardSignals = this.updateHazardZones(frameDelta, player);
    if (!this.reducedMotion) {
      for (const pointOfInterest of this.pointsOfInterest) {
        if (!pointOfInterest.scanned && pointOfInterest.indicator) {
          pointOfInterest.indicator.rotation.y += frameDelta * 1.3;
        }
      }
    }
    if (this.reducedMotion) return hazardSignals;
    if (this.currentBiome === 'genna_deathworld') this.updateDeathworldLife(frameDelta);
    if (this.particles) {
      this.particles.rotation.y += frameDelta * (this.currentBiome === 'genna_deathworld' ? 0.08 : 0.03);
      if (this.currentBiome === 'genna_deathworld') {
        this.particles.material.opacity = 0.58 + Math.sin(this.deathworldAnimationTime * 0.8) * 0.12;
      }
    }
    if (this.sandParticles) this.sandParticles.rotation.y += frameDelta * 0.2;
    if (this.rainParticles) {
      const positions = this.rainParticles.geometry.attributes.position;
      for (let i = 1; i < positions.array.length; i += 3) {
        positions.array[i] -= frameDelta * 90;
        if (positions.array[i] < 0) positions.array[i] = 120;
      }
      positions.needsUpdate = true;
    }
    return hazardSignals;
  }

  dispose() {
    if (this._disposed) return false;
    this._disposed = true;
    this.clearBiome();

    const textures = new Set([...this.textureCache.values()].filter(Boolean));
    textures.forEach((texture) => texture.dispose?.());
    this.textureCache.clear();

    this.scene.remove(this.biomeGroup);
    this.scene.remove(this.ambientLight);
    this.scene.remove(this.hemisphereLight);
    this.scene.remove(this.mainLight);
    this.scene.remove(this.sunSphere);
    this.sunSphere.geometry?.dispose();
    const sunMaterials = Array.isArray(this.sunSphere.material)
      ? this.sunSphere.material
      : [this.sunSphere.material];
    sunMaterials.filter(Boolean).forEach((material) => material.dispose());

    this.propRoot = null;
    this.environmentProps = [];
    this.pointsOfInterest = [];
    this.hazardZones = [];
    this.hazardSignals = [];
    this.pillars = [];
    this.treePerches = [];
    this.runes = [];
    this.obstacleColliders = [];
    this.projectileCoverColliders = [];
    this.staticInstanceBatches = [];
    this.deathworldFloraBatches = [];
    this.thermalFootprints = [];
    this.particles = null;
    this.rainParticles = null;
    this.sandParticles = null;
    this.thermalStormParticles = null;
    return true;
  }
}
