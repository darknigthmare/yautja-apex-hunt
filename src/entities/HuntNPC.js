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
  xeno_runner: '/assets/textures/xeno-carapace.webp',
  clan_sentry_drone: '/assets/textures/yautja-energy-lattice.webp',
  genna_grazer: '/assets/textures/deathworld-alien-flora.webp',
  jungle_scout: '/assets/textures/stargazer-tactical-composite.webp',
  jungle_gunner: '/assets/textures/stargazer-tactical-composite.webp',
  jungle_trapper: '/assets/textures/stargazer-tactical-composite.webp',
  era_viking_raider: '/assets/textures/hunting-hound-hide.webp',
  era_feudal_duelist: '/assets/textures/yautja-leather-net.webp',
  era_wartime_pilot: '/assets/textures/ryushi-frontier-panels.webp',
  genna_sporeback: '/assets/textures/genna-sporeback-carapace.webp',
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

export const AMBIENT_HUNT_NPC_ARCHETYPES = Object.freeze({
  xeno_runner: Object.freeze({
    type: 'xeno_runner',
    name: 'Coureur xénomorphe',
    health: 82,
    damage: 14,
    speed: 7.2,
    attackRange: 2.55,
    colliderRadius: 0.58,
    attackInterval: 0.78,
    damageType: 'corrosion',
    attackKind: 'melee',
    status: 'corrosion',
    statusDuration: 3,
  }),
  clan_sentry_drone: Object.freeze({
    type: 'clan_sentry_drone',
    name: 'Drone sentinelle de clan',
    health: 115,
    damage: 12,
    speed: 3.4,
    attackRange: 18,
    colliderRadius: 0.72,
    attackInterval: 1.25,
    damageType: 'energy',
    attackKind: 'projectile',
    projectileSpeed: 30,
  }),
  genna_grazer: Object.freeze({
    type: 'genna_grazer',
    name: 'Brouteur de Genna',
    health: 155,
    damage: 17,
    speed: 3.5,
    attackRange: 3.15,
    colliderRadius: 1.04,
    attackInterval: 1.65,
    damageType: 'impact',
    attackKind: 'melee',
  }),
});

// Vague de contenu v1.8. Ce registre séparé préserve les contrats historiques
// HUNT_NPC_ARCHETYPES et ALL_HUNT_NPC_ARCHETYPES consommés par les anciennes
// sauvegardes et par les tests de compatibilité.
export const V18_HUNT_NPC_ARCHETYPES = Object.freeze({
  jungle_scout: Object.freeze({
    type: 'jungle_scout', name: 'Éclaireur de jungle', health: 88, damage: 9,
    speed: 3.75, attackRange: 17, colliderRadius: 0.5, attackInterval: 1.15,
    damageType: 'ballistic', attackKind: 'projectile', projectileSpeed: 36,
  }),
  jungle_gunner: Object.freeze({
    type: 'jungle_gunner', name: 'Mitrailleur de jungle', health: 168, damage: 17,
    speed: 2.05, attackRange: 22, colliderRadius: 0.68, attackInterval: 1.95,
    damageType: 'ballistic', attackKind: 'projectile', projectileSpeed: 27,
    knockback: 3,
  }),
  jungle_trapper: Object.freeze({
    type: 'jungle_trapper', name: 'Piégeur de jungle', health: 112, damage: 8,
    speed: 2.7, attackRange: 16, colliderRadius: 0.56, attackInterval: 1.7,
    damageType: 'disruption', attackKind: 'projectile', projectileSpeed: 24,
    energyDrain: 12, status: 'snare', statusDuration: 3.5,
  }),
  era_viking_raider: Object.freeze({
    type: 'era_viking_raider', name: 'Pillard de l’ère viking', health: 225, damage: 32,
    speed: 3.05, attackRange: 3.3, colliderRadius: 0.94, attackInterval: 2.15,
    damageType: 'impact', attackKind: 'charge', chargeRange: 12.5,
    chargeMultiplier: 2.25, knockback: 8,
  }),
  era_feudal_duelist: Object.freeze({
    type: 'era_feudal_duelist', name: 'Duelliste de l’ère féodale', health: 142, damage: 24,
    speed: 4.85, attackRange: 3.05, colliderRadius: 0.52, attackInterval: 0.78,
    damageType: 'laceration', attackKind: 'melee',
  }),
  era_wartime_pilot: Object.freeze({
    type: 'era_wartime_pilot', name: 'Pilote de l’ère industrielle', health: 104, damage: 11,
    speed: 3.2, attackRange: 23, colliderRadius: 0.5, attackInterval: 1.02,
    damageType: 'ballistic', attackKind: 'projectile', projectileSpeed: 40,
  }),
  genna_sporeback: Object.freeze({
    type: 'genna_sporeback', name: 'Dos-à-spores de Genna', health: 278, damage: 27,
    speed: 2.75, attackRange: 3.55, colliderRadius: 1.18, attackInterval: 2.3,
    damageType: 'corrosion', attackKind: 'charge', chargeRange: 10.5,
    chargeMultiplier: 1.9, knockback: 6, status: 'venom', statusDuration: 4.5,
  }),
});

