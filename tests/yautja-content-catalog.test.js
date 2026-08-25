import assert from 'node:assert/strict';
import test from 'node:test';
import { LORE_SOURCES } from '../src/data/LoreCodex.js';
import { AVAILABLE_HUNT_NPC_ARCHETYPES } from '../src/entities/HuntNPC.js';
import { HUNT_DIRECTIVES } from '../src/gameplay/HuntDirectiveSystem.js';
import {
  ALL_YAUTJA_CONTENT,
  ARMOR_ACCENTS,
  ARMOR_PALETTES,
  DREAD_PALETTES,
  ENEMY_CATALOG,
  HUNT_BOSS_CATALOG,
  LEVEL_EVENT_CATALOG,
  MASK_VARIANTS,
  SKIN_PALETTES,
  SUPPORT_CATALOG,
  TECH_CATALOG,
  VEHICLE_CATALOG,
  YautjaContentCatalog,
  getYautjaContentById
} from '../src/data/YautjaContentCatalog.js';

const VALID_TIERS = new Set([
  'SCREEN',
  'AVP_SCREEN',
  'LICENSED_SCREEN_DESIGN',
  'LICENSED_EU',
  'MERCH_CONCEPT',
  'ORIGINAL',
]);
const VALID_RUNTIME_STATUSES = new Set(['playable', 'encounter', 'customization', 'gallery', 'archive']);
const ALLOWED_SOURCES = new Set([
  'predator1987',
  'predator2',
  'predators2010',
  'prey2022',
  'thePredator2018',
  'killerOfKillers',
  'badlands2025',
  'assassin2018Gear',
  'badlandsCompanions',
  'huntingGroundsUpdates',
  'badlandsGear',
  'avp2004',
  'avpRequiem2007',
  'huntingGrounds',
  'avpOriginalComics',
  'avpPreyOmnibus',
  'lostTribeDesigns',
  'wolfArsenalDesigns',
]);

test('la passe contenu respecte les seuils de production demandés', () => {
  assert.equal(MASK_VARIANTS.length, 38);
  assert.equal(DREAD_PALETTES.length, 8);
  assert.equal(SKIN_PALETTES.length, 8);
  assert.ok(ARMOR_PALETTES.length >= 10);
  assert.ok(ARMOR_ACCENTS.length >= 6);
  assert.ok(TECH_CATALOG.length >= 12);
  assert.ok(VEHICLE_CATALOG.length >= 6);
  assert.ok(ENEMY_CATALOG.length >= 10);
  assert.ok(LEVEL_EVENT_CATALOG.length >= 8);
  assert.ok(HUNT_BOSS_CATALOG.length >= 5);
  assert.ok(SUPPORT_CATALOG.length >= 8);
  assert.deepEqual({
    technologies: TECH_CATALOG.length,
    vehicles: VEHICLE_CATALOG.length,
    enemies: ENEMY_CATALOG.length,
    events: LEVEL_EVENT_CATALOG.length,
    bosses: HUNT_BOSS_CATALOG.length,
    support: SUPPORT_CATALOG.length,
  }, { technologies: 37, vehicles: 13, enemies: 27, events: 21, bosses: 13, support: 13 });
  assert.equal(TECH_CATALOG.length + VEHICLE_CATALOG.length + ENEMY_CATALOG.length + LEVEL_EVENT_CATALOG.length + HUNT_BOSS_CATALOG.length + SUPPORT_CATALOG.length, 124);
  assert.equal(ALL_YAUTJA_CONTENT.length, 198);
});

test('tous les identifiants sont uniques et chaque fiche expose son statut réel', () => {
  const ids = ALL_YAUTJA_CONTENT.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length, 'un identifiant est dupliqué entre deux catégories');

  for (const entry of ALL_YAUTJA_CONTENT) {
    assert.match(entry.id, /^[a-z0-9_]+$/, `${entry.id}: identifiant non portable`);
    assert.ok(entry.name, `${entry.id}: nom absent`);
    assert.ok(entry.description, `${entry.id}: description absente`);
    assert.ok(VALID_TIERS.has(entry.sourceTier), `${entry.id}: sourceTier inconnu`);
    assert.ok(entry.gameplay || entry.role, `${entry.id}: usage concret absent`);
    assert.ok(VALID_RUNTIME_STATUSES.has(entry.runtimeStatus), `${entry.id}: runtimeStatus inconnu`);
    assert.ok(Array.isArray(entry.sources), `${entry.id}: sources doit être un tableau`);
    assert.equal(getYautjaContentById(entry.id), entry);
  }
});

