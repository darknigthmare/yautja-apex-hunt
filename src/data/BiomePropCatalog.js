export const ENVIRONMENT_PROP_TEXTURES = Object.freeze({
  frontierPanels: '/assets/textures/ryushi-frontier-panels.webp',
  hiveMembrane: '/assets/textures/hive-biomechanical-membrane.webp',
  ceremonialBronze: '/assets/textures/yautja-ceremonial-bronze.webp',
  gennaSporeHide: '/assets/textures/genna-spore-pod-hide.webp',
  stargazerComposite: '/assets/textures/stargazer-tactical-composite.webp',
  urbanHeatwave: '/assets/textures/los-angeles-heatwave-urban.webp',
  bouvetIceRock: '/assets/textures/bouvetoya-ice-rock.webp',
  bouvetPyramidStone: '/assets/textures/bouvetoya-pyramid-stone.webp',
  gunnisonRainUrban: '/assets/textures/gunnison-rain-urban.webp',
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
  stargazer_blacksite: {
    sourceTier: 'ORIGINAL',
    basisTier: 'SCREEN',
    textureReferences: [
      ENVIRONMENT_PROP_TEXTURES.frontierPanels,
      ENVIRONMENT_PROP_TEXTURES.stargazerComposite,
      '/assets/textures/yautja-alloy.webp',
    ],
    props: [
      { id: 'stargazer-west-checkpoint', type: 'stargazer_checkpoint', position: [-325, 0, 365], rotation: 0.38, scale: 1.12, texture: ENVIRONMENT_PROP_TEXTURES.stargazerComposite, colliderRadius: 18 },
      { id: 'stargazer-operations-lab', type: 'stargazer_containment_lab', position: [0, 0, 125], rotation: 0, scale: 1.25, texture: ENVIRONMENT_PROP_TEXTURES.stargazerComposite, colliderRadius: 20, perchHeight: 17 },
      { id: 'stargazer-genetics-lab', type: 'stargazer_containment_lab', position: [305, 0, -300], rotation: -0.42, scale: 1.18, texture: ENVIRONMENT_PROP_TEXTURES.stargazerComposite, colliderRadius: 20, perchHeight: 17 },
      { id: 'stargazer-west-kennel', type: 'stargazer_kennel', position: [-455, 0, 65], rotation: 0.22, scale: 1.14, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, colliderRadius: 17 },
      { id: 'stargazer-security-watchtower', type: 'stargazer_watchtower', position: [-245, 0, 285], rotation: 0, scale: 1.05, texture: ENVIRONMENT_PROP_TEXTURES.stargazerComposite, colliderRadius: 8, perchHeight: 25 },
      { id: 'stargazer-east-watchtower', type: 'stargazer_watchtower', position: [415, 0, 115], rotation: 0, scale: 1.02, texture: ENVIRONMENT_PROP_TEXTURES.stargazerComposite, colliderRadius: 8, perchHeight: 25 },
      { id: 'stargazer-south-barriers', type: 'stargazer_barrier_line', position: [0, 0, 405], rotation: 0, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, instances: 8, colliderRadius: 18 },
      { id: 'stargazer-containment-pods', type: 'stargazer_pod_line', position: [410, 0, -72], rotation: -0.28, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.stargazerComposite, instances: 6, colliderRadius: 16 },
    ],
    pointsOfInterest: [
      { id: 'stargazer-poi-flight-recorder', type: 'field_record', label: 'Enregistreur de l’appareil du fugitif', position: [335, 0, 330], interactionRadius: 14, interactionType: 'decode_record', honor: 90, message: 'Archive : l’appareil capturé a forcé l’atterrissage avant la rupture du confinement.' },
      { id: 'stargazer-poi-predator-killer', type: 'weapon_archive', label: 'Module Predator Killer confisqué', position: [-18, 0, 112], interactionRadius: 14, interactionType: 'scan_archive', honor: 110, message: 'Analyse : technologie yautja miniaturisée, verrouillée dans un berceau humain expérimental.' },
      { id: 'stargazer-poi-adaptive-tissue', type: 'hive_sample', label: 'Échantillon de tissu adaptatif', position: [292, 0, -286], interactionRadius: 14, interactionType: 'scan_archive', honor: 100, message: 'Analyse : croissance accélérée et réponse défensive à chaque traumatisme enregistré.' },
      { id: 'stargazer-poi-breach-trail', type: 'hunt_trace', label: 'Piste de poursuite de l’Assassin', position: [20, 0, -515], interactionRadius: 15, interactionType: 'scan_archive', honor: 105, message: 'Trace : impacts lourds, plaques biologiques et bond terminal vers le cratère.' },
    ],
    hazardZones: [
      { id: 'stargazer-hazard-arc-field', type: 'containment_arc', position: [405, 0, -108], radius: 9, damage: 9, interval: 2.3, status: 'energy_jam', message: 'ARC DE CONFINEMENT — SYSTÈMES YAUTJA PERTURBÉS' },
      { id: 'stargazer-hazard-sterilization', type: 'sterilization_vent', position: [245, 0, -205], radius: 8, damage: 8, interval: 2.6, status: 'corrosion', message: 'PURGE DE STÉRILISATION — ARMURE CORRODÉE' },
    ],
  },
  los_angeles_1997: {
    sourceTier: 'ORIGINAL',
    basisTier: 'PREDATOR_2_SCREEN',
    textureReferences: [
      ENVIRONMENT_PROP_TEXTURES.urbanHeatwave,
      '/assets/textures/yautja-alloy.webp',
      ENVIRONMENT_PROP_TEXTURES.stargazerComposite,
    ],
    props: [
      { id: 'la-colombian-penthouse', type: 'urban_tenement', position: [-470, 0, 105], rotation: 0.18, scale: 1.28, texture: ENVIRONMENT_PROP_TEXTURES.urbanHeatwave, colliderRadius: 21, perchHeight: 31 },
      { id: 'la-subway-west-entrance', type: 'subway_entrance', position: [-430, 0, -285], rotation: 0.52, scale: 1.12, texture: ENVIRONMENT_PROP_TEXTURES.urbanHeatwave, colliderRadius: 13, perchHeight: 11 },
      { id: 'la-owlf-slaughterhouse', type: 'slaughterhouse', position: [390, 0, -290], rotation: -0.28, scale: 1.22, texture: ENVIRONMENT_PROP_TEXTURES.urbanHeatwave, colliderRadius: 22, perchHeight: 18 },
      { id: 'la-owlf-command-van', type: 'owlf_command_van', position: [20, 0, -345], rotation: -0.12, scale: 1.08, texture: ENVIRONMENT_PROP_TEXTURES.stargazerComposite, colliderRadius: 9, perchHeight: 6.5 },
      { id: 'la-lost-tribe-ship-hatch', type: 'lost_tribe_ship_hatch', position: [-80, 0, -650], rotation: 0.06, scale: 1.24, texture: '/assets/textures/yautja-alloy.webp', colliderRadius: 18, perchHeight: 17 },
      { id: 'la-warzone-police-line', type: 'police_vehicle_line', position: [-390, 0, 430], rotation: 0.34, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.urbanHeatwave, instances: 6, colliderRadius: 19 },
      { id: 'la-rooftop-equipment-line', type: 'rooftop_equipment', position: [30, 0, 135], rotation: -0.18, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.urbanHeatwave, instances: 7, colliderRadius: 18, perchHeight: 8 },
      { id: 'la-freeway-palm-line', type: 'palm_line', position: [405, 0, 435], rotation: -0.42, scale: 1.08, texture: ENVIRONMENT_PROP_TEXTURES.urbanHeatwave, instances: 8, colliderRadius: 20, perchHeight: 21 },
    ],
    pointsOfInterest: [
      { id: 'la-poi-rooftop-plasma', type: 'hunt_trace', label: 'Impacts de plasma sur le toit', position: [-75, 0, 180], interactionRadius: 14, interactionType: 'scan_archive', honor: 105, message: 'Analyse : tirs de City Hunter, trajectoire ascendante vers le penthouse et le métro.' },
      { id: 'la-poi-subway-record', type: 'field_record', label: 'Radio de l’agent Leona', position: [-405, 0, -260], interactionRadius: 13, interactionType: 'decode_record', honor: 90, message: 'Archive : une silhouette invisible a épargné une cible non combattante dans le tunnel.' },
      { id: 'la-poi-owlf-cold-plan', type: 'weapon_archive', label: 'Plan du piège cryogénique OWLF', position: [365, 0, -265], interactionRadius: 14, interactionType: 'tune_beacon', honor: 100, message: 'Plan recalibré : azote, poussière isolante et couloirs de tir de l’abattoir identifiés.' },
      { id: 'la-poi-lost-tribe-law', type: 'honor_archive', label: 'Marque d’honneur du Lost Tribe', position: [-72, 0, -625], interactionRadius: 15, interactionType: 'scan_archive', honor: 120, message: 'Archive d’honneur : le duel achevé est reconnu, puis le survivant reçoit une prise ancienne.' },
    ],
    hazardZones: [
      { id: 'la-hazard-subway-steam', type: 'subway_steam', position: [-455, 0, -315], radius: 9, damage: 7, interval: 2.4, status: 'energy_jam', message: 'VAPEUR DU MÉTRO — VISIONS THERMIQUES SATURÉES' },
      { id: 'la-hazard-owlf-cryo', type: 'cryo_fog', position: [410, 0, -315], radius: 11, damage: 8, interval: 2.2, status: 'snare', message: 'BROUILLARD CRYOGÉNIQUE — MOBILITÉ RÉDUITE' },
      { id: 'la-hazard-transformer-arc', type: 'transformer_arc', position: [470, 0, 105], radius: 8, damage: 9, interval: 2.5, status: 'energy_jam', message: 'ARC ÉLECTRIQUE — TECHNOLOGIE YAUTJA PERTURBÉE' },
    ],
  },
  bouvetoya_pyramid: {
    sourceTier: 'ORIGINAL',
    basisTier: 'AVP_SCREEN',
    assetPolicy: 'Adaptation procédurale originale inspirée des espaces vus à l’écran ; aucun asset officiel.',
    textureReferences: [
      ENVIRONMENT_PROP_TEXTURES.bouvetIceRock,
      ENVIRONMENT_PROP_TEXTURES.bouvetPyramidStone,
      ENVIRONMENT_PROP_TEXTURES.hiveMembrane,
      ENVIRONMENT_PROP_TEXTURES.frontierPanels,
      '/assets/textures/yautja-alloy.webp',
    ],
    props: [
      { id: 'bouvet-surface-expedition-camp', type: 'field_camp', position: [0, 0, 590], rotation: Math.PI, scale: 1.12, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, colliderRadius: 15 },
      { id: 'bouvet-razorback-drill-array', type: 'weyland_drill_array', position: [-420, 0, 455], rotation: 0.28, scale: 1.08, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, colliderRadius: 12, perchHeight: 24 },
      { id: 'bouvet-pyramid-entrance', type: 'pyramid_entrance', position: [0, 0, 320], rotation: 0, scale: 1.22, texture: ENVIRONMENT_PROP_TEXTURES.bouvetPyramidStone, colliderRadius: 20, perchHeight: 25 },
      { id: 'bouvet-sacrificial-dais', type: 'pyramid_sacrificial_dais', position: [-500, 0, 115], rotation: -0.12, scale: 1.08, texture: ENVIRONMENT_PROP_TEXTURES.bouvetPyramidStone, colliderRadius: 18 },
      { id: 'bouvet-plasma-vault', type: 'pyramid_plasma_vault', position: [-165, 0, 150], rotation: 0.2, scale: 1.06, texture: ENVIRONMENT_PROP_TEXTURES.bouvetPyramidStone, colliderRadius: 16 },
      { id: 'bouvet-queen-restraint', type: 'pyramid_queen_restraint', position: [-350, 0, -350], rotation: -0.08, scale: 1.14, texture: ENVIRONMENT_PROP_TEXTURES.bouvetPyramidStone, colliderRadius: 20, perchHeight: 18 },
      { id: 'bouvet-grid-arena-gate', type: 'pyramid_arena_gate', position: [175, 0, -435], rotation: Math.PI, scale: 1.12, texture: ENVIRONMENT_PROP_TEXTURES.bouvetPyramidStone, colliderRadius: 14, perchHeight: 18 },
      { id: 'bouvet-east-resin-ribs', type: 'pyramid_resin_ribs', position: [475, 0, 55], rotation: -0.22, scale: 1.08, texture: ENVIRONMENT_PROP_TEXTURES.hiveMembrane, instances: 8, colliderRadius: 13 },
      { id: 'bouvet-east-egg-cluster', type: 'pyramid_egg_cluster', position: [535, 0, 18], rotation: 0.42, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.hiveMembrane, instances: 6, colliderRadius: 11 },
      { id: 'bouvet-west-egg-cluster', type: 'pyramid_egg_cluster', position: [440, 0, 108], rotation: -0.38, scale: 0.94, texture: ENVIRONMENT_PROP_TEXTURES.hiveMembrane, instances: 6, colliderRadius: 11 },
      { id: 'bouvet-west-ice-crags', type: 'ice_crag_line', position: [-330, 0, 525], rotation: 0.34, scale: 1.12, texture: ENVIRONMENT_PROP_TEXTURES.bouvetIceRock, instances: 7, colliderRadius: 14, perchHeight: 18 },
      { id: 'bouvet-east-ice-crags', type: 'ice_crag_line', position: [330, 0, 535], rotation: -0.3, scale: 1.06, texture: ENVIRONMENT_PROP_TEXTURES.bouvetIceRock, instances: 7, colliderRadius: 14, perchHeight: 18 },
      { id: 'bouvet-shift-alpha-west', type: 'pyramid_shift_wall', position: [48, 0, 62], rotation: 0, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.bouvetPyramidStone, colliderRadius: 8, shiftGroup: 'alpha', openHeight: 19 },
      { id: 'bouvet-shift-alpha-east', type: 'pyramid_shift_wall', position: [156, 0, 126], rotation: Math.PI / 2, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.bouvetPyramidStone, colliderRadius: 8, shiftGroup: 'alpha', openHeight: 19 },
      { id: 'bouvet-shift-beta-north', type: 'pyramid_shift_wall', position: [96, 0, 170], rotation: 0, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.bouvetPyramidStone, colliderRadius: 8, shiftGroup: 'beta', openHeight: 19 },
      { id: 'bouvet-shift-beta-south', type: 'pyramid_shift_wall', position: [38, 0, 125], rotation: Math.PI / 2, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.bouvetPyramidStone, colliderRadius: 8, shiftGroup: 'beta', openHeight: 19 },
      { id: 'bouvet-young-blood-weapon-pod', type: 'pyramid_weapon_pod', position: [330, 0, -155], rotation: -0.34, scale: 1.04, texture: '/assets/textures/yautja-alloy.webp', colliderRadius: 8 },
      { id: 'bouvet-thermal-vent-array', type: 'thermal_vent_array', position: [425, 0, 390], rotation: 0.12, scale: 1.05, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, instances: 5, colliderRadius: 12 },
    ],
    pointsOfInterest: [
      { id: 'bouvet-poi-expedition-log', type: 'field_record', label: 'Journal de l’expédition Weyland', position: [-385, 0, 430], interactionRadius: 14, interactionType: 'decode_record', honor: 95, message: 'Archive : la source thermique sous la glace a déclenché l’ouverture du complexe enfoui.' },
      { id: 'bouvet-poi-holographic-map', type: 'seismic_array', label: 'Carte holographique de la pyramide', position: [18, 0, 300], interactionRadius: 15, interactionType: 'tune_beacon', honor: 110, message: 'Carte recalibrée : les chambres tournent autour d’un carrefour capable de modifier ses passages.' },
      { id: 'bouvet-poi-plasma-chamber', type: 'weapon_archive', label: 'Râtelier cérémoniel de plasma casters', position: [-145, 0, 132], interactionRadius: 14, interactionType: 'scan_archive', honor: 120, message: 'Analyse : trois armes de blooding furent préparées pour l’épreuve des jeunes chasseurs.' },
      { id: 'bouvet-poi-grid-acid', type: 'hunt_trace', label: 'Entaille acide de Grid', position: [145, 0, -370], interactionRadius: 15, interactionType: 'scan_archive', honor: 125, message: 'Trace : le drone marqué a brisé un filet puis rejoint l’arène par la galerie royale.' },
    ],
    hazardZones: [
      { id: 'bouvet-hazard-thermal-vent', type: 'heat_vent', position: [455, 0, 410], radius: 9, damage: 8, interval: 2.4, status: 'energy_jam', message: 'SURPRESSION THERMIQUE — SYSTÈMES YAUTJA SATURÉS' },
      { id: 'bouvet-hazard-acid-channel', type: 'acid_pool', position: [-260, 0, -250], radius: 10, damage: 11, interval: 2.1, status: 'corrosion', message: 'SANG ACIDE — ARMURE ET CAMOUFLAGE CORRODÉS' },
      { id: 'bouvet-hazard-resin-snare', type: 'resin_snare', position: [475, 0, 115], radius: 9, damage: 6, interval: 2.7, status: 'snare', message: 'RÉSINE ACTIVE — MOBILITÉ RÉDUITE' },
      { id: 'bouvet-hazard-crush-zone', type: 'pyramid_crush_zone', position: [105, 0, 38], radius: 11, damage: 10, interval: 2.8, status: 'impact', message: 'MÉCANISME PYRAMIDAL — ZONE D’ÉCRASEMENT' },
    ],
  },
  gunnison_outbreak: {
    sourceTier: 'ORIGINAL',
    basisTier: 'AVP_SCREEN',
    assetPolicy: 'Adaptation procédurale originale de la topologie de Gunnison ; aucun décor ou asset officiel.',
    textureReferences: [
      ENVIRONMENT_PROP_TEXTURES.gunnisonRainUrban,
      ENVIRONMENT_PROP_TEXTURES.hiveMembrane,
      ENVIRONMENT_PROP_TEXTURES.frontierPanels,
      '/assets/textures/wolf-cleaner-alloy.webp',
      '/assets/textures/yautja-alloy.webp',
    ],
    props: [
      { id: 'gunnison-crashed-scout-hull', type: 'lost_tribe_ship_hatch', position: [0, 0, 585], rotation: Math.PI, scale: 1.08, texture: '/assets/textures/yautja-alloy.webp', colliderRadius: 17, perchHeight: 16 },
      { id: 'gunnison-cemetery-chapel', type: 'urban_tenement', position: [-430, 0, 455], rotation: 0.22, scale: 0.72, texture: ENVIRONMENT_PROP_TEXTURES.gunnisonRainUrban, colliderRadius: 17, perchHeight: 25 },
      { id: 'gunnison-cemetery-headstones', type: 'bone_line', position: [-385, 0, 410], rotation: -0.3, scale: 0.84, texture: ENVIRONMENT_PROP_TEXTURES.gunnisonRainUrban, instances: 12, colliderRadius: 15 },
      { id: 'gunnison-power-station', type: 'stargazer_containment_lab', position: [425, 0, 445], rotation: -0.28, scale: 1.12, texture: ENVIRONMENT_PROP_TEXTURES.gunnisonRainUrban, colliderRadius: 21, perchHeight: 18 },
      { id: 'gunnison-downtown-west-block', type: 'urban_tenement', position: [-520, 0, 115], rotation: 0.08, scale: 1.08, texture: ENVIRONMENT_PROP_TEXTURES.gunnisonRainUrban, colliderRadius: 21, perchHeight: 32 },
      { id: 'gunnison-downtown-east-block', type: 'urban_tenement', position: [-445, 0, 35], rotation: -0.18, scale: 0.96, texture: ENVIRONMENT_PROP_TEXTURES.gunnisonRainUrban, colliderRadius: 20, perchHeight: 30 },
      { id: 'gunnison-sewer-access', type: 'subway_entrance', position: [470, 0, 35], rotation: -0.46, scale: 1.16, texture: ENVIRONMENT_PROP_TEXTURES.gunnisonRainUrban, colliderRadius: 14, perchHeight: 11 },
      { id: 'gunnison-sewer-resin-ribs', type: 'rib_corridor', position: [425, 0, -55], rotation: 0.24, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.hiveMembrane, instances: 8, colliderRadius: 13 },
      { id: 'gunnison-high-school', type: 'urban_tenement', position: [-390, 0, -270], rotation: 0.16, scale: 1.18, texture: ENVIRONMENT_PROP_TEXTURES.gunnisonRainUrban, colliderRadius: 23, perchHeight: 27 },
      { id: 'gunnison-pool-cocoons', type: 'cocoon_cluster', position: [-330, 0, -305], rotation: -0.4, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.hiveMembrane, instances: 7, colliderRadius: 12 },
      { id: 'gunnison-hospital', type: 'urban_tenement', position: [360, 0, -285], rotation: -0.12, scale: 1.28, texture: ENVIRONMENT_PROP_TEXTURES.gunnisonRainUrban, colliderRadius: 25, perchHeight: 38 },
      { id: 'gunnison-hospital-rooftop', type: 'rooftop_equipment', position: [155, 0, -470], rotation: 0.18, scale: 1.08, texture: ENVIRONMENT_PROP_TEXTURES.gunnisonRainUrban, instances: 8, colliderRadius: 18, perchHeight: 10 },
      { id: 'gunnison-guard-command', type: 'owlf_command_van', position: [0, 0, 145], rotation: -0.08, scale: 1.06, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, colliderRadius: 10, perchHeight: 6.5 },
      { id: 'gunnison-guard-vehicle-line', type: 'police_vehicle_line', position: [-105, 0, 55], rotation: 0.32, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.gunnisonRainUrban, instances: 8, colliderRadius: 20 },
      { id: 'gunnison-quarantine-barriers', type: 'stargazer_barrier_line', position: [95, 0, 110], rotation: -0.25, scale: 1, texture: ENVIRONMENT_PROP_TEXTURES.frontierPanels, instances: 9, colliderRadius: 19 },
      { id: 'gunnison-wolf-cleaner-canisters', type: 'cleaner_canisters', position: [-285, 0, 310], rotation: 0.25, scale: 1.04, texture: '/assets/textures/wolf-cleaner-alloy.webp', instances: 6, colliderRadius: 10 },
      { id: 'gunnison-extraction-roadblock', type: 'police_vehicle_line', position: [0, 0, -610], rotation: Math.PI / 2, scale: 1.06, texture: ENVIRONMENT_PROP_TEXTURES.gunnisonRainUrban, instances: 7, colliderRadius: 20 },
    ],
    pointsOfInterest: [
      { id: 'gunnison-poi-scout-recorder', type: 'field_record', label: 'Enregistreur du vaisseau yautja', position: [22, 0, 565], interactionRadius: 15, interactionType: 'decode_record', honor: 110, message: 'Archive : un organisme hybride a quitté l’épave avant l’arrivée du signal Cleaner.' },
      { id: 'gunnison-poi-guard-radio', type: 'guard_radio', label: 'Radio de la Garde nationale', position: [-92, 0, 68], interactionRadius: 14, interactionType: 'decode_record', honor: 95, message: 'Transmission : le cordon de la ville s’est effondré après une attaque venue des égouts.' },
      { id: 'gunnison-poi-cleaner-residue', type: 'cleaner_trace', label: 'Résidus de dissolution Cleaner', position: [-275, 0, 302], interactionRadius: 14, interactionType: 'scan_archive', honor: 120, message: 'Analyse : l’agent bleu détruit tissus, résine et preuves biologiques sans distinguer les structures proches.' },
      { id: 'gunnison-poi-hospital-nest', type: 'hive_sample', label: 'Mue de la ruche hospitalière', position: [340, 0, -310], interactionRadius: 15, interactionType: 'scan_archive', honor: 125, message: 'Analyse : la croissance accélérée converge vers le toit et la signature du Predalien.' },
    ],
    hazardZones: [
      { id: 'gunnison-hazard-transformer', type: 'transformer_arc', position: [390, 0, 390], radius: 9, damage: 9, interval: 2.4, status: 'energy_jam', message: 'ARC DE LA CENTRALE — TECHNOLOGIE YAUTJA PERTURBÉE' },
      { id: 'gunnison-hazard-sewer-acid', type: 'acid_pool', position: [455, 0, -120], radius: 10, damage: 11, interval: 2.1, status: 'corrosion', message: 'RÉSEAU D’ÉGOUT ACIDE — ARMURE CORRODÉE' },
      { id: 'gunnison-hazard-cleaner-solvent', type: 'acid_pool', position: [-250, 0, 285], radius: 8, damage: 10, interval: 2.4, status: 'corrosion', message: 'AGENT CLEANER — MATIÈRE ORGANIQUE EN DISSOLUTION' },
      { id: 'gunnison-hazard-hospital-steam', type: 'subway_steam', position: [300, 0, -360], radius: 9, damage: 7, interval: 2.5, status: 'snare', message: 'VAPEUR DE SECOURS — VISIONS ET MOBILITÉ RÉDUITES' },
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
