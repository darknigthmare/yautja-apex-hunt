/**
 * HumanQaPeripheralThreatCompassDirector.js
 * 
 * Human Playtester QA Audit #1: 360-Degree Peripheral Threat Compass & Acoustic Proximity Ring.
 * Resolves the lack of off-screen situational awareness in dense jungle and subterranean corridors:
 * computes relative polar bearing angles (0-360 deg) and Euclidean proximity distances for all hostile entities,
 * rendering .peripheral-threat-ring and pulsating .threat-blip.critical markers for targets within 4.0m.
 */

export class HumanQaPeripheralThreatCompassDirector {
  /**
   * @param {Object} options
   * @param {number} [options.compassRadiusPixels=160]
   * @param {number} [options.maxDetectionRangeMeters=35.0]
   */
  constructor(options = {}) {
    this.compassRadiusPixels = options.compassRadiusPixels || 160;
    this.maxDetectionRangeMeters = options.maxDetectionRangeMeters || 35.0;

    this.trackedThreats = [];
    this.criticalThreatCount = 0;
  }

  /**
   * Updates positional tracking on all active hostile entities relative to the hunter.
   * @param {Array<{id: string, x: number, z: number, isAggressive: boolean}>} threatsList
   * @param {{x: number, z: number}} playerPos
   * @param {{x: number, z: number}} playerLookVector - Normalized facing direction
   * @returns {Object} Compass evaluation
   */
  updateThreatTracking(threatsList = [], playerPos = { x: 0, z: 0 }, playerLookVector = { x: 0, z: 1 }) {
    if (!Array.isArray(threatsList)) {
      this.trackedThreats = [];
      this.criticalThreatCount = 0;
      return { totalTracked: 0, criticalCount: 0, blips: [] };
    }

    const playerHeadingRad = Math.atan2(playerLookVector.x, playerLookVector.z);
    this.criticalThreatCount = 0;

    this.trackedThreats = threatsList.map(threat => {
      const dx = threat.x - playerPos.x;
      const dz = threat.z - playerPos.z;
      const distanceMeters = +Math.hypot(dx, dz).toFixed(2);

      if (distanceMeters > this.maxDetectionRangeMeters) {
        return null; // Out of acoustic detection radius
      }

      // World angle to threat
      const worldAngleRad = Math.atan2(dx, dz);
      // Relative angle relative to player view heading
      let relAngleRad = worldAngleRad - playerHeadingRad;
      let relAngleDeg = Math.round(relAngleRad * (180 / Math.PI));
      if (relAngleDeg < 0) relAngleDeg += 360;

      const isCritical = distanceMeters <= 4.0;
      if (isCritical) this.criticalThreatCount++;

      // Compute 2D HUD pixel coordinates on the 320px compass circle
      const normalizedDist = Math.min(1.0, distanceMeters / this.maxDetectionRangeMeters);
      const pixelRadius = Math.round(this.compassRadiusPixels * normalizedDist);
      const hudX = +(Math.sin(relAngleRad) * pixelRadius).toFixed(1);
      const hudY = +(-Math.cos(relAngleRad) * pixelRadius).toFixed(1);

      return {
        id: threat.id,
        distanceMeters,
        relativeAngleDeg: relAngleDeg,
        isCritical,
        hudX,
        hudY,
        cssClass: isCritical ? 'threat-blip critical' : 'threat-blip'
      };
    }).filter(Boolean);

    return {
      totalTracked: this.trackedThreats.length,
      criticalCount: this.criticalThreatCount,
      blips: this.trackedThreats
    };
  }

  /**
   * Exports payload for rendering `.peripheral-threat-ring`.
   * @returns {Object}
   */
  getPeripheralCompassHudState() {
    return {
      active: this.trackedThreats.length > 0,
      compassRadiusPixels: this.compassRadiusPixels,
      criticalThreatCount: this.criticalThreatCount,
      hasImmediateFlanker: this.criticalThreatCount > 0,
      blips: [...this.trackedThreats],
      cssClass: this.trackedThreats.length > 0 
        ? 'peripheral-threat-ring active' 
        : 'peripheral-threat-ring'
    };
  }
}
