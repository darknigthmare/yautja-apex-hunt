import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  BIOME_DEFINITIONS,
  HUNT_DEFINITIONS,
  resolveHuntBiome,
} from '../src/data/GameConfig.js';
import {
  getBiomeHuntLayout,
  getBiomeHuntMetrics,
} from '../src/data/BiomeHuntLayout.js';
import {
  ENVIRONMENT_PERFORMANCE_BUDGETS,
  getBiomePropPlan,
} from '../src/data/BiomePropCatalog.js';
import { Environment } from '../src/world/Environment.js';
import {
  HUNT_DIRECTIVES,
  createDirectiveProgress,
  getDirectiveProgressSummary,
  recordDirectiveNpcDefeat,
  resolveDirectiveBiome,
} from '../src/gameplay/HuntDirectiveSystem.js';
import { LevelEventDirector } from '../src/gameplay/LevelEventDirector.js';
import { getLoreEntryById } from '../src/data/LoreCodex.js';
import { getMediaCoverageById } from '../src/data/MediaCoverageCatalog.js';

const BIOME_ID = 'gunnison_outbreak';
const DIRECTIVE_ID = 'gunnison_cleanup';

test('Wolf et le Predalien sont réellement rattachés à la grande carte de Gunnison', () => {
  assert.equal(BIOME_DEFINITIONS[BIOME_ID].texture, '/assets/textures/gunnison-rain-urban.webp');
  assert.equal(HUNT_DEFINITIONS.wolf_cleaner.recommendedBiome, BIOME_ID);
  assert.equal(HUNT_DEFINITIONS.predalien.recommendedBiome, BIOME_ID);
  assert.equal(resolveHuntBiome('wolf_cleaner', 'hive_lv426'), BIOME_ID);
  assert.equal(resolveHuntBiome('predalien', 'jungle'), BIOME_ID);
});

test('Gunnison forme un monde ouvert connecté avec dix secteurs et de vraies boucles', () => {
  const layout = getBiomeHuntLayout(BIOME_ID);
  const metrics = getBiomeHuntMetrics(BIOME_ID);
  assert.equal(layout.playableRadius, 760);
  assert.equal(layout.sectors.length, 10);
  assert.ok(layout.routes.length >= 18);
  assert.equal(layout.ecology.length, 7);
  assert.ok(layout.eventNodes.length >= 7);
  assert.equal(metrics.sectorCount, 10);
  assert.ok(metrics.directDiameterSprintSeconds >= 55);

  const sectorIds = new Set(layout.sectors.map(({ id }) => id));
  const adjacency = new Map([...sectorIds].map((id) => [id, new Set()]));
  layout.routes.forEach(({ from, to }) => {
    assert.ok(sectorIds.has(from), from);
    assert.ok(sectorIds.has(to), to);
    adjacency.get(from).add(to);
    adjacency.get(to).add(from);
  });
  const visited = new Set();
  const queue = [layout.sectors[0].id];
  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    queue.push(...adjacency.get(current));
  }
  assert.equal(visited.size, layout.sectors.length);
  assert.ok(layout.routes.length > layout.sectors.length, 'la carte doit contenir plusieurs boucles, pas un couloir');
  layout.sectors.forEach(({ center, id }) => assert.ok(Math.hypot(center[0], center[2]) <= 760, id));

  const nodeIds = new Set(layout.eventNodes.map(({ id }) => id));
  for (const id of [
    'gunnison-grid-blackout',
    'gunnison-hive-rupture',
    'gunnison-guard-collapse',
    'gunnison-extraction-countdown',
  ]) assert.ok(nodeIds.has(id), id);
  assert.equal(layout.eventNodes.find(({ id }) => id === 'gunnison-extraction-countdown').countdownSeconds, 45);
});

test('les props, POI et dangers Gunnison restent sous les budgets de contenu', () => {
  const plan = getBiomePropPlan(BIOME_ID);
  assert.ok(plan.textureReferences.includes('/assets/textures/gunnison-rain-urban.webp'));
  assert.ok(plan.props.length >= 16);
  assert.ok(plan.props.length <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxProps);
  assert.equal(plan.pointsOfInterest.length, ENVIRONMENT_PERFORMANCE_BUDGETS.maxPoi);
  assert.equal(plan.hazardZones.length, ENVIRONMENT_PERFORMANCE_BUDGETS.maxHazards);
  const propIds = new Set(plan.props.map(({ id }) => id));
  for (const id of [
    'gunnison-crashed-scout-hull',
    'gunnison-power-station',
    'gunnison-high-school',
    'gunnison-hospital',
    'gunnison-wolf-cleaner-canisters',
  ]) assert.ok(propIds.has(id), id);
});

