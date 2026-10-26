/**
 * ThePredator2018ArkShipHullAscentSector.js
 *
 * Chantier de Level Design 1 (v188) - The Predator (2018) Ark Ship Hull Dogfight & Atmospheric Ascent
 * 1:1 Canonical Level Design:
 * - Sloped exterior aerodynamic hull of the cloaked Yautja Ark Ship ascending at 180 km/h.
 * - Exterior electromagnetic energy forcefield dome surrounding the vessel.
 * - High-velocity atmospheric wind-shear resistance and vertical G-force compensation.
 * - Dorsal plasma intake and sabotage of the primary forcefield shield generator using explosive charges.
 */

export class ThePredator2018ArkShipHullAscentSector {
  /**
   * @param {Object} options
   * @param {number} [options.airspeedKmh=180.0] Vitesse ascensionnelle de l'Ark Ship
   * @param {number} [options.altitudeM=1200.0] Altitude initiale de combat
   * @param {number} [options.shieldIntegrityKj=500.0] Intégrité du bouclier électromagnétique
   */
  constructor(options = {}) {
    this.airspeedKmh = options.airspeedKmh ?? 180.0;
    this.altitudeM = options.altitudeM ?? 1200.0;
    this.shieldIntegrityKj = options.shieldIntegrityKj ?? 500.0;

    // État runtime
    this.hullClingingActive = false;
    this.windShearResistanceFactor = 0.0;
    this.forcefieldOverloaded = false;
    this.shieldDisrupted = false;
    this.dorsalIntakeReached = false;
    this.explosiveChargeArmed = false;
    this.atmosphericTurbulenceG = 3.2;
  }

  /**
   * S'agripper à la coque inclinée de l'Ark Ship contre le vent relatif
   * @param {number} gripEfficiency Facteur d'adhérence magnétique ou manuelle (0.0 à 1.0)
   */
  clingToArkShipSlopedHull(gripEfficiency = 0.85) {
    this.hullClingingActive = true;
    this.windShearResistanceFactor = Math.min(1.0, Math.max(0.1, gripEfficiency));

    return {
      status: 'ARK_HULL_CLINGING_STABILIZED',
      airspeedKmh: this.airspeedKmh,
      altitudeM: this.altitudeM,
      dragCoefficient: 0.38,
      windResistanceFactor: this.windShearResistanceFactor,
      gForceToleranceSecured: true
    };
  }

  /**
   * Traverser la surface jusqu'à l'entrée de propulsion dorsale
   */
  reachDorsalIntakeConduit() {
    if (!this.hullClingingActive) {
      return { status: 'FAILED_UNSTABILIZED_ON_HULL', dorsalIntakeReached: false };
    }

    this.dorsalIntakeReached = true;
    this.altitudeM += 450.0; // Poursuite de l'ascension

    return {
      status: 'DORSAL_INTAKE_CONDUIT_REACHED',
      altitudeM: this.altitudeM,
      plasmaIntakeHeatKelvin: 850.0,
      exposedGeneratorVulnerable: true
    };
  }

  /**
   * Surcharger le générateur de bouclier électromagnétique à l'aide d'explosifs
   * @param {number} explosiveChargeKg Masse d'explosif C4 / grenade plasmique amorcée
   */
  overloadForcefieldShieldGenerator(explosiveChargeKg = 2.5) {
    if (!this.dorsalIntakeReached) {
      return { status: 'FAILED_DORSAL_GENERATOR_UNREACHED', success: false };
    }

    this.explosiveChargeArmed = true;
    const damageDealtKj = explosiveChargeKg * 220.0;
    this.shieldIntegrityKj = Math.max(0, this.shieldIntegrityKj - damageDealtKj);

    if (this.shieldIntegrityKj <= 0) {
      this.forcefieldOverloaded = true;
      this.shieldDisrupted = true;
    }

    return {
      status: this.forcefieldOverloaded ? 'ARK_FORCEFIELD_SHIELD_COLLAPSED' : 'ARK_SHIELD_DAMAGED',
      success: this.forcefieldOverloaded,
      remainingShieldKj: this.shieldIntegrityKj,
      shieldDisrupted: this.shieldDisrupted,
      hullExposedToSwampCrashTrajectory: this.forcefieldOverloaded
    };
  }

  /**
   * Stabiliser la trajectoire aérodynamique pendant la descente d'urgence
   * @param {number} deltaG Variation de gravité ressentie
   */
  stabilizeAscentAerodynamics(deltaG = 1.5) {
    this.atmosphericTurbulenceG = Math.max(1.0, this.atmosphericTurbulenceG - deltaG * 0.5);

    return {
      status: 'AERODYNAMIC_STABILIZATION_ACHIEVED',
      currentTurbulenceG: this.atmosphericTurbulenceG,
      altitudeDescentWarning: true,
      swampCrashVectorProjected: true
    };
  }
}
