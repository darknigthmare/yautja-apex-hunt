import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { getNearbyShipDisplay } from '../src/world/ShipEquipmentDisplays.js';
import { MothershipHub } from '../src/world/MothershipHub.js';

function fixture() {
  const hub = { group: new THREE.Group(), shipEquipmentDisplays: { entries: [] }, disposed: false };
  const add = (id, object) => {
    hub.group.add(object);
    const entry = { id, itemId: id, object };
    hub.shipEquipmentDisplays.entries.push(entry); return entry;
  };
  const dispose = () => {
    const geometries = new Set(), materials = new Set();
    hub.group.traverse(node => { if (node.geometry) geometries.add(node.geometry); if (node.material) materials.add(node.material); });
    geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
  };
  return { hub, add, dispose };
}

test('inspection measures the actual model surface from bio-mask height, independently of a distant root', () => {
  const { hub, add, dispose } = fixture();
  try {
    const root = new THREE.Group(); root.position.x = 50;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
    mesh.position.set(-48, 4.8, 0); root.add(mesh); add('display', root);
    const result = getNearbyShipDisplay(hub, new THREE.Vector3(), { maxDistance: 2 });
    assert.equal(result.entry.id, 'display');
    assert.ok(Math.abs(result.distanceUs - 1) < 0.000001);
    assert.ok(result.point.distanceTo(new THREE.Vector3(1, 4.8, 0)) < 0.000001);
    assert.equal(result.distanceUnits, result.distanceUs);
    assert.ok(result.gaze.distanceTo(new THREE.Vector3(0, 4.8, 0)) < 0.000001);
    assert.equal(getNearbyShipDisplay(hub, new THREE.Vector3(), { maxDistance: 0.9 }), null);
  } finally { dispose(); }
});

test('a point inside a model bounding box still resolves a real triangle, not an empty box center', () => {
  const { hub, add, dispose } = fixture();
  try {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
    mesh.position.y = 4.8; add('display', mesh);
    assert.equal(getNearbyShipDisplay(hub, new THREE.Vector3(), { maxDistance: 0.5 }), null);
    const result = getNearbyShipDisplay(hub, new THREE.Vector3(), { maxDistance: 1.1 });
    assert.ok(Math.abs(result.distanceUs - 1) < 0.000001);
    const delta = result.point.clone().sub(mesh.position);
    assert.ok(Math.abs(Math.max(Math.abs(delta.x), Math.abs(delta.y), Math.abs(delta.z)) - 1) < 0.000001);
  } finally { dispose(); }
});

test('hidden children/ancestors, detached models and a hidden or disposed ship are never inspectable', () => {
  const { hub, add, dispose } = fixture();
  try {
    const root = new THREE.Group(), mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
    mesh.position.set(0, 4.8, 2); root.add(mesh); add('display', root);
    const position = new THREE.Vector3();
    assert.ok(getNearbyShipDisplay(hub, position));
    mesh.visible = false; assert.equal(getNearbyShipDisplay(hub, position), null);
    mesh.visible = true; root.visible = false; assert.equal(getNearbyShipDisplay(hub, position), null);
    root.visible = true; hub.group.visible = false; assert.equal(getNearbyShipDisplay(hub, position), null);
    hub.group.visible = true; const scene = new THREE.Scene(); scene.add(hub.group); scene.visible = false;
    assert.equal(getNearbyShipDisplay(hub, position), null); scene.visible = true;
    root.removeFromParent(); assert.equal(getNearbyShipDisplay(hub, position), null); hub.group.add(root);
    hub.disposed = true; assert.equal(getNearbyShipDisplay(hub, position), null);
  } finally { dispose(); }
});

test('cached surfaces follow rotations, changing scales and geometry attribute updates', () => {
  const { hub, add, dispose } = fixture();
  try {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
    mesh.position.set(0, 4.8, 4); add('display', mesh);
    const position = new THREE.Vector3();
    assert.ok(Math.abs(getNearbyShipDisplay(hub, position).distanceUs - 3) < 0.000001);
    mesh.scale.set(2, 2, 2);
    assert.ok(Math.abs(getNearbyShipDisplay(hub, position).distanceUs - 2) < 0.000001);
    mesh.geometry.scale(1, 1, 0.5);
    assert.ok(Math.abs(getNearbyShipDisplay(hub, position).distanceUs - 3) < 0.000001);
    mesh.rotation.y = Math.PI / 2;
    assert.ok(Math.abs(getNearbyShipDisplay(hub, position).distanceUs - 2) < 0.000001);
  } finally { dispose(); }
});

test('actual instance transforms determine proximity and cache updates rather than the prototype at the origin', () => {
  const { hub, add, dispose } = fixture();
  try {
    const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial(), 2);
    mesh.setMatrixAt(0, new THREE.Matrix4().makeTranslation(10, 4.8, 0));
    mesh.setMatrixAt(1, new THREE.Matrix4().makeTranslation(3, 4.8, 0)); mesh.instanceMatrix.needsUpdate = true;
    add('display', mesh);
    assert.ok(Math.abs(getNearbyShipDisplay(hub, new THREE.Vector3()).distanceUs - 2.5) < 0.000001);
    mesh.rotation.y = Math.PI / 2;
    const rotated = getNearbyShipDisplay(hub, new THREE.Vector3());
    assert.ok(rotated.point.distanceTo(new THREE.Vector3(0, 4.8, -2.5)) < 0.000001);
    mesh.setMatrixAt(1, new THREE.Matrix4().makeTranslation(20, 4.8, 0)); mesh.instanceMatrix.needsUpdate = true;
    assert.equal(getNearbyShipDisplay(hub, new THREE.Vector3()), null);
  } finally { dispose(); }
});

test('LOS is optional, can filter entries and does not reject the target surface as its own obstruction', () => {
  const { hub, add, dispose } = fixture();
  try {
    for (const [id, x] of [['near', 2], ['far', 4]]) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()); mesh.position.set(x, 4.8, 0); add(id, mesh);
    }
    const position = new THREE.Vector3();
    assert.equal(getNearbyShipDisplay(hub, position).entry.id, 'near');
    assert.equal(getNearbyShipDisplay(hub, position, { lineOfSight: ({ entry }) => entry.id !== 'near' }).entry.id, 'far');
    let padding;
    hub.resolveCameraObstruction = (origin, point, providedPadding) => { padding = providedPadding; return point.clone().lerp(origin, 0.0001); };
    assert.equal(getNearbyShipDisplay(hub, position, { lineOfSight: true }).entry.id, 'near');
    assert.equal(padding, 0);
    hub.resolveCameraObstruction = (origin, point) => point.clone().lerp(origin, 0.5);
    assert.equal(getNearbyShipDisplay(hub, position, { lineOfSight: true }), null);
  } finally { dispose(); }
});

test('the real armory returns its displayed equipment and releases inspection access with its resource owner', () => {
  const hub = new MothershipHub(new THREE.Scene());
  const before = hub.trophyDisplays.get('wolf_cleaner').userData.unlocked;
  const result = getNearbyShipDisplay(hub, new THREE.Vector3(54, 0, 4.1), { lineOfSight: true });
  assert.equal(result.entry.itemId, 'combi_stick');
  assert.ok(result.distanceUs > 3 && result.distanceUs < 4);
  assert.equal(hub.trophyDisplays.get('wolf_cleaner').userData.unlocked, before, 'inspecting must not award a trophy');
  hub.dispose();
  assert.equal(getNearbyShipDisplay(hub, new THREE.Vector3(54, 0, 4.1)), null);
  assert.equal(hub.shipEquipmentDisplays.entries.length, 0);
});
