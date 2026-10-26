/**
 * ThePredator2018TransportBusConvoySector.js
 *
 * Chantier de Level Design 4 (v186) - The Predator (2018)
 * 1:1 Canonical Level Design: Highway Convoy Transport Bus Roof Combat
 *
 * Canonical Scene: The "Loonies" squad hijacks the military transport bus fleeing at 80 km/h (22.2 m/s).
 * The Fugitive Predator leaps onto the corrugated sheet metal roof, cutting inward with extended wristblades
 * while Nebraska, Coyle, and McKenna return fire through the roof panels with M249 SAW and 12-gauge buckshot.
 */

export class ThePredator2018TransportBusConvoySector {
  /**
   * @param {Object} options
   * @param {number} [options.convoySpeedKmh=80.0] Vitesse du convoi sur autoroute (km/h)
   * @param {number} [options.roofSheetMetalHp=250.0] Intégrité de la tôle de toiture du bus
   * @param {number} [options.looniesSquadCount=6] Effectif des vétérans dans le bus
   */
  constructor(options = {}) {
    this.convoySpeedKmh = options.convoySpeedKmh ?? 80.0;
    this.roofSheetMetalHp = options.roofSheetMetalHp ?? 250.0;
    this.looniesSquadCount = options.looniesSquadCount ?? 6;

    // Constante cinétique
    this.convoySpeedMs = this.convoySpeedKmh / 3.6; // 22.2 m/s

    // État runtime
    this.predatorOnRoof = false;
    this.roofSlashedOpen = false;
    this.busUnderFire = false;
    this.predatorKnockedOffRoof = false;
    this.convoyEscaped = false;
  }

  /**
   * Saut cinématique du Fugitive sur le toit du bus à 80 km/h
   */
  leapOntoBusRoof() {
    this.predatorOnRoof = true;
    return {
      status: 'PREDATOR_LANDED_ON_BUS_ROOF',
      relativeSpeedKmh: this.convoySpeedKmh,
      kineticLandingImpactJ: 4800.0,
      roofVibrationDecibels: 96.0
    };
  }

  /**
   * Tranchage de la tôle de toiture aux wristblades
   * @param {number} slashDamage
   */
  slashRoofSheetMetal(slashDamage = 130.0) {
    if (!this.predatorOnRoof) {
      return { success: false, reason: 'PREDATOR_NOT_ON_ROOF' };
    }

    this.roofSheetMetalHp = Math.max(0.0, this.roofSheetMetalHp - slashDamage);
    if (this.roofSheetMetalHp === 0.0) {
      this.roofSlashedOpen = true;
      return {
        success: true,
        status: 'BUS_ROOF_SEVERED_OPEN',
        cabinInteriorBreached: true,
        looniesExposed: true
      };
    }

    return {
      success: false,
      status: 'ROOF_DAMAGED_METAL_GROANING',
      remainingRoofHp: this.roofSheetMetalHp
    };
  }

  /**
   * Tir nourri des Loonies à travers le plafond (M249 SAW / Fusils calibre 12)
   * @param {number} totalRounds
   */
  looniesUpwardSuppressingFire(totalRounds = 80) {
    if (!this.predatorOnRoof) {
      return { success: false, reason: 'NO_TARGET_ON_ROOF' };
    }

    this.busUnderFire = true;
    if (totalRounds >= 60) {
      this.predatorOnRoof = false;
      this.predatorKnockedOffRoof = true;
      this.convoyEscaped = true;

      return {
        success: true,
        status: 'PREDATOR_BLOWN_OFF_ROOF_BY_CONCENTRATED_VOLLEY',
        roundsFired: totalRounds,
        predatorTumblesOntoHighway: true,
        convoyHighwayEscapeSecured: true
      };
    }

    return {
      success: false,
      status: 'VOLLEY_INSUFFICIENT_PREDATOR_HOLDS_GRIP',
      roundsFired: totalRounds
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'ThePredator2018TransportBusConvoySector',
      convoySpeedKmh: this.convoySpeedKmh,
      predatorOnRoof: this.predatorOnRoof,
      roofSlashedOpen: this.roofSlashedOpen,
      predatorKnockedOffRoof: this.predatorKnockedOffRoof,
      convoyEscaped: this.convoyEscaped
    };
  }
}
