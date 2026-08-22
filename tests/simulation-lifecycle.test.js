import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { disposeObject3D } from '../src/utils/materialState.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('les temporisateurs de gameplay avancent avec le delta de simulation', () => {
  for (const file of [
    'src/entities/YautjaPlayer.js',
    'src/entities/FacehuggerEgg.js',
    'src/entities/BadBloodRival.js',
  ]) {
    const source = readFileSync(join(ROOT, file), 'utf8');
    assert.equal(source.includes('setTimeout('), false, `${file} must freeze cleanly while paused`);
  }
});

test('la destruction 3D libère aussi les géométries et matériaux Points', () => {
  let geometryDisposals = 0;
  let materialDisposals = 0;
  let parentRemovals = 0;
  const points = {
    geometry: { dispose: () => { geometryDisposals += 1; } },
    material: { dispose: () => { materialDisposals += 1; } },
    userData: {},
  };
  const root = {
    userData: {},
    parent: { remove: () => { parentRemovals += 1; } },
    traverse: (visitor) => visitor(points),
  };

  assert.equal(disposeObject3D(root), true);
  assert.equal(disposeObject3D(root), false);
  assert.equal(geometryDisposals, 1);
  assert.equal(materialDisposals, 1);
  assert.equal(parentRemovals, 1);
});
