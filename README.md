# Yautja: Apex Hunt

Jeu de chasse 3D pour navigateur construit avec Three.js et Vite. Le joueur incarne un chasseur Yautja, forge une apparence modulaire dans le vaisseau-mère, puis affronte cinq cibles et des incidents dynamiques dans quatre biomes.

## État du projet

La version 1.3.0 est publiée sur [yautja-apex-hunt.vercel.app](https://yautja-apex-hunt.vercel.app/) et son code source est disponible sur [GitHub](https://github.com/darknigthmare/yautja-apex-hunt). Cette vague ajoute un cinquième boss, quatre familles de PNJ 3D, des événements de niveau, véhicules, conteneurs, armes et une forge étendue. La release passe 71 tests Node, le build Vite 8.2.2, l’audit npm à 0 vulnérabilité et les parcours Chromium desktop/mobile ; les quinze textures répondent en HTTP 200.

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
- cinq chasses : Goliath Xeno-Akumo, Reine xénomorphe, rival Bad Blood, Predalien et Berserker Super Predator ;
- quatre biomes : jungle, ruche, Ryushi et arène de clan ;
- quatre familles de PNJ 3D, incidents déterministes, dangers météo et combat maintenu jusqu’au prélèvement ;
- trois navettes 3D et quatre conteneurs interactifs aux récompenses propres à chaque biome ;
- dix armes jouables sur `1` à `0`, plus camouflage, vision, mimétisme directionnel et mêlée ;
- 30 bio-masques, 42 presets d’armure et cinq canaux indépendants : masque, peau, dreadlocks, armure et accents ;
- progression d’honneur, améliorations et sauvegarde locale v3 avec migration visuelle v1/v2 ;
- 109 dossiers franchise/support au statut explicite : jouable, rencontre 3D, galerie 3D ou archive ;
- pause, audio, mouvement réduit, fort contraste et échelle du HUD ;
- Codex séparant écran Predator, écran AVP, univers étendu sous licence et créations originales.

## Direction artistique et assets

Les quinze textures de décor, props et créatures sous `public/assets/textures/` sont des créations originales générées avec le modèle ImageGen intégré OpenAI, puis converties en WebP. La vague 1.3 ajoute six matières 1254×1254 pour la peau et le bio-masque Yautja, les carapaces xénomorphes, le Goliath, les hounds et les circuits énergétiques des véhicules/conteneurs. Aucun asset officiel, logo, key art ou symbole protégé n’a été copié. Les prompts, la provenance et les poids sont consignés dans `ASSET_GENERATION_PROMPTS.md` et `ASSET_MANIFEST.md`.

## Documentation

- `AUDIT_PROFESSIONNEL.md` — constats, priorités et critères de sortie ;
- `GAME_DESIGN_BIBLE.md` — boucle, combat, progression et contrats de gameplay ;
- `ART_DIRECTION_BIBLE.md` — langage visuel et contraintes ;
- `LORE_BIBLE.md` — continuités et décisions canoniques ;
- `QA_REPORT.md` — matrice de validation factuelle ;
- `CHANGELOG_PRO.md` — historique du chantier.

## Mention légale

Projet de fan game non officiel. Predator, Alien, Yautja, Xenomorph et les marques associées appartiennent à leurs ayants droit respectifs. Ce dépôt ne revendique aucun lien, parrainage ou approbation officielle.
