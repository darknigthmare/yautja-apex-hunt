# Bible de lore — Yautja: Apex Hunt

Cette bible empêche de mélanger films Predator, crossovers AVP, univers étendu sous licence et inventions du fan game comme s’ils formaient une continuité unique. Le projet peut utiliser ces quatre couches, mais leur provenance doit rester visible.

## Niveaux de provenance

| Niveau | Contenu | Règle |
| --- | --- | --- |
| `SCREEN` | Films Predator ou Alien officiels, hors crossovers AVP | Source écran principale ; une entrée précise toujours de quelle franchise vient son fondement. |
| `AVP_SCREEN` | Films Alien vs. Predator | Branche crossover distincte ; elle ne réécrit pas automatiquement les continuités principales. |
| `LICENSED_SCREEN_DESIGN` | Nom ou détail de design sous licence rattaché à une silhouette ou un accessoire écran | Documente un design commercial ou éditorial ; ne transforme pas les détails invisibles au montage en faits `SCREEN`. |
| `LICENSED_EU` | Romans, comics et jeux sous licence | Inspiration permise avec badge EU ; ses règles ne sont pas universalisées. |
| `MERCH_CONCEPT` | Concept ou accessoire de collection sous licence | Référence de design uniquement ; aucune utilisation à l’écran n’est affirmée sans source distincte. |
| `ORIGINAL` | Créations de Yautja: Apex Hunt | Nom, mission, lieu ou interprétation propre au jeu ; badge toujours visible. |

Dans `src/data/LoreCodex.js`, `sourceTier` qualifie l’entrée exacte. `basisTier` peut signaler sa source d’inspiration et `relatedTier` une continuité associée. Une mission inventée reste donc `ORIGINAL`, même lorsque sa créature vient de `SCREEN` ou de `AVP_SCREEN`.

## Décisions canoniques

### Yautja, code et honneur

Le mot **Yautja**, établi dans la fiction sous licence autour de *Aliens vs. Predator: Prey*, est désormais aussi un terme écran : Disney l’emploie explicitement pour l’espèce dans *Predator: Badlands*. Ce passage du vocabulaire vers l’écran ne rend pas rétroactivement canons les règles, rangs ou événements des romans et comics.

Les films établissent une chasse ritualisée, la recherche d’adversaires dangereux, les trophées et certains gestes de reconnaissance. Ils ne donnent pas une liste universelle de règles. Le jeu n’affirme donc pas que chaque Yautja :

- refuse toujours de tuer une cible désarmée, malade ou enceinte ;
- combat obligatoirement avec une arme de puissance égale ;
- n’attaque jamais sous camouflage ;
- suit une hiérarchie et une peine identiques dans tous les clans ;
- déclenche son autodestruction pour une seule raison religieuse certaine.

Ces comportements peuvent appartenir à un individu ou à un clan, sans devenir une loi biologique de l’espèce.

### Première chasse, progression et clans

La présentation officielle de *Badlands* précise que Dek n’a encore jamais chassé et n’a gagné ni camouflage ni canon d’épaule. Cette base `SCREEN` justifie une progression d’équipement propre à ce jeune chasseur ; elle ne prouve pas que tous les clans distribuent leurs armes selon un arbre de rangs identique. La pyramide, les Xénomorphes semés et l’épreuve de passage de *Alien vs. Predator* restent `AVP_SCREEN`.

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

Le terme **kiande amedha**, Ryushi et de nombreux détails de castes ou de marquage restent `LICENSED_EU`. Le Predalien, Wolf et l’épidémie de Gunnison existent dans `AVP_SCREEN`, mais la topologie ouverte, les événements, les statistiques et les géométries procédurales de leur adaptation dans le jeu sont `ORIGINAL`.

## Lieux de chasse actuels

