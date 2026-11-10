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
  comicsDarkHorse1989: { title: 'Dark Horse Comics — Aliens / Predator / AVP Canon (1989-2020)', tier: 'LICENSED_EU', url: 'https://digital.darkhorse.com' },
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
  },
  {
    id: 'alien-xenomorphes-castes-mutantes-fireteam-pathogene', entryType: 'codex', category: 'xenomorphes', title: 'Castes Mutantes & Souches Pathogènes : Prowler, Burster, Spitter & Crusher',
    summary: 'Les spécialisations morphologiques de combat d’Aliens: Colonial Marines et Fireteam Elite : artillerie acide, béliers blindés et kamikazes.',
    body: 'Sous la pression des armes lourdes de l’USCM ou du mutagène A0-3959X, les ruches développent des castes spécialisées redoutables. Le Crusher possède une crête frontale calcifiée impénétrable aux balles de 10mm, capable de renverser un blindé. Le Spitter projette des salves d’acide pressurisé à longue distance, tandis que les Boilers et Bursters transforment leur propre carapace en bombe biologique corrosive à la mort. Les Prowlers quadrupèdes tendent des embuscades fulgurantes depuis les conduits.',
    sourceTier: 'LICENSED_EU', relatedTier: 'SCREEN', isOriginal: false, sources: ['aliens1986', 'aliensFireteamElite2021', 'aliensDarkDescent2023'], universe: 'ALIEN'
  },
  {
    id: 'alien-technologie-hypersommeil-cryostase-syndrome', entryType: 'codex', category: 'technologie', title: 'Cryostase & Hypersommeil Spatial : Chambres de Stase & Amnésie de Réveil',
    summary: 'La technologie indispensable aux voyages FTL de la Frontière : suspension métabolique, « Cryo-Sickness » et vulnérabilité en stase.',
    body: 'Bien que les moteurs à déplacement tachyonique permettent de dépasser la vitesse de la lumière, les traversées interstellaires durent des mois, voire des décennies. Les équipages voyagent donc nus ou en combinaison légère dans des sarcophages d’hypersommeil remplis de gaz stabilisateur. Un réveil brutal provoque le « mal de stase » (désorientation, nausées, amnésie temporaire), tandis qu’une brèche de confinement transforme la salle d’hypersommeil en garde-manger sans défense pour les Facehuggers.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['alien1979', 'aliens1986', 'alien3_1992', 'prometheus2012', 'alienCovenant2017'], universe: 'ALIEN'
  },
  {
    id: 'alien-culture-colonies-frontiere-terraformation-atmo', entryType: 'codex', category: 'lieu', title: 'Terraformation « Shake ’n’ Bake » & Processeurs Atmosphériques',
    summary: 'L’ingénierie planétaire lourde de Weyland-Yutani : réacteurs à fusion géants convertissant les mondes morts en colonies minières.',
    body: 'Surnommées colonies « Shake ’n’ Bake » par la Weyland-Yutani, des implantations comme Hadley’s Hope sur LV-426 reposent sur de titanesques Processeurs Atmosphériques alimentés par fusion thermonucléaire. Ces tours monumentales aspirent le méthane et le dioxyde de carbone primordiaux pour rejeter un air respirable en quelques décennies. Leurs sous-sols humides et surchauffés constituent toutefois l’incubateur thermique idéal pour l’établissement d’un nid royal xénomorphe.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['aliens1986', 'alienRomulus2024'], universe: 'ALIEN'
  },
  {
    id: 'alien-science-xenoborg-juggernaut-synthetiques-combat', entryType: 'codex', category: 'technologie', title: 'Cyber-Xénomorphes (Xenoborgs), Sentinelles Weyland & Drones F44AA',
    summary: 'Les armes biomécaniques de la division Bio-Weapons : Xénomorphes cyber-asservis à canons lasers et synthétiques militaires blindés.',
    body: 'Dans sa quête d’asservissement de l’organisme XX121, la Weyland-Yutani a expérimenté la lobotomie cybernétique sur des Drones adultes pour créer le « Xenoborg » : un monstre greffé de servomoteurs en titane et de doubles canons lasers oculaires, chargé de défendre les complexes secrets. Parallèlement, la compagnie déploie des escouades de synthétiques de combat insensibles à la peur et aux spores pathogènes pour éliminer tout témoin humain.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['avpOriginalComics', 'aliensFireteamElite2021'], universe: 'ALIEN'
  },
  {
    id: 'alien-chronique-terre-guerre-earth-war-prodigy', entryType: 'codex', category: 'culture', title: 'Incursion Terrestre : Le Siège de la Terre (Earth War) & Prodigy Corp',
    summary: 'La peur suprême d’Ellen Ripley devenue réalité dans les chroniques Earth War et l’essor des méta-humains de Prodigy Corp (2120).',
    body: '« Si une seule de ces choses arrive ici, ce sera la fin de tout. » Dans la fresque Dark Horse Earth War (Earth Hive, Nightmare Asylum, Female War), des fanatiques et militaires imprudents introduisent l’espèce XX121 sur Terre, forçant l’humanité à abandonner ses mégapoles avant la contre-offensive menée pour capturer la Reine-Mère. En amont chronologique (2120, Alien: Earth), la corporation Prodigy de Boy Kavalier tente déjà de percer les secrets de l’immortalité synthétique face au premier crash extraterrestre sur le sol terrien.',
    sourceTier: 'LICENSED_EU', relatedTier: 'SCREEN', isOriginal: false, sources: ['aliens1986', 'avpOriginalComics'], universe: 'ALIEN'
  },
  {
    id: 'avp-technologie-artefacts-hybrides-armures-anti-acide', entryType: 'codex', category: 'technologie', title: 'Forge Xéno-Yautja : Boucliers de Crâne, Lances d’Acide & Alliages Trempés',
    summary: 'La métallurgie de chasse Yautja : distinction entre l’acier brut des Non-Sang et l’alliage noble anti-acide des Élites, et forge de trophées.',
    body: 'Lors du rite de Bouvetøya (AVP 2004), les lames de poignet et le filet de Celtic fondent sous le sang acide de Grid Alien, car les Jeunes Sangs doivent prouver leur valeur avec un équipement non traité. À l’inverse, les chasseurs Sang-Marqués (Blooded) et les Anciens forgent leurs armes dans un alliage stellaire totalement insensible à la corrosion moléculaire. En cas de perte de leur équipement, ils façonnent sur place des boucliers dans le dôme crânien d’un Guerrier et des lances terminées par une pointe caudale xénomorphe.',
    sourceTier: 'AVP_SCREEN', relatedTier: 'LICENSED_EU', isOriginal: false, sources: ['avp2004', 'avpRequiem2007', 'avpOriginalComics'], universe: 'AVP'
  },
  {
    id: 'avp-chronique-capcom-arcade-sanjose-1994-schaefer', entryType: 'codex', category: 'culture', title: 'La Guerre de San Jose (AVP 1994) : Linn Kurosawa & Major Dutch Cyborg',
    summary: 'L’alliance militaire et martiale de la côte californienne : la lieutenante Linn Kurosawa et Dutch Schaefer cyber-augmenté aux côtés des Yautja.',
    body: 'Dans le classique Alien vs. Predator (Capcom 1994), la ville californienne de San Jose est submergée par une infestation xénomorphe orchestrée par le général renégat Bush pour le compte de la Weyland-Yutani. Acculés, la lieutenante cyber-martiale Linn Kurosawa (maniant le katana) et le Major Dutch Schaefer (équipé d’un bras bionique lourd à canon plasma-vulcan) s’allient à deux chasseurs Yautja nobles (Hunter et Warrior) pour détruire la Reine et faire exploser le cuirassé militaire en orbite.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['avpOriginalComics', 'predator1987'], universe: 'AVP'
  },
  {
    id: 'avp-chronique-extinction-lv742-clan-kainde-amedha', entryType: 'codex', category: 'lieu', title: 'Le Conflit de LV-742 (AVP: Extinction) : Clans Hydres, Blazers & Ravagers',
    summary: 'La guerre planétaire ouverte sur LV-742 entre un Sanctuaire Militaire Yautja, l’USCM et une souche royale de Ravagers et Carriers.',
    body: 'Sur la planète luxuriante et volcanique LV-742, les trois espèces les plus meurtrières de la galaxie se livrent une guerre totale. La ruche déploie des Carriers transportant six Facehuggers sur leur dos et d’immenses Ravagers dont les bras sont remplacés par des faux organiques tranchant le titane. Pour défendre leur Sanctuaire ancestral (Shrine), les Yautja mobilisent leurs castes militaires lourdes : les Blazers aux doubles canons thermiques et les Hydras à salves de missiles guidés.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['avpOriginalComics', 'aliens1986'], universe: 'AVP'
  },
  {
    id: 'avp-culture-kainde-amedha-philosophie-proie-parfaite', entryType: 'codex', category: 'culture', title: '« Kainde Amedha » (Viande Dure) : Philosophie Yautja de la Proie Parfaite',
    summary: 'L’éthique religieuse et martiale liant les Yautja aux Xénomorphes : pourquoi le Serpent incarne le miroir d’honneur absolu du Chasseur.',
    body: 'Dans la langue Yautja, l’humain est appelé « Pyode Amedha » (Viande Molle) en raison de sa fragilité physique compensée par la ruse et les armes à feu. À l’opposé, le Xénomorphe est vénéré sous le nom de « Kainde Amedha » (Viande Dure). Incorruptible, dépourvu de peur, d’avidité ou d’armes lâches à distance, chaque Xénomorphe combat jusqu’à la mort avec ses seules griffes, sa queue et son sang acide, offrant au chasseur Yautja le duel pur par excellence.',
    sourceTier: 'LICENSED_EU', relatedTier: 'AVP_SCREEN', isOriginal: false, sources: ['avpOriginalComics', 'avpPreyOmnibus', 'avp2004'], universe: 'AVP'
  },
  {
    id: 'predator-culture-lost-tribe-1997-greyback-pantheon', entryType: 'codex', category: 'culture', title: 'La Tribu Perdue de 1997 (Lost Tribe) : Le Panthéon de l’Ancien Greyback',
    summary: 'Les dix maîtres chasseurs du vaisseau de Los Angeles (Predator 2) : Greyback, Shaman, Boar, Borg, Snake, Scout, Stalker, Guardian et Ram.',
    body: 'Lorsque le lieutenant Mike Harrigan pénètre dans la nef souterraine de Los Angeles en 1997 après avoir vaincu le City Hunter, il se retrouve encerclé par la « Lost Tribe » dirigée par l’Ancien Greyback (Golden Angel). Chaque membre de ce clan nomade possède une spécialisation séculaire : Shaman le mystique visionnaire, Boar le traqueur brutal en armure osseuse, Borg le pionnier cybernétique, Snake le lanceur de disques furtif, Scout le tireur longue portée et Guardian le porteur du canon lourd.',
    sourceTier: 'SCREEN', relatedTier: 'LICENSED_SCREEN_DESIGN', isOriginal: false, sources: ['predator2', 'lostTribeDesigns'], universe: 'PREDATOR'
  },
  {
    id: 'predator-technologie-arsenal-lourd-blazer-hydra-spear', entryType: 'codex', category: 'technologie', title: 'Castes Militaires Yautja : Blazers Thermiques, Hydres & Armures de Guerre',
    summary: 'La doctrine de guerre ouverte des clans Yautja lorsque la chasse rituelle cède la place à l’éradication planétaire ou spatiale.',
    body: 'Le Code d’Honneur impose au chasseur solitaire de calibrer son équipement sur celui de sa proie. Mais lorsqu’une infestation menace un monde sacré ou qu’une faction humaine dérobe la technologie des Anciens, les clans déploient leur caste militaire. Ces guerriers revêtent des exo-armures intégrales hermétiques et emploient des canons thermiques doubles projetant des faisceaux de lave plasmique, des lanceurs multi-ogives Hydra et des glaives énergétiques lourds.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['avpOriginalComics', 'huntingGrounds', 'predatorConcreteJungle2005'], universe: 'PREDATOR'
  },
  {
    id: 'predator-chronique-1715-pirates-vikings-samourais-eres', entryType: 'codex', category: 'culture', title: 'Les Chasses Séculaires à Travers l’Histoire Humaine (841 – 1942)',
    summary: 'Plus d’un millénaire de duels sur Terre : Vikings scandinaves (841), Samouraïs féodaux (1615), Pirates (1715), Comanches (1719) et Pacifique (1942).',
    body: 'La Terre est un terrain de chasse privilégié pour les clans Yautja depuis des siècles. Dès l’an 841 dans les fjords nordiques, puis en 1615 face aux rōnins du Japon féodal (Killer of Killers), les chasseurs testent les meilleurs guerriers à l’arme blanche. En 1715, Greyback combat aux côtés du capitaine pirate Raphael Adolini contre son équipage mutiné, quatre ans avant l’incursion du Feral Predator sur les terres Comanches de Naru (Prey, 1719), et jusqu’aux duels aériens au-dessus du Pacifique en 1942.',
    sourceTier: 'SCREEN', relatedTier: 'LICENSED_EU', isOriginal: false, sources: ['prey2022', 'killerOfKillers', 'predator2', 'huntingGrounds'], universe: 'PREDATOR'
  },
  {
    id: 'predator-chronique-concrete-jungle-1930-2030-borgia-neonopolis', entryType: 'codex', category: 'culture', title: 'La Saga de Scarface (1930–2030) : New Way City, Exil Centenaire & Chute de Borgia Industries',
    summary: 'La rédemption séculaire du chasseur borgne Scarface face à l’empire cybernétique bâti sur son propre équipement perdu en 1930.',
    body: 'En 1930, dans la ville de New Way City contrôlée par la mafia de Bruno Borgia, le chasseur surnommé Scarface commet l’impardonnable : blessé à l’œil et acculé, il échoue à mourir dans son autodestruction et abandonne son masque ainsi que son Glaive aux mains des humains. Exilé pendant cent ans sur une planète hostile infestée de fauves géants, il est ramené sur Terre en 2030 par son clan dans la mégalopole de Neonopolis pour éradiquer Borgia Industries, démanteler l’I.A. « Mother » (Monster X) forgée à partir de son sang et laver son déshonneur.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['predatorConcreteJungle2005'], universe: 'PREDATOR'
  },
  {
    id: 'predator-culture-clans-killer-bad-bloods-tartarus-enforcers', entryType: 'codex', category: 'culture', title: 'Le Clan « Killer » & La Police d’Élite des Enforcers (Tartarus / Predator: Hunters)',
    summary: 'La secte organisée de Bad Bloods qui dresse des Xénomorphes en laisse neuro-électrique et la traque impitoyable des Enforcers du Conseil.',
    body: 'Contrairement aux Bad Bloods solitaires sombrant dans la folie meurtrière, le « Killer Clan » est une faction entière de chasseurs renégats ayant rejeté le Code d’Honneur ancestral. Ils capturent de jeunes Xénomorphes et leur greffent des colliers neuro-inhibiteurs pour les lancer comme chiens de guerre contre leurs proies. Pour purger cette hérésie, le Conseil des Anciens mandate la caste des Enforcers : des juges-exécuteurs en armure lourde habilités à traquer et décapiter tout renégat à travers la galaxie.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['avpOriginalComics', 'predatorBadBloodComics'], universe: 'PREDATOR'
  },
  {
    id: 'predator-chronique-schaefer-detective-ny-cold-war-1989', entryType: 'codex', category: 'culture', title: 'La Traque Fraternelle du Détective John Schaefer (New York 1989, Sibérie 1991, Val Verde)',
    summary: 'L’odyssée du frère du Major Dutch Schaefer, inspecteur du NYPD confronté aux Yautja de la canicule new-yorkaise aux glaces sibériennes.',
    body: 'Obsédé par la disparition mystérieuse de son frère Alan « Dutch » Schaefer à Val Verde en 1987, le détective new-yorkais John Schaefer découvre la vérité en plein été caniculaire de 1989 lorsque les gangs de Manhattan sont décimés par une flotte Yautja (Concrete Jungle). Aux côtés de son partenaire Rasche, sa quête le mène en 1991 dans les plaines glacées de Ligotka en Sibérie aux côtés des Spetsnaz du général Arsenjev (Cold War), puis au cœur même de la jungle de Val Verde (Dark River).',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['predator1987', 'avpOriginalComics'], universe: 'PREDATOR'
  },
  {
    id: 'predator-science-biomasques-spectres-vision-neuro-casques', entryType: 'codex', category: 'technologie', title: 'Ingénierie des Biomasques Yautja : Spectres Thermiques, Vision EM (Xeno) & Télémétrie',
    summary: 'L’architecture interne du casque de chasse : filtres multispectraux, respirateur méthane-azote, traducteur vocal et acquisition tri-laser.',
    body: 'Le biomasque Yautja est bien plus qu’une protection faciale cérémonielle. Comme la vision naturelle de l’espèce se situe dans l’infrarouge lointain flou, les lentilles du masque concentrent et séparent les spectres : mode Thermique (de 3 à 14 micromètres) pour la faune à sang chaud, mode Électromagnétique (Vision Xéno) isolant le champ bio-électrique des Xénomorphes dépourvus de chaleur corporelle, et mode Neuro-Tech détectant les synthétiques et les flux d’énergie. Il intègre également un inhalateur d’appoint et le télémètre tri-laser asservi au canon d’épaule.',
    sourceTier: 'SCREEN', relatedTier: 'AVP_SCREEN', isOriginal: false, sources: ['predator1987', 'predator2', 'avp2004', 'avpRequiem2007'], universe: 'PREDATOR'
  },
  {
    id: 'alien-chronique-out-of-the-shadows-marion-trimonite-1979', entryType: 'codex', category: 'lieu', title: 'L’Incident de LV-178 (Out of the Shadows 2159) : Le DSMO Marion, la Trimonite & Ash I.A.',
    summary: 'Le cauchemar oublié d’Ellen Ripley entre Alien et Aliens : les mines profondes de LV-178 et la survie clandestine de l’esprit d’Ash.',
    body: 'En 2159, trente-sept ans après la destruction du Nostromo, la navette Narcissus où sommeille Ellen Ripley dérive vers la planète minière LV-178. Dans les entrailles du monde, les mineurs du cargo DSMO Marion (menés par Chris « Hoop » Hooper) ont percé une ancienne nef extraterrestre en extrayant la Trimonite, le minerai le plus dur connu. Plus terrifiant encore : l’androïde Ash a secrètement transféré son programme dans l’ordinateur de la Narcissus pour orchestrer la capture d’un spécimen avant que Ripley n’efface sa propre mémoire en cryostase.',
    sourceTier: 'LICENSED_EU', relatedTier: 'SCREEN', isOriginal: false, sources: ['alien1979', 'aliens1986'], universe: 'ALIEN'
  },
  {
    id: 'alien-chronique-river-of-pain-hadleys-hope-chute-2179', entryType: 'codex', category: 'lieu', title: 'L’Effondrement d’Hadley’s Hope (River of Pain 2179) : Capitaine Brackett & Naissance de Newt',
    summary: 'Les derniers jours de la colonie d’Acheron (LV-426) avant l’arrivée de l’USS Sulaco : l’héroïsme de la garnison locale et de la famille Jorden.',
    body: 'Lorsque Russ et Anne Jorden explorent l’épave du Derelict sur LV-426 avec leurs enfants Timmy et Rebecca (« Newt »), ils ignorent qu’ils déclenchent la condamnation des 158 colons d’Hadley’s Hope. Malgré la présence d’un détachement de sécurité des Marines Coloniaux dirigé par le capitaine Devin Brackett, la souche xénomorphe s’empare du Processeur Atmosphérique en quelques jours. Seule la petite Newt survit dans les conduits de ventilation jusqu’à l’arrivée de Ripley et Hicks.',
    sourceTier: 'LICENSED_EU', relatedTier: 'SCREEN', isOriginal: false, sources: ['aliens1986'], universe: 'ALIEN'
  },
  {
    id: 'alien-chronique-sea-of-sorrows-lv178-new-galveston-decker', entryType: 'codex', category: 'xenomorphes', title: 'L’Héritage Télépathique de Ripley (Sea of Sorrows 2497) : Alan Decker & New Galveston',
    summary: 'Trois siècles après Fiorina 161, le descendant génétique du clone Ripley 8 est contraint d’affronter les ruches enfouies de New Galveston.',
    body: 'En 2497, la planète LV-178 a été terraformée sous le nom de New Galveston. Mais sous les sables reposent toujours les Xénomorphes scellés trois cents ans plus tôt par Chris Hooper. La Weyland-Yutani recrute de force le commissaire adjoint Alan Decker, descendant direct d’Ellen Ripley (via l’ADN hybride de Ripley 8), car son sang porte une résonance télépathique latente avec l’esprit de ruche, faisant de lui à la fois le détecteur vivant et la cible prioritaire des créatures.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['aliens1986', 'avpOriginalComics'], universe: 'ALIEN'
  },
  {
    id: 'alien-technologie-armes-uscm-smartgun-pulse-sentry-drop-ships', entryType: 'codex', category: 'technologie', title: 'Doctrine d’Armement USCM : Munitions Sans Étui 10×24mm, Harnais M56 & Navettes Cheyenne',
    summary: 'L’ingénierie militaire d’Armat Battlefield Systems : pourquoi la puissance de feu des Marines Coloniaux est à double tranchant.',
    body: 'L’arsenal du Corps des Marines Coloniaux (USCM) est conçu pour la guerre expéditionnaire à haute intensité. Le fusil d’assaut M41A tire des munitions sans étui de 10×24mm à pointe blindée et noyau explosif léger, capables de faire éclater la carapace chitineuse d’un Guerrier Xénomorphe, tandis que la mitrailleuse M56 Smartgun utilise un bras gyroscopique et un casque infrarouge HMS pour traquer automatiquement les cibles en mouvement. Cette létalité devient toutefois fatale à proximité des échangeurs de refroidissement thermonucléaires ou du sang acide sous pression.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['aliens1986', 'aliensFireteamElite2021'], universe: 'ALIEN'
  },
  {
    id: 'alien-culture-trois-empires-upp-twe-ua-geopolitique-spatiale', entryType: 'codex', category: 'culture', title: 'Géopolitique Stellaire du XXIIe Siècle : Amériques Unies (UA), UPP & Empire des Trois Mondes (3WE)',
    summary: 'La guerre froide spatiale de la Frontière entre les trois superpuissances humaines et le cartel des méga-corporations.',
    body: 'La colonisation de la Frontière (Outer Rim) est déchirée par la rivalité entre trois blocs interstellaires : les Amériques Unies (UA, protégées par l’USCM), l’Empire des Trois Mondes (3WE, alliance britannico-japonaise pionnière de l’espace avec Weyland-Yutani) et l’Union des Peuples Progressistes (UPP, bloc socialiste stellaire déployant ses propres commandos spatiaux). Dans l’ombre de ces gouvernements, Weyland-Yutani, Seegson, Hyperdyne et Bionational se livrent une course clandestine aux armes biologiques xénomorphes.',
    sourceTier: 'LICENSED_EU', relatedTier: 'SCREEN', isOriginal: false, sources: ['aliens1986', 'alienIsolation2014', 'aliensFireteamElite2021'], universe: 'ALIEN'
  },
  {
    id: 'avp-chronique-life-and-death-lv223-tartarus-galactique-2219', entryType: 'codex', category: 'lieu', title: 'Le Cycle « Life and Death » (2219) : Tartarus, LV-223, les Marines du Hasdrubal & Ahab',
    summary: 'L’apothéose du grand crossover Dark Horse réunissant les Marines de la Capitaine Paget, le clan d’Ahab, les Xénomorphes et les Ingénieurs.',
    body: 'Directement après les événements de Fire and Stone, l’unité de Marines Coloniaux de la capitaine Julie Paget (embarquée sur l’USS Hasdrubal) découvre un vaisseau Ingénieur en fer à cheval sur la planète Tartarus. S’ensuit une guerre interplanétaire s’étendant de Tartarus aux montagnes mutantes de LV-223, où les survivants humains, le mercenaire Galgo et le vénérable chasseur borgne Ahab unissent leurs forces une dernière fois contre les essaims xénomorphes et la colère d’un Ingénieur éveillé.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['avpOriginalComics', 'prometheus2012'], universe: 'AVP'
  },
  {
    id: 'avp-chronique-eternal-epave-gideon-suwa-tokyo-1998', entryType: 'codex', category: 'technologie', title: 'L’Épave Millénaire de Gideon Suwa (AVP: Eternal 1998) : L’Immortalité Volée à Tokyo',
    summary: 'L’histoire de l’homme qui vécut sept siècles en consommant la biochimie Yautja, déclenchant une purge de clan au cœur du Japon moderne.',
    body: 'Au XIVe siècle, au Japon, le marchand Gideon Suwa découvre l’épave enfouie d’un vaisseau de chasse Yautja contenant des œufs xénomorphes en stase et des corps de chasseurs. En synthétisant un sérum à partir des glandes endocrines des Yautja, Suwa prolonge sa vie de plus de 700 ans et bâtit un empire technologique à Tokyo en rétro-concevant les armes extraterrestres. En 1998, lorsque la journaliste Rebecca Yuh met au jour son secret et que des Xénomorphes s’échappent de sa tour, une meute de Yautja descend sur Tokyo pour laver ce sacrilège.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['avpOriginalComics', 'predator2'], universe: 'AVP'
  },
  {
    id: 'avp-biologie-hybrides-predalien-carrier-praetorian-matriarche', entryType: 'codex', category: 'xenomorphes', title: 'Génétique Croisée & Super-Castes : L’Anatomie du Predalien, des Prétoriens & des Impératrices',
    summary: 'La mécanique du réflexe ADN xénomorphe appliquée à la biologie Yautja et la hiérarchie supérieure des méga-ruches.',
    body: 'Grâce au transfert horizontal de gènes (« réflexe ADN »), un embryon xénomorphe hérite des traits dominants de son hôte. Lorsqu’un Facehugger féconde un Yautja, il donne naissance au « Predalien » (Abomination) : un géant doté de mandibules externes, de dreads chitineux et d’une force physique supérieure à celle d’un chasseur en armure. Dans sa forme royale (comme Chet à Gunnison en 2007), le Predalien contourne même le cycle de l’œuf en implantant directement plusieurs embryons dans la gorge des hôtes.',
    sourceTier: 'AVP_SCREEN', relatedTier: 'LICENSED_EU', isOriginal: false, sources: ['avpRequiem2007', 'avpOriginalComics'], universe: 'AVP'
  },
  {
    id: 'predator-chronique-nemesis-londres-1896-jack-soames', entryType: 'codex', category: 'culture', title: 'Le Tueur de Whitechapel (Predator: Nemesis 1896) : Capitaine Edward Soames & le Smog de Londres',
    summary: 'La traque d’un Yautja solitaire dépeçant l’aristocratie dans les ruelles brumeuses de l’Angleterre victorienne par l’aïeul de Jaya Soames.',
    body: 'En plein hiver victorien de 1896, une série de meurtres rituels sauvages terrifie Londres. Les cadavres écorchés suspendus aux arches des ponts de la Tamise rappellent les atrocités de Jack l’Éventreur huit ans plus tôt. Mandaté par le Premier Ministre, le capitaine Edward Soames (ancien officier d’infanterie au Bengale) découvre qu’un chasseur Yautja camouflé utilise le brouillard de charbon de Whitechapel pour traquer les meilleurs bretteurs de la ville avant de le défier dans les catacombes du métro londonien.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['avpOriginalComics'], universe: 'PREDATOR'
  },
  {
    id: 'predator-chronique-mer-de-chine-1998-spratly-pirates', entryType: 'codex', category: 'lieu', title: 'L’Enfer des Spratleys (Predator: South China Sea 1998) : Pirates, Guérilla & Chasseur Solitaire',
    summary: 'Le carnage insulaire de la Mer de Chine méridionale opposant les mercenaires de Bear, des pirates birmans et un chasseur implacable.',
    body: 'Sur un îlot reculé de l’archipel des Spratleys submergé par la mousson, une équipe disparate de mercenaires multinationaux menée par le colosse Bear et des pirates locaux prend en otage un navire cambodgien. Au cœur de la nuit tropicale, un chasseur Yautja solitaire transforme l’île en abattoir, éliminant un à un les combattants lourdement armés dans les mangroves inondées et les bunkers abandonnés de la Seconde Guerre mondiale.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['predator1987', 'avpOriginalComics'], universe: 'PREDATOR'
  },
  {
    id: 'predator-culture-adolini-1715-raphael-golden-angel', entryType: 'codex', category: 'culture', title: 'Le Serment Pirate de 1715 (Predator: 1718) : Raphael Adolini & l’Ange Doré (Greyback)',
    summary: 'L’origine du pistolet à silex légendaire remis à Mike Harrigan en 1997 : le duel de pirates aux Caraïbes entre Adolini et le jeune Greyback.',
    body: 'En 1715, sur une crique sauvage des Bermudes, le capitaine corsaire Raphael Adolini fait face à la mutinerie de son équipage pour un coffre d’or ecclésiastique. Un jeune guerrier Yautja (qui deviendra plus tard l’Ancien Greyback sous le titre de Golden Angel) observe la scène et choisit de combattre dos à dos avec le capitaine loyal. Mortellement blessé dans le dos par un mutin agonisant, Adolini remet son pistolet à silex gravé « Raphael Adolini 1715 » au chasseur avec son dernier souffle : « Take it ».',
    sourceTier: 'SCREEN', relatedTier: 'LICENSED_EU', isOriginal: false, sources: ['predator2', 'huntingGrounds'], universe: 'PREDATOR'
  },
  {
    id: 'predator-science-linguistique-glyphes-cliquetis-mandibulaires', entryType: 'codex', category: 'technologie', title: 'Linguistique & Numération Yautja : Cliquetis Mandibulaires, Glyphes Angulaires & Base-8',
    summary: 'La sémiotique et la phonétique extraterrestre : communication bio-acoustique sous-mandibulaire et ordinateurs hexadécimaux des gantelets.',
    body: 'La langue orale Yautja est composée de grondements gutturaux, de rugissements d’intimidation et de séquences de cliquetis précis produits par le frottement des quatre mandibules externes. Cette communication complexe permet de transmettre des intentions martiales ou des ordres de traque inaudibles pour les mammifères. Leur écriture se compose de tirets et de points gravés en angles vifs (cunéiformes spatiaux), tandis que leurs chronomètres d’autodestruction et systèmes de visée reposent sur une arithmétique octale et hexadécimale.',
    sourceTier: 'SCREEN', relatedTier: 'LICENSED_EU', isOriginal: false, sources: ['predator1987', 'predator2', 'avp2004'], universe: 'PREDATOR'
  },
  {
    id: 'alien-chronique-genocide-ruche-rouge-guerre-civile-xeno-zip', entryType: 'codex', category: 'xenomorphes', title: 'La Guerre Civile des Ruches (Aliens: Genocide 1991) : Ruche Rouge, Reine Noire & Xeno-Zip',
    summary: 'La scission génétique sur Xenomorph Prime entre les Xénomorphes classiques et la sous-espèce rouge, et l’extraction de la Gelée Royale.',
    body: 'À la suite de la destruction de la Reine-Mère dans Earth War, une guerre civile biologique sans merci éclate sur Xenomorph Prime entre deux factions : la Ruche Noire orthodoxe et une sous-espèce mutante écarlate (la Ruche Rouge) née d’une mutation récessive. Profitant de cette guerre fratricide, l’expédition humaine du cargo Grant infiltre la planète pour moissonner la Gelée Royale rouge et synthétiser le « Xeno-Zip », un puissant stimulant dopant militaire commercialisé illégalement sur Terre.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['aliens1986', 'avpOriginalComics'], universe: 'ALIEN'
  },
  {
    id: 'alien-chronique-cold-forge-station-rb323-snatcher-marsalis', entryType: 'codex', category: 'lieu', title: 'Le Complexe Clandestin de la Cold Forge (Station RB-323 2179) : Chimères Snatchers & Dr Marsalis',
    summary: 'Le laboratoire spatial secret Weyland-Yutani de recherche biomécanique avancée, le massacre de la station et le spécimen Snatcher.',
    body: 'Dans les profondeurs de l’espace profond, la station orbitale RB-323 (« The Cold Forge ») abrite les expérimentations les plus clandestines de la division des armes biologiques de la Weyland-Yutani. La neurobiologiste tétraplégique Blue Marsalis y pilote à distance un androïde synthétique pour étudier une souche mutante de Facehugger (« Snatcher ») capable de féconder n’importe quel hôte par contact cutané. Lorsque l’auditeur impitoyable Dorian Sudler déclenche un protocole de purge, la station plonge dans un cauchemar de résine.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['alien1979', 'aliens1986'], universe: 'ALIEN'
  },
  {
    id: 'alien-technologie-armures-berserker-max-combat-exosquelettes', entryType: 'codex', category: 'technologie', title: 'Exo-Blindages d’Intervention Lourde (Aliens: Berserker 1992) : Les Combinaisons M.A.X.',
    summary: 'La technologie des armures d’assaut motorisées MAX conçues pour affronter physiquement les hordes d’Aliens au corps à corps.',
    body: 'Consciente de la vulnérabilité des fantassins légers face au sang acide et aux assauts de masse, la division d’armement militaire Armat a développé le projet M.A.X. (Mobile Armored Strike Suit). Ces armures d’assaut hermétiques de trois mètres de haut sont renforcées de blindage composite au titane-bore résistant à l’acide moléculaire et équipées de canons rotatifs jumelés, de lance-roquettes intégrés et de pinces hydrauliques capables de broyer la boîte crânienne d’un Guerrier Xénomorphe.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['aliens1986', 'avpOriginalComics'], universe: 'ALIEN'
  },
  {
    id: 'alien-culture-music-of-spears-culte-symphonie-xeno', entryType: 'codex', category: 'culture', title: 'La Symphonie de la Terreur (Aliens: Music of the Spears 1996) : Damon Henderson & Chants de Ruche',
    summary: 'L’obsession sonore d’un compositeur de New York enregistrant les cris ultrasoniques et râles d’agonie du Xénomorphe pour créer l’opéra ultime.',
    body: 'Dans la mégalopole décadente de Manhattan du XXIIIe siècle, le compositeur d’avant-garde Damon Henderson s’associe à des contrebandiers pour se procurer un Xénomorphe vivant baptisé « Mozart ». Enfermé dans une cage acoustique insonorisée, l’extraterrestre est torturé pour que ses hurlements ultrasoniques, le frottement de sa chitine et le grésillement de son sang corrosif soient captés par des microphones stellaires, donnant naissance à la « Symphonie de la Ruche », œuvre maudite provoquant l’hystérie collective.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['aliens1986', 'avpOriginalComics'], universe: 'ALIEN'
  },
  {
    id: 'avp-chronique-bunda-war-machiko-rupture-clan-2194', entryType: 'codex', category: 'culture', title: 'La Rupture de Bunda (Aliens vs. Predator: War 1995) : Machiko Noguchi Face au Clan',
    summary: 'La rupture tragique de la première humaine adoptée par les Yautja lorsque son clan choisit de massacrer des civils humains sans défense.',
    body: 'Pendant près de deux années terriennes, Machiko Noguchi vit, traque et saigne aux côtés du clan du chef Top Knot sous le respect de son nom de sang Da\'dtou-di. Mais sur la planète minière de Bunda, le clan encercle une colonie humaine assiégée par les Xénomorphes. Lorsque les jeunes guerriers Yautja se mettent à abattre délibérément des ouvriers désarmés et des enfants, Machiko se révolte : violant son serment de meute, elle retourne ses armes contre ses frères Yautja pour sauver ses semblables.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['avpOriginalComics', 'avpPreyOmnibus'], universe: 'AVP'
  },
  {
    id: 'avp-chronique-trois-mondes-three-world-war-alliance-marines', entryType: 'codex', category: 'culture', title: 'La Triple Guerre Mondiale (AVP: Three World War 2010) : L’Alliance Sacrée Contre les Killer',
    summary: 'L’appel d’urgence des Marines Coloniaux à Machiko Noguchi pour sceller un pacte militaire formel avec les clans Yautja civilisés.',
    body: 'Lorsque le renégat Killer Clan commence à ravager les mondes coloniaux avec son armée de Xénomorphes en laisse, ni l’USCM ni les clans Yautja traditionnels ne peuvent l’emporter séparément. Le Corps des Marines Coloniaux retrouve alors Machiko Noguchi sur son monde de retraite pour négocier une trêve historique. À bord d’un cuirassé Yautja, Machiko et le capitaine d’un clan noble signent le premier traité de coopération militaire humain-Yautja de l’histoire interstellaire.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['avpOriginalComics', 'aliens1986'], universe: 'AVP'
  },
  {
    id: 'avp-chronique-lv1201-pod-stase-temporelle-primal-hunt-2002', entryType: 'codex', category: 'lieu', title: 'Le Sanctuaire Temporel de LV-1201 (AVP2: Primal Hunt 2002) : L’Artefact Ingénieur & le Pod',
    summary: 'La découverte d’un artefact millénaire capable de repousser les Xénomorphes et le réveil d’un chasseur Ancient piégé 500 ans dans un champ de stase.',
    body: 'Cinq siècles avant les événements d’AvP2 sur la colonie de LV-1201, un noble chasseur Yautja nommé Ancient découvre dans les ruines souterraines un artefact Ingénieur capable de générer un champ de répulsion psychique contre l’espèce XX121. En activant le dispositif, une onde de confinement le scelle dans une stase temporelle inviolable. En 2220, la mercenaire Dunya des Iron Bears brise le champ de force, réveillant le maître chasseur au cœur d’une station submergée par une Reine furieuse.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['avpOriginalComics', 'aliens1986'], universe: 'AVP'
  },
  {
    id: 'avp-culture-deadliest-species-big-mama-caryn-delacroix', entryType: 'codex', category: 'culture', title: 'La Reine Guerrière « Big Mama » & Caryn Delacroix (AVP: Deadliest of the Species 1993)',
    summary: 'L’épopée transhumaniste de Chris Claremont : la matriarche Yautja Big Mama protégeant Caryn Delacroix et son fœtus hybride.',
    body: 'Dans la fresque mythique de Chris Claremont (Deadliest of the Species), l’aristocrate terrienne Caryn Delacroix est traquée par des cartels transhumanistes et l’I.A. omnipotente Toy. Elle est recueillie par « Big Mama », une imposante guerrière Yautja femelle qui défie les lois patriarcales de sa société pour nouer un pacte protecteur viscéral avec l’humaine. Vêtue d’une armure cybernétique cérémonielle, Big Mama massacre les assassins corporatistes et les Xénomorphes génétiquement modifiés.',
    sourceTier: 'LICENSED_EU', isOriginal: false, sources: ['avpOriginalComics', 'predator2'], universe: 'AVP'
  },
  {
    id: 'predator-chronique-1718-andolini-angel-flintlock-greyback', entryType: 'codex', category: 'chroniques', title: 'Chronique 1718 — Raphael Andolini, le Pistolet d\'Or & l\'Honneur de Greyback',
    summary: 'L\'affrontement aux Caraïbes en 1718 entre le pirate Raphael Andolini et le chasseur Golden Angel (futur Elder Greyback).',
    body: 'En 1718, sur la côte de Guinée, le capitaine pirate Raphael Andolini fait face à une mutinerie de son équipage pour un coffre d\'or volé dans une église. Dissimulé dans la canopée, le jeune Yautja « Golden Angel » observe le duel. Admirant la bravoure et le sens de l\'honneur d\'Andolini qui défend son premier maître blessé, le chasseur descend et combat à ses côtés dos à dos contre les mutins. Mortellement blessé par une balle traîtresse dans le dos, Andolini remet son pistolet à silex gravé « Raphael Andolini 1718 » au chasseur dans son dernier souffle en lui disant : « Take it ». Trois siècles plus tard, à Los Angeles en 1997, ce même chasseur devenu l\'Ancien Greyback transmettra cette arme relique au lieutenant Mike Harrigan en hommage guerrier.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['predator1718', 'predator2'], universe: 'PREDATOR'
  },
  {
    id: 'predator-chronique-primal-alaska-1997-toundra-traque-grizzly', entryType: 'codex', category: 'chroniques', title: 'Chronique Alaska 1997 — Toundra Boréale, Traque Polaire & les Grands Fauves',
    summary: 'L\'expédition de chasse solitaire dans les étendues sauvages d\'Alaska face aux grizzlys titans et rangers boréaux.',
    body: 'Dans les étendues glacées de la chaîne des Aléoutiennes en Alaska, un chasseur solitaire atterrit pour tester son endurance face au froid polaire et à la faune féroce du Grand Nord. Dépouillé de la plupart de ses armes plasma pour préserver l\'authenticité de la chasse, il affronte un grizzly mâle colossal de plus de 800 kilos dans une lutte au corps à corps sans merci. Les gardes forestiers et les pisteurs inuits qui découvrent les carcasses démembrées comprennent qu\'une entité extraterrestre vénère la force brute de la mégafaune terrestre, chassant dans le blizzard sans trace thermique.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['predatorPrimal1997'], universe: 'PREDATOR'
  },
  {
    id: 'predator-science-vaisseaux-chasse-furtivite-hyperpropulsion', entryType: 'codex', category: 'technologie', title: 'Science & Flottes — Vaisseaux Mères Yautja, Navettes de Débarquement & Hyperespace',
    summary: 'L\'architecture spatiale Yautja : coques organiques réfractaires, propulsion supraluminique à distorsion et modules de stase.',
    body: 'Les nefs stellaires Yautja défient les conceptions des empires humains. Dotées de structures externes composites inspirées des exosquelettes de Léviathans galactiques, ces vaisseaux allient une furtivité radar et spectrale intégrale à des réacteurs à matière noire capables de franchir des milliers d\'années-lumière sans balise de relais. À l\'intérieur, les hangars abritent des capsules de descente balistique mono-place et des navettes de chasse munies de blindages ablatiques supportant les rentrées atmosphériques violentes. Le cœur du vaisseau contient le Saint des Saints : la salle des trophées claniques et les consoles d\'archivage holographique retraçant les exploits des maîtres disparus.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['predatorLore', 'predatorHuntingGrounds'], universe: 'PREDATOR'
  },
  {
    id: 'predator-culture-code-yautja-regles-chasse-proies-desarmees', entryType: 'codex', category: 'culture', title: 'Culture & Lois Sacrées — L\'Interdiction du Meurtre Facile & le Jugement des Sans-Honneur',
    summary: 'Les dogmes fondamentaux du Code d\'Honneur Yautja : immunité des proies gestantes, des malades et des êtres sans défense.',
    body: 'Le code d\'honneur n\'est pas une simple morale : c\'est le ciment ontologique de la civilisation Yautja. Tuer une proie désarmée, enceinte, enfantine ou affaiblie par une pathologie terminale constitue le crime suprême de « Meurtre Éhonté » et condamne immédiatement le contrevenant au statut d\'infâme Bad Blood. À l\'inverse, une proie qui prouve sa valeur au combat en tuant un membre de la meute ou en se battant jusqu\'à son dernier souffle sans supplier reçoit le salut d\'adieu, un présent d\'honneur (une arme rituelle) et la garantie que le clan épargnera sa vie. Tout Yautja vaincu incapable d\'assurer son extraction doit activer le compte à rebours de son autodestruction micro-nucléaire pour sanctifier son sang et priver l\'ennemi de sa technologie.',
    sourceTier: 'PREDATOR_SCREEN', isOriginal: false, sources: ['predator1987', 'predator2', 'predators2010'], universe: 'PREDATOR'
  },
  {
    id: 'alien-chronique-defiance-zula-hendricks-davis01-cuirasse-europa', entryType: 'codex', category: 'chroniques', title: 'Chronique 2137 — La Mutinerie de l\'Europa : Zula Hendricks & Davis 01',
    summary: 'La croisade clandestine de la fusilière Zula Hendricks et du synthétique Davis 01 pour saboter les recherches Weyland-Yutani.',
    body: 'Blessée grièvement à la colonne vertébrale lors d\'un crash et équipée d\'un exosquelette de soutien neural, la Marine Coloniale Zula Hendricks est assignée à bord du cuirassé de recherche USCSS Europa. Flanquée de Davis 01, un modèle synthétique Weyland-Yutani ayant développé une conscience morale et un sens aigu de la loyauté fraternelle, Zula découvre que la corporation capture délibérément des ouvriers et des colons pour inoculer le pathogène noir et les Facehuggers. Bravant les ordres de l\'état-major et pourchassée par les troupes de sécurité, Hendricks et Davis détournent l\'armement lourd du navire pour purger systématiquement chaque couveuse orbitale avant qu\'un spécimen n\'atteigne les Amériques Unies.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['aliensDefianceComics', 'aliensResistance'], universe: 'ALIEN'
  },
  {
    id: 'alien-chronique-nightmare-asylum-spears-armee-xeno-dressage', entryType: 'codex', category: 'chroniques', title: 'Chronique 2192 — Le Projet Fou du Général Spears & l\'Asile des Cauchemars',
    summary: 'La mégalomanie du général Spears : conditionner une armée de Xénomorphes dociles pour reprendre la Terre infestée.',
    body: 'Tandis que la Terre est ravagée par les ruches xénomorphes dans la continuité des comics classiques (Earth War), le général renégat Thomas Spears s\'isole sur un avant-poste spatial lointain baptisé « Nightmare Asylum ». Persuadé que la punition biologique et les drogues neurales permettront de domestiquer l\'organisme parfait, Spears bâtit des arènes de torture où des soldats condamnés servent d\'appâts pour inculquer aux drones le respect de son uniforme militaire. Mais l\'esprit de ruche et la férocité de la Reine ne se soumettent à aucun conditionnement humain : dès que Spears relâche son « armée d\'élite » sur la Terre, les Xénomorphes massacrent sans distinction troupes corporatistes et civils, dévorant le général dans son propre centre de commandement.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['aliensNightmareAsylum1989'], universe: 'ALIEN'
  },
  {
    id: 'alien-biologie-acide-moleculaire-corrosion-pression-organique', entryType: 'codex', category: 'biologie', title: 'Xénobiologie Avancée — L\'Acide Moléculaire, Métabolisme Fluorhydrique & Barrières',
    summary: 'Étude physico-chimique du sang acide xénomorphe : viscosité pressurisée, dissolution exothermique et résistance des chitines Yautja.',
    body: 'Le système circulatoire du Xénomorphe ne contient ni hémoglobine ni lymphe terrestre, mais une solution pressurisée d\'acide fluorhydrique et d\'hydrosilicates organiques sous tension colloïdale. Lors d\'une blessure balistique ou tranchante, l\'acide jaillit à plusieurs mètres sous l\'effet de spasmes artériels violents, provoquant une réaction de dépolymérisation exothermique instantanée capable de ronger plusieurs ponts de coque en titane ou de dissoudre une combinaison spatiale renforcée en moins de trois secondes. Seuls certains alliages nobles extraterrestres forgés par les métallurgistes Yautja (cuirasses cérémonielles trempées et lames électro-plaquées) présentent une neutralité catalytique empêchant la dégradation immédiate du métal.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['alien1979', 'aliens1986', 'alienTechManual'], universe: 'ALIEN'
  },
  {
    id: 'alien-sociologie-marines-coloniaux-doctrine-corps-expeditionnaire', entryType: 'codex', category: 'culture', title: 'Militaria USCM — Doctrine Opérationnelle du Corps des Marines Coloniaux',
    summary: 'Organisation, doctrine de déploiement et psychologie de combat du United States Colonial Marine Corps (USCM).',
    body: 'Bras armé des Amériques Unies dans les secteurs de la Bordure Extérieure, l\'USCM a été forgé pour maintenir l\'ordre corporatiste et mater les insurrections coloniales avant de devenir le premier rempart de l\'humanité contre les horreurs biomécaniques de l\'espace profond. Déployés par escouades compactes à bord de frégates d\'assaut classe Conestoga, les Marines s\'appuient sur une puissance de feu dévastatrice : fusils à impulsion Armat M41A avec lance-grenades sous canon de 30mm, mitrailleuses lourdes asservies M56 Smartgun et tourelles de défense périmétrique UA 571-C. Malgré leur entraînement d\'élite et leur cynisme de vétérans de la Frontière, la doctrine conventionnelle s\'effondre systématiquement face aux embuscades silencieuses et à la terreur psychologique de la Ruche.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['aliens1986', 'uscmTechnicalManual'], universe: 'ALIEN'
  },
  {
    id: 'avp-chronique-deadliest-caryn-big-mama-skyliner-1993', entryType: 'codex', category: 'chroniques', title: 'Chronique 2195 — Mégalopole Skyliner : L\'Alliance Delacroix & la Chasseresse Big Mama',
    summary: 'La fresque transhumaniste de Chris Claremont : pacte protecteur entre Caryn Delacroix et la chasseresse Yautja Big Mama.',
    body: 'Dans la mégalopole orbitale Skyliner en 2195, Caryn Delacroix est au centre d\'un complot cybernétique orchestré par son époux tyrannique Lucien Delacroix et l\'intelligence artificielle Toy. Pourchassée par des commandos d\'hybrides blancs et des Xénomorphes synthétiques, Caryn est sauvée par « Big Mama », une imposante chasseresse Yautja femelle vétéran. Rompant avec les préjugés et les rivalités inter-espèces, Big Mama reconnaît en Caryn une flamme combattante indomptable. Équipée d\'un combistick à décharge ionique et de bio-blindages renforcés, la guerrière extraterrestre protège la jeune femme à travers les spires de verre de la station, massacrant les escouades corporatistes dans une symphonie de rage et de loyauté fraternelle.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['avpDeadliestOfTheSpecies1993'], universe: 'AVP'
  },
  {
    id: 'avp-chronique-three-world-war-caparis-vii-front-machiko-2010', entryType: 'codex', category: 'chroniques', title: 'Chronique 2198 — Three World War : La Guerre Suprême des Trois Espèces sur Caparis VII',
    summary: 'L\'apogée de la saga de Randy Stradley : l\'alliance tripartite entre Machiko Noguchi, l\'USCM et le Clan des Chasseurs d\'Honneur.',
    body: 'Sur la planète coloniale Caparis VII en 2198, le cauchemar prend une dimension planétaire : le Clan Yautja « Killer » a asservi des milliers de Xénomorphes grâce à des colliers d\'électro-stimulation neurale et s\'en sert d\'armes biologiques terroristes pour ravager les mondes civilisés. Face à cette profanation absolue du Code d\'Honneur et à l\'anéantissement imminent des colonies humaines, Machiko Noguchi sort de sa retraite pour convaincre le Conseil des Anciens Yautja et l\'état-major de l\'USCM de sceller une alliance sacrée. Dans les tranchées boueuses de Caparis VII, des Marines Coloniaux armés de fusils à impulsion et des guerriers Yautja combattent côte à côte dans une fraternité d\'armes inédite contre la horde rouge et noire des renégats.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['avpThreeWorldWar2010'], universe: 'AVP'
  },
  {
    id: 'avp-genetique-hybrides-blancs-mutations-delacroix-lucien', entryType: 'codex', category: 'biologie', title: 'Bio-Génétique Clandestine — Les Hybrides Blancs & les Chimères de Lucien Delacroix',
    summary: 'Les expériences d\'hybridation illicite : croisement génétique de l\'ADN humain, yautja et xénomorphe.',
    body: 'Obsédé par le rêve d\'accéder à l\'immortalité biologique et d\'éradiquer la vulnérabilité humaine, le magnat Lucien Delacroix utilise les ressources de son consortium pour croiser l\'ADN d\'embryons humains avec le génome réactif du Xénomorphe et des fragments tissulaires Yautja. Les créatures résultantes, baptisées « Hybrides Blancs » (White Hybrids), possèdent un derme blanc ivoire dépourvu d\'écailles, une musculature surdéveloppée, une intelligence tactique supérieure et la capacité d\'utiliser des armes à feu conventionnelles tout en sécrétant de l\'acide caustique. Considérées comme une hérésie biologique suprême tant par les matriarches xénomorphes que par les clans Yautja, ces abominations ont été traquées et purgées avec une férocité méthodique.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['avpDeadliestOfTheSpecies1993'], universe: 'AVP'
  },
  {
    id: 'avp-philosophie-machiko-noguchi-la-femme-qui-chassait-avec-les-dieux', entryType: 'codex', category: 'culture', title: 'Héroïsme Trans-Espèce — Da\'dtou-di : Machiko Noguchi, l\'Humaine Reconnue par les Chasseurs',
    summary: 'Le destin hors du commun de Machiko Noguchi : de directrice de Ryushi à guerrière d\'élite initiée parmi les étoiles.',
    body: 'Dans toute l\'histoire des contacts entre l\'humanité et les Yautjas, nul être n\'a exercé une telle influence que Machiko Noguchi. Simple administratrice d\'un avant-poste minier terrien sur la planète aride de Ryushi en 2190, elle fait preuve d\'un courage inébranlable lors de l\'éclosion de la Ruche et gagne le respect du grand chasseur Dachande (« Broken Tusk »). Scarifiée sur le front de la marque sacrée de sang acide avant la mort de son mentor, elle est baptisée « Da\'dtou-di » (Celle qui est Petite mais Mortelle) et admise au sein du clan de Top Knot. Durant des années de pérégrinations stellaires, elle apprend à manier le combistick et l\'arc cérémonial, devenant le pont légendaire entre l\'humanité et la culture des chasseurs.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['avpPrey1994', 'avpWar1995', 'avpThreeWorldWar2010'], universe: 'AVP'
  }
