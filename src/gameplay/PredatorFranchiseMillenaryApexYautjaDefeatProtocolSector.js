/**
 * PredatorFranchiseMillenaryApexYautjaDefeatProtocolSector (v212)
 *
 * Enforces strict User Rule 3 across the entire Predator Franchise Millenary Apex Canon:
 * "et le 3 c est uniquement si en tant que yautja on perd et que l'on est dans cette configuration"
 *
 * The Wrist-Gauntlet Millenary Apex Nuclear Purge triggers STRICTLY AND EXCLUSIVELY when:
 * 1. The player is playing as a Yautja (`isYautja === true`)
 * 2. The player loses (`healthPoints <= 0`)
 * 3. The active level configuration is `'PREDATOR_FRANCHISE_MILLENARY_APEX_SANCTUM'`
 */
export class PredatorFranchiseMillenaryApexYautjaDefeatProtocolSector {
  constructor() {
    this.sectorId = 'PREDATOR_FRANCHISE_MILLENARY_APEX_YAUTJA_DEFEAT_PROTOCOL_SECTOR';
    this.requiredConfiguration = 'PREDATOR_FRANCHISE_MILLENARY_APEX_SANCTUM';
    this.glyphSequence = ['᚛', 'ᚌ', 'ᚓ', 'ᚏ', '᚜'];
    this.roarDecibels = 122;
    this.countdownSeconds = 15;
    this.blastRadiusMeters = 65;
    this.selfDestructArmed = false;
    this.millenaryApexSanctumVaporized = false;
    this.honorAwarded = 0;
  }

  evaluateMillenaryApexDefeatProtocol({
    isYautja = false,
    healthPoints = 100,
    levelConfiguration = 'STANDARD_ARENA'
  } = {}) {
    const strictConditionMet =
      isYautja === true &&
      typeof healthPoints === 'number' &&
      healthPoints <= 0 &&
      levelConfiguration === this.requiredConfiguration;

    if (!strictConditionMet) {
      let rejectionReason = 'CONDITIONS_NOT_MET';
      if (isYautja !== true) {
        rejectionReason = 'PLAYER_NOT_YAUTJA';
      } else if (typeof healthPoints !== 'number' || healthPoints > 0) {
        rejectionReason = 'YAUTJA_STILL_ALIVE';
      } else if (levelConfiguration !== this.requiredConfiguration) {
        rejectionReason = 'INVALID_LEVEL_CONFIGURATION';
      }
      return {
        selfDestructTriggered: false,
        rejectionReason,
        requiredConfiguration: this.requiredConfiguration,
        activeConfiguration: levelConfiguration,
        glyphSequence: [],
        roarDecibels: 0,
        countdownSeconds: 0,
        blastRadiusMeters: 0,
        millenaryApexSanctumVaporized: false,
        honorAwarded: 0
      };
    }

    this.selfDestructArmed = true;
    this.millenaryApexSanctumVaporized = true;
    if (this.honorAwarded === 0) {
      this.honorAwarded = 500;
    }

    return {
      selfDestructTriggered: true,
      rejectionReason: null,
      requiredConfiguration: this.requiredConfiguration,
      activeConfiguration: levelConfiguration,
      glyphSequence: [...this.glyphSequence],
      roarDecibels: this.roarDecibels,
      countdownSeconds: this.countdownSeconds,
      blastRadiusMeters: this.blastRadiusMeters,
      millenaryApexSanctumVaporized: this.millenaryApexSanctumVaporized,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetry() {
    return {
      sectorId: this.sectorId,
      requiredConfiguration: this.requiredConfiguration,
      selfDestructArmed: this.selfDestructArmed,
      millenaryApexSanctumVaporized: this.millenaryApexSanctumVaporized,
      blastRadiusMeters: this.blastRadiusMeters,
      honorAwarded: this.honorAwarded
    };
  }

  getTelemetryState() {
    return this.getTelemetry();
  }
}
