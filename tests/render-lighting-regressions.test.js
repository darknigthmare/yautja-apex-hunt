import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { Environment } from '../src/world/Environment.js';

test('nearby shadows follow a hunter at the map edge, including reduced motion', () => {
  const scene = new THREE.Scene();
  const environment = new Environment(scene);
  environment.setBiome('gunnison_outbreak');
  environment.setReducedMotion(true);
  const player = { position: new THREE.Vector3(610, 8, -180) };
  environment.update(0, 'normal', { player });
  scene.updateMatrixWorld(true);
  environment.mainLight.shadow.updateMatrices(environment.mainLight);
  const shadowPosition = player.position.clone().project(environment.mainLight.shadow.camera);
  assert.ok(Math.abs(shadowPosition.x) < 0.01, 'hunter must remain in the centre of the detailed shadow map');
  assert.ok(Math.abs(shadowPosition.y) < 0.01);
  assert.ok(shadowPosition.z > -1 && shadowPosition.z < 1, 'hunter must be inside the shadow depth range');
  assert.ok(environment.mainLight.shadow.camera.right - environment.mainLight.shadow.camera.left < 250);
  const lightOffset = environment.mainLight.position.clone().sub(environment.mainLight.target.position);
  assert.deepEqual(lightOffset.toArray(), [-180, 280, 220]);
  const before = environment.mainLight.position.clone();
  environment.updateShadowFocus({ x: Number.NaN, y: 0, z: 0 });
  assert.ok(environment.mainLight.position.equals(before), 'bad coordinates must not poison the lighting');
  environment.dispose();
});

test('the atmospheric dome follows exploration, keeps horizon fog coherent and releases GPU resources', () => {
  const scene = new THREE.Scene();
  const environment = new Environment(scene);
  environment.setBiome('jungle');
  const sky = environment.biomeGroup.getObjectByName('hunt-atmospheric-sky');
  assert.ok(sky);
  let geometryReleased = false;
  let materialReleased = false;
  sky.geometry.addEventListener('dispose', () => { geometryReleased = true; });
  sky.material.addEventListener('dispose', () => { materialReleased = true; });
  const player = { position: new THREE.Vector3(-580, 12, 150) };
  environment.update(0, 'normal', { player });
  assert.ok(sky.position.equals(player.position), 'the dome must stay inside camera clipping range throughout the level');
  environment.setVisible(false);
  environment.setVisible(true);
  assert.ok(scene.fog.color.equals(sky.material.uniforms.horizon.value));
  environment.setBiome('ryushi_desert');
  assert.ok(geometryReleased && materialReleased, 'biome transitions must dispose the old sky');
  const lightTarget = environment.mainLight.target;
  environment.dispose();
  assert.equal(scene.children.includes(lightTarget), false);
});

test('weather remains around the hunter outside the original origin-centred cloud', () => {
  const environment = new Environment(new THREE.Scene());
  environment.setBiome('gunnison_outbreak');
  const player = { position: new THREE.Vector3(620, 14, -230) };
  environment.update(0, 'normal', { player });
  const rain = environment.rainParticles;
  rain.geometry.computeBoundingBox();
  assert.ok(rain.position.equals(player.position));
  const worldBounds = rain.geometry.boundingBox.clone().translate(rain.position);
  assert.ok(worldBounds.min.x < player.position.x && worldBounds.max.x > player.position.x);
  assert.ok(worldBounds.min.z < player.position.z && worldBounds.max.z > player.position.z);
  assert.equal(rain.material.depthWrite, false, 'transparent weather must not occlude later transparent effects');
  const sprite = rain.material.map;
  assert.equal(sprite.image.data[3], 0, 'particle corners should be transparent');
  assert.ok(sprite.image.data[((8 * 16) + 8) * 4 + 3] > 0, 'particle centre should remain visible');
  let disposed = false;
  sprite.addEventListener('dispose', () => { disposed = true; });
  environment.dispose();
  assert.ok(disposed, 'the shared particle texture must release on environment disposal');
});

test('authored terrain albedo retains its contrast instead of receiving a second dark tint', () => {
  const originalDocument = globalThis.document;
  const originalImage = globalThis.Image;
  const originalLoad = THREE.TextureLoader.prototype.load;
  // Provide an available image texture without needing browser networking.
  globalThis.document = {};
  globalThis.Image = class {};
  THREE.TextureLoader.prototype.load = () => new THREE.Texture();
  const environment = new Environment(new THREE.Scene());
  try {
    for (const biome of ['jungle', 'hive_lv426', 'gunnison_outbreak']) {
      environment.setBiome(biome);
      const ground = environment.biomeGroup.getObjectByName('hunt-terrain-surface');
      assert.ok(ground.material.map, `${biome}: an authored albedo must be present`);
      const tint = ground.material.color;
      assert.ok(Math.min(tint.r, tint.g, tint.b) >= 0.85,
        `${biome}: multiplying an already dark albedo by a dark colour destroys terrain detail`);
      assert.equal(ground.geometry.index.count / 3, 128 * 128 * 2, 'surface detail must not increase geometry cost');
      const colours = ground.geometry.attributes.color;
      for (const value of colours.array) {
        assert.ok(Number.isFinite(value) && value >= 0.72 && value <= 1, 'terrain variation must remain subtle and finite');
      }
    }
  } finally {
    environment.dispose();
    THREE.TextureLoader.prototype.load = originalLoad;
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
    if (originalImage === undefined) delete globalThis.Image;
    else globalThis.Image = originalImage;
  }
});
