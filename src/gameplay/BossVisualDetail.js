import * as THREE from 'three';
import { disposeObject3D } from '../utils/materialState.js';
import { getRuntimeTexture } from '../utils/runtimeTextures.js';

const BOSS_TYPE_TO_ARCHETYPE = Object.freeze({
  megafauna: 'goliath',
  xenoQueen: 'queen',
  badBlood: 'bad_blood',
  predalien: 'predalien',
  superPredator: 'super_predator',
  upgradePredator: 'super_predator',
  feralPredator: 'feral',
  wolfCleaner: 'wolf',
  kalisk: 'kalisk',
  cityHunter: 'city_hunter',
  gridAlien: 'grid_alien',
});

function freezeProfile(profile) {
  return Object.freeze({
    ...profile,
    features: Object.freeze([...profile.features]),
    texturePaths: Object.freeze([...profile.texturePaths]),
    foundation: Object.freeze({
      torso: Object.freeze(profile.foundation.torso),
      head: Object.freeze(profile.foundation.head),
      limbs: Object.freeze(profile.foundation.limbs.map(Object.freeze)),
    }),
  });
}

export const BOSS_VISUAL_PROFILES = Object.freeze({
  goliath: freezeProfile({
    features: ['armored_hide', 'dorsal_plate_fan', 'crown_horn', 'tail_guard'],
    texturePaths: ['/assets/textures/goliath-armored-hide.webp', '/assets/textures/trophy-bone.webp'],
    colors: [0x202a31, 0x45515a, 0xc7b987, 0xff4b1f],
    foundation: {
      torso: { position: [0, 4.9, -0.2], scale: [3.25, 2.35, 5.15] },
      head: { position: [0, 6.05, 6.55], scale: [1.9, 1.52, 2.45] },
      limbs: [
        { position: [3.2, 2.7, 3.3], scale: [1.22, 2.45, 1.28] },
        { position: [-3.2, 2.7, 3.3], scale: [1.22, 2.45, 1.28] },
        { position: [3.2, 2.7, -3.4], scale: [1.28, 2.45, 1.32] },
        { position: [-3.2, 2.7, -3.4], scale: [1.28, 2.45, 1.32] },
      ],
    },
  }),
  queen: freezeProfile({
    features: ['royal_crown', 'biomechanical_ribs', 'dorsal_tubes', 'secondary_arms'],
    texturePaths: ['/assets/textures/xeno-carapace.webp', '/assets/textures/hive-biomechanical-membrane.webp'],
    colors: [0x090c12, 0x26323a, 0x53645d, 0x61ff7b],
    foundation: {
      torso: { position: [0, 6, -0.1], scale: [2.72, 3.05, 4.72] },
      head: { position: [0, 8.55, 7.25], scale: [1.58, 1.32, 2.82] },
      limbs: [
        { position: [3.3, 5.2, 3.7], scale: [0.78, 3.35, 0.8], rotation: [0, 0, -0.7] },
        { position: [-3.3, 5.2, 3.7], scale: [0.78, 3.35, 0.8], rotation: [0, 0, 0.7] },
        { position: [3.25, 3.5, -3.5], scale: [1.02, 3.4, 1.05] },
        { position: [-3.25, 3.5, -3.5], scale: [1.02, 3.4, 1.05] },
      ],
    },
  }),
  grid_alien: freezeProfile({
    features: [
      'elongated_translucent_dome',
      'dorsal_tubes',
      'inner_jaw',
      'segmented_blade_tail',
      'permanent_grid_acid_scars',
    ],
    texturePaths: ['/assets/textures/xeno-carapace.webp', '/assets/textures/hive-biomechanical-membrane.webp'],
    colors: [0x0a1014, 0x2b373c, 0xb8c7b3, 0xbaff36],
    foundation: {
      torso: { position: [0, 5.2, -0.1], scale: [1.86, 2.7, 1.32] },
      head: { position: [0, 8.65, 2.9], scale: [1.28, 1.08, 2.68] },
      limbs: [
        { position: [2.35, 4.95, 0.55], scale: [0.48, 2.55, 0.5], rotation: [-0.18, 0, -0.48] },
        { position: [-2.35, 4.95, 0.55], scale: [0.48, 2.55, 0.5], rotation: [-0.18, 0, 0.48] },
        { position: [1.12, 1.75, 0], scale: [0.7, 2.2, 0.74], rotation: [-0.18, 0, -0.2] },
        { position: [-1.12, 1.75, 0], scale: [0.7, 2.2, 0.74], rotation: [-0.18, 0, 0.2] },
      ],
    },
  }),
  bad_blood: freezeProfile({
    features: ['scarred_biomask', 'trophy_bandolier', 'asymmetric_armor', 'dual_wristblades'],
    texturePaths: ['/assets/textures/yautja-skin-mottled.webp', '/assets/textures/biomask-etched-alloy.webp'],
    colors: [0x493b30, 0x53100f, 0x8c7e68, 0xff2619],
    foundation: {
      torso: { position: [0, 3.65, 0], scale: [1.28, 1.72, 0.88] },
      head: { position: [0, 5.5, 0.24], scale: [0.94, 1.02, 0.82] },
      limbs: [
        { position: [1.55, 3.7, 0], scale: [0.48, 1.52, 0.48] },
        { position: [-1.55, 3.7, 0], scale: [0.48, 1.52, 0.48] },
        { position: [0.72, 1.55, 0], scale: [0.58, 1.65, 0.62] },
        { position: [-0.72, 1.55, 0], scale: [0.58, 1.65, 0.62] },
      ],
    },
  }),
  predalien: freezeProfile({
    features: ['elongated_dome', 'yautja_mandibles', 'biomechanical_dreadlocks', 'spear_tail_spines'],
    texturePaths: ['/assets/textures/xeno-carapace.webp', '/assets/textures/yautja-skin-mottled.webp'],
    colors: [0x111018, 0x352d2a, 0x6d5947, 0x4dff70],
    foundation: {
      torso: { position: [0, 6.45, -0.1], scale: [2.85, 3.25, 5.18] },
      head: { position: [0, 9.9, 5.5], scale: [2.1, 1.55, 4.25] },
      limbs: [
        { position: [3.8, 6, 3.8], scale: [0.9, 3.9, 0.92], rotation: [0, 0, -0.72] },
        { position: [-3.8, 6, 3.8], scale: [0.9, 3.9, 0.92], rotation: [0, 0, 0.72] },
        { position: [3.5, 3.7, -3.8], scale: [1.15, 3.7, 1.2] },
        { position: [-3.5, 3.7, -3.8], scale: [1.15, 3.7, 1.2] },
      ],
    },
  }),
  super_predator: freezeProfile({
    features: ['tusked_biomask', 'broad_armor', 'dread_crown', 'heavy_plasmacaster'],
    texturePaths: ['/assets/textures/yautja-skin-mottled.webp', '/assets/textures/biomask-etched-alloy.webp'],
    colors: [0x34271f, 0x0b0c10, 0x7b1410, 0xb446ff],
    foundation: {
      torso: { position: [0, 5.45, 0], scale: [2.55, 2.9, 1.75] },
      head: { position: [0, 9.35, 0.3], scale: [1.32, 1.42, 1.04] },
      limbs: [
        { position: [3.18, 5.45, 0.1], scale: [0.78, 2.28, 0.8] },
        { position: [-3.18, 5.45, 0.1], scale: [0.78, 2.28, 0.8] },
        { position: [1.35, 2.15, 0], scale: [0.95, 2.25, 1.02] },
        { position: [-1.35, 2.15, 0], scale: [0.95, 2.25, 1.02] },
      ],
    },
  }),
  feral: freezeProfile({
    features: ['bone_biomask', 'lean_frame', 'bone_trophies', 'bolt_shield_kit'],
    texturePaths: ['/assets/textures/feral-bone-composite.webp', '/assets/textures/yautja-skin-mottled.webp'],
    colors: [0x58472f, 0xbca774, 0x241a12, 0xff7438],
    foundation: {
      torso: { position: [0, 5.15, 0], scale: [1.8, 2.72, 1.18] },
      head: { position: [0, 9.05, 0.16], scale: [1.02, 1.16, 0.88] },
      limbs: [
        { position: [2.18, 5.02, 0.1], scale: [0.52, 1.72, 0.54] },
        { position: [-2.18, 5.02, 0.1], scale: [0.52, 1.72, 0.54] },
        { position: [0.92, 1.95, 0], scale: [0.68, 1.95, 0.72] },
        { position: [-0.92, 1.95, 0], scale: [0.68, 1.95, 0.72] },
      ],
    },
  }),
  wolf: freezeProfile({
    features: ['scarred_wolf_biomask', 'dual_plasmacasters', 'cleaner_canisters', 'segmented_whip'],
    texturePaths: ['/assets/textures/wolf-cleaner-alloy.webp', '/assets/textures/yautja-skin-mottled.webp'],
    colors: [0x43382e, 0x525b5d, 0x181b1d, 0x57f4ff],
    foundation: {
      torso: { position: [0, 5.2, 0], scale: [2.08, 2.72, 1.48] },
      head: { position: [0, 9.05, 0.28], scale: [1.14, 1.28, 0.94] },
      limbs: [
        { position: [2.65, 5.05, 0.08], scale: [0.62, 1.92, 0.64] },
        { position: [-2.65, 5.05, 0.08], scale: [0.62, 1.92, 0.64] },
        { position: [1.05, 1.9, 0], scale: [0.76, 1.98, 0.8] },
        { position: [-1.05, 1.9, 0], scale: [0.76, 1.98, 0.8] },
      ],
    },
  }),
  city_hunter: freezeProfile({
    features: ['angular_biomask', 'multispectral_rebreather', 'returning_disc_netgun', 'urban_medicomp_trophies'],
    texturePaths: [
      '/assets/textures/los-angeles-heatwave-urban.webp',
      '/assets/textures/biomask-etched-alloy.webp',
      '/assets/textures/yautja-skin-mottled.webp',
    ],
    colors: [0x796f54, 0x4e5148, 0xa9c1be, 0x65ffd1],
    foundation: {
      torso: { position: [0, 5.35, 0], scale: [2.15, 3.25, 1.48] },
      head: { position: [0, 9.18, 0.18], scale: [1.12, 1.25, 0.95] },
      limbs: [
        { position: [2.25, 5, 0], scale: [0.62, 2.05, 0.65] },
        { position: [-2.25, 5, 0], scale: [0.62, 2.05, 0.65] },
        { position: [0.9, 1.95, 0], scale: [0.72, 2.1, 0.76] },
        { position: [-0.9, 1.95, 0], scale: [0.72, 2.1, 0.76] },
      ],
    },
  }),
  kalisk: freezeProfile({
    features: ['adaptive_carapace', 'regenerative_core', 'impaling_mandibles', 'tail_blade_fan'],
    texturePaths: ['/assets/textures/kalisk-adaptive-hide.webp', '/assets/textures/yautja-energy-lattice.webp'],
    colors: [0x173b3d, 0x2c6762, 0x9b8f6c, 0xc936e0],
    foundation: {
      torso: { position: [0, 5.2, -0.55], scale: [3.3, 2.72, 5.45] },
      head: { position: [0, 5.65, 4.9], scale: [2.88, 1.98, 3.32] },
      limbs: [
        { position: [3.15, 3.35, 2.8], scale: [0.98, 2.55, 1.08], rotation: [-0.18, 0, -0.38] },
        { position: [-3.15, 3.35, 2.8], scale: [0.98, 2.55, 1.08], rotation: [-0.18, 0, 0.38] },
        { position: [3.15, 3.35, -3.3], scale: [1.02, 2.4, 1.12], rotation: [0.15, 0, -0.32] },
        { position: [-3.15, 3.35, -3.3], scale: [1.02, 2.4, 1.12], rotation: [0.15, 0, 0.32] },
      ],
    },
  }),
});

