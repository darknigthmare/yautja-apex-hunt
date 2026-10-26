/**
 * Predators2010HellHoundPhalanxDefenseSector.js
 *
 * Chantier de Level Design 2 (v185) - Predators (2010)
 * 1:1 Canonical Level Design: Tracker Horn Call & 360-Degree Defensive Phalanx
 *
 * Canonical Scene: The Tracker Predator blows the bone hunting horn (118 dB, 430 Hz).
 * A pack of 6 red-eyed, armored Hell-Hounds charges through the razor-grass in a pincer formation.
 * Nikolai opens fire with his heavy minigun (3,000 RPM) while the squad forms a circular back-to-back
 * 360-degree defensive perimeter phalanx to repel the charge.
 */

export class Predators2010HellHoundPhalanxDefenseSector {
  /**
   * @param {Object} options
   * @param {number} [options.hornDecibels=118.0] Volume de la corne de chasse (dB)
   * @param {number} [options.hellHoundsCount=6] Nombre de molosses alien dans la meute
   * @param {number} [options.phalanxPerimeterRadiusM=6.5] Rayon du périmètre défensif en cercle (m)
   */
  constructor(options = {}) {
    this.hornDecibels = options.hornDecibels ?? 118.0;
    this.hellHoundsCount = options.hellHoundsCount ?? 6;
    this.phalanxPerimeterRadiusM = options.phalanxPerimeterRadiusM ?? 6.5;

    // État runtime
    this.hornBlown = false;
    this.packCharging = false;
    this.phalanxFormed = false;
    this.minigunFiring = false;
    this.houndsEliminated = 0;
    this.squadIntegrityPct = 100.0;
  }

  /**
   * Sonnerie de la corne de chasse du Tracker Predator
   */
  soundHuntingHorn() {
    this.hornBlown = true;
    this.packCharging = true;

    return {
      status: 'TRACKER_HORN_BLAST_SOUNDED',
      frequencyHz: 430.0,
      soundIntensityDb: this.hornDecibels,
      houndsReleasedCount: this.hellHoundsCount,
      chargePattern: 'PINCER_FLANKING_ASSAULT'
    };
  }

  /**
   * Formation en cercle dos-à-dos de l'escouade (Phalange défensive à 360°)
   */
  formDefensivePhalanx() {
    this.phalanxFormed = true;
    return {
      status: '360_DEFENSIVE_PHALANX_FORMED',
      radiusM: this.phalanxPerimeterRadiusM,
      crossfireCovered: true,
      flankVulnerabilityNegated: true
    };
  }

  /**
   * Tir de suppression lourd au minigun de Nikolai
   * @param {number} roundsFired
   */
  fireMinigunSuppressionBarrage(roundsFired = 350) {
    if (!this.packCharging) {
      return { success: false, reason: 'NO_ACTIVE_TARGETS_IN_RANGE' };
    }

    this.minigunFiring = true;
    const eliminated = Math.min(this.hellHoundsCount - this.houndsEliminated, Math.floor(roundsFired / 100));
    this.houndsEliminated += eliminated;

    const remaining = this.hellHoundsCount - this.houndsEliminated;

    if (remaining === 0) {
      this.packCharging = false;
      return {
        success: true,
        status: 'HELL_HOUND_PACK_COMPLETELY_REPELLED',
        houndsKilled: this.houndsEliminated,
        phalanxHeld: this.phalanxFormed,
        trackerRetreatsToTrees: true
      };
    }

    return {
      success: true,
      status: 'SUPPRESSION_BARRAGE_ACTIVE',
      houndsEliminated: this.houndsEliminated,
      houndsRemaining: remaining,
      muzzleFlashLux: 12500.0
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'Predators2010HellHoundPhalanxDefenseSector',
      hornBlown: this.hornBlown,
      packCharging: this.packCharging,
      phalanxFormed: this.phalanxFormed,
      houndsEliminated: this.houndsEliminated,
      houndsRemaining: this.hellHoundsCount - this.houndsEliminated,
      squadIntegrityPct: this.squadIntegrityPct
    };
  }
}
