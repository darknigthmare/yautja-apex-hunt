import { YautjaSkinsDatabase } from './data/YautjaLoreDatabase.js';
import { LORE_SOURCE_TIERS } from './data/LoreCodex.js';
import { HUNT_DEFINITIONS } from './data/GameConfig.js';
import {
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
} from './data/YautjaContentCatalog.js';
import {
  ARMOR_FINISHES,
  DREAD_STYLES,
  HUNTER_CLASSES,
  PLAYABLE_WEAPONS,
  WARPAINT_PATTERNS,
} from './data/RuntimeEquipment.js';
import {
  MEDIA_COVERAGE_CATALOG,
  MEDIA_PROVENANCE_TIERS,
  MEDIA_RELEASE_STATUSES,
} from './data/MediaCoverageCatalog.js';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const RUNTIME_STATUS_LABELS = Object.freeze({
  playable: 'JOUABLE',
  encounter: 'RENCONTRE 3D',
  customization: 'PERSONNALISATION',
  gallery: 'GALERIE 3D',
  archive: 'ARCHIVE',
  partial: 'COUVERT EN PARTIE',
});


function normalizeMeter(value, maxValue) {
  const max = Number.isFinite(maxValue) && maxValue > 0 ? maxValue : 1;
  const current = Number.isFinite(value) ? clamp(value, 0, max) : 0;

  return {
    current,
    max,
    percent: Math.round((current / max) * 100),
  };
}

