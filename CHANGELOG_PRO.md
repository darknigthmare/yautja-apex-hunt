# Changelog professionnel

Toutes les évolutions notées ici sont **non publiées** tant qu'aucun push ou déploiement autorisé n'a été effectué.

## [Unreleased] — 22 août 2026

### Ajouté

- format de sauvegarde versionné v2 avec migration de l'ancien format ;
- persistance de la peau, des chasses terminées, trophées et options ;
- règles isolées de mêlée pour lames de poignet et fouet ;
- tests Node dédiés au combat, au lore, à la sauvegarde, au cycle de vie et aux contrats web/HUD ;
- configuration centralisée des chasses, biomes et préférences ;
- Codex de lore avec niveaux `SCREEN`, `AVP_SCREEN`, `LICENSED_EU` et `ORIGINAL` ;
- neuf textures originales générées avec le modèle ImageGen intégré OpenAI, dont os de trophée, cuir-filet et membrane d’œuf ;
- infrastructure d'options pour audio, mouvement réduit, fort contraste et échelle du HUD ;
- documentation de production : audit, game design, direction artistique, lore, assets et QA.

### Corrigé dans le worktree

- import du gestionnaire d'environnement principal redirigé vers l'implémentation complète ;
- autodestruction protégée contre les explosions répétées et associée à un état terminal ;
- état du joueur réinitialisable entre les chasses ;
- attribution d'honneur rendue explicite et dédupliquée au niveau des règles ;
- QTE facehugger rendu idempotent, timer remis à zéro et récompense affichée selon le gain réel ; corrosion acide corrigée pour forcer le décloak avant verrouillage ;
- matériaux de peau limités aux éléments destinés à être teintés ;
- trophées du hub pilotables par la liste des chasses terminées ;
- états acquis/inabordables de la forge explicités, boutons désactivés de façon accessible et alertes natives remplacées par le journal HUD ; mutations par frame mises en cache, jauges ARIA et cibles tactiles réelles de 44 px ajoutées ;
- ressources de biome nettoyables lors d'un changement d'environnement.

### Intégré et validé techniquement

- intégration des dégâts de mêlée et projectiles Bad Blood ; queues et attaques acides de la Reine/du Predalien suivent désormais signal, fenêtre de réaction, impact unique et récupération ;
- implémentation du zoom, pause, reprise, abandon et options ; persistance du zoom et de la peau après rechargement ;
- Codex sourcé et niveaux de continuité visibles ;
- armurerie et arsenal utilisables au clavier ;
- responsive 390×844 sans débordement horizontal et audit axe à 0 violation ;
- chargement réel des neuf textures OpenAI optimisées, toutes observées en HTTP 200 dans Chromium ;
- démarrage/cleanup des quatre cibles dans les quatre biomes de référence ;
- autodestruction complète sans gain abusif, 33/33 tests, build Vite final et smoke tests Chromium 1280×720 / 390×844 sans erreur de page.

### Sécurité et dépendances

- Vite porté à 8.2.2 ; audit final à 0 vulnérabilité connue.
- Three.js séparé dans un chunk cacheable de 477,51 Ko ; build final sans warning de taille.

### Validation manuelle encore recommandée

- accomplir manuellement une victoire complète, une défaite et l'autodestruction pour contrôler toute la mise en scène ;
- provoquer en jeu les impacts Bad Blood, Reine, Predalien et le QTE facehugger ;
- inspecter visuellement à 100 % les raccords 2×2 des WebP sur plusieurs écrans physiques ;
- mesurer les performances sur téléphone réel et machine GPU modeste ;

### Publication

- push GitHub et déploiement Vercel explicitement autorisés par l’utilisateur le 22 août 2026 ;
- aucun déploiement de ce candidat n’est revendiqué avant exécution du gate de production ;
- état public exact et commit déployé à consigner dans `QA_REPORT.md` après publication.
