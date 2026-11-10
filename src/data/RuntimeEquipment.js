import { YautjaSkinsDatabase } from './YautjaLoreDatabase.js';
import {
  ARMOR_ACCENTS,
  ARMOR_PALETTES,
  DREAD_PALETTES,
  MASK_VARIANTS,
  SKIN_PALETTES,
} from './YautjaContentCatalog.js';

export const DEFAULT_CUSTOMIZATION = Object.freeze({
  armorPresetId: 'jungle_1987',
  maskId: 'mask_jungle_hunter_1987',
  skinColorId: 'skin_olive_classique',
  dreadColorId: 'dread_obsidienne',
  armorColorId: 'armor_gunmetal',
  armorAccentColorId: 'accent_honneur',
  hunterClassId: 'class_hunter',
  dreadStyleId: 'dread_style_classic',
  armorFinishId: 'finish_hunter_worn',
  warpaintId: 'warpaint_none',
});

// Les classes influencent réellement les statistiques ; elles ne sont pas de simples apparences.
export const HUNTER_CLASSES = Object.freeze([
  Object.freeze({ id: 'class_hunter', name: 'Hunter · équilibré', maxHealth: 100, maxEnergy: 100, maxStamina: 100, moveSpeed: 16, sprintSpeed: 26, meleeMultiplier: 1, energyRegen: 8, description: 'Profil polyvalent pour toutes les chasses.' }),
  Object.freeze({ id: 'class_scout', name: 'Scout · reconnaissance', maxHealth: 85, maxEnergy: 115, maxStamina: 120, moveSpeed: 18, sprintSpeed: 29, meleeMultiplier: 0.9, energyRegen: 10, description: 'Plus mobile et endurant, mais moins résistant au contact.' }),
  Object.freeze({ id: 'class_berserker', name: 'Berserker · assaut', maxHealth: 130, maxEnergy: 85, maxStamina: 105, moveSpeed: 14.5, sprintSpeed: 23, meleeMultiplier: 1.25, energyRegen: 6.5, description: 'Puissance et santé élevées au prix de la mobilité et de l’énergie.' }),
  Object.freeze({ id: 'class_elder', name: 'Elder · maître de chasse', maxHealth: 110, maxEnergy: 125, maxStamina: 95, moveSpeed: 15.5, sprintSpeed: 25, meleeMultiplier: 1.1, energyRegen: 9, description: 'Maîtrise technologique et précision soutenue.' }),
  Object.freeze({ id: 'class_tracker', name: 'Tracker · pisteur', maxHealth: 95, maxEnergy: 105, maxStamina: 115, moveSpeed: 17, sprintSpeed: 27, meleeMultiplier: 0.95, energyRegen: 9.5, description: 'Traque mobile pensée pour maintenir le contact avec une proie qui fuit.', sourceTier: 'ORIGINAL', basisTier: 'SCREEN', sources: Object.freeze(['predators2010']), implementationOriginal: true }),
  Object.freeze({ id: 'class_falconer', name: 'Falconer · éclaireur aérien', maxHealth: 90, maxEnergy: 130, maxStamina: 110, moveSpeed: 17.5, sprintSpeed: 28, meleeMultiplier: 0.92, energyRegen: 11, description: 'Réserve énergétique et mobilité élevées pour les technologies de reconnaissance.', sourceTier: 'ORIGINAL', basisTier: 'SCREEN', sources: Object.freeze(['predators2010']), implementationOriginal: true }),
  Object.freeze({ id: 'class_cleaner', name: 'Cleaner · confinement', maxHealth: 120, maxEnergy: 115, maxStamina: 90, moveSpeed: 15, sprintSpeed: 24, meleeMultiplier: 1.15, energyRegen: 8.5, description: 'Profil robuste destiné aux contaminations et aux combats d’attrition.', sourceTier: 'ORIGINAL', basisTier: 'AVP_SCREEN', sources: Object.freeze(['avpRequiem2007']), implementationOriginal: true }),
  Object.freeze({ id: 'class_fugitive', name: 'Fugitive · récupération', maxHealth: 105, maxEnergy: 120, maxStamina: 110, moveSpeed: 17, sprintSpeed: 27.5, meleeMultiplier: 1.05, energyRegen: 10, description: 'Profil adaptable taillé pour reprendre une technologie confisquée en territoire hostile.', sourceTier: 'ORIGINAL', basisTier: 'SCREEN', sources: Object.freeze(['thePredator2018']), implementationOriginal: true }),
  Object.freeze({ id: 'class_city_stalker', name: 'City Stalker · chasse de chaleur', maxHealth: 100, maxEnergy: 118, maxStamina: 112, moveSpeed: 17.2, sprintSpeed: 27.8, meleeMultiplier: 1.02, energyRegen: 10.2, description: 'Profil mobile optimisé pour les toits, la fumée et les signatures thermiques saturées.', sourceTier: 'ORIGINAL', basisTier: 'SCREEN', sources: Object.freeze(['predator2']), implementationOriginal: true }),
  Object.freeze({ id: 'class_ritual_initiate', name: 'Ritual Initiate · jeune sang', maxHealth: 108, maxEnergy: 106, maxStamina: 118, moveSpeed: 16.6, sprintSpeed: 27.2, meleeMultiplier: 1.08, energyRegen: 8.6, description: 'Profil original de jeune chasseur préparé à l’épreuve xénomorphe : endurance, mêlée et réserve équilibrées.', sourceTier: 'ORIGINAL', basisTier: 'AVP_SCREEN', sources: Object.freeze(['avp2004']), implementationOriginal: true }),
]);

export const DREAD_STYLES = Object.freeze([
  Object.freeze({ id: 'dread_style_classic', name: 'Predlocks classiques', lengthScale: 1, spreadScale: 1, beadStride: 1 }),
  Object.freeze({ id: 'dread_style_long', name: 'Predlocks longs', lengthScale: 1.35, spreadScale: 0.94, beadStride: 2 }),
  Object.freeze({ id: 'dread_style_braided', name: 'Tresses de chasse', lengthScale: 0.88, spreadScale: 0.72, beadStride: 1 }),
  Object.freeze({ id: 'dread_style_elder', name: 'Couronne d’Ancien', lengthScale: 1.16, spreadScale: 1.28, beadStride: 1 }),
  Object.freeze({ id: 'dread_style_cropped', name: 'Predlocks de pisteur courtes', lengthScale: 0.7, spreadScale: 1.12, beadStride: 2 }),
  Object.freeze({ id: 'dread_style_swept', name: 'Predlocks rejetées', lengthScale: 1.08, spreadScale: 0.82, beadStride: 3 }),
  Object.freeze({ id: 'dread_style_ceremonial', name: 'Parure cérémonielle', lengthScale: 1.28, spreadScale: 1.16, beadStride: 1 }),
  Object.freeze({ id: 'dread_style_city_dense', name: 'Tresses urbaines denses', lengthScale: 1.04, spreadScale: 0.68, beadStride: 2, sourceTier: 'ORIGINAL', basisTier: 'SCREEN', sources: Object.freeze(['predator2']), implementationOriginal: true }),
  Object.freeze({ id: 'dread_style_avp_heavy', name: 'Predlocks lourds du rite AVP', lengthScale: 1.18, spreadScale: 1.08, beadStride: 1, sourceTier: 'ORIGINAL', basisTier: 'AVP_SCREEN', sources: Object.freeze(['avp2004']), implementationOriginal: true }),
  Object.freeze({ id: 'dread_style_wolf_veteran', name: 'Tresses vétéran de Wolf', lengthScale: 1.12, spreadScale: 0.86, beadStride: 2, sourceTier: 'ORIGINAL', basisTier: 'AVP_SCREEN', sources: Object.freeze(['avpRequiem2007']), implementationOriginal: true }),
]);

export const ARMOR_FINISHES = Object.freeze([
  Object.freeze({ id: 'finish_hunter_worn', name: 'Usée par la chasse', metalness: 0.76, roughness: 0.56 }),
  Object.freeze({ id: 'finish_polished', name: 'Alliage poli', metalness: 0.98, roughness: 0.12 }),
  Object.freeze({ id: 'finish_ritual', name: 'Gravure rituelle', metalness: 0.88, roughness: 0.3, emissiveIntensity: 0.12 }),
  Object.freeze({ id: 'finish_bone', name: 'Composite osseux', metalness: 0.24, roughness: 0.72 }),
  Object.freeze({ id: 'finish_oxidized', name: 'Alliage oxydé', metalness: 0.82, roughness: 0.68 }),
  Object.freeze({ id: 'finish_obsidian', name: 'Céramique d’obsidienne', metalness: 0.58, roughness: 0.18, emissiveIntensity: 0.04 }),
  Object.freeze({ id: 'finish_sandblasted', name: 'Métal sablé', metalness: 0.69, roughness: 0.81 }),
  Object.freeze({ id: 'finish_stargazer_salvaged', name: 'Composite Stargazer récupéré', metalness: 0.72, roughness: 0.48, emissiveIntensity: 0.08, sourceTier: 'ORIGINAL', basisTier: 'SCREEN', sources: Object.freeze(['thePredator2018']), implementationOriginal: true }),
  Object.freeze({ id: 'finish_city_burnished', name: 'Alliage urbain bruni', metalness: 0.86, roughness: 0.5, emissiveIntensity: 0.03, sourceTier: 'ORIGINAL', basisTier: 'SCREEN', sources: Object.freeze(['predator2']), implementationOriginal: true }),
  Object.freeze({ id: 'finish_avp_frosted_alloy', name: 'Alliage rituel givré', metalness: 0.84, roughness: 0.66, emissiveIntensity: 0.025, sourceTier: 'ORIGINAL', basisTier: 'AVP_SCREEN', sources: Object.freeze(['avp2004']), implementationOriginal: true }),
  Object.freeze({ id: 'finish_cleaner_acid_resistant', name: 'Alliage Cleaner anti-acide', metalness: 0.72, roughness: 0.74, emissiveIntensity: 0.045, sourceTier: 'ORIGINAL', basisTier: 'AVP_SCREEN', sources: Object.freeze(['avpRequiem2007']), implementationOriginal: true }),
  Object.freeze({ id: 'finish_feral_bone_carved', name: 'Os gravé des Grandes Plaines', metalness: 0.18, roughness: 0.82, emissiveIntensity: 0, sourceTier: 'ORIGINAL', basisTier: 'SCREEN', sources: Object.freeze(['prey2022']), implementationOriginal: true }),
  Object.freeze({ id: 'finish_super_predator_crimson', name: 'Écailles et laque cramoisie Super Predator', metalness: 0.65, roughness: 0.42, emissiveIntensity: 0.05, sourceTier: 'ORIGINAL', basisTier: 'SCREEN', sources: Object.freeze(['predators2010']), implementationOriginal: true }),
  Object.freeze({ id: 'finish_celtic_battle_aged', name: 'Alliage rituel de Celtic', metalness: 0.88, roughness: 0.52, emissiveIntensity: 0.03, sourceTier: 'ORIGINAL', basisTier: 'AVP_SCREEN', sources: Object.freeze(['avp2004']), implementationOriginal: true }),
  Object.freeze({ id: 'finish_medicomp_burnished_bronze', name: 'Bronze patiné du Medicomp 1990', metalness: 0.78, roughness: 0.44, emissiveIntensity: 0.04, sourceTier: 'ORIGINAL', basisTier: 'SCREEN', sources: Object.freeze(['predator2']), implementationOriginal: true }),
]);

