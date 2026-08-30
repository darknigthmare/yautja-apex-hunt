# Game Design Bible — Yautja: Apex Hunt

## Contrat de préparation v1.13

Le contrat n’envoie plus le joueur directement sur la planète. La séquence canonique est « contrat → préparation → validation → déploiement ». Le noyau wristblades/biomask/camouflage reste obligatoire ; les cinq familles de slots et le budget de la classe forcent un choix de style. Les recommandations donnent un départ viable sans retirer la maîtrise aux joueurs experts, et les presets accélèrent les chasses répétées. Toute activation en mission doit vérifier le paquetage actif : une entrée HUD masquée n’est jamais considérée comme une protection suffisante.

Le croiseur sert de niveau de respiration et de lisibilité systémique. Ses onze compartiments distribuent préparation, soin, énergie, lore, trophées et déploiement dans des salles identifiables reliées par des coursives, avec plusieurs boucles de navigation et aucun long cul-de-sac obligatoire.

**Version :** 1.12 — Gunnison, chasseur articulé et équipement lisible
**Date :** 28 août 2026
**Règle de lecture :** « actuel » décrit un système présent ou en intégration dans le worktree ; « cible » décrit le comportement de production attendu.

## Vision

Un jeu de chasse 3D court, dense et rejouable où le joueur incarne un chasseur Yautja qui prépare son équipement dans un vaisseau-mère, choisit une proie et un terrain, conduit la traque, puis transforme la victoire en honneur, trophées et nouvelles capacités.

L'expérience doit privilégier trois sensations :

- **préparation consciente** : une arme et un style de chasse ont des conséquences ;
- **prédation lisible** : le joueur observe, approche, frappe et se retire ;
- **trophée mérité** : la victoire valide une maîtrise, pas seulement une barre de vie vidée.

## Boucle principale

1. Explorer le hub et consulter trophées, Codex et arsenal.
2. Choisir une cible et un lieu de chasse.
3. Préparer l'arme, la peau et les améliorations.
4. Pister puis engager la proie en alternant mobilité, camouflage et attaques.
5. Survivre aux phases et signaux propres au boss.
6. Gagner honneur et trophée, sauvegarder la progression et retourner au hub.

Une défaite doit annoncer une cause claire, offrir un redémarrage propre ou un retour au hub, et ne jamais conserver les projectiles ou états transitoires de la tentative précédente.

## Piliers de design

### Chasseur, pas tank

Le déplacement, le choix de distance et le timing priment sur l'échange frontal. Le camouflage aide à contrôler l'engagement sans constituer une invulnérabilité.

### Arsenal complémentaire

| Outil | Rôle cible | Risque ou coût |
| --- | --- | --- |
| Lames de poignet | Mêlée courte, fiable, finition rapide. | Exposition maximale. |
| Fouet | Mêlée étendue et contrôle d'espace. | Fenêtre d'animation plus engageante. |
| Canon à plasma | Pression à distance et dégâts concentrés. | Ressource et télégraphie visuelle. |
| Smart disc | Tir précis ou retour contrôlé. | Trajectoire et récupération. |
| Mines | Préparation de terrain et punition d'une charge. | Temps de pose et quantité limitée. |
| Camouflage | Repositionnement et approche. | Révélation possible par action, environnement ou dégâts. |
| Autodestruction | Défaite volontaire spectaculaire, jamais une stratégie de score. | Issue terminale irréversible de la tentative. |

Les valeurs actuelles des règles de mêlée sont 48 dégâts à 8,5 unités pour les lames et 60 dégâts à 18 unités pour le fouet. Elles constituent une base de test, pas un équilibrage final.

## Honneur et progression

L'honneur est la monnaie de progression. La règle actuelle accorde un bonus visible de 1,5× lorsque l'action est accomplie sans camouflage ; elle encourage la prise de risque sans déclarer qu'il s'agit d'une loi universelle de la culture Yautja.

La progression sauvegardée doit couvrir :

- score d'honneur ;
- améliorations achetées, dont le zoom ;
- peau active ;
- chasses terminées ;
- trophées débloqués ;
- options d'accessibilité et de confort.

Toute migration de sauvegarde doit être versionnée, tolérer une donnée ancienne ou corrompue et revenir à des valeurs sûres.

## Cibles

