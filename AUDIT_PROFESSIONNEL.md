# Audit professionnel — Yautja: Apex Hunt

**Date de mise à jour :** 30 août 2026
**Périmètre :** code source, données de jeu, sauvegarde, interface, assets et release publique.
**Statut :** audit initial suivi jusqu’au candidat v1.13.0 ; les corrections logicielles P0/P1 listées ci-dessous sont implémentées, les limites commerciales externes restent explicites.

## Addendum v1.13 — comparaison à un jeu fini professionnel

| Domaine | Écart constaté avant v1.13 | Correction réellement livrée | Risque restant |
| --- | --- | --- | --- |
| Préparation | tout l’arsenal était accessible pendant une chasse | slots, budget de classe, déblocages, incompatibilités, presets, recommandations et filtrage runtime | équilibrage télémétrique sur un grand panel |
| Hub | quatre stations dans un volume de hangar compact | onze compartiments, treize portes, dix stations et circulation en boucles | optimisation GPU sur matériel bas de gamme |
| Mobile | le hub était tactile mais la chasse ne l’était pas | déplacement, attaque/QTE, interaction, vision, camouflage et pause tactiles | essais physiques iOS/Android |
| Manette | combat partiel, menus non navigables | armes équipées, gadgets, vision, camouflage, pause et focus des dialogues | certification par modèle de contrôleur |
| Résilience | perte WebGL, blur et échec de sauvegarde peu lisibles | overlay fatal récupérable, pause automatique et alerte de persistance | télémétrie distante et rapport de crash |
| Accessibilité | focus fragile dans les modales | boucle de focus, focus initial et libellés renforcés | audit lecteur d’écran/contrastes spécialisé |

### Bloqueur commercial non logiciel

Le dépôt emploie l’univers, les noms et les références de la franchise Predator/Alien. Il peut être présenté comme projet fan-made gratuit, mais ne doit pas être déclaré vendable ou « commercialement publiable » sans autorisation des ayants droit. Le code peut atteindre un niveau de finition professionnel ; le droit de commercialisation ne peut pas être corrigé dans le dépôt.

### Gates restant nécessaires avant une revendication « gold »

- campagne complète de tests sur appareils physiques, longues sessions et reprise après veille ;
- profils graphiques et budget frame-time mesurés sur GPU intégré, milieu et haut de gamme ;
- audit WCAG outillé avec technologies d’assistance ;
- télémétrie de crash, politique de confidentialité, support, localisation et processus de patch ;
- autorisation de licence écrite pour toute exploitation commerciale de la franchise.

## Résumé exécutif

Le projet possède désormais une boucle de chasse 3D, huit contrats, cinq biomes différenciés, un vaisseau-mère explorable, une économie d'honneur, dix armes, des PNJ, des événements de niveau et des POI persistants. La version de départ restait cependant un prototype fragile : le lancement d'une chasse pouvait casser immédiatement, plusieurs attaques n'entraient jamais dans la résolution des dégâts, la sauvegarde ne couvrait pas toute la progression et les options de confort manquaient.

Le chantier a traité la jouabilité, la persistance, les fenêtres de réaction, l’accessibilité, la cohérence du lore, l’identité visuelle, les props et le level design. La v1.7 ajoute cinq cartes ouvertes de 630–660 unités de rayon, une écologie résidente, des événements localisés, une cible Apex territoriale et huit silhouettes de boss HD. Les preuves techniques sont consignées dans `QA_REPORT.md` : 218 tests, build Vite de 45 modules, audit npm sans vulnérabilité et parcours Chromium desktop sans erreur applicative. Les contrôles physiques longue durée restent explicitement recommandés.

## Méthode et niveaux de preuve

| Mention | Signification |
| --- | --- |
| Vérifié — baseline | Défaut ou comportement constaté par inspection de la version source initiale ou de la version publique. |
| Présent dans le worktree | Code ou donnée de correction visible localement ; consulter `QA_REPORT.md` pour savoir si le flux a aussi été exécuté. |
| À valider | Test automatique, build final ou contrôle navigateur encore requis. |
| Cible de production | Amélioration recommandée qui ne doit pas être présentée comme livrée. |

