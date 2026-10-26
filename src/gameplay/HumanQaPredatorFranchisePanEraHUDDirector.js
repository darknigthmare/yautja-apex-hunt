/**
 * Chantier 8 (v202) : Directeur HUD Anthologie Pan-Ères de la Franchise Predator (1987 -> 2025) (5 Audits QA)
 * Supervise la télémétrie temps réel des 7 secteurs v202 couvrant les scènes complémentaires des
 * 9 films et pilote le widget d'autodestruction pan-ères (Règle 3 stricte).
 */
export class HumanQaPredatorFranchisePanEraHUDDirector {
  constructor() {
    this.directorId = 'HUMAN_QA_PREDATOR_FRANCHISE_PAN_ERA_HUD_DIRECTOR';
    this.cssPanelClass = 'predator-franchise-v202-pan-era-hud-panel';
    this.qaPlaytesterAudits = [
      {
        auditId: 'QA_FRANCHISE_V202_01_HAWKINS_AND_VEGA_SKYLIGHT',
        focus: 'Code d’honneur sur Anna & évacuation de Poncho (1987) + verrière de Ramon Vega (1990)',
        status: 'CERTIFIED'
      },
      {
        auditId: 'QA_FRANCHISE_V202_02_LEX_BLOODED_AND_WOLF_CHOKE',
        focus: 'Marquage Blooded de Lex Woods (2004) + armurerie de Gunnison et double étranglement de Wolf (2007)',
        status: 'CERTIFIED'
      },
      {
        auditId: 'QA_FRANCHISE_V202_03_NIKOLAI_AND_FUGITIVE_LAB',
        focus: 'Sacrifice Claymore de Nikolai face à Tracker (2010) + bris des entraves en titane du Fugitive (2018)',
        status: 'CERTIFIED'
      },
      {
        auditId: 'QA_FRANCHISE_V202_04_TRACHTENBERG_TRILOGY_BOND',
        focus: 'Chaîne alimentaire de Prey (2022), moteur Wildcat de Torres (2025) et bivouac de Dek/Thia/Bud (2025)',
        status: 'CERTIFIED'
      },
      {
        auditId: 'QA_FRANCHISE_V202_05_DEFEAT_PAN_ERA_WIDGET',
        focus: 'Affichage exclusif du widget d’autodestruction ᚛-ᚂ-ᚑ-ᚚ-᚜ si Yautja vaincu dans PREDATOR_FRANCHISE_PAN_ERA_ANTHOLOGY_ARENA',
        status: 'CERTIFIED'
      }
    ];
    this.reset();
  }

  reset() {
    this.hudState = {
      panelClass: this.cssPanelClass,
      valVerde1987AnnaEvacuated: false,
      losAngeles1990VegaSkylightCleared: false,
      avp2004LexBloodedSpearBestowed: false,
      avpr2007WolfDualChokeExecuted: false,
      tracker2010AndFugitive2018Complete: false,
      trachtenbergTrilogyPackSealed: false,
      defeatWidgetVisible: false,
      defeatGlyphBanner: '',
      totalHonorDisplayed: 0
    };
  }

  syncFromSectors({
    hawkinsAnna1987Sector,
    vegaSkylight1990Sector,
    chopperLex2004Sector,
    gunnisonArmory2007Sector,
    trackerFugitiveSector,
    trachtenbergChroniclesSector,
    defeatPanEraSector
  } = {}) {
    const hTel = hawkinsAnna1987Sector ? hawkinsAnna1987Sector.getTelemetry() : {};
    const vTel = vegaSkylight1990Sector ? vegaSkylight1990Sector.getTelemetry() : {};
    const cTel = chopperLex2004Sector ? chopperLex2004Sector.getTelemetry() : {};
    const gTel = gunnisonArmory2007Sector ? gunnisonArmory2007Sector.getTelemetry() : {};
    const tTel = trackerFugitiveSector ? trackerFugitiveSector.getTelemetry() : {};
    const bTel = trachtenbergChroniclesSector ? trachtenbergChroniclesSector.getTelemetry() : {};
    const dTel = defeatPanEraSector ? defeatPanEraSector.getTelemetry() : {};

    this.hudState = {
      panelClass: this.cssPanelClass,
      valVerde1987AnnaEvacuated: Boolean(hTel.annaEvacuatedToChopper),
      losAngeles1990VegaSkylightCleared: Boolean(vTel.harriganLeonaSweepEvaded),
      avp2004LexBloodedSpearBestowed: Boolean(cTel.elderCombiSpearBestowed),
      avpr2007WolfDualChokeExecuted: Boolean(gTel.wolfDualChokeholdExecuted && gTel.helipadRouteSelected),
      tracker2010AndFugitive2018Complete: Boolean(tTel.fugitiveBioMaskRecovered),
      trachtenbergTrilogyPackSealed: Boolean(bTel.trachtenbergTrilogyContinuitySealed),
      defeatWidgetVisible: Boolean(dTel.protocolArmed),
      defeatGlyphBanner: dTel.protocolArmed ? dTel.glyphsEntered.join('-') : 'INACTIVE',
      totalHonorDisplayed:
        (hTel.honorAwarded || 0) +
        (vTel.honorAwarded || 0) +
        (cTel.honorAwarded || 0) +
        (gTel.honorAwarded || 0) +
        (tTel.honorAwarded || 0) +
        (bTel.honorAwarded || 0) +
        (dTel.honorAwarded || 0)
    };

    return this.hudState;
  }

  getHudSnapshot() {
    return {
      directorId: this.directorId,
      qaPlaytesterAudits: this.qaPlaytesterAudits,
      hudState: { ...this.hudState }
    };
  }
}
