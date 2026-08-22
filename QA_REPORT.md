# Rapport QA — validation locale

**Date :** 22 août 2026
**Statut :** candidat 1.2.0 validé localement par tests, build, audit, revue P0/P1 et parcours Chromium desktop/mobile ; contrôle production encore requis.
**Important :** ce document ne certifie un push ou un déploiement qu’après consignation du commit et de l’URL effectivement publiés.

## Résultats établis sur le worktree final

| Contrôle | Résultat | Portée exacte |
| --- | --- | --- |
| Version publique | HTTP 200 observé | Ancienne version publique, pas le worktree actuel. |
| Syntaxe et tests | 33/33 tests Node réussis | Combat, télégraphies, acide/camouflage, lore, sauvegarde/migration, résilience, timers, destruction GPU et contrats statiques. |
| Build de production | Vite 8.2.2 réussi sur le worktree final | App 117,95 Ko, CSS 18,23 Ko et chunk Three.js 477,51 Ko ; aucun avertissement supérieur à 500 Ko. |
| Dépendances | `npm audit --audit-level=moderate` : 0 vulnérabilité | Lockfile final contrôlé. |
| Assets | Neuf WebP 1024×1024, 2 451 694 octets | Les neuf chemins ont répondu en HTTP 200 dans Chromium ; trois nouvelles matières intégrées aux trophées, à l’armure et aux œufs. |
| Smoke test navigateur | Réussi dans les sessions isolées précédentes et `yautja-final-local` | Hub, Codex, armurerie sourcée, options, Reine/ruche, Bad Blood/Ryushi, Goliath/jungle, défaite, retour hub et états responsive. |
| Console navigateur | 0 erreur et aucun warning applicatif après correction | Les refus de pointer-lock sont gérés sans rejet non capturé. |
| Accessibilité | axe-core 4.12.1 : 0 violation | Un contrôle de contraste reste « incomplete » car le HUD recouvre le canvas WebGL. |
| Responsive | 390×844 sans débordement horizontal | Canvas 390×844, modales défilables, HUD sans chevauchement à 0,85/1,25 et cibles armes d’au moins 44×44 px. |

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

- [x] neuf chemins WebP du manifest présents.
- [x] dimensions et formats relevés : neuf WebP 1024×1024.
- [x] poids individuel et total relevés : 2 451 694 octets au total.
- [x] décodage Sharp des six matières de décor ; planche 2×2 et inspection base64 des trois matières de props.
- [x] inspection visuelle des PNG originaux : aucun texte, logo, watermark ou symbole officiel relevé.
- [x] inspection visuelle des trois nouveaux WebP finaux par affichage base64 de secours ; contrôle physique des six matières initiales encore recommandé.
- [x] mosaïque 2×2 des trois matières de props : bords continus après normalisation miroir.
- [x] chargement runtime des neuf textures sans erreur de page.
- [x] fallback de matériau prévu sur erreur de chargement.

### Boucle de jeu

- [x] hub chargé et interactif.
- [x] les quatre cibles démarrent dans les quatre biomes de référence.
- [x] lames de poignet et fouet respectent leurs portées dans les tests de règles.
- [x] projectile et mêlée Bad Blood blessent le joueur une seule fois par impact prévu.
- [x] queues et attaques acides de la Reine/du Predalien sont accessibles, télégraphiées et consommées une fois.
- [x] facehugger : QTE réussi neutralise la menace ; échec inflige exactement 35 dégâts et retire la menace.
- [x] victoire accorde honneur et trophée une seule fois.
- [x] autodestruction aboutit à un seul écran terminal de défaite, sans trophée ni gain d'honneur, puis revient proprement au hub.
- [x] recommencer nettoie mines, projectiles, corrosion, camouflage et états terminaux.

### Progression et options

- [x] achat du zoom modifie le FOV et persiste après rechargement Chromium.
- [x] zoom acheté encore présent dans la sauvegarde v2 après rechargement Chromium.
- [x] peau City Hunter sélectionnée, sauvegardée puis restaurée visuellement après rechargement Chromium.
- [x] chasses terminées, trophées et honneur sont dédupliqués par les tests de progression et restaurés par la sauvegarde v2.
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
- [x] tous les chemins absolus des neuf textures chargent dans Chromium.
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

Push GitHub et déploiement Vercel sont autorisés ; le statut restera « contrôle production requis » jusqu’à vérification de la preview puis de l’URL publique.
