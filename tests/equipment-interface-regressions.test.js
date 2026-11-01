import assert from 'node:assert/strict';
import test from 'node:test';
import { PLAYABLE_WEAPONS } from '../src/data/RuntimeEquipment.js';
import { TROPHY_CRAFT_RECIPES, YautjaTrophyCraftsmanshipForgeSystem } from '../src/gameplay/YautjaTrophyCraftsmanshipForgeSystem.js';
import { SUPPORTED_CRAFT_STATS } from '../src/gameplay/CraftedEquipmentRuntime.js';
import { getEquipmentIconSvg, EQUIPMENT_ICON_IDS } from '../src/ui/EquipmentIcons.js';
import { getCraftsmanshipItemSvg } from '../src/ui/CanonLogosAndEmblems.js';
import { getCrossoverLogo } from '../src/ui/CanonLogosAndEmblems.js';
import { getHuntCardLogo, getYautjaClanLogo } from '../src/ui/CanonLogosAndEmblems.js';
import { CROSSOVER_UNIVERSE_ENCOUNTERS } from '../src/data/CrossoverUniverseEncounters.js';
import { formatCraftStat, getCraftCardState } from '../src/ui/TrophyCraftingView.js';

test('every playable weapon and every craft recipe has its own equipment silhouette', () => {
  const icons = new Set();
  for (const weapon of PLAYABLE_WEAPONS) {
    assert.ok(EQUIPMENT_ICON_IDS.includes(weapon.id), `${weapon.name} has no weapon icon`);
    const icon = getEquipmentIconSvg(weapon.id);
    assert.match(icon, /aria-hidden="true"/);
    icons.add(icon);
  }
  assert.equal(icons.size, PLAYABLE_WEAPONS.length);
  const shapes = new Set();
  for (const recipe of TROPHY_CRAFT_RECIPES) {
    const icon = getCraftsmanshipItemSvg(recipe.id);
    assert.doesNotMatch(icon, /craft-default/, `${recipe.name} still uses the generic fallback`);
    assert.match(icon, /viewBox="0 0 80 80"/);
    shapes.add(icon.replace(/aria-label="[^"]*"/g, ''));
  }
  assert.equal(shapes.size, TROPHY_CRAFT_RECIPES.length);
});

test('all documented universe encounters retain their parent universe emblem', () => {
  assert.equal(CROSSOVER_UNIVERSE_ENCOUNTERS.length, 300);
  for (const encounter of CROSSOVER_UNIVERSE_ENCOUNTERS) {
    assert.equal(getCrossoverLogo(encounter.id), getCrossoverLogo(encounter.parentId), encounter.id);
  }
});

test('the three declared original hunts have distinct contract emblems', () => {
  const icons = ['vydrach_prime', 'rhynth_titan', 'xeno_king'].map(id => getHuntCardLogo(id));
  assert.equal(new Set(icons).size, 3);
  for (const icon of icons) {
    assert.notEqual(icon, getYautjaClanLogo());
    assert.match(icon, /logo-hunt-/);
  }
});

test('target cards identify the creature rather than the opposing human or Engineer faction', () => {
  assert.match(getHuntCardLogo('grid_alien'), /logo-hunt-grid/);
  assert.doesNotMatch(getHuntCardLogo('grid_alien'), /logo-engineer/);
  assert.match(getHuntCardLogo('city_hunter'), /logo-hunt-city/);
  assert.doesNotMatch(getHuntCardLogo('city_hunter'), /logo-owlf/);
  assert.match(getHuntCardLogo('upgrade_predator'), /logo-hunt-upgrade/);
  assert.doesNotMatch(getHuntCardLogo('upgrade_predator'), /logo-stargazer/);
});

test('workshop requirements distinguish physical stock from unavailable archives and honor', () => {
  const forge = new YautjaTrophyCraftsmanshipForgeSystem('interface-regression');
  const physical = TROPHY_CRAFT_RECIPES.find(recipe => forge.canCraft(recipe.id, 0).materialAvailability === 'physical_hunt');
  const archive = TROPHY_CRAFT_RECIPES.find(recipe => forge.canCraft(recipe.id, 999999).reason === 'unavailable_material_source');
  assert.ok(physical && archive);
  const missing = getCraftCardState(physical, { check: forge.canCraft(physical.id, 0) });
  assert.equal(missing.disabled, true);
  assert.ok(missing.requirements.some(text => text.includes('honneur manquants')));
  assert.ok(missing.requirements.some(text => text.includes('en réserve')));
  const unavailable = getCraftCardState(archive, { check: forge.canCraft(archive.id, 999999) });
  assert.equal(unavailable.disabled, true);
  assert.match(unavailable.actionLabel, /ARCHIVE/);
  assert.ok(unavailable.requirements.length > 0);
  assert.ok(unavailable.requirements.every(text => !text.includes('honneur manquants')));
  assert.equal(unavailable.sourceLabel, 'CRÉATION DU CLAN');
});

test('craft cards show implemented effects with their real units, keeping archive powers separate', () => {
  const recipe = { id: 'fixture', name: 'Fixture', stats: { acidImmunity: 1, damage: 45, sprintCostReduction: 20, gravityField: 35, colossusBreaker: true } };
  const view = getCraftCardState(recipe, { crafted: true, equipped: true, supportedStats: SUPPORTED_CRAFT_STATS });
  assert.equal(view.action, 'unequip');
  assert.equal(view.disabled, false);
  assert.deepEqual(view.activeStats.map(stat => stat.key), ['acidImmunity', 'damage', 'sprintCostReduction']);
  assert.equal(view.activeStats[0].value, '100 %');
  assert.equal(view.activeStats[1].value, '+45 pts');
  assert.equal(view.activeStats[2].value, '−20 %');
  assert.equal(formatCraftStat(NaN, 'points'), null);
  assert.equal(formatCraftStat(true, 'points'), null);
  assert.equal(formatCraftStat(Infinity, 'percent'), null);
  const royal = getCraftCardState({ ...recipe, stats: { honorGainBonus: 50, queenDominationBonus: 50 } }, { supportedStats: SUPPORTED_CRAFT_STATS });
  assert.deepEqual(royal.activeStats.map(stat => stat.key), ['queenDominationBonus']);
});
