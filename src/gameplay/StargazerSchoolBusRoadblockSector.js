/**
 * StargazerSchoolBusRoadblockSector.js
 * 
 * The Predator (2018) - Stargazer Georgia Forest Roadblock & School Bus Fortification.
 * Simulates the hijacked school bus bunker:
 * roof-mounted Browning M2 .50 BMG heavy machine gun turret firing 750 rounds/min,
 * armor-piercing kinetic rounds, dual 150L diesel fuel tanks subject to explosive rupture,
 * and EMP shockwave vulnerability.
 */

export class StargazerSchoolBusRoadblockSector {
  /**
   * @param {Object} options
   * @param {string} [options.roadblockId='stargazer-bus-roadblock-01']
   * @param {number} [options.busArmorIntegrity=1.0]
   * @param {number} [options.fuelTankLiters=300.0]
   */
  constructor(options = {}) {
    this.roadblockId = options.roadblockId || 'stargazer-bus-roadblock-01';
    this.busArmorIntegrity = options.busArmorIntegrity || 1.0;
    this.fuelTankLiters = options.fuelTankLiters || 300.0;

    this.turretM2CaliberMm = 12.7; // .50 BMG
    this.turretRateOfFireRpm = 750;
    this.turretOperational = true;
    this.fuelTankRuptured = false;
  }

  /**
   * Fires a burst of .50 BMG armor-piercing rounds from the roof-mounted turret.
   * @param {number} burstRounds
   * @param {number} targetDistanceM
   * @returns {Object} Gunfire burst telemetry
   */
  fireRoofTurret50BmgBurst(burstRounds = 10, targetDistanceM = 35.0) {
    if (!this.turretOperational) {
      return { success: false, reason: 'TURRET_DESTROYED_OR_EMP_DISABLED' };
    }

    const muzzleVelocityMps = 890.0;
    const bulletMassGrams = 42.0;
    const kineticEnergyPerBulletJ = 0.5 * (bulletMassGrams / 1000.0) * muzzleVelocityMps * muzzleVelocityMps;
    const hitAccuracy = Math.max(0.2, 0.95 - (targetDistanceM / 100.0) * 0.45);
    const landedShots = Math.round(burstRounds * hitAccuracy);
    const damagePerShot = 48;
    const totalDamage = landedShots * damagePerShot;

    return {
      success: true,
      burstRounds,
      landedShots,
      damagePerShot,
      totalDamage,
      kineticEnergyPerBulletJ: Math.round(kineticEnergyPerBulletJ),
      armorPenetrationMmSteel: 22.0,
      targetKnockbackForceN: landedShots * 140
    };
  }

  /**
   * Triggers the explosive rupture of the bus's diesel fuel tanks.
   * @param {boolean} plasmaBoltIgnition
   * @returns {Object} Fuel explosion telemetry
   */
  ruptureFuelTanks(plasmaBoltIgnition = true) {
    if (this.fuelTankRuptured) {
      return { success: false, reason: 'FUEL_TANKS_ALREADY_EXPLODED' };
    }

    this.fuelTankRuptured = true;
    this.turretOperational = false;
    this.busArmorIntegrity = Math.max(0, this.busArmorIntegrity - 0.75);

    const blastRadiusM = 11.5;
    const explosionConcussionDamage = 420;
    const thermalBurnDamage = 430;
    const totalBlastDamage = explosionConcussionDamage + thermalBurnDamage;
    const flameSpreadRadiusM = 8.0;

    return {
      success: true,
      fuelTankRuptured: true,
      blastRadiusM,
      totalBlastDamage,
      flameSpreadRadiusM,
      fireballTemperatureC: 850.0,
      busHullIntegrityRemaining: Number(this.busArmorIntegrity.toFixed(2)),
      smokeObscurationDurationSec: 14.0
    };
  }

  /**
   * Applies an EMP grenade or bio-electric stun to disable the motorized turret.
   * @param {number} empDurationSec
   * @returns {Object} EMP disable status
   */
  applyEmpDisruption(empDurationSec = 6.0) {
    this.turretOperational = false;
    return {
      turretOperational: false,
      empDurationSec,
      fireControlSystemOffline: true,
      turretTraverseLocked: true
    };
  }
}
