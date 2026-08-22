# Changelog professionnel

Les versions sont considérées comme publiées uniquement après push du code, validation du Preview et contrôle de l’URL de production.

## [1.4.0] — 22 août 2026

### Chasses, proies et monde vivant

- sixième contrat contre le Feral : triple lance-traits mobile, bouclier frontal à intégrité, estoc et charge à la lance télégraphiée avec impact unique ;
- quatre nouvelles familles de PNJ 3D : grizzly territorial, traqueur thermique de confinement, traqueur organique de Genna et guerrier xénomorphe ;
- quatre vagues par chasse avec compositions propres à Genna, la jungle, la ruche et les terrains humains.

### Technologies et personnalisation

- bouclier de poignet `[B]`, drone-faucon `[G]` et shuriken `[T]` réellement activables, avec coûts, recharges, objets 3D, impacts et états HUD ;
- quatre classes de chasseur aux statistiques distinctes, quatre styles de predlocks, quatre finitions d’armure et quatre warpaints procéduraux ;
- rugissement d’honneur limité à une utilisation par chasse afin de supprimer la recharge exploitable à l’infini.

### Genna et visuels OpenAI

- cinquième biome `genna_deathworld` : 28 plantes prédatrices, 14 petites créatures instanciées et 520 spores animées, tous figés avec mouvement réduit ;
- quatre textures originales OpenAI 1024×1024 pour le sol et la flore de Genna, le composite osseux du Feral et les équipements tactiques humains ;
- galerie du vaisseau-mère et sélection de mission étendues à six contrats, avec nouvelle carte texturée du Feral.

### Progression, catalogue et cohérence

- sauvegarde locale v4 avec migration v1/v2/v3, apparence à neuf axes et honneur cumulé séparé des crédits dépensables ;
- rang Yautja calculé sur l’honneur de carrière : les achats de forge ne font plus perdre un rang déjà acquis ;
- 110 fiches de contenu dont les statuts jouable/rencontre 3D reflètent désormais les mécaniques effectivement livrées.

### Validation et publication

- 98/98 tests Node couvrant boss, proies, équipements, Genna, galerie à six trophées et migrations de sauvegarde ;
- build Vite 8.2.2, audit npm et contrôle statique validés sur le worktree final ;
- parcours Chromium desktop/mobile, sixième contrat, Forge v4 et nouveaux assets contrôlés sans erreur de page ;
- release poussée sur GitHub et publiée sur <https://yautja-apex-hunt.vercel.app/>.

## [1.3.0] — 22 août 2026

### Contenu réellement intégré

- cinquième chasse contre le Berserker Super Predator avec plasma lourd, charge télégraphiée, bris du masque, rage et trophée ;
- quatre archétypes de PNJ 3D : commando humain, drone xénomorphe, molosse de chasse et synthétique de combat ;
- événements de niveau déterministes : survol, renforts, dangers météo, conteneurs et fin de perturbation ;
- trois navettes Yautja 3D et quatre conteneurs interactifs aux récompenses propres aux biomes ;
- arc Yautja et lance-harpons ajoutés à l’arsenal, désormais jouable sur dix raccourcis de `1` à `0` ;
- mimétisme vocal directionnel : trois appels sonores détournent réellement les PNJ proches vers un point de leurre ;
- combat des renforts maintenu après la mort du boss jusqu’au prélèvement du trophée.

### Personnalisation et franchise

- 30 bio-masques procéduraux, 42 presets d’armure, huit couleurs de peau, huit couleurs de predlocks, douze alliages et huit accents ;
- sept silhouettes dédiées aux classes Gladiator, Anubis, Exalted, Witch, Oni, Jotun et Father de Hunting Grounds ;
- 109 dossiers de technologies, véhicules, ennemis, événements, boss et soutien, chacun marqué `JOUABLE`, `RENCONTRE 3D`, `GALERIE 3D` ou `ARCHIVE` ;
- ajouts sourcés liés à The Predator, Prey, Predators, AVP, Killer of Killers, Badlands et aux contenus licenciés Hunting Grounds ;
- Assassin Predator séparé du Fugitive, et créations Apex explicitement signalées comme interprétations originales.

### Visuels OpenAI

- six textures originales fan-made 1254×1254 générées avec OpenAI pour peau Yautja, bio-masque, carapace xénomorphe, Goliath, molosse et réseau énergétique ;
- quinze WebP runtime totalisant 4 661 738 octets, sans texte, logo, watermark ni copie de key art officiel ;
- textures branchées sur le joueur, les boss, PNJ, navettes, conteneurs, hangar et interface de Forge.

### Fiabilité et publication

- sauvegarde v3 des cinq canaux d’apparence, avec migrations v1/v2 et reconstruction des anciens presets ;
- 71/71 tests Node, build Vite 8.2.2, audit npm à 0 vulnérabilité et `git diff --check` propre ;
- QA Chromium desktop/mobile : 109 fiches, 42 armures, 30 masques, 10 armes, aucun overlay ni erreur et aucun débordement à 390×844 ;
- revue lore finale : GO, aucun défaut P0/P1 ;
- six nouvelles textures contrôlées en HTTP 200 localement puis sur la production publique ;
- release poussée sur GitHub et publiée sur <https://yautja-apex-hunt.vercel.app/>.

## [1.2.0] — 22 août 2026

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

### Corrigé

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

### Validation physique post-release encore recommandée

- accomplir manuellement une victoire complète, une défaite et l'autodestruction pour contrôler toute la mise en scène ;
- provoquer en jeu les impacts Bad Blood, Reine, Predalien et le QTE facehugger ;
- inspecter visuellement à 100 % les raccords 2×2 des WebP sur plusieurs écrans physiques ;
- mesurer les performances sur téléphone réel et machine GPU modeste ;

### Publication

- source fonctionnelle poussée sur `master` au commit `ce5cd245a4b37614946e9aacbc08f61034c4726b` ;
- Preview Vercel vérifié en HTTP 200 avec le bundle, les headers de sécurité et les neuf textures, puis promu en production ;
- version 1.2.0 disponible sur <https://yautja-apex-hunt.vercel.app/>.
