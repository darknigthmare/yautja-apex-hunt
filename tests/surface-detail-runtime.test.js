import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { applySurfaceDetail, disposeSurfaceDetailCache, getSurfaceDetailStats } from '../src/utils/surfaceDetail.js';

test('surface response is generated without DOM and preserves authored material/customisation', () => {
  const material = new THREE.MeshStandardMaterial({ color: 0x8a4231, roughness: 0.63, metalness: 0.72 });
  const colour = material.color.clone();
  applySurfaceDetail(material, { kind: 'metal', repeat: [4, 2], normalStrength: 0.4 });
  assert.ok(material.color.equals(colour));
  assert.equal(material.roughness, 0.63);
  assert.equal(material.metalness, 0.72);
  assert.ok(material.normalMap.isDataTexture && material.roughnessMap.isDataTexture);
  assert.equal(material.normalMap.colorSpace, THREE.NoColorSpace);
  assert.equal(material.roughnessMap.colorSpace, THREE.NoColorSpace);
  assert.deepEqual(material.normalMap.repeat.toArray(), [4, 2]);
  assert.equal(material.normalMap.userData.sessionShared, true);
  const other = applySurfaceDetail(new THREE.MeshStandardMaterial({ color: 0x123abc }), { kind: 'metal', repeat: [4, 2], normalStrength: 0.9 });
  assert.equal(other.normalMap, material.normalMap, 'normal strength belongs to the material, not another texture allocation');
  assert.equal(other.roughnessMap, material.roughnessMap);
  assert.equal(other.normalScale.x, 0.9);
  material.dispose();
  other.dispose();
});

test('every procedural profile contains valid non-flat normals and bounded roughness', () => {
  for (const kind of ['metal', 'skin', 'stone', 'soil', 'sand', 'resin', 'fabric', 'bone', 'foliage', 'ice', 'wood']) {
    const material = applySurfaceDetail(new THREE.MeshStandardMaterial(), { kind });
    const normal = material.normalMap.image.data;
    let detail = 0;
    for (let offset = 0; offset < normal.length; offset += 4) {
      const x = normal[offset] / 255 * 2 - 1;
      const y = normal[offset + 1] / 255 * 2 - 1;
      const z = normal[offset + 2] / 255 * 2 - 1;
      assert.ok(Math.abs(Math.hypot(x, y, z) - 1) < 0.014, `${kind}: invalid tangent-space normal`);
      assert.ok(z > 0, `${kind}: the height surface must not fold normals backwards`);
      detail += Math.abs(x) + Math.abs(y);
    }
    assert.ok(detail > 100, `${kind}: the detail texture must produce actual surface response`);
    const roughness = material.roughnessMap.image.data;
    for (let offset = 0; offset < roughness.length; offset += 4) {
      assert.ok(roughness[offset + 1] >= 165 && roughness[offset + 1] <= 255);
    }
    material.dispose();
  }
  assert.ok(getSurfaceDetailStats().textureCount <= 24, 'profiles should share texture allocations');
  disposeSurfaceDetailCache();
  assert.equal(getSurfaceDetailStats().textureCount, 0);
});
