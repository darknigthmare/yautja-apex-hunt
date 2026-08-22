# Yautja: Apex Hunt

Jeu de chasse 3D pour navigateur construit avec Three.js et Vite. Le joueur incarne un chasseur Yautja, prépare son équipement dans le vaisseau-mère, puis affronte quatre cibles dans des biomes distincts.

## État du projet

Le candidat 1.2.0 professionnalise la boucle de jeu, la sauvegarde, le combat des boss, l’accessibilité, le Codex et les décors. Il passe 33 tests Node, le build Vite 8.2.2, l’audit npm à 0 vulnérabilité et les parcours Chromium desktop/mobile ; les neuf textures répondent en HTTP 200 et axe-core ne relève aucune violation. La publication GitHub/Vercel est autorisée par l’utilisateur et reste soumise au dernier gate de production consigné dans `QA_REPORT.md`.

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
- quatre chasses : Goliath Xeno-Akumo, Reine xénomorphe, rival Bad Blood et Predalien ;
- quatre biomes : jungle, ruche, Ryushi et arène de clan ;
- camouflage, modes de vision, huit équipements, combat à distance et mêlée ;
- progression d’honneur, améliorations, apparences et sauvegarde locale versionnée ;
- pause, audio, mouvement réduit, fort contraste et échelle du HUD ;
- Codex séparant écran Predator, écran AVP, univers étendu sous licence et créations originales.

## Direction artistique et assets

Les neuf textures de décor et de props sous `public/assets/textures/` sont des créations originales générées avec le modèle ImageGen intégré OpenAI, puis optimisées en WebP 1024×1024. Les nouvelles matières habillent les trophées, le cuir-filet du joueur et les œufs de facehugger. Aucun asset officiel, logo, key art ou symbole protégé n’a été copié. Les prompts, la provenance et les poids sont consignés dans `ASSET_GENERATION_PROMPTS.md` et `ASSET_MANIFEST.md`.

## Documentation

- `AUDIT_PROFESSIONNEL.md` — constats, priorités et critères de sortie ;
- `GAME_DESIGN_BIBLE.md` — boucle, combat, progression et contrats de gameplay ;
- `ART_DIRECTION_BIBLE.md` — langage visuel et contraintes ;
- `LORE_BIBLE.md` — continuités et décisions canoniques ;
- `QA_REPORT.md` — matrice de validation factuelle ;
- `CHANGELOG_PRO.md` — historique du chantier.

## Mention légale

Projet de fan game non officiel. Predator, Alien, Yautja, Xenomorph et les marques associées appartiennent à leurs ayants droit respectifs. Ce dépôt ne revendique aucun lien, parrainage ou approbation officielle.
