// Canon-conscious lore data for Yautja: Apex Hunt.
// UI rule: always display the sourceTier badge with an entry.

export const LORE_SOURCE_TIERS = Object.freeze({
  SCREEN: Object.freeze({ id: 'SCREEN', label: 'ÉCRAN PREDATOR', shortLabel: 'ÉCRAN', color: '#55e6a5', priority: 1 }),
  AVP_SCREEN: Object.freeze({ id: 'AVP_SCREEN', label: 'ÉCRAN AVP', shortLabel: 'AVP', color: '#e9b949', priority: 2 }),
  LICENSED_EU: Object.freeze({ id: 'LICENSED_EU', label: 'UNIVERS ÉTENDU SOUS LICENCE', shortLabel: 'EU', color: '#7aa2f7', priority: 3 }),
  ORIGINAL: Object.freeze({ id: 'ORIGINAL', label: 'CRÉATION APEX HUNT', shortLabel: 'ORIGINAL', color: '#ff7a8a', priority: 4 })
});

export const LORE_SOURCES = Object.freeze({
  predator1987: { title: 'Predator (1987)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/predator' },
  predatorArchives: { title: 'Predator — Walt Disney Archives', tier: 'SCREEN', url: 'https://d23.com/20th-century-fox-spooktacular-1980s-predator/' },
  predator2: { title: 'Predator 2 (1990)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/predator-2' },
  predators2010: { title: 'Predators (2010)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/predators' },
  prey2022: { title: 'Prey (2022)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/prey' },
  killerOfKillers: { title: 'Predator: Killer of Killers (2025)', tier: 'SCREEN', url: 'https://www.20thcenturystudios.com/movies/predator-killer-of-killers' },
  badlands2025: { title: 'Predator: Badlands (2025)', tier: 'SCREEN', url: 'https://thewaltdisneycompany.com/news/predator-badlands/' },
  avp2004: { title: 'Alien vs. Predator (2004)', tier: 'AVP_SCREEN', url: 'https://www.20thcenturystudios.com/movies/alien-vs-predator' },
  avpRequiem2007: { title: 'Aliens vs. Predator: Requiem (2007)', tier: 'AVP_SCREEN', url: 'https://www.20thcenturystudios.com/movies/aliens-vs-predator-requiem' },
  huntingGrounds: { title: 'Predator: Hunting Grounds — équipement', tier: 'LICENSED_EU', url: 'https://predator.illfonic.com/the-predator/' },
  avpOriginalComics: { title: 'AVP — comics originaux Dark Horse', tier: 'LICENSED_EU', url: 'https://digital.darkhorse.com/books/47483ce0aec5466783599e38c9d0ac47/aliens-vs-predator-the-original-comics-series-30th-anniversary-edition' },
  avpPreyNovel: { title: 'Aliens vs. Predator: Prey (1994)', tier: 'LICENSED_EU', url: 'https://obnb.uk/p10733831-aliens-vs-predator-prey' }
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
    body: 'Sa puissance et sa portée sont établies. L’époque, le clan et la valeur que le chasseur veut prouver expliquent des arsenaux différents.',
    sourceTier: 'SCREEN', isOriginal: false, sources: ['predator1987', 'predator2', 'huntingGrounds']
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
    sourceTier: 'SCREEN', relatedTier: 'LICENSED_EU', isOriginal: false, sources: ['predators2010', 'badlands2025', 'avpPreyNovel']
  },
  {
    id: 'xenomorphes-separation-avp', entryType: 'codex', category: 'xenomorphes', title: 'Xénomorphes : branche AVP',
    summary: 'La chasse rituelle de Xénomorphes existe dans AVP, sans définir automatiquement toute la culture Yautja.',
    body: 'Predator 2 montre un crâne xénomorphe et AVP une épreuve alimentée par des œufs. « Kiande amedha », Ryushi et les rites détaillés viennent surtout de l’EU.',
    sourceTier: 'AVP_SCREEN', relatedTier: 'LICENSED_EU', isOriginal: false, sources: ['predator2', 'avp2004', 'avpOriginalComics', 'avpPreyNovel']
  }
]);

