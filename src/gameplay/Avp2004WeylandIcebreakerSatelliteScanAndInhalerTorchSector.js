/**
 * Chantier 3 (v203) : Scan Satellite PS-12, Brise-Glace Piper Maru & Inhalateur Lance-Flammes de Charles Weyland (AVP - 2004)
 * Complète en fidélité 1:1 l'expédition Weyland Industries dans Alien vs. Predator (2004) :
 * détection par le satellite orbital PS-12 du dôme thermique à 610 m (2 000 pieds) sous Bouvetøya,
 * descente en traîneau du tunnel cylindrique de 700 m foré à exactement 30°, scan aux rayons X de
 * Scar détectant le cancer pulmonaire de Charles Bishop Weyland et défi final de Weyland embrasant
 * son inhalateur médical avec une fusée éclairante (820°C).
 */
export class Avp2004WeylandIcebreakerSatelliteScanAndInhalerTorchSector {
  constructor() {
    this.sectorId = 'AVP_2004_PS12_SATELLITE_AND_WEYLAND_INHALER_TORCH';
    this.filmReference = 'Alien vs. Predator (2004) - PS-12 Satellite Scan, 30-Degree Ice Tunnel & Weyland Inhaler Stand';
    this.reset();
  }

  reset() {
    this.ps12SatelliteLocked = false;
    this.thirtyDegreeIceTunnelDescended = false;
    this.weylandLungCancerScannedByScar = false;
    this.weylandInhalerTorchDefianceCompleted = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  lockPs12SatelliteOnBouvetoyaThermalBloom({
    depthMeters = 610,
    pyramidHeatSignatureConfirmed = true
  } = {}) {
    const depth = Math.max(0, Number(depthMeters) || 0);
    this.ps12SatelliteLocked =
      depth >= 550 && Boolean(pyramidHeatSignatureConfirmed);
    this.eventLog.push({
      step: 'PS12_SATELLITE_THERMAL_BLOOM_LOCKED',
      depthMeters: depth,
      ps12SatelliteLocked: this.ps12SatelliteLocked
    });
    return {
      ps12SatelliteLocked: this.ps12SatelliteLocked,
      depthMeters: depth
    };
  }

  descendThirtyDegreeOrbitalIceTunnelOnSleds({
    tunnelAngleDegrees = 30,
    descentLengthMeters = 700
  } = {}) {
    if (!this.ps12SatelliteLocked) {
      throw new Error('PS-12 satellite thermal bloom must be locked before descending the orbital ice tunnel.');
    }
    const angle = Math.max(0, Number(tunnelAngleDegrees) || 0);
    const length = Math.max(0, Number(descentLengthMeters) || 0);
    this.thirtyDegreeIceTunnelDescended =
      angle === 30 && length >= 600;
    this.eventLog.push({
      step: 'THIRTY_DEGREE_ICE_TUNNEL_DESCENDED',
      tunnelAngleDegrees: angle,
      descentLengthMeters: length,
      thirtyDegreeIceTunnelDescended: this.thirtyDegreeIceTunnelDescended
    });
    return {
      thirtyDegreeIceTunnelDescended: this.thirtyDegreeIceTunnelDescended,
      tunnelAngleDegrees: angle
    };
  }

  scarBioMaskXrayDetectsWeylandLungCancer({
    terminalLungTumorDetected = true,
    initialMercyGranted = true
  } = {}) {
    if (!this.thirtyDegreeIceTunnelDescended) {
      throw new Error('Expedition must descend into the pyramid before Scar confronts Charles Bishop Weyland.');
    }
    this.weylandLungCancerScannedByScar =
      Boolean(terminalLungTumorDetected) && Boolean(initialMercyGranted);
    this.eventLog.push({
      step: 'SCAR_XRAY_SCAN_WEYLAND_LUNG_CANCER',
      weylandLungCancerScannedByScar: this.weylandLungCancerScannedByScar
    });
    return {
      weylandLungCancerScannedByScar: this.weylandLungCancerScannedByScar
    };
  }

  weylandIgniteMedicalInhalerFlamethrowerDefiance({
    flameTempCelsius = 820,
    forcedHonorRetaliation = true
  } = {}) {
    if (!this.weylandLungCancerScannedByScar) {
      throw new Error('Scar must first grant mercy after scanning Weyland lungs before Weyland ignites his inhaler torch.');
    }
    const temp = Math.max(0, Number(flameTempCelsius) || 0);
    this.weylandInhalerTorchDefianceCompleted =
      temp >= 700 && Boolean(forcedHonorRetaliation);
    if (this.weylandInhalerTorchDefianceCompleted) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'WEYLAND_INHALER_FLAMETHROWER_DEFIANCE',
      flameTempCelsius: temp,
      weylandInhalerTorchDefianceCompleted: this.weylandInhalerTorchDefianceCompleted,
      honorAwarded: this.honorAwarded
    });
    return {
      weylandInhalerTorchDefianceCompleted: this.weylandInhalerTorchDefianceCompleted,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      ps12SatelliteLocked: this.ps12SatelliteLocked,
      thirtyDegreeIceTunnelDescended: this.thirtyDegreeIceTunnelDescended,
      weylandLungCancerScannedByScar: this.weylandLungCancerScannedByScar,
      weylandInhalerTorchDefianceCompleted: this.weylandInhalerTorchDefianceCompleted,
      honorAwarded: this.honorAwarded
    };
  }
}
