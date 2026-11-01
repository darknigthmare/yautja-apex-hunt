import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { applySimulationReferenceScale, resolveSimulationSelection } from '../src/gameplay/SimulationHuntRuntime.js';
import { CANON_PREY_CATALOG } from '../src/data/PreyTaxonomyAndCrossoverCatalog.js';
import { getVisualBounds } from '../src/utils/worldScale.js';

test('simulation dossiers resolve valid hunts and biome ids without accepting unknown targets', () => {
  const queenEntry = CANON_PREY_CATALOG.find(entry => entry.id.includes('queen'));
  assert.ok(queenEntry);
  const queen = resolveSimulationSelection({ kind: 'prey', id: queenEntry.id });
  // Unknown/changed archive IDs must not silently launch a generic normal hunt.
  assert.equal(resolveSimulationSelection({ kind: 'prey', id: 'missing' }), null);
  assert.equal(resolveSimulationSelection({ kind: 'unexpected', id: 'prey_xeno_queen' }), null);
  assert.ok(queen);
  assert.equal(queen.planetType, 'hive_lv426');
  for (const entry of CANON_PREY_CATALOG) assert.ok(resolveSimulationSelection({ kind: 'prey', id: entry.id }));
});

test('reference scaling follows metres, grounds the proxy and scales its collider', () => {
  for (const metres of [0.2, 1.8, 12, 200]) {
    const mesh = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshBasicMaterial());
    body.position.y = 0.5; // Deliberately starts half buried.
    mesh.add(body); mesh.position.set(12, 4, -8);
    const boss = { mesh, position: mesh.position.clone(), colliderRadius: 0.6 };
    const result = applySimulationReferenceScale(boss, { id: 'test-dossier', sizeMeters: metres, sizeDimension: 'height' });
    const bounds = getVisualBounds(mesh);
    assert.ok(Math.abs(bounds.getSize(new THREE.Vector3()).y - metres * 3) < 1e-6);
    assert.ok(Math.abs(bounds.min.y - boss.position.y) < 1e-6);
    assert.ok(Math.abs(boss.colliderRadius - 0.6 * result.factor) < 1e-6);
    assert.equal(result.fidelityVerified, false, 'correct dimensions do not prove model fidelity');
    mesh.position.set(-30, 0, 55); mesh.updateMatrixWorld(true);
    assert.ok(Math.abs(getVisualBounds(mesh).min.y) < 1e-6, 'ground offset survives movement');
    body.geometry.dispose(); body.material.dispose();
  }
});

test('resized proxy impacts use a finite segment and the visible surface', () => {
  const mesh = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
  body.position.y = 1; mesh.add(body);
  const boss = { mesh, colliderRadius: 1 };
  applySimulationReferenceScale(boss, { id: 'test', sizeMeters: 2, sizeDimension: 'height' });
  assert.equal(boss.resolveProjectileImpact(new THREE.Vector3(0, 3, 19), 0.1, new THREE.Vector3(0, 3, 20)), null);
  const hit = boss.resolveProjectileImpact(new THREE.Vector3(0, 3, -5), 0.1, new THREE.Vector3(0, 3, 5));
  assert.ok(hit?.isVector3);
  assert.ok(Math.abs(hit.z - 3) < 1e-6);
  body.geometry.dispose(); body.material.dispose();
});
