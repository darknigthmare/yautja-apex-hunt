import * as THREE from 'three';
import { HUNT_DEFINITIONS } from '../data/GameConfig.js';

export class MothershipHub {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.animatedProps = [];
    this.trophyDisplays = new Map();
    this.animationTime = 0;
    this.alloyTexture = null;
    this.trophyTexture = null;
    this.energyTexture = null;
    this.vehicleDisplays = [];
    if (typeof document !== 'undefined') {
      const textureLoader = new THREE.TextureLoader();
      this.alloyTexture = textureLoader.load(
        '/assets/textures/yautja-alloy.webp',
        undefined,
        undefined,
        () => console.warn('Texture du vaisseau indisponible, fallback métallique conservé.'),
      );
      this.alloyTexture.wrapS = THREE.RepeatWrapping;
      this.alloyTexture.wrapT = THREE.RepeatWrapping;
      this.alloyTexture.repeat.set(6, 6);
      this.alloyTexture.colorSpace = THREE.SRGBColorSpace;
      this.trophyTexture = textureLoader.load(
        '/assets/textures/trophy-bone.webp',
        undefined,
        undefined,
        () => console.warn('Texture des trophées indisponible, fallback coloré conservé.'),
      );
      this.trophyTexture.wrapS = THREE.RepeatWrapping;
      this.trophyTexture.wrapT = THREE.RepeatWrapping;
      this.trophyTexture.repeat.set(2, 2);
      this.trophyTexture.colorSpace = THREE.SRGBColorSpace;
      this.energyTexture = textureLoader.load(
        '/assets/textures/yautja-energy-lattice.webp',
        undefined,
        undefined,
        () => console.warn('Texture énergétique Yautja indisponible, émissif procédural conservé.'),
      );
      this.energyTexture.wrapS = THREE.RepeatWrapping;
      this.energyTexture.wrapT = THREE.RepeatWrapping;
      this.energyTexture.repeat.set(2, 2);
      this.energyTexture.colorSpace = THREE.SRGBColorSpace;
    }

