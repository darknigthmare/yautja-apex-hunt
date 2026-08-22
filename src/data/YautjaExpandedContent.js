// Extension de couverture franchise pour la passe contenu 1.3.
// Les concepts issus d'une œuvre gardent leur provenance ; leurs effets de jeu
// et leurs géométries procédurales restent des adaptations originales Apex Hunt.

export const EXPANDED_MASK_VARIANTS = [
  {
    id: 'mask_chopper_avp', name: 'Chopper — rite AVP', sourceTier: 'AVP_SCREEN',
    description: 'Biomasque du jeune chasseur Chopper, associé à ses longues lames de poignet.',
    sources: ['avp2004'], gameplay: 'Profil de mêlée lisible avec crête courte et garde mandibulaire.',
    shape: 'ritual', lensColor: 0xff3222, armorColor: 0x797364, scale: 1.05,
    geometry: { browWidth: 1.1, jawLength: 1.03, crestHeight: 0.28, cheekGuard: 0.55 },
  },
  {
    id: 'mask_elder_lost_tribe_1990', name: 'Ancien du Lost Tribe', sourceTier: 'SCREEN',
    description: 'Interprétation procédurale du masque de l’Ancien aperçu avec le clan à Los Angeles.',
    sources: ['predator2'], gameplay: 'Silhouette cérémonielle élargie pour une apparence de vétéran.',
    shape: 'ancestral', lensColor: 0xff2518, armorColor: 0x8b806a, scale: 1.08,
    geometry: { browWidth: 1.18, jawLength: 0.94, crestHeight: 0.44, cheekGuard: 0.62 },
  },
  {
    id: 'mask_fugitive_2018', name: 'Fugitive — 2018', sourceTier: 'SCREEN',
    description: 'Biomasque métallique porté par le Predator fugitif de l’incident Stargazer.',
    sources: ['thePredator2018'], gameplay: 'Lecture technologique nette et profil compact de chasseur mobile.',
    shape: 'fugitive', lensColor: 0xff3028, armorColor: 0x667078, scale: 0.99,
    geometry: { browWidth: 1.02, jawLength: 0.9, crestHeight: 0.18, cheekGuard: 0.38 },
  },
  {
    id: 'mask_kok_viking', name: 'Chasseur de l’ère viking', sourceTier: 'SCREEN',
    description: 'Masque inspiré du chasseur affronté dans le segment viking de Killer of Killers.',
    sources: ['killerOfKillers'], gameplay: 'Profil lourd, large et marqué pour les duels frontaux.',
    shape: 'kok_viking', lensColor: 0xff351f, armorColor: 0x625744, scale: 1.1,
    geometry: { browWidth: 1.2, jawLength: 1.04, crestHeight: 0.3, cheekGuard: 0.65 },
  },
  {
    id: 'mask_kok_feudal', name: 'Chasseur du Japon féodal', sourceTier: 'SCREEN',
    description: 'Masque inspiré du chasseur du segment japonais de Killer of Killers.',
    sources: ['killerOfKillers'], gameplay: 'Profil resserré et crête verticale adapté à une silhouette de duelliste.',
    shape: 'samurai', lensColor: 0xff2722, armorColor: 0x4c514b, scale: 1.03,
    geometry: { browWidth: 0.96, jawLength: 1.08, crestHeight: 0.48, cheekGuard: 0.46 },
  },
  {
    id: 'mask_kok_wartime', name: 'Chasseur de l’ère aérienne', sourceTier: 'SCREEN',
    description: 'Masque inspiré du chasseur du segment aérien du XXe siècle de Killer of Killers.',
    sources: ['killerOfKillers'], gameplay: 'Optiques accentuées et front bas pour une apparence de poursuite à grande vitesse.',
    shape: 'aerial', lensColor: 0xff4625, armorColor: 0x4d5d62, scale: 1,
    geometry: { browWidth: 1.06, jawLength: 0.93, crestHeight: 0.16, cheekGuard: 0.42 },
  },
  {
    id: 'mask_kwei_badlands', name: 'Kwei — guerrier du clan', sourceTier: 'SCREEN',
    description: 'Interprétation procédurale de la silhouette de Kwei dans Badlands.',
    sources: ['badlands2025'], gameplay: 'Masque de duel robuste, visuellement distinct de celui de Dek.',
    shape: 'kwei', lensColor: 0xff4424, armorColor: 0x5a5042, scale: 1.08,
    geometry: { browWidth: 1.14, jawLength: 1.06, crestHeight: 0.27, cheekGuard: 0.58 },
  },
  {
    id: 'mask_alpha_hg', name: 'Alpha Predator', sourceTier: 'LICENSED_EU',
    description: 'Masque ancestral du concept Alpha intégré au jeu licencié Hunting Grounds.',
    sources: ['huntingGrounds'], gameplay: 'Crête osseuse et mâchoire longue pour une variante cérémonielle.',
    shape: 'bone', lensColor: 0xff4725, armorColor: 0xb9aa87, scale: 1.09,
    geometry: { browWidth: 1.12, jawLength: 1.14, crestHeight: 0.42, cheekGuard: 0.52 },
  },
  {
    id: 'mask_captured_hg', name: 'Captured Predator', sourceTier: 'LICENSED_EU',
    description: 'Variante Captured proposée dans le contenu licencié Hunting Grounds.',
    sources: ['huntingGrounds'], gameplay: 'Lecture classique avec impacts et plaques assombries.',
    shape: 'classic', lensColor: 0xff3024, armorColor: 0x4d5147, scale: 1,
    geometry: { browWidth: 1.08, jawLength: 0.9, crestHeight: 0.2, cheekGuard: 0.44 },
  },
  {
    id: 'mask_cleopatra_hg', name: 'Cleopatra', sourceTier: 'LICENSED_EU',
    description: 'Masque de la classe Cleopatra du contenu licencié Hunting Grounds.',
    sources: ['huntingGrounds'], gameplay: 'Ornement frontal haut et plaques dorées pour une silhouette royale.',
    shape: 'royal', lensColor: 0xff2a2a, armorColor: 0x9d7b3f, scale: 1.07,
    geometry: { browWidth: 1.12, jawLength: 1, crestHeight: 0.52, cheekGuard: 0.6 },
  },
  {
    id: 'mask_exiled_hg', name: 'Exiled Predator', sourceTier: 'LICENSED_EU',
    description: 'Masque de la classe Exiled du contenu licencié Hunting Grounds.',
    sources: ['huntingGrounds'], gameplay: 'Profil asymétrique sombre pour une apparence de chasseur banni.',
    shape: 'exile', lensColor: 0xff3e25, armorColor: 0x403d38, scale: 1.02,
    geometry: { browWidth: 1.04, jawLength: 1.1, crestHeight: 0.33, cheekGuard: 0.48 },
  },
  {
    id: 'mask_samurai_hg', name: 'Samurai Predator', sourceTier: 'LICENSED_EU',
    description: 'Masque de la classe Samurai du contenu licencié Hunting Grounds.',
    sources: ['huntingGrounds'], gameplay: 'Crête verticale et joues renforcées pour un profil de duel.',
    shape: 'samurai', lensColor: 0xff2620, armorColor: 0x6b342e, scale: 1.05,
    geometry: { browWidth: 1, jawLength: 1.05, crestHeight: 0.5, cheekGuard: 0.56 },
  },
  {
    id: 'mask_gladiator_hg', name: 'Gladiator Predator', sourceTier: 'LICENSED_EU',
    description: 'Silhouette procédurale inspirée de la classe Gladiator du contenu licencié Hunting Grounds.',
    sources: ['huntingGroundsUpdates'], gameplay: 'Front large, garde mandibulaire lourde et crête courte pour le combat d’arène.',
    shape: 'celtic', lensColor: 0xff321d, armorColor: 0x694638, scale: 1.09,
    geometry: { browWidth: 1.2, jawLength: 1.08, crestHeight: 0.35, cheekGuard: 0.7 },
  },
  {
    id: 'mask_anubis_hg', name: 'Anubis Predator', sourceTier: 'LICENSED_EU',
    description: 'Silhouette procédurale inspirée de la classe Anubis du contenu licencié Hunting Grounds.',
    sources: ['huntingGroundsUpdates'], gameplay: 'Masque royal élancé aux plaques dorées, associé au canon Eye of Ra.',
    shape: 'royal', lensColor: 0xff5220, armorColor: 0x9a783d, scale: 1.08,
    geometry: { browWidth: 1.06, jawLength: 1.16, crestHeight: 0.62, cheekGuard: 0.54 },
  },
  {
    id: 'mask_exalted_hg', name: 'Exalted Predator', sourceTier: 'LICENSED_EU',
    description: 'Silhouette procédurale inspirée de la classe Exalted du contenu licencié Hunting Grounds.',
    sources: ['huntingGroundsUpdates'], gameplay: 'Profil cérémoniel ancien, crête verticale et front renforcé de chef de clan.',
    shape: 'ancestral', lensColor: 0xff2c25, armorColor: 0x77684f, scale: 1.11,
    geometry: { browWidth: 1.16, jawLength: 1.02, crestHeight: 0.66, cheekGuard: 0.64 },
  },
  {
    id: 'mask_witch_hg', name: 'Witch Predator', sourceTier: 'LICENSED_EU',
    description: 'Silhouette procédurale inspirée de la classe Witch du contenu licencié Hunting Grounds.',
    sources: ['huntingGroundsUpdates'], gameplay: 'Profil rituel étroit, pointe frontale haute et finition sombre de traqueuse.',
    shape: 'ritual', lensColor: 0xe43827, armorColor: 0x443d42, scale: 1.03,
    geometry: { browWidth: 0.93, jawLength: 1.1, crestHeight: 0.58, cheekGuard: 0.43 },
  },
  {
    id: 'mask_oni_hg', name: 'Oni Predator', sourceTier: 'LICENSED_EU',
    description: 'Silhouette procédurale inspirée de la classe Oni du contenu licencié Hunting Grounds.',
    sources: ['huntingGroundsUpdates'], gameplay: 'Masque de duel anguleux, garde large et crête haute inspirée des armures oni.',
    shape: 'samurai', lensColor: 0xff1f1a, armorColor: 0x74362f, scale: 1.09,
    geometry: { browWidth: 1.14, jawLength: 1.1, crestHeight: 0.6, cheekGuard: 0.72 },
  },
  {
    id: 'mask_jotun_hg', name: 'Jotun Predator', sourceTier: 'LICENSED_EU',
    description: 'Silhouette procédurale inspirée de la classe Jotun du contenu licencié Hunting Grounds.',
    sources: ['huntingGroundsUpdates'], gameplay: 'Profil osseux massif à défenses, lisible comme chasseur lourd au Shock Gauntlet.',
    shape: 'bone', lensColor: 0x67dfff, armorColor: 0x68747b, scale: 1.15,
    geometry: { browWidth: 1.24, jawLength: 1.18, crestHeight: 0.38, cheekGuard: 0.76 },
  },
  {
    id: 'mask_father_hg', name: 'Father Predator', sourceTier: 'LICENSED_EU',
    description: 'Silhouette procédurale inspirée de la classe Father du contenu licencié Hunting Grounds.',
    sources: ['huntingGroundsUpdates'], gameplay: 'Masque ancestral de vétéran, large et cérémoniel, associé à l’épée Yautja.',
    shape: 'ancestral', lensColor: 0xff3520, armorColor: 0x82745c, scale: 1.13,
    geometry: { browWidth: 1.2, jawLength: 1.08, crestHeight: 0.54, cheekGuard: 0.68 },
  },
];

