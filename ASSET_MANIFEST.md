# Manifest des assets — Yautja: Apex Hunt

**Date d'inventaire :** 21 août 2026
**Périmètre :** textures OpenAI du chantier de professionnalisation.
**Provenance commune :** modèle ImageGen intégré OpenAI, créations originales fan-made produites le 21 août 2026, sans copie d'assets officiels. Les PNG maîtres sont conservés localement comme sources de travail, mais ne sont ni versionnés ni déployés ; les WebP sont les seuls fichiers publics du livrable.

## Registre

| ID | Chemin public runtime | Dimensions | Poids | Usage prévu | État technique |
| --- | --- | ---: | ---: | --- | --- |
| `jungle-ground` | `public/assets/textures/jungle-ground.webp` | 1024×1024 | 367 834 octets | terrain de jungle | présent et décodé par Sharp |
| `jungle-bark` | `public/assets/textures/jungle-bark.webp` | 1024×1024 | 277 172 octets | troncs, racines, perchoirs | présent et décodé par Sharp |
| `hive-resin` | `public/assets/textures/hive-resin.webp` | 1024×1024 | 276 024 octets | sol et parois de ruche | présent et décodé par Sharp |
| `ryushi-sand` | `public/assets/textures/ryushi-sand.webp` | 1024×1024 | 369 990 octets | sol désertique | présent et décodé par Sharp |
| `yautja-alloy` | `public/assets/textures/yautja-alloy.webp` | 1024×1024 | 223 554 octets | hub, forge et props technologiques | présent et décodé par Sharp |
| `yautja-stone` | `public/assets/textures/yautja-stone.webp` | 1024×1024 | 166 610 octets | arène et architecture | présent et décodé par Sharp |

**Poids public total vérifié : 1 681 184 octets.** Les six fichiers ont été convertis avec Sharp en WebP, qualité 84, effort 6 et `smartSubsample`, puis décodés avec succès par Sharp. Une planche-contact a également été assemblée. L'inspection visuelle des PNG ImageGen originaux avait réussi ; l'outil `view_image` étant bloqué par une ACL Windows, aucune inspection visuelle des WebP finaux n'est revendiquée.

Ces validations techniques ne valent pas certification de release : les six WebP chargent dans Chromium pendant le parcours couvrant le hub et les quatre biomes, mais les raccords de répétition 2×2 restent à juger visuellement sur plusieurs écrans physiques.

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
2. **Restant :** tester visuellement la mosaïque 2×2 des WebP ;
3. **Validé sur les PNG maîtres :** absence de texte et de marques protégées ;
4. **Validé :** dimensions, format, poids individuel et poids total ;
5. **Validé :** conversion WebP et décodage des six variantes avec Sharp ;
6. **Validé en runtime :** le hub, les quatre biomes et les six WebP chargent dans Chromium sans erreur console ;
7. **Validé dans le code :** le chargeur applique un matériau de fallback si un asset échoue ;
8. consigner les résultats runtime dans `QA_REPORT.md`.

## Publication et droits

Ces assets sont destinés au fan game et ne transfèrent aucun droit sur les franchises Predator ou Alien. Aucun asset officiel n'a été demandé comme source à copier. Le push GitHub et le déploiement Vercel attendent l'autorisation explicite de l'utilisateur.
