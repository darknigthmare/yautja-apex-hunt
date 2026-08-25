import assert from 'node:assert/strict';
import test from 'node:test';
import { PLAYER_GADGETS } from '../src/data/RuntimeEquipment.js';
import { CURRENT_HUNTS, HUNT_LOCATIONS, getLoreEntryById } from '../src/data/LoreCodex.js';
import { getMediaCoverageById } from '../src/data/MediaCoverageCatalog.js';
import { getYautjaContentById } from '../src/data/YautjaContentCatalog.js';

const EXPECTED_RUNTIME_STATUS = Object.freeze({
  boss_upgrade_predator_2018: 'playable',
  enemy_upgrade_predator_2018: 'playable',
  enemy_modified_predator_hound_2018: 'encounter',
  enemy_stargazer_capture_team: 'encounter',
  enemy_hell_hound_alpha: 'encounter',
  enemy_river_ghost: 'encounter',
  enemy_colonial_marine_smartgunner: 'encounter',
  enemy_weyland_field_synthetic: 'encounter',
  enemy_xeno_facehugger: 'encounter',
  event_stargazer_lab_breach: 'playable',
  vehicle_fugitive_escape_craft: 'encounter',
  tech_predator_killer_armor: 'encounter',
  tech_feral_bolt_launcher: 'playable',
  tech_wolf_dual_plasma: 'playable',
  tech_eye_of_ra_hg: 'playable',
  tech_father_yautja_sword_hg: 'playable',
});

test('la vague Stargazer publie uniquement les surfaces réellement actives', () => {
  Object.entries(EXPECTED_RUNTIME_STATUS).forEach(([id, runtimeStatus]) => {
    const entry = getYautjaContentById(id);
    assert.ok(entry, `${id}: entrée de catalogue absente`);
    assert.equal(entry.runtimeStatus, runtimeStatus, `${id}: statut runtime incorrect`);
  });

  const decoy = getYautjaContentById('tech_apex_decoy');
  const hasRuntimeDecoy = PLAYER_GADGETS.some(({ id }) => id === 'apex_decoy');
  assert.equal(decoy.runtimeStatus, hasRuntimeDecoy ? 'playable' : 'archive');

  assert.equal(getYautjaContentById('tech_predator_killer_armor').gameplay.includes('non équipable'), true);
  assert.equal(getYautjaContentById('boss_upgrade_predator_2018').implementationOriginal, true);
  assert.equal(getYautjaContentById('enemy_stargazer_capture_team').implementationOriginal, true);
  assert.equal(getYautjaContentById('vehicle_fugitive_escape_craft').implementationOriginal, true);
  for (const id of [
    'enemy_hell_hound_alpha', 'enemy_river_ghost', 'enemy_colonial_marine_smartgunner',
    'enemy_weyland_field_synthetic', 'enemy_xeno_facehugger',
    'tech_feral_bolt_launcher', 'tech_wolf_dual_plasma', 'tech_eye_of_ra_hg',
    'tech_father_yautja_sword_hg',
  ]) {
    assert.equal(getYautjaContentById(id)?.implementationOriginal, true, id);
  }
});

test('le Codex relie sans ambiguïté le contrat Upgrade au complexe Stargazer', () => {
  const location = getLoreEntryById('stargazer_blacksite');
  const hunt = getLoreEntryById('upgrade_predator');

  assert.equal(HUNT_LOCATIONS.includes(location), true);
  assert.equal(CURRENT_HUNTS.includes(hunt), true);
  assert.equal(location.sourceTier, 'ORIGINAL');
  assert.equal(location.basisTier, 'SCREEN');
  assert.equal(location.isOriginal, true);
  assert.deepEqual(location.sources, ['thePredator2018']);
  assert.match(location.assetPolicy, /aucun asset officiel/i);

  assert.equal(hunt.sourceTier, 'ORIGINAL');
  assert.equal(hunt.basisTier, 'SCREEN');
  assert.deepEqual(hunt.locationIds, ['stargazer_blacksite']);
  assert.deepEqual(hunt.sources, ['thePredator2018', 'assassin2018Gear']);
  assert.match(hunt.assetPolicy, /aucun modèle, texture ou asset officiel/i);
});

test('The Predator possède une couverture jouable mais honnêtement limitée', () => {
  const coverage = getMediaCoverageById('film_the_predator_2018');
  assert.equal(coverage.gameCoverage.runtimeStatus, 'playable');
  assert.match(coverage.gameCoverage.summary, /chasse originale jouable/i);
  assert.match(coverage.gameCoverage.summary, /ne prétend pas reconstituer le récit complet/i);
  assert.deepEqual(
    coverage.coverageTargets.map(({ id }) => id),
    ['upgrade_predator', 'stargazer_blacksite', 'stargazer_lab_breach'],
  );
});
