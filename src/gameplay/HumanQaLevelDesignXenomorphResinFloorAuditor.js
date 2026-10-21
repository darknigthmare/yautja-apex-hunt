/**
 * HumanQaLevelDesignXenomorphResinFloorAuditor.js
 * 
 * Chantier 10 & Audit QA #5 (Level Design):
 * Solves QA tester feedback: "Xenomorph hive floors in AVP levels have glossy textures
 * but zero effect on footwork. In Alien lore, the sticky bio-mechanical hive resin
 * acts like natural adhesive, severely penalizing jump velocity and sprinting while
 * allowing Wall-crawling Xenos to move unimpeded."
 * 
 * Implements non-Newtonian adhesive floor mechanics: sprint velocity penalties (-45%),
 * jump height restriction (-60%), acoustic peeling footstep friction, and thermal plasma incineration.
 */

export class HumanQaLevelDesignXenomorphResinFloorAuditor {
  /**
   * @param {Object} options
   * @param {string} [options.hiveSectorId='avp-hive-resin-corridor-01']
   * @param {number} [options.resinLayerThicknessMm=18.0]
   * @param {number} [options.resinAdhesionIndex=0.45] // 45% speed reduction
   */
  constructor(options = {}) {
    this.hiveSectorId = options.hiveSectorId || 'avp-hive-resin-corridor-01';
    this.resinLayerThicknessMm = options.resinLayerThicknessMm || 18.0;
    this.resinAdhesionIndex = options.resinAdhesionIndex || 0.45;

    this.clearedResinAreaM2 = 0.0;
  }

  /**
   * Evaluates locomotion penalties when walking or sprinting on the resin floor.
   * @param {number} baseVelocityMps
   * @param {boolean} isXenomorphSpecies - Xenomorphs traverse resin without penalty
   * @returns {Object} Locomotion telemetry
   */
  evaluateResinFloorImpedance(baseVelocityMps = 7.2, isXenomorphSpecies = false) {
    if (isXenomorphSpecies) {
      // Bio-adapted claws adhere and push off resin effortlessly
      return {
        baseVelocityMps,
        effectiveVelocityMps: +(baseVelocityMps * 1.15).toFixed(2), // +15% native speed
        jumpHeightPenaltyRatio: 0.0,
        stickyPeelDecibels: 0,
        isXenomorphSpecies: true
      };
    }

    const effectiveVelocityMps = +(baseVelocityMps * (1.0 - this.resinAdhesionIndex)).toFixed(2);
    const jumpHeightPenaltyRatio = 0.60; // 60% lower jump
    const stickyPeelDecibels = Math.round(62 + baseVelocityMps * 2.2);

    return {
      baseVelocityMps,
      resinAdhesionIndex: this.resinAdhesionIndex,
      effectiveVelocityMps,
      jumpHeightPenaltyRatio,
      stickyPeelDecibels,
      isXenomorphSpecies: false
    };
  }

  /**
   * Burns away a patch of resin using a plasma blast or flame torch.
   * Cleanses the adhesive and restores normal ground traction.
   * @param {number} blastRadiusM
   * @returns {Object} Clearance outcome
   */
  clearResinByIncineration(blastRadiusM = 3.5) {
    const areaCleared = +(Math.PI * Math.pow(blastRadiusM, 2)).toFixed(1);
    this.clearedResinAreaM2 += areaCleared;

    return {
      success: true,
      blastRadiusM,
      areaClearedM2: areaCleared,
      totalClearedAreaM2: +this.clearedResinAreaM2.toFixed(1),
      tractionRestored: true,
      burntResinSmokeSec: 3.2
    };
  }
}
