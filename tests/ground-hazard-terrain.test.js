import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { Environment } from '../src/world/Environment.js';
import { BIOME_HUNT_LAYOUTS } from '../src/data/BiomeHuntLayout.js';
import { conformGroundMarker } from '../src/world/GroundMarkerGeometry.js';

test('the complete ground-level hazard footprint works on slopes in every biome while high perches stay safe', () => {
  const environment = new Environment(new THREE.Scene());
  let positions = 0;
  try {
    for (const biome of Object.keys(BIOME_HUNT_LAYOUTS)) {
      environment.setBiome(biome);
      for (const hazard of environment.hazardZones) {
        for (let step = 0; step < 36; step++) {
          const angle = step / 36 * Math.PI * 2;
          const x = hazard.position.x + Math.cos(angle) * hazard.radius * 0.9;
          const z = hazard.position.z + Math.sin(angle) * hazard.radius * 0.9;
          const position = new THREE.Vector3(x, environment.sampleHeight(x, z), z);
          hazard.cooldown = 0;
          const hit = environment.updateHazardZones(0, { position }).find(signal => signal.hazardId === hazard.id);
          assert.ok(hit, `${biome}/${hazard.id}: an actor standing inside the footprint escapes the effect`);
          assert.equal(hit.damage, hazard.damage);
          assert.equal(hit.damageType, hazard.damageType ?? 'generic');
          position.y += 40;
          hazard.cooldown = 0;
          assert.equal(environment.updateHazardZones(0, { position }).some(signal => signal.hazardId === hazard.id), false);
          assert.equal(hazard.warned, false);
          positions++;
        }
      }
    }
    assert.equal(positions, 720, 'sample the complete authored set, including the sloping Bouvetøya snare');
  } finally { environment.dispose(); }
});

function boundaryGroundClearance(environment, mesh) {
  mesh.updateWorldMatrix(true, false);
  const vertices = mesh.geometry.getAttribute('position');
  const world = new THREE.Vector3();
  let minimum = Infinity, maximum = -Infinity;
  for (let index = 0; index < vertices.count; index++) {
    world.fromBufferAttribute(vertices, index).applyMatrix4(mesh.matrixWorld);
    const clearance = world.y - environment.sampleHeight(world.x, world.z);
    minimum = Math.min(minimum, clearance);
    maximum = Math.max(maximum, clearance);
  }
  return { minimum, maximum };
}

test('authored and dynamic warning boundaries follow the terrain and keep their gameplay radius during pulses', () => {
  const environment = new Environment(new THREE.Scene());
  try {
    for (const biome of Object.keys(BIOME_HUNT_LAYOUTS)) {
      environment.setBiome(biome);
      for (const hazard of environment.hazardZones) {
        const { minimum } = boundaryGroundClearance(environment, hazard.boundaryRing);
        assert.ok(minimum >= 0.0799, `${hazard.id}: warning boundary is buried in the terrain`);
        assert.equal(hazard.boundaryRing.geometry.getAttribute('position').count, 294);
        assert.equal(hazard.boundaryRing.userData.gameplayRadius, hazard.radius);
      }
      const zone = environment.startLocalizedEvent({
        id: `slope-${biome}`, position: new THREE.Vector3(420, 0, 120), radius: 34, duration: 10, damage: 4, damageType: 'acid',
      });
      const geometry = zone.mesh.geometry;
      const vertices = geometry.getAttribute('position');
      const before = vertices.array.slice();
      const hit = environment.updateHazardZones(0.5, { position: zone.position }).find(signal => signal.hazardId === zone.id);
      assert.equal(hit.damageType, 'acid', 'localized events retain the authored damage family through the hazard signal');
      assert.deepEqual(zone.mesh.scale.toArray(), [1, 1, 1], 'the exact gameplay boundary must not pulse in size');
      assert.deepEqual(vertices.array, before, 'projection must be a construction step, not per-frame geometry churn');
      assert.ok(boundaryGroundClearance(environment, zone.mesh).minimum >= 0.0799);
      let disposed = 0;
      geometry.addEventListener('dispose', () => disposed++);
      environment.updateDynamicEventZones(11);
      assert.equal(disposed, 1, 'the unique projected dynamic geometry is released at expiry');
    }
  } finally { environment.dispose(); }
});

