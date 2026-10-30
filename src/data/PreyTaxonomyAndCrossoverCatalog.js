/**
 * PreyTaxonomyAndCrossoverCatalog.js
 * 
 * Classification complète et exhaustive des proies de la franchise selon 5 paliers de taille (1:1 Lore Canon) :
 * - GÉANT (Titans & Léviathans : 8m à 30m)
 * - GRANDE (Prédateurs Apex & Gardes Royaux : 3m à 8m)
 * - MOYEN (Guerriers, Humanoïdes & Synthétiques : 1.8m à 3m)
 * - PETITE (Nuée, Parasites & Infiltration : 0.5m à 1.8m)
 * - MINUSCULE (Bio-Pathogènes, Spores & Larves : < 0.5m)
 * 
 * Et Système de Rotation Spatio-Temporelle des Proies d'Exception Crossover (Batman, Joker, Terminator, Dredd, Superman...).
 */

export const PREY_SCALE_TIERS = Object.freeze({
  GEANT: Object.freeze({
    id: 'geant',
    label: 'GÉANT (TITANS & LÉVIATHANS)',
    sizeRange: '8m à 30m',
    badgeClass: 'scale-geant',
    honorMultiplier: 2.5,
    description: 'Monstres titanesques et titans bio-mécaniques capables de ravager une armée.'
  }),
  GRANDE: Object.freeze({
    id: 'grande',
    label: 'GRANDE (APEX & CONSTRUITS)',
    sizeRange: '3m à 8m',
    badgeClass: 'scale-grande',
    honorMultiplier: 1.8,
    description: 'Chasseurs d’élite, formes royales et bêtes blindées de premier ordre.'
  }),
  MOYEN: Object.freeze({
    id: 'moyen',
    label: 'MOYEN (GUERRIERS & SYNTHÉTIQUES)',
    sizeRange: '1.8m à 3m',
    badgeClass: 'scale-moyen',
    honorMultiplier: 1.2,
    description: 'Guerriers xénomorphes, soldats d’élite lourdement armés et androïdes de combat.'
  }),
  PETITE: Object.freeze({
    id: 'petite',
    label: 'PETITE (NUÉE & INFILTRATION)',
    sizeRange: '0.5m à 1.8m',
    badgeClass: 'scale-petite',
    honorMultiplier: 0.8,
    description: 'Parasites bondissants, bêtes de traque rapides et drones éclaireurs.'
  }),
  MINUSCULE: Object.freeze({
    id: 'minuscule',
    label: 'MINUSCULE (BIO-PATHOGÈNES & SPORES)',
    sizeRange: '< 0.5m',
    badgeClass: 'scale-minuscule',
    honorMultiplier: 0.5,
    description: 'Mutagènes chimiques, vers parasitaires et spores fongiques aéroportées.'
  }),
});

export const PREY_FACTIONS = Object.freeze({
  YAUTJA: 'Yautja Prime & Clans de Chasse',
  ENGINEER: 'Ingénieurs & Architectes Sacrificiels',
  XENOMORPH: 'Ruche Xénomorphe & Mutations',
  HUMAN_SYNTHETIC: 'Weyland-Yutani & Marines Coloniaux',
  MULTIVERSE_CROSSOVER: 'Anomalies & Crossovers du Multivers',
});

/**
 * Catalogue exhaustif de toutes les proies selon les 5 échelles.
 */
