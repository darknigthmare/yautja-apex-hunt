import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { ObstacleSpatialIndex } from '../src/world/ObstacleSpatialIndex.js';
import { Environment } from '../src/world/Environment.js';
import { BIOME_HUNT_LAYOUTS } from '../src/data/BiomeHuntLayout.js';
import { ENVIRONMENT_PERFORMANCE_BUDGETS } from '../src/data/BiomePropCatalog.js';

test('local obstacle queries match a complete brute-force scan across cell boundaries and wide footprints', () => {
  const obstacles = Array.from({ length: 256 }, (_, i) => ({
    id: i, x: (i % 16 - 8) * 47 + 3, z: (Math.floor(i / 16) - 8) * 51 - 7,
    radius: i % 31 === 0 ? 85 : 2 + i % 9, blocksActors: i % 13 !== 0,
  }));
  const index = new ObstacleSpatialIndex(64).rebuild(obstacles);
  for (let i = 0; i < 160; i++) {
    const point = { x: Math.sin(i * 2.399) * 430, z: Math.cos(i * 1.617) * 450 };
    const radius = [0, 1.8, 8, 28, 80][i % 5];
    for (const includeProjectileOnly of [false, true]) {
      const expected = obstacles.filter(obstacle => (includeProjectileOnly || obstacle.blocksActors !== false)
        && Math.hypot(point.x - obstacle.x, point.z - obstacle.z) <= radius + obstacle.radius);
      assert.deepEqual(index.query(point, radius, { includeProjectileOnly }).map(obstacle => obstacle.id), expected.map(obstacle => obstacle.id));
    }
  }
  assert.equal(index.totalCount, obstacles.length);
  assert.deepEqual(index.query({ x: 0, z: 0 }, 1e7, { includeProjectileOnly: true }).map(obstacle => obstacle.id), obstacles.map(obstacle => obstacle.id), 'very long casts remain bounded by the complete obstacle pool');
});

test('every rendered outer cover has actor collision, spawn rejection and projectile impact in all nine biomes', () => {
  const env = new Environment(new THREE.Scene());
  const matrix = new THREE.Matrix4();
  const center = new THREE.Vector3();
  try {
    for (const biome of Object.keys(BIOME_HUNT_LAYOUTS)) {
      env.setBiome(biome);
      const rendered = env.routeRoot.getObjectByName('hunt-outer-sector-cover');
      assert.equal(env.huntRouteColliders.length, rendered.count, `${biome}: a solid silhouette has no collider`);
      assert.equal(env.huntRouteActiveColliders.length, rendered.count, `${biome}: a solid collider was silently dropped`);
      for (let instance = 0; instance < rendered.count; instance++) {
        rendered.getMatrixAt(instance, matrix);
        center.setFromMatrixPosition(matrix);
        const collider = env.getNearbyObstacles(center, 0).find(item => item.type === 'hunt-sector-cover'
          && Math.hypot(item.x - center.x, item.z - center.z) < 0.001);
        assert.ok(collider, `${biome}: cover ${instance} is traversable`);
        assert.equal(env.isSpawnPositionClear(new THREE.Vector3(collider.x, collider.baseY, collider.z), 1.8), false);
        const y = collider.baseY + Math.min(5, collider.height * 0.5);
        const hit = env.resolveProjectileCoverImpact(new THREE.Vector3(collider.x - collider.radius - 1, y, collider.z), new THREE.Vector3(collider.x, y, collider.z), 0.1);
        assert.equal(hit?.sourceId, collider.sourceId, `${biome}: a projectile passes through ${collider.sourceId}`);
      }
      const metrics = env.getLevelDesignSnapshot();
      assert.equal(metrics.huntRouteColliderSectorCount, env.huntLayout.sectors.length);
      assert.equal(metrics.totalColliderCount, env.getObstacles({ includeProjectileOnly: true }).length);
      assert.equal(metrics.obstacleIndex.totalCount, metrics.totalColliderCount);
      assert.ok(metrics.totalColliderCount <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxColliders);
      let largestLocalScan = 0;
      for (let x = -600; x <= 600; x += 35) {
        for (let z = -600; z <= 600; z += 35) {
          const nearby = env.getNearbyObstacles({ x, z }, 8);
          const bruteForce = env.obstacleColliders.filter(collider => collider.blocksActors !== false
            && Math.hypot(x - collider.x, z - collider.z) <= 8 + collider.radius);
          assert.deepEqual(nearby, bruteForce);
          largestLocalScan = Math.max(largestLocalScan, env.obstacleIndex.lastCandidateCount);
        }
      }
      assert.ok(largestLocalScan < 32, `${biome}: the local broad phase scans ${largestLocalScan} obstacles`);
    }
  } finally { env.dispose(); }
});

