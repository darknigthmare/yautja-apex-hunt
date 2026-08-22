import * as THREE from 'three';

export const HUNT_NPC_TEXTURES = Object.freeze({
  xeno_drone: '/assets/textures/xeno-carapace.webp',
  hunting_hound: '/assets/textures/hunting-hound-hide.webp',
  human_fireteam: '/assets/textures/stargazer-tactical-composite.webp',
  combat_synthetic: '/assets/textures/stargazer-tactical-composite.webp',
  grizzly_territorial: '/assets/textures/hunting-hound-hide.webp',
  thermal_trapper: '/assets/textures/stargazer-tactical-composite.webp',
  genna_stalker: '/assets/textures/deathworld-alien-flora.webp',
  xeno_warrior: '/assets/textures/xeno-carapace.webp',
});

export const HUNT_NPC_ARCHETYPES = Object.freeze({
  xeno_drone: Object.freeze({
    type: 'xeno_drone',
    name: 'Drone xénomorphe',
    health: 120,
    damage: 18,
    speed: 4.4,
    attackRange: 2.8, // Collider joueur 1,8 + drone 0,72 + allonge de morsure.
    colliderRadius: 0.72,
    attackInterval: 1.1,
    damageType: 'corrosion',
    attackKind: 'melee',
  }),
  hunting_hound: Object.freeze({
    type: 'hunting_hound',
    name: 'Molosse de chasse',
    health: 90,
    damage: 14,
    speed: 6.2,
    attackRange: 2.65, // Collider joueur 1,8 + molosse 0,68 + allonge de morsure.
    colliderRadius: 0.68,
    attackInterval: 0.85,
    detectionRange: 11,
    damageType: 'laceration',
    attackKind: 'melee',
  }),
  human_fireteam: Object.freeze({
    type: 'human_fireteam',
    name: "Éclaireur de l'escouade humaine",
    health: 100,
    damage: 9,
    speed: 2.8,
    attackRange: 16,
    colliderRadius: 0.52,
    attackInterval: 1.35,
    damageType: 'ballistic',
    attackKind: 'projectile',
  }),
  combat_synthetic: Object.freeze({
    type: 'combat_synthetic',
    name: 'Synthétique de combat',
    health: 145,
    damage: 12,
    speed: 2.45,
    attackRange: 18,
    colliderRadius: 0.55,
    attackInterval: 1.15,
    damageType: 'energy',
    attackKind: 'projectile',
  }),
});

// Les archétypes historiques restent exportés séparément pour ne pas casser les
// consommateurs qui traitent cette liste comme le contrat de base de la v1.3.
// Le constructeur accepte l'ensemble fusionné ci-dessous.
export const EXPANDED_HUNT_NPC_ARCHETYPES = Object.freeze({
  grizzly_territorial: Object.freeze({
    type: 'grizzly_territorial',
    name: 'Grizzly territorial',
    health: 300,
    damage: 38,
    speed: 3.1,
    attackRange: 3.35,
    colliderRadius: 1.2,
    attackInterval: 2.4,
    damageType: 'impact',
    attackKind: 'charge',
    chargeRange: 13.5,
    chargeMultiplier: 2.75,
    knockback: 10,
  }),
  thermal_trapper: Object.freeze({
    type: 'thermal_trapper',
    name: 'Traqueur thermique de confinement',
    health: 135,
    damage: 10,
    speed: 2.6,
    attackRange: 19,
    colliderRadius: 0.58,
    attackInterval: 1.8,
    damageType: 'disruption',
    attackKind: 'projectile',
    projectileSpeed: 28,
    energyDrain: 18,
    status: 'energy_jam',
    statusDuration: 4,
  }),
  genna_stalker: Object.freeze({
    type: 'genna_stalker',
    name: 'Traqueur organique de Genna',
    health: 170,
    damage: 22,
    speed: 4.1,
    attackRange: 3,
    colliderRadius: 0.88,
    attackInterval: 1.3,
    damageType: 'corrosion',
    attackKind: 'melee',
    status: 'corrosion',
    secondaryStatus: 'venom',
    statusDuration: 5,
  }),
  xeno_warrior: Object.freeze({
    type: 'xeno_warrior',
    name: 'Guerrier xénomorphe',
    health: 230,
    damage: 27,
    speed: 4.2,
    attackRange: 3.15,
    colliderRadius: 0.9,
    attackInterval: 1.15,
    damageType: 'corrosion',
    attackKind: 'melee',
    status: 'corrosion',
    statusDuration: 4,
  }),
});