export class HUDManager {
  constructor() {
    this.visionOverlay = document.getElementById('vision-overlay');
    this.visionModeDisplay = document.getElementById('vision-mode-display');
    this.honorRankDisplay = document.getElementById('honor-rank-display');
    this.honorScoreDisplay = document.getElementById('honor-score-display');
    this.targetScannedName = document.getElementById('target-scanned-name');

    this.hpBar = document.getElementById('hp-bar');
    this.hpVal = document.getElementById('hp-val');
    this.energyBar = document.getElementById('energy-bar');
    this.energyVal = document.getElementById('energy-val');
    this.staminaBar = document.getElementById('stamina-bar');
    this.staminaVal = document.getElementById('stamina-val');
    
    this.cloakCard = document.getElementById('cloak-status-card');
    this.cloakText = document.getElementById('cloak-state-text');
    this.canopyBadge = document.getElementById('canopy-badge');
    this.acidBadge = document.getElementById('acid-badge');
    this.gadgetStates = {
      shield: document.getElementById('gadget-shield-state'),
      drone: document.getElementById('gadget-drone-state'),
      shuriken: document.getElementById('gadget-shuriken-state'),
      decoy: document.getElementById('gadget-decoy-state'),
      roar: document.getElementById('gadget-roar-state'),
    };

    this.qteOverlay = document.getElementById('qte-overlay');

    this.bossDisplayName = document.getElementById('boss-display-name');
    this.bossHpBar = document.getElementById('boss-hp-bar');
    this.bossCard = this.bossDisplayName?.closest?.('.boss-card')
      ?? this.bossDisplayName?.parentElement ?? null;
    this.part1Label = document.getElementById('part-1-label');
    this.part2Label = document.getElementById('part-2-label');
    this.hornStatus = document.getElementById('horn-status');
    this.tailStatus = document.getElementById('tail-status');
    this.directiveHud = document.getElementById('directive-hud');
    this.directiveHudTitle = document.getElementById('directive-hud-title');
    this.directiveHudProgress = document.getElementById('directive-hud-progress');
    this.directiveHudObjective = document.getElementById('directive-hud-objective');

    this.triLaser = document.getElementById('tri-laser-container');
    this.lockonBracket = document.getElementById('lockon-bracket');
    this.lockonDistance = document.getElementById('lockon-distance');
    this.weakpointTag = document.getElementById('weakpoint-tag');

    this.actionPrompt = document.getElementById('action-prompt');
    this.actionPromptText = document.getElementById('action-prompt-text');
    this.logBanner = document.getElementById('log-banner');
    this.logTimeoutId = null;

    this.weaponSelector = document.getElementById('weapon-selector');
    this.skinGrid = document.getElementById('skin-catalog-grid');
    this.appearanceControls = {
      maskId: document.getElementById('custom-mask'),
      skinColorId: document.getElementById('custom-skin-color'),
      dreadColorId: document.getElementById('custom-dread-color'),
      armorColorId: document.getElementById('custom-armor-color'),
      armorAccentColorId: document.getElementById('custom-armor-accent'),
      hunterClassId: document.getElementById('custom-hunter-class'),
      dreadStyleId: document.getElementById('custom-dread-style'),
      armorFinishId: document.getElementById('custom-armor-finish'),
      warpaintId: document.getElementById('custom-warpaint'),
    };
    this.contentGrids = {
      technology: document.getElementById('technology-catalog-grid'),
      vehicles: document.getElementById('vehicle-catalog-grid'),
      enemies: document.getElementById('enemy-catalog-grid'),
      events: document.getElementById('event-catalog-grid'),
      bosses: document.getElementById('boss-catalog-grid'),
      support: document.getElementById('support-catalog-grid'),
      media: document.getElementById('media-coverage-grid'),
    };

    // The HUD is refreshed from the render loop. Keep a per-node value cache so
    // unchanged text, classes and ARIA states do not trigger DOM mutations at 60 FPS.
    this.renderCache = new WeakMap();

    this.hpMeter = this.configureMeter(this.hpBar, 'Santé Yautja');
    this.energyMeter = this.configureMeter(this.energyBar, 'Énergie plasma');
    this.staminaMeter = this.configureMeter(this.staminaBar, 'Endurance');
    this.bossHpMeter = this.configureMeter(this.bossHpBar, 'Santé de la cible');

    this.setAttribute(this.targetScannedName, 'aria-live', 'polite');
    this.setAttribute(this.targetScannedName, 'aria-atomic', 'true');
    this.setAttribute(this.cloakCard, 'role', 'status');
    this.setAttribute(this.cloakCard, 'aria-live', 'polite');
    this.setAttribute(this.cloakCard, 'aria-atomic', 'true');
    this.setAttribute(this.actionPrompt, 'role', 'status');
    this.setAttribute(this.actionPrompt, 'aria-live', 'polite');
    this.setAttribute(this.actionPrompt, 'aria-atomic', 'true');
    this.setAttribute(this.logBanner, 'role', 'status');
    this.setAttribute(this.logBanner, 'aria-live', 'polite');
    this.setAttribute(this.logBanner, 'aria-atomic', 'true');
    this.setAttribute(this.triLaser, 'aria-hidden', 'true');
    this.setAttribute(this.lockonBracket, 'aria-hidden', 'true');

    this.renderWeaponSelector();
    this.weaponSlots = document.querySelectorAll('.weapon-slot');
    this.weaponSlots.forEach((slot) => {
      this.setAttribute(slot, 'aria-pressed', 'false');
    });

    this.renderSkinCatalog();
    this.renderAppearanceCatalog();
    this.renderExpandedContentCatalog();
    this.renderMediaCoverageCatalog();
    this.updateContentCatalogCounts();
  }

  commit(element, key, value, mutate) {
    if (!element) return false;
    let values = this.renderCache.get(element);
    if (!values) {
      values = Object.create(null);
      this.renderCache.set(element, values);
    }
    if (values[key] === value) return false;
    mutate();
    values[key] = value;
    return true;
  }

  setText(element, value) {
    const text = String(value);
    return this.commit(element, 'text', text, () => { element.textContent = text; });
  }

  setAttribute(element, name, value) {
    const text = String(value);
    return this.commit(element, `attr:${name}`, text, () => { element.setAttribute(name, text); });
  }