export const EXPANDED_TECH_CATALOG = [
  { id: 'tech_shuriken_avp', name: 'Shuriken déployable', sourceTier: 'AVP_SCREEN', description: 'Arme étoilée à lames rétractables montrée dans la branche écran AVP.', sources: ['avp2004', 'avpRequiem2007'], gameplay: 'Variante d’archive destinée à un futur lancer multi-cible.', runtimeStatus: 'archive' },
  { id: 'tech_feral_bolt_launcher', name: 'Lance-traits du Feral', sourceTier: 'SCREEN', description: 'Arme de traits guidés utilisée par le chasseur de Prey.', sources: ['prey2022'], gameplay: 'Variante d’archive : salve rapide avec trajectoire liée au viseur.', runtimeStatus: 'archive' },
  { id: 'tech_feral_combistick', name: 'Lance du Feral', sourceTier: 'SCREEN', description: 'Lance démontable et projetable employée durant la chasse de 1719.', sources: ['prey2022'], gameplay: 'Variante d’archive : segments récupérables et allonge variable.', runtimeStatus: 'archive' },
  { id: 'tech_dek_yautja_swords', name: 'Épées Yautja de Dek', sourceTier: 'SCREEN', description: 'Paire d’épées associée à l’équipement d’entraînement de Dek.', sources: ['badlandsGear'], gameplay: 'Variante d’archive : enchaînements doubles et parade croisée.', runtimeStatus: 'archive' },
  { id: 'tech_predator_killer_armor', name: 'Armure Predator Killer', sourceTier: 'SCREEN', description: 'Technologie révélée à la fin de The Predator comme arme de défense contre les chasseurs.', sources: ['thePredator2018'], gameplay: 'Prototype d’archive réservé à un futur événement de laboratoire.', runtimeStatus: 'archive' },
  { id: 'tech_gladiator_trident_hg', name: 'Trident du Gladiator', sourceTier: 'LICENSED_EU', description: 'Arme Predator introduite avec la classe Gladiator dans Hunting Grounds.', sources: ['huntingGroundsUpdates'], gameplay: 'Variante d’archive : lancer multiple et mêlée à longue portée.', runtimeStatus: 'archive' },
  { id: 'tech_eye_of_ra_hg', name: 'Eye of Ra', sourceTier: 'LICENSED_EU', description: 'Variante licenciée du canon à plasma portatif introduite avec Anubis.', sources: ['huntingGroundsUpdates'], gameplay: 'Variante d’archive : trait rapide et tendu, cadence et chargeur réduits.', runtimeStatus: 'archive' },
  { id: 'tech_shock_gauntlet_hg', name: 'Shock Gauntlet', sourceTier: 'LICENSED_EU', description: 'Brassard licencié de Jotun qui projette un champ sonique de répulsion.', sources: ['huntingGroundsUpdates'], gameplay: 'Variante d’archive : repousse un groupe et ouvre une fenêtre de mêlée.', runtimeStatus: 'archive' },
  { id: 'tech_father_yautja_sword_hg', name: 'Épée Yautja du Father', sourceTier: 'LICENSED_EU', description: 'Épée licenciée introduite avec le Father Predator, à tranchant chauffé au plasma.', sources: ['huntingGroundsUpdates'], gameplay: 'Variante d’archive : entaille thermique et pression de garde.', runtimeStatus: 'archive' },
];

