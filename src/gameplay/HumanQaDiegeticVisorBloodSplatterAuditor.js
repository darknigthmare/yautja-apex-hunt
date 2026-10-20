/**
 * HumanQaDiegeticVisorBloodSplatterAuditor.js
 * 
 * Human Playtester QA Audit #3: Visor Blood Splatter & Combustion Soot Realism.
 * Replaces spotless unrealistic bio-mask HUDs during brutal close-quarters trophy executions
 * (decapitations, spine rips, facehugger stomps) by applying procedural blood droplets
 * and carbon soot deposits (.visor-blood-splatter-overlay), subject to rain wash and manual wipes.
 */

export class HumanQaDiegeticVisorBloodSplatterAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.splatterDecayRatePerSec=0.04]
   */
  constructor(options = {}) {
    this.splatterDecayRatePerSec = options.splatterDecayRatePerSec || 0.04;
    this.bloodCoveragePercentage = 0.0;
    this.sootCoveragePercentage = 0.0;
    this.splatterActive = false;
    this.totalSplatterEvents = 0;
  }

  /**
   * Applies blood splatter projection onto the bio-mask lens following an execution.
   * @param {number} [splatterVolumeMl=35.0]
   * @param {string} [targetSpecies='HUMAN'] - 'HUMAN' (crimson), 'XENOMORPH' (yellow-green acid), 'YAUTJA' (emerald)
   * @returns {Object} Splatter telemetry
   */
  applyExecutionBloodSplatter(splatterVolumeMl = 35.0, targetSpecies = 'HUMAN') {
    this.totalSplatterEvents++;
    this.splatterActive = true;

    const coverageGain = Math.min(65.0, +(splatterVolumeMl * 1.2).toFixed(1));
    this.bloodCoveragePercentage = Math.min(100.0, +(this.bloodCoveragePercentage + coverageGain).toFixed(1));

    let bloodColor = '#880000'; // Human red
    if (targetSpecies === 'XENOMORPH') bloodColor = '#ccff00'; // Caustic yellow-green
    else if (targetSpecies === 'YAUTJA') bloodColor = '#00ff66'; // Luminescent emerald

    return {
      splatterVolumeMl,
      targetSpecies,
      bloodColor,
      bloodCoveragePercentage: this.bloodCoveragePercentage,
      splatterActive: true,
      obscurationFactor: +(this.bloodCoveragePercentage / 100.0).toFixed(2)
    };
  }

  /**
   * Processes natural environmental wash-off caused by atmospheric rain and forward running speed.
   * @param {boolean} rainActive
   * @param {number} movementSpeedMps
   * @param {number} deltaSec
   * @returns {Object} Wash-off telemetry
   */
  processEnvironmentalWashing(rainActive = false, movementSpeedMps = 0.0, deltaSec = 1.0) {
    if (!this.splatterActive) {
      return { bloodCoveragePercentage: 0, splatterActive: false };
    }

    const rainWashFactor = rainActive ? 0.25 : 0.02;
    const airResistanceFactor = movementSpeedMps * 0.015;
    const totalDecay = (this.splatterDecayRatePerSec + rainWashFactor + airResistanceFactor) * deltaSec * 100;

    this.bloodCoveragePercentage = Math.max(0, +(this.bloodCoveragePercentage - totalDecay).toFixed(1));
    this.splatterActive = this.bloodCoveragePercentage > 3.0;

    return {
      bloodCoveragePercentage: this.bloodCoveragePercentage,
      splatterActive: this.splatterActive,
      washedByRain: rainActive
    };
  }

  /**
   * Wipes the visor clean using the armored forearm gauntlet sleeve.
   * @returns {Object} Wipe result
   */
  wipeVisorClean() {
    this.bloodCoveragePercentage = 0.0;
    this.sootCoveragePercentage = 0.0;
    this.splatterActive = false;

    return {
      success: true,
      bloodCoveragePercentage: 0.0,
      splatterActive: false,
      opticalClarityRestored: true
    };
  }

  /**
   * Returns current visor splatter telemetry.
   * @returns {Object}
   */
  getVisorSplatterTelemetry() {
    return {
      bloodCoveragePercentage: this.bloodCoveragePercentage,
      sootCoveragePercentage: this.sootCoveragePercentage,
      splatterActive: this.splatterActive,
      totalSplatterEvents: this.totalSplatterEvents,
      cssClass: this.splatterActive 
        ? 'visor-blood-splatter-overlay splatter-active' 
        : 'visor-blood-splatter-overlay'
    };
  }
}
