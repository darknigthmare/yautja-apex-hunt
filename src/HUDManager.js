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
import { PLAYABLE_WEAPONS } from './data/RuntimeEquipment.js';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const RUNTIME_STATUS_LABELS = Object.freeze({
  playable: 'JOUABLE',
  encounter: 'RENCONTRE 3D',
  customization: 'PERSONNALISATION',
  gallery: 'GALERIE 3D',
  archive: 'ARCHIVE',
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

    this.qteOverlay = document.getElementById('qte-overlay');

    this.bossDisplayName = document.getElementById('boss-display-name');
    this.bossHpBar = document.getElementById('boss-hp-bar');
    this.part1Label = document.getElementById('part-1-label');
    this.part2Label = document.getElementById('part-2-label');
    this.hornStatus = document.getElementById('horn-status');
    this.tailStatus = document.getElementById('tail-status');

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
    };
    this.contentGrids = {
      technology: document.getElementById('technology-catalog-grid'),
      vehicles: document.getElementById('vehicle-catalog-grid'),
      enemies: document.getElementById('enemy-catalog-grid'),
      events: document.getElementById('event-catalog-grid'),
      bosses: document.getElementById('boss-catalog-grid'),
      support: document.getElementById('support-catalog-grid'),
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
      number.textContent = `[${weapon.slot}]`;
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

  showHubTarget() {
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
      const x = Math.round(screenPos.x * 10) / 10;
      const y = Math.round(screenPos.y * 10) / 10;
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