function makeMaterials(profile) {
  const hideTexture = getRuntimeTexture(profile.texturePaths[0], { repeat: [2, 2] });
  const accentTexture = getRuntimeTexture(profile.texturePaths[1], { repeat: [1.5, 1.5] });
  const [primary, accent, bone, glow] = profile.colors;
  return {
    primary: new THREE.MeshStandardMaterial({ color: primary, map: hideTexture, roughness: 0.68, metalness: 0.2 }),
    accent: new THREE.MeshStandardMaterial({ color: accent, map: accentTexture, roughness: 0.38, metalness: 0.65 }),
    bone: new THREE.MeshStandardMaterial({ color: bone, map: accentTexture, roughness: 0.64, metalness: 0.12 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x08090b, roughness: 0.82, metalness: 0.18 }),
    glow: new THREE.MeshStandardMaterial({
      color: glow,
      emissive: glow,
      emissiveIntensity: 2.1,
      roughness: 0.28,
      metalness: 0.12,
    }),
  };
}

let featureSerial = 0;

function addFeatureMesh(parent, geometry, material, featureTag, {
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  name = '',
  castShadow = true,
  visionExempt = false,
} = {}) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name || `bossVisualFeature:${featureTag}:${featureSerial += 1}`;
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...scale);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  mesh.userData.bossVisualDetail = true;
  mesh.userData.featureTag = featureTag;
  mesh.userData.visionExempt = visionExempt;
  parent.add(mesh);
  return mesh;
}

