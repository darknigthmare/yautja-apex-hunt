/**
 * Chantier 2 (v201) : Fusillade d'Ouverture à Los Angeles (42,8°C) & Pointe de Lance de Danny Archuleta (Predator 2 - 1990)
 * Complète en fidélité 1:1 les séquences manquantes de Predator 2 (1990) : charge de Harrigan au
 * volant de sa Ford LTD Crown Victoria à 78 km/h à travers les barricades sous la canicule de
 * 109°F (42,8°C), et retour nocturne de l'inspecteur Danny Archuleta dans le penthouse colombien
 * pour extraire la pointe de lance en alliage extraterrestre incrustée dans la bouche d'aération.
 */
export class Predator21990ColombianScorpioCartelRooftopBreachSector {
  constructor() {
    this.sectorId = 'PREDATOR_2_1990_SCORPIO_BARRICADE_AND_ARCHULETA_SPEAR_TIP';
    this.filmReference = 'Predator 2 (1990) - LA Heatwave Crown Vic Barricade Charge & Danny Archuleta Spear-Tip Recovery';
    this.heatwaveTempCelsius = 42.8;
    this.reset();
  }

  reset() {
    this.barricadeRammedWithCrownVic = false;
    this.pinnedOfficersRescued = 0;
    this.penthouseAcDuctReached = false;
    this.spearTipPriedFromVent = false;
    this.cityHunterCeilingAmbushTriggered = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  ramStreetBarricadeWithCrownVic({
    vehicleSpeedKmh = 78,
    pinnedOfficersRescued = 2
  } = {}) {
    const speed = Math.max(0, Number(vehicleSpeedKmh) || 0);
    this.pinnedOfficersRescued = Math.max(0, Math.floor(Number(pinnedOfficersRescued) || 0));
    this.barricadeRammedWithCrownVic = speed >= 65 && this.pinnedOfficersRescued >= 2;
    this.eventLog.push({
      step: 'CROWN_VIC_STREET_BARRICADE_RAMMED',
      vehicleSpeedKmh: speed,
      pinnedOfficersRescued: this.pinnedOfficersRescued,
      barricadeRammedWithCrownVic: this.barricadeRammedWithCrownVic
    });
    return {
      barricadeRammedWithCrownVic: this.barricadeRammedWithCrownVic,
      pinnedOfficersRescued: this.pinnedOfficersRescued
    };
  }

  climbPenthouseTableToAirConditioningDuct({
    ceilingHeightMeters = 4.2,
    thermalFloorHeatCelsius = 42.8
  } = {}) {
    if (!this.barricadeRammedWithCrownVic) {
      throw new Error('Street barricade sequence must complete before Danny Archuleta inspects the penthouse AC duct.');
    }
    const height = Math.max(0, Number(ceilingHeightMeters) || 0);
    const heat = Math.max(0, Number(thermalFloorHeatCelsius) || 0);
    this.penthouseAcDuctReached = height >= 3.5 && heat >= 40.0;
    this.eventLog.push({
      step: 'PENTHOUSE_AC_DUCT_REACHED_BY_ARCHULETA',
      ceilingHeightMeters: height,
      thermalFloorHeatCelsius: heat,
      penthouseAcDuctReached: this.penthouseAcDuctReached
    });
    return {
      penthouseAcDuctReached: this.penthouseAcDuctReached,
      ceilingHeightMeters: height
    };
  }

  pryOutYautjaAlloySpearTipFromVent({
    alloyAtomicNumberUnknown = true,
    forensicEvidenceBagged = true
  } = {}) {
    if (!this.penthouseAcDuctReached) {
      throw new Error('Penthouse AC duct must be reached before prying out the Yautja spear tip.');
    }
    this.spearTipPriedFromVent =
      Boolean(alloyAtomicNumberUnknown) && Boolean(forensicEvidenceBagged);
    this.eventLog.push({
      step: 'YAUTJA_ALLOY_SPEAR_TIP_PRIED',
      spearTipPriedFromVent: this.spearTipPriedFromVent
    });
    return {
      spearTipPriedFromVent: this.spearTipPriedFromVent
    };
  }

  triggerCityHunterCeilingThermalDropAmbush({
    cloakShimmerLux = 3.2
  } = {}) {
    if (!this.spearTipPriedFromVent) {
      throw new Error('Spear tip must be pried from the vent before triggering the City Hunter ceiling ambush.');
    }
    const lux = Math.max(0, Number(cloakShimmerLux) || 0);
    this.cityHunterCeilingAmbushTriggered = lux > 0 && lux <= 8.0;
    if (this.cityHunterCeilingAmbushTriggered) {
      this.honorAwarded = 350;
    }
    this.eventLog.push({
      step: 'CITY_HUNTER_CEILING_AMBUSH_TRIGGERED',
      cloakShimmerLux: lux,
      cityHunterCeilingAmbushTriggered: this.cityHunterCeilingAmbushTriggered,
      honorAwarded: this.honorAwarded
    });
    return {
      cityHunterCeilingAmbushTriggered: this.cityHunterCeilingAmbushTriggered,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      barricadeRammedWithCrownVic: this.barricadeRammedWithCrownVic,
      penthouseAcDuctReached: this.penthouseAcDuctReached,
      spearTipPriedFromVent: this.spearTipPriedFromVent,
      cityHunterCeilingAmbushTriggered: this.cityHunterCeilingAmbushTriggered,
      honorAwarded: this.honorAwarded
    };
  }
}
