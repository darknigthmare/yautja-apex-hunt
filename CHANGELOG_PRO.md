# Changelog professionnel

Les versions sont considérées comme publiées uniquement après push du code, validation du Preview et contrôle de l’URL de production.

## [1.11.0] — 26 août 2026

### Onzième chasse et pyramide de Bouvetøya

- contrat `grid_alien` ajouté comme onzième chasse, biome `bouvetoya_pyramid` comme huitième terrain et directive `avp_pyramid_trial` comme dixième mode de chasse ;
- adaptation originale de l’épreuve antarctique d’*Alien vs. Predator* (2004), séparée explicitement d’une reproduction de scène, de carte ou d’asset officiel ;
- plan ouvert de rayon 740 avec dix secteurs, 18 routes bouclées, sept territoires et sept nœuds d’événements/migration, répartis entre surface Weyland, banquise, seuil, chambres, galeries et arène ;
- directive en trois vagues opposant garde Weyland, Facehugger puis guerrier xénomorphe, avec objectifs et répartition spatiale propres.

### Grid Alien, décor et contenu

- boss Grid Alien procédural à 25 244 triangles HD, 37 522 triangles au total et 30 meshes ; dôme biomécanique et queue segmentée sont ciblables et destructibles ;
- silhouette quadrillée, mâchoire interne, tubes dorsaux, bond, balayage de queue, sang/projections acides et réactions de phase raccordés au combat ;
- deux matières OpenAI originales 1254×1254, `bouvetoya-ice-rock.webp` et `bouvetoya-pyramid-stone.webp`, branchées au biome et servies en HTTP 200 local ;
- inventaire porté à 30 textures WebP pour 10 577 574 octets, et catalogues portés à onze chasses, huit biomes, dix directives, quinze armes et 218 entrées.

### Validation locale, GitHub et production

- suite finale de 318/318 tests, build Vite réussi avec 49 modules et `npm audit --omit=dev` à 0 vulnérabilité ;
- Chromium local desktop et 390×844 valide la sélection Bouvetøya, le lancement Grid et le responsive sans erreur applicative ni débordement horizontal ;
- les deux textures Bouvetøya répondent en HTTP 200 local puis en production avec leur type `image/webp` et leurs poids exacts de 484 446 et 409 994 octets ;
- commit fonctionnel `57f5a5c` poussé sur `codex/professional-hunt-pass`, puis déploiement `dpl_Cu8rczE4atodhPm2N5mJgr74TBxL` publié `READY` en production sur l’alias officiel ;
- alias HTML, bundle de 703 336 octets et cinq marqueurs v1.11 contrôlés en HTTP 200 le 28 août 2026 ; aucun journal d’erreur Vercel n’est présent pour ce site statique.

## [1.10.0] — 25 août 2026

### Dixième chasse et Los Angeles 1997

- contrat `city_hunter` ajouté comme dixième chasse, avec biome recommandé `los_angeles_1997` et directive `urban_heatwave_hunt` (« Chasse sous la canicule ») ;
- septième plan de chasse ouvert : rayon 760, dix secteurs, 18 routes bouclées, sept territoires, 20 résidents, sept événements et six étapes de migration de la cible ;
- composition non linéaire répartie entre rues, toits, métro, abattoir, skyline, zones OWLF, caches et appareil de clan, avec props, collisions et perchoirs adaptés à la mobilité verticale ;
- cette mission est une adaptation originale inspirée de *Predator 2* : elle ne reproduit ni le déroulé, ni une scène, ni un asset officiel du film.

### City Hunter, armes et technologie

- boss City Hunter procédural détaillé : masque angulaire, respirateur, 18 predlocks, smart disc, netgun, Medicomp, combistick et trophées ;
- smart disc relié au combat avec trajet sortant, ricochet, retour et récupération ; filet avec dégâts, entrave, drain d’énergie et rupture du camouflage ; Medicomp, vision multispectrale et mêlée propres au boss ;
- roquette de poignet jouable ajoutée comme quinzième arme avec explosion de zone, atténuation des dégâts, coût d’énergie et recharge ;
- classe `class_city_stalker`, huitième style de predlocks, neuvième finition et neuvième warpaint ajoutés sans supprimer les personnalisations existantes ; les totaux atteignent neuf classes, 38 masques, 50 presets, huit styles de predlocks, neuf finitions et neuf warpaints.

### Monde vivant, ennemis et catalogue

