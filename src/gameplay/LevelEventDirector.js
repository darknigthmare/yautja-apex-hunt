import * as THREE from 'three';
import { HuntVehicle, getYautjaEnergyTexture } from '../entities/HuntVehicle.js';
import { disposeObject3D } from '../utils/materialState.js';
import { getDirectiveSchedule } from './HuntDirectiveSystem.js';

export const DEFAULT_LEVEL_EVENT_SCHEDULE = Object.freeze([
  Object.freeze({ at: 3, kind: 'flyby' }),
  Object.freeze({ at: 8, kind: 'spawn_enemy' }),
  Object.freeze({ at: 14, kind: 'hazard' }),
  Object.freeze({ at: 22, kind: 'spawn_cache' }),
  Object.freeze({ at: 28, kind: 'hazard_end' }),
  Object.freeze({ at: 36, kind: 'spawn_enemy' }),
  Object.freeze({ at: 52, kind: 'spawn_enemy' }),
  Object.freeze({ at: 68, kind: 'spawn_enemy' }),
  // L'écologie de départ peuple déjà les cartes : la seconde moitié de la
  // chasse privilégie donc des incidents spatialisés aux renforts artificiels.
  Object.freeze({ at: 82, kind: 'localized_event' }),
  Object.freeze({ at: 102, kind: 'prey_migration' }),
  Object.freeze({ at: 126, kind: 'territory_clash' }),
  Object.freeze({ at: 151, kind: 'localized_event' }),
  Object.freeze({ at: 174, kind: 'boss_migration' }),
  Object.freeze({ at: 190, kind: 'prey_migration' }),
]);

const EVENT_NODE_KIND_ALIASES = Object.freeze({
  pyramid_shift: Object.freeze(['pyramid_shift']),
  localized_event: Object.freeze(['localized_hazard', 'localized_event']),
  spawn_cache: Object.freeze(['cache_drop']),
  prey_migration: Object.freeze(['prey_migration']),
  territory_clash: Object.freeze(['territory_clash']),
  boss_migration: Object.freeze(['boss_trail', 'boss_migration']),
  directive_wave: Object.freeze(['directive_wave', 'encounter', 'reinforcement']),
});

const BIOME_LEVEL_EVENT_SCHEDULE_EXTENSIONS = Object.freeze({
  // Los Angeles expose trois incidents localisés distincts. Cette impulsion
  // supplémentaire consomme le troisième nœud sans modifier les autres cartes.
  los_angeles_1997: Object.freeze([
    Object.freeze({ at: 116, kind: 'localized_event' }),
  ]),
  // Trois cycles de pierre reconfigurent réellement les couloirs de Bouvetøya
  // entre les vagues : le signal dédié pilote meshes et colliders du biome.
  bouvetoya_pyramid: Object.freeze([
    Object.freeze({ at: 48, kind: 'pyramid_shift' }),
    Object.freeze({ at: 116, kind: 'pyramid_shift' }),
    Object.freeze({ at: 166, kind: 'pyramid_shift' }),
  ]),
  // Les temps pointent des nœuds nommés afin que le blackout, la rupture de
  // ruche, la chute du cordon et l’extraction ne deviennent jamais des textes
  // génériques déplacés ailleurs sur la carte.
  gunnison_outbreak: Object.freeze([
    Object.freeze({ at: 38, kind: 'localized_event', nodeId: 'gunnison-grid-blackout' }),
    Object.freeze({ at: 68, kind: 'prey_migration', nodeId: 'gunnison-hive-rupture' }),
    Object.freeze({ at: 94, kind: 'territory_clash', nodeId: 'gunnison-guard-collapse' }),
    Object.freeze({ at: 164, kind: 'localized_event', nodeId: 'gunnison-extraction-countdown' }),
  ]),
});

const BIOME_LEVEL_EVENT_SCHEDULE_OMISSIONS = Object.freeze({
  // Gunnison fournit ses propres nœuds nommés pour ces familles. Conserver les
  // occurrences génériques ferait rejouer la même rupture de ruche et le même
  // effondrement militaire par modulo au lieu de raconter une progression.
  gunnison_outbreak: Object.freeze(['prey_migration', 'territory_clash']),
});

function cloneScheduleEntry(entry) {
  if (!entry || typeof entry !== 'object') return null;
  const kind = typeof entry.kind === 'string'
    ? entry.kind
    : (typeof entry.type === 'string' ? entry.type : null);
  if (!Number.isFinite(entry.at) || entry.at < 0 || !kind) return null;
  return {
    ...entry,
    kind,
    ...(Array.isArray(entry.enemyTypes) ? { enemyTypes: [...entry.enemyTypes] } : {}),
  };
}

function cloneSchedule(schedule) {
  if (!schedule || typeof schedule[Symbol.iterator] !== 'function') return [];
  return [...schedule]
    .map(cloneScheduleEntry)
    .filter(Boolean)
    .sort((a, b) => a.at - b.at);
}

function composeSchedule(baseSchedule, directiveSchedule) {
  return [
    ...cloneSchedule(baseSchedule),
    ...cloneSchedule(directiveSchedule),
  ].sort((a, b) => a.at - b.at);
}

