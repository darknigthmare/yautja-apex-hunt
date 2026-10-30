const e = (id, name, faction, scale, sizeMeters, originMedia, description, weakpoints, trophy, baseHonor, threatStars) => ({ id: 'canon251_' + id, name, faction, scale, sizeMeters, originMedia, description, weakpoints, trophy, baseHonor, threatStars });

export default [
  // ===== GEANT =====
  e('offspring_romulus_adulte', 'Offspring de Romulus — Forme Adulte Albinos', 'ENGINEER', 'GEANT', 5.2, 'Alien: Romulus (2024)', 'Hybride humain/Ingénieur à peau blafarde, né de la Goutte noire injectée à Kay. Force colossale et instinct de prédateur.', ['Crâne allongé', 'Nuque', 'Flancs pâles'], 'Crâne Blafard de l\'Offspring de Renaissance', 4800, 5),
  e('xeno_reine_prometheus_ruche', 'Matriarche des Ruines de LV-223', 'XENOMORPH', 'GEANT', 6.1, 'Alien: Covenant (2017)', 'Mère-pondeuse issue des Néomorphes évolués, nichée dans les cryptes ingénieures abandonnées.', ['Poche ovipositeur', 'Crête dorsale', 'Gorge'], 'Mâchoire Ovipare de LV-223', 4500, 5),
  e('yautja_champion_arene', 'Champion Géant de l\'Arène de Sang', 'YAUTJA', 'GEANT', 5.4, 'Predator: Hunting Grounds (2020)', 'Yautja colossal vétéran des rites d\'arène, bardé de trophées d\'anciens duels.', ['Mandibules', 'Genoux blindés', 'Dreadlocks'], 'Masque Écarlate de l\'Arène', 4200, 5),
  e('xeno_reine_fiorina_dragon', 'Dragon de Fiorina 161 Colossal', 'XENOMORPH', 'GEANT', 5.8, 'Alien 3 (1992)', 'Gigantesque porteur de Reine né d\'un bœuf, hurlant dans les fonderies de plomb en fusion.', ['Crâne lisse', 'Tendons de queue', 'Thorax'], 'Crâne Lisse de la Fonderie', 3900, 5),
  e('ingenieur_gardien_acheron', 'Gardien de Cryptes d\'Acheron', 'ENGINEER', 'GEANT', 5.6, 'Prometheus (2012)', 'Ingénieur sentinelle réveillé de stase, protégeant les silos de pathogène noir.', ['Bio-armure fendue', 'Poitrail', 'Tempe'], 'Flûte Sacrée du Gardien', 4400, 5),

  // ===== GRANDE =====
  e('yautja_pisteur_prey_2022', 'Chasseur Yautja de Naru — Cible du Clan', 'YAUTJA', 'GRANDE', 2.7, 'Prey (2022)', 'Yautja primitif à armure de bio-masque camouflée, traquant les Comanches des Grandes Plaines.', ['Ouïes de masque', 'Flanc gauche', 'Cuisses'], 'Masque Rouge de Prey', 3000, 4),
  e('xeno_praetorien_ravageur', 'Praetorian Hurleur de Hadley', 'XENOMORPH', 'GRANDE', 3.2, 'Aliens: Colonial Marines (2013)', 'Praetorian à crête étoilée, commandant des escouades de drones.', ['Crête', 'Cou', 'Abdomen mou'], 'Crête Étoilée de Hadley', 3200, 4),
  e('xeno_crusher_bouclier', 'Crusher Bouclier de Sevastopol', 'XENOMORPH', 'GRANDE', 3.4, 'Aliens: Colonial Marines (2013)', 'Cuirassé frontal d\'une carapace osseuse capable de percuter des cloisons blindées.', ['Flanc', 'Pattes arrière', 'Nuque'], 'Casque Osseux du Crusher', 3100, 4),
  e('yautja_bad_blood_vengeur', 'Vengeur Bad Blood de Chicago', 'YAUTJA', 'GRANDE', 2.9, 'Predator 2 (1990)', 'Chasseur exilé ou rival maudit par son clan, armé de lames de poignet.', ['Tubes de masque', 'Épaules', 'Gorge'], 'Lame Bad Blood Brisée', 3500, 4),
  e('neomorphe_alpha_covenant', 'Néomorphe Alpha de Covenant', 'XENOMORPH', 'GRANDE', 2.6, 'Alien: Covenant (2017)', 'Prédateur blanc effilé aux déplacements bondissants, sorti du dos d\'un colon.', ['Dos fendu', 'Crâne mince', 'Cou'], 'Crâne Nacré du Néomorphe', 2800, 4),

  // ===== MOYEN =====
  e('xeno_guerrier_alien_resurrection', 'Hybride de Reine de l\'Auriga', 'XENOMORPH', 'MOYEN', 2.4, 'Alien Resurrection (1997)', 'Spécimen clone aux traits humains et à la peau translucide, issu de la Reine clonée.', ['Yeux humains', 'Thorax translucide', 'Queue'], 'Chair Translucide de l\'Auriga', 2200, 4),
  e('yautja_cleaner_gunnison', 'Nettoyeur de Piste des Forêts', 'YAUTJA', 'MOYEN', 2.3, 'Predator 2018 (The Predator)', 'Yautja agile chargé d\'effacer les traces de la chasse avec des drones de combat.', ['Casque', 'Dos', 'Bras'], 'Gantelet de Nettoyeur', 2000, 3),
  e('xeno_drone_lv426', 'Drone de Hadley\'s Hope', 'XENOMORPH', 'MOYEN', 2.2, 'Aliens (1986)', 'Guerrier noir cuirassé, tapi dans les conduits d\'aération.', ['Crâne', 'Thorax', 'Jarret'], 'Carapace de Hadley', 1800, 3),
  e('synth_rook_sentinelle', 'Synthétique Sentinelle de Renaissance', 'HUMAN_SYNTHETIC', 'MOYEN', 1.9, 'Alien: Romulus (2024)', 'Androïde d\'enceinte aux protocoles corrompus, arme de poing.', ['Module crânien', 'Nuque', 'Colonne'], 'Visage Synthétique de Renaissance', 1500, 3),
  e('human_marine_usss_ferro', 'Marine USCM du Vecteur Ferro', 'HUMAN_SYNTHETIC', 'MOYEN', 1.8, 'Aliens: Colonial Marines (2013)', 'Vétéran équipé de fusil à impulsion M41A, tireur d\'élite de l\'escouade.', ['Dos', 'Casque', 'Pile d\'énergie'], 'Plaque d\'Identité Ferro', 1100, 3),

  // ===== PETITE =====
  e('xeno_runner_fiorina_quadrupede', 'Meute de Chiens de Fiorina', 'XENOMORPH', 'PETITE', 1.4, 'Alien 3 (1992)', 'Quadrupède véloce se glissant dans les canalisations de la prison.', ['Nuque', 'Pattes', 'Dos'], 'Griffe de Fiorina', 1100, 3),
  e('yautja_novice_initie', 'Initié Yautja Novice du Clan', 'YAUTJA', 'PETITE', 1.2, 'Dark Horse Comics (Predator)', 'Jeune chasseur sans nom, au masque gris et à l\'équipement simple.', ['Bras', 'Genoux', 'Gorge'], 'Masque Gris du Novice', 900, 2),
  e('neomorphe_nouveau_ne', 'Néomorphe Nouveau-Né', 'XENOMORPH', 'PETITE', 0.9, 'Alien: Covenant (2017)', 'Créature blanche sortie du dos d\'un hôte, agressive et imprévisible.', ['Cou', 'Épaule', 'Crâne'], 'Griffe Nacrée du Nouveau-Né', 800, 2),
  e('chasseur_comanche_cachee', 'Éclaireur Comanche du Fort', 'HUMAN_SYNTHETIC', 'PETITE', 1.3, 'Prey (2022)', 'Guerrier rapide aux pièges ingénieux, adversaire improbable du Yautja.', ['Jambes', 'Dos', 'Flanc'], 'Tomahawk d\'Éclaireur', 700, 2),
  e('facehugger_ovomorphe_geant', 'Facehugger Géant de Pondoir', 'XENOMORPH', 'PETITE', 0.7, 'Alien: Romulus (2024)', 'Large facehugger aux pattes puissantes, bondissant sur les visages.', ['Queue', 'Pattes', 'Dessous'], 'Queue de Facehugger Géant', 650, 2),

  // ===== MINUSCULE =====
  e('chestburster_romulus_juvenile', 'Chestburster de Romulus', 'XENOMORPH', 'MINUSCULE', 0.4, 'Alien: Romulus (2024)', 'Ver glissant dévorant sa porteuse, très rapide et agile.', ['Tête', 'Queue', 'Torse'], 'Griffe de Naissance de Romulus', 600, 2),
  e('goutte_noire_fiole', 'Fiole de Goutte Noire de Romulus', 'ENGINEER', 'MINUSCULE', 0.2, 'Alien: Romulus (2024)', 'Liquide de pathogène noir en flacon, hautement instable.', ['Flacon', 'Valve', 'Bouchon'], 'Flacon Souillé', 900, 3),
  e('trilobite_larve_roi', 'Larve de Trilobite des Cryptes', 'ENGINEER', 'MINUSCULE', 0.3, 'Prometheus (2012)', 'Juvénile à tentacules fins surgissant d\'un bassin d\'eau.', ['Tentacules', 'Corps', 'Bouche'], 'Dépouille de Trilobite', 700, 2),
  e('drone_traqueur_yautja_mini', 'Mini-Drone Traqueur Yautja', 'YAUTJA', 'MINUSCULE', 0.35, 'Predator (2018)', 'Petit drone de pistage volant qui scanne la chasse.', ['Hélice', 'Antenne', 'Cœur'], 'Noyau de Drone Traqueur', 1000, 2),
  e('hammerpede_larve_prometheus', 'Hammerpede Juvénile des Urnes', 'ENGINEER', 'MINUSCULE', 0.45, 'Prometheus (2012)', 'Ver mutant sorti d\'une urne noire, mordant et acide.', ['Dard', 'Tête', 'Anneaux'], 'Peau de Hammerpede', 750, 2),
];
