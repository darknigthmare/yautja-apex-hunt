import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { HuntNPC, AVAILABLE_HUNT_NPC_ARCHETYPES, HUNT_NPC_LOD_PROFILES } from '../src/entities/HuntNPC.js';
import { CANON_PREY_CATALOG } from '../src/data/PreyTaxonomyAndCrossoverCatalog.js';
import { WORLD_UNITS_PER_METER, metersToWorldUnits, getVisualBounds, NPC_PHYSICAL_PROFILES } from '../src/utils/worldScale.js';

test('the common metre conversion preserves the existing 2.4m hunter and documented catalogue dimensions', () => {
  assert.equal(WORLD_UNITS_PER_METER, 3);
  assert.ok(Math.abs(metersToWorldUnits(2.4) - 7.2) < 1e-12);
  for (const [type, profile] of Object.entries(NPC_PHYSICAL_PROFILES)) {
    if (!profile.catalogId) continue;
    const source = CANON_PREY_CATALOG.find(({ id }) => id === profile.catalogId);
    assert.ok(source, `${type}: missing scale reference ${profile.catalogId}`);
    assert.equal(profile.meters, source.sizeMeters, `${type}: authored size drifted from its catalogue reference`);
  }
});

test('bounds use actual instance transforms and omit hidden geometry', () => {
  const root = new THREE.Group();
  root.position.set(20, 7, -30);
  const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8), new THREE.MeshBasicMaterial(), 1);
  mesh.setMatrixAt(0, new THREE.Matrix4().compose(new THREE.Vector3(10, 3, -4), new THREE.Quaternion(), new THREE.Vector3(0.25, 0.5, 0.2)));
  root.add(mesh);
  const local = getVisualBounds(root, { local: true });
  assert.ok(Math.abs(local.min.x - 9.75) < 1e-6);
  assert.ok(Math.abs(local.min.y - 2.5) < 1e-6);
  assert.ok(Math.abs(getVisualBounds(root).min.x - 29.75) < 1e-6);
  mesh.visible = false;
  assert.equal(getVisualBounds(root).isEmpty(), true);
  assert.equal(getVisualBounds(root, { includeHidden: true }).isEmpty(), false);
  mesh.geometry.dispose(); mesh.material.dispose();
});

test('a full-sized human has adult head proportions and remains shorter than the hunter', () => {
  const npc = new HuntNPC('human_fireteam');
  try {
    const bounds = getVisualBounds(npc.mesh);
    const height = bounds.max.y - bounds.min.y;
    assert.ok(Math.abs(height - 5.4) < 1e-5);
    assert.ok(7.2 / height > 1.25 && 7.2 / height < 1.4, 'the hunter must not be three times a human height');
    const head = npc.mesh.children.find(child => child.userData.physicalPart === 'head' && child.geometry?.type === 'SphereGeometry');
    assert.ok(head);
    const headHeight = getVisualBounds(head).getSize(new THREE.Vector3()).y;
    assert.ok(height / headHeight >= 7 && height / headHeight <= 8.2, `Human head count=${height / headHeight}`);
    assert.ok(npc.colliderRadius > 1 && npc.colliderRadius < 1.6);
    const neck = npc.mesh.getObjectByName('anatomy:human_fireteam:neck');
    assert.ok(neck, 'resizing the skull must not leave a floating head');
    const neckBounds = getVisualBounds(neck);
    assert.ok(neckBounds.intersectsBox(getVisualBounds(head)));
    assert.ok(neckBounds.intersectsBox(getVisualBounds(npc.mesh.children[0])));
  } finally { npc.dispose(); }
});

test('all grounded NPCs and their distant silhouettes keep the same terrain contact', () => {
  for (const type of Object.keys(AVAILABLE_HUNT_NPC_ARCHETYPES)) {
    const npc = new HuntNPC(type, { position: new THREE.Vector3(7, 11, -8) });
    try {
      const near = getVisualBounds(npc.mesh);
      if (HUNT_NPC_LOD_PROFILES[type].family !== 'drone') {
        assert.ok(Math.abs(near.min.y - 11) < 1e-5, `${type}: feet at ${near.min.y}`);
      } else assert.ok(near.min.y > 11.5, 'a sentry drone must keep its hovering clearance');
      npc.update(0, { player: { position: new THREE.Vector3(7, 11, 300) } });
      const distant = getVisualBounds(npc.mesh);
      assert.ok(Math.abs(distant.min.y - near.min.y) < 1e-5, `${type}: LOD floats/sinks at the switch`);
      const point = npc.getAimPoint();
      assert.ok([point.x, point.y, point.z].every(Number.isFinite));
      assert.ok(point.y > npc.position.y);
    } finally { npc.dispose(); }
  }
});

test('a scaled melee creature can still reach a hunter stopped at collision distance', () => {
  for (const type of Object.keys(AVAILABLE_HUNT_NPC_ARCHETYPES)) {
    const npc = new HuntNPC(type);
    try {
      if (npc.attackKind !== 'projectile') {
        assert.ok(npc.attackRange >= npc.colliderRadius + 1.8,
          `${type}: attack range ${npc.attackRange} is blocked by collision radius ${npc.colliderRadius}`);
      }
    } finally { npc.dispose(); }
  }
});

test('ranged signals originate at the scaled weapon instead of the actor feet', () => {
  const npc = new HuntNPC('human_fireteam', { position: new THREE.Vector3(4, 5, -7) });
  try {
    npc.mesh.rotation.y = Math.PI / 2;
    const origin = npc.getProjectileOrigin();
    assert.ok(origin.y > npc.position.y + 3 && origin.y < npc.position.y + 4);
    assert.ok(origin.x > npc.position.x + 2, 'forward barrel offset must rotate with the actor');
    const signals = npc.update(0, { player: { position: new THREE.Vector3(14, 5, -7) } });
    const attack = signals.find(signal => signal.projectile);
    assert.ok(attack?.projectile.origin.distanceTo(origin) < 1e-6);
    npc.attackCooldown = 0;
    npc.mesh.rotation.y = 0;
    const turned = npc.update(0, { player: { position: new THREE.Vector3(14, 5, -7) } }).find(signal => signal.projectile);
    assert.ok(turned?.projectile.origin.distanceTo(origin) < 1e-6, 'a stationary shooter must turn the visible weapon toward its target');
  } finally { npc.dispose(); }
});
