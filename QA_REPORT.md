# Rapport QA — release 1.4.0

**Date :** 22 août 2026
**Statut :** release 1.4.0 validée, poussée sur GitHub et publiée sur la production Vercel, sans défaut P0/P1 connu.
**Production :** <https://yautja-apex-hunt.vercel.app/>
**Source :** <https://github.com/darknigthmare/yautja-apex-hunt>

## Gates de release

| Gate | Résultat vérifié | Couverture |
|---|---:|---|
| Tests Node | **98/98 réussis** | Combat, six boss, huit familles de PNJ, événements, gadgets, équipement, Forge, sauvegarde v4 et migrations v1–v3. |
| Build production | **Vite 8.2.2 réussi** | HTML 21,50 Ko ; CSS 22,79 Ko ; jeu 270,93 Ko ; Three.js 499,39 Ko. Aucun chunk au-dessus de 500 Ko. |
| Sécurité dépendances | **0 vulnérabilité** | `npm audit --audit-level=high`. |
| Qualité Git | **propre** | `git diff --check`, fichiers temporaires exclus et changements de la release uniquement. |
| Chromium desktop | **réussi** | Hub, contrats, Forge, Genna, Feral et états des quatre technologies de terrain. |
| Chromium mobile | **réussi** | Viewport 390×844, largeur document 390 px, aucun débordement horizontal. |
| Console navigateur | **0 erreur** | Aucun défaut de page ; uniquement les messages de connexion Vite en développement. |
| Assets 1.4 | **HTTP 200** | Sol de Genna, flore extraterrestre et composite osseux du Feral chargés pendant la chasse ; composite tactique résolu par le contrat d’assets. |

## Contenu réellement jouable contrôlé

- [x] six contrats : Goliath, Reine Xénomorphe, Bad Blood, Predalien, Berserker et Feral ;
- [x] cinq biomes : jungle, ruche LV-426, Ryushi, domaine de clan et monde mortel de Genna ;
- [x] Feral équipé d’un bio-masque osseux, d’une lance, d’un lance-traits triple et d’un bouclier frontal destructible ;
- [x] charge et estoc télégraphiés, impacts uniques et possibilité de contourner le bouclier par l’arrière ;
- [x] Genna vivant : 28 plantes prédatrices, 14 créatures instanciées, 520 spores, météo et mouvements réduits ;
- [x] huit familles de PNJ : humains, synthétiques, traqueurs thermiques, chiens de chasse, xénomorphes drones et guerriers, grizzlis territoriaux et traqueurs de Genna ;
- [x] quatre technologies accessibles au clavier et au tactile : bouclier de poignet, drone-faucon, shuriken et rugissement d’honneur ;
- [x] événements de niveau à quatre paliers, conteneurs de chasse, navette de reconnaissance et scan visuel nettoyé en victoire comme en défaite ;
- [x] dix armes jouables, quatre classes de chasseur et neuf axes de personnalisation indépendants ;
- [x] galerie de six trophées et progression d’honneur cumulée ;
- [x] sauvegarde v4 transactionnelle, récupération du temporaire le plus récent et migrations v1, v2 et v3.

## Validation visuelle et responsive

Le parcours Chromium a ouvert le vaisseau-mère, affiché les six contrats, sélectionné Genna puis lancé le Feral. Les quatre contrôles tactiles ont produit les états attendus : `ACTIF`, `EN VOL`, `RECHARGE` et `CONSOMMÉ POUR CETTE CHASSE`. Les écrans Contrats et Armurerie restent utilisables en desktop et à 390×844, sans erreur de console ni overlay Vite.

Les dix-neuf textures publiques pèsent **5 958 520 octets**. Les quatre nouvelles matières OpenAI sont des créations originales du projet, exportées en WebP 1024×1024 ; aucun key art officiel n’a été copié.

## Reproduction rapide

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run build
npm.cmd audit --audit-level=high
git diff --check
```

Puis ouvrir la production, entrer dans le vaisseau-mère, sélectionner `MONDE MORTEL DE GENNA` et lancer `AFFRONTER LE FERAL`. Vérifier les touches ou boutons tactiles `B`, `G`, `T`, `R`, puis contrôler la Forge et ses neuf sélecteurs.

## Verdict

La 1.4.0 transforme la passe de contenu en systèmes visibles et jouables : nouvelle chasse, nouveau biome vivant, nouvelles proies, nouveaux gadgets, progression étendue, personnalisation plus profonde et assets originaux intégrés. Les gates automatisés, navigateur, responsive, Git et production sont tous requis avant clôture de la release.