export const EXPANDED_VEHICLE_CATALOG = [
  { id: 'vehicle_fugitive_escape_craft', name: 'Appareil du Fugitive', sourceTier: 'SCREEN', description: 'Vaisseau associé à l’arrivée et à la fuite du Predator en 2018.', sources: ['thePredator2018'], role: 'Archive de transport : intrusion orbitale et récupération de technologie.', runtimeStatus: 'archive' },
  { id: 'vehicle_apex_scout_shuttle', name: 'Navette éclaireuse Apex', sourceTier: 'ORIGINAL', description: 'Interprétation originale Apex Hunt : appareil compact procédural visible en survol et dans le hangar.', sources: [], role: 'Rencontre 3D réelle : survol, stationnaire, scan et recharge à proximité.', runtimeStatus: 'encounter' },
  { id: 'vehicle_apex_clan_interceptor', name: 'Intercepteur de clan Apex', sourceTier: 'ORIGINAL', description: 'Interprétation originale Apex Hunt : chasseur rapide aux ailes courtes.', sources: [], role: 'Rencontre 3D réelle utilisée par les contrats de chasseurs rivaux.', runtimeStatus: 'encounter' },
  { id: 'vehicle_apex_cleaner_shuttle', name: 'Navette de confinement Apex', sourceTier: 'ORIGINAL', description: 'Interprétation originale Apex Hunt : appareil de nettoyage conçu pour les zones de ruche.', sources: [], role: 'Rencontre 3D réelle utilisée dans les biomes xénomorphes.', runtimeStatus: 'encounter' },
];

