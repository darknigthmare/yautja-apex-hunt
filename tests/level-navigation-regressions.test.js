import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { MothershipHub } from '../src/world/MothershipHub.js';
import { BIOME_HUNT_LAYOUTS, getBiomeHuntLayout } from '../src/data/BiomeHuntLayout.js';
import { buildHuntRouteNetwork, sampleHuntSectorElevation } from '../src/world/HuntRouteBuilder.js';

function overlaps(position, collider, radius = 1.8) {
  if (collider.type === 'box') return Math.abs(position.x - collider.x) < collider.halfWidth + radius - 0.00001
    && Math.abs(position.z - collider.z) < collider.halfDepth + radius - 0.00001;
  return Math.hypot(position.x - collider.x, position.z - collider.z) < collider.radius + radius - 0.00001;
}

function dispose(root) {
  const geometries = new Set();
  const materials = new Set();
  root.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    if (object.material) materials.add(object.material);
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
}

test('les cloisons contre la coque et les pods rapprochés ne piègent plus le joueur', () => {
  const hub = new MothershipHub(new THREE.Scene());
  const colliders = hub.getColliders();
  for (const [x, z] of [[-66, -52], [-65, 40], [66, -52], [65, 40], [-59, -33], [-59, -32], [-42, -26], [0, 85]]) {
    const position = new THREE.Vector3(x, 0, z);
    hub.constrainPlayer(position, 1.8);
    assert.ok(!colliders.some((collider) => overlaps(position, collider)), `sortie encore obstruée depuis ${x}, ${z}`);
    const settled = position.clone();
    hub.constrainPlayer(position, 1.8);
    assert.ok(position.distanceTo(settled) < 0.001, 'le solveur doit se stabiliser sans oscillation');
  }
  // Balayage spatial des coins, jonctions et meubles : vérifier une vraie
  // propriété de navigation plutôt que la seule forme de la liste de colliders.
  const bounds = hub.getBounds();
  for (let x = -66; x <= 66; x += 3) {
    for (let z = -86; z <= 86; z += 3) {
      const position = new THREE.Vector3(x, 0, z);
      hub.constrainPlayer(position, 1.8);
      assert.ok(position.x >= bounds.minX + 1.8 && position.x <= bounds.maxX - 1.8);
      assert.ok(position.z >= bounds.minZ + 1.8 && position.z <= bounds.maxZ - 1.8);
      assert.ok(!colliders.some((collider) => overlaps(position, collider)), `collision non résolue depuis ${x}, ${z}`);
    }
  }
  hub.dispose();
});

test('les deux rives des routes épousent les pentes dans les neuf biomes', () => {
  const baseHeight = (x, z) => x * 0.11 + z * 0.07;
  for (const biomeId of Object.keys(BIOME_HUNT_LAYOUTS)) {
    const layout = getBiomeHuntLayout(biomeId);
    const root = buildHuntRouteNetwork(layout, baseHeight);
    for (const route of root.children.filter(({ userData }) => userData.huntRoute)) {
      const positions = route.geometry.getAttribute('position');
      for (let index = 0; index < positions.count; index += 1) {
        const x = positions.getX(index);
        const z = positions.getZ(index);
        const expectedY = baseHeight(x, z) + sampleHuntSectorElevation(layout, x, z) + 0.11;
        assert.ok(Math.abs(positions.getY(index) - expectedY) < 0.00005, `${biomeId} ${route.name}: rive enfouie ou flottante`);
      }
    }
    dispose(root);
  }
});

test('le couvert urbain reste ancré au terrain et ses perchoirs suivent son sommet réel', () => {
  const matrix = new THREE.Matrix4();
  const bounds = new THREE.Box3();
  for (const biomeId of ['stargazer_blacksite', 'los_angeles_1997', 'gunnison_outbreak']) {
    const layout = getBiomeHuntLayout(biomeId);
    const root = buildHuntRouteNetwork(layout, () => 2);
    const cover = root.getObjectByName('hunt-outer-sector-cover');
    assert.equal(cover.geometry.type, 'BoxGeometry', `${biomeId}: ne doit pas recevoir les arbres de jungle`);
    cover.geometry.computeBoundingBox();
    const perches = root.userData.huntPerches;
    for (let index = 0; index < cover.count; index += 1) {
      cover.getMatrixAt(index, matrix);
      bounds.copy(cover.geometry.boundingBox).applyMatrix4(matrix);
      const center = new THREE.Vector3().setFromMatrixPosition(matrix);
      const ground = 2 + sampleHuntSectorElevation(layout, center.x, center.z);
      assert.ok(Math.abs(bounds.min.y - ground) < 0.00001, `${biomeId}: couvert flottant`);
      assert.ok(perches[index].y > bounds.max.y && perches[index].y < bounds.max.y + 1.2, `${biomeId}: perchoir déconnecté du décor`);
    }
    dispose(root);
  }
});

