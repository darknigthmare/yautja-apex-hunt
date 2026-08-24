import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { MothershipHub } from '../src/world/MothershipHub.js';

const previousWindow = globalThis.window;
globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');
if (previousWindow === undefined) delete globalThis.window;
else globalThis.window = previousWindow;

function makeElement(initialClasses = [], initialDataset = {}) {
  const classes = new Set(initialClasses);
  const attributes = new Map();
  const listeners = new Map();
  return {
    dataset: { ...initialDataset },
    classList: {
      add: (...names) => names.forEach((name) => classes.add(name)),
      remove: (...names) => names.forEach((name) => classes.delete(name)),
      contains: (name) => classes.has(name),
      toggle(name, force) {
        if (force === undefined ? !classes.has(name) : force) classes.add(name);
        else classes.delete(name);
      },
    },
    setAttribute: (name, value) => attributes.set(name, String(value)),
    getAttribute: (name) => attributes.get(name) ?? null,
    addEventListener(type, callback) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(callback);
    },
    emit(type, event = {}) {
      const payload = {
        currentTarget: this,
        pointerId: 1,
        preventDefault() { this.defaultPrevented = true; },
        ...event,
      };
      (listeners.get(type) ?? []).forEach((callback) => callback(payload));
      return payload;
    },
    setPointerCapture(pointerId) { this.capturedPointerId = pointerId; },
    focus() { this.focused = true; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    get focused() { return this._focused === true; },
    set focused(value) { this._focused = value; },
  };
}

function withDocument(documentMock, callback) {
  const previousDocument = globalThis.document;
  globalThis.document = documentMock;
  try {
    return callback();
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
}


function withNavigator(navigatorMock, callback) {
  const previousDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: navigatorMock });
  try {
    return callback();
  } finally {
    if (previousDescriptor) Object.defineProperty(globalThis, 'navigator', previousDescriptor);
    else delete globalThis.navigator;
  }
}
test('le hub expose des limites, colliders et quatre stations déterministes', () => {
  const hub = new MothershipHub(new THREE.Scene());

  assert.deepEqual(hub.stations.map(({ id }) => id), [
    'mission-nexus',
    'armory-forge',
    'trophy-vault',
    'vehicle-hangar',
  ]);
  assert.ok(hub.colliders.length >= 20);
  assert.equal(hub.getNearbyStation(new THREE.Vector3(0, 0, -5)).interactionType, 'contracts');
  assert.equal(hub.getNearbyStation(new THREE.Vector3(13, 0, 18)).interactionType, 'forge');
  assert.equal(hub.getNearbyStation(new THREE.Vector3(0, 0, 20)), null);

  const aisle = new THREE.Vector3(0, 4, 20);
  assert.equal(hub.constrainPlayer(aisle), aisle);
  assert.deepEqual(aisle.toArray(), [0, 0, 20]);

  const outside = new THREE.Vector3(100, 8, -100);
  hub.constrainPlayer(outside, 1.8);
  assert.ok(outside.x <= hub.bounds.maxX - 1.8);
  assert.ok(outside.z >= hub.bounds.minZ + 1.8);
  assert.equal(outside.y, 0);

  const pedestal = hub.colliders.find(({ id }) => id.startsWith('mission-pedestal-'));
  const overlap = new THREE.Vector3(pedestal.x, 0, pedestal.z);
  hub.constrainPlayer(overlap, 1.8);
  assert.ok(
    Math.hypot(overlap.x - pedestal.x, overlap.z - pedestal.z) >= pedestal.radius + 1.8 - 1e-9,
  );

  hub.dispose();
});