- trois PNJ urbains distincts : homme de main de cartel en couverture/rafales, chasseur armé du métro en suppression et commando OWLF cryogénique en filet/repositionnement avec perturbation énergétique ;
- la directive Canicule orchestre ces trois vagues à 9 s, 35 s et 61 s, tandis que le directeur ajoute migrations de proies, factions urbaines, cycle d’ennemis, cache froide OWLF, caches Lost Tribe et véhicule de clan ;
- Codex, couverture média et catalogues distinguent les éléments inspirés de l’écran de leur implémentation originale ; le catalogue consolidé atteint 214 entrées ;
- les totaux runtime passent à dix chasses, neuf directives, quinze armes et neuf classes.

### Classeur ChatGPT réellement exploité

- source lue : `C:\Users\chuck\Downloads\Encyclopedie_exhaustive_franchise_Predator.xlsx` ;
- SHA-256 : `47C659F4F79CA0E71D8B8B7B8DB2CD7B7363827224BC081D59E9DD9D9576983C` ;
- 20 feuilles et 915 entrées uniques issues de la [conversation ChatGPT](https://chatgpt.com/c/6a8adeed-b6f8-83ed-9d07-5088fa50b8a9) ;
- la vague cohérente retenue croise City Hunter, Lost Tribe, wrist rocket, smart disc, netgun, Medicomp, respirateur, trophées, OWLF, lieux, habitants, événements, caches et appareil de clan.

### Texture originale OpenAI

- `public/assets/textures/los-angeles-heatwave-urban.webp` : WebP 1536×1536 de 846 546 octets, généré en bitmap original sans image de référence ;
- la matière raccordable combine asphalte, béton et métal sous lampes sodium, salissures de canicule et micro-détails, sans texte, logo, UI, personnage ou asset officiel ;
- l’inventaire public atteint 28 textures et 9 683 134 octets.

### Validation et publication

- 299/299 tests réussis, `node --check` validé, build Vite 8.2.2 de 48 modules en 525 ms, audit de production à 0 vulnérabilité et `git diff --check` propre ;
- Chromium local 1280×720 et 390×844 valide les dix chasses, les neuf directives, le lancement City Hunter/Los Angeles, la texture urbaine et l’absence d’erreur, de requête échouée ou de débordement horizontal ;
- commit fonctionnel `9f56b0d` poussé sur `codex/professional-hunt-pass` ;
- déploiement Vercel `dpl_2xbt59JRaxhUEcM7MNoqozPSUjqk` en production `READY`, alias public HTTP 200 ; le HTML et le bundle publics confirment `city_hunter`, `los_angeles_1997`, `wrist_rocket`, `la-lightning-grid` et `la-owlf-cache` ;
- la texture urbaine publique répond en HTTP 200 avec le type `image/webp` et sa taille attendue de 846 546 octets.

## [1.9.0] — 25 août 2026

### Neuvième chasse et site noir Stargazer

- contrat interne `upgrade_predator` ajouté pour la chasse de l’Assassin Predator (2018), génétiquement amélioré, avec biome recommandé `stargazer_blacksite` et directive `stargazer_breach` en trois vagues ;
- sixième plan de chasse réellement parcourable : rayon 680, neuf secteurs, 16 routes bouclées, six territoires écologiques, 15 résidents, six événements, quatre points d’intérêt et deux dangers ;
- huit groupes de props et des repères propres au site noir structurent checkpoints, laboratoire, piste, crash et archives sans réduire la carte à un couloir ; la piste suit la poursuite de l’Assassin autour de l’évasion du Fugitive ;
- appareil d’évasion Fugitive endommagé ajouté comme véhicule interactif, avec scan amélioré, ainsi qu’un profil de cache `stargazer_salvage` donnant des ressources bornées ;
- l’Assassin Predator (2018), génétiquement amélioré, dispose d’une silhouette procédurale haute définition de 29 468 triangles, d’une armure biologique, de glandes adaptatives destructibles, d’une régénération bornée et d’un bond écrasant télégraphié que le filet peut interrompre.

### Accès aux rôles manquants par directive

- trois directives sont ajoutées en 1.9, portant le total de cinq à huit avec `stargazer_breach` ;
- `game_preserve_escape` — « Évasion de la planète-réserve » — se déroule dans la jungle et rend accessibles `hell_hound_alpha` à 11 s puis `river_ghost` à 41 s ; provenance `SCREEN_ADAPTATION`, récompense ×1,30 ;
- `hive_containment_failure` — « Rupture du confinement de la ruche » — se déroule sur `hive_lv426` et introduit `colonial_marine_smartgunner` à 9 s, `weyland_field_synthetic` à 33 s puis `xeno_facehugger` à 57 s ; provenance `CROSSOVER_SCREEN_ADAPTATION`, récompense ×1,40 ;
- ces deux parcours ferment le trou d’accessibilité qui laissait cinq rôles enregistrés dans le catalogue sans voie de rencontre en chasse.

### Huit rôles PNJ à comportements distincts

- `hell_hound_alpha` rallie la meute et renforce les molosses proches ;
- `river_ghost` alterne pas de côté, harcèlement et repli ;
- `colonial_marine_smartgunner` maintient une suppression à distance et recule lorsque la pression augmente ;
- `weyland_field_synthetic` cherche et répare les alliés endommagés ;
- `xeno_facehugger` prépare puis déclenche un bond rapproché ;
- `stargazer_rifleman` exploite couvert et rafales ;
- `stargazer_net_trapper` pose son filet puis change de position ;
- `modified_predator_hound` combine ralliement de meute et charge coordonnée.

### Arsenal, technologie et personnalisation

- quatre armes sont réellement sélectionnables après l’arsenal historique : lance-traits Feral au slot 10 `[-]`, double plasma Wolf au slot 11 `[=]`, Eye of Ra puissant et précis mais à cadence lente au slot 12 `[`, et Épée Yautja — Father au slot 13 `]` ; leurs projectiles, cadence/coûts ou mêlée sont reliés au combat ;
- gadget `apex_decoy` sur `[Y]` : hologramme 3D temporaire, consommation d’énergie, recharge et attraction effective des ennemis ;
- classes Tracker, Falconer, Cleaner et Fugitive ajoutées, portant le total à huit profils jouables ;
- trois styles de predlocks supplémentaires portent le total à sept ; les nouvelles finitions et warpaints portent chacun leur sélection à huit ;
- métadonnées de provenance et d’équilibrage conservées pour les variantes Feral, Wolf, Eye of Ra et Father.

### Hub, catalogue et cohérence

- galerie et nexus étendus à neuf contrats ; les neuf stations sont réparties en double rangée avec une allée centrale dégagée ;
- les trois anneaux holographiques répétés de chaque station sont regroupés en instancing afin d’absorber l’augmentation de contenu sans multiplier inutilement les appels de rendu ;
- catalogue, Codex et registre de couverture raccordent Stargazer, l’Assassin Predator (2018) génétiquement amélioré, les nouvelles proies et les nouveaux équipements à un statut runtime honnête ;
- l’adaptation reste une construction procédurale originale du fan game : aucun modèle, texture ou autre asset officiel n’est intégré.

### État du tableur et validation

- le tableur n’avait pas été exploité pour cette release 1.9 ; il a depuis été retrouvé et lu pour la release 1.10, ce qui corrige l’ancienne conclusion selon laquelle il était absent ;
- la candidate finale réussit 278/278 tests, le build Vite 8.2.2 de 47 modules, l’audit de production à 0 vulnérabilité et `git diff --check` ;
- Chromium local et celui de production valident neuf chasses, huit directives, le lancement Assassin/Stargazer et le responsive 390×844 sans overlay ni erreur applicative ; le commit `3314fe4` est poussé et le déploiement `dpl_FofpWaJDdkSjrnQeNTtQRdwNmZ6L` est `READY` sur l’alias public HTTP 200.

## [1.8.0] — 25 août 2026

### Directives de chasse

- cinq profils immuables sont disponibles : `standard_hunt` sans objectif et à multiplicateur ×1, `jungle_fireteam` pour les trois rôles de la fireteam de jungle, `blooding_rite` pour trois castes xénomorphes, `killer_eras` pour les trois ères Viking, Japon féodal et Seconde Guerre mondiale, et `deathworld_protocol` pour la faune et les synthétiques de Genna ;
- chaque directive recommande son biome, expose un planning de vagues `directive_wave` et conserve une provenance explicite `SCREEN` ou `ORIGINAL` ;
- les identifiants inconnus retombent explicitement sur `standard_hunt` sans muter les définitions partagées.

### Rencontres 3D et directeur

- sept nouveaux archétypes 3D : `jungle_scout`, `jungle_gunner`, `jungle_trapper`, `era_viking_raider`, `era_feudal_duelist`, `era_wartime_pilot` et `genna_sporeback` ;
- les vagues imposent strictement leurs `enemyTypes`, rejettent les types non enregistrés et respectent un plafond global de 24 PNJ actifs ;
- les ennemis des trois ères, les rencontres de jungle et de Genna ainsi que les événements `event_killer_eras` et `event_genna_predation_cycle` portent désormais un statut runtime `encounter` cohérent avec leur présence jouable.

### Progression, HUD et sauvegarde

- la progression sérialisable mémorise les éliminations par objectif sans modifier les définitions de directive ;
- le HUD affiche la directive active, l’avancement de chaque objectif et l’état du bonus ;
- la sauvegarde v4 restaure les identifiants des directives accomplies ; l’avancement actif reste propre à la chasse en cours et un identifiant de sélection absent ou inconnu retombe sur la chasse standard ;
- le multiplicateur de récompense ne s’applique que lorsque tous les objectifs de la directive sont complets.

### Catalogue et assets

- deux entrées de niveau sont ajoutées : `event_jungle_fireteam_directive`, sourcée sur *Predator* (1987), et `event_avp_blooding_directive`, sourcée sur *Alien vs. Predator* (2004) ; leur orchestration gameplay reste balisée comme implémentation originale ;
- `genna-sporeback-carapace.webp`, matière OpenAI originale 1024×1024 de 343 106 octets, est destinée au mesh du Sporeback de Genna ;
- l’inventaire public passe à 27 textures WebP pour un poids total de 8 836 588 octets, le PNG maître restant conservé localement hors Git.

## [1.7.0] — 25 août 2026

### Grande chasse ouverte

- cinq layouts déterministes de 630 à 660 unités de rayon et terrains de 1 420 à 1 500 unités, contre 300 et 800 auparavant ;
- neuf secteurs, 12–13 routes en boucles, un camp, six nœuds d’événements et cinq étapes de migration Apex par biome ;
- rubans de sol, balises sectorielles, marqueurs d’événement et environ 43 couverts extérieurs instanciés par carte ;
- relief macro des secteurs appliqué aux routes, au terrain et aux ancrages gameplay ;
- quota de neuf couverts physiques répartis sur les neuf secteurs, y compris dans la Jungle saturée, avec déclassement de piliers redondants en couverture projectile-only ;
- limites de déplacement du joueur et des boss rendues dynamiques afin que toute la nouvelle surface soit réellement jouable ;
- sockets des renforts redistribués dans les secteurs extérieurs au lieu de rester concentrés dans le noyau historique.

### Monde vivant

- 12 à 15 créatures résidentes par biome, placées au lancement selon six territoires maximum ;
- IA ambiante avec patrouille déterministe, portée d’agression, poursuite, laisse et retour au territoire ;
- coureur xénomorphe, drone sentinelle de clan et brouteur de Genna ajoutés avec silhouettes et textures runtime distinctes ;
- planning étendu à 190 s avec perturbations localisées, migrations, conflits de territoire et migration Apex ;
- conflits de territoire matérialisés par convergence et dégâts strictement entre les deux factions annoncées, sans attribuer au joueur l’honneur d’une élimination écologique ;
- PNJ recalés à chaque frame sur le relief et meshes resynchronisés après résolution physique ;
- cible principale sur une route de cinq territoires sûrs, avec steering autour des colliders, migrations forcées de phase et absence d’agression globale à travers la carte ;
- projectiles, mines, zones Cleaner et bouclier Feral continuent d’évoluer au delta pendant les migrations passives.

### Fidélité géométrique des boss

- greffe HD propre aux huit boss : Goliath 17 100 triangles, Reine 22 465, Bad Blood 18 592, Predalien 20 029, Super Predator 24 178, Feral 22 551, Wolf 25 379 et Kalisk 26 256 ;
- signatures de silhouette distinctes, matériaux runtime existants, visions thermique/camouflage et détails destructibles synchronisés ;
- aucune extraction d’asset officiel : géométrie procédurale originale et textures originales du projet, guidées par les caractéristiques de référence sans reproduire de modèle propriétaire.

### Benchmark de conception

- principes officiels de *Monster Hunter: World* retenus : environnement continu, densité écologique, interactions faune/flore, sous-biomes et aides de lecture ;
- aucune superficie MHW inventée : la comparaison de production repose sur la durée de traversée, les boucles, les secteurs, la distribution des menaces et le nombre d’événements ;
- cartes Yautja originales et non linéaires, sans clonage d’un niveau Capcom.

### Validation et publication

- 218/218 tests Node réussis, dont nouveaux contrats layout, écologie, événements, migration Apex, terrain transformé, steering et budgets HD ;
- build Vite 8.2.2 réussi avec 45 modules ; jeu à 491,40 Ko et chunk Three.js à 505 Ko, avec avertissement de taille non bloquant ;
- `npm audit --omit=dev` à 0 vulnérabilité et `git diff --check` sans erreur ;
- Chromium 1280×720 local : huit contrats présents, Kalisk/Genna lancé, vision normale, cible à plus de 800 m, événement écologique visible et 0 erreur applicative ;
- commit fonctionnel `94bb326` poussé sur `codex/professional-hunt-pass`, déploiement Vercel `dpl_En8EmhSsfxE7SZFPYEApyYwo134h` en production `READY` et alias public contrôlé en HTTP 200 ;
- Chromium production : huit contrats visibles, Kalisk/Genna actif à 1 020 m, tempête thermique, HUD et parties destructibles présents, console sans erreur.

## [1.6.0] — 25 août 2026

### Props et composition des cinq terrains de chasse

- catalogue de level design déterministe ajouté aux cinq biomes, avec huit groupes de props nommés, trois points d’intérêt et un à deux dangers localisés par carte ;
- jungle structurée autour d’une porte rituelle, d’un camp de traque, d’un arbre à trophées, d’une épave et de deux lignes de progression ;
- ruche organisée entre sas colonial, nursery, estrade royale, couloirs de côtes, cocons et traces d’une intervention Cleaner ;
- Ryushi enrichi d’un homestead frontalier, d’un château d’eau, d’un enclos, d’un crawler enseveli, de coupe-vents et de balises ;
- Yautja Prime composé comme une arène de clan : porte des Anciens, dais de blooding, sanctuaire d’armes, galerie de trophées, cercle de braseros et gradins de totems ;
- Genna articulé autour d’une épave d’expédition, de l’aire du Kalisk, d’un réseau synthétique, de bosquets de spores, de nœuds régénératifs et d’arches osseuses.

### Lecture, interaction et combat dans l’espace

- couvertures et structures majeures déclarées avec des volumes de collision afin de créer de vraies lignes de tir et des routes protégées ;
- perchoirs et silhouettes hautes répartis sur les cartes pour renforcer la lecture verticale sans rendre les limites jouables ambiguës ;
- trois archives environnementales par biome, chacune avec rayon d’interaction, message contextuel, récompense d’honneur et l’un des quatre profils d’effet réellement branchés ;
- effets de première analyse différenciés : `decode_record` restaure jusqu’à 30 points de santé et 25 d’énergie, `tune_beacon` révèle les signatures pendant 10 s dans un rayon de 150 m, `scan_archive` rend jusqu’à 18 points d’énergie et scanne 4 s à 75 m, tandis que `scan_trophies` rend jusqu’à 40 points d’endurance et applique un multiplicateur d’honneur de ×1,2 ;
- zones dangereuses lisibles et localisées : lianes prédatrices, bassins acides, évent thermique, brasero plasma et évents de spores ;
- éclairage de chasse biome-aware composé d’un remplissage ambiant, d’un hémisphérique et d’une key light côté joueur ; les lumières suivent la visibilité de l’environnement et sont retirées au `dispose`, avec test dédié ;
- budgets explicites de props, POI, dangers, colliders, draw calls et triangles pour conserver un coût stable lors des changements de biome.

### Vaisseau-mère et narration environnementale

- pont segmenté, routes au sol, nervures, plafonniers et conduites structurent les circulations du hub ;
- galerie de huit trophées aux silhouettes propres, nexus de huit contrats holographiques et quatre balises directionnelles renforcent l’orientation ;
- forge et armurerie densifiées avec foyer, confinement, noyau moléculaire, bras manipulateurs, extraction, râtelier d’armes, console et caisses ;
- hangar enrichi de pads lumineux, appareils Scout/navette/pod détaillés, portique, console et stockage ;
- continuité éditoriale maintenue : la disposition précise du vaisseau, ses archives et ses rituels spatiaux restent des créations `ORIGINAL`, même lorsqu’ils s’appuient sur un vocabulaire visuel vu à l’écran.

### Matériaux OpenAI originaux

- quatre textures WebP 1254×1254 ajoutées pour les panneaux frontaliers de Ryushi, la membrane biomécanique de la ruche, le bronze cérémoniel Yautja et la peau de gousse de Genna ;
- génération bitmap originale avec OpenAI, sans image officielle de référence, texte, logo, watermark, key art ou revendication de droits sur la franchise ;
- chemins, dimensions, poids, usages et prompts résumés consignés dans les documents d’assets.

### Validation et publication

- suite locale : 193/193 tests, build Vite de 42 modules, `node --check` sur 11 modules, `npm audit --omit=dev` à 0 vulnérabilité et `git diff --check` sans erreur ;
- Chromium desktop local : titre/missions, hub jouable, touche `P`, commandes tactiles masquées sur desktop et cinq biomes inspectés en masque normal, sans overlay ni erreur console ;
- quatre WebP v1.6 chargés par Chromium et vérifiés en HTTP 200 local puis sur la production avec le type `image/webp` ;
- commit `8df30a7` poussé sur `codex/professional-hunt-pass`, déploiement `dpl_HgUgNRS9k92Asi1Mq8BNVhCLn6C3` en production `READY` et alias <https://yautja-apex-hunt.vercel.app/> contrôlé en HTTP 200.

### Mesures finales et garde-fous v1.6

- cinq biomes livrés avec huit groupes de props, trois POI et un à deux dangers chacun ; cinq installations, six sanctuaires et huit signatures de POI distinctes assurent la différenciation entre cartes ;
- POI persistants et anti-farm intégrés de manière additive au format de sauvegarde v4 ;
- apparitions sûres, placement éloigné des caches et survols, couvertures prises en compte par les projectiles et limites circulaires appliqués au runtime ;
- vaisseau-mère explorable en WASD/flèches, à la manette et via commandes tactiles avec quatre stations, 27 colliders, 273 draw calls budgétés et 17 239 triangles ;
- instancing statique représentant 136 draw calls théoriques évités ; Genna passe de 252 à 89 appels (-64,7 %) avec cinq lots, 168 instances, 31 889 triangles et 28 plantes ;
- `reducedMotion` propagé à l’environnement, au hub, aux navettes et aux conteneurs : flottement, roulis, pulsations et émissions décoratives sont figés ou atténués, tandis que transitions, états et interactions restent actifs ;
- gates locaux, push GitHub et QA de production réussis ; appareil tactile/manette physique et profilage GPU modeste restent recommandés.

## [1.5.0] — 24 août 2026

### Contrats réellement jouables

- passage de six à huit contrats : Wolf Cleaner et le Kalisk de Genna rejoignent Goliath, la Reine xénomorphe, Bad Blood, le Predalien, le Berserker et le Feral ;
- Wolf dispose d’un combat dédié avec plasma double, fouet, mines de proximité, agent dissolvant et sous-systèmes de masque/mallette Cleaner ;
- le Kalisk possède une carapace adaptative, des phases de charge et d’empalement, ainsi qu’une régénération interruptible avant exposition du noyau.

### Lost Tribe, équipement et provenance

- huit presets et huit bio-masques Lost Tribe ajoutés : Boar, Shaman, Snake, Guardian, Stalker, Warrior, Armored Lost et Scout ;
- nouveau niveau `LICENSED_SCREEN_DESIGN`, distinct de `SCREEN`, pour les identités et détails documentés par des produits ou archives sous licence autour de silhouettes visibles dans *Predator 2* ;
- accessoires de collection non attestés dans le montage, tel le fusil du Scout, isolés sous `MERCH_CONCEPT` au lieu d’être présentés comme canon écran ;
- arsenal de Wolf, rituel de nettoyage de Gunnison et cycle de régénération du Kalisk ajoutés au catalogue avec leur statut runtime réel.

### Registre par œuvre et backlog documentaire

- registre de 29 œuvres et médias avec provenance, continuité, cible de couverture et statut de sortie ;
- séparation explicite des contenus publiés, coupés du montage, non publiés, promotionnels et crossovers alternatifs ;
- le tableur évoqué par l’utilisateur n’était pas accessible dans le workspace ni les pièces jointes de cette passe ; aucune donnée ne lui est attribuée et sa confrontation au registre reste un contrôle documentaire futur.

### Visuels OpenAI originaux

- trois textures WebP 1024×1024 ajoutées et branchées au contenu correspondant : alliage Cleaner de Wolf, os rituel du Lost Tribe et peau adaptative du Kalisk ;
- génération bitmap nouvelle avec OpenAI, sans image officielle de référence, logo, texte, key art ou revendication de droits sur la franchise ;
- prompts résumés, usages et poids consignés dans les documents d’assets.

### Limites connues après la passe

- Gunnison reste à développer en environnement réellement multi-niveaux ;
- les campagnes complètes *Killer of Killers* et *Alien vs. Predator* restent à produire ;
- Genna demande encore davantage de familles de faune et de flore aux comportements distincts.

### Validation et publication

- cette entrée décrit le code et les assets intégrés ; les résultats des tests, du build, du contrôle navigateur et du déploiement ne doivent être annoncés que dans le rapport QA et le bilan de release après leur exécution effective.

## [1.4.0] — 22 août 2026

### Chasses, proies et monde vivant

- sixième contrat contre le Feral : triple lance-traits mobile, bouclier frontal à intégrité, estoc et charge à la lance télégraphiée avec impact unique ;
- quatre nouvelles familles de PNJ 3D : grizzly territorial, traqueur thermique de confinement, traqueur organique de Genna et guerrier xénomorphe ;
- quatre vagues par chasse avec compositions propres à Genna, la jungle, la ruche et les terrains humains.

### Technologies et personnalisation

- bouclier de poignet `[B]`, drone-faucon `[G]` et shuriken `[T]` réellement activables, avec coûts, recharges, objets 3D, impacts et états HUD ;
- quatre classes de chasseur aux statistiques distinctes, quatre styles de predlocks, quatre finitions d’armure et quatre warpaints procéduraux ;
- rugissement d’honneur limité à une utilisation par chasse afin de supprimer la recharge exploitable à l’infini.

### Genna et visuels OpenAI

- cinquième biome `genna_deathworld` : 28 plantes prédatrices, 14 petites créatures instanciées et 520 spores animées, tous figés avec mouvement réduit ;
- quatre textures originales OpenAI 1024×1024 pour le sol et la flore de Genna, le composite osseux du Feral et les équipements tactiques humains ;
- galerie du vaisseau-mère et sélection de mission étendues à six contrats, avec nouvelle carte texturée du Feral.

### Progression, catalogue et cohérence

- sauvegarde locale v4 avec migration v1/v2/v3, apparence à neuf axes et honneur cumulé séparé des crédits dépensables ;
- rang Yautja calculé sur l’honneur de carrière : les achats de forge ne font plus perdre un rang déjà acquis ;
- 110 fiches de contenu dont les statuts jouable/rencontre 3D reflètent désormais les mécaniques effectivement livrées.

### Validation et publication

- 99/99 tests Node couvrant boss, proies, équipements, Genna, galerie à six trophées et migrations de sauvegarde ;
- build Vite 8.2.2, audit npm et contrôle statique validés sur le worktree final ;
- parcours Chromium desktop/mobile, sixième contrat, Forge v4 et nouveaux assets contrôlés sans erreur de page ;
- release poussée sur GitHub et publiée sur <https://yautja-apex-hunt.vercel.app/>.

## [1.3.0] — 22 août 2026

### Contenu réellement intégré

- cinquième chasse contre le Berserker Super Predator avec plasma lourd, charge télégraphiée, bris du masque, rage et trophée ;
- quatre archétypes de PNJ 3D : commando humain, drone xénomorphe, molosse de chasse et synthétique de combat ;
- événements de niveau déterministes : survol, renforts, dangers météo, conteneurs et fin de perturbation ;
- trois navettes Yautja 3D et quatre conteneurs interactifs aux récompenses propres aux biomes ;
- arc Yautja et lance-harpons ajoutés à l’arsenal, désormais jouable sur dix raccourcis de `1` à `0` ;
- mimétisme vocal directionnel : trois appels sonores détournent réellement les PNJ proches vers un point de leurre ;
- combat des renforts maintenu après la mort du boss jusqu’au prélèvement du trophée.

### Personnalisation et franchise

- 30 bio-masques procéduraux, 42 presets d’armure, huit couleurs de peau, huit couleurs de predlocks, douze alliages et huit accents ;
- sept silhouettes dédiées aux classes Gladiator, Anubis, Exalted, Witch, Oni, Jotun et Father de Hunting Grounds ;
- 109 dossiers de technologies, véhicules, ennemis, événements, boss et soutien, chacun marqué `JOUABLE`, `RENCONTRE 3D`, `GALERIE 3D` ou `ARCHIVE` ;
- ajouts sourcés liés à The Predator, Prey, Predators, AVP, Killer of Killers, Badlands et aux contenus licenciés Hunting Grounds ;
- Assassin Predator séparé du Fugitive, et créations Apex explicitement signalées comme interprétations originales.

### Visuels OpenAI

- six textures originales fan-made 1254×1254 générées avec OpenAI pour peau Yautja, bio-masque, carapace xénomorphe, Goliath, molosse et réseau énergétique ;
- quinze WebP runtime totalisant 4 661 738 octets, sans texte, logo, watermark ni copie de key art officiel ;
- textures branchées sur le joueur, les boss, PNJ, navettes, conteneurs, hangar et interface de Forge.

### Fiabilité et publication

- sauvegarde v3 des cinq canaux d’apparence, avec migrations v1/v2 et reconstruction des anciens presets ;
- 71/71 tests Node, build Vite 8.2.2, audit npm à 0 vulnérabilité et `git diff --check` propre ;
- QA Chromium desktop/mobile : 109 fiches, 42 armures, 30 masques, 10 armes, aucun overlay ni erreur et aucun débordement à 390×844 ;
- revue lore finale : GO, aucun défaut P0/P1 ;
- six nouvelles textures contrôlées en HTTP 200 localement puis sur la production publique ;
- release poussée sur GitHub et publiée sur <https://yautja-apex-hunt.vercel.app/>.

## [1.2.0] — 22 août 2026

### Ajouté

- format de sauvegarde versionné v2 avec migration de l'ancien format ;
- persistance de la peau, des chasses terminées, trophées et options ;
- règles isolées de mêlée pour lames de poignet et fouet ;
- tests Node dédiés au combat, au lore, à la sauvegarde, au cycle de vie et aux contrats web/HUD ;
- configuration centralisée des chasses, biomes et préférences ;
- Codex de lore avec niveaux `SCREEN`, `AVP_SCREEN`, `LICENSED_EU` et `ORIGINAL` ;
- neuf textures originales générées avec le modèle ImageGen intégré OpenAI, dont os de trophée, cuir-filet et membrane d’œuf ;
- infrastructure d'options pour audio, mouvement réduit, fort contraste et échelle du HUD ;
- documentation de production : audit, game design, direction artistique, lore, assets et QA.

### Corrigé

- import du gestionnaire d'environnement principal redirigé vers l'implémentation complète ;
- autodestruction protégée contre les explosions répétées et associée à un état terminal ;
- état du joueur réinitialisable entre les chasses ;
- attribution d'honneur rendue explicite et dédupliquée au niveau des règles ;
- QTE facehugger rendu idempotent, timer remis à zéro et récompense affichée selon le gain réel ; corrosion acide corrigée pour forcer le décloak avant verrouillage ;
- matériaux de peau limités aux éléments destinés à être teintés ;
- trophées du hub pilotables par la liste des chasses terminées ;
- états acquis/inabordables de la forge explicités, boutons désactivés de façon accessible et alertes natives remplacées par le journal HUD ; mutations par frame mises en cache, jauges ARIA et cibles tactiles réelles de 44 px ajoutées ;
- ressources de biome nettoyables lors d'un changement d'environnement.

### Intégré et validé techniquement

- intégration des dégâts de mêlée et projectiles Bad Blood ; queues et attaques acides de la Reine/du Predalien suivent désormais signal, fenêtre de réaction, impact unique et récupération ;
- implémentation du zoom, pause, reprise, abandon et options ; persistance du zoom et de la peau après rechargement ;
- Codex sourcé et niveaux de continuité visibles ;
- armurerie et arsenal utilisables au clavier ;
- responsive 390×844 sans débordement horizontal et audit axe à 0 violation ;
- chargement réel des neuf textures OpenAI optimisées, toutes observées en HTTP 200 dans Chromium ;
- démarrage/cleanup des quatre cibles dans les quatre biomes de référence ;
- autodestruction complète sans gain abusif, 33/33 tests, build Vite final et smoke tests Chromium 1280×720 / 390×844 sans erreur de page.

### Sécurité et dépendances

- Vite porté à 8.2.2 ; audit final à 0 vulnérabilité connue.
- Three.js séparé dans un chunk cacheable de 477,51 Ko ; build final sans warning de taille.

### Validation physique post-release encore recommandée

- accomplir manuellement une victoire complète, une défaite et l'autodestruction pour contrôler toute la mise en scène ;
- provoquer en jeu les impacts Bad Blood, Reine, Predalien et le QTE facehugger ;
- inspecter visuellement à 100 % les raccords 2×2 des WebP sur plusieurs écrans physiques ;
- mesurer les performances sur téléphone réel et machine GPU modeste ;

### Publication

- source fonctionnelle poussée sur `master` au commit `ce5cd245a4b37614946e9aacbc08f61034c4726b` ;
- Preview Vercel vérifié en HTTP 200 avec le bundle, les headers de sécurité et les neuf textures, puis promu en production ;
- version 1.2.0 disponible sur <https://yautja-apex-hunt.vercel.app/>.
