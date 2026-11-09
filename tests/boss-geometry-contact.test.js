import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { RhynthBoss } from '../src/entities/RhynthBoss.js';
import { VydrachBoss } from '../src/entities/VydrachBoss.js';
import { XenomorphKingBoss } from '../src/entities/XenomorphKingBoss.js';
import { XenomorphQueen } from '../src/entities/XenomorphQueen.js';
import { PredalienBoss } from '../src/entities/PredalienBoss.js';
import { GridAlienBoss } from '../src/entities/GridAlienBoss.js';
import { KaliskBoss } from '../src/entities/KaliskBoss.js';
import { getVisualBounds, getVisualCenter } from '../src/utils/worldScale.js';

const BOSS_TYPES = [RhynthBoss, VydrachBoss, XenomorphKingBoss];
function place(boss) {
  boss.position.set(18, 7, -33);
  boss.mesh.position.copy(boss.position);
  boss.mesh.rotation.y = 0.71;
  boss.mesh.updateMatrixWorld(true);
}

test('new boss feet and resting tails contact the floor at an elevated translated origin', () => {
  for (const Boss of BOSS_TYPES) {
    const boss = new Boss(new THREE.Scene());
    try {
      place(boss);
      assert.ok(Math.abs(getVisualBounds(boss.mesh).min.y - boss.position.y) < 0.04,
        `${Boss.name}: visible geometry is buried or floating`);
    } finally { boss.dispose(); }
  }
});

test('Vydrach crest/stinger and King crown/dual blades follow their rendered parts after rotation', () => {
  for (const Boss of [VydrachBoss, XenomorphKingBoss]) {
    const boss = new Boss(new THREE.Scene());
    try {
      place(boss);
      const tail = Boss === VydrachBoss ? boss.mesh.getObjectByName('vydrachTailStinger') : boss.tailBlade;
      assert.ok(boss.getTailWorldPosition().distanceTo(getVisualCenter(tail)) < 1e-7);
      const crest = Boss === VydrachBoss ? boss.crestMesh : boss.crownMesh;
      const point = Boss === VydrachBoss ? boss.getCrestWorldPosition() : boss.getCrownWorldPosition();
      assert.ok(point.distanceTo(getVisualCenter(crest)) < 1e-7);
      assert.ok(boss.getTailWorldPosition().distanceTo(boss.position) > 9, 'tail weakpoint is incorrectly attached to the body origin');
      assert.ok(point.y > boss.position.y + 8, 'crest weakpoint is incorrectly attached to the floor');
    } finally { boss.dispose(); }
  }
});

test('aiming toward a distant boss part cannot award damage before the finite projectile arrives', () => {
  for (const Boss of BOSS_TYPES) {
    const boss = new Boss(new THREE.Scene());
    try {
      place(boss);
      const point = Boss === VydrachBoss ? boss.getCrestWorldPosition() : boss.getAimPoint();
      const start = point.clone().add(new THREE.Vector3(0, 0, 90));
      const end = start.clone().add(new THREE.Vector3(0, 0, -1));
      assert.equal(boss.resolveProjectileImpact(end, 0.1, start), null, `${Boss.name}: infinite-ray impact before arrival`);
      assert.ok(boss.resolveProjectileImpact(point, 0.1, start)?.distanceTo(point) < 1e-7);
    } finally { boss.dispose(); }
  }
});

test('a shot beside Rhynth visible geometry misses despite its broad navigation collider', () => {
  const boss = new RhynthBoss(new THREE.Scene());
  try {
    const start = boss.mesh.localToWorld(new THREE.Vector3(4, 3.4, 12));
    const end = boss.mesh.localToWorld(new THREE.Vector3(4, 3.4, -12));
    assert.equal(boss.resolveProjectileImpact(end, 0.1, start), null);
  } finally { boss.dispose(); }
});

test('torso damage no longer severs a distant tail and severed props land on the current floor', () => {
  for (const Boss of BOSS_TYPES) {
    const boss = new Boss(new THREE.Scene());
    try {
      place(boss);
      const health = boss.tailHealth;
      boss.takeDamage(10, boss.mesh.localToWorld(new THREE.Vector3(0, Boss === VydrachBoss ? 5.5 : 5.2, 0)));
      assert.equal(boss.tailHealth, health, `${Boss.name}: body damage severed the tail`);
      const tailPoint = boss.getTailWorldPosition();
      const prop = boss.spawnSeveredTail();
      assert.ok(Math.abs(prop.position.x - tailPoint.x) < 1e-7 && Math.abs(prop.position.z - tailPoint.z) < 1e-7);
      assert.ok(Math.abs(getVisualBounds(prop).min.y - boss.position.y) < 1e-6, `${Boss.name}: trophy dropped to world Y=0`);
    } finally { boss.dispose(); }
  }
});

test('Vydrach wing hits consume the advertised wing health and prevent a broken-wing aerial dive', () => {
  const boss = new VydrachBoss(new THREE.Scene());
  try {
    const membrane = boss.leftWingMesh.children[1];
    const target = getVisualCenter(membrane);
    const hit = boss.resolveProjectileImpact(target, 0.1, target.clone().add(new THREE.Vector3(0, 12, 0)));
    assert.ok(hit);
    boss.takeDamage(410, hit);
    assert.equal(boss.leftWingIntact, false);
    assert.equal(boss.leftWingMesh.visible, false);
    boss.attackCooldown = 0;
    boss.update(0, boss.position.clone().add(new THREE.Vector3(0, 0, 35)), false);
    assert.notEqual(boss.aiState, 'aerial_dive');
  } finally { boss.dispose(); }
});

test('XenomorphQueen.spawnSeveredTail() anchors the severed tail prop relative to elevated terrain floor', () => {
  const boss = new XenomorphQueen(new THREE.Scene());
  try {
    place(boss);
    const tailPoint = boss.getTailWorldPosition();
    const prop = boss.spawnSeveredTail();
    assert.ok(prop, 'Severed tail prop should be created');
    assert.ok(Math.abs(prop.position.x - tailPoint.x) < 1e-7 && Math.abs(prop.position.z - tailPoint.z) < 1e-7);
    assert.equal(prop.position.y, boss.position.y + 0.5);
  } finally { boss.dispose(); }
});

test('getBossDiegeticTelemetry() reports deterministic 1:1 canonical scale and combat state across all 5 apex bosses', () => {
  const expectedSpecs = [
    { Boss: XenomorphQueen, canonicalHeightM: 4.5 },
    { Boss: PredalienBoss, canonicalHeightM: 3.2 },
    { Boss: XenomorphKingBoss, canonicalHeightM: 5.0 },
    { Boss: GridAlienBoss, canonicalHeightM: 2.6 },
    { Boss: KaliskBoss, canonicalHeightM: 4.2 },
  ];

  for (const { Boss, canonicalHeightM } of expectedSpecs) {
    const boss = new Boss(new THREE.Scene());
    try {
      place(boss);
      const telemetry = boss.getBossDiegeticTelemetry();
      assert.equal(telemetry.canonicalHeightM, canonicalHeightM, `${Boss.name}: canonicalHeightM mismatch`);
      assert.ok(Math.abs(telemetry.worldHeightUnits - canonicalHeightM * 3) < 1e-9, `${Boss.name}: worldHeightUnits mismatch`);
      assert.equal(typeof telemetry.aiState, 'string');
      assert.equal(telemetry.isEnraged, false);
      assert.equal(telemetry.isToppled, false);
      assert.equal(telemetry.tailIntact, true);
      assert.equal(telemetry.groundContactValid, true);
    } finally { boss.dispose(); }
  }
});
