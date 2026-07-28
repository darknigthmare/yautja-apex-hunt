import * as THREE from 'three';

export class MothershipHub {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.trophies = [];

    this.createShipInterior();
    this.createTrophyVaultWall();
    this.createMissionPedestals();
    this.createArmoryForgeStation();

    this.scene.add(this.group);
    this.group.visible = true;
  }

  createShipInterior() {
    const roomGeo = new THREE.BoxGeometry(70, 28, 70);
    const roomMat = new THREE.MeshStandardMaterial({
      color: 0x0a0f16,
      roughness: 0.4,
      metalness: 0.9,
      side: THREE.BackSide
    });

    const room = new THREE.Mesh(roomGeo, roomMat);
    room.position.y = 14;
    this.group.add(room);

    for (let i = -3; i <= 3; i++) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(60, 0.1, 0.4),
        new THREE.MeshBasicMaterial({ color: 0xff1100 })
      );
      line.position.set(0, 0.05, i * 9);
      this.group.add(line);
    }

    const shipLight = new THREE.PointLight(0xff1100, 2.5, 45);
    shipLight.position.set(0, 22, 0);
    this.group.add(shipLight);
  }

  createTrophyVaultWall() {
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x151a24, metalness: 0.8 });
    const wall = new THREE.Mesh(new THREE.BoxGeometry(50, 18, 2), wallMat);
    wall.position.set(0, 11, -33);
    this.group.add(wall);

    // 4 Trophy Plaques: Goliath, Queen, Bad Blood, Predalien
    const trophiesConfig = [
      { x: -18, col: 0xddccaa, label: "Goliath" },
      { x: -6, col: 0x111622, label: "Queen" },
      { x: 6, col: 0x441111, label: "Bad Blood" },
      { x: 18, col: 0xff0055, label: "Predalien" }
    ];

    trophiesConfig.forEach(t => {
      const plaque = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 1), new THREE.MeshStandardMaterial({ color: 0x222a36 }));
      plaque.position.set(t.x, 13, -31.8);
      this.group.add(plaque);

      const head = new THREE.Mesh(new THREE.SphereGeometry(1.8), new THREE.MeshStandardMaterial({ color: t.col }));
      head.position.set(t.x, 13, -30.5);
      this.group.add(head);
    });
  }

  createMissionPedestals() {
    const missions = [
      { name: "1. GOLIATH XENO-AKUMO", x: -21, col: 0xff3300, huntId: 'goliath' },
      { name: "2. REINE XÉNOMORPHE", x: -7, col: 0x00ff66, huntId: 'xeno_queen' },
      { name: "3. YAUTJA BAD BLOOD", x: 7, col: 0x00f0ff, huntId: 'bad_blood' },
      { name: "4. PREDALIEN LÉGENDAIRE", x: 21, col: 0xff0055, huntId: 'predalien' }
    ];

    missions.forEach(m => {
      const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 3.0, 4, 8), new THREE.MeshStandardMaterial({ color: 0x1c2330 }));
      pedestal.position.set(m.x, 2, -5);
      this.group.add(pedestal);

      const beam = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 8, 16, 1, true), new THREE.MeshBasicMaterial({ color: m.col, transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
      beam.position.set(m.x, 8, -5);
      this.group.add(beam);

      const holo = new THREE.Mesh(new THREE.OctahedronGeometry(1.2), new THREE.MeshBasicMaterial({ color: m.col, wireframe: true }));
      holo.position.set(m.x, 8, -5);
      this.group.add(holo);

      this.trophies.push({ mesh: holo, huntId: m.huntId });
    });
  }

  createArmoryForgeStation() {
    // 3D Yautja Weapon Forge Pedestal on Front Right
    const forgePedestal = new THREE.Mesh(new THREE.BoxGeometry(10, 4, 6), new THREE.MeshStandardMaterial({ color: 0x331111, metalness: 0.9 }));
    forgePedestal.position.set(22, 2, 18);
    this.group.add(forgePedestal);

    const forgeLight = new THREE.PointLight(0xffaa00, 3, 15);
    forgeLight.position.set(22, 6, 18);
    this.group.add(forgeLight);

    const anvilShape = new THREE.Mesh(new THREE.OctahedronGeometry(1.5), new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true }));
    anvilShape.position.set(22, 5.5, 18);
    this.group.add(anvilShape);
    this.trophies.push({ mesh: anvilShape, huntId: 'forge' });
  }

  setVisible(visible) {
    this.group.visible = visible;
  }

  update(delta) {
    if (!this.group.visible) return;
    this.trophies.forEach(t => {
      t.mesh.rotation.y += delta * 1.5;
    });
  }
}
