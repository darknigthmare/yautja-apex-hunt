import assert from 'node:assert/strict';
import test from 'node:test';
import { LORE_SOURCES } from '../src/data/LoreCodex.js';
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

const VALID_TIERS = new Set(['SCREEN', 'AVP_SCREEN', 'LICENSED_EU', 'ORIGINAL']);
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
]);

test('la passe contenu respecte les seuils de production demandés', () => {
  assert.equal(MASK_VARIANTS.length, 30);
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
  }, { technologies: 27, vehicles: 13, enemies: 27, events: 17, bosses: 13, support: 13 });
  assert.equal(TECH_CATALOG.length + VEHICLE_CATALOG.length + ENEMY_CATALOG.length + LEVEL_EVENT_CATALOG.length + HUNT_BOSS_CATALOG.length + SUPPORT_CATALOG.length, 110);
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
  assert.ok(MASK_VARIANTS.some(({ id }) => id === 'mask_cleopatra_hg'));
  assert.ok(TECH_CATALOG.some(({ id }) => id === 'tech_cloak'));
  assert.ok(TECH_CATALOG.some(({ id }) => id === 'tech_voice_mimic'));
  assert.ok(TECH_CATALOG.some(({ id }) => id === 'tech_predator_killer_armor'));
  assert.ok(TECH_CATALOG.some(({ id }) => id === 'tech_father_yautja_sword_hg'));
  assert.ok(VEHICLE_CATALOG.some(({ id }) => id === 'vehicle_city_clan_ship'));
  assert.ok(VEHICLE_CATALOG.some(({ id }) => id === 'vehicle_preserve_parachute_drop'));
  assert.ok(ENEMY_CATALOG.some(({ id }) => id === 'enemy_upgrade_predator_2018'));
  assert.ok(HUNT_BOSS_CATALOG.some(({ id }) => id === 'boss_berserker_super_predator'));
  assert.ok(HUNT_BOSS_CATALOG.some(({ id }) => id === 'boss_kok_warlord_predator'));
  for (const existingBossId of ['goliath', 'xeno_queen', 'bad_blood', 'predalien']) {
    assert.ok(HUNT_BOSS_CATALOG.some(({ id }) => id === existingBossId), existingBossId);
  }
});
