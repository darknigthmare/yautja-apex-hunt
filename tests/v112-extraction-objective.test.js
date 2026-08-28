import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { Environment } from '../src/world/Environment.js';
import { LevelEventDirector } from '../src/gameplay/LevelEventDirector.js';

const previousWindow = globalThis.window;
globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');
if (previousWindow === undefined) delete globalThis.window;
else globalThis.window = previousWindow;

test('le planning Gunnison ne rejoue aucun nœud d’écosystème par modulo', () => {
  const scene = new THREE.Scene();
  const environment = new Environment(scene);
  environment.setBiome('gunnison_outbreak');
  const director = new LevelEventDirector(scene, {
    maxEnemySpawns: 0,
    maxVehicles: 0,
    maxCaches: 0,
    rng: () => 0.4,
  });
  director.start({ huntId: 'predalien', biomeId: 'gunnison_outbreak', directiveId: 'standard_hunt' });

  assert.equal(director.scheduleTemplate.filter(({ kind }) => kind === 'prey_migration').length, 1);
  assert.equal(director.scheduleTemplate.filter(({ kind }) => kind === 'territory_clash').length, 1);
  assert.equal(director.scheduleTemplate.filter(({ kind }) => kind === 'localized_event').length, 4);
  const signals = director.update(200, {
    player: { position: new THREE.Vector3(0, 0, 620) },
    boss: { isDead: false },
    environment,
  });
  const spatialIds = signals
    .filter(({ type }) => ['localized_event', 'prey_migration', 'territory_clash', 'boss_migration'].includes(type))
    .map(({ sourceId }) => sourceId);
  assert.equal(new Set(spatialIds).size, spatialIds.length);
  [
    'gunnison-grid-blackout',
    'gunnison-hive-rupture',
    'gunnison-guard-collapse',
    'gunnison-hospital-sprinklers',
    'gunnison-extraction-countdown',
    'gunnison-predalien-trail',
  ].forEach((id) => assert.ok(spatialIds.includes(id), id));
  director.dispose();
  environment.dispose();
});

test('le blackout coupe puis restaure les éclairages de Gunnison', () => {
  const environment = new Environment(new THREE.Scene());
  environment.setBiome('gunnison_outbreak');
  const before = environment.mainLight.intensity;
  const zone = environment.startLocalizedEvent({
    id: 'gunnison-grid-blackout',
    position: new THREE.Vector3(15, 0, 235),
    radius: 34,
    duration: 2,
    status: 'energy_jam',
    mechanism: 'power_grid_blackout',
  });
  assert.ok(environment.mainLight.intensity < before * 0.3);
  assert.equal(zone.mechanismState.restored, false);
  environment.updateDynamicEventZones(2.1);
  assert.equal(environment.mainLight.intensity, before);
  assert.equal(zone.mechanismState.restored, true);
  environment.dispose();
});

test('la balise chronométrée est un objectif et non un piège qui blesse le joueur arrivé', () => {
  const environment = new Environment(new THREE.Scene());
  environment.setBiome('gunnison_outbreak');
  const zone = environment.startLocalizedEvent({
    id: 'gunnison-extraction-countdown',
    position: new THREE.Vector3(0, 0, -590),
    radius: 42,
    duration: 45,
    damage: 4,
    status: 'energy_jam',
    mechanism: 'evacuation_countdown',
    countdownSeconds: 45,
  });
  assert.equal(zone.isObjectiveZone, true);
  assert.equal(zone.damage, 0);
  assert.equal(zone.status, null);
  assert.equal(zone.countdownSeconds, 45);
  assert.equal(environment.hazardZones.includes(zone), false);
  assert.equal(environment.dynamicEventZones.includes(zone), true);
  environment.dispose();
});

