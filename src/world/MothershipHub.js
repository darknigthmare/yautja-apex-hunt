import * as THREE from 'three';

export class MothershipHub {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.animatedProps = [];
    this.trophyDisplays = new Map();
    this.alloyTexture = null;
    this.trophyTexture = null;
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
    }

    this.createShipInterior();
    this.createTrophyVaultWall();
    this.createMissionPedestals();
    this.createArmoryForgeStation();
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
    const wall = new THREE.Mesh(new THREE.BoxGeometry(50, 18, 2), this.createAlloyMaterial(0x202a35));
    wall.position.set(0, 11, -33);
    this.group.add(wall);

    const configs = [
      { huntId: 'goliath', x: -18, color: 0xddccaa },
      { huntId: 'xeno_queen', x: -6, color: 0x1e3428 },
      { huntId: 'bad_blood', x: 6, color: 0x651515 },
      { huntId: 'predalien', x: 18, color: 0xb00045 },
    ];

    configs.forEach(({ huntId, x, color }) => {
      const plaque = new THREE.Mesh(new THREE.BoxGeometry(7, 7, 1), this.createAlloyMaterial(0x313b46));
      plaque.position.set(x, 13, -31.8);
      this.group.add(plaque);

      const material = new THREE.MeshStandardMaterial({
        color,
        map: this.trophyTexture,
        emissive: 0x000000,
        roughness: 0.72,
        metalness: 0.05,
        transparent: true,
        opacity: 0.28,
        wireframe: true,
      });
      const trophy = new THREE.Mesh(new THREE.IcosahedronGeometry(2, 1), material);
      trophy.position.set(x, 13, -30.4);
      this.group.add(trophy);
      this.trophyDisplays.set(huntId, trophy);
    });
  }

  createMissionPedestals() {
    const missions = [
      { huntId: 'goliath', x: -21, color: 0xff3300 },
      { huntId: 'xeno_queen', x: -7, color: 0x00ff66 },
      { huntId: 'bad_blood', x: 7, color: 0x00f0ff },
      { huntId: 'predalien', x: 21, color: 0xff0055 },
    ];

    missions.forEach(({ huntId, x, color }) => {
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

      const hologram = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.2),
        new THREE.MeshBasicMaterial({ color, wireframe: true }),
      );
      hologram.position.set(x, 8, -5);
      this.group.add(hologram);
      this.animatedProps.push({ mesh: hologram, speed: 1.5, huntId });
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
    this.animatedProps.forEach(({ mesh, speed }) => {
      mesh.rotation.y += delta * speed;
    });
  }
}
