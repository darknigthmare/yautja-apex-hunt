import { BIOME_DEFINITIONS, HUNT_DEFINITIONS } from '../data/GameConfig.js';
import {
  HUNTER_CLASSES,
  PLAYER_GADGETS,
  PLAYABLE_WEAPONS,
} from '../data/RuntimeEquipment.js';
import { getYautjaContentById } from '../data/YautjaContentCatalog.js';

export const HUNT_LOADOUT_SCHEMA_VERSION = 1;
export const HUNT_LOADOUT_STORAGE_KEY = 'yautja-apex-hunt-loadouts-v1';
export const MAX_LOADOUT_PRESETS = 12;

export const MANDATORY_LOADOUT_CORE = Object.freeze({
  wristWeaponId: 'wristblades',
  biomaskGadgetId: 'biomask_vision',
  cloakGadgetId: 'optical_cloak',
});

export const LOADOUT_SLOT_DEFINITIONS = Object.freeze({
  melee: Object.freeze({ id: 'melee', label: 'Arme de mêlée', required: true, maxItems: 1 }),
  secondary: Object.freeze({ id: 'secondary', label: 'Arme secondaire', required: true, maxItems: 1 }),
  ranged: Object.freeze({ id: 'ranged', label: 'Arme à distance', required: true, maxItems: 1 }),
  gadgets: Object.freeze({ id: 'gadgets', label: 'Gadgets de chasse', required: true, minItems: 1, maxItems: 2 }),
  support: Object.freeze({ id: 'support', label: 'Équipement médical / rituel', required: true, maxItems: 1 }),
});

// La capacité englobe le poids, l'alimentation et l'encombrement des harnais.
// Les identifiants correspondent exactement aux classes jouables de RuntimeEquipment.
export const CLASS_CAPACITY_BUDGETS = Object.freeze({
  class_hunter: 20,
  class_scout: 18,
  class_berserker: 23,
  class_elder: 22,
  class_tracker: 19,
  class_falconer: 20,
  class_cleaner: 23,
  class_fugitive: 21,
  class_city_stalker: 20,
  class_ritual_initiate: 19,
});

const WEAPON_SLOT_IDS = Object.freeze({
  melee: Object.freeze(['combi_stick', 'whip_thorns', 'father_sword']),
  secondary: Object.freeze(['smart_disc', 'netgun', 'plasma_mines', 'speargun', 'feral_bolt_launcher', 'wrist_rocket']),
  ranged: Object.freeze(['plasmacaster_single', 'wolf_dual_plasma', 'eye_of_ra', 'yautja_bow', 'speargun', 'feral_bolt_launcher']),
  support: Object.freeze(['medicomp']),
});

const OPTIONAL_GADGET_IDS = Object.freeze([
  'wrist_shield',
  'scout_drone',
  'shuriken',
  'voice_mimic',
  'apex_decoy',
]);

const CAPACITY_COSTS = Object.freeze({
  wristblades: 2,
  biomask_vision: 1,
  optical_cloak: 2,
  plasmacaster_single: 4,
  combi_stick: 3,
  smart_disc: 2,
  netgun: 3,
  medicomp: 2,
  plasma_mines: 3,
  whip_thorns: 3,
  yautja_bow: 3,
  speargun: 2,
  feral_bolt_launcher: 2,
  wolf_dual_plasma: 5,
  eye_of_ra: 5,
  father_sword: 4,
  wrist_rocket: 4,
  wrist_shield: 3,
  scout_drone: 2,
  shuriken: 2,
  voice_mimic: 1,
  apex_decoy: 2,
});

const CATALOG_IDS = Object.freeze({
  wristblades: 'tech_wrist_blades',
  biomask_vision: 'tech_biomask',
  optical_cloak: 'tech_cloak',
  plasmacaster_single: 'tech_plasma_caster',
  combi_stick: 'tech_combistick',
  smart_disc: 'tech_smart_disc',
  netgun: 'tech_net_launcher',
  medicomp: 'tech_medicomp',
  yautja_bow: 'tech_yautja_bow',
  speargun: 'tech_speargun',
  feral_bolt_launcher: 'tech_feral_bolt_launcher',
  wolf_dual_plasma: 'tech_wolf_dual_plasma',
  eye_of_ra: 'tech_eye_of_ra_hg',
  father_sword: 'tech_father_yautja_sword_hg',
  wrist_rocket: 'tech_wrist_rocket',
  wrist_shield: 'tech_wrist_shield',
  scout_drone: 'tech_falcon_drone',
  shuriken: 'tech_shuriken_avp',
  voice_mimic: 'tech_voice_mimic',
  apex_decoy: 'tech_apex_decoy',
});

const weaponById = new Map(PLAYABLE_WEAPONS.map((entry) => [entry.id, entry]));
const gadgetById = new Map(PLAYER_GADGETS.map((entry) => [entry.id, entry]));
const hunterClassIds = new Set(HUNTER_CLASSES.map(({ id }) => id));

function freezeArray(value) {
  return Object.freeze([...value]);
}

