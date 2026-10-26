/**
 * Chantier 7 (v202) : Protocole Pan-Ères d'Autodestruction de l'Anthologie Predator (Règle 3 Stricte)
 * RÈGLE UTILISATEUR INVARIANTE :
 * "et le 3 c est uniquement si en tant que yautja on perd et que l'on est dans cette configuration"
 *
 * S'active STRICTEMENT et EXCLUSIVEMENT si :
 *   1. isYautja === true (le joueur incarne un Yautja)
 *   2. healthPoints <= 0 (le joueur perd / tombe au combat)
 *   3. levelConfiguration === 'PREDATOR_FRANCHISE_PAN_ERA_ANTHOLOGY_ARENA'
 *
 * Tout autre cas (joueur humain/synthétique, PV > 0, ou autre niveau) est strictement rejeté.
 */
export class PredatorFranchisePanEraYautjaDefeatProtocolSector {
  constructor() {
    this.sectorId = 'PREDATOR_FRANCHISE_PAN_ERA_YAUTJA_DEFEAT_PROTOCOL';
    this.requiredConfiguration = 'PREDATOR_FRANCHISE_PAN_ERA_ANTHOLOGY_ARENA';
    this.glyphSequence = ['᚛', 'ᚂ', 'ᚑ', 'ᚚ', '᚜'];
    this.countdownSeconds = 15;
    this.blastRadiusMeters = 65;
    this.roarDecibels = 111;
    this.reset();
  }

  reset() {
    this.protocolArmed = false;
    this.rejectionReason = null;
    this.wristCoverSnappedOpen = false;
    this.glyphsEntered = [];
    this.defiantRoarEmitted = false;
    this.detonationCompleted = false;
    this.panEraAnthologyArenaVaporized = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  evaluateAndTriggerProtocol({
    isYautja = false,
    healthPoints = 100,
    levelConfiguration = ''
  } = {}) {
    this.reset();

    if (isYautja !== true) {
      this.rejectionReason = 'REJECTED_NOT_YAUTJA';
      return {
        protocolArmed: false,
        rejectionReason: this.rejectionReason
      };
    }

    if (typeof healthPoints !== 'number' || healthPoints > 0) {
      this.rejectionReason = 'REJECTED_YAUTJA_STILL_ALIVE';
      return {
        protocolArmed: false,
        rejectionReason: this.rejectionReason
      };
    }

    if (levelConfiguration !== this.requiredConfiguration) {
      this.rejectionReason = 'REJECTED_WRONG_CONFIGURATION';
      return {
        protocolArmed: false,
        rejectionReason: this.rejectionReason
      };
    }

    this.protocolArmed = true;
    this.wristCoverSnappedOpen = true;
    this.glyphsEntered = [...this.glyphSequence];
    this.defiantRoarEmitted = true;
    this.detonationCompleted = true;
    this.panEraAnthologyArenaVaporized = true;
    this.honorAwarded = 500;

    this.eventLog.push({
      step: 'PAN_ERA_ANTHOLOGY_DEFEAT_SELF_DESTRUCT_EXECUTED',
      isYautja,
      healthPoints,
      levelConfiguration,
      glyphsEntered: this.glyphsEntered,
      roarDecibels: this.roarDecibels,
      countdownSeconds: this.countdownSeconds,
      blastRadiusMeters: this.blastRadiusMeters,
      panEraAnthologyArenaVaporized: this.panEraAnthologyArenaVaporized,
      honorAwarded: this.honorAwarded
    });

    return {
      protocolArmed: this.protocolArmed,
      rejectionReason: null,
      wristCoverSnappedOpen: this.wristCoverSnappedOpen,
      glyphsEntered: this.glyphsEntered,
      roarDecibels: this.roarDecibels,
      countdownSeconds: this.countdownSeconds,
      blastRadiusMeters: this.blastRadiusMeters,
      detonationCompleted: this.detonationCompleted,
      panEraAnthologyArenaVaporized: this.panEraAnthologyArenaVaporized,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      requiredConfiguration: this.requiredConfiguration,
      protocolArmed: this.protocolArmed,
      rejectionReason: this.rejectionReason,
      glyphsEntered: this.glyphsEntered,
      detonationCompleted: this.detonationCompleted,
      panEraAnthologyArenaVaporized: this.panEraAnthologyArenaVaporized,
      honorAwarded: this.honorAwarded
    };
  }
}