function addFoundation(root, profile, materials) {
  const torsoGeometry = new THREE.SphereGeometry(1, 48, 32);
  const headGeometry = new THREE.SphereGeometry(1, 40, 28);
  const limbGeometry = new THREE.SphereGeometry(1, 32, 20);
  const { torso, head, limbs } = profile.foundation;

  addFeatureMesh(root, torsoGeometry, materials.primary, 'high_definition_anatomy', torso);
  addFeatureMesh(root, headGeometry, materials.primary, 'high_definition_anatomy', head);
  limbs.forEach((limb) => addFeatureMesh(root, limbGeometry, materials.primary, 'high_definition_anatomy', limb));
}

function addDreadFan(root, material, featureTag, {
  count = 12,
  origin = [0, 8, -0.5],
  width = 1.2,
  length = 3.6,
  spread = 1.2,
} = {}) {
  for (let index = 0; index < count; index += 1) {
    const ratio = count === 1 ? 0.5 : index / (count - 1);
    const angle = THREE.MathUtils.lerp(-spread, spread, ratio);
    const x = Math.sin(angle) * width;
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(origin[0] + x, origin[1], origin[2]),
      new THREE.Vector3(origin[0] + x * 1.18, origin[1] - length * 0.48, origin[2] - 0.65),
      new THREE.Vector3(origin[0] + x * 1.28, origin[1] - length, origin[2] - 0.2),
    );
    addFeatureMesh(root, new THREE.TubeGeometry(curve, 18, 0.12, 8, false), material, featureTag);
  }
}

