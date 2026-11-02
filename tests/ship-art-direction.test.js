import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { MothershipHub } from '../src/world/MothershipHub.js';

test('contract projections use muted amber and only the selected console changes to cyan', () => {
  const hub = new MothershipHub(new THREE.Scene());
  try {
    const contracts = hub.getStations().filter(station => station.huntId);
    const first = contracts[0], formerlyShared = contracts[9];
    const projection = hub.group.getObjectByName(`hologram-${first.huntId}`);
    const ring = hub.group.getObjectByName(`mission-rings-${first.huntId}`);
    const otherRing = hub.group.getObjectByName(`mission-rings-${formerlyShared.huntId}`);
    assert.equal(projection.material.color.getHex(), 0xc49a62);
    assert.equal(projection.material.opacity, 0.32);
    assert.equal(ring.material.opacity, 0.36);
    assert.notEqual(ring.material, otherRing.material, 'shared old rainbow material leaks selection into another contract');
    hub.setTerminalContext({ stationId: first.id });
    assert.equal(projection.material.color.getHex(), 0x68a8aa);
    assert.equal(ring.material.color.getHex(), 0x68a8aa);
    assert.equal(otherRing.material.color.getHex(), 0xc49a62);
    hub.setTerminalContext({ stationId: '' });
    assert.equal(projection.material.color.getHex(), 0xc49a62);
  } finally { hub.dispose(); }
});

test('three compartment deck finishes retain all 768 panels with calmer texture scale and shadow reception', () => {
  const hub = new MothershipHub(new THREE.Scene());
  try {
    const floors = ['segmented-deck-plates', 'ship-deck-finish-1', 'ship-deck-finish-2'].map(name => hub.group.getObjectByName(name));
    assert.equal(floors.reduce((count, mesh) => count + mesh.count, 0), 768);
    assert.deepEqual(floors.map(mesh => mesh.material.roughness), [0.64, 0.46, 0.74]);
    for (const floor of floors) {
      assert.equal(floor.receiveShadow, true); assert.equal(floor.castShadow, false);
      assert.equal(floor.material.envMapIntensity, 0.3);
      const uv = floor.geometry.attributes.uv;
      for (let index = 0; index < uv.count; index++) assert.ok(uv.getX(index) <= 0.334 && uv.getY(index) <= 0.334);
    }
    assert.equal(hub.shipInteriorDetail.metrics.deckFinishPanelCounts.reduce((sum, count) => sum + count, 0), 768);
  } finally { hub.dispose(); }
});

test('one bounded shadow spotlight lights the nexus while hull, ghosts and all seven points remain non-casting', () => {
  const hub = new MothershipHub(new THREE.Scene());
  try {
    const spots = [], points = []; hub.group.traverse(node => { if (node.isSpotLight) spots.push(node); if (node.isPointLight) points.push(node); });
    assert.equal(spots.length, 1); assert.equal(points.length, 7);
    assert.ok(points.every(point => !point.castShadow));
    const key = spots[0]; assert.equal(key.castShadow, true);
    assert.deepEqual(key.shadow.mapSize.toArray(), [1024, 1024]);
    assert.equal(key.shadow.camera.near, 2); assert.equal(key.distance, 65);
    assert.equal(hub.group.getObjectByName('pressurized-hull').castShadow, false);
    hub.group.traverse(node => {
      if (!node.isMesh || !node.castShadow) return;
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      assert.ok(materials.every(material => material.isMeshStandardMaterial && material.opacity >= 0.98 && !material.wireframe));
    });
    assert.ok(hub.shipInteriorDetail.shadow.casterCandidates > 20);
    assert.equal(hub.shipInteriorDetail.shadow.measuredGpuDraws, null, 'model draw estimates are not a shadow-pass measurement');
    assert.equal(hub.group.getObjectByName('hub-readability-ambient-light').intensity, 0.42);
    assert.equal(hub.group.getObjectByName('hub-ambient-fill-light').intensity, 0.72);
    const trophy = hub.trophyDisplays.get('goliath');
    hub.setTrophyState(['goliath']); hub.setTerminalContext({ honorScore: 1200 });
    assert.equal(trophy.castShadow, true, 'an acquired opaque study can cast a shadow');
    hub.setTrophyState([]); hub.setTerminalContext({ honorScore: 0 });
    assert.equal(trophy.castShadow, false, 'a restored archive ghost must not keep an opaque shadow');
  } finally { hub.dispose(); }
});

test('performance mode frees retained shadow targets, and later hub disposal frees reallocated maps exactly once', () => {
  const hub = new MothershipHub(new THREE.Scene()), detail = hub.shipInteriorDetail;
  const key = hub.group.getObjectByName('ship-nexus-shadow-key');
  let mapDisposals = 0, passDisposals = 0;
  const allocate = () => { key.shadow.map = { dispose() { mapDisposals++; } }; key.shadow.mapPass = { dispose() { passDisposals++; } }; };
  allocate();
  assert.equal(hub.setShadowQuality('performance'), false); assert.equal(key.castShadow, false);
  assert.equal(detail.shadow.maximumShadowPasses, 0);
  assert.equal(mapDisposals, 1); assert.equal(passDisposals, 1);
  hub.setShadowQuality('performance'); assert.equal(mapDisposals, 1);
  assert.equal(hub.setShadowQuality('high'), true); assert.equal(key.castShadow, true);
  assert.equal(detail.shadow.maximumShadowPasses, 1); allocate();
  hub.dispose(); hub.dispose();
  assert.equal(mapDisposals, 2); assert.equal(passDisposals, 2);
  assert.equal(key.parent, null); assert.equal(key.target.parent, null);
  assert.equal(detail.setShadowQuality('high'), false);
});

test('low-cost static contact approximations remain separate from the real shadow map and own their texture', () => {
  const hub = new MothershipHub(new THREE.Scene());
  const contacts = hub.group.getObjectByName('ship-static-ambient-contact-decals');
  assert.equal(contacts.userData.contactApproximation, true);
  assert.ok(contacts.count > 30); assert.equal(contacts.castShadow, false);
  assert.equal(contacts.geometry.index.count / 3, 2);
  assert.deepEqual([contacts.material.alphaMap.image.width, contacts.material.alphaMap.image.height], [64, 64]);
  assert.equal(hub.shipInteriorDetail.shadow.contactDecalsAreApproximate, true);
  let releases = 0; contacts.material.alphaMap.addEventListener('dispose', () => releases++);
  hub.dispose(); hub.dispose(); assert.equal(releases, 1);
});

test('each cloned contract-ring material has one hub owner and is released exactly once', () => {
  const hub = new MothershipHub(new THREE.Scene());
  const disposals = new Map();
  hub.group.traverse(node => {
    if (!node.name.startsWith('mission-rings-')) return;
    const material = node.material;
    assert.equal(disposals.has(material), false, 'contract selection needs an independently owned ring material');
    disposals.set(material, 0);
    material.addEventListener('dispose', () => disposals.set(material, disposals.get(material) + 1));
  });
  assert.equal(disposals.size, 15);
  hub.dispose(); hub.dispose();
  assert.ok([...disposals.values()].every(count => count === 1), 'detail and hub must not both release an external ring');
});
