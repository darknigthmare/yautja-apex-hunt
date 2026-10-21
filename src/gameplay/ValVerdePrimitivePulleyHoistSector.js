/**
 * ValVerdePrimitivePulleyHoistSector.js
 * 
 * Chantier Level Design #6 - Arène du Ravin Rocheux & Télécabine de Lianes / Palan Primitif.
 * Canonical 1:1 Predator (1987) fidelity:
 * - Dutch's counterweighted primitive rope & jungle liana hoist system to elevate the 1,200 kg deadfall log.
 * - Mechanical advantage MA = 3:1 using peeled branch crotches as low-friction natural pulleys.
 * - Effort force required to lift log: F = (m * g) / MA ~ 3,924 N.
 * - Carved guayacan hardwood toggle peg anchoring the counterweight under 11,700 N of static tension.
 * - Hair-trigger trip liana: pulling, tripping, or cutting the vine ejects the toggle peg in 45ms,
 *   initiating gravitational freefall of the crushing log.
 */

export class ValVerdePrimitivePulleyHoistSector {
  /**
   * @param {Object} options
   * @param {number} [options.logMassKg=1200.0]
   * @param {number} [options.mechanicalAdvantage=3.0]
   */
  constructor(options = {}) {
    this.logMassKg = options.logMassKg ?? 1200.0;
    this.mechanicalAdvantage = options.mechanicalAdvantage ?? 3.0;

    this.hoistElevationM = 0;
    this.togglePegSecured = false;
    this.ropeTensionN = 0;
  }

  /**
   * Hoists the massive deadfall log into the tree canopy using the primitive pulley.
   * @param {number} targetElevationM - Target drop height (e.g. 5.5m)
   * @returns {Object} Hoist telemetry
   */
  hoistDeadfallLog(targetElevationM = 5.5) {
    const gravity = 9.81;
    const requiredEffortForceN = Math.round((this.logMassKg * gravity) / this.mechanicalAdvantage);
    this.ropeTensionN = Math.round(this.logMassKg * gravity);
    this.hoistElevationM = targetElevationM;
    this.togglePegSecured = true;

    return {
      success: true,
      logMassKg: this.logMassKg,
      mechanicalAdvantage: this.mechanicalAdvantage,
      requiredEffortForceN,
      staticRopeTensionN: this.ropeTensionN,
      hoistElevationM: this.hoistElevationM,
      togglePegSecured: true,
      ropeCreakAcousticDb: 68,
      readyToTrigger: true
    };
  }

  /**
   * Dislodges the hardwood toggle peg via trigger liana to release the deadfall.
   * @returns {Object} Release trigger outcome
   */
  tripTogglePegRelease() {
    if (!this.togglePegSecured) {
      return { success: false, reason: 'PULLEY_NOT_HOISTED' };
    }

    this.togglePegSecured = false;
    const freefallAccelerationMps2 = 9.81;
    const dropTimeSec = Math.round(Math.sqrt((2 * this.hoistElevationM) / freefallAccelerationMps2) * 100) / 100;

    return {
      success: true,
      togglePegEjected: true,
      releaseLatencyMs: 45,
      hoistElevationM: this.hoistElevationM,
      dropTimeSec,
      impactVelocityMps: Math.round(freefallAccelerationMps2 * dropTimeSec * 10) / 10,
      togglePegSnapAcousticDb: 78
    };
  }
}
