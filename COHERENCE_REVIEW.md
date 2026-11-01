# Cohérence, proportions et parcours — 1er novembre 2026

Base : dernière branche GitHub `master` récupérée au début de cette passe, commit `a177aa0`. Référence retenue à la demande du propriétaire : **la source documentée de chaque élément du catalogue**. Cinq agents ont examiné les domaines en parallèle ; aucune intervention de testeurs humains n'est revendiquée.

## Corrections livrées

| Domaine | Défaut observé | Résultat |
| --- | --- | --- |
| Proportions | Humain de 2,283 unités face au chasseur de 7,209 ; drone de 1,820 ; pieds et tirs décalés | Échelle commune de trois unités/mètre ; humain 5,400, drone 6,300, guerrier 6,900 ; profils des 31 familles, collider, portée et LOD alignés sur les limites visibles |
| Silhouette du drone | Dôme trop large, appendice blanc surdimensionné, bras trop écartés après remise à l'échelle | Dôme allongé, mâchoire sombre et dents instanciées, épaules/bras/dorsales resserrés ; largeur 7,637 → 3,642 à hauteur 6,300 constante |
| Grands boss | Attaques natives déconnectées des impacts ; tirs touchant loin devant le modèle ; points faibles et prélèvement mal placés | Sept attaques avec préparation, impact unique et récupération ; annulation sur interruption ; segments de tir finis et points faibles mesurés ; prélèvement depuis les limites visibles |
| Décors et exploration | Quarante compositions des cinq premières cartes confinées dans un rayon de 142–166 unités, pour des cartes de 630–660 | Mêmes compositions réparties dans les quartiers correspondants, jusqu'à environ 558 unités ; POI et dangers déplacés avec elles ; arbres/piliers/rochers réaffectés aux routes extérieures |
| Collisions | Couverts visibles traversables ; obstacles traités comme colonnes infinies ; faux volumes du camp | Couverts solides et projectiles cohérents, volumes verticaux et boîtes orientées ; toit du camp franchissable par un humain de 5,4 unités, bloquant un chasseur plus haut ; index spatial local |
| Catalogue et fidélité | Catégories physiques mêlées à la difficulté ; estimations affichées comme canon ; simulations contournant le paquetage | Provenance et statut par entrée, 87 catégories corrigées, difficulté conservée séparément ; préparation obligatoire ; biome valide ; contexte de simulation effacé au retour au contrat normal |
| Forge et progression | Descriptions absentes ; matériaux non consommés ; effets inactifs ou cumulables ; récompenses de simulation ambiguës | Coûts réels, bonus recalculés depuis la classe, dégâts et résistances branchés ; récompense unique au prélèvement ; inventaire physique séparé des trophées holographiques et sauvegardé avec la progression |
| Prélèvement des PNJ | Pas de boucle physique de récupération des matériaux | Corps récupérables de drone/guerrier/runner, quatre corps maximum et expiration à 90 secondes ; tuer ne crédite aucun matériau, l'interaction en crédite un seul |
| Interface | Trois contrats déclarés inaccessibles, treize icônes de forge absentes, armes sans icône, focus perdu | Quinze contrats accessibles, 40 icônes de recette, quinze d'armes et cinq de gadgets ; focus conservé, états et raisons d'indisponibilité lisibles, grille à 320 px ; conversion des distances HUD en mètres |
| Build | Chunk joueur dépassant 1 Mo, contenant notamment les méthodes audio historiques | Découpage AST en six modules de méthodes audio ; conservation des 2 007 méthodes finales et de leurs descripteurs ; aucun avertissement au seuil inchangé de 550 ko ; aucun gain de poids audio total revendiqué |

## Vérification reproductible

```bash
npm ci
npm test -- --test-concurrency=4
npm run build
npm audit --omit=dev
CHROMIUM_PATH=/usr/bin/chromium npm run test:browser
node scripts/qa-coherence.cjs
```

La suite complète finale contient **1 836 tests réussis, zéro échec et zéro ignoré**, après les derniers correctifs de récompense et de personnalisation. La régression cosmétique appelle les vrais handlers de couleur et de skin avec le joueur et la forge réels : santé à 175/350, régénération à 10,8 et drainage à 14,8 restent stables, sans soin gratuit ni cumul. Le build final réussit sans avertissement ; son plus gros fichier JavaScript est Three.js à 541 533 octets. L'audit des dépendances de production signale zéro vulnérabilité à cette date.

