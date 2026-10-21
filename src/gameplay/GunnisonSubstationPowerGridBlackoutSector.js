/**
 * GunnisonSubstationPowerGridBlackoutSector.js
 * 
 * Aliens vs. Predator: Requiem (2007) - Gunnison Regional Power Substation & Blackout Sector.
 * Simulates the rainy industrial electrical substation:
 * - 13,800V step-down oil-cooled electrical transformers with lethal arcing hazards
 * - High-voltage transmission towers and lightning arrestors at 35.0m elevation
 * - Sabotagable master circuit breaker switchgear triggering a regional city blackout,
 *   plunging the entire map into pitch blackness, disabling human floodlights, and granting thermal predator supremacy.
 */

export class GunnisonSubstationPowerGridBlackoutSector {
  /**
   * @param {Object} options
   * @param {string} [options.substationId='gunnison-substation-01']
   * @param {number} [options.gridVoltageV=13800.0]
   * @param {boolean} [options.powerGridOnline=true]
   */
  constructor(options = {}) {
    this.substationId = options.substationId || 'gunnison-substation-01';
    this.gridVoltageV = options.gridVoltageV || 13800.0;
    this.powerGridOnline = options.powerGridOnline !== undefined ? options.powerGridOnline : true;

    this.transformerOilLevelPct = 100.0;
    this.blackoutActive = !this.powerGridOnline;
    this.towerHeightM = 35.0;
    this.electricArcHazardRadiusM = 3.5;
  }

  /**
   * Slices or blasts the master circuit breaker relay to collapse the municipal power grid.
   * @param {number} weaponImpactDamage
   * @returns {Object} City blackout telemetry
   */
  triggerMunicipalGridBlackout(weaponImpactDamage = 150) {
    if (!this.powerGridOnline) {
      return { success: false, reason: 'GRID_ALREADY_OFFLINE' };
    }

    this.powerGridOnline = false;
    this.blackoutActive = true;

    const electroMagneticPulseRadiusM = 45.0;
    const cityIlluminationDropPct = 92.5;
    const humanNightVisionPenaltyPct = 78.0;
    const yautjaThermalContrastMultiplier = 2.4;

    return {
      success: true,
      gridVoltageV: this.gridVoltageV,
      powerGridOnline: false,
      blackoutActive: true,
      electroMagneticPulseRadiusM,
      cityIlluminationDropPct,
      humanNightVisionPenaltyPct,
      yautjaThermalContrastMultiplier,
      transformerExplosionGenerated: true,
      regionalBlackoutConfirmed: true
    };
  }

  /**
   * Evaluates high-voltage electrical arcing from a damaged transformer casing during rain.
   * @param {number} entityDistanceM
   * @param {boolean} rainActive
   * @returns {Object} Transformer arcing telemetry
   */
  resolveTransformerElectricalArcHazard(entityDistanceM = 2.0, rainActive = true) {
    const hazardRadius = rainActive ? this.electricArcHazardRadiusM * 1.6 : this.electricArcHazardRadiusM;
    const inArcZone = entityDistanceM <= hazardRadius;

    if (!this.powerGridOnline || !inArcZone) {
      return { arced: false, entityDistanceM, hazardRadiusM: hazardRadius };
    }

    const shockDamage = Math.round(180 * (1.0 - entityDistanceM / hazardRadius));
    const arcCurrentAmps = 450.0;
    const ozoneScentActive = true;

    return {
      arced: true,
      entityDistanceM,
      hazardRadiusM: hazardRadius,
      shockDamage,
      arcCurrentAmps,
      ozoneScentActive,
      arcVoltageV: this.gridVoltageV,
      paralysisDurationSec: 1.4
    };
  }

  /**
   * Climbs the 35m transmission tower to establish regional thermal surveillance over the town.
   * @returns {Object} Tower surveillance telemetry
   */
  occupyTransmissionTowerApex() {
    const regionalScanRadiusM = 450.0;
    const targetAcuityBonusPct = 40.0;

    return {
      towerHeightM: this.towerHeightM,
      regionalScanRadiusM,
      targetAcuityBonusPct,
      lightningArrestorShielded: true,
      aerialGrappleLineAvailable: true
    };
  }
}
