import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { MothershipHub } from '../src/world/MothershipHub.js';
import { createHubInstrumentTexture, createHubPanelGeometry } from '../src/utils/hubSurfaceDetail.js';

test('beveled panels keep their external dimensions and provide edge normals', () => {
  const geometry = createHubPanelGeometry(5.3, 0.08, 5.3, 0.035);
  geometry.computeBoundingBox();
  const size = geometry.boundingBox.getSize(new THREE.Vector3());
  assert.ok(Math.abs(size.x - 5.3) < 1e-5);
  assert.ok(Math.abs(size.y - 0.08) < 1e-5);
  assert.ok(Math.abs(size.z - 5.3) < 1e-5);
  const normal = geometry.getAttribute('normal');
  let edgeNormal = false;
  for (let index = 0; index < normal.count; index += 1) {
    if (Math.abs(normal.getX(index)) > 0.1 && Math.abs(normal.getY(index)) > 0.1) edgeNormal = true;
  }
  assert.equal(edgeNormal, true);
  geometry.dispose();
});

test('instrument graphics are deterministic opaque data with readable luminance variation', () => {
  const first = createHubInstrumentTexture();
  const second = createHubInstrumentTexture();
  assert.deepEqual(first.image.data, second.image.data);
  let brightest = 0;
  let darkest = 255;
  for (let offset = 0; offset < first.image.data.length; offset += 4) {
    brightest = Math.max(brightest, first.image.data[offset]);
    darkest = Math.min(darkest, first.image.data[offset]);
    assert.equal(first.image.data[offset + 3], 255);
  }
  assert.ok(brightest - darkest > 180);
  assert.equal(first.generateMipmaps, true);
  first.dispose(); second.dispose();
});

test('ship microgeometry stays batched and does not expand solid camera occlusion', () => {
  const hub = new MothershipHub(new THREE.Scene());
  try {
    const metrics = hub.getPerformanceSnapshot();
    assert.ok(metrics.drawCallEstimate <= 300);
    assert.ok(metrics.triangleEstimate <= 500_000);
    const bolts = hub.group.getObjectByName('ship-captive-fasteners');
    assert.ok(bolts.isInstancedMesh && bolts.count > 3000);
    const detailGeometry = new Set(hub.group.getObjectByName('ship-surface-engineering').children.map((object) => object.geometry));
    hub.resolveCameraObstruction(new THREE.Vector3(0, 4, 15), new THREE.Vector3(0, 10, 28));
    assert.ok(hub.cameraOcclusion.entries.length > 0);
    assert.ok(hub.cameraOcclusion.entries.every(({ geometry }) => !detailGeometry.has(geometry)));
    const pointLights = [];
    hub.group.traverse((object) => { if (object.isPointLight) pointLights.push(object); });
    assert.ok(pointLights.length <= 7);
    assert.ok(pointLights.every((light) => !light.castShadow));
    assert.equal(hub.getStations().length, 10);
    assert.equal(hub.getColliders().length, 87);
  } finally { hub.dispose(); }
});

test('disposing one ship preserves session-shared PBR maps and frees its display texture', () => {
  const first = new MothershipHub(new THREE.Scene());
  const second = new MothershipHub(new THREE.Scene());
  const normalMap = first.createAlloyMaterial(0x202a32).normalMap;
  assert.equal(normalMap, second.createAlloyMaterial(0x202a32).normalMap);
  let sharedDisposals = 0;
  let displayDisposals = 0;
  normalMap.addEventListener('dispose', () => { sharedDisposals += 1; });
  first.instrumentTexture.addEventListener('dispose', () => { displayDisposals += 1; });
  first.dispose(); first.dispose();
  assert.equal(sharedDisposals, 0);
  assert.equal(displayDisposals, 1);
  assert.ok(second.createAlloyMaterial(0x202a32).normalMap.image.data.length > 0);
  second.dispose();
  assert.equal(sharedDisposals, 0);
});
