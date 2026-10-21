/**
 * Predator2ElScorpioPenthouseSiegeSector.js
 * 
 * Chantier Level Design #1 - Siège du Penthouse d'El Scorpio & Lance-Filet Broyeur d'Os.
 * Canonical 1:1 Predator 2 (1990) fidelity:
 * - Opening urban siege: 109 °F heatwave shootout on the streets of Downtown LA.
 * - Ramon Vega and heavily armed El Scorpio cartel barricade in the luxury cocaine penthouse.
 * - City Hunter crashes through the central glass skylight (15m ceiling breach).
 * - Net-gun deployment: high-tension wire net fired at 45 m/s, pinning cartel mercenaries to concrete
 *   and mahogany walls. Wire mesh tightens under internal hydraulic spring tension, constricting and
 *   crushing bones (88 dB bone crunch) while slicing through flesh.
 * - Extended dual wristblades melee combat through drywall partitions.
 * - Ramon Vega disarmed while attempting to detonate C4 explosives; gold cartel medallion harvested as trophy.
 */

export class Predator2ElScorpioPenthouseSiegeSector {
  /**
   * @param {Object} options
   * @param {number} [options.cartelMercenariesCount=8]
   * @param {number} [options.skylightElevationM=15.0]
   */
  constructor(options = {}) {
    this.cartelMercenariesCount = options.cartelMercenariesCount ?? 8;
    this.skylightElevationM = options.skylightElevationM ?? 15.0;

    this.skylightBreached = false;
    this.pinnedTargetsCount = 0;
    this.ramonVegaDefeated = false;
    this.medallionHarvested = false;
  }

  /**
   * Breaches the penthouse glass skylight from the roof.
   * @returns {Object} Skylight breach telemetry
   */
  breachGlassSkylight() {
    this.skylightBreached = true;

    return {
      success: true,
      skylightBreached: true,
      entryElevationM: this.skylightElevationM,
      shatteredGlassWeightKg: 120.0,
      glassShatterAcousticDb: 96,
      cartelPanicState: 'TERRIFIED_DISORIENTED',
      c4ExplosiveThreatActive: true
    };
  }

  /**
   * Fires the wire-mesh net-gun to pin a cartel gunman to a wall.
   * @param {string} targetName - Name of target
   * @param {string} [wallMaterial='REINFORCED_CONCRETE']
   * @returns {Object} Net-gun pinning telemetry
   */
  fireNetGunPinningTarget(targetName = 'EL_SCORPIO_GUNMAN', wallMaterial = 'REINFORCED_CONCRETE') {
    if (!this.skylightBreached) {
      return { success: false, reason: 'MUST_BREACH_PENTHOUSE_FIRST' };
    }

    this.pinnedTargetsCount++;
    this.cartelMercenariesCount = Math.max(0, this.cartelMercenariesCount - 1);

    const constrictionForceN = 4500.0;
    const wireConstrictionSpeedCmPerSec = 8.5;

    return {
      success: true,
      targetName,
      wallMaterial,
      netSpeedMps: 45.0,
      pinnedToWall: true,
      constrictionForceN,
      wireConstrictionSpeedCmPerSec,
      ribFractureConfirmed: true,
      boneCrunchAcousticDb: 88,
      screamsResonanceDb: 92,
      remainingMercenaries: this.cartelMercenariesCount
    };
  }

  /**
   * Sweeps dual wristblades through drywall partitions to eliminate armed cartel members.
   * @param {number} meleeRangeM - Strike range (m)
   * @returns {Object} Melee sweep outcome
   */
  sweepDualWristBladesMelee(meleeRangeM = 1.8) {
    const eliminated = Math.min(this.cartelMercenariesCount, 3);
    this.cartelMercenariesCount -= eliminated;

    return {
      success: true,
      meleeRangeM,
      bladeLengthCm: 45.0,
      drywallPenetrationM: 0.12,
      cartelNeutralized: eliminated,
      remainingMercenaries: this.cartelMercenariesCount,
      wristBladeSliceAcousticDb: 84
    };
  }

  /**
   * Neutralizes cartel boss Ramon Vega before he detonates C4 and harvests his medallion trophy.
   * @returns {Object} Ramon Vega confrontation telemetry
   */
  neutralizeCartelBossRamonVega() {
    this.ramonVegaDefeated = true;
    this.medallionHarvested = true;

    return {
      success: true,
      ramonVegaDefeated: true,
      c4DetonatorConfiscated: true,
      c4DetonationAverted: true,
      trophyAcquired: 'GOLD_EL_SCORPIO_CARTEL_MEDALLION',
      honorBonusPoints: 175,
      cartelPenthouseCleared: true
    };
  }
}