export const HUNT_CACHE_TYPES = Object.freeze({
  balanced: Object.freeze({ health: 35, energy: 50, honor: 120, shell: 0x484a42, edge: 0x8a7854, energyColor: 0x49fff0, emissive: 0x0ba397 }),
  medicomp: Object.freeze({ health: 55, energy: 25, honor: 80, shell: 0x35433b, edge: 0x9caa8c, energyColor: 0x76ff9a, emissive: 0x168a3b }),
  energy_cell: Object.freeze({ health: 15, energy: 75, honor: 90, shell: 0x2f3948, edge: 0x6e8ba3, energyColor: 0x58bfff, emissive: 0x155fa3 }),
  trophy_reliquary: Object.freeze({ health: 0, energy: 20, honor: 240, shell: 0x4a3a2d, edge: 0xd1a54a, energyColor: 0xffc84b, emissive: 0xa35d0b }),
  stargazer_salvage: Object.freeze({ health: 28, energy: 65, honor: 180, shell: 0x343e44, edge: 0x8aa6ad, energyColor: 0xff8c58, emissive: 0x9b3014 }),
  owlf_cold_cache: Object.freeze({ health: 42, energy: 58, honor: 190, shell: 0x667278, edge: 0xb6d8df, energyColor: 0x75e8ff, emissive: 0x147c9b }),
  ritual_weapon_pod: Object.freeze({ health: 24, energy: 85, honor: 210, shell: 0x242d2d, edge: 0x9b8964, energyColor: 0x74ffe2, emissive: 0x168f80 }),
  cleaner_case: Object.freeze({ health: 42, energy: 72, honor: 220, shell: 0x293437, edge: 0x87999a, energyColor: 0x6fffd1, emissive: 0x168f74 }),
});

let cacheSequence = 0;

function readPosition(entity, fallback = new THREE.Vector3()) {
  const value = entity?.position ?? entity?.mesh?.position;
  if (value?.isVector3) return value;
  if (Array.isArray(value) && value.length >= 3) {
    const [x, y, z] = value.map(Number);
    if ([x, y, z].every(Number.isFinite)) return new THREE.Vector3(x, y, z);
  }
  if (value && Number.isFinite(value.x) && Number.isFinite(value.y) && Number.isFinite(value.z)) {
    return value;
  }
  return fallback;
}

function restoreResource(player, property, maximumProperty, amount, defaultMaximum = 100) {
  if (!player || !Number.isFinite(player[property])) return 0;
  const maximum = Number.isFinite(player[maximumProperty]) ? player[maximumProperty] : defaultMaximum;
  const before = player[property];
  player[property] = Math.min(maximum, before + amount);
  return player[property] - before;
}

function awardHonor(player, baseHonor) {
  if (!player) return 0;
  if (typeof player.addHonor === 'function') {
    const before = Number(player.honorScore) || 0;
    const result = player.addHonor(baseHonor);
    if (Number.isFinite(result)) return result;
    return Math.max(0, (Number(player.honorScore) || 0) - before);
  }
  const before = Number(player.honorScore) || 0;
  player.honorScore = before + baseHonor;
  return baseHonor;
}

/** Coffre/cellule de terrain réellement présent dans la scène et utilisable. */
export class HuntSupplyCache {
  constructor(scene, {
    id,
    position = new THREE.Vector3(),
    interactionDistance = 9,
    cacheType = 'balanced',
    reducedMotion = false,
  } = {}) {
    this.scene = scene ?? null;
    this.id = id ?? `hunt_cache_${++cacheSequence}`;
    this.used = false;
    this.disposed = false;
    this.age = 0;
    this.reducedMotion = Boolean(reducedMotion);
    this.cacheType = HUNT_CACHE_TYPES[cacheType] ? cacheType : 'balanced';
    this.cacheConfig = HUNT_CACHE_TYPES[this.cacheType];
    this.interactionDistance = Math.max(1, Number(interactionDistance) || 9);
    this.mesh = this.createMesh();
    this.mesh.name = this.id;
    this.mesh.position.copy(readPosition({ position }));
    this.mesh.userData.interactable = true;
    this.mesh.userData.interactionType = 'hunt_supply_cache';
    this.mesh.userData.cacheId = this.id;
    this.mesh.userData.cacheType = this.cacheType;
    this.scene?.add?.(this.mesh);
    if (this.reducedMotion) this.applyVisualState();
  }

