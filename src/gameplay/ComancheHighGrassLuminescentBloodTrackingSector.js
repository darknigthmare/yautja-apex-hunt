/**
 * ComancheHighGrassLuminescentBloodTrackingSector.js
 * 
 * Prey (2022) - Great Plains high prairie grass sector.
 * Simulates tall wind-swaying grass (1.6m), fluorescent emerald Yautja blood droplet trails,
 * ultraviolet bioluminescent tracking modes, crouching stealth cover, and dynamic grass fire propagation.
 */

export class ComancheHighGrassLuminescentBloodTrackingSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='comanche-high-grass-01']
   * @param {number} [options.grassHeightM=1.6]
   * @param {number} [options.windSpeedMps=6.5]
   * @param {number} [options.emeraldBloodStainsCount=8]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'comanche-high-grass-01';
    this.grassHeightM = options.grassHeightM !== undefined ? options.grassHeightM : 1.6;
    this.windSpeedMps = options.windSpeedMps !== undefined ? options.windSpeedMps : 6.5;
    this.emeraldBloodStainsCount = options.emeraldBloodStainsCount !== undefined ? options.emeraldBloodStainsCount : 8;

    this.bloodTrailDiscovered = false;
    this.grassFireActive = false;
    this.burntAreaM2 = 0;
  }

  /**
   * Scans the tall grass for glowing green Yautja blood trails using bio-mask vision modes.
   * @param {string} visorMode - 'ULTRAVIOLET', 'THERMAL', 'OPTICAL'
   * @returns {Object} Tracking detection telemetry
   */
  scanEmeraldBloodTrails(visorMode = 'ULTRAVIOLET') {
    const isUvMode = visorMode === 'ULTRAVIOLET';
    const luminescenceVisibility = isUvMode ? 0.98 : (visorMode === 'THERMAL' ? 0.45 : 0.2);

    if (luminescenceVisibility > 0.6) {
      this.bloodTrailDiscovered = true;
      return {
        bloodTrailDiscovered: true,
        luminescenceVisibility,
        stainsCount: this.emeraldBloodStainsCount,
        glowColorHex: '#00ff66',
        targetHeadingDeg: 42.5,
        trailAgeMinutes: 12
      };
    }

    return {
      bloodTrailDiscovered: false,
      luminescenceVisibility,
      stainsCount: 0,
      reason: 'INSUFFICIENT_VISOR_WAVELENGTH'
    };
  }

  /**
   * Evaluates crouching stealth and concealment within the tall prairie grass.
   * @param {boolean} crouchActive
   * @param {number} movementSpeedMps
   * @returns {Object} Stalking stealth evaluation
   */
  stalkInHighGrass(crouchActive = true, movementSpeedMps = 1.8) {
    if (!crouchActive) {
      return {
        concealed: false,
        stealthBonus: 0.1,
        silhouetteVisible: true,
        rustleAudioDb: Math.round(35 + movementSpeedMps * 6.5)
      };
    }

    // Crouching under 1.6m grass provides heavy optical cover
    const isSlowStalk = movementSpeedMps <= 2.2;
    const stealthBonus = isSlowStalk ? 0.85 : 0.55;
    const rustleAudioDb = Math.round(22 + movementSpeedMps * 4.2);

    return {
      concealed: true,
      stealthBonus,
      silhouetteVisible: !isSlowStalk,
      rustleAudioDb,
      canPounceAmbush: true
    };
  }

  /**
   * Ignites dry prairie grass and calculates flame spread driven by the atmospheric wind vector.
   * @param {number} originX
   * @param {{x: number, z: number}} windVector
   * @param {number} [durationSec=5.0]
   * @returns {Object} Grass fire telemetry
   */
  igniteGrassFire(originX = 0, windVector = { x: 1, z: 0 }, durationSec = 5.0) {
    this.grassFireActive = true;
    const windMagnitude = Math.hypot(windVector.x, windVector.z) || 1.0;
    const spreadRateMps = +(1.2 + windMagnitude * 0.45).toFixed(2);
    const addedArea = Math.round(spreadRateMps * durationSec * 14.5);
    this.burntAreaM2 += addedArea;

    return {
      grassFireActive: true,
      spreadRateMps,
      burntAreaM2: this.burntAreaM2,
      smokeThermalSaturation: 0.92,
      flameTempCelsius: 780
    };
  }

  /**
   * Returns current status of the prairie grass sector.
   * @returns {Object}
   */
  getGrassSectorState() {
    return {
      sectorId: this.sectorId,
      grassHeightM: this.grassHeightM,
      windSpeedMps: this.windSpeedMps,
      emeraldBloodStainsCount: this.emeraldBloodStainsCount,
      bloodTrailDiscovered: this.bloodTrailDiscovered,
      grassFireActive: this.grassFireActive,
      burntAreaM2: this.burntAreaM2
    };
  }
}
