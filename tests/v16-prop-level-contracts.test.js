import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import {
  BIOME_PROP_CATALOG,
  ENVIRONMENT_PERFORMANCE_BUDGETS,
  getBiomePropPlan,
} from '../src/data/BiomePropCatalog.js';
import { BIOME_DEFINITIONS } from '../src/data/GameConfig.js';
import { Environment } from '../src/world/Environment.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BIOME_IDS = Object.keys(BIOME_DEFINITIONS).sort();
const EXPECTED_BIOMES = [
  'genna_deathworld',
  'hive_lv426',
  'jungle',
  'ryushi_desert',
  'yautja_prime',
];

function asPosition(value, label) {
  const components = Array.isArray(value)
    ? value
    : [value?.x, value?.y, value?.z];
  assert.equal(components.length, 3, `${label}: une position 3D est requise`);
  components.forEach((component, index) => {
    assert.ok(Number.isFinite(component), `${label}: coordonnée ${index} invalide`);
  });
  return components;
}

function distance2d(left, right) {
  const [leftX, , leftZ] = asPosition(left, 'position gauche');
  const [rightX, , rightZ] = asPosition(right, 'position droite');
  return Math.hypot(leftX - rightX, leftZ - rightZ);
}

function placedPropCount(props) {
  return props.reduce((total, prop) => total + (prop.instances ?? prop.count ?? 1), 0);
}

function collectTextureReferences(value, references = new Set()) {
  if (typeof value === 'string' && value.startsWith('/assets/textures/')) {
    references.add(value);
  } else if (Array.isArray(value)) {
    value.forEach((entry) => collectTextureReferences(entry, references));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((entry) => collectTextureReferences(entry, references));
  }
  return references;
}

function getPoiPosition(pointOfInterest) {
  return pointOfInterest?.position
    ?? pointOfInterest?.mesh?.position
    ?? pointOfInterest?.root?.position;
}

function getPoiId(pointOfInterest) {
  return pointOfInterest?.id
    ?? pointOfInterest?.poiId
    ?? pointOfInterest?.userData?.poiId
    ?? pointOfInterest?.mesh?.userData?.poiId
    ?? pointOfInterest?.root?.userData?.poiId;
}

function propLayoutSignature(environment) {
  return environment.environmentProps.map((prop) => {
    const root = prop?.mesh ?? prop?.root ?? prop;
    const id = prop?.id ?? prop?.propId ?? root?.userData?.propId ?? root?.name;
    const position = root?.position ?? prop?.position;
    return { id, position: asPosition(position, `prop ${id}`).map((value) => Number(value.toFixed(5))) };
  });
}

test('le catalogue v1.6 couvre exactement les cinq biomes et publie des budgets explicites', () => {
  assert.deepEqual(BIOME_IDS, EXPECTED_BIOMES);
  assert.deepEqual(Object.keys(BIOME_PROP_CATALOG).sort(), EXPECTED_BIOMES);
  assert.equal(Object.isFrozen(BIOME_PROP_CATALOG), true);

  for (const key of [
    'maxProps',
    'maxPoi',
    'maxHazards',
    'maxColliders',
    'maxDrawCalls',
    'maxTriangles',
  ]) {
    assert.ok(
      Number.isInteger(ENVIRONMENT_PERFORMANCE_BUDGETS[key])
        && ENVIRONMENT_PERFORMANCE_BUDGETS[key] > 0,
      `Budget absent ou invalide: ${key}`,
    );
  }
});