| ID runtime | Nom | Provenance jouable | Note |
| --- | --- | --- | --- |
| `jungle` | Jungle de chasse | `ORIGINAL`, base `SCREEN` | Arène du jeu inspirée des jungles et pistes thermiques des films. |
| `hive_lv426` | LV-426 — ruches souterraines | `ORIGINAL`, base `SCREEN`, relation `AVP_SCREEN` | LV-426 et sa colonie viennent d’*Alien/Aliens* ; cette chasse Yautja, la pluie acide et cette carte sont inventées. |
| `ryushi_desert` | Désert de Ryushi | `LICENSED_EU` | Ryushi vient des comics/du roman AVP ; tempête et arène sont une interprétation originale. |
| `yautja_prime` | Yautja Prime — arène du clan | `ORIGINAL`, base `SCREEN` | *Badlands* établit Yautja Prime et le domaine natal de Dek, mais ni ce colisée sacré ni ce conseil d’Anciens. |
| `genna_deathworld` | Genna — monde mortel | `ORIGINAL`, base `SCREEN` | Genna vient de *Badlands* ; la topologie, les vagues et l’écosystème jouables sont une adaptation originale et encore partielle. |
| `stargazer_blacksite` | Complexe de confinement Stargazer | `ORIGINAL`, base `SCREEN` | Stargazer et l’incident du Fugitive viennent de *The Predator* ; cette installation, sa brèche, ses routes et ses props sont originaux. |
| `los_angeles_1997` | Los Angeles — chasse de chaleur | `ORIGINAL`, base `SCREEN` | La chasse urbaine vient de *Predator 2* ; la carte ouverte, les événements et le duel de clan ne reproduisent pas le film. |
| `bouvetoya_pyramid` | Bouvetøya — pyramide du Blooding | `ORIGINAL`, base `AVP_SCREEN` | L’île, l’expédition et la pyramide viennent d’*AVP* ; ces secteurs, routes, reconfigurations et contrats sont une adaptation originale. |
| `gunnison_outbreak` | Gunnison — nuit de l’épidémie | `ORIGINAL`, base `AVP_SCREEN` | Gunnison, le crash, Wolf et le Predalien viennent d’*AVP: Requiem* ; les dix secteurs, 21 routes, événements et compte à rebours appartiennent à *Apex Hunt*. |

Le sélecteur autorise toute cible sur tout lieu. Cette liberté de gameplay ne crée pas un événement canon.

### Contrat spatial et environnemental v1.6

Les architectures, itinéraires, archives interactives et dangers de la passe level design sont des compositions de gameplay. Un prop inspiré d’un vocabulaire visuel écran ne prouve ni qu’un événement précis a eu lieu, ni que tous les clans bâtissent et chassent de la même manière.

- **Jungle :** porte rituelle, camp humain abandonné, arbre à trophées et traces de plasma organisent une chasse `ORIGINAL` sur une base de jungle `SCREEN` ; les trois itinéraires et les prises anciennes appartiennent au récit de cette carte.
- **LV-426 :** sas colonial, nursery, estrade royale, cocons et résidus Cleaner réunissent des éléments `SCREEN`/`AVP_SCREEN` dans une carte `ORIGINAL` ; les journaux, la position de la ruche et le passage antérieur d’un Cleaner ne sont pas des événements de film revendiqués.
- **Ryushi :** homestead, château d’eau, enclos et galeries condamnées prolongent le cadre `LICENSED_EU` ; la topologie, la balise sismique, le crawler et la trace de blooding sont propres au jeu.
- **Yautja Prime :** porte des Anciens, dais de blooding, sanctuaire d’armes et galerie de lignée sont `ORIGINAL` sur une base `SCREEN` ; leurs inscriptions décrivent le clan joué, pas une loi universelle de l’espèce.
- **Genna :** épave d’expédition, aire du Kalisk, réseau synthétique et organismes régénératifs adaptent un monde `SCREEN` dans une composition `ORIGINAL` ; les relevés, l’échec du confinement et l’emplacement du nid restent propres au contrat jouable.

