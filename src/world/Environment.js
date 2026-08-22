import * as THREE from 'three';
import { BIOME_DEFINITIONS } from '../data/GameConfig.js';

export const DEATHWORLD_FLORA_TEXTURE_PATH = '/assets/textures/deathworld-alien-flora.webp';

const BIOME_STYLE = Object.freeze({
  jungle: { background: 0x050810, fog: 0.0035, ambient: 0x1a2536, key: 0x00d0ff, sun: 0x44d0ff, ground: 0x18202b },
  hive_lv426: { background: 0x020a05, fog: 0.007, ambient: 0x003311, key: 0x00ff44, sun: 0x00ff44, ground: 0x101912 },
  ryushi_desert: { background: 0x221105, fog: 0.008, ambient: 0x442200, key: 0xffaa00, sun: 0xffaa00, ground: 0x5a3518 },
  yautja_prime: { background: 0x200505, fog: 0.003, ambient: 0x441111, key: 0xff2200, sun: 0xff0000, ground: 0x341717 },
  genna_deathworld: { background: 0x08070d, fog: 0.0052, ambient: 0x26301d, key: 0xc8ff68, sun: 0xff7a2a, ground: 0x33251c },
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
    this.deathworldFlora = [];
    this.deathworldCreatures = [];
    this.deathworldCreatureMesh = null;
    this.deathworldCreatureDummy = new THREE.Object3D();
    this.deathworldAnimationTime = 0;
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
    this.biomeGroup.clear();
    this.pillars = [];
    this.treePerches = [];
    this.runes = [];
    this.obstacleColliders = [];
    this.thermalFootprints = [];
    this.particles = null;
    this.rainParticles = null;
    this.sandParticles = null;
    this.deathworldFlora = [];
    this.deathworldCreatures = [];
    this.deathworldCreatureMesh = null;
    this.deathworldAnimationTime = 0;
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
    } else if (this.currentBiome === 'genna_deathworld') {
      this.createGennaDeathworld();
      this.createDriftingParticles(0xbaff69, 520);
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

    for (let i = 0; i < 28; i += 1) {
      const phase = i * 1.731;
      const angle = (i / 28) * Math.PI * 2 + Math.sin(phase) * 0.18;
      const radius = 56 + ((i * 67) % 198);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const heightScale = 0.78 + (i % 6) * 0.095;
      const stalkHeight = 12 * heightScale;
      const group = new THREE.Group();
      group.name = 'genna-hostile-flora-' + (i + 1);
      group.userData.hostileFlora = true;
      group.position.set(x, 0, z);
      group.rotation.y = phase * 0.37;

      const stalk = new THREE.Mesh(stalkGeometry, stalkMaterial);
      stalk.scale.set(0.82 + (i % 3) * 0.12, heightScale, 0.82 + ((i + 1) % 3) * 0.1);
      stalk.position.y = stalkHeight * 0.5;
      stalk.castShadow = true;
      stalk.receiveShadow = true;
      group.add(stalk);

      const crown = new THREE.Mesh(crownGeometry, crownMaterial);
      crown.position.y = stalkHeight + 2.7;
      crown.rotation.z = Math.PI;
      crown.scale.set(0.82 + (i % 4) * 0.08, 0.72 + (i % 3) * 0.08, 0.82 + (i % 4) * 0.08);
      crown.castShadow = true;
      group.add(crown);

      const throat = new THREE.Mesh(throatGeometry, throatMaterial);
      throat.position.y = stalkHeight + 3.9;
      throat.scale.set(1.12, 0.42, 1.12);
      group.add(throat);

      for (let tendrilIndex = 0; tendrilIndex < 3; tendrilIndex += 1) {
        const tendrilAngle = (tendrilIndex / 3) * Math.PI * 2;
        const tendril = new THREE.Mesh(tendrilGeometry, crownMaterial);
        tendril.position.set(
          Math.cos(tendrilAngle) * 2.2,
          3.2 + (i % 2) * 0.45,
          Math.sin(tendrilAngle) * 2.2,
        );
        tendril.rotation.set(Math.sin(tendrilAngle) * 0.7, -tendrilAngle, Math.cos(tendrilAngle) * 0.7);
        tendril.castShadow = true;
        group.add(tendril);
      }

      this.biomeGroup.add(group);
      this.deathworldFlora.push({
        group,
        crown,
        throat,
        phase,
        swaySpeed: 0.48 + (i % 5) * 0.055,
        baseCrownRotation: crown.rotation.y,
      });
      this.treePerches.push(new THREE.Vector3(x, stalkHeight + 6.4, z));
      this.obstacleColliders.push({
        x,
        z,
        radius: 3.4 + (i % 4) * 0.32,
        type: 'hostile_flora',
      });
    }

    this.createDeathworldCreatureSwarm();
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
    if (this.deathworldCreatureMesh) this.deathworldCreatureMesh.visible = !this.reducedMotion;
  }

  update(delta, visionMode) {
    const frameDelta = Number.isFinite(delta) ? Math.max(0, delta) : 0;
    this.updateThermalFootprints(frameDelta, visionMode);
    if (this.reducedMotion) return;
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
  }
}
