import test from 'node:test';
import assert from 'node:assert/strict';
import { SaveManager } from '../src/engine/SaveManager.js';
import { DEFAULT_SETTINGS } from '../src/data/GameConfig.js';

function makeStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

function makePlayer(honorScore = 0) {
  return {
    honorScore,
    lifetimeHonor: honorScore,
    honorRankIndex: 0,
    customization: {},
    completedHunts: [],
  };
}

test('la sauvegarde temporaire v4 la plus récente gagne puis répare la principale', () => {
  globalThis.localStorage = makeStorage();
  const manager = new SaveManager();
  const older = manager.createPayload(makePlayer(420), DEFAULT_SETTINGS);
  const newer = manager.createPayload(makePlayer(1780), DEFAULT_SETTINGS);
  older.savedAt = '2026-08-22T10:00:00.000Z';
  newer.savedAt = '2026-08-22T10:01:00.000Z';
  localStorage.setItem(manager.STORAGE_KEY, JSON.stringify(older));
  localStorage.setItem(manager.TEMP_KEY, JSON.stringify(newer));

  const restored = makePlayer();
  const result = manager.load(restored);

  assert.equal(result.loaded, true);
  assert.equal(result.migrated, false);
  assert.equal(restored.honorScore, 1780);
  assert.equal(restored.lifetimeHonor, 1780);
  assert.equal(JSON.parse(localStorage.getItem(manager.STORAGE_KEY)).player.honorScore, 1780);
  assert.equal(localStorage.getItem(manager.TEMP_KEY), null);
});
