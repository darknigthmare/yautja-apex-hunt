/**
 * Predator21990SubwayStrobeMassacreAndJerryStandoffSector (v218)
 *
 * Implements iconic 1:1 set-pieces from Predator 2 (1990):
 * 1. Subway carriage power blackout with emergency strobe lights flickering at 8 Hz.
 * 2. City Hunter cutting through the roof and deploying high-tensile wire net-gun.
 * 3. Detective Jerry Lambert drawing Desert Eagle fire to pull the hunter away from civilians.
 * 4. Close-quarters carriage combat and honoring Jerry's courageous last stand.
 */
export class Predator21990SubwayStrobeMassacreAndJerryStandoffSector {
  constructor() {
    this.sectorId = 'PREDATOR_2_1990_SUBWAY_STROBE_MASSACRE_AND_JERRY_STANDOFF';
    this.filmReference = 'Predator 2 (1990) - Subway Strobe Flicker, Carriage Roof Breach, Jerry Lambert Desert Eagle Standoff & Heroic Sacrifice';
    this.reset();
  }

  reset() {
    this.strobeLightBlackoutTriggered = false;
    this.carriageRoofCutBreached = false;
    this.jerryDistractionFireDischarged = false;
    this.heroicStandHonored = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  triggerSubwayStrobeFlickerBlackout({
    strobeFrequencyHz = 8.2,
    tunnelDarknessLux = 1.5
  } = {}) {
    const freq = Math.max(0, Number(strobeFrequencyHz) || 0);
    const lux = Math.max(0, Number(tunnelDarknessLux) || 0);
    this.strobeLightBlackoutTriggered = freq >= 5 && freq <= 15 && lux <= 5.0;
    this.eventLog.push({
      step: 'STROBE_LIGHT_BLACKOUT_TRIGGERED',
      strobeFrequencyHz: freq,
      tunnelDarknessLux: lux,
      strobeLightBlackoutTriggered: this.strobeLightBlackoutTriggered
    });
    return {
      strobeLightBlackoutTriggered: this.strobeLightBlackoutTriggered
    };
  }

  breachCarriageRoofWithSmartDisc({
    roofSheetSteelThicknessMm = 3.5,
    roofBreachSpeedSeconds = 2.8
  } = {}) {
    if (!this.strobeLightBlackoutTriggered) {
      throw new Error('Must trigger strobe blackout before cutting through carriage roof.');
    }
    const thick = Math.max(0, Number(roofSheetSteelThicknessMm) || 0);
    const speed = Math.max(0, Number(roofBreachSpeedSeconds) || 0);
    this.carriageRoofCutBreached = thick >= 2.0 && speed <= 5.0;
    this.eventLog.push({
      step: 'CARRIAGE_ROOF_CUT_BREACHED',
      roofSheetSteelThicknessMm: thick,
      roofBreachSpeedSeconds: speed,
      carriageRoofCutBreached: this.carriageRoofCutBreached
    });
    return {
      carriageRoofCutBreached: this.carriageRoofCutBreached,
      hunterInCarriage: true
    };
  }

  dischargeJerryDesertEagleDistraction({
    magRoundsFired = 8,
    civilianEvacuationWindowSeconds = 12
  } = {}) {
    if (!this.carriageRoofCutBreached) {
      throw new Error('Must breach carriage roof before Jerry opens distraction fire.');
    }
    const rounds = Math.max(0, Math.floor(Number(magRoundsFired) || 0));
    const evac = Math.max(0, Number(civilianEvacuationWindowSeconds) || 0);
    this.jerryDistractionFireDischarged = rounds >= 6 && evac >= 8;
    this.eventLog.push({
      step: 'JERRY_DISTRACTION_FIRE_DISCHARGED',
      magRoundsFired: rounds,
      civilianEvacuationWindowSeconds: evac,
      jerryDistractionFireDischarged: this.jerryDistractionFireDischarged
    });
    return {
      jerryDistractionFireDischarged: this.jerryDistractionFireDischarged,
      civiliansProtected: true
    };
  }

  honorJerryHeroicLastStand({
    macheteParryAttempted = true,
    warriorValianceScore = 0.98
  } = {}) {
    if (!this.jerryDistractionFireDischarged) {
      throw new Error('Must discharge distraction fire before honoring Jerry last stand.');
    }
    const val = Math.max(0, Math.min(1, Number(warriorValianceScore) || 0));
    this.heroicStandHonored = macheteParryAttempted && val >= 0.9;
    if (this.heroicStandHonored && this.honorAwarded === 0) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'HEROIC_STAND_HONORED',
      macheteParryAttempted,
      warriorValianceScore: val,
      heroicStandHonored: this.heroicStandHonored,
      honorAwarded: this.honorAwarded
    });
    return {
      heroicStandHonored: this.heroicStandHonored,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.strobeLightBlackoutTriggered &&
      this.carriageRoofCutBreached &&
      this.jerryDistractionFireDischarged &&
      this.heroicStandHonored &&
      this.honorAwarded >= 400
    );
  }
}
