import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import {
  DEATHWORLD_FLORA_TEXTURE_PATH,
  Environment,
} from '../src/world/Environment.js';
import { BIOME_DEFINITIONS } from '../src/data/GameConfig.js';

function readInstanceMatrix(mesh, index = 0) {
  const matrix = new THREE.Matrix4();
  mesh.getMatrixAt(index, matrix);
  return matrix.elements.slice();
}

const EXPECTED_FLORA_BATCHES = Object.freeze([
  ['genna-flora-stalks-shadow', 7],
  ['genna-flora-stalks', 21],
  ['genna-flora-crowns', 28],
  ['genna-flora-throats', 28],
  ['genna-flora-tendrils', 84],
]);

test('Genna matérialise un monde mortel texturé, vivant et praticable', () => {
  const scene = new THREE.Scene();
  const environment = new Environment(scene);

  environment.setBiome('genna_deathworld');

  assert.equal(environment.currentBiome, 'genna_deathworld');
  assert.equal(BIOME_DEFINITIONS.genna_deathworld.texture, '/assets/textures/genna-deathworld-ground.webp');
  assert.equal(BIOME_DEFINITIONS.genna_deathworld.floraTexture, DEATHWORLD_FLORA_TEXTURE_PATH);
  assert.equal(scene.background.getHex(), 0x08070d);
  assert.ok(scene.fog instanceof THREE.FogExp2);
  assert.equal(scene.fog.density, 0.0044);
  assert.equal(environment.deathworldFlora.length, 28);
  assert.equal(new Set(environment.deathworldFlora.map(({ group }) => group)).size, 28);
  assert.ok(environment.deathworldFlora.every(({ group }, index) => (
    group.name === `genna-hostile-flora-${index + 1}`
    && group.parent === environment.biomeGroup
  )));
  assert.ok(environment.deathworldFlora.every(({ group, stalk, crown, throat, tendrils }) => {
    let renderedChildren = 0;
    group.traverse((object) => { if (object.isMesh) renderedChildren += 1; });
    return renderedChildren === 0
      && stalk.userData.instancedFloraController === true
      && crown.userData.instancedFloraController === true
      && throat.userData.instancedFloraController === true
      && tendrils.length === 3;
  }));
  assert.deepEqual(
    environment.deathworldFloraBatches.map(({ name, count }) => [name, count]),
    EXPECTED_FLORA_BATCHES,
  );
  assert.ok(environment.deathworldFloraBatches.every((batch) => (
    batch.isInstancedMesh
    && batch.instanceMatrix.usage === THREE.DynamicDrawUsage
    && batch.frustumCulled === false
  )));
  assert.equal(
    environment.deathworldFloraBatches.reduce((total, batch) => total + batch.count, 0),
    168,
  );
  assert.equal(
    environment.deathworldFloraBatches.reduce(
      (total, batch) => total + (batch.castShadow ? batch.count : 0),
      0,
    ),
    7,
  );
  assert.equal(environment.treePerches.length, 28);
  assert.equal(environment.obstacleColliders.filter(({ type }) => type === 'hostile_flora').length, 28);
  assert.ok(environment.treePerches.every(({ y }) => y > 15));
  assert.ok(environment.obstacleColliders.every(({ radius }) => radius > 0));
  assert.ok(environment.particles?.isPoints);
  assert.ok(environment.deathworldCreatureMesh?.isInstancedMesh);
  assert.equal(environment.deathworldCreatureMesh.count, 14);
  assert.equal(environment.deathworldCreatures.length, 14);
  assert.equal(environment.deathworldCreatureMesh.userData.smallCreatures, true);

  const snapshot = environment.getLevelDesignSnapshot();
  assert.equal(snapshot.deathworldFloraBatchCount, 5);
  assert.equal(snapshot.deathworldFloraInstanceCount, 168);
  assert.ok(snapshot.totalInstancedInstanceCount >= 168);
  assert.ok(snapshot.totalMeshInstanceCount >= 168);
  assert.ok(
    snapshot.totalDrawCallEstimate <= snapshot.propDrawCallEstimate + 10,
    'les 168 éléments de flore doivent rester contenus dans cinq appels instanciés',
  );
});

