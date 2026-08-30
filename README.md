# Yautja: Apex Hunt

Jeu de chasse 3D pour navigateur construit avec Three.js et Vite. Le joueur incarne un chasseur Yautja, forge une apparence modulaire dans le vaisseau-mère, puis affronte onze cibles et des incidents dynamiques dans neuf biomes.

## État du projet

La version 1.13.0 Croiseur/Paquetage prolonge la release Gunnison/Predalien sur [GitHub](https://github.com/darknigthmare/yautja-apex-hunt) et [yautja-apex-hunt.vercel.app](https://yautja-apex-hunt.vercel.app/). Elle transforme le hub en croiseur compartimenté et impose une préparation de chasse persistante : le joueur ne peut plus emporter simultanément tout l’arsenal.

Le commit fonctionnel 89518b9 est poussé sur codex/professional-hunt-pass ; le déploiement dpl_AeeAnjSarUhCmcWQ9iaVcMkgzAhu est READY en production et l’alias officiel répond en HTTP 200 avec les marqueurs v1.13.

La baseline v1.12 avait franchi 365 tests, le build Vite, l’audit de production et les parcours Chromium desktop/mobile locaux puis publics. La v1.13 conserve les neuf biomes, onze directives et 236 entrées de catalogue, ajoute onze zones de vaisseau, treize portes, dix stations, un système de presets de paquetage et des commandes de chasse tactiles/manette complètes.

## Lancer localement

Prérequis : Node.js 20.19+, 22.12+ ou 24.x ; Node 25+ n’est pas activé sans nouvelle validation de release.

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

- croiseur de 138 × 184 × 38 m, onze compartiments, treize portes/coursives, dix perchoirs et dix stations : pont, navigation, cryostase, pods d’évasion, laboratoire Cleaner/infirmerie, hangar, armurerie, noyau, forge/trophées et sas arrière ;
- préparation obligatoire avant chaque contrat : systèmes de base permanents, slots mêlée/secondaire/distance/gadgets/soutien, capacité propre à chacune des dix classes, restrictions de déblocage, incompatibilités, recommandations et douze presets persistants ;
- le HUD, les raccourcis, les attaques et les assemblages 3D portés sont filtrés par le paquetage actif ; les wristblades, le biomask et le camouflage optique restent le noyau du chasseur ;
- hub du vaisseau-mère, arsenal, forge et trophées persistants ;
- onze chasses : Goliath Xeno-Akumo, Reine xénomorphe, rival Bad Blood, Predalien, Berserker Super Predator, Feral, Wolf Cleaner, Kalisk, Assassin Predator (2018), génétiquement amélioré, City Hunter dans l’adaptation originale Los Angeles 1997 et Grid Alien dans l’épreuve de Bouvetøya ;
- neuf biomes : jungle, ruche, Ryushi, arène de clan, monde mortel de Genna, site noir Stargazer, Los Angeles 1997 sous canicule, pyramide antarctique de Bouvetøya et Gunnison sous pluie nocturne ;
- neuf plans déterministes de 630 à 760 unités de rayon, tous organisés en boucles ; Gunnison déploie dix secteurs, 21 routes non linéaires, sept territoires, 19 habitants et huit nœuds d’événements sur un rayon jouable de 760 unités ;
- trente-et-une familles de PNJ 3D, dont le garde d’expédition Weyland polaire, trois adversaires urbains et le fusilier de la Garde nationale de Gunnison, avec comportements distincts, patrouilles territoriales, migrations de proies, conflits d’écosystème, renforts bornés et combat maintenu jusqu’au prélèvement ;
- six profils de véhicules/navettes 3D de niveau, dont l’appareil d’évasion Fugitive endommagé, l’intercepteur de clan de Los Angeles, le vaisseau rituel AVP et l’appareil Cleaner de Wolf, ainsi que huit profils de conteneurs interactifs, dont la récupération Stargazer, le cache froid OWLF et la mallette Cleaner ;
- quinze armes jouables : l’arsenal historique est complété par la roquette de poignet du profil City Stalker, avec explosion de zone, coût d’énergie et recharge propres ; bouclier `[B]`, drone-faucon `[G]`, shuriken `[T]`, leurre Apex `[Y]`, camouflage, vision et mimétisme complètent l’équipement ;
- dix classes jouables, 38 bio-masques, 50 presets d’armure et neuf axes modulaires : classe, masque, peau, couleur/style de predlocks, couleur/accent/finition d’armure et warpaint ; la sélection atteint dix styles de predlocks, onze finitions et onze warpaints grâce aux variantes Wolf ; les huit variantes Lost Tribe restent balisées `LICENSED_SCREEN_DESIGN` ;
- progression d’honneur cumulée, crédits de forge et sauvegarde locale v4 avec migration v1/v2/v3 ;
- catalogue franchise/support de 236 entrées au statut explicite — jouable, rencontre 3D, galerie 3D ou archive — complété par un registre de 29 œuvres et médias distinguant publié, coupé, non publié, promotion et crossover séparé ;
- pause, audio, mouvement réduit, fort contraste et échelle du HUD ;
- Codex séparant écran Predator, écran AVP, univers étendu sous licence et créations originales.

## Direction artistique et assets

Les trente-et-une textures de décor, props et créatures sous `public/assets/textures/`, totalisant 11 069 990 octets, sont des créations originales générées avec le modèle ImageGen intégré OpenAI, puis converties en WebP. La v1.12 ajoute `gunnison-rain-urban.webp`, matière 1254×1254 de 492 416 octets pour l’asphalte, le béton, les ruelles, la cour de service de l’hôpital et les accès aux égouts. Elle a été produite en nouvelle génération, sans image officielle fournie comme référence ; elle ne transfère ni ne revendique de droit sur les designs ou marques de la franchise. Le prompt exact, la provenance et les poids sont consignés dans `ASSET_GENERATION_PROMPTS.md` et `ASSET_MANIFEST.md`.

## Passe v1.12 — Gunnison, animation et fidélité d’équipement

- neuvième biome `gunnison_outbreak` : rayon 760, dix secteurs, 21 routes bouclées, sept territoires, 19 habitants, huit nœuds d’événements, 17 familles de props, quatre POI et quatre dangers ; le plan relie forêt du crash, cimetière, centrale, ville, égouts, lycée, hôpital, toits et zone d’extraction sans imposer de couloir unique ;
- onzième directive `gunnison_cleanup` en quatre vagues/objectifs, Garde nationale 3D avec rafales de quatre tirs et couverture, vaisseau Cleaner de Wolf, balise de détresse, mines laser, mallette, seringue, gantelet de puissance et armure anti-acide ;
- événements réellement spatialisés : panne du réseau qui coupe les lumières, rupture de ruche dans les égouts, effondrement du cordon militaire, sprinklers de l’hôpital et extraction à compte à rebours avec réussite ou sanction ;
- contrôle AZERTY corrigé : `Z`/`W`/flèche haut avance dans l’axe caméra, `S` recule, `Q`/`A` va à gauche et `D` à droite ; le tactile et la manette suivent la même convention ;
- rig Yautja procédural de 17 articulations et huit états — repos, marche, sprint, attaque, impact, soin, perchoir et autodestruction — avec 79 286 triangles authored ; la silhouette active représente 65 092 triangles en standard et 73 170 avec le kit Wolf ;
- lames de poignet reconstruites comme armes effilées avec fourreaux, rails, pistons et verrouillages, variantes triple Chopper et double Wolf ; leur portée/cadence réellement jouable vaut 8,50 m/0,400 s en standard, 11,73 m/0,424 s pour Chopper et 9,52 m/0,432 s pour Wolf ; combistick, smart disc, lance-filet, mine plasma, shuriken et roquette de poignet disposent chacun d’une géométrie procédurale identifiable au lieu d’un volume générique ;
- Predalien de Gunnison reconstruit à 111 670 triangles et 150 meshes nommés dans l’assemblage final de production : dôme/crête, quatre mandibules, mâchoire interne, tubes dorsaux, membres digitigrades, predlocks, queue segmentée, respiration, course, morsure, frénésie, balayage et réactions aux impacts ; la factory reconnaît ce rig `nativeHighDetail` et n’ajoute plus les 17 910 triangles/32 draws génériques redondants ;
- LOD distant dédié aux 31 familles de PNJ : le contrat de référence passe de 499 à 87 draws (−82,57 %), sans qu’aucun archétype ne réduise de moins de 75 %, avec hystérésis pour éviter le clignotement de niveau de détail ;
- budget statique Gunnison documenté à neuf lots instanciés et 216 instances, 166 appels de rendu sur un plafond de 180, 66 082 triangles sur 220 000 et 72 colliders sur 72 ; ces valeurs sont des budgets de construction, pas un profilage GPU matériel ;
- catalogues courants : 236 entrées, dont 48 technologies, 15 véhicules, 37 ennemis, 31 événements, 15 boss et 13 éléments de support ; les statuts `playable`, `encounter`, `customization` et `archive` restent explicites.

Le lot Gunnison/AVP:R provient du classeur réellement lu `C:\Users\chuck\Downloads\Encyclopedie_exhaustive_franchise_Predator.xlsx`, SHA-256 `47C659F4F79CA0E71D8B8B7B8DB2CD7B7363827224BC081D59E9DD9D9576983C`, composé de 20 feuilles et 915 entrées uniques, issu de la [conversation ChatGPT source](https://chatgpt.com/c/6a8adeed-b6f8-83ed-9d07-5088fa50b8a9). Les rapprochements v1.12 utilisent `Lieux!A20:Q20`, `A29:Q29`, `A41:Q41`, `A49:Q51`, `A62:Q62`, `A105:Q105`, `A115:Q119` ; `Armes!A45:Q45`, `A50:Q50`, `A58:Q59`, `A78:Q79` ; `Équipements!A5:Q5`, `A13:Q14`, `A35:Q35`, `A40:Q40`, `A61:Q61` ; `Véhicules!A38:Q48`, `A64:Q64` ; `Masques!A61:Q61` ; `Peaux!A36:Q36` ; `Dreads!A10:Q10`, `A45:Q45` et `Rituels!A33:Q33`. Chaque élément retenu reste séparé entre référence `AVP_SCREEN` et topologie, statistiques, événements ou géométries `ORIGINAL` du fan game.

Publication v1.12 validée : commits `5b340ca` et `e249bf2` poussés, déploiement de validation `dpl_Cxx5T43crYq8wc9Jv5PKek9bDi6j` `READY`, alias officiel et texture Gunnison en HTTP 200, bundle public et parcours Chromium desktop/mobile contrôlés.

## Passe v1.11 — Bouvetøya et Grid Alien

- onzième contrat `grid_alien`, huitième biome `bouvetoya_pyramid` et dixième directive `avp_pyramid_trial`, conçus comme une adaptation jouable originale de l’épreuve antarctique d’*Alien vs. Predator* (2004), sans reproduction de niveau ni d’asset officiel ;
- carte ouverte de 740 unités de rayon, structurée en dix secteurs, 18 routes bouclées, sept territoires et sept nœuds d’événements/migration entre camp Weyland, banquise, tunnels, chambres sacrificielles, galeries de résine, chambre royale et arène de Grid ;
- directive en trois vagues — garde Weyland, Facehugger puis guerrier xénomorphe — et distribution des menaces dans plusieurs branches de la pyramide afin de conserver exploration, retours et choix de route ;
- Grid Alien procédural haute définition : 25 244 triangles HD, 37 522 triangles au total et 30 meshes, avec dôme et queue segmentée destructibles, cicatrices quadrillées, mâchoire interne, balayage, bond et projections acides ;
- deux textures OpenAI originales réellement référencées par le biome : roche/glace de surface et pierre de pyramide ; l’inventaire public du projet atteint 30 WebP et 10 577 574 octets ;
- catalogues et interfaces portés à onze chasses, huit biomes, dix directives, quinze armes et 218 entrées sans effacer les vagues précédentes.

Gates v1.11 : 318/318 tests, build Vite réussi avec 49 modules, audit de production à 0 vulnérabilité, Chromium desktop et 390×844 sans erreur applicative ni débordement. Le commit fonctionnel `57f5a5c` est poussé sur `codex/professional-hunt-pass` et le déploiement `dpl_Cu8rczE4atodhPm2N5mJgr74TBxL` est `READY` en production. L’alias officiel, le bundle de 703 336 octets et les deux textures Bouvetøya répondent en HTTP 200 ; le bundle public contient `grid_alien`, `bouvetoya_pyramid`, `avp_ritual_ship`, `weyland_expedition_guard` et `pyramid_shift`.

## Passe v1.10 — Los Angeles 1997 et City Hunter

- dixième contrat `city_hunter` et septième biome `los_angeles_1997`, conçus comme une adaptation originale inspirée de *Predator 2* et non comme une reproduction scène par scène du film ;
- grande carte ouverte de 760 unités de rayon : dix secteurs, 18 routes bouclées, sept territoires, 20 résidents, sept événements répartis et six points de migration de la cible, avec toits, métro, abattoir, rues, caches et présence du clan pour éviter un parcours linéaire ;
- directive `urban_heatwave_hunt` (« Chasse sous la canicule ») en trois vagues, avec cartel urbain, chasseur armé du métro et commando OWLF cryogénique capable de perturber l’énergie, le camouflage et le positionnement du joueur ;
- City Hunter procédural haute définition avec masque angulaire, respirateur, predlocks, trophées, smart disc à trajet aller/ricochet/retour, netgun, Medicomp, combistick, attaque rapprochée et vision multispectrale ;
- classe City Stalker, roquette de poignet explosive, huitième style de predlocks, neuvième finition d’armure et neuvième warpaint ; présence Lost Tribe, caches urbaines et appareil de clan raccordés au directeur d’événements ;
- catalogue porté à 214 entrées avec statuts runtime explicites pour les armes, technologies, ennemis, boss, événements, lieux et véhicule de cette vague.

La passe s’appuie sur le classeur ChatGPT réellement lu `C:\Users\chuck\Downloads\Encyclopedie_exhaustive_franchise_Predator.xlsx` (SHA-256 `47C659F4F79CA0E71D8B8B7B8DB2CD7B7363827224BC081D59E9DD9D9576983C`) : 20 feuilles, 915 entrées uniques, issu de la [conversation ChatGPT source](https://chatgpt.com/c/6a8adeed-b6f8-83ed-9d07-5088fa50b8a9). La sélection Los Angeles 1997 rassemble de façon cohérente les éléments City Hunter, Lost Tribe, OWLF, armement, soins, trophées, lieux, habitants, événements et véhicule relevés dans ce corpus, tout en conservant une orchestration de fan game originale.

## Passe v1.9 — brèche Stargazer et arsenal étendu

- trois directives 1.9 portent le total à huit : `stargazer_breach`, `game_preserve_escape` (« Évasion de la planète-réserve ») dans la jungle et `hive_containment_failure` (« Rupture du confinement de la ruche ») sur `hive_lv426` ; les deux dernières rendent enfin accessibles en chasse cinq des nouveaux rôles ;
- `stargazer_breach` relie une mission en trois vagues au neuvième contrat `upgrade_predator` ; son arène ouverte `stargazer_blacksite` couvre un rayon de 680 unités, neuf secteurs et 16 connexions non linéaires ;
- le niveau répartit 15 habitants sur six territoires, six événements, quatre POI, deux dangers et huit groupes de props ; sa piste principale raconte la poursuite de l’Assassin Predator autour de l’évasion du Fugitive, avec appareil accidenté et cache de récupération Stargazer aux effets propres ;
- huit rôles reçoivent des logiques de combat dédiées : alpha de meute et ralliement, River Ghost en esquive/repli, Smartgunner Colonial en suppression, synthétique Weyland en réparation d’alliés, Facehugger en bond, fusilier Stargazer en couverture/rafales, trappeur Stargazer en filet/repositionnement et molosse modifié en charge coordonnée ;
- les quatre nouveaux raccourcis d’arme déclenchent des attaques réelles : lance-traits Feral `[-]`, double plasma Wolf `[=]`, Eye of Ra `[` puissant et précis à cadence lente, et Épée Yautja — Father `]` ; le leurre Apex `[Y]` matérialise un hologramme temporaire qui attire les ennemis, consomme de l’énergie et respecte sa recharge ;
- les classes Tracker, Falconer, Cleaner et Fugitive sont disponibles avec de nouveaux styles de predlocks, finitions d’armure et warpaints, sans remplacer les personnalisations déjà acquises ;
- l’Assassin Predator (2018), génétiquement amélioré, possède son propre combat, une armure biologique et des glandes adaptatives destructibles, une attaque de bond télégraphiée et une silhouette procédurale haute définition de 29 468 triangles au total ;
- le nexus du vaisseau-mère aligne désormais neuf stations en double rangée tout en conservant l’allée centrale ; les trois anneaux holographiques répétés de chaque station sont instanciés afin de contenir le nombre d’appels de rendu.

Le tableur évoqué pendant cette ancienne passe n’avait pas encore été exploité en 1.9. Il a depuis été retrouvé, authentifié par sa provenance ChatGPT et lu pour préparer la vague 1.10 décrite ci-dessus ; l’affirmation antérieure selon laquelle il était absent est donc corrigée.

## Passe v1.8 — directives de chasse

- cinq directives immuables structurent des chasses optionnelles : `standard_hunt` sans objectif et à multiplicateur ×1, `jungle_fireteam` inspirée de l’écran *Predator* (1987), `blooding_rite` inspirée du rite et des castes d’*Alien vs. Predator* (2004), `killer_eras` répartie entre trois ères de *Predator: Killer of Killers* et `deathworld_protocol`, création originale située sur Genna ;
- sept archétypes 3D deviennent des rencontres effectives : `jungle_scout`, `jungle_gunner`, `jungle_trapper`, `era_viking_raider`, `era_feudal_duelist`, `era_wartime_pilot` et `genna_sporeback` ;
- chaque objectif suit les éliminations par type, produit un résumé sérialisable, alimente le HUD et la sauvegarde, puis n’applique le multiplicateur de récompense qu’une fois tous les objectifs de la directive accomplis ;
- le directeur ne génère que les `enemyTypes` demandés par la vague, refuse les types inconnus et maintient un plafond strict de 24 PNJ actifs ;
- `event_jungle_fireteam_directive` et `event_avp_blooding_directive` ajoutent au catalogue deux événements de niveau au statut runtime `encounter`, avec orchestration originale explicitement séparée de leur provenance écran ;
- la matière raccordable `genna-sporeback-carapace.webp` porte l’inventaire public à 27 textures et fournit la carapace du nouvel archétype de Genna.

## Passe v1.7 — territoires ouverts et boss haute définition

- les cinq cartes passent d’un rayon historique de 300 à des rayons de 630–660, soit environ 1 247 000 à 1 368 000 unités carrées de surface jouable calculée ; même le Scout à 29 unités/s demande au minimum 43 secondes pour traverser un diamètre direct avant relief, détours et combat ;
- chaque biome possède neuf secteurs fonctionnels et 12–13 connexions formant plusieurs boucles : camp, ressources, points hauts, embuscades, croisements, nids, monuments et tanière Apex ne sont plus disposés comme un couloir unique ;
- environ 43 couverts extérieurs par biome sont instanciés autour des secteurs, avec rubans de navigation, balises et nœuds d’événements ; neuf colliders de route sont réservés et distribués sur les neuf secteurs sans dépasser le budget global ;
- les élévations déclarées produisent maintenant des terrasses et crêtes réellement partagées par le terrain, les routes, les props, les acteurs et les collisions ;
- l’écologie initiale place réellement 12 à 15 PNJ dans des territoires éloignés : les créatures patrouillent, détectent le joueur selon sa furtivité, respectent une laisse et reviennent à leur zone ;
- trois silhouettes ambiantes supplémentaires sont jouables par l’IA : coureur xénomorphe, drone sentinelle de clan et brouteur de Genna ;
- le directeur étend la chasse à 190 secondes avec dangers localisés, migrations de proies, conflits de territoires qui produisent de vrais affrontements et déplacement de la cible Apex ;
- les boss ne ciblent plus le joueur depuis l’autre extrémité de la carte : ils occupent une route de cinq territoires sécurisés, contournent les couverts, migrent au fil du temps et à deux seuils de santé, puis engagent à portée ;
- les limites internes fixes à ±330 du joueur et de plusieurs boss sont maintenant pilotées par le rayon réel du biome ;
- les huit boss reçoivent une greffe géométrique haute définition distincte, entre 17 100 et 26 256 triangles au total, avec détails destructibles et compatibilité des visions thermique/camouflage ;
- aucune carte ou géométrie officielle n’est copiée : le benchmark retient les principes publiés par Capcom — carte continue, densité, écosystème, interactions et aides de lecture — puis les applique à des layouts et assets originaux du fan game.

Références de conception consultées : [Capcom — création de Monster Hunter: World](https://www.capcom.co.jp/ir/english/feature/2017_mh_crvoice.html), [Capcom — projet de développement](https://www.capcom.co.jp/recruit/project/monhan-world.html) et [annonce officielle du Wildspire Waste](https://news.capcomusa.com/lets/browse/new-ecosystem-revealed-for-monster-hunter-world-the-wildspire-waste). Ces sources décrivent une direction de design, pas une superficie officielle en kilomètres carrés ; le projet n’invente donc aucune comparaison métrique non publiée.

Gates v1.7 : 218/218 tests, build Vite 8.2.2 de 45 modules, audit de production à 0 vulnérabilité et diff-check propre. Chromium 1280×720 a validé les huit contrats, le lancement Kalisk/Genna, un signal Apex à plus de 800 m, un conflit d’écosystème réel et une console sans erreur applicative. Le commit fonctionnel `94bb326` est poussé sur GitHub ; Vercel a publié `dpl_En8EmhSsfxE7SZFPYEApyYwo134h` en production `READY`, l’alias public répond en HTTP 200 et une chasse Kalisk/Genna y a été relancée sans erreur console.

## Passe v1.6 — props et level design

- les cinq biomes disposent chacun de huit groupes de props, trois points d’intérêt persistants et un à deux dangers localisés ; l’inventaire transverse comprend cinq installations, six sanctuaires et huit signatures de POI distinctes ;
- les règles spatiales réservent des apparitions sûres, éloignent caches et survols du joueur, font participer les couvertures aux projectiles et maintiennent les déplacements dans des limites circulaires ;
- les POI proposent quatre effets bornés : soin/énergie (`decode_record`), scan longue portée (`tune_beacon`), scan local/énergie (`scan_archive`) et endurance/bonus d’honneur (`scan_trophies`) ; leur identifiant est mémorisé dans la sauvegarde v4 additive afin d’empêcher de répéter effet, honneur et sauvegarde après rechargement, sans casser les sauvegardes antérieures ;
- l’instancing des décors statiques retire théoriquement 136 draw calls ; sur Genna, le budget passe de 252 à 89 appels (-64,7 %) grâce à cinq lots et 168 instances, pour 31 889 triangles et 28 plantes ;
- le vaisseau-mère est explorable en WASD/flèches, à la manette et avec des commandes tactiles, dessert quatre stations fonctionnelles et porte un budget de scène de 27 colliders, 273 draw calls et 17 239 triangles ;
- `reducedMotion` fige ou réduit les mouvements décoratifs de l’environnement, du hub, des navettes et des conteneurs sans bloquer leurs états, leurs interactions ni les signaux de danger et de combat.

Les gates v1.6 sont à 193/193 tests, 42 modules Vite, 0 vulnérabilité de production et 11 modules contrôlés syntaxiquement. Chromium desktop a validé le titre, les missions, le hub jouable, les cinq biomes en masque normal et les quatre WebP v1.6 en HTTP 200 local. Le commit fonctionnel `8df30a7` est poussé sur GitHub ; le premier déploiement de validation Vercel `dpl_HgUgNRS9k92Asi1Mq8BNVhCLn6C3` est `READY`, et la page comme les quatre WebP répondent en HTTP 200 sur l’alias public.

## Couverture franchise et backlog

Le registre runtime suit 29 œuvres et médias séparément afin de ne pas confondre film sorti, bonus vidéo, scène coupée, projet non publié, promotion, jeu, roman, comic ou crossover. Pendant la passe 1.9, le tableur évoqué par l’utilisateur n’était pas encore accessible et aucun ajout ne lui avait donc été attribué. Pour la 1.10, le classeur a été retrouvé, authentifié par sa provenance ChatGPT et confronté au runtime avec une source vérifiable, un niveau de provenance et un statut d’implémentation honnête pour chaque élément retenu.

Les principaux lots de contenu encore distincts de cette passe restent des campagnes complètes dédiées à *Killer of Killers* et aux ramifications d’*Alien vs. Predator* qui ne disposent encore que de contrats, ainsi qu’un profilage GPU sur machines modestes avant d’augmenter encore la densité géométrique. Gunnison possède désormais sa carte multi-zones ; ses extensions futures doivent enrichir les intérieurs et les variations d’événements sans doubler les occurrences déjà orchestrées.

## Documentation

- `AUDIT_PROFESSIONNEL.md` — constats, priorités et critères de sortie ;
- `GAME_DESIGN_BIBLE.md` — boucle, combat, progression et contrats de gameplay ;
- `ART_DIRECTION_BIBLE.md` — langage visuel et contraintes ;
- `LORE_BIBLE.md` — continuités et décisions canoniques ;
- `QA_REPORT.md` — matrice de validation factuelle ;
- `CHANGELOG_PRO.md` — historique du chantier.

## Mention légale

Projet de fan game non officiel. Predator, Alien, Yautja, Xenomorph et les marques associées appartiennent à leurs ayants droit respectifs. Ce dépôt ne revendique aucun lien, parrainage ou approbation officielle.