## Constats prioritaires

### P0 — blocages de la boucle principale

1. **Démarrage de chasse cassable — vérifié baseline.** `src/main.js` importait l'ancienne implémentation `src/Environment.js`, alors que le contrôleur appelait des méthodes portées par `src/world/Environment.js`. Une chasse pouvait donc échouer dès son initialisation.
2. **Autodestruction sans terminal unique — vérifié baseline.** Une fois le compteur négatif, l'explosion audio pouvait être rejouée chaque frame et aucun état de défaite définitif ne verrouillait proprement la partie.
3. **Combat incomplet — vérifié baseline.** Les lames de poignet sélectionnées par défaut n'appliquaient pas de dégâts. Les projectiles du rival Bad Blood et plusieurs attaques de boss, dont les frappes de la Reine et du Predalien, n'étaient pas reliés à la résolution de dégâts du joueur.

### P1 — progression et qualité de jeu

1. **Amélioration de zoom inactive — vérifié baseline.** `hasScopeZoom` pouvait être acheté et sauvegardé sans effet perceptible dans la visée.
2. **Persistance partielle — vérifié baseline.** Peau active, trophées, chasses terminées et préférences n'étaient pas tous restaurés.
3. **Réinitialisation de chasse fragile — vérifié baseline.** Les états transitoires, projectiles, mines, corrosion ou autodestruction exigeaient un nettoyage explicite entre deux parties.
4. **Absence de pause et d'options — vérifié baseline.** Aucun parcours complet ne permettait de suspendre, reprendre, abandonner ou régler audio, mouvements, contraste et échelle du HUD.
5. **Retours de combat insuffisants — cible de production.** Les fenêtres d'attaque, portées, signaux avant impact et causes de défaite doivent rester lisibles sans rendre les boss passifs.

### P2 — présentation, accessibilité et exploitation

1. **Identité visuelle limitée — vérifié baseline.** La version publique ne chargeait aucune texture ou illustration bitmap de décor ; les environnements reposaient surtout sur des primitives et matériaux unis.
2. **Responsive et accessibilité incomplets — vérifié baseline.** Aucun breakpoint CSS clair n'était présent et les options de mouvement réduit, fort contraste et taille de HUD manquaient.
3. **Surface web incomplète — vérifié baseline.** Manifest, favicon, robots et sitemap renvoyaient 404 ; la page ne disposait pas d'un jeu complet de métadonnées sociales.
4. **Documentation de production absente — vérifié baseline.** Il manquait un contrat explicite de game design, d'art, de lore, d'assets et de QA.
5. **Poids JavaScript — amélioré, à surveiller.** Le build initial signalait un chunk d’environ 535 Ko ; la v1.7 isole Three.js à 505,00 Ko et le jeu à 491,40 Ko. L’avertissement de seuil reste non bloquant mais impose un profilage avant toute nouvelle hausse géométrique.

## Audit de clôture v1.7 — grande chasse ouverte

