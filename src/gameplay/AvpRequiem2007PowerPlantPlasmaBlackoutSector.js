/**
 * AvpRequiem2007PowerPlantPlasmaBlackoutSector (v233)
 *
 * Implements iconic 1:1 canonical set-pieces from Aliens vs. Predator: Requiem (2007):
 * 1. Gunnison municipal power station and high-voltage transformer grid infiltration.
 * 2. Wolf dual-wielding hand-modified plasmacaster pistols salvaged from fallen comrades.
 * 3. Charging high-yield dual plasma burst into central step-up transformer coils.
 * 4. EMP arc blast vaporizing attacking xenomorph swarm and plunging Gunnison into total blackout (+400 Honor).
 */
export class AvpRequiem2007PowerPlantPlasmaBlackoutSector {
  constructor() {
    this.sectorId = 'AVP_REQUIEM_2007_POWER_PLANT_PLASMA_BLACKOUT';
    this.filmReference = 'AVP: Requiem (2007) - Gunnison Power Plant Infiltration, Dual Plasma Pistols & Grid EMP Blackout';
    this.reset();
  }

  reset() {
    this.powerStationGridInfiltrated = false;
    this.dualPlasmaPistolsArmored = false;
    this.transformerOverloadCharged = false;
    this.empBlackoutVaporizationExecuted = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  infiltratePowerStationGrid({
    gridVoltageKilovolts = 500,
    transformerTurbineRpm = 3600,
    xenomorphInfestationDensityPpm = 860
  } = {}) {
    const kv = Math.max(0, Number(gridVoltageKilovolts) || 0);
    const rpm = Math.max(0, Number(transformerTurbineRpm) || 0);
    const inf = Math.max(0, Number(xenomorphInfestationDensityPpm) || 0);

    this.powerStationGridInfiltrated = kv >= 300 && rpm >= 2800 && inf >= 600;
    this.eventLog.push({
      step: 'POWER_STATION_GRID_INFILTRATED',
      gridVoltageKilovolts: kv,
      transformerTurbineRpm: rpm,
      xenomorphInfestationDensityPpm: inf,
      powerStationGridInfiltrated: this.powerStationGridInfiltrated
    });
    return {
      powerStationGridInfiltrated: this.powerStationGridInfiltrated
    };
  }

  armorDualPlasmaPistols({
    dualHandheldConversionVerified = true,
    plasmaBoltFrequencyGhz = 14.5,
    coolingCellEfficiencyScore = 0.96
  } = {}) {
    if (!this.powerStationGridInfiltrated) {
      throw new Error('Must infiltrate power grid before armoring dual plasma pistols.');
    }
    const freq = Number(plasmaBoltFrequencyGhz) || 0;
    const eff = Number(coolingCellEfficiencyScore) || 0;

    this.dualPlasmaPistolsArmored = dualHandheldConversionVerified === true && freq >= 10.0 && eff >= 0.88;
    this.eventLog.push({
      step: 'DUAL_PLASMA_PISTOLS_ARMORED',
      dualHandheldConversionVerified,
      plasmaBoltFrequencyGhz: freq,
      coolingCellEfficiencyScore: eff,
      dualPlasmaPistolsArmored: this.dualPlasmaPistolsArmored
    });
    return {
      dualPlasmaPistolsArmored: this.dualPlasmaPistolsArmored
    };
  }

  chargeTransformerOverload({
    plasmaCapacitorJoules = 28000,
    magneticConfinementFieldTesla = 8.5,
    transformerCoreSuperheatCelsius = 1850
  } = {}) {
    if (!this.dualPlasmaPistolsArmored) {
      throw new Error('Must armor dual plasma pistols before charging transformer overload.');
    }
    const joules = Math.max(0, Number(plasmaCapacitorJoules) || 0);
    const tesla = Number(magneticConfinementFieldTesla) || 0;
    const heat = Number(transformerCoreSuperheatCelsius) || 0;

    this.transformerOverloadCharged = joules >= 20000 && tesla >= 6.0 && heat >= 1500;
    this.eventLog.push({
      step: 'TRANSFORMER_OVERLOAD_CHARGED',
      plasmaCapacitorJoules: joules,
      magneticConfinementFieldTesla: tesla,
      transformerCoreSuperheatCelsius: heat,
      transformerOverloadCharged: this.transformerOverloadCharged
    });
    return {
      transformerOverloadCharged: this.transformerOverloadCharged
    };
  }

  executeEmpBlackoutVaporization({
    empPulseRadiusMeters = 650,
    xenomorphVaporizationCount = 8,
    countyElectricalBlackoutConfirmed = true
  } = {}) {
    if (!this.transformerOverloadCharged) {
      throw new Error('Must charge transformer overload before executing EMP blackout.');
    }
    const rad = Math.max(0, Number(empPulseRadiusMeters) || 0);
    const count = Math.max(0, Number(xenomorphVaporizationCount) || 0);

    this.empBlackoutVaporizationExecuted = rad >= 500 && count >= 5 && countyElectricalBlackoutConfirmed === true;
    if (this.empBlackoutVaporizationExecuted) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'EMP_BLACKOUT_VAPORIZATION_EXECUTED',
      empPulseRadiusMeters: rad,
      xenomorphVaporizationCount: count,
      countyElectricalBlackoutConfirmed,
      empBlackoutVaporizationExecuted: this.empBlackoutVaporizationExecuted,
      honorAwarded: this.honorAwarded
    });
    return {
      empBlackoutVaporizationExecuted: this.empBlackoutVaporizationExecuted,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.powerStationGridInfiltrated &&
      this.dualPlasmaPistolsArmored &&
      this.transformerOverloadCharged &&
      this.empBlackoutVaporizationExecuted &&
      this.honorAwarded === 400
    );
  }
}