test('la vie de Genna avance au delta et respecte les mouvements réduits', () => {
  const environment = new Environment(new THREE.Scene());
  environment.setBiome('genna_deathworld');

  const flora = environment.deathworldFlora[0];
  const matrixBefore = readInstanceMatrix(environment.deathworldCreatureMesh);
  const floraMatricesBefore = environment.deathworldFloraBatches.map((batch) => readInstanceMatrix(batch));
  const floraBefore = flora.group.rotation.z;
  const particleRotationBefore = environment.particles.rotation.y;

  environment.update(0.75, 'normal');

  assert.equal(environment.deathworldAnimationTime, 0.75);
  assert.notDeepEqual(readInstanceMatrix(environment.deathworldCreatureMesh), matrixBefore);
  environment.deathworldFloraBatches.forEach((batch, index) => {
    assert.notDeepEqual(readInstanceMatrix(batch), floraMatricesBefore[index]);
  });
  assert.notEqual(flora.group.rotation.z, floraBefore);
  assert.ok(environment.particles.rotation.y > particleRotationBefore);

  environment.setReducedMotion(true);
  assert.equal(environment.particles.visible, false);
  assert.equal(environment.deathworldCreatureMesh.visible, false);
  const frozenTime = environment.deathworldAnimationTime;
  const frozenFlora = flora.group.rotation.z;
  const frozenMatrix = readInstanceMatrix(environment.deathworldCreatureMesh);
  const frozenFloraMatrices = environment.deathworldFloraBatches.map((batch) => readInstanceMatrix(batch));
  environment.update(2, 'normal');
  assert.equal(environment.deathworldAnimationTime, frozenTime);
  assert.equal(flora.group.rotation.z, frozenFlora);
  assert.deepEqual(readInstanceMatrix(environment.deathworldCreatureMesh), frozenMatrix);
  environment.deathworldFloraBatches.forEach((batch, index) => {
    assert.equal(batch.visible, true);
    assert.deepEqual(readInstanceMatrix(batch), frozenFloraMatrices[index]);
  });

  environment.setReducedMotion(false);
  assert.equal(environment.particles.visible, true);
  assert.equal(environment.deathworldCreatureMesh.visible, true);
});

test('le changement de biome nettoie les ressources et références de Genna une seule fois', () => {
  const environment = new Environment(new THREE.Scene());
  environment.setBiome('genna_deathworld');

  const swarm = environment.deathworldCreatureMesh;
  const firstPlant = environment.deathworldFlora[0].group;
  const floraBatches = [...environment.deathworldFloraBatches];
  const floraGeometries = new Set(floraBatches.map(({ geometry }) => geometry));
  const floraMaterials = new Set(floraBatches.map(({ material }) => material));
  let geometryDisposals = 0;
  let materialDisposals = 0;
  const floraGeometryDisposals = new Map();
  const floraMaterialDisposals = new Map();
  swarm.geometry.dispose = () => { geometryDisposals += 1; };
  swarm.material.dispose = () => { materialDisposals += 1; };
  floraGeometries.forEach((geometry) => {
    floraGeometryDisposals.set(geometry, 0);
    geometry.dispose = () => floraGeometryDisposals.set(geometry, floraGeometryDisposals.get(geometry) + 1);
  });
  floraMaterials.forEach((material) => {
    floraMaterialDisposals.set(material, 0);
    material.dispose = () => floraMaterialDisposals.set(material, floraMaterialDisposals.get(material) + 1);
  });

  environment.clearBiome();

  assert.equal(geometryDisposals, 1);
  assert.equal(materialDisposals, 1);
  assert.ok([...floraGeometryDisposals.values()].every((count) => count === 1));
  assert.ok([...floraMaterialDisposals.values()].every((count) => count === 1));
  assert.equal(environment.biomeGroup.children.length, 0);
  assert.equal(environment.deathworldFlora.length, 0);
  assert.equal(environment.deathworldCreatures.length, 0);
  assert.equal(environment.deathworldCreatureMesh, null);
  assert.equal(environment.particles, null);
  assert.equal(swarm.parent, null);
  assert.equal(firstPlant.parent, null);
  assert.ok(floraBatches.every(({ parent }) => parent === null));

  assert.doesNotThrow(() => environment.clearBiome());
  assert.equal(geometryDisposals, 1);
  assert.equal(materialDisposals, 1);
  assert.ok([...floraGeometryDisposals.values()].every((count) => count === 1));
  assert.ok([...floraMaterialDisposals.values()].every((count) => count === 1));
});
