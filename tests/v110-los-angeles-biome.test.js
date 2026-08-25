import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import test from 'node:test';
import * as THREE from 'three';

import {
  getBiomeHuntLayout,
  getBiomeHuntMetrics,
} from '../src/data/BiomeHuntLayout.js';
import {
  ENVIRONMENT_PERFORMANCE_BUDGETS,
  getBiomePropPlan,
} from '../src/data/BiomePropCatalog.js';
import { BiomePropBuilder } from '../src/world/BiomePropBuilder.js';
import { Environment } from '../src/world/Environment.js';

const BIOME_ID = 'los_angeles_1997';
const TEXTURE_PATH = '/assets/textures/los-angeles-heatwave-urban.webp';
const REQUIRED_NPC_TYPES = new Set([
  'urban_cartel_enforcer',
  'subway_armed_hunter',
  'owlf_cryo_commando',
]);
const REQUIRED_PROP_TYPES = [
  'urban_tenement',
  'subway_entrance',
  'slaughterhouse',
  'owlf_command_van',
  'lost_tribe_ship_hatch',
  'police_vehicle_line',
  'rooftop_equipment',
  'palm_line',
];

function inspectGraph(layout) {
  const adjacency = new Map(layout.sectors.map(({ id }) => [id, new Set()]));
  for (const { from, to } of layout.routes) {
    assert.ok(adjacency.has(from), `origine inconnue: ${from}`);
    assert.ok(adjacency.has(to), `destination inconnue: ${to}`);
    adjacency.get(from).add(to);
    adjacency.get(to).add(from);
  }
  const visited = new Set();
  const pending = [layout.sectors[0].id];
  while (pending.length > 0) {
    const id = pending.pop();
    if (visited.has(id)) continue;
    visited.add(id);
    pending.push(...adjacency.get(id));
  }
  return { adjacency, visited };
}

function makeBuilder() {
  return new BiomePropBuilder({
    createTexturedMaterial(options) {
      return new THREE.MeshStandardMaterial({
        color: options.color,
        roughness: options.roughness,
        metalness: options.metalness,
      });
    },
  });
}

test('Los Angeles 1997 est une grande chasse urbaine maillée sans cul-de-sac', () => {
  const layout = getBiomeHuntLayout(BIOME_ID);
  const metrics = getBiomeHuntMetrics(BIOME_ID);
  const { adjacency, visited } = inspectGraph(layout);

  assert.equal(layout.biomeId, BIOME_ID);
  assert.equal(layout.sectors.length, 10);
  assert.equal(layout.routes.length, 18);
  assert.ok(layout.playableRadius >= 720);
  assert.ok(layout.terrainSize > layout.playableRadius * 2);
  assert.ok(metrics.directDiameterSprintSeconds >= 58);
  assert.equal(visited.size, layout.sectors.length);
  assert.ok(layout.routes.length - layout.sectors.length + 1 >= 8);
  assert.ok([...adjacency.values()].every((neighbors) => neighbors.size >= 2));

  const roles = new Set(layout.sectors.map(({ role }) => role));
  ['camp', 'ambush', 'overlook', 'landmark', 'crossroads', 'hazard', 'resource', 'boss_lair']
    .forEach((role) => assert.ok(roles.has(role), `rôle absent: ${role}`));
  assert.equal(layout.ecology.length, 7);
  assert.equal(metrics.ecologyCount, 20);
  assert.deepEqual(new Set(layout.ecology.map(({ type }) => type)), REQUIRED_NPC_TYPES);
  assert.equal(layout.eventNodes.length, 7);
  assert.equal(new Set(layout.eventNodes.map(({ position }) => position.join(':'))).size, 7);
  assert.ok(layout.eventNodes.some(({ label }) => label.includes('Guerre de gangs')));
  assert.ok(layout.eventNodes.some(({ label }) => label.includes('Blackout')));
  assert.ok(layout.eventNodes.some(({ label }) => label.includes('cryogénique')));
  assert.ok(layout.eventNodes.some(({ label }) => label.includes('City Hunter')));
  assert.ok(layout.eventNodes.some(({ eventType }) => eventType === 'cache_drop'));
  assert.ok(layout.eventNodes.filter(({ status }) => status === 'energy_jam').length >= 2);
  assert.equal(layout.bossRoute.length, 6);
});

