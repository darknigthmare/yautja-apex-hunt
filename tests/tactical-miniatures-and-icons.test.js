import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import {
  getMapMiniatureSvg,
  getWeaponMiniatureSvg,
  getSquadMiniatureSvg,
  getPreyMiniatureSvg,
  getLoreMiniatureSvg,
  getSkinMiniatureSvg,
  getCategoryIconSvg,
  getSquadLogo,
  getFactionLogo,
  getYautjaClanLogo,
} from '../src/ui/CanonLogosAndEmblems.js';
import { MEDIA_MAPS_CATALOG, NPC_ARSENAL_CATALOG } from '../src/data/MediaMapsAndArsenalCatalog.js';
import { SQUAD_ENCOUNTERS } from '../src/data/SquadEncountersCatalog.js';
import { ARMOR_PRESET_WEAPON_VARIANTS } from '../src/data/RuntimeEquipment.js';
import { CANON_PREY_CATALOG } from '../src/data/PreyTaxonomyAndCrossoverCatalog.js';
import { LORE_CODEX_ENTRIES } from '../src/data/LoreCodex.js';
import { YautjaSkinsDatabase } from '../src/data/YautjaLoreDatabase.js';
import { HUDManager } from '../src/HUDManager.js';

test('getCategoryIconSvg retourne un SVG valide pour toutes les catégories requises (incluant BESTIARY et LOADOUT)', () => {
  const categories = [
    'MILITARY',
    'SECURITY',
    'MERCENARY',
    'CARTEL',
    'SCIENTIFIC',
    'TRIBAL',
    'SPECIAL_OPS',
    'CIVILIANS',
    'FAUNA',
    'ARSENAL',
    'BIOME',
    'CODEX',
    'BESTIARY',
    'LOADOUT',
  ];

  for (const cat of categories) {
    const svg = getCategoryIconSvg(cat, 18);
    assert.ok(svg.startsWith('<svg'), `Le markup de ${cat} doit débuter par <svg`);
    assert.ok(svg.endsWith('</svg>'), `Le markup de ${cat} doit finir par </svg>`);
    assert.ok(svg.includes('width="18"'), `Le markup de ${cat} doit inclure la taille spécifiée`);
  }
});

test('getMapMiniatureSvg génère une miniature vectorielle tactique avec radar et topographie', () => {
  for (const map of MEDIA_MAPS_CATALOG) {
    const svg = getMapMiniatureSvg(map);
    assert.ok(svg.includes('<svg'), `Map ${map.id} doit produire un SVG valide`);
    assert.ok(svg.includes('class="tactical-map-miniature"'), `Map ${map.id} doit inclure la classe tactical-map-miniature`);
    assert.ok(svg.includes('class="orbital-radar"'), `Map ${map.id} doit intégrer le radar orbital`);
    assert.ok(svg.includes('class="terrain-topography"'), `Map ${map.id} doit intégrer la topographie`);
  }
});

test('getWeaponMiniatureSvg génère un schéma technique blueprint pour toutes les armes', () => {
  const allWeapons = [...NPC_ARSENAL_CATALOG, ...ARMOR_PRESET_WEAPON_VARIANTS];
  for (const wep of allWeapons) {
    const svg = getWeaponMiniatureSvg(wep);
    assert.ok(svg.includes('<svg'), `Weapon ${wep.id} doit produire un SVG valide`);
    assert.ok(svg.includes('class="tactical-weapon-miniature"'), `Weapon ${wep.id} doit inclure la classe tactical-weapon-miniature`);
    assert.ok(svg.includes('class="weapon-blueprint"'), `Weapon ${wep.id} doit inclure la silhouette blueprint`);
  }
});

test('getSquadMiniatureSvg génère une formation de combat tactique pour toutes les escouades', () => {
  for (const squad of SQUAD_ENCOUNTERS) {
    const svg = getSquadMiniatureSvg(squad);
    assert.ok(svg.includes('<svg'), `Squad ${squad.id} doit produire un SVG valide`);
    assert.ok(svg.includes('class="tactical-squad-miniature"'), `Squad ${squad.id} doit inclure la classe tactical-squad-miniature`);
    assert.ok(svg.includes('class="squad-formation"'), `Squad ${squad.id} doit inclure la formation d'escouade`);
    assert.ok(svg.includes('class="tri-laser-lock"'), `Squad ${squad.id} doit intégrer le verrouillage tri-laser`);
  }
});