Le script `qa-coherence.cjs` charge le vrai GLB du héros, utilise la même caméra et une graine déterministe sur la base et la version corrigée, puis vérifie un parcours réel par le DOM : dossier → paquetage obligatoire → simulation ; déploiement d'un contrat normal effaçant la sélection ; mort d'un PNJ sans crédit de matériau → prélèvement unique → rechargement conservant l'inventaire. Le parcours a réussi sans erreur JavaScript ni ressource en échec. Les dimensions nominales de la simulation sont contrôlées sur la géométrie visible ; par exemple, une fiche estimée à 9,5 m produit une dimension de 28,5 unités.

Le parcours navigateur complet a réussi de 01:47:23 à 01:55:46 UTC : quinze scènes de contrats couvrant les neuf biomes, 25 contrôles du vrai corps animé, interactions ordinateur/tactile, rotations, soins/pause/abandon et stockage refusé, sans erreur JavaScript ni ressource en échec. Il exerce le vrai cycle de rendu et les transitions ; il ne constitue pas quinze parties intégrales ni une mesure de performance sur GPU physique. Le dernier correctif cosmétique est contrôlé séparément après cette matrice.

## Références et limites

- Les 200 fiches principales, 60 crossovers et 300 rencontres sont des dossiers. Les simulations réemploient des archétypes existants avec le statut `training_proxy`, sans prétendre à 560 modèles exacts.
- Les tailles du catalogue sans cote primaire vérifiée restent `catalogue_estimate`, avec axe d'origine non précisé. Une échelle cohérente ne certifie pas une reproduction 1:1. Les dimensions contradictoires des grands boss ne sont pas arbitrairement remplacées.
- Les quatre contradictions de source repérées pour Feral, Wolf, Bad Blood et Rook sont corrigées. Les autres entrées gardent leur provenance déclarée, sans prétendre que chaque média primaire a été relu intégralement pendant cette passe.
- Seize recettes disposent de sources physiques accessibles ; vingt-quatre restent des archives signalées faute de matériau correspondant jouable. Les anciennes sauvegardes ayant déjà forgé ces archives restent compatibles : elles conservent leurs objets, mais leur nouvelle fabrication est indisponible. Une espèce générique ne fournit pas automatiquement le matériau d'un individu nommé ou d'une autre franchise.
- Les icônes SVG sont des interprétations d'interface ; leurs contours ne sont pas des tracés officiels certifiés. Les animations, délais d'attaque et agencements jouables restent des choix originaux de ce jeu.
- L'inventaire du dépôt contient 675 modules `*Sector.js` non raccordés au graphe de démarrage. Ils ne sont pas comptés comme niveaux jouables ; les neuf biomes réellement chargés restent le périmètre de cette passe.
- Chromium fonctionne ici avec un rendu logiciel. Les captures, tests automatisés et relectures par agents ne remplacent pas une validation humaine, un mobile physique, un test d'équilibrage exhaustif ou une certification de fidélité cinématographique.

Les artefacts externes au dépôt accompagnent la livraison : comparaison avant/après des proportions, positions mesurées des décors, revue d'interface, résultats JSON et captures ordinateur/mobile. Le rapport de publication distingue le commit GitHub, le déploiement réellement obtenu et l'alias de production.

## Publication Vercel

L'environnement n'a pas de connexion au projet Vercel existant. La CLI 65.9.0 a néanmoins créé un déploiement anonyme temporaire déclaré `READY` par le service ; sa vérification HTTP est refusée par le proxy, car son domaine `*.tmp.now` n'est pas encore autorisé. Cette URL expire au bout d'une heure et ne remplace pas l'alias `yautja-apex-hunt.vercel.app`.

Un brouillon de configuration cloud a été enregistré en conservant les domaines existants, avec l'ajout de `*.tmp.now` et d'une exigence de secret personnel `VERCEL_TOKEN` pour `api.vercel.com`. Aucun secret n'a été affiché ou ajouté au dépôt. Le brouillon doit être relu, enregistré puis publié dans les paramètres de l'environnement pour prendre effet ; son enregistrement ne change pas la session en cours et ne prouve pas un déploiement permanent. La livraison ne présente donc pas la production Vercel comme mise à jour sans contrôle supplémentaire de son contenu.
