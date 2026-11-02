import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { MothershipHub } from '../src/world/MothershipHub.js';
import { ShipNavigation } from '../src/world/ShipNavigation.js';

test('every ship service is backed by a physical terminal in its room with a clear operating approach', () => {
  const hub = new MothershipHub(new THREE.Scene());
  try {
    assert.equal(hub.getStations().length, 25);
    for (const station of hub.getStations()) {
      assert.ok(hub.group.getObjectByName(station.consoleId), `${station.id}: the service has no physical terminal`);
      assert.equal(hub.getZoneAt(station.approachPosition)?.id, station.zoneId, `${station.id}: the operating point is in another compartment`);
      const position = station.approachPosition.clone();
      hub.constrainPlayer(position, 1.8);
      assert.ok(position.distanceTo(station.approachPosition) < 1e-5, `${station.id}: the operator stands in solid equipment`);
      assert.equal(hub.getNearbyStation(position)?.id, station.id);
      assert.ok(station.consolePosition.distanceTo(position) < 6);
      assert.equal(station.available, true);
      assert.ok(station.accessLabel && station.serviceId);
    }
    assert.equal(hub.getStation('absent'), null);
  } finally { hub.dispose(); }
});

test('routes between the service rooms and all 25 stations survive the actual player collision controller', () => {
  const hub = new MothershipHub(new THREE.Scene());
  let checkedPositions = 0;
  try {
    const origins = [new THREE.Vector3(0, 0, 20), ...hub.compartmentStations.map(station => station.approachPosition)];
    for (const from of origins) {
      const original = from.clone();
      for (const station of hub.getStations()) {
        const route = hub.getNavigationRoute(from, station.id);
        assert.equal(route.status, 'ready', `${station.id}: no route from ${from.toArray()}`);
        assert.deepEqual(from.toArray(), original.toArray(), 'planning must never move the live actor');
        assert.ok(route.points[0].distanceTo(from) < 1e-6);
        assert.ok(route.points.at(-1).distanceTo(station.approachPosition) < 1e-6);
        const length = route.points.slice(1).reduce((total, point, index) => total + point.distanceTo(route.points[index]), 0);
        assert.ok(Math.abs(length - route.distanceUnits) < 1e-6);
        assert.ok(Math.abs(route.distanceMeters * 3 - length) < 1e-6);
        for (let segment = 1; segment < route.points.length; segment++) {
          const start = route.points[segment - 1], end = route.points[segment];
          const steps = Math.max(1, Math.ceil(start.distanceTo(end) / 0.35));
          for (let step = 0; step <= steps; step++) {
            const position = start.clone().lerp(end, step / steps);
            const before = position.clone();
            hub.constrainPlayer(position, 1.8);
            assert.ok(position.distanceTo(before) < 0.0001, `${station.id}: the route crosses a real collider at ${before.toArray()}`);
            checkedPositions++;
          }
        }
      }
    }
    assert.ok(checkedPositions > 10_000, 'check entire routed segments, not only their endpoints');
  } finally { hub.dispose(); }
});

test('the open pressure-door geometry clears a standing hunter and the external hatch stays sealed', () => {
  const hub = new MothershipHub(new THREE.Scene());
  const matrix = new THREE.Matrix4();
  try {
    const frames = hub.group.getObjectByName('pressure-door-frame-instances');
    frames.geometry.computeBoundingBox();
    for (let index = 0; index < hub.getDoors().length; index++) {
      const door = hub.getDoors()[index];
      if (door.id === 'rear-pressure-hatch') { assert.equal(door.state, 'sealed'); continue; }
      frames.getMatrixAt(index * 3 + 2, matrix);
      const header = frames.geometry.boundingBox.clone().applyMatrix4(matrix);
      assert.ok(header.min.y >= door.clearance - 1e-5, `${door.id}: the visible lintel is lower than its declared clearance`);
      assert.ok(door.clearance >= 7.21 + 0.8);
      const passage = new THREE.Vector3(door.position.x, 0, door.position.z);
      const before = passage.clone();
      hub.constrainPlayer(passage, 1.8);
      assert.ok(passage.distanceTo(before) < 1e-5, `${door.id}: door metadata claims a passage through a solid wall`);
      assert.equal(hub.getColliders().filter(collider => collider.id.startsWith(`${door.id}-jamb-`)).length, 2);
    }
    const canopy = hub.group.getObjectByName('cockpit-forward-canopy');
    for (const perch of hub.getPerches().filter(point => point.zone === 'bridge-cockpit')) {
      const x = (perch.x - canopy.position.x) / (27 * canopy.scale.x);
      const z = (perch.z - canopy.position.z) / (27 * canopy.scale.z);
      const ceiling = canopy.position.y + Math.sqrt(1 - x * x - z * z) * 27 * canopy.scale.y;
      assert.ok(ceiling >= perch.y + 7.21 + 0.8, `${perch.id}: perched hunter passes through the cockpit glass`);
    }
  } finally { hub.dispose(); }
});

test('a nav route never fabricates a direct line through a sealed compartment or blocked endpoint', () => {
  const bounds = { minX: -16, maxX: 16, minZ: -16, maxZ: 16 };
  const start = new THREE.Vector3(-10, 0, 0), end = new THREE.Vector3(10, 0, 0);
  const blocked = new ShipNavigation(bounds, [{ type: 'box', x: 0, z: 0, halfWidth: 1, halfDepth: 16 }]);
  assert.equal(blocked.findRoute(start, end), null);
  const around = new ShipNavigation(bounds, [{ type: 'box', x: 0, z: 0, halfWidth: 1, halfDepth: 6 }]);
  const route = around.findRoute(start, end);
  assert.ok(route?.length > 2);
  assert.ok(route.some(point => Math.abs(point.z) >= 7.8));
  assert.equal(around.findRoute(new THREE.Vector3(0, 0, 0), end), null);
});

test('the scene, navigation snapshot and context delegates share the same station identities', () => {
  const hub = new MothershipHub(new THREE.Scene());
  try {
    const state = hub.getNavigationSnapshot(hub.getStation('cleaner-lab-control').approachPosition);
    assert.equal(state.unitsPerMeter, 3);
    assert.equal(state.zone.id, 'cleaner-medbay');
    assert.deepEqual(state.stations.map(station => station.id), hub.getStations().map(station => station.id));
    state.stations[0].position.x = 10000;
    assert.notEqual(hub.getStations()[0].position.x, 10000);
    assert.equal(hub.getNavigationRoute(new THREE.Vector3(), 'absent').status, 'invalid');
    assert.equal(hub.getNavigationRoute(new THREE.Vector3(0, 0, -8.8), 'armory-forge').status, 'unreachable');
    assert.equal(hub.getNearbyStation(new THREE.Vector3(-22, 20, -26)), null);
    const calls = [];
    hub.shipInteriorDetail.updateTerminalContext = data => { calls.push(data); return true; };
    hub.shipInteriorDetail.setNavigationRoute = data => { calls.push(data); return true; };
    assert.equal(hub.setTerminalContext({ stationId: 'cleaner-lab-control', health: 1 }), true);
    const route = hub.getNavigationRoute(new THREE.Vector3(0, 0, 20), 'cleaner-lab-control');
    assert.equal(hub.setNavigationRoute(route), true);
    assert.equal(calls[0].stationId, 'cleaner-lab-control');
    assert.equal(calls[1], route);
  } finally { hub.dispose(); }
});
