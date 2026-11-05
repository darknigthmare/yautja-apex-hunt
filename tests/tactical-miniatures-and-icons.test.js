import test from 'node:test';
import assert from 'node:assert';
import {
  getMapMiniatureSvg,
  getWeaponMiniatureSvg,
  getSquadMiniatureSvg,
  getCategoryIconSvg,
} from '../src/ui/CanonLogosAndEmblems.js';
import { MEDIA_MAPS_CATALOG, NPC_ARSENAL_CATALOG } from '../src/data/MediaMapsAndArsenalCatalog.js';
import { SQUAD_ENCOUNTERS } from '../src/data/SquadEncountersCatalog.js';
import { ARMOR_PRESET_WEAPON_VARIANTS } from '../src/data/RuntimeEquipment.js';

test('getCategoryIconSvg retourne un SVG valide pour toutes les catégories requises', () => {
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
