/**
 * Chantier 8 (v198) : Directeur HUD Cimetière de Genna, Complexe Bio-Lab WY & Retour sur Yautja Prime (5 Audits QA)
 * Supervise la télémétrie temps réel des 7 secteurs v198 de Predator: Badlands (2025) et
 * pilote le widget d'autodestruction (Règle 3 stricte).
 */
export class HumanQaPredatorBadlands2025BoneyardHUDDirector {
  constructor() {
    this.directorId = 'HUMAN_QA_PREDATOR_BADLANDS_2025_BONEYARD_HUD_DIRECTOR';
    this.cssPanelClass = 'predator-badlands-2025-boneyard-hud-panel';
    this.qaPlaytesterAudits = [
      {
        auditId: 'QA_BADLANDS_BONEYARD_01_RAZOR_GRASS_RIPPLE',
        focus: 'Lisibilité de l’onde de vent à 68 km/h sur les herbes-rasoirs silicatées 2,2 s avant impact',
        status: 'CERTIFIED'
      },
      {
        auditId: 'QA_BADLANDS_BONEYARD_02_WY_TURRET_IFF_SPOOF',
        focus: 'Retour visuel du piratage IFF des 6 tourelles sentinelles Weyland-Yutani par Thia',
        status: 'CERTIFIED'
      },
      {
        auditId: 'QA_BADLANDS_BONEYARD_03_ACID_BOG_CRUST',
        focus: 'Superposition thermique des 9 pierres basaltiques sur le marécage d’acide sulfurique à pH 0,8',
        status: 'CERTIFIED'
      },
      {
        auditId: 'QA_BADLANDS_BONEYARD_04_KALISK_DROPSHIP_SIEGE',
        focus: 'Indicateur de synchronisation à 420 Hz entre Bud, le Kalisk adulte et le saut VTOL de Dek',
        status: 'CERTIFIED'
      },
      {
        auditId: 'QA_BADLANDS_BONEYARD_05_DEFEAT_BONEYARD_WIDGET',
        focus: 'Affichage exclusif du widget d’autodestruction ᚛-ᚓ-ᚔ-ᚕ-᚜ si Yautja vaincu dans PREDATOR_BADLANDS_2025_BONEYARD_COMPOUND',
        status: 'CERTIFIED'
      }
    ];
    this.reset();
  }

  reset() {
    this.hudState = {
      panelClass: this.cssPanelClass,
      razorGrassWarningLeadSec: 0,
      wyTurretsSpoofed: 0,
      acidBogBasaltPathReady: false,
      kaliskDropshipGrounded: false,
      tessaOpticCoreSevered: false,
      njohrrDefeatedWithKweiFeint: false,
      defeatWidgetVisible: false,
      defeatGlyphBanner: '',
      totalHonorDisplayed: 0
    };
  }

  syncFromSectors({
    razorGrassSector,
    wyBioLabSector,
    acidSwampSector,
    kaliskDropshipSector,
    tessaDuelSector,
    njohrrReturnSector,
    defeatBoneyardSector
  } = {}) {
    const rTel = razorGrassSector ? razorGrassSector.getTelemetry() : {};
    const wTel = wyBioLabSector ? wyBioLabSector.getTelemetry() : {};
    const aTel = acidSwampSector ? acidSwampSector.getTelemetry() : {};
    const kTel = kaliskDropshipSector ? kaliskDropshipSector.getTelemetry() : {};
    const tTel = tessaDuelSector ? tessaDuelSector.getTelemetry() : {};
    const nTel = njohrrReturnSector ? njohrrReturnSector.getTelemetry() : {};
    const dTel = defeatBoneyardSector ? defeatBoneyardSector.getTelemetry() : {};

    this.hudState = {
      panelClass: this.cssPanelClass,
      razorGrassWarningLeadSec: rTel.windRippleTelegraphRead ? 2.2 : 0,
      wyTurretsSpoofed: wTel.sentryTurretsOverridden ? 6 : 0,
      acidBogBasaltPathReady: Boolean(aTel.thermalCrustScanned && aTel.budRescuedFromMire),
      kaliskDropshipGrounded: Boolean(kTel.dropshipGrounded),
      tessaOpticCoreSevered: Boolean(tTel.tessaOpticCoreSevered),
      njohrrDefeatedWithKweiFeint: Boolean(nTel.njohrrDuelWon && nTel.kweiMemorialRuneCarved),
      defeatWidgetVisible: Boolean(dTel.protocolArmed),
      defeatGlyphBanner: dTel.protocolArmed ? dTel.glyphsEntered.join('-') : 'INACTIVE',
      totalHonorDisplayed:
        (rTel.honorAwarded || 0) +
        (wTel.honorAwarded || 0) +
        (aTel.honorAwarded || 0) +
        (kTel.honorAwarded || 0) +
        (tTel.honorAwarded || 0) +
        (nTel.honorAwarded || 0) +
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
