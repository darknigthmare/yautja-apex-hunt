# Apex Hunt ↔ Alien_base — pont documentaire en lecture seule

Master : `darknigthmare/alien_base#2` (privé) ; publication autorisée des métadonnées du snapshot public `alien-base-public-v1.js`.

Le catalogue existant `MEDIA_COVERAGE_CATALOG` conserve ses **29 œuvres**, leurs sources, la logique de gameplay locale, le statut publié/coupé/crossover et les identifiants existants. Le nouvel objet `MEDIA_COVERAGE_ALIEN_BASE_IDS` associe chaque `work.id` au dossier de même identité dans le master. Le module `AlienBaseRegistry.js` permet aussi d'inspecter les 52 familles d'ennemis, 115 profils, 200 pistes d'armes et 158 cartes TCG, sans les rendre jouables. **Aucun canon universel ou visuel 1:1 n'est validé automatiquement**.

Le référentiel privé conserve les autres contenus originaux Apex séparément jusqu'à leur audit (masques, castes, cosmétiques et bosses). Une PR d'alias requiert une preuve réelle par média et variante ; jamais un rapprochement automatique de noms.

Test ciblé : `node --test tests/alien-base-reference.test.js`. Aucun token ni fetch GitHub privé en runtime. Après fusion, le prochain export public doit rester synchronisé avec le master validé.
