import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
const initialWindow = globalThis.window;
globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');
if (initialWindow === undefined) delete globalThis.window;
else globalThis.window = initialWindow;

function cameraGame() {
  return Object.assign(Object.create(Game.prototype), {
    isGameStarted: true, isPaused: false, gameState: 'HUNT',
    player: { position: new THREE.Vector3(), hasScopeZoom: false },
    camera: new THREE.PerspectiveCamera(65, 1, 0.1, 2000),
    settings: { reducedMotion: false }, cameraPitch: -0.6, cameraYaw: 0,
    environment: { sampleHeight: () => 0 },
    container: { setPointerCapture() {} },
  });
}

test('la caméra reste au-dessus du sol au pitch minimum et au bord des reliefs', () => {
  const game = cameraGame();
  game.updateCamera(1 / 60);
  assert.ok(game.camera.position.y >= 1);
  game.environment.sampleHeight = () => 12;
  game.updateCamera(1 / 60);
  assert.ok(game.camera.position.y >= 13);
});

test('le couvert raccourcit la caméra avant le premier impact sans pénétrer le volume', () => {
  const game = cameraGame();
  game.cameraPitch = 0;
  const point = new THREE.Vector3(0, 4.7, -6);
  game.environment.resolveProjectileCoverImpact = () => ({ point });
  game.updateCamera(1 / 60);
  const anchor = new THREE.Vector3(0, 4, 0);
  assert.ok(game.camera.position.distanceTo(anchor) < point.distanceTo(anchor));
  assert.ok(game.camera.position.z > point.z);
  assert.ok(game.camera.position.y >= 1);
  game.gameState = 'HUB';
  game.hub = { resolveCameraObstruction: () => new THREE.Vector3(0, 3, -2) };
  game.updateCamera(1 / 60);
  assert.deepEqual(game.camera.position.toArray(), [0, 3, -2]);
});

test('le glissement tactile oriente la caméra du hub et refuse le second pointeur et les menus', () => {
  const game = cameraGame();
  game.gameState = 'HUB';
  game.isHubExploring = true;
  const start = { pointerType: 'touch', pointerId: 1, clientX: 100, clientY: 100 };
  game.handleTouchLookStart(start);
  game.handleTouchLookStart({ ...start, pointerId: 2 });
  assert.equal(game.touchLookPointerId, 1);
  game.handleTouchLookMove({ pointerId: 1, clientX: 160, clientY: 60 });
  assert.ok(game.cameraYaw < 0);
  const yaw = game.cameraYaw;
  game.medbayOverlay = { isOpen: true };
  game.handleTouchLookMove({ pointerId: 1, clientX: 200, clientY: 60 });
  assert.equal(game.cameraYaw, yaw);
  game.resetCameraTouchInput();
  assert.equal(game.touchLookPointerId, null);
  game.isHubExploring = false;
  game.handleTouchLookStart(start);
  assert.equal(game.touchLookPointerId, null);
});

test('une rotation mobile utilise le viewport CSS sans réinjecter une largeur en pixels', () => {
  const oldDocument = globalThis.document;
  const oldWindow = globalThis.window;
  globalThis.document = { documentElement: { clientWidth: 390, clientHeight: 844 } };
  globalThis.window = { innerWidth: 844, innerHeight: 1827 };
  try {
    const game = cameraGame();
    let size;
    game.renderer = { setSize: (...args) => { size = args; } };
    game.onWindowResize();
    assert.deepEqual(size, [390, 844, false]);
    assert.equal(game.camera.aspect, 390 / 844);
    assert.equal(game.renderDirty, true);
  } finally {
    if (oldDocument === undefined) delete globalThis.document;
    else globalThis.document = oldDocument;
    if (oldWindow === undefined) delete globalThis.window;
    else globalThis.window = oldWindow;
  }
});

test('les écrans statiques gardent un rafraîchissement borné et le resize est immédiat', () => {
  for (const state of [
    { isGameStarted: false }, { isGameStarted: true, isPaused: true },
    { isGameStarted: true, medbayOverlay: { isOpen: true } },
    { isGameStarted: true, gameState: 'RESULT' },
  ]) {
    let renders = 0;
    const game = Object.assign(cameraGame(), state, { renderer: { render: () => { renders++; } } });
    for (let frame = 0; frame < 60; frame++) game.renderSceneIfNeeded(1 / 60);
    assert.ok(renders >= 2 && renders <= 3, `rendus statiques : ${renders}`);
    game.renderDirty = true;
    assert.equal(game.renderSceneIfNeeded(0), true);
  }
  let activeRenders = 0;
  const active = Object.assign(cameraGame(), { renderer: { render: () => { activeRenders++; } } });
  for (let frame = 0; frame < 60; frame++) active.renderSceneIfNeeded(1 / 60);
  assert.equal(activeRenders, 60);
});

test('un onglet masqué ne soumet aucun rendu même après invalidation', () => {
  const oldDocument = globalThis.document;
  globalThis.document = { hidden: true };
  try {
    const game = cameraGame();
    game.renderDirty = true;
    game.renderer = { render: () => { throw new Error('rendu en arrière-plan'); } };
    assert.equal(game.renderSceneIfNeeded(1), false);
  } finally {
    if (oldDocument === undefined) delete globalThis.document;
    else globalThis.document = oldDocument;
  }
});

test('les shaders partagés avancent une seule fois et le mouvement réduit fige leurs effets', () => {
  const game = cameraGame();
  const active = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 1 } } });
  const hidden = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 5 } } });
  game.scene = new THREE.Scene();
  game.scene.add(new THREE.Mesh(undefined, active), new THREE.Mesh(undefined, active));
  const group = new THREE.Group();
  group.visible = false;
  group.add(new THREE.Mesh(undefined, hidden));
  game.scene.add(group);
  game.updateShaderUniforms(0.1);
  assert.equal(active.uniforms.uTime.value, 1.1);
  assert.equal(hidden.uniforms.uTime.value, 5);
  game.settings.reducedMotion = true;
  game.updateShaderUniforms(0.1);
  assert.equal(active.uniforms.uTime.value, 1.1);
});

test('la manette ne peut pas reprendre la simulation dans un onglet masqué', () => {
  const oldDocument = globalThis.document;
  const oldRaf = globalThis.requestAnimationFrame;
  globalThis.document = { hidden: true };
  globalThis.requestAnimationFrame = () => {};
  try {
    const game = cameraGame();
    game.clock = { getDelta: () => 1 / 60 };
    game.timeScale = 1;
    game.updateGamepad = () => { throw new Error('manette en arrière-plan'); };
    game.updateShaderUniforms = () => { throw new Error('simulation en arrière-plan'); };
    game.renderer = { render: () => { throw new Error('rendu en arrière-plan'); } };
    game.animate();
  } finally {
    if (oldDocument === undefined) delete globalThis.document;
    else globalThis.document = oldDocument;
    if (oldRaf === undefined) delete globalThis.requestAnimationFrame;
    else globalThis.requestAnimationFrame = oldRaf;
  }
});
