/**
 * Avp2004WhalingStationDecontaminationVatSector.js - v237
 * Canonical set-piece: 1904 Norwegian whaling station on Bouvetøya Island,
 * sub-zero blizzard (-45°C), whale oil boiler steam sabotage & combi-stick pin.
 */

export class Avp2004WhalingStationDecontaminationVatSector {
  constructor(options = {}) {
    this.sectorId = 'SECTOR_2004_WHALING_STATION_DECONTAMINATION_VAT';
    this.name = 'AVP (2004) Bouvetøya Whaling Station Industrial Boilers & Blizzard Stalk';
    this.difficultyMultiplier = options.difficultyMultiplier || 1.0;
    this.ambientTemperatureCelsius = -45.0;
    this.windChillKmh = 95.0;

    this.state = {
      droppodLandingConfirmed: false,
      boilerSteamVentsRuptured: false,
      thermalWhiteoutActive: false,
      combistickImpaleExecuted: false,
      honorScore: 0,
      frostAccumulationMm: 1.2
    };
  }

  confirmDroppodLanding(podDesignation = 'YOUNG_BLOOD_DESCENT_POD_BOUVET') {
    this.state.droppodLandingConfirmed = true;
    this.state.honorScore += 100;
    return {
      status: 'LANDING_CONFIRMED',
      pod: podDesignation,
      ambientTempC: this.ambientTemperatureCelsius,
      windChillKmh: this.windChillKmh,
      frostAccumulationMm: this.state.frostAccumulationMm,
      stationZone: 'Razorback Whaling Station 1904 Industrial Quarters'
    };
  }

  ruptureWhaleOilBoilerSteamVent(boilerPressurePsi = 180) {
    if (!this.state.droppodLandingConfirmed) {
      throw new Error('Must land on Bouvetøya before sabotaging industrial boilers');
    }
    this.state.boilerSteamVentsRuptured = true;
    this.state.thermalWhiteoutActive = true;
    this.state.honorScore += 100;

    return {
      status: 'BOILER_STEAM_VENTED',
      boilerPressurePsi,
      steamTemperatureCelsius: 140.0,
      thermalWhiteoutRadiusMeters: 35.0,
      mercenaryThermalSensorsBlinded: true
    };
  }

  stalkThroughFrozenRenderingTanks(stealthRating = 0.96) {
    if (!this.state.thermalWhiteoutActive) {
      throw new Error('Requires steam thermal whiteout screen for close vat stalking');
    }
    this.state.honorScore += 100;
    return {
      status: 'BLUBBER_VATS_INFILTRATED',
      stealthRating,
      mercenaryPositionsFlagged: 4,
      acousticMaskingDb: 28.5
    };
  }

  hurlCeremonialCombiStickImpale(targetDistanceMeters = 22.0) {
    if (!this.state.boilerSteamVentsRuptured) {
      throw new Error('Cannot execute combi-stick throw without boiler vent diversion');
    }
    this.state.combistickImpaleExecuted = true;
    this.state.honorScore += 100;

    return {
      status: 'COMBI_STICK_IMPALE_CONFIRMED',
      targetDistanceMeters,
      impactSubstrate: 'Industrial Riveted Steel Boiler Plate',
      piercingForceJoules: 3400,
      totalSectorHonor: this.state.honorScore,
      canonicalReference: 'AVP (2004) - Whaling station boiler fight, Celtic & Scar Bouvet entrance'
    };
  }

  getSnapshot() {
    return {
      sectorId: this.sectorId,
      name: this.name,
      state: { ...this.state },
      cleared: this.state.combistickImpaleExecuted && this.state.honorScore >= 400
    };
  }
}
