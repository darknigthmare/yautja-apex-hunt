import {
  EXPANDED_ENEMY_CATALOG,
  EXPANDED_HUNT_BOSS_CATALOG,
  EXPANDED_LEVEL_EVENT_CATALOG,
  EXPANDED_MASK_VARIANTS,
  EXPANDED_TECH_CATALOG,
  EXPANDED_VEHICLE_CATALOG,
  SUPPORT_CATALOG_ENTRIES,
} from './YautjaExpandedContent.js';

// Matrice de contenu canon-conscious pour l'armurerie et le Codex.
// `sourceTier` décrit la provenance du concept ; les mécaniques de jeu restent
// des adaptations de Yautja: Apex Hunt quand `implementationOriginal` est vrai.

const PLAYABLE_CONTENT_IDS = new Set([
  'goliath', 'xeno_queen', 'bad_blood', 'predalien', 'boss_berserker_super_predator', 'boss_feral_2022', 'boss_wolf_cleaner', 'boss_kalisk_badlands',
  'tech_biomask', 'tech_cloak', 'tech_wrist_computer', 'tech_wrist_blades', 'tech_plasma_caster', 'tech_tri_laser', 'tech_self_destruct', 'tech_medicomp', 'tech_voice_mimic', 'tech_smart_disc', 'tech_combistick', 'tech_net_launcher', 'tech_speargun', 'tech_yautja_bow', 'tech_falcon_drone', 'tech_wrist_shield', 'tech_shuriken_avp',
]);
const ENCOUNTER_CONTENT_IDS = new Set([
  'enemy_elite_commando', 'enemy_hunting_hound', 'enemy_xenomorph_drone', 'enemy_xenomorph_warrior', 'enemy_grizzly', 'enemy_thermal_trap_team', 'enemy_genna_hostile_fauna',
  'event_rain_cloak_reveal', 'event_preserve_hound_release', 'event_genna_predation_cycle', 'tech_hunting_hounds', 'tech_feral_bolt_launcher', 'tech_feral_combistick',
]);
const getRuntimeStatus = (entry) => {
  if (entry.runtimeStatus) return entry.runtimeStatus;
  if (/^(mask_|dread_|skin_|armor_|accent_)/.test(entry.id)) return 'customization';
  if (PLAYABLE_CONTENT_IDS.has(entry.id)) return 'playable';
  if (ENCOUNTER_CONTENT_IDS.has(entry.id)) return 'encounter';
  return 'archive';
};

const freezeCatalog = (entries) => Object.freeze(entries.map((entry) => Object.freeze({
  ...entry,
  runtimeStatus: getRuntimeStatus(entry),
  sources: Object.freeze(entry.sources ?? []),
  ...(entry.geometry ? { geometry: Object.freeze(entry.geometry) } : {})
})));

const originalPalette = (id, name, hex, gameplay) => ({
  id,
  name,
  hex,
  sourceTier: 'ORIGINAL',
  description: `Interprétation originale Apex Hunt : ${gameplay}`,
  sources: [],
  gameplay
});

