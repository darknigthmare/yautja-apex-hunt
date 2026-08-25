import assert from 'node:assert/strict';
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

const BIOME_ID = 'stargazer_blacksite';
const REQUIRED_NPC_TYPES = new Set([
  'stargazer_rifleman',
  'stargazer_net_trapper',
  'modified_predator_hound',
]);
const REQUIRED_PROP_TYPES = [
  'stargazer_checkpoint',
  'stargazer_containment_lab',
  'stargazer_kennel',
  'stargazer_watchtower',
  'stargazer_barrier_line',
  'stargazer_pod_line',
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

test('Stargazer forme une grande chasse non linéaire et répartit menaces et événements', () => {
  const layout = getBiomeHuntLayout(BIOME_ID);
  const metrics = getBiomeHuntMetrics(BIOME_ID);
  const { adjacency, visited } = inspectGraph(layout);

  assert.equal(layout.biomeId, BIOME_ID);
  assert.equal(layout.sectors.length, 9);
  assert.equal(layout.routes.length, 16);
  assert.ok(layout.playableRadius >= 680);
  assert.ok(layout.terrainSize > layout.playableRadius * 2);
  assert.ok(metrics.directDiameterSprintSeconds >= 50);
  assert.equal(visited.size, 9);
  assert.ok(layout.routes.length - layout.sectors.length + 1 >= 6, 'les itinéraires doivent offrir plusieurs boucles indépendantes');
  assert.ok([...adjacency.values()].every((neighbors) => neighbors.size >= 2), 'aucun secteur ne doit être un cul-de-sac');

  assert.equal(layout.ecology.length, 6);
  assert.equal(metrics.ecologyCount, 15);
  assert.deepEqual(new Set(layout.ecology.map(({ type }) => type)), REQUIRED_NPC_TYPES);
  assert.equal(layout.eventNodes.length, 6);
  assert.equal(new Set(layout.eventNodes.map(({ position }) => position.join(':'))).size, 6);
  const eventXs = layout.eventNodes.map(({ position }) => position[0]);
  const eventZs = layout.eventNodes.map(({ position }) => position[2]);
  assert.ok(Math.max(...eventXs) - Math.min(...eventXs) >= layout.playableRadius * 0.75);
  assert.ok(Math.max(...eventZs) - Math.min(...eventZs) >= layout.playableRadius * 0.75);
  assert.equal(layout.bossRoute.length, 5);
});

test('le catalogue Stargazer construit de vraies silhouettes de laboratoire et de sécurité', () => {
  const plan = getBiomePropPlan(BIOME_ID);
  assert.ok(plan.textureReferences.includes('/assets/textures/stargazer-tactical-composite.webp'));
  assert.ok(plan.textureReferences.includes('/assets/textures/ryushi-frontier-panels.webp'));
  assert.equal(plan.props.length, 8);
  assert.equal(plan.pointsOfInterest.length, 4);
  assert.equal(plan.hazardZones.length, 2);

  const propTypes = new Set(plan.props.map(({ type }) => type));
  REQUIRED_PROP_TYPES.forEach((type) => assert.ok(propTypes.has(type), `${type} absent`));

  const builder = makeBuilder();
  const build = builder.build(plan);
  for (const type of REQUIRED_PROP_TYPES) {
    const props = build.props.filter((prop) => prop.type === type);
    assert.ok(props.length > 0, `${type}: aucun prop construit`);
    assert.ok(props.every(({ mesh, visualVariant }) => (
      visualVariant === type
      && mesh.userData.visualSignature.length > 8
      && mesh.children.length >= 2
    )), `${type}: silhouette procédurale incomplète`);
  }
  assert.ok(build.props.filter(({ type }) => type.startsWith('stargazer_')).every(({ mesh }) => (
    mesh.children.some(({ isInstancedMesh }) => isInstancedMesh)
    || mesh.children.length >= 7
  )));
  assert.ok(build.metrics.drawCallEstimate <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxDrawCalls);
  assert.ok(build.metrics.triangleEstimate <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxTriangles);
});

test('le runtime Stargazer respecte budgets, collisions, couvert et perches', () => {
  const scene = new THREE.Scene();
  const environment = new Environment(scene);
  assert.equal(environment.setBiome(BIOME_ID), true);
  assert.equal(environment.currentBiome, BIOME_ID);
  assert.equal(scene.background.getHex(), 0x050a10);

  const batchContract = Object.fromEntries(
    environment.staticInstanceBatches.map(({ name, count }) => [name, count]),
  );
  assert.deepEqual(batchContract, {
    'stargazer-perimeter-pylons': 28,
    'stargazer-perimeter-panels': 28,
    'stargazer-floodlight-masts': 12,
    'stargazer-floodlights': 12,
  });
  assert.ok(environment.staticInstanceBatches.every(({ userData }) => userData.staticEnvironmentBatch === true));

  const snapshot = environment.getLevelDesignSnapshot();
  assert.equal(snapshot.sectorCount, 9);
  assert.equal(snapshot.routeCount, 16);
  assert.equal(snapshot.ecologyCount, 15);
  assert.equal(snapshot.eventNodeCount, 6);
  assert.equal(snapshot.propCount, 8);
  assert.equal(snapshot.pointOfInterestCount, 4);
  assert.equal(snapshot.hazardCount, 2);
  assert.equal(snapshot.staticInstanceBatchCount, 4);
  assert.equal(snapshot.staticInstanceCount, 80);
  assert.ok(snapshot.colliderCount >= 45);
  assert.ok(snapshot.colliderCount <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxColliders);
  assert.ok(snapshot.huntRouteColliderSectorCount >= 8);
  assert.ok(environment.getTraversalPerches().length >= 20);

  const requiredColliderSources = [
    'stargazer-west-checkpoint',
    'stargazer-operations-lab',
    'stargazer-genetics-lab',
    'stargazer-west-kennel',
    'stargazer-security-watchtower',
    'stargazer-east-watchtower',
    'stargazer-south-barriers',
    'stargazer-containment-pods',
  ];
  const colliderSources = new Set([
    ...environment.obstacleColliders,
    ...environment.projectileCoverColliders,
  ].map(({ sourceId }) => sourceId));
  requiredColliderSources.forEach((sourceId) => assert.ok(colliderSources.has(sourceId), `${sourceId}: collider absent`));

  const ambientPlan = environment.getAmbientSpawnPlan();
  assert.equal(ambientPlan.length, 15);
  assert.deepEqual(new Set(ambientPlan.map(({ type }) => type)), REQUIRED_NPC_TYPES);
  assert.ok(ambientPlan.every(({ position }) => Math.hypot(position.x, position.z) <= environment.playableRadius));
  assert.equal(environment.getEventNodes().length, 6);
});
