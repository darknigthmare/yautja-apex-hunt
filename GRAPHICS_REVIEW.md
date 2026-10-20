# Passe graphique — 20 octobre 2026

Base de comparaison : `eb7b7f8`. Cinq agents ont travaillé en parallèle, avec tests automatisés et inspection de captures. Aucun testeur humain n'a été recruté.

## Changements visibles

- Héros : anatomie profilée, biomask sculpté, visière et respirateurs, cinq doigts et griffes, 22 predlocks courbes sur les 11 joints, filet ouvert, harnais dorsal et armures biseautées. Personnalisation et animations conservées.
- PNJ : contours affinés, équipement et détails anatomiques instanciés sur les 31 familles. Les modèles distants masquent les nouveaux détails proches.
- Boss : surfaces sculptées et matières lisibles. Les blocs du Goliath sont remplacés par une anatomie avec mâchoire, dents, pieds et griffes. Grid conserve son rig et perd sa seconde anatomie statique superposée.
- Neuf biomes : chemins usés texturés, arbres ramifiés, racines, roches stratifiées, structures biomécaniques, cristaux et bâtiments avec corniches, fenêtres et équipements de toiture. Sous-bois et fragments instanciés. Mâts décalés hors des points d'apparition.
- Vaisseau : portes et panneaux biseautés, fixations et joints, socles instanciés, écrans de télémétrie. Les 11 zones, 13 portes, 10 stations et 87 volumes de collision sont conservés.
- Matières : onze profils procéduraux de normales et de rugosité, partagés en mémoire, indépendants des couleurs et personnalisations. Détail fin des sols atténué avec la distance, zones humides et nuages adoucis.
- Rendu : réflexion d'environnement locale préfiltrée, occlusion de contact, bloom discret et anticrénelage. Les visions thermique et technique conservent leurs couleurs. La vision normale devient celle du démarrage.

## Géométrie mesurée

Ces comptes décrivent les modèles, sans les passages supplémentaires d'ombres et de post-traitement. Ils ne mesurent pas les FPS.

| Modèle | Triangles avant | Triangles après | Appels estimés avant → après |
| --- | ---: | ---: | ---: |
| Héros standard, parties visibles | 65 092 | 179 800 | 129 → 140 |
| Goliath | 61 072 | 47 852 | 42 → 43 |
| Queen | 77 657 | 49 721 | 46 → 42 |
| Grid | 104 438 | 12 278 | 86 → 56 |
| Croiseur complet | 250 056 | 463 416 | 299 → 294 |

Le héros gagne environ 2,76 fois plus de triangles visibles. Certains boss gagnent en détail tout en perdant des volumes superposés. Le maximum par PNJ proche est de 11 570 triangles ; l'ensemble des 31 modèles distants conserve ses 87 appels estimés.

La jungle complète atteint 279 421 triangles statiques et 105 appels estimés avec ses nouvelles couronnes de feuilles. Le plafond statique passe à 300 000 triangles pour cette densité ; les huit autres biomes mesurés restent sous 220 000. Le plafond de 180 appels demeure inchangé.

## Qualité graphique

Le réglage **Options d'expérience → Qualité graphique** se sauvegarde sur l'appareil. Il agit sur la résolution et les effets ; les modèles proches détaillés restent disponibles.

| Réglage | Ratio de pixels maximal | Effets |
| --- | ---: | --- |
| Performance | 1 | Rendu direct avec matières et reflets |
| Équilibrée | 1,25 | Bloom discret, sortie couleur et FXAA |
| Élevée | 1,5 | Équilibrée + occlusion de contact à demi-résolution |
| Ultra | 2 | Occlusion de contact à pleine résolution |

Automatique choisit Équilibrée sur périphérique tactile ou mémoire déclarée limitée, et Élevée sur ordinateur. Sans support HDR requis, le moteur utilise le rendu direct. Transparences, hologrammes filaires et plasma sont exclus de l'occlusion de contact.

Les changements de qualité libèrent les ressources GPU des anciennes passes. Les régressions couvrent aussi la restauration du renderer lorsqu'un effet échoue, le redimensionnement, la projection caméra et les anciennes sauvegardes.

## Reproduire

```bash
npm run check
npm run test:browser
npm run test:graphics
```

Le script graphique démarre une preview sur le port 4280, photographie cinq scènes réelles à 960 × 600, puis vérifie les quatre qualités, les visions et le repli sans HDR. `GRAPHICS_OUTPUT` change le dossier de sortie ; `GRAPHICS_BUILD_DIR` permet de comparer un ancien build ; `GRAPHICS_SHOTS=hero,hub` limite les vues. Ces photos masquent le HUD et n'ajoutent aucune lumière. Le smoke navigateur conserve l'interface et les commandes réelles.

## Portée

Validation finale : **971/971 tests**, build sans avertissement, audit npm à zéro vulnérabilité ; parcours Chromium mobile/ordinateur et rendu des douze contrats couvrant les neuf biomes réussis. Les rapports et captures du smoke sont produits par `test:browser` ; le script graphique conserve ses mesures et vérifie aussi les erreurs de console WebGL.

Les cinq vues finales et les quatre qualités ont passé ce contrôle graphique sans erreur JavaScript, shader signalée en console ni ressource manquante. Le contournement du post-traitement en thermique/tech et le repli de capacité HDR ont également été vérifiés. Les passages d'ombres sont réutilisés pour l'occlusion de contact.

Le jeu conserve ses scènes et modèles procéduraux. Cette passe améliore la géométrie et introduit un rendu PBR plus complet ; elle ne prouve pas une équivalence visuelle à une production AAA. Chromium utilise SwiftShader ici : fluidité et consommation sur GPU matériel et téléphones physiques restent à mesurer.

La publication Vercel exige un déploiement confirmé et une vérification de son URL. L'environnement courant ne fournit pas de secret Vercel et n'autorise pas ses domaines ; le brouillon de configuration conserve les besoins enregistrés lors de l'onboarding.
