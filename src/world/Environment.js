import * as THREE from 'three';
import { BIOME_DEFINITIONS } from '../data/GameConfig.js';
import {
  getBiomeHuntLayout,
  getBiomeHuntMetrics,
} from '../data/BiomeHuntLayout.js';
import {
  ENVIRONMENT_PERFORMANCE_BUDGETS,
  getBiomePropPlan,
} from '../data/BiomePropCatalog.js';
import { BiomePropBuilder, getCoverClusterLayout } from './BiomePropBuilder.js';
import {
  buildHuntRouteNetwork,
  sampleHuntSectorElevation,
} from './HuntRouteBuilder.js';

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
  stargazer_blacksite: {
    background: 0x050a10,
    fog: 0.0035,
    ambient: 0x658698,
    ambientIntensity: 1.7,
    hemisphereSky: 0x79a9ba,
    hemisphereGround: 0x111820,
    hemisphereIntensity: 1.48,
    key: 0xa6dded,
    keyIntensity: 2.75,
    sun: 0x6bd9ff,
    ground: 0x45505a,
  },
  los_angeles_1997: {
    background: 0x09050b,
    fog: 0.0031,
    ambient: 0x9b5c55,
    ambientIntensity: 1.62,
    hemisphereSky: 0x6c5878,
    hemisphereGround: 0x24120e,
    hemisphereIntensity: 1.42,
    key: 0xffb072,
    keyIntensity: 2.7,
    sun: 0xff7048,
    ground: 0x665044,
  },
  bouvetoya_pyramid: {
    background: 0x06111a,
    fog: 0.0039,
    ambient: 0x7599b3,
    ambientIntensity: 1.78,
    hemisphereSky: 0xaadfea,
    hemisphereGround: 0x2d211d,
    hemisphereIntensity: 1.52,
    key: 0x9aeaff,
    keyIntensity: 2.85,
    sun: 0xc8f2ff,
    ground: 0x637b85,
  },
  gunnison_outbreak: {
    background: 0x02070b,
    fog: 0.0042,
    ambient: 0x607887,
    ambientIntensity: 1.52,
    hemisphereSky: 0x6f8794,
    hemisphereGround: 0x11191c,
    hemisphereIntensity: 1.34,
    key: 0xb5d6dd,
    keyIntensity: 2.25,
    sun: 0x7ba4b0,
    ground: 0x39464a,
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
  stargazer_checkpoint: 10,
  stargazer_containment_lab: 15,
  stargazer_kennel: 8,
  stargazer_watchtower: 32,
  urban_tenement: 34,
  subway_entrance: 12,
  slaughterhouse: 18,
  owlf_command_van: 14,
  lost_tribe_ship_hatch: 20,
  weyland_drill_array: 26,
  pyramid_entrance: 30,
  pyramid_sacrificial_dais: 9,
  pyramid_plasma_vault: 15,
  pyramid_queen_restraint: 19,
  pyramid_arena_gate: 23,
  pyramid_shift_wall: 18,
  pyramid_weapon_pod: 12,
});

const ARCH_PROP_TYPES = new Set(['ritual_gate', 'clan_gate', 'hive_bulkhead', 'bone_arch']);
const FACILITY_PROP_TYPES = new Set(['field_camp', 'frontier_homestead', 'signal_array', 'stargazer_checkpoint', 'stargazer_containment_lab', 'urban_tenement', 'subway_entrance', 'slaughterhouse', 'owlf_command_van', 'lost_tribe_ship_hatch']);
const WRECK_PROP_TYPES = new Set(['wreckage', 'expedition_wreck']);
const PEN_PROP_TYPES = new Set(['egg_nursery', 'stock_pen', 'stargazer_kennel']);
const SHRINE_PROP_TYPES = new Set(['trophy_tree', 'royal_dais', 'blooding_dais', 'weapon_shrine', 'trophy_gallery', 'kalisk_nest']);