  createMesh() {
    const group = new THREE.Group();
    const energyTexture = getYautjaEnergyTexture();
    const shellMaterial = new THREE.MeshStandardMaterial({
      color: this.cacheConfig.shell,
      metalness: 0.88,
      roughness: 0.34,
    });
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: this.cacheConfig.edge,
      metalness: 0.92,
      roughness: 0.25,
    });
    const energyMaterial = new THREE.MeshStandardMaterial({
      color: this.cacheConfig.energyColor,
      emissive: this.cacheConfig.emissive,
      emissiveIntensity: 2,
      map: energyTexture,
      emissiveMap: energyTexture,
      roughness: 0.28,
    });

    const base = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.9, 3.2), shellMaterial);
    base.position.y = 1.05;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    this.lidPivot = new THREE.Group();
    this.lidPivot.position.set(0, 2.05, -1.42);
    const lid = new THREE.Mesh(new THREE.BoxGeometry(5, 0.48, 3.35), shellMaterial);
    lid.position.set(0, 0, 1.42);
    lid.castShadow = true;
    this.lidPivot.add(lid);
    group.add(this.lidPivot);

    for (const x of [-2.28, 2.28]) {
      const brace = new THREE.Mesh(new THREE.BoxGeometry(0.28, 2.05, 3.3), edgeMaterial);
      brace.position.set(x, 1.08, 0);
      group.add(brace);
    }

    const cell = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 2.4, 12), energyMaterial);
    cell.rotation.z = Math.PI / 2;
    cell.position.set(0, 2.3, 0.4);
    group.add(cell);

    this.glow = new THREE.PointLight(this.cacheConfig.energyColor, 2.2, 18);
    this.glow.position.set(0, 3.1, 0);
    group.add(this.glow);
    this.energyMaterial = energyMaterial;
    return group;
  }

  applyVisualState() {
    const intensity = this.used
      ? 0.25
      : (this.reducedMotion ? 1.85 : 1.85 + Math.sin(this.age * 3.2) * 0.4);
    this.energyMaterial.emissiveIntensity = intensity;
    this.glow.intensity = intensity;
  }

  setReducedMotion(enabled) {
    const reducedMotion = Boolean(enabled);
    const changed = reducedMotion !== this.reducedMotion;
    this.reducedMotion = reducedMotion;
    if (changed && !this.disposed) this.applyVisualState();
    return changed;
  }

  update(delta, { reducedMotion = this.reducedMotion } = {}) {
    if (this.disposed) return;
    this.setReducedMotion(reducedMotion);
    if (!Number.isFinite(delta) || delta <= 0) return;
    this.age += delta;
    this.applyVisualState();
  }

  tryInteract(player) {
    if (this.disposed || this.used) return false;
    const playerPosition = readPosition(player, null);
    if (!playerPosition || this.mesh.position.distanceTo(playerPosition) > this.interactionDistance) return false;

    this.used = true;
    const healthRestored = restoreResource(player, 'health', 'maxHealth', this.cacheConfig.health);
    const energyRestored = restoreResource(player, 'energy', 'maxEnergy', this.cacheConfig.energy);
    const honorAwarded = awardHonor(player, this.cacheConfig.honor);
    this.lidPivot.rotation.x = -Math.PI * 0.42;
    this.mesh.userData.used = true;
    this.mesh.userData.interactable = false;
    this.applyVisualState();

    return {
      type: 'cache_opened',
      cacheType: this.cacheType,
      sourceId: this.id,
      healthRestored,
      energyRestored,
      honorAwarded,
    };
  }

  dispose() {
    if (this.disposed) return false;
    this.disposed = true;
    this.mesh.userData.interactable = false;
    return disposeObject3D(this.mesh);
  }
}

/**
 * Orchestrateur déterministe des incidents d'une chasse. Il émet des signaux
 * que la boucle de jeu peut matérialiser en PNJ, HUD ou altération météo.
 */
export class LevelEventDirector {
  constructor(scene, {
    rng = Math.random,
    maxEnemySpawns = 4,
    maxVehicles = 1,
    maxCaches = 1,
    schedule = DEFAULT_LEVEL_EVENT_SCHEDULE,
    reducedMotion = false,
  } = {}) {
    this.scene = scene ?? null;
    this.rng = typeof rng === 'function' ? rng : Math.random;
    this.maxEnemySpawns = Math.max(0, Math.floor(maxEnemySpawns));
    this.maxVehicles = Math.max(0, Math.floor(maxVehicles));
    this.maxCaches = Math.max(0, Math.floor(maxCaches));
    this.baseScheduleTemplate = cloneSchedule(schedule);
    this.scheduleTemplate = cloneSchedule(this.baseScheduleTemplate);
    this.root = new THREE.Group();
    this.root.name = 'level-event-director';
    this.scene?.add?.(this.root);
    this.vehicles = [];
    this.caches = [];
    this.pendingSignals = [];
    this.currentSignals = null;
    this.active = false;
    this.disposed = false;
    this.elapsed = 0;
    this.scheduleIndex = 0;
    this.enemySpawnCount = 0;
    this.vehicleSpawnCount = 0;
    this.cacheSpawnCount = 0;
    this.activeHazard = null;
    this.huntId = null;
    this.biomeId = null;
    this.directiveId = null;
    this.reducedMotion = Boolean(reducedMotion);
  }

  get containers() {
    return this.caches;
  }

  setReducedMotion(enabled) {
    const reducedMotion = Boolean(enabled);
    const changed = reducedMotion !== this.reducedMotion;
    this.reducedMotion = reducedMotion;
    this.vehicles.forEach((vehicle) => vehicle.setReducedMotion(reducedMotion));
    this.caches.forEach((cache) => cache.setReducedMotion(reducedMotion));
    return changed;
  }

  start({ huntId = 'goliath', biomeId = 'jungle', directiveId = 'standard_hunt' } = {}) {
    if (this.disposed) return false;
    this.stop();
    this.huntId = huntId;
    this.biomeId = biomeId;
    this.directiveId = typeof directiveId === 'string' && directiveId.trim()
      ? directiveId.trim()
      : 'standard_hunt';
    const biomeSchedule = BIOME_LEVEL_EVENT_SCHEDULE_EXTENSIONS[this.biomeId] ?? [];
    const omittedKinds = BIOME_LEVEL_EVENT_SCHEDULE_OMISSIONS[this.biomeId] ?? [];
    const baseSchedule = omittedKinds.length > 0
      ? this.baseScheduleTemplate.filter(({ kind }) => !omittedKinds.includes(kind))
      : this.baseScheduleTemplate;
    this.scheduleTemplate = composeSchedule(
      composeSchedule(baseSchedule, biomeSchedule),
      getDirectiveSchedule(this.directiveId),
    );
    this.elapsed = 0;
    this.scheduleIndex = 0;
    this.enemySpawnCount = 0;
    this.vehicleSpawnCount = 0;
    this.cacheSpawnCount = 0;
    this.activeHazard = null;
    this.pendingSignals = [];
    this.active = true;
    return this;
  }

