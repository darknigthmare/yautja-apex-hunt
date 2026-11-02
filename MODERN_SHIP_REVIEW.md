# Croiseur, interactions et références — 2 novembre 2026

Base : `master` à `f3e375b9f77600736a2aa5ed53791437ea6a422c`, récupéré avant modification. Cette passe transforme l’entrée dans le jeu et le croiseur ; elle ne certifie ni des répliques 1:1 ni une production AAA.

## Circulation et construction

La forge et le hangar se trouvent maintenant dans leurs compartiments effectifs. Les quinze lecteurs de contrats sont répartis en deux banques avec des allées longitudinales et transversales. Les passages ont une hauteur de 10,2 unités pour le chasseur de 7,2 unités ; les voûtes laissent également passer les perchoirs et le personnage. Les jambages, lecteurs et équipements ont des colliders alignés sur leur implantation. Le croiseur conserve vingt-cinq postes et onze zones déclarées, dont neuf compartiments couverts par les nouvelles voûtes.

La navigation suit les obstacles réels. Une route inaccessible ne devient jamais une ligne droite. Les essais de circulation couvrent 175 trajets et 38 540 positions échantillonnées avec la capsule du joueur. Le plan du biomask utilise les limites, portes, postes et détours de ce même modèle. Le repère est projeté au sol ; son recalcul attend un déplacement significatif et ne lance pas de recherche à chaque image.

Les voûtes, nervures, conduits, raccords, grilles et écrans apportent des détails fonctionnels. Les écrans physiques utilisent un atlas partagé et affichent les ressources, le paquetage, le contrat et le repère du joueur. Les six armes exposées réemploient les builders existants ou le bouclier d’exposition du Feral. Quinze études de crânes/carapaces et quinze projections de contrats remplacent des primitives abstraites. Ces études restent des interprétations originales, non des scans canoniques.

## Interaction et continuité

Le bouton d’entrée conduit directement à l’exploration. E ouvre le lecteur proche sans soigner, déployer ou créditer une récompense. Ses actions explicites ouvrent les fonctionnalités existantes : contrats, armurerie, fabrication, archives ou préparation. N ouvre le plan ; les écrans possèdent un focus clavier et une fermeture qui rend les commandes. Le HUD du croiseur conserve les informations utiles à bord et le HUD de combat revient en chasse.

Les soins, la cryostase et le noyau entretiennent des ressources différentes. Retourner à bord ou repartir ne recharge plus silencieusement toutes les réserves. Une mise hors combat stabilise le joueur à un PV au laboratoire ; le départ est refusé jusqu’au traitement, sans perdre le contrat préparé. Le Medicomp portable consomme le même stock depuis le raccourci et l’inventaire, applique les profils City/Wolf et sauvegarde son utilisation. Seul le poste médical autorise son mode croiseur. Les effets de filet et de fouet utilisent aussi leurs profils d’équipement effectifs.

Le choix éclaireur/navette/capsule au hangar ou aux pods est sauvegardé et produit un appareil de départ distinct dans la zone d’insertion. Il suit le cycle de vie existant des véhicules, sans réserve ni honneur gratuit. Ce sont des transports originaux non pilotables.

## Lumière et coût

La palette ambre/cyan et les projections sont moins saturées et moins opaques. Trois finitions de pont remplacent le sol uniforme. Une SpotLight bornée au nexus produit une ombre réelle de 1024² ; le mode Performance la désactive et libère ses cibles. Quarante-cinq contacts statiques approximés complètent les appuis ailleurs ; ils ne sont pas présentés comme de véritables ombres. Les sept PointLight préexistantes ne reçoivent pas de shadow maps.

Le modèle représente 263 draws estimés et 475 396 triangles, hors ombre et postproduction. Les mesures par caméra, comprenant les passes réellement exécutées, sont dans `after/results.json` : entre 127 et 286 appels de dessin sur les dix vues, contre 72 à 302 sur la base. Ces plages ne constituent pas une mesure de fluidité. Les photographies avant/après utilisent les mêmes dix caméras, une graine fixe et le rendu réel du jeu en qualité Haute. Elles ne prouvent pas un débit d’images sur GPU matériel.

## Fidélité documentaire

L’inventaire couvre 1 079 enregistrements nommés, sans les compter comme autant de modèles. Sur 560 dossiers d’entraînement, dix-neuf réemploient un sujet correspondant. Seize dossiers ont changé depuis la base : douze modèles et seize biomes corrigés. Six mégafaunes sont classées comme faune. Les citations erronées de Rhynth/Bad Blood et les anciens libellés de certification ont été corrigés.