  setClassState(element, className, enabled) {
    return this.commit(element, `class:${className}`, enabled, () => {
      element.classList.toggle(className, enabled);
    });
  }

  setStyle(element, property, value) {
    return this.commit(element, `style:${property}`, value, () => {
      element.style[property] = value;
    });
  }

  configureMeter(fillElement, label) {
    const meter = fillElement?.parentElement;
    if (!meter) return null;
    this.setAttribute(meter, 'role', 'progressbar');
    this.setAttribute(meter, 'aria-label', label);
    this.setAttribute(meter, 'aria-valuemin', '0');
    this.setAttribute(fillElement, 'aria-hidden', 'true');
    return meter;
  }

  updateMeter(fillElement, outputElement, meterElement, value, maxValue) {
    const meter = normalizeMeter(value, maxValue);
    const currentText = String(Math.ceil(meter.current));
    const maxText = String(Math.ceil(meter.max));
    const valueText = `${currentText} / ${maxText}`;

    this.setStyle(fillElement, 'width', `${meter.percent}%`);
    this.setText(outputElement, valueText);
    this.setAttribute(meterElement, 'aria-valuemax', maxText);
    this.setAttribute(meterElement, 'aria-valuenow', currentText);
    this.setAttribute(meterElement, 'aria-valuetext', valueText);
  }

  renderWeaponSelector() {
    if (!this.weaponSelector) return;
    const buttons = PLAYABLE_WEAPONS.map((weapon) => {
      const slot = document.createElement('button');
      slot.type = 'button';
      slot.className = 'weapon-slot';
      slot.id = `wep-${weapon.slot}`;
      slot.dataset.wep = String(weapon.slot);
      slot.title = `${weapon.name} — ${weapon.sourceTier}`;

      const number = document.createElement('span');
      number.className = 'wep-num';
      number.textContent = `[${weapon.keyLabel ?? weapon.slot}]`;
      const name = document.createElement('span');
      name.className = 'wep-name';
      name.textContent = weapon.shortName;
      slot.append(number, name);
      return slot;
    });
    this.weaponSelector.replaceChildren(...buttons);
  }

  fillSelect(select, entries) {
    if (!select) return;
    const options = entries.map((entry) => {
      const option = document.createElement('option');
      option.value = entry.id;
      option.textContent = entry.name;
      return option;
    });
    select.replaceChildren(...options);
  }

  renderAppearanceCatalog() {
    this.fillSelect(this.appearanceControls.maskId, MASK_VARIANTS);
    this.fillSelect(this.appearanceControls.skinColorId, SKIN_PALETTES);
    this.fillSelect(this.appearanceControls.dreadColorId, DREAD_PALETTES);
    this.fillSelect(this.appearanceControls.armorColorId, ARMOR_PALETTES);
    this.fillSelect(this.appearanceControls.armorAccentColorId, ARMOR_ACCENTS);
    this.fillSelect(this.appearanceControls.hunterClassId, HUNTER_CLASSES);
    this.fillSelect(this.appearanceControls.dreadStyleId, DREAD_STYLES);
    this.fillSelect(this.appearanceControls.armorFinishId, ARMOR_FINISHES);
    this.fillSelect(this.appearanceControls.warpaintId, WARPAINT_PATTERNS);
  }

  syncCustomization(customization = {}) {
    Object.entries(this.appearanceControls).forEach(([key, select]) => {
      if (select && typeof customization[key] === 'string') select.value = customization[key];
    });
  }