  randomUnit() {
    const value = Number(this.rng());
    if (!Number.isFinite(value)) return 0.5;
    return Math.max(0, Math.min(0.999999, value));
  }

  randomRange(min, max) {
    return min + (max - min) * this.randomUnit();
  }

  getEventOrdinal(event) {
    if (Number.isFinite(event?.ordinal)) return Math.max(0, Math.floor(event.ordinal));
    let ordinal = 0;
    for (let index = 0; index < this.scheduleIndex; index += 1) {
      if (this.scheduleTemplate[index]?.kind === event?.kind) ordinal += 1;
    }
    return ordinal;
  }

  hasEcosystemNodes(environment) {
    return typeof environment?.getEventNode === 'function'
      || typeof environment?.getEventNodes === 'function';
  }

  getEnemySpawnLimit(environment) {
    // Les anciens environnements gardent leur plafond historique. Les cartes
    // dotées d'une écologie initiale n'ajoutent que trois renforts dynamiques.
    return this.hasEcosystemNodes(environment)
      ? Math.min(this.maxEnemySpawns, 3)
      : this.maxEnemySpawns;
  }

  getEventNode(environment, kind, ordinal = 0) {
    const aliases = EVENT_NODE_KIND_ALIASES[kind] ?? [kind];
    const safeOrdinal = Math.max(0, Math.floor(Number(ordinal) || 0));

    if (typeof environment?.getEventNode === 'function') {
      for (const alias of aliases) {
        try {
          const node = environment.getEventNode(alias, safeOrdinal);
          if (!node) continue;
          const nodeKind = node.eventType ?? node.kind ?? node.type;
          // Certains environnements historiques renvoient leur premier nœud
          // lorsqu'aucun type ne correspond. Un nœud explicitement typé ne
          // peut être utilisé que s'il appartient réellement à la famille
          // demandée. Les simples Vector3/non typés restent compatibles.
          if (nodeKind && !aliases.includes(String(nodeKind).toLowerCase())) continue;
          return node;
        } catch {
          // Un faux environnement incomplet ne doit jamais interrompre la chasse.
        }
      }
    }

    if (typeof environment?.getEventNodes !== 'function') return null;
    let collection = null;
    try {
      collection = environment.getEventNodes(aliases[0]);
    } catch {
      return null;
    }

    let candidates = [];
    if (Array.isArray(collection)) {
      candidates = collection;
    } else if (collection && typeof collection === 'object') {
      candidates = aliases.flatMap((alias) => (
        Array.isArray(collection[alias]) ? collection[alias] : []
      ));
      if (candidates.length === 0 && Array.isArray(collection.eventNodes)) {
        candidates = collection.eventNodes;
      }
      if (candidates.length === 0 && Array.isArray(collection.nodes)) {
        candidates = collection.nodes;
      }
    }

    const validCandidates = candidates.filter(Boolean);
    const typedCandidates = validCandidates.filter((node) => (
      aliases.includes(String(node.eventType ?? node.kind ?? node.type).toLowerCase())
    ));
    return typedCandidates.length > 0
      ? typedCandidates[safeOrdinal % typedCandidates.length]
      : null;
  }

  resolveEcosystemEvent(context, kind, ordinal, {
    minRadius = 42,
    maxRadius = 92,
    clearance = 5,
    nodeId = null,
  } = {}) {
    let node = null;
    if (typeof nodeId === 'string' && typeof context.environment?.getEventNodes === 'function') {
      try {
        node = context.environment.getEventNodes().find(({ id }) => id === nodeId) ?? null;
      } catch {
        node = null;
      }
    }
    node ??= this.getEventNode(context.environment, kind, ordinal);
    const rawPosition = node?.position ?? node?.center ?? node;
    const nodePosition = readPosition({ position: rawPosition }, null);
    const preferred = nodePosition ?? this.positionAround(context.player, minRadius, maxRadius);
    const position = this.getSafeGroundPosition(context.environment, preferred, { clearance });
    return { node, position };
  }

  selectMigratingPreyType() {
    const biome = String(this.biomeId ?? '').toLowerCase();
    if (biome.includes('gunnison')) return 'xeno_runner';
    if (biome.includes('los_angeles')) return 'subway_armed_hunter';
    if (biome.includes('bouvet') || biome.includes('pyramid')) return 'xeno_runner';
    if (biome.includes('hive')) return 'xeno_runner';
    if (biome.includes('genna') || biome.includes('yautja') || biome.includes('ryushi')) {
      return 'genna_grazer';
    }
    return 'hunting_hound';
  }

  selectTerritoryFactions() {
    const biome = String(this.biomeId ?? '').toLowerCase();
    if (biome.includes('gunnison')) return ['gunnison_national_guard', 'xeno_warrior'];
    if (biome.includes('los_angeles')) return ['urban_cartel_enforcer', 'subway_armed_hunter'];
    if (biome.includes('bouvet') || biome.includes('pyramid')) return ['weyland_expedition_guard', 'xeno_warrior'];
    if (biome.includes('hive')) return ['xeno_drone', 'xeno_warrior'];
    if (biome.includes('genna')) return ['genna_grazer', 'genna_stalker'];
    if (biome.includes('yautja')) return ['hunting_hound', 'clan_sentry_drone'];
    if (biome.includes('ryushi')) return ['human_fireteam', 'xeno_runner'];
    return ['hunting_hound', 'human_fireteam'];
  }

