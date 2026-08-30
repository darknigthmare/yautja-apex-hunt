# Rapport QA — release 1.13.0

**Date :** 30 août 2026
**Statut :** release 1.13.0 validée, poussée et publiée.
**Production actuellement vérifiée :** release 1.13.0 sur <https://yautja-apex-hunt.vercel.app/> — HTTP 200 et marqueurs v1.13 confirmés.
**Commit fonctionnel/push v1.13 :** 89518b9 — poussé sur codex/professional-hunt-pass.
**Déploiement Vercel v1.13 :** dpl_AeeAnjSarUhCmcWQ9iaVcMkgzAhu — READY, cible production, alias officiel confirmé.
**Commit fonctionnel/push v1.12 :** `5b340ca` — poussé sur `codex/professional-hunt-pass`
**Correctif métadonnée/push v1.12 :** `e249bf2` — poussé sur `codex/professional-hunt-pass`
**Déploiement de validation Vercel v1.12 :** `dpl_Cxx5T43crYq8wc9Jv5PKek9bDi6j` — `READY`, cible `production`
**URL/alias public v1.12 :** <https://yautja-apex-hunt.vercel.app/> — HTTP 200, alias confirmé le 28 août 2026
**Commit/push v1.11 :** `57f5a5c` — poussé sur `codex/professional-hunt-pass`
**Déploiement Vercel v1.11 :** `dpl_Cu8rczE4atodhPm2N5mJgr74TBxL` — `READY`, cible `production`
**URL/alias public v1.11 :** <https://yautja-apex-hunt.vercel.app/> — HTTP 200, alias confirmé le 28 août 2026
**Déploiement production v1.10 :** `dpl_2xbt59JRaxhUEcM7MNoqozPSUjqk` — `READY`, cible `production`, alias officiel HTTP 200, commit fonctionnel `9f56b0d`
**Déploiement production v1.9 :** `dpl_FofpWaJDdkSjrnQeNTtQRdwNmZ6L` — `READY`, cible `production`, alias officiel HTTP 200, commit fonctionnel `3314fe4`
**Déploiement production v1.8 :** `dpl_5zqD2XQgZ4vo8RKRAft8cM7yKfHL` — `READY`, cible `production`, alias officiel HTTP 200, commit fonctionnel `54fad3c`
**Déploiement production v1.7 :** `dpl_En8EmhSsfxE7SZFPYEApyYwo134h` — `READY`, cible `production`, alias officiel HTTP 200, commit fonctionnel `94bb326`
**Premier déploiement de validation v1.6 :** `dpl_HgUgNRS9k92Asi1Mq8BNVhCLn6C3` — `READY`, cible `production`, alias officiel appliqué
**Source :** <https://github.com/darknigthmare/yautja-apex-hunt>

## Passe v1.13 — croiseur, paquetage et fermeture professionnelle

| Gate exécuté | Résultat vérifié | Périmètre exact |
|---|---:|---|
| Suite automatisée finale | **391/391 réussis** | 365 régressions historiques, 12 contrats loadout, quatre contrats visuels portés, cinq contrats d’architecture du croiseur et cinq contrats UI/résilience. |
| Build production local | **Vite 8.2.2 réussi** | 50 modules ; chunks applicatifs de 109,17 à 388,51 Ko, chunk Three.js isolé à 517,65 Ko ; aucun chunk applicatif au-dessus de 400 Ko. |
| Sécurité dépendances | **0 vulnérabilité** | Audit npm des dépendances de production. |
| Syntaxe et qualité Git | **réussi** | Cinq modules critiques contrôlés par Node ; diff sans erreur, avertissements LF/CRLF uniquement. |
| HTTP local | **200** | Présence de PRÉPARATION, du panneau loadout, des contrôles tactiles et de l’overlay fatal. |
| Audit visuel navigateur intégré | **bloqué par l’environnement** | Le processus navigateur de validation échoue sur les ACL Windows lors de l’application du sandbox ; aucune capture visuelle v1.13 n’est revendiquée. |

## Passe v1.12 — Gunnison, rig Yautja, équipement et Predalien natif

