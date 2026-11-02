import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import { MothershipHub } from '../src/world/MothershipHub.js';
import { attachShipInteriorDetail } from '../src/world/ShipInteriorDetail.js';
import { createHubPanelGeometry, createShipTerminalAtlas } from '../src/utils/hubSurfaceDetail.js';

function physicalConsoleNormal(hub, station) {
  const console = hub.group.getObjectByName(station.consoleId);
  const keyboard = console?.children.find(node => node.material?.map === hub.instrumentTexture
    && node.geometry?.parameters?.height < 0.2);
  if (keyboard) return new THREE.Vector3(0, 1, 0).applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(keyboard.matrixWorld));
  const housings = hub.group.getObjectByName('service-terminal-solid-housings');
  const index = housings.userData.stationIds.indexOf(station.id);
  assert.ok(index >= 0, `${station.id}: a real console face is missing`);
  const matrix = new THREE.Matrix4(); housings.getMatrixAt(index, matrix); matrix.premultiply(housings.matrixWorld);
  return new THREE.Vector3(0, 0, 1).applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(matrix));
}

function assertScreenNormal(hub, detail, placementIndex, expected, label) {
  const screens = detail.group.getObjectByName('ship-live-terminal-screens');
  const normal = new THREE.Vector3().fromBufferAttribute(screens.geometry.attributes.normal, placementIndex * 4)
    .applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(screens.matrixWorld));
  assert.ok(normal.dot(expected) > 0.9999, `${label}: atlas normal ${normal.toArray()} differs from the physical reader ${expected.toArray()}`);
  const frames = detail.group.getObjectByName('ship-terminal-armored-bezels');
  const matrix = new THREE.Matrix4(); frames.getMatrixAt(placementIndex * 4, matrix); matrix.premultiply(frames.matrixWorld);
  const frameNormal = new THREE.Vector3(0, 0, 1).applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(matrix));
  assert.ok(frameNormal.dot(expected) > 0.9999, `${label}: bezel is not coplanar with its physical screen`);
  assert.ok(normal.y >= -1e-5, `${label}: a sloped terminal faces the floor`);
}

test('chamfered ship panels spend forty-four triangles on real edges while preserving the external envelope', () => {
  const geometry = createHubPanelGeometry(5.3, 0.08, 5.3, 0.035);
  try {
    geometry.computeBoundingBox(); const size = geometry.boundingBox.getSize(new THREE.Vector3());
    assert.ok(size.distanceTo(new THREE.Vector3(5.3, 0.08, 5.3)) < 1e-5);
    assert.equal(geometry.index.count / 3, 44);
    const p = geometry.attributes.position, normal = geometry.attributes.normal;
    let edgeNormals = 0;
    for (let index = 0; index < p.count; index++) {
      assert.ok(p.getX(index) * normal.getX(index) + p.getY(index) * normal.getY(index) + p.getZ(index) * normal.getZ(index) > 0);
      if (Math.abs(normal.getX(index)) > 0.2 && Math.abs(normal.getY(index)) > 0.2) edgeNormals++;
    }
    assert.ok(edgeNormals > 8);
  } finally { geometry.dispose(); }
});

test('the live terminal atlas reuses its texture, rasterizes actual state, and redraws only changed context', () => {
  const atlas = createShipTerminalAtlas([{ id: 'armory-forge', label: 'FORGE ET ARMURERIE' }]);
  const texture = atlas.texture, pixels = texture.image.data;
  const hash = () => createHash('sha256').update(pixels).digest('hex');
  try {
    assert.equal(texture.isDataTexture, true, 'SSR must work without allocating a browser canvas');
    const original = hash();
    const context = { zoneId: 'armory-forge', stationTitle: 'Forge du clan', honorScore: 1200,
      health: 175, maxHealth: 350, energy: 87, loadoutItems: ['Lames de poignet', 'Canon plasma'], targetLabel: 'Rhynth' };
    assert.equal(atlas.update(context), true);
    assert.equal(atlas.texture, texture); assert.equal(atlas.texture.image.data, pixels);
    assert.notEqual(hash(), original, 'the state must change pixels, not only metadata');
    assert.equal(atlas.getContext().honorScore, '1200');
    assert.deepEqual(atlas.getContext().loadoutItems, context.loadoutItems);
    const version = texture.version;
    assert.equal(atlas.update({ ...context, honorScore: '1200' }), false);
    assert.equal(texture.version, version);
    assert.equal(atlas.update({ routeLabel: 'Vers la cryostase' }), true);
    assert.equal(atlas.getContext().honorScore, '1200', 'a navigation update must retain real progression');
    assert.equal(atlas.getContext().routeLabel, 'Vers la cryostase');
    atlas.update({ honorScore: NaN, health: Infinity, loadoutItems: null });
    assert.equal(atlas.getContext().honorScore, '-'); assert.equal(atlas.getContext().health, '-');
  } finally { atlas.dispose(); }
});

test('new compartment volumes clear the highest perch and standing hunter and participate in camera occlusion', () => {
  const hub = new MothershipHub(new THREE.Scene()), detail = attachShipInteriorDetail(hub);
  try {
    const roofs = detail.group.getObjectByName('ship-room-vault-shells');
    const matrix = new THREE.Matrix4(); roofs.geometry.computeBoundingBox();
    const highestStandingHunter = Math.max(...hub.getPerches().map(perch => perch.y)) + 7.21;
    for (let index = 0; index < roofs.count; index++) {
      roofs.getMatrixAt(index, matrix);
      const bounds = roofs.geometry.boundingBox.clone().applyMatrix4(matrix);
      assert.ok(bounds.min.y > highestStandingHunter + 1.5, 'a new ceiling clips a perched hunter');
    }
    assert.equal(detail.metrics.roofCount, 9);
    assert.ok(detail.metrics.ribCount >= 25);
    assert.equal(detail.group.getObjectByName('ship-overhead-light-diffusers').userData.cameraOcclusion, false);
    const anchor = new THREE.Vector3(-50, 10, -24), camera = new THREE.Vector3(-50, 30, -24);
    const constrained = hub.resolveCameraObstruction(anchor, camera);
    assert.ok(constrained?.y < 22, 'the camera passed through the new compartment roof');
    assert.ok(hub.cameraOcclusion.entries.some(entry => entry.geometry === roofs.geometry));
  } finally { detail.dispose(); hub.dispose(); }
});

