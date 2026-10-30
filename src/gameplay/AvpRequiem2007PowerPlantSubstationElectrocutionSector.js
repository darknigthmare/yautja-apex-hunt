/**
 * AvpRequiem2007PowerPlantSubstationElectrocutionSector.js - v237
 * Canonical set-piece: Gunnison municipal power substation, 115 kV electrical arcing,
 * ceramic insulator destruction, whip busbar pull & grid blackout surge.
 */

export class AvpRequiem2007PowerPlantSubstationElectrocutionSector {
  constructor(options = {}) {
    this.sectorId = 'SECTOR_2007_POWER_PLANT_SUBSTATION_ELECTROCUTION';
    this.name = 'AVP: Requiem (2007) Gunnison Substation 115kV Transformer Arc Trap';
    this.difficultyMultiplier = options.difficultyMultiplier || 1.0;
    this.transformerVoltageKilovolts = 115.0;
    this.rainPrecipitationMmH = 68.0;

    this.state = {
      substationInfiltrated: false,
      insulatorsShattered: false,
      highVoltageArcFormed: false,
      whipBusbarPullExecuted: false,
      gridBlackoutTriggered: false,
      honorScore: 0,
      arcTemperatureKelvin: 0
    };
  }

  infiltrateSubstationPerimeter(groundPuddleConductivityMhos = 0.08) {
    this.state.substationInfiltrated = true;
    this.state.honorScore += 100;
    return {
      status: 'SUBSTATION_PERIMETER_OCCUPIED',
      voltageRatingKv: this.transformerVoltageKilovolts,
      rainPrecipitationMmH: this.rainPrecipitationMmH,
      groundPuddleConductivityMhos,
      xenoPackTrackedCount: 5
    };
  }

  shatterCeramicInsulatorsWithPlasma(plasmaDischargeCount = 2) {
    if (!this.state.substationInfiltrated) {
      throw new Error('Must infiltrate substation before targeting transformer insulators');
    }
    this.state.insulatorsShattered = true;
    this.state.highVoltageArcFormed = true;
    this.state.arcTemperatureKelvin = 18500;
    this.state.honorScore += 100;

    return {
      status: 'INSULATORS_SHATTERED_ARC_ACTIVE',
      discharges: plasmaDischargeCount,
      arcVoltageKv: this.transformerVoltageKilovolts,
      arcTemperatureK: this.state.arcTemperatureKelvin,
      illuminatedStrobeFrequencyHz: 60.0
    };
  }

  executeTailWhipBusbarEntanglement(xenomorphTargetId = 'XENO_STALKER_DELTA') {
    if (!this.state.highVoltageArcFormed) {
      throw new Error('Arc must be live before whip-pulling Xenomorph into transformer busbar');
    }
    this.state.whipBusbarPullExecuted = true;
    this.state.honorScore += 100;

    return {
      status: 'WHIP_BUSBAR_ENTANGLEMENT_SUCCESSFUL',
      target: xenomorphTargetId,
      whipTensileTensionN: 2450,
      electrocutionCurrentAmperes: 450,
      vaporizedAcidSplatterContained: true
    };
  }

  triggerRegionalGridBlackout() {
    if (!this.state.whipBusbarPullExecuted) {
      throw new Error('Cannot collapse substation grid prior to busbar circuit overload');
    }
    this.state.gridBlackoutTriggered = true;
    this.state.honorScore += 100;

    return {
      status: 'REGIONAL_BLACKOUT_CONFIRMED',
      gunnisonGridShutdown: true,
      opticalDarknessPercent: 100,
      thermalNightVisionPrimary: true,
      totalSectorHonor: this.state.honorScore,
      canonicalReference: 'AVP: Requiem (2007) - Gunnison power plant fight, Wolf electric arc traps'
    };
  }

  getSnapshot() {
    return {
      sectorId: this.sectorId,
      name: this.name,
      state: { ...this.state },
      cleared: this.state.gridBlackoutTriggered && this.state.honorScore >= 400
    };
  }
}
