import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_CUSTOMIZATION } from '../src/data/RuntimeEquipment.js';
import { SaveManager } from '../src/engine/SaveManager.js';

function makeStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

test('une sauvegarde v3 devient une v4 avec honneur cumulé et nouveaux axes sûrs', () => {
  globalThis.localStorage = makeStorage();
  const manager = new SaveManager();
  localStorage.setItem(manager.VERSION3_KEY, JSON.stringify({
    version: 3,
    savedAt: '2026-08-22T00:00:00.000Z',
    player: {
      honorScore: 200,
      honorRankIndex: 3,
      currentSkinId: 'wolf_avpr',
      customization: {
        ...DEFAULT_CUSTOMIZATION,
        armorPresetId: 'wolf_avpr',
        maskId: 'mask_wolf_avpr',
        hunterClassId: undefined,
        dreadStyleId: undefined,
        armorFinishId: undefined,
        warpaintId: undefined,
      },
      completedHunts: ['goliath', 'bad_blood'],
    },
    settings: { audioEnabled: true, reducedMotion: false, highContrast: false, hudScale: 1 },
  }));

  const player = { honorScore: 0, honorRankIndex: 0, customization: {}, completedHunts: [] };
  const result = manager.load(player);

  assert.equal(result.loaded, true);
  assert.equal(result.migrated, true);
  assert.equal(player.honorScore, 200);
  assert.equal(player.lifetimeHonor, 3000);
  assert.equal(player.honorRankIndex, 3);
  assert.equal(player.customization.hunterClassId, DEFAULT_CUSTOMIZATION.hunterClassId);
  assert.equal(player.customization.dreadStyleId, DEFAULT_CUSTOMIZATION.dreadStyleId);
  assert.equal(player.customization.armorFinishId, DEFAULT_CUSTOMIZATION.armorFinishId);
  assert.equal(player.customization.warpaintId, DEFAULT_CUSTOMIZATION.warpaintId);
  assert.equal(localStorage.getItem(manager.VERSION3_KEY), null);
  assert.equal(JSON.parse(localStorage.getItem(manager.STORAGE_KEY)).version, 4);
});