function addTrophyBandolier(root, materials, featureTag, origin = [0, 5.2, 1]) {
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(origin[0] - 1.35, origin[1] + 1.2, origin[2]),
    new THREE.Vector3(origin[0], origin[1], origin[2] + 0.18),
    new THREE.Vector3(origin[0] + 1.25, origin[1] - 1.25, origin[2]),
  );
  addFeatureMesh(root, new THREE.TubeGeometry(curve, 28, 0.12, 8, false), materials.dark, featureTag);
  const trophyGeometry = new THREE.IcosahedronGeometry(0.28, 2);
  for (let index = 0; index < 5; index += 1) {
    addFeatureMesh(root, trophyGeometry, materials.bone, featureTag, {
      position: [origin[0] - 0.82 + index * 0.4, origin[1] + 0.52 - index * 0.4, origin[2] + 0.18],
      scale: [0.82, 1.15, 0.72],
    });
  }
}

function buildGoliath(root, materials, features) {
  for (const side of [-1, 1]) {
    addFeatureMesh(root, new THREE.SphereGeometry(1, 28, 18), materials.primary, features[0], {
      position: [side * 2.65, 5.2, 0.45],
      scale: [0.82, 1.65, 3.65],
    });
  }
  const plateGeometry = new THREE.ConeGeometry(0.9, 3, 18, 3);
  for (let index = 0; index < 8; index += 1) {
    addFeatureMesh(root, plateGeometry, materials.accent, features[1], {
      position: [0, 7.3 - Math.abs(index - 3.5) * 0.16, -4.8 + index * 1.38],
      rotation: [-0.72, 0, index % 2 ? 0.06 : -0.06],
      scale: [1 - Math.abs(index - 3.5) * 0.045, 1, 0.72],
    });
  }
  for (const side of [-1, 1]) {
    addFeatureMesh(root, new THREE.ConeGeometry(0.56, 4.2, 20, 4), materials.bone, features[2], {
      position: [side * 1.1, 8, 7.2],
      rotation: [1.05, 0, side * -0.18],
    });
  }
  for (let index = 0; index < 4; index += 1) {
    addFeatureMesh(root, new THREE.OctahedronGeometry(1.25 - index * 0.14, 2), materials.accent, features[3], {
      position: [0, 3.7 - index * 0.35, -6.8 - index * 2.05],
      scale: [1.25, 0.78, 1.6],
    });
  }
}

