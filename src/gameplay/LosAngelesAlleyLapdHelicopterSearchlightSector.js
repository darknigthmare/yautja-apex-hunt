/**
 * LosAngelesAlleyLapdHelicopterSearchlightSector.js
 * 
 * Predator 2 (1990) - Narrow Los Angeles alleyway & rooftop fire escape sector.
 * Simulates intense LAPD helicopter Xenon searchlights (30,000,000 candlepower),
 * smoke grenade dispersion, shadow zone concealment, fire escape vertical traversal,
 * and stealthy ritual decapitation trophy collection under helicopter spotlight sweeps.
 */

export class LosAngelesAlleyLapdHelicopterSearchlightSector {
  /**
   * @param {Object} options
   * @param {string} [options.alleyId='la-alley-lapd-01']
   * @param {number} [options.helicopterSearchlightLumen=30000000]
   * @param {number} [options.shadowZonesCount=5]
   * @param {number} [options.smokeCoverDensity=0.65]
   * @param {boolean} [options.fireEscapeAccessible=true]
   */
  constructor(options = {}) {
    this.alleyId = options.alleyId || 'la-alley-lapd-01';
    this.helicopterSearchlightLumen = options.helicopterSearchlightLumen || 30000000;
    this.shadowZonesCount = options.shadowZonesCount !== undefined ? options.shadowZonesCount : 5;
    this.smokeCoverDensity = options.smokeCoverDensity !== undefined ? options.smokeCoverDensity : 0.65;
    this.fireEscapeAccessible = options.fireEscapeAccessible !== undefined ? options.fireEscapeAccessible : true;

    this.hunterVerticalHeightM = 0.0;
    this.searchlightTrackingPlayer = false;
    this.decapitationTrophiesClaimed = 0;
  }

  /**
   * Evaluates player exposure to the sweeping helicopter spotlight beam.
   * @param {{x: number, y: number, z: number}} playerPos
   * @param {boolean} inShadowZone - True if protected by fire escape or dumpster shadow
   * @returns {Object} Glare and stealth exposure telemetry
   */
  evaluateSearchlightExposure(playerPos = { x: 0, y: 0, z: 0 }, inShadowZone = false) {
    if (inShadowZone) {
      this.searchlightTrackingPlayer = false;
      return {
        exposed: false,
        incidentLux: 25,
        cloakDisrupted: false,
        inShadowZone: true,
        glareFactor: 0.05
      };
    }

    // Direct exposure to beam
    const smokeAttenuation = Math.max(0.2, 1.0 - this.smokeCoverDensity);
    const incidentLux = Math.round(85000 * smokeAttenuation);
    const glareFactor = +(incidentLux / 85000).toFixed(2);
    this.searchlightTrackingPlayer = glareFactor > 0.45;

    return {
      exposed: true,
      incidentLux,
      cloakDisrupted: glareFactor > 0.5,
      inShadowZone: false,
      glareFactor,
      thermalVisorBlinded: glareFactor > 0.6
    };
  }

  /**
   * Climbs fire escape ladders to escape ground-level searchlight sweeps.
   * @param {number} ascentDeltaM
   * @returns {Object} Vertical climbing status
   */
  climbFireEscapeLadders(ascentDeltaM = 3.5) {
    if (!this.fireEscapeAccessible) {
      return { climbed: false, reason: 'FIRE_ESCAPE_BLOCKED' };
    }

    this.hunterVerticalHeightM = +(this.hunterVerticalHeightM + ascentDeltaM).toFixed(1);
    const reachedRooftopGargoyle = this.hunterVerticalHeightM >= 18.0;

    return {
      climbed: true,
      hunterVerticalHeightM: this.hunterVerticalHeightM,
      reachedRooftopGargoyle,
      outOfStreetSearchlightBeam: this.hunterVerticalHeightM > 6.0
    };
  }

  /**
   * Executes a ritual trophy skull decapitation while concealed in shadow.
   * @param {Object} targetEntity
   * @param {boolean} inShadowZone
   * @returns {Object} Decapitation outcome
   */
  executeRitualDecapitationInShadow(targetEntity = { health: 0 }, inShadowZone = true) {
    if (!inShadowZone && this.searchlightTrackingPlayer) {
      return {
        success: false,
        reason: 'EXPOSED_TO_SEARCHLIGHT_SNIPERS',
        trophyClaimed: false
      };
    }

    this.decapitationTrophiesClaimed++;
    return {
      success: true,
      trophyClaimed: true,
      trophyId: 'EL_SCORPIO_GOLD_TOOTH_SKULL',
      honorBonus: 400,
      helicopterAlertTriggered: false,
      totalClaimed: this.decapitationTrophiesClaimed
    };
  }

  /**
   * Returns current alleyway status.
   * @returns {Object}
   */
  getAlleyStatus() {
    return {
      alleyId: this.alleyId,
      hunterVerticalHeightM: this.hunterVerticalHeightM,
      searchlightTrackingPlayer: this.searchlightTrackingPlayer,
      smokeCoverDensity: this.smokeCoverDensity,
      decapitationTrophiesClaimed: this.decapitationTrophiesClaimed
    };
  }
}
