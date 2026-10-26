/**
 * ThePredator2018ShipForcefieldClimaxSector.js
 *
 * Chantier de Level Design 6 (v186) - The Predator (2018)
 * 1:1 Canonical Level Design: Escaping Scout Ship Forcefield Dome & Turbine Sacrifice
 *
 * Canonical Scene: The climax battle takes place on the hull of the fleeing Yautja scout ship at 1,200m altitude.
 * The Upgrade Predator activates the ship's perimeter energy shield. Nebraska leaps into the intake turbine
 * to disrupt the gravimetric drive, and McKenna uses the Fugitive gauntlet's energy slice beam to amputate
 * the Upgrade Predator's cannon arm, bringing the titan down.
 */

export class ThePredator2018ShipForcefieldClimaxSector {
  /**
   * @param {Object} options
   * @param {number} [options.shipAltitudeM=1200.0] Altitude du vaisseau de fuite (m)
   * @param {number} [options.forcefieldEnergyBarrierHp=500.0] Intégrité du champ de force énergétique
   * @param {number} [options.turbineThrustKn=380.0] Poussée de la turbine gravimétrique (kN)
   */
  constructor(options = {}) {
    this.shipAltitudeM = options.shipAltitudeM ?? 1200.0;
    this.forcefieldEnergyBarrierHp = options.forcefieldEnergyBarrierHp ?? 500.0;
    this.turbineThrustKn = options.turbineThrustKn ?? 380.0;

    // État runtime
    this.shipInFlight = true;
    this.forcefieldActive = true;
    this.nebraskaSacrificed = false;
    this.turbineDisrupted = false;
    this.upgradeTitanAmputated = false;
    this.upgradeTitanDefeated = false;
  }

  /**
   * Activation du champ de force d'énergie du vaisseau par l'Upgrade
   */
  activateHullForcefield() {
    this.forcefieldActive = true;
    return {
      status: 'HULL_FORCEFIELD_ENERGIZED',
      barrierHp: this.forcefieldEnergyBarrierHp,
      hullPerimeterSealed: true
    };
  }

  /**
   * Sacrifice héroïque de Nebraska sautant dans la turbine pour stopper le vaisseau
   */
  executeNebraskaTurbineSacrifice() {
    this.nebraskaSacrificed = true;
    this.turbineDisrupted = true;
    this.forcefieldActive = false; // La panne moteur fait sauter le champ de force
    this.forcefieldEnergyBarrierHp = 0.0;

    return {
      status: 'NEBRASKA_HEROIC_TURBINE_SACRIFICE_EXECUTED',
      turbineBlown: true,
      shipForcedToCrashDescent: true,
      forcefieldDeactivated: true,
      honorScoreReward: 400
    };
  }

  /**
   * Amputation des membres de l'Upgrade Predator au faisceau d'énergie du gantelet
   */
  amputateUpgradeTitanLimbs() {
    if (this.forcefieldActive) {
      return { success: false, reason: 'FORCEFIELD_BLOCKS_ACCESS_TO_TITAN' };
    }

    this.upgradeTitanAmputated = true;
    this.upgradeTitanDefeated = true;

    return {
      success: true,
      status: 'UPGRADE_TITAN_DISMEMBERED_AND_EXECUTED',
      armMountedCannonSevered: true,
      chitinArmorShattered: true,
      titanSlain: true,
      predatorKillerSuitCasketUnlocked: true
    };
  }

  /**
   * Rapport télémétrique
   */
  getTelemetryReport() {
    return {
      sectorName: 'ThePredator2018ShipForcefieldClimaxSector',
      shipAltitudeM: this.shipAltitudeM,
      forcefieldActive: this.forcefieldActive,
      nebraskaSacrificed: this.nebraskaSacrificed,
      turbineDisrupted: this.turbineDisrupted,
      upgradeTitanDefeated: this.upgradeTitanDefeated
    };
  }
}
