import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { YautjaTrophyCraftsmanshipForgeSystem } from '../src/gameplay/YautjaTrophyCraftsmanshipForgeSystem.js';
import { HUNTER_CLASSES } from '../src/data/RuntimeEquipment.js';
import { MONSTER_HUNTER_CROWNS } from '../src/data/PreyTaxonomyAndCrossoverCatalog.js';
import { applyCraftedEquipmentToPlayer, getCraftedIncomingDamage, getCraftedOutgoingDamage,
  getCraftedHonorAward, selectCraftedCrown, installCraftedDamageHook } from '../src/gameplay/CraftedEquipmentRuntime.js';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';
import { disposeObject3D } from '../src/utils/materialState.js';
import { SaveManager } from '../src/engine/SaveManager.js';
import { audioSynth } from '../src/AudioSynthesizer.js';

function withStorage(initial, action) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const data = new Map(initial == null ? [] : [['test-craft', initial]]);
  Object.defineProperty(globalThis, 'localStorage', { configurable: true,
    value: { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) } });
  try { return action(data); }
  finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else delete globalThis.localStorage;
  }
}

// Existing ownership survives the migration; these fixtures are not newly
// craftable materials and cannot be obtained by a holographic hunt.
function legacyEquipment(...ids) {
  const forge = new YautjaTrophyCraftsmanshipForgeSystem('test-craft');
  forge.state.craftedItemIds = [...ids];
  forge.state.equippedItemIds = [...ids];
  return forge;
}

test('loading a save removes unknown/unowned equipped items and repeated category bonuses', () => {
  withStorage(JSON.stringify({
    craftedItemIds: ['craft_shield_xeno_warrior', 'craft_shield_kalisk_bone', 'craft_shield_xeno_warrior', 'unknown'],
    equippedItemIds: ['craft_armor_queen_carapace_cuirass', 'craft_shield_xeno_warrior', 'craft_shield_xeno_warrior', 'craft_shield_kalisk_bone', 'unknown'],
    trophyInventory: { grid_alien: 2, unknown: 20, kalisk: -1 },
  }), () => {
    const forge = new YautjaTrophyCraftsmanshipForgeSystem('test-craft');
    assert.deepEqual(forge.state.craftedItemIds, ['craft_shield_xeno_warrior', 'craft_shield_kalisk_bone']);
    assert.deepEqual(forge.state.equippedItemIds, ['craft_shield_xeno_warrior']);
    assert.deepEqual(forge.state.trophyInventory, { grid_alien: 2 });
    const perks = forge.getActiveCraftedPerks();
    assert.equal(perks.bonusHealth, 0, 'an uncrafted armor must not grant free health');
    assert.equal(perks.equippedList.length, 1);
  });
});

test('a real harvested trophy and spendable honor are required; a hologram supplies neither material nor a free craft', () => {
  withStorage(null, data => {
    const forge = new YautjaTrophyCraftsmanshipForgeSystem('test-craft');
    const player = { honorScore: 1800, lifetimeHonor: 4000, honorRankIndex: 3 };
    forge.recordTrophy('grid_alien', { simulation: true });
    assert.equal(forge.canCraft('craft_shield_xeno_warrior', player.honorScore).reason, 'missing_trophies');
    assert.equal(forge.state.holoCollection.grid_alien, 1);
    assert.equal(forge.recordTrophy('grid_alien').success, true);
    const result = forge.craftForPlayer('craft_shield_xeno_warrior', player);
    assert.equal(result.success, true);
    assert.equal(result.spentHonor, 1800);
    assert.equal(player.honorScore, 0);
    assert.equal(player.lifetimeHonor, 4000, 'spending is not a loss of lifetime rank');
    assert.equal(player.honorRankIndex, 3);
    assert.equal(forge.state.trophyInventory.grid_alien ?? 0, 0);
    assert.equal(forge.craftForPlayer('craft_shield_xeno_warrior', player).reason, 'already_crafted');
    assert.equal(player.honorScore, 0);
    const restored = new YautjaTrophyCraftsmanshipForgeSystem('test-craft');
    assert.equal(restored.isCrafted('craft_shield_xeno_warrior'), true);
    assert.equal(restored.isEquipped('craft_shield_xeno_warrior'), true);
    assert.equal(JSON.parse(data.get('test-craft')).holoCollection.grid_alien, 1);
  });
});

