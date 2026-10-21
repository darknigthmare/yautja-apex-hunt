/**
 * HumanQaLevelDesignViolentHydroCurrentAuditor.js
 * 
 * Chantier 10 & Audit QA #5 (Level Design):
 * Solves QA tester feedback: "Water channels in storm drains and rivers feel
 * like flat planes with no current physics. High-flow stormwater channels should
 * sweep characters downstream, deflect leap arcs, and require swimming / anchoring against the current."
 * 
 * Implements hydrodynamic flow vectors, fluid drag force (F = 0.5 * rho * v^2 * Cd * A),
 * downstream drift velocity, leap trajectory deflection angles, and combi-stick ground anchoring.
 */

export class HumanQaLevelDesignViolentHydroCurrentAuditor {
  /**
   * @param {Object} options
   * @param {string} [options.waterChannelId='storm-drain-channel-01']
   * @param {number} [options.currentSpeedMps=4.8]
   * @param {number} [options.waterDensityKgM3=1000.0]
   * @param {number} [options.channelDepthM=1.6]
   */
  constructor(options = {}) {
    this.waterChannelId = options.waterChannelId || 'storm-drain-channel-01';
    this.currentSpeedMps = options.currentSpeedMps || 4.8;
    this.waterDensityKgM3 = options.waterDensityKgM3 || 1000.0;
    this.channelDepthM = options.channelDepthM || 1.6;

    this.isAnchored = false;
  }

  /**
   * Computes hydrodynamic drag force on an entity standing or swimming in the channel.
   * F_drag = 0.5 * rho * v^2 * C_d * A
   * @param {number} frontalAreaM2 - ~0.8 m2 for standing Yautja
   * @param {number} dragCoefficient - ~0.9 for humanoid body in water
   * @returns {Object} Drag force telemetry
   */
  computeCurrentDragForce(frontalAreaM2 = 0.8, dragCoefficient = 0.9) {
    const dragForceNewtons = Math.round(
      0.5 * this.waterDensityKgM3 * Math.pow(this.currentSpeedMps, 2) * dragCoefficient * frontalAreaM2
    ); // ~8294 N
    const sweptDownstream = !this.isAnchored && dragForceNewtons > 1200;

    return {
      currentSpeedMps: this.currentSpeedMps,
      frontalAreaM2,
      dragCoefficient,
      dragForceNewtons,
      sweptDownstream,
      isAnchored: this.isAnchored,
      downstreamDriftSpeedMps: sweptDownstream ? +(this.currentSpeedMps * 0.75).toFixed(2) : 0.0
    };
  }

  /**
   * Computes trajectory deflection when jumping across or with the current.
   * @param {number} jumpVelocityMps - e.g. 8.0 m/s
   * @param {number} jumpAngleDeg - 90 deg = perpendicular across channel
   * @returns {Object} Deflection telemetry
   */
  computeLeapTrajectoryDeflection(jumpVelocityMps = 8.0, jumpAngleDeg = 90.0) {
    const flightTimeSec = 0.85;
    const downstreamDriftM = +(this.currentSpeedMps * flightTimeSec * 0.45).toFixed(2);
    const deflectionAngleDeg = +(Math.atan2(downstreamDriftM, jumpVelocityMps * flightTimeSec) * (180 / Math.PI)).toFixed(1);

    return {
      jumpVelocityMps,
      jumpAngleDeg,
      downstreamDriftM,
      deflectionAngleDeg,
      landingPointShifted: downstreamDriftM > 0.5
    };
  }

  /**
   * Anchors the hunter to the channel bedrock by driving the Combi-stick into floor grates.
   * Resists up to 3500 N of drag force.
   * @param {boolean} anchored
   * @returns {Object} Anchor status
   */
  setCombiStickBedrockAnchor(anchored = true) {
    this.isAnchored = Boolean(anchored);

    return {
      isAnchored: this.isAnchored,
      maxHoldingForceN: this.isAnchored ? 3500 : 0,
      downstreamDriftPrevented: this.isAnchored
    };
  }
}