test('les plans de props sont déterministes, identifiables et spatialement sûrs', () => {
  const source = readFileSync(join(ROOT, 'src/data/BiomePropCatalog.js'), 'utf8');
  assert.equal(source.includes('Math.random('), false, 'Le placement de catalogue ne doit pas dépendre de Math.random');

  for (const biomeId of BIOME_IDS) {
    const first = getBiomePropPlan(biomeId);
    const second = getBiomePropPlan(biomeId);

    assert.deepEqual(first, second, `${biomeId}: le même biome doit produire le même plan`);
    assert.equal(first.biomeId, biomeId);
    assert.ok(Array.isArray(first.props), `${biomeId}: props[] absent`);
    assert.ok(Array.isArray(first.pointsOfInterest), `${biomeId}: pointsOfInterest[] absent`);
    assert.ok(Array.isArray(first.hazardZones), `${biomeId}: hazardZones[] absent`);
    assert.ok(first.props.length >= 6, `${biomeId}: palette de props trop pauvre`);
    assert.ok(placedPropCount(first.props) >= 12, `${biomeId}: décor insuffisamment habité`);
    assert.ok(first.pointsOfInterest.length >= 3, `${biomeId}: trois POI minimum`);
    assert.ok(first.hazardZones.length >= 1, `${biomeId}: au moins un danger contextuel`);

    const allEntries = [...first.props, ...first.pointsOfInterest, ...first.hazardZones];
    const ids = allEntries.map(({ id }) => id);
    assert.ok(ids.every((id) => typeof id === 'string' && id.length > 2), `${biomeId}: identifiants incomplets`);
    assert.equal(new Set(ids).size, ids.length, `${biomeId}: identifiants dupliqués`);

    for (const prop of first.props) {
      assert.ok(typeof prop.type === 'string' && prop.type.length > 2, `${prop.id}: type absent`);
      const position = asPosition(prop.position, prop.id);
      assert.ok(Math.hypot(position[0], position[2]) <= 330, `${prop.id}: prop hors de l'aire jouable`);
      const instances = prop.instances ?? prop.count ?? 1;
      assert.ok(Number.isInteger(instances) && instances > 0, `${prop.id}: nombre d'instances invalide`);
    }

    assert.ok(
      placedPropCount(first.props) <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxProps,
      `${biomeId}: budget de props dépassé`,
    );
    assert.ok(first.pointsOfInterest.length <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxPoi);
    assert.ok(first.hazardZones.length <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxHazards);
  }
});

test('les POI ont des fonctions distinctes, une zone d interaction et une composition lisible', () => {
  for (const biomeId of BIOME_IDS) {
    const { pointsOfInterest } = getBiomePropPlan(biomeId);
    const poiTypes = new Set();

    pointsOfInterest.forEach((poi, index) => {
      const position = asPosition(poi.position, poi.id);
      const radiusFromCenter = Math.hypot(position[0], position[2]);
      assert.ok(typeof poi.type === 'string' && poi.type.length > 2, `${poi.id}: type absent`);
      assert.ok(typeof poi.label === 'string' && poi.label.length > 3, `${poi.id}: libellé absent`);
      assert.ok(
        typeof poi.interactionType === 'string' && poi.interactionType.length > 2,
        `${poi.id}: interaction absente`,
      );
      assert.ok(
        Number.isFinite(poi.interactionRadius) && poi.interactionRadius >= 3 && poi.interactionRadius <= 30,
        `${poi.id}: rayon d'interaction hors limites`,
      );
      assert.ok(radiusFromCenter >= 12 && radiusFromCenter <= 300, `${poi.id}: POI mal placé`);
      poiTypes.add(poi.type);

      for (let previous = 0; previous < index; previous += 1) {
        assert.ok(
          distance2d(poi.position, pointsOfInterest[previous].position) >= 12,
          `${biomeId}: POI ${poi.id} trop proche de ${pointsOfInterest[previous].id}`,
        );
      }
    });

    assert.ok(poiTypes.size >= 3, `${biomeId}: les POI doivent proposer trois fonctions visuelles distinctes`);
  }
});

test('toutes les textures déclarées par les décors existent en WebP et chaque biome en combine plusieurs', () => {
  for (const biomeId of BIOME_IDS) {
    const references = collectTextureReferences(getBiomePropPlan(biomeId));
    assert.ok(references.size >= 2, `${biomeId}: moins de deux familles de matière`);

    for (const reference of references) {
      assert.equal(extname(reference), '.webp', `${biomeId}: texture non WebP ${reference}`);
      assert.ok(
        existsSync(join(ROOT, 'public', reference.slice(1))),
        `${biomeId}: texture manquante ${reference}`,
      );
    }
  }
});

test('le constructeur Environment reste paresseux jusqu à un setBiome explicite', () => {
  const scene = new THREE.Scene();
  const environment = new Environment(scene);
  const snapshot = environment.getLevelDesignSnapshot();

  assert.equal(environment.currentBiome, 'jungle');
  assert.equal(environment.biomeGroup.children.length, 0);
  assert.equal(environment.propRoot, null);
  assert.deepEqual(environment.environmentProps, []);
  assert.deepEqual(environment.treePerches, []);
  assert.deepEqual(environment.obstacleColliders, []);
  assert.deepEqual(environment.staticInstanceBatches, []);
  assert.equal(environment.textureCache.size, 0);
  assert.equal(snapshot.totalDrawCallEstimate, 0);
  assert.equal(snapshot.totalTriangleEstimate, 0);
  assert.equal(snapshot.totalMeshInstanceCount, 0);

  assert.equal(environment.setBiome('jungle'), true);
  assert.ok(environment.biomeGroup.children.length > 0);
  assert.equal(environment.propRoot.parent, environment.biomeGroup);
  assert.ok(environment.textureCache.size > 0);
  environment.dispose();
});

