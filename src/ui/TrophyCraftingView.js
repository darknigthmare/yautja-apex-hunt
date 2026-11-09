import { getCraftsmanshipItemSvg, getCraftCardMiniatureSvg } from './CanonLogosAndEmblems.js';

const number = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 });
const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

export function formatCraftStat(value, unit) {
  if (!Number.isFinite(value)) return null;
  if (unit === 'ratio') return `${number.format(value * 100)} %`;
  if (unit === 'percent') return `+${number.format(value)} %`;
  if (unit === 'reduction_percent') return `−${number.format(value)} %`;
  if (unit === 'points') return `+${number.format(value)} pts`;
  return null;
}

export function getCraftCardState(recipe, { crafted = false, equipped = false, check = {}, supportedStats = {} } = {}) {
  const reference = check.reference ?? {};
  const material = reference.canonicalMaterialLabel ?? reference.materialLabel
    ?? recipe.requiredTrophies?.join(' + ') ?? recipe.requiredTrophy ?? 'Matériau non documenté';
  const requirements = [];
  if (check.reason === 'unavailable_material_source') {
    requirements.push(reference.availabilityReason ?? 'Ce matériau ne peut pas être prélevé dans les chasses disponibles.');
  } else {
    if (Number.isFinite(check.missingHonor) && check.missingHonor > 0) {
      requirements.push(`${number.format(check.missingHonor)} points d’honneur manquants.`);
    }
    for (const missing of check.missingTrophies ?? []) {
      requirements.push(`${missing.label} : ${number.format(missing.owned ?? 0)}/${number.format(missing.required ?? 1)} en réserve.`);
    }
    if (check.reason === 'invalid_honor') requirements.push('Solde d’honneur indisponible. Rouvrez la console.');
    if (check.reason === 'unknown_recipe') requirements.push('Cette recette n’est plus disponible dans les archives.');
  }
  if (!crafted && check.canCraft) requirements.push('Matériaux et honneur disponibles. Les ressources seront consommées.');
  const action = equipped ? 'unequip' : crafted ? 'equip' : 'craft';
  const actionLabel = equipped ? 'DÉSÉQUIPER' : crafted ? 'ÉQUIPER POUR LA CHASSE'
    : check.reason === 'unavailable_material_source' ? 'ARCHIVE · MATÉRIAU NON PRÉLEVABLE'
      : check.canCraft ? `FAÇONNER · ${number.format(recipe.requiredHonor)} HONNEUR` : 'PRÉREQUIS MANQUANTS';
  const activeStats = Object.entries(recipe.stats ?? recipe.perks ?? {}).flatMap(([key, value]) => {
    // This stat is the recipe's royal-target bonus, not a second universal
    // honor bonus; the runtime intentionally folds the duplicate into one.
    if (key === 'honorGainBonus' && recipe.stats?.queenDominationBonus > 0) return [];
    const descriptor = supportedStats[key];
    const formatted = descriptor && formatCraftStat(value, descriptor.unit);
    return formatted ? [{ key, label: descriptor.label, value: formatted }] : [];
  });
  return {
    id: recipe.id, name: recipe.name, material, reference, action, actionLabel,
    disabled: !crafted && !check.canCraft, crafted, equipped, requirements, activeStats,
    sourceLabel: reference.sourceStatus === 'original_adaptation' ? 'CRÉATION DU CLAN' : 'ARCHIVES DU CLAN',
  };
}