Le vaisseau-mère suit la même règle : sa forge, son armurerie, sa galerie de trophées, ses balises et son organisation intérieure servent la navigation et la progression d’*Apex Hunt*. Ils ne constituent pas un plan canonique d’un appareil vu dans un film. Les quatre matières OpenAI de cette passe sont elles aussi des créations originales : elles évoquent des fonctions de décor sans reproduire un panneau, une membrane, un symbole ou un accessoire officiel précis.

### Provenance des POI et props v1.6

Les cinq installations, six sanctuaires et huit signatures de POI sont des outils de différenciation et de narration environnementale d’*Apex Hunt*. Leur présence persistante dans la sauvegarde v4, leur récompense anti-farm et leurs quatre effets — récupération de santé/énergie, scans tactiques ou endurance/bonus d’honneur — relèvent entièrement du gameplay. Ces quantités et effets ne décrivent ni une technologie médicale canonique, ni une organisation certaine des clans, ni l’architecture d’un monde ou vaisseau officiel.

Chaque décor conserve le tier de sa fiche ou de son biome : `SCREEN`, `AVP_SCREEN`, `LICENSED_SCREEN_DESIGN`, `LICENSED_EU`, `MERCH_CONCEPT` ou `ORIGINAL`. Un matériau inspiré d’un média écran ne change pas une disposition de niveau `ORIGINAL` en événement canonique. Les quatre textures OpenAI de la v1.6 sont des créations fan-made originales, sans revendication de droits sur les designs de Predator ou Alien.

### Contrat de provenance Gunnison v1.12

La carte `gunnison_outbreak` adapte des motifs d’*Aliens vs. Predator: Requiem* sans prétendre reproduire sa géographie ni sa chronologie. Forêt du crash, cimetière, centrale, ville, égouts, lycée, hôpital, toits et extraction sont répartis en dix secteurs reliés par 21 routes pour les besoins du jeu. Les sept territoires, 19 habitants, huit nœuds d’événements, quatre POI, quatre dangers et la directive en quatre vagues sont donc `ORIGINAL`, avec `basisTier: AVP_SCREEN`.

Les éléments écran conservés comme base sont Wolf, le Predalien, l’épidémie, la Garde nationale, le signal de détresse, l’équipement Cleaner et le contexte urbain pluvieux. Le gantelet de puissance, les mines, l’armure anti-acide, la seringue et le vaisseau sont décrits selon leur fiche `AVP_SCREEN` ou `LICENSED_SCREEN_DESIGN`; leurs valeurs, interactions, emplacements et géométries sont des implémentations de gameplay originales. Le blackout, la rupture de ruche, l’effondrement militaire, les sprinklers et l’extraction chronométrée ne sont pas présentés comme le déroulé canonique du film.

La matière `gunnison-rain-urban.webp`, les bâtiments, véhicules et props sont des créations OpenAI ou procédurales originales. Aucun décor, modèle, logo, plan de ville, image ou texture officielle d’*AVP:R* n’est intégré. La silhouette haute densité du Predalien suit les traits généraux de sa branche écran — dôme/crête, mandibules, predlocks, tubes dorsaux, membres digitigrades et queue — mais ses 150 meshes, ses 111 670 triangles assemblés et ses animations sont construits pour ce fan game.

## Cibles actuelles

