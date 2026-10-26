/**
 * Chantier 2 (v198) : Complexe Bio-Armes Weyland-Yutani de Genna (Predator: Badlands - 2025)
 * Modélise en fidélité 1:1 l'évasion et le sabotage de l'avant-poste scientifique Weyland-Yutani
 * (« Building Better Worlds » - Secteur de Confinement 04) : bris du pod de cryo-stase, sabotage
 * des exosquelettes Power Loader P-5000, piratage IFF de 6 tourelles sentinelles par Thia et
 * récupération des reliques de Kwei et du cœur d'épée plasma de Dek.
 */
export class PredatorBadlands2025WeylandYutaniBioLabCompoundSector {
  constructor() {
    this.sectorId = 'PREDATOR_BADLANDS_2025_WY_BIOLAB_COMPOUND';
    this.filmReference = 'Predator: Badlands (2025) - Weyland-Yutani Specimen Containment Sector 04';
    this.corporateMotto = 'BUILDING_BETTER_WORLDS';
    this.reset();
  }

  reset() {
    this.cryoStasisPodBreached = false;
    this.podPressureBar = 0;
    this.powerLoaderBaySabotaged = false;
    this.hydraulicLinesSevered = 0;
    this.sentryTurretsOverridden = false;
    this.turretsTurnedAgainstMercs = 0;
    this.clanHeirloomsExtracted = false;
    this.kweiCloakFragmentRecovered = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  breachCryoSpecimenStasisPod({ podPressureBar = 14.5, shatteredReinforcedGlass = true } = {}) {
    this.podPressureBar = Math.max(0, Number(podPressureBar) || 0);
    this.cryoStasisPodBreached = this.podPressureBar >= 10 && Boolean(shatteredReinforcedGlass);
    this.eventLog.push({
      step: 'CRYO_STASIS_POD_BREACHED',
      podPressureBar: this.podPressureBar,
      cryoStasisPodBreached: this.cryoStasisPodBreached
    });
    return {
      cryoStasisPodBreached: this.cryoStasisPodBreached,
      podPressureBar: this.podPressureBar
    };
  }

  sabotagePowerLoaderExosuitBay({
    loaderModel = 'P-5000_HEAVY_BIO',
    hydraulicLinesSevered = 4,
    impactJoules = 5400
  } = {}) {
    if (!this.cryoStasisPodBreached) {
      throw new Error('Cryo-stasis pod must be breached before sabotaging the Power Loader bay.');
    }
    this.hydraulicLinesSevered = Math.max(0, Math.floor(Number(hydraulicLinesSevered) || 0));
    const joules = Math.max(0, Number(impactJoules) || 0);
    this.powerLoaderBaySabotaged =
      loaderModel === 'P-5000_HEAVY_BIO' && this.hydraulicLinesSevered >= 4 && joules >= 4000;
    this.eventLog.push({
      step: 'POWER_LOADER_BAY_SABOTAGED',
      loaderModel,
      hydraulicLinesSevered: this.hydraulicLinesSevered,
      impactJoules: joules,
      powerLoaderBaySabotaged: this.powerLoaderBaySabotaged
    });
    return {
      powerLoaderBaySabotaged: this.powerLoaderBaySabotaged,
      hydraulicLinesSevered: this.hydraulicLinesSevered
    };
  }

  overrideAutomatedSentryTurrets({ turretCount = 6, iffTransponderSpoofed = true } = {}) {
    if (!this.powerLoaderBaySabotaged) {
      throw new Error('Power Loader bay must be sabotaged before overriding automated sentry turrets.');
    }
    this.turretsTurnedAgainstMercs = Math.max(0, Math.floor(Number(turretCount) || 0));
    this.sentryTurretsOverridden = this.turretsTurnedAgainstMercs >= 4 && Boolean(iffTransponderSpoofed);
    this.eventLog.push({
      step: 'SENTRY_TURRETS_IFF_SPOOFED',
      turretsTurnedAgainstMercs: this.turretsTurnedAgainstMercs,
      sentryTurretsOverridden: this.sentryTurretsOverridden
    });
    return {
      sentryTurretsOverridden: this.sentryTurretsOverridden,
      turretsTurnedAgainstMercs: this.turretsTurnedAgainstMercs
    };
  }

  extractConfiscatedYautjaClanHeirlooms({
    recoveredPlasmaSwordCore = true,
    kweiCloakFragmentRecovered = true
  } = {}) {
    if (!this.sentryTurretsOverridden) {
      throw new Error('Sentry turrets must be overridden before extracting confiscated Yautja clan heirlooms.');
    }
    this.kweiCloakFragmentRecovered = Boolean(kweiCloakFragmentRecovered);
    this.clanHeirloomsExtracted = Boolean(recoveredPlasmaSwordCore) && this.kweiCloakFragmentRecovered;
    if (this.clanHeirloomsExtracted) {
      this.honorAwarded = 400;
    }
    this.eventLog.push({
      step: 'CLAN_HEIRLOOMS_EXTRACTED',
      recoveredPlasmaSwordCore: Boolean(recoveredPlasmaSwordCore),
      kweiCloakFragmentRecovered: this.kweiCloakFragmentRecovered,
      honorAwarded: this.honorAwarded
    });
    return {
      clanHeirloomsExtracted: this.clanHeirloomsExtracted,
      kweiCloakFragmentRecovered: this.kweiCloakFragmentRecovered,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      cryoStasisPodBreached: this.cryoStasisPodBreached,
      powerLoaderBaySabotaged: this.powerLoaderBaySabotaged,
      sentryTurretsOverridden: this.sentryTurretsOverridden,
      clanHeirloomsExtracted: this.clanHeirloomsExtracted,
      honorAwarded: this.honorAwarded
    };
  }
}
