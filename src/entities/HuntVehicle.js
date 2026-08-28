import * as THREE from 'three';
import { disposeObject3D } from '../utils/materialState.js';

export const YAUTJA_ENERGY_TEXTURE_PATH = '/assets/textures/yautja-energy-lattice.webp';

const VEHICLE_STATES = Object.freeze(['entering', 'flyby', 'hover', 'leaving', 'disposed']);
const FLIGHT_STATES = new Set(VEHICLE_STATES.slice(0, -1));
let sharedEnergyTexture = null;
let vehicleSequence = 0;

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const easeInOut = (value) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

function positiveDuration(value, fallback) {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function copyVector(value, fallback) {
  if (value?.isVector3) return value.clone();
  if (value && Number.isFinite(value.x) && Number.isFinite(value.y) && Number.isFinite(value.z)) {
    return new THREE.Vector3(value.x, value.y, value.z);
  }
  return fallback.clone();
}

function getPlayerPosition(player) {
  const value = player?.position ?? player?.mesh?.position;
  if (value?.isVector3) return value;
  if (value && Number.isFinite(value.x) && Number.isFinite(value.y) && Number.isFinite(value.z)) {
    return value;
  }
  return null;
}

function restoreResource(player, property, maximumProperty, amount, defaultMaximum = 100) {
  if (!player || !Number.isFinite(player[property])) return 0;
  const maximum = Number.isFinite(player[maximumProperty]) ? player[maximumProperty] : defaultMaximum;
  const before = player[property];
  player[property] = Math.min(maximum, before + amount);
  return player[property] - before;
}

/**
 * Charge une seule texture d'énergie partagée par les véhicules et conteneurs.
 * Le garde-fou DOM conserve l'import et les tests Node sans canvas ni Image.
 */
export function getYautjaEnergyTexture() {
  if (sharedEnergyTexture) return sharedEnergyTexture;
  if (typeof document === 'undefined' || typeof Image === 'undefined') return null;

  try {
    sharedEnergyTexture = new THREE.TextureLoader().load(
      YAUTJA_ENERGY_TEXTURE_PATH,
      undefined,
      undefined,
      () => console.warn('Texture énergétique Yautja indisponible, matériau procédural conservé.'),
    );
    sharedEnergyTexture.wrapS = THREE.RepeatWrapping;
    sharedEnergyTexture.wrapT = THREE.RepeatWrapping;
    sharedEnergyTexture.repeat.set(3, 2);
    sharedEnergyTexture.colorSpace = THREE.SRGBColorSpace;
  } catch {
    sharedEnergyTexture = null;
  }
  return sharedEnergyTexture;
}

/**
 * Navette Yautja procédurale. Son cycle de vol dépend exclusivement du delta
 * de simulation : une pause du jeu fige donc aussi le véhicule.
 */
export class HuntVehicle {
  constructor(scene, {
    id,
    type = 'scout_shuttle',
    state = 'entering',
    entryPoint = new THREE.Vector3(-150, 58, -120),
    flybyStart = new THREE.Vector3(-70, 34, -55),
    hoverPoint = new THREE.Vector3(18, 10, -18),
    exitPoint = new THREE.Vector3(180, 75, 120),
    durations = {},
    interactionDistance = 18,
    reducedMotion = false,
  } = {}) {
    this.scene = scene ?? null;
    this.id = id ?? `hunt_vehicle_${++vehicleSequence}`;
    this.type = type;
    this.state = FLIGHT_STATES.has(state) ? state : 'entering';
    this.stateTime = 0;
    this.age = 0;
    this.lastTransition = null;
    this.interacted = false;
    this.reducedMotion = Boolean(reducedMotion);
    this.interactionDistance = Math.max(1, Number(interactionDistance) || 18);
    this.entryPoint = copyVector(entryPoint, new THREE.Vector3(-150, 58, -120));
    this.flybyStart = copyVector(flybyStart, new THREE.Vector3(-70, 34, -55));
    this.hoverPoint = copyVector(hoverPoint, new THREE.Vector3(18, 10, -18));
    this.exitPoint = copyVector(exitPoint, new THREE.Vector3(180, 75, 120));
    this.leaveStart = this.hoverPoint.clone();
    this.durations = Object.freeze({
      entering: positiveDuration(durations.entering, 3),
      flyby: positiveDuration(durations.flyby, 5),
      hover: positiveDuration(durations.hover, 16),
      leaving: positiveDuration(durations.leaving, 4),
    });

    this.mesh = this.createMesh();
    this.mesh.name = this.id;
    this.mesh.userData.interactable = true;
    this.mesh.userData.interactionType = 'yautja_vehicle';
    this.mesh.userData.vehicleId = this.id;
    this.scene?.add?.(this.mesh);
    this.applyInitialPose();
  }

  createMesh() {
    const group = new THREE.Group();
    const isFugitiveCraft = this.type === 'fugitive_escape_craft';
    const isRitualShip = this.type === 'avp_ritual_ship';
    const isCleanerCraft = this.type === 'wolf_cleaner_ship' || this.type === 'cleaner_shuttle';
    group.userData.vehicleProfile = isFugitiveCraft
      ? 'damaged_fugitive_escape'
      : isRitualShip
        ? 'bouvetoya_blooding_carrier'
        : isCleanerCraft
          ? 'gunnison_cleaner_response'
          : 'clan_recon';
    group.userData.assetPolicy = 'Silhouette procédurale originale ; aucun modèle ou asset officiel.';
    const energyTexture = getYautjaEnergyTexture();
    const hullMaterial = new THREE.MeshStandardMaterial({
      color: isFugitiveCraft ? 0x222c31 : isRitualShip ? 0x202a29 : isCleanerCraft ? 0x28332f : 0x363d3c,
      metalness: 0.92,
      roughness: isFugitiveCraft ? 0.42 : isRitualShip ? 0.34 : 0.24,
    });
    const armorMaterial = new THREE.MeshStandardMaterial({
      color: isFugitiveCraft ? 0x48575b : isRitualShip ? 0x71664f : isCleanerCraft ? 0x647069 : 0x625f51,
      metalness: 0.86,
      roughness: isFugitiveCraft ? 0.5 : isRitualShip ? 0.4 : 0.32,
    });
    const energyMaterial = new THREE.MeshStandardMaterial({
      color: isFugitiveCraft ? 0xff8c58 : isRitualShip ? 0x74ffe2 : isCleanerCraft ? 0x9dffb5 : 0x42fff0,
      emissive: isFugitiveCraft ? 0xb63f18 : isRitualShip ? 0x168f80 : isCleanerCraft ? 0x247a45 : 0x0ba89c,
      emissiveIntensity: 2.4,
      map: energyTexture,
      emissiveMap: energyTexture,
      metalness: 0.25,
      roughness: 0.3,
    });

    const hull = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), hullMaterial);
    hull.scale.set(
      isFugitiveCraft ? 4.25 : isRitualShip ? 6.2 : isCleanerCraft ? 5.35 : 4.8,
      isFugitiveCraft ? 1.12 : isRitualShip ? 1.55 : isCleanerCraft ? 1.42 : 1.35,
      isFugitiveCraft ? 8.7 : isRitualShip ? 9.2 : isCleanerCraft ? 8.25 : 7.6,
    );
    hull.castShadow = true;
    hull.receiveShadow = true;
    group.add(hull);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(
      isFugitiveCraft ? 1.85 : isRitualShip ? 2.65 : isCleanerCraft ? 2.5 : 2.3,
      isFugitiveCraft ? 7.4 : isRitualShip ? 7.8 : isCleanerCraft ? 7.1 : 6.2,
      isFugitiveCraft ? 6 : isRitualShip ? 7 : isCleanerCraft ? 8 : 5,
    ), armorMaterial);
    nose.rotation.x = Math.PI / 2;
    nose.position.z = isFugitiveCraft ? -8.2 : -6.8;
    nose.scale.x = isFugitiveCraft ? 1.12 : 1.35;
    nose.castShadow = true;
    group.add(nose);

    const spine = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.25, 11.5), armorMaterial);
    spine.position.y = 1.05;
    spine.castShadow = true;
    group.add(spine);

    const wingReach = isFugitiveCraft ? 8.2 : isRitualShip ? 12.8 : isCleanerCraft ? 11.4 : 10.5;
    const wingSweep = isFugitiveCraft ? 7.2 : isRitualShip ? 6.4 : isCleanerCraft ? 5.2 : 3.8;
    const wingGeometry = new THREE.BufferGeometry();
    wingGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      0, 0, -4.5,
      wingReach, -0.2, wingSweep,
      2.2, 0.15, 5.8,
      0, 0, -4.5,
      -2.2, 0.15, 5.8,
      -wingReach, -0.2, wingSweep,
    ]), 3));
    wingGeometry.computeVertexNormals();
    const wings = new THREE.Mesh(wingGeometry, armorMaterial);
    wings.castShadow = true;
    wings.material.side = THREE.DoubleSide;
    group.add(wings);

    for (const x of [-2.7, 2.7]) {
      const engine = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.2, 8, 20), energyMaterial);
      engine.position.set(x, 0, 5.7);
      engine.rotation.x = Math.PI / 2;
      group.add(engine);
    }
    if (isFugitiveCraft) {
      const scarMaterial = new THREE.MeshStandardMaterial({ color: 0x171b1c, metalness: 0.7, roughness: 0.78 });
      for (const side of [-1, 1]) {
        const stabilizer = new THREE.Mesh(new THREE.BoxGeometry(0.42, 2.2, 5.6, 2, 4, 8), armorMaterial);
        stabilizer.position.set(side * 3.55, -0.25, 2.6);
        stabilizer.rotation.z = side * 0.12;
        stabilizer.rotation.y = side * -0.16;
        group.add(stabilizer);
      }
      const damagedPlate = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.22, 3.6, 4, 2, 6), scarMaterial);
      damagedPlate.position.set(2.15, 1.15, 1.25);
      damagedPlate.rotation.set(0.1, -0.18, 0.14);
      group.add(damagedPlate);
      const distressBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), energyMaterial);
      distressBeacon.name = 'fugitiveDistressBeacon';
      distressBeacon.position.set(-1.25, 1.7, 3.1);
      group.add(distressBeacon);
    }
    if (isRitualShip) {
      const podGeometry = new THREE.CapsuleGeometry(0.68, 3.6, 8, 12);
      for (const side of [-1, 1]) {
        for (const z of [-2.6, 2.8]) {
          const pod = new THREE.Mesh(podGeometry, armorMaterial);
          pod.name = `ritual-drop-pod:${side}:${z}`;
          pod.position.set(side * 4.25, -1.25, z);
          pod.rotation.x = Math.PI / 2;
          pod.rotation.z = side * 0.08;
          pod.castShadow = true;
          group.add(pod);
        }
      }
      for (const z of [-2.2, 2.6]) {
        const crown = new THREE.Mesh(new THREE.TorusGeometry(3.25, 0.24, 10, 36, Math.PI), armorMaterial);
        crown.name = `ritual-crown:${z}`;
        crown.position.set(0, 1.5, z);
        crown.rotation.set(Math.PI / 2, 0, Math.PI / 2);
        group.add(crown);
      }
      const bloodingBeacon = new THREE.Mesh(new THREE.OctahedronGeometry(0.52, 1), energyMaterial);
      bloodingBeacon.name = 'blooding-cycle-beacon';
      bloodingBeacon.position.set(0, 2.35, -0.8);
      group.add(bloodingBeacon);
    }
    if (isCleanerCraft) {
      const canisterGeometry = new THREE.CylinderGeometry(0.28, 0.32, 1.85, 12);
      for (const side of [-1, 1]) {
        for (let index = 0; index < 3; index += 1) {
          const canister = new THREE.Mesh(canisterGeometry, armorMaterial);
          canister.name = `cleaner-canister:${side}:${index}`;
          canister.position.set(side * 3.25, -0.92, -0.8 + index * 1.65);
          canister.rotation.z = side * 0.1;
          canister.castShadow = true;
          group.add(canister);
        }
        const equipmentRail = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.5, 6.2), hullMaterial);
        equipmentRail.name = `cleaner-equipment-rail:${side}`;
        equipmentRail.position.set(side * 3.25, -0.55, 0.9);
        group.add(equipmentRail);
        const plasmaPod = new THREE.Mesh(new THREE.CapsuleGeometry(0.35, 2.2, 6, 10), armorMaterial);
        plasmaPod.name = `cleaner-plasma-pod:${side}`;
        plasmaPod.position.set(side * 1.5, 1.72, -0.6);
        plasmaPod.rotation.x = Math.PI / 2;
        group.add(plasmaPod);
      }
      const cleanerBeacon = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 1), energyMaterial);
      cleanerBeacon.name = 'wolf-cleaner-response-beacon';
      cleanerBeacon.position.set(0, 2.2, 2.8);
      group.add(cleanerBeacon);
      group.userData.cleanerCanisterCount = 6;
      group.userData.dualPlasmaPods = 2;
    }

    const energyKeel = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 8.8), energyMaterial);
    energyKeel.position.set(0, -1.25, 0.5);
    group.add(energyKeel);

    const cockpit = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 8),
      new THREE.MeshStandardMaterial({
        color: isFugitiveCraft ? 0x241d1b : 0x172523,
        emissive: isFugitiveCraft ? 0x5d2315 : 0x092f2d,
        emissiveIntensity: isFugitiveCraft ? 1.15 : 0.8,
        metalness: 0.75,
        roughness: 0.12,
      }),
    );
    cockpit.scale.set(1.9, 0.65, 2.5);
    cockpit.position.set(0, 1.15, -2.5);
    group.add(cockpit);

    this.energyMaterial = energyMaterial;
    return group;
  }

  applyInitialPose() {
    if (this.state === 'entering') this.mesh.position.copy(this.entryPoint);
    else if (this.state === 'flyby') this.mesh.position.copy(this.flybyStart);
    else this.mesh.position.copy(this.hoverPoint);
    this.mesh.rotation.set(-0.08, Math.PI * 0.08, this.reducedMotion ? 0 : 0.04);
    if (this.reducedMotion && this.energyMaterial) this.energyMaterial.emissiveIntensity = 2.15;
  }

  setReducedMotion(enabled) {
    const reducedMotion = Boolean(enabled);
    const changed = reducedMotion !== this.reducedMotion;
    this.reducedMotion = reducedMotion;
    if (changed && this.state !== 'disposed') this.applyStatePose();
    return changed;
  }

  transitionTo(nextState) {
    if (!FLIGHT_STATES.has(nextState) || this.state === 'disposed' || nextState === this.state) {
      return false;
    }
    const previousState = this.state;
    if (nextState === 'leaving') this.leaveStart.copy(this.mesh.position);
    this.state = nextState;
    this.stateTime = 0;
    this.lastTransition = Object.freeze({ from: previousState, to: nextState, at: this.age });
    return true;
  }

  applyStatePose() {
    const duration = this.durations[this.state] ?? 1;
    const progress = easeInOut(this.stateTime / duration);

    if (this.state === 'entering') {
      this.mesh.position.lerpVectors(this.entryPoint, this.flybyStart, progress);
      this.mesh.rotation.z = this.reducedMotion ? 0 : 0.16 * (1 - progress);
    } else if (this.state === 'flyby') {
      this.mesh.position.lerpVectors(this.flybyStart, this.hoverPoint, progress);
      this.mesh.rotation.z = this.reducedMotion ? 0 : -Math.sin(progress * Math.PI) * 0.13;
    } else if (this.state === 'hover') {
      this.mesh.position.copy(this.hoverPoint);
      if (this.reducedMotion) {
        this.mesh.rotation.y = Math.PI * 0.08;
        this.mesh.rotation.z = 0;
      } else {
        this.mesh.position.y += Math.sin(this.age * 1.45) * 0.65;
        this.mesh.rotation.y = Math.PI * 0.08 + Math.sin(this.age * 0.22) * 0.08;
        this.mesh.rotation.z = Math.sin(this.age * 0.7) * 0.025;
      }
    } else if (this.state === 'leaving') {
      this.mesh.position.lerpVectors(this.leaveStart, this.exitPoint, progress);
      this.mesh.rotation.z = this.reducedMotion ? 0 : -0.18 * progress;
    }

    if (this.energyMaterial) {
      this.energyMaterial.emissiveIntensity = this.reducedMotion
        ? (this.interacted ? 3.5 : 2.15)
        : 2.15 + Math.sin(this.age * 4) * 0.45;
    }
  }

  update(delta, { reducedMotion = this.reducedMotion } = {}) {
    if (this.state === 'disposed') return this.state;
    this.setReducedMotion(reducedMotion);
    let remaining = Number.isFinite(delta) ? Math.max(0, delta) : 0;

    while (remaining > 0 && this.state !== 'disposed') {
      const duration = this.durations[this.state];
      const available = Math.max(0, duration - this.stateTime);
      const step = Math.min(remaining, available || remaining);
      this.stateTime += step;
      this.age += step;
      this.applyStatePose();
      remaining -= step;

      if (this.stateTime + Number.EPSILON < duration) break;
      if (this.state === 'entering') this.transitionTo('flyby');
      else if (this.state === 'flyby') this.transitionTo('hover');
      else if (this.state === 'hover') this.transitionTo('leaving');
      else if (this.state === 'leaving') this.dispose();
    }

    return this.state;
  }

  interact(player) {
    if (this.state === 'disposed' || this.interacted) return false;
    const playerPosition = getPlayerPosition(player);
    if (!playerPosition || this.mesh.position.distanceTo(playerPosition) > this.interactionDistance) return false;

    this.interacted = true;
    const isFugitiveCraft = this.type === 'fugitive_escape_craft';
    const isRitualShip = this.type === 'avp_ritual_ship';
    const isCleanerCraft = this.type === 'wolf_cleaner_ship' || this.type === 'cleaner_shuttle';
    const scanDuration = isFugitiveCraft ? 8 : isRitualShip ? 9 : isCleanerCraft ? 10 : 6;
    const scanRadius = isFugitiveCraft ? 110 : isRitualShip ? 120 : isCleanerCraft ? 125 : 85;
    const energyRestored = restoreResource(player, 'energy', 'maxEnergy', isFugitiveCraft ? 60 : isRitualShip ? 70 : isCleanerCraft ? 75 : 45);
    const staminaRestored = restoreResource(player, 'stamina', 'maxStamina', isFugitiveCraft ? 38 : isRitualShip ? 45 : isCleanerCraft ? 42 : 30);
    player.scanPulseTimer = Math.max(Number(player.scanPulseTimer) || 0, scanDuration);
    player.scanPulseRadius = Math.max(Number(player.scanPulseRadius) || 0, scanRadius);
    this.mesh.userData.interacted = true;
    this.mesh.userData.interactable = false;
    if (this.energyMaterial) this.energyMaterial.emissiveIntensity = 3.5;

    return {
      type: 'vehicle_scan',
      sourceId: this.id,
      vehicleType: this.type,
      energyRestored,
      staminaRestored,
      scanDuration,
      scanRadius,
    };
  }

  leave() {
    return this.transitionTo('leaving');
  }

  dispose() {
    if (this.state === 'disposed') return false;
    this.state = 'disposed';
    this.stateTime = 0;
    this.mesh.userData.interactable = false;
    return disposeObject3D(this.mesh);
  }
}

export default HuntVehicle;
