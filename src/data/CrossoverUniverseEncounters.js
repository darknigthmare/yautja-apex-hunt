import { MULTIVERSE_CROSSOVER_PREY, PREY_SCALE_TIERS } from './PreyTaxonomyAndCrossoverCatalog.js';
import encountersA from './encounters/encountersA.js';
import encountersB from './encounters/encountersB.js';
import encountersC from './encounters/encountersC.js';
import encountersD from './encounters/encountersD.js';

/**
 * Rencontres propres à l'univers de chaque crossover, réparties sur les 5 gabarits
 * (GEANT / GRANDE / MOYEN / PETITE / MINUSCULE), comme pour les proies canon.
 * Tuple : [id, scale, sizeMeters, name, description, weakpoints[], trophy, honor, arena]
 */
const BASE_RAW = {
  crossover_terminator_t800: [
    ['hk_aerial', 'GEANT', 9.0, 'Hunter-Killer Aérien HK-VTOL de Skynet', 'Gunship à rotors jumelés balayant les ruines de Los Angeles 2029 avec miniguns et projecteurs thermiques.', ['Rotors de queue', 'Réacteurs latéraux'], 'Turbine de Rotor HK-VTOL Calcinée', 7200, 'RUINES DE LOS ANGELES 2029 — CIEL DE GUERRE'],
    ['hk_tank', 'GRANDE', 4.5, 'Hunter-Killer Tank à Chenilles', 'Char autonome à tourelles plasma, pilier des offensives au sol de Skynet.', ['Joint de tourelle', 'Chenille arrière'], 'Tourelle Plasma HK-Tank Arrachée', 5400, 'TRANCHÉES DE LA RÉSISTANCE — NO MAN\'S LAND'],
    ['t800_endo', 'MOYEN', 1.85, 'Endosquelette T-800 Dépouillé', 'Châssis chromé nu aux yeux rouges, plus rapide et insensible à la douleur.', ['Puce processeur du crâne', 'Câbles de hanche'], 'Crâne Chromé d\'Endosquelette T-800', 3800, 'USINE CYBERDYNE — CHAÎNE DE MONTAGE'],
    ['ground_hound', 'PETITE', 1.0, 'Chien-Traqueur Infiltrateur de Skynet', 'Drone quadrupède flairant les signatures thermiques des survivants.', ['Capteur olfactif', 'Pattes avant'], 'Capteur Olfactif de Chien Skynet', 2100, 'CONDUITS D\'ÉGOUT DU BUNKER'],
    ['micro_drone', 'MINUSCULE', 0.12, 'Micro-Drone Espion de Reconnaissance', 'Mouchard volant minuscule relayant la position du chasseur au réseau Skynet.', ['Hélice unique'], 'Micro-Antenne de Drone Skynet', 900, 'CANOPÉE DE LA ZONE D\'ÉCOUTE'],
  ],
  crossover_ghost_rider: [
    ['mephisto_beast', 'GEANT', 6.0, 'Bête Infernale de Méphisto', 'Colosse cornu issu des abîmes, enveloppé de lave et de chaînes brûlantes.', ['Cœur de braise ventral', 'Cornes fendues'], 'Corne Obsidienne de Bête de Méphisto', 7000, 'PORTE DE L\'ENFER — LAC DE SOUFRE'],
    ['rider_hellcycle', 'GRANDE', 2.8, 'Ghost Rider sur sa Hellcycle Spectrale', 'Johnny Blaze lancé à pleine vitesse sur sa moto de flammes, pneus de lave et chaîne de pénitence.', ['Moteur de la Hellcycle', 'Crâne enflammé'], 'Guidon Enflammé de Hellcycle', 6500, 'AUTOROUTE MAUDITE — NUIT DE FEU'],
    ['blackheart', 'MOYEN', 2.0, 'Blackheart — Fils de Méphisto', 'Démon sournois aux griffes d\'ombre, héraut des légions infernales.', ['Poitrail noir', 'Yeux de braise'], 'Griffe d\'Ombre de Blackheart', 4300, 'CIMETIÈRE PROFANÉ'],
    ['hellhound', 'PETITE', 1.0, 'Molosse Infernal Enchaîné', 'Chien de garde des enfers crachant des braises.', ['Gueule', 'Flanc dénudé'], 'Croc de Molosse Infernal', 1900, 'RUELLES EN FLAMMES'],
    ['hellfire_wisp', 'MINUSCULE', 0.3, 'Feu Follet de la Vengeance', 'Esprit flamboyant guidant les damnés vers leur juge.', ['Noyau de flamme'], 'Cendre de Feu Follet Damné', 800, 'ESPLANADE DES ÂMES'],
  ],
  crossover_master_chief: [
    ['scarab', 'GEANT', 30.0, 'Scarabée Covenant d\'Assaut', 'Forteresse marcheuse à quatre pattes tirant un canon à fusion dévastateur.', ['Noyau énergétique dorsal', 'Articulations de patte'], 'Plaque de Coque de Scarabée Covenant', 8000, 'VILLE DE NEW MOMBASA — AVENUE EN RUINES'],
    ['hunters_pair', 'GRANDE', 3.5, 'Paire de Chasseurs Lekgolo Jumeaux à Boucliers', 'Deux Mgalekgolo liés par la meute, boucliers en bronze et canons à fuel rod en synchronie.', ['Dos orange non blindé', 'Lien du binôme'], 'Bouclier de Chasseur Lekgolo Jumeau', 6600, 'COULOIR DE L\'ARCHE — PONT D\'ACIER'],
    ['elite_zealot', 'MOYEN', 2.4, 'Sangheili Zélote à l\'Épée Énergétique', 'Commandant Elite en armure dorée, bouclier thermique et épée à plasma.', ['Mâchoires', 'Bouclier épuisé'], 'Épée Énergétique de Zélote Sangheili', 4800, 'FLOTTE DU COVENANT — PONT D\'ABORDAGE'],
    ['grunt', 'PETITE', 1.4, 'Unggoy Grunt au Méthane', 'Fantassin Covenant paniqué mais nombreux, réservoir de méthane sur le dos.', ['Réservoir de méthane'], 'Masque à Méthane d\'Unggoy', 1600, 'AVANT-POSTE SUR HALO'],
    ['flood_infection', 'MINUSCULE', 0.4, 'Forme d\'Infection du Flood', 'Spore à tentacules cherchant un hôte à parasiter.', ['Poche centrale'], 'Spore Gélatineuse du Flood', 850, 'LABORATOIRE DE LA BIBLIOTHÈQUE'],
  ],
  crossover_batman: [
    ['clayface_colossus', 'GEANT', 6.0, 'Clayface Colosse d\'Argile Vivante', 'Argile mouvante grandissant à l\'infini, engloutissant les rues de Gotham.', ['Noyau sphérique de boue', 'Appuis liquides'], 'Masse d\'Argile Vivante de Clayface', 6800, 'GOTHAM — QUARTIER D\'ACE CHEMICALS'],
    ['bane_venom', 'GRANDE', 2.7, 'Bane Sous Venin Maximal', 'Géant gonflé au Venom, brisant les reins avant les coups de hache.', ['Tuyaux du Venom', 'Genoux'], 'Masque de Luchador de Bane', 5800, 'PRISON DE BLACKGATE — COUR D\'EXERCICE'],
    ['batman_dark_knight', 'MOYEN', 1.9, 'Batman Armure Anti-Predator', 'Costume lesté avec grappin, bombes fumigènes et batarangs perforants.', ['Cape ouverte', 'Ceinture d\'équipement'], 'Cape Déchirée du Chevalier Noir', 4500, 'TOITS DE GOTHAM — NUIT DE PLUIE'],
    ['man_bat', 'PETITE', 1.2, 'Man-Bat Mutant Sonar', 'Chimère ailée dont le cri paralyse les sens du chasseur.', ['Membrane alaire'], 'Aile Membraneuse de Man-Bat', 2000, 'BEFFROI DE LA CATHÉDRALE'],
    ['batarang_swarm', 'MINUSCULE', 0.2, 'Essaim de Mini-Batarangs Explosifs', 'Nuée de drones tranchants lâchée en diversion.', ['Gyroscope'], 'Batarang Explosif Désamorcé', 750, 'RUELLE DU CRIME ALLEY'],
  ],
  crossover_doom_slayer: [
    ['cyberdemon', 'GEANT', 5.5, 'Cyberdémon au Lance-Roquettes', 'Colosse cybernétique à sabots de fer et bras-canon.', ['Œil central', 'Torse non blindé'], 'Lance-Roquettes du Cyberdémon', 7500, 'FORTERESSE DE PHOBOS'],
    ['baron', 'GRANDE', 3.2, 'Baron de l\'Enfer aux Boules de Plasma Vert', 'Seigneur à corne de bouc, peau rouge et sang vert corrosif.', ['Torse', 'Cuisses'], 'Corne de Baron de l\'Enfer', 5500, 'CATHÉDRALE INFERNALE'],
    ['revenant', 'MOYEN', 2.2, 'Revenant Squelettique à Fusées', 'Squelette armé de deux lance-missiles à tête chercheuse.', ['Jetpack', 'Crâne'], 'Lance-Missiles de Revenant', 3800, 'COULOIRS DE MARS'],
    ['imp', 'PETITE', 1.4, 'Imp Griffu aux Boules de Feu', 'Démon agile bondissant sur les murs.', ['Gorge'], 'Griffe d\'Imp Calcinée', 1500, 'LABYRINTHE D\'URAC'],
    ['lost_soul', 'MINUSCULE', 0.4, 'Âme Perdue — Crâne Enflammé', 'Crâne volant fonçant en kamikaze.', ['Mâchoire'], 'Crâne d\'Âme Perdue', 700, 'LAC DE LAVE'],
  ],
  crossover_scorpion_subzero: [
    ['onaga', 'GEANT', 6.0, 'Onaga, Roi-Dragon du Netherrealm', 'Dragon colossal au souffle de glace et de feu invoquant les âmes damnées.', ['Cou écaillé', 'Ailes'], 'Écaille d\'Onaga Roi-Dragon', 7400, 'TEMPLE DU DRAGON'],
    ['goro', 'GRANDE', 2.7, 'Goro, Prince à Quatre Bras', 'Shokan guerrier invaincu pendant 500 ans, chaque poing capable d\'écraser un crâne.', ['Genoux', 'Arrière-nuque'], 'Ceinture de Goro à Quatre Bras', 5900, 'ARÈNE DE SHANG TSUNG'],
    ['scorpion_hellfire', 'MOYEN', 1.85, 'Scorpion Spectre Enflammé', 'Ninja spectral lançant son harpon « Get over here ».', ['Capuche', 'Chaîne'], 'Harpon Spectral de Scorpion', 4600, 'NETHERREALM — FORGES DE LAVE'],
    ['reptile', 'PETITE', 1.0, 'Reptile Forme Saurienne', 'Ninja devenu lézard, venin acide et invisibilité.', ['Queue'], 'Peau Mimétique de Reptile', 2000, 'FOSSE ACIDE'],
    ['soul_wisp', 'MINUSCULE', 0.3, 'Âme Damnée du Netherrealm', 'Écho spectral des guerriers déchus errant dans les couloirs.', ['Noyau lumineux'], 'Fragment d\'Âme Damnée', 800, 'PONT DES ÂMES'],
  ],
  crossover_geralt_rivia: [
    ['fiend', 'GEANT', 5.2, 'Fiend Cornu de Velen', 'Bête antique à cornes de cerf, œil unique et rugissements de terreur.', ['Œil frontal', 'Cornes fendues'], 'Corne de Fiend de Velen', 6900, 'VELEN — CROISÉE DES SORCIÈRES'],
    ['griffin', 'GRANDE', 3.6, 'Griffon Royal aux Ailes Géantes', 'Chimère ailée fondant en piqué avec des serres de rapace.', ['Aile gauche', 'Poitrail'], 'Plume de Griffon Royal', 5700, 'FALAISES DE SKELLIGE'],
    ['witcher_wolf', 'MOYEN', 1.9, 'Geralt — Sorceleur de l\'École du Loup', 'Duelliste aux deux épées (acier et argent) usant des Signes Quen et Igni.', ['Épaule gauche', 'Gourde de potion'], 'Médaillon de Loup Sorceleur', 4500, 'KAER MORHEN — COUR DES ÉPREUVES'],
    ['drowner', 'PETITE', 1.3, 'Noyé des Marais', 'Cadavre amphibie attaquant en meute depuis l\'eau.', ['Crâne'], 'Griffe de Noyé', 1700, 'MARÉCAGES DE VELEN'],
    ['endrega', 'MINUSCULE', 0.4, 'Endrega Ouvrière Ailée', 'Insecte à dard de la taille d\'un chat.', ['Abdomen'], 'Dard d\'Endrega', 700, 'CHAMPS DE BLÉ DÉVASTÉS'],
  ],
  crossover_samus_aran: [
    ['ridley', 'GEANT', 8.0, 'Ridley, Dragon Spatial de Zebes', 'Chef des pirates de l\'espace, ailes membraneuses et queue d\'acier.', ['Poitrail', 'Queue'], 'Aile Membraneuse de Ridley', 7600, 'ZEBES — ANTRE DE NORFAIR'],
    ['sa_x', 'GRANDE', 2.8, 'SA-X — Parasite X Mimant la Combinaison', 'Ennemi parfait copiant l\'armure et les armes de Samus.', ['Noyau X', 'Casque'], 'Noyau X du SA-X', 5800, 'STATION BSL — SECTEUR 4'],
    ['samus_varia', 'MOYEN', 1.9, 'Samus Aran en Armure Varia', 'Chasseresse de primes au canon multi-faisceaux et au missile à glace.', ['Canon de bras', 'Visière'], 'Visière Chozo de Samus', 4700, 'PLANÈTE ZÈBES — CAVERNES'],
    ['zoomer', 'PETITE', 0.7, 'Zoomer Rampant', 'Petite bête épineuse se faufilant dans les murs.', ['Dos mou'], 'Épine de Zoomer', 1200, 'TUNNELS DE BRINSTAR'],
    ['metroid_larva', 'MINUSCULE', 0.45, 'Larve Métroïde Siphonneuse', 'Méduse vorace aspirant l\'énergie vitale.', ['Noyau trois lobes'], 'Larve Métroïde Congelée', 1000, 'LABORATOIRE DE TOURIAN'],
  ],
  crossover_kratos_sparta: [
    ['cronos', 'GEANT', 40.0, 'Cronos, Titan du Temps', 'Titan colossal portant l\'Olympe sur ses épaules.', ['Œil', 'Cœur de pierre'], 'Éclat de Titan Cronos', 8200, 'DOS DE CRONOS — MONT OLYMPE'],
    ['minotaur', 'GRANDE', 3.8, 'Minotaure de Crète au Marteau de Fer', 'Brute à tête de taureau tourmentant le labyrinthe.', ['Nuque', 'Corne'], 'Corne du Minotaure', 5900, 'LABYRINTHE DE MINOS'],
    ['kratos_ghost', 'MOYEN', 1.95, 'Kratos Fantôme de Sparte', 'Guerrier aux Lames du Chaos, colère spartiate.', ['Tatouage rouge', 'Chaînes'], 'Lame du Chaos Brisée', 4700, 'GRÈCE ANTIQUE — TEMPLE DE ZEUS'],
    ['harpy', 'PETITE', 1.3, 'Harpie Griffue d\'Hadès', 'Femme-oiseau plongeant sur ses proies.', ['Aile'], 'Plume de Harpie', 1700, 'RIVES DU STYX'],
    ['gorgon_snake', 'MINUSCULE', 0.4, 'Serpent-Gorgone Pétrifiant', 'Vipère minuscule au regard de pierre.', ['Tête'], 'Écaille de Serpent-Gorgone', 750, 'TEMPLE D\'ARTÉMIS'],
  ],
  crossover_hellboy_anung: [
    ['sammael', 'GEANT', 8.0, 'Sammael Démon de la Résurrection', 'Hydre géante réincarnée à chaque mort.', ['Cœur dupliqué', 'Dos'], 'Griffe de Sammael', 7100, 'ÉGLISE EN RUINES D\'EUROPE DE L\'EST'],
    ['golem_elemental', 'GRANDE', 3.5, 'Golem Élémentaire de Pierre', 'Géant de roche animé par un rituel ancien.', ['Glyphe sur le front'], 'Glyphe d\'Animation de Golem', 5400, 'CRYPTE DU B.P.R.D.'],
    ['hellboy_hand', 'MOYEN', 2.1, 'Hellboy — Poing de la Destruction', 'Main droite de pierre, revolver Good Samaritan, cornes sciées.', ['Moignons de corne', 'Bras gauche'], 'Cornes Sciées de Hellboy', 4800, 'MANOIR HANTÉ'],
    ['wraith_ghoul', 'PETITE', 1.2, 'Goule Spectrale du Marécage', 'Esprit squelettique glissant dans la brume.', ['Crâne'], 'Voile de Goule Spectrale', 1500, 'MARAIS DE LA BRUME'],
    ['frog_spawn', 'MINUSCULE', 0.3, 'Grenouille Spawn de Sammael', 'Larve de grenouille au sang visqueux.', ['Gorge'], 'Œuf de Grenouille Infernale', 700, 'SOUS-SOL INONDÉ'],
  ],
  crossover_spawn_simmons: [
    ['malebolgia', 'GEANT', 9.0, 'Malebolgia, Seigneur du Huitième Cercle', 'Démon suprême aux ailes d\'ombre.', ['Œil central', 'Cœur nécrotique'], 'Corne de Malebolgia', 7800, 'HUITIÈME CERCLE DE L\'ENFER'],
    ['violator', 'GRANDE', 3.0, 'Violator — Forme Démoniaque Déployée', 'Clown difforme dévoilant sa vraie forme griffue et dentue.', ['Ventre mou', 'Langue'], 'Dent de Violator Démoniaque', 5500, 'RUELLES DE NEW YORK — NUIT'],
    ['spawn_hellspawn', 'MOYEN', 1.95, 'Spawn en Armure Symbiotique', 'Cape vivante, chaînes et nécroplasme.', ['Masque', 'Chaîne'], 'Chaîne Symbiotique de Spawn', 4700, 'FRICHE URBAINE'],
    ['clown_imp', 'PETITE', 1.2, 'Clown-Imp Farceur', 'Petit diablotin au nez rouge et au rire sinistre.', ['Nez'], 'Nez de Clown-Imp', 1400, 'CIRQUE FANTÔME'],
    ['necro_tear', 'MINUSCULE', 0.2, 'Déchirure Nécroplasmique', 'Filament de nécroplasme rampant au sol.', ['Noyau de lumière'], 'Fragment de Nécroplasme', 650, 'CRYPTE DE L\'ÉGLISE'],
  ],
  crossover_judge_dredd: [
    ['block_mecha', 'GEANT', 6.0, 'Méga-Mécha de Démolition de Bloc', 'Machine géante déployée pour raser les block wars de Mega-City One.', ['Cockpit', 'Articulation de hanche'], 'Bras Hydraulique de Mécha de Bloc', 6900, 'MEGA-CITY ONE — BLOCK WAR'],
    ['mean_machine', 'GRANDE', 2.6, 'Mean Machine Angel aux Dents Dentelées', 'Brute mutante à la perceuse intégrée au crâne.', ['Crâne perforé', 'Genoux'], 'Perceuse de Mean Machine', 5300, 'DEADWORLD — CAVERNES'],
    ['dredd_lawgiver', 'MOYEN', 1.85, 'Juge Dredd au Lawgiver', 'Pistolet à reconnaissance palmaire, munitions à triple mode.', ['Menton', 'Ceinture'], 'Insigne de Juge Dredd', 4500, 'MEGA-CITY ONE — ARTÈRE PRINCIPALE'],
    ['mega_rat', 'PETITE', 1.2, 'Rat Géant des Égouts de Méga-City', 'Rongeur mutant en meute dans le sous-sol toxique.', ['Dos'], 'Incisive de Rat Géant', 1500, 'ÉGOUTS DE MÉGA-CITY'],
    ['lawmaster_drone', 'MINUSCULE', 0.3, 'Drone Médical Lawmaster', 'Mouchard volant de la brigade des Juges.', ['Hélice'], 'Puce de Drone de Lawmaster', 700, 'RUE D\'ASPHALTE'],
  ],
};

