import {
  MEDBAY_ITEMS,
  getMedbayDiagnostic,
  applyMedbayItem,
  canApplyMedbayItem,
} from '../gameplay/YautjaMedbaySystem.js';
import { audioSynth } from '../AudioSynthesizer.js';

export class MedbayInventoryOverlay {
  constructor({ player, inventoryState, onClose = null, onAction = null } = {}) {
    this.player = player;
    this.inventoryState = inventoryState;
    this.onClose = onClose;
    this.onAction = onAction;

    this.isOpen = false;
    this.container = null;
    this.logMessages = [];

    this._onKeyDown = this._handleKeyDown.bind(this);
  }

  mount(parent = globalThis.document?.body) {
    if (this.container) return this.container;

    if (typeof document === 'undefined') {
      this.container = {
        classList: {
          contains: (cls) => (cls === 'hidden' ? !this.isOpen : false),
          remove: () => {},
          add: () => {},
        },
        querySelector: () => null,
        querySelectorAll: () => [],
        setAttribute: () => {},
        getAttribute: (attr) => (attr === 'role' ? 'dialog' : null),
        parentNode: parent ?? null,
      };
      return this.container;
    }

    const overlay = document.createElement('div');
    overlay.className = 'yautja-medbay-overlay hidden';
    overlay.id = 'yautja-medbay-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Baie médicale Yautja et Medicomp');

    overlay.innerHTML = `
      <div class="medbay-window" id="medbay-draggable-window">
        <div class="medbay-header" id="medbay-drag-handle">
          <div class="medbay-title-group">
            <span class="medbay-glyph">ᚦᚱᛟᛞ</span>
            <span class="medbay-title">BAIE MÉDICALE YAUTJA // MEDICOMP DIÉGÉTIQUE</span>
            <span class="medbay-mode-tag" id="medbay-location-tag">${this.inventoryState?.isMothership ? 'SANCTUAIRE DU CROISEUR' : 'KIT DE TERRAIN DÉTACHABLE'}</span>
          </div>
          <div class="medbay-header-actions">
            <button class="medbay-close-btn" id="medbay-btn-close" aria-label="Fermer la baie médicale">✕</button>
          </div>
        </div>

        <div class="medbay-body">
          <div class="medbay-left-col">
            <div class="medbay-diag-panel">
              <div class="medbay-panel-title">TÉLÉMÉTRIE BIOLOGIQUE</div>
              <div class="medbay-vitals-row">
                <span class="vital-label">VITALITÉ :</span>
                <div class="vital-bar-wrap">
                  <div class="vital-bar-fill vital-hp" id="medbay-hp-fill" style="width: 100%;"></div>
                </div>
                <span class="vital-val" id="medbay-hp-val">100 / 100</span>
              </div>
              <div class="medbay-vitals-row">
                <span class="vital-label">ENDURANCE :</span>
                <div class="vital-bar-wrap">
                  <div class="vital-bar-fill vital-stamina" id="medbay-stamina-fill" style="width: 100%;"></div>
                </div>
                <span class="vital-val" id="medbay-stamina-val">100 / 100</span>
              </div>
              <div class="medbay-vitals-row">
                <span class="vital-label">ÉNERGIE :</span>
                <div class="vital-bar-wrap">
                  <div class="vital-bar-fill vital-energy" id="medbay-energy-fill" style="width: 100%;"></div>
                </div>
                <span class="vital-val" id="medbay-energy-val">100 / 100</span>
              </div>
              <div class="medbay-status-badge" id="medbay-status-badge">CONDITION : NOMINALE</div>
            </div>

            <div class="medbay-wireframe-panel">
              <div class="medbay-panel-title">SCAN ANATOMIQUE DU CHASSEUR</div>
              <div class="medbay-silhouette" id="medbay-silhouette-view">
                <div class="silhouette-node node-head" id="node-head" title="Biomasque et crâne"></div>
                <div class="silhouette-node node-torso" id="node-torso" title="Cage thoracique et organes"></div>
                <div class="silhouette-node node-arm-l" id="node-arm-l" title="Gantelet gauche"></div>
                <div class="silhouette-node node-arm-r" id="node-arm-r" title="Lames de poignet droites"></div>
                <div class="silhouette-node node-legs" id="node-legs" title="Jambières et locomoteur"></div>
              </div>
            </div>
          </div>

          <div class="medbay-right-col">
            <div class="medbay-panel-title">ARSENAL MÉDICAL ET SOINS 1:1</div>
            <div class="medbay-items-grid" id="medbay-items-grid">
              <!-- Item cards generated via renderItems() -->
            </div>
            <div class="medbay-log-panel" id="medbay-log-panel">
              <div class="medbay-log-title">JOURNAL CHIRURGICAL :</div>
              <div class="medbay-log-content" id="medbay-log-content">Prêt pour diagnostic d'intervention.</div>
            </div>
          </div>
        </div>

        <div class="medbay-footer">
          <span class="medbay-footer-hint">[ÉCHAP] FERMER · [E / M] BASCULER · CLIQUEZ POUR DÉTACHER ET DÉPLACER LA FENÊTRE</span>
          ${this.inventoryState?.isMothership ? '<button class="medbay-refill-btn" id="medbay-btn-refill">RECHARGER LES COMPOSANTS [PLEIN]</button>' : ''}
        </div>
      </div>
    `;

