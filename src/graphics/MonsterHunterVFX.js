/**
 * MonsterHunterVFX.js - Effets Visuels Spécialisés Monster Hunter pour Yautja: Apex Hunt
 * Implémente en fidélité 1:1 les gerbes d'acide corrosif, le sang bioluminescent,
 * les ondes de choc de pas colossaux, les éclats de carapace brisée et les traînées de pistes thermiques.
 */

import * as THREE from 'three';

export class MonsterHunterVFX {
  constructor(scene) {
    this.scene = scene;
    this.activeEmitters = [];
  }

  /**
   * Crée une gerbe d'acide vert corrosif sous pression (Xenomorph Queen / Predalien).
   */
  createAcidBloodSplash(position, direction = new THREE.Vector3(0, 1, 0), dropletCount = 28) {
    const group = new THREE.Group();
    const acidMat = new THREE.MeshBasicMaterial({ color: 0x00ff44 });
    const geo = new THREE.SphereGeometry(0.18, 8, 8);

    const particles = [];
    for (let i = 0; i < dropletCount; i++) {
      const p = new THREE.Mesh(geo, acidMat);
      p.position.copy(position);
      const vel = direction.clone().add(new THREE.Vector3(
        (Math.random() - 0.5) * 1.8,
        Math.random() * 1.2,
        (Math.random() - 0.5) * 1.8
      )).normalize().multiplyScalar(4.0 + Math.random() * 8.0);

      group.add(p);
      particles.push({ mesh: p, velocity: vel, life: 1.0 });
    }

    if (this.scene) this.scene.add(group);
    this.activeEmitters.push({ group, particles, type: 'ACID_SPLASH' });
    return group;
  }

  /**
   * Crée une projection de sang bioluminescent vert ou violet sombre lors des blessures lourdes.
   */
  createBioluminescentBloodSpray(position, colorHex = 0x00ff66, count = 24) {
    const group = new THREE.Group();
    const bloodMat = new THREE.MeshBasicMaterial({ color: colorHex });
    const geo = new THREE.SphereGeometry(0.14, 6, 6);

    const particles = [];
    for (let i = 0; i < count; i++) {
      const p = new THREE.Mesh(geo, bloodMat);
      p.position.copy(position);
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 2.2,
        Math.random() * 2.0 + 0.5,
        (Math.random() - 0.5) * 2.2
      ).multiplyScalar(3.5);

      group.add(p);
      particles.push({ mesh: p, velocity: vel, life: 0.85 });
    }

    if (this.scene) this.scene.add(group);
    this.activeEmitters.push({ group, particles, type: 'BLOOD_SPRAY' });
    return group;
  }

  /**
   * Onde de choc circulaire de poussière au sol lors des pas lourds ou du topple de bêtes géantes.
   */
  createDustShockwave(position, initialRadius = 1.0, maxRadius = 9.0) {
    const ringGeo = new THREE.RingGeometry(initialRadius, initialRadius + 0.6, 24);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x9e8e72,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });

    const shockwaveMesh = new THREE.Mesh(ringGeo, ringMat);
    shockwaveMesh.position.copy(position);
    shockwaveMesh.position.y = 0.15;

    if (this.scene) this.scene.add(shockwaveMesh);
    this.activeEmitters.push({
      mesh: shockwaveMesh,
      radius: initialRadius,
      maxRadius,
      life: 0.65,
      type: 'SHOCKWAVE'
    });

    return shockwaveMesh;
  }

  /**
   * Éclats d'os et étincelles dorées lors du bris de carapace ou de corne.
   */
  createCarapaceShatterSparks(position, shardCount = 20) {
    const group = new THREE.Group();
    const shardMat = new THREE.MeshStandardMaterial({ color: 0xd4b886, roughness: 0.3 });
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });

    const particles = [];
    for (let i = 0; i < shardCount; i++) {
      const isSpark = i % 2 === 0;
      const geo = isSpark ? new THREE.SphereGeometry(0.12, 6, 6) : new THREE.BoxGeometry(0.3, 0.3, 0.3);
      const mesh = new THREE.Mesh(geo, isSpark ? sparkMat : shardMat);
      mesh.position.copy(position);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 3.0,
        Math.random() * 2.5 + 1.0,
        (Math.random() - 0.5) * 3.0
      ).multiplyScalar(4.0);

      group.add(mesh);
      particles.push({ mesh, velocity: vel, life: 1.1 });
    }

    if (this.scene) this.scene.add(group);
    this.activeEmitters.push({ group, particles, type: 'CARAPACE_SHATTER' });
    return group;
  }

  /**
   * Trace de phéromones / particules bioluminescentes guidant le chasseur vers le monstre.
   */
  createScoutflyGuidanceTrail(startPos, endPos, stepCount = 12) {
    const group = new THREE.Group();
    const moteMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const geo = new THREE.SphereGeometry(0.2, 8, 8);

    for (let i = 0; i <= stepCount; i++) {
      const alpha = i / stepCount;
      const p = new THREE.Mesh(geo, moteMat);
      p.position.lerpVectors(startPos, endPos, alpha);
      p.position.y += Math.sin(alpha * Math.PI) * 2.5 + 0.8;
      group.add(p);
    }

    if (this.scene) this.scene.add(group);
    this.activeEmitters.push({ group, life: 3.5, type: 'GUIDANCE_TRAIL' });
    return group;
  }

  update(delta) {
    for (let i = this.activeEmitters.length - 1; i >= 0; i--) {
      const emitter = this.activeEmitters[i];
      emitter.life -= delta;

      if (emitter.particles) {
        for (const p of emitter.particles) {
          p.velocity.y -= 9.81 * delta; // Gravité
          p.mesh.position.addScaledVector(p.velocity, delta);
          p.mesh.scale.multiplyScalar(Math.max(0.1, 1.0 - delta * 0.8));
        }
      }

      if (emitter.type === 'SHOCKWAVE' && emitter.mesh) {
        emitter.radius += (emitter.maxRadius - emitter.radius) * delta * 5.0;
        emitter.mesh.scale.set(emitter.radius, emitter.radius, 1);
        if (emitter.mesh.material) {
          emitter.mesh.material.opacity = Math.max(0, emitter.life / 0.65);
        }
      }

      if (emitter.life <= 0) {
        if (emitter.group && this.scene) this.scene.remove(emitter.group);
        if (emitter.mesh && this.scene) this.scene.remove(emitter.mesh);
        this.activeEmitters.splice(i, 1);
      }
    }
  }

  dispose() {
    for (const emitter of this.activeEmitters) {
      if (emitter.group && this.scene) this.scene.remove(emitter.group);
      if (emitter.mesh && this.scene) this.scene.remove(emitter.mesh);
    }
    this.activeEmitters = [];
  }
}