| Gate déjà exécuté | Résultat vérifié | Périmètre exact |
|---|---:|---|
| Suite automatisée finale | **365/365 réussis** | Déplacement caméra AZERTY, entrées simultanées, rig/animations, géométries d’armes, statistiques de wristblades, Predalien/weakpoints, Gunnison, extraction, LOD PNJ, HUD mobile et régressions historiques. |
| Build production local | **Vite 8.2.2 réussi** | 49 modules ; HTML 28,34 Ko (gzip 7,76), CSS 31,76 Ko (gzip 7,33), jeu 792,79 Ko (gzip 210,74), Three.js 517,65 Ko (gzip 131,59). Build terminé en 2,84 s ; avertissement de taille non bloquant. |
| Sécurité dépendances | **0 vulnérabilité** | `npm audit --omit=dev`. |
| Qualité Git | **propre** | `git diff --check` sans erreur ; avertissements de normalisation LF/CRLF uniquement. |
| Chromium desktop local | **réussi** | Gunnison/Predalien lancé, canvas 1 258×566, aucun overlay ni erreur applicative ; texture Gunnison répond en HTTP 200. |
| Chromium mobile local | **réussi après polish** | 390×844, canvas 390×844, document sans débordement horizontal, Gunnison/Predalien actif, texture HTTP 200 et console vide ; blocs haut 6–201 px, technologies 694–748 px et arsenal 792–838 px, sans chevauchement majeur. |
| Chromium production | **réussi** | Gunnison/Predalien et directive Cleaner lancés sur l’alias : 1 280×720 puis 390×844, overflow 0, aucun overlay ni erreur console ; mêmes bandes HUD mobiles sans chevauchement. |
| Réseau public | **HTTP 200** | HTML v1.12, bundle `index-uuQGdAWz.js`, CSS `index-Bbre5vU2.css` et texture Gunnison `image/webp` de 492 416 octets. |
| Budget joueur | **contrat respecté** | Rig 17 articulations/8 états ; 79 286 triangles authored, 65 092 actifs en standard et 73 170 avec le kit Wolf. |
| Budget Predalien | **contrat respecté** | 111 670 triangles/150 meshes en production ; retrait de 17 910 triangles et 32 draws génériques redondants, weakpoints conservés. |
| LOD PNJ | **contrat respecté** | 31 archétypes ; 499 → 87 draws (−82,57 %), réduction minimale de 75 % par archétype. |

La release 1.12 ajoute le biome ouvert Gunnison (rayon 760, dix secteurs, 21 routes, sept territoires, 19 PNJ et huit nœuds d’événements), la directive Cleaner en quatre objectifs et extraction de 45 secondes, le vaisseau de Wolf, les événements blackout/ruche/Garde/hôpital, un rig Yautja animé et un arsenal procédural identifiable. Les wristblades disposent maintenant de portées/cadences réelles : standard 8,50 m/0,400 s, Chopper 11,73 m/0,424 s et Wolf 9,52 m/0,432 s.

**Publication v1.12 validée.** Les commits `5b340ca` et `e249bf2` sont poussés ; le déploiement `dpl_Cxx5T43crYq8wc9Jv5PKek9bDi6j` est `READY` en production. L’alias et la texture répondent en HTTP 200 ; le bundle public contient `gunnison_outbreak`, `gunnison_cleanup`, `gunnison_national_guard`, `wolf_cleaner_ship`, `guard_radio`, `nativeHighDetail` et `gunnison-extraction-countdown`. Les parcours publics desktop/mobile sont exempts d’overlay et d’erreur console.

## Passe v1.11 — Bouvetøya, Grid Alien et pyramide mobile

| Gate déjà exécuté | Résultat vérifié | Périmètre exact |
|---|---:|---|
| Suite automatisée finale | **318/318 réussis** | Grid Alien, points faibles, combat acide, directive de la pyramide, biome Bouvetøya, textures et régressions historiques. |
| Build production local | **Vite réussi** | 49 modules transformés sans erreur bloquante. |
| Sécurité dépendances | **0 vulnérabilité** | `npm audit --omit=dev`. |
| Chromium desktop local | **réussi** | Sélection Bouvetøya et lancement Grid contrôlés sans erreur applicative ni débordement horizontal. |
| Chromium mobile local | **réussi** | Émulation 390×844 contrôlée sans erreur applicative ni débordement horizontal. |
| Textures Bouvetøya | **HTTP 200 local et public** | `bouvetoya-ice-rock.webp` et `bouvetoya-pyramid-stone.webp` servis en `image/webp`, 484 446 et 409 994 octets. |
| Budget Grid Alien | **contrat respecté** | 25 244 triangles HD, 37 522 triangles au total et 30 meshes. |