  toSignalPosition(position) {
    return { x: position.x, y: position.y, z: position.z };
  }

  positionAround(entity, minRadius, maxRadius) {
    const origin = readPosition(entity);
    const angle = this.randomRange(0, Math.PI * 2);
    const radius = this.randomRange(minRadius, maxRadius);
    return new THREE.Vector3(
      origin.x + Math.cos(angle) * radius,
      0,
      origin.z + Math.sin(angle) * radius,
    );
  }

  getEncounterSocket(environment, kind, ordinal = 0, count = 4) {
    if (typeof environment?.getEncounterSockets !== 'function') return null;
    const requestedCount = Math.max(1, Math.floor(Number(count) || 4));
    const sockets = environment.getEncounterSockets(kind, requestedCount);
    if (!Array.isArray(sockets) || sockets.length === 0) return null;
    const validSockets = sockets
      .map((socket) => readPosition({ position: socket }, null))
      .filter(Boolean);
    if (validSockets.length === 0) return null;

    // Le décalage respecte le RNG injecté, puis l'ordinal fait tourner la liste
    // stable des sockets afin d'éviter d'empiler toutes les vagues au même point.
    const offset = Math.floor(this.randomUnit() * validSockets.length);
    const index = (offset + Math.max(0, Math.floor(ordinal))) % validSockets.length;
    return validSockets[index].clone?.() ?? new THREE.Vector3(
      validSockets[index].x,
      validSockets[index].y,
      validSockets[index].z,
    );
  }

  getSafeGroundPosition(environment, preferred, { clearance = 4 } = {}) {
    const requested = readPosition({ position: preferred }, new THREE.Vector3());
    let resolved = requested.clone?.() ?? new THREE.Vector3(requested.x, requested.y, requested.z);

    if (typeof environment?.getSafeSpawnPosition === 'function') {
      const safePosition = environment.getSafeSpawnPosition(resolved.clone(), { clearance });
      const safeVector = readPosition({ position: safePosition }, null);
      if (safeVector) {
        resolved = safeVector.clone?.() ?? new THREE.Vector3(safeVector.x, safeVector.y, safeVector.z);
      }
    }

    if (typeof environment?.sampleHeight === 'function') {
      const terrainY = Number(environment.sampleHeight(resolved));
      if (Number.isFinite(terrainY)) resolved.y = terrainY;
    }
    return resolved;
  }

  getNearbyColliderTop(environment, groundPoint, horizontalMargin = 14) {
    let highest = groundPoint.y;
    for (const collider of environment?.obstacleColliders ?? []) {
      if (!Number.isFinite(collider?.x) || !Number.isFinite(collider?.z)) continue;
      const radius = Math.max(0, Number(collider.radius) || 0);
      const distance = Math.hypot(groundPoint.x - collider.x, groundPoint.z - collider.z);
      if (distance > radius + horizontalMargin) continue;

      let baseY = Number(collider.baseY);
      if (!Number.isFinite(baseY) && typeof environment?.sampleHeight === 'function') {
        baseY = Number(environment.sampleHeight(collider.x, collider.z));
      }
      if (!Number.isFinite(baseY)) baseY = groundPoint.y;
      const height = Math.max(0, Number(collider.height) || radius * 2);
      highest = Math.max(highest, baseY + height);
    }
    return highest;
  }

  createFlightPath(context) {
    const { player, environment } = context;
    const socket = this.getEncounterSocket(environment, 'flyby', this.vehicleSpawnCount, 4);
    const preferred = socket ?? this.positionAround(player, 14, 24);
    const groundPoint = this.getSafeGroundPosition(environment, preferred, { clearance: 13 });
    const nearbyColliderTop = this.getNearbyColliderTop(environment, groundPoint);
    const hoverY = Math.max(18, groundPoint.y + 18, nearbyColliderTop + 10);
    const hoverPoint = groundPoint.clone();
    hoverPoint.y = hoverY;

    const side = this.randomUnit() < 0.5 ? -1 : 1;
    return {
      entryPoint: new THREE.Vector3(
        hoverPoint.x + side * 150,
        hoverY + 38,
        hoverPoint.z - 125,
      ),
      flybyStart: new THREE.Vector3(
        hoverPoint.x + side * 72,
        hoverY + 18,
        hoverPoint.z - 54,
      ),
      hoverPoint,
      exitPoint: new THREE.Vector3(
        hoverPoint.x - side * 165,
        hoverY + 42,
        hoverPoint.z + 145,
      ),
    };
  }

  selectEnemyType(ordinal = this.enemySpawnCount + 1) {
    const biome = String(this.biomeId ?? '').toLowerCase();
    const hunt = String(this.huntId ?? '').toLowerCase();
    if (biome.includes('gunnison') || hunt.includes('wolf_cleaner')) {
      if (ordinal === 1) return 'gunnison_national_guard';
      if (ordinal === 2) return 'xeno_facehugger';
      return 'xeno_warrior';
    }
    if (biome.includes('los_angeles') || hunt.includes('city_hunter')) {
      if (ordinal === 1) return 'urban_cartel_enforcer';
      if (ordinal === 2) return 'subway_armed_hunter';
      return 'owlf_cryo_commando';
    }
    if (biome.includes('bouvet') || biome.includes('pyramid') || hunt.includes('grid_alien')) {
      if (ordinal === 1) return 'weyland_expedition_guard';
      if (ordinal === 2) return 'xeno_facehugger';
      return 'xeno_warrior';
    }
    if (biome.includes('hive') || biome.includes('xeno') || hunt.includes('xeno') || hunt.includes('predalien')) {
      return ordinal >= 3 ? 'xeno_warrior' : 'xeno';
    }
    if (biome.includes('genna')) {
      if (ordinal === 1) return 'genna_stalker';
      if (ordinal === 2) return 'grizzly';
      return ordinal === 3 ? 'thermal_trapper' : 'synthetic';
    }
    if (biome.includes('jungle') || biome.includes('preserve') || biome.includes('yautja')) {
      if (ordinal === 1) return 'hound';
      if (ordinal === 2) return 'thermal_trapper';
      return ordinal === 3 ? 'grizzly' : 'hound';
    }
    if (ordinal === 3) return 'thermal_trapper';
    if (ordinal >= 4) return 'synthetic';
    return 'human';
  }

