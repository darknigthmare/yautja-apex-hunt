import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_CUSTOMIZATION } from '../src/data/RuntimeEquipment.js';
import { SaveManager } from '../src/engine/SaveManager.js';

function makeStorage() {
  const values = new Map();
  const storage = {
    failSetFor: null,
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => {
      if (storage.failSetFor?.(key)) throw new Error(`write failed for ${key}`);
      values.set(key, String(value));
    },
    removeItem: (key) => values.delete(key),
  };
  return storage;
}

function makePlayer() {
  return {
    honorScore: 1000,
    honorRankIndex: 1,
    hasTriBeam: false,
    hasAntiAcidCloak: false,
    hasScopeZoom: false,
    currentSkinId: 'jungle_1987',
    customization: { ...DEFAULT_CUSTOMIZATION },
    completedHunts: [],
  };
}

test('la sauvegarde v3 restaure progression, apparence modulaire et options', () => {
  globalThis.localStorage = makeStorage();
  const manager = new SaveManager();
  const player = makePlayer();
  player.honorScore = 2450;
  player.currentSkinId = 'wolf_avpr';
  player.customization = {
    ...player.customization,
    armorPresetId: 'wolf_avpr',
    maskId: 'mask_wolf_avpr',
    skinColorId: 'skin_cendre',
    dreadColorId: 'dread_ivoire',
    armorColorId: 'armor_obsidienne',
    armorAccentColorId: 'accent_acide',
  };
  player.completedHunts = ['goliath', 'goliath', 'xeno_queen'];
  manager.save(player, { audioEnabled: false, reducedMotion: true, highContrast: true, hudScale: 1.2 });

  const restored = makePlayer();
  const result = manager.load(restored);
  assert.equal(result.loaded, true);
  assert.equal(result.migrated, false);
  assert.equal(restored.honorScore, 2450);
  assert.equal(restored.currentSkinId, 'wolf_avpr');
  assert.equal(restored.customization.maskId, 'mask_wolf_avpr');
  assert.equal(restored.customization.dreadColorId, 'dread_ivoire');
  assert.equal(restored.customization.armorColorId, 'armor_obsidienne');
  assert.deepEqual(restored.completedHunts, ['goliath', 'xeno_queen']);
  assert.equal(result.settings.audioEnabled, false);
  assert.equal(result.settings.hudScale, 1.2);
});

test('une sauvegarde v2 est migrée vers v3 sans perdre la progression', () => {
  globalThis.localStorage = makeStorage();
  const manager = new SaveManager();
  localStorage.setItem(manager.PREVIOUS_KEY, JSON.stringify({
    version: 2,
    savedAt: '2026-08-22T00:00:00.000Z',
    player: {
      honorScore: 2300,
      honorRankIndex: 2,
      hasTriBeam: true,
      hasAntiAcidCloak: true,
      hasScopeZoom: false,
      currentSkinId: 'wolf_avpr',
      completedHunts: ['goliath', 'bad_blood'],
    },
    settings: { audioEnabled: false, reducedMotion: true, highContrast: false, hudScale: 1.1 },
  }));

  const player = makePlayer();
  const result = manager.load(player);
  assert.equal(result.loaded, true);
  assert.equal(result.migrated, true);
  assert.equal(player.honorScore, 2300);
  assert.equal(player.currentSkinId, 'wolf_avpr');
  assert.equal(player.customization.armorPresetId, 'wolf_avpr');
  assert.equal(player.customization.maskId, 'mask_wolf_avpr');
  assert.equal(player.customization.armorColorId, 'armor_xeno');
  assert.equal(player.hasTriBeam, true);
  assert.equal(player.hasAntiAcidCloak, true);
  assert.equal(result.settings.hudScale, 1.1);
  const migratedPayload = JSON.parse(localStorage.getItem(manager.STORAGE_KEY));
  assert.equal(migratedPayload.version, 3);
  assert.equal(migratedPayload.player.customization.maskId, 'mask_wolf_avpr');
  assert.equal(migratedPayload.player.customization.armorColorId, 'armor_xeno');
  assert.equal(localStorage.getItem(manager.PREVIOUS_KEY), null);
});


test('la migration v2 reconstruit aussi le masque et la palette Berserker', () => {
  globalThis.localStorage = makeStorage();
  const manager = new SaveManager();
  localStorage.setItem(manager.PREVIOUS_KEY, JSON.stringify({
    version: 2, player: { currentSkinId: 'berserker_2010' }, settings: {},
  }));
  const player = makePlayer();
  assert.equal(manager.load(player).migrated, true);
  assert.equal(player.customization.maskId, 'mask_berserker_2010');
  assert.equal(player.customization.armorColorId, 'armor_sang');
  const migrated = JSON.parse(localStorage.getItem(manager.STORAGE_KEY));
  assert.equal(migrated.player.customization.maskId, 'mask_berserker_2010');
  assert.equal(migrated.player.customization.armorColorId, 'armor_sang');
});
test('une sauvegarde v1 est migrée sans perdre les améliorations', () => {
  globalThis.localStorage = makeStorage();
  const manager = new SaveManager();
  localStorage.setItem(manager.LEGACY_KEY, JSON.stringify({
    honorScore: 1700,
    honorRankIndex: 2,
    hasTriBeam: true,
    hasAntiAcidCloak: false,
    hasScopeZoom: true,
  }));

  const player = makePlayer();
  const result = manager.load(player);
  assert.equal(result.migrated, true);
  assert.equal(player.honorScore, 1700);
  assert.equal(player.hasTriBeam, true);
  assert.equal(player.hasScopeZoom, true);
  assert.ok(localStorage.getItem(manager.STORAGE_KEY));
  assert.equal(localStorage.getItem(manager.LEGACY_KEY), null);
});