**Publication v1.11 validée.** Le commit fonctionnel `57f5a5c` est poussé sur `codex/professional-hunt-pass`. Le déploiement `dpl_Cu8rczE4atodhPm2N5mJgr74TBxL` est `READY` en production et conserve l’alias officiel. Le HTML public répond en HTTP 200, le bundle `index-B0Rz8E1y.js` répond en HTTP 200 pour 703 336 octets et contient `grid_alien`, `bouvetoya_pyramid`, `avp_ritual_ship`, `weyland_expedition_guard` et `pyramid_shift`. Les deux WebP Bouvetøya répondent en HTTP 200 avec leurs poids exacts.

Contenu raccordé et contrôlé dans cette release :

- onzième chasse `grid_alien`, huitième biome `bouvetoya_pyramid` et dixième directive `avp_pyramid_trial` ;
- terrain ouvert de rayon 740, dix secteurs, 18 routes bouclées, sept territoires et sept nœuds d’événements/migration ;
- pyramide répartie entre camp Weyland, banquise, tunnel thermique, seuil, chambre sacrificielle, chambre des plasma casters, carrefour mobile, galerie de résine, chambre de la Reine et arène de Grid ;
- directive en trois vagues : garde Weyland, Facehugger puis guerrier xénomorphe ;
- Grid Alien procédural avec dôme et queue segmentée destructibles, cicatrices quadrillées, mâchoire interne, bond, balayage et attaques acides ;
- inventaires consolidés à onze chasses, huit biomes, dix directives, quinze armes et 218 entrées ;
- 30 textures WebP pour 10 577 574 octets, dont deux matières OpenAI originales 1254×1254 dédiées à Bouvetøya.

Verdict final v1.11 : **GO — publiée et vérifiée**. Les 318 tests, le build de 49 modules, l’audit à 0 vulnérabilité, les parcours Chromium local desktop/mobile, le push GitHub, le statut Vercel `READY`, l’alias HTTP 200, les cinq marqueurs du bundle et les deux réponses texture publiques sont établis. Le scan Vercel ne retourne aucun journal d’erreur ; le projet est statique et ne possède pas de fonction runtime à journaliser.

## Passe v1.10 — Los Angeles 1997, City Hunter et fermeture des écarts Excel

| Gate déjà exécuté | Résultat vérifié | Périmètre exact |
|---|---:|---|
| Suite automatisée finale | **299/299 réussis** | City Hunter, masque destructible, Medicomp, filet, roquette de poignet, directive urbaine, file d'attente des vagues, déclenchement et résolution des trois dangers de Los Angeles et du cache OWLF, biome Los Angeles, texture et régressions historiques. |
| Build production local | **Vite 8.2.2 réussi** | 48 modules ; HTML 27,33 Ko (gzip 7,43 Ko) ; CSS 27,28 Ko (gzip 6,47 Ko) ; jeu 640,57 Ko (gzip 171,19 Ko) ; Three.js 505,00 Ko (gzip 126,95 Ko). Build terminé en 525 ms ; avertissement de taille non bloquant. |
| Sécurité dépendances | **0 vulnérabilité** | `npm audit --omit=dev`. |
| Chromium desktop local | **réussi** | 1280×720 : dix chasses, neuf directives, sélection Los Angeles 1997, lancement City Hunter, HUD `0 / 3 OBJECTIFS`, texture urbaine demandée et document sans débordement horizontal. |
| Chromium mobile local | **réussi** | Émulation réelle 390×844 : largeur interne et document à 390 px, dix chasses, neuf directives, City Hunter jouable, canvas 390×844 et aucun débordement horizontal. |
| Console et réseau navigateur | **0 erreur / 0 requête échouée** | Aucun overlay Vite, aucune erreur d'exécution et aucune requête échouée sur les parcours desktop et mobile. |
| Texture urbaine OpenAI | **WebP valide** | `los-angeles-heatwave-urban.webp`, 1536×1536, 846 546 octets ; en-tête RIFF/WEBP et dimensions exactes couverts par le contrat automatisé. |