function buildItemDefinition(id, type, allowedSlots, required = false) {
  const runtime = type === 'weapon' ? weaponById.get(id) : gadgetById.get(id);
  if (!runtime) throw new Error(`Équipement runtime introuvable: ${id}`);
  const catalogId = CATALOG_IDS[id] ?? null;
  return Object.freeze({
    id,
    type,
    name: runtime.name,
    shortName: runtime.shortName ?? runtime.name,
    key: runtime.key,
    keyLabel: runtime.keyLabel ?? runtime.key?.replace('Key', '').replace('Digit', '') ?? '',
    behavior: runtime.behavior,
    capacityCost: CAPACITY_COSTS[id],
    allowedSlots: freezeArray(allowedSlots),
    required,
    catalogId,
    catalogEntry: catalogId ? getYautjaContentById(catalogId) : null,
    runtime,
  });
}

const itemDefinitions = [
  buildItemDefinition(MANDATORY_LOADOUT_CORE.wristWeaponId, 'weapon', ['core'], true),
  buildItemDefinition(MANDATORY_LOADOUT_CORE.biomaskGadgetId, 'gadget', ['core'], true),
  buildItemDefinition(MANDATORY_LOADOUT_CORE.cloakGadgetId, 'gadget', ['core'], true),
  ...PLAYABLE_WEAPONS
    .filter(({ id }) => id !== MANDATORY_LOADOUT_CORE.wristWeaponId)
    .map(({ id }) => buildItemDefinition(
      id,
      'weapon',
      Object.entries(WEAPON_SLOT_IDS)
        .filter(([, ids]) => ids.includes(id))
        .map(([slotId]) => slotId),
    )),
  ...PLAYER_GADGETS
    .filter(({ id }) => OPTIONAL_GADGET_IDS.includes(id))
    .map(({ id }) => buildItemDefinition(id, 'gadget', ['gadgets'])),
];

export const LOADOUT_ITEM_DEFINITIONS = Object.freeze(itemDefinitions);
const itemById = new Map(LOADOUT_ITEM_DEFINITIONS.map((entry) => [entry.id, entry]));

export const getLoadoutItemById = (id) => itemById.get(id) ?? null;
export const getLoadoutItemsForSlot = (slotId) => Object.freeze(
  LOADOUT_ITEM_DEFINITIONS.filter(({ allowedSlots }) => allowedSlots.includes(slotId)),
);

// Incompatibilités physiques/énergétiques du harnais. Le camouflage et le
// bouclier restent transportables ensemble, mais leur activation simultanée
// est signalée comme contrainte opérationnelle plutôt que comme sélection invalide.
export const LOADOUT_INCOMPATIBILITIES = Object.freeze([
  Object.freeze({ ids: Object.freeze(['yautja_bow', 'wrist_shield']), reason: 'Le bouclier déployé bloque l’allonge complète de l’arc.' }),
  Object.freeze({ ids: Object.freeze(['netgun', 'wrist_shield']), reason: 'Le lance-filet et le bouclier réclament le même rail d’avant-bras.' }),
  Object.freeze({ ids: Object.freeze(['wolf_dual_plasma', 'scout_drone']), reason: 'Le double plasma monopolise les liaisons de ciblage du drone-faucon.' }),
  Object.freeze({ ids: Object.freeze(['eye_of_ra', 'apex_decoy']), reason: 'Le projecteur du leurre perturbe la focalisation de l’Eye of Ra.' }),
]);

const DEFAULT_SLOTS = Object.freeze({
  melee: 'combi_stick',
  secondary: 'smart_disc',
  ranged: 'plasmacaster_single',
  gadgets: Object.freeze(['voice_mimic', 'scout_drone']),
  support: 'medicomp',
});