test('les palettes et les masques fournissent des valeurs numériques exploitables', () => {
  for (const palette of [DREAD_PALETTES, SKIN_PALETTES, ARMOR_PALETTES, ARMOR_ACCENTS]) {
    for (const swatch of palette) {
      assert.equal(typeof swatch.hex, 'number', `${swatch.id}: hex non numérique`);
      assert.ok(Number.isInteger(swatch.hex) && swatch.hex >= 0 && swatch.hex <= 0xffffff);
    }
  }

  for (const mask of MASK_VARIANTS) {
    assert.equal(typeof mask.shape, 'string', `${mask.id}: forme absente`);
    assert.equal(typeof mask.lensColor, 'number', `${mask.id}: lentille absente`);
    assert.equal(typeof mask.armorColor, 'number', `${mask.id}: couleur d'armure absente`);
    assert.equal(typeof mask.scale, 'number', `${mask.id}: échelle absente`);
    assert.ok(mask.scale > 0);
    for (const value of Object.values(mask.geometry)) assert.equal(typeof value, 'number');
  }
});

test('la provenance ne contient aucune source inventée', () => {
  for (const entry of ALL_YAUTJA_CONTENT) {
    for (const sourceId of entry.sources) {
      assert.ok(ALLOWED_SOURCES.has(sourceId), `${entry.id}: source interdite ${sourceId}`);
      assert.ok(sourceId in LORE_SOURCES, `${entry.id}: source absente du Codex ${sourceId}`);
    }

    if (entry.sourceTier === 'ORIGINAL') {
      assert.match(entry.description, /Interprétation originale/i, `${entry.id}: création non signalée`);
      assert.deepEqual(entry.sources, [], `${entry.id}: une création ne doit pas simuler une preuve canon`);
    } else {
      assert.ok(entry.sources.length > 0, `${entry.id}: entrée canon sans source`);
    }
  }
});