test('ship detail is idempotent, preserves station solids, and keeps combined rendering bounded', () => {
  const hub = new MothershipHub(new THREE.Scene());
  const colliders = hub.getColliders(), stations = hub.getStations(), detail = attachShipInteriorDetail(hub);
  try {
    const beforeRepeat = hub.getPerformanceSnapshot();
    assert.equal(attachShipInteriorDetail(hub), detail);
    assert.deepEqual(hub.getPerformanceSnapshot(), beforeRepeat);
    assert.equal(hub.getColliders(), colliders); assert.equal(hub.getStations(), stations);
    assert.ok(beforeRepeat.drawCallEstimate <= 305);
    assert.ok(beforeRepeat.triangleEstimate <= 500_000);
    const lights = []; hub.group.traverse(node => { if (node.isPointLight) lights.push(node); });
    assert.ok(lights.length <= 7 && lights.every(light => !light.castShadow));
    assert.equal(detail.screenPlacements.length, 11);
    assert.ok(detail.group.getObjectByName('ship-live-terminal-screens').material.map === detail.atlas.texture);
    assert.ok(detail.screenPlacements.some(screen => screen.stationId === 'cryo-control' && screen.width === 2.6));
    const fasteners = hub.group.getObjectByName('ship-captive-fasteners').geometry;
    assert.equal(fasteners.index.count / 3, 20, 'hexagonal caps need four triangles per face, preserving both wall orientations');
    const normal = fasteners.attributes.normal;
    for (const sign of [-1, 1]) {
      let faceTriangles = 0;
      for (let index = 0; index < fasteners.index.count; index += 3) {
        if ([0, 1, 2].every(vertex => normal.getY(fasteners.index.getX(index + vertex)) * sign > 0.99)) faceTriangles++;
      }
      assert.equal(faceTriangles, 4, 'the exposed bottom face on negative wall mounts was removed');
    }
  } finally { detail.dispose(); hub.dispose(); }
});

test('disposing interior detail releases its atlas and geometry once without freeing session-shared PBR maps', () => {
  const hub = new MothershipHub(new THREE.Scene()), detail = attachShipInteriorDetail(hub);
  const geometry = detail.group.getObjectByName('ship-room-vault-shells').geometry;
  const shared = detail.group.getObjectByName('ship-room-vault-shells').material.normalMap;
  let textureDisposals = 0, geometryDisposals = 0, sharedDisposals = 0;
  detail.atlas.texture.addEventListener('dispose', () => textureDisposals++);
  geometry.addEventListener('dispose', () => geometryDisposals++);
  shared.addEventListener('dispose', () => sharedDisposals++);
  detail.dispose(); detail.dispose(); hub.dispose();
  assert.equal(textureDisposals, 1); assert.equal(geometryDisposals, 1); assert.equal(sharedDisposals, 0);
  assert.equal(detail.updateTerminalContext({ honorScore: 9999 }), false);
});

test('all twenty-five station orientation metadata and the ten live displays agree with the real transformed reader faces', () => {
  const hub = new MothershipHub(new THREE.Scene()), detail = attachShipInteriorDetail(hub);
  try {
    hub.group.updateMatrixWorld(true);
    assert.equal(hub.getStations().length, 25);
    for (const station of hub.getStations()) {
      const physical = physicalConsoleNormal(hub, station);
      const declared = new THREE.Vector3(0, 0, 1).applyEuler(new THREE.Euler(station.consolePitch, station.consoleYaw, 0, 'YXZ'));
      assert.ok(declared.dot(physical) > 0.9999, `${station.id}: pitch/yaw ignore the real parent matrix or nonuniform scale`);
    }
    for (const [index, placement] of detail.screenPlacements.entries()) {
      if (!placement.stationId) continue;
      const physical = physicalConsoleNormal(hub, hub.getStation(placement.stationId));
      assertScreenNormal(hub, detail, index, physical, placement.stationId);
    }
  } finally { hub.dispose(); }
});

test('inclined displays and bezels retain upward-facing normals through north, south, east and west headings', () => {
  const hub = new MothershipHub(new THREE.Scene());
  const originalStations = hub.getStations.bind(hub), station = hub.getStation('armory-forge');
  const console = hub.group.getObjectByName(station.consoleId);
  try {
    for (const [label, yaw] of [['north', 0], ['south', Math.PI], ['east', Math.PI / 2], ['west', -Math.PI / 2]]) {
      hub.shipInteriorDetail.dispose(); console.rotation.y = yaw; hub.group.updateMatrixWorld(true);
      hub.getStations = () => originalStations().map(entry => entry.id === station.id ? { ...entry, consoleYaw: yaw } : entry);
      const detail = attachShipInteriorDetail(hub); hub.group.updateMatrixWorld(true);
      const index = detail.screenPlacements.findIndex(placement => placement.stationId === station.id);
      assertScreenNormal(hub, detail, index, physicalConsoleNormal(hub, station), label);
    }
  } finally { hub.getStations = originalStations; hub.dispose(); }
});
