/**
 * ValVerdeWaterfallCliffPlungeSector.js
 * 
 * Predator (1987) - 40-meter waterfall cliff and deep lagoon basin.
 * Simulates Dutch Schaefer's desperate leap to escape the Jungle Hunter's plasmacaster targeting,
 * freefall mechanics, hydraulic impact cushion physics, and cloak water short-circuiting.
 */

export class ValVerdeWaterfallCliffPlungeSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='val-verde-waterfall-basin-01']
   * @param {number} [options.cliffElevationM=40.0]
   * @param {number} [options.lagoonDepthM=9.0]
   * @param {number} [options.waterDecelerationMps2=54.0]
   * @param {number} [options.waterTemperatureC=18.5]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'val-verde-waterfall-basin-01';
    this.cliffElevationM = options.cliffElevationM || 40.0;
    this.lagoonDepthM = options.lagoonDepthM || 9.0;
    this.waterDecelerationMps2 = options.waterDecelerationMps2 || 54.0;
    this.waterTemperatureC = options.waterTemperatureC || 18.5;

    this.plungeExecuted = false;
    this.hunterCloakShortCircuited = false;
    this.plasmaDetonationCavitationActive = false;
  }

  /**
   * Calculates ballistic freefall from cliff edge into lagoon.
   * @param {number} horizontalLeapVelocityMps - Initial push off cliff (m/s)
   * @param {number} gravityMps2 - Standard gravity (9.81 m/s²)
   * @returns {Object} Freefall trajectory metrics
   */
  computeFreefallTrajectory(horizontalLeapVelocityMps = 3.5, gravityMps2 = 9.81) {
    const fallDurationSec = +(Math.sqrt((2 * this.cliffElevationM) / gravityMps2)).toFixed(2);
    const verticalImpactVelocityMps = +(Math.sqrt(2 * gravityMps2 * this.cliffElevationM)).toFixed(2);
    const totalImpactVelocityMps = +(Math.sqrt(
      Math.pow(horizontalLeapVelocityMps, 2) + Math.pow(verticalImpactVelocityMps, 2)
    )).toFixed(2);
    const horizontalDistanceM = +(horizontalLeapVelocityMps * fallDurationSec).toFixed(2);

    return {
      cliffElevationM: this.cliffElevationM,
      fallDurationSec,
      verticalImpactVelocityMps,
      totalImpactVelocityMps,
      horizontalDistanceM
    };
  }

  /**
   * Evaluates hydraulic penetration and survival upon lagoon water entry.
   * @param {number} impactVelocityMps
   * @param {number} diveAngleDeg - 90 deg = vertical pencil dive, 0 deg = belly flop
   * @returns {Object} Water impact outcome
   */
  resolveWaterImpact(impactVelocityMps = 28.0, diveAngleDeg = 85.0) {
    this.plungeExecuted = true;
    const isPencilDive = diveAngleDeg >= 75.0;
    const dragMultiplier = isPencilDive ? 1.0 : 2.5;
    const effectiveDecel = this.waterDecelerationMps2 * dragMultiplier;

    // Penetration depth D = v^2 / (2 * a)
    const penetrationDepthM = +(Math.pow(impactVelocityMps, 2) / (2 * effectiveDecel)).toFixed(2);
    const seabedImpact = penetrationDepthM >= this.lagoonDepthM;
    const impactGForce = +(effectiveDecel / 9.81).toFixed(1);
    const bluntDamage = isPencilDive ? 5 : (seabedImpact ? 120 : 65);
    const survived = bluntDamage < 100;

    return {
      survived,
      isPencilDive,
      impactVelocityMps,
      penetrationDepthM,
      lagoonDepthM: this.lagoonDepthM,
      seabedImpact,
      impactGForce,
      bluntDamage
    };
  }

  /**
   * Evaluates Jungle Hunter optical camouflage failure upon water immersion.
   * In 1987 canon, water shorts out the cloak generator with sizzling sparks.
   * @param {number} immersionDepthM
   * @param {boolean} hunterSubmerged
   * @returns {Object} Cloak status telemetry
   */
  evaluateHunterCloakImmersion(immersionDepthM = 1.2, hunterSubmerged = true) {
    if (!hunterSubmerged || immersionDepthM < 0.3) {
      return {
        cloakOperational: true,
        electricalDischargeActive: false,
        steamingBubblesGenerated: 0
      };
    }

    this.hunterCloakShortCircuited = true;
    const sparkDischargeJoules = 420;
    const sizzlingSteamBubbles = Math.round(150 + immersionDepthM * 80);

    return {
      cloakOperational: false,
      hunterCloakShortCircuited: true,
      electricalDischargeActive: true,
      sparkDischargeJoules,
      sizzlingSteamBubbles,
      thermalDampeningBonus: 0.65 // Cold mountain lagoon masks body heat
    };
  }

  /**
   * Models the plasmacaster shot striking the waterfall rock face above the lagoon.
   * @param {number} plasmaChargeJoules
   * @returns {Object} Cavitation splash telemetry
   */
  triggerCliffEdgePlasmaBlast(plasmaChargeJoules = 850) {
    this.plasmaDetonationCavitationActive = true;
    const splashWaveHeightM = +(0.8 + (plasmaChargeJoules / 1000) * 1.5).toFixed(2);
    const vaporCloudRadiusM = +(2.5 + (plasmaChargeJoules / 1000) * 3.0).toFixed(2);

    return {
      plasmaBlastDetonated: true,
      plasmaChargeJoules,
      splashWaveHeightM,
      vaporCloudRadiusM,
      visionObscuredSec: 2.4
    };
  }
}
