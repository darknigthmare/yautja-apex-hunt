# Bible de direction artistique — Yautja: Apex Hunt

**Date :** 28 août 2026
**Statut :** direction de production v1.12 pour personnages, équipements, décors et props du fan game.

## Intention visuelle

Le jeu doit paraître ancien, prédateur et technologique sans reproduire un décor, un symbole ou une affiche officielle. La tension vient d'une matière sombre et lisible : pierre brûlée, alliage patiné, humidité végétale, résine organique et poussière minérale.

Les assets sont des créations originales fan-made. La fidélité recherchée porte sur les sensations générales de chasse et de science-fiction, jamais sur la copie exacte d'un asset de film, d'un logo, d'une texture promotionnelle ou d'un glyphe officiel.

## Principes

1. **Silhouette avant détail.** Le joueur doit reconnaître sol, obstacle, boss et sortie même sous faible lumière.
2. **Valeurs sombres contrôlées.** Les noirs gardent du détail ; une surface interactive reçoit un contraste de valeur ou de couleur.
3. **Technologie patinée.** L'alliage mélange gunmetal et bronze terni, sans chrome propre ni interface humaine.
4. **Organique distinct du métallique.** La ruche utilise côtes, membranes et brillance humide ; le vaisseau privilégie panneaux, canaux et joints.
5. **Accents parcimonieux.** Sarcelle froid, ambre et rouge d'alerte servent au guidage, jamais au remplissage décoratif uniforme.
6. **Pas de bruit visuel gratuit.** Le détail de texture ne doit pas masquer collisions, projectiles ou télégraphies d'attaque.

## Palettes par zone

| Zone | Base | Accents | À éviter |
| --- | --- | --- | --- |
| Jungle | brun-noir humide, vert mousse, écorce anthracite | lichen sarcelle, reflets froids | vert saturé uniforme, feuillage illisible |
| Ruche | noir organique, brun profond, graphite luisant | ambre acide ponctuel | anatomie explicite copiée, reflets miroir |
| Ryushi | rouille, ocre sombre, pierre ferrique | ciel désaturé, poussière pâle | désert orange plat, motifs terrestres identifiables |
| Yautja Prime / hub | basalte, gunmetal, bronze patiné | sarcelle technique, rouge d'alerte | glyphes officiels, surfaces industrielles humaines |
| Genna | roche noir-violet, épiderme organique, mousse sombre | chartreuse, cyan biologique | saturation uniforme, bioluminescence sans hiérarchie |
| Stargazer | acier froid, panneaux composites, béton | orange sécurité, blanc clinique | laboratoire blanc plat, accessoires militaires génériques |
| Los Angeles 1997 | asphalte chauffé, béton sale, métal oxydé | sodium, rouge trafic, cyan nocturne | façade copiée d’un film, signalétique lisible générée |
| Bouvetøya | glace bleue, basalte graphite, alliage bronze-noir | blanc froid, ambre rituel | pyramide monolithique sans repères, glyphes officiels |
| Gunnison | asphalte mouillé, béton froid, brique noircie | rouge d’urgence, ambre électrique, reflets bleu pluie | noir bouché, éclairage rouge uniforme, reproduction de décor d’AVP:R |

## Bibliothèque de matières OpenAI

Neuf textures bitmap constituaient la bibliothèque initiale commandée avec le modèle ImageGen intégré d'OpenAI :

- sol de jungle boueux et moussu ;
- écorce extraterrestre tressée ;
- résine biomécanique de ruche ;
- sable minéral rouille de Ryushi ;
- alliage gunmetal/bronze ;
- pierre basaltique et coutures métalliques.
- ivoire et os ancien pour les trophées ;
- cuir noir et filet technique de chasse ;
- membrane organique sombre pour les œufs.

Elles sont conçues comme matières raccordables et originales, sans texte, logo, UI, watermark, collage ou symbole officiel. Les PNG maîtres, inspectés visuellement, sont conservés localement comme sources de travail mais exclus du versionnement et du déploiement. Les vagues suivantes étendent cette base à 31 variantes runtime WebP pour 11 069 990 octets : tailles 1024×1024, 1254×1254 ou 1536×1536 selon le lot. Les prompts de production sont consignés dans `ASSET_GENERATION_PROMPTS.md` et le suivi technique dans `ASSET_MANIFEST.md`.

## Affectation des matériaux

| Matière | Usage principal | Usage secondaire |
| --- | --- | --- |
| Jungle ground | terrain humide | zones boueuses, bases de props |
| Jungle bark | troncs et racines | perchoirs organiques |
| Hive resin | parois et sol de ruche | œufs, arches et nervures avec variations |
| Ryushi sand | terrain désertique | dunes et dépôts de tempête |
| Yautja alloy | hub, piédestaux, forge | panneaux et props technologiques |
| Yautja stone | arène et architecture | socles, marches et monuments originaux |
| Trophy bone | trophées déverrouillés du hub | petits reliquaires et socles |
| Yautja leather net | filet de l'armure joueur | sangles et props de forge futurs |
| Xeno egg hide | membrane des œufs facehugger | petits éléments organiques de ruche |
| Gunnison rain urban | routes et ruelles mouillées | cour de service de l’hôpital, accès aux égouts, bases de props urbains |

Une même texture ne doit pas être appliquée à tous les objets d'une zone sans variation d'échelle, de roughness, de teinte ou d'orientation.

## Règles techniques

