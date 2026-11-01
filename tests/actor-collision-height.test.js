import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { resolveActorObstacle, resolvePlayerCapsuleImpact } from '../src/gameplay/ActorCollision.js';

test('low cover does not create an infinite vertical wall', () => {
  const obstacle = { x: 0, z: 0, radius: 2, baseY: 0, height: 2 };
  const perched = new THREE.Vector3(0, 12, 0);
  assert.equal(resolveActorObstacle(perched, 1.8, 7.2, obstacle), false);
  const grounded = new THREE.Vector3(0, 0, 0);
  assert.equal(resolveActorObstacle(grounded, 1.8, 7.2, obstacle), true);
  assert.ok(Math.hypot(grounded.x, grounded.z) >= 3.8 - 1e-6);
});

test('the same canopy admits a human and stops the taller hunter', () => {
  const roof = { x: 0, z: 0, radius: 8, shape: 'box', halfWidth: 6, halfDepth: 4, baseY: 5.975, height: 0.45 };
  const human = new THREE.Vector3();
  assert.equal(resolveActorObstacle(human, 1.2, 5.4, roof), false);
  const hunter = new THREE.Vector3();
  assert.equal(resolveActorObstacle(hunter, 1.8, 7.2, roof), true);
  assert.ok(Math.abs(hunter.z) >= 5.8 - 1e-6);
});

test('a rotated box does not block the empty corners of its enclosing circle', () => {
  const obstacle = { x: 10, z: 20, radius: 10, shape: 'box', halfWidth: 4, halfDepth: 1,
    baseY: 0, height: 8, yaw: Math.PI / 2 };
  const empty = new THREE.Vector3(14, 0, 20);
  assert.equal(resolveActorObstacle(empty, 1, 5.4, obstacle), false);
  const inside = new THREE.Vector3(10, 0, 20);
  assert.equal(resolveActorObstacle(inside, 1, 5.4, obstacle), true);
  assert.ok(Math.abs(inside.x - 10) >= 2 - 1e-6);
});

test('finite projectiles hit the rendered head, torso and legs but miss above and beside the body', () => {
  const feet = new THREE.Vector3(12, 4, -8);
  for (const height of [0.5, 3.6, 6.7]) {
    const start = feet.clone().add(new THREE.Vector3(0, height, 20));
    const end = feet.clone().add(new THREE.Vector3(0, height, -20));
    const impact = resolvePlayerCapsuleImpact(start, end, feet);
    assert.ok(impact?.isVector3, `missing body volume at height ${height}`);
    assert.ok(impact.z > feet.z && impact.z < start.z);
    assert.equal(resolvePlayerCapsuleImpact(start, start.clone().add(new THREE.Vector3(0, 0, -1)), feet), null);
  }
  assert.equal(resolvePlayerCapsuleImpact(new THREE.Vector3(12, 12, 10), new THREE.Vector3(12, 12, -20), feet), null);
  assert.equal(resolvePlayerCapsuleImpact(new THREE.Vector3(16, 7, 10), new THREE.Vector3(16, 7, -20), feet), null);
});