test('Environment matérialise les plans, expose un snapshot budgété et reconstruit sans dérive', () => {
  const scene = new THREE.Scene();
  const environment = new Environment(scene);
  const signatures = new Map();

  for (const biomeId of BIOME_IDS) {
    environment.setBiome(biomeId);
    const snapshot = environment.getLevelDesignSnapshot();
    const plan = getBiomePropPlan(biomeId);

    assert.equal(snapshot.biomeId, biomeId);
    assert.equal(environment.propRoot.parent, environment.biomeGroup);
    assert.equal(snapshot.propCount, environment.environmentProps.length);
    assert.equal(snapshot.pointOfInterestCount, environment.pointsOfInterest.length);
    assert.equal(snapshot.hazardCount, environment.hazardZones.length);
    assert.equal(snapshot.pointOfInterestCount, plan.pointsOfInterest.length);
    assert.equal(snapshot.hazardCount, plan.hazardZones.length);
    assert.ok(snapshot.propCount >= plan.props.length);
    assert.ok(snapshot.propCount <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxProps);
    assert.ok(snapshot.pointOfInterestCount <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxPoi);
    assert.ok(snapshot.hazardCount <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxHazards);
    assert.ok(snapshot.colliderCount <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxColliders);
    assert.ok(snapshot.drawCallEstimate <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxDrawCalls);
    assert.ok(snapshot.triangleEstimate <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxTriangles);
    assert.equal(snapshot.propDrawCallEstimate, snapshot.drawCallEstimate);
    assert.equal(snapshot.propTriangleEstimate, snapshot.triangleEstimate);
    assert.ok(snapshot.totalDrawCallEstimate >= snapshot.propDrawCallEstimate);
    assert.ok(snapshot.totalTriangleEstimate >= snapshot.propTriangleEstimate);
    assert.ok(Number.isInteger(snapshot.shadowCasterCount));
    for (const key of [
      'colliderCount', 'projectileOnlyColliderCount', 'colliderPartCount',
      'staticInstanceBatchCount', 'staticInstanceCount',
      'drawCallEstimate', 'triangleEstimate', 'totalDrawCallEstimate',
      'totalTriangleEstimate', 'shadowCasterCount', 'totalMeshInstanceCount',
      'totalInstancedBatchCount', 'totalInstancedInstanceCount',
    ]) {
      assert.ok(Number.isFinite(snapshot[key]) && snapshot[key] >= 0, `${biomeId}: métrique ${key} invalide`);
    }

    signatures.set(biomeId, propLayoutSignature(environment));
  }

  for (const biomeId of BIOME_IDS) {
    environment.setBiome(biomeId);
    assert.deepEqual(
      propLayoutSignature(environment),
      signatures.get(biomeId),
      `${biomeId}: dérive de placement après reconstruction`,
    );
  }

  environment.dispose();
});

