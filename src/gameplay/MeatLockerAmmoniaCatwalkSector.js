/**
 * MeatLockerAmmoniaCatwalkSector.js
 * 
 * Predator 2 (1990) - Los Angeles Slaughterhouse Refrigerated Meat Locker.
 * Simulates the iconic industrial slaughterhouse duel between City Hunter and Keyes' OWLF team:
 * - Hanging beef carcass carousels on overhead motorized rail conveyors (mobile ballistic/thermal shields)
 * - Industrial steel grating catwalks at 8.0m elevation with railing vault takedowns
 * - High-pressure liquid ammonia coolant pipes (12 bar, -33 °C) susceptible to ballistic/plasma rupture,
 *   generating expanding toxic vapor clouds that blind infrared thermal vision and inflict cryogenic frostbite.
 */

export class MeatLockerAmmoniaCatwalkSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='la-meat-locker-catwalk-01']
   * @param {number} [options.roomTempC=-8.0]
   * @param {number} [options.catwalkElevationM=8.0]
   * @param {number} [options.hangingCarcassCount=28]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'la-meat-locker-catwalk-01';
    this.roomTempC = options.roomTempC !== undefined ? options.roomTempC : -8.0;
    this.catwalkElevationM = options.catwalkElevationM || 8.0;
    this.hangingCarcassCount = options.hangingCarcassCount || 28;

    this.conveyorMoving = true;
    this.conveyorSpeedMps = 1.2;
    this.ammoniaPipesRuptured = false;
    this.ammoniaCloudRadiusM = 0.0;
    this.ammoniaConcentrationPpm = 0;
    this.thermalBlindingActive = false;
  }

  /**
   * Operates the overhead motorized carcass conveyor rail.
   * Moving carcasses provide dynamic moving cover, blocking line of sight every 2.4 seconds.
   * @param {boolean} running
   * @param {number} speedMps
   * @returns {Object} Conveyor status telemetry
   */
  setConveyorOperation(running = true, speedMps = 1.2) {
    this.conveyorMoving = Boolean(running);
    this.conveyorSpeedMps = this.conveyorMoving ? Math.max(0.2, speedMps) : 0.0;
    const coverPeriodSec = this.conveyorMoving ? Number((2.8 / this.conveyorSpeedMps).toFixed(2)) : Infinity;

    return {
      conveyorMoving: this.conveyorMoving,
      conveyorSpeedMps: this.conveyorSpeedMps,
      hangingCarcassCount: this.hangingCarcassCount,
      coverPeriodSec,
      thermalShieldingRating: 'HIGH',
      conveyorRattleDecibels: this.conveyorMoving ? 72 : 28
    };
  }

  /**
   * Evaluates ballistic or melee collision with a hanging beef carcass.
   * Absorbs up to 240 Joules of kinetic damage before swinging and deflecting.
   * @param {number} projectileEnergyJoules
   * @returns {Object} Carcass impact telemetry
   */
  resolveCarcassCoverImpact(projectileEnergyJoules = 180.0) {
    const carcassMassKg = 320.0;
    const absorbedEnergy = Math.min(240.0, projectileEnergyJoules);
    const penetrationThrough = projectileEnergyJoules > 240.0;
    const swingOscillationAngleDeg = Number(Math.min(45.0, (absorbedEnergy / carcassMassKg) * 35.0).toFixed(1));

    return {
      absorbedEnergyJoules: absorbedEnergy,
      penetrationThrough,
      remainingEnergyJoules: Math.max(0, projectileEnergyJoules - 240.0),
      swingOscillationAngleDeg,
      meatSplatterParticles: 12,
      thermalSilhouetteMasked: true
    };
  }

  /**
   * Triggers the puncture or blast rupture of high-pressure ammonia pipes.
   * Releases an expanding sub-zero cryogenic vapor cloud (-33 °C) that blinds infrared optics.
   * @param {number} punctureDiameterMm
   * @returns {Object} Ammonia release telemetry
   */
  ruptureAmmoniaCoolantPipe(punctureDiameterMm = 25.0) {
    this.ammoniaPipesRuptured = true;
    this.ammoniaCloudRadiusM = Number((punctureDiameterMm * 0.42).toFixed(1));
    this.ammoniaConcentrationPpm = Math.round(punctureDiameterMm * 48);
    this.thermalBlindingActive = true;

    const cloudTempC = -33.5;
    const cryogenicDps = 24;
    const thermalVisionOcclusionPct = 85.0; // Dense cold vapor obscures heat signatures

    return {
      success: true,
      ammoniaPipesRuptured: true,
      cloudRadiusM: this.ammoniaCloudRadiusM,
      ammoniaConcentrationPpm: this.ammoniaConcentrationPpm,
      cloudTempC,
      cryogenicDps,
      thermalVisionOcclusionPct,
      respiratoryHazard: true,
      subZeroVaporFogActive: true
    };
  }

  /**
   * Resolves a vault takedown from the 8.0m high steel catwalk onto an enemy below.
   * @param {number} targetDistanceM
   * @returns {Object} Catwalk plunge takedown telemetry
   */
  resolveCatwalkPlungeTakedown(targetDistanceM = 3.0) {
    const fallVelocityMps = Number(Math.sqrt(2 * 9.81 * this.catwalkElevationM).toFixed(2));
    const plungeKineticEnergyJ = Math.round(0.5 * 140.0 * fallVelocityMps * fallVelocityMps);
    const impactDamage = Math.round(plungeKineticEnergyJ * 0.024);
    const steelGratingVibrationDecibels = 82;

    return {
      takedownSuccess: targetDistanceM <= 5.5,
      catwalkElevationM: this.catwalkElevationM,
      fallVelocityMps,
      plungeKineticEnergyJ,
      impactDamage,
      targetKnockdownDurationSec: 2.8,
      steelGratingVibrationDecibels,
      iFramesDurationMs: 200
    };
  }
}