function buildQueen(root, materials, features) {
  for (let index = -2; index <= 2; index += 1) {
    addFeatureMesh(root, new THREE.ConeGeometry(1.25, 6.5, 20, 4), materials.accent, features[0], {
      position: [index * 1.18, 11.5 - Math.abs(index) * 0.35, 3.5],
      rotation: [-1.08, 0, index * -0.12],
      scale: [1, 1, 0.42],
    });
  }
  for (let rib = 0; rib < 6; rib += 1) {
    addFeatureMesh(root, new THREE.TorusGeometry(2.8 - rib * 0.12, 0.18, 12, 36, Math.PI), materials.bone, features[1], {
      position: [0, 7.6 - rib * 0.65, 2.7 - rib * 0.45],
      rotation: [Math.PI / 2, 0, Math.PI / 2],
    });
  }
  for (const side of [-1, 1]) {
    for (let index = 0; index < 3; index += 1) {
      addFeatureMesh(root, new THREE.TorusGeometry(1.2 + index * 0.18, 0.17, 10, 32, Math.PI * 1.25), materials.primary, features[2], {
        position: [side * (1.6 + index * 0.38), 8.4 + index * 0.35, -2.2 - index * 1.25],
        rotation: [0.2, side * 0.62, side * 0.35],
      });
    }
    addFeatureMesh(root, new THREE.CylinderGeometry(0.22, 0.45, 4.5, 16, 3), materials.primary, features[3], {
      position: [side * 2.45, 6, 5.1],
      rotation: [0.2, 0, side * 0.82],
    });
  }
}
function buildGridAlien(root, materials, features) {
  // Dôme lisse et allongé : la masse avant reste immédiatement distincte de
  // la couronne d'une reine et de la tête hybride du Predalien.
  addFeatureMesh(root, new THREE.CapsuleGeometry(1.25, 4.5, 16, 38), materials.primary, features[0], {
    name: 'gridAlienHighDefinitionDome',
    position: [0, 8.82, 3.15],
    rotation: [Math.PI / 2, 0, 0],
    scale: [1.12, 1, 0.86],
  });

  // Les quatre tubes dorsaux sont construits comme des courbes indépendantes
  // afin de conserver un profil lisible de trois quarts.
  for (const side of [-1, 1]) {
    for (let row = 0; row < 2; row += 1) {
      const x = side * (0.76 + row * 0.45);
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x, 7.1 - row * 0.4, -0.55),
        new THREE.Vector3(x * 1.18, 8.5 - row * 0.22, -1.45 - row * 0.55),
        new THREE.Vector3(x * 1.28, 9.25 - row * 0.32, -3.05 - row * 0.72),
      ]);
      addFeatureMesh(root, new THREE.TubeGeometry(curve, 24, 0.22 - row * 0.025, 9, false), materials.accent, features[1]);
    }
  }

  const jaw = new THREE.Group();
  jaw.name = 'gridAlienHighDefinitionInnerJaw';
  jaw.position.set(0, 8.05, 4.75);
  addFeatureMesh(jaw, new THREE.CylinderGeometry(0.26, 0.34, 2.35, 16, 3), materials.dark, features[2], {
    position: [0, 0, 0.95],
    rotation: [Math.PI / 2, 0, 0],
  });
  addFeatureMesh(jaw, new THREE.ConeGeometry(0.43, 0.82, 16, 3), materials.bone, features[2], {
    position: [0, 0, 2.35],
    rotation: [Math.PI / 2, 0, 0],
  });
  root.add(jaw);

  const tail = new THREE.Group();
  tail.name = 'gridAlienHighDefinitionTail';
  tail.userData.featureTag = features[3];
  for (let index = 0; index < 10; index += 1) {
    const radius = Math.max(0.22, 0.62 - index * 0.04);
    addFeatureMesh(tail, new THREE.CapsuleGeometry(radius, 1.2, 7, 14), index < 4 ? materials.primary : materials.accent, features[3], {
      position: [Math.sin(index * 0.31) * index * 0.16, 4.05 - index * 0.09, -2.7 - index * 1.32],
      rotation: [Math.PI / 2, 0, -Math.sin(index * 0.31) * 0.12],
    });
  }
  addFeatureMesh(tail, new THREE.ConeGeometry(0.75, 3.5, 16, 4), materials.bone, features[3], {
    position: [0.15, 3.05, -16.4],
    rotation: [-Math.PI / 2, 0, -0.08],
    scale: [0.72, 1, 1.3],
  });
  root.add(tail);

  // La grille acide est une marque identitaire permanente, pas une émission
  // dépendante d'une phase ou d'un état de rage.
  for (let index = -1; index <= 1; index += 1) {
    addFeatureMesh(root, new THREE.BoxGeometry(0.085, 0.085, 3.65), materials.glow, features[4], {
      position: [index * 0.46, 9.38, 3.2],
      castShadow: false,
      visionExempt: true,
    });
    addFeatureMesh(root, new THREE.BoxGeometry(1.9, 0.085, 0.085), materials.glow, features[4], {
      position: [0, 9.4, 2.45 + index * 0.75],
      castShadow: false,
      visionExempt: true,
    });
  }
}

function buildBadBlood(root, materials, features) {
  addFeatureMesh(root, new THREE.SphereGeometry(1, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.72), materials.bone, features[0], {
    position: [0, 5.58, 0.86],
    scale: [1.02, 1.14, 0.48],
  });
  for (let slash = 0; slash < 3; slash += 1) {
    addFeatureMesh(root, new THREE.BoxGeometry(0.055, 0.72, 0.08), materials.glow, features[0], {
      position: [0.12 + slash * 0.18, 5.55 - slash * 0.08, 1.37],
      rotation: [0, 0, -0.48],
      castShadow: false,
      visionExempt: true,
    });
  }
  addTrophyBandolier(root, materials, features[1], [0, 4.2, 0.86]);
  addFeatureMesh(root, new THREE.SphereGeometry(1, 30, 18), materials.accent, features[2], {
    position: [-1.42, 4.65, 0],
    scale: [1.15, 0.72, 1],
  });
  for (const side of [-1, 1]) {
    for (const offset of [-0.16, 0.16]) {
      addFeatureMesh(root, new THREE.ConeGeometry(0.09, 2.9, 12, 2), materials.bone, features[3], {
        position: [side * (1.68 + offset), 2.7, 1.55],
        rotation: [Math.PI / 2, 0, side * -0.04],
      });
    }
  }
  addDreadFan(root, materials.dark, features[2], { count: 11, origin: [0, 5.1, -0.5], width: 0.95, length: 2.6 });
}

