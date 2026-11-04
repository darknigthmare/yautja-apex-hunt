// Canon-conscious lore data for Yautja: Apex Hunt.
// UI rule: always display the sourceTier badge with an entry.

import { getAlienBaseArchiveCodexEntries } from './AlienBaseFederation.js';
import {getAlienRegistryResearchCodexEntries} from './AlienBaseRegistryV2.js';
export const LORE_SOURCE_TIERS = Object.freeze({
  SCREEN: Object.freeze({ id: 'SCREEN', label: 'ÉCRAN PRINCIPAL PREDATOR / ALIEN', shortLabel: 'ÉCRAN', color: '#55e6a5', priority: 1 }),
  AVP_SCREEN: Object.freeze({ id: 'AVP_SCREEN', label: 'ÉCRAN AVP', shortLabel: 'AVP', color: '#e9b949', priority: 2 }),
  LICENSED_SCREEN_DESIGN: Object.freeze({ id: 'LICENSED_SCREEN_DESIGN', label: 'DESIGN ÉCRAN DOCUMENTÉ SOUS LICENCE', shortLabel: 'DESIGN', color: '#8dd7c6', priority: 3 }),
  LICENSED_EU: Object.freeze({ id: 'LICENSED_EU', label: 'UNIVERS ÉTENDU SOUS LICENCE', shortLabel: 'EU', color: '#7aa2f7', priority: 4 }),
  MERCH_CONCEPT: Object.freeze({ id: 'MERCH_CONCEPT', label: 'CONCEPT DE COLLECTION SOUS LICENCE', shortLabel: 'MERCH', color: '#d6a75c', priority: 5 }),
  ORIGINAL: Object.freeze({ id: 'ORIGINAL', label: 'CRÉATION APEX HUNT', shortLabel: 'ORIGINAL', color: '#ff7a8a', priority: 6 }),
  RESEARCH: Object.freeze({ id: 'RESEARCH', label: 'RECHERCHE INTER-JEUX À VÉRIFIER', shortLabel: 'RECH.', color: '#9baab6', priority: 7 })
});

export const LORE_SOURCES = Object.freeze({
  alien1979: { title: 'Alien (1979)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/alien' },
  alienIsolation2014: { title: 'Alien: Isolation (2014)', tier: 'LICENSED_EU', url: 'https://store.steampowered.com/app/214490/Alien_Isolation/' },
  alienRomulus2024: { title: 'Alien: Romulus (2024)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/alien-romulus' },
  prometheus2012: { title: 'Prometheus (2012)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/prometheus' },
  alienCovenant2017: { title: 'Alien: Covenant (2017)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/alien-covenant' },
  predator1987: { title: 'Predator (1987)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/predator' },
  predatorArchives: { title: 'Predator — Walt Disney Archives', tier: 'SCREEN', url: 'https://thewaltdisneycompany.com/news/predator-archives/' },
  predator2: { title: 'Predator 2 (1990)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/predator-2' },
  predators2010: { title: 'Predators (2010)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/predators' },
  prey2022: { title: 'Prey (2022)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/prey' },
  thePredator2018: { title: 'The Predator (2018)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/the-predator' },
  assassin2018Gear: { title: 'The Predator — Armored Assassin', tier: 'LICENSED_SCREEN_DESIGN', url: 'https://store.necaonline.com/products/predator-2018-deluxe-armored-assassin-predator-12-inch-action-figure' },
  killerOfKillers: { title: 'Predator: Killer of Killers (2025)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/predator-killer-of-killers' },
  badlands2025: { title: 'Predator: Badlands (2025)', tier: 'SCREEN', url: 'https://thewaltdisneycompany.com/news/predator-badlands/' },
  badlandsGear: { title: 'Predator: Badlands — équipement de Dek', tier: 'SCREEN', url: 'https://store.necaonline.com/products/predator-badlands-ultimate-dek-training-armor-7-inch-scale-action-figure' },
  badlandsCompanions: { title: 'Predator: Badlands — Thia et Bud', tier: 'SCREEN', url: 'https://store.necaonline.com/products/predator-badlands-ultimate-thia-bud-7-inch-scale-action-figures' },
  avp2004: { title: 'Alien vs. Predator (2004)', tier: 'AVP_SCREEN', url: 'https://www.20thcenturystudios.com/movies/alien-vs-predator' },
  avpRequiem2007: { title: 'Aliens vs. Predator: Requiem (2007)', tier: 'AVP_SCREEN', url: 'https://www.20thcenturystudios.com/movies/aliens-vs-predator-requiem' },
  aliens1986: { title: 'Aliens (1986)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/aliens' },
  huntingGrounds: { title: 'Predator: Hunting Grounds — équipement', tier: 'LICENSED_EU', url: 'https://predator.illfonic.com/the-predator/' },
  avpOriginalComics: { title: 'AVP — comics originaux Dark Horse', tier: 'LICENSED_EU', url: 'https://digital.darkhorse.com/books/47483ce0aec5466783599e38c9d0ac47/aliens-vs-predator-the-original-comics-series-30th-anniversary-edition' },
  huntingGroundsUpdates: { title: 'Predator: Hunting Grounds — classes et patch notes', tier: 'LICENSED_EU', url: 'https://forum.predator.illfonic.com/c/News/patch-notes' },
  avpPreyOmnibus: { title: 'Aliens vs. Predator: Prey — omnibus Titan Books', tier: 'LICENSED_EU', url: 'https://titanbooks.com/8792-the-complete-aliens-vs-predator-omnibus/' },
  predatorBadBloodComics: { title: 'Predator: Bad Blood — catalogue Dark Horse', tier: 'LICENSED_EU', url: 'https://images.darkhorse.com/common/salestools/catalogs/DH_Backlist_2009.pdf' },
  lostTribeDesigns: { title: 'Predator 2 — Lost Tribe, designs documentés par NECA', tier: 'LICENSED_SCREEN_DESIGN', url: 'https://store.necaonline.com/blogs/news/predators-introducing-the-lost-tribe-from-our-series-6-action-figures' },
  wolfArsenalDesigns: { title: 'AVP:R — arsenal du Wolf documenté par NECA', tier: 'LICENSED_SCREEN_DESIGN', url: 'https://necaonline.com/2011/03/the-predators-deadly-arsenal/' },
  alien1979: { title: 'Alien (1979)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/alien' },
  alien3_1992: { title: 'Alien³ (1992)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/alien-3' },
  alienResurrection1997: { title: 'Alien: Resurrection (1997)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/alien-resurrection' },
  prometheus2012: { title: 'Prometheus (2012)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/prometheus' },
  alienCovenant2017: { title: 'Alien: Covenant (2017)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/alien-covenant' },
  alienRomulus2024: { title: 'Alien: Romulus (2024)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/alien-romulus' },
  alienIsolation2014: { title: 'Alien: Isolation (2014)', tier: 'LICENSED_EU', url: 'https://www.alienisolation.com' },
  aliensFireteamElite2021: { title: 'Aliens: Fireteam Elite (2021)', tier: 'LICENSED_EU', url: 'https://www.aliensfireteamelite.com' },
  aliensDarkDescent2023: { title: 'Aliens: Dark Descent (2023)', tier: 'LICENSED_EU', url: 'https://www.focus-entmt.com/en/games/aliens-dark-descent' },
  predatorConcreteJungle2005: { title: 'Predator: Concrete Jungle (2005)', tier: 'LICENSED_EU', url: 'https://store.necaonline.com/products/predator-concrete-jungle-scarface-ultimate-7-figure' }
});

const freezeEntries = (entries) => Object.freeze(entries.map((entry) => Object.freeze({
  ...entry,
  sources: Object.freeze(entry.sources ?? []),
  locationIds: Object.freeze(entry.locationIds ?? [])
})));

