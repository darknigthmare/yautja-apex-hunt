import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { createHeroArmorGeometry, HERO_ARMOR_DIMENSIONS } from '../src/entities/HeroArmorGeometry.js';

function inspectTopology(geometry) {
  const positions = geometry.attributes.position;
  const welded = new Map(), ids = [], edges = new Map();
  for (let i = 0; i < positions.count; i++) {
    const key = [positions.getX(i), positions.getY(i), positions.getZ(i)].map(value => Math.round(value * 100_000)).join(',');
    if (!welded.has(key)) welded.set(key, welded.size);
    ids.push(welded.get(key));
  }
  let signedVolume = 0;
  for (let i = 0; i < geometry.index.count; i += 3) {
    const indices = [0, 1, 2].map(offset => geometry.index.getX(i + offset));
    const [a, b, c] = indices.map(index => new THREE.Vector3().fromBufferAttribute(positions, index));
    assert.ok(b.clone().sub(a).cross(c.clone().sub(a)).lengthSq() > 1e-15, 'degenerate triangle');
    signedVolume += a.dot(b.clone().cross(c)) / 6;
    for (let j = 0; j < 3; j++) {
      const key = [ids[indices[j]], ids[indices[(j + 1) % 3]]].sort((x, y) => x - y).join(',');
      edges.set(key, (edges.get(key) ?? 0) + 1);
    }
  }
  return { signedVolume, edges };
}

test('eight fitted armour surfaces are closed, correctly oriented and bounded in world units', () => {
  for (const [kind, dimensions] of Object.entries(HERO_ARMOR_DIMENSIONS)) {
    for (const side of [-1, 1]) {
      const geometry = createHeroArmorGeometry(kind, { side });
      const { signedVolume, edges } = inspectTopology(geometry);
      assert.ok(signedVolume > 0, `${kind}: inward-facing shell`);
      assert.ok([...edges.values()].every(count => count === 2), `${kind}: open/non-manifold edge`);
      const size = geometry.boundingBox.getSize(new THREE.Vector3());
      for (const [axis, dimension] of [['x', 'width'], ['y', 'height'], ['z', 'depth']]) {
        assert.ok(Math.abs(size[axis] - dimensions[dimension]) < 1e-6, `${kind}: ${axis} dimension mismatch`);
      }
      for (const value of geometry.attributes.normal.array) assert.ok(Number.isFinite(value));
      for (const value of geometry.attributes.uv.array) assert.ok(Number.isFinite(value));
      assert.ok(geometry.index.count / 3 <= 4000, `${kind}: unnecessary tessellation`);
      assert.ok(geometry.groups.length <= 4, `${kind}: fragmented material draws`);
      assert.equal(geometry.groups.reduce((sum, group) => sum + group.count, 0), geometry.index.count);
      geometry.dispose();
    }
  }
});

function points(geometry, predicate) {
  const p = geometry.attributes.position, result = [];
  for (let i = 0; i < p.count; i++) {
    const point = new THREE.Vector3().fromBufferAttribute(p, i);
    if (predicate(point)) result.push(point);
  }
  return result;
}

test('gauntlets taper to the wrist, pauldrons wrap down outside and boots have a real arch', () => {
  const cuff = createHeroArmorGeometry('gauntlet');
  const upper = Math.max(...points(cuff, p => p.y > 0.38).map(p => Math.abs(p.x)));
  const wrist = Math.max(...points(cuff, p => p.y < -0.38).map(p => Math.abs(p.x)));
  assert.ok(upper > wrist * 1.2, 'cuff stayed a straight cylinder');
  const shoulder = createHeroArmorGeometry('pauldron', { side: 1 });
  const outer = Math.min(...points(shoulder, p => p.x > 0.3).map(p => p.y));
  const inner = Math.min(...points(shoulder, p => p.x < -0.3).map(p => p.y));
  assert.ok(outer < inner - 0.05, 'pauldron did not follow the outer deltoid');
  const boot = createHeroArmorGeometry('boot');
  const heel = Math.min(...points(boot, p => p.z < -0.35).map(p => p.y));
  const arch = Math.min(...points(boot, p => Math.abs(p.z + 0.07) < 0.05).map(p => p.y));
  assert.ok(arch > heel + 0.015, 'foot sole has no raised arch');
  assert.ok(boot.groups.some(group => group.materialIndex === 3), 'outsole cannot receive its own material');
  for (const geometry of [cuff, shoulder, boot]) geometry.dispose();
});

test('metric UV density follows custom dimensions and invalid requests fail explicitly', () => {
  const normal = createHeroArmorGeometry('chest');
  const twice = createHeroArmorGeometry('chest', { width: 3.24, height: 1.84, depth: 0.60 });
  const maxU = geometry => Math.max(...points(geometry, () => true).map((_, index) => geometry.attributes.uv.getX(index)));
  assert.ok(Math.abs(maxU(twice) / maxU(normal) - 2) < 1e-5, 'each part was stretched into a fixed 0–1 UV square');
  assert.equal(normal.userData.uvUnits, 'metres');
  assert.throws(() => createHeroArmorGeometry('unknown'), RangeError);
  assert.throws(() => createHeroArmorGeometry('boot', { width: -1 }), RangeError);
  assert.throws(() => createHeroArmorGeometry('chest', { height: NaN }), RangeError);
  normal.dispose();
  twice.dispose();
});