export const ALL_HUNT_NPC_ARCHETYPES = Object.freeze({
  ...HUNT_NPC_ARCHETYPES,
  ...EXPANDED_HUNT_NPC_ARCHETYPES,
});

export const AVAILABLE_HUNT_NPC_ARCHETYPES = Object.freeze({
  ...ALL_HUNT_NPC_ARCHETYPES,
  ...AMBIENT_HUNT_NPC_ARCHETYPES,
  ...V18_HUNT_NPC_ARCHETYPES,
});

// Les noms courts émis par les événements sont résolus ici, en un seul point.
// Un identifiant canonique présent dans AVAILABLE_HUNT_NPC_ARCHETYPES est aussi
// accepté directement. Toute autre valeur renvoie explicitement null.
export const HUNT_NPC_TYPE_ALIASES = Object.freeze({
  xeno: 'xeno_drone',
  hound: 'hunting_hound',
  human: 'human_fireteam',
  synthetic: 'combat_synthetic',
  grizzly: 'grizzly_territorial',
  scout: 'jungle_scout',
  jungle_commando: 'jungle_scout',
  gunner: 'jungle_gunner',
  jungle_heavy: 'jungle_gunner',
  trapper: 'jungle_trapper',
  jungle_trap_team: 'jungle_trapper',
  viking: 'era_viking_raider',
  viking_raider: 'era_viking_raider',
  feudal: 'era_feudal_duelist',
  feudal_duelist: 'era_feudal_duelist',
  wartime: 'era_wartime_pilot',
  wartime_pilot: 'era_wartime_pilot',
  sporeback: 'genna_sporeback',
});

export function resolveHuntNpcType(type) {
  if (typeof type !== 'string') return null;
  const normalized = type.trim().toLowerCase();
  if (!normalized) return null;
  if (AVAILABLE_HUNT_NPC_ARCHETYPES[normalized]) return normalized;
  const resolved = HUNT_NPC_TYPE_ALIASES[normalized];
  return resolved && AVAILABLE_HUNT_NPC_ARCHETYPES[resolved] ? resolved : null;
}

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

function makeXenoRunner(texture) {
  const group = new THREE.Group();
  const carapace = makeMaterial(0x101918, texture, { roughness: 0.3, metalness: 0.42 });
  const teeth = makeMaterial(0xc9c2aa, null, { roughness: 0.4, metalness: 0.68 });

  addPart(group, new THREE.SphereGeometry(0.5, 13, 8), carapace, [0, 0.78, 0], [0.68, 0.54, 1.48]);
  addPart(group, new THREE.SphereGeometry(0.38, 13, 8), carapace, [0, 1.02, 0.9], [0.72, 0.46, 1.2]);
  addPart(group, new THREE.ConeGeometry(0.14, 0.48, 7), teeth, [0, 0.86, 1.36], null, [Math.PI / 2, 0, 0]);

  for (const side of [-1, 1]) {
    addPart(group, new THREE.CylinderGeometry(0.055, 0.11, 1.08, 7), carapace, [side * 0.38, 0.32, -0.5], null, [0.36, 0, side * 0.48]);
    addPart(group, new THREE.CylinderGeometry(0.045, 0.09, 1.2, 7), carapace, [side * 0.48, 0.4, 0.58], null, [-0.44, 0, side * 0.62]);
  }

  const tail = addPart(group, new THREE.CylinderGeometry(0.022, 0.1, 2.65, 8), carapace, [0, 0.7, -1.45]);
  tail.rotation.x = Math.PI / 2.25;
  group.scale.setScalar(0.92);
  group.userData.silhouette = 'xeno_runner';
  group.userData.combatRead = 'fast_flanker';
  return group;
}

