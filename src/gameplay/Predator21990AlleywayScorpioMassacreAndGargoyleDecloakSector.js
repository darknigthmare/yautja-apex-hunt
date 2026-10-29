/**
 * Predator21990AlleywayScorpioMassacreAndGargoyleDecloakSector (v219)
 *
 * Implements iconic 1:1 canonical set-pieces from Predator 2 (1990):
 * 1. Infiltrating the fortified Colombian Scorpio gang alleyway and penthouse hideout during the heatwave.
 * 2. Deploying the high-tension netgun to pin Scorpio enforcers against brick walls.
 * 3. Hurling the telescoping combistick with hyper-velocity, skewering the cartel lieutenant through sheet metal.
 * 4. Decloaking atop an art-deco skyscraper lightning gargoyle amidst torrential downpour, roaring into the storm.
 */
export class Predator21990AlleywayScorpioMassacreAndGargoyleDecloakSector {
  constructor() {
    this.sectorId = 'PREDATOR_2_1990_ALLEYWAY_SCORPIO_MASSACRE_AND_GARGOYLE_DECLOAK';
    this.filmReference = 'Predator 2 (1990) - Scorpio Gang Hideout Ambush & Lightning Gargoyle Decloak';
    this.reset();
  }

  reset() {
    this.scorpioHideoutInfiltrated = false;
    this.wallNetgunTrapDeployed = false;
    this.combistickPiercingThrowExecuted = false;
    this.gargoyleDecloakCompleted = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  infiltrateScorpioCartelPenthouseAlley({
    gangMemberCount = 12,
    heavilyArmed = true
  } = {}) {
    const count = Math.max(0, Number(gangMemberCount) || 0);
    this.scorpioHideoutInfiltrated = count >= 8 && heavilyArmed === true;
    this.eventLog.push({
      step: 'SCORPIO_HIDEOUT_INFILTRATED',
      gangMemberCount: count,
      heavilyArmed,
      scorpioHideoutInfiltrated: this.scorpioHideoutInfiltrated
    });
    return {
      scorpioHideoutInfiltrated: this.scorpioHideoutInfiltrated
    };
  }

  deployWallPinningNetgunTrap({
    netTensileStrengthKpa = 3800,
    targetsPinned = 2
  } = {}) {
    if (!this.scorpioHideoutInfiltrated) {
      throw new Error('Must infiltrate Scorpio hideout before deploying wall-pinning netgun.');
    }
    const tension = Math.max(0, Number(netTensileStrengthKpa) || 0);
    const pinned = Math.max(0, Number(targetsPinned) || 0);
    this.wallNetgunTrapDeployed = tension >= 2500 && pinned >= 1;
    this.eventLog.push({
      step: 'WALL_NETGUN_TRAP_DEPLOYED',
      netTensileStrengthKpa: tension,
      targetsPinned: pinned,
      wallNetgunTrapDeployed: this.wallNetgunTrapDeployed
    });
    return {
      wallNetgunTrapDeployed: this.wallNetgunTrapDeployed
    };
  }

  executeCombistickPiercingThrow({
    throwVelocityMs = 55,
    wallPenetrationDepthCm = 15
  } = {}) {
    if (!this.wallNetgunTrapDeployed) {
      throw new Error('Must deploy netgun trap before executing combistick piercing throw.');
    }
    const velocity = Math.max(0, Number(throwVelocityMs) || 0);
    const depth = Math.max(0, Number(wallPenetrationDepthCm) || 0);
    this.combistickPiercingThrowExecuted = velocity >= 40 && depth >= 10;
    this.eventLog.push({
      step: 'COMBISTICK_PIERCING_THROW_EXECUTED',
      throwVelocityMs: velocity,
      wallPenetrationDepthCm: depth,
      combistickPiercingThrowExecuted: this.combistickPiercingThrowExecuted
    });
    return {
      combistickPiercingThrowExecuted: this.combistickPiercingThrowExecuted
    };
  }

  decloakOnLightningGargoyleInTorrentialDownpour({
    rainIntensityMmPerHour = 65,
    thunderstormDecibels = 118
  } = {}) {
    if (!this.combistickPiercingThrowExecuted) {
      throw new Error('Must execute combistick throw before decloaking on lightning gargoyle.');
    }
    const rain = Math.max(0, Number(rainIntensityMmPerHour) || 0);
    const db = Math.max(0, Number(thunderstormDecibels) || 0);
    this.gargoyleDecloakCompleted = rain >= 40 && db >= 100;
    if (this.gargoyleDecloakCompleted) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'GARGOYLE_DECLOAK_COMPLETED',
      rainIntensityMmPerHour: rain,
      thunderstormDecibels: db,
      gargoyleDecloakCompleted: this.gargoyleDecloakCompleted,
      honorAwarded: this.honorAwarded
    });
    return {
      gargoyleDecloakCompleted: this.gargoyleDecloakCompleted,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.scorpioHideoutInfiltrated &&
      this.wallNetgunTrapDeployed &&
      this.combistickPiercingThrowExecuted &&
      this.gargoyleDecloakCompleted &&
      this.honorAwarded === 400
    );
  }
}
