/**
 * Avp2004WhalingStationBlizzardAmbushSector (v207)
 *
 * Implements iconic 1:1 set-pieces from Alien vs. Predator (2004):
 * 1. Charles Bishop Weyland's team exploring the abandoned 1904 Norwegian whaling station on Bouvetøya Island,
 *    discovering the thermal borehole drilled into the subterranean ice.
 * 2. The 3 young adolescent Yautja hunters (Scar, Celtic, and Chopper) dropping down from the cloaked shuttle
 *    into the raging Antarctic snow blizzard.
 * 3. Eliminating the 8 heavily-armed Weyland security mercenaries in the snowdrifts using camouflage and spearguns.
 * 4. Breaching the 2,000-foot vertical borehole shaft and launching sled equipment down into the subterranean pyramid.
 */
export class Avp2004WhalingStationBlizzardAmbushSector {
  constructor() {
    this.sectorId = 'AVP_2004_WHALING_STATION_BLIZZARD_AMBUSH';
    this.filmReference = 'Alien vs. Predator (2004) - 1904 Whaling Station Blizzard & Adolescent Trio Descent';
    this.reset();
  }

  reset() {
    this.bouvetoyaStationExplored = false;
    this.adolescentYautjaTrioDescended = false;
    this.weylandMercenaryPerimeterNeutralized = false;
    this.verticalIceShaftBreached = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  exploreBouvetoyaAbandonedWhalingStation({
    stationExplored = true,
    boreholeRigLocated = true
  } = {}) {
    this.bouvetoyaStationExplored = Boolean(stationExplored) && Boolean(boreholeRigLocated);
    this.eventLog.push({
      step: 'BOUVETOYA_STATION_EXPLORED',
      bouvetoyaStationExplored: this.bouvetoyaStationExplored
    });
    return {
      bouvetoyaStationExplored: this.bouvetoyaStationExplored
    };
  }

  descendAdolescentYautjaTrioInBlizzard({
    scarDeployed = true,
    celticDeployed = true,
    chopperDeployed = true
  } = {}) {
    if (!this.bouvetoyaStationExplored) {
      throw new Error('Surface station must be explored before Yautja trio drops into blizzard.');
    }
    this.adolescentYautjaTrioDescended =
      Boolean(scarDeployed) && Boolean(celticDeployed) && Boolean(chopperDeployed);
    this.eventLog.push({
      step: 'ADOLESCENT_YAUTJA_TRIO_DESCENDED',
      adolescentYautjaTrioDescended: this.adolescentYautjaTrioDescended
    });
    return {
      adolescentYautjaTrioDescended: this.adolescentYautjaTrioDescended
    };
  }

  neutralizeWeylandMercenaryPerimeterInSnow({
    guardsNeutralizedCount = 8,
    thermalStealthCloakActive = true
  } = {}) {
    if (!this.adolescentYautjaTrioDescended) {
      throw new Error('Yautja trio must descend before engaging surface perimeter mercenaries.');
    }
    const count = Math.max(0, Math.floor(Number(guardsNeutralizedCount) || 0));
    this.weylandMercenaryPerimeterNeutralized = count >= 6 && Boolean(thermalStealthCloakActive);
    this.eventLog.push({
      step: 'WEYLAND_MERCENARY_PERIMETER_NEUTRALIZED',
      guardsNeutralizedCount: count,
      weylandMercenaryPerimeterNeutralized: this.weylandMercenaryPerimeterNeutralized
    });
    return {
      weylandMercenaryPerimeterNeutralized: this.weylandMercenaryPerimeterNeutralized,
      guardsNeutralizedCount: count
    };
  }

  breachTwoThousandFootIceShaftEntrance({
    shaftDepthMeters = 610,
    sledLaunchSecured = true
  } = {}) {
    if (!this.weylandMercenaryPerimeterNeutralized) {
      throw new Error('Surface guards must be neutralized before launching sled down ice borehole.');
    }
    const depth = Math.max(0, Number(shaftDepthMeters) || 0);
    this.verticalIceShaftBreached = depth >= 550 && Boolean(sledLaunchSecured);
    if (this.verticalIceShaftBreached) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'VERTICAL_ICE_SHAFT_BREACHED',
      shaftDepthMeters: depth,
      verticalIceShaftBreached: this.verticalIceShaftBreached,
      honorAwarded: this.honorAwarded
    });
    return {
      verticalIceShaftBreached: this.verticalIceShaftBreached,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      bouvetoyaStationExplored: this.bouvetoyaStationExplored,
      adolescentYautjaTrioDescended: this.adolescentYautjaTrioDescended,
      weylandMercenaryPerimeterNeutralized: this.weylandMercenaryPerimeterNeutralized,
      verticalIceShaftBreached: this.verticalIceShaftBreached,
      honorAwarded: this.honorAwarded
    };
  }
}
