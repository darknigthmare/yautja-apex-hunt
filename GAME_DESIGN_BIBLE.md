# Game Design Bible — Yautja: Apex Hunt

**Version :** 1.1 — cible de professionnalisation
**Date :** 21 août 2026
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
| Predalien légendaire | Variante `ORIGINAL`, base `AVP_SCREEN` | Agressivité, mêlée rapprochée et phases terminales. |

Chaque attaque doit respecter le contrat **signal → fenêtre de réaction → impact → récupération**. Les attaques invisibles ou sans délai de réaction sont réservées à aucune difficulté standard.

## Lieux

| Lieu | Fonction de gameplay | Direction de lisibilité |
| --- | --- | --- |
| Jungle de chasse | Couvert, verticalité et humidité. | Sol sombre, troncs lisibles, accents de lichen sarcelle. |
| Ruche LV-426 | Couloirs organiques et danger rapproché. | Résine sombre, silhouettes nervurées, reflets limités. |
| Désert de Ryushi | Lignes de vue et tempête. | Sable rouille, relief minéral et météo réduisible. |
| Arène de Yautja Prime | Duel cérémoniel original. | Pierre basaltique, alliage gunmetal/bronze et accents d'interface. |

Le choix libre d'une cible sur un lieu est une convention de gameplay et ne transforme pas cette combinaison en événement canon.

## Caméra, visée et zoom

La caméra doit conserver la cible et les menaces proches dans le cadre tout en évitant les obstacles. Le zoom acheté doit produire une différence mesurable de FOV ou de distance de visée, fournir un retour HUD et revenir proprement à l'état normal lors d'un changement de mode, d'une pause ou d'une défaite.

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