test('les décors statiques historiques sont instanciés sans perdre perches, collisions ou ombres', () => {
  const environment = new Environment(new THREE.Scene());
  const cases = [
    {
      biomeId: 'jungle',
      batches: [
        { name: 'legacy-jungle-tree-trunks', count: 45, verticalOffset: 18, texturePath: '/assets/textures/jungle-bark.webp' },
        { name: 'legacy-jungle-tree-crowns', count: 45, verticalOffset: 36, texturePath: null },
      ],
      colliderPrefix: 'jungle-tree-',
      colliderCount: 45,
      perchCount: 59,
      perchOffset: 36,
    },
    {
      biomeId: 'hive_lv426',
      batches: [
        { name: 'legacy-hive-resin-pillars', count: 30, verticalOffset: 20, texturePath: '/assets/textures/hive-resin.webp' },
      ],
      colliderPrefix: 'hive-resin-pillar-',
      colliderCount: 30,
      perchCount: 30,
      perchOffset: 40,
    },
    {
      biomeId: 'yautja_prime',
      batches: [
        { name: 'legacy-prime-arena-pillars', count: 20, verticalOffset: 25, texturePath: '/assets/textures/yautja-stone.webp' },
      ],
      colliderPrefix: 'prime-arena-pillar-',
      colliderCount: 20,
      perchCount: 21,
      perchOffset: 50,
    },
  ];
  const matrix = new THREE.Matrix4();
  const instancePosition = new THREE.Vector3();

  for (const contract of cases) {
    environment.setBiome(contract.biomeId);
    assert.deepEqual(
      environment.staticInstanceBatches.map(({ name }) => name),
      contract.batches.map(({ name }) => name),
    );
    assert.equal(environment.treePerches.length, contract.perchCount);
    const legacyColliders = environment.obstacleColliders.filter(({ sourceId = '' }) => (
      sourceId.startsWith(contract.colliderPrefix)
    ));
    assert.equal(legacyColliders.length, contract.colliderCount);

    contract.batches.forEach((batchContract) => {
      const batch = environment.biomeGroup.getObjectByName(batchContract.name);
      assert.ok(batch?.isInstancedMesh, `${batchContract.name}: lot non instancié`);
      assert.equal(batch.count, batchContract.count);
      assert.equal(batch.castShadow, true);
      assert.equal(batch.userData.staticEnvironmentBatch, true);
      assert.equal(batch.userData.texturePath, batchContract.texturePath);
      for (let index = 0; index < batch.count; index += 1) {
        batch.getMatrixAt(index, matrix);
        instancePosition.setFromMatrixPosition(matrix);
        const collider = environment.obstacleColliders.find(({ sourceId }) => (
          sourceId === `${contract.colliderPrefix}${index + 1}`
        ));
        assert.ok(collider, `${batchContract.name}: collider ${index + 1} absent`);
        assert.ok(Math.abs(instancePosition.x - collider.x) < 0.0001);
        assert.ok(Math.abs(instancePosition.z - collider.z) < 0.0001);
        assert.ok(Math.abs(instancePosition.y - collider.baseY - batchContract.verticalOffset) < 0.0001);
        assert.ok(environment.treePerches.some((perch) => (
          Math.abs(perch.x - collider.x) < 0.000001
            && Math.abs(perch.z - collider.z) < 0.000001
            && Math.abs(perch.y - collider.baseY - contract.perchOffset) < 0.000001
        )));
      }
    });

    const snapshot = environment.getLevelDesignSnapshot();
    assert.equal(snapshot.staticInstanceBatchCount, contract.batches.length);
    assert.equal(snapshot.staticInstanceCount, contract.batches.reduce((total, batch) => total + batch.count, 0));
    assert.ok(snapshot.totalInstancedInstanceCount >= snapshot.staticInstanceCount);
    assert.ok(snapshot.totalMeshInstanceCount >= snapshot.staticInstanceCount);
    assert.ok(snapshot.shadowCasterCount >= snapshot.staticInstanceCount);
    assert.ok(
      snapshot.totalDrawCallEstimate
        < snapshot.propDrawCallEstimate + snapshot.staticInstanceCount
          + snapshot.navigationDrawCallEstimate,
      `${contract.biomeId}: les instances statiques ne doivent pas redevenir un draw call chacune`,
    );
  }

  environment.dispose();
});

test('props, POI, dangers et placements legacy restent ancrés au terrain sans chevauchement majeur', () => {
  const environment = new Environment(new THREE.Scene());

  for (const biomeId of BIOME_IDS) {
    environment.setBiome(biomeId);
    const anchoredEntries = [
      ...environment.environmentProps.map((prop) => ({
        id: prop.id,
        x: prop.position[0],
        z: prop.position[2],
        runtimeY: prop.position[1],
        visualY: prop.mesh.position.y,
      })),
      ...environment.pointsOfInterest.map((poi) => ({
        id: poi.id,
        x: poi.position.x,
        z: poi.position.z,
        runtimeY: poi.position.y,
        visualY: poi.mesh.position.y,
      })),
      ...environment.hazardZones.map((hazard) => ({
        id: hazard.id,
        x: hazard.position.x,
        z: hazard.position.z,
        runtimeY: hazard.position.y,
        visualY: hazard.mesh.position.y,
      })),
    ];
    anchoredEntries.forEach((entry) => {
      const terrainY = environment.sampleHeight(entry.x, entry.z);
      assert.ok(Math.abs(entry.runtimeY - terrainY) < 0.000001, `${entry.id}: runtime hors terrain`);
      assert.ok(Math.abs(entry.visualY - terrainY) < 0.000001, `${entry.id}: visuel hors terrain`);
    });

    const propIds = new Set(getBiomePropPlan(biomeId).props.map(({ id }) => id));
    const legacyColliders = environment.obstacleColliders.filter(({ sourceId }) => !propIds.has(sourceId));
    for (const legacy of legacyColliders) {
      for (const footprint of environment.getPropFootprints()) {
        const separation = Math.hypot(legacy.x - footprint.x, legacy.z - footprint.z)
          - legacy.radius - footprint.radius;
        assert.ok(
          separation >= 3 - 0.000001,
          `${biomeId}: ${legacy.sourceId ?? legacy.type} chevauche ${footprint.id} (${separation.toFixed(2)} m)`,
        );
      }
    }
  }

  environment.dispose();
});

