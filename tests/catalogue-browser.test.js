import assert from 'node:assert/strict';
import test from 'node:test';
import { CANON_PREY_CATALOG, MULTIVERSE_CROSSOVER_PREY } from '../src/data/PreyTaxonomyAndCrossoverCatalog.js';
import { attachCatalogueBrowser, filterCatalogueCards, matchesCatalogueQuery } from '../src/ui/CatalogueBrowser.js';

const dossier = prey => ({ id: prey.id, hidden: false,
  textContent: [prey.name, prey.originMedia, prey.description, prey.universe, prey.faction].filter(Boolean).join(' ') });

test('dossiers can be found by several words with French accents and punctuation differences', () => {
  assert.equal(matchesCatalogueQuery('Reine-Mère — Xénomorphe', 'XENOMORPHE reine mere'), true);
  assert.equal(matchesCatalogueQuery('Reine-Mère — Xénomorphe', 'reine mandalorien'), false);
  assert.equal(matchesCatalogueQuery('Reine-Mère — Xénomorphe', '  '), true);
  const cards = MULTIVERSE_CROSSOVER_PREY.map(dossier);
  assert.deepEqual(filterCatalogueCards(cards, 'BOBA fett'), { visible: 1, total: 60 });
  assert.equal(cards.find(card => !card.hidden).id, 'crossover_mandalorian_boba');
});

test('search retains the authoritative size filter and restores only the rendered scope when cleared', () => {
  const small = CANON_PREY_CATALOG.filter(prey => prey.scale === 'MINUSCULE').map(dossier);
  const total = small.length;
  assert.ok(total > 0 && total < CANON_PREY_CATALOG.length);
  const queens = filterCatalogueCards(small, 'reine');
  assert.ok(queens.visible > 0 && queens.visible < total);
  assert.ok(small.filter(card => !card.hidden).every(card => card.textContent.toLowerCase().includes('reine')));
  assert.deepEqual(filterCatalogueCards(small, 'zzzzaucuneproie'), { visible: 0, total });
  assert.deepEqual(filterCatalogueCards(small, ''), { visible: total, total });
});

class Node extends EventTarget {
  constructor() {
    super(); this.value = ''; this.textContent = ''; this.hidden = false;
    this.disabled = false; this.attributes = new Map(); this.classes = new Set();
    this.classList = { contains: value => this.classes.has(value) };
  }
  setAttribute(key, value) { this.attributes.set(key, value); }
  focus() { this.focused = true; }
}

function controls() {
  const input = new Node(), clearButton = new Node(), status = new Node(), empty = new Node();
  const grid = new Node(); grid.id = 'dossiers'; grid.cards = MULTIVERSE_CROSSOVER_PREY.map(dossier);
  grid.querySelectorAll = () => grid.cards;
  const all = new Node(), universe = new Node(); all.classes.add('active');
  let notify;
  class Observer {
    constructor(callback) { notify = callback; }
    observe(node, options) { assert.equal(node, grid); assert.deepEqual(options, { childList: true }); }
    disconnect() { notify = null; }
  }
  const options = { input, clearButton, status, empty, grid, cardSelector: '[data-crossover-select]',
    filters: [all, universe], noun: 'dossiers', Observer };
  const controller = attachCatalogueBrowser(options);
  return { ...options, controller, all, universe, notify: () => notify?.() };
}

test('a query survives dossier rerenders and reports empty and cleared states without replacing the input', async () => {
  const ui = controls();
  try {
    ui.input.value = 'Boba Fett'; ui.input.dispatchEvent(new Event('input'));
    assert.match(ui.status.textContent, /Dossiers : 1 sur 60/);
    assert.equal(ui.empty.hidden, true);
    assert.equal(ui.clearButton.disabled, false);
    // The game changes scope or refreshes its roster. The same query must be
    // reapplied to the new children, without rebuilding controls or their focus.
    ui.grid.cards = MULTIVERSE_CROSSOVER_PREY.filter(prey => !prey.id.includes('boba')).map(dossier);
    ui.notify(); await Promise.resolve();
    assert.equal(ui.input.value, 'Boba Fett');
    assert.equal(ui.empty.hidden, false);
    assert.match(ui.status.textContent, /Dossiers : 0 sur 59/);
    ui.clearButton.dispatchEvent(new Event('click'));
    assert.equal(ui.input.value, '');
    assert.equal(ui.input.focused, true);
    assert.equal(ui.empty.hidden, true);
    assert.equal(ui.clearButton.disabled, true);
    assert.ok(ui.grid.cards.every(card => !card.hidden));
  } finally { ui.controller.dispose(); }
});

test('filter accessibility states follow the game handler and Escape clears a search before closing a console', async () => {
  const ui = controls();
  try {
    // attachCatalogueBrowser's listener was registered first, just like HUD
    // construction before setupTaxonomyAndMultiverse's filter handler.
    ui.universe.addEventListener('click', () => {
      ui.all.classes.delete('active'); ui.universe.classes.add('active');
    });
    ui.universe.dispatchEvent(new Event('click')); await Promise.resolve();
    assert.equal(ui.all.attributes.get('aria-pressed'), 'false');
    assert.equal(ui.universe.attributes.get('aria-pressed'), 'true');
    assert.equal(ui.universe.attributes.get('aria-controls'), 'dossiers');
    ui.input.value = 'zzzzaucuneproie'; ui.input.dispatchEvent(new Event('input'));
    const escape = new Event('keydown', { cancelable: true });
    Object.defineProperty(escape, 'key', { value: 'Escape' });
    ui.input.dispatchEvent(escape);
    assert.equal(escape.defaultPrevented, true);
    assert.equal(ui.input.value, '');
    assert.equal(ui.empty.hidden, true);
    const emptyEscape = new Event('keydown', { cancelable: true });
    Object.defineProperty(emptyEscape, 'key', { value: 'Escape' });
    ui.input.dispatchEvent(emptyEscape);
    assert.equal(emptyEscape.defaultPrevented, false);
  } finally { ui.controller.dispose(); }
});

test('reinitialization is idempotent and disposal stops observing a replaced roster', () => {
  const ui = controls();
  assert.equal(attachCatalogueBrowser(ui), ui.controller);
  ui.controller.dispose();
  ui.input.value = 'zzzzaucuneproie'; ui.input.dispatchEvent(new Event('input')); ui.notify();
  assert.ok(ui.grid.cards.every(card => !card.hidden));
});