  renderContentGrid(container, entries) {
    if (!container) return;
    const cards = entries.map((entry) => {
      const tier = LORE_SOURCE_TIERS[entry.sourceTier] ?? LORE_SOURCE_TIERS.ORIGINAL;
      const card = document.createElement('article');
      card.className = 'content-catalog-card';
      card.dataset.contentId = entry.id;
      card.style.setProperty('--lore-tier-color', tier.color);

      const header = document.createElement('div');
      header.className = 'content-card-header';
      const title = document.createElement('h4');
      title.textContent = entry.name;
      const badge = document.createElement('span');
      badge.className = 'codex-tier';
      badge.textContent = tier.shortLabel;
      badge.title = tier.label;
      const runtimeBadge = document.createElement('span');
      runtimeBadge.className = `runtime-status runtime-status-${entry.runtimeStatus ?? 'archive'}`;
      runtimeBadge.textContent = RUNTIME_STATUS_LABELS[entry.runtimeStatus] ?? RUNTIME_STATUS_LABELS.archive;
      runtimeBadge.title = 'Disponibilité actuelle dans Apex Hunt';
      const badges = document.createElement('div');
      badges.className = 'content-card-badges';
      badges.append(badge, runtimeBadge);
      header.append(title, badges);

      const description = document.createElement('p');
      description.textContent = entry.description;
      const gameplay = document.createElement('small');
      gameplay.textContent = entry.gameplay ?? entry.role ?? 'Répertorié dans les archives de chasse.';
      card.append(header, description, gameplay);
      return card;
    });
    container.replaceChildren(...cards);
  }

  renderExpandedContentCatalog() {
    this.renderContentGrid(this.contentGrids.technology, TECH_CATALOG);
    this.renderContentGrid(this.contentGrids.vehicles, VEHICLE_CATALOG);
    this.renderContentGrid(this.contentGrids.enemies, ENEMY_CATALOG);
    this.renderContentGrid(this.contentGrids.events, LEVEL_EVENT_CATALOG);
    this.renderContentGrid(this.contentGrids.bosses, HUNT_BOSS_CATALOG);
    this.renderContentGrid(this.contentGrids.support, SUPPORT_CATALOG);
  }

  getSafeSourceUrl(sourceUrl) {
    try {
      const parsed = new URL(sourceUrl, globalThis.location?.href);
      return parsed.protocol === 'https:' ? parsed.href : null;
    } catch {
      return null;
    }
  }

  renderMediaCoverageCatalog() {
    const container = this.contentGrids.media;
    if (!container) return;

    const cards = MEDIA_COVERAGE_CATALOG.map((entry) => {
      const tier = MEDIA_PROVENANCE_TIERS[entry.provenanceTier]
        ?? MEDIA_PROVENANCE_TIERS.PRODUCTION_ARCHIVE;
      const card = document.createElement('article');
      card.className = 'content-catalog-card media-coverage-card';
      card.dataset.contentId = entry.id;
      card.dataset.mediaStatus = entry.status;
      card.style.setProperty('--lore-tier-color', tier.color);

      const header = document.createElement('div');
      header.className = 'content-card-header';
      const heading = document.createElement('div');
      const title = document.createElement('h4');
      title.textContent = entry.title;
      const meta = document.createElement('span');
      meta.className = 'media-coverage-meta';
      meta.textContent = `${entry.year} · ${entry.medium}`;
      heading.append(title, meta);

      const badges = document.createElement('div');
      badges.className = 'content-card-badges';
      const provenanceBadge = document.createElement('span');
      provenanceBadge.className = 'codex-tier';
      provenanceBadge.textContent = tier.shortLabel;
      provenanceBadge.title = tier.label;
      const releaseBadge = document.createElement('span');
      releaseBadge.className = `media-release-status media-release-status-${entry.status.toLowerCase()}`;
      releaseBadge.textContent = MEDIA_RELEASE_STATUSES[entry.status] ?? entry.status;
      releaseBadge.title = 'Statut de publication de l’œuvre';
      const runtimeBadge = document.createElement('span');
      runtimeBadge.className = `runtime-status runtime-status-${entry.gameCoverage.runtimeStatus}`;
      runtimeBadge.textContent = RUNTIME_STATUS_LABELS[entry.gameCoverage.runtimeStatus]
        ?? RUNTIME_STATUS_LABELS.archive;
      runtimeBadge.title = 'Couverture actuelle dans Apex Hunt';
      badges.append(provenanceBadge, releaseBadge, runtimeBadge);
      header.append(heading, badges);

      const continuity = document.createElement('p');
      continuity.className = 'media-coverage-continuity';
      continuity.textContent = `Continuité : ${entry.continuity}`;
      const summary = document.createElement('p');
      summary.textContent = entry.gameCoverage.summary;
      const targets = document.createElement('ul');
      targets.className = 'media-coverage-targets';
      entry.coverageTargets.forEach((target) => {
        const item = document.createElement('li');
        item.textContent = `${target.type.toUpperCase()} · ${target.label}`;
        targets.appendChild(item);
      });

      const safeSourceUrl = this.getSafeSourceUrl(entry.sourceUrl);
      const source = safeSourceUrl ? document.createElement('a') : document.createElement('span');
      source.className = 'media-coverage-source';
      source.textContent = safeSourceUrl ? 'Consulter la source' : 'Source externe indisponible';
      if (safeSourceUrl) {
        source.href = safeSourceUrl;
        source.target = '_blank';
        source.rel = 'noopener noreferrer';
      }
      card.append(header, continuity, summary, targets, source);
      return card;
    });

    container.replaceChildren(...cards);
  }

