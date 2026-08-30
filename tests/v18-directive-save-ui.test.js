import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { BIOME_DEFINITIONS } from '../src/data/GameConfig.js';
import { DEFAULT_CUSTOMIZATION } from '../src/data/RuntimeEquipment.js';
import { SaveManager } from '../src/engine/SaveManager.js';
import {
  AVAILABLE_HUNT_NPC_ARCHETYPES,
  resolveHuntNpcType,
} from '../src/entities/HuntNPC.js';
import { HUNT_DIRECTIVES } from '../src/gameplay/HuntDirectiveSystem.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function read(relativePath) {
  return readFileSync(join(ROOT, relativePath), 'utf8');
}

function makeStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

function withStorage(callback) {
  const previousStorage = globalThis.localStorage;
  const storage = makeStorage();
  globalThis.localStorage = storage;
  try {
    return callback(storage);
  } finally {
    if (previousStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = previousStorage;
  }
}

function makePlayer() {
  return {
    honorScore: 1200,
    lifetimeHonor: 1800,
    honorRankIndex: 1,
    hasTriBeam: false,
    hasAntiAcidCloak: false,
    hasScopeZoom: false,
    currentSkinId: DEFAULT_CUSTOMIZATION.armorPresetId,
    customization: { ...DEFAULT_CUSTOMIZATION },
    completedHunts: [],
    completedDirectiveIds: [],
    discoveredPoiIds: [],
    unlockedTechIds: [],
    unlockedWeaponIds: [],
    unlockedCosmeticIds: [],
  };
}

function tagWithId(html, id) {
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = html.match(new RegExp(`<([a-z][\\w-]*)\\b[^>]*\\bid="${escapedId}"[^>]*>`, 'i'));
  assert.ok(match, `élément DOM absent: #${id}`);
  return { tagName: match[1].toLowerCase(), source: match[0] };
}

function methodSection(source, methodName, nextMethodName) {
  const start = source.indexOf(`  ${methodName}(`);
  assert.notEqual(start, -1, `méthode absente: ${methodName}`);
  const end = nextMethodName ? source.indexOf(`  ${nextMethodName}(`, start + 1) : source.length;
  assert.notEqual(end, -1, `borne de méthode absente: ${nextMethodName}`);
  return source.slice(start, end);
}

test('SaveManager v4 round-trips and deduplicates completedDirectiveIds', () => {
  withStorage(() => {
    const manager = new SaveManager();
    const source = makePlayer();
    source.completedDirectiveIds = [
      'jungle_fireteam',
      'jungle_fireteam',
      'killer_eras',
      'killer_eras',
      'deathworld_protocol',
    ];

    assert.equal(manager.save(source), true);
    const persisted = JSON.parse(localStorage.getItem(manager.STORAGE_KEY));
    assert.deepEqual(persisted.player.completedDirectiveIds, [
      'jungle_fireteam',
      'killer_eras',
      'deathworld_protocol',
    ]);

    const restored = makePlayer();
    restored.completedDirectiveIds = ['stale-local-value'];
    const result = manager.load(restored);
    assert.equal(result.loaded, true);
    assert.equal(result.migrated, false);
    assert.deepEqual(restored.completedDirectiveIds, [
      'jungle_fireteam',
      'killer_eras',
      'deathworld_protocol',
    ]);
  });
});

test('an older v4 payload without completedDirectiveIds restores an empty collection', () => {
  withStorage(() => {
    const manager = new SaveManager();
    localStorage.setItem(manager.STORAGE_KEY, JSON.stringify({
      version: 4,
      savedAt: '2026-08-24T12:00:00.000Z',
      player: {
        honorScore: 900,
        lifetimeHonor: 1200,
        honorRankIndex: 1,
        currentSkinId: DEFAULT_CUSTOMIZATION.armorPresetId,
        customization: { ...DEFAULT_CUSTOMIZATION },
        completedHunts: ['goliath'],
      },
      settings: {},
    }));

    const restored = makePlayer();
    restored.completedDirectiveIds = ['must-be-replaced'];
    const result = manager.load(restored);
    assert.equal(result.loaded, true);
    assert.equal(result.migrated, false);
    assert.deepEqual(restored.completedDirectiveIds, []);
  });
});

test('directive selection, preview, HUD and result expose a complete accessible DOM contract', () => {
  const html = read('index.html');
  const selector = tagWithId(html, 'directive-selector');
  assert.equal(selector.tagName, 'select');
  assert.match(selector.source, /aria-describedby="directive-preview-description"/);
  assert.match(html, /<label\b[^>]*for="directive-selector"[^>]*>/i);

  for (const id of [
    'directive-preview',
    'directive-preview-title',
    'directive-preview-reward',
    'directive-preview-status',
    'directive-preview-description',
    'directive-preview-biome',
    'directive-preview-objectives',
    'directive-hud-title',
    'directive-hud-progress',
    'directive-hud-objective',
  ]) {
    tagWithId(html, id);
  }

  const directiveHud = tagWithId(html, 'directive-hud');
  const directiveResult = tagWithId(html, 'directive-result');
  assert.match(directiveHud.source, /aria-live="polite"/);
  assert.match(directiveResult.source, /aria-live="polite"/);

  const hudSource = read('src/HUDManager.js');
  for (const id of ['directive-hud', 'directive-hud-title', 'directive-hud-progress', 'directive-hud-objective']) {
    assert.ok(hudSource.includes(`document.getElementById('${id}')`), `HUD non raccordé: #${id}`);
  }
  assert.match(hudSource, /updateDirectiveStatus\(directive, summary\)/);

  const mainSource = read('src/main.js');
  for (const id of [
    'directive-selector',
    'directive-preview-title',
    'directive-preview-reward',
    'directive-preview-status',
    'directive-preview-description',
    'directive-preview-biome',
    'directive-preview-objectives',
    'directive-result',
  ]) {
    assert.ok(mainSource.includes(`document.getElementById('${id}')`), `UI non raccordée: #${id}`);
  }
});

test('main forwards directive identity and enforces strict capped encounter spawning', () => {
  const mainSource = read('src/main.js');
  const setupUi = methodSection(mainSource, 'setupUIButtons', 'setupHubTouchControls');
  const deployLoadout = methodSection(mainSource, 'deployPreparedHunt', 'setupHuntLoadoutControls');
  const startHunt = methodSection(mainSource, 'startHunt', 'cleanupHunt');
  const spawnNpc = methodSection(mainSource, 'spawnEncounterNpc', 'spawnEncounterGroup');
  const spawnGroup = methodSection(mainSource, 'spawnEncounterGroup', 'spawnEnemyTracer');

  assert.match(mainSource, /import \{ HuntNPC, resolveHuntNpcType \} from '\.\/entities\/HuntNPC\.js';/);
  assert.match(mainSource, /const MAX_ACTIVE_HUNT_NPCS = 24;/);
  assert.match(setupUi, /const directiveId = directiveSelector\?\.value \?\? 'standard_hunt';/);
  assert.match(setupUi, /this\.prepareHunt\(huntType, planetType, directiveId\);/);
  assert.match(
    deployLoadout,
    /this\.startHunt\(pending\.huntType, pending\.planetType, pending\.directiveId\);/,
  );

  assert.match(startHunt, /startHunt\(huntType, planetType, directiveId = 'standard_hunt'\)/);
  assert.match(startHunt, /createDirectiveProgress\(directive\.id\)/);
  assert.match(
    startHunt,
    /this\.eventDirector\.start\(\{ huntId: this\.currentHuntType, biomeId: resolvedPlanet, directiveId: directive\.id \}\);/,
  );

  assert.match(spawnNpc, /if \(livingCount >= MAX_ACTIVE_HUNT_NPCS\) return null;/);
  assert.match(spawnNpc, /const type = resolveHuntNpcType\(signal\.enemyType\);/);
  assert.match(spawnNpc, /if \(!type\) \{/);
  assert.match(spawnNpc, /return null;/);
  assert.match(spawnNpc, /new HuntNPC\(type,/);
  assert.match(spawnGroup, /MAX_ACTIVE_HUNT_NPCS - \(this\.activeEnemies \?\? \[\]\)\.filter/);
  assert.match(spawnGroup, /enemyTypes\.slice\(0, count\)/);

  assert.equal(resolveHuntNpcType('jungle_scout'), 'jungle_scout');
  assert.equal(resolveHuntNpcType('scout'), 'jungle_scout');
  assert.equal(resolveHuntNpcType('directive_unknown_enemy'), null);
});

test('main advances directive objectives on NPC defeat and persists trophy rewards', () => {
  const mainSource = read('src/main.js');
  const defeat = methodSection(mainSource, 'handleNpcDefeat', 'spawnBiomeEcology');
  const trophy = methodSection(mainSource, 'attemptTrophyHarvest', 'handlePhysicalCollisions');

  assert.match(defeat, /getDirectiveProgressSummary\(this\.directiveProgress\)/);
  assert.match(defeat, /recordDirectiveNpcDefeat\(this\.directiveProgress, enemy\.type\)/);
  assert.match(defeat, /this\.refreshDirectiveHud\(\)/);
  assert.match(defeat, /completedObjectives > previousSummary\.completedObjectives/);

  assert.match(trophy, /getHuntDirective\(this\.currentDirectiveId\)/);
  assert.match(trophy, /getDirectiveProgressSummary\(this\.directiveProgress\)/);
  assert.match(trophy, /resolveDirectiveReward\(directive\.id, baseReward, this\.directiveProgress\)/);
  assert.match(trophy, /directive\.id !== 'standard_hunt' && summary\.isComplete/);
  assert.match(trophy, /new Set\(\[\.\.\.\(this\.player\.completedDirectiveIds \?\? \[\]\), directive\.id\]\)/);
  assert.match(trophy, /this\.player\.addHonor\(totalReward\)/);
  assert.match(trophy, /this\.saveProgress\(\);/);

  const completionIndex = trophy.indexOf('this.player.completedDirectiveIds =');
  const rewardIndex = trophy.indexOf('this.player.addHonor(totalReward)');
  const persistenceIndex = trophy.indexOf('this.saveProgress();');
  assert.ok(completionIndex >= 0 && completionIndex < persistenceIndex);
  assert.ok(rewardIndex >= 0 && rewardIndex < persistenceIndex);
});

test('every directive objective and scheduled enemy resolves to a real NPC and configured biome', () => {
  for (const [directiveId, directive] of Object.entries(HUNT_DIRECTIVES)) {
    assert.equal(directive.id, directiveId);
    if (directiveId === 'standard_hunt') {
      assert.equal(directive.recommendedBiomeId, null);
    } else {
      assert.ok(
        Object.hasOwn(BIOME_DEFINITIONS, directive.recommendedBiomeId),
        `${directiveId}: biome inconnu ${directive.recommendedBiomeId}`,
      );
    }

    const objectiveTypes = new Set();
    for (const objective of directive.objectives) {
      assert.equal(objective.type, 'npc_defeat');
      assert.ok(
        Object.hasOwn(AVAILABLE_HUNT_NPC_ARCHETYPES, objective.npcType),
        `${directiveId}: archétype objectif inconnu ${objective.npcType}`,
      );
      assert.equal(resolveHuntNpcType(objective.npcType), objective.npcType);
      objectiveTypes.add(objective.npcType);
    }

    for (const event of directive.schedule) {
      assert.ok(
        Object.hasOwn(AVAILABLE_HUNT_NPC_ARCHETYPES, event.npcType),
        `${directiveId}: archétype planifié inconnu ${event.npcType}`,
      );
      assert.ok(objectiveTypes.has(event.npcType), `${directiveId}: vague sans objectif ${event.npcType}`);
      assert.deepEqual(event.enemyTypes, [event.npcType]);
    }
  }
});