    this.container = overlay;
    parent.appendChild(overlay);

    this._bindEvents();
    this.render();
    return this.container;
  }

  _bindEvents() {
    if (!this.container) return;

    this.container.querySelector('#medbay-btn-close')?.addEventListener('click', () => {
      this.close();
    });

    this.container.querySelector('#medbay-btn-refill')?.addEventListener('click', () => {
      if (this.inventoryState) {
        for (const item of MEDBAY_ITEMS) {
          this.inventoryState.charges[item.id] = this.inventoryState.isMothership
            ? Number.POSITIVE_INFINITY
            : item.baseCharges;
          this.inventoryState.cooldowns[item.id] = 0;
        }
        audioSynth.playMedicompOpen?.();
        this.addLog('Réserves médicales rechargées à 100 % au laboratoire du croiseur.');
        this.render();
      }
    });

    // Support déplacement / fenêtre détachable
    this._setupDraggable();
  }

  _setupDraggable() {
    const handle = this.container.querySelector('#medbay-drag-handle');
    const win = this.container.querySelector('#medbay-draggable-window');
    if (!handle || !win) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    handle.style.cursor = 'grab';

    handle.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      isDragging = true;
      handle.style.cursor = 'grabbing';
      startX = e.clientX;
      startY = e.clientY;
      const rect = win.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      win.style.position = 'fixed';
      win.style.margin = '0';
      win.style.left = `${Math.max(10, Math.min(window.innerWidth - 100, initialLeft + deltaX))}px`;
      win.style.top = `${Math.max(10, Math.min(window.innerHeight - 80, initialTop + deltaY))}px`;
      win.style.transform = 'none';
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        handle.style.cursor = 'grab';
      }
    });
  }

  _handleKeyDown(event) {
    if (!this.isOpen) return;
    if (event.key === 'Escape' || event.code === 'KeyM') {
      event.preventDefault();
      this.close();
    }
  }

  open(player = this.player, inventoryState = this.inventoryState) {
    if (player) this.player = player;
    if (inventoryState) this.inventoryState = inventoryState;

    if (!this.container) this.mount();

    this.isOpen = true;
    this.container?.classList?.remove('hidden');
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this._onKeyDown);
    }

    audioSynth.playMedicompOpen?.();
    this.render();
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.container?.classList?.add('hidden');
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this._onKeyDown);
    }

    if (typeof this.onClose === 'function') {
      this.onClose();
    }
  }

  toggle(player = this.player, inventoryState = this.inventoryState) {
    if (this.isOpen) {
      this.close();
    } else {
      this.open(player, inventoryState);
    }
  }

  addLog(msg) {
    this.logMessages.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`);
    if (this.logMessages.length > 5) this.logMessages.pop();

    const logEl = this.container?.querySelector('#medbay-log-content');
    if (logEl) {
      logEl.innerHTML = this.logMessages.join('<br>');
    }
  }

  render() {
    if (!this.container || !this.player) return;

    const diag = getMedbayDiagnostic(this.player);
    if (!diag) return;

    // Vitals
    const hpFill = this.container.querySelector('#medbay-hp-fill');
    const hpVal = this.container.querySelector('#medbay-hp-val');
    const staminaFill = this.container.querySelector('#medbay-stamina-fill');
    const staminaVal = this.container.querySelector('#medbay-stamina-val');
    const energyFill = this.container.querySelector('#medbay-energy-fill');
    const energyVal = this.container.querySelector('#medbay-energy-val');
    const statusBadge = this.container.querySelector('#medbay-status-badge');

    if (hpFill) hpFill.style.width = `${Math.round(diag.hpRatio * 100)}%`;
    if (hpVal) hpVal.textContent = `${diag.currentHp} / ${diag.maxHp}`;
    if (staminaFill) staminaFill.style.width = `${Math.round((diag.stamina / diag.maxStamina) * 100)}%`;
    if (staminaVal) staminaVal.textContent = `${diag.stamina} / ${diag.maxStamina}`;
    if (energyFill) energyFill.style.width = `${Math.round((diag.energy / diag.maxEnergy) * 100)}%`;
    if (energyVal) energyVal.textContent = `${diag.energy} / ${diag.maxEnergy}`;

    if (statusBadge) {
      statusBadge.textContent = `CONDITION : ${diag.overallCondition}`;
      statusBadge.className = `medbay-status-badge ${diag.hasAcid ? 'status-critical' : diag.hasBleeding ? 'status-warning' : 'status-normal'}`;
    }

    // Anatomical nodes highlighting
    const nodeTorso = this.container.querySelector('#node-torso');
    const nodeArmL = this.container.querySelector('#node-arm-l');
    if (nodeTorso) nodeTorso.className = `silhouette-node node-torso ${diag.hasBleeding || diag.hpRatio < 0.6 ? 'node-injured' : ''}`;
    if (nodeArmL) nodeArmL.className = `silhouette-node node-arm-l ${diag.hasAcid ? 'node-corroded' : ''}`;

    // Items list
    const grid = this.container.querySelector('#medbay-items-grid');
    if (grid) {
      grid.innerHTML = '';
      for (const item of MEDBAY_ITEMS) {
        const check = canApplyMedbayItem(this.player, item.id, this.inventoryState);
        const charges = this.inventoryState?.charges[item.id];
        const chargesDisplay = charges === Number.POSITIVE_INFINITY ? 'ILLIMITÉ' : `${charges ?? 0}`;
        const cooldown = this.inventoryState?.cooldowns[item.id] ?? 0;

        const card = document.createElement('div');
        card.className = `medbay-item-card ${check.allowed ? 'item-ready' : 'item-disabled'}`;
        card.innerHTML = `
          <div class="item-header">
            <span class="item-name">${item.name}</span>
            <span class="item-charges">RÉSERVE : ${chargesDisplay}</span>
          </div>
          <div class="item-lore">${item.lore}</div>
          <div class="item-actions">
            <button class="medbay-action-btn" data-item-id="${item.id}" ${check.allowed ? '' : 'disabled'}>
              ${cooldown > 0 ? `RECHARGE (${cooldown.toFixed(1)}s)` : 'APPLIQUER LE SOIN'}
            </button>
          </div>
        `;

        const btn = card.querySelector('.medbay-action-btn');
        btn?.addEventListener('click', () => {
          this.executeItemAction(item.id);
        });

        grid.appendChild(card);
      }
    }
  }

  executeItemAction(itemId) {
    const result = applyMedbayItem(this.player, itemId, this.inventoryState, audioSynth);
    if (!result.success) {
      this.addLog(`Échec : ${result.reason}`);
      return result;
    }

    const { item, healthRestored, staminaRestored, energyRestored, curedStatuses } = result;
    let report = `${item.name} appliqué avec succès.`;
    if (healthRestored > 0) report += ` (+${Math.round(healthRestored)} PV)`;
    if (staminaRestored > 0) report += ` (+${Math.round(staminaRestored)} Endurance)`;
    if (energyRestored > 0) report += ` (+${Math.round(energyRestored)} Énergie)`;
    if (curedStatuses.length > 0) report += ` [Purger : ${curedStatuses.join(', ')}]`;

    this.addLog(report);
    this.render();

    if (typeof this.onAction === 'function') {
      this.onAction(result);
    }
    return result;
  }

  destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this._onKeyDown);
    }
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild?.(this.container);
    }
    this.container = null;
    this.isOpen = false;
  }
}