export const ALL_HUNT_NPC_ARCHETYPES = Object.freeze({
  ...HUNT_NPC_ARCHETYPES,
  ...EXPANDED_HUNT_NPC_ARCHETYPES,
});

const sharedTextureCache = new Map();
const direction = new THREE.Vector3();

function loadSharedTexture(path) {
  if (!path || typeof document === 'undefined') return null;
  if (sharedTextureCache.has(path)) return sharedTextureCache.get(path);

  try {
    const texture = new THREE.TextureLoader().load(path);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    sharedTextureCache.set(path, texture);
    return texture;
  } catch {
    // A procedural material remains available when texture loading is blocked.
    sharedTextureCache.set(path, null);
    return null;
  }
}

function makeMaterial(color, texture, options = {}) {
  const material = new THREE.MeshStandardMaterial({
    color,
    map: texture || null,
    roughness: options.roughness ?? 0.7,
    metalness: options.metalness ?? 0.15,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
  });
  material.userData.baseColor = material.color.getHex();
  material.userData.baseEmissive = material.emissive.getHex();
  material.userData.baseEmissiveIntensity = material.emissiveIntensity;
  return material;
}

function addPart(group, geometry, material, position, scale, rotation) {
  const mesh = new THREE.Mesh(geometry, material);
  if (position) mesh.position.set(...position);
  if (scale) mesh.scale.set(...scale);
  if (rotation) mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function makeXenoDrone(texture) {
  const group = new THREE.Group();
  const carapace = makeMaterial(0x111817, texture, { roughness: 0.34, metalness: 0.35 });
  const teeth = makeMaterial(0xc5bfa8, null, { roughness: 0.45, metalness: 0.7 });

  addPart(group, new THREE.SphereGeometry(0.55, 14, 9), carapace, [0, 1.15, 0], [0.78, 1.2, 0.7]);
  addPart(group, new THREE.SphereGeometry(0.48, 14, 8), carapace, [0, 1.72, 0.34], [0.82, 0.56, 1.28]);
  addPart(group, new THREE.ConeGeometry(0.22, 0.56, 8), teeth, [0, 1.48, 0.88], [1, 1, 1], [Math.PI / 2, 0, 0]);

  for (const side of [-1, 1]) {
    addPart(group, new THREE.CylinderGeometry(0.1, 0.13, 1.08, 7), carapace, [side * 0.48, 0.72, 0.02], null, [0, 0, side * 0.35]);
    addPart(group, new THREE.CylinderGeometry(0.07, 0.1, 0.92, 7), carapace, [side * 0.7, 1.13, 0.22], null, [0.3, 0, side * 0.82]);
  }

  const tail = addPart(group, new THREE.CylinderGeometry(0.035, 0.14, 2.4, 8), carapace, [0, 0.96, -1.08]);
  tail.rotation.x = Math.PI / 2.5;
  group.userData.silhouette = 'xeno_drone';
  return group;
}

function makeHuntingHound(texture) {
  const group = new THREE.Group();
  const hide = makeMaterial(0x4c3929, texture, { roughness: 0.92, metalness: 0.02 });
  const spine = makeMaterial(0x211b16, texture, { roughness: 0.75 });

  addPart(group, new THREE.SphereGeometry(0.62, 12, 8), hide, [0, 0.82, 0], [0.8, 0.62, 1.35]);
  addPart(group, new THREE.ConeGeometry(0.4, 0.85, 7), hide, [0, 0.93, 0.92], null, [Math.PI / 2, 0, 0]);

  for (const x of [-0.38, 0.38]) {
    for (const z of [-0.58, 0.58]) {
      addPart(group, new THREE.CylinderGeometry(0.075, 0.11, 0.8, 7), hide, [x, 0.38, z], null, [0, 0, x * 0.22]);
    }
  }
  for (let i = 0; i < 6; i += 1) {
    addPart(group, new THREE.ConeGeometry(0.08, 0.46, 6), spine, [0, 1.22, -0.55 + i * 0.23], null, [0, 0, Math.PI]);
  }
  const tail = addPart(group, new THREE.CylinderGeometry(0.035, 0.1, 1.25, 7), hide, [0, 0.8, -1.06]);
  tail.rotation.x = Math.PI / 2.15;
  group.userData.silhouette = 'hunting_hound';
  return group;
}

function makeHumanFireteam(texture) {
  const group = new THREE.Group();
  const fatigues = makeMaterial(0x4c5547, texture, { roughness: 0.95 });
  const armor = makeMaterial(0x222a29, texture, { roughness: 0.62, metalness: 0.25 });
  const weapon = makeMaterial(0x171a1c, null, { roughness: 0.4, metalness: 0.7 });

  addPart(group, new THREE.BoxGeometry(0.72, 0.92, 0.4), armor, [0, 1.35, 0]);
  addPart(group, new THREE.SphereGeometry(0.27, 12, 8), armor, [0, 2.04, 0], [1, 0.9, 1]);
  for (const side of [-1, 1]) {
    addPart(group, new THREE.CylinderGeometry(0.09, 0.12, 0.96, 7), fatigues, [side * 0.22, 0.48, 0]);
    addPart(group, new THREE.CylinderGeometry(0.07, 0.1, 0.88, 7), fatigues, [side * 0.52, 1.43, 0.04], null, [0, 0, side * 0.32]);
  }
  addPart(group, new THREE.BoxGeometry(0.16, 0.18, 1.22), weapon, [0.38, 1.45, 0.43], null, [0.08, 0, -0.18]);
  group.userData.silhouette = 'human_fireteam';
  return group;
}

function makeCombatSynthetic(texture) {
  const group = new THREE.Group();
  const shell = makeMaterial(0xd4d8d2, texture, { roughness: 0.38, metalness: 0.58 });
  const chassis = makeMaterial(0x252d34, texture, { roughness: 0.3, metalness: 0.78 });
  const energy = makeMaterial(0x65e8ff, null, {
    roughness: 0.2,
    metalness: 0.25,
    emissive: 0x1b9ab8,
    emissiveIntensity: 1.45,
  });

  addPart(group, new THREE.CylinderGeometry(0.42, 0.5, 0.88, 8), chassis, [0, 1.36, 0]);
  addPart(group, new THREE.BoxGeometry(0.54, 0.34, 0.42), shell, [0, 2.03, 0]);
  addPart(group, new THREE.SphereGeometry(0.16, 10, 7), energy, [0, 1.43, 0.43]);
  for (const side of [-1, 1]) {
    addPart(group, new THREE.CylinderGeometry(0.09, 0.11, 1.02, 8), chassis, [side * 0.25, 0.5, 0]);
    addPart(group, new THREE.CylinderGeometry(0.07, 0.1, 1.02, 8), shell, [side * 0.55, 1.42, 0], null, [0, 0, side * 0.2]);
    addPart(group, new THREE.SphereGeometry(0.16, 10, 7), shell, [side * 0.47, 1.84, 0]);
  }
  addPart(group, new THREE.BoxGeometry(0.13, 0.16, 1.38), chassis, [-0.43, 1.4, 0.48], null, [0, 0, 0.12]);
  group.userData.silhouette = 'combat_synthetic';
  return group;
}

function makeGrizzlyTerritorial(texture) {
  const group = new THREE.Group();
  const hide = makeMaterial(0x4b2d1e, texture, { roughness: 0.98, metalness: 0 });
  const muzzle = makeMaterial(0x281b16, texture, { roughness: 1, metalness: 0 });
  const claws = makeMaterial(0x171310, null, { roughness: 0.45, metalness: 0.32 });

  addPart(group, new THREE.SphereGeometry(0.9, 16, 11), hide, [0, 1.12, 0], [1.05, 0.88, 1.45]);
  addPart(group, new THREE.SphereGeometry(0.74, 14, 10), hide, [0, 1.62, 0.35], [1.15, 1.08, 0.92]);
  addPart(group, new THREE.SphereGeometry(0.55, 14, 9), hide, [0, 1.58, 1.05], [0.92, 0.82, 1.08]);
  addPart(group, new THREE.SphereGeometry(0.33, 12, 8), muzzle, [0, 1.43, 1.49], [1.18, 0.72, 0.82]);
  for (const side of [-1, 1]) {
    addPart(group, new THREE.SphereGeometry(0.18, 9, 7), hide, [side * 0.42, 1.98, 0.94], [0.9, 1, 0.55]);
    for (const z of [-0.55, 0.55]) {
      const fore = z > 0;
      addPart(
        group,
        new THREE.CylinderGeometry(fore ? 0.18 : 0.15, fore ? 0.24 : 0.2, fore ? 1.12 : 0.94, 8),
        hide,
        [side * 0.56, fore ? 0.54 : 0.48, z],
        null,
        [0.06, 0, side * 0.08],
      );
      for (let claw = -1; claw <= 1; claw += 1) {
        addPart(
          group,
          new THREE.ConeGeometry(0.045, 0.32, 6),
          claws,
          [side * 0.56 + claw * 0.07, 0.08, z + 0.18],
          null,
          [Math.PI / 2, 0, 0],
        );
      }
    }
  }
  group.scale.setScalar(1.08);
  group.userData.silhouette = 'grizzly_territorial';
  group.userData.combatRead = 'heavy_charge';
  return group;
}

function makeThermalTrapper(texture) {
  const group = new THREE.Group();
  const tactical = makeMaterial(0x34433e, texture, { roughness: 0.82, metalness: 0.18 });
  const plates = makeMaterial(0x151e22, texture, { roughness: 0.48, metalness: 0.54 });
  const jammer = makeMaterial(0xf38f32, null, {
    roughness: 0.28,
    metalness: 0.45,
    emissive: 0x8a2606,
    emissiveIntensity: 1.35,
  });
  const lens = makeMaterial(0xffca55, null, {
    roughness: 0.15,
    metalness: 0.2,
    emissive: 0xf05a0a,
    emissiveIntensity: 1.8,
  });

  addPart(group, new THREE.BoxGeometry(0.76, 0.98, 0.44), tactical, [0, 1.38, 0]);
  addPart(group, new THREE.BoxGeometry(0.68, 0.52, 0.22), plates, [0, 1.55, 0.28]);
  addPart(group, new THREE.SphereGeometry(0.29, 12, 8), tactical, [0, 2.12, 0]);
  addPart(group, new THREE.BoxGeometry(0.42, 0.11, 0.12), lens, [0, 2.13, 0.27]);
  addPart(group, new THREE.BoxGeometry(0.58, 0.72, 0.28), plates, [0, 1.46, -0.34]);
  addPart(group, new THREE.CylinderGeometry(0.025, 0.035, 0.82, 6), jammer, [0.23, 2.05, -0.39], null, [0, 0, -0.12]);
  addPart(group, new THREE.SphereGeometry(0.065, 8, 6), jammer, [0.28, 2.46, -0.39]);
  for (const side of [-1, 1]) {
    addPart(group, new THREE.CylinderGeometry(0.1, 0.13, 1.06, 7), tactical, [side * 0.23, 0.5, 0]);
    addPart(group, new THREE.CylinderGeometry(0.075, 0.105, 0.92, 7), tactical, [side * 0.54, 1.43, 0.02], null, [0, 0, side * 0.28]);
    addPart(group, new THREE.SphereGeometry(0.18, 9, 7), plates, [side * 0.43, 1.78, 0]);
  }
  addPart(group, new THREE.BoxGeometry(0.15, 0.18, 1.36), plates, [0.43, 1.42, 0.5], null, [0.05, 0, -0.08]);
  addPart(group, new THREE.TorusGeometry(0.22, 0.035, 7, 16), jammer, [0.43, 1.5, 1.08], null, [0, Math.PI / 2, 0]);
  group.userData.silhouette = 'thermal_trapper';
  group.userData.combatRead = 'energy_jammer';
  return group;
}

function makeGennaStalker(texture) {
  const group = new THREE.Group();
  const bark = makeMaterial(0x27382b, texture, { roughness: 0.96, metalness: 0 });
  const thorn = makeMaterial(0x17221a, texture, { roughness: 0.78, metalness: 0.08 });
  const sap = makeMaterial(0x80d33f, null, {
    roughness: 0.32,
    metalness: 0.05,
    emissive: 0x245d0e,
    emissiveIntensity: 1.4,
  });

  addPart(group, new THREE.SphereGeometry(0.72, 13, 9), bark, [0, 0.92, 0], [0.92, 0.72, 1.38]);
  addPart(group, new THREE.SphereGeometry(0.48, 12, 8), bark, [0, 1.12, 0.86], [0.9, 0.78, 1.08]);
  addPart(group, new THREE.SphereGeometry(0.2, 10, 7), sap, [0, 1.08, 1.28], [1.18, 0.82, 0.58]);
  for (let petal = 0; petal < 6; petal += 1) {
    const angle = (petal / 6) * Math.PI * 2;
    addPart(
      group,
      new THREE.ConeGeometry(0.15, 0.54, 6),
      thorn,
      [Math.sin(angle) * 0.3, 1.12 + Math.cos(angle) * 0.23, 1.34],
      [1, 1, 0.58],
      [Math.PI / 2 + Math.cos(angle) * 0.28, 0, -Math.sin(angle) * 0.45],
    );
  }
  for (const side of [-1, 1]) {
    for (const z of [-0.52, 0.48]) {
      addPart(
        group,
        new THREE.CylinderGeometry(0.055, 0.14, 1.22, 7),
        bark,
        [side * 0.55, 0.43, z],
        null,
        [z * 0.3, 0, side * 0.55],
      );
      addPart(group, new THREE.ConeGeometry(0.075, 0.34, 6), thorn, [side * 0.92, 0.08, z + 0.14], null, [Math.PI / 2, 0, 0]);
    }
  }
  for (let spine = 0; spine < 5; spine += 1) {
    addPart(group, new THREE.ConeGeometry(0.095, 0.52, 6), thorn, [0, 1.42, -0.55 + spine * 0.27], null, [0, 0, Math.PI]);
  }
  const tendril = addPart(group, new THREE.CylinderGeometry(0.025, 0.11, 1.82, 7), bark, [0, 0.8, -1.18]);
  tendril.rotation.x = Math.PI / 2.35;
  group.userData.silhouette = 'genna_stalker';
  group.userData.combatRead = 'venom_corrosion';
  return group;
}

function makeXenoWarrior(texture) {
  const group = new THREE.Group();
  const carapace = makeMaterial(0x0b1112, texture, { roughness: 0.26, metalness: 0.48 });
  const ridge = makeMaterial(0x1e2c2b, texture, { roughness: 0.42, metalness: 0.38 });
  const teeth = makeMaterial(0xd3ceba, null, { roughness: 0.34, metalness: 0.76 });

  addPart(group, new THREE.SphereGeometry(0.65, 15, 10), carapace, [0, 1.32, 0], [0.9, 1.34, 0.78]);
  addPart(group, new THREE.SphereGeometry(0.58, 16, 9), ridge, [0, 2.02, 0.43], [0.9, 0.62, 1.58]);
  addPart(group, new THREE.ConeGeometry(0.2, 0.66, 8), teeth, [0, 1.72, 1.05], null, [Math.PI / 2, 0, 0]);
  for (const side of [-1, 1]) {
    addPart(group, new THREE.CylinderGeometry(0.12, 0.16, 1.3, 8), carapace, [side * 0.42, 0.64, 0], null, [0, 0, side * 0.22]);
    addPart(group, new THREE.CylinderGeometry(0.08, 0.13, 1.38, 8), carapace, [side * 0.7, 1.38, 0.18], null, [0.22, 0, side * 0.62]);
    for (const z of [-0.34, 0.32]) {
      addPart(group, new THREE.CylinderGeometry(0.045, 0.1, 1.06, 7), ridge, [side * 0.34, 1.82, z - 0.4], null, [0.62, 0, side * 0.22]);
    }
    for (let claw = -1; claw <= 1; claw += 1) {
      addPart(group, new THREE.ConeGeometry(0.045, 0.34, 6), teeth, [side * 0.92 + claw * 0.04, 0.96, 0.57], null, [Math.PI / 2, 0, 0]);
    }
  }
  for (let rib = 0; rib < 5; rib += 1) {
    addPart(group, new THREE.TorusGeometry(0.36 + rib * 0.018, 0.035, 6, 12, Math.PI), ridge, [0, 1.26 + rib * 0.14, -0.36], null, [0, 0, Math.PI / 2]);
  }
  const tail = addPart(group, new THREE.CylinderGeometry(0.035, 0.17, 3.05, 9), carapace, [0, 1.03, -1.38]);
  tail.rotation.x = Math.PI / 2.45;
  group.scale.setScalar(1.06);
  group.userData.silhouette = 'xeno_warrior';
  group.userData.combatRead = 'armored_melee';
  return group;
}

const meshFactories = Object.freeze({
  xeno_drone: makeXenoDrone,
  hunting_hound: makeHuntingHound,
  human_fireteam: makeHumanFireteam,
  combat_synthetic: makeCombatSynthetic,
  grizzly_territorial: makeGrizzlyTerritorial,
  thermal_trapper: makeThermalTrapper,
  genna_stalker: makeGennaStalker,
  xeno_warrior: makeXenoWarrior,
});

function setPosition(target, value) {
  if (!value) return;
  if (value.isVector3) {
    target.copy(value);
  } else if (Array.isArray(value)) {
    target.set(value[0] ?? 0, value[1] ?? 0, value[2] ?? 0);
  } else {
    target.set(value.x ?? 0, value.y ?? 0, value.z ?? 0);
  }
}

function getPlayerPosition(player) {
  return player?.position || player?.mesh?.position || null;
}

function isPlayerCloaked(player) {
  return Boolean(player?.isCloaked || player?.cloaked || player?.cloakActive);
}

let nextNpcId = 1;

export class HuntNPC {
  constructor(typeOrOptions = 'xeno_drone', options = {}) {
    const config = typeof typeOrOptions === 'string'
      ? { ...options, type: typeOrOptions }
      : { ...(typeOrOptions || {}) };
    const archetype = ALL_HUNT_NPC_ARCHETYPES[config.type];

    if (!archetype) {
      throw new Error(`Unknown hunt NPC archetype: ${config.type}`);
    }

    this.type = archetype.type;
    this.id = config.id || `${this.type}-${nextNpcId++}`;
    this.name = config.name || archetype.name;
    this.maxHealth = config.maxHealth ?? config.health ?? archetype.health;
    this.health = Math.min(config.health ?? this.maxHealth, this.maxHealth);
    this.damage = config.damage ?? archetype.damage;
    this.speed = config.speed ?? archetype.speed;
    this.attackRange = config.attackRange ?? archetype.attackRange;
    this.colliderRadius = config.colliderRadius ?? archetype.colliderRadius;
    this.attackInterval = config.attackInterval ?? archetype.attackInterval;
    this.detectionRange = config.detectionRange ?? archetype.detectionRange ?? 0;
    this.damageType = config.damageType || archetype.damageType;
    this.attackKind = config.attackKind || archetype.attackKind;
    this.projectileSpeed = config.projectileSpeed ?? archetype.projectileSpeed ?? null;
    this.energyDrain = Math.max(0, config.energyDrain ?? archetype.energyDrain ?? 0);
    this.status = config.status ?? archetype.status ?? null;
    this.secondaryStatus = config.secondaryStatus ?? archetype.secondaryStatus ?? null;
    this.statusDuration = Math.max(0, config.statusDuration ?? archetype.statusDuration ?? 0);
    this.chargeRange = Math.max(this.attackRange, config.chargeRange ?? archetype.chargeRange ?? this.attackRange);
    this.chargeMultiplier = Math.max(1, config.chargeMultiplier ?? archetype.chargeMultiplier ?? 1);
    this.knockback = Math.max(0, config.knockback ?? archetype.knockback ?? 0);
    this.attackCooldown = Math.max(0, config.attackCooldown ?? 0);
    this.isDead = this.health <= 0;
    this.isNetted = false;
    this.netTimer = 0;
    this.projectiles = [];
    this._disposed = false;
    this._visionMode = 'normal';
    this.lurePosition = null;
    this.lureTimer = 0;
    this._isCharging = false;
    this.chargeWindupTimer = 0;

    const texture = loadSharedTexture(HUNT_NPC_TEXTURES[this.type]);
    this.mesh = meshFactories[this.type](texture);
    this.mesh.name = `hunt-npc:${this.id}`;
    this.mesh.userData.huntNpc = this;
    this.mesh.userData.npcId = this.id;
    this.mesh.userData.npcType = this.type;
    this.mesh.userData.colliderRadius = this.colliderRadius;
    setPosition(this.mesh.position, config.position);
    this.position = this.mesh.position;
  }

  update(delta, { player } = {}) {
    const signals = [];
    if (this._disposed || this.isDead) return signals;

    const dt = Math.max(0, Number(delta) || 0);
    if (this.isNetted) {
      this._isCharging = false;
      this.chargeWindupTimer = 0;
      this.mesh.userData.isCharging = false;
      this.netTimer = Math.max(0, this.netTimer - dt);
      if (this.netTimer === 0) {
        this.isNetted = false;
        this.mesh.userData.isNetted = false;
        signals.push({ type: 'log', sourceId: this.id, message: `${this.name} se libère du filet.` });
      }
      return signals;
    }

    this.attackCooldown = Math.max(0, this.attackCooldown - dt);
    this.lureTimer = Math.max(0, this.lureTimer - dt);
    if (this.lureTimer === 0 && this.lurePosition) {
      this.lurePosition = null;
      this.mesh.userData.investigatingLure = false;
    }
    const lureActive = this.lureTimer > 0 && this.lurePosition?.isVector3;
    const targetPosition = lureActive ? this.lurePosition : getPlayerPosition(player);
    if (!targetPosition) return signals;

    direction.subVectors(targetPosition, this.position);
    direction.y = 0;
    const distance = direction.length();

    if (lureActive) {
      this._isCharging = false;
      this.chargeWindupTimer = 0;
      this.mesh.userData.isCharging = false;
      if (distance > 1.2 && distance > 0.0001) {
        direction.normalize();
        this.position.addScaledVector(direction, Math.min(distance - 1.2, this.speed * dt));
        this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
      }
      return signals;
    }

    if (
      this.type === 'hunting_hound'
      && isPlayerCloaked(player)
      && distance <= this.detectionRange
      && this.attackCooldown === 0
    ) {
      signals.push({
        type: 'reveal_cloak',
        sourceId: this.id,
        target: player,
        radius: this.detectionRange,
        duration: 2.4,
      });
      signals.push({ type: 'log', sourceId: this.id, message: 'Le molosse évente la position camouflée.' });
      this.attackCooldown = this.attackInterval;
    }

    const shouldCharge = this.attackKind === 'charge'
      && distance > this.attackRange
      && distance <= this.chargeRange;
    if (this._isCharging && this.chargeWindupTimer > 0) {
      this.chargeWindupTimer = Math.max(0, this.chargeWindupTimer - dt);
      this.mesh.userData.isCharging = true;
      if (distance > 0.0001) this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
      return signals;
    }
    if (shouldCharge && !this._isCharging) {
      this._isCharging = true;
      this.chargeWindupTimer = 0.45;
      this.mesh.userData.isCharging = true;
      if (distance > 0.0001) this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
      signals.push({
        type: 'telegraph',
        sourceId: this.id,
        sourceType: this.type,
        attackKind: 'charge',
        duration: 0.45,
        message: `${this.name} amorce une charge lourde.`,
      });
      return signals;
    }
    this._isCharging = shouldCharge;
    this.mesh.userData.isCharging = shouldCharge;

    if (distance > this.attackRange && distance > 0.0001) {
      const movementSpeed = this.speed * (shouldCharge ? this.chargeMultiplier : 1);
      const travel = Math.min(distance - this.attackRange, movementSpeed * dt);
      direction.normalize();
      this.position.addScaledVector(direction, Math.max(0, travel));
      this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
      return signals;
    }

    if (this.attackCooldown > 0) return signals;

    const signal = {
      type: 'attack_player',
      sourceId: this.id,
      sourceType: this.type,
      target: player,
      damage: this.damage,
      damageType: this.damageType,
      attackKind: this.attackKind,
    };

    if (this.status || this.damageType === 'corrosion') {
      signal.status = this.status || 'corrosion';
      signal.statusDuration = this.statusDuration || 3.5;
    }
    if (this.secondaryStatus) {
      signal.secondaryStatus = this.secondaryStatus;
    }
    if (this.energyDrain > 0) {
      signal.energyDrain = this.energyDrain;
    }
    if (this.knockback > 0) {
      signal.knockback = this.knockback;
    }
    if (this.attackKind === 'charge') {
      signal.heavy = true;
    }
    if (this.attackKind === 'projectile') {
      signal.projectile = {
        origin: this.position.clone(),
        direction: direction.lengthSq() > 0 ? direction.normalize().clone() : new THREE.Vector3(0, 0, 1),
        speed: this.projectileSpeed ?? (this.type === 'combat_synthetic' ? 24 : 31),
      };
    }

    signals.push(signal);
    this.attackCooldown = this.attackInterval;
    return signals;
  }

  hearMimicry(position, duration = 6) {
    if (this._disposed || this.isDead || !position) return false;
    const seconds = Math.max(0, Number(duration) || 0);
    if (seconds === 0) return false;
    this.lurePosition ??= new THREE.Vector3();
    setPosition(this.lurePosition, position);
    this.lurePosition.y = this.position.y;
    this.lureTimer = Math.max(this.lureTimer, seconds);
    this.mesh.userData.investigatingLure = true;
    this._isCharging = false;
    this.chargeWindupTimer = 0;
    this.mesh.userData.isCharging = false;
    this.attackCooldown = Math.max(this.attackCooldown, 0.2);
    return true;
  }

  takeDamage(amount) {
    if (this._disposed || this.isDead) {
      return { damage: 0, killed: this.isDead, remainingHealth: this.health };
    }

    const damage = Math.max(0, Number(amount) || 0);
    this.health = Math.max(0, this.health - damage);
    if (this.health === 0) {
      this.isDead = true;
      this.isNetted = false;
      this.netTimer = 0;
      this.mesh.userData.isDead = true;
      this.mesh.userData.isNetted = false;
      this._isCharging = false;
      this.chargeWindupTimer = 0;
      this.mesh.userData.isCharging = false;
    }

    return { damage, killed: this.isDead, remainingHealth: this.health };
  }

  applyNet(duration = 3) {
    if (this._disposed || this.isDead) return false;
    this.isNetted = true;
    this.netTimer = Math.max(this.netTimer, Math.max(0, Number(duration) || 0));
    this.mesh.userData.isNetted = true;
    this._isCharging = false;
    this.chargeWindupTimer = 0;
    this.mesh.userData.isCharging = false;
    return true;
  }

  setVisionMode(mode = 'normal') {
    if (this._disposed) return false;
    this._visionMode = mode;
    this.mesh.userData.visionMode = mode;
    this.mesh.traverse((node) => {
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      for (const material of materials) {
        if (!material?.color) continue;
        if (mode === 'thermal') {
          const thermalColor = this.type === 'combat_synthetic'
            ? 0x74baff
            : this.type === 'thermal_trapper'
              ? 0xffc24d
              : this.type === 'genna_stalker'
                ? 0x7ee83c
                : 0xff6a1f;
          material.color.setHex(thermalColor);
          if (material.emissive) material.emissive.setHex(this.type === 'genna_stalker' ? 0x245d0e : 0x6b1600);
          material.emissiveIntensity = 0.8;
        } else if (mode === 'tech') {
          material.color.setHex(0x4de8ff);
          if (material.emissive) material.emissive.setHex(0x063c48);
          material.emissiveIntensity = 0.55;
        } else {
          material.color.setHex(material.userData.baseColor ?? 0xffffff);
          if (material.emissive) material.emissive.setHex(material.userData.baseEmissive ?? 0x000000);
          material.emissiveIntensity = material.userData.baseEmissiveIntensity ?? 0;
        }
      }
    });
    return true;
  }

  dispose() {
    if (this._disposed) return false;
    this._disposed = true;
    this._isCharging = false;
    this.chargeWindupTimer = 0;
    this.mesh.userData.isCharging = false;

    if (this.mesh.parent) this.mesh.parent.remove(this.mesh);
    const geometries = new Set();
    const materialsToDispose = new Set();
    this.mesh.traverse((node) => {
      if (node.geometry) geometries.add(node.geometry);
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      for (const material of materials) {
        if (material) materialsToDispose.add(material);
      }
    });
    for (const geometry of geometries) geometry.dispose?.();
    // Shared bitmap textures are cached separately and deliberately remain alive.
    for (const material of materialsToDispose) material.dispose?.();

    for (const projectile of this.projectiles) {
      projectile?.dispose?.();
      if (projectile?.mesh?.parent) projectile.mesh.parent.remove(projectile.mesh);
    }
    this.projectiles.length = 0;
    this.mesh.userData.huntNpc = null;
    return true;
  }
}

export default HuntNPC;