export const MASK_VARIANTS = freezeCatalog([
  {
    id: 'mask_jungle_hunter_1987',
    name: 'Chasseur de la jungle',
    sourceTier: 'SCREEN',
    description: 'Biomasque classique aux pommettes dégagées et au front large.',
    sources: ['predator1987'],
    gameplay: 'Profil équilibré : acquisition thermique et verrouillage standard.',
    shape: 'classic', lensColor: 0xff2d2d, armorColor: 0x817761, scale: 1,
    geometry: { browWidth: 1.08, jawLength: 0.88, crestHeight: 0.18, cheekGuard: 0.42 }
  },
  {
    id: 'mask_city_hunter_1990',
    name: 'Chasseur urbain',
    sourceTier: 'SCREEN',
    description: 'Masque plus anguleux associé au chasseur de Los Angeles.',
    sources: ['predator2'],
    gameplay: 'Accentue le contraste des cibles dans les zones chaudes et enfumées.',
    shape: 'urban', lensColor: 0xff3b24, armorColor: 0x786f58, scale: 0.98,
    geometry: { browWidth: 1.02, jawLength: 0.95, crestHeight: 0.22, cheekGuard: 0.36 }
  },
  {
    id: 'mask_berserker_2010',
    name: 'Berserker Super Predator',
    sourceTier: 'SCREEN',
    description: 'Masque sombre et massif porté par le Berserker de la planète-réserve.',
    sources: ['predators2010'],
    gameplay: 'Sacrifie la discrétion visuelle à une lecture plus nette des proies blindées.',
    shape: 'berserker', lensColor: 0xff160f, armorColor: 0x292624, scale: 1.1,
    geometry: { browWidth: 1.16, jawLength: 1.04, crestHeight: 0.3, cheekGuard: 0.58 }
  },
  {
    id: 'mask_falconer_2010',
    name: 'Falconer',
    sourceTier: 'SCREEN',
    description: 'Masque allongé du Falconer, partenaire de reconnaissance du drone-faucon.',
    sources: ['predators2010'],
    gameplay: 'Étend la portée de marquage des ennemis et des points d’observation.',
    shape: 'falconer', lensColor: 0xe32118, armorColor: 0x514d45, scale: 1.02,
    geometry: { browWidth: 0.95, jawLength: 1.12, crestHeight: 0.25, cheekGuard: 0.31 }
  },
  {
    id: 'mask_tracker_2010',
    name: 'Tracker',
    sourceTier: 'SCREEN',
    description: 'Masque robuste du pisteur qui dirige les créatures de chasse.',
    sources: ['predators2010'],
    gameplay: 'Révèle plus longtemps empreintes, sang et traces de déplacement.',
    shape: 'tracker', lensColor: 0xff4a22, armorColor: 0x5f594d, scale: 1.06,
    geometry: { browWidth: 1.12, jawLength: 0.98, crestHeight: 0.2, cheekGuard: 0.53 }
  },
  {
    id: 'mask_feral_2022',
    name: 'Feral',
    sourceTier: 'SCREEN',
    description: 'Masque osseux distinctif du chasseur de la Grande Plaine.',
    sources: ['prey2022'],
    gameplay: 'Accélère le repérage à courte portée mais réduit l’assistance balistique.',
    shape: 'bone', lensColor: 0xff2b18, armorColor: 0xd1c5a3, scale: 1.04,
    geometry: { browWidth: 1, jawLength: 1.08, crestHeight: 0.34, cheekGuard: 0.24 }
  },
  {
    id: 'mask_scar_avp',
    name: 'Scar — rite AVP',
    sourceTier: 'AVP_SCREEN',
    description: 'Biomasque du jeune chasseur Scar dans la branche écran AVP.',
    sources: ['avp2004'],
    gameplay: 'Améliore l’analyse des xénomorphes et de leurs projections acides.',
    shape: 'ritual', lensColor: 0xff3322, armorColor: 0x8e8874, scale: 1.03,
    geometry: { browWidth: 1.08, jawLength: 0.93, crestHeight: 0.21, cheekGuard: 0.47 }
  },
  {
    id: 'mask_celtic_avp',
    name: 'Celtic — rite AVP',
    sourceTier: 'AVP_SCREEN',
    description: 'Masque large et ornementé du jeune chasseur Celtic.',
    sources: ['avp2004'],
    gameplay: 'Renforce la stabilité pendant les impacts et les exécutions lourdes.',
    shape: 'celtic', lensColor: 0xff291f, armorColor: 0x928b79, scale: 1.09,
    geometry: { browWidth: 1.2, jawLength: 1, crestHeight: 0.26, cheekGuard: 0.62 }
  },
  {
    id: 'mask_wolf_avpr',
    name: 'Wolf — nettoyeur',
    sourceTier: 'AVP_SCREEN',
    description: 'Masque marqué du chasseur envoyé contenir l’infestation de Gunnison.',
    sources: ['avpRequiem2007'],
    gameplay: 'Affiche simultanément les signatures thermiques et xénomorphes proches.',
    shape: 'cleaner', lensColor: 0xff1818, armorColor: 0x6d675b, scale: 1.01,
    geometry: { browWidth: 1.04, jawLength: 0.96, crestHeight: 0.19, cheekGuard: 0.49 }
  },
  {
    id: 'mask_dek_badlands',
    name: 'Dek — exilé',
    sourceTier: 'SCREEN',
    description: 'Silhouette de masque associée au jeune Yautja exilé de Badlands.',
    sources: ['badlands2025'],
    gameplay: 'Favorise l’identification des faiblesses de mégafaune sur la durée.',
    shape: 'exile', lensColor: 0xff5a24, armorColor: 0x675e4e, scale: 0.96,
    geometry: { browWidth: 0.98, jawLength: 1.04, crestHeight: 0.24, cheekGuard: 0.34 }
  },
  {
    id: 'mask_apex_ancestral',
    name: 'Gardien ancestral Apex',
    sourceTier: 'ORIGINAL',
    description: 'Interprétation originale Apex Hunt : masque cérémoniel à crête segmentée, sans équivalent écran revendiqué.',
    sources: [],
    gameplay: 'Convertit une partie de l’honneur gagné en recharge de vision.',
    shape: 'ancestral', lensColor: 0x45fff2, armorColor: 0x3f514d, scale: 1.07,
    geometry: { browWidth: 1.13, jawLength: 1.02, crestHeight: 0.41, cheekGuard: 0.55 }
  },
  ...EXPANDED_MASK_VARIANTS,
]);

