import test from 'node:test';
import assert from 'node:assert/strict';
import { HUNT_DEFINITIONS } from '../src/data/GameConfig.js';
import { CANON_PREY_CATALOG } from '../src/data/PreyTaxonomyAndCrossoverCatalog.js';
import { TROPHY_CRAFT_RECIPES } from '../src/gameplay/YautjaTrophyCraftsmanshipForgeSystem.js';
import { normalizeCraftRecipeReference, PHYSICAL_NPC_TROPHY_SOURCE_IDS } from '../src/gameplay/CraftRecipeReferences.js';
import { AVAILABLE_HUNT_NPC_ARCHETYPES } from '../src/entities/HuntNPC.js';

const referenceFor = id => normalizeCraftRecipeReference(TROPHY_CRAFT_RECIPES.find(recipe => recipe.id === id));

test('every recipe has an explicit obtainable-material contract or an archive reason', () => {
  const preyIds = new Set(CANON_PREY_CATALOG.map(p => p.id));
  let physical = 0, archive = 0;
  for (const recipe of TROPHY_CRAFT_RECIPES) {
    const reference = normalizeCraftRecipeReference(recipe);
    assert.equal(reference.sourceStatus, 'original_adaptation');
    assert.equal(reference.fidelityVerified, false);
    assert.ok(reference.canonicalMaterialLabel && reference.availabilityReason);
    assert.ok(Number.isInteger(reference.requiredTrophyCount) && reference.requiredTrophyCount >= 1);
    assert.ok(reference.referencePreyIds.every(id => preyIds.has(id)), recipe.id);
    if (reference.materialAvailability === 'physical_hunt') {
      physical++;
      assert.ok(reference.trophySourceIds.length);
      assert.ok(reference.trophySourceIds.every(id => HUNT_DEFINITIONS[id] || PHYSICAL_NPC_TROPHY_SOURCE_IDS.includes(id)), recipe.id);
      assert.ok(reference.trophySourceIds.every(id => !id.startsWith('prey_') && !id.startsWith('crossover_')),
        'a holographic record cannot stand in for a physical material');
    } else {
      archive++;
      assert.deepEqual(reference.trophySourceIds, [], recipe.id);
    }
  }
  assert.equal(physical, 16);
  assert.equal(archive, 34);
  assert.ok(PHYSICAL_NPC_TROPHY_SOURCE_IDS.every(id => AVAILABLE_HUNT_NPC_ARCHETYPES[id]), 'harvested NPC sources must physically exist');
});

test('physical sources preserve the exact creature instead of substituting another defeated boss', () => {
  assert.deepEqual(referenceFor('craft_mask_goliath_bone').trophySourceIds, ['goliath']);
  assert.deepEqual(referenceFor('craft_mask_broken_tusk_rhynth').trophySourceIds, ['rhynth_titan']);
  assert.deepEqual(referenceFor('craft_armor_vydrach_sky_cloak').trophySourceIds, ['vydrach_prime']);
  assert.deepEqual(referenceFor('craft_shield_kalisk_bone').trophySourceIds, ['kalisk']);
  assert.deepEqual(referenceFor('craft_shield_xeno_warrior').trophySourceIds, ['xeno_warrior', 'grid_alien']);
  for (const id of ['craft_shield_engineer_obsidian', 'craft_weapon_queen_spine_harpoon',
    'craft_shield_mgalekgolo_carapace', 'craft_shield_skynet_hk_alloy', 'craft_mask_xeno_skull_dome']) {
    assert.equal(referenceFor(id).materialAvailability, 'archive_only', id);
  }
  assert.deepEqual(referenceFor('craft_armor_drone_chitin_greaves').trophySourceIds, ['xeno_drone']);
  assert.deepEqual(referenceFor('craft_weapon_runner_tail_scythe').trophySourceIds, ['xeno_runner']);
});

test('multi-component trophies retain their explicit quantity and unknown recipes never mint a material source', () => {
  assert.equal(referenceFor('craft_banner_hive_conquest_spire').requiredTrophyCount, 10);
  assert.equal(referenceFor('craft_banner_tail_trophy_flag').requiredTrophyCount, 5);
  assert.equal(referenceFor('craft_armor_tail_vertebrae_belt').requiredTrophyCount, 12);
  const unknown = normalizeCraftRecipeReference({ id: 'missing', requiredTrophy: 'Unlisted material' });
  assert.equal(unknown.materialAvailability, 'archive_only');
  assert.deepEqual(unknown.trophySourceIds, []);
});
