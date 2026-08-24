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
    const energyTexture = getYautjaEnergyTexture();
    const hullMaterial = new THREE.MeshStandardMaterial({
      color: 0x363d3c,
      metalness: 0.92,
      roughness: 0.24,
    });
    const armorMaterial = new THREE.MeshStandardMaterial({
      color: 0x625f51,
      metalness: 0.86,
      roughness: 0.32,
    });
    const energyMaterial = new THREE.MeshStandardMaterial({
      color: 0x42fff0,
      emissive: 0x0ba89c,
      emissiveIntensity: 2.4,
      map: energyTexture,
      emissiveMap: energyTexture,
      metalness: 0.25,
      roughness: 0.3,
    });

    const hull = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), hullMaterial);
    hull.scale.set(4.8, 1.35, 7.6);
    hull.castShadow = true;
    hull.receiveShadow = true;
    group.add(hull);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(2.3, 6.2, 5), armorMaterial);
    nose.rotation.x = Math.PI / 2;
    nose.position.z = -6.8;
    nose.scale.x = 1.35;
    nose.castShadow = true;
    group.add(nose);

    const spine = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.25, 11.5), armorMaterial);
    spine.position.y = 1.05;
    spine.castShadow = true;
    group.add(spine);

    const wingGeometry = new THREE.BufferGeometry();
    wingGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      0, 0, -4.5,
      10.5, -0.2, 3.8,
      2.2, 0.15, 5.8,
      0, 0, -4.5,
      -2.2, 0.15, 5.8,
      -10.5, -0.2, 3.8,
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

    const energyKeel = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 8.8), energyMaterial);
    energyKeel.position.set(0, -1.25, 0.5);
    group.add(energyKeel);

    const cockpit = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 8),
      new THREE.MeshStandardMaterial({
        color: 0x172523,
        emissive: 0x092f2d,
        emissiveIntensity: 0.8,
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
    const energyRestored = restoreResource(player, 'energy', 'maxEnergy', 45);
    const staminaRestored = restoreResource(player, 'stamina', 'maxStamina', 30);
    player.scanPulseTimer = Math.max(Number(player.scanPulseTimer) || 0, 6);
    player.scanPulseRadius = Math.max(Number(player.scanPulseRadius) || 0, 85);
    this.mesh.userData.interacted = true;
    this.mesh.userData.interactable = false;
    if (this.energyMaterial) this.energyMaterial.emissiveIntensity = 3.5;

    return {
      type: 'vehicle_scan',
      sourceId: this.id,
      vehicleType: this.type,
      energyRestored,
      staminaRestored,
      scanDuration: 6,
      scanRadius: 85,
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
