import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MedbayInventoryOverlay,
  getMedbayItemMiniatureSvg,
  getMedbayAnatomicalScanSvg,
} from '../src/ui/MedbayInventoryOverlay.js';
import { MEDBAY_ITEMS, createMedbayInventoryState } from '../src/gameplay/YautjaMedbaySystem.js';
import { filterCatalogueCards, setupCatalogueBrowsers } from '../src/ui/CatalogueBrowser.js';

test('hub refill restores the portable kit without granting infinite field supplies', () => {
  const fieldInventory = createMedbayInventoryState({ chargesModifier: 2 });
  for (const item of MEDBAY_ITEMS) {
    fieldInventory.charges[item.id] = 0;
    fieldInventory.cooldowns[item.id] = 8;
  }
  let refill;
  const overlay = new MedbayInventoryOverlay({
    player: { medbayInventory: fieldInventory },
    inventoryState: { ...fieldInventory, isMothership: true },
  });
  overlay.container = {
    querySelector: (selector) => selector === '#medbay-btn-refill'
      ? { addEventListener: (_, handler) => { refill = handler; } }
      : null,
  };
  overlay._bindEvents();
  refill();
  for (const item of MEDBAY_ITEMS) {
    assert.equal(fieldInventory.charges[item.id], item.baseCharges * 2);
    assert.equal(fieldInventory.cooldowns[item.id], 0);
    assert.ok(Number.isFinite(fieldInventory.charges[item.id]));
  }
  assert.equal(fieldInventory.isMothership, false);
  assert.equal(overlay.inventoryState.isMothership, true);
  assert.equal(overlay.inventoryState.charges, fieldInventory.charges);
});

test('getMedbayItemMiniatureSvg generates 180x76 diegetic vector miniatures for all 6 canonical Yautja medical tools', () => {
  assert.equal(MEDBAY_ITEMS.length, 6);
  const svgSignatures = new Set();

  for (const item of MEDBAY_ITEMS) {
    const svg = getMedbayItemMiniatureSvg(item);
    assert.match(svg, /<svg class="tactical-miniature medbay-miniature-svg" viewBox="0 0 180 76"/);
    assert.ok(svg.includes(`data-medbay-item-id="${item.id}"`));
    assert.ok(svg.includes(item.shortName.toUpperCase()));
    assert.ok(svg.includes(item.sourceTier));
    assert.ok(svg.includes('</svg>'));
    svgSignatures.add(svg);
  }

  assert.equal(svgSignatures.size, 6, 'Each of the 6 medbay tools must render a unique SVG miniature');
});

test('getMedbayAnatomicalScanSvg renders the 120x200 Yautja anatomical wireframe and reacts to diagnostic injuries', () => {
  const nominalSvg = getMedbayAnatomicalScanSvg({ hpRatio: 1, hasBleeding: false, hasAcid: false });
  assert.match(nominalSvg, /<svg class="medbay-anatomical-svg" viewBox="0 0 120 200"/);
  assert.ok(nominalSvg.includes('scan-zone-head'));
  assert.ok(nominalSvg.includes('scan-zone-torso'));
  assert.ok(nominalSvg.includes('scan-zone-arm-l'));
  assert.ok(nominalSvg.includes('scan-zone-arm-r'));
  assert.ok(nominalSvg.includes('scan-zone-legs'));

  const injuredSvg = getMedbayAnatomicalScanSvg({ hpRatio: 0.4, hasBleeding: true, hasAcid: true, hasSnare: true });
  assert.ok(injuredSvg.includes('#ef4444'), 'Torso wireframe should highlight bleeding/low HP in crimson');
  assert.ok(injuredSvg.includes('#10b981'), 'Left gauntlet wireframe should highlight acid corrosion');
  assert.ok(injuredSvg.includes('#f59e0b'), 'Greaves wireframe should highlight snare status');
});

test('taxonomy catalogue search filters [data-lore-id] codex cards alongside prey, squad, map, and weapon cards', () => {
  const loreCards = [
    { dataset: { loreId: 'yautja_codex_honor' }, textContent: 'Code d’honneur Yautja et caste des Anciens', hidden: false },
    { dataset: { loreId: 'xenomorph_hive_resin' }, textContent: 'Résine biomécanique de ruche Xénomorphe', hidden: false },
    { dataset: { loreId: 'engineer_juggernaut' }, textContent: 'Ingénieurs Mala’kak et vaisseau Juggernaut', hidden: false },
  ];

  const filtered = filterCatalogueCards(loreCards, 'ruche xenomorphe');
  assert.deepEqual(filtered, { visible: 1, total: 3 });
  assert.equal(loreCards[0].hidden, true);
  assert.equal(loreCards[1].hidden, false);
  assert.equal(loreCards[2].hidden, true);

  let capturedSelector = '';
  const fakeInput = new EventTarget();
  fakeInput.value = 'juggernaut';
  fakeInput.focus = () => {};
  const fakeGrid = {
    id: 'canon-taxonomy-grid',
    querySelectorAll: (selector) => {
      capturedSelector = selector;
      return selector.includes('[data-lore-id]') ? loreCards : [];
    },
  };
  const fakeDoc = {
    getElementById: (id) => {
      if (id === 'canon-taxonomy-grid') return fakeGrid;
      if (id === 'taxonomy-search') return fakeInput;
      return null;
    },
    querySelectorAll: () => [],
  };

  const controllers = setupCatalogueBrowsers(fakeDoc);
  try {
    assert.ok(capturedSelector.includes('[data-lore-id]'));
    assert.equal(loreCards[0].hidden, true);
    assert.equal(loreCards[1].hidden, true);
    assert.equal(loreCards[2].hidden, false);
  } finally {
    controllers.forEach((c) => c.dispose());
  }
});