const HUNT_RECOMMENDATIONS = Object.freeze({
  goliath: Object.freeze({ melee: 'combi_stick', secondary: 'smart_disc', ranged: 'yautja_bow', gadgets: Object.freeze(['scout_drone', 'voice_mimic']), support: 'medicomp', reason: 'Allonge, repérage et projectiles silencieux pour briser les appendices.' }),
  xeno_queen: Object.freeze({ melee: 'whip_thorns', secondary: 'netgun', ranged: 'plasmacaster_single', gadgets: Object.freeze(['shuriken', 'voice_mimic']), support: 'medicomp', reason: 'Contrôle des vagues xénomorphes et soin contre les dégâts d’acide.' }),
  bad_blood: Object.freeze({ melee: 'combi_stick', secondary: 'smart_disc', ranged: 'speargun', gadgets: Object.freeze(['scout_drone', 'voice_mimic']), support: 'medicomp', reason: 'Arsenal silencieux et scan pour un duel où le plasma est déconseillé.' }),
  predalien: Object.freeze({ melee: 'whip_thorns', secondary: 'netgun', ranged: 'plasmacaster_single', gadgets: Object.freeze(['shuriken', 'voice_mimic']), support: 'medicomp', reason: 'Contrôle rapproché, immobilisation et secours médical pendant la contamination.' }),
  super_predator: Object.freeze({ melee: 'combi_stick', secondary: 'smart_disc', ranged: 'yautja_bow', gadgets: Object.freeze(['scout_drone', 'apex_decoy']), support: 'medicomp', reason: 'Mobilité, fausses signatures et tir silencieux contre un chasseur rival.' }),
  feral_predator: Object.freeze({ melee: 'combi_stick', secondary: 'smart_disc', ranged: 'feral_bolt_launcher', gadgets: Object.freeze(['scout_drone', 'voice_mimic']), support: 'medicomp', reason: 'Précision mobile pour contourner le bouclier et lire les charges.' }),
  wolf_cleaner: Object.freeze({ melee: 'whip_thorns', secondary: 'smart_disc', ranged: 'plasmacaster_single', gadgets: Object.freeze(['shuriken', 'voice_mimic']), support: 'medicomp', reason: 'Réponse polyvalente aux mines, au fouet et au double plasma.' }),
  kalisk: Object.freeze({ melee: 'combi_stick', secondary: 'plasma_mines', ranged: 'yautja_bow', gadgets: Object.freeze(['scout_drone', 'voice_mimic']), support: 'medicomp', reason: 'Observation des points faibles et pièges pour interrompre la régénération.' }),
  upgrade_predator: Object.freeze({ melee: 'father_sword', secondary: 'smart_disc', ranged: 'speargun', gadgets: Object.freeze(['scout_drone', 'voice_mimic']), support: 'medicomp', reason: 'Impact lourd et précision pour rompre la bio-armure sans saturer l’énergie.' }),
  city_hunter: Object.freeze({ melee: 'combi_stick', secondary: 'netgun', ranged: 'speargun', gadgets: Object.freeze(['scout_drone', 'voice_mimic']), support: 'medicomp', reason: 'Configuration urbaine silencieuse avec contrôle des toits et des ruelles.' }),
  grid_alien: Object.freeze({ melee: 'combi_stick', secondary: 'smart_disc', ranged: 'yautja_bow', gadgets: Object.freeze(['shuriken', 'voice_mimic']), support: 'medicomp', reason: 'Mobilité rituelle et armes tranchantes pour la pyramide en mouvement.' }),
});

const BIOME_RECOMMENDATIONS = Object.freeze({
  jungle: HUNT_RECOMMENDATIONS.goliath,
  hive_lv426: HUNT_RECOMMENDATIONS.xeno_queen,
  ryushi_desert: HUNT_RECOMMENDATIONS.goliath,
  yautja_prime: HUNT_RECOMMENDATIONS.bad_blood,
  genna_deathworld: HUNT_RECOMMENDATIONS.kalisk,
  stargazer_blacksite: HUNT_RECOMMENDATIONS.upgrade_predator,
  los_angeles_1997: HUNT_RECOMMENDATIONS.city_hunter,
  bouvetoya_pyramid: HUNT_RECOMMENDATIONS.grid_alien,
  gunnison_outbreak: HUNT_RECOMMENDATIONS.predalien,
});

function normalizeClassId(value) {
  return hunterClassIds.has(value) ? value : 'class_hunter';
}

function normalizeString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function uniqueStrings(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((entry) => typeof entry === 'string' && entry.trim()).map((entry) => entry.trim()))];
}

function cloneSlots(slots = DEFAULT_SLOTS) {
  return {
    melee: slots.melee ?? null,
    secondary: slots.secondary ?? null,
    ranged: slots.ranged ?? null,
    gadgets: [...(slots.gadgets ?? [])],
    support: slots.support ?? null,
  };
}

function freezeLoadout(loadout) {
  return Object.freeze({
    schemaVersion: HUNT_LOADOUT_SCHEMA_VERSION,
    hunterClassId: loadout.hunterClassId,
    core: Object.freeze({ ...MANDATORY_LOADOUT_CORE }),
    slots: Object.freeze({
      melee: loadout.slots.melee,
      secondary: loadout.slots.secondary,
      ranged: loadout.slots.ranged,
      gadgets: freezeArray(loadout.slots.gadgets),
      support: loadout.slots.support,
    }),
  });
}

export function createDefaultHuntLoadout(hunterClassId = 'class_hunter') {
  return freezeLoadout({
    hunterClassId: normalizeClassId(hunterClassId),
    slots: cloneSlots(),
  });
}

function legacySlots(value) {
  const weapons = uniqueStrings(value?.weapons ?? value?.selectedWeaponIds);
  const gadgets = uniqueStrings(value?.gadgets ?? value?.selectedGadgetIds);
  const pick = (slotId) => weapons.find((id) => WEAPON_SLOT_IDS[slotId].includes(id)) ?? null;
  return {
    melee: pick('melee'),
    secondary: pick('secondary'),
    ranged: pick('ranged'),
    gadgets: gadgets.filter((id) => OPTIONAL_GADGET_IDS.includes(id)).slice(0, 2),
    support: pick('support'),
  };
}

