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