    this.createShipInterior();
    this.createTrophyVaultWall();
    this.createMissionPedestals();
    this.createArmoryForgeStation();
    this.createVehicleHangar();
    this.scene.add(this.group);
  }

  createAlloyMaterial(color = 0x27303a) {
    return new THREE.MeshStandardMaterial({
      color,
      map: this.alloyTexture,
      roughness: 0.38,
      metalness: 0.88,
    });
  }

  createShipInterior() {
    const room = new THREE.Mesh(
      new THREE.BoxGeometry(70, 28, 70),
      new THREE.MeshStandardMaterial({
        color: 0x17202a,
        map: this.alloyTexture,
        roughness: 0.42,
        metalness: 0.86,
        side: THREE.BackSide,
      }),
    );
    room.position.y = 14;
    this.group.add(room);

    for (let i = -3; i <= 3; i += 1) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(60, 0.1, 0.4),
        new THREE.MeshBasicMaterial({ color: i === 0 ? 0xffaa00 : 0xff1100 }),
      );
      line.position.set(0, 0.05, i * 9);
      this.group.add(line);
    }

    const shipLight = new THREE.PointLight(0xff2400, 2.7, 46);
    shipLight.position.set(0, 22, 0);
    this.group.add(shipLight);
    const fillLight = new THREE.PointLight(0x00c8ff, 1.2, 32);
    fillLight.position.set(0, 10, 24);
    this.group.add(fillLight);
  }

  createTrophyVaultWall() {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(62, 18, 2), this.createAlloyMaterial(0x202a35));
    wall.position.set(0, 11, -33);
    this.group.add(wall);

    const definitions = Object.values(HUNT_DEFINITIONS);
    const spacing = 56 / Math.max(1, definitions.length - 1);
    definitions.forEach((definition, index) => {
      const x = (index - (definitions.length - 1) / 2) * spacing;
      const plaque = new THREE.Mesh(new THREE.BoxGeometry(7, 7, 1), this.createAlloyMaterial(0x313b46));
      plaque.position.set(x, 13, -31.8);
      this.group.add(plaque);

      const material = new THREE.MeshStandardMaterial({
        color: definition.trophyColor ?? 0xddccaa,
        map: this.trophyTexture,
        emissive: 0x000000,
        roughness: 0.72,
        metalness: 0.05,
        transparent: true,
        opacity: 0.28,
        wireframe: true,
      });
      const geometry = definition.bossType === 'superPredator'
        ? new THREE.DodecahedronGeometry(2, 0)
        : definition.bossType === 'xenoQueen'
          ? new THREE.ConeGeometry(2.1, 3.2, 8)
          : new THREE.IcosahedronGeometry(2, 1);
      const trophy = new THREE.Mesh(geometry, material);
      trophy.position.set(x, 13, -30.4);
      this.group.add(trophy);
      this.trophyDisplays.set(definition.id, trophy);
    });
  }

  createMissionPedestals() {
    const colors = [0xff3300, 0x00ff66, 0x00f0ff, 0xff0055, 0xff7a2e, 0xffc65a, 0x67e8f9, 0x9d5cff];
    const definitions = Object.values(HUNT_DEFINITIONS);
    const spacing = 54 / Math.max(1, definitions.length - 1);

    definitions.forEach((definition, index) => {
      const x = (index - (definitions.length - 1) / 2) * spacing;
      const color = colors[index % colors.length];
      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(2.5, 3, 4, 8),
        this.createAlloyMaterial(0x27313c),
      );
      pedestal.position.set(x, 2, -5);
      this.group.add(pedestal);

      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(2.2, 2.2, 8, 16, 1, true),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.28, side: THREE.DoubleSide }),
      );
      beam.position.set(x, 8, -5);
      this.group.add(beam);

      const geometry = definition.bossType === 'superPredator'
        ? new THREE.DodecahedronGeometry(1.25, 0)
        : new THREE.OctahedronGeometry(1.2);
      const hologram = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color, wireframe: true }));
      hologram.position.set(x, 8, -5);
      this.group.add(hologram);
      this.animatedProps.push({ mesh: hologram, speed: 1.5, huntId: definition.id });
    });
  }

  createArmoryForgeStation() {
    const station = new THREE.Mesh(new THREE.BoxGeometry(10, 4, 6), this.createAlloyMaterial(0x4a1914));
    station.position.set(22, 2, 18);
    this.group.add(station);

    const forgeLight = new THREE.PointLight(0xffaa00, 3, 15);
    forgeLight.position.set(22, 6, 18);
    this.group.add(forgeLight);

    const anvil = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.5),
      new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true }),
    );
    anvil.position.set(22, 5.5, 18);
    this.group.add(anvil);
    this.animatedProps.push({ mesh: anvil, speed: 1.15, huntId: 'forge' });
  }

  createVehicleHangar() {
    const deck = new THREE.Mesh(new THREE.BoxGeometry(24, 1, 13), this.createAlloyMaterial(0x202a35));
    deck.position.set(-21, 0.5, 20);
    this.group.add(deck);

    const energyMat = new THREE.MeshStandardMaterial({
      color: 0x39464d,
      map: this.energyTexture,
      emissive: 0x073e4a,
      emissiveIntensity: 0.8,
      metalness: 0.86,
      roughness: 0.32,
    });
    const hullMat = this.createAlloyMaterial(0x303840);

    const buildCraft = (x, z, scale, kind) => {
      const craft = new THREE.Group();
      const hull = new THREE.Mesh(
        kind === 'pod' ? new THREE.CapsuleGeometry(1.1, 2.2, 6, 12) : new THREE.ConeGeometry(2.2, 6.2, 5),
        hullMat,
      );
      hull.rotation.x = kind === 'pod' ? Math.PI / 2 : -Math.PI / 2;
      craft.add(hull);

      if (kind !== 'pod') {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.2, 1.5), hullMat);
        wing.position.z = -0.3;
        craft.add(wing);
      }
      for (const engineX of [-1, 1]) {
        const engine = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.52, 1.2, 10), energyMat);
        engine.rotation.x = Math.PI / 2;
        engine.position.set(engineX * (kind === 'pod' ? 0.55 : 1.55), 0, -2.5);
        craft.add(engine);
      }

      craft.position.set(x, 3.4, z);
      craft.scale.setScalar(scale);
      this.group.add(craft);
      this.vehicleDisplays.push(craft);
      this.animatedProps.push({
        mesh: craft,
        speed: kind === 'pod' ? 0.22 : 0.12,
        bob: true,
        baseY: craft.position.y,
        phase: Math.abs(x) * 0.17,
      });
    };

    buildCraft(-26, 20, 0.72, 'scout');
    buildCraft(-17, 20, 0.58, 'shuttle');
    buildCraft(-21, 26, 0.65, 'pod');
  }

  setTrophyState(completedHunts = []) {
    const completed = new Set(completedHunts);
    this.trophyDisplays.forEach((mesh, huntId) => {
      const unlocked = completed.has(huntId);
      mesh.material.opacity = unlocked ? 1 : 0.28;
      mesh.material.wireframe = !unlocked;
      mesh.material.emissive.setHex(unlocked ? 0x2a1100 : 0x000000);
      mesh.scale.setScalar(unlocked ? 1 : 0.78);
    });
  }

  setVisible(visible) {
    this.group.visible = visible;
  }

  update(delta, reducedMotion = false) {
    if (!this.group.visible || reducedMotion) return;
    this.animationTime += delta;
    this.animatedProps.forEach(({ mesh, speed, bob, baseY = mesh.position.y, phase = 0 }) => {
      mesh.rotation.y += delta * speed;
      if (bob) {
        mesh.position.y = baseY + Math.sin((this.animationTime * 1.5) + phase) * 0.08;
      }
    });
  }
}
