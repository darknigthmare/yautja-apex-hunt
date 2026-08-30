import * as THREE from 'three';
import { HUNT_DEFINITIONS } from '../data/GameConfig.js';

const HUB_ZONES = Object.freeze({
  VAULT: 'trophy-vault',
  MISSIONS: 'mission-nexus',
  FORGE: 'armory-forge',
  HANGAR: 'vehicle-hangar',
  UTILITIES: 'ship-utilities',
});

const SIGNAL_COLORS = Object.freeze({
  vault: 0x9d5cff,
  forge: 0xff9b24,
  hangar: 0x20d8ff,
  navigation: 0x69f7d0,
});

const SHIP_COMPARTMENTS = Object.freeze([
  Object.freeze({
    id: 'bridge-cockpit',
    label: 'Pont de commandement et cockpit stellaire',
    deck: 'command',
    bounds: Object.freeze({ minX: -25, maxX: 25, minZ: -84, maxZ: -56 }),
    inspiration: 'architecture organique, cockpit et hologrammes de navigation',
  }),
  Object.freeze({
    id: HUB_ZONES.VAULT,
    label: 'Galerie cérémonielle des trophées',
    deck: 'ritual',
    bounds: Object.freeze({ minX: -33, maxX: 33, minZ: -38, maxZ: -26 }),
    inspiration: 'chambre des trophées et archives de chasse',
  }),
  Object.freeze({
    id: HUB_ZONES.MISSIONS,
    label: 'Nexus des contrats de chasse',
    deck: 'ritual',
    bounds: Object.freeze({ minX: -32, maxX: 32, minZ: -24, maxZ: 14 }),
    inspiration: 'hologrammes de briefing et glyphes de clan',
  }),
  Object.freeze({
    id: HUB_ZONES.FORGE,
    label: 'Armurerie et forge moléculaire',
    deck: 'starboard',
    bounds: Object.freeze({ minX: 36, maxX: 64, minZ: -4, maxZ: 30 }),
    inspiration: 'râteliers biomécaniques et atelier de terrain',
  }),
  Object.freeze({
    id: 'cryo-gallery',
    label: 'Galerie de cryostase des chasseurs',
    deck: 'port',
    bounds: Object.freeze({ minX: -64, maxX: -36, minZ: -40, maxZ: -10 }),
    inspiration: 'alcôves de sommeil et trappes cryogéniques',
  }),
  Object.freeze({
    id: 'escape-pod-bay',
    label: 'Baie des pods d’évacuation et de traque',
    deck: 'port',
    bounds: Object.freeze({ minX: -64, maxX: -36, minZ: -4, maxZ: 30 }),
    inspiration: 'capsules individuelles enchâssées dans la coque',
  }),
  Object.freeze({
    id: 'cleaner-medbay',
    label: 'Medbay et laboratoire Cleaner',
    deck: 'starboard',
    bounds: Object.freeze({ minX: 36, maxX: 64, minZ: -40, maxZ: -10 }),
    inspiration: 'équipement de confinement et neutralisation biologique',
  }),
  Object.freeze({
    id: HUB_ZONES.HANGAR,
    label: 'Grand hangar des appareils de chasse',
    deck: 'aft-port',
    bounds: Object.freeze({ minX: -64, maxX: -16, minZ: 40, maxZ: 80 }),
    inspiration: 'vaisseau éclaireur, navette et berceaux de pods',
  }),
  Object.freeze({
    id: 'engine-core',
    label: 'Noyau énergétique et moteurs',
    deck: 'aft-starboard',
    bounds: Object.freeze({ minX: 16, maxX: 64, minZ: 40, maxZ: 80 }),
    inspiration: 'réacteur annulaire et conduites de propulsion',
  }),
  Object.freeze({
    id: 'rear-airlock',
    label: 'Sas arrière pressurisé',
    deck: 'aft',
    bounds: Object.freeze({ minX: -14, maxX: 14, minZ: 58, maxZ: 86 }),
    inspiration: 'sas arrière et écoutille circulaire',
  }),
  Object.freeze({
    id: 'spine-corridor',
    label: 'Épine dorsale et coursives de circulation',
    deck: 'transit',
    bounds: Object.freeze({ minX: -9, maxX: 9, minZ: -82, maxZ: 82 }),
    inspiration: 'coursives fluides, nervures et pont ajouré',
  }),
]);

const PRESSURE_DOORS = Object.freeze([
  ['bridge-spine-gate', 'bridge-cockpit', 'spine-corridor', 0, -52, 'x', 12],
  ['vault-port-gate', HUB_ZONES.VAULT, 'spine-corridor', -35, -32, 'z', 8],
  ['vault-starboard-gate', HUB_ZONES.VAULT, 'spine-corridor', 35, -32, 'z', 8],
  ['mission-spine-gate', HUB_ZONES.MISSIONS, 'spine-corridor', 0, -18, 'x', 10],
  ['cryo-spine-gate', 'cryo-gallery', 'spine-corridor', -36, -22, 'z', 10],
  ['cleaner-spine-gate', 'cleaner-medbay', 'spine-corridor', 36, -22, 'z', 10],
  ['pods-spine-gate', 'escape-pod-bay', 'spine-corridor', -36, 12, 'z', 10],
  ['forge-spine-gate', HUB_ZONES.FORGE, 'spine-corridor', 36, 12, 'z', 10],
  ['hangar-spine-gate', HUB_ZONES.HANGAR, 'spine-corridor', -20, 40, 'x', 12],
  ['core-spine-gate', 'engine-core', 'spine-corridor', 20, 40, 'x', 12],
  ['hangar-airlock-gate', HUB_ZONES.HANGAR, 'rear-airlock', -9, 60, 'z', 8],
  ['core-airlock-gate', 'engine-core', 'rear-airlock', 9, 60, 'z', 8],
  ['rear-pressure-hatch', 'rear-airlock', 'spine-corridor', 0, 82, 'x', 10],
].map(([id, from, to, x, z, axis, width]) => Object.freeze({
  id,
  from,
  to,
  position: Object.freeze({ x, y: 0, z }),
  axis,
  width,
  clearance: 5.6,
  state: 'open',
})));

const BULKHEAD_SEGMENTS = Object.freeze([
  ['forward-bulkhead-port', -37.5, -52, 27.5, 0.6],
  ['forward-bulkhead-starboard', 37.5, -52, 27.5, 0.6],
  ['port-bulkhead-forward', -36, -40, 0.6, 9],
  ['port-bulkhead-mid', -36, -5, 0.6, 12],
  ['port-bulkhead-aft', -36, 32, 0.6, 5],
  ['starboard-bulkhead-forward', 36, -40, 0.6, 9],
  ['starboard-bulkhead-mid', 36, -5, 0.6, 12],
  ['starboard-bulkhead-aft', 36, 32, 0.6, 5],
  ['aft-bulkhead-port', -50, 40, 14, 0.6],
  ['aft-bulkhead-starboard', 50, 40, 14, 0.6],
  ['aft-divider-forward', 0, 48, 0.6, 8],
  ['aft-divider-rear', 0, 72, 0.6, 8],
].map(([id, x, z, halfWidth, halfDepth]) => Object.freeze({ id, type: 'box', x, z, halfWidth, halfDepth })));

const PERCH_POINTS = Object.freeze([
  ['perch-bridge-port', -21, 6.8, -66, 'bridge-cockpit'],
  ['perch-bridge-starboard', 21, 6.8, -66, 'bridge-cockpit'],
  ['perch-cryo', -59, 6.2, -28, 'cryo-gallery'],
  ['perch-cleaner', 59, 6.2, -28, 'cleaner-medbay'],
  ['perch-pods', -59, 6.2, 18, 'escape-pod-bay'],
  ['perch-forge', 59, 6.2, 18, HUB_ZONES.FORGE],
  ['perch-hangar-fore', -55, 7.2, 50, HUB_ZONES.HANGAR],
  ['perch-hangar-aft', -55, 7.2, 70, HUB_ZONES.HANGAR],
  ['perch-core-fore', 55, 7.2, 50, 'engine-core'],
  ['perch-core-aft', 55, 7.2, 70, 'engine-core'],
].map(([id, x, y, z, zone]) => Object.freeze({ id, x, y, z, zone, radius: 1.45 })));

const HANGAR_EXTENSION_CRAFT = Object.freeze([
  Object.freeze({ id: 'hangar-heavy-scout', x: -52, z: 55, radius: 4.4 }),
  Object.freeze({ id: 'hangar-clan-shuttle', x: -31, z: 55, radius: 4.8 }),
  Object.freeze({ id: 'hangar-drop-ship', x: -43, z: 71, radius: 5.2 }),
]);

function getMissionStationPosition(index, count) {
  const leftCount = Math.ceil(count / 2);
  const isLeft = index < leftCount;
  const sideIndex = isLeft ? index : index - leftCount;
  const sideCount = isLeft ? leftCount : Math.max(1, count - leftCount);
  const magnitude = sideCount <= 1 ? 6 : 6 + ((22 * sideIndex) / (sideCount - 1));
  const stagger = sideIndex % 2;
  return {
    x: (isLeft ? -1 : 1) * magnitude,
    z: isLeft ? -10 + (stagger * 10) : -(stagger * 10),
  };
}

export class MothershipHub {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'mothership-hub';
    this.group.userData.zone = 'hub';
    this.animatedProps = [];
    this.trophyDisplays = new Map();
    this.animationTime = 0;
    this.alloyTexture = null;
    this.trophyTexture = null;
    this.energyTexture = null;
    this.vehicleDisplays = [];
    this.landmarks = new Map();
    this.compartmentLandmarks = new Map();
    this.propRegistry = [];
    this.materialCache = new Map();
    this.zones = SHIP_COMPARTMENTS;
    this.doors = PRESSURE_DOORS;
    this.perches = PERCH_POINTS;
    this.disposed = false;
    if (typeof document !== 'undefined') {
      const textureLoader = new THREE.TextureLoader();
      this.alloyTexture = textureLoader.load(
        '/assets/textures/yautja-alloy.webp',
        undefined,
        undefined,
        () => console.warn('Texture du vaisseau indisponible, fallback métallique conservé.'),
      );
      this.alloyTexture.wrapS = THREE.RepeatWrapping;
      this.alloyTexture.wrapT = THREE.RepeatWrapping;
      this.alloyTexture.repeat.set(6, 6);
      this.alloyTexture.colorSpace = THREE.SRGBColorSpace;
      this.trophyTexture = textureLoader.load(
        '/assets/textures/trophy-bone.webp',
        undefined,
        undefined,
        () => console.warn('Texture des trophées indisponible, fallback coloré conservé.'),
      );
      this.trophyTexture.wrapS = THREE.RepeatWrapping;
      this.trophyTexture.wrapT = THREE.RepeatWrapping;
      this.trophyTexture.repeat.set(2, 2);
      this.trophyTexture.colorSpace = THREE.SRGBColorSpace;
      this.energyTexture = textureLoader.load(
        '/assets/textures/yautja-energy-lattice.webp',
        undefined,
        undefined,
        () => console.warn('Texture énergétique Yautja indisponible, émissif procédural conservé.'),
      );
      this.energyTexture.wrapS = THREE.RepeatWrapping;
      this.energyTexture.wrapT = THREE.RepeatWrapping;
      this.energyTexture.repeat.set(2, 2);
      this.energyTexture.colorSpace = THREE.SRGBColorSpace;
    }

