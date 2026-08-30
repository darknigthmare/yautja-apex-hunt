import assert from 'node:assert/strict';
import test from 'node:test';
import { HUNT_DEFINITIONS } from '../src/data/GameConfig.js';
import {
  HUNTER_CLASSES,
  PLAYER_GADGETS,
  PLAYABLE_WEAPONS,
} from '../src/data/RuntimeEquipment.js';
import { getYautjaContentById } from '../src/data/YautjaContentCatalog.js';
import {
  CLASS_CAPACITY_BUDGETS,
  HUNT_LOADOUT_SCHEMA_VERSION,
  HuntLoadoutSystem,
  LOADOUT_INCOMPATIBILITIES,
  LOADOUT_ITEM_DEFINITIONS,
  MANDATORY_LOADOUT_CORE,
  MAX_LOADOUT_PRESETS,
  activateHuntLoadoutPreset,
  createDefaultHuntLoadout,
  createDefaultHuntLoadoutState,
  deleteHuntLoadoutPreset,
  deserializeHuntLoadoutState,
  getEquippedLoadoutItemIds,
  getLoadoutCapacity,
  getLoadoutCapacityLabel,
  getLoadoutItemById,
  getLoadoutItemsForSlot,
  getRecommendedHuntLoadout,
  isGadgetEquipped,
  isWeaponEquipped,
  sanitizeHuntLoadout,
  saveHuntLoadoutPreset,
  serializeHuntLoadoutState,
  validateHuntLoadout,
} from '../src/gameplay/HuntLoadoutSystem.js';

const FIXED_NOW = '2026-08-30T12:00:00.000Z';
const now = () => FIXED_NOW;