export function sanitizeHuntLoadout(value = {}, { fillDefaults = false } = {}) {
  const hunterClassId = normalizeClassId(value?.hunterClassId);
  const sourceSlots = value?.slots && typeof value.slots === 'object'
    ? value.slots
    : legacySlots(value);
  const fallback = fillDefaults ? DEFAULT_SLOTS : {};
  const selectWeapon = (slotId) => {
    const candidate = normalizeString(sourceSlots?.[slotId]);
    if (candidate && WEAPON_SLOT_IDS[slotId].includes(candidate)) return candidate;
    return fallback[slotId] ?? null;
  };
  let gadgets = uniqueStrings(sourceSlots?.gadgets)
    .filter((id) => OPTIONAL_GADGET_IDS.includes(id))
    .slice(0, LOADOUT_SLOT_DEFINITIONS.gadgets.maxItems);
  if (fillDefaults && gadgets.length === 0) gadgets = [...DEFAULT_SLOTS.gadgets];

  return freezeLoadout({
    hunterClassId,
    slots: {
      melee: selectWeapon('melee'),
      secondary: selectWeapon('secondary'),
      ranged: selectWeapon('ranged'),
      gadgets,
      support: selectWeapon('support'),
    },
  });
}

export function getEquippedLoadoutItemIds(loadout) {
  const normalized = sanitizeHuntLoadout(loadout);
  return freezeArray([
    MANDATORY_LOADOUT_CORE.wristWeaponId,
    MANDATORY_LOADOUT_CORE.biomaskGadgetId,
    MANDATORY_LOADOUT_CORE.cloakGadgetId,
    normalized.slots.melee,
    normalized.slots.secondary,
    normalized.slots.ranged,
    ...normalized.slots.gadgets,
    normalized.slots.support,
  ].filter(Boolean));
}

export function getLoadoutCapacity(loadout) {
  const normalized = sanitizeHuntLoadout(loadout);
  const budget = CLASS_CAPACITY_BUDGETS[normalized.hunterClassId] ?? CLASS_CAPACITY_BUDGETS.class_hunter;
  const used = getEquippedLoadoutItemIds(normalized)
    .reduce((total, id) => total + (CAPACITY_COSTS[id] ?? 0), 0);
  return Object.freeze({ used, budget, remaining: budget - used, exceeded: Math.max(0, used - budget) });
}

export function getLoadoutCapacityLabel(loadout) {
  const { used, budget, remaining } = getLoadoutCapacity(loadout);
  return remaining >= 0
    ? `CAPACITÉ ${used}/${budget} · ${remaining} libre${remaining > 1 ? 's' : ''}`
    : `SURCHARGE ${used}/${budget} · ${Math.abs(remaining)} au-dessus de la limite`;
}

function issue(code, message, field = null, itemIds = []) {
  return Object.freeze({ code, message, field, itemIds: freezeArray(itemIds) });
}

function selectedIdsFromUntrusted(value) {
  const slots = value?.slots && typeof value.slots === 'object' ? value.slots : legacySlots(value);
  return [
    normalizeString(slots?.melee),
    normalizeString(slots?.secondary),
    normalizeString(slots?.ranged),
    ...uniqueStrings(slots?.gadgets),
    normalizeString(slots?.support),
  ].filter(Boolean);
}

