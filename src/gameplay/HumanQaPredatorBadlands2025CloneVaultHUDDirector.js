/**
 * Chantier 8 (v200) : Directeur HUD Épave Ancestrale, Gorge Hydra, Station Atmos, Chambre des Clones & Éclipse (5 Audits QA)
 * Supervise la télémétrie temps réel des 7 secteurs v200 de Predator: Badlands (2025) et
 * pilote le widget d'autodestruction (Règle 3 stricte).
 */
export class HumanQaPredatorBadlands2025CloneVaultHUDDirector {
  constructor() {
    this.directorId = 'HUMAN_QA_PREDATOR_BADLANDS_2025_CLONE_VAULT_HUD_DIRECTOR';
    this.cssPanelClass = 'predator-badlands-2025-clone-vault-hud-panel';
    this.qaPlaytesterAudits = [
      {
        auditId: 'QA_BADLANDS_V200_01_ANCIENT_WRECK_SPEAR',
        focus: 'Décodage de l’holo-journal ancestral de 46 s et statut du Combi-Spear 1 420 MPa',
        status: 'CERTIFIED'
      },
      {
        auditId: 'QA_BADLANDS_V200_02_SPITTING_GORGE_PARRY',
        focus: 'Indicateur péristaltique à 650 ms et moulinet déflecteur à 480 tr/min',
        status: 'CERTIFIED'
      },
      {
        auditId: 'QA_BADLANDS_V200_03_ATMOS_AND_BUD_DECOY',
        focus: 'Purge cryo-défoliante WY-ATMOS-09 et leurre acoustique de Bud à 102 dB dans les conduits',
        status: 'CERTIFIED'
      },
      {
        auditId: 'QA_BADLANDS_V200_04_CLONE_VAULT_AND_ECLIPSE',
        focus: 'Neutralisation des 8 châssis WY-SYNTH-TF, emblème d’autonomie de Thia et éclipse de Genna',
        status: 'CERTIFIED'
      },
      {
        auditId: 'QA_BADLANDS_V200_05_DEFEAT_CLONE_VAULT_WIDGET',
        focus: 'Affichage exclusif du widget d’autodestruction ᚛-ᚙ-ᚚ-ᚐ-᚜ si Yautja vaincu dans PREDATOR_BADLANDS_2025_CLONE_VAULT',
        status: 'CERTIFIED'
      }
    ];
    this.reset();
  }

  reset() {
    this.hudState = {
      panelClass: this.cssPanelClass,
      ancientCombiSpearEquipped: false,
      gorgeVenomDeflected: false,
      valleySporeAirRestored: false,
      budDecoyBunkerCaptured: false,
      thiaAutonomyEmblemClaimed: false,
      eclipseApexCoronationComplete: false,
      defeatWidgetVisible: false,
      defeatGlyphBanner: '',
      totalHonorDisplayed: 0
    };
  }

  syncFromSectors({
    ancientWreckSector,
    spittingGorgeSector,
    atmosProcessorSector,
    budDecoySector,
    cloneVaultSector,
    eclipseCoronationSector,
    defeatCloneVaultSector
  } = {}) {
    const aTel = ancientWreckSector ? ancientWreckSector.getTelemetry() : {};
    const sTel = spittingGorgeSector ? spittingGorgeSector.getTelemetry() : {};
    const pTel = atmosProcessorSector ? atmosProcessorSector.getTelemetry() : {};
    const bTel = budDecoySector ? budDecoySector.getTelemetry() : {};
    const cTel = cloneVaultSector ? cloneVaultSector.getTelemetry() : {};
    const eTel = eclipseCoronationSector ? eclipseCoronationSector.getTelemetry() : {};
    const dTel = defeatCloneVaultSector ? defeatCloneVaultSector.getTelemetry() : {};

    this.hudState = {
      panelClass: this.cssPanelClass,
      ancientCombiSpearEquipped: Boolean(aTel.ancientCombiSpearSalvaged),
      gorgeVenomDeflected: Boolean(sTel.venomJetsDeflected && sTel.gorgePathCleared),
      valleySporeAirRestored: Boolean(pTel.valleyAirRestored),
      budDecoyBunkerCaptured: Boolean(bTel.bunkerBlastDoorBreached),
      thiaAutonomyEmblemClaimed: Boolean(cTel.thiaAutonomyEmblemClaimed),
      eclipseApexCoronationComplete: Boolean(eTel.departedForYautjaPrime),
      defeatWidgetVisible: Boolean(dTel.protocolArmed),
      defeatGlyphBanner: dTel.protocolArmed ? dTel.glyphsEntered.join('-') : 'INACTIVE',
      totalHonorDisplayed:
        (aTel.honorAwarded || 0) +
        (sTel.honorAwarded || 0) +
        (pTel.honorAwarded || 0) +
        (bTel.honorAwarded || 0) +
        (cTel.honorAwarded || 0) +
        (eTel.honorAwarded || 0) +
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