test('invalid balances, unknown trophies and unavailable source species cannot unlock crafting', () => {
  const forge = new YautjaTrophyCraftsmanshipForgeSystem('test-craft');
  for (const balance of [NaN, Infinity, -1, '1800']) {
    assert.equal(forge.canCraft('craft_shield_xeno_warrior', balance).reason, 'invalid_honor');
  }
  for (const quantity of [-1, 0, NaN, 1.5, Infinity]) assert.equal(forge.recordTrophy('grid_alien', { quantity }).success, false);
  assert.equal(forge.recordTrophy('unknown_source').success, false);
  assert.equal(forge.recordTrophy('__proto__', { simulation: true }).success, false);
  forge.recordTrophy('xeno_queen', { quantity: 10 });
  const archival = forge.canCraft('craft_shield_xeno_queen', 10000);
  assert.equal(archival.canCraft, false, 'a generic queen cannot substitute for the absent Queen Mother');
  assert.equal(archival.reason, 'unavailable_material_source');
  assert.equal(forge.canCraft('craft_mask_goliath_bone', 3500).missingHonor, 100);
});

test('only the three explicitly mapped physical NPC species can supply recovered crafting materials', () => {
  const forge = new YautjaTrophyCraftsmanshipForgeSystem('test-craft');
  assert.equal(forge.recordTrophy('xeno_runner').success, true);
  const recipe = forge.getRecipeById('craft_weapon_runner_tail_scythe');
  const player = { honorScore: recipe.requiredHonor };
  assert.equal(forge.craftForPlayer(recipe.id, player).success, true);
  assert.equal(player.honorScore, 0);
  assert.equal(forge.state.trophyInventory.xeno_runner ?? 0, 0);
  assert.equal(forge.recordTrophy('combat_synthetic').success, false,
    'a generic synthetic is not the absent Weyland MK IV exoskeleton');
  assert.equal(forge.recordTrophy('prey_xeno_runner', { simulation: true }).success, true);
  assert.equal(forge.state.trophyInventory.prey_xeno_runner, undefined);
});

test('corrupt saves and refused persistence retain a usable in-memory forge', () => {
  for (const raw of ['null', '{broken-json']) withStorage(raw, () => {
    const forge = new YautjaTrophyCraftsmanshipForgeSystem('test-craft');
    assert.deepEqual(forge.state.craftedItemIds, []);
  });
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('Storage denied'); } });
  try {
    const forge = new YautjaTrophyCraftsmanshipForgeSystem('test-craft');
    forge.recordTrophy('grid_alien');
    const result = forge.craftForPlayer('craft_shield_xeno_warrior', { honorScore: 1800 });
    assert.equal(result.success, true);
    assert.equal(result.persisted, false);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else delete globalThis.localStorage;
  }
});