test('Environment matérialise une Gunnison nocturne, pluvieuse et instanciée dans les budgets', () => {
  const scene = new THREE.Scene();
  const environment = new Environment(scene);
  assert.equal(environment.setBiome(BIOME_ID), true);
  assert.equal(environment.currentBiome, BIOME_ID);
  assert.equal(environment.activeWeatherEvent, 'rain');
  assert.ok(environment.rainParticles?.isPoints);
  assert.equal(environment.sunSphere.visible, false);

  const expectedBatches = new Map([
    ['gunnison-rain-soaked-blocks', 20],
    ['gunnison-rooftop-caps', 20],
    ['gunnison-emergency-windows', 40],
    ['gunnison-crash-forest-pine-trunks', 24],
    ['gunnison-crash-forest-pine-crowns', 24],
    ['gunnison-cemetery-headstones', 30],
    ['gunnison-streetlight-masts', 20],
    ['gunnison-failing-streetlamps', 20],
    ['gunnison-sewer-resin-ribs', 18],
  ]);
  for (const [name, count] of expectedBatches) {
    const batch = environment.biomeGroup.getObjectByName(name);
    assert.ok(batch?.isInstancedMesh, name);
    assert.equal(batch.count, count, name);
  }
  const snapshot = environment.getLevelDesignSnapshot();
  assert.equal(snapshot.staticInstanceBatchCount, expectedBatches.size);
  assert.ok(snapshot.colliderCount <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxColliders);
  assert.ok(snapshot.totalDrawCallEstimate <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxDrawCalls);
  assert.ok(snapshot.totalTriangleEstimate <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxTriangles);
  assert.equal(environment.biomeGroup.children.filter(({ userData }) => userData.gunnisonEmergencyLight).length, 4);

  environment.clearWeatherEvent();
  assert.equal(environment.activeWeatherEvent, null);
  environment.update(0.016, 'thermal', { weatherEvent: null });
  assert.equal(environment.activeWeatherEvent, 'rain', 'la pluie ambiante doit revenir après un incident météo');
  environment.dispose();
});

test('la directive Cleaner possède quatre vagues, progresse et impose Gunnison', () => {
  const directive = HUNT_DIRECTIVES[DIRECTIVE_ID];
  assert.ok(directive);
  assert.equal(directive.recommendedBiomeId, BIOME_ID);
  assert.equal(resolveDirectiveBiome(DIRECTIVE_ID, 'jungle'), BIOME_ID);
  assert.equal(directive.objectives.length, 4);
  assert.equal(directive.schedule.length, 4);
  assert.deepEqual(
    directive.schedule.map(({ npcType }) => npcType),
    ['gunnison_national_guard', 'xeno_facehugger', 'xeno_drone', 'xeno_warrior'],
  );

  let progress = createDirectiveProgress(DIRECTIVE_ID);
  directive.objectives.forEach(({ npcType }) => {
    progress = recordDirectiveNpcDefeat(progress, npcType);
  });
  assert.equal(getDirectiveProgressSummary(progress).isComplete, true);
});

test('le directeur émet les quatre incidents Gunnison depuis leurs nœuds exacts', () => {
  const scene = new THREE.Scene();
  const environment = new Environment(scene);
  environment.setBiome(BIOME_ID);
  const director = new LevelEventDirector(scene, {
    schedule: [],
    maxEnemySpawns: 0,
    maxVehicles: 0,
    maxCaches: 0,
    rng: () => 0.4,
  });
  director.start({ huntId: 'predalien', biomeId: BIOME_ID, directiveId: 'standard_hunt' });
  assert.equal(director.selectVehicleType(), 'wolf_cleaner_ship');
  assert.equal(director.selectCacheType(), 'cleaner_case');
  const signals = director.update(170, {
    player: { position: new THREE.Vector3(0, 0, 620) },
    boss: { isDead: false },
    environment,
  });
  const bySourceId = new Map(signals.map((signal) => [signal.sourceId, signal]));
  assert.equal(bySourceId.get('gunnison-grid-blackout')?.type, 'localized_event');
  assert.equal(bySourceId.get('gunnison-grid-blackout')?.mechanism, 'power_grid_blackout');
  assert.equal(bySourceId.get('gunnison-hive-rupture')?.type, 'prey_migration');
  assert.equal(bySourceId.get('gunnison-hive-rupture')?.creatureType, 'xeno_warrior');
  assert.deepEqual(bySourceId.get('gunnison-guard-collapse')?.factions, ['gunnison_national_guard', 'xeno_warrior']);
  assert.equal(bySourceId.get('gunnison-extraction-countdown')?.countdownSeconds, 45);
  director.dispose();
  environment.dispose();
});

test('le Codex et la couverture AVP:R ne référencent que les IDs Gunnison réels', () => {
  const location = getLoreEntryById(BIOME_ID);
  assert.equal(location?.basisTier, 'AVP_SCREEN');
  assert.deepEqual(getLoreEntryById('wolf_cleaner')?.locationIds, [BIOME_ID]);
  assert.deepEqual(getLoreEntryById('predalien')?.locationIds, [BIOME_ID]);
  assert.ok(getLoreEntryById('technologie-agent-cleaner'));

  const coverage = getMediaCoverageById('film_avpr_2007');
  const ids = new Set(coverage.coverageTargets.map(({ id }) => id));
  for (const id of [
    'wolf_cleaner',
    'predalien',
    BIOME_ID,
    DIRECTIVE_ID,
    'gunnison-grid-blackout',
    'gunnison-hive-rupture',
    'gunnison-guard-collapse',
    'gunnison-extraction-countdown',
  ]) assert.ok(ids.has(id), id);
});