| ID runtime | Cible | Provenance de la mission | Règle |
| --- | --- | --- | --- |
| `goliath` | Goliath Xeno-Akumo | `ORIGINAL` | Nom, espèce, anatomie, origine et chasse créés pour le jeu. |
| `xeno_queen` | Reine xénomorphe | `ORIGINAL`, base `SCREEN`, relation `AVP_SCREEN` | La Reine vient d’*Aliens* et apparaît aussi dans *AVP* ; combat, arène et récompense actuels sont originaux. |
| `bad_blood` | Rival Yautja Bad Blood | `ORIGINAL`, base `LICENSED_EU` | Le personnage précis est inventé ; Bad Blood n’est pas une caste écran universelle. |
| `predalien` | Predalien — toit de Gunnison | `ORIGINAL`, base `AVP_SCREEN` | Le type et l’épidémie existent dans *AVP: Requiem* ; topologie, événements, statistiques et combat procédural sont propres au jeu. |
| `super_predator` | Berserker Super Predator | `ORIGINAL`, base `SCREEN` | Le Berserker et le conflit de groupes viennent de *Predators* ; ce contrat et ses phases sont une adaptation de gameplay. |
| `feral_predator` | Feral Predator | `ORIGINAL`, base `SCREEN` | Le chasseur vient de *Prey* ; la mission, l’arène et la progression du combat sont propres au jeu. |
| `wolf_cleaner` | Wolf — opération Cleaner | `ORIGINAL`, base `AVP_SCREEN` | Wolf et son arsenal viennent d’*AVP: Requiem* ; ce duel et ses systèmes destructibles sont une adaptation jouable originale. |
| `kalisk` | Kalisk de Genna | `ORIGINAL`, base `SCREEN` | L’espèce et sa régénération viennent de *Badlands* ; les phases, le noyau exposé et l’équilibrage appartiennent au jeu. |
| `upgrade_predator` | Assassin Predator — brèche Stargazer | `ORIGINAL`, base `SCREEN` | Le personnage vient de *The Predator* ; bio-armure segmentée, glandes destructibles, arène et contrat sont adaptés au gameplay. |
| `city_hunter` | City Hunter — épreuve urbaine 1997 | `ORIGINAL`, base `SCREEN` | Le chasseur et son arsenal viennent de *Predator 2* ; ce duel, ses statistiques et ses événements ne rejouent pas le film. |
| `grid_alien` | Grid Alien — champion de Bouvetøya | `ORIGINAL`, base `AVP_SCREEN` | Grid et sa cicatrice viennent d’*AVP* ; ses phases, faiblesses, routes et récompenses sont une adaptation originale. |

### Goliath Xeno-Akumo

**Goliath Xeno-Akumo doit toujours porter le badge `ORIGINAL`.** Le préfixe « Xeno » signifie seulement « étranger » dans la fiction du jeu ; il ne doit pas faire croire à un lien avec le cycle biologique des Xénomorphes d’Alien. Sa planète, ses cornes, sa reproduction, son origine et son éventuel lien aux Yautja restent originaux jusqu’à décision éditoriale explicite.

## Contrat du catalogue d’armures

`src/data/YautjaLoreDatabase.js` conserve les vingt silhouettes historiques, mais associe désormais chacune à `SCREEN`, `AVP_SCREEN`, `LICENSED_EU` ou `ORIGINAL`. Les corrections suivantes constituent le contrat éditorial du catalogue :

- `jungle_1987` reste `SCREEN` et situe la chasse dans une jungle centraméricaine non nommée à l’écran, sans transformer « Val Verde » en lieu du film.
- `scar_avp` reste `AVP_SCREEN` : le marquage au sang acide est montré, mais aucun rôle de « leader des Jeunes Sangs » n’est affirmé.
- `chopper_avp` nomme ses longues lames de poignet sans inventer des scies d’épaule.
- `berserker_2010` conserve un ornement mandibulaire osseux dont l’origine n’est pas identifiée comme xénomorphe.
- `fugitive_2018` décrit seulement l’équipement métallique visible et ne revendique plus une armure dorée.
- `feral_2022` conserve le **bone mask** officiel sans identifier arbitrairement l’espèce dont vient l’os.
- `alpha_yautja` est `LICENSED_EU` : concept original NECA ensuite intégré à *Predator: Hunting Grounds*, pas origine `SCREEN` de l’espèce.
- `ahab_comic` est `LICENSED_EU` : ancien borgne dont la quête vise un Engineer, pas un aveugle spécialisé dans les Reines.
- `dark_avp2010` est le personnage jouable licencié déployé sur BG-386, sans rang d’« élite de la pyramide » non sourcé.
- `samurai_yautja` et `viking_yautja` sont des classes `LICENSED_EU` de *Predator: Hunting Grounds* ; elles ne sont pas assimilées aux personnages écran de *Killer of Killers*.
- `cyborg_yautja` est une création `ORIGINAL` d’Apex Hunt tant qu’aucun personnage licencié précis n’est revendiqué.
- `deadend_fanfilm` est un hommage `ORIGINAL` explicitement non licencié à *Batman: Dead End* (2003), hors continuités officielles.

