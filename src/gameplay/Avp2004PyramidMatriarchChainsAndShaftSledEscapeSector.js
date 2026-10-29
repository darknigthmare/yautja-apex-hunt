/**
 * Avp2004PyramidMatriarchChainsAndShaftSledEscapeSector (v218)
 *
 * Implements iconic 1:1 set-pieces from Alien vs. Predator (2004):
 * 1. Deep sub-level cryogenic chamber housing the chained Xenomorph Queen.
 * 2. Thermal fluid injectors heating the Queen's carapace and initiating egg-laying cycle.
 * 3. Arming the gauntlet bomb countdown timer upon the sacrificial pedestal.
 * 4. High-speed winch sled escape up the 2,000-foot ice bore shaft as the explosion erupts below.
 */
export class Avp2004PyramidMatriarchChainsAndShaftSledEscapeSector {
  constructor() {
    this.sectorId = 'AVP_2004_PYRAMID_MATRIARCH_CHAINS_AND_SHAFT_SLED_ESCAPE';
    this.filmReference = 'AVP (2004) - Chained Matriarch Chamber, Thermal Thaw Injectors, Gauntlet Pedestal Timer & Ice Shaft Sled Ascent';
    this.reset();
  }

  reset() {
    this.matriarchChamberReached = false;
    this.thermalThawInjectorsTriggered = false;
    this.pedestalBombTimerArmed = false;
    this.shaftSledAscentCompleted = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  enterChainedMatriarchChamber({
    chamberDepthMeters = 610,
    chainTensileStrengthKpa = 8500
  } = {}) {
    const depth = Math.max(0, Number(chamberDepthMeters) || 0);
    const kpa = Math.max(0, Number(chainTensileStrengthKpa) || 0);
    this.matriarchChamberReached = depth >= 500 && kpa >= 5000;
    this.eventLog.push({
      step: 'MATRIARCH_CHAMBER_REACHED',
      chamberDepthMeters: depth,
      chainTensileStrengthKpa: kpa,
      matriarchChamberReached: this.matriarchChamberReached
    });
    return {
      matriarchChamberReached: this.matriarchChamberReached
    };
  }

  triggerThermalThawInjectors({
    fluidTempCelsius = 165,
    carapaceThawRateMmPerMin = 24
  } = {}) {
    if (!this.matriarchChamberReached) {
      throw new Error('Must reach matriarch chamber before triggering thermal injectors.');
    }
    const temp = Math.max(0, Number(fluidTempCelsius) || 0);
    const rate = Math.max(0, Number(carapaceThawRateMmPerMin) || 0);
    this.thermalThawInjectorsTriggered = temp >= 120 && rate >= 15;
    this.eventLog.push({
      step: 'THERMAL_THAW_INJECTORS_TRIGGERED',
      fluidTempCelsius: temp,
      carapaceThawRateMmPerMin: rate,
      thermalThawInjectorsTriggered: this.thermalThawInjectorsTriggered
    });
    return {
      thermalThawInjectorsTriggered: this.thermalThawInjectorsTriggered,
      queenAwakened: true
    };
  }

  armPedestalGauntletBombTimer({
    countdownSeconds = 240,
    yieldKilotonEquivalent = 2.4
  } = {}) {
    if (!this.thermalThawInjectorsTriggered) {
      throw new Error('Must trigger thaw injectors before arming pedestal gauntlet bomb.');
    }
    const sec = Math.max(0, Number(countdownSeconds) || 0);
    const yieldKt = Math.max(0, Number(yieldKilotonEquivalent) || 0);
    this.pedestalBombTimerArmed = sec <= 300 && yieldKt >= 1.5;
    this.eventLog.push({
      step: 'PEDESTAL_BOMB_TIMER_ARMED',
      countdownSeconds: sec,
      yieldKilotonEquivalent: yieldKt,
      pedestalBombTimerArmed: this.pedestalBombTimerArmed
    });
    return {
      pedestalBombTimerArmed: this.pedestalBombTimerArmed
    };
  }

  executeShaftWinchSledAscent({
    ascentSpeedMs = 28,
    shaftVerticalMeters = 610
  } = {}) {
    if (!this.pedestalBombTimerArmed) {
      throw new Error('Must arm pedestal timer before initiating winch sled ascent.');
    }
    const speed = Math.max(0, Number(ascentSpeedMs) || 0);
    const meters = Math.max(0, Number(shaftVerticalMeters) || 0);
    this.shaftSledAscentCompleted = speed >= 20 && meters >= 500;
    if (this.shaftSledAscentCompleted && this.honorAwarded === 0) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'SHAFT_SLED_ASCENT_COMPLETED',
      ascentSpeedMs: speed,
      shaftVerticalMeters: meters,
      shaftSledAscentCompleted: this.shaftSledAscentCompleted,
      honorAwarded: this.honorAwarded
    });
    return {
      shaftSledAscentCompleted: this.shaftSledAscentCompleted,
      surfaceReached: true,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.matriarchChamberReached &&
      this.thermalThawInjectorsTriggered &&
      this.pedestalBombTimerArmed &&
      this.shaftSledAscentCompleted &&
      this.honorAwarded >= 400
    );
  }
}
