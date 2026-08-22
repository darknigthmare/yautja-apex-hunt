import * as THREE from 'three';
import { HuntVehicle, getYautjaEnergyTexture } from '../entities/HuntVehicle.js';
import { disposeObject3D } from '../utils/materialState.js';

export const DEFAULT_LEVEL_EVENT_SCHEDULE = Object.freeze([
  Object.freeze({ at: 3, kind: 'flyby' }),
  Object.freeze({ at: 8, kind: 'spawn_enemy' }),
  Object.freeze({ at: 14, kind: 'hazard' }),
  Object.freeze({ at: 22, kind: 'spawn_cache' }),
  Object.freeze({ at: 28, kind: 'hazard_end' }),
  Object.freeze({ at: 36, kind: 'spawn_enemy' }),
  Object.freeze({ at: 52, kind: 'spawn_enemy' }),
  Object.freeze({ at: 68, kind: 'spawn_enemy' }),
]);

export const HUNT_CACHE_TYPES = Object.freeze({
  balanced: Object.freeze({ health: 35, energy: 50, honor: 120, shell: 0x484a42, edge: 0x8a7854, energyColor: 0x49fff0, emissive: 0x0ba397 }),
  medicomp: Object.freeze({ health: 55, energy: 25, honor: 80, shell: 0x35433b, edge: 0x9caa8c, energyColor: 0x76ff9a, emissive: 0x168a3b }),
  energy_cell: Object.freeze({ health: 15, energy: 75, honor: 90, shell: 0x2f3948, edge: 0x6e8ba3, energyColor: 0x58bfff, emissive: 0x155fa3 }),
  trophy_reliquary: Object.freeze({ health: 0, energy: 20, honor: 240, shell: 0x4a3a2d, edge: 0xd1a54a, energyColor: 0xffc84b, emissive: 0xa35d0b }),
});

let cacheSequence = 0;

function readPosition(entity, fallback = new THREE.Vector3()) {
  const value = entity?.position ?? entity?.mesh?.position;
  if (value?.isVector3) return value;
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
  } = {}) {
    this.scene = scene ?? null;
    this.id = id ?? `hunt_cache_${++cacheSequence}`;
    this.used = false;
    this.disposed = false;
    this.age = 0;
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

  update(delta) {
    if (this.disposed || !Number.isFinite(delta) || delta <= 0) return;
    this.age += delta;
    if (!this.used) {
      const pulse = 1.85 + Math.sin(this.age * 3.2) * 0.4;
      this.energyMaterial.emissiveIntensity = pulse;
      this.glow.intensity = pulse;
    }
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
    this.energyMaterial.emissiveIntensity = 0.25;
    this.glow.intensity = 0.25;

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
  } = {}) {
    this.scene = scene ?? null;
    this.rng = typeof rng === 'function' ? rng : Math.random;
    this.maxEnemySpawns = Math.max(0, Math.floor(maxEnemySpawns));
    this.maxVehicles = Math.max(0, Math.floor(maxVehicles));
    this.maxCaches = Math.max(0, Math.floor(maxCaches));
    this.scheduleTemplate = [...schedule]
      .filter(({ at, kind }) => Number.isFinite(at) && at >= 0 && typeof kind === 'string')
      .sort((a, b) => a.at - b.at);
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
  }

  get containers() {
    return this.caches;
  }

  start({ huntId = 'goliath', biomeId = 'jungle' } = {}) {
    if (this.disposed) return false;
    this.stop();
    this.huntId = huntId;
    this.biomeId = biomeId;
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

  selectEnemyType(ordinal = this.enemySpawnCount + 1) {
    const biome = String(this.biomeId ?? '').toLowerCase();
    const hunt = String(this.huntId ?? '').toLowerCase();
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
    return biome.includes('jungle') || biome.includes('hive') ? 'rain' : 'thermal_storm';
  }

  selectVehicleType() {
    const biome = String(this.biomeId ?? '').toLowerCase();
    if (biome.includes('hive')) return 'cleaner_shuttle';
    if (String(this.huntId).includes('bad_blood')) return 'clan_interceptor';
    return 'scout_shuttle';
  }

  selectCacheType() {
    const biome = String(this.biomeId ?? '').toLowerCase();
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
    };
    this.pendingSignals.push(enriched);
    this.currentSignals?.push(enriched);
    return enriched;
  }

  triggerEvent(event, context) {
    if (event.kind === 'flyby') {
      if (this.vehicleSpawnCount >= this.maxVehicles) return;
      const hoverPoint = this.positionAround(context.player, 14, 24);
      hoverPoint.y = 10;
      const side = this.randomUnit() < 0.5 ? -1 : 1;
      const vehicle = new HuntVehicle(this.root, {
        type: this.selectVehicleType(),
        entryPoint: new THREE.Vector3(side * 170, 65, hoverPoint.z - 115),
        flybyStart: new THREE.Vector3(side * 75, 34, hoverPoint.z - 48),
        hoverPoint,
        exitPoint: new THREE.Vector3(-side * 190, 82, hoverPoint.z + 145),
      });
      this.vehicleSpawnCount += 1;
      this.vehicles.push(vehicle);
      this.emit({ type: 'flyby', vehicleType: vehicle.type, sourceId: vehicle.id, vehicle });
      return;
    }

    if (event.kind === 'spawn_enemy') {
      if (this.enemySpawnCount >= this.maxEnemySpawns) return;
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
      };
      this.enemySpawnCount = ordinal;
      const position = this.positionAround(context.player, 34, 58);
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
      const position = this.positionAround(context.player, 6, 10);
      const cacheType = this.selectCacheType();
      const cache = new HuntSupplyCache(this.root, { position, cacheType });
      this.cacheSpawnCount += 1;
      this.caches.push(cache);
      this.emit({
        type: 'spawn_cache',
        sourceId: cache.id,
        cacheType,
        cache,
        position: { x: position.x, y: position.y, z: position.z },
      });
    }
  }

  advanceEntities(delta) {
    if (delta <= 0) return;
    this.vehicles.forEach((vehicle) => vehicle.update(delta));
    this.caches.forEach((cache) => cache.update(delta));
    this.vehicles = this.vehicles.filter((vehicle) => vehicle.state !== 'disposed');
    this.caches = this.caches.filter((cache) => !cache.disposed);
  }

  update(delta, { player = null, boss = null } = {}) {
    if (!this.active || this.disposed || !Number.isFinite(delta) || delta <= 0) return [];
    const endTime = this.elapsed + delta;
    const context = { player, boss };
    this.currentSignals = [];

    while (this.scheduleIndex < this.scheduleTemplate.length) {
      const event = this.scheduleTemplate[this.scheduleIndex];
      if (event.at > endTime) break;
      this.advanceEntities(Math.max(0, event.at - this.elapsed));
      this.elapsed = event.at;
      this.triggerEvent(event, context);
      this.scheduleIndex += 1;
    }

    this.advanceEntities(Math.max(0, endTime - this.elapsed));
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