function makeObjectiveGame(playerPosition) {
  const updates = [];
  const game = Object.create(Game.prototype);
  game.player = {
    position: playerPosition.clone(),
    health: 100,
    maxHealth: 100,
    energy: 40,
    maxEnergy: 100,
    honorScore: 100,
    isCloaked: true,
    addHonor(amount) { this.honorScore += amount; },
    takeDamage(amount) { this.health -= amount; },
    toggleCloak() { this.isCloaked = !this.isCloaked; },
    applyCombatStatus(status, duration) { this.lastStatus = { status, duration }; },
  };
  game.hud = {
    updateLevelEventObjective(value) { updates.push(value); },
    showLogMessage(message) { game.lastLog = message; },
    hideCount: 0,
    hideLevelEventObjective() { this.hideCount += 1; },
  };
  game.requestBossMigration = (position, options) => { game.lastMigration = { position, options }; };
  game.activeExtractionObjective = null;
  game.extractionOutcome = null;
  return { game, updates };
}

test('atteindre la zone avant 45 secondes attribue réellement le bonus et le scan', () => {
  const { game, updates } = makeObjectiveGame(new THREE.Vector3(0, 0, -590));
  const zone = { position: new THREE.Vector3(0, 0, -590), radius: 42, remaining: 45 };
  game.startExtractionObjective({
    sourceId: 'gunnison-extraction-countdown',
    label: 'Extraction compromise',
    position: zone.position,
    radius: 42,
    mechanism: 'evacuation_countdown',
    countdownSeconds: 45,
  }, zone);
  const result = game.updateExtractionObjective(0.25);
  assert.equal(result.state, 'secured');
  assert.equal(game.player.honorScore, 350);
  assert.equal(game.player.energy, 85);
  assert.equal(game.player.scanPulseTimer, 10);
  assert.equal(game.player.scanPulseRadius, 150);
  assert.equal(updates.at(-1).state, 'secured');
});

test('laisser expirer le chrono déclenche une conséquence de combat unique', () => {
  const { game, updates } = makeObjectiveGame(new THREE.Vector3(500, 0, 500));
  const zone = { position: new THREE.Vector3(0, 0, -590), radius: 42, remaining: 45 };
  game.startExtractionObjective({
    sourceId: 'gunnison-extraction-countdown',
    position: zone.position,
    radius: 42,
    mechanism: 'evacuation_countdown',
    countdownSeconds: 45,
  }, zone);
  const result = game.updateExtractionObjective(46);
  assert.equal(result.state, 'failed');
  assert.equal(game.player.health, 52);
  assert.equal(game.player.energy, 0);
  assert.equal(game.player.isCloaked, false);
  assert.deepEqual(game.player.lastStatus, { status: 'suppression', duration: 6 });
  assert.equal(game.lastMigration.options.forced, true);
  assert.equal(updates.at(-1).state, 'failed');
  assert.equal(game.updateExtractionObjective(1), result, 'la conséquence ne doit pas se répéter');
});

test('le résultat d’extraction disparaît après quatre secondes de simulation sans minuterie globale', () => {
  const { game } = makeObjectiveGame(new THREE.Vector3(0, 0, -590));
  game.startExtractionObjective({
    sourceId: 'gunnison-extraction-countdown',
    position: new THREE.Vector3(0, 0, -590),
    radius: 42,
    mechanism: 'evacuation_countdown',
    countdownSeconds: 45,
  });
  const outcome = game.updateExtractionObjective(0.1);
  assert.equal(outcome.state, 'secured');
  assert.equal(outcome.displayRemaining, 4);
  assert.equal(game.updateExtractionObjective(3.99), outcome);
  assert.equal(game.hud.hideCount, 0);
  assert.equal(game.updateExtractionObjective(0.01), null);
  assert.equal(game.extractionOutcome, null);
  assert.equal(game.hud.hideCount, 1);
});

test('le nettoyage annule immédiatement un résultat sans masquage différé résiduel', () => {
  const { game } = makeObjectiveGame(new THREE.Vector3(0, 0, -590));
  game.startExtractionObjective({
    position: new THREE.Vector3(0, 0, -590),
    radius: 42,
    mechanism: 'evacuation_countdown',
    countdownSeconds: 45,
  });
  game.updateExtractionObjective(0.1);
  game.clearExtractionObjective();
  const hiddenAfterCleanup = game.hud.hideCount;
  assert.equal(game.activeExtractionObjective, null);
  assert.equal(game.extractionOutcome, null);
  assert.equal(game.updateExtractionObjective(10), null);
  assert.equal(game.hud.hideCount, hiddenAfterCleanup);
});
