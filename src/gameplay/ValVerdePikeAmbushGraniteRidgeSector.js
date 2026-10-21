/**
 * ValVerdePikeAmbushGraniteRidgeSector.js
 * 
 * Predator (1987) - Dutch's Granite Ridge Ambush & Punji Stake Chokepoint.
 * Simulates the commando unit's high-ground defensive perimeter: sharpened wooden punji stakes,
 * M203 40mm underslung grenade crater blasts, blind-fire M16 jungle canopy suppression sweeps,
 * and burning jungle undergrowth creating localized thermal glare blindspots.
 */

export class ValVerdePikeAmbushGraniteRidgeSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='val-verde-granite-ridge-01']
   * @param {number} [options.ridgeElevationM=18.0]
   * @param {number} [options.punjiStakesCount=12]
   * @param {number} [options.m203GrenadesRemaining=3]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'val-verde-granite-ridge-01';
    this.ridgeElevationM = options.ridgeElevationM || 18.0;
    this.punjiStakesCount = options.punjiStakesCount || 12;
    this.m203GrenadesRemaining = options.m203GrenadesRemaining || 3;

    this.canopySuppressionSweepsActive = false;
    this.thermalBlindspotsCount = 0;
  }

  /**
   * Evaluates collision with hidden sharpened wooden punji stakes along the ridge trail.
   * @param {number} ascentSpeedMps
   * @returns {Object} Punji stake puncture telemetry
   */
  checkPunjiStakeCollision(ascentSpeedMps = 4.8) {
    if (this.punjiStakesCount <= 0 || ascentSpeedMps < 1.0) {
      return { impaled: false, punctureDamage: 0 };
    }

    this.punjiStakesCount -= 2;
    const punctureDamage = Math.round(45 + ascentSpeedMps * 8);
    const impaled = true;

    return {
      impaled,
      ascentSpeedMps,
      punctureDamage,
      legBleedRatePerSec: 4.5,
      movementSlowdownRatio: 0.35,
      punjiStakesRemaining: this.punjiStakesCount
    };
  }

  /**
   * Fires a 40mm high-explosive M203 grenade into granite rock outcrops.
   * Produces high-pressure blast and jagged stone shrapnel.
   * @param {number} targetDistanceM
   * @returns {Object} Crater blast resolution
   */
  detonateM203GraniteCraterBlast(targetDistanceM = 24.0) {
    if (this.m203GrenadesRemaining <= 0) {
      return { detonated: false, reason: 'OUT_OF_40MM_GRENADES' };
    }

    this.m203GrenadesRemaining--;
    this.thermalBlindspotsCount++;
    const blastOverpressureKpa = 240;
    const stoneShrapnelCount = 48;
    const craterDiameterM = 2.4;

    return {
      detonated: true,
      targetDistanceM,
      blastOverpressureKpa,
      stoneShrapnelCount,
      craterDiameterM,
      concussiveDamage: 190,
      stoneFragmentDamage: 85,
      foliageFireIgnited: true,
      m203GrenadesRemaining: this.m203GrenadesRemaining
    };
  }

  /**
   * Commandos unleash sustained blind-fire automatic rifle suppression into the upper canopy.
   * Rapidly sweeps branches and leaves, forcing the cloaked hunter to relocate.
   * @param {number} sweepDurationSec
   * @returns {Object} Canopy suppression telemetry
   */
  executeCanopySuppressionSweep(sweepDurationSec = 6.0) {
    this.canopySuppressionSweepsActive = true;
    const bulletsFired = Math.round(sweepDurationSec * 14 * 3); // 3 rifles at 800 rpm
    const leafFoliageDensityReduction = +(sweepDurationSec * 0.08).toFixed(2);
    const hunterForcedToDropPerch = sweepDurationSec >= 4.0;

    return {
      canopySuppressionSweepsActive: true,
      sweepDurationSec,
      bulletsFired,
      leafFoliageDensityReduction,
      hunterForcedToDropPerch,
      audioChaosDecibels: 104,
      ricochetSplinteringHazzard: true
    };
  }
}