export const EXPANDED_ENEMY_CATALOG = [
  { id: 'enemy_upgrade_predator_2018', name: 'Assassin Predator (dit Upgrade)', sourceTier: 'SCREEN', description: 'Chasseur génétiquement modifié qui poursuit le Fugitive dans The Predator.', sources: ['thePredator2018', 'assassin2018Gear'], role: 'Adversaire d’archive : exopeau blindée, poursuite et puissance physique.', runtimeStatus: 'archive' },
  { id: 'enemy_modified_predator_hound_2018', name: 'Predator Hound modifié', sourceTier: 'SCREEN', description: 'Créature de chasse génétiquement modifiée présente dans l’incident de 2018.', sources: ['thePredator2018'], role: 'Adversaire d’archive : pistage, charge et désorientation.', runtimeStatus: 'archive' },
  { id: 'enemy_stargazer_capture_team', name: 'Équipe de capture Stargazer', sourceTier: 'SCREEN', description: 'Personnel humain spécialisé dans la capture et l’étude de technologie Predator.', sources: ['thePredator2018'], role: 'Adversaire d’archive : pièges, brouillage et armes de confinement.', runtimeStatus: 'archive' },
  { id: 'enemy_combat_synthetic_badlands', name: 'Synthétique de combat', sourceTier: 'SCREEN', description: 'Adaptation des synthétiques associés à l’expédition de Badlands.', sources: ['badlands2025'], role: 'Rencontre réelle : unité à distance, résistante et dotée d’un tir énergétique.', runtimeStatus: 'encounter' },
  { id: 'enemy_kok_viking_predator', name: 'Yautja de l’ère viking', sourceTier: 'SCREEN', description: 'Chasseur antagoniste du segment viking de Killer of Killers.', sources: ['killerOfKillers'], role: 'Boss d’archive : pression lourde et contrôle de mêlée.', runtimeStatus: 'archive' },
  { id: 'enemy_kok_feudal_predator', name: 'Yautja du Japon féodal', sourceTier: 'SCREEN', description: 'Chasseur antagoniste du segment japonais de Killer of Killers.', sources: ['killerOfKillers'], role: 'Boss d’archive : duel rapide, feintes et contre-attaques.', runtimeStatus: 'archive' },
  { id: 'enemy_kok_wartime_predator', name: 'Yautja de l’ère aérienne', sourceTier: 'SCREEN', description: 'Chasseur antagoniste du segment aérien de Killer of Killers.', sources: ['killerOfKillers'], role: 'Boss d’archive : poursuite mobile et attaques à distance.', runtimeStatus: 'archive' },
  { id: 'enemy_genna_hostile_fauna', name: 'Faune hostile de Genna', sourceTier: 'SCREEN', description: 'Ensemble de prédateurs et dangers biologiques du monde mortel de Badlands.', sources: ['badlands2025'], role: 'Adversaires d’archive : chaîne de prédation et réactions environnementales.', runtimeStatus: 'archive' },
  { id: 'enemy_kok_warlord_predator', name: 'Warlord Predator — roi Grendel', sourceTier: 'SCREEN', description: 'Ultime chasseur de l’arène finale de Killer of Killers.', sources: ['killerOfKillers'], role: 'Adversaire d’archive : maître de l’arène, force lourde et exécutions.', runtimeStatus: 'archive' },
];