| Cible | Provenance | Identité de combat cible |
| --- | --- | --- |
| Goliath Xeno-Akumo | `ORIGINAL` | Masse, charges et lecture du terrain ; aucun lien implicite avec les Xénomorphes. |
| Reine xénomorphe | Mission `ORIGINAL`, base `AVP_SCREEN` | Contrôle de zone, queue télégraphiée, pression de ruche. |
| Rival Bad Blood | Personnage `ORIGINAL`, base `LICENSED_EU` | Duel miroir : mêlée, mobilité et projectiles hostiles réellement dommageables. |
| Predalien de Gunnison | Mission `ORIGINAL`, base `AVP_SCREEN` | Verticalité, morsure/frénésie, queue segmentée et phases terminales. |
| Berserker Super Predator | Mission `ORIGINAL`, base `SCREEN` | Duel de chasseur rival, masque destructible et pression de trophée. |
| Feral Predator | Mission `ORIGINAL`, base `SCREEN` | Bouclier, lance, salves de traits et garde rapprochée. |
| Wolf Cleaner | Mission `ORIGINAL`, base `AVP_SCREEN` | Double plasma, fouet, agent de dissolution et kit Cleaner destructible. |
| Kalisk de Genna | Mission `ORIGINAL`, base `SCREEN` | Carapace adaptative, régénération interrompue et noyau exposé. |
| Assassin Predator (2018) | Mission `ORIGINAL`, base `SCREEN` | Bio-armure, bonds télégraphiés et glandes adaptatives destructibles. |
| City Hunter | Mission `ORIGINAL`, base `SCREEN` | Smart disc, filet, Medicomp et verrou multispectral urbain. |
| Grid Alien | Mission `ORIGINAL`, base `AVP_SCREEN` | Dôme et queue destructibles, bond, sang acide et reconfiguration de pyramide. |

Chaque attaque doit respecter le contrat **signal → fenêtre de réaction → impact → récupération**. Les attaques invisibles ou sans délai de réaction sont réservées à aucune difficulté standard.

## Lieux

| Lieu | Fonction de gameplay | Direction de lisibilité |
| --- | --- | --- |
| Jungle de chasse | Couvert, verticalité et humidité. | Sol sombre, troncs lisibles, accents de lichen sarcelle. |
| Ruche LV-426 | Couloirs organiques et danger rapproché. | Résine sombre, silhouettes nervurées, reflets limités. |
| Désert de Ryushi | Lignes de vue et tempête. | Sable rouille, relief minéral et météo réduisible. |
| Arène de Yautja Prime | Duel cérémoniel original. | Pierre basaltique, alliage gunmetal/bronze et accents d'interface. |
| Genna — monde mortel | Écologie adaptative, spores et grande faune. | Sol sombre, bioluminescence chartreuse et silhouettes organiques. |
| Complexe Stargazer | Confinement, évasion et technologie humaine. | Panneaux tactiques, froid clinique et alertes orange. |
| Los Angeles 1997 | Toits, rues, métro et lignes de vue urbaines. | Béton chauffé, sodium, fumée et contrastes de canicule. |
| Bouvetøya | Surface glaciaire et pyramide mobile. | Glace froide, basalte graphite et coutures bronze-noir. |
| Gunnison | Ville pluvieuse, égouts, hôpital et extraction. | Asphalte mouillé, béton froid, urgences rouges et noirs encore lisibles. |

Le choix libre d'une cible sur un lieu est une convention de gameplay et ne transforme pas cette combinaison en événement canon.

## Caméra, visée et zoom

La caméra doit conserver la cible et les menaces proches dans le cadre tout en évitant les obstacles. Le zoom acheté doit produire une différence mesurable de FOV ou de distance de visée, fournir un retour HUD et revenir proprement à l'état normal lors d'un changement de mode, d'une pause ou d'une défaite.

### Contrat de déplacement clavier v1.12

Le repère est exprimé par rapport à la caméra : `Z`, `W` et flèche haut avancent ; `S` et flèche bas reculent ; `Q`, `A` et flèche gauche vont à gauche ; `D` et flèche droite vont à droite. Le tactile et le stick gauche doivent produire les mêmes directions. Une modification de caméra ne doit jamais inverser le signe de l’avant, et les contrôles du hub et de la chasse doivent rester cohérents.

## Contrat v1.12 — chasseur articulé, arsenal et Gunnison

Le personnage joueur n’est plus traité comme une silhouette rigide. Son contrat courant comprend 17 articulations et huit états — repos, marche, sprint, attaque, impact, soin, perchoir et autodestruction. Les transitions doivent préserver la visée, les collisions et les fenêtres de combat. Le budget authored est de 79 286 triangles ; une configuration standard rend 65 092 triangles actifs et le kit Wolf 73 170. Ce niveau de détail reste procédural et original : il ne justifie ni copie ni extraction d’un modèle officiel.

