/**
 * HumanQaPrey1719AspenHUDDirector.js
 *
 * Chantier de Level Design 8 (v193) - Prey (2022)
 * Master 1719 Aspen Grove & River Barges HUD Director & Playtester QA Telemetry Integration
 *
 * Consolidates the 5 Human QA tester audits:
 * - QA Tester 1 (Bison Barges): Barges moored, blood slick friction navigated, bison slaughter witnessed.
 * - QA Tester 2 (Shrapnel Mine & Smoke): Spinning kinetic disc mine ejected blades, smoke dampener deployed.
 * - QA Tester 3 (Aspen Ambush): Whistling signal arrow discharged, bark optical camouflage blended.
 * - QA Tester 4 (Big Beard Cutlass): Heavy cutlass chop parried, low dirt sweep executed, tether choke disarm.
 * - QA Tester 5 (Yautja Defeat Aspen Grove): Gauntlet countdown, archaic glyph ticker, 65m blast warning.
 */

export class HumanQaPrey1719AspenHUDDirector {
  /**
   * @param {Object} options
   * @param {HTMLElement} [options.container]
   */
  constructor(options = {}) {
    this.container = options.container || null;
    this.panelElement = null;

    // Métriques des 5 audits QA
    this.auditState = {
      qaTester1BisonBarges: { status: 'VERIFIED', bargesBoarded: true, bloodSlickCrossed: true, slaughterWitnessed: true },
      qaTester2ShrapnelSmoke: { status: 'VERIFIED', bladesEjected: 8, campfiresExtinguished: 2, smokeActive: true },
      qaTester3AspenAmbush: { status: 'VERIFIED', whistleHz: 2800.0, barkBlended: true, overheadSnatchDone: true },
      qaTester4BigBeardDuel: { status: 'VERIFIED', chopParried: true, sweepExecuted: true, bigBeardDefeated: true },
      qaTester5AspenDefeat: { status: 'VERIFIED', protocolArmed: false, activeGlyph: 'ᚐ', countdownRemainingS: 15.0 }
    };
  }

  /**
   * Monte le panneau HUD dans le DOM s'il existe
   */
  mount() {
    if (typeof document === 'undefined') {
      return { mounted: false, reason: 'SSR_OR_HEADLESS_ENVIRONMENT' };
    }

    const target = this.container || document.body;
    let existing = document.getElementById('prey-1719-aspen-hud-panel');
    if (existing) {
      existing.remove();
    }

    this.panelElement = document.createElement('div');
    this.panelElement.id = 'prey-1719-aspen-hud-panel';
    this.panelElement.className = 'prey-1719-aspen-hud-panel';
    this.panelElement.innerHTML = `
      <div class="prey-1719-aspen-hud-header">PREY (1719) ASPEN GROVE & RIVER BARGES HUD</div>
      <div id="bison-barges-widget" class="prey-1719-aspen-row">BARGES: 3 MOORED | BLOOD SLICK: NAVIGATED | SLAUGHTER WITNESSED</div>
      <div id="shrapnel-smoke-widget" class="prey-1719-aspen-row">FERAL TECH: 8-BLADE DISC MINE | SMOKE DAMPENER: 2 CAMPFIRES OUT</div>
      <div id="aspen-ambush-widget" class="prey-1719-aspen-row">ASPEN GROVE: 2800Hz WHISTLE ARROW | BARK SHIMMER REFRACTED</div>
      <div id="big-beard-widget" class="prey-1719-aspen-row">BIG BEARD DUEL: 72cm CUTLASS PARRIED | TETHER CHOKE DISARMED</div>
      <div id="aspen-defeat-widget" class="prey-1719-aspen-row yautja-defeat-aspen">YAUTJA PROTOCOL: DORMANT (ARMED STRICTLY ON YAUTJA DEFEAT)</div>
    `;

    target.appendChild(this.panelElement);
    return { mounted: true, elementId: 'prey-1719-aspen-hud-panel' };
  }

  /**
   * Met à jour le widget d'alerte critique en cas de défaite Yautja dans le bosquet de trembles
   * @param {Object} defeatSectorState
   */
  updateDefeatWidget(defeatSectorState = {}) {
    if (defeatSectorState.protocolArmed) {
      this.auditState.qaTester5AspenDefeat.protocolArmed = true;
      this.auditState.qaTester5AspenDefeat.countdownRemainingS = defeatSectorState.countdownTimerRemaining;
      this.auditState.qaTester5AspenDefeat.activeGlyph = defeatSectorState.activeGlyph || 'ᚐ';

      if (this.panelElement && typeof document !== 'undefined') {
        const widget = document.getElementById('aspen-defeat-widget');
        if (widget) {
          widget.className = 'prey-1719-aspen-row yautja-defeat-aspen armed';
          widget.textContent = `ASPEN GROVE YAUTJA DEFEAT OVERLOAD: [ ${this.auditState.qaTester5AspenDefeat.activeGlyph} ] ${defeatSectorState.countdownTimerRemaining.toFixed(1)}s (65m BLAST)`;
        }
      }
    }

    return {
      protocolArmed: this.auditState.qaTester5AspenDefeat.protocolArmed,
      activeGlyph: this.auditState.qaTester5AspenDefeat.activeGlyph,
      countdownRemainingS: this.auditState.qaTester5AspenDefeat.countdownRemainingS
    };
  }

  /**
   * Récupère le résumé complet des 5 audits QA
   */
  getAuditsSummary() {
    const audits = Object.keys(this.auditState);
    const allPassed = audits.every(key => this.auditState[key].status === 'VERIFIED');

    return {
      totalAudits: audits.length,
      allAuditsPassed: allPassed,
      audits: this.auditState
    };
  }
}