export const DREAD_PALETTES = freezeCatalog([
  originalPalette('dread_obsidienne', 'Obsidienne', 0x0a0b0d, 'noir profond, lisible sous les reflets de camouflage.'),
  originalPalette('dread_charbon', 'Charbon', 0x252422, 'gris chaud pour une silhouette de vétéran.'),
  originalPalette('dread_terre', 'Terre brûlée', 0x3a271d, 'brun sombre adapté aux biomes désertiques.'),
  originalPalette('dread_acajou', 'Acajou', 0x542c24, 'rouge brun distinctif sans signaler un clan canonique.'),
  originalPalette('dread_cendre', 'Cendre', 0x78736c, 'gris vieilli pour une apparence d’Ancien.'),
  originalPalette('dread_ivoire', 'Ivoire patiné', 0xb4aa91, 'ton clair très visible dans la forge.'),
  originalPalette('dread_mousse', 'Mousse nocturne', 0x25382f, 'vert noir pour le camouflage forestier.'),
  originalPalette('dread_sang_seche', 'Sang séché', 0x4c1719, 'accent rouge sombre réservé à la personnalisation.'),
]);

export const SKIN_PALETTES = freezeCatalog([
  originalPalette('skin_olive_classique', 'Olive classique', 0x5c6042, 'teinte cutanée olive inspirée des silhouettes écran sans reproduire un individu précis.'),
  originalPalette('skin_sable_feral', 'Sable pâle', 0x8b8061, 'teinte claire de chasse en climat sec, valeur colorimétrique propre au jeu.'),
  originalPalette('skin_jade_sombre', 'Jade sombre', 0x394d3c, 'vert profond qui conserve les taches de peau en contraste.'),
  originalPalette('skin_bronze', 'Bronze', 0x76583c, 'brun chaud destiné aux éclairages de temple.'),
  originalPalette('skin_cendre', 'Cendre froide', 0x565b57, 'gris désaturé pour une allure austère.'),
  originalPalette('skin_marais', 'Marais', 0x4c5235, 'vert brun pour les jungles humides.'),
  originalPalette('skin_ocre', 'Ocre', 0x8a6841, 'ocre minéral pour les cartes rocheuses.'),
  originalPalette('skin_nuit', 'Nuit bleutée', 0x303b42, 'ton froid fantastique explicitement propre à Apex Hunt.'),
]);

export const ARMOR_PALETTES = freezeCatalog([
  originalPalette('armor_gunmetal', 'Métal de chasse', 0x55595a, 'finition neutre qui conserve les impacts visibles.'),
  originalPalette('armor_bronze_ancien', 'Bronze ancien', 0x735d3b, 'patine chaude pour une armure cérémonielle originale.'),
  originalPalette('armor_obsidienne', 'Obsidienne', 0x202426, 'plaque sombre à forte discrétion nocturne.'),
  originalPalette('armor_os', 'Os patiné', 0xb5a989, 'finition claire inspirée de matériaux trophées sans origine canonique précise.'),
  originalPalette('armor_cuivre', 'Cuivre oxydé', 0x735044, 'métal rouge brun avec contraste de corrosion.'),
  originalPalette('armor_jungle', 'Vert jungle', 0x3f4b38, 'plaques mates pour les cartes forestières.'),
  originalPalette('armor_sable', 'Sable de Genna', 0x89785e, 'palette de désert nommée pour le biome, non pour un équipement canonique.'),
  originalPalette('armor_sang', 'Rouge du défi', 0x641f24, 'signal visuel agressif pour le duel.'),
  originalPalette('armor_arctique', 'Givre', 0x89979b, 'métal froid destiné aux niveaux enneigés.'),
  originalPalette('armor_royal', 'Violet du clan Apex', 0x493c5f, 'couleur de clan entièrement originale.'),
  originalPalette('armor_industriel', 'Acier industriel', 0x687079, 'finition lisible dans les complexes humains.'),
  originalPalette('armor_xeno', 'Résine noire', 0x252c2d, 'aspect de résine inspiré des ruches, sans prétendre à une armure écran.'),
]);

export const ARMOR_ACCENTS = freezeCatalog([
  originalPalette('accent_plasma', 'Plasma azur', 0x46d9ff, 'lumière froide pour les circuits d’énergie.'),
  originalPalette('accent_laser', 'Laser rubis', 0xff2b31, 'repère rouge pour optiques et marquages.'),
  originalPalette('accent_honneur', 'Or d’honneur', 0xd4a94d, 'liseré de prestige sans rang canonique associé.'),
  originalPalette('accent_acide', 'Acide', 0x8ee34a, 'contraste vert pour les équipements anti-xénomorphes.'),
  originalPalette('accent_cyan', 'Glyphes cyan', 0x3ff4e2, 'éclairage de glyphes propre à l’interface du jeu.'),
  originalPalette('accent_ambre', 'Ambre', 0xff9d42, 'signal thermique pour outils de survie.'),
  originalPalette('accent_ivoire', 'Ivoire', 0xe3d8bb, 'marquage cérémoniel clair.'),
  originalPalette('accent_neant', 'Néant', 0x17191d, 'accent presque noir pour une tenue monochrome.'),
]);

