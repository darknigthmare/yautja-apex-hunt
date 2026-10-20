# Refonte du héros — 20 octobre 2026

Base visuelle : `673e028`, après la première passe graphique. Cette reprise cible le héros : la silhouette faite de volumes indépendants et les matières plaquées sur chaque primitive restaient trop proches d'une figurine.

## Forme et construction

- Rig conservé, proportions reprises : hauteur nominale 7,21 unités, tête portée de 0,94 unité, soit 7,67 têtes contre environ 3,94 avant ; épaules et mains réduites, bras et jambes allongés. La position de gameplay ne change pas et les semelles arrivent à l'origine du joueur.
- Corps organique continu construit dans Blender : union volumique de l'anatomie, sculpture haute définition, maillage décimé de **49 998 triangles**, quinze articulations pondérées, cinq charts UV. Le torse, le cou et les membres remplacent treize anciennes surfaces visibles après chargement du GLB. Tête, mains, pieds et équipements restent des éléments articulés distincts.
- Crâne et mains obtenus par surfaces implicites continues. Paumes, attaches des doigts et phalanges se raccordent ; mandibules et défenses biologiques existent pour les masques ouverts. Les masques fermés les occultent.
- Biomask avec véritables ouvertures orbitales et respirateurs, inserts sombres en retrait et cadre ajusté. La projection du crâne suit son volume ; elle ne comprime plus la texture sur les tempes.
- Armure ajustée aux volumes : épaulières enveloppantes, plastron, segments abdominaux, avant-bras, genouillères, grèves et bottes avec bords, doublures et semelles distincts. Sangles rapprochées des plaques et rivets dorsaux raccordés. Les lames de poignet se déploient le long de l'avant-bras.

## Matières

Le GLB contient trois textures 2048² : albedo, normales et occlusion, calculées depuis la sculpture. La couleur de peau s'appuie sur une nouvelle source ImageGen originale de 1254², également livrée en WebP pour les mains et le crâne.

Huit régions ont des réponses propres : peau, masque, métal peint, métal exposé, cuir, os, predlocks et caoutchouc. Albedo, microrelief et rugosité sont corrélés. L'os et les autres matières non métalliques gardent une métallicité nulle lors des changements de finition. Les images historiques de panneaux industriels ne remplacent plus les textures anatomiques des presets.

Les éraflures du masque sont atténuées ; les éclats de peinture de l'armure deviennent petits et rares. Le métal majoritairement exposé occupe moins de 3 % de la carte, vérifié à 512² et 1024². Les palettes de personnalisation conservent leurs couleurs exactes et le matériau du corps conserve son correctif de teinte au chargement.

## Animation et vérification

Le corps est lié aux groupes articulaires du jeu depuis les positions de repos, même si le téléchargement finit pendant une animation. Le chargement restaure les noms d'articulations modifiés par GLTFLoader sans changer l'ordre des indices. Les shaders de camouflage et de vision prennent en charge le skinning, les morphs et les instances.

Les tests couvrent notamment les semelles, les proportions, les finitions, les palettes, la direction des lames, les UV et pondérations du GLB livré, ainsi que la déformation des shaders en WebGL. Le smoke exige le vrai SkinnedMesh chargé et vérifie ses sommets et ses limites après chaque transition hub/chasse. Une résolution de promesse sans modèle n'est pas admise comme succès.

Les photographies utilisent les matières, l'éclairage et le rendu du jeu ; aucune lumière de studio n'est ajoutée. Les trois vues du corps partagent une caméra à 7,2 unités et un objectif de 65°. Les trois gros plans adaptent le cadrage à la tête : ils servent à comparer les surfaces, pas la taille absolue. Les mesures actualisent explicitement les matrices et le squelette avant de calculer les limites du corps animé.

## Reproduction

```bash
npm run check
npm run test:browser
npm run test:graphics
```

`GRAPHICS_SHOTS=hero-front,hero-back,hero-side,hero-head-front,hero-head-back,hero-head-side` limite les photos aux six références. `GRAPHICS_OUTPUT` choisit le répertoire, `GRAPHICS_BUILD_DIR` un ancien build. `GRAPHICS_SKIP_QUALITY_CHECKS=1` désactive uniquement les contrôles de qualité supplémentaires pour une prise de vue intermédiaire.

`GRAPHICS_PRESET=wolf_avpr` choisit une apparence pour la série. Une entrée telle que `chopper_avp:hero-side` dans `GRAPHICS_SHOTS` permet aussi de contrôler plusieurs presets dans la même session ; le nom du PNG indique alors le preset.

La construction du modèle est reproductible avec Blender 4.3+ :

```bash
blender --background --factory-startup --threads 8 --python scripts/build-hero-body.py -- --bake
blender --background --factory-startup --python scripts/build-hero-body-preview.py -- --input public/assets/models/hero-organic-body.glb
```

La source par défaut est le WebP versionné ; `--source-texture` accepte le PNG maître. `--artifacts-dir` ou `HERO_BODY_OUTPUT` garde les sources, bakes séparés et previews hors du dossier public. Le GLB contient ses textures et est mis en cache pour la session. Le jeu garde la géométrie de repli tant que l'asset n'est pas prêt.

## Portée

Cette passe modifie le héros. Les autres personnages et les décors restent ceux de la passe précédente. Le résultat associe un modèle Blender animé et de la géométrie sculptée par code ; il ne constitue pas une production de personnage AAA. Les observations Chromium utilisent SwiftShader ; les FPS sur GPU matériel et téléphones physiques restent à mesurer. Aucun testeur humain n'a été recruté.

Les plafonds du héros sont 360 000 triangles présents, 300 000 triangles visibles et 210 meshes visibles, hors passes d'ombre et effets. Les comptes de triangles ne sont pas une mesure de fluidité.

## Résultats locaux

La suite complète finale passe **998 tests**, sans échec ni test ignoré. Le build réussit sans avertissement et l'audit des dépendances de production signale zéro vulnérabilité. Les dix photographies de contrôle, les quatre niveaux de qualité, le contournement des effets en vision thermique/technique et le repli sans HDR passent sans erreur JavaScript, erreur de shader signalée en console ou ressource manquante.

Les dernières photos incluent six vues du héros standard et quatre vues Wolf/Chopper après ajustement de leurs équipements. Le corps GLB est réellement chargé dans chaque vue. Les mesures visibles, hors passes d'ombre et effets, sont :

| Apparence | Triangles visibles | Meshes visibles |
| --- | ---: | ---: |
| Jungle | 264 974 | 167 |
| Wolf | 269 266 | 175 |
| Chopper | 277 280 | 193 |

La revue complémentaire corrige les équipements AVP et Wolf restés sur les anciennes coordonnées : leurs supports suivent désormais les articulations tout en restant dans la hiérarchie de visibilité des presets et du paquetage. Les proxies Medicomp et mines conservent leurs identifiants de paquetage. Les régressions vérifient leurs positions, leur suivi pendant l'animation et leur visibilité.

Le smoke du build final a réussi le 20 octobre de 12:00:49 à 12:11:40 UTC : ordinateur/mobile, trois formats tactiles, réglages par l'interface, soins, pause, abandon et stockage refusé. Quatorze scènes couvrent douze contrats et neuf biomes. Les vingt-quatre contrôles du modèle chargé après transitions enregistrent des déformations finies, zéro erreur de matrice inverse de liaison et des limites proches du joueur. Aucune erreur JavaScript/console ou ressource réseau en échec n'est signalée. Ce parcours ne mesure ni l'équilibrage de douze parties complètes ni les performances de téléphones physiques.