const MIN_ROUTE_COVER_COLLIDERS = 9;
const MIN_GAMEPLAY_PROP_COLLIDERS = 12;
const STATIC_INSTANCE_BATCH_NAMES = Object.freeze({
  jungleTrunks: 'legacy-jungle-tree-trunks',
  jungleCrowns: 'legacy-jungle-tree-crowns',
  hivePillars: 'legacy-hive-resin-pillars',
  primePillars: 'legacy-prime-arena-pillars',
  stargazerPylons: 'stargazer-perimeter-pylons',
  stargazerPanels: 'stargazer-perimeter-panels',
  stargazerMasts: 'stargazer-floodlight-masts',
  stargazerFloodlights: 'stargazer-floodlights',
  losAngelesBlocks: 'los-angeles-urban-blocks',
  losAngelesRoofRims: 'los-angeles-rooftop-heat-rims',
  losAngelesStreetlights: 'los-angeles-streetlight-masts',
  losAngelesLamps: 'los-angeles-sodium-lamps',
  bouvetIceSpires: 'bouvetoya-surface-ice-spires',
  bouvetPyramidMonoliths: 'bouvetoya-pyramid-monoliths',
  bouvetResinRibs: 'bouvetoya-resin-ribs',
  gunnisonBlocks: 'gunnison-rain-soaked-blocks',
  gunnisonRoofCaps: 'gunnison-rooftop-caps',
  gunnisonWindows: 'gunnison-emergency-windows',
  gunnisonPineTrunks: 'gunnison-crash-forest-pine-trunks',
  gunnisonPineCrowns: 'gunnison-crash-forest-pine-crowns',
  gunnisonHeadstones: 'gunnison-cemetery-headstones',
  gunnisonStreetlights: 'gunnison-streetlight-masts',
  gunnisonLamps: 'gunnison-failing-streetlamps',
  gunnisonResinRibs: 'gunnison-sewer-resin-ribs',
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
    this.huntLayout = getBiomeHuntLayout('jungle');
    this.playableRadius = this.huntLayout.playableRadius;
    this.routeRoot = null;
    this.routeMetrics = null;
    this.dynamicEventZones = [];
    this.huntRouteColliders = [];
    this.huntRoutePerches = [];
    this.huntRouteActiveColliders = [];
    this.routeColliderQuota = 0;
    this.demotedLegacyColliderCount = 0;
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
    this.pyramidInteriorLights = [];
    this.pyramidShiftWalls = [];
    this.pyramidShiftState = null;
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
    this.dynamicEventZones.forEach((zone) => this.endLocalizedEventMechanism(zone));
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
    this.pyramidInteriorLights = [];
    this.pyramidShiftWalls = [];
    this.pyramidShiftState = null;
    this.routeRoot = null;
    this.routeMetrics = null;
    this.dynamicEventZones = [];
    this.huntLayout = null;
    this.huntRouteColliders = [];
    this.huntRoutePerches = [];
    this.pillars = [];
    this.huntRouteActiveColliders = [];
    this.routeColliderQuota = 0;
    this.demotedLegacyColliderCount = 0;
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

  reserveHuntRouteColliderBudget() {
    const maximum = ENVIRONMENT_PERFORMANCE_BUDGETS.maxColliders;
    const distributedSectorCount = this.routeMetrics?.physicalCoverSectorCount ?? 0;
    this.routeColliderQuota = Math.min(
      MIN_ROUTE_COVER_COLLIDERS,
      distributedSectorCount,
      this.huntRouteColliders.length,
      maximum,
    );

    // Les props de gameplay conservent une réserve distincte. Dans la Jungle,
    // quelques piliers anciens redondants restent couverture projectile mais
    // cèdent leur collision acteur aux nouveaux couverts répartis par secteur.
    const propReserve = Math.min(
      MIN_GAMEPLAY_PROP_COLLIDERS,
      Math.max(0, maximum - this.routeColliderQuota),
    );
    let demotionsNeeded = Math.max(
      0,
      this.obstacleColliders.length + this.routeColliderQuota + propReserve - maximum,
    );
    for (let index = this.obstacleColliders.length - 1; index >= 0 && demotionsNeeded > 0; index -= 1) {
      const collider = this.obstacleColliders[index];
      if (collider.routeBudgetDemotable !== true) continue;
      this.obstacleColliders.splice(index, 1);
      collider.blocksActors = false;
      this.projectileCoverColliders.push(collider);
      this.demotedLegacyColliderCount += 1;
      demotionsNeeded -= 1;
    }

    const available = Math.max(0, maximum - this.obstacleColliders.length);
    this.huntRouteActiveColliders = this.huntRouteColliders.slice(
      0,
      Math.min(this.routeColliderQuota, available),
    );
    this.obstacleColliders.push(...this.huntRouteActiveColliders);
    return this.huntRouteActiveColliders.length;
  }

  completeHuntRouteColliderBudget() {
    const remainingBudget = Math.max(
      0,
      ENVIRONMENT_PERFORMANCE_BUDGETS.maxColliders - this.obstacleColliders.length,
    );
    if (remainingBudget === 0) return 0;
    const activeIds = new Set(this.huntRouteActiveColliders.map(({ sourceId }) => sourceId));
    const additions = this.huntRouteColliders
      .filter(({ sourceId }) => !activeIds.has(sourceId))
      .slice(0, remainingBudget);
    this.huntRouteActiveColliders.push(...additions);
    this.obstacleColliders.push(...additions);
    return additions.length;
  }

  setBiome(biomeType) {
    if (this._disposed) return false;
    this.currentBiome = BIOME_STYLE[biomeType] ? biomeType : 'jungle';
    this.clearBiome();
    this.huntLayout = getBiomeHuntLayout(this.currentBiome);
    this.playableRadius = this.huntLayout.playableRadius;
    const shadowExtent = this.playableRadius + 90;
    this.mainLight.shadow.camera.left = -shadowExtent;
    this.mainLight.shadow.camera.right = shadowExtent;
    this.mainLight.shadow.camera.top = shadowExtent;
    this.mainLight.shadow.camera.bottom = -shadowExtent;
    this.mainLight.shadow.camera.near = 8;
    this.mainLight.shadow.camera.far = 1600;
    this.mainLight.shadow.camera.updateProjectionMatrix();
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
    this.routeRoot = buildHuntRouteNetwork(this.huntLayout, (x, z) => this.sampleBaseHeight(x, z));
    this.routeMetrics = this.routeRoot.userData.huntLayoutMetrics;
    this.biomeGroup.add(this.routeRoot);
    this.huntRouteColliders = (this.routeRoot.userData.huntCoverColliders ?? []).filter((collider) => (
      this.propFootprints.every((footprint) => (
        Math.hypot(collider.x - footprint.x, collider.z - footprint.z)
          - collider.radius - footprint.radius >= 3 - 0.000001
      ))
    ));
    this.huntRoutePerches = this.routeRoot.userData.huntPerches ?? [];

    if (this.currentBiome === 'jungle') {
      this.createAncientRuins();
      this.createAlienFoliage();
      this.createDriftingParticles(0x00f0ff, 650);
    } else if (this.currentBiome === 'hive_lv426') {
      this.createHiveResinPillars();
      this.createDriftingParticles(0x00ff44, 500);
    } else if (this.currentBiome === 'ryushi_desert') {
      this.createDesertDunes();
    } else if (this.currentBiome === 'stargazer_blacksite') {
      this.createStargazerBlacksite();
      this.createDriftingParticles(0x58cfff, 180);
    } else if (this.currentBiome === 'los_angeles_1997') {
      this.createLosAngelesCity();
      this.createDriftingParticles(0xff9a52, 180);
    } else if (this.currentBiome === 'bouvetoya_pyramid') {
      this.createBouvetoyaPyramid();
      this.createDriftingParticles(0x9eeaff, 340);
    } else if (this.currentBiome === 'gunnison_outbreak') {
      this.createGunnisonOutbreak();
      this.createDriftingParticles(0xb8d9df, 150);
    } else if (this.currentBiome === 'genna_deathworld') {
      this.createGennaDeathworld();
      this.createDriftingParticles(0xbaff69, 520);
    } else {
      this.createColosseumPillars();
      this.createDriftingParticles(0xff3300, 450);
    }

    this.reserveHuntRouteColliderBudget();
    this.buildBiomeProps();
    this.setupPyramidShiftMechanism();
    this.completeHuntRouteColliderBudget();
    if (this.currentBiome === 'gunnison_outbreak') this.setWeatherEvent('rain');
    this.sunSphere.visible = this.biomeGroup.visible && !['hive_lv426', 'los_angeles_1997', 'gunnison_outbreak'].includes(this.currentBiome);
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
    if (prop.type === 'pyramid_shift_wall') {
      return [{ part: 'sliding_megalith', x: 0, z: 0, radius: 7.8, height: 18 }];
    }
    if (prop.type === 'weyland_drill_array') {
      return [
        { part: 'north_west_leg', x: -4.8, z: -4.2, radius: 0.9, height: 17 },
        { part: 'north_east_leg', x: 4.8, z: -4.2, radius: 0.9, height: 17 },
        { part: 'south_west_leg', x: -4.8, z: 4.2, radius: 0.9, height: 17 },
        { part: 'south_east_leg', x: 4.8, z: 4.2, radius: 0.9, height: 17 },
        { part: 'drill_head', x: 0, z: 0, radius: 6.2, height: 4, baseYOffset: 12.5, blocksActors: false, blocksProjectiles: true },
      ];
    }
    if (prop.type === 'pyramid_entrance') {
      return [
        { part: 'left_megalith', x: -13, z: -3, radius: 3.6, height: 28 },
        { part: 'right_megalith', x: 13, z: -3, radius: 3.6, height: 28 },
        { part: 'threshold', x: 0, z: 0, radius: 16.5, height: 2.4 },
        { part: 'lintel', x: 0, z: -3, radius: 15.5, height: 5, baseYOffset: 22.5, blocksActors: false, blocksProjectiles: true },
      ];
    }
    if (prop.type === 'pyramid_sacrificial_dais') {
      return [{ part: 'sacrificial_dais', x: 0, z: 0, radius: 15.5, height: 7.4 }];
    }
    if (prop.type === 'pyramid_plasma_vault') {
      return [
        { part: 'weapon_dais', x: 0, z: 0, radius: 13.5, height: 3.2 },
        { part: 'west_weapon_pillar', x: -6.2, z: 0, radius: 1.8, height: 14 },
        { part: 'central_weapon_pillar', x: 0, z: 0, radius: 1.8, height: 14 },
        { part: 'east_weapon_pillar', x: 6.2, z: 0, radius: 1.8, height: 14 },
      ];
    }
    if (prop.type === 'pyramid_queen_restraint') {
      return [
        { part: 'royal_pit', x: 0, z: 0, radius: 18.5, height: 5 },
        { part: 'north_west_anchor', x: -10, z: -10, radius: 2.4, height: 17 },
        { part: 'north_east_anchor', x: 10, z: -10, radius: 2.4, height: 17 },
        { part: 'south_west_anchor', x: -10, z: 10, radius: 2.4, height: 17 },
        { part: 'south_east_anchor', x: 10, z: 10, radius: 2.4, height: 17 },
      ];
    }
    if (prop.type === 'pyramid_arena_gate') {
      return [
        { part: 'left_arena_pier', x: -9, z: 0, radius: 3.2, height: 21 },
        { part: 'right_arena_pier', x: 9, z: 0, radius: 3.2, height: 21 },
        { part: 'arena_lintel', x: 0, z: 0, radius: 11, height: 4.2, baseYOffset: 16, blocksActors: false, blocksProjectiles: true },
      ];
    }
    if (prop.type === 'pyramid_weapon_pod') {
      return [{ part: 'armored_pod', x: 0, z: 0, radius: 4.4, height: 12 }];
    }
    if (ARCH_PROP_TYPES.has(prop.type)) {
      return [
        { part: 'left_support', x: -5.6, z: 0, radius: 2.1, height: nominalHeight },
        { part: 'right_support', x: 5.6, z: 0, radius: 2.1, height: nominalHeight },
      ];
    }
    if (prop.type === 'stargazer_checkpoint') {
      return [
        { part: 'security_booth', x: -7.4, z: 0.4, radius: 4.1, height: 8 },
        { part: 'north_bollards', x: 4.5, z: -5, radius: 6.7, height: 3 },
        { part: 'south_bollards', x: 4.5, z: 5, radius: 6.7, height: 3 },
        { part: 'gate_arm', x: 4.8, z: 0, radius: 7.6, height: 1.2, baseYOffset: 3.1, blocksActors: false, blocksProjectiles: true },
      ];
    }
    if (prop.type === 'stargazer_containment_lab') {
      return [
        { part: 'containment_core', x: 0, z: 0, radius: 8.8, height: 11 },
        { part: 'west_lab_wing', x: -13, z: 0.8, radius: 5.8, height: 8 },
        { part: 'east_lab_wing', x: 13, z: -0.8, radius: 5.8, height: 8 },
        { part: 'containment_tube', x: 0, z: 8.8, radius: 2.5, height: 7 },
      ];
    }
    if (prop.type === 'stargazer_kennel') {
      return [
        { part: 'north_cage', x: 0, z: -8, radius: 5, height: 7.4 },
        { part: 'south_cage', x: 0, z: 8, radius: 5, height: 7.4 },
        { part: 'west_cage', x: -8, z: 0, radius: 5, height: 7.4 },
        { part: 'east_cage', x: 8, z: 0, radius: 5, height: 7.4 },
      ];
    }
    if (prop.type === 'stargazer_watchtower') {
      return [
        { part: 'north_west_leg', x: -3.3, z: -3.3, radius: 0.95, height: 18 },
        { part: 'north_east_leg', x: 3.3, z: -3.3, radius: 0.95, height: 18 },
        { part: 'south_west_leg', x: -3.3, z: 3.3, radius: 0.95, height: 18 },
        { part: 'south_east_leg', x: 3.3, z: 3.3, radius: 0.95, height: 18 },
        { part: 'guard_cabin', x: 0, z: 0, radius: 5, height: 7.2, baseYOffset: 17.6, blocksActors: false, blocksProjectiles: true },
      ];
    }
    if (prop.type === 'stargazer_barrier_line') {
      return [
        { part: 'west_barriers', x: -12, z: 0, radius: 5.2, height: 3.4 },
        { part: 'central_barriers', x: 0, z: 0, radius: 5.2, height: 3.4 },
        { part: 'east_barriers', x: 12, z: 0, radius: 5.2, height: 3.4 },
      ];
    }
    if (prop.type === 'stargazer_pod_line') {
      return [
        { part: 'west_pods', x: -10, z: 0, radius: 3.8, height: 6.6 },
        { part: 'central_pods', x: 0, z: 0, radius: 3.8, height: 6.6 },
        { part: 'east_pods', x: 10, z: 0, radius: 3.8, height: 6.6 },
      ];
    }
    if (prop.type === 'urban_tenement') {
      return [
        { part: 'tenement_core', x: 0, z: 0, radius: 12.8, height: 24 },
        { part: 'west_wing', x: -17, z: 0.8, radius: 6.8, height: 18 },
        { part: 'roofline', x: 0, z: 0, radius: 14.5, height: 4, baseYOffset: 23, blocksActors: false, blocksProjectiles: true },
      ];
    }
    if (prop.type === 'subway_entrance') {
      return [
        { part: 'left_pier', x: -7, z: -3.8, radius: 2.1, height: 10 },
        { part: 'right_pier', x: 7, z: -3.8, radius: 2.1, height: 10 },
        { part: 'station_lintel', x: 0, z: -3.8, radius: 8.2, height: 2.4, baseYOffset: 7.4, blocksActors: false, blocksProjectiles: true },
      ];
    }
    if (prop.type === 'slaughterhouse') {
      return [
        { part: 'cold_core', x: 0, z: 0, radius: 14.8, height: 14 },
        { part: 'loading_wing', x: -20, z: 2, radius: 8.2, height: 10 },
        { part: 'freezer_wing', x: 20, z: -1, radius: 7.4, height: 12 },
      ];
    }
    if (prop.type === 'owlf_command_van') {
      return [
        { part: 'operations_body', x: -1, z: 0, radius: 7.8, height: 7 },
        { part: 'cab', x: 9.5, z: 0, radius: 3.8, height: 5.4 },
        { part: 'tracking_dish', x: -4, z: 0, radius: 2.4, height: 6, baseYOffset: 6, blocksActors: false, blocksProjectiles: true },
      ];
    }
    if (prop.type === 'lost_tribe_ship_hatch') {
      return [
        { part: 'ship_plinth', x: 0, z: 0, radius: 14.5, height: 2.5 },
        { part: 'left_hatch', x: -4.8, z: -1.6, radius: 5.2, height: 14, baseYOffset: 2 },
        { part: 'right_hatch', x: 4.8, z: -1.6, radius: 5.2, height: 14, baseYOffset: 2 },
      ];
    }
    if (prop.type === 'police_vehicle_line') {
      return [
        { part: 'west_vehicles', x: -17, z: 0, radius: 8.2, height: 4.6 },
        { part: 'central_vehicles', x: 0, z: 0, radius: 8.2, height: 4.6 },
        { part: 'east_vehicles', x: 17, z: 0, radius: 8.2, height: 4.6 },
      ];
    }
    if (prop.type === 'rooftop_equipment') {
      return [
        { part: 'west_hvac', x: -13, z: 0, radius: 7.2, height: 5.4 },
        { part: 'central_hvac', x: 0, z: 0, radius: 7.2, height: 5.4 },
        { part: 'east_hvac', x: 13, z: 0, radius: 7.2, height: 5.4 },
      ];
    }
    if (prop.type === 'palm_line') {
      return [
        { part: 'west_palms', x: -18, z: 0, radius: 7.5, height: 23 },
        { part: 'central_palms', x: 0, z: 0, radius: 7.5, height: 23 },
        { part: 'east_palms', x: 18, z: 0, radius: 7.5, height: 23 },
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

  setupPyramidShiftMechanism() {
    if (this.currentBiome !== 'bouvetoya_pyramid') return false;
    const shiftProps = this.environmentProps.filter(({ type }) => type === 'pyramid_shift_wall');
    if (shiftProps.length === 0) return false;

    this.pyramidShiftWalls = shiftProps.map((prop) => {
      const closedY = prop.mesh.position.y;
      const openHeight = Math.max(12, Number(prop.openHeight) || 19) * (Number(prop.scale) || 1);
      prop.mesh.userData.pyramidShiftWall = true;
      prop.mesh.userData.shiftGroup = prop.shiftGroup;
      return {
        id: prop.id,
        group: prop.shiftGroup === 'beta' ? 'beta' : 'alpha',
        mesh: prop.mesh,
        colliders: prop.colliderParts ?? [],
        closedY,
        openY: closedY + openHeight,
        fromY: closedY,
        targetY: closedY,
      };
    });
    this.pyramidShiftState = {
      mode: 'alpha_closed',
      targetMode: 'alpha_closed',
      active: false,
      elapsed: 0,
      duration: 0,
      progress: 1,
      generation: 0,
    };
    for (const wall of this.pyramidShiftWalls) {
      wall.mesh.position.y = wall.group === 'alpha' ? wall.closedY : wall.openY;
    }
    this.syncPyramidShiftColliders('alpha_closed');
    return this.getPyramidShiftSnapshot();
  }

  detachPyramidShiftColliders() {
    if (this.pyramidShiftWalls.length === 0) return 0;
    const wallColliders = new Set(this.pyramidShiftWalls.flatMap(({ colliders }) => colliders));
    const previousCount = this.obstacleColliders.length + this.projectileCoverColliders.length;
    this.obstacleColliders = this.obstacleColliders.filter((collider) => !wallColliders.has(collider));
    this.projectileCoverColliders = this.projectileCoverColliders.filter((collider) => !wallColliders.has(collider));
    return previousCount - this.obstacleColliders.length - this.projectileCoverColliders.length;
  }

  syncPyramidShiftColliders(mode = this.pyramidShiftState?.mode) {
    this.detachPyramidShiftColliders();
    const closedGroup = mode === 'beta_closed' ? 'beta' : 'alpha';
    for (const wall of this.pyramidShiftWalls) {
      if (wall.group !== closedGroup) continue;
      for (const collider of wall.colliders) {
        collider.baseY = wall.closedY;
        if (collider.blocksActors !== false) {
          if (this.obstacleColliders.length < ENVIRONMENT_PERFORMANCE_BUDGETS.maxColliders) {
            this.obstacleColliders.push(collider);
          }
        } else if (!this.projectileCoverColliders.includes(collider)) {
          this.projectileCoverColliders.push(collider);
        }
      }
    }
    return this.pyramidShiftWalls
      .filter(({ group }) => group === closedGroup)
      .flatMap(({ colliders }) => colliders)
      .filter((collider) => this.obstacleColliders.includes(collider) || this.projectileCoverColliders.includes(collider))
      .length;
  }

  triggerPyramidShift(signal = {}) {
    if (this.currentBiome !== 'bouvetoya_pyramid' || !this.pyramidShiftState || this.pyramidShiftState.active) {
      return false;
    }
    const request = typeof signal === 'string' ? { targetMode: signal } : (signal ?? {});
    const requestedMode = request.targetMode ?? request.shiftMode;
    const targetMode = ['alpha_closed', 'beta_closed'].includes(requestedMode)
      ? requestedMode
      : this.pyramidShiftState.mode === 'alpha_closed' ? 'beta_closed' : 'alpha_closed';
    if (targetMode === this.pyramidShiftState.mode) return false;

    const requestedDuration = Number(request.shiftDuration ?? request.duration);
    const duration = THREE.MathUtils.clamp(Number.isFinite(requestedDuration) ? requestedDuration : 3.2, 1.2, 6);
    const closedGroup = targetMode === 'beta_closed' ? 'beta' : 'alpha';
    for (const wall of this.pyramidShiftWalls) {
      wall.fromY = wall.mesh.position.y;
      wall.targetY = wall.group === closedGroup ? wall.closedY : wall.openY;
    }
    this.detachPyramidShiftColliders();
    Object.assign(this.pyramidShiftState, {
      targetMode,
      active: true,
      elapsed: 0,
      duration: this.reducedMotion ? Math.min(duration, 1.2) : duration,
      progress: 0,
      generation: this.pyramidShiftState.generation + 1,
    });
    return this.getPyramidShiftSnapshot();
  }

  updatePyramidShift(delta) {
    const state = this.pyramidShiftState;
    if (!state?.active) return false;
    state.elapsed = Math.min(state.duration, state.elapsed + Math.max(0, Number(delta) || 0));
    state.progress = state.duration > 0 ? state.elapsed / state.duration : 1;
    const eased = state.progress * state.progress * (3 - 2 * state.progress);
    for (const wall of this.pyramidShiftWalls) {
      wall.mesh.position.y = THREE.MathUtils.lerp(wall.fromY, wall.targetY, eased);
    }
    if (state.progress >= 1) {
      state.active = false;
      state.mode = state.targetMode;
      this.syncPyramidShiftColliders(state.mode);
    }
    return this.getPyramidShiftSnapshot();
  }

  getPyramidShiftSnapshot() {
    const state = this.pyramidShiftState;
    const colliderIds = new Set();
    for (const wall of this.pyramidShiftWalls) {
      for (const collider of wall.colliders) {
        if (this.obstacleColliders.includes(collider) || this.projectileCoverColliders.includes(collider)) {
          colliderIds.add(collider.sourceId);
        }
      }
    }
    return Object.freeze({
      available: this.currentBiome === 'bouvetoya_pyramid' && this.pyramidShiftWalls.length > 0,
      active: Boolean(state?.active),
      mode: state?.mode ?? null,
      targetMode: state?.targetMode ?? null,
      progress: Number((state?.progress ?? 0).toFixed(4)),
      generation: state?.generation ?? 0,
      wallCount: this.pyramidShiftWalls.length,
      activeColliderCount: colliderIds.size,
      activeColliderIds: Object.freeze([...colliderIds].sort()),
      wallPositions: Object.freeze(this.pyramidShiftWalls.map(({ id, group, mesh }) => Object.freeze({
        id,
        group,
        y: Number(mesh.position.y.toFixed(4)),
      }))),
    });
  }

  getLevelDesignSnapshot() {
    const totalMetrics = estimateRenderCost(this.biomeGroup);
    const huntMetrics = this.getHuntMetrics();
    const ecologyInstanceEstimate = Number(huntMetrics.ecologyInstanceEstimate) || 0;
    const shift = this.getPyramidShiftSnapshot();
    return Object.freeze({
      biomeId: this.currentBiome,
      ...huntMetrics,
      propCount: this.environmentProps.length,
      pointOfInterestCount: this.pointsOfInterest.length,
      hazardCount: this.hazardZones.length,
      colliderCount: this.obstacleColliders.length,
      projectileOnlyColliderCount: this.projectileCoverColliders.length,
      huntRouteColliderCount: this.huntRouteActiveColliders.length,
      huntRouteColliderSectorCount: new Set(this.huntRouteActiveColliders.map(({ sectorId }) => sectorId)).size,
      routeColliderQuota: this.routeColliderQuota,
      demotedLegacyColliderCount: this.demotedLegacyColliderCount,
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
      sceneInstanceEstimate: totalMetrics.totalMeshInstanceCount + ecologyInstanceEstimate,
      activeWeatherEvent: this.activeWeatherEvent,
      pyramidInteriorLightCount: this.pyramidInteriorLights.length,
      pyramidShiftWallCount: shift.wallCount,
      pyramidShiftActive: shift.active,
      pyramidShiftMode: shift.mode,
      pyramidShiftProgress: shift.progress,
      pyramidShiftGeneration: shift.generation,
      pyramidShiftColliderCount: shift.activeColliderCount,
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

  sampleBaseHeight(xOrPosition, zValue) {
    const vector = toWorldVector(xOrPosition);
    const x = vector ? vector.x : Number(xOrPosition) || 0;
    const z = vector ? vector.z : Number(zValue) || 0;
    const distance = Math.hypot(x, z);
    const biomePhase = ['jungle', 'hive_lv426', 'ryushi_desert', 'yautja_prime', 'genna_deathworld', 'stargazer_blacksite', 'los_angeles_1997', 'bouvetoya_pyramid', 'gunnison_outbreak']
      .indexOf(this.currentBiome) * 37;
    let height = Math.sin(x * 0.03) * Math.cos(z * 0.03) * 3.4;
    height += Math.sin((x + biomePhase) * 0.009) * Math.cos((z - biomePhase) * 0.011) * 6.2;
    const ridgeStart = this.playableRadius * 0.91;
    if (distance > ridgeStart) height += Math.pow(distance - ridgeStart, 1.32) * 0.12;
    return height;
  }

  sampleHeight(xOrPosition, zValue) {
    const vector = toWorldVector(xOrPosition);
    const x = vector ? vector.x : Number(xOrPosition) || 0;
    const z = vector ? vector.z : Number(zValue) || 0;
    return this.sampleBaseHeight(x, z)
      + sampleHuntSectorElevation(this.huntLayout, x, z);
  }

  getHuntLayout() {
    return this.huntLayout ? getBiomeHuntLayout(this.currentBiome) : null;
  }

  getTraversalPerches() {
    return [...this.treePerches, ...this.huntRoutePerches];
  }

  getHuntMetrics() {
    if (!this.huntLayout) return {};
    return {
      ...getBiomeHuntMetrics(this.currentBiome),
      routeTriangleCount: this.routeMetrics?.routeTriangles ?? 0,
      navigationDrawCallEstimate: this.routeMetrics?.drawCallEstimate ?? 0,
      ecologyInstanceEstimate: this.routeMetrics?.ecologyInstanceEstimate ?? 0,
      routeSceneElementEstimate: this.routeMetrics?.sceneElementEstimate ?? 0,
      huntRouteColliderCount: this.huntRouteActiveColliders.length,
      huntRouteColliderSectorCount: new Set(this.huntRouteActiveColliders.map(({ sectorId }) => sectorId)).size,
    };
  }

  getHuntStartPosition() {
    if (!this.huntLayout) return this.getSafeSpawnPosition(new THREE.Vector3(0, 0, 0));
    return this.getSafeSpawnPosition(toWorldVector(this.huntLayout.startCamp), { clearance: 6 });
  }

  getBossMigrationRoute() {
    return (this.huntLayout?.bossRoute ?? []).map((entry) => {
      const position = toWorldVector(entry);
      return this.getSafeSpawnPosition(position, { clearance: 10 });
    });
  }

  getAmbientSpawnPlan() {
    if (!this.huntLayout) return [];
    const plan = [];
    this.huntLayout.ecology.forEach((territory, territoryIndex) => {
      const territoryCenter = toWorldVector(territory.center);
      territoryCenter.y = this.sampleHeight(territoryCenter);
      for (let index = 0; index < territory.count; index += 1) {
        const angle = territoryIndex * 1.731 + index * 2.399963229728653;
        const distance = territory.patrolRadius * (0.22 + (index % 3) * 0.16);
        const position = this.getSafeSpawnPosition(new THREE.Vector3(
          territoryCenter.x + Math.cos(angle) * distance,
          0,
          territoryCenter.z + Math.sin(angle) * distance,
        ), { clearance: territory.type.includes('xeno') ? 2.5 : 4 });
        plan.push({
          id: `${territory.id}-${index + 1}`,
          label: territory.label,
          type: territory.type,
          position,
          ambient: true,
          territoryCenter: territoryCenter.clone(),
          patrolRadius: territory.patrolRadius,
          aggressionRange: territory.aggressionRange,
          leashRadius: Math.max(territory.patrolRadius * 1.75, territory.aggressionRange * 2.2),
        });
      }
    });
    return plan;
  }

  getEventNodes() {
    return (this.huntLayout?.eventNodes ?? []).map((event) => {
      const position = toWorldVector(event.position);
      position.y = this.sampleHeight(position);
      return { ...event, position };
    });
  }

  getEventNode(kind = '', ordinal = 0) {
    const typeAliases = {
      localized_event: 'localized_hazard',
      hazard: 'localized_hazard',
      enemy: 'prey_migration',
      cache: 'cache_drop',
      boss_migration: 'boss_trail',
    };
    const normalizedKind = typeAliases[String(kind).toLowerCase()] ?? String(kind).toLowerCase();
    const nodes = this.getEventNodes();
    const matching = nodes.filter((node) => node.eventType === normalizedKind);
    const pool = matching.length > 0 ? matching : nodes;
    if (pool.length === 0) return null;
    const safeOrdinal = Math.abs(Math.floor(Number(ordinal) || 0));
    return pool[safeOrdinal % pool.length];
  }

  startLocalizedEvent(event = {}) {
    const sourcePosition = toWorldVector(event.position)
      ?? this.getEventNode(event.eventType ?? event.kind ?? 'localized_event')?.position
      ?? new THREE.Vector3();
    const position = sourcePosition.clone();
    position.y = this.sampleHeight(position);
    const radius = Math.max(5, Number(event.radius) || 18);
    const duration = Math.max(1, Number(event.duration) || 18);
    const mechanism = event.mechanism ?? null;
    const isObjectiveZone = mechanism === 'evacuation_countdown';
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(radius * 0.82, radius, 48),
      new THREE.MeshBasicMaterial({
        color: isObjectiveZone ? 0x6fffd1 : event.status === 'corrosion' ? 0x9dff3c : 0xff8a3d,
        transparent: true,
        opacity: 0.56,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    ring.name = `dynamic-hunt-event:${event.id ?? this.dynamicEventZones.length + 1}`;
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(position).add(new THREE.Vector3(0, 0.18, 0));
    this.biomeGroup.add(ring);
    const hazard = {
      id: event.id ?? ring.name,
      type: event.eventType ?? 'localized_hazard',
      position,
      radius,
      duration,
      remaining: duration,
      damage: isObjectiveZone ? 0 : Math.max(0, Number(event.damage) || 0),
      status: isObjectiveZone ? null : event.status ?? null,
      message: event.label ?? event.message ?? 'Anomalie locale détectée',
      mechanism,
      countdownSeconds: Math.max(0, Number(event.countdownSeconds) || 0),
      isObjectiveZone,
      interval: 2.25,
      cooldown: 0,
      pulsePhase: 0,
      mesh: ring,
      pulseRoot: ring,
      dynamic: true,
    };
    if (!isObjectiveZone) this.hazardZones.push(hazard);
    this.dynamicEventZones.push(hazard);
    this.applyLocalizedEventMechanism(hazard);
    return hazard;
  }

  applyLocalizedEventMechanism(zone) {
    if (zone?.mechanism !== 'power_grid_blackout' || zone.mechanismState) return false;
    const emergencyLights = this.biomeGroup.children.filter(({ userData }) => userData?.gunnisonEmergencyLight === true);
    zone.mechanismState = {
      restored: false,
      mainLightIntensity: this.mainLight.intensity,
      ambientLightIntensity: this.ambientLight.intensity,
      hemisphereLightIntensity: this.hemisphereLight.intensity,
      emergencyLights: emergencyLights.map((light) => ({ light, intensity: light.intensity })),
    };
    this.mainLight.intensity *= 0.24;
    this.ambientLight.intensity *= 0.38;
    this.hemisphereLight.intensity *= 0.42;
    emergencyLights.forEach((light) => { light.intensity *= 0.08; });
    return true;
  }

  endLocalizedEventMechanism(zone) {
    const state = zone?.mechanismState;
    if (!state || state.restored) return false;
    state.restored = true;
    this.mainLight.intensity = state.mainLightIntensity;
    this.ambientLight.intensity = state.ambientLightIntensity;
    this.hemisphereLight.intensity = state.hemisphereLightIntensity;
    state.emergencyLights.forEach(({ light, intensity }) => {
      if (light) light.intensity = intensity;
    });
    return true;
  }

  updateDynamicEventZones(delta) {
    const expired = [];
    for (const zone of this.dynamicEventZones) {
      zone.remaining -= delta;
      if (zone.mesh?.material) {
        zone.mesh.material.opacity = Math.max(0, Math.min(0.56, zone.remaining / 4));
      }
      if (zone.remaining <= 0) expired.push(zone);
    }
    for (const zone of expired) {
      this.endLocalizedEventMechanism(zone);
      this.biomeGroup.remove(zone.mesh);
      zone.mesh?.geometry?.dispose();
      zone.mesh?.material?.dispose();
      this.hazardZones = this.hazardZones.filter((hazard) => hazard !== zone);
      this.dynamicEventZones = this.dynamicEventZones.filter((hazard) => hazard !== zone);
    }
    return this.dynamicEventZones.length;
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

  getNavigationDirection(origin, target, clearance = 4) {
    const start = toWorldVector(origin);
    const goal = toWorldVector(target);
    if (!start || !goal) return new THREE.Vector3();

    const direct = goal.clone().sub(start);
    direct.y = 0;
    const remaining = direct.length();
    if (remaining <= 0.0001) return direct.set(0, 0, 0);
    direct.normalize();

    const lookAhead = Math.min(28, remaining);
    const blockers = this.obstacleColliders.filter((collider) => collider.blocksActors !== false);
    const candidateAngles = [0, 0.42, -0.42, 0.78, -0.78, 1.16, -1.16, Math.PI / 2, -Math.PI / 2];
    let bestDirection = null;
    let bestScore = -Infinity;

    for (const angle of candidateAngles) {
      const direction = direct.clone().applyAxisAngle(THREE.Object3D.DEFAULT_UP, angle);
      const end = start.clone().addScaledVector(direction, lookAhead);
      let blocked = false;
      let nearestGap = Infinity;

      for (const collider of blockers) {
        const segmentX = end.x - start.x;
        const segmentZ = end.z - start.z;
        const segmentLengthSquared = segmentX * segmentX + segmentZ * segmentZ;
        const projection = segmentLengthSquared > 0
          ? THREE.MathUtils.clamp(
            ((collider.x - start.x) * segmentX + (collider.z - start.z) * segmentZ) / segmentLengthSquared,
            0,
            1,
          )
          : 0;
        const closestX = start.x + segmentX * projection;
        const closestZ = start.z + segmentZ * projection;
        const gap = Math.hypot(collider.x - closestX, collider.z - closestZ)
          - (Math.max(0, Number(collider.radius) || 0) + Math.max(0, Number(clearance) || 0));
        nearestGap = Math.min(nearestGap, gap);
        if (gap < 0) {
          blocked = true;
          break;
        }
      }
      if (blocked) continue;

      const progress = remaining - horizontalDistance(end, goal);
      const heading = direction.dot(direct);
      const clearanceBonus = Number.isFinite(nearestGap) ? Math.min(20, nearestGap) * 0.04 : 0.8;
      const score = progress * 4 + heading * 3 + clearanceBonus;
      if (score > bestScore) {
        bestScore = score;
        bestDirection = direction;
      }
    }

    return bestDirection ?? direct;
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
    const normalizedKind = String(kind).toLowerCase();
    const layout = this.huntLayout;
    let anchors = [];
    if (normalizedKind.includes('egg')) {
      anchors = (layout?.sectors ?? [])
        .filter((sector) => sector.role === 'nest')
        .map((sector) => sector.center);
    } else if (normalizedKind.includes('boss')) {
      anchors = layout?.bossRoute ?? [];
    } else {
      anchors = (layout?.sectors ?? [])
        .filter((sector) => !['camp', 'boss_lair'].includes(sector.role))
        .map((sector) => sector.center);
    }
    if (anchors.length === 0) {
      const plan = getBiomePropPlan(this.currentBiome);
      anchors = [...plan.pointsOfInterest, ...plan.props].map((entry) => entry.position);
    }

    const sockets = [];
    for (let index = 0; index < safeCount; index += 1) {
      const anchorIndex = normalizedKind.includes('egg')
        ? index % anchors.length
        : (index * 2 + 1) % anchors.length;
      const anchor = toWorldVector(anchors[anchorIndex]);
      const angle = index * 2.399963229728653 + anchorIndex * 0.73;
      const offset = normalizedKind.includes('egg') ? 7 + (index % 2) * 4 : 14 + (index % 3) * 7;
      const socket = this.getSafeSpawnPosition(new THREE.Vector3(
        anchor.x + Math.cos(angle) * offset,
        0,
        anchor.z + Math.sin(angle) * offset,
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
    const biome = BIOME_DEFINITIONS[this.currentBiome] ?? BIOME_DEFINITIONS.jungle;
    const terrainSize = this.huntLayout?.terrainSize ?? 800;
    const geometry = new THREE.PlaneGeometry(terrainSize, terrainSize, 128, 128);
    const positions = geometry.attributes.position;

    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      // Le plan est ensuite tourné de -90° autour de X : son axe Y local devient -Z monde.
      positions.setZ(i, this.sampleHeight(x, -y));
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
      this.obstacleColliders.push({ x, z, radius: 5, height: 45, baseY: ground, blocksProjectiles: true, routeBudgetDemotable: true, sourceId: `jungle-ruin-pillar-${index + 1}` });
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

  /**
   * Monte le périmètre du complexe Stargazer en lots instanciés : les trouées
   * entre panneaux sont des accès de service lisibles, tandis que pylônes et
   * mâts restent de vraies couvertures et perches dans le budget de collision.
   */
  createStargazerBlacksite() {
    const composite = this.createTexturedMaterial({
      color: 0x344550,
      path: '/assets/textures/stargazer-tactical-composite.webp',
      repeat: 3,
      roughness: 0.58,
      metalness: 0.62,
    });
    const frontier = this.createTexturedMaterial({
      color: 0x6b655b,
      path: '/assets/textures/ryushi-frontier-panels.webp',
      repeat: 3,
      roughness: 0.7,
      metalness: 0.48,
    });
    const securityLight = new THREE.MeshStandardMaterial({
      color: 0x73d9ff,
      emissive: 0x2aa8e8,
      emissiveIntensity: 1.55,
      roughness: 0.24,
      metalness: 0.18,
    });
    const segmentCount = 28;
    const perimeterRadius = this.playableRadius * 0.9;
    const pylonGeometry = new THREE.BoxGeometry(1.5, 9, 1.5);
    const panelGeometry = new THREE.BoxGeometry(91, 4.8, 0.42);
    const pylons = new THREE.InstancedMesh(pylonGeometry, frontier, segmentCount);
    const panels = new THREE.InstancedMesh(panelGeometry, composite, segmentCount);
    pylons.name = STATIC_INSTANCE_BATCH_NAMES.stargazerPylons;
    panels.name = STATIC_INSTANCE_BATCH_NAMES.stargazerPanels;
    const transform = new THREE.Object3D();
    for (let index = 0; index < segmentCount; index += 1) {
      const angle = (index / segmentCount) * Math.PI * 2;
      const x = Math.cos(angle) * perimeterRadius;
      const z = Math.sin(angle) * perimeterRadius;
      const ground = this.sampleHeight(x, z);
      transform.position.set(x, ground + 4.5, z);
      transform.rotation.set(0, -angle + Math.PI / 2, 0);
      transform.scale.setScalar(1);
      transform.updateMatrix();
      pylons.setMatrixAt(index, transform.matrix);
      transform.position.y = ground + 5.1;
      transform.updateMatrix();
      panels.setMatrixAt(index, transform.matrix);
      if (index % 2 === 0) {
        this.obstacleColliders.push({
          x, z, radius: 1.35, height: 9, baseY: ground,
          blocksProjectiles: true,
          sourceId: `stargazer-perimeter-pylon-${index + 1}`,
        });
      }
    }
    for (const batch of [pylons, panels]) {
      batch.castShadow = true;
      batch.receiveShadow = true;
      batch.instanceMatrix.setUsage(THREE.StaticDrawUsage);
      batch.instanceMatrix.needsUpdate = true;
      batch.userData.staticEnvironmentBatch = true;
      batch.userData.texturePath = batch === panels
        ? '/assets/textures/stargazer-tactical-composite.webp'
        : '/assets/textures/ryushi-frontier-panels.webp';
      batch.computeBoundingBox();
      batch.computeBoundingSphere();
      this.biomeGroup.add(batch);
      this.staticInstanceBatches.push(batch);
    }

    const mastCount = 12;
    const mastGeometry = new THREE.CylinderGeometry(0.32, 0.52, 24, 8);
    const floodlightGeometry = new THREE.BoxGeometry(2.8, 1, 1.2);
    const masts = new THREE.InstancedMesh(mastGeometry, frontier, mastCount);
    const floodlights = new THREE.InstancedMesh(floodlightGeometry, securityLight, mastCount);
    masts.name = STATIC_INSTANCE_BATCH_NAMES.stargazerMasts;
    floodlights.name = STATIC_INSTANCE_BATCH_NAMES.stargazerFloodlights;
    for (let index = 0; index < mastCount; index += 1) {
      const angle = (index / mastCount) * Math.PI * 2 + 0.17;
      const radius = 370 + (index % 2) * 55;
      const placement = this.resolveLegacyPlacement(Math.cos(angle) * radius, Math.sin(angle) * radius, 1.5, `stargazer-light-${index + 1}`);
      const ground = this.sampleHeight(placement.x, placement.z);
      transform.position.set(placement.x, ground + 12, placement.z);
      transform.rotation.set(0, 0, 0);
      transform.updateMatrix();
      masts.setMatrixAt(index, transform.matrix);
      transform.position.y = ground + 23.2;
      transform.rotation.set(-0.35, -angle, 0);
      transform.updateMatrix();
      floodlights.setMatrixAt(index, transform.matrix);
      this.treePerches.push(new THREE.Vector3(placement.x, ground + 24.5, placement.z));
      this.obstacleColliders.push({ x: placement.x, z: placement.z, radius: 1.15, height: 24, baseY: ground, blocksProjectiles: true, sourceId: `stargazer-light-mast-${index + 1}` });
    }
    for (const batch of [masts, floodlights]) {
      batch.castShadow = batch === masts;
      batch.receiveShadow = true;
      batch.instanceMatrix.setUsage(THREE.StaticDrawUsage);
      batch.instanceMatrix.needsUpdate = true;
      batch.userData.staticEnvironmentBatch = true;
      batch.userData.texturePath = batch === masts ? '/assets/textures/ryushi-frontier-panels.webp' : null;
      batch.computeBoundingBox();
      batch.computeBoundingSphere();
      this.biomeGroup.add(batch);
      this.staticInstanceBatches.push(batch);
    }
  }

  /**
   * Densifie la carte urbaine sans multiplier les objets Three.js : quatre
   * lots instanciés composent la ligne d'immeubles et les avenues éclairées.
   * Les toits restent des perches de chasse, tandis que les collisions des
   * façades peuvent céder leur budget aux couvertures de routes si nécessaire.
   */
  createLosAngelesCity() {
    const urbanSurface = this.createTexturedMaterial({
      color: 0x625044,
      path: '/assets/textures/los-angeles-heatwave-urban.webp',
      repeat: 4,
      roughness: 0.86,
      metalness: 0.12,
    });
    const roofSurface = new THREE.MeshStandardMaterial({
      color: 0x9a5036,
      emissive: 0x5c1d0d,
      emissiveIntensity: 0.72,
      roughness: 0.52,
      metalness: 0.24,
    });
    const sodiumLight = new THREE.MeshStandardMaterial({
      color: 0xffa24f,
      emissive: 0xff641f,
      emissiveIntensity: 1.8,
      roughness: 0.22,
      metalness: 0.08,
    });
    const blockCount = 24;
    const blocks = new THREE.InstancedMesh(new THREE.BoxGeometry(18, 40, 18), urbanSurface, blockCount);
    const roofRims = new THREE.InstancedMesh(new THREE.BoxGeometry(18.4, 0.55, 18.4), roofSurface, blockCount);
    blocks.name = STATIC_INSTANCE_BATCH_NAMES.losAngelesBlocks;
    roofRims.name = STATIC_INSTANCE_BATCH_NAMES.losAngelesRoofRims;
    const transform = new THREE.Object3D();
    for (let index = 0; index < blockCount; index += 1) {
      const angle = (index / blockCount) * Math.PI * 2 + 0.11;
      const radius = 270 + (index % 4) * 88;
      const placement = this.resolveLegacyPlacement(Math.cos(angle) * radius, Math.sin(angle) * radius, 12, `los-angeles-block-${index + 1}`);
      const ground = this.sampleHeight(placement.x, placement.z);
      const widthScale = 0.72 + (index % 3) * 0.16;
      const heightScale = 0.72 + (index % 5) * 0.12;
      const depthScale = 0.78 + ((index + 1) % 3) * 0.13;
      transform.position.set(placement.x, ground + 20 * heightScale, placement.z);
      transform.rotation.set(0, -angle + (index % 2) * 0.16, 0);
      transform.scale.set(widthScale, heightScale, depthScale);
      transform.updateMatrix();
      blocks.setMatrixAt(index, transform.matrix);
      transform.position.y = ground + 40 * heightScale + 0.3;
      transform.scale.set(widthScale, 1, depthScale);
      transform.updateMatrix();
      roofRims.setMatrixAt(index, transform.matrix);
      this.treePerches.push(new THREE.Vector3(placement.x, ground + 40 * heightScale + 1.2, placement.z));
      this.obstacleColliders.push({
        x: placement.x,
        z: placement.z,
        radius: 10.5 * Math.max(widthScale, depthScale),
        height: 40 * heightScale,
        baseY: ground,
        blocksProjectiles: true,
        routeBudgetDemotable: true,
        sourceId: `los-angeles-city-block-${index + 1}`,
      });
    }

    const lightCount = 20;
    const streetlights = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.18, 0.28, 13, 7), urbanSurface, lightCount);
    const lamps = new THREE.InstancedMesh(new THREE.BoxGeometry(1.8, 0.55, 0.8), sodiumLight, lightCount);
    streetlights.name = STATIC_INSTANCE_BATCH_NAMES.losAngelesStreetlights;
    lamps.name = STATIC_INSTANCE_BATCH_NAMES.losAngelesLamps;
    for (let index = 0; index < lightCount; index += 1) {
      const x = -500 + index * (1000 / (lightCount - 1));
      const z = index % 2 === 0 ? 205 : -135;
      const placement = this.resolveLegacyPlacement(x, z, 1, `los-angeles-streetlight-${index + 1}`);
      const ground = this.sampleHeight(placement.x, placement.z);
      transform.position.set(placement.x, ground + 6.5, placement.z);
      transform.rotation.set(0, 0, 0);
      transform.scale.setScalar(1);
      transform.updateMatrix();
      streetlights.setMatrixAt(index, transform.matrix);
      transform.position.y = ground + 13;
      transform.rotation.set(-0.2, 0, index % 2 === 0 ? -0.18 : 0.18);
      transform.updateMatrix();
      lamps.setMatrixAt(index, transform.matrix);
    }

    for (const batch of [blocks, roofRims, streetlights, lamps]) {
      batch.castShadow = batch === blocks || batch === streetlights;
      batch.receiveShadow = true;
      batch.instanceMatrix.setUsage(THREE.StaticDrawUsage);
      batch.instanceMatrix.needsUpdate = true;
      batch.userData.staticEnvironmentBatch = true;
      batch.userData.texturePath = batch === blocks || batch === streetlights
        ? '/assets/textures/los-angeles-heatwave-urban.webp'
        : null;
      batch.computeBoundingBox();
      batch.computeBoundingSphere();
      this.biomeGroup.add(batch);
      this.staticInstanceBatches.push(batch);
    }
  }

  /**
   * Gunnison reste une carte ouverte et lisible malgré la nuit et la pluie.
   * Les bâtiments, conifères, tombes, éclairages et nervures de ruche sont
   * regroupés en lots instanciés : la ville paraît dense sans exploser les
   * appels GPU ni le budget de collisions réservé aux routes de chasse.
   */
  createGunnisonOutbreak() {
    const wetUrban = this.createTexturedMaterial({
      color: 0x465258,
      path: '/assets/textures/gunnison-rain-urban.webp',
      repeat: 4,
      roughness: 0.76,
      metalness: 0.13,
    });
    const wetRoof = this.createTexturedMaterial({
      color: 0x252f34,
      path: '/assets/textures/gunnison-rain-urban.webp',
      repeat: 3,
      roughness: 0.62,
      metalness: 0.22,
    });
    const forestSurface = this.createTexturedMaterial({
      color: 0x26342f,
      path: '/assets/textures/gunnison-rain-urban.webp',
      repeat: 3,
      roughness: 0.94,
      metalness: 0.01,
    });
    const resinSurface = this.createTexturedMaterial({
      color: 0x22372f,
      path: '/assets/textures/hive-biomechanical-membrane.webp',
      repeat: 3,
      roughness: 0.42,
      metalness: 0.2,
    });
    const emergencySurface = new THREE.MeshStandardMaterial({
      color: 0xaed4db,
      emissive: 0x456f78,
      emissiveIntensity: 1.35,
      roughness: 0.28,
      metalness: 0.18,
    });
    const failedLampSurface = new THREE.MeshStandardMaterial({
      color: 0xdce7c4,
      emissive: 0x9ca832,
      emissiveIntensity: 1.7,
      roughness: 0.24,
      metalness: 0.06,
    });
    const transform = new THREE.Object3D();

    const buildingCount = 20;
    const blocks = new THREE.InstancedMesh(new THREE.BoxGeometry(22, 34, 18, 2, 5, 2), wetUrban, buildingCount);
    const roofs = new THREE.InstancedMesh(new THREE.BoxGeometry(23, 0.7, 19, 2, 1, 2), wetRoof, buildingCount);
    const windows = new THREE.InstancedMesh(new THREE.BoxGeometry(11, 7, 0.24), emergencySurface, buildingCount * 2);
    blocks.name = STATIC_INSTANCE_BATCH_NAMES.gunnisonBlocks;
    roofs.name = STATIC_INSTANCE_BATCH_NAMES.gunnisonRoofCaps;
    windows.name = STATIC_INSTANCE_BATCH_NAMES.gunnisonWindows;
    for (let index = 0; index < buildingCount; index += 1) {
      const angle = index * 2.399963229728653 + 0.18;
      const radius = 235 + ((index * 83) % 315);
      const candidateX = Math.cos(angle) * radius - 18;
      const candidateZ = Math.sin(angle) * radius - 35;
      const placement = this.resolveLegacyPlacement(candidateX, candidateZ, 13, `gunnison-block-${index + 1}`);
      const ground = this.sampleHeight(placement.x, placement.z);
      const widthScale = 0.72 + (index % 4) * 0.11;
      const heightScale = 0.7 + (index % 5) * 0.1;
      const depthScale = 0.78 + ((index + 2) % 4) * 0.09;
      const yaw = -angle + (index % 3 - 1) * 0.14;
      transform.position.set(placement.x, ground + 17 * heightScale, placement.z);
      transform.rotation.set(0, yaw, 0);
      transform.scale.set(widthScale, heightScale, depthScale);
      transform.updateMatrix();
      blocks.setMatrixAt(index, transform.matrix);

      transform.position.y = ground + 34 * heightScale + 0.36;
      transform.scale.set(widthScale, 1, depthScale);
      transform.updateMatrix();
      roofs.setMatrixAt(index, transform.matrix);

      for (let face = 0; face < 2; face += 1) {
        const side = face === 0 ? 1 : -1;
        const offset = new THREE.Vector3(0, 0, side * 9.15 * depthScale).applyAxisAngle(THREE.Object3D.DEFAULT_UP, yaw);
        transform.position.set(
          placement.x + offset.x,
          ground + 17 * heightScale,
          placement.z + offset.z,
        );
        transform.rotation.set(0, yaw + (face === 0 ? 0 : Math.PI), 0);
        transform.scale.set(widthScale, Math.max(0.7, heightScale), 1);
        transform.updateMatrix();
        windows.setMatrixAt(index * 2 + face, transform.matrix);
      }
      this.treePerches.push(new THREE.Vector3(placement.x, ground + 34 * heightScale + 1.4, placement.z));
      this.obstacleColliders.push({
        x: placement.x,
        z: placement.z,
        radius: 11.5 * Math.max(widthScale, depthScale),
        height: 34 * heightScale,
        baseY: ground,
        blocksProjectiles: true,
        routeBudgetDemotable: true,
        sourceId: `gunnison-city-block-${index + 1}`,
      });
    }

    const pineCount = 24;
    const pineTrunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.75, 1.45, 24, 8), forestSurface, pineCount);
    const pineCrowns = new THREE.InstancedMesh(new THREE.ConeGeometry(5.8, 20, 9), forestSurface, pineCount);
    pineTrunks.name = STATIC_INSTANCE_BATCH_NAMES.gunnisonPineTrunks;
    pineCrowns.name = STATIC_INSTANCE_BATCH_NAMES.gunnisonPineCrowns;
    for (let index = 0; index < pineCount; index += 1) {
      const clusterX = index % 2 === 0 ? -235 : 35;
      const clusterZ = index % 3 === 0 ? 510 : 585;
      const angle = index * 2.399963229728653;
      const distance = 55 + (index % 6) * 18;
      const placement = this.resolveLegacyPlacement(
        clusterX + Math.cos(angle) * distance,
        clusterZ + Math.sin(angle) * distance,
        3.4,
        `gunnison-pine-${index + 1}`,
      );
      const ground = this.sampleHeight(placement.x, placement.z);
      const scale = 0.74 + (index % 5) * 0.09;
      transform.position.set(placement.x, ground + 12 * scale, placement.z);
      transform.rotation.set(0, angle, (index % 3 - 1) * 0.035);
      transform.scale.setScalar(scale);
      transform.updateMatrix();
      pineTrunks.setMatrixAt(index, transform.matrix);
      transform.position.y = ground + 25 * scale;
      transform.updateMatrix();
      pineCrowns.setMatrixAt(index, transform.matrix);
      if (index % 4 === 0) {
        this.obstacleColliders.push({
          x: placement.x, z: placement.z, radius: 2.2 * scale, height: 32 * scale, baseY: ground,
          blocksProjectiles: true, routeBudgetDemotable: true, sourceId: `gunnison-pine-${index + 1}`,
        });
        this.treePerches.push(new THREE.Vector3(placement.x, ground + 32 * scale, placement.z));
      }
    }

    const headstoneCount = 30;
    const headstones = new THREE.InstancedMesh(new THREE.BoxGeometry(0.85, 2.6, 0.38, 1, 2, 1), wetRoof, headstoneCount);
    headstones.name = STATIC_INSTANCE_BATCH_NAMES.gunnisonHeadstones;
    for (let index = 0; index < headstoneCount; index += 1) {
      const row = Math.floor(index / 6);
      const column = index % 6;
      const x = -470 + column * 15 + (row % 2) * 2.5;
      const z = 410 + row * 17;
      const ground = this.sampleHeight(x, z);
      transform.position.set(x, ground + 1.3, z);
      transform.rotation.set(0, 0.12 + (index % 3 - 1) * 0.08, (index % 4 - 1.5) * 0.025);
      transform.scale.set(0.82 + (index % 4) * 0.07, 0.85 + (index % 3) * 0.09, 1);
      transform.updateMatrix();
      headstones.setMatrixAt(index, transform.matrix);
    }

    const streetlightCount = 20;
    const streetlights = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.16, 0.26, 13, 7), wetUrban, streetlightCount);
    const lamps = new THREE.InstancedMesh(new THREE.BoxGeometry(1.7, 0.52, 0.74), failedLampSurface, streetlightCount);
    streetlights.name = STATIC_INSTANCE_BATCH_NAMES.gunnisonStreetlights;
    lamps.name = STATIC_INSTANCE_BATCH_NAMES.gunnisonLamps;
    for (let index = 0; index < streetlightCount; index += 1) {
      const progress = index / Math.max(1, streetlightCount - 1);
      const x = -520 + progress * 1040;
      const z = index % 2 === 0 ? 185 : -185;
      const placement = this.resolveLegacyPlacement(x, z, 1, `gunnison-streetlight-${index + 1}`);
      const ground = this.sampleHeight(placement.x, placement.z);
      transform.position.set(placement.x, ground + 6.5, placement.z);
      transform.rotation.set(0, 0, 0);
      transform.scale.setScalar(1);
      transform.updateMatrix();
      streetlights.setMatrixAt(index, transform.matrix);
      transform.position.y = ground + 13;
      transform.rotation.set(-0.16, 0, index % 2 === 0 ? -0.15 : 0.15);
      transform.updateMatrix();
      lamps.setMatrixAt(index, transform.matrix);
    }

    const resinRibCount = 18;
    const resinRibs = new THREE.InstancedMesh(new THREE.TorusGeometry(5, 0.62, 7, 18, Math.PI), resinSurface, resinRibCount);
    resinRibs.name = STATIC_INSTANCE_BATCH_NAMES.gunnisonResinRibs;
    for (let index = 0; index < resinRibCount; index += 1) {
      const progress = index / Math.max(1, resinRibCount - 1);
      const x = 485 - progress * 155 + Math.sin(index * 1.4) * 14;
      const z = 30 - progress * 345 + Math.cos(index * 1.1) * 16;
      transform.position.set(x, this.sampleHeight(x, z) + 5.2, z);
      transform.rotation.set(0, Math.PI / 2 + Math.sin(index) * 0.1, Math.PI / 2);
      transform.scale.set(0.78 + (index % 3) * 0.08, 0.88 + (index % 4) * 0.06, 0.8);
      transform.updateMatrix();
      resinRibs.setMatrixAt(index, transform.matrix);
    }

    const textureByBatch = new Map([
      [blocks, '/assets/textures/gunnison-rain-urban.webp'],
      [roofs, '/assets/textures/gunnison-rain-urban.webp'],
      [windows, null],
      [pineTrunks, '/assets/textures/gunnison-rain-urban.webp'],
      [pineCrowns, '/assets/textures/gunnison-rain-urban.webp'],
      [headstones, '/assets/textures/gunnison-rain-urban.webp'],
      [streetlights, '/assets/textures/gunnison-rain-urban.webp'],
      [lamps, null],
      [resinRibs, '/assets/textures/hive-biomechanical-membrane.webp'],
    ]);
    for (const batch of textureByBatch.keys()) {
      batch.castShadow = [blocks, pineTrunks, headstones, streetlights].includes(batch);
      batch.receiveShadow = true;
      batch.instanceMatrix.setUsage(THREE.StaticDrawUsage);
      batch.instanceMatrix.needsUpdate = true;
      batch.computeBoundingBox();
      batch.computeBoundingSphere();
      batch.userData.staticEnvironmentBatch = true;
      batch.userData.texturePath = textureByBatch.get(batch);
      batch.userData.sourceAdaptation = 'avpr_gunnison_original';
      this.biomeGroup.add(batch);
      this.staticInstanceBatches.push(batch);
    }

    const emergencyLights = [
      { name: 'gunnison-power-emergency-light', color: 0x9ecdd8, intensity: 2.25, distance: 235, position: [425, 20, 445] },
      { name: 'gunnison-guard-emergency-light', color: 0xd8b849, intensity: 2.05, distance: 210, position: [0, 16, 145] },
      { name: 'gunnison-hospital-emergency-light', color: 0xe35e4b, intensity: 2.2, distance: 250, position: [360, 28, -285] },
      { name: 'gunnison-extraction-beacon-light', color: 0x9fbf48, intensity: 2.35, distance: 260, position: [0, 22, -620] },
    ];
    for (const entry of emergencyLights) {
      const light = new THREE.PointLight(entry.color, entry.intensity, entry.distance, 1.9);
      light.name = entry.name;
      light.position.set(entry.position[0], this.sampleHeight(entry.position[0], entry.position[2]) + entry.position[1], entry.position[2]);
      light.castShadow = false;
      light.userData.gunnisonEmergencyLight = true;
      this.biomeGroup.add(light);
    }
  }

  createBouvetoyaPyramid() {
    const ice = this.createTexturedMaterial({
      color: 0x9bbdca,
      path: '/assets/textures/bouvetoya-ice-rock.webp',
      repeat: 4,
      roughness: 0.86,
      metalness: 0.03,
    });
    const pyramidStone = this.createTexturedMaterial({
      color: 0x4f4238,
      path: '/assets/textures/bouvetoya-pyramid-stone.webp',
      repeat: 5,
      roughness: 0.78,
      metalness: 0.16,
    });
    const resin = this.createTexturedMaterial({
      color: 0x263b32,
      path: '/assets/textures/hive-biomechanical-membrane.webp',
      repeat: 4,
      roughness: 0.38,
      metalness: 0.2,
    });
    const transform = new THREE.Object3D();

    const iceSpires = new THREE.InstancedMesh(new THREE.ConeGeometry(5, 31, 7), ice, 28);
    iceSpires.name = STATIC_INSTANCE_BATCH_NAMES.bouvetIceSpires;
    for (let index = 0; index < iceSpires.count; index += 1) {
      const angle = (index / iceSpires.count) * Math.PI * 2 + Math.sin(index * 2.17) * 0.12;
      const radius = 515 + ((index * 47) % 155);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const scale = 0.72 + (index % 5) * 0.1;
      transform.position.set(x, this.sampleHeight(x, z) + 15.5 * scale, z);
      transform.rotation.set((index % 2 ? 1 : -1) * 0.08, angle, (index % 3 - 1) * 0.1);
      transform.scale.set(scale, scale, scale);
      transform.updateMatrix();
      iceSpires.setMatrixAt(index, transform.matrix);
    }

    const monoliths = new THREE.InstancedMesh(new THREE.CylinderGeometry(3.7, 5.4, 27, 6), pyramidStone, 24);
    monoliths.name = STATIC_INSTANCE_BATCH_NAMES.bouvetPyramidMonoliths;
    for (let index = 0; index < monoliths.count; index += 1) {
      const angle = index * 2.399963229728653 + 0.35;
      const radius = 185 + ((index * 67) % 300);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius - 35;
      const scale = 0.68 + (index % 4) * 0.1;
      transform.position.set(x, this.sampleHeight(x, z) + 13.5 * scale, z);
      transform.rotation.set(0, angle + 0.2, (index % 2 ? 1 : -1) * 0.06);
      transform.scale.set(scale, scale, scale);
      transform.updateMatrix();
      monoliths.setMatrixAt(index, transform.matrix);
    }

    const resinRibs = new THREE.InstancedMesh(new THREE.TorusGeometry(5.2, 0.68, 7, 18, Math.PI), resin, 20);
    resinRibs.name = STATIC_INSTANCE_BATCH_NAMES.bouvetResinRibs;
    for (let index = 0; index < resinRibs.count; index += 1) {
      const progress = index / Math.max(1, resinRibs.count - 1);
      const x = 520 - progress * 760 + Math.sin(index * 1.7) * 34;
      const z = 30 - progress * 390 + Math.cos(index * 1.2) * 28;
      transform.position.set(x, this.sampleHeight(x, z) + 5.4, z);
      transform.rotation.set(0, Math.PI / 2 + Math.sin(index) * 0.12, Math.PI / 2);
      transform.scale.set(0.82 + (index % 3) * 0.08, 0.92 + (index % 4) * 0.07, 0.82);
      transform.updateMatrix();
      resinRibs.setMatrixAt(index, transform.matrix);
    }

    for (const [batch, texturePath] of [
      [iceSpires, '/assets/textures/bouvetoya-ice-rock.webp'],
      [monoliths, '/assets/textures/bouvetoya-pyramid-stone.webp'],
      [resinRibs, '/assets/textures/hive-biomechanical-membrane.webp'],
    ]) {
      batch.castShadow = true;
      batch.receiveShadow = true;
      batch.instanceMatrix.setUsage(THREE.StaticDrawUsage);
      batch.instanceMatrix.needsUpdate = true;
      batch.computeBoundingBox();
      batch.computeBoundingSphere();
      batch.userData.staticEnvironmentBatch = true;
      batch.userData.texturePath = texturePath;
      this.biomeGroup.add(batch);
      this.staticInstanceBatches.push(batch);
    }

    const lightPlan = [
      { color: 0xa9eeff, intensity: 2.2, distance: 360, position: [0, 30, 525], name: 'bouvet-surface-cold-fill' },
      { color: 0xc47d45, intensity: 2.65, distance: 250, position: [-165, 18, 150], name: 'bouvet-plasma-vault-bronze-light' },
      { color: 0xb76438, intensity: 2.4, distance: 280, position: [105, 16, 105], name: 'bouvet-shifting-crossroads-bronze-light' },
      { color: 0x7da66c, intensity: 2.15, distance: 260, position: [-350, 20, -350], name: 'bouvet-queen-resin-light' },
    ];
    for (const entry of lightPlan) {
      const light = new THREE.PointLight(entry.color, entry.intensity, entry.distance, 1.8);
      light.name = entry.name;
      light.position.set(entry.position[0], this.sampleHeight(entry.position[0], entry.position[2]) + entry.position[1], entry.position[2]);
      light.castShadow = false;
      light.userData.bouvetoyaInteriorLight = true;
      this.biomeGroup.add(light);
      this.pyramidInteriorLights.push(light);
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
      const isGunnison = this.currentBiome === 'gunnison_outbreak';
      this.rainParticles = this.createWeatherParticles({
        color: isHive ? 0x00ff44 : isGunnison ? 0xa7ccd6 : 0x8fc7dc,
        count: isHive ? 1000 : isGunnison ? 1150 : 850,
        size: isHive ? 1 : isGunnison ? 0.66 : 0.72,
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
    this.sunSphere.visible = isVisible && !['hive_lv426', 'los_angeles_1997', 'gunnison_outbreak'].includes(this.currentBiome);
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
    const requestedWeather = weatherEvent == null && this.currentBiome === 'gunnison_outbreak'
      ? 'rain'
      : weatherEvent;
    if (requestedWeather !== undefined && requestedWeather !== this.activeWeatherEvent) {
      this.setWeatherEvent(requestedWeather);
    }
    this.updateThermalFootprints(frameDelta, visionMode);
    this.updateDynamicEventZones(frameDelta);
    this.updatePyramidShift(frameDelta);
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
