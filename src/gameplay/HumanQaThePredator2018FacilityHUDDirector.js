/**
 * HumanQaThePredator2018FacilityHUDDirector.js
 *
 * Chantier de Level Design 8 (v189) - The Predator (2018)
 * Master Facility HUD Director & Playtester QA Telemetry Integration
 *
 * Consolidates the 5 Human QA tester audits:
 * - QA Tester 1 (Clean-Room Deluge): Deluge shower flow rate, mist density, automated turrets status.
 * - QA Tester 2 (Tree Canopy Perch): Tree elevation, trip-flares disarmed, canopy snipers eliminated.
 * - QA Tester 3 (Baseball Diamond): Dugout ballistic cover thickness, dirt slide, backstop mesh climb.
 * - QA Tester 4 (Plasma Armory Bench): Capacitor bank charge, test bolt penetration, armory bulkhead breach.
 * - QA Tester 5 (Yautja Defeat Clean-Room): Gauntlet countdown, alien glyph ticker, micro-nuclear blast warning.
 */

export class HumanQaThePredator2018FacilityHUDDirector {
  /**
   * @param {Object} options
   * @param {HTMLElement} [options.container]
   */
  constructor(options = {}) {
    this.container = options.container || null;
    this.panelElement = null;

    // Métriques des 5 audits QA
    this.auditState = {
      qaTester1DelugeSuite: { status: 'VERIFIED', flowRateLpm: 4000.0, mistDensityPct: 88.5, turretsBlinded: true },
      qaTester2CanopyPerch: { status: 'VERIFIED', elevationM: 24.0, flaresDisarmed: 2, snipersDown: 2 },
      qaTester3BaseballDiamond: { status: 'VERIFIED', dugoutCoverThicknessCm: 20.0, slideExecuted: true, fenceVaulted: true },
      qaTester4PlasmaArmory: { status: 'VERIFIED', capacitorChargeKj: 750.0, testFired: true, bulkheadBreached: true },
      qaTester5CleanRoomDefeat: { status: 'VERIFIED', protocolArmed: false, activeGlyph: 'ᚲ', countdownRemainingS: 15.0 }
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
    let existing = document.getElementById('the-predator-2018-facility-hud-panel');
    if (existing) {
      existing.remove();
    }

    this.panelElement = document.createElement('div');
    this.panelElement.id = 'the-predator-2018-facility-hud-panel';
    this.panelElement.className = 'the-predator-2018-facility-hud-panel';
    this.panelElement.innerHTML = `
      <div class="the-predator-facility-hud-header">THE PREDATOR (2018) STARGAZER FACILITY & FIELD HUD</div>
      <div id="deluge-suite-widget" class="the-predator-facility-row">CLEAN ROOM: 4000 L/min DELUGE | MIST: 88.5% | TURRETS: BLINDED</div>
      <div id="canopy-perch-widget" class="the-predator-facility-row">CANOPY PERCH: 24m ALT | 2 FLARES DISARMED | SNIPERS: 0 REMAINING</div>
      <div id="baseball-diamond-widget" class="the-predator-facility-row">BASEBALL FIELD: 20cm CONCRETE DUGOUT | INFIELD SLIDE: SECURED</div>
      <div id="plasma-armory-widget" class="the-predator-facility-row">PLASMA ARMORY: 750 kJ CAPACITORS | BULKHEAD: BREACHED</div>
      <div id="cleanroom-defeat-widget" class="the-predator-facility-row yautja-defeat-facility">YAUTJA PROTOCOL: DORMANT (ARMED STRICTLY ON YAUTJA DEFEAT)</div>
    `;

    target.appendChild(this.panelElement);
    return { mounted: true, elementId: 'the-predator-2018-facility-hud-panel' };
  }

  /**
   * Met à jour le widget d'alerte critique en cas de défaite Yautja dans la Clean-Room
   * @param {Object} defeatSectorState
   */
  updateDefeatWidget(defeatSectorState = {}) {
    if (defeatSectorState.protocolArmed) {
      this.auditState.qaTester5CleanRoomDefeat.protocolArmed = true;
      this.auditState.qaTester5CleanRoomDefeat.countdownRemainingS = defeatSectorState.countdownTimerRemaining;
      this.auditState.qaTester5CleanRoomDefeat.activeGlyph = defeatSectorState.activeGlyph || 'ᚲ';

      if (this.panelElement && typeof document !== 'undefined') {
        const widget = document.getElementById('cleanroom-defeat-widget');
        if (widget) {
          widget.className = 'the-predator-facility-row yautja-defeat-facility armed';
          widget.textContent = `CLEAN ROOM YAUTJA DEFEAT OVERLOAD: [ ${this.auditState.qaTester5CleanRoomDefeat.activeGlyph} ] ${defeatSectorState.countdownTimerRemaining.toFixed(1)}s (65m BLAST)`;
        }
      }
    }

    return {
      protocolArmed: this.auditState.qaTester5CleanRoomDefeat.protocolArmed,
      activeGlyph: this.auditState.qaTester5CleanRoomDefeat.activeGlyph,
      countdownRemainingS: this.auditState.qaTester5CleanRoomDefeat.countdownRemainingS
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