export const TECH_CATALOG = freezeCatalog([
  { id: 'tech_biomask', name: 'Biomasque multispectral', sourceTier: 'SCREEN', description: 'Masque de détection, de vision et d’assistance au ciblage.', sources: ['predator1987', 'predator2', 'prey2022'], gameplay: 'Alterne les modes de vision et identifie les signatures prioritaires.' },
  { id: 'tech_cloak', name: 'Camouflage réfractif', sourceTier: 'SCREEN', description: 'Dispositif qui courbe la lumière sans garantir une invisibilité parfaite.', sources: ['predator1987', 'predator2'], gameplay: 'Réduit la détection tant que l’énergie et l’intégrité du système tiennent.' },
  { id: 'tech_wrist_computer', name: 'Ordinateur de poignet', sourceTier: 'SCREEN', description: 'Interface portée au poignet pour contrôler plusieurs systèmes de chasse.', sources: ['predator1987', 'predator2'], gameplay: 'Centralise énergie, soins, camouflage et protocole d’autodestruction.' },
  { id: 'tech_wrist_blades', name: 'Lames de poignet', sourceTier: 'SCREEN', description: 'Lames rétractables destinées au combat rapproché.', sources: ['predator1987', 'predator2', 'huntingGrounds'], gameplay: 'Combo rapide qui récompense parade et positionnement.' },
  { id: 'tech_plasma_caster', name: 'Canon à plasma', sourceTier: 'SCREEN', description: 'Arme d’épaule énergétique asservie à la visée.', sources: ['predator1987', 'predator2', 'huntingGrounds'], gameplay: 'Tir chargé puissant, visible et coûteux en énergie.' },
  { id: 'tech_tri_laser', name: 'Viseur à trois points', sourceTier: 'SCREEN', description: 'Signature de ciblage projetée sur la proie.', sources: ['predator1987', 'predator2'], gameplay: 'Annonce un verrouillage précis mais peut trahir la position.' },
  { id: 'tech_self_destruct', name: 'Autodestruction du brassard', sourceTier: 'SCREEN', description: 'Protocole explosif extrême commandé depuis le poignet.', sources: ['predator1987', 'avp2004'], gameplay: 'Dernier recours à compte à rebours, annulable avant le point critique.' },
  { id: 'tech_medicomp', name: 'Nécessaire de soins', sourceTier: 'SCREEN', description: 'Instrumentation compacte permettant au chasseur de traiter des blessures sévères.', sources: ['predator2'], gameplay: 'Soin interrompu par les dégâts et limité par les consommables.' },
  { id: 'tech_voice_mimic', name: 'Imitation vocale', sourceTier: 'SCREEN', description: 'Enregistrement et restitution de sons et de voix entendus.', sources: ['predator1987', 'predator2'], gameplay: 'Leurre directionnel jouable : attire pendant six secondes les PNJ proches vers un point devant le chasseur.' },
  { id: 'tech_smart_disc', name: 'Disque intelligent', sourceTier: 'SCREEN', description: 'Arme tranchante guidée qui revient à son lanceur.', sources: ['predator2', 'huntingGrounds'], gameplay: 'Traverse plusieurs cibles avant un retour qu’il faut sécuriser.' },
  { id: 'tech_combistick', name: 'Combi-stick', sourceTier: 'SCREEN', description: 'Lance compacte qui se déploie pour le corps à corps ou le lancer.', sources: ['predator2', 'huntingGrounds'], gameplay: 'Allonge supérieure, lancer récupérable et fenêtre de vulnérabilité.' },
  { id: 'tech_net_launcher', name: 'Lance-filet', sourceTier: 'SCREEN', description: 'Projectile de capture qui comprime la cible prise au piège.', sources: ['predator2'], gameplay: 'Immobilise brièvement une cible et ouvre une exécution.' },
  { id: 'tech_speargun', name: 'Lance-harpons', sourceTier: 'SCREEN', description: 'Arme compacte projetant des traits métalliques.', sources: ['predator2'], gameplay: 'Tir silencieux de précision avec munitions récupérables.' },
  { id: 'tech_falcon_drone', name: 'Drone-faucon', sourceTier: 'SCREEN', description: 'Éclaireur aérien employé par le Falconer sur la planète-réserve.', sources: ['predators2010'], gameplay: 'Jouable avec [G] : drone 3D orbital, impulsion de scan à 90 mètres et marquage de sept secondes.' },
  { id: 'tech_hunting_hounds', name: 'Créatures de pistage', sourceTier: 'SCREEN', description: 'Bêtes lâchées par le Tracker pour poursuivre les captifs.', sources: ['predators2010'], gameplay: 'Forcent les proies à quitter leur abri et suivent les traces fraîches.' },
  { id: 'tech_yautja_bow', name: 'Arc composite Yautja', sourceTier: 'SCREEN', description: 'Arc composite associé à Dek dans Badlands et aussi proposé dans Hunting Grounds.', sources: ['badlandsGear', 'huntingGrounds'], gameplay: 'Arme silencieuse jouable à forte vélocité et coût d’endurance.' },
  { id: 'tech_wrist_shield', name: 'Bouclier de poignet', sourceTier: 'SCREEN', description: 'Protection déployable utilisée par le chasseur de Prey.', sources: ['prey2022'], gameplay: 'Jouable avec [B] : absorbe 68 % des impacts, possède une intégrité visible et consomme 25 énergie.' },
  { id: 'tech_apex_decoy', name: 'Leurre holographique Apex', sourceTier: 'ORIGINAL', description: 'Interprétation originale Apex Hunt : projecteur de fausse signature sans équivalent précis revendiqué.', sources: [], gameplay: 'Crée un double thermique temporaire qui détourne les tirs.' },
  ...EXPANDED_TECH_CATALOG,
]);

