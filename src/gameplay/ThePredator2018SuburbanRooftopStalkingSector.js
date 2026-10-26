/**
 * ThePredator2018SuburbanRooftopStalkingSector.js
 *
 * Chantier de Level Design 2 (v187) - The Predator (2018)
 * 1:1 Canonical Level Design: Halloween Night Suburban Rooftop Traversal & Mask Homing
 *
 * Canonical Scene: On Halloween night in suburban Clarkston, Rory McKenna wears the Fugitive's bio-mask.
 * The Fugitive Predator leaps across asphalt-shingle house roofs (pitch 35°, elevation 7.5m),
 * tracking the bio-mask's telemetry frequency (915 MHz) while dodging Stargazer scout vans below.
 */

export class ThePredator2018SuburbanRooftopStalkingSector {
  /**
   * @param {Object} options
   * @param {number} [options.roofPitchDeg=35.0] Pente de toiture résidentielle (degrés)
   * @param {number} [options.roofElevationM=7.5] Hauteur moyenne des toits de pavillon (m)
   * @param {number} [options.maskHomingFreqMhz=915.0] Fréquence de balise du bio-masque (MHz)
   */
  constructor(options = {}) {
    this.roofPitchDeg = options.roofPitchDeg ?? 35.0;
    this.roofElevationM = options.roofElevationM ?? 7.5;
    this.maskHomingFreqMhz = options.maskHomingFreqMhz ?? 915.0;

    // État runtime
    this.rooftopLeapActive = false;
    this.roofTilesScrambled = false;
    this.maskSignalStrengthDbm = -85.0; // Signal faible au départ
    this.stargazerVansEvaded = 0;
    this.roryLocationLocated = false;
    this.stealthStalkingActive = true;
  }

  /**
   * Saut d'un toit résidentiel à un autre à travers les frondaisons d'arbres
   * @param {number} leapDistanceM Distance du saut (m)
   */
  executeRooftopLeap(leapDistanceM = 9.2) {
    this.rooftopLeapActive = true;
    this.roofTilesScrambled = true;

    return {
      status: 'ROOFTOP_LEAP_LANDED_ON_SHINGLES',
      elevationM: this.roofElevationM,
      leapDistanceM: leapDistanceM,
      roofPitchDeg: this.roofPitchDeg,
      asphaltGripSecure: true
    };
  }

  /**
   * Poursuite du signal radio du bio-masque porté par Rory
   * @param {number} proximityFactor Proximité (0.0 -> 1.0)
   */
  trackBioMaskSignal(proximityFactor = 0.8) {
    this.maskSignalStrengthDbm = -85.0 + proximityFactor * 55.0; // -85 -> -30 dBm (très fort)

    if (this.maskSignalStrengthDbm >= -40.0) {
      this.roryLocationLocated = true;
      return {
        status: 'MASK_TELEMETRY_PINPOINTED',
        signalDbm: this.maskSignalStrengthDbm,
        carrierFrequencyMhz: this.maskHomingFreqMhz,
        targetCoordinates: 'SUBURBAN_DRIVEWAY_HALLOWEEN_TRICK_OR_TREAT',
        readyForExtraction: true
      };
    }

    return {
      status: 'SIGNAL_HOMING_CLOSING_IN',
      signalDbm: this.maskSignalStrengthDbm
    };
  }

  /**
   * Évasion furtive au-dessus des fourgons tactiques Stargazer qui patrouillent
   */
  evadeStargazerStreetPatrol() {
    this.stargazerVansEvaded += 1;
    return {
      status: 'STARGAZER_VAN_PATROL_EVADED_OVERHEAD',
      totalEvaded: this.stargazerVansEvaded,
      stealthIntact: this.stealthStalkingActive,
      honorScoreGranted: 150
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'ThePredator2018SuburbanRooftopStalkingSector',
      rooftopLeapActive: this.rooftopLeapActive,
      roofElevationM: this.roofElevationM,
      maskSignalStrengthDbm: this.maskSignalStrengthDbm,
      stargazerVansEvaded: this.stargazerVansEvaded,
      roryLocationLocated: this.roryLocationLocated
    };
  }
}
