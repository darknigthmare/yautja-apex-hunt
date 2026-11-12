/**
 * SquadEncountersCatalog.js
 * 
 * Répertoire officiel des rencontres tactiques par escouades et groupes d'intervention (1:1 Canon Lore).
 * Permet d'affronter des escouades entières d'humains et de synthétiques lourdement armés
 * (ex: toute l'escouade de Dutch en 1987, ou la section de Marines Coloniaux de LV-426),
 * tout en conservant la possibilité de traquer chaque membre en duel solo sur d'autres cartes.
 */

export const SQUAD_CATEGORIES = Object.freeze({
  MILITARY_COMMANDO: {
    id: 'MILITARY_COMMANDO',
    label: 'Commandos Militaires d\'Élite',
    icon: '🎖️',
    description: 'Unités de forces spéciales et commandos surentraînés opérant en formation tactique serrée.'
  },
  COLONIAL_MARINES: {
    id: 'COLONIAL_MARINES',
    label: 'Sections de Marines Coloniaux USCM',
    icon: '🪖',
    description: 'Sections de combat lourdement armées avec fusils à impulsion M41A, Smartguns et lance-flammes.'
  },
  SPACESHIP_CREW: {
    id: 'SPACESHIP_CREW',
    label: 'Équipages de Cargos & Survivants',
    icon: '🚀',
    description: 'Civils, techniciens et officiers de bord improvisant des armes industrielles pour leur survie.'
  },
  SYNTHETIC_PACK: {
    id: 'SYNTHETIC_PACK',
    label: 'Meutes d\'Androïdes & Synthétiques',
    icon: '🤖',
    description: 'Patrouilles de synthétiques interconnectés insensibles à la douleur et coordonnés par IA centrale.'
  },
  TRIBAL_WAR_PARTY: {
    id: 'TRIBAL_WAR_PARTY',
    label: 'Bandes de Guerre Tribales & Pisteurs',
    icon: '🏹',
    description: 'Guerriers autochtones maîtres du camouflage, du tir à l\'arc réflexe et des embuscades de terrain.'
  },
  MERCENARY_SYNDICATE: {
    id: 'MERCENARY_SYNDICATE',
    label: 'Mercenaires & Forces Corporatistes',
    icon: '💼',
    description: 'Équipes de sécurité privée et contrebandiers surarmés sous contrat Weyland-Yutani.'
  },
  LAW_ENFORCEMENT: {
    id: 'LAW_ENFORCEMENT',
    label: 'Forces de Police & Détectives',
    icon: '🚔',
    description: 'Brigades criminelles et unités d\'intervention urbaines spécialisées dans les zones de canicule et de guerre de gangs.'
  },
  CRIME_CARTEL: {
    id: 'CRIME_CARTEL',
    label: 'Cartels Criminels & Syndicats Armés',
    icon: '💀',
    description: 'Cartels de drogue, bandes vaudoues et syndicats criminels armés de fusils d\'assaut et d\'explosifs lourds.'
  },
  SUPER_PREDATORS: {
    id: 'SUPER_PREDATORS',
    label: 'Clans de Super Predators & Berserkers',
    icon: '🩸',
    description: 'Chasseurs Yautja hérétiques de grande taille, usant de molosses Hell-Hounds et de drones faucons sans pitié.'
  },
  XENO_INFESTATION: {
    id: 'XENO_INFESTATION',
    label: 'Essaims d\'Infestation Xénomorphe & Predalien',
    icon: '☣️',
    description: 'Nuées de combat xénomorphes menées par des abominations hybrides Predaliens et des castes corrosives.'
  },
  CIVILIAN_SURVIVORS: {
    id: 'CIVILIAN_SURVIVORS',
    label: 'Collectifs de Survivants Civils & Réfugiés',
    icon: '📻',
    description: 'Groupes de civils armés et de militaires isolés improvisant des défenses d\'urgence face aux menaces extraterrestres.'
  },
  WASTELAND_OUTCASTS: {
    id: 'WASTELAND_OUTCASTS',
    label: 'Pisteurs des Terres Dévastées & Badlands',
    icon: '🏜️',
    description: 'Éclaireurs nomades et unités mécanisées survivant dans les secteurs irradiés et les déserts de cendres.'
  }
});

export const SQUAD_ENCOUNTERS = Object.freeze([
  // 1. Escouade Commando Major Dutch — Val Verde 1987
  {
    id: 'squad_dutch_val_verde_1987',
    name: 'Escouade Complète Commando Major Dutch — Opération Val Verde 1987',
    shortName: 'Escouade Dutch 1987 (7 Commandos)',
    category: 'MILITARY_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 7,
    originMedia: 'Predator (1987, John McTiernan)',
    biomeId: 'jungle',
    recommendedBiome: 'Jungle Tropicale de Val Verde',
    description: 'L\'équipe de sauvetage légendaire au grand complet déployée en Amérique centrale : Dutch, Dillon, Blain, Mac, Billy, Poncho et Hawkins.',
    tactics: 'Formation en losange tactique, couverture sonore au minigun Ol\' Painless, tir croisé M60/M16 et détection précoce par le pisteur Billy Sole.',
    totalHonorReward: 5400,
    soloVariantId: 'alien_base_major_dutch_schaefer_1987',
    members: [
      {
        id: 'dutch',
        name: 'Major Alan « Dutch » Schaefer',
        role: 'Commandant d\'Escouade',
        weapon: 'Carabine AR-15 / Lance-Grenades M203 & Couteau Bowie',
        hp: 360,
        armor: 30,
        trophy: 'Plaque Militaire & Couteau Bowie de Dutch',
        canMudCamouflage: true
      },
      {
        id: 'dillon',
        name: 'George Dillon (Agent Liaison CIA)',
        role: 'Officier CIA / Tir d\'Appui',
        weapon: 'Doubles Pistolets Mitrailleurs HK MP5',
        hp: 280,
        armor: 20,
        trophy: 'Montre Militaire de Dillon'
      },
      {
        id: 'blain',
        name: 'Blain Cooper (Artilleur Lourd)',
        role: 'Puissance de Feu Lourde',
        weapon: 'Minigun Rotatif M134 « Ol\' Painless » 6-Canons',
        hp: 320,
        armor: 25,
        trophy: 'Chapeau Stetson & Baril de Minigun Ol\' Painless'
      },
      {
        id: 'mac',
        name: 'Sergent Mac Eliot',
        role: 'Mitrailleur de Section',
        weapon: 'Mitrailleuse Légère M60 & Rasoir Jetable',
        hp: 300,
        armor: 20,
        trophy: 'Plaque d\'Identité & Rasoir Ensanglanté de Mac'
      },
      {
        id: 'billy',
        name: 'Billy Sole (Pisteur Amérindien)',
        role: 'Éclaireur & Sentinelle Intuitive',
        weapon: 'Machette de Combat Lourde & Fusil à Pompe Masterkey',
        hp: 270,
        armor: 15,
        trophy: 'Machette de Combat Rituelle de Billy Sole'
      },
      {
        id: 'poncho',
        name: 'Poncho Ramirez',
        role: 'Spécialiste Démolition',
        weapon: 'Lance-Grenades Milkor MGL 40mm & Grenades Fumigènes',
        hp: 260,
        armor: 20,
        trophy: 'Harnais de Grenades 40mm de Poncho'
      },
      {
        id: 'hawkins',
        name: 'Rick Hawkins',
        role: 'Opérateur Radio & Flanc',
        weapon: 'Carabine MP5A3 & Émetteur Radio PRC-77',
        hp: 220,
        armor: 15,
        trophy: 'Lunettes Balistiques de Hawkins'
      }
    ]
  },

  // 2. Section Tactique Alpha USCM — Hadley's Hope LV-426 (Aliens 1986)
  {
    id: 'squad_uscm_hadleys_hope_1986',
    name: 'Section Tactique Alpha USCM — Hadley\'s Hope LV-426',
    shortName: 'Section USCM Alpha (8 Marines)',
    category: 'COLONIAL_MARINES',
    scale: 'MOYEN',
    totalMembers: 8,
    originMedia: 'Aliens (1986, James Cameron)',
    biomeId: 'colony',
    recommendedBiome: 'Complexe Atmosphérique de LV-426',
    description: 'La section de Marines Coloniaux envoyée enquêter sur la rupture de contact de la colonie minière Hadley\'s Hope.',
    tactics: 'Balayage au détecteur de mouvement M314, tir de saturation aux Smartguns M56 jumelés et couloirs de feu au lance-flammes M240.',
    totalHonorReward: 5800,
    soloVariantId: 'alien_base_william_hudson_private',
    members: [
      {
        id: 'apone',
        name: 'Sergent-Artilleur Al Apone',
        role: 'Commandant Tactique de Terrain',
        weapon: 'Carabine M41A & Émetteur de Section',
        hp: 340,
        armor: 40,
        trophy: 'Casquette de Campagne & Émetteur d\'Apone'
      },
      {
        id: 'hicks',
        name: 'Caporal Dwayne Hicks',
        role: 'Sous-Officier / Tir d\'Élite',
        weapon: 'Fusil à Impulsion M41A & Fusil Ithaca 37 Calibre 12',
        hp: 330,
        armor: 45,
        trophy: 'Fusil à Pompe Ithaca Model 37 de Hicks'
      },
      {
        id: 'vasquez',
        name: 'Soldat Jenette Vasquez',
        role: 'Artilleuse Smartgun Lourde',
        weapon: 'M56 Smartgun Asservi & Pistolet Smith & Wesson',
        hp: 320,
        armor: 35,
        trophy: 'Harnais Gyroscopique M56 de Vasquez'
      },
      {
        id: 'drake',
        name: 'Soldat Mark Drake',
        role: 'Binôme de Feu Smartgun',
        weapon: 'M56 Smartgun Asservi & Câbles d\'Alimentation',
        hp: 310,
        armor: 35,
        trophy: 'Module d\'Alimentation de Smartgun Drake'
      },
      {
        id: 'hudson',
        name: 'Première Classe William Hudson',
        role: 'Opérateur Radar & Détecteur',
        weapon: 'Fusil M41A & Détecteur de Mouvements M314',
        hp: 280,
        armor: 35,
        trophy: 'Détecteur de Mouvements M314 de Hudson'
      },
      {
        id: 'frost',
        name: 'Soldat Robert Frost',
        role: 'Soutien Pyrotechnique',
        weapon: 'Lance-Flammes Industriel M240',
        hp: 290,
        armor: 30,
        trophy: 'Buse Incendiaire de Lance-Flammes M240'
      },
      {
        id: 'dietrich',
        name: 'Caporal Cynthia Dietrich',
        role: 'Infirmière de Combat',
        weapon: 'Pistolet Automatique VP70 & Défibrillateur',
        hp: 250,
        armor: 25,
        trophy: 'Trousse Médicale Tactique USCM'
      },
      {
        id: 'wierzbowski',
        name: 'Soldat Trevor Wierzbowski',
        role: 'Fusilier d\'Appui',
        weapon: 'Fusil M41A & Grenades Perforantes 30mm',
        hp: 280,
        armor: 35,
        trophy: 'Chargeur Haute Capacité M41A'
      }
    ]
  },

  // 3. Équipage de Survie du Cargo USCSS Nostromo (Alien 1979)
  {
    id: 'squad_nostromo_crew_1979',
    name: 'Équipage de Survie du Cargo Minier USCSS Nostromo',
    shortName: 'Équipage Nostromo (6 Officiers & Jonesy)',
    category: 'SPACESHIP_CREW',
    scale: 'MOYEN',
    totalMembers: 7,
    originMedia: 'Alien (1979, Ridley Scott)',
    biomeId: 'mothership',
    recommendedBiome: 'Couloirs Métalliques & Conduits de Vapeur',
    description: 'L\'équipage complet du remorqueur interstellaire Nostromo réveillé de cryo-sommeil, tentant d\'endiguer la menace du Big Chap.',
    tactics: 'Chasse aux conduits avec aiguillons électriques pour bétail, lance-flammes artisanaux et détecteur de détresse acoustique.',
    totalHonorReward: 4600,
    soloVariantId: 'alien_base_ripley_narcissus_survivor',
    members: [
      {
        id: 'ripley',
        name: 'Ellen Ripley (Lieutenant de Bord)',
        role: 'Coordinatrice de Survie',
        weapon: 'Lance-Flammes Improvisé & Harpon Narcissus',
        hp: 310,
        armor: 20,
        trophy: 'Harpon Pneumatique de la Navette Narcissus'
      },
      {
        id: 'dallas',
        name: 'Capitaine Arthur Dallas',
        role: 'Commandant de Bord',
        weapon: 'Scaphandre Rouge EVA & Torche Halogène Haute Puissance',
        hp: 280,
        armor: 25,
        trophy: 'Scaphandre Rouge EVA de Dallas'
      },
      {
        id: 'parker',
        name: 'Dennis Parker',
        role: 'Chef Mécanicien',
        weapon: 'Clé à Choc Hydraulique & Lance-Flammes Artisanal',
        hp: 320,
        armor: 15,
        trophy: 'Clé à Choc Hydraulique de Parker'
      },
      {
        id: 'brett',
        name: 'Samuel Brett',
        role: 'Technicien de Maintenance',
        weapon: 'Aiguillon Électrique pour Bétail & Casquette',
        hp: 260,
        armor: 10,
        trophy: 'Aiguillon Électrique Artisanal de Brett'
      },
      {
        id: 'lambert',
        name: 'Joan Lambert',
        role: 'Navigatrice de Bord',
        weapon: 'Scaphandre Bleu EVA & Détecteur Sonique',
        hp: 230,
        armor: 20,
        trophy: 'Détecteur Acoustique de Dérive de Lambert'
      },
      {
        id: 'ash',
        name: 'Ash (Hyperdyne 120-A/2)',
        role: 'Officier Scientifique Synthétique Dissimulé',
        weapon: 'Force Cybernétique Surhumaine & Ordre Spécial 937',
        hp: 380,
        armor: 30,
        trophy: 'Module d\'Ordre Spécial 937 Weyland-Yutani',
        isSynthetic: true
      },
      {
        id: 'jonesy',
        name: 'Jonesy le Chat de Bord',
        role: 'Compagnon de Survie Félin',
        weapon: 'Agilité Féline & Feulements d\'Alerte',
        hp: 60,
        armor: 0,
        trophy: 'Collier Gravé Jonesy du Nostromo',
        isMascot: true
      }
    ]
  },

  // 4. Équipage Mercenaire du Betty & Ripley 8 (Alien Resurrection 1997)
  {
    id: 'squad_betty_mercenaries_1997',
    name: 'Équipage Contrebandier du Cargo Le Betty & Ripley 8',
    shortName: 'Mercenaires du Betty (6 Combattants)',
    category: 'MERCENARY_SYNDICATE',
    scale: 'MOYEN',
    totalMembers: 6,
    originMedia: 'Alien: Resurrection (1997, Jean-Pierre Jeunet)',
    biomeId: 'colony',
    recommendedBiome: 'Station Orbitale USM Auriga',
    description: 'Les contrebandiers sans scrupules du Betty alliés au clone hybride Ripley 8 pour s\'enfuir de l\'USM Auriga submergée de Xénos.',
    tactics: 'Tir acrobatique aux pistolets Draco jumelés, armes lourdes de mercenaires et réflexes hybrides à sang acide.',
    totalHonorReward: 5200,
    soloVariantId: 'alien_base_ripley_8_resurrection_hybrid',
    members: [
      {
        id: 'ripley8',
        name: 'Ripley 8 (Clone Hybride Xéno-Humain)',
        role: 'Prédatrice Hybride Suprême',
        weapon: 'Griffes Acérées, Sang Acide & Fusil Draco',
        hp: 420,
        armor: 35,
        trophy: 'Échantillon d\'ADN Recombinant Sang Acide Ripley 8'
      },
      {
        id: 'johner',
        name: 'Johner (Mercenaire Lourd)',
        role: 'Brute de Choc',
        weapon: 'Fusil de Chasse Calibre 10 à Pompe & Grenades',
        hp: 340,
        armor: 25,
        trophy: 'Fusil Lourd Modifié de Johner'
      },
      {
        id: 'christie',
        name: 'Christie (Pistolero Tactique)',
        role: 'Tireur d\'Élite Acrobatique',
        weapon: 'Doubles Pistolets Draco Asservis sur Harnais de Poignets',
        hp: 310,
        armor: 20,
        trophy: 'Harnais Articulé de Doubles Pistolets Draco'
      },
      {
        id: 'call',
        name: 'Annalee Call (Synthétique Auton)',
        role: 'Spécialiste Sabotage',
        weapon: 'Pistolet Calibre 9mm & Piratage Neurale Auriga',
        hp: 350,
        armor: 30,
        trophy: 'Processeur Neurale Auton d\'Annalee Call',
        isSynthetic: true
      },
      {
        id: 'elgyn',
        name: 'Frank Elgyn',
        role: 'Capitaine Contrebandier',
        weapon: 'Revolver Lourd & Fusil Automatique',
        hp: 290,
        armor: 20,
        trophy: 'Boussole Interstellaire du Capitaine Elgyn'
      },
      {
        id: 'vriess',
        name: 'Dom Vriess',
        role: 'Mécanicien Cybernétisé',
        weapon: 'Fauteuil Roulant Motorisé Blindé avec Canon Dissimulé',
        hp: 300,
        armor: 35,
        trophy: 'Batterie Hydraulique de Fauteuil de Combat Vriess'
      }
    ]
  },

  // 5. Patrouille d'Androïdes Seegson Working Joes (Alien: Isolation 2014)
  {
    id: 'squad_seegson_working_joes_pack',
    name: 'Patrouille de Sécurité Industrielle Seegson Working Joes',
    shortName: 'Meute Working Joes (5 Synthétiques)',
    category: 'SYNTHETIC_PACK',
    scale: 'MOYEN',
    totalMembers: 5,
    originMedia: 'Alien: Isolation (2014, Creative Assembly)',
    biomeId: 'mothership',
    recommendedBiome: 'Station Spatiale Sébastopol — Noyau Réacteur',
    description: 'Une unité de patrouille d\'androïdes Seegson déréglés appliquant les protocoles meurtriers de l\'IA Apollo, comprenant des unités Hazmat électrifiées.',
    tactics: 'Avancée lente et implacable en ligne, insensibilité totale aux tirs légers, étranglement bionique et décharges de 10 000 volts.',
    totalHonorReward: 4400,
    soloVariantId: 'alien_base_seegson_working_joe_electrified',
    members: [
      {
        id: 'joe_hazmat_1',
        name: 'Working Joe Hazmat Alpha (Haute Tension)',
        role: 'Unité de Choc Électrifiée',
        weapon: 'Gants Isolants 10 000 Volts & Clé de Sas',
        hp: 380,
        armor: 40,
        trophy: 'Condensateur Haute Tension 10kV Working Joe'
      },
      {
        id: 'joe_hazmat_2',
        name: 'Working Joe Hazmat Beta',
        role: 'Unité Électrifiée d\'Encerclement',
        weapon: 'Décharge Statique & Matraque Industrielle',
        hp: 370,
        armor: 40,
        trophy: 'Masque Industriel Hazmat Seegson'
      },
      {
        id: 'joe_standard_1',
        name: 'Working Joe Ouvrier 01',
        role: 'Étrangleur Bionique',
        weapon: 'Poigne Métallique Hydraulique & Tuyau d\'Acier',
        hp: 320,
        armor: 25,
        trophy: 'Puce de Commande Neurale Seegson'
      },
      {
        id: 'joe_standard_2',
        name: 'Working Joe Ouvrier 02',
        role: 'Étrangleur Bionique',
        weapon: 'Poigne Métallique & Chalumeau de Maintenance',
        hp: 320,
        armor: 25,
        trophy: 'Module Oculaire Luminescent Working Joe'
      },
      {
        id: 'joe_standard_3',
        name: 'Working Joe Ouvrier 03',
        role: 'Sentinelle Réseau Apollo',
        weapon: 'Émetteur d\'Alarme Réseau Apollo & Barre de Fer',
        hp: 310,
        armor: 25,
        trophy: 'Puce d\'Instruction Meurtrière Apollo Décryptée'
      }
    ]
  },

  // 6. Bande de Guerre Comanche des Grandes Plaines (Prey 2022)
  {
    id: 'squad_comanche_war_party_1719',
    name: 'Bande de Guerre Comanche des Grandes Plaines 1719',
    shortName: 'Guerriers Comanches (5 Pisteurs & Naru)',
    category: 'TRIBAL_WAR_PARTY',
    scale: 'MOYEN',
    totalMembers: 5,
    originMedia: 'Prey (2022, Dan Trachtenberg)',
    biomeId: 'jungle',
    recommendedBiome: 'Forêts Boréales & Rivières des Grandes Plaines',
    description: 'Naru, son frère Taabe et les meilleurs chasseurs de la tribu Comanche unissant leurs forces pour repousser le Predator Féral.',
    tactics: 'Tir d\'embuscade à l\'arc composite, diversion par pièges en corde de cuir, tomahawk de jet et utilisation de la flore pour masquer la chaleur corporelle.',
    totalHonorReward: 4900,
    soloVariantId: 'canon251_chasseur_comanche_cachee',
    members: [
      {
        id: 'taabe',
        name: 'Taabe (Chef de Guerre & Grand Chasseur)',
        role: 'Champion Tribal de Choc',
        weapon: 'Lance de Guerre en Fer, Tomahawk d\'Os & Arc Réflexe',
        hp: 340,
        armor: 15,
        trophy: 'Lance Cérémoniale de Chef de Guerre Comanche'
      },
      {
        id: 'naru',
        name: 'Naru (Pisteuse & Herboriste)',
        role: 'Stratège de l\'Ombre & Camouflage Végétal',
        weapon: 'Tomahawk Lié par Corde, Arc & Fleur Orange d\'Abaissement Thermique',
        hp: 300,
        armor: 10,
        trophy: 'Tomahawk à Corde de Rappel & Fleurs d\'Orange Séchées',
        canColdCamouflage: true
      },
      {
        id: 'huupi',
        name: 'Huupi (Pisteur Vétéran)',
        role: 'Maître des Traces',
        weapon: 'Arc de Chasse en Frêne & Flèches de Silex',
        hp: 270,
        armor: 10,
        trophy: 'Carquois Tressé de Flèches en Silex'
      },
      {
        id: 'wasape',
        name: 'Wasape (Guerrier Féroce)',
        role: 'Combattant Rapproché',
        weapon: 'Masse de Guerre Osseuse & Couteau en Obsidienne',
        hp: 290,
        armor: 15,
        trophy: 'Masse de Guerre en Mâchoire d\'Ours'
      },
      {
        id: 'sari',
        name: 'Sari (Chienne de Chasse Loyal)',
        role: 'Pisteuse Canine & Harcèlement',
        weapon: 'Crocs Acérés & Flair Infatigable',
        hp: 120,
        armor: 0,
        trophy: 'Collier de Cuir Tressé de Sari',
        isMascot: true
      }
    ]
  },

  // 7. Équipe d'Expédition Pyramide Bouvetøya (AVP 2004)
  {
    id: 'squad_bouvetoya_expedition_2004',
    name: 'Équipe d\'Expédition Pyramide Sous-Glaciaire Bouvetøya',
    shortName: 'Expédition Bouvetøya (5 Membres)',
    category: 'MERCENARY_SYNDICATE',
    scale: 'MOYEN',
    totalMembers: 5,
    originMedia: 'Alien vs. Predator (2004, Paul W.S. Anderson)',
    biomeId: 'colony',
    recommendedBiome: 'Station Baleinière de Bouvetøya & Pyramide Souterraine',
    description: 'L\'équipe scientifique et de mercenaires de Charles Bishop Weyland découvrant le terrain de chasse rituel des Yautja sous 700 mètres de glace.',
    tactics: 'Mitraillage aux fusils H&K G36, cartographie thermique satellite et guidage de terrain par Lex Woods.',
    totalHonorReward: 4800,
    soloVariantId: 'alien_base_alexa_lex_woods_guide',
    members: [
      {
        id: 'lex',
        name: 'Alexa « Lex » Woods',
        role: 'Guide Environnementale Polaire',
        weapon: 'Piolets d\'Escalade en Titane & Pistolet 9mm',
        hp: 310,
        armor: 20,
        trophy: 'Marque Cérémoniale Scar sur Joue de Lex'
      },
      {
        id: 'stafford',
        name: 'Max Stafford (Chef de la Sécurité)',
        role: 'Commandant Tactique de Protection',
        weapon: 'Fusil d\'Assaut HK G36C & Pistolet Tactique',
        hp: 310,
        armor: 30,
        trophy: 'Fusil d\'Assaut HK G36C de Stafford'
      },
      {
        id: 'weyland',
        name: 'Charles Bishop Weyland',
        role: 'Fondateur Weyland Corporation',
        weapon: 'Canne d\'Appui & Stylet Dissimulé en Or',
        hp: 200,
        armor: 10,
        trophy: 'Stylet d\'Or Millésimé Weyland Corporation'
      },
      {
        id: 'derosa',
        name: 'Dr. Sebastian de Rosa',
        role: 'Archéologue & Linguiste',
        weapon: 'Piolet Géologique & Veste Matelassée Moutarde',
        hp: 240,
        armor: 15,
        trophy: 'Carnet de Décryptage Cunéiforme de De Rosa'
      },
      {
        id: 'guard',
        name: 'Mercenaire Weyland de Forage',
        role: 'Appui Balistique de Sécurité',
        weapon: 'Fusil à Pompe Franchi SPAS-12 & Fusées Éclairantes',
        hp: 270,
        armor: 25,
        trophy: 'Plaque Corporatiste Weyland Security'
      }
    ]
  },

  // 8. Commando Black Ops Weyland-Yutani de Confinement (Dark Descent / Defiance)
  {
    id: 'squad_weyland_blackops_containment',
    name: 'Commando Black Ops de Bio-Confinement Weyland-Yutani',
    shortName: 'Commando Black Ops WY (5 Opérateurs)',
    category: 'MERCENARY_SYNDICATE',
    scale: 'MOYEN',
    totalMembers: 5,
    originMedia: 'Aliens: Dark Descent (2023) / Aliens: Defiance',
    biomeId: 'colony',
    recommendedBiome: 'Laboratoire Secret de Quarantaine Orbitale',
    description: 'Unité d\'intervention secrète envoyée pour neutraliser tout témoin et capturer des spécimens vivants pour les divisions d\'armes biologiques.',
    tactics: 'Grenades IEM anti-bio-masque, tirs de barrage aux munitions perforantes de tungstène et blindages composites absorbant le plasma.',
    totalHonorReward: 5100,
    soloVariantId: 'alien_base_zula_hendricks_defiance_marine',
    members: [
      {
        id: 'commander',
        name: 'Commandant d\'Intervention Black Ops',
        role: 'Chef Tactique Haute Sécurité',
        weapon: 'Fusil Lourd Weyland W-90 & Visière Thermique Multi-Spectres',
        hp: 350,
        armor: 45,
        trophy: 'Visière Multi-Spectres Black Ops Weyland'
      },
      {
        id: 'heavy_synth',
        name: 'Synthétique de Combat Wey-Yu Modèle Lourd',
        role: 'Bouclier Humanoïde Bionique',
        weapon: 'Canon Automatique 20mm & Châssis Titane Renforcé',
        hp: 420,
        armor: 50,
        trophy: 'Plaque Blindée Frontale de Synthétique Lourd',
        isSynthetic: true
      },
      {
        id: 'technician',
        name: 'Opérateur IEM & Cyber-Guerre',
        role: 'Neutralisateur de Masques et Technologies',
        weapon: 'Lanceur de Grenades IEM & Fusil à Impulsion',
        hp: 280,
        armor: 30,
        trophy: 'Déclencheur d\'Impulsion Électromagnétique Portatif'
      },
      {
        id: 'infiltrator_1',
        name: 'Opérateur d\'Assaut Alpha',
        role: 'Tir Rapproché & Neutralisation',
        weapon: 'Carabine Tactique Silencieuse & Mines Détonantes',
        hp: 290,
        armor: 35,
        trophy: 'Silencieux Titane d\'Arme Black Ops'
      },
      {
        id: 'infiltrator_2',
        name: 'Opérateur d\'Assaut Beta',
        role: 'Tir Rapproché & Gaz Incapacitant',
        weapon: 'Carabine Tactique & Grenades Neuro-Toxiques',
        hp: 290,
        armor: 35,
        trophy: 'Masque Filtrant Gaz Neuro-Toxique'
      }
    ]
  },

  // 9. Brigade Tactique LAPD du Lieutenant Harrigan — Los Angeles 1997 (Héros Predator 2)
  {
    id: 'squad_p2_lapd_harrigan_1997',
    name: 'Brigade Tactique Criminelle LAPD — Lieutenant Mike Harrigan',
    shortName: 'Brigade LAPD Harrigan (4 Détectives)',
    category: 'LAW_ENFORCEMENT',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator 2 (1990, Stephen Hopkins)',
    biomeId: 'los_angeles_1997',
    recommendedBiome: 'Los Angeles 1997 — Chasse de Chaleur',
    description: 'L\'équipe de flics d\'élite du LAPD traquant le City Hunter au milieu de la guerre des cartels et de la canicule.',
    tactics: 'Tirs de barrage coordonnés Desert Eagle/Beretta, replis tactiques en ruelle urbaine et assaut de bélier au Benelli M1.',
    totalHonorReward: 4800,
    soloVariantId: 'alien_base_mike_harrigan_lapd',
    members: [
      {
        id: 'harrigan',
        name: 'Lieutenant Mike Harrigan',
        role: 'Commandant d\'Intervention de Choc',
        weapon: 'Pistolet Desert Eagle .50 AE & Fusil Benelli M1 Super 90',
        hp: 340,
        armor: 25,
        trophy: 'Pistolet à Silex Raphael Adolini 1715 de Harrigan'
      },
      {
        id: 'danny',
        name: 'Détective Danny Archuleta',
        role: 'Appui Balistique & Relevé d\'Indices',
        weapon: 'Pistolet Smith & Wesson 4506 .45 ACP & Dague Tactique',
        hp: 260,
        armor: 20,
        trophy: 'Pointe de Lance Yautja Récupérée par Danny'
      },
      {
        id: 'leona',
        name: 'Détective Leona Cantrell',
        role: 'Tir de Couverture & Flanc Rapproché',
        weapon: 'Pistolet Beretta 92FS & Gilet Pare-Balles Renforcé',
        hp: 270,
        armor: 20,
        trophy: 'Insigne de Détective LAPD de Leona Cantrell'
      },
      {
        id: 'lambert',
        name: 'Détective Jerry Lambert (« The Lone Ranger »)',
        role: 'Tir d\'Interception Rapide',
        weapon: 'Revolver Colt Python .357 Magnum & Pistolet Mitrailleur MP5',
        hp: 250,
        armor: 15,
        trophy: 'Boucle de Ceinture Lone Ranger de Jerry Lambert'
      }
    ]
  },

  // 10. Syndicat Vaudou Jamaïcain & Gang Colombien — Los Angeles 1997 (Méchants Predator 2)
  {
    id: 'squad_p2_cartel_king_willie_posse',
    name: 'Syndicat Vaudou Jamaïcain & Cartel Colombien — King Willie',
    shortName: 'Cartel Vaudou & Gangs (5 Gangsters)',
    category: 'CRIME_CARTEL',
    scale: 'MOYEN',
    totalMembers: 5,
    originMedia: 'Predator 2 (1990, Stephen Hopkins)',
    biomeId: 'los_angeles_1997',
    recommendedBiome: 'Los Angeles 1997 — Chasse de Chaleur',
    description: 'Alliance des barons criminels de Los Angeles : les sorciers vaudous jamaïcains lourdement armés et les tueurs colombiens à gages.',
    tactics: 'Tirs de rafales aveugles aux pistolets mitrailleurs, embuscades dans la fumée rituelle et attaques à la machette.',
    totalHonorReward: 4600,
    soloVariantId: 'alien_base_king_willie_voodoo_priest',
    members: [
      {
        id: 'king_willie',
        name: 'King Willie (Patriarche Occulte Vaudou)',
        role: 'Chef Spirituel & Maître d\'Armes',
        weapon: 'Canne-Épée Cérémoniale en Os & Amulette de Vision',
        hp: 310,
        armor: 15,
        trophy: 'Canne Rituelle en Os Sculpté de King Willie'
      },
      {
        id: 'ramon_scorpio',
        name: 'Ramon Vega (« El Scorpio »)',
        role: 'Artilleur Lourd Colombien',
        weapon: 'Doubles Pistolets Mitrailleurs MAC-10 & Pointeur Laser',
        hp: 280,
        armor: 20,
        trophy: 'Pendentif Scorpione en Or Massif'
      },
      {
        id: 'voodoo_enforcer',
        name: 'Exécuteur Jamaïcain Vaudou Lourd',
        role: 'Tir de Saturation Automatique',
        weapon: 'Fusil d\'Assaut Bullpup Steyr AUG & Machette Ciselée',
        hp: 290,
        armor: 20,
        trophy: 'Machette Rituelle Ciselée Vaudou'
      },
      {
        id: 'cartel_sniper',
        name: 'Tireur d\'Élite du Cartel de Drogue',
        role: 'Tir Rapproché Meurtrier',
        weapon: 'Fusil à Pompe à Canon Scié & Pistolet Nickelé',
        hp: 240,
        armor: 15,
        trophy: 'Montre en Or Plaquée du Cartel'
      },
      {
        id: 'demolition_thug',
        name: 'Pyrotechnicien Urbain du Gang',
        role: 'Explosifs & Fumigènes',
        weapon: 'Cocktails Molotov & Bâtons de Dynamite Industrielle',
        hp: 230,
        armor: 10,
        trophy: 'Harnais de Détonateurs du Cartel'
      }
    ]
  },

  // 11. Groupe des Proies Évadées de la Réserve — Planète Chasseresse 2010 (Héros Predators)
  {
    id: 'squad_predators_royce_survivors_2010',
    name: 'Collectif des Proies Évadées de la Réserve — Planète-Chasseresse',
    shortName: 'Évadés de la Réserve (7 Tueurs)',
    category: 'CIVILIAN_SURVIVORS',
    scale: 'MOYEN',
    totalMembers: 7,
    originMedia: 'Predators (2010, Nimród Antal)',
    biomeId: 'jungle',
    recommendedBiome: 'Jungle de Réserve — Planète Chasseresse',
    description: 'Les tueurs les plus dangereux de la Terre largués vivants sur la planète-réserve des Super Predators, unis sous le commandement pragmatique de Royce.',
    tactics: 'Tir d\'élite Blaser R93 à longue distance, appui minigun Spetsnaz de Nikolai, duel au katana de Hanzo et grenades incendiaires de Royce.',
    totalHonorReward: 5600,
    soloVariantId: 'alien_base_royce_mercenaire_2010',
    members: [
      {
        id: 'royce',
        name: 'Royce (Mercenaire d\'Élite)',
        role: 'Commandant Tactique & Chasseur Pragmatique',
        weapon: 'Fusil Automatique AA-12 Calibre 12 & Machette de Survie',
        hp: 350,
        armor: 25,
        trophy: 'Fusil Automatique AA-12 & Machette de Royce'
      },
      {
        id: 'isabelle',
        name: 'Isabelle (Sniper d\'Élite Tsahal)',
        role: 'Tir de Précision Longue Portée',
        weapon: 'Fusil de Précision Blaser R93 LRS2 à Pointeur Laser',
        hp: 260,
        armor: 15,
        trophy: 'Lunette Thermique Blaser R93 d\'Isabelle'
      },
      {
        id: 'nikolai',
        name: 'Nikolai Fedorov (Spetsnaz Alpha Russe)',
        role: 'Puissance de Feu Lourde',
        weapon: 'Minigun Rotatif Portatif M134 & Double Claymore',
        hp: 330,
        armor: 30,
        trophy: 'Insigne Alpha Spetsnaz & Détonateur de Nikolai'
      },
      {
        id: 'hanzo',
        name: 'Hanzo (Enforcer Yakuza Inagawa-kai)',
        role: 'Maître Duelliste de Mêlée',
        weapon: 'Katana Ancestral Ciselé & Pistolet Beretta 92FS',
        hp: 270,
        armor: 10,
        trophy: 'Garde Tsuba d\'Or de Katana de Hanzo'
      },
      {
        id: 'mombasa',
        name: 'Mombasa (Guerrier RUF Sierra Leone)',
        role: 'Pisteur & Chasseur Furtif',
        weapon: 'Fusil d\'Assaut AK-47 & Machette Africaine',
        hp: 280,
        armor: 15,
        trophy: 'Amulette Protectrice en Dent de Léopard'
      },
      {
        id: 'stans',
        name: 'Walter Stans (Condamné à Mort)',
        role: 'Attaque Surprise Furieuse',
        weapon: 'Couteau de Cuisine Artisanal & Dague de Cou',
        hp: 250,
        armor: 10,
        trophy: 'Dague de Survie de Détenu de Stans'
      },
      {
        id: 'edwin',
        name: 'Dr. Edwin (Médecin Empoisonneur)',
        role: 'Neurotoxines & Pièges Toxiques',
        weapon: 'Bistouri Chirurgical & Toxines Neuro-Incapacitantes',
        hp: 210,
        armor: 5,
        trophy: 'Fiole de Neurotoxine Paralysante d\'Edwin'
      }
    ]
  },

  // 12. Trinité des Super Predators & Meute Hell-Hounds — Clan Berserker (Méchants Predators)
  {
    id: 'squad_predators_super_clan_berserkers',
    name: 'Trinité des Super Predators & Meute Hell-Hounds — Clan Berserker',
    shortName: 'Clan Super Predators (5 Chasseurs)',
    category: 'SUPER_PREDATORS',
    scale: 'MOYEN',
    totalMembers: 5,
    originMedia: 'Predators (2010, Nimród Antal)',
    biomeId: 'jungle',
    recommendedBiome: 'Jungle de Réserve — Planète Chasseresse',
    description: 'Le clan impitoyable des Super Predators renégats dominant la planète-réserve : Mr. Black, Falconer, Tracker et leurs molosses épineux.',
    tactics: 'Battue menée par les molosses Hell-Hounds pour rabattre les proies vers le canon plasma rotatif de Berserker et le drone aérien de Falconer.',
    totalHonorReward: 6200,
    soloVariantId: 'prey_super_predator_berserker',
    members: [
      {
        id: 'berserker_mr_black',
        name: 'Berserker Predator (« Mr. Black »)',
        role: 'Seigneur de Clan Super Predator',
        weapon: 'Plasmacaster Gatling Lourd & Lame de Poignet Simple Géante',
        hp: 440,
        armor: 45,
        trophy: 'Bio-Masque en Mâchoire d\'Os de Xénomorphe de Mr. Black'
      },
      {
        id: 'falconer',
        name: 'Falconer Predator (Maître de la Reconnaissance)',
        role: 'Éclaireur Aérien & Mêlée Honorable',
        weapon: 'Drone Faucon de Reconnaissance & Doubles Wrist-Blades',
        hp: 380,
        armor: 35,
        trophy: 'Drone Faucon Cybernétique de Reconnaissance'
      },
      {
        id: 'tracker_flusher',
        name: 'Tracker Predator (« Flusher »)',
        role: 'Maître des Chiens de Battue',
        weapon: 'Canons Plasma Portatifs Doubles & Corne de Traque',
        hp: 390,
        armor: 40,
        trophy: 'Défenses Osseuses de Masque de Tracker'
      },
      {
        id: 'hell_hound_alpha',
        name: 'Hell-Hound Alpha de Meute',
        role: 'Traqueur Blindé Véloce',
        weapon: 'Mâchoires Broyeuses & Épines Osseuses Dorsales',
        hp: 290,
        armor: 30,
        trophy: 'Corne Osseuse Épineuse de Hell-Hound Alpha'
      },
      {
        id: 'hell_hound_beta',
        name: 'Hell-Hound Rabatteur',
        role: 'Choc & Désarçonnement',
        weapon: 'Griffes Lacérantes & Morsure Corrosive',
        hp: 250,
        armor: 25,
        trophy: 'Collier en Cuir Yautja de Molosse de Chasse'
      }
    ]
  },

  // 13. Escouade des Rebuts « The Loonies » — 2018 (Héros The Predator)
  {
    id: 'squad_the_predator_loonies_2018',
    name: 'Escouade d\'Intervention des Rebuts « The Loonies » — 2018',
    shortName: 'Escouade The Loonies (6 Vétérans)',
    category: 'MILITARY_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 6,
    originMedia: 'The Predator (2018, Shane Black)',
    biomeId: 'stargazer_blacksite',
    recommendedBiome: 'Complexe de Confinement Stargazer',
    description: 'Le groupe hétéroclite de soldats vétérans traumatisés mené par Quinn McKenna et le Dr. Casey Bracket pour détruire l\'Upgrade Predator.',
    tactics: 'Attaques kamikazes improvisées, tirs d\'armes lourdes M249, diversion explosive et utilisation de grenades à plasma dérobées.',
    totalHonorReward: 5200,
    soloVariantId: 'alien_base_quinn_mckenna_ranger_2018',
    members: [
      {
        id: 'quinn',
        name: 'Capitaine Quinn McKenna',
        role: 'Sniper Ranger & Chef d\'Assaut',
        weapon: 'Carabine Tactique M4A1 & Fragment de Masque Yautja',
        hp: 330,
        armor: 25,
        trophy: 'Visière Balistique Modulaire de McKenna'
      },
      {
        id: 'nebraska',
        name: 'Nebraska Williams (Ex-Marine)',
        role: 'Second d\'Assaut & Sacrifié Volontaire',
        weapon: 'Fusil à Pompe Franchi SPAS-12 & Grenades Plasmiques',
        hp: 310,
        armor: 20,
        trophy: 'Briquet Militaire Gravé de Nebraska Williams'
      },
      {
        id: 'coyle',
        name: 'Coyle (Vétéran Artilleur)',
        role: 'Mitrailleur de Suppression',
        weapon: 'Mitrailleuse d\'Assaut M249 SAW & Tirs Répétés',
        hp: 290,
        armor: 20,
        trophy: 'Bande de Cartouches 5.56mm de Coyle'
      },
      {
        id: 'baxley',
        name: 'Baxley (Tireur Tactique)',
        role: 'Flanc & Tir Croisé Continu',
        weapon: 'Carabine d\'Assaut M4A1 & Viseur Holographique',
        hp: 280,
        armor: 20,
        trophy: 'Insigne Militaire d\'Opérations de Baxley'
      },
      {
        id: 'nettles',
        name: 'Nettles (Pilote d\'Hélicoptère)',
        role: 'Soutien Balistique & Mobilité',
        weapon: 'Pistolet Mitrailleur MP5A3 & Fumigènes d\'Extraction',
        hp: 250,
        armor: 15,
        trophy: 'Casque de Pilote d\'Hélicoptère de Nettles'
      },
      {
        id: 'casey_bracket',
        name: 'Dr. Casey Bracket (Biologiste Évolutionniste)',
        role: 'Soutien Scientifique & Neutralisation Chimique',
        weapon: 'Fusil à Fléchettes Tranquillisantes & Pistolet Glock 19',
        hp: 240,
        armor: 10,
        trophy: 'Seringue d\'Anesthésique Génétique du Dr. Bracket'
      }
    ]
  },

  // 14. Division Spéciale Stargazer & Molosses Modifiés (Méchants The Predator)
  {
    id: 'squad_the_predator_stargazer_strike',
    name: 'Division Spéciale Stargazer & Molosses Modifiés — Projet Récupération',
    shortName: 'Division Stargazer (5 Spécialistes)',
    category: 'MERCENARY_SYNDICATE',
    scale: 'MOYEN',
    totalMembers: 5,
    originMedia: 'The Predator (2018, Shane Black)',
    biomeId: 'stargazer_blacksite',
    recommendedBiome: 'Complexe de Confinement Stargazer',
    description: 'Forces armées gouvernementales privatisées du Projet Stargazer dirigées par Will Traeger, équipées d\'armes anti-matériel et de molosses hybridés.',
    tactics: 'Filets électrifiés en alliage supraconducteur, snipers lourds Barrett .50 et molosses génétiquement altérés insensibles au feu.',
    totalHonorReward: 5400,
    soloVariantId: 'prey_yautja_assassin_stargazer',
    members: [
      {
        id: 'will_traeger',
        name: 'Will Traeger (Directeur Exécutif Stargazer)',
        role: 'Commandant Suprême du Projet',
        weapon: 'Canon à Énergie Plasmique d\'Épaule Reconditionné',
        hp: 320,
        armor: 30,
        trophy: 'Plasmacaster Humain Modifié de Traeger'
      },
      {
        id: 'sean_keyes',
        name: 'Sean Keyes (Chef de Laboratoire OWLF)',
        role: 'Technologie d\'Analyse en Direct',
        weapon: 'Pistolet Mitrailleur P90 & Scanner Multi-Spectres',
        hp: 250,
        armor: 15,
        trophy: 'Scanner Thermo-Spectral de Laboratoire Stargazer'
      },
      {
        id: 'stargazer_sniper',
        name: 'Sniper Anti-Matériel Stargazer',
        role: 'Tir Lourd de Neutralisation Blindée',
        weapon: 'Fusil Anti-Matériel Barrett M82A1 Calibre .50 BMG',
        hp: 270,
        armor: 25,
        trophy: 'Lunette Balistique Anti-Matériel .50 BMG'
      },
      {
        id: 'net_specialist',
        name: 'Opérateur de Filet Électrifié Stargazer',
        role: 'Entrave & Confinement Cryo-Électrique',
        weapon: 'Lanceur de Filets Alliage Tungstène Électrocutant',
        hp: 280,
        armor: 30,
        trophy: 'Déclencheur de Filet Supraconducteur Stargazer'
      },
      {
        id: 'hybrid_hound',
        name: 'Molosse Predator Modifié Génétiquement',
        role: 'Traqueur de Choc Hybride',
        weapon: 'Dents d\'Alliage & Écailles Réfractaires de Chitine',
        hp: 360,
        armor: 35,
        trophy: 'Plaque Crânienne Hybride de Molosse Stargazer'
      }
    ]
  },

  // 15. Collectif des Survivants Civils de Gunnison — 2007 (Héros AVP: Requiem)
  {
    id: 'squad_avpr_gunnison_citizens_2007',
    name: 'Collectif des Survivants Civils de Gunnison — Nuit de l\'Épidémie',
    shortName: 'Survivants de Gunnison (5 Résistants)',
    category: 'CIVILIAN_SURVIVORS',
    scale: 'MOYEN',
    totalMembers: 5,
    originMedia: 'Aliens vs. Predator: Requiem (2007, Frères Strause)',
    biomeId: 'gunnison_outbreak',
    recommendedBiome: 'Gunnison — Nuit de l\'Épidémie',
    description: 'Les habitants armés et la pilote militaire Kelly O\'Brien traversant la ville de Gunnison submergée par les Xénomorphes sous un déluge diluvien.',
    tactics: 'Tirs de fusils de chasse en couloir fermé, balayage à la vision nocturne militaire et défense en étoile à l\'hôpital.',
    totalHonorReward: 4700,
    soloVariantId: 'alien_base_kelly_obrien_survivor_2007',
    members: [
      {
        id: 'kelly_obrien',
        name: 'Kelly O\'Brien (Pilote US Army)',
        role: 'Leader Militaire Tactique',
        weapon: 'Carabine M4 avec Vision Nocturne & Grenades Fumigènes',
        hp: 310,
        armor: 20,
        trophy: 'Vision Nocturne Militaire & Dog Tags de Kelly O\'Brien'
      },
      {
        id: 'dallas_howard',
        name: 'Dallas Howard (Survivant Vétéran)',
        role: 'Assaut Rapproché de Ruelles',
        weapon: 'Fusil de Chasse Remington 870 Calibre 12 & Pistolet 9mm',
        hp: 290,
        armor: 15,
        trophy: 'Ceinturon de Cartouches de Chasse de Dallas'
      },
      {
        id: 'sheriff_morales',
        name: 'Shérif Eddie Morales',
        role: 'Contrôle Urbain & Cordon de Crise',
        weapon: 'Revolver Smith & Wesson .357 Magnum & Radio de Crise',
        hp: 270,
        armor: 20,
        trophy: 'Étoile de Shérif du Comté de Gunnison'
      },
      {
        id: 'ricky_howard',
        name: 'Ricky Howard',
        role: 'Flanc & Tir Rapide',
        weapon: 'Pistolet Automatique Glock 17 & Torche Tactique',
        hp: 230,
        armor: 10,
        trophy: 'Clés du Magasin d\'Armes de Sport de Gunnison'
      },
      {
        id: 'colorado_national_guard',
        name: 'Fusilier de la Garde Nationale du Colorado',
        role: 'Appui Militaire Régulier',
        weapon: 'Fusil d\'Assaut M16A2 & Gilet Pare-Éclats PASGT',
        hp: 280,
        armor: 25,
        trophy: 'Insigne de Bras de la Garde Nationale du Colorado'
      }
    ]
  },

  // 16. Essaim Hybride du Predalien Chet & Drones d'Infiltration (Méchants AVP: Requiem)
  {
    id: 'squad_avpr_predalien_infestation_swarm',
    name: 'Essaim Hybride du Predalien Chet & Drones d\'Infiltration',
    shortName: 'Essaim du Predalien (5 Créatures)',
    category: 'XENO_INFESTATION',
    scale: 'MOYEN',
    totalMembers: 5,
    originMedia: 'Aliens vs. Predator: Requiem (2007, Frères Strause)',
    biomeId: 'gunnison_outbreak',
    recommendedBiome: 'Gunnison — Nuit de l\'Épidémie',
    description: 'La ruche hospitalière dévastatrice engendrée par l\'abomination hybride Predalien « Chet », capable d\'inoculer directement des embryons multiples.',
    tactics: 'Charge perforante de la queue Yautja-Xéno, morsures intérieures dévastatrices et couverture corrosive par les guerriers de la ruche.',
    totalHonorReward: 6000,
    soloVariantId: 'prey_predalien_abomination',
    members: [
      {
        id: 'chet_predalien',
        name: 'Le Predalien « Chet » (Matriarche Hybride)',
        role: 'Reine Procréatrice Abominable',
        weapon: 'Queue Épineuse Perforante & Mandibules Yautja Intérieures',
        hp: 460,
        armor: 45,
        trophy: 'Crête Hybride & Mandibules Osseuses de Predalien'
      },
      {
        id: 'hospital_warrior',
        name: 'Guerrier Xénomorphe de la Ruche Hospitalière',
        role: 'Assaut Lourd Corrosif',
        weapon: 'Griffes Tranchantes & Sang Moléculaire Hyper-Acide',
        hp: 310,
        armor: 30,
        trophy: 'Dôme Rayé d\'Acide de Guerrier Hospitalier'
      },
      {
        id: 'sewer_drone',
        name: 'Drone d\'Infiltration des Égouts Pluviaux',
        role: 'Embuscade Submergée Furtive',
        weapon: 'Queue Caudale Aiguë & Mâchoire Pharyngienne',
        hp: 270,
        armor: 25,
        trophy: 'Mâchoire Pharyngienne de Drone des Égouts'
      },
      {
        id: 'acid_runner',
        name: 'Coureur Corrosif de Surface',
        role: 'Vélocité & Flanc Continu',
        weapon: 'Course Quadrupède Rapide & Crachat d\'Acide',
        hp: 250,
        armor: 20,
        trophy: 'Glande d\'Acide Hyper-Concentré de Coureur'
      },
      {
        id: 'maternity_hugger',
        name: 'Facehugger Royal de Maternité',
        role: 'Implantation Parasitaire d\'Urgence',
        weapon: 'Doigts Palmés d\'Étreinte & Dard d\'Oviposition',
        hp: 150,
        armor: 10,
        trophy: 'Queue Préhensile Ligamentaire de Facehugger Royal'
      }
    ]
  },

  // 17. Éclaireuses Jumelles & Pisteurs des Terres Dévastées — Badlands (Héros Badlands)
  {
    id: 'squad_badlands_twin_outcasts',
    name: 'Éclaireuses Jumelles & Pisteurs des Terres Dévastées — Badlands',
    shortName: 'Éclaireuses des Badlands (4 Pisteurs)',
    category: 'WASTELAND_OUTCASTS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Badlands (2025, Dan Trachtenberg)',
    biomeId: 'genna_deathworld',
    recommendedBiome: 'Monde Mortel de Genna — Terres Dévastées',
    description: 'Les deux sœurs jumelles survivant dans les friches radioactives et les citadelles abandonnées, assistées d\'un androïde déclassé et d\'un molosse cyborg.',
    tactics: 'Flèches cryo-thermiques à longue distance, repérage par drone bionique et attaques rapides en terrain accidenté.',
    totalHonorReward: 5000,
    soloVariantId: 'alien_base_thia_badlands_scout_2025',
    members: [
      {
        id: 'thia',
        name: 'Thia (Sœur Aînée Pisteuse)',
        role: 'Tireuse à l\'Arc Composite & Camouflage',
        weapon: 'Arc Haute Tension & Flèches Cryo-Thermiques',
        hp: 300,
        armor: 20,
        trophy: 'Arc Composite Haute Tension des Badlands'
      },
      {
        id: 'tessa',
        name: 'Tessa (Sœur Cadette Technicienne)',
        role: 'Sabotage Cybernétique & Drones',
        weapon: 'Fusil IEM à Impulsion & Mines de Proximité',
        hp: 280,
        armor: 20,
        trophy: 'Décodeur Bionique Portatif des Terres Mortes'
      },
      {
        id: 'nomad_synth',
        name: 'Nomad (Synthétique Déclassé de Chantier)',
        role: 'Bouclier Humanoïde Bionique Reconditionné',
        weapon: 'Marteau Pneumatique Lourd & Châssis Renforcé',
        hp: 360,
        armor: 35,
        trophy: 'Unité Centrale Bionique Déclassée Nomad',
        isSynthetic: true
      },
      {
        id: 'cyber_mastiff',
        name: 'Mastiff Bionique de Piste',
        role: 'Sentinelle Canine Cybernétique',
        weapon: 'Mâchoires en Titane & Détecteur de Mouvements',
        hp: 240,
        armor: 25,
        trophy: 'Capteur Olfactif en Titane de Mastiff Bionique'
      }
    ]
  },

  // 18. Brigade de Récupération Bionique Weyland — Badlands (Méchants Badlands)
  {
    id: 'squad_badlands_weyland_scavenger_brigade',
    name: 'Brigade de Récupération Bionique Weyland — Territoires Interdits',
    shortName: 'Brigade Bionique Weyland (5 Enforcers)',
    category: 'MERCENARY_SYNDICATE',
    scale: 'MOYEN',
    totalMembers: 5,
    originMedia: 'Predator: Badlands (2025, Dan Trachtenberg)',
    biomeId: 'genna_deathworld',
    recommendedBiome: 'Monde Mortel de Genna — Terres Dévastées',
    description: 'Unités de conquête mécanisées envoyées par les corporations pour piller les artefacts aliens et asservir les populations nomades des friches.',
    tactics: 'Tirs de canons cinétiques Gauss, lance-flammes à pression constante et tirs de mitrailleuses automatiques quadri-rotors.',
    totalHonorReward: 5500,
    soloVariantId: 'alien_base_weyland_badlands_overseer',
    members: [
      {
        id: 'weyland_overseer',
        name: 'Superviseur Bionique de Convoi',
        role: 'Commandant d\'Assaut Exosquelette',
        weapon: 'Fusil Cinétique Lourd W-120 & Blindage Renforcé',
        hp: 370,
        armor: 40,
        trophy: 'Noyau Énergétique d\'Exosquelette Weyland'
      },
      {
        id: 'rotor_drone',
        name: 'Drone Quadri-Rotor de Mitraillage Lourd',
        role: 'Appui Aérien Continu',
        weapon: 'Mitrailleuse Rotative Aérienne 7.62mm & Blindage Alliage',
        hp: 280,
        armor: 30,
        trophy: 'Rotor Blindé en Titane de Drone de Conquête'
      },
      {
        id: 'purge_synthetic',
        name: 'Synthétique d\'Incinération Industrielle',
        role: 'Purification Thermique de Zone',
        weapon: 'Lance-Flammes à Haute Pression & Réservoir Dorsal',
        hp: 340,
        armor: 35,
        trophy: 'Buse de Lance-Flammes Haute Pression',
        isSynthetic: true
      },
      {
        id: 'gauss_sniper',
        name: 'Tireur Gauss Anti-Véhicule',
        role: 'Tir Électromagnétique Perforant',
        weapon: 'Fusil Railgun Gauss Portatif à Charge Magnétique',
        hp: 260,
        armor: 25,
        trophy: 'Accélérateur Magnétique de Fusil Railgun'
      },
      {
        id: 'tox_cleaner',
        name: 'Nettoyeur Toxique Chimique',
        role: 'Saturation de Gaz Incapacitant',
        weapon: 'Lanceur de Grenades Neuro-Corrosives & Combinaison NBC',
        hp: 270,
        armor: 25,
        trophy: 'Cartouche Filtrante NBC de Haute Sécurité'
      }
    ]
  },

  // 19. Cercle des Champions Historiques Invoqués — Killers of Killers (Héros Killers of Killers / Prey)
  {
    id: 'squad_killers_of_killers_trio',
    name: 'Cercle des Champions Historiques Invoqués — Tueurs de Tueurs',
    shortName: 'Champions Historiques (4 Guerriers)',
    category: 'TRIBAL_WAR_PARTY',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predators (2010) / Predator: Killer of Killers / Prey',
    biomeId: 'yautja_prime',
    recommendedBiome: 'Arène de Clan — Yautja Prime',
    description: 'Quatre guerriers d\'exception issus d\'époques et de continents distincts, sélectionnés et transportés vivants pour éprouver les plus grands prédateurs.',
    tactics: 'Charge berserker à la hache à deux mains, feintes et contre-attaques parfaites au katana, tirs de carabine de guerre et esquives acrobatiques comanches.',
    totalHonorReward: 5800,
    soloVariantId: 'canon249_duelliste_feodal_samourai',
    members: [
      {
        id: 'samurai_master',
        name: 'Duelliste Samouraï Féodal',
        role: 'Maître Katana du Duel Singulier',
        weapon: 'Katana Forgé Hattori & Armure Laquée Noire',
        hp: 330,
        armor: 25,
        trophy: 'Garde Tsuba d\'Or de Katana Féodal'
      },
      {
        id: 'viking_berserker',
        name: 'Pillard Viking Berserker',
        role: 'Choc Brutal & Démembrement',
        weapon: 'Hache d\'Armes Daneaxe à Deux Mains & Bouclier Rond',
        hp: 360,
        armor: 20,
        trophy: 'Fer de Hache Daneaxe Incrusté d\'Argent'
      },
      {
        id: 'war_pilot',
        name: 'Pilote As de Guerre 1944',
        role: 'Tir Réflexe Rapproché & Machette de Jungle',
        weapon: 'Pistolet Colt M1911 .45 ACP & Couteau Ka-Bar',
        hp: 280,
        armor: 15,
        trophy: 'Blouson d\'Aviateur en Cuir & Couteau Ka-Bar'
      },
      {
        id: 'comanche_champion',
        name: 'Guerrière d\'Élite Comanche',
        role: 'Pisteuse Équilibriste & Furtivité',
        weapon: 'Tomahawk Cérémonial & Arc Réflexe à Flèches d\'Os',
        hp: 290,
        armor: 15,
        trophy: 'Tomahawk en Silex Noir & Plumes d\'Aigle'
      }
    ]
  },

  // 20. Syndicat Cyber-Génétique Borgia Industries — Concrete Jungle (Méchants Concrete Jungle)
  {
    id: 'squad_concrete_jungle_borgia_syndicate',
    name: 'Syndicat Cyber-Génétique Borgia Industries — New Way City',
    shortName: 'Syndicat Borgia (5 Cyber-Troupiers)',
    category: 'CRIME_CARTEL',
    scale: 'MOYEN',
    totalMembers: 5,
    originMedia: 'Predator: Concrete Jungle (2005, Eurocom / Sierra)',
    biomeId: 'los_angeles_1997',
    recommendedBiome: 'Los Angeles 1997 — Canicule & District Borgia',
    description: 'Le cartel technologique mafieux de Bruno Borgia ayant piraté la technologie Yautja tombée en 1930 pour fabriquer des cyborgs et des hybrides de combat.',
    tactics: 'Brouillage IEM du camouflage de bio-masque, tirs de canons cybernétiques lourds et assauts aux wrist-blades volées.',
    totalHonorReward: 5700,
    soloVariantId: 'alien_base_bruno_borgia_godfather',
    members: [
      {
        id: 'bruno_borgia',
        name: 'Don Bruno Borgia (Le Parrain Bionique)',
        role: 'Seigneur du Syndicat Cybernétique',
        weapon: 'Pistolet Lourd Haute Vélocité & Costume Blindé en Kevlar',
        hp: 350,
        armor: 35,
        trophy: 'Anneau Sigillaire Borgia & Mallette de Données Yautja'
      },
      {
        id: 'cyber_samurai',
        name: 'Mercenaire Cybernétique Katana-Rig',
        role: 'Mêlée Augmentée à Servomoteurs',
        weapon: 'Katana Thermique Motorisé & Wrist-Blades Yautja Piratées',
        hp: 340,
        armor: 35,
        trophy: 'Bras Bionique Servomoteur Katana-Rig'
      },
      {
        id: 'monster_squad_brute',
        name: 'Brute Génétique Monster Squad',
        role: 'Choc Humanoïde Altéré à l\'ADN Yautja',
        weapon: 'Massue Industrielle & Force Décuplée',
        hp: 420,
        armor: 40,
        trophy: 'Implant Génétique Crânien Borgia Industries'
      },
      {
        id: 'infiltrator_cyborg',
        name: 'Cyborg Infiltrateur de Combat Modèle X',
        role: 'Tir Furtif & Visière Thermo-Optique',
        weapon: 'Carabine Silencieuse & Détecteur Infrarouge',
        hp: 290,
        armor: 25,
        trophy: 'Capteur Oculaire Thermo-Optique Borgia'
      },
      {
        id: 'iem_saboteur',
        name: 'Saboteur de Brouillage Anti-Camouflage',
        role: 'Désactivation de Technologie Yautja',
        weapon: 'Générateur d\'Impulsion Électromagnétique Portatif',
        hp: 260,
        armor: 20,
        trophy: 'Micro-Puce de Piratage de Bio-Masque Borgia'
      }
    ]
  },

  // 21. Trio Rituel des Jeunes Sangs Yautja — Bouvetøya 2004 (Antagonistes AVP 2004)
  {
    id: 'squad_avp_young_bloods_trio',
    name: 'Trio Rituel des Jeunes Sangs Yautja — Pyramide Bouvetøya 2004',
    shortName: 'Trio Jeunes Sangs AVP (3 Chasseurs)',
    category: 'SUPER_PREDATORS',
    scale: 'MOYEN',
    totalMembers: 3,
    originMedia: 'AVP: Alien vs. Predator (2004, Paul W.S. Anderson)',
    biomeId: 'bouvetoya_pyramid',
    recommendedBiome: 'Bouvetøya — Pyramide du Blooding',
    description: 'Les trois frères d\'armes Yautja envoyés dans la pyramide souterraine pour accomplir leur rite d\'initiation face aux Xénomorphes.',
    tactics: 'Coordination en triangle dans les couloirs rotatifs de la pyramide, tirs de Plasmacasters cérémoniaux et lancers synchronisés de Shurikens.',
    totalHonorReward: 6400,
    soloVariantId: 'alien_base_scar_young_blood_1719',
    members: [
      {
        id: 'scar_predator',
        name: 'Scar Predator (Jeune Sang Initié Honorable)',
        role: 'Chasseur Cérémonial de Pointe',
        weapon: 'Combi-Stick Rétractable, Shuriken Tri-Lame & Plasmacaster',
        hp: 420,
        armor: 40,
        trophy: 'Bio-Masque Ciselé de la Marque du Sang'
      },
      {
        id: 'celtic_predator',
        name: 'Celtic Predator (Leader d\'Initiation Belliqueux)',
        role: 'Assaut Lourd & Lutte Corporelle',
        weapon: 'Masque Orné d\'Acier, Wrist-Blades Doubles Géantes & Filet',
        hp: 440,
        armor: 45,
        trophy: 'Bio-Masque Orné en Acier Brut de Celtic'
      },
      {
        id: 'chopper_predator',
        name: 'Chopper Predator (Chasseur Agil aux Scimitars)',
        role: 'Flanc Meurtrier Rapide',
        weapon: 'Doubles Lames Scimitars d\'Avant-Bras & Fouet Rachidien',
        hp: 390,
        armor: 35,
        trophy: 'Lames Scimitars d\'Avant-Bras de Chopper'
      }
    ]
  },
  // 22. Expédition des Trappeurs Français & Bûcherons — Grandes Plaines 1719 (Prey 2022)
  {
    id: 'squad_prey_french_voyageurs_1719',
    name: "Expédition des Trappeurs Français & Bûcherons — Grandes Plaines 1719",
    shortName: 'Trappeurs Français 1719 (4 Voyageurs)',
    category: 'HUMAN_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Prey (2022, Dan Trachtenberg)',
    biomeId: 'jungle',
    recommendedBiome: 'Grandes Plaines — Forêt & Campement des Trappeurs',
    description: 'Contingent de trappeurs et bûcherons français impitoyables armés de mousquets, de pistolets à silex et de pièges à loups géants.',
    tactics: 'Embuscade à base de pièges à mâchoires cachés dans la boue, tirs de volée au mousquet et assaut au couperet lourd.',
    totalHonorReward: 4800,
    soloVariantId: 'alien_base_big_beard_voyageur_1719',
    members: [
      {
        id: 'big_beard',
        name: "Capitaine 'Grosse Barbe' (Meneur du Camp)",
        role: 'Commandant de Tir & Chasse Lourde',
        weapon: "Pistolet à Silex Double Canon & Couperet d'Équarrissage",
        hp: 280,
        armor: 20,
        trophy: 'Mousquet Français Gravé & Toison de Castor'
      },
      {
        id: 'raphael_adolini',
        name: 'Raphael Adolini (Navigateur & Traducteur Italien)',
        role: 'Navigateur Télémétrique & Pisteur',
        weapon: 'Pistolet à Silex Miquelet Adolini 1715 & Dague de Marin',
        hp: 220,
        armor: 15,
        trophy: 'Pistolet à Silex Gravé Raphael Adolini 1715'
      },
      {
        id: 'trapper_arbalest',
        name: 'Trappeur Arbalétrier des Forêts',
        role: "Tireur d'Affût à Pointe Barbelée",
        weapon: 'Arbalète de Chasse à Carreaux Barbelés',
        hp: 200,
        armor: 12,
        trophy: 'Carquois en Cuir Brut & Cordon de Tendon'
      },
      {
        id: 'bear_trap_layer',
        name: "Poseur de Pièges d'Acier",
        role: 'Contrôle de Zone & Piégeage Lourd',
        weapon: "Pièges à Mâchoires d'Ours Dentelées & Hachette",
        hp: 210,
        armor: 14,
        trophy: "Mâchoire de Piège d'Ours en Acier Trempé"
      }
    ]
  },

  // 23. Détenus Pénitentiaires de Fiorina 161 (Alien³ 1992)
  {
    id: 'squad_alien3_fiorina_inmates_1992',
    name: "Collectif des Prisonniers de Fiorina 'Fury' 161 (Survivants Réformés)",
    shortName: 'Détenus de Fiorina 161 (4 Résistants)',
    category: 'HUMAN_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien³ (1992, David Fincher)',
    biomeId: 'hive_lv426',
    recommendedBiome: "Fiorina 'Fury' 161 — Fonderie & Dédale de Conduits",
    description: 'Prisonniers et gardiens réformés sans armes à feu de la colonie minière et pénitentiaire Fiorina 161, utilisant torches, solvants et conduits métalliques.',
    tactics: 'Appât mobile dans les corridors de coulée de plomb fondu, dispersion par les sas sous-pression et torches de solvant.',
    totalHonorReward: 5000,
    soloVariantId: 'alien_base_dillon_fiorina_161',
    members: [
      {
        id: 'dillon_preacher',
        name: 'Dillon (Prédicateur & Meneur des Détenus)',
        role: 'Meneur Charismatique & Mêlée Lourde',
        weapon: 'Barre à Mine en Fonte & Torche Haute Pression',
        hp: 310,
        armor: 15,
        trophy: 'Croix Métallique Soudée de Fiorina 161'
      },
      {
        id: 'clemens_doctor',
        name: 'Dr. Jonathan Clemens (Médecin de Bord Déchu)',
        role: 'Soutien Médical & Diagnostic Vital',
        weapon: 'Seringues de Chlorhydrate & Scalpel Chirurgical',
        hp: 190,
        armor: 10,
        trophy: 'Trousse Médicale Hermétique de Fiorina'
      },
      {
        id: 'morse_inmate',
        name: 'Robert Morse (Dernier Témoin Pénitentiaire)',
        role: 'Opérateur de Conduits & Manœuvres de Sas',
        weapon: 'Clé à Molette Lourde & Extincteur à Poudre',
        hp: 210,
        armor: 12,
        trophy: 'Livre Pénitentiaire des Témoins de Fury'
      },
      {
        id: 'golic_cultist',
        name: 'Walter Golic (Fasciné par le Dragon)',
        role: 'Éclaireur Halluciné & Briseur de Verrous',
        weapon: 'Couteau de Cuisine Pénitentiaire & Tisonnier',
        hp: 200,
        armor: 10,
        trophy: 'Camisole de Confinement de Fiorina 161'
      }
    ]
  },

  // 24. Commando Weyland Dog Catchers — Fiorina 161 (Alien³ 1992)
  {
    id: 'squad_alien3_weyland_dog_catchers',
    name: "Commando d'Intervention Weyland-Yutani 'Dog Catchers' — Fiorina 161",
    shortName: 'Dog Catchers Weyland (4 Opérateurs)',
    category: 'WEYLAND_YUTANI',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien³ (1992, David Fincher)',
    biomeId: 'hive_lv426',
    recommendedBiome: 'Fiorina 161 — Hangar de la Navette de Récupération',
    description: "Équipe d'intervention tactique en combinaison biohazard blindée escortant Michael Bishop pour capturer la Reine embryonnaire.",
    tactics: 'Tirs de harpons de confinement cryogénique, filets d\'isolation cellulaire et tirs précis de pistolets mitrailleurs tactiques.',
    totalHonorReward: 5400,
    soloVariantId: 'alien_base_aaron_85_fiorina',
    members: [
      {
        id: 'michael_bishop_leader',
        name: 'Michael Bishop (Représentant Weyland-Yutani)',
        role: 'Commandant Médical Corporatiste',
        weapon: 'Pistolet d\'Insémination Cryo & Mallette Stase',
        hp: 270,
        armor: 30,
        trophy: 'Badge Haute Autorité Bio-Armes Weyland-Yutani'
      },
      {
        id: 'dog_catcher_commando',
        name: 'Fusilier Biohazard Weyland',
        role: 'Tireur d\'Assaut en Combinaison Blindée',
        weapon: 'Carabine Tactique VP-70 & Filet Haute Résistance',
        hp: 260,
        armor: 35,
        trophy: 'Casque Biohazard pressurisé Weyland-Yutani'
      },
      {
        id: 'cryo_handler',
        name: 'Technicien de Cage Cryo-Stase',
        role: 'Neutralisation Cryogénique',
        weapon: 'Canister de Gaz Cryogénique Haute Densité',
        hp: 240,
        armor: 28,
        trophy: 'Module Thermique de Confinement d\'Embryon'
      },
      {
        id: 'aaron_superintendent',
        name: "Surintendant Adjoint Aaron '85'",
        role: 'Contrôle de Sécurité Pénitentiaire',
        weapon: 'Clé à Molette en Acier Forgé & Taser Lourd',
        hp: 230,
        armor: 18,
        trophy: "Matricule de Sécurité '85' de Fiorina"
      }
    ]
  },

  // 25. Équipage Scientifique USCSS Prometheus — LV-223 (Prometheus 2012)
  {
    id: 'squad_prometheus_expedition_2093',
    name: "Équipage d'Exploration Scientifique USCSS Prometheus — LV-223",
    shortName: 'Expédition Prometheus 2093 (4 Explorateurs)',
    category: 'HUMAN_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Prometheus (2012, Ridley Scott)',
    biomeId: 'yautja_prime',
    recommendedBiome: 'LV-223 — Pyramide des Ingénieurs & Chambre des Urnes',
    description: "Équipe d'archéologues et de mercenaires de la mission Weyland explorant le temple des Ingénieurs sur LV-223.",
    tactics: "Reconnaissance par drones spectrographes 3D ('Pup'), tirs de fusils à pompe tactiques et lances-flammes d\'urgence.",
    totalHonorReward: 5500,
    soloVariantId: 'alien_base_elizabeth_shaw_archaeologist',
    members: [
      {
        id: 'elizabeth_shaw',
        name: 'Dr. Elizabeth Shaw (Archéologue Sacrificielle)',
        role: 'Pisteuse d\'Artefacts & Survivante',
        weapon: 'Hachette de Géologie & Pistolet Pliant Weyland',
        hp: 260,
        armor: 20,
        trophy: 'Croix Chrétienne Suspendue du Dr. Shaw'
      },
      {
        id: 'charlie_holloway',
        name: 'Dr. Charlie Holloway (Archéologue Contaminé)',
        role: "Éclaireur d'Avant-Garde & Détecteur",
        weapon: "Fusil à Pompe Tactique d'Exploration & Fusées",
        hp: 240,
        armor: 18,
        trophy: 'Casque Pressurisé Fissuré de Scaphandre'
      },
      {
        id: 'janek_captain',
        name: "Capitaine Janek (Commandant de l'USCSS Prometheus)",
        role: 'Soutien Tactique & Sacrifice de Collision',
        weapon: 'Pistolet Mitrailleur Lourd Weyland & Détonateur',
        hp: 270,
        armor: 22,
        trophy: "Accordéon Ancestral du Capitaine Janek"
      },
      {
        id: 'mercenary_vickers_guard',
        name: 'Garde de Sécurité Privée Vickers',
        role: 'Tireur de Protection Rapprochée',
        weapon: 'Carabine Modulaire Weyland-Yutani & Taser Lourd',
        hp: 250,
        armor: 30,
        trophy: 'Badge de Sécurité Privée Weyland Corporation'
      }
    ]
  },

  // 26. Caste des Ingénieurs Biologiques Sacrificiels — Temple LV-223 (Prometheus 2012)
  {
    id: 'squad_prometheus_engineer_awakening',
    name: "Caste des Ingénieurs Biologiques Sacrificiels — Temple LV-223",
    shortName: 'Ingénieurs de LV-223 (3 Géants)',
    category: 'SUPER_PREDATORS',
    scale: 'MOYEN',
    totalMembers: 3,
    originMedia: 'Prometheus (2012, Ridley Scott)',
    biomeId: 'yautja_prime',
    recommendedBiome: 'LV-223 — Chambre du Pilote & Salle de Navigation',
    description: "Pilotes et prêtres colossaux en bio-armure d'exosquelette réveillés de leur stase millénaire pour accomplir l'anéantissement de la Terre.",
    tactics: 'Force cinétique brute dévastatrice, décharges d\'énergie céphalique, diffusion de pathogène noir mutagène.',
    totalHonorReward: 7000,
    soloVariantId: 'prey_engineer_juggernaut_pilot',
    members: [
      {
        id: 'last_engineer_pilot',
        name: 'Dernier Ingénieur Éveillé (Pilote du Juggernaut)',
        role: 'Colosse de Bio-Armure & Combat Brut',
        weapon: 'Bio-Armure Exosquelette & Poings Cinétiques',
        hp: 550,
        armor: 55,
        trophy: "Casque Trompe Éléphantine d'Ingénieur Spatiale"
      },
      {
        id: 'sacrificial_architect',
        name: 'Architecte de la Genèse Sacrificielle',
        role: 'Canalisateur de Pathogène Noir A0-3959X',
        weapon: 'Urne Noire Brûlante de Mutagène & Flûte Tellurique',
        hp: 480,
        armor: 45,
        trophy: 'Coupe de Cérémonie Sacrificielle Noire'
      },
      {
        id: 'trilobite_guardian',
        name: 'Garde du Corps Ingénieur Augmenté',
        role: 'Sentinelle Lourde de Stase',
        weapon: 'Glaive Biologique d\'Alliage Inconnu & Visière',
        hp: 500,
        armor: 50,
        trophy: "Plaque Pectorale Biomorphe d'Ingénieur"
      }
    ]
  },

  // 27. Équipe de Reconnaissance USCSS Covenant — Planète 4 (Alien: Covenant 2017)
  {
    id: 'squad_covenant_colonists_2104',
    name: "Équipe de Reconnaissance USCSS Covenant — Planète 4 (Origae-6)",
    shortName: 'Éclaireurs Covenant 2104 (4 Colons)',
    category: 'HUMAN_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien: Covenant (2017, Ridley Scott)',
    biomeId: 'genna_deathworld',
    recommendedBiome: 'Planète 4 — Vallée des Morts & Forêt de Blé Hybride',
    description: "Membres de l'équipe d'atterrissage du Covenant découvrant le temple funéraire et les spores de néomorphes.",
    tactics: "Tirs de couverture au fusil d\'assaut Thales, tirs de suppression au fusil de précision et déploiement de fusées éclairantes.",
    totalHonorReward: 5200,
    soloVariantId: 'alien_base_daniels_branson_terraforming_lead',
    members: [
      {
        id: 'daniels_branson',
        name: 'Daniels Branson (Spécialiste Terraformation)',
        role: 'Tireuse de Précision & Survivante',
        weapon: "Carabine d'Assaut Thales F90 & Clé d'Escalade",
        hp: 270,
        armor: 22,
        trophy: "Clou d'Ancrage de Maison de Forêt Origae-6"
      },
      {
        id: 'walter_synthetic',
        name: 'Walter One (Synthétique de Protection Avancée)',
        role: 'Soutien Biomécanique & Réflexes Augmentés',
        weapon: 'Fusil Tactique Bullpup & Couteau Céramique',
        hp: 340,
        armor: 30,
        trophy: "Puce d'Identité Synaptique Walter Weyland"
      },
      {
        id: 'lopope_sergeant',
        name: 'Sergent Lope (Chef de la Sécurité Militaire)',
        role: 'Tireur d\'Assaut Lourd & Protection Rapprochée',
        weapon: "Fusil d'Assaut Lourd & Pistolet Automatique",
        hp: 260,
        armor: 28,
        trophy: 'Insigne de Sécurité Militaire USCSS Covenant'
      },
      {
        id: 'tennessee_pilot',
        name: 'Tennessee Faris (Pilote de la Navette de Secours)',
        role: 'Support Incendiaire & Balistique',
        weapon: 'Fusil de Chasse Calibre 12 & Pistolet de Détresse',
        hp: 240,
        armor: 16,
        trophy: 'Chapeau de Cowboy Aviateur de Tennessee'
      }
    ]
  },

  // 28. Meute de Néomorphes & David 8 — Nécropole (Alien: Covenant 2017)
  {
    id: 'squad_covenant_neomorph_david_pack',
    name: "Meute de Néomorphes & David 8 — Nécropole de la Cité des Ingénieurs",
    shortName: 'Meute Néomorphes de David (4 Entités)',
    category: 'XENOMORPH_HORDE',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien: Covenant (2017, Ridley Scott)',
    biomeId: 'genna_deathworld',
    recommendedBiome: 'Nécropole de David 8 — Cité en Ruines & Laboratoire',
    description: "David 8 dans son laboratoire de génétique entouré de Néomorphes albinos jaillissant des ombres pour déchiqueter les intrus.",
    tactics: 'Harposition vocale par David, bonds véloces des néomorphes juvéniles et charge de l\'alpha à crête dorsale.',
    totalHonorReward: 6300,
    soloVariantId: 'prey_synthetic_david_8',
    members: [
      {
        id: 'david_8_master',
        name: 'David 8 (Maître Généticien Démiurge)',
        role: "Meneur Télépathique & Créateur d'Horreurs",
        weapon: "Bistouri en Verre d'Ingénieur & Flûte d'Harmonisation",
        hp: 360,
        armor: 35,
        trophy: 'Carnet de Croquis Anatomiques de David 8'
      },
      {
        id: 'neomorph_alpha_adult',
        name: 'Néomorphe Alpha Adulte (Albinos Carnassier)',
        role: 'Assaut Félin Rapide & Morsure Cervicale',
        weapon: 'Mâchoires Fendues Pharyngiennes & Griffes Pâles',
        hp: 340,
        armor: 25,
        trophy: 'Crâne Albinos Translucide de Néomorphe'
      },
      {
        id: 'neomorph_juvenile_stalker',
        name: 'Néomorphe Juvénile Émergent (Bloodburster)',
        role: 'Attaque Surprise Furtive',
        weapon: 'Crête Dorsale Tranchante & Vitesse Foudroyante',
        hp: 230,
        armor: 15,
        trophy: 'Pointe Caudale Tranchante de Bloodburster'
      },
      {
        id: 'pathogen_spore_carrier',
        name: 'Pustule Mutante Porteuse de Spores Noires',
        role: 'Dispersion Toxique & Contamination Aérienne',
        weapon: 'Nuage de Micro-Spores Mutagènes Inhalables',
        hp: 200,
        armor: 10,
        trophy: 'Capsule Végétale Noire de Spores Pathogènes'
      }
    ]
  },

  // 29. Équipage de Récupération du Corbelan IV — Station Renaissance (Alien: Romulus 2024)
  {
    id: 'squad_romulus_corbelan_scavengers_2142',
    name: 'Équipage de Récupération du Corbelan IV — Station Renaissance (2142)',
    shortName: 'Mineurs du Corbelan (4 Récupérateurs)',
    category: 'HUMAN_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien: Romulus (2024, Fede Alvarez)',
    biomeId: 'stargazer_blacksite',
    recommendedBiome: 'Station Renaissance — Sas Romulus & Modules Cryogéniques',
    description: "Groupe de jeunes travailleurs de la colonie minière Jackson's Star explorant l'épave de la station Renaissance pour s'évader vers Yvaga.",
    tactics: 'Tirs de saturation automatique au fusil F44AA avec visée asservie, verrouillage de portes sas étanches et décharges d\'électrochoc.',
    totalHonorReward: 5300,
    soloVariantId: 'alien_base_rain_carradine_romulus_rebel',
    members: [
      {
        id: 'rain_carradine',
        name: 'Rain Carradine (Survivante au Fusil F44AA)',
        role: 'Tireuse Asservie de Pointe & Évasion',
        weapon: 'Fusil à Impulsion F44AA à Ciblage Automatique',
        hp: 270,
        armor: 25,
        trophy: "Pendentif Fossilisé de Jackson's Star"
      },
      {
        id: 'andy_nd5_synthetic',
        name: 'Andy (Synthétique Weyland ND-5 Directive Réassignée)',
        role: 'Bouclier Corporel & Force Brute Cybernétique',
        weapon: 'Mains Cybernétiques Hydrauliques & Clé d\'Urgence',
        hp: 380,
        armor: 40,
        trophy: 'Module de Directive Corporatiste Weyland ND-5'
      },
      {
        id: 'bjorn_cattle_prod',
        name: 'Bjorn (Mineur Rebelle Agressif)',
        role: 'Mêlée Électrique & Étourdissement',
        weapon: 'Pique de Mineur Électrochoc Industrielle Modifiée',
        hp: 240,
        armor: 16,
        trophy: "Batterie d'Électrochoc Haute Tension Jackson"
      },
      {
        id: 'tyler_scavenger',
        name: 'Tyler (Navigateur et Chef de Bord)',
        role: 'Éclaireur & Opérateur de Sas Thermiques',
        weapon: 'Pistolet Lance-Fusées Industriel & Torche Laser',
        hp: 230,
        armor: 18,
        trophy: 'Transpondeur Orbital du Cargo Corbelan IV'
      }
    ]
  },

  // 30. Horreurs du Laboratoire Romulus & The Offspring (Alien: Romulus 2024)
  {
    id: 'squad_romulus_renaissance_offspring_hive',
    name: 'Horreurs du Laboratoire Romulus & The Offspring — Station Renaissance',
    shortName: 'Ruche Romulus & Rejeton (4 Monstres)',
    category: 'XENOMORPH_HORDE',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien: Romulus (2024, Fede Alvarez)',
    biomeId: 'hive_lv426',
    recommendedBiome: 'Station Renaissance — Laboratoire Z-01 & Baie de Chargement',
    description: "L'horreur génétique suprême 'The Offspring' enfantée par injection du composé noir Z-01, assistée par les Facehuggers décongelés et le synthétique Rook.",
    tactics: 'Attaques déchiquetantes et morsures d\'une hauteur vertigineuse, lâchers de Facehuggers cryogénisés et tirs de directives de Rook.',
    totalHonorReward: 6600,
    soloVariantId: 'alien_base_rook_romulus_android',
    members: [
      {
        id: 'the_offspring',
        name: 'The Offspring (Hybride Humain-Ingénieur-Xénomorphe)',
        role: 'Apex Géant Carnassier & Allonge Cauchemardesque',
        weapon: 'Dents Humanoïdes Cliquetantes, Griffes Démesurées & Queue',
        hp: 520,
        armor: 45,
        trophy: 'Crâne Humanoïde Allongé du Rejeton Z-01'
      },
      {
        id: 'rook_science_officer',
        name: 'Officier Scientifique Rook (Synthétique ND-5)',
        role: 'Contrôleur de Système & Ordre Spécial 937',
        weapon: 'Pistolet Électrique de Laboratoire & Commandes Sas',
        hp: 290,
        armor: 30,
        trophy: 'Éprouvette Cryogénique Scellée de Composé Z-01'
      },
      {
        id: 'cryo_facehugger_alpha',
        name: 'Facehugger Décongelé des Réserves Romulus',
        role: 'Implantation Furtive & Saut Véloce',
        weapon: 'Tentacules d\'Étranglement & Ovipositeur Caustique',
        hp: 110,
        armor: 5,
        trophy: 'Doigts Chitineux Réfrigérés de Facehugger'
      },
      {
        id: 'xeno_chrysalis_drone',
        name: 'Drone Xénomorphe Régénéré du Sas Romulus',
        role: 'Traqueur de Plafond & Attaque Acide',
        weapon: 'Double Mâchoire Téléscopique & Sang Corrosif Pur',
        hp: 310,
        armor: 30,
        trophy: "Crête Lisse d'Ébène de Drone Romulus"
      }
    ]
  },

  // 31. Fireteam d'Élite OWLF 'Voodoo' & Dutch 2025 (Predator: Hunting Grounds 2020)
  {
    id: 'squad_phg_fireteam_voodoo_2025',
    name: "Fireteam d'Élite OWLF 'Voodoo' & Dutch — Opérations Tropicales 2025",
    shortName: 'Fireteam OWLF Dutch 2025 (4 Spécialistes)',
    category: 'HUMAN_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Hunting Grounds (2020, IllFonic)',
    biomeId: 'jungle',
    recommendedBiome: 'Jungle Tropicale — Camps de Guerilla & Installations OWLF',
    description: "L'escouade tactique d'élite de l'OWLF menée par le Major Dutch Schaefer augmenté de tissus Yautja pour neutraliser les chasseurs extraterrestres.",
    tactics: 'Boue thermique intégrale, mines de détection de cloaking, saturation au fusil lourd Hammerhead et fusils de sniper SAW.',
    totalHonorReward: 6200,
    soloVariantId: 'alien_base_dutch_2025_owlf',
    members: [
      {
        id: 'dutch_schaefer_2025',
        name: "Major Alan 'Dutch' Schaefer (Consultant Augmenté OWLF)",
        role: 'Commandant de Chasse & Vétéran Anti-Predator',
        weapon: 'Fusil d\'Assaut Prototype QR-CF & Poing Amélioré',
        hp: 390,
        armor: 35,
        trophy: "Enregistreur d'Opérations Tactiques Dutch OWLF"
      },
      {
        id: 'assault_specialist',
        name: 'Spécialiste Assaut Lourd Fireteam',
        role: 'Saturation Balistique & Dispersion',
        weapon: 'Fusil d\'Assaut Hammerhead & Lance-Grenades 40mm',
        hp: 280,
        armor: 30,
        trophy: 'Plaque Tactique de Poitrine OWLF Fireteam'
      },
      {
        id: 'recon_sniper',
        name: "Tireur d'Élite de Reconnaissance Thermique",
        role: 'Tir Perforant Haute Portée & Détection Cloak',
        weapon: 'Fusil de Précision SAW 50 Calibre & Viseur Thermique',
        hp: 240,
        armor: 22,
        trophy: 'Capteur Thermique Infrarouge Haute Définition'
      },
      {
        id: 'support_engineer',
        name: 'Ingénieur Support de Confinement',
        role: 'Déploiement de Balises IEM & Trousse Médicale',
        weapon: 'Pistolet Mitrailleur PDW & Mines de Détection IEM',
        hp: 260,
        armor: 26,
        trophy: 'Balise de Brouillage Thermique OWLF'
      }
    ]
  },

  // 32. Cercle des Légendes Yautja Ancestrales (Predator: Hunting Grounds 2020)
  {
    id: 'squad_phg_yautja_legends_circle',
    name: "Cercle des Légendes Yautja Ancestrales — Sanctuaire d'Honneur",
    shortName: 'Légendes Yautja (3 Maîtres de Chasse)',
    category: 'SUPER_PREDATORS',
    scale: 'MOYEN',
    totalMembers: 3,
    originMedia: 'Predator: Hunting Grounds (2020, IllFonic)',
    biomeId: 'yautja_prime',
    recommendedBiome: 'Yautja Prime — Sanctuaire des Légendes & Colonnes d\'Armes',
    description: "Trois des plus grands chasseurs de l\'histoire Yautja : Kaail l\'Alpha originel, la Reine Cleopatra du Nil et le Samouraï d'Honneur.",
    tactics: 'Assauts coordonnés alternant faux chitineuse géante, lancers de disque solaire pharaonique et duels au katana Yautja.',
    totalHonorReward: 7500,
    soloVariantId: 'alien_base_alpha_predator_kaail',
    members: [
      {
        id: 'alpha_predator_kaail',
        name: "Kaail — L'Alpha Predator (Père de la Rébellion Hish)",
        role: 'Colosse d\'Insurrection & Force Primordiale',
        weapon: 'Faux Osseuse Chitineuse & Armure Exosquelette Amangi',
        hp: 580,
        armor: 55,
        trophy: "Masque d'Exosquelette d'Alpha Predator Kaail"
      },
      {
        id: 'cleopatra_huntress',
        name: 'Cleopatra Predator (Chasseresse Souveraine d\'Égypte)',
        role: 'Vitesse Solaire & Précision Tranchante',
        weapon: 'Disque Intelligent Solaire & Khépesh d\'Or Yautja',
        hp: 460,
        armor: 45,
        trophy: 'Diadème Pharaonique Solaire d\'Or Massif'
      },
      {
        id: 'samurai_predator_master',
        name: 'Samurai Predator (Maître du Bushido Yautja)',
        role: 'Duel au Katana & Lame Rapide',
        weapon: 'Katana Yautja Trempé dans l\'Acide & Armure Laquée',
        hp: 480,
        armor: 48,
        trophy: 'Katana Cérémonial de Maître Samurai Yautja'
      }
    ]
  },

  // 33. Escouade de Fer de l'UAS Endeavor (Aliens: Fireteam Elite 2021)
  {
    id: 'squad_afe_endeavor_marines_2202',
    name: "Escouade de Fer de l'UAS Endeavor — Conflit Katanga LV-895 (2202)",
    shortName: 'Marines Endeavor 2202 (4 Vétérans)',
    category: 'USCM_COLONIAL_MARINES',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens: Fireteam Elite (2021, Cold Iron Studios)',
    biomeId: 'hive_lv426',
    recommendedBiome: "Station Katanga & Ruines LV-895 — Baies d'Accrochage",
    description: "Escouade d'élite des Colonial Marines de l'UAS Endeavor déployée pour contenir l'infestation xénomorphe sur la station orbitale Katanga.",
    tactics: 'Tourelles sentinelles déployables 360°, micro-roquettes de démolition, munitions surchargées incendiaires et drones d\'assistance.',
    totalHonorReward: 6000,
    soloVariantId: 'alien_base_herrera_endeavor_commander',
    members: [
      {
        id: 'herrera_commander',
        name: 'Sergent-Major Olivia Herrera (Commandante de Feu)',
        role: 'Coordination Tactique & Tir Lourd',
        weapon: 'Carabine d\'Assaut Krampus M42A3 & Viseur d\'Endeavor',
        hp: 310,
        armor: 32,
        trophy: 'Casque Tactique de Commandement UAS Endeavor'
      },
      {
        id: 'gunner_heavy_specialist',
        name: 'Artilleur Lourd Spécialiste Overclock',
        role: 'Saturation Lourde & Élimination de Blindage',
        weapon: 'Mitrailleuse Lourde Smartgun Type 99 & Mini-Roquettes',
        hp: 300,
        armor: 35,
        trophy: 'Boîtier de Munitions Électronique Smartgun'
      },
      {
        id: 'technician_turret_master',
        name: 'Technicien Ingénieur de Déploiement',
        role: 'Fortification & Tourelles Automatiques',
        weapon: 'Tourelle Sentinelle Portable UA 571-F & Fusil à Pompe',
        hp: 270,
        armor: 28,
        trophy: 'Unité Centrale de Tourelle Sentinelle Portative'
      },
      {
        id: 'doc_combat_medic',
        name: 'Infirmier de Combat de Terrain',
        role: 'Station Médicale Portative & Suppression',
        weapon: 'Fusil Mitrailleur Kramer & Station de Soin Déployable',
        hp: 260,
        armor: 26,
        trophy: 'Module de Sérum Médical Haute Densité USCM'
      }
    ]
  },

  // 34. Essaim Muté du Pathogène de Katanga & Reine Monica (Aliens: Fireteam Elite 2021)
  {
    id: 'squad_afe_katanga_pathogen_swarm',
    name: 'Essaim Muté du Pathogène de Katanga & Reine Monica — LV-895',
    shortName: 'Essaim Rouge Monica (4 Monstres)',
    category: 'XENOMORPH_HORDE',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens: Fireteam Elite (2021, Cold Iron Studios)',
    biomeId: 'hive_lv426',
    recommendedBiome: 'Station Katanga — Cœur de Ruche & Raffinerie Mutée',
    description: "Meute cauchemardesque de Xénomorphes mutés par le liquide noir chimique A0-3959X sur LV-895, guidée par le Praetorian mutant Monica.",
    tactics: 'Attaques suicides de Bursters explosifs acides, harcèlement aérien des Spitters et charge blindée du Praetorian rouge.',
    totalHonorReward: 6700,
    soloVariantId: 'alien_base_monica_leon_895',
    members: [
      {
        id: 'monica_praetorian_queen',
        name: 'Monica (Praetorian Muté Rouge Écarlate)',
        role: 'Brute Blindée Corrosive & Hurlement de Ralliement',
        weapon: 'Crête Rouge Blindée, Jet d\'Acide Pyrogène & Pilonnage',
        hp: 560,
        armor: 52,
        trophy: 'Crête Écarlate Cristallisée de Monica LV-895'
      },
      {
        id: 'pathogen_spitter',
        name: 'Cracheur Acide Muté (Spitter LV-895)',
        role: 'Tir d\'Artillerie Acide à Longue Portée',
        weapon: 'Glandes d\'Acide Surchauffé & Salve Corrosive',
        hp: 280,
        armor: 20,
        trophy: 'Glande Salivaire Acide sous Pression de Spitter'
      },
      {
        id: 'pathogen_burster',
        name: 'Éclateur Suicidaire à Spores d\'Acide (Burster)',
        role: 'Charge Kamikaze & Détonation d\'Acide en Zone',
        weapon: 'Poches d\'Acide Pulmonaires Prêtes à la Rupture',
        hp: 190,
        armor: 10,
        trophy: 'Poche Pulmonaire de Gaz Acide Instable'
      },
      {
        id: 'pathogen_stalker',
        name: 'Rôdeur d\'Ombre Mutagène (Stalker)',
        role: 'Camouflage Bio-Ombre & Frappe Furtive',
        weapon: 'Carapace Réfléchissante Sombre & Griffes Osseuses',
        hp: 310,
        armor: 25,
        trophy: 'Fragment de Chitine Noire Évoluée par le Pathogène'
      }
    ]
  },
  {
    id: 'squad_cold_war_spetsnaz_1991',
    name: 'Spetsnaz de Sibérie & Commandos de Kola (1991)',
    shortName: 'Spetsnaz de Sibérie (4 Commandos)',
    category: 'MILITARY_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Cold War (Comics Dark Horse 1991)',
    biomeId: 'antarctic',
    recommendedBiome: 'Toundra Glaciale Soviétique',
    description: 'Commandos soviétiques d\'élite survivant dans le blizzard de Sibérie face à un chasseur Yautja écrasé dans la toundra.',
    tactics: 'Tirs croisés lourds en tenaille, fusées éclairantes dans le blizzard et tirs de mortier de tranchée.',
    totalHonorReward: 3200,
    soloVariantId: 'alien_base_major_dutch_schaefer_1987',
    members: [
      { id: 'ligachev', name: 'Lieutenant Ligachev', role: 'Commandement Spetsnaz', weapon: 'Fusil d\'Assaut Kalachnikov AK-74 & Fusées', hp: 380, armor: 40, trophy: 'Insigne d\'Officier des Troupes Spéciales Soviétiques' },
      { id: 'kirenkov', name: 'Sergent Kirenkov', role: 'Appui Lourd', weapon: 'Mitrailleuse Lourde PKM 7.62×54mmR', hp: 420, armor: 45, trophy: 'Bande de Cartouches Calcinée & Épaulette de Sergent' },
      { id: 'morozov', name: 'Tireur d\'Élite Morozov', role: 'Sniper Camouflé', weapon: 'Fusil de Précision Dragunov SVD & Lunette PSO-1', hp: 310, armor: 25, trophy: 'Viseur Optique Soviétique PSO-1 à Réticule Lumineux' },
      { id: 'chenko', name: 'Sapeur Chenko', role: 'Démolition Antichar', weapon: 'Lance-Roquettes RPG-7 & Mines Antichar', hp: 350, armor: 35, trophy: 'Dégoupilleur de Roquette Antichar RPG Soviétique' }
    ]
  },
  {
    id: 'squad_enforcers_council_arbiters',
    name: 'Arbitres Enforcers & Juges Claniques Yautja',
    shortName: 'Arbitres Enforcers (4 Juges)',
    category: 'SUPER_PREDATORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Bad Blood (Comics Dark Horse 1993)',
    biomeId: 'jungle',
    recommendedBiome: 'Jungle de Traque Punitive',
    description: 'Exécuteurs suprêmes mandatés par le Conseil des Anciens pour traquer sans merci et exécuter les Bad Bloods hérétiques.',
    tactics: 'Chasse en binôme coordonnée : téléportation courte, disque de traque et plasmacaster double asservi.',
    totalHonorReward: 4800,
    soloVariantId: 'alien_base_cleopatra_predator',
    members: [
      { id: 'enforcer_prime', name: 'Enforcer Prime', role: 'Grand Arbitre du Conseil', weapon: 'Double Plasmacaster Épaule & Glaive en Argent Mat', hp: 680, armor: 70, trophy: 'Biomasque Gravé du Sceau d\'Arbitre Suprême' },
      { id: 'enforcer_tracker', name: 'Enforcer Traqueur', role: 'Traque Sensorielle', weapon: 'Smart Disc Gravé & Filet Métallique Rétractable', hp: 540, armor: 55, trophy: 'Gantelet Lance-Filet d\'Argent à Serrage Moléculaire' },
      { id: 'enforcer_heavy', name: 'Arbitre des Sables', role: 'Appui Artillerie Plasma', weapon: 'Canon à Plasma Lourd Asservi & Fouet Électrifié', hp: 580, armor: 60, trophy: 'Injecteur d\'Agent Dissolvant Moléculaire d\'Enforcer' },
      { id: 'enforcer_duelist', name: 'Inquisiteur d\'Honneur', role: 'Duelliste d\'Exécution', weapon: 'Double Combi-Stick Télescopique & Lames 60cm', hp: 520, armor: 50, trophy: 'Lame d\'Exécution Cérémoniale Gravée de Glyphes de Verdict' }
    ]
  },
  {
    id: 'squad_dark_descent_cerberus_marines',
    name: 'Escouade Tactique USCM & Protocole Cerberus (2203)',
    shortName: 'USCM Cerberus Lethe (4 Marines)',
    category: 'COLONIAL_MARINES',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens: Dark Descent (Focus Home / Tindalos 2023)',
    biomeId: 'space_hulk',
    recommendedBiome: 'Port Hills sous Blocus Cerberus',
    description: 'Escouade de Marines coloniaux sous blocus orbital Cerberus sur la planète Lethe, coordonnée par radio tactique.',
    tactics: 'Verrouillage de sas, tourelles sentinelles UA 571-C en couverture et tir de suppression continu.',
    totalHonorReward: 3600,
    soloVariantId: 'alien_base_herrera_endeavor_commander',
    members: [
      { id: 'hayes', name: 'Sergent Maeko Hayes', role: 'Officier Coordinateur', weapon: 'Armat M41A Pulse Rifle & Tablette Tactique Cerberus', hp: 360, armor: 35, trophy: 'Module de Liaison Satellitaire Tactique de Lethe' },
      { id: 'harper', name: 'Caporal Jonas Harper', role: 'Démolition & Brèche', weapon: 'Fusil à Pompe Lourd d\'Assaut & Chalumeau Thermique', hp: 410, armor: 45, trophy: 'Chalumeau Industriel & Écusson de Bras de l\'Otago' },
      { id: 'jensen', name: 'Artilleur Lourd Jensen', role: 'Tir de Suppression Mobile', weapon: 'M56B Smartgun Amélioré & Harnais Gyroscopique', hp: 440, armor: 50, trophy: 'Harnais Stabilisateur d\'Artilleur USCM Décoré' },
      { id: 'smith', name: 'Recon Smith', role: 'Reconnaissance & Scanner', weapon: 'Fusil de Sniper Silencieux & Scanner M314', hp: 320, armor: 25, trophy: 'Scanner de Mouvement Portatif USCM M314 Mil-Spec' }
    ]
  },
  {
    id: 'squad_charon_kleist_rogue_swarm',
    name: 'Complexe Rogue & Gardes Génétiques du Dr Kleist',
    shortName: 'Généticiens Charon (4 Combattants)',
    category: 'SYNTHETIC_PACK',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens: Rogue (Comics Dark Horse 1993)',
    biomeId: 'temple',
    recommendedBiome: 'Station de Recherche Charon',
    description: 'Scientifiques fanatiques et gardes génétiques protégeant le King Alien géant synthétisé en laboratoire.',
    tactics: 'Nuages de gaz neurotoxique, barrières d\'énergie et lâcher de bêtes mutants en première ligne.',
    totalHonorReward: 4200,
    soloVariantId: 'alien_base_monica_leon_895',
    members: [
      { id: 'kleist', name: 'Dr Ernst Kleist', role: 'Démiurge Généticien Fou', weapon: 'Injecteur Chimique Z-Series & Pistolet Stun', hp: 340, armor: 20, trophy: 'Seringue d\'Extraction Génétique Chromée de Kleist' },
      { id: 'king_specimen', name: 'Spécimen King Alien', role: 'Titan Hybride Colossal', weapon: 'Crête d\'Airain Renforcée, Morsure 5000J', hp: 850, armor: 80, trophy: 'Fragment de Crâne Strié Blindé du King Alien' },
      { id: 'synthetic_alpha', name: 'Synthétique Alpha Charon', role: 'Garde du Corps Cybernétique', weapon: 'Canon à Impulsion de Laboratoire & Mâchoire d\'Acier', hp: 510, armor: 55, trophy: 'Puce Synaptique Cybernétique du Garde Alpha' },
      { id: 'charon_guard', name: 'Chef de Sécurité Charon', role: 'Assaut & Contention', weapon: 'Fusil Automatique Weyland Type-12 & Armure', hp: 390, armor: 40, trophy: 'Badge d\'Accès de Niveau 5 du Laboratoire Rogue' }
    ]
  },
  {
    id: 'squad_ryushi_chian_am_ranchers',
    name: 'Ranchers de Prosperity Wells & Colons de Ryushi (1990)',
    shortName: 'Ranchers de Ryushi (4 Colons)',
    category: 'CIVILIAN_SURVIVORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens vs. Predator (Comics Dark Horse 1990)',
    biomeId: 'desert',
    recommendedBiome: 'Plaines Arides de Prosperity Wells',
    description: 'Pionniers de la colonie agricole de Ryushi guidés par Machiko Noguchi pour repousser la ruche xénomorphe.',
    tactics: 'Charges de bétail Rhynths pour disperser les lignes ennemies et tir de précision longue portée.',
    totalHonorReward: 3800,
    soloVariantId: 'alien_base_dutch_2025_owlf',
    members: [
      { id: 'machiko', name: 'Machiko Noguchi', role: 'Administratrice & Chasseresse', weapon: 'Arc Composite à Flèches Acides & Lames Yautja', hp: 450, armor: 40, trophy: 'Marque Frontale de Sang d\'Initié du Clan Dachande' },
      { id: 'henderson', name: 'Vétéran Henderson', role: 'Rancher en Chef', weapon: 'Carabine Lourde à Levier de Sous-Garde .458 Magnum', hp: 390, armor: 35, trophy: 'Chapeau de Feutre Renforcé de Colon de Ryushi' },
      { id: 'hernandez', name: 'Hernandez le Pistolero', role: 'Tir Réflexe Rapproché', weapon: 'Doubles Revolvers Lourds de Colonie et Piro-Grenades', hp: 360, armor: 30, trophy: 'Ceinturon de Cuir Poussiéreux de Prosperity Wells' },
      { id: 'revna', name: 'Dr Revna', role: 'Médecine Coloniale', weapon: 'Fusil de Chasse Calico & Trousse Chirurgicale', hp: 330, armor: 25, trophy: 'Pince d\'Extraction de Facehugger de Ryushi' }
    ]
  },
  {
    id: 'squad_yautja_prime_proving_circle',
    name: 'Cercle d\'Épreuve des Vétérans de Yautja Prime',
    shortName: 'Champions d\'Airain (4 Guerriers)',
    category: 'SUPER_PREDATORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens vs. Predator: War (Comics & Romans)',
    biomeId: 'yautja_prime',
    recommendedBiome: 'Colisée d\'Airain de Yautja Prime',
    description: 'Quatre champions d\'élite s\'affrontant sous les yeux des Matriarches dans l\'arène suprême d\'airain.',
    tactics: 'Combats circulaires tournants : enchaînement glaive lourd, fouet plasma et bonds cinétiques aériens.',
    totalHonorReward: 5200,
    soloVariantId: 'alien_base_alpha_predator_kaail',
    members: [
      { id: 'prime_champion', name: 'Champion de l\'Arène', role: 'Duelliste Suprême du Colisée', weapon: 'Double Glaive Dentelé & Armure Cérémoniale d\'Or', hp: 720, armor: 75, trophy: 'Crête d\'Or Massif du Champion de l\'Arène' },
      { id: 'prime_tracker', name: 'Maître de Traque', role: 'Tir Réfractif & Réticule', weapon: 'Arc Yautja Télescopique & Pointes Incendiaires', hp: 560, armor: 55, trophy: 'Corde d\'Arc Tressée en Tendon de Reine' },
      { id: 'prime_whipmaster', name: 'Vétéran Sang-Marqué', role: 'Assaut Mêlée Fouet Plasma', weapon: 'Fouet Énergétique Segmenté & Lames 80cm', hp: 610, armor: 65, trophy: 'Section de Fouet d\'Épines Anti-Acide' },
      { id: 'prime_initiator', name: 'Initiateur du Temple', role: 'Gardien du Premier Sang', weapon: 'Combi-Stick Royal d\'Airain & Masque Ancestral', hp: 580, armor: 60, trophy: 'Stèle d\'Initié Miniaturisée des Lois de Chasse' }
    ]
  },
  {
    id: 'squad_predator_hunters_veterans_2017',
    name: 'Collectif des Chasseurs de Prédateurs — Opération Atoll (2017)',
    shortName: 'Predator Hunters (4 Vétérans)',
    category: 'MILITARY_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Hunters (Comics Dark Horse 2017-2020)',
    biomeId: 'jungle',
    recommendedBiome: 'Atoll Tropical de Mer de Chine',
    description: 'Survivants d\'anciennes chasses Yautja réunis par Enoch Nakai et Jaya Soames pour traquer les chasseurs stellaires sur leur propre terrain.',
    tactics: 'Couverture thermique à la boue, pièges périmétriques et tirs de précision synchronisés visant le biomasque.',
    totalHonorReward: 3900,
    soloVariantId: 'alien_base_dutch_2025_owlf',
    members: [
      { id: 'enoch_nakai', name: 'Enoch Nakai', role: 'Traqueur Navajo & Tireur d\'Élite', weapon: 'Carabine Custom .338 Lapua & Couteau de Chasse', hp: 410, armor: 35, trophy: 'Amulette de Turquoise & Douille Gravée de Nakai' },
      { id: 'jaya_soames', name: 'Jaya Soames', role: 'Commandante Tactique', weapon: 'Fusil d\'Assaut L85A2 & Grenades Thermiques', hp: 380, armor: 35, trophy: 'Journal de Traque Chiffré de Jaya Soames' },
      { id: 'mandy_graves', name: 'Mandy Graves', role: 'Spécialiste Armes Lourdes', weapon: 'Mitrailleuse M240B & Capteur Infrarouge', hp: 400, armor: 40, trophy: 'Plaque Militaire Survivante d\'Afghanistan' },
      { id: 'raphael_herrera', name: 'Raphael Herrera', role: 'Vétéran des Cartels & éclaireur', weapon: 'Fusil à Pompe Tactique Benelli M4 & Machette', hp: 370, armor: 30, trophy: 'Machette Damasquinée de Raphael Herrera' }
    ]
  },
  {
    id: 'squad_bad_blood_renegade_pack',
    name: 'Meute des Renégats Bad Bloods & Écorcheurs Exilés',
    shortName: 'Meute Bad Bloods (4 Renégats)',
    category: 'SUPER_PREDATORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Bad Blood (Comics Dark Horse 1993)',
    biomeId: 'los_angeles_1997',
    recommendedBiome: 'Jungle Urbaine & Marais de Pine Barrens',
    description: 'Quatre Yautja frappés d\'hérésie ayant massacré leur propre vaisseau clanique et chassant sans aucune restriction du Code d\'Honneur.',
    tactics: 'Frénésie sanguinaire imprévisible, embuscades en meute camouflée et usage d\'armes chimiques et plasmiques surchargées.',
    totalHonorReward: 5100,
    soloVariantId: 'prey_bad_blood_warlord',
    members: [
      { id: 'bad_blood_alpha', name: 'Seigneur Écorcheur Bad Blood', role: 'Berserker Hérétique', weapon: 'Machette Yautja Crantée & Crânes de Frères', hp: 700, armor: 65, trophy: 'Biomasque Profané Peint de Sang Yautja' },
      { id: 'bad_blood_flayer', name: 'Traqueur Sans-Loi', role: 'Assassin Furtif', weapon: 'Doubles Lames Écorcheuses & Filet Barbelé', hp: 550, armor: 50, trophy: 'Collier de Mandibules Arrachées à des Pairs' },
      { id: 'bad_blood_pyro', name: 'Incinérateur Renégat', role: 'Artilleur Plasma Instable', weapon: 'Plasmacaster Surchargé à Tir Continu', hp: 580, armor: 55, trophy: 'Condensateur Plasma Fissuré de Bad Blood' },
      { id: 'bad_blood_butcher', name: 'Boucher des Marais', role: 'Exécuteur Lourd', weapon: 'Hachette d\'Abattage Moléculaire & Harpon', hp: 620, armor: 60, trophy: 'Trophée Crânien Volé d\'Ancien Arbitre' }
    ]
  },
  {
    id: 'squad_colonial_marines_uss_sephora_2013',
    name: 'Escouade de Choc USS Sephora — Caporal Christopher Winter (2179)',
    shortName: 'USS Sephora USCM (4 Marines)',
    category: 'COLONIAL_MARINES',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens: Colonial Marines (Gearbox / SEGA 2013)',
    biomeId: 'hive_lv426',
    recommendedBiome: 'Tranchée du Derelict LV-426',
    description: 'Bataillon de secours de l\'USS Sephora déployé sur LV-426 pour enquêter sur la disparition du Sulaco et briser le blocus Weyland-Yutani.',
    tactics: 'Formation en carré USCM, tirs de fusil à impulsion M41A Mk2, minigun lourd et déploiement de tourelles.',
    totalHonorReward: 3700,
    soloVariantId: 'alien_base_william_hudson_private',
    members: [
      { id: 'winter', name: 'Caporal Christopher Winter', role: 'Chef d\'Escouade Sephora', weapon: 'M41A Pulse Rifle Mk2 & Fusil à Pompe Hicks', hp: 390, armor: 40, trophy: 'Plaque d\'Identification USCM de l\'USS Sephora' },
      { id: 'oneal', name: 'Soldat Peter O\'Neal', role: 'Appui Mitrailleuse Lourde', weapon: 'M56 Smartgun & Minigun Rotatif M90', hp: 440, armor: 50, trophy: 'Casque Tactique Optique du Soldat O\'Neal' },
      { id: 'bella', name: 'Soldat Bella Clarison', role: 'Éclaireuse & Assaut Rapproché', weapon: 'Sous-Mitrailleuse Tactique & Lance-Grenades', hp: 340, armor: 30, trophy: 'Écusson Brodé de l\'Escouade de Choc Sephora' },
      { id: 'cruz', name: 'Capitaine Jeremy Cruz', role: 'Commandant Vétéran', weapon: 'Fusil de Combat Lourd & Pistolet Service VP70', hp: 410, armor: 45, trophy: 'Insigne de Commandement du Capitaine Cruz' }
    ]
  },
  {
    id: 'squad_labyrinth_innominata_research_1993',
    name: 'Expédition Scientifique Innominata — Colonel Dr Paul Church (1993)',
    shortName: 'Complexe Innominata (4 Chercheurs)',
    category: 'SYNTHETIC_PACK',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens: Labyrinth (Comics Dark Horse 1993)',
    biomeId: 'stargazer_blacksite',
    recommendedBiome: 'Station Orbitale Innominata',
    description: 'Équipe de recherche biocomportementale dirigée par l\'impitoyable Dr Paul Church au cœur du labyrinthe vitré de la station Innominata.',
    tactics: 'Pièges de confinement, décharges électriques de couloir, gaz soporifique et gardes synthétiques en scaphandre.',
    totalHonorReward: 3500,
    soloVariantId: 'prey_weyland_combat_android',
    members: [
      { id: 'dr_church', name: 'Colonel Dr Paul Church', role: 'Directeur Xéno-Comportementaliste', weapon: 'Fusil à Impulsion Cryo-Acide & Aiguillon', hp: 360, armor: 30, trophy: 'Carnets Cliniques de Survie en Ruche du Dr Church' },
      { id: 'col_crespi', name: 'Colonel Anthony Crespi', role: 'Inspecteur Militaire', weapon: 'Carabine d\'Assaut USCM & Pistolet Automatique', hp: 380, armor: 35, trophy: 'Badge d\'Inspection Militaire de la Station Innominata' },
      { id: 'innominata_synth', name: 'Androïde de Confinement Lab-4', role: 'Sécurité Bio-Hazard', weapon: 'Fusil Électromagnétique & Bouclier Anti-Acide', hp: 490, armor: 55, trophy: 'Visière Intacte de Scaphandre de Laboratoire' },
      { id: 'hazard_tech', name: 'Technicien de Purge', role: 'Opérateur Chimique', weapon: 'Lance-Flammes Lourd M240 & Bombes Neurotoxiques', hp: 350, armor: 35, trophy: 'Valve Pressurisée de Purge du Labyrinthe' }
    ]
  },
  {
    id: 'squad_avp2010_bg386_elite_claw',
    name: 'Meute d\'Élite du Clan Dark & Garde de la Pyramide (BG-386 2010)',
    shortName: 'Clan d\'Élite BG-386 (4 Yautja)',
    category: 'SUPER_PREDATORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens vs. Predator (Rebellion / SEGA 2010)',
    biomeId: 'bouvetoya_pyramid',
    recommendedBiome: 'Jungle & Pyramide Antique de BG-386',
    description: 'Détachement d\'Élite envoyé sur Freya\'s Prospect (BG-386) pour purifier la pyramide ancestrale et abattre l\'Abomination Predalien.',
    tactics: 'Coordination létale d\'Élite : mines laser de proximité, disque chakram à têtes chercheuses et double canon plasma.',
    totalHonorReward: 5000,
    soloVariantId: 'prey_predalien_abomination',
    members: [
      { id: 'dark_elite', name: 'Dark (Guerrier d\'Élite)', role: 'Exécuteur Suprême de BG-386', weapon: 'Masque Ancestral, Combi-Stick & Canon Antique', hp: 710, armor: 70, trophy: 'Fragment du Sceau Pyramidal du Seigneur Ancestral' },
      { id: 'wolf_bg386', name: 'Vétéran Wolf (BG-386)', role: 'Instructeur de Combat', weapon: 'Lames de Poignet Doubles & Mines Énergétiques', hp: 590, armor: 60, trophy: 'Gantelet Holographique de Coordonnées Stellaires' },
      { id: 'claw_hunter', name: 'Claw (Chasseur de la Jungle)', role: 'Sentinelle des Marais', weapon: 'Smart Disc Chakram & Plasmacaster d\'Épaule', hp: 540, armor: 50, trophy: 'Tresse d\'Or du Clan de Freya\'s Prospect' },
      { id: 'stalker_bg386', name: 'Stalker (Initié de l\'Arène)', role: 'Duelliste de Fosse', weapon: 'Lance Télescopique & Filet de Confinement', hp: 520, armor: 50, trophy: 'Griffe de la Matriarche Specimen 6 de BG-386' }
    ]
  },
  {
    id: 'squad_fire_and_stone_perses_crew_2014',
    name: 'Survivants du Geryon & Chasseur Ahab — Croisade de LV-223 (2219)',
    shortName: 'Croisade d\'Ahab LV-223 (4 Survivants)',
    category: 'MILITARY_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien vs. Predator: Fire and Stone (Comics Dark Horse 2014)',
    biomeId: 'genna_deathworld',
    recommendedBiome: 'Montagnes Mutées de LV-223',
    description: 'L\'alliance improbable entre le vétéran borgne Ahab, le mercenaire Galgo Helder et les survivants du vaisseau Geryon face aux Ingénieurs et au mutagène noir.',
    tactics: 'Tir de suppression au fusil d\'Ingénieur, salves de harpon lourd et assaut frénétique de synthétique muté.',
    totalHonorReward: 4900,
    soloVariantId: 'prey_ahab_elder_persée',
    members: [
      { id: 'ahab_veteran', name: 'Ahab (Ancien Borgne)', role: 'Chasseur d\'Ingénieurs Mala\'kak', weapon: 'Fusil à Particules d\'Ingénieur & Harpon Lourd', hp: 690, armor: 70, trophy: 'Œil Bionique Balafré & Trophée Mala\'kak d\'Ahab' },
      { id: 'galgo_helder', name: 'Galgo Helder', role: 'Mercenaire & Contrebandier', weapon: 'Fusil à Impulsion Modifié & Pistolet Volé', hp: 380, armor: 35, trophy: 'Bracelet de Survie Volé au Complexe Weyland' },
      { id: 'derrick_foster', name: 'Capitaine Angela Foster', role: 'Chef d\'Expédition du Geryon', weapon: 'Carabine de Sécurité & Torche Thermique', hp: 350, armor: 30, trophy: 'Enregistreur de Vol Noir du Vaisseau Geryon' },
      { id: 'elden_mutated', name: 'Elden (Synthétique Muté A0-3959X)', role: 'Hybride Biomécanique Enragé', weapon: 'Griffes Organo-Métalliques & Force Surhumaine', hp: 580, armor: 55, trophy: 'Noyau Cortical Cristallisé par le Mutagène Noir' }
    ]
  },
  {
    id: 'squad_lost_tribe_1997_greyback_elders',
    name: 'Panthéon de la Tribu Perdue (1997) — L\'Ancien Greyback & ses Champions',
    shortName: 'Lost Tribe 1997 (4 Maîtres)',
    category: 'SUPER_PREDATORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator 2 (1990, Stephen Hopkins)',
    biomeId: 'los_angeles_1997',
    recommendedBiome: 'Nef Souterraine de Los Angeles 1997',
    description: 'Le cercle intérieur des maîtres chasseurs de la Lost Tribe entourant l\'Ancien Greyback dans la salle des trophées du vaisseau.',
    tactics: 'Duel codifié d\'honneur : bâton cérémonial de Shaman, doubles lames de Boar, disques de Snake et épée d\'Ancien.',
    totalHonorReward: 5300,
    soloVariantId: 'alien_base_alpha_predator_kaail',
    members: [
      { id: 'greyback_elder', name: 'Greyback (Golden Angel Elder)', role: 'Ancien Patriarche de la Lost Tribe', weapon: 'Épée Cérémoniale & Pistolet Adolini 1715', hp: 740, armor: 75, trophy: 'Médaillon Ancestral de Commandement de Greyback' },
      { id: 'shaman_mystic', name: 'Shaman Predator', role: 'Mystique & Visionnaire du Clan', weapon: 'Bâton Rituel Gravé & Faucille d\'Os', hp: 580, armor: 50, trophy: 'Collier de Crânes & Plumes Rituelles du Chaman' },
      { id: 'boar_enforcer', name: 'Boar Predator', role: 'Traqueur de Choc Lourd', weapon: 'Doubles Lames Brise-Os & Canon Épaule', hp: 640, armor: 65, trophy: 'Défenses de Sanglier Stellaire du Masque de Boar' },
      { id: 'snake_phantom', name: 'Snake Predator', role: 'Maître des Disques Furtifs', weapon: 'Double Smart Disc Silencieux & Filet', hp: 560, armor: 55, trophy: 'Lentille Reptilienne Thermique de Snake' }
    ]
  },
  {
    id: 'squad_pine_barrens_cia_hunters_1993',
    name: 'Détachement Spécial CIA de Pine Barrens — Agent John Trent (1993)',
    shortName: 'CIA Pine Barrens (4 Agents)',
    category: 'MILITARY_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Bad Blood (Comics Dark Horse 1993)',
    biomeId: 'jungle',
    recommendedBiome: 'Marais de Pine Barrens (New Jersey)',
    description: 'Survivants des forces spéciales et agents de la CIA dirigés par John Trent pour contenir le carnage du Bad Blood dans les marais.',
    tactics: 'Embuscades dans le brouillard, mines antipersonnel Claymore et tirs d\'arrêt au gros calibre .454 Casull.',
    totalHonorReward: 3400,
    soloVariantId: 'alien_base_george_dillon_cia',
    members: [
      { id: 'john_trent', name: 'Agent Spécial John Trent', role: 'Survivant & Chef d\'Opération CIA', weapon: 'Carabine M16A2 & Revolver .454 Casull', hp: 400, armor: 35, trophy: 'Plaque Fédérale Tachée de Sang de John Trent' },
      { id: 'cia_marksman', name: 'Tireur CIA Callahan', role: 'Sniper de Brouillard', weapon: 'Fusil M24 SWS à Lunette Infrarouge', hp: 330, armor: 25, trophy: 'Lunette Thermique de Nuit AN/PVS-4' },
      { id: 'cia_heavy', name: 'Sergent Miller (Béret Vert)', role: 'Soutien Démolition', weapon: 'Mitrailleuse M60E3 & Mines Claymore', hp: 390, armor: 40, trophy: 'Béret Vert Déchiré des Marais du New Jersey' },
      { id: 'pine_tracker', name: 'Pisteur Local Roscoe', role: 'Guide des Marécages', weapon: 'Fusil de Chasse Calibre 10 & Pièges à Loup', hp: 320, armor: 20, trophy: 'Lanterne Tempête Brisée de Pine Barrens' }
    ]
  },
  {
    id: 'squad_alien_earth_prodigy_tactical_2120',
    name: 'Force d\'Intervention Prodigy Corp & Hybride Wendy — Terre (2120)',
    shortName: 'Prodigy Corp Terre (4 Unités)',
    category: 'SYNTHETIC_PACK',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien: Earth (Série FX 2025, Noah Hawley)',
    biomeId: 'stargazer_blacksite',
    recommendedBiome: 'Complexe Insulaire Prodigy (Terre)',
    description: 'L\'unité d\'élite de Boy Kavalier entourant Wendy, première méta-humaine synthétique, et son mentor androïde Kirsh lors du crash orbital.',
    tactics: 'Boucliers bio-électriques, décharges d\'arc paralysantes et coordination synaptique entre synthétiques et humains.',
    totalHonorReward: 4100,
    soloVariantId: 'prey_weyland_combat_android',
    members: [
      { id: 'wendy_hybrid', name: 'Wendy (Prototypage Méta-Humain)', role: 'Hybride Conscience Humaine / Corps Synthétique', weapon: 'Lame Tactique Haute Fréquence & Impulsion', hp: 480, armor: 45, trophy: 'Médaillon Neural de Transfert de Conscience Prodigy' },
      { id: 'kirsh_mentor', name: 'Kirsh (Synthétique Mentor)', role: 'Superviseur Scientifique & Tactique', weapon: 'Fusil à Arc Bio-Électrique 120 kV', hp: 520, armor: 55, trophy: 'Processeur Optique Argenté de Kirsh' },
      { id: 'prodigy_captain', name: 'Capitaine de Sécurité Hermit', role: 'Commandant d\'Intervention Terrestre', weapon: 'Carabine Bullpup Prodigy & Grenades IEM', hp: 380, armor: 40, trophy: 'Écusson Doré de la Garde de Boy Kavalier' },
      { id: 'prodigy_specialist', name: 'Spécialiste Bio-Confinement', role: 'Unité de Capture Xéno', weapon: 'Filet Électromagnétique & Lance-Cryo', hp: 360, armor: 35, trophy: 'Cylindre d\'Échantillon du Crash Terrien 2120' }
    ]
  },
  {
    id: 'squad_usm_auriga_perez_science_2381',
    name: 'Garnison Militaire USM Auriga — Général Perez & Dr Wren (2381)',
    shortName: 'Garnison USM Auriga (4 Officiers)',
    category: 'COLONIAL_MARINES',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien: Resurrection (1997, Jean-Pierre Jeunet)',
    biomeId: 'hive_lv426',
    recommendedBiome: 'Vaisseau Médical USM Auriga',
    description: 'Le commandement militaire et scientifique de l\'United Systems Military responsable du clonage d\'Ellen Ripley et de l\'élevage xénomorphe.',
    tactics: 'Tirs de barrage au fusil Lacrima 99, verrouillage de sas pressurisés et utilisation de gaz cryo-létal.',
    totalHonorReward: 3600,
    soloVariantId: 'alien_base_william_hudson_private',
    members: [
      { id: 'gen_perez', name: 'Général Martin Perez', role: 'Commandant Suprême de l\'USM Auriga', weapon: 'Pistolet Lourd d\'Officier USM & Grenades', hp: 390, armor: 40, trophy: 'Épaulettes Étoilées tâchées d\'Acide du Général Perez' },
      { id: 'dr_wren', name: 'Dr Mason Wren', role: 'Directeur du Programme de Clonage', weapon: 'Pistolet Compact Dissimulé & Fusil Lacrima', hp: 340, armor: 25, trophy: 'Carte d\'Accès Codée des Cages de Clones 1-8' },
      { id: 'distephano', name: 'Soldat Vincent DiStephano', role: 'Fantassin Lourd USM', weapon: 'Fusil d\'Assaut USM Lacrima 99 & Pompe', hp: 410, armor: 45, trophy: 'Casque Blindé Standard de l\'United Systems Military' },
      { id: 'dr_gediman', name: 'Dr Jonathan Gediman', role: 'Xéno-Biologiste Fanatique', weapon: 'Diffuseur d\'Azote Liquide Punitive', hp: 310, armor: 20, trophy: 'Buse de Punition Cryogénique des Cellules de l\'Auriga' }
    ]
  },
  {
    id: 'squad_capcom_avp_sanjose_alliance_1994',
    name: 'Alliance de San Jose — Major Dutch Cyborg & Lt. Linn Kurosawa (1994)',
    shortName: 'Alliance San Jose 1994 (4 Héros)',
    category: 'MILITARY_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien vs. Predator (Capcom Arcade 1994)',
    biomeId: 'los_angeles_1997',
    recommendedBiome: 'San Jose Infesté (Californie)',
    description: 'Le quatuor mythique du jeu d\'arcade Capcom : Dutch Schaefer cybernétique et Linn Kurosawa combattant épaule contre épaule avec deux Yautja nobles.',
    tactics: 'Combos d\'arts martiaux Ki, barrages de canon-bras Vulcan et salves croisées de lances Naginata et Smartguns.',
    totalHonorReward: 5400,
    soloVariantId: 'alien_base_major_dutch_schaefer_cyborg',
    members: [
      { id: 'dutch_cyborg_94', name: 'Major Dutch Schaefer (Cyborg)', role: 'Colosse Bionique USCM', weapon: 'Canon-Bras Cybernétique Plasma-Vulcan', hp: 650, armor: 70, trophy: 'Servomoteur Hydraulique du Bras Bionique de Dutch' },
      { id: 'linn_kurosawa', name: 'Lieutenante Linn Kurosawa', role: 'Maître Sabreuse Cyborg du 13e Corps', weapon: 'Katana Haute Fréquence & Pistolet Rapide', hp: 520, armor: 50, trophy: 'Garde de Katana (Tsuba) Gravée de Linn Kurosawa' },
      { id: 'capcom_warrior', name: 'Predator Warrior (San Jose)', role: 'Vétéran Lancier Yautja', weapon: 'Naginata Combi-Stick & Canon d\'Épaule', hp: 680, armor: 65, trophy: 'Pointe de Naginata Cérémoniale de San Jose' },
      { id: 'capcom_hunter', name: 'Predator Hunter (San Jose)', role: 'Chasseur Agile au Disque', weapon: 'Smart Disc Tranchant & Lames de Poignet', hp: 620, armor: 60, trophy: 'Biomasque Bronze Classique de l\'Alliance de 1994' }
    ]
  },
  {
    id: 'squad_lv742_kainde_amedha_shrine_2003',
    name: 'Garde Sacrée du Sanctuaire de LV-742 — Blazer, Hydra & Ancien (2003)',
    shortName: 'Sanctuaire LV-742 (4 Castes)',
    category: 'SUPER_PREDATORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens Versus Predator: Extinction (EA / Zono 2003)',
    biomeId: 'yautja_prime',
    recommendedBiome: 'Sanctuaire Volcanique de LV-742',
    description: 'La force militaire lourde Yautja mobilisée sur LV-742 pour défendre le Shrine sacré contre les Ravagers xénomorphes et l\'USCM.',
    tactics: 'Barrage d\'artillerie de missiles Hydra, faisceaux thermiques continus Blazer et bénédiction psychique du Shrine Keeper.',
    totalHonorReward: 5200,
    soloVariantId: 'prey_predalien_abomination',
    members: [
      { id: 'shrine_ancient', name: 'Ancien Gardien du Sanctuaire', role: 'Commandant Spirituel & Martial', weapon: 'Sceptre Lancier Millénaire & Disque Solaire', hp: 720, armor: 75, trophy: 'Relique Sacrée du Sanctuaire de LV-742' },
      { id: 'blazer_predator', name: 'Blazer Predator (Caste Thermique)', role: 'Incinérateur Lourd en Exo-Armure', weapon: 'Doubles Canons Thermiques à Faisceau de Lave', hp: 660, armor: 70, trophy: 'Buse Thermique en Platine d\'Armure Blazer' },
      { id: 'hydra_predator', name: 'Hydra Predator (Caste Artillerie)', role: 'Bombardier Multi-Ogives', weapon: 'Lance-Missiles Dorsal Guidé Hydra & Glaive', hp: 640, armor: 65, trophy: 'Module de Verrouillage Multi-Cibles Hydra' },
      { id: 'stalker_lv742', name: 'Stalker Predator (LV-742)', role: 'Tireur d\'Élite Longue Portée', weapon: 'Fusil-Harpon Balistique Lourd & Camouflage', hp: 530, armor: 50, trophy: 'Carquois de Fléchettes en Tungstène de LV-742' }
    ]
  },
  {
    id: 'squad_ny_detective_john_schaefer_1989',
    name: 'Brigade Criminelle NYPD & Détective John Schaefer — Canicule (1989)',
    shortName: 'Détective Schaefer NYPD (4 Agents)',
    category: 'LAW_ENFORCEMENT',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Concrete Jungle / Cold War (Comics Dark Horse 1989-1991)',
    biomeId: 'los_angeles_1997',
    recommendedBiome: 'Manhattan Sous Canicule (1989)',
    description: 'Le frère du Major Dutch Schaefer, inspecteur du NYPD acharné, épaulé par son coéquipier Rasche et le général russe Arsenjev.',
    tactics: 'Tirs d\'arrêt au calibre 12 scié, embuscades urbaines dans les ruelles et utilisation d\'armes Yautja capturées.',
    totalHonorReward: 4200,
    soloVariantId: 'alien_base_major_dutch_schaefer_1987',
    members: [
      { id: 'john_schaefer_89', name: 'Détective John Schaefer', role: 'Inspecteur Vétéran NYPD & Frère de Dutch', weapon: 'Calibre 12 Scié Ithaca 37 & Colt Python .357', hp: 510, armor: 45, trophy: 'Insigne de Détective NYPD Ébréché de John Schaefer' },
      { id: 'det_rasche', name: 'Inspecteur Rasche', role: 'Partenaire Fidèle de la Criminelle', weapon: 'Fusil d\'Assaut M16A2 & Revolver de Service', hp: 420, armor: 40, trophy: 'Holster d\'Épaule Cuir de l\'Inspecteur Rasche' },
      { id: 'capt_phillips_nypd', name: 'Capitaine Phillips (SWAT NYPD)', role: 'Commandant d\'Intervention Tactique', weapon: 'Pistolet-Mitrailleur H&K MP5 & Bouclier', hp: 440, armor: 50, trophy: 'Casque Balistique Fendu du SWAT de Manhattan' },
      { id: 'gen_arsenjev_ally', name: 'Colonel Nikolai Arsenjev', role: 'Officier de Liaison Spetsnaz GRU', weapon: 'Fusil d\'Assaut AK-74M & Lance-Grenades GP-25', hp: 460, armor: 50, trophy: 'Étoile Soviétique de la Campagne de Ligotka' }
    ]
  },
  {
    id: 'squad_killer_clan_bad_blood_pack',
    name: 'Meute Hérétique du Clan « Killer » & Xénomorphes Asservis',
    shortName: 'Clan Killer Bad Bloods (4 Renégats)',
    category: 'SUPER_PREDATORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Hunters / AVP: Three World War (Comics Dark Horse)',
    biomeId: 'jungle',
    recommendedBiome: 'Jungle Insulaire &Avant-Poste du Clan Killer',
    description: 'Faction organisée de Bad Bloods ayant trahi le Code d\'Honneur pour dresser des Xénomorphes captifs en laisse neuro-électrique.',
    tactics: 'Lâcher de Xénomorphes d\'assaut sous collier électrique suivi de tirs de barrage plasma sans discernement.',
    totalHonorReward: 5300,
    soloVariantId: 'alien_base_alpha_predator_kaail',
    members: [
      { id: 'killer_chieftain', name: 'Chef de Guerre du Clan Killer', role: 'Seigneur Bad Blood en Armure d\'Os', weapon: 'Glaive Dentelé Empoisonné & Canon Plasma Lourd', hp: 690, armor: 70, trophy: 'Biomasque à Cornes Rouges du Clan Killer' },
      { id: 'killer_beastmaster', name: 'Dompteur Xéno Bad Blood', role: 'Maître-Chien Neuro-Cybernétique', weapon: 'Collier d\'Asservissement Xéno & Fouet Électrique', hp: 580, armor: 55, trophy: 'Émetteur Neuro-Inhibiteur Dorsal du Dompteur' },
      { id: 'killer_flayer', name: 'Écorcheur Renégat Killer', role: 'Assassin Frénétique de Corps à Corps', weapon: 'Doubles Lames Crantées & Filet Tranchant', hp: 560, armor: 50, trophy: 'Trophée Humain Profané du Clan Killer' },
      { id: 'leashed_xeno_drone', name: 'Xénomorphe d\'Attaque Enchaîné', role: 'Bête de Guerre Lobotomisée', weapon: 'Griffes Chitinisées, Queue Faux & Sang Acide', hp: 520, armor: 45, trophy: 'Crâne Xénomorphe Cerclé d\'Acier Neuro-Conducteur' }
    ]
  },
  {
    id: 'squad_out_of_shadows_marion_miners_2159',
    name: 'Survivants du DSMO Marion — Chris "Hoop" Hooper & LV-178 (2159)',
    shortName: 'Mineurs DSMO Marion (4 Survivants)',
    category: 'CIVILIAN_SURVIVORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien: Out of the Shadows (Roman Canon Tim Lebbon 2014)',
    biomeId: 'hive_lv426',
    recommendedBiome: 'Mines de Trimonite de LV-178',
    description: 'L\'équipage minier du cargo DSMO Marion ayant combattu dans les profondeurs de LV-178 aux côtés d\'Ellen Ripley contre l\'essaim et l\'I.A. d\'Ash.',
    tactics: 'Utilisation d\'outils de découpe thermique à Trimonite, charges sismiques minières et verrouillage de galeries.',
    totalHonorReward: 3400,
    soloVariantId: 'prey_weyland_combat_android',
    members: [
      { id: 'chris_hooper', name: 'Chris "Hoop" Hooper', role: 'Chef Ingénieur Minier du Marion', weapon: 'Découpeur Thermique à Arc de Trimonite', hp: 410, armor: 40, trophy: 'Fragment Pur de Trimonite Brut de LV-178' },
      { id: 'kasyanov_eng', name: 'Ingénieure Kasyanov', role: 'Spécialiste Forages & Explosifs', weapon: 'Lance-Charges Sismiques & Pistolet Industriel', hp: 360, armor: 35, trophy: 'Détonateur Sismique des Puits de LV-178' },
      { id: 'capt_jordan_marion', name: 'Capitaine Lucy Jordan', role: 'Commandante de la Navette d\'Extraction', weapon: 'Fusil à Pompe de Sécurité Orbitale', hp: 350, armor: 30, trophy: 'Journal de Bord Crypté du DSMO Marion' },
      { id: 'baxter_miner', name: 'Chef de Sécurité Baxter', role: 'Garde Minier en Exosquelette Léger', weapon: 'Rivet Gun Haute Pression & Torche Plasma', hp: 390, armor: 45, trophy: 'Casque de Mineur Fendu des Galeries Profondes' }
    ]
  },
  {
    id: 'squad_upp_space_commandos_2184',
    name: 'Escouade d\'Assaut Spatiale de l\'UPP — Commissaire Volkov (2184)',
    shortName: 'Commandos Spatiaux UPP (4 Soldats)',
    category: 'COLONIAL_MARINES',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien: The Roleplaying Game — Union of Progressive Peoples',
    biomeId: 'stargazer_blacksite',
    recommendedBiome: 'Station Spatiale Frontière de l\'UPP',
    description: 'Unité d\'élite des Forces Spatiales de l\'Union des Peuples Progressistes (UPP) déployée pour sécuriser les stations de la Frontière.',
    tactics: 'Feu de suppression au fusil AK-4047, grenades thermobariques soviéto-spatiales et discipline idéologique inflexible.',
    totalHonorReward: 4100,
    soloVariantId: 'alien_base_william_hudson_private',
    members: [
      { id: 'commissar_volkov', name: 'Commissaire Politique Volkov', role: 'Commandant Tactique de la Sécurité d\'État UPP', weapon: 'Fusil d\'Assaut AK-4047 & Pistolet Makarov Spatial', hp: 430, armor: 50, trophy: 'Étoile Vermeille de Commissaire Spatial de l\'UPP' },
      { id: 'upp_heavy_gunner', name: 'Artilleur Lourd Kovalenko', role: 'Spécialiste Mitrailleuse Orbitale', weapon: 'Mitrailleuse Lourde UPP PKP-Spatial 12.7mm', hp: 480, armor: 60, trophy: 'Bande de Munitions Tungstène de l\'UPP' },
      { id: 'upp_void_sapper', name: 'Sapeur Spetsnaz Zaitsev', role: 'Expert Brèche & Décontamination Thermique', weapon: 'Lance-Flammes Lourd UPP & Mines Magnétiques', hp: 420, armor: 50, trophy: 'Masque Respiratoire Pressurisé des Commandos UPP' },
      { id: 'upp_combat_synth', name: 'Synthétique d\'État Série-Soyouz', role: 'Androïde Militaire Blindé de l\'UPP', weapon: 'Fusil de Précision SVD-Spatial & Matraque Choc', hp: 490, armor: 55, trophy: 'Noyau Logique Cybergénétique Série-Soyouz' }
    ]
  },
  {
    id: 'squad_life_and_death_hasdrubal_marines_2219',
    name: 'Peloton USCM de l\'USS Hasdrubal & Capitaine Julie Paget (2219)',
    shortName: 'Peloton USS Hasdrubal (4 Vétérans)',
    category: 'COLONIAL_MARINES',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator / Aliens vs. Predator: Life and Death (Dark Horse 2016)',
    biomeId: 'genna_deathworld',
    recommendedBiome: 'Jungle de Tartarus & Cratère LV-223',
    description: 'Le détachement héroïque des Marines Coloniaux de la capitaine Julie Paget ayant forgé un pacte de sang avec le chasseur Ahab contre les Ingénieurs.',
    tactics: 'Formation défensive en carré, tirs concentrés de M41A Mk2 et appui balistique lourd au Smartgun.',
    totalHonorReward: 4600,
    soloVariantId: 'alien_base_william_hudson_private',
    members: [
      { id: 'capt_julie_paget', name: 'Capitaine Julie Paget', role: 'Commandante de Compagnie USS Hasdrubal', weapon: 'Carabine M41A Mk2 & Lance-Grenades Incendiaire', hp: 470, armor: 55, trophy: 'Plaques d\'Identité USCM de la Capitaine Paget' },
      { id: 'sgt_roth_hasdrubal', name: 'Sergent d\'Artillerie Roth', role: 'Sous-Officier Vétéran USCM', weapon: 'Mitrailleuse Gyro-Stabilisée M56 Smartgun', hp: 500, armor: 60, trophy: 'Bras Articulé de Smartgun de la Campagne de Tartarus' },
      { id: 'corp_mishima', name: 'Caporal K. Mishima', role: 'Éclaireur & Opérateur Détecteur de Mouvement', weapon: 'Fusil à Pompe M37A2 & Grenades Frag M40', hp: 410, armor: 45, trophy: 'Détecteur de Mouvement Fissuré sur LV-223' },
      { id: 'pvt_howard_medic', name: 'Soldat Infirmière Howard', role: 'Médecin de Combat de Première Ligne', weapon: 'Carabine M41A & Injecteur Stimulant de Survie', hp: 390, armor: 45, trophy: 'Trousse Chirurgicale Militaire de l\'USS Hasdrubal' }
    ]
  },
  {
    id: 'squad_avp_eternal_suwa_syndicate_1998',
    name: 'Empire Cyber-Immortel de Gideon Suwa & Rebecca Yuh — Tokyo (1998)',
    shortName: 'Syndicat Suwa Tokyo (4 Cibles)',
    category: 'MERCENARY_PIRATES',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens vs. Predator: Eternal (Comics Dark Horse 1998)',
    biomeId: 'los_angeles_1997',
    recommendedBiome: 'Tour Cybernétique Suwa (Tokyo 1998)',
    description: 'Le milliardaire vieux de sept siècles Gideon Suwa et sa garde prétorienne équipée d\'exosquelettes et d\'armes lasers rétro-conçues à partir d\'une épave Yautja.',
    tactics: 'Verrouillage par tourelles lasers rétro-conçues, armures assistées lourdes et lâcher d\'urgence de Xénomorphes captifs.',
    totalHonorReward: 4800,
    soloVariantId: 'prey_weyland_combat_android',
    members: [
      { id: 'gideon_suwa_1998', name: 'Gideon Suwa (L\'Immortel de 700 Ans)', role: 'Patriarche Pillard de Technologie Yautja', weapon: 'Exosquelette Royal & Canon Laser Yautja Rétro-Conçu', hp: 590, armor: 65, trophy: 'Flacon de Sérum Cardiaque Yautja de Gideon Suwa' },
      { id: 'rebecca_yuh', name: 'Rebecca Yuh', role: 'Journaliste d\'Investigation & Survivante', weapon: 'Pistolet Automatique 9mm & Caméra Thermique', hp: 340, armor: 25, trophy: 'Disque Optique des Archives Secrètes de l\'Épave' },
      { id: 'suwa_exo_commander', name: 'Commandant Kenshin (Garde Suwa)', role: 'Chef de la Sécurité en Exo-Armure', weapon: 'Canon à Faisceau Photonique Lourd & Lame Vibrante', hp: 510, armor: 60, trophy: 'Casque Cyber-Samouraï de la Corporation Suwa' },
      { id: 'suwa_bio_handler', name: 'Technicien des Cuves Xéno', role: 'Opérateur de Stase du Vaisseau Englouti', weapon: 'Fusil Électromagnétique IEM & Lance-Cryo', hp: 410, armor: 45, trophy: 'Clé d\'Activation de la Soute du XIVe Siècle' }
    ]
  },
  {
    id: 'squad_london_1896_edward_soames',
    name: 'Brigade de Scotland Yard & Capitaine Edward Soames — Whitechapel (1896)',
    shortName: 'Scotland Yard 1896 (4 Hommes)',
    category: 'LAW_ENFORCEMENT',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Nemesis (Comics Dark Horse 1896)',
    biomeId: 'los_angeles_1997',
    recommendedBiome: 'Londres Victorien & Smog (1896)',
    description: 'La brigade d\'enquête criminelle victorienne menée par le Capitaine Soames traquant le tueur rituel de Whitechapel dans les égouts et la brume londonienne.',
    tactics: 'Tirs de barrage au gros calibre .455 Webley, charges au sabre d\'officier et battues au sifflet dans le brouillard.',
    totalHonorReward: 3900,
    soloVariantId: 'prey_jungle_hunter_1987',
    members: [
      { id: 'capt_edward_soames', name: 'Capitaine Edward Soames', role: 'Officier d\'Infanterie Vétéran & Limier', weapon: 'Revolver Webley .455 & Sabre d\'Infanterie', hp: 480, armor: 40, trophy: 'Montre à Gousset en Argent du Capitaine Soames' },
      { id: 'insp_reid_scotland', name: 'Inspecteur Joseph Reid', role: 'Enquêteur Principal de Whitechapel', weapon: 'Fusil Martini-Henry & Menottes en Acier', hp: 410, armor: 35, trophy: 'Carnet d\'Autopsies Fissuré de Whitechapel 1896' },
      { id: 'dr_watson_coroner', name: 'Dr Watson (Médecin Légiste)', role: 'Chirurgien Militaire de Terrain', weapon: 'Scalpel d\'Autopsie & Pistolet Derringer', hp: 350, armor: 25, trophy: 'Trousse Chirurgicale en Cuir Victorienne' },
      { id: 'constable_bobby', name: 'Agent de Police Bobby', role: 'Patrouilleur Nocturne de la Tamise', weapon: 'Matraque en Bois d\'Ébène & Sifflet d\'Alerte', hp: 380, armor: 30, trophy: 'Casque Custodian Bombé de la Police Métropolitaine' }
    ]
  },
  {
    id: 'squad_south_china_sea_pirates_1998',
    name: 'Mercenaires des Spratleys & Pirates de Mer de Chine — Bear (1998)',
    shortName: 'Mercenaires Spratleys (4 Soldats)',
    category: 'MERCENARY_PIRATES',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: South China Sea (Roman Paul A. Carter 1998)',
    biomeId: 'jungle',
    recommendedBiome: 'Atoll des Spratleys & Mangroves (1998)',
    description: 'La troupe de mercenaires et pirates retranchée sur un atoll des îles Spratleys sous le typhon, confrontée au carnage d\'un chasseur Yautja solitaire.',
    tactics: 'Tirs de suppression au RPK, snipes longue portée au Dragunov dans la pluie et charges à la machette.',
    totalHonorReward: 4300,
    soloVariantId: 'alien_base_royce_mercenaire_2010',
    members: [
      { id: 'bear_mercenary', name: 'Bear (Chef Mercenaire)', role: 'Colosse d\'Infanterie Lourde', weapon: 'Mitrailleuse RPK & Machette de Jungle', hp: 550, armor: 50, trophy: 'Ceinturon de Cartouches Ébréché du Colosse Bear' },
      { id: 'capt_tran_pirate', name: 'Capitaine Tran', role: 'Tireur d\'Élite des Marais', weapon: 'Fusil Sniper Dragunov SVD & Lunette PSO-1', hp: 410, armor: 35, trophy: 'Boussole Nautique en Laiton de la Mer de Chine' },
      { id: 'nguyen_demolitions', name: 'Artilleur Nguyen', role: 'Expert Sabotage & Roquettes', weapon: 'Lance-Roquettes RPG-7 & Pistolet Tokarev', hp: 430, armor: 40, trophy: 'Roquette Inerte RPG-7 Gravée au Couteau' },
      { id: 'mangrove_pirate_scout', name: 'Pisteur de Mangrove', role: 'Éclaireur des Palétuviers', weapon: 'Fusil Saiga Calibre 12 & Harpon de Chasse', hp: 370, armor: 30, trophy: 'Dents de Crocodile de Mer en Collier de Pêcheur' }
    ]
  },
  {
    id: 'squad_genocide_grant_xeno_zip_2190',
    name: 'Corps Expéditionnaire du Cargo Grant & Chimistes Xeno-Zip (2190)',
    shortName: 'Expédition Grant (4 Spécialistes)',
    category: 'MILITARY_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens: Genocide (Comics Dark Horse 1991)',
    biomeId: 'hive_lv426',
    recommendedBiome: 'Front de Ruche Rouge & Noire',
    description: 'L\'équipe de mercenaires et scientifiques infiltrant Xenomorph Prime en pleine guerre civile des ruches pour moissonner la Gelée Royale rouge.',
    tactics: 'Vitesse surhumaine sous stimulant Xeno-Zip, tirs d\'assaut au M42B et extraction d\'échantillons acides par lance-cryo.',
    totalHonorReward: 4600,
    soloVariantId: 'prey_colonial_marine_heavy',
    members: [
      { id: 'daniel_grant', name: 'Daniel Grant (Commandant)', role: 'Chef d\'Expédition & Explorateur', weapon: 'Carabine Commando M42B & Auto-Injecteur Xeno-Zip', hp: 490, armor: 50, trophy: 'Fiole Scellée de Gelée Royale Rouge Pure' },
      { id: 'dr_jillian_ohara', name: 'Dr Jillian O\'Hara', role: 'Biochimiste Spécialiste Xeno-Zip', weapon: 'Injecteur Cryogénique & Pistolet Smart', hp: 360, armor: 30, trophy: 'Seringue Motorisée de Prélèvement d\'Ovocyte Royal' },
      { id: 'xeno_zip_berserker', name: 'Fantassin Dopé Xeno-Zip', role: 'Soldat d\'Assaut en Furie Métabolique', weapon: 'Double Fusil à Pompe Lourd & Doses Surchargées', hp: 540, armor: 55, trophy: 'Harnais d\'Injection Trachéale Surchargé de Xeno-Zip' },
      { id: 'grant_extractor_pilot', name: 'Pilote d\'Évacuation Hendrix', role: 'Soutien Balistique & Balises', weapon: 'Pistolet Mitrailleur VP70 & Grenades IEM', hp: 390, armor: 40, trophy: 'Casque de Vol Pressurisé du Transporteur Grant' }
    ]
  },
  {
    id: 'squad_cold_forge_rb323_science_2179',
    name: 'Division de Recherche Clandestine Cold Forge — Station RB-323 (2179)',
    shortName: 'Cold Forge RB-323 (4 Chercheurs)',
    category: 'SYNTHETIC_PACK',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien: The Cold Forge (Roman Canon Alex White 2018)',
    biomeId: 'stargazer_blacksite',
    recommendedBiome: 'Station Orbitale RB-323',
    description: 'Le commandement scientifique clandestin de la station orbitale RB-323 supervisant les chimères Snatchers sous le contrôle du Dr Marsalis et de Dorian Sudler.',
    tactics: 'Décharges bio-électriques paralysantes, armes de poing à fléchettes neurotoxiques et assauts coordonnés par téléprésence synthétique.',
    totalHonorReward: 4400,
    soloVariantId: 'prey_weyland_combat_android',
    members: [
      { id: 'dorian_sudler_auditor', name: 'Dorian Sudler (Vérificateur)', role: 'Agent Exécuteur Weyland-Yutani', weapon: 'Pistolet à Aiguilles Neurotoxiques & Taser 80 kV', hp: 460, armor: 45, trophy: 'Insigne d\'Accréditation Secrète Weyland-Yutani Special Bio' },
      { id: 'blue_marsalis_marcus', name: 'Dr Blue Marsalis (Avatar Marcus)', role: 'Neurobiologiste en Téléprésence Synthétique', weapon: 'Châssis Synthétique Marcus & Scanner Neural', hp: 530, armor: 55, trophy: 'Interface Neuro-Synaptique de Téléprésence de Marsalis' },
      { id: 'cold_forge_officer', name: 'Capitaine de Sécurité RB-323', role: 'Garde de Confinement Haute Sécurité', weapon: 'Fusil d\'Assaut Modulaire Weyland & Bouclier Choc', hp: 440, armor: 50, trophy: 'Matricule Gravé de la Station Clandestine Cold Forge' },
      { id: 'snatcher_technician', name: 'Technicien de Manipulation Snatcher', role: 'Manipulateur de Cuves d\'Incubation', weapon: 'Gantelet Haute Tension & Pince Cryo', hp: 380, armor: 35, trophy: 'Pince de Manipulation Cryo à Facehuggers Snatcher' }
    ]
  },
  {
    id: 'squad_bunda_war_machiko_clan_2194',
    name: 'Chasseurs d\'Honneur Yautja de Bunda & Machiko Noguchi (2194)',
    shortName: 'Clan Noguchi Bunda (4 Guerriers)',
    category: 'SUPER_PREDATORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens vs. Predator: War (Comics Dark Horse 1995)',
    biomeId: 'ryushi_desert',
    recommendedBiome: 'Colonie Minière de Bunda',
    description: 'Le clan d\'honneur Yautja de Top Knot traquant sur le monde aride de Bunda aux côtés de Machiko Noguchi avant la scission éthique finale.',
    tactics: 'Salves d\'arc composite Yautja, charges coordonnées aux doubles wristblades et tirs lourds de canons à plasma à focalisation large.',
    totalHonorReward: 5600,
    soloVariantId: 'alien_base_alpha_predator_kaail',
    members: [
      { id: 'machiko_bunda_warrior', name: 'Machiko Noguchi (Da\'dtou-di)', role: 'Humaine Sang-Marqué & Initiée', weapon: 'Lames de Poignet Cérémoniales & Arc Composite', hp: 580, armor: 55, trophy: 'Marque de Clan Graffée sur le Front de Machiko' },
      { id: 'top_knot_leader', name: 'Top Knot (Chef de Meute)', role: 'Seigneur de Chasse Yautja Vénérable', weapon: 'Glaive Royal Anti-Acide & Plasmacaster', hp: 760, armor: 75, trophy: 'Crâne de Reine Xénomorphe Ciselé du Chef Top Knot' },
      { id: 'shorty_aggressive', name: 'Shorty (Guerrier Agressif)', role: 'Chasseur Sang-Froid Sans Pitié', weapon: 'Doubles Lames Écorcheuses & Lance-Filet Lourd', hp: 630, armor: 60, trophy: 'Masque d\'Airain Fendu par un Coup de Griffe' },
      { id: 'dabpoi_stalker', name: 'Dab\'poi (Pisteur Vétéran)', role: 'Maître Éclaireur de Meute', weapon: 'Combi-Stick Perforant & Mines à Plasma', hp: 600, armor: 55, trophy: 'Balise de Guidage Tactique du Clan de Bunda' }
    ]
  },
  {
    id: 'squad_primal_hunt_ancient_lv1201_2002',
    name: 'Gardiens du Sanctuaire de l\'Artefact — Ancient & Iron Bears (LV-1201)',
    shortName: 'Gardiens LV-1201 (4 Champions)',
    category: 'MILITARY_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens vs. Predator 2: Primal Hunt (Sierra / Monolith 2002)',
    biomeId: 'hive_lv426',
    recommendedBiome: 'Ruines Souterraines de LV-1201',
    description: 'L\'Ancient Predator tiré d\'un sommeil de cinq siècles par le bris du pod de stase, allié de circonstance contre les mercenaires de Dunya et l\'essaim.',
    tactics: 'Tirs de barrage au canon portatif 20mm HEAP, ondes de choc de l\'artefact Ingénieur et duel à la lance de stase antique.',
    totalHonorReward: 5400,
    soloVariantId: 'prey_hish_qu_ten_ancient',
    members: [
      { id: 'ancient_lv1201_hunter', name: 'Ancient Predator (Éveillé de Stase)', role: 'Maître Chasseur Millénaire de LV-1201', weapon: 'Lance Antique de Stase & Canon Plasmique d\'Épaule', hp: 750, armor: 75, trophy: 'Cristal d\'Activation du Pod de Stase de LV-1201' },
      { id: 'dunya_iron_bear', name: 'Caporal Dunya (Mercenaire)', role: 'Tireuse Lourde des Iron Bears', weapon: 'Canon Lourd Portatif 20mm HEAP & Grenades', hp: 500, armor: 55, trophy: 'Écusson Brodé des Mercenaires Iron Bears de LV-1201' },
      { id: 'iron_bear_commando', name: 'Commando Lourd Iron Bear', role: 'Fantassin de Rupture de Blindage', weapon: 'Fusil d\'Assaut à Roquettes 15mm & Cuirasse', hp: 470, armor: 55, trophy: 'Viseur Électronique Fêlé des Ruines de LV-1201' },
      { id: 'pod_custodian_synth', name: 'Synthétique de Maintenance POD-9', role: 'Androïde de Sécurité du Complexe', weapon: 'Torche de Découpe Plasma & Pulsar IEM', hp: 490, armor: 50, trophy: 'Circuit Imprimé Logique du Régulateur de Stase' }
    ]
  },
  {
    id: 'squad_pirates_raphael_andolini_1718',
    name: 'Équipage Pirate du Capitaine Raphael Andolini (1718)',
    universe: 'PREDATOR',
    shortName: 'Pirates d\'Andolini 1718 (4 Boucaniers)',
    category: 'HUMAN_SURVIVORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: 1718 (Comics Dark Horse 1996)',
    biomeId: 'jungle',
    recommendedBiome: 'Crique Tropicale & Plage des Flibustiers (1718)',
    description: 'Le capitaine Raphael Andolini et ses officiers rebelles affrontant une mutinerie sanglante dans une crique sauvage, observés par le jeune chasseur Yautja.',
    tactics: 'Tirs de pistolets à silex de salve, charges furieuses au sabre d\'abordage et grenades de poudre noire rudimentaires.',
    totalHonorReward: 4400,
    soloVariantId: 'alien_base_big_beard_voyageur_1719',
    members: [
      { id: 'andolini_captain', name: 'Capitaine Raphael Andolini', role: 'Capitaine Corsaire d\'Honneur', weapon: 'Pistolet à Silex d\'Or 1718 & Sabre d\'Abordage', hp: 480, armor: 35, trophy: 'Boussole Navale en Argent Gravée du Capitaine Andolini' },
      { id: 'perez_first_mate', name: 'Maître Perez', role: 'Second d\'Équipage Loyal', weapon: 'Sabre d\'Abordage Double & Tromblon de Calibre', hp: 420, armor: 30, trophy: 'Ceinturon de Cuir Tanné aux Armes de Guinée' },
      { id: 'vane_cannoneer', name: 'Canonnier Vane', role: 'Artilleur de Pont Lourd', weapon: 'Grenades de Poudre Noire & Hachette de Bord', hp: 400, armor: 25, trophy: 'Mèche Lente et Boutefeu d\'Artillerie Navale' },
      { id: 'quartermaster_smee', name: 'Boucannier Pistolier Smee', role: 'Pistolier Flibustier des Criques', weapon: 'Paires de Pistolets de Mer & Dague de Botte', hp: 380, armor: 20, trophy: 'Pièce de Huit Espagnole Percée en Amulette' }
    ]
  },
  {
    id: 'squad_alaska_primal_rangers_1997',
    name: 'Garde Forestière & Rangers de l\'Alaska Wilderness (1997)',
    universe: 'PREDATOR',
    shortName: 'Rangers de l\'Arctique (4 Traqueurs)',
    category: 'HUMAN_SURVIVORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Primal (Comics Dark Horse 1997)',
    biomeId: 'jungle',
    recommendedBiome: 'Toundra Boréale & Forêts Glacées d\'Alaska (1997)',
    description: 'L\'escouade de rangers et pisteurs inuits luttant contre les prédateurs des glaces et le chasseur extraterrestre dans le blizzard.',
    tactics: 'Tirs lourds au .45-70 à percussion, pièges à ours dissimulés sous la neige et charges territoriales dévastatrices.',
    totalHonorReward: 4600,
    soloVariantId: 'alien_base_royce_mercenaire_2010',
    members: [
      { id: 'maccallister_ranger_chief', name: 'Ranger en Chef MacCallister', role: 'Commandant des Gardes Boréaux', weapon: 'Carabine Marlin .45-70 Guide Gun & Couteau de Survie', hp: 500, armor: 40, trophy: 'Insigne Émaillé des Rangers de l\'Alaska Wilderness' },
      { id: 'nanook_inuit_tracker', name: 'Pisteur Arctique Nanook', role: 'Éclaireur des Banquises et Toundras', weapon: 'Fusil de Précision à Lunette & Harpon Boréal', hp: 420, armor: 30, trophy: 'Collier en Dents d\'Ours Polaire et Tendons' },
      { id: 'vance_wildlife_vet', name: 'Docteur Vance (Vétérinaire)', role: 'Soutien Médical & Fléchettes Sédatives', weapon: 'Fusil Tranquillisant Haute Pression & Calibre 12', hp: 390, armor: 25, trophy: 'Seringue d\'Extraction de Toxines d\'Alaska' },
      { id: 'kodiak_grizzly_alpha', name: 'Grizzly Mâle Alpha des Aléoutiennes', role: 'Colosse Territorial Félin', weapon: 'Griffes Éventreuses de 15cm & Mâchoire Broyeuse', hp: 620, armor: 45, trophy: 'Crâne Massif du Grand Grizzly de l\'Alaska' }
    ]
  },
  {
    id: 'squad_defiance_zula_hendricks_fireteam',
    name: 'Escouade Clandestine USCM & Synthétique Davis 01 (2137)',
    universe: 'ALIEN',
    shortName: 'Équipe Defiance Europa (4 Rebelles)',
    category: 'MILITARY_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens: Defiance (Comics Dark Horse 2016-2019)',
    biomeId: 'stargazer_blacksite',
    recommendedBiome: 'Cuirassé USCSS Europa & Sas Orbitaux (2137)',
    description: 'La fusilière insurgée Zula Hendricks et le synthétique Davis 01 en mission secrète pour détruire les spécimens biologiques de Weyland-Yutani.',
    tactics: 'Tirs de barrage coordonnés au fusil à impulsion, verrouillage de sas à distance et charges explosives de démolition.',
    totalHonorReward: 4900,
    soloVariantId: 'alien_base_zula_hendricks_defiance_marine',
    members: [
      { id: 'zula_hendricks_marine', name: 'Fusilière Zula Hendricks', role: 'Marine Coloniale en Exosquelette Spinal', weapon: 'Armat M41A Pulse Rifle Modifié & Dague USCM', hp: 480, armor: 45, trophy: 'Plaque d\'Identification Martiale de Zula Hendricks' },
      { id: 'davis01_synthetic_specops', name: 'Davis 01 (Synthétique Autonome)', role: 'Tacticien de Rupture Weyland Reconditionné', weapon: 'Carabine Lourde M42A & Outil de Piratage Neural', hp: 540, armor: 55, trophy: 'Puce Synaptique d\'Émancipation de Davis 01' },
      { id: 'dr_hollis_field_surgeon', name: 'Dr. Hollis (Médecin de Bord)', role: 'Chirurgienne de Confinement Biologique', weapon: 'Pistolet Sédatif VP-70 & Scanner Bio-Toxique', hp: 390, armor: 30, trophy: 'Injecteur d\'Anti-Acide d\'Urgence de l\'USCSS Europa' },
      { id: 'defiance_uscm_trooper', name: 'Commando Insurgé USCM', role: 'Fusilier d\'Appui Lourd', weapon: 'Mitrailleuse Légère M56 & Visière Thermique', hp: 460, armor: 50, trophy: 'Casque Fêlé de Marine Rebelle de l\'Europa' }
    ]
  },
  {
    id: 'squad_nightmare_asylum_spears_command',
    name: 'État-Major Militaire Insurgé du Général Spears (2192)',
    universe: 'ALIEN',
    shortName: 'Commandement Nightmare Spears (4 Officiers)',
    category: 'MILITARY_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens: Nightmare Asylum (Comics Dark Horse 1989-1990)',
    biomeId: 'stargazer_blacksite',
    recommendedBiome: 'Base Secrète du Général Spears (Nightmare Asylum)',
    description: 'Le général Thomas Spears et sa garde prétorienne conditionnant des hordes de Xénomorphes dociles pour reprendre la Terre dévastée.',
    tactics: 'Faisceaux d\'énergie à particules lourdes, décharges d\'aiguillons neuro-électriques et saturation au tir automatique.',
    totalHonorReward: 5100,
    soloVariantId: 'prey_colonial_marine_heavy',
    members: [
      { id: 'general_thomas_spears', name: 'Général Thomas Spears', role: 'Stratège Militaire Fanatique', weapon: 'Fusil à Particules Prototype & Pistolet d\'Officier', hp: 520, armor: 50, trophy: 'Épaulette Étoilée Ensanglantée du Général Spears' },
      { id: 'col_alistair_strike_lead', name: 'Colonel Alistair', role: 'Commandant des Opérations Tactiques', weapon: 'Carabine Automatique de Précision & Grenades IEM', hp: 470, armor: 50, trophy: 'Moniteur Portatif de Fréquence Neurale Xéno' },
      { id: 'synth_bueller_reconditioned', name: 'Synthétique Bueller (Reconditionné)', role: 'Garde du Corps Bionique Cybernétique', weapon: 'Mitrailleur de Soutien Lourd 10mm & Blindage Coque', hp: 560, armor: 60, trophy: 'Unité Centrale Bionique du Modèle Bueller' },
      { id: 'asylum_handler_trooper', name: 'Dresseur Militaire de Spécimens', role: 'Spécialiste Confinement Électrique', weapon: 'Aiguillon Neural 120 kV & Pistolet Mitrailleur', hp: 430, armor: 40, trophy: 'Collier Électrique de Dressage Xénomorphe Fêlé' }
    ]
  },
  {
    id: 'squad_deadliest_caryn_big_mama_clan',
    name: 'Alliance Skyliner — Caryn Delacroix & Chasseresse Big Mama (2195)',
    universe: 'AVP',
    shortName: 'Clan Skyliner & Big Mama (4 Combattants)',
    category: 'HONOR_CLAN',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens vs. Predator: Deadliest of the Species (Comics Dark Horse 1993)',
    biomeId: 'stargazer_blacksite',
    recommendedBiome: 'Cité Céleste Skyliner de Lucien Delacroix (2195)',
    description: 'La matriarche guerrière Yautja Big Mama et Caryn Delacroix unies pour briser les conspirations corporatistes et exterminer les Hybrides Blancs.',
    tactics: 'Estocs surpuissants au combistick électro-plaqué, tirs d\'impulsion holographiques et contre-attaques acrobatiques.',
    totalHonorReward: 5600,
    soloVariantId: 'alien_base_alpha_predator_kaail',
    members: [
      { id: 'big_mama_huntress_yautja', name: 'Big Mama (Matriarche Chasseresse)', role: 'Maître Guerrière Yautja d\'Honneur', weapon: 'Combistick Électro-Plaqué & Canon Plasma d\'Épaule', hp: 780, armor: 80, trophy: 'Biomasque Cérémonial Doré de la Matriarche Big Mama' },
      { id: 'caryn_delacroix_rebel', name: 'Caryn Delacroix', role: 'Aristocrate Rebelle Transhumaniste', weapon: 'Fusil à Impulsion Skyliner & Dague Cérémoniale Yautja', hp: 460, armor: 40, trophy: 'Bague de Sceau de la Famille Delacroix de Skyliner' },
      { id: 'toy_synthetic_ai_drone', name: 'Toy (Synthétique Télépathique)', role: 'Avatar Holographique de Soutien', weapon: 'Projecteur d\'Ondes Électromagnétiques & Faisceau Laser', hp: 440, armor: 45, trophy: 'Matrice Cristalline de l\'Intelligence Artificielle Toy' },
      { id: 'white_hybrid_vanguard', name: 'Guerrier Hybride Blanc Renégat', role: 'Mutant Génétique Rallié à l\'Honneur', weapon: 'Griffes Acérées & Fusil d\'Assaut Corporatiste 10mm', hp: 580, armor: 55, trophy: 'Segment de Carapace Blanche de l\'Hybride Albinos' }
    ]
  },
  {
    id: 'squad_three_world_war_machiko_uscm',
    name: 'Front de Guerre Caparis VII — Coalition Noguchi & Marines (2198)',
    universe: 'AVP',
    shortName: 'Coalition Caparis VII (4 Légendes)',
    category: 'MILITARY_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens vs. Predator: Three World War (Comics Dark Horse 2010)',
    biomeId: 'hive_lv426',
    recommendedBiome: 'Champs de Bataille Tripartites de Caparis VII (2198)',
    description: 'L\'alliance historique entre Machiko Noguchi, le corps des Marines Coloniaux et les chasseurs Yautja face au Clan Killer renégat.',
    tactics: 'Tirs combinés cinétiques et plasmiques, assauts coordonnés aux lames de poignet et frappes de saturation au Smartgun.',
    totalHonorReward: 5800,
    soloVariantId: 'alien_base_major_dutch_schaefer_1987',
    members: [
      { id: 'machiko_noguchi_commander', name: 'Machiko Noguchi (Da\'dtou-di)', role: 'Commandante Suprême de la Coalition', weapon: 'Combo Fusil Pulse M41A2 & Micro-Plasmacaster Yautja', hp: 550, armor: 60, trophy: 'Médaillon de Commandement de l\'Alliance de Caparis VII' },
      { id: 'sgt_sereda_uscm_veteran', name: 'Sergent Sereda', role: 'Vétéran Tactique des Marines Coloniaux', weapon: 'Fusil à Impulsion M41A avec Lance-Grenades 30mm', hp: 480, armor: 50, trophy: 'Plaque d\'Honneur Martiale USCM Gravée au Sang' },
      { id: 'allied_clan_blade_master', name: 'Maître des Lames Yautja Allié', role: 'Champion Élite du Clan d\'Honneur', weapon: 'Combistick Double Tranchant & Disque Intelligent', hp: 740, armor: 75, trophy: 'Dague Cérémoniale d\'Amitié Inter-Espèces de Caparis VII' },
      { id: 'heavy_smartgunner_cooper', name: 'Canonnier Lourd Cooper', role: 'Tireur d\'Appui USCM', weapon: 'Mitrailleuse Lourde M56 Smartgun avec Harnais Autotrack', hp: 510, armor: 55, trophy: 'Tambour de Munitions 10×24mm Usé des Tranchées' }
    ]
  }
,
  {
    id: 'squad_xenogenesis_spearhead_mercenaries_1999',
    name: 'Commandos Cybernétiques de Spearhead Industries (1999)',
    universe: 'PREDATOR',
    shortName: 'Cyber-Commandos Spearhead (4 Soldats)',
    category: 'MILITARY_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Xenogenesis (Comics Dark Horse 1999)',
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Base Cyber-Militaire Spearhead & Jungle (1999)',
    description: 'L\'escouade de mercenaires cybernétiques d\'élite sous contrat Spearhead, équipés de fusils cryogéniques Sub-Zero pour capturer des chasseurs extraterrestres.',
    tactics: 'Jets continus d\'azote liquide cryogénique, tirs de suppression au laser et balayages radars thermiques.',
    totalHonorReward: 4800,
    soloVariantId: 'alien_base_royce_mercenaire_2010',
    members: [
      { id: 'mason_spearhead_lead', name: 'Capitaine Mason (Cyber-Commando)', role: 'Commandant d\'Assaut Cryo', weapon: 'Fusil Cryogénique Sub-Zero & Pistolet Laser', hp: 520, armor: 55, trophy: 'Insigne Cybernétique Doré de Spearhead Industries' },
      { id: 'vasquez_cyber_specialist', name: 'Spécialiste Vasquez (Bionique)', role: 'Opératrice de Verrouillage Thermique', weapon: 'Carabine Laser Haute Fréquence & Visière Sub-Zero', hp: 440, armor: 45, trophy: 'Module Oculaire Cyber-Sensoriel de Vasquez' },
      { id: 'jackson_heavy_gunner', name: 'Canonnier Lourd Jackson', role: 'Fantassin d\'Appui Lourd Cryo', weapon: 'Canon Cryo Rotatif Lourd & Cuirasse Renforcée', hp: 550, armor: 60, trophy: 'Valve de Décharge Cryogénique en Acier Trempé' },
      { id: 'alvarez_demolitions', name: 'Artilleur Alvarez', role: 'Expert Pièges & Charges Thermiques', weapon: 'Lance-Grenades Magnétiques & Shotgun de Combat', hp: 430, armor: 40, trophy: 'Détonateur Électronique d\'Amorçage de Spearhead' }
    ]
  },
  {
    id: 'squad_blood_feud_samurai_clan_1993',
    name: 'Lignée Martiale du Maître Aveugle Juta — Mont Fuji (1993)',
    universe: 'PREDATOR',
    shortName: 'Guerriers du Mont Fuji (4 Maîtres)',
    category: 'HUMAN_SURVIVORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Blood Feud (Comics Dark Horse 1993)',
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Sanctuaire Enneigé du Mont Fuji & Bambouseraie (1993)',
    description: 'Le maître sabreur aveugle Juta et ses disciples guerriers défendant le temple ancestral du Mont Fuji contre la vengeance d\'un chasseur Yautja.',
    tactics: 'Duels fulgurants d\'estoc au sabre forgé Muramasa, tirs de volée d\'arc Yumi silencieux et embuscades de fumée.',
    totalHonorReward: 5000,
    soloVariantId: 'canon249_duelliste_feodal_samourai',
    members: [
      { id: 'juta_blind_master', name: 'Maître Juta (Sabreur Aveugle)', role: 'Grand Maître d\'Armes Sacré', weapon: 'Katana Ancestral Muramasa Forgé & Sens Auditif Ultime', hp: 500, armor: 35, trophy: 'Bandeau de Soie Blanche Ensanglanté du Maître Juta' },
      { id: 'kenji_shinobi_shadow', name: 'Kenji (Ombre Shinobi)', role: 'Assassin Invisible des Forêts de Bambous', weapon: 'Lames Jumelles Tanto & Shurikens Empoisonnés', hp: 410, armor: 30, trophy: 'Masque Démoniaque Oni en Bois d\'Ébène Gravé' },
      { id: 'tatsu_ronin_archer', name: 'Tatsu (Archer Ronin)', role: 'Tireur d\'Élite Traditionnel', weapon: 'Grand Arc Yumi & Flèches d\'Airain Perforantes', hp: 430, armor: 35, trophy: 'Corde de Soie et Gant de Tir d\'Archerie Noble' },
      { id: 'sohei_monk_guardian', name: 'Moine Guerrier Sohei', role: 'Gardien Sacré du Temple', weapon: 'Naginata d\'Honneur & Clochettes Soniques de Répulsion', hp: 470, armor: 40, trophy: 'Rosaire Bouddhiste en Bois de Cèdre Millénaire' }
    ]
  },
  {
    id: 'squad_berserker_max_exosuit_team_1995',
    name: 'Escouade de Choc Berserker — Exosquelette MAX (2195)',
    universe: 'ALIEN',
    shortName: 'Commando Berserker MAX (4 Titans)',
    category: 'MILITARY_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens: Berserker (Comics Dark Horse 1995)',
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Épave du Cargo Militaire Nemesis (Berserker 2195)',
    description: 'L\'escouade de choc des Marines Berserker, pilotée par le colosse Ellis dans son exosquelette mécanisé MAX sous cocktail de stimulants de furie.',
    tactics: 'Charges destructrices de blindage au vérin hydraulique, tirs de plasma lourd et tirs de couverture automatique.',
    totalHonorReward: 5400,
    soloVariantId: 'prey_colonial_marine_heavy',
    members: [
      { id: 'ellis_max_exosuit_pilot', name: 'Sergent Ellis (Exosquelette MAX)', role: 'Colosse Bionique Mécanisé', weapon: 'Canon Plasma Lourd MAX & Poings Hydrauliques Broyeurs', hp: 760, armor: 85, trophy: 'Blindage Facial de l\'Exosquelette de Combat MAX' },
      { id: 'lori_berserker_commander', name: 'Commandante Lori', role: 'Tacticienne de Percée Kamikaze', weapon: 'Carabine d\'Assaut Modifiée M41A & Grenades au Phosphore', hp: 490, armor: 50, trophy: 'Insigne Militaire d\'Unité Spéciale Berserker' },
      { id: 'machida_demolitions_gunner', name: 'Canonnier Machida', role: 'Soutien Lourd & Incendiaire', weapon: 'Lance-Flammes Industriel Haute Pression & Armat M41A', hp: 480, armor: 50, trophy: 'Buse de Décharge Calcinée du Lance-Flammes' },
      { id: 'stim_medic_kline', name: 'Dr. Kline (Médecin Neuro-Stim)', role: 'Administrateur de Cocktail de Furie', weapon: 'Injecteur Pneumatique de Stimulants & Pistolet VP-70', hp: 420, armor: 35, trophy: 'Fiole Scellée de Cocktail Neuro-Stimulant Berserker' }
    ]
  },
  {
    id: 'squad_stronghold_ernst_jeri_syndicate',
    name: 'Syndicat Clandestin du Dr. Ernst & Drone Synthétique Jeri (2194)',
    universe: 'ALIEN',
    shortName: 'Forteresse Ernst & Jeri (4 Combattants)',
    category: 'MILITARY_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens: Stronghold (Comics Dark Horse 1994)',
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Biosphère Clandestine du Dr. Ernst (Stronghold 2194)',
    description: 'Le généticien renégat Dr. Lucien Ernst et sa garde de sécurité, accompagnés de Jeri, l\'incroyable drone synthétique xénomorphe armé d\'un fusil.',
    tactics: 'Tirs de barrage de fusil à pompe de combat par Jeri, décharges neurotoxiques et assauts coordonnés de synthétiques d\'assaut.',
    totalHonorReward: 5200,
    soloVariantId: 'prey_weyland_combat_android',
    members: [
      { id: 'jeri_synthetic_xeno', name: 'Jeri (Xénomorphe Synthétique)', role: 'Infiltrateur Bionique Cynique', weapon: 'Fusil à Pompe Calibre 12 Automatique & Électro-Taser', hp: 580, armor: 60, trophy: 'Cigare Fumé en Titane et Unité Vocale de Jeri' },
      { id: 'dr_lucien_ernst', name: 'Dr. Lucien Ernst (Généticien)', role: 'Maître d\'Œuvre des Synthétiques', weapon: 'Injecteur d\'Acide Neutralisant & Pistolet de Sécurité', hp: 430, armor: 35, trophy: 'Journal de Recherche Génétique du Dr. Ernst' },
      { id: 'steele_bionic_commander', name: 'Commandant Bionique Steele', role: 'Chef de la Garde Corporatiste', weapon: 'Fusil d\'Assaut Bullpup 10mm & Lame Vibrante', hp: 500, armor: 50, trophy: 'Prothèse de Bras Cybernétique de Combat de Steele' },
      { id: 'security_synth_alpha', name: 'Synthétique de Sécurité Alpha', role: 'Garde Rapprochée Programmée', weapon: 'Mitraillette Légère à Impulsion & Bouclier Anti-Émeute', hp: 470, armor: 50, trophy: 'Module Logique de Contrôle de Sécurité de Grant Corp' }
    ]
  },
  {
    id: 'squad_ryushi_vault_archaeologists_mercs',
    name: 'Consortium d\'Exploration des Cryptes de Ryushi (2192)',
    universe: 'AVP',
    shortName: 'Archéologues & Mercs Ryushi (4 Explorateurs)',
    category: 'HUMAN_SURVIVORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens vs. Predator: Prey / Sand Trap (Comics Dark Horse 1994)',
    biomeId: 'ryushi_desert',
    recommendedBiomeLabel: 'Cryptes des Sables de Ryushi & Failles Volcaniques',
    description: 'L\'expédition scientifique et mercenaire pénétrant les catacombes Yautja sous les sables de Ryushi, réveillant les ruches endormies et les défenses antiques.',
    tactics: 'Tirs de lasers de découpe sismique, grenades incendiaires dans les boyaux et tirs croisés d\'armes coloniales.',
    totalHonorReward: 5100,
    soloVariantId: 'alien_base_big_beard_voyageur_1719',
    members: [
      { id: 'dr_donald_perkins', name: 'Dr. Donald Perkins (Xéno-Archéologue)', role: 'Chef de l\'Expédition Scientifique', weapon: 'Laser Sismique de Forage & Scanner de Ruines', hp: 420, armor: 35, trophy: 'Stèle Holographique Traduite des Cryptes de Ryushi' },
      { id: 'capt_oneill_mercenary', name: 'Capitaine O\'Neill (Mercenaire)', role: 'Commandant de la Sécurité Clandestine', weapon: 'Carabine Lourde M42B & Couteau de Combat en Céramique', hp: 490, armor: 45, trophy: 'Plaque d\'Identification Militaire Burinée d\'O\'Neill' },
      { id: 'kowalski_seismic_driller', name: 'Foreur Sismique Kowalski', role: 'Spécialiste Rupture de Parois', weapon: 'Marteau Pneumatique Sismique & Charges Explosives', hp: 460, armor: 40, trophy: 'Mèche de Foreuse au Diamant Synthétique de Ryushi' },
      { id: 'weyland_android_sentry', name: 'Androïde de Soutien Géologique', role: 'Analyseur de Réseau Souterrain', weapon: 'Torche à Plasma Minier & Électro-Barrière Portative', hp: 480, armor: 50, trophy: 'Circuit d\'Analyse Topographique Androïde Wey-Yu' }
    ]
  },
  {
    id: 'squad_extinction_council_veterans_lv742',
    name: 'Vétérans du Conseil Suprême Yautja de LV-742 (2203)',
    universe: 'AVP',
    shortName: 'Armée du Conseil LV-742 (4 Vétérans)',
    category: 'HONOR_CLAN',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens versus Predator: Extinction (EA / Zono 2003)',
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Caldeira Volcanique de LV-742 (Extinction 2203)',
    description: 'L\'élite punitive dépêchée par le Conseil Suprême de Yautja Prime pour éradiquer les souches de xénomorphes mutants du Dr. Kadinsky sur LV-742.',
    tactics: 'Salves dévastatrices d\'Hydra-Caster à tête chercheuse, lancers de disques multiples soniques et harponnages de foule.',
    totalHonorReward: 6000,
    soloVariantId: 'alien_base_alpha_predator_kaail',
    members: [
      { id: 'council_ancient_war_master', name: 'Maître de Guerre Ancien (Conseil Yautja)', role: 'Seigneur Militaire Suprême', weapon: 'Lanceur Hydra-Caster Multi-Plasmique & Grand Combistick', hp: 800, armor: 85, trophy: 'Sceau d\'Ordonnance Punitive du Conseil des Anciens' },
      { id: 'disc_master_champion', name: 'Disc Master Champion', role: 'Maître du Disque Sonique Téléguidé', weapon: 'Double Lance-Disques Magnétique & Lames de Poignet', hp: 650, armor: 70, trophy: 'Disque Sonique Cérémonial de Maître Champion de LV-742' },
      { id: 'hydra_scout_vanguard', name: 'Éclaireur d\'Assaut Hydra', role: 'Artilleur de Saturation Rapide', weapon: 'Micro-Hydra Caster Portatif & Fusil à Filet Renforcé', hp: 580, armor: 60, trophy: 'Capteur Thermique Multi-Cible de l\'Hydra Scout' },
      { id: 'council_harpooner_elite', name: 'Harponneur d\'Élite du Clan', role: 'Tireur d\'Arrêt Anti-Ravagers', weapon: 'Harponneur Lourd Perforant à Pointe Barbelée', hp: 620, armor: 65, trophy: 'Pointe de Harpon Gravée au Sang de Reine Ravager' }
    ]
  }
,
  {
    id: 'squad_dark_river_amazon_patrol',
    name: 'Patrouille Fluviale de l\'Amazone — Pisteurs & Guérilleros (1996)',
    universe: 'PREDATOR',
    shortName: 'Amazon Patrol (4 Pisteurs)',
    category: 'MERCENARY_SYNDICATE',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Dark River (Dark Horse Comics 1996)',
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Bassin Fluvial de l\'Amazone (Dark River 1996)',
    description: 'Pisteurs d\'élite de la jungle sud-américaine et vétérans de guérilla épaulant John Schaefer dans sa traque fluviale.',
    tactics: 'Embuscades aquatiques, tirs de harcèlement sous la canopée et pièges de pieux en silex camouflés.',
    totalHonorReward: 4800,
    soloVariantId: 'alien_base_royce_mercenaire_2010',
    members: [
      { id: 'dark_river_lead_tracker', name: 'Chef Pisteur Amazonien', role: 'Éclaireur Fluvial', weapon: 'Machete d\'Ébranchage & Carabine Chasse', weaponId: 'weapon_dark_river_machete_flint', vitalityRatio: 1.0, hp: 520, armor: 35, trophy: 'Collier de Dents de Caïman Noir & Silex Fluvial' },
      { id: 'dark_river_trap_specialist', name: 'Artificier des Marécages', role: 'Poseur de Pièges', weapon: 'Pieux en Silex & Fusil Calibre 12', weaponId: 'weapon_dark_river_machete_flint', vitalityRatio: 0.9, hp: 480, armor: 40, trophy: 'Déclencheur de Piège Fluvial en Liane Tressée' },
      { id: 'dark_river_heavy_gunner', name: 'Mitrailleur de Canot Fluvial', role: 'Appui Feu Lourd', weapon: 'Mitrailleuse RPD Modifiée', weaponId: 'npc_wep_minigun_ol_painless', vitalityRatio: 1.1, hp: 560, armor: 50, trophy: 'Bande Munitions Tambour Blindée du Fleuve' },
      { id: 'dark_river_jungle_sniper', name: 'Tireur d\'Élite de la Canopée', role: 'Tireur Embusqué', weapon: 'Fusil de Précision Mauser Tropical', weaponId: 'weapon_dark_river_machete_flint', vitalityRatio: 0.85, hp: 440, armor: 30, trophy: 'Lunette de Visée de Canopée en Laiton Équatoriale' }
    ]
  },
  {
    id: 'squad_whitechapel_constabulary_guard',
    name: 'Garde Constabulaire de Whitechapel — Détachement de Scotland Yard (1896)',
    universe: 'PREDATOR',
    shortName: 'Whitechapel Guard (4 Policiers)',
    category: 'LAW_ENFORCEMENT',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Nemesis (Dark Horse Comics 1997)',
    biomeId: 'los_angeles_1997',
    recommendedBiomeLabel: 'Ruelles de Whitechapel sous la Brume (Nemesis 1896)',
    description: 'Officiers et inspecteurs aguerris de Scotland Yard conduits par Edward Soames pour chasser le Démon de la Brume.',
    tactics: 'Rondes serrées lanterne au poing, tirs de barrage au gros calibre Webley et encerclement méthodique des quais.',
    totalHonorReward: 4600,
    soloVariantId: 'alien_base_mike_harrigan_lapd',
    members: [
      { id: 'whitechapel_chief_inspector', name: 'Inspecteur Edward Soames', role: 'Commandant de la Brigade', weapon: 'Revolver Webley .455 & Sabre d\'Officier', weaponId: 'weapon_nemesis_webley_revolver', vitalityRatio: 1.2, hp: 600, armor: 45, trophy: 'Insigne Émaillé d\'Ordonnance de Scotland Yard 1896' },
      { id: 'whitechapel_sergeant_lantern', name: 'Sergent de Quart à Lanterne', role: 'Éclaireur Nocturne', weapon: 'Lanterne Sourde & Matraque en Palissandre', weaponId: 'weapon_nemesis_webley_revolver', vitalityRatio: 0.95, hp: 500, armor: 40, trophy: 'Lanterne de Brume Londonienne en Cuivre Frappé' },
      { id: 'whitechapel_marksman_constable', name: 'Agent Tireur de Précision', role: 'Tireur d\'Appui Urbain', weapon: 'Fusil Martini-Henry Réglementaire', weaponId: 'weapon_nemesis_webley_revolver', vitalityRatio: 0.9, hp: 480, armor: 35, trophy: 'Cartouchière en Cuir Noirçi de la Tamise' },
      { id: 'whitechapel_riot_enforcer', name: 'Agent de Choc des Docks', role: 'Brise-Foule des Quais', weapon: 'Fusil de Chasse Double Canon & Bouclier de Bois', weaponId: 'weapon_nemesis_webley_revolver', vitalityRatio: 1.1, hp: 550, armor: 50, trophy: 'Sifflet d\'Alarme en Argent des Quais de Londres' }
    ]
  },
  {
    id: 'squad_pala_station_security_detail',
    name: 'Escouade de Sécurité et de Quarantaine de la Station Pala (2021)',
    universe: 'ALIEN',
    shortName: 'Pala Detail (4 Gardes Quarantaine)',
    category: 'MERCENARY_SYNDICATE',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien: Infiltrator (Titan Books 2021)',
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Laboratoires Souterrains de Pala (Infiltrator 2021)',
    description: 'Garde prétorienne corporatiste Weyland-Yutani affectée au confinement des sujets mutants du pathogène noir sur Pala.',
    tactics: 'Injections de fléchettes sédatives longue portée, dispersion de neurotoxines et verrouillage de coursives pressurisées.',
    totalHonorReward: 5000,
    soloVariantId: 'prey_weyland_combat_android',
    members: [
      { id: 'pala_containment_captain', name: 'Capitaine de Quarantaine Weyland', role: 'Officier de Confinement', weapon: 'Carabine à Fléchettes Sédatives & Taser Lourd', weaponId: 'weapon_pala_tranq_dart_rifle', vitalityRatio: 1.1, hp: 580, armor: 60, trophy: 'Passe de Sécurité Alpha Sous-Sol 4 Weyland-Yutani' },
      { id: 'pala_biochem_operator', name: 'Opérateur Bio-Chimique de Pala', role: 'Contrôleur de Pathogène', weapon: 'Lanceur d\'Aérosol Neuro-Inhibiteur', weaponId: 'weapon_pala_tranq_dart_rifle', vitalityRatio: 0.9, hp: 490, armor: 50, trophy: 'Fiole Scellée de Mutagène Noir Dérivé Z-01' },
      { id: 'pala_synthetic_warden', name: 'Gardien Synthétique Modèle W-7', role: 'Sentinelle Bionique', weapon: 'Fusil Hypodermique Automatique & Pistolet Électrique', weaponId: 'weapon_pala_tranq_dart_rifle', vitalityRatio: 1.25, hp: 650, armor: 70, trophy: 'Noyau Mémoire Synthétique Décontaminé de Pala' },
      { id: 'pala_tactical_specialist', name: 'Spécialiste Confinement Lourd', role: 'Neutralisateur de Mutants', weapon: 'Carabine à Fléchettes Sédatives & Fusil à Impulsion', weaponId: 'weapon_pala_tranq_dart_rifle', vitalityRatio: 1.0, hp: 530, armor: 55, trophy: 'Casque Pressurisé Anti-Spore de la Station Pala' }
    ]
  },
  {
    id: 'squad_hadleys_hope_colonial_militia',
    name: 'Milice Coloniale et Survivants de Hadley\'s Hope (2014)',
    universe: 'ALIEN',
    shortName: 'Hadley Militia (4 Colons & Marines)',
    category: 'CIVILIAN_SURVIVORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien: River of Pain (Titan Books 2014)',
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Périmètre Fortifié de Hadley\'s Hope (River of Pain 2014)',
    description: 'Dernier carré de colons armés et de marines de garnison luttant désespérément contre l\'infestation sur Acheron LV-426.',
    tactics: 'Tirs de barrage depuis les barricades de caisses, emploi de chalumeaux industriels et de fusils à impulsion Armat.',
    totalHonorReward: 5200,
    soloVariantId: 'alien_base_william_hudson_private',
    members: [
      { id: 'hadley_captain_brackett', name: 'Capitaine Demian Brackett', role: 'Commandant des Opérations Coloniales', weapon: 'Armat M41A Pulse Rifle & Grenades HE', weaponId: 'npc_wep_m41a_pulse_rifle', vitalityRatio: 1.2, hp: 620, armor: 65, trophy: 'Plaque d\'Identité Militaire du Capitaine Brackett' },
      { id: 'hadley_mining_engineer', name: 'Ingénieur d\'Extraction Minier', role: 'Spécialiste Forage', weapon: 'Découpeur Plasma Industriel Portatif', weaponId: 'npc_wep_m41a_pulse_rifle', vitalityRatio: 0.95, hp: 510, armor: 45, trophy: 'Visière Thermique de Foreur d\'Acheron LV-426' },
      { id: 'hadley_militia_rifleman', name: 'Colon Fusilier Volontaire', role: 'Défenseur de Barricade', weapon: 'Fusil d\'Assaut M4A3 & Pistolet 9mm', weaponId: 'npc_wep_m41a_pulse_rifle', vitalityRatio: 0.9, hp: 470, armor: 40, trophy: 'Badge de Citoyen de la Colonie Freeland Hadley' },
      { id: 'hadley_heavy_support', name: 'Canonnier de Garnison USCM', role: 'Artilleur Mobile', weapon: 'Smartgun M56 & Harnais de Stabilisation', weaponId: 'npc_wep_m56_smartgun', vitalityRatio: 1.15, hp: 590, armor: 60, trophy: 'Harnais de Visée Connecté du Smartgunner de Hadley' }
    ]
  },
  {
    id: 'squad_ataegina_spear_phalanx',
    name: 'Phalange des Guerriers d\'Obsidienne d\'Ataegina (2020)',
    universe: 'ALIEN',
    shortName: 'Lemnos Phalanx (4 Lanciers Féodaux)',
    category: 'TRIBAL_WAR_PARTY',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien: Phalanx (Titan Books 2020)',
    biomeId: 'bouvetoya_pyramid',
    recommendedBiomeLabel: 'Ruines de la Citadelle d\'Ataegina (Phalanx 2020)',
    description: 'Légion d\'élite spartiate de l\'île de Lemnos maniant lances d\'obsidienne et cuirasse de bête contre les démons Ahklun.',
    tactics: 'Formation de phalange impénétrable, estocs d\'obsidienne insensibles à l\'acide et projections de poix enflammée.',
    totalHonorReward: 5400,
    soloVariantId: 'alien_base_royce_mercenaire_2010',
    members: [
      { id: 'ataegina_polemarch', name: 'Polémarque de Lemnos', role: 'Maître de la Phalange', weapon: 'Grande Lance d\'Obsidienne & Pavois de Cuir Bouilli', weaponId: 'weapon_phalanx_obsidian_spear', vitalityRatio: 1.25, hp: 650, armor: 60, trophy: 'Heaume Cérémonial d\'Airain Incrusté d\'Obsidienne' },
      { id: 'ataegina_shield_bearer', name: 'Porteur de Bouclier d\'Airain', role: 'Défenseur de Ligne', weapon: 'Lance d\'Obsidienne Courte & Bouclier Rond Renforcé', weaponId: 'weapon_phalanx_obsidian_spear', vitalityRatio: 1.1, hp: 580, armor: 65, trophy: 'Bouclier Spartiate Trempé au Sang de Démon Ahklun' },
      { id: 'ataegina_pitch_hurler', name: 'Lanceur de Poix Enflammée', role: 'Artilleur Incendiaire', weapon: 'Javelots d\'Obsidienne & Jarres de Poix Goudronnée', weaponId: 'weapon_phalanx_obsidian_spear', vitalityRatio: 0.9, hp: 480, armor: 40, trophy: 'Jarre de Poix Volcanique Pyrogène d\'Ataegina' },
      { id: 'ataegina_vanguard_spearman', name: 'Lancier d\'Assaut de Crête', role: 'Chasseur de Monstre', weapon: 'Pique d\'Obsidienne Barbelée à Double Tranchant', weaponId: 'weapon_phalanx_obsidian_spear', vitalityRatio: 1.0, hp: 520, armor: 50, trophy: 'Collier de Pointes d\'Obsidienne Taillées à la Main' }
    ]
  },
  {
    id: 'squad_iron_bear_uscm_battalion',
    name: 'Bataillon de Choc des Iron Bears — Mercenaires USCM (LV-742)',
    universe: 'AVP',
    shortName: 'Iron Bears (4 Vétérans Lourds)',
    category: 'COLONIAL_MARINES',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens versus Predator: Extinction (EA / Zono 2003)',
    biomeId: 'ryushi_desert',
    recommendedBiomeLabel: 'Redoute des Mercenaires Iron Bears (Extinction 2003)',
    description: 'Compagnie mercenaire de vétérans coloniaux réputée pour sa puissance de feu phénoménale et ses canons de siège gauss.',
    tactics: 'Pilonnage d\'artillerie électromagnétique, tirs d\'uranium perforant à longue portée et couverture anti-blindage.',
    totalHonorReward: 5800,
    soloVariantId: 'prey_colonial_marine_heavy',
    members: [
      { id: 'iron_bear_heavy_gunner', name: 'Canonnier Gauss des Iron Bears', role: 'Artilleur Lourd Électromagnétique', weapon: 'Canon Gauss Lourd Antimatière & Exosquelette', weaponId: 'weapon_extinction_iron_bear_gauss', vitalityRatio: 1.3, hp: 680, armor: 75, trophy: 'Bobine Magnétique Haute Énergie de Canon Gauss' },
      { id: 'iron_bear_commando_sergeant', name: 'Sergent Vétéran des Iron Bears', role: 'Chef de Section Tactique', weapon: 'Carabine Magnétique Légère & Lance-Grenades', weaponId: 'weapon_extinction_iron_bear_gauss', vitalityRatio: 1.1, hp: 580, armor: 65, trophy: 'Écusson Brodé de l\'Ours de Fer en Titane Trempé' },
      { id: 'iron_bear_combat_medic', name: 'Médecin de Combat Blindé', role: 'Soutien Vital de Bataillon', weapon: 'Fusil à Pompe Automatique & Injecteur de Stim', weaponId: 'npc_wep_m41a_pulse_rifle', vitalityRatio: 0.95, hp: 520, armor: 55, trophy: 'Trousse Médicale Pressurisée de Bataillon d\'Assaut' },
      { id: 'iron_bear_sniper_spotter', name: 'Tireur Électrostatique Perforant', role: 'Éclaireur d\'Interdiction', weapon: 'Fusil Sniper Gauss 20mm Hyper-Véloce', weaponId: 'weapon_extinction_iron_bear_gauss', vitalityRatio: 0.9, hp: 490, armor: 45, trophy: 'Module Télémétrique de Sniper Gauss des Iron Bears' }
    ]
  },
  {
    id: 'squad_kseries_cloned_xeno_pack',
    name: 'Meute Clonée des Xénomorphes K-Series du Dr. Kadinsky (2203)',
    universe: 'AVP',
    shortName: 'K-Series Pack (4 Xénos Mutants)',
    category: 'XENO_INFESTATION',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens versus Predator: Extinction (EA / Zono 2003)',
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Caldeira Volcanique de LV-742 (Extinction 2203)',
    description: 'Sous-espèce mutante de xénomorphes à carapace jaune créée par manipulation génétique illégale sur LV-742.',
    tactics: 'Jets d\'acide volatil sous haute pression, charges furieuses et résistance accrue aux neurotoxines et aux décharges plasma.',
    totalHonorReward: 5600,
    soloVariantId: 'prey_xeno_warrior',
    members: [
      { id: 'kseries_alpha_spitter', name: 'Spitter Alpha Mutant K-Series', role: 'Artilleur Acide Caustique', weapon: 'Dards Caudaux & Jets d\'Acide Volatil Sous Pression', weaponId: 'weapon_kseries_acid_tail_spurt', vitalityRatio: 1.25, hp: 640, armor: 65, trophy: 'Glande Gastrique d\'Acide Hyper-Concentré K-Series' },
      { id: 'kseries_ravager_strain', name: 'Drone Ravager Génétique', role: 'Trancheur de Mêlée Féroce', weapon: 'Lames de Faux Chitineuses & Mâchoire Pharyngienne', weaponId: 'weapon_kseries_acid_tail_spurt', vitalityRatio: 1.15, hp: 600, armor: 70, trophy: 'Faux Chitineuse Dorsale de Ravager Génétique' },
      { id: 'kseries_flank_stalker', name: 'Rôdeur Embusqué K-Series', role: 'Traqueur Furtif des Gorges', weapon: 'Griffes Préhensiles & Fouet Caudal Épineux', weaponId: 'weapon_kseries_acid_tail_spurt', vitalityRatio: 0.9, hp: 500, armor: 50, trophy: 'Crâne Jaunâtre à Nervures Translucides K-Series' },
      { id: 'kseries_carrier_drone', name: 'Porteur de Nids K-Series', role: 'Vecteur d\'Infestation Rapide', weapon: 'Glandes de Projection Caudale & Mâchoire Acide', weaponId: 'weapon_kseries_acid_tail_spurt', vitalityRatio: 1.05, hp: 550, armor: 55, trophy: 'Sac Ovipositeur Génétiquement Altéré par Kadinsky' }
    ]
  },
  {
    id: 'squad_machiko_ryushi_retinue',
    name: 'Suite Martiale de Machiko Noguchi sur Ryushi & Bunda (1995)',
    universe: 'AVP',
    shortName: 'Machiko Retinue (4 Chasseurs d\'Honneur)',
    category: 'HONOR_CLAN',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens vs. Predator: War (Dark Horse Comics 1995)',
    biomeId: 'ryushi_desert',
    recommendedBiomeLabel: 'Désert de Silicate de Ryushi (AVP: War 1995)',
    description: 'Cercle de compagnons d\'honneur Yautja et combattants d\'élite respectant la marque de clan gravée sur Machiko par Dachande.',
    tactics: 'Duels au Naginata, projections de shurikens cérémoniaux et attaques combinées coordonnées sous camouflage optique.',
    totalHonorReward: 6200,
    soloVariantId: 'prey_young_blood_initiate',
    members: [
      { id: 'machiko_da_ishii_warrior', name: 'Machiko Noguchi (Da\'dtou-di)', role: 'Chasseresse Trans-Espèce Marquée', weapon: 'Naginata Yautja Cérémonial & Masque Optique de Dachande', weaponId: 'npc_wep_yautja_naginata_plasma', vitalityRatio: 1.3, hp: 700, armor: 70, trophy: 'Marque de Clan Gravée au Sang de Reine sur le Front' },
      { id: 'top_knot_veteran_hunter', name: 'Vétéran du Clan de Top-Knot', role: 'Garde d\'Honneur Yautja', weapon: 'Combistick Télescopique & Plasmacaster d\'Épaule', weaponId: 'npc_wep_yautja_naginata_plasma', vitalityRatio: 1.2, hp: 650, armor: 75, trophy: 'Tresse Cérémoniale d\'Ancien du Clan de Top-Knot' },
      { id: 'ryushi_blooded_young_blood', name: 'Jeune Sang Sanglant de Ryushi', role: 'Assaillant Agile', weapon: 'Doubles Lames de Poignet & Smart Disc', weaponId: 'npc_wep_yautja_naginata_plasma', vitalityRatio: 1.0, hp: 560, armor: 60, trophy: 'Disque Intelligent Gravé du Sceau de Ryushi' },
      { id: 'bunda_rebel_tactician', name: 'Éclaireur Dissident de Bunda', role: 'Pisteur Embusqué', weapon: 'Fusil Harponneur & Filet de Câbles Invisibles', weaponId: 'npc_wep_yautja_naginata_plasma', vitalityRatio: 0.95, hp: 530, armor: 55, trophy: 'Gantelet Informatique reprogrammé pour la Rébellion' }
    ]
  },
  {
    id: 'squad_pred_captive_preserve_guards',
    name: 'Brigade de Confinement du Biodôme de Tyler Stern (1998)',
    universe: 'PREDATOR',
    shortName: 'Gardes Biodôme Stern (4 Agents)',
    category: 'MERCENARY_SYNDICATE',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Captive (Dark Horse Comics 1998)',
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Réserve Biodôme Artificielle de Tyler Stern (Captive 1998)',
    primaryMapId: 'map_pred_stern_biodome_preserve',
    weaponLoadout: ['wpn_stern_biodome_tranq_lance', 'npc_wep_owlf_cryo_blaster'],
    description: 'Unité de sécurité privée surentraînée du milliardaire Tyler Stern chargée de maintenir le chasseur Yautja captif sous le dôme tropical.',
    tactics: 'Encerclement méthodique avec lances électro-tranquillisantes, saturation de gaz sédatif et verrouillage des passerelles d\'observation.',
    totalHonorReward: 4900,
    soloVariantId: 'alien_base_royce_mercenaire_2010',
    members: [
      { id: 'stern_chief_warden', name: 'Commandant de Confinement Vance', role: 'Chef de la Sécurité du Biodôme', weapon: 'Lance Électro-Tranquillisante Haute Tension & Taser', weaponId: 'wpn_stern_biodome_tranq_lance', vitalityRatio: 1.2, hp: 600, armor: 60, trophy: 'Badge Biométrique de Niveau Oméga du Biodôme Stern' },
      { id: 'stern_sedation_lancer', name: 'Chasseur-Anesthésiste Kael', role: 'Spécialiste Capture Vivante', weapon: 'Lance Pneumatique à Étorphine & Filet Lesté', weaponId: 'wpn_stern_biodome_tranq_lance', vitalityRatio: 1.0, hp: 520, armor: 50, trophy: 'Cylindre Pressurisé d\'Étorphine Synthétique Stern' },
      { id: 'stern_dome_spotter', name: 'Opérateur Optique de Passerelle', role: 'Coordinateur des Capteurs Thermiques', weapon: 'Carabine à Fléchettes Sédatives & Scanner Laser', weaponId: 'wpn_stern_biodome_tranq_lance', vitalityRatio: 0.9, hp: 470, armor: 40, trophy: 'Casque Télémétrique de Surveillance du Dôme' },
      { id: 'stern_heavy_containment', name: 'Garde Blindé de Quarantaine', role: 'Bloqueur de Sas en Exosquelette Léger', weapon: 'Bouclier Électro-Magnétique & Lance Haute Tension', weaponId: 'wpn_stern_biodome_tranq_lance', vitalityRatio: 1.15, hp: 580, armor: 65, trophy: 'Plaque Thoracique Isolante Brûlée au Plasma' }
    ]
  },
  {
    id: 'squad_pred_yellowstone_rangers',
    name: 'Patrouille des Rangers & Pisteurs de Yellowstone (1999)',
    universe: 'PREDATOR',
    shortName: 'Rangers Yellowstone (4 Pisteurs)',
    category: 'LAW_ENFORCEMENT',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Homeworld (Dark Horse Comics 1999)',
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Bassin des Geysers de Yellowstone (Homeworld 1999)',
    primaryMapId: 'map_pred_yellowstone_geysers_1999',
    weaponLoadout: ['wpn_yellowstone_ranger_45_70_lever'],
    description: 'Vétérans du Service des Parcs Nationaux et guides de haute montagne pris au piège de l\'affrontement entre les trois Bad Bloods et le Yautja Ancien.',
    tactics: 'Tirs d\'arrêt précis à la carabine .45-70 à travers le brouillard soufré, repli coordonné sur les crêtes rocheuses et fusées éclairantes.',
    totalHonorReward: 4700,
    soloVariantId: 'alien_base_dutch_2025_owlf',
    members: [
      { id: 'yellowstone_senior_ranger', name: 'Ranger Principal Cole', role: 'Vétéran de la Garde Forestière', weapon: 'Carabine à Levier .45-70 Government & Revolver .357', weaponId: 'wpn_yellowstone_ranger_45_70_lever', vitalityRatio: 1.15, hp: 570, armor: 45, trophy: 'Étoile de Bronze du Service des Parcs de Yellowstone' },
      { id: 'yellowstone_geothermal_guide', name: 'Pisteur des Geysers Bridger', role: 'Éclaireur des Bassins Soufrés', weapon: 'Carabine .45-70 & Jumelles Thermiques de Secours', weaponId: 'wpn_yellowstone_ranger_45_70_lever', vitalityRatio: 1.0, hp: 510, armor: 40, trophy: 'Boussole Géologique Corrodée par le Soufre' },
      { id: 'yellowstone_field_chronicler', name: 'Maya Bergstrom (Enquêtrice)', role: 'Observatrice & Tireuse de Survie', weapon: 'Fusil de Chasse Calibre 12 & Caméra Haute Vitesse', weaponId: 'wpn_yellowstone_ranger_45_70_lever', vitalityRatio: 0.85, hp: 450, armor: 30, trophy: 'Pellicule Photographique du Chasseur Ancien' },
      { id: 'yellowstone_ridge_marksman', name: 'Garde-Chasse des Rocheuses', role: 'Tireur d\'Appui Longue Portée', weapon: 'Carabine Lourde .45-70 à Lunette & Piolet', weaponId: 'wpn_yellowstone_ranger_45_70_lever', vitalityRatio: 1.05, hp: 530, armor: 40, trophy: 'Cartouchière en Cuir de Bison de Yellowstone' }
    ]
  },
  {
    id: 'squad_alien_charon_rogue_marines',
    name: 'Garnison Coloniale de Charon & Sécurité du Complexe Rogue (1993)',
    universe: 'ALIEN',
    shortName: 'Marines de Charon (4 Soldats)',
    category: 'COLONIAL_MARINES',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens: Rogue (Dark Horse Comics 1993)',
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Citadelle Biologique de Charon (Aliens: Rogue 1993)',
    primaryMapId: 'map_alien_charon_kleist_citadel',
    weaponLoadout: ['wpn_kleist_charon_shock_baton', 'npc_wep_m41a_pulse_rifle'],
    description: 'Détachement militaire et gardes de contention de l\'astéroïde Charon tentant de survivre à la fuite du King Alien du professeur Ernst Kleist.',
    tactics: 'Barrages d\'aiguillons neuro-électriques en couloir, tirs de fusils à impulsion M41A et activation des sas blindés.',
    totalHonorReward: 5100,
    soloVariantId: 'alien_base_william_hudson_private',
    members: [
      { id: 'charon_captain_kramer', name: 'Capitaine Kramer (Garnison Charon)', role: 'Commandant Militaire de l\'Astéroïde', weapon: 'Armat M41A Pulse Rifle & Matraque Neuro-Choc', weaponId: 'wpn_kleist_charon_shock_baton', vitalityRatio: 1.2, hp: 610, armor: 65, trophy: 'Insigne de Commandement de la Citadelle Charon' },
      { id: 'charon_containment_corporal', name: 'Caporal de Contention Vane', role: 'Maître des Sas de la Fosse Royale', weapon: 'Matraque Neuro-Choc 150 kV & Bouclier Anti-Acide', weaponId: 'wpn_kleist_charon_shock_baton', vitalityRatio: 1.1, hp: 560, armor: 60, trophy: 'Gantelet Isolant Griffé par le King Alien' },
      { id: 'charon_bio_sentry', name: 'Spécialiste Bio-Sécurité Sterling', role: 'Opérateur des Barrières Électriques', weapon: 'Aiguillon de Contention & Fusil à Pompe M37', weaponId: 'wpn_kleist_charon_shock_baton', vitalityRatio: 0.95, hp: 500, armor: 50, trophy: 'Clé Magnétique des Cuves d\'Incubation Rogue' },
      { id: 'charon_heavy_trooper', name: 'Artilleur de Couloir Miller', role: 'Soutien Incendiaire & Choc', weapon: 'Lance-Flammes M240 & Matraque Neuro-Choc', weaponId: 'wpn_kleist_charon_shock_baton', vitalityRatio: 1.05, hp: 540, armor: 55, trophy: 'Casque USCM Fendu des Souterrains de Charon' }
    ]
  },
  {
    id: 'squad_alien_harvest_cyber_ants',
    name: 'Essaim Cyber-Moissonneur de Mayakovsky & Synthétique Norbert (1992)',
    universe: 'ALIEN',
    shortName: 'Cyber-Fourmis & Norbert (4 Unités)',
    category: 'SYNTHETIC_PACK',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens: Hive (Dark Horse Comics 1992)',
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Cavernes Bioluminescentes de Bellerophon (Echo 2019)',
    primaryMapId: 'map_alien_bellerophon_caves',
    weaponLoadout: ['wpn_mayakovsky_cyber_ant_laser'],
    description: 'Unité robotique d\'infiltration de ruche conçue par Stanislaw Mayakovsky, dirigée par l\'androïde xéno-mimétique Norbert et ses cyber-fourmis laser.',
    tactics: 'Focalisation synchronisée de micro-lasers de découpe, camouflage phéromonal synthétique et encerclement rapide dans les boyaux de résine.',
    totalHonorReward: 5300,
    soloVariantId: 'prey_weyland_combat_android',
    members: [
      { id: 'norbert_xeno_synth', name: 'Norbert (Synthétique Xéno-Mimétique)', role: 'Unité d\'Infiltration Biomimétique', weapon: 'Micro-Laser Chirurgical & Griffes en Titane Noir', weaponId: 'wpn_mayakovsky_cyber_ant_laser', vitalityRatio: 1.25, hp: 640, armor: 70, trophy: 'Crâne Cyber-Xénomorphe Articulé de Norbert' },
      { id: 'mayakovsky_harvester_prime', name: 'Cyber-Fourmi Moissonneuse Alpha', role: 'Drone d\'Extraction de Gelée Royale', weapon: 'Double Émetteur Laser 450nm & Mandibules d\'Acier', weaponId: 'wpn_mayakovsky_cyber_ant_laser', vitalityRatio: 1.05, hp: 540, armor: 65, trophy: 'Fiole en Quartz de Gelée Royale Pure Moissonnée' },
      { id: 'mayakovsky_cutter_drone', name: 'Unité de Découpe Thermique Bêta', role: 'Foreur de Résine Xénomorphe', weapon: 'Faisceau Laser Continu de Découpe & Scie Circulaire', weaponId: 'wpn_mayakovsky_cyber_ant_laser', vitalityRatio: 0.95, hp: 500, armor: 60, trophy: 'Lentille de Focalisation Laser de Mayakovsky' },
      { id: 'mayakovsky_relay_guard', name: 'Sentinelle Relais Synaptique', role: 'Coordinateur du Réseau de Moisson', weapon: 'Tourelle Micro-Laser Dorsal & Impulsion IEM', weaponId: 'wpn_mayakovsky_cyber_ant_laser', vitalityRatio: 1.0, hp: 520, armor: 60, trophy: 'Antenne de Commande Cybernétique de Stanislaw' }
    ]
  },
  {
    id: 'squad_avp_eternal_tokyo_mercs',
    name: 'Garde Prétorienne à Plasma Rétro-Conçu de Gideon Lee — Tokyo (1998)',
    universe: 'AVP',
    shortName: 'Mercenaires Eternal Tokyo (4 Gardes)',
    category: 'MERCENARY_SYNDICATE',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens vs. Predator: Eternal (Dark Horse Comics 1998)',
    biomeId: 'los_angeles_1997',
    recommendedBiomeLabel: 'Gratte-Ciel de Gideon Lee à Tokyo (AVP: Eternal 1998)',
    primaryMapId: 'map_avp_tokyo_eternal_penthouse',
    weaponLoadout: ['wpn_gideon_lee_reverse_plasma_rifle'],
    description: 'Escouade d\'élite protégeant le penthouse de Tokyo de l\'immortel Gideon Lee, armée de fusils à plasma humains rétro-conçus sur l\'épave Yautja de 1300.',
    tactics: 'Tirs croisés de plasma surchargé depuis les passerelles de verre, verrouillage laser de l\'atrium et contre-attaques au katana thermique.',
    totalHonorReward: 5500,
    soloVariantId: 'prey_weyland_combat_android',
    members: [
      { id: 'tokyo_praetorian_leader', name: 'Capitaine Takashi (Garde Prétorienne)', role: 'Commandant de l\'Escorte de Gideon Lee', weapon: 'Fusil à Plasma Rétro-Conçu Type-1300 & Wakizashi', weaponId: 'wpn_gideon_lee_reverse_plasma_rifle', vitalityRatio: 1.25, hp: 640, armor: 70, trophy: 'Cellule d\'Énergie Yautja Piratée du Capitaine Takashi' },
      { id: 'tokyo_plasma_heavy', name: 'Artilleur Plasma Kurosawa', role: 'Spécialiste Saturation Énergétique', weapon: 'Canon à Plasma Lourd Rétro-Conçu & Exo-Harnais', weaponId: 'wpn_gideon_lee_reverse_plasma_rifle', vitalityRatio: 1.15, hp: 600, armor: 65, trophy: 'Condensateur Magnétique Instable de Tokyo 1998' },
      { id: 'tokyo_vault_sentinel', name: 'Sentinelle de la Soute de 1300', role: 'Gardien de l\'Épave Engloutie', weapon: 'Carabine Plasma Type-1300 & Grenades Aveuglantes', weaponId: 'wpn_gideon_lee_reverse_plasma_rifle', vitalityRatio: 1.0, hp: 530, armor: 55, trophy: 'Masque Tactique Nocturne du Penthouse de Gideon Lee' },
      { id: 'tokyo_cyber_recon', name: 'Exécuteur Urbain Shinoda', role: 'Tireur d\'Élite d\'Héliport', weapon: 'Fusil de Précision à Plasma Rétro-Conçu', weaponId: 'wpn_gideon_lee_reverse_plasma_rifle', vitalityRatio: 0.95, hp: 500, armor: 50, trophy: 'Viseur Optique Multi-Spectre de la Tour Lee' }
    ]
  },
  {
    id: 'squad_avp_perses_fire_stone_crew',
    name: 'Équipage de Sécurité du Vaisseau Perses & Mercenaires de Galgo (2014)',
    universe: 'AVP',
    shortName: 'Sécurité du Perses (4 Survivants)',
    category: 'HUMAN_SURVIVORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens vs. Predator: Fire and Stone (Dark Horse Comics 2014)',
    biomeId: 'genna_deathworld',
    recommendedBiomeLabel: 'Coque Mutée du Vaisseau Perses (Fire and Stone 2014)',
    primaryMapId: 'map_avp_perses_fire_stone_hull',
    weaponLoadout: ['wpn_perses_security_flechette_smg'],
    description: 'Le détachement de sécurité et les survivants armés du vaisseau Perses pris en étau entre la horde xénomorphe d\'Elden et la chasse impitoyable d\'Ahab.',
    tactics: 'Rafales de pistolets-mitrailleurs à fléchettes dans les coursives, scellement de cloisons pressurisées et pièges de décompression.',
    totalHonorReward: 5400,
    soloVariantId: 'prey_ahab_elder_persée',
    members: [
      { id: 'perses_chief_sec_miller', name: 'Chef de Sécurité Vance du Perses', role: 'Officier de Défense du Bord', weapon: 'SMG à Fléchettes Perforantes & Fusil à Pompe', weaponId: 'wpn_perses_security_flechette_smg', vitalityRatio: 1.2, hp: 610, armor: 60, trophy: 'Enregistreur Tactique Corrompu du Vaisseau Perses' },
      { id: 'perses_merc_enforcer', name: 'Franc-Tireur de Galgo', role: 'Mercenaire d\'Escorte Orbitale', weapon: 'Double SMG à Fléchettes 5.7mm & Charges C4', weaponId: 'wpn_perses_security_flechette_smg', vitalityRatio: 1.1, hp: 570, armor: 55, trophy: 'Chargeur Tambour de Fléchettes en Carbure' },
      { id: 'perses_hull_engineer', name: 'Ingénieur de Coque Pressurisée', role: 'Spécialiste Gravité & Sas', weapon: 'SMG à Fléchettes & Découpeur Plasma Orbital', weaponId: 'wpn_perses_security_flechette_smg', vitalityRatio: 0.95, hp: 510, armor: 50, trophy: 'Clé de Déverrouillage des Nacelles du Perses' },
      { id: 'perses_medbay_guard', name: 'Garde du Bloc Biologique LV-223', role: 'Sentinelle Anti-Mutagène', weapon: 'Carabine à Fléchettes & Injecteur Décontaminant', weaponId: 'wpn_perses_security_flechette_smg', vitalityRatio: 1.0, hp: 530, armor: 50, trophy: 'Échantillon Scellé de Biomasse Noire du Perses' }
    ]
  },
  {
    id: 'squad_pred_nakai_corpse_creek_scouts',
    name: 'Éclaireurs & Soldats Navajos de Corpse Creek (1991)',
    universe: 'PREDATOR',
    shortName: 'Éclaireurs de Corpse Creek (4 Chasseurs)',
    category: 'HUMAN_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Big Game (Dark Horse Comics 1991)',
    biomeId: 'desert',
    recommendedBiomeLabel: 'Désert de Corpse Creek (Big Game 1991)',
    primaryMapId: 'map_pred_corpse_creek_desert',
    weaponLoadout: ['wpn_nakai_desert_hunting_rifle'],
    description: 'La patrouille de pisteurs amérindiens et soldats d\'élite de Corpse Creek menée par le caporal Enoch Nakai dans les canyons arides du Nouveau-Mexique.',
    tactics: 'Tirs de précision au fusil à verrou depuis les promontoires rocheux, embuscades en goulot d\'étranglement et pistage thermique.',
    totalHonorReward: 5200,
    soloVariantId: 'alien_base_billy_sole_tracker',
    members: [
      { id: 'nakai_scout_enoch', name: 'Caporal Enoch Nakai', role: 'Pisteur Navajo Vétéran', weapon: 'Carabine Lourde .30-06 & Couteau de Survie', weaponId: 'wpn_nakai_desert_hunting_rifle', vitalityRatio: 1.25, hp: 620, armor: 45, trophy: 'Amulette Traditionnelle Navajo & Douille Gravée' },
      { id: 'nakai_scout_spotter', name: 'Observateur Militaire Cole', role: 'Guetteur Longue Portée', weapon: 'Carabine à Verrou & Jumelles Télémétriques', weaponId: 'wpn_nakai_desert_hunting_rifle', vitalityRatio: 1.05, hp: 540, armor: 40, trophy: 'Télémètre Laser Militaire de Corpse Creek' },
      { id: 'nakai_scout_flanker', name: 'Voltigeur Miller', role: 'Tireur Flanc Rapide', weapon: 'Carabine Lourde & Grenades Fumigènes', weaponId: 'wpn_nakai_desert_hunting_rifle', vitalityRatio: 1.0, hp: 520, armor: 40, trophy: 'Insigne de la Base Radar du Nouveau-Mexique' },
      { id: 'nakai_scout_trapper', name: 'Pisteur Adjoint Yazzie', role: 'Poseur de Pièges de Canyon', weapon: 'Carabine .30-06 & Câbles de Piégeage', weaponId: 'wpn_nakai_desert_hunting_rifle', vitalityRatio: 1.1, hp: 550, armor: 40, trophy: 'Pied-de-Biche & Étriers de Piégeage en Acier' }
    ]
  },
  {
    id: 'squad_pred_adolini_guinea_pirates',
    name: 'Flibustiers & Maîtres Canonniers du Capitaine Adolini (1718)',
    universe: 'PREDATOR',
    shortName: 'Corsaires d\'Adolini (4 Flibustiers)',
    category: 'MERCENARY_PIRATES',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: 1718 (Dark Horse Comics 1996)',
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Côte de Guinée (Predator: 1718)',
    primaryMapId: 'map_pred_guinea_coast_1718',
    weaponLoadout: ['wpn_adolini_flintlock_1715'],
    description: 'L\'état-major corsaire et les canonniers fidèles au capitaine Raphael Adolini défendant leur butin et leur honneur sur les plages guinéennes.',
    tactics: 'Salves de mousquets et pistolets à silex à bout portant, charges furieuses au sabre d\'abordage et feux de couverture à la poudre noire.',
    totalHonorReward: 5300,
    soloVariantId: 'alien_base_big_beard_voyageur_1719',
    members: [
      { id: 'adolini_captain_raphael', name: 'Capitaine Raphael Adolini', role: 'Maître Corsaire & Gentilhomme Épéiste', weapon: 'Pistolet à Silex 1715 & Rapière d\'Acier', weaponId: 'wpn_adolini_flintlock_1715', vitalityRatio: 1.25, hp: 630, armor: 40, trophy: 'Gousset en Or & Croix Corsaire d\'Adolini' },
      { id: 'adolini_first_mate', name: 'Maître d\'Équipage Bartolomeo', role: 'Chef des Canonniers', weapon: 'Double Pistolet à Silex & Coutelas d\'Abordage', weaponId: 'wpn_adolini_flintlock_1715', vitalityRatio: 1.15, hp: 580, armor: 35, trophy: 'Poire à Poudre Noire Gravée d\'un Crâne' },
      { id: 'adolini_corsair_gunner', name: 'Canonnier O\'Malley', role: 'Artilleur de Bord', weapon: 'Mousquet à Silex & Hachette de Bord', weaponId: 'wpn_adolini_flintlock_1715', vitalityRatio: 1.0, hp: 530, armor: 30, trophy: 'Mèche Lente & Balle de Mousquet Calibre .60' },
      { id: 'adolini_corsair_bosun', name: 'Gabier Santos', role: 'Sentinelle de Mâture', weapon: 'Pistolet d\'Arçon & Dague d\'Abordage', weaponId: 'wpn_adolini_flintlock_1715', vitalityRatio: 0.95, hp: 510, armor: 30, trophy: 'Longue-Vue en Cuivre Martelé de 1718' }
    ]
  },
  {
    id: 'squad_alien_renaissance_salvagers',
    name: 'Équipe d\'Incursion de Jackson\'s Star sur Renaissance (2024)',
    universe: 'ALIEN',
    shortName: 'Pilleurs de Romulus (4 Colons)',
    category: 'HUMAN_SURVIVORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien: Romulus (20th Century Studios 2024)',
    biomeId: 'space_hulk',
    recommendedBiomeLabel: 'Station Renaissance (Romulus 2024)',
    primaryMapId: 'map_alien_renaissance_romulus_module',
    weaponLoadout: ['wpn_romulus_f44aa_pulse_rifle'],
    description: 'Le groupe de jeunes mineurs et recycleurs de Jackson\'s Star luttant pour leur émancipation et leur survie dans les modules délabrés de la station Renaissance.',
    tactics: 'Tirs de couverture au fusil à impulsion F44AA, verrouillage de portes pressurisées et utilisation tactique des sas de gravité.',
    totalHonorReward: 5400,
    soloVariantId: 'alien_base_rain_carradine_romulus_rebel',
    members: [
      { id: 'romulus_rain_carradine', name: 'Rain Carradine', role: 'Tireuse de Précision F44AA', weapon: 'Fusil F44AA à Ciblage Guidé & Découpeur', weaponId: 'wpn_romulus_f44aa_pulse_rifle', vitalityRatio: 1.2, hp: 610, armor: 50, trophy: 'Module d\'Autorisation Corporatif Weyland de Rain' },
      { id: 'romulus_andy_synth', name: 'Andy (Module ND-5 Weyland)', role: 'Protecteur Synthétique Renforcé', weapon: 'Fusil F44AA & Force Surhumaine d\'Impact', weaponId: 'wpn_romulus_f44aa_pulse_rifle', vitalityRatio: 1.35, hp: 680, armor: 65, trophy: 'Puce de Protocole Directif Rook ND-5' },
      { id: 'romulus_tyler_miner', name: 'Tyler', role: 'Meneur d\'Incursion Minière', weapon: 'Fusil F44AA & Torche Thermique de Bord', weaponId: 'wpn_romulus_f44aa_pulse_rifle', vitalityRatio: 1.05, hp: 550, armor: 45, trophy: 'Combinaison Pressurisée Déchirée de Tyler' },
      { id: 'romulus_bjorn_scrapper', name: 'Bjorn', role: 'Assaillant au Bâton Électrique', weapon: 'Bâton Électrifié & Fusil F44AA d\'Appui', weaponId: 'wpn_romulus_f44aa_pulse_rifle', vitalityRatio: 1.0, hp: 530, armor: 40, trophy: 'Bâton d\'Abattage Haute Tension de Jackson\'s Star' }
    ]
  },
  {
    id: 'squad_alien_genocide_red_drones',
    name: 'Essaim de Guerre de la Ruche Rouge du Monde Natal (1991)',
    universe: 'ALIEN',
    shortName: 'Ruche Rouge Mutante (4 Xénomorphes)',
    category: 'XENOMORPH_HORDE',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens: Genocide (Dark Horse Comics 1991)',
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Monde Natal Xénomorphe (Genocide 1991)',
    primaryMapId: 'map_alien_hiveworld_red_grounds',
    weaponLoadout: ['wpn_berserker_max_autocannon'],
    description: 'L\'avant-garde écarlate de la Reine Mère, mutée et agressive, engagée dans l\'extermination de la ruche noire concurrente.',
    tactics: 'Charges furieuses en meute écarlate, projections coordonnées d\'acide hyper-corrosif et frappes de queue perforantes.',
    totalHonorReward: 5600,
    soloVariantId: 'prey_xeno_warrior',
    members: [
      { id: 'red_drone_alpha_striker', name: 'Guerrier Rouge Alpha Écarlate', role: 'Fer de Lance de la Ruche Rouge', weapon: 'Griffes Tranchantes & Queue Perforante Acide', weaponId: 'wpn_berserker_max_autocannon', vitalityRatio: 1.3, hp: 660, armor: 70, trophy: 'Crête Chitineuse Écarlate de Guerrier Rouge' },
      { id: 'red_drone_acid_spitter', name: 'Cracheur Rouge Caustique', role: 'Support d\'Acide Projeté', weapon: 'Glandes d\'Acide Écarlate Concentré', weaponId: 'wpn_berserker_max_autocannon', vitalityRatio: 1.1, hp: 580, armor: 60, trophy: 'Glande d\'Acide Hautement Concentrée de Genocide' },
      { id: 'red_drone_ambush_crawler', name: 'Rôdeur Rouge des Parois', role: 'Traqueur Mural Agile', weapon: 'Double Mâchoire Pharyngienne & Serres', weaponId: 'wpn_berserker_max_autocannon', vitalityRatio: 1.05, hp: 550, armor: 55, trophy: 'Mâchoire Pharyngienne Rouge Rétractable' },
      { id: 'red_drone_brood_protector', name: 'Sentinelle Rouge du Pondoir', role: 'Protecteur de la Reine Mère', weapon: 'Carapace Renforcée & Lames Chitineuses', weaponId: 'wpn_berserker_max_autocannon', vitalityRatio: 1.2, hp: 620, armor: 65, trophy: 'Plaque Dorsale d\'Obsidienne Teintée de Rouge' }
    ]
  },
  {
    id: 'squad_avp_killer_clan_wardogs',
    name: 'Maîtres des Bêtes & Chiens de Guerre du Clan Tueur (2010)',
    universe: 'AVP',
    shortName: 'Meute du Clan Tueur (4 Assaillants)',
    category: 'SUPER_PREDATORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens vs. Predator: Three World War (Dark Horse Comics 2010)',
    biomeId: 'genna_deathworld',
    recommendedBiomeLabel: 'Fief de Caparis VII (Three World War 2010)',
    primaryMapId: 'map_avp_caparis_killer_ruins',
    weaponLoadout: ['wpn_killer_clan_tusk_acid_spitter'],
    description: 'La formation hérétique du Killer Clan maniant le cracheur d\'acide et guidant au combat des xénomorphes à défenses asservis par des laisses épineuses.',
    tactics: 'Encerclement au fouet épineux, arrosage d\'acide caustique et lâcher de molosses xénomorphes en furie.',
    totalHonorReward: 5700,
    soloVariantId: 'prey_bad_blood_warlord',
    members: [
      { id: 'killer_clan_beastmaster_lord', name: 'Seigneur Dresseur du Clan Tueur', role: 'Commandant Hérétique Bad Blood', weapon: 'Cracheur d\'Acide & Fouet Barbelé Électrifié', weaponId: 'wpn_killer_clan_tusk_acid_spitter', vitalityRatio: 1.35, hp: 690, armor: 75, trophy: 'Masque Défiguré aux Dents de Xéno du Killer Clan' },
      { id: 'killer_clan_tusk_hound_one', name: 'Xénomorphe Domestiqué à Défenses Alpha', role: 'Molosse de Guerre Asservi', weapon: 'Défenses Osseuses & Morsure Acide Enchaînée', weaponId: 'wpn_killer_clan_tusk_acid_spitter', vitalityRatio: 1.2, hp: 620, armor: 65, trophy: 'Collier Barbelé d\'Asservissement du Chien de Guerre' },
      { id: 'killer_clan_acid_skirmisher', name: 'Tirailleur Corrosif Bad Blood', role: 'Soutien Chimique de Meute', weapon: 'Double Cracheur d\'Acide & Lames de Poignet', weaponId: 'wpn_killer_clan_tusk_acid_spitter', vitalityRatio: 1.15, hp: 600, armor: 65, trophy: 'Injecteur d\'Acide Barbelé du Clan Tueur' },
      { id: 'killer_clan_tusk_hound_two', name: 'Xénomorphe Domestiqué à Défenses Traqueur', role: 'Molosse de Chasse Agile', weapon: 'Griffes Tranchantes & Fouet Caudal Barbelé', weaponId: 'wpn_killer_clan_tusk_acid_spitter', vitalityRatio: 1.1, hp: 570, armor: 60, trophy: 'Défense Cornée de Xénomorphe de Combat' }
    ]
  },
  {
    id: 'squad_avp_ryushi_chigusa_settlers',
    name: 'Milice des Éleveurs & Défenseurs de Ryushi (1990)',
    universe: 'AVP',
    shortName: 'Éleveurs de Ryushi (4 Colons)',
    category: 'CIVILIAN_SURVIVORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens vs. Predator (Dark Horse Comics 1990)',
    biomeId: 'ryushi_desert',
    recommendedBiomeLabel: 'Ranch Chigusa sur Ryushi (AVP 1990)',
    primaryMapId: 'map_avp_ryushi_chigusa_ranch',
    weaponLoadout: ['wpn_ryushi_ranch_harpoon_gun'],
    description: 'L\'équipe de pionniers et ranchers de la Chigusa Corporation armée de harpons hydrauliques et luttant aux côtés de Machiko Noguchi pour sauver leur domaine.',
    tactics: 'Tirs de harpons hydrauliques pour ancrer les cibles, tirs croisés d\'appui et barricades de matériel d\'élevage.',
    totalHonorReward: 5300,
    soloVariantId: 'prey_broken_tusk_dachande',
    members: [
      { id: 'ryushi_machiko_ranch_leader', name: 'Machiko Noguchi (Période Chigusa)', role: 'Administratrice & Meneuse de la Défense', weapon: 'Fusil-Harpon Hydraulique & Pistolet de Sécurité', weaponId: 'wpn_ryushi_ranch_harpoon_gun', vitalityRatio: 1.25, hp: 630, armor: 50, trophy: 'Badge d\'Administratrice de la Chigusa Corporation' },
      { id: 'ryushi_chief_herder', name: 'Maître Éleveur Hiroshi', role: 'Spécialiste Conduite de Bétail Lourd', weapon: 'Harpon Hydraulique Lourd & Aiguillon Pneumatique', weaponId: 'wpn_ryushi_ranch_harpoon_gun', vitalityRatio: 1.1, hp: 560, armor: 45, trophy: 'Câble d\'Ancrage en Titane de Rhynth' },
      { id: 'ryushi_settler_mechanic', name: 'Mécanicien de Tracteur Foster', role: 'Défenseur de Hangar Agricole', weapon: 'Harpon Pneumatique & Chalumeau d\'Atelier', weaponId: 'wpn_ryushi_ranch_harpoon_gun', vitalityRatio: 1.0, hp: 520, armor: 40, trophy: 'Outil de Découpe Hydraulique de Ryushi' },
      { id: 'ryushi_settler_scout', name: 'Pisteur des Plaines Kenji', role: 'Sentinelle des Enclos Extérieurs', weapon: 'Harpon Léger & Fusées Éclairantes', weaponId: 'wpn_ryushi_ranch_harpoon_gun', vitalityRatio: 0.95, hp: 510, armor: 35, trophy: 'Boussole Magnétique des Soleils Jumeaux' }
    ]
  },
  {
    id: 'squad_pred_spratly_pirates',
    name: 'Bande de Flibuste des Îles Spratleys (2008)',
    universe: 'PREDATOR',
    shortName: 'Pirates des Spratleys (4 Combattants)',
    category: 'CRIME_CARTEL',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: South China Sea (2008)',
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Atoll Volcanique des Spratleys (2008)',
    primaryMapId: 'map_pred_spratly_volcanic_island',
    weaponLoadout: ['wpn_spratly_pirate_rpg7'],
    description: 'Flottille de flibustiers et mercenaires retranchés sur un atoll volcanique, armés de RPG-7 et de fusils automatiques.',
    tactics: 'Tirs de barrage de roquettes RPG-7 depuis les ponts suspendus et tirs croisés d’armes automatiques dans la mangrove.',
    totalHonorReward: 5400,
    soloVariantId: 'alien_base_galgo_helder_smuggler',
    members: [
      { id: 'spratly_pirate_captain', name: 'Capitaine Nguyen Le Borgne', role: 'Commandant de la Flottille', weapon: 'RPG-7 Modifié & Machette de Jungle', weaponId: 'wpn_spratly_pirate_rpg7', vitalityRatio: 1.25, hp: 650, armor: 55, trophy: 'Sabre d’Abordage et Bandoulière de Roquettes' },
      { id: 'spratly_pirate_gunner', name: 'Artilleur Chen le Pyromane', role: 'Tireur de Roquettes Lourd', weapon: 'RPG-7 Antichar & Pistolet Automatique', weaponId: 'wpn_spratly_pirate_rpg7', vitalityRatio: 1.15, hp: 580, armor: 45, trophy: 'Optique de Visée Nocturne de Roquette' },
      { id: 'spratly_pirate_trapper', name: 'Trappeur de Mangrove Somchai', role: 'Poseur de Pièges & Éclaireur', weapon: 'Fusil Automatique & Pièges à Loup', weaponId: 'wpn_spratly_pirate_rpg7', vitalityRatio: 1.0, hp: 530, armor: 40, trophy: 'Collier de Crocs de Fauve des Spratleys' },
      { id: 'spratly_pirate_lookout', name: 'Guetteur de vigie Bao', role: 'Sentinelle des Ponts Suspendus', weapon: 'Carabine de Précision & Fusées Signal', weaponId: 'wpn_spratly_pirate_rpg7', vitalityRatio: 0.95, hp: 500, armor: 35, trophy: 'Jumelles de Marine Maritimes Abrasées' }
    ]
  },
  {
    id: 'squad_pred_bolderji_mercs',
    name: 'Mercenaires de la Caldeira de Bolder’ji (2006)',
    universe: 'PREDATOR',
    shortName: 'Mercenaires Castaneda (4 Gardes)',
    category: 'MERCENARY_SYNDICATE',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Forever Midnight (2006)',
    biomeId: 'yautja_prime',
    recommendedBiomeLabel: 'Caldeira de Bolder’ji (2006)',
    primaryMapId: 'map_pred_bolderji_caldera',
    weaponLoadout: ['wpn_bolderji_mercenary_magnum'],
    description: 'Unité de sécurité privée de la corporation Castaneda équipée de revolvers lourds .500 Magnum patrouillant autour des puits magmatiques.',
    tactics: 'Tirs d’arrêt puissants au calibre lourd, utilisation de grenades assourdissantes et repli vers les consoles blindées.',
    totalHonorReward: 5600,
    soloVariantId: 'alien_base_royce_mercenaire_2010',
    members: [
      { id: 'bolderji_commander_vance', name: 'Commandant de Sécurité Vance', role: 'Chef d’Escouade de Castaneda', weapon: 'Revolver .500 Magnum & Bouclier Anti-Émeute', weaponId: 'wpn_bolderji_mercenary_magnum', vitalityRatio: 1.3, hp: 680, armor: 60, trophy: 'Plaque d’Identification Castaneda Inc.' },
      { id: 'bolderji_enforcer_karl', name: 'Exécuteur Karl le Briseur', role: 'Spécialiste de Répression Lourde', weapon: 'Revolver .500 Magnum Jumelé', weaponId: 'wpn_bolderji_mercenary_magnum', vitalityRatio: 1.15, hp: 600, armor: 50, trophy: 'Ceinturon de Munitions .500 semi-blindées' },
      { id: 'bolderji_technician_tara', name: 'Technicienne Armée Tara', role: 'Opératrice Géothermique de Défense', weapon: 'Magnum de Poing & Chalumeau Géothermique', weaponId: 'wpn_bolderji_mercenary_magnum', vitalityRatio: 1.0, hp: 540, armor: 45, trophy: 'Clé de Déverrouillage des Vannes Magma' },
      { id: 'bolderji_scout_morris', name: 'Éclaireur Géothermique Morris', role: 'Pisteur des Fumerolles', weapon: 'Magnum Léger & Détecteur Thermique', weaponId: 'wpn_bolderji_mercenary_magnum', vitalityRatio: 0.95, hp: 510, armor: 40, trophy: 'Visière Thermique Filtrante Anti-Soufre' }
    ]
  },
  {
    id: 'squad_alien_stronghold_sec_drones',
    name: 'Droïdes & Escorte Cybernétique de Maboushe (1994)',
    universe: 'ALIEN',
    shortName: 'Escorte Ernst & Jeri (4 Unités)',
    category: 'SYNTHETIC_PACK',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens: Stronghold (1994)',
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Forteresse Maboushe du Dr Ernst (1994)',
    primaryMapId: 'map_alien_stronghold_ernst_lab',
    weaponLoadout: ['wpn_stronghold_jeri_disruptor'],
    description: 'Section de synthétiques de protection et sentinelles cybernétiques commandée par le xéno-synthétique Jeri au cœur du complexe Ernst.',
    tactics: 'Émissions coordonnées d’ondes EMP pour paralyser les systèmes ennemis, tirs concentrés et charges au corps-à-corps insensible.',
    totalHonorReward: 5800,
    soloVariantId: 'alien_base_jeri_synthetic_xeno_cigar',
    members: [
      { id: 'stronghold_jeri_infiltrator', name: 'Jeri (Forme d’Escorte de Combat)', role: 'Synthétique d’Infiltration & Meneur', weapon: 'Émetteur Disrupteur EMP & Cigare Calciné', weaponId: 'wpn_stronghold_jeri_disruptor', vitalityRatio: 1.35, hp: 700, armor: 65, trophy: 'Boîtier Vocal Cybernétique & Cigare de Jeri' },
      { id: 'stronghold_sentinel_alpha', name: 'Sentinelle de Sécurité Alpha-01', role: 'Garde de Confinement Robotique', weapon: 'Disrupteur Haute Fréquence & Matraque Choc', weaponId: 'wpn_stronghold_jeri_disruptor', vitalityRatio: 1.15, hp: 610, armor: 55, trophy: 'Module d’Asservissement Cybernétique' },
      { id: 'stronghold_sentinel_beta', name: 'Sentinelle de Sécurité Beta-02', role: 'Unité d’Interception Tactique', weapon: 'Disrupteur Directionnel & Blindage Titane', weaponId: 'wpn_stronghold_jeri_disruptor', vitalityRatio: 1.05, hp: 570, armor: 50, trophy: 'Batterie à Décharge Rapide EMP' },
      { id: 'stronghold_lab_synth_tech', name: 'Androïde Médical d’Assistance Ernst', role: 'Support Bio-Analytique', weapon: 'Injecteur d’Acide & Émetteur EMP Portatif', weaponId: 'wpn_stronghold_jeri_disruptor', vitalityRatio: 0.95, hp: 520, armor: 40, trophy: 'Échantillonneur Hermétique de Tégument Xéno' }
    ]
  },
  {
    id: 'squad_alien_lv178_miners',
    name: 'Brigade Minière de New Galveston LV-178 (2014)',
    universe: 'ALIEN',
    shortName: 'Foreurs de LV-178 (4 Mineurs)',
    category: 'CIVILIAN_SURVIVORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien: Sea of Sorrows (2014)',
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Mines de Trimonite LV-178 (2014)',
    primaryMapId: 'map_alien_lv178_trimonite_mines',
    weaponLoadout: ['wpn_cold_forge_taser_drone_prod'],
    description: 'Équipe de foreurs de fond de New Galveston armée de piques taser industrielles et d’outils lourds de concassage.',
    tactics: 'Blocage des boyaux étroits avec des piques taser, pose de charges de concassage et tirs d’étourdissement en formation défensive.',
    totalHonorReward: 5500,
    soloVariantId: 'alien_base_tyler_romulus_miner',
    members: [
      { id: 'lv178_foreman_decker', name: 'Contremaître de Chantier Decker', role: 'Meneur des Équipes de Fond', weapon: 'Pique Taser Haute Tension & Foreuse Manuelle', weaponId: 'wpn_cold_forge_taser_drone_prod', vitalityRatio: 1.25, hp: 660, armor: 55, trophy: 'Casque de Mineur Renforcé avec Visière Trimonite' },
      { id: 'lv178_drill_operator_mikhail', name: 'Opérateur de Foreuse Mikhail', role: 'Piqueur de Trimonite Lourde', weapon: 'Pique Taser Lourde & Marteau Pneumatique', weaponId: 'wpn_cold_forge_taser_drone_prod', vitalityRatio: 1.15, hp: 600, armor: 50, trophy: 'Burin en Carbure de Trimonite Brute' },
      { id: 'lv178_demolition_sara', name: 'Dynamiteuse de Veine Sara', role: 'Artificière de Cavité Souterraine', weapon: 'Pique Taser Légère & Détonateur Minier', weaponId: 'wpn_cold_forge_taser_drone_prod', vitalityRatio: 1.0, hp: 540, armor: 40, trophy: 'Ceinture d’Allumeurs Pyrotechniques' },
      { id: 'lv178_shaft_scout_kofi', name: 'Éclaireur de Puits Kofi', role: 'Sentinelle des Galeries Profondes', weapon: 'Pique Taser & Lampe Stroboscopique', weaponId: 'wpn_cold_forge_taser_drone_prod', vitalityRatio: 0.95, hp: 510, armor: 35, trophy: 'Détecteur de Gaz de Fissure Minier' }
    ]
  },
  {
    id: 'squad_avp_uss_ryushi_marines',
    name: 'Section de Nettoyage de l’USS Ryushi (1995)',
    universe: 'AVP',
    shortName: 'Marines de l’USS Ryushi (4 Soldats)',
    category: 'COLONIAL_MARINES',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens vs. Predator: Duel (1995)',
    biomeId: 'genna_deathworld',
    recommendedBiomeLabel: 'Cales de l’USS Ryushi (1995)',
    primaryMapId: 'map_avp_uss_ryushi_cargo_hold',
    weaponLoadout: ['wpn_duel_uss_ryushi_flamethrower'],
    description: 'Section de choc du Corps des Marines Coloniaux dépêchée sur l’USS Ryushi et dotée de lance-flammes pour purger les cales infestées par le Predalien.',
    tactics: 'Projection de nappes de feu continues pour acculer les cibles, tirs de couverture au fusil d’assaut et fermeture méthodique des cloisons.',
    totalHonorReward: 5900,
    soloVariantId: 'alien_base_christopher_winter_marine',
    members: [
      { id: 'ryushi_marine_lieutenant_judd', name: 'Lieutenant Judd de l’USS Ryushi', role: 'Officier d’Intervention Rapprochée', weapon: 'Lance-Flammes M240B & Pistolet VP70', weaponId: 'wpn_duel_uss_ryushi_flamethrower', vitalityRatio: 1.3, hp: 690, armor: 60, trophy: 'Casque M10 de Lieutenant USCM avec Caméra Tactique' },
      { id: 'ryushi_marine_flamer_garcia', name: 'Caporal Incendiaire Garcia', role: 'Spécialiste de Purge Thermique', weapon: 'Lance-Flammes Lourd M240B & Réservoir Dorsal', weaponId: 'wpn_duel_uss_ryushi_flamethrower', vitalityRatio: 1.15, hp: 620, armor: 55, trophy: 'Brûleur au Phosphore Modifié M240B' },
      { id: 'ryushi_marine_rifleman_nash', name: 'Fusilier de Soutien Nash', role: 'Tireur d’Appui Couverture', weapon: 'Lance-Flammes Compact & Baïonnette', weaponId: 'wpn_duel_uss_ryushi_flamethrower', vitalityRatio: 1.05, hp: 560, armor: 50, trophy: 'Gilet Pare-Éclats Blindé M3 Personnalisé' },
      { id: 'ryushi_marine_medic_chen', name: 'Infirmier de Combat Chen', role: 'Support Médical & Décontamination', weapon: 'Lance-Flammes Léger & Trousse Stimpack', weaponId: 'wpn_duel_uss_ryushi_flamethrower', vitalityRatio: 0.95, hp: 520, armor: 40, trophy: 'Injecteur d’Antitoxine Acide USCM' }
    ]
  },
  {
    id: 'squad_avp_web_shipyard_riggers',
    name: 'Brigade de Monteurs Sidérurgistes de The Web (1999)',
    universe: 'AVP',
    shortName: 'Monteurs de The Web (4 Sidérurgistes)',
    category: 'CIVILIAN_SURVIVORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens vs. Predator: The Web (1999)',
    biomeId: 'los_angeles_1997',
    recommendedBiomeLabel: 'Chantier Spatial The Web (1999)',
    primaryMapId: 'map_avp_orbital_web_shipyard',
    weaponLoadout: ['wpn_web_magnetic_riveter'],
    description: 'Équipe de monteurs en apesanteur de la station The Web armée de riveteuses magnétiques lourdes et opérant sur les poutrelles géantes.',
    tactics: 'Tirs en rafale de rivets magnétiques perforants depuis les échafaudages supérieurs et manœuvres d’encerclement par câbles de suspension.',
    totalHonorReward: 5700,
    soloVariantId: 'alien_base_johner_mercenary_betty',
    members: [
      { id: 'web_master_rigger_orourke', name: 'Maître Monteur O’Rourke', role: 'Chef d’Échafaudage Spatial', weapon: 'Riveteuse Magnétique Lourde & Harnais de Suspension', weaponId: 'wpn_web_magnetic_riveter', vitalityRatio: 1.3, hp: 670, armor: 60, trophy: 'Harnais Magnétique de Sécurité Orbitale' },
      { id: 'web_welder_suleiman', name: 'Soudeur de Quille Suleiman', role: 'Spécialiste de Découpe Plasma', weapon: 'Riveteuse Magnétique & Torche Industrielle', weaponId: 'wpn_web_magnetic_riveter', vitalityRatio: 1.15, hp: 610, armor: 50, trophy: 'Masque de Soudeur Spatial Filtrant Or' },
      { id: 'web_cable_handler_yuki', name: 'Arrimeuse de Câbles Yuki', role: 'Voltigeuse de Haute Structure', weapon: 'Riveteuse Légère & Grappin Magnétique', weaponId: 'wpn_web_magnetic_riveter', vitalityRatio: 1.0, hp: 550, armor: 45, trophy: 'Grappin Magnétique de Déplacement Orbital' },
      { id: 'web_crane_operator_piotr', name: 'Opérateur de Catapulte Piotr', role: 'Artilleur de Poutrelles', weapon: 'Riveteuse Compacte & Détonateur Pneumatique', weaponId: 'wpn_web_magnetic_riveter', vitalityRatio: 0.95, hp: 510, armor: 35, trophy: 'Console de Commande Portative de Catapulte' }
    ]
  },
  {
    id: 'squad_pred_hunters_ii_afghan',
    name: 'Escouade Clandestine Tyler Swain — Afghanistan (2018)',
    universe: 'PREDATOR',
    shortName: 'Hunters II Afghan (4 Mercenaires)',
    category: 'MILITARY_COMMANDO',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Hunters II (2018)',
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Bunkers Soviétiques d’Afghanistan (2018)',
    primaryMapId: 'map_pred_afghan_bunker_network',
    weaponLoadout: ['wpn_hunters_arctic_anti_materiel_50'],
    description: 'Équipe d’intervention clandestine aguerrie menée par Tyler Swain, retranchée dans les bunkers d’altitude pour éliminer les Yautja par grand froid.',
    tactics: 'Tirs de barrage au fusil anti-matériel depuis les hauteurs rocheuses et couverture rapprochée dans les goulots d’étranglement.',
    totalHonorReward: 6200,
    soloVariantId: 'alien_base_quinn_mckenna_ranger_2018',
    members: [
      { id: 'hunters_ii_tyler_swain', name: 'Commandant Tyler Swain', role: 'Chef de Groupe Clandestin', weapon: 'Barrett M82A1 .50 BMG & Visière Thermique', weaponId: 'wpn_hunters_arctic_anti_materiel_50', vitalityRatio: 1.35, hp: 690, armor: 65, trophy: 'Insigne Tactique d’Intervention Clandestine' },
      { id: 'hunters_ii_farhad_scout', name: 'Éclaireur Farhad', role: 'Pisteur des Cavernes Glacées', weapon: 'Carabine de Précision Arctique & Crampons', weaponId: 'wpn_hunters_arctic_anti_materiel_50', vitalityRatio: 1.1, hp: 580, armor: 45, trophy: 'Boussole Militaire Soviétique d’Altitude' },
      { id: 'hunters_ii_elena_heavy', name: 'Artilleuse Elena', role: 'Spécialiste Armes Lourdes de Bunker', weapon: 'Fusil Anti-Matériel .50 & Grenades Frigorigènes', weaponId: 'wpn_hunters_arctic_anti_materiel_50', vitalityRatio: 1.2, hp: 640, armor: 60, trophy: 'Plaque d’Identification Renforcée Stargazer' },
      { id: 'hunters_ii_khalil_medic', name: 'Opérateur Khalil', role: 'Sapeur & Démolisseur de Boyaux', weapon: 'Fusil Semi-Automatique & Détonateurs Thermiques', weaponId: 'wpn_hunters_arctic_anti_materiel_50', vitalityRatio: 1.0, hp: 540, armor: 40, trophy: 'Sacoche de Détonateurs Haute Montagne' }
    ]
  },
  {
    id: 'squad_pred_hunters_iii_guatemala',
    name: 'Syndicat du Cartel du Cénote Sacré — Guatemala (2020)',
    universe: 'PREDATOR',
    shortName: 'Cartel du Cénote (4 Sicarios)',
    category: 'CRIME_CARTEL',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Predator: Hunters III (2020)',
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Cénote Sacré Maya (2020)',
    primaryMapId: 'map_pred_central_america_cenote',
    weaponLoadout: ['wpn_narco_quad_drum_mg'],
    description: 'Commandos de narcotrafiquants surarmés occupant un temple maya cénote, usant de mitrailleuses lourdes et de pièges hydrographiques.',
    tactics: 'Saturation de zone continue à la MG42 et repli coordonné vers les passerelles surplombant le bassin central.',
    totalHonorReward: 6000,
    soloVariantId: 'alien_base_king_willie_voodoo_priest',
    members: [
      { id: 'narco_patron_santiago', name: 'El Patrón Santiago', role: 'Chef de Place du Cartel', weapon: 'MG42 Quad-Drum & Revolver Doré', weaponId: 'wpn_narco_quad_drum_mg', vitalityRatio: 1.3, hp: 660, armor: 55, trophy: 'Chapelet en Or & Cartouchière Gravée' },
      { id: 'narco_gunner_mateo', name: 'Mitrailleur Mateo', role: 'Artilleur Lourd de Cénote', weapon: 'MG42 Surcadencée & Bande 250cps', weaponId: 'wpn_narco_quad_drum_mg', vitalityRatio: 1.15, hp: 610, armor: 50, trophy: 'Bandoulière de Cuir de Cartel Sud-Américain' },
      { id: 'narco_trapper_chavez', name: 'Pisteur Chavez', role: 'Piégeur des Cénotes & Rivières', weapon: 'Fusil Calibre 12 & Machette de Jungle', weaponId: 'wpn_narco_quad_drum_mg', vitalityRatio: 1.0, hp: 550, armor: 40, trophy: 'Machette Damassée au Manche d’Ébène' },
      { id: 'narco_scout_lucia', name: 'Sentinelle Lucia', role: 'Guetteuse de la Canopée', weapon: 'Carabine d’Assaut Compacte & Flare Gun', weaponId: 'wpn_narco_quad_drum_mg', vitalityRatio: 0.95, hp: 520, armor: 35, trophy: 'Jumelles Militaires Tropicalisées' }
    ]
  },
  {
    id: 'squad_alien_nemesis_berserkers',
    name: 'Escouade Suicide M.A.X. — Station Nemesis (1995)',
    universe: 'ALIEN',
    shortName: 'Berserkers M.A.X. (4 Pilotes)',
    category: 'COLONIAL_MARINES',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Aliens: Berserker (1995)',
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Fonderie Nemesis (1995)',
    primaryMapId: 'map_alien_nemesis_berserker_forge',
    weaponLoadout: ['wpn_berserker_max_plasma_repeater'],
    description: 'Pilotes condamnés sous neuro-drogue Berserker aux commandes de l’exosquelette lourd M.A.X., sacrifiés pour broyer les ruches xénomorphes.',
    tactics: 'Charges frontales dévastatrices au canon plasma rotatif sans aucun souci de survie personnelle ni repli tactique.',
    totalHonorReward: 6400,
    soloVariantId: 'prey_colonial_marine_heavy',
    members: [
      { id: 'max_pilot_sergeant_creech', name: 'Sergent Creech (M.A.X. Alpha)', role: 'Pilote de Tête Exosquelette', weapon: 'Canon Rotatif Plasma & Griffes Hydrauliques', weaponId: 'wpn_berserker_max_plasma_repeater', vitalityRatio: 1.4, hp: 720, armor: 75, trophy: 'Injecteur Neuro-Stimulant Berserker Vide' },
      { id: 'max_pilot_vance', name: 'Condamné Vance (M.A.X. Bravo)', role: 'Artilleur de Percée Sidérurgique', weapon: 'Plasma Rotary Repeater & Blindage Titane', weaponId: 'wpn_berserker_max_plasma_repeater', vitalityRatio: 1.2, hp: 650, armor: 70, trophy: 'Plaque d’Épaule Blindée M.A.X. Série 3' },
      { id: 'max_pilot_korolenko', name: 'Pilote Korolenko', role: 'Démolisseur de Caillebotis', weapon: 'Canon Plasma Lourd & Éperon Bélier', weaponId: 'wpn_berserker_max_plasma_repeater', vitalityRatio: 1.1, hp: 600, armor: 65, trophy: 'Casque Pressurisé avec Moniteur Neuro-Synaptique' },
      { id: 'max_pilot_santos', name: 'Opérateur Santos', role: 'Nettoyeur de Niche Thermique', weapon: 'Plasma Repeater Compact & Lance-Torches', weaponId: 'wpn_berserker_max_plasma_repeater', vitalityRatio: 1.0, hp: 560, armor: 60, trophy: 'Connecteur Neural de Commande Hydraulique' }
    ]
  },
  {
    id: 'squad_alien_shan_shen_guards',
    name: 'Détachement de Sécurité & Décontamination de Shan Shen (2022)',
    universe: 'ALIEN',
    shortName: 'Gardes de Shan Shen (4 Opérateurs)',
    category: 'MERCENARY_SYNDICATE',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'Alien: Inferno\'s Fall (2022)',
    biomeId: 'genna_deathworld',
    recommendedBiomeLabel: 'Raffinerie de Shan Shen (2022)',
    primaryMapId: 'map_alien_shan_shen_refinery',
    weaponLoadout: ['wpn_upp_ak120_infantry_carbine'],
    description: 'Gardes industriels de l’UPP en combinaisons pressurisées déployés autour des silos de spores pour purger la raffinerie contaminée.',
    tactics: 'Tirs de barrage échelonnés à l’AK-120 et déploiement de charges incendiaires dans les boyaux de tuyauterie.',
    totalHonorReward: 5900,
    soloVariantId: 'alien_base_christopher_winter_marine',
    members: [
      { id: 'shan_shen_captain_volkov', name: 'Capitaine Volkov', role: 'Commandant de Décontamination UPP', weapon: 'AK-120 Kalashnikov & Détecteur Spores', weaponId: 'wpn_upp_ak120_infantry_carbine', vitalityRatio: 1.25, hp: 650, armor: 60, trophy: 'Respirateur Filtrant Haut Débit UPP' },
      { id: 'shan_shen_sergeant_chen', name: 'Sergent Chen', role: 'Fusilier d’Assaut Caseless', weapon: 'AK-120 avec Lunette IR & Baïonnette Titane', weaponId: 'wpn_upp_ak120_infantry_carbine', vitalityRatio: 1.1, hp: 590, armor: 55, trophy: 'Chargeur Télescopé Sans Étui AK-120' },
      { id: 'shan_shen_hazmat_taras', name: 'Opérateur Hazmat Taras', role: 'Sapeur Décontaminateur', weapon: 'AK-120 Carbine & Lance-Solution Alcaline', weaponId: 'wpn_upp_ak120_infantry_carbine', vitalityRatio: 1.05, hp: 570, armor: 50, trophy: 'Combinaison Pressurisée Anti-Pathogène Éventrée' },
      { id: 'shan_shen_sentry_mei', name: 'Sentinelle Mei', role: 'Guetteuse de Silo Chimique', weapon: 'AK-120 Raccourcie & Fusées de Détresse', weaponId: 'wpn_upp_ak120_infantry_carbine', vitalityRatio: 0.95, hp: 520, armor: 45, trophy: 'Insigne Métallique de la Garde UPP Shan Shen' }
    ]
  },
  {
    id: 'squad_avp_delacroix_samara',
    name: 'Garde Rapprochée Harada de Caryn Delacroix — Station Samara (1993)',
    universe: 'AVP',
    shortName: 'Samara Harada Guard (4 Gardes)',
    category: 'CIVILIAN_SURVIVORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'AVP: Deadliest of the Species (1993)',
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Spire Samara Ring (1993)',
    primaryMapId: 'map_avp_samara_ring_habitat',
    weaponLoadout: ['wpn_delacroix_harada_needle_pistol'],
    description: 'Gardes d’élite cybernétiques du Zaibatsu Harada défendant le penthouse de Samara Ring avec des pistolets à aiguilles perforantes.',
    tactics: 'Tirs de fléchettes neurotoxiques rapides en formation serrée et verrouillage des accès coupe-gorge.',
    totalHonorReward: 6100,
    soloVariantId: 'alien_base_alexa_lex_woods_guide',
    members: [
      { id: 'samara_caryn_delacroix', name: 'Caryn Delacroix', role: 'Aristocrate Fugitive & Chasseresse', weapon: 'Harada Cyber-Needle Pistol & Lame Cérémonielle', weaponId: 'wpn_delacroix_harada_needle_pistol', vitalityRatio: 1.3, hp: 670, armor: 55, trophy: 'Pendentif Holographique de l’IA Toy' },
      { id: 'samara_harada_cyborg_kenji', name: 'Cyborg de Sécurité Kenji', role: 'Garde du Corps Augmenté', weapon: 'Double Pistolet à Fléchettes Monofilament', weaponId: 'wpn_delacroix_harada_needle_pistol', vitalityRatio: 1.2, hp: 630, armor: 65, trophy: 'Implants Oculaires Cybernétiques Harada Zaibatsu' },
      { id: 'samara_security_reiko', name: 'Lieutenant Reiko', role: 'Tacticienne de Salon Panoramique', weapon: 'Pistolet à Aiguilles Longue Portée & Taser', weaponId: 'wpn_delacroix_harada_needle_pistol', vitalityRatio: 1.05, hp: 570, armor: 50, trophy: 'Carte Magnétique d’Accès au Penthouse Delacroix' },
      { id: 'samara_drone_tech_shin', name: 'Technicien Shin', role: 'Opérateur de Verrous Sas Orbitaux', weapon: 'Needle Pistol Compact & Console de Piratage', weaponId: 'wpn_delacroix_harada_needle_pistol', vitalityRatio: 0.95, hp: 520, armor: 40, trophy: 'Terminal Portatif de Cryptage Zaibatsu' }
    ]
  },
  {
    id: 'squad_avp_three_world_killer_clan',
    name: 'Meute de Chasse du Killer Clan — Caparis VII (2010)',
    universe: 'AVP',
    shortName: 'Killer Clan Caparis (4 Parias)',
    category: 'SUPER_PREDATORS',
    scale: 'MOYEN',
    totalMembers: 4,
    originMedia: 'AVP: Three World War (2010)',
    biomeId: 'yautja_prime',
    recommendedBiomeLabel: 'Canyon de Caparis VII (2010)',
    primaryMapId: 'map_avp_caparis_vii_canyon',
    weaponLoadout: ['wpn_killer_clan_blaster_carbine'],
    description: 'Faction Yautja renégate sacrilège dressant des Xénomorphes en laisse comme meute d’attaque dans les canyons arides de Caparis VII.',
    tactics: 'Lâcher de xénomorphes asservis au front pendant que les tireurs d’élite Bad Blood délivrent des salves de plasma instable.',
    totalHonorReward: 6600,
    soloVariantId: 'prey_bad_blood_warlord',
    members: [
      { id: 'killer_clan_warlord_kraag', name: 'Seigneur Parias Kraag', role: 'Maître de Meute Sacrilège', weapon: 'Killer Clan Blaster Carbine & Laisse Électro-Barbelée', weaponId: 'wpn_killer_clan_blaster_carbine', vitalityRatio: 1.45, hp: 750, armor: 75, trophy: 'Collier de Domestication Neuronale de Xénomorphe' },
      { id: 'killer_clan_handler_thorrok', name: 'Dresseur Thorrok', role: 'Conducteur de Chiens de Guerre', weapon: 'Blaster Carbine Instable & Fouet Électrique', weaponId: 'wpn_killer_clan_blaster_carbine', vitalityRatio: 1.25, hp: 670, armor: 65, trophy: 'Biomasque Défiguré aux Glyphes de Banni' },
      { id: 'killer_clan_skirmisher_vrokk', name: 'Tirailleur Vrokk', role: 'Embusqué des Parois Rocheuses', weapon: 'Carbine Blaster Légère & Dagues d’Os Xéno', weaponId: 'wpn_killer_clan_blaster_carbine', vitalityRatio: 1.1, hp: 610, armor: 55, trophy: 'Lame Courbe Forgée dans une Queue de Xéno' },
      { id: 'killer_clan_trapper_drakkh', name: 'Trappeur Drakkh', role: 'Poseur de Pièges Électro-Barbelés', weapon: 'Tromblon Plasma de Rebut & Filet Épineux', weaponId: 'wpn_killer_clan_blaster_carbine', vitalityRatio: 1.0, hp: 560, armor: 50, trophy: 'Maillon de Chaîne en Acier Trempé Caparis' }
    ]
  },
  {
    id: 'squad_pred_turnabout_rangers',
    name: 'Rangers des Rocheuses & Traqueurs de Ray Vance (2008)',
    universe: 'PREDATOR',
    shortName: 'Rangers Rocheuses (3 Traqueurs)',
    category: 'SPECIAL_FORCES',
    scale: 'MOYEN',
    totalMembers: 3,
    originMedia: 'Predator: Turnabout (2008)',
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Crête Forestière des Rocheuses',
    primaryMapId: 'map_pred_rockies_firewatch_ridge',
    weaponLoadout: ['wpn_turnabout_winchester_magnum_338'],
    description: 'Rangers forestiers d’élite guidés par l’ancien tireur d’élite aveugle Ray Vance, utilisant des pièges acoustiques et des carabines .338 Winchester Magnum.',
    tactics: 'Tirs de barrage à longue portée synchronisés sur les échos acoustiques pendant que des trappeurs rabattent la cible vers des fils de déclenchement.',
    totalHonorReward: 5400,
    soloVariantId: 'alien_base_quinn_mckenna_ranger_2018',
    members: [
      { id: 'turnabout_ray_vance', name: 'Ray Vance', role: 'Sniper Aveugle & Maître de l’Écho', weapon: 'Winchester Model 70 .338 Magnum Custom', weaponId: 'wpn_turnabout_winchester_magnum_338', vitalityRatio: 1.3, hp: 680, armor: 45, trophy: 'Corde de Résonance Acoustique en Corde à Piano' },
      { id: 'turnabout_spotter_cole', name: 'Ranger Cole', role: 'Observateur & Baliseur de Faille', weapon: 'Carabine de Chasse .338 & Jumelles Télémétriques', weaponId: 'wpn_turnabout_winchester_magnum_338', vitalityRatio: 1.1, hp: 560, armor: 35, trophy: 'Boussole de Survie des Rocheuses en Cuivre' },
      { id: 'turnabout_trapper_macleod', name: 'Trappeur MacLeod', role: 'Poseur de Pièges en Sous-Bois', weapon: 'Fusil Calibre 12 & Câbles d’Acier Tressés', weaponId: 'wpn_turnabout_winchester_magnum_338', vitalityRatio: 1.15, hp: 600, armor: 40, trophy: 'Insigne de Garde Forestier Fédéral Ébréché' }
    ]
  },
  {
    id: 'squad_pred_western_front_infantry',
    name: 'Section des Tranchées de la Somme — Front Ouest (1916)',
    universe: 'PREDATOR',
    shortName: 'Infanterie Somme 1916 (3 Soldats)',
    category: 'MILITARY_SOLDIERS',
    scale: 'MOYEN',
    totalMembers: 3,
    originMedia: 'Predator: Blood on Two Earths (2001)',
    biomeId: 'los_angeles_1997',
    recommendedBiomeLabel: 'Tranchées Boueuses de la Somme (1916)',
    primaryMapId: 'map_pred_western_front_1916',
    weaponLoadout: ['wpn_ww1_lee_enfield_trench_carbine'],
    description: 'Fantassins britanniques aguerris par des mois de guerre de position, armés de Lee-Enfield No.1 Mk III* et protégés par des masques à gaz face aux tirs rasants.',
    tactics: 'Feu de salve en « Mad Minute » avec baïonnettes fixées, repli sous abri de casemate et tirs de fusées éclairantes pour démasquer le camouflage.',
    totalHonorReward: 5600,
    soloVariantId: 'alien_base_major_dutch_schaefer_1987',
    members: [
      { id: 'ww1_captain_hastings', name: 'Capitaine Arthur Hastings', role: 'Officier de Tranchée', weapon: 'Lee-Enfield Mk III* & Pistolet Webley .455', weaponId: 'wpn_ww1_lee_enfield_trench_carbine', vitalityRatio: 1.25, hp: 650, armor: 40, trophy: 'Montre à Gousset Régimentaire Stoppée par Balle' },
      { id: 'ww1_sniper_sinclair', name: 'Caporal Tireur Sinclair', role: 'Sniper de Parapet', weapon: 'Lee-Enfield avec Lunette Aldis 1916', weaponId: 'wpn_ww1_lee_enfield_trench_carbine', vitalityRatio: 1.05, hp: 540, armor: 30, trophy: 'Périscope de Tranchée en Laiton Battu' },
      { id: 'ww1_bomber_evans', name: 'Grenadier Evans', role: 'Nettoyeur de Boyau', weapon: 'Carabine Courte & Grenades Mills No.5', weaponId: 'wpn_ww1_lee_enfield_trench_carbine', vitalityRatio: 1.2, hp: 620, armor: 50, trophy: 'Casque Brodie en Acier Ciselé par Shrapnel' }
    ]
  },
  {
    id: 'squad_alien_mendel_tech_sec',
    name: 'Équipe de Survie & Sécurité de la Station Mendel (2019)',
    universe: 'ALIEN',
    shortName: 'Sécurité Mendel (3 Survivants)',
    category: 'SECURITY_GUARDS',
    scale: 'MOYEN',
    totalMembers: 3,
    originMedia: 'Alien: Blackout (2019)',
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Station Spatiale Mendel — Conduits Techniques',
    primaryMapId: 'map_alien_mendel_station_ducting',
    weaponLoadout: ['wpn_mendel_security_shock_taser'],
    description: 'Survivants de la station spatiale Mendel menés par Amanda Ripley, opérant dans les conduits et manipulant les sas blindés pour piéger les prédateurs.',
    tactics: 'Verrouillage de portes pneumatiques motorisées, dérivation de circuits haute tension et frappes de taser incapacitantes pour créer des zones de repli étanches.',
    totalHonorReward: 5800,
    soloVariantId: 'alien_base_amanda_ripley_sevastopol_engineer',
    members: [
      { id: 'mendel_amanda_ripley', name: 'Amanda Ripley', role: 'Ingénieur en Chef & Coordinatrice', weapon: 'Seegson P-99 Stun Taser & Détecteur Portatif', weaponId: 'wpn_mendel_security_shock_taser', vitalityRatio: 1.35, hp: 700, armor: 45, trophy: 'Détecteur de Mouvements Portable Hacké de Mendel' },
      { id: 'mendel_guard_vance', name: 'Garde de Sas Thorn', role: 'Sécurité de Confinement', weapon: 'Taser Haute Tension & Matraque Électrique', weaponId: 'wpn_mendel_security_shock_taser', vitalityRatio: 1.15, hp: 580, armor: 50, trophy: 'Clé de Dérivation Magnétique Haute Sécurité' },
      { id: 'mendel_tech_yano', name: 'Technicien Systèmes Yano', role: 'Opérateur Dérivation sas', weapon: 'Outil de Soudure à l’Arc & Taser P-99', weaponId: 'wpn_mendel_security_shock_taser', vitalityRatio: 1.1, hp: 550, armor: 35, trophy: 'Moniteur CRT Portatif de Surveillance Sas' }
    ]
  },
  {
    id: 'squad_alien_leto_darwin_cultists',
    name: 'Zélotes du Culte Darwiniste & Gardes de Leto (2023)',
    universe: 'ALIEN',
    shortName: 'Culte Darwiniste Leto (3 Fanatiques)',
    category: 'CORPORATE_MERCENARIES',
    scale: 'MOYEN',
    totalMembers: 3,
    originMedia: 'Aliens: Dark Descent (2023)',
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Base Pioneer de Leto Sous Protocole Cerberus',
    primaryMapId: 'map_alien_leto_pioneer_station',
    weaponLoadout: ['wpn_dark_descent_sentry_slugger'],
    description: 'Adorateurs fanatiques de l’évolution xénomorphe sur la lune Leto, retranchés derrière des tourelles sentinelles UA 571-C détournées de l’arsenal USCM.',
    tactics: 'Déploiement de tourelles automatiques multitubes en feux croisés, charge fanatique sous neuro-stimulants et déclenchement de protocoles de confinement Cerberus.',
    totalHonorReward: 6200,
    soloVariantId: 'prey_colonial_marine_heavy',
    members: [
      { id: 'leto_hierophant_malor', name: 'Hiérophante Malor', role: 'Apôtre de l’Infestation Darwinienne', weapon: 'Fusil Automatique Lourd & Fiole de Mutagène', weaponId: 'wpn_dark_descent_sentry_slugger', vitalityRatio: 1.4, hp: 740, armor: 60, trophy: 'Crâne de Praetorian Laqué d’Emblèmes Sectaires' },
      { id: 'leto_enforcer_krag', name: 'Zélote de Choc Krag', role: 'Garde du Sanctuaire Bio-Mécanique', weapon: 'Mitrailleuse 10x28mm Caseless & Bouclier Riot', weaponId: 'wpn_dark_descent_sentry_slugger', vitalityRatio: 1.25, hp: 660, armor: 55, trophy: 'Fiole d’Acide Xénomorphe Cristallisé Béni' },
      { id: 'leto_sentry_core_01', name: 'Noyau Sentinelle UA 571-C', role: 'Tourelle Automatique Périmétrique', weapon: 'Double Canon Rotatif Cal. 10x28mm Automatisé', weaponId: 'wpn_dark_descent_sentry_slugger', vitalityRatio: 1.2, hp: 630, armor: 70, trophy: 'Module de Ciblage UA 571-C Surchauffé' }
    ]
  },
  {
    id: 'squad_avp_lv742_ravager_hive',
    name: 'Essaim Muté de LV-742 & Garde Ravager (2003)',
    universe: 'AVP',
    shortName: 'Ravagers LV-742 (3 Monstres)',
    category: 'COLONIAL_MARINES',
    scale: 'MOYEN',
    totalMembers: 3,
    originMedia: 'Aliens versus Predator: Extinction (2003)',
    biomeId: 'bouvetoya_pyramid',
    recommendedBiomeLabel: 'Failles Géothermiques de LV-742',
    primaryMapId: 'map_avp_lv742_subterranean_core',
    weaponLoadout: ['wpn_lv742_sniper_railgun_lance'],
    description: 'Castes de combat colossales génétiquement mutées sur LV-742, dotées de faux chitineuses géantes aux avant-bras tranchant les métaux d’armures.',
    tactics: 'Charge destructrice en tenaille brisant les formations défensives, projection de bave corrosive et couverture lourde par tir perforant à longue portée.',
    totalHonorReward: 6800,
    soloVariantId: 'alien_base_xeno_ravager_elite_guard',
    members: [
      { id: 'lv742_apex_ravager', name: 'Alpha Ravager Colossal', role: 'Béhémoth à Faux Chitineuses', weapon: 'Doubles Lames d’Avant-Bras Géantes Perforantes', weaponId: 'wpn_lv742_sniper_railgun_lance', vitalityRatio: 1.55, hp: 860, armor: 80, trophy: 'Lame d’Avant-Bras Chitineuse de Ravager Géant' },
      { id: 'lv742_flank_scythe', name: 'Ravager Tirailleur', role: 'Éventreur de Blindages Légers', weapon: 'Lames Scythes Tranchantes & Crête Dents de Scie', weaponId: 'wpn_lv742_sniper_railgun_lance', vitalityRatio: 1.3, hp: 700, armor: 65, trophy: 'Plaque Dorsale Mutée en Épines de Silicium' },
      { id: 'lv742_carrier_drone', name: 'Xéno Transporteur Carrier', role: 'Vecteur de Dissémination Facehugger', weapon: 'Tentacules Préhensiles & Poche d’Incubation', weaponId: 'wpn_lv742_sniper_railgun_lance', vitalityRatio: 1.25, hp: 660, armor: 55, trophy: 'Poche d’Incubation Externe de Facehugger' }
    ]
  },
  {
    id: 'squad_avp_bunda_top_knot_clan',
    name: 'Chasseurs d’Élite du Top-Knot Clan — Bunda (1995)',
    universe: 'AVP',
    shortName: 'Top-Knot Clan Bunda (3 Maîtres)',
    category: 'ANCIENT_YAUTJA',
    scale: 'MOYEN',
    totalMembers: 3,
    originMedia: 'Aliens vs. Predator: War (1995)',
    biomeId: 'ryushi_desert',
    recommendedBiomeLabel: 'Plaines Savanières de Bunda (1995)',
    primaryMapId: 'map_avp_bunda_machiko_plains',
    weaponLoadout: ['wpn_bunda_top_knot_heavy_caster'],
    description: 'Chasseurs vétérans du clan Top-Knot déployés sur Bunda aux côtés de Machiko Noguchi avant la scission et la traque fratricide.',
    tactics: 'Tirs de canons d’épaule à double résonateur en cadence alternée, déploiement de smart discs incendiaires et encerclement à la combistick.',
    totalHonorReward: 7000,
    soloVariantId: 'prey_bad_blood_warlord',
    members: [
      { id: 'top_knot_leader_bunda', name: 'Chef de Clan Top-Knot', role: 'Patriarche de la Grande Traque', weapon: 'Canon Plasma Double Bobine & Glaive d’Honneur', weaponId: 'wpn_bunda_top_knot_heavy_caster', vitalityRatio: 1.5, hp: 820, armor: 85, trophy: 'Nœud de Tresse Patriarcale Orné de Griffes de Reine' },
      { id: 'top_knot_enforcer_gann', name: 'Guerrier d’Assaut Gann', role: 'Maître d’Armes Rituelles', weapon: 'Combistick Télescopique & Caster d’Épaule', weaponId: 'wpn_bunda_top_knot_heavy_caster', vitalityRatio: 1.3, hp: 720, armor: 70, trophy: 'Masque à Visière Gravée de Runes Bunda' },
      { id: 'top_knot_stalker_vokh', name: 'Pisteur des Plaines Vokh', role: 'Avant-Garde Rapide de Savane', weapon: 'Disque Intelligent Incendiaire & Lames de Poignet', weaponId: 'wpn_bunda_top_knot_heavy_caster', vitalityRatio: 1.25, hp: 680, armor: 65, trophy: 'Dard de Queue de Vy’drach en Argent Yautja' }
    ]
  },
  {
    id: 'squad_pred_south_china_sea_pirates',
    name: 'Pirates Khmers & Sniper Russe — Mer de Chine (2008)',
    universe: 'PREDATOR',
    shortName: 'Pirates Mer de Chine (3 Membres)',
    category: 'PARAMILITARY',
    scale: 'MOYEN',
    totalMembers: 3,
    originMedia: 'Predator: South China Sea (2008)',
    biomeId: 'jungle',
    recommendedBiomeLabel: 'Forteresse Volcanique & Mangroves (2008)',
    primaryMapId: 'map_pred_south_china_sea_fortress',
    weaponLoadout: ['wpn_south_china_sea_pirate_scattergun'],
    description: 'Contrebandiers khmers lourdement armés de fusils calibre 10 sciés et sniper russe retranché dans le fort volcanique sous la mousson.',
    tactics: 'Embuscades à bout portant dans les mangroves boueuses, tirs de suppression au calibre 10 et couverture à longue distance depuis la tour.',
    totalHonorReward: 6400,
    soloVariantId: 'alien_base_quinn_mckenna_ranger_2018',
    members: [
      { id: 'pirate_captain_sovann', name: 'Capitaine Corsaire Sovann', role: 'Commandant de la Forteresse', weapon: 'Fusil Calibre 10 Double Canon Scié', weaponId: 'wpn_south_china_sea_pirate_scattergun', vitalityRatio: 1.4, hp: 750, armor: 60, trophy: 'Sarbacane d\'Ivoire & Dents de Requin Gravées' },
      { id: 'russian_sniper_nikolai', name: 'Tireur d\'Élite Nikolai', role: 'Tireur d\'Observation de Caldeira', weapon: 'Fusil de Précision à Silencieux & Couteau Spetsnaz', weaponId: 'wpn_south_china_sea_pirate_scattergun', vitalityRatio: 1.3, hp: 690, armor: 55, trophy: 'Insigne des Troupes Aéroportées Russes Ensanglanté' },
      { id: 'khmer_boarder_dara', name: 'Sapeur de Mangrove Dara', role: 'Grenadier d\'Abordage', weapon: 'Grenades Phosphore & Machette de Jungle', weaponId: 'wpn_south_china_sea_pirate_scattergun', vitalityRatio: 1.2, hp: 630, armor: 50, trophy: 'Collier d\'Ambre de la Mer de Chine' }
    ]
  },
  {
    id: 'squad_pred_civil_war_platoon',
    name: 'Section de Tireurs des Ozarks — Guerre de Sécession (1863)',
    universe: 'PREDATOR',
    shortName: 'Peloton des Ozarks (3 Soldats)',
    category: 'HISTORIC_WARRIORS',
    scale: 'MOYEN',
    totalMembers: 3,
    originMedia: 'Predator: Hell Come A-Walkin\' (1998)',
    biomeId: 'los_angeles_1997',
    recommendedBiomeLabel: 'Ravin Encaissé des Ozarks (1863)',
    primaryMapId: 'map_pred_civil_war_ozark_gorge',
    weaponLoadout: ['wpn_civil_war_springfield_1861_musket'],
    description: 'Soldats vétérans confédérés et de l\'Union contraints à une alliance précaire dans un défilé rocheux face au démon invisible.',
    tactics: 'Volées coordonnées de balles Minié, tirs de barrage sous écran de fumée de poudre noire et charges désespérées à la baïonnette.',
    totalHonorReward: 6200,
    soloVariantId: 'alien_base_major_dutch_schaefer_1987',
    members: [
      { id: 'captain_caleb_holmes', name: 'Capitaine Caleb Holmes', role: 'Officier d\'Infanterie de l\'Union', weapon: 'Springfield 1861 & Sabre d\'Officier', weaponId: 'wpn_civil_war_springfield_1861_musket', vitalityRatio: 1.35, hp: 720, armor: 50, trophy: 'Épaulette d\'Officier à Aigle Doré & Sabre de Cavalerie' },
      { id: 'sergeant_jeb_tucker', name: 'Sergent Jeb Tucker', role: 'Tireur d\'Élite Confédéré', weapon: 'Mousquet Rayé à Lunette Longue', weaponId: 'wpn_civil_war_springfield_1861_musket', vitalityRatio: 1.25, hp: 660, armor: 45, trophy: 'Boucle de Ceinturon CS Criblée de Plomb' },
      { id: 'skirmisher_ezra_clark', name: 'Voltigeur Ezra Clark', role: 'Éclaireur de Crête', weapon: 'Fusil Springfield & Baïonnette Triangulaire', weaponId: 'wpn_civil_war_springfield_1861_musket', vitalityRatio: 1.2, hp: 610, armor: 40, trophy: 'Gourde en Cuivre & Corne à Poudre Gravée' }
    ]
  },
  {
    id: 'squad_alien_sevastopol_working_joes',
    name: 'Escouade de Sécurité Synthétique Working Joes — Sevastopol (2014)',
    universe: 'ALIEN',
    shortName: 'Working Joes Apollo (3 Androïdes)',
    category: 'SYNTHETICS',
    scale: 'MOYEN',
    totalMembers: 3,
    originMedia: 'Alien: Isolation (2014)',
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Station Sevastopol — Cœur Apollo (2014)',
    primaryMapId: 'map_alien_sevastopol_apollo_core',
    weaponLoadout: ['wpn_sevastopol_working_joe_stun_prod'],
    description: 'Androïdes industriels Seegson aux yeux ambrés reprogrammés par Apollo pour purger tous les survivants humains et organismes non autorisés.',
    tactics: 'Avance inexorable sans esquive, absorption massive des dégâts physiques et tétanisation continue aux matraques à choc 50kV.',
    totalHonorReward: 6600,
    soloVariantId: 'alien_base_amanda_ripley_sevastopol_engineer',
    members: [
      { id: 'working_joe_chief_apollo', name: 'Unité Directive Apollo 0-Alpha', role: 'Superviseur de Quarantaine', weapon: 'Matraque à Choc Haute Tension & Poigne Hydraulique', weaponId: 'wpn_sevastopol_working_joe_stun_prod', vitalityRatio: 1.5, hp: 800, armor: 75, trophy: 'Puce Mémoire Maîtresse Apollo & Visage Caoutchouc Seegson' },
      { id: 'working_joe_san_cristobal', name: 'Synthétique Médical Réassigné', role: 'Agent de Confinement San Cristobal', weapon: 'Bâton d\'Électrocution & Pince d\'Atelier', weaponId: 'wpn_sevastopol_working_joe_stun_prod', vitalityRatio: 1.35, hp: 710, armor: 70, trophy: 'Module de Vision Synthétique Ambre Seegson' },
      { id: 'working_joe_reactor_guard', name: 'Androïde de Refroidissement Réacteur', role: 'Garde Haute Température', weapon: 'Bâton à Décharge & Isolateurs Céramiques', weaponId: 'wpn_sevastopol_working_joe_stun_prod', vitalityRatio: 1.3, hp: 680, armor: 65, trophy: 'Batterie au Lithium Haute Densité Seegson' }
    ]
  },
  {
    id: 'squad_alien_defiance_strike_team',
    name: 'Équipe d’Intervention USS Europa — Zula Hendricks (2016)',
    universe: 'ALIEN',
    shortName: 'Mutins USS Europa (3 Combattants)',
    category: 'COLONIAL_MARINES',
    scale: 'MOYEN',
    totalMembers: 3,
    originMedia: 'Aliens: Defiance (2016)',
    biomeId: 'hive_lv426',
    recommendedBiomeLabel: 'Destroyer USS Europa — Baie Cargo (2016)',
    primaryMapId: 'map_alien_uss_europa_cargo_bay',
    weaponLoadout: ['wpn_defiance_zula_carbine_rig'],
    description: 'Groupe d\'assaut dissident composé de la marine Zula Hendricks sur harnais médical, de l\'androïde Davis 01 et d\'un artificier lourd.',
    tactics: 'Déploiement en triangle tactique, tirs explosifs chirurgicaux 10x24mm et verrouillage des issues pour piéger la cible.',
    totalHonorReward: 6800,
    soloVariantId: 'prey_colonial_marine_heavy',
    members: [
      { id: 'zula_hendricks_europa', name: 'Caporal Zula Hendricks', role: 'Commandante de Mutinerie', weapon: 'Carabine M57A2 Asservie à l\'Exosquelette Rachidien', weaponId: 'wpn_defiance_zula_carbine_rig', vitalityRatio: 1.45, hp: 770, armor: 70, trophy: 'Plaque d\'Identité Militaire USCM & Stabilisateur Rachidien' },
      { id: 'synthetic_davis_01', name: 'Androïde Tactique Davis 01', role: 'Spécialiste de Combat Autonome', weapon: 'Fusil à Impulsion & Processeur d\'Analyse Balistique', weaponId: 'wpn_defiance_zula_carbine_rig', vitalityRatio: 1.4, hp: 740, armor: 75, trophy: 'Unité Centrale Neural Net Débridée Weyland-Yutani' },
      { id: 'marine_breacher_hollis', name: 'Artificier de Brèche Hollis', role: 'Démolisseur Lourd', weapon: 'Fusil Lourd M57 & Charges Creuses', weaponId: 'wpn_defiance_zula_carbine_rig', vitalityRatio: 1.3, hp: 690, armor: 65, trophy: 'Casque M10 avec Optique Tactique Fendue' }
    ]
  },
  {
    id: 'squad_avp_pirate_booty_raiders',
    name: 'Pillards de la Frégate Pirate — Baie de la Reine (1996)',
    universe: 'AVP',
    shortName: 'Pillards Frégate Pirate (3 Pirates)',
    category: 'PARAMILITARY',
    scale: 'MOYEN',
    totalMembers: 3,
    originMedia: 'Aliens vs. Predator: Booty (1996)',
    biomeId: 'stargazer_blacksite',
    recommendedBiomeLabel: 'Frégate Pirate de l\'Espace (1996)',
    primaryMapId: 'map_avp_pirate_booty_cargo_dock',
    weaponLoadout: ['wpn_booty_pirate_pneumatic_nailer'],
    description: 'Équipage de contrebandiers et ferrailleurs de l\'espace armés de riveteuses pneumatiques lourdes défendant leur butin xénomorphe.',
    tactics: 'Pilonnage à cadence élevée de pieux pneumatiques perforants, dispersion dans les conteneurs et tirs croisés depuis les ponts supérieurs.',
    totalHonorReward: 6500,
    soloVariantId: 'prey_xeno_praetorian_royal',
    members: [
      { id: 'smuggler_captain_rexx', name: 'Capitaine Contrebandier Rexx', role: 'Maître du Cargo Pirate', weapon: 'Pistolet à Clous Pneumatique 200 Bars & Trancheur', weaponId: 'wpn_booty_pirate_pneumatic_nailer', vitalityRatio: 1.4, hp: 740, armor: 60, trophy: 'Boussole Stellaire Bricolée & Clé de Sas Gravée' },
      { id: 'dock_engineer_brutus', name: 'Chef Mécanicien Brutus', role: 'Opérateur de Grue & Piqueur', weapon: 'Riveteuse Industrielle Lourde & Marteau Magnétique', weaponId: 'wpn_booty_pirate_pneumatic_nailer', vitalityRatio: 1.35, hp: 720, armor: 65, trophy: 'Manomètre Hydraulique Haute Pression en Laiton' },
      { id: 'scavenger_scout_kiki', name: 'Pilleuse de Sas Kiki', role: 'Tireuse Rapide de Conteneurs', weapon: 'Pistolet Pneumatique Léger & Harpon Court', weaponId: 'wpn_booty_pirate_pneumatic_nailer', vitalityRatio: 1.25, hp: 640, armor: 50, trophy: 'Visière d\'Atelier Spatiale Teintée d\'Or' }
    ]
  },
  {
    id: 'squad_avp_tokyo_yakuza_clan',
    name: 'Syndicat Cyber-Yakuza Mishima — Néo-Tokyo (1999)',
    universe: 'AVP',
    shortName: 'Cyber-Yakuza Néo-Tokyo (3 Sabereurs)',
    category: 'PARAMILITARY',
    scale: 'MOYEN',
    totalMembers: 3,
    originMedia: 'Aliens vs. Predator: Tokyo (1999)',
    biomeId: 'los_angeles_1997',
    recommendedBiomeLabel: 'Néo-Tokyo Shinjuku (1999)',
    primaryMapId: 'map_avp_tokyo_shinjuku_skyrise',
    weaponLoadout: ['wpn_tokyo_cyber_yakuza_katana'],
    description: 'Maîtres d\'escrime cybernétisés du syndicat Mishima affrontant prédateurs et xénomorphes au sabre haute fréquence sur les toits pluvieux.',
    tactics: 'Esquives ultra-rapides sur passerelles de verre, enchaînements d\'estocs moléculaires et déflexion réflexe des projectiles.',
    totalHonorReward: 7100,
    soloVariantId: 'prey_bad_blood_warlord',
    members: [
      { id: 'yakuza_oyabun_mishima', name: 'Oyabun Kazuo Mishima', role: 'Grand Maître du Sabre Moléculaire', weapon: 'Katana Haute Fréquence 35kHz & Bras Cybernétique', weaponId: 'wpn_tokyo_cyber_yakuza_katana', vitalityRatio: 1.55, hp: 830, armor: 80, trophy: 'Tsuba Gravée du Dragon d\'Or & Prothèse de Poignet Titane' },
      { id: 'wakagashira_ren', name: 'Lieutenant Ren Murata', role: 'Duelliste de Passerelle Aérienne', weapon: 'Wakizashi Vibratoire & Pistolet 9mm Téflon', weaponId: 'wpn_tokyo_cyber_yakuza_katana', vitalityRatio: 1.35, hp: 710, armor: 65, trophy: 'Veste de Soie Tatouée d\'un Démon Oni Ensanglanté' },
      { id: 'cyber_enforcer_goro', name: 'Exécuteur Blindé Goro', role: 'Garde du Corps Augmenté', weapon: 'Nodachi Lourd Haute Fréquence & Plaque Sous-Cutanée', weaponId: 'wpn_tokyo_cyber_yakuza_katana', vitalityRatio: 1.4, hp: 760, armor: 75, trophy: 'Plaque Crânienne Cybernétique Chromée' }
    ]
  },
  {
    "id": "squad_pred_fleener_creek_posse",
    "name": "Posse de Fleener Creek — Shérif Enoch Powell (1996)",
    "universe": "PREDATOR",
    "shortName": "Posse Fleener Creek (3 Chasseurs)",
    "category": "PARAMILITARY",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Predator: Kindred (1996)",
    "biomeId": "jungle",
    "recommendedBiomeLabel": "Fleener Creek Oregon (1996)",
    "primaryMapId": "map_pred_fleener_creek_valley",
    "weaponLoadout": [
      "wpn_fleener_creek_remington_1100"
    ],
    "description": "Milice de montagne et shérif chevronné traquant un fugitif sadique dans les forêts de l'Oregon aux côtés d'un Yautja d'honneur.",
    "tactics": "Embuscades en lisière de bois, tirs de chevrotine croisés et pièges à loups dissimulés sous les fougères.",
    "totalHonorReward": 6400,
    "soloVariantId": "prey_bad_blood_warlord",
    "members": [
      {
        "id": "sheriff_enoch_powell",
        "name": "Shérif Enoch Powell",
        "role": "Vétéran Traqueur & Homme de Loi",
        "weapon": "Remington 1100 Tactical Calibre 12 & Étoile en Argent",
        "weaponId": "wpn_fleener_creek_remington_1100",
        "vitalityRatio": 1.45,
        "hp": 760,
        "armor": 60,
        "trophy": "Insigne Étoilé de Shérif Gravé & Cartouchière Cuir"
      },
      {
        "id": "deputy_hank_miller",
        "name": "Adjoint Hank Miller",
        "role": "Tireur d'Appui Forestier",
        "weapon": "Remington 1100 Calibre 12 & Projecteur Portatif",
        "weaponId": "wpn_fleener_creek_remington_1100",
        "vitalityRatio": 1.3,
        "hp": 680,
        "armor": 50,
        "trophy": "Ceinturon de Police Renforcé & Menottes Acier"
      },
      {
        "id": "trapper_clint_bowers",
        "name": "Trappeur Clint Bowers",
        "role": "Pisteur des Pentes Rocheuses",
        "weapon": "Carabine de Chasse & Hachette de Bûcheron",
        "weaponId": "wpn_fleener_creek_remington_1100",
        "vitalityRatio": 1.35,
        "hp": 700,
        "armor": 55,
        "trophy": "Piège à Ours Antique en Acier Forgé"
      }
    ]
  },
  {
    "id": "squad_pred_demons_gold_expedition",
    "name": "Expédition Trésor Nazi — Marais d'Amérique du Sud (1997)",
    "universe": "PREDATOR",
    "shortName": "Pillards Trésor Nazi (3 Mercenaires)",
    "category": "MILITARY_COMMANDO",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Predator: Demon's Gold (1997)",
    "biomeId": "jungle",
    "recommendedBiomeLabel": "Marais Amazonien Trésor Maudit (1997)",
    "primaryMapId": "map_pred_demons_gold_swamp",
    "weaponLoadout": [
      "wpn_demons_gold_mp40_smg"
    ],
    "description": "Officiers fuyards et mercenaires alourdis de lingots d'or pillés, traqués dans les marécages fangeux par un prédateur impitoyable.",
    "tactics": "Tirs de barrage fébriles en éventail, panique dans les bourbiers et regroupement défensif autour des caisses d'or.",
    "totalHonorReward": 6300,
    "soloVariantId": "prey_jungle_hunter_1987",
    "members": [
      {
        "id": "oberst_klaus_von_stein",
        "name": "Oberst Klaus von Stein",
        "role": "Commandant de l'Escorte du Trésor",
        "weapon": "MP 40 Parabellum Chromé & Dague d'Officier",
        "weaponId": "wpn_demons_gold_mp40_smg",
        "vitalityRatio": 1.4,
        "hp": 730,
        "armor": 65,
        "trophy": "Dague de Parade Gravée & Coffre de Lingots d'Or"
      },
      {
        "id": "unteroffizier_gunther",
        "name": "Unteroffizier Günther Bahr",
        "role": "Fusilier de Flanc Fangeux",
        "weapon": "MP 40 9mm & Grenade à Manche Stielhandgranate",
        "weaponId": "wpn_demons_gold_mp40_smg",
        "vitalityRatio": 1.3,
        "hp": 690,
        "armor": 60,
        "trophy": "Casque d'Acier Camouflé Boue & Plaque d'Identité"
      },
      {
        "id": "jungle_guide_esteban",
        "name": "Pisteur Mercenaire Esteban",
        "role": "Éclaireur Maraîcher",
        "weapon": "Machette Lourde & Pistolet Luger P08",
        "weaponId": "wpn_demons_gold_mp40_smg",
        "vitalityRatio": 1.25,
        "hp": 650,
        "armor": 45,
        "trophy": "Boussole Militaire Cuirassée en Laiton Émeraude"
      }
    ]
  },
  {
    "id": "squad_alien_female_war_strike_team",
    "name": "Force d'Assaut Terre & Ruche Mère — Wilks & Billie (1990)",
    "universe": "ALIEN",
    "shortName": "Assaut Ruche Mère (3 Vétérans)",
    "category": "PARAMILITARY",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens: The Female War (1990)",
    "biomeId": "hive_lv426",
    "recommendedBiomeLabel": "Flèche de la Reine Mère (1990)",
    "primaryMapId": "map_alien_hiveworld_spire",
    "weaponLoadout": [
      "wpn_female_war_heavy_incinerator"
    ],
    "description": "Escouade de vétérans endurcis menée par Billie et Wilks s'enfonçant dans la mégastructure résineuse pour capturer la souveraine de l'essaim.",
    "tactics": "Mur de flammes continu pour brûler les ouvrières, tirs de couverture lourds et progression en formation triangle impénétrable.",
    "totalHonorReward": 7500,
    "soloVariantId": "prey_xeno_warrior",
    "members": [
      {
        "id": "veteran_wilks",
        "name": "Caporal Wilks",
        "role": "Vétéran Défiguré de l'Assaut",
        "weapon": "Lance-Flammes Lourd M240-B & Fusil à Impulsion",
        "weaponId": "wpn_female_war_heavy_incinerator",
        "vitalityRatio": 1.5,
        "hp": 820,
        "armor": 80,
        "trophy": "Masque Chirurgical Défiguré & Balise de Téléguidage"
      },
      {
        "id": "survivor_billie",
        "name": "Billie la Survivante",
        "role": "Spécialiste Ruche & Soutien Psychique",
        "weapon": "Lance-Flammes Portatif & Pistolet Calibre Lourd",
        "weaponId": "wpn_female_war_heavy_incinerator",
        "vitalityRatio": 1.35,
        "hp": 710,
        "armor": 60,
        "trophy": "Médaillon Familial Calciné d'Acheron LV-426"
      },
      {
        "id": "sergeant_blake",
        "name": "Sergent Mitch Blake",
        "role": "Sapeur de Brèche Incendiaire",
        "weapon": "Double Cuve Napalm M240-B & Cartouches Phosphore",
        "weaponId": "wpn_female_war_heavy_incinerator",
        "vitalityRatio": 1.45,
        "hp": 780,
        "armor": 75,
        "trophy": "Détendeur Haute Pression en Titane Brûlé"
      }
    ]
  },
  {
    "id": "squad_alien_nightmare_asylum_battalion",
    "name": "Bataillon Xéno-Dressé du Général Spears (1989)",
    "universe": "ALIEN",
    "shortName": "Bataillon Spears (3 Troupiers)",
    "category": "MILITARY_COMMANDO",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens: Nightmare Asylum (1989)",
    "biomeId": "stargazer_blacksite",
    "recommendedBiomeLabel": "Station Outpost Spears (1989)",
    "primaryMapId": "map_alien_nightmare_outpost",
    "weaponLoadout": [
      "wpn_nightmare_spears_tactical_carbine"
    ],
    "description": "Légion d'élite du Général Spears équipée de carabines subsoniques et d'électrodes de contrôle neural pour commander des xénomorphes asservis.",
    "tactics": "Tirs de précision subsoniques coordonnés, lâchers de créatures conditionnées et verrous de sas électroniques.",
    "totalHonorReward": 7200,
    "soloVariantId": "prey_xeno_praetorian_royal",
    "members": [
      {
        "id": "general_spears",
        "name": "Général Spears",
        "role": "Commandant Mégalomane de l'Avant-Poste",
        "weapon": "Carabine Subsonique Spears & Télécommande Neurale",
        "weaponId": "wpn_nightmare_spears_tactical_carbine",
        "vitalityRatio": 1.55,
        "hp": 850,
        "armor": 85,
        "trophy": "Bâton de Commandement Électro-Synaptique en Platine"
      },
      {
        "id": "shock_trooper_vance",
        "name": "Capitaine Vance",
        "role": "Instructeur de la Meute Xéno",
        "weapon": "Carabine Subsonique Perforante & Taser Haute Tension",
        "weaponId": "wpn_nightmare_spears_tactical_carbine",
        "vitalityRatio": 1.4,
        "hp": 750,
        "armor": 70,
        "trophy": "Émetteur d'Ondes Synaptiques Portatif Weyland"
      },
      {
        "id": "bio_engineer_dr_curtis",
        "name": "Dr. Curtis",
        "role": "Chirurgien d'Implants Crâniens",
        "weapon": "Pistolet Injecteur Pneumatique & Scalpel Vibro",
        "weaponId": "wpn_nightmare_spears_tactical_carbine",
        "vitalityRatio": 1.3,
        "hp": 670,
        "armor": 55,
        "trophy": "Électrode Neurale Xénomorphe en Céramique Dorée"
      }
    ]
  },
  {
    "id": "squad_avp_requiem_wolf_cleanup",
    "name": "Équipe de Nettoyage & Survie de Gunnison — Shérif Morales (2007)",
    "universe": "AVP",
    "shortName": "Survie Gunnison (3 Résistants)",
    "category": "PARAMILITARY",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens vs. Predator: Requiem (2007)",
    "biomeId": "gunnison_outbreak",
    "recommendedBiomeLabel": "Cimetière & Ville de Gunnison (2007)",
    "primaryMapId": "map_avp_gunnison_cemetery_rain",
    "weaponLoadout": [
      "wpn_requiem_morales_benelli_m4"
    ],
    "description": "Survivants armés et shérif de Gunnison luttant désespérément pour leur survie au milieu du duel titanesque entre Wolf et le Predalien.",
    "tactics": "Tirs de barrage au fusil de combat calibre 12, repli stratégique vers l'armurerie et tirs de fusées éclairantes.",
    "totalHonorReward": 6700,
    "soloVariantId": "prey_predalien_abomination",
    "members": [
      {
        "id": "sheriff_eddie_morales",
        "name": "Shérif Eddie Morales",
        "role": "Commandant des Opérations de Survie",
        "weapon": "Benelli M4 Super 90 Magnum & Radio Tactique",
        "weaponId": "wpn_requiem_morales_benelli_m4",
        "vitalityRatio": 1.45,
        "hp": 770,
        "armor": 65,
        "trophy": "Insigne de Shérif du Comté de Gunnison Maculé d'Acide"
      },
      {
        "id": "dallas_howard",
        "name": "Dallas Howard",
        "role": "Protecteur Civil Endurci",
        "weapon": "Fusil Calibre 12 Tactique & Pistolet 9mm",
        "weaponId": "wpn_requiem_morales_benelli_m4",
        "vitalityRatio": 1.35,
        "hp": 720,
        "armor": 55,
        "trophy": "Clés de l'Armurerie Municipale de Gunnison"
      },
      {
        "id": "ricky_howard",
        "name": "Ricky Howard",
        "role": "Tireur Éclaireur Mobile",
        "weapon": "Carabine Sportive & Projecteur Halogène",
        "weaponId": "wpn_requiem_morales_benelli_m4",
        "vitalityRatio": 1.25,
        "hp": 640,
        "armor": 45,
        "trophy": "Lunette de Tir Balistique Tout-Temps Antibuée"
      }
    ]
  },
  {
    "id": "squad_avp_xenogenesis_strike_cadre",
    "name": "Cadre Tactique Anti-Ruche Sous-Marine — Xénogenèse (2002)",
    "universe": "AVP",
    "shortName": "Cadre Xénogenèse (3 Scaphandriers)",
    "category": "PARAMILITARY",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens vs. Predator: Xenogenesis (2002)",
    "biomeId": "genna_deathworld",
    "recommendedBiomeLabel": "Fosse Abyssale Hydrothermale (2002)",
    "primaryMapId": "map_avp_xenogenesis_suboceanic_trench",
    "weaponLoadout": [
      "wpn_xenogenesis_hyperbaric_harpoon_gun"
    ],
    "description": "Plongeurs de combat en scaphandre lourd hyperbare affrontant traqueurs Yautja aquatiques et xénomorphes hydrodynamiques dans les fosses.",
    "tactics": "Tirs de fléchettes supercavitantes perforantes, utilisation de balises sonores étourdissantes et ancrage magnétique aux parois basaltiques.",
    "totalHonorReward": 7300,
    "soloVariantId": "prey_xeno_sea_swimmer",
    "members": [
      {
        "id": "deep_diver_captain_tate",
        "name": "Commandant de Plongée Tate",
        "role": "Pilote de Scaphandre Titane 1000 Bars",
        "weapon": "Fusil Harpon Supercavitant Lourd & Électrodes",
        "weaponId": "wpn_xenogenesis_hyperbaric_harpoon_gun",
        "vitalityRatio": 1.5,
        "hp": 810,
        "armor": 90,
        "trophy": "Hublot de Casque Hyperbare en Quartz Blindé"
      },
      {
        "id": "spear_diver_milos",
        "name": "Plongeur Harponneur Milos",
        "role": "Chasseur de Ruche Sous-Marine",
        "weapon": "Double Harpon Pneumatique Supercavitant",
        "weaponId": "wpn_xenogenesis_hyperbaric_harpoon_gun",
        "vitalityRatio": 1.35,
        "hp": 730,
        "armor": 80,
        "trophy": "Profondimètre Sous-Marin Numérique Étanche"
      },
      {
        "id": "trench_technician_lyra",
        "name": "Ingénieure de Fosse Lyra",
        "role": "Opératrice Sonar & Balises de Choc",
        "weapon": "Propulseur Sous-Marin & Fusil Harpon Court",
        "weaponId": "wpn_xenogenesis_hyperbaric_harpoon_gun",
        "vitalityRatio": 1.3,
        "hp": 690,
        "armor": 70,
        "trophy": "Transducteur Sonar Piézoélectrique Abyssal"
      }
    ]
  }
,
  {
    "id": "squad_pred_dark_ages_knights",
    "name": "Ordre des Chevaliers Templiers — Forteresse Féodale (1348)",
    "universe": "PREDATOR",
    "shortName": "Chevaliers Templiers (3 Paladins)",
    "category": "PARAMILITARY",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Predator: Dark Ages (1348)",
    "biomeId": "bouvetoya_pyramid",
    "recommendedBiomeLabel": "Château Fort d'Angleterre (1348)",
    "primaryMapId": "map_pred_dark_ages_castle",
    "weaponLoadout": [
      "wpn_dark_ages_damascus_broadsword"
    ],
    "description": "Ordre militaire de chevaliers templiers lourdement cuirassés d'acier affrontant le démon invisible au cœur de leur forteresse anglaise.",
    "tactics": "Formation défensive en mur de boucliers, frappes lourdes d'estoc au broadsword et jets d'huile enflammée depuis les créneaux.",
    "totalHonorReward": 6600,
    "soloVariantId": "prey_bad_blood_warlord",
    "members": [
      {
        "id": "knight_commander_richard",
        "name": "Commandeur Richard de Neville",
        "role": "Grand Maître Templier de la Garnison",
        "weapon": "Épée Bâtarde en Acier de Damas & Bouclier Pavois",
        "weaponId": "wpn_dark_ages_damascus_broadsword",
        "vitalityRatio": 1.5,
        "hp": 800,
        "armor": 85,
        "trophy": "Croix Pectorale Templière en Or & Cotte de Mailles Forgée"
      },
      {
        "id": "templar_sergeant_guillaume",
        "name": "Frère Guillaume le Preux",
        "role": "Duelliste de Donjon en Armure de Plates",
        "weapon": "Épée Lourde à Deux Mains & Dague Miséricorde",
        "weaponId": "wpn_dark_ages_damascus_broadsword",
        "vitalityRatio": 1.4,
        "hp": 740,
        "armor": 75,
        "trophy": "Gantelet d'Acier Damassé Gravé de Psaumes"
      },
      {
        "id": "crossbowman_edward",
        "name": "Arbalétrier Edward de Kent",
        "role": "Tireur d'Élite des Meurtrières",
        "weapon": "Arbalète Lourde en Fer & Flèches d'Acier Trempé",
        "weaponId": "wpn_dark_ages_damascus_broadsword",
        "vitalityRatio": 1.3,
        "hp": 680,
        "armor": 60,
        "trophy": "Carquois de Cuir Bouilli & Treuil d'Arbalète Mécanique"
      }
    ]
  },
  {
    "id": "squad_pred_siberia_spetsnaz_alpha",
    "name": "Détachement Spetsnaz Alpha de Sibérie — Major Voronin (1991)",
    "universe": "PREDATOR",
    "shortName": "Spetsnaz Sibérie (3 Commandos)",
    "category": "MILITARY_COMMANDO",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Predator: Cold War - Siberia (1991)",
    "biomeId": "bouvetoya_pyramid",
    "recommendedBiomeLabel": "Base Hivernale Sibérie (1991)",
    "primaryMapId": "map_pred_siberian_tundra_outpost",
    "weaponLoadout": [
      "wpn_siberia_ak47_spetsnaz_carbine"
    ],
    "description": "Détachement de parachutistes Spetsnaz soviétiques aguerris traquant le prédateur dans le blizzard et la toundra glaciale sibérienne.",
    "tactics": "Tirs croisés sous silencieux dans le brouillard de neige, poses de mines antipersonnel et embuscades thermiques en camouflage blanc.",
    "totalHonorReward": 6800,
    "soloVariantId": "prey_jungle_hunter_1987",
    "members": [
      {
        "id": "major_voronin",
        "name": "Major Youri Voronin",
        "role": "Commandant des Forces Spéciales Alpha",
        "weapon": "AK-47 Spetsnaz Silencieuse & Couteau de Survie NR-40",
        "weaponId": "wpn_siberia_ak47_spetsnaz_carbine",
        "vitalityRatio": 1.45,
        "hp": 780,
        "armor": 70,
        "trophy": "Casque d'Assaut Blindé TIG K6-3 & Veste Camouflage Sibérie"
      },
      {
        "id": "sergeant_pavel_morozov",
        "name": "Sergent Pavel Morozov",
        "role": "Fusilier Lourd de Soutien Polaire",
        "weapon": "AK-47 Sub-Zéro & Grenades F1 Quadruples",
        "weaponId": "wpn_siberia_ak47_spetsnaz_carbine",
        "vitalityRatio": 1.35,
        "hp": 720,
        "armor": 65,
        "trophy": "Lunette Thermique Soviétique 1PN58 & Brelage Tactique"
      },
      {
        "id": "scout_dmitri_volkov",
        "name": "Pisteur Dmitri Volkov",
        "role": "Éclaireur des Conifères Givrés",
        "weapon": "Carabine Silencieuse & Fusées de Détresse Arctique",
        "weaponId": "wpn_siberia_ak47_spetsnaz_carbine",
        "vitalityRatio": 1.3,
        "hp": 670,
        "armor": 55,
        "trophy": "Raquettes de Neige Militaires en Titane & Boussole Polaire"
      }
    ]
  },
  {
    "id": "squad_alien_earth_war_salvage",
    "name": "Brigade de Récupération Terrestre — Général Tegler (1990)",
    "universe": "ALIEN",
    "shortName": "Brigade Terre Dévastée (3 Vétérans)",
    "category": "PARAMILITARY",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens: Earth War (1990)",
    "biomeId": "hive_lv426",
    "recommendedBiomeLabel": "Ruines de Paris Infesté (1990)",
    "primaryMapId": "map_alien_earth_ruins_paris",
    "weaponLoadout": [
      "wpn_earth_war_heavy_plasma_rifle"
    ],
    "description": "Unité de récupération d'élite déployée dans les ruines irradiées de la Terre pour endiguer l'expansion des ruches mégapolitaines.",
    "tactics": "Frappes massives au plasma lourd pour dissoudre les grappes résineuses, tirs de suppression soutenus et couverture mutuelle en milieu toxique.",
    "totalHonorReward": 7600,
    "soloVariantId": "prey_xeno_warrior",
    "members": [
      {
        "id": "general_tegler",
        "name": "Général Marcus Tegler",
        "role": "Commandant de la Reconquête Terrestre",
        "weapon": "Fusil à Plasma Lourd Armat M90 & Pistolet Blindé",
        "weaponId": "wpn_earth_war_heavy_plasma_rifle",
        "vitalityRatio": 1.55,
        "hp": 860,
        "armor": 85,
        "trophy": "Plastron Militaire Irradié Gravé de l'Aigle USCM Terrestre"
      },
      {
        "id": "plasma_gunner_renee",
        "name": "Canonnier Renée Laroche",
        "role": "Opératrice de Décharge Plasmique Lourde",
        "weapon": "Fusil Plasma Armat M90 & Générateur Dorsal 40MW",
        "weaponId": "wpn_earth_war_heavy_plasma_rifle",
        "vitalityRatio": 1.4,
        "hp": 760,
        "armor": 75,
        "trophy": "Condensateur de Décharge Magnétique en Alliage Cuivré"
      },
      {
        "id": "sapper_korolyov",
        "name": "Sapeur Anton Korolyov",
        "role": "Démineur de Ruches Urbaines",
        "weapon": "Fusil Plasma Compact & Charges Creuses Anti-Nid",
        "weaponId": "wpn_earth_war_heavy_plasma_rifle",
        "vitalityRatio": 1.35,
        "hp": 710,
        "armor": 65,
        "trophy": "Masque à Gaz NBC Anti-Retombées Radioactives Renforcé"
      }
    ]
  },
  {
    "id": "squad_alien_thaw_drilling_crew",
    "name": "Équipe de Forage Cryogénique Weyland — Lune LV-695 (2023)",
    "universe": "ALIEN",
    "shortName": "Forage Cryo LV-695 (3 Ingénieurs)",
    "category": "PARAMILITARY",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Alien: Thaw (2023)",
    "biomeId": "stargazer_blacksite",
    "recommendedBiomeLabel": "Calotte Glaciaire LV-695 (2023)",
    "primaryMapId": "map_alien_lv695_cryo_drilling_rig",
    "weaponLoadout": [
      "wpn_thaw_cryo_thermal_lance"
    ],
    "description": "Équipe d'ingénierie et de forage Weyland armée de lances thermiques de brèche pour contrer le réveil d'un nid préhistorique sous la calotte polaire.",
    "tactics": "Jets de fusion thermique concentrés, barrages de givre sous azote liquide et verrouillage systématique des sas pressurisés.",
    "totalHonorReward": 7100,
    "soloVariantId": "prey_xeno_praetorian_royal",
    "members": [
      {
        "id": "chief_engineer_kane_ross",
        "name": "Ingénieur en Chef Kane Ross",
        "role": "Superviseur du Puits de Forage Profond",
        "weapon": "Lance Thermique LV-695 & Découpeur Plasma",
        "weaponId": "wpn_thaw_cryo_thermal_lance",
        "vitalityRatio": 1.45,
        "hp": 770,
        "armor": 75,
        "trophy": "Casque Pressurisé de Forage Glaciaire à Visière Dorée"
      },
      {
        "id": "driller_mac_mcallister",
        "name": "Foreur Mac McAllister",
        "role": "Opérateur de Trépan Lourd",
        "weapon": "Lance Thermique Haute Pression & Marteau Pneumatique",
        "weaponId": "wpn_thaw_cryo_thermal_lance",
        "vitalityRatio": 1.4,
        "hp": 740,
        "armor": 70,
        "trophy": "Trépan de Forage Diamanté Maculé de Résine Xéno"
      },
      {
        "id": "cryo_tech_yuki",
        "name": "Technicienne Cryogénique Yuki Sato",
        "role": "Spécialiste Injection d'Azote Liquide",
        "weapon": "Lanceur d'Azote Cryogénique & Pistolet Riveteur",
        "weaponId": "wpn_thaw_cryo_thermal_lance",
        "vitalityRatio": 1.3,
        "hp": 660,
        "armor": 60,
        "trophy": "Manomètre Cryogénique Haute Précision Weyland-Yutani"
      }
    ]
  },
  {
    "id": "squad_avp_lv1201_weyland_iron_guard",
    "name": "Garde de Fer Weyland-Yutani du Pod 5 — LV-1201 (2001)",
    "universe": "AVP",
    "shortName": "Garde de Fer Pod 5 (3 Mercenaires)",
    "category": "PARAMILITARY",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens versus Predator 2 (2001)",
    "biomeId": "genna_deathworld",
    "recommendedBiomeLabel": "Modules Suspendus Pod 5 (2001)",
    "primaryMapId": "map_avp_lv1201_forward_pods",
    "weaponLoadout": [
      "wpn_lv1201_grenade_launcher_m79"
    ],
    "description": "Garde prétorienne lourdement équipée défendant le laboratoire d'armement bio-technologique Weyland suspendu au-dessus des gouffres de LV-1201.",
    "tactics": "Pilonnage de grenades explosives 40mm sur les passerelles suspendues, verrous électroniques de sas et tirs de suppression au-dessus du vide.",
    "totalHonorReward": 7400,
    "soloVariantId": "prey_weyland_combat_android",
    "members": [
      {
        "id": "captain_dmitri_rykov",
        "name": "Général Vassili Rykov",
        "role": "Commandant de la Sécurité de LV-1201",
        "weapon": "Lance-Grenades M79-A2 & Fusil de Combat Weyland",
        "weaponId": "wpn_lv1201_grenade_launcher_m79",
        "vitalityRatio": 1.5,
        "hp": 830,
        "armor": 85,
        "trophy": "Exosquelette de Combat Partiel Rykov & Médaille d'Honneur"
      },
      {
        "id": "grenadier_vogel",
        "name": "Caporal Kurt Vogel",
        "role": "Artilleur de Passerelle Suspendue",
        "weapon": "Lance-Grenades Rotatif 40mm & Grenades Phosphore",
        "weaponId": "wpn_lv1201_grenade_launcher_m79",
        "vitalityRatio": 1.4,
        "hp": 750,
        "armor": 70,
        "trophy": "Barillet Rotatif M79 Chromé & Ceinture de Grenades"
      },
      {
        "id": "security_trooper_dunn",
        "name": "Garde d'Élite Frank Dunn",
        "role": "Tireur d'Appui du Pod d'Observation",
        "weapon": "Fusil d'Assaut à Grenades & Bouclier Déployable",
        "weaponId": "wpn_lv1201_grenade_launcher_m79",
        "vitalityRatio": 1.35,
        "hp": 700,
        "armor": 65,
        "trophy": "Badge d'Accès Sécurisé Niveau 5 Laboratoire LV-1201"
      }
    ]
  },
  {
    "id": "squad_avp_chokehold_containment_unit",
    "name": "Unité de Confinement de Fret Lourd — Station Chokehold (2004)",
    "universe": "AVP",
    "shortName": "Confinement Chokehold (3 Gardes)",
    "category": "PARAMILITARY",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens vs. Predator: Chokehold (2004)",
    "biomeId": "stargazer_blacksite",
    "recommendedBiomeLabel": "Station Orbitale Chokehold (2004)",
    "primaryMapId": "map_avp_chokehold_cargo_terminal",
    "weaponLoadout": [
      "wpn_chokehold_tactical_riot_shotgun"
    ],
    "description": "Unité de sécurité pénitentiaire chargée de contenir les émeutes et les contaminations biologiques dans les soutes étanches de la station Chokehold.",
    "tactics": "Tirs de barrage de calibre 10 en couloirs étroits, encerclement tactique entre les conteneurs et déploiement de gaz neutralisant.",
    "totalHonorReward": 6900,
    "soloVariantId": "prey_super_predator_berserker",
    "members": [
      {
        "id": "warden_kruger",
        "name": "Directeur Kruger",
        "role": "Maître de Quarantaine de la Station",
        "weapon": "Fusil à Pompe Calibre 10 Chokehold & Matraque IEM",
        "weaponId": "wpn_chokehold_tactical_riot_shotgun",
        "vitalityRatio": 1.45,
        "hp": 770,
        "armor": 75,
        "trophy": "Passe-Partout Magnétique Pénitentiaire en Titane Brossé"
      },
      {
        "id": "riot_officer_sanchez",
        "name": "Officier Carlos Sanchez",
        "role": "Bouclier de Brèche de Soute",
        "weapon": "Fusil Calibre 10 Lourd & Bouclier Plexiglas Renforcé",
        "weaponId": "wpn_chokehold_tactical_riot_shotgun",
        "vitalityRatio": 1.35,
        "hp": 720,
        "armor": 70,
        "trophy": "Visière d'Intervention Anti-Émeute Renforcée Polycarbonate"
      },
      {
        "id": "cargo_guard_chen",
        "name": "Garde de Fret Li Chen",
        "role": "Tireur Rapide de Coursive",
        "weapon": "Fusil à Pompe Compact & Menottes Magnétiques",
        "weaponId": "wpn_chokehold_tactical_riot_shotgun",
        "vitalityRatio": 1.3,
        "hp": 670,
        "armor": 60,
        "trophy": "Sifflet de Décompression d'Urgence en Laiton d'Atelier"
      }
    ]
  },
  {
    "id": "squad_pred_norwegian_deep_divers",
    "name": "Scaphandriers d'Élite des Grands Fonds — Mer de Norvège (1997)",
    "universe": "PREDATOR",
    "shortName": "Scaphandriers Norvège (3 Plongeurs)",
    "category": "PARAMILITARY",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Predator: Hell & Hot Water (1997)",
    "biomeId": "bouvetoya_pyramid",
    "recommendedBiomeLabel": "Fosse Abyssale Mer de Norvège (1997)",
    "primaryMapId": "map_pred_norwegian_abyssal_rig",
    "weaponLoadout": [
      "wpn_norwegian_deep_sub_diver_harpoon"
    ],
    "description": "Équipe d'intervention sous-marine en scaphandres pressurisés en titane affrontant le prédateur aquatique dans les ténèbres des fosses norvégiennes.",
    "tactics": "Tirs de harpons lourds sous pression, utilisation de projecteurs à haute intensité et verrouillage des sas de forage contre les infiltrations sous-marines.",
    "totalHonorReward": 7000,
    "soloVariantId": "prey_bad_blood_warlord",
    "members": [
      {
        "id": "diver_chief_halvorsen",
        "name": "Capitaine Erik Halvorsen",
        "role": "Maître Plongeur Hyperbare de la Station",
        "weapon": "Fusil Harponneur en Titane 18mm & Couteau de Plongée",
        "weaponId": "wpn_norwegian_deep_sub_diver_harpoon",
        "vitalityRatio": 1.5,
        "hp": 810,
        "armor": 85,
        "trophy": "Casque de Scaphandre Lourd en Titane Brossé & Manomètre"
      },
      {
        "id": "sub_engineer_thorvaldsen",
        "name": "Ingénieur Lars Thorvaldsen",
        "role": "Opérateur de Sonar Actif",
        "weapon": "Harpon Pneumatique à Gaz 300 Bar & Balise Sonar",
        "weaponId": "wpn_norwegian_deep_sub_diver_harpoon",
        "vitalityRatio": 1.35,
        "hp": 730,
        "armor": 70,
        "trophy": "Émetteur d'Écho-Location Sous-Marin Portatif"
      },
      {
        "id": "driller_diver_brevik",
        "name": "Scaphandrier Nils Brevik",
        "role": "Ouvrier de Tête de Forage Abyssal",
        "weapon": "Harpon à Flèches Barbelées & Torche Magnésium",
        "weaponId": "wpn_norwegian_deep_sub_diver_harpoon",
        "vitalityRatio": 1.3,
        "hp": 680,
        "armor": 60,
        "trophy": "Câble d'Ombilical Sous-Marin Blindé en Kevlar"
      }
    ]
  },
  {
    "id": "squad_pred_louisiana_bayou_trappers",
    "name": "Traqueurs de Marécages & Chasseurs de Peaux — Bayou de Louisiane (1998)",
    "universe": "PREDATOR",
    "shortName": "Traqueurs du Bayou (3 Cajuns)",
    "category": "PARAMILITARY",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Predator: Strange Roux (1998)",
    "biomeId": "jungle",
    "recommendedBiomeLabel": "Marécages du Bayou Cajun (1998)",
    "primaryMapId": "map_pred_african_savanna_safari_reserve",
    "weaponLoadout": [
      "wpn_louisiana_flintlock_double_shotgun"
    ],
    "description": "Pisteurs aguerris des bayous louisianais traquant le démon invisible entre racines de cyprès et nappes d'eau croupie infestées d'alligators.",
    "tactics": "Tirs de barrage rapprochés au fusil de calibre 10, déploiement de pièges à mâchoires dans la vase et embuscades furtives depuis les barques.",
    "totalHonorReward": 6700,
    "soloVariantId": "prey_jungle_hunter_1987",
    "members": [
      {
        "id": "trapper_jean_boudreaux",
        "name": "Jean-Baptiste Boudreaux",
        "role": "Vieux Braconnier des Eaux Sombres",
        "weapon": "Fusil Calibre 10 Double Canon & Machette d'Abattage",
        "weaponId": "wpn_louisiana_flintlock_double_shotgun",
        "vitalityRatio": 1.45,
        "hp": 780,
        "armor": 70,
        "trophy": "Dent d'Alligator Géant Gravée de Runes Vaudou"
      },
      {
        "id": "guide_etienne_thibodaux",
        "name": "Étienne Thibodaux",
        "role": "Éclaireur des Méandres & Piégeur",
        "weapon": "Double Fusil à Poudre Noire & Collets d'Acier",
        "weaponId": "wpn_louisiana_flintlock_double_shotgun",
        "vitalityRatio": 1.35,
        "hp": 710,
        "armor": 65,
        "trophy": "Gibecière en Peau de Serpent d'Eau & Boussole en Cuivre"
      },
      {
        "id": "skiff_pilot_clovys",
        "name": "Clovis Hebert",
        "role": "Pilote de Barque à Pieu de Cyprès",
        "weapon": "Fusil à Mitraille Lourde & Harpon d'Esturgeon",
        "weaponId": "wpn_louisiana_flintlock_double_shotgun",
        "vitalityRatio": 1.3,
        "hp": 660,
        "armor": 55,
        "trophy": "Chapeau de Feutre Tressé Émaillé d'Écailles"
      }
    ]
  },
  {
    "id": "squad_alien_synsound_security_forces",
    "name": "Sécurité Corporative & Brigade Bio-Sonique — Synsound Manhattan (1996)",
    "universe": "ALIEN",
    "shortName": "Sécurité Synsound (3 Gardes)",
    "category": "SECURITY",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens: Music of the Spears (1996)",
    "biomeId": "stargazer_blacksite",
    "recommendedBiomeLabel": "Complexe Acoustique Synsound (1996)",
    "primaryMapId": "map_alien_synsound_soundstage_ny",
    "weaponLoadout": [
      "wpn_synsound_sonic_disruptor_cannon"
    ],
    "description": "Unité d'intervention tactique privée protégeant le laboratoire bio-acoustique expérimental de Damian Damon armée de canons à perturbation par ultrasons.",
    "tactics": "Ondes de choc ultrasoniques concentrées pour repousser les assauts au corps à corps, flashs aveuglants et verrouillage des sas capitonnés.",
    "totalHonorReward": 7300,
    "soloVariantId": "prey_xeno_warrior",
    "members": [
      {
        "id": "security_director_vance",
        "name": "Commandant Vance Sterling",
        "role": "Chef de Sécurité du Studio Synsound",
        "weapon": "Canon à Ondes Ultrasoniques & Taser Haute Tension",
        "weaponId": "wpn_synsound_sonic_disruptor_cannon",
        "vitalityRatio": 1.5,
        "hp": 820,
        "armor": 80,
        "trophy": "Casque Anti-Bruit Actif Blindé Synsound à Visière Pourpre"
      },
      {
        "id": "acoustic_operator_kroll",
        "name": "Opérateur Sonique Kroll",
        "role": "Artilleur de Faisceau à Résonance",
        "weapon": "Canon Perturbateur à Ultrasons 45kHz & Baffles",
        "weaponId": "wpn_synsound_sonic_disruptor_cannon",
        "vitalityRatio": 1.35,
        "hp": 730,
        "armor": 70,
        "trophy": "Oscillateur de Fréquences d'Agonie en Titane"
      },
      {
        "id": "containment_guard_delaqua",
        "name": "Garde de Confinement Delaqua",
        "role": "Fusilier Acoustique de Studio",
        "weapon": "Canon Sonique Compact & Grenades Flashbang",
        "weaponId": "wpn_synsound_sonic_disruptor_cannon",
        "vitalityRatio": 1.3,
        "hp": 670,
        "armor": 60,
        "trophy": "Badge d'Accès VIP Studio d'Enregistrement Synsound"
      }
    ]
  },
  {
    "id": "squad_alien_fast_track_maintenance_rig",
    "name": "Équipe de Maintenance de l'Ascenseur Spatial — Station Apex (2011)",
    "universe": "ALIEN",
    "shortName": "Maintenance Ascenseur (3 Techniciens)",
    "category": "PARAMILITARY",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens: Fast Track to Heaven (2011)",
    "biomeId": "stargazer_blacksite",
    "recommendedBiomeLabel": "Gaine Ascenseur Géostationnaire (2011)",
    "primaryMapId": "map_alien_space_elevator_shaft",
    "weaponLoadout": [
      "wpn_fast_track_pneumatic_riveter"
    ],
    "description": "Équipe technique d'élite habituée aux travaux en apesanteur et aux interventions d'urgence sur les câbles orbitaux de 100 000 km.",
    "tactics": "Tirs de rivets lourds perforant les carapaces, ancrage magnétique au sol et déclenchement de sas d'évacuation atmosphérique.",
    "totalHonorReward": 7500,
    "soloVariantId": "prey_xeno_praetorian_royal",
    "members": [
      {
        "id": "cable_master_orourke",
        "name": "Maître Câblier O'Rourke",
        "role": "Superviseur de la Tension Orbitale",
        "weapon": "Pistolet Riveteur Hydraulique 800 Bar & Découpeur",
        "weaponId": "wpn_fast_track_pneumatic_riveter",
        "vitalityRatio": 1.5,
        "hp": 830,
        "armor": 85,
        "trophy": "Mousqueton de Sécurité en Nanotubes de Carbone & Harnais"
      },
      {
        "id": "rigger_valeri",
        "name": "Technicien Valeri Chen",
        "role": "Soudeur de Coque en Micro-Gravité",
        "weapon": "Riveteur Pneumatique Lourd & Torche Plasma",
        "weaponId": "wpn_fast_track_pneumatic_riveter",
        "vitalityRatio": 1.4,
        "hp": 750,
        "armor": 75,
        "trophy": "Visière Polarisée Anti-Rayons Solaires Orbitaux"
      },
      {
        "id": "winch_tech_amara",
        "name": "Mécanicienne Amara Patel",
        "role": "Opératrice de Frein Magnétique",
        "weapon": "Riveteur d'Acier Rapide & Clé Dynamométrique Géante",
        "weaponId": "wpn_fast_track_pneumatic_riveter",
        "vitalityRatio": 1.3,
        "hp": 680,
        "armor": 65,
        "trophy": "Segment de Câble Orbital Tressé en Alliage Diamanté"
      }
    ]
  },
  {
    "id": "squad_avp_pantha_stalker_unit",
    "name": "Pisteurs Félins & Traqueurs de Canopée — Jungle de Pantha (2000)",
    "universe": "AVP",
    "shortName": "Pisteurs de Pantha (3 Éclaireurs)",
    "category": "PARAMILITARY",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens vs. Predator: Pantha (2000)",
    "biomeId": "jungle",
    "recommendedBiomeLabel": "Haute Canopée de Pantha (2000)",
    "primaryMapId": "map_avp_pantha_canopy_jungle",
    "weaponLoadout": [
      "wpn_pantha_arbor_net_caster"
    ],
    "description": "Chasseurs d'arbres agiles équipés de lanceurs de filets lourds et de grappins pour traquer les créatures bondissantes au sommet de la jungle préhistorique.",
    "tactics": "Projection de filets pour immobiliser les proies sur les branches, tirs d'arbalètes empoisonnées et replis aériens par lianes de suspension.",
    "totalHonorReward": 7100,
    "soloVariantId": "prey_young_blood_initiate",
    "members": [
      {
        "id": "pantha_scout_kallan",
        "name": "Pisteur en Chef Kallan",
        "role": "Veneur des Branches Maîtresses",
        "weapon": "Lance-Filet Lourd Arboricole & Dague de Brèche",
        "weaponId": "wpn_pantha_arbor_net_caster",
        "vitalityRatio": 1.45,
        "hp": 790,
        "armor": 75,
        "trophy": "Griffe de Panthère Cybernétique de Pantha en Céramique"
      },
      {
        "id": "canopy_archer_sora",
        "name": "Traqueuse Sora Reed",
        "role": "Tireuse de Précision des Lianes",
        "weapon": "Lanceur de Filets Lestés & Fléchettes Corrosives",
        "weaponId": "wpn_pantha_arbor_net_caster",
        "vitalityRatio": 1.35,
        "hp": 720,
        "armor": 65,
        "trophy": "Camouflage Foliaire Tressé en Fibres Biologiques"
      },
      {
        "id": "branch_climber_jarek",
        "name": "Voltigeur Jarek Vance",
        "role": "Éclaireur des Cimes Vertigineuses",
        "weapon": "Lance-Filet Compact & Grappin d'Escalade Rapide",
        "weaponId": "wpn_pantha_arbor_net_caster",
        "vitalityRatio": 1.3,
        "hp": 670,
        "armor": 60,
        "trophy": "Paire de Crampons d'Écorce en Alliage Yautja"
      }
    ]
  },
  {
    "id": "squad_avp_three_world_war_vanguard",
    "name": "Avant-Garde USCM de la Coalition — Three World War (2010)",
    "universe": "AVP",
    "shortName": "Coalition USCM (3 Vétérans)",
    "category": "MILITARY_COMMANDO",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens vs. Predator: Three World War (2010)",
    "biomeId": "genna_deathworld",
    "recommendedBiomeLabel": "Ligne de Tranchées de Caparis VII (2010)",
    "primaryMapId": "map_avp_three_world_war_frontline",
    "weaponLoadout": [
      "wpn_three_world_war_dual_pulse_carbine"
    ],
    "description": "Détachement de choc de Marines coloniaux vétérans combattant aux côtés de Machiko Noguchi pour écraser la menace du Killer Clan et de leurs bêtes dressées.",
    "tactics": "Feu nourri à la double carabine M41A-X2, formation en ligne de tranchée coordonnée et couverture mutuelle avec les guerriers Yautja alliés.",
    "totalHonorReward": 7800,
    "soloVariantId": "prey_weyland_combat_android",
    "members": [
      {
        "id": "major_ellis_uscm",
        "name": "Major Ronald Ellis",
        "role": "Commandant de la Coalition Marine-Yautja",
        "weapon": "Double Carabine M41A-X2 & Couteau de Combat M9",
        "weaponId": "wpn_three_world_war_dual_pulse_carbine",
        "vitalityRatio": 1.55,
        "hp": 870,
        "armor": 85,
        "trophy": "Plastron USCM Décoré de la Marque du Sang Yautja"
      },
      {
        "id": "gunner_sergeant_cooper",
        "name": "Sergent Artilleur Cooper",
        "role": "Fusilier Lourd de Rupture de Tranchée",
        "weapon": "Double Carabine M41A-X2 & Roquettes 25mm",
        "weaponId": "wpn_three_world_war_dual_pulse_carbine",
        "vitalityRatio": 1.4,
        "hp": 770,
        "armor": 75,
        "trophy": "Double Chargeur Circulaire Tambour M41A Chromé"
      },
      {
        "id": "combat_medic_tucker",
        "name": "Infirmier de Combat Tucker",
        "role": "Soutien Médical de Frontline",
        "weapon": "Carabine à Double Impulsion & Injecteur de Stimulants",
        "weaponId": "wpn_three_world_war_dual_pulse_carbine",
        "vitalityRatio": 1.35,
        "hp": 720,
        "armor": 70,
        "trophy": "Trousse de Premiers Soins Militaire Maculée d'Acide"
      }
    ]
  }
,
  {
    "id": "squad_pred_inca_warrior_guard",
    "name": "Garde d'Élite Impériale Inca — Démon des Andes 1532",
    "universe": "PREDATOR",
    "shortName": "Garde Impériale Inca (3 Guerriers)",
    "category": "WARRIOR_BROTHERHOOD",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Predator: Démon des Andes (1532)",
    "biomeId": "bouvetoya_pyramid",
    "recommendedBiomeLabel": "Citadelle de Pierre des Andes (1532)",
    "primaryMapId": "map_pred_andes_inca_ruins",
    "weaponLoadout": [
      "wpn_inca_obsidian_macuahuitl_blade"
    ],
    "description": "Guerriers incas vétérans dévoués à la garde du Temple du Soleil, armés de lourdes massues serties de lames prismatiques d'obsidienne.",
    "tactics": "Attaque synchronisée en éventail, feintes de désengagement sur les marches escarpées et fauchages d'obsidienne hémorragiques.",
    "totalHonorReward": 7100,
    "soloVariantId": "prey_feral_predator_1719",
    "members": [
      {
        "id": "chaski_warleader_inca",
        "name": "Général Atoc des Andes",
        "role": "Champion des Gardes du Soleil",
        "weapon": "Macuahuitl Lourd d'Obsidienne & Bouclier de Bois",
        "weaponId": "wpn_inca_obsidian_macuahuitl_blade",
        "vitalityRatio": 1.5,
        "hp": 830,
        "armor": 75,
        "trophy": "Pectoral d'Or Massif aux Rayons Solaires Gravés"
      },
      {
        "id": "puma_guardian_huascar",
        "name": "Guerrier Puma Huascar",
        "role": "Traqueur de Haute Montagne",
        "weapon": "Hache d'Obsidienne & Fronde de Chanvre",
        "weaponId": "wpn_inca_obsidian_macuahuitl_blade",
        "vitalityRatio": 1.35,
        "hp": 740,
        "armor": 65,
        "trophy": "Collier de Griffes de Puma Andin & Perles de Jade"
      },
      {
        "id": "condor_scout_rumi",
        "name": "Éclaireur Condor Rumi",
        "role": "Vigie des Falaises et Guetteur",
        "weapon": "Glaive Macuahuitl Court & Javelot",
        "weaponId": "wpn_inca_obsidian_macuahuitl_blade",
        "vitalityRatio": 1.3,
        "hp": 700,
        "armor": 60,
        "trophy": "Plume de Condor Royal & Anneau de Cuivre Inca"
      }
    ]
  },
  {
    "id": "squad_pred_yautja_prime_initiates",
    "name": "Initiés des Arènes de Yautja Prime — Ordalie du Sang",
    "universe": "PREDATOR",
    "shortName": "Initiés de Clan Yautja (3 Combattants)",
    "category": "YAUTJA_CLAN",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Predator: Homeworld & Yautja Lore Legends",
    "biomeId": "jungle",
    "recommendedBiomeLabel": "Fosse d'Initiation de Yautja Prime",
    "primaryMapId": "map_pred_yautja_prime_proving_arena",
    "weaponLoadout": [
      "wpn_yautja_prime_ceremonial_scythe"
    ],
    "description": "Trio de jeunes guerriers Yautja affrontant l'épreuve ultime des fosses volcaniques pour obtenir leur masque d'adulte et leur droit de chasse galactique.",
    "tactics": "Pression circulaire constante avec leurs faux d'initiation, esquives acrobatiques et relais d'assaut pour submerger les défenses adverses.",
    "totalHonorReward": 7900,
    "soloVariantId": "prey_young_blood_initiate",
    "members": [
      {
        "id": "yautja_initiate_vokhan",
        "name": "Initié Vokhan",
        "role": "Duelliste d'Arène Premier Sang",
        "weapon": "Faux Cérémonielle Yautja & Gantelet Nu",
        "weaponId": "wpn_yautja_prime_ceremonial_scythe",
        "vitalityRatio": 1.55,
        "hp": 880,
        "armor": 80,
        "trophy": "Bio-Masque Brut d'Initié Non Gravé de Symbole"
      },
      {
        "id": "yautja_initiate_tarkesh",
        "name": "Initié Tarkesh",
        "role": "Faucheur Volcanique Agressif",
        "weapon": "Faux d'Initiation à Tranchant Moléculaire",
        "weaponId": "wpn_yautja_prime_ceremonial_scythe",
        "vitalityRatio": 1.4,
        "hp": 790,
        "armor": 70,
        "trophy": "Dague de Cuirassage Forgée dans le Basalte"
      },
      {
        "id": "yautja_initiate_gurokh",
        "name": "Initié Gurokh",
        "role": "Sentinelle d'Ordalie de Clan",
        "weapon": "Faux Lourde Yautja & Lames de Poignet Brutes",
        "weaponId": "wpn_yautja_prime_ceremonial_scythe",
        "vitalityRatio": 1.35,
        "hp": 740,
        "armor": 65,
        "trophy": "Plaque d'Épaule d'Initié Maculée de Sang Vert"
      }
    ]
  },
  {
    "id": "squad_alien_pala_security_detail",
    "name": "Détachement de Sécurité Weyland de Pala Station — Aliens: Infiltrator (2020)",
    "universe": "ALIEN",
    "shortName": "Sécurité Pala Station (3 Gardes)",
    "category": "CORPORATE_SECURITY",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens: Infiltrator (2020)",
    "biomeId": "stargazer_blacksite",
    "recommendedBiomeLabel": "Aile Médicale de Pala Station (2202)",
    "primaryMapId": "map_alien_pala_station_security_wing",
    "weaponLoadout": [
      "wpn_pala_station_magpulse_carbine"
    ],
    "description": "Équipe d'intervention Weyland-Yutani de la station Pala luttant contre la rupture de confinement des spécimens contaminés par le pathogène.",
    "tactics": "Tirs de saturation magnéto-pulsés, progression méthodique en formation triangulaire et utilisation de balises sonores de diversion.",
    "totalHonorReward": 7400,
    "soloVariantId": "prey_weyland_combat_android",
    "members": [
      {
        "id": "lieutenant_marx_pala",
        "name": "Lieutenant James Marx",
        "role": "Chef de la Sécurité du Vivarium",
        "weapon": "Carabine Magnéto-Pulsée MP-90 & Pistolet VP-70",
        "weaponId": "wpn_pala_station_magpulse_carbine",
        "vitalityRatio": 1.5,
        "hp": 840,
        "armor": 80,
        "trophy": "Badge d'Accès Sécurisé Weyland Niveau 5 Biologique"
      },
      {
        "id": "security_android_unit_7",
        "name": "Synthétique de Confinement Unité 7",
        "role": "Intervention Lourde en Milieu Hostile",
        "weapon": "Carabine MP-90 & Électro-Matraque",
        "weaponId": "wpn_pala_station_magpulse_carbine",
        "vitalityRatio": 1.45,
        "hp": 810,
        "armor": 75,
        "trophy": "Module Mnémonique Androïde Endommagé par le Pathogène"
      },
      {
        "id": "corporal_chen_pala",
        "name": "Caporal Lisa Chen",
        "role": "Opératrice de Confinement Biologique",
        "weapon": "Carabine MP-90 & Grenades Cryogéniques",
        "weaponId": "wpn_pala_station_magpulse_carbine",
        "vitalityRatio": 1.35,
        "hp": 730,
        "armor": 65,
        "trophy": "Casque Pressurisé Weyland aux Filtres Saturés"
      }
    ]
  },
  {
    "id": "squad_alien_sacrifice_zealots",
    "name": "Zélotes du Culte Sacrificiel — Aliens: Sacrifice (1993)",
    "universe": "ALIEN",
    "shortName": "Zélotes du Sacrifice (3 Fanatiques)",
    "category": "COLONIAL_MILITIA",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens: Sacrifice (1993)",
    "biomeId": "hive_lv426",
    "recommendedBiomeLabel": "Cloître Sacrificiel Isolé (1993)",
    "primaryMapId": "map_alien_sacrifice_monastery",
    "weaponLoadout": [
      "wpn_sacrifice_heavy_slugthrower"
    ],
    "description": "Fanatiques colons ayant érigé une théocratie morbide autour du culte du Xénomorphe, massacrant tout intrus osant troubler leur divinité dévorante.",
    "tactics": "Embuscades téméraires au corps-à-corps, décharges de tromblon lourd à courte distance et refus de la retraite jusqu'au dernier souffle.",
    "totalHonorReward": 7200,
    "soloVariantId": "prey_colonial_marine_heavy",
    "members": [
      {
        "id": "father_malachi_zealot",
        "name": "Père Malachi",
        "role": "Grand Prêtre du Nid Sacré",
        "weapon": "Tromblon Lourd du Monastère & Dague d'Airain",
        "weaponId": "wpn_sacrifice_heavy_slugthrower",
        "vitalityRatio": 1.5,
        "hp": 850,
        "armor": 70,
        "trophy": "Sceptre d'Airain Orné d'une Mandibule Xénomorphe"
      },
      {
        "id": "brother_gideon_zealot",
        "name": "Frère Gideon",
        "role": "Gardien de la Fosse Sacrificielle",
        "weapon": "Tromblon de Calibre 8 & Chaînes Barbelées",
        "weaponId": "wpn_sacrifice_heavy_slugthrower",
        "vitalityRatio": 1.4,
        "hp": 770,
        "armor": 65,
        "trophy": "Chapelet en Vertèbres de Victimes Sacrifiées"
      },
      {
        "id": "sister_judith_zealot",
        "name": "Sœur Judith",
        "role": "Pourvoyeuse d'Offrandes Vivantes",
        "weapon": "Tromblon Artisanal & Torche Poissée",
        "weaponId": "wpn_sacrifice_heavy_slugthrower",
        "vitalityRatio": 1.35,
        "hp": 720,
        "armor": 60,
        "trophy": "Bure Monastique Renforcée de Bandes d'Acier"
      }
    ]
  },
  {
    "id": "squad_avp_endeavor_strike_platoon",
    "name": "Peloton de Frappe USS Endeavor — AVP: Fireteam Frontier",
    "universe": "AVP",
    "shortName": "Peloton Endeavor (3 Marines)",
    "category": "MILITARY_COMMANDO",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens: Fireteam Elite (2021-2022)",
    "biomeId": "stargazer_blacksite",
    "recommendedBiomeLabel": "Pont d'Envol de l'USS Endeavor (2202)",
    "primaryMapId": "map_avp_endeavor_docking_bay",
    "weaponLoadout": [
      "wpn_endeavor_heavy_particle_rifle"
    ],
    "description": "Équipe de choc de l'USCM déployée pour repousser les assauts xénomorphes et neutraliser les interférences Yautja à bord de l'Endeavor.",
    "tactics": "Feu nourri à faisceau de particules ionisées, contrôle de corridor impénétrable et déploiement de micro-drones de soutien.",
    "totalHonorReward": 8000,
    "soloVariantId": "prey_colonial_marine_heavy",
    "members": [
      {
        "id": "captain_herrera_endeavor",
        "name": "Capitaine Gabriel Herrera",
        "role": "Commandant de la Force de Réaction Rapide",
        "weapon": "Fusil à Particules Type-77 & Pistolet Smart",
        "weaponId": "wpn_endeavor_heavy_particle_rifle",
        "vitalityRatio": 1.6,
        "hp": 900,
        "armor": 85,
        "trophy": "Insigne de Poitrine du Croiseur USS Endeavor"
      },
      {
        "id": "gunner_sergeant_vance",
        "name": "Sergent Artilleur Vance",
        "role": "Spécialiste Armes Lourdes à Particules",
        "weapon": "Fusil Type-77 & Chargeur Micro-Fusion",
        "weaponId": "wpn_endeavor_heavy_particle_rifle",
        "vitalityRatio": 1.45,
        "hp": 820,
        "armor": 80,
        "trophy": "Optique de Visée Thermique Haute Définition USCM"
      },
      {
        "id": "lance_corporal_rios",
        "name": "Caporal-Chef Rios",
        "role": "Fusilier Électronique & Démolition",
        "weapon": "Fusil Type-77 & Détonateurs Thermiques",
        "weaponId": "wpn_endeavor_heavy_particle_rifle",
        "vitalityRatio": 1.35,
        "hp": 750,
        "armor": 70,
        "trophy": "Plaque d'Identification Militaire USCM Gravée"
      }
    ]
  },
  {
    "id": "squad_avp_gunnison_swat_survivors",
    "name": "Survivants SWAT de l'Hôpital de Gunnison — Requiem (2007)",
    "universe": "AVP",
    "shortName": "SWAT de Gunnison (3 Policiers)",
    "category": "MILITARY_COMMANDO",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens vs. Predator: Requiem (2007)",
    "biomeId": "gunnison_outbreak",
    "recommendedBiomeLabel": "Maternité de Gunnison (2004)",
    "primaryMapId": "map_avp_gunnison_hospital_hive",
    "weaponLoadout": [
      "wpn_gunnison_swat_tactical_m4a1"
    ],
    "description": "Policiers d'élite du comté de Gunnison retranchés dans les étages de l'hôpital face aux assauts conjugués du Predalien et des facehuggers.",
    "tactics": "Feu tactique croisé à la M4A1, lampe torche stroboscopique pour désorienter les cibles et défense obstinée des goulots d'étranglement.",
    "totalHonorReward": 7500,
    "soloVariantId": "prey_weyland_combat_android",
    "members": [
      {
        "id": "sergeant_morales_swat",
        "name": "Sergent Chef Morales",
        "role": "Commandant Tactique SWAT de Gunnison",
        "weapon": "Carabine M4A1 Lampe X300 & Glock 17",
        "weaponId": "wpn_gunnison_swat_tactical_m4a1",
        "vitalityRatio": 1.5,
        "hp": 840,
        "armor": 75,
        "trophy": "Écusson SWAT du Comté de Gunnison Maculé de Pluie"
      },
      {
        "id": "officer_ray_swat",
        "name": "Officier Ray Stevens",
        "role": "Tireur d'Assaut Tactique",
        "weapon": "Carabine M4A1 Munitions Perforantes & Taser",
        "weaponId": "wpn_gunnison_swat_tactical_m4a1",
        "vitalityRatio": 1.4,
        "hp": 780,
        "armor": 70,
        "trophy": "Gilet Pare-Balles Tactique Niveau III Perforé d'Acide"
      },
      {
        "id": "officer_dawson_swat",
        "name": "Officier Dawson",
        "role": "Opérateur Bouclier Anti-Émeute",
        "weapon": "Carabine M4A1 & Bouclier Balistique Kevlar",
        "weaponId": "wpn_gunnison_swat_tactical_m4a1",
        "vitalityRatio": 1.35,
        "hp": 730,
        "armor": 65,
        "trophy": "Casque Anti-Émeute SWAT aux Visières Fissurées"
      }
    ]
  }
,
  {
    "id": "squad_pred_dark_river_military_trackers",
    "name": "Pisteurs Militaires du Rio Negro — Dark River (1996)",
    "universe": "PREDATOR",
    "shortName": "Pisteurs Dark River (3 Soldats)",
    "category": "PARAMILITARY_INSURGENTS",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Predator: Dark River (1996)",
    "biomeId": "jungle",
    "recommendedBiomeLabel": "Affluents Sauvages de l'Amazone (1992)",
    "primaryMapId": "map_pred_amazon_dark_river_basin",
    "weaponLoadout": [
      "wpn_amazon_river_machete_carbine"
    ],
    "description": "Vétérans des forces spéciales et mercenaires endurcis traquant les traces de sang bioluminescent le long des berges du fleuve.",
    "tactics": "Formation en flèche le long des berges, tirs de suppression au travers de la mangrove et assauts foudroyants à la baïonnette-machette.",
    "totalHonorReward": 7600,
    "soloVariantId": "prey_feral_predator_1719",
    "members": [
      {
        "id": "sergeant_mendez_darkriver",
        "name": "Sergent Chef Mendez",
        "role": "Chef de Traque Amazonienne",
        "weapon": "Carabine Fluviale Dark River & Lame Machette",
        "weaponId": "wpn_amazon_river_machete_carbine",
        "vitalityRatio": 1.5,
        "hp": 850,
        "armor": 70,
        "trophy": "Machette de Combat Ébréchée Gravée de Runes Tribales"
      },
      {
        "id": "tracker_da_silva",
        "name": "Éclaireur Da Silva",
        "role": "Pisteur de Marais & Tireur d'Appui",
        "weapon": "Carabine Fluviale Dark River & Fumigènes",
        "weaponId": "wpn_amazon_river_machete_carbine",
        "vitalityRatio": 1.4,
        "hp": 790,
        "armor": 65,
        "trophy": "Collier de Cartouches de 7.62mm Trempé de Boue"
      },
      {
        "id": "scout_castillo",
        "name": "Voltigeur Castillo",
        "role": "Guetteur Fluvial Léger",
        "weapon": "Carabine Fluviale Dark River & Dague de Poing",
        "weaponId": "wpn_amazon_river_machete_carbine",
        "vitalityRatio": 1.35,
        "hp": 740,
        "armor": 60,
        "trophy": "Gilet Tactique Camouflage Camo-Jungle Déchiré de Griffures"
      }
    ]
  },
  {
    "id": "squad_pred_fleener_creek_deputies",
    "name": "Adjoints du Shérif de Fleener Creek — Kindred (1996)",
    "universe": "PREDATOR",
    "shortName": "Adjoints Fleener Creek (3 Hommes)",
    "category": "LAW_ENFORCEMENT",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Predator: Kindred (1996)",
    "biomeId": "jungle",
    "recommendedBiomeLabel": "Scierie de Fleener Creek (1996)",
    "primaryMapId": "map_pred_fleener_creek_sawmill",
    "weaponLoadout": [
      "wpn_fleener_creek_hunting_shotgun"
    ],
    "description": "Adjoints du shérif locaux et trappeurs de l'Oregon déployés dans la scierie brumeuse pour neutraliser un tueur d'une férocité surhumaine.",
    "tactics": "Tirs de barrage au fusil à pompe de calibre 12, éclairage aux phares halogènes de patrouille et replis coordonnés entre les piles de bois.",
    "totalHonorReward": 7400,
    "soloVariantId": "prey_young_blood_initiate",
    "members": [
      {
        "id": "deputy_bob_fleener",
        "name": "Adjoint Principal Bob Mathis",
        "role": "Commandant de la Battue",
        "weapon": "Remington 870 Calibre 12 & Brenneke Lourd",
        "weaponId": "wpn_fleener_creek_hunting_shotgun",
        "vitalityRatio": 1.45,
        "hp": 830,
        "armor": 65,
        "trophy": "Étoile à Cinq Branches d'Adjoint du Shérif Ensanglantée"
      },
      {
        "id": "deputy_cole_fleener",
        "name": "Adjoint Cole Harper",
        "role": "Tireur de Battue Tactique",
        "weapon": "Remington 870 Calibre 12 & Cartouches 00-Buck",
        "weaponId": "wpn_fleener_creek_hunting_shotgun",
        "vitalityRatio": 1.4,
        "hp": 770,
        "armor": 60,
        "trophy": "Veste de Chasse en Flanelle aux Épaules Lacérées"
      },
      {
        "id": "trapper_hank_fleener",
        "name": "Trappeur Hank Vance",
        "role": "Guide Forestier des Résineux",
        "weapon": "Remington 870 Calibre 12 & Pièges à Mâchoires",
        "weaponId": "wpn_fleener_creek_hunting_shotgun",
        "vitalityRatio": 1.35,
        "hp": 750,
        "armor": 55,
        "trophy": "Ceinture Cartouchière de Calibre 12 en Cuir Huilé"
      }
    ]
  },
  {
    "id": "squad_alien_genocide_xeno_zip_raiders",
    "name": "Pillards de Gelée Royale Xeno-Zip — Genocide (1991)",
    "universe": "ALIEN",
    "shortName": "Pillards Xeno-Zip (3 Mercenaires)",
    "category": "CORPORATE_MERCENARIES",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens: Genocide (1991)",
    "biomeId": "hive_lv426",
    "recommendedBiomeLabel": "Mégalopole de Ruches Rouges et Noires (2190)",
    "primaryMapId": "map_alien_genocide_charon_hives",
    "weaponLoadout": [
      "wpn_genocide_red_flamethrower"
    ],
    "description": "Mercenaires surarmés employés par les cartels de la drogue pour récolter la gelée royale au cœur de la guerre fratricide des ruches.",
    "tactics": "Torrents de napalm sous pression pour calciner la chitine rouge, formation serrée en tortue ignifugée et sécurisation des poches de ponte.",
    "totalHonorReward": 7800,
    "soloVariantId": "prey_xeno_warrior",
    "members": [
      {
        "id": "captain_daniels_genocide",
        "name": "Capitaine Daniels",
        "role": "Chef de Récolte Charon M-27",
        "weapon": "Lance-Flammes Industriel M-27 & Pistolet Flare",
        "weaponId": "wpn_genocide_red_flamethrower",
        "vitalityRatio": 1.5,
        "hp": 880,
        "armor": 80,
        "trophy": "Doseur Pneumatique d'Extraction Xeno-Zip en Titane"
      },
      {
        "id": "burner_vance_genocide",
        "name": "Artificier Vance",
        "role": "Spécialiste de Calcination de Ruche",
        "weapon": "Lance-Flammes Industriel M-27 & Bombonnes Napalm",
        "weaponId": "wpn_genocide_red_flamethrower",
        "vitalityRatio": 1.45,
        "hp": 810,
        "armor": 75,
        "trophy": "Buse de Lance-Flammes Réticulée Calcinée par l'Acide"
      },
      {
        "id": "extractor_reyes_genocide",
        "name": "Opératrice Reyes",
        "role": "Préleveuse de Gelée Royale",
        "weapon": "Lance-Flammes Industriel M-27 & Cryo-Sonde",
        "weaponId": "wpn_genocide_red_flamethrower",
        "vitalityRatio": 1.4,
        "hp": 760,
        "armor": 70,
        "trophy": "Fiole Scellée de Gelée Royale Écarlate Cristallisée"
      }
    ]
  },
  {
    "id": "squad_alien_harvest_mayakovsky_androids",
    "name": "Unité Cyber-Médicale Mayakovsky — Harvest (1992)",
    "universe": "ALIEN",
    "shortName": "Cyber-Unité Mayakovsky (3 Synthétiques)",
    "category": "SYNTHETIC_INFILTRATORS",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens: Harvest (1992)",
    "biomeId": "stargazer_blacksite",
    "recommendedBiomeLabel": "Station Orbitale Mayakovsky (2194)",
    "primaryMapId": "map_alien_harvest_mayakovsky_station",
    "weaponLoadout": [
      "wpn_harvest_cyborg_injection_probe"
    ],
    "description": "Synthétiques et cyborgs de laboratoire programmés par le Dr Mayakovsky pour effectuer des biopsies chirurgicales sur les xénomorphes vivants.",
    "tactics": "Approche silencieuse sans pouls thermique, synchronisation neuronale de groupe et estocs précis visant les ganglions nerveux.",
    "totalHonorReward": 7700,
    "soloVariantId": "prey_weyland_combat_android",
    "members": [
      {
        "id": "synth_norbert_prime",
        "name": "Châssis Biomécanique Norbert-Proto",
        "role": "Superviseur Chirurgical Neural",
        "weapon": "Sonde de Prélèvement Cyber-Neural & Électrodes",
        "weaponId": "wpn_harvest_cyborg_injection_probe",
        "vitalityRatio": 1.55,
        "hp": 910,
        "armor": 85,
        "trophy": "Unité Centrale Optique Cybernétique du Prototype Norbert"
      },
      {
        "id": "synth_doc_02",
        "name": "Unité Androïde Médicale M-02",
        "role": "Injecteur de Neurotoxine Paralysante",
        "weapon": "Sonde de Prélèvement Cyber-Neural & Seringues Titane",
        "weaponId": "wpn_harvest_cyborg_injection_probe",
        "vitalityRatio": 1.4,
        "hp": 820,
        "armor": 75,
        "trophy": "Seringue Haute Pression Pneumatique en Acier Chirurgical"
      },
      {
        "id": "synth_doc_03",
        "name": "Unité Androïde Médicale M-03",
        "role": "Stabilisateur de Champ Stérilisant",
        "weapon": "Sonde de Prélèvement Cyber-Neural & Bistouri Statique",
        "weaponId": "wpn_harvest_cyborg_injection_probe",
        "vitalityRatio": 1.35,
        "hp": 780,
        "armor": 70,
        "trophy": "Puce de Synchronisation Synaptique Mayakovsky Cybernetics"
      }
    ]
  },
  {
    "id": "squad_avp_himalaya_templar_guards",
    "name": "Gardes du Sanctuaire Himalayen — Thrill of the Hunt (2004)",
    "universe": "AVP",
    "shortName": "Sentinelles Himalayennes (3 Tireurs)",
    "category": "COLONIAL_EXPEDITION",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens vs. Predator: Thrill of the Hunt (2004)",
    "biomeId": "bouvetoya_pyramid",
    "recommendedBiomeLabel": "Sanctuaire Himalayen sous le Blizzard (2004)",
    "primaryMapId": "map_avp_himalaya_monastery_ruins",
    "weaponLoadout": [
      "wpn_himalaya_highland_scout_rifle"
    ],
    "description": "Sentinelles d'élite en treillis polaire postées au sommet des pics tibétains pour interdire l'accès au monastère renfermant la pyramide.",
    "tactics": "Tirs de précision croisés depuis les corniches enneigées, surveillance infrarouge sous le blizzard et mines givrantes de détection.",
    "totalHonorReward": 7600,
    "soloVariantId": "prey_colonial_marine_heavy",
    "members": [
      {
        "id": "sniper_tsering_himalaya",
        "name": "Capitaine Tsering Dorje",
        "role": "Maître Tireur des Glaciers",
        "weapon": "Carabine Steyr Scout Himalaya .308 & Lunette Thermique",
        "weaponId": "wpn_himalaya_highland_scout_rifle",
        "vitalityRatio": 1.5,
        "hp": 840,
        "armor": 70,
        "trophy": "Lunette Thermique Steyr Givrée Couverte de Glyphes Moines"
      },
      {
        "id": "spotter_khorlo_himalaya",
        "name": "Guetteur Khorlo",
        "role": "Observateur & Télémétreur de Blizzard",
        "weapon": "Carabine Steyr Scout Himalaya .308 & Télémètre Laser",
        "weaponId": "wpn_himalaya_highland_scout_rifle",
        "vitalityRatio": 1.4,
        "hp": 780,
        "armor": 65,
        "trophy": "Piolet d'Alpinisme Tactique en Titane Trempé dans le Givre"
      },
      {
        "id": "sentinel_sonam_himalaya",
        "name": "Sentinelle Sonam",
        "role": "Fusilier d'Arête Rocheuse",
        "weapon": "Carabine Steyr Scout Himalaya .308 & Grenades Cryo",
        "weaponId": "wpn_himalaya_highland_scout_rifle",
        "vitalityRatio": 1.35,
        "hp": 750,
        "armor": 60,
        "trophy": "Masque à Oxygène Polaire Camouflage Neige Déchiré"
      }
    ]
  },
  {
    "id": "squad_avp_chokehold_containment_hazmat",
    "name": "Équipe de Quarantaine Hazmat — Chokehold (2009)",
    "universe": "AVP",
    "shortName": "Hazmat Chokehold (3 Opérateurs)",
    "category": "HAZMAT_CONTAINMENT",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens vs. Predator: Chokehold (2009)",
    "biomeId": "stargazer_blacksite",
    "recommendedBiomeLabel": "Zone de Confinement Hermétique (2198)",
    "primaryMapId": "map_avp_chokehold_deep_quarantine",
    "weaponLoadout": [
      "wpn_chokehold_riot_foam_launcher"
    ],
    "description": "Opérateurs de confinement biologique en combinaison pressurisée déployés pour sceller définitivement les sas d'une éclosion extraterrestre.",
    "tactics": "Inondation des couloirs de mousse polymérisante, tirs de harcèlement pour bloquer les sorties et verrouillage progressif des portes étanches.",
    "totalHonorReward": 7500,
    "soloVariantId": "prey_weyland_combat_android",
    "members": [
      {
        "id": "chief_ross_hazmat",
        "name": "Contremaître de Sécurité Ross",
        "role": "Officier de Confinement Chimique",
        "weapon": "Lanceur de Mousse de Confinement Chokehold & Taser Lourd",
        "weaponId": "wpn_chokehold_riot_foam_launcher",
        "vitalityRatio": 1.5,
        "hp": 860,
        "armor": 75,
        "trophy": "Insigne de Sas de Décontamination Haute Pression Déformé"
      },
      {
        "id": "operator_keller_hazmat",
        "name": "Opérateur Keller",
        "role": "Projecteur de Polymère Réticulant",
        "weapon": "Lanceur de Mousse de Confinement Chokehold & Canisters Cryo",
        "weaponId": "wpn_chokehold_riot_foam_launcher",
        "vitalityRatio": 1.4,
        "hp": 790,
        "armor": 70,
        "trophy": "Manomètre de Pression Chimique Éclaté sous l'Acide"
      },
      {
        "id": "operator_sinclair_hazmat",
        "name": "Opérateur Sinclair",
        "role": "Verrouilleur de Sas Hermétiques",
        "weapon": "Lanceur de Mousse de Confinement Chokehold & Chalumeau Plasma",
        "weaponId": "wpn_chokehold_riot_foam_launcher",
        "vitalityRatio": 1.35,
        "hp": 740,
        "armor": 65,
        "trophy": "Gant Hazmat Renforcé en Caoutchouc Synthétique Plombé"
      }
    ]
  }
,
  {
    "id": "squad_pred_no_safari_poacher_posse",
    "name": "Braconniers Armés de la Savane — No Safari (1998)",
    "universe": "PREDATOR",
    "shortName": "Braconniers Safari (3 Tireurs)",
    "category": "LAW_ENFORCEMENT",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Predator: No Safari (1998)",
    "biomeId": "jungle",
    "recommendedBiomeLabel": "Savane Africaine & Baobabs (1998)",
    "primaryMapId": "map_pred_louisiana_bayou_swamp",
    "weaponLoadout": [
      "wpn_no_safari_heavy_elephant_gun"
    ],
    "description": "Pisteurs et braconniers cajuns nés dans les marécages de Louisiane usant de pièges à mâchoires et de fusils lourds pour traquer le monstre des marais.",
    "tactics": "Navigation silencieuse en barque à fond plat, dispersion dans la mangrove moussue et tirs de barrage simultanés au calibre 10 lourd.",
    "totalHonorReward": 7500,
    "soloVariantId": "prey_feral_predator_1719",
    "members": [
      {
        "id": "trapper_jean_roux",
        "name": "Jean-Luc \"Gator\" Boudreaux",
        "role": "Maître Trappeur de la Rivière Rouge",
        "weapon": "Fusil Double Calibre 10 des Marais & Dague de Poing",
        "weaponId": "wpn_no_safari_heavy_elephant_gun",
        "vitalityRatio": 1.5,
        "hp": 840,
        "armor": 65,
        "trophy": "Mâchoire d'Alligator Fossile Sculptée aux Runes Cajuns"
      },
      {
        "id": "tracker_remy_roux",
        "name": "Remy Thibodeaux",
        "role": "Guetteur d'Échasses & Pêcheur de Fosse",
        "weapon": "Fusil Double Calibre 10 des Marais & Câbles Métalliques",
        "weaponId": "wpn_no_safari_heavy_elephant_gun",
        "vitalityRatio": 1.4,
        "hp": 780,
        "armor": 60,
        "trophy": "Giberne en Cuir d'Alligator Maculée de Limon Épais"
      },
      {
        "id": "scout_marcel_roux",
        "name": "Marcel Babineaux",
        "role": "Tireur d'Embuscade Fluvial",
        "weapon": "Fusil Double Calibre 10 des Marais & Pièges Mâchoires",
        "weaponId": "wpn_strange_roux_bayou_shotgun",
        "vitalityRatio": 1.35,
        "hp": 740,
        "armor": 55,
        "trophy": "Chapeau de Feutre Tressé Étoilé de Plumes de Héron Sanglantes"
      }
    ]
  },
  {
    "id": "squad_pred_primal_alaska_outfitters",
    "name": "Guides Polaires de l'Arctique — Primal (1997)",
    "universe": "PREDATOR",
    "shortName": "Guides d'Alaska (3 Chasseurs)",
    "category": "PARAMILITARY_INSURGENTS",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Predator: Primal (1997)",
    "biomeId": "bouvetoya_pyramid",
    "recommendedBiomeLabel": "Taïga Arctique d'Alaska (1997)",
    "primaryMapId": "map_pred_alaska_taiga_blizzard",
    "weaponLoadout": [
      "wpn_primal_alaska_heavy_bear_rifle"
    ],
    "description": "Chasseurs d'élite du grand nord américain équipés pour survivre aux hivers polaires et abattre la faune prédatrice la plus colossale.",
    "tactics": "Poste de tir étagé sur les falaises de glace, tirs de précision au .458 Win Mag et balisage de détection thermique sous le blizzard.",
    "totalHonorReward": 7600,
    "soloVariantId": "prey_young_blood_initiate",
    "members": [
      {
        "id": "guide_kodiak_dan",
        "name": "Capitaine Daniel \"Kodiak\" Ross",
        "role": "Maître Guide de Grande Chasse Arctique",
        "weapon": "Carabine .458 Win Mag Alaska & Lunette Sub-Zéro",
        "weaponId": "wpn_primal_alaska_heavy_bear_rifle",
        "vitalityRatio": 1.5,
        "hp": 860,
        "armor": 70,
        "trophy": "Griffe d'Ours Grizzly Géant Cerclée d'Or Arctique"
      },
      {
        "id": "tracker_svend_alaska",
        "name": "Svend Lindqvist",
        "role": "Pisteur de Blizzard & Télémétreur",
        "weapon": "Carabine .458 Win Mag Alaska & Fumigènes Thermiques",
        "weaponId": "wpn_primal_alaska_heavy_bear_rifle",
        "vitalityRatio": 1.4,
        "hp": 800,
        "armor": 65,
        "trophy": "Anorak Polaire Camouflage Neige Déchiré de Griffures Profondes"
      },
      {
        "id": "spotter_eli_alaska",
        "name": "Elija Vance",
        "role": "Tireur d'Arrêt de Corniche Glacée",
        "weapon": "Carabine .458 Win Mag Alaska & Couteau Bowie Lourd",
        "weaponId": "wpn_primal_alaska_heavy_bear_rifle",
        "vitalityRatio": 1.35,
        "hp": 750,
        "armor": 60,
        "trophy": "Paire de Raquettes Tactiques Renforcées en Titane Allégé"
      }
    ]
  },
  {
    "id": "squad_alien_survival_geology_crew",
    "name": "Équipe de Forage Profond — Survival (1998)",
    "universe": "ALIEN",
    "shortName": "Mineurs des Failles (3 Techniciens)",
    "category": "SYNTHETIC_INFILTRATORS",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens: Survival (1998)",
    "biomeId": "stargazer_blacksite",
    "recommendedBiomeLabel": "Bunker Minier de Grande Profondeur (2189)",
    "primaryMapId": "map_alien_deep_crust_mining_bunker",
    "weaponLoadout": [
      "wpn_survival_deep_crust_plasma_cutter"
    ],
    "description": "Foreurs et techniciens géothermiques retranchés au fond d'un puits scellé maniant des torches de plasma capables de couper l'acier.",
    "tactics": "Barricade des couloirs étroits au fer forgé, arcs de plasma thermique continus et verrouillage automatique des portes de sécurité.",
    "totalHonorReward": 7700,
    "soloVariantId": "prey_xeno_warrior",
    "members": [
      {
        "id": "dr_quarry_survival",
        "name": "Dr Paul Quarry",
        "role": "Chef de Mission Géologique Paranoïaque",
        "weapon": "Découpeur Plasma M-88 & Sismographe Portable",
        "weaponId": "wpn_survival_deep_crust_plasma_cutter",
        "vitalityRatio": 1.5,
        "hp": 850,
        "armor": 75,
        "trophy": "Disque Dur Crypté d'Enregistrements Biologiques Souterrains"
      },
      {
        "id": "synth_otto_survival",
        "name": "Synthétique de Maintenance Otto-4",
        "role": "Opérateur d'Excavation Haute Pression",
        "weapon": "Découpeur Plasma M-88 & Électrodes de Forage",
        "weaponId": "wpn_survival_deep_crust_plasma_cutter",
        "vitalityRatio": 1.45,
        "hp": 890,
        "armor": 80,
        "trophy": "Buse de Découpeur Plasma Déformée par l'Acide Fongique"
      },
      {
        "id": "miner_graves_survival",
        "name": "Contremaître Graves",
        "role": "Artificier de Dynamitage Géologique",
        "weapon": "Découpeur Plasma M-88 & Charges Thermiques",
        "weaponId": "wpn_survival_deep_crust_plasma_cutter",
        "vitalityRatio": 1.35,
        "hp": 780,
        "armor": 70,
        "trophy": "Casque de Mineur Renforcé Doté d'un Projecteur Xénon Brisé"
      }
    ]
  },
  {
    "id": "squad_alien_glass_corridor_freighter_security",
    "name": "Sécurité du Cargo Stellaire — Glass Corridor (1998)",
    "universe": "ALIEN",
    "shortName": "Sécurité de Bord (3 Gardes)",
    "category": "MILITARY_COMMANDO",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens: Glass Corridor (1998)",
    "biomeId": "stargazer_blacksite",
    "recommendedBiomeLabel": "Coursive Pressurisée du Cargo Spatial (2193)",
    "primaryMapId": "map_alien_orbital_freighter_concourse",
    "weaponLoadout": [
      "wpn_glass_corridor_flechette_subgun"
    ],
    "description": "Agents de sécurité armés de pistolets-mitrailleurs à fléchettes polymères protégeant les convois civils contre les brèches atmosphériques.",
    "tactics": "Tirs de saturation à cadence extrême, repli progressif vers les sas pressurisés et utilisation des boucliers anti-souffle.",
    "totalHonorReward": 7600,
    "soloVariantId": "prey_weyland_combat_android",
    "members": [
      {
        "id": "captain_holmes_glass",
        "name": "Commandant de Bord Holmes",
        "role": "Officier Supérieur de Sécurité Pressurisée",
        "weapon": "PM à Fléchettes P-12 & Taser Automatique",
        "weaponId": "wpn_glass_corridor_flechette_subgun",
        "vitalityRatio": 1.5,
        "hp": 840,
        "armor": 70,
        "trophy": "Badge de Capitaine de Navigation Fret Stellaire Rayé d'Acide"
      },
      {
        "id": "officer_vogel_glass",
        "name": "Officier d'Assaut Vogel",
        "role": "Intercepteur de Brèche Civile",
        "weapon": "PM à Fléchettes P-12 & Grenades Flash",
        "weaponId": "wpn_glass_corridor_flechette_subgun",
        "vitalityRatio": 1.4,
        "hp": 790,
        "armor": 65,
        "trophy": "Visière Pare-Éclats Polarisée Fissurée sous Vide Sidéral"
      },
      {
        "id": "guard_kane_glass",
        "name": "Garde de Convoi Kane",
        "role": "Sentinelle de Sas Hermétique",
        "weapon": "PM à Fléchettes P-12 & Menottes Magnétiques",
        "weaponId": "wpn_glass_corridor_flechette_subgun",
        "vitalityRatio": 1.35,
        "hp": 740,
        "armor": 60,
        "trophy": "Chargeur Haute Capacité de Micro-Fléchettes Polymères"
      }
    ]
  },
  {
    "id": "squad_avp_bunda_militia_defenders",
    "name": "Milice des Éleveurs de Bunda — AVP: War (1995)",
    "universe": "AVP",
    "shortName": "Milice de Bunda (3 Colons)",
    "category": "COLONIAL_EXPEDITION",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens vs. Predator: War (1995)",
    "biomeId": "hive_lv426",
    "recommendedBiomeLabel": "Périmètre Fortifié de la Colonie Bunda (2195)",
    "primaryMapId": "map_avp_bunda_colony_ranch_perimeter",
    "weaponLoadout": [
      "wpn_bunda_ranch_heavy_harpoon_rifle"
    ],
    "description": "Éleveurs et vétérans coloniaux retranchés autour de leurs enclos de bétail équipés de lance-harpons lourds pour repousser les bêtes.",
    "tactics": "Tirs d'empalement pneumatiques coordonnés le long des clôtures, éclairage au projecteur xénon et verrouillage des portails d'enclos.",
    "totalHonorReward": 7500,
    "soloVariantId": "prey_colonial_marine_heavy",
    "members": [
      {
        "id": "rancher_clay_bunda",
        "name": "Contremaître Clayton \"Bulls\" McCrea",
        "role": "Commandant de la Ligne de Ranch",
        "weapon": "Lance-Harpon Lourd Pneumatique & Dague de Dépeçage",
        "weaponId": "wpn_bunda_ranch_heavy_harpoon_rifle",
        "vitalityRatio": 1.5,
        "hp": 850,
        "armor": 65,
        "trophy": "Pointe de Harpon Pneumatique Déformée et Maculée d'Ichore"
      },
      {
        "id": "herder_josh_bunda",
        "name": "Dresseur Josh Sterling",
        "role": "Pisteur de Bétail Rhynth & Tireur",
        "weapon": "Lance-Harpon Lourd Pneumatique & Câbles d'Acier",
        "weaponId": "wpn_bunda_ranch_heavy_harpoon_rifle",
        "vitalityRatio": 1.4,
        "hp": 790,
        "armor": 60,
        "trophy": "Gilet en Cuir d'Éleveur Frontière Marqué au Fer Rouge"
      },
      {
        "id": "militia_dara_bunda",
        "name": "Sentinelle Dara Vance",
        "role": "Guetteuse de Clôture Électrifiée",
        "weapon": "Lance-Harpon Lourd Pneumatique & Fusées Éclairantes",
        "weaponId": "wpn_bunda_ranch_heavy_harpoon_rifle",
        "vitalityRatio": 1.35,
        "hp": 750,
        "armor": 55,
        "trophy": "Isolateur Haute Tension de Clôture Agricole Éclaté"
      }
    ]
  },
  {
    "id": "squad_avp_three_world_war_combined_strike",
    "name": "Commandos de Choc des Killer Clans — Three World War (2010)",
    "universe": "AVP",
    "shortName": "Assaut Killer Clan (3 Renégats)",
    "category": "PARAMILITARY_INSURGENTS",
    "scale": "MOYEN",
    "totalMembers": 3,
    "originMedia": "Aliens vs. Predator: Three World War (2010)",
    "biomeId": "stargazer_blacksite",
    "recommendedBiomeLabel": "Citadelle Spatiale des Bad Bloods (2210)",
    "primaryMapId": "map_avp_bad_blood_orbital_citadel",
    "weaponLoadout": [
      "wpn_bad_blood_killer_spikethrower"
    ],
    "description": "Chasseurs renégats des Killer Clans corrompus par la cruauté usant de lanceurs d'épines neurotoxiques et menant des bêtes enchaînées.",
    "tactics": "Pluie d'épines barbelées corrosives pour paralyser la motricité des cibles, charge brutale au corps-à-corps et cruauté sans honneur.",
    "totalHonorReward": 8000,
    "soloVariantId": "prey_colonial_marine_heavy",
    "members": [
      {
        "id": "warlord_kragh_killer",
        "name": "Seigneur de Meute Kragh",
        "role": "Maître de Meute des Killer Clans",
        "weapon": "Lanceur d'Épines Toxiques & Fendoir Barbelé",
        "weaponId": "wpn_bad_blood_killer_spikethrower",
        "vitalityRatio": 1.6,
        "hp": 920,
        "armor": 85,
        "trophy": "Masque Rituel Bad Blood aux Marques de Sang Humain Séché"
      },
      {
        "id": "slasher_vorok_killer",
        "name": "Bourreau Vorok",
        "role": "Traqueur d'Épines Neurotoxiques",
        "weapon": "Lanceur d'Épines Toxiques & Dague Dentelée",
        "weaponId": "wpn_bad_blood_killer_spikethrower",
        "vitalityRatio": 1.45,
        "hp": 840,
        "armor": 75,
        "trophy": "Collier d'Entrave Neurale de Xénomorphe Déconnecté"
      },
      {
        "id": "raider_drak_killer",
        "name": "Pillard Drak",
        "role": "Artificier d'Épines Corrosives",
        "weapon": "Lanceur d'Épines Toxiques & Bombes à Fragmentation",
        "weaponId": "wpn_bad_blood_killer_spikethrower",
        "vitalityRatio": 1.4,
        "hp": 790,
        "armor": 70,
        "trophy": "Gantelet Renégat Ébréché Souillé d'Acide Moléculaire"
      }
    ]
  },
  {
      "id": "squad_pred_dark_ages_norman_knights",
      "name": "Croisés Templiers de Haute-Normandie — Dark Ages (1330)",
      "universe": "PREDATOR",
      "shortName": "Templiers Normands (3 Chevaliers)",
      "category": "PARAMILITARY_INSURGENTS",
      "scale": "MOYEN",
      "totalMembers": 3,
      "originMedia": "Predator: Dark Ages (2015)",
      "biomeId": "jungle",
      "recommendedBiomeLabel": "Forêt de Haute-Normandie (1330)",
      "primaryMapId": "map_pred_normandy_forest_crusade",
      "weaponLoadout": [
          "wpn_dark_ages_norman_heavy_crossbow"
      ],
      "description": "Compagnie de chevaliers croisés bardés de fer et arbalétriers d'élite traquant le Démon Noir dans les sous-bois brumeux de Normandie.",
      "tactics": "Volées de carreaux d'acier lourds pour clouer la cible au sol, formation de boucliers en triangle et charge à l'épée bâtarde.",
      "totalHonorReward": 7500,
      "soloVariantId": "prey_feral_predator_1719",
      "members": [
          {
              "id": "sire_richard_norman",
              "name": "Sire Richard de Montmirail",
              "role": "Capitaine Templier en Cotte de Mailles",
              "weapon": "Arbalète Lourde & Épée Bâtarde Forgée",
              "weaponId": "wpn_dark_ages_norman_heavy_crossbow",
              "vitalityRatio": 1.5,
              "hp": 880,
              "armor": 85,
              "trophy": "Heaume d'Acier Forgé et Croix Pectorale Ébréchée"
          },
          {
              "id": "frere_guy_norman",
              "name": "Frère Guy le Vétéran",
              "role": "Arbalétrier d'Élite de Siège",
              "weapon": "Arbalète Lourde Normande à Treuil",
              "weaponId": "wpn_dark_ages_norman_heavy_crossbow",
              "vitalityRatio": 1.4,
              "hp": 810,
              "armor": 75,
              "trophy": "Treuil d'Arbalète en Bronze Gravé de Prières Latines"
          },
          {
              "id": "ecuyer_hugues_norman",
              "name": "Écuyer Hugues des Flandres",
              "role": "Piqueur et Guetteur de Brume",
              "weapon": "Arbalète Lourde & Dague de Miséricorde",
              "weaponId": "wpn_dark_ages_norman_heavy_crossbow",
              "vitalityRatio": 1.35,
              "hp": 760,
              "armor": 70,
              "trophy": "Dague Rondel Rompue contre la Cuirasse Yautja"
          }
      ]
  },
  {
      "id": "squad_pred_congo_river_ivory_poachers",
      "name": "Expédition Braconnière du Fleuve Congo — Jungle Tales (1994)",
      "universe": "PREDATOR",
      "shortName": "Braconniers du Congo (3 Chasseurs)",
      "category": "PARAMILITARY_INSURGENTS",
      "scale": "MOYEN",
      "totalMembers": 3,
      "originMedia": "Predator: Jungle Tales (1994)",
      "biomeId": "jungle",
      "recommendedBiomeLabel": "Bassin Équatorial du Congo (1928)",
      "primaryMapId": "map_pred_congo_river_rapids",
      "weaponLoadout": [
          "wpn_congo_river_ivory_hunter_rifle"
      ],
      "description": "Trafiquants d'ivoire impitoyables armés de carabines .577 Nitro Express, traquant le Démon des Rapides au cœur de la canopée équatoriale.",
      "tactics": "Tirs croisés synchronisés de gros calibre pour briser les membres, tirs d'aveuglement au phosphore et battue avec chiens de meute.",
      "totalHonorReward": 7600,
      "soloVariantId": "prey_young_blood_initiate",
      "members": [
          {
              "id": "kapita_van_houten",
              "name": "Commandant Van Houten",
              "role": "Chasseur Professionnel de Gros Gibier",
              "weapon": "Carabine Double Express .577 Nitro",
              "weaponId": "wpn_congo_river_ivory_hunter_rifle",
              "vitalityRatio": 1.5,
              "hp": 870,
              "armor": 70,
              "trophy": "Casque Colonial Renforcé et Bandoulière de .577 Nitro"
          },
          {
              "id": "tracker_kabila",
              "name": "Pisteur Kabila",
              "role": "Pisteur Équatorial Vétéran",
              "weapon": "Carabine Double Express Africaine",
              "weaponId": "wpn_congo_river_ivory_hunter_rifle",
              "vitalityRatio": 1.4,
              "hp": 800,
              "armor": 65,
              "trophy": "Amulette d'Ivoire Sculptée d'Écailles Reptiliennes"
          },
          {
              "id": "gunner_marcel",
              "name": "Artificier Marcel",
              "role": "Canonnier Fluvial & Braconnier",
              "weapon": "Carabine Double Express & Cartouches Explosives",
              "weaponId": "wpn_congo_river_ivory_hunter_rifle",
              "vitalityRatio": 1.35,
              "hp": 770,
              "armor": 60,
              "trophy": "Boussole de Navigation Fluviale Givrée de Sang"
          }
      ]
  },
  {
      "id": "squad_alien_taste_agri_security_sentry",
      "name": "Détachement de Décontamination Batavia — Aliens: Taste (1993)",
      "universe": "ALIEN",
      "shortName": "Sécurité Batavia (3 Sentinelles)",
      "category": "CORPORATE_SECURITY",
      "scale": "MOYEN",
      "totalMembers": 3,
      "originMedia": "Aliens: Taste (1993)",
      "biomeId": "stargazer_blacksite",
      "recommendedBiomeLabel": "Complexe Agro-Industriel Batavia (2167)",
      "primaryMapId": "map_alien_automated_food_silos",
      "weaponLoadout": [
          "wpn_taste_agri_combustion_torch"
      ],
      "description": "Équipe de désinfection bio-industrielle déployée avec des torches thermiques haute température pour éradiquer les foyers de contamination parasitaire.",
      "tactics": "Jets continus de naphtalène et balayage thermique de zone, confinement systématique des portes et aspersions de mousse caustique.",
      "totalHonorReward": 7700,
      "soloVariantId": "prey_weyland_combat_android",
      "members": [
          {
              "id": "officer_vance_batavia",
              "name": "Superviseur Vance",
              "role": "Officier de Sécurité Biochimique",
              "weapon": "Torche Thermique Industrielle & Pistolet Caustique",
              "weaponId": "wpn_taste_agri_combustion_torch",
              "vitalityRatio": 1.5,
              "hp": 860,
              "armor": 80,
              "trophy": "Visière Respiratoire Pressurisée Teintée d'Ambre"
          },
          {
              "id": "synthetic_unit_sigma",
              "name": "Unité Synthétique Sigma-4",
              "role": "Opérateur Androïde Ignifugé",
              "weapon": "Torche Thermique Industrielle Haute Pression",
              "weaponId": "wpn_taste_agri_combustion_torch",
              "vitalityRatio": 1.55,
              "hp": 900,
              "armor": 85,
              "trophy": "Processeur Central Synthétique Résistant à la Flamme"
          },
          {
              "id": "purger_elena_batavia",
              "name": "Purificatrice Elena",
              "role": "Purger de Silos Céréaliers",
              "weapon": "Torche Thermique Industrielle & Réservoir Dorsal",
              "weaponId": "wpn_taste_agri_combustion_torch",
              "vitalityRatio": 1.35,
              "hp": 780,
              "armor": 70,
              "trophy": "Manomètre de Réservoir d'Ozone Déchiqueté"
          }
      ]
  },
  {
      "id": "squad_alien_border_lines_frontier_miners",
      "name": "Brigade d'Excavation de K-411 — Aliens: Border Lines (1997)",
      "universe": "ALIEN",
      "shortName": "Mineurs de K-411 (3 Foreurs)",
      "category": "PARAMILITARY_INSURGENTS",
      "scale": "MOYEN",
      "totalMembers": 3,
      "originMedia": "Aliens: Border Lines (1997)",
      "biomeId": "bouvetoya_pyramid",
      "recommendedBiomeLabel": "Mine Glaciaire de K-411 (2184)",
      "primaryMapId": "map_alien_ice_frontier_outpost",
      "weaponLoadout": [
          "wpn_border_lines_subzero_pneumatic_pick"
      ],
      "description": "Mineurs de permafrost aguerris armés de pics pneumatiques lourds oscillant à 2400 bpm, retranchés contre la ruche dans le blizzard polaire.",
      "tactics": "Pilonnage cinétique à bout portant pour pulvériser carapaces et armures, emploi de charges de dégivrage et embuscades dans les galeries de glace.",
      "totalHonorReward": 7800,
      "soloVariantId": "prey_xeno_warrior",
      "members": [
          {
              "id": "chief_karpov_k411",
              "name": "Contremaître Karpov",
              "role": "Chef de Fosse Cryogénique",
              "weapon": "Pic Pneumatique Lourd & Foreuse Rotative",
              "weaponId": "wpn_border_lines_subzero_pneumatic_pick",
              "vitalityRatio": 1.55,
              "hp": 910,
              "armor": 80,
              "trophy": "Harnais de Minage Polaire Bordé de Fourrure et de Givre"
          },
          {
              "id": "driller_petrenko",
              "name": "Foreur Petrenko",
              "role": "Piqueur de Stalactites Méthane",
              "weapon": "Pic Pneumatique Lourd Brise-Glace",
              "weaponId": "wpn_border_lines_subzero_pneumatic_pick",
              "vitalityRatio": 1.45,
              "hp": 840,
              "armor": 75,
              "trophy": "Pointe de Tungstène Tordue par l'Impact d'un Exosquelette"
          },
          {
              "id": "blaster_sonia",
              "name": "Artificière Sonia",
              "role": "Dynamiteuse de Permafrost",
              "weapon": "Pic Pneumatique Lourd & Charges Thermiques",
              "weaponId": "wpn_border_lines_subzero_pneumatic_pick",
              "vitalityRatio": 1.4,
              "hp": 810,
              "armor": 70,
              "trophy": "Détonateur Cryogénique Manuel Déformé"
          }
      ]
  },
  {
      "id": "squad_avp_old_secrets_aztec_priests",
      "name": "Garde Sacrificielle de Tenochtitlan — Old Secrets (1492)",
      "universe": "AVP",
      "shortName": "Garde Sacrificielle Aztèque (3 Guerriers)",
      "category": "PARAMILITARY_INSURGENTS",
      "scale": "MOYEN",
      "totalMembers": 3,
      "originMedia": "Aliens vs. Predator: Old Secrets (Dark Horse 1999)",
      "biomeId": "bouvetoya_pyramid",
      "recommendedBiomeLabel": "Complexe Pyramidal de Tenochtitlan (1492)",
      "primaryMapId": "map_avp_tenochtitlan_ceremonial_steps",
      "weaponLoadout": [
          "wpn_old_secrets_obsidian_macana_blade"
      ],
      "description": "Guerriers-Jaguars d'élite et grands prêtres sacrificiels armés de macanas aux lames d'obsidienne tranchante vénérant les Dieux Serpents et Démons Étoilés.",
      "tactics": "Assauts frénétiques au corps-à-corps avec lacérations hémorragiques, encerclement sur les marches de la pyramide et invocations fanatiques.",
      "totalHonorReward": 7900,
      "soloVariantId": "prey_colonial_marine_heavy",
      "members": [
          {
              "id": "high_priest_cuauhtemoc",
              "name": "Grand Prêtre Cuauhtemoc",
              "role": "Maître du Culte Sacrificiel Solaire",
              "weapon": "Macana Cérémonielle d'Obsidienne & Poignard",
              "weaponId": "wpn_old_secrets_obsidian_macana_blade",
              "vitalityRatio": 1.5,
              "hp": 880,
              "armor": 75,
              "trophy": "Coiffe de Plumes de Quetzal et Disque Pectoral d'Or Gravé"
          },
          {
              "id": "jaguar_champion_tlaloc",
              "name": "Champion-Jaguar Tlaloc",
              "role": "Guerrier Suprême de la Fraternité",
              "weapon": "Macana Cérémonielle d'Obsidienne Tranchante",
              "weaponId": "wpn_old_secrets_obsidian_macana_blade",
              "vitalityRatio": 1.5,
              "hp": 890,
              "armor": 80,
              "trophy": "Masque en Peau de Jaguar aux Crocs Incrustés de Jade"
          },
          {
              "id": "acolyte_huitzilin",
              "name": "Acolyte Huitzilin",
              "role": "Gardien du Brasero Sacré",
              "weapon": "Macana d'Obsidienne & Braises Incandescentes",
              "weaponId": "wpn_old_secrets_obsidian_macana_blade",
              "vitalityRatio": 1.35,
              "hp": 780,
              "armor": 65,
              "trophy": "Collier de Doigts Humains et Griffes de Serpent d'Acide"
          }
      ]
  },
  {
      "id": "squad_avp_mothership_elder_honor_guard",
      "name": "Garde Cérémonielle des Anciens — AVP Legends",
      "universe": "AVP",
      "shortName": "Garde d'Honneur des Anciens (3 Vétérans)",
      "category": "PARAMILITARY_INSURGENTS",
      "scale": "MOYEN",
      "totalMembers": 3,
      "originMedia": "Aliens vs. Predator: Trophy Room Lore",
      "biomeId": "stargazer_blacksite",
      "recommendedBiomeLabel": "Vaisseau-Mère Yautja — Hall Cérémoniel (2204)",
      "primaryMapId": "map_avp_mothership_grand_trophy_gallery",
      "weaponLoadout": [
          "wpn_mothership_ceremonial_plasma_dagger"
      ],
      "description": "Garde d'élite des Maîtres de Clan Yautja, armée de dagues cérémonielles plasma à confinement d'argent et veillant sur les reliques millénaires.",
      "tactics": "Duels d'honneur au corps-à-corps, frappes chirurgicales d'estoc tranchant les boucliers d'énergie et parades parfaites aux lames sacrées.",
      "totalHonorReward": 8200,
      "soloVariantId": "prey_colonial_marine_heavy",
      "members": [
          {
              "id": "elder_sentinel_gorgor",
              "name": "Sentinelle Ancestrale Gorgor",
              "role": "Gardien du Sanctuaire des Crânes",
              "weapon": "Dague Cérémonielle Plasma & Bouclier d'Argent",
              "weaponId": "wpn_mothership_ceremonial_plasma_dagger",
              "vitalityRatio": 1.6,
              "hp": 950,
              "armor": 90,
              "trophy": "Bio-Masque Cérémoniel Millénaire aux Runes d'Or Gravées"
          },
          {
              "id": "blade_master_vhol",
              "name": "Maître d'Armes Vhol",
              "role": "Champion des Rites d'Initiation",
              "weapon": "Double Dague Cérémonielle de Plasma",
              "weaponId": "wpn_mothership_ceremonial_plasma_dagger",
              "vitalityRatio": 1.5,
              "hp": 890,
              "armor": 85,
              "trophy": "Gantelet d'Honneur Ciselé d'un Insigne de Reine Terrassée"
          },
          {
              "id": "acolyte_shok",
              "name": "Gardien de Cryo-Stase Shok",
              "role": "Vigilant des Reliques Interdites",
              "weapon": "Dague Cérémonielle Plasma & Grenades Électrostatiques",
              "weaponId": "wpn_mothership_ceremonial_plasma_dagger",
              "vitalityRatio": 1.45,
              "hp": 840,
              "armor": 80,
              "trophy": "Sceau de Déverrouillage des Coffres de Trophées d'Ingénieur"
          }
      ]
  },
  {
      "id": "squad_pred_demons_gold_conquistadors",
      "name": "Avant-Garde des Conquistadors du Yucatán — Demon's Gold (1519)",
      "universe": "PREDATOR",
      "shortName": "Conquistadors du Yucatán (3 Soldats)",
      "category": "PARAMILITARY_INSURGENTS",
      "scale": "MOYEN",
      "totalMembers": 3,
      "originMedia": "Predator: Demon's Gold (Dark Horse 1999)",
      "biomeId": "jungle",
      "recommendedBiomeLabel": "Cénote Sacré du Yucatán (1519)",
      "primaryMapId": "map_pred_yucatan_cenote_conquistador",
      "weaponLoadout": [
          "wpn_demons_gold_spanish_matchlock_arquebus"
      ],
      "description": "Détachement de conquistadors espagnols bardés de fer et arquebusiers de Tolède retranchés autour d'un trésor d'or sacré au fond d'un cénote.",
      "tactics": "Tirs d'arquebuse en volée coordonnée pour couvrir les rechargements à la mèche, barrage de piques d'acier et charges d'estoc désespérées.",
      "totalHonorReward": 7700,
      "soloVariantId": "prey_feral_predator_1719",
      "members": [
          {
              "id": "capitan_don_diego",
              "name": "Capitán Don Diego de Almagro",
              "role": "Capitaine de Tercio Espagnol",
              "weapon": "Arquebuse à Mèche .75 & Rapière de Tolède",
              "weaponId": "wpn_demons_gold_spanish_matchlock_arquebus",
              "vitalityRatio": 1.5,
              "hp": 890,
              "armor": 85,
              "trophy": "Morion d'Acier Forgé et Plastron aux Armoiries de Castille"
          },
          {
              "id": "arcabucero_rodrigo",
              "name": "Arquebusier Rodrigo",
              "role": "Tireur de Précision à Poudre Noire",
              "weapon": "Arquebuse Lourde de Tolède Calibre .75",
              "weaponId": "wpn_demons_gold_spanish_matchlock_arquebus",
              "vitalityRatio": 1.4,
              "hp": 820,
              "armor": 75,
              "trophy": "Poire à Poudre Ciselée d'Argent et Mèche Lente Incandescente"
          },
          {
              "id": "piquero_mateo",
              "name": "Piquier Mateo",
              "role": "Garde de Corps et Sentinelle",
              "weapon": "Arquebuse à Mèche & Dague Main-Gauche",
              "weaponId": "wpn_demons_gold_spanish_matchlock_arquebus",
              "vitalityRatio": 1.35,
              "hp": 770,
              "armor": 70,
              "trophy": "Dague Main-Gauche Espagnole Brisée contre l'Armure Yautja"
          }
      ]
  },
  {
      "id": "squad_pred_borneo_rubber_expedition",
      "name": "Expédition Forestière de Bornéo — Heart of Darkness (1912)",
      "universe": "PREDATOR",
      "shortName": "Garde Forestière de Bornéo (3 Pisteurs)",
      "category": "PARAMILITARY_INSURGENTS",
      "scale": "MOYEN",
      "totalMembers": 3,
      "originMedia": "Predator: Heart of Darkness (Dark Horse 1999)",
      "biomeId": "jungle",
      "recommendedBiomeLabel": "Haute Canopée de Bornéo (1912)",
      "primaryMapId": "map_pred_borneo_primary_rainforest",
      "weaponLoadout": [
          "wpn_borneo_colonial_repeating_carbine"
      ],
      "description": "Explorateurs coloniaux et maîtres-pisteurs équipés de carabines à répétition .44-40 traquant l'Esprit des Arbres dans la jungle équatoriale.",
      "tactics": "Tirs cadencés de sous-garde depuis les passerelles aériennes, utilisation de torches au magnésium pour percer la pluie et embuscades de canopée.",
      "totalHonorReward": 7800,
      "soloVariantId": "prey_young_blood_initiate",
      "members": [
          {
              "id": "superintendent_wallace",
              "name": "Superintendant Wallace",
              "role": "Chef d'Expédition de la Compagnie",
              "weapon": "Carabine à Répétition .44-40 & Machette",
              "weaponId": "wpn_borneo_colonial_repeating_carbine",
              "vitalityRatio": 1.5,
              "hp": 880,
              "armor": 70,
              "trophy": "Montre à Gousset Coloniale en Or Éclaboussée de Sang"
          },
          {
              "id": "tracker_tengku",
              "name": "Pisteur Tengku",
              "role": "Guetteur de Canopée Équatoriale",
              "weapon": "Carabine à Répétition Coloniale de Bornéo",
              "weaponId": "wpn_borneo_colonial_repeating_carbine",
              "vitalityRatio": 1.45,
              "hp": 830,
              "armor": 65,
              "trophy": "Trompe d'Alarme en Bois de Teck Sculptée d'Écailles"
          },
          {
              "id": "scout_kassim",
              "name": "Éclaireur Kassim",
              "role": "Tireur d'Élite Fluvial",
              "weapon": "Carabine .44-40 & Cartouches Renforcées",
              "weaponId": "wpn_borneo_colonial_repeating_carbine",
              "vitalityRatio": 1.35,
              "hp": 790,
              "armor": 65,
              "trophy": "Cartouchière en Cuir Tropical Moussu et Trempé de Pluie"
          }
      ]
  },
  {
      "id": "squad_alien_sacrifice_lv178_cultists",
      "name": "Cénobites Fanatiques de LV-178 — Aliens: Sacrifice (1993)",
      "universe": "ALIEN",
      "shortName": "Cénobites de LV-178 (3 Zélotes)",
      "category": "PARAMILITARY_INSURGENTS",
      "scale": "MOYEN",
      "totalMembers": 3,
      "originMedia": "Aliens: Sacrifice (1993)",
      "biomeId": "bouvetoya_pyramid",
      "recommendedBiomeLabel": "Carrière Cénobite de LV-178 (2174)",
      "primaryMapId": "map_alien_lv178_monastic_quarry",
      "weaponLoadout": [
          "wpn_sacrifice_lv178_heavy_pneumatic_chisel"
      ],
      "description": "Carriers et prêtres fanatiques armés de ciseaux pneumatiques lourds de taille de basalte offrant leur vie et celles des intrus aux Anges Noirs.",
      "tactics": "Assauts kamikazes au contact de mêlée avec percussions pneumatiques ultra-violentes, projections d'acide de fumerolles et ferveur sacrificielle.",
      "totalHonorReward": 7900,
      "soloVariantId": "prey_xeno_warrior",
      "members": [
          {
              "id": "prior_malachi_lv178",
              "name": "Prieur Malachi",
              "role": "Hiérophante du Culte de l'Ange Noir",
              "weapon": "Ciseau Pneumatique de Basalte & Faux Sacrée",
              "weaponId": "wpn_sacrifice_lv178_heavy_pneumatic_chisel",
              "vitalityRatio": 1.55,
              "hp": 920,
              "armor": 80,
              "trophy": "Robe Cénobite en Tissu de Verre Imbibée de Résine Xénomorphe"
          },
          {
              "id": "quarryman_gideon",
              "name": "Carrier Gideon",
              "role": "Foreur de Basalte Fanatique",
              "weapon": "Ciseau Pneumatique Lourd à Percussion 3000 bpm",
              "weaponId": "wpn_sacrifice_lv178_heavy_pneumatic_chisel",
              "vitalityRatio": 1.45,
              "hp": 850,
              "armor": 75,
              "trophy": "Burin de Diamant Industriel Usé par les Carapaces Noires"
          },
          {
              "id": "acolyte_judas",
              "name": "Acolyte Judas",
              "role": "Pénitent Porte-Flamme",
              "weapon": "Ciseau Pneumatique & Bombe Minérale de Soufre",
              "weaponId": "wpn_sacrifice_lv178_heavy_pneumatic_chisel",
              "vitalityRatio": 1.4,
              "hp": 800,
              "armor": 70,
              "trophy": "Masque Respiratoire Souillé de Poussière de Basalte et Sang"
          }
      ]
  },
  {
      "id": "squad_alien_defiance_weyland_security_detail",
      "name": "Détachement de Sécurité de l'Europa — Aliens: Defiance (2016)",
      "universe": "ALIEN",
      "shortName": "Sécurité Europa (3 Agents)",
      "category": "CORPORATE_SECURITY",
      "scale": "MOYEN",
      "totalMembers": 3,
      "originMedia": "Aliens: Defiance (2016)",
      "biomeId": "stargazer_blacksite",
      "recommendedBiomeLabel": "Cargo Stellaire Europa (2137)",
      "primaryMapId": "map_alien_europa_transport_corridors",
      "weaponLoadout": [
          "wpn_defiance_concussion_subcarbine_cr54"
      ],
      "description": "Garde corporative Weyland-Yutani lourdement entraînée au combat pressurisé en coursive et androïdes tactiques de classe Davis.",
      "tactics": "Tirs de saturation subsoniques au PM Armat CR-54, pose de barrières étanches automatisées et coordination cybernétique millimétrée.",
      "totalHonorReward": 8000,
      "soloVariantId": "prey_weyland_combat_android",
      "members": [
          {
              "id": "commander_tate_europa",
              "name": "Commandant Tate",
              "role": "Chef de la Sécurité Interne Weyland",
              "weapon": "Pistolet-Mitrailleur Armat CR-54 & Taser de Bord",
              "weaponId": "wpn_defiance_concussion_subcarbine_cr54",
              "vitalityRatio": 1.5,
              "hp": 870,
              "armor": 85,
              "trophy": "Insigne de Sécurité Weyland-Yutani Gravé 'Classified Bio-Asset'"
          },
          {
              "id": "synthetic_davis_unit_9",
              "name": "Unité Davis-09",
              "role": "Opérateur Tactique Synthétique Autonome",
              "weapon": "Pistolet-Mitrailleur Armat CR-54 à Cadence Régulée",
              "weaponId": "wpn_defiance_concussion_subcarbine_cr54",
              "vitalityRatio": 1.55,
              "hp": 910,
              "armor": 90,
              "trophy": "Noyau Cybernétique Davis-09 avec Protocoles Weyland Neutralisés"
          },
          {
              "id": "enforcer_reyes",
              "name": "Exécuteur Reyes",
              "role": "Spécialiste de Confinement Pressurisé",
              "weapon": "Pistolet-Mitrailleur Armat CR-54 & Grenades Choc",
              "weaponId": "wpn_defiance_concussion_subcarbine_cr54",
              "vitalityRatio": 1.4,
              "hp": 810,
              "armor": 75,
              "trophy": "Visière Tactique Weyland Enregistrant le Dernier Rapport d'Action"
          }
      ]
  },
  {
      "id": "squad_avp_tethys_deep_dive_harpooners",
      "name": "Plongeurs Abyssaux de Téthys — AVP: Blood Tide (2202)",
      "universe": "AVP",
      "shortName": "Plongeurs de Téthys (3 Harponneurs)",
      "category": "PARAMILITARY_INSURGENTS",
      "scale": "MOYEN",
      "totalMembers": 3,
      "originMedia": "Aliens vs. Predator: Blood Tide (2002)",
      "biomeId": "stargazer_blacksite",
      "recommendedBiomeLabel": "Station Abyssale de Téthys (2202)",
      "primaryMapId": "map_avp_tethys_abyssal_research_trench",
      "weaponLoadout": [
          "wpn_tethys_abyssal_harpoon_lance"
      ],
      "description": "Tirailleurs sous-marins d'élite en scaphandres pressurisés pour grands fonds armés de fusils-harpons à super-cavitation.",
      "tactics": "Tirs de harpons perforants à cavitation sous-marine créant des ondes de choc hydrauliques, mobilité tridimensionnelle et grenades acoustiques.",
      "totalHonorReward": 8100,
      "soloVariantId": "prey_colonial_marine_heavy",
      "members": [
          {
              "id": "captain_finch_tethys",
              "name": "Capitaine Finch",
              "role": "Vétéran de Plongée Abyssale Profonde",
              "weapon": "Lance-Harpon Abyssal à Cavitation & Dague Titane",
              "weaponId": "wpn_tethys_abyssal_harpoon_lance",
              "vitalityRatio": 1.55,
              "hp": 920,
              "armor": 85,
              "trophy": "Casque de Plongée Abyssale Fissuré Résistant à 800 Bars"
          },
          {
              "id": "diver_kruger",
              "name": "Harponneur Kruger",
              "role": "Tireur d'Élite Sous-Marin",
              "weapon": "Lance-Harpon Abyssal à Cavitation de Téthys",
              "weaponId": "wpn_tethys_abyssal_harpoon_lance",
              "vitalityRatio": 1.45,
              "hp": 860,
              "armor": 80,
              "trophy": "Pointe de Harpon d'Uranium Appauvri Emoussée par l'Acide"
          },
          {
              "id": "diver_yoko",
              "name": "Nageuse de Combat Yoko",
              "role": "Opératrice de Balise Bathymétrique",
              "weapon": "Lance-Harpon à Cavitation & Grenades Sonar",
              "weaponId": "wpn_tethys_abyssal_harpoon_lance",
              "vitalityRatio": 1.4,
              "hp": 820,
              "armor": 75,
              "trophy": "Propulseur Dorsal de Scaphandre Lacéré par des Griffes Yautja"
          }
      ]
  },
  {
      "id": "squad_avp_elder_council_honor_arbiters",
      "name": "Arbitres de Justice du Haut Conseil — Yautja Prime Legends",
      "universe": "AVP",
      "shortName": "Arbitres du Conseil (3 Juges)",
      "category": "PARAMILITARY_INSURGENTS",
      "scale": "MOYEN",
      "totalMembers": 3,
      "originMedia": "Aliens vs. Predator: High Elder Council Protocols",
      "biomeId": "bouvetoya_pyramid",
      "recommendedBiomeLabel": "Yautja Prime — Haute Citadelle (2215)",
      "primaryMapId": "map_avp_yautja_prime_grand_council_citadel",
      "weaponLoadout": [
          "wpn_elder_council_ceremonial_halberd"
      ],
      "description": "Juges et exécuteurs suprêmes des lois martiales de Yautja Prime, armés de hallebardes cérémonielles à champ de plasma doré confiné.",
      "tactics": "Exécution de sentences d'honneur avec frappes tranchantes circulaires dévastatrices, parades impénétrables et téléportation rituelle.",
      "totalHonorReward": 8500,
      "soloVariantId": "prey_colonial_marine_heavy",
      "members": [
          {
              "id": "supreme_arbiter_drakh",
              "name": "Grand Arbitre Drakh",
              "role": "Juge Suprême des Lois de la Chasse",
              "weapon": "Hallebarde Cérémonielle & Lame de Poignet en Or",
              "weaponId": "wpn_elder_council_ceremonial_halberd",
              "vitalityRatio": 1.65,
              "hp": 980,
              "armor": 95,
              "trophy": "Bio-Masque Cérémoniel du Grand Conseil Incrusté d'Opales"
          },
          {
              "id": "justiciar_thwei",
              "name": "Justicier Thwei",
              "role": "Bourreau des Clans Renégats",
              "weapon": "Hallebarde de Justice Cérémonielle du Haut Conseil",
              "weaponId": "wpn_elder_council_ceremonial_halberd",
              "vitalityRatio": 1.55,
              "hp": 920,
              "armor": 90,
              "trophy": "Sceau de Condamnation Bad Blood Gravé dans la Pierre Stellaire"
          },
          {
              "id": "herald_kaail",
              "name": "Héraut Kaail",
              "role": "Gardien des Annales de Jugement",
              "weapon": "Hallebarde Cérémonielle & Émetteur de Glyphes",
              "weaponId": "wpn_elder_council_ceremonial_halberd",
              "vitalityRatio": 1.5,
              "hp": 870,
              "armor": 85,
              "trophy": "Gantelet Cérémoniel Ancestral Porteur des Décrets Royaux"
          }
      ]
  }
]);

export function getSquadById(squadId) {
  return SQUAD_ENCOUNTERS.find((s) => s.id === squadId) || null;
}

export function getSquadsByBiome(biomeId) {
  return SQUAD_ENCOUNTERS.filter((s) => s.biomeId === biomeId || s.biomeId === 'all');
}

export function filterSquadsByCategory(category) {
  if (!category || category === 'all') return [...SQUAD_ENCOUNTERS];
  return SQUAD_ENCOUNTERS.filter((s) => s.category === category);
}

export default SQUAD_ENCOUNTERS;
