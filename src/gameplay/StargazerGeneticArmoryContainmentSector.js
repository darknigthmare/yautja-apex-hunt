/**
 * StargazerGeneticArmoryContainmentSector.js
 * 
 * The Predator (2018) - Project Stargazer Sub-Level Genetic Armory & Containment Vaults.
 * Simulates the sterile high-tech subterranean weaponry and hybrid specimen storage wing:
 * - Ultra-slick polished epoxy floors (low friction coeff mu = 0.22) enabling slide dash extensions
 * - Shatterable cylindrical liquid nitrogen cryogenic specimen tanks (-196 °C freeze splash)
 * - Heavy biometric blast doors with emergency security override consoles
 * - Overhead motorized crane gantries carrying military specimen containers.
 */

export class StargazerGeneticArmoryContainmentSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='stargazer-genetic-armory-01']
   * @param {number} [options.epoxyFrictionMu=0.22]
   * @param {number} [options.cryoTankCount=4]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'stargazer-genetic-armory-01';
    this.epoxyFrictionMu = options.epoxyFrictionMu || 0.22;
    this.cryoTankCount = options.cryoTankCount || 4;

    this.blastDoorsLocked = true;
    this.overridesCracked = false;
    this.gantryCraneOperational = true;
    this.cryoTanksShattered = 0;
  }

  /**
   * Performs an evasive slide dash across the low-friction polished epoxy floor.
   * Converts momentum into a 7.2m low-profile powerslide (extended by low friction mu = 0.22).
   * @param {number} initialVelocityMps
   * @returns {Object} Epoxy slide telemetry
   */
  executeEpoxyPowerSlide(initialVelocityMps = 8.5) {
    const slideDistanceM = Number(((initialVelocityMps * initialVelocityMps) / (2 * 9.81 * this.epoxyFrictionMu) * 0.42).toFixed(2));
    const slideDurationSec = Number((slideDistanceM / (initialVelocityMps * 0.55)).toFixed(2));
    const profileHeightM = 0.85; // Low stance ducks under incoming rifle fire
    const iFramesDurationMs = 180;

    return {
      success: true,
      initialVelocityMps,
      epoxyFrictionMu: this.epoxyFrictionMu,
      slideDistanceM,
      slideDurationSec,
      profileHeightM,
      iFramesDurationMs,
      duckedUnderCrossfire: true,
      floorSquealDecibels: 62
    };
  }

  /**
   * Shatters a liquid nitrogen specimen immersion tank during combat.
   * Unleashes a flash-freezing pool that coats the floor in slippery brittle ice and inflicts cryogenic damage.
   * @param {number} damageDealt
   * @returns {Object} Cryo tank rupture telemetry
   */
  ruptureCryoSpecimenTank(damageDealt = 140) {
    if (this.cryoTanksShattered >= this.cryoTankCount) {
      return { success: false, reason: 'ALL_TANKS_ALREADY_SHATTERED' };
    }

    this.cryoTanksShattered++;
    const freezeSpillRadiusM = 5.2;
    const cryogenicFlashDamage = 110;
    const floorConvertedToBrittleIce = true;

    return {
      success: true,
      tanksRemaining: this.cryoTankCount - this.cryoTanksShattered,
      freezeSpillRadiusM,
      cryogenicFlashDamage,
      spillTempC: -196.0,
      floorConvertedToBrittleIce,
      glassShrapnelLacerations: 16
    };
  }

  /**
   * Cracks the biometric lockdown console on the vault blast door using wrist gauntlet terminal hack.
   * @returns {Object} Biometric door override telemetry
   */
  overrideBiometricLockdown() {
    this.overridesCracked = true;
    this.blastDoorsLocked = false;

    return {
      success: true,
      blastDoorsLocked: false,
      overridesCracked: true,
      hydraulicHissDecibels: 79,
      armoryVaultCacheAccessible: true
    };
  }
}