export const VEHICLE_CATALOG = freezeCatalog([
  { id: 'vehicle_jungle_dropcraft', name: 'Appareil d’insertion de la jungle', sourceTier: 'SCREEN', description: 'Vaisseau observé à l’approche de la Terre avant la chasse de 1987.', sources: ['predator1987'], role: 'Dépose discrètement un chasseur puis quitte l’orbite basse.' },
  { id: 'vehicle_city_clan_ship', name: 'Vaisseau du clan de Los Angeles', sourceTier: 'SCREEN', description: 'Grand appareil dissimulé sous la ville à l’issue de la chasse de 1990.', sources: ['predator2'], role: 'Hub mobile, salle de trophées et extraction du clan.' },
  { id: 'vehicle_game_preserve_ship', name: 'Transport de la planète-réserve', sourceTier: 'SCREEN', description: 'Transport lié au dispositif de chasse de la planète-réserve.', sources: ['predators2010'], role: 'Déplacement orbital et extraction potentielle hors de la réserve.' },
  { id: 'vehicle_preserve_parachute_drop', name: 'Système de largage parachuté', sourceTier: 'SCREEN', description: 'Déploiement aérien des captifs équipés de parachutes sur la planète-réserve.', sources: ['predators2010'], role: 'Archive de niveau : introduit des escouades de proies à des points variables.' },
  { id: 'vehicle_feral_scout', name: 'Éclaireur du Feral', sourceTier: 'SCREEN', description: 'Petit appareil associé à l’arrivée du chasseur de Prey.', sources: ['prey2022'], role: 'Insertion solitaire sur un territoire de chasse éloigné.' },
  { id: 'vehicle_avp_clan_ship', name: 'Vaisseau du rite antarctique', sourceTier: 'AVP_SCREEN', description: 'Vaisseau du groupe Yautja venu superviser la chasse de la pyramide.', sources: ['avp2004'], role: 'Transport de jeunes chasseurs et récupération des survivants du rite.' },
  { id: 'vehicle_wolf_cleaner_ship', name: 'Appareil du nettoyeur Wolf', sourceTier: 'AVP_SCREEN', description: 'Vaisseau utilisé pour rejoindre le site d’infestation de Gunnison.', sources: ['avpRequiem2007'], role: 'Intervention rapide et transport d’un arsenal de confinement.' },
  { id: 'vehicle_badlands_clan_craft', name: 'Appareil du clan de Dek', sourceTier: 'SCREEN', description: 'Vaisseau rattaché au parcours du jeune exilé dans Badlands.', sources: ['badlands2025'], role: 'Relie territoire clanique, exil et expédition sur un monde mortel.' },
  { id: 'vehicle_apex_trophy_barge', name: 'Barge aux trophées Apex', sourceTier: 'ORIGINAL', description: 'Interprétation originale Apex Hunt : transport blindé conçu comme galerie de campagne mobile.', sources: [], role: 'Expose les trophées du joueur et débloque des contrats itinérants.' },
  ...EXPANDED_VEHICLE_CATALOG,
]);

