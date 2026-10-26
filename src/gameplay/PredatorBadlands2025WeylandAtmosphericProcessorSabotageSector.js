/**
 * Chantier 3 (v200) : Sabotage de la Station Mobile d'Épuration & Défoliation Atmosphérique WY (Predator: Badlands - 2025)
 * Modélise en fidélité 1:1 la destruction de l'unité mobile WY-ATMOS-09 qui étouffe la vallée de
 * Genna et affaiblit Bud : infiltration des conduits cryo-défoliants à -48°C, blocage des soupapes
 * à 3 400 PSI par Thia, blocage du rotor compresseur avec un fémur fossilisé (92 kN) et rupture
 * des 12 000 L de cryo-défoliant sur la garnison Weyland-Yutani.
 */
export class PredatorBadlands2025WeylandAtmosphericProcessorSabotageSector {
  constructor() {
    this.sectorId = 'PREDATOR_BADLANDS_2025_WY_ATMOSPHERIC_PROCESSOR_SABOTAGE';
    this.filmReference = 'Predator: Badlands (2025) - Weyland-Yutani WY-ATMOS-09 Cryo-Defoliant Scrubber Sabotage';
    this.rigDesignation = 'WY-ATMOS-09';
    this.reset();
  }

  reset() {
    this.intakeVentsInfiltrated = false;
    this.intakeTempCelsius = 0;
    this.pressureValvesOverridden = false;
    this.valvePressurePsi = 0;
    this.compressorRotorSeized = false;
    this.femurShearResistanceKn = 0;
    this.defoliantTankRuptured = false;
    this.wyGarrisonFrozen = 0;
    this.valleyAirRestored = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  infiltrateCryoDefoliantIntakeVents({
    intakeTempCelsius = -48,
    frostBuildUpCleared = true
  } = {}) {
    this.intakeTempCelsius = Number(intakeTempCelsius) || 0;
    this.intakeVentsInfiltrated =
      this.intakeTempCelsius <= -35 && Boolean(frostBuildUpCleared);
    this.eventLog.push({
      step: 'CRYO_DEFOLIANT_INTAKE_INFILTRATED',
      intakeTempCelsius: this.intakeTempCelsius,
      intakeVentsInfiltrated: this.intakeVentsInfiltrated
    });
    return {
      intakeVentsInfiltrated: this.intakeVentsInfiltrated,
      intakeTempCelsius: this.intakeTempCelsius
    };
  }

  thiaOverrideScrubberPressureValves({
    valvePressurePsi = 3400,
    safetyReliefDisabled = true
  } = {}) {
    if (!this.intakeVentsInfiltrated) {
      throw new Error('Cryo-defoliant intake vents must be infiltrated before overriding scrubber pressure valves.');
    }
    this.valvePressurePsi = Math.max(0, Number(valvePressurePsi) || 0);
    this.pressureValvesOverridden =
      this.valvePressurePsi >= 3000 && Boolean(safetyReliefDisabled);
    this.eventLog.push({
      step: 'SCRUBBER_PRESSURE_VALVES_OVERRIDDEN',
      valvePressurePsi: this.valvePressurePsi,
      pressureValvesOverridden: this.pressureValvesOverridden
    });
    return {
      pressureValvesOverridden: this.pressureValvesOverridden,
      valvePressurePsi: this.valvePressurePsi
    };
  }

  jamCompressorTurbineWithMegafaunaFemur({
    femurShearResistanceKn = 92,
    rotorSeized = true
  } = {}) {
    if (!this.pressureValvesOverridden) {
      throw new Error('Pressure valves must be overridden before jamming the compressor turbine rotor.');
    }
    this.femurShearResistanceKn = Math.max(0, Number(femurShearResistanceKn) || 0);
    this.compressorRotorSeized =
      this.femurShearResistanceKn >= 80 && Boolean(rotorSeized);
    this.eventLog.push({
      step: 'COMPRESSOR_TURBINE_SEIZED_BY_FEMUR',
      femurShearResistanceKn: this.femurShearResistanceKn,
      compressorRotorSeized: this.compressorRotorSeized
    });
    return {
      compressorRotorSeized: this.compressorRotorSeized,
      femurShearResistanceKn: this.femurShearResistanceKn
    };
  }

  ruptureDefoliantTankIntoWyBarracks({
    rupturedLiters = 12000,
    wyGarrisonFrozen = 11,
    valleyAirRestored = true
  } = {}) {
    if (!this.compressorRotorSeized) {
      throw new Error('Compressor turbine must be seized before rupturing the cryo-defoliant tank.');
    }
    const liters = Math.max(0, Number(rupturedLiters) || 0);
    this.wyGarrisonFrozen = Math.max(0, Math.floor(Number(wyGarrisonFrozen) || 0));
    this.valleyAirRestored = Boolean(valleyAirRestored);
    this.defoliantTankRuptured =
      liters >= 10000 && this.wyGarrisonFrozen >= 8 && this.valleyAirRestored;
    if (this.defoliantTankRuptured) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'DEFOLIANT_TANK_RUPTURED_AND_AIR_RESTORED',
      rupturedLiters: liters,
      wyGarrisonFrozen: this.wyGarrisonFrozen,
      valleyAirRestored: this.valleyAirRestored,
      honorAwarded: this.honorAwarded
    });
    return {
      defoliantTankRuptured: this.defoliantTankRuptured,
      wyGarrisonFrozen: this.wyGarrisonFrozen,
      valleyAirRestored: this.valleyAirRestored,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      intakeVentsInfiltrated: this.intakeVentsInfiltrated,
      pressureValvesOverridden: this.pressureValvesOverridden,
      compressorRotorSeized: this.compressorRotorSeized,
      defoliantTankRuptured: this.defoliantTankRuptured,
      valleyAirRestored: this.valleyAirRestored,
      honorAwarded: this.honorAwarded
    };
  }
}