test('projecting one boundary does not deform another marker that shares its original geometry', () => {
  const geometry = new THREE.RingGeometry(9, 10, 32);
  const original = geometry.getAttribute('position').array.slice();
  const material = new THREE.MeshBasicMaterial();
  const first = new THREE.Mesh(geometry, material), second = new THREE.Mesh(geometry, material);
  first.rotation.x = second.rotation.x = -Math.PI / 2;
  first.position.set(30, 0.2, 40);
  const ground = (x, z) => x * 0.1 + z * 0.05;
  assert.equal(conformGroundMarker(first, ground, 0), true);
  assert.notEqual(first.geometry, geometry);
  assert.equal(second.geometry, geometry);
  assert.deepEqual(geometry.getAttribute('position').array, original);
  assert.equal(conformGroundMarker(first, ground, 0), false, 'accidentally repeating setup cannot accumulate the terrain offset');
  first.geometry.dispose(); geometry.dispose(); material.dispose();
});

test('changing biomes disposes both projected boundaries and their retained shared source exactly once', () => {
  const environment = new Environment(new THREE.Scene());
  try {
    environment.setBiome('hive_lv426');
    const source = environment.propBuilder.geometryCache.get('hazard-gameplay-boundary');
    const projected = environment.hazardZones.map(hazard => hazard.boundaryRing.geometry);
    assert.equal(projected.length, 2);
    assert.ok(projected.every(geometry => geometry !== source));
    assert.equal(new Set(projected).size, projected.length);
    const disposals = new Map([source, ...projected].map(geometry => [geometry, 0]));
    for (const geometry of disposals.keys()) {
      geometry.addEventListener('dispose', () => disposals.set(geometry, disposals.get(geometry) + 1));
    }
    environment.setBiome('jungle');
    assert.deepEqual([...disposals.values()], [1, 1, 1], 'clearBiome must release the hidden cached source and both rendered clones');
    environment.dispose();
    assert.deepEqual([...disposals.values()], [1, 1, 1], 'later cleanup cannot release an old biome twice');
  } finally { environment.dispose(); }
});

test('overlapping blackouts darken once and restore only after the last event, including biome changes', () => {
  const environment = new Environment(new THREE.Scene());
  const lighting = () => [environment.mainLight.intensity, environment.ambientLight.intensity,
    environment.hemisphereLight.intensity, ...environment.biomeGroup.children
      .filter(object => object.userData.gunnisonEmergencyLight).map(light => light.intensity)];
  try {
    environment.setBiome('gunnison_outbreak');
    const normal = lighting();
    const first = environment.startLocalizedEvent({ id: 'first', mechanism: 'power_grid_blackout', duration: 1 });
    const dark = lighting();
    assert.ok(dark[0] < normal[0] * 0.3);
    const second = environment.startLocalizedEvent({ id: 'second', mechanism: 'power_grid_blackout', duration: 3 });
    assert.deepEqual(lighting(), dark, 'second blackout must not multiply already dimmed lights');
    environment.updateDynamicEventZones(1.1);
    assert.equal(first.mechanismState.restored, true);
    assert.equal(second.mechanismState.restored, false);
    assert.deepEqual(lighting(), dark, 'the remaining event still owns the outage');
    environment.updateDynamicEventZones(2);
    assert.deepEqual(lighting(), normal, 'last expiry must restore the original, undimmed state');
    assert.equal(environment.endLocalizedEventMechanism(second), false);
    const third = environment.startLocalizedEvent({ id: 'third', mechanism: 'power_grid_blackout', duration: 20 });
    environment.startLocalizedEvent({ id: 'fourth', mechanism: 'power_grid_blackout', duration: 30 });
    environment.setBiome('jungle');
    assert.equal(third.mechanismState.restored, true);
    assert.equal(environment.localizedBlackoutState, null);
    environment.setBiome('gunnison_outbreak');
    assert.deepEqual(lighting(), normal, 'leaving during an outage cannot leave the next level permanently dimmed');
  } finally { environment.dispose(); }
});
