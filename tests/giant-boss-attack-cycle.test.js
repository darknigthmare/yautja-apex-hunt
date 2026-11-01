import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { RhynthBoss } from '../src/entities/RhynthBoss.js';
import { VydrachBoss } from '../src/entities/VydrachBoss.js';
import { XenomorphKingBoss } from '../src/entities/XenomorphKingBoss.js';
import { HUNT_DEFINITIONS } from '../src/data/GameConfig.js';
import { getVisualCenter } from '../src/utils/worldScale.js';

const CASES = [
  [RhynthBoss, 'stomp', 11, 'rhynth_stomp'],
  [RhynthBoss, 'charge', 35, 'rhynth_charge'],
  [VydrachBoss, 'tail_whip', 12, 'vydrach_tail_whip'],
  [VydrachBoss, 'aerial_dive', 35, 'vydrach_aerial_dive'],
  [XenomorphKingBoss, 'cleave_swipe', 11, 'king_cleave_swipe'],
  [XenomorphKingBoss, 'leap_slam', 32, 'king_leap_slam'],
];

test('all six giant-boss attacks retain windup state across real frames and expose exactly one impact', () => {
  for (const [Boss, kind, distance, id] of CASES) {
    const boss = new Boss(new THREE.Scene());
    try {
      const target = boss.position.clone().add(new THREE.Vector3(0, 0, distance));
      const originalPosition = boss.position.clone();
      boss.update(1 / 60, target, false);
      assert.equal(boss.activeAttackType, id);
      assert.equal(boss.attackStage, 'windup');
      assert.equal(boss.attackTelegraphAnnounced, false);
      assert.equal(boss.consumeAttackImpact(), false);
      boss.attackTelegraphAnnounced = true;
      const spec = boss.attackSpecs[kind];
      let elapsed = 0;
      while (!boss.attackImpactReady && elapsed < spec.windup + 0.1) {
        boss.update(1 / 60, target, false);
        elapsed += 1 / 60;
        assert.equal(boss.activeAttackType, id, `${id}: overwritten with chase before impact`);
        assert.equal(boss.aiState, spec.state);
        assert.equal(boss.attackTelegraphAnnounced, true, `${id}: telegraph announced again every frame`);
        if (elapsed < spec.windup - 0.02) assert.equal(boss.attackImpactReady, false);
      }
      assert.ok(elapsed >= spec.windup - 1e-6 && elapsed <= spec.windup + 0.05, `${id}: impact timing ${elapsed}`);
      assert.ok(boss.position.distanceTo(originalPosition) < 1e-7, `${id}: travelled during preparation`);
      assert.equal(boss.consumeAttackImpact(), true);
      assert.equal(boss.consumeAttackImpact(), false);
      for (let frame = 0; frame < 180 && boss.activeAttackType; frame++) {
        boss.update(1 / 60, target, false);
        assert.equal(boss.consumeAttackImpact(), false, `${id}: more than one damage pulse in the attack`);
      }
      assert.equal(boss.activeAttackType, null, `${id}: recovery never ended`);
      assert.ok(boss.attackCooldown > 0, `${id}: no post-attack cooldown`);
      assert.equal(boss.startTelegraphedAttack(kind, target), false, `${id}: cooldown can be bypassed`);
      if (spec.speedKey) {
        assert.ok(boss.position.distanceTo(originalPosition) > 10, `${id}: lunge never moved`);
        assert.ok(boss.position.distanceTo(target) >= boss.colliderRadius + 1.8 - 1e-6, `${id}: lunge passed through the hunter`);
      }
    } finally { boss.dispose(); }
  }
});