export const EXPANDED_LEVEL_EVENT_CATALOG = [
  { id: 'event_stargazer_lab_breach', name: 'Brèche du laboratoire Stargazer', sourceTier: 'SCREEN', description: 'Adaptation de gameplay originale de la captivité et de l’évasion montrées en 2018.', sources: ['thePredator2018'], gameplay: 'Désactiver les sas, récupérer l’équipement et échapper aux équipes de confinement.', implementationOriginal: true, runtimeStatus: 'archive' },
  { id: 'event_kok_final_arena', name: 'Arène des survivants', sourceTier: 'SCREEN', description: 'Adaptation de gameplay originale de la convergence finale de Killer of Killers.', sources: ['killerOfKillers'], gameplay: 'Affronter des chasseurs issus de plusieurs ères dans une rotation de duels.', implementationOriginal: true, runtimeStatus: 'archive' },
  { id: 'event_apex_shuttle_flyby', name: 'Survol de navette Apex', sourceTier: 'ORIGINAL', description: 'Interprétation originale Apex Hunt : insertion dynamique d’un appareil Yautja dans l’arène.', sources: [], gameplay: 'Événement réel à 3 secondes avec approche, survol, stationnaire et départ.', runtimeStatus: 'encounter' },
  { id: 'event_apex_supply_drop', name: 'Largage de conteneur Apex', sourceTier: 'ORIGINAL', description: 'Interprétation originale Apex Hunt : conteneur de terrain ouvrable pendant la chasse.', sources: [], gameplay: 'Événement réel qui soigne, recharge et accorde de l’honneur une seule fois.', runtimeStatus: 'encounter' },
  { id: 'event_apex_thermal_storm', name: 'Tempête thermique Apex', sourceTier: 'ORIGINAL', description: 'Interprétation originale Apex Hunt : perturbation énergétique des biomes secs.', sources: [], gameplay: 'Événement réel qui pulse au delta et érode santé et énergie.', runtimeStatus: 'encounter' },
];