export const LORE_CODEX_ENTRIES = freezeEntries([
  {
    id: 'science-pathogene-noir-a03959x', entryType: 'codex', category: 'xenomorphes', title: 'Le Pathogène Noir (Chemical A0-3959X.91 & Composé Z-01)',
    summary: 'Agent mutagène primordial des Ingénieurs capable de réécrire le génome de toute forme de vie en monstruosités biomécaniques.',
    body: 'Découvert dans les urnes cylindriques des temples de LV-223 dans Prometheus, le Chemical A0-3959X.91 est un liquide noir visqueux déstabilisateur d’ADN. Manipulé par David 8 sur la Planète 4 pour engendrer les premiers Néomorphes et proto-Xénomorphes, il est synthétisé sous forme dérivée cryogénique Z-01 sur la station Renaissance dans Alien: Romulus.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['prometheus2012', 'alienCovenant2017', 'alienRomulus2024']
  },
  {
    id: 'culture-hierarchie-rangs-clans-yautja', entryType: 'codex', category: 'culture', title: 'Hiérarchie, Rangs de Clan et Arbitrage Yautja',
    summary: 'Organisation clanique stricte : Un-Blooded, Young Blood, Blooded, Élite, Anciens et Arbitres traquant les Bad Bloods.',
    body: 'La culture Yautja repose sur une méritocratie martiale sacrée. Les Sans-Sang (Un-Blooded) s’entraînent sur Yautja Prime avant le rite du premier sang (Young Blood). Une fois marqués de l’acide xénomorphe (Blooded), ils accèdent aux chasses interstellaires libres. Les Guerriers d’Élite et les Maîtres Anciens (Elders) président le Conseil clanique et mandatent des Arbitres (Enforcers) pour châtier sans merci les renégats dishonorables (Bad Bloods).',
    sourceTier: 'SCREEN', relatedTier: 'LICENSED_EU', isOriginal: false, sources: ['predator2', 'avp2004', 'predators2010', 'huntingGrounds']
  },
  {
    id: 'technologie-arsenal-colonial-marines-uscm', entryType: 'codex', category: 'technologie', title: 'Doctrine & Arsenal du Corps des Marines Coloniaux (USCM)',
    summary: 'Équipement militaire lourd d’intervention planétaire : M41A Pulse Rifle, M56 Smartgun, détecteurs de mouvement M314 et blindés APC.',
    body: 'Le Corps des Marines Coloniaux des États-Unis (USCM) constitue la force de frappe d’assaut rapide de l’humanité. Leur équipement emblématique comprend le fusil d’assaut à impulsion M41A tirant des munitions sans étui de 10mm explosives doublé d’un lance-grenades 30mm, le système de mitrailleuse gyro-stabilisée M56 Smartgun asservi à un viseur infrarouge, les tourelles sentinelles automatisées UA 571-C et les navettes de largage UD-4L Cheyenne déployant le blindé M577 APC.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['aliens1986', 'aliensFireteamElite2021']
  },
  {
    id: 'science-generations-synthetiques-androides', entryType: 'codex', category: 'technologie', title: 'Lignées d’Androïdes & Synthétiques Cybernétiques',
    summary: 'Évolution des personnes artificielles : Hyperdyne Ash, Bishop 341-B, David 8, Walter, Call (Auton), Working Joes et Andy ND-5.',
    body: 'Les synthétiques humanoïdes accompagnent toutes les missions spatiales majeures. Dès le modèle secret Ash (Hyperdyne 120-A/2) programmé pour sacrifier l’équipage du Nostromo, l’ingénierie progresse vers des modèles empathiques comme Bishop (modèle 341-B), des démiurges mégalomanes comme David 8, des protecteurs fiables comme Walter et Andy ND-5, des automates industriels rudimentaires et brutaux comme les Working Joes de Seegson sur Sébastopol, jusqu’aux Autons (synthétiques conçus par d’autres synthétiques) comme Annalee Call.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['alien1979', 'aliens1986', 'alienResurrection1997', 'prometheus2012', 'alienIsolation2014', 'alienRomulus2024']
  },
  {
    id: 'culture-ordre-special-937-weyland-yutani', entryType: 'codex', category: 'culture', title: 'L’Ordre Spécial 937 & l’Impératif Corporatiste XX121',
    summary: 'Directive corporatiste absolue accordant la priorité totale à la récupération d’organismes extraterrestres au détriment des équipages.',
    body: '« Priorité numéro un. Intercepter organisme pour analyse. Toutes les autres priorités, y compris la survie de l’équipage, sont secondaires. » Ce mot d’ordre dicté par la Weyland-Yutani traverse l’histoire spatiale. La compagnie, en rivalité féroce avec Seegson Industries, la Borgia Corporation et Prodigy Corp, considère le spécimen XX121 et la technologie Yautja comme le sommet absolu de la recherche biomédicale et militaire.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['alien1979', 'aliens1986', 'alienRomulus2024', 'predatorConcreteJungle2005']
  },
  {
    id: 'technologie-flotte-vaisseaux-mothership-juggernaut', entryType: 'codex', category: 'technologie', title: 'Architecture Navale : Croiseurs Stellaires & Vaisseaux Mères',
    summary: 'Nefs mères Yautja (Jag’d’ja Atoll), Juggernauts en croissant des Ingénieurs, transporteurs Conestoga et cargos stellaires.',
    body: 'Les chasseurs Yautja sillonnent le cosmos à bord de vaisseaux-mères massifs équipés de baies de stase, de chambres d’armement et de capsules de descente atmosphérique. Ils croisent les gigantesques transporteurs d’urnes en croissant (Juggernaut) abandonnés par les Ingénieurs sur LV-223 et LV-426, ainsi que les vaisseaux industriels humains : le cargo de raffinage USCSS Nostromo et le croiseur lourd USCM USS Sulaco de classe Conestoga.',
    sourceTier: 'SCREEN', relatedTier: 'AVP_SCREEN', isOriginal: false, sources: ['predator1987', 'predator2', 'aliens1986', 'avp2004', 'prometheus2012']
  },
  {
    id: 'culture-fonderie-fiorina-161-dragon', entryType: 'codex', category: 'lieu', title: 'Colonie Minière Fiorina 161 & Incident du « Dragon » (2179)',
    summary: 'Complexe carcéral et fonderie désaffectée balayée par les tempêtes, théâtre de la traque du Runner quadrupède né d’un hôte canin.',
    body: 'Fiorina « Fury » 161 est une ancienne colonie pénitentiaire de haute sécurité abritant des prisonniers atteints du syndrome chromosomique double Y. Dépourvus d’armes à feu suite à la fermeture des forges, les résidents et Ellen Ripley ont piégé le Runner xénomorphe (surnommé le Dragon) dans le moule de coulée en déversant des tonnes de plomb fondu avant de le pulvériser par choc thermique à l’eau glacée.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['alien3_1992']
  },
  {
    id: 'science-station-renaissance-romulus-remus', entryType: 'codex', category: 'lieu', title: 'Station Spatiale Renaissance : Modules Romulus & Remus',
    summary: 'Station de recherche orbitale désaffectée de Weyland-Yutani où furent synthétisés les Facehuggers cryogéniques et le composé Z-01.',
    body: 'Composée de deux modules distincts (Remus, dédié à l’ingénierie et au cryo-confinement, et Romulus, dédié à la génétique avancée et à l’Ordre Spécial 937), la station Renaissance a récupéré les restes du Big Chap dérivant dans l’espace après la destruction du Nostromo. Les scientifiques y ont extrait la souche d’ADN xénomorphe purifiée avant que l’installation ne soit submergée et n’entre en trajectoire de collision avec les anneaux planétaires de Jackson’s Star.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['alienRomulus2024']
  },
  {
    id: 'culture-code-de-la-chasse', entryType: 'codex', category: 'culture', title: 'Le code de la chasse',
    summary: 'Les Yautja recherchent des adversaires capables de résister et transforment leurs victoires en preuves de valeur.',
    body: 'Les films montrent une conduite ritualisée, mais pas une liste de règles identique pour tous les clans. Épargner parfois une cible inoffensive ne fait pas des Yautja des arbitres moraux universels.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['predator1987', 'predatorArchives', 'killerOfKillers']
  },
  {
    id: 'premiere-chasse-progression', entryType: 'codex', category: 'culture', title: 'Première chasse et progression',
    summary: 'Une première chasse peut servir d’épreuve de valeur ; certains équipements sont gagnés plutôt que reçus d’office.',
    body: 'Badlands montre un jeune chasseur sans camouflage ni canon d’épaule. Le rite xénomorphe de la pyramide appartient séparément à la branche AVP.',
    sourceTier: 'SCREEN', relatedTier: 'AVP_SCREEN', isOriginal: false, sources: ['badlands2025', 'avp2004']
  },
  {
    id: 'technologie-biomasque', entryType: 'codex', category: 'technologie', title: 'Biomasque',
    summary: 'Le masque assiste la détection, les modes visuels et le ciblage du canon d’épaule.',
    body: 'Vision thermique et viseur à trois points sont des repères écran sûrs. Le jeu ne les présente pas comme une capacité biologique identique chez chaque Yautja.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['predator1987', 'predator2', 'prey2022']
  },
  {
    id: 'technologie-camouflage', entryType: 'codex', category: 'technologie', title: 'Camouflage réfractif',
    summary: 'Il courbe la lumière et rend le chasseur difficile à distinguer, sans le rendre parfaitement invisible.',
    body: 'Eau, dégâts, mouvement et décor peuvent révéler la silhouette. La boue froide masque une signature thermique ; elle ne désactive pas le camouflage du Yautja.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['predator1987', 'predatorArchives', 'huntingGrounds']
  },
  {
    id: 'technologie-plasma-caster', entryType: 'codex', category: 'technologie', title: 'Canon à plasma',
    summary: 'Arme d’épaule énergétique liée au système de visée du biomasque.',
    body: 'Sa puissance et sa portée sont établies. Les arsenaux varient selon les chasseurs et les époques montrés à l’écran, sans qu’une cause unique soit énoncée pour toutes ces différences.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['predator1987', 'predator2', 'huntingGrounds']
  },
  {
    id: 'technologie-agent-cleaner', entryType: 'codex', category: 'technologie', title: 'Agent de dissolution Cleaner',
    summary: 'Wolf transporte un composé bleu destiné à effacer les organismes et les traces de l’épidémie de Gunnison.',
    body: 'L’usage de l’agent et la mission de nettoyage viennent d’AVP: Requiem. Les bassins persistants, leurs dégâts de corrosion et les conteneurs récupérables sont des systèmes de gameplay originaux Apex Hunt.',
    sourceTier: 'AVP_SCREEN', isOriginal: false, gameInterpretationOriginal: true, sources: ['avpRequiem2007', 'wolfArsenalDesigns']
  },
  {
    id: 'technologie-fusee-poignet', entryType: 'codex', category: 'technologie', title: 'Fusée de poignet',
    summary: 'Projectile explosif compact associé à l’arsenal du chasseur urbain.',
    body: 'Le jeu en fait une arme à souffle dégressif afin de distinguer sa fonction du canon à plasma. Dégâts, rayon et coût énergétique sont des valeurs originales de gameplay.',
    sourceTier: 'SCREEN', isOriginal: false, gameInterpretationOriginal: true, sources: ['predator2']
  },
  {
    id: 'technologie-medicomp-urbain', entryType: 'codex', category: 'technologie', title: 'Medicomp et respirateur urbains',
    summary: 'Le chasseur de Los Angeles transporte un nécessaire de soin et un appareil respiratoire spécialisé.',
    body: 'La dixième chasse matérialise ces deux pièces sur le boss. Le soin progressif interruptible et le verrou multispectral destructible sont des adaptations originales, pas une reconstitution scène par scène.',
    sourceTier: 'SCREEN', isOriginal: false, gameInterpretationOriginal: true, sources: ['predator2']
  },
  {
    id: 'culture-trophees', entryType: 'codex', category: 'culture', title: 'Trophées et mémoire de chasse',
    summary: 'Crânes, colonnes vertébrales et armes prises à des adversaires remarquables matérialisent les chasses accomplies.',
    body: 'Un corps écorché ou suspendu n’est pas automatiquement un trophée honorifique : le Codex distingue mise en scène, dépouille et pièce sélectionnée.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['predator1987', 'predator2', 'huntingGrounds']
  },
  {
    id: 'culture-clans', entryType: 'codex', category: 'culture', title: 'Clans, variantes et exil',
    summary: 'Clans, nouvelles lignées et chasseurs exilés prouvent que les Yautja ne forment pas une monoculture.',
    body: 'Badlands confirme clan et exil ; Predators montre un conflit entre groupes. Young Blood, Blooded, Elite et Elder restent surtout des conventions EU et de gameplay.',
    sourceTier: 'SCREEN', relatedTier: 'LICENSED_EU', isOriginal: false, sources: ['predators2010', 'badlands2025', 'avpPreyOmnibus']
  },
  {
    id: 'xenomorphes-separation-avp', entryType: 'codex', category: 'xenomorphes', title: 'Xénomorphes : branche AVP',
    summary: 'La chasse rituelle de Xénomorphes existe dans AVP, sans définir automatiquement toute la culture Yautja.',
    body: 'Predator 2 montre un crâne xénomorphe et AVP une épreuve alimentée par des œufs. « Kiande amedha », Ryushi et les rites détaillés viennent surtout de l’EU.',
    sourceTier: 'AVP_SCREEN', relatedTier: 'LICENSED_EU', isOriginal: false, sources: ['predator2', 'avp2004', 'avpOriginalComics', 'avpPreyOmnibus']
  },
  {
    id: 'culture-val-verde-incursion', entryType: 'codex', category: 'culture', title: 'Incursion de Val Verde (1987)',
    summary: 'La première traque moderne documentée sur Terre oppose le Jungle Hunter à une équipe de sauvetage d’élite.',
    body: 'Le film montre une élimination méthodique isolant chaque membre de l’escouade : éclaireurs, tireurs lourds et piégeurs sont neutralisés un à un avant le duel final à mains nues.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['predator1987', 'predatorArchives']
  },
  {
    id: 'technologie-vocalisation-mimique-1987', entryType: 'codex', category: 'technologie', title: 'Vocalisations et synthèse mimique',
    summary: 'Le Jungle Hunter capture et reproduit les fréquences vocales de ses proies pour désorienter les survivants.',
    body: 'Peter Cullen et Kevin Peter Hall ont conçu des modulations de gorge et cliquetis distincts, combinés aux enregistrements du biomasque pour attirer les cibles isolées ou signer le rire d’autodestruction.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['predator1987']
  },
  {
    id: 'technologie-bouclier-osseux-feral', entryType: 'codex', category: 'technologie', title: 'Bouclier segmenté du Feral',
    summary: 'Le Feral porte au bras gauche un bouclier rétractable qui se déploie en segments et sert aussi d’arme de frappe.',
    body: 'Prey montre le bouclier encaissant balles de mousquet et flèches avant de se replier contre l’avant-bras. Apex Hunt en dérive une intégrité limitée à l’arc frontal ; cette valeur chiffrée est une adaptation de gameplay.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['prey2022']
  },
  {
    id: 'culture-rituel-prey-1719', entryType: 'codex', category: 'culture', title: 'Grandes Plaines, 1719',
    summary: 'Sur le territoire comanche, le Feral gravit une échelle de proies : serpent, loup, ours, puis humains armés.',
    body: 'Le film oppose Naru, ses compagnons comanches et un camp de trappeurs français au chasseur. Il épargne les cibles qu’il ne juge pas menaçantes, un comportement que le Codex distingue de l’honneur codifié de l’EU.',
    sourceTier: 'SCREEN', relatedTier: 'LICENSED_EU', isOriginal: false, sources: ['prey2022']
  },
  {
    id: 'relique-pistolet-adolini-1715', entryType: 'codex', category: 'technologie', title: 'Pistolet à silex de Raphael Adolini (1715)',
    summary: 'Arme à feu humaine remise par l’Elder Greyback à Mike Harrigan en 1997, gravée « Raphael Adolini 1715 ».',
    body: 'Présenté à la fin de Predator 2 (1990), ce pistolet atteste la présence séculaire des Yautja sur Terre. Prey (2022) en retrace l’origine en 1719 lorsque Naru le reçoit du navigateur et traducteur blessé Raphael Adolini. Dans Apex Hunt, la relique repose sous champ de stase au centre du sanctuaire des trophées.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['predator2', 'prey2022']
  },
  {
    id: 'culture-guerre-des-clans-super-predators', entryType: 'codex', category: 'culture', title: 'Guerre des clans et Super Predators (2010)',
    summary: 'Conflit fratricide et vendetta sanglante opposant les sous-espèces Yautja sur la planète-réserve.',
    body: 'Predators (2010) met en scène la rupture avec le code rituel : le Berserker (Mr. Black), le Falconer et le Tracker capturent et torturent un Classic Predator sans duel loyal. Leurs tactiques reposent sur des battues mécaniques, des drones et des meutes de Hell-Hounds modifiés.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['predators2010']
  },
  {
    id: 'technologie-agent-dissolvant-cleaner', entryType: 'codex', category: 'technologie', title: 'Agent dissolvant moléculaire (Cleaner)',
    summary: 'Fluide bleu hautement réactif utilisé par les vétérans Cleaners pour effacer toute trace d’infestation xénomorphe.',
    body: 'Introduit dans Aliens vs. Predator: Requiem (2007), ce réactif corrosif liquéfie la matière organique en quelques secondes sans laisser de résidus biologiques ou d’ADN extraterrestre. Il est déployé par seringue ou pulvérisation de zone.',
    sourceTier: 'AVP_SCREEN', isOriginal: false, sources: ['avpRequiem2007']
  },
  {
    id: 'culture-rite-du-sang-bouvetoya', entryType: 'codex', category: 'culture', title: 'Rite d’initiation de Bouvetøya (2004)',
    summary: 'Régiment d’épreuve millénaire où de jeunes initiés Yautja affrontent la progéniture de la Reine sous la glace antarctique.',
    body: 'Alien vs. Predator (2004) révèle que l’humanité vénérait les Yautja comme des dieux et fournissait des sacrifices pour nourrir la ruche pyramidale. Les trois initiés (Scar, Celtic, Chopper) devaient récupérer leurs plasmacasters et marquer leur front et leur biomasque du sang corrosif acide des Xénomorphes pour devenir Sang-Mêlé (Blooded).',
    sourceTier: 'AVP_SCREEN', isOriginal: false, sources: ['avp2004']
  },
  {
    id: 'technologie-medicomp-chirurgie-terrain', entryType: 'codex', category: 'technologie', title: 'Medicomp et chirurgie de terrain Yautja',
    summary: 'Trousse médicale hermétique et étagée contenant pinces d’extraction, brûleur plasma, agrafeuse dermique et gel coagulant bleu.',
    body: 'Documenté dans Predator (1987) et Predator 2 (1990), le Medicomp permet au chasseur d’opérer des auto-interventions d’extrême urgence en plein territoire hostile. Le City Hunter extrait les plombs à la pince, cautérise les chairs au plasma et applique la pâte bleue de coagulation accélérée.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['predator1987', 'predator2']
  },
  {
    id: 'science-laboratoire-medical-cleaner', entryType: 'codex', category: 'technologie', title: 'Bio-ingénierie et neutralisation cellulaire Cleaner',
    summary: 'Installations de confinement et de purification biologique utilisées par les vétérans Cleaners sur leurs croiseurs.',
    body: 'Aliens vs. Predator: Requiem (2007) montre l’arsenal médical et chimique de Wolf : fioles alcalines anti-acide, seringues de prélèvement d’ADN et tables chirurgicales de décontamination. Apex Hunt intègre ce laboratoire dans le compartiment médical du vaisseau-mère.',
    sourceTier: 'AVP_SCREEN', isOriginal: false, sources: ['avpRequiem2007']
  },
  {
    id: 'culture-rituel-marquage-sang', entryType: 'codex', category: 'culture', title: 'Le rite du sang et la marque d’acide (Blooded Rite)',
    summary: 'Rite de passage sacré où l’initié marque son masque du sang acide d’un Xénomorphe vaincu.',
    body: 'Présenté dans Alien vs. Predator (2004), ce rituel confère au Jeune Sang le rang honorifique de Guerrier Marqué (Blooded Warrior / Oram-gai). Scar grave le glyphe de son clan sur son bio-masque et son os frontal à l’aide d’un doigt trempé dans l’acide d’un Facehugger mort.',
    sourceTier: 'AVP_SCREEN', isOriginal: false, sources: ['avp2004']
  },
  {
    id: 'technologie-dispositif-autodestruction', entryType: 'codex', category: 'technologie', title: 'Dispositif d’autodestruction du gantelet Yautja',
    summary: 'Protocole de micro-fusion thermonucléaire scellant l’honneur du chasseur et anéantissant sa technologie.',
    body: 'Séquence emblématique de Predator (1987) et d’AVP (2004). Commandé depuis le clavier numérique du poignet, le décompte en glyphes Yautja ascendants s’accompagne d’un signal sonore sinistre. La détonation vaporise tout dans un rayon de plusieurs dizaines de mètres pour empêcher qu’une technologie extraterrestre ne tombe aux mains d’espèces indignes.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['predator1987', 'avp2004']
  },
  {
    id: 'technologie-viseur-trilaser', entryType: 'codex', category: 'technologie', title: 'Système de ciblage tri-laser et visée convergente',
    summary: 'Signature optique projetant trois faisceaux laser rouges convergents couplés à l’asservissement du canon à plasma.',
    body: 'Apparu dès Predator (1987) et reconduit dans Predator 2 (1990), le triangle de visée rouge se projette depuis la tempe du biomasque sur la proie. En se resserrant, les trois points calculent la distance télémétrique et verrouillent la trajectoire balistique pour garantir un impact critique.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['predator1987', 'predator2']
  },
  {
    id: 'biologie-physiologie-anatomie-yautja', entryType: 'codex', category: 'culture', title: 'Biologie, Anatomie & Métabolisme Yautja',
    summary: 'Physiologie reptilienne/humanoïde supérieure : sang chimiluminescent au cuivre, vision thermique, métabolisme anaérobie et faisceaux sensoriels.',
    body: 'Les Yautja mesurent en moyenne 2,20m à 2,50m pour plus de 150kg de masse musculaire hyper-dense. Leur sang vert fluorescent, riche en cuivre et en amines phosphorées, neutralise partiellement les acides faibles. Leurs yeux possèdent une rétine sensible au spectre infrarouge thermique lointain. Leur système mandibulaire quadruplé articulé permet la morsure réflexe et la modulation des cliquetis gutturaux. Leurs cordes crâniennes ("dreads") contiennent des ramifications du système nerveux central liées à l’équilibre et à la proprioception.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['predatorArchives', 'predator1987', 'huntingGrounds'], universe: 'PREDATOR'
  },
  {
    id: 'culture-langue-glyphes-cuniforme-yautja', entryType: 'codex', category: 'culture', title: 'Linguistique Yautja : Glyphes Cuniformes & Signaux Sonores',
    summary: 'Système d’écriture logographique angulaire et communication vocale combinant trilles, cliquetis de mandibulaires et synthèse mimique.',
    body: 'L’écriture Yautja repose sur des idéogrammes géométriques séquentiels formés de segments verticaux et obliques, visibles sur le compte à rebours d’autodestruction du gantelet et les réticules du biomasque. La communication acoustique articule des fréquences inaudibles pour l’oreille humaine, des cliquetis mandibulaires trillés pour la coordination en meute, des rugissements de défi gutturaux et l’usage répété d’enregistrements de voix humaines pour leurrer les proies.',
    sourceTier: 'SCREEN', relatedTier: 'LICENSED_EU', isOriginal: false, sources: ['predator1987', 'predator2', 'avpOriginalComics'], universe: 'PREDATOR'
  },
  {
    id: 'culture-matriarches-yautja-prime-societe', entryType: 'codex', category: 'culture', title: 'Société Clanique : Yautja Prime & Suprématie des Matriarches',
    summary: 'Organisation matriarcale sur le monde natal Yautja Prime : sélection des reproducteurs, garde des sanctuaires et chefferies suprêmes.',
    body: 'Yautja Prime est un monde aride et tempétueux ponctué de cités pyramidales monolithiques et d’arènes d’entraînement. Alors que les mâles parcourent les étoiles pour chasser, les grandes Matriarches régissent les territoires claniques. Plus massives et physiquement plus puissantes que les mâles de guerre, elles sélectionnent les lignées d’accouplement sur la base des trophées rapportés et gardent les sanctuaires d’honneur et les reliques ancestrales du Conseil.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['avpPreyOmnibus', 'huntingGrounds'], universe: 'PREDATOR'
  },
  {
    id: 'science-ingenieurs-malakak-mutagene-originel', entryType: 'codex', category: 'xenomorphes', title: 'Les Ingénieurs (Mala\'kak) & la Genèse du Mutagène Noir',
    summary: 'Civilisation précurseur créatrice de la vie humanoïde et du pathogène Chemical A0-3959X sur LV-223 et la Planète 4.',
    body: 'Les Ingénieurs (ou Mala\'kak dans les archives étendues) sont des humanoïdes géants au teint marbré possédant une maîtrise absolue de la bio-ingénierie sacrificielle. Dans Prometheus, un Ingénieur boit le fluide noir pour dissoudre son propre ADN et féconder les océans primitifs de la Terre. Leurs complexes militaires de LV-223 stockaient des milliers d’urnes contenant le mutagène déstabilisateur destiné à éradiquer l’humanité à bord de croiseurs stellaires Juggernaut.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['prometheus2012', 'alienCovenant2017'], universe: 'ALIEN'
  },
  {
    id: 'xenomorphes-cycle-biologique-mues-castes', entryType: 'codex', category: 'xenomorphes', title: 'Cycle Biologique Xénomorphe : Mues, Castes & Réflexe ADN',
    summary: 'Cycle évolutif complet du spécimen XX121 : Ovomorph, Facehugger royal, Chestburster, Drone, Guerrier, Prétorien et Reine mère.',
    body: 'L’organisme XX121 est le prédateur ultime parasitaire. La Reine pond des Ovomorphs libérant des Facehuggers qui implantent un embryon dans l’appareil digestif de l’hôte. Grâce au « réflexe ADN », le fœtus assimile les propriétés motrices et physiologiques de sa victime (bipédie sur l’humain, quadrupédie vélociraptor sur le chien/bœuf, robustesse chitineuse sur le Yautja donnant le Predalien). Les individus muent ensuite de Drones en Guerriers à crête striée, puis en Prétoriens royaux avant de développer une nouvelle colonie.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['alien1979', 'aliens1986', 'alienRomulus2024'], universe: 'ALIEN'
  },
  {
    id: 'factions-owlf-stargazer-recherche-anti-yautja', entryType: 'codex', category: 'technologie', title: 'Agences Secrètes Terrestres : Traqueurs OWLF & Projet Stargazer',
    summary: 'Unités spéciales militaires de rétro-ingénierie Yautja : combinaisons thermiques OWLF de Peter Keyes et complexe Stargazer de Traeger.',
    body: 'L’Other World Life Forms (OWLF), fondée suite au massacre de Val Verde en 1987, intervient dans Predator 2 sous les ordres de Peter Keyes avec des combinaisons cryogéniques isolantes pour dissimuler leur chaleur corporelle. En 2018, Sean Keyes et Will Traeger dirigent le Projet Stargazer, une division secrète séquestrant le Fugitive Predator et rétro-ingéniant le biomasque, le camouflage et les capsules d’hybridation ADN avant la riposte de l’Assassin géant.',
    sourceTier: 'SCREEN', relatedTier: 'LICENSED_EU', isOriginal: false, sources: ['predator2', 'thePredator2018', 'huntingGrounds'], universe: 'PREDATOR'
  },
  {
    id: 'factions-corporations-seegson-hyperdyne-borgia', entryType: 'codex', category: 'culture', title: 'Corporations Rivales de la Frontière : Seegson, Hyperdyne & Borgia',
    summary: 'Guerre économique et technologique entre géants corporatistes : Seegson sur Sébastopol, Hyperdyne Systems et le cartel Borgia.',
    body: 'Weyland-Yutani n’est pas le seul conglomérat en quête de suprématie. Seegson Industries commercialise les Working Joes rudimentaires sur la station Sébastopol face à sa faillite imminente. Hyperdyne Systems déploie des modèles synthétiques militaires de pointe tels que Samuel et Ash. À Neonopolis en 2005, la Borgia Corporation et son fondateur Bruno Borgia piratent l’arsenal abandonné du Yautja Scarface pour développer des armes à plasma et des cyber-améliorations génétiques.',
    sourceTier: 'LICENSED_EU', relatedTier: 'SCREEN', isOriginal: false, sources: ['alienIsolation2014', 'predatorConcreteJungle2005', 'alien1979'], universe: 'ALIEN'
  },
  {
    id: 'lore-chronique-ryushi-machiko-noguchi-broken-tusk', entryType: 'codex', category: 'culture', title: 'L’Incident de Ryushi : Dachande (Broken Tusk) & Machiko Noguchi',
    summary: 'L’épreuve fondatrice d’AVP (1990) : alliance d’honneur sur le monde d’élevage de Ryushi et initiation historique de Machiko Noguchi.',
    body: 'Dans le comic fondateur Aliens vs. Predator (1990), le clan de Dachande (Broken Tusk) lâche des œufs xénomorphes sur la planète pastorale de Ryushi. Face à la submersion de la colonie, Dachande combat côte à côte avec l’administratrice humaine Machiko Noguchi. Admiratif de son courage au tir et de son intrépidité face à la Reine, Dachande grave la marque du clan sur son front avant de succomber, faisant de Machiko la première et seule humaine acceptée parmi les guerriers stellaires Yautja.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['avpOriginalComics', 'avpPreyOmnibus'], universe: 'AVP'
  },
  {
    id: 'technologie-reserves-chasse-planetes-gibier', entryType: 'codex', category: 'technologie', title: 'Réserves de Chasse Interstellaires & Vaisseaux de Moisson',
    summary: 'Mondes réserves préservés pour la traque : largage en capsules cinétiques, faune importée et rivalités territoriales de clans.',
    body: 'Dans Predators (2010), les Super Predators maintiennent des planètes entières dédiées au rituel cynégétique. Des capsules orbitales parachutent les guerriers les plus dangereux de chaque monde (commandos, cartels, assassins, yakuza). La réserve combine une flore tropicale luxuriante, des balises de repérage et un campement central où le Berserker Clan utilise des meutes de Hell-Hounds et des drones faucons pour affiner leur suprématie génétique.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['predators2010', 'thePredator2018'], universe: 'PREDATOR'
  },
  {
    id: 'culture-bad-blood-enforcer-justice-clanique', entryType: 'codex', category: 'culture', title: 'L’Hérésie Bad Blood & les Répurgateurs Enforcers',
    summary: 'Les renégats ayant violé le Code d’Honneur et les juges Yautja mandatés pour les exterminer sans concession.',
    body: 'Un Yautja qui massacre des proies désarmées, des femmes enceintes ou des enfants, ou qui tue un pair en dehors d’un duel d’honneur codifié, est déclaré « Bad Blood » (Sang-Impur). Rejeté de la société clanique, il devient une abomination traquée à travers la galaxie par les Enforcers. Ces exécuteurs assermentés par les Anciens portent des armures d’argent mat et utilisent tout leur arsenal pour abattre les renégats et purifier leur dépouille par incinération totale.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['predatorBadBloodComics', 'predators2010'], universe: 'PREDATOR'
  },
  {
    id: 'factions-geopolitique-trois-empires-upp-ua', entryType: 'codex', category: 'culture', title: 'Géopolitique Stellaire : Trois Empires, Amériques Unies & UPP',
    summary: 'La guerre froide intersidérale partageant l’espace colonisé entre l’UA (USCM), le Three World Empire (3WE) et l’Union des Peuples Progressistes (UPP).',
    body: 'Au XXIIe siècle, l’expansion humaine dans les Territoires de la Frontière (Outer Rim) est fracturée en trois superpuissances rivales. L’Empire des Trois Mondes (3WE, alliance Royaume-Uni, Japon et Inde) s’appuie sur la Weyland-Yutani et la Royal Marines Commando. Les Amériques Unies (UA) déploient le Corps des Marines Coloniaux (USCM) comme gendarme stellaire. Face à eux, l’Union des Peuples Progressistes (UPP), bloc socialiste spatial technologiquement avancé, engage ses commandos Spetsnaz spatiaux pour disputer le contrôle des mondes miniers et des bio-armes.',
    sourceTier: 'LICENSED_EU', relatedTier: 'SCREEN', isOriginal: false, sources: ['aliens1986', 'aliensFireteamElite2021', 'aliensDarkDescent2023'], universe: 'ALIEN'
  },
  {
    id: 'xenomorphes-hierarchie-reine-mere-empress-palatine', entryType: 'codex', category: 'xenomorphes', title: 'Xéno-Biologie Royale : Reine-Mère, Impératrice & Gardes Palatins',
    summary: 'La super-hiérarchie des ruches planétaires : Impératrices (Empress), Reine-Mère souveraine (Queen Mother) et relais télépathique inter-castes.',
    body: 'Lorsqu’une infestation xénomorphe recouvre un continent ou une planète entière, plusieurs Reines classiques entrent en compétition jusqu’à l’émergence d’une Impératrice (Empress) plus massive et dotée d’une couronne crânienne dentelée. Au sommet absolu de l’espèce XX121 sur son monde natal règne la Reine-Mère (Queen Mother), capable de coordonner télépathiquement des millions d’individus à travers l’espace et protégée par la caste d’élite des Palatins et des Prétoriens royaux.',
    sourceTier: 'LICENSED_EU', relatedTier: 'SCREEN', isOriginal: false, sources: ['aliens1986', 'avpOriginalComics', 'aliensFireteamElite2021'], universe: 'ALIEN'
  },
  {
    id: 'science-clonage-usm-auriga-ripley8-newborn', entryType: 'codex', category: 'xenomorphes', title: 'Programme de Clonage USM Auriga, Ripley 8 & Hybride Newborn (2381)',
    summary: 'Les expérimentations génétiques de l’United Systems Military : sept clones tragiques, la réussite hybride Ripley 8 et l’abomination Newborn.',
    body: 'Deux siècles après le sacrifice d’Ellen Ripley sur Fiorina 161, les scientifiques militaires de l’USM Auriga (Dr Gediman et Dr Wren) clonent ses échantillons sanguins congelés pour extraire l’embryon royal. Après sept itérations monstrueuses déformées, le clone numéro 8 (Ripley 8) survit avec une force surhumaine, un sang acide corrosif et une empathie psychique liée à la ruche. En retour, la Reine hérite d’un cycle utérin humain et engendre le Newborn, hybride blême et meurtrier doté d’un regard anthropomorphe.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['alienResurrection1997'], universe: 'ALIEN'
  },
  {
    id: 'technologie-logistique-lourde-p5000-ud4l-apc', entryType: 'codex', category: 'technologie', title: 'Logistique Lourde : Exosquelette P-5000, Blindé APC & Navette UD-4L',
    summary: 'Les piliers mécaniques de la colonisation et de l’assaut : Caterpillar P-5000 Power Loader, transport blindé M577 et Dropship Cheyenne.',
    body: 'La survie sur les mondes hostiles dépend d’une ingénierie mécanique robuste. Le Caterpillar P-5000 Power Loader est un exosquelette anthropomorphe hydraulique capable de soulever quatre tonnes de fret ou d’affronter une Reine Xénomorphe au corps à corps. Sur le champ de bataille, la navette orbitale UD-4L Cheyenne largue le transport de troupes blindé M577 APC équipé de tourelles jumelées à railgun et de canons-mitrailleurs de 20mm.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['aliens1986', 'alienRomulus2024'], universe: 'ALIEN'
  },
  {
    id: 'technologie-ia-muthur-6000-apollo-mainframe', entryType: 'codex', category: 'technologie', title: 'Intelligences Artificielles Centrales : MU/TH/UR 6000, Father & APOLLO',
    summary: 'Les cerveaux cybernétiques régissant les vaisseaux et stations : chambres acoustiques MU/TH/UR (« Maman ») et noyau APOLLO.',
    body: 'Chaque vaisseau long-courrier de la Weyland-Yutani est gouverné par une unité centrale MU/TH/UR (« Mother » / « Maman »), accessible via une salle blanche capitonnée de voyants télémétriques. Du modèle MU/TH/UR 6000 du Nostromo au MU/TH/UR 9000 de l’Anesidora, ces IA appliquent froidement l’Ordre Spécial 937. Sur la station Sébastopol, Seegson déploie l’IA concurrente APOLLO, tandis que l’USM Auriga est administré par le système militaire « Father ».',
    sourceTier: 'SCREEN', relatedTier: 'LICENSED_EU', isOriginal: false, sources: ['alien1979', 'alienResurrection1997', 'alienIsolation2014', 'alienRomulus2024'], universe: 'ALIEN'
  },
  {
    id: 'xenomorphes-monde-natal-g435-gelee-royale-xeno-zip', entryType: 'codex', category: 'xenomorphes', title: 'Xenomorph Prime (G-435), Gelée Royale & Stimulant Xeno-Zip',
    summary: 'L’écosystème cauchemardesque du monde natal xénomorphe et le trafic pharmaceutique de la Gelée Royale (Royal Jelly / Fire).',
    body: 'Dans l’Univers Étendu Dark Horse (Earth War, Genocide, Labyrinth), le monde d’origine de l’espèce XX121 est une biosphère impitoyable où deux méga-ruches rivales s’affrontent en permanence. Les corporations humaines y lancent des expéditions suicides pour récolter la Gelée Royale sécrétée par la Reine-Mère. Raffinée sous le nom de « Xeno-Zip » ou « Fire », cette substance confère aux soldats humains une vitesse et une agressivité décuplées au prix d’une dépendance neurotoxique mortelle.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['avpOriginalComics', 'aliensFireteamElite2021'], universe: 'ALIEN'
  },
  {
    id: 'avp-architecture-pyramides-sacrificielles-cycles', entryType: 'codex', category: 'culture', title: 'Architecture des Pyramides Sacrificielles & Cycles Séculaires',
    summary: 'Les temples-arènes Yautja bâtis sur Terre et dans la galaxie : murs reconfigurables, chambres d’ovipositeur et calendriers rituels.',
    body: 'Bien avant l’essor des civilisations antiques (Cambodge, Aztèques, Égypte, Bouvetøya), les Yautja ont érigé des pyramides souterraines servant de terrains d’épreuve pour leurs Jeunes Sangs. Ces édifices monumentaux intègrent des mécanismes d’engrenages monolithiques déplaçant les cloisons toutes les dix minutes, une salle de stase maintenant une Reine Xénomorphe enchaînée, et des sarcophages d’armement ne s’ouvrant qu’aux initiés.',
    sourceTier: 'AVP_SCREEN', relatedTier: 'LICENSED_EU', isOriginal: false, sources: ['avp2004', 'avpOriginalComics'], universe: 'AVP'
  },
  {
    id: 'avp-biologie-predalien-implantation-embryonnaire', entryType: 'codex', category: 'xenomorphes', title: 'L’Hybride Abominable : Predalien, Force Brute & Implantation Directe',
    summary: 'Anatomie et comportement de l’hybride né d’un hôte Yautja : dreads chitineuses, mandibules externes et reproduction accélérée.',
    body: 'Considéré par les clans Yautja comme la pire profanation cosmique, le Predalien (tel que Chet dans AVP: Requiem ou l’Abomination de BG-386) fusionne la férocité parasitaire du Xénomorphe avec la masse musculaire du Predator. Doté d’une couronne de dreads charnues, de mandibules acérées et d’un exosquelette résistant au plasma léger, un spécimen en transition royale peut implanter directement jusqu’à quatre embryons par voie orale dans un hôte affaibli.',
    sourceTier: 'AVP_SCREEN', relatedTier: 'LICENSED_EU', isOriginal: false, sources: ['avp2004', 'avpRequiem2007'], universe: 'AVP'
  },
  {
    id: 'avp-chronique-ahab-fire-and-stone-ingenieur', entryType: 'codex', category: 'culture', title: 'La Croisade d’Ahab : Le Trophée de l’Ingénieur sur LV-223',
    summary: 'La quête obsessionnelle de l’Ancien borgne Ahab sur la lune mutée LV-223 pour abattre un Ingénieur Mala’kak (Fire and Stone).',
    body: 'Après avoir perdu un œil au cours de décennies de chasses victorieuses, le vétéran Yautja Ahab découvre l’existence des Ingénieurs (Mala’kak), considérés comme les dieux créateurs et le gibier suprême. Sur la lune LV-223 ravagée par le mutagène noir du Prometheus, Ahab forge une alliance pragmatique avec le mercenaire humain Galgo Helder, survit aux essaims mutants et terrasse un Ingénieur en duel pour s’emparer de son fusil énergétique et de son crâne monumental.',
    sourceTier: 'LICENSED_EU', relatedTier: 'SCREEN', isOriginal: false, sources: ['prometheus2012', 'avpOriginalComics'], universe: 'AVP'
  },
  {
    id: 'avp-chronique-bg386-freyas-prospect-dark-2010', entryType: 'codex', category: 'lieu', title: 'Freya’s Prospect (BG-386) : La Pyramide de Karl Bishop Weyland & Dark',
    summary: 'La campagne de BG-386 (AVP 2010) : éveil de la Matriarche ancestrale, meute d’élite de Dark et découverte de Xenomorph Prime.',
    body: 'Sur la planète coloniale BG-386 (Freya’s Prospect), l’androïde dirigeant Karl Bishop Weyland perce le sceau de la plus ancienne pyramide Yautja connue, libérant la Matriarche xénomorphe « Specimen 6 ». Un vaisseau clanique dépêche alors l’Élite Dark pour effacer toute trace de la profanation. Après avoir récupéré le masque ancestral d’un Seigneur Yautja antique et abattu l’Abomination Predalien dans les laves du temple, Dark extrait de son gantelet les coordonnées stellaires du monde natal xénomorphe.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['avpOriginalComics', 'avp2004'], universe: 'AVP'
  },
  {
    id: 'predator-faune-chasse-hellhounds-river-ghosts-kalisk', entryType: 'codex', category: 'culture', title: 'Faune Cynégétique Extraterrestre : Hell-Hounds, River Ghosts & Kalisk',
    summary: 'Le bestiaire non-xénomorphe traqué ou dressé par les clans : molosses à cornes, spectres insectoïdes et béhémoths régénérants.',
    body: 'La chasse Yautja ne se limite ni aux humains ni aux Xénomorphes. Les Super Predators dressent des meutes de Hell-Hounds quadrupèdes hérissés d’épines osseuses pour rabattre leurs proies, et capturent les « River Ghosts », créatures pâles symbiotiques capables de bonds fulgurants. Sur le monde mortel de Genna (Badlands), les chasseurs affrontent le Kalisk, prédateur apex titanesque doté d’une régénération cellulaire quasi instantanée, tandis que sur Ryushi, le Rhynth sert d’épreuve de force brute.',
    sourceTier: 'SCREEN', relatedTier: 'LICENSED_EU', isOriginal: false, sources: ['predators2010', 'thePredator2018', 'badlands2025', 'avpPreyOmnibus'], universe: 'PREDATOR'
  },
  {
    id: 'predator-reliques-historiques-trophees-humains-clans', entryType: 'codex', category: 'culture', title: 'Reliques Historiques & Trophées Humains : De 1715 à Dutch 2025',
    summary: 'Les armes d’honneur échangées entre guerriers humains et Anciens Yautja à travers les siècles et la survie cybernétique de Dutch.',
    body: 'Lorsqu’un humain triomphe d’un Yautja en combat singulier loyal, les Anciens honorent le vainqueur en lui remettant une relique historique. Le pistolet à silex « Raphael Adolini 1715 » passe ainsi de Naru (1719) à Greyback qui l’offre à Mike Harrigan en 1997. De même, des sabres de samouraï, des haches vikings et des médailles militaires ornent les nefs claniques. Enfin, le Major Alan « Dutch » Schaefer, infusé d’un sérum d’ADN Yautja stabilisé, poursuit sa traque à la tête de l’OWLF jusqu’en 2025.',
    sourceTier: 'SCREEN', relatedTier: 'LICENSED_EU', isOriginal: false, sources: ['predator2', 'prey2022', 'killerOfKillers', 'huntingGrounds'], universe: 'PREDATOR'
  }
]);
// IDs match the values already used by the planet selector.
export const HUNT_LOCATIONS = freezeEntries([
  {
    id: 'los_angeles_1997', entryType: 'location', category: 'lieu', title: 'Los Angeles 1997 — chasse de chaleur',
    summary: 'Grande carte urbaine nocturne non linéaire reliant toits, ruelles, métro, abattoir frigorifique et vaisseau enfoui.',
    sourceTier: 'ORIGINAL', basisTier: 'SCREEN', isOriginal: true,
    canonNote: 'Los Angeles et les motifs de la chasse urbaine viennent de Predator 2, situé en 1997 ; cette géographie, ses dix secteurs, ses événements et son duel de clan sont une adaptation originale Apex Hunt.',
    assetPolicy: 'Texture OpenAI et géométries procédurales originales ; aucun asset officiel du film.',
    sources: ['predator2']
  },
  {
    id: 'genna_deathworld', entryType: 'location', category: 'lieu', title: 'Genna — monde mortel',
    summary: 'Écosystème extrême de Badlands, dominé par une flore prédatrice et le Kalisk régénérant.',
    sourceTier: 'ORIGINAL', basisTier: 'SCREEN', isOriginal: true,
    canonNote: 'Genna et le Kalisk sont établis à l’écran ; ce secteur, sa disposition et ses événements sont une adaptation originale Apex Hunt.', sources: ['badlands2025']
  },
  {
    id: 'jungle', entryType: 'location', category: 'lieu', title: 'Jungle de chasse',
    summary: 'Arène humide de ruines, canopée et pistes thermiques inspirée des chasses terrestres classiques.',
    sourceTier: 'ORIGINAL', basisTier: 'SCREEN', isOriginal: true,
    canonNote: 'Cette jungle précise est une création du jeu.', sources: ['predator1987', 'predators2010', 'prey2022']
  },
  {
    id: 'hive_lv426', entryType: 'location', category: 'lieu', title: 'LV-426 — ruches souterraines',
    summary: 'Réseau de résine, œufs et pluie acide conçu comme une mission crossover.',
    sourceTier: 'ORIGINAL', basisTier: 'SCREEN', relatedTier: 'AVP_SCREEN', isOriginal: true,
    canonNote: 'LV-426 et sa colonie viennent d’Alien/Aliens ; cette chasse Yautja, la pluie acide et cette carte ne sont pas confirmées à l’écran.', sources: ['aliens1986', 'avp2004']
  },
  {
    id: 'ryushi_desert', entryType: 'location', category: 'lieu', title: 'Désert de Ryushi',
    summary: 'Monde colonial associé à la première grande histoire AVP en comics et dans le roman Prey.',
    sourceTier: 'LICENSED_EU', isOriginal: false, gameInterpretationOriginal: true,
    canonNote: 'Ryushi est EU ; la tempête et l’arène du jeu sont originales.', sources: ['avpOriginalComics', 'avpPreyOmnibus']
  },
  {
    id: 'stargazer_blacksite', entryType: 'location', category: 'lieu', title: 'Complexe de confinement Stargazer',
    summary: 'Site humain de détention, d’analyse et de récupération technologique transformé en vaste territoire de brèche.',
    sourceTier: 'ORIGINAL', basisTier: 'SCREEN', isOriginal: true,
    canonNote: 'Stargazer, la captivité du Fugitive et son évasion sont établis dans The Predator ; cette implantation, ses secteurs, ses dangers et sa route de chasse sont une adaptation originale Apex Hunt.',
    assetPolicy: 'Géométries, textures et accessoires sont des créations originales du jeu ; aucun asset officiel du film n’est intégré.',
    sources: ['thePredator2018']
  },
  {
    id: 'yautja_prime', entryType: 'location', category: 'lieu', title: 'Yautja Prime — arène du clan',
    summary: 'Interprétation jouable d’un domaine Yautja consacré aux duels et aux trophées.',
    sourceTier: 'ORIGINAL', basisTier: 'SCREEN', isOriginal: true,
    canonNote: 'Yautja Prime et le domaine natal de Dek sont établis à l’écran dans Badlands ; cette arène sacrée et son conseil d’Anciens restent des créations du jeu.', sources: ['badlands2025']
  },
  {
    id: 'bouvetoya_pyramid', entryType: 'location', category: 'lieu', title: 'Bouvetøya — pyramide du rite',
    summary: 'Grande carte antarctique non linéaire reliant camp Weyland, tunnel thermique, chambres rituelles, labyrinthe mobile et fosse de la Reine.',
    sourceTier: 'ORIGINAL', basisTier: 'AVP_SCREEN', isOriginal: true,
    canonNote: 'Bouvetøya, l’expédition et la pyramide viennent d’AVP (2004) ; cette topologie, ses routes, événements et contrats sont une adaptation originale Apex Hunt.',
    assetPolicy: 'Textures OpenAI et géométries procédurales originales ; aucun décor ou asset officiel du film.',
    sources: ['avp2004']
  },
  {
    id: 'gunnison_outbreak', entryType: 'location', category: 'lieu', title: 'Gunnison — nuit de l’épidémie',
    summary: 'Grande carte pluvieuse et non linéaire reliant forêt du crash, cimetière, centrale, ville, égouts, lycée, hôpital, toits et extraction.',
    sourceTier: 'ORIGINAL', basisTier: 'AVP_SCREEN', isOriginal: true,
    canonNote: 'Gunnison, le crash, l’épidémie, Wolf et le Predalien viennent d’AVP: Requiem ; ces dix secteurs, leurs vingt-et-une routes, leurs vagues et leur compte à rebours sont une adaptation originale Apex Hunt.',
    assetPolicy: 'Texture OpenAI, architecture, props et mise en scène procéduraux originaux ; aucun asset officiel du film.',
    sources: ['avpRequiem2007', 'wolfArsenalDesigns']
  },
]);

