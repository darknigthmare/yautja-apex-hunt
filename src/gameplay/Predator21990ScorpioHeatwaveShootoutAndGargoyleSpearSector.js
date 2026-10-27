/**
 * Predator21990ScorpioHeatwaveShootoutAndGargoyleSpearSector (v207)
 *
 * Implements iconic 1:1 set-pieces from Predator 2 (1990):
 * 1. Mike Harrigan breaching the Scorpio Cartel penthouse during the oppressive 109°F Los Angeles heatwave,
 *    gunning down heavy cartel shooters.
 * 2. The City Hunter perching atop the gothic skyscraper gargoyle, hoisting his combi-spear aloft to channel a 45 kA lightning bolt.
 * 3. Danny Archuleta extracting the combi-spear tip embedded in the slaughterhouse wall,
 *    forensics confirming a non-ferrous alloy with an atomic weight unknown to the periodic table.
 * 4. Harrigan chasing El Scorpio onto the sizzling asphalt rooftop under the blistering sun.
 */
export class Predator21990ScorpioHeatwaveShootoutAndGargoyleSpearSector {
  constructor() {
    this.sectorId = 'PREDATOR_2_1990_SCORPIO_HEATWAVE_SHOOTOUT_AND_GARGOYLE_SPEAR';
    this.filmReference = 'Predator 2 (1990) - 109°F Scorpio Shootout, Gargoyle Lightning Strike & Non-Ferrous Spear Tip';
    this.reset();
  }

  reset() {
    this.scorpioPenthouseBreached = false;
    this.gargoyleLightningSpearAloft = false;
    this.spearTipNonFerrousAlloyConfirmed = false;
    this.elScorpioCorneredOnRooftop = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  breachScorpioCartelPenthouseInHeatwave({
    ambientTempFahrenheit = 109,
    scorpioGunnersDowned = 6
  } = {}) {
    const temp = Math.max(0, Number(ambientTempFahrenheit) || 0);
    const gunners = Math.max(0, Math.floor(Number(scorpioGunnersDowned) || 0));
    this.scorpioPenthouseBreached = temp >= 100 && gunners >= 5;
    this.eventLog.push({
      step: 'SCORPIO_PENTHOUSE_BREACHED_IN_HEATWAVE',
      ambientTempFahrenheit: temp,
      scorpioGunnersDowned: gunners,
      scorpioPenthouseBreached: this.scorpioPenthouseBreached
    });
    return {
      scorpioPenthouseBreached: this.scorpioPenthouseBreached,
      ambientTempFahrenheit: temp
    };
  }

  hoistCombiSpearAloftGargoyleInLightningStorm({
    lightningCurrentKiloAmps = 45,
    lightningSpearAloft = true
  } = {}) {
    if (!this.scorpioPenthouseBreached) {
      throw new Error('Penthouse shootout must conclude before City Hunter gargoyle lightning stance.');
    }
    const current = Math.max(0, Number(lightningCurrentKiloAmps) || 0);
    this.gargoyleLightningSpearAloft = current >= 35 && Boolean(lightningSpearAloft);
    this.eventLog.push({
      step: 'GARGOYLE_LIGHTNING_SPEAR_ALOFT',
      lightningCurrentKiloAmps: current,
      gargoyleLightningSpearAloft: this.gargoyleLightningSpearAloft
    });
    return {
      gargoyleLightningSpearAloft: this.gargoyleLightningSpearAloft,
      lightningCurrentKiloAmps: current
    };
  }

  extractDannyArchuletaSpearTipNonFerrousAlloy({
    atomicWeightOffChart = true,
    periodicTableAnomalyConfirmed = true
  } = {}) {
    if (!this.gargoyleLightningSpearAloft) {
      throw new Error('Gargoyle sequence must complete before forensic analysis of recovered spear tip.');
    }
    this.spearTipNonFerrousAlloyConfirmed =
      Boolean(atomicWeightOffChart) && Boolean(periodicTableAnomalyConfirmed);
    this.eventLog.push({
      step: 'SPEAR_TIP_NON_FERROUS_ALLOY_CONFIRMED',
      spearTipNonFerrousAlloyConfirmed: this.spearTipNonFerrousAlloyConfirmed
    });
    return {
      spearTipNonFerrousAlloyConfirmed: this.spearTipNonFerrousAlloyConfirmed
    };
  }

  cornerElScorpioOnSizzlingAsphaltRooftop({
    rooftopPursuitResolved = true,
    harriganVictorious = true
  } = {}) {
    if (!this.spearTipNonFerrousAlloyConfirmed) {
      throw new Error('Spear tip forensics must be logged before Harrigan tracks El Scorpio onto roof.');
    }
    this.elScorpioCorneredOnRooftop = Boolean(rooftopPursuitResolved) && Boolean(harriganVictorious);
    if (this.elScorpioCorneredOnRooftop) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'CORNER_EL_SCORPIO_ON_SIZZLING_ASPHALT_ROOFTOP',
      elScorpioCorneredOnRooftop: this.elScorpioCorneredOnRooftop,
      honorAwarded: this.honorAwarded
    });
    return {
      elScorpioCorneredOnRooftop: this.elScorpioCorneredOnRooftop,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      scorpioPenthouseBreached: this.scorpioPenthouseBreached,
      gargoyleLightningSpearAloft: this.gargoyleLightningSpearAloft,
      spearTipNonFerrousAlloyConfirmed: this.spearTipNonFerrousAlloyConfirmed,
      elScorpioCorneredOnRooftop: this.elScorpioCorneredOnRooftop,
      honorAwarded: this.honorAwarded
    };
  }
}
