# Revue de correction et préparation de publication — 20 octobre 2026

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