test('la recherche et l interaction de POI utilisent la distance monde et refusent le hors-portée', () => {
  const environment = new Environment(new THREE.Scene());

  for (const biomeId of BIOME_IDS) {
    environment.setBiome(biomeId);
    const pointOfInterest = environment.pointsOfInterest[0];
    const poiId = getPoiId(pointOfInterest);
    const position = getPoiPosition(pointOfInterest);
    assert.ok(poiId, `${biomeId}: POI runtime sans id`);
    assert.ok(position, `${biomeId}: POI runtime sans position`);

    const nearby = environment.getNearbyPointOfInterest(position);
    assert.equal(getPoiId(nearby), poiId, `${biomeId}: POI proche non détecté`);

    const result = environment.interactWithPointOfInterest(position);
    assert.ok(result && typeof result === 'object', `${biomeId}: interaction POI sans résultat`);
    assert.equal(result.poiId, poiId);
    assert.ok(typeof result.type === 'string' && result.type.length > 2);
    assert.equal(environment.getNearbyPointOfInterest(position), null, `${biomeId}: POI déjà analysé encore proposé`);
    assert.equal(environment.interactWithPointOfInterest(position), false);

    const outOfRange = new THREE.Vector3(5000, 0, 5000);
    assert.equal(environment.getNearbyPointOfInterest(outOfRange), null);
    assert.equal(environment.interactWithPointOfInterest(outOfRange), false);
  }

  environment.dispose();
});

test('les sockets de rencontre et spawns sûrs sont déterministes, au sol et dans la limite circulaire', () => {
  const environment = new Environment(new THREE.Scene());

  for (const biomeId of BIOME_IDS) {
    environment.setBiome(biomeId);
    const first = environment.getEncounterSockets(biomeId === 'hive_lv426' ? 'egg' : 'reinforcement', 4);
    const second = environment.getEncounterSockets(biomeId === 'hive_lv426' ? 'egg' : 'reinforcement', 4);
    assert.equal(first.length, 4);
    assert.deepEqual(first.map((position) => position.toArray()), second.map((position) => position.toArray()));
    first.forEach((position) => {
      assert.ok(Math.hypot(position.x, position.z) <= environment.playableRadius, `${biomeId}: socket hors limite`);
      assert.ok(environment.isSpawnPositionClear(position, 0), `${biomeId}: socket dans un obstacle`);
      assert.ok(Math.abs(position.y - environment.sampleHeight(position)) < 0.000001, `${biomeId}: socket hors sol`);
    });
    assert.ok(first.some((position) => Math.hypot(position.x, position.z) > 300), `${biomeId}: aucun socket extérieur`);
  }

  const perched = new THREE.Vector3(900, 44, 900);
  environment.constrainToPlayableArea(perched);
  assert.ok(Math.hypot(perched.x, perched.z) <= environment.playableRadius);
  assert.equal(perched.y, 44, 'la limite circulaire ne doit pas casser une perche');
  environment.constrainToPlayableArea(perched, 0, { snapToGround: true });
  assert.equal(perched.y, environment.sampleHeight(perched));
  environment.dispose();
});

