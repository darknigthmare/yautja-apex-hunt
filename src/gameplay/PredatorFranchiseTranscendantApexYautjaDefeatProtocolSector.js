/**
 * PredatorFranchiseTranscendantApexYautjaDefeatProtocolSector (v226)
 *
 * Implements User Rule 3 strictly and exclusively:
 * "et le 3 c est uniquement si en tant que yautja on perd et que l'on est dans cette configuration"
 *
 * Specific configuration: PREDATOR_FRANCHISE_TRANSCENDANT_APEX_SANCTUM.
 * Triggers STRICTLY AND ONLY if:
 * 1. isYautja === true (player is playing as a Yautja hunter)
 * 2. healthPoints <= 0 (hunter is defeated)
 * 3. arenaConfig === 'PREDATOR_FRANCHISE_TRANSCENDANT_APEX_SANCTUM'
 */
export class PredatorFranchiseTranscendantApexYautjaDefeatProtocolSector {
  constructor() {
    this.sectorId = 'PREDATOR_FRANCHISE_TRANSCENDANT_APEX_YAUTJA_DEFEAT_PROTOCOL';
    this.requiredArenaConfig = 'PREDATOR_FRANCHISE_TRANSCENDANT_APEX_SANCTUM';
    this.reset();
  }

  reset() {
    this.protocolArmed = false;
    this.gauntletHatchOpened = false;
    this.transcendantGlyphsEntered = [];
    this.finalRoarEchoed = false;
    this.countdownSeconds = 0;
    this.nuclearDetonationExecuted = false;
    this.honorAwarded = 0;
    this.eventLog = [];
  }

  evaluateDefeatCondition({
    isYautja = false,
    healthPoints = 100,
    arenaConfig = ''
  } = {}) {
    const isHunter = isYautja === true;
    const isDefeated = Number(healthPoints) <= 0;
    const isRightConfig = arenaConfig === this.requiredArenaConfig;

    if (!isHunter) {
      return {
        allowed: false,
        reason: 'FORBIDDEN: Protocol is exclusively reserved for Yautja characters.'
      };
    }
    if (!isDefeated) {
      return {
        allowed: false,
        reason: 'FORBIDDEN: Hunter is still standing; self-destruction requires defeat (HP <= 0).'
      };
    }
    if (!isRightConfig) {
      return {
        allowed: false,
        reason: `FORBIDDEN: Invalid configuration. Expected ${this.requiredArenaConfig}, received ${arenaConfig}.`
      };
    }

    return {
      allowed: true,
      reason: 'AUTHORIZED: All 3 invariant conditions strictly met.'
    };
  }

  armDefeatProtocol({
    isYautja = false,
    healthPoints = 100,
    arenaConfig = ''
  } = {}) {
    const evaluation = this.evaluateDefeatCondition({
      isYautja,
      healthPoints,
      arenaConfig
    });

    if (!evaluation.allowed) {
      throw new Error(`Rule 3 Violation: ${evaluation.reason}`);
    }

    this.protocolArmed = true;
    this.gauntletHatchOpened = true;
    this.eventLog.push({
      step: 'DEFEAT_PROTOCOL_ARMED',
      isYautja,
      healthPoints,
      arenaConfig
    });

    return {
      protocolArmed: true,
      gauntletHatchOpened: true
    };
  }

  enterTranscendantGlyphsSequence({
    glyphs = ['᚛', 'ᚈ', 'ᚑ', 'ᚏ', '᚜']
  } = {}) {
    if (!this.protocolArmed) {
      throw new Error('Must arm defeat protocol before inputting glyph sequence.');
    }
    const requiredGlyphs = ['᚛', 'ᚈ', 'ᚑ', 'ᚏ', '᚜'];
    const valid = Array.isArray(glyphs) &&
      glyphs.length === 5 &&
      glyphs.every((g, idx) => g === requiredGlyphs[idx]);

    if (!valid) {
      throw new Error('Invalid Transcendant glyph sequence.');
    }

    this.transcendantGlyphsEntered = [...glyphs];
    this.eventLog.push({
      step: 'TRANSCENDANT_GLYPHS_ENTERED',
      glyphs: this.transcendantGlyphsEntered
    });

    return {
      transcendantGlyphsEntered: true,
      glyphs: this.transcendantGlyphsEntered
    };
  }

  unleashDefiantLaughterAndRoar({
    laughterDecibels = 139,
    mockeryFrequencyHz = 580
  } = {}) {
    if (!this.transcendantGlyphsEntered || this.transcendantGlyphsEntered.length === 0) {
      throw new Error('Must enter glyph sequence before echoing final roar and mockery laughter.');
    }
    const db = Math.max(0, Number(laughterDecibels) || 0);
    const freq = Math.max(0, Number(mockeryFrequencyHz) || 0);
    this.finalRoarEchoed = db >= 110 && freq >= 350;
    this.eventLog.push({
      step: 'FINAL_ROAR_ECHOED',
      laughterDecibels: db,
      mockeryFrequencyHz: freq,
      finalRoarEchoed: this.finalRoarEchoed
    });

    return {
      finalRoarEchoed: this.finalRoarEchoed
    };
  }

  executeTranscendantMicroNuclearPurge({
    countdownSeconds = 11.0,
    blastRadiusMeters = 100
  } = {}) {
    if (!this.finalRoarEchoed) {
      throw new Error('Must unleash final battle roar before micro-nuclear purge detonation.');
    }
    const cd = Math.max(0, Number(countdownSeconds) || 0);
    const radius = Math.max(0, Number(blastRadiusMeters) || 0);
    this.countdownSeconds = cd;
    this.nuclearDetonationExecuted = cd <= 15 && radius >= 50;

    if (this.nuclearDetonationExecuted) {
      this.honorAwarded = 500;
    }

    this.eventLog.push({
      step: 'NUCLEAR_PURGE_EXECUTED',
      countdownSeconds: cd,
      blastRadiusMeters: radius,
      nuclearDetonationExecuted: this.nuclearDetonationExecuted,
      honorAwarded: this.honorAwarded
    });

    return {
      nuclearDetonationExecuted: this.nuclearDetonationExecuted,
      honorAwarded: this.honorAwarded,
      blastRadiusMeters: radius
    };
  }

  isFullyCompleted() {
    return (
      this.protocolArmed &&
      this.gauntletHatchOpened &&
      this.transcendantGlyphsEntered.length === 5 &&
      this.finalRoarEchoed &&
      this.nuclearDetonationExecuted &&
      this.honorAwarded === 500
    );
  }
}
