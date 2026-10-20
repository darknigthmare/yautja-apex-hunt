/**
 * BouvetoyaMiningShaftVerticalWinchElevatorSector.js
 * 
 * Alien vs. Predator (2004) - Bouvet Island whaling station vertical mining shaft.
 * Simulates an industrial cable-suspended freight elevator ascending a 600m sheer icy granite shaft.
 * Features winch motor thermal management, swarming Xenomorphs dropping onto the wire mesh roof,
 * mesh integrity degradation, and high-speed vertical ascent combat.
 */

export class BouvetoyaMiningShaftVerticalWinchElevatorSector {
  /**
   * @param {Object} options
   * @param {string} [options.shaftId='bouvetoya-shaft-01']
   * @param {number} [options.depthMeters=600.0]
   * @param {number} [options.currentAscentMeters=0.0]
   * @param {number} [options.winchMotorTempCelsius=45.0]
   * @param {number} [options.climbingXenosCount=4]
   * @param {number} [options.roofMeshIntegrity=1.0]
   */
  constructor(options = {}) {
    this.shaftId = options.shaftId || 'bouvetoya-shaft-01';
    this.depthMeters = options.depthMeters !== undefined ? options.depthMeters : 600.0;
    this.currentAscentMeters = options.currentAscentMeters !== undefined ? options.currentAscentMeters : 0.0;
    this.winchMotorTempCelsius = options.winchMotorTempCelsius !== undefined ? options.winchMotorTempCelsius : 45.0;
    this.climbingXenosCount = options.climbingXenosCount !== undefined ? options.climbingXenosCount : 4;
    this.roofMeshIntegrity = options.roofMeshIntegrity !== undefined ? options.roofMeshIntegrity : 1.0;

    this.motorSeized = false;
    this.surfaceReached = false;
  }

  /**
   * Drives vertical elevator ascent up the mining shaft.
   * Higher power lifts faster but rapidly overheats the winch motor.
   * @param {number} winchPowerRatio - 0.2 to 1.5
   * @param {number} deltaSec
   * @returns {Object} Ascent telemetry
   */
  ascendMiningShaft(winchPowerRatio = 1.0, deltaSec = 1.0) {
    if (this.motorSeized) {
      return { ascended: false, reason: 'WINCH_MOTOR_SEIZED', currentAscentMeters: this.currentAscentMeters };
    }

    if (this.surfaceReached) {
      return { ascended: true, surfaceReached: true, currentAscentMeters: this.depthMeters };
    }

    const ascentSpeedMps = 8.5 * winchPowerRatio;
    this.currentAscentMeters = Math.min(this.depthMeters, +(this.currentAscentMeters + ascentSpeedMps * deltaSec).toFixed(1));

    // Thermal accumulation
    const heatGain = 6.2 * winchPowerRatio * deltaSec;
    this.winchMotorTempCelsius = +(this.winchMotorTempCelsius + heatGain).toFixed(1);

    if (this.winchMotorTempCelsius >= 140.0) {
      this.motorSeized = true;
    }

    this.surfaceReached = this.currentAscentMeters >= this.depthMeters;

    return {
      currentAscentMeters: this.currentAscentMeters,
      remainingMeters: +(this.depthMeters - this.currentAscentMeters).toFixed(1),
      ascentSpeedMps: +ascentSpeedMps.toFixed(1),
      winchMotorTempCelsius: this.winchMotorTempCelsius,
      motorSeized: this.motorSeized,
      surfaceReached: this.surfaceReached
    };
  }

  /**
   * Cools the winch motor using emergency cryogenic coolant purge.
   * @param {boolean} coolantPurgeActive
   * @param {number} deltaSec
   * @returns {Object} Cooling status
   */
  coolWinchMotor(coolantPurgeActive = true, deltaSec = 1.0) {
    const coolingRate = coolantPurgeActive ? 28.0 : 4.5;
    this.winchMotorTempCelsius = Math.max(20.0, +(this.winchMotorTempCelsius - coolingRate * deltaSec).toFixed(1));

    if (this.winchMotorTempCelsius < 100.0) {
      this.motorSeized = false; // Restores operation after cooling down
    }

    return {
      winchMotorTempCelsius: this.winchMotorTempCelsius,
      motorSeized: this.motorSeized,
      coolingEffective: true
    };
  }

  /**
   * Repels or shoots a Xenomorph climber dropping onto the mesh roof.
   * @param {number} climberIndex
   * @param {number} damage
   * @returns {Object} Climber condition
   */
  repelMeshRoofClimber(climberIndex = 0, damage = 120) {
    if (this.climbingXenosCount <= 0) {
      return { climbersRemaining: 0, roofMeshIntegrity: this.roofMeshIntegrity };
    }

    if (damage >= 80) {
      this.climbingXenosCount = Math.max(0, this.climbingXenosCount - 1);
      return {
        success: true,
        climberRepelled: true,
        climbersRemaining: this.climbingXenosCount,
        roofMeshIntegrity: this.roofMeshIntegrity
      };
    }

    // Weak attack: climber tears at roof mesh
    this.roofMeshIntegrity = Math.max(0, +(this.roofMeshIntegrity - 0.15).toFixed(2));
    return {
      success: false,
      climberRepelled: false,
      climbersRemaining: this.climbingXenosCount,
      roofMeshIntegrity: this.roofMeshIntegrity,
      roofBreached: this.roofMeshIntegrity <= 0.2
    };
  }

  /**
   * Returns current elevator shaft telemetry.
   * @returns {Object}
   */
  getShaftTelemetry() {
    return {
      shaftId: this.shaftId,
      depthMeters: this.depthMeters,
      currentAscentMeters: this.currentAscentMeters,
      winchMotorTempCelsius: this.winchMotorTempCelsius,
      motorSeized: this.motorSeized,
      climbingXenosCount: this.climbingXenosCount,
      roofMeshIntegrity: this.roofMeshIntegrity,
      surfaceReached: this.surfaceReached
    };
  }
}
