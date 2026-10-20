/**
 * StargazerHelipadFugitiveShipPursuitSector.js
 * 
 * The Predator (2018) - Project Stargazer covert military airfield helipad.
 * Simulates the nighttime rooftop helicopter pursuit, turbine rotor downwash
 * turbulence (22 m/s), the Fugitive scout ship's taking off with energy forcefield
 * slipstream, and grappling onto the rising craft under heavy aerodynamic drag.
 */

export class StargazerHelipadFugitiveShipPursuitSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='stargazer-helipad-rooftop-01']
   * @param {number} [options.helicopterRotorDownwashMps=22.0]
   * @param {number} [options.shipAscentSpeedMps=18.5]
   * @param {number} [options.forcefieldEnergyMegaJoules=4.5]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'stargazer-helipad-rooftop-01';
    this.helicopterRotorDownwashMps = options.helicopterRotorDownwashMps || 22.0;
    this.shipAscentSpeedMps = options.shipAscentSpeedMps || 18.5;
    this.forcefieldEnergyMegaJoules = options.forcefieldEnergyMegaJoules || 4.5;

    this.grappleHookAttached = false;
    this.forcefieldPunctured = false;
  }

  /**
   * Evaluates aerodynamic turbulence and dynamic buffeting from the transport helicopter blades.
   * Dynamic pressure: q = 0.5 * rho * v^2
   * @param {number} distanceFromRotorM
   * @param {number} airDensityKgM3
   * @returns {Object} Rotor turbulence telemetry
   */
  computeRotorDownwashTurbulence(distanceFromRotorM = 6.0, airDensityKgM3 = 1.225) {
    const effectiveDownwashSpeedMps = +(this.helicopterRotorDownwashMps * Math.max(0.2, 1.0 - distanceFromRotorM / 25.0)).toFixed(1);
    const dynamicPressurePascals = Math.round(0.5 * airDensityKgM3 * Math.pow(effectiveDownwashSpeedMps, 2));
    const aimDispersionPenaltyDeg = +(dynamicPressurePascals * 0.015).toFixed(1);
    const audioRumbleDecibels = Math.round(92 + 10 * Math.log10(Math.max(1, dynamicPressurePascals / 100)));

    return {
      distanceFromRotorM,
      effectiveDownwashSpeedMps,
      dynamicPressurePascals,
      aimDispersionPenaltyDeg,
      audioRumbleDecibels,
      footingHazard: dynamicPressurePascals > 200
    };
  }

  /**
   * Fires a reinforced carbon-nanotube wrist grapple cable to latch onto the rising scout ship.
   * @param {number} hunterMassKg
   * @param {number} targetAltitudeM
   * @returns {Object} Grapple boarding metrics
   */
  launchBoardingGrappleCable(hunterMassKg = 150, targetAltitudeM = 15.0) {
    const ascentAccelerationMps2 = 6.2;
    // Tensile force F = m * (g + a) + drag
    const aerodynamicDragForceN = 0.5 * 1.225 * Math.pow(this.shipAscentSpeedMps, 2) * 0.85; // ~178 N
    const cableTensionN = Math.round(hunterMassKg * (9.81 + ascentAccelerationMps2) + aerodynamicDragForceN);
    const cableTensileLimitN = 12000; // 12 kN carbon fiber
    const cableSnapped = cableTensionN > cableTensileLimitN;

    if (!cableSnapped) {
      this.grappleHookAttached = true;
    }

    return {
      success: !cableSnapped,
      cableTensionN,
      cableTensileLimitN,
      cableSnapped,
      targetAltitudeM,
      ascentSpeedMps: this.shipAscentSpeedMps,
      grappleHookAttached: this.grappleHookAttached
    };
  }

  /**
   * Bypasses or discharges the Fugitive scout ship's energy slipstream shield.
   * @param {number} plasmaDischargeJoules
   * @returns {Object} Shield penetration outcome
   */
  breachForcefieldSlipstream(plasmaDischargeJoules = 1200) {
    const barrierDisruptionThreshold = 950;
    this.forcefieldPunctured = plasmaDischargeJoules >= barrierDisruptionThreshold;

    return {
      punctured: this.forcefieldPunctured,
      plasmaDischargeJoules,
      barrierDisruptionThreshold,
      repulsionShockwaveDamage: this.forcefieldPunctured ? 25 : 110,
      slipstreamOpeningSec: this.forcefieldPunctured ? 3.5 : 0.0
    };
  }
}