test('getSquadLogo fournit des emblèmes personnalisés pour les escouades Vague 8, Vague 9 et l’ensemble du catalogue sans fallback générique', () => {
  const genericClanLogo = getYautjaClanLogo(40);
  const vague8And9SquadIds = [
    // Vague 8
    'squad_pred_tartarus_clans',
    'squad_pred_crucified_clan',
    'squad_pred_starseer_shamans',
    'squad_alien_anacharsis_sec',
    'squad_alien_moriah_defenders',
    'squad_alien_anchorpoint_guard',
    'squad_avp_freya_prospect_sec',
    'squad_avp_rage_war_armada',
    // Vague 9
    'squad_pred_captive_preserve_guards',
    'squad_pred_yellowstone_rangers',
    'squad_alien_charon_rogue_marines',
    'squad_alien_harvest_cyber_ants',
    'squad_avp_eternal_tokyo_mercs',
    'squad_avp_perses_fire_stone_crew',
  ];

  for (const squadId of vague8And9SquadIds) {
    const svg = getSquadLogo(squadId, 40);
    assert.ok(svg.startsWith('<svg'), `Le logo de ${squadId} doit être un SVG valide`);
    assert.notStrictEqual(svg, genericClanLogo, `L'escouade ${squadId} ne doit pas retomber sur le logo générique Yautja`);
  }

  for (const squad of SQUAD_ENCOUNTERS) {
    const svg = getSquadLogo(squad.id, 40);
    assert.ok(svg.startsWith('<svg'), `Le logo catalogue de ${squad.id} doit être un SVG valide`);
    assert.notStrictEqual(svg, genericClanLogo, `L'escouade du catalogue ${squad.id} ne doit pas retomber sur le logo générique Yautja`);
  }
});

test('getPreyMiniatureSvg génère un bio-scan 180x76 avec silhouettes variées par espèce, réticule radar et barre de hauteur', () => {
  const archetypes = [
    { prey: { id: 'prey_xeno_warrior', name: 'Guerrier Xénomorphe', category: 'Xenomorph', heightM: 2.4 }, expected: 'XENOMORPH' },
    { prey: { id: 'prey_berserker_pred', name: 'Super Predator Berserker', category: 'Yautja', heightM: 2.3 }, expected: 'YAUTJA' },
    { prey: { id: 'prey_working_joe', name: 'Androïde Working Joe', category: 'Synthetic', heightM: 1.8 }, expected: 'SYNTHETIC' },
    { prey: { id: 'prey_space_jockey', name: 'Ingénieur Mala\'kak', category: 'Engineer', heightM: 3.5 }, expected: 'ENGINEER' },
    { prey: { id: 'prey_hellhound', name: 'Hellhound Quadrupède', category: 'Megafauna', heightM: 1.5 }, expected: 'MEGAFAUNA' },
    { prey: { id: 'prey_colonial_marine', name: 'Sergent USCM', category: 'Human Marine', heightM: 1.9 }, expected: 'HUMAN_MARINE' },
  ];

  for (const { prey, expected } of archetypes) {
    const svg = getPreyMiniatureSvg(prey);
    assert.ok(svg.includes('class="tactical-miniature prey-miniature-svg"'), `Prey ${prey.id} doit avoir la classe prey-miniature-svg`);
    assert.ok(svg.includes('viewBox="0 0 180 76"'), `Prey ${prey.id} doit utiliser viewBox="0 0 180 76"`);
    assert.ok(svg.includes(`data-species-archetype="${expected}"`), `Prey ${prey.id} doit produire la silhouette ${expected}`);
    assert.ok(svg.includes('class="bio-radar-reticle"'), `Prey ${prey.id} doit inclure le réticule bio-radar`);
    assert.ok(svg.includes('class="height-telemetry-bar"'), `Prey ${prey.id} doit inclure la barre de hauteur`);
    assert.ok(svg.includes(`${prey.heightM.toFixed(1)}M`), `Prey ${prey.id} doit afficher la hauteur ${prey.heightM}M`);
  }

  for (const prey of CANON_PREY_CATALOG) {
    const svg = getPreyMiniatureSvg(prey);
    assert.ok(svg.startsWith('<svg') && svg.endsWith('</svg>'), `Prey catalogue ${prey.id} doit produire un SVG complet`);
  }
});

test('getLoreMiniatureSvg génère un cristal d’archive 180x76 avec waveform, glyphe d’univers et motif de catégorie', () => {
  const sampleEntries = [
    { id: 'lore_pred_clan', title: 'Code Yautja', universe: 'PREDATOR', category: 'CLAN' },
    { id: 'lore_alien_hive', title: 'Ruche XX121', universe: 'ALIEN', category: 'XENOMORPH' },
    { id: 'lore_avp_pyramid', title: 'Pyramide Bouvetøya', universe: 'AVP', category: 'LOCATION' },
  ];

  for (const entry of sampleEntries) {
    const svg = getLoreMiniatureSvg(entry);
    assert.ok(svg.includes('class="tactical-miniature lore-miniature-svg"'), `Lore ${entry.id} doit avoir la classe lore-miniature-svg`);
    assert.ok(svg.includes('viewBox="0 0 180 76"'), `Lore ${entry.id} doit utiliser viewBox="0 0 180 76"`);
    assert.ok(svg.includes('class="holo-data-crystal"'), `Lore ${entry.id} doit inclure le cristal holographique`);
    assert.ok(svg.includes('class="waveform-telemetry"'), `Lore ${entry.id} doit inclure la télémétrie waveform`);
    assert.ok(svg.includes(`data-universe="${entry.universe}"`), `Lore ${entry.id} doit afficher le glyphe d'univers ${entry.universe}`);
    assert.ok(svg.includes(`data-category="${entry.category}"`), `Lore ${entry.id} doit afficher le motif de catégorie ${entry.category}`);
  }

  for (const entry of LORE_CODEX_ENTRIES) {
    const svg = getLoreMiniatureSvg(entry);
    assert.ok(svg.startsWith('<svg') && svg.endsWith('</svg>'), `Lore catalogue ${entry.id} doit produire un SVG complet`);
  }
});

