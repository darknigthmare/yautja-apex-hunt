import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
let chromium = null;
try { ({ chromium } = await import('playwright')); } catch {}
import * as THREE from 'three';
import { ShaderManager } from '../src/Shaders.js';

test('vision materials let Three choose skeletal or rigid variants without sharing mutable uniforms', () => {
  const first = ShaderManager.createThermalMaterial(0xff3311, 0.7);
  const second = ShaderManager.createThermalMaterial(0x33ff11, 0.3);
  const cloak = ShaderManager.createCloakMaterial();
  const plasma = ShaderManager.createPlasmaMaterial();
  try {
    first.uniforms.uTime.value = 20;
    assert.equal(second.uniforms.uTime.value, 0);
    assert.equal(second.uniforms.uHeat.value, 0.3);
    assert.equal(cloak.transparent, true);
    assert.equal(cloak.depthWrite, false);
    assert.equal(plasma.blending, THREE.AdditiveBlending);
    for (const material of [first, cloak, plasma]) {
      assert.equal(material.toneMapped, false);
      assert.equal(material.defines.USE_SKINNING, undefined, 'rigid equipment must not be forced into skeletal rendering');
      for (const match of material.vertexShader.matchAll(/#include <([\w]+)>/g)) {
        assert.equal(typeof THREE.ShaderChunk[match[1]], 'string', `unknown Three shader chunk: ${match[1]}`);
      }
    }
  } finally {
    for (const material of [first, second, cloak, plasma]) material.dispose();
  }
});

let browserPath = process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : null);
if (!browserPath && chromium) { try { browserPath = chromium.executablePath(); } catch {} }

test('GPU vision renders match posed rigid references for Bone, Group and instanced transforms', {
  skip: (!chromium || !browserPath || !existsSync(browserPath)) && 'Chromium is required for the shader pixel regression',
  timeout: 90_000,
}, async () => {
  const html = `<!doctype html><meta charset="utf-8"><link rel="icon" href="data:,">
    <script type="importmap">{"imports":{"three":"/three.js"}}</script>
    <script type="module">
    import * as THREE from 'three';
    import { ShaderManager } from '/Shaders.js';
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(128, 96);
    const target = new THREE.WebGLRenderTarget(128, 96);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0);
    const camera = new THREE.OrthographicCamera(-3, 3, 2.25, -2.25, 0.1, 20);
    camera.position.z = 6;
    const geometry = new THREE.BoxGeometry(0.72, 1.4, 0.36);
    const count = geometry.attributes.position.count;
    const indices = new Uint16Array(count * 4);
    const weights = new Float32Array(count * 4);
    for (let index = 0; index < count; index++) weights[index * 4] = 1;
    geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(indices, 4));
    geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(weights, 4));

    function render(object) {
      scene.clear();
      scene.add(object);
      object.traverse(node => { if (node.isMesh) node.frustumCulled = false; });
      scene.updateMatrixWorld(true);
      renderer.setRenderTarget(target);
      renderer.render(scene, camera);
      const pixels = new Uint8Array(128 * 96 * 4);
      renderer.readRenderTargetPixels(target, 0, 0, 128, 96, pixels);
      scene.remove(object);
      return pixels;
    }

    function compare(actual, expected) {
      let difference = 0, actualPixels = 0, expectedPixels = 0;
      for (let index = 0; index < actual.length; index += 4) {
        const a = actual[index] + actual[index + 1] + actual[index + 2];
        const e = expected[index] + expected[index + 1] + expected[index + 2];
        if (a > 12) actualPixels++;
        if (e > 12) expectedPixels++;
        for (let channel = 0; channel < 3; channel++) difference += Math.abs(actual[index + channel] - expected[index + channel]);
      }
      return { meanRgbError: difference / (128 * 96 * 3), actualPixels, expectedPixels };
    }

    const results = [];
    const materials = {
      thermal: ShaderManager.createThermalMaterial(0xff3311, 0.52),
      cloak: ShaderManager.createCloakMaterial(),
      plasma: ShaderManager.createPlasmaMaterial(),
    };
    for (const [name, material] of Object.entries(materials)) {
      material.uniforms.uTime.value = 0.37;
      for (const Joint of [THREE.Bone, THREE.Group]) {
        const skinned = new THREE.SkinnedMesh(geometry, material);
        const joint = new Joint();
        skinned.add(joint);
        skinned.updateMatrixWorld(true);
        const skeleton = new THREE.Skeleton([joint]);
        skinned.bind(skeleton);
        joint.position.set(1.05, 0.14, 0);
        joint.rotation.set(0.19, 0.62, 0.37);
        const reference = new THREE.Mesh(geometry, material);
        reference.position.copy(joint.position);
        reference.rotation.copy(joint.rotation);
        results.push({ name, variant: Joint === THREE.Group ? 'Group skeleton' : 'Bone skeleton', ...compare(render(skinned), render(reference)) });
        skeleton.dispose();
      }
      const instances = new THREE.InstancedMesh(geometry, material, 3);
      const references = new THREE.Group();
      for (let index = 0; index < 3; index++) {
        const reference = new THREE.Mesh(geometry, material);
        reference.position.set((index - 1) * 1.75, 0, 0);
        reference.rotation.set(index * 0.1, (index - 1) * 0.45, index * 0.12);
        reference.scale.set(0.85, 0.85 + index * 0.15, 1);
        reference.updateMatrix();
        instances.setMatrixAt(index, reference.matrix);
        references.add(reference);
      }
      instances.instanceMatrix.needsUpdate = true;
      results.push({ name, variant: 'instances', ...compare(render(instances), render(references)) });
      instances.dispose();
    }
    geometry.dispose();
    Object.values(materials).forEach(material => material.dispose());
    target.dispose();
    renderer.dispose();
    window.__shaderResults = results;
    </script>`;
  const routes = new Map([
    ['/', ['text/html; charset=utf-8', html]],
    ['/Shaders.js', ['text/javascript', readFileSync(new URL('../src/Shaders.js', import.meta.url))]],
    ['/three.js', ['text/javascript', readFileSync(new URL('../node_modules/three/build/three.module.js', import.meta.url))]],
  ]);
  const server = createServer((request, response) => {
    const resource = routes.get(request.url);
    response.writeHead(resource ? 200 : 404, { 'content-type': resource?.[0] ?? 'text/plain' });
    response.end(resource?.[1] ?? 'Not found');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ executablePath: browserPath, headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'] });
    const page = await browser.newPage({ viewport: { width: 160, height: 120 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto('http://127.0.0.1:' + server.address().port + '/');
    await page.waitForFunction(() => Array.isArray(window.__shaderResults), null, { timeout: 45_000 });
    const results = await page.evaluate(() => window.__shaderResults);
    assert.deepEqual(errors, [], 'the actual GLSL variants must compile and render');
    assert.equal(results.length, 9);
    for (const result of results) {
      assert.ok(result.actualPixels > 100, JSON.stringify(result));
      assert.ok(result.expectedPixels > 100, JSON.stringify(result));
      assert.ok(result.meanRgbError < 0.8, JSON.stringify(result));
      assert.ok(Math.abs(result.actualPixels - result.expectedPixels) <= 3, JSON.stringify(result));
    }
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});