Il reste **541 représentations génériques**, **24 recettes archivées sans nouvelle fabrication physique** et des références primaires non résolues. Aucun modèle n’est certifié 1:1. Des intitulés de sources et des dimensions de catalogue ne suffisent pas à reconstruire exactement la silhouette, les textures et chaque mécanisme. Voir `FIDELITY_COVERAGE_REVIEW.md` et l’export de `scripts/audit-fidelity.mjs` pour les états séparés et les preuves manquantes.

## Vérification reproductible

La dernière suite Node valide **1 943 tests, zéro échec, zéro ignoré** après les correctifs du statut des trophées et de propriété des matériaux. Le build passe au seuil inchangé de 550 ko : plus gros JavaScript de 544 861 octets. L’audit des dépendances de production indique zéro vulnérabilité.

Le navigateur valide onze scénarios du croiseur sur ordinateur, 390 px et 320 px, avec onze captures, zéro erreur JavaScript et zéro ressource en échec. Le catalogue retrouve les dix-sept résultats « reine », conserve le focus après filtrage, prépare le contrat choisi depuis son lecteur et affiche ses références documentaires. Le test de cohérence valide aussi la simulation à sa taille déclarée et le prélèvement physique unique conservé au rechargement. Les fixtures de téléportation et de réserves entamées sont déclarées dans les scripts ; elles ne prétendent pas mesurer des parties complètes.

Le smoke terminé de 06:27:51 à 06:36:05 UTC comprend quarante-six résultats : quinze contrats distincts dans neuf biomes, vingt-cinq contrôles du véritable GLB animé, ordinateur et mobile, rotations, HUD à 125 %, pause, Medicomp et stockage refusé. Le parcours ciblé final distingue aussi le trophée non acquis du trophée acquis sans attribuer de récompense. Les deux correctifs ultimes de métadonnées et de libération sont validés séparément et par la suite Node finale.

```bash
npm ci
npm test
npm run build
npm audit --omit=dev
npm run preview -- --host 127.0.0.1 --port 4173
QA_BASE_URL=http://127.0.0.1:4173 npm run test:browser
QA_BASE_URL=http://127.0.0.1:4173 npm run test:catalogue
QA_BASE_URL=http://127.0.0.1:4173 npm run test:coherence
QA_BASE_URL=http://127.0.0.1:4173 node scripts/qa-ship.cjs
QA_BASE_URL=http://127.0.0.1:4173 node scripts/qa-ship-interactions.cjs
```

Six agents ont réparti construction, art, expositions, interface, gameplay et provenance. Les validations utilisent Node et Chromium avec SwiftShader ; aucun testeur humain ou appareil mobile physique n’est revendiqué. Les quinze contrats des scripts navigateur sont des contrôles de rendu et d’intégration, pas quinze parties complètes.

## Livraison vérifiée

Le commit fonctionnel `bfd682a63b3d476dd9c24cfca8acaf630bdf7b11` est poussé sur `master`. Vercel refuse le déploiement automatique de ce commit avec le statut **« Deployment rate limited — retry in 24 hours. »** L’alias `https://yautja-apex-hunt.vercel.app/` répond en HTTP 200 mais conserve l’ancien point d’entrée `index-BtqwTYjl.js` : il ne contient pas cette passe.

Une préversion Vercel temporaire est prête : <https://racing-bassoon-vgmxjf5.tmp.now>, déploiement `dpl_C3YSPimQircEZ6KJ5Smtsv5Nc6WS`, expiration annoncée le **2 novembre 2026 à 07:36:13 UTC**. Sa racine et ses **73 fichiers** correspondent intégralement au build local par taille et SHA-256, avec vérification TLS active via la CA système et le proxy de session. Son entrée est `index-BUUudz_o.js`. La vérification HTTP publique et le navigateur local du même contenu sont distingués ; aucune validation native de certificat Chromium sur l’URL publique n’est revendiquée.

Les rapports et captures sont dans `/workspace/artifacts/yautja-modern-ship/` ; la matrice générale et le catalogue dans `/workspace/artifacts/yautja-ship-pass/`. Le lien privé permettant au propriétaire de conserver le déploiement est enregistré séparément, hors dépôt et hors artefacts publics, dans `/workspace/.vercel-runtime/conserver-croiseur-modernise.html`. Aucun jeton ni lien de reprise privé n’est ajouté au code.
