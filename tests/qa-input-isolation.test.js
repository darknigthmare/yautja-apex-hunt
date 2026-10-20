import test from 'node:test';
import assert from 'node:assert/strict';
import { audioSynth } from '../src/AudioSynthesizer.js';
const previousWindow = globalThis.window;
globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');
if (previousWindow === undefined) delete globalThis.window;
else globalThis.window = previousWindow;

function combatGame() {
  const game = Object.create(Game.prototype);
  Object.assign(game, {
    container: {}, isGameStarted: true, gameState: 'HUNT', isPaused: false,
    player: { inQTE: false, hasScopeZoom: true }, attacks: 0, escapes: 0,
    performAttack() { this.attacks++; },
    resolveFacehuggerQTE() { this.escapes++; },
  });
  return game;
}

test('cliquer le HUD ne tire pas et ne déclenche ni zoom ni sortie de QTE', () => {
  const game = combatGame();
  for (const inQTE of [false, true]) {
    game.player.inQTE = inQTE;
    for (const button of [0, 2]) game.handleCombatMouseDown({ target: {}, button });
  }
  assert.equal(game.attacks, 0);
  assert.equal(game.escapes, 0);
  assert.equal(game.isScopeZooming, undefined);
});

test('les clics dans le monde conservent attaque, zoom et résistance au facehugger', () => {
  const init = audioSynth.init;
  audioSynth.init = () => {};
  try {
    const game = combatGame();
    const click = (button) => game.handleCombatMouseDown({ target: game.container, button, preventDefault() {} });
    click(0);
    assert.equal(game.attacks, 1);
    click(2);
    assert.equal(game.isScopeZooming, true);
    game.player.inQTE = true;
    click(0);
    assert.equal(game.escapes, 1);
    assert.equal(game.attacks, 1);
    game.isPaused = true;
    click(0);
    assert.equal(game.escapes, 1);
  } finally { audioSynth.init = init; }
});

test('la caméra manette parcourt le même angle à 30, 60 et 144 images par seconde', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {
    getGamepads: () => [{ axes: [0, 0, 0.5, 0], buttons: [] }],
  } });
  try {
    const yaws = [30, 60, 144].map((fps) => {
      const game = combatGame();
      Object.assign(game, {
        cameraYaw: 0, cameraPitch: 0,
        gamepadAxes: { x: 0, z: 0 }, keyboardInputDir: { x: 0, z: 0 },
        inputDir: { x: 0, z: 0 }, gamepadNavigationPressed: [],
        gamepadWeaponCyclePressed: {}, gamepadGadgetPressed: [],
        getVisibleDialog: () => null,
      });
      for (let frame = 0; frame < fps; frame++) game.updateGamepad(1 / fps);
      return game.cameraYaw;
    });
    for (const yaw of yaws) assert.ok(Math.abs(yaw + 0.9) < 1e-10);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'navigator', descriptor);
    else delete globalThis.navigator;
  }
});

test('la baie médicale bloque les commandes de déplacement et de pause du monde', () => {
  const game = combatGame();
  game.medbayOverlay = { isOpen: true };
  game.togglePause = () => { throw new Error('le monde a reçu la touche du dialogue'); };
  game.applyKeyboardMovementInput = () => { throw new Error('déplacement pendant soin'); };
  game.onKeyDown({ code: 'KeyW' });
  game.onKeyDown({ code: 'Escape', repeat: false });
  game.handleCombatMouseDown({ target: game.container, button: 0 });
  assert.equal(game.attacks, 0);
});

test('un écran tactile ne capture pas les boutons du HUD dans le verrouillage souris', () => {
  const previous = globalThis.window;
  globalThis.window = { matchMedia: () => ({ matches: true }) };
  try {
    const game = combatGame();
    game.container.requestPointerLock = () => { throw new Error('capture souris sur tactile'); };
    assert.equal(game.requestPointerLockSafely(), false);
  } finally {
    if (previous === undefined) delete globalThis.window;
    else globalThis.window = previous;
  }
});