export const CANON_PREY_CATALOG = Object.freeze([
  // ================= 1. TAILLE GÉANTE =================
  {
    id: 'prey_deacon_titan',
    name: 'Le Deacon Titanesque',
    faction: PREY_FACTIONS.ENGINEER,
    scale: 'GEANT',
    sizeMeters: 9.5,
    originMedia: 'Prometheus (2012)',
    description: 'Hybride colosse né de la fécondation du Trilobite dans un Ingénieur. Morphologie pointue et crâne ultra-dense.',
    weakpoints: ['Crâne ogival', 'Thorax bleuté', 'Gorge'],
    trophy: 'Crâne Pharyngien du Deacon',
    baseHonor: 3600,
    threatStars: 5,
  },
  {
    id: 'prey_xeno_king_titan',
    name: 'Roi Xénomorphe — Rogue Titan',
    faction: PREY_FACTIONS.XENOMORPH,
    scale: 'GEANT',
    sizeMeters: 8.5,
    originMedia: 'Aliens: Rogue (Dark Horse 1993)',
    description: 'Colosse génétique mâle dominant à crête en trident et double dard caudal barbelé.',
    weakpoints: ['Crête trident', 'Cœur acide royal', 'Double queue'],
    trophy: 'Couronne Trident du Roi Xénomorphe',
    baseHonor: 3800,
    threatStars: 5,
  },
  {
    id: 'prey_xeno_queen_matriarch',
    name: 'Reine Xénomorphe Matriarche',
    faction: PREY_FACTIONS.XENOMORPH,
    scale: 'GEANT',
    sizeMeters: 6.5,
    originMedia: 'Aliens (1986) / AVP (2004)',
    description: 'Matriarche suprême de la ruche de LV-426, dotée d’une immense crête cuirassée et d’un ovipositeur.',
    weakpoints: ['Diadème de crête', 'Mâchoire pharyngienne', 'Queue perforante'],
    trophy: 'Crête Diadème Royale',
    baseHonor: 3500,
    threatStars: 5,
  },
  {
    id: 'prey_vydrach_prime',
    name: "Vy'drach Céleste de Yautja Prime",
    faction: PREY_FACTIONS.YAUTJA,
    scale: 'GEANT',
    sizeMeters: 16.0,
    originMedia: 'Lore Canonique Yautja Prime',
    description: 'Léviathan reptilien ailé vénéré sur la planète mère des Predators, défi ultime des Maîtres Chasseurs.',
    weakpoints: ['Membranes alaires', 'Crête osseuse', 'Dard caudal'],
    trophy: "Crâne Ailé de Vy'drach",
    baseHonor: 3500,
    threatStars: 5,
  },
  {
    id: 'prey_rhynth_titan',
    name: 'Rhynth Titanesque de Ryushi',
    faction: PREY_FACTIONS.YAUTJA,
    scale: 'GEANT',
    sizeMeters: 12.5,
    originMedia: 'Aliens vs. Predator: Prey (1994)',
    description: 'Béhémoth hexapode cuirassé indigène de Ryushi, proies d’initiation du Clan de Dachande.',
    weakpoints: ['Corne centrale d’obsidienne', 'Cuirasse dorsale', 'Massue caudale'],
    trophy: 'Corne d’Obsidienne de Ryushi',
    baseHonor: 3200,
    threatStars: 5,
  },
  {
    id: 'prey_kalisk_apex',
    name: 'Kalisk Régénérant de Genna',
    faction: PREY_FACTIONS.YAUTJA,
    scale: 'GEANT',
    sizeMeters: 10.0,
    originMedia: 'Predator: Badlands (2025)',
    description: 'Quadrupède colossal doté d’une carapace adaptative et d’une régénération cellulaire ultra-rapide.',
    weakpoints: ['Carapace dorsale', 'Noyau bio-luminescent exposé'],
    trophy: 'Carapace Cristalline de Kalisk',
    baseHonor: 3400,
    threatStars: 5,
  },
  {
    id: 'prey_goliath_akumo',
    name: 'Goliath Xeno-Akumo',
    faction: PREY_FACTIONS.YAUTJA,
    scale: 'GEANT',
    sizeMeters: 12.0,
    originMedia: 'Création Apex Hunt',
    description: 'Mégafaune chtonienne reptilienne bipède blindée des jungles primaires de réserves.',
    weakpoints: ['Corne frontale', 'Cœur thermique', 'Queue'],
    trophy: 'Corne Frontale de Goliath',
    baseHonor: 3000,
    threatStars: 5,
  },

  // ================= 2. TAILLE GRANDE =================
  {
    id: 'prey_engineer_architect',
    name: 'Ingénieur / Architecte Sacrificiel',
    faction: PREY_FACTIONS.ENGINEER,
    scale: 'GRANDE',
    sizeMeters: 3.2,
    originMedia: 'Prometheus (2012)',
    description: 'Être primordial géant à la stature d’albâtre, force surhumaine colossale et technologie biomécanique.',
    weakpoints: ['Casque biomécanique trompe d’éléphant', 'Thorax', 'Nuque'],
    trophy: 'Bio-Masque d’Ingénieur',
    baseHonor: 2800,
    threatStars: 4,
  },
  {
    id: 'prey_xeno_crusher',
    name: 'Crusher — Praetorian Bélier',
    faction: PREY_FACTIONS.XENOMORPH,
    scale: 'GRANDE',
    sizeMeters: 4.5,
    originMedia: 'Aliens: Colonial Marines (2013)',
    description: 'Mutation quadrupède lourde protégée par une plaque frontale pare-balles impénétrable de 30cm d’épaisseur.',
    weakpoints: ['Flancs non protégés', 'Queue', 'Arrière-train'],
    trophy: 'Plaque Frontale de Crusher',
    baseHonor: 2600,
    threatStars: 4,
  },
  {
    id: 'prey_predalien_abomination',
    name: 'Predalien — Hybride Abomination',
    faction: PREY_FACTIONS.XENOMORPH,
    scale: 'GRANDE',
    sizeMeters: 3.4,
    originMedia: 'AVP: Requiem (2007)',
    description: 'Hybridation cauchemardesque née d’un Yautja imprégné par un Facehugger. Mandibules et predlocks chitineux.',
    weakpoints: ['Dôme crânien', 'Mandibules', 'Queue d’épines'],
    trophy: 'Crâne Mandibulaire de Predalien',
    baseHonor: 2700,
    threatStars: 4,
  },
  {
    id: 'prey_super_predator_berserker',
    name: 'Berserker — Super Predator',
    faction: PREY_FACTIONS.YAUTJA,
    scale: 'GRANDE',
    sizeMeters: 3.1,
    originMedia: 'Predators (2010)',
    description: 'Chasseur colossal renégat de clan rival sans honneur, dominant la planète-réserve.',
    weakpoints: ['Bio-masque à mâchoire', 'Canon Gatling d’épaule', 'Avant-bras'],
    trophy: 'Masque Mandibulaire Berserker',
    baseHonor: 2500,
    threatStars: 4,
  },
  {
    id: 'prey_upgrade_predator',
    name: 'Assassin / Upgrade Predator',
    faction: PREY_FACTIONS.YAUTJA,
    scale: 'GRANDE',
    sizeMeters: 3.5,
    originMedia: 'The Predator (2018)',
    description: 'Géant génétiquement amélioré par épissage d’ADN extraterrestre, peau exo-blindée.',
    weakpoints: ['Glandes d’adaptation', 'Sous-gorge', 'Plexus'],
    trophy: 'Plaques Épidermiques Blindées',
    baseHonor: 2900,
    threatStars: 5,
  },
  {
    id: 'prey_neomorph_adult',
    name: 'Néomorphe Adulte',
    faction: PREY_FACTIONS.XENOMORPH,
    scale: 'GRANDE',
    sizeMeters: 3.0,
    originMedia: 'Alien: Covenant (2017)',
    description: 'Espèce sauvage blanche et translucide engendrée par les spores du pathogène noir. Queue tranchante comme un rasoir.',
    weakpoints: ['Chair pâle non blindée', 'Mâchoire pharyngienne rétractée'],
    trophy: 'Pointe Caudale de Néomorphe',
    baseHonor: 2400,
    threatStars: 4,
  },

  // ================= 3. TAILLE MOYENNE =================
  {
    id: 'prey_xeno_warrior',
    name: 'Guerrier Xénomorphe de LV-426',
    faction: PREY_FACTIONS.XENOMORPH,
    scale: 'MOYEN',
    sizeMeters: 2.3,
    originMedia: 'Aliens (1986)',
    description: 'Caste de combat standard à la crête crânienne côtelée, griffes d’acier et sang acide hautement volatil.',
    weakpoints: ['Coupe de crâne', 'Thorax', 'Articulations de genoux'],
    trophy: 'Crâne de Guerrier Xénomorphe',
    baseHonor: 1800,
    threatStars: 3,
  },
  {
    id: 'prey_xeno_runner',
    name: 'Runner / Dog Alien',
    faction: PREY_FACTIONS.XENOMORPH,
    scale: 'MOYEN',
    sizeMeters: 2.1,
    originMedia: 'Alien 3 (1992)',
    description: 'Xénomorphe quadrupède ultra-rapide issu d’un hôte canin ou bovin. Vitesse de sprint stupéfiante.',
    weakpoints: ['Colonne dorsale', 'Tendon d’Achille', 'Gorge'],
    trophy: 'Colonne Courbée de Runner',
    baseHonor: 1700,
    threatStars: 3,
  },
  {
    id: 'prey_colonial_marine_heavy',
    name: 'Marine Colonial au Smartgun M56',
    faction: PREY_FACTIONS.HUMAN_SYNTHETIC,
    scale: 'MOYEN',
    sizeMeters: 1.85,
    originMedia: 'Aliens (1986)',
    description: 'Soldat d’élite USCM équipé de l’armure M3 et du canon automatique mobile lourd asservi à la visée oculaire.',
    weakpoints: ['Bras articulé gyrostabilisé', 'Visière tactique', 'Batterie dorsale'],
    trophy: 'Gantelet de Contrôle Smartgun',
    baseHonor: 1500,
    threatStars: 3,
  },
  {
    id: 'prey_seegson_working_joe',
    name: 'Synthétique Seegson Working Joe',
    faction: PREY_FACTIONS.HUMAN_SYNTHETIC,
    scale: 'MOYEN',
    sizeMeters: 1.88,
    originMedia: 'Alien: Isolation (2014)',
    description: 'Androïde industriel bon marché à la peau caoutchouteuse et aux yeux globuleux. Immunisé au choc électrique léger.',
    weakpoints: ['Circuit optique facial', 'Noyau d’alimentation ventral'],
    trophy: 'Module d’Intelligence Artificielle Seegson',
    baseHonor: 1400,
    threatStars: 2,
  },
  {
    id: 'prey_river_ghost',
    name: 'River Ghost de la Réserve',
    faction: PREY_FACTIONS.YAUTJA,
    scale: 'MOYEN',
    sizeMeters: 2.0,
    originMedia: 'Predators (2010)',
    description: 'Créature reptilienne humanoïde véloce capable de bonds aériens impressionnants et de camouflage partiel.',
    weakpoints: ['Cage thoracique souple', 'Articulations des membres'],
    trophy: 'Écailles Mimétiques de River Ghost',
    baseHonor: 1600,
    threatStars: 3,
  },

  // ================= 4. TAILLE PETITE =================
  {
    id: 'prey_facehugger_royal',
    name: 'Super-Facehugger Royal',
    faction: PREY_FACTIONS.XENOMORPH,
    scale: 'PETITE',
    sizeMeters: 1.2,
    originMedia: 'Alien 3 (1992)',
    description: 'Parasite arachnoïde géant capable d’imprégner plusieurs hôtes consécutifs et de porter un embryon royal.',
    weakpoints: ['Sac abdominal', 'Queue préhensile'],
    trophy: 'Doigts Articulés de Super-Facehugger',
    baseHonor: 1200,
    threatStars: 2,
  },
  {
    id: 'prey_trilobite_juvenile',
    name: 'Trilobite Juvénile Tentaculaire',
    faction: PREY_FACTIONS.ENGINEER,
    scale: 'PETITE',
    sizeMeters: 1.5,
    originMedia: 'Prometheus (2012)',
    description: 'Parasite tentaculaire céphalopode issu du contact mutagène, stade intermédiaire avant la taille géante.',
    weakpoints: ['Tentacules ventouses', 'Orifice central'],
    trophy: 'Tentacule Préhensile de Trilobite',
    baseHonor: 1300,
    threatStars: 2,
  },
  {
    id: 'prey_chestburster_runner',
    name: 'Chestburster Véloce',
    faction: PREY_FACTIONS.XENOMORPH,
    scale: 'PETITE',
    sizeMeters: 0.8,
    originMedia: 'Alien (1979)',
    description: 'Forme larvaire nouvellement émergée de la cage thoracique d’un hôte. Très agile et fuyante.',
    weakpoints: ['Corps vermiforme', 'Petite mâchoire'],
    trophy: 'Mandibule Larvaire de Chestburster',
    baseHonor: 900,
    threatStars: 1,
  },

  // ================= 5. TAILLE MINUSCULE =================
  {
    id: 'prey_black_goo_pathogen',
    name: 'Pathogène Noir Chimique A0-3959X.91-15',
    faction: PREY_FACTIONS.ENGINEER,
    scale: 'MINUSCULE',
    sizeMeters: 0.15,
    originMedia: 'Prometheus (2012)',
    description: 'Arme bactériologique liquide des Ingénieurs contenue dans des ampoules de stase. Réécrit l’ADN au contact.',
    weakpoints: ['Fioles scellées', 'Décontamination thermique plasma'],
    trophy: 'Ampoule Hermétique de Liquide Noir',
    baseHonor: 2000,
    threatStars: 4,
  },
  {
    id: 'prey_neomorph_spores',
    name: 'Spores Fongiques Motes',
    faction: PREY_FACTIONS.ENGINEER,
    scale: 'MINUSCULE',
    sizeMeters: 0.05,
    originMedia: 'Alien: Covenant (2017)',
    description: 'Nuée de micro-organismes noirs libérés par les capsules fongiques poussant dans les sols contaminés.',
    weakpoints: ['Vaporisation par brûleur thermique', 'Filtration du bio-masque'],
    trophy: 'Nid de Spores Calciné',
    baseHonor: 1100,
    threatStars: 3,
  },
  {
    id: 'prey_hammerpede_worm',
    name: 'Hammerpede — Annelide Muté',
    faction: PREY_FACTIONS.ENGINEER,
    scale: 'MINUSCULE',
    sizeMeters: 0.45,
    originMedia: 'Prometheus (2012)',
    description: 'Ver annélide terrestre muté au contact du liquide noir, capable d’ouvrir sa tête en éventail tranchant et de cracher de l’acide.',
    weakpoints: ['Tête en cobra déployée', 'Corps annelé'],
    trophy: 'Tête Déployée de Hammerpede',
    baseHonor: 1000,
    threatStars: 2,
  },
]);

