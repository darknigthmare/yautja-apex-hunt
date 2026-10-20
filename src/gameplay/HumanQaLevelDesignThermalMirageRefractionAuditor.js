/**
 * HumanQaLevelDesignThermalMirageRefractionAuditor.js
 * 
 * Human Playtester QA Audit #5: Thermal Mirage Refraction & Atmospheric Heat Shimmer.
 * Solves the visual artificiality of seeing razor-sharp geometric silhouettes through roaring fires
 * and burning napalm slicks: computes atmospheric refractive index variations (delta_n),
 * applies dynamic optical heat shimmer blur, and disrupts shoulder cannon laser target lock-ons.
 */

export class HumanQaLevelDesignThermalMirageRefractionAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.mirageTriggerTempCelsius=450.0]
   */
  constructor(options = {}) {
    this.mirageTriggerTempCelsius = options.mirageTriggerTempCelsius || 450.0;
    this.heatMirageActive = false;
    this.distortionFactor = 0.0;
    this.refractiveIndexDelta = 0.0;
  }

  /**
   * Evaluates atmospheric refractive index distortion above roaring fires or hot oil.
   * delta_n = -0.00029 * (delta_T / T_ambient_kelvin)
   * @param {number} fireTempCelsius
   * @param {number} [ambientTempCelsius=20.0]
   * @param {number} [distanceToFireMeters=8.0]
   * @returns {Object} Mirage refraction telemetry
   */
  evaluateThermalMirageDistortion(fireTempCelsius = 600.0, ambientTempCelsius = 20.0, distanceToFireMeters = 8.0) {
    const isHotEnough = fireTempCelsius >= this.mirageTriggerTempCelsius;

    if (!isHotEnough || distanceToFireMeters > 30.0) {
      this.heatMirageActive = false;
      this.distortionFactor = 0.0;
      this.refractiveIndexDelta = 0.0;
      return {
        heatMirageActive: false,
        distortionFactor: 0.0,
        refractiveIndexDelta: 0.0,
        opticalTargetingClear: true
      };
    }

    this.heatMirageActive = true;
    const ambientKelvin = ambientTempCelsius + 273.15;
    const tempDelta = fireTempCelsius - ambientTempCelsius;
    this.refractiveIndexDelta = +(-0.00029 * (tempDelta / ambientKelvin)).toFixed(6);

    // Distance attenuation: closer to fire creates denser optical waver
    const proximityWeight = Math.max(0.1, 1.0 - (distanceToFireMeters / 30.0));
    this.distortionFactor = +(Math.min(1.0, (tempDelta / 600.0) * proximityWeight)).toFixed(2);

    return {
      heatMirageActive: true,
      fireTempCelsius,
      ambientTempCelsius,
      refractiveIndexDelta: this.refractiveIndexDelta,
      distortionFactor: this.distortionFactor,
      blurRadiusPixels: Math.round(this.distortionFactor * 8.0),
      opticalTargetingClear: this.distortionFactor < 0.35
    };
  }

  /**
   * Disrupts Plasmacaster laser triangulation and lead targeting through heat shimmer.
   * @param {number} [lockStabilityScore=1.0]
   * @returns {Object} Disrupted targeting telemetry
   */
  disruptLaserLockThroughMirage(lockStabilityScore = 1.0) {
    if (!this.heatMirageActive) {
      return { lockDisrupted: false, finalStabilityScore: lockStabilityScore };
    }

    const stabilityLoss = this.distortionFactor * 0.75;
    const finalStabilityScore = Math.max(0.1, +(lockStabilityScore - stabilityLoss).toFixed(2));
    const lockDisrupted = finalStabilityScore < 0.45;

    return {
      lockDisrupted,
      initialStabilityScore: lockStabilityScore,
      finalStabilityScore,
      laserBeamRefractedAngleDeg: +(this.distortionFactor * 3.8).toFixed(1)
    };
  }

  /**
   * Exports mirage telemetry and CSS state for `.heat-mirage-distortion-overlay`.
   * @returns {Object}
   */
  getMirageTelemetry() {
    return {
      heatMirageActive: this.heatMirageActive,
      distortionFactor: this.distortionFactor,
      refractiveIndexDelta: this.refractiveIndexDelta,
      cssClass: this.heatMirageActive 
        ? 'heat-mirage-distortion-overlay active' 
        : 'heat-mirage-distortion-overlay'
    };
  }
}
