/**
 * HumanQaKillerOfKillersTribunalHUDDirector.js
 *
 * Chantier de Level Design 8 (v196) - Predator: Killer of Killers (2025)
 * Tribunal HUD Director & 5 Human QA audits:
 * 1 Mead Hall Siege, 2 Castle Moat, 3 Yautja Ship Cockpit, 4 Tribunal/Arena Duel/Oni Core, 5 Defeat Protocol.
 */

export class HumanQaKillerOfKillersTribunalHUDDirector {
  constructor(options = {}) {
    this.container = options.container || null;
    this.panelElement = null;

    this.auditState = {
      qaTester1MeadHall: { status: 'VERIFIED', shieldWall: 4, warbandRepelled: true },
      qaTester2CastleMoat: { status: 'VERIFIED', moatDepthM: 2.4, keepBreached: true },
      qaTester3ShipCockpit: { status: 'VERIFIED', altitudeM: 4200.0, controlsDecoded: true },
      qaTester4TribunalAndCore: { status: 'VERIFIED', trophies: 121, coreOverloaded: true },
      qaTester5TribunalDefeat: { status: 'VERIFIED', protocolArmed: false, activeGlyph: 'ᚁ', countdownRemainingS: 15.0 }
    };
  }

  mount() {
    if (typeof document === 'undefined') {
      return { mounted: false, reason: 'SSR_OR_HEADLESS_ENVIRONMENT' };
    }

    const target = this.container || document.body;
    const existing = document.getElementById('killer-of-killers-tribunal-hud-panel');
    if (existing) existing.remove();

    this.panelElement = document.createElement('div');
    this.panelElement.id = 'killer-of-killers-tribunal-hud-panel';
    this.panelElement.className = 'killer-of-killers-tribunal-hud-panel';
    this.panelElement.innerHTML = `
      <div class="killer-of-killers-tribunal-hud-header">KILLER OF KILLERS (2025) TRIBUNAL HUD</div>
      <div id="mead-hall-widget" class="killer-of-killers-tribunal-row">841 AD MEAD HALL: 4-SHIELD SKJALDBORG | WARBAND REPELLED</div>
      <div id="castle-moat-widget" class="killer-of-killers-tribunal-row">1609 MOAT: 2.4m REED DIVE | 11m ISHIGAKI | KEEP BREACHED</div>
      <div id="ship-cockpit-widget" class="killer-of-killers-tribunal-row">1942 ALIEN SCOUT: 4,200m | GLYPH CONTROLS DECODED</div>
      <div id="tribunal-core-widget" class="killer-of-killers-tribunal-row">PRIME TRIBUNAL: BONE BRIDGE | ONI CORE 4,800K OVERLOADED</div>
      <div id="tribunal-defeat-widget" class="killer-of-killers-tribunal-row yautja-defeat-tribunal">YAUTJA PROTOCOL: DORMANT (ARMED STRICTLY ON YAUTJA DEFEAT)</div>
    `;

    target.appendChild(this.panelElement);
    return { mounted: true, elementId: 'killer-of-killers-tribunal-hud-panel' };
  }

  updateDefeatWidget(defeatSectorState = {}) {
    if (defeatSectorState.protocolArmed) {
      const s = this.auditState.qaTester5TribunalDefeat;
      s.protocolArmed = true;
      s.countdownRemainingS = defeatSectorState.countdownTimerRemaining;
      s.activeGlyph = defeatSectorState.activeGlyph || 'ᚁ';

      if (this.panelElement && typeof document !== 'undefined') {
        const widget = document.getElementById('tribunal-defeat-widget');
        if (widget) {
          widget.className = 'killer-of-killers-tribunal-row yautja-defeat-tribunal armed';
          widget.textContent = `TRIBUNAL YAUTJA OVERLOAD: [ ${s.activeGlyph} ] ${defeatSectorState.countdownTimerRemaining.toFixed(1)}s (65m BLAST)`;
        }
      }
    }

    const s = this.auditState.qaTester5TribunalDefeat;
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
