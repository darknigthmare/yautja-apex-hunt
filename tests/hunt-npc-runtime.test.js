import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { HUNT_NPC_ARCHETYPES, HuntNPC } from '../src/entities/HuntNPC.js';

function makePlayer(position = [0, 0, 0], overrides = {}) {
  return {
    position: new THREE.Vector3(...position),
    isCloaked: false,
    ...overrides,
  };
}

test('all hunt NPC archetypes expose the shared runtime contract', () => {
  assert.deepEqual(Object.keys(HUNT_NPC_ARCHETYPES), [
    'xeno_drone',
    'hunting_hound',
    'human_fireteam',
    'combat_synthetic',
  ]);

  for (const type of Object.keys(HUNT_NPC_ARCHETYPES)) {
    const npc = new HuntNPC(type);
    assert.equal(npc.type, type);
    assert.ok(npc.id.startsWith(`${type}-`));
    assert.ok(npc.mesh.isGroup);
    assert.equal(npc.position, npc.mesh.position);
    assert.ok(npc.colliderRadius > 0);
    assert.ok(Array.isArray(npc.projectiles));
    npc.dispose();
  }
});

test('damage reduces health and death stops all NPC activity', () => {
  const npc = new HuntNPC('xeno_drone', { health: 50 });
  const hit = npc.takeDamage(18);
  assert.deepEqual(hit, { damage: 18, killed: false, remainingHealth: 32 });

  const fatal = npc.takeDamage(100);
  assert.equal(fatal.killed, true);
  assert.equal(npc.health, 0);
  assert.equal(npc.isDead, true);
  assert.deepEqual(npc.update(1, { player: makePlayer([0, 0, 1]) }), []);
  npc.dispose();
});

test('a net freezes movement until its timer has fully elapsed', () => {
  const npc = new HuntNPC('hunting_hound', { position: [0, 0, 0] });
  const player = makePlayer([0, 0, 12]);
  assert.equal(npc.applyNet(1), true);

  npc.update(0.5, { player });
  assert.deepEqual(npc.position.toArray(), [0, 0, 0]);
  assert.equal(npc.isNetted, true);

  const releaseSignals = npc.update(0.6, { player });
  assert.deepEqual(npc.position.toArray(), [0, 0, 0]);
  assert.equal(npc.isNetted, false);
  assert.equal(releaseSignals[0].type, 'log');

  npc.update(0.25, { player });
  assert.ok(npc.position.z > 0);
  npc.dispose();
});

test('voice mimicry diverts a nearby NPC toward the lure without attacking it', () => {
  const npc = new HuntNPC('hunting_hound', { position: [0, 0, 0] });
  const player = makePlayer([0, 0, 20]);
  const lure = new THREE.Vector3(12, 0, 0);
  assert.equal(npc.hearMimicry(lure, 1), true);
  const signals = npc.update(0.5, { player });
  assert.deepEqual(signals, []);
  assert.ok(npc.position.x > 0, 'le PNJ doit marcher vers le leurre');
  assert.equal(npc.position.z, 0, 'le PNJ ne doit pas poursuivre le joueur pendant le leurre');
  assert.equal(npc.mesh.userData.investigatingLure, true);
  npc.update(0.6, { player });
  assert.equal(npc.mesh.userData.investigatingLure, false);
  const before = npc.position.z;
  npc.update(0.25, { player });
  assert.ok(npc.position.z > before, 'la poursuite du joueur reprend après expiration');
  npc.dispose();
});

test('the hunting hound reveals a cloaked player inside its detection radius', () => {
  const npc = new HuntNPC('hunting_hound');
  const player = makePlayer([0, 0, 4], { isCloaked: true });
  const signals = npc.update(0, { player });
  const reveal = signals.find((signal) => signal.type === 'reveal_cloak');

  assert.ok(reveal);
  assert.equal(reveal.sourceId, npc.id);
  assert.equal(reveal.target, player);
  npc.dispose();
});

test('the xenomorph drone inflicts a corrosion status in melee', () => {
  const npc = new HuntNPC('xeno_drone');
  const signals = npc.update(0, { player: makePlayer([0, 0, 1]) });
  const attack = signals.find((signal) => signal.type === 'attack_player');

  assert.ok(attack);
  assert.equal(attack.damageType, 'corrosion');
  assert.equal(attack.status, 'corrosion');
  assert.ok(attack.statusDuration > 0);
  npc.dispose();
});

test('a human fireteam NPC fires a ranged projectile signal', () => {
  const npc = new HuntNPC('human_fireteam');
  const signals = npc.update(0, { player: makePlayer([0, 0, 10]) });
  const attack = signals.find((signal) => signal.type === 'attack_player');

  assert.ok(attack);
  assert.equal(attack.attackKind, 'projectile');
  assert.equal(attack.damageType, 'ballistic');
  assert.ok(attack.projectile.origin.isVector3);
  assert.ok(attack.projectile.direction.isVector3);
  npc.dispose();
});

test('dispose releases resources once and remains idempotent', () => {
  const npc = new HuntNPC('combat_synthetic');
  const scene = new THREE.Scene();
  scene.add(npc.mesh);

  assert.equal(npc.dispose(), true);
  assert.equal(npc.mesh.parent, null);
  assert.equal(npc.projectiles.length, 0);
  assert.equal(npc.dispose(), false);
});
