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
});

export const ARMOR_PRESET_MASK_IDS = Object.freeze({
  jungle_1987: 'mask_jungle_hunter_1987', city_1990: 'mask_city_hunter_1990',
  elder_lost_tribe: 'mask_elder_lost_tribe_1990', scar_avp: 'mask_scar_avp',
  celtic_avp: 'mask_celtic_avp', chopper_avp: 'mask_chopper_avp', wolf_avpr: 'mask_wolf_avpr',
  berserker_2010: 'mask_berserker_2010', falconer_2010: 'mask_falconer_2010', tracker_2010: 'mask_tracker_2010',
  feral_2022: 'mask_feral_2022', fugitive_2018: 'mask_fugitive_2018',
  kok_viking_hunter: 'mask_kok_viking', kok_feudal_hunter: 'mask_kok_feudal', kok_wartime_hunter: 'mask_kok_wartime',
  dek_badlands: 'mask_dek_badlands', kwei_badlands: 'mask_kwei_badlands', alpha_yautja: 'mask_alpha_hg',
  captured_hg: 'mask_captured_hg', cleopatra_hg: 'mask_cleopatra_hg', exiled_hg: 'mask_exiled_hg',
  samurai_yautja: 'mask_samurai_hg',
  gladiator_hg: 'mask_gladiator_hg', anubis_hg: 'mask_anubis_hg', exalted_hg: 'mask_exalted_hg',
  witch_hg: 'mask_witch_hg', oni_hg: 'mask_oni_hg', jotun_hg: 'mask_jotun_hg', father_hg: 'mask_father_hg',
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