export function validateHuntLoadout(value, {
  unlockedWeaponIds = null,
  unlockedGadgetIds = null,
  requireComplete = true,
} = {}) {
  const errors = [];
  const warnings = [];
  const normalized = sanitizeHuntLoadout(value);
  const rawClassId = normalizeString(value?.hunterClassId);
  if (rawClassId && !hunterClassIds.has(rawClassId)) {
    errors.push(issue('unknown_class', `Classe de chasseur inconnue : ${rawClassId}.`, 'hunterClassId'));
  }

  const rawCore = value?.core;
  if (rawCore && (
    rawCore.wristWeaponId !== MANDATORY_LOADOUT_CORE.wristWeaponId
    || rawCore.biomaskGadgetId !== MANDATORY_LOADOUT_CORE.biomaskGadgetId
    || rawCore.cloakGadgetId !== MANDATORY_LOADOUT_CORE.cloakGadgetId
  )) {
    errors.push(issue('mandatory_core_changed', 'Les wristblades, le biomasque et le camouflage sont obligatoires et ne peuvent pas être remplacés.', 'core'));
  }

  const rawSlots = value?.slots && typeof value.slots === 'object' ? value.slots : legacySlots(value);
  for (const slotId of ['melee', 'secondary', 'ranged', 'support']) {
    const selected = normalizeString(rawSlots?.[slotId]);
    if (selected && !WEAPON_SLOT_IDS[slotId].includes(selected)) {
      errors.push(issue('wrong_slot', `${selected} ne peut pas être placé dans « ${LOADOUT_SLOT_DEFINITIONS[slotId].label} ».`, `slots.${slotId}`, [selected]));
    } else if (requireComplete && !normalized.slots[slotId]) {
      errors.push(issue('required_slot_empty', `Le slot « ${LOADOUT_SLOT_DEFINITIONS[slotId].label} » doit être équipé avant le départ.`, `slots.${slotId}`));
    }
  }

  const rawGadgets = uniqueStrings(rawSlots?.gadgets);
  const unknownGadgets = rawGadgets.filter((id) => !OPTIONAL_GADGET_IDS.includes(id));
  unknownGadgets.forEach((id) => errors.push(issue('wrong_slot', `${id} n’est pas un gadget optionnel équipable.`, 'slots.gadgets', [id])));
  if (rawGadgets.length > LOADOUT_SLOT_DEFINITIONS.gadgets.maxItems) {
    errors.push(issue('too_many_gadgets', 'Deux gadgets optionnels maximum peuvent être emportés.', 'slots.gadgets', rawGadgets));
  }
  if (requireComplete && normalized.slots.gadgets.length < LOADOUT_SLOT_DEFINITIONS.gadgets.minItems) {
    errors.push(issue('required_slot_empty', 'Au moins un gadget de chasse doit être sélectionné.', 'slots.gadgets'));
  }

  const allOptionalIds = selectedIdsFromUntrusted(value);
  const duplicateIds = allOptionalIds.filter((id, index) => allOptionalIds.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    errors.push(issue('duplicate_item', `Un équipement ne peut occuper plusieurs slots : ${[...new Set(duplicateIds)].join(', ')}.`, 'slots', duplicateIds));
  }

  const weaponUnlocks = Array.isArray(unlockedWeaponIds) ? new Set(unlockedWeaponIds) : null;
  const gadgetUnlocks = Array.isArray(unlockedGadgetIds) ? new Set(unlockedGadgetIds) : null;
  if (weaponUnlocks) {
    allOptionalIds.filter((id) => weaponById.has(id) && !weaponUnlocks.has(id))
      .forEach((id) => errors.push(issue('locked_item', `${weaponById.get(id).name} n’est pas encore débloqué.`, 'slots', [id])));
  }
  if (gadgetUnlocks) {
    allOptionalIds.filter((id) => gadgetById.has(id) && !gadgetUnlocks.has(id))
      .forEach((id) => errors.push(issue('locked_item', `${gadgetById.get(id).name} n’est pas encore débloqué.`, 'slots.gadgets', [id])));
  }

  const equippedIds = new Set(getEquippedLoadoutItemIds(normalized));
  LOADOUT_INCOMPATIBILITIES.forEach(({ ids, reason }) => {
    if (ids.every((id) => equippedIds.has(id))) {
      errors.push(issue('incompatible_items', `Équipements incompatibles : ${reason}`, 'slots', ids));
    }
  });
  if (equippedIds.has('wrist_shield') && equippedIds.has(MANDATORY_LOADOUT_CORE.cloakGadgetId)) {
    warnings.push(issue('exclusive_activation', 'Le bouclier de poignet désactive temporairement le camouflage lorsqu’il est déployé.', 'slots.gadgets', ['wrist_shield', 'optical_cloak']));
  }

  const capacity = getLoadoutCapacity(normalized);
  if (capacity.exceeded > 0) {
    errors.push(issue('capacity_exceeded', `Capacité dépassée de ${capacity.exceeded} point${capacity.exceeded > 1 ? 's' : ''} pour la classe sélectionnée.`, 'capacity', getEquippedLoadoutItemIds(normalized)));
  }

  // Un ancien payload qui exposait tout l’arsenal doit être refusé clairement,
  // même si sa normalisation ne conserve que les premiers slots.
  const legacyWeapons = uniqueStrings(value?.weapons ?? value?.selectedWeaponIds);
  const legacyGadgets = uniqueStrings(value?.gadgets ?? value?.selectedGadgetIds);
  if (legacyWeapons.length > 4 || legacyGadgets.length > 2) {
    errors.push(issue('legacy_full_arsenal', 'L’arsenal complet n’est plus autorisé : configurez les slots de chasse limités.', 'slots', [...legacyWeapons, ...legacyGadgets]));
  }

  return Object.freeze({
    valid: errors.length === 0,
    loadout: normalized,
    errors: freezeArray(errors),
    warnings: freezeArray(warnings),
    capacity,
    capacityLabel: getLoadoutCapacityLabel(normalized),
  });
}

function chooseUnlocked(ids, unlockedSet, used = new Set()) {
  return ids.find((id) => !used.has(id) && (!unlockedSet || unlockedSet.has(id))) ?? null;
}

