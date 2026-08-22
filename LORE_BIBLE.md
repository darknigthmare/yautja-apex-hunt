# Bible de lore — Yautja: Apex Hunt

Cette bible empêche de mélanger films Predator, crossovers AVP, univers étendu sous licence et inventions du fan game comme s’ils formaient une continuité unique. Le projet peut utiliser ces quatre couches, mais leur provenance doit rester visible.

## Niveaux de provenance

| Niveau | Contenu | Règle |
| --- | --- | --- |
| `SCREEN` | Films Predator officiels | Référence la plus sûre pour culture, technologie et événements Predator. |
| `AVP_SCREEN` | Films Alien vs. Predator | Branche crossover distincte ; elle ne réécrit pas automatiquement les continuités principales. |
| `LICENSED_EU` | Romans, comics et jeux sous licence | Inspiration permise avec badge EU ; ses règles ne sont pas universalisées. |
| `ORIGINAL` | Créations de Yautja: Apex Hunt | Nom, mission, lieu ou interprétation propre au jeu ; badge toujours visible. |

Dans `src/data/LoreCodex.js`, `sourceTier` qualifie l’entrée exacte. `basisTier` peut signaler sa source d’inspiration. Une mission originale fondée sur une créature AVP reste donc `ORIGINAL`, avec `basisTier: AVP_SCREEN`.

## Décisions canoniques

### Yautja, code et honneur

Le mot **Yautja**, popularisé par le roman sous licence *Aliens vs. Predator: Prey* de 1994, est désormais compatible avec l’écran : Disney l’emploie explicitement pour *Predator: Badlands*. Cela ne rend pas tout le contenu du roman canon écran.

Les films établissent une chasse ritualisée, la recherche d’adversaires dangereux, les trophées et certains gestes de reconnaissance. Ils ne donnent pas une liste universelle de règles. Le jeu n’affirme donc pas que chaque Yautja :

- refuse toujours de tuer une cible désarmée, malade ou enceinte ;
- combat obligatoirement avec une arme de puissance égale ;
- n’attaque jamais sous camouflage ;
- suit une hiérarchie et une peine identiques dans tous les clans ;
- déclenche son autodestruction pour une seule raison religieuse certaine.

Ces comportements peuvent appartenir à un individu ou à un clan, sans devenir une loi biologique de l’espèce.

### Première chasse, progression et clans

*Badlands* confirme qu’un jeune Yautja peut ne pas avoir encore gagné camouflage ou canon d’épaule. Cette base `SCREEN` justifie la progression d’équipement du jeu. La pyramide, les Xénomorphes semés et l’épreuve de passage de *Alien vs. Predator* restent `AVP_SCREEN`.

*Predators* montre des groupes opposés ; *Badlands* confirme clan et exil. Le jeu en déduit seulement que les Yautja ne forment pas une monoculture. Les rangs **Young Blood**, **Blooded**, **Elite**, **Elder** et **Ancient** restent surtout des conventions EU et de gameplay. Ils doivent être présentés comme la nomenclature du clan joué, pas comme l’administration certaine de toute l’espèce.

Le terme **Bad Blood** vient principalement de l’univers étendu. Le rival actuel est ainsi `ORIGINAL`, avec une base `LICENSED_EU`, même si le cinéma montre des chasseurs rivaux ou déviants.

### Technologie

Biomasque, camouflage réfractif, ciblage à trois points, canon à plasma, lames de poignet, combistick, smart disc, filet et soins de terrain ont des bases solides. Deux distinctions sont maintenues :

- la boue froide masque la signature thermique ; elle ne désactive pas le camouflage du Yautja ;
- le camouflage rend difficile à voir, mais eau, dégâts, mouvement et décor peuvent révéler sa silhouette.

Le tir tri-faisceau et le camouflage anti-acide du jeu restent `ORIGINAL` jusqu’à confirmation par une source écran précise.

### Trophées

Les films montrent crânes, colonnes vertébrales, armes conservées et trophées exposés, mais aussi des corps écorchés ou suspendus. La bible ne traite pas chaque dépouille comme un trophée honorifique : un trophée est une pièce sélectionnée qui mémorise une chasse remarquable.

### Xénomorphes et séparation AVP

Le crâne xénomorphe de *Predator 2* prouve au minimum une rencontre. *Alien vs. Predator* confirme, dans sa branche, des œufs semés pour une épreuve de passage. Cela ne prouve pas que tous les clans fondent leur culture sur la chasse aux Xénomorphes.

Le terme **kiande amedha**, Ryushi et de nombreux détails de castes ou de marquage restent `LICENSED_EU`. Le Predalien existe dans `AVP_SCREEN`, mais la variante « légendaire » et sa mission dans le jeu sont `ORIGINAL`.

## Lieux de chasse actuels

