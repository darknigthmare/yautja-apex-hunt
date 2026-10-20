/**
 * HumanQaDiegeticPlasmacasterResidualArcDischargeAuditor.js
 * 
 * Human Playtester QA Audit #3: Plasmacaster Residual Dielectric Arc & Rail Sputter Realism.
 * Resolves the lack of post-firing biomechanical and energetic feedback on the shoulder cannon:
 * models magnetic accelerator coil residual capacitance (Joules), surface thermal ramp (>480 C),
 * and dielectric breakdown sparks crackling along the cannon rails (.plasma-coil-spark-overlay).
 */

export class HumanQaDiegeticPlasmacasterResidualArcDischargeAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.maxCapacitanceJoules=2500]
   * @param {number} [options.breakdownThresholdJoules=650]
   */
  constructor(options = {}) {
    this.maxCapacitanceJoules = options.maxCapacitanceJoules || 2500;
    this.breakdownThresholdJoules = options.breakdownThresholdJoules || 650;

    this.residualChargeJoules = 0.0;
    this.railSurfaceTempCelsius = 35.0; // Baseline ambient
    this.sparkingActive = false;
    this.totalDischargesObserved = 0;
  }

  /**
   * Registers a plasma bolt fired from the shoulder cannon, accumulating residual energy.
   * @param {number} [shotChargeJoules=400]
   * @returns {Object} Post-shot coil state
   */
  registerPlasmaShotFired(shotChargeJoules = 400) {
    const retainedFraction = 0.22; // 22% residual inductive storage in rails
    const addedEnergy = shotChargeJoules * retainedFraction;
    this.residualChargeJoules = Math.min(this.maxCapacitanceJoules, +(this.residualChargeJoules + addedEnergy).toFixed(1));

    // Thermal accumulation on titanium magnetic guide rails
    this.railSurfaceTempCelsius = +(this.railSurfaceTempCelsius + (shotChargeJoules * 0.14)).toFixed(1);
    this.sparkingActive = this.residualChargeJoules >= this.breakdownThresholdJoules;

    if (this.sparkingActive) {
      this.totalDischargesObserved++;
    }

    return {
      shotChargeJoules,
      residualChargeJoules: this.residualChargeJoules,
      railSurfaceTempCelsius: this.railSurfaceTempCelsius,
      sparkingActive: this.sparkingActive,
      arcIntensity: +(Math.min(1.0, this.residualChargeJoules / this.maxCapacitanceJoules)).toFixed(2)
    };
  }

  /**
   * Simulates dissipation and cooling of the coils over time.
   * @param {number} deltaSec
   * @returns {Object} Cooling update
   */
  processCoolingTick(deltaSec = 0.2) {
    // Energy bleeds off through dielectric micro-arcs
    const dischargeRate = this.sparkingActive ? 180.0 : 45.0;
    this.residualChargeJoules = Math.max(0, +(this.residualChargeJoules - dischargeRate * deltaSec).toFixed(1));

    // Temperature equalizes toward 35 C
    const coolingDelta = (this.railSurfaceTempCelsius - 35.0) * 0.15 * deltaSec;
    this.railSurfaceTempCelsius = Math.max(35.0, +(this.railSurfaceTempCelsius - coolingDelta).toFixed(1));

    this.sparkingActive = this.residualChargeJoules >= this.breakdownThresholdJoules;

    return {
      residualChargeJoules: this.residualChargeJoules,
      railSurfaceTempCelsius: this.railSurfaceTempCelsius,
      sparkingActive: this.sparkingActive,
      isCoilSafeToTouch: this.railSurfaceTempCelsius < 80.0
    };
  }

  /**
   * Checks whether dielectric sparks are actively crackling along the cannon barrel.
   * @returns {boolean}
   */
  isArcingActive() {
    return this.sparkingActive;
  }

  /**
   * Returns current telemetry and CSS state payload.
   * @returns {Object}
   */
  getArcDiagnostics() {
    return {
      residualChargeJoules: this.residualChargeJoules,
      railSurfaceTempCelsius: this.railSurfaceTempCelsius,
      sparkingActive: this.sparkingActive,
      totalDischargesObserved: this.totalDischargesObserved,
      cssClass: this.sparkingActive 
        ? 'plasma-coil-spark-overlay spark-active' 
        : 'plasma-coil-spark-overlay'
    };
  }
}