const ALL_LOCATION_IDS = ['jungle', 'hive_lv426', 'ryushi_desert', 'stargazer_blacksite', 'yautja_prime', 'genna_deathworld', 'los_angeles_1997', 'bouvetoya_pyramid', 'gunnison_outbreak'];

// IDs match data-hunt and currentHuntType values in the game.
export const CURRENT_HUNTS = freezeEntries([
  {
    id: 'city_hunter', entryType: 'hunt', category: 'cible', title: 'City Hunter — épreuve urbaine 1997',
    summary: 'Duel de clan contre un rival au disque intelligent, au lance-filet et au Medicomp dans une ville vivante.',
    sourceTier: 'ORIGINAL', basisTier: 'SCREEN', isOriginal: true,
    canonNote: 'Le chasseur et son arsenal viennent de Predator 2 ; cette épreuve, ses statistiques, son adversaire, ses événements et sa progression ne rejouent pas le récit du film.',
    assetPolicy: 'Boss, props, texture et mise en scène sont des créations procédurales ou OpenAI originales du projet.',
    sources: ['predator2'], locationIds: ['los_angeles_1997']
  },
  {
    id: 'feral_predator', entryType: 'hunt', category: 'cible', title: 'Feral Predator — Grande Plaine',
    summary: 'Chasseur de 1719 affronté comme duel de bouclier, de traits et de lance.',
    sourceTier: 'ORIGINAL', basisTier: 'SCREEN', isOriginal: true,
    canonNote: 'Le Feral et son arsenal viennent de Prey ; statistiques, arène et contrat sont une adaptation originale.', sources: ['prey2022'], locationIds: ALL_LOCATION_IDS
  },
  {
    id: 'wolf_cleaner', entryType: 'hunt', category: 'cible', title: 'Wolf — opération Cleaner',
    summary: 'Affronter le vétéran de Gunnison, ses deux canons à plasma, son fouet et ses agents de dissolution.',
    sourceTier: 'ORIGINAL', basisTier: 'AVP_SCREEN', isOriginal: true,
    canonNote: 'Wolf et son arsenal sont établis dans AVP:R ; ce duel et ses règles de destruction de kit sont une adaptation originale.', sources: ['avpRequiem2007', 'wolfArsenalDesigns'], locationIds: ['gunnison_outbreak']
  },
  {
    id: 'kalisk', entryType: 'hunt', category: 'cible', title: 'Kalisk de Genna',
    summary: 'Prédateur suprême régénérant dont la carapace doit être rompue avant l’exposition du noyau.',
    sourceTier: 'ORIGINAL', basisTier: 'SCREEN', isOriginal: true,
    canonNote: 'Le Kalisk et sa régénération viennent de Badlands ; phases, noyau et conditions d’interruption sont une adaptation originale.', sources: ['badlands2025'], locationIds: ['genna_deathworld']
  },
  {
    id: 'goliath', entryType: 'hunt', category: 'cible', title: 'Goliath Xeno-Akumo',
    summary: 'Mégafaune blindée élevée au rang de proie suprême par les chroniqueurs du vaisseau.',
    sourceTier: 'ORIGINAL', isOriginal: true,
    canonNote: 'Nom, espèce, anatomie et chasse sont entièrement originaux à Yautja: Apex Hunt.', locationIds: ALL_LOCATION_IDS
  },
  {
    id: 'xeno_queen', entryType: 'hunt', category: 'cible', title: 'Reine xénomorphe',
    summary: 'Cible majeure protégée par sa ruche, ses œufs et son sang acide.',
    sourceTier: 'ORIGINAL', basisTier: 'SCREEN', relatedTier: 'AVP_SCREEN', isOriginal: true,
    canonNote: 'La Reine vient d’Aliens et apparaît aussi dans AVP ; cette mission, son arène et sa récompense sont originales.', sources: ['aliens1986', 'avp2004'], locationIds: ALL_LOCATION_IDS
  },
  {
    id: 'bad_blood', entryType: 'hunt', category: 'cible', title: 'Rival Yautja « Bad Blood »',
    summary: 'Chasseur renégat employé comme duel miroir contre les tactiques du joueur.',
    sourceTier: 'ORIGINAL', basisTier: 'LICENSED_EU', isOriginal: true,
    canonNote: 'Le titre Bad Blood vient surtout de l’EU ; ce rival précis est une création du jeu.', sources: ['predatorBadBloodComics'], locationIds: ALL_LOCATION_IDS
  },
  {
    id: 'predalien', entryType: 'hunt', category: 'cible', title: 'Predalien — toit de Gunnison',
    summary: 'Hybride de la branche AVP poursuivi à travers la ville contaminée jusqu’au toit de l’hôpital.',
    sourceTier: 'ORIGINAL', basisTier: 'AVP_SCREEN', isOriginal: true,
    canonNote: 'Le Predalien et l’épidémie de Gunnison existent dans AVP: Requiem ; la topologie ouverte, les événements, les statistiques et le combat procédural sont une adaptation originale.', sources: ['avpRequiem2007'], locationIds: ['gunnison_outbreak']
  },
  {
    id: 'super_predator', entryType: 'hunt', category: 'cible', title: 'Berserker — Super Predator',
    summary: 'Chef brutal du groupe antagoniste qui exploite la planète-réserve de Predators.',
    sourceTier: 'ORIGINAL', basisTier: 'SCREEN', isOriginal: true,
    canonNote: 'Le personnage et la planète-réserve sont établis à l’écran ; ses valeurs, phases et récompenses sont une adaptation de gameplay Apex Hunt.', sources: ['predators2010'], locationIds: ALL_LOCATION_IDS
  },
  {
    id: 'upgrade_predator', entryType: 'hunt', category: 'cible', title: 'Assassin Predator — brèche Stargazer',
    summary: 'Traque d’un chasseur génétiquement modifié dont la bio-armure et la régénération imposent de détruire ses défenses dans le bon ordre.',
    sourceTier: 'ORIGINAL', basisTier: 'SCREEN', isOriginal: true,
    canonNote: 'L’Assassin Predator et ses capacités physiques viennent de The Predator ; statistiques, bio-armure segmentée, glandes destructibles, arène et contrat sont une adaptation originale Apex Hunt.',
    assetPolicy: 'Silhouette procédurale et matériaux originaux du jeu ; aucun modèle, texture ou asset officiel du film n’est utilisé.',
    sources: ['thePredator2018', 'assassin2018Gear'], locationIds: ['stargazer_blacksite']
  },
  {
    id: 'grid_alien', entryType: 'hunt', category: 'cible', title: 'Grid Alien — champion de Bouvetøya',
    summary: 'Xénomorphe balafré qui transforme la pyramide mouvante en chasse verticale et corrosive.',
    sourceTier: 'ORIGINAL', basisTier: 'AVP_SCREEN', isOriginal: true,
    canonNote: 'Grid et sa cicatrice quadrillée viennent d’AVP (2004) ; ses phases, faiblesses, trajectoires et récompenses sont une adaptation de gameplay Apex Hunt.',
    assetPolicy: 'Modèle, matériaux et animations procéduraux originaux ; aucun modèle officiel du film.',
    sources: ['avp2004'], locationIds: ['bouvetoya_pyramid']
  },
  {
    id: 'jungle_hunter_1987', entryType: 'hunt', category: 'cible', title: 'Jungle Hunter — Val Verde 1987',
    summary: 'Chasseur original de Val Verde : bio-masque classique, canon à plasma d’épaule unique, acquisition tri-laser et protocole d’autodestruction.',
    sourceTier: 'ORIGINAL', basisTier: 'SCREEN', isOriginal: true,
    canonNote: 'Le Jungle Hunter et ses armes iconiques proviennent du film originel Predator (1987) ; ce duel, le timing de visée et le compte à rebours d’autodestruction sont une adaptation de gameplay Apex Hunt.',
    assetPolicy: 'Modèle procédural et textures originales du jeu, inspirés du film ; fidélité visuelle 1:1 non vérifiée.',
    sources: ['predator1987'], locationIds: ['jungle']
  },
  {
    id: 'vydrach_prime', entryType: 'hunt', category: 'cible', title: "Vy'drach — Léviathan Céleste de Yautja Prime",
    summary: "Léviathan ailé mythique vénéré sur Yautja Prime, traqué au combi-stick lors du rite d'initiation suprême.",
    sourceTier: 'ORIGINAL', basisTier: 'CANON_LORE', isOriginal: true,
    canonNote: "Créature interprétée par Apex Hunt à partir d’une référence de catalogue non résolue ; aucune publication primaire vérifiée ne permet d’en confirmer le statut canonique.",
    sources: ['yautjaPrimeLore'], locationIds: ['yautja_prime']
  },
  {
    id: 'rhynth_titan', entryType: 'hunt', category: 'cible', title: 'Rhynth — Béhémoth Titanesque de Ryushi',
    summary: "Herbivore colossal hexapode blindé indigène de Ryushi chassé par Dachande pour éprouver les jeunes guerriers.",
    sourceTier: 'ORIGINAL', basisTier: 'CANON_LORE', isOriginal: true,
    canonNote: "Le Rhynth est la mégafaune native centrale de Aliens vs. Predator: Prey (1994).",
    sources: ['avpPreyOmnibus'], locationIds: ['ryushi_desert']
  },
  {
    id: 'xeno_king', entryType: 'hunt', category: 'cible', title: 'Roi Xénomorphe — Rogue Titan Colossal',
    summary: "Abomination génétique géante issue d'expérimentations clandestines, surpuissant et armé d'une crête trident.",
    sourceTier: 'ORIGINAL', basisTier: 'CANON_LORE', isOriginal: true,
    canonNote: "Le Rogue Alien / King Xenomorph provient du récit Dark Horse Aliens: Rogue (1993).",
    sources: ['aliensRogue1993'], locationIds: ['hive_lv426']
  },
]);

