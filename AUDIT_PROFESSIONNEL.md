# Audit professionnel — Yautja: Apex Hunt

**Date de l'audit :** 22 août 2026
**Périmètre :** code source, données de jeu, sauvegarde, interface, assets et release publique.
**Statut :** audit initial suivi de deux vagues de professionnalisation ; version 1.3.0 validée puis publiée le 22 août 2026, sans défaut P0/P1 connu.

## Résumé exécutif

Le projet possède désormais une boucle de chasse 3D, cinq cibles, quatre biomes, un hub, une économie d'honneur, dix armes, des PNJ et des événements de niveau. La version de départ restait cependant un prototype fragile : le lancement d'une chasse pouvait casser immédiatement, plusieurs attaques n'entraient jamais dans la résolution des dégâts, la sauvegarde ne couvrait pas toute la progression et les options de confort manquaient.

Le chantier a traité la jouabilité et la persistance, puis les fenêtres de réaction, l’accessibilité, la cohérence du lore, l’identité visuelle et l’étendue réelle du contenu. Les preuves techniques sont consignées dans `QA_REPORT.md` : 71 tests, build, audit npm, parcours Chromium desktop/mobile et production Vercel contrôlée en HTTP 200 avec ses quinze textures ; les contrôles physiques longue durée restent explicitement recommandés.

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
5. **Poids JavaScript — corrigé dans le worktree.** Le build initial signalait un chunk d'environ 535 Ko ; le build final isole Three.js dans un chunk de 496,94 Ko et ne produit plus l'avertissement supérieur à 500 Ko.

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
| Assets | 4 WebP OpenAI originaux 1254×1254 référencés par les plans, décodés et chargés en HTTP 200 dans Chromium local. | Réponse HTTP de production encore à confirmer. |
| Gates automatisés | 193/193 tests, 42 modules Vite, 0 vulnérabilité de production, 11 node-checks et diff-check propre. | Push et déploiement Vercel restent ouverts. |

Les valeurs de draw calls et triangles sont des métriques de scène/budget produites par le code de construction. Elles ne doivent pas être présentées comme des mesures de performance matérielle tant qu’un profilage navigateur n’a pas été exécuté.

## État de la release

| Domaine | État constaté | Validation restante |
| --- | --- | --- |
| Environnement | Import principal redirigé vers `src/world/Environment.js`; le parcours hub plus biomes charge les quinze textures en HTTP 200 dans Chromium, avec nettoyage GPU centralisé. | Inspection longue durée de la mémoire sur GPU modeste. |
| Autodestruction | Garde terminale, état `isDead`, explosion unique et timers gelés par la pause. | Jouer manuellement tout le compte à rebours, la défaite et le redémarrage. |
| Mêlée | Règles dédiées pour lames et fouet couvertes par les tests de portée et de dégâts. | Confirmer le ressenti, la cadence et les collisions dans une chasse complète. |
| Attaques ennemies | Projectiles Bad Blood et attaques de boss intégrés au contrôleur et au cycle de nettoyage. | Provoquer manuellement chaque impact, la queue de Reine, le Predalien et le QTE facehugger. |
| Sauvegarde | Format v3, migrations v1/v2, corruption et stockage indisponible couverts par les tests. | Parcours manuel complet apparence, trophée, victoire puis rechargement. |
| Zoom | Achat, sauvegarde et variation de FOV intégrés. | Comparer manuellement le ressenti avant/après achat et après rechargement. |
| Options | Audio, mouvement réduit, contraste et échelle HUD appliqués dans Chromium et sérialisés. | Contrôle supplémentaire après fermeture complète du navigateur. |
| Lore | Niveaux `SCREEN`, `AVP_SCREEN`, `LICENSED_EU`, `ORIGINAL` affichés dans le Codex. | Maintenir ces badges pour toute future entrée. |
| Art | Quinze WebP OpenAI, 4 661 738 octets, intégrés aux biomes, trophées, armures, créatures, véhicules et conteneurs. | Inspection de la répétition à longue distance sur plusieurs écrans physiques. |

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
5. parcours navigateur : hub, quatre lieux, cinq cibles, PNJ, événements, victoire, défaite, pause, options, sauvegarde et reprise ;
6. contrôle console, responsive clavier/souris et préférences d'accessibilité ;
7. revue du diff et commit sélectif des seuls fichiers validés.

## Publication

La release fonctionnelle 1.3.0 a été poussée sur GitHub et publiée sur Vercel ; la production <https://yautja-apex-hunt.vercel.app/> est en état `Ready`, répond en HTTP 200 et sert le bundle, les headers de sécurité et les quinze textures attendus.