function buildPredalien(root, materials, features) {
  addFeatureMesh(root, new THREE.CapsuleGeometry(1.65, 5.8, 12, 28), materials.accent, features[0], {
    position: [0, 10.4, 5.1],
    rotation: [Math.PI / 2, 0, 0],
    scale: [1.28, 1, 0.82],
  });
  for (const side of [-1, 1]) {
    for (const offset of [-0.45, 0.45]) {
      addFeatureMesh(root, new THREE.ConeGeometry(0.35, 2.7, 16, 3), materials.bone, features[1], {
        position: [side * (1.28 + Math.abs(offset)), 8.55 + offset * 0.28, 9.3],
        rotation: [1.32, 0, side * (0.32 + offset * 0.16)],
      });
    }
  }
  addDreadFan(root, materials.dark, features[2], { count: 14, origin: [0, 10, 1.3], width: 1.65, length: 4.2, spread: 1.35 });
  for (let index = 0; index < 7; index += 1) {
    addFeatureMesh(root, new THREE.ConeGeometry(0.42, 2.1, 14, 3), materials.accent, features[3], {
      position: [0, 5.6 - index * 0.46, -7.8 - index * 2.25],
      rotation: [-Math.PI / 2, 0, index % 2 ? 0.18 : -0.18],
    });
  }
}

function buildSuperPredator(root, materials, features) {
  addFeatureMesh(root, new THREE.SphereGeometry(1, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.72), materials.bone, features[0], {
    position: [0, 9.48, 1.03],
    scale: [1.34, 1.28, 0.62],
  });
  for (const side of [-1, 1]) {
    for (const x of [0.52, 0.92]) {
      addFeatureMesh(root, new THREE.ConeGeometry(0.2, 1.55, 14, 3), materials.bone, features[0], {
        position: [side * x, 8.68, 1.58],
        rotation: [0.25, 0, side * 0.42],
      });
    }
    addFeatureMesh(root, new THREE.SphereGeometry(1, 32, 20), side < 0 ? materials.accent : materials.dark, features[1], {
      position: [side * 3.05, 7.3, 0],
      scale: [1.5, 0.85, 1.22],
    });
  }
  addDreadFan(root, materials.dark, features[2], { count: 16, origin: [0, 8.95, -0.6], width: 1.4, length: 4.5, spread: 1.4 });
  const caster = new THREE.Group();
  caster.position.set(-3.55, 8.45, -0.1);
  caster.userData.featureTag = features[3];
  for (const x of [-0.34, 0.34]) {
    addFeatureMesh(caster, new THREE.CylinderGeometry(0.3, 0.42, 4.2, 20, 3), materials.accent, features[3], {
      position: [x, 0, 1.8],
      rotation: [Math.PI / 2, 0, 0],
    });
    addFeatureMesh(caster, new THREE.SphereGeometry(0.24, 16, 12), materials.glow, features[3], {
      position: [x, 0, 3.95],
      castShadow: false,
      visionExempt: true,
    });
  }
  root.add(caster);
}

function buildFeral(root, materials, features) {
  addFeatureMesh(root, new THREE.ConeGeometry(1.18, 2.4, 20, 4), materials.bone, features[0], {
    position: [0, 9.15, 0.88],
    rotation: [Math.PI / 2, 0, 0],
    scale: [1, 0.62, 1.08],
  });
  for (const side of [-1, 1]) {
    for (let rib = 0; rib < 4; rib += 1) {
      addFeatureMesh(root, new THREE.ConeGeometry(0.16, 1.3, 12, 2), materials.bone, features[1], {
        position: [side * (1.08 + rib * 0.12), 6.8 - rib * 0.55, 0.8],
        rotation: [Math.PI / 2, 0, side * 0.86],
      });
    }
  }
  addTrophyBandolier(root, materials, features[2], [0, 5.35, 0.9]);
  for (let segment = -2; segment <= 2; segment += 1) {
    addFeatureMesh(root, new THREE.SphereGeometry(1, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2), materials.bone, features[3], {
      position: [-2.6 + segment * 0.5, 5.35 + Math.abs(segment) * 0.08, 1.2],
      rotation: [Math.PI / 2, 0, segment * 0.12],
      scale: [0.72, 0.24, 1.05],
    });
  }
  addFeatureMesh(root, new THREE.BoxGeometry(0.88, 0.62, 2.2, 4, 3, 8), materials.accent, features[3], {
    position: [-2.18, 3.9, 0.92],
  });
  addDreadFan(root, materials.dark, features[1], { count: 12, origin: [0, 8.75, -0.52], width: 1.05, length: 3.6 });
}

