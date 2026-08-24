export const ENVIRONMENT_PROP_TEXTURES = Object.freeze({
  frontierPanels: '/assets/textures/ryushi-frontier-panels.webp',
  hiveMembrane: '/assets/textures/hive-biomechanical-membrane.webp',
  ceremonialBronze: '/assets/textures/yautja-ceremonial-bronze.webp',
  gennaSporeHide: '/assets/textures/genna-spore-pod-hide.webp',
});

export const ENVIRONMENT_PERFORMANCE_BUDGETS = Object.freeze({
  maxProps: 96,
  maxPoi: 4,
  maxHazards: 4,
  maxColliders: 72,
  maxDrawCalls: 180,
  maxTriangles: 220000,
});

const PLAN_DATA = {
  jungle: {
    sourceTier: 'ORIGINAL',
    basisTier: 'SCREEN',
    textureReferences: [
      '/assets/textures/jungle-bark.webp',
      '/assets/textures/yautja-stone.webp',
      ENVIRONMENT_PROP_TEXTURES.frontierPanels,
      ENVIRONMENT_PROP_TEXTURES.ceremonialBronze,
    ],
    props: [
      { id: 'jungle-west-ritual-gate', type: 'ritual_gate', position: [-74, 0, -34], rotation: 0.22, scale: 1.08, texture: ENVIRONMENT_PROP_TEXTURES.ceremonialBronze, colliderRadius: 8, perchHeight: 15 },
      { id: 'jungle-east-command-camp', type: 'field_camp', position: [96, 0, 26], rotation: -0.38, scale: 1.05, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, colliderRadius: 15 },
      { id: 'jungle-north-trophy-tree', type: 'trophy_tree', position: [4, 0, -142], rotation: 0.1, scale: 1.12, texture: '/assets/textures/jungle-bark.webp', colliderRadius: 9, perchHeight: 23 },
      { id: 'jungle-west-cover', type: 'cover_cluster', position: [-42, 0, 34], rotation: 0.6, scale: 1, texture: '/assets/textures/yautja-stone.webp', colliderRadius: 7 },
      { id: 'jungle-east-cover', type: 'cover_cluster', position: [48, 0, -46], rotation: -0.4, scale: 0.9, texture: '/assets/textures/yautja-stone.webp', colliderRadius: 6 },
      { id: 'jungle-south-wreck', type: 'wreckage', position: [-104, 0, 88], rotation: 0.85, scale: 0.95, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, colliderRadius: 11 },
      { id: 'jungle-route-beacons', type: 'beacon_line', position: [0, 0, -72], rotation: 0, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.ceremonialBronze, instances: 5 },
      { id: 'jungle-river-stones', type: 'stone_line', position: [58, 0, 104], rotation: 1.2, scale: 1, texture: '/assets/textures/yautja-stone.webp', instances: 8 },
    ],
    pointsOfInterest: [
      { id: 'jungle-poi-plasma-scars', type: 'hunt_trace', label: 'Impacts de plasma ritualisés', position: [-70, 0, -30], interactionRadius: 12, interactionType: 'scan_archive', honor: 80, message: 'Analyse : tirs précis, cadence de chasse et voie ouest identifiés.' },
      { id: 'jungle-poi-commando-record', type: 'field_record', label: 'Journal du camp de traque', position: [91, 0, 35], interactionRadius: 13, interactionType: 'decode_record', honor: 70, message: 'Archive : l’escouade suivait une signature invisible avant la rupture du camp.' },
      { id: 'jungle-poi-trophy-markers', type: 'trophy_archive', label: 'Arbre des prises anciennes', position: [4, 0, -134], interactionRadius: 14, interactionType: 'scan_trophies', honor: 95, message: 'Marques d’honneur : trois itinéraires de chasse convergent vers la clairière.' },
    ],
    hazardZones: [
      { id: 'jungle-hazard-snare-vines', type: 'snare_vines', position: [46, 0, -78], radius: 7, damage: 8, interval: 2.8, status: 'venom', message: 'LIANES PRÉDATRICES — ENDURANCE CONTAMINÉE' },
    ],
  },
  hive_lv426: {
    sourceTier: 'ORIGINAL',
    basisTier: 'AVP_SCREEN',
    textureReferences: [
      '/assets/textures/hive-resin.webp',
      '/assets/textures/xeno-egg-hide.webp',
      ENVIRONMENT_PROP_TEXTURES.hiveMembrane,
      ENVIRONMENT_PROP_TEXTURES.frontierPanels,
    ],
    props: [
      { id: 'hive-south-bulkhead', type: 'hive_bulkhead', position: [0, 0, 112], rotation: Math.PI, scale: 1.16, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, colliderRadius: 15 },
      { id: 'hive-west-nursery', type: 'egg_nursery', position: [-82, 0, 2], rotation: 0.28, scale: 1.05, texture: ENVIRONMENT_PROP_TEXTURES.hiveMembrane, colliderRadius: 14 },
      { id: 'hive-north-royal-dais', type: 'royal_dais', position: [2, 0, -145], rotation: 0, scale: 1.14, texture: ENVIRONMENT_PROP_TEXTURES.hiveMembrane, colliderRadius: 15 },
      { id: 'hive-east-colonial-wreck', type: 'wreckage', position: [102, 0, -28], rotation: -0.54, scale: 1.1, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, colliderRadius: 13 },
      { id: 'hive-west-rib-corridor', type: 'rib_corridor', position: [-44, 0, -66], rotation: -0.34, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.hiveMembrane, instances: 6 },
      { id: 'hive-east-rib-corridor', type: 'rib_corridor', position: [48, 0, -72], rotation: 0.36, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.hiveMembrane, instances: 6 },
      { id: 'hive-host-cocoons', type: 'cocoon_cluster', position: [-118, 0, -86], rotation: 0.7, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.hiveMembrane, instances: 5 },
      { id: 'hive-cleaner-traces', type: 'cleaner_canisters', position: [78, 0, 54], rotation: -0.2, scale: 1, texture: '/assets/textures/wolf-cleaner-alloy.webp', instances: 4 },
    ],
    pointsOfInterest: [
      { id: 'hive-poi-bulkhead-log', type: 'field_record', label: 'Console coloniale corrodée', position: [8, 0, 104], interactionRadius: 13, interactionType: 'decode_record', honor: 75, message: 'Archive : perte d’énergie, membranes en expansion et retrait vers le sas sud.' },
      { id: 'hive-poi-nursery', type: 'hive_sample', label: 'Nursery active', position: [-76, 0, 4], interactionRadius: 14, interactionType: 'scan_archive', honor: 90, message: 'Analyse : signatures embryonnaires concentrées dans la chambre occidentale.' },
      { id: 'hive-poi-cleaner', type: 'cleaner_trace', label: 'Résidus d’agent Cleaner', position: [78, 0, 58], interactionRadius: 12, interactionType: 'scan_archive', honor: 85, message: 'Analyse : dissolution contrôlée et trajectoire d’un chasseur vétéran.' },
    ],
    hazardZones: [
      { id: 'hive-hazard-acid-west', type: 'acid_pool', position: [-22, 0, -42], radius: 8, damage: 10, interval: 2.2, status: 'corrosion', message: 'BASSIN ACIDE — CAMOUFLAGE COMPROMIS' },
      { id: 'hive-hazard-acid-east', type: 'acid_pool', position: [34, 0, -96], radius: 7, damage: 10, interval: 2.2, status: 'corrosion', message: 'BASSIN ACIDE — CAMOUFLAGE COMPROMIS' },
    ],
  },
  ryushi_desert: {
    sourceTier: 'LICENSED_EU',
    textureReferences: [
      '/assets/textures/ryushi-sand.webp',
      ENVIRONMENT_PROP_TEXTURES.frontierPanels,
      '/assets/textures/yautja-stone.webp',
    ],
    props: [
      { id: 'ryushi-north-homestead', type: 'frontier_homestead', position: [0, 0, -154], rotation: 0.04, scale: 1.18, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, colliderRadius: 19 },
      { id: 'ryushi-west-water-tower', type: 'water_tower', position: [-94, 0, -92], rotation: 0, scale: 1.04, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, colliderRadius: 8, perchHeight: 28 },
      { id: 'ryushi-east-stock-pen', type: 'stock_pen', position: [104, 0, -58], rotation: -0.3, scale: 1.1, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, colliderRadius: 15 },
      { id: 'ryushi-south-buried-crawler', type: 'wreckage', position: [-76, 0, 92], rotation: 0.72, scale: 1.18, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, colliderRadius: 14 },
      { id: 'ryushi-west-windbreak', type: 'windbreak', position: [-46, 0, -24], rotation: 0.42, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, instances: 6 },
      { id: 'ryushi-east-windbreak', type: 'windbreak', position: [52, 0, 8], rotation: -0.5, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, instances: 6 },
      { id: 'ryushi-signal-masts', type: 'beacon_line', position: [10, 0, -84], rotation: 0, scale: 0.9, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, instances: 4 },
      { id: 'ryushi-bone-trail', type: 'bone_line', position: [92, 0, 72], rotation: -0.9, scale: 1, texture: '/assets/textures/trophy-bone.webp', instances: 8 },
    ],
    pointsOfInterest: [
      { id: 'ryushi-poi-colony-log', type: 'field_record', label: 'Registre de la colonie', position: [12, 0, -144], interactionRadius: 14, interactionType: 'decode_record', honor: 80, message: 'Archive : les colons ont condamné les galeries sous le complexe d’élevage.' },
      { id: 'ryushi-poi-signal', type: 'seismic_array', label: 'Balise sismique', position: [-86, 0, -90], interactionRadius: 12, interactionType: 'tune_beacon', honor: 75, message: 'Balise recalibrée : vibrations souterraines et voie protégée détectées.' },
      { id: 'ryushi-poi-blooding', type: 'hunt_trace', label: 'Trace de blooding dans le sable', position: [96, 0, 70], interactionRadius: 13, interactionType: 'scan_archive', honor: 90, message: 'Analyse : une chasse rituelle a traversé l’enclos vers les dunes orientales.' },
    ],
    hazardZones: [
      { id: 'ryushi-hazard-heat-vent', type: 'heat_vent', position: [24, 0, -62], radius: 8, damage: 7, interval: 2.5, status: 'energy_jam', message: 'VENT THERMIQUE — SYSTÈMES SURCHAUFFÉS' },
    ],
  },
  yautja_prime: {
    sourceTier: 'ORIGINAL',
    basisTier: 'SCREEN',
    textureReferences: [
      '/assets/textures/yautja-stone.webp',
      '/assets/textures/yautja-alloy.webp',
      '/assets/textures/trophy-bone.webp',
      ENVIRONMENT_PROP_TEXTURES.ceremonialBronze,
    ],
    props: [
      { id: 'prime-north-elder-gate', type: 'clan_gate', position: [0, 0, -166], rotation: 0, scale: 1.25, texture: ENVIRONMENT_PROP_TEXTURES.ceremonialBronze, colliderRadius: 14, perchHeight: 22 },
      { id: 'prime-center-blooding-dais', type: 'blooding_dais', position: [0, 0, -20], rotation: 0, scale: 1.08, texture: '/assets/textures/yautja-stone.webp', colliderRadius: 13 },
      { id: 'prime-west-weapon-shrine', type: 'weapon_shrine', position: [-92, 0, -52], rotation: 0.42, scale: 1.04, texture: ENVIRONMENT_PROP_TEXTURES.ceremonialBronze, colliderRadius: 11 },
      { id: 'prime-east-trophy-gallery', type: 'trophy_gallery', position: [96, 0, -48], rotation: -0.45, scale: 1.05, texture: ENVIRONMENT_PROP_TEXTURES.ceremonialBronze, colliderRadius: 12 },
      { id: 'prime-west-low-cover', type: 'cover_cluster', position: [-46, 0, 28], rotation: 0.65, scale: 1.1, texture: '/assets/textures/yautja-stone.webp', colliderRadius: 7 },
      { id: 'prime-east-low-cover', type: 'cover_cluster', position: [48, 0, 30], rotation: -0.65, scale: 1.1, texture: '/assets/textures/yautja-stone.webp', colliderRadius: 7 },
      { id: 'prime-clan-braziers', type: 'brazier_ring', position: [0, 0, -76], rotation: 0, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.ceremonialBronze, instances: 8 },
      { id: 'prime-spectator-totems', type: 'totem_ring', position: [0, 0, -26], rotation: 0, scale: 1, texture: '/assets/textures/trophy-bone.webp', instances: 10 },
    ],
    pointsOfInterest: [
      { id: 'prime-poi-elder-law', type: 'honor_archive', label: 'Stèle de la loi du clan', position: [0, 0, -154], interactionRadius: 14, interactionType: 'scan_archive', honor: 90, message: 'Archive d’honneur : la proie armée est affrontée, le trophée mérité est préservé.' },
      { id: 'prime-poi-weapon-shrine', type: 'weapon_archive', label: 'Râtelier des défis', position: [-84, 0, -48], interactionRadius: 13, interactionType: 'tune_beacon', honor: 80, message: 'Râtelier synchronisé : profils de duel et faiblesses de garde enregistrés.' },
      { id: 'prime-poi-trophy-lineage', type: 'trophy_archive', label: 'Lignée de trophées du clan', position: [90, 0, -44], interactionRadius: 13, interactionType: 'scan_trophies', honor: 100, message: 'Lignée vérifiée : prises, cicatrices et rangs restent séparés des récits non confirmés.' },
    ],
    hazardZones: [
      { id: 'prime-hazard-plasma-brazier', type: 'plasma_brazier', position: [0, 0, -78], radius: 7, damage: 9, interval: 2.4, status: 'energy_jam', message: 'PLASMA RITUEL — ÉNERGIE DRAINÉE' },
    ],
  },
  genna_deathworld: {
    sourceTier: 'ORIGINAL',
    basisTier: 'SCREEN',
    textureReferences: [
      '/assets/textures/deathworld-alien-flora.webp',
      '/assets/textures/genna-deathworld-ground.webp',
      ENVIRONMENT_PROP_TEXTURES.gennaSporeHide,
      ENVIRONMENT_PROP_TEXTURES.frontierPanels,
    ],
    props: [
      { id: 'genna-west-expedition-wreck', type: 'expedition_wreck', position: [-112, 0, -18], rotation: 0.48, scale: 1.12, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, colliderRadius: 15 },
      { id: 'genna-north-kalisk-nest', type: 'kalisk_nest', position: [0, 0, -158], rotation: 0, scale: 1.2, texture: ENVIRONMENT_PROP_TEXTURES.gennaSporeHide, colliderRadius: 17 },
      { id: 'genna-east-synthetic-array', type: 'signal_array', position: [112, 0, -36], rotation: -0.28, scale: 1.05, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, colliderRadius: 12 },
      { id: 'genna-west-spore-grove', type: 'spore_grove', position: [-58, 0, -86], rotation: 0.2, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.gennaSporeHide, instances: 7 },
      { id: 'genna-east-spore-grove', type: 'spore_grove', position: [62, 0, -92], rotation: -0.2, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.gennaSporeHide, instances: 7 },
      { id: 'genna-regen-nodes', type: 'regen_node_line', position: [0, 0, -100], rotation: 0, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.gennaSporeHide, instances: 4 },
      { id: 'genna-bone-arch-west', type: 'bone_arch', position: [-44, 0, -42], rotation: 0.25, scale: 1.05, texture: '/assets/textures/trophy-bone.webp', colliderRadius: 7, perchHeight: 16 },
      { id: 'genna-bone-arch-east', type: 'bone_arch', position: [46, 0, -48], rotation: -0.25, scale: 1.05, texture: '/assets/textures/trophy-bone.webp', colliderRadius: 7, perchHeight: 16 },
    ],
    pointsOfInterest: [
      { id: 'genna-poi-expedition-log', type: 'field_record', label: 'Balise d’expédition synthétique', position: [-104, 0, -14], interactionRadius: 14, interactionType: 'decode_record', honor: 85, message: 'Archive : les relevés signalent une adaptation accélérée autour du prédateur apex.' },
      { id: 'genna-poi-kalisk-nest', type: 'hunt_trace', label: 'Aire d’alimentation du Kalisk', position: [0, 0, -146], interactionRadius: 15, interactionType: 'scan_archive', honor: 100, message: 'Analyse : les plaques abandonnées révèlent le cycle de régénération du Kalisk.' },
      { id: 'genna-poi-synthetic-array', type: 'seismic_array', label: 'Réseau de confinement détruit', position: [104, 0, -32], interactionRadius: 13, interactionType: 'tune_beacon', honor: 80, message: 'Réseau recalibré : couloirs de charge et nœuds organiques cartographiés.' },
    ],
    hazardZones: [
      { id: 'genna-hazard-spore-west', type: 'spore_vent', position: [-28, 0, -104], radius: 7, damage: 6, interval: 2.6, status: 'venom', message: 'SPORES DE GENNA — ENDURANCE CONTAMINÉE' },
      { id: 'genna-hazard-spore-east', type: 'spore_vent', position: [32, 0, -112], radius: 7, damage: 6, interval: 2.6, status: 'venom', message: 'SPORES DE GENNA — ENDURANCE CONTAMINÉE' },
    ],
  },
};

export const BIOME_PROP_CATALOG = Object.freeze(
  Object.fromEntries(Object.entries(PLAN_DATA).map(([biomeId, plan]) => [
    biomeId,
    Object.freeze({ biomeId, ...plan }),
  ])),
);

function cloneItem(item) {
  return {
    ...item,
    position: [...item.position],
  };
}

export function getBiomePropPlan(biomeId) {
  const source = BIOME_PROP_CATALOG[biomeId] ?? BIOME_PROP_CATALOG.jungle;
  return {
    ...source,
    textureReferences: [...source.textureReferences],
    props: source.props.map(cloneItem),
    pointsOfInterest: source.pointsOfInterest.map(cloneItem),
    hazardZones: source.hazardZones.map(cloneItem),
  };
}
