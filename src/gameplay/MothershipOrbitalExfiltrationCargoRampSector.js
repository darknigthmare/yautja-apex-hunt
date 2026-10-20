/**
 * MothershipOrbitalExfiltrationCargoRampSector.js
 * 
 * The Predator (2018) - Supersonic Orbital Ascent & Mothership Cargo Ramp.
 * Simulates high-altitude combat on the open cargo bay ramp: 450 m/s slipstream suction,
 * fluctuating artificial gravity (0.2g to 1.5g), atmospheric decompression turbulence,
 * and orbital drop pod launch sequences.
 */

export class MothershipOrbitalExfiltrationCargoRampSector {
  /**
   * @param {Object} options
   * @param {string} [options.mothershipId='fugitive-scout-mothership-01']
   * @param {number} [options.altitudeMeters=14500.0] - Stratosphere
   * @param {number} [options.machSpeed=1.4] - Supersonic
   * @param {boolean} [options.forcefieldCurtainActive=false]
   */
  constructor(options = {}) {
    this.mothershipId = options.mothershipId || 'fugitive-scout-mothership-01';
    this.altitudeMeters = options.altitudeMeters || 14500.0;
    this.machSpeed = options.machSpeed || 1.4;
    this.forcefieldCurtainActive = options.forcefieldCurtainActive !== undefined ? options.forcefieldCurtainActive : false;

    this.artificialGravityG = 1.0;
    this.cargoRampExtended = true;
    this.dropPodsRemaining = 2;
  }

  /**
   * Computes aerodynamic slipstream buffeting and decompression drag.
   * Dynamic pressure: q = 0.5 * rho * v^2 where v = Mach * 340
   * @returns {Object} Slipstream dynamics telemetry
   */
  computeSlipstreamSuctionForces() {
    const airDensityKgM3 = +(1.225 * Math.exp(-this.altitudeMeters / 8500.0)).toFixed(4); // Stratospheric thin air
    const velocityMps = +(this.machSpeed * 340.0).toFixed(1);
    const dynamicPressurePascals = Math.round(0.5 * airDensityKgM3 * Math.pow(velocityMps, 2));
    
    // Suction pull towards open ramp
    const suctionForceNewtons = this.forcefieldCurtainActive ? 0 : Math.round(dynamicPressurePascals * 0.45);
    const footingGripHazard = !this.forcefieldCurtainActive && suctionForceNewtons > 400;

    return {
      altitudeMeters: this.altitudeMeters,
      machSpeed: this.machSpeed,
      velocityMps,
      airDensityKgM3,
      dynamicPressurePascals,
      suctionForceNewtons,
      footingGripHazard,
      forcefieldCurtainActive: this.forcefieldCurtainActive
    };
  }

  /**
   * Simulates artificial gravity generator fluctuation under engine strain.
   * @param {number} engineStrainRatio - 0.0 to 1.0
   * @returns {Object} Gravity telemetry
   */
  modulateArtificialGravity(engineStrainRatio = 0.7) {
    // Gravity dips down to 0.2g during peak ascent thruster pulse
    this.artificialGravityG = +(1.0 - engineStrainRatio * 0.8).toFixed(2);
    const jumpHeightMultiplier = +(1.0 / this.artificialGravityG).toFixed(2);

    return {
      engineStrainRatio,
      artificialGravityG: this.artificialGravityG,
      jumpHeightMultiplier,
      floatingDebrisHazard: this.artificialGravityG <= 0.35,
      terminalFallSpeedReductionRatio: +(1.0 - this.artificialGravityG).toFixed(2)
    };
  }

  /**
   * Toggles the ionic forcefield curtain over the cargo bay opening.
   * @param {boolean} active
   * @returns {Object} Forcefield curtain status
   */
  setForcefieldCurtain(active = true) {
    this.forcefieldCurtainActive = Boolean(active);

    return {
      forcefieldCurtainActive: this.forcefieldCurtainActive,
      cabinPressurizationPsi: this.forcefieldCurtainActive ? 14.7 : 2.1,
      windNoiseDecibels: this.forcefieldCurtainActive ? 55 : 108
    };
  }

  /**
   * Launches an orbital drop pod out the rear cargo ramp.
   * @returns {Object} Ejection details
   */
  ejectOrbitalDropPod() {
    if (this.dropPodsRemaining <= 0) {
      return { success: false, reason: 'NO_DROP_PODS_REMAINING' };
    }

    this.dropPodsRemaining--;

    return {
      success: true,
      dropPodsRemaining: this.dropPodsRemaining,
      ejectionVelocityMps: 28.0,
      retroRocketsFired: true,
      targetDescentTimeSec: 42.0
    };
  }
}
