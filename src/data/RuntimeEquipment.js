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
]);

export const DREAD_STYLES = Object.freeze([
  Object.freeze({ id: 'dread_style_classic', name: 'Predlocks classiques', lengthScale: 1, spreadScale: 1, beadStride: 1 }),
  Object.freeze({ id: 'dread_style_long', name: 'Predlocks longs', lengthScale: 1.35, spreadScale: 0.94, beadStride: 2 }),
  Object.freeze({ id: 'dread_style_braided', name: 'Tresses de chasse', lengthScale: 0.88, spreadScale: 0.72, beadStride: 1 }),
  Object.freeze({ id: 'dread_style_elder', name: 'Couronne d’Ancien', lengthScale: 1.16, spreadScale: 1.28, beadStride: 1 }),
]);

export const ARMOR_FINISHES = Object.freeze([
  Object.freeze({ id: 'finish_hunter_worn', name: 'Usée par la chasse', metalness: 0.76, roughness: 0.56 }),
  Object.freeze({ id: 'finish_polished', name: 'Alliage poli', metalness: 0.98, roughness: 0.12 }),
  Object.freeze({ id: 'finish_ritual', name: 'Gravure rituelle', metalness: 0.88, roughness: 0.3, emissiveIntensity: 0.12 }),
  Object.freeze({ id: 'finish_bone', name: 'Composite osseux', metalness: 0.24, roughness: 0.72 }),
]);

export const WARPAINT_PATTERNS = Object.freeze([
  Object.freeze({ id: 'warpaint_none', name: 'Sans marquage', color: 0x000000, pattern: 'none' }),
  Object.freeze({ id: 'warpaint_blooded', name: 'Marque du Sang', color: 0x7d1418, pattern: 'brow' }),
  Object.freeze({ id: 'warpaint_claw', name: 'Trois griffes', color: 0xd7c18b, pattern: 'claw' }),
  Object.freeze({ id: 'warpaint_elder', name: 'Glyphes d’Ancien Apex', color: 0x2ff6e5, pattern: 'elder' }),
]);

export const PLAYER_GADGETS = Object.freeze([
  Object.freeze({ id: 'wrist_shield', key: 'KeyB', keyLabel: 'B', name: 'Bouclier de poignet', energyCost: 25, cooldown: 8 }),
  Object.freeze({ id: 'scout_drone', key: 'KeyG', keyLabel: 'G', name: 'Drone-faucon', energyCost: 20, cooldown: 14 }),
  Object.freeze({ id: 'shuriken', key: 'KeyT', keyLabel: 'T', name: 'Shuriken AVP', energyCost: 12, cooldown: 2.4 }),
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
]);

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