test('une principale corrompue est récupérée depuis le temporaire v3 puis réparée', () => {
  globalThis.localStorage = makeStorage();
  const manager = new SaveManager();
  localStorage.setItem(manager.STORAGE_KEY, '{json-corrompu');
  localStorage.setItem(manager.TEMP_KEY, JSON.stringify({
    version: 3,
    savedAt: '2026-08-22T00:00:00.000Z',
    player: {
      honorScore: -25,
      honorRankIndex: 99,
      hasTriBeam: true,
      hasAntiAcidCloak: true,
      hasScopeZoom: false,
      currentSkinId: 'wolf_avpr',
      customization: { ...DEFAULT_CUSTOMIZATION, armorPresetId: 'wolf_avpr', maskId: 'mask_wolf_avpr' },
      completedHunts: ['goliath', 'goliath'],
    },
    settings: { audioEnabled: false, reducedMotion: true, highContrast: true, hudScale: 9 },
  }));

  const player = makePlayer();
  const result = manager.load(player);

  assert.equal(result.loaded, true);
  assert.equal(result.migrated, false);
  assert.equal(player.honorScore, 0);
  assert.equal(player.honorRankIndex, 3);
  assert.equal(player.currentSkinId, 'wolf_avpr');
  assert.equal(player.customization.maskId, 'mask_wolf_avpr');
  assert.deepEqual(player.completedHunts, ['goliath']);
  assert.equal(result.settings.hudScale, 1.25);
  assert.equal(result.settings.audioEnabled, false);
  assert.equal(localStorage.getItem(manager.TEMP_KEY), null);

  const repaired = JSON.parse(localStorage.getItem(manager.STORAGE_KEY));
  assert.equal(repaired.version, 3);
  assert.equal(repaired.player.honorScore, 0);
  assert.equal(repaired.player.honorRankIndex, 3);
  assert.equal(repaired.settings.hudScale, 1.25);
});

test('un temporaire corrompu laisse la sauvegarde v2 être migrée', () => {
  globalThis.localStorage = makeStorage();
  const manager = new SaveManager();
  localStorage.setItem(manager.STORAGE_KEY, JSON.stringify({ version: 1, player: { honorScore: 9999 } }));
  localStorage.setItem(manager.TEMP_KEY, '{temp-corrompu');
  localStorage.setItem(manager.PREVIOUS_KEY, JSON.stringify({
    version: 2,
    player: {
      honorScore: 1800,
      honorRankIndex: 2,
      hasTriBeam: true,
      hasAntiAcidCloak: true,
      hasScopeZoom: false,
      currentSkinId: 'city_1990',
      completedHunts: [],
    },
    settings: { hudScale: 1 },
  }));

  const player = makePlayer();
  const result = manager.load(player);

  assert.equal(result.loaded, true);
  assert.equal(result.migrated, true);
  assert.equal(player.honorScore, 1800);
  assert.equal(player.hasAntiAcidCloak, true);
  assert.equal(player.currentSkinId, 'city_1990');
  assert.equal(JSON.parse(localStorage.getItem(manager.STORAGE_KEY)).version, 3);
  assert.equal(localStorage.getItem(manager.TEMP_KEY), null);
  assert.equal(localStorage.getItem(manager.PREVIOUS_KEY), null);
});

test("la sauvegarde v1 reste disponible si l'écriture de migration échoue", () => {
  const storage = makeStorage();
  globalThis.localStorage = storage;
  const manager = new SaveManager();
  const legacy = JSON.stringify({
    honorScore: 2100,
    honorRankIndex: 2,
    hasTriBeam: true,
    hasAntiAcidCloak: false,
    hasScopeZoom: true,
  });
  localStorage.setItem(manager.LEGACY_KEY, legacy);
  storage.failSetFor = (key) => key === manager.STORAGE_KEY;

  const player = makePlayer();
  const result = manager.load(player);

  assert.equal(result.loaded, true);
  assert.equal(result.migrated, true);
  assert.equal(player.honorScore, 2100);
  assert.equal(localStorage.getItem(manager.LEGACY_KEY), legacy);
  assert.equal(localStorage.getItem(manager.STORAGE_KEY), null);
  assert.ok(localStorage.getItem(manager.TEMP_KEY), 'la copie temporaire reste récupérable');
});
