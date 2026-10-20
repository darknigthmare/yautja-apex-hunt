import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createHeroMaterial, getHeroMaterialStats, disposeHeroMaterialCache } from '../src/utils/heroMaterials.js';

test('dedicated hero materials provide full-size colour/normal/ORM without changing palette properties', () => {
  const fingerprints = new Set();
  for (const region of ['skin', 'mask', 'armor', 'edgeMetal', 'leather', 'bone', 'dread', 'rubber']) {
    const material = createHeroMaterial(region, { color: 0x5c6042, roughness: 0.68, metalness: 0.22 });
    assert.ok(material.isMeshPhysicalMaterial);
    assert.equal(material.color.getHex(), 0x5c6042);
    assert.equal(material.roughness, 0.68);
    assert.equal(material.metalness, 0.22);
    assert.equal(material.transmission, 0);
    for (const map of [material.map, material.normalMap, material.roughnessMap]) {
      assert.ok(map.isDataTexture && map.image.width >= 512 && map.image.height >= 512);
      assert.equal(map.userData.sessionShared, true);
      assert.equal(map.minFilter, THREE.LinearMipmapLinearFilter);
    }
    assert.equal(material.map.colorSpace, THREE.SRGBColorSpace);
    assert.equal(material.normalMap.colorSpace, THREE.NoColorSpace);
    assert.equal(material.roughnessMap.colorSpace, THREE.NoColorSpace);
    assert.equal(material.roughnessMap, material.metalnessMap);
    assert.equal(material.roughnessMap, material.aoMap);
    assert.equal(material.aoMap.channel, 0);
    let signature = 0;
    const normal = material.normalMap.image.data;
    for (let index = 0; index < normal.length; index += 997 * 4) signature += normal[index] * (index + 1);
    fingerprints.add(signature);
    assert.equal(material.userData.heroSurface.region, region);
    material.dispose();
  }
  assert.equal(fingerprints.size, 8, 'skin, leather, keratin and metal must not recycle one generic normal field');
});

test('paint chips expose a different metal/roughness response at the same albedo positions', () => {
  const material = createHeroMaterial('armor');
  const base = material.map.image.data;
  const orm = material.roughnessMap.image.data;
  let paintCount = 0, metalCount = 0, paintAlbedo = 0, metalAlbedo = 0, paintRoughness = 0, metalRoughness = 0;
  for (let offset = 0; offset < orm.length; offset += 4) {
    if (orm[offset + 2] < 50) {
      paintCount++; paintAlbedo += base[offset]; paintRoughness += orm[offset + 1];
    } else if (orm[offset + 2] > 220) {
      metalCount++; metalAlbedo += base[offset]; metalRoughness += orm[offset + 1];
    }
  }
  assert.ok(paintCount > 1000 && metalCount > 1000);
  assert.ok(metalAlbedo / metalCount < paintAlbedo / paintCount);
  assert.ok(metalRoughness / metalCount < paintRoughness / paintCount);
  for (const region of ['skin', 'bone', 'leather', 'dread', 'rubber']) {
    const dielectric = createHeroMaterial(region);
    const packed = dielectric.metalnessMap.image.data;
    for (let offset = 2; offset < packed.length; offset += 4) assert.equal(packed[offset], 0);
    dielectric.dispose();
  }
  material.dispose();
});

test('hero mask stays smoothly forged and paint damage remains sparse at both texture resolutions', () => {
  for (const resolution of [512, 1024]) {
    const armor = createHeroMaterial('armor', { resolution });
    const orm = armor.metalnessMap.image.data;
    const count = orm.length / 4;
    let exposedMetal = 0;
    for (let offset = 0; offset < orm.length; offset += 4) {
      if (orm[offset + 2] > 178) exposedMetal++;
    }
    assert.ok(exposedMetal / count > 0.005, 'a few genuinely exposed metal chips should remain');
    assert.ok(exposedMetal / count < 0.03, 'large camouflage-like chip patches must not cover the armor');
    armor.dispose();
  }
  const mask = createHeroMaterial('mask');
  const normal = mask.normalMap.image.data;
  let perturbation = 0;
  for (let offset = 0; offset < normal.length; offset += 4) {
    perturbation += Math.hypot(normal[offset] / 255 * 2 - 1, normal[offset + 1] / 255 * 2 - 1);
  }
  const meanSlope = perturbation / (normal.length / 4) * mask.normalScale.x;
  assert.ok(meanSlope > 0.0001 && meanSlope < 0.006,
    'subtle tool marks should preserve the broad highlights of the sculpted mask');
  mask.dispose();
});

test('provided baked maps and their normal scale survive hero material creation', () => {
  const before = getHeroMaterialStats();
  const base = new THREE.Texture(), normal = new THREE.Texture(), roughness = new THREE.Texture(), ao = new THREE.Texture();
  const scale = new THREE.Vector2(0.8, -0.8);
  const material = createHeroMaterial('skin', {
    baseColorMap: base, normalMap: normal, roughnessMap: roughness, aoMap: ao,
    metalness: 0, normalScale: scale, color: 0x5c6042, referenceColor: 0x5c6042,
  });
  assert.equal(material.map, base);
  assert.equal(material.normalMap, normal);
  assert.equal(material.roughnessMap, roughness);
  assert.equal(material.aoMap, ao);
  assert.deepEqual(material.normalScale.toArray(), [0.8, -0.8]);
  assert.equal(material.roughness, 1, 'a provided roughness bake must not receive an extra default attenuation');
  assert.equal(material.aoMapIntensity, 1);
  assert.equal(material.color.getHex(), 0x5c6042);
  assert.equal(getHeroMaterialStats().textureCount, before.textureCount, 'complete supplied bakes must not allocate unused generated tiles');
  const shader = { uniforms: {}, fragmentShader: '#include <color_fragment>' };
  material.onBeforeCompile(shader);
  assert.ok(shader.uniforms.heroReferenceColor.value.equals(new THREE.Color(0x5c6042)));
  assert.ok(shader.fragmentShader.includes('heroRelativeTint'));
  assert.equal(material.userData.heroSurface.albedoTintMode, 'reference-relative');
  material.dispose();
});

test('shared hero tiles survive material disposal and release at session shutdown', () => {
  const first = createHeroMaterial('mask'), second = createHeroMaterial('mask');
  assert.equal(first.normalMap, second.normalMap);
  let released = 0;
  first.normalMap.addEventListener('dispose', () => { released++; });
  first.dispose(); second.dispose();
  assert.equal(released, 0);
  disposeHeroMaterialCache();
  assert.equal(released, 1);
  assert.equal(getHeroMaterialStats().textureCount, 0);
});
