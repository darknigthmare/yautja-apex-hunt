import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { MothershipHub } from '../src/world/MothershipHub.js';
import { HUNT_DEFINITIONS } from '../src/data/GameConfig.js';

test('each visible contract console has a reachable approach selecting that exact target', () => {
  const hub = new MothershipHub(new THREE.Scene());
  try {
    assert.equal(hub.missionStations.length, Object.keys(HUNT_DEFINITIONS).length);
    for (const station of hub.missionStations) {
      const approach = station.position.clone();
      hub.constrainPlayer(approach, 1.8);
      assert.ok(approach.distanceTo(station.position) < 0.01, `${station.huntId}: approach blocked`);
      const selected = hub.getNearbyStation(approach);
      assert.equal(selected.huntId, station.huntId);
      const pedestal = hub.group.getObjectByName(`mission-station-${station.huntId}`);
      assert.equal(pedestal.userData.huntId, selected.huntId);
      const solid = hub.getColliders().find(c => c.id === `mission-pedestal-${station.huntId}`);
      assert.ok(solid, `${station.huntId}: visible pedestal must be solid`);
      const inside = pedestal.position.clone();
      hub.constrainPlayer(inside, 1.8);
      assert.ok(Math.hypot(inside.x - solid.x, inside.z - solid.z) >= solid.radius + 1.8 - 1e-5);
      assert.ok(pedestal.position.distanceTo(approach) < 5);
      assert.match(selected.prompt, /PRÉPARER/);
      assert.equal(hub.getNearbyStation(approach.clone().add(new THREE.Vector3(0, 20, 0))), null);
    }
  } finally { hub.dispose(); }
});

test('a physical contract console opens mandatory preparation without deploying or retaining a hologram', async () => {
  const previousWindow = globalThis.window;
  globalThis.window = { addEventListener() {} };
  let Game;
  try { ({ Game } = await import('../src/main.js')); }
  finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
  const hub = new MothershipHub(new THREE.Scene());
  try {
    const game = Object.create(Game.prototype);
    const station = hub.missionStations.find(s => s.huntId === 'rhynth_titan');
    game.hub = hub;
    game.gameState = 'HUB'; game.isHubExploring = true;
    game.player = { position: station.position.clone() };
    let opened, prepared;
    game.showMissionSelectionModal = tab => { opened = tab; game.isHubExploring = false; };
    game.prepareHunt = (...args) => { prepared = args; };
    game.startHunt = () => assert.fail('physical console must not bypass preparation');
    assert.equal(game.attemptHubInteraction(), station);
    assert.equal(opened, 'loadout');
    assert.equal(game.isHubExploring, false);
    assert.deepEqual(prepared, ['rhynth_titan', HUNT_DEFINITIONS.rhynth_titan.recommendedBiome, 'standard_hunt']);
  } finally { hub.dispose(); }
});