export const EXPANDED_HUNT_BOSS_CATALOG = [
  { id: 'boss_upgrade_predator_2018', name: 'Assassin Predator (dit Upgrade)', sourceTier: 'SCREEN', description: 'Assassin génétiquement modifié de The Predator, distinct du Fugitive.', sources: ['thePredator2018', 'assassin2018Gear'], gameplay: 'Boss d’archive : exopeau blindée, bonds et rage progressive.', implementationOriginal: true, runtimeStatus: 'archive' },
  { id: 'boss_kok_viking_hunter', name: 'Chasseur de l’ère viking', sourceTier: 'SCREEN', description: 'Adversaire Yautja du premier segment de Killer of Killers.', sources: ['killerOfKillers'], gameplay: 'Boss d’archive : garde lourde et rupture de bouclier.', implementationOriginal: true, runtimeStatus: 'archive' },
  { id: 'boss_kok_feudal_hunter', name: 'Chasseur du Japon féodal', sourceTier: 'SCREEN', description: 'Adversaire Yautja du segment japonais de Killer of Killers.', sources: ['killerOfKillers'], gameplay: 'Boss d’archive : duel de lecture et ripostes rapides.', implementationOriginal: true, runtimeStatus: 'archive' },
  { id: 'boss_kok_wartime_hunter', name: 'Chasseur de l’ère aérienne', sourceTier: 'SCREEN', description: 'Adversaire Yautja du segment aérien de Killer of Killers.', sources: ['killerOfKillers'], gameplay: 'Boss d’archive : poursuite, projectiles et changements d’altitude.', implementationOriginal: true, runtimeStatus: 'archive' },
  { id: 'boss_kok_warlord_predator', name: 'Warlord Predator — roi Grendel', sourceTier: 'SCREEN', description: 'Adversaire final de Killer of Killers, présenté comme le tueur ultime de l’arène.', sources: ['killerOfKillers'], gameplay: 'Boss d’archive : domination de zone, brise-garde et exécution lourde.', implementationOriginal: true, runtimeStatus: 'archive' },
];