**Publication 1.10 validée.** Le commit fonctionnel `9f56b0d` est poussé sur `codex/professional-hunt-pass`. Le déploiement `dpl_2xbt59JRaxhUEcM7MNoqozPSUjqk` est `READY` en production ; l’alias officiel répond en HTTP 200, la texture urbaine répond en HTTP 200 `image/webp` avec 846 546 octets, et les réponses publiques HTML/bundle confirment `city_hunter`, `los_angeles_1997`, `wrist_rocket`, `la-lightning-grid` et `la-owlf-cache`. Les parcours Chromium desktop/mobile détaillés ci-dessus ont été exécutés localement.

Le classeur de la conversation ChatGPT a été retrouvé et authentifié pour cette passe : `C:\Users\chuck\Downloads\Encyclopedie_exhaustive_franchise_Predator.xlsx`, SHA-256 `47C659F4F79CA0E71D8B8B7B8DB2CD7B7363827224BC081D59E9DD9D9576983C`. Son flux `Zone.Identifier` renvoie à la conversation <https://chatgpt.com/c/6a8adeed-b6f8-83ed-9d07-5088fa50b8a9>. Les 20 feuilles et 915 entrées uniques du catalogue ont servi à sélectionner une vague cohérente *Predator 2* / Los Angeles 1997, puis chaque ajout retenu a été raccordé à une surface jouable plutôt que seulement cité dans le Codex.

Contenu raccordé et contrôlé dans cette release :

- dixième chasse `city_hunter`, biome Los Angeles 1997 et directive `urban_heatwave_hunt` en trois vagues ;
- carte urbaine ouverte de rayon 760, dix secteurs, 18 routes bouclées sans cul-de-sac, sept territoires, 20 résidents écologiques, sept événements, six nœuds de boss, quatre POI, trois dangers et huit familles de props ;
- City Hunter à 10 562 triangles HD et 91 meshes utiles, avec bio-masque destructible, Smart Disc aller/retour, Netgun, roquette de poignet, Combistick, Medicomp, trophées et suivi multispectral ;
- trois adversaires urbains aux comportements propres : cartel armé, tireur du métro et équipe de capture OWLF avec brouillage énergétique et rupture de camouflage ;
- classe City Stalker, predlocks urbains denses, finition bronze City, peinture de guerre suie et quinzième arme jouable `wrist_rocket` ;
- filet environnemental réellement appliqué au déplacement, Medicomp affiché `DISPONIBLE` puis `ÉPUISÉ`, masque réellement ciblable avec impact balayé et vagues de directive conservées dans une file FIFO bornée lorsque le plafond de 24 PNJ est atteint ;
- contenu de décor et de lore issu du classeur : abattoir, métro, toits, navire du Lost Tribe, piège OWLF, salle/collier de trophées, kit City Medicomp, composé de soin bleu, rebreather, faune urbaine, véhicules et rituel de canicule ; les trois dangers de Los Angeles et le cache OWLF sont désormais réellement déclenchés puis résolus par la boucle de jeu.

## Passe v1.9 — brèche Stargazer, Assassin Predator et contenu transversal

| Gate déjà exécuté | Résultat vérifié | Périmètre exact |
|---|---:|---|
| Suite automatisée finale | **278/278 réussis** | Boss, biomes, directives, comportements PNJ, statuts, arsenal, personnalisation, catalogues, sauvegarde et régressions historiques. |
| Build production local | **Vite 8.2.2 réussi** | 47 modules ; HTML 26,84 Ko ; CSS 27,28 Ko ; jeu 581,94 Ko ; Three.js 505,00 Ko. Avertissement de taille non bloquant. |
| Sécurité dépendances | **0 vulnérabilité** | `npm audit --omit=dev`. |
| Qualité Git | **propre** | `git diff --check` sans erreur et aucun patch/capture temporaire v1.9 conservé. |
| Chromium desktop local | **réussi** | 1280×720 : neuf chasses, huit directives, lancement Assassin/Stargazer, HUD `0 / 3 OBJECTIFS`, 14 armes et métadonnée publique à jour. |
| Chromium mobile local | **réussi** | 390×844 : document limité à 390 px, chasse Stargazer active, aucun débordement de page relevé. |
| Console navigateur | **0 erreur applicative** | Aucun overlay Vite et journal applicatif vide sur le titre, la console des contrats et la chasse Stargazer. |
| Chromium production | **réussi** | Alias officiel HTTP 200 : neuf chasses et huit directives visibles ; Assassin/Stargazer lancé à 1 115 m, HUD `0 / 3 OBJECTIFS`, responsive 390×844 et console vide. |

