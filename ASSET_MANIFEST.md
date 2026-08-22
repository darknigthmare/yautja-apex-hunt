# Manifest des assets — Yautja: Apex Hunt

**Date d'inventaire :** 22 août 2026
**Périmètre :** textures OpenAI du chantier de professionnalisation, de la passe props et des vagues contenu 1.3–1.4.
**Provenance commune :** modèle ImageGen intégré OpenAI, créations originales fan-made produites les 21 et 22 août 2026, sans copie d'assets officiels. Les PNG maîtres sont conservés localement comme sources de travail, mais ne sont ni versionnés ni déployés ; les WebP sont les seuls fichiers publics du livrable.

## Registre

| ID | Chemin public runtime | Dimensions | Poids | Usage prévu | État technique |
| --- | --- | ---: | ---: | --- | --- |
| `jungle-ground` | `public/assets/textures/jungle-ground.webp` | 1024×1024 | 367 834 octets | terrain de jungle | présent et décodé par Sharp |
| `jungle-bark` | `public/assets/textures/jungle-bark.webp` | 1024×1024 | 277 172 octets | troncs, racines, perchoirs | présent et décodé par Sharp |
| `hive-resin` | `public/assets/textures/hive-resin.webp` | 1024×1024 | 276 024 octets | sol et parois de ruche | présent et décodé par Sharp |
| `ryushi-sand` | `public/assets/textures/ryushi-sand.webp` | 1024×1024 | 369 990 octets | sol désertique | présent et décodé par Sharp |
| `yautja-alloy` | `public/assets/textures/yautja-alloy.webp` | 1024×1024 | 223 554 octets | hub, forge et props technologiques | présent et décodé par Sharp |
| `yautja-stone` | `public/assets/textures/yautja-stone.webp` | 1024×1024 | 166 610 octets | arène et architecture | présent et décodé par Sharp |
| `trophy-bone` | `public/assets/textures/trophy-bone.webp` | 1024×1024 | 327 186 octets | trophées déverrouillés du hub | présent, bords normalisés et inspection 2×2 validée |
| `yautja-leather-net` | `public/assets/textures/yautja-leather-net.webp` | 1024×1024 | 268 638 octets | filet et cuir de l'armure joueur | présent, bords normalisés et inspection 2×2 validée |
| `xeno-egg-hide` | `public/assets/textures/xeno-egg-hide.webp` | 1024×1024 | 174 686 octets | membrane des œufs facehugger | présent, bords normalisés et inspection 2×2 validée |
| `yautja-skin-mottled` | `public/assets/textures/yautja-skin-mottled.webp` | 1254×1254 | 373 452 octets | peau du joueur, du rival et du Berserker | présent, décodé et intégré au runtime |
| `biomask-etched-alloy` | `public/assets/textures/biomask-etched-alloy.webp` | 1254×1254 | 392 890 octets | 30 variantes de bio-masque, boss et fond de forge | présent, décodé et intégré au runtime |
| `xeno-carapace` | `public/assets/textures/xeno-carapace.webp` | 1254×1254 | 294 436 octets | Reine, Predalien et drones xénomorphes | présent, décodé et intégré au runtime |
| `goliath-armored-hide` | `public/assets/textures/goliath-armored-hide.webp` | 1254×1254 | 479 192 octets | plaques du Goliath Xeno-Akumo | présent, décodé et intégré au runtime |
| `yautja-energy-lattice` | `public/assets/textures/yautja-energy-lattice.webp` | 1254×1254 | 280 154 octets | navettes, conteneurs, hangar et archives UI | présent, décodé et intégré au runtime |
| `hunting-hound-hide` | `public/assets/textures/hunting-hound-hide.webp` | 1254×1254 | 389 920 octets | créatures de chasse du Tracker | présent, décodé et intégré au runtime |
| `genna-deathworld-ground` | `public/assets/textures/genna-deathworld-ground.webp` | 1024×1024 | 374 812 octets | sol minéral et organique du biome Genna | présent, décodé et intégré au runtime |
| `feral-bone-composite` | `public/assets/textures/feral-bone-composite.webp` | 1024×1024 | 343 420 octets | masque, armure et carte de mission du Feral | présent, décodé et intégré au runtime |
| `stargazer-tactical-composite` | `public/assets/textures/stargazer-tactical-composite.webp` | 1024×1024 | 233 692 octets | humains, synthétiques et traqueur thermique | présent, décodé et intégré au runtime |
| `deathworld-alien-flora` | `public/assets/textures/deathworld-alien-flora.webp` | 1024×1024 | 344 858 octets | flore prédatrice et traqueur organique de Genna | présent, décodé et intégré au runtime |

**Poids public total vérifié : 5 958 520 octets.** Les six matières de décor initiales ont été converties avec Sharp en WebP 1024×1024. Les trois matières de props 1024×1024 ont été normalisées par quadrants miroir. La vague 1.3 ajoute six sorties WebP 1254×1254 ; la vague 1.4 ajoute quatre sorties WebP 1024×1024. Les dix-neuf fichiers ont été décodés et leurs dimensions/poids relevés avant release.

Les quinze textures de la 1.3 ont été chargées sans erreur dans Chromium et contrôlées sur la production correspondante. Les quatre matières 1.4 sont intégrées au biome Genna, au Feral, aux unités humaines et à la faune ; leur contrôle navigateur et HTTP est consigné dans le rapport QA de la release. La répétition et le contraste doivent encore être jugés sur plusieurs écrans physiques, notamment avec GPU modeste.

## Restrictions communes

Chaque image exclut : texte, logo, élément d'interface, watermark, signature, collage, key art, personnage, marque ou symbole officiel reconnaissable. Les matières doivent rester originales et génériques au fan game.

## Convention de nommage

- noms minuscules en kebab-case ;
- fonction et biome explicites ;
- pas de version dans le nom public courant ;
- PNG maîtres locaux conservés comme sources de travail, exclus du versionnement et du déploiement ;
- variantes publiques runtime en WebP ;
- chemin public stable sous `/assets/textures/`.

## Contrôle avant intégration

Pour chaque fichier :

1. **Validé :** inspection visuelle des PNG maîtres à leur définition native ;
2. **Partiel :** mosaïque 2×2 validée pour les trois matières de props ; contrôle physique multi-écran encore ouvert ;
3. **Validé sur les PNG maîtres :** absence de texte et de marques protégées ;
4. **Validé :** dimensions, format, poids individuel et poids total des dix-neuf WebP ;
5. **Validé :** inspection visuelle des six nouvelles matières OpenAI et contrôle des neuf matières précédentes ;
6. **Validé pour la 1.3 :** chargement Chromium et HTTP 200 des six nouveaux chemins publics ;
7. **Validé dans le code :** le chargeur applique un matériau de fallback si un asset échoue ;
8. consigner les résultats runtime dans `QA_REPORT.md`.

## Publication et droits

Ces assets sont destinés au fan game et ne transfèrent aucun droit sur les franchises Predator ou Alien. Aucun asset officiel n'a été demandé comme source à copier. L'utilisateur a explicitement autorisé le push GitHub et le déploiement Vercel le 22 août 2026 ; la publication a été réalisée après validation des gates de release.
