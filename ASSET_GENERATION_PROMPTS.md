# Prompts de génération des textures

**Outil :** modèle ImageGen intégré OpenAI
**Dates :** 21–22 août 2026
**Mode :** génération bitmap originale, sans image officielle de référence
**Usage :** textures de décor et de props pour le fan game Yautja: Apex Hunt

Les textes ci-dessous sont les formulations de production fidèles aux prompts employés. Leur invariant commun est : texture de matière raccordable, vue orthographique de surface, éclairage uniforme, création originale fan-made, sans texte, logo, UI, watermark, signature, collage, key art, personnage ou symbole officiel.

## `jungle-ground`

> Texture carrée raccordable de sol de jungle extraterrestre sombre : boue noire humide, mousse dense mais irrégulière, petits débris végétaux et racines affleurantes. Vue orthographique de matière, éclairage diffus uniforme, relief lisible sans ombre directionnelle forte, palette brun-noir et vert désaturé. Création originale fan-made de science-fiction, sans créature, texte, logo, UI, watermark, collage ni asset officiel.

**Destination runtime après conversion :** `public/assets/textures/jungle-ground.webp`

## `jungle-bark`

> Texture carrée raccordable d'écorce extraterrestre : fibres sombres épaisses et tressées, rainures organiques verticales, rares touches de lichen sarcelle, matière humide mais non brillante. Vue orthographique, lumière uniforme, détail adapté à un tronc de jeu 3D. Création originale fan-made, sans visage, anatomie animale, texte, logo, UI, watermark, collage ni symbole officiel.

**Destination runtime après conversion :** `public/assets/textures/jungle-bark.webp`

## `hive-resin`

> Texture carrée raccordable de résine de ruche biomécanique sombre : côtes arquées, membranes fibreuses, rainures et reflets humides contrôlés, noir graphite et brun profond. Surface abstraite et originale, aucune anatomie de créature identifiable, aucune reproduction de décor de film. Vue orthographique, lumière diffuse uniforme, sans texte, logo, UI, watermark, collage ni key art.

**Destination runtime après conversion :** `public/assets/textures/hive-resin.webp`

## `ryushi-sand`

> Texture carrée raccordable de sable extraterrestre couleur rouille : grain minéral varié, fines inclusions ferriques, petites rides de vent et relief doux. Vue orthographique, éclairage uniforme, palette ocre sombre et rouge brun, aucune empreinte ni objet. Création originale fan-made, sans texte, logo, UI, watermark, collage ou asset officiel.

**Destination runtime après conversion :** `public/assets/textures/ryushi-sand.webp`

## `yautja-alloy`

> Texture carrée raccordable d'alliage extraterrestre ancien : gunmetal sombre, bronze patiné, plaques imbriquées et canaux techniques abstraits, micro-rayures et usure cohérente. Aucun glyphe, alphabet, emblème ou symbole officiel ; aucune reproduction d'un accessoire de film. Vue orthographique de matériau, éclairage uniforme, sans texte, logo, UI, watermark, collage ni personnage.

**Destination runtime après conversion :** `public/assets/textures/yautja-alloy.webp`

## `yautja-stone`

> Texture carrée raccordable de pierre basaltique extraterrestre : roche noire dense, pores fins, coutures métalliques rares et coupes géométriques abstraites peu profondes. Aspect monumental ancien, aucun glyphe ou motif officiel, contraste mesuré pour le gameplay. Vue orthographique, lumière diffuse uniforme, création originale fan-made, sans texte, logo, UI, watermark, collage ni key art.

**Destination runtime après conversion :** `public/assets/textures/yautja-stone.webp`

## `trophy-bone`

> Texture carrée raccordable d'ivoire et d'os de trophée extraterrestre ancien : grain dense, fines fissures, patine minérale ocre et usure sèche. Surface de matière abstraite uniquement, sans crâne, dent, anatomie, sang ni sculpture reconnaissable. Vue orthographique, éclairage diffus uniforme, création originale fan-made, sans texte, logo, glyphe, UI, watermark ou symbole officiel.

**Destination runtime après conversion :** `public/assets/textures/trophy-bone.webp`

## `yautja-leather-net`

> Texture carrée raccordable de cuir de chasse noir très usé et de filet technique tressé : lanières mates, cordage sombre, petites attaches métalliques abstraites, poussière et rayures cohérentes. Vue orthographique de matière, lumière uniforme, aucun vêtement complet ni silhouette. Création originale fan-made, sans texte, logo, glyphe, UI, watermark, personnage ou accessoire officiel copié.

**Destination runtime après conversion :** `public/assets/textures/yautja-leather-net.webp`

## `xeno-egg-hide`

> Texture carrée raccordable de membrane organique extraterrestre sombre destinée à des œufs : cuir humide plissé, pores fins, nervures souples, bruns noirâtres et reflets vert olive très discrets. Matière abstraite, sans créature, visage, embryon ni anatomie identifiable. Vue orthographique, éclairage uniforme, création originale fan-made, sans texte, logo, UI, watermark, collage ou reproduction de décor de film.

**Destination runtime après conversion :** `public/assets/textures/xeno-egg-hide.webp`

## Critères de rejet

Une génération doit être écartée si elle contient un mot, une signature, une bordure visible, un motif non raccordable dominant, une créature reconnaissable, une interface, un logo, un symbole officiel, une composition en collage ou une copie manifeste d'un visuel existant.

## Traçabilité

Les sorties ImageGen originales sont des PNG maîtres locaux conservés comme sources de travail, mais non versionnés et non déployés. Les six matières de décor du 21 août ont été converties avec Sharp en WebP 1024×1024, qualité 84, effort 6 et `smartSubsample`. Les trois matières de props du 22 août ont reçu une normalisation mécanique par quadrants miroir afin de garantir la continuité exacte des bords, puis une conversion WebP 1024×1024, qualité 84. Cette correction conserve la matière ImageGen mais peut rendre la symétrie plus visible à grande échelle ; ces textures sont donc réservées aux props et surfaces modestes. Le manifest consigne les poids exacts, l'usage et les contrôles de chaque variante. Toute régénération future doit recevoir une date, un motif et une nouvelle entrée de changelog ; elle ne doit pas écraser silencieusement une source approuvée.