function buildWolf(root, materials, features) {
  addFeatureMesh(root, new THREE.SphereGeometry(1, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.72), materials.accent, features[0], {
    position: [0, 9.12, 0.95],
    scale: [1.16, 1.28, 0.56],
  });
  for (let slash = 0; slash < 3; slash += 1) {
    addFeatureMesh(root, new THREE.BoxGeometry(0.05, 0.7, 0.07), materials.glow, features[0], {
      position: [-0.28 + slash * 0.16, 9.05 - slash * 0.06, 1.5],
      rotation: [0, 0, 0.45],
      castShadow: false,
      visionExempt: true,
    });
  }
  for (const side of [-1, 1]) {
    addFeatureMesh(root, new THREE.CylinderGeometry(0.28, 0.38, 3.5, 20, 3), materials.accent, features[1], {
      position: [side * 2.35, 8.15, 1.55],
      rotation: [Math.PI / 2, 0, 0],
    });
    addFeatureMesh(root, new THREE.SphereGeometry(0.22, 16, 12), materials.glow, features[1], {
      position: [side * 2.35, 8.15, 3.35],
      castShadow: false,
      visionExempt: true,
    });
    for (const x of [-0.42, 0.42]) {
      addFeatureMesh(root, new THREE.CylinderGeometry(0.32, 0.4, 2.8, 18, 3), materials.accent, features[2], {
        position: [side * 0.85 + x * 0.35, 5.9, -1.55],
        rotation: [0.06, 0, side * 0.08],
      });
    }
  }
  for (let index = 0; index < 11; index += 1) {
    addFeatureMesh(root, new THREE.TorusGeometry(0.32, 0.09, 10, 18, Math.PI * 1.4), materials.accent, features[3], {
      position: [2.65 + index * 0.2, 4.2 - index * 0.31, -0.35 - index * 0.42],
      rotation: [0.2, index * 0.14, -0.35],
      scale: [1, 1, 1.25],
    });
  }
  addDreadFan(root, materials.dark, features[0], { count: 14, origin: [0, 8.8, -0.62], width: 1.15, length: 4 });
}

function buildKalisk(root, materials, features) {
  for (let index = 0; index < 9; index += 1) {
    const taper = 1 - Math.abs(index - 4) * 0.055;
    addFeatureMesh(root, new THREE.SphereGeometry(1, 32, 18, 0, Math.PI * 2, 0, Math.PI / 2), materials.accent, features[0], {
      position: [0, 7.45 - Math.abs(index - 4) * 0.1, -4.9 + index * 1.25],
      scale: [3.35 * taper, 0.72, 1.02],
    });
  }
  addFeatureMesh(root, new THREE.SphereGeometry(1.12, 36, 24), materials.glow, features[1], {
    name: 'kaliskHighDefinitionRegenerativeCore',
    position: [0, 6.86, -0.2],
    scale: [1.25, 0.58, 1.62],
    castShadow: false,
    visionExempt: true,
  });
  for (const side of [-1, 1]) {
    for (const offset of [-0.52, 0.52]) {
      addFeatureMesh(root, new THREE.ConeGeometry(0.34, 3.65, 18, 4), materials.bone, features[2], {
        position: [side * (1.15 + Math.abs(offset) * 0.42), 5.25 + offset * 0.22, 7.75],
        rotation: [Math.PI / 2 - 0.15, 0, side * (0.2 + offset * 0.12)],
      });
    }
  }
  for (let index = 0; index < 7; index += 1) {
    addFeatureMesh(root, new THREE.ConeGeometry(0.78 - index * 0.07, 2.35, 16, 3), index < 3 ? materials.accent : materials.bone, features[3], {
      position: [(index % 2 ? 1 : -1) * 0.32, 5 - index * 0.22, -6.6 - index * 1.85],
      rotation: [-Math.PI / 2, 0, index % 2 ? 0.28 : -0.28],
    });
  }
}

const BUILDERS = Object.freeze({
  goliath: buildGoliath,
  queen: buildQueen,
  grid_alien: buildGridAlien,
  bad_blood: buildBadBlood,
  predalien: buildPredalien,
  super_predator: buildSuperPredator,
  feral: buildFeral,
  wolf: buildWolf,
  kalisk: buildKalisk,
  city_hunter: () => {},
});

export function countBossVisualTriangles(root) {
  let triangles = 0;
  root?.traverse((object) => {
    if (!object.isMesh || !object.geometry) return;
    const { index, attributes } = object.geometry;
    triangles += index ? index.count / 3 : (attributes.position?.count ?? 0) / 3;
  });
  return Math.round(triangles);
}

