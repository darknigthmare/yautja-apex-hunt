# Revue de correction et préparation de publication — 20 octobre 2026

La passe graphique suivante, fondée sur `eb7b7f8`, est documentée dans [`GRAPHICS_REVIEW.md`](GRAPHICS_REVIEW.md) : héros, boss/PNJ, neuf biomes, croiseur, matières PBR et chaîne de rendu configurable. La suite atteint **971 tests réussis**, zéro échec et zéro test ignoré ; le build reste sans avertissement de taille. L'audit des dépendances de production signale zéro vulnérabilité. Les régressions ajoutées couvrent aussi les ressources GPU lors des changements de qualité et la restauration du renderer en cas d'erreur d'effet.

Le smoke du build final a réussi le 20 octobre à 10:59 UTC : parcours mobile et ordinateur, rotations tactiles, réglage graphique par l'interface, pause/soins/abandon, douze contrats et neuf biomes rendus, démarrage sans stockage local. Zéro erreur JavaScript/console et zéro ressource réseau en échec sur les contextes de jeu ; le contexte sans stockage accepte les avertissements de persistance attendus. Il s'agit de rendus de contrats et de parcours ciblés, pas de douze parties intégrales.

Cette passe porte sur le jeu existant, avec cinq agents QA travaillant en parallèle. Aucun testeur humain n'a été recruté ou simulé comme une personne réelle. Les contrôles automatisés et les observations dans Chromium sont distingués ci-dessous. La base inclut les ajouts de `master` jusqu'à `2bff6d1`.

## Corrections

| Domaine | Problèmes corrigés et améliorations | Preuves |
| --- | --- | --- |
| Gameplay et persistance | Sauvegarde `settings:null`, soins sans effet, soins pendant mort/autodestruction, hémorragie après redéploiement, énergie de camouflage négative, désactivation en corrosion, fausse immersion sur sol sec, charges médicales infinies héritées du hub | Régressions exécutées dans `tests/qa-gameplay-recovery.test.js`, tests existants de sauvegarde et médecine |
| Interface et accessibilité | Briefing mobile rogné, aide du hub écrasée, onglets trop hauts, chevauchement des gadgets et actions tactiles, accès tactile aux soins, capture souris bloquant les boutons tactiles, fenêtre médicale déplaçable hors écran, focus/Tab/Échap ; raisons des soins indisponibles visibles | Captures desktop/mobile et neuf contrôles navigateur ciblés ; `tests/medbay-overlay-regressions.test.js` |
| Graphismes | Vision thermique cohérente avec la caméra et sortie sRGB, ombres locales stabilisées, ciel dégradé raccordé à la brume, anisotropie, particules rondes et météo suivant le joueur | Trois régressions dans `tests/render-lighting-regressions.test.js` ; compilation WebGL thermique et comparaison de pixels entre deux orientations caméra |
| Level design et navigation | Blocages entre coque et obstacles du hub, routes traversant le relief, couverts industriels spécifiques à Los Angeles/Stargazer, volumes et perchoirs alignés sur leur géométrie | Balayage de 23 009 positions du hub : 598 pénétrations résiduelles avant correction, zéro après ; `tests/level-navigation-regressions.test.js` |
| Livraison et dépendances | `source-map-js` 1.2.2, découpage joueur/PNJ, cache des textures à noms stables et bundles hachés séparé, polices intégrées au build avec licences SIL OFL, smoke navigateur reproductible | Audit npm à zéro vulnérabilité ; build sans avertissement ; `tests/delivery-policy.test.js` |

L'intégration corrige aussi les tirs involontaires lors des clics sur le HUD, la vitesse de caméra manette dépendante de la fréquence d'affichage et les commandes/simulation du monde pendant l'ouverture de la baie médicale (`tests/qa-input-isolation.test.js`).

## Reproduire les vérifications

Depuis la racine du dépôt, avec Node.js compatible avec `package.json` :

```bash
npm ci
npm run check
npm audit
CHROMIUM_PATH=/usr/bin/chromium npm run test:browser
```

`test:browser` démarre son propre serveur de preview sur le port 4180 et l'arrête à la fin. Un navigateur Chromium doit être installé ; `CHROMIUM_PATH` permet d'en choisir un autre, sinon Playwright utilise son navigateur installé. `QA_BASE_URL` permet de vérifier un serveur existant. `QA_ARTIFACT_DIR` change le dossier des captures et du rapport JSON (par défaut `/tmp/yautja-qa/final`).

