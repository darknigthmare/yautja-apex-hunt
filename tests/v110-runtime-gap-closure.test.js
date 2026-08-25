import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';

const previousWindow = globalThis.window;
globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');
if (previousWindow === undefined) delete globalThis.window;
else globalThis.window = previousWindow;

test('un hazard snare applique le vrai timer de combat et ralentit le déplacement', () => {
  const scene = new THREE.Scene();
  const player = new YautjaPlayer(scene);
  const game = Object.create(Game.prototype);
  game.player = player;
  game.hud = { showLogMessage() {} };

  assert.equal(game.applyEnvironmentHazardSignal({
    type: 'environment_hazard',
    hazardId: 'la-hazard-owlf-cryo',
    status: 'snare',
    statusDuration: 3.4,
  }), true);
  assert.equal(player.combatStatusTimers.snare, 3.4);
  assert.equal(player.getCombatMovementMultiplier(), 0.25);

  player.position.set(0, 0, 0);
  player.update(0.4, { x: 1, z: 0, isSprinting: true }, 0);
  assert.equal(Number(player.position.length().toFixed(3)), 1.6);
  assert.equal(player.stamina, 100, 'l’entrave environnementale bloque aussi le sprint');
  assert.equal(player.combatStatusTimers.snare, 3);
});

function createDirectiveWaveHarness() {
  const game = Object.create(Game.prototype);
  game.scene = new THREE.Scene();
  game.player = {
    position: new THREE.Vector3(0, 0, 0),
    activeVisionMode: 'thermal',
  };
  game.environment = {
    getSafeSpawnPosition(position) { return position.clone(); },
  };
  game.hud = { messages: [], showLogMessage(message) { this.messages.push(message); } };
  game.currentDirectiveId = 'urban_heatwave_hunt';
  game.pendingDirectiveWaves = [];
  game.activeEnemies = Array.from({ length: 24 }, (_, index) => ({
    id: `capacity-${index}`,
    type: 'capacity_fill',
    isDead: false,
  }));
  return game;
}

test('une vague de directive saturée attend en FIFO, reste dédupliquée et respecte le cap', () => {
  const game = createDirectiveWaveHarness();
  const signal = {
    type: 'spawn_enemy_group',
    sourceId: 'urban-owlf-wave',
    directiveId: 'urban_heatwave_hunt',
    enemyTypes: ['urban_cartel_enforcer', 'owlf_cryo_commando'],
    position: { x: 16, y: 0, z: -22 },
  };

  game.processEncounterSignals([signal]);
  assert.equal(game.activeEnemies.length, 24);
  assert.equal(game.pendingDirectiveWaves.length, 1);
  assert.deepEqual(game.pendingDirectiveWaves[0].enemyTypes, signal.enemyTypes);

  game.processEncounterSignals([signal]);
  assert.equal(game.pendingDirectiveWaves.length, 1, 'un même signal planifié ne peut pas empiler la file');

  game.activeEnemies.pop();
  const firstRetry = game.retryPendingDirectiveWaves();
  assert.deepEqual(firstRetry.map((enemy) => enemy.type), ['urban_cartel_enforcer']);
  assert.equal(game.activeEnemies.length, 24);
  assert.deepEqual(game.pendingDirectiveWaves[0].enemyTypes, ['owlf_cryo_commando']);
  assert.equal(game.pendingDirectiveWaves[0].spawnedCount, 1);

  const firstSpawn = game.activeEnemies.pop();
  firstSpawn.dispose();
  const secondRetry = game.retryPendingDirectiveWaves();
  assert.deepEqual(secondRetry.map((enemy) => enemy.type), ['owlf_cryo_commando']);
  assert.equal(game.activeEnemies.length, 24);
  assert.equal(game.pendingDirectiveWaves.length, 0);
  game.activeEnemies.at(-1).dispose();
});

test('la file de vagues différées est bornée même sous signaux distincts répétés', () => {
  const game = createDirectiveWaveHarness();
  for (let index = 0; index < 12; index += 1) {
    game.processEncounterSignals([{
      type: 'spawn_enemy_group',
      sourceId: `bounded-wave-${index}`,
      directiveId: 'urban_heatwave_hunt',
      enemyTypes: ['urban_cartel_enforcer'],
      position: [index, 0, -index],
    }]);
  }
  assert.equal(game.activeEnemies.length, 24);
  assert.equal(game.pendingDirectiveWaves.length, 8);
  assert.deepEqual(
    game.pendingDirectiveWaves.map(({ key }) => key),
    Array.from({ length: 8 }, (_, index) => `bounded-wave-${index}`),
  );
});