test('one progression callback observes the spent honor, consumed material and crafted ownership together', () => {
  withStorage(null, data => {
    const manager = new SaveManager();
    const forge = new YautjaTrophyCraftsmanshipForgeSystem('test-craft');
    const player = { honorScore: 1800, lifetimeHonor: 4000, honorRankIndex: 3 };
    const snapshots = [];
    forge.setPersistenceHandler(() => {
      player.trophyCraftForgeState = forge.exportState();
      snapshots.push({ honor: player.honorScore, forge: player.trophyCraftForgeState });
      return manager.save(player);
    });
    forge.recordTrophy('grid_alien');
    snapshots.length = 0;
    const result = forge.craftForPlayer('craft_shield_xeno_warrior', player);
    assert.equal(result.persisted, true);
    assert.equal(snapshots.length, 1, 'no earlier write may save ownership while honor is still unspent');
    assert.equal(snapshots[0].honor, 0);
    assert.equal(snapshots[0].forge.trophyInventory.grid_alien ?? 0, 0);
    assert.equal(snapshots[0].forge.craftedItemIds.includes('craft_shield_xeno_warrior'), true);
    assert.equal(data.has('test-craft'), false, 'integrated writes must stop updating the separate legacy key');
    const payload = JSON.parse(data.get(manager.STORAGE_KEY));
    assert.equal(payload.player.honorScore, 0);
    assert.equal(payload.player.trophyCraftForgeState.craftedItemIds.includes('craft_shield_xeno_warrior'), true);
    const exported = forge.exportState();
    exported.craftedItemIds.push('unknown');
    exported.trophyInventory.grid_alien = 999;
    assert.equal(forge.state.craftedItemIds.includes('unknown'), false);
    assert.equal(forge.state.trophyInventory.grid_alien, undefined);
  });
});

test('a unified snapshot wins over a contradictory old forge key while older v4 saves still migrate legacy ownership', () => {
  const legacy = { craftedItemIds: ['craft_armor_queen_carapace_cuirass'],
    equippedItemIds: ['craft_armor_queen_carapace_cuirass'], trophyInventory: { grid_alien: 99 } };
  withStorage(JSON.stringify(legacy), data => {
    const manager = new SaveManager();
    const current = { honorScore: 0, lifetimeHonor: 1800,
      trophyCraftForgeState: { craftedItemIds: ['craft_shield_xeno_warrior'],
        equippedItemIds: ['craft_shield_xeno_warrior'], trophyInventory: {} } };
    assert.equal(manager.save(current), true);
    const player = {};
    assert.equal(manager.load(player).loaded, true);
    const forge = new YautjaTrophyCraftsmanshipForgeSystem('test-craft');
    forge.importState(player.trophyCraftForgeState);
    assert.equal(player.honorScore, 0);
    assert.equal(forge.isCrafted('craft_armor_queen_carapace_cuirass'), false);
    assert.equal(forge.isCrafted('craft_shield_xeno_warrior'), true);
    assert.equal(forge.state.trophyInventory.grid_alien, undefined);
    // A real old v4 snapshot omits the new field entirely, so its standalone
    // ownership is retained until the first combined progression write.
    const oldV4 = manager.createPayload({ honorScore: 1000 });
    assert.equal(Object.hasOwn(oldV4.player, 'trophyCraftForgeState'), false);
    data.set(manager.STORAGE_KEY, JSON.stringify(oldV4));
    const migratedPlayer = {};
    manager.load(migratedPlayer);
    const migratedForge = new YautjaTrophyCraftsmanshipForgeSystem('test-craft');
    assert.equal(migratedForge.importState(migratedPlayer.trophyCraftForgeState), false);
    assert.equal(migratedForge.isCrafted('craft_armor_queen_carapace_cuirass'), true);
  });
});

test('a refused final write leaves memory usable and the recoverable snapshot keeps currency and crafting paired', () => {
  withStorage(null, data => {
    const manager = new SaveManager();
    const forge = new YautjaTrophyCraftsmanshipForgeSystem('test-craft');
    const player = { honorScore: 1800, lifetimeHonor: 1800 };
    let refusePrimary = false;
    const write = localStorage.setItem;
    localStorage.setItem = (key, value) => {
      if (refusePrimary && key === manager.STORAGE_KEY) throw new Error('quota denied');
      write(key, value);
    };
    forge.setPersistenceHandler(() => {
      player.trophyCraftForgeState = forge.exportState();
      return manager.save(player);
    });
    forge.recordTrophy('grid_alien');
    refusePrimary = true;
    const result = forge.craftForPlayer('craft_shield_xeno_warrior', player);
    assert.equal(result.success, true);
    assert.equal(result.persisted, false, 'a partial write cannot be called a committed durable save');
    assert.equal(player.honorScore, 0);
    const old = JSON.parse(data.get(manager.STORAGE_KEY));
    const temporary = JSON.parse(data.get(manager.TEMP_KEY));
    assert.equal(old.player.honorScore, 1800);
    assert.equal(old.player.trophyCraftForgeState.craftedItemIds.length, 0);
    assert.equal(temporary.player.honorScore, 0);
    assert.equal(temporary.player.trophyCraftForgeState.craftedItemIds.includes('craft_shield_xeno_warrior'), true);
    refusePrimary = false;
    const restored = {};
    assert.equal(manager.load(restored).loaded, true);
    const restoredForge = new YautjaTrophyCraftsmanshipForgeSystem('test-craft');
    restoredForge.importState(restored.trophyCraftForgeState);
    assert.equal(restored.honorScore, 0);
    assert.equal(restoredForge.isCrafted('craft_shield_xeno_warrior'), true);
    assert.equal(restoredForge.state.trophyInventory.grid_alien, undefined);
  });
});

