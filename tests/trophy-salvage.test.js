import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { TrophySalvage } from '../src/gameplay/TrophySalvage.js';

function specimen(type = 'xeno_warrior') {
  const mesh = new THREE.Group();
  const surface = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshBasicMaterial());
  surface.position.y = 1; mesh.add(surface);
  const enemy = { type, name: type, mesh, position: new THREE.Vector3(), isDead: true, disposed: 0,
    dispose() { this.disposed++; surface.geometry.dispose(); surface.material.dispose(); } };
  return enemy;
}

test('only a nearby defeated physical specimen yields material, once and on interaction', () => {
  const store = new TrophySalvage();
  const enemy = specimen();
  let credited = 0;
  assert.equal(store.register({ ...enemy, isDead: false }), false);
  assert.equal(store.register(enemy), true);
  assert.equal(store.register(enemy), false);
  assert.equal(store.collect(new THREE.Vector3(100, 0, 0), () => credited++), null);
  assert.equal(credited, 0);
  const collected = store.collect(new THREE.Vector3(), () => { credited++; return true; });
  assert.equal(collected.sourceId, 'xeno_warrior');
  assert.equal(credited, 1);
  assert.equal(enemy.disposed, 1);
  assert.equal(store.collect(new THREE.Vector3(), () => credited++), null);
});

test('failed collection keeps the body and unsupported species yield no material', () => {
  const store = new TrophySalvage();
  const enemy = specimen();
  assert.equal(store.register(enemy), true);
  assert.equal(store.collect(new THREE.Vector3(), () => false), null);
  assert.equal(enemy.disposed, 0);
  const unsupported = specimen('combat_synthetic');
  assert.equal(store.register(unsupported), false);
  unsupported.dispose(); store.clear();
  assert.equal(enemy.disposed, 1);
});

test('body resources are bounded and released on expiry or leaving a hunt', () => {
  const store = new TrophySalvage({ capacity: 1, lifetime: 5 });
  const first = specimen(), second = specimen();
  store.register(first); store.register(second);
  assert.equal(first.disposed, 1);
  assert.equal(store.bodies.length, 1);
  store.update(5);
  assert.equal(second.disposed, 1);
  assert.equal(store.bodies.length, 0);
  store.clear(); assert.equal(second.disposed, 1);
});