test('getSkinMiniatureSvg génère un buste Yautja 180x76 colorisé dynamiquement avec la palette du skin et son rang', () => {
  const customSkin = {
    id: 'skin_test_custom',
    name: 'Armure Impériale Test',
    tier: 'Elder',
    origin: 'Yautja Prime',
    palette: {
      armor: '#112233',
      trim: '#abcdef',
      visor: '#ff0055',
      glow: '#00ffaa',
      skin: '#556644',
    },
  };

  const svg = getSkinMiniatureSvg(customSkin);
  assert.ok(svg.includes('class="tactical-miniature skin-miniature-svg"'), 'Le skin doit avoir la classe skin-miniature-svg');
  assert.ok(svg.includes('viewBox="0 0 180 76"'), 'Le skin doit utiliser viewBox="0 0 180 76"');
  assert.ok(svg.includes('class="yautja-armor-bust"'), 'Le skin doit inclure le buste Yautja');
  assert.ok(svg.includes('class="skin-tier-frame"'), 'Le skin doit inclure le cadre de rang');
  assert.ok(svg.includes('#112233'), 'Le skin doit utiliser palette.armor');
  assert.ok(svg.includes('#abcdef'), 'Le skin doit utiliser palette.trim');
  assert.ok(svg.includes('#ff0055'), 'Le skin doit utiliser palette.visor');
  assert.ok(svg.includes('#00ffaa'), 'Le skin doit utiliser palette.glow');
  assert.ok(svg.includes('#556644'), 'Le skin doit utiliser palette.skin');

  for (const skin of YautjaSkinsDatabase) {
    const skinSvg = getSkinMiniatureSvg(skin);
    assert.ok(skinSvg.startsWith('<svg') && skinSvg.endsWith('</svg>'), `Skin catalogue ${skin.id} doit produire un SVG complet`);
  }
});

test('HUDManager.renderSkinCatalog préfixe chaque carte de skin avec sa miniature SVG et son icône de catégorie tout en préservant les éléments existants', () => {
  const appendedCards = [];
  const fakeSkinGrid = {
    innerHTML: '',
    appendChild(card) {
      appendedCards.push(card);
    },
  };

  const originalDoc = globalThis.document;
  globalThis.document = {
    createElement(tag) {
      return {
        tag,
        type: '',
        className: '',
        innerHTML: '',
        attributes: {},
        style: { setProperty() {} },
        setAttribute(k, v) {
          this.attributes[k] = v;
        },
      };
    },
  };

  try {
    HUDManager.prototype.renderSkinCatalog.call({ skinGrid: fakeSkinGrid });
    assert.strictEqual(appendedCards.length, YautjaSkinsDatabase.length);
    const first = appendedCards[0];
    assert.ok(first.innerHTML.includes('class="card-miniature-box skin-miniature"'));
    assert.ok(first.innerHTML.includes('class="tactical-miniature skin-miniature-svg"'));
    assert.ok(first.innerHTML.includes('class="category-icon cat-loadout"'));
    assert.ok(first.innerHTML.includes('class="skin-title"'));
    assert.ok(first.innerHTML.includes('class="skin-origin"'));
    assert.ok(first.innerHTML.includes('class="codex-tier skin-tier"'));
    assert.ok(first.innerHTML.includes('class="skin-desc"'));
  } finally {
    globalThis.document = originalDoc;
  }
});

test('src/main.js intègre les miniatures sur renderPreyCard, renderLoreDrawerCard, renderLoreCodex et corrige uLore dans renderTaxonomyEncyclopedia', () => {
  const mainSource = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.ok(mainSource.includes('card-miniature-box prey-miniature') && mainSource.includes('getPreyMiniatureSvg(prey)'));
  assert.ok(mainSource.includes("getCategoryIconSvg('BESTIARY', 18)"));
  assert.ok(mainSource.includes('card-miniature-box lore-miniature') && mainSource.includes('getLoreMiniatureSvg(entry)'));
  assert.ok(mainSource.includes("getCategoryIconSvg('CODEX', 20)"));
  assert.ok(mainSource.includes('const uLore = LORE_CODEX_ENTRIES.filter((e) => getLoreEntryUniverse(e) === u);'));
  assert.ok(mainSource.includes('uLore.map(renderLoreDrawerCard).join'));
  assert.ok(typeof getFactionLogo('ALIEN', 20) === 'string' && getFactionLogo('ALIEN', 20).startsWith('<svg'));
});