test('le bouton explorer ferme proprement le modal et la console peut reprendre le focus', () => {
  const modal = makeElement(['hidden']);
  const missionsTab = makeElement();
  const canvas = makeElement();
  const elements = new Map([
    ['mission-modal', modal],
    ['tab-btn-missions', missionsTab],
  ]);
  const documentMock = {
    pointerLockElement: null,
    getElementById: (id) => elements.get(id) ?? null,
  };

  withDocument(documentMock, () => {
    const game = Object.create(Game.prototype);
    let pointerRequests = 0;
    let activatedTab = null;
    game.container = canvas;
    game.gameState = 'HUB';
    game.isGameStarted = true;
    game.isHubExploring = false;
    game.keyboardInputDir = { x: 1, z: 1, isSprinting: true };
    game.gamepadAxes = { x: 0, z: 0 };
    game.inputDir = { x: 0, z: 0, isSprinting: false };
    game.player = {};
    game.hud = { hideActionPrompt() {}, showLogMessage() {} };
    game.requestPointerLockSafely = () => { pointerRequests += 1; return true; };
    game.activateMissionTab = (tab) => { activatedTab = tab; };
    game.refreshForgeButtons = () => {};

    assert.equal(game.enterHubExploration(), true);
    assert.equal(modal.classList.contains('hidden'), true);
    assert.equal(modal.getAttribute('aria-hidden'), 'true');
    assert.equal(game.isHubExploring, true);
    assert.equal(canvas.focused, true);
    assert.equal(pointerRequests, 1);

    assert.equal(game.showMissionSelectionModal('missions'), true);
    assert.equal(modal.classList.contains('hidden'), false);
    assert.equal(modal.getAttribute('aria-hidden'), 'false');
    assert.equal(game.isHubExploring, false);
    assert.equal(activatedTab, 'missions');
    assert.equal(missionsTab.focused, true);
  });
});

test('l’exploration met à jour le joueur, applique le clamp et rafraîchit caméra et prompt', () => {
  const game = Object.create(Game.prototype);
  const calls = [];
  game.gameState = 'HUB';
  game.isHubExploring = true;
  game.cameraYaw = 0.7;
  game.inputDir = { x: 1, z: 0, isSprinting: true };
  game.player = {
    position: new THREE.Vector3(),
    update(delta, input, yaw) {
      calls.push(['player', delta, input, yaw]);
      this.position.x = 40;
    },
  };
  game.hub = {
    constrainPlayer(position, radius) {
      calls.push(['clamp', radius]);
      position.x = 12;
    },
  };
  game.updateCamera = (delta) => calls.push(['camera', delta]);
  game.updateHubHUD = () => calls.push(['hud']);

  assert.equal(game.updateHubExploration(0.25), true);
  assert.equal(game.player.position.x, 12);
  assert.deepEqual(calls.map(([name]) => name), ['player', 'clamp', 'camera', 'hud']);
  assert.equal(calls[1][1], 1.8);

  game.isHubExploring = false;
  assert.equal(game.updateHubExploration(0.25), false);
});

