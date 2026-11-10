import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { rolldown } from 'rolldown';
import { audioSynth as sourceAudio } from '../src/AudioSynthesizer.js';
import { audioMethodChunksPlugin, audioMethodChunkName, splitAudioMethods } from '../scripts/build/audioMethodChunks.js';

function instrumentedContext() {
  const events = [];
  let id = 0;
  const param = label => Object.fromEntries(['setValueAtTime', 'linearRampToValueAtTime', 'exponentialRampToValueAtTime',
    'setTargetAtTime', 'cancelScheduledValues'].map(method => [method, (...args) => events.push([label, method, ...args])]));
  const node = kind => {
    const name = `${kind}:${id++}`;
    const object = { id: name,
      connect(other) { events.push([name, 'connect', other.id]); return other; },
      disconnect() { events.push([name, 'disconnect']); },
      start(...args) { events.push([name, 'start', ...args]); },
      stop(...args) { events.push([name, 'stop', ...args]); },
    };
    for (const property of ['frequency', 'gain', 'Q', 'detune']) object[property] = param(`${name}.${property}`);
    Object.defineProperty(object, 'type', { set(value) { events.push([name, 'type', value]); } });
    return object;
  };
  return { events, context: {
    currentTime: 10, sampleRate: 48000, destination: { id: 'speakers' },
    createOscillator: () => node('oscillator'), createGain: () => node('gain'),
    createBiquadFilter: () => node('filter'), createBufferSource: () => node('buffer-source'),
    createBuffer(channels, length, rate) {
      events.push(['buffer', channels, length, rate]);
      const data = Array.from({ length: channels }, () => new Float32Array(length));
      return { getChannelData: channel => data[channel] };
    },
  } };
}

function playSequence(audio) {
  const { events, context } = instrumentedContext();
  const random = Math.random;
  Math.random = () => 0.25;
  try {
    audio.ctx = context;
    audio.muted = false;
    audio.currentBgmState = 'stealth';
    audio.playVictoryRoar();
    // Calls another method through this: a relocated definition must keep the
    // same engine instance, rather than a fragment's constructor or prototype.
    audio.playMimicryLure('unknown');
    audio.playMedicompOpen();
    audio.startAdaptiveBGM();
    audio.updateAdaptiveBGM('combat');
    audio.stopAdaptiveBGM();
    // A late definition exercises the existing duplicate-name override order.
    audio.playMimicryAnytime();
    audio.playVydrachWingGale();
    return events;
  } finally {
    Math.random = random;
    audio.ctx = null;
  }
}

test('production audio chunks preserve every public method and actual Web Audio scheduling', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'yautja-audio-build-'));
  const audioFile = fileURLToPath(new URL('../src/AudioSynthesizer.js', import.meta.url));
  let bundle;
  try {
    await writeFile(join(directory, 'package.json'), '{"type":"module"}');
    const source = await readFile(audioFile, 'utf8');
    const plan = splitAudioMethods(source);
    assert.ok(plan.parts.length >= 2, 'the sound library must actually be split');
    assert.equal(plan.declarationCount, 2051);
    const before = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(sourceAudio));
    assert.equal(Object.keys(before).length, 2046, 'five existing declarations override earlier definitions');
    bundle = await rolldown({ input: audioFile, preserveEntrySignatures: 'allow-extension', plugins: [audioMethodChunksPlugin()] });
    const result = await bundle.write({
      dir: directory, format: 'es', entryFileNames: 'audio.js', chunkFileNames: '[name]-[hash].js',
      minify: true, strictExecutionOrder: true,
      codeSplitting: { groups: [
        { name: audioMethodChunkName, priority: 2, includeDependenciesRecursively: false },
        { name: 'audio-core', test: /AudioSynthesizer\.js$/, priority: 1, includeDependenciesRecursively: false },
      ] },
    });
    const chunks = result.output.filter(output => output.type === 'chunk');
    assert.ok(chunks.length > 2);
    assert.ok(chunks.every(chunk => Buffer.byteLength(chunk.code) < 550000), 'splitting cannot hide an oversized module');
    const { audioSynth: builtAudio } = await import(pathToFileURL(join(directory, 'audio.js')).href);
    const after = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(builtAudio));
    assert.deepEqual(Object.keys(after), Object.keys(before), 'public method names and definition order changed');
    for (const name of Object.keys(before)) {
      for (const flag of ['enumerable', 'writable', 'configurable']) assert.equal(after[name][flag], before[name][flag], `${name}.${flag}`);
      assert.equal(after[name].value.length, before[name].value.length, `${name}.length`);
      if (name !== 'constructor') assert.equal(after[name].value.name, before[name].value.name, `${name}.name`);
    }
    assert.deepEqual(Object.keys(builtAudio), Object.keys(sourceAudio));
    assert.deepEqual(playSequence(builtAudio), playSequence(sourceAudio), 'frequency/envelope, callback instance or override behavior changed');
    const warn = console.warn;
    console.warn = () => {};
    try {
      for (const audio of [sourceAudio, builtAudio]) {
        let closed = 0;
        audio.initialized = true;
        audio.ctx = { suspend: () => Promise.reject(new Error('device lost')), close() { closed++; } };
        assert.equal(await audio.setMuted(true), false);
        assert.equal(closed, 1);
        assert.equal(audio.ctx, null, 'the asynchronous failure callback must clear the actual engine instance');
        assert.equal(audio.initialized, false);
      }
    } finally { console.warn = warn; }
    assert.equal(await readFile(audioFile, 'utf8'), source, 'the source/Node API must stay intact');
  } finally {
    await bundle?.close();
    await rm(directory, { recursive: true, force: true });
  }
});

test('unsupported lexical features keep the original audio module intact', () => {
  const moduleFor = body => `class AudioSynthesizer { constructor() {} ${body} } export const audioSynth = new AudioSynthesizer();`;
  for (const source of [
    moduleFor('get volume() { return 1; }'),
    moduleFor('static play() {}'),
    moduleFor('["play"]() {}'),
    moduleFor('play() { return audioSynth; }'),
    moduleFor('play() { return import.meta.url; }'),
    `const shared = 1; ${moduleFor('play() { return shared; }')}`,
  ]) assert.equal(splitAudioMethods(source), null);
});
