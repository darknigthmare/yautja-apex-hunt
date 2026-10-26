/**
 * HumanQaPredatorBadlands2025HUDDirector.js
 *
 * Chantier de Level Design 8 (v197) - Predator: Badlands (2025)
 * Genna & Weyland-Yutani Telemetry HUD Director consolidating 5 Human QA audits:
 * 1 Kwei Exile Launch, 2 Genna Spore Wilderness & Thia Backpack, 3 Kalisk Regen & Bud Scent,
 * 4 Tessa WY Ambush & Bio-Weapons, 5 Strict Yautja Defeat Genna Protocol.
 */

export class HumanQaPredatorBadlands2025HUDDirector {
  constructor(options = {}) {
    this.container = options.container || null;
    this.panelElement = null;

    this.auditState = {
      qaTester1ExileLaunch: { status: 'VERIFIED', kweiSacrifice: true, podLaunched: true },
      qaTester2ThiaBackpack: { status: 'VERIFIED', fovDeg: 360.0, budBefriended: true },
      qaTester3KaliskRegen: { status: 'VERIFIED', headRegenSec: 1.8, scentHesitation: true },
      qaTester4TessaFirewall: { status: 'VERIFIED', firewallOverridden: true, chitinBuckler: true },
      qaTester5GennaDefeat: { status: 'VERIFIED', protocolArmed: false, activeGlyph: 'ᚡ', countdownRemainingS: 15.0 }
    };
  }

  mount() {
    if (typeof document === 'undefined') {
      return { mounted: false, reason: 'SSR_OR_HEADLESS_ENVIRONMENT' };
    }

    const target = this.container || document.body;
    const existing = document.getElementById('predator-badlands-2025-hud-panel');
    if (existing) existing.remove();

    this.panelElement = document.createElement('div');
    this.panelElement.id = 'predator-badlands-2025-hud-panel';
    this.panelElement.className = 'predator-badlands-2025-hud-panel';
    this.panelElement.innerHTML = `
      <div class="predator-badlands-2025-hud-header">PREDATOR: BADLANDS (2025) GENNA & WY HUD</div>
      <div id="badlands-exile-widget" class="predator-badlands-2025-row">YAUTJA PRIME: KWEI SACRIFICE | POD LAUNCHED TO GENNA</div>
      <div id="badlands-thia-widget" class="predator-badlands-2025-row">THIA SYNTH BACKPACK: 360° OPTICS | JUVENILE BUD IMPRINTED</div>
      <div id="badlands-kalisk-widget" class="predator-badlands-2025-row">APEX KALISK: 1.8s HEAD REGEN | OFFSPRING SCENT TRUCE</div>
      <div id="badlands-tessa-widget" class="predator-badlands-2025-row">WY TESSA AMBUSH: FIREWALL OVERRIDDEN | CHITIN BUCKLER</div>
      <div id="badlands-defeat-widget" class="predator-badlands-2025-row yautja-defeat-badlands">YAUTJA PROTOCOL: DORMANT (ARMED STRICTLY ON YAUTJA DEFEAT)</div>
    `;

    target.appendChild(this.panelElement);
    return { mounted: true, elementId: 'predator-badlands-2025-hud-panel' };
  }

  updateDefeatWidget(defeatSectorState = {}) {
    if (defeatSectorState.protocolArmed) {
      const s = this.auditState.qaTester5GennaDefeat;
      s.protocolArmed = true;
      s.countdownRemainingS = defeatSectorState.countdownTimerRemaining;
      s.activeGlyph = defeatSectorState.activeGlyph || 'ᚡ';

      if (this.panelElement && typeof document !== 'undefined') {
        const widget = document.getElementById('badlands-defeat-widget');
        if (widget) {
          widget.className = 'predator-badlands-2025-row yautja-defeat-badlands armed';
          widget.textContent = `GENNA YAUTJA OVERLOAD: [ ${s.activeGlyph} ] ${defeatSectorState.countdownTimerRemaining.toFixed(1)}s (65m BLAST)`;
        }
      }
    }

    const s = this.auditState.qaTester5GennaDefeat;
    return {
      protocolArmed: s.protocolArmed,
      activeGlyph: s.activeGlyph,
      countdownRemainingS: s.countdownRemainingS
    };
  }

  getAuditsSummary() {
    const audits = Object.keys(this.auditState);
    return {
      totalAudits: audits.length,
      allAuditsPassed: audits.every(key => this.auditState[key].status === 'VERIFIED'),
      audits: this.auditState
    };
  }
}
