import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { Environment } from '../src/world/Environment.js';
import { getBiomePropPlan, ENVIRONMENT_PERFORMANCE_BUDGETS } from '../src/data/BiomePropCatalog.js';
import { BIOME_HUNT_LAYOUTS, getBiomeHuntLayout } from '../src/data/BiomeHuntLayout.js';
import { resolveWorldPropLayout } from '../src/world/WorldPropLayout.js';

const EXPANDED = ['jungle', 'hive_lv426', 'ryushi_desert', 'yautja_prime', 'genna_deathworld'];

test('the five former arena compositions populate their named open-world districts without stretching the props or their clues', () => {
  for (const biome of EXPANDED) {
    const authored = getBiomePropPlan(biome);
    const before = JSON.stringify(authored);
    const layout = getBiomeHuntLayout(biome);
    const placed = resolveWorldPropLayout(authored, layout);
    assert.equal(JSON.stringify(authored), before, 'the catalogue remains an immutable source description');
    assert.deepEqual(placed.props.map(prop => prop.id), authored.props.map(prop => prop.id));
    assert.ok(new Set(placed.props.map(prop => prop.layoutSectorId)).size >= 7, `${biome}: story props still occupy only the old arena`);
    assert.ok(placed.props.filter(prop => Math.hypot(prop.position[0], prop.position[2]) > layout.playableRadius * 0.4).length >= 6);
    for (const prop of placed.props) {
      assert.equal(prop.layoutResolved, true, `${prop.id}: no safe district position`);
      assert.ok(Math.hypot(prop.position[0], prop.position[2]) + prop.layoutRadius <= layout.playableRadius - 19.99);
      const original = authored.props.find(item => item.id === prop.id);
      assert.equal(prop.scale, original.scale);
      assert.equal(prop.rotation, original.rotation);
    }
    for (const key of ['pointsOfInterest', 'hazardZones']) {
      for (const entry of placed[key]) {
        const original = authored[key].find(item => item.id === entry.id);
        const anchor = placed.props.find(prop => prop.id === entry.layoutAnchorId);
        assert.ok(anchor, `${entry.id}: the story clue lost its physical composition`);
        for (const axis of [0, 2]) assert.ok(Math.abs((entry.position[axis] - anchor.position[axis]) - (original.position[axis] - anchor.authoredPosition[axis])) < 1e-8);
        assert.equal(entry.label, original.label);
        assert.equal(entry.interactionType, original.interactionType);
        assert.equal(entry.damage, original.damage);
      }
    }
    const shuffled = { ...authored, props: [...authored.props].reverse() };
    const other = resolveWorldPropLayout(shuffled, layout);
    for (const prop of other.props) assert.equal(prop.layoutSectorId, placed.props.find(item => item.id === prop.id).layoutSectorId, 'district assignment must use identities rather than list order');
  }
});

test('the rendered districts keep real cover out of buildings and every clue has a usable approach within its interaction range', () => {
  const env = new Environment(new THREE.Scene());
  const matrix = new THREE.Matrix4();
  const center = new THREE.Vector3();
  const vertex = new THREE.Vector3();
  try {
    for (const biome of Object.keys(BIOME_HUNT_LAYOUTS)) {
      env.setBiome(biome);
      const cover = env.routeRoot.getObjectByName('hunt-outer-sector-cover');
      const vertices = cover.geometry.getAttribute('position');
      for (let instance = 0; instance < cover.count; instance++) {
        cover.getMatrixAt(instance, matrix);
        center.setFromMatrixPosition(matrix);
        let radius = 0;
        for (let index = 0; index < vertices.count; index++) {
          vertex.fromBufferAttribute(vertices, index).applyMatrix4(matrix);
          radius = Math.max(radius, Math.hypot(vertex.x - center.x, vertex.z - center.z));
        }
        for (const footprint of env.getPropFootprints()) assert.ok(Math.hypot(center.x - footprint.x, center.z - footprint.z) >= radius + footprint.radius + 2.99, `${biome}: a rendered cover intersects ${footprint.id}`);
      }
      for (const poi of env.pointsOfInterest) {
        let reachable = false;
        for (const fraction of [0, 0.45, 0.8]) {
          for (let step = 0; step < 32 && !reachable; step++) {
            const angle = step / 32 * Math.PI * 2;
            const x = poi.position.x + Math.cos(angle) * poi.interactionRadius * fraction;
            const z = poi.position.z + Math.sin(angle) * poi.interactionRadius * fraction;
            const position = new THREE.Vector3(x, env.sampleHeight(x, z), z);
            reachable = env.isSpawnPositionClear(position, 1.8) && position.distanceTo(poi.position) <= poi.interactionRadius;
          }
        }
        assert.equal(reachable, true, `${poi.id}: no clear standing position within scanner range`);
      }
      const metrics = env.getLevelDesignSnapshot();
      assert.ok(metrics.totalTriangleEstimate <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxTriangles);
      assert.ok(metrics.totalDrawCallEstimate <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxDrawCalls);
      assert.ok(metrics.colliderCount <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxColliders);
      assert.ok(metrics.totalColliderCount <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxColliders);
    }
  } finally { env.dispose(); }
});