| Axe | État réellement constaté | Limite ou contrôle restant |
| --- | --- | --- |
| Échelle et non-linéarité | 5/5 cartes à 630–660 unités de rayon, neuf secteurs, 12–13 routes et plusieurs boucles ; traversée Scout directe ≥43 s. | Profilage de longues traversées sur GPU modeste. |
| Monde vivant | 12–15 PNJ résidents, migrations, conflits strictement inter-factions et six positions événementielles par biome. | Étendre encore les animations sociales et réactions croisées. |
| Verticalité et navigation | Relief sectoriel partagé, waypoints Apex sécurisés, steering autour des colliders et neuf couverts physiques distribués par carte. | Ajouter une navmesh complète si la géométrie future devient plus fermée. |
| Boss HD | 8/8 signatures distinctes, 17 100–26 256 triangles, états destructibles et visions conservées. | Un profilage GPU doit précéder toute nouvelle hausse de densité. |
| Cohérence runtime | PNJ recalés au terrain, mesh/position resynchronisés, limites dynamiques, transitoires de boss maintenus au delta. | Sessions manuelles longues avec chaque boss et chaque météo. |
| Gates automatisés | 218/218 tests, 45 modules Vite, 0 vulnérabilité et diff-check propre. | Aucun gate logiciel local ouvert. |
| Chromium | Huit contrats, Genna/Kalisk, vision normale, cible >800 m, événement écologique et console propre à 1280×720. | Contrôle tactile et manette sur appareils physiques. |
| Publication | Commit `94bb326` poussé, Vercel `dpl_En8EmhSsfxE7SZFPYEApyYwo134h` `READY`, alias HTTP 200 et chasse Kalisk vérifiée en production. | Aucun gate web de publication ouvert. |

Ces métriques sont des contrats de construction et non des mesures de performance matérielle. La comparaison à *Monster Hunter: World* porte sur l’organisation continue, les boucles, la densité et l’écosystème décrits par Capcom, pas sur une superficie officielle non publiée.

## Audit de clôture v1.6 — props et level design

| Axe | État réellement constaté | Limite ou contrôle restant |
| --- | --- | --- |
| Plans de biome | 5/5 plans possèdent 8 groupes de props, 3 POI et 1–2 dangers ; leurs routes et silhouettes ont été inspectées dans Chromium en masque normal. | Rejouer de longues sessions sous chaque météo sur GPU modeste. |
| Variété | 5 installations, 6 sanctuaires et 8 signatures de POI distinctes. | Contrôler que les volumes ne paraissent pas répétitifs à distance de jeu. |
| Sécurité de jeu | Apparitions sûres, caches et flybys éloignés, couverture projectile et limites circulaires sont intégrés. | Jouer les cas limites près des colliders et du bord de carte. |
| POI et persistance | Quatre profils jouables sont branchés : soin/énergie, scan longue portée, scan local/énergie et endurance/bonus d’honneur. La sauvegarde v4 additive interdit de répéter effet, honneur et sauvegarde d’un POI connu. | Tester manuellement fermeture, reprise et anciennes sauvegardes réelles. |
| Hub | Navigation WASD/flèches, manette et tactile, 4 stations, 27 colliders, budget de 273 draw calls et 17 239 triangles ; parcours desktop et touche `P` validés dans Chromium. | Confirmer manette et tactile sur appareils physiques. |
| Instancing | 136 draw calls statiques théoriquement évités. | Le gain est un calcul de construction, pas encore une mesure GPU navigateur. |
| Genna | 252 → 89 appels (-64,7 %), 5 lots, 168 instances, 31 889 triangles et 28 plantes. | Mesurer frametime et mémoire sur GPU modeste. |
| Accessibilité | `reducedMotion` fige ou atténue l’environnement, la météo, le hub, les navettes et les conteneurs tout en préservant transitions, états et interactions ; bascule à chaud couverte. | Vérifier les télégraphes sur un appareil configuré en réduction des animations. |
| Assets | 4 WebP OpenAI originaux 1254×1254 référencés par les plans, décodés et chargés en HTTP 200 local et public avec le type `image/webp`. | Juger répétition et contraste sur plusieurs écrans physiques. |
| Gates automatisés | 193/193 tests, 42 modules Vite, 0 vulnérabilité de production, 11 node-checks, diff-check propre, push GitHub et production Vercel `READY`. | Aucun gate logiciel de publication ouvert. |

Les valeurs de draw calls et triangles sont des métriques de scène/budget produites par le code de construction. Elles ne doivent pas être présentées comme des mesures de performance matérielle tant qu’un profilage navigateur n’a pas été exécuté.

## État de la release

