/**
 * LosAngelesStormDrainPumpingStationSector.js
 * 
 * Predator 2 (1990) - Los Angeles Underground Storm Drain Pumping Station.
 * Simulates the massive flood control reservoir beneath the city: 40,000 L/min torrential stormwater,
 * motorized sluice gates, heavy metal filtration grates catching debris, high-voltage conduit short circuits,
 * and high-speed combi-stick melee under hydrodynamic drag.
 */

export class LosAngelesStormDrainPumpingStationSector {
  /**
   * @param {Object} options
   * @param {string} [options.sectorId='la-storm-drain-pump-01']
   * @param {number} [options.waterFlowRateLpm=40000.0]
   * @param {number} [options.channelWaterDepthM=1.8]
   * @param {boolean} [options.sluiceGateOpen=false]
   */
  constructor(options = {}) {
    this.sectorId = options.sectorId || 'la-storm-drain-pump-01';
    this.waterFlowRateLpm = options.waterFlowRateLpm || 40000.0;
    this.channelWaterDepthM = options.channelWaterDepthM || 1.8;
    this.sluiceGateOpen = options.sluiceGateOpen !== undefined ? options.sluiceGateOpen : false;

    this.filtrationGrateIntegrity = 1.0;
    this.pumpTurbineActive = true;
    this.submergedCombatActive = false;
  }

  /**
   * Operates the motorized floodgate sluice to regulate or release torrents.
   * @param {boolean} open
   * @returns {Object} Sluice gate operation telemetry
   */
  operateMotorizedSluiceGate(open = true) {
    this.sluiceGateOpen = Boolean(open);
    const flowVelocityMps = this.sluiceGateOpen ? 6.2 : 1.2;
    const waterSurgeHeadM = this.sluiceGateOpen ? 3.5 : 0.8;
    const acousticRumbleDecibels = Math.round(75 + (flowVelocityMps / 6.2) * 22);

    return {
      success: true,
      sluiceGateOpen: this.sluiceGateOpen,
      waterFlowRateLpm: this.waterFlowRateLpm,
      flowVelocityMps,
      waterSurgeHeadM,
      acousticRumbleDecibels,
      hydroHazardSeverity: this.sluiceGateOpen ? 'CRITICAL_TORRENT' : 'MODERATE_FLOW'
    };
  }

  /**
   * Evaluates melee weapon swings while submerged in the storm drain water.
   * Hydrodynamic drag reduces weapon swing speed by 35% unless using hydrodynamic Combi-stick.
   * @param {string} weaponType - 'COMBI_STICK' or 'WRISTBLADES'
   * @param {number} rawSwingVelocityMps
   * @returns {Object} Underwater combat telemetry
   */
  resolveSubmergedWeaponMelee(weaponType = 'COMBI_STICK', rawSwingVelocityMps = 18.0) {
    this.submergedCombatActive = true;
    const isHydrodynamicStaff = weaponType === 'COMBI_STICK';
    const dragCoeff = isHydrodynamicStaff ? 0.15 : 0.40;
    const effectiveSwingVelocityMps = +(rawSwingVelocityMps * (1.0 - dragCoeff)).toFixed(1);
    const strikeKineticDamage = Math.round(effectiveSwingVelocityMps * 12);

    return {
      submergedCombatActive: true,
      weaponType,
      isHydrodynamicStaff,
      dragCoeff,
      effectiveSwingVelocityMps,
      strikeKineticDamage,
      cavitationBubbleTrailVisible: effectiveSwingVelocityMps > 14.0
    };
  }

  /**
   * Debris impact against heavy metal filtration grates.
   * @param {number} debrisMassKg
   * @param {number} impactVelocityMps
   * @returns {Object} Grate structural impact
   */
  resolveFiltrationGrateImpact(debrisMassKg = 150.0, impactVelocityMps = 5.0) {
    const impactEnergyJoules = Math.round(0.5 * debrisMassKg * Math.pow(impactVelocityMps, 2));
    const damageRatio = +(impactEnergyJoules / 8000.0).toFixed(3);
    this.filtrationGrateIntegrity = Math.max(0.0, this.filtrationGrateIntegrity - damageRatio);

    return {
      debrisMassKg,
      impactVelocityMps,
      impactEnergyJoules,
      filtrationGrateIntegrity: +this.filtrationGrateIntegrity.toFixed(3),
      grateBreached: this.filtrationGrateIntegrity <= 0.0,
      metalClankDecibels: 92
    };
  }
}