Règle de maintenance : chaque carte garde un `sourceTier`, une œuvre précise et une description limitée à ce que cette œuvre établit. Un intitulé marketing, un surnom de figurine et un rang culturel ne sont pas interchangeables.

### Contrat Lost Tribe 1.5

Boar, Shaman, Snake, Guardian, Stalker, Warrior, Armored Lost et Scout sont disponibles comme presets et bio-masques. Leur niveau `LICENSED_SCREEN_DESIGN` signifie précisément que les silhouettes appartiennent à la scène du vaisseau de *Predator 2*, tandis que leurs noms, détails d’armure et accessoires sont documentés par des designs sous licence. Le jeu ne présente donc pas chaque détail de figurine comme un fait lisible dans le montage. L’Ancien du Lost Tribe reste `SCREEN` ; un accessoire de collection non attesté à l’écran reste `MERCH_CONCEPT`.

## Registre par œuvre et média

`src/data/MediaCoverageCatalog.js` suit 29 œuvres ou objets médiatiques sans les fusionner en une continuité unique. Chaque fiche sépare provenance, continuité, cible de contenu et avancement dans le jeu. Les statuts de sortie ont une fonction éditoriale stricte :

- `RELEASED` : œuvre publiée, sans implication qu’elle soit entièrement adaptée ;
- `CUT` : élément coupé du montage, jamais utilisé comme preuve écran ;
- `UNRELEASED` : projet non publié, conservé seulement comme archive de production ;
- `PROMO` : contenu promotionnel isolé du lore jouable ;
- `ALT_CROSSOVER` : crossover référencé sans fusion avec la continuité principale.

