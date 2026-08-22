# Rapport QA — validation locale

**Date :** 22 août 2026
**Statut :** candidat technique local validé par tests, build, audit statique et smoke test Chromium isolé ; QA gameplay finale encore incomplète.
**Important :** ce document ne certifie ni une release, ni un push, ni un déploiement.

## Résultats établis sur le worktree final

| Contrôle | Résultat | Portée exacte |
| --- | --- | --- |
| Version publique | HTTP 200 observé | Ancienne version publique, pas le worktree actuel. |
| Syntaxe et tests | 18/18 tests Node réussis | Combat, sauvegarde/migration, résilience, timers, destruction GPU et contrats statiques. |
| Build de production | Vite 8.2.2 réussi sur le worktree final | App 106,52 Ko et chunk Three.js 477,51 Ko ; plus d'avertissement supérieur à 500 Ko. |
| Dépendances | `npm audit --audit-level=moderate` : 0 vulnérabilité | Lockfile final contrôlé. |
| Assets | Six WebP 1024×1024, 1 681 184 octets | Les six fichiers ont été chargés par Chromium pendant le parcours couvrant le hub et les quatre biomes. |
| Smoke test navigateur | Réussi dans les sessions isolées `yautja-apex-qa` et `yautja-deep-qa` | Hub, Codex, options, armurerie, quatre cibles, quatre biomes, pause/reprise/abandon, persistance du zoom et de la peau, autodestruction et retour hub. |
| Console navigateur | 0 erreur et aucun warning applicatif après correction | Les refus de pointer-lock sont gérés sans rejet non capturé. |
| Accessibilité | axe-core 4.12.1 : 0 violation | Un contrôle de contraste reste « incomplete » car le HUD recouvre le canvas WebGL. |
| Responsive | 390×844 sans débordement horizontal | Canvas redimensionné à 390×844 et modal verticalement défilable. |

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

- [x] six chemins WebP du manifest présents.
- [x] dimensions et formats relevés : six WebP 1024×1024.
- [x] poids individuel et total relevés : 1 681 184 octets au total.
- [x] décodage Sharp réussi pour les six WebP et planche-contact assemblée.
- [x] inspection visuelle des PNG originaux : aucun texte, logo, watermark ou symbole officiel relevé.
- [ ] inspection visuelle des WebP finaux : non revendiquée, car `view_image` est bloqué par une ACL Windows.
- [ ] mosaïque 2×2 : raccords visuellement acceptables.
- [x] chargement runtime du hub, des quatre biomes et des six textures sans erreur console.
- [x] fallback de matériau prévu sur erreur de chargement.

### Boucle de jeu

- [x] hub chargé et interactif.
- [x] les quatre cibles démarrent dans les quatre biomes de référence.
- [x] lames de poignet et fouet respectent leurs portées dans les tests de règles.
- [ ] projectile et mêlée Bad Blood blessent le joueur une seule fois par impact prévu.
- [ ] queue/attaques de la Reine et du Predalien sont télégraphiées et dommageables.
- [ ] facehugger : QTE réussi neutralise la menace ; échec inflige la conséquence prévue.
- [ ] victoire accorde honneur et trophée une seule fois.
- [x] autodestruction aboutit à un seul écran terminal de défaite, sans trophée ni gain d'honneur, puis revient proprement au hub.
- [ ] recommencer nettoie mines, projectiles, corrosion, camouflage et états terminaux.

### Progression et options

- [ ] achat du zoom produit un effet de visée perceptible.
- [x] zoom acheté encore présent dans la sauvegarde v2 après rechargement Chromium.
- [x] peau City Hunter sélectionnée, sauvegardée puis restaurée visuellement après rechargement Chromium.
- [ ] chasses terminées et trophées restaurés sans doublon.
- [x] migration d'une sauvegarde v1.
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
- [x] console navigateur sans erreur sur le smoke test final des quatre chasses.

### Surface web

- [x] métadonnées, favicon, manifest, robots et sitemap présents dans le build.
- [ ] headers de sécurité examinés sur la preview de déploiement.
- [x] tous les chemins absolus des six textures chargent dans Chromium.
- [x] aucune source map ni donnée locale sensible présente dans `dist`.

## Scénario de smoke test recommandé

1. Nouvelle sauvegarde, ouvrir le hub et le Codex.
2. Lancer Goliath dans la jungle, tester mêlée, camouflage, pause et victoire.
3. Acheter le zoom, changer de peau, recharger la page et vérifier la persistance.
4. Lancer Bad Blood à Ryushi et recevoir projectile puis mêlée.
5. Lancer la Reine dans la ruche et tester queue et facehugger.
6. Lancer le Predalien dans l'arène et provoquer une défaite normale.
7. Relancer une chasse, déclencher l'autodestruction et confirmer une seule issue terminale.
8. Revenir au hub et confirmer trophées, score, options et absence d'erreur console.

## Critère de décision

Une seule erreur P0, perte de sauvegarde, attaque majeure sans dégâts, asset manquant ou exception console reproductible bloque la release. Les écarts P1/P2 doivent être corrigés ou explicitement acceptés et consignés.

Push GitHub et déploiement Vercel restent en attente d'une autorisation explicite après communication des résultats réels.
