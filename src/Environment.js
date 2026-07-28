import * as THREE from 'three';

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.pillars = [];
    this.treePerches = [];
    this.runes = [];
    this.particles = null;

    // Acid Rain Weather
    this.acidRainActive = false;
    this.rainParticles = null;

    this.createSkyAndLighting();
    this.createTerrain();
    this.createAncientRuins();
    this.createAlienFoliage();
    this.createDriftingParticles();
    this.createAcidRainSystem();
  }

  createSkyAndLighting() {
    this.scene.background = new THREE.Color(0x050810);
    this.scene.fog = new THREE.FogExp2(0x050810, 0.008);

    const ambientLight = new THREE.AmbientLight(0x1a2536, 0.7);
    this.scene.add(ambientLight);

    const moon1Light = new THREE.DirectionalLight(0x00d0ff, 0.8);
    moon1Light.position.set(100, 150, -100);
    moon1Light.castShadow = true;
    this.scene.add(moon1Light);

    const moon1Geo = new THREE.SphereGeometry(15, 32, 32);
    const moon1Mat = new THREE.MeshBasicMaterial({ color: 0x44d0ff });
    const moon1 = new THREE.Mesh(moon1Geo, moon1Mat);
    moon1.position.set(100, 150, -100);
    this.scene.add(moon1);

    const moon2Light = new THREE.DirectionalLight(0xff3300, 0.5);
    moon2Light.position.set(-120, 100, 80);
    this.scene.add(moon2Light);

    const moon2Geo = new THREE.SphereGeometry(10, 32, 32);
    const moon2Mat = new THREE.MeshBasicMaterial({ color: 0xff3300 });
    const moon2 = new THREE.Mesh(moon2Geo, moon2Mat);
    moon2.position.set(-120, 100, 80);
    this.scene.add(moon2);
  }

  createTerrain() {
    const groundGeo = new THREE.PlaneGeometry(300, 300, 64, 64);
    const posAttr = groundGeo.attributes.position;

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      let height = Math.sin(x * 0.05) * Math.cos(y * 0.05) * 2;
      if (dist > 110) height += (dist - 110) * 0.3;
      posAttr.setZ(i, height);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      roughness: 0.8,
      metalness: 0.2
    });

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  createAncientRuins() {
    const altarGeo = new THREE.CylinderGeometry(8, 10, 2, 8);
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x1f2430, roughness: 0.7 });
    const altar = new THREE.Mesh(altarGeo, stoneMat);
    altar.position.set(0, 1, 0);
    this.scene.add(altar);

    const runeGeo = new THREE.RingGeometry(2, 4, 6);
    const runeMat = new THREE.MeshBasicMaterial({ color: 0xff1100, side: THREE.DoubleSide });
    const rune = new THREE.Mesh(runeGeo, runeMat);
    rune.rotation.x = -Math.PI / 2;
    rune.position.set(0, 2.02, 0);
    this.scene.add(rune);
    this.runes.push(rune);

    const pillarPositions = [
      [30, 0, 30], [-30, 0, 30], [30, 0, -30], [-30, 0, -30],
      [60, 0, 0], [-60, 0, 0], [0, 0, 60], [0, 0, -60]
    ];

    pillarPositions.forEach(([x, y, z]) => {
      const pillarGroup = new THREE.Group();
      
      const pGeo = new THREE.BoxGeometry(4, 30, 4);
      const pillar = new THREE.Mesh(pGeo, stoneMat);
      pillar.position.y = 15;
      pillar.castShadow = true;
      pillarGroup.add(pillar);

      const torchGeo = new THREE.OctahedronGeometry(1.2);
      const torchMat = new THREE.MeshBasicMaterial({ color: 0x00ff66 });
      const torch = new THREE.Mesh(torchGeo, torchMat);
      torch.position.set(0, 31, 0);
      pillarGroup.add(torch);

      pillarGroup.position.set(x, 0, z);
      this.scene.add(pillarGroup);
      this.pillars.push(pillarGroup);

      // Register top of pillar as a Canopy Perch Node!
      this.treePerches.push(new THREE.Vector3(x, 30, z));
    });
  }

  createAlienFoliage() {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x15121e, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x003344, roughness: 0.4 });

    for (let i = 0; i < 25; i++) {
      const angle = (i / 25) * Math.PI * 2 + Math.random() * 0.2;
      const radius = 45 + Math.random() * 50;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const treeGroup = new THREE.Group();
      
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 2.5, 24, 8), trunkMat);
      trunk.position.y = 12;
      treeGroup.add(trunk);

      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(8), foliageMat);
      crown.position.y = 24;
      treeGroup.add(crown);

      treeGroup.position.set(x, 0, z);
      this.scene.add(treeGroup);

      // Register Tree Crown as a Canopy Perch Node!
      this.treePerches.push(new THREE.Vector3(x, 24, z));
    }
  }

  createDriftingParticles() {
    const count = 400;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 250;
      pos[i + 1] = Math.random() * 50;
      pos[i + 2] = (Math.random() - 0.5) * 250;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.6,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  createAcidRainSystem() {
    const rainCount = 800;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 200;
      pos[i + 1] = Math.random() * 80;
      pos[i + 2] = (Math.random() - 0.5) * 200;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x00ff44,
      size: 0.8,
      transparent: true,
      opacity: 0.85
    });

    this.rainParticles = new THREE.Points(geo, mat);
    this.rainParticles.visible = false;
    this.scene.add(this.rainParticles);
  }

  toggleAcidRain(enable) {
    this.acidRainActive = enable;
    if (this.rainParticles) this.rainParticles.visible = enable;
  }

  update(delta) {
    if (this.particles) this.particles.rotation.y += delta * 0.03;

    // Animate falling Acid Rain
    if (this.acidRainActive && this.rainParticles) {
      const pos = this.rainParticles.geometry.attributes.position;
      for (let i = 1; i < pos.count * 3; i += 3) {
        pos.array[i] -= delta * 90.0;
        if (pos.array[i] < 0) pos.array[i] = 80.0;
      }
      pos.needsUpdate = true;
    }
  }
}
