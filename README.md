# Yautja: Apex Hunt

Jeu de chasse 3D pour navigateur construit avec Three.js et Vite. Le joueur incarne un chasseur Yautja, forge une apparence modulaire dans le vaisseau-mère, puis affronte huit cibles et des incidents dynamiques dans cinq biomes.

## État du projet

Le code source porte la version 1.6.0 et reste disponible sur [GitHub](https://github.com/darknigthmare/yautja-apex-hunt). Cette vague transforme les cinq cartes et le vaisseau-mère en espaces de chasse plus lisibles : points de repère, couvertures physiques, routes, verticalité, zones dangereuses et archives environnementales interactives. La release 1.6.0 est publiée sur [yautja-apex-hunt.vercel.app](https://yautja-apex-hunt.vercel.app/) après validation des gates locaux, push GitHub et contrôle du déploiement Vercel public.

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
- cinq plans de niveau déterministes avec huit groupes de props par biome, trois points d’intérêt analysables, des couloirs de combat, des couverts qui participent aux collisions et un à deux dangers localisés ;
- huit familles de PNJ 3D, quatre vagues par chasse, incidents déterministes, dangers météo et combat maintenu jusqu’au prélèvement ;
- trois navettes 3D et quatre conteneurs interactifs aux récompenses propres à chaque biome ;
- dix armes jouables sur `1` à `0`, bouclier `[B]`, drone-faucon `[G]`, shuriken `[T]`, camouflage, vision et mimétisme ;
- 38 bio-masques, 50 presets d’armure et neuf axes modulaires : classe, masque, peau, couleur/style de predlocks, couleur/accent/finition d’armure et warpaint ; les huit variantes Lost Tribe sont balisées `LICENSED_SCREEN_DESIGN` ;
- progression d’honneur cumulée, crédits de forge et sauvegarde locale v4 avec migration v1/v2/v3 ;
- catalogue franchise/support au statut explicite : jouable, rencontre 3D, galerie 3D ou archive, complété par un registre de 29 œuvres et médias distinguant publié, coupé, non publié, promotion et crossover séparé ;
- pause, audio, mouvement réduit, fort contraste et échelle du HUD ;
- Codex séparant écran Predator, écran AVP, univers étendu sous licence et créations originales.

## Direction artistique et assets

Les vingt-six textures de décor, props et créatures sous `public/assets/textures/` sont des créations originales générées avec le modèle ImageGen intégré OpenAI, puis converties en WebP. La vague 1.6 ajoute `ryushi-frontier-panels.webp`, `hive-biomechanical-membrane.webp`, `yautja-ceremonial-bronze.webp` et `genna-spore-pod-hide.webp` pour différencier les constructions humaines, la croissance de ruche, l’architecture cérémonielle et les organismes de Genna. Elles ont été produites en nouvelle génération, sans image officielle fournie comme référence ; elles ne transfèrent ni ne revendiquent de droit sur les designs ou marques de la franchise. Les prompts résumés, la provenance et les poids sont consignés dans `ASSET_GENERATION_PROMPTS.md` et `ASSET_MANIFEST.md`.

## Passe v1.6 — props et level design

- les cinq biomes disposent chacun de huit groupes de props, trois points d’intérêt persistants et un à deux dangers localisés ; l’inventaire transverse comprend cinq installations, six sanctuaires et huit signatures de POI distinctes ;
- les règles spatiales réservent des apparitions sûres, éloignent caches et survols du joueur, font participer les couvertures aux projectiles et maintiennent les déplacements dans des limites circulaires ;
- les POI proposent quatre effets bornés : soin/énergie (`decode_record`), scan longue portée (`tune_beacon`), scan local/énergie (`scan_archive`) et endurance/bonus d’honneur (`scan_trophies`) ; leur identifiant est mémorisé dans la sauvegarde v4 additive afin d’empêcher de répéter effet, honneur et sauvegarde après rechargement, sans casser les sauvegardes antérieures ;
- l’instancing des décors statiques retire théoriquement 136 draw calls ; sur Genna, le budget passe de 252 à 89 appels (-64,7 %) grâce à cinq lots et 168 instances, pour 31 889 triangles et 28 plantes ;
- le vaisseau-mère est explorable en WASD/flèches, à la manette et avec des commandes tactiles, dessert quatre stations fonctionnelles et porte un budget de scène de 27 colliders, 273 draw calls et 17 239 triangles ;
- `reducedMotion` fige ou réduit les mouvements décoratifs de l’environnement, du hub, des navettes et des conteneurs sans bloquer leurs états, leurs interactions ni les signaux de danger et de combat.

Les gates v1.6 sont à 193/193 tests, 42 modules Vite, 0 vulnérabilité de production et 11 modules contrôlés syntaxiquement. Chromium desktop a validé le titre, les missions, le hub jouable, les cinq biomes en masque normal et les quatre WebP v1.6 en HTTP 200 local. Le commit `8df30a7` est poussé sur GitHub et la production Vercel `dpl_HgUgNRS9k92Asi1Mq8BNVhCLn6C3` est `READY` ; la page et les quatre WebP répondent en HTTP 200 sur l’alias public.

## Couverture franchise et backlog

Le registre runtime suit 29 œuvres et médias séparément afin de ne pas confondre film sorti, bonus vidéo, scène coupée, projet non publié, promotion, jeu, roman, comic ou crossover. Le tableur évoqué par l’utilisateur n’était pas accessible dans le workspace ni dans les pièces jointes disponibles pendant cette passe : aucun nombre de lignes et aucun ajout ne lui sont donc attribués. Une future confrontation au classeur devra conserver une source vérifiable, un niveau de provenance et un statut runtime honnête pour chaque élément retenu.

Les principaux manques de contenu identifiés après cette passe restent une carte de Gunnison réellement multi-niveaux, des campagnes complètes dédiées à *Killer of Killers* et à *Alien vs. Predator*, ainsi qu’une faune et une flore de Genna plus variées.

## Documentation

- `AUDIT_PROFESSIONNEL.md` — constats, priorités et critères de sortie ;
- `GAME_DESIGN_BIBLE.md` — boucle, combat, progression et contrats de gameplay ;
- `ART_DIRECTION_BIBLE.md` — langage visuel et contraintes ;
- `LORE_BIBLE.md` — continuités et décisions canoniques ;
- `QA_REPORT.md` — matrice de validation factuelle ;
- `CHANGELOG_PRO.md` — historique du chantier.

## Mention légale

Projet de fan game non officiel. Predator, Alien, Yautja, Xenomorph et les marques associées appartiennent à leurs ayants droit respectifs. Ce dépôt ne revendique aucun lien, parrainage ou approbation officielle.
