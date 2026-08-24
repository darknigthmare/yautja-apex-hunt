import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';

async function loadGameClass() {
  const previousWindow = globalThis.window;
  globalThis.window = { addEventListener() {} };
  try {
    return (await import('../src/main.js')).Game;
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
}

test('applyBossHazards applique la corrosion Cleaner une seule fois par intervalle', async () => {
  const Game = await loadGameClass();
  const game = Object.create(Game.prototype);
  const events = [];
  const zone = {
    type: 'dissolving_fluid',
    mesh: { position: new THREE.Vector3(0, 0, 0) },
    radius: 5.8,
    damage: 19,
    damageInterval: 0.75,
    tickCooldown: 0,
  };
  game.activeBoss = { cleanerZones: [zone] };
  game.player = {
    takeDamage: (amount) => events.push(['damage', amount]),
    applyAcidCorrosion: () => events.push(['corrosion']),
  };
  game.hud = { showLogMessage: (message) => events.push(['log', message]) };
  game.spawnBloodSpatterVFX = (...args) => events.push(['blood', ...args]);

  assert.equal(game.applyBossHazards(new THREE.Vector3(1, 0, 1)), 1);
  assert.equal(zone.tickCooldown, 0.75);
  assert.deepEqual(events.filter(([type]) => type === 'damage'), [['damage', 19]]);
  assert.equal(events.filter(([type]) => type === 'corrosion').length, 1);
  assert.equal(events.filter(([type]) => type === 'log').length, 1);

  assert.equal(game.applyBossHazards(new THREE.Vector3(1, 0, 1)), 0);
  assert.equal(events.filter(([type]) => type === 'damage').length, 1);
});

test('applyBossHazards déclenche puis retire une mine Cleaner armée', async () => {
  const Game = await loadGameClass();
  const game = Object.create(Game.prototype);
  const events = [];
  const zone = {
    type: 'proximity_mine',
    mesh: { position: new THREE.Vector3(0, 0, 0) },
    radius: 4.4,
    damage: 53,
    armed: true,
  };
  const zones = [zone];
  game.activeBoss = {
    cleanerZones: zones,
    removeCleanerZone(candidate) {
      const index = zones.indexOf(candidate);
      if (index < 0) return false;
      zones.splice(index, 1);
      return true;
    },
  };
  game.player = { takeDamage: (amount) => events.push(['damage', amount]) };
  game.hud = { showLogMessage: (message) => events.push(['log', message]) };
  game.spawnBloodSpatterVFX = (...args) => events.push(['blood', ...args]);
  game.spawnPlasmaShockwaveVFX = (...args) => events.push(['shockwave', ...args]);

  assert.equal(game.applyBossHazards(new THREE.Vector3(0, 0, 1)), 1);
  assert.deepEqual(events.filter(([type]) => type === 'damage'), [['damage', 53]]);
  assert.equal(events.filter(([type]) => type === 'shockwave').length, 1);
  assert.equal(zones.length, 0);
});