  updateContentCatalogCounts() {
    Object.values(this.contentGrids).forEach((grid) => {
      if (!grid?.id) return;
      const output = document.querySelector(`[data-count-for="${grid.id}"]`);
      if (output) output.textContent = String(grid.childElementCount);
    });

    const totalOutput = document.querySelector('[data-content-total]');
    if (totalOutput) {
      const total = Object.values(this.contentGrids)
        .reduce((count, grid) => count + (grid?.childElementCount ?? 0), 0);
      totalOutput.textContent = String(total);
    }
  }

  renderSkinCatalog() {
    if (!this.skinGrid) return;
    this.skinGrid.innerHTML = '';

    YautjaSkinsDatabase.forEach(s => {
      const tier = LORE_SOURCE_TIERS[s.sourceTier] ?? LORE_SOURCE_TIERS.ORIGINAL;
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'skin-card';
      card.style.setProperty('--lore-tier-color', tier.color);
      card.setAttribute('data-skin-id', s.id);
      card.setAttribute('aria-pressed', 'false');
      card.innerHTML = `
        <div class="skin-title">${s.name}</div>
        <div class="skin-origin">${s.origin}</div>
        <div class="codex-tier skin-tier" title="${tier.label}">${tier.shortLabel}</div>
        <div class="skin-desc">${s.desc}</div>
      `;
      this.skinGrid.appendChild(card);
    });
  }

