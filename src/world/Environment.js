import * as THREE from 'three';
import { BIOME_DEFINITIONS } from '../data/GameConfig.js';

const BIOME_STYLE = Object.freeze({
  jungle: { background: 0x050810, fog: 0.0035, ambient: 0x1a2536, key: 0x00d0ff, sun: 0x44d0ff, ground: 0x18202b },
  hive_lv426: { background: 0x020a05, fog: 0.007, ambient: 0x003311, key: 0x00ff44, sun: 0x00ff44, ground: 0x101912 },
  ryushi_desert: { background: 0x221105, fog: 0.008, ambient: 0x442200, key: 0xffaa00, sun: 0xffaa00, ground: 0x5a3518 },
  yautja_prime: { background: 0x200505, fog: 0.003, ambient: 0x441111, key: 0xff2200, sun: 0xff0000, ground: 0x341717 },
});

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.currentBiome = 'jungle';
    this.reducedMotion = false;
    this.pillars = [];
    this.treePerches = [];
    this.runes = [];
    this.obstacleColliders = [];
    this.thermalFootprints = [];
    this.particles = null;
    this.rainParticles = null;
    this.sandParticles = null;
    this.acidRainActive = false;
    this.sandstormActive = false;
    this.textureLoader = new THREE.TextureLoader();
    this.textureCache = new Map();

    this.biomeGroup = new THREE.Group();
    this.scene.add(this.biomeGroup);
    this.createLighting();
    this.setBiome('jungle');
  }

  createLighting() {
    this.ambientLight = new THREE.AmbientLight(0x1a2536, 0.75);
    this.scene.add(this.ambientLight);

    this.mainLight = new THREE.DirectionalLight(0x00d0ff, 0.95);
    this.mainLight.position.set(200, 300, -200);
    this.mainLight.castShadow = true;
    this.mainLight.shadow.mapSize.set(2048, 2048);
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

  createTexturedMaterial({ color, path, repeat = 5, roughness = 0.85, metalness = 0.05 }) {
    return new THREE.MeshStandardMaterial({
      color,
      map: this.getTexture(path, repeat),
      roughness,
      metalness,
    });
  }

  clearBiome() {
    this.biomeGroup.traverse((object) => {
      object.geometry?.dispose();
      if (object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      }
    });
    this.biomeGroup.clear();
    this.pillars = [];
    this.treePerches = [];
    this.runes = [];
    this.obstacleColliders = [];
    this.thermalFootprints = [];
    this.particles = null;
    this.rainParticles = null;
    this.sandParticles = null;
    this.acidRainActive = false;
    this.sandstormActive = false;
  }

  setBiome(biomeType) {
    this.currentBiome = BIOME_DEFINITIONS[biomeType] ? biomeType : 'jungle';
    this.clearBiome();

    const style = BIOME_STYLE[this.currentBiome];
    this.scene.background = new THREE.Color(style.background);
    this.scene.fog = new THREE.FogExp2(style.background, style.fog);
    this.ambientLight.color.setHex(style.ambient);
    this.mainLight.color.setHex(style.key);
    this.sunSphere.material.color.setHex(style.sun);
    this.createTerrain(style.ground);

    if (this.currentBiome === 'jungle') {
      this.createAncientRuins();
      this.createAlienFoliage();
      this.createDriftingParticles(0x00f0ff, 650);
    } else if (this.currentBiome === 'hive_lv426') {
      this.createHiveResinPillars();
      this.createDriftingParticles(0x00ff44, 500);
      this.createAcidRain();
    } else if (this.currentBiome === 'ryushi_desert') {
      this.createDesertDunes();
      this.createSandstorm();
    } else {
      this.createColosseumPillars();
      this.createDriftingParticles(0xff3300, 450);
    }

    this.setReducedMotion(this.reducedMotion);
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
    const altar = new THREE.Mesh(new THREE.CylinderGeometry(14, 18, 4, 12), stone);
    altar.position.set(0, 2, 0);
    altar.receiveShadow = true;
    this.biomeGroup.add(altar);
    this.obstacleColliders.push({ x: 0, z: 0, radius: 16 });

    const rune = new THREE.Mesh(
      new THREE.RingGeometry(4, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xff2100, side: THREE.DoubleSide }),
    );
    rune.rotation.x = -Math.PI / 2;
    rune.position.set(0, 4.02, 0);
    this.biomeGroup.add(rune);
    this.runes.push(rune);

    const positions = [
      [60, 60], [-60, 60], [60, -60], [-60, -60],
      [120, 0], [-120, 0], [0, 120], [0, -120],
      [180, 180], [-180, 180], [180, -180], [-180, -180],
    ];
    positions.forEach(([x, z]) => {
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
      group.position.set(x, 0, z);
      this.biomeGroup.add(group);
      this.pillars.push(group);
      this.treePerches.push(new THREE.Vector3(x, 45, z));
      this.obstacleColliders.push({ x, z, radius: 5 });
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
    for (let i = 0; i < 45; i += 1) {
      const angle = (i / 45) * Math.PI * 2 + Math.sin(i * 4.17) * 0.14;
      const radius = 82 + ((i * 47) % 175);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const group = new THREE.Group();
      const trunkMesh = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 4.5, 36, 9), trunk);
      trunkMesh.position.y = 18;
      trunkMesh.castShadow = true;
      group.add(trunkMesh);
      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(14), foliage);
      crown.position.y = 36;
      crown.castShadow = true;
      group.add(crown);
      group.position.set(x, 0, z);
      this.biomeGroup.add(group);
      this.treePerches.push(new THREE.Vector3(x, 36, z));
      this.obstacleColliders.push({ x, z, radius: 4.5 });
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
    for (let i = 0; i < 30; i += 1) {
      const angle = (i / 30) * Math.PI * 2;
      const radius = 70 + ((i * 61) % 170);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 7, 40, 10), resin);
      pillar.position.set(x, 20, z);
      pillar.castShadow = true;
      this.biomeGroup.add(pillar);
      this.treePerches.push(new THREE.Vector3(x, 40, z));
      this.obstacleColliders.push({ x, z, radius: 5.5 });
    }
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
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(12 + (i % 4) * 2.5), rock);
      mesh.position.set(x, 8, z);
      mesh.castShadow = true;
      this.biomeGroup.add(mesh);
      this.obstacleColliders.push({ x, z, radius: 12 });
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
    for (let i = 0; i < 20; i += 1) {
      const angle = (i / 20) * Math.PI * 2;
      const x = Math.cos(angle) * 160;
      const z = Math.sin(angle) * 160;
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(10, 50, 10), stone);
      pillar.position.set(x, 25, z);
      pillar.castShadow = true;
      this.biomeGroup.add(pillar);
      this.treePerches.push(new THREE.Vector3(x, 50, z));
      this.obstacleColliders.push({ x, z, radius: 7 });
    }
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
    const particles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0.78 }),
    );
    this.biomeGroup.add(particles);
    return particles;
  }

  createAcidRain() {
    this.acidRainActive = true;
    this.rainParticles = this.createWeatherParticles({ color: 0x00ff44, count: 1000, size: 1 });
  }

  createSandstorm() {
    this.sandstormActive = true;
    this.sandParticles = this.createWeatherParticles({ color: 0xffaa00, count: 1500, size: 1.5 });
  }

  setVisible(visible) {
    const isVisible = Boolean(visible);
    this.biomeGroup.visible = isVisible;
    this.sunSphere.visible = isVisible;
    this.ambientLight.visible = isVisible;
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
    if (this.rainParticles) this.rainParticles.visible = !this.reducedMotion;
    if (this.sandParticles) this.sandParticles.visible = !this.reducedMotion;
  }

  update(delta, visionMode) {
    this.updateThermalFootprints(delta, visionMode);
    if (this.reducedMotion) return;
    if (this.particles) this.particles.rotation.y += delta * 0.03;
    if (this.sandParticles) this.sandParticles.rotation.y += delta * 0.2;
    if (this.rainParticles) {
      const positions = this.rainParticles.geometry.attributes.position;
      for (let i = 1; i < positions.array.length; i += 3) {
        positions.array[i] -= delta * 90;
        if (positions.array[i] < 0) positions.array[i] = 120;
      }
      positions.needsUpdate = true;
    }
  }
}
