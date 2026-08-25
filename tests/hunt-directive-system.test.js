import assert from 'node:assert/strict';
import test from 'node:test';
import {
  HUNT_DIRECTIVES,
  createDirectiveProgress,
  getDirectiveProgressSummary,
  getDirectiveSchedule,
  getHuntDirective,
  recordDirectiveNpcDefeat,
  resolveDirectiveBiome,
  resolveDirectiveReward,
} from '../src/gameplay/HuntDirectiveSystem.js';

function completeDirective(id) {
  const directive = getHuntDirective(id);
  return directive.objectives.reduce(
    (progress, entry) => recordDirectiveNpcDefeat(progress, entry.npcType),
    createDirectiveProgress(id),
  );
}

test('les cinq directives et leurs collections imbriquées sont immuables', () => {
  assert.deepEqual(Object.keys(HUNT_DIRECTIVES), [
    'standard_hunt',
    'jungle_fireteam',
    'blooding_rite',
    'killer_eras',
    'deathworld_protocol',
  ]);
  assert.ok(Object.isFrozen(HUNT_DIRECTIVES));

  for (const directive of Object.values(HUNT_DIRECTIVES)) {
    assert.ok(Object.isFrozen(directive), directive.id);
    assert.ok(Object.isFrozen(directive.objectives), directive.id);
    assert.ok(Object.isFrozen(directive.schedule), directive.id);
    directive.objectives.forEach((entry) => assert.ok(Object.isFrozen(entry), entry.id));
    directive.schedule.forEach((entry) => assert.ok(Object.isFrozen(entry), entry.npcType));
  }

  assert.throws(() => {
    HUNT_DIRECTIVES.jungle_fireteam.rewardMultiplier = 99;
  }, TypeError);
  assert.equal(HUNT_DIRECTIVES.jungle_fireteam.rewardMultiplier, 1.3);
});

test('les identifiants inconnus retombent explicitement sur la chasse standard', () => {
  const fallback = getHuntDirective('directive_absente');
  assert.equal(fallback, HUNT_DIRECTIVES.standard_hunt);

  const progress = createDirectiveProgress('directive_absente');
  assert.equal(progress.directiveId, 'standard_hunt');
  assert.equal(progress.requestedDirectiveId, 'directive_absente');
  assert.equal(progress.fallbackUsed, true);
  assert.deepEqual(progress.objectiveCounts, {});
  assert.deepEqual(JSON.parse(JSON.stringify(progress)), progress);

  const summary = getDirectiveProgressSummary(progress);
  assert.equal(summary.isComplete, true);
  assert.equal(summary.completionRatio, 1);
});

test('le biome recommandé prime, tandis que la chasse standard conserve la demande', () => {
  assert.equal(resolveDirectiveBiome('jungle_fireteam', 'genna'), 'jungle');
  assert.equal(resolveDirectiveBiome('blooding_rite', 'jungle'), 'hive_lv426');
  assert.equal(resolveDirectiveBiome('killer_eras', 'jungle'), 'yautja_prime');
  assert.equal(resolveDirectiveBiome('deathworld_protocol', 'jungle'), 'genna_deathworld');
  assert.equal(resolveDirectiveBiome('standard_hunt', 'hive_lv426'), 'hive_lv426');
  assert.equal(resolveDirectiveBiome('inconnue', 'ryushi_desert'), 'ryushi_desert');
  assert.equal(resolveDirectiveBiome('standard_hunt', ''), null);
});

test('la progression est fonctionnelle, sérialisable et limitée aux objectifs', () => {
  const initial = createDirectiveProgress('jungle_fireteam');
  const ignored = recordDirectiveNpcDefeat(initial, 'xeno_drone');
  assert.notEqual(ignored, initial);
  assert.deepEqual(initial.objectiveCounts, {
    jungle_scout: 0,
    jungle_gunner: 0,
    jungle_trapper: 0,
  });
  assert.deepEqual(ignored.objectiveCounts, initial.objectiveCounts);

  const scoutDefeated = recordDirectiveNpcDefeat(ignored, 'jungle_scout');
  const duplicateScout = recordDirectiveNpcDefeat(scoutDefeated, 'jungle_scout');
  assert.equal(duplicateScout.objectiveCounts.jungle_scout, 1);
  assert.equal(getDirectiveProgressSummary(duplicateScout).completedObjectives, 1);

  const restored = JSON.parse(JSON.stringify(duplicateScout));
  const gunnerDefeated = recordDirectiveNpcDefeat(restored, 'jungle_gunner');
  const complete = recordDirectiveNpcDefeat(gunnerDefeated, 'jungle_trapper');
  const summary = getDirectiveProgressSummary(complete);
  assert.equal(summary.completedObjectives, 3);
  assert.equal(summary.remainingObjectives, 0);
  assert.equal(summary.completionRatio, 1);
  assert.equal(summary.isComplete, true);
});

test('le bonus de récompense ne s’applique qu’après tous les objectifs', () => {
  const incomplete = recordDirectiveNpcDefeat(
    createDirectiveProgress('jungle_fireteam'),
    'jungle_scout',
  );
  assert.equal(resolveDirectiveReward('jungle_fireteam', 1000, incomplete), 1000);
  assert.equal(resolveDirectiveReward('jungle_fireteam', 1000, completeDirective('jungle_fireteam')), 1300);
  assert.equal(resolveDirectiveReward('blooding_rite', 1000, completeDirective('blooding_rite')), 1300);
  assert.equal(resolveDirectiveReward('killer_eras', 1000, completeDirective('killer_eras')), 1400);
  assert.equal(resolveDirectiveReward('deathworld_protocol', 1000, completeDirective('deathworld_protocol')), 1350);
  assert.equal(resolveDirectiveReward('standard_hunt', 1000), 1000);
  assert.equal(resolveDirectiveReward('directive_absente', 1000), 1000);
  assert.equal(resolveDirectiveReward('standard_hunt', Number.NaN), 0);
});

test('chaque planning est trié, immuable et couvre exactement ses objectifs', () => {
  assert.deepEqual(getDirectiveSchedule('standard_hunt'), []);
  assert.equal(getDirectiveSchedule('directive_absente'), HUNT_DIRECTIVES.standard_hunt.schedule);

  for (const directive of Object.values(HUNT_DIRECTIVES).filter(({ objectives }) => objectives.length > 0)) {
    const schedule = getDirectiveSchedule(directive.id);
    assert.equal(schedule, directive.schedule);
    assert.ok(Object.isFrozen(schedule));
    assert.deepEqual(
      schedule.map(({ npcType }) => npcType),
      directive.objectives.map(({ npcType }) => npcType),
      directive.id,
    );
    schedule.forEach((entry, index) => {
      assert.equal(entry.kind, 'directive_wave');
      assert.equal(entry.type, 'directive_wave');
      assert.equal(entry.count, 1);
      assert.deepEqual(entry.enemyTypes, [entry.npcType]);
      assert.ok(Object.isFrozen(entry.enemyTypes), `${directive.id}:${entry.npcType}`);
      if (index > 0) assert.ok(entry.at > schedule[index - 1].at, directive.id);
    });
    assert.throws(() => schedule.push({ at: 999, kind: 'directive_wave' }), TypeError);
  }
});
