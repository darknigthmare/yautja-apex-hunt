/**
 * MediaMapsAndArsenalCatalog.js
 * 
 * Répertoire exhaustif des 24 Cartes / Secteurs tactiques et des 28 Armes PNJ emblématiques
 * couvrant l'intégralité des trois univers canoniques : PREDATOR, ALIEN et ALIEN VS. PREDATOR (AVP).
 * Permet la navigation par tiroirs d'univers et le déploiement direct en simulation de chasse.
 */

export const FRANCHISE_UNIVERSES = Object.freeze({
  PREDATOR: Object.freeze({
    id: 'PREDATOR',
    label: 'Univers PREDATOR',
    shortLabel: 'PREDATOR',
    emblem: '🔴',
    color: '#ff5533',
    description: 'Chasses rituelles Yautja, commandos de la jungle, guerre des clans de la réserve et terres dévastées.'
  }),
  ALIEN: Object.freeze({
    id: 'ALIEN',
    label: 'Univers ALIEN',
    shortLabel: 'ALIEN',
    emblem: '🟢',
    color: '#00e5ff',
    description: 'Horreur biomécanique XX121, ruches de LV-426, ingénieurs de LV-223, néomorphes et stations orbitales Weyland.'
  }),
  AVP: Object.freeze({
    id: 'AVP',
    label: 'Univers ALIEN VS. PREDATOR (AVP)',
    shortLabel: 'AVP',
    emblem: '🟡',
    color: '#ffd700',
    description: 'Conflits totaux entre chasseurs Yautja initiés et castes xénomorphes sur Terre et mondes frontières.'
  })
});

// =========================================================================
// 1. CATALOGUE DES 24 CARTES & SECTEURS MÉDIA CANONIQUES
// =========================================================================
export const MEDIA_MAPS_CATALOG = Object.freeze([
  // --- UNIVERS PREDATOR (10 Cartes) ---
  {
    id: 'map_val_verde_1987',
    name: 'Val Verde — Jungle Équatoriale & Guérilla (1987)',
    originMedia: 'Predator (1987, John McTiernan)',
    universe: 'PREDATOR',
    releaseYear: 1987,
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Jungle de Chasse Val Verde',
    environmentSummary: 'Canopée dense, cascade rocheuse, bivouac de guérilleros et racines suspendues propices au camouflage optique.',
    tacticalSectors: ['Camp de Rebelles de Val Verde', 'Vallée de la Rivière et Boue Thermique', 'Clairière du Tronc Mort', 'Chute d\'Eau du Duel Final'],
    environmentalHazards: ['Humidité saturante (dissipe fumées)', 'Lianes instables', 'Eau profonde court-circuitant le camouflage'],
    keyPreyIds: ['alien_base_major_dutch_schaefer_1987', 'alien_base_billy_sole_tracker', 'alien_base_blain_cooper_minigun'],
    heroSquadId: 'squad_dutch_val_verde_1987',
    villainSquadId: 'squad_dutch_val_verde_1987'
  },
  {
    id: 'map_los_angeles_1997',
    name: 'Los Angeles — Canicule Meurtrière & Abattoir (1997)',
    originMedia: 'Predator 2 (1990, Stephen Hopkins)',
    universe: 'PREDATOR',
    releaseYear: 1990,
    biomeId: 'los_angeles_1997',
    recommendedBiomeLabel: 'Los Angeles 1997 — Chasse Urbaine',
    environmentSummary: 'Toits brûlants, guerre des cartels, métro sous stroboscopes, abattoir frigorifique et vaisseau enfoui de la Lost Tribe.',
    tacticalSectors: ['Allée de fusillade du Cartel', 'Rame de Métro Sanglante', 'Chambres Froides de l\'Abattoir OWLF', 'Vaisseau Spatial de l\'Elder'],
    environmentalHazards: ['Stroboscopes aveuglants', 'Brume cryogénique d\'azote liquide', 'Tirs croisés automatiques'],
    keyPreyIds: ['alien_base_mike_harrigan_lapd', 'alien_base_king_willie_voodoo_priest'],
    heroSquadId: 'squad_p2_lapd_harrigan_1997',
    villainSquadId: 'squad_p2_cartel_king_willie_posse'
  },
  {
    id: 'map_game_preserve_2010',
    name: 'Planète-Réserve de Chasse — Jungle Étrangère (2010)',
    originMedia: 'Predators (2010, Nimród Antal)',
    universe: 'PREDATOR',
    releaseYear: 2010,
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Planète-Réserve des Super Predators',
    environmentSummary: 'Flore extraterrestre toxique, falaises surplombant des lunes géantes, camp de torture du Classic Predator et campement des Berserkers.',
    tacticalSectors: ['Site d\'Atterrissage en Parachute', 'Cage du Classic Predator Enchaîné', 'Campement des Berserkers', 'Plaine des Chiens de Chasse'],
    environmentalHazards: ['Plantes empoisonnées neurotoxiques', 'Pièges de chute à pieux en bambou', 'Hell-Hounds en meute'],
    keyPreyIds: ['alien_base_royce_mercenaire_2010'],
    heroSquadId: 'squad_predators_royce_survivors_2010',
    villainSquadId: 'squad_predators_super_clan_berserkers'
  },
  {
    id: 'map_stargazer_blacksite_2018',
    name: 'Complexe Militaire Secret Stargazer & Forêt (2018)',
    originMedia: 'The Predator (2018, Shane Black)',
    universe: 'PREDATOR',
    releaseYear: 2018,
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Complexe Stargazer de Géorgie',
    environmentSummary: 'Laboratoires de confinement haute sécurité, salles d\'autopsie extraterrestre et forêts avoisinantes patrouillées par l\'Assassin Predator.',
    tacticalSectors: ['Dôme de Confinement de la Navette', 'Salle Médicale d\'Autopsie Yautja', 'Cour de Débarquement Blindée', 'Sous-Bois d\'Embuscade Nocturne'],
    environmentalHazards: ['Champs de force à impulsion', 'Barrières laser de sécurité', 'Projecteurs de recherche haute intensité'],
    keyPreyIds: ['alien_base_quinn_mckenna_ranger_2018'],
    heroSquadId: 'squad_the_predator_loonies_2018',
    villainSquadId: 'squad_the_predator_stargazer_strike'
  },
  {
    id: 'map_great_plains_1719',
    name: 'Grandes Plaines — Territoires Comanches & Marais (1719)',
    originMedia: 'Prey (2022, Dan Trachtenberg)',
    universe: 'PREDATOR',
    releaseYear: 2022,
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Grandes Plaines — Chasse Ancestrale',
    environmentSummary: 'Prairies ondulantes, rivières à saumons, forêt de conifères et campement fortifié des trappeurs français.',
    tacticalSectors: ['Campement de Tentes des Trappeurs', 'Marécage de Boue Médicinale', 'Clairière de l\'Ours Territorial', 'Sous-Bois du Duel de Naru'],
    environmentalHazards: ['Brouillard matinal opaque', 'Pièges à mâchoires de loup cachés', 'Boue collante réduisant la mobilité'],
    keyPreyIds: ['alien_base_big_beard_voyageur_1719'],
    heroSquadId: 'squad_comanche_war_party_1719',
    villainSquadId: 'squad_prey_french_voyageurs_1719'
  },
  {
    id: 'map_badlands_genna_2025',
    name: 'Genna — Terres Dévastées & Monde Mortel (2025)',
    originMedia: 'Predator: Badlands (2025, Dan Trachtenberg)',
    universe: 'PREDATOR',
    releaseYear: 2025,
    biomeId: 'genna_deathworld',
    recommendedBiomeLabel: 'Genna — Monde Mortel de Dek',
    environmentSummary: 'Falaises de roches rouges, failles radioactives, nids souterrains du Kalisk régénérant et avant-postes pillés.',
    tacticalSectors: ['Gorge des Spores Explosives', 'Nid du Prédateur Suprême Kalisk', 'Plateau des Chasseurs Exilés', 'Caravane Éventrée de Weyland'],
    environmentalHazards: ['Spores urticantes volatiles', 'Geysers sulfuriques sous pression', 'Séismes locaux de failles'],
    keyPreyIds: ['alien_base_thia_badlands_scout_2025', 'alien_base_weyland_badlands_overseer'],
    heroSquadId: 'squad_badlands_twin_outcasts',
    villainSquadId: 'squad_badlands_weyland_scavenger_brigade'
  },
  {
    id: 'map_kok_historical_2025',
    name: 'Sanctuaires Séculaires — Fjords Vikings & Clairière Féodale (2025)',
    originMedia: 'Predator: Killer of Killers (2025)',
    universe: 'PREDATOR',
    releaseYear: 2025,
    biomeId: 'yautja_prime',
    recommendedBiomeLabel: 'Sanctuaire Millénaire des Siècles',
    environmentSummary: 'Arène sacrée du vaisseau-mère commémorant les chasses à travers les époques : fjord scandinave, dojo féodal et ciel d\'orage.',
    tacticalSectors: ['Fjord Glacé du Raider Viking', 'Dojo en Bambous du Maître Samouraï', 'Passerelle Aérienne des Turbulences', 'Salle des Caissons Cryogéniques'],
    environmentalHazards: ['Blizzard aveuglant', 'Pluie de flèches incendiaires', 'Vents violents déstabilisants'],
    keyPreyIds: ['canon249_duelliste_feodal_samourai'],
    heroSquadId: 'squad_killers_of_killers_trio',
    villainSquadId: 'squad_phg_yautja_legends_circle'
  },
  {
    id: 'map_neonopolis_2005',
    name: 'Neonopolis — Tours Cybernétiques du Syndicat Borgia (2005)',
    originMedia: 'Predator: Concrete Jungle (2005)',
    universe: 'PREDATOR',
    releaseYear: 2005,
    biomeId: 'los_angeles_1997',
    recommendedBiomeLabel: 'Neonopolis 2030 — Cité Cybernétique',
    environmentSummary: 'Gratte-ciels néo-gothiques, passerelles suspendues, laboratoires d\'hybridation génétique et QG fortifié de Bruno Borgia.',
    tacticalSectors: ['Toits Publicitaires Lumineux', 'Laboratoires de Bio-Armes Borgia', 'Quartier Industriel du Gang Yakuza', 'Flèche Panoramique de la Tour Borgia'],
    environmentalHazards: ['Câbles à haute tension sectionnés', 'Drones patrouilleurs IEM', 'Gaz neurotoxique synthétique'],
    keyPreyIds: ['alien_base_bruno_borgia_godfather'],
    heroSquadId: 'squad_p2_lapd_harrigan_1997',
    villainSquadId: 'squad_concrete_jungle_borgia_syndicate'
  },

  {
    id: 'map_siberia_cold_war_1991',
    name: 'Sibérie — Péninsule de Kola & Base Soviétique (1991)',
    originMedia: 'Predator: Cold War (Comics Dark Horse 1991)',
    universe: 'PREDATOR',
    releaseYear: 1991,
    biomeId: 'antarctic',
    recommendedBiomeLabel: 'Toundra Glaciale Soviétique',
    environmentSummary: 'Neige épaisse, puits de pétrole enflammés, hangars militaires soviétiques et blizzard arctique gelant le camouflage optique.',
    tacticalSectors: ['Station Pétrolière de Kola', 'Hangars Militaires Soviétiques', 'Crête Glaciaire du Blizzard', 'Épave de l\'Hélicoptère Mil Mi-24'],
    environmentalHazards: ['Tempête de neige polaire', 'Froid extrême gelant les optiques', 'Puits de méthane enflammé'],
    keyPreyIds: ['alien_base_major_dutch_schaefer_1987', 'alien_base_billy_sole_tracker'],
    heroSquadId: 'squad_cold_war_spetsnaz_1991',
    villainSquadId: 'squad_cold_war_spetsnaz_1991'
  },
  {
    id: 'map_pine_ridge_desert_1991',
    name: 'Nouveau-Mexique — Réserve de Pine Ridge & Canyons (1991)',
    originMedia: 'Predator: Big Game (Comics Dark Horse 1991)',
    universe: 'PREDATOR',
    releaseYear: 1991,
    biomeId: 'desert',
    recommendedBiomeLabel: 'Canyons Rouges de Pine Ridge',
    environmentSummary: 'Mésas escarpées, poussière désertique rouge, base d\'essais d\'artillerie et canyons arides propices aux embuscades de sniper.',
    tacticalSectors: ['Plateau des Mésas Rouges', 'Base d\'Essais Balistiques', 'Canyon de la Faille Sèche', 'Sanctuaire Sacré Navajo'],
    environmentalHazards: ['Tempête de sable réduisant la visibilité', 'Chaleur caniculaire', 'Parois friables instables'],
    keyPreyIds: ['alien_base_billy_sole_tracker', 'alien_base_george_dillon_cia'],
    heroSquadId: 'squad_dutch_val_verde_1987',
    villainSquadId: 'squad_dutch_val_verde_1987'
  },

  // --- UNIVERS ALIEN (12 Cartes) ---
  {
    id: 'map_nostromo_derelict_1979',
    name: 'USCSS Nostromo & Vaisseau Derelict de LV-426 (1979)',
    originMedia: 'Alien (1979, Ridley Scott)',
    universe: 'ALIEN',
    releaseYear: 1979,
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'LV-426 — Derelict & Nostromo',
    environmentSummary: 'Couloirs métalliques sombres, salle du Space Jockey pétrifié, champ d\'œufs sous brouillard bleu et passerelles de ventilation.',
    tacticalSectors: ['Chambre du Pilote Fossilisé (Space Jockey)', 'Cale aux Milliers d\'Œufs de Stase', 'Conduits d\'Aération du Nostromo', 'Passerelle de Commande MUTH-UR 6000'],
    environmentalHazards: ['Acide de coque rongeant le plancher', 'Décompression explosive d\'écoutille', 'Obscurité quasi-totale'],
    keyPreyIds: ['alien_base_ripley_narcissus_survivor', 'alien_base_arthur_dallas_captain', 'prey_synthetic_ash_hyperdyne'],
    heroSquadId: 'squad_nostromo_crew_1979',
    villainSquadId: 'squad_weyland_blackops_containment'
  },
  {
    id: 'map_hadleys_hope_1986',
    name: 'Colonie Hadley\'s Hope & Processeur Atmosphérique (1986)',
    originMedia: 'Aliens (1986, James Cameron)',
    universe: 'ALIEN',
    releaseYear: 1986,
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Hadley\'s Hope — Ruche Principale',
    environmentSummary: 'Complexe colonial en ruines, murs tapissés de résine xénomorphe, sous-sol inondé et réacteur en surcharge thermonucléaire.',
    tacticalSectors: ['Centre des Opérations Coloniales', 'Niveau Inférieur Submergé du Processeur', 'Chambre Royale de ponte de la Reine', 'Hangar de Largage du Dropship'],
    environmentalHazards: ['Refroidisseur nucléaire en fusion', 'Ruissellements d\'acide sulfurique', 'Facehuggers dissimulés dans l\'eau'],
    keyPreyIds: ['alien_base_ripley_p5000_power_loader', 'alien_base_dwayne_hicks_corporal', 'alien_base_jenette_vasquez_smartgunner'],
    heroSquadId: 'squad_uscm_hadleys_hope_1986',
    villainSquadId: 'squad_weyland_blackops_containment'
  },
  {
    id: 'map_fiorina_fury_161_1992',
    name: 'Fiorina \'Fury\' 161 — Fonderie & Dédale de Plomb (1992)',
    originMedia: 'Alien³ (1992, David Fincher)',
    universe: 'ALIEN',
    releaseYear: 1992,
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Fiorina 161 — Fonderie Pénitentiaire',
    environmentSummary: 'Architecture industrielle rouillée, labyrinthe de conduits d\'aération, forges de plomb fondu et dortoirs de béton brut.',
    tacticalSectors: ['Cuve de Coulée de Plomb Fondu', 'Couloirs de Confinement des Détenus', 'Baie Médicale du Dr. Clemens', 'Hangar de la Navette Weyland-Yutani'],
    environmentalHazards: ['Éclaboussures de plomb en fusion à 400°C', 'Vapeurs d\'huile brûlante', 'Sas pneumatiques écrasants'],
    keyPreyIds: ['alien_base_dillon_fiorina_161', 'alien_base_aaron_85_fiorina'],
    heroSquadId: 'squad_alien3_fiorina_inmates_1992',
    villainSquadId: 'squad_alien3_weyland_dog_catchers'
  },
  {
    id: 'map_usm_auriga_1997',
    name: 'USM Auriga — Laboratoires de Clonage & Baie Médicale (1997)',
    originMedia: 'Alien: Resurrection (1997, Jean-Pierre Jeunet)',
    universe: 'ALIEN',
    releaseYear: 1997,
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'USM Auriga — Vaisseau Scientifique Militaire',
    environmentSummary: 'Cuves de gestation génétique, quartier sous-marin inondé, laboratoire d\'hybridation du Newborn et soute du cargo Betty.',
    tacticalSectors: ['Laboratoire des 7 Clones Défaillants', 'Secteur Inondé et Conduits Aquatiques', 'Nid d\'Accouchement du Newborn', 'Soute d\'Amarrage du Cargo Betty'],
    environmentalHazards: ['Sections submergées sans air', 'Fuites de cryo-fluide d\'azote', 'Sas de dépressurisation orbitale'],
    keyPreyIds: ['alien_base_annalee_call_auton_synth'],
    heroSquadId: 'squad_betty_mercenaries_1997',
    villainSquadId: 'squad_weyland_blackops_containment'
  },
  {
    id: 'map_prometheus_lv223_2012',
    name: 'LV-223 — Pyramide des Ingénieurs & Chambre des Urnes (2012)',
    originMedia: 'Prometheus (2012, Ridley Scott)',
    universe: 'ALIEN',
    releaseYear: 2012,
    biomeId: 'yautja_prime',
    recommendedBiomeLabel: 'LV-223 — Temple des Architectes',
    environmentSummary: 'Dôme géant sculpté d\'une tête colossale, milliers d\'urnes suintant le liquide noir mutagène et salle du pilote en stase.',
    tacticalSectors: ['Chambre de la Tête Monumentale & Fresque', 'Silo d\'Amarrage de la Nef Juggernaut', 'Cockpit à Orgue Céleste du Pilote', 'Tempête de Silice des Plaines Arides'],
    environmentalHazards: ['Mutagène noir corrosif au contact', 'Tempêtes de poussière électrostatique', 'Hammerpedes bondissants'],
    keyPreyIds: ['alien_base_elizabeth_shaw_archaeologist', 'prey_engineer_juggernaut_pilot'],
    heroSquadId: 'squad_prometheus_expedition_2093',
    villainSquadId: 'squad_prometheus_engineer_awakening'
  },
  {
    id: 'map_planet4_necropolis_2017',
    name: 'Planète 4 — Nécropole des Ingénieurs & Cité en Ruines (2017)',
    originMedia: 'Alien: Covenant (2017, Ridley Scott)',
    universe: 'ALIEN',
    releaseYear: 2017,
    biomeId: 'genna_deathworld',
    recommendedBiomeLabel: 'Planète 4 — Vallée Funéraire de David',
    environmentSummary: 'Place centrale couverte de millions de cadavres calcinés d\'Ingénieurs, laboratoire d\'anatomie de David 8 et forêt de spores noires.',
    tacticalSectors: ['Grande Place des Ingénieurs Pétrifiés', 'Laboratoire Anatomique de David 8', 'Forêt de Blé et Champ de Spores', 'Rampe d\'Extraction de la Navette'],
    environmentalHazards: ['Puffballs relâchant des micro-spores', 'Bloodbursters jaillissant des ombres', 'Pluies torrentielles déstabilisantes'],
    keyPreyIds: ['alien_base_daniels_branson_terraforming_lead', 'prey_synthetic_david_8', 'alien_base_walter_one_synthetic_protector'],
    heroSquadId: 'squad_covenant_colonists_2104',
    villainSquadId: 'squad_covenant_neomorph_david_pack'
  },
  {
    id: 'map_renaissance_station_2024',
    name: 'Station Spatiale Renaissance — Secteurs Romulus & Remus (2024)',
    originMedia: 'Alien: Romulus (2024, Fede Alvarez)',
    universe: 'ALIEN',
    releaseYear: 2024,
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Station Renaissance — Sas Romulus',
    environmentSummary: 'Station abandonnée en orbite déclinante, sas cryogéniques remplis de Facehuggers congelés, laboratoire Z-01 et baie du Corbelan.',
    tacticalSectors: ['Cryo-Baie des Facehuggers Décongelés', 'Conduit Gravitationnel Zéro-G', 'Laboratoire de Synthèse du Composé Z-01', 'Sas d\'Évacuation de la Navette Corbelan'],
    environmentalHazards: ['Flottabilité nulle (apesanteur)', 'Sang acide en suspension gravitationnelle', 'Compte à rebours de collision orbitale'],
    keyPreyIds: ['alien_base_rain_carradine_romulus_rebel', 'alien_base_rook_romulus_android', 'alien_base_bjorn_romulus_miner'],
    heroSquadId: 'squad_romulus_corbelan_scavengers_2142',
    villainSquadId: 'squad_romulus_renaissance_offspring_hive'
  },
  {
    id: 'map_sevastopol_2014',
    name: 'Station Sébastopol — Conduits de Transit & Noyau APOLLO (2014)',
    originMedia: 'Alien: Isolation (2014, Creative Assembly)',
    universe: 'ALIEN',
    releaseYear: 2014,
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Sébastopol — Station Spatiale Seegson',
    environmentSummary: 'Station de commerce déclassée, coursives délabrées, patrouilles de Working Joes agressifs et noyau d\'IA centrale impitoyable.',
    tacticalSectors: ['Transit Lorenz Systec', 'Hôpital San Cristobal Ravagé', 'Noyau Serveur de l\'IA APOLLO', 'Sas Spatioportuaire d\'Amarrage'],
    environmentalHazards: ['Fils électriques sous tension', 'Working Joes insensibles à la douleur', 'Caméras de sécurité déclenchant l\'alarme'],
    keyPreyIds: ['alien_base_amanda_ripley_sevastopol_engineer'],
    heroSquadId: 'squad_seegson_working_joes_pack',
    villainSquadId: 'squad_weyland_blackops_containment'
  },
  {
    id: 'map_katanga_refinery_2202',
    name: 'Raffinerie Orbitale Katanga & Ruines LV-895 (2202)',
    originMedia: 'Aliens: Fireteam Elite (2021, Cold Iron Studios)',
    universe: 'ALIEN',
    releaseYear: 2021,
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Katanga LV-895 — Raffinerie Corrompue',
    environmentSummary: 'Station spatiale industrielle rongée par la bio-matière et le mutagène noir, conduisant aux ruines souterraines d\'ingénieurs.',
    tacticalSectors: ['Plateforme d\'Accrochage de l\'Endeavor', 'Raffinerie Inondée de Mutagène Rouge', 'Nid de la Reine Monica LV-895', 'Chambre Stellaire des Ingénieurs'],
    environmentalHazards: ['Bursters explosifs projetant de l\'acide', 'Spitters sur les corniches hautes', 'Champs de spores radioactives'],
    keyPreyIds: ['alien_base_herrera_endeavor_commander', 'alien_base_monica_leon_895'],
    heroSquadId: 'squad_afe_endeavor_marines_2202',
    villainSquadId: 'squad_afe_katanga_pathogen_swarm'
  },
  {
    id: 'map_lethe_colony_2023',
    name: 'Planète Lethe — Port Hills & Protocole Cerberus (2023)',
    originMedia: 'Aliens: Dark Descent (2023, Tindalos Interactive)',
    universe: 'ALIEN',
    releaseYear: 2023,
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Lethe — Spatioport en Quarantaine',
    environmentSummary: 'Colonie minière fortifiée, rues balayées par des vents toxiques, sous-sols industriels et barricades de fortune USCM.',
    tacticalSectors: ['Centre de Contrôle Administratif de Lethe', 'Réseau d\'Égouts et Galeries Minières', 'Spatioport sous Protocole Cerberus', 'Poste de Défense Avancé USCM'],
    environmentalHazards: ['Tirs de satellites de défense orbitale Cerberus', 'Niveau de stress tactique croissant', 'Poches d\'œufs sous les caillebotis'],
    keyPreyIds: ['alien_base_dwayne_hicks_corporal'],
    heroSquadId: 'squad_uscm_hadleys_hope_1986',
    villainSquadId: 'squad_weyland_blackops_containment'
  },

  {
    id: 'map_gateway_station_1986',
    name: 'Station Gateway — Quais Orbitaux & Spatioport Terrien (2179)',
    originMedia: 'Aliens (1986, James Cameron)',
    universe: 'ALIEN',
    releaseYear: 1986,
    biomeId: 'space_hulk',
    recommendedBiomeLabel: 'Quais Stellaires Gateway',
    environmentSummary: 'Anneaux de gravité artificielle, docks d\'amarrage de l\'USS Sulaco, baies de décontamination et coursives industrielles Weyland.',
    tacticalSectors: ['Docks d\'Amarrage de l\'USS Sulaco', 'Complexe de Quarantaine Médicale', 'Centre de Contrôle de Trafic Orbital', 'Hangar de Maintenance des Navettes'],
    environmentalHazards: ['Dépressurisation en brèche', 'Sas de sécurité étanches automatisés', 'Arcs haute tension d\'amarrage'],
    keyPreyIds: ['alien_base_ripley_p5000_power_loader', 'prey_synthetic_bishop_hyperdyne'],
    heroSquadId: 'squad_uscm_hadleys_hope_1986',
    villainSquadId: 'squad_uscm_hadleys_hope_1986'
  },
  {
    id: 'map_charon_research_facility_1993',
    name: 'Station Charon — Laboratoires de Bio-Génétique & Arène (1993)',
    originMedia: 'Aliens: Rogue (Comics Dark Horse 1993)',
    universe: 'ALIEN',
    releaseYear: 1993,
    biomeId: 'temple',
    recommendedBiomeLabel: 'Complexe de Recherche Charon',
    environmentSummary: 'Laboratoires génétiques souterrains du Dr Kleist, cuves de culture du King Alien, arène de duel et couloirs de confinement renforcés.',
    tacticalSectors: ['Arène de Combat Éprouvette', 'Cuves de Gestation du King Alien', 'Quartier Médical du Dr Kleist', 'Noyau de Purge Thermonucléaire'],
    environmentalHazards: ['Vapeurs d\'acide xénomorphe', 'Barrières lasers de confinement', 'Brèche de spécimens mutants'],
    keyPreyIds: ['alien_base_ripley_p5000_power_loader', 'prey_synthetic_ash_hyperdyne'],
    heroSquadId: 'squad_charon_kleist_rogue_swarm',
    villainSquadId: 'squad_charon_kleist_rogue_swarm'
  },

  // --- UNIVERS ALIEN VS. PREDATOR (8 Cartes) ---
  {
    id: 'map_bouvetoya_pyramid_2004',
    name: 'Bouvetøya — Station Baleinière & Pyramide Souterraine (2004)',
    originMedia: 'AVP: Alien vs. Predator (2004, Paul W.S. Anderson)',
    universe: 'AVP',
    releaseYear: 2004,
    biomeId: 'bouvetoya_pyramid',
    recommendedBiomeLabel: 'Bouvetøya — Pyramide Millénaire',
    environmentSummary: 'Station baleinière abandonnée sous le blizzard antarctique, puits de forage thermal et pyramide en blocs mobiles rotatifs.',
    tacticalSectors: ['Camp de Surface de Razorback Point', 'Puits de Forage Thermal de 700 Mètres', 'Labyrinthe Mécanique à Murs Coulissants', 'Chambre Sacrificielle de la Reine Enchaînée'],
    environmentalHazards: ['Murs coulissants écrasants toutes les 10 minutes', 'Froid polaire extrême (-40°C)', 'Acide de Grid Alien sur les dalles'],
    keyPreyIds: ['alien_base_alexa_lex_woods_guide', 'alien_base_charles_bishop_weyland_founder'],
    heroSquadId: 'squad_bouvetoya_expedition_2004',
    villainSquadId: 'squad_avp_young_bloods_trio'
  },
  {
    id: 'map_gunnison_outbreak_2007',
    name: 'Gunnison — Nuit de l\'Épidémie & Hôpital sous la Pluie (2007)',
    originMedia: 'Aliens vs. Predator: Requiem (2007, The Brothers Strause)',
    universe: 'AVP',
    releaseYear: 2007,
    biomeId: 'gunnison_outbreak',
    recommendedBiomeLabel: 'Gunnison — Ville sous Infestation',
    environmentSummary: 'Petite ville du Colorado submergée par la pluie battante : forêt du crash du scout-ship, égouts urbains, armurerie et toit de l\'hôpital.',
    tacticalSectors: ['Forêt du Crash de la Navette Yautja', 'Égouts Municipaux Corrompus par le Predalien', 'Magasin de Chasse et Armurerie de la Ville', 'Héliport du Toit de l\'Hôpital Général'],
    environmentalHazards: ['Pluie torrentielle affaiblissant les signatures thermiques', 'Mines laser de Wolf dans les passages étroits', 'Frappe nucléaire tactique imminente'],
    keyPreyIds: ['prey_wolf_cleaner_2007', 'prey_predalien_subprime'],
    heroSquadId: 'squad_avpr_gunnison_citizens_2007',
    villainSquadId: 'squad_avpr_predalien_infestation_swarm'
  },
  {
    id: 'map_ryushi_frontier_1990',
    name: 'Ryushi — Désert Aride & Prosperity Wells (1990)',
    originMedia: 'Aliens vs. Predator (Comics Dark Horse 1990)',
    universe: 'AVP',
    releaseYear: 1990,
    biomeId: 'ryushi_desert',
    recommendedBiomeLabel: 'Ryushi — Désert & Ranchs Coloniaux',
    environmentSummary: 'Plaines désertiques balayées par des tempêtes de sable, ranchs de rhynths colossaux et comptoir colonial de Prosperity Wells.',
    tacticalSectors: ['Comptoir Colonial de Prosperity Wells', 'Ranchs des Rhynths Hexapodes', 'Canyon des Tempêtes de Poussière', 'Site du Crash du Vaisseau de Dachande'],
    environmentalHazards: ['Tempêtes de poussière abrasives', 'Chaleur écrasante le jour, gel la nuit', 'Charges de troupeaux de rhynths en panique'],
    keyPreyIds: ['alien_base_major_dutch_schaefer_cyborg'],
    heroSquadId: 'squad_weyland_blackops_containment',
    villainSquadId: 'squad_avp_young_bloods_trio'
  },
  {
    id: 'map_lv363_rift_war_2022',
    name: 'LV-363 — Failles Géotectoniques & Flore Narcotique (2022)',
    originMedia: 'Aliens vs. Predators: Rift War (Roman Titan 2022)',
    universe: 'AVP',
    releaseYear: 2022,
    biomeId: 'genna_deathworld',
    recommendedBiomeLabel: 'LV-363 — Failles & Flore Toxique',
    environmentSummary: 'Monde instable fracturé par des failles sismiques, recouvert d\'une végétation vénéneuse distillant des vapeurs narcotiques.',
    tacticalSectors: ['Canyon des Fissures Géothermiques', 'Jungle de Lianes Narcotiques et Hallucinogènes', 'Ruche Troglodyte des Falaises', 'Camp de Fortification des Marines et Yautjas'],
    environmentalHazards: ['Gaz hallucinogènes altérant la vision thermique', 'Effondrements de failles sous le poids', 'Pluie acide volcanique'],
    keyPreyIds: ['alien_base_herrera_endeavor_commander'],
    heroSquadId: 'squad_uscm_hadleys_hope_1986',
    villainSquadId: 'squad_avp_young_bloods_trio'
  },
  {
    id: 'map_extinction_shrine_2003',
    name: 'LV-742 — Sanctuaire des Anciens & Ruches Clandestines (2003)',
    originMedia: 'Aliens versus Predator: Extinction (2003, EA / Zono)',
    universe: 'AVP',
    releaseYear: 2003,
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'LV-742 — Territoire de Guerre Totale',
    environmentSummary: 'Plateau rocheux volcanique où s\'affrontent trois armées : clans Yautja d\'élite, hordes xénomorphes pures et forces armées de Weyland-Yutani.',
    tacticalSectors: ['Sanctuaire Shrine des Anciens Yautja', 'Nid Troglodyte des Praetorians', 'Base Avancée Militaire Weyland', 'Champs de Lave en Fusion'],
    environmentalHazards: ['Coulées de lave incandescente', 'Frappes de mortiers d\'artillerie lourde', 'Nuages de gaz toxiques'],
    keyPreyIds: ['alien_base_ripley_p5000_power_loader'],
    heroSquadId: 'squad_weyland_blackops_containment',
    villainSquadId: 'squad_avp_young_bloods_trio'
  },
  {
    id: 'map_yautja_prime_proving_grounds',
    name: 'Yautja Prime — Domaine Clanique & Sanctuaire d\'Épreuve',
    originMedia: 'Univers Étendu Yautja Lore',
    universe: 'AVP',
    releaseYear: 2020,
    biomeId: 'yautja_prime',
    recommendedBiomeLabel: 'Yautja Prime — Sanctuaire des Épreuves',
    environmentSummary: 'Cités en pyramides étagées d\'airain, arène sacrificielle illuminée de braseros au plasma et stèles des Maîtres Émérites.',
    tacticalSectors: ['Arène Centrale du Conseil des Anciens', 'Galerie des Trophées de Titans', 'Fonderie des Lames Cérémoniales', 'Plateforme de Téléportation de Chasse'],
    environmentalHazards: ['Piliers d\'énergie sacrificielle', 'Arcs de plasma de confinement', 'Duels d\'honneur sans armes de jet autorisées'],
    keyPreyIds: ['alien_base_alpha_predator_kaail', 'alien_base_cleopatra_predator'],
    heroSquadId: 'squad_phg_yautja_legends_circle',
    villainSquadId: 'squad_predators_super_clan_berserkers'
  }
,
  {
    id: 'map_lv1201_forward_pods_2001',
    name: 'LV-1201 — Forward Observation Pods & Ruches du Canyon (2001)',
    originMedia: 'Aliens versus Predator 2 (Monolith 2001)',
    universe: 'AVP',
    releaseYear: 2001,
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Canyons & Pods de LV-1201',
    environmentSummary: 'Passerelles suspendues au-dessus du gouffre, modules d\'observation de la Weyland-Yutani, grottes xénomorphes et temple d\'initiation Yautja.',
    tacticalSectors: ['Pods d\'Observation Suspendus', 'Canyon des Ruches Profondes', 'Station de Recherche Weyland Lab', 'Sanctuaire des Lames Anciennes'],
    environmentalHazards: ['Chutes mortelles dans le gouffre', 'Nids de Facehuggers furtifs', 'Brumes acides sulfuriques'],
    keyPreyIds: ['prey_wolf_cleaner_2007', 'alien_base_ripley_p5000_power_loader'],
    heroSquadId: 'squad_uscm_hadleys_hope_1986',
    villainSquadId: 'squad_avpr_predalien_infestation_swarm'
  },
  {
    id: 'map_yautja_prime_proving_arena',
    name: 'Yautja Prime — Grande Arène des Matriarches & Colisée (Lore)',
    originMedia: 'Aliens vs. Predator: Prey (Roman 1994, Steve & Stephani Perry)',
    universe: 'AVP',
    releaseYear: 1994,
    biomeId: 'temple',
    recommendedBiomeLabel: 'Arène Cérémoniale de Yautja Prime',
    environmentSummary: 'Sable rouge incandescent, colonnades basaltiques gravées de glyphes de victoire, balcons des Matriarches et fosses de combat xénomorphes.',
    tacticalSectors: ['Colisée de Sable Rouge', 'Balcon d\'Observation des Matriarches', 'Fosses d\'Élevage des Proies d\'Élite', 'Autel du Premier Sang'],
    environmentalHazards: ['Piliers d\'énergie sacrificielle', 'Arcs de plasma de confinement', 'Duels d\'honneur sans armes de jet autorisées'],
    keyPreyIds: ['alien_base_alpha_predator_kaail', 'alien_base_cleopatra_predator'],
    heroSquadId: 'squad_yautja_prime_proving_circle',
    villainSquadId: 'squad_yautja_prime_proving_circle'
  },
  {
    id: 'map_dark_river_urban_1991',
    name: 'Jungle Urbaine & Docks Nocturnes — Territoire de Traque (1991)',
    originMedia: 'Predator: Concrete Jungle / Dark River (Comics Dark Horse 1989-1996)',
    universe: 'PREDATOR',
    releaseYear: 1991,
    biomeId: 'los_angeles_1997',
    recommendedBiomeLabel: 'Docks Nocturnes & Gratte-Ciels sous Orage',
    environmentSummary: 'Toits industriels battus par la pluie, entrepôts portuaires, grues suspendues et ruelles saturées de vapeur favorisant la traque verticale.',
    tacticalSectors: ['Corniches Art Déco des Gratte-Ciels', 'Entrepôts des Docks de Contrebande', 'Passerelles du Pont Suspendu', 'Égouts Pluviaux Haute Pression'],
    environmentalHazards: ['Orage magnétique brouillant l\'optique', 'Câbles haute tension rompus', 'Tir croisé de syndicats armés'],
    keyPreyIds: ['prey_yautja_scarface_neonopolis', 'prey_bad_blood_warlord'],
    heroSquadId: 'squad_p2_lapd_harrigan_1997',
    villainSquadId: 'squad_bad_blood_renegade_pack'
  },
  {
    id: 'map_south_china_sea_atoll_2017',
    name: 'Mer de Chine Méridionale — Atoll Fortifié des Chasseurs (2017)',
    originMedia: 'Predator: Hunters (Comics Dark Horse 2017-2020)',
    universe: 'PREDATOR',
    releaseYear: 2017,
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Atoll Tropical & Bunkers Insulaires',
    environmentSummary: 'Île volcanique isolée sillonnée de bunkers de la Seconde Guerre mondiale, récifs coralliens, jungle dense et sanctuaire de trophées Yautja.',
    tacticalSectors: ['Plage de Débarquement Corallienne', 'Bunkers d\'Artillerie Côtière', 'Temple Englouti de la Lagune', 'Crête Volcanique d\'Observation'],
    environmentalHazards: ['Pièges à câbles monofilaments', 'Marée montante dans les grottes', 'Embuscades de Bad Bloods insulaires'],
    keyPreyIds: ['alien_base_dutch_2025_owlf', 'canon251_yautja_bad_blood_vengeur'],
    heroSquadId: 'squad_predator_hunters_veterans_2017',
    villainSquadId: 'squad_bad_blood_renegade_pack'
  },
  {
    id: 'map_origin_derelict_trench_2013',
    name: 'LV-426 Origin Site — Tranchée de Fouilles du Derelict (2179)',
    originMedia: 'Aliens: Colonial Marines (Gearbox / SEGA 2013)',
    universe: 'ALIEN',
    releaseYear: 2013,
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Cordon Militaire Weyland & Épave Derelict',
    environmentSummary: 'Complexe de tentes pressurisées Weyland-Yutani bâti au pied du vaisseau Ingénieur écrasé, tranchées de défense et soute aux œufs millénaire.',
    tacticalSectors: ['Tranchées Blindées Weyland-Yutani', 'Laboratoire de Recherche Mobile', 'Passerelle d\'Accès au Derelict', 'Chambre du Pilote Space Jockey'],
    environmentalHazards: ['Tourelles automatiques reprogrammées', 'Brume bleue de stase des œufs', 'Charges de Xénomorphes Crusher'],
    keyPreyIds: ['alien_base_dwayne_hicks_corporal', 'prey_xeno_crusher'],
    heroSquadId: 'squad_colonial_marines_uss_sephora_2013',
    villainSquadId: 'squad_weyland_blackops_containment'
  },
  {
    id: 'map_innominata_labyrinth_1993',
    name: 'Station Innominata — Le Labyrinthe du Dr Church (1993)',
    originMedia: 'Aliens: Labyrinth (Comics Dark Horse 1993, Jim Woodring & Kilian Plunkett)',
    universe: 'ALIEN',
    releaseYear: 1993,
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Complexe Expérimental Innominata',
    environmentSummary: 'Station orbitale secrète abritant un labyrinthe de verre et d\'acier conçu par le Dr Paul Church pour étudier la psychopathologie xénomorphe.',
    tacticalSectors: ['Anneau du Labyrinthe Vitré', 'Nid Malade de la Souche Mutante', 'Quartiers Médicaux du Colonel Crespi', 'Sas de Purge Cryogénique'],
    environmentalHazards: ['Spores fongiques de ruche malade', 'Cloisons mobiles de test comportemental', 'Gaz neurotoxique de confinement'],
    keyPreyIds: ['prey_weyland_combat_android', 'prey_xeno_warrior'],
    heroSquadId: 'squad_labyrinth_innominata_research_1993',
    villainSquadId: 'squad_labyrinth_innominata_research_1993'
  },
  {
    id: 'map_bg386_freyas_prospect_2010',
    name: 'Planète BG-386 — Colonie Freya\'s Prospect & Pyramide Antique (2010)',
    originMedia: 'Aliens vs. Predator (Rebellion / SEGA 2010)',
    universe: 'AVP',
    releaseYear: 2010,
    biomeId: 'bouvetoya_pyramid',
    recommendedBiomeLabel: 'Jungle de BG-386 & Sanctuaire de Dark',
    environmentSummary: 'Jungle marécageuse surplombant une raffinerie coloniale, une arène de combat sanglante et la plus ancienne pyramide Yautja découverte par Karl Bishop Weyland.',
    tacticalSectors: ['Marais & Tours de Relais de Freya\'s Prospect', 'Raffinerie & Nid de la Matriarche Specimen 6', 'Arène d\'Épreuve de la Jungle', 'Tombeau du Seigneur Yautja Ancestral'],
    environmentalHazards: ['Fosses de lave volcanique sous la pyramide', 'Androïdes de combat Weyland camouflés', 'Assaut de l\'Abomination Predalien'],
    keyPreyIds: ['prey_predalien_abomination', 'prey_weyland_combat_android'],
    heroSquadId: 'squad_avp2010_bg386_elite_claw',
    villainSquadId: 'squad_weyland_blackops_containment'
  },
  {
    id: 'map_lv223_fire_and_stone_2014',
    name: 'Lune LV-223 — Montagnes Mutées & Temple de l\'Ingénieur (2219)',
    originMedia: 'Alien vs. Predator: Fire and Stone (Comics Dark Horse 2014)',
    universe: 'AVP',
    releaseYear: 2014,
    biomeId: 'genna_deathworld',
    recommendedBiomeLabel: 'Jungle Mutagène de LV-223',
    environmentSummary: 'Paysage volcanique de LV-223 métamorphosé en jungle organique monstrueuse par le mutagène noir après le crash du Prometheus.',
    tacticalSectors: ['Épave Engluée du Vaisseau Geryon', 'Forêt Mutagène d\'Os et de Résine', 'Cratère du Duel d\'Ahab', 'Sanctuaire Souterrain de l\'Ingénieur'],
    environmentalHazards: ['Brouillard de spores A0-3959X', 'Faune mutée agressive', 'Tirs de fusil à particules d\'Ingénieur'],
    keyPreyIds: ['prey_ahab_elder_persée', 'prey_engineer_architect'],
    heroSquadId: 'squad_fire_and_stone_perses_crew_2014',
    villainSquadId: 'squad_prometheus_engineer_awakening'
  },
  {
    id: 'map_new_jersey_pine_barrens_1993',
    name: 'New Jersey — Marais de Pine Barrens & Forêt de Sang (1993)',
    originMedia: 'Predator: Bad Blood (Comics Dark Horse 1993, Evan Dorkin)',
    universe: 'PREDATOR',
    releaseYear: 1993,
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Marécages Brumeux de Pine Barrens',
    environmentSummary: 'Forêts de pins denses du New Jersey plongées dans le brouillard, cabanes isolées massacrées par un Bad Blood et périmètre d\'encerclement de la CIA.',
    tacticalSectors: ['Cabane des Trappeurs Écorchés', 'Marais Brumeux des Pins Noirs', 'Campement Tactique de la CIA', 'Clairière d\'Atterrissage de l\'Enforcer'],
    environmentalHazards: ['Brouillard épais masquant les mines', 'Pièges à pieux de Bad Blood', 'Duel croisé entre Enforcer et Renégat'],
    keyPreyIds: ['prey_bad_blood_warlord', 'canon251_yautja_bad_blood_vengeur'],
    heroSquadId: 'squad_pine_barrens_cia_hunters_1993',
    villainSquadId: 'squad_bad_blood_renegade_pack'
  },
  {
    id: 'map_ww2_solomon_airfield_1942',
    name: 'Pacifique Sud — Aérodrome des Îles Salomon & Bunker (1942)',
    originMedia: 'Predator: Killer of Killers (2025 — Segment Pacifique 1942)',
    universe: 'PREDATOR',
    releaseYear: 2025,
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Aérodrome du Pacifique 1942',
    environmentSummary: 'Base aérienne alliée au cœur d\'une île volcanique du Pacifique, hangars bombardés, épaves de chasseurs F4U Corsair et bunkers japonais dans la jungle.',
    tacticalSectors: ['Piste en Plaques d\'Acier Perforées', 'Hangar de Maintenance des Corsairs', 'Batterie Antiaérienne Côtière', 'Réseau de Tunnels Volcaniques'],
    environmentalHazards: ['Tirs de barrage antiaériens DCA', 'Carburant d\'aviation enflammé', 'Frappes de harpon en piqué'],
    keyPreyIds: ['prey_jungle_hunter_1987', 'alien_base_major_dutch_schaefer_1987'],
    heroSquadId: 'squad_killers_of_killers_trio',
    villainSquadId: 'squad_killers_of_killers_trio'
  },
  {
    id: 'map_earth_prodigy_new_siam_2120',
    name: 'Terre (2120) — Île-Laboratoire de Prodigy Corp & Crash Orbital',
    originMedia: 'Alien: Earth (Série FX 2025, Noah Hawley)',
    universe: 'ALIEN',
    releaseYear: 2025,
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Complexe Insulaire Prodigy Corp (Terre)',
    environmentSummary: 'Cité corporatiste ultra-moderne de Boy Kavalier percutée par un vaisseau d\'exploration Weyland-Yutani ramenant des spécimens extraterrestres sur Terre.',
    tacticalSectors: ['Cratère d\'Impact du Vaisseau Weyland', 'Laboratoires de Transfert de Conscience', 'Jardins Biomécaniques de Prodigy', 'Tour de Commandement de Boy Kavalier'],
    environmentalHazards: ['Brèche de confinement multi-espèces', 'Verrouillage par synthétiques tactiques', 'Incendies chimiques urbains'],
    keyPreyIds: ['prey_weyland_combat_android', 'prey_xeno_warrior'],
    heroSquadId: 'squad_alien_earth_prodigy_tactical_2120',
    villainSquadId: 'squad_weyland_blackops_containment'
  },
  {
    id: 'map_usm_auriga_aquatics_2381',
    name: 'USM Auriga — Cuisines Inondées, Cages de Clones & Nid (2381)',
    originMedia: 'Alien: Resurrection (1997, Jean-Pierre Jeunet)',
    universe: 'ALIEN',
    releaseYear: 1997,
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Secteur Submergé de l\'USM Auriga',
    environmentSummary: 'Vaisseau de recherche médicale militaire en perdition : corridors inondés infestés de nageurs xénomorphes, laboratoire des clones 1-7 et soute du Betty.',
    tacticalSectors: ['Cuisines Submergées en Apesanteur', 'Salle des Trophées des Clones 1 à 7', 'Puits d\'Échelle Vertical & Passerelles', 'Nid Utérin de la Reine & du Newborn'],
    environmentalHazards: ['Embuscades aquatiques sous-marines', 'Projections d\'acide en milieu clos', 'Descente d\'urgence vers la Terre'],
    keyPreyIds: ['prey_xeno_queen_matriarch', 'prey_xeno_warrior'],
    heroSquadId: 'squad_betty_mercenaries_1997',
    villainSquadId: 'squad_usm_auriga_perez_science_2381'
  },
  {
    id: 'map_sanjose_infested_city_1994',
    name: 'San Jose (Californie) — Ruche Urbaine & Croiseur Weyland (1994)',
    originMedia: 'Alien vs. Predator (Capcom Arcade 1994)',
    universe: 'AVP',
    releaseYear: 1994,
    biomeId: 'los_angeles_1997',
    recommendedBiomeLabel: 'San Jose Infesté & Base du Général Bush',
    environmentSummary: 'Métropole californienne envahie par des hordes xénomorphes, autoroutes calcinées, laboratoire souterrain de bio-armes et cuirassé militaire en orbite.',
    tacticalSectors: ['Boulevard Urbain Submergé par la Ruche', 'Sous-Sols Bio-Armes du Général Bush', 'Hangar du Blindé APC Modifié', 'Pont Principal du Croiseur Militaire'],
    environmentalHazards: ['Vagues continues de Guerriers et Chrysalides', 'Tir orbital d\'artillerie lourde', 'autodestruction du vaisseau amiral'],
    keyPreyIds: ['alien_base_major_dutch_schaefer_cyborg', 'prey_xeno_queen_matriarch'],
    heroSquadId: 'squad_capcom_avp_sanjose_alliance_1994',
    villainSquadId: 'squad_weyland_blackops_containment'
  },
  {
    id: 'map_new_way_city_1930_prohibition',
    name: 'New Way City (1930) — Docks de la Prohibition & Manoir Bruno Borgia',
    originMedia: 'Predator: Concrete Jungle (Sierra / Eurocom 2005)',
    universe: 'PREDATOR',
    releaseYear: 2005,
    biomeId: 'los_angeles_1997',
    recommendedBiomeLabel: 'New Way City (Ère Prohibition 1930)',
    environmentSummary: 'Métropole portuaire pluvieuse des années 1930 dominée par la contrebande d\'alcool des Irlandais de Dead Men et la famille mafieuse de Bruno Borgia.',
    tacticalSectors: ['Entrepôts Clandestins du Port', 'Clocher de la Cathédrale Saint-Marc', 'Musée Privé de Bruno Borgia', 'Toits en Feu de Midtown 1930'],
    environmentalHazards: ['Tirs croisés de mitraillettes Thompson', 'Incendies de distilleries clandestines', 'Cercle d\'autodestruction de Scarface'],
    keyPreyIds: ['prey_jungle_hunter_1987', 'alien_base_major_dutch_schaefer_cyborg'],
    heroSquadId: 'squad_concrete_jungle_borgia_syndicate',
    villainSquadId: 'squad_p2_cartel_king_willie_posse'
  },
  {
    id: 'map_new_york_heatwave_1989_schaefer',
    name: 'New York (1989) — Canicule de Manhattan & Enquête John Schaefer',
    originMedia: 'Predator: Concrete Jungle (Comics Dark Horse 1989)',
    universe: 'PREDATOR',
    releaseYear: 1989,
    biomeId: 'los_angeles_1997',
    recommendedBiomeLabel: 'Manhattan Sous Canicule (1989)',
    environmentSummary: 'Les gratte-ciel étouffants de New York, Central Park de nuit et les quais de l\'Hudson transformés en abattoir par une flotte entière de chasseurs Yautja.',
    tacticalSectors: ['Commissariat Central du NYPD', 'Canopée Nocturne de Central Park', 'Rames Aériennes du Métro du Bronx', 'Pont d\'Extraction de l\'Hudson'],
    environmentalHazards: ['Dôme de chaleur urbain à 41°C', 'Guerre des cartels colombiens et jamaïcains', 'Frappes coordonnées de vaisseau Yautja'],
    keyPreyIds: ['alien_base_major_dutch_schaefer_1987', 'alien_base_george_dillon_cia'],
    heroSquadId: 'squad_ny_detective_john_schaefer_1989',
    villainSquadId: 'squad_killer_clan_bad_blood_pack'
  },
  {
    id: 'map_lv178_marion_trimonite_mine_2159',
    name: 'LV-178 (New Galveston) — Puits de Trimonite & Épave Antique (2159)',
    originMedia: 'Alien: Out of the Shadows / Sea of Sorrows (Romans Canon 2014)',
    universe: 'ALIEN',
    releaseYear: 2014,
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Mines Profondes de LV-178 & DSMO Marion',
    environmentSummary: 'Monde désertique balayé par les tempêtes de sable recelant d\'immenses galeries minières de Trimonite et une ancienne nef extraterrestre infestée.',
    tacticalSectors: ['Ascenseur Orbital du DSMO Marion', 'Excavation Principale de Trimonite', 'Soute de la Navette Narcissus (I.A. Ash)', 'Chambre d\'Hibernation de la Souche Antique'],
    environmentalHazards: ['Effondrements de galeries de Trimonite', 'Sabotage informatique de l\'I.A. Ash', 'Poches de gaz méthane inflammable'],
    keyPreyIds: ['prey_weyland_combat_android', 'prey_xeno_warrior'],
    heroSquadId: 'squad_out_of_shadows_marion_miners_2159',
    villainSquadId: 'squad_weyland_blackops_containment'
  },
  {
    id: 'map_upp_space_station_frontiere_2184',
    name: 'Secteur Frontière UPP — Station Orbitale Soviéto-Spatiale Mir-12 (2184)',
    originMedia: 'Alien: The Roleplaying Game — Building Better Worlds (Free League)',
    universe: 'ALIEN',
    releaseYear: 2020,
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Avant-Poste Stellaire de l\'UPP (Frontière)',
    environmentSummary: 'Station minière et militaire brutaliste de l\'Union des Peuples Progressistes (UPP) confrontée à une incursion biologique clandestine de la Guerre Froide spatiale.',
    tacticalSectors: ['Dock d\'Amarrage des Croiseurs UPP', 'Quartiers du Commissariat Politique', 'Laboratoire de Recherche Cosmique', 'Cœur du Réacteur Soviéto-Atomique'],
    environmentalHazards: ['Dépressurisation explosive des sas', 'Purges thermiques automatisées UPP', 'Patrouilles de Commandos Spatiaux lourdement blindés'],
    keyPreyIds: ['alien_base_william_hudson_private', 'prey_xeno_queen_matriarch'],
    heroSquadId: 'squad_upp_space_commandos_2184',
    villainSquadId: 'squad_charon_kleist_rogue_swarm'
  },
  {
    id: 'map_tartarus_life_and_death_2219',
    name: 'Planète Tartarus — Vaisseau en Fer à Cheval & Garnison Hasdrubal (2219)',
    originMedia: 'Predator / Aliens vs. Predator: Life and Death (Dark Horse 2016)',
    universe: 'AVP',
    releaseYear: 2016,
    biomeId: 'genna_deathworld',
    recommendedBiomeLabel: 'Jungle de Tartarus & Épave Ingénieur',
    environmentSummary: 'Le théâtre d\'ouverture du cycle Life and Death : une planète d\'exploitation minière où les Marines de l\'USS Hasdrubal se heurtent au clan de Tartarus et à un Ingénieur.',
    tacticalSectors: ['Périmètre de Défense de l\'USS Hasdrubal', 'Colline de l\'Épave en Fer à Cheval', 'Campement d\'Ahab & Galgo Helder', 'Cratère d\'Assaut du Clan de Tartarus'],
    environmentalHazards: ['Bombardement orbital du vaisseau Yautja', 'Réveil des défenses biomécaniques de l\'Ingénieur', 'Essaims xénomorphes nés des colons'],
    keyPreyIds: ['prey_ahab_elder_persée', 'prey_xeno_queen_matriarch'],
    heroSquadId: 'squad_life_and_death_hasdrubal_marines_2219',
    villainSquadId: 'squad_prometheus_engineer_awakening'
  },
  {
    id: 'map_tokyo_gideon_suwa_tower_1998',
    name: 'Tokyo (1998) — Tour Cybernétique de Gideon Suwa & Épave du XIVe Siècle',
    originMedia: 'Aliens vs. Predator: Eternal (Comics Dark Horse 1998)',
    universe: 'AVP',
    releaseYear: 1998,
    biomeId: 'los_angeles_1997',
    recommendedBiomeLabel: 'Mégalopole de Tokyo & Sanctuaire Suwa',
    environmentSummary: 'Gratte-ciel ultra-technologique au cœur de Tokyo abritant dans ses fondations l\'épave d\'un vaisseau Yautja vieux de sept siècles exploitée par Gideon Suwa.',
    tacticalSectors: ['Héliport Blindé de la Tour Suwa', 'Laboratoire de Longévité Cardiaque Yautja', 'Cale d\'Incubation Xénomorphe Souterraine', 'Pont du Vaisseau Millénaire Enfouie'],
    environmentalHazards: ['Tourelles lasers rétro-conçues par Suwa', 'Rupture des cuves de stase xénomorphes', 'Purge d\'honneur de la meute Yautja'],
    keyPreyIds: ['prey_predalien_abomination', 'prey_xeno_warrior'],
    heroSquadId: 'squad_avp_eternal_suwa_syndicate_1998',
    villainSquadId: 'squad_enforcers_council_arbiters'
  },
  {
    id: 'map_xenomorph_prime_g435_hive',
    name: 'Xenomorph Prime (G-435) — Méga-Ruche Souveraine de la Reine-Mère',
    originMedia: 'Aliens: Earth War / Genocide (Comics Dark Horse 1990-1991)',
    universe: 'AVP',
    releaseYear: 1991,
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Monde Natal Xenomorph Prime (G-435)',
    environmentSummary: 'Le monde d\'origine cauchemardesque de l\'espèce XX121 : continents entiers de résine organique, lacs de Gelée Royale et trône de la Reine-Mère.',
    tacticalSectors: ['Canyon des Deux Ruches Ennemies', 'Bassins de Gelée Royale Xeno-Zip', 'Rempart des Gardes Palatins', 'Sanctuaire Télépathique de la Reine-Mère'],
    environmentalHazards: ['Pluies corrosives atmosphériques', 'Pression télépathique de la Reine-Mère', 'Essaims infinis de Prétoriens'],
    keyPreyIds: ['prey_xeno_queen_matriarch', 'prey_xeno_king_titan'],
    heroSquadId: 'squad_lv742_kainde_amedha_shrine_2003',
    villainSquadId: 'squad_avpr_predalien_infestation_swarm'
  },
  {
    id: 'map_london_whitechapel_fog_1896',
    name: 'Londres Victorien (1896) — Brouillard de Whitechapel & Quais de la Tamise',
    originMedia: 'Predator: Nemesis (Comics Dark Horse 1997)',
    universe: 'PREDATOR',
    releaseYear: 1997,
    biomeId: 'los_angeles_1997',
    recommendedBiomeLabel: 'Londres Victorien & Ruelles Brumeuses (1896)',
    environmentSummary: 'Les ruelles de pavés gras et de suie de charbon de Whitechapel, docks étouffés par le smog londonien, égouts sous la Tamise et manoirs aristocratiques.',
    tacticalSectors: ['Allées Sombres de Whitechapel', 'Arches Supérieures du Tower Bridge', 'Catacombes de la Première Ligne de Métro', 'Entrepôts Douaniers des Docks de l\'Est'],
    environmentalHazards: ['Visibilité quasi nulle dans le smog épais', 'Réverbères à gaz explosifs', 'Meutes de chiens de garde des limiers'],
    keyPreyIds: ['prey_jungle_hunter_1987', 'alien_base_major_dutch_schaefer_1987'],
    heroSquadId: 'squad_london_1896_edward_soames',
    villainSquadId: 'squad_p2_cartel_king_willie_posse'
  },
  {
    id: 'map_south_china_sea_spratly_islands',
    name: 'Mer de Chine (1998) — Archipel des Spratleys & Mangroves Inondées',
    originMedia: 'Predator: South China Sea (Roman Paul A. Carter 1998)',
    universe: 'PREDATOR',
    releaseYear: 1998,
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Îles Spratleys & Marais Tropicaux (1998)',
    environmentSummary: 'Atoll isolé de la Mer de Chine balayé par un typhon tropical : mangroves denses, épave de cargo cambodgien échoué et forteresses de béton abandonnées.',
    tacticalSectors: ['Plage de Corail Sous la Mousson', 'Mangroves Saumâtres des Crocodiles', 'Pont Éventré du Cargo Cambodgien', 'Bunker d\'Artillerie Japonais 1944'],
    environmentalHazards: ['Vents de mousson déviant les tirs légers', 'Courants de marée montante', 'Attaques opportunistes de crocodiles de mer'],
    keyPreyIds: ['prey_xeno_crocodile_goliath', 'prey_jungle_hunter_1987'],
    heroSquadId: 'squad_south_china_sea_pirates_1998',
    villainSquadId: 'squad_pine_barrens_cia_hunters_1993'
  },
  {
    id: 'map_xenomorph_prime_genocide_red_black',
    name: 'Xenomorph Prime — Front de Guerre des Ruches Rouge & Noire (2190)',
    originMedia: 'Aliens: Genocide (Comics Dark Horse 1991-1992)',
    universe: 'ALIEN',
    releaseYear: 1991,
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Guerre Fratricide des Ruches (Genocide)',
    environmentSummary: 'Le champ de bataille biologique suprême sur Xenomorph Prime : no man\'s land de résine disputé férocement entre les hordes de Xénomorphes rouges et noirs.',
    tacticalSectors: ['Tranchée des Résines Noires et Rouges', 'Monticule Royal de la Reine Écarlate', 'Plateau d\'Extraction du Cargo Grant', 'Crête des Prétoriens Mutants'],
    environmentalHazards: ['Geysers de sang acide croisé', 'Affrontements massifs incontrôlés entre les deux souches', 'Pluie acide atmosphérique constante'],
    keyPreyIds: ['prey_xeno_queen_mother', 'prey_xeno_warrior'],
    heroSquadId: 'squad_genocide_grant_xeno_zip_2190',
    villainSquadId: 'squad_charon_kleist_rogue_swarm'
  },
  {
    id: 'map_cold_forge_rb323_station',
    name: 'Station RB-323 (The Cold Forge) — Laboratoires Sub-Orbitaux & Cellules Snatcher',
    originMedia: 'Alien: The Cold Forge (Roman Canon Alex White 2018)',
    universe: 'ALIEN',
    releaseYear: 2018,
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Station Spatiale Clandestine RB-323',
    environmentSummary: 'Complexe de recherche biomécanique en apesanteur orbitale partielle, anneaux de stase cryogénique, sas d\'observation renforcés et couloirs de purge d\'urgence.',
    tacticalSectors: ['Sas de Décontamination Zéro-Gravité', 'Enceinte Sécurisée des Snatchers Hybrides', 'Salle de Téléprésence Synaptique de Marsalis', 'Conduit de Refroidissement du Réacteur Orbital'],
    environmentalHazards: ['Dépressurisations de laboratoire', 'Chambres de purge à gaz neurotoxique', 'Attaques silencieuses de Facehuggers Snatcher'],
    keyPreyIds: ['prey_weyland_combat_android', 'prey_xeno_runner'],
    heroSquadId: 'squad_cold_forge_rb323_science_2179',
    villainSquadId: 'squad_weyland_blackops_containment'
  },
  {
    id: 'map_bunda_deep_mining_colony_2194',
    name: 'Planète Bunda — Complexe Minier B-4 & Rempart de Colonie (2194)',
    originMedia: 'Aliens vs. Predator: War (Comics Dark Horse 1995)',
    universe: 'AVP',
    releaseYear: 1995,
    biomeId: 'ryushi_desert',
    recommendedBiomeLabel: 'Colonie Minière de Bunda & Désert Rouge',
    environmentSummary: 'Colonie minière humaine retranchée au milieu d\'un désert aride de poussière rouge, assiégée simultanément par des hordes d\'Aliens et le clan Yautja de Top Knot.',
    tacticalSectors: ['Barricades Extérieures des Ouvriers Miniers', 'Carrière de Forage de Silicate Rouge', 'Toits de la Station de Pompage d\'Eau', 'Campement de Chasse du Clan Top Knot'],
    environmentalHazards: ['Tempêtes de sable abrasif rouge', 'Tirs d\'armes civiles désespérées', 'Charges de broyage de Xénomorphes en furie'],
    keyPreyIds: ['alien_base_alpha_predator_kaail', 'prey_xeno_warrior'],
    heroSquadId: 'squad_bunda_war_machiko_clan_2194',
    villainSquadId: 'squad_ryushi_chian_am_ranchers'
  },
  {
    id: 'map_lv1201_ancient_pod_sanctuary',
    name: 'LV-1201 — Sanctuaire Souterrain de l\'Artefact & Pod de Stase (2220)',
    originMedia: 'Aliens vs. Predator 2: Primal Hunt (Sierra / Monolith 2002)',
    universe: 'AVP',
    releaseYear: 2002,
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Ruines Millénaires de LV-1201 & Artefact',
    environmentSummary: 'Cités souterraines cyclopéennes sous la jungle toxique de LV-1201, abritant l\'artefact Ingénieur de répulsion et les modules de stase temporelle millénaires.',
    tacticalSectors: ['Chambre de Résonance de l\'Artefact Répulseur', 'Passerelles Étroites au-dessus de l\'Abîme', 'Nid Primitif de la Première Reine', 'Poste Avancé des Mercenaires Iron Bears'],
    environmentalHazards: ['Ondes de choc EMP émises par l\'artefact', 'Fosses sans fond', 'Assauts de nuées de Facehuggers millénaires'],
    keyPreyIds: ['prey_hish_qu_ten_ancient', 'prey_xeno_queen_matriarch'],
    heroSquadId: 'squad_primal_hunt_ancient_lv1201_2002',
    villainSquadId: 'squad_avpr_predalien_infestation_swarm'
  },
  {
    id: 'map_guinea_coast_pirate_cove_1718',
    name: 'Côte de Guinée (1718) — Crique des Pirates & Navire d\'Andolini',
    originMedia: 'Predator: 1718 (Comics Dark Horse 1996)',
    universe: 'PREDATOR',
    releaseYear: 1996,
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Crique Tropicale & Plage des Flibustiers (1718)',
    environmentSummary: 'Plage de sable blanc bordée de falaises calcaires, épave du navire marchand espagnol échoué et campement de pirates au milieu des palétuviers.',
    tacticalSectors: ['Pont Supérieur de la Frégate Espagnole', 'Grotte aux Coffres de l\'Or Maudit', 'Falaises de Calcaire et Palmiers d\'Affût', 'Baraquements de Toile des Boucaniers'],
    environmentalHazards: ['Barils de poudre noire exposés aux étincelles', 'Marées montantes piégeant les grèves', 'Tirs croisés de mousquets et pierriers'],
    keyPreyIds: ['prey_jungle_hunter_1987', 'alien_base_major_dutch_schaefer_1987'],
    heroSquadId: 'squad_pirates_raphael_andolini_1718',
    villainSquadId: 'squad_p2_cartel_king_willie_posse'
  },
  {
    id: 'map_alaska_wilderness_primal_1997',
    name: 'Alaska Wilderness (1997) — Toundra Glacée, Cavernes & Chutes Boréales',
    originMedia: 'Predator: Primal (Comics Dark Horse 1997)',
    universe: 'PREDATOR',
    releaseYear: 1997,
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Toundra Boréale & Forêts Glacées d\'Alaska (1997)',
    environmentSummary: 'Immenses forêts de conifères pétrifiées par le gel, rivières de fonte glaciales, crêtes rocheuses balayées par le blizzard et repaires de grizzlys territoriaux.',
    tacticalSectors: ['Plateau des Pins Enneigés', 'Gorge de la Rivière de Saumons Glacée', 'Tanière de Roches du Grand Grizzly', 'Poste de Guet des Gardes Forestiers'],
    environmentalHazards: ['Bourrasques de blizzard masquant les sons', 'Chutes de stalactites de glace tranchante', 'Charges d\'ours territoriaux acculés'],
    keyPreyIds: ['prey_jungle_hunter_1987', 'alien_base_royce_mercenaire_2010'],
    heroSquadId: 'squad_alaska_primal_rangers_1997',
    villainSquadId: 'squad_pine_barrens_cia_hunters_1993'
  },
  {
    id: 'map_europa_research_vessel_2137',
    name: 'Cuirassé USCSS Europa (2137) — Sas Orbitaux, Baies Médicales & Salles de Cryostase',
    originMedia: 'Aliens: Defiance (Comics Dark Horse 2016-2019)',
    universe: 'ALIEN',
    releaseYear: 2016,
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Cuirassé de Recherche Wey-Yu Europa (2137)',
    environmentSummary: 'Navire de guerre clandestin militaro-scientifique de Weyland-Yutani : coursives étroites en acier trempé, chambres de culture de pathogène et soutes de confinement.',
    tacticalSectors: ['Chambre de Cryostase des Sujets Inoculés', 'Sas de Largage Électromécanique', 'Pont d\'Ingénierie du Réacteur Fusion', 'Laboratoire de Vivisection de Davis 01'],
    environmentalHazards: ['Dépressurisation instantanée de secteur', 'Gaz stérilisant neurotoxique automatisé', 'Facehuggers libérés des couveuses rompues'],
    keyPreyIds: ['prey_colonial_marine_heavy', 'prey_weyland_combat_android'],
    heroSquadId: 'squad_defiance_zula_hendricks_fireteam',
    villainSquadId: 'squad_weyland_blackops_containment'
  },
  {
    id: 'map_spears_nightmare_asylum_outpost',
    name: 'Avant-Poste Militaire Spears (2192) — Arènes de Conditionnement Xéno & Hangars',
    originMedia: 'Aliens: Nightmare Asylum (Comics Dark Horse 1989-1990)',
    universe: 'ALIEN',
    releaseYear: 1989,
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Base Secrète du Général Spears (Nightmare Asylum)',
    environmentSummary: 'Base orbitale militaire fortifiée transformée en centre d\'expérimentation névrotique : enclos électrifiés pour Xenomorphs, cellules d\'entraînement et passerelles de commandement.',
    tacticalSectors: ['Arène Centrale d\'Électro-Chocs Xénomorphes', 'Poste de Contrôle Blindé du Général Spears', 'Hangar des Navettes de Débarquement Terrien', 'Couloirs de Servitude des Cobayes Humains'],
    environmentalHazards: ['Grilles électro-cutanées à haute tension', 'Ruées incontrôlées de drones de combat affamés', 'Tourelles automatiques déréglées'],
    keyPreyIds: ['prey_xeno_warrior', 'prey_colonial_marine_heavy'],
    heroSquadId: 'squad_nightmare_asylum_spears_command',
    villainSquadId: 'squad_charon_kleist_rogue_swarm'
  },
  {
    id: 'map_skyliner_orbital_megacity_montana',
    name: 'Mégalopole Orbitale Skyliner (2195) — Terrasses de Verre & Dômes Biosphériques',
    originMedia: 'Aliens vs. Predator: Deadliest of the Species (Comics Dark Horse 1993)',
    universe: 'AVP',
    releaseYear: 1993,
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Cité Céleste Skyliner de Lucien Delacroix (2195)',
    environmentSummary: 'Complexe orbital aristocratique somptueux flottant au-dessus de la Terre : verrières panoramiques, jardins biosphériques suspendus et laboratoires génétiques d\'Hybrides Blancs.',
    tacticalSectors: ['Atrium de Marbre des Tours Skyliner', 'Serres Suspendues de Flore OGM Tropicale', 'Sanctuaire Holographique de l\'I.A. Toy', 'Galerie Privée des Trophées de Lucien'],
    environmentalHazards: ['Verrières fragiles exposées au vide spatial', 'Drones sentinelles de surveillance armés de lasers', 'Embuscades d\'Hybrides Blancs agiles'],
    keyPreyIds: ['alien_base_alpha_predator_kaail', 'prey_weyland_combat_android'],
    heroSquadId: 'squad_deadliest_caryn_big_mama_clan',
    villainSquadId: 'squad_avp_eternal_suwa_syndicate_1998'
  },
  {
    id: 'map_caparis_vii_three_world_war',
    name: 'Caparis VII (2198) — Tranchées de la Frontière, Nids de Guerre & Ruines Minières',
    originMedia: 'Aliens vs. Predator: Three World War (Comics Dark Horse 2010)',
    universe: 'AVP',
    releaseYear: 2010,
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Champs de Bataille Tripartites de Caparis VII (2198)',
    environmentSummary: 'Planète frontière ravagée par l\'affrontement titanesque entre l\'alliance USCM-Yautja et les hordes de Xénomorphes enchaînés du Clan Killer.',
    tacticalSectors: ['Tranchées de Barbelés et Pylônes USCM', 'Dorsale Rocheuse du Clan Yautja d\'Honneur', 'Nid Fortifié des Xénomorphes du Clan Killer', 'Ruines Fumantes de la Station d\'Épuration'],
    environmentalHazards: ['Tirs de barrage d\'artillerie et roquettes', 'Champs de mines et mares d\'acide fondu', 'Charges de Xenomorphs sous contrôle mental agressif'],
    keyPreyIds: ['alien_base_alpha_predator_kaail', 'prey_xeno_warrior'],
    heroSquadId: 'squad_three_world_war_machiko_uscm',
    villainSquadId: 'squad_killer_clan_bad_blood_pack'
  }
,
  {
    id: 'map_xenogenesis_spearhead_facility_1999',
    name: 'Complexe Spearhead (1999) — Forêt Tropicale & Hangars Cryogéniques Sub-Zero',
    originMedia: 'Predator: Xenogenesis (Comics Dark Horse 1999)',
    universe: 'PREDATOR',
    releaseYear: 1999,
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Base Cyber-Militaire Spearhead & Jungle (1999)',
    environmentSummary: 'Forteresse de béton et laboratoires d\'armement privés dissimulés sous la canopée tropicale d\'Amazonie, équipés de sas cryogéniques pour l\'étude des spécimens Yautja.',
    tacticalSectors: ['Chambre Cryogénique des Caissons Sub-Zero', 'Héliport d\'Évacuation sous Pluie Diluvienne', 'Périmètre Électrifié de Débroussaillement', 'Laboratoire de Balistique Plasmique'],
    environmentalHazards: ['Fuites d\'azote liquide cryogénique', 'Arcs électriques des clôtures haute tension', 'Tirs automatiques de tourelles périmétriques'],
    keyPreyIds: ['prey_jungle_hunter_1987', 'alien_base_royce_mercenaire_2010'],
    heroSquadId: 'squad_xenogenesis_spearhead_mercenaries_1999',
    villainSquadId: 'squad_p2_cartel_king_willie_posse'
  },
  {
    id: 'map_mount_fuji_blood_feud_temple_1993',
    name: 'Mont Fuji (1993) — Temple Ancestral, Forêts de Bambous & Dojos d\'Hiver',
    originMedia: 'Predator: Blood Feud (Comics Dark Horse 1993)',
    universe: 'PREDATOR',
    releaseYear: 1993,
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Sanctuaire Enneigé du Mont Fuji & Bambouseraie (1993)',
    environmentSummary: 'Sanctuaire bouddhiste millénaire perché sur les crêtes brumeuses du Mont Fuji, entouré de forêts de bambous géants et de terrasses de pierre balayées par les flocons.',
    tacticalSectors: ['Dojo Central des Maîtres d\'Armes', 'Sentier Sinueux de la Forêt de Bambous', 'Passerelle de Bois Suspendue au-dessus du Ravin', 'Jardin Zen des Stèles Funéraires Claniques'],
    environmentalHazards: ['Bambous souples masquant la visibilité', 'Surfaces de pierre gelée glissantes', 'Chutes de neige aveuglantes'],
    keyPreyIds: ['prey_jungle_hunter_1987', 'canon249_duelliste_feodal_samourai'],
    heroSquadId: 'squad_blood_feud_samurai_clan_1993',
    villainSquadId: 'squad_kok_feudal_samurai_cabal'
  },
  {
    id: 'map_nemesis_transport_berserker_derelict',
    name: 'Transport Spatial Nemesis — Soutes Ravagées & Cages de Berserkers (2195)',
    originMedia: 'Aliens: Berserker (Comics Dark Horse 1995)',
    universe: 'ALIEN',
    releaseYear: 1995,
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Épave du Cargo Militaire Nemesis (Berserker 2195)',
    environmentSummary: 'Épave à la dérive d\'un spatiocargo de combat USCM ravagé par l\'assaut d\'une ruche xénomorphe : couloirs calcinés par le plasma, soutes à décombres et nids de résine.',
    tacticalSectors: ['Soute Principale des Caissons d\'Exosquelette MAX', 'Pont de Navigation aux Consoles Éventrées', 'Couloir de Décompression Zéro-G', 'Ruche Centrale de l\'Épave'],
    environmentalHazards: ['Poches d\'acide stagnant dans les coursives', 'Fils électriques nus sous haute tension', 'Dépressurisations de sas explosives'],
    keyPreyIds: ['prey_xeno_warrior', 'prey_colonial_marine_heavy'],
    heroSquadId: 'squad_berserker_max_exosuit_team_1995',
    villainSquadId: 'squad_charon_kleist_rogue_swarm'
  },
  {
    id: 'map_stronghold_ernst_biosphere_lab',
    name: 'Forteresse Ernst — Biosphère Expérimentale & Laboratoire Synthétique Jeri (2194)',
    originMedia: 'Aliens: Stronghold (Comics Dark Horse 1994)',
    universe: 'ALIEN',
    releaseYear: 1994,
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Biosphère Clandestine du Dr. Ernst (Stronghold 2194)',
    environmentSummary: 'Complexe hydroponique et génétique isolé au cœur d\'un dôme géodésique : serres tropicales artificielles, cages de spécimens et ateliers de robotique synthétique.',
    tacticalSectors: ['Atelier de Programmation Synthétique de Jeri', 'Dôme Hydroponique Tropicale Artificielle', 'Couloirs de Sécurité de Grant Corporation', 'Baie de Confinement des Sujets Vivants'],
    environmentalHazards: ['Aspersions d\'herbicides et toxines végétales', 'Grilles de ventilation étroites propices aux embuscades', 'Robots de manutention automatisés déréglés'],
    keyPreyIds: ['prey_weyland_combat_android', 'prey_xeno_drone_1979'],
    heroSquadId: 'squad_stronghold_ernst_jeri_syndicate',
    villainSquadId: 'squad_weyland_blackops_containment'
  },
  {
    id: 'map_ryushi_sand_trap_subsurface_vaults',
    name: 'Ryushi — Crypte Souterraine Millénaire & Failles Cristallines (2192)',
    originMedia: 'Aliens vs. Predator: Prey / Sand Trap (Comics Dark Horse / Roman 1994)',
    universe: 'AVP',
    releaseYear: 1994,
    biomeId: 'ryushi_desert',
    recommendedBiomeLabel: 'Cryptes des Sables de Ryushi & Failles Volcaniques',
    environmentSummary: 'Vastes cathédrales souterraines creusées sous le désert de silicate rouge de Ryushi : piliers taillés dans la roche volcanique, arches ancestrales Yautja et nids endormis.',
    tacticalSectors: ['Sanctuaire des Stèles Funéraires de Dachande', 'Chambre des Piliers de Basalte et Failles Thermiques', 'Carrière d\'Extraction Minérale Abandonnée', 'Dunes d\'Accès Extérieures au Puits de Mine'],
    environmentalHazards: ['Geysers de vapeur sulfureuse sous pression', 'Puits de sable mouvant instables', 'Plafonds de roche fissurée s\'effondrant'],
    keyPreyIds: ['alien_base_alpha_predator_kaail', 'prey_xeno_warrior'],
    heroSquadId: 'squad_ryushi_vault_archaeologists_mercs',
    villainSquadId: 'squad_ryushi_chian_am_ranchers'
  },
  {
    id: 'map_lv742_extinction_volcanic_crater',
    name: 'LV-742 — Cratère Volcanique & Nids de Ravagers Génétiques (2203)',
    originMedia: 'Aliens versus Predator: Extinction (EA / Zono 2003)',
    universe: 'AVP',
    releaseYear: 2003,
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Caldeira Volcanique de LV-742 (Extinction 2203)',
    environmentSummary: 'Champ de bataille titanesque déployé autour d\'une caldeira en éruption : coulées de lave rougeoyante, ruches de Xénomorphes Ravagers mutants et avant-postes Kadinsky.',
    tacticalSectors: ['Bordure de la Caldeira de Lave Active', 'Ruche Écarlate des Ravagers Mutants', 'Camp de Déploiement du Clan Yautja d\'Élite', 'Complexe de Recherche Génétique Kadinsky'],
    environmentalHazards: ['Lacs de magma en fusion mortels', 'Pluies de cendres volcaniques réduisant la vision', 'Éruptions sporadiques de gaz igné'],
    keyPreyIds: ['alien_base_alpha_predator_kaail', 'prey_xeno_queen_matriarch'],
    heroSquadId: 'squad_extinction_council_veterans_lv742',
    villainSquadId: 'squad_killer_clan_bad_blood_pack'
  }
,
  {
    id: 'map_amazon_dark_river_basin',
    name: 'Bassin Fluvial de l\'Amazone — Fleuve Noir & Canopée Sauvage (1996)',
    originMedia: 'Predator: Dark River (Dark Horse Comics 1996)',
    universe: 'PREDATOR',
    releaseYear: 1996,
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Bassin Fluvial de l\'Amazone (Dark River 1996)',
    environmentSummary: 'Réseau fluvial équatorial étouffant : bancs de sable, rapides tumultueux, canopée impénétrable et nids de sangsues tropicales où John Schaefer traque son frère.',
    tacticalSectors: [
      'Rapides du Fleuve Noir',
      'Canopée Supérieure Tropicale',
      'Campement Fluvial de la Guérilla',
      'Bancs de Boue Toxique des Marais'
    ],
    environmentalHazards: [
      'Rapides à contre-courant violent',
      'Bancs de boue gluante ralentissant les déplacements',
      'Brume tropicale réduisant la vision infrarouge'
    ],
    keyPreyIds: ['alien_base_royce_mercenaire_2010', 'prey_jungle_hunter_1987'],
    heroSquadId: 'squad_dark_river_amazon_patrol',
    villainSquadId: 'squad_killer_clan_bad_blood_pack'
  },
  {
    id: 'map_whitechapel_fog_alleys',
    name: 'Whitechapel 1896 — Ruelles Brumeuses & Docks de la Tamise (1896)',
    originMedia: 'Predator: Nemesis (Dark Horse Comics 1997)',
    universe: 'PREDATOR',
    releaseYear: 1997,
    biomeId: 'los_angeles_1997',
    recommendedBiomeLabel: 'Ruelles de Whitechapel sous la Brume (Nemesis 1896)',
    environmentSummary: 'Dédale urbain victorien baigné d\'une purée de pois étouffante : pavés glissants, quais de la Tamise, entrepôts frigorifiques et ponts ferroviaires de briques sombres.',
    tacticalSectors: [
      'Quais de Déchargement de la Tamise',
      'Allées Pavées Étroites de Whitechapel',
      'Entrepôt Frigorifique Abandonné',
      'Toitures d\'Ardoise et Clochetons'
    ],
    environmentalHazards: [
      'Épaisse purée de pois londonienne obstruant la visée',
      'Pavés boueux glissants déséquilibrant les courses',
      'Fuites de vapeur industrielle des conduites d\'usines'
    ],
    keyPreyIds: ['alien_base_mike_harrigan_lapd', 'prey_jungle_hunter_1987'],
    heroSquadId: 'squad_whitechapel_constabulary_guard',
    villainSquadId: 'squad_p2_cartel_king_willie_posse'
  },
  {
    id: 'map_pala_station_sublevel_4',
    name: 'Station Pala — Laboratoires Souterrains & Sous-Sol 4 (2021)',
    originMedia: 'Alien: Infiltrator (Titan Books 2021)',
    universe: 'ALIEN',
    releaseYear: 2021,
    biomeId: 'space_hulk',
    recommendedBiomeLabel: 'Laboratoires Souterrains de Pala (Infiltrator 2021)',
    environmentSummary: 'Complexe de recherche biomédicale secret de Weyland-Yutani contaminé par le mutagène noir : cuves pressurisées bréchées et couloirs de quarantaine.',
    tacticalSectors: [
      'Cuves Cryogéniques du Mutagène Noir',
      'Sas de Confinement Sous-Sol 4',
      'Laboratoire de Vivisection Dr. Hoenikker',
      'Conduits de Ventilation de Décontamination'
    ],
    environmentalHazards: [
      'Fuites d\'aérosols mutagènes provoquant des mutations rapides',
      'Chambres sous dépression d\'air automatique',
      'Fils haute tension dénudés et sols électrifiés'
    ],
    keyPreyIds: ['prey_xeno_warrior', 'prey_weyland_combat_android'],
    heroSquadId: 'squad_pala_station_security_detail',
    villainSquadId: 'squad_afe_katanga_pathogen_swarm'
  },
  {
    id: 'map_hadleys_hope_perimeter',
    name: 'Hadley\'s Hope — Périmètre Fortifié & Complexe Minier (2014)',
    originMedia: 'Alien: River of Pain (Titan Books 2014)',
    universe: 'ALIEN',
    releaseYear: 2014,
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Périmètre Fortifié de Hadley\'s Hope (River of Pain 2014)',
    environmentSummary: 'Colonie minière d\'Acheron LV-426 en état de siège : sas blindés éventrés, barricades de caisses d\'approvisionnement et nid de traitement atmosphérique.',
    tacticalSectors: [
      'Barricades des Sas d\'Accès Sub-Surface',
      'Salle de Contrôle du Processeur d\'Atmosphère',
      'Couloirs des Quartiers Résidentiels Miniers',
      'Hangar du Blindé de Transport M577'
    ],
    environmentalHazards: [
      'Tempêtes de poussière de silicate corrosif',
      'Écoulements d\'acide xénomorphe résiduel dans les grilles',
      'Vannes de surpression thermique explosives'
    ],
    keyPreyIds: ['alien_base_william_hudson_private', 'prey_xeno_warrior'],
    heroSquadId: 'squad_hadleys_hope_colonial_militia',
    villainSquadId: 'squad_charon_kleist_rogue_swarm'
  },
  {
    id: 'map_lv742_iron_bear_redoubt',
    name: 'LV-742 — Redoute Fortifiée des Iron Bears & Canyons Rocailleux (2003)',
    originMedia: 'Aliens versus Predator: Extinction (EA / Zono 2003)',
    universe: 'AVP',
    releaseYear: 2003,
    biomeId: 'desert',
    recommendedBiomeLabel: 'Redoute des Mercenaires Iron Bears (Extinction 2003)',
    environmentSummary: 'Bastion fortifié d\'artillerie lourde déployé par la compagnie mercenaire des Iron Bears au milieu des ravins arides de LV-742 et des nids K-Series.',
    tacticalSectors: [
      'Batterie de Canons Gauss Lourds Automatisés',
      'Défilé Rocailleux des Canyons Écarlates',
      'Avant-Poste de Surveillance Kadinsky',
      'Périmètre de Clôtures Laser Haute Énergie'
    ],
    environmentalHazards: [
      'Barrages d\'artillerie électromagnétique aveugles',
      'Chutes de blocs de grès instables dans les défilés',
      'Geysers de gaz soufré surchauffé'
    ],
    keyPreyIds: ['prey_colonial_marine_heavy', 'prey_xeno_warrior'],
    heroSquadId: 'squad_iron_bear_uscm_battalion',
    villainSquadId: 'squad_kseries_cloned_xeno_pack'
  },
  {
    id: 'map_ataegina_citadel_ruins',
    name: 'Ataegina — Citadelle de Lemnos & Pitons Rocheux Féodaux (2020)',
    originMedia: 'Alien: Phalanx (Titan Books 2020 / AVP Hunt)',
    universe: 'AVP',
    releaseYear: 2020,
    biomeId: 'temple',
    recommendedBiomeLabel: 'Ruines de la Citadelle d\'Ataegina (Phalanx 2020)',
    environmentSummary: 'Forteresse médiévale perchée au sommet d\'une aiguille rocheuse sur la planète Ataegina, théâtre d\'affrontements viscéraux entre phalanges humaines et démons Ahklun.',
    tacticalSectors: [
      'Parapet des Sentinelles d\'Obsidienne',
      'Chausse-Trappes et Fosses de Poix Enflammée',
      'Cavernes Inférieures des Nids d\'Ahklun',
      'Grande Cour de la Citadelle de Lemnos'
    ],
    environmentalHazards: [
      'Précipices vertigineux le long des falaises abruptes',
      'Braseros et rigoles de poix bouillante',
      'Projections de débris d\'obsidienne acérés'
    ],
    keyPreyIds: ['alien_base_royce_mercenaire_2010', 'prey_xeno_warrior'],
    heroSquadId: 'squad_ataegina_spear_phalanx',
    villainSquadId: 'squad_kseries_cloned_xeno_pack'
  },
  {
    id: 'map_pred_stern_biodome_preserve',
    name: 'Réserve Biodôme de Tyler Stern — Jungle Sous Verre & Passages Techniques (1998)',
    universe: 'PREDATOR',
    originMedia: 'Predator: Captive (Dark Horse Comics 1998)',
    sourceMedia: 'Predator: Captive (1998)',
    sourceType: 'COMIC',
    releaseYear: 1998,
    year: 1998,
    biomeId: 'jungle',
    biome: 'BIODOME_JUNGLE',
    recommendedBiomeLabel: 'Réserve Biodôme Artificielle de Tyler Stern (Captive 1998)',
    weather: 'Humidité tropicale artificielle contrôlée et averses programmées',
    lighting: 'Projecteurs zénithaux halogènes et coursives d\'observation néon',
    verticality: 'ÉLEVÉE (Canopée synthétique, passerelles d\'observation suspendues et dôme vitré)',
    destructibility: 'Vitres blindées d\'observation, tourelles tranquillisantes et pylônes climatiques',
    interactables: [
      'Consoles de déverrouillage des sas de quarantaine',
      'Générateurs de brouillard thermique du biodôme',
      'Râteliers d\'armement Yautja confisqué au laboratoire Stern'
    ],
    environmentSummary: 'Vaste biosphère privée construite par le milliardaire Tyler Stern pour maintenir un Yautja en captivité, ceinturée de galeries scientifiques blindées et de pylônes haute tension.',
    description: 'Vaste biosphère privée construite par le milliardaire Tyler Stern pour maintenir un Yautja en captivité, ceinturée de galeries scientifiques blindées et de pylônes haute tension.',
    tacticalNotes: 'Briser les verrières d\'observation permet d\'infiltrer les coursives de sécurité et de retourner les systèmes de confinement contre les gardes de Stern.',
    dimensionsM: { width: 320, length: 320, height: 65 },
    elevationRangeM: [-10, 55],
    tacticalSectors: [
      'Cœur de la Jungle Synthétique sous Dôme',
      'Passerelles d\'Observation Panoramiques de Tyler Stern',
      'Laboratoire d\'Analyse Xenobiologique & Armurerie',
      'Pylônes de Clôture Électro-Magnétique Périmétrique'
    ],
    keyLandmarks: [
      'Dôme géodésique central en polymère blindé',
      'Poste de commandement panoramique de Tyler Stern',
      'Cascade artificielle et bassin de drainage souterrain'
    ],
    environmentalHazards: [
      'Arcs électriques des clôtures de confinement haute tension',
      'Gaz tranquillisant diffusé par les buses d\'urgence',
      'Projecteurs de poursuite aveuglant la vision thermique'
    ],
    signatureHazards: [
      'Purge neuro-sédative des secteurs d\'observation',
      'Décharges des barrières laser périmétriques'
    ],
    ambientProfile: 'Bourdonnement des générateurs climatiques, cris d\'oiseaux tropicaux enregistrés et sirènes d\'alerte de brèche',
    keyPreyIds: ['alien_base_royce_mercenaire_2010', 'prey_jungle_hunter_1987'],
    heroSquadId: 'squad_pred_captive_preserve_guards',
    villainSquadId: 'squad_bad_blood_renegade_pack'
  },
  {
    id: 'map_pred_yellowstone_geysers_1999',
    name: 'Yellowstone — Bassin Géothermique & Geysers de Soufre (1999)',
    universe: 'PREDATOR',
    originMedia: 'Predator: Homeworld (Dark Horse Comics 1999)',
    sourceMedia: 'Predator: Homeworld (1999)',
    sourceType: 'COMIC',
    releaseYear: 1999,
    year: 1999,
    biomeId: 'jungle',
    biome: 'GEOTHERMAL_FOREST',
    recommendedBiomeLabel: 'Bassin des Geysers de Yellowstone (Homeworld 1999)',
    weather: 'Vapeurs soufrées épaisses, vent froid des Rocheuses et bruine acide',
    lighting: 'Crépuscule montagneux filtré par les colonnes de vapeur géothermique',
    verticality: 'MOYENNE (Crêtes rocheuses, pins Douglas centenaires et passerelles de bois)',
    destructibility: 'Passerelles touristiques en bois, croûtes minérales fragiles et cabanes de rangers',
    interactables: [
      'Poste radio d\'urgence des Rangers du Parc National',
      'Vannes de dérivation géothermique',
      'Caches d\'équipement de survie forestier'
    ],
    environmentSummary: 'Territoire volcanique actif du parc national de Yellowstone où les panaches de vapeur bouillante masquent les signatures infrarouges lors de la traque des trois Bad Bloods par l\'Ancien.',
    description: 'Territoire volcanique actif du parc national de Yellowstone où les panaches de vapeur bouillante masquent les signatures infrarouges lors de la traque des trois Bad Bloods par l\'Ancien.',
    tacticalNotes: 'Les colonnes de vapeur à 95°C saturent le spectre thermique du biomasque, forçant l\'usage de la traque acoustique et des embuscades en hauteur.',
    dimensionsM: { width: 480, length: 440, height: 80 },
    elevationRangeM: [0, 80],
    tacticalSectors: [
      'Grand Bassin Pratique des Geysers Bouillonnants',
      'Forêt de Conifères & Crêtes d\'Observation des Rangers',
      'Passerelles de Bois au-dessus des Sources Acides',
      'Campement Isolé & Station Météo Géologique'
    ],
    keyLandmarks: [
      'Cratère du Geyser Principal en éruption cyclique',
      'Tour de guet incendie des Rangers de Yellowstone',
      'Pont suspendu au-dessus du canyon soufré'
    ],
    environmentalHazards: [
      'Éruptions soudaines de geysers d\'eau bouillante à haute pression',
      'Brouillard géothermique aveuglant la vision infrarouge',
      'Bassins d\'acide sulfurique naturel sous la croûte minérale'
    ],
    signatureHazards: [
      'Geysers explosifs à cycle thermique',
      'Poches de gaz sulfureux toxique'
    ],
    ambientProfile: 'Grondement sourd de la chambre magmatique, sifflements des fumerolles et vent dans les pins',
    keyPreyIds: ['alien_base_dutch_2025_owlf', 'alien_base_alpha_predator_kaail'],
    heroSquadId: 'squad_pred_yellowstone_rangers',
    villainSquadId: 'squad_bad_blood_renegade_pack'
  },
  {
    id: 'map_alien_charon_kleist_citadel',
    name: 'Astéroïde Charon — Citadelle Génétique du Professeur Kleist (1993)',
    universe: 'ALIEN',
    originMedia: 'Aliens: Rogue (Dark Horse Comics 1993)',
    sourceMedia: 'Aliens: Rogue (1993)',
    sourceType: 'COMIC',
    releaseYear: 1993,
    year: 1993,
    biomeId: 'stargazer_blacksite',
    biome: 'ASTEROID_BIO_CITADEL',
    recommendedBiomeLabel: 'Citadelle Biologique de Charon (Aliens: Rogue 1993)',
    weather: 'Atmosphère confinée sous dôme d\'astéroïde avec fuites cryogéniques',
    lighting: 'Éclairage chirurgical blafard et gyrophares d\'alerte rouge sang',
    verticality: 'ÉLEVÉE (Silos d\'incubation géants, passerelles de confinement et puits de ventilation)',
    destructibility: 'Cuves de clonage en verre renforcé, cloisons de quarantaine et générateurs de champ de force',
    interactables: [
      'Commandes du sas de l\'arène du King Alien',
      'Terminaux génétiques du Professeur Ernst Kleist',
      'Tourelles de défense interne des casernes USCM'
    ],
    environmentSummary: 'Complexe militaro-scientifique creusé dans l\'astéroïde Charon où le généticien Ernst Kleist a élevé le titanesque King Alien face à une ruche captive.',
    description: 'Complexe militaro-scientifique creusé dans l\'astéroïde Charon où le généticien Ernst Kleist a élevé le titanesque King Alien face à une ruche captive.',
    tacticalNotes: 'Les coursives étroites des laboratoires débouchent sur l\'immense fosse de contention du Roi Xénomorphe ; utiliser les grilles supérieures pour éviter les charges.',
    dimensionsM: { width: 360, length: 400, height: 70 },
    elevationRangeM: [-35, 35],
    tacticalSectors: [
      'Grande Fosse de Contention du Spécimen King Alien',
      'Laboratoires de Génétique Hybride du Professeur Kleist',
      'Casernes Fortifiées de la Garnison Coloniale de Charon',
      'Nid de la Reine Captive & Conduits Thermiques'
    ],
    keyLandmarks: [
      'Cuve blindée centrale brisée du King Alien',
      'Observatoire blindé du Professeur Kleist',
      'Rampe d\'amarrage des navettes orbitales'
    ],
    environmentalHazards: [
      'Brèches de confinement libérant des vapeurs d\'azote liquide',
      'Mares d\'acide moléculaire issues des combats entre castes xénos',
      'Barrières électrostatiques haute tension dans les couloirs'
    ],
    signatureHazards: [
      'Effondrement structurel causé par les charges du King Alien',
      'Purge chimique neurotoxique des laboratoires'
    ],
    ambientProfile: 'Hurlements graves du King Alien résonnant dans la roche, alarmes de confinement et crépitements électriques',
    keyPreyIds: ['alien_base_william_hudson_private', 'prey_xeno_warrior'],
    heroSquadId: 'squad_alien_charon_rogue_marines',
    villainSquadId: 'squad_charon_kleist_rogue_swarm'
  },
  {
    id: 'map_alien_bellerophon_caves',
    name: 'Bellerophon — Cavernes Bioluminescentes & Ruche de Moisson (2019)',
    universe: 'ALIEN',
    originMedia: 'Alien: Echo / Aliens: Hive (Roman 2019 & Comics 1992)',
    sourceMedia: 'Alien: Echo (2019)',
    sourceType: 'NOVEL',
    releaseYear: 2019,
    year: 2019,
    biomeId: 'hive_lv426',
    biome: 'BIOLUMINESCENT_CAVERNS',
    recommendedBiomeLabel: 'Cavernes Bioluminescentes de Bellerophon (Echo 2019)',
    weather: 'Brume souterraine chargée de spores lumineuses et ruissellements acides',
    lighting: 'Lueur bleue-verte organique des champignons cavernicoles et résine xénomorphe',
    verticality: 'ÉLEVÉE (Stalactites géantes, ponts de pierre naturels et gouffres inondés)',
    destructibility: 'Colonnes de calcaire friable, cocons de résine et nids de cyber-fourmis moissonneuses',
    interactables: [
      'Balises sismiques de terraformation de la famille Shipp',
      'Collecteurs automatisés de Gelée Royale de Mayakovsky',
      'Ponts-levis de secours des stations de pompage'
    ],
    environmentSummary: 'Réseau karstique abyssal sous la colonie de Bellerophon, mêlant flore bioluminescente indigène, sécrétions de ruche xénomorphe et essaims de cyber-fourmis de récolte.',
    description: 'Réseau karstique abyssal sous la colonie de Bellerophon, mêlant flore bioluminescente indigène, sécrétions de ruche xénomorphe et essaims de cyber-fourmis de récolte.',
    tacticalNotes: 'L\'acoustique des cavernes amplifie le moindre bruit de pas ; privilégier les corniches calcaires en hauteur et surveiller les bassins souterrains.',
    dimensionsM: { width: 420, length: 450, height: 90 },
    elevationRangeM: [-60, 30],
    tacticalSectors: [
      'Cathédrale des Stalactites Bioluminescentes',
      'Chambre d\'Extraction de Gelée Royale & Cyber-Fourmilière',
      'Rivière Souterraine & Gouffre des Échos',
      'Avant-Poste Xéno-Biologique Englouti de Bellerophon'
    ],
    keyLandmarks: [
      'Arche de cristal bioluminescent surplombant l\'abîme',
      'Silo moissonneur cybernétique de Mayakovsky',
      'Laboratoire de terrain barricadé d\'Olivia Shipp'
    ],
    environmentalHazards: [
      'Chutes de stalactites provoquées par les détonations',
      'Spores cavernicoles brouillant les capteurs optiques',
      'Bassins d\'eau noire dissimulant des Facehuggers amphibies'
    ],
    signatureHazards: [
      'Essaims de micro-drones coupeurs au laser',
      'Éboulements karstiques par résonance acoustique'
    ],
    ambientProfile: 'Gouttes d\'eau réverbérées à l\'infini, cliquetis métalliques des cyber-fourmis et sifflements xénomorphes dans l\'ombre',
    keyPreyIds: ['prey_weyland_combat_android', 'prey_xeno_warrior'],
    heroSquadId: 'squad_alien_harvest_cyber_ants',
    villainSquadId: 'squad_genocide_grant_xeno_zip_2190'
  },
  {
    id: 'map_avp_tokyo_eternal_penthouse',
    name: 'Tokyo 1998 — Penthouse Cybernétique de Gideon Lee & Soute Yautja (1998)',
    universe: 'AVP',
    originMedia: 'Aliens vs. Predator: Eternal (Dark Horse Comics 1998)',
    sourceMedia: 'AVP: Eternal (1998)',
    sourceType: 'COMIC',
    releaseYear: 1998,
    year: 1998,
    biomeId: 'los_angeles_1997',
    biome: 'CYBER_METROPOLIS_TOWER',
    recommendedBiomeLabel: 'Gratte-Ciel de Gideon Lee à Tokyo (AVP: Eternal 1998)',
    weather: 'Pluie battante nocturne sur Tokyo et bourrasques de haute altitude',
    lighting: 'Hologrammes publicitaires géants, néons cybernétiques et jardin zen éclairé aux lanternes',
    verticality: 'EXTRÊME (Héliport du toit, atrium vitré sur 80 étages et chambre forte de l\'épave de 1300)',
    destructibility: 'Parois de papier shoji blindé, baies vitrées panoramiques et vitrines de reliques Yautja',
    interactables: [
      'Ascenseur express menant à la chambre forte du vaisseau de 1300',
      'Système de défense laser rétro-conçu de la corporation Lee/Suwa',
      'Cuves de stase cryogénique contenant les œufs Xénomorphes'
    ],
    environmentSummary: 'Sommet du gratte-ciel ultra-sécurisé de l\'immortel Gideon Lee à Tokyo, reliant un penthouse traditionnel japonais aux laboratoires secrets abritant une épave Yautja du XIVe siècle.',
    description: 'Sommet du gratte-ciel ultra-sécurisé de l\'immortel Gideon Lee à Tokyo, reliant un penthouse traditionnel japonais aux laboratoires secrets abritant une épave Yautja du XIVe siècle.',
    tacticalNotes: 'Utiliser les poutrelles de l\'atrium et l\'héliport extérieur sous la pluie pour contourner les tirs de fusils à plasma rétro-conçus des mercenaires.',
    dimensionsM: { width: 280, length: 300, height: 120 },
    elevationRangeM: [200, 320],
    tacticalSectors: [
      'Penthouse Impérial & Jardin Zen sur le Toit de Tokyo',
      'Atrium Panoramique & Passerelles de Verre Suspendues',
      'Hangar Souterrain de l\'Épave Yautja de l\'An 1300',
      'Laboratoire de Longévité & Armurerie Rétro-Conçue'
    ],
    keyLandmarks: [
      'Carcasse fossilisée du vaisseau Yautja du XIVe siècle',
      'Héliport corporatiste surplombant la baie de Tokyo',
      'Salle des trophées samouraïs de Gideon Lee'
    ],
    environmentalHazards: [
      'Rafales de vent violent sur les corniches extérieures du gratte-ciel',
      'Grilles de sécurité laser à faisceau plasma rétro-conçu',
      'Surcharge du réacteur antique de l\'épave Yautja'
    ],
    signatureHazards: [
      'Tourelles automatiques à plasma inversé',
      'Décompression et chute libre depuis les baies vitrées brisées'
    ],
    ambientProfile: 'Tonnerre urbain sur Tokyo, sirènes de police lointaines et bourdonnement des générateurs plasma piratés',
    keyPreyIds: ['prey_weyland_combat_android', 'prey_jungle_hunter_1987'],
    heroSquadId: 'squad_avp_eternal_tokyo_mercs',
    villainSquadId: 'squad_avp_eternal_suwa_syndicate_1998'
  },
  {
    id: 'map_avp_perses_fire_stone_hull',
    name: 'Vaisseau Perses — Coque Mutée d\'Elden & Coursives en Ruine (2014)',
    universe: 'AVP',
    originMedia: 'Aliens vs. Predator: Fire and Stone (Dark Horse Comics 2014)',
    sourceMedia: 'AVP: Fire and Stone (2014)',
    sourceType: 'COMIC',
    releaseYear: 2014,
    year: 2014,
    biomeId: 'genna_deathworld',
    biome: 'MUTATED_STARSHIP_HULL',
    recommendedBiomeLabel: 'Coque Mutée du Vaisseau Perses (Fire and Stone 2014)',
    weather: 'Vide spatial orbital et poches de gaz mutagène noir pressurisé',
    lighting: 'Éclairage de secours stroboscopique et bioluminescence organique noire',
    verticality: 'ÉLEVÉE (Puits de gravité artificielle, salles des machines sur trois ponts et coque externe)',
    destructibility: 'Conduites de refroidissement, parois biomécaniques corrompues et sas d\'évacuation',
    interactables: [
      'Panneaux de contrôle de gravité artificielle du Perses',
      'Sas d\'éjection vers les nacelles de sauvetage',
      'Armurerie de sécurité de l\'équipage du capitaine Foster'
    ],
    environmentSummary: 'Intérieur dévasté du vaisseau d\'exploration Perses en orbite autour de LV-223, envahi par la biomasse du pathogène noir A0-3959X sous le contrôle du synthétique muté Elden et traqué par l\'Elder Ahab.',
    description: 'Intérieur dévasté du vaisseau d\'exploration Perses en orbite autour de LV-223, envahi par la biomasse du pathogène noir A0-3959X sous le contrôle du synthétique muté Elden et traqué par l\'Elder Ahab.',
    tacticalNotes: 'La corruption organique du mutagène noir altère la géométrie des coursives ; exploiter les conduits techniques pour tendre des embuscades entre les Xénomorphes d\'Elden et la sécurité du bord.',
    dimensionsM: { width: 340, length: 460, height: 60 },
    elevationRangeM: [-30, 30],
    tacticalSectors: [
      'Passerelle de Commandement Corrompue par le Mutagène Noir',
      'Salle du Réacteur Orbital & Sanctuaire d\'Elden',
      'Quartiers de Sécurité du Perses & Armurerie de Galgo',
      'Baie des Nacelles de Sauvetage & Brèche de Coque'
    ],
    keyLandmarks: [
      'Trône biomécanique du synthétique muté Elden',
      'Brèche d\'abordage du chasseur Elder Ahab',
      'Cœur de propulsion ionique du vaisseau Perses'
    ],
    environmentalHazards: [
      'Suintements de pathogène noir A0-3959X hautement mutagène',
      'Fluctuations de gravité artificielle dans les coursives endommagées',
      'Jet de plasma des conduites de propulsion éventrées'
    ],
    signatureHazards: [
      'Projections d\'acide et de fluide mutagène noir',
      'Dépressurisation brutale des compartiments de coque'
    ],
    ambientProfile: 'Grincements métalliques de la coque sous contrainte, pulsations organiques du mutagène et tirs de fléchettes dans les coursives',
    keyPreyIds: ['prey_ahab_elder_persée', 'prey_xeno_warrior'],
    heroSquadId: 'squad_avp_perses_fire_stone_crew',
    villainSquadId: 'squad_fire_and_stone_perses_crew_2014'
  },
  {
    id: 'map_pred_corpse_creek_desert',
    name: 'Corpse Creek — Désert Aride & Canyons du Nouveau-Mexique (1991)',
    universe: 'PREDATOR',
    originMedia: 'Predator: Big Game (Dark Horse Comics 1991)',
    sourceMedia: 'Predator: Big Game (1991)',
    sourceType: 'COMIC',
    releaseYear: 1991,
    year: 1991,
    biomeId: 'desert',
    biome: 'ARID_CANYON_DESERT',
    recommendedBiomeLabel: 'Désert de Corpse Creek & Canyons du Nouveau-Mexique (Big Game 1991)',
    weather: 'Chaleur accablante, vents de sable desséchants et mirages thermiques',
    lighting: 'Soleil zénithal aveuglant et ombres nettes des failles rocheuses',
    verticality: 'ÉLEVÉE (Parois rocheuses abruptes, promontoires de grès et lits de rivières asséchés)',
    destructibility: 'Arbustes rabougris, blocs de grès instables et débris de campement militaire',
    interactables: [
      'Épave du transporteur militaire calciné',
      'Points d\'eau saumâtre sous surplomb rocheux',
      'Générateur de secours de la base radar'
    ],
    environmentSummary: 'Canyons arides et failles érodées de Corpse Creek au Nouveau-Mexique, théâtre de la confrontation caniculaire entre Enoch Nakai et un chasseur Yautja.',
    description: 'Canyons arides et failles érodées de Corpse Creek au Nouveau-Mexique, théâtre de la confrontation caniculaire entre Enoch Nakai et un chasseur Yautja.',
    tacticalNotes: 'La chaleur ambiante perturbe les capteurs infrarouges ordinaires ; exploiter les parois verticales pour bondir en embuscade depuis les hauteurs.',
    dimensionsM: { width: 450, length: 500, height: 85 },
    elevationRangeM: [-15, 70],
    tacticalSectors: [
      'Faille de Corpse Creek & Ravin Asséché',
      'Périmètre de la Base Radar Fortifiée',
      'Plateau Rocheux des Aigles Navajos',
      'Grotte d\'Embuscade d\'Enoch Nakai'
    ],
    keyLandmarks: [
      'Plateau sommital des vigies Navajos',
      'Carcasse métallique du camion radar militaire',
      'Gorge étroite de Corpse Creek'
    ],
    environmentalHazards: [
      'Tempête de poussière réduisant la portée visuelle',
      'Éboulis de roche friable sous le poids des combattants',
      'Rayonnement thermique caniculaire saturant la vision infra-rouge'
    ],
    signatureHazards: [
      'Chaleur accablante perturbant la furtivité thermique',
      'Poussière abrasive pour les optiques'
    ],
    ambientProfile: 'Hurlement sourd du vent du désert, craquements de la roche chauffée à blanc et cris lointains de rapaces',
    keyPreyIds: ['alien_base_billy_sole_tracker', 'prey_jungle_hunter_1987'],
    heroSquadId: 'squad_pred_nakai_corpse_creek_scouts',
    villainSquadId: null
  },
  {
    id: 'map_pred_guinea_coast_1718',
    name: 'Côte de Guinée — Baie des Pirates & Canopée Équatoriale (1718)',
    universe: 'PREDATOR',
    originMedia: 'Predator: 1718 (Dark Horse Comics 1996)',
    sourceMedia: 'Predator: 1718 (1996)',
    sourceType: 'COMIC',
    releaseYear: 1996,
    year: 1718,
    biomeId: 'jungle',
    biome: 'TROPICAL_COAST_JUNGLE',
    recommendedBiomeLabel: 'Côte Tropicale de Guinée & Rade Flibustière (1718)',
    weather: 'Brume marine chaude, ressac violent et moiteur équatoriale',
    lighting: 'Crépuscule doré perçant la canopée et reflets des feux de camp sur le sable',
    verticality: 'MOYENNE (Falaises côtières, mâtures de navires échoués et palétuviers enchevêtrés)',
    destructibility: 'Canots d\'embarquement de flibuste, tonneaux de poudre noire et pontons de bois vermoulu',
    interactables: [
      'Barils de poudre noire explosifs des corsaires',
      'Épave du brick flibustier échoué',
      'Sentiers d\'embuscade à travers la mangrove'
    ],
    environmentSummary: 'Rivage tropical de Guinée en 1718 où le capitaine corsaire Raphael Adolini et Golden Angel combattirent dos à dos contre les mutins.',
    description: 'Rivage tropical de Guinée en 1718 où le capitaine corsaire Raphael Adolini et Golden Angel combattirent dos à dos contre les mutins.',
    tacticalNotes: 'La poudre noire et le sable humide imposent des duels rapprochés ; privilégier la mobilité dans les branches de palétuviers pour surprendre les pirates.',
    dimensionsM: { width: 400, length: 420, height: 45 },
    elevationRangeM: [-5, 40],
    tacticalSectors: [
      'Plage des Chaloupes & Débarcadère Corsaire',
      'Campement de la Mutinerie sous les Palmiers',
      'Falaises Calcaires de Guinée',
      'Mangrove Épaisse & Palétuviers Gémissants'
    ],
    keyLandmarks: [
      'Carcasse éventrée du brick pirate',
      'Autel de pierre sous le banian centenaire',
      'Feu de signalisation sur la pointe rocheuse'
    ],
    environmentalHazards: [
      'Explosions spontanées de barils de poudre noire',
      'Sables mouvants côtiers bordant la mangrove',
      'Marée montante isolant les promontoires rocheux'
    ],
    signatureHazards: [
      'Détonations de poudre noire inflammable',
      'Moiteur tropicale saturant les lentilles'
    ],
    ambientProfile: 'Ressac régulier de l\'océan Atlantique, chants de marins avinés et détonations lointaines de mousquets',
    keyPreyIds: ['alien_base_big_beard_voyageur_1719', 'prey_feral_predator_1719'],
    heroSquadId: 'squad_pred_adolini_guinea_pirates',
    villainSquadId: null
  },
  {
    id: 'map_alien_renaissance_romulus_module',
    name: 'Station Renaissance — Modules Romulus & Remus en Ruine (2024)',
    universe: 'ALIEN',
    originMedia: 'Alien: Romulus (20th Century Studios 2024)',
    sourceMedia: 'Alien: Romulus (2024)',
    sourceType: 'FILM',
    releaseYear: 2024,
    year: 2024,
    biomeId: 'space_hulk',
    biome: 'ABANDONED_ORBITAL_STATION',
    recommendedBiomeLabel: 'Complexe Spatial Renaissance — Romulus / Remus (2024)',
    weather: 'Gravité zéro intermittente, froid du vide spatial et vapeur cryogénique toxique',
    lighting: 'Éclairage d\'urgence pourpre et rouge de décompression, reflets sur l\'acide',
    verticality: 'TRÈS ÉLEVÉE (Puits de décompression verticaux, sas orbitaux et conduites à micro-gravité)',
    destructibility: 'Portes de sécurité Weyland pressurisées, conduites de liquide cryogénique et baies vitrées d\'observation',
    interactables: [
      'Terminaux MU/TH/UR du synthétique Rook',
      'Purgeurs de cryogénie libérant des brumes gelées',
      'Sas de gravité artificielle inversable'
    ],
    environmentSummary: 'Complexe de recherche orbital Weyland-Yutani en déshérence dérivant vers les anneaux de Jackson, infesté de Facehuggers cryogénisés et surveillé par Rook.',
    description: 'Complexe de recherche orbital Weyland-Yutani en déshérence dérivant vers les anneaux de Jackson, infesté de Facehuggers cryogénisés et surveillé par Rook.',
    tacticalNotes: 'Les couloirs étroits et les puits à zéro gravité obligent à anticiper les trajectoires de bond ; l\'acide ronge les passerelles métalliques.',
    dimensionsM: { width: 360, length: 520, height: 90 },
    elevationRangeM: [-40, 50],
    tacticalSectors: [
      'Laboratoire de Cryogénie des Spécimens Z-01',
      'Baie des Navettes d\'Amarrage du Corbelan',
      'Conduit d\'Évacuation des Purges Romulus',
      'Module Remus & Sanctuaire de Rook'
    ],
    keyLandmarks: [
      'Caisson mère d\'extraction du liquide noir Z-01',
      'Terminal scientifique de l\'officier Rook',
      'Sas de largage du puits de gravité zéro'
    ],
    environmentalHazards: [
      'Poches de dépressurisation explosive vers le vide',
      'Flaques d\'acide xénomorphe perçant les ponts inférieurs',
      'Jets de liquide cryo-réfrigérant à zéro absolu'
    ],
    signatureHazards: [
      'Rupture barométrique de coque orbitale',
      'Nuages d\'acide suspendus en micro-gravité'
    ],
    ambientProfile: 'Klaxons de décompression étouffés, échos de sifflements de vapeur pressurisée et couinements de facehuggers',
    keyPreyIds: ['alien_base_rain_carradine_romulus_rebel', 'prey_xeno_drone_1979'],
    heroSquadId: 'squad_alien_renaissance_salvagers',
    villainSquadId: null
  },
  {
    id: 'map_alien_hiveworld_red_grounds',
    name: 'Monde Natal Xénomorphe — Terres de Conflit des Ruches Rouges (1991)',
    universe: 'ALIEN',
    originMedia: 'Aliens: Genocide (Dark Horse Comics 1991)',
    sourceMedia: 'Aliens: Genocide (1991)',
    sourceType: 'COMIC',
    releaseYear: 1991,
    year: 1991,
    biomeId: 'hive_lv426',
    biome: 'XENO_HIVEWORLD_BIOME',
    recommendedBiomeLabel: 'Monde Natal Xénomorphe — Terres Écarlates (Genocide 1991)',
    weather: 'Atmosphère soufrée corrosive, pluies d\'acide chaud et tempêtes d\'exuvies',
    lighting: 'Lueur écarlate volcanique, vapeurs biochimiques fluorescentes et ombre des cathédrales de résine',
    verticality: 'EXTRÊME (Piliers biomécaniques de résine de 100m, galeries souterraines et gouffres de ponte)',
    destructibility: 'Murs de résine vivante suintante, cocons régénérants et piliers stalagmitiques d\'os',
    interactables: [
      'Puits d\'extraction de Gelée Royale pure',
      'Poches d\'œufs écarlates de la Reine Mère',
      'Geysers de vapeur soufrée à forte poussée'
    ],
    environmentSummary: 'Les plaines biomécaniques cyclopéennes du monde natal Xénomorphe où s\'affrontent des millions de guerriers des ruches noire et rouge.',
    description: 'Les plaines biomécaniques cyclopéennes du monde natal Xénomorphe où s\'affrontent des millions de guerriers des ruches noire et rouge.',
    tacticalNotes: 'La densité des proies xénomorphes est critique ; maintenir les distances d\'engagement sur les corniches surélevées pour éviter d\'être submergé.',
    dimensionsM: { width: 600, length: 600, height: 120 },
    elevationRangeM: [-60, 60],
    tacticalSectors: [
      'Frontière de Sang entre Ruches Noire et Rouge',
      'Sanctuaire de la Reine Mère Écarlate',
      'Gouffre de ponte des Drones Guerriers',
      'Champs de Résine Fossilisée d\'Extraction Xeno-Zip'
    ],
    keyLandmarks: [
      'Monolithe de résine de la Reine Mère',
      'Fosse bouillonnante de gelée royale pure',
      'Crête osseuse des batailles génocidaires'
    ],
    environmentalHazards: [
      'Chutes de stalactites d\'os et de résine acide',
      'Geysers d\'acide tellurique hautement corrosif',
      'Nuées aveuglantes d\'exuvies xénomorphes en combustion'
    ],
    signatureHazards: [
      'Brumes d\'acide pur rongeant le métal en secondes',
      'Pulsations bio-acoustiques désorientantes de la ruche'
    ],
    ambientProfile: 'Claquements incessants de mandibules chitineuses, stridulations de millions de xénomorphes et grondement tellurique',
    keyPreyIds: ['prey_xeno_warrior', 'prey_praetorian_obsidian_armored'],
    heroSquadId: 'squad_alien_genocide_red_drones',
    villainSquadId: null
  },
  {
    id: 'map_avp_caparis_killer_ruins',
    name: 'Caparis VII — Ruines Médiévales & Terres du Clan Tueur (2010)',
    universe: 'AVP',
    originMedia: 'Aliens vs. Predator: Three World War (Dark Horse Comics 2010)',
    sourceMedia: 'AVP: Three World War (2010)',
    sourceType: 'COMIC',
    releaseYear: 2010,
    year: 2010,
    biomeId: 'genna_deathworld',
    biome: 'FORTIFIED_ALIEN_RUINS',
    recommendedBiomeLabel: 'Ruines de Caparis VII — Fief du Clan Tueur (Three World War 2010)',
    weather: 'Orages magnétiques sombres, pluies de suie et éclairs continus',
    lighting: 'Éclairs violets déchirant le ciel, torches primitives et lueurs de canons à plasma',
    verticality: 'ÉLEVÉE (Donjons extraterrestres fortifiés, remparts de pierre noire et fosses aux bêtes)',
    destructibility: 'Créneaux de défense en pierre sombre, cages métalliques de xénomorphes et ponts-levis suspendus',
    interactables: [
      'Charnières des chenils de xénomorphes captifs',
      'Tourelles de surveillance plasma modifiées du Killer Clan',
      'Catapultes de carcasses d\'animaux acides'
    ],
    environmentSummary: 'La forteresse antique de Caparis VII où les renégats du Killer Clan dressent des xénomorphes à défenses et affrontent l\'alliance de Machiko.',
    description: 'La forteresse antique de Caparis VII où les renégats du Killer Clan dressent des xénomorphes à défenses et affrontent l\'alliance de Machiko.',
    tacticalNotes: 'Les chiens de guerre xénomorphes attaquent en meute coordonnée par des sifflets Yautja ; éliminer les dresseurs du Killer Clan en priorité.',
    dimensionsM: { width: 480, length: 500, height: 75 },
    elevationRangeM: [-20, 55],
    tacticalSectors: [
      'Cour d\'Entraînement des Chiens Xénomorphes',
      'Donjon de Commandement du Seigneur Bad Blood',
      'Fosses aux Bêtes & Chenils Barbelés',
      'Remparts Extérieurs de Caparis'
    ],
    keyLandmarks: [
      'Trône d\'ossements du chef du Clan Tueur',
      'Enclos d\'asservissement des xénomorphes à défenses',
      'Brèche d\'artillerie des Colonial Marines'
    ],
    environmentalHazards: [
      'Arcs de plasma résiduels des armes de siège',
      'Pièges de chaînes barbelées électrifiées',
      'Fosses de purin acide sous les remparts'
    ],
    signatureHazards: [
      'Tirs de suppression plasma à cadence lourde',
      'Charges coordonnées de xénomorphes à défenses'
    ],
    ambientProfile: 'Grognements sourds de molosses extraterrestres, claquements de fouets épineux et fracas d\'artillerie plasma',
    keyPreyIds: ['prey_bad_blood_warlord', 'prey_broken_tusk_dachande'],
    heroSquadId: 'squad_avp_killer_clan_wardogs',
    villainSquadId: null
  },
  {
    id: 'map_avp_ryushi_chigusa_ranch',
    name: 'Ryushi — Ranch Chigusa & Plaines à Rhynths (1990)',
    universe: 'AVP',
    originMedia: 'Aliens vs. Predator (Dark Horse Comics 1990)',
    sourceMedia: 'Aliens vs. Predator (1990)',
    sourceType: 'COMIC',
    releaseYear: 1990,
    year: 1990,
    biomeId: 'ryushi_desert',
    biome: 'ARID_RANCH_SAVANNAH',
    recommendedBiomeLabel: 'Ranch d\'Élevage Chigusa sur Ryushi (AVP 1990)',
    weather: 'Soleils jumeaux cuisants, bourrasques de poussière orange et nuits glaciales',
    lighting: 'Éclat aveuglant des deux soleils sur le sol ocre et longues ombres des enclos',
    verticality: 'FAIBLE À MOYENNE (Silos de stockage de grain, enclos métalliques à bétail et toits des habitats colons)',
    destructibility: 'Palissades d\'enclos de Rhynths, hangars agricoles en tôle pressée et véhicules tout-terrain',
    interactables: [
      'Sas d\'ouverture des enclos de Rhynths géants',
      'Générateurs solaires de la station Chigusa',
      'Balises de détresse de Machiko Noguchi'
    ],
    environmentSummary: 'La colonie pastorale isolée de la Chigusa Corporation sur la planète Ryushi, arène initiale de la saga AVP entre Broken Tusk et les xénomorphes.',
    description: 'La colonie pastorale isolée de la Chigusa Corporation sur la planète Ryushi, arène initiale de la saga AVP entre Broken Tusk et les xénomorphes.',
    tacticalNotes: 'Les vastes plaines découvrent les tireurs ; provoquer la panique des troupeaux de Rhynths pour créer des diversions colossales contre les proies.',
    dimensionsM: { width: 550, length: 550, height: 40 },
    elevationRangeM: [-5, 35],
    tacticalSectors: [
      'Enclos Principaux des Troupeaux de Rhynths',
      'Complexe d\'Administration de Machiko Noguchi',
      'Ateliers de Maintenance Agricole & Hangars',
      'Périmètre Extérieur des Terres Arides de Ryushi'
    ],
    keyLandmarks: [
      'Grand Silo Central de la Corporation Chigusa',
      'Carcasse calcinée du transporteur d\'initiation Yautja',
      'Enceinte fortifiée du bétail hexapode'
    ],
    environmentalHazards: [
      'Panique destructrice de troupeaux de Rhynths de 15 tonnes',
      'Tempêtes de poussière ocre abrasives',
      'Chutes de température brutales à la tombée de la nuit'
    ],
    signatureHazards: [
      'Piétinement par les bêtes titanesques en déroute',
      'Incendies de poussière agricole sous tir plasma'
    ],
    ambientProfile: 'Mugissements gutturaux des Rhynths géants, bourdonnement des clôtures électrifiées et sifflement du vent chaud',
    keyPreyIds: ['prey_broken_tusk_dachande', 'prey_rhynth_ryushi'],
    heroSquadId: 'squad_avp_ryushi_chigusa_settlers',
    villainSquadId: null
  },
  {
    id: 'map_pred_spratly_volcanic_island',
    name: 'Îles Spratleys — Atoll Volcanique & Repaire Pirate (2008)',
    universe: 'PREDATOR',
    originMedia: 'Predator: South China Sea (Dark Horse / Titan Books 2008)',
    sourceMedia: 'Predator: South China Sea (2008)',
    sourceType: 'NOVEL',
    releaseYear: 2008,
    year: 2008,
    biomeId: 'jungle',
    biome: 'jungle',
    recommendedBiomeLabel: 'Atoll Volcanique des Spratleys (Predator: South China Sea 2008)',
    weather: 'Pluie de mousson tropicale torrentielle, vapeurs sulfureuses et brume maritime dense',
    lighting: 'Lueur incandescente des coulées de lave rougeoyantes perçant la canopée nocturne détrempée',
    verticality: 'FORTE (Pics basaltiques escarpés, ponts suspendus de corde au-dessus de la caldeira et plateformes arboricoles)',
    destructibility: 'Baraquements en bois des pirates, réservoirs de carburant de vedettes et pontons côtiers fragiles',
    interactables: [
      'Système de mise à feu de la vedette côtière',
      'Cages métalliques de fauves de contrebande',
      'Balise radio de fortune de John Schaefer'
    ],
    environmentSummary: 'Un atoll volcanique isolé en mer de Chine méridionale, servant de base clandestine à des pirates lourdement armés et devenu le terrain de chasse féroce d’un Yautja impitoyable.',
    description: 'Un atoll volcanique isolé en mer de Chine méridionale, servant de base clandestine à des pirates lourdement armés et devenu le terrain de chasse féroce d’un Yautja impitoyable.',
    tacticalNotes: 'Les fumerolles sulfureuses brouillent les capteurs thermiques ; exploiter les ponts suspendus pour rabattre les pirates vers les ravins de lave.',
    dimensionsM: { width: 500, length: 500, height: 60 },
    elevationRangeM: [0, 55],
    tacticalSectors: [
      'Crique d’Arrimage des Vedettes Rapides',
      'Campement Central des Pirates du Pacifique',
      'Pentes Basaltiques & Fumerolles de la Caldeira',
      'Gorge Tropicale du Tigre Évadé'
    ],
    keyLandmarks: [
      'Épave rouillée du cargo échoué sur le récif',
      'Cratère actif crachant des geysers de soufre',
      'Tour de guet en bambou dominant la crique'
    ],
    environmentalHazards: [
      'Coulées de lave et poches de gaz sulfureux asphyxiants',
      'Effondrements de corniches basaltiques sous tirs de roquettes',
      'Tigre sibérien affamé en maraude'
    ],
    signatureHazards: [
      'Nuages de vapeur volcanique brûlante masquant la vision thermique',
      'Explosions en chaîne de barils de kérosène pirate'
    ],
    ambientProfile: 'Grondement sourd du volcan, clapotis des vagues tropicales, cris d’oiseaux tropicaux et rugissements lointains',
    keyPreyIds: ['alien_base_galgo_helder_smuggler', 'prey_jungle_hunter_1987'],
    heroSquadId: 'squad_pred_spratly_pirates',
    villainSquadId: null
  },
  {
    id: 'map_pred_bolderji_caldera',
    name: 'Bolder’ji — Fissures Volcaniques & Complexe Castaneda (2006)',
    universe: 'PREDATOR',
    originMedia: 'Predator: Forever Midnight (DH Press 2006)',
    sourceMedia: 'Predator: Forever Midnight (2006)',
    sourceType: 'NOVEL',
    releaseYear: 2006,
    year: 2006,
    biomeId: 'yautja_prime',
    biome: 'yautja_prime',
    recommendedBiomeLabel: 'Caldeira de Bolder’ji (Predator: Forever Midnight 2006)',
    weather: 'Tempête de cendres ignées abrasives, bourrasques thermiques torrides et ciels zébrés d’éclairs de soufre',
    lighting: 'Rayonnement vermeil sinistre émanant des failles magmatiques contrastant avec le ciel noir de suie',
    verticality: 'MOYENNE À FORTE (Cheminées volcaniques naturelles, passerelles métalliques minières et terrasses de basalte vitrifié)',
    destructibility: 'Conduits de pompage géothermiques, cloisons pressurisées de Castaneda et baraquements préfabriqués',
    interactables: [
      'Vannes de dépressurisation géothermique',
      'Foreuses minières lourdes automatisées',
      'Console de commande du dôme Castaneda'
    ],
    environmentSummary: 'Le complexe minier pionnier de Castaneda implanté au bord d’une caldeira active sur le monde hostile de Bolder’ji, cible d’une horde de chasseurs en pleine frénésie hormonale.',
    description: 'Le complexe minier pionnier de Castaneda implanté au bord d’une caldeira active sur le monde hostile de Bolder’ji, cible d’une horde de chasseurs en pleine frénésie hormonale.',
    tacticalNotes: 'La chaleur extrême de la caldeira sature les visions infrarouges passives ; guetter les silhouettes sur fond de faille de lave pour ajuster les tirs de plasma.',
    dimensionsM: { width: 550, length: 550, height: 75 },
    elevationRangeM: [-10, 65],
    tacticalSectors: [
      'Dôme Minier Principal de Castaneda',
      'Passerelles de Maintenance Géothermique',
      'Champs de Geysers Sulfureux Supérieurs',
      'Faille Magmatique de la Frénésie Hish'
    ],
    keyLandmarks: [
      'Station de forage géothermique profonde',
      'Entrepôt de transporteurs de minerai scellé',
      'Autel de trophées provisoire érigé sur le promontoire de lave'
    ],
    environmentalHazards: [
      'Jets soudains de vapeur surchauffée pressurisée',
      'Pluie de scories et cendres abrasives réduisant la visibilité',
      'Lacs de lave en fusion instantanément mortels'
    ],
    signatureHazards: [
      'Éruptions mineures provoquant des ondes de choc sismiques',
      'Surchauffe rapide des accumulateurs d’énergie Yautja'
    ],
    ambientProfile: 'Souffle continu des évents magmatiques, alarmes industrielles hurlantes et crépitement des braises',
    keyPreyIds: ['alien_base_royce_mercenaire_2010', 'prey_bad_blood_warlord'],
    heroSquadId: 'squad_pred_bolderji_mercs',
    villainSquadId: null
  },
  {
    id: 'map_alien_stronghold_ernst_lab',
    name: 'Maboushe — Forteresse & Biosphère du Dr Ernst (1994)',
    universe: 'ALIEN',
    originMedia: 'Aliens: Stronghold (Dark Horse Comics 1994)',
    sourceMedia: 'Aliens: Stronghold (1994)',
    sourceType: 'COMIC',
    releaseYear: 1994,
    year: 1994,
    biomeId: 'stargazer_blacksite',
    biome: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Laboratoire de la Forteresse Maboushe (Aliens: Stronghold 1994)',
    weather: 'Atmosphère intérieure climatisée stérile, buée de cryostase et condensation chimique',
    lighting: 'Néons cliniques froids vacillants, projecteurs d’observation bleutés et gyrophares d’alerte orange',
    verticality: 'FORTE (Passerelles d’observation suspendues au-dessus des enclos de ruche, cages ascenseurs et conduits de purge)',
    destructibility: 'Parois en plexiglas blindé des cages de xénomorphes, consoles de surveillance et automates sentinelles',
    interactables: [
      'Sas de libération des sujets d’expérimentation',
      'Diffuseurs de phéromones de neutralisation',
      'Terminal cybernétique de Jeri'
    ],
    environmentSummary: 'Le sanctuaire de recherche forteresse du Dr Caspar Ernst où sont menées des hybridations cybernétiques et des élevages contrôlés de xénomorphes sous la garde du synthétique Jeri.',
    description: 'Le sanctuaire de recherche forteresse du Dr Caspar Ernst où sont menées des hybridations cybernétiques et des élevages contrôlés de xénomorphes sous la garde du synthétique Jeri.',
    tacticalNotes: 'Les tourelles de défense ciblent toute créature biologique non répertoriée ; pirater les consoles pour retourner l’armement automatique contre les droïdes de sécurité.',
    dimensionsM: { width: 480, length: 480, height: 45 },
    elevationRangeM: [0, 40],
    tacticalSectors: [
      'Enceinte d’Élevage Contrôlé des Spécimens XX121',
      'Laboratoire de Cybernétique Avancée de Jeri',
      'Poste de Commandement du Dr Caspar Ernst',
      'Secteur des Batteries de Sentinelles Automatiques'
    ],
    keyLandmarks: [
      'Bocal d’immersion géant contenant une Reine en stase artificielle',
      'Atelier d’assemblage des synthétiques xénoformes',
      'Sas de décontamination sous sas étanche'
    ],
    environmentalHazards: [
      'Jets de gaz neurotoxique automatisés en cas de brèche',
      'Décharges électriques issues de câbles sectionnés',
      'Acide corrosif résiduel sur les grilles de ventilation'
    ],
    signatureHazards: [
      'Tourelles de neutralisation automatique à tir asservi',
      'Sas d’isolement verrouillant hermétiquement les sections'
    ],
    ambientProfile: 'Vrombissement monotone des ventilations lourdes, bips de surveillance médicale et sifflements de vapeur d’azote liquide',
    keyPreyIds: ['alien_base_jeri_synthetic_xeno_cigar', 'prey_xeno_warrior'],
    heroSquadId: 'squad_alien_stronghold_sec_drones',
    villainSquadId: null
  },
  {
    id: 'map_alien_lv178_trimonite_mines',
    name: 'LV-178 New Galveston — Mines Profondes de Trimonite (2014)',
    universe: 'ALIEN',
    originMedia: 'Alien: Sea of Sorrows (Titan Books 2014)',
    sourceMedia: 'Alien: Sea of Sorrows (2014)',
    sourceType: 'NOVEL',
    releaseYear: 2014,
    year: 2014,
    biomeId: 'hive_lv426',
    biome: 'hive_lv426',
    recommendedBiomeLabel: 'Mines de Trimonite de LV-178 (Alien: Sea of Sorrows 2014)',
    weather: 'Tempête de sable siliceux toxique en surface, humidité poisseuse et vapeurs d’acide en galeries profondes',
    lighting: 'Projecteurs halogènes de chantiers miniers aveuglants, bioluminescence verdâtre de la résine xénomorphe et ténèbres abyssales',
    verticality: 'TRÈS FORTE (Puits de forage verticaux de 2 kilomètres, ascenseurs de mine à câble et gouffres de trimonite)',
    destructibility: 'Étaiements en bois synthétique de galeries, wagonnets de transport de minerai et tuyaux d’aération d’urgence',
    interactables: [
      'Treuil de levage de la benne minière',
      'Générateurs à turbine de ventilation souterraine',
      'Charges explosives de concassage de roche'
    ],
    environmentSummary: 'Le réseau titanesque d’excavations minières de New Galveston sur LV-178 ayant percé le tombeau enfoui d’une ruche ancestrale dormant sous les strates de trimonite cristallisée.',
    description: 'Le réseau titanesque d’excavations minières de New Galveston sur LV-178 ayant percé le tombeau enfoui d’une ruche ancestrale dormant sous les strates de trimonite cristallisée.',
    tacticalNotes: 'Les cristaux de trimonite réfléchissent les tirs d’énergie de manière erratique ; attirer les essaims de drones dans les puits de forage pour exploiter la chute libre.',
    dimensionsM: { width: 520, length: 520, height: 80 },
    elevationRangeM: [-50, 30],
    tacticalSectors: [
      'Plateforme de Triage Minier de Trimonite',
      'Galeries d’Excavation Inférieures Non Cartographiées',
      'Crypte Ancestrale de la Ruche Millénaire',
      'Puits Central d’Extraction Pneumatique'
    ],
    keyLandmarks: [
      'Excavatrice rotative géante bloquée dans la résine durcie',
      'Gisement cristallin géant de trimonite translucide',
      'Fosse d’incubation de la couvée originelle'
    ],
    environmentalHazards: [
      'Éboulements de roche et de trimonite acérée',
      'Gouffres sans fond masqués par de fausses parois de résine',
      'Poches de méthane explosif s’enflammant au plasma'
    ],
    signatureHazards: [
      'Échos psioniques de la Ruche perturbant la concentration du chasseur',
      'Ruissellements d’acide noir rongeant les protections'
    ],
    ambientProfile: 'Goutte-à-goutte lourd résonnant dans les cavernes, grincement métallique des câbles de treuil et cliquetis de chitine lointains',
    keyPreyIds: ['alien_base_tyler_romulus_miner', 'prey_xeno_drone_1979'],
    heroSquadId: 'squad_alien_lv178_miners',
    villainSquadId: null
  },
  {
    id: 'map_avp_uss_ryushi_cargo_hold',
    name: 'USS Ryushi — Cales & Hangars de Décontamination (1995)',
    universe: 'AVP',
    originMedia: 'Aliens vs. Predator: Duel (Dark Horse Comics 1995)',
    sourceMedia: 'Aliens vs. Predator: Duel (1995)',
    sourceType: 'COMIC',
    releaseYear: 1995,
    year: 1995,
    biomeId: 'genna_deathworld',
    biome: 'genna_deathworld',
    recommendedBiomeLabel: 'Ponts Cargo de l’USS Ryushi (AVP: Duel 1995)',
    weather: 'Atmosphère recyclée étouffante, brouillard de fluides hydrauliques et fuites de vapeur sous pression',
    lighting: 'Éclairage d’urgence rouge stroboscopique, gerbes d’étincelles de circuits grillés et ombres mouvantes des conteneurs',
    verticality: 'MOYENNE (Empilements de conteneurs de fret standardisés, passerelles de grue portique et coursives techniques)',
    destructibility: 'Caisses de matériel d’intendance militaire, conduites de carburant de dropship et verrières de cabine de pont',
    interactables: [
      'Commande de la grue portique de chargement lourd',
      'Purge d’urgence du sas d’évacuation vers le vide',
      'Armoire d’armement d’urgence des Marines'
    ],
    environmentSummary: 'Les cales de stockage inférieures de la frégate de sauvetage USS Ryushi où la carcasse d’un vaisseau de chasse Yautja a été halée, libérant une abomination Predalien parmi l’équipage.',
    description: 'Les cales de stockage inférieures de la frégate de sauvetage USS Ryushi où la carcasse d’un vaisseau de chasse Yautja a été halée, libérant une abomination Predalien parmi l’équipage.',
    tacticalNotes: 'Les couloirs étroits favorisent les embuscades à courte distance ; utiliser les conteneurs métalliques pour couper les lignes de vue du lance-flammes des Marines.',
    dimensionsM: { width: 460, length: 460, height: 35 },
    elevationRangeM: [-5, 25],
    tacticalSectors: [
      'Baie d’Arrimage du Transporteur Yautja Accidenté',
      'Hangar de Confinement Biologique Provisoire',
      'Atelier de Maintenance des Navettes UD-4L',
      'Pont des Machines & Systèmes de Propulsion'
    ],
    keyLandmarks: [
      'Navette Yautja éventrée entourée de rubans de quarantaine',
      'Pont roulant magnétique bloqué avec un conteneur suspendu',
      'Sas d’éjection directe vers l’espace stellaire'
    ],
    environmentalHazards: [
      'Conduites de vapeur pressurisée fuyant à haute température',
      'Sols glissants souillés de lubrifiant synthétique inflammable',
      'Chute de conteneurs instables lors des secousses orbitales'
    ],
    signatureHazards: [
      'Dépressurisation locale en cas de perforation de la coque',
      'Tirs réflexes de lance-flammes embrasant l’atmosphère confinée'
    ],
    ambientProfile: 'Sirène d’évacuation résonnant en boucle, claquements de relais haute tension et sifflements de décompression',
    keyPreyIds: ['alien_base_christopher_winter_marine', 'prey_broken_tusk_dachande'],
    heroSquadId: 'squad_avp_uss_ryushi_marines',
    villainSquadId: null
  },
  {
    id: 'map_avp_orbital_web_shipyard',
    name: 'The Web — Chantier Spatial Minier & Échafaudages Orbitaux (1999)',
    universe: 'AVP',
    originMedia: 'Aliens vs. Predator: The Web (Dark Horse Comics 1999)',
    sourceMedia: 'Aliens vs. Predator: The Web (1999)',
    sourceType: 'COMIC',
    releaseYear: 1999,
    year: 1999,
    biomeId: 'los_angeles_1997',
    biome: 'los_angeles_1997',
    recommendedBiomeLabel: 'Chantier Spatial Orbital The Web (AVP: The Web 1999)',
    weather: 'Vide spatial glacé en extérieur, tempêtes de micro-météorites et atmosphère industrielle raréfiée en dôme',
    lighting: 'Éblouissement solaire direct non filtré en contraste brutal avec les ténèbres spatiales et torches à plasma de soudure',
    verticality: 'EXTRÊME (Échafaudages en treillis s’étendant sur des kilomètres, poutrelles magnétiques sans garde-corps et nacelles suspendues)',
    destructibility: 'Câbles de maintien de poutrelles maîtresses, panneaux solaires de chantier et cloisons d’ateliers d’ajustage',
    interactables: [
      'Catapulte magnétique de lancement de poutrelles',
      'Générateur de pesanteur artificielle sectorielle',
      'Projecteurs de soudure industrielle haute intensité'
    ],
    environmentSummary: 'Une station mégastructurelle de construction de vaisseaux stellaires en orbite, composée de milliers de kilomètres d’échafaudages magnétiques pris d’assaut par une meute Yautja et des xénomorphes.',
    description: 'Une station mégastructurelle de construction de vaisseaux stellaires en orbite, composée de milliers de kilomètres d’échafaudages magnétiques pris d’assaut par une meute Yautja et des xénomorphes.',
    tacticalNotes: 'Les variations de microgravité modifient la parabole des tirs de disque ; bondir d’une poutrelle à l’autre permet d’encercler prestement les ouvriers armés de riveteuses.',
    dimensionsM: { width: 600, length: 600, height: 90 },
    elevationRangeM: [-20, 70],
    tacticalSectors: [
      'Trame Principale des Poutrelles Magnétiques',
      'Quai d’Assemblage de la Quille Stellaire',
      'Poste de Contrôle des Catapultes Industrielles',
      'Modules d’Habitation Suspendus des Équipes de Montage'
    ],
    keyLandmarks: [
      'Quille monumentale d’un croiseur Conestoga en chantier',
      'Tour de commande centrale de la structure The Web',
      'Catapulte magnétique industrielle orientable'
    ],
    environmentalHazards: [
      'Chutes mortelles dans le vide en cas de décrochage magnétique',
      'Faisceaux de soudure laser automatisés balayant les passerelles',
      'Arcs électriques jaillissant des bobines de sustentation'
    ],
    signatureHazards: [
      'Projectiles de rivets magnétiques perforants tirés par les équipes de monteurs',
      'Rupture soudaine du champ de pesanteur artificielle'
    ],
    ambientProfile: 'Vibrations métalliques profondes transmises par les structures, sifflement des tuyères de stabilisation et crépitement des arcs de soudure',
    keyPreyIds: ['alien_base_johner_mercenary_betty', 'prey_broken_tusk_dachande'],
    heroSquadId: 'squad_avp_web_shipyard_riggers',
    villainSquadId: null
  },
  {
    id: 'map_pred_afghan_bunker_network',
    name: 'Afghanistan — Réseau de Bunkers & Grottes Glacées (2018)',
    universe: 'PREDATOR',
    originMedia: 'Predator: Hunters II',
    sourceMedia: 'Predator: Hunters II (2018)',
    sourceType: 'COMIC',
    releaseYear: 2018,
    year: 2018,
    biomeId: 'stargazer_blacksite',
    biome: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Installation Souterraine Stargazer',
    weather: 'Tempête de neige d\'altitude en extérieur et humidité glaciale dans les boyaux',
    lighting: 'Lanterne rouge militaire de secours et obscurité totale des grottes naturelles',
    verticality: 'ÉLEVÉE (Puits d\'aération soviétiques, escaliers taillés dans le roc et crêtes rocheuses)',
    destructibility: 'Caisses d\'armement soviétiques, cloisons de béton fissuré et stalactites de glace',
    interactables: [
      'Générateur diesel de secours Stargazer',
      'Sas blindé de bunker soviétique',
      'Projecteur halogène de périmètre'
    ],
    environmentSummary: 'Complexe de grottes d\'altitude fortifié par des bunkers soviétiques occupés par Stargazer, où les mercenaires de Tyler Swain traquent un Yautja invisible par températures négatives.',
    description: 'Complexe de grottes d\'altitude fortifié par des bunkers soviétiques occupés par Stargazer, où les mercenaires de Tyler Swain traquent un Yautja invisible par températures négatives.',
    tacticalNotes: 'La vision thermique Yautja est perturbée par le froid glacial ambiant ; exploiter les couloirs étroits pour coincer les patrouilles avec des tirs d\'interdiction.',
    dimensionsM: { width: 500, length: 500, height: 60 },
    elevationRangeM: [-25, 35],
    tacticalSectors: [
      'Bunker de Commandement Soviétique Désaffecté',
      'Galerie des Grottes Glacées Inférieures',
      'Poste Avancé Stargazer',
      'Piste d\'Atterrissage en Haute Altitude'
    ],
    keyLandmarks: [
      'Porte blindée de bunker anti-atomique',
      'Épave d\'hélicoptère Mil Mi-24 encastrée dans la neige',
      'Faille géologique gelée'
    ],
    environmentalHazards: [
      'Stalactites instables susceptibles de s\'effondrer',
      'Crevasses glissantes masquées par la neige',
      'Conduites de gaz de chauffage fuyant à haute pression'
    ],
    signatureHazards: [
      'Vent thermique violent déséquilibrant sur les passerelles extérieures',
      'Tirs d\'arrêt au fusil lourd anti-matériel .50 BMG'
    ],
    ambientProfile: 'Bourrasques de neige hurlantes, cliquetis de générateurs usés et réverbération caverneuse des coups de feu',
    keyPreyIds: ['alien_base_quinn_mckenna_ranger_2018', 'prey_colonial_marine_heavy'],
    heroSquadId: 'squad_pred_hunters_ii_afghan',
    villainSquadId: null
  },
  {
    id: 'map_pred_central_america_cenote',
    name: 'Guatemala — Cénote Précolombien & Dépôt Narco (2020)',
    universe: 'PREDATOR',
    originMedia: 'Predator: Hunters III',
    sourceMedia: 'Predator: Hunters III (2020)',
    sourceType: 'COMIC',
    releaseYear: 2020,
    year: 2020,
    biomeId: 'jungle',
    biome: 'jungle',
    recommendedBiomeLabel: 'Jungle & Grottes Sacrées Maya',
    weather: 'Pluie tropicale torrentielle, brume aquatique et chaleur étouffante au fond du cénote',
    lighting: 'Puits de lumière zénithale perçant la voûte effondrée et flambeaux de camp de cartel',
    verticality: 'ÉLEVÉE (Parois calcaires verticales de 40 mètres, lianes géantes et terrasses du temple enfoui)',
    destructibility: 'Palissades en bois de camp narco, caisses de munitions et stèles maya millénaires',
    interactables: [
      'Pompe d\'évacuation d\'eau motorisée',
      'Treuil de hissage pour barques',
      'Générateur de campement de cartel'
    ],
    environmentSummary: 'Cénote calcaire effondré servant de cache d\'armes au cartel et de temple rituel Yautja, relié par un réseau de rivières souterraines piégées.',
    description: 'Cénote calcaire effondré servant de cache d\'armes au cartel et de temple rituel Yautja, relié par un réseau de rivières souterraines piégées.',
    tacticalNotes: 'L\'eau profonde désactive le camouflage optique en cas d\'immersion totale ; bondir d\'arbre en corniche permet de dominer les positions de tir du cartel.',
    dimensionsM: { width: 450, length: 450, height: 70 },
    elevationRangeM: [-35, 35],
    tacticalSectors: [
      'Bassin Central du Cénote Calcaire',
      'Campement & Dépôt d\'Armes du Cartel',
      'Terrasse du Sanctuaire Maya Enfoui',
      'Galeries Subaquatiques & Réseau d\'Infiltration'
    ],
    keyLandmarks: [
      'Autel sacrificiel précolombien orné de glyphes Yautja',
      'Chute d\'eau alimentant le bassin central',
      'Ponton d\'amarrage des barques narco'
    ],
    environmentalHazards: [
      'Courants subaquatiques violents aspirants',
      'Sols calcaires polis glissants',
      'Brumes de condensation occultant le relief'
    ],
    signatureHazards: [
      'Rafales continues de mitrailleuse MG42 lourde depuis le mirador',
      'Pièges à pieux hydrographiques ancestraux'
    ],
    ambientProfile: 'Grondement sourd de la cascade, croassements d\'amphibiens et échos stridents des balles ricochant sur la pierre',
    keyPreyIds: ['alien_base_king_willie_voodoo_priest', 'prey_weyland_combat_android'],
    heroSquadId: 'squad_pred_hunters_iii_guatemala',
    villainSquadId: null
  },
  {
    id: 'map_alien_nemesis_berserker_forge',
    name: 'Station Nemesis — Hangar M.A.X. & Fonderie Désaffectée (1995)',
    universe: 'ALIEN',
    originMedia: 'Aliens: Berserker',
    sourceMedia: 'Aliens: Berserker (1995)',
    sourceType: 'COMIC',
    releaseYear: 1995,
    year: 1995,
    biomeId: 'hive_lv426',
    biome: 'hive_lv426',
    recommendedBiomeLabel: 'Station Minière Pressurisée & Ruche Métallique',
    weather: 'Atmosphère industrielle surchauffée chargée de micro-particules de scories et vapeur toxique',
    lighting: 'Lueurs orangées de métal en fusion coulant dans les rigoles et gyrophares industriels ambrés',
    verticality: 'MOYENNE (Nacelles de coulée suspendues, ponts roulants sidérurgiques et fosses de coulée)',
    destructibility: 'Cuves de scories refroidies, passerelles en caillebotis métalliques et tubulures de gaz',
    interactables: [
      'Commande de la benne de scories en fusion',
      'Purge des conduites de refroidissement cryogénique',
      'Baie de recharge de l\'armure M.A.X.'
    ],
    environmentSummary: 'Complexe sidérurgique orbital ravagé par un essaim xénomorphe et défendu par l\'armure MAX, avec ses hauts-fourneaux désaffectés et ses nids biomécaniques incrustés.',
    description: 'Complexe sidérurgique orbital ravagé par un essaim xénomorphe et défendu par l\'armure MAX, avec ses hauts-fourneaux désaffectés et ses nids biomécaniques incrustés.',
    tacticalNotes: 'La chaleur des rigoles de fonte masque les signatures infrarouges ; attirer les guerriers xénomorphes sous les jets de vapeur pour neutraliser leur agilité.',
    dimensionsM: { width: 480, length: 480, height: 45 },
    elevationRangeM: [-10, 35],
    tacticalSectors: [
      'Hangar de Maintenance de l\'Exosquelette M.A.X.',
      'Halle de Coulée des Hauts-Fourneaux',
      'Ruche Métallique Infiltrée dans les Trémies',
      'Galerie des Compresseurs Pneumatiques'
    ],
    keyLandmarks: [
      'Châssis d\'armure assistée M.A.X. éventré sur son berceau',
      'Creuset géant de fonte suspendu par des chaînes',
      'Cocon de résine xénomorphe englobant les conduits principaux'
    ],
    environmentalHazards: [
      'Éclaboussures de scories en fusion incandescentes',
      'Jets de vapeur haute pression intermittents',
      'Poutrelles corrodées par l\'acide cédant sous le poids'
    ],
    signatureHazards: [
      'Tirs de canon rotatif à plasma lourd balayant les coursives',
      'Plaques d\'acide de guerriers démembrés perforant les caillebotis'
    ],
    ambientProfile: 'Bourdonnement lourd des transformateurs électriques, sifflement des soupapes de décharge et crissements chitineux de l\'essaim',
    keyPreyIds: ['prey_xeno_warrior', 'prey_colonial_marine_heavy'],
    heroSquadId: 'squad_alien_nemesis_berserkers',
    villainSquadId: null
  },
  {
    id: 'map_alien_shan_shen_refinery',
    name: 'Shan Shen — Raffinerie Minière & Silos de Spores (2022)',
    universe: 'ALIEN',
    originMedia: 'Alien: Inferno\'s Fall',
    sourceMedia: 'Alien: Inferno\'s Fall (2022)',
    sourceType: 'NOVEL',
    releaseYear: 2022,
    year: 2022,
    biomeId: 'genna_deathworld',
    biome: 'genna_deathworld',
    recommendedBiomeLabel: 'Raffinerie Chimique & Périmètre Toxique',
    weather: 'Brouillard toxique teinté de suie noire, retombées d\'aérosols mutagènes et vent chimique âcre',
    lighting: 'Éclairage industriel blafard perçant péniblement les nappes de brume et torches de dégazage',
    verticality: 'ÉLEVÉE (Tours de craquage géantes de 50m, silos de stockage cylindriques et tuyauteries interconnectées)',
    destructibility: 'Vannes de purge chimique, passerelles de maintenance en aluminium et conduites de condensat',
    interactables: [
      'Valve de purge thermique d\'urgence',
      'Sas de surpression de silo à spores',
      'Station de décontamination chimique UPP'
    ],
    environmentSummary: 'Tours de craquage industriel et silos souterrains contaminés par l\'agent noir pathogène, où patrouillent des gardes de sécurité et des runners infectés.',
    description: 'Tours de craquage industriel et silos souterrains contaminés par l\'agent noir pathogène, où patrouillent des gardes de sécurité et des runners infectés.',
    tacticalNotes: 'Les vapeurs de l\'agent noir dégradent progressivement les boucliers ; monter sur les cuves supérieures pour maintenir l\'avantage visuel et canarder à longue portée.',
    dimensionsM: { width: 520, length: 520, height: 65 },
    elevationRangeM: [-15, 50],
    tacticalSectors: [
      'Silos de Stockage des Spores Pathogènes',
      'Tour de Craquage Chimique Principale',
      'Gare de Chargement des Wagons-Citernes',
      'Périmètre de Quarantaine des Gardes UPP'
    ],
    keyLandmarks: [
      'Batterie de quatre silos cylindriques noircis par le pathogène',
      'Torche de dégazage crachant une flamme verte',
      'Sas de décontamination mobile UPP percuté par un tracteur'
    ],
    environmentalHazards: [
      'Poches d\'aérosols mutagènes provoquant des dégâts continus',
      'Fuites de solvants chimiques corrosifs au sol',
      'Fumerolles toxiques réduisant brutalement la visibilité'
    ],
    signatureHazards: [
      'Charges explosives de décontamination posées par les gardes UPP',
      'Ruées supersoniques de Xénomorphes Runners infectés'
    ],
    ambientProfile: 'Souffle continu des brûleurs industriels, alarmes de fuite chimique modulées et crépitements de compteur geiger',
    keyPreyIds: ['prey_xeno_runner', 'alien_base_christopher_winter_marine'],
    heroSquadId: 'squad_alien_shan_shen_guards',
    villainSquadId: null
  },
  {
    id: 'map_avp_samara_ring_habitat',
    name: 'Station Orbitale Samara — Penthouse Delacroix & Noyau Hive (1993)',
    universe: 'AVP',
    originMedia: 'AVP: Deadliest of the Species',
    sourceMedia: 'AVP: Deadliest of the Species (1993)',
    sourceType: 'COMIC',
    releaseYear: 1993,
    year: 1993,
    biomeId: 'stargazer_blacksite',
    biome: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Spire Orbitale Haute Société & Ruche Infiltrée',
    weather: 'Atmosphère pressurisée de luxe régulée, parfum d\'orchidées synthétiques mêlé à l\'odeur d\'ozone et d\'acide',
    lighting: 'Lustres en cristal holographiques, baies vitrées donnant sur le vide spatial et reflets dorés d\'ornements',
    verticality: 'ÉLEVÉE (Escaliers monumentaux en marbre, balcons d\'atrium sur trois étages et puits d\'ascenseur rapide)',
    destructibility: 'Sculptures d\'art moderne, baies vitrées blindées, cloisons de bois précieux et fontaines',
    interactables: [
      'Console de sécurité du Toyo Harada Zaibatsu',
      'Ascenseur panoramique express du penthouse',
      'Verrouillage d\'urgence du dôme de verre'
    ],
    environmentSummary: 'Jardins suspendus et couloirs de luxe transformés en abattoir par l\'essaim et Big Mama, opposant l\'opulence aristocratique à la barbarie xénomorphe.',
    description: 'Jardins suspendus et couloirs de luxe transformés en abattoir par l\'essaim et Big Mama, opposant l\'opulence aristocratique à la barbarie xénomorphe.',
    tacticalNotes: 'Les surfaces réfléchissantes trompent les capteurs de visée ; utiliser les balcons supérieurs pour des plongeons au glaive dévastateurs sur les prétoriens.',
    dimensionsM: { width: 550, length: 550, height: 50 },
    elevationRangeM: [0, 50],
    tacticalSectors: [
      'Atrium Monumental du Penthouse Delacroix',
      'Jardins Suspendus & Bosquets d\'Orchidées',
      'Galerie Privée des Collections d\'Armes Harada',
      'Noyau Hive Dissimulé dans les Gaines Techniques'
    ],
    keyLandmarks: [
      'Baie vitrée colossale ouvrant sur la Terre et l\'anneau orbital',
      'Fontaine de marbre noir souillée de sang acide',
      'Trône d\'apparat de Toyo Harada aux conduits cybernétiques'
    ],
    environmentalHazards: [
      'Dépressurisation partielle en cas d\'impact lourd sur les verrières',
      'Courts-circuits des projecteurs holographiques luxueux',
      'Chutes mortelles dans le vide de l\'atrium'
    ],
    signatureHazards: [
      'Tirs de fléchettes cybernétiques perforantes des gardes Harada',
      'Charge lourde de prétoriens xénomorphes à carapace renforcée'
    ],
    ambientProfile: 'Musique classique étouffée jouée par des automates blessés, bris de verre réguliers et crépitements d\'arcs laser',
    keyPreyIds: ['prey_praetorian_obsidian_armored', 'alien_base_alexa_lex_woods_guide'],
    heroSquadId: 'squad_avp_delacroix_samara',
    villainSquadId: null
  },
  {
    id: 'map_avp_caparis_vii_canyon',
    name: 'Caparis VII — Faille Minérale & Enclos des Chiens de Guerre (2010)',
    universe: 'AVP',
    originMedia: 'AVP: Three World War',
    sourceMedia: 'AVP: Three World War (2010)',
    sourceType: 'COMIC',
    releaseYear: 2010,
    year: 2010,
    biomeId: 'yautja_prime',
    biome: 'yautja_prime',
    recommendedBiomeLabel: 'Canyon Rocheux & Avant-Poste Killer Clan',
    weather: 'Chaleur minérale accablante, poussière de grès abrasive et bourrasques sèches balayant la gorge',
    lighting: 'Lumière zénithale crue du soleil binaire projetant des ombres tranchées et torches de campement barbare',
    verticality: 'ÉLEVÉE (Falaises ocres abruptes, corniches rocheuses escarpées et ponts de cordes suspendus)',
    destructibility: 'Palissades en os et métal de rebut, cages de contention de xénomorphes et rochers branlants',
    interactables: [
      'Treuil de libération des enclos de xénomorphes',
      'Baliste de plasma improvisée du Killer Clan',
      'Réservoir d\'eau saumâtre de garnison'
    ],
    environmentSummary: 'Tranchée géologique aride où le Killer Clan dresse des xénomorphes captifs comme meute de guerre, jalonnée d\'enclos barbelés et de postes de guet.',
    description: 'Tranchée géologique aride où le Killer Clan dresse des xénomorphes captifs comme meute de guerre, jalonnée d\'enclos barbelés et de postes de guet.',
    tacticalNotes: 'La poussière en suspension atténue l\'efficacité du canon plasma ; utiliser les corniches en hauteur pour intercepter les chiens de guerre avant leur ruée.',
    dimensionsM: { width: 580, length: 580, height: 75 },
    elevationRangeM: [-20, 55],
    tacticalSectors: [
      'Gorge Inférieure & Faille d\'Érosion',
      'Enclos de Domestication des Xénomorphes',
      'Bastion Perché du Killer Clan',
      'Plateau Rocailleux des Duels de Clan'
    ],
    keyLandmarks: [
      'Pylône d\'ossements géant dressé à l\'entrée de l\'enclos',
      'Cage en titane abritant une meute enchaînée',
      'Carapace de vaisseau de largage écrasé servant de forge'
    ],
    environmentalHazards: [
      'Éboulements de roches instables provoqués par les détonations',
      'Pièges barbelés à aiguilles électrifiées',
      'Précipices vertigineux le long des sentiers de falaise'
    ],
    signatureHazards: [
      'Meute de guerriers xénomorphes asservis fonçant de concert',
      'Tirs de tromblons à plasma lourd des guerriers Bad Blood'
    ],
    ambientProfile: 'Hurlements rauques de molosses de guerre, cliquetis de chaînes barbelées sous tension et sifflements du vent dans les failles',
    keyPreyIds: ['prey_xeno_warrior', 'prey_hell_hound_tracker'],
    heroSquadId: 'squad_avp_three_world_killer_clan',
    villainSquadId: null
  },
  {
    id: 'map_pred_rockies_firewatch_ridge',
    name: 'Rocheuses — Ligne de Crête & Tour de Guet Incendie (2008)',
    universe: 'PREDATOR',
    originMedia: 'Predator: Turnabout',
    sourceMedia: 'Predator: Turnabout (2008)',
    sourceType: 'NOVEL',
    releaseYear: 2008,
    year: 2008,
    biomeId: 'jungle',
    biome: 'jungle',
    recommendedBiomeLabel: 'Forêt Boréale des Rocheuses & Falaises Granitiques',
    weather: 'Vent d\'altitude glacial sifflant entre les pins centenaires, brume dense au fond des ravins et neige précoce',
    lighting: 'Lueur rasante du crépuscule perçant la canopée boréale, ombres étirées et reflets aveuglants sur les aiguilles de pin gelées',
    verticality: 'TRÈS ÉLEVÉE (Éperons rocheux vertigineux, passerelles d\'escalade en bois, tour de guet métallique culminante et pierriers glissants)',
    destructibility: 'Murs de rondins et toitures de cabanes de rangers pulvérisables, réservoirs de propane et branchages inflammables',
    environmentSummary: 'Crête escarpée des Rocheuses dominée par une tour de guet isolée, truffée de pièges acoustiques et de lignes de résonance tendues par Ray Vance.',
    tacticalSectors: [
      { id: 'sector_turnabout_firewatch_tower', name: 'Tour de Guet Incendie & Plateforme 360°', description: 'Structure métallique panoramique surplombant la vallée avec faisceau de longue portée et télémétrie' },
      { id: 'sector_turnabout_granite_pass', name: 'Passage des Aiguilles de Granit', description: 'Gorge étroite battue par les rafales où les échos sonores masquent les signatures thermiques' },
      { id: 'sector_turnabout_rangers_cabin', name: 'Cabane des Rangers & Atelier de Piégeage', description: 'Refuge forestier blindé contenant munitions lourdes, câbles d\'acier et carillons d\'alerte' }
    ],
    environmentalHazards: [
      { type: 'ACOUSTIC_CONFUSION', description: 'Les rafales de vent dans les failles de granit provoquent des illusions acoustiques déroutant les bio-masques' },
      { type: 'COLLAPSIBLE_SCREE', description: 'Pierriers instables susceptibles de déclencher des éboulements mortels lors de sauts précipités' }
    ],
    keyPreyIds: ['alien_base_quinn_mckenna_ranger_2018', 'prey_colonial_marine_heavy'],
    heroSquadId: 'squad_pred_turnabout_rangers',
    villainSquadId: null
  },
  {
    id: 'map_pred_western_front_1916',
    name: 'Front Ouest 1916 — Tranchées de la Somme & No Man\'s Land (2001)',
    universe: 'PREDATOR',
    originMedia: 'Predator: Blood on Two Earths',
    sourceMedia: 'Predator: Blood on Two Earths (2001)',
    sourceType: 'COMIC',
    releaseYear: 2001,
    year: 2001,
    biomeId: 'los_angeles_1997',
    biome: 'los_angeles_1997',
    recommendedBiomeLabel: 'Zone de Conflit Dévastée & Tranchées Boueuses',
    weather: 'Pluie battante continue transformant le sol en bourbier gluant, fumées d\'ypérite stagnantes et nuages noirs de cordite',
    lighting: 'Fusées éclairantes au magnésium pendantes oscillant sous les nuages bas, flashes d\'artillerie lointaine et feux de cratères',
    verticality: 'BASSE À MOYENNE (Réseau de boyaux creusés à 2m sous terre, parapets renforcés de sacs de sable et monticules de terre retournée)',
    destructibility: 'Blindages de casemates en rondins, chevaux de frise en fil de fer barbelé et passerelles de caillebotis détruites par le plasma',
    environmentSummary: 'Champ de bataille dévasté de la Somme où les tranchées de première ligne et le No Man\'s Land deviennent l\'arène d\'une chasse sanglante au milieu de l\'artillerie.',
    tacticalSectors: [
      { id: 'sector_ww1_first_line_trench', name: 'Tranchée de Première Ligne & Postes de Tir', description: 'Labyrinthe boueux jalonné de créneaux blindés, d\'abris de fortune et de periscopes de tranchée' },
      { id: 'sector_ww1_no_mans_land_crater', name: 'Cratère de Mine de la Somme', description: 'Immense cuvette boueuse encombrée de barbelés et de squelettes métalliques de chars primitifs' },
      { id: 'sector_ww1_underground_dugout', name: 'Sape Souterraine & QG de Régiment', description: 'Galerie fortifiée sous 8 mètres de craie avec lampes à acétylène et liaisons téléphoniques coupées' }
    ],
    environmentalHazards: [
      { type: 'MUSTARD_GAS_POCKETS', description: 'Poches de gaz moutarde persistant dans les creux de tranchées corrosives pour les membranes respiratoires' },
      { type: 'RAZOR_WIRE_MAZE', description: 'Barbelés barbelés concertina ralentissant drastiquement les mouvements et infligeant des lacérations' }
    ],
    keyPreyIds: ['alien_base_major_dutch_schaefer_1987', 'prey_colonial_marine_heavy'],
    heroSquadId: 'squad_pred_western_front_infantry',
    villainSquadId: null
  },
  {
    id: 'map_alien_mendel_station_ducting',
    name: 'Station Mendel — Conduits Techniques & Salle de Contrôle (2019)',
    universe: 'ALIEN',
    originMedia: 'Alien: Blackout',
    sourceMedia: 'Alien: Blackout (2019)',
    sourceType: 'GAME',
    releaseYear: 2019,
    year: 2019,
    biomeId: 'stargazer_blacksite',
    biome: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Station Spatiale Isolée & Réseau de Conduits',
    weather: 'Atmosphère pressurisée conditionnée avec micro-fuites d\'argon liquide, givre sur les conduits de survie et grésillement de relais',
    lighting: 'Mode panne générale : stroboscopes d\'urgence rouges et cônes de faisceaux monochromes des caméras d\'observation',
    verticality: 'TRÈS ÉLEVÉE (Trois niveaux superposés reliés par des puits d\'aération carrés, faux-plafonds techniques et passerelles suspendues)',
    destructibility: 'Grilles de ventilation défonçables, portes coupe-feu motorisées reconfigurables et consoles informatiques piratables',
    environmentSummary: 'Station orbitale Weyland-Yutani privée d\'alimentation principale où Amanda Ripley coordonne les mouvements des survivants à travers les sas contre un Xénomorphe traqueur.',
    tacticalSectors: [
      { id: 'sector_blackout_ops_bridge', name: 'Pont d\'Opérations & Baie de Surveillance', description: 'Poste central avec banques de moniteurs CRT, déclencheurs de portes blindées et cartes holographiques' },
      { id: 'sector_blackout_vent_matrix', name: 'Matrice de Conduits Techniques Supraconducteurs', description: 'Labyrinthe exigu de gaines d\'aération permettant d\'échapper aux couloirs principaux' },
      { id: 'sector_blackout_hydroponic_lab', name: 'Laboratoire Hydroponique & Silos Pressurisés', description: 'Serres hydroponiques en semi-obscurité avec pulvérisateurs de nutriments et couvert végétal dense' }
    ],
    environmentalHazards: [
      { type: 'PNEUMATIC_AIRLOCK_SEALS', description: 'Portes étanches à fermeture automatique capables d\'écraser net tout prédateur ou proie' },
      { type: 'OXYGEN_DEPLETION_ZONES', description: 'Secteurs en dépressurisation lente limitant le temps de séjour sans équipement respiratoire hermétique' }
    ],
    keyPreyIds: ['prey_xeno_drone_1979', 'alien_base_amanda_ripley_sevastopol_engineer'],
    heroSquadId: 'squad_alien_mendel_tech_sec',
    villainSquadId: null
  },
  {
    id: 'map_alien_leto_pioneer_station',
    name: 'Planète Leto — Station Pioneer & Ruche Principale (2023)',
    universe: 'ALIEN',
    originMedia: 'Aliens: Dark Descent',
    sourceMedia: 'Aliens: Dark Descent (2023)',
    sourceType: 'GAME',
    releaseYear: 2023,
    year: 2023,
    biomeId: 'hive_lv426',
    biome: 'hive_lv426',
    recommendedBiomeLabel: 'Complexe Industriel Leto Sous Protocole Cerberus',
    weather: 'Tempêtes d\'ammoniac toxique extérieures, condensats acides ruisselant le long des parois de résine biomécanique',
    lighting: 'Projecteurs de chantier USCM balayant les corridors, lumière bleuâtre des modules d\'analyse et bioluminescence d\'œufs xénomorphes',
    verticality: 'ÉLEVÉE (Atrium central à coursives multiples, puits d\'excavation minière de 50m et nids suspendus dans les poutrelles métalliques)',
    destructibility: 'Portes industrielles soudables au chalumeau, barils de carburant inflammable et cloisons de résine calcinables',
    environmentSummary: 'Base de recherche Pioneer sur la lune Leto plongée dans le chaos par le culte de l\'Infestation darwinienne, verrouillée depuis l\'orbite par le protocole Cerberus.',
    tacticalSectors: [
      { id: 'sector_leto_pioneer_atrium', name: 'Atrium Central & Périmètre Défensif USCM', description: 'Vaste esplanade industrielle fortifiée avec barbelés, sacs de sable et tourelles de flanc' },
      { id: 'sector_leto_darwin_shrine', name: 'Sanctuaire du Culte Darwiniste', description: 'Chambre de filtration transformée en temple d\'adoration des Facehuggers avec runes peintes au sang' },
      { id: 'sector_leto_queen_chamber', name: 'Chambre de Ponte de la Reine de Leto', description: 'Grotte géothermique incrustée de matière organique noire où la progéniture est continuellement couvée' }
    ],
    environmentalHazards: [
      { type: 'CERBERUS_ORBITAL_STRIKES', description: 'Frappes de missiles antiblindage automatisées dès qu\'une cible est détectée à ciel ouvert' },
      { type: 'CORROSIVE_ACID_FLOODING', description: 'Flaques d\'acide de Xénomorphes morts rongeant le métal des passerelles et perçant les planchers' }
    ],
    keyPreyIds: ['prey_xeno_praetorian_royal', 'prey_xeno_warrior'],
    heroSquadId: 'squad_alien_leto_darwin_cultists',
    villainSquadId: null
  },
  {
    id: 'map_avp_lv742_subterranean_core',
    name: 'LV-742 — Noyau Souterrain & Ruines Weyland (2003)',
    universe: 'AVP',
    originMedia: 'Aliens versus Predator: Extinction',
    sourceMedia: 'Aliens versus Predator: Extinction (2003)',
    sourceType: 'GAME',
    releaseYear: 2003,
    year: 2003,
    biomeId: 'bouvetoya_pyramid',
    biome: 'bouvetoya_pyramid',
    recommendedBiomeLabel: 'Souterrains Géothermiques de LV-742',
    weather: 'Chaleur volcanique étouffante, vapeurs de soufre s\'échappant des failles basaltiques et grondements sismiques réguliers',
    lighting: 'Magma incandescent coulant dans les crevasses, torches chimiques jaunes USCM et décharges d\'arcs électriques résiduels',
    verticality: 'TRÈS ÉLEVÉE (Plateformes de forage étagées sur cinq paliers, ponts naturels de basalte surplombant des gouffres de lave et corniches)',
    destructibility: 'Structures métalliques Weyland corrodées, ponts de câbles sectionnables et colonnes de basalte fissurables',
    environmentSummary: 'Cœur géothermique de LV-742 où les forces de Weyland-Yutani, les hordes mutantes de Ravagers et les Chasseurs d\'Élite Yautja s\'affrontent pour le contrôle de la planète.',
    tacticalSectors: [
      { id: 'sector_lv742_drill_rig_delta', name: 'Tour de Forage Géothermique Delta', description: 'Structure colossale exploitant les cheminées hydrothermales avec élévateurs industriels fonctionnels' },
      { id: 'sector_lv742_ravager_breeding_trench', name: 'Fosse de Mutation des Ravagers', description: 'Chambre naturelle baignée de boues riches en mutagène où incubent les guerriers à lames géantes' },
      { id: 'sector_lv742_yautja_sanctuary_outpost', name: 'Avant-Poste Rituel des Anciens', description: 'Ruines ancestrales taillées dans la roche volcanique gravées de trophées légendaires de chasses passées' }
    ],
    environmentalHazards: [
      { type: 'MAGMA_GEYSERS', description: 'Geysers de lave pulvérisant des jets de scories brûlantes à intervalles réguliers' },
      { type: 'SEISMIC_TREMORS', description: 'Secousses tectoniques brutales provoquant la chute de stalactites de basalte' }
    ],
    keyPreyIds: ['prey_xeno_queen_mother', 'alien_base_xeno_ravager_elite_guard'],
    heroSquadId: 'squad_avp_lv742_ravager_hive',
    villainSquadId: null
  },
  {
    id: 'map_avp_bunda_machiko_plains',
    name: 'Planète Bunda — Plaines Arides & Enclos Colonial (1995)',
    universe: 'AVP',
    originMedia: 'Aliens vs. Predator: War',
    sourceMedia: 'Aliens vs. Predator: War (1995)',
    sourceType: 'COMIC',
    releaseYear: 1995,
    year: 1995,
    biomeId: 'ryushi_desert',
    biome: 'ryushi_desert',
    recommendedBiomeLabel: 'Plaines Savanières & Périmètre Électrifié',
    weather: 'Chaleur sèche de savane extraterrestre, poussière rouge soulevée par les troupeaux et mirages thermiques sous soleil triple',
    lighting: 'Lumière dorée aveuglante des trois soleils de Bunda, contrastant avec l\'ombre noire des monticules rocheux',
    verticality: 'MOYENNE (Plaines herbeuses vallonnées, affleurements de grès sculptés par les vents et clôtures électrifiées périmétriques)',
    destructibility: 'Pylônes de clôtures à bétail destructibles, réservoirs d\'eau sous pression et véhicules tout-terrain civils',
    environmentSummary: 'Savane aride de Bunda où les colons humains se retrouvent piégés entre une infestation xénomorphe déchaînée et la grande chasse sans pitié du Clan Top-Knot.',
    tacticalSectors: [
      { id: 'sector_bunda_homestead_perimeter', name: 'Enclos Colonial & Barrière Haute Tension', description: 'Périmètre fortifié par des grilles électrifiées pour protéger les colons et les bêtes contre la faune' },
      { id: 'sector_bunda_termite_mounds', name: 'Collines de Monticules d\'Ocres', description: 'Affleurements labyrinthiques de termitières géantes idéales pour le contournement discret et l\'embuscade' },
      { id: 'sector_bunda_yautja_hunting_circle', name: 'Cercle de Chasse du Top-Knot Clan', description: 'Zone de ralliement des guerriers Yautja avec balises de téléportation et totems de mise à mort' }
    ],
    environmentalHazards: [
      { type: 'HIGH_VOLTAGE_FENCES', description: 'Clôtures électriques haute tension infligeant des chocs étourdissants et révélant les camouflages' },
      { type: 'DUST_DEVILS', description: 'Tourbillons de poussière abrasive aveuglant les viseurs optiques et perturbant le verrouillage tri-laser' }
    ],
    keyPreyIds: ['prey_xeno_warrior', 'prey_colonial_marine_heavy'],
    heroSquadId: 'squad_avp_bunda_top_knot_clan',
    villainSquadId: null
  },
  {
    id: 'map_pred_south_china_sea_fortress',
    name: 'Mer de Chine Méridionale — Forteresse Volcanique & Mangroves (2008)',
    universe: 'PREDATOR',
    originMedia: 'Predator: South China Sea (Dark Horse Books 2008)',
    sourceMedia: 'Predator: South China Sea (2008)',
    sourceType: 'NOVEL',
    releaseYear: 2008,
    year: 2008,
    biomeId: 'jungle',
    biome: 'TROPICAL_VOLCANIC_JUNGLE',
    recommendedBiomeLabel: 'Mer de Chine Méridionale — Forteresse Insulaire (2008)',
    weather: 'Mousson tropicale torrentielle, orages électriques violents et mer déchaînée',
    lighting: 'Pénombre de tempête tropicale, éclairs bleutés et torches vacillantes dans les fortins',
    verticality: 'ÉLEVÉE (Pentes de caldeira volcanique, bastions de pierre et canopée de mangrove)',
    destructibility: 'Palissades de bois de teck, dépôts de munitions pirates et pontons d\'amarrage',
    interactables: [
      'Générateur diesel rouillé alimentant les projecteurs de la cour',
      'Caches d\'armes de contrebande sous bâche étanche',
      'Sentier de crête volcanique surplombant la baie'
    ],
    environmentSummary: 'Une forteresse de pierre coloniale abandonnée sur une île volcanique isolée, occupée par des pirates khmers et un sniper russe, assiégée par un Yautja ancestral.',
    description: 'Une forteresse de pierre coloniale abandonnée sur une île volcanique isolée, occupée par des pirates khmers et un sniper russe, assiégée par un Yautja ancestral.',
    tacticalNotes: 'La pluie de mousson délave les traces thermiques et atténue le camouflage optique ; exploiter les toits des casemates pour dominer les coursives.',
    dimensionsM: { width: 440, length: 480, height: 75 },
    elevationRangeM: [0, 75],
    tacticalSectors: [
      'Cour Centrale du Fort & Bastion Est',
      'Labyrinthe de Mangroves & Chenal des Jonques',
      'Arête Volcanique Supérieure & Nid de Pie de Nikolai',
      'Soutes à Poudre & Citerne Souterraine'
    ],
    keyLandmarks: [
      'Jonque pirate échouée dans la mangrove',
      'Bastion de pierre noire avec mitrailleuse DShK',
      'Caldeira fumante aux parois basaltiques glissantes'
    ],
    environmentalHazards: [
      { type: 'MONSOON_FLOOD', description: 'Crue subite de boue volcanique balayant les ravines inférieures' },
      { type: 'LIGHTNING_STRIKE', description: 'Impacts de foudre sur les structures métalliques et arbres surplombants' }
    ],
    keyPreyIds: ['alien_base_major_dutch_schaefer_1987', 'alien_base_quinn_mckenna_ranger_2018'],
    heroSquadId: 'squad_pred_south_china_sea_pirates',
    villainSquadId: null
  },
  {
    id: 'map_pred_civil_war_ozark_gorge',
    name: 'Monts Ozarks 1863 — Ravin Encaissé & Tranchées de Poudre (1998)',
    universe: 'PREDATOR',
    originMedia: 'Predator: Hell Come A-Walkin\' (Dark Horse Comics 1998)',
    sourceMedia: 'Predator: Hell Come A-Walkin\' (1998)',
    sourceType: 'COMIC',
    releaseYear: 1998,
    year: 1998,
    biomeId: 'los_angeles_1997',
    biome: 'HISTORIC_WARZONE',
    recommendedBiomeLabel: 'Monts Ozarks — Gorges Sanglantes de 1863 (Hell Come A-Walkin\')',
    weather: 'Chaleur moite estivale, brume de poudre noire étouffante et soleil rougeoyant',
    lighting: 'Lueur rasante de fin d\'après-midi filtrée par les fumées de canons et feux de camp',
    verticality: 'MOYENNE (Falaises de calcaire abruptes, talus de tranchées et promontoires rocheux)',
    destructibility: 'Barricades de troncs d\'arbres, chariots de ravitaillement et caissons de munitions',
    interactables: [
      'Canon de campagne Napoléon 12-pounder orientable',
      'Abri de rondins renforcé de sacs de terre',
      'Source d\'eau douce encaissée sous les fougères'
    ],
    environmentSummary: 'Un défilé rocheux du Missouri où deux compagnies ennemies de la guerre civile se retrouvent piégées et chassées par un démon invisible.',
    description: 'Un défilé rocheux du Missouri où deux compagnies ennemies de la guerre civile se retrouvent piégées et chassées par un démon invisible.',
    tacticalNotes: 'La fumée dense des tirs de mousquet offre une couverture visuelle naturelle ; écouter les cliquetis de rechargement pour bondir sur les tireurs isolés.',
    dimensionsM: { width: 380, length: 540, height: 55 },
    elevationRangeM: [0, 55],
    tacticalSectors: [
      'Défilé du Ravin du Diable & Lit de Rivière Asséché',
      'Ligne de Tranchées de l\'Union sur le Talus Nord',
      'Campement de Cavalerie Confédérée sous la Futaie',
      'Crête Calcaire & Promontoire des Trophées'
    ],
    keyLandmarks: [
      'Chariot d\'artillerie pulvérisé par une explosion de poudre',
      'Chêne centenaire aux branches garnies de cadavres suspendus',
      'Caverne calcaire servant d\'hôpital de campagne de fortune'
    ],
    environmentalHazards: [
      { type: 'BLACK_POWDER_SMOKE', description: 'Volutes de fumée sulfurée réduisant la vision normale et masquant les mouvements' },
      { type: 'ROCKFALL', description: 'Éboulements de calcaire déclenchés par les détonations d\'artillerie' }
    ],
    keyPreyIds: ['alien_base_major_dutch_schaefer_1987', 'prey_colonial_marine_heavy'],
    heroSquadId: 'squad_pred_civil_war_platoon',
    villainSquadId: null
  },
  {
    id: 'map_alien_sevastopol_apollo_core',
    name: 'Station Sevastopol — Cœur IA Apollo & Quartier San Cristobal (2014)',
    universe: 'ALIEN',
    originMedia: 'Alien: Isolation (Creative Assembly / SEGA 2014)',
    sourceMedia: 'Alien: Isolation (2014)',
    sourceType: 'GAME',
    releaseYear: 2014,
    year: 2014,
    biomeId: 'stargazer_blacksite',
    biome: 'SPACE_STATION_INTERIOR',
    recommendedBiomeLabel: 'Station Sevastopol — San Cristobal & Apollo (Isolation 2014)',
    weather: 'Pressurisation vacillante, froid glacial de fuite de fluide thermique et air raréfié',
    lighting: 'Stroboscopes d\'urgence orange Seegson, voyants cathodiques verts et pénombre des couloirs',
    verticality: 'TRÈS ÉLEVÉE (Réseau de gaines de ventilation sur 4 étages, gaines d\'ascenseur et passerelles)',
    destructibility: 'Panneaux muraux en composite Seegson, vitrages de sas médicaux et consoles informatiques',
    interactables: [
      'Boîtiers de reprogrammation de portes de confinement',
      'Terminaux d\'accès système Apollo délivrant des journaux audio',
      'Vannes de purge de gaz d\'extinction incendie'
    ],
    environmentSummary: 'Les quartiers médicaux en déroute et la chambre centrale de l\'IA Apollo sur Sevastopol, patrouillés par des Working Joes implacables sous directive de purge.',
    description: 'Les quartiers médicaux en déroute et la chambre centrale de l\'IA Apollo sur Sevastopol, patrouillés par des Working Joes implacables sous directive de purge.',
    tacticalNotes: 'Les conduits de ventilation permettent des approches furtives parfaites ; attention aux androïdes qui ne ressentent ni la douleur ni les toxines gazeuses.',
    dimensionsM: { width: 360, length: 420, height: 60 },
    elevationRangeM: [-20, 40],
    tacticalSectors: [
      'Division Médicale San Cristobal & Salles d\'Opération',
      'Noyau Central de Refroidissement d\'Apollo',
      'Coursive Principale du Transit Seegson',
      'Laboratoire de Synthèse Pharmaceutique de Quarantaine'
    ],
    keyLandmarks: [
      'Dôme sphérique du processeur central Apollo aux lumières ambrées',
      'Sas de décontamination ensanglanté de San Cristobal',
      'Poste de sécurité barricadé avec moniteurs de surveillance'
    ],
    environmentalHazards: [
      { type: 'ELECTROSTATIC_SURGE', description: 'Arcs électriques intermittents s\'échappant des câblages sectionnés d\'Apollo' },
      { type: 'SECURITY_LOCKDOWN', description: 'Portes blindées de secteur se fermant automatiquement lors des alarmes sonores' }
    ],
    keyPreyIds: ['alien_base_amanda_ripley_sevastopol_engineer', 'prey_xeno_drone_1979'],
    heroSquadId: 'squad_alien_sevastopol_working_joes',
    villainSquadId: null
  },
  {
    id: 'map_alien_uss_europa_cargo_bay',
    name: 'USS Europa — Baie de Fret & Sas de Décontamination (2016)',
    universe: 'ALIEN',
    originMedia: 'Aliens: Defiance (Dark Horse Comics 2016)',
    sourceMedia: 'Aliens: Defiance (2016)',
    sourceType: 'COMIC',
    releaseYear: 2016,
    year: 2016,
    biomeId: 'hive_lv426',
    biome: 'WARSHIP_INTERIOR',
    recommendedBiomeLabel: 'Destroyer USS Europa — Baie de Fret & Confinement (Defiance 2016)',
    weather: 'Atmosphère conditionnée militaire froide, brouillard de cryo-dégivrage et alertes d\'avarie',
    lighting: 'Éclairage tactique rouge marine, projecteurs mobiles de manutention et ombres longues',
    verticality: 'ÉLEVÉE (Ponts de chargement à trois niveaux, grues de transbordement et coursives)',
    destructibility: 'Conteneurs de fret standardisés Weyland, casiers d\'armurerie et cloisons pare-feu',
    interactables: [
      'Commandes de grue de pont magnétique mobile',
      'Sas d\'éjection vers le vide spatial avec levier manuel',
      'Armoire d\'armes de bord et munitions de fusils à impulsion'
    ],
    environmentSummary: 'Le destroyer de classe Europa détourné par Zula Hendricks et Davis 01, transformé en champ de bataille lors de la destruction des spécimens bio-armés.',
    description: 'Le destroyer de classe Europa détourné par Zula Hendricks et Davis 01, transformé en champ de bataille lors de la destruction des spécimens bio-armés.',
    tacticalNotes: 'La hauteur sous plafond permet des tirs plongeants depuis les rails de grue ; le déclenchement du sas d\'éjection aspire violemment tout corps non ancré.',
    dimensionsM: { width: 420, length: 500, height: 45 },
    elevationRangeM: [0, 45],
    tacticalSectors: [
      'Pont Principal de Déchargement Cargo & Conteneurs',
      'Sas de Décontamination Spécimens & Cuves Cryo',
      'Passerelles Techniques Supérieures de Conduite de Tir',
      'Atelier de Réparation des Synthétiques de Combat'
    ],
    keyLandmarks: [
      'Cuve de transport blindée portant le logo Weyland-Yutani barré de tags de rébellion',
      'Console de pilotage de Davis 01 avec schéma holographique du navire',
      'Double sas de largage orbital donnant directement sur le vide'
    ],
    environmentalHazards: [
      { type: 'RAPID_DECOMPRESSION', description: 'Dépressurisation soudaine créant des vents violents attirant vers l\'espace' },
      { type: 'CRYO_LEAK', description: 'Flaques de réfrigérant liquide gelant instantanément les surfaces au contact' }
    ],
    keyPreyIds: ['prey_colonial_marine_heavy', 'prey_xeno_warrior'],
    heroSquadId: 'squad_alien_defiance_strike_team',
    villainSquadId: null
  },
  {
    id: 'map_avp_pirate_booty_cargo_dock',
    name: 'Station Frégate Pirate — Baie d\'Arraisonnement de la Reine (1996)',
    universe: 'AVP',
    originMedia: 'AVP: Booty (Dark Horse Comics 1996)',
    sourceMedia: 'AVP: Booty (1996)',
    sourceType: 'COMIC',
    releaseYear: 1996,
    year: 1996,
    biomeId: 'stargazer_blacksite',
    biome: 'SPACE_HULK_DOCK',
    recommendedBiomeLabel: 'Frégate Pirate de l\'Espace — Baie de Fret de la Reine (Booty 1996)',
    weather: 'Pression atmosphérique instable, vapeurs d\'hydrocarbures de moteurs et bruit de tôles froissées',
    lighting: 'Lumières de chantier jaunes clignotantes, arcs de soudure et pénombre des recoins de cales',
    verticality: 'ÉLEVÉE (Empilements anarchiques de conteneurs de contrebande, passerelles suspendues et coursives)',
    destructibility: 'Caisses de butin en bois synthétique, conduits de carburant et passerelles métalliques rouillées',
    interactables: [
      'Treuil de levage industriel pour conteneurs lourds',
      'Découpeur thermique industriel à plasma d\'atelier',
      'Console de pressurisation manuelle du sas d\'abordage'
    ],
    environmentSummary: 'Une immense baie de fret bricolée à bord d\'une frégate de contrebandiers où une reine xénomorphe s\'est réveillée en pleine phase de découpe Yautja.',
    description: 'Une immense baie de fret bricolée à bord d\'une frégate de contrebandiers où une reine xénomorphe s\'est réveillée en pleine phase de découpe Yautja.',
    tacticalNotes: 'La disposition chaotique du butin brise les lignes de tir direct ; les angles morts sont propices aux embuscades de facehuggers et aux bonds de prédateurs.',
    dimensionsM: { width: 390, length: 460, height: 50 },
    elevationRangeM: [0, 50],
    tacticalSectors: [
      'Zone de Découpe Principale & Caisson de la Reine',
      'Dédale de Conteneurs de Contrebande & Butin Volé',
      'Sas d\'Infiltration des Chasseurs Yautja Découpé au Plasma',
      'Passerelle de Contrôle Pirate & Quartier du Capitaine'
    ],
    keyLandmarks: [
      'Caisson cryogénique géant brisé de l\'intérieur par la reine',
      'Brèche circulaire béante dans la coque scellée par un champ de force',
      'Autel de trophées de fortune érigé par les pillards'
    ],
    environmentalHazards: [
      { type: 'FUEL_FIRE', description: 'Flammes d\'hydrocarbures sous pression jaillissant des conduites endommagées' },
      { type: 'LOOSE_CARGO', description: 'Conteneurs instables susceptibles de s\'effondrer sous les impacts lourds' }
    ],
    keyPreyIds: ['prey_xeno_praetorian_royal', 'prey_colonial_marine_heavy'],
    heroSquadId: 'squad_avp_pirate_booty_raiders',
    villainSquadId: null
  },
  {
    id: 'map_avp_tokyo_shinjuku_skyrise',
    name: 'Néo-Tokyo Shinjuku — Ponts de Verre & Toits Sous la Pluie (1999)',
    universe: 'AVP',
    originMedia: 'AVP: Tokyo (Dark Horse Comics 1999)',
    sourceMedia: 'AVP: Tokyo (1999)',
    sourceType: 'COMIC',
    releaseYear: 1999,
    year: 1999,
    biomeId: 'los_angeles_1997',
    biome: 'CYBERPUNK_MEGAPOLIS',
    recommendedBiomeLabel: 'Néo-Tokyo Shinjuku — Gratte-ciels & Néons Acides (AVP: Tokyo 1999)',
    weather: 'Pluie battante acide continue, brume urbaine luminescente et reflets scintillants',
    lighting: 'Écrans publicitaires holographiques géants, enseignes au néon pourpres et bleu nuit urbain',
    verticality: 'EXTRÊME (Toits d\'immeubles de 60 étages, passerelles de verre suspendues et antennes de télécom)',
    destructibility: 'Panneaux de verre trempé, enseignes néon projetant des étincelles et balustrades métalliques',
    interactables: [
      'Générateur de panneau publicitaire holographique provoquant un flash aveuglant',
      'Gondole de nettoyage de vitres suspendue motorisée',
      'Panneau de commande d\'héliport privé avec projecteurs d\'atterrissage'
    ],
    environmentSummary: 'Les toits vertigineux et passerelles suspendues de Shinjuku la nuit, où yakuzas cybernétisés, chasseurs Yautja et xénomorphes s\'affrontent au-dessus du vide.',
    description: 'Les toits vertigineux et passerelles suspendues de Shinjuku la nuit, où yakuzas cybernétisés, chasseurs Yautja et xénomorphes s\'affrontent au-dessus du vide.',
    tacticalNotes: 'La chute est mortelle en dehors des toitures ; les surfaces vitrées mouillées réduisent l\'adhérence des foulées tout en réverbérant les tirs de plasma.',
    dimensionsM: { width: 500, length: 500, height: 180 },
    elevationRangeM: [0, 180],
    tacticalSectors: [
      'Héliport Central de la Tour Mishima & Salon Panoramique',
      'Passerelle Aérienne de Verre Reliant les Tours Jumelles',
      'Enchevêtrement de Climatiseurs Industriels & Labyrinthe de Néons',
      'Nid d\'Antennes Satellites du Sommet de Tour'
    ],
    keyLandmarks: [
      'Écran holographique géant d\'une geisha diffusant des glitchs vidéo',
      'Hélicoptère d\'évacuation yakuza écrasé en bordure de toit',
      'Jardin zen suspendu au 50ème étage aux cerisiers de plastique'
    ],
    environmentalHazards: [
      { type: 'VERTIGO_FALL', description: 'Vents violents d\'altitude déstabilisant les appuis en bordure de toit' },
      { type: 'NEON_SHORT_CIRCUIT', description: 'Décharges électriques aveuglantes des enseignes brisées par les tirs' }
    ],
    keyPreyIds: ['alien_base_quinn_mckenna_ranger_2018', 'prey_xeno_warrior'],
    heroSquadId: 'squad_avp_tokyo_yakuza_clan',
    villainSquadId: null
  },
  {
    "id": "map_pred_fleener_creek_valley",
    "name": "Fleener Creek — Vallée Minière & Forêt de Conifères (1996)",
    "universe": "PREDATOR",
    "originMedia": "Predator: Kindred (Dark Horse Comics 1996)",
    "sourceMedia": "Predator: Kindred (1996)",
    "sourceType": "COMIC",
    "releaseYear": 1996,
    "year": 1996,
    "biomeId": "jungle",
    "biome": "GEOTHERMAL_FOREST",
    "recommendedBiomeLabel": "Fleener Creek — Pentes Boisées de l'Oregon (1996)",
    "weather": "Brume matinale dense, aiguilles de pin humides et crachin glacial",
    "lighting": "Lueurs crépusculaires filtrées à travers les hautes cimes des sapins Douglas",
    "verticality": "ÉLEVÉE (Pentes rocheuses abruptes, galeries de mine à flanc de colline et miradors de bûcherons)",
    "destructibility": "Clôtures en bois, cabanons d'outillage minier et troncs vermoulus",
    "interactables": [
      "Treuil hydraulique de wagonnet de mine fonctionnel",
      "Citerne d'eau rouillée déversant un rideau liquide masquant la signature thermique",
      "Balise radio du shérif émettant un signal de détresse acoustique"
    ],
    "environmentSummary": "Vallée forestière encaissée dominée par une mine désaffectée où le shérif local traque un psychopathe tandis qu'un Yautja d'honneur observe leurs démarches.",
    "description": "Vallée forestière encaissée dominée par une mine désaffectée où le shérif local traque un psychopathe tandis qu'un Yautja d'honneur observe leurs démarches.",
    "tacticalNotes": "La couverture forestière dense facilite l'embuscade aérienne sur les branches maîtresses ; attention aux galeries étroites qui interdisent le tir au canon d'épaule.",
    "dimensionsM": {
      "width": 550,
      "length": 550,
      "height": 120
    },
    "elevationRangeM": [
      0,
      120
    ],
    "tacticalSectors": [
      "Puits d'Aération & Entrée Principale de la Mine Fleener",
      "Ligne de Chemin de Fer Forestière & Wagonnets Abandonnés",
      "Clairière du Poste d'Affût & Cabane du Shérif",
      "Gorge Rocheuse du Torrent aux Rapides Glacés"
    ],
    "keyLandmarks": [
      "Chevalement de mine en bois centenaire surplombant la canopée",
      "Camion de patrouille du shérif embourbé dans l'ornière",
      "Fougeraie épaisse tapissée de pièges à mâchoires"
    ],
    "environmentalHazards": [
      {
        "type": "MINE_SHAFT_DROP",
        "description": "Puits de mine non balisés dissimulés sous les branchages"
      },
      {
        "type": "BEAR_TRAP",
        "description": "Pièges à loups rouillés dissimulés dans les sous-bois"
      }
    ],
    "keyPreyIds": [
      "prey_bad_blood_warlord"
    ],
    "heroSquadId": "squad_pred_fleener_creek_posse",
    "villainSquadId": null
  },
  {
    "id": "map_pred_demons_gold_swamp",
    "name": "Amazonie — Marécages de l'Or Maudit (1997)",
    "universe": "PREDATOR",
    "originMedia": "Predator: Demon's Gold (Dark Horse Comics 1997)",
    "sourceMedia": "Predator: Demon's Gold (1997)",
    "sourceType": "COMIC",
    "releaseYear": 1997,
    "year": 1997,
    "biomeId": "jungle",
    "biome": "TROPICAL_COAST_JUNGLE",
    "recommendedBiomeLabel": "Marais Équatorial — Trésor Maudit (1997)",
    "weather": "Humidité étouffante à 95%, miasmes bouillonnants et pluie tropicale battante",
    "lighting": "Obscurité moite sous canopée impénétrable percée de reflets dorés d'eaux stagnantes",
    "verticality": "MOYENNE (Mangroves aux racines géantes aériennes, arbres fétides et barques échouées)",
    "destructibility": "Végétation aquatique dense, caisses de transport en bois pourri et branchages",
    "interactables": [
      "Caisse de lingots d'or abandonnée servant de leurre sonore",
      "Canot fluvial à moteur hors-bord en panne réutilisable pour diversion",
      "Nid d'insectes venimeux provoquant une perturbation sensorielle"
    ],
    "environmentSummary": "Marais saumâtre fangeux où des officiers en fuite alourdis de lingots d'or sont méthodiquement cernés par un prédateur insaisissable.",
    "description": "Marais saumâtre fangeux où des officiers en fuite alourdis de lingots d'or sont méthodiquement cernés par un prédateur insaisissable.",
    "tacticalNotes": "La boue épaisse réduit la vitesse de sprint au sol de 30% mais recouvre la peau pour tromper les visées thermiques rudimentaires.",
    "dimensionsM": {
      "width": 480,
      "length": 480,
      "height": 60
    },
    "elevationRangeM": [
      0,
      60
    ],
    "tacticalSectors": [
      "Banc de Vase aux Caisses de Butin Éventrées",
      "Labyrinthe de Racines Palétuviers & Canaux Étroits",
      "Épave de l'Hydravion de Fuite Enfoncé dans la Fange",
      "Promontoire Boueux aux Totems Funéraires Indigènes"
    ],
    "keyLandmarks": [
      "Hydravion de transport à croix de fer brisé en deux dans les eaux saumâtres",
      "Monticule de lingots d'or maculés de boue et de sang coagulé",
      "Figuier étrangleur géant servant de perchoir d'observation au chasseur"
    ],
    "environmentalHazards": [
      {
        "type": "QUICKSAND_MUD",
        "description": "Bourbiers fangeux provoquant un enlisement progressif"
      },
      {
        "type": "SWAMP_MIASMA",
        "description": "Poches de méthane explosant au contact du tir plasma"
      }
    ],
    "keyPreyIds": [
      "prey_jungle_hunter_1987"
    ],
    "heroSquadId": "squad_pred_demons_gold_expedition",
    "villainSquadId": null
  },
  {
    "id": "map_alien_hiveworld_spire",
    "name": "Planète Mère — Flèche Organique de la Reine Mère (1990)",
    "universe": "ALIEN",
    "originMedia": "Aliens: The Female War (Dark Horse Comics / Bantam Spectra 1990)",
    "sourceMedia": "Aliens: The Female War (1990)",
    "sourceType": "NOVEL",
    "releaseYear": 1990,
    "year": 1990,
    "biomeId": "hive_lv426",
    "biome": "XENO_HIVEWORLD_BIOME",
    "recommendedBiomeLabel": "Planète Mère Xénomorphe — Chambre de la Reine Mère (1990)",
    "weather": "Atmosphère suffocante chargée de spores biochimiques et de brume acide tiède",
    "lighting": "Luminescence bioluminescente verdâtre et pulsions organiques des parois chitineuses",
    "verticality": "EXTRÊME (Spire creuse de 300 mètres, ponts de résine torsadés et puits de couvée)",
    "destructibility": "Cocons de résine sèche, piliers osseux poreux et conduits d'acide",
    "interactables": [
      "Grappe de cocons royaux pouvant être enflammée pour créer un barrage de feu",
      "Conduit de ventilation sécrétant de la gelée royale nutritive",
      "Console de largage télécommandée du dropship de Billie"
    ],
    "environmentSummary": "Le cœur battant du monde d'origine des xénomorphes, une tour monumentale de sécrétions résineuses abritant le trône de la Reine Mère.",
    "description": "Le cœur battant du monde d'origine des xénomorphes, une tour monumentale de sécrétions résineuses abritant le trône de la Reine Mère.",
    "tacticalNotes": "La densité de la ruche permet des embuscades à 360 degrés ; la Reine Mère commande télépathiquement aux guerriers de se sacrifier.",
    "dimensionsM": {
      "width": 600,
      "length": 600,
      "height": 320
    },
    "elevationRangeM": [
      0,
      320
    ],
    "tacticalSectors": [
      "Chambre du Trône Suprême de la Reine Mère & Gardes Prétoriens",
      "Puits Ascendant des Oeufs Royaux & Conduits de Ponte",
      "Passerelle d'Accostage du Vaisseau de Brèche Humain",
      "Galeries Concentriques des Ouvrières & Niches Murales"
    ],
    "keyLandmarks": [
      "L'immense ovipositeur pulsant de la Reine Mère fixé au plafond de la spire",
      "Plateforme mobile de capture cryogénique apportée par Wilks",
      "Squelette fossilisé d'une reine antérieure intégrée à la structure murale"
    ],
    "environmentalHazards": [
      {
        "type": "BIO_ACID_GEYSER",
        "description": "Éruptions spontanées de sang acide sous haute pression"
      },
      {
        "type": "PHEROMONE_FRENZY",
        "description": "Spores de rage augmentant la férocité et la vitesse des guerriers"
      }
    ],
    "keyPreyIds": [
      "prey_xeno_warrior",
      "prey_xeno_queen_mother"
    ],
    "heroSquadId": "squad_alien_female_war_strike_team",
    "villainSquadId": null
  },
  {
    "id": "map_alien_nightmare_outpost",
    "name": "Station Outpost — Laboratoire Neural de Spears (1989)",
    "universe": "ALIEN",
    "originMedia": "Aliens: Nightmare Asylum (Dark Horse Comics 1989)",
    "sourceMedia": "Aliens: Nightmare Asylum (1989)",
    "sourceType": "COMIC",
    "releaseYear": 1989,
    "year": 1989,
    "biomeId": "stargazer_blacksite",
    "biome": "SPACE_STATION_INTERIOR",
    "recommendedBiomeLabel": "Avant-Poste Militaire — Enclos de Dressage Xéno (1989)",
    "weather": "Atmosphère recyclée glaciale, odeur persistante d'ozone et de désinfectant chloré",
    "lighting": "Néons d'alerte stroboscopiques rouges et projecteurs de sécurité chirurgicaux bleus",
    "verticality": "MOYENNE (Arène d'entraînement à plusieurs niveaux, passerelles grillagées et cellules)",
    "destructibility": "Parois en plexiglas blindé fêlées, terminaux de surveillance et sas d'isolation",
    "interactables": [
      "Générateur de choc neural de masse désorientant les créatures captives",
      "Sas de dépressurisation d'urgence de l'enclos d'exercice",
      "Console de commande des tourelles sentinelles automatisées"
    ],
    "environmentSummary": "Base militaire clandestine où le Général Spears a parqué une meute de xénomorphes conditionnés par électrodes avant que l'expérience ne vire au carnage.",
    "description": "Base militaire clandestine où le Général Spears a parqué une meute de xénomorphes conditionnés par électrodes avant que l'expérience ne vire au carnage.",
    "tacticalNotes": "Les xénomorphes feignent la soumission pour tendre des embuscades coordonnées ; surveillez les grilles d'aération au-dessus des passerelles.",
    "dimensionsM": {
      "width": 450,
      "length": 450,
      "height": 75
    },
    "elevationRangeM": [
      0,
      75
    ],
    "tacticalSectors": [
      "Arène de Conditionnement Central & Cage de la Meute Dressée",
      "Passerelle d'Observation Blindée & Poste de Commandement de Spears",
      "Laboratoire d'Implants Chirurgicaux & Banques d'Électrodes",
      "Hangar des Navettes d'Assaut & Sas de Confinement"
    ],
    "keyLandmarks": [
      "Trône de commandement du Général Spears devant les écrans tactiques fracturés",
      "Table d'opération chirurgicale ensanglantée avec carcasse de drone sanglée",
      "Vestiaires des troupes d'assaut ravagés par l'acide"
    ],
    "environmentalHazards": [
      {
        "type": "NEURAL_FEEDBACK",
        "description": "Arcs électriques erratiques des stimulateurs neuraux endommagés"
      },
      {
        "type": "VACUUM_BREACH",
        "description": "Brèches de coque créant des flux d'aspiration violents"
      }
    ],
    "keyPreyIds": [
      "prey_xeno_praetorian_royal"
    ],
    "heroSquadId": "squad_alien_nightmare_asylum_battalion",
    "villainSquadId": null
  },
  {
    "id": "map_avp_gunnison_cemetery_rain",
    "name": "Gunnison — Cimetière Sous l'Orage & Décharge Acide (2007)",
    "universe": "AVP",
    "originMedia": "Aliens vs. Predator: Requiem (20th Century Fox 2007)",
    "sourceMedia": "Aliens vs. Predator: Requiem (2007)",
    "sourceType": "MOVIE",
    "releaseYear": 2007,
    "year": 2007,
    "biomeId": "gunnison_outbreak",
    "biome": "HISTORIC_WARZONE",
    "recommendedBiomeLabel": "Gunnison Colorado — Cimetière Municipal Sous le Déluge (2007)",
    "weather": "Orage violent, pluie torrentielle glaciale et éclairs zébrant le ciel noir",
    "lighting": "Éclairs stroboscopiques périodiques, veilleuses de tombes et réverbères urbains tremblants",
    "verticality": "MOYENNE (Mausolées de marbre, caveaux ouverts, arbres décharnés et clocher)",
    "destructibility": "Stèles funéraires en granit, grilles en fer forgé et caveaux de pierre",
    "interactables": [
      "Fiole de solution dissolvante bleue de Wolf neutralisant les traces biologiques",
      "Ligne à haute tension tombée au sol électrifiant les flaques d'eau",
      "Projecteur halogène portable des secours municipaux"
    ],
    "environmentSummary": "Le cimetière communal de Gunnison sous des trombes d'eau où le nettoyeur Wolf élimine méthodiquement les corps contaminés avant d'affronter le Predalien.",
    "description": "Le cimetière communal de Gunnison sous des trombes d'eau où le nettoyeur Wolf élimine méthodiquement les corps contaminés avant d'affronter le Predalien.",
    "tacticalNotes": "La pluie diluvienne perturbe la netteté du camouflage optique Yautja ; les éclairs révèlent instantanément les silhouettes en hauteur.",
    "dimensionsM": {
      "width": 520,
      "length": 520,
      "height": 85
    },
    "elevationRangeM": [
      0,
      85
    ],
    "tacticalSectors": [
      "Allée Centrale des Mausolées de Famille & Grille Principale",
      "Zone des Tombes Récentes & Fosse Commune de Décontamination",
      "Chapelle Funéraire en Ruine & Clocher de Bois",
      "Sous-Bois Périférique Bordant la Forêt Nationale"
    ],
    "keyLandmarks": [
      "Grand mausolée néogothique aux portes de bronze arrachées",
      "Cratère de dissolution acide fumant émettant une lueur bleue spectrale",
      "Fourgonnette d'intervention du shérif avec gyrophare rougeoyant dans la boue"
    ],
    "environmentalHazards": [
      {
        "type": "LIGHTNING_FLASH",
        "description": "Éclairs aveuglants réinitialisant la sensibilité des masques optiques"
      },
      {
        "type": "ACIDIC_PUDDLE",
        "description": "Flaques d'eau saturées de résidus de sang acide et de solvant bleu"
      }
    ],
    "keyPreyIds": [
      "prey_predalien_abomination"
    ],
    "heroSquadId": "squad_avp_requiem_wolf_cleanup",
    "villainSquadId": null
  },
  {
    "id": "map_avp_xenogenesis_suboceanic_trench",
    "name": "Fosse Océanique — Abysses & Ruche Sous-Marine (2002)",
    "universe": "AVP",
    "originMedia": "Aliens vs. Predator: Xenogenesis (Dark Horse Comics 2002)",
    "sourceMedia": "Aliens vs. Predator: Xenogenesis (2002)",
    "sourceType": "COMIC",
    "releaseYear": 2002,
    "year": 2002,
    "biomeId": "genna_deathworld",
    "biome": "BIOLUMINESCENT_CAVERNS",
    "recommendedBiomeLabel": "Fosse Abyssale — Cheminées Hydrothermales & Ruche Aquatique (2002)",
    "weather": "Pression hydrostatique extrême (600 bars), courants marins denses et noir absolu",
    "lighting": "Cheminées hydrothermales rougeoyantes, bioluminescence des faunes abyssales et phares sous-marins",
    "verticality": "TRÈS ÉLEVÉE (Parois sous-marines verticales, cheminées volcaniques et failles tectoniques)",
    "destructibility": "Formations coralliennes calcaires, concrétions de soufre et dômes d'habitat sous-marin",
    "interactables": [
      "Cheminée hydrothermale expulsant des jets d'eau surchauffée à 400°C",
      "Balise sonar sous-marine désorientant les capteurs acoustiques",
      "Module de survie sous-marin hyperbare pressurisé"
    ],
    "environmentSummary": "Faille tectonique sous-marine profonde où des scientifiques militaires ont implanté des ruches xénomorphes résistant aux pressions colossales des abysses.",
    "description": "Faille tectonique sous-marine profonde où des scientifiques militaires ont implanté des ruches xénomorphes résistant aux pressions colossales des abysses.",
    "tacticalNotes": "La densité de l'eau ralentit les projectiles classiques ; les harpons supercavitants et armes à plasma hyperfocalisées sont obligatoires.",
    "dimensionsM": {
      "width": 580,
      "length": 580,
      "height": 260
    },
    "elevationRangeM": [
      0,
      260
    ],
    "tacticalSectors": [
      "Champ de Fumeurs Noirs & Cheminées Minérales Actives",
      "Dôme d'Observation Sous-Marin Fracturé & Laboratoire Hyperbare",
      "Faille de la Ruche Aquatique & Galeries Coralliennes Résineuses",
      "Plateau Tectonique aux Câbles d'Alimentation Géothermiques"
    ],
    "keyLandmarks": [
      "Cheminée volcanique géante crachant un panache noir d'eau à 400°C",
      "Épave d'un sous-marin d'exploration Weyland éventré par une créature géante",
      "Nid de nageurs xénomorphes accroché aux falaises de basalte"
    ],
    "environmentalHazards": [
      {
        "type": "THERMAL_VENT",
        "description": "Geysers sous-marins causant des brûlures thermiques immédiates"
      },
      {
        "type": "CRUSH_DEPTH",
        "description": "Chute dans la fosse abyssale au-delà des limites de résistance de l'armure"
      }
    ],
    "keyPreyIds": [
      "prey_xeno_sea_swimmer"
    ],
    "heroSquadId": "squad_avp_xenogenesis_strike_cadre",
    "villainSquadId": null
  }
,
  {
    "id": "map_pred_dark_ages_castle",
    "name": "Château Féodal — Tournoi Médiéval & Crypte Templière (1348)",
    "universe": "PREDATOR",
    "originMedia": "Predator: Dark Ages (1348)",
    "sourceMedia": "Predator: Dark Ages (1348)",
    "sourceType": "COMIC",
    "releaseYear": 1995,
    "year": 1348,
    "biomeId": "bouvetoya_pyramid",
    "biome": "HISTORIC_WARZONE",
    "recommendedBiomeLabel": "Forteresse Médiévale — Angleterre Féodale (1348)",
    "weather": "Brouillard épais d'automne, crachin glacé et fumée de feux de tourbe",
    "lighting": "Torches murales à la résine crépitante et vitraux gothiques filtrant la pleine lune",
    "verticality": "ÉLEVÉE (Donjon fortifié de 45 mètres, chemins de ronde à créneaux et douves)",
    "destructibility": "Ponts-levis en chêne vermoulu, herses de fer forgé et échafaudages de siège",
    "interactables": [
      "Mécanisme de treuil de herse libérant un passage vers les douves",
      "Chaudron de poix bouillante basculable pour créer une barrière de flammes",
      "Reliquaire d'or templièr attirant l'attention acoustique des gardes"
    ],
    "environmentSummary": "Château fort féodal assiégé par une présence invisible alors que la garnison templière tente de repousser la traque au milieu des brumes de la peste.",
    "description": "Château fort féodal assiégé par une présence invisible alors que la garnison templière tente de repousser la traque au milieu des brumes de la peste.",
    "tacticalNotes": "Les meurtrières étroites protègent des tirs de canon d'épaule ; les toitures en ardoise sont glissantes sous la pluie.",
    "dimensionsM": {
      "width": 500,
      "length": 500,
      "height": 90
    },
    "elevationRangeM": [
      0,
      90
    ],
    "tacticalSectors": [
      "Cour d'Honneur Pavée & Puits Central du Donjon",
      "Chemin de Ronde Crénelé & Tourelles de Guet",
      "Crypte Souterraine Voûtée des Chevaliers",
      "Grande Salle d'Armes & Foyer Monumental"
    ],
    "keyLandmarks": [
      "Donjon normand massif aux bannières de gueules déchirées",
      "Chapelle funéraire templière aux gisants de pierre blanche",
      "Machine de siège en bois calcinée dans la cour basse"
    ],
    "environmentalHazards": [
      {
        "type": "PITCH_FIRE",
        "description": "Foyers de poix liquide enflammée causant des brûlures persistantes"
      },
      {
        "type": "FALLING_PORTCULLIS",
        "description": "Herses instables pouvant écraser les combattants imprudents"
      }
    ],
    "keyPreyIds": [
      "prey_bad_blood_warlord"
    ],
    "heroSquadId": "squad_pred_dark_ages_knights",
    "villainSquadId": null
  },
  {
    "id": "map_pred_siberian_tundra_outpost",
    "name": "Sibérie 1991 — Base Spetsnaz & Toundra Arctique (1991)",
    "universe": "PREDATOR",
    "originMedia": "Predator: Cold War - Siberia (1991)",
    "sourceMedia": "Predator: Cold War (1991)",
    "sourceType": "COMIC",
    "releaseYear": 1991,
    "year": 1991,
    "biomeId": "bouvetoya_pyramid",
    "biome": "GEOTHERMAL_FOREST",
    "recommendedBiomeLabel": "Sibérie Arctique — Base Spetsnaz Hivernale (1991)",
    "weather": "Blizzard sibérien à -35°C, bourrasques de neige violentes et givre instantané",
    "lighting": "Projecteurs halogènes militaires jaunes sur mâts télescopiques et lueurs vertes d'aurore boréale",
    "verticality": "MOYENNE (Bunkers en béton armé semi-enterrés, tas de bois et antennes radar)",
    "destructibility": "Cabines en tôle ondulée, barbelés givrés et fûts de carburant diesel",
    "interactables": [
      "Groupe électrogène diesel militaire pouvant être surchargé pour un black-out",
      "Projecteur de mirador orientable pour désorganiser le camouflage thermique",
      "Fusée éclairante d'alerte révélant les mouvements dans le blizzard"
    ],
    "environmentSummary": "Complexe militaire secret perdu dans l'immensité blanche de Sibérie où des parachutistes d'élite russes affrontent un prédateur cryo-adapté.",
    "description": "Complexe militaire secret perdu dans l'immensité blanche de Sibérie où des parachutistes d'élite russes affrontent un prédateur cryo-adapté.",
    "tacticalNotes": "Le froid extrême réduit la vitesse de régénération énergétique ; le souffle thermique des corps est visible à plus de 100 mètres.",
    "dimensionsM": {
      "width": 560,
      "length": 560,
      "height": 70
    },
    "elevationRangeM": [
      0,
      70
    ],
    "tacticalSectors": [
      "Périmètre de Clôture Électrifiée & Barbelés Givrés",
      "Poste de Transmission Radar & Bunkers de Commandement",
      "Dépôt de Véhicules Chenillés & Fûts de Carburant",
      "Clairière Enneigée de la Taïga aux Conifères Pétrifiés"
    ],
    "keyLandmarks": [
      "Antenne parabolique géante de détection d'alerte avancée recouverte de stalactites",
      "Transport de troupes blindé BTR-80 écrasé contre un bloc de glace",
      "Pylône d'éclairage oscillant sous les rafales du blizzard"
    ],
    "environmentalHazards": [
      {
        "type": "HYPOTHERMIC_WIND",
        "description": "Rafales de vent glacial ralentissant les mouvements de 25%"
      },
      {
        "type": "FUEL_BLAST",
        "description": "Citernes de diesel explosant sous les impacts de plasma"
      }
    ],
    "keyPreyIds": [
      "prey_jungle_hunter_1987"
    ],
    "heroSquadId": "squad_pred_siberia_spetsnaz_alpha",
    "villainSquadId": null
  },
  {
    "id": "map_alien_earth_ruins_paris",
    "name": "Terre Dévastée — Ruines Irradiées de Paris (1990)",
    "universe": "ALIEN",
    "originMedia": "Aliens: Earth War (Dark Horse Comics 1990)",
    "sourceMedia": "Aliens: Earth War (1990)",
    "sourceType": "COMIC",
    "releaseYear": 1990,
    "year": 1990,
    "biomeId": "hive_lv426",
    "biome": "XENO_HIVEWORLD_BIOME",
    "recommendedBiomeLabel": "Ruines de Paris — Infestation Terrestre (1990)",
    "weather": "Ciel d'orage ocre toxique, retombées radioactives et brume acide persistante",
    "lighting": "Feux de décombres rougeoyants et arcs électriques des lignes haute tension détruites",
    "verticality": "TRÈS ÉLEVÉE (Carcasses d'immeubles haussmanniens éventrés, tunnels de métro et ponts effondrés)",
    "destructibility": "Murs de briques noircis, carcasses de voitures calcinées et nids résineux",
    "interactables": [
      "Conduite de gaz urbain fuyante pouvant être incendiée",
      "Wagon de métro déraillé servant d'abri de repli anti-acide",
      "Batterie de missile anti-aérien abandonnée activable pour diversion"
    ],
    "environmentSummary": "La métropole européenne ravagée par des millions de xénomorphes où les décombres de monuments historiques abritent les couveuses royales.",
    "description": "La métropole européenne ravagée par des millions de xénomorphes où les décombres de monuments historiques abritent les couveuses royales.",
    "tacticalNotes": "La densité des structures résineuses urbaines favorise les assauts verticaux surprises ; l'environnement hautement radioactif brouille les radars.",
    "dimensionsM": {
      "width": 620,
      "length": 620,
      "height": 160
    },
    "elevationRangeM": [
      0,
      160
    ],
    "tacticalSectors": [
      "Boulevard Éventré aux Carcasses d'Autocars & Barricades",
      "Station de Métro Aérienne Convertie en Ruche Résineuse",
      "Esplanade du Monument aux Piliers Métalliques Tordus",
      "Crater de Frappe Nucléaire Tactique aux Braises Fumantes"
    ],
    "keyLandmarks": [
      "Tour métallique monumentale brisée en son tiers supérieur servant de perchoir de reine",
      "Hélicoptère militaire abattu fiché dans la façade d'un immeuble en ruine",
      "Entrée monumentale de métro Art Nouveau engluée de sécrétions noires"
    ],
    "environmentalHazards": [
      {
        "type": "RADIOACTIVE_DUST",
        "description": "Poussières radioactives infligeant des dégâts progressifs continus"
      },
      {
        "type": "STRUCTURAL_COLLAPSE",
        "description": "Planchers de ruines s'effondrant sous le poids des explosions"
      }
    ],
    "keyPreyIds": [
      "prey_xeno_warrior",
      "prey_xeno_queen_matriarch"
    ],
    "heroSquadId": "squad_alien_earth_war_salvage",
    "villainSquadId": null
  },
  {
    "id": "map_alien_lv695_cryo_drilling_rig",
    "name": "Lune Glacée LV-695 — Forage Cryogénique & Nid Enfoui (2023)",
    "universe": "ALIEN",
    "originMedia": "Alien: Thaw (Marvel Comics 2023)",
    "sourceMedia": "Alien: Thaw (2023)",
    "sourceType": "COMIC",
    "releaseYear": 2023,
    "year": 2023,
    "biomeId": "stargazer_blacksite",
    "biome": "SPACE_STATION_INTERIOR",
    "recommendedBiomeLabel": "Lune Glacée LV-695 — Complexe de Forage Weyland (2023)",
    "weather": "Pression atmosphérique ténue, brouillard de sublimation glaciale et condensation constante",
    "lighting": "Éclairage industriel LED blanc froid et voyants d'alarme cryogénique bleu cyan",
    "verticality": "ÉLEVÉE (Puits de forage vertical de 200 mètres, plateformes suspendues et carottiers)",
    "destructibility": "Vitrages blindés givrés, conduites d'azote liquide sous pression et sas thermiques",
    "interactables": [
      "Vanne d'azote liquide cryogénique pulvérisant un jet givrant instantané",
      "Tête de forage géante rotative pouvant broyer les assaillants",
      "Console de dépressurisation du sas de carottage profond"
    ],
    "environmentSummary": "Station de forage creusant dans la calotte glaciaire d'une lune gelée où la libération de xénomorphes emprisonnés dans les glaces sème la terreur.",
    "description": "Station de forage creusant dans la calotte glaciaire d'une lune gelée où la libération de xénomorphes emprisonnés dans les glaces sème la terreur.",
    "tacticalNotes": "Les jets de liquide cryogénique congèlent instantanément les membres ; la réverbération acoustique dans le puits de forage amplifie chaque pas.",
    "dimensionsM": {
      "width": 480,
      "length": 480,
      "height": 210
    },
    "elevationRangeM": [
      0,
      210
    ],
    "tacticalSectors": [
      "Puits Central de Forage Profond & Trépan Diamanté",
      "Salle des Carottes Glaciaires & Cuves Cryogéniques",
      "Passerelle Haute d'Évacuation & Hangar des Foreuses",
      "Module d'Habitation Pressurisé aux Parois GivField"
    ],
    "keyLandmarks": [
      "Tête de forage industrielle de 15 mètres suspendue au-dessus de l'abîme de glace",
      "Bloc de glace millénaire fracturé révélant la silhouette figée d'un drone",
      "Sas d'isolement bio-sécurisé fendu par des griffes d'acide"
    ],
    "environmentalHazards": [
      {
        "type": "LIQUID_NITROGEN_LEAK",
        "description": "Fuites d'azote liquide causant un gel immédiat des articulations"
      },
      {
        "type": "ICE_SHELF_DROP",
        "description": "Fissures dans la calotte polaire créant des gouffres sans fond"
      }
    ],
    "keyPreyIds": [
      "prey_xeno_praetorian_royal"
    ],
    "heroSquadId": "squad_alien_thaw_drilling_crew",
    "villainSquadId": null
  },
  {
    "id": "map_avp_lv1201_forward_pods",
    "name": "LV-1201 — Modules d'Observation Suspendus Pod 5 (2001)",
    "universe": "AVP",
    "originMedia": "Aliens versus Predator 2 (Monolith Productions / Sierra 2001)",
    "sourceMedia": "Aliens versus Predator 2 (2001)",
    "sourceType": "GAME",
    "releaseYear": 2001,
    "year": 2001,
    "biomeId": "genna_deathworld",
    "biome": "ASTEROID_BIO_CITADEL",
    "recommendedBiomeLabel": "Planète LV-1201 — Pods d'Observation Weyland (2001)",
    "weather": "Orages atmosphériques ionisants, pluie acide intermittente et vents de canyon violents",
    "lighting": "Projecteurs jaunes industriels Weyland-Yutani et éclairs bleus illuminant les falaises",
    "verticality": "EXTRÊME (Modules d'habitation suspendus au-dessus d'un canyon sans fond de 800 mètres)",
    "destructibility": "Câbles de haubanage, passerelles métalliques grillagées et sas de décontamination",
    "interactables": [
      "Générateur de champ de force isolant temporairement une section de coursive",
      "Plateforme d'ascenseur rapide reliant le pod d'observation au fond du canyon",
      "Console de défense laser automatique de périmètre"
    ],
    "environmentSummary": "Complexe de recherche suspendu au-dessus des abîmes de LV-1201 où les Marines, les traqueurs Yautja et les xénomorphes du canyon s'affrontent pour le contrôle des pods.",
    "description": "Complexe de recherche suspendu au-dessus des abîmes de LV-1201 où les Marines, les traqueurs Yautja et les xénomorphes du canyon s'affrontent pour le contrôle des pods.",
    "tacticalNotes": "Une chute en dehors des passerelles suspendues est fatale ; les parois rocheuses abruptes permettent aux xénomorphes de grimper à revers.",
    "dimensionsM": {
      "width": 650,
      "length": 650,
      "height": 350
    },
    "elevationRangeM": [
      0,
      350
    ],
    "tacticalSectors": [
      "Module Pod 5 Principal & Laboratoire d'Armement Weyland",
      "Réseau de Passerelles Extérieures Suspendues au-dessus du Vide",
      "Station d'Amarrage des Navettes de Brèche & Grue de Fret",
      "Corniche Rocheuse Supérieure Menant aux Ruines Anciennes"
    ],
    "keyLandmarks": [
      "Structure sphérique colossale du Pod 5 ancrée par d'immenses piliers d'acier",
      "Pont suspendu de 100 mètres oscillant au vent au-dessus du gouffre",
      "Statue Yautja ancestrale millénaire taillée à même la falaise de basalte"
    ],
    "environmentalHazards": [
      {
        "type": "ABYSSAL_PLUNGE",
        "description": "Chute dans le canyon sans fond causant une mort instantanée"
      },
      {
        "type": "ION_LIGHTNING",
        "description": "Arcs électriques ionisants surchargeant les circuits optiques"
      }
    ],
    "keyPreyIds": [
      "prey_xeno_king_titan"
    ],
    "heroSquadId": "squad_avp_lv1201_weyland_iron_guard",
    "villainSquadId": null
  },
  {
    "id": "map_avp_chokehold_cargo_terminal",
    "name": "Terminal de Fret Sécurisé — Zone de Chokehold (2004)",
    "universe": "AVP",
    "originMedia": "Aliens vs. Predator: Chokehold (2004)",
    "sourceMedia": "Aliens vs. Predator: Chokehold (2004)",
    "sourceType": "COMIC",
    "releaseYear": 2004,
    "year": 2004,
    "biomeId": "stargazer_blacksite",
    "biome": "SPACE_HULK_DOCK",
    "recommendedBiomeLabel": "Station Orbitale Chokehold — Soutes de Fret Quarantaine (2004)",
    "weather": "Atmosphère confinée viciée, sifflement des conduits de ventilation et apesanteur partielle",
    "lighting": "Lumière d'urgence stroboscopique ambrée et projecteurs de manutention industriels",
    "verticality": "MOYENNE (Conteneurs de fret empilés sur 4 niveaux, ponts roulants et coursives)",
    "destructibility": "Conteneurs pressurisés perforables, verrous magnétiques de portes et grilles",
    "interactables": [
      "Pont roulant motorisé déplaçable pour écraser des cibles au sol",
      "Sas de confinement de décharge d'urgence vers le vide spatial",
      "Système de mousse d'extinction incendiaire aveuglant les senseurs"
    ],
    "environmentSummary": "Labyrinthe de conteneurs de fret scellés au cœur d'une station spatiale de quarantaine où mercenaires, xénomorphes et chasseurs d'honneur s'affrontent au corps à corps.",
    "description": "Labyrinthe de conteneurs de fret scellés au cœur d'une station spatiale de quarantaine où mercenaires, xénomorphes et chasseurs d'honneur s'affrontent au corps à corps.",
    "tacticalNotes": "Les angles morts entre les conteneurs sont mortels ; le combat au smart-disc ricoche avec une efficacité redoutable dans les travées.",
    "dimensionsM": {
      "width": 440,
      "length": 440,
      "height": 55
    },
    "elevationRangeM": [
      0,
      55
    ],
    "tacticalSectors": [
      "Travée Centrale des Conteneurs de Fret Dangereux",
      "Poste de Surveillance Électronique Suspendu & Sas Principal",
      "Quai de Déchargement Automatisé & Chariots Magnétiques",
      "Zone de Quarantaine Biologique aux Sas Fracturés"
    ],
    "keyLandmarks": [
      "Grue de transbordement colossale bloquée en travers de la travée principale",
      "Conteneur de transport xénomorphe découpé de l'intérieur à l'acide",
      "Chariot élévateur de combat blindé écrasé contre un pilier porteur"
    ],
    "environmentalHazards": [
      {
        "type": "CARGO_CRUSH",
        "description": "Piles de conteneurs instables pouvant s'effondrer"
      },
      {
        "type": "VACUUM_DECOMPRESSION",
        "description": "Sas défaillants aspirant l'atmosphère vers l'espace"
      }
    ],
    "keyPreyIds": [
      "prey_super_predator_berserker"
    ],
    "heroSquadId": "squad_avp_chokehold_containment_unit",
    "villainSquadId": null
  },
  {
    "id": "map_pred_norwegian_abyssal_rig",
    "name": "Plate-forme Sous-Marine des Abysses — Mer de Norvège (1997)",
    "universe": "PREDATOR",
    "originMedia": "Predator: Hell & Hot Water (1997)",
    "sourceType": "COMIC",
    "releaseYear": 1997,
    "year": 1997,
    "biomeId": "bouvetoya_pyramid",
    "biome": "SUB_OCEANIC_CHASM",
    "recommendedBiomeLabel": "Fosse Abyssale Mer de Norvège (1997)",
    "weather": "Obscurité océanique abyssale, courants marins glacés et projecteurs submersibles",
    "lighting": "Projecteurs halogènes sous-marins et bioluminescence marine verdâtre",
    "verticality": "TRÈS HAUTE (Puits de carottage vertical de 800m, modules hyperbares étagés)",
    "destructibility": "Sas de décompression, conduites hydrauliques et grilles d'aération sous pression",
    "interactables": [
      "Sas hyperbare inondable pour expulsion d'eau à haute vitesse",
      "Treuil sous-marin lourd pour projeter des têtes de forage sur les cibles",
      "Balise sonar active aveuglant temporairement les senseurs acoustiques"
    ],
    "environmentSummary": "Station de forage sous-marine hyperbare posée sur le fond de la mer de Norvège, où un Yautja aquatique traque les scaphandriers dans le noir total.",
    "description": "Station de forage sous-marine hyperbare posée sur le fond de la mer de Norvège, où un Yautja aquatique traque les scaphandriers dans le noir total.",
    "tacticalNotes": "La pression extrême et la visibilité restreinte favorisent les attaques subaquatiques sournoises au harpon et au trident.",
    "dimensionsM": {
      "width": 520,
      "length": 520,
      "height": 75
    },
    "elevationRangeM": [
      0,
      75
    ],
    "tacticalSectors": [
      "Puits de Carottage Sous-Marin Principal",
      "Passerelles Hyperbares des Plongeurs d'Élite",
      "Sas de Compression & Baie de Submersibles",
      "Faille Abyssale Éclairée aux Halogènes"
    ],
    "keyLandmarks": [
      "Tête de forage géante suspendue au-dessus du gouffre marin",
      "Cloche de plongée profonde écrasée par une force surhumaine",
      "Réseau de tuyauteries hydrauliques fumantes fuyant de l'eau bouillante"
    ],
    "environmentalHazards": [
      {
        "type": "HIGH_PRESSURE_FLOOD",
        "description": "Rupture de verrous sous pression inondant les galeries"
      },
      {
        "type": "HYPOTHERMIC_FREEZE",
        "description": "Courants océaniques polaires à 0°C gelant les membres"
      }
    ],
    "keyPreyIds": [
      "prey_bad_blood_warlord"
    ],
    "heroSquadId": "squad_pred_norwegian_deep_divers",
    "villainSquadId": null
  },
  {
    "id": "map_pred_louisiana_bayou_swamp",
    "name": "Marais & Cyprès Chauves — Bayou de Louisiane (1998)",
    "universe": "PREDATOR",
    "originMedia": "Predator: Strange Roux (1998)",
    "sourceType": "COMIC",
    "releaseYear": 1998,
    "year": 1998,
    "biomeId": "jungle",
    "biome": "SWAMP_MANGROVE",
    "recommendedBiomeLabel": "Marécages du Bayou Cajun (1998)",
    "weather": "Brouillard d'eau tiède stagnant, pluie fine tropicale et nuées d'insectes",
    "lighting": "Rayons de lune filtrant à travers la mousse espagnole et feux follets marécageux",
    "verticality": "MOYENNE (Cyprès centenaires, cabanes sur pilotis et cours d'eau stagnants)",
    "destructibility": "Pontons de bois pourri défonçables, barques à fond plat et branchages",
    "interactables": [
      "Barque en bois dérivante pour traverser les nappes d'eau sans bruit",
      "Nid d'alligators géants pouvant être excité par un tir d'énergie",
      "Ponton vermoulu piégeable pour faire basculer l'ennemi dans la vase"
    ],
    "environmentSummary": "Dédale de marécages et d'eaux croupies en Louisiane au XIXe siècle où traqueurs cajuns et prédateur invisible s'affrontent entre racines de cyprès.",
    "description": "Dédale de marécages et d'eaux croupies en Louisiane au XIXe siècle où traqueurs cajuns et prédateur invisible s'affrontent entre racines de cyprès.",
    "tacticalNotes": "La vase ralentit la marche au sol ; les branches supérieures des cyprès permettent des déplacements rapides en camouflage.",
    "dimensionsM": {
      "width": 580,
      "length": 580,
      "height": 45
    },
    "elevationRangeM": [
      0,
      45
    ],
    "tacticalSectors": [
      "Bras Mort du Bayou aux Cyprès Centenaires",
      "Campement de Traqueurs de Peaux sur Pilotis",
      "Étang aux Alligators & Forêt Inondée",
      "Crête Marécageuse aux Saules Pleureurs"
    ],
    "keyLandmarks": [
      "Cabane en bois de cyprès sur pilotis à moitié engloutie par la vase",
      "Arbre fétiche garni de crânes de cerfs et de trophées de marais",
      "Épave de bateau à aube abandonné rouillant dans le chenal"
    ],
    "environmentalHazards": [
      {
        "type": "SWAMP_MUD_SINK",
        "description": "Vase mouvante paralysant temporairement les déplacements"
      },
      {
        "type": "ALLIGATOR_SURPRISE",
        "description": "Prédateurs des marais tapis sous les lentilles d'eau"
      }
    ],
    "keyPreyIds": [
      "prey_jungle_hunter_1987"
    ],
    "heroSquadId": "squad_pred_louisiana_bayou_trappers",
    "villainSquadId": null
  },
  {
    "id": "map_alien_synsound_soundstage_ny",
    "name": "Studios d'Enregistrement Bio-Sonique Synsound — Manhattan (1996)",
    "universe": "ALIEN",
    "originMedia": "Aliens: Music of the Spears (1996)",
    "sourceType": "NOVEL",
    "releaseYear": 1996,
    "year": 1996,
    "biomeId": "stargazer_blacksite",
    "biome": "URBAN_LABORATORY",
    "recommendedBiomeLabel": "Complexe Acoustique Synsound (1996)",
    "weather": "Atmosphère climatisée stérile, échos amplifiés et réverbération sonore anormale",
    "lighting": "Éclairages de scène néon magenta et panneaux acoustiques rétroéclairés ambre",
    "verticality": "MOYENNE (Régies suspendues, passerelles de mixage et chambres anéchoïques)",
    "destructibility": "Panneaux insonorisants déchirables, baies vitrées de monitoring et baffles",
    "interactables": [
      "Console de mixage géante capable d'émettre un larsen assourdissant à 140dB",
      "Chambre anéchoïque étanche isolant tout bruit pour embuscade réflexe",
      "Projecteurs de poursuite stroboscopiques pour aveugler les xénomorphes"
    ],
    "environmentSummary": "Centre de production musicale cybernétique ultra-sécurisé où un compositeur dément a enfermé des xénomorphes pour enregistrer leurs râles d'agonie.",
    "description": "Centre de production musicale cybernétique ultra-sécurisé où un compositeur dément a enfermé des xénomorphes pour enregistrer leurs râles d'agonie.",
    "tacticalNotes": "La dispersion acoustique perturbe le repérage auditif ; exploitez les consoles et résonateurs pour déstabiliser les créatures.",
    "dimensionsM": {
      "width": 480,
      "length": 480,
      "height": 40
    },
    "elevationRangeM": [
      0,
      40
    ],
    "tacticalSectors": [
      "Studio Principal de Captation aux Murs Insonorisés",
      "Régie Haute de Monitoring & Banques de Synthèse",
      "Couloir des Cellules Capitonnées de Confinement",
      "Auditorium de Démonstration Acoustique Synsound"
    ],
    "keyLandmarks": [
      "Orgue synthétiseur colossal trônant au centre du studio principal",
      "Cage de verre blindée où le premier guerrier xénomorphe a été enregistré",
      "Mur d'amplificateurs muraux surpuissants fissurés par les ultrasons"
    ],
    "environmentalHazards": [
      {
        "type": "SONIC_FEEDBACK",
        "description": "Décharges acoustiques violentes causant désorientation et étourdissement"
      },
      {
        "type": "NEON_SHORT_CIRCUIT",
        "description": "Fils haute tension dénudés électrifiant les consoles métalliques"
      }
    ],
    "keyPreyIds": [
      "prey_xeno_warrior"
    ],
    "heroSquadId": "squad_alien_synsound_security_forces",
    "villainSquadId": null
  },
  {
    "id": "map_alien_space_elevator_shaft",
    "name": "Puits de l'Ascenseur Spatial Géant — Station Apex (2011)",
    "universe": "ALIEN",
    "originMedia": "Aliens: Fast Track to Heaven (2011)",
    "sourceType": "COMIC",
    "releaseYear": 2011,
    "year": 2011,
    "biomeId": "stargazer_blacksite",
    "biome": "SPACE_ELEVATOR_CORE",
    "recommendedBiomeLabel": "Gaine Ascenseur Géostationnaire (2011)",
    "weather": "Dépressurisation progressive, vide spatial partiel et vents verticaux violents",
    "lighting": "Éclairage d'urgence rouge tournoyant et étoiles perçant les brèches de coque",
    "verticality": "EXTRÊME (Nacelle suspendue sur 100 000 km de câble orbital vertical)",
    "destructibility": "Sas de maintenance, câbles de stabilisation et plaques de blindage thermique",
    "interactables": [
      "Frein magnétique d'urgence pour freiner brutalement la nacelle en chute",
      "Sas de décharge atmosphérique pour balayer les intrus hors de la plateforme",
      "Palan de câble motorisé pour grimper rapidement vers le toit de la nacelle"
    ],
    "environmentSummary": "Nacelle pressurisée géante gravissant un câble orbital vers la station Apex, attaquée par des xénomorphes grimpant le long des parois extérieures.",
    "description": "Nacelle pressurisée géante gravissant un câble orbital vers la station Apex, attaquée par des xénomorphes grimpant le long des parois extérieures.",
    "tacticalNotes": "Tout faux pas au bord de la nacelle entraîne la chute dans le vide ; l'usage d'armes à recul lourd doit être maîtrisé en micro-gravité.",
    "dimensionsM": {
      "width": 380,
      "length": 380,
      "height": 120
    },
    "elevationRangeM": [
      0,
      120
    ],
    "tacticalSectors": [
      "Toit Extérieur de la Nacelle & Ancrage des Câbles",
      "Compartiment des Passagers aux Sas Défoncés",
      "Salle des Moteurs Magnétiques & Générateurs Linéaires",
      "Plateforme d'Évacuation de Queue au-dessus du Vide"
    ],
    "keyLandmarks": [
      "Quatre câbles en nanotubes de carbone géants traversant le centre de la structure",
      "Capsule de sauvetage écrasée contre le montant de freinage magnétique",
      "Brèche béante dans la paroi extérieure aspirant les débris vers l'orbite"
    ],
    "environmentalHazards": [
      {
        "type": "VACUUM_EXPOSURE",
        "description": "Décompression explosive à proximité des brèches de coque"
      },
      {
        "type": "KINETIC_SHEAR",
        "description": "Frottement hypersonique le long des câbles de tension orbitaux"
      }
    ],
    "keyPreyIds": [
      "prey_xeno_praetorian_royal"
    ],
    "heroSquadId": "squad_alien_fast_track_maintenance_rig",
    "villainSquadId": null
  },
  {
    "id": "map_avp_pantha_canopy_jungle",
    "name": "Canopée Arboricole Stratifiée — Jungle de Pantha (2000)",
    "universe": "AVP",
    "originMedia": "Aliens vs. Predator: Pantha (2000)",
    "sourceType": "COMIC",
    "releaseYear": 2000,
    "year": 2000,
    "biomeId": "jungle",
    "biome": "DEATHWORLD_CANOPY",
    "recommendedBiomeLabel": "Haute Canopée de Pantha (2000)",
    "weather": "Chaleur moite oppressante, orages magnétiques et brume de spores toxiques",
    "lighting": "Pénombre verte dense, éclairs de foudre zébrant la haute frondaison",
    "verticality": "TRÈS HAUTE (Branches charpentières géantes de 15m de large, lianes et ponts)",
    "destructibility": "Lianes suspendues tranchables, nids d'insectes arboricoles et branches mortes",
    "interactables": [
      "Liane géante pour se balancer rapidement d'un secteur d'arbre à un autre",
      "Poche de sève caustique pouvant être percée pour créer un piège corrosif",
      "Réseau de branches maîtresses pour survoler les patrouilles ennemies"
    ],
    "environmentSummary": "Monde jungle préhistorique où la végétation colossale forme un véritable sol suspendu à 80 mètres de haut, théâtre de chasses sauvages et d'embuscades félines.",
    "description": "Monde jungle préhistorique où la végétation colossale forme un véritable sol suspendu à 80 mètres de haut, théâtre de chasses sauvages et d'embuscades félines.",
    "tacticalNotes": "Le camouflage optique se fond parfaitement dans les feuilles d'arbres géantes ; attention aux attaques plongeantes des prédateurs félins.",
    "dimensionsM": {
      "width": 560,
      "length": 560,
      "height": 90
    },
    "elevationRangeM": [
      0,
      90
    ],
    "tacticalSectors": [
      "Grand Carrefour des Trois Branches Maîtresses",
      "Gouffre Végétal au-dessus du Sous-Bois Toxique",
      "Clairière Suspendue aux Épiphytes Géantes",
      "Promontoire de Guet du Clan Yautja de Pantha"
    ],
    "keyLandmarks": [
      "Arbre mère millénaire dont le tronc mesure plus de 60 mètres de circonférence",
      "Squelette d'un félin géant desséché suspendu dans des lianes de capture",
      "Ruche xénomorphe suspendue comme un frelon géant sous la frondaison"
    ],
    "environmentalHazards": [
      {
        "type": "CANOPY_FALL",
        "description": "Chute mortelle vers le sous-bois marécageux 80m plus bas"
      },
      {
        "type": "TOXIC_SPORES",
        "description": "Spores fongiques libérées lors des tirs dans les épiphytes"
      }
    ],
    "keyPreyIds": [
      "prey_young_blood_initiate"
    ],
    "heroSquadId": "squad_avp_pantha_stalker_unit",
    "villainSquadId": null
  },
  {
    "id": "map_avp_three_world_war_frontline",
    "name": "Front de Guerre Tripartite de Caparis VII — Three World War (2010)",
    "universe": "AVP",
    "originMedia": "Aliens vs. Predator: Three World War (2010)",
    "sourceType": "COMIC",
    "releaseYear": 2010,
    "year": 2010,
    "biomeId": "genna_deathworld",
    "biome": "WAR_TORN_WASTELAND",
    "recommendedBiomeLabel": "Ligne de Tranchées de Caparis VII (2010)",
    "weather": "Poussière radioactive rougeoyante, fumées de bombardement orbital et tirs de barrage",
    "lighting": "Ciel obscurci de cendres, incendies de véhicules et fusées éclairantes militaires",
    "verticality": "MOYENNE (Tranchées fortifiées, bunkers de béton blindé et carcasses de méchas)",
    "destructibility": "Sacs de sable, barbelés, épaves blindées et tourelles automatiques dévastées",
    "interactables": [
      "Tourelle automatique USCM endommagée pouvant être piratée pour tir de couverture",
      "Caisse de munitions perforantes M41A pour réarmer les armes balistiques",
      "Barbelés électrifiés pouvant être activés pour bloquer un goulet d'étranglement"
    ],
    "environmentSummary": "Champ de bataille ravagé sur Caparis VII où les forces combinées des Marines et des Yautja honnêtes affrontent la marée du Killer Clan et leurs xénomorphes asservis.",
    "description": "Champ de bataille ravagé sur Caparis VII où les forces combinées des Marines et des Yautja honnêtes affrontent la marée du Killer Clan et leurs xénomorphes asservis.",
    "tacticalNotes": "Zone de guerre totale sans pitié : tirs croisés d'armes d'assaut, d'artillerie et de canons plasma. Exploitez le réseau de tranchées pour manœuvrer.",
    "dimensionsM": {
      "width": 620,
      "length": 620,
      "height": 45
    },
    "elevationRangeM": [
      0,
      45
    ],
    "tacticalSectors": [
      "Ligne de Tranchées Principale de la Coalition USCM-Yautja",
      "Poste de Commandement Avancé de Machiko Noguchi",
      "No Man's Land Constellé de Cratères & Barbelés",
      "Bastion Fortifié du Killer Clan aux Xénos Enchaînés"
    ],
    "keyLandmarks": [
      "Blindé lourd APC écrasé sous la carcasse d'un prétorien géant calciné",
      "Totem de guerre sanglant érigé par le Killer Clan avec des masques brisés",
      "Bunker de tir en titane perforé de part en part par une charge plasma lourde"
    ],
    "environmentalHazards": [
      {
        "type": "ORBITAL_SHRAPNEL",
        "description": "Éclats d'artillerie orbitale tombant sporadiquement sur le no man's land"
      },
      {
        "type": "ACID_POOL_CRATER",
        "description": "Cratères remplis de sang acide disséquant les équipements au contact"
      }
    ],
    "keyPreyIds": [
      "prey_weyland_combat_android"
    ],
    "heroSquadId": "squad_avp_three_world_war_vanguard",
    "villainSquadId": null
  }
]);

// =========================================================================
// 2. CATALOGUE DES 28 ARMES PNJ ÉMBLEMATIQUES CANONIQUES
// =========================================================================
export const NPC_ARSENAL_CATALOG = Object.freeze([
  // --- UNIVERS ALIEN (11 Armes) ---
  {
    id: 'npc_wep_m41a_pulse_rifle',
    name: 'Armat M41A Pulse Rifle',
    universe: 'ALIEN',
    faction: 'USCM',
    originMedia: 'Aliens (1986)',
    caliber: '10×24mm Caseless Explosif + Roquettes 30mm',
    damageType: 'ballistic',
    effectiveRangeMeters: 60,
    rateOfFire: '900 cps/min (Rafales de 4)',
    wieldedBy: 'Caporal Hicks, Sergent Apone, Soldat Hudson, Soldat Vasquez',
    yautjaCounterplay: 'Activer le bouclier de poignet pour dévier les rafales ou neutraliser le tireur par bondissement en hauteur.',
    description: 'Le fusil d\'assaut légendaire standard des Marines Coloniaux doté d\'un compteur digital à DEL rouge et d\'un lance-grenades sous canon de 30mm.'
  },
  {
    id: 'npc_wep_m56_smartgun',
    name: 'M56 Smartgun gyro-stabilisé',
    universe: 'ALIEN',
    faction: 'USCM',
    originMedia: 'Aliens (1986)',
    caliber: '10×28mm Caseless Haute Vitesse',
    damageType: 'ballistic',
    effectiveRangeMeters: 90,
    rateOfFire: '1200 cps/min continu',
    wieldedBy: 'Soldat Jenette Vasquez, Soldat Mark Drake',
    yautjaCounterplay: 'Le harnais limite la mobilité latérale : esquiver par roulade et contourner par les angles morts.',
    description: 'Mitrailleuse lourde d\'escouade montée sur bras articulé asservie au casque de visée infrarouge de l\'artilleur.'
  },
  {
    id: 'npc_wep_m240_incinerator',
    name: 'M240 Incinerator Unit (Lance-Flammes)',
    universe: 'ALIEN',
    faction: 'USCM',
    originMedia: 'Aliens (1986)',
    caliber: 'Napalm gélifié sous pression',
    damageType: 'thermal',
    effectiveRangeMeters: 30,
    rateOfFire: 'Jet continu projeté',
    wieldedBy: 'Soldat Frost, Ellen Ripley',
    yautjaCounterplay: 'La chaleur intense perturbe le bio-masque thermique : reculer d\'urgence et lancer le Combi-Stick à distance.',
    description: 'Lance-flammes tactique de nettoyage de ruche saturant les couloirs étroits de flammes liquides persistantes.'
  },
  {
    id: 'npc_wep_ua_571c_sentry',
    name: 'Tourelle Sentinelle Automatique UA 571-C',
    universe: 'ALIEN',
    faction: 'USCM',
    originMedia: 'Aliens (1986)',
    caliber: '10×24mm Caseless Haute Cadence',
    damageType: 'ballistic',
    effectiveRangeMeters: 80,
    rateOfFire: '1500 cps/min asservi radar',
    wieldedBy: 'Unités de Génie USCM Hadley\'s Hope',
    yautjaCounterplay: 'Tir de canon à plasma concentré sur le trépied ou contournement en furtivité totale sous camouflage.',
    description: 'Système d\'interdiction de zone autonome scannant sur 360° et ouvrant le feu automatiquement dès détection de mouvement.'
  },
  {
    id: 'npc_wep_ithaca_shotgun',
    name: 'Ithaca Model 37 Calibre 12 à Pompe',
    universe: 'ALIEN',
    faction: 'USCM / Police',
    originMedia: 'Aliens (1986)',
    caliber: 'Calibre 12 Buckshot 00',
    damageType: 'impact',
    effectiveRangeMeters: 18,
    rateOfFire: 'Coup par coup à pompe manuelle',
    wieldedBy: 'Caporal Dwayne Hicks',
    yautjaCounterplay: 'Dévastateur à bout portant : maintenir une distance d\'au moins 5 mètres avec le Speargun.',
    description: 'Fusil à pompe à canon scié conservé par Hicks pour les rencontres rapprochées et les tirs de rupture d\'armure.'
  },
  {
    id: 'npc_wep_f44aa_pulse_rifle',
    name: 'Fusil à Impulsion F44AA à Ciblage Asservi',
    universe: 'ALIEN',
    faction: 'Mineurs Jackson / Weyland',
    originMedia: 'Alien: Romulus (2024)',
    caliber: 'Munitions sans étui asservies par gyroscope',
    damageType: 'ballistic',
    effectiveRangeMeters: 55,
    rateOfFire: '800 cps/min automatique',
    wieldedBy: 'Rain Carradine',
    yautjaCounterplay: 'L\'assistance optique verrouille les signatures : utiliser le brouilleur de camouflage ou un saut vertical pour briser le verrou.',
    description: 'Arme d\'intervention Weyland de dernière génération guidant mécaniquement la visée du tireur vers les cibles prioritaires.'
  },
  {
    id: 'npc_wep_cattle_prod_stun',
    name: 'Pique de Mineur Électrochoc Haute Tension',
    universe: 'ALIEN',
    faction: 'Colonie Jackson\'s Star',
    originMedia: 'Alien: Romulus (2024)',
    caliber: 'Décharge d\'arc électrique de 50 000 Volts',
    damageType: 'energy',
    effectiveRangeMeters: 2.2,
    rateOfFire: 'Décharges par contact',
    wieldedBy: 'Bjorn',
    yautjaCounterplay: 'Contrer immédiatement avec le Combi-Stick ou couper l\'arme avec les doubles Wrist-Blades.',
    description: 'Outil de bergerie et d\'extraction industrielle détourné en arme de corps-à-corps paralysante.'
  },
  {
    id: 'npc_wep_vp70_biohazard',
    name: 'Pistolet Mitrailleur Weyland VP-70 Biohazard',
    universe: 'ALIEN',
    faction: 'Weyland-Yutani',
    originMedia: 'Alien³ (1992)',
    caliber: '9×19mm Parabellum Perforant',
    damageType: 'ballistic',
    effectiveRangeMeters: 40,
    rateOfFire: 'Rafales de 3 coups à haute vélocité',
    wieldedBy: 'Commando Dog Catchers de Michael Bishop',
    yautjaCounterplay: 'Anticiper les rafales courtes par pas de côté et projeter le Smart Disc pour trancher l\'opérateur.',
    description: 'Arme de poing polymère avec crosse-étui transformable en pistolet mitrailleur pour les équipes de confinement biologique.'
  },
  {
    id: 'npc_wep_seegson_stun_baton',
    name: 'Bâton Électrique Industriel & Poigne Seegson',
    universe: 'ALIEN',
    faction: 'Seegson Synthetics',
    originMedia: 'Alien: Isolation (2014)',
    caliber: 'Surcharge galvanique industrielle',
    damageType: 'energy',
    effectiveRangeMeters: 1.8,
    rateOfFire: 'Coups lourds et étreinte',
    wieldedBy: 'Working Joes de Sébastopol',
    yautjaCounterplay: 'Les Working Joes sont lents : maintenir la distance et viser le crâne polymère avec le Plasmacaster.',
    description: 'Matériel de maintenance lourd utilisé par les synthétiques d\'APOLLO pour neutraliser les passagers indisciplinés.'
  },
  {
    id: 'npc_wep_thales_f90_covenant',
    name: 'Carabine Bullpup Thales F90 d\'Origae',
    universe: 'ALIEN',
    faction: 'Colons Covenant',
    originMedia: 'Alien: Covenant (2017)',
    caliber: '5.56×45mm Munitions à Pointe Creuse',
    damageType: 'ballistic',
    effectiveRangeMeters: 75,
    rateOfFire: '750 cps/min',
    wieldedBy: 'Daniels Branson, Sergent Lope',
    yautjaCounterplay: 'Tirs précis à moyenne portée : se déplacer dans la canopée et fondre sur le flanc.',
    description: 'Carabine d\'exploration légère et étanche conçue pour résister aux climats extrêmes des mondes de colonisation.'
  },
  {
    id: 'npc_wep_krampus_m42a3',
    name: 'Carabine d\'Assaut Krampus M42A3',
    universe: 'ALIEN',
    faction: 'USCM Endeavor',
    originMedia: 'Aliens: Fireteam Elite (2021)',
    caliber: '10×25mm Haute Vélocité & Viseur Holographique',
    damageType: 'ballistic',
    effectiveRangeMeters: 65,
    rateOfFire: '850 cps/min',
    wieldedBy: 'Sergent-Major Olivia Herrera',
    yautjaCounterplay: 'Le viseur thermique de l\'Endeavor repère le flou optique : masquer sa silhouette dans les fumées d\'acide.',
    description: 'Évolution moderne du fusil d\'assaut colonial intégrant une crosse ergonomique anti-recul et un canon ventilé.'
  },

  // --- UNIVERS PREDATOR (11 Armes) ---
  {
    id: 'npc_wep_minigun_ol_painless',
    name: 'GE M134 Minigun "Ol\' Painless"',
    universe: 'PREDATOR',
    faction: 'Commandos 1987',
    originMedia: 'Predator (1987)',
    caliber: '7.62×51mm OTAN à bande de 500 cartouches',
    damageType: 'ballistic',
    effectiveRangeMeters: 120,
    rateOfFire: '3000 cps/min (6 tubes rotatifs)',
    wieldedBy: 'Blain Cooper, Mac Eliot',
    yautjaCounterplay: 'Fauchage intégral de la végétation : rester impérativement à couvert derrière les troncs massifs ou frapper depuis les cimes.',
    description: 'Minigun d\'hélicoptère modifié pour être porté à deux mains avec poignée de tronçonneuse et sac à dos d\'alimentation en munitions.'
  },
  {
    id: 'npc_wep_m16a1_m203_dutch',
    name: 'Colt M16A1 avec Lance-Grenades M203',
    universe: 'PREDATOR',
    faction: 'Commandos 1987',
    originMedia: 'Predator (1987)',
    caliber: '5.56×45mm + Grenades explosives 40mm HE',
    damageType: 'ballistic',
    effectiveRangeMeters: 70,
    rateOfFire: '800 cps/min + Grenades mono-coup',
    wieldedBy: 'Major Alan "Dutch" Schaefer, Al Dillon',
    yautjaCounterplay: 'Attention aux explosions de 40mm à l\'impact : intercepter le projectile au vol ou esquiver latéralement.',
    description: 'Arme de dotation des forces spéciales avec canon fileté et lance-grenades 40mm monté sous le garde-main.'
  },
  {
    id: 'npc_wep_m60e3_lmg',
    name: 'Mitrailleuse Légère M60E3',
    universe: 'PREDATOR',
    faction: 'Commandos 1987',
    originMedia: 'Predator (1987)',
    caliber: '7.62×51mm Ceinture Désintégrable',
    damageType: 'ballistic',
    effectiveRangeMeters: 85,
    rateOfFire: '550 cps/min',
    wieldedBy: 'Mac Eliot, Ramirez',
    yautjaCounterplay: 'Rechargement lent de la bande : fondre sur le tireur dès le cliquetis de fin de chargeur.',
    description: 'Version allégée de la mitrailleuse lourde M60 avec poignée avant pour tirs de suppression soutenus en forêt.'
  },
  {
    id: 'npc_wep_desert_eagle_50ae',
    name: 'Magnum Research Desert Eagle .50 AE',
    universe: 'PREDATOR',
    faction: 'LAPD Police',
    originMedia: 'Predator 2 (1990)',
    caliber: '.50 Action Express Semi-Blindé',
    damageType: 'impact',
    effectiveRangeMeters: 35,
    rateOfFire: 'Semi-automatique puissant',
    wieldedBy: 'Lieutenant Mike Harrigan',
    yautjaCounterplay: 'Impact capable de fissurer un bio-masque : parer au bouclier de poignet avant de riposter au Combi-Stick.',
    description: 'Pistolet lourd semi-automatique chromé à recul massif infligeant des dégâts d\'arrêt cinétique monumentaux.'
  },
  {
    id: 'npc_wep_spas12_shotgun',
    name: 'Franchi SPAS-12 Tactique',
    universe: 'PREDATOR',
    faction: 'LAPD Police',
    originMedia: 'Predator 2 (1990)',
    caliber: 'Calibre 12 Slugs Perforants',
    damageType: 'impact',
    effectiveRangeMeters: 25,
    rateOfFire: 'Semi-automatique à crosse repliable',
    wieldedBy: 'Danny Archuleta, Leona Cantrell',
    yautjaCounterplay: 'Dispersion létale à courte portée : sauter au-dessus du cône de tir et neutraliser au filet.',
    description: 'Fusil de combat polyvalent utilisé par les équipes d\'assaut urbaines dans les rames de métro de Los Angeles.'
  },
  {
    id: 'npc_wep_adolini_flintlock_1715',
    name: 'Pistolet à Silex Miquelet de Raphael Adolini (1715)',
    universe: 'PREDATOR',
    faction: 'Pirates / Voyageurs 1715',
    originMedia: 'Predator 2 (1990) & Prey (2022)',
    caliber: '.50 Balle Ronde en Plomb & Poudre Noire',
    damageType: 'impact',
    effectiveRangeMeters: 20,
    rateOfFire: 'Monocoup (rechargement 15s)',
    wieldedBy: 'Raphael Adolini, Naru, Elder Greyback',
    yautjaCounterplay: 'Le tir unique produit un panache de fumée blanche trahissant instantanément la position du tireur.',
    description: 'Arme historique remise à Mike Harrigan en 1997 par l\'Elder Greyback, gravée "Raphael Adolini 1715".'
  },
  {
    id: 'npc_wep_owlf_cryo_blaster',
    name: 'Canister d\'Azote Cryogénique OWLF',
    universe: 'PREDATOR',
    faction: 'OWLF Black-Ops',
    originMedia: 'Predator 2 (1990)',
    caliber: 'Azote liquide pulvérisé à -196°C',
    damageType: 'cryo',
    effectiveRangeMeters: 15,
    rateOfFire: 'Jet continu sous haute pression',
    wieldedBy: 'Peter Keyes et l\'escouade OWLF',
    yautjaCounterplay: 'Le gel fige les articulations et révèle la silhouette : déployer immédiatement le bouclier thermique.',
    description: 'Arme expérimentale de capture projetant de l\'azote liquide pour congeler et capturer vivant le chasseur Yautja.'
  },
  {
    id: 'npc_wep_aa12_frag12',
    name: 'Fusil Automatique AA-12 avec Grenades FRAG-12',
    universe: 'PREDATOR',
    faction: 'Mercenaires Réserve 2010',
    originMedia: 'Predators (2010)',
    caliber: 'Calibre 12 FRAG-12 Munitions Explosives',
    damageType: 'explosive',
    effectiveRangeMeters: 45,
    rateOfFire: '300 cps/min automatique',
    wieldedBy: 'Royce',
    yautjaCounterplay: 'Chaque plomb explose : esquiver verticalement pour que les détonations touchent le sol sous vos pieds.',
    description: 'Fusil d\'assaut lourd à chargeur tambour projetant des cartouches explosives téléguidées à fragmentation.'
  },
  {
    id: 'npc_wep_blaser_r93_sniper',
    name: 'Fusil de Précision Blaser R93 Tactical 2',
    universe: 'PREDATOR',
    faction: 'Tireurs d\'Élite IDF',
    originMedia: 'Predators (2010)',
    caliber: '.338 Lapua Magnum Perforant',
    damageType: 'ballistic',
    effectiveRangeMeters: 200,
    rateOfFire: 'Réarmement linéaire rapide',
    wieldedBy: 'Isabelle',
    yautjaCounterplay: 'Repérer le reflet de la lunette de visée et lancer une fusée de poignet sur la cache du tireur.',
    description: 'Fusil de tireur d\'élite ultra-précis capable de transpercer les carapaces biologiques à plusieurs centaines de mètres.'
  },
  {
    id: 'npc_wep_dshk_heavy_mg',
    name: 'Mitrailleuse Lourde DShK Modifiée',
    universe: 'PREDATOR',
    faction: 'Spetsnaz Alfa 2010',
    originMedia: 'Predators (2010)',
    caliber: '12.7×108mm Anti-Blindage',
    damageType: 'ballistic',
    effectiveRangeMeters: 150,
    rateOfFire: '600 cps/min',
    wieldedBy: 'Nikolai',
    yautjaCounterplay: 'Puissance capable d\'arracher des membres : abattre le tireur par tir plasma d\'épaule avant qu\'il n\'arme.',
    description: 'Mitrailleuse lourde soviétique modifiée sans affût pour être manœuvrée au torse par un soldat colossal.'
  },
  {
    id: 'npc_wep_comanche_bow_naru',
    name: 'Arc Long en Frêne Comanche & Flèches Empoisonnées',
    universe: 'PREDATOR',
    faction: 'Nation Comanche 1719',
    originMedia: 'Prey (2022)',
    caliber: 'Flèches de bois dur à pointe de silex et venin d\'oranger des Osages',
    damageType: 'toxin',
    effectiveRangeMeters: 40,
    rateOfFire: 'Tir silencieux cadencé',
    wieldedBy: 'Naru, Taabe',
    yautjaCounterplay: 'Aucun bruit de détonation : surveiller les vibrations d\'air avec les capteurs acoustiques du biomasque.',
    description: 'Arc traditionnel silencieux enduit de décoctions florales toxiques provoquant spasmes musculaires et perte d\'équilibre.'
  },

  // --- UNIVERS ALIEN VS. PREDATOR (6 Armes) ---
  {
    id: 'npc_wep_avp_anchor_shotgun',
    name: 'Calibre 12 d\'Expédition Weyland Bouvetøya',
    universe: 'AVP',
    faction: 'Expédition Weyland 2004',
    originMedia: 'AVP: Alien vs. Predator (2004)',
    caliber: 'Calibre 12 Magnum Magnum Slugs',
    damageType: 'impact',
    effectiveRangeMeters: 30,
    rateOfFire: 'Pompe manuelle renforcée grand froid',
    wieldedBy: 'Lex Woods, Mark Verheiden',
    yautjaCounterplay: 'Parer avec le shuriken ou piéger au filet avant le chambrage de la cartouche suivante.',
    description: 'Fusils d\'assaut polaires graissés au téflon pour empêcher le gel des mécanismes par -40°C.'
  },
  {
    id: 'npc_wep_avp_ice_axe_spear',
    name: 'Piolet d\'Escalade en Acier Forgé & Lance Acide',
    universe: 'AVP',
    faction: 'Survivants de Bouvetøya',
    originMedia: 'AVP: Alien vs. Predator (2004)',
    caliber: 'Pointe tranchante en acier trempé & bouclier de tête xéno',
    damageType: 'laceration',
    effectiveRangeMeters: 2.5,
    rateOfFire: 'Coups d\'estoc et parade',
    wieldedBy: 'Lex Woods (avec Scar Predator)',
    yautjaCounterplay: 'Arme honorable acceptée en duel singulier : privilégier le combat aux Wrist-Blades loyales.',
    description: 'Piolet combiné à la queue tranchante d\'un Alien confectionné par Scar pour armer son alliée humaine Lex.'
  },
  {
    id: 'npc_wep_avpr_m4a1_national_guard',
    name: 'Colt M4A1 de la Garde Nationale de Gunnison',
    universe: 'AVP',
    faction: 'Garde Nationale US 2007',
    originMedia: 'Aliens vs. Predator: Requiem (2007)',
    caliber: '5.56×45mm Munitions M855 avec Viseur Aimpoint',
    damageType: 'ballistic',
    effectiveRangeMeters: 60,
    rateOfFire: '800 cps/min (Automatique / Rafales)',
    wieldedBy: 'Soldats de la Garde Nationale, Dallas Howard',
    yautjaCounterplay: 'Tirs de formation groupée : désorganiser l\'escouade avec une mine à plasma ou le fouet d\'épines.',
    description: 'Carabine standard déployée lors de la mise en quarantaine de Gunnison pour tenter de contenir l\'épidémie.'
  },
  {
    id: 'npc_wep_avpr_remington_hunting',
    name: 'Carabine de Chasse Remington 700 Calibre .30-06',
    universe: 'AVP',
    faction: 'Citoyens de Gunnison 2007',
    originMedia: 'Aliens vs. Predator: Requiem (2007)',
    caliber: '.30-06 Springfield Balle Expansive',
    damageType: 'ballistic',
    effectiveRangeMeters: 100,
    rateOfFire: 'Coup par coup à verrou',
    wieldedBy: 'Eddie Morales (Shérif), Citoyens armés',
    yautjaCounterplay: 'Temps de réarmement très long : éliminer le tireur pendant qu\'il recharge manuellement la culasse.',
    description: 'Carabine civile de grande chasse prise dans les armoires de l\'armurerie de Gunnison.'
  },
  {
    id: 'npc_wep_borgia_emp_rifle',
    name: 'Fusil Électromagnétique IEM Anti-Yautja Borgia',
    universe: 'AVP',
    faction: 'Syndicat Borgia 2030',
    originMedia: 'Predator: Concrete Jungle (2005)',
    caliber: 'Onde de choc IEM concentrée',
    damageType: 'disruption',
    effectiveRangeMeters: 40,
    rateOfFire: 'Impulsion toutes les 2.5 secondes',
    wieldedBy: 'Cyborgs et Troupes d\'Élite Borgia',
    yautjaCounterplay: 'L\'onde désactive immédiatement le camouflage et draine l\'énergie : esquiver par saut mural impératif.',
    description: 'Arme créée à partir de technologies Yautja volées pour désactiver les biomasques et neutraliser le cloaking.'
  },
  {
    id: 'npc_wep_ryushi_frontier_rifle',
    name: 'Fusil de Rancher Colonial Ryushi Mark IV',
    universe: 'AVP',
    faction: 'Colonie Prosperity Wells 1990',
    originMedia: 'Aliens vs. Predator (Comics Dark Horse 1990)',
    caliber: '.458 Magnum Anti-Mégafaune',
    damageType: 'impact',
    effectiveRangeMeters: 80,
    rateOfFire: 'Levier de sous-garde rapide',
    wieldedBy: 'Machiko Noguchi, Ranchers de Prosperity Wells',
    yautjaCounterplay: 'Conçu pour abattre des herbivores géants : utiliser le terrain rocheux pour approcher sans être pris pour cible.',
    description: 'Carabine lourde à levier de sous-garde utilisée pour guider et défendre les troupeaux de Rhynths colossaux.'
  },
  {
    id: 'npc_wep_uscm_m78_plasma',
    name: 'Canon d\'Assaut à Plasma Continu USCM M78',
    universe: 'ALIEN',
    faction: 'US Colonial Marines',
    originMedia: 'Aliens (Comics Dark Horse & Lore USCM)',
    caliber: 'Plasma thermique hyper-ionisé 40kW',
    damageType: 'plasma',
    effectiveRangeMeters: 65,
    rateOfFire: '280 tirs/min',
    wieldedBy: 'Artilleurs lourds d\'assaut USCM',
    yautjaCounterplay: 'Le jet de plasma fond l\'armure légère : privilégier l\'attaque plongeante par l\'arrière et les mines soniques.',
    description: 'Arme expérimentale de soutien lourd conçue pour percer les exosquelettes des Praetorians et des Reines xénomorphes.'
  },
  {
    id: 'npc_wep_dogcatcher_stun_prod',
    name: 'Aiguillon de Choc Haute Tension Weyland Dog Catcher',
    universe: 'ALIEN',
    faction: 'Dog Catchers Weyland-Yutani',
    originMedia: 'Alien³ (1992, David Fincher)',
    caliber: 'Arc électrostatique 85,000 Volts',
    damageType: 'electric',
    effectiveRangeMeters: 3,
    rateOfFire: 'Coup par coup à décharge continue',
    wieldedBy: 'Commandos d\'intervention Dog Catchers',
    yautjaCounterplay: 'Portée de contact : embrocher les commandos à la Combi-Stick avant qu\'ils ne puissent tenter la neutralisation au contact.',
    description: 'Matraque télescopique électrifiée à condensateurs survoltés destinée à immobiliser sans tuer les hôtes biologiques infectés.'
  },
  {
    id: 'npc_wep_corbelan_rivet_gun',
    name: 'Pistolet à Rivets Industriel Haute Pression Corbelan',
    universe: 'ALIEN',
    faction: 'Pilleurs du Corbelan IV',
    originMedia: 'Alien: Romulus (2024, Fede Álvarez)',
    caliber: 'Rivets d\'acier tungstène 12mm',
    damageType: 'kinetic',
    effectiveRangeMeters: 15,
    rateOfFire: '120 tirs/min',
    wieldedBy: 'Mineurs et Récupérateurs de Jackson\'s Star (Tyler, Bjorn)',
    yautjaCounterplay: 'Cadence modérée et faible pénétration d\'armure : le plastron Yautja dévie les rivets sans subir de dommage critique.',
    description: 'Outil de chaudronnerie lourde détourné en arme de défense de fortune capable d\'empaler un Facehugger en plein saut.'
  },
  {
    id: 'npc_wep_owlf_cryo_cannon',
    name: 'Lanceur Cryogénique Azote Liquide OWLF Modèle 1997',
    universe: 'PREDATOR',
    faction: 'Taskforce OWLF (Peter Keyes)',
    originMedia: 'Predator 2 (1990, Stephen Hopkins)',
    caliber: 'Azote liquide pressurisé (-196°C)',
    damageType: 'cryo',
    effectiveRangeMeters: 18,
    rateOfFire: 'Jet continu sous pression',
    wieldedBy: 'Agents spéciaux OWLF',
    yautjaCounterplay: 'Le froid gèle instantanément le circuit de camouflage : détruire les réservoirs dorsaux des agents pour déclencher une explosion cryogénique.',
    description: 'Projecteur d\'azote liquide sous haute pression développé spécialement pour forcer la rupture du camouflage optique Yautja.'
  },
  {
    id: 'npc_wep_betty_concussion_gun',
    name: 'Fusil à Impulsion Acoustique Christie (USM Auriga)',
    universe: 'ALIEN',
    faction: 'Mercenaires du Betty',
    originMedia: 'Alien: Resurrection (1997, Jean-Pierre Jeunet)',
    caliber: 'Onde de choc supersonique 140 dB',
    damageType: 'concussion',
    effectiveRangeMeters: 22,
    rateOfFire: '45 coups/min',
    wieldedBy: 'Christie, Mercenaires du Betty',
    yautjaCounterplay: 'L\'onde de choc déstabilise l\'équilibre et interrompt les sauts : verrouiller au plasmacaster à moyenne distance.',
    description: 'Arme de poing double action émettant une décharge acoustique directionnelle projetant les adversaires en apesanteur.'
  },
  {
    id: 'npc_wep_machiko_hunting_bow',
    name: 'Arc Composé Télescopique à Flèches Acides (Ryushi)',
    universe: 'AVP',
    faction: 'Clan Dachande & Machiko Noguchi',
    originMedia: 'Aliens vs. Predator: War (Comics Dark Horse)',
    caliber: 'Flèches carbone à pointe imprégnée d\'acide xénomorphe',
    damageType: 'piercing_acid',
    effectiveRangeMeters: 75,
    rateOfFire: 'Tir silencieux à la corde',
    wieldedBy: 'Machiko Noguchi (Initié de Chasse)',
    yautjaCounterplay: 'Trajectoire silencieuse et mortelle : traquer les départs de flèches au masque multispectral et riposter au smart disc.',
    description: 'Arme hybride mariant la discrétion de l\'arc terrien et la toxicité du sang acide xénomorphe récupéré après le rite d\'initiation.'
  },
  {
    id: 'npc_wep_upp_ak4047_pulse',
    name: 'Fusil d\'Assaut Spatial UPP Kalachnikov AK-4047',
    universe: 'ALIEN',
    faction: 'Union des Peuples Progressistes (UPP Spetsnaz)',
    originMedia: 'Aliens: Fireteam Elite / Lore UPP',
    caliber: '7.62×39mm Caseless Perforant',
    damageType: 'ballistic',
    effectiveRangeMeters: 70,
    rateOfFire: '650 cps/min',
    wieldedBy: 'Commandos Spetsnaz Stellaires de l\'UPP',
    yautjaCounterplay: 'Calibre lourd perforant à cadence modérée : engager au corps à corps après une feinte de camouflage.',
    description: 'Fusil d\'assaut robuste standard des troupes spatiales de l\'Union des Peuples Progressistes, insensible au vide et à la corrosion.'
  },
  {
    id: 'npc_wep_uscm_m90_minigun',
    name: 'Minigun Rotatif Lourd USCM M90 Spatial',
    universe: 'ALIEN',
    faction: 'USCM',
    originMedia: 'Aliens: Colonial Marines / Dark Horse Comics',
    caliber: '10×28mm Caseless Haute Vélocité (6 tubes)',
    damageType: 'ballistic_heavy',
    effectiveRangeMeters: 85,
    rateOfFire: '3000 cps/min',
    wieldedBy: 'Artilleurs Lourds de Brèche USCM (USS Sephora)',
    yautjaCounterplay: 'Le préchauffage rotatif des canons émet un sifflement aigu : frapper à la lance Combi-Stick avant la mise en rotation.',
    description: 'Mitrailleuse multitube rotative montée sur exosquelette de soutien pour faucher des vagues entières de Guerriers Xénomorphes.'
  },
  {
    id: 'npc_wep_ahab_engineer_rifle',
    name: 'Fusil à Faisceau de Particules Mala\'kak (Arme d\'Ingénieur)',
    universe: 'AVP',
    faction: 'Ingénieurs Mala\'kak & Clan d\'Ahab',
    originMedia: 'Alien vs. Predator: Fire and Stone (2014)',
    caliber: 'Faisceau d\'Énergie Noire Subatomique',
    damageType: 'plasma_heavy',
    effectiveRangeMeters: 120,
    rateOfFire: 'Décharge pulsée à haute densité',
    wieldedBy: 'Ingénieur Survivant de LV-223, Vétéran Ahab',
    yautjaCounterplay: 'Aucune armure ne résiste à un impact direct : utiliser la mobilité latérale maximale et les piliers monolithiques comme couvert.',
    description: 'Relique biomécanique surpuissante des Ingénieurs conquise par l\'Ancien borgne Ahab lors de sa croisade sur LV-223.'
  },
  {
    id: 'npc_wep_weyland_railgun_sniper',
    name: 'Fusil Railgun Électromagnétique Weyland-Yutani VP78-R',
    universe: 'AVP',
    faction: 'Weyland-Yutani Black Ops & Androïdes de Combat',
    originMedia: 'Aliens vs. Predator (2010 — BG-386)',
    caliber: 'Fléchette Tungstène Hypersonique Mach 7',
    damageType: 'kinetic_piercing',
    effectiveRangeMeters: 150,
    rateOfFire: 'Tir unique à condensateur magnétique',
    wieldedBy: 'Snipers d\'Élite Weyland & Synthétiques de Sécurité BG-386',
    yautjaCounterplay: 'Repérer la lueur bleue de charge du railgun en vision électromagnétique et interrompre le tireur au disque intelligent.',
    description: 'Arme de précision à accélération magnétique capable de traverser les parois métalliques et les carapaces de Prétoriens.'
  },
  {
    id: 'npc_wep_nakai_navajo_carbine',
    name: 'Carabine de Traque Custom .338 Lapua d\'Enoch Nakai',
    universe: 'PREDATOR',
    faction: 'Collectif Predator Hunters',
    originMedia: 'Predator: Hunters (Dark Horse 2017)',
    caliber: '.338 Lapua Magnum à Pointe Tungstène',
    damageType: 'ballistic_piercing',
    effectiveRangeMeters: 140,
    rateOfFire: 'Verrou tactique haute précision',
    wieldedBy: 'Enoch Nakai, Jaya Soames',
    yautjaCounterplay: 'Nakai connaît les rituels Yautja et vise le biomasque : ne jamais rester immobile en surplomb.',
    description: 'Carabine de précision modifiée par le vétéran Navajo Enoch Nakai spécifiquement pour briser les lentilles de biomasque Yautja.'
  },
  {
    id: 'npc_wep_borgia_plasma_katana',
    name: 'Sabre Cyber-Plasma Haute Fréquence des Exécuteurs Borgia',
    universe: 'PREDATOR',
    faction: 'Syndicat Cybernétique Borgia Industries',
    originMedia: 'Predator: Concrete Jungle (2005)',
    caliber: 'Lame en Alliage Yautja Volé & Arc Plasma',
    damageType: 'melee_plasma',
    effectiveRangeMeters: 3,
    rateOfFire: 'Escarmouche rapide au corps à corps',
    wieldedBy: 'Gardes Prétoriens de Lucretia Borgia & Assassins Neonopolis',
    yautjaCounterplay: 'Parer avec le Glaive lourd ou les lames de poignet renforcées puis punir cette profanation technologique par décapitation.',
    description: 'Arme blanche hybride forgée illégalement par la Borgia Corporation à partir des fragments d\'équipement dérobés à Scarface en 1930.'
  },
  {
    id: 'npc_wep_dutch_cyborg_arm_cannon',
    name: 'Canon Bras Cybernétique Plasma-Vulcan du Major Dutch',
    universe: 'AVP',
    faction: 'Alliance USCM & Chasseurs San Jose',
    originMedia: 'Alien vs. Predator (Capcom Arcade 1994)',
    caliber: 'Salves de 20mm Vulcan & Impulsions Plasma',
    damageType: 'plasma_ballistic',
    effectiveRangeMeters: 85,
    rateOfFire: '1500 cps/min + Salve Plasma',
    wieldedBy: 'Major Alan « Dutch » Schaefer (Version Cyborg 1994)',
    yautjaCounterplay: 'Le recul du canon immobilise Dutch une fraction de seconde après la salve : bondir dans son angle mort.',
    description: 'Prothèse bionique lourde militaire greffée au bras droit de Dutch Schaefer, intégrant une mitrailleuse rotative et un lance-plasma.'
  },
  {
    id: 'npc_wep_kurosawa_katana_pistol',
    name: 'Katana Martiale Haute Fréquence & Pistolet de Linn Kurosawa',
    universe: 'AVP',
    faction: 'Alliance USCM & Chasseurs San Jose',
    originMedia: 'Alien vs. Predator (Capcom Arcade 1994)',
    caliber: 'Acier Plié Vibratoire & 9mm Parabellum +P+',
    damageType: 'melee_ballistic',
    effectiveRangeMeters: 25,
    rateOfFire: 'Enchaînement martial éclair & tir réflexe',
    wieldedBy: 'Lieutenante Linn Kurosawa (13e Corps USCM)',
    yautjaCounterplay: 'Kurosawa maîtrise le contre au sabre et l\'énergie Ki : imposer un duel d\'honneur à la lance Combi-Stick.',
    description: 'Sabre japonais trempé anti-acide manié avec une vitesse surhumaine par la lieutenante cyber-augmentée Linn Kurosawa.'
  },
  {
    id: 'npc_wep_usm_auriga_lacrima99',
    name: 'Fusil d\'Assaut Militaire USM Lacrima 99 à Impulsion',
    universe: 'ALIEN',
    faction: 'United Systems Military (USM Auriga)',
    originMedia: 'Alien: Resurrection (1997)',
    caliber: '9.5×40mm Munitions Électro-Thermiques',
    damageType: 'ballistic',
    effectiveRangeMeters: 65,
    rateOfFire: '800 cps/min',
    wieldedBy: 'Capitaine DiStephano, Garnison USM Auriga',
    yautjaCounterplay: 'Carcasse encombrante dans les coursives étroites : désarmer le tireur au fouet tranchant.',
    description: 'Fusil d\'assaut standard des forces armées de l\'United Systems Military au XXIVe siècle à bord de l\'USM Auriga.'
  },
  {
    id: 'npc_wep_prodigy_hybrid_arc_rifle',
    name: 'Fusil à Arc Bio-Électrique des Gardes Prodigy Corp',
    universe: 'ALIEN',
    faction: 'Prodigy Corporation (Terre 2120)',
    originMedia: 'Alien: Earth (Série FX 2025)',
    caliber: 'Décharge Capacitive Haute Fréquence 120 kV',
    damageType: 'electric_shock',
    effectiveRangeMeters: 45,
    rateOfFire: 'Impulsions semi-automatiques',
    wieldedBy: 'Escouades de Sécurité Prodigy Corp, Kirsh',
    yautjaCounterplay: 'L\'arc électrique court-circuite temporairement le camouflage : engager à longue distance au fusil-harpon.',
    description: 'Arme de neutralisation technologique développée par Prodigy Corp pour contenir les spécimens biologiques sans percer les coques.'
  },
  {
    id: 'npc_wep_cia_trent_heavy_revolver',
    name: 'Carabine Commando Colt M16A2 & .454 Casull de John Trent',
    universe: 'PREDATOR',
    faction: 'Détachement Spécial CIA (Pine Barrens)',
    originMedia: 'Predator: Bad Blood (Comics Dark Horse 1993)',
    caliber: '5.56×45mm OTAN + .454 Casull Magnum',
    damageType: 'ballistic_heavy',
    effectiveRangeMeters: 75,
    rateOfFire: 'Rafales de 3 coups & double action',
    wieldedBy: 'Agent CIA John Trent',
    yautjaCounterplay: 'Trent utilise les marais et la boue pour survivre : traquer ses empreintes acoustiques au masque.',
    description: 'Armement de survie de l\'agent spécial John Trent lors de la traque cauchemardesque du Bad Blood dans le New Jersey.'
  },
  {
    id: 'npc_wep_schaefer_ny_magnum_shotgun',
    name: 'Calibre 12 Scié Ithaca 37 & Colt Python .357 de John Schaefer',
    universe: 'PREDATOR',
    faction: 'NYPD / Détective John Schaefer (1989)',
    originMedia: 'Predator: Concrete Jungle (Comics Dark Horse 1989)',
    caliber: 'Calibre 12 Magnum 00 + .357 Magnum Hollow Point',
    damageType: 'ballistic_heavy',
    effectiveRangeMeters: 35,
    rateOfFire: 'Pompe rapide & double action',
    wieldedBy: 'Détective John Schaefer, Inspecteur Rasche',
    yautjaCounterplay: 'Schaefer connaît les tactiques Yautja de son frère Dutch : ne jamais sous-estimer ses pièges explosifs improvisés.',
    description: 'L\'armement de rue brutal du détective new-yorkais John Schaefer lors de sa guerre personnelle contre les chasseurs à Manhattan et en Sibérie.'
  },
  {
    id: 'npc_wep_killer_clan_xeno_shock_leash',
    name: 'Collier Neuro-Asservissant Xéno & Glaive Dentelé du Clan Killer',
    universe: 'PREDATOR',
    faction: 'Clan Killer (Bad Bloods Renégats)',
    originMedia: 'Predator: Hunters / AVP: Three World War (Dark Horse)',
    caliber: 'Impulsions neurales haute tension & acier dentelé empoisonné',
    damageType: 'laceration',
    effectiveRangeMeters: 15,
    rateOfFire: 'Commandement de meute & taille lourde',
    wieldedBy: 'Dompteurs Bad Blood du Clan Killer',
    yautjaCounterplay: 'Trancher ou détruire le boîtier de contrôle dorsal du Bad Blood pour que ses Xénomorphes asservis se retournent contre lui.',
    description: 'Technologie hérétique employée par le Clan Killer pour diriger des Xénomorphes captifs comme chiens d\'attaque contre les Yautja honorables.'
  },
  {
    id: 'npc_wep_marion_trimonite_plasma_cutter',
    name: 'Découpeur Thermique Minier à Arc de Trimonite (DSMO Marion)',
    universe: 'ALIEN',
    faction: 'Corporation Minière DSMO Marion (LV-178)',
    originMedia: 'Alien: Out of the Shadows (Roman Canon 2014)',
    caliber: 'Faisceau plasma industriel à focalisation magnétique 4000°C',
    damageType: 'thermal',
    effectiveRangeMeters: 18,
    rateOfFire: 'Arc de découpe continu',
    wieldedBy: 'Chris "Hoop" Hooper, Ingénieure Kasyanov',
    yautjaCounterplay: 'Le faisceau industriel perce même la Trimonite et les armures : frapper à longue portée avant d\'entrer dans le rayon de 18 mètres.',
    description: 'Outil d\'excavation lourde détourné par les mineurs survivants du DSMO Marion pour trancher les carapaces xénomorphes dans les puits de LV-178.'
  },
  {
    id: 'npc_wep_upp_ak4047_pulse_assault',
    name: 'Fusil d\'Assaut à Impulsion Soviéto-Spatial UPP AK-4047',
    universe: 'ALIEN',
    faction: 'Commandos Spatiaux de l\'UPP (Union des Peuples Progressistes)',
    originMedia: 'Alien: The Roleplaying Game (Free League 2019)',
    caliber: '7.62×40mm Sans Étui à Noyau Acier Tungstène',
    damageType: 'ballistic',
    effectiveRangeMeters: 85,
    rateOfFire: '650 cps/min (Inenrayable en vide spatial)',
    wieldedBy: 'Commandos Spatiaux UPP, Commissaire Volkov',
    yautjaCounterplay: 'Munitions lourdes perforantes à haute fiabilité : éviter les couloirs de tir frontaux et utiliser les conduits techniques.',
    description: 'Le rival robuste du M41A américain au sein des forces spatiales de l\'UPP, conçu pour fonctionner dans la boue, le gel et le vide orbital.'
  },
  {
    id: 'npc_wep_hasdrubal_m41a_mk2_paget',
    name: 'Carabine Tactique USCM M41A Mk2 de l\'USS Hasdrubal',
    universe: 'AVP',
    faction: 'Détachement USCM USS Hasdrubal (2219)',
    originMedia: 'Predator / AVP: Life and Death (Dark Horse 2016)',
    caliber: '10×24mm Caseless + Grenades Thermobaric U1',
    damageType: 'ballistic',
    effectiveRangeMeters: 70,
    rateOfFire: '900 cps/min',
    wieldedBy: 'Capitaine Julie Paget, Sergent Roth',
    yautjaCounterplay: 'Discipline de feu stricte commandée par Paget : briser la ligne avec des mines à plasma ou coopérer contre l\'essaim xénomorphe.',
    description: 'Armement réglementaire des Marines de l\'USS Hasdrubal ayant combattu aux côtés du chasseur Ahab sur Tartarus et LV-223.'
  },
  {
    id: 'npc_wep_suwa_reverse_engineered_laser',
    name: 'Canon à Faisceau Photonique Rétro-Conçu du Syndicat Suwa',
    universe: 'AVP',
    faction: 'Corporation Gideon Suwa (Tokyo 1998)',
    originMedia: 'Aliens vs. Predator: Eternal (Comics Dark Horse 1998)',
    caliber: 'Rayon laser continu alimenté par batterie Yautja copiée',
    damageType: 'energy',
    effectiveRangeMeters: 95,
    rateOfFire: 'Impulsions thermiques cadencées',
    wieldedBy: 'Gardes en Exosquelette de Gideon Suwa',
    yautjaCounterplay: 'Arme humaine sacrilège copiée sur une épave du XIVe siècle : priorité absolue du Code d\'Honneur pour destruction immédiate.',
    description: 'Arme énergétique secrète développée à Tokyo par Gideon Suwa en pillant la technologie d\'un vaisseau Yautja englouti.'
  },
  {
    id: 'npc_wep_ww2_thompson_m1a1_corsair',
    name: 'Mitraillette M1A1 Thompson & Mitrailleuse .50 Browning (1942)',
    universe: 'PREDATOR',
    faction: 'Escadrille Alliée du Pacifique (1942)',
    originMedia: 'Predator: Killer of Killers (2025)',
    caliber: '.45 ACP & .50 BMG (12.7×99mm)',
    damageType: 'ballistic',
    effectiveRangeMeters: 50,
    rateOfFire: '700 cps/min',
    wieldedBy: 'Pilotes et Marines des Îles Salomon (1942)',
    yautjaCounterplay: 'Munitions conventionnelles à faible pénétration d\'armure : encaisser au bouclier et faucher au disque.',
    description: 'Arsenal emblématique de la Seconde Guerre mondiale opposé aux chasseurs Yautja dans la jungle du Pacifique Sud.'
  },
  {
    id: 'npc_wep_nemesis_webley_service_revolver',
    name: 'Revolver d\'Officier Webley Mk I Calibre .455 & Sabre d\'Infanterie (1896)',
    universe: 'PREDATOR',
    faction: 'Scotland Yard / Capitaine Edward Soames',
    originMedia: 'Predator: Nemesis (Comics Dark Horse 1896)',
    caliber: '.455 Webley Balle de Plomb Lourd & Acier Sheffield',
    damageType: 'ballistic',
    effectiveRangeMeters: 25,
    rateOfFire: 'Double action 6 coups & estoc',
    wieldedBy: 'Capitaine Edward Soames, Inspecteur Reid',
    yautjaCounterplay: 'Portée courte mais gros calibre d\'arrêt : attaquer par le toit des wagons ou frapper au filet depuis la brume.',
    description: 'Arme de poing militaire victorienne et sabre réglementaire utilisés par le capitaine Soames pour traquer le monstre de Whitechapel.'
  },
  {
    id: 'npc_wep_south_china_sea_dragunov_sniper',
    name: 'Fusil de Sniper Dragunov SVD & Calibre 12 Saiga de la Mer de Chine',
    universe: 'PREDATOR',
    faction: 'Mercenaires des Îles Spratleys (1998)',
    originMedia: 'Predator: South China Sea (Roman Paul A. Carter 1998)',
    caliber: '7.62×54mmR Perforant + Calibre 12 Slugs',
    damageType: 'ballistic',
    effectiveRangeMeters: 140,
    rateOfFire: 'Semi-automatique cadencé',
    wieldedBy: 'Mercenaire Bear, Capitaine Tran',
    yautjaCounterplay: 'Tirs de couverture dans la mangrove : utiliser le camouflage optique et les arbres pour approcher à revers.',
    description: 'Fusil de précision et fusil à pompe de combat employés par la coalition de mercenaires acculés sur l\'atoll des Spratleys.'
  },
  {
    id: 'npc_wep_genocide_m42b_rifle_xeno_zip',
    name: 'Carabine Commando M42B & Injecteur Xeno-Zip du Cargo Grant',
    universe: 'ALIEN',
    faction: 'Corps Expéditionnaire Grant (Genocide 2190)',
    originMedia: 'Aliens: Genocide (Comics Dark Horse 1991)',
    caliber: '10×25mm Haute Vélocité & Stimulant Gelée Royale',
    damageType: 'ballistic',
    effectiveRangeMeters: 65,
    rateOfFire: '850 cps/min',
    wieldedBy: 'Daniel Grant, Soldats d\'Assaut Xeno-Zip',
    yautjaCounterplay: 'Les soldats dopés au Xeno-Zip ont des réflexes décuplés : privilégier les tirs plasma à distance ou les mines.',
    description: 'Carabine d\'assaut coloniale combinée à des auto-injecteurs de Xeno-Zip conférant une vitesse et une agressivité surhumaines.'
  },
  {
    id: 'npc_wep_cold_forge_neuro_dart_pistol',
    name: 'Pistolet à Aiguilles Neurotoxiques & Taser de la Cold Forge (RB-323)',
    universe: 'ALIEN',
    faction: 'Sécurité Clandestine Weyland-Yutani Station RB-323',
    originMedia: 'Alien: The Cold Forge (Roman Canon Alex White 2018)',
    caliber: 'Dards polymères imbibés de paralytique synthétique & Décharge 80 kV',
    damageType: 'toxin',
    effectiveRangeMeters: 30,
    rateOfFire: 'Semi-automatique silencieux',
    wieldedBy: 'Dorian Sudler, Gardes de Sécurité Station RB-323',
    yautjaCounterplay: 'Le venin de synthèse paralyse les terminaisons nerveuses : filtrer les toxines au masque et neutraliser au harpon.',
    description: 'Arme de contention intérieure conçue pour immobiliser les sujets biologiques et synthétiques sans endommager la coque pressurisée.'
  },
  {
    id: 'npc_wep_machiko_bunda_wristblades_bow',
    name: 'Lames de Poignet Cérémoniales & Arc Composite Yautja de Machiko Noguchi',
    universe: 'AVP',
    faction: 'Clan Noguchi / Survivants de Bunda (2194)',
    originMedia: 'Aliens vs. Predator: War (Comics Dark Horse 1995)',
    caliber: 'Alliage noble anti-acide & Flèches d\'airain à pointe thermique',
    damageType: 'laceration',
    effectiveRangeMeters: 45,
    rateOfFire: 'Tirs d\'arc silencieux & Enchaînements de lames doubles',
    wieldedBy: 'Machiko Noguchi (Da\'dtou-di)',
    yautjaCounterplay: 'Machiko maîtrise parfaitement le style de combat Yautja : s\'attendre à des esquives acrobatiques et à des contres au corps à corps.',
    description: 'Arsenal forgé sur mesure pour Machiko Noguchi par le maître armurier du clan de Top Knot pendant son initiation parmi les chasseurs.'
  },
  {
    id: 'npc_wep_lv1201_iron_bear_heavy_cannon',
    name: 'Canon Lourd Portatif Anti-Blindage des Mercenaires Iron Bears (LV-1201)',
    universe: 'AVP',
    faction: 'Compagnie Mercenaire Iron Bears (LV-1201)',
    originMedia: 'Aliens vs. Predator 2: Primal Hunt (Sierra / Monolith 2002)',
    caliber: 'Obus perforants 20mm Explosifs HEAP',
    damageType: 'ballistic_heavy',
    effectiveRangeMeters: 80,
    rateOfFire: 'Semi-automatique lourd à recul compensé',
    wieldedBy: 'Corporal Dunya, Mercenaires Iron Bears',
    yautjaCounterplay: 'Calibre 20mm capable de briser un bouclier frontal : se déplacer latéralement et bondir pendant le recul massif de l\'arme.',
    description: 'Canon d\'infanterie lourd surpuissant déployé par les Iron Bears pour stopper les Prétoriens et démanteler les défenses extraterrestres.'
  },
  {
    id: 'npc_wep_andolini_1718_flintlock_cutlass',
    name: 'Pistolet à Silex d\'Or Raphael Andolini 1718 & Sabre d\'Abordage',
    universe: 'PREDATOR',
    faction: 'Équipage Pirate Raphael Andolini (1718)',
    originMedia: 'Predator: 1718 (Comics Dark Horse 1996)',
    caliber: '.62 Balle de Plomb Brut & Acier Damas d\'Abordage',
    damageType: 'ballistic',
    effectiveRangeMeters: 20,
    rateOfFire: 'Coup par coup à silex & Taille de lame',
    wieldedBy: 'Capitaine Raphael Andolini, Maître Perez',
    yautjaCounterplay: 'Rechargement lent à poudre : esquiver le tir unique et achever au combistick avant le corps à corps.',
    description: 'Pistolet à silex gravé légendaire offert à l\'Ancien Greyback en signe d\'adieu et d\'honneur mutuel.'
  },
  {
    id: 'npc_wep_alaska_4570_marlin_bear_rifle',
    name: 'Carabine de Chasse Marlin .45-70 Guide Gun & Harpon Boréal',
    universe: 'PREDATOR',
    faction: 'Rangers de l\'Alaska Wilderness (1997)',
    originMedia: 'Predator: Primal (Comics Dark Horse 1997)',
    caliber: '.45-70 Government 405 grains & Pointe Acier',
    damageType: 'ballistic_heavy',
    effectiveRangeMeters: 85,
    rateOfFire: 'Levier de sous-garde rapide',
    wieldedBy: 'Ranger en Chef MacCallister, Pisteur Nanook',
    yautjaCounterplay: 'Calibre à très fort pouvoir d\'arrêt contre les ours : contourner à couvert dans les sapins et frapper par le haut.',
    description: 'Arme lourde de traqueur boréal capable d\'abattre un grand prédateur à bout portant.'
  },
  {
    id: 'npc_wep_defiance_davis01_neural_pulse_carbine',
    name: 'Carabine Tactique M41A Mk V Allégée & Démolisseur de Davis 01',
    universe: 'ALIEN',
    faction: 'Équipe Clandestine Defiance Europa (2137)',
    originMedia: 'Aliens: Defiance (Comics Dark Horse 2016-2019)',
    caliber: '10×24mm Caseless & Charge Magnétique Sub-Sonique',
    damageType: 'ballistic',
    effectiveRangeMeters: 70,
    rateOfFire: '900 cps/min avec compensateur neural',
    wieldedBy: 'Zula Hendricks, Synthétique Davis 01',
    yautjaCounterplay: 'Davis 01 calcule les trajectoires à cadence synthétique : saturer au canon plasma pour désorienter ses processeurs.',
    description: 'Carabine d\'assaut coloniale modifiée par Davis 01 pour optimiser le tir en intérieur pressurisé.'
  },
  {
    id: 'npc_wep_spears_asylum_heavy_particle_rifle',
    name: 'Fusil à Faisceau de Particules Weyland Prototype & Aiguillon Neural',
    universe: 'ALIEN',
    faction: 'Commandement Militaire Insurgé de Spears (2192)',
    originMedia: 'Aliens: Nightmare Asylum (Comics Dark Horse 1989-1990)',
    caliber: 'Faisceau d\'Électrons Accélérés 2.5 MeV & Décharge 120 kV',
    damageType: 'plasma',
    effectiveRangeMeters: 75,
    rateOfFire: 'Rafales de particules à cycle thermique',
    wieldedBy: 'Général Thomas Spears, Colonel Alistair',
    yautjaCounterplay: 'Le faisceau de particules fait fondre le blindage frontal : utiliser le camouflage optique et lancer le smart disc.',
    description: 'Arme expérimentale de haute technologie conçue pour soumettre les castes xénomorphes par chocs de particules.'
  },
  {
    id: 'npc_wep_big_mama_trophy_combistick_spear',
    name: 'Combistick Lourd Électro-Plaqué & Fusil à Impulsion Skyliner de Big Mama',
    universe: 'AVP',
    faction: 'Clan Skyliner & Chasseresse Big Mama (2195)',
    originMedia: 'Aliens vs. Predator: Deadliest of the Species (Comics Dark Horse 1993)',
    caliber: 'Alliage noble lourd & Impulsions 10×24mm Haute Vitesse',
    damageType: 'laceration',
    effectiveRangeMeters: 50,
    rateOfFire: 'Enchaînements martiaux d\'estoc & Rafales courtes',
    wieldedBy: 'Big Mama (Chasseresse Yautja), Caryn Delacroix',
    yautjaCounterplay: 'Big Mama est une maître guerrière aguerrie : maintenir une distance prudente et user des pièges au filet.',
    description: 'Lance rituelle massive et arme de tir adaptées pour la matriarche chasseresse dans les couloirs de Skyliner.'
  },
  {
    id: 'npc_wep_three_world_war_plasma_pulse_combo',
    name: 'Combo Fusil Pulse M41A2 & Micro-Plasmacaster Intégré de Machiko',
    universe: 'AVP',
    faction: 'Coalition Machiko Noguchi / USCM Caparis VII (2198)',
    originMedia: 'Aliens vs. Predator: Three World War (Comics Dark Horse 2010)',
    caliber: '10×24mm Caseless Explosif & Décharge Plasma Portative 15 kW',
    damageType: 'ballistic_plasma',
    effectiveRangeMeters: 75,
    rateOfFire: 'Rafales hybrides asservies au bio-masque',
    wieldedBy: 'Machiko Noguchi, Sergent Sereda',
    yautjaCounterplay: 'Arme combinée terrifiante : alterner les esquives en roulade et frapper au corps à corps dès qu\'elle recharge.',
    description: 'Symbole technologique de l\'alliance tripartite, combinant la puissance cinétique des Marines et l\'énergie plasma Yautja.'
  }
,
  {
    id: 'npc_wep_xenogenesis_subzero_cryo_rifle',
    name: 'Fusil Cryogénique Sub-Zero & Pistolet Laser de Spearhead Industries (1999)',
    universe: 'PREDATOR',
    faction: 'Mercenaires Cybernétiques Spearhead (1999)',
    originMedia: 'Predator: Xenogenesis (Comics Dark Horse 1999)',
    caliber: 'Azote liquide pressurisé sous azimuts magnétiques & Rayon Laser 50W',
    damageType: 'cryo',
    effectiveRangeMeters: 60,
    rateOfFire: 'Jet continu cryogénique & Impulsions laser',
    wieldedBy: 'Capitaine Mason, Cyber-Soldats Spearhead',
    yautjaCounterplay: 'Le gel fige la mobilité et perturbe le bio-masque : briser le champ thermique et abattre le réservoir dorsal.',
    description: 'Arme technologique expérimentale conçue par Spearhead pour cryogéniser les Yautjas vivants sur le terrain.'
  },
  {
    id: 'npc_wep_blood_feud_muramasa_katana',
    name: 'Katana Cérémonial Muramasa Forgé & Shurikens Empoisonnés de Juta',
    universe: 'PREDATOR',
    faction: 'Clan Samouraï Blood Feud (1993)',
    originMedia: 'Predator: Blood Feud (Comics Dark Horse 1993)',
    caliber: 'Acier plié 1000 couches forgé maître & Poison de fugu',
    damageType: 'laceration',
    effectiveRangeMeters: 15,
    rateOfFire: 'Frappes d\'estoc fulgurantes du style Iai',
    wieldedBy: 'Maître Sabreur Aveugle Juta, Shinobi Kenji',
    yautjaCounterplay: 'Juta frappe au son et au souffle d\'air : immobiliser au lance-filet ou frapper à longue distance au combistick.',
    description: 'Sabre d\'honneur séculaire transmis de génération en génération pour trancher les prédateurs de l\'ombre.'
  },
  {
    id: 'npc_wep_berserker_max_plasma_cannon_gauntlet',
    name: 'Canon Plasma Lourd & Poing Broyeur Hydraulique de l\'Exosquelette MAX (2195)',
    universe: 'ALIEN',
    faction: 'Commando Berserker USCM (2195)',
    originMedia: 'Aliens: Berserker (Comics Dark Horse 1995)',
    caliber: 'Orbe plasma comprimé 40 kW & Vérin hydraulique titane 8 tonnes',
    damageType: 'plasma_heavy',
    effectiveRangeMeters: 55,
    rateOfFire: 'Décharges plasma lourdes à cycle thermique & Broyage',
    wieldedBy: 'Pilote Ellis (Exosquelette MAX), Marines Berserker',
    yautjaCounterplay: 'L\'exosquelette MAX est un titan de blindage : viser les servomoteurs articulés des genoux et la nuque.',
    description: 'Armement d\'assaut surpuissant monté sur le châssis mécanisé MAX pour écraser les nids de xénomorphes à bout portant.'
  },
  {
    id: 'npc_wep_jeri_synthetic_combat_shotgun',
    name: 'Fusil à Pompe Calibre 12 Automatique & Électro-Taser de Jeri le Xéno (2194)',
    universe: 'ALIEN',
    faction: 'Laboratoire Ernst / Drone Jeri (Stronghold 2194)',
    originMedia: 'Aliens: Stronghold (Comics Dark Horse 1994)',
    caliber: 'Calibre 12 Brenneke Magnum & Décharge incapacitante 100 kV',
    damageType: 'ballistic',
    effectiveRangeMeters: 35,
    rateOfFire: 'Semi-automatique à tambour 20 cartouches',
    wieldedBy: 'Jeri (Drone Xénomorphe Synthétique)',
    yautjaCounterplay: 'Jeri imite la biomécanique xéno mais tire au fusil de guerre : anticiper ses feintes et trancher son châssis.',
    description: 'Arme de prédilection de Jeri, le seul spécimen d\'aspect xénomorphe capable d\'ironie et de tirs tactiques coordonnés.'
  },
  {
    id: 'npc_wep_ryushi_vault_subsurface_seismic_laser',
    name: 'Laser Sismique de Forage Minier & Détonateurs Thermiques de Ryushi',
    universe: 'AVP',
    faction: 'Expédition Géologique & Mercenaires de Ryushi (2192)',
    originMedia: 'Aliens vs. Predator: Prey / Sand Trap (Comics Dark Horse 1994)',
    caliber: 'Faisceau continu de découpe rocheuse 800W & Charges au C4 thermite',
    damageType: 'thermal_laser',
    effectiveRangeMeters: 65,
    rateOfFire: 'Faisceau continu focalisé & Explosions sismiques',
    wieldedBy: 'Dr. Donald Perkins, Capitaine O\'Neill',
    yautjaCounterplay: 'Le laser de découpe fait fondre les carapaces minérales : esquiver latéralement et frapper en piqué.',
    description: 'Outil de prospection minière détourné pour percer les cryptes antiques sous les dunes de Ryushi.'
  },
  {
    id: 'npc_wep_lv742_extinction_hydra_launcher',
    name: 'Lanceur Hydra Multi-Plasmique d\'Épaule des Vétérans du Conseil (LV-742)',
    universe: 'AVP',
    faction: 'Armée Expéditionnaire du Conseil Yautja (LV-742 2203)',
    originMedia: 'Aliens versus Predator: Extinction (EA / Zono 2003)',
    caliber: 'Quadruple micro-projectiles plasma autoguidés à charge creuse',
    damageType: 'plasma_burst',
    effectiveRangeMeters: 90,
    rateOfFire: 'Salves de 4 projectiles convergents',
    wieldedBy: 'Maître de Guerre Ancien Yautja, Disc Masters',
    yautjaCounterplay: 'Salves autoguidées dévastatrices : briser le verrouillage au camouflage optique et contourner rapidement.',
    description: 'Artillerie d\'épaule tactique lourde déployée par les armées de Yautja Prime pour raser les ruches mutantes de LV-742.'
  }
,
  {
    id: 'weapon_dark_river_machete_flint',
    name: 'Machete d\'Ébranchage & Pièges Fluviaux d\'Amazonie (1996)',
    universe: 'PREDATOR',
    faction: 'Guérilla Amazonienne / John Schaefer (1996)',
    originMedia: 'Predator: Dark River (Dark Horse Comics 1996)',
    caliber: 'Lame d\'acier trempé 55cm & pieux en silex taillé',
    damageType: 'slashing_bleed',
    effectiveRangeMeters: 4,
    rateOfFire: 'Frappes manuelles vives & déclenchement de trappes',
    wieldedBy: 'Guérilleros d\'Amazonie, John Schaefer',
    yautjaCounterplay: 'Mêlée vive et pièges de lianes : sauter sur les perchoirs hauts et pilonner au plasmacaster.',
    description: 'Lourde machete de jungle combinée à des pièges de pieux aiguisés déployés le long du fleuve noir amazonien.'
  },
  {
    id: 'weapon_nemesis_webley_revolver',
    name: 'Revolver d\'Ordonnance Webley .455 de la Police Victorienne (1896)',
    universe: 'PREDATOR',
    faction: 'Scotland Yard / Détective Edward Soames (1896)',
    originMedia: 'Predator: Nemesis (Dark Horse Comics 1997)',
    caliber: '.455 Webley Mk II à ogive de plomb mou',
    damageType: 'kinetic_ballistic',
    effectiveRangeMeters: 35,
    rateOfFire: 'Coup par coup, barillet rotatif 6 coups',
    wieldedBy: 'Inspecteur Edward Soames, Constabulary Guard',
    yautjaCounterplay: 'Impact balistique lourd à courte portée : dévier les balles au blindage et neutraliser au shuriken.',
    description: 'Revolver militaire de gros calibre à brisure déployé par les inspecteurs de Scotland Yard dans les ruelles brumeuses de Whitechapel.'
  },
  {
    id: 'weapon_pala_tranq_dart_rifle',
    name: 'Carabine à Fléchettes Sédatives & Neurotoxine Weyland-Yutani (Pala)',
    universe: 'ALIEN',
    faction: 'Sécurité de la Station Pala / Weyland-Yutani (2021)',
    originMedia: 'Alien: Infiltrator (Titan Books 2021)',
    caliber: 'Micro-fléchettes hypodermiques à peptide neuro-inhibiteur',
    damageType: 'toxic_sedative',
    effectiveRangeMeters: 45,
    rateOfFire: 'Semi-automatique, chargeur 15 fléchettes pneumatiques',
    wieldedBy: 'Gardes de Quarantaine Pala, Équipe de Confinement Hoenikker',
    yautjaCounterplay: 'Neurotoxines paralysantes : activer le masque étanche et éliminer les tireurs à distance au canon plasma.',
    description: 'Arme de neutralisation non létale conçue pour maîtriser les sujets mutants et les spécimens infectés par le pathogène noir sans endommager les tissus.'
  },
  {
    id: 'weapon_phalanx_obsidian_spear',
    name: 'Lance de Guerre en Obsidienne & Cuir Bouilli d\'Ataegina (2020)',
    universe: 'ALIEN',
    faction: 'Guerriers de Lemnos / Phalange d\'Ataegina (2020)',
    originMedia: 'Alien: Phalanx (Titan Books 2020)',
    caliber: 'Fer de lance taillé en obsidienne volcanique pure (résistant à l\'acide)',
    damageType: 'piercing_acidproof',
    effectiveRangeMeters: 6,
    rateOfFire: 'Estocs de phalange coordonnés en mur de boucliers',
    wieldedBy: 'Hoplites d\'Ataegina, Guerriers de Lemnos',
    yautjaCounterplay: 'Mur de lances impénétrable de front : flanquer par le haut ou lancer le combistick en perforation.',
    description: 'Lances taillées dans l\'obsidienne vitreuse des volcans d\'Ataegina, totalement insensibles au sang acide des démons Ahklun.'
  },
  {
    id: 'weapon_extinction_iron_bear_gauss',
    name: 'Canon Gauss Lourd Antimatière des Mercenaires Iron Bears (LV-742)',
    universe: 'AVP',
    faction: 'Compagnie Mercenaire Iron Bears (LV-742 2203)',
    originMedia: 'Aliens versus Predator: Extinction (EA / Zono 2003)',
    caliber: 'Flechettes d\'uranium appauvri à propulsion électromagnétique 30mm',
    damageType: 'heavy_gauss_kinetic',
    effectiveRangeMeters: 110,
    rateOfFire: 'Salves magnétiques cadencées à 180 rpm',
    wieldedBy: 'Artilleurs Lourds Iron Bears, Commandos Vétérans',
    yautjaCounterplay: 'Tirs cinétiques hyper-véloces traversant les couverts légers : esquiver en zig-zag et fermer la distance.',
    description: 'Système d\'artillerie électromagnétique portable déployé par les Iron Bears pour déchirer les exo-carapaces des reines et des guerriers Yautja.'
  },
  {
    id: 'weapon_kseries_acid_tail_spurt',
    name: 'Dards Caudaux & Jets d\'Acide Sous Pression K-Series (LV-742)',
    universe: 'AVP',
    faction: 'Ruche Mutante K-Series du Dr. Kadinsky (2203)',
    originMedia: 'Aliens versus Predator: Extinction (EA / Zono 2003)',
    caliber: 'Projections d\'acide fluorosulfurique mutant & barbillons chitineux',
    damageType: 'mutant_hyper_acid',
    effectiveRangeMeters: 25,
    rateOfFire: 'Pression continue & fouettements de dard caudal',
    wieldedBy: 'Xénomorphes K-Series Drones, Spitters Génétiques',
    yautjaCounterplay: 'Acide hautement réactif rongeant le métal : maintenir une garde hermétique et incinérer au plasma.',
    description: 'Organe de projection acide muté issu des hybridations de Kadinsky, capable d\'asperger de l\'acide volatil à longue distance.'
  },
  {
    id: 'wpn_stern_biodome_tranq_lance',
    name: 'Lance Électro-Tranquillisante Haute Tension du Biodôme Stern (1998)',
    universe: 'PREDATOR',
    faction: 'Sécurité Privée du Biodôme de Tyler Stern (1998)',
    originMedia: 'Predator: Captive (Dark Horse Comics 1998)',
    sourceMedia: 'Predator: Captive (1998)',
    year: 1998,
    category: 'POLEARM_SEDATION',
    caliber: 'Dards hypodermiques d\'étorphine concentrée & arc 80 000 V',
    damageType: 'electric_sedative',
    damage: 68,
    effectiveRangeMeters: 18,
    rangeM: 18,
    rateOfFire: 'Décharge continue au contact & tir pneumatique de dard',
    fireRate: '60 cps/min (Dards) / Continu (Arc)',
    specialEffect: 'Draine l\'endurance et brouille temporairement le régulateur de camouflage optique Yautja',
    wieldedBy: 'Gardes de Confinement du Biodôme Stern, Équipe de Capture',
    yautjaCounterplay: 'Trancher la hampe isolante avec les lames de poignet ou éliminer les porteurs depuis la canopée au Smart Disc.',
    counterplay: 'Trancher la hampe isolante avec les lames de poignet ou éliminer les porteurs depuis la canopée au Smart Disc.',
    description: 'Arme d\'arrêt non-létale surdimensionnée développée par les laboratoires de Tyler Stern pour soumettre et anesthésier un Yautja adulte sans endommager sa biologie.'
  },
  {
    id: 'wpn_yellowstone_ranger_45_70_lever',
    name: 'Carabine à Levier .45-70 Government des Rangers de Yellowstone (1999)',
    universe: 'PREDATOR',
    faction: 'Service des Parcs Nationaux & Pisteurs de Yellowstone (1999)',
    originMedia: 'Predator: Homeworld (Dark Horse Comics 1999)',
    sourceMedia: 'Predator: Homeworld (1999)',
    year: 1999,
    category: 'HEAVY_LEVER_RIFLE',
    caliber: '.45-70 Government à ogive blindée lourde 405 grains',
    damageType: 'kinetic_heavy_impact',
    damage: 92,
    effectiveRangeMeters: 85,
    rangeM: 85,
    rateOfFire: 'Actionnement manuel rapide par levier de sous-garde (45 cps/min)',
    fireRate: '45 cps/min',
    specialEffect: 'Fort pouvoir d\'arrêt cinétique capable de briser les plaques d\'armure légères à moyenne portée',
    wieldedBy: 'Rangers Vétérans de Yellowstone, Guides de Haute Montagne',
    yautjaCounterplay: 'Exploiter les panaches de vapeur des geysers pour masquer sa silhouette et frapper pendant le réarmement du levier.',
    counterplay: 'Exploiter les panaches de vapeur des geysers pour masquer sa silhouette et frapper pendant le réarmement du levier.',
    description: 'Carabine de brousse robuste chambrée pour stopper les grizzlys géants des Rocheuses, utilisée en dernier recours par les rangers de Yellowstone face aux incursions Yautja.'
  },
  {
    id: 'wpn_kleist_charon_shock_baton',
    name: 'Matraque Neuro-Choc & Aiguillon de Contention de Charon (1993)',
    universe: 'ALIEN',
    faction: 'Garde Scientifique de Charon & Marines du Complexe Kleist (1993)',
    originMedia: 'Aliens: Rogue (Dark Horse Comics 1993)',
    sourceMedia: 'Aliens: Rogue (1993)',
    year: 1993,
    category: 'MELEE_NEURO_SHOCK',
    caliber: 'Impulsion bio-électrique pulsée à 150 kV & revêtement anti-acide',
    damageType: 'neuro_electric',
    damage: 74,
    effectiveRangeMeters: 3.5,
    rangeM: 3.5,
    rateOfFire: 'Impulsions nerveuses cadencées au contact',
    fireRate: '90 frappes/min',
    specialEffect: 'Paralyse les ganglions moteurs des drones xénomorphes et repousse les assaillants en mêlée',
    wieldedBy: 'Escouade de Sécurité de Charon, Gardes du Professeur Ernst Kleist',
    yautjaCounterplay: 'Ne pas s\'exposer aux barrages d\'aiguillons en couloir étroit : utiliser le lance-filet ou le canon plasma.',
    counterplay: 'Ne pas s\'exposer aux barrages d\'aiguillons en couloir étroit : utiliser le lance-filet ou le canon plasma.',
    description: 'Bâton de contention blindé en alliage au téflon anti-acide, conçu sur l\'astéroïde Charon pour canaliser les Xénomorphes captifs des laboratoires du professeur Kleist.'
  },
  {
    id: 'wpn_mayakovsky_cyber_ant_laser',
    name: 'Micro-Laser de Découpe des Cyber-Fourmis Moissonneuses de Mayakovsky (1992)',
    universe: 'ALIEN',
    faction: 'Expédition Cybernétique de Stanislaw Mayakovsky & Norbert (1992)',
    originMedia: 'Aliens: Hive (Dark Horse Comics 1992)',
    sourceMedia: 'Aliens: Hive (1992)',
    year: 1992,
    category: 'SWARM_DIRECTED_LASER',
    caliber: 'Faisceaux lasers chirurgicaux convergents à 450 nanomètres',
    damageType: 'thermal_surgical_laser',
    damage: 80,
    effectiveRangeMeters: 40,
    rangeM: 40,
    rateOfFire: 'Faisceau continu multi-émetteurs synchronisé par essaim',
    fireRate: 'Continu (Essaim synchronisé)',
    specialEffect: 'Ignore une fraction de l\'armure grâce à la focalisation thermique millimétrique de plusieurs unités cybernétiques',
    wieldedBy: 'Cyber-Fourmis Moissonneuses, Synthétique Xéno-Mimétique Norbert',
    yautjaCounterplay: 'Balayer l\'essaim robotique avec une onde de choc ou une mine à plasma pour désynchroniser leur réseau optique.',
    counterplay: 'Balayer l\'essaim robotique avec une onde de choc ou une mine à plasma pour désynchroniser leur réseau optique.',
    description: 'Système de découpe laser miniaturisé équipant les insectes robotiques de Stanislaw Mayakovsky pour trancher la résine de ruche et extraire la Gelée Royale.'
  },
  {
    id: 'wpn_gideon_lee_reverse_plasma_rifle',
    name: 'Fusil à Plasma Rétro-Conçu Type-1300 du Syndicat Gideon Lee (1998)',
    universe: 'AVP',
    faction: 'Mercenaires Cyber-Corporatistes de Gideon Lee / Suwa (1998)',
    originMedia: 'Aliens vs. Predator: Eternal (Dark Horse Comics 1998)',
    sourceMedia: 'AVP: Eternal (1998)',
    year: 1998,
    category: 'REVERSE_ENGINEERED_PLASMA',
    caliber: 'Cellules à plasma Yautja rétro-conçues à confinement magnétique instable',
    damageType: 'plasma_overcharged',
    damage: 105,
    effectiveRangeMeters: 75,
    rangeM: 75,
    rateOfFire: 'Rafales semi-automatiques de 2 orbes plasma (120 cps/min)',
    fireRate: '120 cps/min',
    specialEffect: 'Surchauffe les boucliers énergétiques et inflige des brûlures plasmiques persistantes',
    wieldedBy: 'Garde Prétorienne de Gideon Lee, Mercenaires d\'Élite de Tokyo',
    yautjaCounterplay: 'Arme hérétique volée au clan : détruire le condensateur externe par tir de précision pour provoquer une implosion.',
    counterplay: 'Arme hérétique volée au clan : détruire le condensateur externe par tir de précision pour provoquer une implosion.',
    description: 'Arme humaine illégale développée dans les laboratoires de Tokyo par rétro-ingénierie sur l\'épave d\'un vaisseau Yautja du XIVe siècle, considérée comme une abomination par les clans.'
  },
  {
    id: 'wpn_perses_security_flechette_smg',
    name: 'Pistolet-Mitrailleur à Fléchettes Perforantes du Vaisseau Perses (2014)',
    universe: 'AVP',
    faction: 'Équipage de Sécurité du Perses & Mercenaires de Galgo (2014)',
    originMedia: 'Aliens vs. Predator: Fire and Stone (Dark Horse Comics 2014)',
    sourceMedia: 'AVP: Fire and Stone (2014)',
    year: 2014,
    category: 'FLECHETTE_SMG',
    caliber: 'Micro-fléchettes sub-calibrées en carbure de tungstène 5.7×28mm',
    damageType: 'piercing_ballistic',
    damage: 78,
    effectiveRangeMeters: 50,
    rangeM: 50,
    rateOfFire: '950 cps/min en rafales contrôlées anti-dépressurisation',
    fireRate: '950 cps/min',
    specialEffect: 'Conçu pour perforer les carapaces organiques mutées sans percer les cloisons pressurisées des vaisseaux',
    wieldedBy: 'Galgo Helder, Officiers de Sécurité du Vaisseau Perses',
    yautjaCounterplay: 'La cadence élevée sature les coursives : bondir au plafond et frapper au harpon lourd d\'Ahab.',
    counterplay: 'La cadence élevée sature les coursives : bondir au plafond et frapper au harpon lourd d\'Ahab.',
    description: 'Arme de défense embarquée standard à bord du vaisseau Perses en 2219, combinant une cadence de tir furieuse et des dards stabilisés contre les créatures mutées par le pathogène noir.'
  },
  {
    id: 'wpn_nakai_desert_hunting_rifle',
    name: 'Carabine de Chasse Lourde Désertique d\'Enoch Nakai (1991)',
    universe: 'PREDATOR',
    faction: 'Garde Nationale & Éclaireurs Navajos (1991)',
    originMedia: 'Predator: Big Game (Dark Horse Comics 1991)',
    sourceMedia: 'Predator: Big Game (1991)',
    year: 1991,
    category: 'BOLT_ACTION_SNIPER',
    caliber: '.30-06 Springfield perforant chemisé acier',
    damageType: 'ballistic_piercing',
    damage: 88,
    effectiveRangeMeters: 140,
    rangeM: 140,
    rateOfFire: '45 cps/min (culasse à verrou de précision)',
    fireRate: '45 cps/min',
    specialEffect: 'Précision longue portée et munitions perforantes capables d\'ébrécher le blindage d\'un biomarque',
    wieldedBy: 'Caporal Enoch Nakai, Tireurs d\'élite de Corpse Creek',
    yautjaCounterplay: 'La culasse manuelle crée un délai de rechargement : esquiver le premier tir et fondre au combistick.',
    counterplay: 'La culasse manuelle crée un délai de rechargement : esquiver le premier tir et fondre au combistick.',
    description: 'Fusil à culasse à verrou de gros calibre modifié par Enoch Nakai pour supporter la poussière fine du désert du Nouveau-Mexique et perforer les cuirasses lourdes.'
  },
  {
    id: 'wpn_adolini_flintlock_1715',
    name: 'Pistolet à Silex de Maître d\'Armes de Raphael Adolini 1715 (1996)',
    universe: 'PREDATOR',
    faction: 'Flibustiers & Équipage Corsaire d\'Adolini (1718)',
    originMedia: 'Predator: 1718 (Dark Horse Comics 1996)',
    sourceMedia: 'Predator: 1718 (1996)',
    year: 1718,
    category: 'ANTIQUE_FLINTLOCK',
    caliber: 'Balle de plomb coulé calibre .60 à poudre noire noble',
    damageType: 'blackpowder_impact',
    damage: 110,
    effectiveRangeMeters: 25,
    rangeM: 25,
    rateOfFire: '3 cps/min (rechargement manuel au canon)',
    fireRate: '3 cps/min',
    specialEffect: 'Impact contondant massif à très courte portée gravé « Raphael Adolini 1715 » sur la platine',
    wieldedBy: 'Capitaine Raphael Adolini, Maîtres Canonniers de Guinée',
    yautjaCounterplay: 'Arme à tir unique : dévier le tir au bouclier ou avec les lames de poignet avant l\'interminable rechargement.',
    counterplay: 'Arme à tir unique : dévier le tir au bouclier ou avec les lames de poignet avant l\'interminable rechargement.',
    description: 'Le légendaire pistolet d\'arçon à silex espagnol offert par Raphael Adolini mourant au jeune Elder Greyback après leur duel commun contre les mutins.'
  },
  {
    id: 'wpn_romulus_f44aa_pulse_rifle',
    name: 'Fusil à Impulsion d\'Assaut Guidé Weyland-Yutani F44AA (2024)',
    universe: 'ALIEN',
    faction: 'Sécurité Orbitale Weyland-Yutani & Colons de Jackson\'s Star (2024)',
    originMedia: 'Alien: Romulus (20th Century Studios 2024)',
    sourceMedia: 'Alien: Romulus (2024)',
    year: 2024,
    category: 'PULSE_RIFLE',
    caliber: 'Munitions caseless 10×24mm à traçage gyroscopique',
    damageType: 'guided_ballistic',
    damage: 82,
    effectiveRangeMeters: 85,
    rangeM: 85,
    rateOfFire: '900 cps/min en mode rafale avec visée auto-compensée',
    fireRate: '900 cps/min',
    specialEffect: 'Système de ciblage assisté par micro-caméra et stabilisation gyroscopique limitant les ratés contre les cibles rapides',
    wieldedBy: 'Rain Carradine, Escouades de sécurité de la station Renaissance',
    yautjaCounterplay: 'Le système de visée dépend d\'un verrou optique : activer le camouflage actif pour briser le verrouillage électronique.',
    counterplay: 'Le système de visée dépend d\'un verrou optique : activer le camouflage actif pour briser le verrouillage électronique.',
    description: 'Version expérimentale précurseur du M41A embarquant une assistance de visée auto-stabilisée conçue pour des novices en environnement orbital pressurisé.'
  },
  {
    id: 'wpn_berserker_max_autocannon',
    name: 'Autocanon Lourd Anti-Acide d\'Exosquelette M.A.X. (1995)',
    universe: 'ALIEN',
    faction: 'Brigades Berserker d\'Éradication de Ruches (1995)',
    originMedia: 'Aliens: Berserker (Dark Horse Comics 1995)',
    sourceMedia: 'Aliens: Berserker (1995)',
    year: 1995,
    category: 'HEAVY_AUTOCANNON',
    caliber: 'Obus semi-blindés de 20mm hautement explosifs',
    damageType: 'explosive_kinetic',
    damage: 135,
    effectiveRangeMeters: 95,
    rangeM: 95,
    rateOfFire: '600 cps/min à double canon rotatif',
    fireRate: '600 cps/min',
    specialEffect: 'Déflagration cinétique capable de pulvériser les carapaces de guerriers et prétoriens xénomorphes à l\'impact',
    wieldedBy: 'Pilotes d\'Exosquelette M.A.X., Opérateur Ellis',
    yautjaCounterplay: 'Le poids de l\'autocanon réduit la vitesse de pivotement : contourner le flanc de l\'exosuit et frapper les servos articulés.',
    counterplay: 'Le poids de l\'autocanon réduit la vitesse de pivotement : contourner le flanc de l\'exosuit et frapper les servos articulés.',
    description: 'Autocanon lourd monté sur le bras droit du blindé individuel M.A.X., calibré pour broyer les vagues de xénomorphes avant qu\'ils n\'atteignent la portée de griffe.'
  },
  {
    id: 'wpn_killer_clan_tusk_acid_spitter',
    name: 'Cracheur d\'Acide à Dards du Clan Tueur (2010)',
    universe: 'AVP',
    faction: 'Renégats du Clan Tueur (Killer Clan) de Caparis VII (2010)',
    originMedia: 'Aliens vs. Predator: Three World War (Dark Horse Comics 2010)',
    sourceMedia: 'AVP: Three World War (2010)',
    year: 2010,
    category: 'BIOMECHANICAL_LAUNCHER',
    caliber: 'Poches glandulaires d\'acide xénomorphe pressurisées & dards chitineux',
    damageType: 'acid_caustic',
    damage: 92,
    effectiveRangeMeters: 45,
    rangeM: 45,
    rateOfFire: '120 jets/min en flux continu ou salves corrosives',
    fireRate: '120 jets/min',
    specialEffect: 'Jet d\'acide concentré prélevé sur les chiens xénomorphes asservis, dissolvant l\'armure de combat au fil du temps',
    wieldedBy: 'Maîtres des Bêtes du Clan Tueur, Gladiateurs Bad Blood',
    yautjaCounterplay: 'L\'acide ronge les blindages standards : utiliser une cape à réfraction thermique ou abattre le porteur à longue distance au canon plasma.',
    counterplay: 'L\'acide ronge les blindages standards : utiliser une cape à réfraction thermique ou abattre le porteur à longue distance au canon plasma.',
    description: 'Arme hérétique conçue par les Bad Bloods du Killer Clan synthétisant le sang acide de leurs chiens xénomorphes esclaves dans un lanceur portatif impie.'
  },
  {
    id: 'wpn_ryushi_ranch_harpoon_gun',
    name: 'Fusil-Harpon Hydraulique à Bétail Lourd Chigusa (1990)',
    universe: 'AVP',
    faction: 'Éleveurs & Trappeurs de la Chigusa Corporation sur Ryushi (1990)',
    originMedia: 'Aliens vs. Predator (Dark Horse Comics 1990)',
    sourceMedia: 'Aliens vs. Predator (1990)',
    year: 1990,
    category: 'HEAVY_HARPOON',
    caliber: 'Flèches d\'ancrage en titane avec câble de retenue sous tension',
    damageType: 'hydraulic_piercing',
    damage: 85,
    effectiveRangeMeters: 60,
    rangeM: 60,
    rateOfFire: '30 cps/min à réarmement pneumatique',
    fireRate: '30 cps/min',
    specialEffect: 'Empale la cible et immobilise temporairement son déplacement grâce au câble de treuil haute résistance',
    wieldedBy: 'Machiko Noguchi, Ranchers de la Chigusa Corporation',
    yautjaCounterplay: 'Sectionner immédiatement le câble d\'ancrage d\'un coup de lame de poignet avant d\'être tiré vers les tireurs.',
    counterplay: 'Sectionner immédiatement le câble d\'ancrage d\'un coup de lame de poignet avant d\'être tiré vers les tireurs.',
    description: 'Outil industriel de guidage de bétail titan lourd utilisé par les éleveurs de Rhynths, converti par Machiko pour repousser les guerriers xénomorphes à distance.'
  },
  {
    id: 'wpn_spratly_pirate_rpg7',
    name: 'Lance-Roquettes Antichar RPG-7 Modifié des Pirates Spratleys (2008)',
    universe: 'PREDATOR',
    faction: 'Pirates & Contrebandiers de la Mer de Chine Méridionale (2008)',
    originMedia: 'Predator: South China Sea (Dark Horse / Titan Books 2008)',
    sourceMedia: 'Predator: South China Sea (2008)',
    year: 2008,
    category: 'HEAVY_EXPLOSIVE',
    caliber: 'Roquettes HEAT de 85mm à charge creuse et shrapnel lourd',
    damageType: 'explosive',
    damage: 95,
    effectiveRangeMeters: 80,
    rangeM: 80,
    rateOfFire: '6 cps/min à rechargement manuel par la culasse',
    fireRate: '6 cps/min',
    specialEffect: 'Onde de choc massive pulvérisant les couverts légers et projetant la cible au sol sous un souffle déflagrant',
    wieldedBy: 'Pirates des îles Spratleys, Mercenaires de l’Atoll',
    yautjaCounterplay: 'Esquiver latéralement par un saut acrobatique dès l’allumage de la tuyère ou intercepter la roquette au canon plasma en vol.',
    counterplay: 'Esquiver latéralement par un saut acrobatique dès l’allumage de la tuyère ou intercepter la roquette au canon plasma en vol.',
    description: 'Lanceur d’origine soviétique abondamment répandu parmi les flibustiers du Pacifique, renforcé de bandes isolantes et chargé de têtes antichars dévastatrices.'
  },
  {
    id: 'wpn_bolderji_mercenary_magnum',
    name: 'Revolver Lourd .500 Magnum des Mercenaires de Bolder’ji (2006)',
    universe: 'PREDATOR',
    faction: 'Sécurité Corporatiste & Mercenaires de Castaneda sur Bolder’ji (2006)',
    originMedia: 'Predator: Forever Midnight (DH Press 2006)',
    sourceMedia: 'Predator: Forever Midnight (2006)',
    year: 2006,
    category: 'HEAVY_HANDGUN',
    caliber: 'Munitions semi-blindées .500 à pointe creuse renforcée au tungstène',
    damageType: 'kinetic_ballistic',
    damage: 70,
    effectiveRangeMeters: 45,
    rangeM: 45,
    rateOfFire: '45 cps/min en simple action',
    fireRate: '45 cps/min',
    specialEffect: 'Impact cinétique brutal brisant la garde au corps-à-corps et provoquant un étourdissement momentané',
    wieldedBy: 'Garde de sécurité Castaneda, Mercenaires de Bolder’ji',
    yautjaCounterplay: 'Parer avec les lames de poignet blindées pour dévier les ogives ou éliminer le tireur à longue distance au combistick.',
    counterplay: 'Parer avec les lames de poignet blindées pour dévier les ogives ou éliminer le tireur à longue distance au combistick.',
    description: 'Arme de poing de fort calibre portée par les chefs de corvée sur les chantiers géothermiques de Bolder’ji pour stopper net les assauts de bêtes sauvages et de prédateurs.'
  },
  {
    id: 'wpn_stronghold_jeri_disruptor',
    name: 'Émetteur Disrupteur EMP Haute Fréquence de Jeri (1994)',
    universe: 'ALIEN',
    faction: 'Laboratoires Clandestins du Dr Ernst & Synthétique Jeri (1994)',
    originMedia: 'Aliens: Stronghold (Dark Horse Comics 1994)',
    sourceMedia: 'Aliens: Stronghold (1994)',
    year: 1994,
    category: 'ENERGY_DISRUPTOR',
    caliber: 'Décharge d’impulsions électromagnétiques directionnelles modulées',
    damageType: 'emp_disruptor',
    damage: 55,
    effectiveRangeMeters: 30,
    rangeM: 30,
    rateOfFire: '60 impulsions/min',
    fireRate: '60 impulsions/min',
    specialEffect: 'Court-circuite temporairement le camouflage optique, brouille le viseur du biomasque et draine les réserves énergétiques',
    wieldedBy: 'Androïde Jeri, Unités sentinelles Maboushe',
    yautjaCounterplay: 'Basculer en vision purement acoustique ou mécanique pour ignorer le brouillage optique et engager au corps-à-corps non électrifié.',
    counterplay: 'Basculer en vision purement acoustique ou mécanique pour ignorer le brouillage optique et engager au corps-à-corps non électrifié.',
    description: 'Dispositif expérimental conçu par le Dr Ernst et dissimulé dans le thorax synthétique de Jeri pour paralyser les drones de surveillance et neutraliser les technologies hostiles.'
  },
  {
    id: 'wpn_cold_forge_taser_drone_prod',
    name: 'Pique Taser Haute Tension Industrielle RB-323 The Cold Forge (2018)',
    universe: 'ALIEN',
    faction: 'Division de Confinement Spécial Weyland-Yutani de la Station RB-323 (2018)',
    originMedia: 'Alien: The Cold Forge (Titan Books 2018)',
    sourceMedia: 'Alien: The Cold Forge (2018)',
    year: 2018,
    category: 'STUN_WEAPON',
    caliber: 'Électrodes quadruples en alliage béryllium sous 80 000 Volts pulsés',
    damageType: 'electrical_stun',
    damage: 50,
    effectiveRangeMeters: 6,
    rangeM: 6,
    rateOfFire: '120 impulsions de contact/min',
    fireRate: '120 impulsions/min',
    specialEffect: 'Tétanise la musculature, réduit drastiquement la vitesse de déplacement et interrompt les attaques de mêlée',
    wieldedBy: 'Équipes de sécurité du Dr Blue Marsalis, Gardes de la station Cold Forge',
    yautjaCounterplay: 'Maintenir la distance avec des armes d’hast et empaler les porteurs de pique avant qu’ils n’entrent à portée de contact.',
    counterplay: 'Maintenir la distance avec des armes d’hast et empaler les porteurs de pique avant qu’ils n’entrent à portée de contact.',
    description: 'Arme de contention anti-émeute et de capture biologique employée sur The Cold Forge pour maîtriser les spécimens xénomorphes sans endommager leur chitine.'
  },
  {
    id: 'wpn_duel_uss_ryushi_flamethrower',
    name: 'Lance-Flammes d’Intervention Rapprochée M240B de l’USS Ryushi (1995)',
    universe: 'AVP',
    faction: 'Détachement d’Intervention USCM de la Frégate USS Ryushi (1995)',
    originMedia: 'Aliens vs. Predator: Duel (Dark Horse Comics 1995)',
    sourceMedia: 'Aliens vs. Predator: Duel (1995)',
    year: 1995,
    category: 'INCENDIARY_HEAVY',
    caliber: 'Composé napalm gélifié pressurisé avec allumeur au phosphore',
    damageType: 'incendiary',
    damage: 80,
    effectiveRangeMeters: 25,
    rangeM: 25,
    rateOfFire: 'Jet continu pressurisé (autonomie 15 secondes)',
    fireRate: 'Jet continu',
    specialEffect: 'Enflamme la cible, inflige des brûlures thermiques continues et illumine la zone en détruisant le camouflage thermique',
    wieldedBy: 'Marines Coloniaux du détachement Ryushi',
    yautjaCounterplay: 'Cibler le réservoir pressurisé dorsal du marine avec le canon à plasma pour déclencher une explosion dévastatrice.',
    counterplay: 'Cibler le réservoir pressurisé dorsal du marine avec le canon à plasma pour déclencher une explosion dévastatrice.',
    description: 'Variante renforcée du lance-flammes réglementaire USCM employée dans les cales de l’USS Ryushi pour purger les nids et repousser les assauts du Predalien.'
  },
  {
    id: 'wpn_web_magnetic_riveter',
    name: 'Riveteuse Magnétique Industrielle Lourde de The Web (1999)',
    universe: 'AVP',
    faction: 'Monteurs Sidérurgistes & Ouvriers Miniers de The Web (1999)',
    originMedia: 'Aliens vs. Predator: The Web (Dark Horse Comics 1999)',
    sourceMedia: 'Aliens vs. Predator: The Web (1999)',
    year: 1999,
    category: 'INDUSTRIAL_KINETIC',
    caliber: 'Rivets en carbure de titane de 50mm propulsés par rail magnétique',
    damageType: 'magnetic_kinetic',
    damage: 75,
    effectiveRangeMeters: 40,
    rangeM: 40,
    rateOfFire: '90 cps/min à alimentation par bande',
    fireRate: '90 cps/min',
    specialEffect: 'Perfore les blindages métalliques et cloue temporairement la cible aux parois ou poutrelles environnantes',
    wieldedBy: 'Ouvriers du chantier spatial The Web, Monteurs d’échafaudages',
    yautjaCounterplay: 'Se déplacer verticalement le long des câbles pour esquiver la trajectoire rectiligne des rivets et trancher l’alimentation électrique.',
    counterplay: 'Se déplacer verticalement le long des câbles pour esquiver la trajectoire rectiligne des rivets et trancher l’alimentation électrique.',
    description: 'Outil d’assemblage de coques spatiales converti en arme de fortune redoutable par les sidérurgistes orbitaux pour percer les carapaces xénomorphes et Yautja.'
  },
  {
    id: 'wpn_hunters_arctic_anti_materiel_50',
    name: 'Barrett M82A1 .50 BMG Anti-Matériel d\'Altitude (2018)',
    universe: 'PREDATOR',
    faction: 'Stargazer / Hunters PMC (2018)',
    originMedia: 'Predator: Hunters II',
    sourceMedia: 'Predator: Hunters II (2018)',
    year: 2018,
    category: 'KINETIC_HEAVY_SNIPER',
    caliber: 'Munition perforante perforatrice de blindage .50 BMG (12.7x99mm)',
    damageType: 'kinetic_armor_piercing',
    damage: 95,
    effectiveRangeMeters: 180,
    rangeM: 180,
    rateOfFire: 'Semi-automatique (30 cps/min)',
    fireRate: '30 cps/min',
    specialEffect: 'Perce les protections biomécaniques et interrompt temporairement l\'occultation optique Yautja',
    wieldedBy: 'Tireurs d\'élite Stargazer et vétérans de l\'équipe Tyler Swain',
    yautjaCounterplay: 'Se dissimuler derrière des formations rocheuses épaisses et neutraliser le tireur avec le lance-harpon ou le combi-stick avant qu\'il n\'aligne sa lunette thermique.',
    counterplay: 'Se dissimuler derrière des formations rocheuses épaisses et neutraliser le tireur avec le lance-harpon ou le combi-stick avant qu\'il n\'aligne sa lunette thermique.',
    description: 'Fusil lourd anti-matériel longue portée modifié pour les conditions polaires afghanes, capable de traverser les plaques de blindage Yautja à grande distance.'
  },
  {
    id: 'wpn_narco_quad_drum_mg',
    name: 'MG42 Quad-Drum Cartel Heavy Gun (2020)',
    universe: 'PREDATOR',
    faction: 'Guatemalan Cartel Syndicate (2020)',
    originMedia: 'Predator: Hunters III',
    sourceMedia: 'Predator: Hunters III (2020)',
    year: 2020,
    category: 'KINETIC_RAPID_MACHINEGUN',
    caliber: '7.92x57mm Mauser haute vélocité à bande continue en camembert',
    damageType: 'kinetic_saturation',
    damage: 65,
    effectiveRangeMeters: 75,
    rangeM: 75,
    rateOfFire: '1200 cps/min',
    fireRate: '1200 cps/min',
    specialEffect: 'Sature la zone d\'un mur de plomb, brisant les couverts légers et désorientant la cible sous le volume de feu',
    wieldedBy: 'Artilleurs lourds du cartel guatémaltèque',
    yautjaCounterplay: 'Attendre la surchauffe du canon ou le rechargement du tambour pour bondir depuis la canopée et décapiter l\'artilleur au disque de combat.',
    counterplay: 'Attendre la surchauffe du canon ou le rechargement du tambour pour bondir depuis la canopée et décapiter l\'artilleur au disque de combat.',
    description: 'Mitrailleuse historique restaurée et surcadencée par les armuriers du cartel avec des tambours haute capacité, utilisée pour faucher les assauts dans la jungle.'
  },
  {
    id: 'wpn_berserker_max_plasma_repeater',
    name: 'M.A.X. Exo-Suit Plasma Rotary Repeater (1995)',
    universe: 'ALIEN',
    faction: 'Berserker Suicide Squad (1995)',
    originMedia: 'Aliens: Berserker',
    sourceMedia: 'Aliens: Berserker (1995)',
    year: 1995,
    category: 'PLASMA_ROTARY_CANNON',
    caliber: 'Cartouches à plasma super-chauffé focalisé par confinement magnétique',
    damageType: 'plasma_thermal',
    damage: 88,
    effectiveRangeMeters: 60,
    rangeM: 60,
    rateOfFire: '600 impulsions plasma/min',
    fireRate: '600 impulsions/min',
    specialEffect: 'Vitrie les carapaces chitineuses et inflige des brûlures de zone désintégrant l\'acide xénomorphe',
    wieldedBy: 'Pilotes condamnés de l\'exosquelette blindé M.A.X.',
    yautjaCounterplay: 'Tirer dans le réservoir de fluide de refroidissement dorsal de l\'armure avec le canon à plasma pour provoquer l\'explosion interne de la combinaison.',
    counterplay: 'Tirer dans le réservoir de fluide de refroidissement dorsal de l\'armure avec le canon à plasma pour provoquer l\'explosion interne de la combinaison.',
    description: 'Canon rotatif expérimental couplé au réacteur de l\'exosquelette M.A.X., crachant des salves denses de plasma incandescent pour nettoyer les ruches en milieu confiné.'
  },
  {
    id: 'wpn_upp_ak120_infantry_carbine',
    name: 'UPP AK-120 Kalashnikov Caseless Carbine (2022)',
    universe: 'ALIEN',
    faction: 'Union of Progressive Peoples (2022)',
    originMedia: 'Alien: Colony War',
    sourceMedia: 'Alien: Colony War (2022)',
    year: 2022,
    category: 'KINETIC_ASSAULT_CARBINE',
    caliber: 'Munition sans étui 5.45x39mm télescopée à propulseur solide',
    damageType: 'kinetic_penetrating',
    damage: 58,
    effectiveRangeMeters: 80,
    rangeM: 80,
    rateOfFire: '750 cps/min',
    fireRate: '750 cps/min',
    specialEffect: 'Fiabilité totale en milieu sous vide et poussiéreux, tirs précis en rafales courtes de trois coups',
    wieldedBy: 'Troupes de choc spatiales et commandos de l\'UPP',
    yautjaCounterplay: 'Manoeuvrer par les conduits supérieurs pour déjouer le tir croisé discipliné de l\'escouade UPP et les attaquer au corps à corps.',
    counterplay: 'Manoeuvrer par les conduits supérieurs pour déjouer le tir croisé discipliné de l\'escouade UPP et les attaquer au corps à corps.',
    description: 'Carabine d\'infanterie spatiale standard de l\'Union des Peuples Progressistes, robuste et fiable dans les pires environnements contaminés.'
  },
  {
    id: 'wpn_delacroix_harada_needle_pistol',
    name: 'Harada Cyber-Needle Flechette Pistol (1993)',
    universe: 'AVP',
    faction: 'Toyo Harada Zaibatsu (1993)',
    originMedia: 'AVP: Deadliest of the Species',
    sourceMedia: 'AVP: Deadliest of the Species (1993)',
    year: 1993,
    category: 'CYBERNETIC_FLECHETTE',
    caliber: 'Fléchettes en céramique et monofilament empoisonnées à la neurotoxine synthétique',
    damageType: 'flechette_neurotoxin',
    damage: 70,
    effectiveRangeMeters: 45,
    rangeM: 45,
    rateOfFire: 'Tir semi-automatique rapide (180 cps/min)',
    fireRate: '180 cps/min',
    specialEffect: 'Perce les interstices d\'armure et ralentit la motricité de la cible en attaquant son système nerveux',
    wieldedBy: 'Caryn Delacroix, Agents secrets du Zaibatsu Harada',
    yautjaCounterplay: 'Activer la grille de défense énergétique ou dévier les fléchettes légères avec le combi-stick avant d\'engager l\'opérateur.',
    counterplay: 'Activer la grille de défense énergétique ou dévier les fléchettes légères avec le combi-stick avant d\'engager l\'opérateur.',
    description: 'Pistolet de poing compact haut de gamme tirant des grappes de micro-fléchettes monomoléculaires conçues pour paralyser instantanément les cibles organiques.'
  },
  {
    id: 'wpn_killer_clan_blaster_carbine',
    name: 'Killer Clan Scavenged Blaster Carbine (2010)',
    universe: 'AVP',
    faction: 'Renegade Killer Clan (2010)',
    originMedia: 'AVP: Three World War',
    sourceMedia: 'AVP: Three World War (2010)',
    year: 2010,
    category: 'YAUTJA_HYBRID_BLASTER',
    caliber: 'Décharges de plasma instable alimentées par cellules énergétiques pillées',
    damageType: 'plasma_kinetic_unstable',
    damage: 82,
    effectiveRangeMeters: 65,
    rangeM: 65,
    rateOfFire: '240 impulsions instables/min',
    fireRate: '240 impulsions/min',
    specialEffect: 'Explosions de plasma chaotiques créant des éclats métalliques déchirants au point d\'impact',
    wieldedBy: 'Guerriers renégats du Killer Clan sur Caparis VII',
    yautjaCounterplay: 'Exploiter l\'instabilité de l\'arme pour la surcharger à distance avec un projectile électromagnétique du filet de combat.',
    counterplay: 'Exploiter l\'instabilité de l\'arme pour la surcharger à distance avec un projectile électromagnétique du filet de combat.',
    description: 'Carabine blaster forgée à partir de pièces d\'armement Yautja pillées et modifiées de manière sacrilège par les renégats du Killer Clan.'
  },
  {
    id: 'wpn_turnabout_winchester_magnum_338',
    name: 'Winchester Model 70 .338 Winchester Magnum',
    universe: 'PREDATOR',
    faction: 'Canadian Rangers / Ray Vance',
    originMedia: 'Predator: Turnabout (2008)',
    caliber: '.338 Win Mag (8.6x64mm)',
    damageType: 'KINETIC_BALLISTIC',
    effectiveRangeMeters: 130,
    rateOfFire: 'Coup par coup (Verrou manuel)',
    wieldedBy: 'Ray Vance & Rangers des Rocheuses',
    yautjaCounterplay: 'Saut d\'esquive latéral sur l\'écho de détonation et approche rapide par le couvert forestier.',
    description: 'Carabine de chasse au gros gibier à verrou de haute précision, équipée de mires métalliques customisées pour le tir à l\'oreille.'
  },
  {
    id: 'wpn_ww1_lee_enfield_trench_carbine',
    name: 'Short Magazine Lee-Enfield No.1 Mk III* Tranchée',
    universe: 'PREDATOR',
    faction: 'British Expeditionary Force / Somme 1916',
    originMedia: 'Predator: Blood on Two Earths (2001)',
    caliber: '.303 British (7.7x56mmR)',
    damageType: 'KINETIC_BALLISTIC',
    effectiveRangeMeters: 85,
    rateOfFire: 'Mad Minute (Jusqu\'à 25-30 coups/min au verrou)',
    wieldedBy: 'Fantassins de première ligne & vétérans des tranchées',
    yautjaCounterplay: 'Manteau thermique et camouflage actif dans les nappes de gaz pour éviter la concentration de feux de barrage.',
    description: 'Fusil réglementaire britannique robuste et rapide, muni d\'une baïonnette épée 1907 et adapté aux tirs réflexes dans la boue.'
  },
  {
    id: 'wpn_mendel_security_shock_taser',
    name: 'Seegson P-99 High-Voltage Crowd Stun Taser',
    universe: 'ALIEN',
    faction: 'Weyland-Yutani Station Mendel Security',
    originMedia: 'Alien: Blackout (2019)',
    caliber: 'Cartouches à Dard Électrifié 60kV',
    damageType: 'ENERGY_IONIC',
    effectiveRangeMeters: 18,
    rateOfFire: 'Semi-auto à rechargement rapide',
    wieldedBy: 'Agents de sécurité et techniciens de la station Mendel',
    yautjaCounterplay: 'Blindage d\'armure isolant dissipant la décharge statique et contre-attaque immédiate aux wristblades.',
    description: 'Arme de neutralisation non létale projetant deux dards reliés par fil conducteur délivrant une impulsion tétanisante incapacitante.'
  },
  {
    id: 'wpn_dark_descent_sentry_slugger',
    name: 'UA 571-C Automated Perimeter Sentry Gun Cal. 10x28mm',
    universe: 'ALIEN',
    faction: 'USCM 2nd Battalion Bravo / Otago',
    originMedia: 'Aliens: Dark Descent (2023)',
    caliber: '10x28mm Caseless Explosif & Perforant',
    damageType: 'KINETIC_BALLISTIC',
    effectiveRangeMeters: 90,
    rateOfFire: '1100 tirs/min (Mitrailleuse multitube automatisée)',
    wieldedBy: 'Opérateurs tactiques USCM et sergent Jonas Harper',
    yautjaCounterplay: 'Tir plasma à distance sur le capteur optronique frontal ou désactivation électromagnétique par shuriken IEM.',
    description: 'Tourelle sentinelle automatique trépied avec radar Doppler omnidirectionnel et balayage thermique de verrouillage à 360°.'
  },
  {
    id: 'wpn_lv742_sniper_railgun_lance',
    name: 'USCM Magnetic Rail-Lance Sniper System',
    universe: 'AVP',
    faction: 'USCM Special Snipers LV-742',
    originMedia: 'Aliens versus Predator: Extinction (2003)',
    caliber: 'Flechette Tungstène 4mm Hypersonique Mach 7',
    damageType: 'PIERCING_BALLISTIC',
    effectiveRangeMeters: 160,
    rateOfFire: '1 tir toutes les 2.8s (Condensateur haute charge)',
    wieldedBy: 'Tireurs d\'élite lourds du corps expéditionnaire de LV-742',
    yautjaCounterplay: 'Détection du sifflement de charge magnétique avant le tir et projection d\'un leurre holographique.',
    description: 'Fusil de précision hypersonique à rails magnétiques accélérant un projectile perforant capable de traverser les carapaces les plus épaisses.'
  },
  {
    id: 'wpn_bunda_top_knot_heavy_caster',
    name: 'Top-Knot Clan Dual-Resonator Shoulder Plasma Caster',
    universe: 'AVP',
    faction: 'Top-Knot Yautja Clan',
    originMedia: 'Aliens vs. Predator: War (1995)',
    caliber: 'Plasma Torique Surchauffé 120MW',
    damageType: 'ENERGY_PLASMA',
    effectiveRangeMeters: 100,
    rateOfFire: 'Double salve plasma cadencée',
    wieldedBy: 'Chefs de meute et maîtres de chasse du clan Top-Knot',
    yautjaCounterplay: 'Bouclier bouclant le flux énergétique et assaut frontal rapide lors du cycle de refroidissement.',
    description: 'Canon d\'épaule massif à double bobine d\'induction délivrant deux sphères de plasma synchronisées pour pulvériser les lignes xénomorphes.'
  },
  {
    id: 'wpn_south_china_sea_pirate_scattergun',
    name: 'Khmer Pirate Cut-Off 10-Gauge Heavy Scattergun',
    universe: 'PREDATOR',
    faction: 'South China Sea Khmer Pirates',
    originMedia: 'Predator: South China Sea (2008)',
    caliber: '10-Gauge Magnum Lead Buckshot',
    damageType: 'BALLISTIC_PELLET',
    effectiveRangeMeters: 25,
    rateOfFire: 'Coup par coup double canon',
    wieldedBy: 'Pirates et contrebandiers insulaires de la mer de Chine',
    yautjaCounterplay: 'Maintien de distance d\'engagement et parade réflexe au bouclier d\'avant-bras.',
    description: 'Fusil de calibre 10 aux canons sciés à l\'extrême, projetant une gerbe dévastatrice de chevrotine de plomb capable de déchiqueter chair et armure légère à bout portant.'
  },
  {
    id: 'wpn_civil_war_springfield_1861_musket',
    name: 'Springfield Model 1861 Rifled Musket with Triangular Bayonet',
    universe: 'PREDATOR',
    faction: 'Civil War Ozark Battalions',
    originMedia: 'Predator: Hell Come A-Walkin\' (1998)',
    caliber: '.58 Caliber Minié Ball & Black Powder',
    damageType: 'BALLISTIC_PIERCING',
    effectiveRangeMeters: 180,
    rateOfFire: 'Rechargement manuel par la bouche (3 tirs/min)',
    wieldedBy: 'Fantassins de ligne confédérés et fédéraux des Ozarks',
    yautjaCounterplay: 'Fermer la distance lors du rechargement lent de 20 secondes ou bondir sous le couvert de fumée.',
    description: 'Fusil rayé emblématique de la guerre de Sécession tirant une balle Minié en plomb expansif à haute pénétration, surmonté d\'une redoutable baïonnette triangulaire de 45cm.'
  },
  {
    id: 'wpn_sevastopol_working_joe_stun_prod',
    name: 'Seegson Synthetic Security Industrial Stun Prod',
    universe: 'ALIEN',
    faction: 'Seegson Working Joes / Apollo',
    originMedia: 'Alien: Isolation (2014)',
    caliber: 'Arc Électrostatique 50kV Continu',
    damageType: 'ELECTRO_STUN',
    effectiveRangeMeters: 3,
    rateOfFire: 'Décharge continue au contact',
    wieldedBy: 'Androïdes de sécurité industrielle Working Joes sous protocole Apollo',
    yautjaCounterplay: 'Désarticulation mécanique à distance par combi-stick ou tranchement des avant-bras synthétiques.',
    description: 'Bâton d\'intervention industrielle à électrodes de tungstène délivrant une décharge tétanisante continue conçue pour neutraliser les émeutiers humains et court-circuiter les relais de bord.'
  },
  {
    id: 'wpn_defiance_zula_carbine_rig',
    name: 'M57A2 Exoskeleton-Linked Compact Carbine',
    universe: 'ALIEN',
    faction: 'Europa Mutineers / Colonial Marines',
    originMedia: 'Aliens: Defiance (2016)',
    caliber: '10x24mm High-Explosive Caseless',
    damageType: 'BALLISTIC_EXPLOSIVE',
    effectiveRangeMeters: 85,
    rateOfFire: 'Rafales courtes 3 coups asservies au harnais',
    wieldedBy: 'Zula Hendricks et les mutins de l\'USS Europa',
    yautjaCounterplay: 'Camouflage actif pour briser le ciblage gyroscopique et contournement rapide par les angles hauts.',
    description: 'Carabine militaire compactée connectée directement au harnais biomécanique rachidien de Zula Hendricks, compensant le recul pour délivrer des groupements chirurgicaux de balles explosives.'
  },
  {
    id: 'wpn_booty_pirate_pneumatic_nailer',
    name: 'Heavy Industrial Pneumatic Hull-Riveting Spike Launcher',
    universe: 'AVP',
    faction: 'Deep-Space Smuggler Scavengers',
    originMedia: 'Aliens vs. Predator: Booty (1996)',
    caliber: 'Pointes d\'Acier Trempé 80mm sous 200 Bars',
    damageType: 'BALLISTIC_PNEUMATIC',
    effectiveRangeMeters: 35,
    rateOfFire: 'Semi-automatique pneumatique 240 CPM',
    wieldedBy: 'Ferrailleurs et pirates de l\'espace de la frégate marchande',
    yautjaCounterplay: 'Neutralisation de la bonbonne de gaz sous pression dorsale par un tir précis de plasmacaster.',
    description: 'Pistolet de rivetage de coque spatiale détourné en arme de fortune redoutable, propulsant des pieux métalliques lourds capables de perforer les cloisons sous pression et les carapaces xénomorphes.'
  },
  {
    id: 'wpn_tokyo_cyber_yakuza_katana',
    name: 'Néo-Tokyo High-Frequency Monomolecular Katana',
    universe: 'AVP',
    faction: 'Shinjuku Cyber-Yakuza Syndicate',
    originMedia: 'Aliens vs. Predator: Tokyo (1999)',
    caliber: 'Lame Alliage Titane-Carbone Vibrante HF (35 kHz)',
    damageType: 'HIGH_FREQUENCY_SLASH',
    effectiveRangeMeters: 2.2,
    rateOfFire: 'Enchaînement de passes martiales d\'escrime',
    wieldedBy: 'Maîtres de sabre cybernétisés du syndicat Mishima',
    yautjaCounterplay: 'Parade au combi-stick renforcé et contre-attaque brutale par balayage de fouet ou shuriken rotatif.',
    description: 'Katana forgé dans un alliage spatial ultra-dense dont le fil oscillant à ultra-haute fréquence désagrège la matière au niveau moléculaire, tranchant les métaux et blindages extraterrestres.'
  },
  {
    "id": "wpn_fleener_creek_remington_1100",
    "name": "Fleener Creek Remington 1100 Tactical Shotgun",
    "universe": "PREDATOR",
    "faction": "Civilian / Law Enforcement",
    "originMedia": "Predator: Kindred (1996)",
    "caliber": "Calibre 12 Magnum (Chevrotine 00 & Balles Slug)",
    "damageType": "HEAVY_BALLISTIC_SPREAD",
    "effectiveRangeMeters": 35,
    "rateOfFire": "Semi-automatique cadencé (240 coups/min)",
    "wieldedBy": "Shérif Enoch Powell et adjoints de Fleener Creek",
    "yautjaCounterplay": "Saut d'esquive vertical sur les branches et neutralisation silencieuse par tir plasma ou flèche intelligente.",
    "description": "Fusil de chasse semi-automatique fiable à canon scié tactique délivrant des gerbes de plomb dévastatrices à courte portée dans les clairières de montagne."
  },
  {
    "id": "wpn_demons_gold_mp40_smg",
    "name": "Maschinenpistole 40 Parabellum Submachine Gun",
    "universe": "PREDATOR",
    "faction": "Mercenary Remnants",
    "originMedia": "Predator: Demon's Gold (1997)",
    "caliber": "9x19mm Parabellum",
    "damageType": "BALLISTIC_RAPID",
    "effectiveRangeMeters": 55,
    "rateOfFire": "Automatique modéré (500 coups/min)",
    "wieldedBy": "Pillards nazis et fuyards du trésor en Amérique du Sud",
    "yautjaCounterplay": "Armure corporelle en duralumin et tir de riposte au combi-stick traversant les caisses en bois.",
    "description": "Pistolet-mitrailleur historique à culasse non calée et chargeur de 32 coups, maniable dans les mangroves marécageuses malgré sa vulnérabilité à la boue."
  },
  {
    "id": "wpn_female_war_heavy_incinerator",
    "name": "Armat M240-B Heavy Napalm Siege Incinerator",
    "universe": "ALIEN",
    "faction": "Colonial Veterans",
    "originMedia": "Aliens: The Female War (1990)",
    "caliber": "Gel Napalm-B Pressurisé & Oxyde d'Aluminium",
    "damageType": "THERMAL_INCENDIARY_BURST",
    "effectiveRangeMeters": 30,
    "rateOfFire": "Jet continu soutenu haute pression",
    "wieldedBy": "Billie, Wilks et l'escouade d'assaut de la Ruche Mère",
    "yautjaCounterplay": "Bouclier d'énergie thermique Yautja et élimination chirurgicale du porteur par visée canon d'épaule avant l'inflammation du réservoir.",
    "description": "Lance-flammes de siège lourd projetant un jet continu de napalm collant à plus de 1200°C, capable de calciner instantanément les parois de résine et les essaims xénomorphes."
  },
  {
    "id": "wpn_nightmare_spears_tactical_carbine",
    "name": "Spears Shock Division Subsonic Tactical Carbine",
    "universe": "ALIEN",
    "faction": "Spears Shock Division",
    "originMedia": "Aliens: Nightmare Asylum (1989)",
    "caliber": "10x24mm Sans Douille Subsonique Perforant",
    "damageType": "BALLISTIC_ARMOR_PIERCING",
    "effectiveRangeMeters": 75,
    "rateOfFire": "Rafale contrôlée de 3 coups (750 coups/min)",
    "wieldedBy": "Gardes prétoriens et instructeurs du Général Spears",
    "yautjaCounterplay": "Masque multispectral révélant les désignateurs laser et lancer de smart-disc pour sectionner les lignes de tir.",
    "description": "Carabine compacte avec silencieux intégral et munitions chemisées au tungstène, conçue pour opérer dans les coursives pressurisées sans perforer la coque de la station."
  },
  {
    "id": "wpn_requiem_morales_benelli_m4",
    "name": "Benelli M4 Super 90 Tactical Combat Shotgun",
    "universe": "AVP",
    "faction": "Gunnison Militia",
    "originMedia": "Aliens vs. Predator: Requiem (2007)",
    "caliber": "Calibre 12 Magnum Sabot Slug Acier Trempé",
    "damageType": "KINETIC_HEAVY_SLUG",
    "effectiveRangeMeters": 45,
    "rateOfFire": "Semi-automatique à emprunt de gaz (300 coups/min)",
    "wieldedBy": "Shérif Eddie Morales et survivants armés de Gunnison",
    "yautjaCounterplay": "Camouflage optique et projection de filet de capture pour neutraliser la menace cinétique sans exposer le plastron.",
    "description": "Fusil de combat tactique militaire doté du système à double piston Auto-Regulating Gas-Operated (ARGO), chambrant des cartouches magnum perforantes capables d'ébrécher la chitine xénomorphe."
  },
  {
    "id": "wpn_xenogenesis_hyperbaric_harpoon_gun",
    "name": "Xenogenesis Abyssal Supercavitating Harpoon Gun",
    "universe": "AVP",
    "faction": "Deep Trench Contractors",
    "originMedia": "Aliens vs. Predator: Xenogenesis (2002)",
    "caliber": "Fléchette Tungstène-Uranium Supercavitante 14mm",
    "damageType": "HYDRODYNAMIC_PIERCING",
    "effectiveRangeMeters": 60,
    "rateOfFire": "Coup par coup à rechargement pneumatique (25 coups/min)",
    "wieldedBy": "Plongeurs de combat en scaphandre hyperbare lourd",
    "yautjaCounterplay": "Esquive tridimensionnelle dans les colonnes d'eau et découpe au trident énergétique.",
    "description": "Arme de brèche sous-marine propulsant des fléchettes profilées créant une bulle de supercavitation pour maintenir une vélocité hypersonique sous l'eau et transpercer les carapaces abyssales."
  }
,
  {
    "id": "wpn_dark_ages_damascus_broadsword",
    "name": "Damascus Steel Crusader Broadsword",
    "universe": "PREDATOR",
    "faction": "Knights Templar Order",
    "originMedia": "Predator: Dark Ages (1348)",
    "caliber": "Lame Forgée Acier de Damas Plié 120cm",
    "damageType": "HEAVY_STEEL_SLASH",
    "effectiveRangeMeters": 2.4,
    "rateOfFire": "Enchaînement d'estocs et de tailles médiévales",
    "wieldedBy": "Chevaliers templiers et commandants de garnison féodale",
    "yautjaCounterplay": "Parade au combi-stick renforcé et contre-dégagement par projection de lames de poignet.",
    "description": "Épée bâtarde forgée à la main en acier de Damas feuilleté d'une robustesse exceptionnelle, capable de fendre les armures de mailles et d'entamer les blindages légers extraterrestres."
  },
  {
    "id": "wpn_siberia_ak47_spetsnaz_carbine",
    "name": "Kalashnikov AK-47 Sub-Zero Spetsnaz Carbine",
    "universe": "PREDATOR",
    "faction": "Soviet Spetsnaz Alpha",
    "originMedia": "Predator: Cold War - Siberia (1991)",
    "caliber": "7.62x39mm M43 Perforant Spécial Froid",
    "damageType": "BALLISTIC_RAPID_PENETRATING",
    "effectiveRangeMeters": 65,
    "rateOfFire": "Automatique cadencé (600 coups/min)",
    "wieldedBy": "Commandos parachutistes Spetsnaz d'élite en Sibérie",
    "yautjaCounterplay": "Blindage dorsal Yautja et diversion thermique par fusée plasma pour désorienter les tireurs.",
    "description": "Carabine d'assaut soviétique modifiée pour opérer sans enrayement jusqu'à -50°C, équipée d'un silencieux PBS-1 et chambrant des cartouches à noyau d'acier durci."
  },
  {
    "id": "wpn_earth_war_heavy_plasma_rifle",
    "name": "Armat M90 Heavy Siege Plasma Rifle",
    "universe": "ALIEN",
    "faction": "Earth Reclamation Marine Brigade",
    "originMedia": "Aliens: Earth War (1990)",
    "caliber": "Packs de Plasma Lourd Magnéto-Confinés 40MW",
    "damageType": "SUPERHEATED_PLASMA_DISCHARGE",
    "effectiveRangeMeters": 80,
    "rateOfFire": "Semi-automatique lourd à refroidissement forcé (90 coups/min)",
    "wieldedBy": "Troupiers de siège et vétérans de la reconquête de la Terre",
    "yautjaCounterplay": "Réflecteur d'énergie plasmique de poignet et frappe éclair au fouet avant stabilisation du tir.",
    "description": "Fusil lourd militaire de dernière ligne projetant des sphères de plasma à très haute température capables de désintégrer les prétoriens et de vaporiser les carapaces blindées."
  },
  {
    "id": "wpn_thaw_cryo_thermal_lance",
    "name": "LV-695 Core Cryo-Thermal Drilling Lance",
    "universe": "ALIEN",
    "faction": "Weyland Ice Drilling Contractors",
    "originMedia": "Alien: Thaw (2023)",
    "caliber": "Jet Thermique à Gaz Ionisé & Azote Supercritique",
    "damageType": "THERMAL_DRILL_FUSION",
    "effectiveRangeMeters": 8,
    "rateOfFire": "Flux thermique continu haute pression",
    "wieldedBy": "Ingénieurs de forage cryogénique de la lune LV-695",
    "yautjaCounterplay": "Attaque à longue portée au combi-stick ou tir de plasma pour percer le réservoir pressurisé.",
    "description": "Outil industriel lourd conçu pour forer les calottes de glace les plus dures, capable de faire fondre instantanément la roche ou la chitine xénomorphe par fusion thermique directe."
  },
  {
    "id": "wpn_lv1201_grenade_launcher_m79",
    "name": "Armat M79-A2 Multi-Round Grenade Launcher",
    "universe": "AVP",
    "faction": "Weyland Iron Guards Pod 5",
    "originMedia": "Aliens versus Predator 2 (2001)",
    "caliber": "Grenades Explosives & Phosphore 40mm",
    "damageType": "HEAVY_EXPLOSIVE_CONCUSSION",
    "effectiveRangeMeters": 70,
    "rateOfFire": "Barillet rotatif semi-automatique (6 coups, 120 coups/min)",
    "wieldedBy": "Gardes d'élite et mercenaires de sécurité sur LV-1201",
    "yautjaCounterplay": "Saut d'esquive acrobatique d'arbre en passerelle et tir plasma réflexe pour intercepter les projectiles lents en vol.",
    "description": "Lance-grenades d'appui lourd à barillet rotatif délivrant un tapis de déflagrations explosives et incendiaires dévastatrices dans les passerelles et coursives du complexe suspendu."
  },
  {
    "id": "wpn_chokehold_tactical_riot_shotgun",
    "name": "Chokehold 10-Gauge Tactical Riot Shotgun",
    "universe": "AVP",
    "faction": "Station Quarantine Enforcement",
    "originMedia": "Aliens vs. Predator: Chokehold (2004)",
    "caliber": "Calibre 10 Magnum Balle Cuirassée & Chevrotine Dense",
    "damageType": "KINETIC_SHOCK_CONCUSSION",
    "effectiveRangeMeters": 30,
    "rateOfFire": "Pompe rapide renforcée (150 coups/min)",
    "wieldedBy": "Gardiens pénitentiaires de quarantaine orbitale",
    "yautjaCounterplay": "Projection de filet de capture Yautja et camouflage optique pour contourner les angles morts des soutes.",
    "description": "Fusil à pompe lourd chambrant des cartouches de calibre 10 ultra-puissantes conçues pour stopper net les charges de créatures massives dans les travées de conteneurs."
  },
  {
    "id": "wpn_norwegian_deep_sub_diver_harpoon",
    "name": "Sub-Sea Titanium Deep-Dive Harpoon Rifle",
    "universe": "PREDATOR",
    "faction": "Norwegian Deep-Sub Recovery Unit",
    "originMedia": "Predator: Hell & Hot Water (1997)",
    "caliber": "Flèche Barbelée en Titane Pur 18mm & Gaz Liquéfié 300 Bar",
    "damageType": "PIERCING_HYDRO_PNEUMATIC",
    "effectiveRangeMeters": 45,
    "rateOfFire": "Monocoup pneumatique lourd réarmement manuel (25 coups/min)",
    "wieldedBy": "Plongeurs sous-marins et scaphandriers d'élite de la fosse norvégienne",
    "yautjaCounterplay": "Déviation au bouclier d'énergie Yautja et harponnage en retour au combistick.",
    "description": "Fusil harponneur lourd en titane conçu pour traverser la résistance de l'eau profonde et perforer les cuirasses étanches et carapaces biologiques marines."
  },
  {
    "id": "wpn_louisiana_flintlock_double_shotgun",
    "name": "Bayou Heavy 10-Gauge Double Flintlock Shotgun",
    "universe": "PREDATOR",
    "faction": "Cajun Bayou Swamp Trappers",
    "originMedia": "Predator: Strange Roux (1998)",
    "caliber": "Calibre 10 Double Canon à Poudre Noire & Grenailles de Plomb Lourd",
    "damageType": "BALLISTIC_HEAVY_SCATTER",
    "effectiveRangeMeters": 25,
    "rateOfFire": "Double décharge simultanée ou coup par coup (30 coups/min)",
    "wieldedBy": "Traqueurs de marécages et chasseurs de peaux louisianais",
    "yautjaCounterplay": "Saut acrobatique au-dessus de la gerbe de plombs et riposte immédiate au smart disc.",
    "description": "Fusil artisanal à double canon juxtaposé chambrant des cartouches de gros calibre chargées à ras bord de mitraille pour terrasser les bêtes géantes du bayou."
  },
  {
    "id": "wpn_synsound_sonic_disruptor_cannon",
    "name": "Synsound Acoustic Ultrasonic Disruptor Cannon",
    "universe": "ALIEN",
    "faction": "Synsound Corporate Security",
    "originMedia": "Aliens: Music of the Spears (1996)",
    "caliber": "Faisceau d'Ultrasons Concentrés à Fréquence Destructrice 18-45kHz",
    "damageType": "ACOUSTIC_DISRUPTION_SHOCK",
    "effectiveRangeMeters": 50,
    "rateOfFire": "Impulsions de résonance continue (60 coups/min)",
    "wieldedBy": "Agents de sécurité d'élite et techniciens du studio expérimental",
    "yautjaCounterplay": "Isolation acoustique du bio-masque et tir plasma ciblé pour détruire l'émetteur sonique.",
    "description": "Canon lourd expérimental projetant des cônes de pression sonore capables de désorienter les systèmes nerveux xénos et de fissurer les vitrages blindés."
  },
  {
    "id": "wpn_fast_track_pneumatic_riveter",
    "name": "Fast-Track Heavy Hydraulic Pneumatic Riveter",
    "universe": "ALIEN",
    "faction": "Orbital Cable Maintenance Riggers",
    "originMedia": "Aliens: Fast Track to Heaven (2011)",
    "caliber": "Rivets d'Acier au Tungstène 25mm Sous Pression Hydraulique 800 Bar",
    "damageType": "KINETIC_ARMOR_PUNCH",
    "effectiveRangeMeters": 20,
    "rateOfFire": "Tir semi-automatique rapide par percussion (180 coups/min)",
    "wieldedBy": "Techniciens de maintenance des ascenseurs orbitaux",
    "yautjaCounterplay": "Esquive en glissade latérale et section du flexible hydraulique d'alimentation.",
    "description": "Outil de chantier spatial surpuissant projetant des rivets d'assemblage avec la force d'un canon perforant capable de clouer un xénomorphe sur la carlingue."
  },
  {
    "id": "wpn_pantha_arbor_net_caster",
    "name": "Pantha Arbor-Canopy Heavy Net Caster",
    "universe": "AVP",
    "faction": "Pantha Wilderness Recon Scouts",
    "originMedia": "Aliens vs. Predator: Pantha (2000)",
    "caliber": "Filets en Câble d'Alliage à Micro-Pointes d'Ancrage Barbelées",
    "damageType": "ENTANGLEMENT_CONSTRICTION",
    "effectiveRangeMeters": 35,
    "rateOfFire": "Tir pneumatique monocoup (20 coups/min)",
    "wieldedBy": "Éclaireurs de la canopée et pisteurs de bêtes sauvages de Pantha",
    "yautjaCounterplay": "Lames de poignet rétractables pour trancher les mailles avant rétraction complète.",
    "description": "Lanceur pneumatique d'arbres projetant des filets lestés de titane conçus pour immobiliser les bêtes bondissantes et les faire chuter des branches maîtresses."
  },
  {
    "id": "wpn_three_world_war_dual_pulse_carbine",
    "name": "Armat M41A-X2 Dual Pulse Carbine",
    "universe": "AVP",
    "faction": "USCM Vanguard Task Force",
    "originMedia": "Aliens vs. Predator: Three World War (2010)",
    "caliber": "Double Barillet 10x24mm Caseless & Roquettes Perforantes 25mm",
    "damageType": "BALLISTIC_RAPID_ARMOR_PIERCING",
    "effectiveRangeMeters": 75,
    "rateOfFire": "Double rafale synchronisée (1400 coups/min)",
    "wieldedBy": "Marines coloniaux vétérans de l'alliance de Machiko Noguchi",
    "yautjaCounterplay": "Charge lourde avec le bouclier d'énergie déployé et désarmement au fouet à distance.",
    "description": "Évolution tactique du fusil à impulsions couplant deux canons synchronisés pour saturer les lignes ennemies d'un barrage balistique dévastateur."
  }
]);

// Helpers de recherche et filtrage par univers, biome et faction
export function getMediaMapById(mapId) {
  return MEDIA_MAPS_CATALOG.find((m) => m.id === mapId) || null;
}

export function getMediaMapsByUniverse(universeId) {
  if (!universeId || universeId === 'ALL') return [...MEDIA_MAPS_CATALOG];
  return MEDIA_MAPS_CATALOG.filter((m) => m.universe === universeId);
}

export function getMediaMapsByBiome(biomeId) {
  if (!biomeId || biomeId === 'all') return [...MEDIA_MAPS_CATALOG];
  return MEDIA_MAPS_CATALOG.filter((m) => m.biomeId === biomeId);
}

export function getNpcWeaponById(weaponId) {
  return NPC_ARSENAL_CATALOG.find((w) => w.id === weaponId) || null;
}

export function getNpcWeaponsByUniverse(universeId) {
  if (!universeId || universeId === 'ALL') return [...NPC_ARSENAL_CATALOG];
  return NPC_ARSENAL_CATALOG.filter((w) => w.universe === universeId);
}

export function getNpcWeaponsByFaction(faction) {
  if (!faction || faction === 'all') return [...NPC_ARSENAL_CATALOG];
  return NPC_ARSENAL_CATALOG.filter((w) => w.faction.toLowerCase().includes(faction.toLowerCase()));
}

export default {
  FRANCHISE_UNIVERSES,
  MEDIA_MAPS_CATALOG,
  NPC_ARSENAL_CATALOG,
  getMediaMapById,
  getMediaMapsByUniverse,
  getMediaMapsByBiome,
  getNpcWeaponById,
  getNpcWeaponsByUniverse,
  getNpcWeaponsByFaction
};
