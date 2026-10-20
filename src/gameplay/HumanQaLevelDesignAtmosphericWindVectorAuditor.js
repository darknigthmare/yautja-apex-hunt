/**
 * HumanQaLevelDesignAtmosphericWindVectorAuditor.js
 * 
 * Human Playtester QA Audit #5: Atmospheric Wind Vector Dynamics & Ballistic Drift.
 * Upgrades atmospheric weather from pure visual effects to active physics simulation:
 * computes crosswind deflection on light projectiles (arrows, flechettes, harpoon cables),
 * models directional smoke/thermal plume drift, and outputs HUD telemetry (.wind-vector-hud-indicator).
 */

export class HumanQaLevelDesignAtmosphericWindVectorAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.windSpeedMps=8.5]
   * @param {number} [options.windHeadingDeg=45.0]
   * @param {number} [options.airDensityKgM3=1.225]
   */
  constructor(options = {}) {
    this.windSpeedMps = options.windSpeedMps !== undefined ? options.windSpeedMps : 8.5;
    this.windHeadingDeg = options.windHeadingDeg !== undefined ? options.windHeadingDeg : 45.0;
    this.airDensityKgM3 = options.airDensityKgM3 || 1.225;

    this.updateWindComponents();
  }

  /**
   * Updates internal Cartesian wind vector components from speed and heading.
   */
  updateWindComponents() {
    const rad = this.windHeadingDeg * (Math.PI / 180);
    this.windVector = {
      x: +(this.windSpeedMps * Math.sin(rad)).toFixed(2),
      y: 0.0,
      z: +(this.windSpeedMps * Math.cos(rad)).toFixed(2)
    };
  }

  /**
   * Sets new wind conditions across the active hunt level.
   * @param {number} speedMps
   * @param {number} headingDeg
   */
  setWindVector(speedMps, headingDeg) {
    this.windSpeedMps = Number(speedMps) || 0.0;
    this.windHeadingDeg = (Number(headingDeg) || 0.0) % 360;
    this.updateWindComponents();

    return {
      windSpeedMps: this.windSpeedMps,
      windHeadingDeg: this.windHeadingDeg,
      windVector: { ...this.windVector }
    };
  }

  /**
   * Computes ballistic lateral drift on an airborne projectile.
   * F_wind = 0.5 * rho * v_rel^2 * C_d * A
   * a_drift = F_wind / mass
   * delta_pos = 0.5 * a_drift * t^2
   * @param {number} projectileMassKg - e.g. 0.08 kg for arrow, 0.45 kg for harpoon
   * @param {number} frontalAreaM2
   * @param {{x: number, y: number, z: number}} initialVelocity
   * @param {number} timeOfFlightSec
   * @returns {Object} Drift displacement vector
   */
  computeBallisticWindDrift(projectileMassKg = 0.08, frontalAreaM2 = 0.002, initialVelocity = { x: 0, y: 0, z: 50 }, timeOfFlightSec = 0.8) {
    const dragCoeff = 0.47; // Sphere / aerofoil approximation
    const crosswindForceX = 0.5 * this.airDensityKgM3 * Math.pow(this.windVector.x, 2) * dragCoeff * frontalAreaM2;
    const crosswindForceZ = 0.5 * this.airDensityKgM3 * Math.pow(this.windVector.z, 2) * dragCoeff * frontalAreaM2;

    const driftAccelX = crosswindForceX / projectileMassKg;
    const driftAccelZ = crosswindForceZ / projectileMassKg;

    const driftDisplacement = {
      x: +(0.5 * driftAccelX * Math.pow(timeOfFlightSec, 2) * Math.sign(this.windVector.x)).toFixed(3),
      y: 0.0,
      z: +(0.5 * driftAccelZ * Math.pow(timeOfFlightSec, 2) * Math.sign(this.windVector.z)).toFixed(3)
    };

    const totalDriftMagnitudeMeters = +Math.hypot(driftDisplacement.x, driftDisplacement.z).toFixed(3);

    return {
      timeOfFlightSec,
      windVector: { ...this.windVector },
      driftDisplacement,
      totalDriftMagnitudeMeters,
      requiresAimLeadCompensation: totalDriftMagnitudeMeters > 0.15
    };
  }

  /**
   * Computes smoke or aerosol plume advection and elongation along wind vector.
   * @param {{x: number, y: number, z: number}} originPos
   * @param {number} emissionSec
   * @returns {Object} Plume centroid and dispersion radius
   */
  computeSmokeCloudDispersal(originPos = { x: 0, y: 0, z: 0 }, emissionSec = 3.0) {
    const plumeDisplacementMeters = {
      x: +(originPos.x + this.windVector.x * emissionSec).toFixed(2),
      y: +(originPos.y + 1.2 * emissionSec).toFixed(2), // Thermal buoyancy lift
      z: +(originPos.z + this.windVector.z * emissionSec).toFixed(2)
    };

    const dispersionRadiusMeters = +(2.5 + emissionSec * (0.8 + this.windSpeedMps * 0.12)).toFixed(2);
    const opticalDensityPercentage = Math.max(10, Math.round(100 - (emissionSec * 15)));

    return {
      plumeCentroid: plumeDisplacementMeters,
      dispersionRadiusMeters,
      opticalDensityPercentage,
      windSpeedMps: this.windSpeedMps
    };
  }

  /**
   * Generates HUD telemetry payload for the UI wind indicator.
   * @returns {Object}
   */
  getWindHudTelemetry() {
    return {
      windSpeedMps: this.windSpeedMps,
      windHeadingDeg: this.windHeadingDeg,
      windVector: { ...this.windVector },
      beaufortScale: this.windSpeedMps < 5.5 ? 'LIGHT_BREEZE' : (this.windSpeedMps < 10.8 ? 'FRESH_BREEZE' : 'STRONG_GALE'),
      arrowTransformCss: `rotate(${this.windHeadingDeg}deg)`
    };
  }
}
