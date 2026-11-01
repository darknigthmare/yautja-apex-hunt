import { HUNT_DEFINITIONS } from '../data/GameConfig.js';

// Only these physically rendered species have a matching material definition.
// Runtime must harvest an actual defeated body before recording its source ID.
export const PHYSICAL_NPC_TROPHY_SOURCE_IDS = Object.freeze(['xeno_drone', 'xeno_warrior', 'xeno_runner']);
const physicalNpcSourceIds = new Set(PHYSICAL_NPC_TROPHY_SOURCE_IDS);

/**
 * Physical specimen sources are explicit IDs, never a fuzzy trophy-name match.
 * A collected specimen supplies one usable material unit. Quantities such as ten
 * skulls, five tails or twelve vertebrae require that many collected units.
 * Archive/holographic simulations only advance records, never material stocks.
 */
const RECIPE_REFERENCES = Object.freeze({
  "craft_shield_xeno_warrior": {
    "trophySourceIds": [
      "xeno_warrior",
      "grid_alien"
    ],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_xeno_warrior"
    ],
    "materialLabel": "Carapace Céphalique de Guerrier Xénomorphe",
    "availabilityReason": "Carapace de guerrier physique; collecte à raccorder."
  },
  "craft_shield_xeno_queen": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_queen_mother_supreme"
    ],
    "materialLabel": "Crête Dorée de la Reine-Mère Suprême",
    "availabilityReason": "Reine-Mère Suprême spécifique absente; candidate xeno_queen seulement après révision explicite de cet ingrédient."
  },
  "craft_shield_kalisk_bone": {
    "trophySourceIds": [
      "kalisk"
    ],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_kalisk_apex"
    ],
    "materialLabel": "Plastron Osseux Adaptatif de Kalisk",
    "availabilityReason": "Plastron/carapace du Kalisk réellement rendu."
  },
  "craft_shield_engineer_obsidian": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_engineer_biomorph_guardian"
    ],
    "materialLabel": "Plastron en Obsidienne Vivante d'Ingénieur Altéré",
    "availabilityReason": "Aucun Ingénieur altéré physique; une simulation proxy ne fournit pas son plastron."
  },
  "craft_weapon_tail_blade_glaive": {
    "trophySourceIds": [
      "xeno_drone",
      "xeno_warrior",
      "grid_alien"
    ],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_xeno_warrior",
      "prey_xeno_drone_1979"
    ],
    "materialLabel": "Pointe Caudale Barbelée de Xénomorphe",
    "availabilityReason": "Dard caudal de xénomorphe physique; vérifier queue prélevée utilisable."
  },
  "craft_weapon_cleaner_spinal_whip": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [],
    "materialLabel": "Vertèbres Caudales de Xénomorphe Concasseur",
    "availabilityReason": "Concasseur absent; Wolf porte un fouet mais ne fournit pas le rachis spécifique demandé."
  },
  "craft_weapon_praetorian_wrist_scythe": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_xenomorph_ravager_blades"
    ],
    "materialLabel": "Faux Chitinique Antérieure de Ravageur (1.2m)",
    "availabilityReason": "Aucun Prétorien/Ravageur physique."
  },
  "craft_weapon_queen_spine_harpoon": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_red_queen_hive_matriarch"
    ],
    "materialLabel": "Plaque Céphalique Écarlate de la Reine Rouge",
    "availabilityReason": "La Reine Rouge de Genocide ne correspond pas au boss Reine générique."
  },
  "craft_mask_xeno_jaw_berserker": {
    "trophySourceIds": [
      "xeno_warrior",
      "grid_alien"
    ],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_xeno_warrior"
    ],
    "materialLabel": "Mandibule Inférieure de Xénomorphe Épineuse",
    "availabilityReason": "Mâchoire de guerrier physique; confection originale, sans prouver que la mâchoire de Berserker est xénomorphe."
  },
  "craft_mask_goliath_bone": {
    "trophySourceIds": [
      "goliath"
    ],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_goliath_akumo"
    ],
    "materialLabel": "Corne Frontale de Goliath Xeno-Akumo",
    "availabilityReason": "Corne de Goliath physique; ce boss ne fournit pas de matériau de Vy’drach/Rhynth/Ingénieur."
  },
  "craft_mask_broken_tusk_rhynth": {
    "trophySourceIds": [
      "rhynth_titan"
    ],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_rhynth_titan"
    ],
    "materialLabel": "Corne de Rhynth Hexapode de Ryushi",
    "availabilityReason": "Corne du Rhynth physique; attribution précise du masque à Dachande reste une adaptation."
  },
  "craft_mask_engineer_astrolabe": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_engineer_dreadnought_architect"
    ],
    "materialLabel": "Diadème Stellaire d'Architecte Suprême",
    "availabilityReason": "Aucun Architecte/Ingénieur Suprême physique."
  },
  "craft_armor_queen_carapace_cuirass": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [],
    "materialLabel": "Crête Chitinique Dorsale de Matriarche Primordiale",
    "availabilityReason": "Matriarche Primordiale/Female War spécifique absente; candidate xeno_queen seulement après révision de cette exigence."
  },
  "craft_armor_drone_chitin_greaves": {
    "trophySourceIds": [
      "xeno_drone"
    ],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_xeno_drone_1979"
    ],
    "materialLabel": "Chitine Brute de Drone Xénomorphe",
    "availabilityReason": "Chitine du drone physique; collecte à raccorder."
  },
  "craft_armor_vydrach_sky_cloak": {
    "trophySourceIds": [
      "vydrach_prime"
    ],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_vydrach_prime"
    ],
    "materialLabel": "Membrane Alaire de Vy'drach Céleste (16m)",
    "availabilityReason": "Membrane du Vy’drach ailé physique; jamais substituer Goliath."
  },
  "craft_armor_weyland_titanium_harness": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_synthetic_combat_mech_t4"
    ],
    "materialLabel": "Module de Commande Tactique Weyland MK IV",
    "availabilityReason": "Pas de mécha/exosquelette Weyland MK IV; synthétique de combat différent."
  },
  "craft_banner_xeno_queen_crest": {
    "trophySourceIds": [
      "xeno_queen"
    ],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_xeno_queen_matriarch"
    ],
    "materialLabel": "Crâne Osseux de Reine Xénomorphe",
    "availabilityReason": "Crâne de Reine générique réellement affrontée."
  },
  "craft_banner_broken_tusk_machiko": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [],
    "materialLabel": "Bio-Masque Marqué du Sang Acide de Dachande",
    "availabilityReason": "Dachande et son masque marqué par Machiko non rendus; Bad Blood est une autre source."
  },
  "craft_totem_multiverse_challenger": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [],
    "materialLabel": "Trophée d'Anomalie Multivers Majeure",
    "availabilityReason": "Anomalies seulement simulées: pas de trophées matériels de ces univers."
  },
  "craft_totem_ancestral_5_scales": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [],
    "materialLabel": "Ensemble des 5 Trophées Paliers (Géant à Minuscule)",
    "availabilityReason": "Exige cinq gabarits de trophées physiques qualifiés; aucun unique contrat/proxy ne satisfait cet ensemble."
  },
  "craft_shield_xeno_crusher": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [],
    "materialLabel": "Bouclier Céphalique Balistique en Corne de Crusher",
    "availabilityReason": "Aucun Crusher physique."
  },
  "craft_shield_praetorian_crest": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [],
    "materialLabel": "Crête Étoilée Épaisse de Prétorien de Ruche",
    "availabilityReason": "Aucun Prétorien physique."
  },
  "craft_shield_skynet_hk_alloy": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [],
    "materialLabel": "Châssis de Blindage HK-Tank Lourd de Skynet",
    "availabilityReason": "HK-Tank simulé; pas de blindage réel collectable."
  },
  "craft_shield_mgalekgolo_carapace": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [],
    "materialLabel": "Plaque de Bouclier d'Alliage Covenant de Chasseur",
    "availabilityReason": "Mgalekgolo simulé; pas de bouclier réel collectable."
  },
  "craft_weapon_xeno_mandible_tomahawk": {
    "trophySourceIds": [
      "xeno_warrior",
      "grid_alien"
    ],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_xeno_warrior"
    ],
    "materialLabel": "Mandibule Inférieure Dentelée de Xénomorphe Épineuse",
    "availabilityReason": "Mâchoire de guerrier physique; assemblage original."
  },
  "craft_weapon_runner_tail_scythe": {
    "trophySourceIds": [
      "xeno_runner"
    ],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_xeno_runner_dog_alien"
    ],
    "materialLabel": "Pointe Caudale Fuselée de Runner de Fiorina",
    "availabilityReason": "Queue de Runner physique générique; ne prouve pas un individu précis de Fiorina."
  },
  "craft_weapon_acid_flail_vertebrae": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [],
    "materialLabel": "Glande Acide Dorsale et Vertèbres de Guerrier",
    "availabilityReason": "Guerrier au sang acide présent mais prélèvement de glande dorsale spécifique non documenté; candidate xeno_warrior après révision matière."
  },
  "craft_weapon_mgalekgolo_fuel_cannon": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [],
    "materialLabel": "Bobine de Canon à Combustible de Chasseur Covenant",
    "availabilityReason": "Aucun Chasseur Covenant physique ni canon collectable."
  },
  "craft_mask_xeno_crest_matriarch": {
    "trophySourceIds": [
      "xeno_queen"
    ],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_xeno_queen_matriarch"
    ],
    "materialLabel": "Fragment de Crête Dorée de Reine Xénomorphe",
    "availabilityReason": "Fragment de crête de Reine physique; dorure attribuable à la confection, sans inventer une espèce dorée."
  },
  "craft_mask_xeno_skull_dome": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [],
    "materialLabel": "Calotte Lisse Translucide de Drone Big Chap",
    "availabilityReason": "Big Chap 1979 absent; candidate xeno_drone seulement après recette générique assumée."
  },
  "craft_mask_crusher_bone_visor": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [],
    "materialLabel": "Plaque Frontale de Crusher de Sevastopol",
    "availabilityReason": "Aucun Crusher physique; source Sevastopol non justifiée."
  },
  "craft_mask_cyber_ed209_optics": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [],
    "materialLabel": "Processeur Vocal et Optique OCP ED-209",
    "availabilityReason": "ED-209 simulé; aucune optique OCP réelle collectable."
  },
  "craft_armor_xeno_ribcage_vest": {
    "trophySourceIds": [
      "xeno_warrior",
      "grid_alien"
    ],
    "requiredTrophyCount": 1,
    "referencePreyIds": [
      "prey_xeno_warrior"
    ],
    "materialLabel": "Cage Thoracique Complète de Guerrier Xénomorphe",
    "availabilityReason": "Cage thoracique du guerrier physique; assemblage original."
  },
  "craft_armor_praetorian_pauldrons": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [],
    "materialLabel": "Plaques d'Épaules en Chitine Cornée de Prétorien",
    "availabilityReason": "Aucun Prétorien physique."
  },
  "craft_armor_tail_vertebrae_belt": {
    "trophySourceIds": [
      "xeno_drone",
      "xeno_warrior",
      "grid_alien"
    ],
    "requiredTrophyCount": 12,
    "referencePreyIds": [
      "prey_xeno_warrior",
      "prey_xeno_drone_1979"
    ],
    "materialLabel": "Série de 12 Vertèbres Caudales Articulées d'Alien",
    "availabilityReason": "Vertèbres physiques; stock de douze vertèbres requis, pas douze victoires sans qualification."
  },
  "craft_armor_cyberdemon_cuirass": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [],
    "materialLabel": "Plaque Thoracique d'Argent et de Métal du Cyberdemon",
    "availabilityReason": "Cyberdemon uniquement simulé; aucune carapace UAC réelle collectable."
  },
  "craft_banner_hive_conquest_spire": {
    "trophySourceIds": [
      "xeno_warrior",
      "grid_alien"
    ],
    "requiredTrophyCount": 10,
    "referencePreyIds": [
      "prey_xeno_warrior"
    ],
    "materialLabel": "10 Crânes Céphaliques de Guerriers Xénomorphes",
    "availabilityReason": "Dix crânes physiques distincts à compter/consommer; une Reine ne donne pas dix guerriers."
  },
  "craft_banner_tail_trophy_flag": {
    "trophySourceIds": [
      "xeno_drone",
      "xeno_warrior",
      "grid_alien"
    ],
    "requiredTrophyCount": 5,
    "referencePreyIds": [
      "prey_xeno_warrior",
      "prey_xeno_drone_1979"
    ],
    "materialLabel": "5 Queues Complètes à Dard Épineux d'Aliens",
    "availabilityReason": "Cinq queues physiques utilisables distinctes à compter/consommer."
  },
  "craft_totem_matriarch_throne": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [],
    "materialLabel": "Squelette Intact de Crête et Colonne de Reine Mère",
    "availabilityReason": "Reine-Mère de Female War absente, collecte squelette entier non implémentée; candidate Reine générique seulement après révision."
  },
  "craft_totem_multiverse_titans": {
    "trophySourceIds": [],
    "requiredTrophyCount": 1,
    "referencePreyIds": [],
    "materialLabel": "Trophées de Vainqueur d'Anomalie Géante (HK-Tank, Scarab, Cyberdemon)",
    "availabilityReason": "HK/Scarab/Cyberdemon simulés. HK4.5m et Cyberdemon5.5m ne sont pas GEANT au barème >=8m."
  }
});

