/**
 * Predators2010WaterfallJumpAndShipHullZeroGSector (v207)
 *
 * Implements iconic 1:1 set-pieces from Predators (2010) & The Predator (2018):
 * 1. Royce, Isabelle, and the survivors fleeing a pack of 6 quadrupedal Hell-Hounds through the alien jungle.
 * 2. Taking the desperate leap off a 60-meter jungle cliff waterfall into the deep pool below to wash away thermal tracking.
 * 3. Quinn McKenna and Casey Bracket climbing the exterior hull of the ascending Yautja spacecraft in zero gravity.
 * 4. Quinn using his energy gauntlet blade to slice through the forcefield turbine and sabotage the drive core.
 */
export class Predators2010WaterfallJumpAndShipHullZeroGSector {
  constructor() {
    this.sectorId = 'PREDATORS_2010_WATERFALL_JUMP_AND_SHIP_HULL_ZERO_G';
    this.filmReference = 'Predators (2010) 60m Waterfall Leap & The Predator (2018) Zero-G Ship Hull Turbine Sabotage';
    this.reset();
  }

  reset() {
    this.hellHoundPackEvaded = false;
    this.sixtyMeterWaterfallLeapSurvived = false;
    this.exteriorAscendingShipHullClimbed = false;
    this.shipForcefieldTurbineSabotaged = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  evadeHellHoundPackThroughAlienJungle({
    houndsPursuingCount = 6,
    hornTusksEvaded = true
  } = {}) {
    const count = Math.max(0, Math.floor(Number(houndsPursuingCount) || 0));
    this.hellHoundPackEvaded = count >= 4 && Boolean(hornTusksEvaded);
    this.eventLog.push({
      step: 'HELL_HOUND_PACK_EVADED',
      houndsPursuingCount: count,
      hellHoundPackEvaded: this.hellHoundPackEvaded
    });
    return {
      hellHoundPackEvaded: this.hellHoundPackEvaded,
      houndsPursuingCount: count
    };
  }

  leapOffSixtyMeterWaterfallCliffIntoDeepPool({
    cliffDropMeters = 60,
    waterImpactSurvived = true
  } = {}) {
    if (!this.hellHoundPackEvaded) {
      throw new Error('Hell-hounds must pursue group to the cliff edge before the waterfall leap.');
    }
    const drop = Math.max(0, Number(cliffDropMeters) || 0);
    this.sixtyMeterWaterfallLeapSurvived = drop >= 50 && Boolean(waterImpactSurvived);
    this.eventLog.push({
      step: 'SIXTY_METER_WATERFALL_LEAP_SURVIVED',
      cliffDropMeters: drop,
      sixtyMeterWaterfallLeapSurvived: this.sixtyMeterWaterfallLeapSurvived
    });
    return {
      sixtyMeterWaterfallLeapSurvived: this.sixtyMeterWaterfallLeapSurvived,
      cliffDropMeters: drop
    };
  }

  climbExteriorAscendingShipHullInZeroG({
    exteriorHullClimbed = true,
    atmosphericReentrySurvived = true
  } = {}) {
    if (!this.sixtyMeterWaterfallLeapSurvived) {
      throw new Error('2010 preserve river survival must precede the 2018 starship hull climb.');
    }
    this.exteriorAscendingShipHullClimbed =
      Boolean(exteriorHullClimbed) && Boolean(atmosphericReentrySurvived);
    this.eventLog.push({
      step: 'EXTERIOR_ASCENDING_SHIP_HULL_CLIMBED',
      exteriorAscendingShipHullClimbed: this.exteriorAscendingShipHullClimbed
    });
    return {
      exteriorAscendingShipHullClimbed: this.exteriorAscendingShipHullClimbed
    };
  }

  sliceShipForcefieldTurbineWithGauntletBlade({
    gauntletEnergyBladeActive = true,
    driveCoreSabotaged = true
  } = {}) {
    if (!this.exteriorAscendingShipHullClimbed) {
      throw new Error('Hull climb must reach turbine section before activating gauntlet energy blade.');
    }
    this.shipForcefieldTurbineSabotaged =
      Boolean(gauntletEnergyBladeActive) && Boolean(driveCoreSabotaged);
    if (this.shipForcefieldTurbineSabotaged) {
      this.honorAwarded = 450;
    }
    this.eventLog.push({
      step: 'SHIP_FORCEFIELD_TURBINE_SABOTAGED',
      shipForcefieldTurbineSabotaged: this.shipForcefieldTurbineSabotaged,
      honorAwarded: this.honorAwarded
    });
    return {
      shipForcefieldTurbineSabotaged: this.shipForcefieldTurbineSabotaged,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      hellHoundPackEvaded: this.hellHoundPackEvaded,
      sixtyMeterWaterfallLeapSurvived: this.sixtyMeterWaterfallLeapSurvived,
      exteriorAscendingShipHullClimbed: this.exteriorAscendingShipHullClimbed,
      shipForcefieldTurbineSabotaged: this.shipForcefieldTurbineSabotaged,
      honorAwarded: this.honorAwarded
    };
  }
}