const RAW = { ...BASE_RAW, ...encountersA, ...encountersB, ...encountersC, ...encountersD };

export function getUniverseEncounterScaleLabel(scale) {
  return PREY_SCALE_TIERS[scale]?.label ?? scale;
}

export const CROSSOVER_UNIVERSE_ENCOUNTERS = Object.freeze(
  Object.entries(RAW).flatMap(([parentId, rows]) => {
    const parent = MULTIVERSE_CROSSOVER_PREY.find((c) => c.id === parentId);
    if (!parent) return [];
    return rows.map(([key, scale, sizeMeters, name, description, weakpoints, trophy, honorReward, arena]) => ({
      id: `${parentId}__${key}`,
      parentId,
      isUniverseEncounter: true,
      name,
      universe: parent.universe,
      originMedia: parent.originMedia,
      crossoverYear: parent.crossoverYear,
      scale,
      sizeMeters,
      badgeColor: parent.badgeColor,
      description,
      tactics: parent.tactics,
      weakpoints,
      trophy,
      honorReward,
      rotationPeriodHours: parent.rotationPeriodHours,
      arena,
    }));
  }),
);

export function getEncountersForCrossover(parentId) {
  return CROSSOVER_UNIVERSE_ENCOUNTERS.filter((e) => e.parentId === parentId);
}