function makeStorage() {
  const values = new Map();
  return {
    values,
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

test('le registre de loadout référence uniquement les armes, gadgets, classes et entrées lore réels', () => {
  const weaponIds = new Set(PLAYABLE_WEAPONS.map(({ id }) => id));
  const gadgetIds = new Set(PLAYER_GADGETS.map(({ id }) => id));
  const classIds = new Set(HUNTER_CLASSES.map(({ id }) => id));

  assert.equal(LOADOUT_ITEM_DEFINITIONS.length, PLAYABLE_WEAPONS.length + PLAYER_GADGETS.length);
  assert.equal(new Set(LOADOUT_ITEM_DEFINITIONS.map(({ id }) => id)).size, LOADOUT_ITEM_DEFINITIONS.length);
  LOADOUT_ITEM_DEFINITIONS.forEach((item) => {
    assert.ok(item.type === 'weapon' ? weaponIds.has(item.id) : gadgetIds.has(item.id), item.id);
    assert.ok(Number.isInteger(item.capacityCost) && item.capacityCost > 0, item.id);
    assert.equal(Object.isFrozen(item), true, item.id);
    assert.equal(Object.isFrozen(item.allowedSlots), true, item.id);
    if (item.catalogId) assert.equal(item.catalogEntry, getYautjaContentById(item.catalogId), item.catalogId);
  });
  assert.deepEqual(new Set(Object.keys(CLASS_CAPACITY_BUDGETS)), classIds);
  assert.equal(LOADOUT_INCOMPATIBILITIES.length, 4);
  assert.equal(getLoadoutItemById('wristblades')?.required, true);
  assert.equal(getLoadoutItemById('absent'), null);
  assert.deepEqual(
    getLoadoutItemsForSlot('support').map(({ id }) => id),
    ['medicomp'],
  );
});

test('le loadout par défaut limite réellement l’arsenal et conserve les trois systèmes obligatoires', () => {
  const loadout = createDefaultHuntLoadout();
  const validation = validateHuntLoadout(loadout);
  const ids = getEquippedLoadoutItemIds(loadout);

  assert.equal(validation.valid, true);
  assert.deepEqual(loadout.core, MANDATORY_LOADOUT_CORE);
  assert.ok(ids.includes('wristblades'));
  assert.ok(ids.includes('biomask_vision'));
  assert.ok(ids.includes('optical_cloak'));
  assert.equal(loadout.slots.gadgets.length, 2);
  assert.ok(ids.length <= 9, 'le joueur ne doit plus équiper les 15 armes et 7 technologies');
  assert.equal(Object.isFrozen(loadout), true);
  assert.equal(Object.isFrozen(loadout.slots), true);
  assert.equal(Object.isFrozen(loadout.slots.gadgets), true);
  assert.deepEqual(getLoadoutCapacity(loadout), { used: 19, budget: 20, remaining: 1, exceeded: 0 });
  assert.equal(getLoadoutCapacityLabel(loadout), 'CAPACITÉ 19/20 · 1 libre');
});

test('la validation explique en français les slots, doublons, limites et protections du core', () => {
  const invalid = {
    hunterClassId: 'class_inconnue',
    core: {
      wristWeaponId: 'father_sword',
      biomaskGadgetId: 'scout_drone',
      cloakGadgetId: 'apex_decoy',
    },
    slots: {
      melee: 'plasmacaster_single',
      secondary: 'smart_disc',
      ranged: 'smart_disc',
      gadgets: ['scout_drone', 'shuriken', 'apex_decoy'],
      support: null,
    },
  };
  const result = validateHuntLoadout(invalid);
  const codes = result.errors.map(({ code }) => code);

  assert.equal(result.valid, false);
  assert.ok(codes.includes('unknown_class'));
  assert.ok(codes.includes('mandatory_core_changed'));
  assert.ok(codes.includes('wrong_slot'));
  assert.ok(codes.includes('duplicate_item'));
  assert.ok(codes.includes('too_many_gadgets'));
  assert.ok(codes.includes('required_slot_empty'));
  result.errors.forEach(({ message }) => assert.match(message, /[A-Za-zÀ-ÿ]/));

  const oldFullArsenal = validateHuntLoadout({
    hunterClassId: 'class_hunter',
    selectedWeaponIds: PLAYABLE_WEAPONS.map(({ id }) => id),
    selectedGadgetIds: PLAYER_GADGETS.map(({ id }) => id),
  });
  assert.equal(oldFullArsenal.valid, false);
  assert.ok(oldFullArsenal.errors.some(({ code }) => code === 'legacy_full_arsenal'));
});

test('le budget dépend de la classe et une surcharge est bloquée', () => {
  const heavy = sanitizeHuntLoadout({
    hunterClassId: 'class_scout',
    slots: {
      melee: 'father_sword',
      secondary: 'wrist_rocket',
      ranged: 'eye_of_ra',
      gadgets: ['wrist_shield', 'shuriken'],
      support: 'medicomp',
    },
  });
  const scout = validateHuntLoadout(heavy);
  assert.equal(scout.valid, false);
  assert.equal(scout.capacity.budget, 18);
  assert.ok(scout.capacity.exceeded > 0);
  assert.ok(scout.errors.some(({ code }) => code === 'capacity_exceeded'));
  assert.match(scout.capacityLabel, /^SURCHARGE/);

  const berserker = validateHuntLoadout({ ...heavy, hunterClassId: 'class_berserker' });
  assert.equal(berserker.capacity.budget, 23);
  assert.ok(berserker.capacity.used > berserker.capacity.budget);
});

test('les incompatibilités matérielles bloquent le départ et les activations exclusives avertissent', () => {
  const bowAndShield = createDefaultHuntLoadout('class_berserker');
  const invalid = validateHuntLoadout({
    ...bowAndShield,
    slots: { ...bowAndShield.slots, ranged: 'yautja_bow', gadgets: ['wrist_shield'] },
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.some(({ code, itemIds }) => code === 'incompatible_items'
    && itemIds.includes('yautja_bow')
    && itemIds.includes('wrist_shield')));

  const shieldOnly = validateHuntLoadout({
    ...bowAndShield,
    slots: { ...bowAndShield.slots, ranged: 'plasmacaster_single', gadgets: ['wrist_shield'] },
  });
  assert.equal(shieldOnly.valid, true);
  assert.ok(shieldOnly.warnings.some(({ code }) => code === 'exclusive_activation'));
});

test('les restrictions de déblocage sont appliquées aux armes et aux gadgets', () => {
  const loadout = createDefaultHuntLoadout();
  const result = validateHuntLoadout(loadout, {
    unlockedWeaponIds: ['wristblades', 'combi_stick', 'smart_disc', 'medicomp'],
    unlockedGadgetIds: ['voice_mimic'],
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(({ code, itemIds }) => code === 'locked_item' && itemIds.includes('plasmacaster_single')));
  assert.ok(result.errors.some(({ code, itemIds }) => code === 'locked_item' && itemIds.includes('scout_drone')));
});

test('chaque mission et chaque classe reçoit une recommandation complète, compatible et sous budget', () => {
  for (const hunterClass of HUNTER_CLASSES) {
    for (const hunt of Object.values(HUNT_DEFINITIONS)) {
      const recommendation = getRecommendedHuntLoadout({
        huntType: hunt.id,
        hunterClassId: hunterClass.id,
      });
      assert.equal(recommendation.validation.valid, true, `${hunterClass.id}/${hunt.id}`);
      assert.ok(recommendation.reason.length > 20, hunt.id);
      assert.equal(recommendation.loadout.hunterClassId, hunterClass.id);
      assert.ok(recommendation.validation.capacity.remaining >= 0);
    }
  }

  const byBoss = getRecommendedHuntLoadout({ bossType: 'predalien', hunterClassId: 'class_cleaner' });
  assert.equal(byBoss.huntType, 'predalien');
  assert.equal(byBoss.biomeId, 'gunnison_outbreak');
  assert.equal(byBoss.loadout.slots.melee, 'whip_thorns');

  const byBiome = getRecommendedHuntLoadout({ biomeId: 'bouvetoya_pyramid' });
  assert.equal(byBiome.biomeId, 'bouvetoya_pyramid');
  assert.equal(byBiome.loadout.slots.ranged, 'yautja_bow');

  const restricted = getRecommendedHuntLoadout({
    huntType: 'predalien',
    hunterClassId: 'class_scout',
    unlockedWeaponIds: ['combi_stick', 'smart_disc', 'speargun', 'medicomp'],
    unlockedGadgetIds: ['voice_mimic'],
  });
  assert.equal(restricted.validation.valid, true);
  assert.deepEqual(
    {
      melee: restricted.loadout.slots.melee,
      secondary: restricted.loadout.slots.secondary,
      ranged: restricted.loadout.slots.ranged,
      gadgets: restricted.loadout.slots.gadgets,
    },
    {
      melee: 'combi_stick',
      secondary: 'smart_disc',
      ranged: 'speargun',
      gadgets: ['voice_mimic'],
    },
  );
});

test('les helpers runtime filtrent armes et gadgets par identifiant, numéro de slot ou raccourci', () => {
  const loadout = createDefaultHuntLoadout();
  assert.equal(isWeaponEquipped(loadout, 'wristblades'), true);
  assert.equal(isWeaponEquipped(loadout, 1), true);
  assert.equal(isWeaponEquipped(loadout, 'plasmacaster_single'), true);
  assert.equal(isWeaponEquipped(loadout, 14), false);
  assert.equal(isWeaponEquipped(loadout, 'arme_inconnue'), false);

  assert.equal(isGadgetEquipped(loadout, 'biomask_vision'), true);
  assert.equal(isGadgetEquipped(loadout, 'KeyV'), true);
  assert.equal(isGadgetEquipped(loadout, 'optical_cloak'), true);
  assert.equal(isGadgetEquipped(loadout, 'KeyC'), true);
  assert.equal(isGadgetEquipped(loadout, 'wrist_shield'), false);
  assert.equal(isGadgetEquipped(loadout, 'KeyB'), false);
});

test('les presets sont sauvegardables, activables, modifiables et supprimables sans mutation', () => {
  const initial = createDefaultHuntLoadoutState();
  const alternative = getRecommendedHuntLoadout({ huntType: 'grid_alien', hunterClassId: 'class_ritual_initiate' }).loadout;
  const first = saveHuntLoadoutPreset(initial, {
    id: 'rite-bouvetoya',
    name: '  Rite   Bouvetøya  ',
    loadout: alternative,
  }, { now });

  assert.equal(first.saved, true);
  assert.equal(first.preset.name, 'Rite Bouvetøya');
  assert.equal(first.preset.createdAt, FIXED_NOW);
  assert.equal(first.state.activePresetId, 'rite-bouvetoya');
  assert.equal(initial.presets.length, 0, 'l’état d’origine ne doit pas être muté');

  const activated = activateHuntLoadoutPreset(first.state, 'rite-bouvetoya');
  assert.equal(activated.activated, true);
  assert.equal(activated.state.activeLoadout.hunterClassId, 'class_ritual_initiate');
  assert.equal(activateHuntLoadoutPreset(first.state, 'absent').activated, false);

  const refused = saveHuntLoadoutPreset(first.state, {
    id: 'surcharge',
    name: 'Surcharge',
    loadout: {
      hunterClassId: 'class_scout',
      slots: {
        melee: 'father_sword',
        secondary: 'wrist_rocket',
        ranged: 'eye_of_ra',
        gadgets: ['wrist_shield', 'shuriken'],
        support: 'medicomp',
      },
    },
  }, { now });
  assert.equal(refused.saved, false);
  assert.ok(refused.validation.errors.some(({ code }) => code === 'capacity_exceeded'));
  assert.equal(refused.state.presets.length, 1);

  const deleted = deleteHuntLoadoutPreset(first.state, 'rite-bouvetoya');
  assert.equal(deleted.presets.length, 0);
  assert.equal(deleted.activePresetId, null);
});

test('la limite de douze presets et la mise à jour par identifiant restent déterministes', () => {
  let state = createDefaultHuntLoadoutState();
  for (let index = 0; index < MAX_LOADOUT_PRESETS + 2; index += 1) {
    state = saveHuntLoadoutPreset(state, {
      id: `preset-${index}`,
      name: `Preset ${index}`,
      loadout: createDefaultHuntLoadout(),
    }, { now }).state;
  }
  assert.equal(state.presets.length, MAX_LOADOUT_PRESETS);
  assert.equal(state.presets[0].id, 'preset-2');

  const updated = saveHuntLoadoutPreset(state, {
    id: 'preset-4',
    name: 'Preset quatre corrigé',
    loadout: createDefaultHuntLoadout('class_elder'),
  }, { now }).state;
  assert.equal(updated.presets.length, MAX_LOADOUT_PRESETS);
  assert.equal(updated.presets.at(-1).name, 'Preset quatre corrigé');
  assert.equal(updated.presets.at(-1).loadout.hunterClassId, 'class_elder');
});

test('la migration réduit un ancien arsenal complet, sérialise en v1 et récupère les données corrompues', () => {
  const legacy = {
    hunterClassId: 'class_scout',
    selectedWeaponIds: PLAYABLE_WEAPONS.map(({ id }) => id),
    selectedGadgetIds: PLAYER_GADGETS.map(({ id }) => id),
  };
  const migrated = deserializeHuntLoadoutState(legacy, { now });
  assert.equal(migrated.migrated, true);
  assert.equal(migrated.state.version, HUNT_LOADOUT_SCHEMA_VERSION);
  assert.equal(validateHuntLoadout(migrated.state.activeLoadout).valid, true);
  assert.ok(getEquippedLoadoutItemIds(migrated.state.activeLoadout).length <= 9);
  assert.ok(migrated.state.activeLoadout.slots.gadgets.length <= 2);

  const serialized = serializeHuntLoadoutState(migrated.state);
  const roundTrip = deserializeHuntLoadoutState(serialized, { now });
  assert.equal(roundTrip.migrated, false);
  assert.deepEqual(roundTrip.state, migrated.state);

  const corrupted = deserializeHuntLoadoutState('{pas du json', { now });
  assert.equal(corrupted.recovered, true);
  assert.equal(validateHuntLoadout(corrupted.state.activeLoadout).valid, true);
  assert.match(corrupted.errors[0], /illisible/);
});

test('HuntLoadoutSystem fonctionne sans localStorage et persiste atomiquement avec un stockage fourni', () => {
  const noStorage = new HuntLoadoutSystem({ storage: null, now });
  const applied = noStorage.setActiveLoadout(createDefaultHuntLoadout('class_elder'));
  assert.equal(applied.applied, true);
  assert.equal(applied.persistence.saved, false);
  assert.equal(applied.persistence.reason, 'storage_unavailable');
  assert.equal(noStorage.isWeaponEquipped('wristblades'), true);
  assert.equal(noStorage.isGadgetEquipped('KeyV'), true);

  const storage = makeStorage();
  const system = new HuntLoadoutSystem({ storage, now });
  const preset = system.savePreset({
    id: 'jungle-standard',
    name: 'Jungle standard',
    loadout: createDefaultHuntLoadout(),
  });
  assert.equal(preset.saved, true);
  assert.equal(storage.getItem(system.tempKey), null);
  assert.ok(storage.getItem(system.storageKey));

  const restored = new HuntLoadoutSystem({ storage, now });
  const loaded = restored.load();
  assert.equal(loaded.state.presets.length, 1);
  assert.equal(loaded.state.activePresetId, 'jungle-standard');
});