export const WARPAINT_PATTERNS = Object.freeze([
  Object.freeze({ id: 'warpaint_none', name: 'Sans marquage', color: 0x000000, pattern: 'none' }),
  Object.freeze({ id: 'warpaint_blooded', name: 'Marque du Sang', color: 0x7d1418, pattern: 'brow' }),
  Object.freeze({ id: 'warpaint_claw', name: 'Trois griffes', color: 0xd7c18b, pattern: 'claw' }),
  Object.freeze({ id: 'warpaint_elder', name: 'Glyphes d’Ancien Apex', color: 0x2ff6e5, pattern: 'elder' }),
  Object.freeze({ id: 'warpaint_ash_veil', name: 'Voile de cendre', color: 0xc6bea7, pattern: 'brow' }),
  Object.freeze({ id: 'warpaint_black_claw', name: 'Griffes nocturnes', color: 0x181b1c, pattern: 'claw' }),
  Object.freeze({ id: 'warpaint_blood_oath', name: 'Serment écarlate', color: 0xa32125, pattern: 'ritual' }),
  Object.freeze({ id: 'warpaint_fugitive_scar', name: 'Balafre d’évadé Apex', color: 0x86d8bf, pattern: 'claw', sourceTier: 'ORIGINAL', basisTier: 'SCREEN', sources: Object.freeze(['thePredator2018']), implementationOriginal: true }),
  Object.freeze({ id: 'warpaint_city_soot', name: 'Suie de la chasse urbaine', color: 0x292723, pattern: 'brow', sourceTier: 'ORIGINAL', basisTier: 'SCREEN', sources: Object.freeze(['predator2']), implementationOriginal: true }),
  Object.freeze({ id: 'warpaint_scar_acid_mark', name: 'Marque acide de Scar', color: 0x9acd42, pattern: 'acid_mark', sourceTier: 'AVP_SCREEN', sources: Object.freeze(['avp2004']) }),
  Object.freeze({ id: 'warpaint_wolf_veteran_scars', name: 'Balafres du vétéran Wolf', color: 0xa4b09d, pattern: 'claw', sourceTier: 'ORIGINAL', basisTier: 'AVP_SCREEN', sources: Object.freeze(['avpRequiem2007']), implementationOriginal: true }),
]);

export const PLAYER_GADGETS = Object.freeze([
  Object.freeze({ id: 'wrist_shield', key: 'KeyB', keyLabel: 'B', name: 'Bouclier de poignet', energyCost: 25, cooldown: 8, behavior: 'frontal_barrier', effects: Object.freeze({ damageAbsorption: 0.68, activeDuration: 3.5, maxIntegrity: 100 }) }),
  Object.freeze({ id: 'scout_drone', key: 'KeyG', keyLabel: 'G', name: 'Drone-faucon', energyCost: 20, cooldown: 14, behavior: 'aerial_scan', effects: Object.freeze({ scanRadius: 90, markDuration: 7 }) }),
  Object.freeze({ id: 'shuriken', key: 'KeyT', keyLabel: 'T', name: 'Shuriken AVP', energyCost: 12, cooldown: 2.4, behavior: 'returning_projectile', effects: Object.freeze({ damage: 62, projectileSpeed: 92, lifetime: 3 }) }),
  Object.freeze({ id: 'voice_mimic', key: 'KeyF', keyLabel: 'F', name: 'Imitation vocale', energyCost: 0, cooldown: 0, behavior: 'directional_lure', effects: Object.freeze({ lureRadius: 90, lureDuration: 6, lureProfiles: 3 }) }),
  Object.freeze({ id: 'biomask_vision', key: 'KeyV', keyLabel: 'V', name: 'Biomasque multispectral', energyCost: 0, cooldown: 0, behavior: 'cycle_vision', effects: Object.freeze({ visionModes: Object.freeze(['normal', 'thermal', 'tech']) }) }),
  Object.freeze({ id: 'optical_cloak', key: 'KeyC', keyLabel: 'C', name: 'Camouflage réfractif', energyCost: 0, cooldown: 0, behavior: 'toggle_cloak', effects: Object.freeze({ energyDrainPerSecond: 12, incompatibleWithShield: true, acidDisruption: true }) }),
  Object.freeze({ id: 'apex_decoy', key: 'KeyY', keyLabel: 'Y', name: 'Leurre holographique Apex', energyCost: 22, cooldown: 18, behavior: 'persistent_holographic_lure', effects: Object.freeze({ lureRadius: 110, activeDuration: 8, threatPulseInterval: 1.2 }) }),
]);

export const ARMOR_PRESET_MASK_IDS = Object.freeze({
  jungle_1987: 'mask_jungle_hunter_1987', city_1990: 'mask_city_hunter_1990',
  elder_lost_tribe: 'mask_elder_lost_tribe_1990', scar_avp: 'mask_scar_avp',
  boar_lost_tribe: 'mask_boar_lost_tribe', shaman_lost_tribe: 'mask_shaman_lost_tribe', snake_lost_tribe: 'mask_snake_lost_tribe', guardian_lost_tribe: 'mask_guardian_lost_tribe',
  stalker_lost_tribe: 'mask_stalker_lost_tribe', warrior_lost_tribe: 'mask_warrior_lost_tribe', armored_lost_tribe: 'mask_armored_lost_tribe', scout_lost_tribe: 'mask_scout_lost_tribe',
  celtic_avp: 'mask_celtic_avp', chopper_avp: 'mask_chopper_avp', wolf_avpr: 'mask_wolf_avpr',
  berserker_2010: 'mask_berserker_2010', falconer_2010: 'mask_falconer_2010', tracker_2010: 'mask_tracker_2010',
  feral_2022: 'mask_feral_2022', fugitive_2018: 'mask_fugitive_2018',
  kok_viking_hunter: 'mask_kok_viking', kok_feudal_hunter: 'mask_kok_feudal', kok_wartime_hunter: 'mask_kok_wartime',
  dek_badlands: 'mask_dek_badlands', kwei_badlands: 'mask_kwei_badlands', alpha_yautja: 'mask_alpha_hg',
  captured_hg: 'mask_captured_hg', cleopatra_hg: 'mask_cleopatra_hg', exiled_hg: 'mask_exiled_hg',
  samurai_yautja: 'mask_samurai_hg',
  gladiator_hg: 'mask_gladiator_hg', anubis_hg: 'mask_anubis_hg', exalted_hg: 'mask_exalted_hg',
  witch_hg: 'mask_witch_hg', oni_hg: 'mask_oni_hg', jotun_hg: 'mask_jotun_hg', father_hg: 'mask_father_hg',
  bionic_hg: 'mask_fugitive_2018', emissary_hg: 'mask_captured_hg', valkyrie_hg: 'mask_jotun_hg',
  amazon_hg: 'mask_cleopatra_hg', pirate_hg: 'mask_exiled_hg', mr_black_hg: 'mask_berserker_2010',
  ahab_comic: 'mask_elder_lost_tribe_1990', scarface_game: 'mask_city_hunter_1990', dark_avp2010: 'mask_celtic_avp',
  machiko_yautja: 'mask_samurai_hg', viking_yautja: 'mask_kok_viking', cyborg_yautja: 'mask_fugitive_2018',
  deadend_fanfilm: 'mask_jungle_hunter_1987',
});

export function getArmorPresetCustomization(armorPresetId) {
  const skin = YautjaSkinsDatabase.find(({ id }) => id === armorPresetId)
    ?? YautjaSkinsDatabase.find(({ id }) => id === DEFAULT_CUSTOMIZATION.armorPresetId);
  const colorHex = skin?.col ?? ARMOR_PALETTES[0].hex;
  const target = [(colorHex >> 16) & 0xff, (colorHex >> 8) & 0xff, colorHex & 0xff];
  const nearestArmor = ARMOR_PALETTES.reduce((nearest, palette) => {
    const sample = [(palette.hex >> 16) & 0xff, (palette.hex >> 8) & 0xff, palette.hex & 0xff];
    const distance = sample.reduce((total, value, index) => total + ((value - target[index]) ** 2), 0);
    return !nearest || distance < nearest.distance ? { palette, distance } : nearest;
  }, null)?.palette ?? ARMOR_PALETTES[0];
  const validPresetId = skin?.id ?? DEFAULT_CUSTOMIZATION.armorPresetId;
  return { armorPresetId: validPresetId, armorColorId: nearestArmor.id, ...(ARMOR_PRESET_MASK_IDS[validPresetId] ? { maskId: ARMOR_PRESET_MASK_IDS[validPresetId] } : {}) };
}

export const PLAYABLE_WEAPONS = Object.freeze([
  { slot: 1, key: 'Digit1', id: 'wristblades', name: 'Lames de poignet', shortName: 'LAMES POIGNET', sourceTier: 'SCREEN', sources: ['predator1987', 'predator2'], behavior: 'melee_fast' },
  { slot: 2, key: 'Digit2', id: 'plasmacaster_single', name: 'Canon à plasma', shortName: 'PLASMA', sourceTier: 'SCREEN', sources: ['predator1987', 'predator2'], behavior: 'plasma' },
  { slot: 3, key: 'Digit3', id: 'combi_stick', name: 'Combi-stick', shortName: 'COMBI-STICK', sourceTier: 'SCREEN', sources: ['predator2'], behavior: 'spear' },
  { slot: 4, key: 'Digit4', id: 'smart_disc', name: 'Disque intelligent', shortName: 'DISQUE INTEL', sourceTier: 'SCREEN', sources: ['predator2'], behavior: 'returning_disc' },
  { slot: 5, key: 'Digit5', id: 'netgun', name: 'Lance-filet', shortName: 'LANCE-FILET', sourceTier: 'SCREEN', sources: ['predator2'], behavior: 'crowd_control' },
  { slot: 6, key: 'Digit6', id: 'medicomp', name: 'Medicomp', shortName: 'MEDICOMP', sourceTier: 'SCREEN', sources: ['predator2'], behavior: 'healing' },
  { slot: 7, key: 'Digit7', id: 'plasma_mines', name: 'Mines à plasma', shortName: 'MINES PLASMA', sourceTier: 'LICENSED_EU', sources: ['huntingGrounds'], behavior: 'trap' },
  { slot: 8, key: 'Digit8', id: 'whip_thorns', name: 'Fouet segmenté', shortName: 'FOUET ÉPINES', sourceTier: 'AVP_SCREEN', sources: ['avpRequiem2007'], behavior: 'melee_control' },
  { slot: 9, key: 'Digit9', id: 'yautja_bow', name: 'Arc Yautja', shortName: 'ARC YAUTJA', sourceTier: 'SCREEN', sources: ['badlandsGear', 'huntingGrounds'], behavior: 'charged_arrow' },
  { slot: 0, key: 'Digit0', id: 'speargun', name: 'Lance-harpons', shortName: 'SPEARGUN', sourceTier: 'SCREEN', sources: ['predator2'], behavior: 'precision_bolt' },
  { slot: 10, key: 'Minus', keyLabel: '−', id: 'feral_bolt_launcher', name: 'Lance-traits du Feral', shortName: 'TRAITS FERAL', sourceTier: 'SCREEN', sources: ['prey2022'], behavior: 'precision_bolt_rapid', variantId: 'variant_feral_bolt_launcher' },
  { slot: 11, key: 'Equal', keyLabel: '=', id: 'wolf_dual_plasma', name: 'Double plasma de Wolf', shortName: 'DOUBLE PLASMA', sourceTier: 'AVP_SCREEN', sources: ['avpRequiem2007'], behavior: 'dual_plasma', variantId: 'variant_wolf_dual_plasma' },
  { slot: 12, key: 'BracketLeft', keyLabel: '[', id: 'eye_of_ra', name: 'Eye of Ra', shortName: 'EYE OF RA', sourceTier: 'LICENSED_EU', sources: ['huntingGroundsUpdates'], behavior: 'precision_plasma', variantId: 'variant_eye_of_ra' },
  { slot: 13, key: 'BracketRight', keyLabel: ']', id: 'father_sword', name: 'Épée Yautja — Father', shortName: 'ÉPÉE FATHER', sourceTier: 'LICENSED_EU', sources: ['huntingGroundsUpdates'], behavior: 'melee_heavy', variantId: 'variant_father_sword' },
  { slot: 14, key: 'Backslash', keyLabel: '\\', id: 'wrist_rocket', name: 'Fusée de poignet', shortName: 'FUSÉE POIGNET', sourceTier: 'SCREEN', sources: ['predator2'], behavior: 'explosive_projectile', variantId: 'variant_wrist_rocket' },
]);

