/**
 * ValVerdeFlashFloodDamBreachSector.js
 * 
 * Chantier Level Design #1 - Crue Subite Tropicale & Rupture Hydrodynamique de Barrage de Rondins.
 * Canonical 1:1 Predator (1987) fidelity:
 * - Torrential tropical cloudburst causes water levels to surge by 2.2m.
 * - Natural debris dam holding back 120,000 liters of water collapses under hydrostatic pressure (P = rho * g * h).
 * - High-velocity flood wave (flow rate 45 m³/s, speed 8.5 m/s) sweeping through river trenches.
 * - Environmental impact: strips mud camouflage from exposed combatants, sweeps away loose driftwood barricades,
 *   floods low-lying trenches, and forces Dutch and the Jungle Hunter onto high granite boulder platforms.
 */

export class ValVerdeFlashFloodDamBreachSector {
  /**
   * @param {Object} options
   * @param {number} [options.damRetentionVolumeLiters=120000]
   * @param {number} [options.floodSurgeSpeedMps=8.5]
   */
  constructor(options = {}) {
    this.damRetentionVolumeLiters = options.damRetentionVolumeLiters ?? 120000;
    this.floodSurgeSpeedMps = options.floodSurgeSpeedMps ?? 8.5;

    this.damIntact = true;
    this.waterSurgeHeightM = 0;
    this.trenchFlooded = false;
    this.mudWashedFromCombatants = false;
  }

  /**
   * Evaluates hydrostatic pressure on the timber dam and triggers breach when limit is exceeded.
   * @param {number} waterHeadHeightM - Height of accumulated water behind the dam
   * @returns {Object} Dam structural evaluation
   */
  evaluateDamHydrostaticPressure(waterHeadHeightM = 2.8) {
    const waterDensityKgM3 = 1000.0;
    const gravity = 9.81;
    // Hydrostatic pressure at base: P = rho * g * h
    const hydrostaticPressureKpa = Math.round((waterDensityKgM3 * gravity * waterHeadHeightM) / 1000.0);
    const breachThresholdKpa = 24.0; // Timber dam structural resistance limit
    const willBreach = hydrostaticPressureKpa >= breachThresholdKpa;

    return {
      waterHeadHeightM,
      hydrostaticPressureKpa,
      breachThresholdKpa,
      willBreach,
      warningCreakAcousticDb: 74,
      structuralIntegrityPct: Math.max(0, Math.round(100 - (hydrostaticPressureKpa / breachThresholdKpa) * 100))
    };
  }

  /**
   * Triggers the catastrophic failure of the timber dam and wave release.
   * @returns {Object} Flood wave release telemetry
   */
  triggerDamBreachWave() {
    this.damIntact = false;
    this.trenchFlooded = true;
    this.mudWashedFromCombatants = true;
    this.waterSurgeHeightM = 2.2;

    const kineticWaveForceJoules = Math.round(0.5 * (this.damRetentionVolumeLiters * 0.15) * Math.pow(this.floodSurgeSpeedMps, 2));

    return {
      success: true,
      damBreached: true,
      waterSurgeHeightM: this.waterSurgeHeightM,
      flowRateM3s: 45.0,
      floodSurgeSpeedMps: this.floodSurgeSpeedMps,
      kineticWaveForceJoules,
      trenchFlooded: true,
      mudCamouflageStripped: true,
      waveRoarAcousticDb: 98,
      evacuateToHighGroundRequired: true
    };
  }

  /**
   * Resolves entity status when caught in the flood wave.
   * @param {number} entityElevationM - Height above riverbed (m)
   * @returns {Object} Entity flood interaction
   */
  resolveEntityFloodInteraction(entityElevationM = 0.5) {
    const submerged = entityElevationM < this.waterSurgeHeightM;
    const sweptDownstream = submerged && entityElevationM < 1.2;

    return {
      entityElevationM,
      submerged,
      sweptDownstream,
      mudCamouflageRemoved: submerged,
      balanceMaintained: !sweptDownstream,
      footingHazard: submerged ? 'SEVERE_SURGE_FLOW' : 'SAFE_HIGH_GROUND'
    };
  }
}