  selectHazardType() {
    const biome = String(this.biomeId ?? '').toLowerCase();
    return biome.includes('jungle') || biome.includes('hive') || biome.includes('bouvet') || biome.includes('gunnison')
      ? 'rain'
      : 'thermal_storm';
  }

  selectVehicleType() {
    const biome = String(this.biomeId ?? '').toLowerCase();
    if (biome.includes('gunnison')) return 'wolf_cleaner_ship';
    if (biome.includes('los_angeles')) return 'clan_interceptor';
    if (biome.includes('stargazer')) return 'fugitive_escape_craft';
    if (biome.includes('bouvet') || biome.includes('pyramid')) return 'avp_ritual_ship';
    if (biome.includes('hive')) return 'cleaner_shuttle';
    if (String(this.huntId).includes('bad_blood')) return 'clan_interceptor';
    return 'scout_shuttle';
  }

  selectCacheType() {
    const biome = String(this.biomeId ?? '').toLowerCase();
    if (biome.includes('gunnison')) return 'cleaner_case';
    if (biome.includes('los_angeles')) return 'owlf_cold_cache';
    if (biome.includes('stargazer')) return 'stargazer_salvage';
    if (biome.includes('bouvet') || biome.includes('pyramid')) return 'ritual_weapon_pod';
    if (biome.includes('hive')) return 'medicomp';
    if (biome.includes('yautja')) return 'trophy_reliquary';
    if (biome.includes('ryushi')) return 'energy_cell';
    return 'balanced';
  }

  emit(signal) {
    const enriched = {
      ...signal,
      at: this.elapsed,
      huntId: this.huntId,
      biomeId: this.biomeId,
      directiveId: this.directiveId,
    };
    this.pendingSignals.push(enriched);
    this.currentSignals?.push(enriched);
    return enriched;
  }