**Publication 1.9 validée.** Le commit fonctionnel `3314fe4` est poussé sur `codex/professional-hunt-pass` ; le déploiement production `dpl_FofpWaJDdkSjrnQeNTtQRdwNmZ6L` est `READY`, son alias officiel répond en HTTP 200 et le parcours public titre → contrats → Assassin/Stargazer ne produit aucune erreur applicative.

Contenu raccordé dans cette release :

- trois directives 1.9 portent le total à huit : `stargazer_breach`, `game_preserve_escape` et `hive_containment_failure` ;
- neuvième chasse interne `upgrade_predator`, opposant l’Assassin Predator (2018), génétiquement amélioré, et directive `stargazer_breach` ;
- « Évasion de la planète-réserve » rend `hell_hound_alpha` et `river_ghost` accessibles dans la jungle via `game_preserve_escape` ;
- « Rupture du confinement de la ruche » rend le Smartgunner Colonial, le synthétique Weyland de terrain et le Facehugger accessibles sur `hive_lv426` via `hive_containment_failure` ;
- site noir Stargazer de rayon 680, avec neuf secteurs, 16 routes non linéaires, six territoires, 15 résidents écologiques, six événements, quatre POI, deux dangers et huit groupes de props ; sa piste suit la poursuite de l’Assassin autour de l’évasion du Fugitive ;
- huit rôles à comportements distincts : alpha de meute, River Ghost, Smartgunner Colonial, synthétique Weyland de terrain, Facehugger, fusilier Stargazer, trappeur Stargazer et molosse modifié ;
- quatre armes jouables supplémentaires aux slots 10–13 : lance-traits Feral, double plasma Wolf, Eye of Ra puissant et précis à cadence lente, et Épée Yautja — Father ;
- leurre `apex_decoy` sur `[Y]`, avec objet 3D temporaire, coût énergétique, recharge et attraction réelle des ennemis ;
- quatre classes supplémentaires — Tracker, Falconer, Cleaner et Fugitive — ainsi que de nouveaux styles de predlocks, finitions et warpaints ;
- appareil d’évasion Fugitive, récupération `stargazer_salvage` et hub porté à neuf stations en double rangée avec anneaux holographiques instanciés ;
- Assassin Predator (2018), génétiquement amélioré, à 29 468 triangles au total, avec armure biologique, glandes adaptatives destructibles et bond écrasant télégraphié.

Pendant la passe v1.9, le tableur Excel évoqué par l'utilisateur n'était accessible ni dans le workspace ni dans les pièces jointes alors disponibles. Cette mention décrit uniquement l'état historique de la v1.9 : le classeur a depuis été retrouvé, authentifié et utilisé pour la passe v1.10 documentée en tête de ce rapport.

## Passe v1.8 — directives de longue chasse et nouvelles proies

| Gate | Résultat vérifié | Couverture |
|---|---:|---|
| Tests Node | **238/238 réussis** | Directives, progression, récompenses, sauvegarde v4, sept archétypes PNJ, événements spatialisés, plafond de population et régression complète. |
| Build production local | **Vite 8.2.2 réussi** | 46 modules ; HTML 26,09 Ko ; CSS 27,28 Ko ; jeu 513,05 Ko ; Three.js 505,00 Ko. Avertissement de taille non bloquant. |
| Build et déploiement Vercel | **READY** | Commit `54fad3c` poussé sur `codex/professional-hunt-pass`, déploiement production `dpl_5zqD2XQgZ4vo8RKRAft8cM7yKfHL`, alias officiel en HTTP 200. |
| Sécurité dépendances | **0 vulnérabilité** | `npm audit --omit=dev`. |
| Qualité Git | **propre** | `git diff --check`, revue P0/P1 indépendante sans régression et aucun patch temporaire conservé. |
| Chromium desktop local | **réussi** | 1280×720 : cinq directives, aperçu des objectifs, lancement Kalisk/Genna, HUD compact `0 / 3 OBJECTIFS`, événement d’écosystème et 0 violation Axe sur les surfaces contrôlées. |
| Chromium mobile local | **réussi** | 390×844 : aucun débordement horizontal du document ou de la modale ; sélecteur de directive contenu à 334 px. |
| Chromium production | **réussi** | Cinq directives et huit contrats visibles ; le protocole du monde mortel sélectionne Genna, lance Kalisk, affiche les trois objectifs et charge la nouvelle texture en HTTP 200. |
| Console navigateur | **0 erreur applicative** | Console et journal d’erreurs vides pendant le parcours public titre → contrats → directive Genna → chasse Kalisk. |

