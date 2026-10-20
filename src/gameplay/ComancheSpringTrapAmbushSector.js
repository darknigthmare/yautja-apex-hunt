/**
 * ComancheSpringTrapAmbushSector.js
 * 
 * Prey (2022) - Northern Great Plains Comanche Ambush & Feral Duel.
 * Simulates Naru's cunning environmental traps against the Feral Predator:
 * spring-loaded bent sapling deadfalls, obsidian tomahawk rope tethering,
 * and the canonical climax mechanic: turning the Feral bio-mask's tri-laser
 * homing guidance against him by redirecting projectile trajectories.
 */

export class ComancheSpringTrapAmbushSector {
  /**
   * @param {Object} options
   * @param {string} [options.ambushSectorId='comanche-forest-ambush-01']
   * @param {number} [options.bentSaplingTensionNm=450.0]
   * @param {boolean} [options.feralBioMaskDetached=false]
   */
  constructor(options = {}) {
    this.ambushSectorId = options.ambushSectorId || 'comanche-forest-ambush-01';
    this.bentSaplingTensionNm = options.bentSaplingTensionNm || 450.0;
    this.feralBioMaskDetached = options.feralBioMaskDetached !== undefined ? options.feralBioMaskDetached : false;

    this.saplingTrapArmed = true;
    this.tomahawkTetherExtended = false;
    this.maskGuidanceTarget = { x: 0, y: 0, z: 0 };
  }

  /**
   * Releases the spring-loaded bent sapling spike deadfall.
   * Angular torque release: E = 0.5 * k * theta^2
   * @param {number} deflectionAngleRad - Bend angle (e.g. 1.2 rad)
   * @returns {Object} Spring trap release metrics
   */
  triggerSaplingSpringDeadfall(deflectionAngleRad = 1.2) {
    if (!this.saplingTrapArmed) {
      return { triggered: false, reason: 'TRAP_ALREADY_SPRUNG' };
    }

    this.saplingTrapArmed = false;
    const impactKineticEnergyJoules = Math.round(0.5 * this.bentSaplingTensionNm * Math.pow(deflectionAngleRad, 2));
    const tipVelocityMps = +(Math.sqrt((2 * impactKineticEnergyJoules) / 3.5)).toFixed(1);
    const bluntDamage = Math.round(impactKineticEnergyJoules * 0.45);

    return {
      triggered: true,
      impactKineticEnergyJoules,
      tipVelocityMps,
      bluntDamage,
      staggerDurationSec: 1.5,
      boneCrackingSeverity: impactKineticEnergyJoules > 250 ? 'HEAVY' : 'MODERATE'
    };
  }

  /**
   * Throws and rapidly retrieves the obsidian tomahawk via sinew rope tether.
   * @param {number} throwDistanceM
   * @returns {Object} Tomahawk throw and reel resolution
   */
  throwAndReelTomahawk(throwDistanceM = 8.5) {
    this.tomahawkTetherExtended = true;
    const throwFlightTimeSec = +(throwDistanceM / 22.0).toFixed(2); // 22 m/s throw
    const reelBackSpeedMps = 18.0;
    const reelBackTimeSec = +(throwDistanceM / reelBackSpeedMps).toFixed(2);

    const forwardSlashDamage = 85;
    const returnArcBleedDamage = 45;
    const totalComboDamage = forwardSlashDamage + returnArcBleedDamage;

    this.tomahawkTetherExtended = false;

    return {
      success: true,
      throwDistanceM,
      throwFlightTimeSec,
      reelBackTimeSec,
      forwardSlashDamage,
      returnArcBleedDamage,
      totalComboDamage,
      tetherIntegrity: 0.95
    };
  }

  /**
   * The Film Climax Mechanic (Prey 2022):
   * Detaches the Feral Predator's bone bio-mask and places it pointing back at him.
   * When Feral fires his bolt launcher, the projectile calculates trajectory relative to the mask's sights.
   * @param {Object} maskFacingCoordinates
   * @param {Object} feralPredatorCoordinates
   * @returns {Object} Laser guidance reflection telemetry
   */
  redirectBioMaskGuidance(maskFacingCoordinates = { x: 0, y: 1.8, z: 5.0 }, feralPredatorCoordinates = { x: 0, y: 1.8, z: 5.0 }) {
    this.feralBioMaskDetached = true;
    this.maskGuidanceTarget = maskFacingCoordinates;

    // Calculate distance between mask aim and Feral's current position
    const dx = maskFacingCoordinates.x - feralPredatorCoordinates.x;
    const dy = maskFacingCoordinates.y - feralPredatorCoordinates.y;
    const dz = maskFacingCoordinates.z - feralPredatorCoordinates.z;
    const alignmentErrorM = +(Math.sqrt(dx * dx + dy * dy + dz * dz)).toFixed(2);

    const isSelfInflictedLock = alignmentErrorM <= 0.5;

    return {
      bioMaskDetached: true,
      laserGuidanceActive: true,
      alignmentErrorM,
      isSelfInflictedLock,
      boltCurvatureArcDeg: isSelfInflictedLock ? 180 : 45,
      lethalSelfHeadshotGuaranteed: isSelfInflictedLock,
      lethalDamage: isSelfInflictedLock ? 999 : 120
    };
  }
}