Le classeur de la conversation ChatGPT a depuis été retrouvé et réellement lu sous `C:\Users\chuck\Downloads\Encyclopedie_exhaustive_franchise_Predator.xlsx`. Son SHA-256 est `47C659F4F79CA0E71D8B8B7B8DB2CD7B7363827224BC081D59E9DD9D9576983C` ; il comprend 20 feuilles et 915 entrées uniques et provient de la [conversation ChatGPT source](https://chatgpt.com/c/6a8adeed-b6f8-83ed-9d07-5088fa50b8a9).

Le lot Gunnison/AVP:R rapproche les plages `Lieux!A20:Q20`, `A29:Q29`, `A41:Q41`, `A49:Q51`, `A62:Q62`, `A105:Q105`, `A115:Q119` ; `Armes!A45:Q45`, `A50:Q50`, `A58:Q59`, `A78:Q79` ; `Équipements!A5:Q5`, `A13:Q14`, `A35:Q35`, `A40:Q40`, `A61:Q61` ; `Véhicules!A38:Q48`, `A64:Q64` ; `Masques!A61:Q61` ; `Peaux!A36:Q36` ; `Dreads!A10:Q10`, `A45:Q45` et `Rituels!A33:Q33`. Le classeur est un inventaire de production secondaire, pas une autorité canonique : chaque ligne retenue doit toujours recevoir une œuvre, une provenance et un statut runtime indépendants.

## Limites de couverture assumées

- *Killer of Killers* et *Alien vs. Predator* disposent de jalons dans le catalogue, mais pas encore de campagnes complètes ;
- Genna possède un biome et le Kalisk jouable, mais sa faune et sa flore demandent davantage d’espèces et de comportements distincts.
- Gunnison possède désormais un niveau multi-zones ; ses intérieurs, variantes d’événements et performances sur GPU modestes demandent encore une passe dédiée avant toute nouvelle hausse de densité.

### Sources primaires de contrôle pour le catalogue

- [Alpha Predator — concept original NECA](https://necaonline.com/2020/01/predator-7-scale-action-figure-ultimate-alpha-predator-100th-edition-figure/)
- [Alpha Predator dans Predator: Hunting Grounds — NECA/IllFonic](https://necaonline.com/2020/06/the-alpha-is-coming-to-predator-hunting-grounds/)
- [Feral Predator — masque en os, NECA](https://store.necaonline.com/products/prey-ultimate-camo-reveal-feral-predator-scale-action-figure-2024-con-exclusive)
- [Ahab Predator — ancien de *Fire and Stone*, NECA](https://store.necaonline.com/blogs/san-diego-comic-con/sdcc-feature-friday-4-exclusive-fire-and-stone-ahab-predator-action-figure)
- [Ahab Predator — équipement d’Engineer, NECA](https://necaonline.com/2017/05/predator-7-scale-action-figure-ultimate-ahab-predator/)
- [Scarface — *Predator: Concrete Jungle*, NECA](https://store.necaonline.com/blogs/behind-the-scenes/closer-look-video-game-appearance-ultimate-scarface-predator)
- [Machiko Noguchi et Ryushi — omnibus AVP, Titan Books](https://titanbooks.com/8792-the-complete-aliens-vs-predator-omnibus/)
- [Samurai Predator — Predator: Hunting Grounds, NECA](https://store.necaonline.com/products/predator-hunting-grounds-ultimate-samurai-predator-7-inch-scale-action-figure)
- [Viking Predator — Predator: Hunting Grounds, IllFonic](https://predator.illfonic.com/)

## Sources officielles et sources de contrôle

### Écran Predator

- [Predator (1987) — 20th Century Studios](https://www.20thcenturystudios.com/movies/predator)
- [Predator — Walt Disney Archives](https://thewaltdisneycompany.com/news/predator-archives/)
- [Predator 2 (1990) — 20th Century Studios](https://www.20thcenturystudios.com/movies/predator-2)
- [Predators (2010) — 20th Century Studios](https://www.20thcenturystudios.com/movies/predators)
- [Prey (2022) — 20th Century Studios](https://www.20thcenturystudios.com/movies/prey)
- [Predator: Killer of Killers (2025) — 20th Century Studios](https://www.20thcenturystudios.com/movies/predator-killer-of-killers)
- [Predator: Badlands (2025) — The Walt Disney Company](https://thewaltdisneycompany.com/news/predator-badlands/)

### Écran Alien

- [Aliens (1986) — 20th Century Studios](https://www.20thcenturystudios.com/movies/aliens)

### Branche AVP

- [Alien vs. Predator (2004) — 20th Century Studios](https://www.20thcenturystudios.com/movies/alien-vs-predator)
- [Aliens vs. Predator: Requiem (2007) — 20th Century Studios](https://www.20thcenturystudios.com/movies/aliens-vs-predator-requiem)

### Univers étendu sous licence

- [Predator: Hunting Grounds — arsenal IllFonic](https://predator.illfonic.com/the-predator/)
- [AVP — comics originaux Dark Horse](https://digital.darkhorse.com/books/47483ce0aec5466783599e38c9d0ac47/aliens-vs-predator-the-original-comics-series-30th-anniversary-edition)
- [Aliens vs. Predator: Prey — omnibus sous licence Titan Books](https://titanbooks.com/8792-the-complete-aliens-vs-predator-omnibus/)
- [Predator: Bad Blood #1–4 — catalogue officiel Dark Horse, Omnibus vol. 3](https://images.darkhorse.com/common/salestools/catalogs/DH_Backlist_2009.pdf)

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
