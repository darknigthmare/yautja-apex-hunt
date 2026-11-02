/** Match the words of a dossier query independently of case, accents or punctuation. */
export function normalizeCatalogueText(value) {
  return String(value ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('fr').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

export function matchesCatalogueQuery(text, query) {
  const haystack = normalizeCatalogueText(text);
  return normalizeCatalogueText(query).split(' ').filter(Boolean).every(word => haystack.includes(word));
}

/** Search only the currently rendered scope; the game's size/universe filter stays authoritative. */
export function filterCatalogueCards(cards, query = '') {
  let visible = 0;
  for (const card of cards) {
    const matches = matchesCatalogueQuery(card.textContent, query);
    card.hidden = !matches;
    if (matches) visible++;
  }
  return { visible, total: cards.length };
}

const mounted = new WeakMap();

export function attachCatalogueBrowser({ grid, input, clearButton, status, empty, filters = [],
  cardSelector, noun = 'dossiers', Observer = globalThis.MutationObserver } = {}) {
  if (!grid || !input) return null;
  if (mounted.has(grid)) return mounted.get(grid);
  let pending = false;
  let disposed = false;
  const update = () => {
    if (disposed) return;
    const result = filterCatalogueCards([...grid.querySelectorAll(cardSelector)], input.value);
    if (status) {
      const message = `${noun.charAt(0).toLocaleUpperCase('fr')}${noun.slice(1)} : ${result.visible} sur ${result.total} dans ce filtre.`;
      if (status.textContent !== message) status.textContent = message;
    }
    if (empty) empty.hidden = result.visible !== 0;
    if (clearButton) clearButton.disabled = !input.value;
    for (const button of filters) {
      button.setAttribute('aria-pressed', String(button.classList.contains('active')));
      button.setAttribute('aria-controls', grid.id);
    }
    return result;
  };
  const schedule = () => {
    if (pending || disposed) return;
    pending = true;
    queueMicrotask(() => { pending = false; update(); });
  };
  const clear = () => { input.value = ''; update(); input.focus({ preventScroll: true }); };
  const onKeyDown = event => {
    if (event.key !== 'Escape' || !input.value) return;
    event.preventDefault(); event.stopPropagation(); clear();
  };
  input.addEventListener('input', update);
  input.addEventListener('search', update);
  input.addEventListener('keydown', onKeyDown);
  clearButton?.addEventListener('click', clear);
  // These listeners may precede the game's filter handlers; read the resulting
  // scope after the event, then reapply the query after any dossier rerender.
  for (const button of filters) button.addEventListener('click', schedule);
  const observer = typeof Observer === 'function' ? new Observer(schedule) : null;
  observer?.observe(grid, { childList: true });
  const controller = { update, dispose() {
    disposed = true; observer?.disconnect();
    input.removeEventListener('input', update);
    input.removeEventListener('search', update);
    input.removeEventListener('keydown', onKeyDown);
    clearButton?.removeEventListener('click', clear);
    for (const button of filters) button.removeEventListener('click', schedule);
    mounted.delete(grid);
  } };
  mounted.set(grid, controller);
  update();
  return controller;
}

export function setupCatalogueBrowsers(document) {
  const configurations = [
    { prefix: 'taxonomy', gridId: 'canon-taxonomy-grid', cardSelector: '[data-prey-id], [data-squad-id]', filter: '[data-taxonomy-filter]', noun: 'dossiers' },
    { prefix: 'multiverse', gridId: 'multiverse-roster-grid', cardSelector: '[data-crossover-select]', filter: '[data-multiverse-filter]', noun: 'dossiers' },
  ];
  return configurations.map(({ prefix, gridId, cardSelector, filter, noun }) => attachCatalogueBrowser({
    grid: document.getElementById(gridId), input: document.getElementById(`${prefix}-search`),
    clearButton: document.getElementById(`${prefix}-search-clear`),
    status: document.getElementById(`${prefix}-search-status`), empty: document.getElementById(`${prefix}-search-empty`),
    filters: [...document.querySelectorAll(filter)], cardSelector, noun,
  })).filter(Boolean);
}
