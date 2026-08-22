# Yautja: Apex Hunt

Jeu de chasse 3D pour navigateur construit avec Three.js et Vite. Le joueur incarne un chasseur Yautja, forge une apparence modulaire dans le vaisseau-mère, puis affronte six cibles et des incidents dynamiques dans cinq biomes.

## État du projet

La version 1.4.0 est la release courante sur [yautja-apex-hunt.vercel.app](https://yautja-apex-hunt.vercel.app/) et son code source est disponible sur [GitHub](https://github.com/darknigthmare/yautja-apex-hunt). Cette vague ajoute le Feral, Genna, quatre nouvelles familles de proies, trois technologies de terrain, quatre classes de chasseur et quatre axes cosmétiques supplémentaires. La release est couverte par 98 tests Node, le build Vite 8.2.2, l’audit npm et des parcours Chromium desktop/mobile.

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
- six chasses : Goliath Xeno-Akumo, Reine xénomorphe, rival Bad Blood, Predalien, Berserker Super Predator et Feral ;
- cinq biomes : jungle, ruche, Ryushi, arène de clan et monde mortel de Genna ;
- huit familles de PNJ 3D, quatre vagues par chasse, incidents déterministes, dangers météo et combat maintenu jusqu’au prélèvement ;
- trois navettes 3D et quatre conteneurs interactifs aux récompenses propres à chaque biome ;
- dix armes jouables sur `1` à `0`, bouclier `[B]`, drone-faucon `[G]`, shuriken `[T]`, camouflage, vision et mimétisme ;
- 30 bio-masques, 42 presets d’armure et neuf axes modulaires : classe, masque, peau, couleur/style de predlocks, couleur/accent/finition d’armure et warpaint ;
- progression d’honneur cumulée, crédits de forge et sauvegarde locale v4 avec migration v1/v2/v3 ;
- 110 dossiers franchise/support au statut explicite : jouable, rencontre 3D, galerie 3D ou archive ;
- pause, audio, mouvement réduit, fort contraste et échelle du HUD ;
- Codex séparant écran Predator, écran AVP, univers étendu sous licence et créations originales.

## Direction artistique et assets

Les dix-neuf textures de décor, props et créatures sous `public/assets/textures/` sont des créations originales générées avec le modèle ImageGen intégré OpenAI, puis converties en WebP. La vague 1.4 ajoute quatre matières 1024×1024 pour le sol et la flore de Genna, le composite osseux du Feral et les unités tactiques humaines. Aucun asset officiel, logo, key art ou symbole protégé n’a été copié. Les prompts, la provenance et les poids sont consignés dans `ASSET_GENERATION_PROMPTS.md` et `ASSET_MANIFEST.md`.

## Documentation

- `AUDIT_PROFESSIONNEL.md` — constats, priorités et critères de sortie ;
- `GAME_DESIGN_BIBLE.md` — boucle, combat, progression et contrats de gameplay ;
- `ART_DIRECTION_BIBLE.md` — langage visuel et contraintes ;
- `LORE_BIBLE.md` — continuités et décisions canoniques ;
- `QA_REPORT.md` — matrice de validation factuelle ;
- `CHANGELOG_PRO.md` — historique du chantier.

## Mention légale

Projet de fan game non officiel. Predator, Alien, Yautja, Xenomorph et les marques associées appartiennent à leurs ayants droit respectifs. Ce dépôt ne revendique aucun lien, parrainage ou approbation officielle.