// Ces profils étendent les dix emplacements existants sans renuméroter les slots
// persistés. Un consommateur peut appliquer leurs multiplicateurs au comportement
// de l'arme de base tout en gardant l'identifiant de sauvegarde historique intact.
export const WEAPON_TECH_VARIANTS = Object.freeze([
  Object.freeze({
    id: 'variant_feral_bolt_launcher', baseWeaponId: 'speargun', name: 'Lance-traits du Feral',
    sourceTier: 'SCREEN', sources: Object.freeze(['prey2022']), behavior: 'precision_bolt',
    modifiers: Object.freeze({ damageMultiplier: 0.88, cooldownMultiplier: 0.84, energyCostMultiplier: 0.9, projectileSpeedMultiplier: 1.18 }),
  }),
  Object.freeze({
    id: 'variant_wolf_dual_plasma', baseWeaponId: 'plasmacaster_single', name: 'Double plasma de Wolf',
    sourceTier: 'AVP_SCREEN', sources: Object.freeze(['avpRequiem2007']), behavior: 'plasma',
    modifiers: Object.freeze({ damageMultiplier: 0.72, cooldownMultiplier: 1.18, energyCostMultiplier: 1.35, projectileSpeedMultiplier: 1, projectileCount: 2 }),
  }),
  Object.freeze({
    id: 'variant_eye_of_ra', baseWeaponId: 'plasmacaster_single', name: 'Eye of Ra',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGroundsUpdates']), behavior: 'precision_plasma',
    modifiers: Object.freeze({ damageMultiplier: 1.5, cooldownMultiplier: 1.5, energyCostMultiplier: 1.28, projectileSpeedMultiplier: 1.38 }),
  }),
  Object.freeze({
    id: 'variant_father_sword', baseWeaponId: 'wristblades', name: 'Épée Yautja — Father',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGroundsUpdates']), behavior: 'melee_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.28, cooldownMultiplier: 1.22, energyCostMultiplier: 1, rangeMultiplier: 1.18 }),
  }),
  Object.freeze({
    id: 'variant_wrist_rocket', baseWeaponId: 'plasma_mines', name: 'Fusée de poignet',
    sourceTier: 'SCREEN', sources: Object.freeze(['predator2']), behavior: 'explosive_projectile',
    modifiers: Object.freeze({ damageMultiplier: 1.15, cooldownMultiplier: 1.45, energyCostMultiplier: 1.2, projectileSpeedMultiplier: 1.34, blastRadius: 7.5 }),
  }),
]);


