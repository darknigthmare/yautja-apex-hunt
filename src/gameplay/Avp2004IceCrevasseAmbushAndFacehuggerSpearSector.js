/**
 * Avp2004IceCrevasseAmbushAndFacehuggerSpearSector (v214)
 *
 * Implements iconic 1:1 set-pieces from Alien vs. Predator (2004):
 * 1. Navigating sub-zero glacial ice crevasses while ascending from the subterranean pyramid to the surface.
 * 2. Impaling an ambushing Facehugger mid-flight with a precision combi-stick spear thrust.
 * 3. Bisecting an ambushing Xenomorph drone in a narrow ice fissure using the smart-disc.
 * 4. Priming the geothermal generator self-destruct countdown mechanism prior to the final surface sprint.
 */
export class Avp2004IceCrevasseAmbushAndFacehuggerSpearSector {
  constructor() {
    this.sectorId = 'AVP_2004_ICE_CREVASSE_AMBUSH_AND_FACEHUGGER_SPEAR';
    this.filmReference = 'Alien vs. Predator (2004) - Glacial Crevasse Ascent, Mid-air Facehugger Impalement, Smart-disc Drone Bisection & Purge Countdown';
    this.reset();
  }

  reset() {
    this.iceCrevasseTunnelNavigated = false;
    this.midairFacehuggerImpaled = false;
    this.crevasseDroneBisected = false;
    this.geothermalPurgeCountdownPrimed = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  navigateIceCrevasseTunnelTowardsSurface({
    tunnelLengthMeters = 480,
    subzeroTempCelsius = -35
  } = {}) {
    const len = Math.max(0, Number(tunnelLengthMeters) || 0);
    const temp = Number(subzeroTempCelsius) || -35;
    this.iceCrevasseTunnelNavigated = len >= 350 && temp <= -20;
    this.eventLog.push({
      step: 'ICE_CREVASSE_TUNNEL_NAVIGATED',
      tunnelLengthMeters: len,
      subzeroTempCelsius: temp,
      iceCrevasseTunnelNavigated: this.iceCrevasseTunnelNavigated
    });
    return {
      iceCrevasseTunnelNavigated: this.iceCrevasseTunnelNavigated,
      tunnelLengthMeters: len
    };
  }

  impaleMidairLeapingFacehuggerWithCombistick({
    combistickThrustMps = 24,
    facehuggerAcidNeutralized = true
  } = {}) {
    if (!this.iceCrevasseTunnelNavigated) {
      throw new Error('Must navigate ice crevasse tunnel before Facehuggers emerge from the ice fissures.');
    }
    const speed = Math.max(0, Number(combistickThrustMps) || 0);
    this.midairFacehuggerImpaled = speed >= 18 && Boolean(facehuggerAcidNeutralized);
    this.eventLog.push({
      step: 'MIDAIR_FACEHUGGER_IMPALED',
      combistickThrustMps: speed,
      facehuggerAcidNeutralized: Boolean(facehuggerAcidNeutralized),
      midairFacehuggerImpaled: this.midairFacehuggerImpaled
    });
    return {
      midairFacehuggerImpaled: this.midairFacehuggerImpaled,
      combistickThrustMps: speed
    };
  }

  severAmbushingCrevasseDroneWithSmartDisc({
    discThrowVelocityMps = 68,
    droneBisected = true
  } = {}) {
    if (!this.midairFacehuggerImpaled) {
      throw new Error('Mid-air Facehugger must be impaled before throwing smart-disc at the ambushing drone.');
    }
    const vel = Math.max(0, Number(discThrowVelocityMps) || 0);
    this.crevasseDroneBisected = vel >= 50 && Boolean(droneBisected);
    this.eventLog.push({
      step: 'CREVASSE_DRONE_BISECTED',
      discThrowVelocityMps: vel,
      droneBisected: Boolean(droneBisected),
      crevasseDroneBisected: this.crevasseDroneBisected
    });
    return {
      crevasseDroneBisected: this.crevasseDroneBisected,
      discThrowVelocityMps: vel
    };
  }

  primeGeothermalPurgeGeneratorCountdown({
    generatorTempCelsius = 420,
    countdownSynchronized = true
  } = {}) {
    if (!this.crevasseDroneBisected) {
      throw new Error('Crevasse drone must be bisected before synchronizing geothermal generator countdown.');
    }
    const temp = Math.max(0, Number(generatorTempCelsius) || 0);
    this.geothermalPurgeCountdownPrimed = temp >= 300 && Boolean(countdownSynchronized);
    if (this.geothermalPurgeCountdownPrimed) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'GEOTHERMAL_PURGE_COUNTDOWN_PRIMED',
      generatorTempCelsius: temp,
      countdownSynchronized: Boolean(countdownSynchronized),
      geothermalPurgeCountdownPrimed: this.geothermalPurgeCountdownPrimed,
      honorAwarded: this.honorAwarded
    });
    return {
      geothermalPurgeCountdownPrimed: this.geothermalPurgeCountdownPrimed,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      iceCrevasseTunnelNavigated: this.iceCrevasseTunnelNavigated,
      midairFacehuggerImpaled: this.midairFacehuggerImpaled,
      crevasseDroneBisected: this.crevasseDroneBisected,
      geothermalPurgeCountdownPrimed: this.geothermalPurgeCountdownPrimed,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetryState() {
    return this.getTelemetry();
  }
}
