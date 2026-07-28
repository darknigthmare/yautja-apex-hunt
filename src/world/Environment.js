import * as THREE from 'three';

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.currentBiome = 'jungle';

    this.pillars = [];
    this.treePerches = [];
    this.runes = [];
    this.particles = null;

    // Obstacle Colliders Array [{ x, z, radius }]
    this.obstacleColliders = [];

    // Thermal Heat Footprint System
    this.thermalFootprints = [];

    this.acidRainActive = false;
    this.sandstormActive = false;
    this.rainParticles = null;
    this.sandParticles = null;

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
    this.mainLight.shadow.mapSize.width = 2048;
    this.mainLight.shadow.mapSize.height = 2048;
    this.scene.add(this.mainLight);

    this.sunSphere = new THREE.Mesh(
      new THREE.SphereGeometry(25, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x44d0ff })
    );
    this.sunSphere.position.set(200, 300, -200);
    this.scene.add(this.sunSphere);
  }

  setBiome(biomeType) {
    this.currentBiome = biomeType;
    
    while (this.biomeGroup.children.length > 0) {
      this.biomeGroup.remove(this.biomeGroup.children[0]);
    }
    this.treePerches = [];
    this.pillars = [];
    this.runes = [];
    this.obstacleColliders = [];

    if (biomeType === 'jungle') {
      this.scene.background = new THREE.Color(0x050810);
      this.scene.fog = new THREE.FogExp2(0x050810, 0.0035);
      this.ambientLight.color.setHex(0x1a2536);
      this.mainLight.color.setHex(0x00d0ff);
      this.sunSphere.material.color.setHex(0x44d0ff);

      this.createTerrain(0x111622);
      this.createAncientRuins();
      this.createAlienFoliage();
      this.createDriftingParticles(0x00f0ff);
      this.toggleAcidRain(false);
      this.toggleSandstorm(false);
    }
    else if (biomeType === 'hive_lv426') {
      this.scene.background = new THREE.Color(0x020a05);
      this.scene.fog = new THREE.FogExp2(0x020a05, 0.007);
      this.ambientLight.color.setHex(0x003311);
      this.mainLight.color.setHex(0x00ff44);
      this.sunSphere.material.color.setHex(0x00ff44);

      this.createTerrain(0x0a140d);
      this.createHiveResinPillars();
      this.createDriftingParticles(0x00ff44);
      this.toggleAcidRain(true);
      this.toggleSandstorm(false);
    }
    else if (biomeType === 'ryushi_desert') {
      this.scene.background = new THREE.Color(0x221105);
      this.scene.fog = new THREE.FogExp2(0x221105, 0.008);
      this.ambientLight.color.setHex(0x442200);
      this.mainLight.color.setHex(0xffaa00);
      this.sunSphere.material.color.setHex(0xffaa00);

      this.createTerrain(0x3a2211);
      this.createDesertDunes();
      this.toggleAcidRain(false);
      this.toggleSandstorm(true);
    }
    else if (biomeType === 'yautja_prime') {
      this.scene.background = new THREE.Color(0x200505);
      this.scene.fog = new THREE.FogExp2(0x200505, 0.003);
      this.ambientLight.color.setHex(0x441111);
      this.mainLight.color.setHex(0xff2200);
      this.sunSphere.material.color.setHex(0xff0000);

      this.createTerrain(0x221111);
      this.createColosseumPillars();
      this.createDriftingParticles(0xff3300);
      this.toggleAcidRain(false);
      this.toggleSandstorm(false);
    }
  }

  // Giant 800x800 Arena Terrain with Surrounding Boundary Cliff Walls!
  createTerrain(colorHex) {
    const groundGeo = new THREE.PlaneGeometry(800, 800, 128, 128);
    const posAttr = groundGeo.attributes.position;

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      let height = Math.sin(x * 0.03) * Math.cos(y * 0.03) * 4;

      // Surrounding High Mountain Cliff Arena Boundary
      if (dist > 330) {
        height += Math.pow(dist - 330, 1.4) * 0.5;
      }
      posAttr.setZ(i, height);
    }
    groundGeo.computeVertexNormals();

    const ground = new THREE.Mesh(
      groundGeo,
      new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.85 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.biomeGroup.add(ground);
  }

  createAncientRuins() {
    const altar = new THREE.Mesh(
      new THREE.CylinderGeometry(14, 18, 4, 12),
      new THREE.MeshStandardMaterial({ color: 0x1f2430 })
    );
    altar.position.set(0, 2, 0);
    this.biomeGroup.add(altar);
    this.obstacleColliders.push({ x: 0, z: 0, radius: 16.0 });

    const runeMat = new THREE.MeshBasicMaterial({ color: 0xff1100, side: THREE.DoubleSide });
    const rune = new THREE.Mesh(new THREE.RingGeometry(4, 8, 8), runeMat);
    rune.rotation.x = -Math.PI / 2;
    rune.position.set(0, 4.02, 0);
    this.biomeGroup.add(rune);
    this.runes.push(rune);

    const pillarPositions = [
      [60, 0, 60], [-60, 0, 60], [60, 0, -60], [-60, 0, -60],
      [120, 0, 0], [-120, 0, 0], [0, 0, 120], [0, 0, -120],
      [180, 0, 180], [-180, 0, 180], [180, 0, -180], [-180, 0, -180]
    ];

    pillarPositions.forEach(([x, y, z]) => {
      const pillarGroup = new THREE.Group();
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(7, 45, 7), new THREE.MeshStandardMaterial({ color: 0x1f2430 }));
      pillar.position.y = 22.5;
      pillarGroup.add(pillar);

      const torch = new THREE.Mesh(new THREE.OctahedronGeometry(2.0), new THREE.MeshBasicMaterial({ color: 0x00ff66 }));
      torch.position.set(0, 46, 0);
      pillarGroup.add(torch);

      pillarGroup.position.set(x, 0, z);
      this.biomeGroup.add(pillarGroup);
      this.pillars.push(pillarGroup);
      this.treePerches.push(new THREE.Vector3(x, 45, z));
      this.obstacleColliders.push({ x, z, radius: 5.0 });
    });
  }

  createAlienFoliage() {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x15121e });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x003344 });

    for (let i = 0; i < 45; i++) {
      const angle = (i / 45) * Math.PI * 2;
      const radius = 80 + Math.random() * 180;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const treeGroup = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 4.5, 36, 8), trunkMat);
      trunk.position.y = 18;
      treeGroup.add(trunk);

      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(14), foliageMat);
      crown.position.y = 36;
      treeGroup.add(crown);

      treeGroup.position.set(x, 0, z);
      this.biomeGroup.add(treeGroup);
      this.treePerches.push(new THREE.Vector3(x, 36, z));
      this.obstacleColliders.push({ x, z, radius: 4.5 });
    }
  }

  createHiveResinPillars() {
    const resinMat = new THREE.MeshStandardMaterial({ color: 0x0c1a10, roughness: 0.2, metalness: 0.8 });
    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * 450;
      const z = (Math.random() - 0.5) * 450;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 7.0, 40, 8), resinMat);
      pillar.position.set(x, 20, z);
      this.biomeGroup.add(pillar);
      this.treePerches.push(new THREE.Vector3(x, 40, z));
      this.obstacleColliders.push({ x, z, radius: 5.5 });
    }
  }

  createDesertDunes() {
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x553311, roughness: 0.9 });
    for (let i = 0; i < 25; i++) {
      const x = (Math.random() - 0.5) * 450;
      const z = (Math.random() - 0.5) * 450;
      const duneRock = new THREE.Mesh(new THREE.DodecahedronGeometry(12 + Math.random() * 8), rockMat);
      duneRock.position.set(x, 8, z);
      this.biomeGroup.add(duneRock);
      this.obstacleColliders.push({ x, z, radius: 12.0 });
    }
  }

  createColosseumPillars() {
    const colMat = new THREE.MeshStandardMaterial({ color: 0x441111, metalness: 0.7 });
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 160;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const col = new THREE.Mesh(new THREE.BoxGeometry(10, 50, 10), colMat);
      col.position.set(x, 25, z);
      this.biomeGroup.add(col);
      this.treePerches.push(new THREE.Vector3(x, 50, z));
      this.obstacleColliders.push({ x, z, radius: 7.0 });
    }
  }

  // Thermal Heat Footprint System
  addThermalFootprint(position) {
    const printGeo = new THREE.RingGeometry(1.2, 2.4, 8);
    const printMat = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
    const print = new THREE.Mesh(printGeo, printMat);

    print.rotation.x = -Math.PI / 2;
    print.position.copy(position).add(new THREE.Vector3(0, 0.08, 0));

    this.thermalFootprints.push({ mesh: print, lifetime: 8.0 });
    this.biomeGroup.add(print);

    if (this.thermalFootprints.length > 30) {
      const oldest = this.thermalFootprints.shift();
      this.biomeGroup.remove(oldest.mesh);
    }
  }

  updateThermalFootprints(delta, visionMode) {
    for (let i = this.thermalFootprints.length - 1; i >= 0; i--) {
      const f = this.thermalFootprints[i];
      f.lifetime -= delta;

      f.mesh.visible = (visionMode === 'thermal');

      const alpha = Math.max(0, f.lifetime / 8.0);
      f.mesh.material.opacity = alpha * 0.85;

      if (f.lifetime <= 0) {
        this.biomeGroup.remove(f.mesh);
        this.thermalFootprints.splice(i, 1);
      }
    }
  }

  createDriftingParticles(colorHex) {
    const count = 700;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 600;
      pos[i + 1] = Math.random() * 80;
      pos[i + 2] = (Math.random() - 0.5) * 600;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.particles = new THREE.Points(geo, new THREE.PointsMaterial({ color: colorHex, size: 0.9, transparent: true, opacity: 0.7 }));
    this.biomeGroup.add(this.particles);
  }

  toggleAcidRain(enable) {
    this.acidRainActive = enable;
    if (enable && !this.rainParticles) {
      const count = 1000;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i += 3) {
        pos[i] = (Math.random() - 0.5) * 500;
        pos[i + 1] = Math.random() * 120;
        pos[i + 2] = (Math.random() - 0.5) * 500;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      this.rainParticles = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x00ff44, size: 1.0, transparent: true }));
      this.biomeGroup.add(this.rainParticles);
    }
    if (this.rainParticles) this.rainParticles.visible = enable;
  }

  toggleSandstorm(enable) {
    this.sandstormActive = enable;
    if (enable && !this.sandParticles) {
      const count = 1500;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i += 3) {
        pos[i] = (Math.random() - 0.5) * 600;
        pos[i + 1] = Math.random() * 90;
        pos[i + 2] = (Math.random() - 0.5) * 600;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      this.sandParticles = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffaa00, size: 1.5, transparent: true, opacity: 0.75 }));
      this.biomeGroup.add(this.sandParticles);
    }
    if (this.sandParticles) this.sandParticles.visible = enable;
  }

  update(delta, visionMode) {
    if (this.particles) this.particles.rotation.y += delta * 0.03;
    if (this.sandstormActive && this.sandParticles) {
      this.sandParticles.rotation.y += delta * 0.2;
    }
    if (this.acidRainActive && this.rainParticles) {
      const pos = this.rainParticles.geometry.attributes.position;
      for (let i = 1; i < pos.count * 3; i += 3) {
        pos.array[i] -= delta * 90.0;
        if (pos.array[i] < 0) pos.array[i] = 120.0;
      }
      pos.needsUpdate = true;
    }
    this.updateThermalFootprints(delta, visionMode);
  }
}