test('a repeated close fight produces one telegraph and one consumable hit per attack episode', () => {
  for (const Boss of [RhynthBoss, VydrachBoss, XenomorphKingBoss]) {
    const boss = new Boss(new THREE.Scene());
    try {
      const target = boss.position.clone().add(new THREE.Vector3(0, 0, 11));
      let announces = 0, impacts = 0;
      const sequences = new Set();
      for (let frame = 0; frame < 1200 && impacts < 3; frame++) {
        boss.update(1 / 60, target, false);
        if (boss.activeAttackType && !boss.attackTelegraphAnnounced) {
          announces++;
          boss.attackTelegraphAnnounced = true;
        }
        if (boss.consumeAttackImpact()) {
          impacts++;
          assert.equal(sequences.has(boss.attackSequence), false);
          sequences.add(boss.attackSequence);
        }
      }
      assert.equal(impacts, 3, `${Boss.name}: AI stops attacking after its first windup`);
      assert.equal(announces, impacts, `${Boss.name}: duplicate telegraphs`);
    } finally { boss.dispose(); }
  }
});

test('net, topple and death cancel pending impacts immediately', () => {
  for (const [Boss, kind, distance] of CASES) {
    for (const interrupt of ['net', 'topple', 'death']) {
      const boss = new Boss(new THREE.Scene());
      try {
        const target = boss.position.clone().add(new THREE.Vector3(0, 0, distance));
        assert.equal(boss.startTelegraphedAttack(kind, target), true);
        boss.update(boss.attackWindupDuration + 0.01, target, false);
        assert.equal(boss.attackImpactReady, true);
        if (interrupt === 'net') boss.applyNet();
        else if (interrupt === 'topple') boss.triggerTopple();
        else boss.takeDamage(10000);
        assert.equal(boss.activeAttackType, null, `${Boss.name}/${interrupt}`);
        assert.equal(boss.consumeAttackImpact(), false, `${Boss.name}/${interrupt}: stale hit`);
        boss.update(0.1, target, false);
        assert.equal(boss.consumeAttackImpact(), false);
      } finally { boss.dispose(); }
    }
  }
});

test('a charge locks its preparation direction instead of homing after the hunter dodges', () => {
  const boss = new RhynthBoss(new THREE.Scene());
  try {
    const target = boss.position.clone().add(new THREE.Vector3(0, 0, 35));
    boss.update(0, target, false);
    const startX = boss.position.x;
    target.x += 30;
    for (let frame = 0; frame < 150 && boss.activeAttackType; frame++) boss.update(1 / 60, target, false);
    assert.ok(Math.abs(boss.position.x - startX) < 1e-6, 'locked charge followed the dodge');
  } finally { boss.dispose(); }
});

test('severing an active wing or tail cancels that Vydrach move, while an injured beast retains a bite', () => {
  const boss = new VydrachBoss(new THREE.Scene());
  try {
    const far = boss.position.clone().add(new THREE.Vector3(0, 0, 35));
    boss.startTelegraphedAttack('aerial_dive', far);
    boss.update(1.01, far, false);
    boss.takeDamage(410, getVisualCenter(boss.leftWingMesh.children[1]));
    assert.equal(boss.activeAttackType, null);
    assert.equal(boss.consumeAttackImpact(), false);
    boss.attackCooldown = 0;
    const close = boss.position.clone().add(new THREE.Vector3(0, 0, 11));
    boss.startTelegraphedAttack('tail_whip', close);
    boss.takeDamage(500, boss.getTailWorldPosition());
    assert.equal(boss.activeAttackType, null);
    boss.rightWingIntact = false;
    boss.attackCooldown = 0;
    boss.update(0, close, false);
    assert.equal(boss.activeAttackType, 'vydrach_bite');
    for (let frame = 0; frame < 60 && !boss.attackImpactReady; frame++) boss.update(1 / 60, close, false);
    assert.equal(boss.consumeAttackImpact(), true);
  } finally { boss.dispose(); }
});

test('new hunt HUD part fields match the actual breakable boss properties', () => {
  for (const [id, Boss] of [['rhynth_titan', RhynthBoss], ['vydrach_prime', VydrachBoss], ['xeno_king', XenomorphKingBoss]]) {
    const boss = new Boss(new THREE.Scene());
    try {
      for (const slot of ['part1', 'part2']) {
        const property = HUNT_DEFINITIONS[id].hud[slot][1];
        assert.equal(typeof boss[property], 'boolean', `${id}/${slot}: unknown property ${property}`);
      }
      assert.equal(HUNT_DEFINITIONS[id].hud.part2[1], 'tailIntact');
    } finally { boss.dispose(); }
  }
});
