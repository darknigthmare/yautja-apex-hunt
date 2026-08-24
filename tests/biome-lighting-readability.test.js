import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { Environment } from '../src/world/Environment.js';

const BIOMES = [
  'jungle',
  'hive_lv426',
  'ryushi_desert',
  'yautja_prime',
  'genna_deathworld',
];

test('each hunt biome applies a readable three-point lighting contract', () => {
  const scene = new THREE.Scene();
  const environment = new Environment(scene);

  assert.equal(environment.ambientLight.name, 'hunt-readability-ambient-light');
  assert.equal(environment.hemisphereLight.name, 'hunt-biome-hemisphere-fill');
  assert.equal(environment.mainLight.name, 'hunt-forward-key-light');
  assert.ok(environment.mainLight.position.z > 0, 'the key light must illuminate the camera-facing side');

  for (const biome of BIOMES) {
    assert.equal(environment.setBiome(biome), true);
    assert.ok(environment.ambientLight.intensity >= 1.1, `${biome} ambient fill is too low`);
    assert.ok(environment.hemisphereLight.intensity >= 1, `${biome} hemisphere fill is too low`);
    assert.ok(environment.mainLight.intensity >= 1.75, `${biome} key light is too low`);
    assert.ok(scene.fog?.isFogExp2, `${biome} must keep atmospheric fog`);
    assert.ok(scene.fog.density <= 0.0062, `${biome} fog obscures gameplay routes too early`);
  }

  environment.dispose();
});

test('hunt readability lights follow environment visibility and are disposed', () => {
  const scene = new THREE.Scene();
  const environment = new Environment(scene);
  environment.setBiome('jungle');

  environment.setVisible(false);
  assert.equal(environment.ambientLight.visible, false);
  assert.equal(environment.hemisphereLight.visible, false);
  assert.equal(environment.mainLight.visible, false);

  environment.setVisible(true);
  assert.equal(environment.ambientLight.visible, true);
  assert.equal(environment.hemisphereLight.visible, true);
  assert.equal(environment.mainLight.visible, true);

  const lights = [environment.ambientLight, environment.hemisphereLight, environment.mainLight];
  environment.dispose();
  lights.forEach((light) => assert.equal(scene.children.includes(light), false));
});