test('pyramid wall transitions and biome changes invalidate the spatial obstacle cache', () => {
  const env = new Environment(new THREE.Scene());
  try {
    env.setBiome('bouvetoya_pyramid');
    const wall = env.pyramidShiftWalls.find(item => item.group === 'alpha');
    const point = new THREE.Vector3(wall.colliders[0].x, wall.closedY, wall.colliders[0].z);
    assert.ok(env.getNearbyObstacles(point, 0).some(item => item.sourceId === wall.id));
    env.triggerPyramidShift({ duration: 2 });
    assert.equal(env.getNearbyObstacles(point, 0).some(item => item.sourceId === wall.id), false);
    env.updatePyramidShift(2);
    assert.equal(env.getNearbyObstacles(point, 0).some(item => item.sourceId === wall.id), false);
    const other = env.pyramidShiftWalls.find(item => item.group === 'beta');
    const otherPoint = new THREE.Vector3(other.colliders[0].x, other.closedY, other.colliders[0].z);
    assert.ok(env.getNearbyObstacles(otherPoint, 0).some(item => item.sourceId === other.id));
    env.setBiome('jungle');
    assert.equal(env.getObstacles({ includeProjectileOnly: true }).some(item => item.sourceId?.startsWith('bouvet-')), false);
    assert.equal(env.getObstacleQueryMetrics().totalCount, env.getObstacles({ includeProjectileOnly: true }).length);
    env.clearBiome();
    assert.equal(env.getObstacleQueryMetrics().totalCount, 0);
  } finally { env.dispose(); }
});

test('the open command shelter has actual posts, tabletop and a finite roof instead of an invisible solid core', () => {
  const env = new Environment(new THREE.Scene());
  try {
    env.setBiome('jungle');
    const camp = env.environmentProps.find(prop => prop.type === 'field_camp');
    camp.mesh.updateWorldMatrix(true, true);
    const roof = camp.colliderParts.find(collider => collider.part === 'canopy_roof');
    const mesh = camp.mesh.getObjectByName(`${camp.id}-canopy`);
    const bounds = new THREE.Box3().setFromObject(mesh);
    assert.equal(roof.shape, 'box');
    assert.ok(Math.abs(roof.baseY - bounds.min.y) < 1e-5);
    assert.ok(Math.abs(roof.baseY + roof.height - bounds.max.y) < 1e-5);
    assert.ok(roof.baseY > camp.position[1] + 5.4 && roof.baseY < camp.position[1] + 7.2, 'the roof clears a human but intersects a standing hunter');
    const world = (x, y, z) => new THREE.Vector3(x, y, z).multiplyScalar(camp.scale).applyAxisAngle(THREE.Object3D.DEFAULT_UP, camp.rotation).add(new THREE.Vector3(...camp.position));
    assert.equal(env.resolveProjectileCoverImpact(world(-12, 3, 0), world(12, 3, 0), 0)?.sourceId, undefined, 'the open aisle is blocked by the former imaginary core');
    assert.equal(env.resolveProjectileCoverImpact(world(3, 4, 0), world(3, 8, 0), 0)?.collider, roof, 'shooting upward must hit the actual overhead panel');
  } finally { env.dispose(); }
});