test('les colliders de décor interceptent les segments projectile sans bloquer un tir au-dessus', () => {
  const environment = new Environment(new THREE.Scene());
  environment.setBiome('jungle');
  const cover = environment.obstacleColliders.find(({ type }) => type === 'environment_prop');
  assert.ok(cover?.sourceId);
  const ground = environment.sampleHeight(cover.x, cover.z);
  const shotHeight = ground + cover.height * 0.45;
  const start = new THREE.Vector3(cover.x - cover.radius * 2.5, shotHeight, cover.z);
  const end = new THREE.Vector3(cover.x + cover.radius * 2.5, shotHeight, cover.z);
  const impact = environment.resolveProjectileCoverImpact(start, end, 0.3);
  assert.ok(impact?.point?.isVector3);
  assert.equal(impact.sourceId, cover.sourceId);
  assert.equal(environment.isProjectilePathBlocked(start, end, 0.3), true);

  const overhead = ground + cover.height + cover.radius * 3;
  assert.equal(
    environment.isProjectilePathBlocked(
      new THREE.Vector3(start.x, overhead, start.z),
      new THREE.Vector3(end.x, overhead, end.z),
      0.3,
    ),
    false,
  );
  environment.dispose();
});
test('arches traversables et volumes finis autorisent perches et tirs au-dessus de l autel', () => {
  const environment = new Environment(new THREE.Scene());
  environment.setBiome('jungle');

  const gate = environment.environmentProps.find(({ id }) => id === 'jungle-west-ritual-gate');
  assert.deepEqual(gate.colliderParts.map(({ part }) => part), ['left_support', 'right_support']);
  const forward = new THREE.Vector3(Math.sin(gate.rotation), 0, Math.cos(gate.rotation));
  const gateCenter = new THREE.Vector3(gate.position[0], gate.position[1] + 3, gate.position[2]);
  assert.equal(
    environment.resolveProjectileCoverImpact(
      gateCenter.clone().addScaledVector(forward, -10),
      gateCenter.clone().addScaledVector(forward, 10),
      0.3,
    ),
    null,
    'l ouverture centrale de l arche doit rester traversable',
  );

  const support = gate.colliderParts.find(({ part }) => part === 'left_support');
  const supportCenter = new THREE.Vector3(support.x, support.baseY + 3, support.z);
  const supportImpact = environment.resolveProjectileCoverImpact(
    supportCenter.clone().addScaledVector(forward, -6),
    supportCenter.clone().addScaledVector(forward, 6),
    0.3,
  );
  assert.equal(supportImpact?.sourceId, gate.id);
  assert.equal(supportImpact?.collider?.part, 'left_support');

  const altar = environment.obstacleColliders.find(({ sourceId }) => sourceId === 'jungle-ancient-altar');
  const lowStart = new THREE.Vector3(altar.x - 25, altar.baseY + 2, altar.z);
  const lowEnd = new THREE.Vector3(altar.x + 25, altar.baseY + 2, altar.z);
  assert.equal(environment.resolveProjectileCoverImpact(lowStart, lowEnd, 0.3)?.sourceId, altar.sourceId);
  const highStart = new THREE.Vector3(altar.x - 25, altar.baseY + 26, altar.z);
  const highEnd = new THREE.Vector3(altar.x + 25, altar.baseY + 26, altar.z);
  assert.notEqual(environment.resolveProjectileCoverImpact(highStart, highEnd, 0.3)?.sourceId, altar.sourceId);

  const perchTree = environment.obstacleColliders.find(({ sourceId }) => sourceId === 'jungle-tree-1');
  const perchStart = new THREE.Vector3(perchTree.x, perchTree.baseY + 36, perchTree.z);
  const exitDirection = new THREE.Vector3(perchTree.x, 0, perchTree.z).normalize();
  const perchExit = perchStart.clone().addScaledVector(exitDirection, 20);
  assert.notEqual(
    environment.resolveProjectileCoverImpact(perchStart, perchExit, 0.3)?.sourceId,
    perchTree.sourceId,
    'un projectile créé dans la perche doit pouvoir quitter son volume source',
  );

  const facility = environment.environmentProps.find(({ id }) => id === 'jungle-east-command-camp');
  const cover = environment.environmentProps.find(({ id }) => id === 'jungle-west-cover');
  assert.deepEqual(facility.colliderParts.map(({ part }) => part), ['core', 'west_module', 'east_module']);
  assert.deepEqual(cover.colliderParts.map(({ part }) => part), ['cover_left', 'cover_center', 'cover_right']);
  environment.dispose();
});