export const ENEMY_CATALOG = freezeCatalog([
  { id: 'enemy_elite_commando', name: 'Commando d’élite', sourceTier: 'SCREEN', description: 'Soldat entraîné comparable aux membres de l’équipe traquée dans Predator.', sources: ['predator1987'], role: 'Escouade coordonnée utilisant couverture, explosifs et tir de suppression.', runtimeStatus: 'encounter' },
  { id: 'enemy_city_enforcer', name: 'Force urbaine armée', sourceTier: 'SCREEN', description: 'Adversaire humain mobile inspiré du champ de chasse de Los Angeles.', sources: ['predator2'], role: 'Patrouille dense qui appelle des renforts et rend le camouflage risqué.' },
  { id: 'enemy_thermal_trap_team', name: 'Équipe de capture thermique', sourceTier: 'SCREEN', description: 'Unité équipée pour détecter et piéger un chasseur invisible.', sources: ['predator2'], role: 'Déploie froid artificiel, projecteurs et zones de confinement.' },
  { id: 'enemy_preserve_mercenary', name: 'Mercenaire de la réserve', sourceTier: 'SCREEN', description: 'Combattant d’élite arraché à son propre conflit et placé sur la planète-réserve.', sources: ['predators2010'], role: 'Proie dangereuse qui adapte ses tactiques après chaque contact.' },
  { id: 'enemy_hunting_hound', name: 'Bête de chasse du Tracker', sourceTier: 'SCREEN', description: 'Quadrupède agressif lâché contre les captifs de la réserve.', sources: ['predators2010'], role: 'Traqueur rapide en meute, capable de rabattre le joueur.' },
  { id: 'enemy_super_predator', name: 'Super Predator', sourceTier: 'SCREEN', description: 'Chasseur rival appartenant au groupe antagoniste de Predators.', sources: ['predators2010'], role: 'Duel miroir qui emploie camouflage, plasma et pression rapprochée.' },
  { id: 'enemy_grizzly', name: 'Grand prédateur terrestre', sourceTier: 'SCREEN', description: 'Mégafaune dangereuse rappelant la confrontation animale de Prey.', sources: ['prey2022'], role: 'Rencontre 3D réelle : 300 santé, charge lourde télégraphiée et recul de dix mètres.' },
  { id: 'enemy_comanche_hunter', name: 'Chasseur comanche', sourceTier: 'SCREEN', description: 'Humain expert du territoire, inspiré des protagonistes de Prey.', sources: ['prey2022'], role: 'Observe les habitudes du joueur, pose des pièges et exploite le terrain.' },
  { id: 'enemy_viking_raider', name: 'Guerrier viking', sourceTier: 'SCREEN', description: 'Combattant de l’une des trois époques de Killer of Killers.', sources: ['killerOfKillers'], role: 'Frontliner résistant avec bouclier, hache et riposte de groupe.', runtimeStatus: 'encounter' },
  { id: 'enemy_feudal_assassin', name: 'Assassin du Japon féodal', sourceTier: 'SCREEN', description: 'Adversaire furtif inspiré du segment japonais de Killer of Killers.', sources: ['killerOfKillers'], role: 'Dueliste rapide qui disparaît, feinte et contre les attaques lourdes.', runtimeStatus: 'encounter' },
  { id: 'enemy_wartime_pilot', name: 'Pilote de guerre', sourceTier: 'SCREEN', description: 'Combattant aérien inspiré du segment du XXe siècle de Killer of Killers.', sources: ['killerOfKillers'], role: 'Menace mobile qui mitraille les zones ouvertes depuis les airs.', runtimeStatus: 'encounter' },
  { id: 'enemy_xenomorph_drone', name: 'Drone xénomorphe', sourceTier: 'AVP_SCREEN', description: 'Organisme de ruche rapide et létal de la branche écran AVP.', sources: ['avp2004', 'avpRequiem2007'], role: 'Attaque depuis murs et plafond, avec sang acide à la mort.' },
  { id: 'enemy_facehugger', name: 'Facehugger', sourceTier: 'AVP_SCREEN', description: 'Organisme issu des œufs de la pyramide dans AVP.', sources: ['avp2004'], role: 'Petite menace d’embuscade qui force une esquive immédiate.' },
  { id: 'enemy_xenomorph_queen', name: 'Reine xénomorphe', sourceTier: 'AVP_SCREEN', description: 'Matrice de la ruche affrontée dans la pyramide antarctique.', sources: ['avp2004'], role: 'Boss territorial qui pond, commande les drones et projette de l’acide.' },
  { id: 'enemy_predalien', name: 'Predalien', sourceTier: 'AVP_SCREEN', description: 'Hybride xénomorphe/Yautja central à AVP: Requiem.', sources: ['avpRequiem2007'], role: 'Boss agressif combinant mobilité de ruche et puissance physique.' },
  { id: 'enemy_kalisk', name: 'Kalisk', sourceTier: 'SCREEN', description: 'Adversaire suprême recherché par Dek sur le monde de Badlands.', sources: ['badlands2025'], role: 'Mégafaune adaptative dont les points faibles changent entre les phases.' },
  { id: 'enemy_goliath_akumo', name: 'Goliath Xeno-Akumo', sourceTier: 'ORIGINAL', description: 'Interprétation originale Apex Hunt : mégafaune blindée propre au jeu.', sources: [], role: 'Briseur de garde dont les plaques doivent être détruites par secteurs.' },
  ...EXPANDED_ENEMY_CATALOG,
]);