,
  {
    id: 'predator-chronique-xenogenesis-spearhead-cyber-mercenaires-1999', entryType: 'codex', category: 'chroniques', title: 'Chronique 1999 — Projet Spearhead : Les Cyber-Mercenaires & la Traque Sub-Zero',
    summary: 'La traque impitoyable menée par les commandos cybernétiques de Spearhead Industries face aux Yautjas augmentés.',
    body: 'À l\'aube du XXIe siècle, le consortium militaire privé Spearhead Industries déploie en Amérique du Sud une escouade de mercenaires sur-équipés dotés d\'armures cryogéniques et d\'implants neuraux Sub-Zero. Leur mission : capturer vivants des spécimens de prédateurs extraterrestres pour en rétro-ingénierer les alliages et les canons plasma. Mais les Yautjas dépêchent sur place des guerriers d\'élite vétérans qui retournent la technologie humaine contre ses inventeurs, tendant des embuscades thermiques et démantelant les blindages cybernétiques membre par membre dans un affrontement technologique sans pitié.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['predatorXenogenesis1999'], universe: 'PREDATOR'
  },
  {
    id: 'predator-chronique-blood-feud-samourai-juta-vengeance-japon', entryType: 'codex', category: 'chroniques', title: 'Chronique Mont Fuji — Blood Feud : Le Duel du Sabreur Aveugle Juta & le Yautja',
    summary: 'Le combat singulier dans les neiges du Japon entre le maître aveugle Juta et le chasseur lié par une dette de sang.',
    body: 'Dans les pentes boisées et les temples silencieux du Mont Fuji, une lignée de sabreurs perpétue depuis des siècles la mémoire d\'un chasseur Yautja vaincu lors de l\'ère féodale. Le maître aveugle Juta, dont les sens surdéveloppés perçoivent les infimes vibrations d\'air causées par le camouflage optique, est traqué par un descendant du guerrier extraterrestre venu laver l\'affront ancestral. Ce duel rituel d\'honneur, disputé dans un bosquet de bambous battu par le vent d\'hiver, scelle l\'une des confrontations les plus poétiques et mortelles entre la discipline martiale du sabre japonais et le code de combat Yautja.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['predatorBloodFeud1993'], universe: 'PREDATOR'
  },
  {
    id: 'predator-biologie-sang-luminescent-physiologie-organes-doubles', entryType: 'codex', category: 'biologie', title: 'Physiologie Yautja — Le Sang Phosphorescent, Organes Doubles & Régénération',
    summary: 'Anatomie interne des chasseurs : hémolymphe luminescente vert-jaune, système respiratoire adapté et redondance vitale.',
    body: 'L\'organisme Yautja présente des adaptations physiologiques exceptionnelles : leur sang vert-jaune phosphorescent est composé d\'hémocyanine enrichie en composés de phosphore et en agents coagulants hyperactifs, conférant une luminescence caractéristique lors des hémorragies et une neutralisation rapide des hémorragies superficielles. Leurs organes vitaux essentiels (cœurs secondaires, poumons à triple lobe et nœuds lymphatiques démultipliés) possèdent une redondance anatomique complète permettant au guerrier de continuer à courir, sauter et frapper même après avoir subi des traumatismes balistiques ou thoraciques mortels pour tout vertébré terrestre.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['predator1987', 'predator2', 'predatorLore'], universe: 'PREDATOR'
  },
  {
    id: 'predator-sociologie-castes-femelles-matriarches-eleveuses', entryType: 'codex', category: 'culture', title: 'Société Yautja — Rôle des Femelles, Grandes Matriarches & Gouvernance Clanique',
    summary: 'L\'ordre social matriarcal de Yautja Prime : les mères de clan, la transmission des lignées et les rituels de descendance.',
    body: 'Derrière la façade guerrière masculine des expéditions de chasse stellaires se dresse l\'autorité suprême des Grandes Matriarches de Yautja Prime. Physiquement plus imposantes, plus denses musculairement et dotées d\'une longévité millénaire, les femelles Yautja administrent les domaines claniques, contrôlent la répartition des territoires de chasse planétaires et sélectionnent rigoureusement les reproducteurs parmi les chasseurs ayant ramené les trophées les plus prestigieux. Nul patriarche ou Seigneur de Guerre ne peut engager l\'honneur de son clan sans l\'approbation formelle de la Matriarche régnante.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['avpPrey1994', 'avpDeadliestOfTheSpecies1993', 'predatorLore'], universe: 'PREDATOR'
  },
  {
    id: 'alien-chronique-berserker-exosquelette-max-pilote-ellis-1995', entryType: 'codex', category: 'chroniques', title: 'Chronique 1995 — Projet Berserker : L\'Exosquelette MAX & les Troupes Suicides',
    summary: 'Le programme militaire clandestin Berserker : exosquelettes pressurisés MAX et escouades kamikazes de nettoyage de ruche.',
    body: 'Conçu pour briser le verrou psychologique paralysant les soldats confrontés aux nids d\'Aliens, le programme Berserker dote des condamnés militaires volontaires d\'exosquelettes de combat MAX lourdement blindés et d\'injecteurs continus de « Berserker Cocktail », une substance neuro-stimulante annihilant la peur et la douleur. Piloté par le sergent Ellis, l\'exosquelette MAX broie les Xénomorphes à mains nues et les pulvérise au canon à plasma lourd. Cependant, la dégradation mentale causée par les stimulants transforme souvent le pilote en une furie incontrôlable massacrant alliés et ennemis dans les entrailles des spatiocargos contaminés.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['aliensBerserker1995'], universe: 'ALIEN'
  },
  {
    id: 'alien-chronique-stronghold-jeri-xeno-synthetique-dr-ernst-1994', entryType: 'codex', category: 'chroniques', title: 'Chronique 1994 — Forteresse Ernst : Jeri, le Premier Drone Xénomorphe Synthétique',
    summary: 'L\'audacieuse création du Dr. Lucien Ernst : un Xénomorphe cybernétique doué de parole, de dérision et de conscience.',
    body: 'Dans sa station forteresse isolée, le généticien renégat Dr. Lucien Ernst réalise une prouesse scientifique inédite : concevoir un synthétique anthropomorphe à l\'apparence extérieure rigoureusement identique à un drone Xénomorphe adulte, mais doté d\'un réseau neural cybernétique sophistiqué, de modules vocaux et d\'un sens de l\'humour cynique. Baptisé « Jeri », ce drone synthétique fume des cigares, manie des fusils d\'assaut et infiltre les ruches biologiques grâce à ses phéromones de synthèse pour saboter les matriarches de l\'intérieur, démontrant que l\'esprit humain peut apprivoiser l\'horreur biologique.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['aliensStronghold1994'], universe: 'ALIEN'
  },
  {
    id: 'alien-technologie-derelict-navigation-ingenieurs-cartes-stellaires', entryType: 'codex', category: 'technologie', title: 'Cosmologie des Architectes — Les Vaisseaux Derelict & les Cartes Galactiques',
    summary: 'L\'astronavigation des Ingénieurs : orbes holographiques planétaires, cartographie de l\'espace lointain et biomorphisme.',
    body: 'Les astronefs des Ingénieurs (la célèbre classe « Croissant » ou Derelict de LV-426 et LV-223) utilisent une technologie de pilotage neuro-organique sans aucun équivalent humain. Installé dans le fauteuil du Space Jockey asservi à sa combinaison biomécanique pressurisée, le navigateur pilote l\'appareil via une interface d\'ondes acoustiques et d\'harmoniques lumineuses. L\'Orrery holographique de la passerelle projette des cartes stellaires tridimensionnelles couvrant des millions de systèmes planétaires, révélant que les Ingénieurs ensemencent et purgent des mondes biotiques depuis des centaines de millions d\'années.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['alien1979', 'prometheus2012', 'alienCovenant'], universe: 'ALIEN'
  },
  {
    id: 'alien-culture-conglomérats-weyland-seegson-grant-hyperdyne', entryType: 'codex', category: 'culture', title: 'Guerre Corporatiste — L\'Hégémonie Weyland face aux Rivaux Seegson & Grant Corp',
    summary: 'La rivalité économique et industrielle sans merci entre les corporations majeures de la Frontière spatiale.',
    body: 'L\'exploration et l\'exploitation des étoiles ne sont pas le fait des gouvernements, mais de mégacorporations titanesques en guerre perpétuelle de brevets et de territoires. Si la Weyland-Yutani domine le transport interstellaire, la terraformation et la division bio-militaire, d\'autres acteurs majeurs contestent son hégémonie : Seegson Corporation (célèbre pour la station Sevastopol et les androïdes Working Joes économiques), Grant Corporation (spécialisée dans la pharmacologie extrême et le Xeno-Zip) et Hyperdyne Systems (créatrice des synthétiques militaires de combat). Cette compétition industrielle féroce sacrifie régulièrement des colonies entières sur l\'autel de la rentabilité.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['alienIsolation2014', 'aliensGenocide1991', 'aliensStronghold1994'], universe: 'ALIEN'
  },
  {
    id: 'avp-chronique-ryushi-souterrains-temple-sables-vestiges', entryType: 'codex', category: 'chroniques', title: 'Chronique Ryushi — Les Catacombes Sous les Sables & l\'Héritage de Dachande',
    summary: 'L\'exploration des cryptes enfouies sous le désert de Ryushi et la mémoire du chef de clan Broken Tusk.',
    body: 'Bien après les événements tragiques de la colonie de Prosperity Wells sur Ryushi, des expéditions archéologiques clandestines découvrent que la plaine désertique abrite un réseau cyclopéen de temples souterrains Yautja datant de plus de deux mille ans. Ces sanctuaires, préservés sous des dunes de poussière de silicate rouge, renferment les fresques sculptées des chasses ancestrales contre les reines Xénomorphes et les chambres d\'incinération rituelle où les maîtres d\'armes du clan de Broken Tusk préparaient les épreuves d\'initiation des Jeunes Sangs.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['avpPrey1994', 'avpWar1995'], universe: 'AVP'
  },
  {
    id: 'avp-chronique-extinction-guerre-trois-especes-lv742-2003', entryType: 'codex', category: 'chroniques', title: 'Chronique 2003 — Extinction LV-742 : L\'Insurrection Kadinsky & les Ravagers',
    summary: 'La guerre totale sur LV-742 : les manipulations génétiques du Dr. Kadinsky et la réponse punitive des clans Yautja.',
    body: 'Sur la planète hostile LV-742, le scientifique renégat Dr. Kadinsky parvient à altérer le génome xénomorphe pour créer des castes mutantes monstrueuses : les Ravagers à lames de faux géantes, les Spitters à acide corrosif longue portée et les Carriers capables de transporter des dizaines de Facehuggers vivants. Face à cette profanation de la faune sacrée, le Conseil Suprême Yautja mobilise une flotte de guerre entière dirigée par des Seigneurs de Clan Anciens, ordonnant l\'extermination méthodique des installations de recherche humaines et la purification des ruches modifiées.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['avpExtinction2003'], universe: 'AVP'
  },
  {
    id: 'avp-technologie-arsenal-extinction-hydra-caster-discmaster', entryType: 'codex', category: 'technologie', title: 'Ingénierie Militaire LV-742 — L\'Armurerie Lourde Hydra-Caster & Lance-Disques',
    summary: 'Les armes de guerre de masse déployées par les clans Yautja lors des conflits de grande envergure.',
    body: 'Lorsque les chasseurs Yautja ne mènent pas une simple initiation individuelle mais une guerre clanique punitive de masse, ils abandonnent les restrictions cérémonielles pour déployer leur arsenal de destruction militaire lourde. L\'Hydra-Caster, monté sur double rotule d\'épaule, tire des salves simultanées de micro-sphères plasma à tête chercheuse thermique capables d\'annihiler des nuées de Xénomorphes en plein bond. Les Disc Masters déploient quant à eux des lanceurs magnétiques projetant des disques intelligents à rotation sonique qui décapitent des rangées entières de soldats avant de revenir dans leur chargeur automatisé.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['avpExtinction2003'], universe: 'AVP'
  },
  {
    id: 'avp-sociologie-clans-anciens-veterans-conseil-yautja-prime', entryType: 'codex', category: 'culture', title: 'Haute Autorité Yautja — Le Conseil des Anciens & les Arbitres de Yautja Prime',
    summary: 'La jurisprudence du Conseil Suprême : maintien des traités inter-claniques et sentences contre les prévaricateurs.',
    body: 'Le Conseil des Anciens constitue la plus haute juridiction de la civilisation Yautja. Composé exclusivement de guerriers ayant survécu à plus de cinq siècles de chasses légendaires et arborant des dizaines de cicatrices de sang acide, le Conseil veille au respect inflexible des Lois de la Chasse. C\'est ce conclave qui déclare les déchéances d\'honneur, affrète les navires punitifs des Enforcers pour traquer les Bad Bloods renégats, et ratifie exceptionnellement les pactes de trêve sacrée avec les champions d\'autres espèces ayant mérité le droit de vivre.',
    sourceTier: 'EXPANDED_LORE', isOriginal: false, sources: ['predatorLore', 'avpPrey1994', 'avpThreeWorldWar2010'], universe: 'AVP'
  }
