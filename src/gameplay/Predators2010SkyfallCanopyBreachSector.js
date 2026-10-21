/**
 * Predators2010SkyfallCanopyBreachSector.js
 * 
 * Chantier Level Design #1 - Chute Libre & Percée de la Canopée Extraterrestre.
 * Canonical 1:1 Predators (2010) fidelity:
 * - Opening scene: Royce awakens unconscious in freefall plummeting from 3,000m above an unknown alien jungle.
 * - Terminal velocity descent at 54 m/s (194 km/h) with violent atmospheric wind rush (132 dB).
 * - Emergency dorsal parachute automatically deploys in extremis at 150m altitude:
 *   - High deceleration g-force (4.2g), nylon canopy snap (96 dB).
 * - Violent penetration through the giant alien canopy:
 *   - Snapping heavy branches, tearing through massive lianas, and soft impact into rich forest loam and mud.
 */

export class Predators2010SkyfallCanopyBreachSector {
  /**
   * @param {Object} options
   * @param {number} [options.dropAltitudeM=3000.0]
   * @param {number} [options.terminalVelocityMps=54.0]
   */
  constructor(options = {}) {
    this.altitudeM = options.dropAltitudeM ?? 3000.0;
    this.terminalVelocityMps = options.terminalVelocityMps ?? 54.0;

    this.freefallActive = true;
    this.parachuteDeployed = false;
    this.canopyBreached = false;
    this.groundLanded = false;
  }

  /**
   * Simulates the high-altitude freefall descent prior to parachute deployment.
   * @param {number} descentTimeSec - Time spent falling
   * @returns {Object} Freefall telemetry
   */
  simulateFreefallDescent(descentTimeSec = 45.0) {
    const fallenDistanceM = this.terminalVelocityMps * descentTimeSec;
    this.altitudeM = Math.max(150.0, this.altitudeM - fallenDistanceM);

    return {
      success: true,
      altitudeM: this.altitudeM,
      terminalVelocityMps: this.terminalVelocityMps,
      windRushAcousticDb: 132,
      oxygenDeprivationWarning: this.altitudeM >= 2500,
      dorsalRipCordArmed: true,
      readyForDeploy: this.altitudeM <= 200.0
    };
  }

  /**
   * Deploys the emergency dorsal parachute at critical low altitude.
   * @param {number} deployAltitudeM
   * @returns {Object} Parachute deployment telemetry
   */
  deployEmergencyParachute(deployAltitudeM = 150.0) {
    this.parachuteDeployed = true;
    this.freefallActive = false;
    this.altitudeM = deployAltitudeM;

    const postDeployVelocityMps = 8.5;
    const decelerationGForce = 4.2;

    return {
      success: true,
      parachuteDeployed: true,
      deployAltitudeM,
      decelerationGForce,
      postDeployVelocityMps,
      canopySnapAcousticDb: 96,
      harnessStrainRating: 'CRITICAL_HIGH',
      canopyCollisionImminent: true
    };
  }

  /**
   * Resolves the violent crash through the alien rainforest canopy and mud touchdown.
   * @returns {Object} Canopy crash & landing outcome
   */
  resolveCanopyCrashAndTouchdown() {
    if (!this.parachuteDeployed) {
      return { success: false, reason: 'PARACHUTE_NOT_DEPLOYED' };
    }

    this.canopyBreached = true;
    this.groundLanded = true;
    this.altitudeM = 0.0;

    return {
      success: true,
      canopyBreached: true,
      groundLanded: true,
      brokenBranchesCount: 8,
      branchSnapAcousticDb: 92,
      mudLoamCushionFactor: 0.85,
      impactDamageReceivedHp: 5,
      harnessReleased: true,
      survivalKnifeEquipped: true
    };
  }
}
