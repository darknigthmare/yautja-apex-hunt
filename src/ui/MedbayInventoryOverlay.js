import {
  MEDBAY_ITEMS,
  getMedbayItemById,
  getMedbayDiagnostic,
  applyMedbayItem,
  canApplyMedbayItem,
  getMedbayTreatmentProfile,
  refillMedbayInventory,
} from '../gameplay/YautjaMedbaySystem.js';
import { audioSynth } from '../AudioSynthesizer.js';

export function getMedbayItemMiniatureSvg(item = {}) {
  const resolved = typeof item === 'string' ? (getMedbayItemById(item) || { id: item }) : (item || {});
  const id = String(resolved.id || 'shrapnel_extractor');
  const label = String(resolved.shortName || resolved.name || id).toUpperCase();
  const tier = String(resolved.sourceTier || 'SCREEN');

  let illustration = '';
  let accent = '#38bdf8';

  switch (id) {
    case 'shrapnel_extractor':
      accent = '#f59e0b';
      illustration = `
        <!-- Articulated surgical forceps gripping ballistic shrapnel -->
        <path d="M28 56 L78 36 L118 24 L132 28 L84 42 L34 62 Z" fill="#1e293b" stroke="#94a3b8" stroke-width="1.6"/>
        <path d="M28 20 L78 40 L118 52 L132 48 L84 34 L34 14 Z" fill="#1e293b" stroke="#94a3b8" stroke-width="1.6"/>
        <circle cx="80" cy="38" r="4.5" fill="#0f172a" stroke="#f59e0b" stroke-width="1.8"/>
        <path d="M118 24 L136 31 L130 35 M118 52 L136 45 L130 41" fill="none" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round"/>
        <polygon points="136,33 147,38 139,45 131,39" fill="#ef4444" stroke="#fca5a5" stroke-width="1.2"/>
        <circle cx="140" cy="38" r="9" fill="none" stroke="#ef4444" stroke-width="0.9" stroke-dasharray="3 2"/>
      `;
      break;
    case 'dermal_stapler':
      accent = '#fb923c';
      illustration = `
        <!-- Yautja mechanical dermal claw stapler -->
        <rect x="34" y="24" width="76" height="26" rx="4" fill="#1e293b" stroke="#fb923c" stroke-width="1.6"/>
        <path d="M44 32 H98 M44 42 H98" stroke="#64748b" stroke-width="2" stroke-dasharray="4 3"/>
        <path d="M110 24 L138 18 L144 32 L124 35 Z" fill="#334155" stroke="#fdba74" stroke-width="1.5"/>
        <path d="M110 50 L138 56 L144 42 L124 39 Z" fill="#334155" stroke="#fdba74" stroke-width="1.5"/>
        <path d="M145 27 V47 M151 29 V45 M157 31 V43" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round"/>
      `;
      break;
    case 'thermal_cauterizer':
      accent = '#22d3ee';
      illustration = `
        <!-- High-precision plasma thermal cauterizer torch -->
        <rect x="26" y="29" width="64" height="18" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="1.6"/>
        <path d="M40 29 V47 M52 29 V47 M64 29 V47 M76 29 V47" stroke="#0284c7" stroke-width="1.5"/>
        <polygon points="90,31 112,34 112,42 90,45" fill="#1e293b" stroke="#7dd3fc" stroke-width="1.4"/>
        <path d="M112 38 Q134 26 160 38 Q134 50 112 38 Z" fill="#06b6d4" fill-opacity="0.45" stroke="#67e8f9" stroke-width="1.6"/>
        <ellipse cx="128" cy="38" rx="14" ry="4" fill="#ecfeff"/>
      `;
      break;
    case 'coagulant_blue_paste':
      accent = '#38bdf8';
      illustration = `
        <!-- Ceremonial crucible with glowing blue regenerative paste -->
        <path d="M46 42 L56 60 H116 L126 42 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8"/>
        <ellipse cx="86" cy="42" rx="40" ry="8" fill="#0284c7" stroke="#7dd3fc" stroke-width="1.5"/>
        <ellipse cx="86" cy="42" rx="28" ry="4.5" fill="#67e8f9"/>
        <path d="M98 16 L112 22 L92 43 L82 40 Z" fill="#334155" stroke="#bae6fd" stroke-width="1.3"/>
        <circle cx="70" cy="28" r="2.5" fill="#67e8f9"/>
        <circle cx="84" cy="22" r="3" fill="#38bdf8"/>
        <circle cx="104" cy="29" r="2" fill="#bae6fd"/>
      `;
      break;
    case 'acid_neutralizer_vial':
      accent = '#10b981';
      illustration = `
        <!-- Wolf Cleaner alkaline neutralizing vial (AVP:R) -->
        <rect x="44" y="24" width="84" height="28" rx="8" fill="#064e3b" stroke="#34d399" stroke-width="1.7"/>
        <rect x="54" y="29" width="64" height="18" rx="4" fill="#10b981" fill-opacity="0.45" stroke="#6ee7b7" stroke-width="1.1"/>
        <path d="M36 30 H44 V46 H36 Z M128 30 H136 V46 H128 Z" fill="#1e293b" stroke="#34d399" stroke-width="1.4"/>
        <circle cx="72" cy="38" r="3.5" fill="#a7f3d0"/>
        <circle cx="88" cy="35" r="2.5" fill="#d1fae5"/>
        <circle cx="102" cy="40" r="4" fill="#6ee7b7"/>
        <path d="M142 38 H158 M150 30 V46" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>
      `;
      break;
    case 'stimulant_injector':
    default:
      accent = '#a855f7';
      illustration = `
        <!-- Cervical adrenaline pneumatic syringe -->
        <rect x="28" y="33" width="20" height="10" rx="2" fill="#334155" stroke="#c084fc" stroke-width="1.4"/>
        <rect x="48" y="26" width="68" height="24" rx="4" fill="#1e1b4b" stroke="#a855f7" stroke-width="1.7"/>
        <rect x="56" y="31" width="52" height="14" rx="2" fill="#9333ea" fill-opacity="0.55" stroke="#e9d5ff" stroke-width="1"/>
        <polygon points="116,30 132,34 132,42 116,46" fill="#334155" stroke="#c084fc" stroke-width="1.4"/>
        <path d="M132 35 L156 35 M132 41 L152 41" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round"/>
      `;
      break;
  }

  return `<svg class="tactical-miniature medbay-miniature-svg" viewBox="0 0 180 76" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" data-medbay-item-id="${id}">
    <rect x="2" y="2" width="176" height="72" rx="6" fill="#060c14" fill-opacity="0.88" stroke="${accent}" stroke-width="1" stroke-opacity="0.55"/>
    <path d="M8 16 V8 H18 M162 8 H172 V16 M8 60 V68 H18 M162 68 H172 V60" fill="none" stroke="${accent}" stroke-width="1.5"/>
    <line x1="12" y1="38" x2="168" y2="38" stroke="${accent}" stroke-width="0.4" stroke-dasharray="2 3" stroke-opacity="0.45"/>
    <text x="12" y="15" fill="${accent}" font-size="7.5" font-family="monospace" letter-spacing="1">${label}</text>
    <text x="168" y="15" text-anchor="end" fill="#94a3b8" font-size="6.8" font-family="monospace">${tier}</text>
    ${illustration}
    <text x="12" y="68" fill="#64748b" font-size="6.5" font-family="monospace">ᚦᚱᛟᛞ // MEDICOMP</text>
  </svg>`;
}

