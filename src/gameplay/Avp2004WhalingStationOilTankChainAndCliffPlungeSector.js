/**
 * Avp2004WhalingStationOilTankChainAndCliffPlungeSector (v215)
 *
 * Implements iconic 1:1 set-pieces from Alien vs. Predator (2004):
 * 1. Securing heavy industrial winch chains across the colossal Xenomorph Queen's chitin carapace.
 * 2. Firing Scar's wrist-blade launcher to lock the chain links to the massive oil reservoir tank.
 * 3. Releasing the 18-metric-ton oil tank over the edge of the Bouvetøya coastal ocean cliff.
 * 4. Leaping clear onto coastal snowdrifts alongside Lex Woods as the Queen is dragged into the abyssal ocean.
 */
export class Avp2004WhalingStationOilTankChainAndCliffPlungeSector {
  constructor() {
    this.sectorId = 'AVP_2004_WHALING_STATION_OIL_TANK_CHAIN_AND_CLIFF_PLUNGE';
    this.filmReference = 'Alien vs. Predator (2004) - Whaling Station Pier, Industrial Winch Chain, Oil Reservoir Drop & Queen Abyssal Plunge';
    this.reset();
  }

  reset() {
    this.industrialWinchChainSecured = false;
    this.wristBladeChainLockFired = false;
    this.oilTankCliffReleaseTriggered = false;
    this.coastalSnowdriftLeapEscaped = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  secureIndustrialWinchChainToQueenCarapace({
    chainTensileKn = 650,
    linkPinned = true
  } = {}) {
    const kn = Math.max(0, Number(chainTensileKn) || 0);
    this.industrialWinchChainSecured = kn >= 450 && Boolean(linkPinned);
    this.eventLog.push({
      step: 'INDUSTRIAL_WINCH_CHAIN_SECURED',
      chainTensileKn: kn,
      linkPinned: Boolean(linkPinned),
      industrialWinchChainSecured: this.industrialWinchChainSecured
    });
    return {
      industrialWinchChainSecured: this.industrialWinchChainSecured,
      chainTensileKn: kn
    };
  }

  launchWristBladeToLockChainToOilReservoir({
    bladeSpeedMps = 48,
    reservoirTankLocked = true
  } = {}) {
    if (!this.industrialWinchChainSecured) {
      throw new Error('Must secure industrial winch chain before firing wrist-blade locking pin.');
    }
    const speed = Math.max(0, Number(bladeSpeedMps) || 0);
    this.wristBladeChainLockFired = speed >= 35 && Boolean(reservoirTankLocked);
    this.eventLog.push({
      step: 'WRIST_BLADE_CHAIN_LOCK_FIRED',
      bladeSpeedMps: speed,
      reservoirTankLocked: Boolean(reservoirTankLocked),
      wristBladeChainLockFired: this.wristBladeChainLockFired
    });
    return {
      wristBladeChainLockFired: this.wristBladeChainLockFired,
      bladeSpeedMps: speed
    };
  }

  triggerTankReleaseDownOceanCliff({
    tankMassMetricTons = 18,
    cliffDropMeters = 110
  } = {}) {
    if (!this.wristBladeChainLockFired) {
      throw new Error('Chain must be locked to reservoir tank before triggering cliff drop.');
    }
    const tons = Math.max(0, Number(tankMassMetricTons) || 0);
    const drop = Math.max(0, Number(cliffDropMeters) || 0);
    this.oilTankCliffReleaseTriggered = tons >= 12 && drop >= 80;
    this.eventLog.push({
      step: 'OIL_TANK_CLIFF_RELEASE_TRIGGERED',
      tankMassMetricTons: tons,
      cliffDropMeters: drop,
      oilTankCliffReleaseTriggered: this.oilTankCliffReleaseTriggered
    });
    return {
      oilTankCliffReleaseTriggered: this.oilTankCliffReleaseTriggered,
      tankMassMetricTons: tons
    };
  }

  leapClearOntoCoastalSnowdriftWithLexWoods({
    leapDistanceMeters = 6.2,
    queenPlungeConfirmed = true
  } = {}) {
    if (!this.oilTankCliffReleaseTriggered) {
      throw new Error('Oil tank must be plummeting before leaping clear of the collapsing pier.');
    }
    const dist = Math.max(0, Number(leapDistanceMeters) || 0);
    this.coastalSnowdriftLeapEscaped = dist >= 4.0 && Boolean(queenPlungeConfirmed);
    if (this.coastalSnowdriftLeapEscaped) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'COASTAL_SNOWDRIFT_LEAP_ESCAPED',
      leapDistanceMeters: dist,
      queenPlungeConfirmed: Boolean(queenPlungeConfirmed),
      coastalSnowdriftLeapEscaped: this.coastalSnowdriftLeapEscaped,
      honorAwarded: this.honorAwarded
    });
    return {
      coastalSnowdriftLeapEscaped: this.coastalSnowdriftLeapEscaped,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      industrialWinchChainSecured: this.industrialWinchChainSecured,
      wristBladeChainLockFired: this.wristBladeChainLockFired,
      oilTankCliffReleaseTriggered: this.oilTankCliffReleaseTriggered,
      coastalSnowdriftLeapEscaped: this.coastalSnowdriftLeapEscaped,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetryState() {
    return this.getTelemetry();
  }
}