| Domaine | État constaté | Validation restante |
| --- | --- | --- |
| Environnement | Import principal redirigé vers `src/world/Environment.js`; cinq biomes et un hub explorable utilisent le catalogue de props, avec nettoyage GPU centralisé et quatre nouvelles textures contrôlées en HTTP 200 public. | Inspection longue durée de la mémoire sur GPU modeste. |
| Autodestruction | Garde terminale, état `isDead`, explosion unique et timers gelés par la pause. | Jouer manuellement tout le compte à rebours, la défaite et le redémarrage. |
| Mêlée | Règles dédiées pour lames et fouet couvertes par les tests de portée et de dégâts. | Confirmer le ressenti, la cadence et les collisions dans une chasse complète. |
| Attaques ennemies | Projectiles Bad Blood et attaques de boss intégrés au contrôleur et au cycle de nettoyage. | Provoquer manuellement chaque impact, la queue de Reine, le Predalien et le QTE facehugger. |
| Sauvegarde | Format v4 additif, migrations antérieures, corruption, stockage indisponible et POI découverts couverts par les tests. | Parcours manuel complet apparence, trophée, victoire, POI puis rechargement sur une sauvegarde réelle. |
| Zoom | Achat, sauvegarde et variation de FOV intégrés. | Comparer manuellement le ressenti avant/après achat et après rechargement. |
| Options | Audio, mouvement réduit, contraste et échelle HUD appliqués dans Chromium et sérialisés. | Contrôle supplémentaire après fermeture complète du navigateur. |
| Lore | Niveaux `SCREEN`, `AVP_SCREEN`, `LICENSED_EU`, `ORIGINAL` affichés dans le Codex. | Maintenir ces badges pour toute future entrée. |
| Art | Vingt-six WebP OpenAI, 8 493 482 octets, intégrés aux biomes, trophées, armures, créatures, véhicules et conteneurs. | Inspection de la répétition à longue distance sur plusieurs écrans physiques. |

## Risques restant à fermer

- Les anciennes classes dupliquées `src/Environment.js` et `src/YautjaPlayer.js` ont été supprimées après vérification complète des imports.
- Les interactions de combat sont centralisées dans un contrôleur volumineux ; des tests de règles isolées réduisent le risque, mais ne remplacent pas les essais 3D.
- La génération procédurale et les effets météo doivent être testés avec l'option de mouvement réduit et sur une machine modeste.
- Les textures générées sont compressées et disposent d'un fallback ; les raccords 2×2 restent à juger visuellement sur plusieurs écrans physiques.
- La branche AVP, l'univers étendu et les créations originales doivent conserver leur badge de provenance dans toute nouvelle entrée.

## Critères de sortie

La release ne peut être qualifiée qu'après réussite des étapes suivantes :

1. contrôle syntaxique de tous les modules JavaScript ;
2. tests unitaires de combat et de sauvegarde ;
3. build de production sans erreur et audit des dépendances ;
4. vérification de tous les chemins d'assets et de leur poids ;
5. parcours navigateur : hub, cinq lieux, huit cibles, PNJ, événements, victoire, défaite, pause, options, sauvegarde et reprise ;
6. contrôle console, responsive clavier/souris et préférences d'accessibilité ;
7. revue du diff et commit sélectif des seuls fichiers validés.

## Publication

La release 1.7.0 a été poussée sur GitHub au commit fonctionnel `94bb326`, puis publiée via `dpl_En8EmhSsfxE7SZFPYEApyYwo134h`. Vercel la déclare `READY`, l’alias <https://yautja-apex-hunt.vercel.app/> répond en HTTP 200 et le parcours production contrats → Genna → Kalisk a été exécuté sans erreur console.

La release 1.6.0 a été poussée sur GitHub au commit `8df30a7` puis publiée via le déploiement `dpl_HgUgNRS9k92Asi1Mq8BNVhCLn6C3`. La production <https://yautja-apex-hunt.vercel.app/> est en état `READY`, répond en HTTP 200 et sert les quatre nouvelles matières v1.6 en `image/webp` avec leurs poids attendus.
