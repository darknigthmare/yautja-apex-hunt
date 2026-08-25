import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  BIOME_HUNT_LAYOUTS,
  getBiomeHuntLayout,
  getBiomeHuntMetrics,
} from '../src/data/BiomeHuntLayout.js';
import { buildHuntRouteNetwork } from '../src/world/HuntRouteBuilder.js';

const EXPECTED_BIOMES = [
  'jungle',
  'hive_lv426',
  'ryushi_desert',
  'yautja_prime',
  'genna_deathworld',
  'stargazer_blacksite',
  'los_angeles_1997',
  'bouvetoya_pyramid',
];

function horizontalDistance(point) {
  return Math.hypot(Number(point?.[0]) || 0, Number(point?.[2]) || 0);
}

function assertPointInside(point, radius, label) {
  assert.ok(Array.isArray(point) && point.length >= 3, `${label}: point invalide`);
  assert.ok(point.slice(0, 3).every(Number.isFinite), `${label}: coordonnées non finies`);
  assert.ok(horizontalDistance(point) <= radius, `${label}: hors de la limite jouable`);
}

function inspectGraph(layout) {
  const sectorIds = new Set(layout.sectors.map(({ id }) => id));
  const adjacency = new Map([...sectorIds].map((id) => [id, new Set()]));
  for (const route of layout.routes) {
    assert.ok(sectorIds.has(route.from), `${layout.biomeId}: origine ${route.from} inconnue`);
    assert.ok(sectorIds.has(route.to), `${layout.biomeId}: destination ${route.to} inconnue`);
    assert.notEqual(route.from, route.to, `${layout.biomeId}: boucle réflexive`);
    adjacency.get(route.from).add(route.to);
    adjacency.get(route.to).add(route.from);
  }

  const visited = new Set();
  let hasCycle = false;
  const visit = (sectorId, parentId = null) => {
    visited.add(sectorId);
    for (const neighborId of adjacency.get(sectorId)) {
      if (!visited.has(neighborId)) visit(neighborId, sectorId);
      else if (neighborId !== parentId) hasCycle = true;
    }
  };
  visit(layout.sectors[0].id);
  return { connected: visited.size === layout.sectors.length, hasCycle };
}

function disposeRoot(root) {
  const geometries = new Set();
  const materials = new Set();
  root.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
    objectMaterials.filter(Boolean).forEach((material) => materials.add(material));
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
  root.clear();
}

test('les huit terrains respectent le contrat de chasse ouverte inspiré de MHW', () => {
  assert.deepEqual(Object.keys(BIOME_HUNT_LAYOUTS), EXPECTED_BIOMES);

  for (const biomeId of EXPECTED_BIOMES) {
    const layout = getBiomeHuntLayout(biomeId);
    const metrics = getBiomeHuntMetrics(biomeId);
    assert.equal(layout.biomeId, biomeId);
    assert.ok(layout.playableRadius >= 630, `${biomeId}: rayon trop court`);
    assert.ok(getBiomeHuntMetrics(biomeId, 29).directDiameterSprintSeconds >= 43, `${biomeId}: trop court pour le Scout`);
    assert.ok(layout.terrainSize > layout.playableRadius * 2, `${biomeId}: terrain sans marge extérieure`);
    assert.ok(layout.sectors.length >= 9, `${biomeId}: secteurs`);
    assert.ok(layout.routes.length >= 12, `${biomeId}: routes insuffisantes`);
    assert.equal(new Set(layout.sectors.map(({ id }) => id)).size, layout.sectors.length, `${biomeId}: secteurs dupliqués`);
    assert.equal(new Set(layout.routes.map(({ id }) => id)).size, layout.routes.length, `${biomeId}: routes dupliquées`);

    const graph = inspectGraph(layout);
    assert.equal(graph.connected, true, `${biomeId}: graphe déconnecté`);
    assert.equal(graph.hasCycle, true, `${biomeId}: aucune boucle de chasse`);
    assert.ok(layout.routes.length >= layout.sectors.length, `${biomeId}: budget cyclique insuffisant`);

    const ecologyTotal = layout.ecology.reduce((total, territory) => total + territory.count, 0);
    assert.ok(ecologyTotal >= 12 && ecologyTotal <= 24, `${biomeId}: écologie ${ecologyTotal}`);
    assert.ok(layout.eventNodes.length >= 6, `${biomeId}: nœuds événementiels`);
    assert.ok(layout.bossRoute.length >= 5, `${biomeId}: migration du boss`);
    assert.ok(metrics.directDiameterSprintSeconds >= 43, `${biomeId}: traversée trop courte`);
    assert.equal(metrics.ecologyCount, ecologyTotal);
    assert.equal(metrics.eventNodeCount, layout.eventNodes.length);
    assert.equal(metrics.bossRouteNodeCount, layout.bossRoute.length);

    const eventXs = layout.eventNodes.map(({ position }) => position[0]);
    const eventZs = layout.eventNodes.map(({ position }) => position[2]);
    assert.ok(Math.max(...eventXs) - Math.min(...eventXs) >= layout.playableRadius * 0.75, `${biomeId}: événements tassés en X`);
    assert.ok(Math.max(...eventZs) - Math.min(...eventZs) >= layout.playableRadius * 0.75, `${biomeId}: événements tassés en Z`);
    assert.equal(new Set(layout.eventNodes.map(({ position }) => position.join(':'))).size, layout.eventNodes.length, `${biomeId}: événements superposés`);

    assertPointInside(layout.startCamp, layout.playableRadius, `${biomeId}: camp`);
    layout.sectors.forEach(({ id, center }) => assertPointInside(center, layout.playableRadius, `${biomeId}: secteur ${id}`));
    layout.ecology.forEach(({ id, center }) => assertPointInside(center, layout.playableRadius, `${biomeId}: écologie ${id}`));
    layout.eventNodes.forEach(({ id, position }) => assertPointInside(position, layout.playableRadius, `${biomeId}: événement ${id}`));
    layout.bossRoute.forEach((point, index) => assertPointInside(point, layout.playableRadius, `${biomeId}: boss ${index}`));
  }
});