function repairRecommendation(template, hunterClassId, { unlockedWeaponIds = null, unlockedGadgetIds = null } = {}) {
  const weaponUnlocks = Array.isArray(unlockedWeaponIds) ? new Set(unlockedWeaponIds) : null;
  const gadgetUnlocks = Array.isArray(unlockedGadgetIds) ? new Set(unlockedGadgetIds) : null;
  const used = new Set([MANDATORY_LOADOUT_CORE.wristWeaponId]);
  const pickWeapon = (slotId, preferred) => {
    const candidates = [preferred, ...WEAPON_SLOT_IDS[slotId]]
      .filter((id, index, entries) => id && entries.indexOf(id) === index);
    const selected = chooseUnlocked(candidates, weaponUnlocks, used);
    if (selected) used.add(selected);
    return selected;
  };
  const slots = {
    melee: pickWeapon('melee', template.melee),
    secondary: pickWeapon('secondary', template.secondary),
    ranged: pickWeapon('ranged', template.ranged),
    gadgets: [
      ...template.gadgets,
      'voice_mimic',
      'shuriken',
      'scout_drone',
      'apex_decoy',
      'wrist_shield',
    ].filter((id, index, entries) => OPTIONAL_GADGET_IDS.includes(id)
      && entries.indexOf(id) === index
      && (!gadgetUnlocks || gadgetUnlocks.has(id)))
      .slice(0, 2),
    support: pickWeapon('support', template.support),
  };
  let loadout = sanitizeHuntLoadout({ hunterClassId, slots });

  // On retire d’abord le deuxième gadget, puis on remplace les pièces les plus
  // lourdes par une option compatible. Les slots obligatoires restent remplis.
  if (getLoadoutCapacity(loadout).exceeded > 0 && loadout.slots.gadgets.length > 1) {
    loadout = sanitizeHuntLoadout({ ...loadout, slots: { ...loadout.slots, gadgets: loadout.slots.gadgets.slice(0, 1) } });
  }
  const orderedFallbacks = {
    ranged: ['feral_bolt_launcher', 'speargun', 'yautja_bow', 'plasmacaster_single'],
    secondary: ['smart_disc', 'speargun', 'feral_bolt_launcher', 'netgun'],
    melee: ['combi_stick', 'whip_thorns', 'father_sword'],
  };
  for (const slotId of ['ranged', 'secondary', 'melee']) {
    if (getLoadoutCapacity(loadout).exceeded <= 0) break;
    const occupiedElsewhere = new Set([
      loadout.slots.melee,
      loadout.slots.secondary,
      loadout.slots.ranged,
    ].filter((id) => id !== loadout.slots[slotId]));
    const replacement = orderedFallbacks[slotId]
      .filter((id) => WEAPON_SLOT_IDS[slotId].includes(id))
      .filter((id) => !weaponUnlocks || weaponUnlocks.has(id))
      .filter((id) => !occupiedElsewhere.has(id))
      .sort((left, right) => CAPACITY_COSTS[left] - CAPACITY_COSTS[right])[0];
    if (replacement) loadout = sanitizeHuntLoadout({ ...loadout, slots: { ...loadout.slots, [slotId]: replacement } });
  }
  return loadout;
}

export function getRecommendedHuntLoadout({
  huntType = null,
  biomeId = null,
  bossType = null,
  hunterClassId = 'class_hunter',
  unlockedWeaponIds = null,
  unlockedGadgetIds = null,
} = {}) {
  const hunt = normalizeString(huntType) && HUNT_DEFINITIONS[huntType] ? HUNT_DEFINITIONS[huntType] : null;
  const huntFromBoss = normalizeString(bossType)
    ? Object.values(HUNT_DEFINITIONS).find((entry) => entry.bossType === bossType)
    : null;
  const resolvedHunt = hunt ?? huntFromBoss;
  const resolvedBiomeId = BIOME_DEFINITIONS[biomeId]
    ? biomeId
    : resolvedHunt?.recommendedBiome;
  const template = HUNT_RECOMMENDATIONS[resolvedHunt?.id]
    ?? BIOME_RECOMMENDATIONS[resolvedBiomeId]
    ?? HUNT_RECOMMENDATIONS.goliath;
  const loadout = repairRecommendation(template, normalizeClassId(hunterClassId), { unlockedWeaponIds, unlockedGadgetIds });
  const validation = validateHuntLoadout(loadout, { unlockedWeaponIds, unlockedGadgetIds });
  return Object.freeze({
    loadout,
    validation,
    huntType: resolvedHunt?.id ?? null,
    biomeId: resolvedBiomeId ?? (BIOME_DEFINITIONS[biomeId] ? biomeId : 'jungle'),
    reason: template.reason,
  });
}

export function isWeaponEquipped(loadout, idOrSlot) {
  const normalized = sanitizeHuntLoadout(loadout);
  const weapon = typeof idOrSlot === 'number' || /^\d+$/.test(String(idOrSlot ?? ''))
    ? PLAYABLE_WEAPONS.find(({ slot }) => slot === Number(idOrSlot))
    : weaponById.get(idOrSlot);
  if (!weapon) return false;
  return [
    MANDATORY_LOADOUT_CORE.wristWeaponId,
    normalized.slots.melee,
    normalized.slots.secondary,
    normalized.slots.ranged,
    normalized.slots.support,
  ].includes(weapon.id);
}

export function isGadgetEquipped(loadout, idOrKey) {
  const normalized = sanitizeHuntLoadout(loadout);
  const gadget = gadgetById.get(idOrKey)
    ?? PLAYER_GADGETS.find(({ key }) => key === idOrKey);
  if (!gadget) return false;
  return [
    MANDATORY_LOADOUT_CORE.biomaskGadgetId,
    MANDATORY_LOADOUT_CORE.cloakGadgetId,
    ...normalized.slots.gadgets,
  ].includes(gadget.id);
}

function cleanPresetName(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, 40) || 'Preset de chasse';
}

function cleanPresetId(value) {
  const id = normalizeString(value)?.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
  return id || null;
}

function createPresetId(name, nowValue) {
  const slug = cleanPresetName(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 24) || 'chasse';
  const stamp = String(Date.parse(nowValue) || Date.now()).slice(-8);
  return `preset-${slug}-${stamp}`;
}