/** A source citation describes inspiration; recipes and effects are original. */
export function normalizeCraftRecipeReference(recipe) {
  const reference = RECIPE_REFERENCES[recipe?.id];
  // A listed species supplies stock only through a physical harvesting
  // interaction; archive records and unlisted NPC types are never alternatives.
  const candidates = reference?.trophySourceIds ?? [];
  const trophySourceIds = candidates.filter(id => Object.prototype.hasOwnProperty.call(HUNT_DEFINITIONS, id) || physicalNpcSourceIds.has(id));
  const materialLabel = reference?.materialLabel ?? recipe?.requiredTrophy ?? 'Matériau non documenté';
  return {
    trophySourceIds: [...trophySourceIds],
    requiredTrophyCount: reference?.requiredTrophyCount ?? 1,
    referencePreyIds: [...(reference?.referencePreyIds ?? [])],
    materialLabel,
    canonicalMaterialLabel: materialLabel,
    availabilityReason: !trophySourceIds.length && candidates.length
      ? 'Espèce présente dans le monde ; prélèvement physique de ce matériau non disponible.'
      : reference?.availabilityReason ?? 'Aucune source physique documentée pour ce matériau.',
    sourceStatus: 'original_adaptation',
    fidelityVerified: false,
    materialAvailability: trophySourceIds.length ? 'physical_hunt' : 'archive_only',
  };
}