  triggerEvent(event, context) {
    if (event.kind === 'directive_wave') {
      const enemyTypes = Array.isArray(event.enemyTypes)
        ? event.enemyTypes.filter((enemyType) => (
          typeof enemyType === 'string' && enemyType.trim().length > 0
        )).map((enemyType) => enemyType.trim())
        : [];
      // Une directive doit toujours nommer ses proies. Ne jamais substituer
      // ici un ennemi générique qui fausserait contrat et progression.
      if (enemyTypes.length === 0) return;

      const ordinal = this.getEventOrdinal(event);
      const node = this.getEventNode(context.environment, event.kind, ordinal);
      const rawNodePosition = node?.position ?? node?.center ?? node;
      const nodePosition = readPosition({ position: rawNodePosition }, null);
      const socket = nodePosition
        ? null
        : this.getEncounterSocket(
          context.environment,
          'reinforcement',
          ordinal,
          Math.max(4, enemyTypes.length),
        );
      const preferred = nodePosition ?? socket ?? this.positionAround(context.player, 34, 58);
      const position = this.getSafeGroundPosition(context.environment, preferred, { clearance: 5 });
      const sourceId = typeof event.id === 'string' && event.id.trim()
        ? event.id.trim()
        : `${this.directiveId}-wave-${ordinal + 1}`;

      this.emit({
        type: 'spawn_enemy_group',
        id: sourceId,
        sourceId,
        label: typeof event.label === 'string' && event.label.trim()
          ? event.label.trim()
          : `Vague de directive ${ordinal + 1}`,
        objectiveId: event.objectiveId ?? null,
        enemyTypes,
        ordinal: ordinal + 1,
        position: this.toSignalPosition(position),
      });
      return;
    }

    if (event.kind === 'pyramid_shift') {
      const ordinal = this.getEventOrdinal(event);
      const { node, position } = this.resolveEcosystemEvent(context, event.kind, ordinal, {
        minRadius: 42,
        maxRadius: 74,
        clearance: 8,
      });
      this.emit({
        type: 'pyramid_shift',
        eventType: 'pyramid_shift',
        sourceId: node?.id ?? `avp-pyramid-shift-${ordinal + 1}`,
        label: node?.label ?? 'Reconfiguration de la pyramide',
        description: 'Les blocs du temple ferment une voie et ouvrent un nouveau corridor de chasse.',
        ordinal: ordinal + 1,
        phase: ordinal % 3,
        duration: Math.max(3, Number(node?.duration) || 7),
        position: this.toSignalPosition(position),
      });
      return;
    }

    if (event.kind === 'localized_event') {
      const ordinal = this.getEventOrdinal(event);
      const { node, position } = this.resolveEcosystemEvent(context, event.kind, ordinal, {
        minRadius: 46,
        maxRadius: 88,
        clearance: 7,
        nodeId: event.nodeId,
      });
      this.emit({
        type: 'localized_event',
        eventType: node?.eventType ?? 'localized_hazard',
        sourceId: node?.id ?? `localized-event-${ordinal + 1}`,
        label: node?.label ?? 'Perturbation localisée',
        description: node?.label
          ? `${node.label} détectée dans le secteur`
          : 'Une perturbation environnementale localisée modifie temporairement la route de chasse.',
        ordinal: ordinal + 1,
        position: this.toSignalPosition(position),
        radius: Math.max(1, Number(node?.radius) || 18),
        duration: Math.max(1, Number(node?.duration) || 18),
        damage: Math.max(0, Number(node?.damage) || 0),
        status: node?.status ?? null,
        mechanism: node?.mechanism ?? null,
        countdownSeconds: Number(node?.countdownSeconds) || null,
      });
      return;
    }

    if (event.kind === 'prey_migration') {
      const ordinal = this.getEventOrdinal(event);
      const { node, position } = this.resolveEcosystemEvent(context, event.kind, ordinal, {
        minRadius: 58,
        maxRadius: 112,
        clearance: 5,
        nodeId: event.nodeId,
      });
      const creatureType = node?.creatureType ?? this.selectMigratingPreyType();
      const creatureCount = Math.max(1, Math.min(6, Math.floor(Number(node?.creatureCount) || 3)));
      this.emit({
        type: 'prey_migration',
        sourceId: node?.id ?? `prey-migration-${ordinal + 1}`,
        label: node?.label ?? 'Migration de proies',
        description: `${creatureCount} ${creatureType} traversent un corridor de chasse.`,
        ordinal: ordinal + 1,
        position: this.toSignalPosition(position),
        creatureType,
        creatureCount,
        radius: Math.max(12, Number(node?.radius) || 42),
        mechanism: node?.mechanism ?? null,
      });
      return;
    }

    if (event.kind === 'territory_clash') {
      const ordinal = this.getEventOrdinal(event);
      const { node, position } = this.resolveEcosystemEvent(context, event.kind, ordinal, {
        minRadius: 72,
        maxRadius: 128,
        clearance: 8,
        nodeId: event.nodeId,
      });
      const factions = this.selectTerritoryFactions();
      this.emit({
        type: 'territory_clash',
        sourceId: node?.id ?? `territory-clash-${ordinal + 1}`,
        label: node?.label ?? 'Conflit de territoires',
        description: `${factions.join(' et ')} se disputent le secteur sans renfort artificiel.`,
        ordinal: ordinal + 1,
        position: this.toSignalPosition(position),
        factions,
        radius: Math.max(20, Number(node?.radius) || 70),
        duration: Math.max(8, Number(node?.duration) || 18),
        mechanism: node?.mechanism ?? null,
      });
      return;
    }

    if (event.kind === 'boss_migration') {
      const ordinal = this.getEventOrdinal(event);
      const { node, position } = this.resolveEcosystemEvent(context, event.kind, ordinal, {
        minRadius: 96,
        maxRadius: 152,
        clearance: 10,
      });
      this.emit({
        type: 'boss_migration',
        sourceId: node?.id ?? `boss-migration-${ordinal + 1}`,
        label: node?.label ?? 'Migration de la cible Apex',
        description: `La cible ${this.huntId ?? 'apex'} change de territoire et laisse une piste exploitable.`,
        ordinal: ordinal + 1,
        position: this.toSignalPosition(position),
        bossId: this.huntId,
        trailType: node?.eventType ?? 'boss_trail',
        telegraphDuration: Math.max(4, Number(node?.duration) || 12),
      });
      return;
    }

    if (event.kind === 'flyby') {
      if (this.vehicleSpawnCount >= this.maxVehicles) return;
      const flightPath = this.createFlightPath(context);
      const vehicle = new HuntVehicle(this.root, {
        type: this.selectVehicleType(),
        ...flightPath,
        interactionDistance: 34,
        reducedMotion: this.reducedMotion,
      });
      this.vehicleSpawnCount += 1;
      this.vehicles.push(vehicle);
      this.emit({
        type: 'flyby',
        vehicleType: vehicle.type,
        sourceId: vehicle.id,
        vehicle,
        hoverPoint: { x: flightPath.hoverPoint.x, y: flightPath.hoverPoint.y, z: flightPath.hoverPoint.z },
        entryPoint: { x: flightPath.entryPoint.x, y: flightPath.entryPoint.y, z: flightPath.entryPoint.z },
        exitPoint: { x: flightPath.exitPoint.x, y: flightPath.exitPoint.y, z: flightPath.exitPoint.z },
      });
      return;
    }

    if (event.kind === 'spawn_enemy') {
      if (this.enemySpawnCount >= this.getEnemySpawnLimit(context.environment)) return;
      const ordinal = this.enemySpawnCount + 1;
      const enemyType = this.selectEnemyType(ordinal);
      const archetypeIds = {
        hound: 'enemy_hunting_hound',
        xeno: 'enemy_xenomorph_drone',
        human: 'enemy_elite_commando',
        grizzly: 'enemy_grizzly',
        thermal_trapper: 'enemy_thermal_trap_team',
        genna_stalker: 'enemy_genna_hostile_fauna',
        xeno_warrior: 'enemy_xenomorph_warrior',
        synthetic: 'enemy_combat_synthetic_badlands',
        urban_cartel_enforcer: 'enemy_urban_cartel_enforcer',
        subway_armed_hunter: 'enemy_subway_armed_hunter',
        owlf_cryo_commando: 'enemy_owlf_cryo_commando',
        weyland_expedition_guard: 'enemy_weyland_expedition_guard',
        xeno_facehugger: 'enemy_xeno_facehugger',
        gunnison_national_guard: 'enemy_gunnison_national_guard',
      };
      this.enemySpawnCount = ordinal;
      const socket = this.getEncounterSocket(
        context.environment,
        'reinforcement',
        ordinal - 1,
        Math.max(4, this.maxEnemySpawns),
      );
      const preferred = socket ?? this.positionAround(context.player, 34, 58);
      const position = this.getSafeGroundPosition(context.environment, preferred, { clearance: 5 });
      this.emit({
        type: 'spawn_enemy',
        enemyType,
        archetypeId: archetypeIds[enemyType],
        ordinal,
        position: { x: position.x, y: position.y, z: position.z },
      });
      return;
    }

    if (event.kind === 'hazard') {
      this.activeHazard = this.selectHazardType();
      this.emit({ type: 'hazard', hazardType: this.activeHazard, duration: 14, intensity: 1 });
      return;
    }

    if (event.kind === 'hazard_end') {
      if (!this.activeHazard) return;
      const hazardType = this.activeHazard;
      this.activeHazard = null;
      this.emit({ type: 'hazard_end', hazardType });
      return;
    }

    if (event.kind === 'spawn_cache') {
      if (this.cacheSpawnCount >= this.maxCaches) return;
      const node = this.getEventNode(context.environment, event.kind, this.cacheSpawnCount);
      const rawNodePosition = node?.position ?? node?.center ?? node;
      const nodePosition = readPosition({ position: rawNodePosition }, null);
      const socket = nodePosition
        ? null
        : this.getEncounterSocket(
          context.environment,
          'cache',
          this.cacheSpawnCount,
          Math.max(4, this.maxCaches),
        );
      // Sans socket de décor dédié, le coffre reste dans une bande lisible et
      // jouable de 10 à 16 m, puis passe par la même validation que les PNJ.
      const preferred = nodePosition ?? socket ?? this.positionAround(context.player, 10, 16);
      const position = this.getSafeGroundPosition(context.environment, preferred, { clearance: 6 });
      const cacheType = this.selectCacheType();
      const cache = new HuntSupplyCache(this.root, {
        id: node?.id,
        position,
        cacheType,
        reducedMotion: this.reducedMotion,
      });
      this.cacheSpawnCount += 1;
      this.caches.push(cache);
      this.emit({
        type: 'spawn_cache',
        sourceId: cache.id,
        label: node?.label ?? 'Conteneur de chasse largué',
        cacheType,
        cache,
        position: { x: position.x, y: position.y, z: position.z },
      });
    }
  }

