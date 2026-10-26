/**
 * KillerOfKillers1609CastleMoatInfiltrationSector.js
 *
 * Chantier de Level Design 2 (v196) - Predator: Killer of Killers (2025)
 * Segment 2 (Part III): 1609 Feudal Castle Moat Infiltration & Ishigaki Wall Climb
 * 1:1 Canonical Level Design:
 * - Stone moat (water depth 2.4m) circling the keep, crossed by hollow-reed breathing (mizugumo water spiders).
 * - Ishigaki dry-stone wall (11m) scaled with iron tekko-kagi climbing claws.
 * - Dodging archer watch rotations on the yagura corner turret (28s cycle).
 */

export class KillerOfKillers1609CastleMoatInfiltrationSector {
  /**
   * @param {Object} options
   * @param {number} [options.moatDepthM=2.4] Profondeur des douves (m)
   * @param {number} [options.ishigakiHeightM=11.0] Hauteur du mur de pierre (m)
   */
  constructor(options = {}) {
    this.moatDepthM = options.moatDepthM ?? 2.4;
    this.ishigakiHeightM = options.ishigakiHeightM ?? 11.0;

    this.moatCrossed = false;
    this.wallScaled = false;
    this.archerGapExploited = false;
    this.keepBreached = false;
  }

  crossMoatWithReedBreathingTube() {
    this.moatCrossed = true;
    return {
      status: 'MOAT_CROSSED_WITH_REED_BREATHING_TUBE',
      moatDepthM: this.moatDepthM,
      submergedSeconds: 42.0,
      rippleSignatureSuppressed: true
    };
  }

  scaleIshigakiWallWithTekkoKagi() {
    if (!this.moatCrossed) {
      return { status: 'FAILED_MOAT_NOT_CROSSED', success: false };
    }
    this.wallScaled = true;
    return {
      status: 'ISHIGAKI_WALL_SCALED_WITH_TEKKO_KAGI',
      wallHeightM: this.ishigakiHeightM,
      climbTimeSec: 38.0,
      handholdsBetweenStones: true
    };
  }

  exploitArcherWatchRotationGap(cycleSeconds = 28.0) {
    if (!this.wallScaled) {
      return { status: 'FAILED_NOT_ON_WALL', success: false };
    }
    this.archerGapExploited = true;
    return {
      status: 'ARCHER_WATCH_ROTATION_GAP_EXPLOITED',
      cycleSeconds,
      blindWindowSeconds: 6.5,
      yaguraTurretBypassed: true
    };
  }

  breachKeepThroughRoofTileHatch() {
    if (!this.archerGapExploited) {
      return { status: 'FAILED_WATCH_ALERT', success: false };
    }
    this.keepBreached = true;
    return {
      status: 'KEEP_BREACHED_THROUGH_ROOF_TILE_HATCH',
      entryPoint: 'KAWARA_ROOF_HATCH',
      honorScoreGranted: 300
    };
  }
}