function makeClanSentryDrone(texture) {
  const group = new THREE.Group();
  const hull = makeMaterial(0x303a3f, texture, { roughness: 0.32, metalness: 0.86 });
  const energy = makeMaterial(0x75edff, texture, { roughness: 0.16, metalness: 0.3, emissive: 0x087d94, emissiveIntensity: 1.8 });

  addPart(group, new THREE.SphereGeometry(0.62, 16, 10), hull, [0, 1.45, 0], [1, 0.68, 1]);
  addPart(group, new THREE.SphereGeometry(0.2, 12, 8), energy, [0, 1.43, 0.58], [1.35, 0.65, 0.55]);
  const ring = addPart(group, new THREE.TorusGeometry(0.82, 0.07, 8, 22), energy, [0, 1.45, 0]);
  ring.rotation.x = Math.PI / 2;

  for (const side of [-1, 1]) {
    addPart(group, new THREE.BoxGeometry(0.72, 0.09, 0.42), hull, [side * 0.75, 1.42, 0], null, [0, 0, side * 0.18]);
    addPart(group, new THREE.SphereGeometry(0.1, 9, 7), energy, [side * 1.08, 1.4, 0]);
  }
  for (let arm = 0; arm < 3; arm += 1) {
    const angle = (arm / 3) * Math.PI * 2;
    addPart(group, new THREE.CylinderGeometry(0.07, 0.13, 0.38, 8), energy, [Math.sin(angle) * 0.48, 1.05, Math.cos(angle) * 0.48]);
  }

  group.userData.hoverHeight = 1.45;
  group.userData.silhouette = 'clan_sentry_drone';
  group.userData.combatRead = 'hovering_sentry';
  return group;
}

function makeGennaGrazer(texture) {
  const group = new THREE.Group();
  const hide = makeMaterial(0x44583a, texture, { roughness: 0.94, metalness: 0.02 });
  const frond = makeMaterial(0x8ac653, texture, { roughness: 0.74, metalness: 0.04, emissive: 0x173f12, emissiveIntensity: 0.32 });
  const horn = makeMaterial(0x262b1d, null, { roughness: 0.56, metalness: 0.18 });

  addPart(group, new THREE.SphereGeometry(0.82, 14, 10), hide, [0, 1.03, 0], [1.12, 0.72, 1.58]);
  addPart(group, new THREE.SphereGeometry(0.5, 12, 8), hide, [0, 1.28, 0.98], [0.8, 0.72, 1.1]);
  addPart(group, new THREE.SphereGeometry(0.36, 11, 8), hide, [0, 1.12, 1.52], [0.92, 0.65, 0.82]);

  for (const side of [-1, 1]) {
    for (const z of [-0.72, 0, 0.72]) {
      addPart(group, new THREE.CylinderGeometry(0.07, 0.14, 0.92, 7), hide, [side * 0.52, 0.42, z], null, [0, 0, side * 0.15]);
    }
  }

  for (let frondIndex = 0; frondIndex < 5; frondIndex += 1) {
    const angle = ((frondIndex - 2) / 5) * 1.45;
    addPart(group, new THREE.ConeGeometry(0.16, 0.82, 7), frond, [Math.sin(angle) * 0.5, 1.72, -0.25 + Math.cos(angle) * 0.2], [0.72, 1, 0.36], [0, 0, angle]);
  }
  for (const side of [-1, 1]) {
    const browHorn = addPart(group, new THREE.ConeGeometry(0.08, 0.58, 7), horn, [side * 0.24, 1.36, 1.72]);
    browHorn.rotation.x = Math.PI / 2.8;
  }
  group.scale.setScalar(1.04);
  group.userData.silhouette = 'genna_grazer';
  group.userData.combatRead = 'herd_defender';
  return group;
}

