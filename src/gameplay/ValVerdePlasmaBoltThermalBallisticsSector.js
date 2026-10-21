/**
 * ValVerdePlasmaBoltThermalBallisticsSector.js
 * 
 * Chantier Level Design #1 - Physique Balistique & Arcs Thermiques des Décharges de Plasma.
 * Canonical 1:1 Predator (1987) fidelity:
 * - Shoulder-mounted Yautja plasmacaster bolt physics:
 *   - High-energy magnetically contained toroidal plasma packet (core temp 8,500 K, speed 145 m/s).
 *   - Kinetic and thermal impact yield: 18,500 Joules.
 *   - Thermal ablation cratering: blows 35cm diameter craters into hardwood jungle trunks, ejecting incandescent wood splinters.
 *   - Blast splash radius (3.2m): burns undergrowth and creates intense localized smoke.
 *   - Plasma capacitor thermal load: 1.8s heatsink venting required between full-power shots to prevent caster blowout.
 */

export class ValVerdePlasmaBoltThermalBallisticsSector {
  /**
   * @param {Object} options
   * @param {number} [options.plasmaBoltSpeedMps=145.0]
   * @param {number} [options.plasmaCoreTempK=8500.0]
   * @param {number} [options.capacitorRechargeTimeSec=1.8]
   */
  constructor(options = {}) {
    this.plasmaBoltSpeedMps = options.plasmaBoltSpeedMps ?? 145.0;
    this.plasmaCoreTempK = options.plasmaCoreTempK ?? 8500.0;
    this.capacitorRechargeTimeSec = options.capacitorRechargeTimeSec ?? 1.8;

    this.capacitorHeatPct = 0;
    this.capacitorVenting = false;
  }

  /**
   * Fires a shoulder plasmacaster heavy bolt toward target coordinates.
   * @param {number} targetDistanceM - Distance to target (m)
   * @param {string} [targetMaterial='HARDWOOD_TRUNK'] - 'HARDWOOD_TRUNK' | 'GRANITE_BOULDER' | 'RIVER_SILT'
   * @returns {Object} Plasma discharge and impact telemetry
   */
  dischargePlasmacasterBolt(targetDistanceM = 25.0, targetMaterial = 'HARDWOOD_TRUNK') {
    if (this.capacitorVenting || this.capacitorHeatPct >= 95.0) {
      return { success: false, reason: 'CAPACITOR_OVERHEATED_VENTING_REQUIRED' };
    }

    const timeOfFlightSec = Math.round((targetDistanceM / this.plasmaBoltSpeedMps) * 1000) / 1000;
    this.capacitorHeatPct = Math.min(100.0, this.capacitorHeatPct + 45.0);
    if (this.capacitorHeatPct >= 90.0) {
      this.capacitorVenting = true;
    }

    // Impact physics calculation
    const kineticThermalYieldJ = 18500;
    let craterDiameterCm = 35;
    let charDepthCm = 12;

    if (targetMaterial === 'GRANITE_BOULDER') {
      craterDiameterCm = 18;
      charDepthCm = 4;
    } else if (targetMaterial === 'RIVER_SILT') {
      craterDiameterCm = 50;
      charDepthCm = 22;
    }

    return {
      success: true,
      targetDistanceM,
      targetMaterial,
      timeOfFlightSec,
      kineticThermalYieldJ,
      craterDiameterCm,
      charDepthCm,
      splashRadiusM: 3.2,
      incandescentSplintersEjected: targetMaterial === 'HARDWOOD_TRUNK' ? 32 : 8,
      plasmaColor: '#00e5ff',
      dischargeAcousticDb: 128,
      impactAcousticDb: 138,
      capacitorHeatPct: this.capacitorHeatPct,
      capacitorVenting: this.capacitorVenting
    };
  }

  /**
   * Updates capacitor heatsink cooling cycle over time.
   * @param {number} deltaSeconds
   * @returns {Object} Cooling status
   */
  updateCapacitorCooling(deltaSeconds = 1.0) {
    const coolingRate = (deltaSeconds / this.capacitorRechargeTimeSec) * 100.0;
    this.capacitorHeatPct = Math.max(0, Math.round((this.capacitorHeatPct - coolingRate) * 10) / 10);

    if (this.capacitorHeatPct <= 15.0) {
      this.capacitorVenting = false;
    }

    return {
      capacitorHeatPct: this.capacitorHeatPct,
      capacitorVenting: this.capacitorVenting,
      readyToFire: !this.capacitorVenting && this.capacitorHeatPct < 90.0
    };
  }
}