    this.createShipInterior();
    this.createStructuralRibs();
    this.createCompartmentArchitecture();
    this.createBridgeCockpit();
    this.createCryostasisAndPodBay();
    this.createCleanerMedbay();
    this.createEngineCoreAndAirlock();
    this.createTrophyVaultWall();
    this.createMissionPedestals();
    this.createArmoryForgeStation();
    this.createVehicleHangar();
    this.createHangarExpansion();
    this.createUtilityNetwork();
    this.createNavigationBeacons();
    this.createGameplayLayout();
    this.scene.add(this.group);
  }

  createAlloyMaterial(color = 0x27303a) {
    const cacheKey = `alloy:${color}`;
    if (!this.materialCache.has(cacheKey)) {
      this.materialCache.set(cacheKey, new THREE.MeshStandardMaterial({
        color,
        map: this.alloyTexture,
        emissive: color,
        emissiveIntensity: 0.24,
        roughness: 0.38,
        metalness: 0.88,
      }));
    }
    return this.materialCache.get(cacheKey);
  }

  createSignalMaterial(color, opacity = 1) {
    const cacheKey = `signal:${color}:${opacity}`;
    if (!this.materialCache.has(cacheKey)) {
      this.materialCache.set(cacheKey, new THREE.MeshStandardMaterial({
        color,
        map: this.energyTexture,
        emissive: color,
        emissiveIntensity: opacity < 1 ? 1.45 : 0.9,
        roughness: 0.24,
        metalness: 0.42,
        transparent: opacity < 1,
        opacity,
        depthWrite: opacity >= 1,
      }));
    }
    return this.materialCache.get(cacheKey);
  }

  registerProp(object, zone, role, details = {}) {
    object.userData = { ...object.userData, zone, role, ...details };
    this.propRegistry.push(object);
    return object;
  }

  registerLandmark(id, object, label) {
    object.name = id;
    object.userData = { ...object.userData, landmarkId: id, label };
    this.landmarks.set(id, object);
    return object;
  }

  registerCompartmentLandmark(id, object, label) {
    object.name = id;
    object.userData = { ...object.userData, landmarkId: id, label, compartment: true };
    this.compartmentLandmarks.set(id, object);
    return object;
  }

  createShipInterior() {
    const room = new THREE.Mesh(
      new THREE.BoxGeometry(138, 38, 184),
      new THREE.MeshStandardMaterial({
        color: 0x17202a,
        map: this.alloyTexture,
        roughness: 0.42,
        emissive: 0x17202a,
        emissiveIntensity: 0.28,
        metalness: 0.86,
        side: THREE.BackSide,
      }),
    );
    room.name = 'pressurized-hull';
    room.position.y = 19;
    this.group.add(room);

    // Sept cent soixante-huit plaques couvrent le croiseur en un seul draw call.
    const deckPlates = new THREE.InstancedMesh(
      new THREE.BoxGeometry(5.3, 0.08, 5.3),
      this.createAlloyMaterial(0x202a32),
      768,
    );
    const matrix = new THREE.Matrix4();
    let instanceIndex = 0;
    for (let row = 0; row < 32; row += 1) {
      for (let column = 0; column < 24; column += 1) {
        matrix.makeTranslation(-63.25 + (column * 5.5), 0.04, -85.25 + (row * 5.5));
        deckPlates.setMatrixAt(instanceIndex, matrix);
        instanceIndex += 1;
      }
    }
    deckPlates.instanceMatrix.needsUpdate = true;
    deckPlates.name = 'segmented-deck-plates';
    this.registerProp(deckPlates, 'hub', 'floor-panels', { instanceCount: 768, shipLength: 184, shipWidth: 138 });
    this.group.add(deckPlates);

    const routes = new THREE.Group();
    routes.name = 'floor-navigation-routes';
    const warmRoute = this.createSignalMaterial(0xff3218, 0.82);
    const routeInstances = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      warmRoute,
      21,
    );
    routeInstances.name = 'navigation-route-instances';
    const routeTransform = new THREE.Object3D();
    let routeIndex = 0;
    for (let i = -3; i <= 3; i += 1) {
      routeTransform.position.set(0, 0.11, i * 9);
      routeTransform.rotation.set(0, 0, 0);
      routeTransform.scale.set(60, 0.055, 0.25);
      routeTransform.updateMatrix();
      routeInstances.setMatrixAt(routeIndex, routeTransform.matrix);
      routeIndex += 1;
    }
    const centralRoute = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.06, 170),
      this.createSignalMaterial(SIGNAL_COLORS.navigation, 0.7),
    );
    centralRoute.position.set(0, 0.12, 0);
    routes.add(centralRoute);
    for (let z = 27; z >= -27; z -= 9) {
      for (const direction of [-1, 1]) {
        routeTransform.position.set(direction * 1.05, 0.125, z);
        routeTransform.rotation.set(0, direction * 0.42, 0);
        routeTransform.scale.set(2.2, 0.055, 0.22);
        routeTransform.updateMatrix();
        routeInstances.setMatrixAt(routeIndex, routeTransform.matrix);
        routeIndex += 1;
      }
    }
    routeInstances.instanceMatrix.needsUpdate = true;
    routeInstances.userData.instanceCount = routeIndex;
    routes.add(routeInstances);
    this.registerProp(routes, 'hub', 'navigation-markings');
    this.group.add(routes);

    const ceilingLights = new THREE.Group();
    ceilingLights.name = 'ceiling-light-spines';
    const ceilingMaterial = this.createSignalMaterial(0xff5a24, 0.72);
    const ceilingStrips = new THREE.InstancedMesh(
      new THREE.BoxGeometry(8, 0.16, 0.42),
      ceilingMaterial,
      12,
    );
    ceilingStrips.name = 'ceiling-strip-instances';
    const ceilingMatrix = new THREE.Matrix4();
    let ceilingIndex = 0;
    for (const x of [-18, 0, 18]) {
      for (const z of [-24, -8, 8, 24]) {
        ceilingMatrix.makeTranslation(x, 27.25, z);
        ceilingStrips.setMatrixAt(ceilingIndex, ceilingMatrix);
        ceilingIndex += 1;
      }
    }
    ceilingStrips.instanceMatrix.needsUpdate = true;
    ceilingStrips.userData.instanceCount = ceilingIndex;
    ceilingLights.add(ceilingStrips);
    this.registerProp(ceilingLights, 'hub', 'ceiling-lighting');
    this.group.add(ceilingLights);

    // Éclairage de lecture global : les signaux colorés gardent l'ambiance,
    // mais les volumes, le pont et les stations restent lisibles en jeu.
    const ambientFill = new THREE.HemisphereLight(0x78b7c4, 0x1b0705, 1.35);
    ambientFill.name = 'hub-ambient-fill-light';
    ambientFill.position.set(0, 32, 0);
    this.group.add(ambientFill);
    const readabilityLight = new THREE.AmbientLight(0x8aa0aa, 1.4);
    readabilityLight.name = 'hub-readability-ambient-light';
    this.group.add(readabilityLight);

    const shipLight = new THREE.PointLight(0xff351c, 4.6, 118, 1.35);
    shipLight.name = 'hub-warm-key-light';
    shipLight.position.set(0, 22, 0);
    this.group.add(shipLight);
    const fillLight = new THREE.PointLight(0x32d9ff, 3.1, 52, 1.3);
    fillLight.name = 'hangar-cool-fill-light';
    fillLight.position.set(-15, 10, 24);
    this.group.add(fillLight);
    const vaultFill = new THREE.PointLight(0xa66cff, 2.4, 48, 1.35);
    vaultFill.name = 'trophy-vault-fill-light';
    vaultFill.position.set(18, 9, -22);
    this.group.add(vaultFill);
  }

  createStructuralRibs() {
    const ribs = new THREE.Group();
    ribs.name = 'structural-hull-ribs';
    const ribMaterial = this.createAlloyMaterial(0x303842);
    const braceMaterial = this.createAlloyMaterial(0x4b2520);
    const slitMaterial = this.createSignalMaterial(0xff3218, 0.76);
    const pillars = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1.25, 34, 1.5),
      ribMaterial,
      26,
    );
    pillars.name = 'structural-pillar-instances';
    const braces = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1.1, 8, 1.15),
      braceMaterial,
      26,
    );
    braces.name = 'structural-brace-instances';
    const slits = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.16, 9, 0.38),
      slitMaterial,
      26,
    );
    slits.name = 'structural-slit-instances';
    const crowns = new THREE.InstancedMesh(
      new THREE.BoxGeometry(128, 1.1, 1.5),
      ribMaterial,
      13,
    );
    crowns.name = 'structural-crown-instances';

    const transform = new THREE.Object3D();
    let sideIndex = 0;
    let crownIndex = 0;
    for (const z of [-78, -65, -52, -39, -26, -13, 0, 13, 26, 39, 52, 65, 78]) {
      for (const side of [-1, 1]) {
        transform.position.set(side * 64.2, 17, z);
        transform.rotation.set(0, 0, 0);
        transform.scale.set(1, 1, 1);
        transform.updateMatrix();
        pillars.setMatrixAt(sideIndex, transform.matrix);

        transform.position.set(side * 61.4, 30.2, z);
        transform.rotation.set(0, 0, side * -0.72);
        transform.updateMatrix();
        braces.setMatrixAt(sideIndex, transform.matrix);

        transform.position.set(side * 63.5, 15, z - 0.8);
        transform.rotation.set(0, 0, 0);
        transform.updateMatrix();
        slits.setMatrixAt(sideIndex, transform.matrix);
        sideIndex += 1;
      }
      transform.position.set(0, 35.5, z);
      transform.rotation.set(0, 0, 0);
      transform.updateMatrix();
      crowns.setMatrixAt(crownIndex, transform.matrix);
      crownIndex += 1;
    }
    for (const batch of [pillars, braces, slits, crowns]) {
      batch.instanceMatrix.needsUpdate = true;
      batch.userData.instanceCount = batch.count;
      ribs.add(batch);
    }
    this.registerProp(ribs, 'hub', 'structural-ribs', { leavesCentralRouteClear: true });
    this.group.add(ribs);
  }

  createInstancedBatch(parent, name, geometry, material, transforms, zone, role, details = {}) {
    const batch = new THREE.InstancedMesh(geometry, material, transforms.length);
    batch.name = name;
    const transform = new THREE.Object3D();
    transforms.forEach((definition, index) => {
      const {
        position = [0, 0, 0],
        rotation = [0, 0, 0],
        scale = [1, 1, 1],
      } = definition;
      transform.position.fromArray(position);
      transform.rotation.set(...rotation);
      transform.scale.fromArray(scale);
      transform.updateMatrix();
      batch.setMatrixAt(index, transform.matrix);
    });
    batch.instanceMatrix.needsUpdate = true;
    batch.userData.instanceCount = transforms.length;
    this.registerProp(batch, zone, role, { instanceCount: transforms.length, ...details });
    parent.add(batch);
    return batch;
  }

  createCompartmentArchitecture() {
    const architecture = new THREE.Group();
    architecture.name = 'compartment-architecture';

    const bulkheadTransforms = BULKHEAD_SEGMENTS.map((segment) => ({
      position: [segment.x, 9, segment.z],
      scale: [segment.halfWidth * 2, 18, segment.halfDepth * 2],
    }));
    this.createInstancedBatch(
      architecture,
      'compartment-bulkhead-instances',
      new THREE.BoxGeometry(1, 1, 1),
      this.createAlloyMaterial(0x222c35),
      bulkheadTransforms,
      'hub',
      'compartment-bulkheads',
      { segmentCount: BULKHEAD_SEGMENTS.length, collisionMatched: true },
    );

    const armorTransforms = [];
    BULKHEAD_SEGMENTS.forEach((segment) => {
      const horizontal = segment.halfWidth > segment.halfDepth;
      const length = horizontal ? segment.halfWidth * 2 : segment.halfDepth * 2;
      const plateCount = Math.max(1, Math.ceil(length / 6));
      for (let index = 0; index < plateCount; index += 1) {
        const offset = (-length / 2) + ((index + 0.5) * (length / plateCount));
        armorTransforms.push({
          position: [
            segment.x + (horizontal ? offset : 0),
            9 + (((index % 3) - 1) * 4.7),
            segment.z + (horizontal ? 0 : offset),
          ],
          rotation: [0, horizontal ? 0 : Math.PI / 2, (index % 2 ? 1 : -1) * 0.08],
          scale: [Math.min(5.2, length / plateCount) * 0.82, 3.2, 0.2],
        });
      }
    });
    this.createInstancedBatch(
      architecture,
      'bulkhead-armor-scales',
      new THREE.DodecahedronGeometry(0.7, 0),
      this.createAlloyMaterial(0x3d4650),
      armorTransforms,
      'hub',
      'bulkhead-armor',
      { organicSilhouette: true },
    );

    const frameTransforms = [];
    const toothTransforms = [];
    PRESSURE_DOORS.forEach((door) => {
      const { x, z } = door.position;
      const tangentX = door.axis === 'x' ? 1 : 0;
      const tangentZ = door.axis === 'z' ? 1 : 0;
      for (const side of [-1, 1]) {
        frameTransforms.push({
          position: [x + (tangentX * side * door.width * 0.5), 3.2, z + (tangentZ * side * door.width * 0.5)],
          scale: [door.axis === 'x' ? 0.65 : 1.2, 6.4, door.axis === 'z' ? 0.65 : 1.2],
        });
      }
      frameTransforms.push({
        position: [x, 6.35, z],
        scale: [door.axis === 'x' ? door.width + 1.2 : 1.2, 0.7, door.axis === 'z' ? door.width + 1.2 : 1.2],
      });
      for (let toothIndex = 0; toothIndex < 4; toothIndex += 1) {
        const offset = (-0.375 + (toothIndex * 0.25)) * door.width;
        toothTransforms.push({
          position: [x + (tangentX * offset), 5.7, z + (tangentZ * offset)],
          rotation: [0, 0, toothIndex % 2 === 0 ? Math.PI : 0],
          scale: [0.7, 1.25, 0.7],
        });
      }
    });
    this.createInstancedBatch(
      architecture,
      'pressure-door-frame-instances',
      new THREE.BoxGeometry(1, 1, 1),
      this.createAlloyMaterial(0x59636b),
      frameTransforms,
      'hub',
      'pressure-door-network',
      { doorCount: PRESSURE_DOORS.length, allOpen: true },
    );
    this.createInstancedBatch(
      architecture,
      'pressure-door-teeth',
      new THREE.ConeGeometry(0.5, 1.5, 8),
      this.createSignalMaterial(0xff5a24, 0.72),
      toothTransforms,
      'hub',
      'door-status-glyphs',
      { doorCount: PRESSURE_DOORS.length },
    );

    const perforationTransforms = [];
    for (let z = -80; z <= 80; z += 4) {
      for (const x of [-6, -2, 2, 6]) {
        perforationTransforms.push({ position: [x, 0.17, z], rotation: [Math.PI / 2, 0, 0] });
      }
    }
    for (const z of [-45, 0, 45]) {
      for (let x = -60; x <= 60; x += 4) {
        if (Math.abs(x) > 7) perforationTransforms.push({ position: [x, 0.17, z], rotation: [Math.PI / 2, 0, 0] });
      }
    }
    this.createInstancedBatch(
      architecture,
      'perforated-deck-grille-instances',
      new THREE.TorusGeometry(0.58, 0.085, 8, 20),
      this.createAlloyMaterial(0x6a747a),
      perforationTransforms,
      'spine-corridor',
      'perforated-deck',
      { walkable: true, pattern: 'ring-grille' },
    );

    const archTransforms = [];
    for (let z = -78; z <= 78; z += 13) {
      archTransforms.push({ position: [0, 1, z], scale: [1, 0.54, 1] });
    }
    this.createInstancedBatch(
      architecture,
      'organic-hull-spines',
      new THREE.TorusGeometry(62, 0.85, 12, 96, Math.PI),
      this.createAlloyMaterial(0x35414a),
      archTransforms,
      'hub',
      'organic-hull-ribs',
      { flowingProfile: true },
    );

    const lightTransforms = [];
    for (let z = -80; z <= 80; z += 10) {
      for (const x of [-6.6, 6.6]) {
        lightTransforms.push({ position: [x, 5.2, z], scale: [0.22, 0.16, 5.5] });
      }
    }
    for (const z of [-45, 45]) {
      for (let x = -56; x <= 56; x += 8) {
        lightTransforms.push({ position: [x, 0.16, z], scale: [4.4, 0.08, 0.2] });
      }
    }
    this.createInstancedBatch(
      architecture,
      'corridor-biometric-light-instances',
      new THREE.BoxGeometry(1, 1, 1),
      this.createSignalMaterial(SIGNAL_COLORS.navigation, 0.68),
      lightTransforms,
      'spine-corridor',
      'corridor-lighting',
      { routeReadable: true },
    );

    const pipeTransforms = [];
    const couplerTransforms = [];
    for (const side of [-1, 1]) {
      for (const y of [5, 8, 11, 14]) {
        pipeTransforms.push({ position: [side * 62.5, y, 0], rotation: [Math.PI / 2, 0, 0], scale: [1, 166, 1] });
        for (let z = -72; z <= 72; z += 16) {
          couplerTransforms.push({ position: [side * 62.5, y, z] });
        }
      }
    }
    this.createInstancedBatch(
      architecture,
      'extended-utility-pipe-instances',
      new THREE.CylinderGeometry(0.24, 0.32, 1, 16),
      this.createAlloyMaterial(0x55626a),
      pipeTransforms,
      HUB_ZONES.UTILITIES,
      'extended-utility-network',
      { hullMounted: true },
    );
    this.createInstancedBatch(
      architecture,
      'extended-utility-couplers',
      new THREE.TorusGeometry(0.48, 0.1, 8, 18),
      this.createSignalMaterial(0xff4524, 0.62),
      couplerTransforms,
      HUB_ZONES.UTILITIES,
      'utility-couplers',
      { hullMounted: true },
    );

    const perchStemTransforms = PERCH_POINTS.map((perch) => ({
      position: [perch.x, perch.y * 0.5, perch.z],
      scale: [1, perch.y, 1],
    }));
    const perchPlatformTransforms = PERCH_POINTS.map((perch) => ({
      position: [perch.x, perch.y, perch.z],
      scale: [1, 0.3, 1],
    }));
    this.createInstancedBatch(
      architecture,
      'ritual-perch-stems',
      new THREE.CylinderGeometry(0.35, 0.6, 1, 12),
      this.createAlloyMaterial(0x444f57),
      perchStemTransforms,
      'hub',
      'perch-supports',
      { perchCount: PERCH_POINTS.length },
    );
    this.createInstancedBatch(
      architecture,
      'ritual-perch-platforms',
      new THREE.CylinderGeometry(1.45, 1.1, 1, 18),
      this.createAlloyMaterial(0x5a3b31),
      perchPlatformTransforms,
      'hub',
      'perch-network',
      { perchCount: PERCH_POINTS.length, traversalReady: true },
    );

    const lockerTransforms = [];
    for (const x of [43, 50, 57, 63]) {
      for (const z of [0, 8, 16, 24]) {
        lockerTransforms.push({
          position: [x, 3.1, z],
          rotation: [0, ((x + z) % 2 === 0 ? -1 : 1) * 0.04, 0],
          scale: [2.1, 6.2, 2.8],
        });
      }
    }
    this.createInstancedBatch(
      architecture,
      'armory-loadout-locker-instances',
      new THREE.DodecahedronGeometry(0.7, 0),
      this.createAlloyMaterial(0x4c555d),
      lockerTransforms,
      HUB_ZONES.FORGE,
      'loadout-lockers',
      { lockerCount: lockerTransforms.length, missionIssueOnly: true },
    );

    this.registerProp(architecture, 'hub', 'compartment-network', {
      zoneCount: SHIP_COMPARTMENTS.length,
      doorCount: PRESSURE_DOORS.length,
      corridorLayout: 'spine-and-crosslinks',
    });
    this.group.add(architecture);
  }

  createBridgeCockpit() {
    const bridge = this.registerCompartmentLandmark(
      'bridge-cockpit',
      new THREE.Group(),
      'Pont de commandement et cockpit stellaire',
    );

    const canopy = new THREE.Mesh(
      new THREE.SphereGeometry(27, 48, 18, 0, Math.PI * 2, 0, Math.PI * 0.5),
      new THREE.MeshStandardMaterial({
        color: 0x0c2028,
        emissive: 0x0b3540,
        emissiveIntensity: 0.38,
        roughness: 0.12,
        metalness: 0.72,
        transparent: true,
        opacity: 0.62,
        side: THREE.DoubleSide,
      }),
    );
    canopy.name = 'cockpit-forward-canopy';
    canopy.position.set(0, 1.2, -75);
    canopy.scale.set(1, 0.52, 0.55);
    this.registerProp(canopy, 'bridge-cockpit', 'armored-star-canopy', { panoramic: true });
    bridge.add(canopy);

    const throne = new THREE.Group();
    throne.name = 'bridge-pilot-throne';
    const throneBody = new THREE.Mesh(
      new THREE.CapsuleGeometry(2.1, 4.8, 10, 20),
      this.createAlloyMaterial(0x463a37),
    );
    throneBody.position.y = 3.4;
    throneBody.scale.set(1, 1, 0.58);
    throne.add(throneBody);
    const throneCrest = new THREE.Mesh(
      new THREE.ConeGeometry(2.8, 4.2, 9),
      this.createAlloyMaterial(0x687178),
    );
    throneCrest.position.set(0, 6.7, 0.8);
    throneCrest.rotation.x = -0.28;
    throne.add(throneCrest);
    throne.position.set(0, 0, -66);
    this.registerProp(throne, 'bridge-cockpit', 'pilot-throne', { commandSeat: true });
    bridge.add(throne);

    const consoleTransforms = [];
    const panelTransforms = [];
    for (let index = 0; index < 10; index += 1) {
      const angle = (-Math.PI * 0.72) + ((Math.PI * 1.44 * index) / 9);
      const x = Math.sin(angle) * 14;
      const z = -70 + (Math.cos(angle) * 8);
      consoleTransforms.push({
        position: [x, 1.25, z],
        rotation: [0, angle, 0],
        scale: [1.5, 2.5, 1.15],
      });
      panelTransforms.push({
        position: [x, 2.75, z - 0.2],
        rotation: [-0.38, angle, 0],
        scale: [2.25, 0.12, 1.25],
      });
    }
    this.createInstancedBatch(
      bridge,
      'cockpit-console-plinths',
      new THREE.CylinderGeometry(1, 1.25, 1, 12),
      this.createAlloyMaterial(0x29343c),
      consoleTransforms,
      'bridge-cockpit',
      'navigation-consoles',
      { consoleCount: 10 },
    );
    this.createInstancedBatch(
      bridge,
      'cockpit-holographic-panels',
      new THREE.BoxGeometry(1, 1, 1),
      this.createSignalMaterial(0x52eddd, 0.58),
      panelTransforms,
      'bridge-cockpit',
      'navigation-panels',
      { consoleCount: 10 },
    );

    const hologram = new THREE.Group();
    hologram.name = 'bridge-stellar-hologram';
    hologram.position.set(0, 6.5, -58.5);
    const starCore = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.7, 3),
      new THREE.MeshBasicMaterial({ color: 0x72f7e7, wireframe: true, transparent: true, opacity: 0.76 }),
    );
    hologram.add(starCore);
    const orbitTransforms = [
      { rotation: [Math.PI / 2, 0, 0], scale: [1, 1, 1] },
      { rotation: [Math.PI / 2.8, 0.25, 0], scale: [1.35, 1.35, 1.35] },
      { rotation: [Math.PI / 3.4, -0.4, 0], scale: [1.72, 1.72, 1.72] },
      { rotation: [Math.PI / 1.7, 0.65, 0], scale: [2.05, 2.05, 2.05] },
    ];
    this.createInstancedBatch(
      hologram,
      'stellar-orbit-rings',
      new THREE.TorusGeometry(3.2, 0.045, 6, 64),
      this.createSignalMaterial(0x78f4e3, 0.5),
      orbitTransforms,
      'bridge-cockpit',
      'stellar-navigation-hologram',
      { orbitCount: 4 },
    );
    this.registerProp(hologram, 'bridge-cockpit', 'cockpit-hologram', { interactive: true });
    bridge.add(hologram);
    this.animatedProps.push({ mesh: hologram, speed: 0.16, bob: true, baseY: hologram.position.y, phase: 0.7 });

    const bridgeLight = new THREE.PointLight(0x62e9db, 3.2, 42, 1.4);
    bridgeLight.name = 'bridge-navigation-light';
    bridgeLight.position.set(0, 10, -66);
    bridge.add(bridgeLight);
    this.group.add(bridge);
  }

  createCryostasisAndPodBay() {
    const cryo = this.registerCompartmentLandmark('cryo-gallery', new THREE.Group(), 'Galerie de cryostase');
    const cryoTransforms = [];
    const cryoWindowTransforms = [];
    const hatchTransforms = [];
    for (const x of [-59, -42]) {
      for (const z of [-35, -29, -23, -17, -11]) {
        cryoTransforms.push({ position: [x, 3.7, z], scale: [1, 1, 0.72] });
        cryoWindowTransforms.push({ position: [x + (x < -50 ? 0.78 : -0.78), 4, z], scale: [0.58, 0.78, 0.48] });
        hatchTransforms.push({
          position: [x + (x < -50 ? 1.15 : -1.15), 4, z],
          rotation: [0, Math.PI / 2, 0],
          scale: [1.05, 1.05, 1.05],
        });
      }
    }
    this.createInstancedBatch(
      cryo,
      'cryo-pod-shell-instances',
      new THREE.CapsuleGeometry(1.5, 4.4, 10, 18),
      this.createAlloyMaterial(0x3b4750),
      cryoTransforms,
      'cryo-gallery',
      'cryo-array',
      { podCount: cryoTransforms.length, occupied: 6, sealed: true },
    );
    this.createInstancedBatch(
      cryo,
      'cryo-pod-window-instances',
      new THREE.CapsuleGeometry(1.35, 3.8, 8, 16),
      this.createSignalMaterial(0x55c9df, 0.34),
      cryoWindowTransforms,
      'cryo-gallery',
      'cryo-windows',
      { frostLayer: true },
    );
    this.createInstancedBatch(
      cryo,
      'cryo-hatch-ring-instances',
      new THREE.TorusGeometry(1.5, 0.16, 8, 24),
      this.createSignalMaterial(0x74e5ef, 0.66),
      hatchTransforms,
      'cryo-gallery',
      'cryo-hatches',
      { hatchCount: hatchTransforms.length },
    );
    this.group.add(cryo);

    const podBay = this.registerCompartmentLandmark('escape-pod-bay', new THREE.Group(), 'Baie des pods d’évacuation');
    const podTransforms = [];
    const podRingTransforms = [];
    const clampTransforms = [];
    for (const x of [-59, -42]) {
      for (const z of [2, 10, 18, 26]) {
        podTransforms.push({ position: [x, 3.2, z], rotation: [Math.PI / 2, 0, 0], scale: [1, 1, 0.82] });
        for (const offsetY of [1.9, 4.5]) {
          podRingTransforms.push({ position: [x, offsetY, z], rotation: [Math.PI / 2, 0, 0] });
        }
        for (const side of [-1, 1]) {
          clampTransforms.push({
            position: [x + (side * 1.9), 2.7, z],
            rotation: [0, 0, side * -0.45],
            scale: [0.35, 3.2, 0.55],
          });
        }
      }
    }
    this.createInstancedBatch(
      podBay,
      'escape-pod-hull-instances',
      new THREE.CapsuleGeometry(1.55, 4.8, 10, 18),
      this.createAlloyMaterial(0x4a555d),
      podTransforms,
      'escape-pod-bay',
      'escape-pod-rack',
      { podCount: podTransforms.length, launchReady: true },
    );
    this.createInstancedBatch(
      podBay,
      'escape-pod-seal-rings',
      new THREE.TorusGeometry(1.55, 0.18, 8, 28),
      this.createSignalMaterial(0xff6a2d, 0.7),
      podRingTransforms,
      'escape-pod-bay',
      'pod-pressure-seals',
      { redundantSeals: 2 },
    );
    this.createInstancedBatch(
      podBay,
      'escape-pod-docking-clamps',
      new THREE.BoxGeometry(1, 1, 1),
      this.createAlloyMaterial(0x6c4b3b),
      clampTransforms,
      'escape-pod-bay',
      'pod-docking-clamps',
      { clampCount: clampTransforms.length },
    );
    this.group.add(podBay);
  }

  createCleanerMedbay() {
    const medbay = this.registerCompartmentLandmark('cleaner-medbay', new THREE.Group(), 'Medbay et laboratoire Cleaner');
    const surgeryTable = new THREE.Mesh(
      new THREE.CapsuleGeometry(1.8, 4.8, 10, 18),
      this.createAlloyMaterial(0x4b555c),
    );
    surgeryTable.name = 'cleaner-surgery-slab';
    surgeryTable.position.set(49, 2.1, -24);
    surgeryTable.rotation.z = Math.PI / 2;
    surgeryTable.scale.set(1, 1.4, 0.46);
    this.registerProp(surgeryTable, 'cleaner-medbay', 'cleaner-lab', { sterilizationReady: true });
    medbay.add(surgeryTable);

    const canisterTransforms = [];
    const fluidTransforms = [];
    for (const x of [41, 47, 53, 59]) {
      for (const z of [-36, -13]) {
        canisterTransforms.push({ position: [x, 3.2, z] });
        fluidTransforms.push({ position: [x, 3.2, z], scale: [0.72, 0.86, 0.72] });
      }
    }
    this.createInstancedBatch(
      medbay,
      'cleaner-containment-canisters',
      new THREE.CylinderGeometry(1.25, 1.5, 5.8, 20),
      this.createAlloyMaterial(0x44515a),
      canisterTransforms,
      'cleaner-medbay',
      'bio-containment',
      { canisterCount: canisterTransforms.length },
    );
    this.createInstancedBatch(
      medbay,
      'cleaner-neutralizer-fluid-cores',
      new THREE.CylinderGeometry(1.05, 1.05, 5.2, 20),
      this.createSignalMaterial(0x73f779, 0.32),
      fluidTransforms,
      'cleaner-medbay',
      'neutralizer-reservoirs',
      { sealed: true },
    );

    const armTransforms = [];
    for (let index = 0; index < 12; index += 1) {
      const side = index % 2 === 0 ? -1 : 1;
      armTransforms.push({
        position: [49 + (side * (3.2 + ((index % 3) * 0.55))), 5.2 + ((index % 3) * 0.45), -29 + (Math.floor(index / 4) * 4.8)],
        rotation: [side * 0.4, 0, side * 0.75],
        scale: [1, 3.5, 1],
      });
    }
    this.createInstancedBatch(
      medbay,
      'cleaner-surgical-arm-instances',
      new THREE.CylinderGeometry(0.18, 0.3, 1, 12),
      this.createAlloyMaterial(0x7a654e),
      armTransforms,
      'cleaner-medbay',
      'surgical-manipulators',
      { manipulatorCount: armTransforms.length },
    );

    const scanner = new THREE.Mesh(
      new THREE.TorusGeometry(4.4, 0.18, 10, 48),
      this.createSignalMaterial(0x66eead, 0.58),
    );
    scanner.name = 'cleaner-bioscan-ring';
    scanner.position.set(49, 4.5, -24);
    scanner.rotation.y = Math.PI / 2;
    this.registerProp(scanner, 'cleaner-medbay', 'bioscanner', { animated: true });
    medbay.add(scanner);
    this.animatedProps.push({ mesh: scanner, speed: 0.34 });

    const medbayLight = new THREE.PointLight(0x65ffa0, 2.5, 34, 1.5);
    medbayLight.name = 'cleaner-lab-light';
    medbayLight.position.set(50, 10, -24);
    medbay.add(medbayLight);
    this.group.add(medbay);
  }

  createEngineCoreAndAirlock() {
    const engine = this.registerCompartmentLandmark('engine-core', new THREE.Group(), 'Noyau énergétique et moteurs');
    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(4.2, 5.1, 14, 32, 4),
      this.createSignalMaterial(0xff542b, 0.54),
    );
    core.name = 'engine-reactor-core';
    core.position.set(43, 7.2, 60);
    this.registerProp(core, 'engine-core', 'engine-reactor', { outputState: 'nominal' });
    engine.add(core);

    const ringTransforms = [];
    for (let index = 0; index < 7; index += 1) {
      ringTransforms.push({
        position: [43, 2.3 + (index * 1.65), 60],
        rotation: [Math.PI / 2, 0, index * 0.16],
        scale: [1 + (index % 2) * 0.16, 1 + (index % 2) * 0.16, 1],
      });
    }
    this.createInstancedBatch(
      engine,
      'engine-reactor-ring-instances',
      new THREE.TorusGeometry(5.4, 0.24, 10, 56),
      this.createAlloyMaterial(0x8b624c),
      ringTransforms,
      'engine-core',
      'reactor-containment-rings',
      { ringCount: ringTransforms.length },
    );
    this.animatedProps.push({ mesh: core, speed: 0.09 });

    const rodTransforms = [];
    const vaneTransforms = [];
    for (let index = 0; index < 16; index += 1) {
      const angle = (index / 16) * Math.PI * 2;
      rodTransforms.push({
        position: [43 + (Math.cos(angle) * 8.2), 7, 60 + (Math.sin(angle) * 8.2)],
        scale: [1, 12, 1],
      });
      vaneTransforms.push({
        position: [43 + (Math.cos(angle) * 6.6), 7, 60 + (Math.sin(angle) * 6.6)],
        rotation: [0, -angle, 0],
        scale: [0.28, 9.5, 2.8],
      });
    }
    this.createInstancedBatch(
      engine,
      'engine-conduction-rods',
      new THREE.CylinderGeometry(0.22, 0.38, 1, 14),
      this.createSignalMaterial(0xff7841, 0.64),
      rodTransforms,
      'engine-core',
      'reactor-conduction-rods',
      { rodCount: rodTransforms.length },
    );
    this.createInstancedBatch(
      engine,
      'engine-heat-vane-instances',
      new THREE.BoxGeometry(1, 1, 1),
      this.createAlloyMaterial(0x39434b),
      vaneTransforms,
      'engine-core',
      'reactor-heat-vanes',
      { vaneCount: vaneTransforms.length },
    );

    const engineLight = new THREE.PointLight(0xff542b, 4.2, 46, 1.35);
    engineLight.name = 'engine-core-light';
    engineLight.position.set(43, 12, 60);
    engine.add(engineLight);
    this.group.add(engine);

    const airlock = this.registerCompartmentLandmark('rear-airlock', new THREE.Group(), 'Sas arrière pressurisé');
    const hatch = new THREE.Mesh(
      new THREE.TorusGeometry(8.2, 0.62, 14, 64),
      this.createAlloyMaterial(0x59636a),
    );
    hatch.name = 'rear-airlock-hatch';
    hatch.position.set(0, 8.5, 84.5);
    this.registerProp(hatch, 'rear-airlock', 'rear-airlock', { pressureState: 'sealed' });
    airlock.add(hatch);

    const petalTransforms = [];
    for (let index = 0; index < 16; index += 1) {
      const angle = (index / 16) * Math.PI * 2;
      petalTransforms.push({
        position: [Math.cos(angle) * 5.2, 8.5 + (Math.sin(angle) * 5.2), 84.2],
        rotation: [0, 0, angle + (Math.PI / 2)],
        scale: [0.75, 3.8, 0.35],
      });
    }
    this.createInstancedBatch(
      airlock,
      'rear-airlock-iris-petals',
      new THREE.BoxGeometry(1, 1, 1),
      this.createAlloyMaterial(0x343e46),
      petalTransforms,
      'rear-airlock',
      'airlock-iris',
      { petalCount: petalTransforms.length, state: 'sealed' },
    );

    const containment = new THREE.Mesh(
      new THREE.CylinderGeometry(7.2, 7.2, 0.16, 40),
      this.createSignalMaterial(0x6be9dc, 0.24),
    );
    containment.name = 'rear-airlock-containment-field';
    containment.position.set(0, 8.5, 83.9);
    containment.rotation.x = Math.PI / 2;
    this.registerProp(containment, 'rear-airlock', 'pressure-containment-field', { redundant: true });
    airlock.add(containment);
    this.group.add(airlock);
  }

  createTrophySilhouette(definition, material, index) {
    const geometryByType = {
      megafauna: () => new THREE.SphereGeometry(1.45, 10, 7),
      xenoQueen: () => new THREE.ConeGeometry(1.9, 3.1, 8),
      badBlood: () => new THREE.DodecahedronGeometry(1.65, 0),
      predalien: () => new THREE.IcosahedronGeometry(1.65, 1),
      superPredator: () => new THREE.DodecahedronGeometry(1.8, 0),
      feralPredator: () => new THREE.CylinderGeometry(1.25, 1.55, 2.7, 7),
      wolfCleaner: () => new THREE.CylinderGeometry(1.42, 1.2, 2.75, 8),
      kalisk: () => new THREE.OctahedronGeometry(1.8, 1),
      upgradePredator: () => new THREE.DodecahedronGeometry(1.95, 1),
    };
    const trophy = new THREE.Mesh(
      (geometryByType[definition.bossType] ?? (() => new THREE.IcosahedronGeometry(1.55, 1)))(),
      material,
    );
    trophy.name = `trophy-${definition.id}`;
    trophy.userData.huntId = definition.id;
    trophy.userData.silhouetteVariant = definition.bossType;

    const appendageCount = ['xenoQueen', 'kalisk'].includes(definition.bossType)
      ? 4
      : ['wolfCleaner', 'superPredator', 'upgradePredator'].includes(definition.bossType) ? 3 : 2;
    for (let part = 0; part < appendageCount; part += 1) {
      const appendage = new THREE.Mesh(
        new THREE.ConeGeometry(0.25, 1.15 + (((index + part) % 2) * 0.28), 6),
        material,
      );
      const spread = (part / Math.max(1, appendageCount - 1)) - 0.5;
      appendage.position.set(spread * 2.55, 1.15 - (Math.abs(spread) * 0.35), -0.12);
      appendage.rotation.z = -spread * 0.72;
      trophy.add(appendage);
    }
    if (['predalien', 'xenoQueen'].includes(definition.bossType)) {
      const crest = new THREE.Mesh(new THREE.ConeGeometry(0.85, 2.2, 6), material);
      crest.position.set(0, 0.35, -1.25);
      crest.rotation.x = Math.PI / 2;
      trophy.add(crest);
    }
    if (['megafauna', 'feralPredator'].includes(definition.bossType)) {
      for (const side of [-1, 1]) {
        const horn = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.8, 7), material);
        horn.position.set(side * 1.15, 0.75, 0);
        horn.rotation.z = side * -0.92;
        trophy.add(horn);
      }
    }
    if (definition.bossType === 'kalisk') trophy.scale.set(1.08, 0.84, 1.28);
    trophy.userData.baseDisplayScale = trophy.scale.toArray();
    return trophy;
  }

  createTrophyVaultWall() {
    const vault = this.registerLandmark(
      HUB_ZONES.VAULT,
      new THREE.Group(),
      'Mur des trophées et archives de chasse',
    );
    const wall = new THREE.Mesh(new THREE.BoxGeometry(62, 18, 2), this.createAlloyMaterial(0x202a35));
    wall.position.set(0, 11, -33);
    vault.add(wall);

    const canopy = new THREE.Mesh(new THREE.BoxGeometry(62, 1.1, 3.4), this.createAlloyMaterial(0x3b2830));
    canopy.position.set(0, 20.25, -32.25);
    vault.add(canopy);
    const vaultSignal = new THREE.Mesh(
      new THREE.BoxGeometry(55, 0.18, 0.22),
      this.createSignalMaterial(SIGNAL_COLORS.vault, 0.82),
    );
    vaultSignal.position.set(0, 19.55, -30.55);
    vault.add(vaultSignal);

    const definitions = Object.values(HUNT_DEFINITIONS);
    const spacing = 56 / Math.max(1, definitions.length - 1);
    const frameRailGeometry = new THREE.BoxGeometry(1, 1, 1);
    const vaultGlyphGeometry = new THREE.BoxGeometry(0.42, 0.12, 0.1);
    const staticTransform = new THREE.Object3D();
    definitions.forEach((definition, index) => {
      const x = (index - ((definitions.length - 1) / 2)) * spacing;
      const display = new THREE.Group();
      display.name = `vault-display-${definition.id}`;
      display.userData.huntId = definition.id;

      const plaque = new THREE.Mesh(new THREE.BoxGeometry(6.5, 7.4, 0.72), this.createAlloyMaterial(0x313b46));
      plaque.position.set(x, 13, -31.78);
      display.add(plaque);

      const frameMaterial = this.createSignalMaterial(index % 2 === 0 ? 0xff4a22 : 0x8b43ff, 0.74);
      const frameRails = new THREE.InstancedMesh(frameRailGeometry, frameMaterial, 4);
      frameRails.name = `vault-frame-rails-${definition.id}`;
      [-1, 1].forEach((side, railIndex) => {
        staticTransform.position.set(x + (side * 3.05), 13, -31.25);
        staticTransform.rotation.set(0, 0, 0);
        staticTransform.scale.set(0.13, 6.8, 0.16);
        staticTransform.updateMatrix();
        frameRails.setMatrixAt(railIndex, staticTransform.matrix);
      });
      [9.65, 16.35].forEach((y, railIndex) => {
        staticTransform.position.set(x, y, -31.25);
        staticTransform.rotation.set(0, 0, 0);
        staticTransform.scale.set(6.2, 0.13, 0.16);
        staticTransform.updateMatrix();
        frameRails.setMatrixAt(railIndex + 2, staticTransform.matrix);
      });
      frameRails.instanceMatrix.needsUpdate = true;
      display.add(frameRails);

      // Motif déterministe : lisible comme identifiant alien sans faux texte minuscule.
      const glyphCount = 2 + (index % 3);
      const glyphs = new THREE.InstancedMesh(vaultGlyphGeometry, frameMaterial, glyphCount);
      glyphs.name = `vault-glyphs-${definition.id}`;
      for (let glyphIndex = 0; glyphIndex < glyphCount; glyphIndex += 1) {
        staticTransform.position.set(x - 1 + (glyphIndex * 0.66), 10.25, -31.08);
        staticTransform.rotation.set(0, 0, 0);
        staticTransform.scale.set(1, 1, 1);
        staticTransform.updateMatrix();
        glyphs.setMatrixAt(glyphIndex, staticTransform.matrix);
      }
      glyphs.instanceMatrix.needsUpdate = true;
      display.add(glyphs);

      const material = new THREE.MeshStandardMaterial({
        color: definition.trophyColor ?? 0xddccaa,
        map: this.trophyTexture,
        emissive: 0x000000,
        roughness: 0.72,
        metalness: 0.05,
        transparent: true,
        opacity: 0.28,
        wireframe: true,
      });
      const trophy = this.createTrophySilhouette(definition, material, index);
      trophy.position.set(x, 13, -30.4);
      display.add(trophy);
      this.registerProp(trophy, HUB_ZONES.VAULT, 'hunt-trophy', { huntId: definition.id });
      this.trophyDisplays.set(definition.id, trophy);

      const uplight = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 1, 0.25, 8),
        this.createSignalMaterial(definition.trophyColor ?? 0xddccaa, 0.65),
      );
      uplight.position.set(x, 9.45, -30.75);
      display.add(uplight);
      vault.add(display);
    });
    this.registerProp(vault, HUB_ZONES.VAULT, 'trophy-gallery');
    this.group.add(vault);
  }

  createConsole(parent, position, rotationY, signalColor, id, zone) {
    const consoleGroup = new THREE.Group();
    consoleGroup.name = id;
    consoleGroup.position.copy(position);
    consoleGroup.rotation.y = rotationY;
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.5, 1.5), this.createAlloyMaterial(0x252e37));
    base.position.y = 0.75;
    consoleGroup.add(base);
    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(1.75, 0.12, 1.02),
      this.createSignalMaterial(signalColor, 0.82),
    );
    screen.position.set(0, 1.72, -0.08);
    screen.rotation.x = -0.48;
    consoleGroup.add(screen);
    const hood = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.18, 0.4), this.createAlloyMaterial(0x434b54));
    hood.position.set(0, 2.02, -0.42);
    consoleGroup.add(hood);
    for (let indicator = 0; indicator < 3; indicator += 1) {
      const pip = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.12), this.createSignalMaterial(signalColor));
      pip.position.set(-0.45 + (indicator * 0.45), 1.82, -0.58);
      pip.rotation.x = -0.48;
      consoleGroup.add(pip);
    }
    this.registerProp(consoleGroup, zone, 'interactive-console', { consoleId: id });
    parent.add(consoleGroup);
    return consoleGroup;
  }

  createMissionPedestals() {
    const missionNexus = this.registerLandmark(
      HUB_ZONES.MISSIONS,
      new THREE.Group(),
      'Nexus holographique des contrats',
    );
    const colors = [0xff3300, 0x00ff66, 0x00f0ff, 0xff0055, 0xff7a2e, 0xffc65a, 0x67e8f9, 0x9d5cff, 0xff8c58];
    const definitions = Object.values(HUNT_DEFINITIONS);
    const nexusDeck = new THREE.Mesh(new THREE.BoxGeometry(62, 0.28, 18), this.createAlloyMaterial(0x1f2933));
    nexusDeck.position.set(0, 0.18, -5);
    missionNexus.add(nexusDeck);
    const ringGeometry = new THREE.TorusGeometry(2.15, 0.08, 5, 24);
    const ringMatrixSource = new THREE.Object3D();

    definitions.forEach((definition, index) => {
      const { x, z } = getMissionStationPosition(index, definitions.length);
      const color = colors[index % colors.length];
      const station = new THREE.Group();
      station.name = `mission-station-${definition.id}`;
      station.position.set(x, 0, z);
      station.userData.huntId = definition.id;

      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(2.35, 2.8, 3.5, 8),
        this.createAlloyMaterial(0x27313c),
      );
      pedestal.position.y = 1.75;
      station.add(pedestal);

      const rings = new THREE.InstancedMesh(ringGeometry, this.createSignalMaterial(color, 0.78), 3);
      [3.55, 6.5, 10.2].forEach((y, ringIndex) => {
        ringMatrixSource.position.set(0, y, 0);
        ringMatrixSource.rotation.set(Math.PI / 2, 0, 0);
        ringMatrixSource.updateMatrix();
        rings.setMatrixAt(ringIndex, ringMatrixSource.matrix);
      });
      rings.instanceMatrix.needsUpdate = true;
      rings.name = `mission-rings-${definition.id}`;
      rings.userData.instanceCount = 3;
      station.add(rings);

      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(2.05, 2.05, 7.3, 16, 1, true),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.18,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      beam.position.y = 7.25;
      station.add(beam);

      const geometry = definition.bossType === 'superPredator'
        ? new THREE.DodecahedronGeometry(1.25, 0)
        : definition.bossType === 'kalisk'
          ? new THREE.OctahedronGeometry(1.45, 1)
          : new THREE.OctahedronGeometry(1.2);
      const hologram = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color, wireframe: true }));
      hologram.name = `hologram-${definition.id}`;
      hologram.position.y = 7.8;
      station.add(hologram);
      this.animatedProps.push({ mesh: hologram, speed: 1.5, huntId: definition.id });

      const control = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.16, 0.9), this.createSignalMaterial(color, 0.84));
      control.position.set(0, 2.25, 2.05);
      control.rotation.x = -0.38;
      station.add(control);
      this.registerProp(station, HUB_ZONES.MISSIONS, 'mission-pedestal', { huntId: definition.id });
      missionNexus.add(station);
    });
    this.registerProp(missionNexus, HUB_ZONES.MISSIONS, 'mission-gallery', { stationCount: definitions.length });
    this.group.add(missionNexus);
  }

  createCrate(parent, position, scale, id, zone, accentColor = SIGNAL_COLORS.navigation) {
    const crate = new THREE.Group();
    crate.name = id;
    crate.position.copy(position);
    crate.scale.setScalar(scale);
    const shell = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.8, 2), this.createAlloyMaterial(0x353d43));
    shell.position.y = 0.9;
    crate.add(shell);
    for (const x of [-1.08, 1.08]) {
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.02, 2.12), this.createAlloyMaterial(0x6b4a2d));
      strap.position.set(x, 0.92, 0);
      crate.add(strap);
    }
    const latch = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.3, 0.12),
      this.createSignalMaterial(accentColor, 0.76),
    );
    latch.position.set(0, 0.92, 1.04);
    crate.add(latch);
    this.registerProp(crate, zone, 'cargo-container', { containerId: id });
    parent.add(crate);
    return crate;
  }

  createWeaponRack(parent) {
    const rack = new THREE.Group();
    rack.name = 'forge-weapon-rack';
    rack.position.set(6.2, 0, -1.5);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.55, 6.5, 8.4), this.createAlloyMaterial(0x242b32));
    back.position.y = 3.4;
    rack.add(back);
    const weaponMaterial = this.createAlloyMaterial(0x69737a);
    for (const y of [0.6, 3.4, 6.2]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.18, 8), this.createAlloyMaterial(0x7a4b35));
      rail.position.set(-0.15, y, 0);
      rack.add(rail);
    }

    const combistick = new THREE.Group();
    combistick.name = 'rack-combistick';
    combistick.position.set(-0.55, 3.25, -2.8);
    combistick.add(new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 4.9, 8), weaponMaterial));
    for (const direction of [-1, 1]) {
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.9, 6), weaponMaterial);
      tip.position.y = direction * 2.85;
      tip.rotation.z = direction < 0 ? Math.PI : 0;
      combistick.add(tip);
    }
    rack.add(combistick);

    const disc = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.17, 6, 18), weaponMaterial);
    disc.name = 'rack-smart-disc';
    disc.position.set(-0.58, 4.5, -0.7);
    disc.rotation.y = Math.PI / 2;
    rack.add(disc);
    for (const side of [-1, 1]) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.72), weaponMaterial);
      blade.position.set(-0.58, 4.5, -0.7 + (side * 1.02));
      blade.rotation.x = side * 0.45;
      rack.add(blade);
    }

    const caster = new THREE.Group();
    caster.name = 'rack-plasma-caster';
    caster.position.set(-0.6, 2.3, 1.5);
    caster.add(new THREE.Mesh(new THREE.SphereGeometry(0.48, 8, 6), weaponMaterial));
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 1.5, 8), weaponMaterial);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.z = 0.72;
    caster.add(barrel);
    const lens = new THREE.Mesh(new THREE.SphereGeometry(0.2, 7, 5), this.createSignalMaterial(0x44e7ff));
    lens.position.z = 1.45;
    caster.add(lens);
    rack.add(caster);

    const wristBlades = new THREE.Group();
    wristBlades.name = 'rack-wrist-blades';
    wristBlades.position.set(-0.58, 3.1, 3.2);
    for (const offset of [-0.22, 0.22]) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.4, 0.16), weaponMaterial);
      blade.position.z = offset;
      blade.rotation.z = -0.12;
      wristBlades.add(blade);
    }
    rack.add(wristBlades);

    this.registerProp(rack, HUB_ZONES.FORGE, 'weapon-display', {
      weaponSilhouettes: ['combistick', 'smart-disc', 'plasma-caster', 'wrist-blades'],
    });
    parent.add(rack);
    return rack;
  }

  createArmoryForgeStation() {
    const forge = this.registerLandmark(
      HUB_ZONES.FORGE,
      new THREE.Group(),
      'Forge, maintenance et armurerie',
    );
    forge.position.set(22, 0, 18);
    const platform = new THREE.Mesh(new THREE.BoxGeometry(15, 0.5, 13), this.createAlloyMaterial(0x292d32));
    platform.position.y = 0.25;
    forge.add(platform);
    const station = new THREE.Mesh(new THREE.BoxGeometry(7.5, 3.3, 5), this.createAlloyMaterial(0x4a1914));
    station.position.set(-1, 1.9, 0);
    forge.add(station);

    const hearth = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 2, 1.2, 10),
      this.createSignalMaterial(SIGNAL_COLORS.forge, 0.88),
    );
    hearth.position.set(-1, 4, 0);
    forge.add(hearth);
    const containmentRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.25, 0.16, 7, 24),
      this.createAlloyMaterial(0x866046),
    );
    containmentRing.position.set(-1, 4.5, 0);
    containmentRing.rotation.x = Math.PI / 2;
    forge.add(containmentRing);

    const forgeLight = new THREE.PointLight(0xff8a18, 3, 15);
    forgeLight.name = 'forge-local-light';
    forgeLight.position.set(-1, 6.2, 0);
    forge.add(forgeLight);
    const anvil = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.25),
      new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true }),
    );
    anvil.name = 'molecular-forge-core';
    anvil.position.set(-1, 5.8, 0);
    forge.add(anvil);
    this.animatedProps.push({ mesh: anvil, speed: 1.15, huntId: 'forge' });

    for (const side of [-1, 1]) {
      const manipulator = new THREE.Group();
      manipulator.name = `forge-manipulator-${side < 0 ? 'aft' : 'fore'}`;
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 5.8, 8), this.createAlloyMaterial(0x4c555c));
      mast.position.y = 3.4;
      manipulator.add(mast);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 3.2), this.createAlloyMaterial(0x6b4a35));
      arm.position.set(0, 6.1, side * -1.4);
      manipulator.add(arm);
      const tool = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.35, 7), this.createSignalMaterial(0xff5a1e, 0.8));
      tool.position.set(0, 5.55, side * -2.8);
      tool.rotation.x = side * 0.45;
      manipulator.add(tool);
      manipulator.position.set(-4.1, 0, side * 1.7);
      forge.add(manipulator);
    }

    this.createWeaponRack(forge);
    this.createConsole(
      forge,
      new THREE.Vector3(2.9, 0.5, 4.4),
      Math.PI,
      SIGNAL_COLORS.forge,
      'forge-control-console',
      HUB_ZONES.FORGE,
    );
    this.createCrate(forge, new THREE.Vector3(4.5, 0.5, 3.5), 0.72, 'forge-alloy-crate', HUB_ZONES.FORGE, SIGNAL_COLORS.forge);
    this.createCrate(forge, new THREE.Vector3(6.1, 0.5, 4.2), 0.55, 'forge-component-crate', HUB_ZONES.FORGE, 0x55ddff);

    const duct = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.6, 5.2, 8), this.createAlloyMaterial(0x323b43));
    duct.position.set(-1, 10.2, 0);
    forge.add(duct);
    const ventGlow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.76, 0.76, 0.18, 12),
      this.createSignalMaterial(0xff4b18, 0.62),
    );
    ventGlow.position.set(-1, 7.55, 0);
    forge.add(ventGlow);

    this.registerProp(forge, HUB_ZONES.FORGE, 'forge-workcell', { keepsMainAisleClear: true });
    this.group.add(forge);
  }

  createVehicleHangar() {
    const hangar = this.registerLandmark(
      HUB_ZONES.HANGAR,
      new THREE.Group(),
      'Hangar des véhicules de chasse',
    );
    hangar.position.set(-21, 0, 20);
    const deck = new THREE.Mesh(new THREE.BoxGeometry(24, 1, 13), this.createAlloyMaterial(0x202a35));
    deck.position.y = 0.5;
    hangar.add(deck);

    const energyMat = new THREE.MeshStandardMaterial({
      color: 0x39464d,
      map: this.energyTexture,
      emissive: 0x073e4a,
      emissiveIntensity: 0.8,
      metalness: 0.86,
      roughness: 0.32,
    });
    const hullMat = this.createAlloyMaterial(0x303840);
    const canopyMat = this.createSignalMaterial(0x1aa7c5, 0.72);

    for (const padX of [-5, 4]) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(3.1, 0.1, 6, 28),
        this.createSignalMaterial(SIGNAL_COLORS.hangar, 0.72),
      );
      ring.position.set(padX, 1.06, 0);
      ring.rotation.x = Math.PI / 2;
      hangar.add(ring);
    }

    const buildCraft = (x, z, scale, kind) => {
      const craft = new THREE.Group();
      craft.name = `hangar-${kind}`;
      const hullGeometry = kind === 'pod'
        ? new THREE.CapsuleGeometry(1.1, 2.2, 6, 12)
        : kind === 'shuttle'
          ? new THREE.CapsuleGeometry(1.35, 3.8, 7, 12)
          : new THREE.ConeGeometry(2.2, 6.2, 5);
      const hull = new THREE.Mesh(hullGeometry, hullMat);
      hull.rotation.x = kind === 'scout' ? -Math.PI / 2 : Math.PI / 2;
      craft.add(hull);

      if (kind !== 'pod') {
        const wing = new THREE.Mesh(
          new THREE.BoxGeometry(kind === 'shuttle' ? 5.8 : 7.2, 0.2, kind === 'shuttle' ? 2 : 1.5),
          hullMat,
        );
        wing.position.z = -0.3;
        craft.add(wing);
        for (const side of [-1, 1]) {
          const fin = new THREE.Mesh(new THREE.ConeGeometry(0.58, 2.1, 4), hullMat);
          fin.position.set(side * (kind === 'shuttle' ? 2.4 : 3.15), 0.55, -0.35);
          fin.rotation.z = side * -0.58;
          craft.add(fin);
        }
      }
      const canopy = new THREE.Mesh(new THREE.SphereGeometry(kind === 'pod' ? 0.5 : 0.72, 9, 6), canopyMat);
      canopy.scale.set(1, 0.55, 1.35);
      canopy.position.set(0, 0.48, kind === 'pod' ? 0.2 : 1.2);
      craft.add(canopy);
      for (const engineX of [-1, 1]) {
        const engine = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.52, 1.2, 10), energyMat);
        engine.rotation.x = Math.PI / 2;
        engine.position.set(engineX * (kind === 'pod' ? 0.55 : 1.55), 0, -2.5);
        craft.add(engine);
      }

      craft.position.set(x, 3.4, z);
      craft.scale.setScalar(scale);
      this.registerProp(craft, HUB_ZONES.HANGAR, 'vehicle-display', { vehicleKind: kind });
      hangar.add(craft);
      this.vehicleDisplays.push(craft);
      this.animatedProps.push({
        mesh: craft,
        speed: kind === 'pod' ? 0.22 : 0.12,
        bob: true,
        baseY: craft.position.y,
        phase: Math.abs(x) * 0.17,
      });
    };

    buildCraft(-5, 0, 0.72, 'scout');
    buildCraft(4, 0, 0.58, 'shuttle');
    buildCraft(0, 6, 0.65, 'pod');

    const gantry = new THREE.Mesh(new THREE.BoxGeometry(21, 0.45, 0.65), this.createAlloyMaterial(0x59636b));
    gantry.position.set(0, 8.6, -4.8);
    hangar.add(gantry);
    for (const x of [-9.2, 9.2]) {
      const support = new THREE.Mesh(new THREE.BoxGeometry(0.5, 8, 0.5), this.createAlloyMaterial(0x59636b));
      support.position.set(x, 4.6, -4.8);
      hangar.add(support);
    }
    this.createConsole(
      hangar,
      new THREE.Vector3(-9.5, 1, 4.2),
      Math.PI,
      SIGNAL_COLORS.hangar,
      'hangar-traffic-console',
      HUB_ZONES.HANGAR,
    );
    this.createCrate(hangar, new THREE.Vector3(8.8, 1, 4.4), 0.62, 'hangar-hunt-supply-crate', HUB_ZONES.HANGAR, SIGNAL_COLORS.hangar);
    this.createCrate(hangar, new THREE.Vector3(10.1, 1, 5), 0.46, 'hangar-fuel-cell-crate', HUB_ZONES.HANGAR, 0x8b43ff);
    this.registerProp(hangar, HUB_ZONES.HANGAR, 'vehicle-bay', { vehicleCount: 3 });
    this.group.add(hangar);
  }

  createHangarExpansion() {
    const expansion = new THREE.Group();
    expansion.name = 'grand-hangar-extension';

    const padTransforms = [];
    for (const craft of HANGAR_EXTENSION_CRAFT) {
      padTransforms.push({
        position: [craft.x, 0.22, craft.z],
        rotation: [Math.PI / 2, 0, 0],
        scale: [craft.radius / 4, craft.radius / 4, 1],
      });
      padTransforms.push({
        position: [craft.x, 0.25, craft.z],
        rotation: [Math.PI / 2, 0, 0],
        scale: [(craft.radius + 1.1) / 4, (craft.radius + 1.1) / 4, 1],
      });
    }
    this.createInstancedBatch(
      expansion,
      'grand-hangar-docking-rings',
      new THREE.TorusGeometry(4, 0.13, 8, 40),
      this.createSignalMaterial(SIGNAL_COLORS.hangar, 0.66),
      padTransforms,
      HUB_ZONES.HANGAR,
      'expanded-hangar',
      { dockingPads: HANGAR_EXTENSION_CRAFT.length },
    );

    const hullTransforms = HANGAR_EXTENSION_CRAFT.map((craft, index) => ({
      position: [craft.x, 3.7 + (index * 0.2), craft.z],
      rotation: [Math.PI / 2, 0, index === 1 ? 0.12 : -0.08],
      scale: [1.65 + (index * 0.12), 2.4 + (index * 0.35), 1.15],
    }));
    this.createInstancedBatch(
      expansion,
      'hangar-parked-hunt-craft',
      new THREE.CapsuleGeometry(1.4, 4.6, 10, 20),
      this.createAlloyMaterial(0x303b43),
      hullTransforms,
      HUB_ZONES.HANGAR,
      'parked-hunt-craft',
      { craftIds: HANGAR_EXTENSION_CRAFT.map(({ id }) => id) },
    );

    const structureTransforms = [];
    HANGAR_EXTENSION_CRAFT.forEach((craft, index) => {
      for (const side of [-1, 1]) {
        structureTransforms.push({
          position: [craft.x + (side * (3.8 + index)), 3.3, craft.z],
          rotation: [0, index === 1 ? 0.12 : -0.08, side * -0.18],
          scale: [4.8 + index, 0.28, 2.1],
        });
      }
    });
    for (const x of [-62, -16]) {
      structureTransforms.push({ position: [x, 8, 60], scale: [0.65, 15.5, 0.65] });
    }
    structureTransforms.push({ position: [-39, 15.5, 60], scale: [46, 0.7, 0.8] });
    this.createInstancedBatch(
      expansion,
      'grand-hangar-gantry-and-wings',
      new THREE.BoxGeometry(1, 1, 1),
      this.createAlloyMaterial(0x5b666d),
      structureTransforms,
      HUB_ZONES.HANGAR,
      'hangar-docking-frames',
      { gantryClearance: 14.8 },
    );

    this.group.add(expansion);
  }

  createUtilityNetwork() {
    const utilities = new THREE.Group();
    utilities.name = 'utility-pipes-and-ducts';
    const pipeMaterial = this.createAlloyMaterial(0x46545d);
    const hotPipeMaterial = this.createAlloyMaterial(0x6d3229);
    const couplerMaterial = this.createSignalMaterial(0xff3b1d, 0.68);
    const hotPipes = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.4, 0.4, 57, 10),
      hotPipeMaterial,
      2,
    );
    hotPipes.name = 'utility-hot-pipe-instances';
    const coolPipes = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.28, 0.28, 57, 10),
      pipeMaterial,
      2,
    );
    coolPipes.name = 'utility-cool-pipe-instances';
    const couplers = new THREE.InstancedMesh(
      new THREE.TorusGeometry(0.58, 0.11, 6, 12),
      couplerMaterial,
      14,
    );
    couplers.name = 'utility-coupler-instances';
    const ducts = new THREE.InstancedMesh(
      new THREE.BoxGeometry(3.2, 1.2, 58),
      this.createAlloyMaterial(0x28343c),
      2,
    );
    ducts.name = 'utility-duct-instances';
    const vents = new THREE.InstancedMesh(
      new THREE.BoxGeometry(2.4, 0.18, 2.6),
      this.createAlloyMaterial(0x58636a),
      10,
    );
    vents.name = 'utility-vent-instances';

    // Les conduites restent plaquées aux murs pour préserver l'axe jouable x = 0.
    const transform = new THREE.Object3D();
    let wallIndex = 0;
    let couplerIndex = 0;
    let ventIndex = 0;
    for (const side of [-1, 1]) {
      transform.position.set(side * 31, 5.2, 0);
      transform.rotation.set(Math.PI / 2, 0, 0);
      transform.scale.set(1, 1, 1);
      transform.updateMatrix();
      hotPipes.setMatrixAt(wallIndex, transform.matrix);

      transform.position.set(side * 31, 8.1, 0);
      transform.updateMatrix();
      coolPipes.setMatrixAt(wallIndex, transform.matrix);
      wallIndex += 1;

      for (const z of [-27, -18, -9, 0, 9, 18, 27]) {
        transform.position.set(side * 31, 5.2, z);
        transform.rotation.set(0, Math.PI / 2, 0);
        transform.updateMatrix();
        couplers.setMatrixAt(couplerIndex, transform.matrix);
        couplerIndex += 1;
      }
    }
    let ductIndex = 0;
    for (const x of [-18, 18]) {
      transform.position.set(x, 25.8, 0);
      transform.rotation.set(0, 0, 0);
      transform.updateMatrix();
      ducts.setMatrixAt(ductIndex, transform.matrix);
      ductIndex += 1;
      for (const z of [-24, -12, 0, 12, 24]) {
        transform.position.set(x, 25.1, z);
        transform.updateMatrix();
        vents.setMatrixAt(ventIndex, transform.matrix);
        ventIndex += 1;
      }
    }
    for (const batch of [hotPipes, coolPipes, couplers, ducts, vents]) {
      batch.instanceMatrix.needsUpdate = true;
      batch.userData.instanceCount = batch.count;
      utilities.add(batch);
    }
    this.registerProp(utilities, HUB_ZONES.UTILITIES, 'utility-network', { wallMounted: true });
    this.group.add(utilities);
  }

  createNavigationBeacons() {
    const beaconGroup = new THREE.Group();
    beaconGroup.name = 'spatial-navigation-beacons';
    const definitions = [
      { id: 'beacon-hangar', position: [-30, 0, 8], color: SIGNAL_COLORS.hangar, pointsTo: HUB_ZONES.HANGAR },
      { id: 'beacon-forge', position: [30, 0, 8], color: SIGNAL_COLORS.forge, pointsTo: HUB_ZONES.FORGE },
      { id: 'beacon-vault-port', position: [-29, 0, -23], color: SIGNAL_COLORS.vault, pointsTo: HUB_ZONES.VAULT },
      { id: 'beacon-vault-starboard', position: [29, 0, -23], color: SIGNAL_COLORS.vault, pointsTo: HUB_ZONES.VAULT },
    ];
    definitions.forEach(({ id, position, color, pointsTo }, index) => {
      const beacon = new THREE.Group();
      beacon.name = id;
      beacon.position.fromArray(position);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.9, 1.2, 8), this.createAlloyMaterial(0x3f4850));
      base.position.y = 0.6;
      beacon.add(base);
      const core = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.24, 4.3, 8),
        this.createSignalMaterial(color, 0.82),
      );
      core.position.y = 3.25;
      beacon.add(core);
      const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.56, 1.4, 5), this.createSignalMaterial(color, 0.86));
      arrow.position.y = 5.9;
      arrow.rotation.z = index % 2 === 0 ? Math.PI / 2 : -Math.PI / 2;
      beacon.add(arrow);
      this.registerProp(beacon, 'hub', 'navigation-beacon', { pointsTo });
      beaconGroup.add(beacon);
    });
    this.group.add(beaconGroup);
  }

  createGameplayLayout() {
    this.bounds = Object.freeze({
      minX: -66.5,
      maxX: 66.5,
      minZ: -86.5,
      maxZ: 86.5,
    });

    const colliders = [];
    const definitions = Object.values(HUNT_DEFINITIONS);
    definitions.forEach((definition, index) => {
      const { x, z } = getMissionStationPosition(index, definitions.length);
      colliders.push({
        id: 'mission-pedestal-' + definition.id,
        type: 'circle',
        x,
        z,
        radius: 2.8,
      });
    });

    colliders.push(
      { id: 'trophy-vault-wall', type: 'box', x: 0, z: -32.4, halfWidth: 31, halfDepth: 1.2 },
      { id: 'forge-core', type: 'circle', x: 21, z: 18, radius: 3.4 },
      { id: 'forge-weapon-rack', type: 'box', x: 28.2, z: 16.5, halfWidth: 1.1, halfDepth: 4.4 },
      { id: 'forge-manipulator-aft', type: 'circle', x: 17.9, z: 16.3, radius: 0.9 },
      { id: 'forge-manipulator-fore', type: 'circle', x: 17.9, z: 19.7, radius: 0.9 },
      { id: 'forge-alloy-crate', type: 'circle', x: 26.5, z: 21.5, radius: 1.2 },
      { id: 'forge-component-crate', type: 'circle', x: 28.1, z: 22.2, radius: 0.9 },
      { id: 'hangar-scout', type: 'circle', x: -26, z: 20, radius: 3.2 },
      { id: 'hangar-shuttle', type: 'circle', x: -17, z: 20, radius: 3.2 },
      { id: 'hangar-pod', type: 'circle', x: -21, z: 26, radius: 2.4 },
      { id: 'hangar-gantry-port', type: 'circle', x: -30.2, z: 15.2, radius: 0.8 },
      { id: 'hangar-gantry-starboard', type: 'circle', x: -11.8, z: 15.2, radius: 0.8 },
      { id: 'hangar-traffic-console', type: 'circle', x: -30.5, z: 24.2, radius: 1.4 },
      { id: 'hangar-supply-crate', type: 'circle', x: -12.2, z: 24.4, radius: 1.2 },
      { id: 'hangar-fuel-crate', type: 'circle', x: -10.9, z: 25, radius: 0.9 },
      { id: 'beacon-hangar', type: 'circle', x: -30, z: 8, radius: 0.9 },
      { id: 'beacon-forge', type: 'circle', x: 30, z: 8, radius: 0.9 },
      { id: 'beacon-vault-port', type: 'circle', x: -29, z: -23, radius: 0.9 },
      { id: 'beacon-vault-starboard', type: 'circle', x: 29, z: -23, radius: 0.9 },
    );

    BULKHEAD_SEGMENTS.forEach((collider) => colliders.push(collider));
    PERCH_POINTS.forEach((perch) => colliders.push({
      id: `${perch.id}-support`,
      type: 'circle',
      x: perch.x,
      z: perch.z,
      radius: 0.72,
    }));

    colliders.push(
      { id: 'bridge-pilot-throne', type: 'circle', x: 0, z: -66, radius: 2.5 },
      { id: 'cleaner-surgery-slab', type: 'box', x: 49, z: -24, halfWidth: 4.2, halfDepth: 1.8 },
      { id: 'engine-reactor-core', type: 'circle', x: 43, z: 60, radius: 5.4 },
      { id: 'rear-airlock-hatch', type: 'box', x: 0, z: 84.5, halfWidth: 8.8, halfDepth: 0.75 },
    );
    for (const x of [-59, -42]) {
      for (const z of [-35, -29, -23, -17, -11]) {
        colliders.push({ id: `cryo-pod-${x}-${z}`, type: 'circle', x, z, radius: 1.65 });
      }
      for (const z of [2, 10, 18, 26]) {
        colliders.push({ id: `escape-pod-${x}-${z}`, type: 'circle', x, z, radius: 1.75 });
      }
    }
    for (const x of [41, 47, 53, 59]) {
      for (const z of [-36, -13]) {
        colliders.push({ id: `cleaner-canister-${x}-${z}`, type: 'circle', x, z, radius: 1.35 });
      }
    }
    HANGAR_EXTENSION_CRAFT.forEach((craft) => colliders.push({
      id: craft.id,
      type: 'circle',
      x: craft.x,
      z: craft.z,
      radius: craft.radius,
    }));
    colliders.push({ id: 'armory-loadout-lockers', type: 'box', x: 62.2, z: 14, halfWidth: 2.2, halfDepth: 16 });
    this.colliders = Object.freeze(colliders.map((collider) => Object.freeze(collider)));

    this.stations = Object.freeze([
      Object.freeze({
        id: HUB_ZONES.MISSIONS,
        interactionType: 'contracts',
        label: 'Nexus des contrats',
        prompt: 'OUVRIR LES CONTRATS DU NEXUS [E]',
        position: new THREE.Vector3(0, 0, -5),
        interactionRadius: 4.6,
      }),
      Object.freeze({
        id: HUB_ZONES.FORGE,
        interactionType: 'forge',
        label: 'Forge et armurerie',
        prompt: 'ACCÉDER À LA FORGE ET À L’ARMURERIE [E]',
        position: new THREE.Vector3(13, 0, 18),
        interactionRadius: 4.8,
      }),
      Object.freeze({
        id: HUB_ZONES.VAULT,
        interactionType: 'trophies',
        label: 'Galerie des trophées',
        prompt: 'CONSULTER LA GALERIE DES TROPHÉES [E]',
        position: new THREE.Vector3(0, 0, -27),
        interactionRadius: 4.5,
      }),
      Object.freeze({
        id: HUB_ZONES.HANGAR,
        interactionType: 'hangar',
        label: 'Hangar des véhicules',
        prompt: 'INSPECTER LE HANGAR DE CHASSE [E]',
        position: new THREE.Vector3(-8.5, 0, 20),
        interactionRadius: 5,
      }),
    ]);

    this.compartmentStations = Object.freeze([
      Object.freeze({
        id: 'bridge-navigation',
        zoneId: 'bridge-cockpit',
        interactionType: 'navigation',
        label: 'Navigation stellaire',
        prompt: 'CONSULTER LA NAVIGATION STELLAIRE [E]',
        position: new THREE.Vector3(0, 0, -58.5),
        interactionRadius: 5.4,
      }),
      Object.freeze({
        id: 'cryo-control',
        zoneId: 'cryo-gallery',
        interactionType: 'cryo',
        label: 'Contrôle de la cryostase',
        prompt: 'INSPECTER LES CHASSEURS EN CRYOSTASE [E]',
        position: new THREE.Vector3(-50.5, 0, -23),
        interactionRadius: 6,
      }),
      Object.freeze({
        id: 'escape-pod-control',
        zoneId: 'escape-pod-bay',
        interactionType: 'escape_pods',
        label: 'Contrôle des pods de traque',
        prompt: 'INSPECTER LES PODS DE TRAQUE [E]',
        position: new THREE.Vector3(-50.5, 0, 14),
        interactionRadius: 6,
      }),
      Object.freeze({
        id: 'cleaner-lab-control',
        zoneId: 'cleaner-medbay',
        interactionType: 'cleaner_lab',
        label: 'Laboratoire Cleaner',
        prompt: 'CONSULTER LE LABORATOIRE CLEANER [E]',
        position: new THREE.Vector3(49, 0, -18),
        interactionRadius: 5.8,
      }),
      Object.freeze({
        id: 'engine-core-control',
        zoneId: 'engine-core',
        interactionType: 'core',
        label: 'Noyau énergétique',
        prompt: 'DIAGNOSTIQUER LE NOYAU ÉNERGÉTIQUE [E]',
        position: new THREE.Vector3(33, 0, 60),
        interactionRadius: 6.5,
      }),
      Object.freeze({
        id: 'rear-airlock-control',
        zoneId: 'rear-airlock',
        interactionType: 'airlock',
        label: 'Sas arrière',
        prompt: 'INSPECTER LE SAS ARRIÈRE [E]',
        position: new THREE.Vector3(5.5, 0, 73),
        interactionRadius: 5.2,
      }),
    ]);
    this.allStations = Object.freeze([...this.stations, ...this.compartmentStations]);
  }

  constrainPlayer(position, playerRadius = 1.8) {
    if (!position?.isVector3 || this.disposed) return position;
    const radius = Math.max(0, Number(playerRadius) || 0);
    const clampToBounds = () => {
      position.x = THREE.MathUtils.clamp(
        position.x,
        this.bounds.minX + radius,
        this.bounds.maxX - radius,
      );
      position.z = THREE.MathUtils.clamp(
        position.z,
        this.bounds.minZ + radius,
        this.bounds.maxZ - radius,
      );
    };

    clampToBounds();
    for (let iteration = 0; iteration < 4; iteration += 1) {
      let resolvedCollision = false;
      for (const collider of this.colliders) {
        if (collider.type === 'box') {
          const expandedX = collider.halfWidth + radius;
          const expandedZ = collider.halfDepth + radius;
          const offsetX = position.x - collider.x;
          const offsetZ = position.z - collider.z;
          if (Math.abs(offsetX) >= expandedX || Math.abs(offsetZ) >= expandedZ) continue;

          const pushX = expandedX - Math.abs(offsetX);
          const pushZ = expandedZ - Math.abs(offsetZ);
          if (pushX <= pushZ) {
            position.x = collider.x + (offsetX < 0 ? -expandedX : expandedX);
          } else {
            position.z = collider.z + (offsetZ < 0 ? -expandedZ : expandedZ);
          }
          resolvedCollision = true;
          continue;
        }

        const dx = position.x - collider.x;
        const dz = position.z - collider.z;
        const minDistance = collider.radius + radius;
        const distanceSquared = (dx * dx) + (dz * dz);
        if (distanceSquared >= minDistance * minDistance) continue;
        const distance = Math.sqrt(distanceSquared);
        const normalX = distance > 0.0001 ? dx / distance : 1;
        const normalZ = distance > 0.0001 ? dz / distance : 0;
        position.x = collider.x + (normalX * minDistance);
        position.z = collider.z + (normalZ * minDistance);
        resolvedCollision = true;
      }
      clampToBounds();
      if (!resolvedCollision) break;
    }
    position.y = 0;
    return position;
  }

  getNearbyStation(position, maxDistance = Infinity) {
    if (!position?.isVector3 || this.disposed) return null;
    const requestedLimit = Number.isFinite(maxDistance) ? Math.max(0, maxDistance) : Infinity;
    let nearest = null;
    let nearestDistance = Infinity;
    for (const station of this.allStations) {
      const distance = Math.hypot(
        position.x - station.position.x,
        position.z - station.position.z,
      );
      const interactionLimit = Math.min(station.interactionRadius, requestedLimit);
      if (distance > interactionLimit || distance >= nearestDistance) continue;
      nearest = station;
      nearestDistance = distance;
    }
    return nearest;
  }

  getStations() {
    return this.allStations;
  }

  getBounds() {
    return this.bounds;
  }

  getColliders() {
    return this.colliders;
  }

  getZones() {
    return this.zones;
  }

  getDoors() {
    return this.doors;
  }

  getPerches() {
    return this.perches;
  }

  getZoneAt(position) {
    if (!position?.isVector3 || this.disposed) return null;
    return this.zones.find(({ bounds }) => (
      position.x >= bounds.minX
      && position.x <= bounds.maxX
      && position.z >= bounds.minZ
      && position.z <= bounds.maxZ
    )) ?? null;
  }

  getPerformanceSnapshot() {
    let meshCount = 0;
    let drawCallEstimate = 0;
    let triangleEstimate = 0;
    const geometries = new Set();
    const materials = new Set();

    this.group.traverse((object) => {
      if (!object.isMesh) return;
      meshCount += 1;

      if (object.geometry) {
        geometries.add(object.geometry);
        const baseTriangleCount = object.geometry.index
          ? object.geometry.index.count / 3
          : (object.geometry.attributes.position?.count ?? 0) / 3;
        triangleEstimate += baseTriangleCount * (object.isInstancedMesh ? object.count : 1);
      }

      const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
      const activeMaterials = objectMaterials.filter(Boolean);
      drawCallEstimate += activeMaterials.length;
      activeMaterials.forEach((material) => materials.add(material));
    });

    return Object.freeze({
      meshCount,
      drawCallEstimate,
      triangleEstimate: Math.ceil(triangleEstimate),
      uniqueGeometryCount: geometries.size,
      uniqueMaterialCount: materials.size,
    });
  }

  setTrophyState(completedHunts = []) {
    const completed = new Set(completedHunts);
    this.trophyDisplays.forEach((mesh, huntId) => {
      const unlocked = completed.has(huntId);
      mesh.material.opacity = unlocked ? 1 : 0.28;
      mesh.material.wireframe = !unlocked;
      mesh.material.emissive.setHex(unlocked ? 0x2a1100 : 0x000000);
      const factor = unlocked ? 1 : 0.78;
      const [baseX, baseY, baseZ] = mesh.userData.baseDisplayScale ?? [1, 1, 1];
      mesh.scale.set(baseX * factor, baseY * factor, baseZ * factor);
      mesh.userData.unlocked = unlocked;
    });
  }

  setVisible(visible) {
    this.group.visible = visible;
  }

  update(delta, reducedMotion = false) {
    if (this.disposed || !this.group.visible || reducedMotion) return;
    this.animationTime += delta;
    this.animatedProps.forEach(({ mesh, speed, bob, baseY = mesh.position.y, phase = 0 }) => {
      mesh.rotation.y += delta * speed;
      if (bob) {
        mesh.position.y = baseY + Math.sin((this.animationTime * 1.5) + phase) * 0.08;
      }
    });
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.group.parent?.remove(this.group);

    const geometries = new Set();
    const materials = new Set();
    const textures = new Set([this.alloyTexture, this.trophyTexture, this.energyTexture].filter(Boolean));
    this.group.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
      objectMaterials.filter(Boolean).forEach((material) => materials.add(material));
    });
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value?.isTexture) textures.add(value);
      });
      material.dispose();
    });
    geometries.forEach((geometry) => geometry.dispose());
    textures.forEach((texture) => texture.dispose());

    this.group.clear();
    this.animatedProps.length = 0;
    this.vehicleDisplays.length = 0;
    this.propRegistry.length = 0;
    this.trophyDisplays.clear();
    this.landmarks.clear();
    this.compartmentLandmarks.clear();
    this.materialCache.clear();
    this.alloyTexture = null;
    this.trophyTexture = null;
    this.energyTexture = null;
  }
}