test('a remote archive cannot be operated from directly above its interaction sphere', () => {
  const env = new Environment(new THREE.Scene());
  try {
    env.setBiome('jungle');
    const point = env.pointsOfInterest[0];
    const perch = point.position.clone().add(new THREE.Vector3(0, 100, 0));
    assert.equal(env.getNearbyPointOfInterest(perch), null);
    assert.equal(env.interactWithPointOfInterest(perch), false);
    assert.equal(point.scanned, false);
    assert.equal(env.interactWithPointOfInterest(point.position).poiId, point.id);
  } finally { env.dispose(); }
});

test('existing trees, resin pillars and rocks supply the outer journeys without increasing their geometry budgets', () => {
  const env = new Environment(new THREE.Scene());
  const cases = [
    ['jungle', 'jungle-tree-', 45, 279421],
    ['hive_lv426', 'hive-resin-pillar-', 30, 188722],
    ['ryushi_desert', 'ryushi-rock-', 25, 102846],
  ];
  try {
    for (const [biome, prefix, count, triangles] of cases) {
      env.setBiome(biome);
      const scenery = env.obstacleColliders.filter(collider => collider.sourceId?.startsWith(prefix));
      assert.equal(scenery.length, count);
      assert.ok(scenery.filter(collider => Math.hypot(collider.x, collider.z) > env.playableRadius * 0.4).length >= count * 0.65, `${biome}: scenery is still restricted to the former central arena`);
      assert.ok(Math.max(...scenery.map(collider => Math.hypot(collider.x, collider.z))) > env.playableRadius * 0.7);
      assert.equal(env.getLevelDesignSnapshot().totalTriangleEstimate, triangles, 'reuse the scenery instead of adding geometry to fill the map');
      for (const collider of scenery) {
        assert.ok(Math.hypot(collider.x, collider.z) + collider.radius < env.playableRadius);
        for (const route of env.routeRoot.children.filter(object => object.userData.huntRoute)) {
          const vertices = route.geometry.getAttribute('position');
          for (let index = 0; index < vertices.count - 2; index += 2) {
            const ax = (vertices.getX(index) + vertices.getX(index + 1)) * 0.5;
            const az = (vertices.getZ(index) + vertices.getZ(index + 1)) * 0.5;
            const bx = (vertices.getX(index + 2) + vertices.getX(index + 3)) * 0.5;
            const bz = (vertices.getZ(index + 2) + vertices.getZ(index + 3)) * 0.5;
            const dx = bx - ax, dz = bz - az;
            const t = Math.max(0, Math.min(1, ((collider.x - ax) * dx + (collider.z - az) * dz) / Math.max(0.001, dx * dx + dz * dz)));
            const halfWidth = Math.hypot(vertices.getX(index) - vertices.getX(index + 1), vertices.getZ(index) - vertices.getZ(index + 1)) * 0.5;
            assert.ok(Math.hypot(collider.x - ax - t * dx, collider.z - az - t * dz) >= collider.radius + halfWidth + 2.5, `${collider.sourceId}: scenery blocks a travel corridor`);
          }
        }
      }
      if (biome === 'hive_lv426') assert.ok(scenery.every(collider => collider.radius === 7), 'the solid pillar base is seven units wide, not 5.5');
    }
  } finally { env.dispose(); }
});

test('ground hazards do not damage or warn a hunter on a high perch, but retain their ground-level effects', () => {
  const env = new Environment(new THREE.Scene());
  try {
    for (const biome of Object.keys(BIOME_HUNT_LAYOUTS)) {
      env.setBiome(biome);
      for (const hazard of env.hazardZones) {
        const airborne = { position: hazard.position.clone().add(new THREE.Vector3(0, 40, 0)) };
        assert.equal(env.updateHazardZones(1, airborne).some(signal => signal.hazardId === hazard.id), false, `${hazard.id}: damage crosses a forty-unit vertical gap`);
        assert.equal(hazard.warned, false);
        hazard.cooldown = 0;
        const grounded = { position: hazard.position.clone() };
        const signal = env.updateHazardZones(1, grounded).find(signal => signal.hazardId === hazard.id);
        assert.ok(signal, `${hazard.id}: ground hazard stopped functioning`);
        assert.equal(signal.damage, hazard.damage);
        assert.equal(signal.status, hazard.status);
      }
    }
  } finally { env.dispose(); }
});