export const SUPPORT_CATALOG_ENTRIES = [
  { id: 'support_cache_balanced', name: 'Conteneur de chasse polyvalent', sourceTier: 'ORIGINAL', description: 'Interprétation originale Apex Hunt : coffre 3D de terrain aux cellules énergétiques.', sources: [], role: 'Conteneur réel : +35 santé, +50 énergie et +120 honneur, une fois.', runtimeStatus: 'encounter' },
  { id: 'support_cache_medicomp', name: 'Cache Medicomp', sourceTier: 'ORIGINAL', description: 'Interprétation originale Apex Hunt : variante médicale du conteneur de chasse.', sources: [], role: 'Conteneur réel : priorité aux soins dans les ruches.', runtimeStatus: 'encounter' },
  { id: 'support_cache_energy', name: 'Cellule d’énergie de terrain', sourceTier: 'ORIGINAL', description: 'Interprétation originale Apex Hunt : réserve portable pour systèmes de chasse.', sources: [], role: 'Conteneur réel : priorité à l’énergie et aux systèmes du masque.', runtimeStatus: 'encounter' },
  { id: 'support_cache_trophy', name: 'Reliquaire de trophées', sourceTier: 'ORIGINAL', description: 'Interprétation originale Apex Hunt : coffre rituel à forte récompense d’honneur.', sources: [], role: 'Conteneur réel : récompense d’honneur élevée sur les terres du clan.', runtimeStatus: 'encounter' },
  { id: 'support_trophy_gallery', name: 'Galerie de trophées', sourceTier: 'SCREEN', description: 'Collection de trophées inspirée des salles et collections montrées à l’écran.', sources: ['predator2', 'avpRequiem2007'], role: 'Galerie 3D réelle : cinq socles reflètent la progression des contrats.', runtimeStatus: 'gallery' },
  { id: 'support_tracker_hound', name: 'Bête du Tracker', sourceTier: 'SCREEN', description: 'Créature de pistage employée par le groupe de Super Predators.', sources: ['predators2010'], role: 'Rencontre réelle : poursuit et révèle le camouflage à courte portée.', runtimeStatus: 'encounter' },
  { id: 'support_thia_badlands', name: 'Thia', sourceTier: 'SCREEN', description: 'Alliée inattendue rencontrée par Dek sur Genna dans Badlands.', sources: ['badlands2025'], role: 'Compagnon d’archive : analyse du terrain et dialogue de mission.', runtimeStatus: 'archive' },
  { id: 'support_kwei_badlands', name: 'Kwei', sourceTier: 'SCREEN', description: 'Guerrier Yautja lié au clan et au parcours de Dek dans Badlands.', sources: ['badlands2025'], role: 'Allié ou rival d’archive pour une campagne de clan.', runtimeStatus: 'archive' },
  { id: 'support_machiko_eu', name: 'Machiko Noguchi', sourceTier: 'LICENSED_EU', description: 'Humaine centrale aux récits AVP de Ryushi dans l’univers étendu licencié.', sources: ['avpOriginalComics', 'avpPreyOmnibus'], role: 'Alliée d’archive pour une campagne Ryushi séparée de la branche écran.', runtimeStatus: 'archive' },
  { id: 'support_clan_elder', name: 'Ancien du clan', sourceTier: 'SCREEN', description: 'Rôle de vétéran et chef de groupe illustré par l’Ancien de Predator 2.', sources: ['predator2'], role: 'Rôle d’archive : attribution de contrats, jugement et remise de trophées.', runtimeStatus: 'archive' },
  { id: 'support_tessa_badlands', name: 'Tessa', sourceTier: 'SCREEN', description: 'Synthétique Weyland-Yutani distincte de Thia dans Badlands.', sources: ['badlands2025'], role: 'Personnage d’archive : commandement synthétique et opposition de campagne.', runtimeStatus: 'archive' },
  { id: 'support_bud_badlands', name: 'Bud', sourceTier: 'SCREEN', description: 'Compagnon qui forme avec Thia et Dek le trio d’alliés de Badlands.', sources: ['badlandsCompanions'], role: 'Compagnon d’archive : exploration, pistage et interaction environnementale.', runtimeStatus: 'archive' },
  { id: 'support_njohrr_badlands', name: 'Njohrr — père de Dek', sourceTier: 'SCREEN', description: 'Père de Dek et chef de clan dans Badlands.', sources: ['badlands2025'], role: 'Rôle d’archive : autorité du clan, exil et jugement du jeune chasseur.', runtimeStatus: 'archive' },
];
