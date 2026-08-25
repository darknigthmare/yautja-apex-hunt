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
]);

export const DREAD_STYLES = Object.freeze([
  Object.freeze({ id: 'dread_style_classic', name: 'Predlocks classiques', lengthScale: 1, spreadScale: 1, beadStride: 1 }),
  Object.freeze({ id: 'dread_style_long', name: 'Predlocks longs', lengthScale: 1.35, spreadScale: 0.94, beadStride: 2 }),
  Object.freeze({ id: 'dread_style_braided', name: 'Tresses de chasse', lengthScale: 0.88, spreadScale: 0.72, beadStride: 1 }),
  Object.freeze({ id: 'dread_style_elder', name: 'Couronne d’Ancien', lengthScale: 1.16, spreadScale: 1.28, beadStride: 1 }),
  Object.freeze({ id: 'dread_style_cropped', name: 'Predlocks de pisteur courtes', lengthScale: 0.7, spreadScale: 1.12, beadStride: 2 }),
  Object.freeze({ id: 'dread_style_swept', name: 'Predlocks rejetées', lengthScale: 1.08, spreadScale: 0.82, beadStride: 3 }),
  Object.freeze({ id: 'dread_style_ceremonial', name: 'Parure cérémonielle', lengthScale: 1.28, spreadScale: 1.16, beadStride: 1 }),
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
export const getWeaponTechVariantById = (id) => WEAPON_TECH_VARIANTS.find((variant) => variant.id === id) ?? null;
export const getWeaponTechVariantsForWeapon = (weaponId) => {
  const variants = WEAPON_TECH_VARIANTS.filter(({ baseWeaponId }) => baseWeaponId === weaponId);
  return variants.length > 0 ? Object.freeze(variants) : EMPTY_WEAPON_VARIANTS;
};
