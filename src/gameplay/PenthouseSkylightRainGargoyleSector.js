/**
 * PenthouseSkylightRainGargoyleSector.js
 * 
 * Predator 2 (1990) - Los Angeles High-Rise Penthouse Skylight & Gothic Rain Gargoyles.
 * Simulates the high-altitude urban duel arena:
 * - Stained glass dome skylight 45 stories above street level, shatterable by a 140kg plunge
 * - Gothic stone rain gargoyles serving as elevated sniper roosts overlooking smoggy Los Angeles
 * - Structural lightning rod conductor path channeling lightning strikes down copper grounding wires
 * - Indoor Italian marble pillars providing high-density cover against submachine gun barrages.
 */

export class PenthouseSkylightRainGargoyleSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='la-penthouse-gargoyle-01']
   * @param {number} [options.buildingStories=45]
   * @param {number} [options.skylightGlassIntegrity=1.0]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'la-penthouse-gargoyle-01';
    this.buildingStories = options.buildingStories || 45;
    this.skylightGlassIntegrity = options.skylightGlassIntegrity || 1.0;

    this.roofElevationM = this.buildingStories * 3.6; // ~162 meters above street level
    this.skylightBreached = false;
    this.rainStormIntensityMmHr = 15.0;
  }

  /**
   * Performs an explosive ceiling breach by plunging through the rooftop stained glass skylight.
   * Drops directly into the luxury penthouse salon, creating a cascade of glass shards and surprise shock.
   * @param {number} hunterMassKg
   * @returns {Object} Skylight breach telemetry
   */
  breachPenthouseSkylightPlunge(hunterMassKg = 140.0) {
    this.skylightBreached = true;
    this.skylightGlassIntegrity = 0.0;

    const fallDropDistanceM = 7.5; // From rooftop frame to penthouse carpet floor
    const impactVelocityMps = Number(Math.sqrt(2 * 9.81 * fallDropDistanceM).toFixed(2));
    const glassShatterDecibels = 106;
    const enemySurpriseStunSec = 1.8;
    const glassShrapnelDamage = 65;

    return {
      success: true,
      skylightBreached: true,
      fallDropDistanceM,
      impactVelocityMps,
      glassShatterDecibels,
      enemySurpriseStunSec,
      glassShrapnelDamage,
      glassFragmentsCount: 240,
      iFramesDurationMs: 180
    };
  }

  /**
   * Occupies a gothic stone rain gargoyle on the 45th floor parapet for city-wide overwatch.
   * @returns {Object} Gargoyle roost telemetry
   */
  perchOnRoofGargoyleRoost() {
    const urbanSightlineRadiusM = 380.0;
    const sniperStabilityBonusPct = 45.0;
    const lightningStrikeGroundingProtection = true;

    return {
      roofElevationM: this.roofElevationM,
      buildingStories: this.buildingStories,
      urbanSightlineRadiusM,
      sniperStabilityBonusPct,
      lightningStrikeGroundingProtection,
      rainDripAcousticMaskingDb: 48,
      verticalDropEscapeAvailable: true
    };
  }

  /**
   * Channels lightning strike energy through the roof lightning arrestor rod into wrist gauntlet batteries.
   * @param {boolean} lightningStrikeEvent
   * @returns {Object} Lightning recharge telemetry
   */
  channelLightningConductorCharge(lightningStrikeEvent = true) {
    if (!lightningStrikeEvent) {
      return { recharged: false, reason: 'NO_LIGHTNING_EVENT' };
    }

    const energyTransferredJoules = 150000;
    const plasmaEnergyRecharged = 100.0; // 100% full plasma battery recharge

    return {
      recharged: true,
      energyTransferredJoules,
      plasmaEnergyRecharged,
      overchargeAudioBuzzDb: 95,
      blueIonicSparksDurationSec: 2.5
    };
  }
}