test('les volumes de cover_cluster suivent chaque wedge rendu sans collision fantôme', () => {
  const environment = new Environment(new THREE.Scene());
  const instanceMatrix = new THREE.Matrix4();
  const worldMatrix = new THREE.Matrix4();

  for (const biomeId of ['jungle', 'yautja_prime']) {
    environment.setBiome(biomeId);
    const covers = environment.environmentProps.filter(({ type }) => type === 'cover_cluster');
    assert.ok(covers.length > 0, `${biomeId}: aucune couverture à contrôler`);

    for (const cover of covers) {
      cover.mesh.updateWorldMatrix(true, true);
      const wedges = cover.mesh.getObjectByName(`${cover.id}-wedge-cover`);
      assert.ok(wedges?.isInstancedMesh, `${cover.id}: wedges instanciés absents`);
      const centers = Array.from({ length: wedges.count }, (_, index) => {
        wedges.getMatrixAt(index, instanceMatrix);
        worldMatrix.multiplyMatrices(wedges.matrixWorld, instanceMatrix);
        return new THREE.Vector3().setFromMatrixPosition(worldMatrix);
      });

      centers.forEach((center, index) => {
        assert.ok(cover.colliderParts.some((collider) => (
          Math.hypot(center.x - collider.x, center.z - collider.z) <= collider.radius + 0.000001
            && center.y >= collider.baseY - 0.000001
            && center.y <= collider.baseY + collider.height + 0.000001
        )), `${cover.id}: wedge ${index + 1} hors des volumes de couverture`);
      });

      const anchorIndices = [0, Math.floor((centers.length - 1) / 2), centers.length - 1];
      cover.colliderParts.forEach((collider, index) => {
        const anchor = centers[anchorIndices[index]];
        assert.ok(Math.abs(collider.x - anchor.x) < 0.000001, `${cover.id}: ancre X ${collider.part} décalée`);
        assert.ok(Math.abs(collider.z - anchor.z) < 0.000001, `${cover.id}: ancre Z ${collider.part} décalée`);
      });
    }

    assert.ok(environment.obstacleColliders.length <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxColliders);
  }

  environment.dispose();
});

test('cuve haute, sanctuaire et enclos séparent couverture projectile et collision acteur', () => {
  const environment = new Environment(new THREE.Scene());
  environment.setBiome('ryushi_desert');
  const tower = environment.environmentProps.find(({ id }) => id === 'ryushi-west-water-tower');
  const tank = tower.colliderParts.find(({ part }) => part === 'tank');
  assert.equal(tank.blocksActors, false);
  assert.equal(environment.obstacleColliders.includes(tank), false);
  assert.equal(environment.projectileCoverColliders.includes(tank), true);
  assert.equal(
    environment.resolveProjectileCoverImpact(
      new THREE.Vector3(tank.x - 12, tank.baseY + 4, tank.z),
      new THREE.Vector3(tank.x + 12, tank.baseY + 4, tank.z),
      0.3,
    )?.collider?.part,
    'tank',
  );

  const pen = environment.environmentProps.find(({ id }) => id === 'ryushi-east-stock-pen');
  assert.equal(pen.colliderParts.length, 4);
  assert.ok(pen.colliderParts.every((part) => (
    Math.hypot(part.x - pen.position[0], part.z - pen.position[2]) - part.radius > 2.5
  )), 'le centre de l enclos doit rester libre');
  assert.ok(environment.obstacleColliders.length <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxColliders);

  environment.setBiome('yautja_prime');
  const shrine = environment.environmentProps.find(({ id }) => id === 'prime-west-weapon-shrine');
  const focus = shrine.colliderParts.find(({ part }) => part === 'focus');
  assert.equal(focus.blocksActors, false);
  assert.equal(environment.obstacleColliders.includes(focus), false);
  assert.equal(environment.projectileCoverColliders.includes(focus), true);
  assert.equal(
    environment.resolveProjectileCoverImpact(
      new THREE.Vector3(focus.x - 8, focus.baseY + 5, focus.z),
      new THREE.Vector3(focus.x + 8, focus.baseY + 5, focus.z),
      0.3,
    )?.collider?.part,
    'focus',
  );
  assert.ok(environment.obstacleColliders.length <= ENVIRONMENT_PERFORMANCE_BUDGETS.maxColliders);
  environment.dispose();
});


