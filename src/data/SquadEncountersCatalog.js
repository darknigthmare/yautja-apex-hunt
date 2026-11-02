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
    soloVariantId: 'alien_base_dwayne_hicks_corporal',
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
