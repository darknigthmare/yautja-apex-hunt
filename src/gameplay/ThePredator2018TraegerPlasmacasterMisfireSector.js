/**
 * ThePredator2018TraegerPlasmacasterMisfireSector.js
 *
 * Chantier de Level Design 4 (v187) - The Predator (2018)
 * 1:1 Canonical Level Design: Traeger Salvaged Shoulder Plasmacaster Thermal Misfire
 *
 * Canonical Scene: Will Traeger equips a salvaged Yautja shoulder plasmacaster to his tactical harness.
 * In the dark Georgia forest, intense humidity and thermal backscatter confuse the targeting optic sensor.
 * Traeger fires, but the cannon pivots 180 degrees backward, vaporizing his own head in an ironic plasma misfire.
 */

export class ThePredator2018TraegerPlasmacasterMisfireSector {
  /**
   * @param {Object} options
   * @param {number} [options.plasmaBoltEnergyJoules=8200.0] Énergie du tir de plasma (J)
   * @param {number} [options.thermalBackscatterThreshold=0.75] Seuil d'inversion thermique du réticule
   */
  constructor(options = {}) {
    this.plasmaBoltEnergyJoules = options.plasmaBoltEnergyJoules ?? 8200.0;
    this.thermalBackscatterThreshold = options.thermalBackscatterThreshold ?? 0.75;

    // État runtime
    this.plasmacasterMounted = false;
    this.targetingOpticGlitched = false;
    this.pivotAngleDeg = 0.0; // 0° = vers l'avant, 180° = vers l'arrière
    this.misfireTriggered = false;
    this.traegerEliminated = false;
  }

  /**
   * Montage de l'arme extraterrestre sur le gilet pare-balles de Traeger
   */
  mountSalvagedPlasmacaster() {
    this.plasmacasterMounted = true;
    return {
      status: 'SALVAGED_PLASMACASTER_RIGGED_TO_HARNESS',
      weaponEnergyJoules: this.plasmaBoltEnergyJoules,
      uncalibratedAlienTech: true
    };
  }

  /**
   * Brouillage du capteur de visée par la fumée et l'humidité thermique
   * @param {number} atmosphericHumidityFactor
   */
  induceThermalOpticBackscatter(atmosphericHumidityFactor = 0.88) {
    if (!this.plasmacasterMounted) {
      return { success: false, reason: 'CANNON_NOT_MOUNTED' };
    }

    if (atmosphericHumidityFactor >= this.thermalBackscatterThreshold) {
      this.targetingOpticGlitched = true;
      this.pivotAngleDeg = 180.0; // Pivotement inversé vers la nuque

      return {
        success: true,
        status: 'OPTIC_SENSOR_THERMAL_BACKSCATTER_LOOP',
        pivotInvertedDeg: this.pivotAngleDeg,
        friendlyFireDangerCritical: true
      };
    }

    return {
      success: false,
      status: 'TARGETING_NORMAL'
    };
  }

  /**
   * Pression sur la gâchette déclenchant le tir fatal inversé
   */
  pullTriggerWithGlitchedOptic() {
    if (!this.targetingOpticGlitched) {
      return {
        success: true,
        status: 'STANDARD_FORWARD_PLASMA_SHOT_FIRED',
        angleDeg: 0.0
      };
    }

    this.misfireTriggered = true;
    this.traegerEliminated = true;

    return {
      success: true,
      status: 'CATASTROPHIC_BACKWARDS_MISFIRE_TRAEGER_VAPORIZED',
      plasmaEnergyJ: this.plasmaBoltEnergyJoules,
      ironicJusticeSecured: true,
      stargazerCommandLeaderDown: true,
      honorScoreGranted: 350
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'ThePredator2018TraegerPlasmacasterMisfireSector',
      plasmacasterMounted: this.plasmacasterMounted,
      targetingOpticGlitched: this.targetingOpticGlitched,
      pivotAngleDeg: this.pivotAngleDeg,
      misfireTriggered: this.misfireTriggered,
      traegerEliminated: this.traegerEliminated
    };
  }
}