- Conserver les PNG maîtres localement comme sources de travail non versionnées et non déployées ; livrer uniquement les variantes WebP dans le dossier public.
- Les variantes runtime sont des WebP 1024×1024, 1254×1254 ou 1536×1536 ; ne pas supposer une dimension puissance de deux et vérifier chaque entrée du manifest.
- Préférer sRGB pour la couleur ; ne pas réutiliser directement une image couleur comme normal map.
- Vérifier les quatre bords en répétition 2×2 avant validation.
- Définir wrap, repeat et filtrage selon la distance de caméra.
- Ajouter un fallback de couleur afin qu'un chargement d'image raté n'empêche pas le gameplay.
- Budgéter le poids total des textures et éviter leur chargement hors du biome actif.
- Le mode mouvement réduit limite particules météo et oscillations, pas la lisibilité des matériaux.

## Props et composition

Les props racontent une fonction : trophée, forge, piédestal, perchoir, couverture, obstruction ou repère. Un prop purement décoratif ne doit ni promettre une interaction inexistante ni bloquer invisiblement le joueur. Les trophées restent assombris ou verrouillés avant validation de la chasse associée.

## Passe visuelle v1.6 — identité des espaces

Les cinq terrains utilisent la même grammaire de production — huit groupes de props, trois POI et un à deux dangers — mais pas les mêmes silhouettes. Les cinq installations doivent lire comme fonctionnelles, les six sanctuaires comme rituels ; les huit signatures visuelles globales sont combinées en trois repères distincts sur chaque carte. Couleur, hauteur, vide autour du volume et éclairage priment sur l’accumulation de petits objets.

Le hub reste navigable avant d’être décoratif. Ses quatre stations doivent être reconnaissables depuis les routes principales ; ses 27 colliders ne doivent jamais créer de mur invisible ambigu. Le budget de 273 draw calls et 17 239 triangles constitue la référence de composition v1.6.

Les répétitions statiques utilisent l’instancing : 136 appels théoriques sont évités sur l’ensemble de la passe. Genna concentre cinq lots et 168 instances, avec 28 plantes intégrées dans un budget de 89 draw calls et 31 889 triangles. Le mode `reducedMotion` fige ou atténue les spores, la météo et les oscillations décoratives ; il neutralise aussi le flottement, le roulis et les émissions animées des navettes et conteneurs, sans masquer leurs états, interactions ni les frontières de danger.

Quatre matières OpenAI originales 1254×1254 complètent le vocabulaire : panneaux frontaliers de Ryushi, membrane biomécanique de ruche, bronze cérémoniel Yautja et peau de gousse de Genna. Elles évoquent des fonctions et ambiances de la franchise sans copier de texture, prop, symbole ou plan officiel.

## Passe visuelle v1.12 — personnages, équipements et Gunnison

Le joueur Yautja utilise une silhouette procédurale articulée plutôt qu’un mannequin composé de volumes interchangeables. Le rig de 17 articulations doit conserver une ligne d’action claire dans ses huit états. La densité authored de 79 286 triangles sert les mandibules, la peau, les predlocks, les plaques, le filet, les grèves et le kit porté ; elle ne doit pas dissoudre la lecture de la pose. Une configuration standard affiche 65 092 triangles actifs, Wolf 73 170.

Chaque équipement majeur doit être identifiable avant la couleur ou l’icône : lames de poignet effilées avec fourreau/rails/pistons/verrous, smart disc segmenté, combistick télescopique, projectile de filet réellement tressé, mine plasma, shuriken et roquette de poignet. Chopper porte trois longues lames ; Wolf en porte deux avec gantelet renforcé, mallette Cleaner, seringue, quatre mines laser et plaques anti-acide. Aucun parallélépipède générique ne doit faire office d’équipement fini.

Le Predalien de Gunnison possède une silhouette haute densité propre : dôme et crête continus, quatre mandibules et mâchoire interne, tubes dorsaux, appuis digitigrades, quatorze predlocks/quilles et queue en douze segments. Les 111 670 triangles et 150 meshes nommés constituent directement l’assemblage final `nativeHighDetail` ; aucune couche générique supplémentaire ne doit le recouvrir. La respiration et la course donnent une masse vivante au repos et en poursuite, tandis que morsure, frénésie, queue et impacts gardent des signaux de combat lisibles.

Gunnison repose sur une matière OpenAI originale 1254×1254 de 492 416 octets : asphalte charbon, agrégats de béton, microfissures, réparations, pluie et ruissellement rouillé subtil. L’éclairage nocturne alterne sources électriques locales, urgence rouge, reflets froids et zones de noir lisibles. Le blackout doit retirer des sources plutôt que poser un filtre noir uniforme ; les sprinklers et la pluie doivent révéler volumes et camouflage sans transformer toutes les surfaces en miroir.

La carte répartit 17 familles de props entre dix secteurs. Les repères principaux — forêt du crash, centrale, lycée, hôpital, accès d’égouts et extraction — doivent se reconnaître par masse, hauteur, vide et lumière. Les neuf lots instanciés et 216 instances contiennent la répétition ; variations de rotation, d’échelle et de contexte empêchent l’effet de décor cloné.

## Contrôle qualité artistique

Les inspections et validations historiques restent consignées par lot dans `ASSET_MANIFEST.md`. Pour la matière Gunnison, le PNG maître a été retenu puis converti en WebP ; la revue de release v1.12 doit encore confirmer répétition, contraste, scintillement, camouflage sous pluie et chargement dans le biome réel sur desktop et écran étroit.

La direction artistique ne remplace pas la QA. Les publications historiques restent valides pour leurs versions ; la v1.12 reste conditionnée à ses propres gates techniques et visuelles finales.
