import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { DEFAULT_SETTINGS } from '../src/data/GameConfig.js';
import { YautjaPlayer } from '../src/entities/YautjaPlayer.js';
import { SaveManager } from '../src/engine/SaveManager.js';
import { Environment } from '../src/world/Environment.js';

const previousWindow = globalThis.window;
globalThis.window = { addEventListener() {} };
const { Game } = await import('../src/main.js');
if (previousWindow === undefined) delete globalThis.window;
else globalThis.window = previousWindow;

function makeStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

function makeSavePlayer(discoveredPoiIds) {
  return {
    honorScore: 1000,
    lifetimeHonor: 1000,
    honorRankIndex: 1,
    hasTriBeam: false,
    hasAntiAcidCloak: false,
    hasScopeZoom: false,
    currentSkinId: 'jungle_1987',
    completedHunts: [],
    discoveredPoiIds,
  };
}

test('le joueur initialise un registre de POI persistant indépendant des chasses', () => {
  const player = new YautjaPlayer(new THREE.Scene());
  assert.deepEqual(player.discoveredPoiIds, []);
});

test('SaveManager v4 déduplique les POI et recharge les anciennes sauvegardes sans ce champ', () => {
  globalThis.localStorage = makeStorage();
  const manager = new SaveManager();
  const source = makeSavePlayer([
    'jungle-poi-plasma-scars',
    'jungle-poi-plasma-scars',
    'hive-poi-nursery',
    42,
  ]);

  const payload = manager.createPayload(source, DEFAULT_SETTINGS);
  assert.deepEqual(payload.player.discoveredPoiIds, [
    'jungle-poi-plasma-scars',
    'hive-poi-nursery',
  ]);
  localStorage.setItem(manager.STORAGE_KEY, JSON.stringify(payload));

  const restored = makeSavePlayer([]);
  assert.equal(manager.load(restored).loaded, true);
  assert.deepEqual(restored.discoveredPoiIds, [
    'jungle-poi-plasma-scars',
    'hive-poi-nursery',
  ]);

  globalThis.localStorage = makeStorage();
  const olderV4 = manager.createPayload(makeSavePlayer(undefined), DEFAULT_SETTINGS);
  delete olderV4.player.discoveredPoiIds;
  localStorage.setItem(manager.STORAGE_KEY, JSON.stringify(olderV4));
  const restoredOlderV4 = makeSavePlayer(['valeur-obsolète']);
  assert.equal(manager.load(restoredOlderV4).loaded, true);
  assert.deepEqual(restoredOlderV4.discoveredPoiIds, []);

  globalThis.localStorage = makeStorage();
  localStorage.setItem(manager.VERSION3_KEY, JSON.stringify({
    version: 3,
    savedAt: '2026-08-20T00:00:00.000Z',
    player: {
      honorScore: 250,
      honorRankIndex: 1,
      currentSkinId: 'jungle_1987',
      completedHunts: [],
    },
    settings: DEFAULT_SETTINGS,
  }));
  const restoredV3 = makeSavePlayer(['valeur-obsolète']);
  const migration = manager.load(restoredV3);
  assert.equal(migration.loaded, true);
  assert.equal(migration.migrated, true);
  assert.deepEqual(restoredV3.discoveredPoiIds, []);
  assert.deepEqual(
    JSON.parse(localStorage.getItem(manager.STORAGE_KEY)).player.discoveredPoiIds,
    [],
  );
});

test('Environment restaure le rendu analysé avant ou après le build et bloque toute seconde récompense', () => {
  const environment = new Environment(new THREE.Scene());
  const discoveredId = 'jungle-poi-plasma-scars';
  assert.deepEqual(environment.setDiscoveredPoiIds([discoveredId, discoveredId, 7]), [discoveredId]);

  environment.setBiome('jungle');
  const discovered = environment.pointsOfInterest.find(({ id }) => id === discoveredId);
  assert.equal(discovered.scanned, true);
  assert.equal(discovered.mesh.userData.scanned, true);
  assert.equal(discovered.indicator.material.opacity, 0.54);
  assert.equal(environment.getNearbyPointOfInterest(discovered.position.clone()), null);
  assert.equal(environment.interactWithPointOfInterest(discovered.position.clone()), false);

  environment.setBiome('hive_lv426');
  const hivePoi = environment.pointsOfInterest[0];
  assert.equal(hivePoi.scanned, false);
  environment.setDiscoveredPoiIds([discoveredId, hivePoi.id]);
  assert.equal(hivePoi.scanned, true);
  environment.setDiscoveredPoiIds([discoveredId]);
  assert.equal(hivePoi.scanned, false);
  assert.equal(hivePoi.indicator.material.opacity, hivePoi.indicator.userData.poiDiscoveryVisual.opacity);

  environment.setBiome('jungle');
  assert.equal(environment.pointsOfInterest.find(({ id }) => id === discoveredId).scanned, true);
  environment.dispose();
});

test('un POI découvert en jeu reste bloqué après changement de biome et reconstruction', () => {
  const environment = new Environment(new THREE.Scene());
  environment.setBiome('ryushi_desert');
  const pointOfInterest = environment.pointsOfInterest[0];
  const position = pointOfInterest.position.clone();
  const firstResult = environment.interactWithPointOfInterest(position);
  assert.equal(firstResult.poiId, pointOfInterest.id);
  assert.equal(environment.discoveredPoiIds.has(pointOfInterest.id), true);

  environment.setBiome('yautja_prime');
  environment.setBiome('ryushi_desert');
  const rebuilt = environment.pointsOfInterest.find(({ id }) => id === pointOfInterest.id);
  assert.equal(rebuilt.scanned, true);
  assert.equal(environment.interactWithPointOfInterest(rebuilt.position.clone()), false);
  environment.dispose();
});

test('le wiring principal enregistre l id avant la sauvegarde et refuse un résultat déjà connu', () => {
  const game = Object.create(Game.prototype);
  const messages = [];
  const synchronized = [];
  let saves = 0;
  game.trophyHarvested = false;
  game.attemptTrophyHarvest = () => {};
  game.eventDirector = { tryInteract: () => false };
  game.environment = {
    interactWithPointOfInterest() {
      return {
        type: 'point_of_interest',
        poiId: 'prime-poi-elder-law',
        label: 'Stèle de la loi du clan',
        honor: 90,
        message: 'LOI DU CLAN ARCHIVÉE',
      };
    },
    setDiscoveredPoiIds(ids) { synchronized.push([...ids]); },
  };
  game.player = {
    position: new THREE.Vector3(),
    honorScore: 0,
    discoveredPoiIds: [],
    addHonor(amount) { this.honorScore += amount; return amount; },
  };
  game.hud = { showLogMessage(message) { messages.push(message); } };
  game.saveProgress = () => { saves += 1; };

  assert.equal(game.attemptContextInteraction(), true);
  assert.deepEqual(game.player.discoveredPoiIds, ['prime-poi-elder-law']);
  assert.deepEqual(synchronized, [['prime-poi-elder-law']]);
  assert.equal(game.player.honorScore, 90);
  assert.equal(saves, 1);
  assert.match(messages[0], /\+90 HONNEUR/);

  assert.equal(game.attemptContextInteraction(), false);
  assert.equal(game.player.honorScore, 90);
  assert.equal(saves, 1);
});
