# Liaison Alien_base — Yautja: Apex Hunt
Le dépôt privé `darknigthmare/alien_base` est la source de **noms, identités, variantes et provenance** ; le jeu reste seul responsable du gameplay, des armes jouables, statistiques, IA, animations, modèles et sauvegardes.

## Livraison
- `src/data/alien-base-snapshot.v1.json` : snapshot public minimal (noms/IDs/types) ; pas de fetch privé dans le navigateur.
- `src/data/AlienBaseFederation.js` : résolution des IDs historiques par collection, dossiers du Codex et relations `inspired-by`.
- 20 nouvelles notices **archive seule** consultables dans le Codex (Weyland-Yutani, USCM, synthétiques, Ripley/Bishop, M41A, M56, M240, M314, M577, UD-4L, P-5000, sites et biologie Alien).
- 33 relations d'identité/technologies et 9 liens d'inspiration (les boss originaux ne deviennent jamais des incarnations écran identiques).
- `scripts/export-alien-base-candidates.mjs` : 623 fiches locales à examiner, y compris crossovers, palettes, proies et adaptations. **RESEARCH_ONLY**, sans dégâts, DPS, dimensions simulées ni statistiques de jeu.

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
