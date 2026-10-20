import test from 'node:test';
import assert from 'node:assert/strict';
import { GRAPHICS_PRESETS, resolveGraphicsQuality, sanitizeGraphicsQuality } from '../src/render/graphicsQuality.js';
import { SaveManager } from '../src/engine/SaveManager.js';

test('automatic quality keeps touch/low-memory devices below desktop contact shading', () => {
  assert.equal(resolveGraphicsQuality('auto'), 'high');
  assert.equal(resolveGraphicsQuality('auto', { coarsePointer: true }), 'balanced');
  assert.equal(resolveGraphicsQuality('auto', { deviceMemory: 4 }), 'balanced');
  assert.equal(resolveGraphicsQuality('ultra', { coarsePointer: true }), 'ultra');
  assert.equal(resolveGraphicsQuality('ultra', { hdrSupported: false }), 'performance');
  assert.equal(GRAPHICS_PRESETS.balanced.aoScale, 0);
  assert.equal(GRAPHICS_PRESETS.high.aoScale, 0.5);
  assert.ok(GRAPHICS_PRESETS.ultra.pixelRatio <= 2);
});

test('graphics preference survives validated persistence and old saves remain automatic', () => {
  const saves = new SaveManager();
  for (const quality of ['auto', 'performance', 'balanced', 'high', 'ultra']) {
    assert.equal(saves.sanitizeSettings({ graphicsQuality: quality }).graphicsQuality, quality);
  }
  for (const invalid of [undefined, null, 'highest', {}, 1]) {
    assert.equal(sanitizeGraphicsQuality(invalid), 'auto');
    assert.equal(saves.sanitizeSettings({ graphicsQuality: invalid }).graphicsQuality, 'auto');
  }
});