export const LEVEL_EVENT_CATALOG = freezeCatalog([
  { id: 'event_rain_cloak_reveal', name: 'Pluie révélatrice', sourceTier: 'SCREEN', description: 'Adaptation de gameplay originale du camouflage rendu perceptible par l’eau.', sources: ['predator1987'], gameplay: 'La pluie dessine brièvement les unités camouflées et surcharge leurs circuits.' , implementationOriginal: true },
  { id: 'event_mud_thermal_mask', name: 'Boue froide', sourceTier: 'SCREEN', description: 'Adaptation de gameplay originale de la signature thermique masquée par la boue.', sources: ['predator1987'], gameplay: 'Des zones de boue cachent les humains en vision thermique jusqu’à leur réchauffement.', implementationOriginal: true },
  { id: 'event_blood_trail', name: 'Piste luminescente', sourceTier: 'SCREEN', description: 'Adaptation de gameplay originale du sang fluorescent qui trahit un chasseur blessé.', sources: ['predator1987', 'predator2'], gameplay: 'Les dégâts importants laissent une piste suivie par les ennemis pisteurs.', implementationOriginal: true },
  { id: 'event_city_lightning', name: 'Orage urbain', sourceTier: 'SCREEN', description: 'Adaptation de gameplay originale des conditions électriques de la chasse urbaine.', sources: ['predator2'], gameplay: 'La foudre perturbe périodiquement vision et camouflage sur les toits.', implementationOriginal: true },
  { id: 'event_preserve_hound_release', name: 'Lâcher de bêtes', sourceTier: 'SCREEN', description: 'Adaptation de gameplay originale de la poursuite par les créatures du Tracker.', sources: ['predators2010'], gameplay: 'Plusieurs meutes rabattent les proies vers une zone d’embuscade.', implementationOriginal: true },
  { id: 'event_preserve_totem_warning', name: 'Camp des trophées', sourceTier: 'SCREEN', description: 'Adaptation de gameplay originale du site macabre découvert sur la planète-réserve.', sources: ['predators2010'], gameplay: 'Une exploration à haut risque révèle des informations sur le boss et du matériel.', implementationOriginal: true },
  { id: 'event_pyramid_shift', name: 'Reconfiguration de la pyramide', sourceTier: 'AVP_SCREEN', description: 'Adaptation de gameplay originale des couloirs mobiles de la pyramide AVP.', sources: ['avp2004'], gameplay: 'Des murs déplacent les routes, isolent l’équipe et ouvrent des chambres à œufs.', implementationOriginal: true },
  { id: 'event_hive_outbreak', name: 'Rupture de confinement', sourceTier: 'AVP_SCREEN', description: 'Adaptation de gameplay originale d’une infestation xénomorphe hors contrôle.', sources: ['avpRequiem2007'], gameplay: 'Les points d’apparition se multiplient jusqu’à destruction des nids secondaires.', implementationOriginal: true },
  { id: 'event_self_destruct_countdown', name: 'Compte à rebours du brassard', sourceTier: 'SCREEN', description: 'Adaptation de gameplay originale du protocole d’autodestruction Yautja.', sources: ['predator1987', 'avp2004'], gameplay: 'Le joueur doit désarmer, fuir ou exploiter l’explosion avant la fin du délai.', implementationOriginal: true },
  { id: 'event_killer_eras', name: 'Échos des trois ères', sourceTier: 'SCREEN', description: 'Adaptation de gameplay originale des trois périodes montrées dans Killer of Killers.', sources: ['killerOfKillers'], gameplay: 'Le niveau alterne mêlée viking, duel furtif et menace aérienne.', implementationOriginal: true, runtimeStatus: 'encounter' },
  { id: 'event_genna_predation_cycle', name: 'Cycle de prédation de Genna', sourceTier: 'SCREEN', description: 'Adaptation de gameplay originale du monde mortel exploré dans Badlands.', sources: ['badlands2025'], gameplay: 'Rencontre réelle : flore prédatrice, petites créatures, spores et quatre vagues de proies au delta de simulation.', implementationOriginal: true, runtimeStatus: 'encounter' },
  { id: 'event_jungle_fireteam_directive', name: 'Directive de l’escouade jungle', sourceTier: 'SCREEN', description: 'Adaptation de gameplay originale de la traque méthodique de l’escouade de Predator.', sources: ['predator1987'], gameplay: 'Trois vagues réelles déploient éclaireur, mitrailleur et piégeur dans des secteurs distincts de la jungle.', implementationOriginal: true, runtimeStatus: 'encounter' },
  { id: 'event_avp_blooding_directive', name: 'Directive du rite du sang', sourceTier: 'AVP_SCREEN', description: 'Adaptation de gameplay originale du rite de passage et de la montée des castes xénomorphes dans AVP.', sources: ['avp2004'], gameplay: 'Trois vagues réelles opposent successivement drone, guerrier et coureur au jeune chasseur.', implementationOriginal: true, runtimeStatus: 'encounter' },
  { id: 'event_apex_trophy_convoy', name: 'Convoi de trophées Apex', sourceTier: 'ORIGINAL', description: 'Interprétation originale Apex Hunt : événement itinérant sans équivalent écran revendiqué.', sources: [], gameplay: 'Intercepter une barge rapporte des matériaux mais déclenche un chasseur rival.' },
  ...EXPANDED_LEVEL_EVENT_CATALOG,
]);

