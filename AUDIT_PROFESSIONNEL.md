# Audit professionnel — Yautja: Apex Hunt

**Date de l'audit :** 22 août 2026
**Périmètre :** code source local, données de jeu, sauvegarde, interface, assets et version publique alors disponible.
**Statut :** audit initial suivi d'un chantier corrigé ; candidat 1.2.0 validé localement le 22 août 2026, sans défaut P0/P1 connu, publication autorisée et gate production encore requis.

## Résumé exécutif

Le projet possède déjà une boucle de chasse 3D, quatre cibles, quatre biomes, un hub, une économie d'honneur et un arsenal. La version de départ restait cependant un prototype fragile : le lancement d'une chasse pouvait casser immédiatement, plusieurs attaques n'entraient jamais dans la résolution des dégâts, la sauvegarde ne couvrait pas toute la progression et les options de confort manquaient.

Le chantier a traité en priorité la jouabilité et la persistance, puis les fenêtres de réaction, l'accessibilité, la cohérence du lore et l'identité visuelle. Les preuves techniques sont consignées dans `QA_REPORT.md` : 33 tests, build, audit npm, axe et parcours Chromium desktop/mobile ; les contrôles physiques longue durée restent explicitement recommandés.

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
5. **Poids JavaScript — corrigé dans le worktree.** Le build initial signalait un chunk d'environ 535 Ko ; le build final isole Three.js dans un chunk de 477,51 Ko et ne produit plus l'avertissement supérieur à 500 Ko.

## État du chantier local

| Domaine | État constaté | Validation restante |
| --- | --- | --- |
| Environnement | Import principal redirigé vers `src/world/Environment.js`; le parcours hub plus biomes charge les neuf textures en HTTP 200 dans Chromium, avec nettoyage GPU centralisé. | Inspection longue durée de la mémoire sur GPU modeste. |
| Autodestruction | Garde terminale, état `isDead`, explosion unique et timers gelés par la pause. | Jouer manuellement tout le compte à rebours, la défaite et le redémarrage. |
| Mêlée | Règles dédiées pour lames et fouet couvertes par les tests de portée et de dégâts. | Confirmer le ressenti, la cadence et les collisions dans une chasse complète. |
| Attaques ennemies | Projectiles Bad Blood et attaques de boss intégrés au contrôleur et au cycle de nettoyage. | Provoquer manuellement chaque impact, la queue de Reine, le Predalien et le QTE facehugger. |
| Sauvegarde | Format v2, migration v1, corruption et stockage indisponible couverts par les tests. | Parcours manuel complet peau, trophée, victoire puis rechargement. |
| Zoom | Achat, sauvegarde et variation de FOV intégrés. | Comparer manuellement le ressenti avant/après achat et après rechargement. |
| Options | Audio, mouvement réduit, contraste et échelle HUD appliqués dans Chromium et sérialisés. | Contrôle supplémentaire après fermeture complète du navigateur. |
| Lore | Niveaux `SCREEN`, `AVP_SCREEN`, `LICENSED_EU`, `ORIGINAL` affichés dans le Codex. | Maintenir ces badges pour toute future entrée. |
| Art | Neuf WebP OpenAI 1024×1024, 2 451 694 octets, intégrés aux biomes, trophées, armure et œufs. | Inspection des six matières initiales et répétition à longue distance sur plusieurs écrans physiques. |

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
5. parcours navigateur : hub, quatre lieux, quatre cibles, victoire, défaite, pause, options, sauvegarde et reprise ;
6. contrôle console, responsive clavier/souris et préférences d'accessibilité ;
7. revue du diff et commit sélectif des seuls fichiers validés.

## Publication

L’utilisateur a explicitement autorisé le push GitHub et le déploiement Vercel le 22 août 2026. La publication reste conditionnée au succès de la preview, des headers, du smoke production et à la concordance du SHA déployé.