function makeJungleOperative(texture, role) {
  const group = new THREE.Group();
  const rolePalette = {
    scout: { fabric: 0x344a2f, armor: 0x202b24, read: 'fast_recon_marksman' },
    gunner: { fabric: 0x273329, armor: 0x303a32, read: 'armored_suppression' },
    trapper: { fabric: 0x3c4230, armor: 0x252b22, read: 'snare_disruptor' },
  }[role];
  const fabric = makeMaterial(rolePalette.fabric, texture, { roughness: 0.92, metalness: 0.02 });
  const armor = makeMaterial(rolePalette.armor, texture, { roughness: 0.48, metalness: 0.58 });
  const skin = makeMaterial(0x8b5b3c, null, { roughness: 0.92, metalness: 0 });
  const lens = makeMaterial(0x6eeaff, null, {
    roughness: 0.12,
    metalness: 0.42,
    emissive: 0x083f4e,
    emissiveIntensity: 1.1,
  });

  addPart(group, new THREE.CapsuleGeometry(0.34, 0.74, 5, 8), fabric, [0, 1.25, 0]);
  addPart(group, new THREE.SphereGeometry(0.27, 12, 8), skin, [0, 1.96, 0.03]);
  addPart(group, new THREE.CylinderGeometry(0.31, 0.34, 0.2, 10), armor, [0, 2.14, 0]);
  for (const side of [-1, 1]) {
    addPart(group, new THREE.CapsuleGeometry(0.1, 0.68, 4, 7), fabric, [side * 0.18, 0.48, 0], null, [0, 0, side * 0.05]);
    addPart(group, new THREE.CapsuleGeometry(0.085, 0.58, 4, 7), fabric, [side * 0.48, 1.27, 0.04], null, [0, 0, side * 0.22]);
    addPart(group, new THREE.BoxGeometry(0.25, 0.18, 0.32), armor, [side * 0.42, 1.67, 0]);
  }
  addPart(group, new THREE.BoxGeometry(0.55, 0.68, 0.24), armor, [0, 1.34, -0.25]);

  if (role === 'scout') {
    addPart(group, new THREE.BoxGeometry(0.18, 0.45, 0.13), armor, [0.31, 1.52, -0.31]);
    addPart(group, new THREE.CylinderGeometry(0.012, 0.012, 0.72, 5), lens, [0.34, 2.05, -0.25], null, [0, 0, -0.12]);
    addPart(group, new THREE.BoxGeometry(0.42, 0.1, 1.2), armor, [-0.18, 1.35, 0.48], null, [0.1, -0.15, -0.08]);
    addPart(group, new THREE.CylinderGeometry(0.055, 0.055, 0.45, 8), lens, [-0.04, 1.62, 0.46], null, [Math.PI / 2, 0, 0]);
    addPart(group, new THREE.SphereGeometry(0.055, 8, 6), lens, [0.09, 1.98, 0.25]);
  } else if (role === 'gunner') {
    addPart(group, new THREE.BoxGeometry(0.78, 0.22, 0.38), armor, [0, 1.64, 0]);
    addPart(group, new THREE.BoxGeometry(0.58, 0.65, 0.32), armor, [0, 1.33, -0.34]);
    addPart(group, new THREE.CylinderGeometry(0.13, 0.18, 0.62, 10), armor, [0.5, 1.22, 0.28], null, [Math.PI / 2, 0, 0]);
    for (let barrel = -1; barrel <= 1; barrel += 1) {
      addPart(group, new THREE.CylinderGeometry(0.025, 0.025, 1.05, 7), armor, [0.5 + barrel * 0.06, 1.19, 0.86], null, [Math.PI / 2, 0, 0]);
    }
    addPart(group, new THREE.BoxGeometry(0.26, 0.45, 0.2), armor, [-0.43, 1.16, 0.18]);
  } else {
    addPart(group, new THREE.TorusGeometry(0.24, 0.035, 7, 16), armor, [0, 1.52, -0.43], null, [Math.PI / 2, 0, 0]);
    addPart(group, new THREE.CylinderGeometry(0.075, 0.1, 0.82, 8), armor, [0.39, 1.23, 0.38], null, [Math.PI / 2, 0, 0]);
    for (const side of [-1, 1]) {
      addPart(group, new THREE.CylinderGeometry(0.11, 0.11, 0.18, 10), lens, [side * 0.26, 0.76, -0.13], null, [Math.PI / 2, 0, 0]);
    }
  }

  group.userData.silhouette = `jungle_${role}`;
  group.userData.combatRead = rolePalette.read;
  return group;
}