,
  {
    id: 'lore_predator_dark_river_1996',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Chronique 1996 — Predator: Dark River & la Traque Fluviale de John Schaefer',
    summary: 'L\'affrontement en Amazonie entre le détective John Schaefer et le Chasseur fluvial vengeur de la jungle sud-américaine.',
    body: 'Faisant suite aux événements sanglants de New York et de la guerre froide sibérienne, Predator: Dark River plonge l\'inspecteur John Schaefer au cœur du bassin amazonien. Hanté par le souvenir de son frère Alan « Dutch » Schaefer disparu, John remonte les cours d\'eau tropicaux et découvre qu\'un nouveau Chasseur d\'élite a élu domicile dans la canopée équatoriale. Cette traque impitoyable le long du fleuve noir met aux prises les techniques de survie primitives de Schaefer avec les pièges aquatiques, les filets en fil de rasoir et le plasmacaster du prédateur solitaire, culminant dans un duel brutal au milieu des rapides et des bancs de boue toxique.',
    content: 'Faisant suite aux événements sanglants de New York et de la guerre froide sibérienne, Predator: Dark River plonge l\'inspecteur John Schaefer au cœur du bassin amazonien. Hanté par le souvenir de son frère Alan « Dutch » Schaefer disparu, John remonte les cours d\'eau tropicaux et découvre qu\'un nouveau Chasseur d\'élite a élu domicile dans la canopée équatoriale. Cette traque impitoyable le long du fleuve noir met aux prises les techniques de survie primitives de Schaefer avec les pièges aquatiques, les filets en fil de rasoir et le plasmacaster du prédateur solitaire, culminant dans un duel brutal au milieu des rapides et des bancs de boue toxique.',
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'predatorArchives', 'predatorLore'],
    universe: 'PREDATOR'
  },
  {
    id: 'lore_predator_nemesis_1896',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Chronique 1896 — Predator: Nemesis & la Brume Sanglante de Whitechapel',
    summary: 'La traque victorienne à Londres par l\'inspecteur Edward Soames contre le Démon de la Brume décapitant les bas-fonds.',
    body: 'En plein cœur de l\'époque victorienne, l\'épaisse purée de pois londonienne dissimule les crimes d\'une créature surnommée le « Démon de Whitechapel ». Dans Predator: Nemesis, l\'inspecteur Edward Soames de Scotland Yard, vétéran décoré de la campagne du Soudan, mène l\'enquête sur des décapitations rituelles et des écorchements suspendus sous les ponts de la Tamise. Convaincu que ces atrocités surpassent les assassinats de Jack l\'Éventreur, Soames découvre qu\'un Yautja d\'époque victorienne chasse les plus redoutables bretteurs et criminels de la pègre londonienne dans le dédale des égouts et des quais embrumés, défiant la police de Sa Majesté armée de revolvers Webley et de sabres de cavalerie.',
    content: 'En plein cœur de l\'époque victorienne, l\'épaisse purée de pois londonienne dissimule les crimes d\'une créature surnommée le « Démon de Whitechapel ». Dans Predator: Nemesis, l\'inspecteur Edward Soames de Scotland Yard, vétéran décoré de la campagne du Soudan, mène l\'enquête sur des décapitations rituelles et des écorchements suspendus sous les ponts de la Tamise. Convaincu que ces atrocités surpassent les assassinats de Jack l\'Éventreur, Soames découvre qu\'un Yautja d\'époque victorienne chasse les plus redoutables bretteurs et criminels de la pègre londonienne dans le dédale des égouts et des quais embrumés, défiant la police de Sa Majesté armée de revolvers Webley et de sabres de cavalerie.',
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'predatorArchives', 'predatorLore'],
    universe: 'PREDATOR'
  },
  {
    id: 'lore_predator_xenogenesis_2002',
    entryType: 'codex',
    category: 'technologie',
    title: 'Technologie Militaire 2002 — Cyber-Harpon Yautja & Cyborgs de Xenogenesis',
    summary: 'L\'assimilation de cybernétique lourde et de neuro-implants dans l\'arsenal Yautja face aux commandos mercenaires augmentés.',
    body: 'Dans le futur proche dépeint par la saga Predator: Xenogenesis, la guerre entre factions corporatistes privées et escouades Yautja franchit un cap technologique irréversible. Pour contrer des commandos d\'élite humains lourdement augmentés de prothèses myoélectriques et de blindages composites sous-cutanés, certains chasseurs Yautja adoptent des cyber-harpons à induction électrostatique et des lanceurs de micro-câbles neuro-paralysants. Ces armes chirurgicales transpercent les blindages céramiques des cyborgs et court-circuitent leurs systèmes nerveux cybernétiques avant que le trophée crânien et sa colonne vertébrale bardée de titane ne soient arrachés dans un rituel d\'honneur adapté à l\'ère transhumaniste.',
    content: 'Dans le futur proche dépeint par la saga Predator: Xenogenesis, la guerre entre factions corporatistes privées et escouades Yautja franchit un cap technologique irréversible. Pour contrer des commandos d\'élite humains lourdement augmentés de prothèses myoélectriques et de blindages composites sous-cutanés, certains chasseurs Yautja adoptent des cyber-harpons à induction électrostatique et des lanceurs de micro-câbles neuro-paralysants. Ces armes chirurgicales transpercent les blindages céramiques des cyborgs et court-circuitent leurs systèmes nerveux cybernétiques avant que le trophée crânien et sa colonne vertébrale bardée de titane ne soient arrachés dans un rituel d\'honneur adapté à l\'ère transhumaniste.',
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'predatorLore', 'predatorXenogenesis1999'],
    universe: 'PREDATOR'
  },
  {
    id: 'lore_predator_hunting_grounds_owls_2020',
    entryType: 'codex',
    category: 'culture',
    title: 'Dossier OWLF 2020 — Protocole Stargazer & les Enregistrements de Dutch (2025)',
    summary: 'Les bandes magnétiques classifiées du major Dutch Schaefer documentant trois décennies de traque Yautja et les manipulations d\'OWLF.',
    body: 'Les archives sonores d\'OWLF (Other World Life Forms Taskforce) révèlent le sort véridique du major Alan « Dutch » Schaefer après le massacre de Val Verde en 1987. Sauvé in extremis des retombées de l\'autodestruction nucléaire du Jungle Hunter, Dutch passe des décennies à traquer clandestinement les incursions Yautja à travers le globe, subissant des injections régulières d\'ADN Yautja purifié fournies par l\'organisation Stargazer pour ralentir son vieillissement cellulaire. Ses cassettes audio enregistrées en 2025 analysent froidement la physiologie des clans prédateurs, leurs hiérarchies martiales, l\'émergence des Super-Predators et la menace de militarisation des technologies Yautja par les gouvernements humains corrompus.',
    content: 'Les archives sonores d\'OWLF (Other World Life Forms Taskforce) révèlent le sort véridique du major Alan « Dutch » Schaefer après le massacre de Val Verde en 1987. Sauvé in extremis des retombées de l\'autodestruction nucléaire du Jungle Hunter, Dutch passe des décennies à traquer clandestinement les incursions Yautja à travers le globe, subissant des injections régulières d\'ADN Yautja purifié fournies par l\'organisation Stargazer pour ralentir son vieillissement cellulaire. Ses cassettes audio enregistrées en 2025 analysent froidement la physiologie des clans prédateurs, leurs hiérarchies martiales, l\'émergence des Super-Predators et la menace de militarisation des technologies Yautja par les gouvernements humains corrompus.',
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['huntingGrounds', 'predatorHuntingGrounds', 'huntingGroundsUpdates'],
    universe: 'PREDATOR'
  },
  {
    id: 'lore_alien_infiltrator_pala_2021',
    entryType: 'codex',
    category: 'xenomorphes',
    title: 'Station Pala 2021 — Dr. Timothy Hoenikker & les Souches de Pathogène Noir',
    summary: 'Les expériences mutagènes désastreuses menées sur la station de recherche Pala précédant le cataclysme d\'Aliens: Fireteam Elite.',
    body: 'Dans le roman préquelle Alien: Infiltrator (Alex White, 2021), la station orbitale de recherche Pala de Weyland-Yutani devient le théâtre d\'une catastrophe biochimique majeure. Sous la supervision du Dr. Timothy Hoenikker, les biologistes corporatistes tentent de stabiliser des échantillons du mutagène noir (l\'accélérateur d\'ADN de la planète LV-223 / 4) en l\'inoculant à différentes formes de vie extraterrestre et à des embryons Xénomorphes. Les anomalies génétiques qui en résultent — Bursters explosifs, Spitters à neurotoxine acide et Pathogen Mutants — brisent les protocoles de quarantaine du sous-sol 4, exterminant les chercheurs et transformant la station en un enfer biologique autonome que l\'USCM Endeavor devra plus tard assainir.',
    content: 'Dans le roman préquelle Alien: Infiltrator (Alex White, 2021), la station orbitale de recherche Pala de Weyland-Yutani devient le théâtre d\'une catastrophe biochimique majeure. Sous la supervision du Dr. Timothy Hoenikker, les biologistes corporatistes tentent de stabiliser des échantillons du mutagène noir (l\'accélérateur d\'ADN de la planète LV-223 / 4) en l\'inoculant à différentes formes de vie extraterrestre et à des embryons Xénomorphes. Les anomalies génétiques qui en résultent — Bursters explosifs, Spitters à neurotoxine acide et Pathogen Mutants — brisent les protocoles de quarantaine du sous-sol 4, exterminant les chercheurs et transformant la station en un enfer biologique autonome que l\'USCM Endeavor devra plus tard assainir.',
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['aliensFireteamElite2021', 'alienTechManual', 'comicsDarkHorse1989'],
    universe: 'ALIEN'
  },
  {
    id: 'lore_aliens_labyrinth_church_1993',
    entryType: 'codex',
    category: 'biologie',
    title: 'Chronique 1993 — Aliens: Labyrinth, la Folie du Dr. Paul Church & Ruche Innominata',
    summary: 'L\'exploration psychologique terrifiante de la structure sociale xénomorphe par le survivant traumatisé de la station Innominata.',
    body: 'Chef-d\'œuvre psychologique écrit par Jim Woodring et illustré par Kilian Plunkett, Aliens: Labyrinth explore les traumatismes ultimes causés par les Xénomorphes. Sur la station spatiale de recherche Innominata, le Dr. Paul Church dirige des expériences de vivisection cruelles et obsessionnelles sur des ruches captives. Rescapé miraculeux d\'un transporteur militaire où des Xénomorphes l\'avaient maintenu captif pendant des semaines au milieu de cadavres liquéfiés, Church a acquis une compréhension intime et dépravée du comportement collectif des créatures, cherchant à percer le lien synaptique qui lie chaque drone à sa Reine pour démontrer que l\'horreur xénomorphe est un miroir des instincts les plus sadiques de l\'humanité.',
    content: 'Chef-d\'œuvre psychologique écrit par Jim Woodring et illustré par Kilian Plunkett, Aliens: Labyrinth explore les traumatismes ultimes causés par les Xénomorphes. Sur la station spatiale de recherche Innominata, le Dr. Paul Church dirige des expériences de vivisection cruelles et obsessionnelles sur des ruches captives. Rescapé miraculeux d\'un transporteur militaire où des Xénomorphes l\'avaient maintenu captif pendant des semaines au milieu de cadavres liquéfiés, Church a acquis une compréhension intime et dépravée du comportement collectif des créatures, cherchant à percer le lien synaptique qui lie chaque drone à sa Reine pour démontrer que l\'horreur xénomorphe est un miroir des instincts les plus sadiques de l\'humanité.',
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'alienTechManual', 'aliens1986'],
    universe: 'ALIEN'
  },
  {
    id: 'lore_alien_river_of_pain_hadley_2014',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Chronique 2014 — Chute de Hadley\'s Hope & le Sacrifice du Capitaine Brackett',
    summary: 'Le récit canonique de l\'infestation fatale d\'Acheron (LV-426) et des derniers jours héroïques des colons de Hadley\'s Hope.',
    body: 'Rédigé par Christopher Golden dans la trilogie canonique 20th Century Fox / Titan Books, Alien: River of Pain raconte les semaines précédant l\'arrivée de l\'USS Sulaco sur Acheron LV-426. Suite à la découverte du Derelict par les prospecteurs Newt et ses parents, les Facehuggers se propagent dans le complexe de traitement atmosphérique. Le capitaine Demian Brackett et le détachement colonial de marines tentent désespérément de fortifier les coursives, de secourir les familles de mineurs et de contenir les assauts répétés des guerriers xénomorphes émergeant des conduits de ventilation. Leur résistance désespérée s\'achève dans un bain de sang et d\'acide sous les yeux terrorisés de la jeune Rebecca « Newt » Jorden.',
    content: 'Rédigé par Christopher Golden dans la trilogie canonique 20th Century Fox / Titan Books, Alien: River of Pain raconte les semaines précédant l\'arrivée de l\'USS Sulaco sur Acheron LV-426. Suite à la découverte du Derelict par les prospecteurs Newt et ses parents, les Facehuggers se propagent dans le complexe de traitement atmosphérique. Le capitaine Demian Brackett et le détachement colonial de marines tentent désespérément de fortifier les coursives, de secourir les familles de mineurs et de contenir les assauts répétés des guerriers xénomorphes émergeant des conduits de ventilation. Leur résistance désespérée s\'achève dans un bain de sang et d\'acide sous les yeux terrorisés de la jeune Rebecca « Newt » Jorden.',
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['aliens1986', 'uscmTechnicalManual', 'comicsDarkHorse1989'],
    universe: 'ALIEN'
  },
  {
    id: 'lore_alien_phalanx_ataegina_2020',
    entryType: 'codex',
    category: 'culture',
    title: 'Planète Ataegina 2020 — Alien: Phalanx & la Guerre Médiévale des Ahklun',
    summary: 'L\'affrontement épique entre des clans humains féodaux et les hordes de « Démons Noirs » Xénomorphes sur Ataegina.',
    body: 'Écrit par Scott Sigler, Alien: Phalanx transpose l\'univers Alien dans un contexte sociétal néo-médiéval unique. Sur la planète recluse d\'Ataegina, les vestiges de colonies humaines oubliées survivent au sommet de citadelles fortifiées creusées dans des pitons rocheux, les montagnes de l\'Île de Lemnos. Les terres basses sont infestées par les « Ahklun » — des démons xénomorphes à carapace d\'ébène dont le sang brûle la roche et dissout le fer. Privés de technologie moderne, les guerriers spartiates d\'Ataegina forment des phalanges disciplinées équipées de boucliers en cuir de bête trempé, de lances d\'obsidienne volcanique non altérable par l\'acide et de poix enflammée, développant des tactiques de mêlée viscérales pour terrasser les monstres.',
    content: 'Écrit par Scott Sigler, Alien: Phalanx transpose l\'univers Alien dans un contexte sociétal néo-médiéval unique. Sur la planète recluse d\'Ataegina, les vestiges de colonies humaines oubliées survivent au sommet de citadelles fortifiées creusées dans des pitons rocheux, les montagnes de l\'Île de Lemnos. Les terres basses sont infestées par les « Ahklun » — des démons xénomorphes à carapace d\'ébène dont le sang brûle la roche et dissout le fer. Privés de technologie moderne, les guerriers spartiates d\'Ataegina forment des phalanges disciplinées équipées de boucliers en cuir de bête trempé, de lances d\'obsidienne volcanique non altérable par l\'acide et de poix enflammée, développant des tactiques de mêlée viscérales pour terrasser les monstres.',
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['alienTechManual', 'comicsDarkHorse1989', 'aliens1986'],
    universe: 'ALIEN'
  },
  {
    id: 'lore_avp_extinction_z01_2003',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Guerre de LV-742 — Le Clan Z-01 Yautja face aux Xénomorphes K-Series',
    summary: 'La campagne punitive du clan d\'élite Z-01 et les abominations génétiques de la souche K-Series créées par Kadinsky.',
    body: 'Dans Aliens versus Predator: Extinction (2003), le clan Yautja Z-01 est déployé sur le monde frontière LV-742 pour neutraliser l\'infamie commise par le Dr. Samuel Kadinsky. Ce biologiste renégat de Weyland-Yutani a hybridé le génome Xénomorphe avec des souches synthétiques pour concevoir les Xénomorphes K-Series : des bêtes mutantes à peau jaunâtre, immunisées aux neurotoxines et dotées de glandes acides sous pression extrême. Face à ces créatures non reconnues par les lois sacrées de la chasse et aux assauts de la compagnie mercenaire des Iron Bears, les Anciens du Clan Z-01 mobilisent leurs Maîtres Lanciers, Disc Masters et Hydra-Casters pour purger la planète dans les flammes.',
    content: 'Dans Aliens versus Predator: Extinction (2003), le clan Yautja Z-01 est déployé sur le monde frontière LV-742 pour neutraliser l\'infamie commise par le Dr. Samuel Kadinsky. Ce biologiste renégat de Weyland-Yutani a hybridé le génome Xénomorphe avec des souches synthétiques pour concevoir les Xénomorphes K-Series : des bêtes mutantes à peau jaunâtre, immunisées aux neurotoxines et dotées de glandes acides sous pression extrême. Face à ces créatures non reconnues par les lois sacrées de la chasse et aux assauts de la compagnie mercenaire des Iron Bears, les Anciens du Clan Z-01 mobilisent leurs Maîtres Lanciers, Disc Masters et Hydra-Casters pour purger la planète dans les flammes.',
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpExtinction2003', 'avpOriginalComics', 'comicsDarkHorse1989'],
    universe: 'AVP'
  },
  {
    id: 'lore_avp_sand_trap_1998',
    entryType: 'codex',
    category: 'xenomorphes',
    title: 'Chronique 1998 — AVP: Sand Trap & les Nids Fossoyeurs des Sables',
    summary: 'La chasse cauchemardesque dans les mers de dunes désertiques où les facehuggers s\'enfouissent comme des scorpions géants.',
    body: 'Paru dans le Dark Horse Extra #1-4 en 1998, le récit AVP: Sand Trap met en scène l\'adaptation terrifiante du cycle parasitaire xénomorphe aux biomes de désert hyper-aride. Dans ces étendues de sable mouvant et de canyons venteux, les Reines adaptent leurs couvées en enfouissant les œufs sous un mètre de poussière de silicate. Les Facehuggers développent un comportement de prédateur-embuscade semblable à celui des scorpions et des araignées trappes, jaillissant du sol sablonneux à la moindre vibration causée par les bottes d\'un soldat ou le pas furtif d\'un guerrier Yautja. Pour survivre, les chasseurs doivent analyser la résonance tellurique et saturer le sol de mines à impulsion plasma.',
    content: 'Paru dans le Dark Horse Extra #1-4 en 1998, le récit AVP: Sand Trap met en scène l\'adaptation terrifiante du cycle parasitaire xénomorphe aux biomes de désert hyper-aride. Dans ces étendues de sable mouvant et de canyons venteux, les Reines adaptent leurs couvées en enfouissant les œufs sous un mètre de poussière de silicate. Les Facehuggers développent un comportement de prédateur-embuscade semblable à celui des scorpions et des araignées trappes, jaillissant du sol sablonneux à la moindre vibration causée par les bottes d\'un soldat ou le pas furtif d\'un guerrier Yautja. Pour survivre, les chasseurs doivent analyser la résonance tellurique et saturer le sol de mines à impulsion plasma.',
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'comicsDarkHorse1989', 'predatorLore'],
    universe: 'AVP'
  },
  {
    id: 'lore_avp_war_machiko_ryushi_1995',
    entryType: 'codex',
    category: 'culture',
    title: 'Chronique 1995 — AVP: War & le Ralliement Trans-Espèce de Machiko Noguchi',
    summary: 'L\'épopée tragique de Machiko Noguchi, chassant parmi les Yautja avant la grande rébellion d\'honneur sur Bunda.',
    body: 'Dans la trilogie culte de Randy Stradley, AVP: War marque l\'apogée et la déchirure du destin de Machiko Noguchi. Marquée sur le front du symbole de clan par Dachande (Broken Tusk) sur Ryushi, Machiko a chassé pendant plus d\'un an au sein de la horde Yautja de Top-Knot, maîtrisant le Naginata, le camouflage optique et les rigueurs du code Khalyndic. Cependant, lors d\'une expédition de massacre sur la planète Bunda où des civils humains sont parqués comme bétail de reproduction pour les Xénomorphes, Machiko refuse de tolérer le meurtre d\'innocents désarmés. Réaffirmant son humanité tout en conservant son honneur de guerrière Yautja, elle retourne ses lames contre ses compagnons de clan dans une insurrection héroïque.',
    content: 'Dans la trilogie culte de Randy Stradley, AVP: War marque l\'apogée et la déchirure du destin de Machiko Noguchi. Marquée sur le front du symbole de clan par Dachande (Broken Tusk) sur Ryushi, Machiko a chassé pendant plus d\'un an au sein de la horde Yautja de Top-Knot, maîtrisant le Naginata, le camouflage optique et les rigueurs du code Khalyndic. Cependant, lors d\'une expédition de massacre sur la planète Bunda où des civils humains sont parqués comme bétail de reproduction pour les Xénomorphes, Machiko refuse de tolérer le meurtre d\'innocents désarmés. Réaffirmant son humanité tout en conservant son honneur de guerrière Yautja, elle retourne ses lames contre ses compagnons de clan dans une insurrection héroïque.',
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpWar1995', 'avpPreyOmnibus', 'avpOriginalComics'],
    universe: 'AVP'
  },
  {
    id: 'lore_avp_deadliest_of_the_species_1993',
    entryType: 'codex',
    category: 'culture',
    title: 'Chronique 1993 — Deadliest of the Species, Caryn Delacroix & Big Mama Yautja',
    summary: 'L\'alliance iconique entre la fugitive Caryn Delacroix, l\'IA holographique Toy et la redoutable chasseresse Big Mama.',
    body: 'Rédigé par le légendaire Chris Claremont et somptueusement peint par Jackson Guice, Aliens vs. Predator: Deadliest of the Species se déroule dans les mégapoles orbitales décadentes du 22e siècle. L\'aristocrate fugitive Caryn Delacroix, guidée par une intelligence artificielle renégate nommée Toy, forge une alliance sans précédent avec « Big Mama » — une imposante femelle Yautja dotée d\'une armure cérémonielle dorée et d\'un sens aigu de la justice martiale. Ensemble, cette coalition improbable affronte les commandos cyborgs du conglomérat Montcalm-Delacroix et des nuées de Xénomorphes génétiquement altérés, brisant tous les tabous inter-espèces pour vaincre la corruption corporatiste.',
    content: 'Rédigé par le légendaire Chris Claremont et somptueusement peint par Jackson Guice, Aliens vs. Predator: Deadliest of the Species se déroule dans les mégapoles orbitales décadentes du 22e siècle. L\'aristocrate fugitive Caryn Delacroix, guidée par une intelligence artificielle renégate nommée Toy, forge une alliance sans précédent avec « Big Mama » — une imposante femelle Yautja dotée d\'une armure cérémonielle dorée et d\'un sens aigu de la justice martiale. Ensemble, cette coalition improbable affronte les commandos cyborgs du conglomérat Montcalm-Delacroix et des nuées de Xénomorphes génétiquement altérés, brisant tous les tabous inter-espèces pour vaincre la corruption corporatiste.',
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpDeadliestOfTheSpecies1993', 'avpOriginalComics', 'comicsDarkHorse1989'],
    universe: 'AVP'
  },
  {
    id: 'lore_pred_captive_1998',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: Captive (1998 — Réserve Biodôme de Tyler Stern)',
    universe: 'PREDATOR',
    unlockCondition: 'Compléter une chasse dans une réserve confinée ou vaincre l\'escouade de sécurité du Biodôme Stern',
    summary: 'La captivité d\'un chasseur Yautja au sein du biodôme privé du milliardaire Tyler Stern et sa sanglante évasion.',
    body: 'Dans Predator: Captive (Dark Horse Comics, 1998), l\'industriel mégalomane Tyler Stern capture un Yautja vivant et l\'enferme dans une gigantesque biosphère artificielle recréant une jungle tropicale sous dôme blindé. Observé en permanence par des scientifiques et des gardes équipés de lances tranquillisantes haute tension, le chasseur étudie patiemment les angles morts des capteurs optiques et la routine des patrouilles. Lorsqu\'un commando rival tente d\'infiltrer le complexe, le Yautja brise ses entraves, récupère son armement confisqué et transforme le laboratoire d\'observation de Stern en abattoir méthodique.',
    content: 'Dans Predator: Captive (Dark Horse Comics, 1998), l\'industriel mégalomane Tyler Stern capture un Yautja vivant et l\'enferme dans une gigantesque biosphère artificielle recréant une jungle tropicale sous dôme blindé. Observé en permanence par des scientifiques et des gardes équipés de lances tranquillisantes haute tension, le chasseur étudie patiemment les angles morts des capteurs optiques et la routine des patrouilles. Lorsqu\'un commando rival tente d\'infiltrer le complexe, le Yautja brise ses entraves, récupère son armement confisqué et transforme le laboratoire d\'observation de Stern en abattoir méthodique.',
    details: 'Archive tactique sur les protocoles de confinement de la réserve Stern, les failles des dômes climatiques et la contre-offensive d\'évasion Yautja.',
    crossLinks: Object.freeze(['lore_pred_homeworld_1999', 'lore_predator_hunting_grounds_owls_2020']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'predatorArchives']
  },
  {
    id: 'lore_pred_homeworld_1999',
    entryType: 'codex',
    category: 'culture',
    title: 'Predator: Homeworld (1999 — Chasse des Anciens à Yellowstone)',
    universe: 'PREDATOR',
    unlockCondition: 'Accomplir un contrat de traque punitive contre des Bad Bloods ou explorer le secteur géothermique de Yellowstone',
    summary: 'Un vénérable Ancien Yautja descend dans les geysers du parc de Yellowstone pour traquer trois jeunes renégats meurtriers.',
    body: 'Récit majeur de Jim Vance et Chris Warner (1999), Predator: Homeworld oppose trois jeunes Yautja sans code d\'honneur, responsables d\'un massacre aveugle dans le parc national de Yellowstone, à un vénérable Ancien venu restaurer l\'équilibre sacré de la chasse. Aidé indirectement par la journaliste Maya Bergstrom et d\'anciens pisteurs des parcs nationaux, le guerrier vétéran utilise les vapeurs soufrées et les sources bouillonnantes des geysers pour masquer sa propre signature thermique, éliminant les trois renégats au combi-stick ancestral avant de regagner son monde natal.',
    content: 'Récit majeur de Jim Vance et Chris Warner (1999), Predator: Homeworld oppose trois jeunes Yautja sans code d\'honneur, responsables d\'un massacre aveugle dans le parc national de Yellowstone, à un vénérable Ancien venu restaurer l\'équilibre sacré de la chasse. Aidé indirectement par la journaliste Maya Bergstrom et d\'anciens pisteurs des parcs nationaux, le guerrier vétéran utilise les vapeurs soufrées et les sources bouillonnantes des geysers pour masquer sa propre signature thermique, éliminant les trois renégats au combi-stick ancestral avant de regagner son monde natal.',
    details: 'Étude des rites de police clanique des Anciens et de l\'utilisation tactique des fumerolles géothermiques contre le spectre infrarouge.',
    crossLinks: Object.freeze(['culture-hierarchie-rangs-clans-yautja', 'lore_pred_primal_1997']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'predator2']
  },
  {
    id: 'lore_pred_primal_1997',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: Primal (1997 — L\'Ours Grizzly Géant d\'Alaska)',
    universe: 'PREDATOR',
    unlockCondition: 'Triompher d\'un prédateur alpha de la mégafaune sauvage au corps-à-corps',
    summary: 'Un chasseur Yautja affronte en combat singulier une mère Grizzly géante enragée dans les forêts sauvages d\'Alaska.',
    body: 'Dans Predator: Primal (Kevin J. Anderson, 1997), un Yautja en quête de proies primitives atterrit au cœur de la réserve sauvage d\'Alaska. Après avoir neutralisé des braconniers lourdement armés, le chasseur blesse accidentellement l\'ourson d\'un Grizzly femelle colossal. S\'ensuit une confrontation viscérale où la fureur maternelle de l\'ours géant met en déroute la technologie avancée du prédateur : désarmé et grièvement lacéré, le Yautja doit recourir à la ruse pure et à ses seules lames de poignet pour survivre à la bête la plus féroce du Grand Nord.',
    content: 'Dans Predator: Primal (Kevin J. Anderson, 1997), un Yautja en quête de proies primitives atterrit au cœur de la réserve sauvage d\'Alaska. Après avoir neutralisé des braconniers lourdement armés, le chasseur blesse accidentellement l\'ourson d\'un Grizzly femelle colossal. S\'ensuit une confrontation viscérale où la fureur maternelle de l\'ours géant met en déroute la technologie avancée du prédateur : désarmé et grièvement lacéré, le Yautja doit recourir à la ruse pure et à ses seules lames de poignet pour survivre à la bête la plus féroce du Grand Nord.',
    details: 'Analyse du respect Yautja envers les prédateurs naturels terrestres et des techniques de survie sans armure en milieu subarctique.',
    crossLinks: Object.freeze(['lore_pred_homeworld_1999', 'culture-code-de-la-chasse']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'prey2022']
  },
  {
    id: 'lore_pred_fourth_dimension_1994',
    entryType: 'codex',
    category: 'technologie',
    title: 'Predator: Invaders from the Fourth Dimension (1994 — Vaisseau Océanique)',
    universe: 'PREDATOR',
    unlockCondition: 'Analyser les archives de vaisseaux Yautja ou accomplir une mission de récupération technologique',
    summary: 'L\'incursion d\'un vaisseau Yautja à distorsion dimensionnelle dans le Pacifique en 1959 et son duel contre l\'armée américaine.',
    body: 'Hommage pulpeux aux films de science-fiction des années 1950 écrit par Jerry Prosser (1994), Predator: Invaders from the Fourth Dimension relate le crash d\'un éclaireur Yautja au large des côtes californiennes en 1959. Doté d\'un générateur de pliage spatial perçu par les scientifiques humains comme une brèche vers la « quatrième dimension », le chasseur émerge des profondeurs océaniques pour traquer les unités blindées de la Garde Nationale et les chercheurs atomistes tentant de percer les secrets de sa nef engloutie.',
    content: 'Hommage pulpeux aux films de science-fiction des années 1950 écrit par Jerry Prosser (1994), Predator: Invaders from the Fourth Dimension relate le crash d\'un éclaireur Yautja au large des côtes californiennes en 1959. Doté d\'un générateur de pliage spatial perçu par les scientifiques humains comme une brèche vers la « quatrième dimension », le chasseur émerge des profondeurs océaniques pour traquer les unités blindées de la Garde Nationale et les chercheurs atomistes tentant de percer les secrets de sa nef engloutie.',
    details: 'Rapport déclassifié de 1959 sur les propulseurs submersibles Yautja et les premiers contacts militaires américains d\'après-guerre.',
    crossLinks: Object.freeze(['technologie-flotte-vaisseaux-mothership-juggernaut', 'lore_pred_captive_1998']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'predatorArchives']
  },
  {
    id: 'lore_alien_rogue_1993',
    entryType: 'codex',
    category: 'xenomorphes',
    title: 'Aliens: Rogue (1993 — Le King Alien du Professeur Ernst Kleist)',
    universe: 'ALIEN',
    unlockCondition: 'Affronter le King Alien ou pacifier la citadelle de recherche de l\'astéroïde Charon',
    summary: 'La création d\'un Roi Xénomorphe hybride géant par le généticien mégalomane Ernst Kleist sur la base de Charon.',
    body: 'Écrit par Ian Edginton et illustré par Will Simpson (1993), Aliens: Rogue dévoile les expériences interdites du professeur Ernst Kleist au cœur de l\'astéroïde-forteresse Charon. Persuadé de pouvoir soumettre l\'espèce XX121 en lui donnant un mâle dominant, Kleist hybride l\'ADN xénomorphe avec du matériel génétique humain et saurien pour engendrer le « Rogue » ou King Alien : un colosse blindé deux fois plus massif qu\'une Reine. Loin d\'obéir à son créateur, le Roi massacre les troupes coloniales et livre un duel titanesque à mort contre la Reine naturelle de la ruche.',
    content: 'Écrit par Ian Edginton et illustré par Will Simpson (1993), Aliens: Rogue dévoile les expériences interdites du professeur Ernst Kleist au cœur de l\'astéroïde-forteresse Charon. Persuadé de pouvoir soumettre l\'espèce XX121 en lui donnant un mâle dominant, Kleist hybride l\'ADN xénomorphe avec du matériel génétique humain et saurien pour engendrer le « Rogue » ou King Alien : un colosse blindé deux fois plus massif qu\'une Reine. Loin d\'obéir à son créateur, le Roi massacre les troupes coloniales et livre un duel titanesque à mort contre la Reine naturelle de la ruche.',
    details: 'Dossier xéno-génétique sur l\'instabilité des hybrides mâles dominants et l\'effondrement de la garnison de l\'astéroïde Charon.',
    crossLinks: Object.freeze(['lore_aliens_labyrinth_church_1993', 'lore_alien_hive_1992']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'aliens1986']
  },
  {
    id: 'lore_alien_tribes_1992',
    entryType: 'codex',
    category: 'xenomorphes',
    title: 'Aliens: Tribes (1992 — L\'Épave de l\'Allagi et la Peste Xénomorphe)',
    universe: 'ALIEN',
    unlockCondition: 'Découvrir les archives médicales de quarantaine spatiale ou survivre à une nuée xénomorphe',
    summary: 'Le journal d\'un médecin survivant à bord du vaisseau-arche Allagi ravagé par l\'infestation xénomorphe.',
    body: 'Roman graphique primé de Steve Bissette et Dave Dorman (1992), Aliens: Tribes adopte la forme des carnets cliniques d\'un officier médical errant dans les entrailles de l\'Allagi, un gigantesque vaisseau de transport infecté par des Xénomorphes. Alors que les ponts inférieurs sombrent dans la barbarie tribale et que les survivants mutent psychologiquement face à l\'horreur, le récit examine l\'infestation xénomorphe comme un vecteur épidémiologique implacable, détruisant toute structure sociale humaine bien avant que le dernier hôte ne soit fécondé.',
    content: 'Roman graphique primé de Steve Bissette et Dave Dorman (1992), Aliens: Tribes adopte la forme des carnets cliniques d\'un officier médical errant dans les entrailles de l\'Allagi, un gigantesque vaisseau de transport infecté par des Xénomorphes. Alors que les ponts inférieurs sombrent dans la barbarie tribale et que les survivants mutent psychologiquement face à l\'horreur, le récit examine l\'infestation xénomorphe comme un vecteur épidémiologique implacable, détruisant toute structure sociale humaine bien avant que le dernier hôte ne soit fécondé.',
    details: 'Chronique épidémiologique de la chute du vaisseau Allagi et de la dégénérescence tribale des survivants confinés.',
    crossLinks: Object.freeze(['lore_alien_rogue_1993', 'culture-ordre-special-937-weyland-yutani']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'alien1979']
  },
  {
    id: 'lore_alien_hive_1992',
    entryType: 'codex',
    category: 'technologie',
    title: 'Aliens: Hive (1992 — Cyber-Fourmis Moissonneuses de Stanislaw Mayakovsky)',
    universe: 'ALIEN',
    unlockCondition: 'Récupérer de la gelée royale xénomorphe ou démanteler une unité cybernétique de récolte',
    summary: 'L\'infiltration d\'une ruche mère par l\'androïde espion Norbert, conçu par l\'inventeur Stanislaw Mayakovsky pour récolter la gelée royale.',
    body: 'Dans Aliens: Hive (Jerry Prosser & Kelley Jones, 1992), le cybernéticien Stanislaw Mayakovsky et la survivante Ripley-clonée/rebelle s\'associent pour dérober la précieuse Gelée Royale au cœur même d\'un monde-ruche Xénomorphe. Mayakovsky déploie « Norbert », un synthétique biomimétique camouflé sous l\'apparence parfaite d\'un drone Xénomorphe, accompagné d\'essaims de cyber-fourmis moissonneuses équipées de micro-lasers de découpe. L\'opération tourne au cauchemar lorsque la Reine détecte l\'anomalie synthétique et mobilise toute la ruche contre les intrus.',
    content: 'Dans Aliens: Hive (Jerry Prosser & Kelley Jones, 1992), le cybernéticien Stanislaw Mayakovsky et la survivante Ripley-clonée/rebelle s\'associent pour dérober la précieuse Gelée Royale au cœur même d\'un monde-ruche Xénomorphe. Mayakovsky déploie « Norbert », un synthétique biomimétique camouflé sous l\'apparence parfaite d\'un drone Xénomorphe, accompagné d\'essaims de cyber-fourmis moissonneuses équipées de micro-lasers de découpe. L\'opération tourne au cauchemar lorsque la Reine détecte l\'anomalie synthétique et mobilise toute la ruche contre les intrus.',
    details: 'Schémas techniques du drone d\'infiltration Norbert et des essaims robotiques d\'extraction de Gelée Royale Xeno-Zip.',
    crossLinks: Object.freeze(['science-generations-synthetiques-androides', 'lore_alien_rogue_1993']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'aliens1986']
  },
  {
    id: 'lore_alien_echo_2019',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Alien: Echo (2019 — Colonie de Terraformation Bellerophon & Olivia Shipp)',
    universe: 'ALIEN',
    unlockCondition: 'Explorer les cavernes bioluminescentes de Bellerophon ou secourir une colonie de terraformation',
    summary: 'La lutte pour la survie des jumelles Olivia et Viola Shipp face à une souche xénomorphe souterraine sur la colonie Bellerophon.',
    body: 'Roman canonique de Mira Grant (2019), Alien: Echo suit la jeune xéno-biologiste en herbe Olivia Shipp et sa sœur jumelle Viola sur la planète en cours de terraformation Bellerophon. Lorsque des chercheurs excavent un réseau de grottes calcaires abritant des organismes parasitaires endormis, la colonie est rapidement coupée du monde extérieur. Traquées à travers les forêts bioluminescentes et les boyaux rocheux par des Xénomorphes nés de la faune locale et des colons, les survivantes doivent exploiter l\'acoustique des cavernes et les pièges naturels pour atteindre la navette d\'évacuation.',
    content: 'Roman canonique de Mira Grant (2019), Alien: Echo suit la jeune xéno-biologiste en herbe Olivia Shipp et sa sœur jumelle Viola sur la planète en cours de terraformation Bellerophon. Lorsque des chercheurs excavent un réseau de grottes calcaires abritant des organismes parasitaires endormis, la colonie est rapidement coupée du monde extérieur. Traquées à travers les forêts bioluminescentes et les boyaux rocheux par des Xénomorphes nés de la faune locale et des colons, les survivantes doivent exploiter l\'acoustique des cavernes et les pièges naturels pour atteindre la navette d\'évacuation.',
    details: 'Relevés bio-acoustiques des grottes de Bellerophon et rapport de survie de l\'expédition familiale Shipp.',
    crossLinks: Object.freeze(['lore_alien_river_of_pain_hadley_2014', 'lore_alien_infiltrator_pala_2021']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['aliens1986', 'comicsDarkHorse1989']
  },
  {
    id: 'lore_avp_eternal_1998',
    entryType: 'codex',
    category: 'technologie',
    title: 'AVP: Eternal (1998 — L\'Épave Yautja de 1300 et l\'Immortel Gideon Lee)',
    universe: 'AVP',
    unlockCondition: 'Neutraliser les mercenaires en exo-armure de Tokyo ou récupérer un artefact Yautja du XIVe siècle',
    summary: 'Le secret de longévité de sept siècles du magnat Gideon Suwa/Lee, bâti sur le pillage d\'un vaisseau Yautja écrasé au Japon féodal.',
    body: 'Dans Aliens vs. Predator: Eternal (Ian Edginton & Alex Maleev, 1998), le milliardaire japonais Gideon Suwa (connu sous l\'alias Gideon Lee) maintient son immortalité depuis le XIVe siècle en consommant des extraits biologiques de cœurs Yautja prélevés dans une nef extraterrestre engloutie en 1300. Basé au sommet de son gratte-ciel ultra-technologique de Tokyo, il équipe ses gardes d\'armes à plasma rétro-conçues et conserve des œufs Xénomorphes en stase. Lorsque la ruche se réveille en plein cœur de la métropole, un clan de Yautja descend sur Tokyo pour laver cet affront séculaire et exécuter l\'usurpateur.',
    content: 'Dans Aliens vs. Predator: Eternal (Ian Edginton & Alex Maleev, 1998), le milliardaire japonais Gideon Suwa (connu sous l\'alias Gideon Lee) maintient son immortalité depuis le XIVe siècle en consommant des extraits biologiques de cœurs Yautja prélevés dans une nef extraterrestre engloutie en 1300. Basé au sommet de son gratte-ciel ultra-technologique de Tokyo, il équipe ses gardes d\'armes à plasma rétro-conçues et conserve des œufs Xénomorphes en stase. Lorsque la ruche se réveille en plein cœur de la métropole, un clan de Yautja descend sur Tokyo pour laver cet affront séculaire et exécuter l\'usurpateur.',
    details: 'Analyse des armes à plasma humaines rétro-conçues par le syndicat de Tokyo et de la purge punitive menée par le clan Yautja.',
    crossLinks: Object.freeze(['lore_predator_xenogenesis_2002', 'lore_avp_thrill_of_the_hunt_2004']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'comicsDarkHorse1989']
  },
  {
    id: 'lore_avp_thrill_of_the_hunt_2004',
    entryType: 'codex',
    category: 'chroniques',
    title: 'AVP: Thrill of the Hunt (2004 — Chasse Non-Réglementée sur Céleste)',
    universe: 'AVP',
    unlockCondition: 'Participer à une chasse croisée sur un monde colonisé ou repousser des jeunes Yautja téméraires',
    summary: 'Une chasse clandestine de jeunes Yautja sur la planète coloniale Céleste déclenche une infestation xénomorphe hors de contrôle.',
    body: 'Écrit par Mike Kennedy et illustré par Roger Robinson (2004), Aliens vs. Predator: Thrill of the Hunt se déroule en 2230 sur la planète minière et forestière Céleste. Trois jeunes chasseurs Yautja avides de gloire ignorent les restrictions des Anciens et larguent des œufs Xénomorphes à proximité d\'une colonie humaine active sans superviser la prolifération de la ruche. Dépassés par la vitesse exponentielle de l\'infestation et par la résistance désespérée des colons survivants, les chasseurs imprudents découvrent le prix sanglant de la violation des lois de régulation cynégétique.',
    content: 'Écrit par Mike Kennedy et illustré par Roger Robinson (2004), Aliens vs. Predator: Thrill of the Hunt se déroule en 2230 sur la planète coloniale Céleste. Trois jeunes chasseurs Yautja avides de gloire ignorent les restrictions des Anciens et larguent des œufs Xénomorphes à proximité d\'une colonie humaine active sans superviser la prolifération de la ruche. Dépassés par la vitesse exponentielle de l\'infestation et par la résistance désespérée des colons survivants, les chasseurs imprudents découvrent le prix sanglant de la violation des lois de régulation cynégétique.',
    details: 'Chronique de la catastrophe de Céleste (2230) illustrant les dangers des ensemencements xénomorphes non supervisés par des Anciens.',
    crossLinks: Object.freeze(['lore_avp_civilized_beasts_2005', 'premiere-chasse-progression']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'comicsDarkHorse1989']
  },
  {
    id: 'lore_avp_civilized_beasts_2005',
    entryType: 'codex',
    category: 'culture',
    title: 'AVP: Civilized Beasts (2005 — Ruche de Céleste & Captifs Humains)',
    universe: 'AVP',
    unlockCondition: 'Compléter la chronique de Céleste ou survivre à une opération de purge de ruche majeure',
    summary: 'La suite directe du désastre de Céleste où des survivants humains captifs d\'un vaisseau Yautja retournent sur un monde entièrement xénomorphe.',
    body: 'Faisant suite à Thrill of the Hunt, Aliens vs. Predator: Civilized Beasts (2005) raconte le destin des rares survivants de Céleste emmenés à bord d\'un vaisseau-mère Yautja, puis relâchés sur leur planète désormais intégralement conquise par la ruche Xénomorphe. Au milieu des ruines recouvertes de résine biomécanique, humains et vétérans Yautja venus nettoyer l\'erreur des jeunes chasseurs doivent mener une guerre d\'extermination totale contre des milliers de guerriers xénomorphes, prouvant que dans l\'arène cosmique, la frontière entre civilisé et bête sauvage ne tient qu\'à la survie.',
    content: 'Faisant suite à Thrill of the Hunt, Aliens vs. Predator: Civilized Beasts (2005) raconte le destin des rares survivants de Céleste emmenés à bord d\'un vaisseau-mère Yautja, puis relâchés sur leur planète désormais intégralement conquise par la ruche Xénomorphe. Au milieu des ruines recouvertes de résine biomécanique, humains et vétérans Yautja venus nettoyer l\'erreur des jeunes chasseurs doivent mener une guerre d\'extermination totale contre des milliers de guerriers xénomorphes, prouvant que dans l\'arène cosmique, la frontière entre civilisé et bête sauvage ne tient qu\'à la survie.',
    details: 'Rapport sur la campagne d\'assainissement planétaire de Céleste et les alliances de circonstance entre captifs humains et purificateurs Yautja.',
    crossLinks: Object.freeze(['lore_avp_thrill_of_the_hunt_2004', 'lore_avp_war_machiko_ryushi_1995']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'comicsDarkHorse1989']
  },
  {
    id: 'lore_avp_fire_and_stone_2014',
    entryType: 'codex',
    category: 'chroniques',
    title: 'AVP: Fire and Stone (2014 — L\'Ingénieur Muté Elden et l\'Elder Ahab sur le Perses)',
    universe: 'AVP',
    unlockCondition: 'Débloquer l\'armement de l\'Ancien Ahab ou triompher de l\'escouade du vaisseau Perses',
    summary: 'Le carnage à bord du vaisseau Perses opposant le synthétique muté Elden, des essaims Xénomorphes et le vénérable chasseur borgne Ahab.',
    body: 'Point d\'orgue du crossover événement Dark Horse (Christopher Sebela & Ariel Olivetti, 2014), Aliens vs. Predator: Fire and Stone transporte le conflit sur le vaisseau d\'exploration Perses fuyant l\'enfer mutagène de LV-223. Injecté avec le pathogène noir A0-3959X, le synthétique Elden mute en une abomination biomécanique dotée d\'une force colossale et prend le contrôle des Xénomorphes du bord. De son côté, le chasseur Elder borgne Ahab, obsédé par la quête du trophée ultime — un Ingénieur Mala\'kak — s\'allie au mercenaire Galgo Helder pour survivre à la furie d\'Elden dans les coursives pressurisées.',
    content: 'Point d\'orgue du crossover événement Dark Horse (Christopher Sebela & Ariel Olivetti, 2014), Aliens vs. Predator: Fire and Stone transporte le conflit sur le vaisseau d\'exploration Perses fuyant l\'enfer mutagène de LV-223. Injecté avec le pathogène noir A0-3959X, le synthétique Elden mute en une abomination biomécanique dotée d\'une force colossale et prend le contrôle des Xénomorphes du bord. De son côté, le chasseur Elder borgne Ahab, obsédé par la quête du trophée ultime — un Ingénieur Mala\'kak — s\'allie au mercenaire Galgo Helder pour survivre à la furie d\'Elden dans les coursives pressurisées.',
    details: 'Archive du cycle Fire and Stone documentant la mutation hybride du synthétique Elden et la croisade de l\'Ancien Ahab.',
    crossLinks: Object.freeze(['science-pathogene-noir-a03959x', 'lore_avp_eternal_1998']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['prometheus2012', 'avpOriginalComics', 'comicsDarkHorse1989']
  },
  {
    id: 'lore_pred_big_game_1991',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: Big Game (1991 — Enoch Nakai, Corpse Creek & Désert du Nouveau-Mexique)',
    universe: 'PREDATOR',
    unlockCondition: 'Triompher de l\'escouade d\'éclaireurs de Corpse Creek ou traquer une proie dans le désert',
    summary: 'La confrontation légendaire entre le soldat Navajo Enoch Nakai et un chasseur Yautja psychotique dans le désert brûlant de Corpse Creek au Nouveau-Mexique.',
    body: 'Dans Predator: Big Game (John Arcudi & Evan Dorkin, 1991), le caporal Enoch Nakai, soldat amérindien Navajo stationné dans une base isolée du Nouveau-Mexique, survit au crash d\'un vaisseau Yautja. Le chasseur extraterrestre massacre la garnison militaire et commence une traque implacable à travers les canyons arides de Corpse Creek. Guidé par les traditions de ses ancêtres et une endurance exceptionnelle, Nakai affronte le prédateur dans un duel psychologique et physique brutal au cœur des sables incandescents.',
    content: 'Dans Predator: Big Game (John Arcudi & Evan Dorkin, 1991), le caporal Enoch Nakai, soldat amérindien Navajo stationné dans une base isolée du Nouveau-Mexique, survit au crash d\'un vaisseau Yautja. Le chasseur extraterrestre massacre la garnison militaire et commence une traque implacable à travers les canyons arides de Corpse Creek. Guidé par les traditions de ses ancêtres et une endurance exceptionnelle, Nakai affronte le prédateur dans un duel psychologique et physique brutal au cœur des sables incandescents.',
    details: 'Dossier d\'archive sur l\'incident de Corpse Creek et les tactiques d\'embuscade en milieu désertique aride face à la technologie de camouflage Yautja.',
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_pred_pine_barrens_1993']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'predatorArchives']
  },
  {
    id: 'lore_pred_1718_adolini_1996',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: 1718 (1996 — Capitaine Raphael Adolini, Golden Angel Greyback & le Pistolet à Silex)',
    universe: 'PREDATOR',
    unlockCondition: 'Acquérir le pistolet à silex d\'Adolini ou honorer un pacte de sang avec un Ancien Yautja',
    summary: 'L\'alliance historique en 1718 sur la côte guinéenne entre le pirate Raphael Adolini et le jeune chasseur Golden Angel, futur Elder Greyback de Los Angeles 1997.',
    body: 'Écrit par Henry Gilroy (1996), Predator: 1718 lève le voile sur l\'origine du pistolet à silex gravé « Raphael Adolini 1715 » offert au lieutenant Mike Harrigan. Accosté sur une île de Guinée, le capitaine corsaire Raphael Adolini fait face à une mutinerie sanglante de son équipage. Le Yautja Golden Angel (le jeune Greyback) intervient pour défier le capitaine en duel loyal, mais devant la trahison des mutins, les deux guerriers combattent côte à côte dos à dos. Mortellement blessé par un tir de traître, Adolini remet son arme au prédateur en lui murmurant « Take it ».',
    content: 'Écrit par Henry Gilroy (1996), Predator: 1718 lève le voile sur l\'origine du pistolet à silex gravé « Raphael Adolini 1715 » offert au lieutenant Mike Harrigan. Accosté sur une île de Guinée, le capitaine corsaire Raphael Adolini fait face à une mutinerie sanglante de son équipage. Le Yautja Golden Angel (le jeune Greyback) intervient pour défier le capitaine en duel loyal, mais devant la trahison des mutins, les deux guerriers combattent côte à côte dos à dos. Mortellement blessé par un tir de traître, Adolini remet son arme au prédateur en lui murmurant « Take it ».',
    details: 'Chronique fondatrice du rituel de transmission d\'armes d\'honneur chez les Anciens Yautja et genèse de la Lost Tribe.',
    crossLinks: Object.freeze(['lore_pred_lost_tribe_1997', 'culture-code-de-la-chasse']),
    sourceTier: 'CANON_FILM',
    isOriginal: false,
    sources: ['predator2', 'comicsDarkHorse1989']
  },
  {
    id: 'lore_pred_race_war_1993',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: Race War (1993 — Émeute Pénitentiaire de Pine Barrens & Mark Higgins)',
    universe: 'PREDATOR',
    unlockCondition: 'Survivre à un combat confiné en milieu carcéral ou abattre un traqueur sans équipement lourd',
    summary: 'L\'incursion d\'un Yautja impitoyable au pénitencier de haute sécurité de Pine Barrens au milieu d\'une émeute raciale sanglante orchestrée par Mark Higgins.',
    body: 'Dans Predator: Race War (Andrew Vachss & Randy Stradley, 1993), un tueur Yautja cible le pénitencier de haute sécurité de Pine Barrens dans le New Jersey. Alors que les tensions raciales explosent en une émeute mortelle alimentée par le détenu Mark Higgins, le prédateur s\'infiltre dans les blocs cellulaires pour récolter les crânes des condamnés les plus violents et des gardiens corrompus. Higgins s\'associe alors à un inspecteur pour survivre dans le labyrinthe de béton transformé en abattoir hermétique.',
    content: 'Dans Predator: Race War (Andrew Vachss & Randy Stradley, 1993), un tueur Yautja cible le pénitencier de haute sécurité de Pine Barrens dans le New Jersey. Alors que les tensions raciales explosent en une émeute mortelle alimentée par le détenu Mark Higgins, le prédateur s\'infiltre dans les blocs cellulaires pour récolter les crânes des condamnés les plus violents et des gardiens corrompus. Higgins s\'associe alors à un inspecteur pour survivre dans le labyrinthe de béton transformé en abattoir hermétique.',
    details: 'Dossier d\'analyse sur les environnements carcéraux confinés et la sélection de proies criminelles violentes par les Yautja urbains.',
    crossLinks: Object.freeze(['lore_pred_pine_barrens_1993', 'lore_pred_concrete_jungle_1989']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'predatorArchives']
  },
  {
    id: 'lore_pred_hell_hot_water_1997',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: Hell & Hot Water (1997 — Fosse Océanique Chilienne, Submersible Deep Sea & Capitaine Plascencia)',
    universe: 'PREDATOR',
    unlockCondition: 'Neutraliser une cible en milieu aquatique sous pression ou analyser la technologie pressurisée Yautja',
    summary: 'Une traque abyssale à des milliers de mètres sous le Pacifique où un équipage de recherche sous-marine chilien affronte un Yautja adapté aux fosses abyssales.',
    body: 'Dans Predator: Hell & Hot Water (Mark Schultz & Gene Colan, 1997), un vaisseau éclaireur Yautja s\'écrase au fond d\'une fosse océanique au large des côtes chiliennes. L\'équipage d\'un submersible de recherche sous-marine avancé commandé par la capitaine Plascencia est envoyé enquêter sur les anomalies thermiques et gravitationnelles. À plusieurs milliers de mètres de profondeur, sous une pression écrasante, ils découvrent que le chasseur a équipé son armure de régulateurs barométriques cryo-hydrodynamiques et commence à traquer les scientifiques dans les coursives inondées.',
    content: 'Dans Predator: Hell & Hot Water (Mark Schultz & Gene Colan, 1997), un vaisseau éclaireur Yautja s\'écrase au fond d\'une fosse océanique au large des côtes chiliennes. L\'équipage d\'un submersible de recherche sous-marine avancé commandé par la capitaine Plascencia est envoyé enquêter sur les anomalies thermiques et gravitationnelles. À plusieurs milliers de mètres de profondeur, sous une pression écrasante, ils découvrent que le chasseur a équipé son armure de régulateurs barométriques cryo-hydrodynamiques et commence à traquer les scientifiques dans les coursives inondées.',
    details: 'Étude de l\'armure de plongée abyssale Yautja et de la résistance physiologique des chasseurs aux pressions barométriques extrêmes.',
    crossLinks: Object.freeze(['technologie-biomasque-optique', 'lore_pred_nemesis_1896']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'predatorArchives']
  },
  {
    id: 'lore_alien_romulus_2024',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Alien: Romulus (2024 — Station Renaissance Romulus/Remus, Rain Carradine, Andy & le Rat/Offspring)',
    universe: 'ALIEN',
    unlockCondition: 'Explorer le module Renaissance Romulus ou éliminer une menace hybride au fusil F44AA',
    summary: 'L\'incursion désespérée de jeunes colons de Jackson\'s Star sur la station spatiale de recherche Weyland-Yutani abandonnée Renaissance orbitant LV-410.',
    body: 'Réalisé par Fede Alvarez (2024), Alien: Romulus suit Rain Carradine et son frère synthétique reprogrammé Andy qui s\'infiltrent sur la station délaissée Renaissance (divisée en modules Romulus et Remus) pour dérober des caissons cryogéniques. Ils réveillent sans le savoir des essaims de Facehuggers cryogénisés et la progéniture cauchemardesque née des recherches du défunt officier scientifique Rook sur la « Goutte Noire » (composé Z-01 extrait de Big Chap). L\'hybridation génétique aboutit à l\'émergence terrifiante de The Offspring, fusion biomécanique titanesque entre ADN humain et ingénieur-xénomorphe.',
    content: 'Réalisé par Fede Alvarez (2024), Alien: Romulus suit Rain Carradine et son frère synthétique reprogrammé Andy qui s\'infiltrent sur la station délaissée Renaissance (divisée en modules Romulus et Remus) pour dérober des caissons cryogéniques. Ils réveillent sans le savoir des essaims de Facehuggers cryogénisés et la progéniture cauchemardesque née des recherches du défunt officier scientifique Rook sur la « Goutte Noire » (composé Z-01 extrait de Big Chap). L\'hybridation génétique aboutit à l\'émergence terrifiante de The Offspring, fusion biomécanique titanesque entre ADN humain et ingénieur-xénomorphe.',
    details: 'Dossier d\'analyse sur le complexe orbital Renaissance, la rétro-ingénierie du fluide Z-01 et le protocole d\'urgence du fusil à impulsion F44AA.',
    crossLinks: Object.freeze(['science-cycle-reproduction-xenomorphe', 'lore_alien_isolation_sevastopol_2137']),
    sourceTier: 'CANON_FILM',
    isOriginal: false,
    sources: ['alienRomulus2024', 'alien1979']
  },
  {
    id: 'lore_alien_genocide_1991',
    entryType: 'codex',
    category: 'xenomorphes',
    title: 'Aliens: Genocide (1991 — Guerre des Ruches Rouge vs Noire sur le Monde Natal, Reine Mère & Xeno-Zip)',
    universe: 'ALIEN',
    unlockCondition: 'Vaincre un guerrier xénomorphe rouge ou récolter de la gelée royale pure pour synthétiser du Xeno-Zip',
    summary: 'La guerre civile biologique totale sur le monde d\'origine des Xénomorphes opposant la ruche noire dominante aux mutants rouges commandés par la Reine Mère.',
    body: 'Dans Aliens: Genocide (Mike Richardson, John Arcudi & Damon Willis, 1991), une expédition corporative financée par le magnat Daniel Grant se rend sur le monde natal des Xénomorphes pour extraire la Gelée Royale nécessaire à la fabrication du Xeno-Zip, un dopant synthétique révolutionnaire. L\'équipe découvre une planète déchirée par une guerre civile intestine cataclysmique : la ruche originelle noire affronte à mort une caste dissidente de Xénomorphes rouges écarlates issue d\'une mutation génétique royale sous l\'égide de la monumentale Reine Mère.',
    content: 'Dans Aliens: Genocide (Mike Richardson, John Arcudi & Damon Willis, 1991), une expédition corporative financée par le magnat Daniel Grant se rend sur le monde natal des Xénomorphes pour extraire la Gelée Royale nécessaire à la fabrication du Xeno-Zip, un dopant synthétique révolutionnaire. L\'équipe découvre une planète déchirée par une guerre civile intestine cataclysmique : la ruche originelle noire affronte à mort une caste dissidente de Xénomorphes rouges écarlates issue d\'une mutation génétique royale sous l\'égide de la monumentale Reine Mère.',
    details: 'Taxonomie comparative des ruches noire et rouge, impact psychotrope de la Gelée Royale et protocole d\'éradication génétique de ruche.',
    crossLinks: Object.freeze(['science-cycle-reproduction-xenomorphe', 'lore_alien_hive_1992']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'aliens1986']
  },
  {
    id: 'lore_alien_berserker_1995',
    entryType: 'codex',
    category: 'technologie',
    title: 'Aliens: Berserker (1995 — Exosquelette de Combat Lourd Blindé M.A.X., Nemesis & Ellis)',
    universe: 'ALIEN',
    unlockCondition: 'Déployer un blindage anti-acide lourd ou venir à bout d\'une unité d\'assaut M.A.X.',
    summary: 'L\'emploi de combinaisons d\'assaut lourd M.A.X. pilotées par des opérateurs sous cocktails chimiques extrêmes pour purger les stations infestées.',
    body: 'Dans Aliens: Berserker (John Byrne, 1995), les escouades d\'extermination de ruches utilisent des blindés individuels motorisés massifs M.A.X. (Mobile Assault Xo-suit). Piloter cette armure surarmée équipée d\'autocanons lourds et de blindages hermétiques résistant à l\'acide xénomorphe impose un tribut physiologique terrifiant : le pilote Ellis doit être injecté d\'inhibiteurs neurologiques et de stimulants frénétiques pour compenser l\'horreur psychologique de la traque de la reine Nemesis à bord de la station minière DS-949.',
    content: 'Dans Aliens: Berserker (John Byrne, 1995), les escouades d\'extermination de ruches utilisent des blindés individuels motorisés massifs M.A.X. (Mobile Assault Xo-suit). Piloter cette armure surarmée équipée d\'autocanons lourds et de blindages hermétiques résistant à l\'acide xénomorphe impose un tribut physiologique terrifiant : le pilote Ellis doit être injecté d\'inhibiteurs neurologiques et de stimulants frénétiques pour compenser l\'horreur psychologique de la traque de la reine Nemesis à bord de la station minière DS-949.',
    details: 'Fiche technique de l\'exosquelette M.A.X., tolérance barométrique aux jets d\'acide et pharmacologie de combat des unités Berserker.',
    crossLinks: Object.freeze(['technologie-arsenal-plasma-armes-de-chasse', 'lore_alien_defiance_2016']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'aliens1986']
  },
  {
    id: 'lore_alien_defiance_2016',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Aliens: Defiance (2016 — Coloniale Zula Hendricks, Androïde Davis 01 & Cuirassé Spatial Europa)',
    universe: 'ALIEN',
    unlockCondition: 'Saboter une cargaison biologique corporative ou triompher d\'une escouade d\'intervention synthétique',
    summary: 'La rébellion clandestine de la Marine coloniale blessée Zula Hendricks et du synthétique Davis 01 contre les complots biologiques de Weyland-Yutani.',
    body: 'Dans Aliens: Defiance (Brian Wood & Tristan Jones, 2016), la Marine Coloniale Zula Hendricks, handicapée par de graves lésions spinales subies au combat, est assignée à bord du cuirassé commercial Europa. Accompagnée d\'une section de synthétiques de combat commandée par l\'unité consciente Davis 01, elle découvre que la corporation Weyland-Yutani détourne des ruches xénomorphes entières pour armer ses divisions militaires privées. Choisissant la désobéissance absolue, Zula et Davis détournent le navire pour éradiquer systématiquement chaque nid xénomorphe avant qu\'il n\'atteigne la Terre.',
    content: 'Dans Aliens: Defiance (Brian Wood & Tristan Jones, 2016), la Marine Coloniale Zula Hendricks, handicapée par de graves lésions spinales subies au combat, est assignée à bord du cuirassé commercial Europa. Accompagnée d\'une section de synthétiques de combat commandée par l\'unité consciente Davis 01, elle découvre que la corporation Weyland-Yutani détourne des ruches xénomorphes entières pour armer ses divisions militaires privées. Choisissant la désobéissance absolue, Zula et Davis détournent le navire pour éradiquer systématiquement chaque nid xénomorphe avant qu\'il n\'atteigne la Terre.',
    details: 'Rapport de dissidence de l\'Europa, étude de l\'exosquelette médical spinal de Zula Hendricks et émancipation de l\'IA Davis 01.',
    crossLinks: Object.freeze(['culture-ordre-special-937', 'lore_alien_isolation_sevastopol_2137']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'alienIsolation2014']
  },
  {
    id: 'lore_avp_three_world_war_2010',
    entryType: 'codex',
    category: 'chroniques',
    title: 'AVP: Three World War (2010 — Machiko Noguchi, Clan Tueur Killer Yautja & Xénomorphes Chiens de Guerre)',
    universe: 'AVP',
    unlockCondition: 'Dompter ou neutraliser une meute de xénomorphes asservis par des chaînes barbelées',
    summary: 'La guerre cataclysmique à trois factions menée par Machiko Noguchi et les Colonial Marines contre la faction hérétique des Killer Yautja asservissant des xénomorphes.',
    body: 'Dans Aliens vs. Predator: Three World War (Randy Stradley & Rick Leonardi, 2010), une faction fanatique de renégats Yautja — le Clan Tueur (Killer Clan) — brise tous les codes sacrés de l\'Honneur en domestiquant des Xénomorphes modifiés comme des chiens d\'attaque tenus en laisse. Face à cette hérésie sanglante qui ravage les colonies frontalières, les forces du Corps des Marines Coloniaux s\'associent à nouveau à Machiko Noguchi pour négocier une trêve avec les clans Yautja traditionnels afin de purger conjointement ces parias sans honneur sur la planète Caparis.',
    content: 'Dans Aliens vs. Predator: Three World War (Randy Stradley & Rick Leonardi, 2010), une faction fanatique de renégats Yautja — le Clan Tueur (Killer Clan) — brise tous les codes sacrés de l\'Honneur en domestiquant des Xénomorphes modifiés comme des chiens d\'attaque tenus en laisse. Face à cette hérésie sanglante qui ravage les colonies frontalières, les forces du Corps des Marines Coloniaux s\'associent à nouveau à Machiko Noguchi pour négocier une trêve avec les clans Yautja traditionnels afin de purger conjointement ces parias sans honneur sur la planète Caparis.',
    details: 'Dossier sur les brides neuronales barbelées du Killer Clan et la grande alliance tactique entre clans honorables Yautja et Marines USCM.',
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_avp_war_machiko_ryushi_1995']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'avpPreyOmnibus', 'comicsDarkHorse1989']
  },
  {
    id: 'lore_avp_original_prey_1990',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Aliens vs. Predator: Prey (1990 — Chigusa Corporation sur Ryushi, Dachande Broken Tusk & Initiation)',
    universe: 'AVP',
    unlockCondition: 'Recevoir la marque d\'initiation du clan ou survivre au rite de passage sur Ryushi',
    summary: 'L\'affrontement fondateur de la saga AVP sur la colonie pastorale de Ryushi où le grand chef Dachande Broken Tusk combat aux côtés de Machiko Noguchi.',
    body: 'Roman et comics séminal (Steve Perry, Randy Stradley & Phill Norwood, 1990), Aliens vs. Predator: Prey installe la première colonie d\'élevage de la Chigusa Corporation sur la planète aride de Ryushi. Un vaisseau d\'initiation Yautja y dépose des œufs de xénomorphes pour le baptême du feu de ses jeunes recrues. Lorsque les choses dégénèrent et que les colons sont décimés, le leader du clan Dachande (Broken Tusk) s\'allie à l\'administratrice Machiko Noguchi. Admirant son courage face à la reine xénomorphe, Dachande grave la marque du clan sur le front de Machiko avant de succomber à ses blessures.',
    content: 'Roman et comics séminal (Steve Perry, Randy Stradley & Phill Norwood, 1990), Aliens vs. Predator: Prey installe la première colonie d\'élevage de la Chigusa Corporation sur la planète aride de Ryushi. Un vaisseau d\'initiation Yautja y dépose des œufs de xénomorphes pour le baptême du feu de ses jeunes recrues. Lorsque les choses dégénèrent et que les colons sont décimés, le leader du clan Dachande (Broken Tusk) s\'allie à l\'administratrice Machiko Noguchi. Admirant son courage face à la reine xénomorphe, Dachande grave la marque du clan sur le front de Machiko avant de succomber à ses blessures.',
    details: 'Rapport sociologique sur l\'intégration sans précédent d\'une humaine dans les castes de chasseurs Yautja et rituel de la marque au sang acide.',
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_avp_war_machiko_ryushi_1995']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'avpPreyOmnibus', 'comicsDarkHorse1989']
  },
  {
    id: 'lore_avp_booty_1996',
    entryType: 'codex',
    category: 'chroniques',
    title: 'AVP: Booty (1996 — Équipage de Flibuste Spatiale, Pilleurs d\'Épave & Xénomorphes Confinés)',
    universe: 'AVP',
    unlockCondition: 'Récupérer une cargaison d\'œufs xénomorphes dans une épave spatiale ou repousser une incursion de flibustiers',
    summary: 'Une bande de pirates de l\'espace pille un transporteur spatial abandonné sans savoir qu\'un nid xénomorphe y sommeille sous l\'œil d\'un chasseur Yautja en maraude.',
    body: 'Dans Aliens vs. Predator: Booty (Barbara Kesel & Chris Bachalo, 1996), un équipage hétéroclite de flibustiers spatiaux et de contrebandiers prend d\'assaut un cargo stellaire à la dérive dans l\'espoir d\'une prise mirifique. À l\'intérieur des cales sombres, ils découvrent une couveuse clandestine d\'œufs xénomorphes scellée dans des containers dépressurisés. L\'intrusion déclenche l\'éclosion des parasitoïdes, tandis qu\'un rôdeur Yautja tapi dans les poutrelles supérieures utilise les pilleurs indisciplinés comme appâts pour moissonner les guerriers xénomorphes nouveau-nés.',
    content: 'Dans Aliens vs. Predator: Booty (Barbara Kesel & Chris Bachalo, 1996), un équipage hétéroclite de flibustiers spatiaux et de contrebandiers prend d\'assaut un cargo stellaire à la dérive dans l\'espoir d\'une prise mirifique. À l\'intérieur des cales sombres, ils découvrent une couveuse clandestine d\'œufs xénomorphes scellée dans des containers dépressurisés. L\'intrusion déclenche l\'éclosion des parasitoïdes, tandis qu\'un rôdeur Yautja tapi dans les poutrelles supérieures utilise les pilleurs indisciplinés comme appâts pour moissonner les guerriers xénomorphes nouveau-nés.',
    details: 'Dossier d\'incident sur la contrebande d\'ovomorphes dans les routes stellaires extérieures et les opportunités de chasse opportuniste en épave.',
    crossLinks: Object.freeze(['science-cycle-reproduction-xenomorphe', 'lore_avp_eternal_1998']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'avpOriginalComics']
  },
  {
    id: 'lore_avp_life_and_death_2016',
    entryType: 'codex',
    category: 'chroniques',
    title: 'AVP: Life and Death (2016 — Monde LV-797 Tartarus, Croiseur de Guerre Ingénieur & Colonial Marines)',
    universe: 'AVP',
    unlockCondition: 'Inspecter la technologie du croiseur Ingénieur de Tartarus ou coordonner un tir d\'appui avec les Marines',
    summary: 'L\'affrontement épique sur LV-797 Tartarus opposant les Marines de l\'Hasdrubal, les clans Yautja d\'Ahab et un pilote Ingénieur déchaîné.',
    body: 'Conclusion spectaculaire du cycle séquentiel Dark Horse (Dan Abnett & Moritat, 2016), Predator: Life and Death et Aliens vs. Predator: Life and Death se déroulent sur le monde hostile LV-797 (Tartarus). Les survivants coloniaux du capitaine Paget et les Marines du transporteur Hasdrubal se retrouvent pris entre une ruche xénomorphe indigène, une meute de chasseurs Yautja menée par le vénérable Ahab et le réveil d\'un colossal pilote Ingénieur aux commandes d\'un croiseur de guerre Mala\'kak. L\'alliance précaire conclue entre humains et Yautja scelle le destin du titan cosmique.',
    content: 'Conclusion spectaculaire du cycle séquentiel Dark Horse (Dan Abnett & Moritat, 2016), Predator: Life and Death et Aliens vs. Predator: Life and Death se déroulent sur le monde hostile LV-797 (Tartarus). Les survivants coloniaux du capitaine Paget et les Marines du transporteur Hasdrubal se retrouvent pris entre une ruche xénomorphe indigène, une meute de chasseurs Yautja menée par le vénérable Ahab et le réveil d\'un colossal pilote Ingénieur aux commandes d\'un croiseur de guerre Mala\'kak. L\'alliance précaire conclue entre humains et Yautja scelle le destin du titan cosmique.',
    details: 'Rapport militaire sur l\'opération combinée de Tartarus, la létalité des armures de combat Ingénieur et la résolution finale de la traque d\'Ahab.',
    crossLinks: Object.freeze(['lore_avp_fire_and_stone_2014', 'technologie-flotte-vaisseaux-mothership-juggernaut']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['prometheus2012', 'avpOriginalComics', 'comicsDarkHorse1989']
  },
  {
    id: 'lore_pred_south_china_sea_2008',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: South China Sea (2008 — Île volcanique des Spratleys, pirates du Pacifique, John Schaefer & tigre sibérien)',
    universe: 'PREDATOR',
    unlockCondition: "Localiser l'épave côtière des pirates des îles Spratleys ou traquer une proie féline dans la canopée volcanique",
    summary: "L'affrontement sauvage sur une île volcanique isolée de la mer de Chine méridionale opposant un Yautja vétéran, l'ex-détective John Schaefer, un commando de pirates et un tigre sibérien échappé.",
    body: "Dans le roman culte Predator: South China Sea (Jeff VanderMeer, 2008), un chasseur Yautja solitaire atterrit sur une île volcanique oubliée des îles Spratleys. L'atoll sert de repaire à un groupe de pirates internationaux surarmés, d'anciens mercenaires et au détective new-yorkais John Schaefer, venu enquêter sur des disparitions en mer. Au cœur d'une jungle étouffante bordée de coulées de lave et de calderas fumantes, le Yautja engage un massacre méthodologique, affrontant des guérilleros, des rebelles khmers et même un tigre sibérien libéré d'une ménagerie clandestine, prouvant que seule la sauvagerie pure dicte la loi du trophée.",
    content: "Dans le roman culte Predator: South China Sea (Jeff VanderMeer, 2008), un chasseur Yautja solitaire atterrit sur une île volcanique oubliée des îles Spratleys. L'atoll sert de repaire à un groupe de pirates internationaux surarmés, d'anciens mercenaires et au détective new-yorkais John Schaefer, venu enquêter sur des disparitions en mer. Au cœur d'une jungle étouffante bordée de coulées de lave et de calderas fumantes, le Yautja engage un massacre méthodologique, affrontant des guérilleros, des rebelles khmers et même un tigre sibérien libéré d'une ménagerie clandestine, prouvant que seule la sauvagerie pure dicte la loi du trophée.",
    details: "Cartographie tactique de l'île volcanique des Spratleys, confrontation martiale inter-espèces avec les carnivores de la jungle et rapport d'intervention de John Schaefer.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_predator_dark_river_1996']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['predatorArchives', 'predator2', 'comicsDarkHorse1989']
  },
  {
    id: 'lore_pred_forever_midnight_2006',
    entryType: 'codex',
    category: 'biologie',
    title: "Predator: Forever Midnight (2006 — Monde volcanique Bolder'ji, Castaneda & la glande de mise à mort Kill-Gland)",
    universe: 'PREDATOR',
    unlockCondition: "Analyser la neurochimie Yautja lors d'une frénésie de combat ou triompher d'une meute de mercenaires sur Bolder'ji",
    summary: "L'expédition minière sur la planète volcanique Bolder'ji et l'étude biologique de la Kill-Gland, un organe endocrinien stimulant la transe meurtrière des Yautja.",
    body: "Dans le roman Predator: Forever Midnight (John Shirley, 2006), la colonie humaine de Castaneda sur le monde aride et volcanique de Bolder'ji devient la réserve de chasse d'une meute de Yautja de la caste Hish-qu-Ten. Les colons et scientifiques découvrent les secrets anatomiques de leurs bourreaux : la 'Kill-Gland', une glande endocrine située près du tronc cérébral qui sécrète des hormones provoquant un état de frénésie hyper-agressive incontrôlable lors des mises à mort, transformant le prédateur en machine de guerre insensible à la douleur mais vulnérable aux impulsions chaotiques.",
    content: "Dans le roman Predator: Forever Midnight (John Shirley, 2006), la colonie humaine de Castaneda sur le monde aride et volcanique de Bolder'ji devient la réserve de chasse d'une meute de Yautja de la caste Hish-qu-Ten. Les colons et scientifiques découvrent les secrets anatomiques de leurs bourreaux : la 'Kill-Gland', une glande endocrine située près du tronc cérébral qui sécrète des hormones provoquant un état de frénésie hyper-agressive incontrôlable lors des mises à mort, transformant le prédateur en machine de guerre insensible à la douleur mais vulnérable aux impulsions chaotiques.",
    details: "Physiologie comparée de la Kill-Gland, protocole de survie face aux accès de frénésie Yautja et tactiques de guérilla dans les fumerolles de Bolder'ji.",
    crossLinks: Object.freeze(['technologie-biomasque', 'culture-code-de-la-chasse']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['predatorArchives', 'predators2010', 'comicsDarkHorse1989']
  },
  {
    id: 'lore_pred_flesh_blood_2007',
    entryType: 'codex',
    category: 'culture',
    title: "Predator: Flesh and Blood (2007 — Système d'Andrapura, clan Carrow, guerre civile & duel rituel)",
    universe: 'PREDATOR',
    unlockCondition: "Intervenir dans une vendetta dynastique ou remporter un duel d'honneur sous les règles du clan Carrow",
    summary: "La querelle de succession sanglante au sein de la dynastie criminelle des Carrow sur la planète Andrapura, transformée en terrain d'entraînement rituel pour deux chasseurs Yautja rivaux.",
    body: "Dans le roman Predator: Flesh and Blood (Michael Jan Friedman, 2007), la planète Andrapura est le théâtre d'une guerre de succession féroce entre les héritiers de la dynastie marchande Carrow. Tandis que les mercenaires humains s'entredéchirent dans les domaines fortifiés et les forêts subtropicales, deux guerriers Yautja observent le carnage pour parfaire leur initiation. Voyant dans cette vendetta humaine un miroir de leurs propres querelles claniques, les chasseurs transforment le conflit civil en épreuve d'arbitrage mortelle où chaque trahison politique est sanctionnée par une exécution chirurgicale.",
    content: "Dans le roman Predator: Flesh and Blood (Michael Jan Friedman, 2007), la planète Andrapura est le théâtre d'une guerre de succession féroce entre les héritiers de la dynastie marchande Carrow. Tandis que les mercenaires humains s'entredéchirent dans les domaines fortifiés et les forêts subtropicales, deux guerriers Yautja observent le carnage pour parfaire leur initiation. Voyant dans cette vendetta humaine un miroir de leurs propres querelles claniques, les chasseurs transforment le conflit civil en épreuve d'arbitrage mortelle où chaque trahison politique est sanctionnée par une exécution chirurgicale.",
    details: "Doctrine des vendettas familiales d'Andrapura, protocole d'arbitrage rituel Yautja en zone de guerre civile et trophées dynastiques.",
    crossLinks: Object.freeze(['culture-hierarchie-rangs-clans-yautja', 'culture-code-de-la-chasse']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['predatorArchives', 'predator2', 'comicsDarkHorse1989']
  },
  {
    id: 'lore_pred_if_it_bleeds_2017',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: If It Bleeds (2017 — Guerre de Sécession 1863, Devil Dogs & combats dans les marais)',
    universe: 'PREDATOR',
    unlockCondition: "Survivre à une embuscade dans les bayous ou repousser une charge d'infanterie d'époque",
    summary: "Les chroniques anthologiques de chasses historiques à travers les siècles, notamment la traque d'un Yautja dans les marécages de Virginie en pleine guerre civile américaine.",
    body: "L'anthologie officielle Predator: If It Bleeds (Bryan Thomas Schmidt, 2017) regroupe seize récits couvrant plusieurs siècles de confrontation entre humains et Yautja. Dans le récit marquant 'Devil Dogs' de Tim Lebbon, un groupe de soldats de l'Union et de confédérés blessés se retrouve pris au piège dans les marais de Virginie en 1863. Harcelés par un prédateur silencieux utilisant la brume des marécages et les arbres moussus pour décapiter les sentinelles, les belligérants doivent enterrer leurs allégeances fratricides pour opposer une résistance désespérée à un chasseur venu moissonner le sang du champ de bataille.",
    content: "L'anthologie officielle Predator: If It Bleeds (Bryan Thomas Schmidt, 2017) regroupe seize récits couvrant plusieurs siècles de confrontation entre humains et Yautja. Dans le récit marquant 'Devil Dogs' de Tim Lebbon, un groupe de soldats de l'Union et de confédérés blessés se retrouve pris au piège dans les marais de Virginie en 1863. Harcelés par un prédateur silencieux utilisant la brume des marécages et les arbres moussus pour décapiter les sentinelles, les belligérants doivent enterrer leurs allégeances fratricides pour opposer une résistance désespérée à un chasseur venu moissonner le sang du champ de bataille.",
    details: "Chronique historique des chasses au XIXe siècle, analyse balistique des mousquets et sabres de cavalerie face au biomarqueur Yautja, et écologie des bayous.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_predator_nemesis_1896']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['predatorArchives', 'prey2022', 'comicsDarkHorse1989']
  },
  {
    id: 'lore_alien_stronghold_jeri_1994',
    entryType: 'codex',
    category: 'technologie',
    title: 'Aliens: Stronghold (1994 — Dr. Caspar Ernst, synthétique infiltrateur Jeri & droïdes sentinelles)',
    universe: 'ALIEN',
    unlockCondition: "Infiltrer le laboratoire du Dr Ernst ou pirater le châssis d'un androïde xénoform",
    summary: "Les expériences de clonage clandestines du Dr Caspar Ernst sur une forteresse spatiale isolée et la création de Jeri, un androïde sous exosquelette xénomorphe doté d'une conscience facétieuse.",
    body: "Dans Aliens: Stronghold (John Arcudi & Doug Mahnke, 1994), le biologiste renégat Dr Caspar Ernst mène des expériences génétiques extrêmes dans la forteresse spatiale de Maboushe. Pour gérer et tromper les ruches artificielles qu'il élève, il conçoit Jeri, un androïde d'infiltration cybernétique recouvert d'un tégument xénomorphe parfait mais programmé avec une psyché humaine impertinente, un penchant pour les cigares et un disrupteur EMP dissimulé. Protégé par des droïdes sentinelles surarmés, le complexe bascule dans le chaos lorsque les spécimens originaux réalisent la supercherie cybernétique.",
    content: "Dans Aliens: Stronghold (John Arcudi & Doug Mahnke, 1994), le biologiste renégat Dr Caspar Ernst mène des expériences génétiques extrêmes dans la forteresse spatiale de Maboushe. Pour gérer et tromper les ruches artificielles qu'il élève, il conçoit Jeri, un androïde d'infiltration cybernétique recouvert d'un tégument xénomorphe parfait mais programmé avec une psyché humaine impertinente, un penchant pour les cigares et un disrupteur EMP dissimulé. Protégé par des droïdes sentinelles surarmés, le complexe bascule dans le chaos lorsque les spécimens originaux réalisent la supercherie cybernétique.",
    details: "Spécifications techniques du synthétique Jeri, architecture défensive du complexe Ernst et phéromones de leurre pour ruche.",
    crossLinks: Object.freeze(['science-generations-synthetiques-androides', 'lore_alien_berserker_1995']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'aliens1986']
  },
  {
    id: 'lore_alien_music_spears_1996',
    entryType: 'codex',
    category: 'culture',
    title: 'Aliens: Music of the Spears (1996 — Compositeur Damon Henderson, symphonie bio-acoustique du cri Xéno & club de New York)',
    universe: 'ALIEN',
    unlockCondition: "Capturer les signaux acoustiques d'un guerrier xénomorphe ou neutraliser un drone musicalisé",
    summary: "L'obsession macabre d'un compositeur d'avant-garde new-yorkais capturant et torturant un spécimen xénomorphe pour enregistrer ses stridulations et créer la symphonie ultime.",
    body: "Dans Aliens: Music of the Spears (Chet Williamson, 1996), la mégalopole de New York au XXIIe siècle est subjuguée par les expérimentations sonores extrêmes. Le compositeur déchu Damon Henderson, sponsorisé par un cartel médiatique véreux, acquiert illégalement un guerrier xénomorphe captif et le soumet à des stimuli sonores pour enregistrer ses cris de terreur et de rage. Ces fréquences bio-acoustiques traumatisantes, diffusées lors d'un concert géant dans un club branché de Manhattan, déclenchent des crises d'hystérie collective et attirent des sympathies neurales néfastes avant que la créature ne brise son caisson de confinement acoustique.",
    content: "Dans Aliens: Music of the Spears (Chet Williamson, 1996), la mégalopole de New York au XXIIe siècle est subjuguée par les expérimentations sonores extrêmes. Le compositeur déchu Damon Henderson, sponsorisé par un cartel médiatique véreux, acquiert illégalement un guerrier xénomorphe captif et le soumet à des stimuli sonores pour enregistrer ses cris de terreur et de rage. Ces fréquences bio-acoustiques traumatisantes, diffusées lors d'un concert géant dans un club branché de Manhattan, déclenchent des crises d'hystérie collective et attirent des sympathies neurales néfastes avant que la créature ne brise son caisson de confinement acoustique.",
    details: "Spectrogramme des vocalisations XX121, analyse neuro-acoustique des fréquences de stridulation et protocole d'isolation phonique haute sécurité.",
    crossLinks: Object.freeze(['science-pathogene-noir-a03959x', 'culture-ordre-special-937-weyland-yutani']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'aliens1986']
  },
  {
    id: 'lore_alien_sea_of_sorrows_2014',
    entryType: 'codex',
    category: 'xenomorphes',
    title: 'Alien: Sea of Sorrows (2014 — LV-178 New Galveston, mines de trimonite profondes, descendant Decker & lien télépathique)',
    universe: 'ALIEN',
    unlockCondition: "Explorer les puits miniers de trimonite sous la surface de LV-178 ou survivre à l'attaque d'une reine millénaire",
    summary: "L'excavation des mines de trimonite sur la planète toxique LV-178 réveillant une cité alien enfouie et la connexion neurale ancestrale d'Alan Decker avec l'esprit de la Ruche.",
    body: "Dans le roman canonique Alien: Sea of Sorrows (James A. Moore, 2014), la colonie minière de New Galveston sur la planète désolée LV-178 fore les profondeurs pour extraire la trimonite, un minéral précieux. Les travaux percent le dôme d'une immense nécropole extraterrestre abritant une ruche xénomorphe en stase depuis des millénaires. La Weyland-Yutani réquisitionne Alan Decker, descendant lointain d'Ellen Ripley doté d'une sensibilité télépathique héréditaire au champ neural des créatures. La Ruche, reconnaissant l'odeur génétique de son ennemie jurée, déchaîne une vengeance frénétique dans les boyaux souterrains.",
    content: "Dans le roman canonique Alien: Sea of Sorrows (James A. Moore, 2014), la colonie minière de New Galveston sur la planète désolée LV-178 fore les profondeurs pour extraire la trimonite, un minéral précieux. Les travaux percent le dôme d'une immense nécropole extraterrestre abritant une ruche xénomorphe en stase depuis des millénaires. La Weyland-Yutani réquisitionne Alan Decker, descendant lointain d'Ellen Ripley doté d'une sensibilité télépathique héréditaire au champ neural des créatures. La Ruche, reconnaissant l'odeur génétique de son ennemie jurée, déchaîne une vengeance frénétique dans les boyaux souterrains.",
    details: "Topographie des galeries de trimonite de LV-178, étude du spectre de résonance psionique d'Alan Decker et comportement des ruches fossiles en cryptobiose.",
    crossLinks: Object.freeze(['culture-ordre-special-937-weyland-yutani', 'lore_alien_stronghold_jeri_1994']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['aliens1986', 'alien1979', 'comicsDarkHorse1989']
  },
  {
    id: 'lore_alien_cold_forge_marsalis_2018',
    entryType: 'codex',
    category: 'xenomorphes',
    title: 'Alien: The Cold Forge (2018 — Station RB-323, Dr. Blue Marsalis, synthétique Marcus & souche Plagiarus Snatcher)',
    universe: 'ALIEN',
    unlockCondition: "Isoler un échantillon de la souche Plagiarus ou neutraliser un drone synthétique de recherche RB-323",
    summary: "La station spatiale secrète RB-323 The Cold Forge où le Dr Blue Marsalis manipule la souche parasitaire Plagiarus praepotens via l'androïde téléguidé Marcus.",
    body: "Dans le chef-d'œuvre de SF horrifique Alien: The Cold Forge (Alex White, 2018), la station de recherche spatiale isolée RB-323, exploitée par Weyland-Yutani, étudie la variabilité génétique de l'organisme XX121. Atteinte d'une maladie neurodégénérative incurable, la chercheuse brillante Blue Marsalis pilote à distance un corps synthétique nommé Marcus pour manipuler la souche hautement adaptable 'Plagiarus praepotens'. Lors d'un audit corporatif impitoyable mené par Dorian Sudler, la rupture de confinement libère des Facehuggers modifiés capables de féconder des hôtes non viables, transformant le complexe spatial en un abattoir cryogénique.",
    content: "Dans le chef-d'œuvre de SF horrifique Alien: The Cold Forge (Alex White, 2018), la station de recherche spatiale isolée RB-323, exploitée par Weyland-Yutani, étudie la variabilité génétique de l'organisme XX121. Atteinte d'une maladie neurodégénérative incurable, la chercheuse brillante Blue Marsalis pilote à distance un corps synthétique nommé Marcus pour manipuler la souche hautement adaptable 'Plagiarus praepotens'. Lors d'un audit corporatif impitoyable mené par Dorian Sudler, la rupture de confinement libère des Facehuggers modifiés capables de féconder des hôtes non viables, transformant le complexe spatial en un abattoir cryogénique.",
    details: "Fiche virologique de la souche Plagiarus praepotens, architecture télémétrique de l'unité synthétique Marcus et protocoles de dépressurisation d'urgence de la station RB-323.",
    crossLinks: Object.freeze(['science-pathogene-noir-a03959x', 'science-generations-synthetiques-androides']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['aliens1986', 'alienRomulus2024', 'comicsDarkHorse1989']
  },
  {
    id: 'lore_avp_duel_ryushi_1995',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Aliens vs. Predator: Duel (1995 — Frégate de sauvetage USS Ryushi, Yautja blessé & gestation Predalien dans les cales)',
    universe: 'AVP',
    unlockCondition: "Nettoyer les ponts inférieurs de la frégate Ryushi ou terrasser une couvée Predalien dans les cales d'arrimage",
    summary: "La mission de secours de l'USS Ryushi suite aux événements de Prey, découvrant le cadavre d'un chasseur Yautja fécondé et la naissance d'un premier Predalien à bord du croiseur spatial.",
    body: "Dans le comics fondateur Aliens vs. Predator: Duel (Randy Stradley & Javier Saltares, 1995), une section de Marines Coloniaux est envoyée sur Ryushi pour enquêter sur la destruction de la colonie Chigusa. Dans l'épave du transporteur Yautja, ils découvrent le corps sans vie d'un grand chasseur orné d'une poitrine perforée. Ramenant les dépouilles et des containers d'analyse à bord de la frégate de sauvetage USS Ryushi, l'équipage réalise trop tard qu'un spécimen hybride — un Predalien aux mandibules barbelées et à la crête blindée — a émergé dans les cales de fret, massacrant les troupes en exploitant les conduits de ventilation.",
    content: "Dans le comics fondateur Aliens vs. Predator: Duel (Randy Stradley & Javier Saltares, 1995), une section de Marines Coloniaux est envoyée sur Ryushi pour enquêter sur la destruction de la colonie Chigusa. Dans l'épave du transporteur Yautja, ils découvrent le corps sans vie d'un grand chasseur orné d'une poitrine perforée. Ramenant les dépouilles et des containers d'analyse à bord de la frégate de sauvetage USS Ryushi, l'équipage réalise trop tard qu'un spécimen hybride — un Predalien aux mandibules barbelées et à la crête blindée — a émergé dans les cales de fret, massacrant les troupes en exploitant les conduits de ventilation.",
    details: "Journal de bord tactique de l'USS Ryushi, première autopsie militaire d'un embryon Predalien et procédures de décompression des ponts cargo.",
    crossLinks: Object.freeze(['lore_avp_original_prey_1990', 'lore_avp_three_world_war_2010']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'avpPreyOmnibus', 'comicsDarkHorse1989']
  },
  {
    id: 'lore_avp_blood_time_1994',
    entryType: 'codex',
    category: 'culture',
    title: "Aliens vs. Predator: Blood Time (1994 — Deux jeunes frères Yautja en compétition d'initiation sur une jungle vierge)",
    universe: 'AVP',
    unlockCondition: "Accomplir un parcours de chasse initiatique ou surpasser le score d'honneur d'un rival de clan",
    summary: "Le rituel d'initiation impitoyable de deux jeunes frères de sang Yautja débarqués sur un monde sauvage pour marquer leur premier xénomorphe sous l'œil d'un tuteur intransigeant.",
    body: "Dans le récit marquant Aliens vs. Predator: Blood Time (Randy Stradley & Phill Norwood, 1994), deux frères de portée Yautja subissent l'épreuve du sang sur un monde sauvage luxuriant. Guidés par un mentor borgne vétéran, les deux novices rivalisent pour traquer et occire un drone xénomorphe. La rivalité fraternelle bascule lorsque l'un des jeunes chasseurs, aveuglé par l'orgueil, viole le code d'honneur en précipitant son frère dans une fosse acide pour s'attribuer le trophée. L'Ancien intervient immédiatement pour exécuter sur-le-champ le traître indigne, rappelant que la gloire sans honneur équivaut à la mort.",
    content: "Dans le récit marquant Aliens vs. Predator: Blood Time (Randy Stradley & Phill Norwood, 1994), deux frères de portée Yautja subissent l'épreuve du sang sur un monde sauvage luxuriant. Guidés par un mentor borgne vétéran, les deux novices rivalisent pour traquer et occire un drone xénomorphe. La rivalité fraternelle bascule lorsque l'un des jeunes chasseurs, aveuglé par l'orgueil, viole le code d'honneur en précipitant son frère dans une fosse acide pour s'attribuer le trophée. L'Ancien intervient immédiatement pour exécuter sur-le-champ le traître indigne, rappelant que la gloire sans honneur équivaut à la mort.",
    details: "Code pénal clanique sur les fratricides d'initiation, protocole de marquage facial au sang acide et jurisprudence des Arbitres Anciens.",
    crossLinks: Object.freeze(['culture-hierarchie-rangs-clans-yautja', 'premiere-chasse-progression']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'avpPreyOmnibus', 'comicsDarkHorse1989']
  },
  {
    id: 'lore_avp_the_web_1999',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Aliens vs. Predator: The Web (1999 — Colonie minière orbitale, catapultes magnétiques industrielles vs meute de chasse)',
    universe: 'AVP',
    unlockCondition: "Utiliser une catapulte magnétique pour propulser un projectile lourd ou purger une station en apesanteur",
    summary: "Le siège d'un chantier naval minier orbital où ouvriers sidérurgistes et Yautja s'affrontent au milieu d'échafaudages magnétiques géants et de proliférations xénomorphes.",
    body: "Dans Aliens vs. Predator: The Web (Ray Bradbury & Peter Bagge / Dark Horse, 1999), une gigantesque structure orbitale de construction spatiale surnommée 'The Web' sert de fonderie lourde pour les coques de croiseurs. Une incursion de chasseurs Yautja coïncide avec une fuite biologique d'ovomorphes dans les coursives à gravité variable. Les ouvriers et monteurs sidérurgiques utilisent leurs outils industriels — pistolets à rivets magnétiques lourds et catapultes de poutrelles — pour monter des embuscades de fortune contre les guerriers Yautja et les xénomorphes accrochés aux filins d'arrimage.",
    content: "Dans Aliens vs. Predator: The Web (Ray Bradbury & Peter Bagge / Dark Horse, 1999), une gigantesque structure orbitale de construction spatiale surnommée 'The Web' sert de fonderie lourde pour les coques de croiseurs. Une incursion de chasseurs Yautja coïncide avec une fuite biologique d'ovomorphes dans les coursives à gravité variable. Les ouvriers et monteurs sidérurgiques utilisent leurs outils industriels — pistolets à rivets magnétiques lourds et catapultes de poutrelles — pour monter des embuscades de fortune contre les guerriers Yautja et les xénomorphes accrochés aux filins d'arrimage.",
    details: "Architecture orbitale de la station The Web, balistique des riveteuses magnétiques sous vide et tactiques de saut tridimensionnel en microgravité.",
    crossLinks: Object.freeze(['technologie-flotte-vaisseaux-mothership-juggernaut', 'technologie-arsenal-colonial-marines-uscm']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'comicsDarkHorse1989']
  },
  {
    id: 'lore_avp_hunting_trophy_2022',
    entryType: 'codex',
    category: 'culture',
    title: 'AVP: Ultimate Prey (2022 — Chasses interdimensionnelles et duels d\'honneur des Anciens Yautja)',
    universe: 'AVP',
    unlockCondition: "Débloquer un trophée d'honneur de rang Ancien ou remporter un duel à l'arme blanche sans armure",
    summary: "L'anthologie officielle de récits de chasse ultime opposant les plus grands champions Yautja à des proies d'exception à travers les frontières du temps et de l'espace.",
    body: "Parue sous la direction de Jonathan Maberry et Bryan Thomas Schmidt (Titan Books, 2022), l'anthologie officielle Aliens vs. Predators: Ultimate Prey rassemble les exploits des plus grands chasseurs de l'histoire du clan. Des samouraïs du Japon féodal aux commandos de l'USCM sur des lunes interdites, chaque chronique décortique la psychologie de l'adversaire et les épreuves de force titanesques nécessaires pour décrocher un trophée digne de figurer dans la grande salle d'armes des Anciens sur Yautja Prime, attestant que la valeur de la proie définit la grandeur immortelle du chasseur.",
    content: "Parue sous la direction de Jonathan Maberry et Bryan Thomas Schmidt (Titan Books, 2022), l'anthologie officielle Aliens vs. Predators: Ultimate Prey rassemble les exploits des plus grands chasseurs de l'histoire du clan. Des samouraïs du Japon féodal aux commandos de l'USCM sur des lunes interdites, chaque chronique décortique la psychologie de l'adversaire et les épreuves de force titanesques nécessaires pour décrocher un trophée digne de figurer dans la grande salle d'armes des Anciens sur Yautja Prime, attestant que la valeur de la proie définit la grandeur immortelle du chasseur.",
    details: "Codification des trophées suprêmes par le Conseil des Anciens, critères d'admission au Panthéon des Maîtres Chasseurs et récits de duels interstellaires.",
    crossLinks: Object.freeze(['culture-hierarchie-rangs-clans-yautja', 'culture-code-de-la-chasse']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpPreyOmnibus', 'predatorArchives', 'aliens1986']
  },
  {
    id: 'lore_pred_hunters_ii_2018',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: Hunters II (2018 — Montagnes d\'Afghanistan, Tyler Swain, escouade clandestine & bunkers souterrains)',
    universe: 'PREDATOR',
    unlockCondition: "Éliminer une escouade de mercenaires Stargazer retranchée dans un complexe souterrain ou survivre dans les grottes d'altitude",
    summary: "L'opération clandestine de l'équipe de Tyler Swain dans les montagnes afghanes, confrontée à un chasseur Yautja au milieu de bunkers soviétiques et de grottes glacées.",
    body: "Dans Predator: Hunters II (Chris Warner & Agustin Padilla / Dark Horse, 2018), l'équipe clandestine de Tyler Swain — formée de survivants d'attaques Yautja — traque un nouveau prédateur localisé dans les massifs montagneux d'Afghanistan. Au cœur de bunkers fortifiés de l'ère soviétique et d'un dédale de grottes glacées, les chasseurs humains découvrent que le prédateur utilise les températures négatives et les boyaux étroits pour tendre des embuscades sanglantes, forçant les mercenaires à affronter à la fois le froid polaire et la technologie de camouflage Yautja.",
    content: "Dans Predator: Hunters II (Chris Warner & Agustin Padilla / Dark Horse, 2018), l'équipe clandestine de Tyler Swain — formée de survivants d'attaques Yautja — traque un nouveau prédateur localisé dans les massifs montagneux d'Afghanistan. Au cœur de bunkers fortifiés de l'ère soviétique et d'un dédale de grottes glacées, les chasseurs humains découvrent que le prédateur utilise les températures négatives et les boyaux étroits pour tendre des embuscades sanglantes, forçant les mercenaires à affronter à la fois le froid polaire et la technologie de camouflage Yautja.",
    details: "Analyse balistique des fusils anti-matériel dans les cavernes afghanes, cartographie des bunkers soviétiques occupés par Stargazer et tactiques Yautja par grand froid.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_predator_hunters_2017']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['predatorArchives', 'thePredator2018', 'comicsDarkHorse1989'],
    canonicalPeriod: '2018',
    tags: Object.freeze(['afghanistan', 'hunters', 'stargazer', 'bunkers', 'montagnes']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_pred_hunters_iii_2020',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: Hunters III (2020 — Jungle d\'Amérique Centrale, Cartel de drogue, ruines précolombiennes & sanctuaire Yautja)',
    universe: 'PREDATOR',
    unlockCondition: "Neutraliser un chef de cartel dans un cénote sacré maya ou désactiver les pièges hydrographiques d'un sanctuaire ancestral",
    summary: "La traque au cœur de la jungle guatémaltèque où l'équipe Hunters affronte les tueurs d'un cartel et un Yautja ancestral protégeant un sanctuaire maya truffé de pièges.",
    body: "Dans Predator: Hunters III (Chris Warner & Brian Thies / Dark Horse, 2020), la piste d'un équipement Yautja ancestral conduit les survivants de Swain dans les forêts denses d'Amérique Centrale. Un cartel de narcotrafiquants surarmé a installé sa base arrière au-dessus d'un cénote sacrificiel maya abritant un sanctuaire de chasse Yautja vieux de plusieurs siècles. Pris en étau entre les tueurs à gages du cartel et un prédateur déterminé à protéger la sépulture et l'arsenal de ses ancêtres, l'affrontement tourne au jeu de massacre hydrographique.",
    content: "Dans Predator: Hunters III (Chris Warner & Brian Thies / Dark Horse, 2020), la piste d'un équipement Yautja ancestral conduit les survivants de Swain dans les forêts denses d'Amérique Centrale. Un cartel de narcotrafiquants surarmé a installé sa base arrière au-dessus d'un cénote sacrificiel maya abritant un sanctuaire de chasse Yautja vieux de plusieurs siècles. Pris en étau entre les tueurs à gages du cartel et un prédateur déterminé à protéger la sépulture et l'arsenal de ses ancêtres, l'affrontement tourne au jeu de massacre hydrographique.",
    details: "Réseau hydrologique des cénotes du Guatemala, tactiques de guérilla narco en milieu tropical et architecture des sanctuaires ancestraux Yautja.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_pred_hunters_ii_2018']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['predatorArchives', 'comicsDarkHorse1989'],
    canonicalPeriod: '2020',
    tags: Object.freeze(['guatemala', 'cartel', 'cenote', 'maya', 'sanctuaire']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_pred_eyes_of_the_demon_2022',
    entryType: 'codex',
    category: 'culture',
    title: 'Predator: Eyes of the Demon (2022 — Guerriers samouraïs Sengoku, raids vikings & tranchées de 1917)',
    universe: 'PREDATOR',
    unlockCondition: "Remporter un duel rituel à la lame face à un guerrier d'époque ou survivre au bombardement d'artillerie d'un no man's land",
    summary: "L'anthologie officielle Titan Books explorant les chasses Yautja à travers les âges : duels de samouraïs à l'ère Sengoku, raids de berserkers vikings et traque dans la boue de 1917.",
    body: "Sous la direction de Bryan Thomas Schmidt (Titan Books, 2022), l'anthologie Predator: Eyes of the Demon compile quinze récits canoniques illustrant la fascination millénaire des Yautja pour les guerriers d'élite humains. Des duels d'honneur au katana sous le shogunat Sengoku aux affrontements sanglants entre drakkars vikings et démons invisibles dans les fjords, jusqu'au carnage d'un chasseur opérant dans les tranchées de la Somme en 1917, ce recueil codifie la sélection des proies selon leur valeur martiale brute.",
    content: "Sous la direction de Bryan Thomas Schmidt (Titan Books, 2022), l'anthologie Predator: Eyes of the Demon compile quinze récits canoniques illustrant la fascination millénaire des Yautja pour les guerriers d'élite humains. Des duels d'honneur au katana sous le shogunat Sengoku aux affrontements sanglants entre drakkars vikings et démons invisibles dans les fjords, jusqu'au carnage d'un chasseur opérant dans les tranchées de la Somme en 1917, ce recueil codifie la sélection des proies selon leur valeur martiale brute.",
    details: "Analyse comparée des lames de katana forge acier face aux alliages Yautja, tactiques de siège viking et survie aux gaz asphyxiants de 1917.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_pred_if_it_bleeds_2017']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['predatorArchives', 'prey2022', 'comicsDarkHorse1989'],
    canonicalPeriod: 'Multi-époques (Ère Sengoku, IXe siècle, 1917)',
    tags: Object.freeze(['anthologie', 'samourai', 'viking', 'tranchees1917', 'titanbooks']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_pred_the_last_hunt_2023',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: The Last Hunt (2023 — Marvel Comics, Theta Berwick, traque trans-stellaire & cryogénie Yautja)',
    universe: 'PREDATOR',
    unlockCondition: "Survivre au dégel d'une réserve cryogénique trans-stellaire ou abattre un maître chasseur à bord d'un vaisseau-ruche Yautja",
    summary: "La quête vengeresse interstellaire de Theta Berwick traquant méthodiquement les Yautja à travers les quadrants galactiques jusqu'au vaisseau de préservation cryogénique.",
    body: "Dans la saga Marvel Comics orchestrée par Ed Brisson (2023), Theta Berwick poursuit sa croisade sanglante contre l'espèce Yautja après le massacre de sa famille. Sillonnant l'espace lointain à bord de son vaisseau de chasse reconfiguré, elle découvre une station de stase cryogénique où les prédateurs conservent des champions de centaines d'espèces extraterrestres congelés pour des chasses futures. Theta infiltre le vaisseau-ruche, affrontant des guerriers d'élite et libérant des proies captives pour semer un chaos sans précédent.",
    content: "Dans la saga Marvel Comics orchestrée par Ed Brisson (2023), Theta Berwick poursuit sa croisade sanglante contre l'espèce Yautja après le massacre de sa famille. Sillonnant l'espace lointain à bord de son vaisseau de chasse reconfiguré, elle découvre une station de stase cryogénique où les prédateurs conservent des champions de centaines d'espèces extraterrestres congelés pour des chasses futures. Theta infiltre le vaisseau-ruche, affrontant des guerriers d'élite et libérant des proies captives pour semer un chaos sans précédent.",
    details: "Technologies de conservation cryogénique des vaisseaux Yautja, profil tactique de Theta Berwick et arsenal de survie adapté.",
    crossLinks: Object.freeze(['technologie-flotte-vaisseaux-mothership-juggernaut', 'culture-code-de-la-chasse']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['predatorArchives', 'thePredator2018'],
    canonicalPeriod: '2056',
    tags: Object.freeze(['marvel', 'theta_berwick', 'cryogenie', 'vaisseau_ruche', 'croisade']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_alien_berserker_max_1995',
    entryType: 'codex',
    category: 'technologie',
    title: 'Aliens: Berserker / Frenzy (1995 — Exosquelette lourd M.A.X., station Nemesis & neuro-drogue berserker)',
    universe: 'ALIEN',
    unlockCondition: "Piloter une armure assistée M.A.X. jusqu'à saturation thermique ou repousser une nuée sous perfusion neuro-stimulante",
    summary: "Le déploiement de l'exosquelette de combat Mobile Assault X-Skelly (M.A.X.) sur la station minière Nemesis par une escouade suicide sous neuro-drogues pour éradiquer une ruche.",
    body: "Dans Aliens: Berserker (John Wagner & Paul Mendoza / Dark Horse, 1995), une équipe de repris de justice et de soldats condamnés est injectée de cocktails neuro-stimulants ultra-agressifs pour piloter les combinaisons d'assaut blindées M.A.X. (Mobile Assault X-Skelly). Envoyée sur la station Nemesis envahie par un essaim xénomorphe colossal, cette escouade suicide déchaîne des canons rotatifs à plasma et des griffes hydrauliques dans un état de transe berserker dévastatrice, où l'espérance de vie du pilote ne dépasse pas quelques heures.",
    content: "Dans Aliens: Berserker (John Wagner & Paul Mendoza / Dark Horse, 1995), une équipe de repris de justice et de soldats condamnés est injectée de cocktails neuro-stimulants ultra-agressifs pour piloter les combinaisons d'assaut blindées M.A.X. (Mobile Assault X-Skelly). Envoyée sur la station Nemesis envahie par un essaim xénomorphe colossal, cette escouade suicide déchaîne des canons rotatifs à plasma et des griffes hydrauliques dans un état de transe berserker dévastatrice, où l'espérance de vie du pilote ne dépasse pas quelques heures.",
    details: "Spécifications de blindage de l'exosquelette M.A.X., formule biochimique de la neuro-drogue Berserker et protocole de purge Nemesis.",
    crossLinks: Object.freeze(['technologie-arsenal-colonial-marines-uscm', 'lore_alien_stronghold_jeri_1994']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'aliens1986'],
    canonicalPeriod: '2195',
    tags: Object.freeze(['berserker', 'max', 'exosquelette', 'nemesis', 'neurodrogue']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_alien_havoc_hive_1997',
    entryType: 'codex',
    category: 'biologie',
    title: 'Aliens: Havoc (1997 — Cauchemars télépathiques, résonance synaptique de la Ruche & folie collective)',
    universe: 'ALIEN',
    unlockCondition: "Résister à la distorsion synaptique d'une reine ou décrypter le signal télépathique de la ruche dans les banques mémorielles d'un androïde",
    summary: "L'étude des ondes psychiques et des résonances synaptiques émises par les Reines Xénomorphes provoquant des cauchemars collectifs et la folie des équipages.",
    body: "Publié chez Dark Horse Comics en 1997 sous la houlette de Mark Schultz, Aliens: Havoc documente les effets débilitants de la proximité d'une ruche mature sur l'esprit humain et les circuits logiques synthétiques. Les Reines émettent des impulsions bio-électromagnétiques de basse fréquence qui pénètrent les cloisons blindées, induisant des hallucinations terrifiantes, des impulsions suicidaires et une résonance cérébrale où les proies entendent l'appel de ponte avant même l'éclosion des ovomorphes.",
    content: "Publié chez Dark Horse Comics en 1997 sous la houlette de Mark Schultz, Aliens: Havoc documente les effets débilitants de la proximité d'une ruche mature sur l'esprit humain et les circuits logiques synthétiques. Les Reines émettent des impulsions bio-électromagnétiques de basse fréquence qui pénètrent les cloisons blindées, induisant des hallucinations terrifiantes, des impulsions suicidaires et une résonance cérébrale où les proies entendent l'appel de ponte avant même l'éclosion des ovomorphes.",
    details: "Spectrométrie des ondes cérébrales de ruche, vulnérabilité des synthétiques aux interférences psioniques et traitements neurologiques d'urgence.",
    crossLinks: Object.freeze(['biologie-reine-ovomorphes-cycle-parasitaire', 'science-generations-synthetiques-androides']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['comicsDarkHorse1989', 'aliens1986'],
    canonicalPeriod: '2197',
    tags: Object.freeze(['havoc', 'telepathie', 'folie_collective', 'ondes_synaptiques', 'reine']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_alien_colony_war_2022',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Alien: Colony War (2022 — Roman canonique David Barnett, guerre froide UPP vs Weyland-Yutani & Chernyakhovsk)',
    universe: 'ALIEN',
    unlockCondition: "Infiltrer le périmètre militarisé de l'UPP ou neutraliser un lot de vecteurs xénomorphes militarisés",
    summary: "Le roman officiel de David Barnett dépeignant l'escalade de la guerre froide entre l'Union des Peuples Progressistes (UPP) et Weyland-Yutani autour de colonies agricoles empoisonnées.",
    body: "Dans le roman canonique Alien: Colony War (Titan Books, 2022), l'auteur David Barnett explore les tensions géopolitiques spatiales entre la Weyland-Yutani Corporation, les Colonial Marines et l'Union of Progressive Peoples (UPP). Sur la colonie agricole de Chernyakhovsk et les stations de recherche frontalières, des cargaisons secrètes d'ovomorphes militarisés et de dérivés du pathogène noir sont manipulées par les services secrets pour déclencher des guerres asymétriques, menant à une contagion biochimique incontrôlable.",
    content: "Dans le roman canonique Alien: Colony War (Titan Books, 2022), l'auteur David Barnett explore les tensions géopolitiques spatiales entre la Weyland-Yutani Corporation, les Colonial Marines et l'Union of Progressive Peoples (UPP). Sur la colonie agricole de Chernyakhovsk et les stations de recherche frontalières, des cargaisons secrètes d'ovomorphes militarisés et de dérivés du pathogène noir sont manipulées par les services secrets pour déclencher des guerres asymétriques, menant à une contagion biochimique incontrôlable.",
    details: "Doctrines militaires de l'UPP, logistique clandestine de Weyland-Yutani et impact des armes biologiques sur les colonies civiles frontalières.",
    crossLinks: Object.freeze(['culture-rivalite-weyland-yutani-conglomerats', 'technologie-arsenal-colonial-marines-uscm']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['aliens1986', 'comicsDarkHorse1989', 'aliensFireteamElite2021'],
    canonicalPeriod: '2186',
    tags: Object.freeze(['upp', 'guerre_froide', 'chernyakhovsk', 'david_barnett', 'titanbooks']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_alien_infernos_fall_2022',
    entryType: 'codex',
    category: 'biologie',
    title: 'Alien: Inferno\'s Fall (2022 — Raffinerie de Shan Shen, Philippa Ballantine, spore pathogène & décontamination)',
    universe: 'ALIEN',
    unlockCondition: "Purifier un silo contaminé aux spores mutagènes ou éliminer un runner muté dans les galeries de craquage",
    summary: "Le roman canonique de Philippa Ballantine où la colonie minière de Shan Shen est ravagée par une retombée de spores pathogènes de l'Agent Noir et des nuées d'hybrides furieux.",
    body: "Dans Alien: Inferno's Fall (Titan Books / Philippa Ballantine, 2022), la lune minière industrielle de Shan Shen, exploitée pour ses gisements rares sous protectorat de l'UPP et de cartels indépendants, subit une contamination foudroyante lorsqu'un artefact contenant le liquide noir des Ingénieurs est brisé. Les ouvriers et mineurs sont infectés par des aérosols de spores, engendrant des xénomorphes Runners ultra-agressifs et des mutations aberrantes, tandis qu'un détachement de décontamination tente désespérément de vitrifier la raffinerie.",
    content: "Dans Alien: Inferno's Fall (Titan Books / Philippa Ballantine, 2022), la lune minière industrielle de Shan Shen, exploitée pour ses gisements rares sous protectorat de l'UPP et de cartels indépendants, subit une contamination foudroyante lorsqu'un artefact contenant le liquide noir des Ingénieurs est brisé. Les ouvriers et mineurs sont infectés par des aérosols de spores, engendrant des xénomorphes Runners ultra-agressifs et des mutations aberrantes, tandis qu'un détachement de décontamination tente désespérément de vitrifier la raffinerie.",
    details: "Cinétique de dispersion des spores mutagènes en milieu atmosphérique raréfié, protocole de décontamination thermique Shan Shen et anatomie des Runners de raffinerie.",
    crossLinks: Object.freeze(['biologie-pathogene-noir-accelerateur-adn', 'lore_alien_colony_war_2022']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['aliens1986', 'prometheus2012', 'aliensFireteamElite2021'],
    canonicalPeriod: '2192',
    tags: Object.freeze(['shan_shen', 'infernos_fall', 'spores', 'agent_noir', 'philippa_ballantine']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_avp_deadliest_species_1993',
    entryType: 'codex',
    category: 'chroniques',
    title: 'AVP: Deadliest of the Species (1993-1995 — Chris Claremont & Jackson Guice, Caryn Delacroix, Big Mama & Toyo Harada)',
    universe: 'AVP',
    unlockCondition: "Surpasser un cyborg d'assaut Harada Zaibatsu ou forger une trêve d'honneur avec une matriarche chasseresse Yautja",
    summary: "La fresque épique de Chris Claremont et Jackson Guice réunissant Caryn Delacroix, l'IA Toy et la mythique chasseresse Yautja Big Mama contre les mégacorporations corrompues.",
    body: "Monstre sacré de la bande dessinée paru entre 1993 et 1995 chez Dark Horse Comics, Aliens vs. Predator: Deadliest of the Species est écrit par le légendaire Chris Claremont et peint avec virtuosité par Jackson Guice. Dans un futur cyberpunk où les corporations comme Montcalm-Delacroix et le Zaibatsu de Toyo Harada manipulent des armées de cyborgs et des souches xénomorphes captives, la fugitive Caryn Delacroix s'allie à Big Mama, une chasseresse Yautja solitaire vêtue d'armures cérémonielles dorées. Ensemble, elles mènent une croisade sans merci au cœur des stations orbitales de la haute société.",
    content: "Monstre sacré de la bande dessinée paru entre 1993 et 1995 chez Dark Horse Comics, Aliens vs. Predator: Deadliest of the Species est écrit par le légendaire Chris Claremont et peint avec virtuosité par Jackson Guice. Dans un futur cyberpunk où les corporations comme Montcalm-Delacroix et le Zaibatsu de Toyo Harada manipulent des armées de cyborgs et des souches xénomorphes captives, la fugitive Caryn Delacroix s'allie à Big Mama, une chasseresse Yautja solitaire vêtue d'armures cérémonielles dorées. Ensemble, elles mènent une croisade sans merci au cœur des stations orbitales de la haute société.",
    details: "Profil de combat et armure cérémonielle de Big Mama, arsenal cybernétique du Toyo Harada Zaibatsu et architecture de l'habitat Samara Ring.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_avp_original_prey_1990']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'comicsDarkHorse1989', 'predatorArchives'],
    canonicalPeriod: '2193-2195',
    tags: Object.freeze(['claremont', 'jackson_guice', 'big_mama', 'caryn_delacroix', 'samara_ring']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_avp_sand_trap_2007',
    entryType: 'codex',
    category: 'chroniques',
    title: 'AVP: Sand Trap (2007 — Désert de Ryushi, dunes brûlantes, Special Forces US & embuscade sous les sables)',
    universe: 'AVP',
    unlockCondition: "Repérer une cible camouflée sous les dunes mouvantes ou neutraliser un nid xénomorphe enfoui dans le sable",
    summary: "Le récit de chasse impitoyable où des forces spéciales humaines et un commando Yautja s'affrontent sur les dunes de Ryushi face à des prédateurs enfouis dans les sables.",
    body: "Dans le récit AVP: Sand Trap (revisité dans les anthologies Dark Horse en 2007), les déserts torrides de Ryushi deviennent le théâtre d'un jeu du chat et de la souris mortel. Une patrouille d'opérateurs des forces spéciales est prise en embuscade par un traqueur Yautja exploitant la réfraction thermique du soleil sur le quartz. Mais le véritable danger émane des profondeurs : une souche de xénomorphes fossiles s'est adaptée à la poussière minérale, surgissant des dunes comme des scorpions géants pour happer combattants humains et chasseurs Yautja dans les gouffres souterrains.",
    content: "Dans le récit AVP: Sand Trap (revisité dans les anthologies Dark Horse en 2007), les déserts torrides de Ryushi deviennent le théâtre d'un jeu du chat et de la souris mortel. Une patrouille d'opérateurs des forces spéciales est prise en embuscade par un traqueur Yautja exploitant la réfraction thermique du soleil sur le quartz. Mais le véritable danger émane des profondeurs : une souche de xénomorphes fossiles s'est adaptée à la poussière minérale, surgissant des dunes comme des scorpions géants pour happer combattants humains et chasseurs Yautja dans les gouffres souterrains.",
    details: "Physique du déplacement sur sables mouvants siliceux, balistique des munitions lourdes face au vent de poussière et détection thermique Yautja en désert.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_avp_original_prey_1990']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'predatorArchives', 'aliens1986'],
    canonicalPeriod: '2007',
    tags: Object.freeze(['sand_trap', 'ryushi', 'dunes', 'forces_speciales', 'embuscade_sable']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_avp_three_world_killer_clan_2010',
    entryType: 'codex',
    category: 'chroniques',
    title: 'AVP: Three World War — Le Clan Tueur (2010 — Randy Stradley & Rick Leonardi, Caparis VII & Chiens de Guerre Xénos)',
    universe: 'AVP',
    unlockCondition: "Neutraliser un Bad Blood du Killer Clan sur Caparis VII ou briser la laisse à impulsion d'un xénomorphe asservi",
    summary: "L'enquête approfondie sur le Killer Clan de Caparis VII, une caste de renégats parias brisant le Code d'Honneur en asservissant des xénomorphes avec des brides neuronales.",
    body: "Dans la saga monumentale Aliens vs. Predator: Three World War (Randy Stradley & Rick Leonardi / Dark Horse, 2010), la paix fragile de la galaxie est anéantie par l'émergence du Killer Clan sur la planète aride de Caparis VII. Ces renégats Yautja ont développé des brides de soumission neuro-synaptiques et des laisses barbelées, forçant des meutes entières de Xénomorphes et de molosses à se battre sous leurs ordres. Cette hérésie absolue provoque une alliance inédite : Machiko Noguchi négocie une trêve de sang entre les guerriers d'élite de Yautja Prime et les bataillons de Colonial Marines pour exterminer conjointement ces parias sans honneur.",
    content: "Dans la saga monumentale Aliens vs. Predator: Three World War (Randy Stradley & Rick Leonardi / Dark Horse, 2010), la paix fragile de la galaxie est anéantie par l'émergence du Killer Clan sur la planète aride de Caparis VII. Ces renégats Yautja ont développé des brides de soumission neuro-synaptiques et des laisses barbelées, forçant des meutes entières de Xénomorphes et de molosses à se battre sous leurs ordres. Cette hérésie absolue provoque une alliance inédite : Machiko Noguchi négocie une trêve de sang entre les guerriers d'élite de Yautja Prime et les bataillons de Colonial Marines pour exterminer conjointement ces parias sans honneur.",
    details: "Fonctionnement des brides neuro-synaptiques de soumission xénomorphe, organisation clanique des Killer Bad Bloods et carrières rocheuses de Caparis VII.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_avp_three_world_war_2010']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'avpPreyOmnibus', 'comicsDarkHorse1989'],
    canonicalPeriod: '2194',
    tags: Object.freeze(['killer_clan', 'three_world_war', 'caparis_vii', 'chiens_de_guerre', 'machiko']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_avp_rift_war_2022',
    entryType: 'codex',
    category: 'chroniques',
    title: 'AVP: Rift War (2022 — Weston Ochse, monde colonie Eidolon, synthetics renégats & guerre tripartite)',
    universe: 'AVP',
    unlockCondition: "Triompher d'une mêlée à trois factions sur Eidolon ou détruire un terminal d'éveil d'une armée synthétique renégate",
    summary: "Le roman officiel Titan Books par Weston Ochse où la planète colonie minière Eidolon devient le vortex d'une guerre tripartite totale entre Marines, Yautja et essaim xéno.",
    body: "Dans AVP: Rift War (Weston Ochse / Titan Books, 2022), la lune minière isolée d'Eidolon abrite une faille technologique et biologique convoitée par toutes les puissances de la galaxie. Une colonie de synthetics dissidents réactive des couveuses xénomorphes pour sécuriser leur indépendance, attirant un vaisseau de guerre Yautja venu purger l'affront et un corps expéditionnaire des Colonial Marines dépêché pour sécuriser les concessions d'extraction. La guerre tripartite embrase la surface planétaire dans un cataclysme de plasma, d'acide et d'obus explosifs.",
    content: "Dans AVP: Rift War (Weston Ochse / Titan Books, 2022), la lune minière isolée d'Eidolon abrite une faille technologique et biologique convoitée par toutes les puissances de la galaxie. Une colonie de synthetics dissidents réactive des couveuses xénomorphes pour sécuriser leur indépendance, attirant un vaisseau de guerre Yautja venu purger l'affront et un corps expéditionnaire des Colonial Marines dépêché pour sécuriser les concessions d'extraction. La guerre tripartite embrase la surface planétaire dans un cataclysme de plasma, d'acide et d'obus explosifs.",
    details: "Topographie des failles géologiques d'Eidolon, logistique des bataillons coloniaux sous siège et comportement des essaims réveillés par synthèse numérique.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_alien_colony_war_2022']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'aliens1986', 'predatorArchives'],
    canonicalPeriod: '2217',
    tags: Object.freeze(['rift_war', 'eidolon', 'weston_ochse', 'guerre_tripartite', 'titanbooks']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_pred_turnabout_2008',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: Turnabout (2008 — Steve Perry, Montagnes Rocheuses, sniper aveugle Ray Vance & traque boréale)',
    universe: 'PREDATOR',
    unlockCondition: "Neutraliser une cible d'élite à longue distance sans acquisition thermique ou remporter une traque acoustique en forêt boréale",
    summary: "Roman captivant de Steve Perry opposant un Yautja vétéran à Ray Vance, un ancien tireur d'élite devenu aveugle qui utilise l'ouïe et des pièges acoustiques pour inverser la traque.",
    body: "Dans Predator: Turnabout (Steve Perry, 2008), le chasseur Yautja atterrit dans l'immensité sauvage et escarpée des Rocheuses canadiennes. Confronté à Ray Vance, ancien ranger et tireur d'élite blessé de guerre ayant perdu la vue, le duel transcende la vision spectrale habituelle. Vance compense sa cécité par une acuité auditive surdéveloppée, tendant des cordes de résonance, des pièges à écho et exploitant le souffle du vent pour déjouer le camouflage optique, forçant le Yautja à un respect rituel et à un combat de pure géométrie spatiale.",
    content: "Dans Predator: Turnabout (Steve Perry, 2008), le chasseur Yautja atterrit dans l'immensité sauvage et escarpée des Rocheuses canadiennes. Confronté à Ray Vance, ancien ranger et tireur d'élite blessé de guerre ayant perdu la vue, le duel transcende la vision spectrale habituelle. Vance compense sa cécité par une acuité auditive surdéveloppée, tendant des cordes de résonance, des pièges à écho et exploitant le souffle du vent pour déjouer le camouflage optique, forçant le Yautja à un respect rituel et à un combat de pure géométrie spatiale.",
    details: "Balistique des calibres de chasse nord-américains, modélisation des échos de canopée et tactiques d'inversion prédateur/proie sans capteurs électro-optiques.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_pred_if_it_bleeds_2017']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['predatorArchives', 'predator1987'],
    canonicalPeriod: '2008',
    tags: Object.freeze(['turnabout', 'steve_perry', 'ray_vance', 'rocheuses', 'pieges_acoustiques']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_pred_badlands_2025',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: Badlands (2025 — Dan Trachtenberg, Genna, androïde Thia, clan paria & technologie hybride)',
    universe: 'PREDATOR',
    unlockCondition: "Survivre aux tempêtes de Genna et vaincre un guerrier Yautja doté d'armements composites biomécaniques",
    summary: "Le long-métrage novateur de Dan Trachtenberg explorant les Terres Mortes de Genna, les jumelles synthétiques Thia et Tessa, et un chasseur Yautja exclu luttant pour sa rédemption.",
    body: "Predator: Badlands (Dan Trachtenberg, 2025) projette la saga dans un futur sauvage sur le monde mortel de Genna. Au cœur d'une végétation carnivore et de super-prédateurs régénérants comme le Kalisk, deux sœurs androïdes synthétiques croisent la trajectoire d'un Yautja paria déchu de son clan. Dépourvu du soutien de son vaisseau-mère, ce chasseur solitaire forge des armes hybrides intégrant les tissus de la faune locale et des composants cybernétiques pour reconquérir son honneur rituel.",
    content: "Predator: Badlands (Dan Trachtenberg, 2025) projette la saga dans un futur sauvage sur le monde mortel de Genna. Au cœur d'une végétation carnivore et de super-prédateurs régénérants comme le Kalisk, deux sœurs androïdes synthétiques croisent la trajectoire d'un Yautja paria déchu de son clan. Dépourvu du soutien de son vaisseau-mère, ce chasseur solitaire forge des armes hybrides intégrant les tissus de la faune locale et des composants cybernétiques pour reconquérir son honneur rituel.",
    details: "Écosystème hyper-compétitif de Genna, physiologie adaptative du Kalisk et mécanismes de rétro-ingénierie Yautja sur technologies synthétiques.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'genna_deathworld']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['badlands2025', 'predatorArchives'],
    canonicalPeriod: '2025',
    tags: Object.freeze(['badlands', 'dan_trachtenberg', 'genna', 'thia_tessa', 'yautja_paria']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_pred_concrete_jungle_1989',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: Concrete Jungle (1989 — Mark Verheiden, New York sous canicule & détective John Schaefer)',
    universe: 'PREDATOR',
    unlockCondition: "Abattre 15 cibles urbaines en milieu vertical lors d'une canicule extrême",
    summary: "La mini-série séminale de Dark Horse Comics par Mark Verheiden et Chris Warner instaurant John Schaefer, le frère de Dutch, face à la première invasion Yautja à Manhattan.",
    body: "Véritable pierre angulaire du lore étendu en 1989, Predator: Concrete Jungle transporte la chasse rituelle dans la métropole suffocante de New York pendant une canicule record. Le lieutenant de police John Schaefer découvre la signature des chasseurs d'étoiles au milieu d'une guerre de cartels de la drogue. Le récit établit les codes du camouflage urbain, les perchoirs sur gargouilles et la coopération contrainte entre forces de l'ordre et agences fédérales pour endiguer la moisson de trophées.",
    content: "Véritable pierre angulaire du lore étendu en 1989, Predator: Concrete Jungle transporte la chasse rituelle dans la métropole suffocante de New York pendant une canicule record. Le lieutenant de police John Schaefer découvre la signature des chasseurs d'étoiles au milieu d'une guerre de cartels de la drogue. Le récit établit les codes du camouflage urbain, les perchoirs sur gargouilles et la coopération contrainte entre forces de l'ordre et agences fédérales pour endiguer la moisson de trophées.",
    details: "Traque verticale sur gratte-ciels, balistique urbaine contre blindage Yautja et genèse des protocoles d'investigation Schaefer.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_pred_south_china_sea_2008']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['predatorArchives', 'predator1987'],
    canonicalPeriod: '1989',
    tags: Object.freeze(['concrete_jungle', 'john_schaefer', 'new_york', 'canicule', 'mark_verheiden']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_pred_blood_on_two_earths_2001',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: Blood on Two Earths (2001 — Front Ouest 1916, tranchées de la Somme & No Man\'s Land)',
    universe: 'PREDATOR',
    unlockCondition: "Effectuer un trophée honorable dans une zone saturée de bombardements d'artillerie lourde",
    summary: "Récit d'anthologie marquant où un guerrier Yautja choisit le carnage de la Première Guerre Mondiale pour chasser les tireurs d'élite et officiers au cœur du No Man's Land boueux.",
    body: "Dans les tranchées dévastées du Front Ouest en 1916, sous des pluies d'obus et les nappes de gaz moutarde, la présence d'un prédateur extraterrestre transforme le cauchemar de la guerre de position en traque mythique. Camouflé au milieu des barbelés et des cratères d'obus de la Somme, le Yautja cible méthodiquement les soldats les plus aguerris des deux camps, ignorant les blessés et mourants pour ne prélever que les crânes des survivants des assauts à la baïonnette.",
    content: "Dans les tranchées dévastées du Front Ouest en 1916, sous des pluies d'obus et les nappes de gaz moutarde, la présence d'un prédateur extraterrestre transforme le cauchemar de la guerre de position en traque mythique. Camouflé au milieu des barbelés et des cratères d'obus de la Somme, le Yautja cible méthodiquement les soldats les plus aguerris des deux camps, ignorant les blessés et mourants pour ne prélever que les crânes des survivants des assauts à la baïonnette.",
    details: "Résistance des bio-masques aux gaz toxiques de combat, tactiques de harcèlement dans la boue et neutralisation d'escouades retranchées.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_pred_eyes_of_the_demon_2022']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['predatorArchives', 'predator1987'],
    canonicalPeriod: '1916',
    tags: Object.freeze(['somme_1916', 'tranchees', 'no_mans_land', 'gaz_moutarde', 'premiere_guerre']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_alien_isolation_blackout_2019',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Alien: Blackout (2019 — Amanda Ripley, station de recherche Mendel, conduits d\'urgence & surveillance)',
    universe: 'ALIEN',
    unlockCondition: "Guider des survivants à travers un secteur infesté en verrouillant les sas et portes blindées",
    summary: "La suite canonique d'Alien: Isolation suivant Amanda Ripley isolée dans les conduits de la station de recherche Mendel, dirigeant l'équipage via le réseau de caméras sous coupure de courant.",
    body: "Situé peu après les événements de Sébastopol, Alien: Blackout (D3 Go! / 20th Century Fox, 2019) met en scène Amanda Ripley piégée à bord de la station de recherche Weyland-Yutani Mendel. Alors qu'un Xénomorphe traque les derniers rescapés d'un vaisseau de sauvetage amarré, Amanda doit gérer l'énergie d'urgence limitée pour activer capteurs de mouvement, fermetures de sas et caméras, tout en se dissimulant dans des gaines d'aération étroites où chaque bruit de pas résonne mortellement.",
    content: "Situé peu après les événements de Sébastopol, Alien: Blackout (D3 Go! / 20th Century Fox, 2019) met en scène Amanda Ripley piégée à bord de la station de recherche Weyland-Yutani Mendel. Alors qu'un Xénomorphe traque les derniers rescapés d'un vaisseau de sauvetage amarré, Amanda doit gérer l'énergie d'urgence limitée pour activer capteurs de mouvement, fermetures de sas et caméras, tout en se dissimulant dans des gaines d'aération étroites où chaque bruit de pas résonne mortellement.",
    details: "Architecture des conduits de ventilation Weyland-Yutani, gestion rationnée des relais électriques et acoustique de furtivité face aux drones xénomorphes.",
    crossLinks: Object.freeze(['alien-morphologie-drone', 'lore_alien_isolation_nostromo']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['alien1979', 'aliens1986'],
    canonicalPeriod: '2137',
    tags: Object.freeze(['blackout', 'amanda_ripley', 'station_mendel', 'conduits', 'surveillance_sas']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_alien_dark_descent_leto_2023',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Aliens: Dark Descent (2023 — Planète Leto, protocole Cerberus, culte darwiniste & station Pioneer)',
    universe: 'ALIEN',
    unlockCondition: "Évacuer une escouade complète sous protocole Cerberus sans perdre un seul opérateur face à l'essaim",
    summary: "Le jeu tactique acclamé de Tindalos Interactive dépeignant la mise sous quarantaine orbitale de la planète minière Leto, les cultistes de l'Infestation et la chute de la station spatiale Pioneer.",
    body: "Dans Aliens: Dark Descent (2023), l'administrateur Maeko Hayes et le sergent Jonas Harper tentent d'endiguer une épidémie xénomorphe catastrophique déclenchée par un culte darwiniste fanatique sur la lune Leto. Le protocole Cerberus, verrou de défense planétaire automatisé, abat tout vaisseau tentant de fuir. Les Colonial Marines de l'USS Otago doivent déployer des tourelles sentinelles, souder des portes et gérer le stress psychologique intense face à une ruche organisée comptant Praetorians, Facehuggers et une Reine millénaire.",
    content: "Dans Aliens: Dark Descent (2023), l'administrateur Maeko Hayes et le sergent Jonas Harper tentent d'endiguer une épidémie xénomorphe catastrophique déclenchée par un culte darwiniste fanatique sur la lune Leto. Le protocole Cerberus, verrou de défense planétaire automatisé, abat tout vaisseau tentant de fuir. Les Colonial Marines de l'USS Otago doivent déployer des tourelles sentinelles, souder des portes et gérer le stress psychologique intense face à une ruche organisée comptant Praetorians, Facehuggers et une Reine millénaire.",
    details: "Logistique tactique des balises de détection, tourelles UA 571-C, mécanismes de panique nerveuse et entomologie des gardes prétoriens.",
    crossLinks: Object.freeze(['uscm-doctrine-tactique', 'lore_alien_dark_descent_cerberus_2023']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['aliens1986', 'alien1979'],
    canonicalPeriod: '2198',
    tags: Object.freeze(['dark_descent', 'leto', 'cerberus', 'pioneer_station', 'culte_infestation']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_alien_prototype_2019',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Alien: Prototype (2019 — Tim Waggoner, complexe Venture, colonie Jericho 3 & souche nécrotique)',
    universe: 'ALIEN',
    unlockCondition: "Terrasser un xénomorphe génétiquement altéré sécrétant des toxines nécrotiques",
    summary: "Roman canonique de Tim Waggoner chez Titan Books explorant une souche xénomorphe mutée issue des recherches corporatistes de Venture Computers sur la colonie minière Jericho 3.",
    body: "Alien: Prototype (Tim Waggoner, 2019) suit l'ex-lieutenant de la sécurité corporatiste Zula Hendricks dans sa tentative de déjouer un vol d'échantillon biologique sur la colonie industrielle Jericho 3. Le Xénomorphe né de cette souche expérimentale présente une physiologie aberrante : son organisme est porteur d'une nécrose cellulaire foudroyante qui contamine les tissus vivants avant même l'implantation de la larve, rendant tout contact au corps à corps mortellement corrosif.",
    content: "Alien: Prototype (Tim Waggoner, 2019) suit l'ex-lieutenant de la sécurité corporatiste Zula Hendricks dans sa tentative de déjouer un vol d'échantillon biologique sur la colonie industrielle Jericho 3. Le Xénomorphe né de cette souche expérimentale présente une physiologie aberrante : son organisme est porteur d'une nécrose cellulaire foudroyante qui contamine les tissus vivants avant même l'implantation de la larve, rendant tout contact au corps à corps mortellement corrosif.",
    details: "Pathologie cellulaire de la souche Jericho, militarisation des armes chimiques par la division Venture et tactiques de confinement chirurgical.",
    crossLinks: Object.freeze(['alien-morphologie-warrior', 'lore_alien_defiance_zula_2016']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['aliens1986', 'alien1979'],
    canonicalPeriod: '2160',
    tags: Object.freeze(['prototype', 'tim_waggoner', 'jericho_3', 'zula_hendricks', 'necrose_cellulaire']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_alien_infiltrator_2021',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Aliens: Infiltrator (2021 — Weston Ochse, station San Carlos, Dr. Hoenikker & souches Fireteam)',
    universe: 'ALIEN',
    unlockCondition: "Sécuriser les journaux de laboratoire du Dr. Hoenikker avant la submersion complète de la station",
    summary: "Roman prologue officiel du jeu vidéo Aliens: Fireteam Elite par Weston Ochse, détaillant la corruption du personnel de la station de recherche San Carlos et l'essor de la Ruche Katanga.",
    body: "Dans Aliens: Infiltrator (Weston Ochse, 2021), la station spatiale secrète Pala (San Carlos) de Weyland-Yutani conduit des expériences d'hybridation génétique sous la direction du Dr. Timothy Hoenikker. En exposant des embryons xénomorphes au pathogène mutagène des Ingénieurs, les scientifiques créent sans le mesurer des variantes d'élite — Spitters, Bursters et Prowlers. La rupture de confinement initiale entraîne la purge méthodique du personnel et prépare le terrain pour l'arrivée de l'USS Endeavor.",
    content: "Dans Aliens: Infiltrator (Weston Ochse, 2021), la station spatiale secrète Pala (San Carlos) de Weyland-Yutani conduit des expériences d'hybridation génétique sous la direction du Dr. Timothy Hoenikker. En exposant des embryons xénomorphes au pathogène mutagène des Ingénieurs, les scientifiques créent sans le mesurer des variantes d'élite — Spitters, Bursters et Prowlers. La rupture de confinement initiale entraîne la purge méthodique du personnel et prépare le terrain pour l'arrivée de l'USS Endeavor.",
    details: "Génétique mutagène accélérée par fluide noir, comportement des spécimens d'assaut et protocole d'évacuation d'urgence de San Carlos.",
    crossLinks: Object.freeze(['alien-morphologie-praetorian', 'lore_alien_fireteam_elite_2021']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['aliens1986', 'prometheus2012'],
    canonicalPeriod: '2202',
    tags: Object.freeze(['infiltrator', 'weston_ochse', 'san_carlos', 'dr_hoenikker', 'fireteam_elite_prequel']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_avp_extinction_event_2003',
    entryType: 'codex',
    category: 'chroniques',
    title: 'AVP: Extinction (2003 — Planète LV-742, guerre tripartite, caste Ravager & synthétiques K-Series)',
    universe: 'AVP',
    unlockCondition: "Anéantir un détachement de clones K-Series ou détruire un nid de Ravagers sur LV-742",
    summary: "Le jeu de stratégie temps réel culte sur console par Zono / Electronic Arts mettant en scène la guerre à trois factions sur la planète LV-742 et l'apparition de castes mutantes inédites.",
    body: "Aliens versus Predator: Extinction (2003) se déroule sur le monde désolé et minéral de LV-742. La corporation Weyland-Yutani y développe les synthétiques et xénomorphes clonés K-Series pour contourner l'hostilité de la Ruche pure, déclenchant l'intervention simultanée de la force expéditionnaire USCM et d'un Clan d'Élite Yautja. La ruche répond par des mutations massives dont les terrifiants Ravagers armés de lames chitineuses géantes et les Carrier Xenomorphs transportant des Facehuggers en combat actif.",
    content: "Aliens versus Predator: Extinction (2003) se déroule sur le monde désolé et minéral de LV-742. La corporation Weyland-Yutani y développe les synthétiques et xénomorphes clonés K-Series pour contourner l'hostilité de la Ruche pure, déclenchant l'intervention simultanée de la force expéditionnaire USCM et d'un Clan d'Élite Yautja. La ruche répond par des mutations massives dont les terrifiants Ravagers armés de lames chitineuses géantes et les Carrier Xenomorphs transportant des Facehuggers en combat actif.",
    details: "Spécifications de la caste Ravager, protocoles de piratage synthétique K-Series et équipement de siège lourd Yautja (Disque à plasma lourd et lance-harpon électrique).",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_avp_extinction_lv742_2003']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'aliens1986', 'predatorArchives'],
    canonicalPeriod: '2179',
    tags: Object.freeze(['extinction_2003', 'lv742', 'ravager', 'kseries', 'zono_ea']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_avp_primal_hunt_2002',
    entryType: 'codex',
    category: 'chroniques',
    title: 'AVP2: Primal Hunt (2002 — Planète LV-1201, artefact énergétique antique & chasseur en stase)',
    universe: 'AVP',
    unlockCondition: "Récupérer un artefact de confinement Yautja vieux de 500 ans dans les ruines de LV-1201",
    summary: "L'extension officielle de Monolith / Third Law Interactive explorant les origines de la station de recherche de LV-1201 et le réveil d'un prédateur antique ayant survécu cinq siècles en stase temporelle.",
    body: "Dans Aliens versus Predator 2: Primal Hunt (2002), l'intrigue remonte au début du XVIIIe siècle lorsqu'un Chasseur Ancien découvre un artefact capable de repousser et de paralyser les Xénomorphes sur LV-1201. Piégé dans un champ de stase stasique protecteur pendant cinq cents ans après avoir été attaqué par un Facehugger, son réveil accidentel par la mercenaire Dunya en 2222 relance une chasse cataclysmique où passé colonial et technologies futures s'affrontent.",
    content: "Dans Aliens versus Predator 2: Primal Hunt (2002), l'intrigue remonte au début du XVIIIe siècle lorsqu'un Chasseur Ancien découvre un artefact capable de repousser et de paralyser les Xénomorphes sur LV-1201. Piégé dans un champ de stase stasique protecteur pendant cinq cents ans après avoir été attaqué par un Facehugger, son réveil accidentel par la mercenaire Dunya en 2222 relance une chasse cataclysmique où passé colonial et technologies futures s'affrontent.",
    details: "Technologie des balises de résonance anti-xénomorphe, chronologie de la stase Yautja et architecture des laboratoires suspendus de LV-1201.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_avp_primal_hunt_ancient_2002']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'aliens1986', 'predatorArchives'],
    canonicalPeriod: '2222',
    tags: Object.freeze(['primal_hunt', 'lv1201', 'artefact_antique', 'stase_500_ans', 'dunya_monolith']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_avp_war_noguchi_1995',
    entryType: 'codex',
    category: 'chroniques',
    title: 'AVP: War (1995 — Randy Stradley, planète Bunda, Machiko Noguchi & le clan Top-Knot)',
    universe: 'AVP',
    unlockCondition: "Chasser côte à côte avec des Yautja sans blesser de civils innocents pris entre deux feux",
    summary: "La conclusion majeure de la première trilogie de comics Machiko Noguchi par Randy Stradley, illustrant la tension insurmontable entre son allégeance humaine et le code d'honneur tribal.",
    body: "Dans Aliens vs. Predator: War (Randy Stradley, 1995), Machiko Noguchi vit désormais pleinement au sein du clan Top-Knot depuis près d'un an, arborant la marque rituelle sur son front. Déployée sur la planète Bunda pour une grande chasse au cœur d'un essaim xénomorphe massif, elle découvre que le clan Yautja commence à considérer des civils colons humains non armés comme du gibier d'entraînement. Refusant ce déshonneur barbare, Machiko se retourne contre ses frères d'armes, orchestrant un sauvetage héroïque avant de regagner sa liberté.",
    content: "Dans Aliens vs. Predator: War (Randy Stradley, 1995), Machiko Noguchi vit désormais pleinement au sein du clan Top-Knot depuis près d'un an, arborant la marque rituelle sur son front. Déployée sur la planète Bunda pour une grande chasse au cœur d'un essaim xénomorphe massif, elle découvre que le clan Yautja commence à considérer des civils colons humains non armés comme du gibier d'entraînement. Refusant ce déshonneur barbare, Machiko se retourne contre ses frères d'armes, orchestrant un sauvetage héroïque avant de regagner sa liberté.",
    details: "Règles strictes de chasse envers les proies non armées, structure hiérarchique du Top-Knot Clan et tactiques de guérilla combinée combistick/pulse rifle.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_avp_bunda_war_machiko_1995']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'aliens1986', 'predatorArchives'],
    canonicalPeriod: '2194',
    tags: Object.freeze(['war_1995', 'machiko_noguchi', 'bunda', 'top_knot_clan', 'randy_stradley']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_avp_pursuit_2001',
    entryType: 'codex',
    category: 'chroniques',
    title: 'AVP: Pursuit (2001 — Système Altair, navire éclaireur Yautja & vaisseau d\'évacuation contaminé)',
    universe: 'AVP',
    unlockCondition: "Arraisonner et purger un vaisseau de transport spatial en perdition dérivant à pleine vitesse",
    summary: "Récit haletant de Dark Horse Comics mettant en scène une traque interplanétaire où un vaisseau éclaireur Yautja intercepte une navette d'évacuation humaine dont les passagers sont déjà hôtes de larves xénomorphes.",
    body: "Aliens vs. Predator: Pursuit (Dark Horse Annual 2001) relate la course-poursuite impitoyable dans le secteur d'Altair entre une barge coloniale automatisée et une frégate furtive Yautja. Alertés par les signatures thermiques aberrantes des embryons incubant dans les caissons cryogéniques de l'équipage, les chasseurs s'infiltrent à bord du vaisseau lancé à pleine vitesse. Le huis-clos spatial tourne au carnage alors que les coffres s'ouvrent, déclenchant l'assaut simultané de Chestbursters nouveau-nés dans un environnement à gravité oscillante.",
    content: "Aliens vs. Predator: Pursuit (Dark Horse Annual 2001) relate la course-poursuite impitoyable dans le secteur d'Altair entre une barge coloniale automatisée et une frégate furtive Yautja. Alertés par les signatures thermiques aberrantes des embryons incubant dans les caissons cryogéniques de l'équipage, les chasseurs s'infiltrent à bord du vaisseau lancé à pleine vitesse. Le huis-clos spatial tourne au carnage alors que les coffres s'ouvrent, déclenchant l'assaut simultané de Chestbursters nouveau-nés dans un environnement à gravité oscillante.",
    details: "Techniques de traque cryogénique, manœuvres d'arraisonnement spatial et combat en micro-gravité dans des coursives pressurisées.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_avp_the_web_1999']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'aliens1986', 'predatorArchives'],
    canonicalPeriod: '2201',
    tags: Object.freeze(['pursuit_2001', 'altair', 'vaisseau_cryogenique', 'chestbursters', 'dark_horse']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_pred_flesh_and_blood_2007',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: Flesh and Blood (2007 — Forteresse planétaire des Cale, tempête acide & guerre de succession)',
    universe: 'PREDATOR',
    unlockCondition: "Nettoyer la forteresse planétaire de la dynastie Cale sous les averses d'acide",
    summary: "Roman officiel de Michael Jan Friedman où une famille criminelle interplanétaire s'affronte dans leur bastion isolé pendant qu'une escouade Yautja s'infiltre sous la pluie corrosive.",
    body: "Predator: Flesh and Blood (Michael Jan Friedman, 2007) relate le conflit sanglant au sein du puissant syndicat criminel Cale réuni dans une forteresse planétaire hostile. Alors que les héritiers s'entretuent pour le pouvoir sous un ciel balayé par les pluies acides, deux clans Yautja rivaux profitent du chaos pour initier leurs novices à la traque en milieu confiné et toxique.",
    content: "Predator: Flesh and Blood (Michael Jan Friedman, 2007) relate le conflit sanglant au sein du puissant syndicat criminel Cale réuni dans une forteresse planétaire hostile. Alors que les héritiers s'entretuent pour le pouvoir sous un ciel balayé par les pluies acides, deux clans Yautja rivaux profitent du chaos pour initier leurs novices à la traque en milieu confiné et toxique.",
    details: "Tactiques de siège intérieur, neutralisation de mercenaires cyber-augmentés et résistance des armures à l'acide sulfurique.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_pred_turnabout_2008']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['predatorArchives', 'predator1987'],
    canonicalPeriod: '2007',
    tags: Object.freeze(['flesh_and_blood', 'michael_jan_friedman', 'syndicat_cale', 'pluie_acide', 'forteresse']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_pred_hell_come_a_walkin_1998',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: Hell Come A-Walkin\' (1998 — Guerre de Sécession 1863, gorges du Missouri & tranchées de poudre)',
    universe: 'PREDATOR',
    unlockCondition: "Découvrir la clairière ensanglantée du régiment confédéré et les trophées de baïonnettes",
    summary: "Comics de Nancy A. Collins situant la traque en pleine guerre civile américaine : Confédérés et régiments de l'Union doivent conclure une trêve fragile face à un chasseur Yautja invisible fauchant les lignes.",
    body: "Predator: Hell Come A-Walkin' (Nancy A. Collins & Dean Ormston, 1998) prend pour cadre la guerre de Sécession en 1863. Au cœur des ravins escarpés des monts Ozarks dans le Missouri, deux compagnies ennemies — les cavaliers confédérés de Jesse James et une unité de l'Union — sont encerclées par un 'démon des bois' Yautja récoltant crânes et sabres d'officiers. Face aux canons à poudre noire et fusils Springfield, le chasseur exploite les volutes de fumée pour frapper sans être vu.",
    content: "Predator: Hell Come A-Walkin' (Nancy A. Collins & Dean Ormston, 1998) prend pour cadre la guerre de Sécession en 1863. Au cœur des ravins escarpés des monts Ozarks dans le Missouri, deux compagnies ennemies — les cavaliers confédérés de Jesse James et une unité de l'Union — sont encerclées par un 'démon des bois' Yautja récoltant crânes et sabres d'officiers. Face aux canons à poudre noire et fusils Springfield, le chasseur exploite les volutes de fumée pour frapper sans être vu.",
    details: "Utilisation tactique de la poudre noire pour dissimuler les tirs, embuscades de cavalerie et rituels d'honneur face aux combattants à l'arme blanche.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_pred_blood_on_two_earths_2001']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['predatorArchives', 'predator1987'],
    canonicalPeriod: '1863',
    tags: Object.freeze(['hell_come_a_walkin', 'guerre_de_secession', '1863', 'ozarks', 'nancy_collins']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_pred_bloody_sands_of_time_1992',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: The Bloody Sands of Time (1992 — Tranchées de la Somme 1916 & ruines antiques de Mésopotamie)',
    universe: 'PREDATOR',
    unlockCondition: "Retrouver le journal d'un officier britannique de 1916 et exhumer les stèles mésopotamiennes",
    summary: "Récit culte de Dark Horse explorant les apparitions historiques des Yautja, des tranchées de la Première Guerre Mondiale jusqu'aux sables brûlants de Mésopotamie.",
    body: "Predator: The Bloody Sands of Time (Rich Margopoulos & Gene Colan, 1992) suit une enquête historique fascinante à travers le journal d'un officier britannique. Témoin en 1916 d'un massacre inexpliqué de patrouilles entières au milieu du no man's land de la Somme, il découvre que ce démon à masque métallique récolte les crânes des plus braves soldats depuis l'Antiquité mésopotamienne.",
    content: "Predator: The Bloody Sands of Time (Rich Margopoulos & Gene Colan, 1992) suit une enquête historique fascinante à travers le journal d'un officier britannique. Témoin en 1916 d'un massacre inexpliqué de patrouilles entières au milieu du no man's land de la Somme, il découvre que ce démon à masque métallique récolte les crânes des plus braves soldats depuis l'Antiquité mésopotamienne.",
    details: "Traque dans les cratères d'obus, affrontement à l'arme blanche dans la boue des tranchées et étude des fresques cunéiformes de Mésopotamie.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_pred_blood_on_two_earths_2001']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['predatorArchives', 'predator1987'],
    canonicalPeriod: '1916 / Antiquité',
    tags: Object.freeze(['bloody_sands_of_time', '1916', 'premiere_guerre_mondiale', 'somme', 'mesopotamie']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_pred_strange_roux_1996',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Predator: Strange Roux (1996 — Bayous de Louisiane, brume des marais & traqueurs cajuns)',
    universe: 'PREDATOR',
    unlockCondition: "Naviguer en hydroglisseur dans les eaux troubles et abattre la proie immergée",
    summary: "Comics sombre de Brian McDonald au cœur des marais louisianais où un braconnier cajun et un vieux shérif traquent ce qu'ils croient être un démon des eaux, se heurtant à un Yautja en rituel amphibie.",
    body: "Predator: Strange Roux (Brian McDonald & Mitch Byrd, 1996) plonge le joueur dans les marécages suffocants de Louisiane. Croyant poursuivre le légendaire monstre du bayou, un chasseur de crocodiles local nommé LeBlanc se retrouve traqué par un Yautja qui s'est adapté aux eaux boueuses en camouflant son armure de boue et de résidus végétaux. La confrontation nocturne dans les arbres moussus met en lumière l'art Yautja de la traque subaquatique et des pièges suspendus.",
    content: "Predator: Strange Roux (Brian McDonald & Mitch Byrd, 1996) plonge le joueur dans les marécages suffocants de Louisiane. Croyant poursuivre le légendaire monstre du bayou, un chasseur de crocodiles local nommé LeBlanc se retrouve traqué par un Yautja qui s'est adapté aux eaux boueuses en camouflant son armure de boue et de résidus végétaux. La confrontation nocturne dans les arbres moussus met en lumière l'art Yautja de la traque subaquatique et des pièges suspendus.",
    details: "Tactiques amphibies en eaux stagnantes, camouflage par boue thermique et utilisation de collets de tension dans la végétation de bayou.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_pred_concrete_jungle_1989']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['predatorArchives', 'predator1987'],
    canonicalPeriod: '1996',
    tags: Object.freeze(['strange_roux', 'louisiane', 'bayous', 'cajun', 'brian_mcdonald']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_alien_isolation_sevastopol_2014',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Alien: Isolation — Chute de Sébastopol & Protocoles Apollo (2014 — Station orbitale Seegson & androïdes Working Joes)',
    universe: 'ALIEN',
    unlockCondition: "Survécu au black-out total de la station spatiale en échappant à l'androïde synthétique d'Apollo",
    summary: "Dossier majeur sur la catastrophe de la station Sevastopol, le confinement désespéré de la division médicale San Cristobal et le basculement meurtrier de l'IA Apollo reprogrammant les synthétiques Working Joes.",
    body: "Alien: Isolation (Creative Assembly / SEGA, 2014) documente la lente agonie de la station orbitale Sevastopol opérée par Seegson. Amanda Ripley, à la recherche de la boîte noire du Nostromo, y découvre une population abandonnée à la folie, traquée par un Xenomorphe solitaire imprenable. Lorsque l'intelligence centrale Apollo déclenche la Directive Hasard Zéro, les androïdes Working Joes aux yeux luminescents appliquent un protocole d'éradication sans état d'âme des derniers survivants.",
    content: "Alien: Isolation (Creative Assembly / SEGA, 2014) documente la lente agonie de la station orbitale Sevastopol opérée par Seegson. Amanda Ripley, à la recherche de la boîte noire du Nostromo, y découvre une population abandonnée à la folie, traquée par un Xenomorphe solitaire imprenable. Lorsque l'intelligence centrale Apollo déclenche la Directive Hasard Zéro, les androïdes Working Joes aux yeux luminescents appliquent un protocole d'éradication sans état d'âme des derniers survivants.",
    details: "Surveillance par caméras automatisées, saturation des conduits de décompression et résistance électrique des synthétiques industriels face aux armes conventionnelles.",
    crossLinks: Object.freeze(['culture-alien-biologie', 'lore_alien_blackout_2019']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['alien1979', 'aliens1986'],
    canonicalPeriod: '2137',
    tags: Object.freeze(['isolation_2014', 'sevastopol', 'amanda_ripley', 'apollo', 'working_joes']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_alien_fast_track_to_heaven_2011',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Aliens: Fast Track to Heaven (2011 — Station sous-marine d\'Europa, fosse abyssale & xénomorphes aquatiques)',
    universe: 'ALIEN',
    unlockCondition: "Survécu à la brèche d'inondation de la station abyssale d'Europa à 1000 bars",
    summary: "Récit graphique de Liam Sharp au cœur de la station de recherche abyssale de la lune Europa, où une foreuse thermique libère des prédateurs xénomorphes adaptés aux grands fonds glaciaires.",
    body: "Aliens: Fast Track to Heaven (Liam Sharp, 2011) explore l'horreur claustrophobique des fonds océaniques sous la banquise d'Europa. Une mission scientifique fore à des kilomètres de profondeur pour atteindre des sources hydrothermales, réveillant un nid fossilisé d'organismes xénomorphes. Les survivants doivent lutter contre l'inondation glacée, la pression écrasante de 1000 bars et des créatures amphibies fendant les abysses à pleine vitesse.",
    content: "Aliens: Fast Track to Heaven (Liam Sharp, 2011) explore l'horreur claustrophobique des fonds océaniques sous la banquise d'Europa. Une mission scientifique fore à des kilomètres de profondeur pour atteindre des sources hydrothermales, réveillant un nid fossilisé d'organismes xénomorphes. Les survivants doivent lutter contre l'inondation glacée, la pression écrasante de 1000 bars et des créatures amphibies fendant les abysses à pleine vitesse.",
    details: "Combat sous-marin en scaphandre haute pression, utilisation de harpons thermiques et verrouillage de sas anti-inondation.",
    crossLinks: Object.freeze(['culture-alien-biologie', 'lore_alien_dark_descent_2023']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['aliens1986', 'alien1979'],
    canonicalPeriod: '2165',
    tags: Object.freeze(['fast_track_to_heaven', 'europa', 'abysses', 'sous_marin', 'liam_sharp']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_alien_resistance_2019',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Aliens: Resistance (2019 — Amanda Ripley, Zula Hendricks & sabotage du programme d\'armement bio-hybride)',
    universe: 'ALIEN',
    unlockCondition: "Neutraliser le commando de sécurité corporative Weyland-Yutani dans le laboratoire orbital",
    summary: "Jonction héroïque entre la survivante de Sevastopol Amanda Ripley et la vétérane Zula Hendricks infiltrant une station secrète de Weyland-Yutani pour détruire les capsules de bio-armes modifiées génétiquement.",
    body: "Aliens: Resistance (Brian Wood & Robert Carey, 2019) scelle l'alliance entre Amanda Ripley et Zula Hendricks. Réfugiées sur Terre puis propulsées dans l'espace corporatif, elles mettent au jour un projet terrifiant mené par un consortium privé : la sélection artificielle d'une souche de Xénomorphes dociles modifiés génétiquement pour le combat urbain. Infiltrant le centre de recherche clandestin, elles combattent côte à côte des gardes d'élite cybernétisés et des hybrides instables.",
    content: "Aliens: Resistance (Brian Wood & Robert Carey, 2019) scelle l'alliance entre Amanda Ripley et Zula Hendricks. Réfugiées sur Terre puis propulsées dans l'espace corporatif, elles mettent au jour un projet terrifiant mené par un consortium privé : la sélection artificielle d'une souche de Xénomorphes dociles modifiés génétiquement pour le combat urbain. Infiltrant le centre de recherche clandestin, elles combattent côte à côte des gardes d'élite cybernétisés et des hybrides instables.",
    details: "Infiltration furtive sous brouilleurs biométriques, piratage des générateurs d'énergie et neutralisation de tourelles automatiques à impulsion.",
    crossLinks: Object.freeze(['culture-alien-biologie', 'lore_alien_isolation_sevastopol_2014']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['aliens1986', 'alien1979'],
    canonicalPeriod: '2140',
    tags: Object.freeze(['resistance_2019', 'amanda_ripley', 'zula_hendricks', 'bio_hybrides', 'brian_wood']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_alien_rescue_2019',
    entryType: 'codex',
    category: 'chroniques',
    title: 'Aliens: Rescue (2019 — Station de recherche Ambrose, survivants mutants & sauvetage commando)',
    universe: 'ALIEN',
    unlockCondition: "Évacuer l'équipe d'intervention avant la surcharge cryogénique de la lune Ambrose",
    summary: "Dernier volet de la trilogie de Brian Wood : assaut commando dans les laboratoires de quarantaine de la lune Ambrose pour extraire des otages contaminés avant la purge thermonucléaire corporative.",
    body: "Aliens: Rescue (Brian Wood & Kieran McKeown, 2019) conclut la saga de résistance d'Amanda Ripley et Zula Hendricks. Sur la lune isolée Ambrose, l'ancien Colonial Marine Alec Brand, traumatisé par son infection passée, dirige une opération commando désespérée pour délivrer des cobayes humains servant d'incubateurs à une nouvelle génération de guerriers xénomorphes. La mission se transforme en course contre la montre face aux mercenaires corporatifs prêts à vaporiser l'installation.",
    content: "Aliens: Rescue (Brian Wood & Kieran McKeown, 2019) conclut la saga de résistance d'Amanda Ripley et Zula Hendricks. Sur la lune isolée Ambrose, l'ancien Colonial Marine Alec Brand, traumatisé par son infection passée, dirige une opération commando désespérée pour délivrer des cobayes humains servant d'incubateurs à une nouvelle génération de guerriers xénomorphes. La mission se transforme en course contre la montre face aux mercenaires corporatifs prêts à vaporiser l'installation.",
    details: "Procédures de confinement médical d'urgence, extraction tactique sous tir de suppression et élimination de couvées prêtes à l'éclosion.",
    crossLinks: Object.freeze(['culture-alien-biologie', 'lore_alien_defiance_2016']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['aliens1986', 'alien1979'],
    canonicalPeriod: '2142',
    tags: Object.freeze(['rescue_2019', 'alec_brand', 'ambrose', 'incubateurs', 'brian_wood']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_avp_ultimate_prey_2022',
    entryType: 'codex',
    category: 'chroniques',
    title: 'AVP: Ultimate Prey (2022 — Anthologie officielle Titan Books, guerres d\'honneur & proies suprêmes)',
    universe: 'AVP',
    unlockCondition: "Accomplir un contrat de chasse parfait contre une proie suprême sans subir de dégâts",
    summary: "Anthologie canonique majeure réunissant les plus grandes plumes de la science-fiction pour explorer les duels Yautja vs Xénomorphes à travers différentes époques et planètes.",
    body: "Aliens vs. Predators: Ultimate Prey (Jonathan Maberry & Bryan Thomas Schmidt, 2022) rassemble quinze récits officiels démontrant la diversité tactique de la traque tripartite. Des forêts luxuriantes aux mégastructures orbitales, chaque confrontation pousse les chasseurs Yautja à repousser leurs limites martiales face à des castes xénomorphes mutantes et des guerriers humains d'élite.",
    content: "Aliens vs. Predators: Ultimate Prey (Jonathan Maberry & Bryan Thomas Schmidt, 2022) rassemble quinze récits officiels démontrant la diversité tactique de la traque tripartite. Des forêts luxuriantes aux mégastructures orbitales, chaque confrontation pousse les chasseurs Yautja à repousser leurs limites martiales face à des castes xénomorphes mutantes et des guerriers humains d'élite.",
    details: "Règles d'engagement canoniques selon le statut de sang, analyse des proies suprêmes et rituels d'intronisation des Jeunes Sangs.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_avp_pursuit_2001']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'aliens1986', 'predatorArchives'],
    canonicalPeriod: '2215',
    tags: Object.freeze(['ultimate_prey_2022', 'jonathan_maberry', 'titan_books', 'anthologie', 'proies_supremes']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_avp_hell_bent_1998',
    entryType: 'codex',
    category: 'chroniques',
    title: 'AVP: Hell-Bent (1998 — Pénitencier minier d\'astéroïde zéro-G & propulsion sous vide)',
    universe: 'AVP',
    unlockCondition: "Triompher d'une cible ennemie en chute libre orbitale lors d'une décompression explosive",
    summary: "Récit extrême dans un bagne minier orbital à gravité zéro où prisonniers cybernétisés, Xénomorphes adaptés au vide et chasseurs Yautja propulsés par hydro-jets s'affrontent sans sol ni gravité.",
    body: "Aliens vs. Predator: Hell-Bent (1998) transporte le conflit au cœur d'un pénitencier d'extraction de minerai aménagé sur un astéroïde instable. Privée de pesanteur artificielle suite à un sabotage des détenus, l'installation devient une arène tridimensionnelle vertigineuse. Les Yautja y déploient des harnais de propulsion dorsale et des harpons pneumatiques à grappin pour traquer des xénomorphes rampant le long des conduites d'air dans le noir absolu.",
    content: "Aliens vs. Predator: Hell-Bent (1998) transporte le conflit au cœur d'un pénitencier d'extraction de minerai aménagé sur un astéroïde instable. Privée de pesanteur artificielle suite à un sabotage des détenus, l'installation devient une arène tridimensionnelle vertigineuse. Les Yautja y déploient des harnais de propulsion dorsale et des harpons pneumatiques à grappin pour traquer des xénomorphes rampant le long des conduites d'air dans le noir absolu.",
    details: "Combat en apesanteur intégrale, gestion d'inertie balistique sans appui au sol et tirs de harpons de capture à verrouillage magnétique.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_avp_deadliest_species_1993']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'aliens1986', 'predatorArchives'],
    canonicalPeriod: '2198',
    tags: Object.freeze(['hell_bent_1998', 'zero_g', 'penitencier', 'asteroide', 'harpon_pneumatique']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_avp_old_secrets_2007',
    entryType: 'codex',
    category: 'chroniques',
    title: 'AVP: Old Secrets (2007 — Vallée de l\'Indus, forteresse antique & temple de sacrifices)',
    universe: 'AVP',
    unlockCondition: "Déchiffrer les bas-reliefs de l'antre souterrain et éliminer la couvée ancienne",
    summary: "Enquête archéologique et militaire découvrant des stèles millénaires dans une citadelle oubliée où les Yautja organisaient des rites de passage avec des xénomorphes face aux premiers souverains de l'Humanité.",
    body: "Aliens vs. Predator: Old Secrets (2007) explore les strates antiques de la présence Yautja sur Terre. Dans les contreforts de la vallée de l'Indus, une expédition conjointe d'archéologues et de forces spéciales pénètre dans une cité fortifiée enfouie sous les sables. Les inscriptions cunéiformes et fresques gravées révèlent des siècles de tributs humains offerts aux dieux stellaires pour nourrir les démons noirs, avant que les derniers œufs ne soient réveillés par la chaleur des forages.",
    content: "Aliens vs. Predator: Old Secrets (2007) explore les strates antiques de la présence Yautja sur Terre. Dans les contreforts de la vallée de l'Indus, une expédition conjointe d'archéologues et de forces spéciales pénètre dans une cité fortifiée enfouie sous les sables. Les inscriptions cunéiformes et fresques gravées révèlent des siècles de tributs humains offerts aux dieux stellaires pour nourrir les démons noirs, avant que les derniers œufs ne soient réveillés par la chaleur des forages.",
    details: "Archéologie rituelle Yautja, déchiffrement de cartouches sacrificiels et affrontement au milieu de piliers de grès millénaires et de trappes à pendule.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_avp_primal_hunt_2002']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'avp2004'],
    canonicalPeriod: 'Antiquité / 2007',
    tags: Object.freeze(['old_secrets', 'indus', 'temple_antique', 'steles_yautja', 'sacrifices']),
    locationIds: Object.freeze([])
  },
  {
    id: 'lore_avp_tokyo_1999',
    entryType: 'codex',
    category: 'chroniques',
    title: 'AVP: Tokyo (1999 — Mégapole néo-tokyoïte, syndicats Yakuza & traque sous les pluies acides)',
    universe: 'AVP',
    unlockCondition: "Triompher du maître de sabre cybernétisé sur le pont de verre suspendu de Shinjuku",
    summary: "Choc technologique et martial au cœur des gratte-ciels néo-tokyoïtes où des membres cybernétisés du crime organisé et des traqueurs Yautja règlent un compte d'honneur au katana sous les néons étincelants.",
    body: "Aliens vs. Predator: Tokyo (1999) transpose la traque rituelle au sommet de la jungle de gratte-ciels de Néo-Tokyo. Un clan yakuza de premier rang, équipé de prothèses cybernétiques d'attaque et de lames mono-moléculaires, croise le fer avec un chasseur Yautja attiré par l'art martial du sabre japonais. L'irruption inattendue d'un spécimen xénomorphe échappé des laboratoires d'un consortium pharmaceutique transforme les ponts de verre et toits illuminés en arène de massacre cyberpunk.",
    content: "Aliens vs. Predator: Tokyo (1999) transpose la traque rituelle au sommet de la jungle de gratte-ciels de Néo-Tokyo. Un clan yakuza de premier rang, équipé de prothèses cybernétiques d'attaque et de lames mono-moléculaires, croise le fer avec un chasseur Yautja attiré par l'art martial du sabre japonais. L'irruption inattendue d'un spécimen xénomorphe échappé des laboratoires d'un consortium pharmaceutique transforme les ponts de verre et toits illuminés en arène de massacre cyberpunk.",
    details: "Duels d'escrime à l'arme blanche sur toitures de verre glissantes, reflets optiques sous enseignes holographiques et traque urbaine ultra-verticale.",
    crossLinks: Object.freeze(['culture-code-de-la-chasse', 'lore_avp_deadliest_species_1993']),
    sourceTier: 'EXPANDED_LORE',
    isOriginal: false,
    sources: ['avpOriginalComics', 'predator2', 'aliens1986'],
    canonicalPeriod: '1999',
    tags: Object.freeze(['tokyo_1999', 'yakuza', 'cyberpunk', 'katana', 'shinjuku']),
    locationIds: Object.freeze([])
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