test('les repères urbains ont leurs silhouettes procédurales et la texture OpenAI originale', () => {
  const plan = getBiomePropPlan(BIOME_ID);
  assert.ok(plan.textureReferences.includes(TEXTURE_PATH));
  assert.ok(existsSync(`public${TEXTURE_PATH}`));
  assert.ok(statSync(`public${TEXTURE_PATH}`).size > 10_000);
  assert.equal(plan.props.length, 8);
  assert.equal(plan.pointsOfInterest.length, 4);
  assert.equal(plan.hazardZones.length, 3);

  const propTypes = new Set(plan.props.map(({ type }) => type));
  REQUIRED_PROP_TYPES.forEach((type) => assert.ok(propTypes.has(type), `${type} absent`));
  const builder = makeBuilder();
  const build = builder.build(plan);
  for (const type of REQUIRED_PROP_TYPES) {
    const prop = build.props.find((entry) => entry.type === type);
    assert.ok(prop, `${type}: aucun prop construit`);
    assert.equal(prop.visualVariant, type);
    assert.equal(prop.mesh.userData.visualVariant, type);
    assert.ok(prop.mesh.userData.visualSignature.length > 18);
    assert.ok(prop.mesh.children.length >= 2);
  }
  assert.ok(build.props.every(({ mesh }) => (
    mesh.children.some(({ isInstancedMesh }) => isInstancedMesh)
    || mesh.children.length >= 6
  )));
  assert.ok(build.metrics.drawCallEstimate <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxDrawCalls);
  assert.ok(build.metrics.triangleEstimate <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxTriangles);
});

test('le runtime urbain fournit skyline, sodium, collisions, perches et événements répartis', () => {
  const scene = new THREE.Scene();
  const environment = new Environment(scene);
  assert.equal(environment.setBiome(BIOME_ID), true);
  assert.equal(environment.currentBiome, BIOME_ID);
  assert.equal(scene.background.getHex(), 0x09050b);
  assert.equal(environment.sunSphere.visible, false);

  const batchContract = Object.fromEntries(
    environment.staticInstanceBatches.map(({ name, count }) => [name, count]),
  );
  assert.deepEqual(batchContract, {
    'los-angeles-urban-blocks': 24,
    'los-angeles-rooftop-heat-rims': 24,
    'los-angeles-streetlight-masts': 20,
    'los-angeles-sodium-lamps': 20,
  });
  assert.ok(environment.staticInstanceBatches.every(({ userData }) => userData.staticEnvironmentBatch === true));

  const snapshot = environment.getLevelDesignSnapshot();
  assert.equal(snapshot.sectorCount, 10);
  assert.equal(snapshot.routeCount, 18);
  assert.equal(snapshot.ecologyCount, 20);
  assert.equal(snapshot.eventNodeCount, 7);
  assert.equal(snapshot.propCount, 8);
  assert.equal(snapshot.pointOfInterestCount, 4);
  assert.equal(snapshot.hazardCount, 3);
  assert.equal(snapshot.staticInstanceBatchCount, 4);
  assert.equal(snapshot.staticInstanceCount, 88);
  assert.ok(snapshot.colliderCount >= 50);
  assert.ok(snapshot.colliderCount <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxColliders);
  assert.ok(snapshot.huntRouteColliderSectorCount >= 9);
  assert.ok(environment.getTraversalPerches().length >= 30);

  const colliderSources = new Set([
    ...environment.obstacleColliders,
    ...environment.projectileCoverColliders,
  ].map(({ sourceId }) => sourceId));
  getBiomePropPlan(BIOME_ID).props.forEach(({ id }) => (
    assert.ok(colliderSources.has(id), `${id}: collider absent`)
  ));
  const ambientPlan = environment.getAmbientSpawnPlan();
  assert.equal(ambientPlan.length, 20);
  assert.deepEqual(new Set(ambientPlan.map(({ type }) => type)), REQUIRED_NPC_TYPES);
  assert.ok(ambientPlan.every(({ position }) => Math.hypot(position.x, position.z) <= environment.playableRadius));
  assert.equal(environment.getEventNodes().length, 7);
});
