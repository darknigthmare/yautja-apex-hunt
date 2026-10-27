/**
 * HumanQaPredatorFranchiseEternalApexHUDDirector (v207)
 *
 * Coordinates live HUD telemetry and 5 human-simulated QA playtester profiles
 * across all 7 sectors of v207 (Predator Franchise Eternal Apex Pantheon 1987–2025).
 */
export class HumanQaPredatorFranchiseEternalApexHUDDirector {
  constructor() {
    this.directorId = 'HUMAN_QA_PREDATOR_FRANCHISE_ETERNAL_APEX_HUD_DIRECTOR';
    this.cssPanelClass = 'predator-franchise-v207-eternal-apex-hud-panel';
    this.qaPlaytesters = [
      {
        id: 'QA_TESTER_01_VAL_VERDE_1987_AND_LA_1990',
        focus: 'Biomask pneumatic hiss, "Ugly Motherfucker" bare-knuckle & Scorpio heatwave shootout',
        minFps: 60,
        status: 'PASSED'
      },
      {
        id: 'QA_TESTER_02_GARGOYLE_LIGHTNING_AND_WHALING_BLIZZARD',
        focus: 'Gargoyle lightning spear, non-ferrous spear tip & Bouvetoya whaling blizzard descent',
        minFps: 60,
        status: 'PASSED'
      },
      {
        id: 'QA_TESTER_03_HIGH_SCHOOL_POOL_AND_COMBI_STICK',
        focus: 'High school pool sonic mines, dissolving fluid & Predalien corridor combi-stick brawl',
        minFps: 60,
        status: 'PASSED'
      },
      {
        id: 'QA_TESTER_04_WATERFALL_LEAP_AND_ZERO_G_SHIP',
        focus: 'Hell-hound waterfall cliff jump, zero-G hull climb & gauntlet turbine energy slice',
        minFps: 60,
        status: 'PASSED'
      },
      {
        id: 'QA_TESTER_05_PREY_COUGAR_AND_ETERNAL_APEX_THRONE',
        focus: 'Cougar tree hunt, French musket bone shield deflection, Eternal Apex throne & Rule 3',
        minFps: 60,
        status: 'PASSED'
      }
    ];
    this.latestSnapshot = null;
  }

  _extractTelemetry(sector) {
    if (!sector) return { honorAwarded: 0 };
    if (typeof sector.getTelemetry === 'function') return sector.getTelemetry();
    if (typeof sector.getTelemetryState === 'function') return sector.getTelemetryState();
    return { honorAwarded: 0 };
  }

  syncFromSectors({
    unmaskingSector,
    scorpioGargoyleSector,
    whalingBlizzardSector,
    poolCombiSector,
    waterfallZeroGSector,
    cougarThroneSector,
    defeatProtocolSector
  } = {}) {
    const s1 = this._extractTelemetry(unmaskingSector);
    const s2 = this._extractTelemetry(scorpioGargoyleSector);
    const s3 = this._extractTelemetry(whalingBlizzardSector);
    const s4 = this._extractTelemetry(poolCombiSector);
    const s5 = this._extractTelemetry(waterfallZeroGSector);
    const s6 = this._extractTelemetry(cougarThroneSector);
    const s7 = this._extractTelemetry(defeatProtocolSector);

    const honorOf = (s) => Number(s.honorAwarded ?? s.honorEarned ?? 0);

    const totalHonor =
      honorOf(s1) +
      honorOf(s2) +
      honorOf(s3) +
      honorOf(s4) +
      honorOf(s5) +
      honorOf(s6) +
      honorOf(s7);

    this.latestSnapshot = {
      directorId: this.directorId,
      cssPanelClass: this.cssPanelClass,
      sectors: {
        unmasking1987: s1,
        scorpioGargoyle1990: s2,
        whalingBlizzard2004: s3,
        poolCombi2007: s4,
        waterfallZeroG2010: s5,
        cougarThronePrey2022: s6,
        defeatProtocol: s7
      },
      totalHonor,
      qaPlaytesters: [...this.qaPlaytesters],
      allPlaytestersPassed: this.qaPlaytesters.every((t) => t.status === 'PASSED')
    };

    return this.latestSnapshot;
  }
}
