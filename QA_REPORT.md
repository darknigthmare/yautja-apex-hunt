# Rapport QA — release 1.3.0

**Date :** 22 août 2026
**Statut :** version 1.3.0 publiée sur la production Vercel le 22 août 2026, sans défaut P0/P1 connu.
**Source fonctionnelle publiée :** release 1.3.0 du dépôt GitHub.
**URL publique :** <https://yautja-apex-hunt.vercel.app/>

## Résultats établis sur la release

| Contrôle | Résultat | Portée exacte |
| --- | --- | --- |
| Version publique | Vercel `production` en état `Ready`, HTTP 200 | L’alias public sert le bundle validé de la 1.3.0. |
| Syntaxe et tests | 71/71 tests Node réussis | Boss, PNJ, événements, véhicules, scan visuel, conteneurs, armes, personnalisation, lore, sauvegarde/migrations et contrats statiques. |
| Build de production | Vite 8.2.2 réussi sur le worktree final | App 230,77 Ko, CSS 21,79 Ko et chunk Three.js 496,94 Ko ; aucun avertissement supérieur à 500 Ko. |
| Dépendances | `npm audit --audit-level=moderate` : 0 vulnérabilité | Lockfile final contrôlé. |
| Assets | Quinze WebP, 4 661 738 octets | Six nouvelles matières OpenAI 1254×1254 intégrées au runtime ; quinze chemins chargés dans Chromium et six nouveaux chemins contrôlés individuellement en HTTP 200. |
| Contenu | 109 fiches, 42 armures, 30 masques et 10 armes | Les statuts `JOUABLE`, `RENCONTRE 3D`, `GALERIE 3D` et `ARCHIVE` sont visibles et cohérents. |
| Smoke test navigateur | Réussi localement et sur la production publique | Accueil, hub, Forge, Codex, contrats Goliath/Reine/Super Predator, événements, défaite et retour contrôlés. |
| Console navigateur | 0 erreur | Aucun overlay Vite ni erreur de page pendant les parcours desktop/mobile. |
| Revue lore | GO, aucun P0/P1 | Les sept classes Hunting Grounds récentes appliquent un masque procédural dédié ; Assassin et Fugitive restent distincts. |
| Responsive | 390×844 sans débordement horizontal | `scrollWidth` égal à 390 px ; modale 390×844 et contenu vertical défilable. |
| Surface de production | HTTP 200 et headers vérifiés | CSP sans script tiers, COOP, HSTS, `nosniff`, Permissions-Policy et Referrer-Policy présents. |

## Matrice de validation finale

Les cases cochées correspondent uniquement aux preuves réellement obtenues dans cette session.

### Qualité statique et build

- [x] `node --check` sur tous les modules JavaScript.
- [x] tests Node de combat.
- [x] tests Node de sauvegarde et de résilience.
- [x] `npm run build` sur le worktree final.
- [x] `npm audit` final sans vulnérabilité connue.
- [x] découpage Three.js documenté et build sans warning de chunk.

### Assets

- [x] quinze chemins WebP du manifest présents et décodables.
- [x] dimensions, formats et poids relevés : 4 661 738 octets au total.
- [x] six nouvelles matières 1254×1254 inspectées visuellement et intégrées au runtime.
- [x] inspection visuelle des PNG originaux : aucun texte, logo, watermark ou symbole officiel relevé.
- [x] chargement runtime des quinze textures sans erreur de page.
- [x] six nouveaux chemins contrôlés individuellement en HTTP 200 et avec leur poids exact.
- [x] fallback de matériau prévu sur erreur de chargement.

### Boucle de jeu

- [x] hub chargé et interactif.
- [x] les cinq cibles démarrent dans les quatre biomes de référence.
- [x] le Berserker Super Predator télégraphie plasma lourd, charge, mêlée, bris du masque et rage.
- [x] quatre familles de PNJ 3D utilisent combat, dégâts, mort, détection et nettoyage communs.
- [x] le mimétisme vocal détourne réellement les PNJ proches vers un point de leurre.
- [x] événements déterministes : survol, renfort, danger, conteneur et fin de danger.
- [x] trois navettes et quatre conteneurs possèdent des comportements/récompenses distincts.
- [x] dix armes sont sélectionnables de `1` à `0`, dont arc et lance-harpons.
- [x] lames de poignet et fouet respectent leurs portées dans les tests de règles.
- [x] projectile et mêlée Bad Blood blessent le joueur une seule fois par impact prévu.
- [x] queues et attaques acides de la Reine/du Predalien sont accessibles, télégraphiées et consommées une fois.
- [x] facehugger : QTE réussi neutralise la menace ; échec inflige exactement 35 dégâts et retire la menace.
- [x] victoire accorde honneur et trophée une seule fois.
- [x] recommencer nettoie mines, projectiles, corrosion, camouflage et états terminaux.

### Progression et options

- [x] achat du zoom modifie le FOV et persiste après rechargement Chromium.
- [x] sauvegarde v3 persistante : progression, cinq canaux d’apparence, armure et options.
- [x] migrations v1/v2 vers v3 sans perte de progression.
- [x] reconstruction des masques et palettes historiques Wolf/Berserker testée.
- [x] les 42 presets d’armure pointent vers des références valides.
- [x] sauvegarde corrompue ou stockage indisponible gérés sans crash.
- [x] audio, mouvement réduit, fort contraste et échelle du HUD appliqués et sauvegardés.

### Interface, responsive et accessibilité

- [x] pause/reprise gèle les timers de simulation et fonctionne dans Chromium.
- [x] abandon retourne au hub avec nettoyage complet.
- [x] focus clavier visible ; onglets, armures et armes sont des contrôles accessibles.
- [x] contrôles vérifiés à 1280×720 et 390×844.
- [x] aucun débordement horizontal critique à 390 px.
- [x] Codex sépare `SCREEN`, `AVP_SCREEN`, `LICENSED_EU` et `ORIGINAL`.
- [x] mouvement réduit et contraste renforcé appliqués dans le DOM.
- [x] console navigateur sans erreur sur le smoke test final des cinq chasses.

### Surface web

- [x] métadonnées, favicon, manifest, robots et sitemap présents dans le build.
- [x] headers de sécurité examinés sur la Preview et la production.
- [x] tous les chemins absolus des quinze textures chargent dans Chromium.
- [x] aucune source map ni donnée locale sensible présente dans `dist`.

## Scénario de smoke test recommandé

1. Ouvrir le hub, la Forge et vérifier 42 armures, 30 masques et les cinq axes modulaires.
2. Appliquer Gladiator, Anubis, Jotun et Father ; vérifier les silhouettes distinctes.
3. Lancer Goliath dans la jungle, déclencher le mimétisme puis attendre renfort, navette et conteneur.
4. Lancer la Reine dans la ruche et vérifier drone, pluie, attaques acides et facehugger.
5. Lancer Bad Blood à Ryushi et recevoir projectile puis mêlée.
6. Lancer le Predalien dans l’arène et provoquer une défaite normale.
7. Lancer le Super Predator et observer charge, plasma, bris du masque et rage.
8. Changer de preset, recharger la page et vérifier la sauvegarde v3.
9. Revenir au hub et confirmer trophées, score, options et absence d’erreur console.

## Critère de décision

Une seule erreur P0, perte de sauvegarde, attaque majeure sans dégâts, asset manquant ou exception console reproductible bloque la release. Les écarts P1/P2 doivent être corrigés ou explicitement acceptés et consignés.

La release 1.3.0 a été poussée sur GitHub, déployée sur Vercel et contrôlée sur l’URL publique avec le bundle, les headers et les quinze textures attendus.