test('class-based health and movement bonuses neither stack nor heal on repeated equips and are revoked cleanly', () => {
  const forge = legacyEquipment('craft_armor_queen_carapace_cuirass');
  const perks = forge.getActiveCraftedPerks();
  for (const hunter of HUNTER_CLASSES) {
    const player = { customization: { hunterClassId: hunter.id }, maxHealth: hunter.maxHealth,
      health: hunter.maxHealth / 2, hasAntiAcidCloak: false };
    applyCraftedEquipmentToPlayer(player, perks);
    assert.equal(player.maxHealth, hunter.maxHealth + 250);
    assert.equal(player.health, player.maxHealth / 2);
    for (let repeat = 0; repeat < 5; repeat++) applyCraftedEquipmentToPlayer(player, perks);
    assert.equal(player.maxHealth, hunter.maxHealth + 250);
    assert.equal(player.health, player.maxHealth / 2);
    assert.equal(player.craftedAcidResistanceRatio, 1);
    applyCraftedEquipmentToPlayer(player, {});
    assert.equal(player.maxHealth, hunter.maxHealth);
    assert.equal(player.health, hunter.maxHealth / 2);
    assert.equal(player.sprintSpeed, hunter.sprintSpeed);
    assert.equal(player.energyRegen, hunter.energyRegen);
    assert.equal(player.craftedAcidResistanceRatio, 0);
    assert.equal(player.hasAntiAcidCloak, false, 'a temporary immunity must not buy the permanent upgrade');
  }
});

test('real cosmetic and skin-card handlers retain equipped health/recharge and refresh the displayed vitals', async t => {
  const previousWindow = globalThis.window;
  globalThis.window = { addEventListener() {} };
  let Game;
  try { ({ Game } = await import('../src/main.js')); }
  finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
  const player = new YautjaPlayer(new THREE.Scene());
  const previousDocument = globalThis.document;
  const nodes = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, { listeners: new Map(), attributes: new Map(),
      value: '', options: [{ text: 'Option choisie' }], selectedIndex: 0,
      classList: { add() {}, remove() {} },
      addEventListener(type, listener) { this.listeners.set(type, listener); },
      getAttribute(name) { return this.attributes.get(name) ?? null; },
      setAttribute(name, value) { this.attributes.set(name, value); },
      querySelector() { return { textContent: 'Wolf' }; } });
    return nodes.get(id);
  };
  const skin = node('skin-card');
  skin.attributes.set('data-skin-id', 'wolf_avpr');
  const forge = legacyEquipment('craft_armor_queen_carapace_cuirass', 'craft_banner_tail_trophy_flag');
  const vitals = [];
  const game = Object.assign(Object.create(Game.prototype), {
    player, trophyCraftForge: forge,
    hud: { syncCustomization() {}, showLogMessage() {}, updateVitals(subject) {
      vitals.push({ maximum: subject.maxHealth, health: subject.health });
    } },
    saveProgress: () => true,
  });
  for (const method of ['setupMissionTabs', 'setupTaxonomyAndMultiverse', 'setupTrophyCraftsmanshipUI',
    'setupHuntLoadoutControls', 'setupHubTouchControls', 'setupHuntTouchControls', 'setupSettingsHooks']) game[method] = () => {};
  t.mock.method(audioSynth, 'playYautjaClick', () => {});
  try {
    game.syncCraftedEquipmentStats();
    player.health = player.maxHealth / 2;
    const expected = { maximum: 350, health: 175 };
    globalThis.document = { getElementById: node,
      querySelectorAll: selector => selector === '.skin-card' ? [skin] : [],
      querySelector: () => null };
    game.setupUIButtons();
    const color = node('custom-armor-color');
    color.value = 'armor_obsidienne';
    for (let repeat = 0; repeat < 3; repeat++) {
      color.listeners.get('change')();
      assert.deepEqual({ maximum: player.maxHealth, health: player.health }, expected);
      assert.equal(player.energyRegen, 10.8);
      assert.equal(player.cloakEnergyDrain, 14.8);
      assert.deepEqual(vitals.at(-1), expected);
    }
    skin.listeners.get('click')();
    assert.equal(player.currentSkinId, 'wolf_avpr');
    assert.deepEqual({ maximum: player.maxHealth, health: player.health }, expected);
    assert.equal(player.energyRegen, 10.8);
    assert.equal(player.cloakEnergyDrain, 14.8);
    assert.deepEqual(vitals.at(-1), expected);
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
    disposeObject3D(player.mesh);
  }
});

