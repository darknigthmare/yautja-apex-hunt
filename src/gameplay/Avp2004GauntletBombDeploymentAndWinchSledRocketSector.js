/**
 * Avp2004GauntletBombDeploymentAndWinchSledRocketSector (v221)
 *
 * Implements iconic 1:1 canonical set-pieces from Alien vs. Predator (2004):
 * 1. Scar deploying the micro-nuclear gauntlet bomb timer onto the central pyramid altar pedestal.
 * 2. Lex Woods and Scar securing themselves into the high-speed motorized winch sled.
 * 3. Rocket sled ascending the 610m ice shaft at 32 m/s as subsurface shockwaves rise.
 * 4. Breaching through the surface whaling station ruins as the blast triggers a cataclysmic cave-in.
 */
export class Avp2004GauntletBombDeploymentAndWinchSledRocketSector {
  constructor() {
    this.sectorId = 'AVP_2004_GAUNTLET_BOMB_DEPLOYMENT_AND_WINCH_SLED_ROCKET';
    this.filmReference = 'Alien vs. Predator (2004) - Altar Gauntlet Bomb Deployment & Winch Sled 610m Ice Shaft Ascent';
    this.reset();
  }

  reset() {
    this.altarGauntletBombDeployed = false;
    this.winchSledHarnessSecured = false;
    this.iceShaftAscentExecuted = false;
    this.surfaceBlizzardBreached = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  deployPedestalGauntletBombTimer({
    countdownSeconds = 300,
    yieldEquivalentMegajoules = 120000
  } = {}) {
    const cd = Math.max(0, Number(countdownSeconds) || 0);
    const yld = Math.max(0, Number(yieldEquivalentMegajoules) || 0);
    this.altarGauntletBombDeployed = cd === 300 && yld >= 100000;
    this.eventLog.push({
      step: 'ALTAR_GAUNTLET_BOMB_DEPLOYED',
      countdownSeconds: cd,
      yieldEquivalentMegajoules: yld,
      altarGauntletBombDeployed: this.altarGauntletBombDeployed
    });
    return {
      altarGauntletBombDeployed: this.altarGauntletBombDeployed
    };
  }

  secureWinchSledHarness({
    harnessTensileStrengthKpa = 8500,
    cooperativeLockConfirmed = true
  } = {}) {
    if (!this.altarGauntletBombDeployed) {
      throw new Error('Must deploy pedestal bomb before securing winch sled harness.');
    }
    const kpa = Math.max(0, Number(harnessTensileStrengthKpa) || 0);
    this.winchSledHarnessSecured = kpa >= 6500 && cooperativeLockConfirmed === true;
    this.eventLog.push({
      step: 'WINCH_SLED_HARNESS_SECURED',
      harnessTensileStrengthKpa: kpa,
      cooperativeLockConfirmed,
      winchSledHarnessSecured: this.winchSledHarnessSecured
    });
    return {
      winchSledHarnessSecured: this.winchSledHarnessSecured
    };
  }

  executeIceShaftRocketAscent({
    shaftHeightMeters = 610,
    ascentVelocityMs = 32
  } = {}) {
    if (!this.winchSledHarnessSecured) {
      throw new Error('Must secure harness before executing ice shaft rocket ascent.');
    }
    const height = Math.max(0, Number(shaftHeightMeters) || 0);
    const vel = Math.max(0, Number(ascentVelocityMs) || 0);
    this.iceShaftAscentExecuted = height >= 600 && vel >= 28;
    this.eventLog.push({
      step: 'ICE_SHAFT_ASCENT_EXECUTED',
      shaftHeightMeters: height,
      ascentVelocityMs: vel,
      iceShaftAscentExecuted: this.iceShaftAscentExecuted
    });
    return {
      iceShaftAscentExecuted: this.iceShaftAscentExecuted
    };
  }

  breachSurfaceWhalingStationRuins({
    surfaceGaleWindKnots = 48,
    cavernCollapseEvaded = true
  } = {}) {
    if (!this.iceShaftAscentExecuted) {
      throw new Error('Must execute rocket ascent before breaching surface whaling station ruins.');
    }
    const wind = Math.max(0, Number(surfaceGaleWindKnots) || 0);
    this.surfaceBlizzardBreached = wind >= 35 && cavernCollapseEvaded === true;
    if (this.surfaceBlizzardBreached) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'SURFACE_BLIZZARD_BREACHED',
      surfaceGaleWindKnots: wind,
      cavernCollapseEvaded,
      surfaceBlizzardBreached: this.surfaceBlizzardBreached,
      honorAwarded: this.honorAwarded
    });
    return {
      surfaceBlizzardBreached: this.surfaceBlizzardBreached,
      honorAwarded: this.honorAwarded
    };
  }

  isFullyCompleted() {
    return (
      this.altarGauntletBombDeployed &&
      this.winchSledHarnessSecured &&
      this.iceShaftAscentExecuted &&
      this.surfaceBlizzardBreached &&
      this.honorAwarded === 400
    );
  }
}
