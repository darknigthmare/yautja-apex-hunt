/**
 * AvpRequiem2007HospitalMaternitySteamBurstSector (v230)
 *
 * Implements iconic 1:1 canonical set-pieces from Aliens vs. Predator: Requiem (2007):
 * 1. Wolf pursuing the Predalien into the darkened, flooded hospital basement and maternity ward.
 * 2. Uncoiling the barbed segmented tail whip to cleave through a reinforced steel security gate (4,600 N).
 * 3. Rupturing high-pressure industrial boiler steam pipes (pressure 12 bar, steam 180°C) to scald and confuse the swarm.
 * 4. Discharging twin shoulder plasmacasters through the blinding steam cloud, vaporizing advancing xenomorphs (+400 Honor).
 */
export class AvpRequiem2007HospitalMaternitySteamBurstSector {
  constructor() {
    this.sectorId = 'AVP_REQUIEM_2007_HOSPITAL_MATERNITY_STEAM_BURST';
    this.filmReference = 'AVP: Requiem (2007) - Hospital Ward Flooding, Whip Security Cleave & Steam Pipe Rupture';
    this.reset();
  }

  reset() {
    this.maternityWardFloorTracked = false;
    this.securityGateWhipCleaved = false;
    this.boilerSteamPipeRuptured = false;
    this.steamCloudPlasmaVaporizationCompleted = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  trackMaternityWardFloodedFloor({
    floodWaterDepthCm = 8.5,
    incubatorRowDarknessLux = 1.2
  } = {}) {
    const depth = Math.max(0, Number(floodWaterDepthCm) || 0);
    const lux = Number(incubatorRowDarknessLux) || 0;
    this.maternityWardFloorTracked = depth >= 6.0 && lux <= 2.0;
    this.eventLog.push({
      step: 'MATERNITY_WARD_FLOOR_TRACKED',
      floodWaterDepthCm: depth,
      incubatorRowDarknessLux: lux,
      maternityWardFloorTracked: this.maternityWardFloorTracked
    });
    return {
      maternityWardFloorTracked: this.maternityWardFloorTracked
    };
  }

  cleaveSecurityGateWithWhip({
    whipLashForceNewtons = 4600,
    steelGateSevered = true
  } = {}) {
    if (!this.maternityWardFloorTracked) {
      throw new Error('Must track maternity floor before cleaving security gate.');
    }
    const force = Math.max(0, Number(whipLashForceNewtons) || 0);
    this.securityGateWhipCleaved = force >= 4000 && steelGateSevered === true;
    this.eventLog.push({
      step: 'SECURITY_GATE_WHIP_CLEAVED',
      whipLashForceNewtons: force,
      steelGateSevered,
      securityGateWhipCleaved: this.securityGateWhipCleaved
    });
    return {
      securityGateWhipCleaved: this.securityGateWhipCleaved
    };
  }

  ruptureBoilerSteamPipes({
    boilerSteamPressureBars = 12,
    steamTemperatureCelsius = 180
  } = {}) {
    if (!this.securityGateWhipCleaved) {
      throw new Error('Must cleave security gate before rupturing boiler pipes.');
    }
    const bars = Math.max(0, Number(boilerSteamPressureBars) || 0);
    const temp = Math.max(0, Number(steamTemperatureCelsius) || 0);
    this.boilerSteamPipeRuptured = bars >= 10 && temp >= 150;
    this.eventLog.push({
      step: 'BOILER_STEAM_PIPE_RUPTURED',
      boilerSteamPressureBars: bars,
      steamTemperatureCelsius: temp,
      boilerSteamPipeRuptured: this.boilerSteamPipeRuptured
    });
    return {
      boilerSteamPipeRuptured: this.boilerSteamPipeRuptured
    };
  }

  dischargeTwinPlasmaThroughSteamCloud({
    twinPlasmaChargeJoules = 16800,
    denseSteamVaporizationConfirmed = true
  } = {}) {
    if (!this.boilerSteamPipeRuptured) {
      throw new Error('Must rupture steam pipes before twin plasma discharge.');
    }
    const joules = Math.max(0, Number(twinPlasmaChargeJoules) || 0);
    this.steamCloudPlasmaVaporizationCompleted = joules >= 14000 && denseSteamVaporizationConfirmed === true;
    if (this.steamCloudPlasmaVaporizationCompleted) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'STEAM_CLOUD_PLASMA_VAPORIZATION_COMPLETED',
      twinPlasmaChargeJoules: joules,
      denseSteamVaporizationConfirmed,
      steamCloudPlasmaVaporizationCompleted: this.steamCloudPlasmaVaporizationCompleted,
      honorAwarded: this.honorAwarded
    });
    return {
      steamCloudPlasmaVaporizationCompleted: this.steamCloudPlasmaVaporizationCompleted,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.maternityWardFloorTracked &&
      this.securityGateWhipCleaved &&
      this.boilerSteamPipeRuptured &&
      this.steamCloudPlasmaVaporizationCompleted &&
      this.honorAwarded === 400
    );
  }
}