/**
 * Catalogue Officiel des Proies Crossover du Multivers (DC Comics, Dark Horse, 2000 AD).
 * Proies d'exception rencontrées par les Yautja dans les œuvres sous licence officielle.
 */
export const MULTIVERSE_CROSSOVER_PREY = Object.freeze([
  {
    id: 'crossover_batman',
    characterId: 'batman',
    name: 'Batman — Le Chevalier Noir de Gotham',
    universe: 'DC Comics / Dark Horse',
    originMedia: 'Batman versus Predator (1991, Dave Gibbons & Andy Kubert)',
    crossoverYear: 1991,
    scale: 'MOYEN',
    sizeMeters: 1.88,
    badgeColor: '#ffe600',
    description: 'Le détective ultime de Gotham City. Affronté par un Yautja vétéran dans un manoir gothique sous l’orage. Porteur de la Bat-Armure cinétique, de batarangs tranchants et de bombes fumigènes.',
    tactics: 'Combat au sonar dans la fumée, parades aux gantelets renforcés et attaques acrobatiques au grappin.',
    weakpoints: ['Zone mentonnière non protégée', 'Liaisons de la Bat-Armure', 'Grappin déployé'],
    trophy: 'Batarang d’Acier Noirci & Masque du Justicier',
    honorReward: 4500,
    rotationPeriodHours: 6,
    arena: 'GOTHAM CITY — BEFFROI SOUS LA PLUIE',
  },
  {
    id: 'crossover_joker',
    characterId: 'joker',
    name: 'Le Joker — Arlequin du Chaos',
    universe: 'DC Comics / Dark Horse',
    originMedia: 'Batman/Aliens & Joker/Mask/Predator',
    crossoverYear: 1997,
    scale: 'MOYEN',
    sizeMeters: 1.83,
    badgeColor: '#7b1fa2',
    description: 'Psychopathe anarchiste imprévisible. Utilise des bonbonnes de gaz hilarant corrosif Joker-Venom, des fleurs crachant de l’acide et des armes piégées.',
    tactics: 'Mines de rire toxiques, esquives désordonnées et utilisation de leurres explosifs.',
    weakpoints: ['Torse frêle', 'Fleur à acide sur le revers', 'Bonbonne de gaz dorsale'],
    trophy: 'Fiole de Venin Joker & Canne Sourire Macabre',
    honorReward: 4200,
    rotationPeriodHours: 6,
    arena: 'ARKHAM ASYLUM — AILE DE HAUTE SÉCURITÉ',
  },
  {
    id: 'crossover_terminator_t800',
    characterId: 'terminator',
    name: 'Cyberdyne Infiltrator T-800',
    universe: 'Dark Horse Comics',
    originMedia: 'Aliens versus Predator versus The Terminator (2000, Mark Schultz)',
    crossoverYear: 2000,
    scale: 'MOYEN',
    sizeMeters: 1.90,
    badgeColor: '#ff0033',
    description: 'Châssis endosquelette de combat en hyper-alliage de coltan résistant aux balles et à l’acide xénomorphe. Vision thermique HUD rouge, minigun Westinghouse et force brute titanesque.',
    tactics: 'Tirs de barrage ininterrompus, insensibilité à la douleur, marche implacable et explosion de batterie à la mort.',
    weakpoints: ['Noyau à hydrogène thoracique', 'Optiques oculaires rouges', 'Servo-moteurs cervicaux'],
    trophy: 'Crâne Métallique T-800 & Processeur Cyberdyne',
    honorReward: 4800,
    rotationPeriodHours: 6,
    arena: 'COMPLEXE CYBERDYNE — USINE D’ASSEMBLAGE 2029',
  },
  {
    id: 'crossover_judge_dredd',
    characterId: 'judge_dredd',
    name: 'Juge Dredd — Loi de Mega-City One',
    universe: '2000 AD / Dark Horse',
    originMedia: 'Predator vs. Judge Dredd (1997, John Wagner & Enrique Alcatena)',
    crossoverYear: 1997,
    scale: 'MOYEN',
    sizeMeters: 1.86,
    badgeColor: '#ffd700',
    description: 'Le bras armé inflexible de la Justice dans la mégalopole du 22e siècle. Armé du Lawgiver MK II (projectiles perforants, incendiaires, ricochets) et de son casque anti-trauma.',
    tactics: 'Changement instantané de type de munition par commande vocale, discipline de tir parfaite et contre-attaques au Daystick.',
    weakpoints: ['Bouche découverte', 'Magasin de munitions Lawgiver', 'Visière faciale'],
    trophy: 'Insigne Aigle Doré DREDD & Arme Lawgiver MK II',
    honorReward: 4300,
    rotationPeriodHours: 6,
    arena: 'MEGA-CITY ONE — SECTEUR DES RUINES CURSED EARTH',
  },
  {
    id: 'crossover_superman_red_sun',
    characterId: 'superman',
    name: 'Superman — Sous l’Ombre du Soleil Rouge',
    universe: 'DC Comics / Dark Horse',
    originMedia: 'Superman vs. Predator (2000, David Michelinie & Alex Saviuk)',
    crossoverYear: 2000,
    scale: 'MOYEN',
    sizeMeters: 1.91,
    badgeColor: '#0044cc',
    description: 'Kal-El privé de ses pouvoirs divins par un champ d’amortissement alien reproduisant le rayonnement de Krypton. Combattant d’élite réduit à sa simple bravoure et résilience mortelle.',
    tactics: 'Corps-à-corps héroïque, réflexes athlétiques parfaits et utilisation de reliques kryptoniennes.',
    weakpoints: ['Vulnérabilité humaine sous rayonnement rouge', 'Endurance finie'],
    trophy: 'Tissu Indéchirable au Sigil \'S\' de la Maison d’El',
    honorReward: 5000,
    rotationPeriodHours: 6,
    arena: 'JUNGLE D’AMÉRIQUE DU SUD — TEMPLE DU SOLEIL ROUGE',
  },
  {
    id: 'crossover_witchblade',
    characterId: 'witchblade',
    name: 'Sara Pezzini — Porteuse de la Witchblade',
    universe: 'Top Cow / Dark Horse',
    originMedia: 'Overkill: Witchblade / Aliens / Predator (2000)',
    crossoverYear: 2000,
    scale: 'MOYEN',
    sizeMeters: 1.78,
    badgeColor: '#8e24aa',
    description: 'Inspectrice de police protégée par le gant symbiotique mystique Witchblade, capable de forger des lames bio-métalliques tranchant les armures Yautja.',
    tactics: 'Armure symbiotique réactive adaptative, lames d’énergie tranchantes et régénération.',
    weakpoints: ['Hostilité envers l’hôte', 'Gemme centrale du gantelet'],
    trophy: 'Fragment Vivant de la Witchblade',
    honorReward: 4400,
    rotationPeriodHours: 6,
    arena: 'NEW YORK — CATHÉDRALE EN RUINE SOUS LA LUNE',
  },
]);

