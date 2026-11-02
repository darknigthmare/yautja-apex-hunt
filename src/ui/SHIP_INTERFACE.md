# Interfaces du croiseur

`ShipNavigationView` et `ShipConsoleView` affichent des projections temporaires au-dessus du vrai croiseur. Elles ne modifient ni le joueur, ni la position, ni la progression. La navigation ne calcule qu'un trajet sélectionné ; le petit repère d'exploration ne relance pas la recherche de chemin.

## Façade HUD

- `setShipInterfaceActionHandler(handler)` reçoit les intentions ci-dessous.
- `showShipNavigation({ hub, player, selectedStationId? })` ouvre le plan, avec destination optionnelle.
- `showShipConsole({ hub, player, station, notice? })` ouvre le poste physique et ses seuls services réels.
- `hideShipInterfaces({ restoreFocus = false })` masque les deux projections.
- `isShipInterfaceOpen()` indique si une projection est ouverte.
- `updateShipHUD({ hub, player, waypointStationId?, route?, visible = true })` actualise le compartiment, le repère et la console ouverte. `visible:false` masque les repères d'exploration, sans empêcher l'actualisation des constantes d'une console.

Les IDs des dialogues sont `ship-navigation-dialog` et `ship-console-dialog`. Les repères sont `ship-zone-hud` et `ship-waypoint-hud`. Le bouton tactile/cliquable `btn-ship-navigation` émet l'action de navigation ; `btn-ship-waypoint-clear` efface le repère.

## Intentions émises vers Game

| Charge utile | Comportement attendu dans Game |
| --- | --- |
| `{ type:'close' }` | Fermer la projection, neutraliser les touches encore pressées et rendre le contrôle au jeu/canvas. |
| `{ type:'navigation' }` | Ouvrir le plan ; ne pas déplacer le joueur. |
| `{ type:'medicomp' }` | Ouvrir le Medicomp portable avec son stock réel, sans restauration de station. |
| `{ type:'waypoint', stationId }` | Enregistrer la destination et reprendre l'exploration avec son itinéraire praticable. `stationId:null` efface le repère. |
| `{ type:'service', stationId, serviceId }` | Vérifier le poste et exécuter le service réel : `contracts`, `loadout`, `armory`, `crafting`, `codex`, `prepare_hunt`, `restore_vitals`, `medical`, `recharge` ou `select_transport_scout/shuttle/pod`. |

L'ouverture d'un poste ne soigne ni ne recharge automatiquement. Le service doit être choisi. Une restauration ou recharge déjà complète est signalée et son bouton est désactivé. La recharge reste accessible si le bouclier est endommagé ou si un système auxiliaire attend sa réinitialisation, même avec une énergie pleine. Les postes de hangar et pods proposent les trois transports définis par `SHIP_TRANSPORTS`, balisés créations originales du jeu ; le choix courant vient de `player.shipServiceState.selectedTransportKind` et reste actualisé par `refresh`.

Si `player.requiresMedicalRecovery` vaut `true`, un bandeau explique le départ suspendu sur la console et le plan. Son bouton émet un `waypoint` vers le vrai poste `cleaner_lab` trouvé dans `hub.getStations()`. Il ne soigne pas et n'efface aucun drapeau. L'état est relu à chaque `refresh`, y compris celui de la navigation, qui n'effectue aucun recalcul de trajet pour cela.

Game conserve la propriété des commandes : suspendre déplacement/interaction pendant le dialogue, neutraliser clavier/manette/tactile à l'ouverture et à la fermeture, sortir du pointer lock à l'ouverture, puis rendre le focus au canvas au retour. Les vues gèrent le cycle Tab/Maj+Tab et Échap dans leur propre dialogue. Leurs boutons fonctionnent également avec les commandes de dialogue/manette existantes.

## Données et trajet

Le plan consomme `hub.getStations()`, `getZones()`, `getDoors()`, `getBounds()` et `getZoneAt(player.position)`. La sélection appelle `getNavigationRoute(player.position, stationId, { radius:1.8 })`. Un trajet utilisable doit porter `status:'ready'`, le même `stationId`, des `points` et une `distanceUnits` finie positive ou nulle. Les unités du monde sont converties en mètres une seule fois, avec la constante partagée trois unités par mètre. Une route inaccessible ou obsolète reste indisponible ; aucune ligne droite de remplacement n'est inventée.

Le registre du joueur affiche dix champs issus du `player` courant : santé, énergie, endurance, crédits d'honneur, rang, honneur cumulé, contrats connus accomplis, directives accomplies, sites découverts et profil du harnais. Les valeurs absentes sont affichées « — ». Les alertes médicales reprennent les vrais états de corrosion et d'hémorragie. Les cinq champs secondaires restent dans un volet dépliable.

Les modèles purs sont exportés pour les tests et les écrans physiques du poste : `getShipPlayerReadout`, `getShipStationServices`, `getShipConsoleModel`, `getShipNavigationModel` et `renderShipNavigationPlan`. Aucun niveau de fidélité canonique 1:1 n'est établi par ces projections originales.

## Exploration et exposés

`showHubTarget()` active le mode `ship-hub-mode` du HUD : les panneaux de combat, gadgets et arsenal sont masqués, les constantes restent compactes, et les repères/commandes du croiseur restent visibles. `setTargetType(huntType)` ou `updateBossStatus` rétablissent le HUD de chasse. Les options, l'aide et les autres dialogues existants restent disponibles.

Les stations `equipment_inspection`, `trophy_inspection` et `contract_inspection` affichent les champs propres de `station.inspection` : label, référence déclarée, représentation, espèce référencée et état de l'exposé. Une référence objet ne lit que des champs propres textuels/numériques autorisés et n'invoque pas ses getters. Une étude non acquise reste une projection ; aucune inspection n'accorde ni objet ni récompense. Les exposés d'équipement accèdent au paquetage et à l'armurerie. Les trophées/contrats accèdent au Codex et peuvent préparer le contrat si son ID est connu. Les stations doivent fournir le `huntId` résolu au contrôleur ; le modèle peut aussi reconnaître `inspection.itemId` pour l'affichage.
