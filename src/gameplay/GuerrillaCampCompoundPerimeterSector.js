/**
 * GuerrillaCampCompoundPerimeterSector.js
 * 
 * Predator (1987) - Val Verde Rebel Guerrilla Camp Fortified Compound.
 * Simulates the heavily defended jungle insurgent base assaulted by Dutch's commando unit:
 * - Corrugated tin roof barracks providing light penetrable bullet cover
 * - 55-gallon volatile fuel drum stockpiles prone to chain explosive eruptions (920 blast damage, 750 °C)
 * - Fortified sandbag pillbox machine-gun nests with narrow embrasures (high ballistic absorption)
 * - Barbed razor wire perimeter fences and elevated wooden guard watchtowers (10.0m).
 */

export class GuerrillaCampCompoundPerimeterSector {
  /**
   * @param {Object} options
   * @param {string} [options.compoundId='val-verde-guerrilla-camp-01']
   * @param {number} [options.fuelDrumCount=8]
   * @param {number} [options.sandbagPillboxIntegrity=1.0]
   */
  constructor(options = {}) {
    this.compoundId = options.compoundId || 'val-verde-guerrilla-camp-01';
    this.fuelDrumCount = options.fuelDrumCount || 8;
    this.sandbagPillboxIntegrity = options.sandbagPillboxIntegrity || 1.0;

    this.fuelDrumsDetonated = false;
    this.watchtowerElevationM = 10.0;
    this.razorWirePerimeterArmed = true;
  }

  /**
   * Triggers a catastrophic chain explosion of the fuel drum cache with a plasma bolt or grenade.
   * Creates an expanding fireball that levels wooden barracks and burns everything within 12.5m.
   * @param {boolean} plasmaBoltIgnition
   * @returns {Object} Fuel drum detonation telemetry
   */
  detonateFuelDrumCache(plasmaBoltIgnition = true) {
    if (this.fuelDrumsDetonated) {
      return { detonated: false, reason: 'FUEL_DRUMS_ALREADY_EXPLODED' };
    }

    this.fuelDrumsDetonated = true;
    const blastRadiusM = 12.5;
    const concussionDamage = 460;
    const thermalFlameDamage = 460;
    const totalBlastDamage = concussionDamage + thermalFlameDamage;
    const fireballTempC = 750.0;
    const barracksLevelledCount = 2;

    return {
      detonated: true,
      fuelDrumCount: this.fuelDrumCount,
      blastRadiusM,
      totalBlastDamage,
      fireballTempC,
      barracksLevelledCount,
      shockwaveAcousticDb: 124,
      clearingSmokeObscurationSec: 16.0
    };
  }

  /**
   * Resolves ballistic or plasma fire directed at a sandbag pillbox machine gun position.
   * Sandbags absorb up to 850 Joules of kinetic energy, dissipating bullets into sand sprays.
   * @param {number} incomingEnergyJoules
   * @returns {Object} Sandbag pillbox absorption telemetry
   */
  resolveSandbagPillboxCover(incomingEnergyJoules = 450.0) {
    const sandbagCapacityJoules = 850.0;
    const absorbedEnergy = Math.min(sandbagCapacityJoules, incomingEnergyJoules);
    const penetrated = incomingEnergyJoules > sandbagCapacityJoules;

    this.sandbagPillboxIntegrity = Math.max(0, this.sandbagPillboxIntegrity - (incomingEnergyJoules / 2500.0));
    const sandBurstSprayParticles = 35;

    return {
      sandbagPillboxIntegrityRemaining: Number(this.sandbagPillboxIntegrity.toFixed(2)),
      absorbedEnergyJoules: absorbedEnergy,
      penetrated,
      sandBurstSprayParticles,
      occupantProtected: !penetrated,
      pillboxCoverRating: 'SUPERIOR_HEAVY_BALLISTIC'
    };
  }

  /**
   * Infiltrates the 10m high wooden guard watchtower via rear support struts.
   * @returns {Object} Watchtower infiltration telemetry
   */
  infiltrateGuardWatchtower() {
    const compoundOverviewSightlineM = 120.0;
    const perimeterGuardSpottingChancePct = 95.0;

    return {
      success: true,
      watchtowerElevationM: this.watchtowerElevationM,
      compoundOverviewSightlineM,
      perimeterGuardSpottingChancePct,
      aerialSniperNestSecured: true,
      woodenFloorCreakDb: 35
    };
  }
}