| ID runtime | Nom | Provenance jouable | Note |
| --- | --- | --- | --- |
| `jungle` | Jungle de chasse | `ORIGINAL`, base `SCREEN` | Arène du jeu inspirée des jungles et pistes thermiques des films. |
| `hive_lv426` | LV-426 — ruches souterraines | `ORIGINAL`, base `AVP_SCREEN` | LV-426 vient d’Alien ; cette chasse Yautja et cette carte ne sont pas confirmées à l’écran. |
| `ryushi_desert` | Désert de Ryushi | `LICENSED_EU` | Ryushi vient des comics/du roman AVP ; tempête et arène sont une interprétation originale. |
| `yautja_prime` | Yautja Prime — arène du clan | `ORIGINAL`, base `SCREEN` | Le colisée sacré et son conseil d’Anciens sont inventés pour le jeu. |

Le sélecteur autorise toute cible sur tout lieu. Cette liberté de gameplay ne crée pas un événement canon.

## Cibles actuelles

| ID runtime | Cible | Provenance de la mission | Règle |
| --- | --- | --- | --- |
| `goliath` | Goliath Xeno-Akumo | `ORIGINAL` | Nom, espèce, anatomie, origine et chasse créés pour le jeu. |
| `xeno_queen` | Reine xénomorphe | `ORIGINAL`, base `AVP_SCREEN` | La créature existe à l’écran ; combat, arène et récompense actuels sont originaux. |
| `bad_blood` | Rival Yautja Bad Blood | `ORIGINAL`, base `LICENSED_EU` | Le personnage précis est inventé ; Bad Blood n’est pas une caste écran universelle. |
| `predalien` | Predalien légendaire | `ORIGINAL`, base `AVP_SCREEN` | Le type existe dans *AVP: Requiem* ; variante et statut de boss sont propres au jeu. |

### Goliath Xeno-Akumo

**Goliath Xeno-Akumo doit toujours porter le badge `ORIGINAL`.** Le préfixe « Xeno » signifie seulement « étranger » dans la fiction du jeu ; il ne doit pas faire croire à un lien avec le cycle biologique des Xénomorphes d’Alien. Sa planète, ses cornes, sa reproduction, son origine et son éventuel lien aux Yautja restent originaux jusqu’à décision éditoriale explicite.

## Sources officielles et sources de contrôle

### Écran Predator

- [Predator (1987) — 20th Century Studios](https://www.20thcenturystudios.com/movies/predator)
- [Predator — Walt Disney Archives/D23](https://d23.com/20th-century-fox-spooktacular-1980s-predator/)
- [Predator 2 (1990) — 20th Century Studios](https://www.20thcenturystudios.com/movies/predator-2)
- [Predators (2010) — 20th Century Studios](https://www.20thcenturystudios.com/movies/predators)
- [Prey (2022) — 20th Century Studios](https://www.20thcenturystudios.com/movies/prey)
- [Predator: Killer of Killers (2025) — 20th Century Studios](https://www.20thcenturystudios.com/movies/predator-killer-of-killers)
- [Predator: Badlands (2025) — The Walt Disney Company](https://thewaltdisneycompany.com/news/predator-badlands/)

### Branche AVP

- [Alien vs. Predator (2004) — 20th Century Studios](https://www.20thcenturystudios.com/movies/alien-vs-predator)
- [Aliens vs. Predator: Requiem (2007) — 20th Century Studios](https://www.20thcenturystudios.com/movies/aliens-vs-predator-requiem)

### Univers étendu sous licence

- [Predator: Hunting Grounds — arsenal IllFonic](https://predator.illfonic.com/the-predator/)
- [AVP — comics originaux Dark Horse](https://digital.darkhorse.com/books/47483ce0aec5466783599e38c9d0ac47/aliens-vs-predator-the-original-comics-series-30th-anniversary-edition)
- [Notice bibliographique de Aliens vs. Predator: Prey (1994)](https://obnb.uk/p10733831-aliens-vs-predator-prey)

Les wikis de fans peuvent aider à retrouver une œuvre, mais ne suffisent pas à changer `sourceTier`.

## Contrat d’intégration UI

```js
import {
  LORE_SOURCE_TIERS,
  LORE_CODEX_ENTRIES,
  HUNT_LOCATIONS,
  CURRENT_HUNTS,
  getLoreEntryById
} from './data/LoreCodex.js';
```

Une carte de Codex affiche au minimum `title`, `summary` et le badge de `sourceTier`. Pour une entrée `ORIGINAL`, `basisTier` peut être affiché comme inspiration secondaire, sans jamais remplacer le badge ORIGINAL.

Textes, textures et illustrations du fan game restent des interprétations originales : aucun logo officiel, watermark, copie de texture de film ou reproduction exacte d’un visuel promotionnel.
