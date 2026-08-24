# Yautja: Apex Hunt

Jeu de chasse 3D pour navigateur construit avec Three.js et Vite. Le joueur incarne un chasseur Yautja, forge une apparence modulaire dans le vaisseau-mère, puis affronte huit cibles et des incidents dynamiques dans cinq biomes.

## État du projet

Le code source porte la version 1.5.0 et reste disponible sur [GitHub](https://github.com/darknigthmare/yautja-apex-hunt). Cette vague transforme Wolf en contrat Cleaner complet, ajoute la chasse au Kalisk régénérant sur Genna, étend le Lost Tribe et introduit un registre de couverture par œuvre. Une version n’est considérée comme publiée sur [yautja-apex-hunt.vercel.app](https://yautja-apex-hunt.vercel.app/) qu’après exécution et consignation des contrôles de release ; ce document ne présume pas du résultat d’un déploiement.

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
- huit familles de PNJ 3D, quatre vagues par chasse, incidents déterministes, dangers météo et combat maintenu jusqu’au prélèvement ;
- trois navettes 3D et quatre conteneurs interactifs aux récompenses propres à chaque biome ;
- dix armes jouables sur `1` à `0`, bouclier `[B]`, drone-faucon `[G]`, shuriken `[T]`, camouflage, vision et mimétisme ;
- 38 bio-masques, 50 presets d’armure et neuf axes modulaires : classe, masque, peau, couleur/style de predlocks, couleur/accent/finition d’armure et warpaint ; les huit variantes Lost Tribe sont balisées `LICENSED_SCREEN_DESIGN` ;
- progression d’honneur cumulée, crédits de forge et sauvegarde locale v4 avec migration v1/v2/v3 ;
- catalogue franchise/support au statut explicite : jouable, rencontre 3D, galerie 3D ou archive, complété par un registre de 29 œuvres et médias distinguant publié, coupé, non publié, promotion et crossover séparé ;
- pause, audio, mouvement réduit, fort contraste et échelle du HUD ;
- Codex séparant écran Predator, écran AVP, univers étendu sous licence et créations originales.

## Direction artistique et assets

Les vingt-deux textures de décor, props et créatures sous `public/assets/textures/` sont des créations originales générées avec le modèle ImageGen intégré OpenAI, puis converties en WebP. La vague 1.5 ajoute `wolf-cleaner-alloy.webp`, `lost-tribe-ritual-bone.webp` et `kalisk-adaptive-hide.webp`. Elles ont été produites en nouvelle génération, sans image officielle fournie comme référence ; elles ne transfèrent ni ne revendiquent de droit sur les designs ou marques de la franchise. Les prompts résumés, la provenance et les poids sont consignés dans `ASSET_GENERATION_PROMPTS.md` et `ASSET_MANIFEST.md`.

## Couverture franchise et backlog

Le registre runtime suit 29 œuvres et médias séparément afin de ne pas confondre film sorti, bonus vidéo, scène coupée, projet non publié, promotion, jeu, roman, comic ou crossover. Le fichier `Encyclopedie_exhaustive_franchise_Predator.xlsx` fourni dans la conversation contient 915 éléments uniques et sert de backlog de contrôle. Il n’est pas importé aveuglément : chaque ajout doit conserver une source vérifiable, un niveau de provenance et un statut runtime honnête.

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