export const HUNT_BOSS_CATALOG = freezeCatalog([
  { id: 'goliath', name: 'Goliath Xeno-Akumo', sourceTier: 'ORIGINAL', description: 'Interprétation originale Apex Hunt : espèce, anatomie et chasse propres au jeu.', sources: [], gameplay: 'Détruire ses plaques blindées ouvre de courtes fenêtres de dégâts.' },
  { id: 'xeno_queen', name: 'Reine xénomorphe de la ruche', sourceTier: 'ORIGINAL', description: 'Interprétation originale Apex Hunt : mission originale fondée sur la Reine de la branche AVP écran.', sources: [], gameplay: 'Brûler les œufs réduit les renforts avant l’assaut de la Reine.' },
  { id: 'bad_blood', name: 'Rival Yautja « Bad Blood »', sourceTier: 'ORIGINAL', description: 'Interprétation originale Apex Hunt : rival précis créé pour le duel miroir du jeu.', sources: [], gameplay: 'Copie une partie de l’équipement du joueur et punit les abus de camouflage.' },
  { id: 'predalien', name: 'Predalien légendaire', sourceTier: 'ORIGINAL', description: 'Interprétation originale Apex Hunt : variante de boss distincte du Predalien écran.', sources: [], gameplay: 'Alterner vision xénomorphe et mobilité verticale pour anticiper ses charges.' },
  { id: 'boss_berserker_super_predator', name: 'Super Predator — Berserker', sourceTier: 'SCREEN', description: 'Chef brutal du trio de chasseurs antagonistes de Predators.', sources: ['predators2010'], gameplay: 'Boss miroir lourd : plasma, camouflage et exécution au corps à corps.' },
  { id: 'boss_feral_2022', name: 'Feral Predator', sourceTier: 'SCREEN', description: 'Chasseur de Prey doté d’un arsenal et d’une approche distincts.', sources: ['prey2022'], gameplay: 'Sixième boss jouable : triple lance-traits, bouclier frontal destructible, estoc et charge à la lance.' },
  { id: 'boss_wolf_cleaner', name: 'Wolf — nettoyeur', sourceTier: 'AVP_SCREEN', description: 'Chasseur expérimenté envoyé contre l’infestation de Gunnison.', sources: ['avpRequiem2007'], gameplay: 'Duel tactique multi-outils où chaque gadget contré change sa rotation.' },
  { id: 'boss_kalisk_badlands', name: 'Kalisk de Badlands', sourceTier: 'SCREEN', description: 'Adversaire suprême au cœur de la chasse de Dek dans Badlands.', sources: ['badlands2025'], gameplay: 'Boss de mégafaune en trois phases avec faiblesses révélées par observation.' },
  ...EXPANDED_HUNT_BOSS_CATALOG,
]);

export const SUPPORT_CATALOG = freezeCatalog(SUPPORT_CATALOG_ENTRIES);

export const YautjaContentCatalog = Object.freeze({
  masks: MASK_VARIANTS,
  dreadPalettes: DREAD_PALETTES,
  skinPalettes: SKIN_PALETTES,
  armorPalettes: ARMOR_PALETTES,
  armorAccents: ARMOR_ACCENTS,
  technology: TECH_CATALOG,
  vehicles: VEHICLE_CATALOG,
  enemies: ENEMY_CATALOG,
  levelEvents: LEVEL_EVENT_CATALOG,
  huntBosses: HUNT_BOSS_CATALOG,
  support: SUPPORT_CATALOG,
});

export const ALL_YAUTJA_CONTENT = Object.freeze(Object.values(YautjaContentCatalog).flat());
export const getYautjaContentById = (id) => ALL_YAUTJA_CONTENT.find((entry) => entry.id === id) ?? null;

export default YautjaContentCatalog;
