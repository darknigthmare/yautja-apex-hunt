/**
 * Predator2UrbanPlasmacasterPredictiveSector.js
 * 
 * Chantier Level Design #4 - Guidage Prédictif Tri-Laser & Cratères d'Impact Plasmacaster Urbain.
 * Canonical 1:1 Predator 2 (1990) fidelity:
 * - Implements predictive tri-laser lead targeting against high-velocity urban targets:
 *   - Fast-moving LAPD squad cars (22 m/s), SWAT armored vans (16 m/s), and police helicopters (35 m/s).
 *   - Calculates lead intercept vector: t_intercept = distance / v_bolt, Delta_position = v_target * t_intercept.
 *   - Tri-laser lead reticule convergence across urban smog, heatwave thermals (109 °F / 42.8 °C) and rain.
 *   - Catastrophic plasma impact craters into vehicle engine blocks and concrete building facades.
 */

export class Predator2UrbanPlasmacasterPredictiveSector {
  /**
   * @param {Object} options
   * @param {number} [options.plasmaBoltSpeedMps=145.0]
   */
  constructor(options = {}) {
    this.plasmaBoltSpeedMps = options.plasmaBoltSpeedMps ?? 145.0;
  }

  /**
   * Computes the predictive lead target intercept vector for moving targets.
   * @param {number} targetDistanceM - Distance to target (m)
   * @param {number} targetVelocityMps - Target speed (m/s)
   * @param {number} targetHeadingDeg - Target movement angle relative to line of sight (deg)
   * @returns {Object} Predictive lead telemetry
   */
  computePredictiveLeadIntercept(targetDistanceM = 60.0, targetVelocityMps = 22.0, targetHeadingDeg = 90.0) {
    const timeOfFlightSec = targetDistanceM / this.plasmaBoltSpeedMps;
    const headingRad = (targetHeadingDeg * Math.PI) / 180.0;

    // Cross-axis velocity
    const vCross = targetVelocityMps * Math.sin(headingRad);
    const leadDistanceM = vCross * timeOfFlightSec;
    const leadAngleDeg = (Math.atan2(leadDistanceM, targetDistanceM) * 180.0) / Math.PI;

    return {
      targetDistanceM,
      targetVelocityMps,
      targetHeadingDeg,
      timeOfFlightSec: Math.round(timeOfFlightSec * 1000) / 1000,
      leadDistanceM: Math.round(leadDistanceM * 100) / 100,
      leadAngleDeg: Math.round(leadAngleDeg * 10) / 10,
      triLaserLeadMarkerOffsetMm: Math.round(leadDistanceM * 120),
      interceptProbabilityPct: Math.min(99, Math.round(98 - (targetDistanceM / 20.0))),
      smogAtmosphericAttenuationPct: 12.0
    };
  }

  /**
   * Resolves plasmacaster strike on urban vehicle or architecture.
   * @param {string} targetType - 'LAPD_SQUAD_CAR_ENGINE' | 'CONCRETE_ROOFTOP_PARAPET'
   * @param {number} impactVelocityMps
   * @returns {Object} Urban impact telemetry
   */
  resolveUrbanPlasmaImpact(targetType = 'LAPD_SQUAD_CAR_ENGINE', impactVelocityMps = 145.0) {
    let structuralDamageJoules = 22000;
    let catastrophicExplosion = false;
    let craterDiameterCm = 45;

    if (targetType === 'LAPD_SQUAD_CAR_ENGINE') {
      structuralDamageJoules = 34000;
      catastrophicExplosion = true;
      craterDiameterCm = 65;
    }

    return {
      targetType,
      impactVelocityMps,
      structuralDamageJoules,
      catastrophicExplosion,
      craterDiameterCm,
      moltenMetalSpallEjected: 42,
      impactAcousticBlastDb: 136,
      secondaryFuelTankDetonation: catastrophicExplosion
    };
  }
}