// Les variantes liées à un preset s'activent automatiquement et ne consomment
// aucun raccourci d'arme supplémentaire.
export const ARMOR_PRESET_WEAPON_VARIANTS = Object.freeze([
  Object.freeze({
    id: 'variant_chopper_extended_wristblades', armorPresetId: 'chopper_avp', baseWeaponId: 'wristblades', name: 'Longues lames de Chopper',
    sourceTier: 'AVP_SCREEN', sources: Object.freeze(['avp2004']), behavior: 'melee_fast',
    modifiers: Object.freeze({ damageMultiplier: 1.08, cooldownMultiplier: 1.06, energyCostMultiplier: 1, rangeMultiplier: 1.38 }),
  }),
  Object.freeze({
    id: 'variant_wolf_power_glove', armorPresetId: 'wolf_avpr', baseWeaponId: 'wristblades', name: 'Gantelet de puissance de Wolf',
    sourceTier: 'AVP_SCREEN', sources: Object.freeze(['avpRequiem2007']), behavior: 'melee_fast',
    modifiers: Object.freeze({ damageMultiplier: 1.18, cooldownMultiplier: 1.08, energyCostMultiplier: 1, rangeMultiplier: 1.12 }),
  }),
  // Prey (2022) : le Feral frappe avec le bord de son bouclier segmenté monté
  // sur l'avant-bras gauche. Coup plus lourd, plus lent et à portée réduite.
  Object.freeze({
    id: 'variant_feral_bone_shield', armorPresetId: 'feral_2022', baseWeaponId: 'wristblades', name: 'Bouclier-gantelet du Feral',
    sourceTier: 'SCREEN', sources: Object.freeze(['prey2022']), behavior: 'melee_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.22, cooldownMultiplier: 1.15, energyCostMultiplier: 1, rangeMultiplier: 0.92, wristShieldAbsorbBonus: 0.12 }),
  }),
  // Predators (2010) : canon à plasma rotatif lourd de Mr. Black / Berserker
  Object.freeze({
    id: 'variant_berserker_rotary_plasma', armorPresetId: 'berserker_2010', baseWeaponId: 'plasmacaster_single', name: 'Canon rotatif du Berserker',
    sourceTier: 'SCREEN', sources: Object.freeze(['predators2010']), behavior: 'plasma_rotary_burst',
    modifiers: Object.freeze({ damageMultiplier: 1.32, cooldownMultiplier: 1.22, energyCostMultiplier: 1.15, projectileSpeedMultiplier: 1.18, burstCount: 3 }),
  }),
  // Predator 2 (1990) : fléchette perforante propulsée par le fusil-harpon du City Hunter
  Object.freeze({
    id: 'variant_city_hunter_speargun_dart', armorPresetId: 'city_1990', baseWeaponId: 'speargun', name: 'Fléchette perforante de Los Angeles',
    sourceTier: 'SCREEN', sources: Object.freeze(['predator2']), behavior: 'precision_spear_penetrating',
    modifiers: Object.freeze({ damageMultiplier: 1.25, cooldownMultiplier: 0.95, energyCostMultiplier: 0.9, projectileSpeedMultiplier: 1.3 }),
  }),
  // Alien vs. Predator (2004) : lance-filet lourd de Celtic avec câble de rétractation cérémoniel renforcé
  Object.freeze({
    id: 'variant_celtic_heavy_netgun', armorPresetId: 'celtic_avp', baseWeaponId: 'netgun', name: 'Lance-filet lourd de Celtic',
    sourceTier: 'AVP_SCREEN', sources: Object.freeze(['avp2004']), behavior: 'crowd_control_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.2, cooldownMultiplier: 1.1, energyCostMultiplier: 1.05, rangeMultiplier: 1.15, snareDurationMultiplier: 1.25 }),
  }),
  // Aliens vs. Predator: Requiem (2007) : fouet d’épines de Wolf façonné dans la queue tranchante d'un Xénomorphe
  Object.freeze({
    id: 'variant_wolf_segmented_whip', armorPresetId: 'wolf_avpr', baseWeaponId: 'whip_thorns', name: 'Fouet d’épines xénomorphes de Wolf',
    sourceTier: 'AVP_SCREEN', sources: Object.freeze(['avpRequiem2007']), behavior: 'melee_control',
    modifiers: Object.freeze({ damageMultiplier: 1.26, cooldownMultiplier: 0.95, energyCostMultiplier: 1, rangeMultiplier: 1.22 }),
  }),
  // Predator 2 (1990) : Trousse chirurgicale d'urgence du City Hunter (suture rapide et cautérisation avancée)
  Object.freeze({
    id: 'variant_city_hunter_surgical_kit', armorPresetId: 'city_1990', baseWeaponId: 'medicomp', name: 'Kit chirurgical du City Hunter',
    sourceTier: 'SCREEN', sources: Object.freeze(['predator2']), behavior: 'rapid_surgical_triage',
    modifiers: Object.freeze({ healingEfficiencyMultiplier: 1.25, sutureSpeedMultiplier: 1.3 }),
  }),
  // Aliens vs. Predator: Requiem (2007) : Bio-neutralisant de Wolf dissolvant et purifiant l'acide xénomorphe
  Object.freeze({
    id: 'variant_wolf_cleaner_antidote', armorPresetId: 'wolf_avpr', baseWeaponId: 'medicomp', name: 'Bio-neutralisant Cleaner de Wolf',
    sourceTier: 'AVP_SCREEN', sources: Object.freeze(['avpRequiem2007']), behavior: 'corrosive_antidote_cleanse',
    modifiers: Object.freeze({ acidPurgeBonus: 1.5, immunityDurationSeconds: 4 }),
  }),
  // 15 Nouvelles Variantes Canoniques d'Armes Yautja
  Object.freeze({
    id: 'variant_scarface_glaive', armorPresetId: 'scarface_game', baseWeaponId: 'combi_stick', name: 'Glaive à deux mains de Scarface',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['predatorConcreteJungle2005']), behavior: 'spear_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.34, rangeMultiplier: 1.25, cooldownMultiplier: 1.12 }),
  }),
  Object.freeze({
    id: 'variant_alpha_bone_sickle', armorPresetId: 'alpha_yautja', baseWeaponId: 'wristblades', name: 'Faux en chitine d\'Alpha Predator',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGrounds']), behavior: 'melee_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.36, cooldownMultiplier: 1.18, rangeMultiplier: 1.22 }),
  }),
  Object.freeze({
    id: 'variant_cleopatra_solar_disc', armorPresetId: 'cleopatra_hg', baseWeaponId: 'smart_disc', name: 'Disque Solaire Pharaonique de Cleopatra',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGrounds']), behavior: 'returning_disc',
    modifiers: Object.freeze({ damageMultiplier: 1.28, projectileSpeedMultiplier: 1.24, returnSpeedMultiplier: 1.3 }),
  }),
  Object.freeze({
    id: 'variant_dek_kinetic_bow', armorPresetId: 'dek_badlands', baseWeaponId: 'yautja_bow', name: 'Arc cinétique composite de Dek',
    sourceTier: 'SCREEN', sources: Object.freeze(['badlandsGear']), behavior: 'charged_arrow',
    modifiers: Object.freeze({ chargeSpeedMultiplier: 1.25, damageMultiplier: 1.2, projectileSpeedMultiplier: 1.35 }),
  }),
  Object.freeze({
    id: 'variant_kwei_mentor_spear', armorPresetId: 'kwei_badlands', baseWeaponId: 'combi_stick', name: 'Combi-stick cérémonial de Kwei',
    sourceTier: 'SCREEN', sources: Object.freeze(['badlands2025']), behavior: 'spear',
    modifiers: Object.freeze({ damageMultiplier: 1.22, rangeMultiplier: 1.15, throwDamageMultiplier: 1.3 }),
  }),
  Object.freeze({
    id: 'variant_celtic_ceremonial_dagger', armorPresetId: 'celtic_avp', baseWeaponId: 'wristblades', name: 'Lames d\'assaut massives de Celtic',
    sourceTier: 'AVP_SCREEN', sources: Object.freeze(['avp2004']), behavior: 'melee_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.26, cooldownMultiplier: 1.1, shieldPierceBonus: 0.25 }),
  }),
  Object.freeze({
    id: 'variant_scar_shuriken_chakram', armorPresetId: 'scar_avp', baseWeaponId: 'smart_disc', name: 'Shuriken cérémonial à six pointes de Scar',
    sourceTier: 'AVP_SCREEN', sources: Object.freeze(['avp2004']), behavior: 'returning_disc',
    modifiers: Object.freeze({ damageMultiplier: 1.22, projectileSpeedMultiplier: 1.2, multiHitCount: 3 }),
  }),
  Object.freeze({
    id: 'variant_ahab_engineer_harpoon', armorPresetId: 'ahab_comic', baseWeaponId: 'speargun', name: 'Fusil-harpon tueur d\'Ingénieur d\'Ahab',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['avpOriginalComics']), behavior: 'precision_bolt',
    modifiers: Object.freeze({ damageMultiplier: 1.42, armorPenetrationBonus: 0.4, projectileSpeedMultiplier: 1.25 }),
  }),
  Object.freeze({
    id: 'variant_dark_ancient_plasma', armorPresetId: 'dark_avp2010', baseWeaponId: 'plasmacaster_single', name: 'Canon à plasma antique d\'Élite de Dark',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['avpOriginalComics']), behavior: 'plasma',
    modifiers: Object.freeze({ damageMultiplier: 1.3, blastRadiusMultiplier: 1.25, energyCostMultiplier: 1.1 }),
  }),
  Object.freeze({
    id: 'variant_samurai_katana', armorPresetId: 'samurai_yautja', baseWeaponId: 'wristblades', name: 'Katana Yautja trempé dans l\'acide',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGrounds']), behavior: 'melee_fast',
    modifiers: Object.freeze({ damageMultiplier: 1.24, attackSpeedMultiplier: 1.2, bleedDurationSeconds: 4 }),
  }),
  Object.freeze({
    id: 'variant_viking_battle_axe', armorPresetId: 'viking_yautja', baseWeaponId: 'wristblades', name: 'Hache de guerre en acier noir viking',
    sourceTier: 'SCREEN', sources: Object.freeze(['killerOfKillers']), behavior: 'melee_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.38, cooldownMultiplier: 1.22, knockbackBonus: 8 }),
  }),
  Object.freeze({
    id: 'variant_valkyrie_norse_hammer', armorPresetId: 'valkyrie_hg', baseWeaponId: 'wristblades', name: 'Masse de guerre Yautja Valkyrie',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGrounds']), behavior: 'melee_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.32, stunDurationSeconds: 1.5, shockwaveRadius: 4 }),
  }),
  Object.freeze({
    id: 'variant_feudal_kusarigama', armorPresetId: 'kok_feudal_hunter', baseWeaponId: 'whip_thorns', name: 'Kusarigama féodale à chaîne lestée',
    sourceTier: 'SCREEN', sources: Object.freeze(['killerOfKillers']), behavior: 'melee_control',
    modifiers: Object.freeze({ rangeMultiplier: 1.35, snareDurationMultiplier: 1.3, damageMultiplier: 1.18 }),
  }),
  Object.freeze({
    id: 'variant_shaman_staff', armorPresetId: 'shaman_lost_tribe', baseWeaponId: 'combi_stick', name: 'Bâton cérémonial rituel du Chaman',
    sourceTier: 'SCREEN', sources: Object.freeze(['predator2']), behavior: 'spear',
    modifiers: Object.freeze({ healingAuraMultiplier: 1.2, energyRegenMultiplier: 1.25, damageMultiplier: 1.15 }),
  }),
  Object.freeze({
    id: 'variant_guardian_heavy_cannon', armorPresetId: 'guardian_lost_tribe', baseWeaponId: 'plasmacaster_single', name: 'Canon lourd d\'interdiction du Guardian',
    sourceTier: 'SCREEN', sources: Object.freeze(['predator2']), behavior: 'plasma',
    modifiers: Object.freeze({ damageMultiplier: 1.35, projectileSpeedMultiplier: 1.15, blastRadiusMultiplier: 1.3 }),
  }),
  Object.freeze({
    id: 'variant_jungle_1987_plasma_trophy', armorPresetId: 'jungle_1987', baseWeaponId: 'plasmacaster_single', name: 'Plasmacaster Matriciel Jungle Hunter 1987',
    sourceTier: 'SCREEN', sources: Object.freeze(['predator1987']), behavior: 'plasma',
    modifiers: Object.freeze({ damageMultiplier: 1.0, lockSpeedMultiplier: 1.2, thermalTrackingMultiplier: 1.3 }),
  }),
  Object.freeze({
    id: 'variant_elder_1990_ceremonial_sword', armorPresetId: 'elder_lost_tribe', baseWeaponId: 'wristblades', name: 'Épée Cérémoniale & Lames d\'Or Elder 1990',
    sourceTier: 'SCREEN', sources: Object.freeze(['predator2']), behavior: 'blade',
    modifiers: Object.freeze({ meleeReachMultiplier: 1.3, parryAngleMultiplier: 1.35, honorGainMultiplier: 1.5 }),
  }),
  Object.freeze({
    id: 'variant_falconer_2010_falcon_drone', armorPresetId: 'falconer_2010', baseWeaponId: 'smart_disc', name: 'Drone Faucon de Reconnaissance Falconer 2010',
    sourceTier: 'SCREEN', sources: Object.freeze(['predators2010']), behavior: 'drone',
    modifiers: Object.freeze({ scoutRadiusMultiplier: 1.5, tagDurationMultiplier: 1.4, returnSpeedMultiplier: 1.3 }),
  }),
  Object.freeze({
    id: 'variant_tracker_2010_whistle_spear', armorPresetId: 'tracker_2010', baseWeaponId: 'combi_stick', name: 'Lance Barbelée & Sifflet de Meute Tracker 2010',
    sourceTier: 'SCREEN', sources: Object.freeze(['predators2010']), behavior: 'spear',
    modifiers: Object.freeze({ houndSummonSpeedMultiplier: 1.25, bleedDurationMultiplier: 1.4, damageMultiplier: 1.2 }),
  }),
  Object.freeze({
    id: 'variant_fugitive_2018_shuriken_wrist', armorPresetId: 'fugitive_2018', baseWeaponId: 'wristblades', name: 'Multi-Lames Rétractables Fugitive 2018',
    sourceTier: 'SCREEN', sources: Object.freeze(['thePredator2018']), behavior: 'blade',
    modifiers: Object.freeze({ attackSpeedMultiplier: 1.3, dismemberChanceMultiplier: 1.35, armorPierceMultiplier: 1.25 }),
  }),
  Object.freeze({
    id: 'variant_machiko_yautja_honor_glaive', armorPresetId: 'machiko_yautja', baseWeaponId: 'glaive', name: 'Glaive d\'Initié & Arc Composite Machiko Noguchi',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['avpOriginalComics', 'avpPreyOmnibus']), behavior: 'blade',
    modifiers: Object.freeze({ agilityMultiplier: 1.35, stealthDamageMultiplier: 1.4, criticalChanceMultiplier: 1.3 }),
  }),
  Object.freeze({
    id: 'variant_boar_lost_tribe_twin_axes', armorPresetId: 'boar_lost_tribe', baseWeaponId: 'wristblades', name: 'Doubles Lames d\'Assaut Brise-Os de Boar (Lost Tribe 1990)',
    sourceTier: 'LICENSED_SCREEN_DESIGN', sources: Object.freeze(['predator2', 'lostTribeDesigns']), behavior: 'melee_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.32, knockbackBonus: 6, armorCrackChance: 0.35 }),
  }),
  Object.freeze({
    id: 'variant_snake_lost_tribe_phantom_disc', armorPresetId: 'snake_lost_tribe', baseWeaponId: 'smart_disc', name: 'Disque Fantôme Silencieux de Snake (Lost Tribe 1990)',
    sourceTier: 'LICENSED_SCREEN_DESIGN', sources: Object.freeze(['predator2', 'lostTribeDesigns']), behavior: 'returning_disc',
    modifiers: Object.freeze({ damageMultiplier: 1.24, projectileSpeedMultiplier: 1.3, stealthReturnBonus: 0.4 }),
  }),
  Object.freeze({
    id: 'variant_scout_lost_tribe_long_speargun', armorPresetId: 'scout_lost_tribe', baseWeaponId: 'speargun', name: 'Fusil-Harpon Longue Portée de Scout (Lost Tribe 1990)',
    sourceTier: 'LICENSED_SCREEN_DESIGN', sources: Object.freeze(['predator2', 'lostTribeDesigns']), behavior: 'precision_bolt',
    modifiers: Object.freeze({ damageMultiplier: 1.35, projectileSpeedMultiplier: 1.4, headshotBonus: 0.5 }),
  }),
  Object.freeze({
    id: 'variant_stalker_lost_tribe_needle_spear', armorPresetId: 'stalker_lost_tribe', baseWeaponId: 'combi_stick', name: 'Combi-Stick Perforant de Stalker (Lost Tribe 1990)',
    sourceTier: 'LICENSED_SCREEN_DESIGN', sources: Object.freeze(['predator2', 'lostTribeDesigns']), behavior: 'spear',
    modifiers: Object.freeze({ damageMultiplier: 1.26, armorPenetrationBonus: 0.45, throwVelocityMultiplier: 1.25 }),
  }),
  Object.freeze({
    id: 'variant_exiled_bad_blood_serrated_blades', armorPresetId: 'exiled_hg', baseWeaponId: 'wristblades', name: 'Lames Écorcheuses Crantées d\'Exilé Bad Blood',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['predatorBadBloodComics', 'huntingGrounds']), behavior: 'melee_fast',
    modifiers: Object.freeze({ damageMultiplier: 1.28, bleedDurationSeconds: 5, attackSpeedMultiplier: 1.2 }),
  }),
  Object.freeze({
    id: 'variant_captured_hg_bionic_breach_claw', armorPresetId: 'captured_hg', baseWeaponId: 'wristblades', name: 'Griffe d\'Évasion trempée du Chasseur Capturé',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['predators2010', 'huntingGrounds']), behavior: 'melee_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.3, restraintBreakBonus: 0.5, rageDamageBonus: 0.25 }),
  }),
  Object.freeze({
    id: 'variant_warrior_lost_tribe_heavy_maul', armorPresetId: 'warrior_lost_tribe', baseWeaponId: 'combi_stick', name: 'Lance de Choc Crantée du Warrior (Lost Tribe 1990)',
    sourceTier: 'LICENSED_SCREEN_DESIGN', sources: Object.freeze(['predator2', 'lostTribeDesigns']), behavior: 'spear',
    modifiers: Object.freeze({ damageMultiplier: 1.3, staggerBonus: 0.4, meleeReachMultiplier: 1.25 }),
  }),
  Object.freeze({
    id: 'variant_armored_lost_tribe_twin_plasma', armorPresetId: 'armored_lost_tribe', baseWeaponId: 'plasmacaster_single', name: 'Canon d\'Épaule Blindé Haute Densité du Lost Predator (1990)',
    sourceTier: 'LICENSED_SCREEN_DESIGN', sources: Object.freeze(['predator2', 'lostTribeDesigns']), behavior: 'plasma',
    modifiers: Object.freeze({ damageMultiplier: 1.32, blastRadiusMultiplier: 1.2, overheatResistanceBonus: 0.35 }),
  }),
  Object.freeze({
    id: 'variant_amazon_hg_royal_glaive', armorPresetId: 'amazon_hg', baseWeaponId: 'glaive', name: 'Glaive Matriarcal d\'Airain de l\'Amazon Predator',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGrounds']), behavior: 'blade',
    modifiers: Object.freeze({ damageMultiplier: 1.36, cleaveArcMultiplier: 1.3, honorGainMultiplier: 1.25 }),
  }),
  Object.freeze({
    id: 'variant_pirate_hg_cutlass_blade', armorPresetId: 'pirate_hg', baseWeaponId: 'wristblades', name: 'Sabre d\'Abordage & Lames Corsaires du Pirate Predator (1715)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['predator2', 'huntingGrounds']), behavior: 'melee_fast',
    modifiers: Object.freeze({ damageMultiplier: 1.26, parryCounterMultiplier: 1.4, bleedDurationSeconds: 4 }),
  }),
  Object.freeze({
    id: 'variant_oni_hg_demon_odachi', armorPresetId: 'oni_hg', baseWeaponId: 'wristblades', name: 'Odachi Démoniaque du Chasseur Oni',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGrounds']), behavior: 'melee_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.38, criticalChanceMultiplier: 1.3, armorPierceMultiplier: 1.3 }),
  }),
  Object.freeze({
    id: 'variant_gladiator_hg_trident_net', armorPresetId: 'gladiator_hg', baseWeaponId: 'netgun', name: 'Filet Barbelé d\'Arène & Trident du Gladiator Predator',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGrounds']), behavior: 'crowd_control_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.28, snareDurationMultiplier: 1.4, bleedDurationSeconds: 4 }),
  }),
  Object.freeze({
    id: 'variant_exalted_hg_golden_spear', armorPresetId: 'exalted_hg', baseWeaponId: 'combi_stick', name: 'Lance Aurique Sacrée de l\'Exalted Predator',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGrounds']), behavior: 'spear',
    modifiers: Object.freeze({ damageMultiplier: 1.35, honorGainMultiplier: 1.3, throwDamageMultiplier: 1.35 }),
  }),
  Object.freeze({
    id: 'variant_witch_hg_curse_bow', armorPresetId: 'witch_hg', baseWeaponId: 'yautja_bow', name: 'Arc d\'Os Maléfique de la Witch Predator',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGrounds']), behavior: 'charged_arrow',
    modifiers: Object.freeze({ damageMultiplier: 1.26, poisonDurationSeconds: 5, stealthDrainReduction: 0.3 }),
  }),
  Object.freeze({
    id: 'variant_jotun_hg_frost_maul', armorPresetId: 'jotun_hg', baseWeaponId: 'wristblades', name: 'Fendoir Polaire Nordique du Jotun Predator',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGrounds', 'killerOfKillers']), behavior: 'melee_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.4, knockbackBonus: 10, slowEffectMultiplier: 1.25 }),
  }),
  Object.freeze({
    id: 'variant_bionic_hg_cyber_caster', armorPresetId: 'bionic_hg', baseWeaponId: 'plasmacaster_single', name: 'Canon à Plasma Bionique Surchargé',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGrounds', 'predator2']), behavior: 'plasma',
    modifiers: Object.freeze({ damageMultiplier: 1.33, lockSpeedMultiplier: 1.45, energyCostMultiplier: 0.88 }),
  }),
  Object.freeze({
    id: 'variant_cyborg_yautja_hydraulic_blades', armorPresetId: 'cyborg_yautja', baseWeaponId: 'wristblades', name: 'Lames Hydrauliques Haute Fréquence du Cyborg Predator',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['predatorConcreteJungle2005', 'huntingGrounds']), behavior: 'melee_fast',
    modifiers: Object.freeze({ damageMultiplier: 1.32, attackSpeedMultiplier: 1.3, armorPierceMultiplier: 1.35 }),
  }),
  Object.freeze({
    id: 'variant_anubis_hg_jackal_staff', armorPresetId: 'anubis_hg', baseWeaponId: 'combi_stick', name: 'Sceptre Solaire Pyramidal d\'Anubis',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['avp2004', 'huntingGrounds']), behavior: 'spear',
    modifiers: Object.freeze({ damageMultiplier: 1.34, energyRegenMultiplier: 1.3, throwVelocityMultiplier: 1.3 }),
  }),
  Object.freeze({
    id: 'variant_kok_viking_broadaxe', armorPresetId: 'kok_viking_hunter', baseWeaponId: 'wristblades', name: 'Grande Hache Barbelée du Viking Predator (841)',
    sourceTier: 'SCREEN', sources: Object.freeze(['killerOfKillers']), behavior: 'melee_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.38, knockbackBonus: 8, armorCrackChance: 0.4 }),
  }),
  Object.freeze({
    id: 'variant_kok_wartime_kamikaze_harpoon', armorPresetId: 'kok_wartime_hunter', baseWeaponId: 'speargun', name: 'Harpon Perforant Pneumatique Pacifique 1942',
    sourceTier: 'SCREEN', sources: Object.freeze(['killerOfKillers']), behavior: 'precision_bolt',
    modifiers: Object.freeze({ damageMultiplier: 1.35, projectileSpeedMultiplier: 1.3, headshotBonus: 0.45 }),
  }),
  Object.freeze({
    id: 'variant_emissary_military_pulse_carbine', armorPresetId: 'emissary_hg', baseWeaponId: 'plasmacaster_single', name: 'Canon d\'Épaule Hybride Militaire de l\'Emissary',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['thePredator2018', 'huntingGrounds']), behavior: 'plasma',
    modifiers: Object.freeze({ damageMultiplier: 1.3, projectileSpeedMultiplier: 1.35, cooldownMultiplier: 0.9 }),
  }),
  Object.freeze({
    id: 'variant_mr_black_compound_scythe', armorPresetId: 'mr_black_hg', baseWeaponId: 'combi_stick', name: 'Faux de Chasse Massive de Mr. Black (Berserker Leader)',
    sourceTier: 'SCREEN', sources: Object.freeze(['predators2010', 'huntingGrounds']), behavior: 'spear_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.4, cleaveArcMultiplier: 1.35, staggerBonus: 0.45 }),
  }),
  Object.freeze({
    id: 'variant_father_hg_ancestral_blade', armorPresetId: 'father_hg', baseWeaponId: 'wristblades', name: 'Lame Ancestrale Millénaire du Father Predator',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGroundsUpdates', 'huntingGrounds']), behavior: 'blade',
    modifiers: Object.freeze({ damageMultiplier: 1.36, parryAngleMultiplier: 1.4, honorGainMultiplier: 1.35 }),
  }),
  Object.freeze({
    id: 'variant_deadend_heavy_combi', armorPresetId: 'deadend_fanfilm', baseWeaponId: 'combi_stick', name: 'Combi-Stick de Combat Urbain Sombre (Dead End)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['predator1987', 'predator2']), behavior: 'spear',
    modifiers: Object.freeze({ damageMultiplier: 1.32, rangeMultiplier: 1.25, criticalChanceMultiplier: 1.25 }),
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['avp2004', 'huntingGrounds']), behavior: 'spear',
    modifiers: Object.freeze({ damageMultiplier: 1.34, energyRegenMultiplier: 1.3, throwVelocityMultiplier: 1.3 }),
  }),
  Object.freeze({
    id: 'variant_jungle_1987_dual_wristblades', armorPresetId: 'jungle_1987', baseWeaponId: 'wristblades', name: 'Lames Télescopiques de Val Verde (1987)',
    sourceTier: 'SCREEN', sources: Object.freeze(['predator1987']), behavior: 'blade',
    modifiers: Object.freeze({ damageMultiplier: 1.15, attackSpeedMultiplier: 1.12, criticalChanceMultiplier: 1.1 }),
  }),
  Object.freeze({
    id: 'variant_elder_1990_flintlock_adolini_1718', armorPresetId: 'elder_lost_tribe', baseWeaponId: 'plasmacaster_single', name: 'Pistolet à Silex Raphaël Adolini 1718 d\'Honneur',
    sourceTier: 'SCREEN', sources: Object.freeze(['predator2']), behavior: 'plasma',
    modifiers: Object.freeze({ damageMultiplier: 1.25, rangeMultiplier: 1.18, cooldownMultiplier: 1.2 }),
  }),
  Object.freeze({
    id: 'variant_scar_avp_scythe_wristblades', armorPresetId: 'scar_avp', baseWeaponId: 'wristblades', name: 'Lames Doubles Cérémoniales de Scar (Bouvetøya)',
    sourceTier: 'AVP_SCREEN', sources: Object.freeze(['avp2004']), behavior: 'blade',
    modifiers: Object.freeze({ damageMultiplier: 1.14, rangeMultiplier: 1.2, attackSpeedMultiplier: 1.08 }),
  }),
  Object.freeze({
    id: 'variant_falconer_katana_parry_blade', armorPresetId: 'falconer_2010', baseWeaponId: 'combi_stick', name: 'Lame d\'Estoc Rituelle pour le Duel de Falconer (2010)',
    sourceTier: 'SCREEN', sources: Object.freeze(['predators2010']), behavior: 'spear',
    modifiers: Object.freeze({ damageMultiplier: 1.16, parryAngleMultiplier: 1.3, attackSpeedMultiplier: 1.05 }),
  }),
  Object.freeze({
    id: 'variant_feral_bolt_gun_magnetic', armorPresetId: 'feral_2022', baseWeaponId: 'plasmacaster_single', name: 'Fusil à Flèches Rétractables Magnétique Feral (1719)',
    sourceTier: 'SCREEN', sources: Object.freeze(['prey2022']), behavior: 'precision_bolt',
    modifiers: Object.freeze({ damageMultiplier: 1.2, criticalChanceMultiplier: 1.25, projectileSpeedMultiplier: 1.2 }),
  }),
  Object.freeze({
    id: 'variant_pirate_hg_boarding_harpoon_hook', armorPresetId: 'pirate_hg', baseWeaponId: 'combi_stick', name: 'Harpon d\'Abordage et Grappin d\'Écumeur Yautja',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGrounds']), behavior: 'spear_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.18, rangeMultiplier: 1.25, stunDurationMultiplier: 1.2 }),
  }),
  Object.freeze({
    id: 'variant_valkyrie_hg_norse_battle_axe', armorPresetId: 'valkyrie_hg', baseWeaponId: 'combi_stick', name: 'Hache de Bataille Nordique de Valkyrie',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGrounds']), behavior: 'spear_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.22, parryAngleMultiplier: 1.35, criticalChanceMultiplier: 1.15 }),
  }),
  Object.freeze({
    id: 'variant_samurai_yautja_nodachi_greatsword', armorPresetId: 'samurai_yautja', baseWeaponId: 'combi_stick', name: 'Grand Nodachi Électro-Forgé du Samouraï Yautja',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGrounds']), behavior: 'spear',
    modifiers: Object.freeze({ damageMultiplier: 1.2, rangeMultiplier: 1.25, attackSpeedMultiplier: 1.1 }),
  }),
  Object.freeze({
    id: 'variant_berserker_2010_brute_cleaver', armorPresetId: 'berserker_2010', baseWeaponId: 'wristblades', name: 'Tranchoir Brutal de Super Predator Berserker',
    sourceTier: 'SCREEN', sources: Object.freeze(['predators2010']), behavior: 'blade',
    modifiers: Object.freeze({ damageMultiplier: 1.25, bleedDamageMultiplier: 1.3, attackSpeedMultiplier: 0.95 }),
  }),
  Object.freeze({
    id: 'variant_city_hunter_speargun_urban_sniper', armorPresetId: 'city_1990', baseWeaponId: 'speargun', name: 'Fusil à Fléchettes Urbain Télescopique (1990)',
    sourceTier: 'SCREEN', sources: Object.freeze(['predator2']), behavior: 'precision_bolt',
    modifiers: Object.freeze({ damageMultiplier: 1.18, rangeMultiplier: 1.3, projectileSpeedMultiplier: 1.25 }),
  }),
  Object.freeze({
    id: 'variant_cleopatra_hg_pharaoh_khopesh', armorPresetId: 'cleopatra_hg', baseWeaponId: 'combi_stick', name: 'Khopesh Cérémonial Égyptien de Cléopâtre',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGrounds']), behavior: 'spear_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.2, parryAngleMultiplier: 1.25, honorGainMultiplier: 1.25 }),
  }),
  Object.freeze({
    id: 'variant_viking_yautja_round_shield_axes', armorPresetId: 'viking_yautja', baseWeaponId: 'wristblades', name: 'Bouclier Rond Runique et Hachettes Barbares',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['huntingGrounds']), behavior: 'blade',
    modifiers: Object.freeze({ damageMultiplier: 1.16, parryAngleMultiplier: 1.4, blockDamageAbsorptionMultiplier: 1.3 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_homeworld_ancient_spear', armorPresetId: 'elder_lost_tribe', baseWeaponId: 'combistick', name: 'Lance Ancestrale de Yellowstone de l\'Ancien (Homeworld 1999)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['comicsDarkHorse1989', 'predator2']), behavior: 'spear_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.34, rangeMultiplier: 1.28, honorGainMultiplier: 1.35 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_captive_escape_shuriken', armorPresetId: 'captured_hg', baseWeaponId: 'smart_disc', name: 'Disque-Shuriken d\'Évasion du Biodôme Stern (Captive 1998)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['comicsDarkHorse1989', 'huntingGrounds']), behavior: 'returning_disc',
    modifiers: Object.freeze({ damageMultiplier: 1.26, projectileSpeedMultiplier: 1.32, returnSpeedMultiplier: 1.25 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_primal_alaska_wristblades', armorPresetId: 'jungle_1987', baseWeaponId: 'wrist_blades', name: 'Lames de Poignet Sauvages Brise-Grizzly d\'Alaska (Primal 1997)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['comicsDarkHorse1989', 'predator1987']), behavior: 'melee_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.32, bleedDurationSeconds: 5, criticalChanceMultiplier: 1.22 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_eternal_1300_katana_glaive', armorPresetId: 'samurai_yautja', baseWeaponId: 'elder_sword', name: 'Lame-Katana Millénaire de l\'Épave de 1300 (AVP: Eternal 1998)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['avpOriginalComics', 'comicsDarkHorse1989']), behavior: 'blade',
    modifiers: Object.freeze({ damageMultiplier: 1.36, parryAngleMultiplier: 1.35, attackSpeedMultiplier: 1.18 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_thrill_hunt_twin_caster', armorPresetId: 'scar_avp', baseWeaponId: 'plasma_caster', name: 'Double Canon à Plasma de Siège de Céleste (Thrill of the Hunt 2004)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['avpOriginalComics', 'comicsDarkHorse1989']), behavior: 'plasma',
    modifiers: Object.freeze({ damageMultiplier: 1.28, projectileSpeedMultiplier: 1.22, cooldownMultiplier: 0.92 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_fire_stone_ahab_harpoon', armorPresetId: 'ahab_comic', baseWeaponId: 'speargun', name: 'Harpon Balistique d\'Abordage du Perses d\'Ahab (Fire and Stone 2014)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['prometheus2012', 'avpOriginalComics', 'comicsDarkHorse1989']), behavior: 'precision_bolt',
    modifiers: Object.freeze({ damageMultiplier: 1.44, armorPenetrationBonus: 0.45, projectileSpeedMultiplier: 1.3 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_big_game_quarry_spear', armorPresetId: 'jungle_1987', baseWeaponId: 'combistick', name: 'Lance de Carrière de Corpse Creek (Predator: Big Game 1991)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['comicsDarkHorse1989', 'predatorArchives']), behavior: 'spear_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.32, rangeMultiplier: 1.25, criticalChanceMultiplier: 1.2 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_adolini_elder_cutlass', armorPresetId: 'elder_lost_tribe', baseWeaponId: 'elder_sword', name: 'Coutelas d\'Honneur de Raphael Adolini (Predator: 1718)',
    sourceTier: 'CANON_FILM', sources: Object.freeze(['predator2', 'comicsDarkHorse1989']), behavior: 'blade',
    modifiers: Object.freeze({ damageMultiplier: 1.38, parryAngleMultiplier: 1.3, attackSpeedMultiplier: 1.15 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_romulus_cryo_emitter', armorPresetId: 'captured_hg', baseWeaponId: 'speargun', name: 'Propulseur Cryogénique de Station Renaissance (Alien: Romulus)',
    sourceTier: 'EXPANDED_LORE', sources: Object.freeze(['alienRomulus2024', 'huntingGrounds']), behavior: 'precision_bolt',
    modifiers: Object.freeze({ damageMultiplier: 1.28, projectileSpeedMultiplier: 1.22, slowDurationSeconds: 3 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_berserker_hydraulic_crusher', armorPresetId: 'berserker_2010', baseWeaponId: 'wrist_blades', name: 'Broyeur Hydraulique Lourd Anti-Blindage (Aliens: Berserker 1995)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['comicsDarkHorse1989', 'aliens1986']), behavior: 'melee_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.42, armorPenetrationBonus: 0.4, bleedDurationSeconds: 4 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_three_world_war_leash_chain', armorPresetId: 'machiko_yautja', baseWeaponId: 'whip_thorns', name: 'Fouet Barbelé d\'Asservissement du Clan Tueur (AVP: Three World War)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['avpOriginalComics', 'avpPreyOmnibus']), behavior: 'whip',
    modifiers: Object.freeze({ damageMultiplier: 1.3, rangeMultiplier: 1.25, bleedDamagePerSecond: 25 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_broken_tusk_ritual_disc', armorPresetId: 'celtic_avp', baseWeaponId: 'smart_disc', name: 'Disque Rituel Gravé de Dachande Broken Tusk (AVP: Prey 1990)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['avpOriginalComics', 'avpPreyOmnibus']), behavior: 'returning_disc',
    modifiers: Object.freeze({ damageMultiplier: 1.35, projectileSpeedMultiplier: 1.25, returnSpeedMultiplier: 1.2 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_south_china_sea_spear', armorPresetId: 'pirate_hg', baseWeaponId: 'combistick', name: 'Lance d’Abordage Volcanique des Spratleys (Predator: South China Sea 2008)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['predatorArchives', 'predator2', 'comicsDarkHorse1989']), behavior: 'spear_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.35, bleedDamagePerSecond: 28, throwVelocityMultiplier: 1.2 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_forever_midnight_plasma_blade', armorPresetId: 'berserker_2010', baseWeaponId: 'wrist_blades', name: 'Lames de Frénésie Thermique de Bolder’ji (Predator: Forever Midnight 2006)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['predatorArchives', 'predators2010', 'comicsDarkHorse1989']), behavior: 'melee_heavy',
    modifiers: Object.freeze({ damageMultiplier: 1.4, attackSpeedMultiplier: 1.25, rageGainMultiplier: 1.3 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_stronghold_emp_shuriken', armorPresetId: 'fugitive_2018', baseWeaponId: 'smart_disc', name: 'Chakram Disrupteur EMP de Maboushe (Aliens: Stronghold 1994)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['comicsDarkHorse1989', 'aliens1986']), behavior: 'returning_disc',
    modifiers: Object.freeze({ damageMultiplier: 1.3, empStunDurationSeconds: 3.5, returnSpeedMultiplier: 1.25 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_sea_sorrows_heavy_caster', armorPresetId: 'guardian_lost_tribe', baseWeaponId: 'plasmacaster_single', name: 'Canon Lourd à Résonance de Trimonite (Alien: Sea of Sorrows 2014)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['aliens1986', 'alien1979', 'comicsDarkHorse1989']), behavior: 'plasma',
    modifiers: Object.freeze({ damageMultiplier: 1.45, splashRadiusMultiplier: 1.35, cooldownMultiplier: 1.15 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_duel_predalien_bone_harpoon', armorPresetId: 'celtic_avp', baseWeaponId: 'speargun', name: 'Harpon d’Ostéite Hybride Predalien (AVP: Duel 1995)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['avpOriginalComics', 'avpPreyOmnibus', 'comicsDarkHorse1989']), behavior: 'precision_bolt',
    modifiers: Object.freeze({ damageMultiplier: 1.38, penetrationMultiplier: 1.4, acidBleedDps: 22 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_web_shock_whip', armorPresetId: 'wolf_avpr', baseWeaponId: 'whip_thorns', name: 'Fouet d’Arrimage Électromagnétique de The Web (AVP: The Web 1999)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['avpOriginalComics', 'comicsDarkHorse1989']), behavior: 'whip',
    modifiers: Object.freeze({ damageMultiplier: 1.32, rangeMultiplier: 1.3, shockDurationSeconds: 2.5 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_berserker_wrist_shredder', armorPresetId: 'berserker_2010', baseWeaponId: 'wristblades', name: 'Lames Déchiqueteuses Hydrauliques de Nemesis (Aliens: Berserker 1995)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['comicsDarkHorse1989', 'aliens1986']), behavior: 'rapid_claw',
    modifiers: Object.freeze({ damageMultiplier: 1.42, hydraulicImpactBonus: 28, bleedDps: 24 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_big_mama_ceremonial_naginata', armorPresetId: 'cleopatra_hg', baseWeaponId: 'glaive', name: 'Naginata Cérémonielle Dorée de Big Mama (AVP: Deadliest of the Species 1993)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['avpOriginalComics', 'comicsDarkHorse1989']), behavior: 'glaive',
    modifiers: Object.freeze({ damageMultiplier: 1.48, energyConduitCutBonus: 32, reachMultiplier: 1.35 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_killer_clan_dark_burner', armorPresetId: 'mr_black_hg', baseWeaponId: 'plasmacaster_single', name: 'Brûleur Obscur Surchargé du Killer Clan (AVP: Three World War 2010)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['avpOriginalComics', 'comicsDarkHorse1989']), behavior: 'plasma',
    modifiers: Object.freeze({ damageMultiplier: 1.52, thermalSplashRadiusMultiplier: 1.45, thermalBurnDps: 30 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_theta_hunting_scythe', armorPresetId: 'feral_2022', baseWeaponId: 'combi_stick', name: 'Faucille de Traque Composite de Theta (Predator: The Last Hunt 2023)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['predatorArchives', 'thePredator2018']), behavior: 'spear_thrust',
    modifiers: Object.freeze({ damageMultiplier: 1.36, criticalStrikeMultiplier: 1.55, armorBypassRatio: 0.35 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_three_world_war_hound_leash', armorPresetId: 'tracker_2010', baseWeaponId: 'whip_thorns', name: 'Laisse Électro-Filamentaire de Domestication (AVP: Three World War 2010)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['avpOriginalComics', 'comicsDarkHorse1989']), behavior: 'whip',
    modifiers: Object.freeze({ damageMultiplier: 1.34, neuralShockDurationSeconds: 3.2, snareRadiusMultiplier: 1.25 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_inferno_pyro_disc', armorPresetId: 'city_1990', baseWeaponId: 'smart_disc', name: 'Disque Incendiaire aux Deux Injecteurs de Thermite (Alien: Inferno\'s Fall 2022)',
    sourceTier: 'LICENSED_EU', sources: Object.freeze(['aliensFireteamElite2021', 'comicsDarkHorse1989']), behavior: 'returning_disc',
    modifiers: Object.freeze({ damageMultiplier: 1.44, thermiteBurnDps: 28, dualThermiteInjectors: true }),
  }),
  Object.freeze({
    id: 'yautja_wpn_turnabout_blind_tracker_spear',
    armorPresetId: 'tracker',
    baseWeaponId: 'combistick',
    name: 'Harpon Acoustique de Guidage Écholocalisé',
    loreSourceIds: Object.freeze(['lore_pred_turnabout_2008']),
    behavior: 'spear_thrust_throw',
    modifiers: Object.freeze({ damageMultiplier: 1.45, acousticEchoTracking: true, blindAccuracyBonus: 1.3 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_western_front_gas_disc',
    armorPresetId: 'heavy_armor',
    baseWeaponId: 'smart_disc',
    name: 'Disque Tranchant à Purge d\'Aérosol Toxique 1916',
    loreSourceIds: Object.freeze(['lore_pred_blood_on_two_earths_2001']),
    behavior: 'returning_disc',
    modifiers: Object.freeze({ damageMultiplier: 1.42, gasCloudRadiusM: 4.5, mustardGasImmunity: true }),
  }),
  Object.freeze({
    id: 'yautja_wpn_blackout_conduit_plasma_blade',
    armorPresetId: 'scout',
    baseWeaponId: 'wrist_blades',
    name: 'Lame de Poignet Survoltée de Coursive Mendel',
    loreSourceIds: Object.freeze(['lore_alien_isolation_blackout_2019']),
    behavior: 'dual_strike',
    modifiers: Object.freeze({ damageMultiplier: 1.48, conduitHighVoltageDischarge: true, silenceBonus: 1.5 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_leto_cerberus_heavy_maul',
    armorPresetId: 'heavy_armor',
    baseWeaponId: 'combistick',
    name: 'Masse de Choc Thermique Brise-Praetorian Leto',
    loreSourceIds: Object.freeze(['lore_alien_dark_descent_leto_2023']),
    behavior: 'heavy_ground_slam',
    modifiers: Object.freeze({ damageMultiplier: 1.6, armorShatterRatio: 0.85, praetorianKnockdown: true }),
  }),
  Object.freeze({
    id: 'yautja_wpn_lv742_ravager_hook_claws',
    armorPresetId: 'feral',
    baseWeaponId: 'wrist_blades',
    name: 'Griffes Renforcées de Mutation Ravager LV-742',
    loreSourceIds: Object.freeze(['lore_avp_extinction_event_2003']),
    behavior: 'flurry_cleave',
    modifiers: Object.freeze({ damageMultiplier: 1.55, chitineSeverChance: 0.45, bleedStackDps: 24 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_bunda_honor_glaive',
    armorPresetId: 'classic',
    baseWeaponId: 'combistick',
    name: 'Glaive d\'Honneur de Maître d\'Armes Machiko',
    loreSourceIds: Object.freeze(['lore_avp_war_noguchi_1995']),
    behavior: 'spear_thrust_throw',
    modifiers: Object.freeze({ damageMultiplier: 1.52, honorParryWindowMs: 400, topKnotBladeEdge: true }),
  }),
  Object.freeze({
    id: 'yautja_wpn_south_china_sea_corrosive_blades',
    armorPresetId: 'classic',
    baseWeaponId: 'wrist_blades',
    name: 'Lames de Poignet Volcaniques Durcies au Soufre',
    loreSourceIds: Object.freeze(['lore_pred_south_china_sea_2008']),
    behavior: 'wrist_blade_strike',
    modifiers: Object.freeze({ damageMultiplier: 1.48, acidResistantEdge: true, volcanicBleedBurn: true }),
  }),
  Object.freeze({
    id: 'yautja_wpn_civil_war_trophy_saber_glaive',
    armorPresetId: 'heavy',
    baseWeaponId: 'combistick',
    name: 'Glaive Hybride à Lame de Cavalerie Confédérée 1863',
    loreSourceIds: Object.freeze(['lore_pred_hell_come_a_walkin_1998']),
    behavior: 'spear_thrust_throw',
    modifiers: Object.freeze({ damageMultiplier: 1.45, armorPenetration: 1.35, cavalryReachBonus: true }),
  }),
  Object.freeze({
    id: 'yautja_wpn_sevastopol_emp_plasma_caster',
    armorPresetId: 'tracker',
    baseWeaponId: 'plasma_caster',
    name: 'Canon Plasma à Impulsion IEM Disruptrice d\'Androïdes',
    loreSourceIds: Object.freeze(['lore_alien_isolation_sevastopol_2014']),
    behavior: 'targeted_plasma_burst',
    modifiers: Object.freeze({ damageMultiplier: 1.4, syntheticStunDurationMs: 2500, empDischargeRadius: 12 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_defiance_rampart_scatter_caster',
    armorPresetId: 'heavy',
    baseWeaponId: 'plasma_caster',
    name: 'Caster Plasma Balayeur de Brèche Spatiale Europa',
    loreSourceIds: Object.freeze(['lore_alien_defiance_2016']),
    behavior: 'targeted_plasma_burst',
    modifiers: Object.freeze({ damageMultiplier: 1.5, wideScatterConeDeg: 45, bulkheadBreachBonus: true }),
  }),
  Object.freeze({
    id: 'yautja_wpn_booty_zero_g_harpoon_anchor',
    armorPresetId: 'tracker',
    baseWeaponId: 'net_gun',
    name: 'Lance-Harpon Magnétique d\'Abordage Zéro-G',
    loreSourceIds: Object.freeze(['lore_avp_booty_1996']),
    behavior: 'tether_and_pull',
    modifiers: Object.freeze({ damageMultiplier: 1.42, zeroGPneumaticTether: true, magneticLockDurationMs: 4000 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_tokyo_holographic_smart_disc',
    armorPresetId: 'classic',
    baseWeaponId: 'smart_disc',
    name: 'Disque Intelligent à Réfraction Holographique Néo-Tokyo',
    loreSourceIds: Object.freeze(['lore_avp_tokyo_1999']),
    behavior: 'guided_disc_ricochet',
    modifiers: Object.freeze({ damageMultiplier: 1.55, holographicDecoyTrail: true, maxBounces: 5 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_kindred_cleaver_glaive',
    armorPresetId: 'classic',
    baseWeaponId: 'combistick',
    name: "Fendoir d'Honneur Yautja de Fleener Creek",
    loreSourceIds: Object.freeze(['lore_pred_kindred_1996']),
    behavior: 'serrated_cleaver_slash',
    modifiers: Object.freeze({"damageMultiplier":1.48,"serratedBleedTick":25,"timberArmorBreach":true}),
  }),
  Object.freeze({
    id: 'yautja_wpn_demons_gold_cursed_spear',
    armorPresetId: 'tracker',
    baseWeaponId: 'combistick',
    name: "Combi-Stick Runique en Or Maudit Ancestral",
    loreSourceIds: Object.freeze(['lore_pred_demons_gold_1997']),
    behavior: 'runic_arc_thrust',
    modifiers: Object.freeze({"damageMultiplier":1.52,"swampConductivityBonus":1.35,"miasmaResistant":true}),
  }),
  Object.freeze({
    id: 'yautja_wpn_female_war_pyro_caster',
    armorPresetId: 'heavy',
    baseWeaponId: 'plasma_caster',
    name: "Canon Plasma Incendiaire de Siège Ruche Mère",
    loreSourceIds: Object.freeze(['lore_alien_female_war_1990']),
    behavior: 'napalm_plasma_burst',
    modifiers: Object.freeze({"damageMultiplier":1.6,"incendiaryResinMelt":true,"splashRadiusMeters":6}),
  }),
  Object.freeze({
    id: 'yautja_wpn_nightmare_neural_flail',
    armorPresetId: 'scout',
    baseWeaponId: 'whip',
    name: "Fléau Articulé Neuro-Perturbateur Anti-Essaim",
    loreSourceIds: Object.freeze(['lore_alien_nightmare_asylum_1989']),
    behavior: 'neural_disruption_sweep',
    modifiers: Object.freeze({"damageMultiplier":1.44,"neuralConfusionDurationMs":3500,"packDisruption":true}),
  }),
  Object.freeze({
    id: 'yautja_wpn_wolf_dual_plasma_combiner',
    armorPresetId: 'heavy',
    baseWeaponId: 'plasma_caster',
    name: "Double Canon Plasma Combiné Synchrone de Wolf",
    loreSourceIds: Object.freeze(['lore_avp_requiem_wolf_2007']),
    behavior: 'synchronized_dual_plasma_lance',
    modifiers: Object.freeze({"damageMultiplier":1.68,"dualStreamFocus":true,"predalienArmorPiercing":true}),
  }),
  Object.freeze({
    id: 'yautja_wpn_xenogenesis_abyssal_trident',
    armorPresetId: 'tracker',
    baseWeaponId: 'combistick',
    name: "Trident Hydro-Pressurisé des Tranchées Abyssales",
    loreSourceIds: Object.freeze(['lore_avp_xenogenesis_2002']),
    behavior: 'supercavitating_trident_impale',
    modifiers: Object.freeze({"damageMultiplier":1.54,"hydrodynamicZeroDrag":true,"pressureShockwaveM":4.5}),
  }),
  Object.freeze({
    id: 'yautja_wpn_dark_ages_crusader_claymore',
    armorPresetId: 'classic',
    baseWeaponId: 'combistick',
    name: "Grande Épée d'Honneur Féodale Yautja à Double Tranchant",
    loreSourceIds: Object.freeze(['lore_pred_dark_ages_1348']),
    behavior: 'feudal_claymore_cleave',
    modifiers: Object.freeze({"damageMultiplier":1.5,"chainmailShatter":true,"parryWindowMs":450}),
  }),
  Object.freeze({
    id: 'yautja_wpn_siberia_cryo_spike_caster',
    armorPresetId: 'tracker',
    baseWeaponId: 'plasma_caster',
    name: "Canon Plasma Glaciaire à Aiguillons Sub-Zéro de Sibérie",
    loreSourceIds: Object.freeze(['lore_pred_cold_war_siberia_1991']),
    behavior: 'cryo_spike_plasma_lance',
    modifiers: Object.freeze({"damageMultiplier":1.54,"frostSlowRatio":0.4,"subZeroArmorIgnore":true}),
  }),
  Object.freeze({
    id: 'yautja_wpn_earth_war_reaper_scythe',
    armorPresetId: 'heavy',
    baseWeaponId: 'combistick',
    name: "Faux Cérémoniale Faucheuse de Ruche de la Terre Dévastée",
    loreSourceIds: Object.freeze(['lore_alien_earth_war_1990']),
    behavior: 'wide_hive_reaper_sweep',
    modifiers: Object.freeze({"damageMultiplier":1.62,"multiTargetCleave":4,"acidSplashDampen":0.5}),
  }),
  Object.freeze({
    id: 'yautja_wpn_thaw_thermal_core_glaive',
    armorPresetId: 'scout',
    baseWeaponId: 'combistick',
    name: "Glaive Thermique à Fusion Réfractaire de la Calotte LV-695",
    loreSourceIds: Object.freeze(['lore_alien_thaw_2023']),
    behavior: 'thermal_fusion_thrust',
    modifiers: Object.freeze({"damageMultiplier":1.46,"cryoThawBurst":true,"armorMeltDurationMs":4000}),
  }),
  Object.freeze({
    id: 'yautja_wpn_lv1201_ancient_disc_blade',
    armorPresetId: 'classic',
    baseWeaponId: 'smart_disc',
    name: "Disque de Choc Ancien à Échappement Plasma de LV-1201",
    loreSourceIds: Object.freeze(['lore_avp_aliens_vs_predator_2_monolith_2001']),
    behavior: 'plasma_exhaust_disc_ricochet',
    modifiers: Object.freeze({"damageMultiplier":1.58,"plasmaTrailingShock":true,"maxBounces":6}),
  }),
  Object.freeze({
    id: 'yautja_wpn_chokehold_pneumatic_grapple',
    armorPresetId: 'tracker',
    baseWeaponId: 'net_gun',
    name: "Harpon Grappin Pneumatique d'Interception en Corridor",
    loreSourceIds: Object.freeze(['lore_avp_chokehold_2004']),
    behavior: 'corridor_grapple_snare',
    modifiers: Object.freeze({"damageMultiplier":1.45,"bulkheadRicochetTether":true,"snareDurationMs":3800}),
  }),
  Object.freeze({
    id: 'yautja_wpn_abyssal_pressurized_combistick',
    armorPresetId: 'warrior',
    baseWeaponId: 'combistick',
    name: "Combistick Hydro-Pressurisé des Abysses Norvégiennes",
    loreSourceIds: Object.freeze(['lore_pred_hell_and_hot_water_1997']),
    behavior: 'hydro_cavitation_strike',
    modifiers: Object.freeze({ damageMultiplier: 1.5, hydroThrustVelocity: true, cavitationShockwave: true }),
  }),
  Object.freeze({
    id: 'yautja_wpn_bayou_swamp_machete_glaive',
    armorPresetId: 'hunter',
    baseWeaponId: 'wrist_blade',
    name: "Glaive de Brume & Machette Caustique du Bayou",
    loreSourceIds: Object.freeze(['lore_pred_strangers_and_aliens_1998']),
    behavior: 'swamp_cleave_slash',
    modifiers: Object.freeze({ damageMultiplier: 1.4, mudSprintBonus: 1.25, criticalLimbSever: true }),
  }),
  Object.freeze({
    id: 'yautja_wpn_synsound_acoustic_resonator',
    armorPresetId: 'stalker',
    baseWeaponId: 'plasma_caster',
    name: "Résonateur de Bio-Fréquences & Dissipateur Acoustique",
    loreSourceIds: Object.freeze(['lore_alien_music_of_the_spears_1996']),
    behavior: 'acoustic_disruption_beam',
    modifiers: Object.freeze({ damageMultiplier: 1.35, sonicStunDurationMs: 2500, silenceRadiusM: 35 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_space_elevator_mag_tether',
    armorPresetId: 'scout',
    baseWeaponId: 'whip',
    name: "Fouet Câblé Magnétique d'Ancrage Orbital",
    loreSourceIds: Object.freeze(['lore_alien_fast_track_to_heaven_2011']),
    behavior: 'orbital_magnetic_lash',
    modifiers: Object.freeze({ damageMultiplier: 1.45, verticalGrappleRangeM: 50, zeroGShockwave: true }),
  }),
  Object.freeze({
    id: 'yautja_wpn_pantha_canopy_prowler_claws',
    armorPresetId: 'berserker',
    baseWeaponId: 'wrist_blade',
    name: "Griffes Prédatrices Arboricoles de la Canopée de Pantha",
    loreSourceIds: Object.freeze(['lore_avp_pantha_2000']),
    behavior: 'canopy_aerial_pounce',
    modifiers: Object.freeze({ damageMultiplier: 1.55, aerialLungeRangeM: 18, bleedDamagePerSec: 42 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_three_world_war_plasma_lance',
    armorPresetId: 'enforcer',
    baseWeaponId: 'combistick',
    name: "Grande Lance Plasmique Tripartite de Caparis VII",
    loreSourceIds: Object.freeze(['lore_avp_three_world_war_2010']),
    behavior: 'dual_point_plasma_thrust',
    modifiers: Object.freeze({ damageMultiplier: 1.6, armorPiercingPercent: 65, vanguardImpactRadiusM: 6 }),
  })
,
  Object.freeze({
    id: 'yautja_wpn_inca_obsidian_glaive',
    armorPresetId: 'hunter',
    baseWeaponId: 'wrist_blades',
    name: "Glaive d'Obsidienne des Andes 1532",
    loreSourceIds: Object.freeze(['lore_pred_demon_of_the_andes_1532']),
    behavior: 'obsidian_fracture_slash',
    modifiers: Object.freeze({ damageMultiplier: 1.45, bleedDurationSeconds: 6, fractureCriticalPercent: 30 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_prime_proving_combistick',
    armorPresetId: 'brawler',
    baseWeaponId: 'combistick',
    name: "Combi-Stick des Arènes de Yautja Prime",
    loreSourceIds: Object.freeze(['lore_pred_homeworld_yautja_prime_legends']),
    behavior: 'basalt_heavy_thrust',
    modifiers: Object.freeze({ damageMultiplier: 1.55, staggerThresholdBonus: 40, magmaThermalDamage: 25 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_pala_magpulse_caster',
    armorPresetId: 'tracker',
    baseWeaponId: 'plasma_caster',
    name: "Canon à Plasma Magnéto-Pulsé de Pala Station",
    loreSourceIds: Object.freeze(['lore_alien_infiltrator_2020']),
    behavior: 'magpulse_accelerated_blast',
    modifiers: Object.freeze({ damageMultiplier: 1.4, projectileSpeedBonusPercent: 35, shieldOverloadDrain: 20 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_sacrifice_cleaver_axe',
    armorPresetId: 'hunter',
    baseWeaponId: 'wrist_blades',
    name: "Couperet d'Ordalie du Monastère du Sacrifice",
    loreSourceIds: Object.freeze(['lore_alien_sacrifice_1993']),
    behavior: 'sacrificial_heavy_cleave',
    modifiers: Object.freeze({ damageMultiplier: 1.5, executionThresholdPercent: 35, heavyKnockbackDistanceM: 5.5 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_endeavor_particle_whip',
    armorPresetId: 'scout',
    baseWeaponId: 'whip',
    name: "Fouet à Faisceau Particulaire USS Endeavor",
    loreSourceIds: Object.freeze(['lore_avp_fireteam_elite_pathogen_war_2022']),
    behavior: 'particle_ionization_sweep',
    modifiers: Object.freeze({ damageMultiplier: 1.5, sweepReachM: 9.5, ionizationArmorReductionPercent: 45 }),
  }),
  Object.freeze({
    id: 'yautja_wpn_gunnison_bio_acid_flail',
    armorPresetId: 'brawler',
    baseWeaponId: 'whip',
    name: "Fléau Bio-Acide du Predalien de Gunnison",
    loreSourceIds: Object.freeze(['lore_avp_predalien_chet_outbreak_2007']),
    behavior: 'acidic_hybrid_lashing',
    modifiers: Object.freeze({ damageMultiplier: 1.6, acidPoolRadiusM: 4.5, corrosiveDecaySeconds: 5.5 }),
  })
]);
const EMPTY_WEAPON_VARIANTS = Object.freeze([]);

const IDS_BY_FIELD = Object.freeze({
  maskId: new Set(MASK_VARIANTS.map(({ id }) => id)),
  skinColorId: new Set(SKIN_PALETTES.map(({ id }) => id)),
  dreadColorId: new Set(DREAD_PALETTES.map(({ id }) => id)),
  armorColorId: new Set(ARMOR_PALETTES.map(({ id }) => id)),
  armorAccentColorId: new Set(ARMOR_ACCENTS.map(({ id }) => id)),
  hunterClassId: new Set(HUNTER_CLASSES.map(({ id }) => id)),
  dreadStyleId: new Set(DREAD_STYLES.map(({ id }) => id)),
  armorFinishId: new Set(ARMOR_FINISHES.map(({ id }) => id)),
  warpaintId: new Set(WARPAINT_PATTERNS.map(({ id }) => id)),
});

export function sanitizeCustomization(value = {}, armorPresetId = DEFAULT_CUSTOMIZATION.armorPresetId) {
  const next = {
    ...DEFAULT_CUSTOMIZATION,
    armorPresetId: typeof armorPresetId === 'string' ? armorPresetId : DEFAULT_CUSTOMIZATION.armorPresetId,
  };

  Object.keys(IDS_BY_FIELD).forEach((field) => {
    if (typeof value[field] === 'string' && IDS_BY_FIELD[field].has(value[field])) next[field] = value[field];
  });
  if (typeof value.armorPresetId === 'string') next.armorPresetId = value.armorPresetId;
  return next;
}

export function getPaletteEntry(entries, id, fallbackId) {
  return entries.find((entry) => entry.id === id)
    ?? entries.find((entry) => entry.id === fallbackId)
    ?? entries[0];
}

export const getPlayableWeaponBySlot = (slot) => PLAYABLE_WEAPONS.find((weapon) => weapon.slot === Number(slot)) ?? null;
export const getPlayableWeaponByKey = (key) => PLAYABLE_WEAPONS.find((weapon) => weapon.key === key) ?? null;
export const getPlayerGadgetById = (id) => PLAYER_GADGETS.find((gadget) => gadget.id === id) ?? null;
export const getPlayerGadgetByKey = (key) => PLAYER_GADGETS.find((gadget) => gadget.key === key) ?? null;
export const getWeaponTechVariantById = (id) => WEAPON_TECH_VARIANTS.find((variant) => variant.id === id)
  ?? ARMOR_PRESET_WEAPON_VARIANTS.find((variant) => variant.id === id)
  ?? null;
export const getWeaponTechVariantsForWeapon = (weaponId) => {
  const variants = WEAPON_TECH_VARIANTS.filter(({ baseWeaponId }) => baseWeaponId === weaponId);
  return variants.length > 0 ? Object.freeze(variants) : EMPTY_WEAPON_VARIANTS;
};
export const getArmorPresetWeaponTechVariant = (armorPresetId, weaponId = 'wristblades') => (
  ARMOR_PRESET_WEAPON_VARIANTS.find((variant) => variant.armorPresetId === armorPresetId && variant.baseWeaponId === weaponId)
  ?? null
);
