# Bible de direction artistique — Yautja: Apex Hunt

**Date :** 22 août 2026
**Statut :** direction de production pour les décors et props du fan game.

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

## Bibliothèque de matières OpenAI

Neuf textures bitmap ont été commandées avec le modèle ImageGen intégré d'OpenAI :

- sol de jungle boueux et moussu ;
- écorce extraterrestre tressée ;
- résine biomécanique de ruche ;
- sable minéral rouille de Ryushi ;
- alliage gunmetal/bronze ;
- pierre basaltique et coutures métalliques.
- ivoire et os ancien pour les trophées ;
- cuir noir et filet technique de chasse ;
- membrane organique sombre pour les œufs.

Elles sont conçues comme matières raccordables et originales, sans texte, logo, UI, watermark, collage ou symbole officiel. Les PNG maîtres, inspectés visuellement, sont conservés localement comme sources de travail mais exclus du versionnement et du déploiement. Les six matières de décor ont été converties avec Sharp ; les trois matières de props ont reçu une normalisation par quadrants miroir pour garantir la continuité des bords. Les neuf variantes runtime sont des WebP 1024×1024, qualité 84, pour un poids public total de 2 451 694 octets. Les prompts de production sont consignés dans `ASSET_GENERATION_PROMPTS.md` et le suivi technique dans `ASSET_MANIFEST.md`.

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

Une même texture ne doit pas être appliquée à tous les objets d'une zone sans variation d'échelle, de roughness, de teinte ou d'orientation.

## Règles techniques

- Conserver les PNG maîtres localement comme sources de travail non versionnées et non déployées ; livrer uniquement les variantes WebP dans le dossier public.
- Les variantes runtime actuelles sont des WebP 1024×1024, dimensions puissance de deux.
- Préférer sRGB pour la couleur ; ne pas réutiliser directement une image couleur comme normal map.
- Vérifier les quatre bords en répétition 2×2 avant validation.
- Définir wrap, repeat et filtrage selon la distance de caméra.
- Ajouter un fallback de couleur afin qu'un chargement d'image raté n'empêche pas le gameplay.
- Budgéter le poids total des textures et éviter leur chargement hors du biome actif.
- Le mode mouvement réduit limite particules météo et oscillations, pas la lisibilité des matériaux.

## Props et composition

Les props racontent une fonction : trophée, forge, piédestal, perchoir, couverture, obstruction ou repère. Un prop purement décoratif ne doit ni promettre une interaction inexistante ni bloquer invisiblement le joueur. Les trophées restent assombris ou verrouillés avant validation de la chasse associée.

## Contrôle qualité artistique

L'inspection visuelle des neuf PNG maîtres est validée, ainsi que les dimensions et le poids des WebP. La mosaïque 2×2 des trois nouvelles matières de props est validée ; le contrôle runtime final doit encore rechercher : répétition trop évidente, artefact de compression, scintillement, contraste insuffisant et échec de chargement sous l'éclairage réel du jeu.

La direction artistique ne remplace pas la QA. L'utilisateur a autorisé le push et le déploiement le 22 août 2026 ; la release reste conditionnée à la réussite des gates techniques et visuelles finales.