Le smoke vérifie le briefing, l'exploration du hub, la préparation, le déploiement d'une chasse, la pause/reprise, le Medicomp, l'absence de tir sur clic HUD, l'abandon et le retour au hub sur ordinateur 1280×800 et mobile 390×844. Sur ordinateur, il instancie et rend aussi les douze contrats et les neuf biomes via le moteur ; cela ne constitue pas douze parties complètes ni une validation exhaustive de leur équilibrage.

## Résultats et limites

- `npm run check` : 930 tests réussis, zéro échec, zéro ignoré ; build réussi sans avertissement de taille de chunk.
- `npm audit` : zéro vulnérabilité signalée au moment de cette vérification.
- Chromium utilise le rendu logiciel disponible dans cette machine. Aucun chiffre de performance sur GPU matériel ni test physique de manette/mobile n'est revendiqué.
- La matrice navigateur finale a réussi sur la base actualisée : parcours desktop et tactile, douze contrats et neuf biomes rendus, zéro erreur JavaScript et zéro échec de ressource réseau. Les polices locales ont été chargées et contrôlées, les commandes tactiles testées sans clavier pour console/pause/soins/vision et le gel de simulation observé pendant plusieurs frames de soin.
- Les tests de cache vérifient la configuration ; les headers réellement appliqués par Vercel demandent un contrôle après déploiement.

## Publication

La CLI Vercel a été essayée : elle est déconnectée, `VERCEL_TOKEN` n'est pas fourni et l'API Vercel est refusée par la politique réseau courante. Les exigences ont été enregistrées dans le brouillon de l'environnement : secret `VERCEL_TOKEN` destiné à `api.vercel.com`, accès à `api.vercel.com`, `vercel.com`, `*.vercel.app` et `api.github.com`. Aucun secret ne doit être envoyé dans le chat ou ajouté au dépôt.

La publication Vercel doit être confirmée par un déploiement réussi et une vérification de l'URL de production. Un build local ou un envoi Git ne prouve pas cette publication.

## Seconde passe — base `5d3303a`

Cinq agents ont repris les cinq domaines sur la version publiée, avec de nouveaux scénarios et sans revendiquer de tests humains.

| Domaine | Nouveaux défauts corrigés et améliorations | Validation ciblée |
| --- | --- | --- |
| Combat et paquetage | Démarrage bloqué par un refus de `localStorage`, paquetage scout par défaut au-dessus du budget, disque gratuit générant de l'énergie au retour, disque revenant expirant avant rattrapage | Cinq régressions, dont les dix classes et un vol complet du disque ; 31 contrôles ciblés réussis |
| Interface | Gadgets exclus affichés malgré `hidden`, HUD hors écran en paysage et à 568×320, libellés d'armes tactiles absents, états accessibles incomplets | États HUD, chasse réelle, rotation et captures ; tests ciblés réussis |
| Rendu | Textures de terrain assombries deux fois, échelle de répétition incohérente avec le monde, normale du contour plasma non normalisée | Captures normales comparables et régressions de matériau ; aucun triangle ni appel de rendu ajouté |
| Level design | 39 couverts sur 138 empiétant sur les voies ; réserve du départ et des signaux interactifs ; caméra traversant les volumes du hub | Voies dégagées sur les neuf cartes, vrais volumes du hub, contrats runtime de spawn/POI ; budgets conservés |
| Fiabilité et livraison | Rejets WebAudio déclenchant l'erreur fatale générale, polices hachées sans cache immutable | Quatre régressions audio et deux tests de livraison/cache réussis |

L'intégration ajoute une caméra maintenue au-dessus du terrain et avant les obstacles, les glissements tactiles dans le hub, une taille de canvas indépendante des dimensions en pixels après rotation, le gel des effets de shader en mouvement réduit et un rendu des écrans statiques borné à deux images/seconde. Les onglets masqués ne soumettent plus de rendu ni ne reprennent la simulation par la manette. Ces comportements sont couverts par huit régressions caméra/rendu.

La suite complète de cette seconde passe contient **951 tests réussis, zéro échec et zéro ignoré**. Le build réussit et l'audit npm indique zéro vulnérabilité. Les vérifications navigateur supplémentaires couvrent les glissements tactiles natifs, les rotations 844×390 → 568×320 → 390×844, le HUD 125% à 1280×720 et une session sans stockage local. Leur résultat final est enregistré dans les artefacts du smoke.

La matrice finale de cette seconde passe est **réussie** : les trois formats tactiles, le HUD 125%, les douze contrats/neuf biomes et la session sans stockage fonctionnent sans erreur JavaScript ni échec réseau. Les résultats courants sont dans `/tmp/yautja-qa/final/results.json`, avec leurs horodatages de début et de fin ; les captures de rotation sont `touch-844x390.png`, `touch-568x320.png` et `touch-390x844.png`.