/**
 * Calcule l'état actuel de la rotation spatio-temporelle des anomalies multivers.
 * Change de cible active toutes les 6 heures de manière déterministe.
 */
export function getMultiverseRotationState(timestamp = Date.now()) {
  const rotationCycleMs = 6 * 3600 * 1000; // 6 heures
  const totalPeriods = Math.floor(timestamp / rotationCycleMs);
  const activeIndex = totalPeriods % MULTIVERSE_CROSSOVER_PREY.length;
  const nextIndex = (activeIndex + 1) % MULTIVERSE_CROSSOVER_PREY.length;
  const followingIndex = (activeIndex + 2) % MULTIVERSE_CROSSOVER_PREY.length;

  const msIntoPeriod = timestamp % rotationCycleMs;
  const msRemaining = rotationCycleMs - msIntoPeriod;
  const secondsRemaining = Math.floor(msRemaining / 1000);

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;
  const formattedCountdown = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return {
    activePrey: MULTIVERSE_CROSSOVER_PREY[activeIndex],
    upcomingPrey: [
      MULTIVERSE_CROSSOVER_PREY[nextIndex],
      MULTIVERSE_CROSSOVER_PREY[followingIndex]
    ],
    secondsRemaining,
    formattedCountdown,
    cycleIndex: totalPeriods,
    rotationPeriodHours: 6
  };
}

/**
 * Filtre les proies du catalogue selon leur échelle ou leur faction.
 */
export function filterPreyByScale(scaleId) {
  if (!scaleId || scaleId === 'all') return CANON_PREY_CATALOG;
  return CANON_PREY_CATALOG.filter((p) => p.scale.toLowerCase() === scaleId.toLowerCase());
}

export function filterPreyByFaction(faction) {
  if (!faction || faction === 'all') return CANON_PREY_CATALOG;
  return CANON_PREY_CATALOG.filter((p) => p.faction === faction);
}
