# Rapport QA — release 1.5.0 publiée / worktree 1.6.0 validé localement

**Date :** 24 août 2026
**Statut :** release 1.5.0 validée et publiée ; worktree 1.6.0 validé localement, push et production Vercel encore ouverts.
**Production :** <https://yautja-apex-hunt.vercel.app/>
**Déploiement :** `dpl_6PrjSve8RsKqoDh7TWp2NmD6BPRA` — `READY`, cible `production`
**Source :** <https://github.com/darknigthmare/yautja-apex-hunt>

## Gates de release

| Gate | Résultat vérifié | Couverture |
|---|---:|---|
| Tests Node | **125/125 réussis** | Huit boss, points faibles balayés, dangers Cleaner, régénération Kalisk, équipement, personnalisation, contenu média, sauvegarde et responsive HUD. |
| Build production local | **Vite 8.2.2 réussi** | 39 modules ; HTML 22,78 Ko ; CSS 23,79 Ko ; jeu 331,75 Ko ; Three.js 503,06 Ko. L’avertissement de taille du chunk Three.js est non bloquant. |
| Build Vercel | **réussi** | Déploiement production `READY` et alias officiel appliqué. |
| Sécurité dépendances | **0 vulnérabilité** | `npm audit --audit-level=high`. |
| Qualité Git | **propre** | `git diff --check`, aucun patch ou fichier QA temporaire conservé. |
| Chromium desktop local et production | **réussi** | 8 contrats, 29 fiches média, 38 bio-masques, lancement Wolf/Kalisk et chargement des textures runtime. |
| Chromium mobile production | **réussi** | Viewport 390×844, largeur document 390 px, huit contrats accessibles et aucun débordement horizontal. |
| Console navigateur | **0 erreur** | Aucun défaut de page relevé sur les parcours local et production. |
| Assets 1.5 | **HTTP 200** | Les trois WebP OpenAI répondent en production avec le bon type MIME et sont chargés par leur contenu jouable. |

## Contenu réellement jouable contrôlé

- [x] huit contrats : Goliath, Reine xénomorphe, Bad Blood, Predalien, Berserker, Feral, Wolf Cleaner et Kalisk ;
- [x] Wolf : double plasma, fouet télégraphié, mine, agent dissolvant, bio-masque et mallette destructibles ;
- [x] Kalisk : carapace adaptative, charge, empalement, régénération interruptible et noyau exposé ;
- [x] points faibles visés en coordonnées monde et collision de projectile balayée pour éviter le tunneling ;
- [x] secteurs narratifs imposés au lancement : Wolf sur LV-426 et Kalisk sur Genna ;
- [x] huit presets Lost Tribe, 38 bio-masques et texture rituelle réellement appliquée puis restaurée lors d’un changement de preset ;
- [x] registre de 29 œuvres et médias, avec statuts séparés pour sorties, bonus, coupés, non publiés, promotionnels et crossovers ;
- [x] galerie de huit trophées et parité entre les contrats, les biomes et le Codex ;
- [x] trois textures originales OpenAI en WebP 1024×1024 : alliage Cleaner, os rituel Lost Tribe et peau adaptative Kalisk.

## État du classeur de franchise

Le classeur évoqué par l’utilisateur n’était pas accessible dans le workspace ni parmi les pièces jointes disponibles pendant cette passe. Il n’a donc pas été lu, importé ni utilisé pour produire un nombre d’entrées. La couverture par film et média repose ici sur le registre versionné et ses niveaux de provenance ; une confrontation au tableur reste un gate documentaire futur.

Les prochains lots déjà identifiés sont une carte de Gunnison réellement multi-niveaux, des campagnes complètes *Killer of Killers* et *Alien vs. Predator*, puis une faune et une flore de Genna plus variées.

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
- [ ] contrôle sur appareil tactile/mobile réel ;
- [ ] push et déploiement Vercel de la v1.6.

La validation locale desktop est terminée. Elle ne vaut pas publication : aucun push de la v1.6, aucun déploiement Vercel v1.6 et aucun HTTP de production v1.6 ne sont revendiqués dans ce rapport.

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
| Textures v1.6 | 4 WebP originaux OpenAI 1254×1254, chargés dans Chromium et répondant en HTTP 200 local ; production ouverte |

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
5. les quatre chemins WebP v1.6 en HTTP 200 local.

## Verdict

La 1.5.0 ne se limite pas à ajouter des noms au Codex : Wolf et le Kalisk possèdent leurs propres boucles de combat, états, dangers, points faibles, textures et contrats. La couverture du Lost Tribe et des médias reste clairement séparée par provenance, et la production déployée a franchi les gates automatisés, navigateur, responsive, sécurité, assets et Vercel.

La 1.6.0 franchit ses gates locaux avec 193/193 tests, 42 modules Vite, 0 vulnérabilité de production, 11 modules contrôlés syntaxiquement, un diff-check propre et le parcours Chromium desktop décrit ci-dessus. Le push et la production Vercel restent volontairement ouverts.