Contenu contrôlé : quatre directives spécialisées plus la chasse standard, sept nouvelles proies 3D procédurales, vagues typées et spatialisées, suivi HUD, bonus conditionnel et persistance des directives accomplies. Le plafond global reste strictement limité à 24 PNJ et les types inconnus ne sont jamais remplacés silencieusement.

L’asset original OpenAI `genna-sporeback-carapace.webp` est un WebP 1024×1024 de 343 106 octets. Il est appliqué au dos-à-spores, conservé sans copie d’asset officiel et vérifié localement puis sur l’alias public avec le type `image/webp`.

## Passe v1.7 — territoires ouverts, écologie et boss HD

| Gate | Résultat vérifié | Couverture |
|---|---:|---|
| Tests Node | **218/218 réussis** | Cartes ouvertes, relief transformé, routes, colliders distribués, écologie, événements, migrations Apex, huit boss HD, combat, sauvegarde et hub. |
| Build production local | **Vite 8.2.2 réussi** | 45 modules ; HTML 24,44 Ko ; CSS 25,39 Ko ; jeu 491,40 Ko ; Three.js 505,00 Ko. Avertissement de taille non bloquant. |
| Build et déploiement Vercel | **READY** | Commit `94bb326` poussé sur `codex/professional-hunt-pass`, déploiement production `dpl_En8EmhSsfxE7SZFPYEApyYwo134h`, alias officiel en HTTP 200. |
| Sécurité dépendances | **0 vulnérabilité** | `npm audit --omit=dev`. |
| Qualité Git | **propre** | `git diff --check`, aucun patch temporaire conservé. |
| Chromium desktop local | **réussi** | 1280×720 : titre, huit contrats, lancement Kalisk/Genna, vision normale, signal Apex à 826–1 009 m, événement `CONFLIT PRÉDATEUR-PROIE` et HUD complet. |
| Chromium production | **réussi** | Huit contrats visibles, Genna/Kalisk lancé, signal thermique à 1 020 m, tempête thermique, HUD et parties destructibles présents. |
| Console navigateur | **0 erreur applicative** | Console vide sur la production ; seulement les messages de connexion Vite attendus en local. |

Contrats mesurés : cinq rayons de 630–660 unités, neuf secteurs et 12–13 routes bouclées par carte, 12–15 formes de vie résidentes, six nœuds d’événements et cinq étapes de migration Apex. Les 43 couverts extérieurs estimés par biome conservent au moins neuf colliders physiques distribués sur les neuf secteurs, sans dépasser le plafond global. Le terrain transformé, les routes, les props, les PNJ et les meshes après collision partagent la même hauteur runtime.

Budgets géométriques totaux des cibles : Goliath 17 100 triangles, Reine 22 465, Bad Blood 18 592, Predalien 20 029, Super Predator 24 178, Feral 22 551, Wolf 25 379 et Kalisk 26 256. Les variantes HD conservent visions thermique/camouflage et détails destructibles.

Le benchmark MHW s’appuie sur les principes officiels publiés par Capcom — continuité, densité, écosystème, interactions et lecture — sans inventer de superficie officielle ni copier une carte ou un asset Capcom.

## Baseline de release v1.6

