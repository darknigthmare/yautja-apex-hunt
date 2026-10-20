import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import * as THREE from 'three';
import { loadHeroOrganicBody, resolveOrganicBodyBoneNames } from '../src/entities/HeroOrganicBody.js';

test('GLTFLoader joint-name sanitization preserves the authored skin-index order', () => {
  const names = ['joint:wrist_r', 'joint:pelvis', 'joint:elbow_l'];
  const bones = names.map(name => ({ name: THREE.PropertyBinding.sanitizeNodeName(name) }));
  assert.deepEqual(resolveOrganicBodyBoneNames(bones, { boneNames: names }), names);
  const parser = { associations: new Map([[bones[0], { nodes: 2 }]]),
    json: { nodes: [{}, {}, { name: 'joint:wrist_r' }] } };
  assert.deepEqual(resolveOrganicBodyBoneNames(bones, { boneNames: [...names].reverse() }, parser), names);
});

test('the shipped organic GLB has usable UVs, normalized joint weights and three embedded 2K bakes', () => {
  const file = readFileSync(new URL('../public/assets/models/hero-organic-body.glb', import.meta.url));
  assert.equal(file.toString('ascii', 0, 4), 'glTF');
  const jsonSize = file.readUInt32LE(12);
  const gltf = JSON.parse(file.subarray(20, 20 + jsonSize).toString('utf8'));
  const binary = file.subarray(28 + jsonSize);
  const primitive = gltf.meshes[0].primitives[0];
  const reader = accessorIndex => {
    const accessor = gltf.accessors[accessorIndex];
    const view = gltf.bufferViews[accessor.bufferView];
    const components = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[accessor.type];
    const bytes = { 5121: 1, 5123: 2, 5126: 4 }[accessor.componentType];
    return { count: accessor.count, get(index, component = 0) {
      const offset = (view.byteOffset || 0) + (accessor.byteOffset || 0)
        + index * (view.byteStride || components * bytes) + component * bytes;
      return bytes === 1 ? binary.readUInt8(offset) : bytes === 2 ? binary.readUInt16LE(offset) : binary.readFloatLE(offset);
    } };
  };
  const indices = reader(primitive.indices);
  const position = reader(primitive.attributes.POSITION);
  const uv = reader(primitive.attributes.TEXCOORD_0);
  const joints = reader(primitive.attributes.JOINTS_0);
  const weights = reader(primitive.attributes.WEIGHTS_0);
  assert.equal(indices.count / 3, 49998);
  assert.equal(gltf.skins[0].joints.length, 15);
  assert.equal(uv.count, position.count);
  assert.equal(weights.count, position.count);
  for (let index = 0; index < position.count; index++) {
    assert.ok([0, 1, 2].every(c => Number.isFinite(position.get(index, c))));
    assert.ok([0, 1].every(c => uv.get(index, c) >= 0 && uv.get(index, c) <= 1));
    let sum = 0;
    for (let c = 0; c < 4; c++) {
      const weight = weights.get(index, c);
      assert.ok(weight >= 0 && weight <= 1 && joints.get(index, c) < 15);
      sum += weight;
    }
    assert.ok(Math.abs(sum - 1) < 1e-5, `Unnormalized skin weight at vertex ${index}`);
  }
  for (let index = 0; index < indices.count; index++) assert.ok(indices.get(index) < position.count);
  assert.equal(gltf.images.length, 3);
  for (const image of gltf.images) {
    assert.equal(image.mimeType, 'image/png');
    const start = gltf.bufferViews[image.bufferView].byteOffset || 0;
    assert.equal(binary.readUInt32BE(start + 16), 2048);
    assert.equal(binary.readUInt32BE(start + 20), 2048);
  }
});

test('server-side hero construction does not start an asset request', async () => {
  assert.equal(await loadHeroOrganicBody(), null);
});
