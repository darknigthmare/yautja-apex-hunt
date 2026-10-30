/**
 * PredatorFranchiseMythiqueSupremeApexYautjaDefeatProtocolSector.js - v238
 * Strictly enforces User Rule 3:
 * Gauntlet nuclear self-destruction triggers strictly and exclusively when:
 * 1. Player is playing as a Yautja (isYautja === true)
 * 2. Player loses all health (healthPoints <= 0)
 * 3. Configuration is exactly 'PREDATOR_FRANCHISE_MYTHIQUE_SUPREME_APEX_SANCTUM'
 */

export const MYTHIQUE_SANCTUM_CONFIG_ID = 'PREDATOR_FRANCHISE_MYTHIQUE_SUPREME_APEX_SANCTUM';

export class PredatorFranchiseMythiqueSupremeApexYautjaDefeatProtocolSector {
  constructor(options = {}) {
    this.sectorId = 'SECTOR_RULE3_MYTHIQUE_SUPREME_APEX_DEFEAT_PROTOCOL';
    this.name = 'Règle Utilisateur 3 - Protocole Défaite Yautja Mythique Suprême Apex (0.95 MT)';
    this.targetArenaConfig = MYTHIQUE_SANCTUM_CONFIG_ID;
    this.yieldMegatons = options.yieldMegatons || 0.95;
    this.blastRadiusMeters = options.blastRadiusMeters || 1150;
    this.countdownSeconds = options.countdownSeconds || 12.0;

    this.state = {
      isYautja: false,
      healthPoints: 100,
      currentArenaConfig: null,
      protocolEligible: false,
      purgeExecuted: false,
      maniacalLaughAudioTriggered: false,
      plasmaCraterDepthMeters: 0,
      honorScore: 0
    };
  }

  evaluateRule3Condition(isYautja, healthPoints, arenaConfigId) {
    const isPlayerYautja = isYautja === true;
    const isDefeated = typeof healthPoints === 'number' && healthPoints <= 0;
    const isMatchingSanctum = arenaConfigId === this.targetArenaConfig;

    const eligible = isPlayerYautja && isDefeated && isMatchingSanctum;

    this.state.isYautja = isPlayerYautja;
    this.state.healthPoints = healthPoints;
    this.state.currentArenaConfig = arenaConfigId;
    this.state.protocolEligible = eligible;

    return {
      rule3Satisfied: eligible,
      isYautja: isPlayerYautja,
      isDefeated,
      isMatchingSanctum,
      targetConfig: this.targetArenaConfig,
      providedConfig: arenaConfigId
    };
  }

  triggerNuclearPurgeOnDefeat(isYautja, healthPoints, arenaConfigId) {
    const evalResult = this.evaluateRule3Condition(isYautja, healthPoints, arenaConfigId);

    if (!evalResult.rule3Satisfied) {
      this.state.purgeExecuted = false;
      return {
        status: 'PROTOCOL_REJECTED',
        reason: 'Rule 3 violated: Nuclear purge ONLY triggers when playing as Yautja, HP <= 0, and in PREDATOR_FRANCHISE_MYTHIQUE_SUPREME_APEX_SANCTUM.',
        evalResult
      };
    }

    this.state.purgeExecuted = true;
    this.state.maniacalLaughAudioTriggered = true;
    this.state.plasmaCraterDepthMeters = 76.0;
    this.state.honorScore = 500;

    return {
      status: 'NUCLEAR_PURGE_DETONATED',
      rule3Compliant: true,
      yieldMegatons: this.yieldMegatons,
      blastRadiusMeters: this.blastRadiusMeters,
      countdownSeconds: this.countdownSeconds,
      craterDepthMeters: this.state.plasmaCraterDepthMeters,
      maniacalCackleAudioActive: true,
      honorAwarded: this.state.honorScore,
      canonicalReference: 'User Rule 3 - Strictly Yautja, defeated, in Mythique Suprême Apex Sanctum'
    };
  }

  verifyTruthTable() {
    const testCases = [
      {
        description: 'Human player defeated in target sanctum -> Must reject',
        input: { isYautja: false, healthPoints: 0, config: this.targetArenaConfig },
        expected: false
      },
      {
        description: 'Yautja player alive (HP > 0) in target sanctum -> Must reject',
        input: { isYautja: true, healthPoints: 75, config: this.targetArenaConfig },
        expected: false
      },
      {
        description: 'Yautja player defeated in WRONG sanctum -> Must reject',
        input: { isYautja: true, healthPoints: -15, config: 'WRONG_SANCTUM_CONFIG' },
        expected: false
      },
      {
        description: 'Yautja player defeated in EXACT target sanctum -> Must detonated',
        input: { isYautja: true, healthPoints: 0, config: this.targetArenaConfig },
        expected: true
      }
    ];

    const results = testCases.map((tc) => {
      const res = this.evaluateRule3Condition(tc.input.isYautja, tc.input.healthPoints, tc.input.config);
      const passed = res.rule3Satisfied === tc.expected;
      return {
        case: tc.description,
        expected: tc.expected,
        actual: res.rule3Satisfied,
        passed
      };
    });

    const allPassed = results.every((r) => r.passed);

    return {
      allPassed,
      totalCases: testCases.length,
      cases: results
    };
  }

  getSnapshot() {
    return {
      sectorId: this.sectorId,
      name: this.name,
      state: { ...this.state },
      cleared: this.state.purgeExecuted && this.state.honorScore >= 500
    };
  }
}
