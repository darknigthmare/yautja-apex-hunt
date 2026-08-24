import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  POINT_OF_INTEREST_EFFECT_PROFILES,
  applyPointOfInterestEffect,
} from '../src/gameplay/PointOfInterestEffects.js';

const previousWindow = globalThis.window;
globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');
if (previousWindow === undefined) delete globalThis.window;
else globalThis.window = previousWindow;

function makePlayer(overrides = {}) {
  return {
    position: new THREE.Vector3(),
    health: 50,
    maxHealth: 100,
    energy: 50,
    maxEnergy: 100,
    stamina: 50,
    maxStamina: 100,
    honorScore: 0,
    discoveredPoiIds: [],
    addHonor(amount) {
      this.honorScore += amount;
      return amount;
    },
    ...overrides,
  };
}

test('les quatre interactionType publient des profils gameplay distincts et bornés', () => {
  assert.deepEqual(Object.keys(POINT_OF_INTEREST_EFFECT_PROFILES).sort(), [
    'decode_record',
    'scan_archive',
    'scan_trophies',
    'tune_beacon',
  ]);
  assert.notDeepEqual(
    POINT_OF_INTEREST_EFFECT_PROFILES.decode_record,
    POINT_OF_INTEREST_EFFECT_PROFILES.scan_archive,
  );
});

test('decode_record restaure santé et énergie sans dépasser les maximums', () => {
  const player = makePlayer({ health: 92, energy: 88 });
  const effect = applyPointOfInterestEffect(
    { interactionType: 'decode_record', honor: 70 },
    { player },
  );

  assert.equal(player.health, 100);
  assert.equal(player.energy, 100);
  assert.equal(effect.healthRestored, 8);
  assert.equal(effect.energyRestored, 12);
  assert.equal(effect.honorRequested, 70);
  assert.match(effect.detail, /SANTÉ \+8/);
  assert.match(effect.detail, /ÉNERGIE \+12/);
});

test('tune_beacon réutilise le scan existant en longue portée', () => {
  const calls = [];
  const effect = applyPointOfInterestEffect(
    { interactionType: 'tune_beacon', honor: 75 },
    {
      player: makePlayer(),
      activateScan(options) {
        calls.push(options);
        return 3;
      },
    },
  );

  assert.deepEqual(calls, [{ scanDuration: 10, scanRadius: 150 }]);
  assert.equal(effect.revealedCount, 3);
  assert.equal(effect.scanDuration, 10);
  assert.equal(effect.scanRadius, 150);
  assert.match(effect.detail, /3 SIGNATURES RÉVÉLÉES/);
});

test('scan_archive fournit un balayage local plus court et une recharge énergétique bornée', () => {
  const calls = [];
  const player = makePlayer({ energy: 95 });
  const effect = applyPointOfInterestEffect(
    { interactionType: 'scan_archive', honor: 90 },
    {
      player,
      activateScan(options) {
        calls.push(options);
        return 2;
      },
    },
  );

  assert.deepEqual(calls, [{ scanDuration: 4, scanRadius: 75 }]);
  assert.equal(player.energy, 100);
  assert.equal(effect.energyRestored, 5);
  assert.equal(effect.revealedCount, 2);
  assert.match(effect.detail, /CARTOGRAPHIE TACTIQUE/);
  assert.match(effect.detail, /ÉNERGIE \+5/);
});

test('scan_trophies restaure l endurance et augmente l honneur une seule fois dans son profil', () => {
  const player = makePlayer({ stamina: 82 });
  const effect = applyPointOfInterestEffect(
    { interactionType: 'scan_trophies', honor: 100 },
    { player },
  );

  assert.equal(player.stamina, 100);
  assert.equal(effect.staminaRestored, 18);
  assert.equal(effect.honorRequested, 120);
  assert.equal(effect.honorBonus, 20);
  assert.match(effect.detail, /ENDURANCE \+18/);
  assert.match(effect.detail, /BONUS D'HONNEUR ×1,2/);
});

test('le dispatcher Game branche tune_beacon sur activateVehicleScan', () => {
  const game = Object.create(Game.prototype);
  const calls = [];
  game.player = makePlayer();
  game.activateVehicleScan = (options) => {
    calls.push(options);
    return 4;
  };

  const effect = game.dispatchPointOfInterestEffect({
    interactionType: 'tune_beacon',
    honor: 80,
  });

  assert.deepEqual(calls, [{ scanDuration: 10, scanRadius: 150 }]);
  assert.equal(effect.revealedCount, 4);
});

test('le verrou persistant empêche de répéter effet, bonus d honneur et sauvegarde', () => {
  const game = Object.create(Game.prototype);
  const messages = [];
  let saves = 0;
  game.trophyHarvested = false;
  game.attemptTrophyHarvest = () => {};
  game.eventDirector = { tryInteract: () => false };
  game.environment = {
    interactWithPointOfInterest() {
      return {
        type: 'point_of_interest',
        poiId: 'jungle-poi-trophy-markers',
        interactionType: 'scan_trophies',
        label: 'Arbre des prises anciennes',
        message: 'LIGNÉE DE CHASSE ARCHIVÉE',
        honor: 100,
      };
    },
    setDiscoveredPoiIds() {},
  };
  game.player = makePlayer({ stamina: 60 });
  game.hud = { showLogMessage(message) { messages.push(message); } };
  game.saveProgress = () => { saves += 1; };
  game.activateVehicleScan = () => 0;

  assert.equal(game.attemptContextInteraction(), true);
  assert.equal(game.player.stamina, 100);
  assert.equal(game.player.honorScore, 120);
  assert.deepEqual(game.player.discoveredPoiIds, ['jungle-poi-trophy-markers']);
  assert.equal(saves, 1);
  assert.match(messages[0], /ENDURANCE \+40/);
  assert.match(messages[0], /BONUS D'HONNEUR ×1,2/);
  assert.match(messages[0], /\+120 HONNEUR/);

  assert.equal(game.attemptContextInteraction(), false);
  assert.equal(game.player.stamina, 100);
  assert.equal(game.player.honorScore, 120);
  assert.equal(saves, 1);
  assert.equal(messages.length, 1);
});
