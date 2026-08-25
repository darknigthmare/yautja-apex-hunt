# Yautja: Apex Hunt

Jeu de chasse 3D pour navigateur construit avec Three.js et Vite. Le joueur incarne un chasseur Yautja, forge une apparence modulaire dans le vaisseau-mère, puis affronte huit cibles et des incidents dynamiques dans cinq biomes.

## État du projet

Le code source porte la version 1.7.0 et reste disponible sur [GitHub](https://github.com/darknigthmare/yautja-apex-hunt). Cette vague transforme les cinq cartes en territoires de chasse ouverts et bouclés : grande surface réellement parcourable, neuf secteurs par biome, écologie résidente, événements localisés et migration de la cible Apex. La production officielle reste [yautja-apex-hunt.vercel.app](https://yautja-apex-hunt.vercel.app/).

## Lancer localement

Prérequis : Node.js 20.19+ ou 22.12+.

```bash
npm install
npm run dev
```

Contrôles de release :

```bash
npm test
npm run build
npm audit
```

## Boucle de jeu

- hub du vaisseau-mère, arsenal, forge et trophées persistants ;
- huit chasses : Goliath Xeno-Akumo, Reine xénomorphe, rival Bad Blood, Predalien, Berserker Super Predator, Feral, Wolf Cleaner et Kalisk ;
- cinq biomes : jungle, ruche, Ryushi, arène de clan et monde mortel de Genna ;
- cinq plans déterministes de 630 à 660 unités de rayon, chacun avec neuf secteurs, 12 à 13 routes bouclées, des repères, couvertures extérieures, perches et limites circulaires réellement parcourables ;
- onze familles de PNJ 3D, 12 à 15 créatures résidentes par biome, patrouilles territoriales, migrations de proies, conflits d’écosystème, renforts bornés et combat maintenu jusqu’au prélèvement ;
- trois navettes 3D et quatre conteneurs interactifs aux récompenses propres à chaque biome ;
- dix armes jouables sur `1` à `0`, bouclier `[B]`, drone-faucon `[G]`, shuriken `[T]`, camouflage, vision et mimétisme ;
- 38 bio-masques, 50 presets d’armure et neuf axes modulaires : classe, masque, peau, couleur/style de predlocks, couleur/accent/finition d’armure et warpaint ; les huit variantes Lost Tribe sont balisées `LICENSED_SCREEN_DESIGN` ;
- progression d’honneur cumulée, crédits de forge et sauvegarde locale v4 avec migration v1/v2/v3 ;
- catalogue franchise/support au statut explicite : jouable, rencontre 3D, galerie 3D ou archive, complété par un registre de 29 œuvres et médias distinguant publié, coupé, non publié, promotion et crossover séparé ;
- pause, audio, mouvement réduit, fort contraste et échelle du HUD ;
- Codex séparant écran Predator, écran AVP, univers étendu sous licence et créations originales.

## Direction artistique et assets

Les vingt-six textures de décor, props et créatures sous `public/assets/textures/` sont des créations originales générées avec le modèle ImageGen intégré OpenAI, puis converties en WebP. La vague 1.6 ajoute `ryushi-frontier-panels.webp`, `hive-biomechanical-membrane.webp`, `yautja-ceremonial-bronze.webp` et `genna-spore-pod-hide.webp` pour différencier les constructions humaines, la croissance de ruche, l’architecture cérémonielle et les organismes de Genna. Elles ont été produites en nouvelle génération, sans image officielle fournie comme référence ; elles ne transfèrent ni ne revendiquent de droit sur les designs ou marques de la franchise. Les prompts résumés, la provenance et les poids sont consignés dans `ASSET_GENERATION_PROMPTS.md` et `ASSET_MANIFEST.md`.

## Passe v1.7 — territoires ouverts et boss haute définition

- les cinq cartes passent d’un rayon historique de 300 à des rayons de 630–660, soit environ 1 247 000 à 1 368 000 unités carrées de surface jouable calculée ; même le Scout à 29 unités/s demande au minimum 43 secondes pour traverser un diamètre direct avant relief, détours et combat ;
- chaque biome possède neuf secteurs fonctionnels et 12–13 connexions formant plusieurs boucles : camp, ressources, points hauts, embuscades, croisements, nids, monuments et tanière Apex ne sont plus disposés comme un couloir unique ;
- environ 43 couverts extérieurs par biome sont instanciés autour des secteurs, avec rubans de navigation, balises et nœuds d’événements ; neuf colliders de route sont réservés et distribués sur les neuf secteurs sans dépasser le budget global ;
- les élévations déclarées produisent maintenant des terrasses et crêtes réellement partagées par le terrain, les routes, les props, les acteurs et les collisions ;
- l’écologie initiale place réellement 12 à 15 PNJ dans des territoires éloignés : les créatures patrouillent, détectent le joueur selon sa furtivité, respectent une laisse et reviennent à leur zone ;
- trois silhouettes ambiantes supplémentaires sont jouables par l’IA : coureur xénomorphe, drone sentinelle de clan et brouteur de Genna ;
- le directeur étend la chasse à 190 secondes avec dangers localisés, migrations de proies, conflits de territoires qui produisent de vrais affrontements et déplacement de la cible Apex ;
- les boss ne ciblent plus le joueur depuis l’autre extrémité de la carte : ils occupent une route de cinq territoires sécurisés, contournent les couverts, migrent au fil du temps et à deux seuils de santé, puis engagent à portée ;
- les limites internes fixes à ±330 du joueur et de plusieurs boss sont maintenant pilotées par le rayon réel du biome ;
- les huit boss reçoivent une greffe géométrique haute définition distincte, entre 17 100 et 26 256 triangles au total, avec détails destructibles et compatibilité des visions thermique/camouflage ;
- aucune carte ou géométrie officielle n’est copiée : le benchmark retient les principes publiés par Capcom — carte continue, densité, écosystème, interactions et aides de lecture — puis les applique à des layouts et assets originaux du fan game.

Références de conception consultées : [Capcom — création de Monster Hunter: World](https://www.capcom.co.jp/ir/english/feature/2017_mh_crvoice.html), [Capcom — projet de développement](https://www.capcom.co.jp/recruit/project/monhan-world.html) et [annonce officielle du Wildspire Waste](https://news.capcomusa.com/lets/browse/new-ecosystem-revealed-for-monster-hunter-world-the-wildspire-waste). Ces sources décrivent une direction de design, pas une superficie officielle en kilomètres carrés ; le projet n’invente donc aucune comparaison métrique non publiée.

Gates v1.7 : 218/218 tests, build Vite 8.2.2 de 45 modules, audit de production à 0 vulnérabilité et diff-check propre. Chromium 1280×720 a validé les huit contrats, le lancement Kalisk/Genna, un signal Apex à plus de 800 m, un conflit d’écosystème réel et une console sans erreur applicative. Le commit fonctionnel `94bb326` est poussé sur GitHub ; Vercel a publié `dpl_En8EmhSsfxE7SZFPYEApyYwo134h` en production `READY`, l’alias public répond en HTTP 200 et une chasse Kalisk/Genna y a été relancée sans erreur console.

## Passe v1.6 — props et level design

- les cinq biomes disposent chacun de huit groupes de props, trois points d’intérêt persistants et un à deux dangers localisés ; l’inventaire transverse comprend cinq installations, six sanctuaires et huit signatures de POI distinctes ;
- les règles spatiales réservent des apparitions sûres, éloignent caches et survols du joueur, font participer les couvertures aux projectiles et maintiennent les déplacements dans des limites circulaires ;
- les POI proposent quatre effets bornés : soin/énergie (`decode_record`), scan longue portée (`tune_beacon`), scan local/énergie (`scan_archive`) et endurance/bonus d’honneur (`scan_trophies`) ; leur identifiant est mémorisé dans la sauvegarde v4 additive afin d’empêcher de répéter effet, honneur et sauvegarde après rechargement, sans casser les sauvegardes antérieures ;
- l’instancing des décors statiques retire théoriquement 136 draw calls ; sur Genna, le budget passe de 252 à 89 appels (-64,7 %) grâce à cinq lots et 168 instances, pour 31 889 triangles et 28 plantes ;
- le vaisseau-mère est explorable en WASD/flèches, à la manette et avec des commandes tactiles, dessert quatre stations fonctionnelles et porte un budget de scène de 27 colliders, 273 draw calls et 17 239 triangles ;
- `reducedMotion` fige ou réduit les mouvements décoratifs de l’environnement, du hub, des navettes et des conteneurs sans bloquer leurs états, leurs interactions ni les signaux de danger et de combat.

Les gates v1.6 sont à 193/193 tests, 42 modules Vite, 0 vulnérabilité de production et 11 modules contrôlés syntaxiquement. Chromium desktop a validé le titre, les missions, le hub jouable, les cinq biomes en masque normal et les quatre WebP v1.6 en HTTP 200 local. Le commit fonctionnel `8df30a7` est poussé sur GitHub ; le premier déploiement de validation Vercel `dpl_HgUgNRS9k92Asi1Mq8BNVhCLn6C3` est `READY`, et la page comme les quatre WebP répondent en HTTP 200 sur l’alias public.

## Couverture franchise et backlog

Le registre runtime suit 29 œuvres et médias séparément afin de ne pas confondre film sorti, bonus vidéo, scène coupée, projet non publié, promotion, jeu, roman, comic ou crossover. Le tableur évoqué par l’utilisateur n’était pas accessible dans le workspace ni dans les pièces jointes disponibles pendant cette passe : aucun nombre de lignes et aucun ajout ne lui sont donc attribués. Une future confrontation au classeur devra conserver une source vérifiable, un niveau de provenance et un statut runtime honnête pour chaque élément retenu.

Les principaux lots de contenu encore distincts de cette passe restent une carte urbaine de Gunnison réellement multi-niveaux, des campagnes complètes dédiées à *Killer of Killers* et à *Alien vs. Predator*, ainsi qu’un profilage GPU sur machines modestes avant d’augmenter encore la densité géométrique.

## Documentation

- `AUDIT_PROFESSIONNEL.md` — constats, priorités et critères de sortie ;
- `GAME_DESIGN_BIBLE.md` — boucle, combat, progression et contrats de gameplay ;
- `ART_DIRECTION_BIBLE.md` — langage visuel et contraintes ;
- `LORE_BIBLE.md` — continuités et décisions canoniques ;
- `QA_REPORT.md` — matrice de validation factuelle ;
- `CHANGELOG_PRO.md` — historique du chantier.

## Mention légale

Projet de fan game non officiel. Predator, Alien, Yautja, Xenomorph et les marques associées appartiennent à leurs ayants droit respectifs. Ce dépôt ne revendique aucun lien, parrainage ou approbation officielle.
