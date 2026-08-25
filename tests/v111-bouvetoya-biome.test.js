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

const BIOME_ID = 'bouvetoya_pyramid';

function graphMetrics(layout) {
  const adjacency = new Map(layout.sectors.map(({ id }) => [id, new Set()]));
  for (const route of layout.routes) {
    assert.ok(adjacency.has(route.from), `origine inconnue: ${route.from}`);
    assert.ok(adjacency.has(route.to), `destination inconnue: ${route.to}`);
    adjacency.get(route.from).add(route.to);
    adjacency.get(route.to).add(route.from);
  }
  const visited = new Set();
  const pending = [layout.sectors[0].id];
  while (pending.length > 0) {
    const id = pending.pop();
    if (visited.has(id)) continue;
    visited.add(id);
    pending.push(...adjacency.get(id));
  }
  return { adjacency, visited, cycleBudget: layout.routes.length - layout.sectors.length + 1 };
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

test('Bouvetøya forme une grande chasse pyramidale cyclique, vivante et distribuée', () => {
  const layout = getBiomeHuntLayout(BIOME_ID);
  const metrics = getBiomeHuntMetrics(BIOME_ID);
  const { adjacency, visited, cycleBudget } = graphMetrics(layout);

  assert.equal(layout.biomeId, BIOME_ID);
  assert.equal(layout.playableRadius, 740);
  assert.ok(layout.terrainSize >= 1680);
  assert.equal(layout.sectors.length, 10);
  assert.equal(layout.routes.length, 18);
  assert.equal(visited.size, 10);
  assert.ok(cycleBudget >= 9, 'la pyramide doit offrir de nombreuses boucles indépendantes');
  assert.ok([...adjacency.values()].every((neighbors) => neighbors.size >= 2), 'aucun secteur ne doit devenir un couloir sans choix');
  assert.ok(metrics.directDiameterSprintSeconds >= 56);

  assert.equal(layout.ecology.length, 7);
  assert.equal(metrics.ecologyCount, 15);
  assert.ok(layout.ecology.some(({ type }) => type === 'weyland_expedition_guard'));
  assert.ok(new Set(layout.ecology.map(({ type }) => type)).size >= 6);

  assert.equal(layout.eventNodes.length, 7);
  assert.equal(new Set(layout.eventNodes.map(({ position }) => position.join(':'))).size, 7);
  const shiftEvent = layout.eventNodes.find(({ id }) => id === 'avp-pyramid-shift');
  assert.equal(shiftEvent?.eventType, 'pyramid_shift');
  assert.equal(shiftEvent?.mechanism, 'pyramid_shift');
  const eventTypes = new Set(layout.eventNodes.map(({ eventType }) => eventType));
  for (const type of ['localized_hazard', 'prey_migration', 'territory_clash', 'cache_drop', 'boss_trail', 'pyramid_shift']) {
    assert.ok(eventTypes.has(type), `événement ${type} absent`);
  }
  const xs = layout.eventNodes.map(({ position }) => position[0]);
  const zs = layout.eventNodes.map(({ position }) => position[2]);
  assert.ok(Math.max(...xs) - Math.min(...xs) >= layout.playableRadius * 0.75);
  assert.ok(Math.max(...zs) - Math.min(...zs) >= layout.playableRadius * 0.75);
  assert.equal(layout.bossRoute.length, 6);
});

test('le catalogue Bouvetøya livre dix familles de props, quatre POI et quatre dangers réels', () => {
  const plan = getBiomePropPlan(BIOME_ID);
  assert.deepEqual(plan.textureReferences.slice(0, 2), [
    '/assets/textures/bouvetoya-ice-rock.webp',
    '/assets/textures/bouvetoya-pyramid-stone.webp',
  ]);
  assert.equal(plan.sourceTier, 'ORIGINAL');
  assert.equal(plan.basisTier, 'AVP_SCREEN');
  assert.equal(plan.props.length, 18);
  assert.ok(new Set(plan.props.map(({ type }) => type)).size >= 10);
  assert.equal(plan.pointsOfInterest.length, 4);
  assert.equal(new Set(plan.pointsOfInterest.map(({ type }) => type)).size, 4);
  assert.equal(plan.hazardZones.length, 4);

  const placedCount = plan.props.reduce((total, prop) => total + (prop.instances ?? 1), 0);
  assert.ok(placedCount >= 18);
  assert.ok(placedCount <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxProps);
  assert.equal(plan.props.filter(({ type }) => type === 'pyramid_shift_wall').length, 4);
  assert.deepEqual(new Set(plan.props.filter(({ type }) => type === 'pyramid_shift_wall').map(({ shiftGroup }) => shiftGroup)), new Set(['alpha', 'beta']));

  const builder = makeBuilder();
  const build = builder.build(plan);
  const detailedTypes = [
    'weyland_drill_array',
    'pyramid_entrance',
    'pyramid_sacrificial_dais',
    'pyramid_plasma_vault',
    'pyramid_queen_restraint',
    'pyramid_arena_gate',
    'pyramid_shift_wall',
    'pyramid_weapon_pod',
    'pyramid_resin_ribs',
    'pyramid_egg_cluster',
    'ice_crag_line',
    'thermal_vent_array',
  ];
  for (const type of detailedTypes) {
    const props = build.props.filter((prop) => prop.type === type);
    assert.ok(props.length > 0, `${type}: prop absent`);
    assert.ok(props.every(({ visualVariant, mesh }) => (
      visualVariant === type
      && mesh.userData.visualSignature.length > 12
      && mesh.children.length >= 2
    )), `${type}: silhouette détaillée manquante`);
  }
  assert.ok(build.metrics.drawCallEstimate <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxDrawCalls);
  assert.ok(build.metrics.triangleEstimate <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxTriangles);
});

test('Environment matérialise la glace, la pyramide, les lumières et les budgets Bouvetøya', () => {
  const scene = new THREE.Scene();
  const environment = new Environment(scene);
  assert.equal(environment.setBiome(BIOME_ID), true);
  assert.equal(environment.currentBiome, BIOME_ID);
  assert.equal(scene.background.getHex(), 0x06111a);

  assert.deepEqual(
    Object.fromEntries(environment.staticInstanceBatches.map(({ name, count }) => [name, count])),
    {
      'bouvetoya-surface-ice-spires': 28,
      'bouvetoya-pyramid-monoliths': 24,
      'bouvetoya-resin-ribs': 20,
    },
  );
  assert.equal(environment.pyramidInteriorLights.length, 4);
  assert.ok(environment.pyramidInteriorLights.some(({ name, color }) => name.includes('surface') && color.getHex() === 0xa9eeff));
  assert.ok(environment.pyramidInteriorLights.filter(({ color }) => color.getHex() !== 0xa9eeff).length >= 3);

  const snapshot = environment.getLevelDesignSnapshot();
  assert.equal(snapshot.sectorCount, 10);
  assert.equal(snapshot.routeCount, 18);
  assert.equal(snapshot.ecologyCount, 15);
  assert.equal(snapshot.eventNodeCount, 7);
  assert.equal(snapshot.propCount, 18);
  assert.equal(snapshot.pointOfInterestCount, 4);
  assert.equal(snapshot.hazardCount, 4);
  assert.equal(snapshot.staticInstanceBatchCount, 3);
  assert.equal(snapshot.staticInstanceCount, 72);
  assert.equal(snapshot.pyramidInteriorLightCount, 4);
  assert.equal(snapshot.pyramidShiftWallCount, 4);
  assert.ok(snapshot.colliderCount <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxColliders);
  assert.ok(snapshot.huntRouteColliderSectorCount >= 9);
  assert.ok(snapshot.propDrawCallEstimate <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxDrawCalls);
  assert.ok(snapshot.propTriangleEstimate <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxTriangles);
  assert.ok(environment.getTraversalPerches().length >= 30);
  assert.equal(environment.getAmbientSpawnPlan().length, 15);
  assert.equal(environment.getEventNodes().length, 7);
  environment.dispose();
});

test('les murs de la pyramide s’animent et basculent réellement leurs colliders', () => {
  const environment = new Environment(new THREE.Scene());
  environment.setBiome(BIOME_ID);

  const initial = environment.getPyramidShiftSnapshot();
  assert.equal(initial.available, true);
  assert.equal(initial.mode, 'alpha_closed');
  assert.equal(initial.wallCount, 4);
  assert.equal(initial.activeColliderCount, 2);
  assert.deepEqual(initial.activeColliderIds, ['bouvet-shift-alpha-east', 'bouvet-shift-alpha-west']);
  const initialY = Object.fromEntries(initial.wallPositions.map(({ id, y }) => [id, y]));

  const triggered = environment.triggerPyramidShift({ targetMode: 'beta_closed', duration: 2 });
  assert.equal(triggered.active, true);
  assert.equal(triggered.targetMode, 'beta_closed');
  assert.equal(triggered.activeColliderCount, 0, 'les couloirs restent sûrs pendant le déplacement');
  assert.ok(environment.obstacleColliders.every(({ sourceId }) => !sourceId?.startsWith('bouvet-shift-')));

  const halfway = environment.updatePyramidShift(1);
  assert.equal(halfway.active, true);
  assert.equal(halfway.progress, 0.5);
  assert.ok(halfway.wallPositions.some(({ id, y }) => y !== initialY[id]), 'les meshes doivent vraiment se déplacer');

  const completed = environment.updatePyramidShift(1);
  assert.equal(completed.active, false);
  assert.equal(completed.mode, 'beta_closed');
  assert.equal(completed.generation, 1);
  assert.deepEqual(completed.activeColliderIds, ['bouvet-shift-beta-north', 'bouvet-shift-beta-south']);
  const colliderSources = new Set(environment.obstacleColliders.map(({ sourceId }) => sourceId));
  assert.ok(colliderSources.has('bouvet-shift-beta-north'));
  assert.ok(colliderSources.has('bouvet-shift-beta-south'));
  assert.equal(colliderSources.has('bouvet-shift-alpha-west'), false);

  assert.ok(environment.triggerPyramidShift({ duration: 1.2 }));
  environment.update(1.2, 'normal');
  assert.equal(environment.getPyramidShiftSnapshot().mode, 'alpha_closed');
  assert.equal(environment.getLevelDesignSnapshot().pyramidShiftGeneration, 2);

  environment.setBiome('jungle');
  assert.equal(environment.getPyramidShiftSnapshot().available, false);
  assert.deepEqual(environment.pyramidShiftWalls, []);
  assert.equal(environment.pyramidShiftState, null);
  assert.equal(environment.triggerPyramidShift(), false);
  environment.dispose();
});
