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

test('Genna matérialise un monde mortel texturé, vivant et praticable', () => {
  const scene = new THREE.Scene();
  const environment = new Environment(scene);

  environment.setBiome('genna_deathworld');

  assert.equal(environment.currentBiome, 'genna_deathworld');
  assert.equal(BIOME_DEFINITIONS.genna_deathworld.texture, '/assets/textures/genna-deathworld-ground.webp');
  assert.equal(BIOME_DEFINITIONS.genna_deathworld.floraTexture, DEATHWORLD_FLORA_TEXTURE_PATH);
  assert.equal(scene.background.getHex(), 0x08070d);
  assert.ok(scene.fog instanceof THREE.FogExp2);
  assert.equal(scene.fog.density, 0.0052);
  assert.equal(environment.deathworldFlora.length, 28);
  assert.equal(environment.treePerches.length, 28);
  assert.equal(environment.obstacleColliders.filter(({ type }) => type === 'hostile_flora').length, 28);
  assert.ok(environment.treePerches.every(({ y }) => y > 15));
  assert.ok(environment.obstacleColliders.every(({ radius }) => radius > 0));
  assert.ok(environment.particles?.isPoints);
  assert.ok(environment.deathworldCreatureMesh?.isInstancedMesh);
  assert.equal(environment.deathworldCreatureMesh.count, 14);
  assert.equal(environment.deathworldCreatures.length, 14);
  assert.equal(environment.deathworldCreatureMesh.userData.smallCreatures, true);
});

test('la vie de Genna avance au delta et respecte les mouvements réduits', () => {
  const environment = new Environment(new THREE.Scene());
  environment.setBiome('genna_deathworld');

  const flora = environment.deathworldFlora[0];
  const matrixBefore = readInstanceMatrix(environment.deathworldCreatureMesh);
  const floraBefore = flora.group.rotation.z;
  const particleRotationBefore = environment.particles.rotation.y;

  environment.update(0.75, 'normal');

  assert.equal(environment.deathworldAnimationTime, 0.75);
  assert.notDeepEqual(readInstanceMatrix(environment.deathworldCreatureMesh), matrixBefore);
  assert.notEqual(flora.group.rotation.z, floraBefore);
  assert.ok(environment.particles.rotation.y > particleRotationBefore);

  environment.setReducedMotion(true);
  assert.equal(environment.particles.visible, false);
  assert.equal(environment.deathworldCreatureMesh.visible, false);
  const frozenTime = environment.deathworldAnimationTime;
  const frozenFlora = flora.group.rotation.z;
  const frozenMatrix = readInstanceMatrix(environment.deathworldCreatureMesh);
  environment.update(2, 'normal');
  assert.equal(environment.deathworldAnimationTime, frozenTime);
  assert.equal(flora.group.rotation.z, frozenFlora);
  assert.deepEqual(readInstanceMatrix(environment.deathworldCreatureMesh), frozenMatrix);

  environment.setReducedMotion(false);
  assert.equal(environment.particles.visible, true);
  assert.equal(environment.deathworldCreatureMesh.visible, true);
});

test('le changement de biome nettoie les ressources et références de Genna une seule fois', () => {
  const environment = new Environment(new THREE.Scene());
  environment.setBiome('genna_deathworld');

  const swarm = environment.deathworldCreatureMesh;
  const firstPlant = environment.deathworldFlora[0].group;
  let geometryDisposals = 0;
  let materialDisposals = 0;
  swarm.geometry.dispose = () => { geometryDisposals += 1; };
  swarm.material.dispose = () => { materialDisposals += 1; };

  environment.clearBiome();

  assert.equal(geometryDisposals, 1);
  assert.equal(materialDisposals, 1);
  assert.equal(environment.biomeGroup.children.length, 0);
  assert.equal(environment.deathworldFlora.length, 0);
  assert.equal(environment.deathworldCreatures.length, 0);
  assert.equal(environment.deathworldCreatureMesh, null);
  assert.equal(environment.particles, null);
  assert.equal(swarm.parent, null);
  assert.equal(firstPlant.parent, null);

  assert.doesNotThrow(() => environment.clearBiome());
  assert.equal(geometryDisposals, 1);
  assert.equal(materialDisposals, 1);
});
