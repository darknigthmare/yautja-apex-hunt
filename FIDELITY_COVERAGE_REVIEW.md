# Fidélité par élément et modèles réellement disponibles

Base de cette passe : `f3e375b`. La référence prioritaire est la source documentée de chaque élément, conformément au choix du propriétaire. Ce contrôle inventorie les sources déclarées et les raccords réellement présents dans le code ; il ne certifie pas une reproduction cinématographique 1:1.

## Corrections apportées

La sélection de modèle des holo-traques ignorait des modèles et IA déjà disponibles : Feral, Wolf, Berserker, Assassin, Jungle Hunter et Predalien pouvaient apparaître sous la forme d'un autre rival ou d'un xénomorphe générique. Une table **explicite de seize identités documentées**, prolongée par trois alias `referencePreyId`, réutilise maintenant le sujet correspondant et le biome de son contrat.

Dix-neuf dossiers ont maintenant une correspondance explicite avec le sujet existant. La comparaison au vrai runtime de la base révèle **seize dossiers effectivement corrigés**, dont douze changements de modèle et seize corrections de biome. Les entraînements restent holographiques, leurs récompenses ne fournissent aucun matériau physique et leurs dimensions restent des estimations. Une Reine Mère, une reine clonée de Charon ou un pisteur humain ne deviennent pas un autre individu simplement parce qu'ils ont une espèce ou un identifiant similaire. Les cinq cent quarante et un autres dossiers gardent un modèle d'entraînement générique signalé.

La règle de sélection est partagée entre `SimulationHuntRuntime` et le nouvel inventaire, dans `PreyReferenceMetadata`, sans importer de moteur 3D dans le manifeste consultable par l'interface. Les métadonnées `matchedRuntimeSubjectId` et `subjectModelStatus` distinguent le modèle correspondant d'un proxy générique tout en conservant `fidelityVerified: false`.

Deux citations concrètes du Codex sont réparées : le Rhynth utilise la référence existante `avpPreyOmnibus` plutôt qu'une clé absente ; le rival Bad Blood conserve la référence au comic et ne cite plus *Predators* (2010) comme référence directe à ce sujet. Les références imprécises de type « Lore canonique », « Shared Era » ou « Tribute Run » ne sont pas présentées comme une publication vérifiée.

Six fiches de mégafaune étaient aussi attribuées aux clans Yautja. Goliath, Kalisk, Rhynth et Vydrach et leurs variantes explicites appartiennent maintenant à `PREY_FACTIONS.FAUNA` ; leur ancienne déclaration est conservée dans `declaredFaction` pour la traçabilité.

## Inventaire livré

`getFidelityCoverage()` couvre **1 079 enregistrements avec une clé composée catégorie/ID**. Ce nombre ne compte pas des modèles distincts : un élément du catalogue peut désigner le même sujet qu'un contrat ou un équipement runtime.

| Catégorie | Enregistrements | Réalité d'implémentation |
| --- | ---: | --- |
| Contrats / PNJ | 15 / 31 | 46 archétypes physiques, avec référence de constructeur, comportement et textures réellement déclarées |
| Armes / gadgets | 15 / 7 | Équipements inscrits au runtime ; les sept gadgets comprennent les cinq actions et les systèmes de vision/camouflage |
| Classes | 10 | Profils de jeu originaux, pas dix répliques d'acteurs |
| Masques / armures | 38 / 50 | Variantes paramétrées ; les armures partagent le corps GLB et ses matières |
| Détails d'apparence / variantes d'armes | 75 / 14 | Paramètres, styles et variantes réellement déclarés |
| Technologies / véhicules / ennemis de référence | 48 / 15 / 37 | Correspondances runtime explicites distinguées des déclarations de catalogue ou archives |
| Événements / boss de référence / support | 31 / 15 / 13 | Statut et raccord vérifié séparément ; une archive reste une archive |
| Recettes | 40 | 16 disposent d'une source physique, 24 n'en disposent pas pour une nouvelle fabrication ; anciens objets forgés compatibles |
| Médias | 29 | Sources et statut de publication déclarés, sans modèle 3D implicitement attribué |
| Fiches principales / crossovers / rencontres d'univers | 200 / 60 / 300 | 560 entraînements : 19 sujets correspondants et 541 proxies génériques |
| Compartiments / stations | 11 / 25 à la base | Le hub courant peut être injecté à l'API pour suivre son réagencement réel |

