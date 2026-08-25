// Canon-conscious lore data for Yautja: Apex Hunt.
// UI rule: always display the sourceTier badge with an entry.

export const LORE_SOURCE_TIERS = Object.freeze({
  SCREEN: Object.freeze({ id: 'SCREEN', label: 'ÉCRAN PRINCIPAL PREDATOR / ALIEN', shortLabel: 'ÉCRAN', color: '#55e6a5', priority: 1 }),
  AVP_SCREEN: Object.freeze({ id: 'AVP_SCREEN', label: 'ÉCRAN AVP', shortLabel: 'AVP', color: '#e9b949', priority: 2 }),
  LICENSED_SCREEN_DESIGN: Object.freeze({ id: 'LICENSED_SCREEN_DESIGN', label: 'DESIGN ÉCRAN DOCUMENTÉ SOUS LICENCE', shortLabel: 'DESIGN', color: '#8dd7c6', priority: 3 }),
  LICENSED_EU: Object.freeze({ id: 'LICENSED_EU', label: 'UNIVERS ÉTENDU SOUS LICENCE', shortLabel: 'EU', color: '#7aa2f7', priority: 4 }),
  MERCH_CONCEPT: Object.freeze({ id: 'MERCH_CONCEPT', label: 'CONCEPT DE COLLECTION SOUS LICENCE', shortLabel: 'MERCH', color: '#d6a75c', priority: 5 }),
  ORIGINAL: Object.freeze({ id: 'ORIGINAL', label: 'CRÉATION APEX HUNT', shortLabel: 'ORIGINAL', color: '#ff7a8a', priority: 6 })
});

export const LORE_SOURCES = Object.freeze({
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
  wolfArsenalDesigns: { title: 'AVP:R — arsenal du Wolf documenté par NECA', tier: 'LICENSED_SCREEN_DESIGN', url: 'https://necaonline.com/2011/03/the-predators-deadly-arsenal/' }
});

const freezeEntries = (entries) => Object.freeze(entries.map((entry) => Object.freeze({
  ...entry,
  sources: Object.freeze(entry.sources ?? []),
  locationIds: Object.freeze(entry.locationIds ?? [])
})));

export const LORE_CODEX_ENTRIES = freezeEntries([
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
]);

const ALL_LOCATION_IDS = ['jungle', 'hive_lv426', 'ryushi_desert', 'stargazer_blacksite', 'yautja_prime', 'genna_deathworld', 'los_angeles_1997', 'bouvetoya_pyramid'];

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
    canonNote: 'Wolf et son arsenal sont établis dans AVP:R ; ce duel et ses règles de destruction de kit sont une adaptation originale.', sources: ['avpRequiem2007', 'wolfArsenalDesigns'], locationIds: ALL_LOCATION_IDS
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
    canonNote: 'Le titre Bad Blood vient surtout de l’EU ; ce rival précis est une création du jeu.', sources: ['predators2010', 'predatorBadBloodComics'], locationIds: ALL_LOCATION_IDS
  },
  {
    id: 'predalien', entryType: 'hunt', category: 'cible', title: 'Predalien légendaire',
    summary: 'Hybride de la branche AVP transformé ici en cible de chasse exceptionnelle.',
    sourceTier: 'ORIGINAL', basisTier: 'AVP_SCREEN', isOriginal: true,
    canonNote: 'Le Predalien existe dans AVP: Requiem ; cette variante et cette mission sont originales.', sources: ['avpRequiem2007'], locationIds: ALL_LOCATION_IDS
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
]);

export const ALL_LORE_ENTRIES = Object.freeze([...LORE_CODEX_ENTRIES, ...HUNT_LOCATIONS, ...CURRENT_HUNTS]);
export const getLoreSourceTier = (tierId) => LORE_SOURCE_TIERS[tierId] ?? null;
export const getLoreEntryById = (id) => ALL_LORE_ENTRIES.find((entry) => entry.id === id) ?? null;
export const getLoreEntriesByCategory = (category) => ALL_LORE_ENTRIES.filter((entry) => entry.category === category);

export default Object.freeze({
  sourceTiers: LORE_SOURCE_TIERS,
  sources: LORE_SOURCES,
  codex: LORE_CODEX_ENTRIES,
  locations: HUNT_LOCATIONS,
  hunts: CURRENT_HUNTS
});
