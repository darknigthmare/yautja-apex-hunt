# Rapport QA — release 1.5.0

**Date :** 24 août 2026
**Statut :** release 1.5.0 validée, publiée sur la production Vercel et sans défaut P0/P1 connu.
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

## Validation du classeur de franchise

Le classeur `Encyclopedie_exhaustive_franchise_Predator.xlsx` fourni dans la conversation recense 915 éléments uniques. Il a servi de backlog de contrôle par film et média, pas de source canonique autonome ni d’import automatique. Chaque ajout retenu dans cette passe possède un niveau de provenance, une source et un statut runtime explicites.

Les prochains lots déjà identifiés sont une carte de Gunnison réellement multi-niveaux, des campagnes complètes *Killer of Killers* et *Alien vs. Predator*, puis une faune et une flore de Genna plus variées.

## Reproduction rapide

```powershell
npm.cmd test
npm.cmd run build
npm.cmd audit --audit-level=high
git diff --check
```

Puis ouvrir la production, entrer dans le vaisseau-mère et vérifier :

1. les huit cartes de contrat et les 29 fiches média ;
2. le lancement de Wolf depuis un secteur différent, avec bascule automatique vers LV-426 ;
3. le lancement du Kalisk, avec bascule automatique vers Genna et HUD carapace/noyau ;
4. l’Armurerie, ses 38 masques et les huit variantes Lost Tribe ;
5. le viewport mobile 390×844 sans débordement horizontal.

## Verdict

La 1.5.0 ne se limite pas à ajouter des noms au Codex : Wolf et le Kalisk possèdent leurs propres boucles de combat, états, dangers, points faibles, textures et contrats. La couverture du Lost Tribe et des médias reste clairement séparée par provenance, et la production déployée a franchi les gates automatisés, navigateur, responsive, sécurité, assets et Vercel.
