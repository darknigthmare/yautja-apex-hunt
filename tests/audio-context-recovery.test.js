import assert from 'node:assert/strict';
import { setImmediate } from 'node:timers/promises';
import test from 'node:test';
import { audioSynth } from '../src/AudioSynthesizer.js';

function createSynth() {
  return new audioSynth.constructor();
}

test('audio resume/suspend rejection stays local and leaves later effects safe', async (t) => {
  t.mock.method(console, 'warn', () => {});
  for (const muted of [false, true]) {
    const synth = createSynth();
    let closed = 0;
    synth.ctx = {
      resume: () => Promise.reject(new Error('device interrupted')),
      suspend: () => Promise.reject(new Error('device interrupted')),
      close: () => { closed++; return Promise.resolve(); },
    };
    synth.initialized = true;
    assert.equal(await synth.setMuted(muted), false);
    await setImmediate(); // An unhandled rejection would fail this test runner.
    assert.equal(synth.ctx, null);
    assert.equal(synth.initialized, false);
    assert.equal(closed, 1);
    assert.doesNotThrow(() => synth.playYautjaClick());
  }
});

test('audio transition and context cleanup may throw without breaking the game', async (t) => {
  t.mock.method(console, 'warn', () => {});
  const synth = createSynth();
  synth.ctx = {
    suspend() { throw new Error('context closed'); },
    close: () => Promise.reject(new Error('already closed')),
  };
  assert.equal(await synth.setMuted(true), false);
  await setImmediate();
  assert.equal(synth.ctx, null);
});

test('initializing muted audio handles asynchronous suspend failure', async (t) => {
  t.mock.method(console, 'warn', () => {});
  const previousWindow = globalThis.window;
  globalThis.window = { AudioContext: class {
    suspend() { return Promise.reject(new Error('cannot suspend')); }
    close() { return Promise.resolve(); }
  } };
  try {
    const synth = createSynth();
    synth.muted = true;
    synth.startAmbientJungle = () => {};
    synth.startAdaptiveBGM = () => {};
    assert.doesNotThrow(() => synth.init());
    await setImmediate();
    assert.equal(synth.ctx, null);
    assert.equal(synth.initialized, false);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test('successful mute transitions retain audio and use the requested state', async () => {
  const synth = createSynth();
  const transitions = [];
  const context = {
    suspend: () => { transitions.push('suspend'); return Promise.resolve(); },
    resume: () => { transitions.push('resume'); return Promise.resolve(); },
  };
  synth.ctx = context;
  assert.equal(await synth.setMuted(true), true);
  assert.equal(await synth.setMuted(false), true);
  assert.equal(synth.ctx, context);
  assert.deepEqual(transitions, ['suspend', 'resume']);
});