export function createDefaultHuntLoadoutState(hunterClassId = 'class_hunter') {
  return Object.freeze({
    version: HUNT_LOADOUT_SCHEMA_VERSION,
    activeLoadout: createDefaultHuntLoadout(hunterClassId),
    activePresetId: null,
    presets: Object.freeze([]),
  });
}

function normalizePreset(rawPreset, index, options) {
  if (!rawPreset || typeof rawPreset !== 'object') return null;
  const nowValue = options.now();
  const loadout = repairLoadout(rawPreset.loadout ?? rawPreset, options);
  const id = cleanPresetId(rawPreset.id) ?? `preset-migre-${index + 1}`;
  return Object.freeze({
    id,
    name: cleanPresetName(rawPreset.name ?? `Preset ${index + 1}`),
    createdAt: normalizeString(rawPreset.createdAt) ?? nowValue,
    updatedAt: normalizeString(rawPreset.updatedAt) ?? nowValue,
    loadout,
  });
}

function repairLoadout(rawLoadout, options = {}) {
  let loadout = sanitizeHuntLoadout(rawLoadout, { fillDefaults: true });
  const validationOptions = {
    unlockedWeaponIds: options.unlockedWeaponIds ?? null,
    unlockedGadgetIds: options.unlockedGadgetIds ?? null,
  };
  const recommendation = getRecommendedHuntLoadout({
    huntType: options.huntType,
    biomeId: options.biomeId,
    bossType: options.bossType,
    hunterClassId: loadout.hunterClassId,
    ...validationOptions,
  }).loadout;
  const slots = cloneSlots(loadout.slots);
  for (const slotId of ['melee', 'secondary', 'ranged', 'support']) {
    if (!slots[slotId]) slots[slotId] = recommendation.slots[slotId];
  }
  if (slots.gadgets.length === 0) slots.gadgets = [...recommendation.slots.gadgets];
  loadout = sanitizeHuntLoadout({ ...loadout, slots });
  const validation = validateHuntLoadout(loadout, validationOptions);
  return validation.valid ? loadout : recommendation;
}

export function deserializeHuntLoadoutState(serialized, options = {}) {
  const now = typeof options.now === 'function' ? options.now : () => new Date().toISOString();
  const normalizedOptions = { ...options, now };
  let parsed = serialized;
  let recovered = false;
  const errors = [];
  if (typeof serialized === 'string') {
    try {
      parsed = JSON.parse(serialized);
    } catch {
      parsed = null;
      recovered = true;
      errors.push('Sauvegarde de loadout illisible : configuration par défaut restaurée.');
    }
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return Object.freeze({
      state: createDefaultHuntLoadoutState(options.hunterClassId),
      migrated: false,
      recovered: true,
      errors: freezeArray(errors.length ? errors : ['Sauvegarde de loadout absente ou invalide.']),
    });
  }

  const isCurrent = parsed.version === HUNT_LOADOUT_SCHEMA_VERSION && parsed.activeLoadout;
  const activeSource = parsed.activeLoadout ?? parsed.loadout ?? parsed;
  const activeLoadout = repairLoadout(activeSource, normalizedOptions);
  const sourcePresets = Array.isArray(parsed.presets) ? parsed.presets : [];
  const seenIds = new Set();
  const presets = sourcePresets
    .map((preset, index) => normalizePreset(preset, index, normalizedOptions))
    .filter(Boolean)
    .filter(({ id }) => {
      if (seenIds.has(id)) return false;
      seenIds.add(id);
      return true;
    })
    .slice(0, MAX_LOADOUT_PRESETS);
  const activePresetId = cleanPresetId(parsed.activePresetId);
  const state = Object.freeze({
    version: HUNT_LOADOUT_SCHEMA_VERSION,
    activeLoadout,
    activePresetId: presets.some(({ id }) => id === activePresetId) ? activePresetId : null,
    presets: freezeArray(presets),
  });
  return Object.freeze({
    state,
    migrated: !isCurrent,
    recovered,
    errors: freezeArray(errors),
  });
}

export function serializeHuntLoadoutState(state) {
  const { state: normalized } = deserializeHuntLoadoutState(state);
  return JSON.stringify(normalized);
}

export function saveHuntLoadoutPreset(state, {
  id = null,
  name = 'Preset de chasse',
  loadout = state?.activeLoadout,
} = {}, options = {}) {
  const now = typeof options.now === 'function' ? options.now : () => new Date().toISOString();
  const nowValue = now();
  const normalizedState = deserializeHuntLoadoutState(state, { ...options, now }).state;
  const validation = validateHuntLoadout(loadout, options);
  if (!validation.valid) return Object.freeze({ saved: false, state: normalizedState, validation, preset: null });
  const normalizedLoadout = validation.loadout;

  const presetId = cleanPresetId(id) ?? createPresetId(name, nowValue);
  const existing = normalizedState.presets.find((preset) => preset.id === presetId);
  const preset = Object.freeze({
    id: presetId,
    name: cleanPresetName(name),
    createdAt: existing?.createdAt ?? nowValue,
    updatedAt: nowValue,
    loadout: normalizedLoadout,
  });
  const presets = [
    ...normalizedState.presets.filter(({ id: candidateId }) => candidateId !== presetId),
    preset,
  ].slice(-MAX_LOADOUT_PRESETS);
  const nextState = Object.freeze({
    version: HUNT_LOADOUT_SCHEMA_VERSION,
    activeLoadout: normalizedLoadout,
    activePresetId: presetId,
    presets: freezeArray(presets),
  });
  return Object.freeze({ saved: true, state: nextState, validation, preset });
}