test('le route builder matérialise rubans, marqueurs et couvert extérieur sur chaque carte', () => {
  const matrix = new THREE.Matrix4();
  const instancePosition = new THREE.Vector3();

  for (const biomeId of EXPECTED_BIOMES) {
    const layout = getBiomeHuntLayout(biomeId);
    const root = buildHuntRouteNetwork(layout, (x, z) => Math.sin(x * 0.01) + Math.cos(z * 0.01));
    assert.equal(root.name, `hunt-route-network:${biomeId}`);

    const routeMeshes = root.children.filter(({ userData }) => userData.huntRoute === true);
    assert.equal(routeMeshes.length, layout.routes.length, `${biomeId}: rubans manquants`);
    assert.ok(routeMeshes.every(({ geometry }) => (
      geometry.getAttribute('position')?.count > 20
      && geometry.index?.count > 0
      && geometry.userData.routeTriangleCount > 0
    )), `${biomeId}: géométrie de route invalide`);

    const sectorPads = root.getObjectByName('hunt-sector-ground-markers');
    const sectorBeacons = root.getObjectByName('hunt-sector-navigation-beacons');
    const eventMarkers = root.getObjectByName('hunt-event-node-markers');
    const outerCover = root.getObjectByName('hunt-outer-sector-cover');
    const outerAccents = root.getObjectByName('hunt-outer-sector-accents');
    assert.ok(sectorPads?.isInstancedMesh && sectorPads.count === layout.sectors.length, `${biomeId}: pads secteurs`);
    assert.ok(sectorBeacons?.isInstancedMesh && sectorBeacons.count === layout.sectors.length, `${biomeId}: balises secteurs`);
    assert.ok(eventMarkers?.isInstancedMesh && eventMarkers.count === layout.eventNodes.length, `${biomeId}: marqueurs événements`);
    assert.ok(outerCover?.isInstancedMesh && outerCover.count > 20, `${biomeId}: couvert extérieur`);
    assert.equal(outerAccents?.count, outerCover.count, `${biomeId}: accents de couvert`);

    for (let index = 0; index < outerCover.count; index += 1) {
      outerCover.getMatrixAt(index, matrix);
      instancePosition.setFromMatrixPosition(matrix);
      assert.ok(Math.hypot(instancePosition.x, instancePosition.z) <= layout.playableRadius - 18 + 0.001, `${biomeId}: couvert hors limite`);
    }

    assert.ok(root.userData.huntCoverColliders.length > 0, `${biomeId}: colliders de couvert`);
    assert.ok(root.userData.huntCoverColliders.every(({ x, z, type, blocksProjectiles }) => (
      Math.hypot(x, z) <= layout.playableRadius
      && type === 'hunt-sector-cover'
      && blocksProjectiles === true
    )), `${biomeId}: contrat collider extérieur`);
    assert.deepEqual(root.userData.huntLayoutMetrics, {
      sectorCount: layout.sectors.length,
      elevatedSectorCount: layout.sectors.filter(({ center }) => Math.abs(Number(center?.[1]) || 0) > 0.001).length,
      maxSectorElevation: Math.max(0, ...layout.sectors.map(({ center }) => Math.abs(Number(center?.[1]) || 0))),
      routeCount: layout.routes.length,
      eventNodeCount: layout.eventNodes.length,
      routeTriangles: routeMeshes.reduce((total, mesh) => total + mesh.geometry.userData.routeTriangleCount, 0),
      coverInstanceCount: outerCover.count,
      physicalCoverColliderCount: root.userData.huntCoverColliders.length,
      physicalCoverSectorCount: new Set(root.userData.huntCoverColliders.map(({ sectorId }) => sectorId)).size,
      ecologyInstanceEstimate: layout.ecology.reduce((total, territory) => total + territory.count, 0),
      sceneElementEstimate: layout.routes.length + layout.sectors.length * 2 + layout.eventNodes.length + outerCover.count * 2 + layout.ecology.reduce((total, territory) => total + territory.count, 0),
      instancedMarkerCount: layout.sectors.length * 2 + layout.eventNodes.length + outerCover.count * 2,
      drawCallEstimate: layout.routes.length + 5,
    });
    disposeRoot(root);
  }
});
