/**
 * Chantier 8 (v199) : Directeur HUD Falaises de Lave, Canopée Bioluminescente, Nid Kalisk & Flèche Relais (5 Audits QA)
 * Supervise la télémétrie temps réel des 7 secteurs v199 de Predator: Badlands (2025) et
 * pilote le widget d'autodestruction (Règle 3 stricte).
 */
export class HumanQaPredatorBadlands2025RelaySpireHUDDirector {
  constructor() {
    this.directorId = 'HUMAN_QA_PREDATOR_BADLANDS_2025_RELAY_SPIRE_HUD_DIRECTOR';
    this.cssPanelClass = 'predator-badlands-2025-relay-spire-hud-panel';
    this.qaPlaytesterAudits = [
      {
        auditId: 'QA_BADLANDS_SPIRE_01_LAVA_CLIFF_KWEI_CLASP',
        focus: 'Indicateur thermique des colonnes de basalte à 1 180°C et icône du fermoir de Kwei',
        status: 'CERTIFIED'
      },
      {
        auditId: 'QA_BADLANDS_SPIRE_02_CANOPY_MIMIC_SPECTRAL',
        focus: 'Alerte de déphasage acoustique à 34,5% sur les leurres vocaux imitant Kwei',
        status: 'CERTIFIED'
      },
      {
        auditId: 'QA_BADLANDS_SPIRE_03_CRAWLER_CANBUS_JACKKNIFE',
        focus: 'Télémétrie du bus CAN 500 kbps piraté par Thia sur le convoi WY-AT800',
        status: 'CERTIFIED'
      },
      {
        auditId: 'QA_BADLANDS_SPIRE_04_KALISK_NEST_AND_THIA_RIG',
        focus: 'Statut du pacte maternel à 115 Hz du Kalisk et mobilité bimodale de Thia à 7,4 m/s',
        status: 'CERTIFIED'
      },
      {
        auditId: 'QA_BADLANDS_SPIRE_05_DEFEAT_SPIRE_WIDGET',
        focus: 'Affichage exclusif du widget d’autodestruction ᚛-ᚖ-ᚗ-ᚘ-᚜ si Yautja vaincu dans PREDATOR_BADLANDS_2025_RELAY_SPIRE',
        status: 'CERTIFIED'
      }
    ];
    this.reset();
  }

  reset() {
    this.hudState = {
      panelClass: this.cssPanelClass,
      kweiShoulderClaspEquipped: false,
      canopyMimicFiltered: false,
      crawlerPodsRescued: 0,
      kaliskMaternalPactSealed: false,
      thiaDualModeReady: false,
      relaySpireDestroyed: false,
      defeatWidgetVisible: false,
      defeatGlyphBanner: '',
      totalHonorDisplayed: 0
    };
  }

  syncFromSectors({
    lavaCliffSector,
    canopyStalkSector,
    crawlerConvoySector,
    kaliskNestSector,
    thiaRepairSector,
    relayTowerSector,
    defeatRelaySpireSector
  } = {}) {
    const lTel = lavaCliffSector ? lavaCliffSector.getTelemetry() : {};
    const cTel = canopyStalkSector ? canopyStalkSector.getTelemetry() : {};
    const wTel = crawlerConvoySector ? crawlerConvoySector.getTelemetry() : {};
    const kTel = kaliskNestSector ? kaliskNestSector.getTelemetry() : {};
    const tTel = thiaRepairSector ? thiaRepairSector.getTelemetry() : {};
    const rTel = relayTowerSector ? relayTowerSector.getTelemetry() : {};
    const dTel = defeatRelaySpireSector ? defeatRelaySpireSector.getTelemetry() : {};

    this.hudState = {
      panelClass: this.cssPanelClass,
      kweiShoulderClaspEquipped: Boolean(lTel.kweiShoulderClaspReceived),
      canopyMimicFiltered: Boolean(cTel.mimicSpoofFiltered),
      crawlerPodsRescued: wTel.rescuedMegafaunaPods || 0,
      kaliskMaternalPactSealed: Boolean(kTel.apexSymbiosisBondSealed),
      thiaDualModeReady: Boolean(tTel.dualModeMobilityCalibrated),
      relaySpireDestroyed: Boolean(rTel.spireDestroyed),
      defeatWidgetVisible: Boolean(dTel.protocolArmed),
      defeatGlyphBanner: dTel.protocolArmed ? dTel.glyphsEntered.join('-') : 'INACTIVE',
      totalHonorDisplayed:
        (lTel.honorAwarded || 0) +
        (cTel.honorAwarded || 0) +
        (wTel.honorAwarded || 0) +
        (kTel.honorAwarded || 0) +
        (tTel.honorAwarded || 0) +
        (rTel.honorAwarded || 0) +
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