export function deleteHuntLoadoutPreset(state, presetId) {
  const normalizedState = deserializeHuntLoadoutState(state).state;
  const id = cleanPresetId(presetId);
  const presets = normalizedState.presets.filter((preset) => preset.id !== id);
  return Object.freeze({
    ...normalizedState,
    activePresetId: normalizedState.activePresetId === id ? null : normalizedState.activePresetId,
    presets: freezeArray(presets),
  });
}

export function activateHuntLoadoutPreset(state, presetId, options = {}) {
  const normalizedState = deserializeHuntLoadoutState(state, options).state;
  const preset = normalizedState.presets.find(({ id }) => id === presetId);
  if (!preset) return Object.freeze({ activated: false, state: normalizedState, validation: null });
  const validation = validateHuntLoadout(preset.loadout, options);
  if (!validation.valid) return Object.freeze({ activated: false, state: normalizedState, validation });
  return Object.freeze({
    activated: true,
    validation,
    state: Object.freeze({ ...normalizedState, activeLoadout: preset.loadout, activePresetId: preset.id }),
  });
}

export class HuntLoadoutSystem {
  constructor({
    storage = globalThis.localStorage ?? null,
    storageKey = HUNT_LOADOUT_STORAGE_KEY,
    now = () => new Date().toISOString(),
  } = {}) {
    this.storage = storage;
    this.storageKey = storageKey;
    this.tempKey = `${storageKey}-tmp`;
    this.now = now;
    this.state = createDefaultHuntLoadoutState();
  }

  load(options = {}) {
    if (!this.storage) return Object.freeze({ state: this.state, migrated: false, recovered: false, errors: Object.freeze([]) });
    const main = this.storage.getItem(this.storageKey);
    const temporary = this.storage.getItem(this.tempKey);
    const temporaryResult = temporary
      ? deserializeHuntLoadoutState(temporary, { ...options, now: this.now })
      : null;
    const mainResult = main
      ? deserializeHuntLoadoutState(main, { ...options, now: this.now })
      : null;
    // Le temporaire est écrit avant la principale : s'il est valide, il est la
    // copie la plus récente après une interruption entre les deux écritures.
    const result = (temporaryResult && !temporaryResult.recovered ? temporaryResult : null)
      ?? (mainResult && !mainResult.recovered ? mainResult : null)
      ?? temporaryResult
      ?? mainResult
      ?? Object.freeze({ state: createDefaultHuntLoadoutState(options.hunterClassId), migrated: false, recovered: false, errors: Object.freeze([]) });
    this.state = result.state;
    if (temporary || result.migrated || result.recovered) this.save(this.state);
    return result;
  }

  save(state = this.state, options = {}) {
    const result = deserializeHuntLoadoutState(state, { ...options, now: this.now });
    this.state = result.state;
    if (!this.storage) return Object.freeze({ saved: false, reason: 'storage_unavailable', state: this.state });
    try {
      const serialized = JSON.stringify(this.state);
      this.storage.setItem(this.tempKey, serialized);
      this.storage.setItem(this.storageKey, serialized);
      this.storage.removeItem(this.tempKey);
      return Object.freeze({ saved: true, state: this.state });
    } catch (error) {
      return Object.freeze({ saved: false, reason: 'storage_error', error, state: this.state });
    }
  }

  setActiveLoadout(loadout, options = {}) {
    const validation = validateHuntLoadout(loadout, options);
    if (!validation.valid) return Object.freeze({ applied: false, validation, state: this.state });
    this.state = Object.freeze({ ...this.state, activeLoadout: validation.loadout, activePresetId: null });
    const persistence = this.save(this.state, options);
    return Object.freeze({ applied: true, validation, state: this.state, persistence });
  }

  savePreset(preset, options = {}) {
    const result = saveHuntLoadoutPreset(this.state, preset, { ...options, now: this.now });
    if (result.saved) {
      this.state = result.state;
      this.save(this.state, options);
    }
    return result;
  }

  deletePreset(presetId) {
    const existed = this.state.presets.some(({ id }) => id === presetId);
    this.state = deleteHuntLoadoutPreset(this.state, presetId);
    const persistence = this.save(this.state);
    return Object.freeze({ deleted: existed, state: this.state, persistence });
  }

  activatePreset(presetId, options = {}) {
    const result = activateHuntLoadoutPreset(this.state, presetId, options);
    if (result.activated) {
      this.state = result.state;
      this.save(this.state, options);
    }
    return result;
  }

  recommend(options = {}) {
    return getRecommendedHuntLoadout(options);
  }

  isWeaponEquipped(idOrSlot) {
    return isWeaponEquipped(this.state.activeLoadout, idOrSlot);
  }

  isGadgetEquipped(idOrKey) {
    return isGadgetEquipped(this.state.activeLoadout, idOrKey);
  }
}
