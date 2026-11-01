# Liaison Alien_base — Yautja: Apex Hunt
Le dépôt privé `darknigthmare/alien_base` est la source de **noms, identités, variantes et provenance** ; le jeu reste seul responsable du gameplay, des armes jouables, statistiques, IA, animations, modèles et sauvegardes.

## Livraison
- `src/data/alien-base-snapshot.v1.json` : snapshot public minimal (noms/IDs/types) ; pas de fetch privé dans le navigateur.
- `src/data/AlienBaseFederation.js` : résolution des IDs historiques par collection, dossiers du Codex et relations `inspired-by`.
- 20 nouvelles notices **archive seule** consultables dans le Codex (Weyland-Yutani, USCM, synthétiques, Ripley/Bishop, M41A, M56, M240, M314, M577, UD-4L, P-5000, sites et biologie Alien).
- 33 relations d'identité/technologies et 9 liens d'inspiration (les boss originaux ne deviennent jamais des incarnations écran identiques).
- `scripts/export-alien-base-candidates.mjs` : 731 fiches locales à examiner, y compris crossovers, palettes, proies, adaptations, classes de chasse, armes équipables, gadgets, variantes, 21 sources et 5 familles de factions. **RESEARCH_ONLY**, sans dégâts, DPS, dimensions simulées ni statistiques de jeu.

## Vérification et mise à jour
```sh
npm test
node scripts/sync-alien-base-snapshot.mjs
node scripts/sync-alien-base-snapshot.mjs --base ../alien_base --check
node scripts/export-alien-base-candidates.mjs --out ../alien_base/data/intake/yautja-apex-hunt.v1.json --check
# Après revue des différences, pour rafraîchir le snapshot:
node scripts/sync-alien-base-snapshot.mjs --base ../alien_base --write
```

Dépendances PR : `alien_base` PR #3 puis PR #10 (branche dédiée), et cette PR de jeu. Les autres PR #1/#2 doivent être réconciliées avant fusion finale dans `main`. Lorsque le jeu change, contrôler le commit SHA et les blob SHA d'origine et faire une **PR vers la base** plutôt que réutiliser une version périmée.

## Fidélité
`SCREEN` et `LICENSED_EU` identifient le média revendiqué dans le jeu, pas une certification graphique 1:1. Les fiches `ORIGINAL`, crossovers, adaptations de boss et espèces fictives restent explicitement séparées de l'identité canonique. Aucun élément de recherche ne devient spawnable ou équipable sans implémentation et QA séparées.


## Registre unifié v2 — source de vérité renouvelée

L'ancien espace `yautja:*` reste disponible uniquement pour la **compatibilité du Codex et des sauvegardes** ; ne pas fusionner `alien_base` #10 sur #3. Le nouveau registre suit [Alien_base #17](https://github.com/darknigthmare/alien_base/pull/17), empilé sur #8 → #4.

- `src/data/alien-base-registry.v2.json` : snapshot public minimal, jamais un accès direct au dépôt privé.
- `src/data/AlienBaseRegistryV2.js` : 35 bindings explicites, 49 alias entre identifiants v1 et v2, 9 bases de boss **inspired-by** et 4 archives conservées à réviser (Bishop, P-5000, synthétiques, pathogène).
- Le Codex garde **20 archives** existantes ; 16 portent un ID du registre commun et les 4 autres affichent « CORRESPONDANCE EN REVUE ».
- Le vieux snapshot demeure temporairement, pour éviter tout changement de clé de sauvegarde ou de comportement existant, puis pourra être déprécié après fusion et QA.
- `node scripts/sync-alien-base-registry-v2.mjs --base ../alien_base` permet de comparer la version locale au nouveau registre. `--write` rafraîchit le JSON uniquement après revue humaine.

Les sources écran restent des déclarations de provenance, jamais une certification visuelle 1:1 ni un déclencheur de spawn, d'équipement ou d'IA.


## Enrichissement du Codex par les recherches du registre

Ajout de **20 nouvelles archives documentaires** en statut `RESEARCH`, à côté des 20 archives historiques. Le lot comprend 14 formes xénomorphes distinctes (selon les catalogues projet, non confirmées comme castes universelles), 4 organismes synthétiques/automates et 2 équipements coloniaux. Chaque fiche reçoit un identifiant stable du registre, une mise en garde de provenance et un statut `archiveOnly`. Aucun boss, objet, spawn, loot ou paramètre de difficulté n'est créé par cet import.

## Synchronisation retour : comparaison de delta sans fausse provenance

Le lot historique de 731 fiches est épinglé au commit original ; si les catalogues du jeu changent, il ne faut **pas** réutiliser silencieusement cet ancien commit/SHA. La commande ci-dessous compare la version actuelle aux candidats de la base, recalcule le vrai Git blob SHA des fichiers concernés et produit des ajouts/modifications/suppressions **à faire examiner**.

```sh
node scripts/diff-alien-base-candidates.mjs --base ../alien_base --out /tmp/apex-delta.json
node scripts/diff-alien-base-candidates.mjs --base ../alien_base --out /tmp/apex-delta.json --check
```

Le résultat n'est jamais appliqué automatiquement dans `alien_base`. Les suppressions ne sont pas exécutées, les changements non commités ne reçoivent pas de fausse provenance, les statistiques de gameplay restent exclues.

## Catalogue de franchise désormais visible dans le jeu
La section « Archives de franchise & contenu actif » de l'armurerie n'était pas raccordée au rendu dans le moteur. `src/ui/SharedReferenceVault.js` rend maintenant les 7 catalogues existants, avec recherche par texte, statut déclaré, compteur réel et liens de provenance. Le HTML est raccordé à l'initialisation du jeu sans changer les statistiques des armes ou les sauvegardes.

Le nouvel export des **29 œuvres** est fourni par [Alien_base PR #22](https://github.com/darknigthmare/alien_base/pull/22), dérivée de la consolidation #21. `src/data/AlienBaseMediaV2.js` lit le snapshot autonome `alien-base-media.v2.json` et affiche `work.*` comme référence documentaire **à vérifier**, sans prétendre que toute adaptation du jeu est une reproduction 1:1. La source publique originale `sourceUrl` est conservée dans le catalogue déjà présent du jeu, pas dans le snapshot privé.

Le comparateur vérifie désormais **les empreintes Git blob réelles des fichiers sources même lorsque les noms des 731 fiches sont inchangés**. Le champ `sourceDrift` isole les fichiers modifiés, et `--check` échoue si une provenance est périmée. Déplacer une fiche vers un autre chemin est également détecté. Ceci évite qu'un historique de sources semble à jour après un changement de code.

### Correspondances inter-jeux Hunting Grounds
Les apparences `alpha_yautja`, `samurai_yautja` et `viking_yautja` réutilisent les mêmes IDs documentaires de personnages que Yautja Hive Warriors et La Longue Chasse dans la PR Alien_base #24. Les titres d'œuvre sont cohérents, mais aucune texture, silhouette, arme ni animation n'est certifiée 1:1. Le total des liens locaux passe à **38**, les sujets à examiner à **693**, et le snapshot public v2 contient **75** noms de référence.

### Recherche des archives au bio-masque
Le Codex permet désormais de filtrer les dossiers par texte, provenance (écran, AVP, EU, création, recherche) et mode « archives uniquement ». Les **40 archives Alien_base** restent distinctes des chasses et des équipements. Les filtres agissent uniquement sur les fiches affichées ; ils ne modifient aucun état de jeu ou fichier de sauvegarde.