  updateVitals(player) {
    this.updateMeter(this.hpBar, this.hpVal, this.hpMeter, player.health, player.maxHealth);
    this.updateMeter(this.energyBar, this.energyVal, this.energyMeter, player.energy, player.maxEnergy);
    this.updateMeter(this.staminaBar, this.staminaVal, this.staminaMeter, player.stamina, player.maxStamina);

    this.setText(this.honorScoreDisplay, `${player.honorScore} PTS`);
    this.setText(this.honorRankDisplay, player.ranks[player.honorRankIndex]);
    this.setAttribute(this.honorRankDisplay, 'title', `${Math.round(player.lifetimeHonor ?? player.honorScore)} points d’honneur cumulés`);
    const cooldownText = (value) => value > 0 ? `RECHARGE ${value.toFixed(1)}s` : 'PRÊT';
    const shieldState = player.wristShieldIntegrity <= 0
      ? 'BRISÉ'
      : player.wristShieldActive
        ? `ACTIF · ${Math.ceil(player.wristShieldIntegrity)}%`
        : `${cooldownText(player.wristShieldCooldown ?? 0)} · ${Math.ceil(player.wristShieldIntegrity ?? 100)}%`;
    this.setText(this.gadgetStates?.shield, shieldState);
    this.setText(this.gadgetStates?.drone, player.scoutDrone ? `EN VOL · ${(player.scoutDroneTimer ?? 0).toFixed(1)}s` : cooldownText(player.scoutDroneCooldown ?? 0));
    this.setText(this.gadgetStates?.shuriken, cooldownText(player.shurikenCooldown ?? 0));
    this.setText(this.gadgetStates?.decoy, player.apexDecoy ? `ACTIF · ${(player.apexDecoyTimer ?? 0).toFixed(1)}s` : cooldownText(player.apexDecoyCooldown ?? 0));
    this.setText(this.gadgetStates?.roar, player.roarUsed ? 'CONSOMMÉ POUR CETTE CHASSE' : 'DISPONIBLE');
    this.setClassState(this.gadgetStates?.shield?.parentElement, 'active', player.wristShieldActive === true);
    this.setClassState(this.gadgetStates?.drone?.parentElement, 'active', Boolean(player.scoutDrone));
    this.setClassState(this.gadgetStates?.decoy?.parentElement, 'active', Boolean(player.apexDecoy));


    if (player.isCloaked) {
      this.setClassState(this.cloakCard, 'cloaked', true);
      this.setClassState(this.cloakCard, 'uncloaked', false);
      this.setText(this.cloakText, 'ACTIF (INVISIBILITÉ)');
    } else {
      this.setClassState(this.cloakCard, 'cloaked', false);
      this.setClassState(this.cloakCard, 'uncloaked', true);
      this.setText(this.cloakText, 'INACTIF (VISIBLE)');
    }

    this.setClassState(this.canopyBadge, 'hidden', !player.isPerched);
    this.setClassState(this.acidBadge, 'hidden', !player.isAcidCorroded);
    this.setClassState(this.qteOverlay, 'hidden', !player.inQTE);

    this.weaponSlots.forEach(slot => {
      const wepId = parseInt(slot.getAttribute('data-wep'));
      const selected = wepId === player.selectedWeapon;
      this.setClassState(slot, 'active', selected);
      this.setAttribute(slot, 'aria-pressed', String(selected));
    });
  }

  updateBossStatus(boss, huntType) {
    if (!boss) return;
    this.setClassState(this.bossCard, 'hidden', false);
    this.updateMeter(this.bossHpBar, null, this.bossHpMeter, boss.health, boss.maxHealth);

    const definition = HUNT_DEFINITIONS[huntType] ?? HUNT_DEFINITIONS.goliath;
    this.setText(this.bossDisplayName, definition.name.toUpperCase());

    const renderPart = (part, labelElement, statusElement) => {
      if (!part) return;
      const [label, property, intactLabel, brokenLabel] = part;
      const raw = boss[property];
      const intact = typeof raw === 'number'
        ? raw >= (raw > 1 ? 60 : 0.6)
        : Boolean(raw);
      this.setText(labelElement, label);
      this.setText(statusElement, intact ? intactLabel : brokenLabel);
      this.setClassState(statusElement, 'part-destroyed', !intact);
      this.setClassState(statusElement, 'part-intact', intact);
    };

    renderPart(definition.hud?.part1, this.part1Label, this.hornStatus);
    renderPart(definition.hud?.part2, this.part2Label, this.tailStatus);
    this.setText(this.targetScannedName, `${definition.name.toUpperCase()} — BIOSIGNATURE VERROUILLÉE`);
  }

  updateDirectiveStatus(directive, summary) {
    const visible = Boolean(directive && directive.id !== 'standard_hunt' && summary);
    this.setClassState(this.directiveHud, 'hidden', !visible);
    if (!visible) return;

    const total = Math.max(0, Number(summary.totalObjectives) || 0);
    const completed = Math.max(0, Math.min(total, Number(summary.completedObjectives) || 0));
    const nextObjective = summary.objectives?.find(({ completed: done }) => !done);
    this.setText(this.directiveHudTitle, directive.title.toUpperCase());
    this.setText(
      this.directiveHudProgress,
      summary.isComplete ? 'DIRECTIVE ACCOMPLIE' : `${completed} / ${total} OBJECTIFS`,
    );
    this.setText(
      this.directiveHudObjective,
      summary.isComplete ? 'BONUS D’HONNEUR SÉCURISÉ' : nextObjective?.label?.toUpperCase() ?? 'TRAQUE EN COURS',
    );
  }