Les lames de poignet doivent se lire comme des armes : profil effilé, tranchants distincts, fourreau, rails, pistons et verrouillages. Chopper utilise une variante à trois longues lames et Wolf une paire renforcée. Canon d’épaule, brassards, armure, grèves et bottes suivent la même règle. Combistick, smart disc, filet, mine, shuriken et roquette possèdent chacun une construction géométrique dédiée ; un volume générique marqué comme équipement n’est pas considéré comme livré.

Le Predalien de Gunnison possède 111 670 triangles dans l’assemblage final de production, distribués sur 150 meshes nommés sans `BoxGeometry` de substitution. Son marquage `nativeHighDetail` empêche la factory d’ajouter la greffe générique historique de 17 910 triangles et 32 draws. Sa lecture de combat repose sur crête/dôme, quatre mandibules, mâchoire interne, quatre tubes dorsaux, membres digitigrades, quatorze predlocks/quilles et douze segments de queue. Respiration, course, morsure/frénésie, balayage et impacts doivent rester visibles sous la pluie et dans les visions alternatives.

Les 31 archétypes de PNJ possèdent un LOD distant simplifié et une hystérésis de transition. Le corpus de référence passe de 499 à 87 draws (−82,57 %) ; chaque archétype doit conserver une réduction d’au moins 75 % à distance sans changer ses statistiques, son comportement ou sa hitbox de gameplay.

Gunnison est un grand niveau ouvert de rayon 760 : dix secteurs, 21 routes bouclées, sept territoires, 19 habitants et huit nœuds d’événements. Ses 17 familles de props, quatre POI et quatre dangers répartissent la chasse entre forêt du crash, cimetière, centrale, rues, égouts, lycée, hôpital, toits et extraction. Les événements ne sont pas de simples messages : blackout et éclairage, rupture de ruche, chute du cordon militaire, sprinklers et extraction de 45 secondes doivent modifier un état runtime puis être nettoyés.

Le contrat de performance statique de Gunnison fixe neuf lots/216 instances, 180 appels de rendu maximum, 220 000 triangles maximum et 72 colliders. L’état de construction mesuré est 166 appels, 66 082 triangles et 72 colliders. Les PNJ distants doivent pouvoir employer une silhouette simplifiée avec hystérésis afin de contenir les appels de rendu sans faire disparaître les menaces. Ces valeurs n’équivalent pas à un profilage GPU matériel.

## Contrat v1.7 — surface, écologie et cible Apex

Un terrain de chasse ne peut plus être qualifié de grand uniquement parce que son mesh est large. Le socle v1.7 exigeait simultanément : rayon jouable de 630 à 660 unités, neuf secteurs nommés, au moins douze connexions, plusieurs cycles dans le graphe, un camp distinct de la tanière, six nœuds d’événements, cinq étapes de migration du boss et une traversée directe d’au moins 43 secondes même avec le Scout à 29 unités/s. Les extensions 1.9–1.12 montent jusqu’à 760 unités, dix secteurs et 21 routes tout en conservant ces principes.

Les routes sont des aides de lecture et non des murs : le joueur peut couper à travers les sous-biomes, contourner les couverts et choisir plusieurs accès. Les balises, silhouettes hautes, points d’intérêt et événements compensent la densité sans imposer un corridor. Chaque secteur conserve au moins un couvert physique distribué ; les élévations macro affectent terrain, pistes et acteurs. Les limites de déplacement sont dérivées du biome et réappliquées circulairement par l’environnement.

Chaque carte démarre avec 12 à 15 formes de vie non-boss réparties dans des territoires. Une entité ambiante patrouille tant que le joueur est hors de sa portée, s’alerte en fonction de la furtivité, poursuit dans sa zone puis retourne à son centre lorsque la laisse est dépassée. Les renforts scénarisés restent bornés ; ils ne remplacent pas la population initiale.

Le calendrier d’événements dure 190 secondes et alterne météo, caches, perturbations localisées, migrations de proies, affrontements territoriaux et mouvement de la cible Apex. Un événement est livré seulement s’il possède une position monde, un effet runtime et un nettoyage au delta ; un message HUD seul ne suffit pas.

La cible Apex possède cinq territoires. Elle reste passive et migre lorsque le joueur est hors détection, engage à portée, rompt le combat à deux seuils de santé et peut être déplacée par un événement. Elle ne doit jamais poursuivre le joueur globalement depuis le chargement de la carte.

Les boss utilisent une greffe HD distincte avec un plancher de 10 000 triangles ajoutés et un plafond de production contrôlé. Les détails doivent respecter silhouette, équipements majeurs et parties destructibles, tout en conservant les modes de vision et le nettoyage GPU. La fidélité n’autorise ni extraction ni copie d’un modèle officiel.