function makeJungleScout(texture) { return makeJungleOperative(texture, 'scout'); }
function makeJungleGunner(texture) { return makeJungleOperative(texture, 'gunner'); }
function makeJungleTrapper(texture) { return makeJungleOperative(texture, 'trapper'); }

function makeEraVikingRaider(texture) {
  const group = new THREE.Group();
  const hide = makeMaterial(0x493426, texture, { roughness: 0.9, metalness: 0.03 });
  const mail = makeMaterial(0x586064, texture, { roughness: 0.42, metalness: 0.76 });
  const wood = makeMaterial(0x4a2c19, null, { roughness: 0.82, metalness: 0.04 });
  addPart(group, new THREE.CapsuleGeometry(0.48, 0.9, 5, 9), hide, [0, 1.28, 0]);
  addPart(group, new THREE.SphereGeometry(0.32, 12, 8), hide, [0, 2.08, 0.04]);
  addPart(group, new THREE.CylinderGeometry(0.36, 0.32, 0.28, 10), mail, [0, 2.22, 0]);
  for (const side of [-1, 1]) {
    addPart(group, new THREE.CapsuleGeometry(0.13, 0.76, 4, 7), hide, [side * 0.22, 0.45, 0], null, [0, 0, side * 0.08]);
    addPart(group, new THREE.CapsuleGeometry(0.12, 0.7, 4, 7), hide, [side * 0.56, 1.3, 0], null, [0, 0, side * 0.24]);
    addPart(group, new THREE.SphereGeometry(0.18, 9, 6), mail, [side * 0.47, 1.68, 0]);
  }
  addPart(group, new THREE.CylinderGeometry(0.58, 0.58, 0.1, 18), wood, [-0.67, 1.24, 0.18], null, [Math.PI / 2, 0, 0]);
  addPart(group, new THREE.TorusGeometry(0.48, 0.055, 8, 20), mail, [-0.67, 1.24, 0.24], null, [Math.PI / 2, 0, 0]);
  addPart(group, new THREE.CylinderGeometry(0.035, 0.045, 1.45, 7), wood, [0.68, 1.3, 0.2], null, [0, 0, -0.18]);
  addPart(group, new THREE.BoxGeometry(0.12, 0.42, 0.5), mail, [0.79, 1.91, 0.2], null, [0, 0, -0.18]);
  group.scale.setScalar(1.08);
  group.userData.silhouette = 'era_viking_raider';
  group.userData.combatRead = 'shield_charge';
  return group;
}