  showHubTarget() {
    this.setClassState(this.bossCard, 'hidden', true);
    this.setClassState(this.directiveHud, 'hidden', true);
    this.setText(this.targetScannedName, 'VAISSEAU-MÈRE YAUTJA — SALLE DES TROPHÉES');
  }

  setVisionModeUI(mode) {
    if (mode === 'thermal') {
      this.setAttribute(this.visionOverlay, 'class', 'vision-thermal');
      this.setText(this.visionModeDisplay, 'THERMIQUE INFRA-ROUGE');
    } else if (mode === 'tech') {
      this.setAttribute(this.visionOverlay, 'class', 'vision-tech');
      this.setText(this.visionModeDisplay, 'ÉLECTROMAGNÉTIQUE TECH');
    } else {
      this.setAttribute(this.visionOverlay, 'class', 'vision-normal');
      this.setText(this.visionModeDisplay, 'MASQUE NORMAL');
    }
  }

  updateTriLaserPosition(screenPos, distance, isWeakpoint) {
    const hasPosition = Number.isFinite(screenPos?.x) && Number.isFinite(screenPos?.y);
    if (hasPosition) {
      // Le verrouillage devient un indicateur de bord quand la cible sort du
      // cadre. Cela garde le réticule et ses libellés dans le viewport mobile
      // au lieu d'agrandir silencieusement la largeur du document.
      const clampToViewport = (value, viewportSize, safeMargin = 96) => {
        if (!Number.isFinite(viewportSize) || viewportSize <= 0) return value;
        const edge = Math.min(safeMargin, viewportSize / 2);
        return Math.min(Math.max(value, edge), Math.max(edge, viewportSize - edge));
      };
      const viewportWidth = Number(globalThis.innerWidth);
      const viewportHeight = Number(globalThis.innerHeight);
      const x = Math.round(clampToViewport(screenPos.x, viewportWidth) * 10) / 10;
      const y = Math.round(clampToViewport(screenPos.y, viewportHeight) * 10) / 10;
      const targetTransform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(var(--hud-scale))`;
      const distanceText = Number.isFinite(distance)
        ? `${distance.toFixed(1)}m - SIGNAL THERMIQUE`
        : 'DISTANCE INCONNUE - SIGNAL THERMIQUE';

      this.setClassState(this.triLaser, 'hidden', false);
      this.setStyle(this.triLaser, 'transform', targetTransform);
      this.setClassState(this.lockonBracket, 'hidden', false);
      this.setStyle(this.lockonBracket, 'transform', targetTransform);
      this.setText(this.lockonDistance, distanceText);
      this.setClassState(this.weakpointTag, 'hidden', !isWeakpoint);
    } else {
      this.setClassState(this.triLaser, 'hidden', true);
      this.setClassState(this.lockonBracket, 'hidden', true);
      this.setClassState(this.weakpointTag, 'hidden', true);
    }
  }

  showActionPrompt(text) {
    this.setText(this.actionPromptText, text);
    this.setClassState(this.actionPrompt, 'hidden', false);
  }

  hideActionPrompt() {
    this.setClassState(this.actionPrompt, 'hidden', true);
  }

  showLogMessage(msg, duration = 3000) {
    if (this.logTimeoutId !== null) clearTimeout(this.logTimeoutId);
    this.setText(this.logBanner, msg);
    this.setClassState(this.logBanner, 'hidden', false);
    this.logTimeoutId = setTimeout(() => {
      this.logTimeoutId = null;
      this.setClassState(this.logBanner, 'hidden', true);
    }, duration);
  }
}
