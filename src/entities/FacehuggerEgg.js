import * as THREE from 'three';
import { audioSynth } from '../AudioSynthesizer.js';
import { disposeObject3D } from '../utils/materialState.js';

export class FacehuggerEggCluster {
  constructor(scene, position) {
    this.scene = scene;
    this.position = position.clone();

    this.isOpen = false;
    this.hasHatched = false;
    this.facehugger = null;
    this.hatchDelay = 0;
    this.hatchTarget = null;
    this.isDisposed = false;

    this.mesh = this.createEggMesh();
    this.scene.add(this.mesh);
  }

  createEggMesh() {
    const eggGroup = new THREE.Group();

    const eggMat = new THREE.MeshStandardMaterial({
      color: 0x221a12,
      roughness: 0.9,
      metalness: 0.1
    });

    const interiorMat = new THREE.MeshBasicMaterial({ color: 0x00ff33 });

    // Main Egg Base
    const eggBaseGeo = new THREE.SphereGeometry(1.2, 16, 16);
    eggBaseGeo.scale(1, 1.4, 1);
    const eggBase = new THREE.Mesh(eggBaseGeo, eggMat);
    eggBase.position.y = 1.6;
    eggBase.castShadow = true;
    eggGroup.add(eggBase);

    // Glowing Interior Core
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.8), interiorMat);
    core.position.y = 1.8;
    eggGroup.add(core);

    eggGroup.position.copy(this.position);
    return eggGroup;
  }

  update(delta, playerPos) {
    if (this.isDisposed) return;

    if (this.hasHatched) {
      if (this.facehugger) {
        this.facehugger.mesh.position.addScaledVector(this.facehugger.dir, 40 * delta);
        this.facehugger.lifetime -= delta;
        if (this.facehugger.lifetime <= 0) {
          this.neutralizeFacehugger();
        }
      }
      return;
    }

    if (this.isOpen) {
      this.hatchDelay = Math.max(0, this.hatchDelay - delta);
      if (this.hatchDelay === 0) {
        this.hasHatched = true;
        this.spawnFacehugger(this.hatchTarget ?? playerPos);
        this.hatchTarget = null;
      }
      return;
    }

    if (this.position.distanceTo(playerPos) < 14.0) {
      this.isOpen = true;
      this.hatchDelay = 0.5;
      this.hatchTarget = playerPos.clone();
      audioSynth.playAcidSizzle();
    }
  }

  spawnFacehugger(playerPos) {
    if (this.isDisposed) return false;
    const fhMat = new THREE.MeshStandardMaterial({ color: 0xaa9977 });
    const fhMesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), fhMat);
    fhMesh.position.copy(this.position).add(new THREE.Vector3(0, 2, 0));

    const dir = playerPos.clone().sub(fhMesh.position).normalize();
    this.facehugger = { mesh: fhMesh, dir, lifetime: 2.0 };
    this.scene.add(fhMesh);
    return true;
  }

  neutralizeFacehugger() {
    if (!this.facehugger) return false;
    disposeObject3D(this.facehugger.mesh);
    this.facehugger = null;
    return true;
  }

  dispose() {
    if (this.isDisposed) return false;
    this.isDisposed = true;

    this.hatchDelay = 0;
    this.hatchTarget = null;

    this.neutralizeFacehugger();
    disposeObject3D(this.mesh);
    this.mesh = null;
    return true;
  }
}
