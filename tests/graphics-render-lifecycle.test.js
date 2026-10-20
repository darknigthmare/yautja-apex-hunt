import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { GraphicsRenderer } from '../src/render/GraphicsRenderer.js';

// Real Three.js passes and render targets, with only WebGL execution replaced.
// Importing the rendering module itself must not require browser globals.
function fixture(run) {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  globalThis.window = { devicePixelRatio: 2, matchMedia: () => ({ matches: false }) };
  const state = { size: new THREE.Vector2(800, 600), ratio: 1, target: null, clearColor: new THREE.Color(0x123456), clearAlpha: 0.35 };
  const renderer = {
    capabilities: { isWebGL2: true },
    autoClear: true,
    shadowMap: { autoUpdate: true },
    info: { autoReset: true, reset() {} },
    getSize: (value) => value.copy(state.size),
    getPixelRatio: () => state.ratio,
    setPixelRatio: (value) => { state.ratio = value; },
    setSize: (width, height) => { state.size.set(width, height); },
    getRenderTarget: () => state.target,
    setRenderTarget: (value) => { state.target = value; },
    getClearColor: (value) => value.copy(state.clearColor),
    getClearAlpha: () => state.clearAlpha,
    setClearAlpha: (value) => { state.clearAlpha = value; },
    setClearColor: (value, alpha) => {
      state.clearColor.set(value);
      if (alpha !== undefined) state.clearAlpha = alpha;
    },
    clear() {},
    render() {},
  };
  const graphics = Object.assign(Object.create(GraphicsRenderer.prototype), {
    renderer, scene: new THREE.Scene(), camera: new THREE.PerspectiveCamera(60, 4 / 3, 0.1, 2000),
    hdrSupported: true, width: 800, height: 600,
  });
  try { run({ graphics, renderer, state }); }
  finally {
    graphics.dispose();
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
    else delete globalThis.window;
  }
}

test('switching graphics quality releases all owned AO/bloom resources exactly once', () => fixture(({ graphics }) => {
  graphics.setQuality('high');
  const retainedComposer = graphics.composer;
  graphics.setQuality('high');
  assert.equal(graphics.composer, retainedComposer, 'unchanged quality must retain live resources');
  const ao = graphics.ao;
  const bloom = graphics.bloom;
  const resources = [
    ao.ssaoMaterial, ao.noiseTexture, ao.normalMaterial, ao.blurMaterial, ao.copyMaterial,
    ao.depthRenderMaterial, ao.normalRenderTarget, ao.ssaoRenderTarget, ao.blurRenderTarget,
    bloom.materialHighPassFilter, bloom.compositeMaterial, bloom.blendMaterial, bloom.basic,
    bloom.renderTargetBright, ...bloom.renderTargetsHorizontal, ...bloom.renderTargetsVertical,
    ...bloom.separableBlurMaterials, graphics.composer.renderTarget1, graphics.composer.renderTarget2,
    graphics.composer.copyPass.material, graphics.fxaa.material,
  ];
  const disposals = new Map(resources.map((resource) => [resource, 0]));
  for (const resource of resources) resource.addEventListener('dispose', () => disposals.set(resource, disposals.get(resource) + 1));
  graphics.setQuality('balanced');
  assert.equal(graphics.ao, null);
  assert.ok(graphics.bloom);
  for (const [resource, count] of disposals) assert.equal(count, 1, `${resource.type || resource.texture?.name || 'render target'} not released once`);
  graphics.setQuality('performance');
  graphics.setQuality('high');
  for (const count of disposals.values()) assert.equal(count, 1, 'later switches must not dispose the old generation twice');
}));