| Gate | Résultat vérifié | Couverture |
|---|---:|---|
| Tests Node | **193/193 réussis** | Huit boss, level design des cinq biomes, hub explorable, POI persistants, apparitions sûres, mouvement réduit, sauvegarde et responsive HUD. |
| Build production local | **Vite 8.2.2 réussi** | 42 modules ; HTML 24,44 Ko ; CSS 25,39 Ko ; jeu 429,73 Ko ; Three.js 503,59 Ko. L’avertissement de taille du chunk Three.js est non bloquant. |
| Build Vercel | **réussi** | Premier déploiement de validation `dpl_HgUgNRS9k92Asi1Mq8BNVhCLn6C3` en production `READY`, puis Preview du HEAD documentaire final `dpl_DW87VVaWxGvJbXerRCfpynf6shBZ` également `READY`. |
| Sécurité dépendances | **0 vulnérabilité** | `npm audit --omit=dev`. |
| Qualité Git | **propre** | `git diff --check`, aucun patch ou fichier QA temporaire conservé. |
| Chromium desktop v1.6 | **réussi** | En local : titre, missions, hub jouable et cinq biomes en masque normal ; en production : titre, huit contrats, entrée dans le hub, console, HUD desktop et absence d’overlay. |
| Chromium mobile production 1.5 | **réussi** | Baseline 390×844 conservée : largeur document 390 px, huit contrats accessibles et aucun débordement horizontal ; un appareil tactile physique reste à contrôler pour la 1.6. |
| Console navigateur | **0 erreur applicative** | Aucun défaut de page relevé sur les parcours locaux ou la navigation de production v1.6. |
| Assets 1.6 | **HTTP 200 / `image/webp`** | Les quatre WebP OpenAI répondent sur l’alias public avec leurs poids attendus. |

## Contenu réellement jouable contrôlé

- [x] neuf contrats couverts par les contrats automatisés : Goliath, Reine xénomorphe, Bad Blood, Predalien, Berserker, Feral, Wolf Cleaner, Kalisk et Assassin Predator (2018), génétiquement amélioré ;
- [x] Wolf : double plasma, fouet télégraphié, mine, agent dissolvant, bio-masque et mallette destructibles ;
- [x] Kalisk : carapace adaptative, charge, empalement, régénération interruptible et noyau exposé ;
- [x] Assassin Predator (2018), génétiquement amélioré : 29 468 triangles, armure biologique, glandes adaptatives, régénération bornée, bond écrasant et interruption au filet ;
- [x] points faibles visés en coordonnées monde et collision de projectile balayée pour éviter le tunneling ;
- [x] secteurs narratifs imposés au lancement : Wolf sur LV-426 et Kalisk sur Genna ;
- [x] huit presets Lost Tribe, 38 bio-masques et texture rituelle réellement appliquée puis restaurée lors d’un changement de preset ;
- [x] registre de 29 œuvres et médias, avec statuts séparés pour sorties, bonus, coupés, non publiés, promotionnels et crossovers ;
- [x] galerie et nexus de neuf trophées/contrats, distribués en double rangée avec anneaux instanciés ;
- [x] trois textures originales OpenAI en WebP 1024×1024 : alliage Cleaner, os rituel Lost Tribe et peau adaptative Kalisk.

## État du classeur de franchise

L'absence signalée dans les rapports v1.9 et antérieurs correspondait à l'état des fichiers alors disponibles. Pour la v1.10, le classeur de la conversation ChatGPT a été retrouvé dans les téléchargements, son origine ChatGPT authentifiée par `Zone.Identifier`, puis ses 20 feuilles et 915 entrées uniques ont été confrontées aux catalogues et surfaces runtime. La vague Los Angeles 1997 ci-dessus ferme un lot d'écarts identifié dans ce document ; elle ne signifie pas que les 915 lignes sont toutes devenues des entités jouables distinctes.

Les prochains lots déjà identifiés après Gunnison sont des campagnes complètes *Killer of Killers* et *Alien vs. Predator*, une faune et une flore de Genna plus variées, puis du profilage GPU sur matériel modeste et une validation tactile physique.

## Passe v1.6 — état de validation props et level design

### Gates exécutés

- [x] suite automatisée finale : 193/193 tests ;
- [x] build Vite de production : 42 modules transformés, terminé sans erreur ;
- [x] contrôle syntaxique `node --check` : 11 modules validés ;
- [x] `npm audit --omit=dev` : 0 vulnérabilité ;
- [x] `git diff --check` : aucune erreur ;
- [x] contrats statiques des cinq plans de biome, du hub, des POI persistants, des apparitions sûres et de l’instancing ;
- [x] Chromium desktop local : titre et missions, hub jouable, ouverture de la console avec `P`, commandes tactiles masquées sur desktop et cinq biomes inspectés en masque normal ;
- [x] navigateur local : aucun overlay d’erreur et 0 erreur console ;
- [x] quatre WebP v1.6 chargés par Chromium et vérifiés en HTTP 200 local ;
- [x] commit `8df30a7` poussé sur `origin/codex/professional-hunt-pass` ;
- [x] premier déploiement de validation Vercel `dpl_HgUgNRS9k92Asi1Mq8BNVhCLn6C3` en état `READY`, alias public et quatre WebP vérifiés en HTTP 200 ;
- [ ] contrôle sur appareil tactile/mobile réel.