export const ALIEN_BASE_ARCHIVE_ENTRIES = Object.freeze(getAlienBaseArchiveCodexEntries());
export const ALIEN_BASE_RESEARCH_ARCHIVE_ENTRIES = Object.freeze(getAlienRegistryResearchCodexEntries());
export const ALL_LORE_ENTRIES = Object.freeze([...LORE_CODEX_ENTRIES, ...HUNT_LOCATIONS, ...CURRENT_HUNTS, ...ALIEN_BASE_ARCHIVE_ENTRIES, ...ALIEN_BASE_RESEARCH_ARCHIVE_ENTRIES]);
export const getLoreSourceTier = (tierId) => LORE_SOURCE_TIERS[tierId] ?? null;
export const getLoreEntryById = (id) => ALL_LORE_ENTRIES.find((entry) => entry.id === id) ?? null;
export const getLoreEntriesByCategory = (category) => ALL_LORE_ENTRIES.filter((entry) => entry.category === category);

export default Object.freeze({
  sourceTiers: LORE_SOURCE_TIERS,
  sources: LORE_SOURCES,
  codex: LORE_CODEX_ENTRIES,
  locations: HUNT_LOCATIONS,
  hunts: CURRENT_HUNTS,
  alienBaseArchives: ALIEN_BASE_ARCHIVE_ENTRIES,
  alienBaseResearchArchives: ALIEN_BASE_RESEARCH_ARCHIVE_ENTRIES
});

export function getLoreEntryUniverse(entry) {
  if (entry?.universe) return entry.universe;
  const id = String(entry?.id || '').toLowerCase();
  const title = String(entry?.title || '').toLowerCase();
  if (id.includes('avp') || id.includes('bouvetoya') || id.includes('cleaner') || title.includes('bouvetøya') || title.includes('avp') || title.includes('ryushi')) return 'AVP';
  if (entry?.category === 'xenomorphes' || title.includes('alien') || title.includes('romulus') || title.includes('fiorina') || title.includes('ingénieur') || title.includes('uscm') || title.includes('synthétique') || title.includes('pathogène') || title.includes('ordre spécial')) return 'ALIEN';
  return 'PREDATOR';
}
