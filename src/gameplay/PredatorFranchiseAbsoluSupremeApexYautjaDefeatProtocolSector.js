/**
 * PredatorFranchiseAbsoluSupremeApexYautjaDefeatProtocolSector (v233)
 *
 * Implements strict User Rule 3 Compliance:
 * "et le 3 c est uniquement si en tant que yautja on perd et que l'on est dans cette configuration"
 *
 * The gauntlet self-destruct nuclear purge protocol triggers EXCLUSIVELY when:
 * 1. The player is playing as a Yautja (isYautja === true).
 * 2. The player loses the hunt (healthPoints <= 0).
 * 3. The current arena configuration is PREDATOR_FRANCHISE_ABSOLU_SUPREME_APEX_SANCTUM.
 *
 * If ANY of these three conditions is not met, the self-destruction protocol is strictly locked.
 */
export const PREDATOR_FRANCHISE_ABSOLU_SUPREME_APEX_SANCTUM = 'PREDATOR_FRANCHISE_ABSOLU_SUPREME_APEX_SANCTUM';

export class PredatorFranchiseAbsoluSupremeApexYautjaDefeatProtocolSector {
  constructor() {
    this.sectorId = 'PREDATOR_FRANCHISE_ABSOLU_SUPREME_APEX_YAUTJA_DEFEAT_PROTOCOL';
    this.targetArena = PREDATOR_FRANCHISE_ABSOLU_SUPREME_APEX_SANCTUM;
    this.reset();
  }

  reset() {
    this.selfDestructTriggered = false;
    this.purgeYieldMegatons = 0;
    this.plasmaFireballRadiusMeters = 0;
    this.honorAwarded = 0;
    this.evaluationHistory = [];
  }

  evaluateDefeatCondition({
    isYautja = false,
    healthPoints = 100,
    arenaConfiguration = ''
  } = {}) {
    const isYautjaEntity = Boolean(isYautja);
    const hp = Number(healthPoints);
    const isDefeated = hp <= 0;
    const isTargetArena = arenaConfiguration === PREDATOR_FRANCHISE_ABSOLU_SUPREME_APEX_SANCTUM;

    if (!isYautjaEntity) {
      const result = {
        selfDestructTriggered: false,
        reason: 'NOT_A_YAUTJA',
        isYautja: false,
        isDefeated,
        isTargetArena
      };
      this.evaluationHistory.push(result);
      return result;
    }

    if (!isDefeated) {
      const result = {
        selfDestructTriggered: false,
        reason: 'YAUTJA_STILL_ALIVE',
        isYautja: true,
        isDefeated: false,
        isTargetArena
      };
      this.evaluationHistory.push(result);
      return result;
    }

    if (!isTargetArena) {
      const result = {
        selfDestructTriggered: false,
        reason: 'INVALID_ARENA_CONFIGURATION',
        isYautja: true,
        isDefeated: true,
        isTargetArena: false
      };
      this.evaluationHistory.push(result);
      return result;
    }

    // All 3 conditions met: Player is Yautja, HP <= 0, and in Absolu Supreme Apex Sanctum!
    this.selfDestructTriggered = true;
    this.purgeYieldMegatons = 0.70;
    this.plasmaFireballRadiusMeters = 900;
    this.honorAwarded = 500;

    const result = {
      selfDestructTriggered: true,
      reason: 'YAUTJA_DEFEAT_IN_SANCTUM_NUCLEAR_PURGE',
      isYautja: true,
      isDefeated: true,
      isTargetArena: true,
      purgeYieldMegatons: this.purgeYieldMegatons,
      plasmaFireballRadiusMeters: this.plasmaFireballRadiusMeters,
      honorAwarded: this.honorAwarded,
      gauntletGlyphCountdownSeconds: 30,
      maniacalYautjaLaughterRecorded: true
    };
    this.evaluationHistory.push(result);
    return result;
  }

  isFullyCompleted() {
    return (
      this.selfDestructTriggered === true &&
      this.purgeYieldMegatons >= 0.5 &&
      this.plasmaFireballRadiusMeters >= 500 &&
      this.honorAwarded === 500
    );
  }
}