  advanceEntities(delta, reducedMotion = this.reducedMotion) {
    if (delta <= 0) return;
    this.vehicles.forEach((vehicle) => vehicle.update(delta, { reducedMotion }));
    this.caches.forEach((cache) => cache.update(delta, { reducedMotion }));
    this.vehicles = this.vehicles.filter((vehicle) => vehicle.state !== 'disposed');
    this.caches = this.caches.filter((cache) => !cache.disposed);
  }

  update(delta, { player = null, boss = null, environment = null, reducedMotion = this.reducedMotion } = {}) {
    if (this.disposed) return [];
    this.setReducedMotion(reducedMotion);
    if (!this.active || !Number.isFinite(delta) || delta <= 0) return [];
    if (boss?.isDead === true) return [];
    const endTime = this.elapsed + delta;
    const context = { player, boss, environment, reducedMotion: this.reducedMotion };
    this.currentSignals = [];

    while (this.scheduleIndex < this.scheduleTemplate.length) {
      const event = this.scheduleTemplate[this.scheduleIndex];
      if (event.at > endTime) break;
      this.advanceEntities(Math.max(0, event.at - this.elapsed), this.reducedMotion);
      this.elapsed = event.at;
      this.triggerEvent(event, context);
      this.scheduleIndex += 1;
    }

    this.advanceEntities(Math.max(0, endTime - this.elapsed), this.reducedMotion);
    this.elapsed = endTime;
    const emitted = this.currentSignals;
    this.currentSignals = null;
    return emitted;
  }

  tryInteract(player) {
    for (const cache of this.caches) {
      const result = cache.tryInteract(player);
      if (result) return this.emit(result);
    }
    for (const vehicle of this.vehicles) {
      const result = vehicle.interact(player);
      if (result) return this.emit(result);
    }
    return false;
  }

  drainSignals() {
    return this.pendingSignals.splice(0);
  }

  stop() {
    if (this.disposed) return false;
    const changed = this.active || this.vehicles.length > 0 || this.caches.length > 0;
    this.active = false;
    this.vehicles.forEach((vehicle) => vehicle.dispose());
    this.caches.forEach((cache) => cache.dispose());
    this.vehicles = [];
    this.caches = [];
    this.pendingSignals = [];
    this.currentSignals = null;
    this.activeHazard = null;
    this.directiveId = null;
    this.scheduleTemplate = cloneSchedule(this.baseScheduleTemplate);
    return changed;
  }

  dispose() {
    if (this.disposed) return false;
    this.stop();
    this.root.parent?.remove(this.root);
    this.root.clear();
    this.root.userData.disposeComplete = true;
    this.disposed = true;
    return true;
  }
}

export default LevelEventDirector;
