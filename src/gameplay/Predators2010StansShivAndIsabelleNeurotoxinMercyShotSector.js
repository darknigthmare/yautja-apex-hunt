/**
 * Chantier 5 (v203) : Assaut au Surin de Prison de Stans & Tir .50 BMG d'Isabelle (2010) + Colis Postal de Quinn McKenna (2018)
 * Complète en fidélité 1:1 le sacrifice de Walter Stans poignardant 9 fois Berserker avec son surin
 * de San Quentin et le tir couché d'Isabelle paralysée au Barrett .50 BMG (15 500 J) dans Predators
 * (2010), ainsi que l'expédition postale des reliques Yautja par Quinn McKenna vers la boîte postale
 * de Géorgie et l'activation du bouclier acoustique par Rory dans The Predator (2018).
 */
export class Predators2010StansShivAndIsabelleNeurotoxinMercyShotSector {
  constructor() {
    this.sectorId = 'PREDATORS_2010_STANS_SHIV_ISABELLE_SNIPE_AND_2018_POSTAL_RELICS';
    this.filmReference = 'Predators (2010) Stans Shiv & Isabelle .50 Cal + The Predator (2018) McKenna Postal Relics';
    this.reset();
  }

  reset() {
    this.stansShivDistractionCompleted = false;
    this.isabelleParalyzedFiftyCalShotLanded = false;
    this.quinnPostalRelicsDelivered = false;
    this.roryAcousticShieldTriggered = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  stansLeapAndFuryStabBerserkerWithPrisonShiv({
    shivStrikesLanded = 9,
    distractionSecondsGained = 14
  } = {}) {
    const strikes = Math.max(0, Math.floor(Number(shivStrikesLanded) || 0));
    const seconds = Math.max(0, Number(distractionSecondsGained) || 0);
    this.stansShivDistractionCompleted = strikes >= 7 && seconds >= 10;
    this.eventLog.push({
      step: 'STANS_PRISON_SHIV_BERSERKER_DISTRACTION',
      shivStrikesLanded: strikes,
      distractionSecondsGained: seconds,
      stansShivDistractionCompleted: this.stansShivDistractionCompleted
    });
    return {
      stansShivDistractionCompleted: this.stansShivDistractionCompleted,
      shivStrikesLanded: strikes
    };
  }

  isabelleParalyzedSnipeBerserkerWithFiftyCal({
    bulletKineticEnergyJoules = 15500,
    berserkerStaggered = true
  } = {}) {
    if (!this.stansShivDistractionCompleted) {
      throw new Error('Stans shiv distraction must occur before Isabelle takes the .50 BMG shot on Berserker.');
    }
    const joules = Math.max(0, Number(bulletKineticEnergyJoules) || 0);
    this.isabelleParalyzedFiftyCalShotLanded =
      joules >= 14000 && Boolean(berserkerStaggered);
    this.eventLog.push({
      step: 'ISABELLE_PARALYZED_FIFTY_CAL_SNIPE',
      bulletKineticEnergyJoules: joules,
      isabelleParalyzedFiftyCalShotLanded: this.isabelleParalyzedFiftyCalShotLanded
    });
    return {
      isabelleParalyzedFiftyCalShotLanded: this.isabelleParalyzedFiftyCalShotLanded,
      bulletKineticEnergyJoules: joules
    };
  }

  quinnMcKennaMailYautjaRelicsToGeorgiaPoBox({
    cloakingOrbSwallowed = true,
    packageDeliveredToRory = true
  } = {}) {
    if (!this.isabelleParalyzedFiftyCalShotLanded) {
      throw new Error('2010 preserve sequence must complete before Quinn McKenna mails the 2018 Yautja relics.');
    }
    this.quinnPostalRelicsDelivered =
      Boolean(cloakingOrbSwallowed) && Boolean(packageDeliveredToRory);
    this.eventLog.push({
      step: 'QUINN_MCKENNA_POSTAL_RELICS_DELIVERED',
      quinnPostalRelicsDelivered: this.quinnPostalRelicsDelivered
    });
    return {
      quinnPostalRelicsDelivered: this.quinnPostalRelicsDelivered
    };
  }

  roryActivateBioMaskShieldAgainstSuburbanBully({
    acousticWaveTriggered = true,
    neighborhoodSaved = true
  } = {}) {
    if (!this.quinnPostalRelicsDelivered) {
      throw new Error('Postal package must be delivered to Rory before he activates the bio-mask shield.');
    }
    this.roryAcousticShieldTriggered =
      Boolean(acousticWaveTriggered) && Boolean(neighborhoodSaved);
    if (this.roryAcousticShieldTriggered) {
      this.honorAwarded = 450;
    }
    this.eventLog.push({
      step: 'RORY_BIOMASK_ACOUSTIC_SHIELD_TRIGGERED',
      roryAcousticShieldTriggered: this.roryAcousticShieldTriggered,
      honorAwarded: this.honorAwarded
    });
    return {
      roryAcousticShieldTriggered: this.roryAcousticShieldTriggered,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      stansShivDistractionCompleted: this.stansShivDistractionCompleted,
      isabelleParalyzedFiftyCalShotLanded: this.isabelleParalyzedFiftyCalShotLanded,
      quinnPostalRelicsDelivered: this.quinnPostalRelicsDelivered,
      roryAcousticShieldTriggered: this.roryAcousticShieldTriggered,
      honorAwarded: this.honorAwarded
    };
  }
}