export function getMedbayAnatomicalScanSvg(diag = {}) {
  const torsoAlert = diag?.hasBleeding || (Number.isFinite(diag?.hpRatio) && diag.hpRatio < 0.6);
  const armAlert = Boolean(diag?.hasAcid);
  const legAlert = Boolean(diag?.hasSnare);
  const baseStroke = '#38bdf8';
  const torsoStroke = torsoAlert ? '#ef4444' : baseStroke;
  const armLeftStroke = armAlert ? '#10b981' : baseStroke;
  const legsStroke = legAlert ? '#f59e0b' : baseStroke;

  return `<svg class="medbay-anatomical-svg" viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
    <!-- Diegetic scan frame & grid -->
    <line x1="60" y1="6" x2="60" y2="194" stroke="#0ea5e9" stroke-width="0.45" stroke-dasharray="3 3" stroke-opacity="0.45"/>
    <line x1="10" y1="70" x2="110" y2="70" stroke="#0ea5e9" stroke-width="0.45" stroke-dasharray="3 3" stroke-opacity="0.35"/>
    <!-- Cranium, Bio-Mask & Yautja Mandibles -->
    <g class="scan-zone-head" stroke="${baseStroke}" fill="none">
      <path d="M46 22 C46 11, 74 11, 74 22 L71 39 L60 45 L49 39 Z" fill="#082f49" fill-opacity="0.45" stroke-width="1.5"/>
      <path d="M46 24 L37 38 M44 30 L35 44 M74 24 L83 38 M76 30 L85 44" stroke-width="1.2" stroke-opacity="0.75"/>
      <path d="M51 37 L46 43 M69 37 L74 43 M53 27 H58 M62 27 H67" stroke-width="1.2"/>
    </g>
    <!-- Thoracic Ribcage, Pauldrons & Spine -->
    <g class="scan-zone-torso" stroke="${torsoStroke}" fill="none">
      <path d="M36 48 L84 48 L78 102 L60 110 L42 102 Z" fill="#082f49" fill-opacity="0.38" stroke-width="1.6"/>
      <path d="M44 58 H76 M45 67 H75 M47 76 H73 M49 85 H71" stroke-width="1.2" stroke-opacity="0.8"/>
      <line x1="60" y1="46" x2="60" y2="108" stroke-width="1.4"/>
    </g>
    <!-- Left Gauntlet (Medicomp & Wrist Console) -->
    <g class="scan-zone-arm-l" stroke="${armLeftStroke}" fill="none">
      <path d="M35 50 L21 78 L16 110 L26 112 L33 82 L41 60" fill="#082f49" fill-opacity="0.35" stroke-width="1.5"/>
      <rect x="17" y="86" width="11" height="18" rx="2" stroke-width="1.3"/>
    </g>
    <!-- Right Gauntlet & Twin Wristblades -->
    <g class="scan-zone-arm-r" stroke="${baseStroke}" fill="none">
      <path d="M85 50 L99 78 L104 110 L94 112 L87 82 L79 60" fill="#082f49" fill-opacity="0.35" stroke-width="1.5"/>
      <path d="M101 108 L106 126 M97 109 L101 125" stroke="#e2e8f0" stroke-width="1.3" stroke-linecap="round"/>
    </g>
    <!-- Pelvis, Thighs & Greaves -->
    <g class="scan-zone-legs" stroke="${legsStroke}" fill="none">
      <path d="M44 110 L38 150 L35 186 L47 188 L53 150 L58 116" fill="#082f49" fill-opacity="0.35" stroke-width="1.5"/>
      <path d="M76 110 L82 150 L85 186 L73 188 L67 150 L62 116" fill="#082f49" fill-opacity="0.35" stroke-width="1.5"/>
      <path d="M37 150 H49 M71 150 H83" stroke-width="1.4"/>
    </g>
  </svg>`;
}

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
    this._dragCleanup = null;
    this.previousFocus = null;
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
    overlay.setAttribute('aria-hidden', 'true');
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
                ${getMedbayAnatomicalScanSvg(getMedbayDiagnostic(this.player) || {})}
                <div class="silhouette-node node-head" id="node-head" title="Biomasque et crâne"></div>
                <div class="silhouette-node node-torso" id="node-torso" title="Cage thoracique et organes"></div>
                <div class="silhouette-node node-arm-l" id="node-arm-l" title="Gantelet gauche"></div>
                <div class="silhouette-node node-arm-r" id="node-arm-r" title="Lames de poignet droites"></div>
                <div class="silhouette-node node-legs" id="node-legs" title="Jambières et locomoteur"></div>
              </div>
            </div>
          </div>

          <div class="medbay-right-col">
            <div class="medbay-panel-title">COMPOSANTS MÉDICAUX EMBARQUÉS</div>
            <div class="medbay-items-grid" id="medbay-items-grid">
              <!-- Item cards generated via renderItems() -->
            </div>
            <div class="medbay-log-panel" id="medbay-log-panel">
              <div class="medbay-log-title">JOURNAL CHIRURGICAL :</div>
              <div class="medbay-log-content" id="medbay-log-content" role="status" aria-live="polite">Prêt pour diagnostic d'intervention.</div>
            </div>
          </div>
        </div>

        <div class="medbay-footer">
          <span class="medbay-footer-hint">[ÉCHAP / M] FERMER · FAITES GLISSER L’EN-TÊTE POUR DÉPLACER LA FENÊTRE</span>
          <button class="medbay-refill-btn" id="medbay-btn-refill" hidden disabled>RECHARGER LES COMPOSANTS</button>
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
      if (this.inventoryState?.isMothership === true) {
        // The hub view can offer free treatment without converting the shared
        // portable kit into an infinite stock for the next hunt.
        const fieldInventory = this.player?.medbayInventory ?? this.inventoryState;
        refillMedbayInventory({ ...fieldInventory, isMothership: false });
        this.inventoryState.charges = fieldInventory.charges;
        this.inventoryState.cooldowns = fieldInventory.cooldowns;
        audioSynth.playMedicompOpen?.();
        this.addLog('Réserves médicales rechargées à 100 % au laboratoire du croiseur.');
        this.render();
        this.onAction?.({ success: true, type: 'refill' });
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

    const onPointerDown = (event) => {
      if (event.target.closest('button') || window.innerWidth <= 760) return;
      isDragging = true;
      handle.style.cursor = 'grabbing';
      startX = event.clientX;
      startY = event.clientY;
      const rect = win.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      handle.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    };
    const onPointerMove = (event) => {
      if (!isDragging) return;
      const rect = win.getBoundingClientRect();
      win.style.position = 'fixed';
      win.style.margin = '0';
      win.style.left = `${Math.max(8, Math.min(window.innerWidth - rect.width - 8, initialLeft + event.clientX - startX))}px`;
      win.style.top = `${Math.max(8, Math.min(window.innerHeight - rect.height - 8, initialTop + event.clientY - startY))}px`;
      win.style.transform = 'none';
    };
    const stopDragging = () => {
      isDragging = false;
      handle.style.cursor = 'grab';
    };
    const resetPosition = () => {
      stopDragging();
      for (const property of ['position', 'margin', 'left', 'top', 'transform']) win.style.removeProperty(property);
    };
    handle.style.cursor = 'grab';
    handle.addEventListener('pointerdown', onPointerDown);
    handle.addEventListener('pointermove', onPointerMove);
    handle.addEventListener('pointerup', stopDragging);
    handle.addEventListener('pointercancel', stopDragging);
    window.addEventListener('resize', resetPosition);
    this._dragCleanup = () => {
      handle.removeEventListener('pointerdown', onPointerDown);
      handle.removeEventListener('pointermove', onPointerMove);
      handle.removeEventListener('pointerup', stopDragging);
      handle.removeEventListener('pointercancel', stopDragging);
      window.removeEventListener('resize', resetPosition);
    };
  }

  _handleKeyDown(event) {
    if (!this.isOpen) return;
    // The medical window owns keyboard input while open. Keep movement and
    // combat shortcuts from reaching the game underneath it.
    event.stopPropagation?.();
    if (event.key === 'Tab') {
      const controls = [...(this.container?.querySelectorAll('button, input, select, [tabindex]') ?? [])]
        .filter((element) => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      const active = typeof document !== 'undefined' ? document.activeElement : null;
      if (controls.length && (!this.container.contains(active) || (event.shiftKey ? active === first : active === last))) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    }
    if (event.key === 'Escape' || event.code === 'KeyM') {
      event.preventDefault();
      this.close();
    }
  }

  open(player = this.player, inventoryState = this.inventoryState) {
    if (player) this.player = player;
    if (inventoryState) this.inventoryState = inventoryState;

    if (!this.container) this.mount();

    if (!this.isOpen && typeof document !== 'undefined') this.previousFocus = document.activeElement;
    this.isOpen = true;
    this.container?.classList?.remove('hidden');
    this.container?.setAttribute?.('aria-hidden', 'false');
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this._onKeyDown, true);
    }

    audioSynth.playMedicompOpen?.();
    this.render();
    this.container?.querySelector?.('#medbay-btn-close')?.focus?.();
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.container?.classList?.add('hidden');
    this.container?.setAttribute?.('aria-hidden', 'true');
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this._onKeyDown, true);
    }

    if (this.previousFocus?.isConnected) this.previousFocus.focus?.();
    this.previousFocus = null;

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

    const isMothership = this.inventoryState?.isMothership === true;
    const locationTag = this.container.querySelector('#medbay-location-tag');
    if (locationTag) locationTag.textContent = isMothership ? 'SANCTUAIRE DU CROISEUR' : 'KIT DE TERRAIN DÉTACHABLE';
    const refillButton = this.container.querySelector('#medbay-btn-refill');
    if (refillButton) { refillButton.hidden = !isMothership; refillButton.disabled = !isMothership; }

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
        const profile = getMedbayTreatmentProfile(this.player, item.id);
        const treatmentEffects = [profile.effects.health ? `+${profile.effects.health} PV` : '',
          profile.immunityDurationSeconds ? `${profile.immunityDurationSeconds} s de protection anti-acide` : '',
          `recharge ${profile.cooldown.toFixed(1)} s`].filter(Boolean).join(' · ');
        const check = canApplyMedbayItem(this.player, item.id, this.inventoryState);
        const charges = this.inventoryState?.isMothership
          ? Number.POSITIVE_INFINITY
          : this.inventoryState?.charges[item.id];
        const chargesDisplay = charges === Number.POSITIVE_INFINITY ? 'ILLIMITÉ' : `${charges ?? 0}`;
        const cooldown = this.inventoryState?.cooldowns[item.id] ?? 0;

        const card = document.createElement('div');
        card.className = `medbay-item-card ${check.allowed ? 'item-ready' : 'item-disabled'}`;
        card.innerHTML = `
          <div class="card-miniature-box medbay-miniature">${getMedbayItemMiniatureSvg(item)}</div>
          <div class="item-header">
            <span class="item-name">${item.name}</span>
            <span class="item-charges">RÉSERVE : ${chargesDisplay}</span>
          </div>
          <div class="item-lore">${item.lore}</div>
          <p class="medbay-item-effects">${treatmentEffects}</p>
          ${check.allowed ? '' : `<p class="medbay-item-availability">${check.reason}</p>`}
          <div class="item-actions">
            <button class="medbay-action-btn" aria-label="Appliquer : ${item.name}" data-item-id="${item.id}" ${check.allowed ? '' : 'disabled'}>
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
      window.removeEventListener('keydown', this._onKeyDown, true);
    }
    this._dragCleanup?.();
    this._dragCleanup = null;
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild?.(this.container);
    }
    this.container = null;
    this.isOpen = false;
  }
}