Le benchmark *Monster Hunter: World* porte sur des principes documentés — continuité, écosystème, densité et navigation — et non sur une valeur de superficie non publiée. Les cinq layouts restent des créations originales adaptées à la boucle Yautja.

## Contrat v1.6 — espace, POI et performance

Chaque biome doit conserver un squelette de production comparable sans devenir interchangeable : huit groupes de props, trois POI analysables et un à deux dangers. Le portefeuille global impose au moins cinq installations, six sanctuaires et huit signatures de POI distinctes. Les POI donnent une récompense et un fragment de narration environnementale lors de la première analyse ; leur identifiant rejoint la sauvegarde v4 additive afin qu’un rechargement ne permette de répéter ni l’effet, ni l’honneur, ni la sauvegarde associée.

Les quatre profils d’analyse ont un impact mesurable et borné par les maximums du joueur : `decode_record` demande jusqu’à +30 santé et +25 énergie ; `tune_beacon` active le scan existant pendant 10 s à 150 m ; `scan_archive` demande jusqu’à +18 énergie et un scan de 4 s à 75 m ; `scan_trophies` demande jusqu’à +40 endurance et porte la récompense d’honneur du POI à ×1,2. Le HUD affiche les gains réellement obtenus, le nombre de signatures révélé et les paramètres du scan.

Le directeur de niveau doit choisir des apparitions sûres hors de la proximité immédiate du joueur. Les caches et flybys utilisent également une distance minimale. Les couvertures majeures bloquent les projectiles selon leur volume déclaré, et les déplacements de chasse restent dans des limites circulaires explicites. Ces garde-fous participent au combat : ils ne sont pas de simples annotations de catalogue.

Le hub est une petite scène jouable, pas un menu figé : déplacement WASD/flèches, manette ou commandes tactiles, quatre stations identifiables, 27 colliders, 273 draw calls budgétés et 17 239 triangles. La touche `E`, le bouton principal de la manette et l’action tactile utilisent la station proche ; `P`/`Échap`, Start/Select ou le bouton tactile ouvrent la console. Sa circulation doit rester lisible avant d’ajouter de nouveaux ornements.

Les éléments statiques répétés doivent utiliser l’instancing lorsqu’ils partagent géométrie et matériau. Le gain v1.6 représente 136 draw calls théoriques ; Genna sert de référence avec cinq lots et 168 instances, passant de 252 à 89 appels (-64,7 %) pour 31 889 triangles et 28 plantes. Ces nombres sont des budgets de construction, pas un profilage GPU sur toutes les machines.

L’option `reducedMotion` réduit ou fige spores, météo, oscillations du hub, flottement/roulis des navettes et pulsations des conteneurs. Elle ne bloque pas les transitions d’état ni les interactions ; les frontières de danger, impacts et signaux nécessaires au combat restent lisibles.

## États de partie

Le contrôleur respecte une machine d'états simple :

`HUB → PRÉPARATION → CHASSE → VICTOIRE ou DÉFAITE → HUB/RECOMMENCER`

`PAUSE` suspend la simulation sans effacer l'état. L'autodestruction passe une seule fois de `CHASSE` à `DÉFAITE`; elle ne doit ni boucler l'audio ni accorder une victoire.

## Interface et accessibilité

L'interface cible inclut :

- pause, reprise et abandon clairement séparés ;
- audio activable ;
- mouvement réduit qui limite météo et animations non essentielles ;
- fort contraste ;
- échelle de HUD persistante ;
- navigation clavier cohérente et focus visible ;
- textes lisibles sur desktop et écrans étroits ;
- Codex avec badge de provenance du lore.

Le mouvement réduit ne ralentit pas les signaux de combat indispensables ; il réduit surtout les particules, oscillations et transitions décoratives.

## Lore et continuités

Les niveaux `SCREEN`, `AVP_SCREEN`, `LICENSED_EU` et `ORIGINAL` définis dans `LORE_BIBLE.md` sont obligatoires. Une création originale inspirée d'AVP reste affichée comme `ORIGINAL` avec une base secondaire. Le jeu ne présente pas les conventions de rang, le code d'honneur EU ou Yautja Prime comme des faits universels confirmés à l'écran.

## Longévité

La rejouabilité vient d'abord de combinaisons cible/lieu, styles d'armes, chasse visible ou camouflée et objectifs de maîtrise. Avant d'ajouter du contenu, chaque chasse existante doit avoir : une identité mécanique, un trophée, un retour de progression, une sauvegarde et une validation runtime.

## Définition de terminé

Une fonctionnalité n'est terminée que si elle est visible dans le jeu, couverte par une validation proportionnée, persistante lorsque nécessaire et documentée. Une donnée, un bouton ou un flag sans effet runtime n'est pas une fonctionnalité livrée.
