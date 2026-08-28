import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

const previousWindow = globalThis.window;
globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');
if (previousWindow === undefined) delete globalThis.window;
else globalThis.window = previousWindow;

const Y_AXIS = new THREE.Vector3(0, 1, 0);

function createMovementGame(gameState) {
  const game = Object.create(Game.prototype);
  Object.assign(game, {
    isGameStarted: true,
    gameState,
    isHubExploring: gameState === 'HUB',
    isPaused: false,
    keyboardInputDir: { x: 0, z: 0, isSprinting: false },
    touchInputDir: { x: 0, z: 0 },
    activeHubTouchDirections: new Set(),
    gamepadAxes: { x: 0, z: 0 },
    inputDir: { x: 0, z: 0, isSprinting: false },
    player: { inQTE: false },
    cameraYaw: 1.17,
    cameraPitch: 0.2,
    gamepadAttackPressed: false,
    gamepadInteractPressed: false,
    gamepadMenuPressed: false,
  });
  game.attemptHubInteraction = () => {};
  game.attemptContextInteraction = () => {};
  game.performAttack = () => {};
  game.showMissionSelectionModal = () => {};
  return game;
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

function cameraRelativeDirection(inputDir, cameraYaw) {
  return new THREE.Vector3(inputDir.x, 0, inputDir.z)
    .normalize()
    .applyAxisAngle(Y_AXIS, cameraYaw);
}

function expectedCameraDirection(axis, cameraYaw) {
  const localDirection = {
    forward: new THREE.Vector3(0, 0, 1),
    backward: new THREE.Vector3(0, 0, -1),
    left: new THREE.Vector3(1, 0, 0),
    right: new THREE.Vector3(-1, 0, 0),
  }[axis];
  return localDirection.applyAxisAngle(Y_AXIS, cameraYaw);
}

function assertMovementKey(game, event, expectedAxis, cameraYaw) {
  game.onKeyDown({ repeat: false, preventDefault() {}, ...event });
  const actual = cameraRelativeDirection(game.inputDir, cameraYaw);
  const expected = expectedCameraDirection(expectedAxis, cameraYaw);
  assert.ok(
    actual.dot(expected) > 0.999999,
    event.label + ' doit aller vers ' + expectedAxis + ' relativement à la caméra',
  );
  game.onKeyUp(event);
  assert.deepEqual(game.inputDir, { x: 0, z: 0, isSprinting: false });
}

for (const gameState of ['HUB', 'HUNT']) {
  test('ZQSD et WASD suivent la caméra en ' + gameState.toLowerCase(), () => {
    const game = createMovementGame(gameState);
    const cameraYaw = game.cameraYaw;

    assertMovementKey(
      game,
      { code: 'KeyW', key: 'w', label: 'W QWERTY' },
      'forward',
      cameraYaw,
    );
    assertMovementKey(
      game,
      { code: 'KeyW', key: 'z', label: 'Z AZERTY (position physique W)' },
      'forward',
      cameraYaw,
    );
    assertMovementKey(
      game,
      { code: 'KeyZ', key: 'z', label: 'alias explicite Z' },
      'forward',
      cameraYaw,
    );
    assertMovementKey(game, { code: 'KeyS', key: 's', label: 'S' }, 'backward', cameraYaw);
    assertMovementKey(
      game,
      { code: 'KeyA', key: 'a', label: 'A QWERTY' },
      'left',
      cameraYaw,
    );
    assertMovementKey(
      game,
      { code: 'KeyA', key: 'q', label: 'Q AZERTY (position physique A)' },
      'left',
      cameraYaw,
    );
    assertMovementKey(
      game,
      { code: 'KeyQ', key: 'q', label: 'alias explicite Q' },
      'left',
      cameraYaw,
    );
    assertMovementKey(game, { code: 'KeyD', key: 'd', label: 'D' }, 'right', cameraYaw);
  });
}

for (const gameState of ['HUB', 'HUNT']) {
  test('les directions opposées se recalculent sans perdre Z maintenu en ' + gameState.toLowerCase(), () => {
    const game = createMovementGame(gameState);
    game.onKeyDown({ code: 'KeyZ', key: 'z', repeat: false, preventDefault() {} });
    assert.equal(game.inputDir.z, 1);

    game.onKeyDown({ code: 'KeyS', key: 's', repeat: false, preventDefault() {} });
    assert.equal(game.inputDir.z, 0, 'Z + S doivent se neutraliser tant que les deux sont maintenus');

    game.onKeyUp({ code: 'KeyS' });
    assert.equal(game.inputDir.z, 1, 'relâcher S doit restaurer Z encore maintenu');

    game.onKeyUp({ code: 'KeyZ' });
    assert.equal(game.inputDir.z, 0);
  });
}

test('les deux touches Maj restent indépendantes pour le sprint', () => {
  const game = createMovementGame('HUNT');
  game.onKeyDown({ code: 'ShiftLeft', repeat: false, preventDefault() {} });
  game.onKeyDown({ code: 'ShiftRight', repeat: false, preventDefault() {} });
  game.onKeyUp({ code: 'ShiftLeft' });
  assert.equal(game.inputDir.isSprinting, true);
  game.onKeyUp({ code: 'ShiftRight' });
  assert.equal(game.inputDir.isSprinting, false);
});

test('le QTE transmet une entrée neutre au rig malgré une touche de déplacement maintenue', () => {
  const game = createMovementGame('HUNT');
  game.inputDir = { x: 0, z: 1, isSprinting: true };
  game.player = {
    inQTE: true,
    currentAnimationState: 'walk',
    update(_delta, input) {
      this.lastFrameInput = { ...input };
      this.currentAnimationState = input.x !== 0 || input.z !== 0
        ? input.isSprinting ? 'sprint' : 'walk'
        : 'idle';
    },
  };

  game.updatePlayerFrame(0.016);
  assert.deepEqual(game.player.lastFrameInput, { x: 0, z: 0, isSprinting: false });
  assert.equal(game.player.currentAnimationState, 'idle');
  assert.deepEqual(game.inputDir, { x: 0, z: 1, isSprinting: true }, 'la touche maintenue reste mémorisée');

  game.player.inQTE = false;
  game.updatePlayerFrame(0.016);
  assert.equal(game.player.currentAnimationState, 'sprint', 'le déplacement reprend après le QTE');
});

test('le vaisseau de Wolf possède des libellés HUD Cleaner dédiés', () => {
  const game = createMovementGame('HUNT');
  const labels = game.getVehicleHudLabels('wolf_cleaner_ship');
  assert.match(labels.prompt, /CLEANER DE WOLF/);
  assert.match(labels.synchronized, /CLEANER DE WOLF/);
  assert.notEqual(labels.prompt, game.getVehicleHudLabels('unknown').prompt);
});

test('le pavé tactile du hub suit les quatre directions caméra', () => {
  const game = createMovementGame('HUB');
  const directions = [
    ['up', 'forward'],
    ['down', 'backward'],
    ['left', 'left'],
    ['right', 'right'],
  ];

  directions.forEach(([touchDirection, expectedAxis]) => {
    assert.equal(game.setHubTouchDirection(touchDirection, true), true);
    const actual = cameraRelativeDirection(game.inputDir, game.cameraYaw);
    const expected = expectedCameraDirection(expectedAxis, game.cameraYaw);
    assert.ok(actual.dot(expected) > 0.999999, touchDirection + ' doit aller vers ' + expectedAxis);
    assert.equal(game.setHubTouchDirection(touchDirection, false), true);
    assert.deepEqual(game.inputDir, { x: 0, z: 0, isSprinting: false });
  });
});

for (const gameState of ['HUB', 'HUNT']) {
  test('le stick gauche suit les quatre directions caméra en ' + gameState.toLowerCase(), () => {
    const game = createMovementGame(gameState);
    const buttons = Array.from({ length: 10 }, () => ({ pressed: false }));
    const axes = [0, 0, 0, 0];

    withNavigator({ getGamepads: () => [{ axes, buttons }] }, () => {
      const directions = [
        [[0, -0.8], 'forward'],
        [[0, 0.8], 'backward'],
        [[-0.8, 0], 'left'],
        [[0.8, 0], 'right'],
      ];

      directions.forEach(([[axisX, axisZ], expectedAxis]) => {
        axes[0] = axisX;
        axes[1] = axisZ;
        game.updateGamepad();
        const actual = cameraRelativeDirection(game.inputDir, game.cameraYaw);
        const expected = expectedCameraDirection(expectedAxis, game.cameraYaw);
        assert.ok(actual.dot(expected) > 0.999999, expectedAxis + ' doit suivre la caméra');
      });

      axes[0] = 0.1;
      axes[1] = -0.1;
      game.updateGamepad();
      assert.deepEqual(game.inputDir, { x: 0, z: 0, isSprinting: false });
    });
  });
}