test('all classes keep a positive cloak net cost with both recharge and duration bonuses', () => {
  for (const hunter of HUNTER_CLASSES) {
    const player = { customization: { hunterClassId: hunter.id }, maxHealth: hunter.maxHealth, health: hunter.maxHealth };
    const stats = applyCraftedEquipmentToPlayer(player, { energyRegenMultiplier: 1.35, cloakDurationBonusMultiplier: 1.5 });
    assert.ok(stats.cloakEnergyDrain > stats.energyRegen);
    assert.ok(Math.abs((stats.cloakEnergyDrain - stats.energyRegen) - (12 - hunter.energyRegen) / 1.5) < 1e-8);
    applyCraftedEquipmentToPlayer(player, {});
    assert.equal(player.cloakEnergyDrain, 12);
  }
});

test('damage and honor effects are scoped to the right hit type and target family', () => {
  const perks = { meleeDamageBonus: 40, rangedDamageBonus: 90,
    crossoverDamageBonusMultiplier: 1.25, giantDamageBonusMultiplier: 1.45,
    damageReductionRatio: 0.35, acidImmunityRatio: 1, fireResistanceRatio: 0.5,
    honorScoreBonusMultiplier: 1.25, queenHonorBonusMultiplier: 1.5 };
  assert.equal(getCraftedOutgoingDamage(20, perks, { kind: 'melee' }), 60);
  assert.equal(getCraftedOutgoingDamage(20, perks, { kind: 'ranged', isCrossover: true }), 137.5);
  assert.equal(getCraftedOutgoingDamage(20, perks, { kind: 'explosion' }), 20, 'a passive cannon bonus does not turn all explosions into cannon shots');
  assert.equal(getCraftedIncomingDamage(100, perks, { type: 'acid' }), 0);
  assert.equal(getCraftedIncomingDamage(100, perks, { type: 'fire' }), 32.5);
  assert.equal(getCraftedIncomingDamage(100, perks), 65);
  assert.equal(getCraftedHonorAward(100, perks), 125);
  assert.equal(getCraftedHonorAward(100, perks, { queenFamily: true }), 188);
});