export function applyBossVisualDetail(boss, bossType) {
  if (!boss?.mesh?.isObject3D) throw new TypeError('applyBossVisualDetail requiert un boss doté d’un mesh THREE.');

  if (boss.nativeHighDetail === true) {
    const nativeDetail = boss.visualDetail ?? boss.mesh;
    if (nativeDetail?.userData?.nativeHighDetail !== true) {
      throw new TypeError(`Le boss natif HD ${String(bossType)} ne documente pas son détail visuel.`);
    }
    boss.visualDetail = nativeDetail;
    return nativeDetail;
  }

  const archetype = BOSS_TYPE_TO_ARCHETYPE[bossType] ?? bossType;
  const profile = BOSS_VISUAL_PROFILES[archetype];
  if (!profile) throw new RangeError(`Profil visuel de boss inconnu : ${String(bossType)}.`);

  const existing = boss.mesh.getObjectByName(`bossVisualDetail:${archetype}`);
  if (existing) return existing;

  const root = new THREE.Group();
  root.name = `bossVisualDetail:${archetype}`;
  root.renderOrder = 1;
  root.userData.bossVisualDetail = true;
  root.userData.archetype = archetype;
  root.userData.featureTags = [...profile.features];
  root.userData.runtimeTexturePaths = [...profile.texturePaths];

  const materials = makeMaterials(profile);
  addFoundation(root, profile, materials);
  BUILDERS[archetype](root, materials, profile.features);
  root.userData.triangleCount = countBossVisualTriangles(root);

  boss.mesh.add(root);
  boss.visualDetail = root;
  boss.mesh.userData.bossVisualDetail = Object.freeze({
    archetype,
    featureTags: Object.freeze([...profile.features]),
    runtimeTexturePaths: Object.freeze([...profile.texturePaths]),
    triangleCount: root.userData.triangleCount,
  });
  return root;
}

function setFeatureVisibility(root, featureTag, visible) {
  root?.traverse((object) => {
    const aliases = object.userData?.bossVisualFeatureTags;
    if (object.userData?.featureTag === featureTag || aliases?.includes?.(featureTag)) {
      object.visible = visible;
    }
  });
}

export function syncBossVisualDetail(boss, bossType) {
  const root = boss?.visualDetail;
  if (!root) return false;
  const archetype = BOSS_TYPE_TO_ARCHETYPE[bossType] ?? bossType;

  if (archetype === 'goliath') {
    setFeatureVisibility(root, 'crown_horn', boss.hornIntact !== false);
    setFeatureVisibility(root, 'tail_guard', boss.tailIntact !== false);
  } else if (archetype === 'queen') {
    setFeatureVisibility(root, 'royal_crown', boss.crownIntact !== false);
  } else if (archetype === 'grid_alien') {
    const headVisible = boss.headIntact !== false;
    setFeatureVisibility(root, 'elongated_translucent_dome', headVisible);
    setFeatureVisibility(root, 'inner_jaw', headVisible);
    setFeatureVisibility(root, 'segmented_blade_tail', boss.tailIntact !== false);
  } else if (archetype === 'predalien') {
    const headVisible = boss.headIntact !== false;
    setFeatureVisibility(root, 'elongated_dome', headVisible);
    setFeatureVisibility(root, 'yautja_mandibles', headVisible);
    setFeatureVisibility(root, 'biomechanical_dreadlocks', headVisible);
    setFeatureVisibility(root, 'spear_tail_spines', boss.tailIntact !== false);
  } else if (archetype === 'super_predator') {
    setFeatureVisibility(root, 'tusked_biomask', boss.maskIntact !== false);
  } else if (archetype === 'wolf') {
    setFeatureVisibility(root, 'scarred_wolf_biomask', boss.maskIntact !== false);
    setFeatureVisibility(root, 'cleaner_canisters', boss.cleanerKitIntact !== false);
  } else if (archetype === 'city_hunter') {
    setFeatureVisibility(root, 'angular_biomask', boss.maskIntact !== false);
  } else if (archetype === 'kalisk') {
    setFeatureVisibility(root, 'adaptive_carapace', boss.carapaceIntact !== false);
    setFeatureVisibility(root, 'regenerative_core', boss.coreExposed === true && boss.isDead !== true);
  }
  return true;
}

export function disposeBossVisualDetail(boss) {
  const root = boss?.visualDetail
    ?? boss?.mesh?.children?.find((child) => child.userData?.bossVisualDetail === true);
  if (!root) return false;
  // Le détail natif est le mesh de gameplay lui-même. Son cycle de vie reste
  // celui du boss et ne doit jamais être détaché comme une greffe générique.
  if (root.userData?.nativeHighDetail === true) return false;
  const disposed = disposeObject3D(root);
  if (boss?.visualDetail === root) boss.visualDetail = null;
  if (boss?.mesh?.userData) delete boss.mesh.userData.bossVisualDetail;
  return disposed;
}
