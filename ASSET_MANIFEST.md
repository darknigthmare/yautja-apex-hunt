# Manifest des assets — Yautja: Apex Hunt

**Date d'inventaire :** 22 août 2026
**Périmètre :** textures OpenAI du chantier de professionnalisation et de la passe props.
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

**Poids public total vérifié : 2 451 694 octets.** Les six matières de décor ont été converties avec Sharp en WebP, qualité 84, effort 6 et `smartSubsample`. Les trois matières de props ont été normalisées par quadrants miroir puis encodées en WebP, qualité 84, afin d'assurer la continuité exacte des quatre bords. Les neuf fichiers sont en 1024×1024. L'inspection des nouveaux PNG, des WebP et de leur planche 2×2 a été réalisée par affichage base64 de secours, l'outil `view_image` restant bloqué par une ACL Windows.

Les neuf WebP ont répondu en HTTP 200 dans Chromium au cours des parcours hub, ruche et Ryushi, sans erreur de page. La répétition et le contraste doivent encore être jugés sur plusieurs écrans physiques, notamment avec GPU modeste.

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
2. **Partiel :** mosaïque 2×2 validée pour les trois matières de props ; contrôle encore ouvert pour les six matières de décor ;
3. **Validé sur les PNG maîtres :** absence de texte et de marques protégées ;
4. **Validé :** dimensions, format, poids individuel et poids total des neuf WebP ;
5. **Validé :** conversion des neuf variantes ; décodage Sharp validé pour les six matières de décor et inspection visuelle base64 validée pour les trois matières de props ;
6. **Validé en runtime local :** les neuf matières chargent dans Chromium sans erreur de page ; trophées, armure, œufs et biomes utilisent leurs chemins publics réels ;
7. **Validé dans le code :** le chargeur applique un matériau de fallback si un asset échoue ;
8. consigner les résultats runtime dans `QA_REPORT.md`.

## Publication et droits

Ces assets sont destinés au fan game et ne transfèrent aucun droit sur les franchises Predator ou Alien. Aucun asset officiel n'a été demandé comme source à copier. L'utilisateur a explicitement autorisé le push GitHub et le déploiement Vercel le 22 août 2026 ; la publication reste conditionnée aux gates de release.
