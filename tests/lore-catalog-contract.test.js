import assert from 'node:assert/strict';
import test from 'node:test';
import { LORE_SOURCE_TIERS } from '../src/data/LoreCodex.js';
import { YautjaSkinsDatabase } from '../src/data/YautjaLoreDatabase.js';

const EXPECTED_TIERS = Object.freeze({
  jungle_1987: 'SCREEN',
  city_1990: 'SCREEN',
  elder_lost_tribe: 'SCREEN',
  boar_lost_tribe: 'LICENSED_SCREEN_DESIGN',
  shaman_lost_tribe: 'LICENSED_SCREEN_DESIGN',
  snake_lost_tribe: 'LICENSED_SCREEN_DESIGN',
  guardian_lost_tribe: 'LICENSED_SCREEN_DESIGN',
  stalker_lost_tribe: 'LICENSED_SCREEN_DESIGN',
  warrior_lost_tribe: 'LICENSED_SCREEN_DESIGN',
  armored_lost_tribe: 'LICENSED_SCREEN_DESIGN',
  scout_lost_tribe: 'LICENSED_SCREEN_DESIGN',
  scar_avp: 'AVP_SCREEN',
  celtic_avp: 'AVP_SCREEN',
  chopper_avp: 'AVP_SCREEN',
  wolf_avpr: 'AVP_SCREEN',
  berserker_2010: 'SCREEN',
  falconer_2010: 'SCREEN',
  tracker_2010: 'SCREEN',
  fugitive_2018: 'SCREEN',
  feral_2022: 'SCREEN',
  kok_viking_hunter: 'SCREEN',
  kok_feudal_hunter: 'SCREEN',
  kok_wartime_hunter: 'SCREEN',
  dek_badlands: 'SCREEN',
  kwei_badlands: 'SCREEN',
  alpha_yautja: 'LICENSED_EU',
  captured_hg: 'LICENSED_EU',
  cleopatra_hg: 'LICENSED_EU',
  exiled_hg: 'LICENSED_EU',
  bionic_hg: 'LICENSED_EU',
  emissary_hg: 'LICENSED_EU',
  valkyrie_hg: 'LICENSED_EU',
  amazon_hg: 'LICENSED_EU',
  pirate_hg: 'LICENSED_EU',
  mr_black_hg: 'LICENSED_EU',
  gladiator_hg: 'LICENSED_EU',
  anubis_hg: 'LICENSED_EU',
  exalted_hg: 'LICENSED_EU',
  witch_hg: 'LICENSED_EU',
  oni_hg: 'LICENSED_EU',
  jotun_hg: 'LICENSED_EU',
  father_hg: 'LICENSED_EU',
  ahab_comic: 'LICENSED_EU',
  scarface_game: 'LICENSED_EU',
  dark_avp2010: 'LICENSED_EU',
  machiko_yautja: 'LICENSED_EU',
  samurai_yautja: 'LICENSED_EU',
  viking_yautja: 'LICENSED_EU',
  cyborg_yautja: 'ORIGINAL',
  deadend_fanfilm: 'ORIGINAL',
});

const getSkin = (id) => YautjaSkinsDatabase.find((skin) => skin.id === id);

test('le catalogue d’armures garde des identifiants uniques et une provenance reconnue', () => {
  const ids = YautjaSkinsDatabase.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual([...ids].sort(), Object.keys(EXPECTED_TIERS).sort());

  YautjaSkinsDatabase.forEach((skin) => {
    assert.equal(skin.sourceTier, EXPECTED_TIERS[skin.id], skin.id);
    assert.ok(LORE_SOURCE_TIERS[skin.sourceTier], `${skin.id}: niveau de provenance inconnu`);
    assert.equal(typeof skin.col, 'number', `${skin.id}: teinte de gameplay absente`);
    assert.ok(skin.name && skin.origin && skin.desc, `${skin.id}: fiche incomplète`);
  });
});

test('les erreurs factuelles historiques du catalogue ne réapparaissent pas', () => {
  const catalogText = YautjaSkinsDatabase
    .flatMap(({ name, origin, desc }) => [name, origin, desc])
    .join('\n');

  for (const [label, pattern] of [
    ['Val Verde présenté comme lieu écran', /Chasseur de Val Verde/i],
    ['Scar présenté comme chef', /Leader des Jeunes Sangs/i],
    ['armes de Chopper déplacées aux épaules', /scies d['’]épaule/i],
    ['mandibule du Berserker déclarée xénomorphe', /masque en mâchoire de Xénomorphe/i],
    ['Feral déclaré porteur d’un crâne d’ours polaire', /crâne d['’]ours polaire/i],
    ['Alpha déclaré origine écran de l’espèce', /Premier Yautja|tout premier Yautja/i],
    ['Ahab déclaré aveugle chasseur de Reines', /aveugle traqueur de Reines/i],
    ['Dark déclaré élite d’une pyramide', /Élite de la pyramide/i],
    ['Samurai attribué aux comics et figurines', /Comics & Figurines/i],
    ['Viking attribué à un lore indéfini', /Comics & Lore/i],
    ['Cyborg attribué à des œuvres non nommées', /Jeu Arcade & Comics/i],
    ['mauvais titre du fan film', /Batman vs Predator/i],
  ]) {
    assert.doesNotMatch(catalogText, pattern, label);
  }
});

test('les créations et hommages restent explicitement hors canon officiel', () => {
  const cyborg = getSkin('cyborg_yautja');
  const deadEnd = getSkin('deadend_fanfilm');

  assert.match(cyborg.origin, /Création : Yautja: Apex Hunt/);
  assert.match(cyborg.desc, /aucune identité écran ou EU précise/i);
  assert.match(deadEnd.origin, /Hommage non licencié : Batman: Dead End \(2003\)/);
  assert.match(deadEnd.desc, /hors continuités officielles/i);
});