function makeEraFeudalDuelist(texture) {
  const group = new THREE.Group();
  const cloth = makeMaterial(0x302a22, texture, { roughness: 0.86, metalness: 0.05 });
  const lacquer = makeMaterial(0x501b18, texture, { roughness: 0.38, metalness: 0.55 });
  const blade = makeMaterial(0xc5d0ce, null, { roughness: 0.2, metalness: 0.9 });
  addPart(group, new THREE.CapsuleGeometry(0.32, 0.82, 5, 8), cloth, [0, 1.25, 0]);
  addPart(group, new THREE.SphereGeometry(0.25, 11, 8), cloth, [0, 1.98, 0.03]);
  addPart(group, new THREE.CylinderGeometry(0.32, 0.27, 0.26, 10), lacquer, [0, 2.13, 0]);
  addPart(group, new THREE.BoxGeometry(0.86, 0.16, 0.35), lacquer, [0, 1.62, 0]);
  for (const y of [1.08, 1.28, 1.48]) {
    addPart(group, new THREE.BoxGeometry(0.72, 0.13, 0.38), lacquer, [0, y, 0]);
  }
  for (const side of [-1, 1]) {
    addPart(group, new THREE.CapsuleGeometry(0.085, 0.72, 4, 7), cloth, [side * 0.16, 0.46, 0], null, [0, 0, side * 0.05]);
    addPart(group, new THREE.CapsuleGeometry(0.075, 0.66, 4, 7), cloth, [side * 0.46, 1.27, 0.04], null, [0, 0, side * 0.2]);
  }
  addPart(group, new THREE.BoxGeometry(0.055, 0.12, 1.52), blade, [0.48, 1.14, 0.48], null, [0.16, -0.28, -0.16]);
  addPart(group, new THREE.BoxGeometry(0.45, 0.055, 0.12), lacquer, [0.45, 1.08, -0.18], null, [0, 0.25, 0]);
  group.userData.silhouette = 'era_feudal_duelist';
  group.userData.combatRead = 'counter_duelist';
  return group;
}

function makeEraWartimePilot(texture) {
  const group = new THREE.Group();
  const suit = makeMaterial(0x4a4b38, texture, { roughness: 0.88, metalness: 0.04 });
  const harness = makeMaterial(0x5a3823, texture, { roughness: 0.72, metalness: 0.12 });
  const metal = makeMaterial(0x30383b, null, { roughness: 0.38, metalness: 0.72 });
  const lens = makeMaterial(0x6fb5ca, null, { roughness: 0.14, metalness: 0.5, emissive: 0x06222b, emissiveIntensity: 0.55 });
  addPart(group, new THREE.CapsuleGeometry(0.33, 0.76, 5, 8), suit, [0, 1.22, 0]);
  addPart(group, new THREE.SphereGeometry(0.26, 12, 8), suit, [0, 1.94, 0.03]);
  addPart(group, new THREE.SphereGeometry(0.07, 8, 6), lens, [-0.1, 2, 0.23]);
  addPart(group, new THREE.SphereGeometry(0.07, 8, 6), lens, [0.1, 2, 0.23]);
  for (const side of [-1, 1]) {
    addPart(group, new THREE.CapsuleGeometry(0.09, 0.68, 4, 7), suit, [side * 0.17, 0.45, 0], null, [0, 0, side * 0.05]);
    addPart(group, new THREE.CapsuleGeometry(0.08, 0.62, 4, 7), suit, [side * 0.45, 1.24, 0.04], null, [0, 0, side * 0.2]);
    addPart(group, new THREE.BoxGeometry(0.09, 0.72, 0.08), harness, [side * 0.17, 1.33, 0.25], null, [0, 0, side * 0.18]);
  }
  addPart(group, new THREE.BoxGeometry(0.66, 0.1, 0.08), harness, [0, 1.28, 0.28]);
  addPart(group, new THREE.CylinderGeometry(0.12, 0.12, 0.5, 9), metal, [0, 1.4, -0.3]);
  addPart(group, new THREE.BoxGeometry(0.32, 0.12, 1.25), metal, [0.25, 1.28, 0.48], null, [0.12, -0.12, -0.1]);
  addPart(group, new THREE.BoxGeometry(1.18, 0.08, 0.28), metal, [0, 1.76, -0.2], null, [0, 0, 0.06]);
  group.userData.silhouette = 'era_wartime_pilot';
  group.userData.combatRead = 'mobile_marksman';
  return group;
}