La validation locale et la publication desktop sont terminées. La page publique répond en HTTP 200, les quatre nouvelles matières répondent en HTTP 200 avec le type `image/webp`, et le parcours titre → contrats → hub explorable fonctionne sans overlay. Le contrôle sur appareil tactile physique et le profilage GPU modeste restent des validations non bloquantes.

### Budgets et contrats contrôlés dans le code

| Surface | Contrat v1.6 |
| --- | --- |
| Cinq biomes | 8 groupes de props, 3 POI et 1–2 dangers par biome |
| Variété transverse | 5 installations, 6 sanctuaires et 8 signatures de POI distinctes |
| Hub explorable | WASD/flèches, manette et tactile, 4 stations, 27 colliders, 273 draw calls, 17 239 triangles |
| POI jouables | `decode_record` : +30 santé/+25 énergie ; `tune_beacon` : scan 10 s/150 m ; `scan_archive` : +18 énergie et scan 4 s/75 m ; `scan_trophies` : +40 endurance et honneur ×1,2, avec gains bornés |
| Persistance | POI analysés enregistrés dans la sauvegarde v4 additive ; effet, honneur et sauvegarde non répétables |
| Sécurité spatiale | apparitions sûres, caches/survols éloignés, couverture projectile et limites circulaires |
| Éclairage lisible | palette propre à chaque biome, remplissage ambiant et hémisphérique, key light placée côté joueur ; visibilité et retrait au `dispose` couverts par `biome-lighting-readability.test.js` |
| Instancing | 136 draw calls statiques théoriquement évités |
| Genna | 252 → 89 draw calls (-64,7 %), 5 lots, 168 instances, 31 889 triangles, 28 plantes |
| Accessibilité | `reducedMotion` propagé à l’environnement, la météo, le hub, les navettes et les conteneurs ; transitions, états et interactions préservés |
| Textures v1.6 | 4 WebP originaux OpenAI 1254×1254, chargés dans Chromium et répondant en HTTP 200 local et public avec le type `image/webp` |

## Reproduction rapide

```powershell
npm.cmd test
npm.cmd run build
npm.cmd audit --omit=dev
git diff --check
```

Puis lancer le serveur local et vérifier sur Chromium desktop :

1. l’écran titre, le sélecteur de missions et l’entrée dans le hub ;
2. le déplacement dans le hub et l’ouverture de la console avec `P` ;
3. l’absence des commandes tactiles sur desktop ;
4. les cinq biomes en masque normal, sans overlay ni erreur console ;
5. les quatre chemins WebP v1.6 en HTTP 200 local puis sur l’alias de production.

## Verdict

La release 1.10.0 franchit ses gates avec 299/299 tests, 48 modules Vite, 0 vulnérabilité de production, deux parcours Chromium locaux sans erreur, requête échouée ni débordement horizontal, puis une publication Vercel `READY` contrôlée en HTTP. Les trois dangers de Los Angeles et le cache OWLF sont couverts comme événements réellement déclenchés puis résolus. Le classeur ChatGPT est désormais une source effectivement authentifiée et exploitée ; la vague Los Angeles 1997 ajoute une chasse, un biome ouvert, des adversaires, des systèmes de combat et une texture originale réellement câblés. Le commit `9f56b0d` est poussé et le déploiement production `dpl_2xbt59JRaxhUEcM7MNoqozPSUjqk` sert l’alias officiel en HTTP 200.

La 1.5.0 ne se limite pas à ajouter des noms au Codex : Wolf et le Kalisk possèdent leurs propres boucles de combat, états, dangers, points faibles, textures et contrats. La couverture du Lost Tribe et des médias reste clairement séparée par provenance, et la production déployée a franchi les gates automatisés, navigateur, responsive, sécurité, assets et Vercel.

La 1.6.0 franchit ses gates avec 193/193 tests, 42 modules Vite, 0 vulnérabilité de production, 11 modules contrôlés syntaxiquement, un diff-check propre, le parcours Chromium desktop décrit ci-dessus, le push GitHub et une production Vercel `READY`. Les validations physiques tactiles/manette et le profilage GPU modeste restent recommandés sans bloquer cette publication.
