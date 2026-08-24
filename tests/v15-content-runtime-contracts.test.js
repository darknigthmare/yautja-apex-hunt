import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { KALISK_TEXTURES } from '../src/entities/KaliskBoss.js';
import { PLAYER_APPEARANCE_TEXTURES } from '../src/entities/YautjaPlayer.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('les trois textures OpenAI v1.5 sont reliées au runtime en WebP', () => {
  const expected = [
    PLAYER_APPEARANCE_TEXTURES.lostTribe,
    PLAYER_APPEARANCE_TEXTURES.wolfCleaner,
    KALISK_TEXTURES.adaptiveHide,
  ];

  assert.deepEqual(expected, [
    '/assets/textures/lost-tribe-ritual-bone.webp',
    '/assets/textures/wolf-cleaner-alloy.webp',
    '/assets/textures/kalisk-adaptive-hide.webp',
  ]);
  for (const runtimePath of expected) {
    assert.ok(existsSync(join(ROOT, 'public', runtimePath)), `texture absente : ${runtimePath}`);
  }
});

test('le pont de chasse expose réellement Wolf, le Kalisk et le catalogue des médias', () => {
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');

  assert.match(html, /<button[^>]+data-hunt="wolf_cleaner"[^>]*>AFFRONTER WOLF<\/button>/);
  assert.match(html, /<button[^>]+data-hunt="kalisk"[^>]*>TRAQUER LE KALISK<\/button>/);
  assert.match(html, /id="media-coverage-grid"/);
});
