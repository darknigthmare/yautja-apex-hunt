export const DEFAULT_SETTINGS = Object.freeze({
  audioEnabled: true,
  reducedMotion: false,
  highContrast: false,
  hudScale: 1,
});

export const HUNT_DEFINITIONS = Object.freeze({
  goliath: {
    id: 'goliath',
    name: 'Goliath Xeno-Akumo',
    sourceTier: 'ORIGINAL',
    continuity: 'Création originale du fan game',
    objective: 'Briser ses défenses, puis prélever le trophée sans camouflage pour maximiser l’honneur.',
    reward: 1200,
  },
  xeno_queen: {
    id: 'xeno_queen',
    name: 'Reine xénomorphe',
    sourceTier: 'AVP_SCREEN',
    continuity: 'Continuité cinéma Alien vs. Predator',
    objective: 'Éviter l’acide, neutraliser les œufs et sectionner la queue avant le prélèvement.',
    reward: 1500,
  },
  bad_blood: {
    id: 'bad_blood',
    name: 'Chasseur renégat',
    sourceTier: 'LICENSED_EU',
    continuity: 'Terminologie issue de l’univers étendu licencié',
    objective: 'Déjouer son camouflage et remporter le duel sans dépendre du canon à plasma.',
    reward: 1350,
  },
  predalien: {
    id: 'predalien',
    name: 'Predalien',
    sourceTier: 'AVP_SCREEN',
    continuity: 'Continuité cinéma AVP: Requiem',
    objective: 'Résister à la frénésie acide et rompre les appendices avant l’exécution.',
    reward: 1800,
  },
});

export const BIOME_DEFINITIONS = Object.freeze({
  jungle: {
    name: 'Jungle de réserve',
    sourceTier: 'SCREEN_INSPIRED',
    texture: '/assets/textures/jungle-ground.webp',
  },
  hive_lv426: {
    name: 'Ruche souterraine',
    sourceTier: 'AVP_SCREEN',
    texture: '/assets/textures/hive-resin.webp',
  },
  ryushi_desert: {
    name: 'Désert de Ryushi',
    sourceTier: 'LICENSED_EU',
    texture: '/assets/textures/ryushi-sand.webp',
  },
  yautja_prime: {
    name: 'Arène de clan',
    sourceTier: 'LICENSED_EU',
    texture: '/assets/textures/yautja-stone.webp',
  },
});
