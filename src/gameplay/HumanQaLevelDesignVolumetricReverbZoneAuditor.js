/**
 * HumanQaLevelDesignVolumetricReverbZoneAuditor.js
 * 
 * Human Playtester QA Audit #5: Dynamic Volumetric Ceiling Clearance & Reverb Modulation.
 * Replaces static monolithic audio presets with dynamic environmental acoustic sizing:
 * casts vertical clearance raycasts to detect ceiling height (2.2m mine tunnel up to 45m pyramid hall),
 * calculates acoustic enclosure volume, and dynamically modulates reverb decay times and wet mixes.
 */

export class HumanQaLevelDesignVolumetricReverbZoneAuditor {
  /**
   * @param {Object} options
   * @param {number} [options.baseDecaySec=0.4]
   * @param {number} [options.maxDecaySec=3.2]
   */
  constructor(options = {}) {
    this.baseDecaySec = options.baseDecaySec || 0.4;
    this.maxDecaySec = options.maxDecaySec || 3.2;

    this.currentCeilingHeightM = 2.5;
    this.currentRoomAreaM2 = 50.0;
    this.currentVolumeM3 = 125.0;
    this.decayTimeSec = this.baseDecaySec;
    this.wetMixRatio = 0.15;
  }

  /**
   * Evaluates vertical raycast ceiling clearance and re-computes acoustic parameters.
   * @param {number} raycastHitDistanceM - Distance to ceiling or sky (meters)
   * @param {number} [roomAreaM2=100.0] - Estimated floor footprint
   * @returns {Object} Acoustic volume telemetry
   */
  evaluateCeilingClearance(raycastHitDistanceM = 2.5, roomAreaM2 = 100.0) {
    this.currentCeilingHeightM = Math.max(1.8, Number(raycastHitDistanceM) || 2.5);
    this.currentRoomAreaM2 = Math.max(10.0, Number(roomAreaM2) || 100.0);
    this.currentVolumeM3 = Math.round(this.currentCeilingHeightM * this.currentRoomAreaM2);

    // Height ratio between 2.0m (tight crawlway) and 35m (grand vault)
    const heightRatio = Math.min(1.0, Math.max(0, (this.currentCeilingHeightM - 2.0) / 33.0));
    this.decayTimeSec = +(this.baseDecaySec + heightRatio * (this.maxDecaySec - this.baseDecaySec)).toFixed(2);
    this.wetMixRatio = +(Math.min(0.75, 0.15 + heightRatio * 0.55)).toFixed(2);

    const isCavernous = this.currentCeilingHeightM >= 15.0;

    return {
      ceilingHeightMeters: this.currentCeilingHeightM,
      roomAreaM2: this.currentRoomAreaM2,
      volumeM3: this.currentVolumeM3,
      decayTimeSec: this.decayTimeSec,
      wetMixRatio: this.wetMixRatio,
      isCavernous,
      acousticArchetype: isCavernous ? 'GRAND_CAVERNOUS_VAULT' : (this.currentCeilingHeightM <= 4.0 ? 'CONFINED_CORRIDOR' : 'MEDIUM_CHAMBER')
    };
  }

  /**
   * Retrieves the current acoustic profile for Web Audio convolver/reverb nodes.
   * @returns {Object}
   */
  getAcousticReverbProfile() {
    return {
      ceilingHeightMeters: this.currentCeilingHeightM,
      decayTimeSec: this.decayTimeSec,
      wetMixRatio: this.wetMixRatio,
      earlyReflectionMs: Math.round(2 * (this.currentCeilingHeightM / 343.0) * 1000),
      highFrequencyRolloffHz: Math.max(1200, Math.round(8000 / (1 + this.currentCeilingHeightM * 0.08)))
    };
  }

  /**
   * Audits a series of map level sectors to guarantee proper reverb scaling.
   * @param {Array<{id: string, heightM: number, areaM2: number}>} zones
   * @returns {Object} Zone audit evaluation
   */
  auditMapReverbZones(zones = []) {
    if (!Array.isArray(zones)) return { totalAudited: 0, auditedZones: [] };

    const auditedZones = zones.map(zone => {
      const evalResult = this.evaluateCeilingClearance(zone.heightM, zone.areaM2);
      return {
        zoneId: zone.id,
        ...evalResult
      };
    });

    return {
      totalAudited: zones.length,
      auditedZones
    };
  }
}
