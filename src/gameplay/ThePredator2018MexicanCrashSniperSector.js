/**
 * ThePredator2018MexicanCrashSniperSector.js
 *
 * Chantier de Level Design 1 (v186) - The Predator (2018)
 * 1:1 Canonical Level Design: Mexican Jungle Escape Pod Crash & Hostage Sniper Ambush
 *
 * Canonical Scene: Quinn McKenna's covert sniper operation in the Mexican jungle is interrupted when
 * the Fugitive Predator's damaged pod crashes through the canopy (velocity 180 m/s). The Fugitive uncloaks,
 * deflects incoming 7.62mm fire with wrist gauntlets, and McKenna secures the alien bio-mask and gauntlet
 * before retreating into the foliage.
 */

export class ThePredator2018MexicanCrashSniperSector {
  /**
   * @param {Object} options
   * @param {number} [options.podEntrySpeedMs=180.0] Vitesse d'impact de la capsule de survie (m/s)
   * @param {number} [options.craterRadiusM=14.0] Rayon du cratère d'impact incandescent (m)
   * @param {number} [options.sniperDistanceM=95.0] Distance de tir de McKenna (m)
   */
  constructor(options = {}) {
    this.podEntrySpeedMs = options.podEntrySpeedMs ?? 180.0;
    this.craterRadiusM = options.craterRadiusM ?? 14.0;
    this.sniperDistanceM = options.sniperDistanceM ?? 95.0;

    // État runtime
    this.podCrashed = false;
    this.fugitiveUncloaked = false;
    this.bulletDeflected = false;
    this.salvagedBioMask = false;
    this.salvagedGauntlet = false;
    this.mckennaEvadedIntoJungle = false;
  }

  /**
   * Impact cinématique de la capsule de sauvetage à travers la canopée
   */
  triggerEscapePodCrash() {
    this.podCrashed = true;
    const kineticEnergyJoules = 0.5 * 2400.0 * Math.pow(this.podEntrySpeedMs, 2); // ~3.88e7 J

    return {
      status: 'ESCAPE_POD_CRASHED_INTO_JUNGLE',
      entryVelocityMs: this.podEntrySpeedMs,
      craterRadiusM: this.craterRadiusM,
      kineticEnergyJoules: kineticEnergyJoules,
      atmosphericShockwaveDb: 138.0
    };
  }

  /**
   * Sortie du Fugitive Predator et désactivation du camouflage actif
   */
  emergeFugitivePredator() {
    if (!this.podCrashed) {
      return { success: false, reason: 'POD_HAS_NOT_CRASHED' };
    }

    this.fugitiveUncloaked = true;
    return {
      success: true,
      status: 'FUGITIVE_EMERGES_UNCLOAKED',
      biomaskActive: true,
      shoulderCannonTracking: true
    };
  }

  /**
   * Tir de sniper de McKenna et déviation par le gantelet du Fugitive
   * @param {number} bulletCaliberMm Calibre de la balle (ex: 7.62)
   */
  fireSniperShotAtFugitive(bulletCaliberMm = 7.62) {
    if (!this.fugitiveUncloaked) {
      return { success: false, reason: 'TARGET_CONCEALED_OR_IN_POD' };
    }

    this.bulletDeflected = true;
    return {
      success: true,
      status: 'SNIPER_ROUND_DEFLECTED_BY_WRIST_GAUNTLET',
      ricochetDecibels: 114.0,
      fugitiveStaggeredSeconds: 0.8,
      gearDropEligible: true
    };
  }

  /**
   * Récupération du bio-masque et du gantelet tombés au sol par McKenna
   */
  salvageFugitiveTechAndEvade() {
    if (!this.bulletDeflected) {
      return { success: false, reason: 'PREDATOR_ALERT_GEAR_NOT_DROPPED' };
    }

    this.salvagedBioMask = true;
    this.salvagedGauntlet = true;
    this.mckennaEvadedIntoJungle = true;

    return {
      success: true,
      status: 'TECH_SALVAGED_MCKENNA_EVADED',
      salvagedItems: ['yautja_biomask_fugitive', 'yautja_wrist_gauntlet_tracker'],
      mailedToPostOfficeBox: true, // Élément canonique du film (envoi postal aux USA)
      honorScoreGranted: 220
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'ThePredator2018MexicanCrashSniperSector',
      podCrashed: this.podCrashed,
      fugitiveUncloaked: this.fugitiveUncloaked,
      bulletDeflected: this.bulletDeflected,
      salvagedBioMask: this.salvagedBioMask,
      salvagedGauntlet: this.salvagedGauntlet,
      mckennaEvaded: this.mckennaEvadedIntoJungle
    };
  }
}