test('a failing SSAO frame restores scene visibility and renderer state and propagates its error', () => fixture(({ graphics, renderer, state }) => {
  graphics.setQuality('high');
  const originalOverride = new THREE.MeshBasicMaterial({ color: 0x445566 });
  graphics.scene.overrideMaterial = originalOverride;
  const opaque = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
  const glass = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.3 }));
  const hologram = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ wireframe: true }));
  const line = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial());
  const hidden = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
  hidden.visible = false;
  graphics.scene.add(opaque, glass, hologram, line, hidden);
  const originalTarget = new THREE.WebGLRenderTarget(4, 4);
  state.target = originalTarget;
  const failure = new Error('injected SSAO normal-render failure');
  let reachedNormalPass = false;
  renderer.render = (scene) => {
    if (scene.overrideMaterial === graphics.ao.normalMaterial) {
      assert.equal(renderer.shadowMap.autoUpdate, false, 'contact shading must reuse the scene shadow maps');
      reachedNormalPass = true;
      assert.equal(opaque.visible, true);
      assert.equal(glass.visible, false);
      assert.equal(hologram.visible, false);
      assert.equal(line.visible, false);
      assert.equal(hidden.visible, false);
      throw failure;
    }
  };
  try {
    assert.throws(() => graphics.render('normal'), (error) => error === failure);
    assert.equal(reachedNormalPass, true);
    assert.equal(graphics.quality, 'high', 'errors must not silently change the selected quality');
    assert.equal(graphics.scene.overrideMaterial, originalOverride);
    assert.equal(renderer.autoClear, true);
    assert.equal(renderer.info.autoReset, true);
    assert.equal(renderer.shadowMap.autoUpdate, true);
    assert.equal(state.clearColor.getHex(), 0x123456);
    assert.equal(state.clearAlpha, 0.35);
    assert.equal(state.target, originalTarget);
    for (const object of [opaque, glass, hologram, line]) assert.equal(object.visible, true);
    assert.equal(hidden.visible, false);
    assert.equal(graphics.ao._visibilityCache.size, 0);
    assert.doesNotThrow(() => graphics.render('thermal'), 'direct rendering can resume with clean state');
  } finally {
    originalTarget.dispose(); originalOverride.dispose();
    for (const object of [opaque, glass, hologram, line, hidden]) { object.geometry.dispose(); object.material.dispose(); }
  }
}));

test('resize keeps AO/FXAA resolutions and camera projection current, and unsupported HDR uses direct rendering', () => fixture(({ graphics, renderer, state }) => {
  graphics.setQuality('high');
  assert.equal(renderer.getPixelRatio(), 1.5);
  graphics.resize(391, 845);
  assert.deepEqual(state.size.toArray(), [391, 845]);
  assert.deepEqual([graphics.ao.width, graphics.ao.height], [293, 634]);
  assert.equal(graphics.fxaa.uniforms.resolution.value.x, 1 / (391 * 1.5));
  assert.equal(graphics.fxaa.uniforms.resolution.value.y, 1 / (845 * 1.5));
  graphics.camera.near = 0.5;
  graphics.camera.far = 3000;
  graphics.camera.aspect = 391 / 845;
  graphics.camera.updateProjectionMatrix();
  // Skip GPU execution while exercising the wrapper's camera-uniform refresh.
  graphics.composer.render = () => {};
  graphics.render('normal');
  assert.equal(graphics.ao.ssaoMaterial.uniforms.cameraNear.value, 0.5);
  assert.equal(graphics.ao.ssaoMaterial.uniforms.cameraFar.value, 3000);
  assert.deepEqual(graphics.ao.ssaoMaterial.uniforms.cameraProjectionMatrix.value.elements, graphics.camera.projectionMatrix.elements);
  assert.deepEqual(graphics.ao.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.elements, graphics.camera.projectionMatrixInverse.elements);
  graphics.hdrSupported = false;
  graphics.setQuality('ultra');
  assert.equal(graphics.requestedQuality, 'ultra');
  assert.equal(graphics.quality, 'performance');
  assert.equal(graphics.composer, null);
  assert.equal(renderer.getPixelRatio(), 1);
  assert.doesNotThrow(() => graphics.render('normal'));
  assert.equal(graphics.lastPostProcessed, false);
}));
