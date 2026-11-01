import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { createDirectiveProgress } from '../src/gameplay/HuntDirectiveSystem.js';
import { YautjaTrophyCraftsmanshipForgeSystem } from '../src/gameplay/YautjaTrophyCraftsmanshipForgeSystem.js';
import { CANON_PREY_CATALOG, MULTIVERSE_CROSSOVER_PREY } from '../src/data/PreyTaxonomyAndCrossoverCatalog.js';

const previousWindow = globalThis.window;
globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');
if (previousWindow === undefined) delete globalThis.window;
else globalThis.window = previousWindow;

function withDocument(action) {
  const previous = globalThis.document;
  const elements = new Map();
  globalThis.document = { pointerLockElement: null, getElementById(id) {
    if (!elements.has(id)) elements.set(id, { textContent: '', classList: { add() {}, remove() {} }, querySelector() { return null; } });
    return elements.get(id);
  } };
  try { action(elements); }
  finally { if (previous === undefined) delete globalThis.document; else globalThis.document = previous; }
}

function harvestGame(target = null, kind = 'prey') {
  const game = Object.create(Game.prototype);
  game.gameState = 'HUNT'; game.currentHuntType = 'goliath';
  game.currentDirectiveId = 'standard_hunt'; game.directiveProgress = createDirectiveProgress('standard_hunt');
  game.trophyHarvested = false; game.huntResultShown = false;
  game.activeBoss = { position: new THREE.Vector3(), isDead: true };
  game.activePreySimulation = kind === 'prey' ? target : null;
  game.activeCrossoverHunt = kind === 'crossover' ? target : null;
  game.currentHuntCrown = { honorBonusMultiplier: 1, id: 'STANDARD' };
  game.player = { position: new THREE.Vector3(), inQTE: false, completedHunts: [], completedDirectiveIds: [],
    honorScore: 0, lifetimeHonor: 0, ranks: ['Chasseur'], honorRankIndex: 0, awards: 0,
    addHonor(amount) { this.awards++; this.honorScore += amount; this.lifetimeHonor += amount; return amount; } };
  game.trophyCraftForge = new YautjaTrophyCraftsmanshipForgeSystem('integration-memory-only');
  game.trophyCraftForge.setPersistenceHandler(() => true);
  game.hub = { setTrophyState() {} };
  game.hud = { showLogMessage() {} };
  game.camera = { fov: 65, updateProjectionMatrix() {} };
  for (const name of ['resetKeyboardInput', 'neutralizeVictoryDangers', 'saveProgress', 'spawnBloodSpatterVFX',
    'updateDirectiveResultPanel', 'setHuntTouchControlsVisible']) game[name] = () => {};
  game.isPlayerCombatDisabled = () => false;
  return game;
}

test('a training harvest awards only its documented reward once, with no physical proxy trophy', () => {
  withDocument(() => {
    for (const [kind, target] of [['prey', CANON_PREY_CATALOG[0]], ['crossover', MULTIVERSE_CROSSOVER_PREY[0]]]) {
      const game = harvestGame(target, kind);
      game.attemptTrophyHarvest();
      const expected = target.honorReward ?? target.baseHonor;
      assert.equal(game.player.honorScore, expected);
      assert.equal(game.player.lifetimeHonor, expected);
      assert.deepEqual(game.player.completedHunts, []);
      assert.deepEqual(game.trophyCraftForge.state.trophyInventory, {});
      assert.equal(game.trophyCraftForge.state.holoCollection[target.id], 1);
      game.attemptTrophyHarvest(); game.triggerVictoryScreen(); game.triggerVictoryScreen();
      assert.equal(game.player.awards, 1, 'showing the result must not pay the generic boss or a second reward');
      assert.equal(game.player.honorScore, expected);
    }
  });
});

test('physical victory credits the real contract and one collectible specimen', () => {
  const game = harvestGame();
  game.attemptTrophyHarvest();
  assert.equal(game.player.honorScore, 1200);
  assert.deepEqual(game.player.completedHunts, ['goliath']);
  assert.equal(game.trophyCraftForge.state.trophyInventory.goliath, 1);
  assert.deepEqual(game.trophyCraftForge.state.holoCollection, {});
  game.attemptTrophyHarvest();
  assert.equal(game.player.awards, 1);
});

test('anti-giant and crossover craft bonuses apply to the actual hit target only', () => {
  const game = Object.create(Game.prototype);
  game.activeBoss = { colliderRadius: 10 };
  game.activeCrossoverHunt = { scale: 'GEANT' };
  game.trophyCraftForge = { getActiveCraftedPerks: () => ({ crossoverDamageBonusMultiplier: 2, giantDamageBonusMultiplier: 3 }) };
  assert.equal(game.getPlayerOutgoingDamage(10, 'ranged', game.activeBoss), 60);
  assert.equal(game.getPlayerOutgoingDamage(10, 'ranged', { colliderRadius: 1.2 }), 10);
});

test('royal honor bonuses do not apply to ordinary enemies or unrelated POI', () => {
  const game = Object.create(Game.prototype);
  game.currentHuntType = 'xeno_queen'; game.activeBoss = {};
  game.player = { addHonor: amount => amount };
  game.trophyCraftForge = { getActiveCraftedPerks: () => ({ honorScoreBonusMultiplier: 1.5, queenHonorBonusMultiplier: 2 }) };
  assert.equal(game.awardHonor(10, { target: game.activeBoss }), 30);
  assert.equal(game.awardHonor(10, { target: {} }), 15);
  assert.equal(game.awardHonor(10), 15);
  game.activeBoss = null;
  assert.equal(game.awardHonor(10), 15, 'returning to the hub must not keep the former royal target bonus');
});