Les statuts de la base sont : 297 références déclarées, 159 créations originales, 560 entraînements et 63 implémentations absentes. « Absent » vise une implémentation de catalogue ou une nouvelle fabrication indisponible ; ce n'est pas le nombre total d'écarts à une réplique 1:1. Chaque enregistrement contient également sa liste de manquants précis : source primaire, cote, comparaison de forme/matière, modèle dédié, comportement ou matériau physique.

**Aucune réplique 1:1 n'est certifiée par cet inventaire.** L'existence d'un constructeur ou d'une URL de source n'établit pas une correspondance de proportions, géométrie, UV, matériaux et animation avec l'œuvre.

## Sources encore insuffisantes

- `yautjaPrimeLore` n'identifie pas une publication précise pour le Vydrach ; aucun lien primaire n'est inventé.
- `aliensRogue1993` donne un intitulé de référence au Roi mais n'a pas de locator primaire enregistré dans `LORE_SOURCES` ; il reste signalé.
- Le classeur `Encyclopedie_exhaustive_franchise_Predator.xlsx` et ses 915 entrées sont cités par le README avec une empreinte. Aucun fichier XLS/XLSX ni document Blender n'est présent dans le checkout inspecté ; cette passe n'a donc ni relu ce classeur ni vérifié son empreinte.
- `ASSET_MANIFEST.md` décrit des assets procéduraux/OpenAI originaux. Ils ne constituent pas des scans d'assets officiels ou des planches de référence démontrant le 1:1.
- Les 675 fichiers `*Sector.js` de la base ne sont pas atteints depuis le graphe d'import de démarrage. Ils ne sont pas ajoutés au compte des neuf biomes jouables.

## API et reproduction

```js
import { getFidelityCoverage, getFidelityEntry, getFidelityStatusLabel }
  from './src/data/FidelityCoverage.js';

const inventory = getFidelityCoverage({ ship: currentHub });
const prey = getFidelityCoverage({ category: 'prey_dossier', status: 'proxy' });
const wolf = getFidelityEntry('contract:wolf_cleaner');
```

Les sources, le type de modèle, les bindings de code, les textures, les dimensions, la disponibilité des matériaux et les manquants sont des champs distincts. Une consultation par ID partagé doit préciser sa catégorie ou utiliser sa clé composée ; elle ne choisit pas arbitrairement un doublon.

```bash
node --test tests/fidelity-coverage.test.js tests/prey-reference-consistency.test.js \
  tests/simulation-hunt-runtime-regressions.test.js tests/craft-recipe-references.test.js \
  tests/catalogue-game-integration.test.js tests/lore-codex.test.js \
  tests/prey-taxonomy-and-crossover.test.js
node scripts/audit-fidelity.mjs --output /tmp/yautja-fidelity
node scripts/audit-fidelity.mjs --live-ship --output /tmp/yautja-fidelity-live
```

Le contrôle ciblé élargi contient **33 tests réussis**, dont huit nouveaux : tous les dossiers et alias, les modèles physiques, l'intégrité des références locales, le refus des substitutions d'identité, la disponibilité physique des recettes, la distinction d'une armure et de son masque de secours, l'inventaire du hub courant et l'absence de dépendance Three dans l'API de données.

Le script produit `coverage.json`, `summary.json` et `coverage.csv`. Les exports indiquent le commit, les modifications locales et l'heure du relevé. Ils contrôlent aussi les fichiers/empreintes des assets référencés et le graphe d'import sans effectuer de rendu, de requête réseau ou d'opération payante. Le mode `--live-ship` construit seulement le hub sur CPU afin de relire ses zones et stations réelles ; aucun contexte WebGL n'est créé.