test('le catalogue couvre largement les concepts établis à l’écran', () => {
  const categoriesWithScreenEntry = Object.values(YautjaContentCatalog)
    .filter((catalog) => catalog.some(({ sourceTier }) => sourceTier === 'SCREEN'));

  assert.ok(categoriesWithScreenEntry.length >= 4);
  assert.ok(MASK_VARIANTS.some(({ id }) => id === 'mask_jungle_hunter_1987'));
  assert.ok(MASK_VARIANTS.some(({ id }) => id === 'mask_fugitive_2018'));
  assert.ok(MASK_VARIANTS.some(({ id }) => id === 'mask_kok_viking'));
  assert.ok(MASK_VARIANTS.some(({ id }) => id === 'mask_dek_badlands'));
  for (const lostTribeMaskId of [
    'mask_boar_lost_tribe',
    'mask_shaman_lost_tribe',
    'mask_snake_lost_tribe',
    'mask_guardian_lost_tribe',
    'mask_stalker_lost_tribe',
    'mask_warrior_lost_tribe',
    'mask_armored_lost_tribe',
    'mask_scout_lost_tribe',
  ]) {
    assert.ok(MASK_VARIANTS.some(({ id }) => id === lostTribeMaskId), lostTribeMaskId);
  }
  assert.ok(MASK_VARIANTS.some(({ id }) => id === 'mask_cleopatra_hg'));
  assert.ok(TECH_CATALOG.some(({ id }) => id === 'tech_cloak'));
  assert.ok(TECH_CATALOG.some(({ id }) => id === 'tech_voice_mimic'));
  assert.ok(TECH_CATALOG.some(({ id }) => id === 'tech_predator_killer_armor'));
  assert.ok(TECH_CATALOG.some(({ id }) => id === 'tech_father_yautja_sword_hg'));
  for (const equipmentId of [
    'tech_wolf_dual_plasma',
    'tech_wolf_segmented_whip',
    'tech_wolf_cleaner_case',
    'tech_wolf_dissolving_fluid',
    'tech_lost_shaman_staff_dagger',
    'tech_lost_snake_scythes',
    'tech_lost_warrior_axe_flail',
    'tech_lost_armored_sword_shuriken',
    'tech_lost_scout_sniper_merch',
    'tech_badlands_spray_snake',
  ]) {
    assert.ok(TECH_CATALOG.some(({ id }) => id === equipmentId), equipmentId);
  }
  assert.ok(VEHICLE_CATALOG.some(({ id }) => id === 'vehicle_city_clan_ship'));
  assert.ok(VEHICLE_CATALOG.some(({ id }) => id === 'vehicle_preserve_parachute_drop'));
  assert.ok(ENEMY_CATALOG.some(({ id }) => id === 'enemy_upgrade_predator_2018'));
  assert.ok(HUNT_BOSS_CATALOG.some(({ id }) => id === 'boss_berserker_super_predator'));
  assert.ok(HUNT_BOSS_CATALOG.some(({ id }) => id === 'boss_kok_warlord_predator'));
  assert.equal(getYautjaContentById('event_gunnison_cleaner_duel')?.runtimeStatus, 'playable');
  assert.equal(getYautjaContentById('event_kalisk_regeneration')?.runtimeStatus, 'playable');
  assert.equal(getYautjaContentById('boss_wolf_cleaner')?.runtimeStatus, 'playable');
  assert.equal(getYautjaContentById('boss_kalisk_badlands')?.runtimeStatus, 'playable');
  for (const existingBossId of ['goliath', 'xeno_queen', 'bad_blood', 'predalien']) {
    assert.ok(HUNT_BOSS_CATALOG.some(({ id }) => id === existingBossId), existingBossId);
  }
});

test('les rencontres v1.8 du catalogue possèdent toutes leur implémentation runtime', () => {
  const npcTypesByCatalogId = {
    enemy_elite_commando: ['jungle_scout', 'jungle_gunner', 'jungle_trapper'],
    enemy_viking_raider: ['era_viking_raider'],
    enemy_feudal_assassin: ['era_feudal_duelist'],
    enemy_wartime_pilot: ['era_wartime_pilot'],
    enemy_genna_hostile_fauna: ['genna_sporeback', 'genna_stalker'],
  };

  for (const [catalogId, runtimeTypes] of Object.entries(npcTypesByCatalogId)) {
    const entry = getYautjaContentById(catalogId);
    assert.equal(entry?.runtimeStatus, 'encounter', catalogId);
    for (const runtimeType of runtimeTypes) {
      assert.ok(AVAILABLE_HUNT_NPC_ARCHETYPES[runtimeType], `${catalogId}:${runtimeType}`);
    }
  }

  const directiveIdByEventId = {
    event_jungle_fireteam_directive: 'jungle_fireteam',
    event_avp_blooding_directive: 'blooding_rite',
    event_killer_eras: 'killer_eras',
    event_genna_predation_cycle: 'deathworld_protocol',
  };

  for (const [eventId, directiveId] of Object.entries(directiveIdByEventId)) {
    const entry = getYautjaContentById(eventId);
    const directive = HUNT_DIRECTIVES[directiveId];
    assert.equal(entry?.runtimeStatus, 'encounter', eventId);
    assert.ok(directive, `${eventId}:${directiveId}`);
    assert.ok(directive.schedule.length > 0, `${eventId}: planning vide`);
    assert.deepEqual(
      directive.schedule.map(({ npcType }) => npcType),
      directive.objectives.map(({ npcType }) => npcType),
      eventId,
    );
    for (const { npcType } of directive.objectives) {
      assert.ok(AVAILABLE_HUNT_NPC_ARCHETYPES[npcType], `${eventId}:${npcType}`);
    }
  }
});
