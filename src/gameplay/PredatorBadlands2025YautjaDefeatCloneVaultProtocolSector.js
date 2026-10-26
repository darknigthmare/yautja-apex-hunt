/**
 * Chantier 7 (v200) : Protocole d'Autodestruction de Défaite à la Chambre des Clones WY (Règle 3 Stricte)
 * RÈGLE UTILISATEUR INVARIANTE :
 * "et le 3 c est uniquement si en tant que yautja on perd et que l'on est dans cette configuration"
 *
 * S'active STRICTEMENT et EXCLUSIVEMENT si :
 *   1. isYautja === true (le joueur incarne Dek / un Yautja)
 *   2. healthPoints <= 0 (le joueur perd / tombe au combat)
 *   3. levelConfiguration === 'PREDATOR_BADLANDS_2025_CLONE_VAULT'
 *
 * Tout autre cas (joueur humain/synthétique, PV > 0, ou autre niveau) est strictement rejeté.
 */
export class PredatorBadlands2025YautjaDefeatCloneVaultProtocolSector {
  constructor() {
    this.sectorId = 'PREDATOR_BADLANDS_2025_YAUTJA_DEFEAT_CLONE_VAULT_PROTOCOL';
    this.requiredConfiguration = 'PREDATOR_BADLANDS_2025_CLONE_VAULT';
    this.glyphSequence = ['᚛', 'ᚙ', 'ᚚ', 'ᚐ', '᚜'];
    this.countdownSeconds = 15;
    this.blastRadiusMeters = 65;
    this.roarDecibels = 109;
    this.reset();
  }

  reset() {
    this.protocolArmed = false;
    this.rejectionReason = null;
    this.wristCoverSnappedOpen = false;
    this.glyphsEntered = [];
    this.defiantRoarEmitted = false;
    this.detonationCompleted = false;
    this.cloneVaultVaporized = false;
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
    this.cloneVaultVaporized = true;
    this.honorAwarded = 500;

    this.eventLog.push({
      step: 'CLONE_VAULT_DEFEAT_SELF_DESTRUCT_EXECUTED',
      isYautja,
      healthPoints,
      levelConfiguration,
      glyphsEntered: this.glyphsEntered,
      roarDecibels: this.roarDecibels,
      countdownSeconds: this.countdownSeconds,
      blastRadiusMeters: this.blastRadiusMeters,
      cloneVaultVaporized: this.cloneVaultVaporized,
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
      cloneVaultVaporized: this.cloneVaultVaporized,
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
      cloneVaultVaporized: this.cloneVaultVaporized,
      honorAwarded: this.honorAwarded
    };
  }
}