test('les dangers et la météo sont pilotés par le delta et restent synchronisés aux événements', () => {
  const environment = new Environment(new THREE.Scene());
  environment.setBiome('hive_lv426');
  assert.equal(environment.rainParticles, null, 'aucune pluie visuelle hors événement');
  assert.equal(environment.sunSphere.visible, false, 'aucun soleil dans la ruche souterraine');
  assert.equal(environment.setWeatherEvent('rain'), true);
  assert.ok(environment.rainParticles?.isPoints);
  assert.equal(environment.acidRainActive, true);
  const rainPositions = Array.from(environment.rainParticles.geometry.attributes.position.array);
  const rainRotation = environment.rainParticles.rotation.y;
  const rainOpacity = environment.rainParticles.material.opacity;
  environment.setReducedMotion(true);
  assert.equal(environment.particles.visible, false, 'les particules ambiantes restent masquées');
  assert.equal(environment.rainParticles.visible, true, 'le danger météo doit rester lisible');
  assert.ok(environment.rainParticles.material.opacity > 0);
  assert.ok(environment.rainParticles.material.opacity < rainOpacity);
  environment.update(0.75, 'normal');
  assert.equal(environment.rainParticles.rotation.y, rainRotation);
  assert.deepEqual(
    Array.from(environment.rainParticles.geometry.attributes.position.array),
    rainPositions,
    'la pluie visible doit rester figée en mouvements réduits',
  );
  environment.setReducedMotion(false);
  assert.equal(environment.rainParticles.visible, true);
  assert.equal(environment.rainParticles.material.opacity, rainOpacity);

  const hazard = environment.hazardZones[0];
  assert.ok(hazard.pulseRoot?.isObject3D);
  assert.ok(hazard.boundaryRing?.isObject3D);
  const boundaryScale = hazard.boundaryRing.scale.toArray();
  const hazardRootScale = hazard.mesh.scale.toArray();
  const player = { position: hazard.position.clone() };
  const first = environment.update(0, 'normal', { player });
  const coolingDown = environment.update(0.1, 'normal', { player });
  const next = environment.update(hazard.interval, 'normal', { player });
  assert.equal(first.length, 1);
  assert.equal(first[0].hazardId, hazard.id);
  assert.equal(coolingDown.length, 0);
  assert.equal(next.length, 1);
  assert.deepEqual(hazard.boundaryRing.scale.toArray(), boundaryScale, 'l anneau gameplay ne doit jamais pulser');
  assert.deepEqual(hazard.mesh.scale.toArray(), hazardRootScale, 'la racine du danger garde son échelle logique');
  assert.notDeepEqual(hazard.pulseRoot.scale.toArray(), [1, 1, 1]);
  assert.deepEqual(environment.drainHazardSignals().map(({ hazardId }) => hazardId), [hazard.id, hazard.id]);
  assert.deepEqual(environment.drainHazardSignals(), []);

  assert.equal(environment.setWeatherEvent(null), true);
  assert.equal(environment.rainParticles, null);
  environment.setBiome('ryushi_desert');
  environment.setWeatherEvent('thermal_storm');
  assert.ok(environment.sandParticles?.isPoints);
  assert.equal(environment.sandstormActive, true);
  const sandOpacity = environment.sandParticles.material.opacity;
  environment.setReducedMotion(true);
  assert.equal(environment.sandParticles.visible, true);
  assert.ok(environment.sandParticles.material.opacity < sandOpacity);
  environment.setReducedMotion(false);
  assert.equal(environment.sandParticles.material.opacity, sandOpacity);
  environment.dispose();
});

test('dispose libère une seule fois props, lumières et textures puis devient idempotent', () => {
  const scene = new THREE.Scene();
  const environment = new Environment(scene);
  environment.setBiome('hive_lv426');

  const trackedSceneObjects = [
    environment.biomeGroup,
    environment.ambientLight,
    environment.mainLight,
    environment.sunSphere,
  ];
  const geometryCounts = new Map();
  const materialCounts = new Map();
  environment.biomeGroup.traverse((object) => {
    if (object.geometry && !geometryCounts.has(object.geometry)) {
      geometryCounts.set(object.geometry, 0);
      object.geometry.dispose = () => geometryCounts.set(object.geometry, geometryCounts.get(object.geometry) + 1);
    }
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.filter(Boolean).forEach((material) => {
      if (!materialCounts.has(material)) {
        materialCounts.set(material, 0);
        material.dispose = () => materialCounts.set(material, materialCounts.get(material) + 1);
      }
    });
  });
  let textureDisposals = 0;
  environment.textureCache.set('v16-dispose-probe', {
    dispose() { textureDisposals += 1; },
  });

  assert.equal(environment.dispose(), true);
  assert.equal(environment.dispose(), false);
  trackedSceneObjects.forEach((object) => assert.equal(scene.children.includes(object), false));
  assert.ok([...geometryCounts.values()].every((count) => count === 1), 'géométrie disposée plus ou moins d une fois');
  assert.ok([...materialCounts.values()].every((count) => count === 1), 'matériau disposé plus ou moins d une fois');
  assert.equal(textureDisposals, 1);
  assert.equal(environment.textureCache.size, 0);
  assert.deepEqual(environment.environmentProps, []);
  assert.deepEqual(environment.pointsOfInterest, []);
  assert.deepEqual(environment.hazardZones, []);
  assert.equal(environment.propRoot, null);
});