function makeGennaSporeback(texture) {
  const group = new THREE.Group();
  const hide = makeMaterial(0x334a35, texture, { roughness: 0.82, metalness: 0.08 });
  const shell = makeMaterial(0x172e25, texture, { roughness: 0.42, metalness: 0.36 });
  const spore = makeMaterial(0xb6f25a, texture, { roughness: 0.3, metalness: 0.08, emissive: 0x275c12, emissiveIntensity: 1.35 });
  addPart(group, new THREE.SphereGeometry(0.9, 16, 10), hide, [0, 0.92, 0], [1.18, 0.74, 1.55]);
  addPart(group, new THREE.SphereGeometry(0.84, 16, 9), shell, [0, 1.32, -0.2], [1.2, 0.5, 1.32]);
  addPart(group, new THREE.SphereGeometry(0.48, 13, 8), shell, [0, 0.96, 1.22], [0.86, 0.68, 1]);
  for (const side of [-1, 1]) {
    for (const z of [-0.72, 0, 0.72]) {
      addPart(group, new THREE.CylinderGeometry(0.07, 0.15, 1.05, 7), hide, [side * 0.67, 0.4, z], null, [0, 0, side * 0.34]);
    }
    addPart(group, new THREE.ConeGeometry(0.1, 0.68, 7), shell, [side * 0.28, 1.17, 1.7], null, [Math.PI / 2.5, 0, side * 0.12]);
  }
  for (let pod = 0; pod < 7; pod += 1) {
    const angle = ((pod - 3) / 6) * Math.PI;
    addPart(group, new THREE.SphereGeometry(0.2, 10, 7), spore, [Math.sin(angle) * 0.72, 1.72 + Math.cos(angle) * 0.14, -0.25 + Math.cos(angle) * 0.5]);
  }
  const tail = addPart(group, new THREE.CylinderGeometry(0.04, 0.17, 1.75, 8), shell, [0, 0.75, -1.42]);
  tail.rotation.x = Math.PI / 2.3;
  group.scale.setScalar(1.12);
  group.userData.silhouette = 'genna_sporeback';
  group.userData.combatRead = 'venom_spore_charge';
  group.userData.sporePodCount = 7;
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
  xeno_runner: makeXenoRunner,
  clan_sentry_drone: makeClanSentryDrone,
  genna_grazer: makeGennaGrazer,
  jungle_scout: makeJungleScout,
  jungle_gunner: makeJungleGunner,
  jungle_trapper: makeJungleTrapper,
  era_viking_raider: makeEraVikingRaider,
  era_feudal_duelist: makeEraFeudalDuelist,
  era_wartime_pilot: makeEraWartimePilot,
  genna_sporeback: makeGennaSporeback,
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
    const requestedType = config.type;
    const resolvedType = resolveHuntNpcType(requestedType);
    const archetype = resolvedType ? AVAILABLE_HUNT_NPC_ARCHETYPES[resolvedType] : null;

    if (!archetype) {
      throw new Error(`Unknown hunt NPC archetype: ${requestedType}`);
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

    this.ambient = Boolean(config.ambient);
    this.territoryCenter = new THREE.Vector3();
    setPosition(this.territoryCenter, config.territoryCenter ?? this.position);
    this.territoryCenter.y = this.position.y;

    const configuredPatrolRadius = Number(config.patrolRadius);
    this.patrolRadius = Number.isFinite(configuredPatrolRadius) ? Math.max(0, configuredPatrolRadius) : 14;
    const configuredAggressionRange = Number(config.aggressionRange);
    const defaultAggressionRange = archetype.aggressionRange ?? Math.max(12, this.attackRange + 6);
    this.aggressionRange = Number.isFinite(configuredAggressionRange) ? Math.max(this.attackRange, configuredAggressionRange) : defaultAggressionRange;
    const configuredLeashRadius = Number(config.leashRadius);
    const defaultLeashRadius = Math.max(this.patrolRadius + 8, this.aggressionRange * 1.5);
    this.leashRadius = Number.isFinite(configuredLeashRadius) ? Math.max(this.patrolRadius, configuredLeashRadius) : defaultLeashRadius;

    this.patrolTarget = this.territoryCenter.clone();
    this.patrolTimer = 0;
    this._patrolCycle = 0;
    this.ambientState = this.ambient ? 'patrol' : 'hostile';
    this.mesh.userData.ambient = this.ambient;
    this.mesh.userData.ambientState = this.ambientState;
    this.mesh.userData.territoryCenter = this.territoryCenter.clone();
    this.mesh.userData.patrolRadius = this.patrolRadius;
    this.mesh.userData.leashRadius = this.leashRadius;
  }

  _setAmbientState(state, signals) {
    const previousState = this.ambientState;
    this.ambientState = state;
    this.mesh.userData.ambientState = state;
    this.mesh.userData.ambientAlerted = state === 'chase';
    if (previousState !== state && state === 'chase') {
      signals.push({
        type: 'log',
        sourceId: this.id,
        sourceType: this.type,
        message: `${this.name} détecte une intrusion dans son territoire.`,
      });
    }
  }

  _choosePatrolTarget() {
    const seed = [...this.id].reduce((total, character) => total + character.charCodeAt(0), 0);
    this._patrolCycle += 1;
    const angle = (seed * 0.071) + (this._patrolCycle * 2.3999632297);
    const radiusScale = 0.55 + (((seed + this._patrolCycle) % 4) * 0.1);
    const radius = this.patrolRadius * radiusScale;
    this.patrolTarget.set(
      this.territoryCenter.x + (Math.sin(angle) * radius),
      this.territoryCenter.y,
      this.territoryCenter.z + (Math.cos(angle) * radius),
    );
    this.patrolTimer = 3.5 + ((seed + this._patrolCycle) % 4);
  }

  _moveAmbient(target, dt, stopDistance = 0.45, movementSpeed = this.speed) {
    direction.subVectors(target, this.position);
    direction.y = 0;
    const distance = direction.length();
    if (distance <= stopDistance || distance <= 0.0001) return false;
    direction.normalize();
    const travel = Math.min(distance - stopDistance, movementSpeed * dt);
    this.position.addScaledVector(direction, Math.max(0, travel));
    this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
    return true;
  }

  _updateAmbient(dt, playerPosition, signals) {
    const territoryDistance = Math.hypot(
      this.position.x - this.territoryCenter.x,
      this.position.z - this.territoryCenter.z,
    );
    let playerDistance = Infinity;
    let playerTerritoryDistance = Infinity;
    if (playerPosition) {
      playerDistance = Math.hypot(playerPosition.x - this.position.x, playerPosition.z - this.position.z);
      playerTerritoryDistance = Math.hypot(playerPosition.x - this.territoryCenter.x, playerPosition.z - this.territoryCenter.z);
    }
    const playerInsideTerritory = playerDistance <= this.aggressionRange && playerTerritoryDistance <= this.leashRadius;

    if (territoryDistance > this.leashRadius || (!playerInsideTerritory && territoryDistance > this.patrolRadius)) {
      this._setAmbientState('return', signals);
      const stillReturning = this._moveAmbient(this.territoryCenter, dt, 0.65, this.speed * 1.1);
      if (!stillReturning) this._setAmbientState('patrol', signals);
      return false;
    }

    if (playerInsideTerritory) {
      this._setAmbientState('chase', signals);
      return true;
    }

    this._setAmbientState('patrol', signals);
    this.patrolTimer = Math.max(0, this.patrolTimer - dt);
    const patrolDistance = Math.hypot(this.position.x - this.patrolTarget.x, this.position.z - this.patrolTarget.z);
    if (this.patrolTimer === 0 || patrolDistance < 0.65) this._choosePatrolTarget();
    this._moveAmbient(this.patrolTarget, dt, 0.55, this.speed * 0.62);
    return false;
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
    const playerPosition = getPlayerPosition(player);
    let targetPosition = lureActive ? this.lurePosition : playerPosition;
    if (!lureActive && this.ambient) {
      const shouldEngagePlayer = this._updateAmbient(dt, playerPosition, signals);
      if (!shouldEngagePlayer) return signals;
      targetPosition = playerPosition;
    }
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
    if (this.ambient) {
      this.ambientState = 'investigate';
      this.mesh.userData.ambientState = 'investigate';
    }
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
            : this.type === 'thermal_trapper' || this.type === 'jungle_trapper'
              ? 0xffc24d
              : this.type === 'genna_stalker' || this.type === 'genna_sporeback'
                ? 0x7ee83c
                : 0xff6a1f;
          material.color.setHex(thermalColor);
          const thermalEmissive = this.type === 'genna_stalker' || this.type === 'genna_sporeback'
            ? 0x245d0e
            : 0x6b1600;
          if (material.emissive) material.emissive.setHex(thermalEmissive);
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