test('E active les stations du hub et Échap rouvre la console des contrats', () => {
  const game = Object.create(Game.prototype);
  const openedTabs = [];
  const logs = [];
  let station = {
    id: 'armory-forge',
    interactionType: 'forge',
    prompt: 'ACCÉDER À LA FORGE [E]',
  };
  game.isGameStarted = true;
  game.isPaused = false;
  game.gameState = 'HUB';
  game.isHubExploring = true;
  game.keyboardInputDir = { x: 0, z: 0, isSprinting: false };
  game.gamepadAxes = { x: 0, z: 0 };
  game.inputDir = { x: 0, z: 0, isSprinting: false };
  game.player = { position: new THREE.Vector3(), completedHunts: ['goliath'] };
  game.hub = {
    getNearbyStation: () => station,
    setTrophyState() {},
    trophyDisplays: new Map([
      ['goliath', { userData: { unlocked: true } }],
      ['xeno_queen', { userData: { unlocked: false } }],
    ]),
    vehicleDisplays: [
      { userData: { vehicleKind: 'scout' } },
      { userData: { vehicleKind: 'shuttle' } },
      { userData: { vehicleKind: 'pod' } },
    ],
  };
  game.hud = {
    updateVitals() {},
    showActionPrompt(prompt) { this.prompt = prompt; },
    hideActionPrompt() {},
    showLogMessage(message) { logs.push(message); },
  };
  game.showMissionSelectionModal = (tab) => openedTabs.push(tab);

  game.onKeyDown({ code: 'KeyE', repeat: false });
  assert.deepEqual(openedTabs, ['armory']);

  station = { id: 'mission-nexus', interactionType: 'contracts', prompt: 'CONTRATS [E]' };
  game.attemptHubInteraction();
  assert.deepEqual(openedTabs, ['armory', 'missions']);

  station = { id: 'trophy-vault', interactionType: 'trophies', prompt: 'TROPHÉES [E]' };
  game.attemptHubInteraction();
  assert.match(logs.at(-1), /1\/2 TROPHÉES/);

  station = { id: 'vehicle-hangar', interactionType: 'hangar', prompt: 'HANGAR [E]' };
  game.attemptHubInteraction();
  assert.match(logs.at(-1), /ÉCLAIREUR · NAVETTE · POD DE TRAQUE/);
  assert.equal(game.updateHubHUD(), station);
  assert.equal(game.hud.prompt, 'HANGAR [E]');

  let prevented = false;
  game.onKeyDown({ code: 'Escape', repeat: false, preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(openedTabs.at(-1), 'missions');
});

test('le CTA d’exploration est exposé avec aide clavier et styles dédiés', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');

  assert.match(html, /id="btn-explore-hub"/);
  assert.match(html, /aria-describedby="hub-explore-help"/);
  assert.match(html, /Manette : sticks, A et Start/);
  assert.match(css, /\.mission-modal-actions/);
  assert.match(css, /\.hub-explore-button/);
});

test('la manette déclenche interaction et console une fois par pression sans casser la chasse', () => {
  const game = Object.create(Game.prototype);
  const buttons = Array.from({ length: 10 }, () => ({ pressed: false }));
  const gamepad = { axes: [0, 0, 0, 0], buttons };
  let connected = true;
  let hubInteractions = 0;
  let huntInteractions = 0;
  let attacks = 0;
  const openedTabs = [];

  Object.assign(game, {
    gameState: 'HUB',
    isHubExploring: true,
    isPaused: false,
    cameraYaw: 0,
    cameraPitch: 0,
    keyboardInputDir: { x: 0, z: 0, isSprinting: false },
    touchInputDir: { x: 0, z: 0 },
    gamepadAxes: { x: 0, z: 0 },
    inputDir: { x: 0, z: 0, isSprinting: false },
    gamepadAttackPressed: false,
    gamepadInteractPressed: false,
    gamepadMenuPressed: false,
  });
  game.attemptHubInteraction = () => { hubInteractions += 1; };
  game.attemptContextInteraction = () => { huntInteractions += 1; };
  game.performAttack = () => { attacks += 1; };
  game.showMissionSelectionModal = (tab) => { openedTabs.push(tab); };

  withNavigator({ getGamepads: () => (connected ? [gamepad] : []) }, () => {
    buttons[0].pressed = true;
    game.updateGamepad();
    game.updateGamepad();
    assert.equal(hubInteractions, 1, 'A maintenu ne doit pas répéter l interaction');

    buttons[0].pressed = false;
    game.updateGamepad();
    buttons[0].pressed = true;
    game.updateGamepad();
    assert.equal(hubInteractions, 2, 'A doit se réarmer après relâchement');
    buttons[0].pressed = false;
    game.updateGamepad();

    buttons[9].pressed = true;
    game.updateGamepad();
    game.updateGamepad();
    assert.deepEqual(openedTabs, ['missions'], 'Start maintenu ne doit ouvrir qu une console');
    buttons[9].pressed = false;
    game.updateGamepad();
    buttons[8].pressed = true;
    game.updateGamepad();
    assert.deepEqual(openedTabs, ['missions', 'missions'], 'Select reste un équivalent de Start');
    buttons[8].pressed = false;
    game.updateGamepad();

    game.gameState = 'HUNT';
    game.isHubExploring = false;
    buttons[0].pressed = true;
    buttons[7].pressed = true;
    game.updateGamepad();
    game.updateGamepad();
    assert.equal(huntInteractions, 1, 'A doit conserver l équivalent de E en chasse');
    assert.equal(attacks, 1, 'la gâchette droite doit conserver son latch d attaque');

    connected = false;
    game.updateGamepad();
    assert.equal(game.gamepadInteractPressed, false);
    assert.equal(game.gamepadMenuPressed, false);
    assert.equal(game.gamepadAttackPressed, false);
  });
});

test('le pavé tactile du hub combine les directions et reste inactif pendant la chasse', () => {
  const controls = makeElement(['hidden']);
  const up = makeElement([], { hubMove: 'up' });
  const down = makeElement([], { hubMove: 'down' });
  const left = makeElement([], { hubMove: 'left' });
  const right = makeElement([], { hubMove: 'right' });
  const interact = makeElement();
  const consoleButton = makeElement();
  controls.querySelectorAll = () => [up, down, left, right];
  const elements = new Map([
    ['touch-hub-controls', controls],
    ['btn-touch-hub-interact', interact],
    ['btn-touch-hub-console', consoleButton],
  ]);
  const game = Object.create(Game.prototype);
  let hubInteractions = 0;
  let huntInteractions = 0;
  const openedTabs = [];
  Object.assign(game, {
    gameState: 'HUB',
    isHubExploring: true,
    keyboardInputDir: { x: 0, z: 0, isSprinting: false },
    touchInputDir: { x: 0, z: 0 },
    activeHubTouchDirections: new Set(),
    gamepadAxes: { x: 0, z: 0 },
    inputDir: { x: 0, z: 0, isSprinting: false },
  });
  game.attemptHubInteraction = () => { hubInteractions += 1; };
  game.attemptContextInteraction = () => { huntInteractions += 1; };
  game.showMissionSelectionModal = (tab) => { openedTabs.push(tab); };

  withDocument({ getElementById: (id) => elements.get(id) ?? null }, () => {
    assert.equal(game.setupHubTouchControls(), true);
    game.setHubTouchControlsVisible(true);
    assert.equal(controls.classList.contains('hidden'), false);

    const press = up.emit('pointerdown');
    right.emit('pointerdown');
    assert.equal(press.defaultPrevented, true);
    assert.deepEqual(game.inputDir, { x: 1, z: -1, isSprinting: false });
    up.emit('pointerup');
    assert.deepEqual(game.inputDir, { x: 1, z: 0, isSprinting: false });
    right.emit('lostpointercapture');
    assert.deepEqual(game.inputDir, { x: 0, z: 0, isSprinting: false });

    interact.emit('click');
    consoleButton.emit('click');
    assert.equal(hubInteractions, 1);
    assert.deepEqual(openedTabs, ['missions']);

    game.gameState = 'HUNT';
    game.isHubExploring = false;
    interact.emit('click');
    consoleButton.emit('click');
    up.emit('pointerdown');
    assert.equal(hubInteractions, 1);
    assert.equal(huntInteractions, 0);
    assert.deepEqual(openedTabs, ['missions']);
    assert.deepEqual(game.inputDir, { x: 0, z: 0, isSprinting: false });

    game.setHubTouchControlsVisible(false);
    assert.equal(controls.classList.contains('hidden'), true);
    assert.equal(game.activeHubTouchDirections.size, 0);
  });

  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
  assert.match(html, /id="btn-touch-hub-interact"/);
  assert.match(html, /id="btn-touch-hub-console"/);
  assert.match(html, /data-hub-move="up"/);
  assert.match(css, /\.touch-hub-controls:not\(\.hidden\)/);
  assert.match(css, /pointer: coarse/);
});
