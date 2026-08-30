import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { MothershipHub } from '../src/world/MothershipHub.js';

test('le croiseur v1.13 expose onze compartiments connectés par treize portes', () => {
  const hub = new MothershipHub(new THREE.Scene());
  const zones = hub.getZones();
  const doors = hub.getDoors();
  const zoneIds = new Set(zones.map(({ id }) => id));

  assert.equal(zones.length, 11);
  assert.equal(zoneIds.size, zones.length);
  assert.equal(doors.length, 13);
  assert.ok(zoneIds.has('bridge-cockpit'));
  assert.ok(zoneIds.has('cryo-gallery'));
  assert.ok(zoneIds.has('escape-pod-bay'));
  assert.ok(zoneIds.has('cleaner-medbay'));
  assert.ok(zoneIds.has('engine-core'));
  assert.ok(zoneIds.has('rear-airlock'));
  assert.ok(zoneIds.has('spine-corridor'));

  const graph = new Map([...zoneIds].map((id) => [id, new Set()]));
  doors.forEach((door) => {
    assert.ok(zoneIds.has(door.from), `zone source inconnue: ${door.from}`);
    assert.ok(zoneIds.has(door.to), `zone destination inconnue: ${door.to}`);
    assert.ok(door.width >= 8);
    assert.ok(door.clearance >= 5.6);
    assert.equal(door.state, 'open');
    graph.get(door.from).add(door.to);
    graph.get(door.to).add(door.from);
  });

  const visited = new Set(['spine-corridor']);
  const queue = ['spine-corridor'];
  while (queue.length) {
    const current = queue.shift();
    graph.get(current).forEach((next) => {
      if (visited.has(next)) return;
      visited.add(next);
      queue.push(next);
    });
  }
  assert.equal(visited.size, zones.length, 'chaque salle doit être reliée au réseau de coursives');
  hub.dispose();
});

test('le pont, la cryostase, les pods, le Cleaner lab, le noyau et le sas sont réellement modélisés', () => {
  const hub = new MothershipHub(new THREE.Scene());
  const roles = new Set(hub.propRegistry.map(({ userData }) => userData.role));

  for (const role of [
    'compartment-network',
    'compartment-bulkheads',
    'pressure-door-network',
    'perforated-deck',
    'organic-hull-ribs',
    'perch-network',
    'pilot-throne',
    'cockpit-hologram',
    'cryo-array',
    'escape-pod-rack',
    'cleaner-lab',
    'bio-containment',
    'engine-reactor',
    'rear-airlock',
    'loadout-lockers',
    'expanded-hangar',
    'parked-hunt-craft',
  ]) {
    assert.ok(roles.has(role), `prop fonctionnel manquant: ${role}`);
  }

  for (const name of [
    'cockpit-forward-canopy',
    'bridge-pilot-throne',
    'bridge-stellar-hologram',
    'cryo-pod-shell-instances',
    'escape-pod-hull-instances',
    'cleaner-surgery-slab',
    'cleaner-bioscan-ring',
    'engine-reactor-core',
    'rear-airlock-hatch',
    'rear-airlock-iris-petals',
    'grand-hangar-extension',
    'hangar-parked-hunt-craft',
  ]) {
    assert.ok(hub.group.getObjectByName(name), `volume polygonal absent: ${name}`);
  }

  assert.deepEqual(
    [...hub.compartmentLandmarks.keys()],
    ['bridge-cockpit', 'cryo-gallery', 'escape-pod-bay', 'cleaner-medbay', 'engine-core', 'rear-airlock'],
  );
  hub.dispose();
});

test('les nouvelles stations interactives restent compatibles avec les quatre stations historiques', () => {
  const hub = new MothershipHub(new THREE.Scene());
  assert.equal(hub.stations.length, 4);
  assert.equal(hub.getStations().length, 10);

  assert.deepEqual(
    hub.compartmentStations.map(({ id, interactionType }) => [id, interactionType]),
    [
      ['bridge-navigation', 'navigation'],
      ['cryo-control', 'cryo'],
      ['escape-pod-control', 'escape_pods'],
      ['cleaner-lab-control', 'cleaner_lab'],
      ['engine-core-control', 'core'],
      ['rear-airlock-control', 'airlock'],
    ],
  );
  assert.equal(hub.getNearbyStation(new THREE.Vector3(0, 0, -58.5)).id, 'bridge-navigation');
  assert.equal(hub.getNearbyStation(new THREE.Vector3(-50.5, 0, -23)).id, 'cryo-control');
  assert.equal(hub.getNearbyStation(new THREE.Vector3(49, 0, -18)).id, 'cleaner-lab-control');
  assert.equal(hub.getNearbyStation(new THREE.Vector3(33, 0, 60)).id, 'engine-core-control');
  hub.dispose();
});

test('les coursives, portes et colliders du grand plan restent praticables', () => {
  const hub = new MothershipHub(new THREE.Scene());
  const bounds = hub.getBounds();
  assert.equal(bounds.maxX - bounds.minX, 133);
  assert.equal(bounds.maxZ - bounds.minZ, 173);
  assert.equal(hub.getColliders().length, 86);

  for (const point of [
    new THREE.Vector3(0, 0, -52),
    new THREE.Vector3(-36, 0, -22),
    new THREE.Vector3(36, 0, -22),
    new THREE.Vector3(-36, 0, 12),
    new THREE.Vector3(36, 0, 12),
  ]) {
    const before = point.clone();
    hub.constrainPlayer(point, 1.8);
    assert.deepEqual(point.toArray(), before.toArray(), `porte obstruée à ${before.x}, ${before.z}`);
  }

  const insideBulkhead = new THREE.Vector3(-36, 0, -40);
  hub.constrainPlayer(insideBulkhead, 1.8);
  assert.notDeepEqual(insideBulkhead.toArray(), [-36, 0, -40]);

  const insideCore = new THREE.Vector3(43, 0, 60);
  hub.constrainPlayer(insideCore, 1.8);
  assert.ok(Math.hypot(insideCore.x - 43, insideCore.z - 60) >= 7.2 - 1e-9);

  assert.equal(hub.getPerches().length, 10);
  assert.ok(hub.getPerches().every(({ x, z }) => (
    x > bounds.minX && x < bounds.maxX && z > bounds.minZ && z < bounds.maxZ && Math.abs(x) >= 21
  )));
  assert.equal(hub.getZoneAt(new THREE.Vector3(-50, 0, -23)).id, 'cryo-gallery');
  hub.dispose();
});

test('la densité polygonale augmente fortement tout en respectant le budget WebGL', () => {
  const hub = new MothershipHub(new THREE.Scene());
  const snapshot = hub.getPerformanceSnapshot();

  assert.ok(snapshot.triangleEstimate >= 220000, `densité insuffisante: ${snapshot.triangleEstimate} triangles`);
  assert.ok(snapshot.triangleEstimate <= 300000, `budget triangles dépassé: ${snapshot.triangleEstimate}`);
  assert.ok(snapshot.drawCallEstimate <= 300, `budget draw calls dépassé: ${snapshot.drawCallEstimate}`);
  assert.ok(snapshot.meshCount <= 300, `budget meshes dépassé: ${snapshot.meshCount}`);

  const instancedDetails = hub.propRegistry.filter((object) => object.isInstancedMesh);
  assert.ok(instancedDetails.length >= 25);
  assert.ok(instancedDetails.reduce((total, mesh) => total + mesh.count, 0) >= 1400);
  hub.dispose();
});