function cardMarkup(recipe, view) {
  const id = escape(recipe.id);
  const origin = recipe.originMedia ?? recipe.originLore;
  const originLabel = typeof origin === 'string' ? origin.split('—')[0].trim() : '';
  const materialCount = view.reference.requiredTrophyCount ?? 1;
  const description = typeof recipe.description === 'string' && recipe.description.trim()
    ? `<p class="craft-description">${escape(recipe.description)}</p>` : '';
  const archiveProfile = recipe.passiveBonus ?? recipe.perkDescription;
  const activeStats = view.activeStats.length
    ? `<dl class="craft-active-stats">${view.activeStats.map(stat => `<div><dt>${escape(stat.label)}</dt><dd>${escape(stat.value)}</dd></div>`).join('')}</dl>`
    : '<p class="craft-no-active-bonus">Pièce de collection · aucun bonus de chasse actif.</p>';
  return `<article class="craft-recipe-card${view.crafted ? ' card-crafted' : ''}${view.equipped ? ' card-equipped' : ''}" data-card-recipe="${id}" aria-labelledby="${id}-title">
    <div class="card-miniature-box craft-miniature">${getCraftCardMiniatureSvg(recipe)}</div>
    <div class="craft-card-header"><div class="craft-svg-box" aria-hidden="true">${getCraftsmanshipItemSvg(recipe.id, 44)}</div><div class="craft-card-title">
      <h4 id="${id}-title">${escape(recipe.name)}</h4><span class="craft-source-status">${escape(view.sourceLabel)}</span></div></div>
    ${originLabel ? `<p class="craft-origin-kicker">Inspiration : ${escape(originLabel)}</p>` : ''}
    <p class="craft-trophy-badge"><strong>Matériau :</strong> ${escape(view.material)}</p>
    ${description}
    <div class="craft-perk-box"><span class="craft-perk-title">Effets de chasse de l’équipement</span>${activeStats}</div>
    ${archiveProfile ? `<details class="craft-archive-profile"><summary>Profil et référence d’archive</summary>${origin ? `<p>Inspiration : ${escape(origin)}</p>` : ''}<p>${escape(archiveProfile)}</p><small>Les capacités de ce profil ne constituent pas toutes des effets de chasse actifs. Les bonus utilisables figurent ci-dessus.</small></details>` : ''}
    <div class="craft-card-footer"><p class="craft-cost">Fabrication : ${number.format(recipe.requiredHonor)} honneur · ${number.format(materialCount)} ${materialCount > 1 ? 'matériaux consommés' : 'matériau consommé'}</p>
      <ul class="craft-requirements" id="${id}-requirements">${view.requirements.map(message => `<li>${escape(message)}</li>`).join('')}</ul>
      ${view.crafted ? `<p class="craft-state">${view.equipped ? 'Équipement actif pour la chasse' : 'Pièce forgée · prête à équiper'}</p>` : ''}
      <button type="button" class="craft-action-btn ${view.equipped ? 'btn-equipped' : view.crafted ? 'btn-ready-equip' : view.disabled ? 'btn-locked' : 'btn-can-craft'}" data-craft-action="${view.action}" data-recipe-id="${id}" aria-label="${escape(view.actionLabel)} · ${escape(recipe.name)}" aria-describedby="${id}-requirements"${view.crafted ? ` aria-pressed="${view.equipped}"` : ''}${view.disabled ? ' disabled' : ''}>${escape(view.actionLabel)}</button>
    </div></article>`;
}

/** Renders the existing workshop; mutation/transactions remain with the game. */
export function renderTrophyCraftingGrid({ grid, forge, honorScore = 0, category = 'all', supportedStats = {}, onAction } = {}) {
  if (!grid || !forge) return [];
  const document = grid.ownerDocument;
  const previous = grid.contains(document.activeElement) ? document.activeElement.dataset?.recipeId : null;
  const recipes = forge.getRecipes(category);
  const views = recipes.map(recipe => getCraftCardState(recipe, {
    crafted: forge.isCrafted(recipe.id), equipped: forge.isEquipped(recipe.id),
    check: forge.canCraft(recipe.id, honorScore), supportedStats,
  }));
  grid.innerHTML = recipes.map((recipe, index) => cardMarkup(recipe, views[index])).join('');
  grid.querySelectorAll('[data-craft-action]').forEach(button => {
    button.addEventListener('click', () => onAction?.(button.dataset.craftAction, button.dataset.recipeId));
  });
  if (previous) [...grid.querySelectorAll('[data-recipe-id]')]
    .find(button => button.dataset.recipeId === previous)?.focus({ preventScroll: true });
  const summary = document.getElementById('trophy-crafting-status');
  if (summary) summary.textContent = `${number.format(recipes.length)} recettes · ${number.format(honorScore)} honneur disponible · ${forge.state?.equippedItemIds?.length ?? 0}/5 catégories équipées`;
  const all = forge.getRecipes('all');
  document.querySelectorAll('.craft-filter-bar [data-craft-filter]').forEach(button => {
    const filter = button.dataset.craftFilter;
    const selected = filter === category;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-controls', grid.id);
    const count = filter === 'all' ? all.length : all.filter(recipe => recipe.category.toLowerCase() === filter).length;
    button.textContent = button.textContent.replace(/\(\d+\)\s*$/, `(${count})`);
  });
  return views;
}
