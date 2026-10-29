/**
 * Predator21990SubCarriageTrackSweepAndJerryMacheteSector (v222)
 *
 * Implements iconic 1:1 canonical set-pieces from Predator 2 (1990):
 * 1. Commuter rescue along the electrified subway tracks under 750V third-rail arcs.
 * 2. Lieutenant Harrigan guiding commuters into the tunnel maintenance catwalk.
 * 3. City Hunter dropping beneath the carriage, using the smart-disc to sever steel brake conduits.
 * 4. Point-blank shotgun blast to the City Hunter's shoulder, shattering its plasma caster mount.
 */
export class Predator21990SubCarriageTrackSweepAndJerryMacheteSector {
  constructor() {
    this.sectorId = 'PREDATOR_2_1990_SUB_CARRIAGE_TRACK_SWEEP_AND_JERRY_MACHETE';
    this.filmReference = 'Predator 2 (1990) - Subway Tunnel Third-Rail Arcs, Undercarriage Disc Sweep & Caster Shatter';
    this.reset();
  }

  reset() {
    this.thirdRailArcEvaded = false;
    this.commutersEvacuatedToCatwalk = false;
    this.undercarriageDiscSweepExecuted = false;
    this.plasmaCasterMountShattered = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  evadeThirdRailElectricalArcs({
    thirdRailVoltage = 750,
    sparkGapMeters = 0.8
  } = {}) {
    const volt = Math.max(0, Number(thirdRailVoltage) || 0);
    const gap = Math.max(0, Number(sparkGapMeters) || 0);
    this.thirdRailArcEvaded = volt >= 600 && gap <= 1.2;
    this.eventLog.push({
      step: 'THIRD_RAIL_ARC_EVADED',
      thirdRailVoltage: volt,
      sparkGapMeters: gap,
      thirdRailArcEvaded: this.thirdRailArcEvaded
    });
    return {
      thirdRailArcEvaded: this.thirdRailArcEvaded
    };
  }

  evacuateCommutersToTunnelCatwalk({
    commuterCount = 18,
    catwalkSecured = true
  } = {}) {
    if (!this.thirdRailArcEvaded) {
      throw new Error('Must evade third-rail arcs before evacuating commuters.');
    }
    const count = Math.max(0, Number(commuterCount) || 0);
    this.commutersEvacuatedToCatwalk = count >= 12 && catwalkSecured === true;
    this.eventLog.push({
      step: 'COMMUTERS_EVACUATED_TO_CATWALK',
      commuterCount: count,
      catwalkSecured,
      commutersEvacuatedToCatwalk: this.commutersEvacuatedToCatwalk
    });
    return {
      commutersEvacuatedToCatwalk: this.commutersEvacuatedToCatwalk
    };
  }

  executeUndercarriageSmartDiscSweep({
    discRotationRpm = 6400,
    steelConduitSevered = true
  } = {}) {
    if (!this.commutersEvacuatedToCatwalk) {
      throw new Error('Must evacuate commuters before executing undercarriage smart-disc sweep.');
    }
    const rpm = Math.max(0, Number(discRotationRpm) || 0);
    this.undercarriageDiscSweepExecuted = rpm >= 5000 && steelConduitSevered === true;
    this.eventLog.push({
      step: 'UNDERCARRIAGE_DISC_SWEEP_EXECUTED',
      discRotationRpm: rpm,
      steelConduitSevered,
      undercarriageDiscSweepExecuted: this.undercarriageDiscSweepExecuted
    });
    return {
      undercarriageDiscSweepExecuted: this.undercarriageDiscSweepExecuted
    };
  }

  shatterCasterMountWithPointBlankSlug({
    slugImpactJoules = 4900,
    casterMountDestroyed = true
  } = {}) {
    if (!this.undercarriageDiscSweepExecuted) {
      throw new Error('Must execute undercarriage disc sweep before shattering caster mount.');
    }
    const joules = Math.max(0, Number(slugImpactJoules) || 0);
    this.plasmaCasterMountShattered = joules >= 3800 && casterMountDestroyed === true;
    if (this.plasmaCasterMountShattered) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'PLASMA_CASTER_MOUNT_SHATTERED',
      slugImpactJoules: joules,
      casterMountDestroyed,
      plasmaCasterMountShattered: this.plasmaCasterMountShattered,
      honorAwarded: this.honorAwarded
    });
    return {
      plasmaCasterMountShattered: this.plasmaCasterMountShattered,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.thirdRailArcEvaded &&
      this.commutersEvacuatedToCatwalk &&
      this.undercarriageDiscSweepExecuted &&
      this.plasmaCasterMountShattered &&
      this.honorAwarded === 400
    );
  }
}
