import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_SETTINGS } from '../src/data/GameConfig.js';
import { SaveManager } from '../src/engine/SaveManager.js';

function makeStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

function makePlayer() {
  return {
    honorScore: 1000,
    honorRankIndex: 1,
    hasTriBeam: false,
    hasAntiAcidCloak: false,
    hasScopeZoom: false,
    currentSkinId: 'jungle_1987',
    completedHunts: [],
  };
}

test('une sauvegarde corrompue revient aux réglages sûrs sans casser le jeu', () => {
  globalThis.localStorage = makeStorage();
  const manager = new SaveManager();
  localStorage.setItem(manager.STORAGE_KEY, '{données invalides');

  const result = manager.load(makePlayer());
  assert.equal(result.loaded, false);
  assert.deepEqual(result.settings, DEFAULT_SETTINGS);
  assert.ok(result.error instanceof Error);
});

test('les réglages hors limites sont normalisés', () => {
  const manager = new SaveManager();
  assert.equal(manager.sanitizeSettings({ hudScale: 9 }).hudScale, 1.25);
  assert.equal(manager.sanitizeSettings({ hudScale: 0 }).hudScale, 0.85);
  assert.equal(manager.sanitizeSettings({ hudScale: 'invalide' }).hudScale, DEFAULT_SETTINGS.hudScale);
});

test('un stockage indisponible échoue proprement sans exception propagée', () => {
  globalThis.localStorage = {
    getItem: () => null,
    setItem: () => { throw new Error('quota indisponible'); },
    removeItem: () => {},
  };

  const manager = new SaveManager();
  assert.equal(manager.save(makePlayer(), DEFAULT_SETTINGS), false);
});

test('une écriture temporaire interrompue reste récupérable', () => {
  globalThis.localStorage = makeStorage();
  const manager = new SaveManager();
  const source = makePlayer();
  source.honorScore = 2100;
  localStorage.setItem(manager.TEMP_KEY, JSON.stringify(manager.createPayload(source, DEFAULT_SETTINGS)));

  const restored = makePlayer();
  const result = manager.load(restored);
  assert.equal(result.loaded, true);
  assert.equal(restored.honorScore, 2100);
});
