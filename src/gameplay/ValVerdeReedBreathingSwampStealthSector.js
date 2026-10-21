/**
 * ValVerdeReedBreathingSwampStealthSector.js
 * 
 * Chantier Level Design #6 - Arène du Marécage aux Sangsues & Infiltration Subaquatique au Roseau.
 * Canonical 1:1 Predator (1987) fidelity:
 * - Dutch submerges entirely under murky swamp water, breathing through a cut hollow river reed.
 * - 100% optical and infrared thermal concealment: cold water layer completely blocks bio-mask heat acquisition.
 * - Submerged oxygen endurance timer (up to 90s before needing to surface).
 * - Exhalation air bubble management: controlled slow breathing avoids surface ripples that would draw Yautja attention.
 * - Submerged ambush launch: sudden explosive vertical breach to strike an overhead patrolling hunter.
 */

export class ValVerdeReedBreathingSwampStealthSector {
  /**
   * @param {Object} options
   * @param {number} [options.waterDepthM=1.4]
   * @param {number} [options.waterTempC=18.0]
   */
  constructor(options = {}) {
    this.waterDepthM = options.waterDepthM ?? 1.4;
    this.waterTempC = options.waterTempC ?? 18.0;

    this.isSubmerged = false;
    this.reedIntact = true;
    this.submergedSeconds = 0;
    this.maxSubmergedSeconds = 90.0;
  }

  /**
   * Submerges under the murky water breathing through the hollow reed.
   * @returns {Object} Submersion status
   */
  submergeWithHollowReed() {
    this.isSubmerged = true;
    this.submergedSeconds = 0;

    return {
      success: true,
      isSubmerged: true,
      reedIntact: this.reedIntact,
      thermalInvisibilityScore: 100,
      opticalConcealmentScore: 100,
      submergedWaterDepthM: this.waterDepthM,
      maxOxygenDurationSec: this.maxSubmergedSeconds,
      breathingAcousticDb: 22
    };
  }

  /**
   * Updates submersion duration and calculates surface bubble risk.
   * @param {number} deltaSeconds
   * @param {boolean} [controlledExhalation=true]
   * @returns {Object} Submersion telemetry
   */
  updateSubmersionState(deltaSeconds = 15.0, controlledExhalation = true) {
    if (!this.isSubmerged) {
      return { isSubmerged: false, remainingOxygenSec: this.maxSubmergedSeconds };
    }

    this.submergedSeconds += deltaSeconds;
    const remainingOxygenSec = Math.max(0, this.maxSubmergedSeconds - this.submergedSeconds);
    const surfaceRipplesGenerated = !controlledExhalation || remainingOxygenSec <= 10.0;

    return {
      isSubmerged: true,
      submergedSeconds: this.submergedSeconds,
      remainingOxygenSec,
      oxygenDepleted: remainingOxygenSec <= 0,
      surfaceRipplesGenerated,
      hunterAlertRiskPct: surfaceRipplesGenerated ? 65 : 5
    };
  }

  /**
   * Executes a surprise vertical ambush breach from the murky depths.
   * @returns {Object} Ambush breach telemetry
   */
  breachWaterSurfaceAmbush() {
    this.isSubmerged = false;

    return {
      success: true,
      breachVelocityMps: 4.8,
      surpriseAttackMultiplier: 3.0,
      waterSplashAcousticDb: 76,
      hunterCaughtOffGuard: true
    };
  }
}
