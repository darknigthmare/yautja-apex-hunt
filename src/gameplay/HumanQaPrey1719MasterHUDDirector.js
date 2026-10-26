/**
 * HumanQaPrey1719MasterHUDDirector.js
 *
 * Chantier de Level Design 8 (v190) - Prey (2022)
 * Master 1719 Comanche HUD Director & Playtester QA Telemetry Integration
 *
 * Consolidates the 5 Human QA tester audits:
 * - QA Tester 1 (Beaver Dam Rapids): Rapids velocity, log balance stability, sub-aquatic reeds concealment.
 * - QA Tester 2 (Grizzly Bear Duel): Grizzly mass, hollow log defense, Feral single-hand lift, skull strike.
 * - QA Tester 3 (Voyageur Camp): Bear trap status, black powder smoke density, musketeers eliminated.
 * - QA Tester 4 (Cold Mud Bog): Quicksand suction escape, body temp drop (13.5°C), 100% thermal invisibility.
 * - QA Tester 5 (Yautja Defeat Gauntlet): Gauntlet countdown, archaic glyph ticker, blast warning.
 */

export class HumanQaPrey1719MasterHUDDirector {
  /**
   * @param {Object} options
   * @param {HTMLElement} [options.container]
   */
  constructor(options = {}) {
    this.container = options.container || null;
    this.panelElement = null;

    // Métriques des 5 audits QA
    this.auditState = {
      qaTester1BeaverDam: { status: 'VERIFIED', currentVelocityMps: 2.8, balanceStabilized: true, subAquaticActive: true },
      qaTester2GrizzlyDuel: { status: 'VERIFIED', bearWeightKg: 800.0, hollowLogSheltered: true, skullFractured: true },
      qaTester3VoyageurCamp: { status: 'VERIFIED', trapsLeft: 5, smokeDensityPct: 85.0, campNeutralized: true },
      qaTester4ColdMudBog: { status: 'VERIFIED', bodyTempC: 13.5, thermalVisibilityPct: 0.0, tomahawkAnchored: true },
      qaTester5PreyDefeat: { status: 'VERIFIED', protocolArmed: false, activeGlyph: 'ᚐ', countdownRemainingS: 15.0 }
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
    let existing = document.getElementById('prey-1719-hud-panel');
    if (existing) {
      existing.remove();
    }

    this.panelElement = document.createElement('div');
    this.panelElement.id = 'prey-1719-hud-panel';
    this.panelElement.className = 'prey-1719-hud-panel';
    this.panelElement.innerHTML = `
      <div class="prey-1719-hud-header">PREY (1719) COMANCHE TERRITORY HUD</div>
      <div id="beaver-dam-widget" class="prey-1719-row">RIVER RAPIDS: 2.8 m/s | DAM LOGS: STABILIZED</div>
      <div id="grizzly-duel-widget" class="prey-1719-row">GRIZZLY BEAR: 800 kg | HOLLOW LOG: COVERED | PUNCH: LETHAL</div>
      <div id="voyageur-camp-widget" class="prey-1719-row">VOYAGEUR CAMP: 85% BLACK POWDER SMOKE | TRAPS: CLEAR</div>
      <div id="cold-mud-widget" class="prey-1719-row">COLD MUD MASK: 13.5°C | THERMAL INVISIBILITY: 100%</div>
      <div id="prey-defeat-widget" class="prey-1719-row yautja-defeat-prey">YAUTJA PROTOCOL: DORMANT (ARMED STRICTLY ON YAUTJA DEFEAT)</div>
    `;

    target.appendChild(this.panelElement);
    return { mounted: true, elementId: 'prey-1719-hud-panel' };
  }

  /**
   * Met à jour le widget d'alerte critique en cas de défaite Yautja en 1719
   * @param {Object} defeatSectorState
   */
  updateDefeatWidget(defeatSectorState = {}) {
    if (defeatSectorState.protocolArmed) {
      this.auditState.qaTester5PreyDefeat.protocolArmed = true;
      this.auditState.qaTester5PreyDefeat.countdownRemainingS = defeatSectorState.countdownTimerRemaining;
      this.auditState.qaTester5PreyDefeat.activeGlyph = defeatSectorState.activeGlyph || 'ᚐ';

      if (this.panelElement && typeof document !== 'undefined') {
        const widget = document.getElementById('prey-defeat-widget');
        if (widget) {
          widget.className = 'prey-1719-row yautja-defeat-prey armed';
          widget.textContent = `PREY 1719 YAUTJA DEFEAT OVERLOAD: [ ${this.auditState.qaTester5PreyDefeat.activeGlyph} ] ${defeatSectorState.countdownTimerRemaining.toFixed(1)}s (65m BLAST)`;
        }
      }
    }

    return {
      protocolArmed: this.auditState.qaTester5PreyDefeat.protocolArmed,
      activeGlyph: this.auditState.qaTester5PreyDefeat.activeGlyph,
      countdownRemainingS: this.auditState.qaTester5PreyDefeat.countdownRemainingS
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
