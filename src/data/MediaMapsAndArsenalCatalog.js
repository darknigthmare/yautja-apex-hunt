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
  // --- UNIVERS PREDATOR (8 Cartes) ---
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

  // --- UNIVERS ALIEN (10 Cartes) ---
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

  // --- UNIVERS ALIEN VS. PREDATOR (6 Cartes) ---
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