test('le couvert conserve les routes, le départ et les signaux de chasse dégagés dans les neuf cartes', () => {
  const matrix = new THREE.Matrix4();
  const center = new THREE.Vector3();
  const vertex = new THREE.Vector3();
  for (const biomeId of Object.keys(BIOME_HUNT_LAYOUTS)) {
    const layout = getBiomeHuntLayout(biomeId);
    const root = buildHuntRouteNetwork(layout);
    const cover = root.getObjectByName('hunt-outer-sector-cover');
    const sections = [];
    for (const mesh of root.children.filter(({ userData }) => userData.huntRoute)) {
      const positions = mesh.geometry.getAttribute('position');
      const definition = layout.routes.find(({ id }) => id === mesh.userData.routeId);
      for (let index = 0; index < positions.count - 2; index += 2) {
        sections.push({
          ax: (positions.getX(index) + positions.getX(index + 1)) * 0.5,
          az: (positions.getZ(index) + positions.getZ(index + 1)) * 0.5,
          bx: (positions.getX(index + 2) + positions.getX(index + 3)) * 0.5,
          bz: (positions.getZ(index + 2) + positions.getZ(index + 3)) * 0.5,
          halfWidth: definition.width * 0.5,
        });
      }
    }
    const vertices = cover.geometry.getAttribute('position');
    for (let index = 0; index < cover.count; index += 1) {
      cover.getMatrixAt(index, matrix);
      center.setFromMatrixPosition(matrix);
      let footprint = 0;
      for (let vertexIndex = 0; vertexIndex < vertices.count; vertexIndex += 1) {
        vertex.fromBufferAttribute(vertices, vertexIndex).applyMatrix4(matrix);
        footprint = Math.max(footprint, Math.hypot(vertex.x - center.x, vertex.z - center.z));
      }
      for (const section of sections) {
        const dx = section.bx - section.ax;
        const dz = section.bz - section.az;
        const progress = Math.max(0, Math.min(1, ((center.x - section.ax) * dx + (center.z - section.az) * dz) / (dx * dx + dz * dz)));
        const clearance = Math.hypot(center.x - section.ax - dx * progress, center.z - section.az - dz * progress);
        assert.ok(clearance >= footprint + section.halfWidth + 1.8 - 0.0001, `${biomeId}: silhouette en travers d'une voie`);
      }
      assert.ok(Math.hypot(center.x - layout.startCamp[0], center.z - layout.startCamp[2]) >= footprint + 20 - 0.0001);
      for (const signal of layout.eventNodes.filter(({ eventType }) => ['cache_drop', 'boss_trail'].includes(eventType))) {
        assert.ok(Math.hypot(center.x - signal.position[0], center.z - signal.position[2]) >= footprint + 8 - 0.0001, `${biomeId}: signal enfoui dans un couvert`);
      }
    }
    assert.equal(root.userData.huntLayoutMetrics.physicalCoverSectorCount, layout.sectors.length, 'la navigation ne doit pas supprimer le couvert d’un secteur');
    dispose(root);
  }
});

test('la caméra du hub rencontre les volumes réels et laisse les portes ouvertes', () => {
  const hub = new MothershipHub(new THREE.Scene());
  const anchor = new THREE.Vector3(-30, 3, -48);
  const desired = new THREE.Vector3(-30, 3, -56);
  const desiredBefore = desired.clone();
  const wall = hub.resolveCameraObstruction(anchor, desired, 0.4);
  assert.ok(wall && wall.z > -51.4 && wall.z < -50.9, 'caméra maintenue avant la cloison de 1,2 m');
  assert.deepEqual(desired.toArray(), desiredBefore.toArray(), 'ne pas modifier la caméra demandée');
  assert.equal(hub.resolveCameraObstruction(new THREE.Vector3(0, 3, -48), new THREE.Vector3(0, 3, -56)), null, 'la porte est une ouverture réelle');
  assert.equal(hub.resolveCameraObstruction(new THREE.Vector3(0, 3, 0), new THREE.Vector3(0, 4, 5)), null, 'le sol sous la caméra ne doit pas bloquer le bras');
  const hull = hub.resolveCameraObstruction(new THREE.Vector3(64, 3, 75), new THREE.Vector3(72, 3, 75));
  assert.ok(hull && hull.x < 69 && hull.x > 68, 'caméra conservée dans la coque');
  const reactor = hub.resolveCameraObstruction(new THREE.Vector3(43, 8, 48), new THREE.Vector3(43, 8, 70));
  assert.ok(reactor && reactor.z < 54 && reactor.z > 50, 'réacteur opaque rencontré à la vraie hauteur');
  const cache = hub.cameraOcclusion;
  assert.ok(cache.entries.length > 0);
  hub.resolveCameraObstruction(anchor, desired);
  assert.equal(hub.cameraOcclusion, cache, 'réutiliser le cache entre deux frames');
  hub.dispose();
  assert.equal(hub.cameraOcclusion, null);
  assert.equal(hub.resolveCameraObstruction(anchor, desired), null);
});
