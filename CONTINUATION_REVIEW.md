# Reprise de la cohérence et des graphismes — 2 novembre 2026

Base : GitHub `master` à `3cbe886`, sans modification locale préexistante. La branche a été récupérée avant intervention. La source documentée de chaque élément du catalogue reste la référence ; les modèles procéduraux et les dimensions estimées ne sont pas présentés comme des répliques 1:1 certifiées.

## Corrections fonctionnelles

- **Portée de mêlée des grandes cibles.** La collision du chasseur maintenait ses pieds à plus de 8,5 unités de la racine du Rhynth, du Vydrach, du Roi et du Kalisk ; les lames standard ne pouvaient donc jamais les atteindre normalement. La portée est désormais vérifiée depuis la hauteur de frappe vers un vrai triangle visible, avec rejet rapide par sous-mesh. Les espaces vides entre appendices, parties trop hautes et géométries masquées restent hors portée. Le bouclier directionnel et le recul gardent la position de l'attaquant comme contexte ; le contact de surface sert au VFX.
- **Familles de dégâts.** Les tirs énergétiques des synthétiques ne deviennent plus des balles en traversant le contrôleur du jeu. Les vingt dangers statiques indiquent aussi leur famille — acide, thermique, énergie, plasma ou générique — préservée jusqu'aux résistances équipées. Les recettes physiques ne reçoivent pas de nouvelles compétences inventées ; les anciens objets archivés équipés restent compatibles.
- **Consoles physiques du croiseur.** Chacun des quinze piédestaux de contrat prépare maintenant sa propre cible depuis l'interaction dans le monde, en conservant l'étape obligatoire du paquetage. Les dix stations historiques restent accessibles, soit vingt-cinq interactions. Les trois piédestaux auparavant traversables ont un collider ; le total du croiseur passe de 87 à 90. Les approches sont contrôlées avec la vraie capsule du joueur ; l'interaction ne traverse plus les étages.
- **Dangers et relief.** Sur 720 positions au sol des neuf biomes, les six faux négatifs des pentes disparaissent. Les frontières des vingt zones épousent le terrain : 2 166 sommets auparavant enfouis deviennent visibles, sans triangle, draw ou collider supplémentaire. Les limites dynamiques ne pulsent plus au-delà de leur rayon de gameplay.
- **Pannes superposées.** Deux blackouts ne multiplient plus l'assombrissement et ne restaurent plus la lumière trop tôt ou à une mauvaise intensité. La lumière demeure atténuée tant qu'un événement reste actif puis revient à sa valeur initiale, y compris après changement de biome.
- **Recherche et clavier.** Les 200 fiches et les 60 scénarios disposent d'une recherche par mots, insensible à la casse et aux accents, d'un compteur, d'un état vide et d'un effacement. La requête reste appliquée après les filtres de taille/univers. La sélection d'un crossover ne remplace plus ses cartes au tick suivant : le focus clavier et `aria-pressed` restent cohérents.

## Reprise visuelle

Les humains remplacent le torse cubique et les membres uniformes par une cage thoracique, une taille, un bassin, des articulations et des équipements arrondis. Les drones et guerriers reçoivent une cage plus étroite, des membres fuselés, des pieds et doigts, une queue courbe segmentée et un raccord de mâchoire revu. Les dimensions de 5,4 / 6,3 / 6,9 unités restent alignées sur l'échelle de trois unités par mètre.

Les comparaisons utilisent les vrais modèles et matières dans la lumière du jeu, une caméra fixe et une graine déterministe, en qualité Haute. Aucun éclairage de studio ni retouche des captures. Six angles rapprochés avant/après et le trio chasseur/humain/drone complètent les mesures. Les images intermédiaires ont servi à corriger les raccords et proportions qui restaient mauvais malgré des tests de géométrie verts.

L'humain générique final représente 6 540 triangles et douze draws proches / deux distants ; sa hauteur reste à 5,4 unités, sa largeur passe de 2,667 à 1,963. Sept armes génériques ont une vraie crosse, carcasse, garde-main, canon, chargeur et gâchette fusionnés dans leur draw existant ; les armes spécialisées et historiques conservent leurs modèles. Le total des dix-huit humanoïdes passe de 156 540 à 109 582 triangles (−30 %). Le drone représente 9 442 triangles avec treize / deux draws et le guerrier 9 417 avec dix-sept / trois, contre vingt-six draws proches auparavant pour le guerrier.

## Validation de la version finale

**1 869 tests réussissent, zéro échec et zéro ignoré**, après les derniers changements de géométrie et de contexte de bouclier. Le build réussit sans avertissement au seuil inchangé de 550 ko ; son plus gros fichier JavaScript représente 541 542 octets. L'audit des dépendances de production indique zéro vulnérabilité.

Le contrôle navigateur ciblé valide les 17 résultats pour « reine », deux résultats après le filtre de petit gabarit testé, le focus encore présent après 1,25 seconde sur un dossier sélectionné, la recherche à 320 px sans débordement et l'ouverture du paquetage du Rhynth par la touche E depuis sa console physique. Le contrôle séparé des proportions, de la simulation et du prélèvement unique avec rechargement réussit aussi, sans erreur JavaScript ni ressource en échec. Le parcours complet de rendu des quinze contrats est enregistré séparément ; ses horodatages et son résultat final figurent dans les artefacts, sans le confondre avec des parties complètes.

## Reproduire

```bash
npm ci
npm test -- --test-concurrency=4
npm run build
npm audit --omit=dev
npm run test:browser
npm run test:coherence
QA_BASE_URL=http://127.0.0.1:4173 npm run test:catalogue
QA_BASE_URL=http://127.0.0.1:4173 npm run test:npc-visuals
```

Les deux derniers contrôles demandent un serveur de preview déjà lancé, par exemple `npm run preview -- --host 127.0.0.1 --port 4173`. `QA_ARTIFACT_DIR` choisit leur dossier de résultats. Le mode `QA_BASELINE=1` du contrôle catalogue capture une version témoin sans exiger les nouveaux champs. Les résultats finaux, horodatages et URLs de livraison sont enregistrés avec les artefacts de cette passe.

## Portée et limites

Cinq agents ont travaillé en parallèle. Les tests exécutent la vraie logique de collision, d'attaque, de résistance, de sauvegarde et de contrôle DOM ; aucun testeur humain n'est revendiqué. Chromium utilise un rendu logiciel et un mobile émulé, sans mesure FPS sur GPU matériel. Les rendus de contrats ne représentent pas quinze parties complètes.

Les personnages restent procéduraux ; cette passe n'ajoute pas de rig squelettique aux PNJ ni de réplique d'acteur. Les neuf biomes jouables sont améliorés sans compter les 675 modules Sector non raccordés comme des niveaux supplémentaires. Les 560 dossiers et leurs modèles d'entraînement conservent les limites de provenance décrites dans `COHERENCE_REVIEW.md`. En particulier, une référence déclarée ne prouve pas l'existence d'une œuvre publiée pour chaque crossover.

La publication doit être confirmée sur son URL et son contenu réel. L'état d'un ancien déploiement, un build local ou un push GitHub ne suffit pas. La CLI de cette session est déconnectée du projet Vercel existant ; l'intégration GitHub et, si nécessaire, la préversion temporaire sont contrôlées séparément.