test('the incoming-damage hook is idempotent and preserves the original receiver, context and return value', () => {
  const seen = [];
  const player = { health: 100, takeDamage(amount, context, token) {
    seen.push({ receiver: this, amount, context, token });
    this.health -= amount;
    return { remainingHealth: this.health };
  } };
  let perks = { damageReductionRatio: 0.5, acidImmunityRatio: 0.5 };
  assert.equal(installCraftedDamageHook(player, () => perks), true);
  const wrapped = player.takeDamage;
  assert.equal(installCraftedDamageHook(player, () => perks), true);
  assert.equal(player.takeDamage === wrapped, true);
  assert.equal(player.craftedDamageHookInstalled, true);
  const context = { type: 'acid' };
  const result = player.takeDamage(100, context, 'unchanged');
  assert.deepEqual(result, { remainingHealth: 75 });
  assert.equal(seen[0].receiver === player, true);
  assert.equal(seen[0].context === context, true);
  assert.equal(seen[0].token, 'unchanged');
  assert.equal(seen[0].amount, 25, 'two installs must not reduce the same damage twice');
  perks = {};
  player.takeDamage(10, { type: 'acid' });
  assert.equal(player.health, 65, 'a live unequip must remove the old resistance immediately');
});

test('gold chance increases preserve both miniature and giant outcomes and do not promote every roll to giant', () => {
  const perks = { goldCrownChanceBonus: 0.5, giantGoldCrownChanceBonus: 0.6 };
  assert.equal(selectCraftedCrown(0.16, perks), MONSTER_HUNTER_CROWNS.GIANT_GOLD_CROWN);
  assert.equal(selectCraftedCrown(0.20, perks), MONSTER_HUNTER_CROWNS.MINI_GOLD_CROWN);
  assert.equal(selectCraftedCrown(0.4, perks), MONSTER_HUNTER_CROWNS.SILVER_CROWN);
  assert.equal(selectCraftedCrown(0.8, perks), MONSTER_HUNTER_CROWNS.STANDARD);
  assert.equal(selectCraftedCrown(NaN, perks), MONSTER_HUNTER_CROWNS.STANDARD);
});

test('the real player consumes crafted stamina/camouflage rates, blocks corrosion and uses plasma cooldown', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  try {
    player.applyCustomization({ hunterClassId: 'class_falconer' });
    const perks = legacyEquipment('craft_armor_vydrach_sky_cloak', 'craft_banner_tail_trophy_flag').getActiveCraftedPerks();
    applyCraftedEquipmentToPlayer(player, perks);
    player.energy = 40;
    player.stamina = 10;
    player.staminaRegen = 50;
    player.isCloaked = true;
    const before = player.energy;
    player.update(1, { x: 0, z: 0, isSprinting: false }, 0);
    assert.ok(player.energy < before, 'recharge + cloak duration must not make camouflage infinite');
    assert.equal(player.stamina, 60);
    player.isCloaked = false;
    player.craftedAcidResistanceRatio = 1;
    assert.equal(player.applyAcidCorrosion(), false);
    player.isAcidCorroded = true;
    player.acidTimer = 5;
    const health = player.health;
    player.update(0.1, { x: 0, z: 0, isSprinting: false }, 0);
    assert.equal(player.health, health);
    assert.equal(player.isAcidCorroded, false);
    player.craftedEquipmentPerks.plasmaCooldownMultiplier = 0.5;
    player.selectedWeapon = 2;
    player.energy = 100;
    player.attackTimer = 0;
    player.attack(new THREE.Vector3(0, 4, -20));
    assert.equal(player.attackTimer, 0.3);
  } finally { disposeObject3D(player.mesh); }
});

test('the real player acid DoT goes through partial crafted defense and the next tick reflects unequipping', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  try {
    let perks = { damageReductionRatio: 0.5, acidImmunityRatio: 0.5 };
    installCraftedDamageHook(player, () => perks);
    player.craftedAcidResistanceRatio = 0.5;
    player.isAcidCorroded = true;
    player.acidTimer = 5;
    player.health = 100;
    player.update(1, { x: 0, z: 0, isSprinting: false }, 0);
    assert.equal(player.health, 99, '4 acid damage × half resistance × half armor');
    perks = {};
    player.craftedAcidResistanceRatio = 0;
    player.update(1, { x: 0, z: 0, isSprinting: false }, 0);
    assert.equal(player.health, 95, 'unequipping removes both reductions on the next 4-damage tick');
  } finally { disposeObject3D(player.mesh); }
});