// IDs match the values already used by the planet selector.
export const HUNT_LOCATIONS = freezeEntries([
  {
    id: 'jungle', entryType: 'location', category: 'lieu', title: 'Jungle de chasse',
    summary: 'Arène humide de ruines, canopée et pistes thermiques inspirée des chasses terrestres classiques.',
    sourceTier: 'ORIGINAL', basisTier: 'SCREEN', isOriginal: true,
    canonNote: 'Cette jungle précise est une création du jeu.', sources: ['predator1987', 'predators2010', 'prey2022']
  },
  {
    id: 'hive_lv426', entryType: 'location', category: 'lieu', title: 'LV-426 — ruches souterraines',
    summary: 'Réseau de résine, œufs et pluie acide conçu comme une mission crossover.',
    sourceTier: 'ORIGINAL', basisTier: 'AVP_SCREEN', isOriginal: true,
    canonNote: 'LV-426 vient d’Alien ; cette chasse Yautja et cette carte ne sont pas confirmées à l’écran.', sources: ['avp2004']
  },
  {
    id: 'ryushi_desert', entryType: 'location', category: 'lieu', title: 'Désert de Ryushi',
    summary: 'Monde colonial associé à la première grande histoire AVP en comics et dans le roman Prey.',
    sourceTier: 'LICENSED_EU', isOriginal: false, gameInterpretationOriginal: true,
    canonNote: 'Ryushi est EU ; la tempête et l’arène du jeu sont originales.', sources: ['avpOriginalComics', 'avpPreyNovel']
  },
  {
    id: 'yautja_prime', entryType: 'location', category: 'lieu', title: 'Yautja Prime — arène du clan',
    summary: 'Interprétation jouable d’un domaine Yautja consacré aux duels et aux trophées.',
    sourceTier: 'ORIGINAL', basisTier: 'SCREEN', isOriginal: true,
    canonNote: 'Le colisée sacré et son conseil d’Anciens sont des créations du jeu.', sources: ['badlands2025']
  }
]);

const ALL_LOCATION_IDS = ['jungle', 'hive_lv426', 'ryushi_desert', 'yautja_prime'];

// IDs match data-hunt and currentHuntType values in the game.
export const CURRENT_HUNTS = freezeEntries([
  {
    id: 'goliath', entryType: 'hunt', category: 'cible', title: 'Goliath Xeno-Akumo',
    summary: 'Mégafaune blindée élevée au rang de proie suprême par les chroniqueurs du vaisseau.',
    sourceTier: 'ORIGINAL', isOriginal: true,
    canonNote: 'Nom, espèce, anatomie et chasse sont entièrement originaux à Yautja: Apex Hunt.', locationIds: ALL_LOCATION_IDS
  },
  {
    id: 'xeno_queen', entryType: 'hunt', category: 'cible', title: 'Reine xénomorphe',
    summary: 'Cible majeure protégée par sa ruche, ses œufs et son sang acide.',
    sourceTier: 'ORIGINAL', basisTier: 'AVP_SCREEN', isOriginal: true,
    canonNote: 'La Reine existe à l’écran ; cette mission, son arène et sa récompense sont originales.', sources: ['avp2004'], locationIds: ALL_LOCATION_IDS
  },
  {
    id: 'bad_blood', entryType: 'hunt', category: 'cible', title: 'Rival Yautja « Bad Blood »',
    summary: 'Chasseur renégat employé comme duel miroir contre les tactiques du joueur.',
    sourceTier: 'ORIGINAL', basisTier: 'LICENSED_EU', isOriginal: true,
    canonNote: 'Le titre Bad Blood vient surtout de l’EU ; ce rival précis est une création du jeu.', sources: ['predators2010', 'avpOriginalComics'], locationIds: ALL_LOCATION_IDS
  },
  {
    id: 'predalien', entryType: 'hunt', category: 'cible', title: 'Predalien légendaire',
    summary: 'Hybride de la branche AVP transformé ici en cible de chasse exceptionnelle.',
    sourceTier: 'ORIGINAL', basisTier: 'AVP_SCREEN', isOriginal: true,
    canonNote: 'Le Predalien existe dans AVP: Requiem ; cette variante et cette mission sont originales.', sources: ['avpRequiem2007'], locationIds: ALL_LOCATION_IDS
  }
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
